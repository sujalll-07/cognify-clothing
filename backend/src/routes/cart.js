import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

// GET /api/cart
router.get('/', async (req, res, next) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' } },
                category: true,
              },
            },
            customization: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: { include: { product: { include: { images: true, category: true } }, customization: true } } },
      });
    }

    res.json({ cart });
  } catch (error) {
    next(error);
  }
});

// POST /api/cart
router.post('/', async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color, customization } = req.body;

    const rawProductId = productId;
    const parsedProductId = typeof rawProductId === 'number' ? rawProductId : parseInt(rawProductId, 10);
    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      return res.status(400).json({ error: 'Valid Product ID is required' });
    }

    const rawQty = quantity;
    const parsedQty = typeof rawQty === 'number' ? rawQty : Number(rawQty);
    if (!Number.isInteger(parsedQty) || parsedQty < 1 || parsedQty > 50) {
      return res.status(400).json({ error: 'Quantity must be an integer between 1 and 50' });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: parsedProductId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.id } });
    }

    let customizationId = null;
    if (customization && typeof customization === 'object') {
      const created = await prisma.customization.create({
        data: {
          productId: parsedProductId,
          color: customization.color ? String(customization.color).slice(0, 50) : null,
          logo: customization.logo ? String(customization.logo).slice(0, 50) : null,
          graphic: customization.graphic ? String(customization.graphic).slice(0, 50) : null,
          customText: customization.customText ? String(customization.customText).slice(0, 100) : null,
          font: customization.font ? String(customization.font).slice(0, 50) : null,
        },
      });
      customizationId = created.id;
    }

    // Check if same product+size+color (without customization) already in cart
    if (!customization) {
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: parsedProductId,
          size: size ? String(size).slice(0, 10) : null,
          color: color ? String(color).slice(0, 30) : null,
          customizationId: null,
        },
      });

      if (existingItem) {
        const newQty = Math.min(50, existingItem.quantity + parsedQty);
        const updated = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQty },
          include: { product: { include: { images: true, category: true } }, customization: true },
        });
        return res.json({ item: updated });
      }
    }

    const item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parsedProductId,
        quantity: parsedQty,
        size: size ? String(size).slice(0, 10) : null,
        color: color ? String(color).slice(0, 30) : null,
        customizationId,
      },
      include: { product: { include: { images: true, category: true } }, customization: true },
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

// PUT /api/cart/:itemId
router.put('/:itemId', async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ error: 'Invalid cart item ID' });
    }

    const { quantity } = req.body;
    const rawQty = quantity;
    const parsedQty = typeof rawQty === 'number' ? rawQty : Number(rawQty);
    if (!Number.isInteger(parsedQty) || parsedQty < 1 || parsedQty > 50) {
      return res.status(400).json({ error: 'Quantity must be an integer between 1 and 50' });
    }

    // Verify the item belongs to this user's cart
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parsedQty },
      include: { product: { include: { images: true, category: true } }, customization: true },
    });

    res.json({ item: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/:itemId
router.delete('/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = await prisma.cartItem.findFirst({
      where: { id: parseInt(itemId), cartId: cart.id },
    });
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    // Delete associated customization if exists
    if (item.customizationId) {
      await prisma.cartItem.delete({ where: { id: parseInt(itemId) } });
      await prisma.customization.delete({ where: { id: item.customizationId } });
    } else {
      await prisma.cartItem.delete({ where: { id: parseInt(itemId) } });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
});

export default router;
import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// POST /api/orders - Transactional order creation with atomic inventory check & decrement
router.post('/', async (req, res, next) => {
  try {
    const { shippingAddress, items } = req.body;

    if (!shippingAddress || (typeof shippingAddress === 'string' && shippingAddress.trim().length === 0)) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain a valid non-empty list of items' });
    }

    if (items.length > 50) {
      return res.status(400).json({ error: 'Order exceeds maximum item limit of 50' });
    }

    // Comprehensive item validation before starting transaction
    const validatedItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item || typeof item !== 'object') {
        return res.status(400).json({ error: `Invalid item format at index ${i}` });
      }

      // Validate Product ID
      const rawProductId = item.productId;
      const productId = typeof rawProductId === 'number' ? rawProductId : parseInt(rawProductId, 10);
      if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({ error: `Invalid productId at item index ${i}` });
      }

      // Strict Quantity Validation (P0: Reject 0, negative, decimal, NaN, non-integers, > 50)
      const rawQty = item.quantity;
      if (rawQty === null || rawQty === undefined || rawQty === '' || typeof rawQty === 'boolean') {
        return res.status(400).json({ error: `Quantity is required for item index ${i}` });
      }

      const quantity = typeof rawQty === 'number' ? rawQty : Number(rawQty);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        return res.status(400).json({ error: `Quantity must be an integer between 1 and 50 for product ID ${productId}` });
      }

      // Sanitize optional customization if provided
      let customization = null;
      if (item.customization && typeof item.customization === 'object') {
        customization = {
          color: item.customization.color ? String(item.customization.color).slice(0, 50) : null,
          logo: item.customization.logo ? String(item.customization.logo).slice(0, 50) : null,
          graphic: item.customization.graphic ? String(item.customization.graphic).slice(0, 50) : null,
          customText: item.customization.customText ? String(item.customization.customText).slice(0, 100) : null,
          font: item.customization.font ? String(item.customization.font).slice(0, 50) : null,
        };
      }

      validatedItems.push({
        productId,
        quantity,
        size: item.size ? String(item.size).slice(0, 10) : null,
        color: item.color ? String(item.color).slice(0, 30) : null,
        customization,
      });
    }

    // Execute atomic transaction for inventory verification, order placement, and stock decrement
    const order = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItems = [];

      for (const item of validatedItems) {
        // Fetch current product state within the transaction
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          const err = new Error(`Product with ID ${item.productId} not found`);
          err.status = 404;
          throw err;
        }

        // P1: Real inventory check
        if (product.stock < item.quantity) {
          const err = new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`);
          err.status = 400;
          throw err;
        }

        // Server-calculated pricing (never trusts client price)
        let basePrice = product.price;
        if (item.customization) {
          if (item.customization.customText) basePrice += 200;
          if (item.customization.graphic && item.customization.graphic !== 'none') basePrice += 150;
        }

        const itemTotal = basePrice * item.quantity;
        total += itemTotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: basePrice,
          size: item.size,
          color: item.color,
          customization: item.customization,
        });

        // P1: Atomic inventory decrement
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Calculate server-side shipping
      const shipping = total > 999 ? 0 : 99;
      total += shipping;

      const formattedAddress = typeof shippingAddress === 'string'
        ? shippingAddress.trim().slice(0, 500)
        : JSON.stringify(shippingAddress).slice(0, 500);

      // Create order record
      const createdOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          total,
          status: 'PENDING',
          paymentMethod: 'COD',
          paymentStatus: 'PENDING',
          shippingAddress: formattedAddress,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { sortOrder: 'asc' } },
                },
              },
            },
          },
        },
      });

      // Clear the user's cart after successful order creation
      const cart = await tx.cart.findUnique({ where: { userId: req.user.id } });
      if (cart) {
        const cartItems = await tx.cartItem.findMany({
          where: { cartId: cart.id },
          select: { customizationId: true },
        });

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        const custIds = cartItems.filter(ci => ci.customizationId).map(ci => ci.customizationId);
        if (custIds.length > 0) {
          await tx.customization.deleteMany({ where: { id: { in: custIds } } });
        }
      }

      return createdOrder;
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders - User orders with pagination
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { sortOrder: 'asc' } },
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/all (Admin only with pagination)
router.get('/all', requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { sortOrder: 'asc' } },
                },
              },
            },
          },
        },
      }),
      prisma.order.count(),
    ]);

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id - Order detail with ownership check
router.get('/:id', async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const where = { id: orderId };
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' } },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
});

// PUT /api/orders/:id (Admin only)
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const { status, paymentStatus } = req.body;

    const allowedStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const allowedPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

    const data = {};
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid order status. Allowed: ${allowedStatuses.join(', ')}` });
      }
      data.status = status;
    }
    if (paymentStatus) {
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ error: `Invalid payment status. Allowed: ${allowedPaymentStatuses.join(', ')}` });
      }
      data.paymentStatus = paymentStatus;
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data,
    });

    res.json({ order });
  } catch (error) {
    next(error);
  }
});

export default router;
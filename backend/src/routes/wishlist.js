import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// GET /api/wishlist
router.get('/', async (req, res, next) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: 'asc' } },
            category: true,
            variants: true,
          },
        },
      },
    });

    res.json({ wishlist });
  } catch (error) {
    next(error);
  }
});

// POST /api/wishlist
router.post('/', async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Toggle: if already in wishlist, remove it
    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return res.json({ message: 'Removed from wishlist', added: false });
    }

    const item = await prisma.wishlist.create({
      data: { userId: req.user.id, productId },
      include: { product: { include: { images: true, category: true, variants: true } } },
    });

    res.status(201).json({ item, added: true });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/wishlist/:productId
router.delete('/:productId', async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Item not in wishlist' });
    }

    await prisma.wishlist.delete({ where: { id: existing.id } });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
});

export default router;
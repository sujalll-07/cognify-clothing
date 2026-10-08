import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

export default router;
import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/products (Admin only with strict validation)
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return res.status(400).json({ error: 'Valid product name is required' });
    }

    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0 || !isFinite(price)) {
      return res.status(400).json({ error: 'Price must be a valid positive number' });
    }

    const categoryId = parseInt(data.categoryId, 10);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({ error: 'Valid categoryId is required' });
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ error: `Category with ID ${categoryId} not found` });
    }

    const rawStock = data.stock !== undefined ? parseInt(data.stock, 10) : 100;
    const stock = Number.isInteger(rawStock) && rawStock >= 0 ? rawStock : 100;

    const slug = (data.slug && typeof data.slug === 'string' && data.slug.trim())
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      : data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const product = await prisma.product.create({
      data: {
        name: data.name.trim().slice(0, 150),
        slug,
        description: data.description ? String(data.description).slice(0, 2000) : '',
        price,
        categoryId,
        stock,
        thumbnailUrl: data.thumbnailUrl ? String(data.thumbnailUrl).slice(0, 500) : null,
        isCustomizable: Boolean(data.isCustomizable),
      },
      include: {
        category: true,
      },
    });
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

// GET /api/products with pagination enforcement (max 50, default 20)
router.get('/', async (req, res, next) => {
  try {
    const { category, sort, search, featured, newArrivals, trending, page, limit } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * take;

    const where = {};

    if (category) {
      where.category = { slug: String(category).trim().toLowerCase() };
    }
    if (search) {
      const searchClean = String(search).trim().slice(0, 100);
      where.OR = [
        { name: { contains: searchClean, mode: 'insensitive' } },
        { description: { contains: searchClean, mode: 'insensitive' } },
      ];
    }
    if (featured === 'true') where.isFeatured = true;
    if (newArrivals === 'true') where.isNewArrival = true;
    if (trending === 'true') where.isTrending = true;

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'name-asc') orderBy = { name: 'asc' };
    if (sort === 'name-desc') orderBy = { name: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: true,
          variants: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    let product;
    const numId = parseInt(id, 10);
    if (!isNaN(numId)) {
      product = await prisma.product.findUnique({
        where: { id: numId },
        include: {
          category: true,
          variants: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
      });
    }
    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: String(id).slice(0, 150) },
        include: {
          category: true,
          variants: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
      });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get related products from same category
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        category: true,
        variants: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    res.json({ product, related });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/category/:category
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const { sort, page, limit } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * take;

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'name-asc') orderBy = { name: 'asc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };

    const where = { category: { slug: String(category).trim().toLowerCase() } };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: true,
          variants: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
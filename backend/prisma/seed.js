import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean the database (delete in reverse order to avoid foreign key constraints)
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const categoriesData = [
    { name: 'Hoodies', slug: 'hoodies' },
    { name: 'Shirts', slug: 'shirts' },
    { name: 'T-Shirts', slug: 'tshirts' },
    { name: 'Jeans', slug: 'jeans' },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      })
    )
  );

  const [hoodiesCategory, shirtsCategory, tshirtsCategory, jeansCategory] = categories;

  // Helper function to create product variants
  const createVariants = (colors, sizes) => {
    const colorNames = ['Black', 'White', 'Grey', 'Navy', 'Blue', 'Red', 'Green', 'Brown', 'Olive', 'Beige', 'Pink', 'Yellow'];
    const variants = [];
    for (let i = 0; i < colors.length; i++) {
      const colorHex = colors[i];
      const colorName = colorNames[i] || `Color ${i + 1}`;
      for (const size of sizes) {
        variants.push({
          color: colorName,
          colorHex: colorHex,
          size,
          stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10 and 60
        });
      }
    }
    return variants;
  };

  // Products data
  const productsData = [
    // Hoodies (isCustomizable: true)
    {
      name: 'Cognify Essential Hoodie',
      slug: 'cognify-essential-hoodie',
      description: 'Premium heavyweight hoodie with classic fit and superior comfort.',
      price: 2999,
      originalPrice: 4999,
      rating: 4.7,
      reviews: 342,
      discount: 40,
      isFeatured: true,
      isNewArrival: false,
      isTrending: true,
      isCustomizable: true,
      material: '80% Cotton, 20% Polyester — 400gsm French Terry',
      care: 'Machine wash cold, tumble dry low',
      modelUrl: '/models/cognify-hoodie.glb',
      category: { connect: { id: hoodiesCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
        'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80',
        'https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=800&q=80',
      ],
      variants: createVariants(['#080808', '#FFFFFF', '#858C72'], ['S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Oversized Hoodie',
      slug: 'cognify-oversized-hoodie',
      description: 'Relaxed oversized fit hoodie for ultimate comfort and style.',
      price: 3499,
      originalPrice: 5999,
      rating: 4.8,
      reviews: 218,
      discount: 42,
      isFeatured: true,
      isNewArrival: true,
      isTrending: false,
      isCustomizable: true,
      material: '100% Organic Cotton — 380gsm',
      care: 'Machine wash cold, tumble dry low',
      modelUrl: '/models/cognify-hoodie.glb',
      category: { connect: { id: hoodiesCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
        'https://images.unsplash.com/photo-1614495967760-9a1b6a9c9e59?w=800&q=80',
        'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800&q=80',
      ],
      variants: createVariants(['#6B7280', '#080808', '#E8E5DC'], ['S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Tech Hoodie',
      slug: 'cognify-tech-hoodie',
      description: 'Performance hoodie with moisture-wicking fabric and ergonomic design.',
      price: 3999,
      originalPrice: 6499,
      rating: 4.6,
      reviews: 156,
      discount: 38,
      isFeatured: false,
      isNewArrival: true,
      isTrending: true,
      isCustomizable: true,
      material: '60% Cotton, 40% Recycled Polyester — Performance Blend',
      care: 'Machine wash cold, tumble dry low',
      modelUrl: '/models/cognify-hoodie.glb',
      category: { connect: { id: hoodiesCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1612731887237-5e1a1c7c6e90?w=800&q=80',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      ],
      variants: createVariants(['#080808', '#1B2A4A'], ['S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Washed Hoodie',
      slug: 'cognify-washed-hoodie',
      description: 'Vintage washed hoodie with soft, broken-in feel.',
      price: 2799,
      originalPrice: 4499,
      rating: 4.5,
      reviews: 289,
      discount: 38,
      isFeatured: false,
      isNewArrival: false,
      isTrending: true,
      isCustomizable: true,
      material: '100% Cotton — Enzyme Washed',
      care: 'Machine wash cold, tumble dry low',
      modelUrl: '/models/cognify-hoodie.glb',
      category: { connect: { id: hoodiesCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      ],
      variants: createVariants(['#2A2A2A', '#9CA3AF', '#858C72'], ['S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Zip-Up Hoodie',
      slug: 'cognify-zip-up-hoodie',
      description: 'Versatile zip-up hoodie perfect for layering and everyday wear.',
      price: 3299,
      originalPrice: 5499,
      rating: 4.4,
      reviews: 174,
      discount: 40,
      isFeatured: true,
      isNewArrival: false,
      isTrending: false,
      isCustomizable: true,
      material: '75% Cotton, 25% Polyester — Midweight Fleece',
      care: 'Machine wash cold, tumble dry low',
      modelUrl: '/models/cognify-hoodie.glb',
      category: { connect: { id: hoodiesCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
        'https://images.unsplash.com/photo-1540328728399-ea70ea6debb1?w=800&q=80',
      ],
      variants: createVariants(['#374151', '#080808', '#FFFFFF'], ['S', 'M', 'L', 'XL', 'XXL']),
    },

    // Shirts (isCustomizable: true)
    {
      name: 'Cognify Linen Shirt',
      slug: 'cognify-linen-shirt',
      description: 'Breathable linen shirt perfect for warm weather and casual elegance.',
      price: 2199,
      originalPrice: 3799,
      rating: 4.6,
      reviews: 198,
      discount: 42,
      isFeatured: true,
      isNewArrival: true,
      isTrending: false,
      isCustomizable: true,
      material: '100% European Linen',
      care: 'Machine wash cold, hang to dry',
      modelUrl: '/models/cognify-shirt.glb',
      category: { connect: { id: shirtsCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
        'https://images.unsplash.com/photo-1587359702344-8ee4b2c21a16?w=800&q=80',
        'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80',
      ],
      variants: createVariants(['#E8E5DC', '#84A98C', '#C4A882'], ['S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Oxford Shirt',
      slug: 'cognify-oxford-shirt',
      description: 'Classic Oxford shirt with button-down collar and timeless appeal.',
      price: 1999,
      originalPrice: 3499,
      rating: 4.5,
      reviews: 312,
      discount: 43,
      isFeatured: false,
      isNewArrival: false,
      isTrending: true,
      isCustomizable: true,
      material: '100% Cotton Oxford Cloth',
      care: 'Machine wash cold, tumble dry low',
      modelUrl: '/models/cognify-shirt.glb',
      category: { connect: { id: shirtsCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
        'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80',
      ],
      variants: createVariants(['#FFFFFF', '#3B82F6', '#F9A8D4'], ['S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Flannel Shirt',
      slug: 'cognify-flannel-shirt',
      description: 'Cozy brushed flannel shirt ideal for layering and casual wear.',
      price: 2499,
      originalPrice: 4199,
      rating: 4.7,
      reviews: 267,
      discount: 40,
      isFeatured: false,
      isNewArrival: true,
      isTrending: false,
      isCustomizable: true,
      material: '100% Brushed Cotton Flannel',
      care: 'Machine wash cold, tumble dry low',
      modelUrl: '/models/cognify-shirt.glb',
      category: { connect: { id: shirtsCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=80',
        'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
      ],
      variants: createVariants(['#B91C1C', '#1D4ED8', '#166534'], ['S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Camp Collar Shirt',
      slug: 'cognify-camp-collar-shirt',
      description: 'Relaxed camp collar shirt with vintage-inspired aesthetic.',
      price: 2299,
      originalPrice: 3899,
      rating: 4.4,
      reviews: 143,
      discount: 41,
      isFeatured: true,
      isNewArrival: false,
      isTrending: true,
      isCustomizable: true,
      material: '55% Linen, 45% Cotton',
      care: 'Machine wash cold, hang to dry',
      modelUrl: '/models/cognify-shirt.glb',
      category: { connect: { id: shirtsCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4b4ad7?w=800&q=80',
        'https://images.unsplash.com/photo-1625910513459-4e7d5f0b22aa?w=800&q=80',
      ],
      variants: createVariants(['#C2704D', '#84A98C', '#E8E5DC'], ['S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Overshirt Jacket',
      slug: 'cognify-overshirt-jacket',
      description: 'Heavyweight overshirt jacket that works as a shirt or light outer layer.',
      price: 3199,
      originalPrice: 5299,
      rating: 4.8,
      reviews: 189,
      discount: 40,
      isFeatured: true,
      isNewArrival: true,
      isTrending: false,
      isCustomizable: true,
      material: '100% Cotton Canvas — 280gsm',
      care: 'Machine wash cold, tumble dry low',
      modelUrl: '/models/cognify-shirt.glb',
      category: { connect: { id: shirtsCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80',
        'https://images.unsplash.com/photo-1592878916395-2e5f2f7e6a1b?w=800&q=80',
      ],
      variants: createVariants(['#858C72', '#B5A685', '#080808'], ['S', 'M', 'L', 'XL', 'XXL']),
    },

    // T-Shirts (isCustomizable: false)
    {
      name: 'Cognify Classic Tee',
      slug: 'cognify-classic-tee',
      description: 'Premium heavyweight tee with perfect fit and exceptional comfort.',
      price: 999,
      originalPrice: 1799,
      rating: 4.6,
      reviews: 523,
      discount: 44,
      isFeatured: true,
      isNewArrival: false,
      isTrending: true,
      isCustomizable: false,
      material: '100% Ring-Spun Cotton — 220gsm Jersey',
      care: 'Machine wash cold, tumble dry low',
      category: { connect: { id: tshirtsCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=800&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      ],
      variants: createVariants(['#080808', '#FFFFFF', '#6B7280', '#858C72'], ['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Graphic Tee — Grid',
      slug: 'cognify-graphic-tee-grid',
      description: 'Modern graphic tee featuring minimalist grid design.',
      price: 1299,
      originalPrice: 2199,
      rating: 4.5,
      reviews: 287,
      discount: 41,
      isFeatured: false,
      isNewArrival: true,
      isTrending: true,
      isCustomizable: false,
      material: '100% Cotton — 240gsm Heavy Jersey',
      care: 'Machine wash cold, tumble dry low',
      category: { connect: { id: tshirtsCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800&q=80',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
      ],
      variants: createVariants(['#080808', '#FFFFFF'], ['S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Longline Tee',
      slug: 'cognify-longline-tee',
      description: 'Extended length tee for layered looks and streetwear style.',
      price: 1199,
      originalPrice: 1999,
      rating: 4.3,
      reviews: 194,
      discount: 40,
      isFeatured: false,
      isNewArrival: false,
      isTrending: false,
      isCustomizable: false,
      material: '95% Cotton, 5% Elastane — 200gsm',
      care: 'Machine wash cold, tumble dry low',
      category: { connect: { id: tshirtsCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4b4ad7?w=800&q=80',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
      ],
      variants: createVariants(['#080808', '#374151', '#E8E5DC'], ['S', 'M', 'L', 'XL', 'XXL']),
    },
    {
      name: 'Cognify Striped Tee',
      slug: 'cognify-striped-tee',
      description: 'Classic striped tee with timeless appeal and versatile styling.',
      price: 1099,
      originalPrice: 1899,
      rating: 4.4,
      reviews: 156,
      discount: 42,
      isFeatured: false,
      isNewArrival: true,
      isTrending: false,
      isCustomizable: false,
      material: '100% Combed Cotton — 200gsm',
      care: 'Machine wash cold, tumble dry low',
      category: { connect: { id: tshirtsCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80',
        'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80',
      ],
      variants: createVariants(['#6B7280', '#1E3A5F'], ['S', 'M', 'L', 'XL', 'XXL']), // Note: Colors are represented as hex for Black/White and Navy/White patterns
    },
    {
      name: 'Cognify Polo Tee',
      slug: 'cognify-polo-tee',
      description: 'Premium polo tee with refined finish and athletic-inspired design.',
      price: 1499,
      originalPrice: 2499,
      rating: 4.6,
      reviews: 234,
      discount: 40,
      isFeatured: true,
      isNewArrival: false,
      isTrending: true,
      isCustomizable: false,
      material: '100% Cotton Piqué — 220gsm',
      care: 'Machine wash cold, tumble dry low',
      category: { connect: { id: tshirtsCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80',
        'https://images.unsplash.com/photo-1622445275992-7a906c77c44a?w=800&q=80',
      ],
      variants: createVariants(['#080808', '#FFFFFF', '#858C72', '#1B2A4A'], ['S', 'M', 'L', 'XL', 'XXL']),
    },

    // Jeans (isCustomizable: false)
    {
      name: 'Cognify Slim Fit Jeans',
      slug: 'cognify-slim-fit-jeans',
      description: 'Modern slim fit jeans with stretch comfort and clean silhouette.',
      price: 2799,
      originalPrice: 4799,
      rating: 4.7,
      reviews: 412,
      discount: 42,
      isFeatured: true,
      isNewArrival: false,
      isTrending: true,
      isCustomizable: false,
      material: '98% Cotton, 2% Elastane — 12oz Denim',
      care: 'Machine wash cold, tumble dry low',
      category: { connect: { id: jeansCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
        'https://images.unsplash.com/photo-1600717535275-0b18ede2f7fc?w=800&q=80',
      ],
      variants: createVariants(['#2C3E7A', '#080808', '#7C8FA6'], ['28', '30', '32', '34', '36', '38']),
    },
    {
      name: 'Cognify Wide Leg Jeans',
      slug: 'cognify-wide-leg-jeans',
      description: 'Relaxed wide leg jeans with vintage-inspired drape and comfort.',
      price: 3099,
      originalPrice: 5299,
      rating: 4.5,
      reviews: 223,
      discount: 42,
      isFeatured: false,
      isNewArrival: true,
      isTrending: false,
      isCustomizable: false,
      material: '100% Cotton — 14oz Raw Denim',
      care: 'Machine wash cold, tumble dry low',
      category: { connect: { id: jeansCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&q=80',
        'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80',
      ],
      variants: createVariants(['#93A4BE', '#4A5568', '#080808'], ['28', '30', '32', '34', '36']),
    },
    {
      name: 'Cognify Distressed Jeans',
      slug: 'cognify-distressed-jeans',
      description: 'Strategically distressed jeans with lived-in aesthetic and stretch comfort.',
      price: 2999,
      originalPrice: 4999,
      rating: 4.4,
      reviews: 178,
      discount: 40,
      isFeatured: false,
      isNewArrival: false,
      isTrending: true,
      isCustomizable: false,
      material: '95% Cotton, 5% Elastane — 10oz Stretch Denim',
      care: 'Machine wash cold, tumble dry low',
      category: { connect: { id: jeansCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&q=80',
        'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80',
      ],
      variants: createVariants(['#93A4BE', '#4A5C8A'], ['28', '30', '32', '34', '36', '38']),
    },
    {
      name: 'Cognify Carpenter Jeans',
      slug: 'cognify-carpenter-jeans',
      description: 'Utility-inspired carpenter jeans with functional details and rugged durability.',
      price: 3299,
      originalPrice: 5599,
      rating: 4.6,
      reviews: 145,
      discount: 41,
      isFeatured: true,
      isNewArrival: true,
      isTrending: false,
      isCustomizable: false,
      material: '100% Cotton — 12oz Twill Denim',
      care: 'Machine wash cold, tumble dry low',
      category: { connect: { id: jeansCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1602810319428-019690571b5b?w=800&q=80',
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
      ],
      variants: createVariants(['#2C3E7A', '#E8E5DC'], ['28', '30', '32', '34', '36']),
    },
    {
      name: 'Cognify Straight Cut Jeans',
      slug: 'cognify-straight-cut-jeans',
      description: 'Timeless straight cut jeans with classic fit and enduring style.',
      price: 2599,
      originalPrice: 4299,
      rating: 4.8,
      reviews: 356,
      discount: 40,
      isFeatured: false,
      isNewArrival: false,
      isTrending: true,
      isCustomizable: false,
      material: '100% Japanese Cotton Denim — 13oz',
      care: 'Machine wash cold, tumble dry low',
      category: { connect: { id: jeansCategory.id } },
      images: [
        'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
      ],
      variants: createVariants(['#2C3E7A', '#080808', '#9CA3AF'], ['28', '30', '32', '34', '36', '38']),
    },
  ];

  // Create products and their variants/images
  for (const productData of productsData) {
    const { variants, images, category, ...product } = productData;

    const createdProduct = await prisma.product.create({
      data: {
        ...product,
        category,
      },
    });

    // Create product images
    if (images && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url, index) => ({
          productId: createdProduct.id,
          url,
          sortOrder: index, // Using sortOrder field from schema
        })),
      });
    }

    // Create product variants
    if (variants && variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((variant) => ({
          productId: createdProduct.id,
          ...variant,
        })),
      });
    }
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'Admin User',
      passwordHash: adminPassword, // Using passwordHash field from schema
      address: '123 Admin Street, New Delhi, India 110001',
      // No role field in schema, so omitting it
    },
  });

  // Create cart for admin user
  await prisma.cart.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
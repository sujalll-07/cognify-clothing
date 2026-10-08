import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import orderRoutes from './routes/orders.js';

// Production Startup Security Check: Enforce strong, non-default JWT secret
const KNOWN_INSECURE_SECRETS = [
  'cognify-clothing-secret-key-change-in-production-2024',
  'secret',
  'jwt-secret',
  'changeme',
  '123456',
  'admin',
];

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32 || KNOWN_INSECURE_SECRETS.includes(jwtSecret)) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL SECURITY ERROR: JWT_SECRET is missing, insecure, or using a known development default. Server cannot start.');
    process.exit(1);
  } else {
    console.warn('SECURITY WARNING: JWT_SECRET is weak or default. Generate a strong 256-bit secret before deploying to production.');
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Disable Express fingerprint banner
app.disable('x-powered-by');

// Security: Helmet HTTP Headers configured for WebGL, 3D Canvas, and static assets
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5173", "ws://localhost:5173"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"], // Defends against Clickjacking
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Cookie Parser & JSON Body Parser with size limits
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// Global API Rate Limiter: 300 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});
app.use('/api', globalLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Cognify Clothing API',
    docs: 'Endpoints are available at /api/*',
    status: 'running' 
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Sanitized Production Error Handler
app.use((err, req, res, next) => {
  // Structured logging for operations and incident response (no passwords/tokens logged)
  console.error('[API ERROR]', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    errorName: err.name,
    errorMessage: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  // Handle known Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with this identifier already exists.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Requested record was not found.' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Referenced related item does not exist.' });
  }

  // Handle explicit status errors (e.g. from route validation)
  const statusCode = err.status || err.statusCode || 500;
  if (statusCode < 500) {
    return res.status(statusCode).json({ error: err.message });
  }

  // Generic sanitized error in production to prevent schema/stack disclosure
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({
    error: isProduction ? 'Internal server error' : (err.message || 'Internal server error'),
  });
});

app.listen(PORT, () => {
  console.log(`Cognify Clothing API running on http://localhost:${PORT}`);
});

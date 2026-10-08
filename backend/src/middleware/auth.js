import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

// In-memory token revocation registry with expiration TTL
const revokedTokens = new Map();

export const revokeToken = (token, exp) => {
  if (!token) return;
  const expiresAt = exp ? exp * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000;
  revokedTokens.set(token, expiresAt);
};

export const isTokenRevoked = (token) => {
  if (!token) return true;
  const expiresAt = revokedTokens.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    revokedTokens.delete(token);
    return false;
  }
  return true;
};

// Periodically clean up expired entries from the revocation registry
setInterval(() => {
  const now = Date.now();
  for (const [t, exp] of revokedTokens.entries()) {
    if (now > exp) revokedTokens.delete(t);
  }
}, 3600000).unref();

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Check HttpOnly cookie first
    if (req.cookies && req.cookies.cognify_token) {
      token = req.cookies.cognify_token;
    }

    // Fall back to Authorization Bearer header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if token has been revoked (e.g. upon logout)
    if (isTokenRevoked(token)) {
      return res.status(401).json({ error: 'Session has been revoked or expired' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    req.tokenExp = decoded.exp;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admin only' });
  }
};

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { seedDatabase } from './seed.js';
import { initMongo } from './db/database.js';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import offerRoutes from './routes/offers.js';
import bannerRoutes from './routes/banners.js';
import enquiryRoutes from './routes/enquiries.js';
import settingsRoutes from './routes/settings.js';
import videoRoutes from './routes/videos.js';
import statsRoutes from './routes/stats.js';
import uploadRoutes from './routes/upload.js';
import seoRoutes from './routes/seo.js';
import customerAuthRoutes from './routes/customerAuth.js';
import reviewsRoutes from './routes/reviews.js';
import trackingRoutes from './routes/tracking.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images
const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
try {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
} catch (e) {
  // Ignored on read-only serverless environments (Vercel)
}
app.use('/uploads', express.static(uploadPath));

let isInitialized = false;
let initPromise = null;

export async function ensureInitialized() {
  if (isInitialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await initMongo();
        await seedDatabase(false);
        isInitialized = true;
      } catch (err) {
        console.error('DB Initialization error:', err);
      }
    })();
  }
  return initPromise;
}

// Middleware to ensure DB is initialized before any API request on serverless (Vercel)
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    await ensureInitialized();
  }
  next();
});

// API Routes
app.use(['/api/admin', '/admin'], authRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/categories', '/categories'], categoryRoutes);
app.use(['/api/offers', '/offers'], offerRoutes);
app.use(['/api/banners', '/banners'], bannerRoutes);
app.use(['/api/enquiries', '/enquiries'], enquiryRoutes);
app.use(['/api/settings', '/settings'], settingsRoutes);
app.use(['/api/videos', '/videos'], videoRoutes);
app.use(['/api/stats', '/stats'], statsRoutes);
app.use(['/api/upload', '/upload'], uploadRoutes);
app.use(['/api/customer', '/customer'], customerAuthRoutes);
app.use(['/api/reviews', '/reviews'], reviewsRoutes);
app.use(['/api/tracking', '/tracking'], trackingRoutes);
app.use('/api', seoRoutes);
app.use('/', seoRoutes);

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Reena Sharma Boutique',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Production: Serve React Client Dist
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Auto seed and start server
async function start() {
  try {
    await initMongo();
    await seedDatabase(false);
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`🌸 Reena Sharma Boutique Server running on http://localhost:${PORT}`);
        console.log(`📦 API available at http://localhost:${PORT}/api`);
        console.log(`🔐 Admin Login at http://localhost:5000/admin/login`);
        console.log(`   Email: admin@reenasharma.com | Password: Admin@12345`);
        console.log(`=======================================================`);
      });
    }
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

start();

export { app };
export default app;

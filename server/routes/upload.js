import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');

try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (e) {
  // Ignored in read-only filesystems
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    cb(null, `${sanitizedBase}_${uniqueSuffix}${ext}`);
  },
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|svg\+xml|svg/;
  const mimeMatch = allowed.test(file.mimetype);
  const extMatch = allowed.test(path.extname(file.originalname).toLowerCase().replace('.', ''));

  if (mimeMatch || extMatch) {
    return cb(null, true);
  }
  cb(new Error('Only JPG, JPEG, PNG, WEBP, and GIF images are allowed.'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter,
});

// Upload Multiple Images (Protected)
router.post('/multiple', authMiddleware, (req, res) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }

    const baseUrl = process.env.RENDER_EXTERNAL_URL || 'https://reena-sharma-boutique.onrender.com';
    const urls = req.files.map((file) => `${baseUrl}/uploads/${file.filename}`);
    
    return res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      urls,
      files: req.files.map((f) => ({
        filename: f.filename,
        originalName: f.originalname,
        size: f.size,
        url: `${baseUrl}/uploads/${f.filename}`,
      })),
    });
  });
});

// Upload Single Image (Protected)
router.post('/single', authMiddleware, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const baseUrl = process.env.RENDER_EXTERNAL_URL || 'https://reena-sharma-boutique.onrender.com';
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    return res.json({
      success: true,
      message: 'Image uploaded successfully',
      url,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url,
      },
    });
  });
});

export default router;

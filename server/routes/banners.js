import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET all banners
router.get('/', (req, res) => {
  try {
    const { activeOnly } = req.query;
    let banners = db.get('banners');

    if (activeOnly === 'true') {
      banners = banners.filter((b) => b.isActive !== false);
    }

    banners.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return res.json({ success: true, banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch banners.' });
  }
});

// CREATE banner (Admin Protected)
router.post('/', authMiddleware, (req, res) => {
  try {
    const {
      title,
      subtitle,
      highlight,
      image,
      ctaText = 'Explore Collection',
      ctaLink = '/shop',
      badge = 'New Season',
      sortOrder = 0,
      isActive = true,
    } = req.body;

    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Banner title and image are required.' });
    }

    const newBanner = db.insert('banners', {
      title,
      subtitle: subtitle || '',
      highlight: highlight || '',
      image,
      ctaText,
      ctaLink,
      badge,
      sortOrder: Number(sortOrder) || 0,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      banner: newBanner,
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    return res.status(500).json({ success: false, message: 'Failed to create banner.' });
  }
});

// UPDATE banner (Admin Protected)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('banners', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Banner not found.' });
    }

    const updates = {
      ...req.body,
      sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : existing.sortOrder,
    };

    const updated = db.updateById('banners', id, updates);

    return res.json({
      success: true,
      message: 'Banner updated successfully',
      banner: updated,
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    return res.status(500).json({ success: false, message: 'Failed to update banner.' });
  }
});

// DELETE banner (Admin Protected)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteById('banners', id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Banner not found.' });
    }

    return res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete banner.' });
  }
});

export default router;

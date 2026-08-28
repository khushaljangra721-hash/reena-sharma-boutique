import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET all offers
router.get('/', (req, res) => {
  try {
    const { activeOnly } = req.query;
    let offers = db.get('offers');

    if (activeOnly === 'true') {
      offers = offers.filter((o) => o.isActive !== false);
    }

    return res.json({ success: true, offers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch offers.' });
  }
});

// CREATE offer (Admin Protected)
router.post('/', authMiddleware, (req, res) => {
  try {
    const {
      title,
      subtitle,
      discount,
      code,
      startDate,
      endDate,
      badgeText,
      bannerImage,
      targetCategory,
      isActive = true,
    } = req.body;

    if (!title || discount === undefined) {
      return res.status(400).json({ success: false, message: 'Offer title and discount are required.' });
    }

    const newOffer = db.insert('offers', {
      title,
      subtitle: subtitle || '',
      discount: Number(discount) || 0,
      code: code || '',
      startDate: startDate || '',
      endDate: endDate || '',
      badgeText: badgeText || `${discount}% OFF`,
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
      targetCategory: targetCategory || 'all',
      isActive: Boolean(isActive),
    });

    return res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      offer: newOffer,
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    return res.status(500).json({ success: false, message: 'Failed to create offer.' });
  }
});

// UPDATE offer (Admin Protected)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('offers', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Offer not found.' });
    }

    const updates = {
      ...req.body,
      discount: req.body.discount !== undefined ? Number(req.body.discount) : existing.discount,
    };

    const updated = db.updateById('offers', id, updates);

    return res.json({
      success: true,
      message: 'Offer updated successfully',
      offer: updated,
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    return res.status(500).json({ success: false, message: 'Failed to update offer.' });
  }
});

// DELETE offer (Admin Protected)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteById('offers', id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Offer not found.' });
    }

    return res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete offer.' });
  }
});

export default router;

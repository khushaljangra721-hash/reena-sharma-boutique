import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET public settings
router.get('/', (req, res) => {
  try {
    const settings = db.getSettings();
    return res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
});

// UPDATE settings (Admin Protected)
router.put('/', authMiddleware, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    return res.json({
      success: true,
      message: 'Website settings updated successfully',
      settings: updated,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
});

export default router;

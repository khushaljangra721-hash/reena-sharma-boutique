import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { authMiddleware, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admins = db.get('admin');
    const admin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Current Admin Info
router.get('/me', authMiddleware, (req, res) => {
  const admins = db.get('admin');
  const admin = admins.find((a) => a.id === req.admin.id);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin account not found.' });
  }

  return res.json({
    success: true,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
});

// Change Password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const admins = db.get('admin');
    const admin = admins.find((a) => a.id === req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    db.updateById('admin', admin.id, { passwordHash: newHash });

    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
});

export default router;

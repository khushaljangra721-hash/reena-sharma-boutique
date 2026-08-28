import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET search order tracking by mobile number or order ID
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide phone number or Order ID.' });
    }

    const query = q.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const orders = db.get('orders') || [];

    const matched = orders.filter((order) => {
      const cleanPhone = (order.phone || '').replace(/[^0-9]/g, '');
      const cleanOrderId = (order.orderId || order.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanPhone.includes(query) || cleanOrderId.includes(query) || (order.customerName || '').toLowerCase().includes(query);
    });

    return res.json({
      success: true,
      orders: matched,
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return res.status(500).json({ success: false, message: 'Failed to track order.' });
  }
});

// Admin get all stitching orders
router.get('/', authMiddleware, (req, res) => {
  try {
    const orders = db.get('orders') || [];
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

// Admin create new stitching order
router.post('/', authMiddleware, (req, res) => {
  try {
    const {
      customerName,
      phone,
      itemDescription,
      stage = 'order_booked',
      expectedDate,
      masterNotes,
      amount,
      advancePaid,
    } = req.body;

    if (!customerName || !phone || !itemDescription) {
      return res.status(400).json({ success: false, message: 'Customer name, phone, and item are required.' });
    }

    const count = (db.get('orders') || []).length + 101;
    const orderId = `RSB-${count}`;

    const newOrder = db.insert('orders', {
      orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      itemDescription: itemDescription.trim(),
      stage,
      expectedDate: expectedDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      masterNotes: masterNotes || '',
      amount: Number(amount) || 0,
      advancePaid: Number(advancePaid) || 0,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create order.' });
  }
});

// Admin update stitching stage
router.put('/:id/stage', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { stage, masterNotes } = req.body;

    const updated = db.updateById('orders', id, {
      stage,
      ...(masterNotes !== undefined ? { masterNotes } : {}),
      updatedAt: new Date().toISOString(),
    });

    return res.json({ success: true, order: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update order stage.' });
  }
});

export default router;

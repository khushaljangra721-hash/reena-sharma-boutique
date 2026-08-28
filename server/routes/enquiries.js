import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper to format WhatsApp message
const createWhatsAppUrl = (phone, text) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

// POST Submit customer enquiry (Public)
router.post('/', (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      productId,
      productName,
      productSku,
      productPrice,
      size,
      color,
      message,
      type = 'product_order', // 'product_order', 'custom_stitching', 'general_inquiry'
    } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and Phone number are required to connect on WhatsApp.',
      });
    }

    const settings = db.getSettings();
    const boutiqueWhatsApp = settings.whatsappNumber || '919467830763';

    const newEnquiry = db.insert('enquiries', {
      customerName,
      phone,
      email: email || '',
      productId: productId || null,
      productName: productName || 'General Boutique Consultation',
      productSku: productSku || 'N/A',
      productPrice: productPrice ? Number(productPrice) : null,
      size: size || 'Standard / Unspecified',
      color: color || 'Standard / Unspecified',
      message: message || '',
      type,
      status: 'new', // new, contacted, confirmed, completed, cancelled
      adminNotes: '',
    });

    // Compose personalized WhatsApp text
    let waMessage = `Hello ${settings.boutiqueName || 'Reena Sharma Boutique'} 👋\n\n`;
    waMessage += `I would like to place an enquiry/order:\n\n`;
    if (productName) waMessage += `👗 Product: ${productName}\n`;
    if (productPrice) waMessage += `💰 Price: ₹${productPrice}\n`;
    if (productSku && productSku !== 'N/A') waMessage += `🏷️ SKU: ${productSku}\n`;
    if (size) waMessage += `📏 Size: ${size}\n`;
    if (color) waMessage += `🎨 Color: ${color}\n`;
    waMessage += `\n👤 Customer Name: ${customerName}\n`;
    waMessage += `📞 Phone: ${phone}\n`;
    if (message) waMessage += `💬 Note: ${message}\n`;
    waMessage += `\nPlease share availability, size/color options and ordering details. Thank you!`;

    const whatsappUrl = createWhatsAppUrl(boutiqueWhatsApp, waMessage);

    return res.status(201).json({
      success: true,
      message: 'Enquiry received! Redirecting to WhatsApp...',
      enquiry: newEnquiry,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return res.status(500).json({ success: false, message: 'Failed to record enquiry.' });
  }
});

// GET all enquiries (Admin Protected)
router.get('/', authMiddleware, (req, res) => {
  try {
    const { status, search } = req.query;
    let enquiries = db.get('enquiries');

    if (status && status !== 'all') {
      enquiries = enquiries.filter((e) => e.status === status);
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      enquiries = enquiries.filter(
        (e) =>
          e.customerName?.toLowerCase().includes(q) ||
          e.phone?.toLowerCase().includes(q) ||
          e.productName?.toLowerCase().includes(q) ||
          e.productSku?.toLowerCase().includes(q)
      );
    }

    // Sort latest first
    enquiries.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return res.json({ success: true, enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch enquiries.' });
  }
});

// UPDATE enquiry status and notes (Admin Protected)
router.put('/:id/status', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const existing = db.findById('enquiries', id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    const updated = db.updateById('enquiries', id, updates);

    return res.json({
      success: true,
      message: 'Enquiry status updated successfully',
      enquiry: updated,
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return res.status(500).json({ success: false, message: 'Failed to update enquiry status.' });
  }
});

// DELETE enquiry (Admin Protected)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteById('enquiries', id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    return res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete enquiry.' });
  }
});

export default router;

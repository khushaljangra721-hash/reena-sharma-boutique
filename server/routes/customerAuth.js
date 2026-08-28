import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'rsb_boutique_customer_jwt_secret_2026';

// Middleware to authenticate customer
export const verifyCustomerToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'लॉगिन आवश्यक है (Customer authentication token required)' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.customerId) {
      return res.status(401).json({ success: false, message: 'अमान्य टोकन (Invalid customer token)' });
    }
    const customer = db.findById('customers', decoded.customerId);
    if (!customer) {
      return res.status(401).json({ success: false, message: 'खाता नहीं मिला (Customer account not found)' });
    }
    req.customer = customer;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'सत्र समाप्त हो गया है, कृपया पुनः लॉगिन करें (Session expired)' });
  }
};

// 1. Customer Registration
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, city, address } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'कृपया नाम, मोबाइल नंबर और पासवर्ड दर्ज करें (Name, phone & password required)',
      });
    }

    const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें (Valid 10-digit phone required)',
      });
    }

    // Check if phone already registered
    const existingCustomer = db.findOne('customers', (c) => c.phone === cleanPhone);
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'यह मोबाइल नंबर पहले से रजिस्टर्ड है। कृपया लॉगिन करें (Phone already registered. Please login)',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCustomer = db.insert('customers', {
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim().toLowerCase() : '',
      password: hashedPassword,
      city: city ? city.trim() : 'Mahendragarh',
      address: address ? address.trim() : '',
      measurements: {
        bust: '',
        waist: '',
        hip: '',
        kurtiLength: '',
        salwarLength: '',
        shoulder: '',
        armhole: '',
        sleeve: '',
        neckFront: '',
        neckBack: '',
      },
      wishlist: [],
      createdAt: new Date().toISOString(),
    });

    // Generate JWT token
    const token = jwt.sign(
      { customerId: newCustomer.id, phone: newCustomer.phone, name: newCustomer.name },
      JWT_SECRET,
      { expiresIn: '90d' }
    );

    const { password: _, ...customerSafe } = newCustomer;

    res.status(201).json({
      success: true,
      message: 'खाता सफलतापूर्वक बन गया! (Account created successfully)',
      token,
      customer: customerSafe,
    });
  } catch (err) {
    console.error('Customer registration error:', err);
    res.status(500).json({ success: false, message: 'रजिस्ट्रेशन में समस्या आई (Registration failed)' });
  }
});

// 2. Customer Login (Phone or Email + Password)
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'कृपया मोबाइल नंबर/ईमेल और पासवर्ड दर्ज करें (Phone/email and password required)',
      });
    }

    const cleanInput = identifier.trim();
    const cleanPhone = cleanInput.replace(/\D/g, '').slice(-10);

    const customer = db.findOne('customers', (c) => {
      if (cleanPhone.length === 10 && c.phone === cleanPhone) return true;
      if (c.email && c.email.toLowerCase() === cleanInput.toLowerCase()) return true;
      return false;
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'गलत मोबाइल नंबर या पासवर्ड (Invalid phone/email or password)',
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'गलत पासवर्ड (Incorrect password)',
      });
    }

    const token = jwt.sign(
      { customerId: customer.id, phone: customer.phone, name: customer.name },
      JWT_SECRET,
      { expiresIn: '90d' }
    );

    const { password: _, ...customerSafe } = customer;

    res.json({
      success: true,
      message: 'सफलतापूर्वक लॉगिन हो गए! (Logged in successfully)',
      token,
      customer: customerSafe,
    });
  } catch (err) {
    console.error('Customer login error:', err);
    res.status(500).json({ success: false, message: 'लॉगिन में समस्या आई (Login failed)' });
  }
});

// 3. Get Current Customer Profile & Order History
router.get('/me', verifyCustomerToken, (req, res) => {
  try {
    const customer = req.customer;
    const { password, ...customerSafe } = customer;

    // Fetch customer's enquiries / orders
    const allEnquiries = db.get('enquiries');
    const myEnquiries = allEnquiries.filter(
      (e) => e.phone === customer.phone || (customer.email && e.email === customer.email)
    );

    res.json({
      success: true,
      customer: customerSafe,
      enquiries: myEnquiries,
    });
  } catch (err) {
    console.error('Get customer profile error:', err);
    res.status(500).json({ success: false, message: 'प्रोफाइल लोड नहीं हो सका' });
  }
});

// 4. Update Profile Details
router.put('/profile', verifyCustomerToken, (req, res) => {
  try {
    const { name, email, city, address } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (email !== undefined) updates.email = email.trim().toLowerCase();
    if (city !== undefined) updates.city = city.trim();
    if (address !== undefined) updates.address = address.trim();

    const updatedCustomer = db.updateById('customers', req.customer.id, updates);
    const { password, ...customerSafe } = updatedCustomer;

    res.json({
      success: true,
      message: 'प्रोफाइल अपडेट हो गई (Profile updated)',
      customer: customerSafe,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'अपडेट असफल रहा' });
  }
});

// 5. Update Saved Measurements (नाप कार्ड)
router.put('/measurements', verifyCustomerToken, (req, res) => {
  try {
    const { measurements } = req.body;

    const updatedCustomer = db.updateById('customers', req.customer.id, {
      measurements: {
        ...req.customer.measurements,
        ...measurements,
      },
    });

    const { password, ...customerSafe } = updatedCustomer;

    res.json({
      success: true,
      message: 'नाप सफलतापूर्वक सेव हो गया! (Measurements saved successfully)',
      customer: customerSafe,
    });
  } catch (err) {
    console.error('Update measurements error:', err);
    res.status(500).json({ success: false, message: 'नाप सेव नहीं हो सका' });
  }
});

export default router;

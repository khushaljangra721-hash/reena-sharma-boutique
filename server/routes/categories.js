import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// GET all categories
router.get('/', (req, res) => {
  try {
    const { includeInactive } = req.query;
    let categories = db.get('categories');

    if (includeInactive !== 'true') {
      categories = categories.filter((c) => c.isActive !== false);
    }

    // Sort by sortOrder
    categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Attach product count to each category
    const products = db.get('products').filter((p) => p.isActive !== false);
    const withCount = categories.map((cat) => {
      const count = products.filter(
        (p) =>
          p.category?.toLowerCase() === cat.name?.toLowerCase() ||
          p.categorySlug?.toLowerCase() === cat.slug?.toLowerCase()
      ).length;
      return { ...cat, productCount: count };
    });

    return res.json({ success: true, categories: withCount });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
});

// CREATE category (Admin Protected)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, description, image, sortOrder = 0, isActive = true } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = req.body.slug || slugify(name);
    const newCategory = db.insert('categories', {
      name,
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      sortOrder: Number(sortOrder) || 0,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
});

// UPDATE category (Admin Protected)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('categories', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const updates = {
      ...req.body,
      sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : existing.sortOrder,
    };

    if (req.body.name && !req.body.slug) {
      updates.slug = slugify(req.body.name);
    }

    const updated = db.updateById('categories', id, updates);

    return res.json({
      success: true,
      message: 'Category updated successfully',
      category: updated,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
});

// DELETE category (Admin Protected)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteById('categories', id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
});

export default router;

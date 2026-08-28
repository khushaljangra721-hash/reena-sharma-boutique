import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;
};

// GET all products with rich filtering, searching, sorting and pagination
router.get('/', (req, res) => {
  try {
    const {
      category,
      categorySlug,
      search,
      minPrice,
      maxPrice,
      size,
      color,
      fabric,
      featured,
      trending,
      newArrival,
      onOffer,
      stockStatus,
      sort,
      includeInactive,
      page = 1,
      limit = 50,
    } = req.query;

    let products = db.get('products');

    // Filter by active status unless requested by admin
    if (includeInactive !== 'true') {
      products = products.filter((p) => p.isActive !== false);
    }

    // Category filter
    if (category && category !== 'all' && category !== 'All') {
      products = products.filter(
        (p) =>
          p.category?.toLowerCase() === category.toLowerCase() ||
          p.categorySlug?.toLowerCase() === category.toLowerCase()
      );
    }

    if (categorySlug && categorySlug !== 'all') {
      products = products.filter((p) => p.categorySlug?.toLowerCase() === categorySlug.toLowerCase());
    }

    // Search filter (name, description, sku, fabric, tags)
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      products = products.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.fabric?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Price range filter
    if (minPrice) {
      products = products.filter((p) => (p.salePrice || p.originalPrice) >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => (p.salePrice || p.originalPrice) <= Number(maxPrice));
    }

    // Size filter
    if (size) {
      products = products.filter((p) => Array.isArray(p.sizes) && p.sizes.includes(size));
    }

    // Color filter
    if (color) {
      products = products.filter(
        (p) =>
          Array.isArray(p.colors) &&
          p.colors.some((c) => c.toLowerCase() === color.toLowerCase())
      );
    }

    // Fabric filter
    if (fabric) {
      products = products.filter((p) => p.fabric?.toLowerCase().includes(fabric.toLowerCase()));
    }

    // Stock Status
    if (stockStatus && stockStatus !== 'all') {
      products = products.filter((p) => p.stockStatus === stockStatus);
    }

    // Toggles
    if (featured === 'true') {
      products = products.filter((p) => p.isFeatured === true);
    }
    if (trending === 'true') {
      products = products.filter((p) => p.isTrending === true);
    }
    if (newArrival === 'true') {
      products = products.filter((p) => p.isNewArrival === true);
    }
    if (onOffer === 'true') {
      products = products.filter((p) => p.isOnOffer === true);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        products.sort((a, b) => (a.salePrice || a.originalPrice) - (b.salePrice || b.originalPrice));
        break;
      case 'price_desc':
        products.sort((a, b) => (b.salePrice || b.originalPrice) - (a.salePrice || a.originalPrice));
        break;
      case 'popular':
        products.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
        break;
      case 'discount_desc':
        products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'latest':
      default:
        products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    const total = products.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = products.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      products: paginated,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

// GET single product by slug or id + related products
router.get('/:slugOrId', (req, res) => {
  try {
    const { slugOrId } = req.params;
    let product = db.findOne('products', (p) => p.slug === slugOrId || String(p.id) === String(slugOrId));

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Find related products in same category
    const related = db
      .find(
        'products',
        (p) =>
          p.id !== product.id &&
          p.isActive !== false &&
          (p.category === product.category || p.categorySlug === product.categorySlug)
      )
      .slice(0, 4);

    return res.json({
      success: true,
      product,
      related,
    });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
  }
});

// CREATE new product (Admin Protected)
router.post('/', authMiddleware, (req, res) => {
  try {
    const {
      name,
      category,
      categorySlug,
      description,
      originalPrice,
      salePrice,
      discount,
      images,
      sizes,
      colors,
      fabric,
      sku,
      stockStatus = 'in_stock',
      isFeatured = false,
      isNewArrival = true,
      isTrending = false,
      isOnOffer = false,
      isActive = true,
    } = req.body;

    if (!name || !originalPrice || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, original price, and category are required.',
      });
    }

    const orig = Number(originalPrice);
    const sale = salePrice ? Number(salePrice) : orig;
    const calcDiscount = discount !== undefined && discount !== null && discount !== ''
      ? Number(discount)
      : orig > sale
      ? Math.round(((orig - sale) / orig) * 100)
      : 0;

    const slug = req.body.slug || generateSlug(name);
    const catSlug = categorySlug || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const genSku = sku || `RSB-${catSlug.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = db.insert('products', {
      name,
      slug,
      category,
      categorySlug: catSlug,
      description: description || '',
      originalPrice: orig,
      salePrice: sale,
      discount: calcDiscount,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL', 'Custom Measurement'],
      colors: Array.isArray(colors) && colors.length > 0 ? colors : ['Standard Boutique Color'],
      fabric: fabric || 'Premium Boutique Quality',
      sku: genSku,
      stockStatus,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isTrending: Boolean(isTrending),
      isOnOffer: Boolean(isOnOffer),
      isActive: Boolean(isActive),
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

// UPDATE product (Admin Protected)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('products', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const orig = req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : existing.originalPrice;
    const sale = req.body.salePrice !== undefined ? Number(req.body.salePrice) : existing.salePrice;
    let disc = req.body.discount !== undefined ? Number(req.body.discount) : existing.discount;

    if (req.body.originalPrice !== undefined || req.body.salePrice !== undefined) {
      if (orig > sale && (!req.body.discount || req.body.discount === 0)) {
        disc = Math.round(((orig - sale) / orig) * 100);
      }
    }

    const updates = {
      ...req.body,
      originalPrice: orig,
      salePrice: sale,
      discount: disc,
    };

    if (req.body.category && !req.body.categorySlug) {
      updates.categorySlug = req.body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const updated = db.updateById('products', id, updates);

    return res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

// TOGGLE status fields (Admin Protected)
router.patch('/:id/toggle', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { field } = req.body; // e.g. 'isActive', 'isFeatured', 'isNewArrival', 'isTrending', 'isOnOffer'

    const product = db.findById('products', id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const allowedFields = ['isActive', 'isFeatured', 'isNewArrival', 'isTrending', 'isOnOffer'];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid toggle field.' });
    }

    const updated = db.updateById('products', id, {
      [field]: !product[field],
    });

    return res.json({
      success: true,
      message: `${field} updated`,
      product: updated,
    });
  } catch (error) {
    console.error('Error toggling product field:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle product status.' });
  }
});

// DELETE product (Admin Protected)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteById('products', id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

export default router;

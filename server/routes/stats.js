import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET Admin Dashboard Statistics
router.get('/', authMiddleware, (req, res) => {
  try {
    const products = db.get('products');
    const categories = db.get('categories');
    const offers = db.get('offers');
    const enquiries = db.get('enquiries');
    const banners = db.get('banners');
    const videos = db.get('videos');

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.isActive !== false).length;
    const onOfferProducts = products.filter((p) => p.isOnOffer === true).length;
    const featuredProducts = products.filter((p) => p.isFeatured === true).length;
    const newArrivals = products.filter((p) => p.isNewArrival === true).length;
    const trendingProducts = products.filter((p) => p.isTrending === true).length;

    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
    const contactedEnquiries = enquiries.filter((e) => e.status === 'contacted').length;
    const confirmedEnquiries = enquiries.filter((e) => e.status === 'confirmed').length;
    const completedEnquiries = enquiries.filter((e) => e.status === 'completed').length;
    const cancelledEnquiries = enquiries.filter((e) => e.status === 'cancelled').length;

    // Recent 6 enquiries
    const recentEnquiries = [...enquiries]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6);

    // Recent 5 products
    const recentProducts = [...products]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    // Category breakdown
    const categoryStats = categories.map((cat) => ({
      name: cat.name,
      count: products.filter(
        (p) =>
          p.category?.toLowerCase() === cat.name?.toLowerCase() ||
          p.categorySlug?.toLowerCase() === cat.slug?.toLowerCase()
      ).length,
    }));

    return res.json({
      success: true,
      stats: {
        products: {
          total: totalProducts,
          active: activeProducts,
          onOffer: onOfferProducts,
          featured: featuredProducts,
          newArrivals,
          trending: trendingProducts,
        },
        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
          contacted: contactedEnquiries,
          confirmed: confirmedEnquiries,
          completed: completedEnquiries,
          cancelled: cancelledEnquiries,
        },
        categoriesCount: categories.length,
        offersCount: offers.filter((o) => o.isActive !== false).length,
        bannersCount: banners.filter((b) => b.isActive !== false).length,
        videosCount: videos.filter((v) => v.isActive !== false).length,
        recentEnquiries,
        recentProducts,
        categoryStats,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch statistics.' });
  }
});

export default router;

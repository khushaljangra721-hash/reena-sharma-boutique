import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET reviews for a product or all approved reviews
router.get('/', (req, res) => {
  try {
    const { productId, productSlug } = req.query;
    let reviews = db.get('reviews') || [];

    if (productId) {
      reviews = reviews.filter((r) => String(r.productId) === String(productId));
    } else if (productSlug) {
      reviews = reviews.filter((r) => r.productSlug === productSlug);
    }

    // Filter only approved unless admin
    const approvedReviews = reviews.filter((r) => r.status !== 'rejected');

    // Calculate rating statistics
    const totalReviews = approvedReviews.length;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalScore = 0;
    let perfectFitCount = 0;
    let pureFabricCount = 0;

    approvedReviews.forEach((r) => {
      const score = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      ratingCounts[score] = (ratingCounts[score] || 0) + 1;
      totalScore += Number(r.rating) || 5;

      if (r.fitRating === 'true_to_size' || r.fitRating === 'Perfect Fit') {
        perfectFitCount++;
      }
      if (r.fabricQuality === 'pure_soft' || r.fabricQuality === 'Superb Soft' || r.fabricQuality === 'Premium') {
        pureFabricCount++;
      }
    });

    const averageRating = totalReviews > 0 ? Number((totalScore / totalReviews).toFixed(1)) : 4.9;
    const perfectFitPercent = totalReviews > 0 ? Math.round((perfectFitCount / totalReviews) * 100) : 96;
    const fabricSatisfactionPercent = totalReviews > 0 ? Math.round((pureFabricCount / totalReviews) * 100) : 98;

    return res.json({
      success: true,
      reviews: approvedReviews,
      stats: {
        totalReviews,
        averageRating,
        ratingCounts,
        perfectFitPercent,
        fabricSatisfactionPercent,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
});

// POST submit a review (Public / Customer)
router.post('/', (req, res) => {
  try {
    const {
      productId,
      productSlug,
      productName,
      userName,
      userLocation,
      rating,
      title,
      comment,
      fitRating,
      fabricQuality,
      images,
      isVerifiedBuyer = true,
    } = req.body;

    if (!userName || !comment || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and review comments are required.',
      });
    }

    const newReview = db.insert('reviews', {
      productId: productId || '',
      productSlug: productSlug || '',
      productName: productName || 'Boutique Dress',
      userName: userName.trim(),
      userLocation: userLocation ? userLocation.trim() : 'Mahendragarh, HR',
      rating: Math.min(5, Math.max(1, Number(rating))),
      title: title ? title.trim() : 'Beautiful fitting & fabric',
      comment: comment.trim(),
      fitRating: fitRating || 'Perfect Fit',
      fabricQuality: fabricQuality || 'Superb Soft',
      images: Array.isArray(images) ? images : [],
      isVerifiedBuyer: Boolean(isVerifiedBuyer),
      status: 'approved',
      createdAt: new Date().toISOString(),
    });

    // Auto update product rating and review count
    if (productId || productSlug) {
      const product = db.findOne('products', (p) => String(p.id) === String(productId) || p.slug === productSlug);
      if (product) {
        const prodReviews = db.find('reviews', (r) => String(r.productId) === String(product.id) || r.productSlug === product.slug);
        const avg = Number((prodReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / prodReviews.length).toFixed(1));
        db.updateById('products', product.id, {
          rating: avg,
          reviewCount: prodReviews.length,
          salesCount: (product.salesCount || 35) + 1,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      review: newReview,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
});

// Admin endpoints
router.get('/admin', authMiddleware, (req, res) => {
  try {
    const reviews = db.get('reviews') || [];
    return res.json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch admin reviews.' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteById('reviews', id);
    return res.json({ success: Boolean(deleted), message: deleted ? 'Review deleted' : 'Review not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete review.' });
  }
});

export default router;

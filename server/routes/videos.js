import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET videos
router.get('/', (req, res) => {
  try {
    const { activeOnly } = req.query;
    let videos = db.get('videos');

    if (activeOnly === 'true') {
      videos = videos.filter((v) => v.isActive !== false);
    }

    videos.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return res.json({ success: true, videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch videos.' });
  }
});

// CREATE video (Admin Protected)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, youtubeUrl, videoId, thumbnail, type = 'short', sortOrder = 0, isActive = true } = req.body;

    if (!title || (!youtubeUrl && !videoId)) {
      return res.status(400).json({ success: false, message: 'Title and YouTube URL or Video ID are required.' });
    }

    // Extract video ID if full URL provided
    let extractedId = videoId;
    if (!extractedId && youtubeUrl) {
      const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      extractedId = match ? match[1] : '';
    }

    const newVideo = db.insert('videos', {
      title,
      youtubeUrl: youtubeUrl || `https://www.youtube.com/watch?v=${extractedId}`,
      videoId: extractedId,
      thumbnail: thumbnail || (extractedId ? `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg` : ''),
      type,
      sortOrder: Number(sortOrder) || 0,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({
      success: true,
      message: 'Video added successfully',
      video: newVideo,
    });
  } catch (error) {
    console.error('Error adding video:', error);
    return res.status(500).json({ success: false, message: 'Failed to add video.' });
  }
});

// UPDATE video (Admin Protected)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('videos', id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }

    let updates = {
      ...req.body,
      sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : existing.sortOrder,
    };

    if (req.body.youtubeUrl && !req.body.videoId) {
      const match = req.body.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) {
        updates.videoId = match[1];
        if (!updates.thumbnail) {
          updates.thumbnail = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        }
      }
    }

    const updated = db.updateById('videos', id, updates);

    return res.json({
      success: true,
      message: 'Video updated successfully',
      video: updated,
    });
  } catch (error) {
    console.error('Error updating video:', error);
    return res.status(500).json({ success: false, message: 'Failed to update video.' });
  }
});

// DELETE video (Admin Protected)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteById('videos', id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }

    return res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete video.' });
  }
});

export default router;

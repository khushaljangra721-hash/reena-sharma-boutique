import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Dynamic Sitemap
router.get('/sitemap.xml', (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const products = db.get('products').filter((p) => p.isActive !== false);
    const categories = db.get('categories').filter((c) => c.isActive !== false);

    const staticPages = [
      '',
      '/shop',
      '/categories',
      '/offers',
      '/bridal',
      '/new-arrivals',
      '/custom-designs',
      '/videos',
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms',
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    staticPages.forEach((path) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${path}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${path === '' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Categories
    categories.forEach((cat) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/category/${cat.slug}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // Products
    products.forEach((prod) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/product/${prod.slug}</loc>\n`;
      xml += `    <lastmod>${(prod.updatedAt || prod.createdAt || new Date().toISOString()).split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return res.status(500).send('Error generating sitemap');
  }
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const txt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  return res.send(txt);
});

export default router;

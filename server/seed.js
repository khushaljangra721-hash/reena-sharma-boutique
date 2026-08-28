import bcrypt from 'bcryptjs';
import { db } from './db/database.js';

export async function seedDatabase(force = false) {
  console.log('🌸 Initializing Reena Sharma Boutique with ONLY the 6 core boutique categories...');

  // 1. Admin Account (Kept in backend for security & management)
  const passwordHash = await bcrypt.hash('Admin@12345', 10);
  const admins = [
    {
      id: 'admin_master_1',
      name: 'Reena Sharma (Owner & Chief Designer)',
      email: 'admin@reenasharma.com',
      passwordHash,
      role: 'superadmin',
      createdAt: new Date().toISOString(),
    },
  ];
  db.setCollection('admin', admins);

  // 2. Boutique Settings
  const settings = {
    boutiqueName: 'Reena Sharma Boutique',
    tagline: 'Modern Designs. Elegant Styles. Made for You.',
    subTagline: 'Destination for latest suits, lehengas, kurtas, saree blouses & summer wear on YouTube @Rehan09-wtr in Mahendragarh, Haryana.',
    logoUrl: '/logo-icon.svg',
    whatsappNumber: '919467830763',
    phoneNumber: '+91 94678 30763',
    altPhoneNumber: '+91 98765 43210',
    email: 'info@reenasharmaboutique.com',
    location: 'Mahendragarh, Haryana 123029, India',
    fullAddress: '748Q+R37, Mahendergarh - Budeen Rd, Mohlla Khatikan, Mahendragarh, Haryana 123029',
    address: 'Mahendergarh - Budeen Rd, Mohlla Khatikan',
    city: 'Mahendragarh',
    state: 'Haryana',
    pincode: '123029',
    plusCode: '748Q+R37, Mahendragarh, Haryana',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=748Q%2BR37,+Mahendergarh+-+Budeen+Rd,+Mohlla+Khatikan,+Mahendragarh,+Haryana+123029',
    googleMapsEmbedUrl: 'https://maps.google.com/maps?q=748Q%2BR37,+Mahendergarh+-+Budeen+Rd,+Mohlla+Khatikan,+Mahendragarh,+Haryana+123029&t=&z=16&ie=UTF8&iwloc=&output=embed',
    youtubeUrl: 'https://www.youtube.com/@Rehan09-wtr',
    youtubeHandle: '@Rehan09-wtr',
    instagramUrl: 'https://www.instagram.com/reenasharma1854/?utm_source=ig_web_button_share_sheet',
    facebookUrl: 'https://www.facebook.com/rehan.jangra.5',
    storeTimings: 'सोमवार – शनिवार: 10:00 AM – 8:30 PM | रविवार: अपॉइंटमेंट अनुसार',
    announcementText: '🌸 राम राम जी! रीना शर्मा बुटीक महेंद्रगढ़ • ऑर्डर व सिलाई के लिए WhatsApp करें 🌸',
    aboutStory: `रीना शर्मा बुटीक, महेंद्रगढ़ (हरियाणा) में आपका स्वागत है। हम फर्शी सलवार सूट, ब्राइडल लहंगे, पैडेड डिजाइनर साड़ी ब्लाउज, और कुर्ती सेट्स के लिए प्रसिद्ध हैं।

यूट्यूब चैनल @Rehan09-wtr पर दिखाए जाने वाले सभी डिजाइन्स और कस्टम सिलाई हमारे बुटीक में 100% परफेक्ट फिटिंग के साथ उपलब्ध हैं।`,
    currencySymbol: '₹',
    currencyCode: 'INR',
  };
  db.updateSettings(settings);

  // 3. ONLY The 6 Requested Categories
  const categories = [
    {
      id: 'cat_suits',
      name: 'Suits',
      slug: 'suits',
      description: 'Trending Farshi salwar suits, sharara sets, Pakistani style suits and tailored salwar kameez.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'cat_lehenga',
      name: 'Lehenga',
      slug: 'lehenga',
      description: 'Bridal velvet lehengas, festive party lehenga cholis with can-can layering and heavy dupattas.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 'cat_saree_blouse',
      name: 'Saree Blouse',
      slug: 'saree-blouse',
      description: 'Padded designer blouses, deep sweetheart necks, boat necks, Banarasi brocade and handcrafted latkans.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 'cat_kurta',
      name: 'Kurta',
      slug: 'kurta',
      description: 'Inner kurti with straight pants, mandarin collar neck kurtas, and elegant everyday kurtis.',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: 'cat_summer_wear',
      name: 'Summer Wear',
      slug: 'summer-wear',
      description: 'Pure mulmul cotton Anarkalis, breathable cambric kurtas, light linen suits and daily wear.',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
      sortOrder: 5,
      isActive: true,
    },
    {
      id: 'cat_latest_designs',
      name: 'Latest Designs',
      slug: 'latest-designs',
      description: 'New arrivals & viral YouTube stitching designs straight from @Rehan09-wtr.',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      sortOrder: 6,
      isActive: true,
    },
  ];
  db.setCollection('categories', categories);

  // 4. Products for the 6 Categories
  const products = [
    // --- SUITS ---
    {
      id: 'prod_suit_1',
      name: 'Farshi Salwar Suit with Gota Patti Kurti',
      slug: 'farshi-salwar-suit-with-gota-patti-kurti',
      category: 'Suits',
      categorySlug: 'suits',
      description: 'Viral Farshi Salwar Suit design featured on YouTube @Rehan09-wtr! Flared floor-skimming farshi salwar, straight short kurti with gold gota patti yoke, and pure chiffon dupatta.',
      originalPrice: 4999,
      salePrice: 3699,
      discount: 26,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Measurement'],
      colors: ['Pastel Peach', 'Mint Green', 'Powder Blue', 'Rani Pink'],
      fabric: 'Pure Viscose Georgette with Shantoon Lining',
      sku: 'RSB-ST-001',
      stockStatus: 'in_stock',
      isFeatured: true,
      isNewArrival: true,
      isTrending: true,
      isOnOffer: true,
      isActive: true,
      createdAt: '2026-08-27T08:00:00.000Z',
    },
    {
      id: 'prod_suit_2',
      name: 'Tiered Sharara Suit with Mirror & Zari Work',
      slug: 'tiered-sharara-suit-with-mirror-zari-work',
      category: 'Suits',
      categorySlug: 'suits',
      description: '3-tier flared sharara with gold mirror border and matching peplum kurti. Tailored for weddings and festive functions.',
      originalPrice: 5499,
      salePrice: 3999,
      discount: 27,
      images: [
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: ['S', 'M', 'L', 'XL', 'Custom Fit'],
      colors: ['Mustard Yellow', 'Royal Maroon', 'Emerald Green'],
      fabric: 'Silk Georgette with Shantoon Lining',
      sku: 'RSB-ST-002',
      stockStatus: 'in_stock',
      isFeatured: true,
      isNewArrival: false,
      isTrending: true,
      isOnOffer: true,
      isActive: true,
      createdAt: '2026-08-26T10:00:00.000Z',
    },

    // --- LEHENGA ---
    {
      id: 'prod_lh_1',
      name: 'Royal Crimson Velvet Bridal Lehenga Set',
      slug: 'royal-crimson-velvet-bridal-lehenga-set',
      category: 'Lehenga',
      categorySlug: 'lehenga',
      description: 'Grand royal crimson red micro velvet bridal lehenga handcrafted with antique gold zardozi, dabka, and micro-sequin work. Comes with padded blouse and dual dupattas.',
      originalPrice: 28999,
      salePrice: 21999,
      discount: 24,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'Custom Bridal Fitting'],
      colors: ['Royal Crimson Red', 'Deep Maroon'],
      fabric: 'Pure Micro Velvet with Soft Can-Can & Raw Silk Lining',
      sku: 'RSB-LH-001',
      stockStatus: 'in_stock',
      isFeatured: true,
      isNewArrival: true,
      isTrending: true,
      isOnOffer: true,
      isActive: true,
      createdAt: '2026-08-20T10:00:00.000Z',
    },
    {
      id: 'prod_lh_2',
      name: 'Pastel Floral Organza Sangeet Lehenga Choli',
      slug: 'pastel-floral-organza-sangeet-lehenga-choli',
      category: 'Lehenga',
      categorySlug: 'lehenga',
      description: 'Lightweight dreamy floral organza lehenga with mirror-embellished sweetheart choli and scalloped organza dupatta.',
      originalPrice: 9999,
      salePrice: 6999,
      discount: 30,
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: ['S', 'M', 'L', 'Custom Size'],
      colors: ['Dusty Rose', 'Lavender', 'Mint Ivory'],
      fabric: 'Premium Sheer Organza with Satin Underskirt',
      sku: 'RSB-LH-002',
      stockStatus: 'in_stock',
      isFeatured: false,
      isNewArrival: true,
      isTrending: true,
      isOnOffer: false,
      isActive: true,
      createdAt: '2026-08-25T12:00:00.000Z',
    },

    // --- SAREE BLOUSE ---
    {
      id: 'prod_bl_1',
      name: 'Padded Sweetheart Neckline Designer Blouse (YouTube Special)',
      slug: 'padded-sweetheart-neckline-designer-blouse',
      category: 'Saree Blouse',
      categorySlug: 'saree-blouse',
      description: 'As featured on YouTube @Rehan09-wtr! Perfect boutique fitting padded blouse with sweetheart front cut, deep back neck cutout, and handmade heavy latkan tassels.',
      originalPrice: 3499,
      salePrice: 2499,
      discount: 29,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: ['32', '34', '36', '38', '40', '42', 'Custom Stitching'],
      colors: ['Maroon Velvet', 'Gold Brocade', 'Ruby Red', 'Peacock Blue'],
      fabric: 'Pure Silk Velvet with Zari & Padded Lining',
      sku: 'RSB-BL-001',
      stockStatus: 'in_stock',
      isFeatured: true,
      isNewArrival: true,
      isTrending: true,
      isOnOffer: true,
      isActive: true,
      createdAt: '2026-08-27T10:00:00.000Z',
    },
    {
      id: 'prod_bl_2',
      name: 'Handcrafted Latkan & Dori Banarasi Saree Blouse',
      slug: 'handcrafted-latkan-dori-banarasi-saree-blouse',
      category: 'Saree Blouse',
      categorySlug: 'saree-blouse',
      description: 'Royal Banarasi silk saree blouse with statement handcrafted multi-tier fabric latkans, gold dori criss-cross tie back, and elbow sleeves.',
      originalPrice: 2899,
      salePrice: 1999,
      discount: 31,
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: ['34', '36', '38', '40', '42', 'Custom Fitting'],
      colors: ['Antique Gold', 'Rani Pink', 'Emerald Green', 'Royal Navy'],
      fabric: 'Pure Banarasi Brocade with Cotton Lining',
      sku: 'RSB-BL-002',
      stockStatus: 'in_stock',
      isFeatured: true,
      isNewArrival: true,
      isTrending: true,
      isOnOffer: true,
      isActive: true,
      createdAt: '2026-08-26T09:00:00.000Z',
    },

    // --- KURTA ---
    {
      id: 'prod_kr_1',
      name: 'Inner Kurti with Straight Cigarette Pants Set',
      slug: 'inner-kurti-with-straight-cigarette-pants-set',
      category: 'Kurta',
      categorySlug: 'kurta',
      description: 'Signature boutique cut inner kurti set with structured front, attached soft inner lining, side slit detailing, and matching tailored cigarette pants.',
      originalPrice: 3299,
      salePrice: 2299,
      discount: 30,
      images: [
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: ['36', '38', '40', '42', '44', 'Custom Fit'],
      colors: ['Ivory Cream', 'Sage Green', 'Dusty Rose', 'Sky Blue'],
      fabric: 'Handwoven Chanderi Silk with Mulmul Inner',
      sku: 'RSB-KR-001',
      stockStatus: 'in_stock',
      isFeatured: true,
      isNewArrival: true,
      isTrending: true,
      isOnOffer: true,
      isActive: true,
      createdAt: '2026-08-26T14:00:00.000Z',
    },
    {
      id: 'prod_kr_2',
      name: 'Mandarin Collar Neck Designer Kurti with Lace Pattern',
      slug: 'mandarin-collar-neck-designer-kurti-with-lace-pattern',
      category: 'Kurta',
      categorySlug: 'kurta',
      description: 'Smart Chinese mandarin collar neck kurti with delicate crochet lace borders, pearl button placket, and 3/4 sleeves.',
      originalPrice: 2499,
      salePrice: 1799,
      discount: 28,
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: ['36', '38', '40', '42', '44'],
      colors: ['Teal Floral', 'Mustard Yellow', 'Maroon Block'],
      fabric: '100% Cambric Cotton with Soft Finish',
      sku: 'RSB-KR-002',
      stockStatus: 'in_stock',
      isFeatured: false,
      isNewArrival: true,
      isTrending: true,
      isOnOffer: true,
      isActive: true,
      createdAt: '2026-08-25T11:00:00.000Z',
    },

    // --- SUMMER WEAR ---
    {
      id: 'prod_sm_1',
      name: 'Pure Mulmul Cotton Printed Anarkali Kurta Set',
      slug: 'pure-mulmul-cotton-printed-anarkali-kurta-set',
      category: 'Summer Wear',
      categorySlug: 'summer-wear',
      description: 'Ultra-light breathable pure mulmul cotton flared Anarkali kurta with cotton pants and matching kota doria dupatta.',
      originalPrice: 3199,
      salePrice: 2199,
      discount: 31,
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Pastel Yellow Floral', 'Sky Blue Bloom', 'Mint Rose'],
      fabric: '100% Organic Mulmul Cotton',
      sku: 'RSB-SM-001',
      stockStatus: 'in_stock',
      isFeatured: true,
      isNewArrival: true,
      isTrending: false,
      isOnOffer: true,
      isActive: true,
      createdAt: '2026-08-24T09:00:00.000Z',
    },

    // --- LATEST DESIGNS ---
    {
      id: 'prod_lt_1',
      name: 'Modal Satin Fusion Designer Outfit (YouTube Latest Drop)',
      slug: 'modal-satin-fusion-designer-outfit',
      category: 'Latest Designs',
      categorySlug: 'latest-designs',
      description: 'Contemporary two-piece luxury outfit featuring high-low asymmetrical tunic and relaxed straight trousers in an abstract floral print.',
      originalPrice: 3999,
      salePrice: 2999,
      discount: 25,
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
      ],
      sizes: ['S', 'M', 'L', 'XL', 'Custom'],
      colors: ['Teal Floral', 'Berry Wine', 'Mustard Olive'],
      fabric: 'Premium Modal Satin Fabric',
      sku: 'RSB-LT-001',
      stockStatus: 'in_stock',
      isFeatured: true,
      isNewArrival: true,
      isTrending: true,
      isOnOffer: false,
      isActive: true,
      createdAt: '2026-08-26T08:00:00.000Z',
    }
  ];
  db.setCollection('products', products);

  // 5. Clean Hero Banners
  const banners = [
    {
      id: 'banner_1',
      title: 'Modern Suits, Lehengas & Saree Blouses',
      subtitle: 'Watch Design Tutorials on YouTube @Rehan09-wtr • Order on WhatsApp',
      highlight: 'Handcrafted in Mahendragarh, Haryana',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=85',
      ctaText: 'Explore Collection',
      ctaLink: '/shop',
      badge: 'YouTube @Rehan09-wtr',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'banner_2',
      title: 'Padded Blouse & Farshi Salwar Suits',
      subtitle: 'Boutique Cutting & Stitching Perfection with Exact Body Fit',
      highlight: 'Special WhatsApp Booking Available',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1800&q=85',
      ctaText: 'View Suits Collection',
      ctaLink: '/category/suits',
      badge: 'Trending Suits',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 'banner_3',
      title: 'Custom Stitching from Any Photo',
      subtitle: 'Send your favorite design photo on WhatsApp for custom fitting',
      highlight: 'Master Tailoring • Heavy Latkan Work • Accurate Fit',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85',
      ctaText: 'Send Design on WhatsApp',
      ctaLink: '/custom-designs',
      badge: 'Master Stitching',
      sortOrder: 3,
      isActive: true,
    },
  ];
  db.setCollection('banners', banners);

  // 6. Real YouTube Shorts from @Rehan09-wtr (User Provided)
  const videos = [
    {
      id: 'vid_yt_1',
      title: 'Designer Boutique Suit & Heavy Dupatta Showcase',
      youtubeUrl: 'https://youtube.com/shorts/0DLfTd51HaA',
      videoId: '0DLfTd51HaA',
      thumbnail: 'https://img.youtube.com/vi/0DLfTd51HaA/hqdefault.jpg',
      type: 'short',
      category: 'Suits',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'vid_yt_2',
      title: 'Padded Sweetheart Neck Blouse & Latkan Finishing',
      youtubeUrl: 'https://youtube.com/shorts/WZjZK9YuTi8',
      videoId: 'WZjZK9YuTi8',
      thumbnail: 'https://img.youtube.com/vi/WZjZK9YuTi8/hqdefault.jpg',
      type: 'short',
      category: 'Saree Blouse',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 'vid_yt_3',
      title: 'Royal Bridal & Festive Lehenga Fitting Inspiration',
      youtubeUrl: 'https://youtube.com/shorts/3uZdjGLjAh0',
      videoId: '3uZdjGLjAh0',
      thumbnail: 'https://img.youtube.com/vi/3uZdjGLjAh0/hqdefault.jpg',
      type: 'short',
      category: 'Lehenga',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 'vid_yt_4',
      title: 'Trending Farshi Salwar Suit & Gota Patti Pattern',
      youtubeUrl: 'https://youtube.com/shorts/UGS8xBNDjAg',
      videoId: 'UGS8xBNDjAg',
      thumbnail: 'https://img.youtube.com/vi/UGS8xBNDjAg/hqdefault.jpg',
      type: 'short',
      category: 'Suits',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: 'vid_yt_5',
      title: 'Latest Inner Kurti with Straight Pants Boutique Design',
      youtubeUrl: 'https://youtube.com/shorts/wk7-HC5f0CI',
      videoId: 'wk7-HC5f0CI',
      thumbnail: 'https://img.youtube.com/vi/wk7-HC5f0CI/hqdefault.jpg',
      type: 'short',
      category: 'Kurta',
      sortOrder: 5,
      isActive: true,
    },
  ];
  db.setCollection('videos', videos);

  // 7. Enquiries CRM (Clean Empty for Launch)
  db.setCollection('enquiries', []);

  console.log('✅ Clean official boutique database prepared for 6 core categories!');
}

if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase(true).then(() => process.exit(0));
}

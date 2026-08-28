# Reena Sharma Boutique — Modern E-Commerce Platform

> **Brand:** Reena Sharma Boutique  
> **Location:** Mahendragarh, Haryana, India  
> **YouTube Channel:** [@Rehan09-wtr](https://www.youtube.com/@Rehan09-wtr)  
> **Business Model:** Luxury Product Catalog + WhatsApp Ordering & Custom Tailoring CRM

---

## 🌟 Live Access URLs & Credentials

- **Customer Website:** [http://localhost:5000](http://localhost:5000) or [http://localhost:3000](http://localhost:3000)
- **Admin Panel:** [http://localhost:5000/admin/login](http://localhost:5000/admin/login)
- **Admin Credentials:**
  - **Email:** `admin@reenasharma.com`
  - **Password:** `Admin@12345`
  *(A 1-click "Fill Demo Credentials" button is also provided on the login page for convenience.)*

---

## ✨ Key Features & Capabilities

### 1. 👗 Customer-Facing Experience
- **Luxury Fashion Aesthetic:** Sophisticated Indian boutique palette (Ivory cream `#FAF8F5`, deep royal burgundy `#58111A`, warm metallic gold accents `#D4AF37`, and crisp charcoal typography).
- **Homepage:**
  - Dynamic Hero Slider with configurable banners, highlights, and CTAs.
  - Brand trust pillars (Custom Tailoring, Royal Bridal Lounge, Direct WhatsApp Ordering, Pan-India Dispatch).
  - Visual category showcase across all 15 boutique categories.
  - Active promotional offers & discount code boxes.
  - Handcrafted featured collection with original vs. offer price comparisons & discount % badges (`₹2,999` → `₹2,299` **23% OFF**).
  - Bridal Lounge highlight section.
  - Trending shararas, co-ord sets, and new arrivals.
  - YouTube video showcase & Shorts viewer embedding `@Rehan09-wtr`.
  - Customer testimonials from Mahendragarh, Gurugram, and Rewari.
- **Product Catalog & Filters:**
  - Search by dress name, fabric, SKU, or tags.
  - Filter by Category, Price range presets, Sizes (XS, S, M, L, XL, XXL, Custom), Colors, Stock status, and Special tags.
  - Sort by Latest, Price Low → High, Price High → Low, Popular / Trending, Highest Discount.
- **Product Details Page:**
  - Multi-image interactive gallery with thumbnail previews and zoom.
  - Original price → Offer price → Discount % badge.
  - Interactive Size Selector with standard measurement chart modal.
  - Color swatches selector.
  - Fabric & embroidery craftsmanship details.
  - **One-Tap "Order on WhatsApp" Button:** Pre-fills detailed product inquiry with Name, Price, SKU, selected Size, and Color.
  - **"Direct Enquiry / Book Fitting" Modal:** Collects customer details with celebratory confetti and automated WhatsApp redirection.
  - Wishlist heart toggle & copy product link.
- **Dedicated Pages:**
  - `/bridal` — Dedicated Bridal Lounge for lehengas, bridal saree/lehenga blouses & appointment bookings.
  - `/offers` — Promotional deals, coupon codes & discounted items.
  - `/new-arrivals` — Fresh drops straight from the workshop.
  - `/custom-designs` — Master cutting & stitching guide, neckline inspiration & measurement assistance.
  - `/videos` — YouTube channel videos & Shorts gallery for `@Rehan09-wtr`.
  - `/about` — Authentic boutique heritage story and artisan values.
  - `/contact` — Store location (Gandhi Chowk Market, Mahendragarh), Google Maps embed, phone & WhatsApp chat.
  - `/wishlist` — Saved favorites with 1-click "Inquire All on WhatsApp".

---

### 2. 🛡️ Admin Management Console (`/admin`)
No coding is required for the owner to operate the website:
- **Dashboard:** KPI summary (Total Products, Active, On Offer, Total Enquiries, New vs Confirmed), recent WhatsApp inquiries, and quick administrative actions.
- **Product Management:** Full CRUD with multi-image Drag & Drop upload (Multer), auto-discount calculation from original & offer prices, size/color chips, fabric specifications, SKU generation, and instant toggle switches (Active, Featured, New Arrival, Trending, On Offer).
- **Category Management:** Create, edit, reorder, and toggle all 15+ boutique categories with custom images.
- **Offer & Promo Management:** Create seasonal discounts, promo codes, start/end dates, badge text, and banner images.
- **Hero Slider Management:** Add, edit, reorder, and customize homepage hero slides and CTAs.
- **YouTube Video Manager:** Add and edit YouTube video IDs & Shorts for `@Rehan09-wtr`.
- **Enquiry & Order CRM:** View all customer requests, filter by status (`New`, `Contacted`, `Confirmed`, `Completed`, `Cancelled`), add admin notes, and click **"WhatsApp Chat"** to open a direct pre-formatted customer response.
- **Website Settings:** Change boutique name, WhatsApp ordering number, phone, location address, YouTube handle, social media links, store hours, and update admin password.

---

## 📁 Project Structure

```
website/
├── package.json               # Root scripts & server dependencies
├── .data/
│   └── boutique_data.json     # Persistent database store (JSON/SQLite format)
├── public/
│   └── uploads/               # Uploaded product & banner images
├── server/
│   ├── server.js              # Express application entry point
│   ├── seed.js                # Rich demo seed script
│   ├── db/
│   │   └── database.js        # Persistent database layer
│   ├── middleware/
│   │   └── auth.js            # JWT admin auth middleware
│   └── routes/
│       ├── auth.js            # Admin login & password change
│       ├── products.js        # Product CRUD & filtering
│       ├── categories.js      # Category management
│       ├── offers.js          # Offers & promo codes
│       ├── banners.js         # Hero slider management
│       ├── enquiries.js       # Customer inquiry & WhatsApp CRM
│       ├── settings.js        # Public & admin settings
│       ├── videos.js          # YouTube showcase
│       ├── stats.js           # Admin analytics & metrics
│       ├── upload.js          # Multi-image file uploads
│       └── seo.js             # Dynamic sitemap.xml & robots.txt
└── client/
    ├── package.json           # React frontend dependencies
    ├── vite.config.js         # Vite configuration with API proxy
    ├── tailwind.config.js     # Luxury boutique color palette & fonts
    ├── public/
    │   └── logo-icon.svg      # Golden boutique lotus monogram
    └── src/
        ├── App.jsx            # All customer & admin routes
        ├── main.jsx           # Entry point
        ├── index.css          # Styling & gold gradients
        ├── context/
        │   ├── BoutiqueContext.jsx   # Global store settings, wishlist & WhatsApp helpers
        │   └── AdminAuthContext.jsx  # JWT token & admin session
        ├── components/
        │   ├── Navbar.jsx            # Header with search drawer & mobile menu
        │   ├── Footer.jsx            # Rich brand footer & store details
        │   ├── ProductCard.jsx       # Garment card with pricing & WhatsApp CTAs
        │   ├── HeroSlider.jsx        # Dynamic homepage banner slider
        │   ├── QuickViewModal.jsx    # Lightbox product preview
        │   ├── EnquiryModal.jsx      # WhatsApp inquiry form with confetti
        │   ├── BrandTrustBadges.jsx  # Boutique trust pillars
        │   ├── CategoryCarousel.jsx  # Category pills & visual grid
        │   ├── YouTubeSection.jsx    # Embedded video player for @Rehan09-wtr
        │   ├── TestimonialSection.jsx# Customer reviews
        │   ├── FloatingWhatsApp.jsx  # Sticky WhatsApp action widget
        │   ├── AdminLayout.jsx       # Admin portal sidebar layout
        │   └── Icons.jsx             # Crisp brand SVG icons
        └── pages/
            ├── HomePage.jsx
            ├── ShopPage.jsx
            ├── ProductDetailPage.jsx
            ├── CategoriesPage.jsx
            ├── CategoryPage.jsx
            ├── BridalLoungePage.jsx
            ├── OffersPage.jsx
            ├── NewArrivalsPage.jsx
            ├── CustomDesignsPage.jsx
            ├── VideosPage.jsx
            ├── AboutPage.jsx
            ├── ContactPage.jsx
            ├── WishlistPage.jsx
            ├── PrivacyPolicyPage.jsx
            ├── TermsPage.jsx
            ├── NotFoundPage.jsx
            └── admin/
                ├── AdminLoginPage.jsx
                ├── AdminDashboardPage.jsx
                ├── AdminProductsPage.jsx
                ├── AdminProductFormPage.jsx
                ├── AdminCategoriesPage.jsx
                ├── AdminOffersPage.jsx
                ├── AdminBannersPage.jsx
                ├── AdminVideosPage.jsx
                ├── AdminEnquiriesPage.jsx
                └── AdminSettingsPage.jsx
```

---

## 🚀 How to Run

1. **Start Unified Server (Frontend + Backend + API):**
   ```bash
   node server/server.js
   ```
   Open **http://localhost:5000** in your browser.

2. **Start in Development Mode (Live Hot Reloading):**
   ```bash
   npm run dev
   ```
   - Vite Client: **http://localhost:3000**
   - Express Backend: **http://localhost:5000**

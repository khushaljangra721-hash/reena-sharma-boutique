import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useBoutique } from '../../context/BoutiqueContext';
import { getImageUrl } from '../../utils/api';
import {
  Package,
  ArrowLeft,
  Upload,
  X,
  Plus,
  Sparkles,
  Save,
  CheckCircle,
  Tag,
  Scissors,
  Image as ImageIcon
} from 'lucide-react';

export const AdminProductFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { authHeaders } = useAdminAuth();
  const { categories, refreshData } = useBoutique();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Bridal Wear');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL', 'Custom Measurement']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [colors, setColors] = useState(['Royal Crimson Red', 'Maroon']);
  const [customColorInput, setCustomColorInput] = useState('');
  const [fabric, setFabric] = useState('Pure Silk & Velvet with Hand Zardozi Embroidery');
  const [sku, setSku] = useState('');
  const [stockStatus, setStockStatus] = useState('in_stock');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isTrending, setIsTrending] = useState(false);
  const [isOnOffer, setIsOnOffer] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEditMode);

  // Auto calculate discount percentage when prices change
  const handleOriginalPriceChange = (val) => {
    setOriginalPrice(val);
    const orig = Number(val);
    const sale = Number(salePrice);
    if (orig > 0 && sale > 0 && orig >= sale) {
      setDiscount(Math.round(((orig - sale) / orig) * 100));
    }
  };

  const handleSalePriceChange = (val) => {
    setSalePrice(val);
    const orig = Number(originalPrice);
    const sale = Number(val);
    if (orig > 0 && sale > 0 && orig >= sale) {
      setDiscount(Math.round(((orig - sale) / orig) * 100));
    }
  };

  // If in edit mode, fetch existing data
  useEffect(() => {
    if (isEditMode) {
      const loadProduct = async () => {
        try {
          const res = await fetch(`/api/products/${id}`);
          const data = await res.json();
          if (data.success && data.product) {
            const p = data.product;
            setName(p.name || '');
            setCategory(p.category || 'Bridal Wear');
            setDescription(p.description || '');
            setOriginalPrice(p.originalPrice || '');
            setSalePrice(p.salePrice || '');
            setDiscount(p.discount || '');
            setImages(p.images || []);
            setSizes(p.sizes || []);
            setColors(p.colors || []);
            setFabric(p.fabric || '');
            setSku(p.sku || '');
            setStockStatus(p.stockStatus || 'in_stock');
            setIsFeatured(Boolean(p.isFeatured));
            setIsNewArrival(Boolean(p.isNewArrival));
            setIsTrending(Boolean(p.isTrending));
            setIsOnOffer(Boolean(p.isOnOffer));
            setIsActive(p.isActive !== false);
          }
        } catch (err) {
          console.error('Failed to load product for edit:', err);
        } finally {
          setLoadingInitial(false);
        }
      };
      loadProduct();
    }
  }, [id, isEditMode]);

  // Handle multi-image file upload via Multer API
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setUploading(true);
    try {
      const res = await fetch('/api/upload/multiple', {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.urls) {
        setImages((prev) => [...prev, ...data.urls]);
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addSize = (size) => {
    if (!sizes.includes(size)) {
      setSizes((prev) => [...prev, size]);
    }
  };

  const removeSize = (size) => {
    setSizes((prev) => prev.filter((s) => s !== size));
  };

  const addColor = (color) => {
    if (!colors.includes(color)) {
      setColors((prev) => [...prev, color]);
    }
  };

  const removeColor = (color) => {
    setColors((prev) => prev.filter((c) => c !== color));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !originalPrice || !category) {
      alert('Product Name, Category, and Original Price are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        category,
        categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        originalPrice: Number(originalPrice),
        salePrice: salePrice ? Number(salePrice) : Number(originalPrice),
        discount: discount !== '' ? Number(discount) : 0,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        sizes: sizes.length > 0 ? sizes : ['Standard'],
        colors: colors.length > 0 ? colors : ['Standard'],
        fabric: fabric.trim(),
        sku: sku.trim() || undefined,
        stockStatus,
        isFeatured,
        isNewArrival,
        isTrending,
        isOnOffer,
        isActive,
      };

      const url = isEditMode ? `/api/products/${id}` : '/api/products';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        refreshData();
        navigate('/admin/products');
      } else {
        alert(data.message || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-burgundy-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading outfit details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              {isEditMode ? 'Edit Boutique Outfit' : 'Add New Boutique Outfit'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditMode ? 'Update pricing, images or details' : 'Publish a new garment to the website & WhatsApp catalog'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            1. Garment Identity & Category
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Outfit Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Crimson Velvet Bridal Lehenga Set"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product SKU Code
              </label>
              <input
                type="text"
                placeholder="e.g. RSB-BRD-001 (Auto generated if blank)"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description & Artisan Details
            </label>
            <textarea
              rows={4}
              placeholder="Describe the silhouette, embroidery work (zardozi, gota patti), dupatta style, and neckline details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Discount */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>2. Pricing & Automatic Discount</span>
            <span className="text-[11px] font-normal text-slate-500">Currency: ₹ INR</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Original MRP Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 2999"
                value={originalPrice}
                onChange={(e) => handleOriginalPriceChange(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Boutique Offer / Sale Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 2299"
                value={salePrice}
                onChange={(e) => handleSalePriceChange(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none font-bold text-burgundy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Discount Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 23"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none font-bold text-emerald-700"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Multiple Images Upload & Gallery */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-burgundy-900" />
              <span>3. Product Images Gallery</span>
            </h3>
            <span className="text-[11px] text-slate-500">{images.length} images added</span>
          </div>

          {/* Upload Button + URL input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File Upload */}
            <div className="border-2 border-dashed border-slate-300 hover:border-burgundy-900 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50 relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-slate-700 block">
                {uploading ? 'Uploading Images...' : 'Upload Images from Device'}
              </span>
              <span className="text-[10px] text-slate-400">JPG, PNG, WEBP (Max 10MB)</span>
            </div>

            {/* Direct URL Addition */}
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Or paste image URL (Unsplash / CDN)..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-black transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Image Thumbnails Gallery */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-slate-200 group bg-slate-100">
                  <img src={getImageUrl(img)} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 shadow transition-opacity"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-black/75 text-gold-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Specifications & Attributes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            4. Garment Specifications & Customization
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Fabric & Embroidery Details
            </label>
            <input
              type="text"
              placeholder="e.g. Pure Micro Velvet with Antique Gold Zari & Shantoon Lining"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-burgundy-900 focus:outline-none"
            />
          </div>

          {/* Sizes Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {sizes.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-burgundy-50 text-burgundy-950 font-semibold text-xs px-2.5 py-1 rounded-lg border border-burgundy-200"
                >
                  <span>{s}</span>
                  <button type="button" onClick={() => removeSize(s)} className="text-slate-400 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {/* Quick Add Presets */}
            <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
              <span>Add preset:</span>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '34', '36', '38', '40', '42', 'Custom Measurement'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => addSize(preset)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Available Colors
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {colors.map((c, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-900 font-semibold text-xs px-2.5 py-1 rounded-lg border border-slate-300"
                >
                  <span>{c}</span>
                  <button type="button" onClick={() => removeColor(c)} className="text-slate-400 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {/* Quick Add Presets */}
            <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
              <span>Add preset:</span>
              {['Royal Crimson Red', 'Deep Maroon', 'Pastel Peach', 'Antique Gold', 'Mustard Yellow', 'Emerald Green', 'Wine Burgundy', 'Ivory Cream', 'Black', 'Charcoal'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => addColor(preset)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Stock & Availability Status
            </label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none bg-white"
            >
              <option value="in_stock">In Stock (Ready for Dispatch)</option>
              <option value="made_to_order">Made to Order (Custom Stitching Only)</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Section 5: Feature Badges & Visibility Toggles */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            5. Website Display & Marketing Flags
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-burgundy-900"
              />
              <span className="text-xs font-bold text-slate-800">Publish Live</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-burgundy-900"
              />
              <span className="text-xs font-bold text-slate-800">Featured ★</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 rounded text-burgundy-900"
              />
              <span className="text-xs font-bold text-slate-800">New Arrival</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="w-4 h-4 rounded text-burgundy-900"
              />
              <span className="text-xs font-bold text-slate-800">Trending 🔥</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isOnOffer}
                onChange={(e) => setIsOnOffer(e.target.checked)}
                className="w-4 h-4 rounded text-burgundy-900"
              />
              <span className="text-xs font-bold text-slate-800">On Offer %</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/products"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-gold-gradient hover:opacity-95 text-burgundy-950 px-8 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Garment...' : isEditMode ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

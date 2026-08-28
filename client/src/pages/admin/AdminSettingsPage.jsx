import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useBoutique } from '../../context/BoutiqueContext';
import {
  Settings,
  Save,
  MessageCircle,
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  Sparkles,
  Building,
  KeyRound
} from 'lucide-react';
import { Youtube, Instagram } from '../../components/Icons';

export const AdminSettingsPage = () => {
  const { authHeaders } = useAdminAuth();
  const { settings, setSettings, refreshData } = useBoutique();

  // Settings state
  const [formData, setFormData] = useState({
    boutiqueName: '',
    tagline: '',
    subTagline: '',
    whatsappNumber: '',
    phoneNumber: '',
    altPhoneNumber: '',
    email: '',
    location: '',
    fullAddress: '',
    youtubeUrl: '',
    youtubeHandle: '',
    instagramUrl: '',
    facebookUrl: '',
    storeTimings: '',
    announcementText: '',
    aboutStory: '',
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (settings) {
      setFormData({
        boutiqueName: settings.boutiqueName || 'Reena Sharma Boutique',
        tagline: settings.tagline || 'Modern Designs. Elegant Styles. Made for You.',
        subTagline: settings.subTagline || '',
        whatsappNumber: settings.whatsappNumber || '919467830763',
        phoneNumber: settings.phoneNumber || '+91 94678 30763',
        altPhoneNumber: settings.altPhoneNumber || '',
        email: settings.email || 'info@reenasharmaboutique.com',
        location: settings.location || 'Mahendragarh, Haryana, India',
        fullAddress: settings.fullAddress || '',
        youtubeUrl: settings.youtubeUrl || 'https://www.youtube.com/@Rehan09-wtr',
        youtubeHandle: settings.youtubeHandle || '@Rehan09-wtr',
        instagramUrl: settings.instagramUrl || '',
        facebookUrl: settings.facebookUrl || '',
        storeTimings: settings.storeTimings || '',
        announcementText: settings.announcementText || '',
        aboutStory: settings.aboutStory || '',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSavedSuccess(true);
        refreshData();
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(data.message || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setPwSaving(true);
    setPwMsg({ text: '', type: '' });

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setPwMsg({ text: 'Password changed successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwMsg({ text: data.message || 'Failed to update password', type: 'error' });
      }
    } catch (err) {
      setPwMsg({ text: 'Server error updating password', type: 'error' });
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-burgundy-900" />
          <span>Website & Boutique Settings</span>
        </h2>
        <p className="text-xs text-slate-500">
          Manage boutique details, WhatsApp ordering number, location, YouTube channel, and announcements.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Website settings updated successfully! Changes appear immediately on the live website.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmitSettings} className="space-y-6">
        
        {/* Boutique Identity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            1. Brand Identity & Taglines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Boutique Name
              </label>
              <input
                type="text"
                name="boutiqueName"
                value={formData.boutiqueName}
                onChange={handleChange}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Main Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Top Announcement Banner Text
            </label>
            <input
              type="text"
              name="announcementText"
              value={formData.announcementText}
              onChange={handleChange}
              placeholder="✨ Special Bridal & Festive Season Bookings Open! Order on WhatsApp ✨"
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
            />
          </div>
        </div>

        {/* WhatsApp & Contact Numbers */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>2. WhatsApp Ordering & Contact Numbers</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              Controls all "Order on WhatsApp" buttons
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Number (with country code)
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="919467830763"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none font-mono font-bold text-emerald-800"
              />
              <span className="text-[10px] text-slate-400">e.g. 919467830763 (no + or spaces)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Calling Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 94678 30763"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@reenasharmaboutique.com"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Store Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            3. Store Location & Timings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Location Headline
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Mahendragarh, Haryana, India"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Store Operating Hours
              </label>
              <input
                type="text"
                name="storeTimings"
                value={formData.storeTimings}
                onChange={handleChange}
                placeholder="Mon - Sat: 10:00 AM - 8:30 PM | Sun: By Appointment"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Store Address
            </label>
            <input
              type="text"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              placeholder="Shop No. 12, Gandhi Chowk Market, Near Railway Station Road, Mahendragarh, Haryana 123029"
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Social & YouTube Links */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            4. YouTube & Social Media Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://www.youtube.com/@Rehan09-wtr"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                YouTube Handle
              </label>
              <input
                type="text"
                name="youtubeHandle"
                value={formData.youtubeHandle}
                onChange={handleChange}
                placeholder="@Rehan09-wtr"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://www.instagram.com/reenasharma_boutique"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://www.facebook.com/reenasharmaboutique"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Settings CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-gold-gradient hover:opacity-95 text-burgundy-950 px-8 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Website Settings'}</span>
          </button>
        </div>

      </form>

      {/* Admin Password Change Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-burgundy-900" />
          <span>Security & Change Password</span>
        </h3>

        {pwMsg.text && (
          <div
            className={`p-3 rounded-xl text-xs font-bold ${
              pwMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {pwMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwSaving}
            className="bg-slate-800 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
          >
            {pwSaving ? 'Updating Password...' : 'Update Admin Password'}
          </button>
        </form>
      </div>

    </div>
  );
};

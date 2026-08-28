import React from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  Heart,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Youtube, Instagram, Facebook } from './Icons';

export const Footer = () => {
  const { settings, categories, openWhatsApp } = useBoutique();

  return (
    <footer className="bg-burgundy-950 text-boutique-200 pt-16 pb-8 border-t-2 border-gold-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-burgundy-900 text-center md:text-left">
          <div className="p-4 rounded-xl bg-burgundy-900/40 border border-gold-500/10">
            <h4 className="text-gold-300 font-bold text-base flex items-center justify-center md:justify-start gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-gold-400" />
              Bespoke Boutique Tailoring
            </h4>
            <p className="text-xs text-boutique-300">Custom cutting & stitching to your exact body measurements.</p>
          </div>
          <div className="p-4 rounded-xl bg-burgundy-900/40 border border-gold-500/10">
            <h4 className="text-gold-300 font-bold text-base flex items-center justify-center md:justify-start gap-2 mb-1">
              👑 Royal Bridal Lounge
            </h4>
            <p className="text-xs text-boutique-300">Heavy bridal lehengas, zari blouses and wedding ensembles.</p>
          </div>
          <div className="p-4 rounded-xl bg-burgundy-900/40 border border-gold-500/10">
            <h4 className="text-gold-300 font-bold text-base flex items-center justify-center md:justify-start gap-2 mb-1">
              💬 Instant WhatsApp Ordering
            </h4>
            <p className="text-xs text-boutique-300">No payment hassle. Directly chat, customize & order on WhatsApp.</p>
          </div>
          <div className="p-4 rounded-xl bg-burgundy-900/40 border border-gold-500/10">
            <h4 className="text-gold-300 font-bold text-base flex items-center justify-center md:justify-start gap-2 mb-1">
              📍 Mahendragarh, Haryana
            </h4>
            <p className="text-xs text-boutique-300">Visit our boutique showroom or order anywhere across India.</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src={settings.logoUrl || '/logo-icon.svg'} alt="RS" className="w-12 h-12 object-contain" />
              <div>
                <span className="font-serif text-2xl font-bold text-gold-300 tracking-wide block">
                  {settings.boutiqueName || 'Reena Sharma Boutique'}
                </span>
                <span className="text-xs text-boutique-400 tracking-wider uppercase">
                  Modern Designs • Elegant Styles • Made for You
                </span>
              </div>
            </div>

            <p className="text-xs text-boutique-300 leading-relaxed">
              Welcome to Reena Sharma Boutique — your destination for latest dress designs, stylish outfits, cutting & stitching ideas and modern fashion inspiration in Mahendragarh, Haryana.
            </p>

            {/* Social Channels */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.youtubeUrl || 'https://www.youtube.com/@Rehan09-wtr'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition-transform hover:scale-110 shadow-sm"
                title="Watch on YouTube @Rehan09-wtr"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={settings.instagramUrl || 'https://www.instagram.com/reenasharma1854/?utm_source=ig_web_button_share_sheet'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                title="Follow on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={settings.facebookUrl || 'https://www.facebook.com/rehan.jangra.5'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-transform hover:scale-110 shadow-sm"
                title="Follow on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <button
                onClick={() => openWhatsApp()}
                className="px-3 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#20ba59] transition-transform hover:scale-105"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </button>
            </div>

            {/* YouTube Subscribe Callout */}
            <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/30 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-semibold text-white block">YouTube Channel:</span>
                <span className="text-red-400 font-mono">@Rehan09-wtr</span>
              </div>
              <a
                href="https://www.youtube.com/@Rehan09-wtr?sub_confirmation=1"
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow transition-colors"
              >
                Subscribe
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-serif text-gold-300 font-bold text-base mb-4 tracking-wide">
              Top Collections
            </h4>
            <ul className="space-y-2 text-xs text-boutique-300">
              <li>
                <Link to="/category/suits" className="hover:text-gold-300 transition-colors">
                  Suits & Shararas
                </Link>
              </li>
              <li>
                <Link to="/category/lehenga" className="hover:text-gold-300 transition-colors">
                  Bridal & Party Lehengas
                </Link>
              </li>
              <li>
                <Link to="/category/saree-blouse" className="hover:text-gold-300 transition-colors">
                  Padded Saree Blouses
                </Link>
              </li>
              <li>
                <Link to="/category/kurta" className="hover:text-gold-300 transition-colors">
                  Designer Kurtas & Sets
                </Link>
              </li>
              <li>
                <Link to="/category/summer-wear" className="hover:text-gold-300 transition-colors">
                  Cotton Summer Wear
                </Link>
              </li>
              <li>
                <Link to="/category/latest-designs" className="hover:text-gold-300 transition-colors">
                  Latest YouTube Drops
                </Link>
              </li>
            </ul>
          </div>

          {/* Boutique Services */}
          <div>
            <h4 className="font-serif text-gold-300 font-bold text-base mb-4 tracking-wide">
              Boutique Services
            </h4>
            <ul className="space-y-2 text-xs text-boutique-300">
              <li>
                <Link to="/custom-designs" className="hover:text-gold-300 transition-colors">
                  Custom Cutting & Stitching
                </Link>
              </li>
              <li>
                <Link to="/bridal" className="hover:text-gold-300 transition-colors">
                  Bridal Fitting Consultation
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-gold-300 transition-colors">
                  Special Festive Offers
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-gold-300 transition-colors">
                  YouTube Shorts (@Rehan09-wtr)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-300 transition-colors">
                  Our Boutique Story
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-gold-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gold-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="font-serif text-gold-300 font-bold text-base mb-4 tracking-wide">
              Store & Location
            </h4>
            <div className="space-y-3 text-xs text-boutique-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{settings.fullAddress || 'Shop No. 12, Gandhi Chowk Market, Mahendragarh, Haryana 123029'}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${settings.phoneNumber}`} className="hover:text-gold-300">
                  {settings.phoneNumber}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                <button onClick={() => openWhatsApp()} className="hover:text-green-400 text-left">
                  WhatsApp: +{settings.whatsappNumber}
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-300">
                  {settings.email}
                </a>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{settings.storeTimings || 'Mon - Sat: 10:00 AM - 8:30 PM'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-burgundy-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-boutique-400">
          <p>© {new Date().getFullYear()} Reena Sharma Boutique, Mahendragarh, Haryana. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-gold-300">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-gold-300">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useBoutique } from '../context/BoutiqueContext';
import {
  LayoutDashboard,
  Star,
  Package,
  PlusCircle,
  FolderTree,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Youtube } from './Icons';

export const AdminLayout = () => {
  const { admin, logout, isAuthenticated, loading } = useAdminAuth();
  const { settings } = useBoutique();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-burgundy-950 text-gold-300">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg font-bold">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Add Product', path: '/admin/products/new', icon: PlusCircle },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Offers & Promos', path: '/admin/offers', icon: Tag },
    { label: 'Hero Banners', path: '/admin/banners', icon: ImageIcon },
    { label: 'YouTube Videos', path: '/admin/videos', icon: Youtube },
    { label: 'Customer Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Enquiries / Orders', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-burgundy-950 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-burgundy-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-icon.svg" alt="RSB" className="w-9 h-9" />
              <div>
                <span className="font-serif font-bold text-sm text-gold-300 block leading-tight">
                  {settings.boutiqueName || 'Reena Sharma'}
                </span>
                <span className="text-[10px] text-gold-400/80 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-gold-400" />
                  Admin Panel
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-boutique-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gold-500 text-burgundy-950 font-bold shadow-md'
                      : 'text-boutique-200 hover:bg-burgundy-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-burgundy-950' : 'text-gold-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Info & Logout */}
        <div className="p-4 border-t border-burgundy-900 space-y-3">
          <div className="px-2 py-2 bg-burgundy-900/60 rounded-xl">
            <div className="text-[11px] font-bold text-gold-300 truncate">
              {admin?.name || 'Reena Sharma'}
            </div>
            <div className="text-[10px] text-boutique-400 truncate">
              {admin?.email || 'admin@reenasharma.com'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-burgundy-900 hover:bg-burgundy-800 text-[11px] text-gold-300 font-medium transition-colors"
              title="Open Website in new tab"
            >
              <span>Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 text-[11px] font-medium transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-slate-800 font-serif">
                Reena Sharma Boutique — Management Console
              </h1>
              <p className="text-xs text-slate-500">
                Mahendragarh, Haryana • Catalog & WhatsApp Order Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-burgundy-50 text-burgundy-900 px-3 py-1.5 rounded-lg hover:bg-burgundy-100 transition-colors"
            >
              <span>View Customer Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="w-8 h-8 rounded-full bg-burgundy-900 text-gold-300 flex items-center justify-center font-bold text-xs">
              RS
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { PlusCircle, Edit2, Trash2, X, Save, ExternalLink, Play } from 'lucide-react';
import { Youtube } from '../../components/Icons';

export const AdminVideosPage = () => {
  const { authHeaders } = useAdminAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  // Form
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [type, setType] = useState('short');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openAddModal = () => {
    setEditingVideo(null);
    setTitle('');
    setYoutubeUrl('https://www.youtube.com/@Rehan09-wtr');
    setType('short');
    setSortOrder('0');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (v) => {
    setEditingVideo(v);
    setTitle(v.title || '');
    setYoutubeUrl(v.youtubeUrl || '');
    setType(v.type || 'short');
    setSortOrder(String(v.sortOrder || 0));
    setIsActive(v.isActive !== false);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        youtubeUrl: youtubeUrl.trim(),
        type,
        sortOrder: Number(sortOrder),
        isActive,
      };

      const url = editingVideo ? `/api/videos/${editingVideo.id}` : '/api/videos';
      const method = editingVideo ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchVideos();
      }
    } catch (err) {
      console.error('Error saving video:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this video?')) return;
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        fetchVideos();
      }
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-600" />
            <span>YouTube Showcase & Shorts Manager</span>
          </h2>
          <p className="text-xs text-slate-500">
            Link video tutorials & design previews from your channel <strong>@Rehan09-wtr</strong>.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add YouTube Video</span>
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-black">
              <img
                src={v.thumbnail || (v.videoId ? `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg` : '')}
                alt={v.title}
                className="w-full h-full object-cover opacity-90"
              />
              <span className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {v.type === 'short' ? 'YouTube Short' : 'Full Video'}
              </span>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-slate-900 line-clamp-2">{v.title}</h4>
                <a
                  href={v.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-red-600 font-semibold hover:underline flex items-center gap-1 mt-1 truncate"
                >
                  <span>{v.youtubeUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Order: {v.sortOrder || 0}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(v)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-base text-slate-900">
                {editingVideo ? 'Edit Video Link' : 'Add YouTube Video / Short'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal Blouse Cutting Tutorial 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">YouTube URL or Video ID *</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or shorts URL"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none bg-white"
                  >
                    <option value="short">YouTube Short</option>
                    <option value="video">Full Video Tutorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-burgundy-900"
                  />
                  <span>Active & Display in Video Section</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

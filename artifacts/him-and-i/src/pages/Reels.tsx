import React, { useState, useEffect } from 'react';
import { Film, Heart, Trash2, ExternalLink, Plus } from 'lucide-react';

interface ReelItem {
  id: string;
  title: string;
  url: string;
  isFavorite: boolean;
  dateAdded: string;
}

export default function Reels() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    const saved = localStorage.getItem('him_her_reels_v2');
    if (saved) {
      try {
        setReels(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved reels', e);
      }
    }
  }, []);

  const saveReels = (updated: ReelItem[]) => {
    setReels(updated);
    localStorage.setItem('him_her_reels_v2', JSON.stringify(updated));
  };

  const handleAddReel = () => {
    if (!inputUrl.trim()) return;

    const newReel: ReelItem = {
      id: Date.now().toString(),
      title: inputTitle.trim() || `Featured Reel #${reels.length + 1}`,
      url: inputUrl.trim(),
      isFavorite: false,
      dateAdded: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    saveReels([newReel, ...reels]);
    setInputTitle('');
    setInputUrl('');
  };

  const toggleFavorite = (id: string) => {
    const updated = reels.map((reel) =>
      reel.id === id ? { ...reel, isFavorite: !reel.isFavorite } : reel
    );
    saveReels(updated);
  };

  const deleteReel = (id: string) => {
    saveReels(reels.filter((r) => r.id !== id));
  };

  const getPlatformBadge = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram.com')) return 'Instagram';
    if (lowerUrl.includes('tiktok.com')) return 'TikTok';
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'YouTube';
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) return 'Facebook';
    return 'Link';
  };

  const filteredReels = filter === 'favorites' ? reels.filter((r) => r.isFavorite) : reels;

  return (
    <div className="mx-auto max-w-md p-4 space-y-4 font-sans text-left" dir="ltr">
      {/* Header */}
      <div className="rounded-3xl border border-rose-100 bg-white/80 p-5 text-center shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-800">
          <Film className="text-rose-500" size={24} />
          <h1>Reels Vault</h1>
        </div>
        <p className="mt-1 text-xs text-rose-500">
          A curated collection of videos and clips shared and loved together.
        </p>
      </div>

      {/* Add Reel Form */}
      <div className="rounded-3xl border border-rose-100 bg-white/80 p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-800">Add a new clip to playlist:</h3>
        <input
          type="text"
          placeholder="Clip title or description..."
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          className="w-full rounded-2xl border border-rose-100 bg-rose-50/20 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-rose-400 focus:bg-white transition-colors"
        />
        <input
          type="text"
          placeholder="Video URL (Instagram / TikTok / YouTube)..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="w-full rounded-2xl border border-rose-100 bg-rose-50/20 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-rose-400 focus:bg-white transition-colors"
        />
        <button
          onClick={handleAddReel}
          disabled={!inputUrl.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-3 text-xs font-bold text-white shadow-md hover:bg-rose-600 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus size={14} />
          <span>Save Video</span>
        </button>
      </div>

      {/* Playlist & Filters */}
      <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-white/80 p-1.5 shadow-sm">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            filter === 'all' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-rose-500'
          }`}
        >
          All Videos ({reels.length})
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            filter === 'favorites' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-rose-500'
          }`}
        >
          Favorites ({reels.filter((r) => r.isFavorite).length})
        </button>
      </div>

      {/* Reels List */}
      {filteredReels.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white/40 py-12 text-center text-xs text-slate-400">
          No videos found in this list yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReels.map((reel) => (
            <div
              key={reel.id}
              className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-all"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold">
                    {getPlatformBadge(reel.url)}
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs truncate">{reel.title}</h4>
                </div>
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-rose-500 hover:underline truncate"
                >
                  <span>Open Video Link</span>
                  <ExternalLink size={10} />
                </a>
                <span className="text-[10px] text-slate-400 block">{reel.dateAdded}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFavorite(reel.id)}
                  aria-label={reel.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className={`p-2 rounded-xl transition-all ${
                    reel.isFavorite
                      ? 'bg-rose-50 text-rose-500'
                      : 'bg-slate-50 text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <Heart size={14} className={reel.isFavorite ? 'fill-rose-500' : ''} />
                </button>
                <button
                  onClick={() => deleteReel(reel.id)}
                  aria-label="Delete reel"
                  className="p-2 rounded-xl text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
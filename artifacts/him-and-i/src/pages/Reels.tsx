import React, { useState, useEffect } from 'react';

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
        day: 'numeric'
      })
    };

    saveReels([newReel, ...reels]);
    setInputTitle('');
    setInputUrl('');
  };

  const toggleFavorite = (id: string) => {
    const updated = reels.map(reel =>
      reel.id === id ? { ...reel, isFavorite: !reel.isFavorite } : reel
    );
    saveReels(updated);
  };

  const deleteReel = (id: string) => {
    saveReels(reels.filter(r => r.id !== id));
  };

  // Helper to detect platform tag from URL
  const getPlatformBadge = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram.com')) return 'Instagram';
    if (lowerUrl.includes('tiktok.com')) return 'TikTok';
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'YouTube';
    return 'Link';
  };

  const filteredReels = filter === 'favorites' ? reels.filter(r => r.isFavorite) : reels;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-rose-50/40 text-left" dir="ltr">
      <div className="max-w-2xl mx-auto space-y-6 pb-24">

        {/* Header */}
        <div className="bg-white/85 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-rose-100">
          <h1 className="text-2xl font-bold text-rose-950">Reels Vault 🎬</h1>
          <p className="text-xs text-rose-700/80 mt-1">
            A curated collection of videos and clips shared and loved together.
          </p>
        </div>

        {/* Add Reel Form */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-rose-100 space-y-3">
          <h3 className="text-sm font-semibold text-rose-900">Add a new clip to playlist:</h3>
          <input
            type="text"
            placeholder="Clip title or description..."
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-sm outline-none focus:border-rose-400 text-rose-950 placeholder:text-rose-300"
          />
          <input
            type="text"
            placeholder="Video URL (Instagram / TikTok / YouTube)..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-sm outline-none focus:border-rose-400 text-rose-950 placeholder:text-rose-300"
          />
          <button
            onClick={handleAddReel}
            disabled={!inputUrl.trim()}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-all active:scale-98 shadow-sm"
          >
            Save Video 📌
          </button>
        </div>

        {/* Playlist & Filters */}
        <div className="flex bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-rose-100 gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-rose-800 hover:bg-rose-50'
            }`}
          >
            All Videos ({reels.length})
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'favorites'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-rose-800 hover:bg-rose-50'
            }`}
          >
            Favorites ❤️ ({reels.filter(r => r.isFavorite).length})
          </button>
        </div>

        {/* Reels List */}
        {filteredReels.length === 0 ? (
          <div className="text-center py-12 bg-white/60 backdrop-blur-md rounded-3xl border border-dashed border-rose-200">
            <p className="text-rose-800 text-sm font-medium">No videos found in this list yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReels.map((reel) => (
              <div
                key={reel.id}
                className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-rose-100 flex items-center justify-between gap-3 hover:shadow-md transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold">
                      {getPlatformBadge(reel.url)}
                    </span>
                    <h4 className="font-bold text-rose-950 text-sm truncate">{reel.title}</h4>
                  </div>
                  <a
                    href={reel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-rose-500 hover:underline truncate block mt-1"
                  >
                    Open Video Link ↗
                  </a>
                  <span className="text-[10px] text-stone-400 block mt-1">{reel.dateAdded}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(reel.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-lg transition-transform active:scale-125"
                    title={reel.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {reel.isFavorite ? '❤️' : '🤍'}
                  </button>
                  <button
                    onClick={() => deleteReel(reel.id)}
                    className="p-2 text-rose-400 hover:text-rose-600 text-xs transition-colors"
                    title="Delete reel"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
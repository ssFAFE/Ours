import React, { useState } from 'react';
import { ImagePlus, Sparkles, Send } from 'lucide-react';

interface Memory {
  id: string;
  senderName: string;
  senderPhoto: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  type: 'image' | 'thought';
  createdAt: string;
}

// Fixed user identities - Cannot be changed from the chat interface
const USER_AHMED = {
  name: 'Ahmed',
  photoKey: 'user_photo_ahmed',
  defaultPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
};

const USER_MARIAM = {
  name: 'Mariam',
  photoKey: 'user_photo_mariam',
  defaultPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
};

export default function MemoriesMuseum() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [activeUser, setActiveUser] = useState<'ahmed' | 'mariam'>('ahmed');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'thought' | 'image'>('all');

  // Helper to get active user's details
  const getActiveUserInfo = () => {
    const isAhmed = activeUser === 'ahmed';
    const userConfig = isAhmed ? USER_AHMED : USER_MARIAM;
    const savedPhoto = localStorage.getItem(userConfig.photoKey);
    return {
      name: userConfig.name,
      photo: savedPhoto || userConfig.defaultPhoto,
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMemory = () => {
    if (!content.trim() && !selectedImage) return;

    const currentUser = getActiveUserInfo();

    const newMemory: Memory = {
      id: Date.now().toString(),
      senderName: currentUser.name,
      senderPhoto: currentUser.photo,
      title: title.trim() || undefined,
      content: content.trim() || undefined,
      imageUrl: selectedImage || undefined,
      type: selectedImage ? 'image' : 'thought',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMemories([newMemory, ...memories]);
    setTitle('');
    setContent('');
    setSelectedImage(null);
  };

  const filteredMemories = memories.filter((item) => {
    if (filter === 'thought') return item.type === 'thought';
    if (filter === 'image') return item.type === 'image';
    return true;
  });

  const thoughtsCount = memories.filter((m) => m.type === 'thought').length;
  const imagesCount = memories.filter((m) => m.type === 'image').length;

  const currentUser = getActiveUserInfo();

  return (
    <div className="mx-auto max-w-md p-4 space-y-4 font-sans text-left" dir="ltr">
      {/* 1. Header Card with Active Poster Indicator */}
      <div className="rounded-3xl border border-rose-100 bg-white/80 p-5 text-center shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-800">
          <span>📷</span>
          <h1>Memories Museum</h1>
        </div>
        <p className="mt-1 text-xs text-rose-500">
          Every beautiful moment and memory shared between you two
        </p>

        {/* Current Poster Selection */}
        <div className="mt-4 pt-3 border-t border-rose-100/60 flex items-center justify-between px-2">
          <span className="text-xs font-semibold text-slate-500">Posting as:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveUser('ahmed')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeUser === 'ahmed'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ahmed
            </button>
            <button
              onClick={() => setActiveUser('mariam')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeUser === 'mariam'
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Mariam
            </button>
          </div>
        </div>
      </div>

      {/* 2. Form with Current User Banner */}
      <div className="rounded-3xl border border-rose-100 bg-white/80 p-5 shadow-sm space-y-4">
        {/* Current Active User Profile Header */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-rose-50/60 border border-rose-100">
          <img
            src={currentUser.photo}
            alt={currentUser.name}
            className="size-10 rounded-full object-cover border-2 border-rose-300 shadow-sm"
          />
          <div>
            <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
            <p className="text-[10px] text-rose-500">Ready to share a new memory</p>
          </div>
        </div>

        {/* Upload Image Button */}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/30 py-3 text-xs font-bold text-rose-600 hover:bg-rose-100/50 transition-all">
          <ImagePlus size={16} />
          <span>Add Photo from Device</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>

        {selectedImage && (
          <div className="relative overflow-hidden rounded-2xl border border-rose-200">
            <img src={selectedImage} alt="Preview" className="h-44 w-full object-cover" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Text Inputs */}
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Memory Title (optional)..."
            className="w-full rounded-2xl border border-rose-100 bg-rose-50/20 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-rose-400 focus:bg-white"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the story or note here..."
            rows={3}
            className="w-full rounded-2xl border border-rose-100 bg-rose-50/20 px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-rose-400 focus:bg-white resize-none"
          />
        </div>

        <button
          onClick={handleSaveMemory}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-3 text-xs font-bold text-white shadow-md hover:bg-rose-600 active:scale-98 transition-all"
        >
          <Send size={14} />
          <span>Post Memory</span>
        </button>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-white/80 p-1.5 shadow-sm">
        <button
          onClick={() => setFilter('thought')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            filter === 'thought' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-rose-500'
          }`}
        >
          Thoughts ({thoughtsCount})
        </button>
        <button
          onClick={() => setFilter('image')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            filter === 'image' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-rose-500'
          }`}
        >
          Photos ({imagesCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            filter === 'all' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-rose-500'
          }`}
        >
          All ({memories.length})
        </button>
      </div>

      {/* 4. Memories Timeline with Sender Avatar & Name */}
      {filteredMemories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white/40 py-12 text-center text-xs text-slate-400">
          No memories recorded yet. Be the first to share one!
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMemories.map((mem) => (
            <div key={mem.id} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm space-y-3">
              {/* Sender Info (Avatar + Name + Timestamp) */}
              <div className="flex items-center gap-3 border-b border-rose-50 pb-2.5">
                <img
                  src={mem.senderPhoto}
                  alt={mem.senderName}
                  className="size-9 rounded-full object-cover border border-rose-200 shadow-xs"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800">{mem.senderName}</h4>
                  <span className="text-[10px] text-slate-400">{mem.createdAt}</span>
                </div>
              </div>

              {/* Memory Content */}
              {mem.imageUrl && (
                <img src={mem.imageUrl} alt={mem.title || 'Memory'} className="h-44 w-full rounded-xl object-cover" />
              )}
              {mem.title && <h3 className="font-semibold text-xs text-slate-900">{mem.title}</h3>}
              {mem.content && <p className="text-xs text-slate-600 leading-relaxed">{mem.content}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
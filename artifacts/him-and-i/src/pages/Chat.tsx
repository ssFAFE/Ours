import React, { useState } from 'react';
import { Send, ImagePlus, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderName: string;
  senderPhoto: string;
  senderId: 'ahmed' | 'mariam';
  content?: string;
  imageUrl?: string;
  timestamp: string;
}

// Fixed user profiles - automatically loads photos set in CoupleProfiles from localStorage
const USERS = {
  ahmed: {
    name: 'Ahmed',
    storageKey: 'user_photo_ahmed',
    defaultPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
  mariam: {
    name: 'Mariam',
    storageKey: 'user_photo_mariam',
    defaultPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
};

export default function MemoriesChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeUser, setActiveUser] = useState<'ahmed' | 'mariam'>('ahmed');
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Get photo from localStorage or fallback
  const getUserPhoto = (userId: 'ahmed' | 'mariam') => {
    const user = USERS[userId];
    return localStorage.getItem(user.storageKey) || user.defaultPhoto;
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

  const handleSendMessage = () => {
    if (!textInput.trim() && !selectedImage) return;

    const currentUser = USERS[activeUser];
    const currentPhoto = getUserPhoto(activeUser);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderName: currentUser.name,
      senderPhoto: currentPhoto,
      senderId: activeUser,
      content: textInput.trim() || undefined,
      imageUrl: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setTextInput('');
    setSelectedImage(null);
  };

  return (
    <div className="mx-auto max-w-md h-[650px] flex flex-col rounded-3xl border border-rose-100 bg-white/90 shadow-lg overflow-hidden font-sans text-left" dir="ltr">

      {/* 1. Chat Top Header */}
      <div className="p-4 bg-rose-50/80 border-b border-rose-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <img
              src={getUserPhoto('ahmed')}
              alt="Ahmed"
              className="size-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src={getUserPhoto('mariam')}
              alt="Mariam"
              className="size-8 rounded-full border-2 border-white object-cover"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Our Private Space</h2>
            <p className="text-[10px] text-rose-500 font-medium">Ahmed & Mariam</p>
          </div>
        </div>

        {/* Switcher for testing who is currently messaging */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-rose-200">
          <button
            onClick={() => setActiveUser('ahmed')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
              activeUser === 'ahmed' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Ahmed
          </button>
          <button
            onClick={() => setActiveUser('mariam')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
              activeUser === 'mariam' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Mariam
          </button>
        </div>
      </div>

      {/* 2. Messages List Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
            <span className="text-3xl">💬</span>
            <p className="text-xs">No messages yet. Start sharing your moments!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.senderId === activeUser;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* User Avatar */}
                <img
                  src={msg.senderPhoto}
                  alt={msg.senderName}
                  className="size-7 rounded-full object-cover border border-rose-200 shrink-0"
                />

                {/* Message Bubble Box */}
                <div className={`max-w-[75%] space-y-1 ${isSelf ? 'items-end text-right' : 'items-start text-left'}`}>
                  {/* Sender Name */}
                  <span className="block text-[10px] font-bold text-slate-400 px-1">
                    {msg.senderName}
                  </span>

                  <div
                    className={`p-3 rounded-2xl shadow-xs text-xs leading-relaxed space-y-2 ${
                      isSelf
                        ? 'bg-rose-500 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-rose-100 rounded-bl-xs'
                    }`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Attachment"
                        className="rounded-xl max-h-48 w-full object-cover"
                      />
                    )}
                    {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                  </div>

                  {/* Timestamp */}
                  <span className="block text-[9px] text-slate-400 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Image Preview Before Sending */}
      {selectedImage && (
        <div className="p-2 bg-rose-50/50 border-t border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={selectedImage} alt="Upload preview" className="size-12 rounded-lg object-cover border" />
            <span className="text-xs text-slate-600 font-medium">Photo ready to send</span>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 4. Bottom Input Bar */}
      <div className="p-3 bg-white border-t border-rose-100 flex items-center gap-2">
        <label className="p-2 rounded-full hover:bg-rose-50 text-rose-500 cursor-pointer transition-colors">
          <ImagePlus size={20} />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>

        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Type a message as ${USERS[activeUser].name}...`}
          className="flex-1 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-rose-300 rounded-full px-4 py-2 text-xs text-slate-800 outline-none transition-all"
        />

        <button
          onClick={handleSendMessage}
          disabled={!textInput.trim() && !selectedImage}
          className="p-2.5 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white shadow-xs transition-all active:scale-95"
        >
          <Send size={16} />
        </button>
      </div>

    </div>
  );
}
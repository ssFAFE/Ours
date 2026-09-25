import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, ImagePlus, X, Paperclip, Mic, Camera, Phone, Video, 
  FileText, Play, Pause, PhoneOff, MicOff, VideoOff, Download
} from 'lucide-react';

interface ChatMessage {
  id: string;
  senderName: string;
  senderPhoto: string;
  senderId: 'ahmed' | 'mariam';
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
  fileInfo?: { name: string; size: string; type: string };
  timestamp: string;
}

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

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeUser, setActiveUser] = useState<'ahmed' | 'mariam'>('ahmed');
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string } | null>(null);

  // Camera Modal & Capture state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Audio Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Call Simulation state
  const [activeCall, setActiveCall] = useState<'voice' | 'video' | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Audio Player state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getUserPhoto = (userId: 'ahmed' | 'mariam') => {
    const user = USERS[userId];
    return localStorage.getItem(user.storageKey) || user.defaultPhoto;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedImage]);

  // Handle Call Timers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeCall) {
      timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [activeCall]);

  // Handle Voice Recording Timers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Image File Select
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

  // General File Attachment
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type.split('/')[1] || 'file'
      });
    }
  };

  // Camera Open & Capture
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const captureCameraPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setSelectedImage(canvas.toDataURL('image/jpeg'));
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  // Voice Note Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        sendAudioMessage(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access is required to record voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioMessage = (audioUrl: string) => {
    const currentUser = USERS[activeUser];
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderName: currentUser.name,
      senderPhoto: getUserPhoto(activeUser),
      senderId: activeUser,
      audioUrl: audioUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Send Standard Message
  const handleSendMessage = () => {
    if (!textInput.trim() && !selectedImage && !selectedFile) return;

    const currentUser = USERS[activeUser];
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderName: currentUser.name,
      senderPhoto: getUserPhoto(activeUser),
      senderId: activeUser,
      content: textInput.trim() || undefined,
      imageUrl: selectedImage || undefined,
      fileInfo: selectedFile || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setTextInput('');
    setSelectedImage(null);
    setSelectedFile(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-2xl h-[780px] flex flex-col rounded-3xl border border-slate-800/80 bg-slate-900/90 shadow-2xl shadow-slate-950 overflow-hidden font-sans text-slate-100 backdrop-blur-xl relative">

      {/* 1. Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <img
              src={getUserPhoto('ahmed')}
              alt="Ahmed"
              className="size-9 rounded-full border-2 border-slate-900 object-cover"
            />
            <img
              src={getUserPhoto('mariam')}
              alt="Mariam"
              className="size-9 rounded-full border-2 border-slate-900 object-cover"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Our Private Space</h2>
            <p className="text-[11px] text-rose-400 font-medium">Ahmed & Mariam • End-to-End Encrypted</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Call Buttons */}
          <button 
            onClick={() => setActiveCall('voice')}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-rose-400 transition-all active:scale-95"
            title="Start Voice Call"
          >
            <Phone size={17} />
          </button>
          <button 
            onClick={() => setActiveCall('video')}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-rose-400 transition-all active:scale-95"
            title="Start Video Call"
          >
            <Video size={17} />
          </button>

          {/* User Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveUser('ahmed')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeUser === 'ahmed' ? 'bg-blue-600 text-white shadow-md shadow-blue-950' : 'text-slate-400'
              }`}
            >
              Ahmed
            </button>
            <button
              onClick={() => setActiveUser('mariam')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeUser === 'mariam' ? 'bg-rose-600 text-white shadow-md shadow-rose-950' : 'text-slate-400'
              }`}
            >
              Mariam
            </button>
          </div>
        </div>
      </div>

      {/* 2. Chat Messages Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/40 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
            <div className="size-16 rounded-full bg-slate-900 border border-slate-800 grid place-items-center text-rose-400">
              <Send size={24} />
            </div>
            <p className="text-xs font-medium text-slate-400">No messages yet. Send a message, audio note, or photo!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.senderId === activeUser;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src={msg.senderPhoto}
                  alt={msg.senderName}
                  className="size-7 rounded-full object-cover border border-slate-800 shrink-0"
                />

                <div className={`max-w-[75%] space-y-1 ${isSelf ? 'items-end text-right' : 'items-start text-left'}`}>
                  <span className="block text-[10px] font-bold text-slate-400 px-1">
                    {msg.senderName}
                  </span>

                  <div
                    className={`p-3.5 rounded-2xl shadow-lg text-xs leading-relaxed space-y-2.5 ${
                      isSelf
                        ? 'bg-rose-600 text-white rounded-br-xs'
                        : 'bg-slate-800 border border-slate-700/70 text-slate-100 rounded-bl-xs'
                    }`}
                  >
                    {/* Image Attachment */}
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Attachment"
                        className="rounded-xl max-h-56 w-full object-cover border border-black/10"
                      />
                    )}

                    {/* File Attachment */}
                    {msg.fileInfo && (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/20 border border-white/10">
                        <FileText size={22} className="text-rose-300 shrink-0" />
                        <div className="flex-1 overflow-hidden text-left">
                          <p className="text-xs font-semibold truncate">{msg.fileInfo.name}</p>
                          <p className="text-[10px] opacity-75">{msg.fileInfo.size}</p>
                        </div>
                        <a href="#" download className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                          <Download size={15} />
                        </a>
                      </div>
                    )}

                    {/* Audio Note */}
                    {msg.audioUrl && (
                      <div className="flex items-center gap-3 pr-2 py-1 min-w-[180px]">
                        <button
                          onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                          className="size-8 rounded-full bg-white/20 hover:bg-white/30 grid place-items-center transition-all"
                        >
                          {playingAudioId === msg.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                        </button>
                        <div className="flex-1">
                          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                            <div className={`h-full bg-white transition-all ${playingAudioId === msg.id ? 'w-full duration-3000' : 'w-0'}`} />
                          </div>
                          <span className="text-[9px] opacity-80 mt-1 block">Voice Message</span>
                        </div>
                      </div>
                    )}

                    {/* Text Content */}
                    {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                  </div>

                  <span className="block text-[9px] text-slate-500 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Previews Area */}
      {selectedImage && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={selectedImage} alt="Upload preview" className="size-12 rounded-xl object-cover border border-slate-700" />
            <span className="text-xs text-slate-300 font-medium">Image attached</span>
          </div>
          <button onClick={() => setSelectedImage(null)} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400">
            <X size={14} />
          </button>
        </div>
      )}

      {selectedFile && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-rose-400">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-200 font-medium truncate max-w-[200px]">{selectedFile.name}</p>
              <p className="text-[10px] text-slate-400">{selectedFile.size}</p>
            </div>
          </div>
          <button onClick={() => setSelectedFile(null)} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 3. Bottom Input Controls */}
      <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        {/* Attachment Options */}
        <label className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer transition-all active:scale-95" title="Attach Image">
          <ImagePlus size={18} />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>

        <label className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer transition-all active:scale-95" title="Attach Document">
          <Paperclip size={18} />
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>

        <button 
          onClick={startCamera}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-all active:scale-95"
          title="Take Photo"
        >
          <Camera size={18} />
        </button>

        {/* Text Field or Voice Recorder Display */}
        {isRecording ? (
          <div className="flex-1 bg-rose-950/40 border border-rose-500/30 rounded-xl px-4 py-2 flex items-center justify-between animate-pulse">
            <span className="text-xs text-rose-400 font-semibold flex items-center gap-2">
              <span className="size-2 rounded-full bg-rose-500 animate-ping" />
              Recording... ({formatTime(recordingTime)})
            </span>
            <button onClick={stopRecording} className="text-xs bg-rose-600 text-white px-3 py-1 rounded-lg font-bold">
              Send Voice
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message as ${USERS[activeUser].name}...`}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-rose-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        )}

        {/* Voice Note Record / Send Button */}
        {!textInput && !selectedImage && !selectedFile ? (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2.5 rounded-xl transition-all active:scale-95 ${
              isRecording ? 'bg-rose-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400'
            }`}
            title="Record Voice Note"
          >
            <Mic size={18} />
          </button>
        ) : (
          <button
            onClick={handleSendMessage}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950 transition-all active:scale-95"
          >
            <Send size={18} />
          </button>
        )}
      </div>

      {/* 4. Live Camera Modal */}
      {isCameraOpen && (
        <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col items-center justify-between p-6">
          <div className="w-full flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Capture Photo</h3>
            <button onClick={closeCamera} className="p-2 rounded-full bg-slate-800 text-slate-400">
              <X size={18} />
            </button>
          </div>
          <div className="relative w-full max-w-sm aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>
          <button onClick={captureCameraPhoto} className="size-16 rounded-full bg-rose-600 border-4 border-slate-900 grid place-items-center text-white shadow-xl">
            <Camera size={24} />
          </button>
        </div>
      )}

      {/* 5. Call Modal */}
      {activeCall && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-between py-12 px-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-rose-400 font-bold">
              {activeCall === 'video' ? 'Video Call' : 'Voice Call'}
            </span>
            <h3 className="text-xl font-bold text-white">
              {activeUser === 'ahmed' ? 'Mariam' : 'Ahmed'}
            </h3>
            <p className="text-xs text-slate-400">{formatTime(callDuration)}</p>
          </div>

          <div className="relative">
            <img
              src={getUserPhoto(activeUser === 'ahmed' ? 'mariam' : 'ahmed')}
              alt="Partner"
              className="size-32 rounded-full border-4 border-rose-500/30 object-cover shadow-2xl animate-pulse"
            />
          </div>

          {/* Call Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full border transition-all ${
                isMuted ? 'bg-rose-600/20 border-rose-500 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <button
              onClick={() => setActiveCall(null)}
              className="p-5 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-950 hover:bg-rose-700 transition-all active:scale-95"
            >
              <PhoneOff size={24} />
            </button>

            {activeCall === 'video' && (
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-4 rounded-full border transition-all ${
                  isVideoOff ? 'bg-rose-600/20 border-rose-500 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
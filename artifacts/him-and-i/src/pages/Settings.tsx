import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Heart, Moon, Palette, SlidersHorizontal, Sparkles, Sun, Upload, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';
import { HimShell } from '@/components/HimShell';

interface ThemeOption {
  id: string;
  name: string;
  detail: string;
  color: string;
  bgGradient: string;
}

const themes: ThemeOption[] = [
  { id: 'daylight', name: 'Daylight', detail: 'Warm and soft with subtle rose accents', color: 'bg-rose-500', bgGradient: 'from-rose-50 via-pink-50 to-rose-100' },
  { id: 'garden', name: 'Garden', detail: 'Peaceful green with relaxing olive tones', color: 'bg-emerald-500', bgGradient: 'from-emerald-50 via-teal-50 to-emerald-100' },
  { id: 'sunroom', name: 'Sunroom', detail: 'Cozy warm apricot with rich accents', color: 'bg-amber-500', bgGradient: 'from-amber-50 via-orange-50 to-amber-100' },
];

export default function Settings() {
  // 1. Profile state (Names and Avatars)
  const [partner1, setPartner1] = useState('Ahmed');
  const [partner2, setPartner2] = useState('Mariam');
  const [avatar1, setAvatar1] = useState<string | null>(null);
  const [avatar2, setAvatar2] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // 2. Appearance & Theme state
  const [selectedTheme, setSelectedTheme] = useState('daylight');
  const [customBg, setCustomBg] = useState<string | null>(null);

  // 3. Preferences state
  const [reducedMotion, setReducedMotion] = useState(false);
  const [daylightMode, setDaylightMode] = useState(true);

  // Load stored settings on mount
  useEffect(() => {
    const savedP1 = localStorage.getItem('app_partner1') || localStorage.getItem('user_photo_ahmed');
    const savedP2 = localStorage.getItem('app_partner2') || localStorage.getItem('user_photo_mariam');
    const savedAv1 = localStorage.getItem('app_avatar1') || localStorage.getItem('user_photo_ahmed');
    const savedAv2 = localStorage.getItem('app_avatar2') || localStorage.getItem('user_photo_mariam');
    const savedTheme = localStorage.getItem('app_theme');
    const savedBg = localStorage.getItem('app_custom_bg');
    const savedMotion = localStorage.getItem('app_reduced_motion');

    if (savedP1) setPartner1(localStorage.getItem('app_partner1') || 'Ahmed');
    if (savedP2) setPartner2(localStorage.getItem('app_partner2') || 'Mariam');
    if (savedAv1) setAvatar1(savedAv1);
    if (savedAv2) setAvatar2(savedAv2);
    if (savedTheme) setSelectedTheme(savedTheme);
    if (savedBg) setCustomBg(savedBg);
    if (savedMotion) setReducedMotion(JSON.parse(savedMotion));
  }, []);

  // Save profile updates to LocalStorage
  const handleSaveProfile = () => {
    localStorage.setItem('app_partner1', partner1);
    localStorage.setItem('app_partner2', partner2);
    if (avatar1) {
      localStorage.setItem('app_avatar1', avatar1);
      localStorage.setItem('user_photo_ahmed', avatar1);
    }
    if (avatar2) {
      localStorage.setItem('app_avatar2', avatar2);
      localStorage.setItem('user_photo_mariam', avatar2);
    }
    setIsEditingProfile(false);
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem('app_theme', themeId);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>, target: '1' | '2') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === '1') {
          setAvatar1(result);
          localStorage.setItem('app_avatar1', result);
          localStorage.setItem('user_photo_ahmed', result);
        } else {
          setAvatar2(result);
          localStorage.setItem('app_avatar2', result);
          localStorage.setItem('user_photo_mariam', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomBg(result);
        localStorage.setItem('app_custom_bg', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBg = () => {
    setCustomBg(null);
    localStorage.removeItem('app_custom_bg');
  };

  const toggleMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('app_reduced_motion', JSON.stringify(newValue));
  };

  return (
    <HimShell>
      <div className={`mx-auto max-w-3xl transition-all text-left ${reducedMotion ? '' : 'page-enter'}`} dir="ltr">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground no-underline hover:text-primary transition-colors" data-testid="link-back-home">
          <ArrowLeft size={14} /> Back to our place
        </Link>

        <header className="mb-8">
          <p className="mono text-[10px] uppercase tracking-[.2em] text-primary font-bold">The little details</p>
          <h1 className="display mt-2 text-4xl sm:text-5xl font-semibold tracking-[-.05em]">Make it ours<span className="text-secondary-foreground">.</span></h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Customize your space, colors, avatars, and names so it truly feels like home.</p>
        </header>

        {/* 1. Profile Settings Section */}
        <section className="mb-6 rounded-[28px] border border-card-border bg-card/90 backdrop-blur-md p-6 shadow-[var(--shadow-soft)] sm:p-8 transition-all">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-rose-100 text-rose-600"><Heart size={18} fill="currentColor" /></span>
              <div>
                <p className="mono text-[9px] uppercase tracking-[.17em] text-muted-foreground">Our profile</p>
                <h2 className="display text-2xl font-semibold">The two of you</h2>
              </div>
            </div>
            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)} 
              className="rounded-xl border border-border bg-card p-2.5 text-muted-foreground hover:text-primary transition-all active:scale-95"
              title="Edit Profile"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {!isEditingProfile ? (
            <div className="flex items-center gap-4 rounded-2xl bg-muted/50 p-4 border border-border/40">
              <div className="flex -space-x-3">
                {avatar1 ? (
                  <img src={avatar1} alt={partner1} className="size-12 rounded-2xl object-cover border-2 border-card shadow-sm" />
                ) : (
                  <span className="grid size-12 place-items-center rounded-2xl border-2 border-card bg-rose-500 text-sm font-bold text-white shadow-sm">{partner1.charAt(0)}</span>
                )}
                {avatar2 ? (
                  <img src={avatar2} alt={partner2} className="size-12 rounded-2xl object-cover border-2 border-card shadow-sm" />
                ) : (
                  <span className="grid size-12 place-items-center rounded-2xl border-2 border-card bg-amber-500 text-sm font-bold text-white shadow-sm">{partner2.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{partner1} & {partner2}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Together in your private space ❤️</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 rounded-2xl bg-muted/30 p-4 border border-border/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Partner 1 Name:</label>
                  <input 
                    type="text" 
                    value={partner1} 
                    onChange={(e) => setPartner1(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm outline-none focus:border-primary"
                  />
                  <label className="flex items-center gap-2 text-xs bg-card hover:bg-muted p-2.5 rounded-xl border border-border cursor-pointer transition-all">
                    <Upload size={14} /> Partner 1 Photo
                    <input type="file" accept="image/*" onChange={(e) => handleAvatarChange(e, '1')} className="hidden" />
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Partner 2 Name:</label>
                  <input 
                    type="text" 
                    value={partner2} 
                    onChange={(e) => setPartner2(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm outline-none focus:border-primary"
                  />
                  <label className="flex items-center gap-2 text-xs bg-card hover:bg-muted p-2.5 rounded-xl border border-border cursor-pointer transition-all">
                    <Upload size={14} /> Partner 2 Photo
                    <input type="file" accept="image/*" onChange={(e) => handleAvatarChange(e, '2')} className="hidden" />
                  </label>
                </div>
              </div>

              <button 
                onClick={handleSaveProfile}
                className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl text-xs shadow-sm hover:opacity-90 transition-all active:scale-98"
              >
                Save Changes
              </button>
            </div>
          )}
        </section>

        {/* 2. Atmosphere & Themes Section */}
        <section className="mb-6 rounded-[28px] border border-card-border bg-card/90 backdrop-blur-md p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600"><Palette size={18} /></span>
            <div>
              <p className="mono text-[9px] uppercase tracking-[.17em] text-muted-foreground">Atmosphere</p>
              <h2 className="display text-2xl font-semibold">Choose your color story</h2>
            </div>
          </div>

          <div className="space-y-2.5">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                  selectedTheme === theme.id ? 'border-primary bg-primary/10 shadow-sm' : 'border-transparent bg-muted/40 hover:border-border'
                }`}
              >
                <span className={`size-10 rounded-xl ${theme.color} shadow-inner flex items-center justify-center text-white text-xs font-bold`}>
                  {theme.name.charAt(0)}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{theme.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{theme.detail}</span>
                </span>
                <span className={`grid size-6 place-items-center rounded-full border ${selectedTheme === theme.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                  {selectedTheme === theme.id && <Check size={13} />}
                </span>
              </button>
            ))}
          </div>

          {/* Custom App Background Upload */}
          <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Custom App Background</p>
              <p className="text-xs text-muted-foreground">Upload a custom wallpaper for all app pages</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer transition-all border border-primary/20">
                Choose Image
                <input type="file" accept="image/*" onChange={handleCustomBgChange} className="hidden" />
              </label>
              {customBg && (
                <button onClick={resetBg} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Remove Background">
                  <RefreshCw size={14} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 3. System Preferences Section */}
        <section className="rounded-[28px] border border-card-border bg-card/90 backdrop-blur-md p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600"><Sparkles size={18} /></span>
            <div>
              <p className="mono text-[9px] uppercase tracking-[.17em] text-muted-foreground">Little preferences</p>
              <h2 className="display text-2xl font-semibold">How it should feel</h2>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-border/70 py-4">
            <div className="flex items-center gap-3">
              <Sun size={18} className="text-amber-500" />
              <div>
                <p className="text-sm font-semibold">Daylight mode</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Maintain warm tones and comfortable brightness.</p>
              </div>
            </div>
            <button 
              onClick={() => setDaylightMode(!daylightMode)}
              className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800"
            >
              {daylightMode ? 'On' : 'Off'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-indigo-500" />
              <div>
                <p className="text-sm font-semibold">Reduce motion</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Minimize page animations for easier viewing.</p>
              </div>
            </div>
            <button
              onClick={toggleMotion}
              className={`relative h-6 w-11 rounded-full transition-colors ${reducedMotion ? 'bg-primary' : 'bg-muted'}`}
              data-testid="button-toggle-motion"
            >
              <span className={`absolute top-1 size-4 rounded-full bg-card shadow-sm transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>
      </div>
    </HimShell>
  );
}
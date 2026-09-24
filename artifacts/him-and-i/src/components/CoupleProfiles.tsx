import { useEffect, useState, type ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';

type ProfileSlotProps = {
  name: string;
  accent: string;
  storageKey: string;
};

function ProfileSlot({ name, accent, storageKey }: ProfileSlotProps) {
  const [photo, setPhoto] = useState<string>('');

  // تحميل الصورة المحفوظة فور فتح المكون
  useEffect(() => {
    const savedPhoto = localStorage.getItem(storageKey);
    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
  }, [storageKey]);

  // معالجة اختيار الصورة وتحويلها لـ Base64 لحفظها دائمًا
  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setPhoto(base64Image);
      localStorage.setItem(storageKey, base64Image);
    };
    reader.readAsDataURL(file);
  }

  // إزالة الصورة مسحها من الـ Storage
  function removePhoto() {
    setPhoto('');
    localStorage.removeItem(storageKey);
  }

  return (
    <div className="flex flex-col items-center gap-2 group relative">
      <label 
        htmlFor={`profile-photo-${storageKey}`}
        className="relative block cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <div className={`size-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${accent} ${photo ? 'border-solid border-rose-400 shadow-md' : 'border-rose-200 bg-rose-50/50 hover:bg-rose-100/50'}`}>
          {photo ? (
            <img src={photo} alt={`${name}'s profile`} className="size-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-rose-400">
              <ImagePlus size={22} strokeWidth={1.8} />
              <span className="text-[10px] font-medium">إضافة</span>
            </div>
          )}
        </div>

        <input
          id={`profile-photo-${storageKey}`}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={handlePhoto}
        />
      </label>

      <span className="text-xs font-semibold text-rose-950">{name}</span>

      {photo && (
        <button
          type="button"
          onClick={removePhoto}
          className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 shadow-md hover:bg-rose-600 transition-all active:scale-90"
          aria-label={`Remove ${name}'s photo`}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}

export function CoupleProfiles() {
  return (
    <section className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-rose-100 shadow-sm my-4" aria-label="Couple profile photos">
      <div className="mb-4 text-center sm:text-right">
        <p className="text-xs font-bold uppercase tracking-wider text-rose-500">الملف الشخصي</p>
        <p className="mt-0.5 text-xs text-stone-500">اختر الصور التي تود ظهورها لك ولشريكتك</p>
      </div>

      <div className="flex items-center justify-center gap-6 pt-2">
        <ProfileSlot name="أحمد" accent="border-blue-300" storageKey="user_photo_ahmed" />
        <span className="text-xl font-bold text-rose-300">+</span>
        <ProfileSlot name="مريم" accent="border-pink-300" storageKey="user_photo_mariam" />
      </div>
    </section>
  );
}
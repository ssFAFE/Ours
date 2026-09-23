import { useEffect, useState, type ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';

type ProfileSlotProps = {
  name: 'Ahmed' | 'Mariam';
  accent: string;
};

function ProfileSlot({ name, accent }: ProfileSlotProps) {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview('');
  }

  return (
    <div className="profile-slot group">
      <label className="relative block cursor-pointer" htmlFor={`profile-photo-${name.toLowerCase()}`}>
        <span className={`profile-photo ${accent} ${preview ? 'profile-photo-filled' : ''}`}>
          {preview ? (
            <img src={preview} alt={`${name}'s profile`} className="size-full object-cover" />
          ) : (
            <ImagePlus size={22} strokeWidth={1.8} />
          )}
        </span>
        {!preview && <span className="profile-add-label">Add photo</span>}
        <input
          id={`profile-photo-${name.toLowerCase()}`}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={handlePhoto}
        />
      </label>
      <span className="profile-name">{name}</span>
      {preview && (
        <button type="button" onClick={removePhoto} className="profile-remove" aria-label={`Remove ${name}'s photo`}>
          <X size={12} />
        </button>
      )}
    </div>
  );
}

export function CoupleProfiles() {
  return (
    <section className="profiles-strip" aria-label="Couple profile photos">
      <div>
        <p className="mono text-[10px] uppercase tracking-[.2em] text-primary">Your profiles</p>
        <p className="mt-1 text-xs text-muted-foreground">Add the photos you want to use.</p>
      </div>
      <div className="flex items-start gap-4">
        <ProfileSlot name="Ahmed" accent="profile-photo-blue" />
        <span className="profile-join">+</span>
        <ProfileSlot name="Mariam" accent="profile-photo-pink" />
      </div>
    </section>
  );
}
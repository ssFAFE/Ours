import { ArrowLeft, Check, Heart, Moon, Palette, SlidersHorizontal, Sparkles, Sun } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';
import { HimShell } from '@/components/HimShell';

const themes = [
  { name: 'Daylight', detail: 'warm paper + blue ink', color: 'bg-[#404a9b]' },
  { name: 'Garden', detail: 'soft green + plum', color: 'bg-[#789b83]' },
  { name: 'Sunroom', detail: 'apricot + midnight', color: 'bg-[#d88967]' },
];

export default function Settings() {
  const [selectedTheme, setSelectedTheme] = useState('Daylight');
  const [reducedMotion, setReducedMotion] = useState(false);
  return (
    <HimShell>
      <div className="page-enter mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground no-underline hover:text-primary" data-testid="link-back-home"><ArrowLeft size={14} /> Back to our place</Link>
        <header className="mb-8"><p className="mono text-[10px] uppercase tracking-[.2em] text-primary">The little details</p><h1 className="display mt-3 text-5xl font-semibold tracking-[-.05em]">Make it ours<span className="text-secondary-foreground">.</span></h1><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">A few quiet choices to make this place feel even more like the two of you.</p></header>
        <section className="mb-5 rounded-[28px] border border-card-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="mb-7 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#f6d5ce] text-primary"><Heart size={17} fill="currentColor" /></span><div><p className="mono text-[9px] uppercase tracking-[.17em] text-muted-foreground">Our profile</p><h2 className="display text-2xl font-semibold">The two of you</h2></div></div>
          <div className="flex items-center gap-4 rounded-2xl bg-muted/55 p-4"><div className="flex -space-x-2"><span className="grid size-12 place-items-center rounded-2xl border-2 border-card bg-primary text-sm font-bold text-primary-foreground">A</span><span className="grid size-12 place-items-center rounded-2xl border-2 border-card bg-secondary text-sm font-bold text-secondary-foreground">M</span></div><div><p className="text-sm font-bold">Ahmed & Mariam</p><p className="mt-1 text-xs text-muted-foreground">Together since the beginning of your favorite story</p></div><button className="ml-auto rounded-xl border border-border bg-card p-2.5 text-muted-foreground hover:text-primary" data-testid="button-edit-profile"><SlidersHorizontal size={15} /></button></div>
        </section>
        <section className="mb-5 rounded-[28px] border border-card-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="mb-7 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#d9d7ed] text-primary"><Palette size={17} /></span><div><p className="mono text-[9px] uppercase tracking-[.17em] text-muted-foreground">Atmosphere</p><h2 className="display text-2xl font-semibold">Choose your color story</h2></div></div>
          <div className="space-y-2">
            {themes.map((theme) => <button key={theme.name} onClick={() => setSelectedTheme(theme.name)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${selectedTheme === theme.name ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/45 hover:border-border'}`} data-testid={`button-theme-${theme.name.toLowerCase()}`}><span className={`size-10 rounded-xl ${theme.color} shadow-inner`} /><span className="flex-1"><span className="block text-sm font-semibold">{theme.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{theme.detail}</span></span><span className={`grid size-6 place-items-center rounded-full border ${selectedTheme === theme.name ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{selectedTheme === theme.name && <Check size={13} />}</span></button>)}
          </div>
        </section>
        <section className="rounded-[28px] border border-card-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e4eee6] text-primary"><Sparkles size={17} /></span><div><p className="mono text-[9px] uppercase tracking-[.17em] text-muted-foreground">Little preferences</p><h2 className="display text-2xl font-semibold">How it should feel</h2></div></div>
          <div className="flex items-center justify-between gap-4 border-b border-border/70 py-4"><div className="flex items-center gap-3"><Sun size={17} className="text-secondary-foreground" /><div><p className="text-sm font-semibold">Daylight mode</p><p className="mt-1 text-xs text-muted-foreground">Keep the warm paper and bright ink.</p></div></div><span className="rounded-full bg-[#e4eee6] px-3 py-1 text-[10px] font-bold text-primary" data-testid="status-theme">On</span></div>
          <div className="flex items-center justify-between gap-4 py-4"><div className="flex items-center gap-3"><Moon size={17} className="text-primary" /><div><p className="text-sm font-semibold">Reduce motion</p><p className="mt-1 text-xs text-muted-foreground">Keep transitions gentle and still.</p></div></div><button onClick={() => setReducedMotion(!reducedMotion)} className={`relative h-6 w-11 rounded-full transition-colors ${reducedMotion ? 'bg-primary' : 'bg-muted'}`} data-testid="button-toggle-motion"><span className={`absolute top-1 size-4 rounded-full bg-card shadow-sm transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
        </section>
      </div>
    </HimShell>
  );
}

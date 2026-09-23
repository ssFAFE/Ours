import { ArrowLeft, ArrowUpRight, Clapperboard, Play, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { HimShell } from '@/components/HimShell';

export default function Reels() {
  return (
    <HimShell>
      <div className="page-enter mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground no-underline hover:text-primary" data-testid="link-back-home"><ArrowLeft size={14} /> Back to our place</Link>
        <section className="relative overflow-hidden rounded-[34px] bg-primary px-6 py-16 text-center text-primary-foreground shadow-[0_20px_45px_rgba(64,74,155,.2)] sm:px-16 sm:py-24">
          <div className="absolute -left-16 -top-20 size-56 rounded-full border-[28px] border-secondary/25" />
          <div className="absolute -bottom-24 -right-8 size-64 rounded-full border border-primary-foreground/20" />
          <div className="relative z-[1]">
            <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-primary-foreground/10"><Clapperboard size={28} strokeWidth={1.5} /></span>
            <p className="mono mt-8 text-[10px] uppercase tracking-[.22em] text-primary-foreground/60">Coming soon · for us only</p>
            <h1 className="display mt-4 text-5xl font-semibold leading-[.95] tracking-[-.05em] sm:text-7xl">Our reels<span className="text-secondary">.</span></h1>
            <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-primary-foreground/75">A little moving scrapbook for the funny, ordinary, impossible-to-explain moments that are better in motion.</p>
            <div className="mx-auto mt-10 flex max-w-xs items-center gap-3 rounded-2xl bg-primary-foreground/10 p-3 text-left">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Play size={16} fill="currentColor" /></span>
              <div><p className="text-xs font-semibold">The first reel is yours to make</p><p className="mt-0.5 text-[11px] text-primary-foreground/60">We’re setting up the projector.</p></div>
            </div>
          </div>
        </section>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-card-border bg-card p-5 shadow-[var(--shadow-soft)]"><Sparkles size={18} className="text-secondary-foreground" /><p className="mt-5 display text-xl font-semibold">No audience.</p><p className="mt-1 text-xs leading-5 text-muted-foreground">No performing. Just the two of you and the clips that make you laugh again.</p></div>
          <Link href="/memories" className="rounded-[24px] border border-card-border bg-[#e4eee6] p-5 no-underline transition-transform hover:-translate-y-1" data-testid="link-reels-memories"><Clapperboard size={18} className="text-primary" /><p className="mt-5 display text-xl font-semibold text-foreground">Browse still moments.</p><p className="mt-1 text-xs leading-5 text-muted-foreground">While we build the moving shelf, visit the memory gallery.</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">Open memories <ArrowUpRight size={13} /></span></Link>
        </div>
      </div>
    </HimShell>
  );
}

import { Link, useLocation } from 'wouter';
import { Heart, House, Images, Clapperboard, MessageCircle, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

type HimShellProps = { children: ReactNode };

const navigation = [
  { href: '/', label: 'Our place', icon: House },
  { href: '/memories', label: 'Memories', icon: Images },
  { href: '/reels', label: 'Our reels', icon: Clapperboard },
  { href: '/chat', label: 'Private chat', icon: MessageCircle },
];

export function HimShell({ children }: HimShellProps) {
  const [location] = useLocation();
  return (
    <div className="paper-grain min-h-[100dvh] bg-background">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-[236px] flex-col border-r border-border bg-[#fff0f6]/95 px-5 py-6 lg:flex">
        <Link href="/" className="mb-12 flex items-center gap-3 no-underline" data-testid="link-brand">
           <span className="relative grid size-10 place-items-center rounded-[14px] bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(221,49,119,.28)]">
            <Heart size={18} fill="currentColor" strokeWidth={1.8} />
            <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-secondary" />
          </span>
          <span>
            <span className="display block text-[21px] font-semibold leading-none tracking-tight">Him<span className="text-secondary-foreground">&</span>I</span>
            <span className="mono mt-1 block text-[9px] uppercase tracking-[.2em] text-muted-foreground">our little world</span>
          </span>
        </Link>

        <p className="mono mb-3 px-3 text-[9px] uppercase tracking-[.18em] text-muted-foreground">Together</p>
        <nav className="space-y-1.5" aria-label="Primary navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link
                key={href}
                href={href}
                data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
                className={`nav-link flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold no-underline ${active ? 'nav-link-active' : 'text-muted-foreground hover:bg-card hover:text-foreground'}`}
              >
                <Icon size={17} strokeWidth={active ? 2.3 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

         <div className="mt-auto rounded-[22px] bg-gradient-to-br from-[#ffe0ec] via-[#fbdff4] to-[#e6dcff] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="mono text-[9px] uppercase tracking-[.15em] text-muted-foreground">Tiny reminder</span>
            <Sparkles size={15} className="text-primary" />
          </div>
          <p className="display text-lg leading-tight text-foreground">The best part of today is that it is ours.</p>
        </div>
        <Link href="/settings" className="mt-4 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-muted-foreground no-underline hover:bg-card hover:text-foreground" data-testid="link-nav-settings">
          <SlidersHorizontal size={17} strokeWidth={1.8} />
          Make it ours
        </Link>
      </aside>

      <div className="lg:pl-[236px]">
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-md sm:px-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5 no-underline" data-testid="link-mobile-brand">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Heart size={16} fill="currentColor" /></span>
            <span className="display text-xl font-semibold">Him<span className="text-secondary-foreground">&</span>I</span>
          </Link>
          <Link href="/settings" className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground" data-testid="link-mobile-settings">
            <SlidersHorizontal size={17} />
          </Link>
        </header>
        <main className="mx-auto max-w-[1180px] px-5 py-7 pb-28 sm:px-8 lg:px-12 lg:py-10 lg:pb-12">{children}</main>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-around rounded-[23px] border border-border/80 bg-card/95 p-2 shadow-[0_12px_30px_rgba(42,43,72,.14)] backdrop-blur-lg lg:hidden" aria-label="Mobile navigation">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = location === href;
          return (
            <Link key={href} href={href} className={`nav-link flex min-w-0 flex-col items-center gap-1 rounded-[17px] px-3 py-2 text-[10px] font-semibold no-underline ${active ? 'nav-link-active' : 'text-muted-foreground'}`} data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>
              <Icon size={18} strokeWidth={active ? 2.3 : 1.7} />
              <span className="max-w-[70px] truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

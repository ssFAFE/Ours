import { Link, useLocation } from 'wouter';
import { Heart, House, Images, Clapperboard, MessageCircle, SlidersHorizontal, Sparkles, LogOut } from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';

type HimShellProps = { children: ReactNode };

const navigation = [
  { href: '/', label: 'Our place', icon: House },
  { href: '/memories', label: 'Memories', icon: Images },
  { href: '/reels', label: 'Our reels', icon: Clapperboard },
  { href: '/chat', label: 'Private chat', icon: MessageCircle },
];

export function HimShell({ children }: HimShellProps) {
  const [location] = useLocation();
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [partnerNames, setPartnerNames] = useState({ p1: 'Him', p2: 'I' });

  // جلب إعدادات المستخدم المخزنة
  useEffect(() => {
    const bg = localStorage.getItem('app_custom_bg');
    const p1 = localStorage.getItem('app_partner1');
    const p2 = localStorage.getItem('app_partner2');

    if (bg) setCustomBg(bg);
    if (p1 || p2) {
      setPartnerNames({
        p1: p1 || 'Him',
        p2: p2 || 'I',
      });
    }
  }, []);

  return (
    <div 
      className="paper-grain relative min-h-[100dvh] bg-background text-foreground transition-colors duration-300"
      style={customBg ? { backgroundImage: `url(${customBg})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' } : {}}
    >
      {/* طبقة حماية بصرية للوضوح في حال استخدام خلفية صورة مخصصة */}
      {customBg && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm -z-0" />}

      <div className="relative z-10">
        {/* الشريط الجانبي للشاشات الكبيرة (Desktop Sidebar) */}
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-[240px] flex-col border-r border-border/60 bg-card/85 px-5 py-6 backdrop-blur-xl lg:flex">
          <Link href="/" className="mb-10 flex items-center gap-3 no-underline transition-transform hover:scale-[1.02]" data-testid="link-brand">
            <span className="relative grid size-10 place-items-center rounded-[14px] bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(221,49,119,.28)]">
              <Heart size={18} fill="currentColor" strokeWidth={1.8} />
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-amber-400 ring-2 ring-card" />
            </span>
            <span>
              <span className="display block text-xl font-semibold leading-none tracking-tight">
                {partnerNames.p1}<span className="text-primary">&</span>{partnerNames.p2}
              </span>
              <span className="mono mt-1.5 block text-[9px] uppercase tracking-[.2em] text-muted-foreground">
                our little world
              </span>
            </span>
          </Link>

          <p className="mono mb-3 px-3 text-[9px] font-bold uppercase tracking-[.18em] text-muted-foreground">Together</p>

          <nav className="space-y-1.5" aria-label="Primary navigation">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return (
                <Link
                  key={href}
                  href={href}
                  data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
                  className={`nav-link flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold no-underline transition-all active:scale-95 ${
                    active 
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' 
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* بطاقة التذكير الهادئة */}
          <div className="mt-auto rounded-[22px] border border-border/50 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-purple-500/10 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="mono text-[9px] font-bold uppercase tracking-[15em] text-primary">Tiny reminder</span>
              <Sparkles size={14} className="text-primary animate-pulse" />
            </div>
            <p className="display text-sm leading-relaxed text-foreground/90 font-medium">
              "The best part of today is that it is ours."
            </p>
          </div>

          <Link 
            href="/settings" 
            className={`mt-4 flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold no-underline transition-all ${
              location === '/settings' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`} 
            data-testid="link-nav-settings"
          >
            <SlidersHorizontal size={18} strokeWidth={1.8} />
            Make it ours
          </Link>
        </aside>

        {/* الشريط العلوي للهواتف (Mobile Header) */}
        <div className="lg:pl-[240px]">
          <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-border/60 bg-background/80 px-5 backdrop-blur-xl sm:px-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5 no-underline" data-testid="link-mobile-brand">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Heart size={16} fill="currentColor" />
              </span>
              <span className="display text-lg font-semibold">
                {partnerNames.p1}<span className="text-primary">&</span>{partnerNames.p2}
              </span>
            </Link>

            <Link 
              href="/settings" 
              className="grid size-9 place-items-center rounded-xl border border-border/80 bg-card/60 text-muted-foreground transition-all active:scale-90" 
              data-testid="link-mobile-settings"
            >
              <SlidersHorizontal size={16} />
            </Link>
          </header>

          {/* محتوى الصفحة الرئيسي */}
          <main className="mx-auto max-w-[1180px] px-4 py-6 pb-28 sm:px-8 lg:px-12 lg:py-10 lg:pb-12">
            {children}
          </main>
        </div>

        {/* الشريط السفلي للتنقل بين الصفحات في للهواتف (Mobile Bottom Navigation) */}
        <nav className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-around rounded-[24px] border border-border/80 bg-card/90 p-2 shadow-lg backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link 
                key={href} 
                href={href} 
                className={`nav-link flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[18px] py-2 text-[10px] font-semibold no-underline transition-all active:scale-95 ${
                  active 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`} 
                data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}
              >
                <Icon size={18} strokeWidth={active ? 2.3 : 1.7} />
                <span className="max-w-[65px] truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
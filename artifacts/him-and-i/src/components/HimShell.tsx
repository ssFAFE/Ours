import { Link, useLocation } from "wouter";
import {
  Heart,
  House,
  Images,
  Clapperboard,
  MessageCircle,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";

type HimShellProps = { children: ReactNode };

const navigation = [
  { href: "/", label: "Our Place", icon: House },
  { href: "/memories", label: "Memories", icon: Images },
  { href: "/reels", label: "Our Reels", icon: Clapperboard },
  { href: "/chat", label: "Private Chat", icon: MessageCircle },
];

export function HimShell({ children }: HimShellProps) {
  const [location] = useLocation();
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [partnerNames, setPartnerNames] = useState({
    p1: "Ahmed",
    p2: "Mariam",
  });

  useEffect(() => {
    const bg = localStorage.getItem("app_custom_bg");
    const p1 = localStorage.getItem("app_partner1");
    const p2 = localStorage.getItem("app_partner2");

    if (bg) setCustomBg(bg);
    if (p1 || p2) {
      setPartnerNames({
        p1: p1 || "Ahmed",
        p2: p2 || "Mariam",
      });
    }
  }, []);

  return (
    <div
      className="relative min-h-[100dvh] bg-slate-950 text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white"
      style={
        customBg
          ? {
              backgroundImage: `url(${customBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : {}
      }
    >
      {/* Background Overlay for Image Themes */}
      {customBg && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-0" />
      )}

      <div className="relative z-10 flex min-h-[100dvh] flex-col lg:flex-row">
        {/* Desktop Sidebar Navigation */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-800/80 bg-slate-900/90 px-5 py-6 backdrop-blur-2xl lg:flex">
          <Link
            href="/"
            className="mb-8 flex items-center gap-3 no-underline transition-all hover:opacity-90"
          >
            <span className="relative grid size-10 place-items-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg shadow-rose-500/25">
              <Heart size={20} fill="currentColor" strokeWidth={0} />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white">
                {partnerNames.p1} <span className="text-rose-500">&</span>{" "}
                {partnerNames.p2}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400">
                Our Private Space
              </span>
            </div>
          </Link>

          <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation
          </div>

          <nav
            className="space-y-1.5 flex-1"
            aria-label="Desktop primary navigation"
          >
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-rose-600/15 text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-950"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <Icon
                    size={18}
                    className={active ? "text-rose-400" : "text-slate-400"}
                    strokeWidth={2}
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Daily Reminder Widget */}
          <div className="mb-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-rose-950/40 via-slate-900 to-pink-950/20 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                Daily Thought
              </span>
              <Sparkles size={14} className="text-rose-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
              "Every moment spent together becomes a timeless memory."
            </p>
          </div>

          <Link
            href="/settings"
            className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              location === "/settings"
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <SlidersHorizontal size={18} strokeWidth={2} />
            <span>Preferences</span>
          </Link>
        </aside>

        {/* Mobile Top Header */}
        <div className="w-full lg:pl-64">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-5 backdrop-blur-xl lg:hidden">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-md shadow-rose-950">
                <Heart size={16} fill="currentColor" strokeWidth={0} />
              </span>
              <span className="text-base font-bold text-white tracking-tight">
                {partnerNames.p1} <span className="text-rose-500">&</span>{" "}
                {partnerNames.p2}
              </span>
            </Link>

            <Link
              href="/settings"
              className="grid size-9 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all active:scale-95"
            >
              <SlidersHorizontal size={16} />
            </Link>
          </header>

          {/* Main Content Render Area */}
          <main className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8 lg:pb-10">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-around rounded-2xl border border-slate-800/90 bg-slate-900/95 p-1.5 shadow-2xl shadow-slate-950 backdrop-blur-xl lg:hidden"
          aria-label="Mobile primary navigation"
        >
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-all active:scale-95 ${
                  active
                    ? "bg-rose-600 text-white shadow-md shadow-rose-950"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                <span className="truncate max-w-[64px]">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

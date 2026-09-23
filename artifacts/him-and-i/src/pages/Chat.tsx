import { ArrowLeft, LockKeyhole, MessageCircle, Send, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { HimShell } from '@/components/HimShell';

export default function Chat() {
  return (
    <HimShell>
      <div className="page-enter mx-auto max-w-4xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground no-underline hover:text-primary" data-testid="link-back-home"><ArrowLeft size={14} /> Back to our place</Link>
        <div className="overflow-hidden rounded-[32px] border border-card-border bg-card shadow-[var(--shadow-soft)]">
          <header className="flex items-center justify-between border-b border-border/70 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[#f6d5ce] text-primary"><MessageCircle size={20} /></span><div><p className="mono text-[9px] uppercase tracking-[.18em] text-muted-foreground">Just us</p><h1 className="display mt-1 text-2xl font-semibold">Private chat</h1></div></div>
            <div className="flex items-center gap-2 rounded-full bg-[#e4eee6] px-3 py-2 text-[10px] font-semibold text-muted-foreground"><LockKeyhole size={13} className="text-primary" /> private by design</div>
          </header>
          <div className="flex min-h-[500px] flex-col items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(232,187,160,.16),transparent_32%),radial-gradient(circle_at_80%_75%,rgba(137,179,158,.17),transparent_28%)] px-6 py-16 text-center">
            <div className="relative grid size-28 place-items-center rounded-[36px] bg-primary text-primary-foreground shadow-[0_15px_28px_rgba(64,74,155,.2)]"><MessageCircle size={43} strokeWidth={1.3} /><span className="absolute -right-1 -top-1 grid size-8 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Sparkles size={14} /></span></div>
            <p className="mono mt-9 text-[10px] uppercase tracking-[.2em] text-primary">A room for your words</p>
            <h2 className="display mt-3 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">Your quiet line is coming.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Soon, this will be the place for voice notes, half-finished thoughts, and the “look at this” messages that make a day better.</p>
            <div className="mt-9 flex w-full max-w-md items-center gap-2 rounded-2xl border border-border bg-card p-2 opacity-55"><span className="flex-1 px-3 text-left text-xs text-muted-foreground">Write something only they would get…</span><button disabled className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground" data-testid="button-chat-disabled"><Send size={15} /></button></div>
            <p className="mt-4 text-[11px] text-muted-foreground">Realtime conversation is being warmed up.</p>
          </div>
        </div>
      </div>
    </HimShell>
  );
}

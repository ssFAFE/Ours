import { ArrowLeft, ArrowUpRight, Camera, FileText, Film, Images, Play } from 'lucide-react';
import { Link } from 'wouter';
import { useGetMemories } from '@workspace/api-client-react';
import { HimShell } from '@/components/HimShell';
import { ErrorState, LoadingState } from '@/components/LoadingState';

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

const typeIcon = { photo: Camera, video: Film, note: FileText };

export default function Memories() {
  const query = useGetMemories();
  const memories = query.data ?? [];
  return (
    <HimShell>
      <div className="page-enter">
        <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground no-underline hover:text-primary" data-testid="link-back-home"><ArrowLeft size={14} /> Back to our place</Link>
            <p className="mono text-[10px] uppercase tracking-[.2em] text-primary">The archive of us</p>
            <h1 className="display mt-3 text-[clamp(2.7rem,6vw,5rem)] font-semibold leading-[.95] tracking-[-.05em]">Little memories<span className="text-secondary-foreground">.</span></h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">A gentle gallery of the things we decided not to let time take.</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground"><Images size={17} className="text-primary" /><span data-testid="text-memory-total">{memories.length} moments held close</span></div>
        </header>
        {query.isLoading ? <LoadingState label="Opening the memory drawer…" /> : query.isError ? <ErrorState onRetry={() => query.refetch()} /> : memories.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-border bg-card p-12 text-center" data-testid="status-memory-empty">
            <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#f6d5ce] text-primary"><Images size={27} /></span>
            <h2 className="display mt-6 text-3xl font-semibold">Nothing here yet.</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">The first photo, note, or tiny victory will give this room its story.</p>
            <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground no-underline" data-testid="link-empty-home">Back to our place <ArrowUpRight size={14} /></Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memories.map((memory, index) => {
              const Icon = typeIcon[memory.type];
              return <article key={memory.id} className={`page-enter stagger-${(index % 4) + 1} group relative min-h-[290px] overflow-hidden rounded-[28px] bg-gradient-to-br ${memory.gradient} p-6 text-white shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1.5`} data-testid={`card-memory-detail-${memory.id}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm"><Icon size={17} /></div>
                <div className="relative z-[1] flex h-full flex-col justify-end">
                  <span className="mono text-[9px] uppercase tracking-[.16em] text-white/70">{memory.type} · {displayDate(memory.date)}</span>
                  <h2 className="display mt-2 text-2xl font-semibold leading-tight">{memory.title}</h2>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/75"><span className="grid size-5 place-items-center rounded-full bg-white/20 text-[9px] font-bold">A</span><span>kept by both of you</span></div>
                </div>
              </article>;
            })}
          </div>
        )}
      </div>
    </HimShell>
  );
}

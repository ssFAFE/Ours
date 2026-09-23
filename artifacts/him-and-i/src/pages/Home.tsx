import { useMemo, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowUpRight, Check, Image as ImageIcon, MessageCircle, Play, Plus, Quote, Send, Sparkles } from 'lucide-react';
import { useCreateMood, useCreateTask, useGetCoupleOverview, useGetMemories, useGetTasks } from '@workspace/api-client-react';
import { HimShell } from '@/components/HimShell';
import { ErrorState, LoadingState } from '@/components/LoadingState';

const moodChoices = [
  { mood: 'Tender', tint: 'bg-[#f6d5ce]' },
  { mood: 'Bright', tint: 'bg-[#f1d59d]' },
  { mood: 'Quiet', tint: 'bg-[#cfe0d6]' },
  { mood: 'Restless', tint: 'bg-[#d9d7ed]' },
  { mood: 'Grateful', tint: 'bg-[#d7e2ed]' },
];

function formatMemoryDate(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(parsed);
}

function initials(names: string) {
  return names.split(/&|and/i).map((name) => name.trim()[0]).filter(Boolean).join('').slice(0, 2).toUpperCase();
}

export default function Home() {
  const overviewQuery = useGetCoupleOverview();
  const memoriesQuery = useGetMemories();
  const tasksQuery = useGetTasks();
  const createMood = useCreateMood();
  const createTask = useCreateTask();
  const queryClient = useQueryClient();
  const [person, setPerson] = useState<'Ahmed' | 'Mariam'>('Ahmed');
  const [selectedMood, setSelectedMood] = useState('');
  const [taskTitle, setTaskTitle] = useState('');

  const memories = memoriesQuery.data ?? [];
  const tasks = tasksQuery.data ?? [];
  const overview = overviewQuery.data;
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

  if (overviewQuery.isLoading) return <HimShell><LoadingState /></HimShell>;
  if (overviewQuery.isError || !overview) return <HimShell><ErrorState onRetry={() => overviewQuery.refetch()} /></HimShell>;

  function submitMood() {
    if (!selectedMood) return;
    createMood.mutate({ data: { person, mood: selectedMood } }, {
      onSuccess: () => {
        setSelectedMood('');
        void queryClient.invalidateQueries({ queryKey: overviewQuery.queryKey });
      },
    });
  }

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title) return;
    createTask.mutate({ data: { title } }, {
      onSuccess: () => {
        setTaskTitle('');
        void queryClient.invalidateQueries({ queryKey: tasksQuery.queryKey });
      },
    });
  }

  return (
    <HimShell>
      <div className="page-enter">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mono mb-3 text-[10px] uppercase tracking-[.2em] text-primary">Tuesday, your place is ready</p>
            <h1 className="display text-[clamp(2.4rem,5vw,4.45rem)] font-semibold leading-[.98] tracking-[-.045em]">Good morning,<br /><span className="text-primary">{overview.names.split('&')[0]?.trim() || 'you two'}.</span></h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">A soft corner for the small things, the big things, and everything that makes the distance feel shorter.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-border bg-card px-3 py-2 sm:self-auto" data-testid="status-couple">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{initials(overview.names)}</span>
            <span className="text-xs font-semibold text-foreground">{overview.names}</span>
            <span className="size-1.5 rounded-full bg-[#68a878] soft-pulse" />
            <span className="text-xs text-muted-foreground">together</span>
          </div>
        </header>

        <section className="mb-5 grid gap-5 lg:grid-cols-[1.45fr_.8fr]">
          <article className="relative min-h-[300px] overflow-hidden rounded-[30px] bg-primary p-7 text-primary-foreground shadow-[0_18px_40px_rgba(64,74,155,.2)] sm:p-9">
            <div className="absolute -right-16 -top-20 size-64 rounded-full border-[30px] border-secondary/30" />
            <div className="absolute -bottom-24 right-14 size-56 rounded-full border-[1px] border-primary-foreground/20" />
            <div className="relative z-[1] flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mono text-[10px] uppercase tracking-[.2em] text-primary-foreground/65">The long lovely count</p>
                  <p className="mt-5 display text-7xl font-semibold leading-none tracking-[-.06em] sm:text-8xl" data-testid="text-together-days">{overview.togetherDays}</p>
                  <p className="mt-2 text-sm text-primary-foreground/75">days of choosing each other</p>
                </div>
                <div className="rounded-2xl bg-primary-foreground/10 px-3 py-2 text-right">
                  <p className="mono text-[9px] uppercase tracking-[.15em] text-primary-foreground/60">Since</p>
                  <p className="mt-1 text-sm font-semibold">{overview.anniversary}</p>
                </div>
              </div>
              <div className="mt-10 flex items-end justify-between gap-4">
                <p className="max-w-[260px] font-serif text-lg leading-6 text-primary-foreground/90">“Whatever the day brings, it belongs to us.”</p>
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"><Quote size={20} /></div>
              </div>
            </div>
          </article>

          <article className="card-lift rounded-[30px] border border-card-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Today’s pulse</p>
                <h2 className="display mt-2 text-2xl font-semibold">How are we feeling?</h2>
              </div>
              <Sparkles size={21} className="text-secondary-foreground" />
            </div>
            <div className="mb-5 flex rounded-xl bg-muted p-1" role="tablist" aria-label="Choose person">
              {(['Ahmed', 'Mariam'] as const).map((name) => (
                <button key={name} onClick={() => setPerson(name)} className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${person === name ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`} data-testid={`button-person-${name.toLowerCase()}`}>{name}</button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {moodChoices.map(({ mood, tint }) => (
                <button key={mood} onClick={() => setSelectedMood(mood)} className={`group flex min-h-[68px] flex-col items-center justify-center gap-2 rounded-xl border text-center transition-all hover:-translate-y-1 ${selectedMood === mood ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/55'}`} data-testid={`button-mood-${mood.toLowerCase()}`}>
                  <span className={`size-5 rounded-full ${tint} ${selectedMood === mood ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`} />
                  <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground">{mood}</span>
                </button>
              ))}
            </div>
            <button onClick={submitMood} disabled={!selectedMood || createMood.isPending} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45" data-testid="button-save-mood">
              {createMood.isPending ? 'Saving your pulse…' : <><Send size={14} /> Save {person}&apos;s mood</>}
            </button>
            {createMood.isError && <p className="mt-2 text-center text-xs text-destructive" data-testid="status-mood-error">Couldn’t save that just now.</p>}
          </article>
        </section>

        <section className="mb-5 grid gap-5 md:grid-cols-3">
          {[
            { label: 'Photo streak', value: overview.photoStreak, suffix: 'days', icon: ImageIcon, tint: 'bg-[#f6d5ce]' },
            { label: 'Chat streak', value: overview.chatStreak, suffix: 'days', icon: MessageCircle, tint: 'bg-[#d5e2ed]' },
            { label: 'Reels streak', value: overview.reelsStreak, suffix: 'days', icon: Play, tint: 'bg-[#ded9ed]' },
          ].map(({ label, value, suffix, icon: Icon, tint }, index) => (
            <div key={label} className={`page-enter stagger-${index + 1} card-lift flex items-center gap-4 rounded-[24px] border border-card-border bg-card p-5 shadow-[var(--shadow-soft)]`} data-testid={`card-streak-${label.toLowerCase().replace(' ', '-')}`}>
              <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${tint} text-foreground`}><Icon size={20} strokeWidth={1.8} /></span>
              <div>
                <p className="mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">{label}</p>
                <p className="mt-1 display text-2xl font-semibold"><span data-testid={`text-streak-${label.toLowerCase().replace(' ', '-')}`}>{value}</span> <span className="font-sans text-xs font-medium text-muted-foreground">{suffix}</span></p>
              </div>
              <div className="ml-auto h-9 w-1 overflow-hidden rounded-full bg-muted"><span className="block h-2/3 w-full rounded-full bg-primary" /></div>
            </div>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <article className="rounded-[28px] border border-card-border bg-[#e4eee6] p-6" data-testid="card-prompt">
            <div className="flex items-center justify-between">
              <p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">A question for two</p>
              <span className="grid size-8 place-items-center rounded-full bg-card text-primary"><Sparkles size={15} /></span>
            </div>
            <h2 className="display mt-8 max-w-md text-3xl font-semibold leading-[1.08]">“{overview.todayPrompt}”</h2>
            <Link href="/chat" className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-primary no-underline hover:gap-3" data-testid="link-prompt-chat">Take this to chat <ArrowUpRight size={14} /></Link>
          </article>

          <article className="rounded-[28px] border border-card-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="mb-5 flex items-center justify-between">
              <div><p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Shared list</p><h2 className="display mt-1 text-2xl font-semibold">For our next chapter</h2></div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground" data-testid="text-task-count">{completedTasks}/{tasks.length || 0}</span>
            </div>
            {tasksQuery.isLoading ? <div className="skeleton h-16 rounded-2xl" /> : tasksQuery.isError ? <p className="rounded-xl bg-[#fff2e8] p-4 text-xs text-muted-foreground" data-testid="status-tasks-error">The list is taking a minute to appear.</p> : tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-5 text-center" data-testid="status-tasks-empty"><p className="display text-lg font-semibold">A blank page, for now.</p><p className="mt-1 text-xs text-muted-foreground">Add the first little plan you want to make real.</p></div>
            ) : (
              <div className="space-y-2">
                {tasks.slice(0, 3).map((task) => <div key={task.id} className="flex items-center gap-3 rounded-xl bg-muted/55 px-3 py-2.5" data-testid={`row-task-${task.id}`}><span className={`grid size-5 place-items-center rounded-full border ${task.completed ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{task.completed && <Check size={12} />}</span><span className={`text-sm ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{task.title}</span></div>)}
              </div>
            )}
            <form onSubmit={submitTask} className="mt-4 flex gap-2">
              <input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Add something lovely…" className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15" data-testid="input-new-task" />
              <button type="submit" disabled={!taskTitle.trim() || createTask.isPending} className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40" data-testid="button-add-task"><Plus size={17} /></button>
            </form>
          </article>
        </section>

        <section className="mt-5 rounded-[28px] border border-card-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-5 flex items-end justify-between">
            <div><p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Recently held close</p><h2 className="display mt-1 text-2xl font-semibold">Little memories</h2></div>
            <Link href="/memories" className="inline-flex items-center gap-1 text-xs font-bold text-primary no-underline hover:gap-2" data-testid="link-see-memories">See all <ArrowUpRight size={14} /></Link>
          </div>
          {memoriesQuery.isLoading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="skeleton h-36 rounded-2xl" /><div className="skeleton h-36 rounded-2xl" /><div className="hidden skeleton h-36 rounded-2xl sm:block" /><div className="hidden skeleton h-36 rounded-2xl sm:block" /></div> : memoriesQuery.isError ? <p className="text-sm text-muted-foreground" data-testid="status-memories-error">Memories are tucked away for a moment. Try the full gallery.</p> : memories.length === 0 ? <div className="rounded-2xl border border-dashed border-border p-8 text-center" data-testid="status-memories-empty"><p className="display text-lg font-semibold">Your first memory is waiting.</p><p className="mt-1 text-xs text-muted-foreground">This space will fill with the moments you keep.</p></div> : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {memories.slice(0, 4).map((memory) => <Link href="/memories" key={memory.id} className={`group relative flex h-36 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${memory.gradient} p-4 text-white no-underline transition-transform hover:-translate-y-1`} data-testid={`card-memory-${memory.id}`}><div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" /><div className="relative z-[1]"><span className="mono text-[9px] uppercase tracking-[.14em] text-white/70">{memory.type} · {formatMemoryDate(memory.date)}</span><p className="mt-1 text-sm font-semibold leading-tight">{memory.title}</p></div></Link>)}
            </div>
          )}
        </section>
      </div>
    </HimShell>
  );
}

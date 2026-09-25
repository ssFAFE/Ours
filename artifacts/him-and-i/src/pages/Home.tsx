import { useMemo, useState, useEffect, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  ArrowUpRight, 
  Check, 
  Image as ImageIcon, 
  MessageCircle, 
  Play, 
  Plus, 
  Send, 
  Sparkles, 
  Palette, 
  Heart,
  Calendar,
  Flame
} from 'lucide-react';
import { useCreateMood, useCreateTask, useGetCoupleOverview, useGetMemories, useGetTasks } from '@workspace/api-client-react';
import { HimShell } from '@/components/HimShell';
import { CoupleProfiles } from '@/components/CoupleProfiles';
import { ErrorState, LoadingState } from '@/components/LoadingState';

const moodChoices = [
  { mood: 'Tender', tint: 'bg-[#f6d5ce]', border: 'border-rose-300' },
  { mood: 'Bright', tint: 'bg-[#f1d59d]', border: 'border-amber-300' },
  { mood: 'Quiet', tint: 'bg-[#cfe0d6]', border: 'border-emerald-300' },
  { mood: 'Restless', tint: 'bg-[#d9d7ed]', border: 'border-indigo-300' },
  { mood: 'Grateful', tint: 'bg-[#d7e2ed]', border: 'border-sky-300' },
];

const backgrounds = [
  { name: 'Default', class: 'bg-background' },
  { name: 'Warm Blush', class: 'bg-[#fff5f5]' },
  { name: 'Soft Slate', class: 'bg-[#f0f4f8]' },
  { name: 'Cozy Warmth', class: 'bg-[#faf6f0]' },
];

function formatMemoryDate(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(parsed);
}

export default function Home() {
  const overviewQuery = useGetCoupleOverview();
  const memoriesQuery = useGetMemories();
  const tasksQuery = useGetTasks();
  const createMood = useCreateMood();
  const createTask = useCreateTask();
  const queryClient = useQueryClient();

  // Load dynamically configured partner names from Settings or fallback
  const [partner1, setPartner1] = useState('Ahmed');
  const [partner2, setPartner2] = useState('Mariam');
  const [person, setPerson] = useState<string>('Ahmed');

  const [selectedMood, setSelectedMood] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [currentBg, setCurrentBg] = useState(backgrounds[0].class);
  const [showBgSelector, setShowBgSelector] = useState(false);

  useEffect(() => {
    const savedBg = localStorage.getItem('app_bg_home');
    if (savedBg) setCurrentBg(savedBg);

    const savedP1 = localStorage.getItem('app_partner1');
    const savedP2 = localStorage.getItem('app_partner2');
    if (savedP1) {
      setPartner1(savedP1);
      setPerson(savedP1);
    }
    if (savedP2) setPartner2(savedP2);
  }, []);

  const changeBackground = (bgClass: string) => {
    setCurrentBg(bgClass);
    localStorage.setItem('app_bg_home', bgClass);
  };

  const memories = memoriesQuery.data ?? [];
  const tasks = tasksQuery.data ?? [];
  const overview = overviewQuery.data;
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

  if (overviewQuery.isLoading) return <HimShell><LoadingState /></HimShell>;
  if (overviewQuery.isError || !overview) return <HimShell><ErrorState onRetry={() => overviewQuery.refetch()} /></HimShell>;

  // Dynamic milestone progress calculation (365, 730, 1095... etc.)
  const currentDays = overview.togetherDays || 0;
  const targetDays = currentDays >= 365 ? (Math.floor(currentDays / 365) + 1) * 365 : 365;
  const progressPercentage = Math.min(Math.round((currentDays / targetDays) * 100), 100);

  function submitMood() {
    if (!selectedMood) return;
    createMood.mutate({ data: { person, mood: selectedMood } }, {
      onSuccess: () => {
        setSelectedMood('');
        void queryClient.invalidateQueries(); // invalidates active query cache
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
        void queryClient.invalidateQueries();
      },
    });
  }

  return (
    <HimShell>
      <div className={`page-enter p-4 sm:p-6 rounded-[32px] transition-colors duration-500 ${currentBg}`}>

        {/* Top Navigation / Profiles Bar */}
        <div className="flex justify-between items-center mb-6">
          <CoupleProfiles />
          <div className="relative">
            <button 
              onClick={() => setShowBgSelector(!showBgSelector)}
              aria-expanded={showBgSelector}
              aria-label="Toggle Theme Atmosphere"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-full border border-border bg-card/80 backdrop-blur-sm shadow-sm hover:bg-muted transition-all active:scale-95"
            >
              <Palette size={14} className="text-primary" /> Theme Atmosphere
            </button>
            {showBgSelector && (
              <div className="absolute right-0 mt-2 z-20 w-44 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-2 shadow-xl space-y-1">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.name}
                    onClick={() => { changeBackground(bg.class); setShowBgSelector(false); }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-muted font-medium transition-colors flex items-center justify-between"
                  >
                    {bg.name}
                    {currentBg === bg.class && <Check size={12} className="text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hero Header Section */}
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 mb-3">
              <Sparkles size={12} className="text-primary" />
              <p className="mono text-[10px] uppercase tracking-[.2em] font-bold text-primary">
                {partner1} & {partner2}
              </p>
            </div>
            <h1 className="display text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.02] tracking-[-.04em]">
              Your private<br /><span className="text-primary">space for two.</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              A cozy haven built for your daily feelings, shared memories, reels, and plans.
            </p>
          </div>
        </header>

        {/* Counter and Mood Section */}
        <section className="mb-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Main Together Counter Card */}
          <article className="relative min-h-[320px] overflow-hidden rounded-[32px] bg-primary p-7 text-primary-foreground shadow-[0_20px_40px_rgba(0,0,0,.12)] sm:p-9 flex flex-col justify-between">
            <div className="absolute -right-16 -top-20 size-64 rounded-full border-[30px] border-secondary/20 pointer-events-none" />
            <div className="absolute -bottom-24 right-14 size-56 rounded-full border-[1px] border-primary-foreground/15 pointer-events-none" />

            <div className="relative z-[1] flex items-start justify-between">
              <div>
                <p className="mono text-[10px] uppercase tracking-[.2em] text-primary-foreground/70 font-semibold">Together Journey</p>
                <div className="mt-4 flex items-baseline gap-3">
                  <p className="display text-7xl sm:text-8xl font-semibold leading-none tracking-[-.06em]" data-testid="text-together-days">
                    {overview.togetherDays}
                  </p>
                  <span className="text-lg font-medium text-primary-foreground/80">days</span>
                </div>
              </div>
              <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-sm px-3.5 py-2.5 text-right border border-primary-foreground/10">
                <p className="mono text-[9px] uppercase tracking-[.15em] text-primary-foreground/70 flex items-center gap-1 justify-end">
                  <Calendar size={11} /> Anniversary
                </p>
                <p className="mt-1 text-sm font-semibold">{overview.anniversary}</p>
              </div>
            </div>

            {/* Progress Bar Component */}
            <div className="relative z-[1] mt-8 space-y-2">
              <div className="flex justify-between text-xs text-primary-foreground/85 font-medium">
                <span>{targetDays / 365} Year Milestone ({targetDays} Days)</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-primary-foreground/20 overflow-hidden p-0.5 backdrop-blur-sm">
                <div 
                  className="h-full rounded-full bg-secondary transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="relative z-[1] mt-6 flex items-end justify-between gap-4">
              <p className="max-w-[280px] font-serif text-base sm:text-lg leading-snug text-primary-foreground/90 italic">
                “Every step forward together makes our story stronger.”
              </p>
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground shadow-lg transition-transform hover:scale-105">
                <Heart size={20} className="fill-current" />
              </div>
            </div>
          </article>

          {/* Today's Pulse / Mood Widget */}
          <article className="card-lift rounded-[32px] border border-card-border bg-card/90 backdrop-blur-md p-6 shadow-[var(--shadow-soft)] flex flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground font-semibold">Today’s pulse</p>
                  <h2 className="display mt-1 text-2xl font-semibold">How are we feeling?</h2>
                </div>
                <Sparkles size={20} className="text-secondary-foreground animate-pulse" />
              </div>

              {/* Toggle Between Partners */}
              <div className="mb-5 flex rounded-2xl bg-muted/60 p-1" role="tablist">
                {[partner1, partner2].map((name) => (
                  <button 
                    key={name} 
                    onClick={() => setPerson(name)} 
                    className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${person === name ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} 
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* Mood Selection */}
              <div className="grid grid-cols-5 gap-1.5">
                {moodChoices.map(({ mood, tint }) => (
                  <button 
                    key={mood} 
                    onClick={() => setSelectedMood(mood)} 
                    className={`group flex min-h-[72px] flex-col items-center justify-center gap-2 rounded-2xl border text-center transition-all hover:-translate-y-1 ${
                      selectedMood === mood ? 'border-primary bg-primary/10 shadow-sm' : 'border-transparent bg-muted/40 hover:bg-muted/70'
                    }`} 
                  >
                    <span className={`size-5 rounded-full ${tint} transition-transform group-hover:scale-110 ${selectedMood === mood ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`} />
                    <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground">{mood}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={submitMood} 
              disabled={!selectedMood || createMood.isPending} 
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-98 disabled:cursor-not-allowed disabled:opacity-45" 
            >
              {createMood.isPending ? 'Saving pulse...' : <><Send size={14} /> Save {person}&apos;s mood</>}
            </button>
          </article>
        </section>

        {/* Streaks Cards Section */}
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Photo Streak', value: overview.photoStreak, suffix: 'days', icon: ImageIcon, tint: 'bg-rose-100 text-rose-600' },
            { label: 'Chat Streak', value: overview.chatStreak, suffix: 'days', icon: MessageCircle, tint: 'bg-sky-100 text-sky-600' },
            { label: 'Reels Streak', value: overview.reelsStreak, suffix: 'days', icon: Play, tint: 'bg-purple-100 text-purple-600' },
          ].map(({ label, value, suffix, icon: Icon, tint }, index) => (
            <div key={label} className={`page-enter stagger-${index + 1} card-lift flex items-center gap-4 rounded-[24px] border border-card-border bg-card/80 backdrop-blur-md p-5 shadow-[var(--shadow-soft)]`}>
              <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${tint}`}>
                <Icon size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="mono text-[9px] uppercase tracking-[.16em] text-muted-foreground font-semibold">{label}</p>
                <p className="mt-0.5 display text-2xl font-semibold flex items-center gap-1">
                  {value} <span className="font-sans text-xs font-normal text-muted-foreground">{suffix}</span>
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full text-[10px] font-bold">
                <Flame size={12} fill="currentColor" /> {value}d
              </div>
            </div>
          ))}
        </section>

        {/* Daily Prompt & Shared To-Do List */}
        <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <article className="rounded-[30px] border border-card-border bg-emerald-950/5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground font-semibold">Daily Question</p>
                <span className="grid size-8 place-items-center rounded-full bg-card text-primary shadow-sm"><Sparkles size={15} /></span>
              </div>
              <h2 className="display mt-6 text-2xl sm:text-3xl font-semibold leading-snug">
                “{overview.todayPrompt}”
              </h2>
            </div>
            <Link href="/chat" className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-primary no-underline hover:gap-3 transition-all">
              Discuss in private chat <ArrowUpRight size={14} />
            </Link>
          </article>

          {/* Shared To-Do List Widget */}
          <article className="rounded-[30px] border border-card-border bg-card/90 backdrop-blur-md p-6 shadow-[var(--shadow-soft)] flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground font-semibold">Shared Plans</p>
                  <h2 className="display mt-1 text-2xl font-semibold">To-do & bucket list</h2>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                  {completedTasks}/{tasks.length || 0}
                </span>
              </div>

              {tasksQuery.isLoading ? (
                <div className="skeleton h-16 rounded-2xl" />
              ) : tasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 p-6 text-center">
                  <p className="display text-base font-semibold">No shared plans yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Add something fun you want to do together.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 rounded-2xl bg-muted/40 border border-border/40 px-3.5 py-3 transition-all hover:bg-muted/60">
                      <span className={`grid size-5 place-items-center rounded-full border ${task.completed ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                        {task.completed && <Check size={12} />}
                      </span>
                      <span className={`text-xs sm:text-sm font-medium ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={submitTask} className="mt-5 flex gap-2">
              <input 
                value={taskTitle} 
                onChange={(e) => setTaskTitle(e.target.value)} 
                placeholder="Add a new shared plan..." 
                className="min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 py-2.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" 
              />
              <button 
                type="submit" 
                disabled={!taskTitle.trim() || createTask.isPending} 
                aria-label="Add task"
                className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-40 transition-all active:scale-95"
              >
                <Plus size={18} />
              </button>
            </form>
          </article>
        </section>

        {/* Shared Memories Preview */}
        <section className="mt-6 rounded-[30px] border border-card-border bg-card/90 backdrop-blur-md p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground font-semibold">Gallery</p>
              <h2 className="display mt-1 text-2xl font-semibold">Shared memories</h2>
            </div>
            <Link href="/memories" className="inline-flex items-center gap-1 text-xs font-bold text-primary no-underline hover:gap-2 transition-all">
              Explore gallery <ArrowUpRight size={14} />
            </Link>
          </div>

          {memoriesQuery.isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="skeleton h-36 rounded-2xl" />
              <div className="skeleton h-36 rounded-2xl" />
              <div className="hidden skeleton h-36 rounded-2xl sm:block" />
              <div className="hidden skeleton h-36 rounded-2xl sm:block" />
            </div>
          ) : memories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center">
              <p className="display text-base font-semibold">Your first memory is waiting</p>
              <p className="mt-1 text-xs text-muted-foreground">Captured moments and photos will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {memories.slice(0, 4).map((memory) => (
                <Link 
                  href="/memories" 
                  key={memory.id} 
                  className={`group relative flex h-40 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${memory.gradient} p-4 text-white no-underline transition-all hover:-translate-y-1 hover:shadow-md`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="relative z-[1]">
                    <span className="mono text-[9px] uppercase tracking-[.14em] text-white/80 font-medium">
                      {memory.type} · {formatMemoryDate(memory.date)}
                    </span>
                    <p className="mt-1 text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                      {memory.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </HimShell>
  );
}
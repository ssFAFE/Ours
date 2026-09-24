import { AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
  cardsCount?: number;
}

export function LoadingState({ label = 'Setting the table…', cardsCount = 2 }: LoadingStateProps) {
  return (
    <div className="space-y-6 animate-pulse" data-testid="status-loading">
      {/* العناوين والترويسة */}
      <div className="space-y-2">
        <div className="h-7 w-40 rounded-xl bg-muted/70" />
        <div className="h-4 w-64 rounded-lg bg-muted/50" />
      </div>

      {/* كروت التحميل الهيكلية */}
      <div className={`grid gap-4 ${cardsCount > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        {Array.from({ length: cardsCount }).map((_, i) => (
          <div key={i} className="h-44 rounded-[28px] border border-border/40 bg-muted/40 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="h-5 w-1/3 rounded-lg bg-muted/80" />
              <div className="h-3 w-3/4 rounded-md bg-muted/60" />
            </div>
            <div className="h-8 w-8 rounded-full bg-muted/70 self-end" />
          </div>
        ))}
      </div>

      {/* نص التحميل المخصص */}
      <div className="flex items-center gap-2 text-muted-foreground pt-1">
        <span className="size-2 rounded-full bg-primary animate-ping" />
        <p className="mono text-[10px] uppercase tracking-[.16em] font-medium">{label}</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = 'We couldn’t open this corner.',
  description = 'Give it another tap. Your place is still here.',
  onRetry,
  isRetrying = false
}: ErrorStateProps) {
  return (
    <div 
      className="rounded-[28px] border border-rose-200/80 bg-gradient-to-br from-rose-50/80 via-orange-50/40 to-background p-6 sm:p-8 shadow-sm transition-all" 
      data-testid="status-error"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-rose-100 text-rose-600 shrink-0">
          <AlertCircle size={20} />
        </span>

        <div>
          <p className="mono mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-rose-500">
            A little wobble
          </p>
          <h2 className="display text-xl sm:text-2xl font-semibold text-foreground">
            {title}
          </h2>
          <p className="mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              data-testid="button-retry"
            >
              <RefreshCw size={14} className={isRetrying ? 'animate-spin' : ''} />
              {isRetrying ? 'Trying again…' : 'Try again'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
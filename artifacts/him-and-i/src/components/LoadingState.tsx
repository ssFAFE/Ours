export function LoadingState({ label = 'Setting the table…' }: { label?: string }) {
  return (
    <div className="space-y-5" data-testid="status-loading">
      <div className="skeleton h-8 w-48 rounded-lg" />
      <div className="skeleton h-4 w-72 rounded-lg" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="skeleton h-44 rounded-[28px]" />
        <div className="skeleton h-44 rounded-[28px]" />
      </div>
      <p className="mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{label}</p>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="rounded-[28px] border border-secondary/60 bg-[#fff2e8] p-7" data-testid="status-error">
      <p className="mono mb-2 text-[10px] uppercase tracking-[.16em] text-secondary-foreground">A little wobble</p>
      <h2 className="display text-2xl font-semibold">We couldn’t open this corner.</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Give it another tap. Your place is still here.</p>
      {onRetry && <button onClick={onRetry} className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="button-retry">Try again</button>}
    </div>
  );
}
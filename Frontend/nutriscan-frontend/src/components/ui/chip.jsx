import { cn } from '@/lib/utils';

function Chip({ selected, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 active:scale-95',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-glow'
          : 'border-border bg-background/50 text-foreground/80 hover:border-primary/50 hover:bg-accent',
        className
      )}
    >
      {children}
    </button>
  );
}

export { Chip };

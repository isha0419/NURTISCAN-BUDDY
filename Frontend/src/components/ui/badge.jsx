import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-primary/15 text-primary',
        low: 'bg-risk-low/15 text-risk-low',
        moderate: 'bg-risk-moderate/15 text-risk-moderate',
        high: 'bg-risk-high/15 text-risk-high',
        outline: 'border border-border text-muted-foreground',
        muted: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function Spinner({ className, size = 18 }) {
  return <Loader2 size={size} className={cn('animate-spin text-primary', className)} />;
}

export { Spinner };

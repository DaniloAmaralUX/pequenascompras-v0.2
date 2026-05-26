import { cn } from '@/lib/utils';

/**
 * Skeleton placeholder com shimmer sweep (gradiente animado).
 * Mais moderno que `animate-pulse` (que apenas pisca opacity).
 * O .shimmer class está definida em globals.css e respeita prefers-reduced-motion.
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='skeleton' className={cn('shimmer rounded-md', className)} {...props} />;
}

export { Skeleton };

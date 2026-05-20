import { cn } from '@/lib/utils';

/**
 * Seção semântica de formulário — agrupa campos relacionados sob um título
 * (Common Region / Lei da Proximidade). Use várias dentro de um `<form.Form>`
 * com `flex flex-col gap-8` para criar hierarquia espacial por agrupamento.
 */
export function FormSection({
  title,
  description,
  children,
  className
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className='flex flex-col gap-0.5'>
        <h3 className='text-sm font-semibold tracking-tight'>{title}</h3>
        {description && <p className='text-muted-foreground text-xs text-pretty'>{description}</p>}
      </div>
      {children}
    </section>
  );
}

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export default function NotFound() {
  const displayFont = 'font-[family-name:var(--font-merriweather)]';

  return (
    <div className='from-background to-muted/40 flex min-h-svh flex-col items-center justify-center bg-gradient-to-b px-4 py-12'>
      <div className='flex w-full max-w-md flex-col items-center gap-6 text-center'>
        <div className='flex items-center gap-2'>
          <span className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-md font-[family-name:var(--font-merriweather)] text-xs font-bold tracking-tight shadow-xs'>
            SC
          </span>
          <Badge variant='outline' className='text-[10px] font-normal'>
            Protótipo
          </Badge>
        </div>

        <div className='flex flex-col gap-3'>
          <span
            className={cn(
              displayFont,
              'text-muted-foreground/40 text-7xl leading-none font-bold tracking-tight tabular-nums md:text-8xl'
            )}
            aria-hidden='true'
          >
            404
          </span>
          <h1
            className={cn(
              displayFont,
              'text-2xl leading-tight font-bold tracking-tight text-balance'
            )}
          >
            Página não encontrada
          </h1>
          <p className='text-muted-foreground text-sm text-pretty'>
            O endereço que você acessou não existe ou foi movido. Volte para a tela inicial e
            continue navegando pelo protótipo.
          </p>
        </div>

        <div className='flex flex-wrap items-center justify-center gap-2'>
          <Button asChild>
            <Link href='/dashboard/requests'>
              <Icons.request className='size-4' aria-hidden='true' />
              Ir para Solicitações
            </Link>
          </Button>
          <Button variant='outline' asChild>
            <Link href='/dashboard/overview'>
              <Icons.dashboard className='size-4' aria-hidden='true' />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

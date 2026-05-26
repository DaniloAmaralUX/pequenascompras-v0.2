'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';

type ExportFormat = 'pdf' | 'xlsx' | 'csv';

const FORMATOS: { id: ExportFormat; label: string; icon: keyof typeof Icons; ext: string }[] = [
  { id: 'pdf', label: 'PDF', icon: 'fileTypePdf', ext: '.pdf' },
  { id: 'xlsx', label: 'Excel', icon: 'fileTypeXls', ext: '.xlsx' },
  { id: 'csv', label: 'CSV', icon: 'fileText', ext: '.csv' }
];

/**
 * Botão de exportar relatório com dropdown de formatos.
 * Sinaliza a affordance ao testador — a exportação real estará no MVP.
 *
 * Cada item dispara um toast informando que a funcionalidade ficará disponível
 * no MVP (sem alteração de estado), mantendo a expectativa correta.
 */
export function ExportButton({ reportName }: { reportName: string }) {
  const handleExport = (formato: ExportFormat) => {
    const formatoInfo = FORMATOS.find((f) => f.id === formato);
    toast.info('Exportação será habilitada no MVP', {
      description: `Em produção, o relatório "${reportName}" poderá ser exportado em ${formatoInfo?.label} (${formatoInfo?.ext}).`,
      duration: 4000
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <Icons.download className='size-4' aria-hidden='true' />
          Exportar
          <Icons.chevronDown className='text-muted-foreground size-3.5' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-[14rem]'>
        <DropdownMenuLabel className='text-muted-foreground text-[10px] font-semibold tracking-wider uppercase'>
          Exportar como
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {FORMATOS.map((f) => {
            const Icon = Icons[f.icon];
            return (
              <DropdownMenuItem
                key={f.id}
                onClick={() => handleExport(f.id)}
                className='gap-2.5'
              >
                <Icon className='text-muted-foreground size-4' aria-hidden='true' />
                <span className='flex flex-col leading-tight'>
                  <span className='font-medium'>{f.label}</span>
                  <span className='text-muted-foreground text-[11px]'>{f.ext}</span>
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className='text-muted-foreground px-2 py-1.5 text-[11px]'>
          <span className='inline-flex items-center gap-1'>
            <Icons.info className='size-3' aria-hidden='true' />
            Funcionalidade do MVP
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

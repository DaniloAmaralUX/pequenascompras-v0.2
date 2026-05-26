'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/table/data-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription
} from '@/components/ui/empty';
import { Icons } from '@/components/icons';
import { useClientDataTable } from '@/hooks/use-client-data-table';
import { alertasPrecoQueryOptions } from '../api/queries';
import { precosAlertasColumns } from './precos-alertas-columns';

export default function PrecosAlertasReport() {
  const { data } = useSuspenseQuery(alertasPrecoQueryOptions());
  const { table } = useClientDataTable({ data, columns: precosAlertasColumns });

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <Alert>
        <Icons.info className='size-4' />
        <AlertTitle>Como funciona</AlertTitle>
        <AlertDescription>
          Itens cujo preço unitário está mais de 10% acima da média histórica do próprio item.
          Sinaliza compras potencialmente caras para verificação antes da aprovação.
        </AlertDescription>
      </Alert>

      {data.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <Icons.circleCheck />
            </EmptyMedia>
            <EmptyTitle>Nenhum alerta de preço</EmptyTitle>
            <EmptyDescription>
              Nenhum item está acima da média histórica de preço no momento.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <DataTable table={table} />
      )}
    </div>
  );
}

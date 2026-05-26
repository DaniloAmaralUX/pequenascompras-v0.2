'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/table/data-table';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription
} from '@/components/ui/empty';
import { Icons } from '@/components/icons';
import { useClientDataTable } from '@/hooks/use-client-data-table';
import { itensRecorrentesQueryOptions } from '../api/queries';
import { itensRecorrentesColumns } from './itens-recorrentes-columns';

export default function ItensRecorrentesReport() {
  const { data } = useSuspenseQuery(itensRecorrentesQueryOptions());
  const { table } = useClientDataTable({ data, columns: itensRecorrentesColumns });

  if (data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Icons.report />
          </EmptyMedia>
          <EmptyTitle>Nenhum item recorrente</EmptyTitle>
          <EmptyDescription>
            Ainda não há itens comprados em mais de uma solicitação no período.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <DataTable table={table} />;
}

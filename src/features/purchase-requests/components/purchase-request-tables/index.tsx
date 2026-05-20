'use client';

import { useMemo } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useSuspenseQuery } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { getSortingStateParser } from '@/lib/parsers';
import { purchaseRequestsQueryOptions } from '../../api/queries';
import type { PurchaseStatus } from '../../api/types';
import { buildColumns } from './columns';

export function PurchaseRequestTable({
  presetStatuses
}: {
  presetStatuses?: PurchaseStatus[];
}) {
  const columns = useMemo(() => buildColumns(!presetStatuses), [presetStatuses]);
  const columnIds = useMemo(
    () => columns.map((c) => c.id).filter(Boolean) as string[],
    [columns]
  );

  const [params] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    numero: parseAsString,
    prioridade: parseAsString,
    status: parseAsString,
    sort: getSortingStateParser(columnIds).withDefault([])
  });

  const statuses = presetStatuses
    ? presetStatuses.join(',')
    : (params.status ?? undefined);

  const filters = {
    page: params.page,
    limit: params.perPage,
    ...(params.numero && { search: params.numero }),
    ...(params.prioridade && { prioridades: params.prioridade }),
    ...(statuses && { statuses }),
    ...(params.sort.length > 0 && { sort: JSON.stringify(params.sort) })
  };

  const { data } = useSuspenseQuery(purchaseRequestsQueryOptions(filters));

  const pageCount = Math.ceil(data.total_requests / params.perPage);

  const { table } = useDataTable({
    data: data.requests,
    columns,
    pageCount,
    shallow: true,
    debounceMs: 500,
    initialState: {
      columnPinning: { right: ['actions'] }
    }
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

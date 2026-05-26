'use client';

import * as React from 'react';
import {
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

interface UseClientDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageSize?: number;
}

/**
 * Tabela com paginação e ordenação client-side — para conjuntos de dados
 * pequenos já carregados em memória (ex.: relatórios/agregações). Renderize
 * o `table` retornado com o mesmo `<DataTable>` das listagens de entidades.
 */
export function useClientDataTable<TData>({
  data,
  columns,
  pageSize = 10
}: UseClientDataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize } }
  });

  return { table };
}

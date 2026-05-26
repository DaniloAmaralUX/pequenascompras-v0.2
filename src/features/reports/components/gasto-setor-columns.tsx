'use client';

import type { Column, ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { GastoSetor } from '../lib/analytics';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function rightHeader(title: string) {
  return function RightHeader({ column }: { column: Column<GastoSetor, unknown> }) {
    return (
      <div className='flex justify-end'>
        <DataTableColumnHeader column={column} title={title} />
      </div>
    );
  };
}

export function buildGastoSetorColumns(total: number): ColumnDef<GastoSetor>[] {
  return [
    {
      id: 'centro',
      accessorKey: 'centro',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Centro de custo' />,
      cell: ({ row }) => <div className='font-mono font-medium'>{row.original.centro}</div>
    },
    {
      id: 'numSolicitacoes',
      accessorKey: 'numSolicitacoes',
      header: rightHeader('Solicitações'),
      cell: ({ row }) => (
        <div className='text-right tabular-nums'>{row.original.numSolicitacoes}</div>
      )
    },
    {
      id: 'valorTotal',
      accessorKey: 'valorTotal',
      header: rightHeader('Valor total'),
      cell: ({ row }) => (
        <div className='text-right tabular-nums'>{formatBRL(row.original.valorTotal)}</div>
      )
    },
    {
      id: 'percentual',
      accessorKey: 'valorTotal',
      header: rightHeader('% do total'),
      cell: ({ row }) => (
        <div className='text-right tabular-nums'>
          {total > 0 ? ((row.original.valorTotal / total) * 100).toFixed(1) : '0'}%
        </div>
      )
    }
  ];
}

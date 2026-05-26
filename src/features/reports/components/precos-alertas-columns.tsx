'use client';

import type { Column, ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { AlertaPreco } from '../lib/analytics';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function rightHeader(title: string) {
  return function RightHeader({ column }: { column: Column<AlertaPreco, unknown> }) {
    return (
      <div className='flex justify-end'>
        <DataTableColumnHeader column={column} title={title} />
      </div>
    );
  };
}

export const precosAlertasColumns: ColumnDef<AlertaPreco>[] = [
  {
    id: 'numero',
    accessorKey: 'numero',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Solicitação' />,
    cell: ({ row }) => <div className='font-mono'>{row.original.numero}</div>
  },
  {
    id: 'item',
    accessorKey: 'item',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Item' />,
    cell: ({ row }) => <div className='font-medium'>{row.original.item}</div>
  },
  {
    id: 'solicitante',
    accessorKey: 'solicitante',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Solicitante' />,
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.original.solicitante}</span>
    )
  },
  {
    id: 'precoUnitario',
    accessorKey: 'precoUnitario',
    header: rightHeader('Preço unitário'),
    cell: ({ row }) => (
      <div className='text-right tabular-nums'>{formatBRL(row.original.precoUnitario)}</div>
    )
  },
  {
    id: 'precoMedio',
    accessorKey: 'precoMedio',
    header: rightHeader('Média histórica'),
    cell: ({ row }) => (
      <div className='text-right tabular-nums'>{formatBRL(row.original.precoMedio)}</div>
    )
  },
  {
    id: 'diferencaPct',
    accessorKey: 'diferencaPct',
    header: rightHeader('Variação'),
    cell: ({ row }) => (
      <div className='text-right'>
        <Badge
          variant={row.original.diferencaPct > 20 ? 'destructive' : 'secondary'}
          className='tabular-nums'
        >
          +{row.original.diferencaPct.toFixed(1)}%
        </Badge>
      </div>
    )
  }
];

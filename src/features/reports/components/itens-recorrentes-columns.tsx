'use client';

import type { Column, ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { ItemRecorrente } from '../lib/analytics';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function rightHeader(title: string) {
  return function RightHeader({ column }: { column: Column<ItemRecorrente, unknown> }) {
    return (
      <div className='flex justify-end'>
        <DataTableColumnHeader column={column} title={title} />
      </div>
    );
  };
}

export const itensRecorrentesColumns: ColumnDef<ItemRecorrente>[] = [
  {
    id: 'item',
    accessorKey: 'item',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Item' />,
    cell: ({ row }) => <div className='font-medium'>{row.original.item}</div>
  },
  {
    id: 'categoria',
    accessorKey: 'categoria',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Categoria' />,
    cell: ({ row }) => <Badge variant='outline'>{row.original.categoria}</Badge>
  },
  {
    id: 'numCompras',
    accessorKey: 'numCompras',
    header: rightHeader('Compras'),
    cell: ({ row }) => (
      <div className='text-right tabular-nums'>{row.original.numCompras}</div>
    )
  },
  {
    id: 'qtdTotal',
    accessorKey: 'qtdTotal',
    header: rightHeader('Qtd total'),
    cell: ({ row }) => <div className='text-right tabular-nums'>{row.original.qtdTotal}</div>
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
    id: 'numSolicitantes',
    accessorKey: 'numSolicitantes',
    header: rightHeader('Solicitantes'),
    cell: ({ row }) => (
      <div className='text-right tabular-nums'>{row.original.numSolicitantes}</div>
    )
  },
  {
    id: 'precoMedio',
    accessorKey: 'precoMedio',
    header: rightHeader('Preço médio'),
    cell: ({ row }) => (
      <div className='text-right tabular-nums'>{formatBRL(row.original.precoMedio)}</div>
    )
  },
  {
    id: 'oportunidade',
    enableSorting: false,
    header: 'Oportunidade',
    cell: ({ row }) =>
      row.original.numCompras >= 4 ? (
        <Badge variant='outline' className='gap-1.5'>
          <span className='bg-primary size-1.5 rounded-full' aria-hidden='true' />
          Atacado recomendado
        </Badge>
      ) : (
        <Badge variant='outline' className='text-muted-foreground gap-1.5'>
          <span className='bg-muted-foreground/60 size-1.5 rounded-full' aria-hidden='true' />
          Monitorar
        </Badge>
      )
  }
];

'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { CatalogItem } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';
import { itemCategoryOptions } from '../../constants/catalog-item-options';

const formatBRL = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const columns: ColumnDef<CatalogItem>[] = [
  {
    id: 'nome',
    accessorKey: 'nome',
    header: ({ column }: { column: Column<CatalogItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='Item' />
    ),
    cell: ({ cell }) => <div className='font-medium'>{cell.getValue<CatalogItem['nome']>()}</div>,
    meta: {
      label: 'Item',
      placeholder: 'Buscar item…',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    id: 'categoria',
    accessorKey: 'categoria',
    enableSorting: false,
    header: ({ column }: { column: Column<CatalogItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='Categoria' />
    ),
    cell: ({ cell }) => (
      <Badge variant='outline'>{cell.getValue<CatalogItem['categoria']>()}</Badge>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Categoria',
      variant: 'multiSelect',
      options: itemCategoryOptions
    }
  },
  {
    accessorKey: 'unidade_medida',
    header: 'Unidade',
    enableSorting: false
  },
  {
    id: 'preco_medio_historico',
    accessorKey: 'preco_medio_historico',
    header: ({ column }: { column: Column<CatalogItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='Preço médio' />
    ),
    cell: ({ cell }) => (
      <span className='tabular-nums'>
        {formatBRL(cell.getValue<CatalogItem['preco_medio_historico']>())}
      </span>
    )
  },
  {
    id: 'is_item_estoque',
    accessorKey: 'is_item_estoque',
    enableSorting: false,
    header: 'Estoque',
    cell: ({ cell }) => {
      const estoque = cell.getValue<CatalogItem['is_item_estoque']>();
      return (
        <Badge variant={estoque ? 'destructive' : 'outline'}>
          {estoque ? 'Item de estoque' : 'Não'}
        </Badge>
      );
    }
  },
  {
    id: 'tem_contrato_vigente',
    accessorKey: 'tem_contrato_vigente',
    enableSorting: false,
    header: 'Contrato',
    cell: ({ cell }) => {
      const contrato = cell.getValue<CatalogItem['tem_contrato_vigente']>();
      return (
        <Badge variant={contrato ? 'destructive' : 'outline'}>
          {contrato ? 'Contrato vigente' : 'Não'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

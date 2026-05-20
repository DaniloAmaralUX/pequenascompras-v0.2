'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { CostCenter } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';
import { unidadeOptions } from '../../constants/cost-center-options';

export const columns: ColumnDef<CostCenter>[] = [
  {
    accessorKey: 'codigo',
    header: 'Código',
    cell: ({ cell }) => (
      <span className='font-mono text-sm'>{cell.getValue<CostCenter['codigo']>()}</span>
    ),
    enableSorting: false
  },
  {
    id: 'nome',
    accessorKey: 'nome',
    header: ({ column }: { column: Column<CostCenter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Centro de Custo' />
    ),
    cell: ({ cell }) => <div className='font-medium'>{cell.getValue<CostCenter['nome']>()}</div>,
    meta: {
      label: 'Centro de Custo',
      placeholder: 'Buscar centro de custo...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    id: 'unidade',
    accessorKey: 'unidade',
    enableSorting: false,
    header: ({ column }: { column: Column<CostCenter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Unidade' />
    ),
    cell: ({ cell }) => (
      <Badge variant='outline'>{cell.getValue<CostCenter['unidade']>()}</Badge>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Unidade',
      variant: 'multiSelect',
      options: unidadeOptions
    }
  },
  {
    id: 'ativo',
    accessorKey: 'ativo',
    enableSorting: false,
    header: 'Situação',
    cell: ({ cell }) => {
      const ativo = cell.getValue<CostCenter['ativo']>();
      return (
        <Badge variant={ativo ? 'default' : 'secondary'}>
          {ativo ? <Icons.circleCheck /> : <Icons.xCircle />}
          {ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

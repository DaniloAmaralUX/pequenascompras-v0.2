'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Supplier } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';
import { supplierCategoryOptions } from '../../constants/supplier-options';

export const columns: ColumnDef<Supplier>[] = [
  {
    id: 'nome',
    accessorKey: 'nome',
    header: ({ column }: { column: Column<Supplier, unknown> }) => (
      <DataTableColumnHeader column={column} title='Fornecedor' />
    ),
    cell: ({ cell }) => <div className='font-medium'>{cell.getValue<Supplier['nome']>()}</div>,
    meta: {
      label: 'Fornecedor',
      placeholder: 'Buscar fornecedor...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'cnpj',
    header: 'CNPJ',
    enableSorting: false
  },
  {
    id: 'categoria',
    accessorKey: 'categoria',
    enableSorting: false,
    header: ({ column }: { column: Column<Supplier, unknown> }) => (
      <DataTableColumnHeader column={column} title='Categoria' />
    ),
    cell: ({ cell }) => (
      <Badge variant='outline'>{cell.getValue<Supplier['categoria']>()}</Badge>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Categoria',
      variant: 'multiSelect',
      options: supplierCategoryOptions
    }
  },
  {
    accessorKey: 'email',
    header: 'E-mail',
    enableSorting: false
  },
  {
    accessorKey: 'telefone',
    header: 'Telefone',
    enableSorting: false
  },
  {
    id: 'homologado',
    accessorKey: 'homologado',
    enableSorting: false,
    header: 'Homologado',
    cell: ({ cell }) => {
      const ok = cell.getValue<Supplier['homologado']>();
      return (
        <Badge variant={ok ? 'default' : 'secondary'}>
          {ok ? <Icons.circleCheck /> : <Icons.xCircle />}
          {ok ? 'Sim' : 'Não'}
        </Badge>
      );
    }
  },
  {
    id: 'bloqueado',
    accessorKey: 'bloqueado',
    enableSorting: false,
    header: 'Situação',
    cell: ({ cell }) => {
      const bloqueado = cell.getValue<Supplier['bloqueado']>();
      return (
        <Badge variant={bloqueado ? 'destructive' : 'outline'}>
          {bloqueado ? 'Bloqueado' : 'Ativo'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

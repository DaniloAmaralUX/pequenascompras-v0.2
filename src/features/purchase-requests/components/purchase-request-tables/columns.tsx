'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { PurchaseRequest } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';
import {
  statusBadgeVariant,
  statusOptions,
  prioridadeOptions
} from '../../constants/purchase-request-options';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatData = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

/**
 * Monta as colunas da tabela de solicitações.
 * @param statusFiltravel quando false, a coluna de status não exibe filtro
 *   (usado nas visões com status pré-definido — Aprovações, Execução).
 */
export function buildColumns(statusFiltravel: boolean): ColumnDef<PurchaseRequest>[] {
  return [
    {
      id: 'numero',
      accessorKey: 'numero',
      header: ({ column }: { column: Column<PurchaseRequest, unknown> }) => (
        <DataTableColumnHeader column={column} title='Número' />
      ),
      cell: ({ cell }) => (
        <span className='font-mono text-sm font-medium'>
          {cell.getValue<PurchaseRequest['numero']>()}
        </span>
      ),
      meta: {
        label: 'Solicitação',
        placeholder: 'Buscar por número, solicitante...',
        variant: 'text',
        icon: Icons.text
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'solicitante_nome',
      header: 'Solicitante',
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <span className='font-medium'>{row.original.solicitante_nome}</span>
          <span className='text-muted-foreground text-xs'>{row.original.unidade}</span>
        </div>
      )
    },
    {
      accessorKey: 'centro_de_custo',
      header: 'Centro de Custo',
      enableSorting: false,
      cell: ({ cell }) => (
        <span className='font-mono text-sm'>
          {cell.getValue<PurchaseRequest['centro_de_custo']>()}
        </span>
      )
    },
    {
      id: 'valor_estimado',
      accessorKey: 'valor_estimado',
      header: ({ column }: { column: Column<PurchaseRequest, unknown> }) => (
        <DataTableColumnHeader column={column} title='Valor estimado' />
      ),
      cell: ({ cell }) => (
        <span className='tabular-nums'>
          {formatBRL(cell.getValue<PurchaseRequest['valor_estimado']>())}
        </span>
      )
    },
    {
      id: 'prioridade',
      accessorKey: 'prioridade',
      enableSorting: false,
      header: ({ column }: { column: Column<PurchaseRequest, unknown> }) => (
        <DataTableColumnHeader column={column} title='Prioridade' />
      ),
      cell: ({ cell }) => (
        <Badge variant='outline'>{cell.getValue<PurchaseRequest['prioridade']>()}</Badge>
      ),
      enableColumnFilter: true,
      meta: {
        label: 'Prioridade',
        variant: 'multiSelect',
        options: prioridadeOptions
      }
    },
    {
      id: 'status',
      accessorKey: 'status',
      enableSorting: false,
      header: ({ column }: { column: Column<PurchaseRequest, unknown> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<PurchaseRequest['status']>();
        return <Badge variant={statusBadgeVariant[status] ?? 'outline'}>{status}</Badge>;
      },
      enableColumnFilter: statusFiltravel,
      meta: {
        label: 'Status',
        variant: 'multiSelect',
        options: statusOptions
      }
    },
    {
      id: 'criada_em',
      accessorKey: 'criada_em',
      header: ({ column }: { column: Column<PurchaseRequest, unknown> }) => (
        <DataTableColumnHeader column={column} title='Criada em' />
      ),
      cell: ({ cell }) => (
        <span className='text-muted-foreground text-sm'>
          {formatData(cell.getValue<PurchaseRequest['criada_em']>())}
        </span>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
    }
  ];
}

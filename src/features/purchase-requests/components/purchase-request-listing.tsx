import { Suspense } from 'react';
import { ClientOnly } from '@/components/client-only';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { PurchaseRequestTable } from './purchase-request-tables';
import type { PurchaseStatus } from '../api/types';

/**
 * Sem prefetch no servidor: as solicitações vivem no localStorage do
 * testador, então a tabela busca os dados só no navegador (ver ClientOnly).
 */
export default function PurchaseRequestListingPage({
  presetStatuses
}: {
  presetStatuses?: PurchaseStatus[];
}) {
  const skeleton = <DataTableSkeleton columnCount={8} rowCount={10} filterCount={2} />;

  return (
    <ClientOnly fallback={skeleton}>
      <Suspense fallback={skeleton}>
        <PurchaseRequestTable presetStatuses={presetStatuses} />
      </Suspense>
    </ClientOnly>
  );
}

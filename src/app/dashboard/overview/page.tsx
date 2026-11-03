import { Suspense } from 'react';
import { requireProfile } from '@/lib/route-guard';
import PageContainer from '@/components/layout/page-container';
import { ClientOnly } from '@/components/client-only';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import PurchaseDashboard from '@/features/reports/components/purchase-dashboard';

export const metadata = {
  title: 'Compras: Dashboard'
};

export default async function Page() {
  await requireProfile(['Gestor', 'Analista de Suprimentos']);

  // Sem prefetch no servidor: os indicadores são calculados sobre as
  // solicitações do localStorage do testador (ver ClientOnly).
  const skeleton = <DataTableSkeleton columnCount={4} rowCount={6} />;

  return (
    <PageContainer
      pageTitle='Dashboard de Compras'
      pageDescription='Visão geral das pequenas compras — gasto, recorrência e indicadores.'
    >
      <ClientOnly fallback={skeleton}>
        <Suspense fallback={skeleton}>
          <PurchaseDashboard />
        </Suspense>
      </ClientOnly>
    </PageContainer>
  );
}

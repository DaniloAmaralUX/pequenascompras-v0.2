import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { requireProfile } from '@/lib/route-guard';
import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import PurchaseDashboard from '@/features/reports/components/purchase-dashboard';
import { dashboardQueryOptions } from '@/features/reports/api/queries';

export const metadata = {
  title: 'Compras: Dashboard'
};

export default async function Page() {
  await requireProfile(['Gestor', 'Analista de Suprimentos']);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(dashboardQueryOptions());

  return (
    <PageContainer
      pageTitle='Dashboard de Compras'
      pageDescription='Visão geral das pequenas compras — gasto, recorrência e indicadores.'
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<DataTableSkeleton columnCount={4} rowCount={6} />}>
          <PurchaseDashboard />
        </Suspense>
      </HydrationBoundary>
    </PageContainer>
  );
}

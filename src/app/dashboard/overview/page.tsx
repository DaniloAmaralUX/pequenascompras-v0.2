import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { SearchParams } from 'nuqs/server';
import { getQueryClient } from '@/lib/query-client';
import { requireProfile } from '@/lib/route-guard';
import { searchParamsCache } from '@/lib/searchparams';
import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import PurchaseDashboard from '@/features/reports/components/purchase-dashboard';
import { dashboardQueryOptions } from '@/features/reports/api/queries';

export const metadata = {
  title: 'Compras: Dashboard'
};

type PageProps = { searchParams: Promise<SearchParams> };

export default async function Page(props: PageProps) {
  await requireProfile(['Gestor', 'Analista de Suprimentos']);

  const sp = await searchParamsCache.parse(await props.searchParams);
  const periodoDias = sp.periodo === 0 ? null : sp.periodo;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(dashboardQueryOptions(periodoDias));

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

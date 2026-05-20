import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import PrecosAlertasReport from '@/features/reports/components/precos-alertas-report';
import { alertasPrecoQueryOptions } from '@/features/reports/api/queries';

export const metadata = {
  title: 'Relatórios: Preços & Alertas'
};

export default function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(alertasPrecoQueryOptions());

  return (
    <PageContainer
      pageTitle='Preços & Alertas'
      pageDescription='Itens com preço acima da média histórica — apoio à negociação.'
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<DataTableSkeleton columnCount={6} rowCount={8} />}>
          <PrecosAlertasReport />
        </Suspense>
      </HydrationBoundary>
    </PageContainer>
  );
}

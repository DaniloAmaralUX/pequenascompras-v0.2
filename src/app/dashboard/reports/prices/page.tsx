import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { requireProfile } from '@/lib/route-guard';
import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { ExportButton } from '@/components/export-button';
import PrecosAlertasReport from '@/features/reports/components/precos-alertas-report';
import { alertasPrecoQueryOptions } from '@/features/reports/api/queries';

export const metadata = {
  title: 'Relatórios: Preços & Alertas'
};

export default async function Page() {
  await requireProfile(['Analista de Suprimentos']);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(alertasPrecoQueryOptions());

  return (
    <PageContainer
      pageTitle='Preços & Alertas'
      pageDescription='Itens com preço acima da média histórica — apoio à negociação.'
      pageHeaderAction={<ExportButton reportName='Preços & Alertas' />}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<DataTableSkeleton columnCount={6} rowCount={8} />}>
          <PrecosAlertasReport />
        </Suspense>
      </HydrationBoundary>
    </PageContainer>
  );
}

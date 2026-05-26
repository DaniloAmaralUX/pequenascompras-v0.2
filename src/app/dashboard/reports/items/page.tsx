import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { requireProfile } from '@/lib/route-guard';
import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { ExportButton } from '@/components/export-button';
import ItensRecorrentesReport from '@/features/reports/components/itens-recorrentes-report';
import { itensRecorrentesQueryOptions } from '@/features/reports/api/queries';

export const metadata = {
  title: 'Relatórios: Itens Recorrentes'
};

export default async function Page() {
  await requireProfile(['Analista de Suprimentos']);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(itensRecorrentesQueryOptions());

  return (
    <PageContainer
      pageTitle='Itens Recorrentes'
      pageDescription='Itens comprados repetidamente — candidatos a compra em atacado ou contrato.'
      pageHeaderAction={<ExportButton reportName='Itens Recorrentes' />}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<DataTableSkeleton columnCount={8} rowCount={8} />}>
          <ItensRecorrentesReport />
        </Suspense>
      </HydrationBoundary>
    </PageContainer>
  );
}

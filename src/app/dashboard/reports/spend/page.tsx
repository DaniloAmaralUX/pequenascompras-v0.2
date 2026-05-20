import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import GastoSetorReport from '@/features/reports/components/gasto-setor-report';
import { gastoPorSetorQueryOptions } from '@/features/reports/api/queries';

export const metadata = {
  title: 'Relatórios: Gasto por Setor'
};

export default function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(gastoPorSetorQueryOptions());

  return (
    <PageContainer
      pageTitle='Gasto por Setor'
      pageDescription='Distribuição do gasto com pequenas compras por centro de custo.'
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<DataTableSkeleton columnCount={4} rowCount={8} />}>
          <GastoSetorReport />
        </Suspense>
      </HydrationBoundary>
    </PageContainer>
  );
}

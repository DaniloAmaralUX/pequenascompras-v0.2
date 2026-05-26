import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { requireProfile } from '@/lib/route-guard';
import { costCenterByIdOptions } from '@/features/cost-centers/api/queries';
import PageContainer from '@/components/layout/page-container';
import CostCenterViewPage from '@/features/cost-centers/components/cost-center-view-page';

export const metadata = {
  title: 'Compras: Centro de Custo'
};

type PageProps = { params: Promise<{ costCenterId: string }> };

export default async function Page(props: PageProps) {
  await requireProfile(['Analista de Suprimentos']);
  const params = await props.params;
  const queryClient = getQueryClient();

  if (params.costCenterId !== 'new') {
    void queryClient.prefetchQuery(costCenterByIdOptions(Number(params.costCenterId)));
  }

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CostCenterViewPage costCenterId={params.costCenterId} />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { purchaseRequestByIdOptions } from '@/features/purchase-requests/api/queries';
import PageContainer from '@/components/layout/page-container';
import PurchaseRequestViewPage from '@/features/purchase-requests/components/purchase-request-view-page';

export const metadata = {
  title: 'Compras: Solicitação'
};

type PageProps = { params: Promise<{ requestId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  if (params.requestId !== 'new') {
    void queryClient.prefetchQuery(purchaseRequestByIdOptions(Number(params.requestId)));
  }

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PurchaseRequestViewPage requestId={params.requestId} />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}

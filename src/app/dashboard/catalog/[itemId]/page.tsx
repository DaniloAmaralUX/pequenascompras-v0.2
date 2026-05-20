import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { catalogItemByIdOptions } from '@/features/catalog-items/api/queries';
import PageContainer from '@/components/layout/page-container';
import CatalogItemViewPage from '@/features/catalog-items/components/catalog-item-view-page';

export const metadata = {
  title: 'Compras: Item de Catálogo'
};

type PageProps = { params: Promise<{ itemId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  if (params.itemId !== 'new') {
    void queryClient.prefetchQuery(catalogItemByIdOptions(Number(params.itemId)));
  }

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CatalogItemViewPage itemId={params.itemId} />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}

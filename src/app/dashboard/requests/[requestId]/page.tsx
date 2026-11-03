import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { ClientOnly } from '@/components/client-only';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PurchaseRequestViewPage from '@/features/purchase-requests/components/purchase-request-view-page';

export const metadata = {
  title: 'Compras: Solicitação'
};

type PageProps = { params: Promise<{ requestId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  // Sem prefetch no servidor: a solicitação pode existir só no
  // localStorage do testador (recém-criada ou alterada por ele).
  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <ClientOnly fallback={<FormCardSkeleton />}>
          <Suspense fallback={<FormCardSkeleton />}>
            <PurchaseRequestViewPage requestId={params.requestId} />
          </Suspense>
        </ClientOnly>
      </div>
    </PageContainer>
  );
}

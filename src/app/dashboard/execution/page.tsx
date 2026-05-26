import PageContainer from '@/components/layout/page-container';
import PurchaseRequestListingPage from '@/features/purchase-requests/components/purchase-request-listing';
import { STATUS_VIEWS } from '@/features/purchase-requests/constants/purchase-request-options';
import { requireProfile } from '@/lib/route-guard';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Compras: Execução'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  await requireProfile(['Analista de Suprimentos']);
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Fila de Execução'
      pageDescription='Solicitações aprovadas em execução pelo analista de suprimentos.'
    >
      <PurchaseRequestListingPage presetStatuses={STATUS_VIEWS.execucao} />
    </PageContainer>
  );
}

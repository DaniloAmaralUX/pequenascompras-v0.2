import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import PurchaseRequestListingPage from '@/features/purchase-requests/components/purchase-request-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Compras: Solicitações'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Solicitações de Compra'
      pageDescription='Todas as solicitações de pequenas compras e seu andamento no fluxo.'
      pageHeaderAction={
        <Link
          href='/dashboard/requests/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 size-4' aria-hidden='true' /> Nova Solicitação
        </Link>
      }
    >
      <PurchaseRequestListingPage />
    </PageContainer>
  );
}

import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import CostCenterListingPage from '@/features/cost-centers/components/cost-center-listing';
import { requireProfile } from '@/lib/route-guard';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Compras: Centros de Custo'
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
      pageTitle='Centros de Custo'
      pageDescription='Cadastro de centros de custo das unidades do SESI.'
      pageHeaderAction={
        <Link
          href='/dashboard/cost-centers/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 h-4 w-4' aria-hidden='true' /> Novo Centro de Custo
        </Link>
      }
    >
      <CostCenterListingPage />
    </PageContainer>
  );
}

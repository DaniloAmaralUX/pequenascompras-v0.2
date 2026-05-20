import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import SupplierListingPage from '@/features/suppliers/components/supplier-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Compras: Fornecedores'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Fornecedores'
      pageDescription='Cadastro de fornecedores homologados para pequenas compras.'
      pageHeaderAction={
        <Link
          href='/dashboard/suppliers/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 h-4 w-4' /> Novo Fornecedor
        </Link>
      }
    >
      <SupplierListingPage />
    </PageContainer>
  );
}

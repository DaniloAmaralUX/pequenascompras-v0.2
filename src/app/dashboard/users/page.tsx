import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import UserListingPage from '@/features/users/components/user-listing';
import { requireProfile } from '@/lib/route-guard';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import type { SearchParams } from 'nuqs/server';
import { usersInfoContent } from '@/features/users/info-content';

export const metadata = {
  title: 'Dashboard: Usuários'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function UsersPage(props: PageProps) {
  await requireProfile(['Analista de Suprimentos']);
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Usuários'
      pageDescription='Gerenciamento de usuários do sistema.'
      infoContent={usersInfoContent}
      pageHeaderAction={
        <Link
          href='/dashboard/users/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 h-4 w-4' /> Novo Usuário
        </Link>
      }
    >
      <UserListingPage />
    </PageContainer>
  );
}

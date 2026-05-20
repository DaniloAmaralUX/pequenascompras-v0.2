import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { suppliersQueryOptions } from '../api/queries';
import { SupplierTable } from './supplier-tables';

export default function SupplierListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('nome');
  const pageLimit = searchParamsCache.get('perPage');
  const categorias = searchParamsCache.get('categoria');
  const sort = searchParamsCache.get('sort');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categorias && { categorias }),
    ...(sort && { sort })
  };

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(suppliersQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SupplierTable />
    </HydrationBoundary>
  );
}

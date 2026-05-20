import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { catalogItemsQueryOptions } from '../api/queries';
import { CatalogItemTable } from './catalog-item-tables';

export default function CatalogItemListingPage() {
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

  void queryClient.prefetchQuery(catalogItemsQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogItemTable />
    </HydrationBoundary>
  );
}

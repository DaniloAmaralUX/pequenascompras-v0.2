import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { costCentersQueryOptions } from '../api/queries';
import { CostCenterTable } from './cost-center-tables';

export default function CostCenterListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('nome');
  const pageLimit = searchParamsCache.get('perPage');
  const unidades = searchParamsCache.get('unidade');
  const sort = searchParamsCache.get('sort');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(unidades && { unidades }),
    ...(sort && { sort })
  };

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(costCentersQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CostCenterTable />
    </HydrationBoundary>
  );
}

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { purchaseRequestsQueryOptions } from '../api/queries';
import { PurchaseRequestTable } from './purchase-request-tables';
import type { PurchaseStatus } from '../api/types';

export default function PurchaseRequestListingPage({
  presetStatuses
}: {
  presetStatuses?: PurchaseStatus[];
}) {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('numero');
  const pageLimit = searchParamsCache.get('perPage');
  const prioridade = searchParamsCache.get('prioridade');
  const status = searchParamsCache.get('status');
  const sort = searchParamsCache.get('sort');

  const statuses = presetStatuses ? presetStatuses.join(',') : status;

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(prioridade && { prioridades: prioridade }),
    ...(statuses && { statuses }),
    ...(sort && { sort })
  };

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(purchaseRequestsQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PurchaseRequestTable presetStatuses={presetStatuses} />
    </HydrationBoundary>
  );
}

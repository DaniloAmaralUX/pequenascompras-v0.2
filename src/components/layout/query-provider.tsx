'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/query-client';
import { useEffect, type ReactNode } from 'react';
import { purchaseRequestKeys } from '@/features/purchase-requests/api/queries';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  // Após hidratação, invalida queries que dependem do mock store client-side.
  // Garante que os dados persistidos em localStorage (incluindo writes do
  // usuário em sessões anteriores) substituam o snapshot SSR.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: purchaseRequestKeys.all });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

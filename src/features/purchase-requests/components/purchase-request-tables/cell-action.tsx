'use client';

import { Button } from '@/components/ui/button';
import type { PurchaseRequest } from '../../api/types';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';

interface CellActionProps {
  data: PurchaseRequest;
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter();

  return (
    <Button
      variant='ghost'
      size='sm'
      className='h-8'
      onClick={() => router.push(`/dashboard/requests/${data.id}`)}
    >
      <Icons.arrowRight className='mr-1 h-4 w-4' aria-hidden='true' /> Detalhes
    </Button>
  );
}

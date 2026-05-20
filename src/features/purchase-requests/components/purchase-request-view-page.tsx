'use client';

import PurchaseRequestForm from './purchase-request-form';
import PurchaseRequestDetail from './purchase-request-detail';

export default function PurchaseRequestViewPage({ requestId }: { requestId: string }) {
  if (requestId === 'new') {
    return <PurchaseRequestForm />;
  }

  return <PurchaseRequestDetail requestId={Number(requestId)} />;
}

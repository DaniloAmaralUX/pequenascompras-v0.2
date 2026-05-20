'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { CostCenter } from '../api/types';
import { notFound } from 'next/navigation';
import CostCenterForm from './cost-center-form';
import { costCenterByIdOptions } from '../api/queries';

type CostCenterViewPageProps = {
  costCenterId: string;
};

export default function CostCenterViewPage({ costCenterId }: CostCenterViewPageProps) {
  if (costCenterId === 'new') {
    return <CostCenterForm initialData={null} pageTitle='Novo Centro de Custo' />;
  }

  return <EditCostCenterView costCenterId={Number(costCenterId)} />;
}

function EditCostCenterView({ costCenterId }: { costCenterId: number }) {
  const { data } = useSuspenseQuery(costCenterByIdOptions(costCenterId));

  if (!data?.success || !data?.cost_center) {
    notFound();
  }

  return (
    <CostCenterForm
      initialData={data.cost_center as CostCenter}
      pageTitle='Editar Centro de Custo'
    />
  );
}

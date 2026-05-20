'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { Supplier } from '../api/types';
import { notFound } from 'next/navigation';
import SupplierForm from './supplier-form';
import { supplierByIdOptions } from '../api/queries';

type SupplierViewPageProps = {
  supplierId: string;
};

export default function SupplierViewPage({ supplierId }: SupplierViewPageProps) {
  if (supplierId === 'new') {
    return <SupplierForm initialData={null} pageTitle='Novo Fornecedor' />;
  }

  return <EditSupplierView supplierId={Number(supplierId)} />;
}

function EditSupplierView({ supplierId }: { supplierId: number }) {
  const { data } = useSuspenseQuery(supplierByIdOptions(supplierId));

  if (!data?.success || !data?.supplier) {
    notFound();
  }

  return <SupplierForm initialData={data.supplier as Supplier} pageTitle='Editar Fornecedor' />;
}

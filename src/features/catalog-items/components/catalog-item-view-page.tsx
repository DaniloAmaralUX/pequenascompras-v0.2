'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { CatalogItem } from '../api/types';
import { notFound } from 'next/navigation';
import CatalogItemForm from './catalog-item-form';
import { catalogItemByIdOptions } from '../api/queries';

type CatalogItemViewPageProps = {
  itemId: string;
};

export default function CatalogItemViewPage({ itemId }: CatalogItemViewPageProps) {
  if (itemId === 'new') {
    return <CatalogItemForm initialData={null} pageTitle='Novo Item de Catálogo' />;
  }

  return <EditCatalogItemView itemId={Number(itemId)} />;
}

function EditCatalogItemView({ itemId }: { itemId: number }) {
  const { data } = useSuspenseQuery(catalogItemByIdOptions(itemId));

  if (!data?.success || !data?.item) {
    notFound();
  }

  return <CatalogItemForm initialData={data.item as CatalogItem} pageTitle='Editar Item' />;
}

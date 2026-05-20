'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Mapeamento de rótulos amigáveis para as rotas do sistema de compras
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/overview': [{ title: 'Dashboard', link: '/dashboard/overview' }],
  '/dashboard/suppliers': [{ title: 'Fornecedores', link: '/dashboard/suppliers' }],
  '/dashboard/cost-centers': [{ title: 'Centros de Custo', link: '/dashboard/cost-centers' }],
  '/dashboard/catalog': [{ title: 'Catálogo de Itens', link: '/dashboard/catalog' }],
  '/dashboard/users': [{ title: 'Usuários', link: '/dashboard/users' }]
  // Adicione mais mapeamentos conforme necessário
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}

'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

/** Rótulo amigável (PT-BR) por segmento de URL. */
const SEGMENT_LABELS: Record<string, string> = {
  overview: 'Dashboard',
  requests: 'Solicitações',
  approvals: 'Aprovações',
  execution: 'Execução',
  suppliers: 'Fornecedores',
  catalog: 'Catálogo de Itens',
  'cost-centers': 'Centros de Custo',
  users: 'Usuários',
  items: 'Itens Recorrentes',
  spend: 'Gasto por Setor',
  prices: 'Preços & Alertas',
  profile: 'Perfil',
  notifications: 'Notificações',
  new: 'Novo'
};

/** Segmentos de agrupamento — não têm página própria, não viram crumb. */
const GROUPING_SEGMENTS = new Set(['dashboard', 'reports']);

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const segments = pathname.split('/').filter(Boolean);

    return segments.reduce<BreadcrumbItem[]>((crumbs, segment, index) => {
      if (GROUPING_SEGMENTS.has(segment)) return crumbs;

      const link = `/${segments.slice(0, index + 1).join('/')}`;
      const label =
        SEGMENT_LABELS[segment] ??
        (/^\d+$/.test(segment)
          ? 'Detalhe'
          : segment.charAt(0).toUpperCase() + segment.slice(1));

      crumbs.push({ title: label, link });
      return crumbs;
    }, []);
  }, [pathname]);

  return breadcrumbs;
}

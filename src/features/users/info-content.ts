import type { InfobarContent } from '@/components/ui/infobar';

export const usersInfoContent: InfobarContent = {
  title: 'Usuários — Padrão React Query + nuqs',
  sections: [
    {
      title: 'Visão Geral',
      description:
        'Esta página demonstra busca de dados no lado do cliente com React Query combinada com parâmetros de URL via nuqs — como alternativa à página de Produtos que usa busca server-side com RSC. Ambos os padrões utilizam o mesmo DataTable, hook useDataTable e estado de URL com nuqs.',
      links: [
        {
          title: 'Docs TanStack Query SSR',
          url: 'https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr'
        }
      ]
    },
    {
      title: 'Prefetch no Servidor + Hidratação no Cliente',
      description:
        'O componente servidor lê os parâmetros de busca via searchParamsCache, constrói os filtros e chama queryClient.prefetchQuery(). O estado desidratado é passado ao HydrationBoundary para que o cliente inicie com dados em cache. O componente cliente lê os mesmos parâmetros via useQueryState e chama useSuspenseQuery com os filtros correspondentes.',
      links: []
    },
    {
      title: 'Estado de URL com nuqs',
      description:
        'Paginação, busca e filtros de perfil são sincronizados na URL via nuqs. O hook useDataTable gerencia o estado da TanStack Table e aplica debounce nas mudanças de filtro antes de atualizar a URL. Quando a URL muda, o React Query refaz a busca automaticamente pois a chave de query inclui os filtros.',
      links: [
        {
          title: 'Documentação nuqs',
          url: 'https://nuqs.47ng.com'
        }
      ]
    },
    {
      title: 'Diferença: Produtos vs. Usuários',
      description:
        'Produtos: searchParams → busca RSC → passa dados como props para a tabela cliente. Usuários: searchParams → prefetch no servidor → HydrationBoundary → useSuspenseQuery no cliente. O padrão de Usuários permite refetch em segundo plano, compartilhamento de cache entre componentes e mutações otimistas.',
      links: []
    }
  ]
};

'use client';

/**
 * Hook para filtrar itens de navegação com base no perfil ativo (RBAC client-side).
 * Síncrono e sem dependências externas — usado pela sidebar e pelo kbar.
 */

import { useMemo } from 'react';
import type { NavItem, NavGroup } from '@/types';
import { useActiveProfile } from '@/components/layout/active-profile';

/**
 * Filtra itens de navegação conforme o perfil ativo.
 *
 * @param items - Itens de navegação a filtrar
 * @returns Itens filtrados
 */
export function useFilteredNavItems(items: NavItem[]) {
  const { activeProfile } = useActiveProfile();

  return useMemo(() => {
    const matches = (item: NavItem) => {
      if (!item.access) return true;
      if (item.access.profiles && !item.access.profiles.includes(activeProfile)) {
        return false;
      }
      return true;
    };

    return items.filter(matches).map((item) => {
      if (item.items && item.items.length > 0) {
        return { ...item, items: item.items.filter(matches) };
      }
      return item;
    });
  }, [items, activeProfile]);
}

/**
 * Filtra grupos de navegação conforme o perfil ativo.
 * Remove grupos que ficaram sem itens após o filtro.
 */
export function useFilteredNavGroups(groups: NavGroup[]) {
  const allItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const filteredItems = useFilteredNavItems(allItems);

  return useMemo(() => {
    const filteredSet = new Set(filteredItems.map((item) => item.title));
    return groups
      .map((group) => ({
        ...group,
        items: filteredItems.filter((item) =>
          group.items.some((gi) => gi.title === item.title && filteredSet.has(gi.title))
        )
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, filteredItems]);
}

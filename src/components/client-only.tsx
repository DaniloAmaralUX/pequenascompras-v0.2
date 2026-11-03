'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

// ============================================================
// ClientOnly — renderiza os filhos apenas no navegador
// ============================================================
// Os stores mock de solicitações vivem no localStorage de cada
// testador. Renderizar essas telas no servidor usaria a cópia do
// servidor (que não conhece o que o testador criou ou alterou) e
// sobrescreveria a do navegador. No servidor e na hidratação,
// exibe o `fallback`; depois de montado, os filhos.
// ============================================================

const subscribe = () => () => {};

export function ClientOnly({
  children,
  fallback = null
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  return isClient ? children : fallback;
}

'use client';

import { useEffect } from 'react';

/**
 * Avisa o usuário ao tentar fechar/recarregar a aba com alterações pendentes
 * em um formulário. Para navegação dentro do app, combine com uma confirmação
 * explícita no botão de sair/voltar.
 */
export function useUnsavedChangesWarning(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [enabled]);
}

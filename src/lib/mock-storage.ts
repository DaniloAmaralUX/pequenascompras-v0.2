// ============================================================
// Persistência client-side dos stores mock — protótipo Pequenas Compras
// ============================================================
// Cada testador tem sua própria cópia dos dados no navegador via
// localStorage, permitindo que solicitações criadas persistam entre
// refreshes durante a sessão de teste autônomo.
// ============================================================

const STORAGE_PREFIX = 'pequenas-compras-mock:';

export function loadFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {
    /* quota exceeded ou storage desabilitado — segue sem persistir */
  }
}

export function clearMockStorage(): void {
  if (typeof window === 'undefined') return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith(STORAGE_PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}

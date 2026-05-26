// ============================================================
// Route Guard — proteção de rota a nível de página (server-side)
// ============================================================
// Complementa o RBAC client-side da sidebar (use-nav). Aqui o
// bloqueio acontece no servidor antes de renderizar, impedindo
// acesso direto por URL a páginas fora do perfil ativo.
// ============================================================

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DEFAULT_PROFILE, isProfileId, type ProfileId } from '@/config/profiles';

/** Página inicial de cada perfil — destino do fallback ao bloquear acesso. */
const PROFILE_HOME: Record<ProfileId, string> = {
  Solicitante: '/dashboard/requests',
  Gestor: '/dashboard/overview',
  'Analista de Suprimentos': '/dashboard/overview'
};

/** Lê o cookie `active_profile` e retorna o perfil ativo (com fallback). */
export async function getActiveProfile(): Promise<ProfileId> {
  const cookieStore = await cookies();
  const value = cookieStore.get('active_profile')?.value;
  return isProfileId(value) ? value : DEFAULT_PROFILE;
}

/**
 * Bloqueia o acesso à página se o perfil ativo não estiver na lista permitida.
 * Use no topo de páginas server-side protegidas.
 *
 * @example
 *   export default async function Page() {
 *     await requireProfile(['Analista de Suprimentos']);
 *     // ...
 *   }
 */
export async function requireProfile(allowed: ProfileId[]): Promise<void> {
  const profile = await getActiveProfile();
  if (!allowed.includes(profile)) {
    redirect(PROFILE_HOME[profile]);
  }
}

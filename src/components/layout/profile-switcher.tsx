'use client';

import * as React from 'react';
import { Icons } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PROFILES, type ProfileId } from '@/config/profiles';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useActiveProfile } from './active-profile';

/**
 * Seletor "Ver como" — ferramenta de protótipo para visualizar a aplicação
 * como cada perfil de usuário. Dirige o RBAC client-side (menu + ações de workflow).
 *
 * Craft:
 * - Trigger evidente com bg-card, border, hover state e sparkles icon
 * - Ícone do perfil ativo em destaque (primary color) — indica "este é seu papel"
 * - Tag pill "Ver como" como rótulo institucional à esquerda
 * - Tooltip reforçando a affordance
 * - Dropdown com cada perfil em layout 2-linhas (nome + descrição)
 * - Indicador visual claro do perfil atualmente selecionado
 */
export function ProfileSwitcher() {
  const { activeProfile, setActiveProfile } = useActiveProfile();
  const router = useRouter();

  const handleProfileChange = (value: string) => {
    const profileId = value as ProfileId;
    setActiveProfile(profileId);
    if (profileId === 'Solicitante') router.push('/dashboard/requests');
  };

  const activeProfileData = PROFILES.find((p) => p.id === activeProfile);
  const ActiveIcon = activeProfileData ? Icons[activeProfileData.icon] : null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className='inline-flex'>
          <Select value={activeProfile} onValueChange={handleProfileChange}>
            <SelectTrigger
              size='sm'
              aria-label='Trocar perfil de visualização'
              className={cn(
                'border-border/60 bg-card/80 hover:bg-card data-[state=open]:bg-card data-[state=open]:border-primary/40',
                'shadow-xs hover:shadow-sm data-[state=open]:shadow-sm',
                'h-9 gap-2.5 pr-2 pl-2.5',
                'transition-[background-color,border-color,box-shadow] duration-200'
              )}
            >
              <span className='bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase'>
                <Icons.teams className='size-2.5' aria-hidden='true' />
                <span className='hidden lg:inline'>Ver como</span>
              </span>
              <span className='flex items-center gap-1.5'>
                {ActiveIcon && <ActiveIcon className='text-primary size-4 shrink-0' />}
                <span className='font-medium'>{activeProfileData?.label}</span>
              </span>
            </SelectTrigger>
            <SelectContent align='end' className='min-w-[18rem]' sideOffset={6}>
              <div className='text-muted-foreground border-border/50 border-b px-2 pt-1.5 pb-2 text-xs'>
                Escolha um perfil para experimentar a aplicação como ele veria.
              </div>
              <SelectGroup className='p-1'>
                {PROFILES.map((profile) => {
                  const Icon = Icons[profile.icon];
                  const isActive = profile.id === activeProfile;
                  return (
                    <SelectItem
                      key={profile.id}
                      value={profile.id}
                      className={cn(
                        'py-2 pl-2 transition-colors',
                        isActive && 'bg-primary/[0.06]'
                      )}
                    >
                      <div className='flex items-start gap-2.5'>
                        <span
                          className={cn(
                            'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          <Icon className='size-4' />
                        </span>
                        <div className='flex flex-col leading-tight'>
                          <span className='text-sm font-medium'>{profile.label}</span>
                          <span className='text-muted-foreground text-xs'>
                            {profile.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </span>
      </TooltipTrigger>
      <TooltipContent side='bottom'>Trocar perfil de visualização</TooltipContent>
    </Tooltip>
  );
}

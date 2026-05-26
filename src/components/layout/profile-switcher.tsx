'use client';

import { Icons } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PROFILES, type ProfileId } from '@/config/profiles';
import { useRouter } from 'next/navigation';
import { useActiveProfile } from './active-profile';

/**
 * Seletor "Ver como" — ferramenta de protótipo para visualizar a aplicação
 * como cada perfil de usuário. Dirige o RBAC client-side (menu + ações de workflow).
 */
export function ProfileSwitcher() {
  const { activeProfile, setActiveProfile } = useActiveProfile();
  const router = useRouter();

  const handleProfileChange = (value: string) => {
    const profileId = value as ProfileId;
    setActiveProfile(profileId);
    // Solicitante não vê Dashboard — redireciona para sua tela principal
    if (profileId === 'Solicitante') router.push('/dashboard/requests');
  };

  return (
    <Select value={activeProfile} onValueChange={handleProfileChange}>
      <SelectTrigger size='sm' aria-label='Visualizar a aplicação como um perfil'>
        <span className='text-muted-foreground hidden text-xs lg:inline'>Ver como</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align='end' className='min-w-72'>
        <SelectGroup>
          {PROFILES.map((profile) => {
            const Icon = Icons[profile.icon];
            return (
              <SelectItem key={profile.id} value={profile.id} className='py-2'>
                <div className='flex items-start gap-2'>
                  <Icon className='mt-0.5 h-4 w-4 shrink-0' />
                  <div className='flex flex-col'>
                    <span className='font-medium'>{profile.label}</span>
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
  );
}

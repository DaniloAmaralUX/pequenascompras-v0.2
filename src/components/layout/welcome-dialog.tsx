'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PROFILES } from '@/config/profiles';
import { useActiveProfile } from './active-profile';

const STORAGE_KEY = 'pequenas-compras-mock:welcome-seen';

export function WelcomeDialog() {
  const [open, setOpen] = React.useState(false);
  const { setActiveProfile } = useActiveProfile();
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setOpen(true);
    } catch {
      /* localStorage indisponível — abre o dialog mesmo assim */
      setOpen(true);
    }
  }, []);

  const markSeenAndClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const startAsSolicitante = () => {
    setActiveProfile('Solicitante');
    markSeenAndClose();
    router.push('/dashboard/requests');
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && markSeenAndClose()}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            Bem-vindo ao protótipo de Pequenas Compras
          </DialogTitle>
          <DialogDescription>
            Este é um protótipo de demonstração do sistema do SESI. Você pode
            experimentar a aplicação como qualquer um dos três perfis usando o
            seletor <span className='font-semibold'>&ldquo;Ver como&rdquo;</span> no topo
            da tela.
          </DialogDescription>
        </DialogHeader>

        <div className='my-2 grid gap-3 sm:grid-cols-3'>
          {PROFILES.map((profile) => {
            const Icon = Icons[profile.icon];
            return (
              <div
                key={profile.id}
                className='bg-muted/40 flex flex-col gap-2 rounded-lg border p-3'
              >
                <div className='flex items-center gap-2'>
                  <Icon className='text-primary h-4 w-4' />
                  <span className='font-semibold text-sm'>{profile.label}</span>
                </div>
                <p className='text-muted-foreground text-xs leading-relaxed'>
                  {profile.description}
                </p>
              </div>
            );
          })}
        </div>

        <p className='text-muted-foreground text-xs'>
          Dados são fictícios e persistem apenas no seu navegador para a sessão
          de teste. Você pode criar solicitações como Solicitante, aprovar como
          Gestor e executar a compra como Analista — testando o fluxo completo.
        </p>

        <DialogFooter className='gap-2 sm:gap-2'>
          <Button variant='outline' onClick={markSeenAndClose}>
            Explorar livremente
          </Button>
          <Button onClick={startAsSolicitante}>
            <Icons.request className='mr-1 h-4 w-4' />
            Começar como Solicitante
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

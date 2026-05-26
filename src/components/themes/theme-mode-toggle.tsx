'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Alternador entre tema light e dark.
 *
 * Polish aplicado:
 * - Cross-fade do ícone (sun/moon) com scale + opacity + blur (spring duration 0.3, bounce 0)
 * - View Transition API quando suportada (transição visual suave de cores)
 * - Tooltip indicando ação
 * - Tabular-ready: tamanho fixo size-8 sem layout shift
 */
export function ThemeModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';
  const next = isDark ? 'light' : 'dark';
  const label = next === 'light' ? 'Mudar para tema claro' : 'Mudar para tema escuro';

  const handleToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const root = document.documentElement;
      if (!document.startViewTransition) {
        setTheme(next);
        return;
      }
      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }
      document.startViewTransition(() => setTheme(next));
    },
    [next, setTheme]
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative size-8'
          aria-label={mounted ? label : 'Alternar tema'}
          onClick={handleToggle}
        >
          {mounted ? (
            <AnimatePresence initial={false} mode='wait'>
              <motion.span
                key={isDark ? 'moon' : 'sun'}
                initial={{ scale: 0.25, opacity: 0, filter: 'blur(4px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 0.25, opacity: 0, filter: 'blur(4px)' }}
                transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                className='absolute inset-0 flex items-center justify-center'
              >
                {isDark ? (
                  <Icons.moon className='size-4' aria-hidden='true' />
                ) : (
                  <Icons.sun className='size-4' aria-hidden='true' />
                )}
              </motion.span>
            </AnimatePresence>
          ) : (
            <Icons.brightness className='size-4' aria-hidden='true' />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{mounted ? label : 'Alternar tema'}</TooltipContent>
    </Tooltip>
  );
}

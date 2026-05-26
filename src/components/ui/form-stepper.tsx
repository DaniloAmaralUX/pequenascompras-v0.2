'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export type FormStepperStep = {
  /** Texto curto que descreve a etapa (ex.: "Dados gerais"). */
  label: string;
};

export type FormStepperProps = {
  steps: FormStepperStep[];
  /** Etapa atual em base 1 (a primeira etapa é 1). */
  currentStep: number;
  className?: string;
};

/**
 * Indicador de progresso de formulários multi-step com círculos numerados,
 * conectores animados entre etapas e check icon ao concluir.
 *
 * Princípios aplicados:
 * - Tabular numbers nos números das etapas (sem layout shift)
 * - Concentric border radius (ring com offset do círculo)
 * - Animação stagger ao concluir (scale + opacity + blur)
 * - Sem `transition: all` — propriedades específicas
 * - Hit area mínima 40×40px (size-8 do círculo + padding do `<li>`)
 * - `aria-current="step"` na etapa ativa
 */
export function FormStepper({ steps, currentStep, className }: FormStepperProps) {
  return (
    <nav aria-label='Progresso do formulário' className={cn('w-full pb-7', className)}>
      <ol className='flex items-center justify-between'>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.label}>
              <li
                className='relative shrink-0 py-1'
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-xs font-semibold',
                    'transition-[background-color,border-color,color,box-shadow] duration-300 ease-out',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isCurrent &&
                      'bg-primary text-primary-foreground ring-primary/20 ring-4',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-background border-muted-foreground/25 text-muted-foreground border-2'
                  )}
                >
                  {isCompleted ? (
                    <motion.span
                      key='check'
                      initial={{ scale: 0.25, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                      transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                      className='flex'
                    >
                      <Icons.check className='size-4' aria-hidden='true' />
                      <span className='sr-only'>Etapa {stepNumber} concluída</span>
                    </motion.span>
                  ) : (
                    <span className='tabular-nums'>{stepNumber}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'absolute top-11 left-1/2 -translate-x-1/2 text-center text-xs font-medium whitespace-nowrap',
                    'transition-colors duration-300 ease-out',
                    isCompleted || isCurrent
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </li>

              {!isLast && (
                <li
                  aria-hidden='true'
                  className='bg-muted-foreground/15 mx-3 h-0.5 flex-1 overflow-hidden rounded-full'
                >
                  <motion.div
                    initial={false}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                    style={{ originX: 0 }}
                    className='bg-primary h-full w-full'
                  />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

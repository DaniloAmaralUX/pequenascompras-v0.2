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
 * Indicador de progresso de formulários multi-step (padrão Stripe/Linear).
 *
 * Layout inline: círculo numerado + label lado a lado, conectados por
 * linhas finas que se preenchem ao concluir cada etapa.
 *
 * Princípios aplicados:
 * - Tabular numbers nos números das etapas (sem layout shift)
 * - Ring concêntrico no círculo da etapa atual
 * - Animação stagger ao concluir (scale + opacity + blur)
 * - Sem `transition: all` — propriedades específicas
 * - `aria-current="step"` na etapa ativa, `aria-hidden` nos conectores
 */
export function FormStepper({ steps, currentStep, className }: FormStepperProps) {
  return (
    <nav aria-label='Progresso do formulário' className={cn('w-full', className)}>
      <ol className='flex items-center gap-3'>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isActive = isCompleted || isCurrent;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.label}>
              <li
                className='flex shrink-0 items-center gap-2 py-1'
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                    'transition-[background-color,color,box-shadow] duration-300 ease-out',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isCurrent &&
                      'bg-primary text-primary-foreground ring-primary/20 ring-4',
                    !isActive && 'bg-muted text-muted-foreground'
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
                      <Icons.check className='size-3.5' aria-hidden='true' />
                      <span className='sr-only'>Etapa {stepNumber} concluída</span>
                    </motion.span>
                  ) : (
                    <span className='tabular-nums'>{stepNumber}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium whitespace-nowrap transition-colors duration-300',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </li>

              {!isLast && (
                <li
                  aria-hidden='true'
                  className='bg-muted-foreground/15 h-px flex-1 overflow-hidden rounded-full'
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

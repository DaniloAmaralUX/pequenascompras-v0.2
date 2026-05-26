'use client';

import { motion, useReducedMotion } from 'motion/react';

/**
 * Bloco com entrada escalonada — orquestra o carregamento das telas.
 * Use vários com `delay` crescente (~0.08s) para um reveal sequencial.
 * Respeita `prefers-reduced-motion`: sem movimento, o conteúdo aparece direto.
 */
export function RevealSection({
  children,
  delay = 0,
  className
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduzirMovimento = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduzirMovimento ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduzirMovimento ? { duration: 0 } : { duration: 0.3, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

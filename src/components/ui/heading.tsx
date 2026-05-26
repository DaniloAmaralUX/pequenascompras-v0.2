import { InfoButton } from '@/components/ui/info-button';
import type { InfobarContent } from '@/components/ui/infobar';

interface HeadingProps {
  title: string;
  description: string;
  infoContent?: InfobarContent;
}

/**
 * Cabeçalho de página com hierarquia tipográfica institucional:
 * - Title em Merriweather (display, serifada) com peso bold e tracking apertado
 * - Descrição em Geist (sans, body) com text-pretty para evitar órfãs
 *
 * O contraste serif/sans cria identidade visual forte (SESI editorial) e
 * diferencia títulos de seções secundárias (que usam --font-heading / Inter).
 */
export function Heading({ title, description, infoContent }: HeadingProps) {
  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-center gap-2'>
        <h1 className='font-[family-name:var(--font-merriweather)] text-3xl leading-tight font-bold tracking-tight text-balance md:text-[2.125rem]'>
          {title}
        </h1>
        {infoContent && (
          <div className='pt-1'>
            <InfoButton content={infoContent} />
          </div>
        )}
      </div>
      <p className='text-muted-foreground max-w-2xl text-sm text-pretty'>{description}</p>
    </div>
  );
}

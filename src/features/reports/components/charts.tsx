'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import type { SerieValor } from '../lib/analytics';

const CORES = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
];

const configValor = {
  valor: { label: 'Valor', color: 'var(--chart-1)' }
} satisfies ChartConfig;

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Alternativa textual do gráfico para leitores de tela — uma tabela `sr-only`
 * com os mesmos dados. O gráfico visual fica oculto da tecnologia assistiva.
 */
function ChartA11yTable({ caption, data }: { caption: string; data: SerieValor[] }) {
  return (
    <table className='sr-only'>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope='col'>Rótulo</th>
          <th scope='col'>Valor</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.rotulo}>
            <td>{d.rotulo}</td>
            <td>{formatBRL(d.valor)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Evolução do gasto mensal (área). */
export function GastoMensalChart({ data }: { data: SerieValor[] }) {
  return (
    <figure className='m-0'>
      <ChartContainer config={configValor} className='h-[240px] w-full' aria-hidden='true'>
        <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey='rotulo' tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey='valor'
            type='monotone'
            fill='var(--color-valor)'
            fillOpacity={0.25}
            stroke='var(--color-valor)'
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
      <ChartA11yTable caption='Evolução do gasto mensal com pequenas compras.' data={data} />
    </figure>
  );
}

/** Gasto por categoria (pizza). */
export function CategoriaPieChart({ data }: { data: SerieValor[] }) {
  const config: ChartConfig = Object.fromEntries(
    data.map((d, i) => [d.rotulo, { label: d.rotulo, color: CORES[i % CORES.length] }])
  );
  return (
    <figure className='m-0'>
      <ChartContainer
        config={config}
        className='mx-auto aspect-square h-[240px]'
        aria-hidden='true'
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey='rotulo' />} />
          <Pie data={data} dataKey='valor' nameKey='rotulo' innerRadius={50}>
            {data.map((_, i) => (
              <Cell key={i} fill={CORES[i % CORES.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <ChartA11yTable caption='Distribuição do gasto por categoria.' data={data} />
    </figure>
  );
}

/** Top itens por valor (barras horizontais). */
export function TopItensBarChart({ data }: { data: SerieValor[] }) {
  return (
    <figure className='m-0'>
      <ChartContainer config={configValor} className='h-[280px] w-full' aria-hidden='true'>
        <BarChart accessibilityLayer data={data} layout='vertical' margin={{ left: 12, right: 12 }}>
          <XAxis type='number' dataKey='valor' hide />
          <YAxis
            type='category'
            dataKey='rotulo'
            tickLine={false}
            axisLine={false}
            width={150}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey='valor' fill='var(--color-valor)' radius={4} />
        </BarChart>
      </ChartContainer>
      <ChartA11yTable caption='Itens que mais consomem orçamento.' data={data} />
    </figure>
  );
}

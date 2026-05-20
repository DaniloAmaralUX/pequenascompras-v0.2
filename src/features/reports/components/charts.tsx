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

/** Evolução do gasto mensal (área). */
export function GastoMensalChart({ data }: { data: SerieValor[] }) {
  return (
    <ChartContainer config={configValor} className='h-[240px] w-full'>
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
  );
}

/** Gasto por categoria (pizza). */
export function CategoriaPieChart({ data }: { data: SerieValor[] }) {
  const config: ChartConfig = Object.fromEntries(
    data.map((d, i) => [d.rotulo, { label: d.rotulo, color: CORES[i % CORES.length] }])
  );
  return (
    <ChartContainer config={config} className='mx-auto aspect-square h-[240px]'>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey='rotulo' />} />
        <Pie data={data} dataKey='valor' nameKey='rotulo' innerRadius={50}>
          {data.map((_, i) => (
            <Cell key={i} fill={CORES[i % CORES.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

/** Top itens por valor (barras horizontais). */
export function TopItensBarChart({ data }: { data: SerieValor[] }) {
  return (
    <ChartContainer config={configValor} className='h-[280px] w-full'>
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
  );
}

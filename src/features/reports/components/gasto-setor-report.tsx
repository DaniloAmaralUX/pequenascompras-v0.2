'use client';

import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { DataTable } from '@/components/ui/table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import { useClientDataTable } from '@/hooks/use-client-data-table';
import { gastoPorSetorQueryOptions } from '../api/queries';
import { buildGastoSetorColumns } from './gasto-setor-columns';

const chartConfig = {
  valor: { label: 'Valor', color: 'var(--chart-1)' }
} satisfies ChartConfig;

export default function GastoSetorReport() {
  const { data } = useSuspenseQuery(gastoPorSetorQueryOptions());
  const total = data.reduce((t, s) => t + s.valorTotal, 0);
  const chartData = data.slice(0, 8).map((s) => ({ rotulo: s.centro, valor: s.valorTotal }));

  const columns = useMemo(() => buildGastoSetorColumns(total), [total]);
  const { table } = useClientDataTable({ data, columns });

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Gasto por centro de custo</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='aspect-auto h-[300px] w-full'>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout='vertical'
              margin={{ left: 12, right: 12, top: 4, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type='number' dataKey='valor' hide />
              <YAxis
                type='category'
                dataKey='rotulo'
                tickLine={false}
                axisLine={false}
                width={90}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey='valor' fill='var(--color-valor)' radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <DataTable table={table} />
    </div>
  );
}

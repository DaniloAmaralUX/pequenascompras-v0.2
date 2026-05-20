'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { gastoPorSetorQueryOptions } from '../api/queries';
import { TopItensBarChart } from './charts';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function GastoSetorReport() {
  const { data } = useSuspenseQuery(gastoPorSetorQueryOptions());
  const total = data.reduce((t, s) => t + s.valorTotal, 0);
  const chartData = data.slice(0, 8).map((s) => ({ rotulo: s.centro, valor: s.valorTotal }));

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Gasto por centro de custo</CardTitle>
        </CardHeader>
        <CardContent>
          <TopItensBarChart data={chartData} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className='pt-6'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centro de custo</TableHead>
                <TableHead className='text-right'>Solicitações</TableHead>
                <TableHead className='text-right'>Valor total</TableHead>
                <TableHead className='text-right'>% do total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((s) => (
                <TableRow key={s.centro}>
                  <TableCell className='font-mono font-medium'>{s.centro}</TableCell>
                  <TableCell className='text-right tabular-nums'>{s.numSolicitacoes}</TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {formatBRL(s.valorTotal)}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {total > 0 ? ((s.valorTotal / total) * 100).toFixed(1) : '0'}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

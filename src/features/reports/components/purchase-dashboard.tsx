'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { dashboardQueryOptions } from '../api/queries';
import { statusBadgeVariant } from '@/features/purchase-requests/constants/purchase-request-options';
import { GastoMensalChart, CategoriaPieChart, TopItensBarChart } from './charts';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Bloco com entrada escalonada no carregamento da página. */
function RevealSection({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function PurchaseDashboard() {
  const { data } = useSuspenseQuery(dashboardQueryOptions());
  const { kpis, gastoMensal, gastoPorCategoria, topItens, recentes } = data;

  return (
    <div className='space-y-4'>
      {/* KPIs */}
      <RevealSection delay={0}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <KpiCard
            titulo='Gasto total'
            valor={formatBRL(kpis.gastoTotal)}
            icone={<Icons.receipt className='h-4 w-4' />}
            rodape='Pequenas compras no período'
          />
          <KpiCard
            titulo='Solicitações'
            valor={String(kpis.totalSolicitacoes)}
            icone={<Icons.request className='h-4 w-4' />}
            rodape={`${kpis.aguardandoAprovacao} aguardando aprovação`}
          />
          <KpiCard
            titulo='Ticket médio'
            valor={formatBRL(kpis.ticketMedio)}
            icone={<Icons.trendingUp className='h-4 w-4' />}
            rodape='Valor médio por solicitação'
          />
          <KpiCard
            titulo='Itens recorrentes'
            valor={String(kpis.itensRecorrentes)}
            icone={<Icons.report className='h-4 w-4' />}
            rodape='Oportunidades de compra em atacado'
            destaque
          />
        </div>
      </RevealSection>

      {/* Gráficos — linha 1 */}
      <RevealSection delay={0.08}>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='lg:col-span-4'>
            <CardHeader>
              <CardTitle className='text-base'>Evolução do gasto mensal</CardTitle>
              <CardDescription>Gasto com pequenas compras por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <GastoMensalChart data={gastoMensal} />
            </CardContent>
          </Card>

          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle className='text-base'>Gasto por categoria</CardTitle>
              <CardDescription>Distribuição do gasto</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoriaPieChart data={gastoPorCategoria} />
            </CardContent>
          </Card>
        </div>
      </RevealSection>

      {/* Gráficos — linha 2 */}
      <RevealSection delay={0.16}>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='lg:col-span-4'>
            <CardHeader>
              <CardTitle className='text-base'>Top itens por valor</CardTitle>
              <CardDescription>Itens que mais consomem orçamento</CardDescription>
            </CardHeader>
            <CardContent>
              <TopItensBarChart data={topItens} />
            </CardContent>
          </Card>

          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle className='text-base'>Solicitações recentes</CardTitle>
              <CardDescription>Últimas solicitações registradas</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {recentes.map((r) => (
                <Link
                  key={r.id}
                  href={`/dashboard/requests/${r.id}`}
                  className='hover:bg-muted/50 flex items-center justify-between rounded-md px-2 py-1.5 text-sm'
                >
                  <div className='flex flex-col'>
                    <span className='font-mono font-medium'>{r.numero}</span>
                    <span className='text-muted-foreground text-xs'>{r.solicitante_nome}</span>
                  </div>
                  <div className='flex flex-col items-end gap-1'>
                    <span className='tabular-nums'>{formatBRL(r.valor_estimado)}</span>
                    <Badge
                      variant={statusBadgeVariant[r.status] ?? 'outline'}
                      className='text-[10px]'
                    >
                      {r.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </RevealSection>
    </div>
  );
}

function KpiCard({
  titulo,
  valor,
  icone,
  rodape,
  destaque
}: {
  titulo: string;
  valor: string;
  icone: React.ReactNode;
  rodape: string;
  destaque?: boolean;
}) {
  return (
    <Card className='@container/card from-primary/5 to-card bg-gradient-to-t'>
      <CardHeader>
        <CardDescription className='flex items-center gap-2'>
          {icone} {titulo}
        </CardDescription>
        <CardTitle className='font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight tabular-nums @[250px]/card:text-3xl'>
          {valor}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            'text-xs',
            destaque ? 'text-primary font-medium' : 'text-muted-foreground'
          )}
        >
          {rodape}
        </p>
      </CardContent>
    </Card>
  );
}

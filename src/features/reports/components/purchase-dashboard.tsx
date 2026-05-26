'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
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
import { RevealSection } from '@/components/reveal-section';
import { dashboardQueryOptions } from '../api/queries';
import { statusBadgeVariant } from '@/features/purchase-requests/constants/purchase-request-options';
import { GastoMensalChart, CategoriaPieChart, TopItensBarChart } from './charts';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Fonte de display (serifada) — contraste com o corpo em Geist. */
const displayFont = 'font-[family-name:var(--font-merriweather)]';

export default function PurchaseDashboard() {
  const { data } = useSuspenseQuery(dashboardQueryOptions());
  const { kpis, gastoMensal, gastoPorCategoria, topItens, recentes } = data;

  return (
    <div className='space-y-4'>
      {/* Hero — gasto total + oportunidades */}
      <RevealSection delay={0}>
        <Card className='from-primary/10 via-primary/5 to-card overflow-hidden bg-gradient-to-r'>
          <CardContent className='flex flex-wrap items-center justify-between gap-6'>
            <div className='flex items-start gap-4'>
              <div className='bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl'>
                <Icons.receipt className='size-6' />
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  Gasto total em pequenas compras
                </p>
                <p
                  className={cn(
                    displayFont,
                    'text-3xl leading-none font-bold tracking-tight tabular-nums md:text-[2.5rem]'
                  )}
                >
                  {formatBRL(kpis.gastoTotal)}
                </p>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Consolidado de {kpis.totalSolicitacoes} solicitações no período
                </p>
              </div>
            </div>
            <Link
              href='/dashboard/reports/items'
              className='border-primary/20 bg-card/60 hover:bg-card flex items-center gap-3 rounded-xl border px-5 py-3 transition-colors'
            >
              <Icons.report className='text-primary size-5' />
              <div>
                <p className={cn(displayFont, 'text-2xl font-bold tabular-nums')}>
                  {kpis.itensRecorrentes}
                </p>
                <p className='text-muted-foreground text-xs'>
                  itens recorrentes — oportunidades de atacado
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </RevealSection>

      {/* KPIs secundários */}
      <RevealSection delay={0.08}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <KpiCard
            titulo='Solicitações'
            valor={String(kpis.totalSolicitacoes)}
            icone={<Icons.request className='size-4' />}
            rodape={`${kpis.aguardandoAprovacao} aguardando aprovação`}
          />
          <KpiCard
            titulo='Ticket médio'
            valor={formatBRL(kpis.ticketMedio)}
            icone={<Icons.trendingUp className='size-4' />}
            rodape='Valor médio por solicitação'
          />
          <KpiCard
            titulo='Tempo médio de ciclo'
            valor={`${kpis.tempoMedioCicloDias} dias`}
            icone={<Icons.clock className='size-4' />}
            rodape='Da criação ao recebimento'
          />
        </div>
      </RevealSection>

      {/* Gráficos — linha 1 */}
      <RevealSection delay={0.16}>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='from-primary/5 to-card bg-gradient-to-t shadow-xs transition-shadow duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-md lg:col-span-4'>
            <CardHeader>
              <CardTitle className='text-base'>Evolução do gasto mensal</CardTitle>
              <CardDescription>Gasto com pequenas compras por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <GastoMensalChart data={gastoMensal} />
            </CardContent>
          </Card>

          <Card className='from-primary/5 to-card bg-gradient-to-t shadow-xs transition-shadow duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-md lg:col-span-3'>
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
      <RevealSection delay={0.24}>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='from-primary/5 to-card bg-gradient-to-t shadow-xs transition-shadow duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-md lg:col-span-4'>
            <CardHeader>
              <CardTitle className='text-base'>Top itens por valor</CardTitle>
              <CardDescription>Itens que mais consomem orçamento</CardDescription>
            </CardHeader>
            <CardContent>
              <TopItensBarChart data={topItens} />
            </CardContent>
          </Card>

          <Card className='from-primary/5 to-card bg-gradient-to-t shadow-xs transition-shadow duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-md lg:col-span-3'>
            <CardHeader>
              <CardTitle className='text-base'>Solicitações recentes</CardTitle>
              <CardDescription>Últimas solicitações registradas</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {recentes.map((r) => (
                <Link
                  key={r.id}
                  href={`/dashboard/requests/${r.id}`}
                  className='hover:bg-muted/60 group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-150'
                >
                  <div className='flex flex-col leading-tight'>
                    <span className='font-mono font-medium group-hover:underline'>
                      {r.numero}
                    </span>
                    <span className='text-muted-foreground text-xs'>{r.solicitante_nome}</span>
                  </div>
                  <div className='flex shrink-0 flex-col items-end gap-1'>
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
  rodape
}: {
  titulo: string;
  valor: string;
  icone: React.ReactNode;
  rodape: string;
}) {
  return (
    <Card className='@container/card from-primary/5 to-card bg-gradient-to-t shadow-xs transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:shadow-md'>
      <CardHeader>
        <CardDescription className='text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase'>
          {icone} {titulo}
        </CardDescription>
        <CardTitle
          className={cn(
            displayFont,
            'text-3xl leading-none font-bold tracking-tight tabular-nums @[250px]/card:text-[2rem]'
          )}
        >
          {valor}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground text-xs'>{rodape}</p>
      </CardContent>
    </Card>
  );
}

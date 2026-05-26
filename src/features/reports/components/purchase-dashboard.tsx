'use client';

import { useTransition } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { RevealSection } from '@/components/reveal-section';
import { dashboardQueryOptions } from '../api/queries';
import { statusBadgeVariant } from '@/features/purchase-requests/constants/purchase-request-options';
import { GastoMensalChart, CategoriaPieChart, TopItensBarChart } from './charts';

const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Fonte de display (serifada) — contraste com o corpo em Geist. */
const displayFont = 'font-[family-name:var(--font-merriweather)]';

/** Opções de janela temporal do dashboard. Valor `0` = todo o histórico. */
const PERIODO_OPCOES = [
  { value: 7, label: 'Últimos 7 dias' },
  { value: 30, label: 'Últimos 30 dias' },
  { value: 90, label: 'Últimos 90 dias' },
  { value: 180, label: 'Últimos 6 meses' },
  { value: 365, label: 'Último ano' },
  { value: 0, label: 'Todo o período' }
] as const;

export default function PurchaseDashboard() {
  const [, startTransition] = useTransition();
  const [periodo, setPeriodo] = useQueryState(
    'periodo',
    parseAsInteger.withDefault(30).withOptions({ startTransition })
  );
  const periodoDias = periodo === 0 ? null : periodo;
  const { data } = useSuspenseQuery(dashboardQueryOptions(periodoDias));
  const { kpis, gastoMensal, gastoPorCategoria, topItens, recentes } = data;

  const periodoLabel = PERIODO_OPCOES.find((o) => o.value === periodo)?.label ?? 'Últimos 30 dias';

  return (
    <div className='space-y-4'>
      {/* Selector de período — filtra todos os indicadores */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <Icons.calendar className='text-muted-foreground size-4' aria-hidden='true' />
          <span className='text-muted-foreground text-sm'>
            Mostrando dados de{' '}
            <span className='text-foreground font-medium'>{periodoLabel.toLowerCase()}</span>
          </span>
        </div>
        <Select value={String(periodo)} onValueChange={(v) => setPeriodo(Number(v))}>
          <SelectTrigger size='sm' className='w-[180px]' aria-label='Filtrar dashboard por período'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align='end'>
            {PERIODO_OPCOES.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                  Consolidado de {kpis.totalSolicitacoes} solicitações em{' '}
                  {periodoLabel.toLowerCase()}
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

      {/* KPIs secundários — clicáveis (drill-down) + delta vs mês anterior */}
      <RevealSection delay={0.08}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <KpiCard
            titulo='Solicitações'
            valor={String(kpis.totalSolicitacoes)}
            icone={<Icons.request className='size-4' />}
            rodape={`${kpis.aguardandoAprovacao} aguardando aprovação`}
            delta={kpis.deltas.totalSolicitacoes}
            href='/dashboard/requests'
          />
          <KpiCard
            titulo='Ticket médio'
            valor={formatBRL(kpis.ticketMedio)}
            icone={<Icons.trendingUp className='size-4' />}
            rodape='Valor médio por solicitação'
            delta={kpis.deltas.ticketMedio}
            href='/dashboard/requests'
          />
          <KpiCard
            titulo='Tempo médio de ciclo'
            valor={`${kpis.tempoMedioCicloDias} dias`}
            icone={<Icons.clock className='size-4' />}
            rodape='Da criação ao recebimento'
            delta={kpis.deltas.tempoMedioCicloDias}
            deltaInverso
            href='/dashboard/requests?status=Concluída'
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
              {gastoMensal.length === 0 ? (
                <ChartEmpty mensagem='Sem gastos registrados neste período.' />
              ) : (
                <GastoMensalChart data={gastoMensal} />
              )}
            </CardContent>
          </Card>

          <Card className='from-primary/5 to-card bg-gradient-to-t shadow-xs transition-shadow duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-md lg:col-span-3'>
            <CardHeader>
              <CardTitle className='text-base'>Gasto por categoria</CardTitle>
              <CardDescription>Distribuição do gasto</CardDescription>
            </CardHeader>
            <CardContent>
              {gastoPorCategoria.length === 0 ? (
                <ChartEmpty mensagem='Nenhuma categoria com gasto no período.' />
              ) : (
                <CategoriaPieChart data={gastoPorCategoria} />
              )}
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
              {topItens.length === 0 ? (
                <ChartEmpty mensagem='Nenhum item registrado no período.' />
              ) : (
                <TopItensBarChart data={topItens} />
              )}
            </CardContent>
          </Card>

          <Card className='from-primary/5 to-card bg-gradient-to-t shadow-xs transition-shadow duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-md lg:col-span-3'>
            <CardHeader>
              <CardTitle className='text-base'>Solicitações recentes</CardTitle>
              <CardDescription>Últimas solicitações registradas</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              {recentes.length === 0 ? (
                <div className='text-muted-foreground flex flex-col items-center justify-center gap-2 py-8 text-center'>
                  <Icons.request className='text-muted-foreground/40 size-6' aria-hidden='true' />
                  <p className='text-xs'>Nenhuma solicitação recente ainda</p>
                </div>
              ) : (
                recentes.map((r) => (
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
                ))
              )}
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
  delta,
  deltaInverso,
  href
}: {
  titulo: string;
  valor: string;
  icone: React.ReactNode;
  rodape: string;
  /** Variação percentual vs período anterior (null se sem dados). */
  delta?: number | null;
  /** Se true, queda é positiva (ex.: tempo de ciclo menor é melhor). */
  deltaInverso?: boolean;
  /** Se passado, o card vira um Link clicável (drill-down). */
  href?: string;
}) {
  const cardBody = (
    <Card className='@container/card from-primary/5 to-card group bg-gradient-to-t shadow-xs transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:shadow-md'>
      <CardHeader>
        <CardDescription className='text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase'>
          {icone} {titulo}
        </CardDescription>
        <div className='flex items-baseline justify-between gap-2'>
          <CardTitle
            className={cn(
              displayFont,
              'text-3xl leading-none font-bold tracking-tight tabular-nums @[250px]/card:text-[2rem]'
            )}
          >
            {valor}
          </CardTitle>
          {delta != null && <DeltaBadge value={delta} inverted={!!deltaInverso} />}
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground flex items-center justify-between gap-2 text-xs'>
          <span>{rodape}</span>
          {href && (
            <Icons.arrowRight
              className='text-muted-foreground/40 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-current'
              aria-hidden='true'
            />
          )}
        </p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        className='focus-visible:ring-ring/50 rounded-xl outline-none focus-visible:ring-[3px]'
        aria-label={`${titulo}: ${valor}. Ver detalhes`}
      >
        {cardBody}
      </Link>
    );
  }
  return cardBody;
}

/** Estado vazio para gráficos quando o período filtrado não retorna dados. */
function ChartEmpty({ mensagem }: { mensagem: string }) {
  return (
    <div className='text-muted-foreground flex h-[240px] flex-col items-center justify-center gap-3 text-center'>
      <Icons.report className='text-muted-foreground/40 size-8' aria-hidden='true' />
      <p className='max-w-[220px] text-xs text-pretty'>{mensagem}</p>
    </div>
  );
}

/** Badge de delta — verde (positivo), vermelho (negativo), neutro. Respeita `inverted`. */
function DeltaBadge({ value, inverted }: { value: number; inverted: boolean }) {
  const positivo = inverted ? value < 0 : value > 0;
  const zero = Math.abs(value) < 0.5; // <0.5% considera estável
  const sinal = value > 0 ? '+' : '';
  const Arrow = zero ? Icons.arrowRight : value > 0 ? Icons.trendingUp : Icons.trendingDown;
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
        zero && 'bg-muted text-muted-foreground',
        !zero && positivo && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        !zero && !positivo && 'bg-destructive/10 text-destructive'
      )}
      aria-label={`Variação de ${sinal}${value.toFixed(1)}% em relação ao período anterior`}
    >
      <Arrow className='size-2.5' aria-hidden='true' />
      {sinal}
      {value.toFixed(0)}%
    </span>
  );
}

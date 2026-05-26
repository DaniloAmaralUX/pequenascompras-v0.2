'use client';

import * as React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Icons } from '@/components/icons';
import { RevealSection } from '@/components/reveal-section';
import { cn } from '@/lib/utils';
import { purchaseRequestByIdOptions } from '../api/queries';
import type { PurchaseRequest, HistoryEvent } from '../api/types';
import { PURCHASE_STATUS } from '@/constants/mock-api-purchase-requests';
import { statusBadgeVariant } from '../constants/purchase-request-options';
import { WorkflowActionPanel } from './workflow-action-panel';

const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const formatDataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

const displayFont = 'font-[family-name:var(--font-merriweather)]';

/** Mapa de palavra-chave da descrição → ícone do evento (timeline polida). */
function iconeEvento(descricao: string): React.ComponentType<{ className?: string }> {
  const d = descricao.toLowerCase();
  if (d.includes('criada')) return Icons.add;
  if (d.includes('enviada')) return Icons.send;
  if (d.includes('aprovada')) return Icons.checks;
  if (d.includes('rejeitada')) return Icons.xCircle;
  if (d.includes('bloqueada')) return Icons.warning;
  if (d.includes('cancelada')) return Icons.xCircle;
  if (d.includes('pedido')) return Icons.receipt;
  if (d.includes('compra')) return Icons.receipt;
  if (d.includes('financeiro')) return Icons.creditCard;
  if (d.includes('pagamento')) return Icons.creditCard;
  if (d.includes('envio')) return Icons.send;
  if (d.includes('recebimento') || d.includes('recebida')) return Icons.checks;
  return Icons.circle;
}

export default function PurchaseRequestDetail({ requestId }: { requestId: number }) {
  const { data } = useSuspenseQuery(purchaseRequestByIdOptions(requestId));

  if (!data?.success || !data?.request) {
    notFound();
  }

  const req = data.request as PurchaseRequest;
  const bloqueada = req.status === PURCHASE_STATUS.BLOQUEADA && req.motivos_bloqueio.length > 0;
  const [anexoAberto, setAnexoAberto] = React.useState<string | null>(null);

  return (
    <div className='flex flex-col gap-6'>
      {/* Header editorial — número grande em display + meta + status */}
      <RevealSection delay={0}>
        <header className='flex flex-wrap items-start justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <span className='text-muted-foreground text-[11px] font-semibold tracking-[0.08em] uppercase'>
              Solicitação de compra
            </span>
            <h1
              className={cn(
                displayFont,
                'text-3xl leading-none font-bold tracking-tight md:text-[2.25rem]'
              )}
              translate='no'
            >
              {req.numero}
            </h1>
            <p className='text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
              <span className='inline-flex items-center gap-1.5'>
                <Icons.profile className='size-3.5' aria-hidden='true' />
                {req.solicitante_nome}
              </span>
              <span aria-hidden='true'>·</span>
              <span className='inline-flex items-center gap-1.5'>
                <Icons.costCenter className='size-3.5' aria-hidden='true' />
                {req.unidade}
              </span>
              <span aria-hidden='true'>·</span>
              <span className='inline-flex items-center gap-1.5'>
                <Icons.calendar className='size-3.5' aria-hidden='true' />
                Criada em {formatDataCurta(req.criada_em)}
              </span>
            </p>
          </div>
          <Badge
            variant={statusBadgeVariant[req.status] ?? 'outline'}
            className='shrink-0 px-3 py-1 text-sm'
          >
            {req.status}
          </Badge>
        </header>
      </RevealSection>

      {/* Alerta de bloqueio — destaque máximo se aplicável */}
      {bloqueada && (
        <RevealSection delay={0.06}>
          <Alert variant='destructive'>
            <Icons.warning className='size-4' aria-hidden='true' />
            <AlertTitle>Solicitação bloqueada pelo motor de governança</AlertTitle>
            <AlertDescription>
              <ul className='mt-1 list-disc pl-4'>
                {req.motivos_bloqueio.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </RevealSection>
      )}

      {/* Layout 2/3 + 1/3 com gap maior para respiração */}
      <RevealSection delay={0.12}>
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Coluna principal */}
          <div className='flex flex-col gap-6 lg:col-span-2'>
            {/* Dados gerais — agrupados por contexto, não em grid genérico */}
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Dados gerais</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-5'>
                <SecaoDados
                  titulo='Solicitação'
                  campos={[
                    { rotulo: 'Centro de custo', valor: req.centro_de_custo, mono: true },
                    { rotulo: 'Prioridade', valor: req.prioridade },
                    { rotulo: 'Forma de pagamento', valor: req.forma_pagamento ?? '—' }
                  ]}
                />
                <SecaoDados
                  titulo='Aprovação'
                  campos={[
                    { rotulo: 'Aprovador', valor: req.aprovador_nome ?? '—' },
                    {
                      rotulo: 'Aprovada em',
                      valor: req.aprovada_em ? formatDataHora(req.aprovada_em) : '—'
                    }
                  ]}
                />
                <SecaoDados
                  titulo='Execução'
                  campos={[
                    { rotulo: 'Analista', valor: req.analista_nome ?? '—' },
                    { rotulo: 'Fornecedor', valor: req.fornecedor_nome ?? '—' }
                  ]}
                />
                <div className='flex flex-col gap-1.5'>
                  <span className='text-muted-foreground text-[10px] font-semibold tracking-wider uppercase'>
                    Justificativa
                  </span>
                  <p className='text-sm leading-relaxed'>{req.justificativa}</p>
                </div>
              </CardContent>
            </Card>

            {/* Itens — conteúdo primário, com destaque visual */}
            <Card className='border-primary/30 shadow-xs'>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='text-base'>
                  Itens{' '}
                  <span className='text-muted-foreground font-normal tabular-nums'>
                    ({req.itens.length})
                  </span>
                </CardTitle>
                <span
                  className={cn(
                    displayFont,
                    'text-lg leading-none font-bold tabular-nums tracking-tight'
                  )}
                >
                  {formatBRL(req.valor_estimado)}
                </span>
              </CardHeader>
              <CardContent className='flex flex-col gap-3'>
                <ul className='flex flex-col gap-1'>
                  {req.itens.map((it) => (
                    <li
                      key={it.id}
                      className='hover:bg-muted/40 -mx-2 flex items-start justify-between gap-3 rounded-md px-2 py-2 text-sm transition-colors duration-150'
                    >
                      <div className='flex flex-col gap-0.5'>
                        <p className='font-medium leading-tight'>{it.descricao}</p>
                        <p className='text-muted-foreground text-xs leading-tight'>
                          <span className='font-medium'>{it.categoria}</span>
                          <span className='mx-1.5' aria-hidden='true'>
                            ·
                          </span>
                          <span className='tabular-nums'>
                            {it.quantidade} {it.unidade_medida}
                          </span>
                          <span className='mx-1.5' aria-hidden='true'>
                            ×
                          </span>
                          <span className='tabular-nums'>
                            {formatBRL(it.valor_unitario_estimado)}
                          </span>
                        </p>
                      </div>
                      <span className='shrink-0 text-sm font-semibold tabular-nums tracking-tight'>
                        {formatBRL(it.quantidade * it.valor_unitario_estimado)}
                      </span>
                    </li>
                  ))}
                </ul>

                {req.valor_real != null && (
                  <>
                    <Separator />
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>Valor real pago</span>
                      <span className='font-semibold tabular-nums'>
                        {formatBRL(req.valor_real)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Anexos */}
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>
                  Anexos{' '}
                  <span className='text-muted-foreground font-normal tabular-nums'>
                    ({req.anexos.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {req.anexos.length === 0 ? (
                  <p className='text-muted-foreground text-sm'>Nenhum anexo.</p>
                ) : (
                  <ul className='flex flex-col gap-0.5'>
                    {req.anexos.map((a, i) => (
                      <li key={i}>
                        <button
                          type='button'
                          onClick={() => setAnexoAberto(a.nome)}
                          className='hover:bg-muted/60 group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-150'
                        >
                          <Icons.paperclip
                            className='text-muted-foreground size-4 shrink-0'
                            aria-hidden='true'
                          />
                          <span className='flex-1 truncate group-hover:underline'>{a.nome}</span>
                          <Badge
                            variant='outline'
                            className='text-muted-foreground text-[10px] font-normal'
                          >
                            ver
                          </Badge>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Histórico — timeline polida com ícones por evento */}
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline eventos={req.historico} />
              </CardContent>
            </Card>
          </div>

          {/* Coluna lateral — Resumo + Ações */}
          <div className='flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start'>
            {/* Resumo destacado — display font, hierarquia forte */}
            <Card className='from-primary/[0.04] to-card bg-gradient-to-b shadow-xs'>
              <CardHeader>
                <CardTitle className='text-muted-foreground text-[10px] font-semibold tracking-wider uppercase'>
                  Valor estimado
                </CardTitle>
                <p
                  className={cn(
                    displayFont,
                    'text-3xl leading-none font-bold tracking-tight tabular-nums'
                  )}
                >
                  {formatBRL(req.valor_estimado)}
                </p>
              </CardHeader>
              <CardContent className='flex flex-col gap-3 text-sm'>
                <ResumoLinha
                  rotulo='Itens'
                  valor={String(req.itens.length)}
                  icone={<Icons.catalog className='size-3.5' aria-hidden='true' />}
                />
                <ResumoLinha
                  rotulo='Criada em'
                  valor={formatDataHora(req.criada_em)}
                  icone={<Icons.calendar className='size-3.5' aria-hidden='true' />}
                />
                {req.enviada_em && (
                  <ResumoLinha
                    rotulo='Enviada em'
                    valor={formatDataHora(req.enviada_em)}
                    icone={<Icons.send className='size-3.5' aria-hidden='true' />}
                  />
                )}
                {req.recebida_em && (
                  <ResumoLinha
                    rotulo='Recebida em'
                    valor={formatDataHora(req.recebida_em)}
                    icone={<Icons.checks className='size-3.5' aria-hidden='true' />}
                  />
                )}
              </CardContent>
            </Card>

            <WorkflowActionPanel request={req} />
          </div>
        </div>
      </RevealSection>

      <AnexoPreviewDialog nome={anexoAberto} onClose={() => setAnexoAberto(null)} />
    </div>
  );
}

/** Preview mock de anexo — Dialog com placeholder visual. No MVP renderiza PDF/imagem real. */
function AnexoPreviewDialog({ nome, onClose }: { nome: string | null; onClose: () => void }) {
  return (
    <Dialog open={!!nome} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-base'>
            <Icons.paperclip className='size-4' aria-hidden='true' />
            {nome}
          </DialogTitle>
          <DialogDescription>
            Preview do documento. No MVP, este painel renderiza o PDF ou imagem real do anexo.
          </DialogDescription>
        </DialogHeader>
        <div className='bg-muted/40 flex aspect-[1/1.2] items-center justify-center rounded-lg border border-dashed'>
          <div className='flex flex-col items-center gap-3 text-center'>
            <div className='bg-background ring-border flex size-16 items-center justify-center rounded-full ring-1'>
              <Icons.fileTypePdf className='text-muted-foreground size-7' aria-hidden='true' />
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium'>Preview disponível no MVP</p>
              <p className='text-muted-foreground max-w-xs text-xs text-pretty'>
                Em produção, o conteúdo do arquivo será renderizado aqui (PDF inline, imagem,
                planilha, etc.) sem precisar baixar.
              </p>
            </div>
            <Badge variant='outline' className='text-[10px] font-normal'>
              Protótipo
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Seção de dados rotulada (Solicitação / Aprovação / Execução). */
function SecaoDados({
  titulo,
  campos
}: {
  titulo: string;
  campos: { rotulo: string; valor: string; mono?: boolean }[];
}) {
  return (
    <div className='flex flex-col gap-2'>
      <span className='text-muted-foreground text-[10px] font-semibold tracking-wider uppercase'>
        {titulo}
      </span>
      <dl className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
        {campos.map((c) => (
          <div key={c.rotulo} className='flex flex-col gap-0.5'>
            <dt className='text-muted-foreground text-xs'>{c.rotulo}</dt>
            <dd className={cn('text-sm font-medium', c.mono && 'font-mono')}>{c.valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Linha do card Resumo (label + valor + ícone). */
function ResumoLinha({
  rotulo,
  valor,
  icone
}: {
  rotulo: string;
  valor: string;
  icone: React.ReactNode;
}) {
  return (
    <div className='flex items-center justify-between gap-3'>
      <span className='text-muted-foreground flex items-center gap-1.5'>
        {icone}
        {rotulo}
      </span>
      <span className='font-medium tabular-nums'>{valor}</span>
    </div>
  );
}

/** Timeline polida — bullet com ícone, conector vertical, badge de tempo. */
function Timeline({ eventos }: { eventos: HistoryEvent[] }) {
  return (
    <ol className='flex flex-col'>
      {eventos.map((ev, i) => {
        const Icon = iconeEvento(ev.descricao);
        const isLast = i === eventos.length - 1;
        return (
          <li key={i} className='flex gap-3'>
            <div className='flex flex-col items-center'>
              <div
                className={cn(
                  'bg-background border-primary/50 ring-primary/10 flex size-7 shrink-0 items-center justify-center rounded-full border ring-4',
                  isLast && 'bg-primary border-primary ring-primary/15'
                )}
              >
                <Icon
                  className={cn('size-3.5', isLast ? 'text-primary-foreground' : 'text-primary')}
                  aria-hidden='true'
                />
              </div>
              {!isLast && <span className='bg-border w-px flex-1' aria-hidden='true' />}
            </div>
            <div className={cn('flex flex-1 flex-col gap-1', !isLast && 'pb-5')}>
              <p className='text-sm leading-snug font-medium'>{ev.descricao}</p>
              <div className='text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs'>
                <span>{ev.autor}</span>
                <span aria-hidden='true'>·</span>
                <span className='tabular-nums'>{formatDataHora(ev.data)}</span>
                {ev.de && ev.para && (
                  <>
                    <span aria-hidden='true'>·</span>
                    <span className='inline-flex items-center gap-1'>
                      <span className='font-mono'>{ev.de}</span>
                      <Icons.arrowRight className='size-3' aria-hidden='true' />
                      <span className='font-mono'>{ev.para}</span>
                    </span>
                  </>
                )}
              </div>
              {ev.comentario && (
                <blockquote className='border-primary/30 bg-muted/40 text-foreground mt-1 rounded-md border-l-2 px-3 py-1.5 text-xs leading-relaxed'>
                  <span className='text-muted-foreground mr-1'>“</span>
                  {ev.comentario}
                  <span className='text-muted-foreground ml-1'>”</span>
                </blockquote>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

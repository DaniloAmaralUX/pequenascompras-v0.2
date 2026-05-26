'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { RevealSection } from '@/components/reveal-section';
import { purchaseRequestByIdOptions } from '../api/queries';
import type { PurchaseRequest } from '../api/types';
import { PURCHASE_STATUS } from '@/constants/mock-api-purchase-requests';
import { statusBadgeVariant } from '../constants/purchase-request-options';
import { WorkflowActionPanel } from './workflow-action-panel';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export default function PurchaseRequestDetail({ requestId }: { requestId: number }) {
  const { data } = useSuspenseQuery(purchaseRequestByIdOptions(requestId));

  if (!data?.success || !data?.request) {
    notFound();
  }

  const req = data.request as PurchaseRequest;

  return (
    <div className='flex flex-col gap-4'>
      {/* Cabeçalho */}
      <RevealSection delay={0}>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='font-mono text-2xl font-bold' translate='no'>
              {req.numero}
            </h1>
            <p className='text-muted-foreground text-sm'>
              Solicitado por {req.solicitante_nome} · {req.unidade}
            </p>
          </div>
          <Badge variant={statusBadgeVariant[req.status] ?? 'outline'} className='text-sm'>
            {req.status}
          </Badge>
        </div>
      </RevealSection>

      {/* Motivos de bloqueio */}
      {req.status === PURCHASE_STATUS.BLOQUEADA && req.motivos_bloqueio.length > 0 && (
        <RevealSection delay={0.08}>
          <Alert variant='destructive'>
            <Icons.warning className='size-4' />
            <AlertTitle>Solicitação bloqueada pelo motor de governança</AlertTitle>
            <AlertDescription>
              <ul className='list-disc pl-4'>
                {req.motivos_bloqueio.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </RevealSection>
      )}

      <RevealSection delay={0.16}>
        <div className='grid gap-4 lg:grid-cols-3'>
        {/* Coluna principal */}
        <div className='flex flex-col gap-4 lg:col-span-2'>
          {/* Dados gerais */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Dados gerais</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-4 text-sm md:grid-cols-3'>
              <Campo rotulo='Centro de custo' valor={req.centro_de_custo} />
              <Campo rotulo='Prioridade' valor={req.prioridade} />
              <Campo rotulo='Forma de pagamento' valor={req.forma_pagamento ?? '—'} />
              <Campo rotulo='Fornecedor' valor={req.fornecedor_nome ?? '—'} />
              <Campo rotulo='Aprovador' valor={req.aprovador_nome ?? '—'} />
              <Campo rotulo='Analista' valor={req.analista_nome ?? '—'} />
              <div className='col-span-2 md:col-span-3'>
                <Campo rotulo='Justificativa' valor={req.justificativa} />
              </div>
            </CardContent>
          </Card>

          {/* Itens — conteúdo primário da solicitação */}
          <Card className='border-primary/40'>
            <CardHeader>
              <CardTitle className='text-base'>Itens ({req.itens.length})</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {req.itens.map((it) => (
                <div
                  key={it.id}
                  className='flex items-center justify-between border-b pb-2 text-sm last:border-0 last:pb-0'
                >
                  <div>
                    <p className='font-medium'>{it.descricao}</p>
                    <p className='text-muted-foreground text-xs'>
                      {it.categoria} · {it.quantidade} {it.unidade_medida} ×{' '}
                      {formatBRL(it.valor_unitario_estimado)}
                    </p>
                  </div>
                  <span className='tabular-nums'>
                    {formatBRL(it.quantidade * it.valor_unitario_estimado)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className='flex items-center justify-between font-semibold'>
                <span>Valor estimado</span>
                <span className='tabular-nums'>{formatBRL(req.valor_estimado)}</span>
              </div>
              {req.valor_real != null && (
                <div className='flex items-center justify-between'>
                  <span>Valor real</span>
                  <span className='tabular-nums'>{formatBRL(req.valor_real)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Anexos */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Anexos</CardTitle>
            </CardHeader>
            <CardContent>
              {req.anexos.length === 0 ? (
                <p className='text-muted-foreground text-sm'>Nenhum anexo.</p>
              ) : (
                <ul className='space-y-1'>
                  {req.anexos.map((a, i) => (
                    <li key={i}>
                      <button
                        type='button'
                        title='Visualização de anexos não disponível neste protótipo'
                        className='hover:bg-muted/60 group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors'
                      >
                        <Icons.paperclip className='text-muted-foreground size-4' />
                        <span className='group-hover:underline'>{a.nome}</span>
                        <span className='text-muted-foreground ml-auto text-xs'>protótipo</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Histórico / timeline */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className='space-y-4'>
                {req.historico.map((ev, i) => (
                  <li key={i} className='flex gap-3'>
                    <div className='flex flex-col items-center'>
                      <span className='bg-primary mt-1 h-2.5 w-2.5 rounded-full' />
                      {i < req.historico.length - 1 && (
                        <span className='bg-border w-px flex-1' />
                      )}
                    </div>
                    <div className='pb-1'>
                      <p className='text-sm font-medium'>{ev.descricao}</p>
                      <p className='text-muted-foreground text-xs'>
                        {ev.autor} · {formatDataHora(ev.data)}
                        {ev.de && ev.para ? ` · ${ev.de} → ${ev.para}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral */}
        <div className='flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Resumo</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Valor estimado</span>
                <span className='font-semibold tabular-nums'>
                  {formatBRL(req.valor_estimado)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Itens</span>
                <span>{req.itens.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Criada em</span>
                <span>{formatDataHora(req.criada_em)}</span>
              </div>
            </CardContent>
          </Card>

          <WorkflowActionPanel request={req} />
        </div>
        </div>
      </RevealSection>
    </div>
  );
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className='text-muted-foreground text-xs font-medium uppercase'>{rotulo}</p>
      <p>{valor}</p>
    </div>
  );
}

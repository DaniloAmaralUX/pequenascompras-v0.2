'use client';

import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { workflowActionMutation } from '../api/mutations';
import type { PurchaseRequest, WorkflowAction, WorkflowActionPayload } from '../api/types';
import { acoesDisponiveis } from '../lib/workflow';

const AUTOR: Record<WorkflowAction, string> = {
  aprovar: 'Gestor (Demo)',
  rejeitar: 'Gestor (Demo)',
  'registrar-pedido': 'Robô de Integração',
  'registrar-compra': 'Analista (Demo)',
  'encaminhar-financeiro': 'Analista (Demo)',
  'confirmar-pagamento': 'Analista (Demo)',
  'confirmar-envio': 'Analista (Demo)',
  'confirmar-recebimento': 'Solicitante (Demo)',
  cancelar: 'Solicitante (Demo)'
};

const LABEL: Record<WorkflowAction, string> = {
  aprovar: 'Aprovar',
  rejeitar: 'Rejeitar',
  'registrar-pedido': 'Registrar pedido no ERP (robô)',
  'registrar-compra': 'Registrar compra',
  'encaminhar-financeiro': 'Encaminhar ao Financeiro',
  'confirmar-pagamento': 'Confirmar pagamento',
  'confirmar-envio': 'Confirmar envio',
  'confirmar-recebimento': 'Confirmar recebimento',
  cancelar: 'Cancelar solicitação'
};

export function WorkflowActionPanel({ request }: { request: PurchaseRequest }) {
  const acoes = acoesDisponiveis(request.status);
  const [aprovacaoAberta, setAprovacaoAberta] = React.useState(false);
  const [compraAberta, setCompraAberta] = React.useState(false);

  const mutation = useMutation({
    ...workflowActionMutation,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message ?? 'Ação aplicada com sucesso');
        setAprovacaoAberta(false);
        setCompraAberta(false);
      } else {
        toast.error(data?.message ?? 'Não foi possível aplicar a ação');
      }
    },
    onError: () => toast.error('Falha ao aplicar a ação de workflow')
  });

  const aplicar = (payload: WorkflowActionPayload) =>
    mutation.mutate({ id: request.id, payload });

  if (acoes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>
            Esta solicitação está finalizada — não há ações disponíveis.
          </p>
        </CardContent>
      </Card>
    );
  }

  const temAprovacao = acoes.includes('aprovar');
  const temCompra = acoes.includes('registrar-compra');
  const acoesSimples = acoes.filter(
    (a) => a !== 'aprovar' && a !== 'rejeitar' && a !== 'registrar-compra'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Ações de workflow</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {temAprovacao && (
          <Button onClick={() => setAprovacaoAberta(true)}>
            <Icons.checks className='mr-1 h-4 w-4' /> Analisar aprovação
          </Button>
        )}
        {temCompra && (
          <Button onClick={() => setCompraAberta(true)}>
            <Icons.receipt className='mr-1 h-4 w-4' /> Registrar compra
          </Button>
        )}
        {acoesSimples.map((acao) => (
          <Button
            key={acao}
            variant={acao === 'cancelar' ? 'destructive' : 'default'}
            isLoading={mutation.isPending}
            onClick={() => aplicar({ action: acao, autor: AUTOR[acao] })}
          >
            {LABEL[acao]}
          </Button>
        ))}
      </CardContent>

      <ApprovalSheet
        open={aprovacaoAberta}
        onOpenChange={setAprovacaoAberta}
        loading={mutation.isPending}
        onDecidir={(acao, comentario) =>
          aplicar({ action: acao, autor: AUTOR[acao], comentario })
        }
      />
      <CompraSheet
        open={compraAberta}
        onOpenChange={setCompraAberta}
        loading={mutation.isPending}
        valorEstimado={request.valor_estimado}
        onConfirmar={(fornecedor, valor) =>
          aplicar({
            action: 'registrar-compra',
            autor: AUTOR['registrar-compra'],
            fornecedor_nome: fornecedor,
            valor_real: valor
          })
        }
      />
    </Card>
  );
}

function ApprovalSheet({
  open,
  onOpenChange,
  loading,
  onDecidir
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  loading: boolean;
  onDecidir: (acao: 'aprovar' | 'rejeitar', comentario: string) => void;
}) {
  const [comentario, setComentario] = React.useState('');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>Decisão de aprovação</SheetTitle>
          <SheetDescription>
            Aprove ou rejeite a solicitação. A justificativa é registrada no histórico.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 space-y-2 px-4'>
          <Label htmlFor='comentario-aprovacao'>Comentário / justificativa</Label>
          <Textarea
            id='comentario-aprovacao'
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder='Opcional para aprovação; obrigatório ao rejeitar.'
            rows={4}
          />
          <p id='rejeitar-hint' className='text-muted-foreground text-xs'>
            A justificativa é obrigatória para rejeitar a solicitação.
          </p>
        </div>
        <SheetFooter className='flex-row justify-end gap-2'>
          <Button
            variant='destructive'
            isLoading={loading}
            disabled={comentario.trim().length === 0}
            aria-describedby='rejeitar-hint'
            onClick={() => onDecidir('rejeitar', comentario)}
          >
            Rejeitar
          </Button>
          <Button isLoading={loading} onClick={() => onDecidir('aprovar', comentario)}>
            Aprovar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function CompraSheet({
  open,
  onOpenChange,
  loading,
  valorEstimado,
  onConfirmar
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  loading: boolean;
  valorEstimado: number;
  onConfirmar: (fornecedor: string, valor: number) => void;
}) {
  const [fornecedor, setFornecedor] = React.useState('');
  const [valor, setValor] = React.useState<string>(String(valorEstimado));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>Registrar compra</SheetTitle>
          <SheetDescription>
            Informe o fornecedor e o valor real da compra realizada.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 space-y-4 px-4'>
          <div className='space-y-2'>
            <Label htmlFor='compra-fornecedor'>Fornecedor</Label>
            <Input
              id='compra-fornecedor'
              value={fornecedor}
              onChange={(e) => setFornecedor(e.target.value)}
              placeholder='Nome do fornecedor homologado'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='compra-valor'>Valor real (R$)</Label>
            <Input
              id='compra-valor'
              type='number'
              min={0}
              step={0.01}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>
          <p id='compra-hint' className='text-muted-foreground text-xs'>
            Informe o fornecedor e o valor real para confirmar a compra.
          </p>
        </div>
        <SheetFooter>
          <Button
            isLoading={loading}
            disabled={fornecedor.trim().length === 0 || !valor}
            aria-describedby='compra-hint'
            onClick={() => onConfirmar(fornecedor, Number(valor))}
          >
            Confirmar compra
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

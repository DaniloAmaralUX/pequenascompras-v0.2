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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { alertasPrecoQueryOptions } from '../api/queries';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function PrecosAlertasReport() {
  const { data } = useSuspenseQuery(alertasPrecoQueryOptions());

  return (
    <div className='space-y-4'>
      <Alert>
        <Icons.info className='h-4 w-4' />
        <AlertTitle>Como funciona</AlertTitle>
        <AlertDescription>
          Itens cujo preço unitário está mais de 10% acima da média histórica do próprio item.
          Sinaliza compras potencialmente caras para verificação antes da aprovação.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className='pt-6'>
          {data.length === 0 ? (
            <p className='text-muted-foreground py-8 text-center text-sm'>
              Nenhum alerta de preço no momento.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitação</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead className='text-right'>Preço unitário</TableHead>
                  <TableHead className='text-right'>Média histórica</TableHead>
                  <TableHead className='text-right'>Variação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((a, i) => (
                  <TableRow key={`${a.numero}-${a.item}-${i}`}>
                    <TableCell className='font-mono'>{a.numero}</TableCell>
                    <TableCell className='font-medium'>{a.item}</TableCell>
                    <TableCell className='text-muted-foreground'>{a.solicitante}</TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatBRL(a.precoUnitario)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatBRL(a.precoMedio)}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Badge
                        variant={a.diferencaPct > 20 ? 'destructive' : 'secondary'}
                        className='tabular-nums'
                      >
                        +{a.diferencaPct.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Icons } from '@/components/icons';
import { itensRecorrentesQueryOptions } from '../api/queries';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ItensRecorrentesReport() {
  const { data } = useSuspenseQuery(itensRecorrentesQueryOptions());

  return (
    <Card>
      <CardContent className='pt-6'>
        {data.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <Icons.report />
              </EmptyMedia>
              <EmptyTitle>Nenhum item recorrente</EmptyTitle>
              <EmptyDescription>
                Ainda não há itens comprados em mais de uma solicitação no período.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className='text-right'>Compras</TableHead>
                <TableHead className='text-right'>Qtd total</TableHead>
                <TableHead className='text-right'>Valor total</TableHead>
                <TableHead className='text-right'>Solicitantes</TableHead>
                <TableHead className='text-right'>Preço médio</TableHead>
                <TableHead>Oportunidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((it) => (
                <TableRow key={it.item}>
                  <TableCell className='font-medium'>{it.item}</TableCell>
                  <TableCell>
                    <Badge variant='outline'>{it.categoria}</Badge>
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>{it.numCompras}</TableCell>
                  <TableCell className='text-right tabular-nums'>{it.qtdTotal}</TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {formatBRL(it.valorTotal)}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>{it.numSolicitantes}</TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {formatBRL(it.precoMedio)}
                  </TableCell>
                  <TableCell>
                    {it.numCompras >= 4 ? (
                      <Badge>Atacado recomendado</Badge>
                    ) : (
                      <Badge variant='secondary'>Monitorar</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

import * as z from 'zod';

/** Schema de um item da solicitação. */
export const purchaseRequestItemSchema = z.object({
  descricao: z.string().min(2, 'Descreva o item.'),
  categoria: z.string().min(1, 'Selecione a categoria.'),
  quantidade: z.number({ message: 'Informe a quantidade.' }).min(1, 'Quantidade mínima é 1.'),
  unidade_medida: z.string().min(1, 'Selecione a unidade de medida.'),
  valor_unitario_estimado: z
    .number({ message: 'Informe o valor unitário.' })
    .min(0.01, 'Valor unitário inválido.')
});

/** Etapa 1 — dados gerais da solicitação. */
export const step1Schema = z.object({
  unidade: z.string().min(1, 'Selecione a unidade.'),
  centro_de_custo: z.string().min(1, 'Informe o centro de custo.'),
  prioridade: z.string().min(1, 'Selecione a prioridade.'),
  justificativa: z.string().min(10, 'A justificativa deve ter ao menos 10 caracteres.')
});

/** Etapa 2 — itens e comprovante de preço. */
export const step2Schema = z.object({
  itens: z.array(purchaseRequestItemSchema).min(1, 'Adicione ao menos um item.'),
  anexos: z
    .any()
    .refine((f) => f?.length >= 1, 'Anexe ao menos um comprovante de preço (orçamento, print ou NF).')
});

/** Schema completo (todas as etapas). */
export const purchaseRequestSchema = step1Schema.extend(step2Schema.shape);

/** Schemas por etapa do formulário multi-step (etapa 3 = revisão, sem campos). */
export const stepSchemas = [step1Schema, step2Schema, z.object({})];

export type PurchaseRequestFormValues = {
  unidade: string;
  centro_de_custo: string;
  prioridade: string;
  justificativa: string;
  itens: {
    descricao: string;
    categoria: string;
    quantidade: number | undefined;
    unidade_medida: string;
    valor_unitario_estimado: number | undefined;
  }[];
  anexos: File[] | undefined;
};

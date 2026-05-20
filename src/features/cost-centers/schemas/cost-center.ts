import * as z from 'zod';

export const costCenterSchema = z.object({
  codigo: z.string().min(2, 'Informe o código do centro de custo.'),
  nome: z.string().min(2, 'O nome deve ter ao menos 2 caracteres.'),
  unidade: z.string().min(1, 'Selecione a unidade.'),
  ativo: z.boolean()
});

export type CostCenterFormValues = {
  codigo: string;
  nome: string;
  unidade: string;
  ativo: boolean;
};

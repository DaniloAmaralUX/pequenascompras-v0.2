import * as z from 'zod';

export const catalogItemSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter ao menos 2 caracteres.'),
  categoria: z.string().min(1, 'Selecione uma categoria.'),
  unidade_medida: z.string().min(1, 'Selecione a unidade de medida.'),
  is_item_estoque: z.boolean(),
  tem_contrato_vigente: z.boolean(),
  preco_medio_historico: z.number({ message: 'Informe o preço médio.' }).min(0)
});

export type CatalogItemFormValues = {
  nome: string;
  categoria: string;
  unidade_medida: string;
  is_item_estoque: boolean;
  tem_contrato_vigente: boolean;
  preco_medio_historico: number | undefined;
};

import * as z from 'zod';

export const supplierSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter ao menos 2 caracteres.'),
  cnpj: z.string().min(14, 'Informe um CNPJ válido.'),
  email: z.string().email('Informe um e-mail válido.'),
  telefone: z.string().min(8, 'Informe um telefone válido.'),
  categoria: z.string().min(1, 'Selecione uma categoria.'),
  homologado: z.boolean(),
  bloqueado: z.boolean()
});

export type SupplierFormValues = {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  categoria: string;
  homologado: boolean;
  bloqueado: boolean;
};

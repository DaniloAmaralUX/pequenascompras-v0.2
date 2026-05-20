import * as z from 'zod';

export const userSchema = z.object({
  first_name: z.string().min(2, 'O nome deve ter ao menos 2 caracteres.'),
  last_name: z.string().min(2, 'O sobrenome deve ter ao menos 2 caracteres.'),
  email: z.string().email('Informe um e-mail válido.'),
  phone: z.string().min(1, 'O telefone é obrigatório.'),
  role: z.string().min(1, 'Selecione um papel.'),
  status: z.string().min(1, 'Selecione a situação.'),
  unidade: z.string().min(1, 'Selecione a unidade.'),
  centro_de_custo: z.string().min(1, 'Informe o centro de custo.')
});

export type UserFormValues = z.infer<typeof userSchema>;

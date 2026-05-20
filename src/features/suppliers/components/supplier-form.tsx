'use client';

import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupplierMutation, updateSupplierMutation } from '../api/mutations';
import type { Supplier } from '../api/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';
import { supplierSchema, type SupplierFormValues } from '../schemas/supplier';
import { supplierCategoryOptions } from '../constants/supplier-options';

export default function SupplierForm({
  initialData,
  pageTitle
}: {
  initialData: Supplier | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const createMutation = useMutation({
    ...createSupplierMutation,
    onSuccess: () => {
      toast.success('Fornecedor criado com sucesso');
      router.push('/dashboard/suppliers');
    },
    onError: () => {
      toast.error('Falha ao criar fornecedor');
    }
  });

  const updateMutation = useMutation({
    ...updateSupplierMutation,
    onSuccess: () => {
      toast.success('Fornecedor atualizado com sucesso');
      router.push('/dashboard/suppliers');
    },
    onError: () => {
      toast.error('Falha ao atualizar fornecedor');
    }
  });

  const form = useAppForm({
    defaultValues: {
      nome: initialData?.nome ?? '',
      cnpj: initialData?.cnpj ?? '',
      email: initialData?.email ?? '',
      telefone: initialData?.telefone ?? '',
      categoria: initialData?.categoria ?? '',
      homologado: initialData?.homologado ?? false,
      bloqueado: initialData?.bloqueado ?? false
    } as SupplierFormValues,
    validators: {
      onSubmit: supplierSchema
    },
    onSubmit: ({ value }) => {
      const payload = {
        nome: value.nome,
        cnpj: value.cnpj,
        email: value.email,
        telefone: value.telefone,
        categoria: value.categoria,
        homologado: value.homologado,
        bloqueado: value.bloqueado
      };

      if (isEdit) {
        updateMutation.mutate({ id: initialData.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  const { FormTextField, FormSelectField, FormSwitchField } =
    useFormFields<SupplierFormValues>();

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Form className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormTextField
                name='nome'
                label='Nome do fornecedor'
                required
                placeholder='Razão social ou nome fantasia'
                validators={{
                  onBlur: z.string().min(2, 'O nome deve ter ao menos 2 caracteres.')
                }}
              />

              <FormTextField
                name='cnpj'
                label='CNPJ'
                required
                placeholder='00.000.000/0001-00'
                validators={{
                  onBlur: z.string().min(14, 'Informe um CNPJ válido.')
                }}
              />

              <FormTextField
                name='email'
                label='E-mail'
                required
                type='email'
                placeholder='contato@fornecedor.com'
                validators={{
                  onBlur: z.string().email('Informe um e-mail válido.')
                }}
              />

              <FormTextField
                name='telefone'
                label='Telefone'
                required
                placeholder='(00) 00000-0000'
                validators={{
                  onBlur: z.string().min(8, 'Informe um telefone válido.')
                }}
              />

              <FormSelectField
                name='categoria'
                label='Categoria'
                required
                options={supplierCategoryOptions}
                placeholder='Selecione a categoria'
                validators={{
                  onBlur: z.string().min(1, 'Selecione uma categoria.')
                }}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormSwitchField
                name='homologado'
                label='Fornecedor homologado'
                description='Apenas fornecedores homologados podem ser usados em solicitações.'
              />
              <FormSwitchField
                name='bloqueado'
                label='Fornecedor bloqueado'
                description='Fornecedores bloqueados são rejeitados pelo motor de governança.'
              />
            </div>

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Voltar
              </Button>
              <form.SubmitButton>
                {isEdit ? 'Atualizar fornecedor' : 'Adicionar fornecedor'}
              </form.SubmitButton>
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}

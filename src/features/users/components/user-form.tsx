'use client';

import { useAppForm, useFormFields, scrollToFirstError } from '@/components/ui/tanstack-form';
import { useStore } from '@tanstack/react-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertModal } from '@/components/modal/alert-modal';
import { FormSection } from '@/components/form-section';
import { useUnsavedChangesWarning } from '@/hooks/use-unsaved-changes-warning';
import { createUserMutation, updateUserMutation } from '../api/mutations';
import type { User } from '../api/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';
import { userSchema, type UserFormValues } from '../schemas/user';
import { ROLE_OPTIONS, STATUS_OPTIONS, UNIDADE_OPTIONS } from './users-table/options';

export default function UserForm({
  initialData,
  pageTitle
}: {
  initialData: User | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: () => {
      toast.success('Usuário criado com sucesso');
      router.push('/dashboard/users');
    },
    onError: () => {
      toast.error('Falha ao criar usuário');
    }
  });

  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso');
      router.push('/dashboard/users');
    },
    onError: () => {
      toast.error('Falha ao atualizar usuário');
    }
  });

  const form = useAppForm({
    defaultValues: {
      first_name: initialData?.first_name ?? '',
      last_name: initialData?.last_name ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      role: initialData?.role ?? '',
      status: initialData?.status ?? 'Ativo',
      unidade: initialData?.unidade ?? '',
      centro_de_custo: initialData?.centro_de_custo ?? ''
    } as UserFormValues,
    validators: {
      onSubmit: userSchema
    },
    onSubmitInvalid: () => scrollToFirstError(),
    onSubmit: ({ value }) => {
      if (isEdit) {
        updateMutation.mutate({ id: initialData.id, values: value });
      } else {
        createMutation.mutate(value);
      }
    }
  });

  const { FormTextField, FormSelectField } = useFormFields<UserFormValues>();

  const isDirty = useStore(form.store, (s) => s.isDirty);
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  useUnsavedChangesWarning(isDirty);

  const handleVoltar = () => {
    if (isDirty) setConfirmarSaida(true);
    else router.back();
  };

  return (
    <>
      <AlertModal
        isOpen={confirmarSaida}
        onClose={() => setConfirmarSaida(false)}
        onConfirm={() => router.back()}
        loading={false}
        title='Descartar alterações?'
        description='As alterações não salvas serão perdidas.'
        confirmLabel='Descartar'
      />
      <Card className='mx-auto w-full max-w-4xl'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Form className='flex flex-col gap-8'>
            <FormSection title='Dados pessoais'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormTextField
                  name='first_name'
                  label='Nome'
                  required
                  placeholder='João'
                  validators={{
                    onBlur: z.string().min(2, 'O nome deve ter ao menos 2 caracteres.')
                  }}
                />
                <FormTextField
                  name='last_name'
                  label='Sobrenome'
                  required
                  placeholder='Silva'
                  validators={{
                    onBlur: z.string().min(2, 'O sobrenome deve ter ao menos 2 caracteres.')
                  }}
                />
                <FormTextField
                  name='email'
                  label='E-mail'
                  required
                  type='email'
                  placeholder='joao@sesi.org.br'
                  validators={{
                    onBlur: z.string().email('Informe um e-mail válido.')
                  }}
                />
                <FormTextField
                  name='phone'
                  label='Telefone'
                  required
                  type='tel'
                  placeholder='(00) 00000-0000'
                  validators={{
                    onBlur: z.string().min(8, 'Informe um telefone válido.')
                  }}
                />
              </div>
            </FormSection>

            <FormSection
              title='Acesso e lotação'
              description='Define o papel no RBAC e a unidade/centro de custo do usuário.'
            >
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormSelectField
                  name='role'
                  label='Papel'
                  required
                  options={ROLE_OPTIONS}
                  placeholder='Selecione o papel'
                  validators={{
                    onBlur: z.string().min(1, 'Selecione um papel.')
                  }}
                />
                <FormSelectField
                  name='unidade'
                  label='Unidade'
                  required
                  options={UNIDADE_OPTIONS}
                  placeholder='Selecione a unidade'
                  validators={{
                    onBlur: z.string().min(1, 'Selecione a unidade.')
                  }}
                />
                <FormTextField
                  name='centro_de_custo'
                  label='Centro de custo'
                  required
                  placeholder='Ex.: CC-1001'
                  validators={{
                    onBlur: z.string().min(1, 'Informe o centro de custo.')
                  }}
                />
                <FormSelectField
                  name='status'
                  label='Situação'
                  required
                  options={STATUS_OPTIONS}
                  placeholder='Selecione a situação'
                  validators={{
                    onBlur: z.string().min(1, 'Selecione a situação.')
                  }}
                />
              </div>
            </FormSection>

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={handleVoltar}>
                Voltar
              </Button>
              <form.SubmitButton>
                {isEdit ? 'Atualizar usuário' : 'Adicionar usuário'}
              </form.SubmitButton>
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
      </Card>
    </>
  );
}

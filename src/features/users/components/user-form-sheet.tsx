'use client';

import { useState } from 'react';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { useMutation } from '@tanstack/react-query';
import { createUserMutation, updateUserMutation } from '../api/mutations';
import type { User } from '../api/types';
import { toast } from 'sonner';
import * as z from 'zod';
import { userSchema, type UserFormValues } from '../schemas/user';
import { ROLE_OPTIONS, STATUS_OPTIONS, UNIDADE_OPTIONS } from './users-table/options';

interface UserFormSheetProps {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormSheet({ user, open, onOpenChange }: UserFormSheetProps) {
  const isEdit = !!user;

  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: () => {
      toast.success('Usuário criado com sucesso');
      onOpenChange(false);
      form.reset();
    },
    onError: () => toast.error('Falha ao criar usuário')
  });

  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso');
      onOpenChange(false);
    },
    onError: () => toast.error('Falha ao atualizar usuário')
  });

  const form = useAppForm({
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      role: user?.role ?? '',
      status: user?.status ?? 'Ativo',
      unidade: user?.unidade ?? '',
      centro_de_custo: user?.centro_de_custo ?? ''
    } as UserFormValues,
    validators: {
      onSubmit: userSchema
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: user.id, values: value });
      } else {
        await createMutation.mutateAsync(value);
      }
    }
  });

  const { FormTextField, FormSelectField } = useFormFields<UserFormValues>();

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Atualize os dados do usuário abaixo.'
              : 'Preencha os dados para criar um novo usuário.'}
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-auto'>
          <form.AppForm>
            <form.Form id='user-form-sheet' className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
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
              </div>

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
                  onBlur: z.string().min(1, 'O telefone é obrigatório.')
                }}
              />

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
            </form.Form>
          </form.AppForm>
        </div>

        <SheetFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type='submit' form='user-form-sheet' isLoading={isPending}>
            <Icons.check /> {isEdit ? 'Atualizar usuário' : 'Criar usuário'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function UserFormSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className='mr-2 h-4 w-4' /> Novo Usuário
      </Button>
      <UserFormSheet open={open} onOpenChange={setOpen} />
    </>
  );
}

'use client';

import { useAppForm, useFormFields, scrollToFirstError } from '@/components/ui/tanstack-form';
import { useStore } from '@tanstack/react-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertModal } from '@/components/modal/alert-modal';
import { FormSection } from '@/components/form-section';
import { useUnsavedChangesWarning } from '@/hooks/use-unsaved-changes-warning';
import { createCostCenterMutation, updateCostCenterMutation } from '../api/mutations';
import type { CostCenter } from '../api/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';
import { costCenterSchema, type CostCenterFormValues } from '../schemas/cost-center';
import { unidadeOptions } from '../constants/cost-center-options';

export default function CostCenterForm({
  initialData,
  pageTitle
}: {
  initialData: CostCenter | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const createMutation = useMutation({
    ...createCostCenterMutation,
    onSuccess: () => {
      toast.success('Centro de custo criado com sucesso');
      router.push('/dashboard/cost-centers');
    },
    onError: () => {
      toast.error('Falha ao criar centro de custo');
    }
  });

  const updateMutation = useMutation({
    ...updateCostCenterMutation,
    onSuccess: () => {
      toast.success('Centro de custo atualizado com sucesso');
      router.push('/dashboard/cost-centers');
    },
    onError: () => {
      toast.error('Falha ao atualizar centro de custo');
    }
  });

  const form = useAppForm({
    defaultValues: {
      codigo: initialData?.codigo ?? '',
      nome: initialData?.nome ?? '',
      unidade: initialData?.unidade ?? '',
      ativo: initialData?.ativo ?? true
    } as CostCenterFormValues,
    validators: {
      onSubmit: costCenterSchema
    },
    onSubmitInvalid: () => scrollToFirstError(),
    onSubmit: ({ value }) => {
      const payload = {
        codigo: value.codigo,
        nome: value.nome,
        unidade: value.unidade,
        ativo: value.ativo
      };

      if (isEdit) {
        updateMutation.mutate({ id: initialData.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  const { FormTextField, FormSelectField, FormSwitchField } =
    useFormFields<CostCenterFormValues>();

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
            <FormSection title='Dados do centro de custo'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormTextField
                  name='codigo'
                  label='Código'
                  required
                  placeholder='Ex.: CC-1001'
                  validators={{
                    onBlur: z.string().min(2, 'Informe o código do centro de custo.')
                  }}
                />
                <FormTextField
                  name='nome'
                  label='Nome do centro de custo'
                  required
                  placeholder='Ex.: Tecnologia da Informação'
                  validators={{
                    onBlur: z.string().min(2, 'O nome deve ter ao menos 2 caracteres.')
                  }}
                />
                <FormSelectField
                  name='unidade'
                  label='Unidade'
                  required
                  options={unidadeOptions}
                  placeholder='Selecione a unidade'
                  validators={{
                    onBlur: z.string().min(1, 'Selecione a unidade.')
                  }}
                />
              </div>
            </FormSection>

            <FormSection title='Situação'>
              <FormSwitchField
                name='ativo'
                label='Centro de custo ativo'
                description='Apenas centros de custo ativos podem ser usados em solicitações.'
              />
            </FormSection>

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={handleVoltar}>
                Voltar
              </Button>
              <form.SubmitButton>
                {isEdit ? 'Atualizar centro de custo' : 'Adicionar centro de custo'}
              </form.SubmitButton>
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
      </Card>
    </>
  );
}

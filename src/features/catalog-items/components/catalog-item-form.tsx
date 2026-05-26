'use client';

import { useAppForm, useFormFields, scrollToFirstError } from '@/components/ui/tanstack-form';
import { useStore } from '@tanstack/react-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertModal } from '@/components/modal/alert-modal';
import { FormSection } from '@/components/form-section';
import { useUnsavedChangesWarning } from '@/hooks/use-unsaved-changes-warning';
import { createCatalogItemMutation, updateCatalogItemMutation } from '../api/mutations';
import type { CatalogItem } from '../api/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';
import { catalogItemSchema, type CatalogItemFormValues } from '../schemas/catalog-item';
import { itemCategoryOptions, unidadeMedidaOptions } from '../constants/catalog-item-options';

export default function CatalogItemForm({
  initialData,
  pageTitle
}: {
  initialData: CatalogItem | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const createMutation = useMutation({
    ...createCatalogItemMutation,
    onSuccess: () => {
      toast.success('Item criado com sucesso');
      router.push('/dashboard/catalog');
    },
    onError: () => {
      toast.error('Falha ao criar item');
    }
  });

  const updateMutation = useMutation({
    ...updateCatalogItemMutation,
    onSuccess: () => {
      toast.success('Item atualizado com sucesso');
      router.push('/dashboard/catalog');
    },
    onError: () => {
      toast.error('Falha ao atualizar item');
    }
  });

  const form = useAppForm({
    defaultValues: {
      nome: initialData?.nome ?? '',
      categoria: initialData?.categoria ?? '',
      unidade_medida: initialData?.unidade_medida ?? '',
      is_item_estoque: initialData?.is_item_estoque ?? false,
      tem_contrato_vigente: initialData?.tem_contrato_vigente ?? false,
      preco_medio_historico: initialData?.preco_medio_historico
    } as CatalogItemFormValues,
    validators: {
      onSubmit: catalogItemSchema
    },
    onSubmitInvalid: () => scrollToFirstError(),
    onSubmit: ({ value }) => {
      const payload = {
        nome: value.nome,
        categoria: value.categoria,
        unidade_medida: value.unidade_medida,
        is_item_estoque: value.is_item_estoque,
        tem_contrato_vigente: value.tem_contrato_vigente,
        preco_medio_historico: value.preco_medio_historico!
      };

      if (isEdit) {
        updateMutation.mutate({ id: initialData.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    }
  });

  const { FormTextField, FormSelectField, FormSwitchField } =
    useFormFields<CatalogItemFormValues>();

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
            <FormSection title='Dados do item'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormTextField
                  name='nome'
                  label='Nome do item'
                  required
                  placeholder='Ex.: Resma de papel A4'
                  validators={{
                    onBlur: z.string().min(2, 'O nome deve ter ao menos 2 caracteres.')
                  }}
                />
                <FormSelectField
                  name='categoria'
                  label='Categoria'
                  required
                  options={itemCategoryOptions}
                  placeholder='Selecione a categoria'
                  validators={{
                    onBlur: z.string().min(1, 'Selecione uma categoria.')
                  }}
                />
                <FormSelectField
                  name='unidade_medida'
                  label='Unidade de medida'
                  required
                  options={unidadeMedidaOptions}
                  placeholder='Selecione a unidade'
                  validators={{
                    onBlur: z.string().min(1, 'Selecione a unidade de medida.')
                  }}
                />
                <FormTextField
                  name='preco_medio_historico'
                  label='Preço médio histórico (R$)'
                  required
                  type='number'
                  min={0}
                  step={0.01}
                  placeholder='0,00'
                  validators={{
                    onBlur: z.number({ message: 'Informe o preço médio.' })
                  }}
                />
              </div>
            </FormSection>

            <FormSection
              title='Classificação de governança'
              description='Define como o motor de regras trata o item em pequenas compras.'
            >
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormSwitchField
                  name='is_item_estoque'
                  label='Item de estoque'
                  description='Itens de estoque são rejeitados pelo motor de governança em pequenas compras.'
                />
                <FormSwitchField
                  name='tem_contrato_vigente'
                  label='Possui contrato vigente'
                  description='Itens com contrato vigente devem ser comprados pelo contrato, não por compra avulsa.'
                />
              </div>
            </FormSection>

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={handleVoltar}>
                Voltar
              </Button>
              <form.SubmitButton>
                {isEdit ? 'Atualizar item' : 'Adicionar item'}
              </form.SubmitButton>
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
      </Card>
    </>
  );
}

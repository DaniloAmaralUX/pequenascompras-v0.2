'use client';

import * as React from 'react';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { revalidateLogic, useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormStepper } from '@/components/ui/form-stepper';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { useFormStepper } from '@/hooks/use-stepper';
import { createPurchaseRequestMutation } from '../api/mutations';
import {
  stepSchemas,
  purchaseRequestSchema,
  type PurchaseRequestFormValues
} from '../schemas/purchase-request';
import { prioridadeOptions } from '../constants/purchase-request-options';
import { unidadeOptions } from '@/features/cost-centers/constants/cost-center-options';
import {
  itemCategoryOptions,
  unidadeMedidaOptions
} from '@/features/catalog-items/constants/catalog-item-options';
import { PURCHASE_STATUS } from '@/constants/mock-api-purchase-requests';
import { loadFromStorage, saveToStorage } from '@/lib/mock-storage';

const DRAFT_STORAGE_KEY = 'purchase-request-draft';
const AUTOSAVE_DEBOUNCE_MS = 800;

/** Persiste apenas campos serializáveis (exclui File objects dos anexos). */
type DraftSnapshot = Omit<PurchaseRequestFormValues, 'anexos'>;

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const itemVazio = {
  descricao: '',
  categoria: '',
  quantidade: undefined,
  unidade_medida: '',
  valor_unitario_estimado: undefined
};

export default function PurchaseRequestForm() {
  const router = useRouter();
  const enviarRef = React.useRef(false);
  const reduzirMovimento = useReducedMotion();
  const [draftSavedAt, setDraftSavedAt] = React.useState<number | null>(null);

  // Restaura rascunho do localStorage (anexos não são persistíveis).
  const draftInicial = React.useMemo(() => loadFromStorage<DraftSnapshot>(DRAFT_STORAGE_KEY), []);

  const { currentValidator, step, currentStep, isFirstStep, handleCancelOrBack, handleNextStepOrSubmit } =
    useFormStepper(stepSchemas);

  const mutation = useMutation({
    ...createPurchaseRequestMutation,
    onSuccess: (data) => {
      // Limpa o rascunho persistido — submissão concluída.
      saveToStorage<DraftSnapshot | null>(DRAFT_STORAGE_KEY, null);
      if (data?.request?.status === PURCHASE_STATUS.BLOQUEADA) {
        toast.warning('Solicitação bloqueada pelo motor de governança', {
          description: data.request.motivos_bloqueio.join(' | ')
        });
      } else if (data?.request?.status === PURCHASE_STATUS.AGUARDANDO_APROVACAO) {
        toast.success('Solicitação enviada para aprovação');
      } else {
        toast.success('Rascunho salvo com sucesso');
      }
      router.push('/dashboard/requests');
    },
    onError: () => toast.error('Falha ao salvar a solicitação')
  });

  const form = useAppForm({
    defaultValues: {
      unidade: draftInicial?.unidade ?? '',
      centro_de_custo: draftInicial?.centro_de_custo ?? '',
      prioridade: draftInicial?.prioridade ?? '',
      justificativa: draftInicial?.justificativa ?? '',
      itens: draftInicial?.itens && draftInicial.itens.length > 0
        ? draftInicial.itens
        : [{ ...itemVazio }],
      anexos: undefined
    } as PurchaseRequestFormValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: currentValidator as typeof purchaseRequestSchema,
      onDynamicAsyncDebounceMs: 400
    },
    onSubmit: ({ value }) => {
      mutation.mutate({
        solicitante_nome: 'Solicitante',
        unidade: value.unidade,
        centro_de_custo: value.centro_de_custo,
        justificativa: value.justificativa,
        prioridade: value.prioridade,
        itens: value.itens.map((it) => ({
          descricao: it.descricao,
          categoria: it.categoria,
          quantidade: Number(it.quantidade),
          unidade_medida: it.unidade_medida,
          valor_unitario_estimado: Number(it.valor_unitario_estimado)
        })),
        anexos: (value.anexos ?? []).map((f) => ({ nome: f.name, tipo: f.type })),
        enviar: enviarRef.current
      });
    }
  });

  const { FormSelectField, FormTextField, FormTextareaField, FormFileUploadField } =
    useFormFields<PurchaseRequestFormValues>();

  const formValues = useStore(form.store, (s) => s.values);
  const valorTotal = formValues.itens.reduce(
    (t, it) => t + Number(it.quantidade || 0) * Number(it.valor_unitario_estimado || 0),
    0
  );

  // Auto-save do rascunho — debounced 800ms para não bater a cada keystroke.
  // Anexos não são serializáveis (File objects) — preservados só na sessão.
  React.useEffect(() => {
    const temAlgo =
      formValues.unidade ||
      formValues.centro_de_custo ||
      formValues.prioridade ||
      formValues.justificativa ||
      formValues.itens.some((it) => it.descricao || it.categoria);
    if (!temAlgo) return;

    const id = setTimeout(() => {
      const snapshot: DraftSnapshot = {
        unidade: formValues.unidade,
        centro_de_custo: formValues.centro_de_custo,
        prioridade: formValues.prioridade,
        justificativa: formValues.justificativa,
        itens: formValues.itens
      };
      saveToStorage(DRAFT_STORAGE_KEY, snapshot);
      setDraftSavedAt(Date.now());
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [formValues]);

  const submeter = (enviar: boolean) => {
    enviarRef.current = enviar;
    form.handleSubmit();
  };

  return (
    <Card className='mx-auto w-full max-w-4xl'>
      <CardHeader className='flex flex-row items-start justify-between gap-3'>
        <CardTitle className='text-left text-2xl font-bold'>Nova Solicitação de Compra</CardTitle>
        {draftSavedAt && (
          <span
            className='text-muted-foreground inline-flex shrink-0 items-center gap-1 text-xs'
            aria-live='polite'
          >
            <Icons.check className='size-3 text-emerald-500' aria-hidden='true' />
            Rascunho salvo
          </span>
        )}
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form.Form className='flex flex-col gap-6'>
            <FormStepper
              currentStep={currentStep}
              steps={[
                { label: 'Dados gerais' },
                { label: 'Itens' },
                { label: 'Revisão' }
              ]}
            />

            <span className='sr-only' aria-live='polite'>
              Etapa {currentStep} de {stepSchemas.length}
            </span>

            <AnimatePresence mode='popLayout' initial={false}>
              <motion.div
                key={currentStep}
                initial={reduzirMovimento ? false : { opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduzirMovimento ? { opacity: 0 } : { opacity: 0, x: -15 }}
                transition={reduzirMovimento ? { duration: 0 } : { duration: 0.3, type: 'spring' }}
                className='flex flex-col gap-4'
              >
                {/* Etapa 1 — Dados gerais */}
                {currentStep === 1 && (
                  <div className='flex flex-col gap-4'>
                    <h3 className='text-lg font-semibold'>Dados gerais</h3>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                      <FormSelectField
                        name='unidade'
                        label='Unidade'
                        required
                        options={unidadeOptions}
                        placeholder='Selecione a unidade'
                      />
                      <FormTextField
                        name='centro_de_custo'
                        label='Centro de custo'
                        required
                        placeholder='Ex.: CC-1001'
                      />
                      <FormSelectField
                        name='prioridade'
                        label='Prioridade'
                        required
                        options={prioridadeOptions}
                        placeholder='Selecione a prioridade'
                      />
                    </div>
                    <FormTextareaField
                      name='justificativa'
                      label='Justificativa'
                      required
                      placeholder='Descreva a necessidade da compra'
                      rows={4}
                      maxLength={500}
                    />
                  </div>
                )}

                {/* Etapa 2 — Itens e comprovante */}
                {currentStep === 2 && (
                  <div className='flex flex-col gap-4'>
                    <h3 className='text-lg font-semibold'>Itens da solicitação</h3>
                    <form.AppField name='itens' mode='array'>
                      {(arrayField) => (
                        <div className='flex flex-col gap-4'>
                          {arrayField.state.value.map((_, i) => (
                            <div key={i} className='rounded-lg border p-4'>
                              <div className='mb-2 flex items-center justify-between'>
                                <span className='text-sm font-medium'>Item {i + 1}</span>
                                {arrayField.state.value.length > 1 && (
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    aria-label={`Remover item ${i + 1}`}
                                    className="relative size-8 before:absolute before:-inset-1.5 before:content-['']"
                                    onClick={() => arrayField.removeValue(i)}
                                  >
                                    <Icons.trash className='size-4' />
                                  </Button>
                                )}
                              </div>
                              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <form.AppField name={`itens[${i}].descricao`}>
                                  {(f) => (
                                    <f.TextField
                                      label='Descrição do item'
                                      required
                                      placeholder='Ex.: Resma de papel A4'
                                    />
                                  )}
                                </form.AppField>
                                <form.AppField name={`itens[${i}].categoria`}>
                                  {(f) => (
                                    <f.SelectField
                                      label='Categoria'
                                      required
                                      options={itemCategoryOptions}
                                      placeholder='Selecione a categoria'
                                    />
                                  )}
                                </form.AppField>
                                <form.AppField name={`itens[${i}].quantidade`}>
                                  {(f) => (
                                    <f.TextField
                                      label='Quantidade'
                                      required
                                      type='number'
                                      min={1}
                                      placeholder='0'
                                    />
                                  )}
                                </form.AppField>
                                <form.AppField name={`itens[${i}].unidade_medida`}>
                                  {(f) => (
                                    <f.SelectField
                                      label='Unidade de medida'
                                      required
                                      options={unidadeMedidaOptions}
                                      placeholder='Selecione a unidade'
                                    />
                                  )}
                                </form.AppField>
                                <form.AppField name={`itens[${i}].valor_unitario_estimado`}>
                                  {(f) => (
                                    <f.TextField
                                      label='Valor unitário estimado (R$)'
                                      required
                                      type='number'
                                      min={0}
                                      step={0.01}
                                      placeholder='0,00'
                                    />
                                  )}
                                </form.AppField>
                              </div>
                            </div>
                          ))}
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => arrayField.pushValue({ ...itemVazio })}
                          >
                            <Icons.add className='mr-2 size-4' /> Adicionar item
                          </Button>
                        </div>
                      )}
                    </form.AppField>

                    <Separator />

                    <FormFileUploadField
                      name='anexos'
                      label='Comprovante de preço'
                      description='Anexe orçamento, print de site ou nota fiscal (obrigatório).'
                      maxSize={5 * 1024 * 1024}
                      maxFiles={3}
                    />

                    <div className='bg-muted/50 flex items-center justify-between rounded-lg px-4 py-3'>
                      <span className='text-sm font-medium'>Valor total estimado</span>
                      <span className='text-lg font-bold tabular-nums'>{formatBRL(valorTotal)}</span>
                    </div>
                  </div>
                )}

                {/* Etapa 3 — Revisão */}
                {currentStep === 3 && (
                  <div className='border-primary/40 bg-primary/[0.03] flex flex-col gap-4 rounded-lg border p-4'>
                    <div className='flex items-center gap-2'>
                      <Icons.checks className='text-primary size-5' />
                      <h3 className='text-lg font-semibold'>Revisão e envio</h3>
                    </div>
                    <p className='text-muted-foreground -mt-3 text-xs'>
                      Confira os dados antes de enviar. Após o envio, a solicitação seguirá para
                      aprovação.
                    </p>
                    <div className='grid gap-3 md:grid-cols-2'>
                      <ReviewLinha rotulo='Unidade' valor={formValues.unidade} />
                      <ReviewLinha rotulo='Centro de custo' valor={formValues.centro_de_custo} />
                      <ReviewLinha rotulo='Prioridade' valor={formValues.prioridade} />
                    </div>
                    <ReviewLinha rotulo='Justificativa' valor={formValues.justificativa} />
                    <Separator />
                    <div className='space-y-2'>
                      <span className='text-muted-foreground text-xs font-medium uppercase'>
                        Itens ({formValues.itens.length})
                      </span>
                      {formValues.itens.map((it, i) => (
                        <div key={i} className='flex items-center justify-between text-sm'>
                          <span>
                            {it.descricao || '—'}{' '}
                            <span className='text-muted-foreground'>
                              ({it.quantidade || 0} {it.unidade_medida})
                            </span>
                          </span>
                          <span className='tabular-nums'>
                            {formatBRL(
                              Number(it.quantidade || 0) *
                                Number(it.valor_unitario_estimado || 0)
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className='flex items-center justify-between'>
                      <Badge variant='secondary'>
                        {(formValues.anexos?.length ?? 0)} anexo(s)
                      </Badge>
                      <span className='text-lg font-bold tabular-nums'>
                        {formatBRL(valorTotal)}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className='flex items-center justify-between gap-3 pt-2'>
              <Button
                type='button'
                variant='outline'
                disabled={isFirstStep}
                onClick={() => handleCancelOrBack()}
              >
                <Icons.chevronLeft className='mr-1 size-4' aria-hidden='true' /> Voltar
              </Button>

              {step.isCompleted ? (
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    isLoading={mutation.isPending}
                    onClick={() => submeter(false)}
                  >
                    Salvar rascunho
                  </Button>
                  <Button
                    type='button'
                    isLoading={mutation.isPending}
                    onClick={() => submeter(true)}
                  >
                    <Icons.send className='mr-1 size-4' aria-hidden='true' /> Enviar para aprovação
                  </Button>
                </div>
              ) : (
                <Button type='button' onClick={() => handleNextStepOrSubmit(form)}>
                  Próximo <Icons.chevronRight className='ml-1 size-4' />
                </Button>
              )}
            </div>
          </form.Form>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}

function ReviewLinha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className='text-muted-foreground text-xs font-medium uppercase'>{rotulo}</p>
      <p className='text-sm'>{valor || '—'}</p>
    </div>
  );
}

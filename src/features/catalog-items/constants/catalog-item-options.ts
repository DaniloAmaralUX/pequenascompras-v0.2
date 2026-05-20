import { ITEM_CATEGORIES, UNIDADES_MEDIDA } from '@/constants/mock-api-catalog-items';

/** Opções de categoria de item — usadas em formulários e filtros de tabela. */
export const itemCategoryOptions = ITEM_CATEGORIES.map((c) => ({ value: c, label: c }));

/** Opções de unidade de medida. */
export const unidadeMedidaOptions = UNIDADES_MEDIDA.map((u) => ({ value: u, label: u }));

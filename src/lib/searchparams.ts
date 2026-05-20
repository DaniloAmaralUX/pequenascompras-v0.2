import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  nome: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  categoria: parseAsString,
  unidade: parseAsString,
  numero: parseAsString,
  status: parseAsString,
  prioridade: parseAsString,
  role: parseAsString,
  sort: parseAsString
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);

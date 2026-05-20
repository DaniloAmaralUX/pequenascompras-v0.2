import { queryOptions } from '@tanstack/react-query';
import {
  fetchDashboard,
  fetchItensRecorrentes,
  fetchGastoPorSetor,
  fetchAlertasPreco
} from './service';

export const reportKeys = {
  all: ['reports'] as const,
  dashboard: () => [...reportKeys.all, 'dashboard'] as const,
  itensRecorrentes: () => [...reportKeys.all, 'itens-recorrentes'] as const,
  gastoPorSetor: () => [...reportKeys.all, 'gasto-por-setor'] as const,
  alertasPreco: () => [...reportKeys.all, 'alertas-preco'] as const
};

export const dashboardQueryOptions = () =>
  queryOptions({
    queryKey: reportKeys.dashboard(),
    queryFn: fetchDashboard
  });

export const itensRecorrentesQueryOptions = () =>
  queryOptions({
    queryKey: reportKeys.itensRecorrentes(),
    queryFn: fetchItensRecorrentes
  });

export const gastoPorSetorQueryOptions = () =>
  queryOptions({
    queryKey: reportKeys.gastoPorSetor(),
    queryFn: fetchGastoPorSetor
  });

export const alertasPrecoQueryOptions = () =>
  queryOptions({
    queryKey: reportKeys.alertasPreco(),
    queryFn: fetchAlertasPreco
  });

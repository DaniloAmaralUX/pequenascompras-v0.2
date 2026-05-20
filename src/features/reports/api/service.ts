// ============================================================
// Reports Service — Camada de Acesso a Dados (Analytics)
// ============================================================
// Único arquivo a modificar ao conectar a uma camada de BI real.
// Atual: computa agregações sobre o store mock de solicitações.
// ============================================================

import {
  getDashboardData,
  getItensRecorrentes,
  getGastoPorSetor,
  getAlertasPreco
} from '../lib/analytics';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDashboard() {
  await delay(200);
  return getDashboardData();
}

export async function fetchItensRecorrentes() {
  await delay(200);
  return getItensRecorrentes();
}

export async function fetchGastoPorSetor() {
  await delay(200);
  return getGastoPorSetor();
}

export async function fetchAlertasPreco() {
  await delay(200);
  return getAlertasPreco();
}

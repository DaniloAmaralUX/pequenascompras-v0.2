import { Suspense } from 'react';
import { requireProfile } from '@/lib/route-guard';
import PageContainer from '@/components/layout/page-container';
import { ClientOnly } from '@/components/client-only';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { ExportButton } from '@/components/export-button';
import PrecosAlertasReport from '@/features/reports/components/precos-alertas-report';

export const metadata = {
  title: 'Relatórios: Preços & Alertas'
};

export default async function Page() {
  await requireProfile(['Analista de Suprimentos']);

  const skeleton = <DataTableSkeleton columnCount={6} rowCount={8} />;

  return (
    <PageContainer
      pageTitle='Preços & Alertas'
      pageDescription='Itens com preço acima da média histórica — apoio à negociação.'
      pageHeaderAction={<ExportButton reportName='Preços & Alertas' />}
    >
      <ClientOnly fallback={skeleton}>
        <Suspense fallback={skeleton}>
          <PrecosAlertasReport />
        </Suspense>
      </ClientOnly>
    </PageContainer>
  );
}

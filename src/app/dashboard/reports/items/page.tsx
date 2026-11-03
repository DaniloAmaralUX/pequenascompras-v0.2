import { Suspense } from 'react';
import { requireProfile } from '@/lib/route-guard';
import PageContainer from '@/components/layout/page-container';
import { ClientOnly } from '@/components/client-only';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { ExportButton } from '@/components/export-button';
import ItensRecorrentesReport from '@/features/reports/components/itens-recorrentes-report';

export const metadata = {
  title: 'Relatórios: Itens Recorrentes'
};

export default async function Page() {
  await requireProfile(['Analista de Suprimentos']);

  const skeleton = <DataTableSkeleton columnCount={8} rowCount={8} />;

  return (
    <PageContainer
      pageTitle='Itens Recorrentes'
      pageDescription='Itens comprados repetidamente — candidatos a compra em atacado ou contrato.'
      pageHeaderAction={<ExportButton reportName='Itens Recorrentes' />}
    >
      <ClientOnly fallback={skeleton}>
        <Suspense fallback={skeleton}>
          <ItensRecorrentesReport />
        </Suspense>
      </ClientOnly>
    </PageContainer>
  );
}

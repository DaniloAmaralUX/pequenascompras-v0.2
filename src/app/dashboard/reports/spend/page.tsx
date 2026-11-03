import { Suspense } from 'react';
import { requireProfile } from '@/lib/route-guard';
import PageContainer from '@/components/layout/page-container';
import { ClientOnly } from '@/components/client-only';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { ExportButton } from '@/components/export-button';
import GastoSetorReport from '@/features/reports/components/gasto-setor-report';

export const metadata = {
  title: 'Relatórios: Gasto por Setor'
};

export default async function Page() {
  await requireProfile(['Analista de Suprimentos']);

  const skeleton = <DataTableSkeleton columnCount={4} rowCount={8} />;

  return (
    <PageContainer
      pageTitle='Gasto por Setor'
      pageDescription='Distribuição do gasto com pequenas compras por centro de custo.'
      pageHeaderAction={<ExportButton reportName='Gasto por Setor' />}
    >
      <ClientOnly fallback={skeleton}>
        <Suspense fallback={skeleton}>
          <GastoSetorReport />
        </Suspense>
      </ClientOnly>
    </PageContainer>
  );
}

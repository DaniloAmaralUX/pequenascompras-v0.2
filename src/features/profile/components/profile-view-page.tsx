import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function ProfileViewPage() {
  return (
    <PageContainer
      pageTitle='Perfil'
      pageDescription='Visualize seu perfil de teste no protótipo.'
    >
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Icons.profile className='size-4' />
            Sessão de teste
          </CardTitle>
        </CardHeader>
        <CardContent className='text-muted-foreground space-y-3 text-sm'>
          <p>
            Este protótipo não exige login. Seu perfil de teste é definido pelo
            seletor <span className='text-foreground font-medium'>&ldquo;Ver como&rdquo;</span>{' '}
            no topo da tela.
          </p>
          <p>
            Os dados de solicitações criadas durante o teste são salvos apenas
            no seu navegador, não em nenhum servidor.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

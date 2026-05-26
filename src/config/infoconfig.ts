import type { InfobarContent } from '@/components/ui/infobar';

export const billingInfoContent: InfobarContent = {
  title: 'Cobrança e Planos',
  sections: [
    {
      title: 'Visão Geral',
      description:
        'A página de Cobrança permite gerenciar a assinatura e os limites de uso da sua organização. Planos e assinaturas são gerenciados pelo Clerk Billing para B2B, que oferece gerenciamento de assinaturas no nível da organização com processamento integrado pelo Stripe.',
      links: [
        {
          title: 'Documentação Clerk Billing',
          url: 'https://clerk.com/docs/billing/overview'
        }
      ]
    },
    {
      title: 'Planos Disponíveis',
      description:
        'Visualize e assine planos disponíveis através da tabela de preços. Os planos são criados e gerenciados no Painel do Clerk. Ative "Disponível publicamente" nos planos para exibi-los na tabela. Planos comuns incluem gratuito, pro e equipe.',
      links: [
        {
          title: 'Painel Clerk — Planos',
          url: 'https://dashboard.clerk.com/~/billing/plans'
        }
      ]
    },
    {
      title: 'Recursos dos Planos',
      description:
        'Cada plano pode incluir recursos específicos que desbloqueiam funcionalidades na aplicação. Os recursos são adicionados aos planos no Painel do Clerk e podem ser verificados no código usando a função `has()` com verificações de `feature`.',
      links: []
    },
    {
      title: 'Controle de Acesso',
      description:
        'Planos e recursos são usados para controle de acesso em toda a aplicação. Verificações no servidor usam a função `has()` para confirmar acesso ao plano ou recurso. A proteção no cliente usa o componente `<Show>` para renderizar conteúdo condicionalmente com base no status da assinatura.',
      links: []
    },
    {
      title: 'Estrutura de Custo do Billing',
      description:
        'O Clerk Billing cobra 0,7% por transação, mais as tarifas de transação pagas diretamente ao Stripe. O Clerk Billing não é o mesmo que o Stripe Billing — planos e preços são gerenciados pelo Painel do Clerk e não sincronizam com produtos Stripe existentes. O Clerk usa o Stripe apenas para processamento de pagamentos.',
      links: []
    },
    {
      title: 'Requisitos de Configuração',
      description:
        'Para habilitar o billing, acesse as Configurações de Billing no Painel do Clerk e ative o billing para sua aplicação. Escolha entre o gateway de desenvolvimento do Clerk (para testes) ou sua própria conta Stripe (para produção). Atenção: uma conta Stripe criada para desenvolvimento não pode ser usada em produção.',
      links: [
        {
          title: 'Configurações de Billing',
          url: 'https://dashboard.clerk.com/~/billing/settings'
        }
      ]
    },
    {
      title: 'Status Beta',
      description:
        'O Billing está atualmente em Beta e suas APIs são experimentais, podendo sofrer mudanças. Para minimizar possíveis interrupções, recomendamos fixar as versões do SDK e do pacote `clerk-js`.',
      links: []
    }
  ]
};

export const productInfoContent: InfobarContent = {
  title: 'Gestão de Produtos',
  sections: [
    {
      title: 'Visão Geral',
      description:
        'A página de Produtos permite gerenciar seu catálogo de produtos. Você pode visualizar todos os produtos em formato de tabela com funcionalidades server-side incluindo ordenação, filtragem, paginação e busca. Use o botão "Adicionar Novo" para criar produtos.',
      links: [
        {
          title: 'Guia de Gestão de Produtos',
          url: '#'
        }
      ]
    },
    {
      title: 'Adicionar Produtos',
      description:
        'Para adicionar um novo produto, clique no botão "Adicionar Novo" no cabeçalho da página. Você será direcionado a um formulário onde poderá preencher os detalhes do produto, incluindo nome, descrição, preço, categoria e imagens.',
      links: [
        {
          title: 'Documentação de Adição de Produtos',
          url: '#'
        }
      ]
    },
    {
      title: 'Editar Produtos',
      description:
        'Você pode editar produtos existentes clicando em uma linha da tabela. Isso abrirá o formulário de edição onde você poderá modificar qualquer informação do produto. As alterações são salvas ao enviar o formulário.',
      links: [
        {
          title: 'Guia de Edição de Produtos',
          url: '#'
        }
      ]
    },
    {
      title: 'Excluir Produtos',
      description:
        'Produtos podem ser excluídos na tabela de listagem. Clique na ação de exclusão do produto desejado. Você precisará confirmar a exclusão antes que o produto seja removido permanentemente do catálogo.',
      links: [
        {
          title: 'Política de Exclusão de Produtos',
          url: '#'
        }
      ]
    },
    {
      title: 'Recursos da Tabela',
      description:
        'A tabela de produtos inclui recursos poderosos para gerenciar grandes catálogos com eficiência. Você pode ordenar colunas clicando nos cabeçalhos, filtrar produtos usando os controles de filtro, navegar pelas páginas com paginação e localizar produtos rapidamente com a busca.',
      links: [
        {
          title: 'Documentação de Recursos da Tabela',
          url: '#'
        },
        {
          title: 'Guia de Ordenação e Filtragem',
          url: '#'
        }
      ]
    },
    {
      title: 'Campos do Produto',
      description:
        'Cada produto pode ter os seguintes campos: Nome (obrigatório), Descrição (texto opcional), Preço (valor numérico), Categoria (para organizar produtos) e Upload de Imagem (para fotos do produto). Todos os campos podem ser editados ao criar ou atualizar um produto.',
      links: [
        {
          title: 'Especificação dos Campos de Produto',
          url: '#'
        }
      ]
    }
  ]
};

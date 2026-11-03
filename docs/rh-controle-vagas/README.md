# RH — Controle de Vagas

Escopo do sistema de apoio ao RH para consolidar, acompanhar e analisar os processos seletivos.
Fonte: [analise_sistema_rh_controle_vagas.pdf](./analise_sistema_rh_controle_vagas.pdf), derivada da planilha `CONTROLE_DE_VAGAS_2026`.

Base de código: protótipo `pequenascompras-v0.2` (commit `ecafdc2`), mesma stack e shell.

## Planilha de origem

| Aba               | Conteúdo                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| VAGAS SESI        | Controle principal: chamado, código, gestor, unidade, contrato, cargo, status, ação, SLA, jurídico, retorno do gestor, fechamento |
| VAGAS S ORQUESTRA | Segundo layout de vagas                                                                        |
| CRONOGRAMA        | Etapas: inscrição, prova, entrevista RH, entrevista gestor, habilitação, formulário, admissão |
| Base              | Listas: solicitantes, áreas, contratos, motivos, cargos, níveis, funções, recrutadores, status, ações |

O cronograma tem fórmulas quebradas (`#REF!`): o sistema recalcula os indicadores internamente.

## Requisitos funcionais

| Código | Requisito                                                                                   |
| ------ | ------------------------------------------------------------------------------------------- |
| RF01   | Upload da planilha de controle de vagas                                                     |
| RF02   | Identificar o layout importado (VAGAS SESI ou VAGAS S ORQUESTRA)                            |
| RF03   | Validar colunas obrigatórias                                                                |
| RF04   | Alertar inconsistências, campos ausentes, datas inválidas e fórmulas quebradas              |
| RF05   | Importar vagas (chamado, código, gestor, unidade, cargo, status, ação)                      |
| RF06   | Histórico das importações                                                                   |
| RF07   | Histórico de alterações por vaga                                                            |
| RF08   | Consultar por chamado, código, status, ação, área, gestor, recrutador e período             |
| RF09   | SLA de 20 dias úteis a partir da abertura                                                   |
| RF10   | Contagem do SLA até a divulgação do resultado ou até hoje (vaga aberta)                     |
| RF11   | Tempo de resposta do gestor                                                                 |
| RF12   | Tempo de resposta do jurídico                                                               |
| RF13   | Identificar vagas reabertas                                                                 |
| RF14   | Identificar fechamento no prazo                                                             |
| RF15   | Dashboard gerencial                                                                         |
| RF16   | Relatório analítico por vaga                                                                |
| RF17   | Relatório por cronograma                                                                    |
| RF18   | Análise por etapa do processo seletivo                                                      |
| RF19   | Exportar relatórios filtrados                                                               |
| RF20   | Registrar ou importar a quantidade de candidatos aplicados                                  |

## Épicos e features

| Épico                  | Features                                         | Requisitos        |
| ---------------------- | ------------------------------------------------ | ----------------- |
| Importação de planilhas | Upload, validação de layout, tratamento de erros | RF01–RF05         |
| Histórico de dados     | Histórico de cargas, histórico da vaga           | RF06, RF07        |
| Gestão de vagas        | Consulta, detalhe da vaga                        | RF08, RF13, RF14  |
| Indicadores de SLA     | SLA da vaga, SLA gestor, SLA jurídico            | RF09–RF12         |
| Dashboard gerencial    | Visão executiva, gargalos do processo            | RF15              |
| Cronograma seletivo    | Etapas do processo                               | RF17, RF18        |
| Relatórios analíticos  | Por área, por recrutador, exportação             | RF16, RF19        |
| Candidatos             | Indicadores de candidato, quantidade de aplicados | RF20             |

## Indicadores

- Vagas por status, ação, área, gestor, recrutador, tipo de contrato e motivo.
- Vagas PCD, reabertas, fechadas no prazo, canceladas, congeladas, suspensas e fracassadas.
- Tempo médio de preenchimento, até divulgação do resultado e até previsão de admissão.
- Tempo médio de resposta do gestor e do jurídico.
- SLA total em dias úteis e SLA descontando tempos externos; vagas com SLA vencido ou perto de vencer.
- Vagas por etapa do cronograma.
- Selecionados por gênero, candidatos internos selecionados e vagas que geraram banco.
- Candidatos aplicados por vaga.

## Pontos em aberto

- [ ] Qual data representa vaga preenchida (divulgação do resultado, previsão de admissão ou outra)?
- [ ] Qual data representa vaga encerrada?
- [ ] Identificador único da vaga (provável: chamado + código da vaga).
- [ ] Incluir o campo de candidatos aplicados (não aparece na planilha atual).
- [ ] Corrigir nomes de campos no modelo: `VAGA FECAHADA NO PRAZO?` → `VAGA FECHADA NO PRAZO?`, `REABERTUTA` → `REABERTURA`.

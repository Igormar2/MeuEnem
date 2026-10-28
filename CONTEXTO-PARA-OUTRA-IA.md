# Contexto do protótipo — Plataforma de Estudos para o ENEM

## Localização do projeto

O projeto atual está nesta pasta:

`C:\Users\USER\Documents\Codex\2026-10-26\files-pasted-by-the-user-projeto\outputs\`

A página inicial executável é `index.html`. Caminho completo:

`C:\Users\USER\Documents\Codex\2026-10-26\files-pasted-by-the-user-projeto\outputs\index.html`

É um protótipo local, feito com HTML, CSS e JavaScript puro. Não há etapa de build nem servidor obrigatório: abra `index.html` no navegador. Depois de alterações, atualize a página. Os dados de diagnóstico ficam no `localStorage` do navegador (`meu-enem-prototype-v2`), portanto são locais ao navegador e dispositivo.

## Objetivo geral

A plataforma ajuda a pessoa a escolher uma área e matéria para estudar para o ENEM. A experiência começa em **Defina suas prioridades**, leva à escolha de uma área e, em seguida, de uma matéria. O foco da implementação recente foi integrar um piloto pedagógico de Física, com diagnóstico aprofundado de **Óptica**, ao protótipo que já existia.

A intenção não é apenas dar uma nota. O piloto procura avaliar habilidades individualmente, considerar confiança e consistência das respostas, investigar algumas dificuldades, explicar os resultados e criar uma fila de estudos que não inclua obrigatoriamente conteúdos demonstrados como dominados.

## Fluxo existente

1. A pessoa abre o protótipo e seleciona uma área de prioridade.
2. Escolhe uma matéria.
3. Em Física, escolhe entre os conteúdos-piloto **Cinemática** e **Óptica**.
4. Cinemática abre o fluxo de diagnóstico que já existia no projeto.
5. Óptica abre o painel do diagnóstico pedagógico; dali a pessoa pode iniciar/continuar o questionário, consultar o mapa ou ver o resultado salvo.
6. O diagnóstico de Óptica registra respostas e confiança, adapta a pergunta seguinte, gera relatório e fila personalizada. Também permite revisão voluntária de tópicos do mapa.

As áreas disponíveis na tela de prioridades são Ciências da Natureza, Ciências Humanas, Linguagens e suas Tecnologias, e Matemática e suas Tecnologias. Várias matérias continuam sendo áreas de navegação ou conteúdo em preparação; não assuma que todas já têm diagnósticos funcionais.

## Arquivos importantes

- `index.html` — ponto de entrada; carrega os scripts na ordem necessária.
- `styles.css` — identidade visual e estilos compartilhados, inclusive os componentes de Óptica (`.op-*`).
- `app.js` — navegação geral, prioridades, matérias, conteúdos e diagnósticos que já existiam. Encaminha telas `optics-*` para o módulo de Óptica.
- `optica-ui.js` — interface, telas e ações do fluxo de Óptica. Integra-se com as funções e o estado geral do app.
- `optica-map.js` — mapa hierárquico dos grupos A–I (fundamentos, reflexão, espelhos, refração, lentes, visão/instrumentos, fenômenos ondulatórios e aplicações).
- `optica-bank-a.js` a `optica-bank-d.js` — banco diagnóstico adaptativo, organizado por habilidade.
- `optica-engine.js` — regras determinísticas do diagnóstico, persistência da sessão via estado do app, critérios de classificação, relatório/fila e ponto de extensão para IA futura (`OpticaAIAdapter`).
- `optica-practice.js` e `optica-practice-b.js` — dois conjuntos de exercícios independentes para verificação após o estudo.

Não crie um site substituto nem remova a navegação, matérias ou funcionalidades já existentes. Faça alterações incrementais nesses arquivos e preserve o fluxo atual.

## Cobertura atual de Óptica

O piloto tem 22 habilidades diagnósticas e três perguntas por habilidade (66 questões de diagnóstico). Há também 44 questões de prática, duas por habilidade. A pergunta complementar é escolhida a partir das respostas; a confiança pode ser marcada como certeza, dúvida ou chute. Os estados do diagnóstico são Dominado, Parcialmente dominado, Precisa estudar, Inconclusivo e Não avaliado.

O mapa é mais amplo do que a cobertura de avaliação. Subtópicos sem questões específicas devem continuar explícitos como **não avaliados**. Não conclua domínio ou dificuldade só porque o assunto aparece no mapa. O relatório armazena evidências e justificativas, oferece histórico local, separa fila obrigatória da revisão voluntária e ordena pré-requisitos avaliados antes de habilidades dependentes quando necessário.

A prática após estudo exige duas questões distintas para atualizar o estado; concluir uma aula ou acertar uma única questão não basta. Existe uma interface `OpticaAIAdapter` como preparação para possível integração futura, mas nenhuma API de IA está conectada.

## Como editar com segurança

- Para alterar textos, matérias ou navegação geral, comece por `app.js`.
- Para alterar telas/ações de Óptica, use `optica-ui.js`.
- Para alterar critérios pedagógicos, dependências ou ordem da fila, examine `optica-engine.js` e os metadados dos bancos.
- Para adicionar/ajustar uma habilidade, mantenha alinhados o mapa, banco diagnóstico e os dois bancos de prática.
- Ao adicionar um novo arquivo JavaScript, inclua-o em `index.html` na ordem correta: mapa e bancos antes do motor; app geral e UI depois dos dados e do motor.
- Preserve o estado em `localStorage`; evite mudar a chave existente sem plano de migração, pois isso faria o protótipo deixar de encontrar os dados salvos.
- Evite alegar que toda Óptica ou todas as matérias já foram avaliadas. Descreva com precisão a cobertura funcional e o que ainda está em preparação.

## Verificações já realizadas

Foi corrigido o roteamento do módulo de Óptica: o nome do renderizador interno foi separado do `render()` geral para que os cliques realmente mudem de tela. Um teste de interface confirmou que **Abrir diagnóstico de Óptica** mostra o painel e **Iniciar diagnóstico** abre a primeira questão. Os arquivos JavaScript passaram por verificação de sintaxe, e os oito cenários pedagógicos solicitados para o motor passaram: domínio de espelhos, dificuldade específica em lentes, separação entre conceito e matemática, respostas contraditórias, chutes, domínio amplo, diagnóstico incompleto e pré-requisito fundamental.

## Orientação para a próxima IA

Antes de editar, leia este documento e examine os arquivos listados — especialmente `app.js`, `optica-ui.js`, `optica-engine.js`, o mapa e os bancos. Identifique se o pedido novo pertence à navegação geral, à interface de Óptica, ao motor ou aos dados. Mantenha o protótipo existente e faça mudanças incrementais. Depois, explique quais arquivos alterou, o que ficou funcional e quais limites ainda permanecem.

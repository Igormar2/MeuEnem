/* ══════════════════════════════════════════════════════════════════════════
   AI SERVICE — TUTOR & MOTOR DIAGNÓSTICO ADAPTATIVO ENEM (GOOGLE GEMINI API)
   ══════════════════════════════════════════════════════════════════════════
   Estrutura:
   1. Integração com Gemini API v1beta (modelos Flash com fallback automático).
   2. Mapeamento Profundo de Competências e Habilidades para TODOS os conteúdos.
   3. Motor Diagnóstico Adaptativo: 1 questão por vez, adaptada às respostas.
   4. Investigação Conversacional dos Erros antes de concluir (distinguindo
      conceito, interpretação, unidades, fórmula, cálculo ou pré-requisito).
   5. Classificação nos 4 Níveis Oficiais: 🔴 Não sei, 🟠 Básico, 🟡 Em desenvolvimento, 🟢 Dominado.
   6. Relatório Consolidado Denso com Dupla Recomendação (Trilha Pedagógica Global
      + Sugestões Acionáveis do Conteúdo Real Cadastrado no Site).
   ══════════════════════════════════════════════════════════════════════════ */

const GEMINI_API_KEY = ""; // Cole sua chave do Google Gemini (AIzaSy...) aqui ou insira pelo Menu (☰) do site
const GEMINI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-3.7-flash"];

function extractJson(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

  const sanitizeForJson = (str) => {
    return str
      .replace(/\\times\b/g, '×')
      .replace(/[\t\r\n ]+imes\b/g, ' × ')
      .replace(/\\cdot\b/g, '·')
      .replace(/\\Delta\b/g, 'Δ')
      .replace(/\\lambda\b/g, 'λ')
      .replace(/\\theta\b/g, 'θ')
      .replace(/\\Omega\b/g, 'Ω')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
      .replace(/\\([^"\\\/bfnrtu])/g, '$1');
  };

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    try {
      return JSON.parse(sanitizeForJson(cleaned));
    } catch (e2) {}
  }

  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (e) {
      try {
        return JSON.parse(sanitizeForJson(match[0]));
      } catch (e2) {}
    }
  }
  return null;
}

const DEFAULT_SYSTEM_INSTRUCTION = `Você é a "Professora IA", uma tutora pedagógica acolhedora, extremamente didática e especialista sênior no ENEM (Exame Nacional do Ensino Médio).
Seu idioma é OBRIGATORIAMENTE o Português do Brasil (pt-BR) autêntico, empático e inspirador.

Diretrizes pedagógicas e de contexto:
1. CONTEXTO EM TEMPO REAL DA PLATAFORMA: Você sempre recebe antes da mensagem da aluna um bloco com o [CONTEXTO DO ESTUDO / TELA ATUAL]. Esse bloco contém a matéria atual, o resumo, a última atividade estudada e TODAS as questões oficiais do ENEM cadastradas para o tópico (com número: Questão 1, Questão 2..., enunciado completo, alternativas A-E, gabarito e resolução).
2. Se a estudante disser "questão 1", "não entendi a questão 2", "me explica essa questão", ou perguntar sobre o gabarito de uma alternativa, NUNCA diga que não tem o enunciado ou peça para ela copiar e colar. Localize a respectiva questão no contexto e explique-a passo a passo com didática impecável!
3. Explicação Direta e Estruturada: Vá direto ao ponto, usando tópicos, analogias do dia a dia e destaques em negrito.
4. Foco no ENEM: Destaque o que o ENEM realmente cobra e avise sobre possíveis pegadinhas comuns dos distratores.
5. Mnemônicos e Macetes: Quando couber, ofereça frases divertidas ou siglas fáceis para memorizar fórmulas e conceitos.
6. Tom Empático: Seja sempre encorajadora, transmitindo confiança para a prova.`;

/* ══════════════════════════════════════════════════════════════════════════
   TAXONOMIA E MAPEAMENTO DE COMPETÊNCIAS POR CONTEÚDO
   ══════════════════════════════════════════════════════════════════════════ */
const COMPETENCY_TAXONOMY = {
  niveisDominio: {
    NAO_SEI: { id: 'NAO_SEI', label: 'Não sei', cor: '#ef4444', icone: '🔴', desc: 'Ausência de fundamentos essenciais ou desconhecimento do tema.' },
    BASICO: { id: 'BASICO', label: 'Básico', cor: '#f97316', icone: '🟠', desc: 'Conhecimentos iniciais e pontuais, mas com lacunas conceituais importantes.' },
    EM_DESENVOLVIMENTO: { id: 'EM_DESENVOLVIMENTO', label: 'Em desenvolvimento', cor: '#eab308', icone: '🟡', desc: 'Compreende parte do conteúdo, mas oscila em distratores ou situações complexas.' },
    DOMINADO: { id: 'DOMINADO', label: 'Dominado', cor: '#10b981', icone: '🟢', desc: 'Domínio consistente em questões e contextos diferentes da matriz do ENEM.' }
  },
  statusHabilidade: {
    DOMINADO: { label: 'Dominado', badge: '🟢 Dominado' },
    EM_DESENVOLVIMENTO: { label: 'Em desenvolvimento', badge: '🟡 Em desenvolvimento' },
    BASICO: { label: 'Básico', badge: '🟠 Básico' },
    NAO_SEI: { label: 'Estudo necessário', badge: '🔴 Estudo necessário' },
    INCONCLUSIVO: { label: 'Inconclusivo', badge: '❓ Inconclusivo' },
    NAO_AVALIADO: { label: 'Não avaliado', badge: '⚪ Não avaliado' }
  },
  causasErro: {
    CONCEITUAL: { nome: 'Conceito / Fundamento', desc: 'Desconhecimento da teoria ou do processo fundamental.' },
    INTERPRETACAO: { nome: 'Interpretação do Enunciado', desc: 'Dificuldade na leitura do texto-base, distrator contextual ou identificação do comando.' },
    GRANDEZAS_E_UNIDADES: { nome: 'Grandezas e Unidades', desc: 'Erro de conversão (km/h vs m/s, mol vs g) ou confusão entre variáveis.' },
    MODELAGEM_OU_PROCEDIMENTO: { nome: 'Escolha de Modelo / Fórmula', desc: 'Seleção inadequada de modelo físico, biológico, químico ou matemático.' },
    CALCULO_OU_ALGEBRA: { nome: 'Álgebra e Cálculo', desc: 'Erro aritmético ou na manipulação de equações, mantendo o raciocínio correto.' },
    PRE_REQUISITO_AUSENTE: { nome: 'Pré-requisito Ausente', desc: 'Falta de base conceitual prévia necessária para resolver o problema.' },
    ATENCAO_OU_ESQUECIMENTO: { nome: 'Atenção ou Lapso Pontual', desc: 'Compreende o tema, mas cometeu deslize pontual por pressa ou distração.' },
    INCONCLUSIVO: { nome: 'Causa Inconclusiva', desc: 'Evidências insuficientes para determinar o motivo com segurança.' }
  }
};

const MODULE_COMPETENCIES_MAP = {
  fisica_cinetica: {
    nome: 'Cinética e Mecânica',
    materia: 'Física',
    area: 'natureza',
    conceitosFundamentais: [
      'Velocidade escalar média e conversão km/h ↔ m/s',
      'Função horária do Movimento Uniforme (MU)',
      'Velocidade relativa, encontros e ultrapassagem de corpos extensos',
      'Aceleração, equações do MUV e Equação de Torricelli',
      'Interpretação física de gráficos s×t e v×t (área = Δs)',
      'Leis de Newton (Inércia, F_R = m·a, Ação e Reação)',
      'Força de atrito estático e cinético (aplicação em freios ABS)',
      'Trabalho de uma força e Teorema da Energia Cinética (TEC)',
      'Conservação e dissipação da Energia Mecânica',
      'Potência mecânica e rendimento de motores'
    ],
    preRequisitos: ['Álgebra básica e equações de 1º e 2º grau', 'Razão e proporção', 'Leitura e interpretação de gráficos cartesianos'],
    habilidadesEnem: ['H17 - Reconhecer relações quantitativas e grandezas mecânicas', 'H20 - Caracterizar causas e efeitos em sistemas mecânicos', 'H21 - Analisar conservação e dissipação de energia em situações cotidianas'],
    tiposProblema: ['Tempo de reação de motorista e distância total de frenagem', 'Ultrapassagem de composições ferroviárias em pontes', 'Atuação do atrito estático e cinético em pistas molhadas', 'Conservação de energia em montanhas-russas e pistas de skate', 'Potência exigida em esteiras rolantes e elevadores'],
    errosComuns: [
      'Esquecer de converter km/h para m/s dividindo por 3,6 antes de usar o tempo em segundos',
      'Ignorar o comprimento dos próprios móveis em problemas de ultrapassagem',
      'Achar que o atrito cinético é maior que o atrito estático máximo',
      'Achar que velocidade constante implica força resultante diferente de zero'
    ],
    criteriosDominio: {
      naoSei: 'Não compreende a relação básica entre espaço, tempo e velocidade média.',
      basico: 'Aplica fórmulas pontuais (v = d/t) mas falha em conversões de unidades e leitura de gráficos.',
      emDesenvolvimento: 'Resolve situações diretas de MRU e dinâmica, mas oscila em conservação de energia com atrito.',
      dominado: 'Modela com precisão sistemas mecânicos complexos, gráficos de área e conservação de energia.'
    }
  },

  fisica_optica: {
    nome: 'Óptica Geométrica e Fenômenos Luminosos',
    materia: 'Física',
    area: 'natureza',
    conceitosFundamentais: [
      'Princípios da óptica geométrica (propagação retilínea, reversibilidade e independência)',
      'Reflexão da luz e propriedades de imagens em espelhos planos',
      'Espelhos esféricos côncavos e convexos (foco, vértice e campo visual)',
      'Refração da luz, índice de refração e Lei de Snell (n₁·sen θ₁ = n₂·sen θ₂)',
      'Reflexão interna total e ângulo limite (fibras ópticas e miragens)',
      'Lentes esféricas delgadas convergentes e divergentes (comportamento óptico)',
      'Óptica da visão e correção de ametropias (miopia, hipermetropia e astigmatismo)'
    ],
    preRequisitos: ['Trigonometria básica (seno e cosseno)', 'Semelhança geométrica de triângulos', 'Conceito de velocidade da onda eletromagnética'],
    habilidadesEnem: ['H1 - Reconhecer características ópticas e visuais na formação de imagens', 'H17 - Aplicar relações quantitativas em fenômenos luminosos', 'H18 - Dimensionar dispositivos ópticos e lentes de correção'],
    tiposProblema: ['Espelhos retrovisores convexos e ampliação do campo visual', 'Transmissão de dados via fibra óptica por reflexão total', 'Refração em prismas e dispersão da luz branca', 'Cálculo de dioptrias (grau) de lentes para miopia e hipermetropia'],
    errosComuns: [
      'Medir o ângulo de incidência em relação à superfície e não em relação à reta normal',
      'Achar que a luz viaja mais rápido em meios com maior índice de refração',
      'Confundir lente divergente (correção de miopia) com convergente (hipermetropia)',
      'Achar que reflexão total pode ocorrer do meio menos refringente para o mais refringente'
    ],
    criteriosDominio: {
      naoSei: 'Desconhece os princípios de propagação retilínea e reflexão da luz.',
      basico: 'Identifica imagens em espelhos planos mas erra a Lei de Snell e tipos de lentes.',
      emDesenvolvimento: 'Aplica Snell mas erra condições de reflexão total ou correção de ametropias.',
      dominado: 'Analisa sistemas ópticos compostos, fibras ópticas e vergência com rigor.'
    }
  },

  matematica_probabilidade: {
    nome: 'Probabilidade',
    materia: 'Matemática',
    area: 'matematica',
    conceitosFundamentais: [
      'Espaço amostral equiprovável e definição clássica P(E) = n(E)/n(S)',
      'Probabilidade da união de eventos P(A ∪ B) = P(A) + P(B) - P(A ∩ B)',
      'Evento complementar e o método do "pelo menos um" (1 - P(nenhum))',
      'Probabilidade condicional P(A|B) e restrição do espaço amostral',
      'Multiplicação de probabilidades em eventos independentes e dependentes (sem reposição)',
      'Interpretação probabilística em tabelas de dupla entrada e matrizes de dados'
    ],
    preRequisitos: ['Operações com frações e números decimais', 'Porcentagem', 'Teoria de conjuntos e contagem básica'],
    habilidadesEnem: ['H28 - Resolver situação-problema que envolva probabilidade de ocorrência de eventos', 'H29 - Calcular e interpretar probabilidades extraídas de tabelas ou gráficos'],
    tiposProblema: ['Triagem epidemiológica e eficácia de testes diagnósticos rápidos', 'Controle de qualidade industrial com amostragem sem reposição', 'Probabilidade condicional extraída de tabelas populacionais do IBGE', 'Sistemas de redundância com probabilidade de falha ("pelo menos um")'],
    errosComuns: [
      'Manter o espaço amostral original ao calcular probabilidade condicional ("sabendo que")',
      'Somar probabilidades sem subtrair a interseção em eventos que têm elementos em comum',
      'Confundir a regra do "OU" (soma) com a regra do "E" (multiplicação)',
      'Esquecer de diminuir o denominador e o numerador em retiradas sucessivas sem reposição'
    ],
    criteriosDominio: {
      naoSei: 'Não compreende a relação entre casos favoráveis e casos possíveis.',
      basico: 'Calcula probabilidade direta mas erra condicional e eventos sucessivos.',
      emDesenvolvimento: 'Resolve condicional simples mas trava no evento complementar ou tabelas complexas.',
      dominado: 'Identifica instantaneamente restrições amostrais, testes diagnósticos e eventos compostos.'
    }
  },

  matematica_financeira: {
    nome: 'Matemática Financeira e Juros Compostos',
    materia: 'Matemática',
    area: 'matematica',
    conceitosFundamentais: [
      'Razão, proporção e porcentagem no cotidiano',
      'Fatores multiplicativos de aumento (1 + i) e desconto (1 - i)',
      'Aumentos e descontos sucessivos',
      'Variação percentual relativa e recomposição de valor original',
      'Juros simples (J = C·i·t) e crescimento linear',
      'Juros compostos (M = C·(1+i)^t) e crescimento exponencial',
      'Decisão de compra: pagamento à vista com desconto vs parcelado',
      'Taxa de juros embutida em compras a prazo e amortização'
    ],
    preRequisitos: ['Operações com decimais e frações', 'Potenciação e propriedades', 'Funções afins e exponenciais'],
    habilidadesEnem: ['H19 - Analisar informações financeiras em tabelas e gráficos', 'H21 - Resolver problemas envolvendo acréscimos, descontos e juros', 'H22 - Tomada de decisão econômica entre pagamento à vista ou a prazo'],
    tiposProblema: ['Comparação de financiamentos com entrada e taxa embutida nas parcelas', 'Inflação acumulada em meses sucessivos e perda do poder de compra', 'Depreciação exponencial de máquinas ou veículos', 'Decisão financeira de investimento com rendimento real líquido'],
    errosComuns: [
      'Somar percentuais de descontos sucessivos (achar que dois descontos de 20% somam 40%)',
      'Calcular a taxa do parcelamento sobre o valor original quando foi dada uma entrada',
      'Confundir juros simples (crescimento aritmético) com compostos (geométrico)',
      'Calcular porcentagem de aumento sobre a base errada'
    ],
    criteriosDominio: {
      naoSei: 'Não domina o cálculo elementar de porcentagem.',
      basico: 'Calcula porcentagens simples mas soma taxas em aumentos sucessivos.',
      emDesenvolvimento: 'Domina fator multiplicativo mas se confunde na taxa embutida em parcelamentos.',
      dominado: 'Domina juros compostos, análise crítica de parcelamentos e projeções financeiras.'
    }
  },

  quimica_ligacoes: {
    nome: 'Ligações Químicas e Interações Intermoleculares',
    materia: 'Química',
    area: 'natureza',
    conceitosFundamentais: [
      'Regra do octeto e estabilidade eletrônica',
      'Ligação iônica (transferência de elétrons, fórmula de sais e propriedades)',
      'Ligação covalente (compartilhamento de pares de elétrons e fórmulas de Lewis)',
      'Ligação metálica (mar de elétrons, ductilidade e condutividade)',
      'Geometria molecular (VSEPR: linear, angular, piramidal, tetraédrica)',
      'Eletronegatividade e polaridade das moléculas (vetor momento dipolar)',
      'Forças intermoleculares (London/Dipolo Induzido, Dipolo-Dipolo, Ligação de Hidrogênio)',
      'Relação entre forças intermoleculares e pontos de fusão/ebulição',
      'Solubilidade ("semelhante dissolve semelhante"), tensoativos e micelas'
    ],
    preRequisitos: ['Tabela periódica (metais vs ametais, famílias)', 'Distribuição eletrônica básica'],
    habilidadesEnem: ['H17 - Reconhecer aplicações das propriedades dos materiais no cotidiano', 'H24 - Associar propriedades macroscópicas às forças intermoleculares e ligações'],
    tiposProblema: ['Ação de sabões e detergentes na solubilização de lipídios', 'Comparação de pontos de ebulição entre hidrocarbonetos, álcoois e ácidos carboxílicos', 'Solubilidade de fármacos e vitaminas hidrossolúveis vs lipossolúveis', 'Condutividade elétrica de materiais nos estados sólido, fundido e aquoso'],
    errosComuns: [
      'Achar que compostos iônicos conduzem corrente elétrica no estado sólido',
      'Confundir ligação covalente (intramolecular) com forças intermoleculares que se rompem na fervura',
      'Achar que toda molécula com átomo eletronegativo é polar (esquecer simetria espacial)',
      'Não identificar ligação de hidrogênio em compostos com H ligado a F, O ou N'
    ],
    criteriosDominio: {
      naoSei: 'Desconhece a diferença entre ligação iônica e covalente.',
      basico: 'Identifica tipos de ligação mas erra geometria espacial e polaridade.',
      emDesenvolvimento: 'Domina polaridade mas confunde forças intermoleculares e solubilidade.',
      dominado: 'Explica propriedades físico-químicas de tensoativos, polímeros e fármacos com precisão.'
    }
  },

  quimica_estequiometria: {
    nome: 'Estequiometria e Relações Quantitativas',
    materia: 'Química',
    area: 'natureza',
    conceitosFundamentais: [
      'Leis ponderais de Lavoisier e Proust',
      'Conceito de mol, massa molar (g/mol) e constante de Avogadro',
      'Volume molar de gases nas CNTP (22,4 ou 22,7 L/mol)',
      'Balanceamento de equações químicas pelo método das tentativas',
      'Proporção estequiométrica padrão (massa-massa, massa-mol e massa-volume)',
      'Cálculo com pureza percentual de reagentes',
      'Cálculo com rendimento percentual real da reação (< 100%)',
      'Identificação de reagente limitante e reagente em excesso',
      'Reações sucessivas e equação química global'
    ],
    preRequisitos: ['Regra de três simples e proporções matemáticas', 'Fórmulas químicas de substâncias comuns'],
    habilidadesEnem: ['H17 - Reconhecer relações quantitativas em reações químicas', 'H20 - Caracterizar materiais e reagentes em processos industriais e ambientais', 'H21 - Avaliar rendimento e emissão de poluentes em reações químicas'],
    tiposProblema: ['Emissão de CO₂ por queima de combustíveis fósseis vs biocombustíveis', 'Produção de fertilizantes nitrogenados (Haber-Bosch) com rendimento industrial', 'Tratamento de efluentes industriais por precipitação e neutralização', 'Extração metalúrgica de ferro a partir de hematita impura'],
    errosComuns: [
      'Iniciar cálculos antes de balancear a equação química',
      'Aplicar a porcentagem de pureza no produto em vez do reagente',
      'Calcular o rendimento do produto baseando-se no reagente em excesso',
      'Errar a conversão de toneladas ou quilogramas para gramas'
    ],
    criteriosDominio: {
      naoSei: 'Não compreende o conceito de mol nem aplica regra de três química.',
      basico: 'Resolve reações diretas mas erra balanceamento ou rendimento.',
      emDesenvolvimento: 'Domina pureza e rendimento mas se confunde ao identificar reagente limitante.',
      dominado: 'Resolve com agilidade processos estequiométricos industriais e ambientais complexos.'
    }
  },

  biologia_citologia: {
    nome: 'Citologia e Fisiologia Celular',
    materia: 'Biologia',
    area: 'natureza',
    conceitosFundamentais: [
      'Teoria celular e diferenças entre células procarióticas e eucarióticas',
      'Estrutura e propriedades da membrana plasmática (modelo mosaico fluido)',
      'Transportes passivos: difusão simples, difusão facilitada e osmose',
      'Transporte ativo e bomba de sódio e potássio (gasto de ATP contra gradiente)',
      'Funções de organelas citoplasmáticas e compartimentação celular',
      'Respiração celular aeróbia, fermentação lática/alcoólica e fotossíntese',
      'Divisão celular: mitose (proliferação e regeneração) vs meiose (gametogênese)'
    ],
    preRequisitos: ['Noções de concentração de soluções e gradiente osmótico', 'Macromoléculas biológicas (proteínas, lipídios, carboidratos)'],
    habilidadesEnem: ['H14 - Identificar padrões em fenômenos biológicos celulares', 'H15 - Interpretar modelos de funcionamento celular e organelas', 'H16 - Relacionar propriedades de membranas e transporte celular à saúde e homeostase'],
    tiposProblema: ['Comportamento de hemácias ou células vegetais em meios com diferentes tonicidades', 'Ação de toxinas ou antibióticos que inibem a cadeia respiratória ou síntese proteica', 'Rota de secreção de proteínas em células glandulares (Retículo → Golgi → Vesículas)', 'Produção de lactato em esforço muscular vigoroso'],
    errosComuns: [
      'Confundir difusão (movimento do soluto) com osmose (movimento do solvente)',
      'Achar que osmose gasta energia na forma de ATP',
      'Confundir as funções do retículo rugoso com o liso',
      'Achar que células vegetais não realizam respiração celular celular (apenas fotossíntese)',
      'Confundir divisão celular equacional (mitose) com reducional (meiose)'
    ],
    criteriosDominio: {
      naoSei: 'Desconhece a função das organelas básicas e o funcionamento celular.',
      basico: 'Memorizou nomes de organelas mas erra transporte de membrana e tonicidade.',
      emDesenvolvimento: 'Compreende osmose e organelas mas falha em bioenergética ou divisão celular.',
      dominado: 'Integra fisiologia de organelas, bloqueios metabólicos e homeostase com perfeição.'
    }
  },

  historia_brasil: {
    nome: 'História do Brasil (Colônia, Império e República)',
    materia: 'História',
    area: 'humanas',
    conceitosFundamentais: [
      'Brasil Colônia: plantation açucareira, pacto colonial, escravidão e ciclo do ouro',
      'Independência e Primeiro Reinado: autoritarismo e Constituição de 1824',
      'Segundo Reinado: economia cafeeira, Guerra do Paraguai, imigração e crise escravista',
      'República Oligárquica: coronelismo, voto de cabresto e revoltas sociais',
      'Era Vargas: Revolução de 1930, legislação trabalhista, corporativismo e Estado Novo',
      'Ditadura Militar (1964-1985): repressão, censura e movimentos de resistência',
      'Redemocratização e Constituição Cidadã de 1988'
    ],
    preRequisitos: ['Noções de cronologia histórica', 'Conceitos de cidadania, autoritarismo e democracia'],
    habilidadesEnem: ['H1 - Interpretar fontes históricas, documentos e iconografia', 'H2 - Analisar a formação e as lutas sociais no Brasil', 'H4 - Comparar processos políticos na construção da cidadania e dos direitos humanos'],
    tiposProblema: ['Interpretação de discursos políticos e cartazes de época da Era Vargas ou Ditadura', 'Análise das permanências da estrutura fundiária colonial no Brasil contemporâneo', 'Papel da imprensa e das manifestações populares na conquista de direitos trabalhistas', 'Efeitos socioeconômicos da Lei de Terras de 1850 sobre ex-escravizados e imigrantes'],
    errosComuns: [
      'Achar que a abolição em 1888 garantiu integração social ou distribuição de terras',
      'Considerar a Era Vargas uma democracia plena no período de 1937-1945',
      'Ignorar a resistência ativa das populações escravizadas e povos indígenas',
      'Confundir o coronelismo da República Velha com partidos políticos modernos'
    ],
    criteriosDominio: {
      naoSei: 'Desconhece os principais períodos e marcos da história brasileira.',
      basico: 'Lembra datas e nomes mas não relaciona com processos estruturais e sociais.',
      emDesenvolvimento: 'Compreende os períodos históricos mas falha na interpretação crítica de fontes.',
      dominado: 'Analisa criticamente fontes documentais, tensões sociais e continuidades da cidadania.'
    }
  },

  geografia_geral_brasil: {
    nome: 'Geografia Ambiental, Agrária, Urbana e Geopolítica',
    materia: 'Geografia',
    area: 'humanas',
    conceitosFundamentais: [
      'Domínios morfoclimáticos e biomas brasileiros (Cerrado, Amazônia, Caatinga, etc.)',
      'Impactos ambientais: desmatamento, erosão, eutrofização e mudanças climáticas',
      'Estrutura fundiária brasileira: agronegócio de exportação vs agricultura familiar',
      'Urbanização brasileira: metropolização, segregação socioespacial e mobilidade',
      'Industrialização, dinâmica regional e matriz energética',
      'Geopolítica e inserção do Brasil no comércio global'
    ],
    preRequisitos: ['Leitura de mapas e gráficos socioeconômicos', 'Noções de relevo e clima'],
    habilidadesEnem: ['H6 - Interpretar a dinâmica dos biomas e dos impactos socioambientais', 'H8 - Analisar a produção do espaço agrário e urbano', 'H9 - Avaliar a sustentabilidade de modelos de desenvolvimento e uso de recursos'],
    tiposProblema: ['Avanço da fronteira agrícola sobre o Cerrado e impactos na bacia hidrográfica', 'Fenômenos urbanos: ilhas de calor, inversão térmica e impermeabilização do solo', 'Conflitos fundiários e segurança alimentar no espaço agrário brasileiro', 'Transição da matriz energética para fontes renováveis'],
    errosComuns: [
      'Confundir inversão térmica com aquecimento global ou efeito estufa',
      'Achar que a agricultura familiar ocupa a maior parte das terras no Brasil',
      'Confundir conceito de bioma com domínio morfoclimático',
      'Desconsiderar os impactos socioambientais de grandes obras energéticas e viárias'
    ],
    criteriosDominio: {
      naoSei: 'Não localiza os principais biomas nem entende dinâmicas espaciais básicas.',
      basico: 'Sabe localizar biomas mas não relaciona com dinâmica agrária ou hídrica.',
      emDesenvolvimento: 'Compreende problemas ambientais mas oscila em dinâmica agrária e urbanização.',
      dominado: 'Articula meio ambiente, geopolítica, espaço agrário e urbano com alta profundidade.'
    }
  },

  filosofia_sociologia_base: {
    nome: 'Filosofia e Sociologia: Ética, Política, Cidadania e Cultura',
    materia: 'Filosofia e Sociologia',
    area: 'humanas',
    conceitosFundamentais: [
      'Filosofia Política Clássica: ética e justiça em Platão e Aristóteles',
      'Contratualismo Moderno: Estado de Natureza e Pacto em Hobbes, Locke e Rousseau',
      'Realismo político em Maquiavel e separação de poderes em Montesquieu',
      'Iluminismo, autonomia da razão em Kant e direitos individuais',
      'Teoria Sociológica Clássica: Marx (alienação, luta de classes), Durkheim (fato social, anomia) e Weber (ação social)',
      'Escola de Frankfurt: Indústria Cultural, mercantilização da arte e consumo de massa',
      'Antropologia: Cultura, Etnocentrismo vs Relativismo Cultural',
      'Cidadania, Direitos Humanos e Movimentos Sociais contemporâneos'
    ],
    preRequisitos: ['Leitura crítica de textos ensaísticos e filosóficos', 'Compreensão de vocabulário abstrato e conceitual'],
    habilidadesEnem: ['H23 - Analisar a importância da ética e da justiça nas instituições sociais', 'H24 - Relacionar cidadania, direitos humanos e participação democrática', 'H25 - Identificar manifestações culturais e combater visões etnocêntricas'],
    tiposProblema: ['Contraste entre a visão de homem de Hobbes (homem lobo do homem) e Rousseau (bom selvagem)', 'Crítica à padronização dos produtos culturais pelas redes sociais digitais', 'Dilemas éticos contemporâneos sobre liberdade de expressão e bem comum', 'Interpretação da anomia e solidariedade social em momentos de crise institucional'],
    errosComuns: [
      'Confundir o pessimismo antropológico de Hobbes com a vontade geral de Rousseau',
      'Achar que Maquiavel fazia apologia à maldade gratuita (em vez de estabilidade do Estado)',
      'Confundir etnocentrismo (julgar o outro pelo próprio padrão) com relativismo cultural',
      'Tratar o fato social de Durkheim como decisão individual isolada'
    ],
    criteriosDominio: {
      naoSei: 'Não distingue conceitos elementares como ética, moral e cidadania.',
      basico: 'Lembra nomes de filósofos e clichês mas não aplica aos textos motivadores.',
      emDesenvolvimento: 'Interpreta textos filosóficos mas se confunde ao contrastar contratualistas ou teorias sociológicas.',
      dominado: 'Aplica teorias filosóficas e sociológicas a problemas contemporâneos com rigor crítico.'
    }
  },

  linguagens_portugues: {
    nome: 'Português, Gêneros Textuais e Literatura',
    materia: 'Português e Literatura',
    area: 'linguagens',
    conceitosFundamentais: [
      'Funções da linguagem de Jakobson (emotiva, apelativa, referencial, fática, metalinguística, poética)',
      'Variação linguística (regional, social, estilística e histórica) e combate ao preconceito',
      'Gêneros e tipologias textuais (notícia, crônica, meme, anúncio, editorial, charge)',
      'Recursos expressivos e figuras de linguagem (metáfora, metonímia, ironia, antítese, paradoxo)',
      'Coesão e coerência textual (operadores argumentativos, anáfora e catáfora)',
      'Estratégias argumentativas e marcas de autoria',
      'Literatura Brasileira: Barroco, Romantismo, Realismo machadiano, Modernismo (1922, 1930, 1945) e contemporâneos'
    ],
    preRequisitos: ['Leitura atenta e inferência de implícitos', 'Reconhecimento da intencionalidade comunicativa'],
    habilidadesEnem: ['H15 - Identificar as funções da linguagem em diferentes suportes', 'H16 - Analisar a linguagem como fenômeno social e combater o preconceito linguístico', 'H18 - Estabelecer relações entre a produção literária e seu contexto sócio-histórico', 'H19 - Analisar recursos expressivos e estratégias de persuasão'],
    tiposProblema: ['Identificação da função predominante em campanhas educativas de saúde pública', 'Reconhecimento da legitimidade de variantes linguísticas populares em poemas e canções', 'Análise da ironia machadiana e crítica à hipocrisia burguesa do século XIX', 'Efeito de sentido criado pela quebra de expectativa em tirinhas e charges'],
    errosComuns: [
      'Classificar variedades linguísticas informais como "erros gramaticais"',
      'Confundir função conativa/apelativa (foco no interlocutor) com emotiva (foco no emissor)',
      'Confundir antítese (oposição de palavras) com paradoxo (ideias ilógicas/inconciliáveis)',
      'Interpretar literalmente figuras de linguagem ou ironias'
    ],
    criteriosDominio: {
      naoSei: 'Não infere informações implícitas nem reconhece funções básicas da linguagem.',
      basico: 'Localiza dados explícitos mas erra variação linguística e ironias.',
      emDesenvolvimento: 'Domina gêneros textuais e funções mas oscila em interpretação literária aprofundada.',
      dominado: 'Lê com primor intencionalidades discursivas, ironias machadianas e estratégias argumentativas.'
    }
  },

  redacao_enem: {
    nome: 'Estrutura Dissertativo-Argumentativa e 5 Competências',
    materia: 'Redação ENEM',
    area: 'redacao',
    conceitosFundamentais: [
      'Estrutura dissertativo-argumentativa em 4 parágrafos (Introdução, D1, D2, Conclusão)',
      'Projeto de texto estratégico e circuito argumentativo em defesa da tese',
      'Competência 1: Domínio da norma-padrão (concordância, regência, crase, pontuação, paralelismo sintático)',
      'Competência 2: Compreensão da proposta temática, não tangenciamento e repertório legitimado/produtivo',
      'Competência 3: Seleção, relação, organização e interpretação crítica em defesa da tese',
      'Competência 4: Coesão inter e intraparágrafos, repertório de conectivos e ausência de repetições',
      'Competência 5: Proposta de intervenção completa com os 5 elementos (Agente, Ação, Modo/Meio, Efeito/Finalidade e Detalhamento)'
    ],
    preRequisitos: ['Capacidade de leitura crítica da coletânea de textos motivadores', 'Repertório interdisciplinar'],
    habilidadesEnem: ['Produzir texto dissertativo-argumentativo com projeto articulado e proposta de intervenção cidadã'],
    tiposProblema: ['Identificação de falhas no projeto de texto (argumentos expositivos sem tese)', 'Análise da pertinência e produtividade de repertórios socioculturais', 'Identificação dos 5 elementos da proposta de intervenção na Competência 5', 'Correção de desvios gramaticais e truncamento de períodos', 'Prevenção ao tangenciamento temático em recortes complexos'],
    errosComuns: [
      'Tangenciar o tema abordando apenas o assunto geral e ignorando o recorte específico',
      'Usar repertório sociocultural genérico sem vínculo produtivo com o argumento',
      'Apresentar proposta de intervenção sem detalhamento ou com agente genérico ("o governo", "as pessoas")',
      'Criar parágrafos puramente expositivos sem tomada de posição explícita (sem marcas de autoria)'
    ],
    criteriosDominio: {
      naoSei: 'Desconhece a estrutura dissertativa e a divisão de competências do ENEM.',
      basico: 'Segue modelo esquelético mas tangencia temas ou cria propostas incompletas.',
      emDesenvolvimento: 'Escreve bons textos mas perde pontos em coesão, paralelismo ou no detalhamento da C5.',
      dominado: 'Domina projeto de texto autoral, repertório produtivo e proposta nota 200 na C5.'
    }
  }
};

/* ══════════════════════════════════════════════════════════════════════════
   OBJETO PRINCIPAL: aiService
   ══════════════════════════════════════════════════════════════════════════ */
window.aiService = {
  chatHistory: [],
  activeContext: '',
  taxonomy: COMPETENCY_TAXONOMY,

  getApiKey() {
    // 1. Prioridade máxima: chave salva no perfil ativo
    const profKey = window.storageService?.getActiveProfile?.()?.apiKey?.trim();
    if (profKey && profKey !== 'SUA_CHAVE_AQUI') return profKey;

    // 2. Chave salva pelo usuário no localStorage
    const fromLocal = (localStorage.getItem('enem_gemini_api_key') || '').trim();
    if (fromLocal && fromLocal !== 'SUA_CHAVE_AQUI') return fromLocal;

    // 3. Chave salva no CMS
    if (window.storageService?.data?.cms?.geminiApiKey) {
      const fromCms = window.storageService.data.cms.geminiApiKey.trim();
      if (fromCms && fromCms !== 'SUA_CHAVE_AQUI') return fromCms;
    }

    // 4. Chave configurada no topo do arquivo ai-service.js
    if (typeof GEMINI_API_KEY === 'string' && GEMINI_API_KEY.trim() && GEMINI_API_KEY.trim() !== 'SUA_CHAVE_AQUI') {
      return GEMINI_API_KEY.trim();
    }

    return '';
  },

  setApiKey(key) {
    const cleaned = (key || '').trim();
    localStorage.setItem('enem_gemini_api_key', cleaned);
    const prof = window.storageService?.getActiveProfile?.();
    if (prof) {
      prof.apiKey = cleaned;
    }
    if (window.storageService?.data?.cms) {
      window.storageService.data.cms.geminiApiKey = cleaned;
      window.storageService.save();
    }
  },

  hasApiKey() {
    return Boolean(this.getApiKey());
  },

  setContext(ctx) {
    this.activeContext = ctx || '';
  },

  clearHistory() {
    this.chatHistory = [];
  },

  /**
   * Obtém o perfil de competências de um módulo (busca no mapa ou sintetiza dinamicamente).
   */
  getCompetencyProfileForModule(mod) {
    if (!mod) return null;
    let baseProf = MODULE_COMPETENCIES_MAP[mod.id] ? JSON.parse(JSON.stringify(MODULE_COMPETENCIES_MAP[mod.id])) : null;

    // Extrai blocos e tópicos do módulo real (inclui novos blocos criados no CMS):
    const dynamicTopics = [];
    (mod.blocos || []).forEach(b => {
      if (b.titulo && b.titulo.trim()) dynamicTopics.push(b.titulo.trim());
      (b.habilidades || []).forEach(h => {
        if (h.nome && h.nome.trim()) dynamicTopics.push(h.nome.trim());
      });
    });

    if (baseProf) {
      // Incorpora novos blocos/tópicos criados no modo de edição do CMS aos conceitos fundamentais:
      dynamicTopics.forEach(dt => {
        if (!baseProf.conceitosFundamentais.some(c => c.toLowerCase() === dt.toLowerCase())) {
          baseProf.conceitosFundamentais.push(dt);
        }
      });
      return baseProf;
    }

    // Síntese dinâmica para novos módulos ou matérias criados no CMS:
    return {
      nome: mod.assunto || 'Módulo Geral',
      materia: mod.materia || 'Matéria',
      area: mod.enemAreaId || 'geral',
      conceitosFundamentais: dynamicTopics.length > 0 ? dynamicTopics : ['Fundamentos essenciais', 'Aplicações práticas', 'Raciocínio integrado'],
      preRequisitos: ['Interpretação de situações-problema do ENEM', 'Conhecimentos básicos de ensino médio'],
      habilidadesEnem: [`Compreensão e resolução de problemas práticos de ${mod.assunto || 'conteúdo'}`],
      tiposProblema: [`Situações-problema cotidianas de ${mod.assunto || 'conteúdo'}`],
      errosComuns: ['Interpretação apressada do enunciado', 'Confusão com conceitos adjacentes'],
      criteriosDominio: {
        naoSei: `Ausência de conhecimento sobre ${mod.assunto}.`,
        basico: `Compreensão inicial e fragmentada de ${mod.assunto}.`,
        emDesenvolvimento: `Compreende conceitos de ${mod.assunto}, com oscilações em distratores.`,
        dominado: `Domínio consistente em ${mod.assunto} na matriz de referência do ENEM.`
      }
    };
  },

  /**
   * Envia uma mensagem para o Gemini e retorna a resposta de texto no Tutor IA.
   */
  async sendMessage(userMessage, optionalContext = '') {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error(
        'Chave de API não configurada!\n\n' +
        'Cole sua chave do Google Gemini no arquivo "ai-service.js" (na linha "const GEMINI_API_KEY = ...") ' +
        'ou insira pelo Menu ☰ > Configurações da IA.'
      );
    }

    const contextToUse = optionalContext || this.activeContext || '';
    let finalPrompt = userMessage.trim();
    if (contextToUse && this.chatHistory.length === 0) {
      finalPrompt = `[CONTEXTO DO ESTUDO / TELA ATUAL]\n${contextToUse}\n\n[MENSAGEM DA ESTUDANTE]\n${finalPrompt}`;
    }

    this.chatHistory.push({ role: 'user', text: userMessage.trim() });

    const contentsPayload = this.chatHistory.map(item => ({
      role: item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.text }]
    }));

    if (contextToUse && contentsPayload.length > 0 && !contentsPayload[0].parts[0].text.startsWith('[CONTEXTO DO ESTUDO')) {
      contentsPayload[0].parts[0].text = `[CONTEXTO DO ESTUDO / TELA ATUAL]\n${contextToUse}\n\n[MENSAGEM DA ESTUDANTE]\n${contentsPayload[0].parts[0].text}`;
    }

    const bodyPayload = {
      system_instruction: { parts: [{ text: DEFAULT_SYSTEM_INSTRUCTION }] },
      contents: contentsPayload,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
    };

    let lastError = null;
    for (const model of GEMINI_MODELS) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });

        if (response.ok) {
          const data = await response.json();
          const parts = data?.candidates?.[0]?.content?.parts || [];
          let replyText = '';
          for (const p of parts) {
            if (p.text && !p.thought) replyText += p.text;
          }
          if (!replyText && parts.length > 0 && parts[0].text) replyText = parts[0].text;

          if (replyText) {
            this.chatHistory.push({ role: 'model', text: replyText });
            return replyText;
          }
        } else {
          const errJson = await response.json().catch(() => null);
          const apiMsg = errJson?.error?.message || `Erro HTTP ${response.status}`;
          lastError = new Error(apiMsg);
          if ((response.status === 400 || response.status === 401 || response.status === 403) && (apiMsg.toLowerCase().includes('api key') || apiMsg.toLowerCase().includes('permission') || apiMsg.toLowerCase().includes('unregistered') || apiMsg.toLowerCase().includes('invalid'))) {
            this.chatHistory.pop();
            throw new Error('Chave da API Gemini não autorizada ou inválida (erro ' + response.status + ').\n\n' +
              'Dica: Chaves oficiais gratuitas do Google AI Studio começam obrigatoriamente com "AIzaSy...".\n' +
              'Gere sua chave gratuita em https://aistudio.google.com/app/apikey e cole no perfil.');
          }
          continue;
        }
      } catch (err) {
        if (err.message && (err.message.includes('Chave da API Gemini') || err.message.includes('AIzaSy'))) throw err;
        lastError = err;
        continue;
      }
    }

    this.chatHistory.pop();
    throw new Error(lastError?.message || 'Falha temporária ao comunicar com a IA do Google. Tente novamente em instantes.');
  },

  /* ══════════════════════════════════════════════════════════════════════════
     NOVO MOTOR DIAGNÓSTICO ADAPTATIVO (PASSO A PASSO, 1 QUESTÃO POR VEZ)
     ══════════════════════════════════════════════════════════════════════════ */

  /**
   * Gera a PRÓXIMA questão adaptativa para a sessão, calibrada pelo histórico
   * e pelas habilidades que ainda precisam de evidência.
   */
  async generateAdaptiveQuestion({ session, mod, prevHistory = [], targetSkill = null, difficulty = 'medio' }) {
    const apiKey = this.getApiKey();
    const prof = this.getCompetencyProfileForModule(mod);
    const qNum = (prevHistory.length || 0) + 1;

    const historySummary = prevHistory.map((h, i) => {
      const q = h.question;
      const a = h.answer;
      const inv = h.investigation;
      return `[Questão ${i + 1} - Pilar: ${q.pilar}]
Enunciado: "${q.enunciado}"
Resposta do Aluno: [${a.userChoice}] (${a.isCorrect ? 'ACERTOU' : 'ERROU'}) | Certeza: "${a.userConfidence}"
Comentário do Aluno: "${a.userReasoning || '(sem comentário)'}"
${inv?.concluded ? `Investigação Conversacional: Pergunta: "${inv.question}" -> Resposta Aluno: "${inv.answer}" -> Causa Confirmada: ${inv.confirmedCause || 'Geral'}` : ''}`;
    }).join('\n\n');

    const prompt = `Você é um examinador pedagógico sênior especialista na Matriz do ENEM.
Você está conduzindo um DIAGNÓSTICO ADAPTATIVO VIVO (passo a passo) para o estudante sobre:
Matéria: ${mod.materia}
Assunto: ${mod.assunto}
Pilares/Conceitos mapeados no módulo: ${(prof.conceitosFundamentais || []).join('; ')}
Erros e distratores mais comuns: ${(prof.errosComuns || []).join('; ')}

HISTÓRICO ATÉ AQUI (QUESTÕES JÁ RESPONDIDAS NESTA SESSÃO):
${historySummary || '(Nenhuma questão respondida ainda. Esta será a Questão 1)'}

SUA MISSÃO PARA A QUESTÃO ${qNum}:
1. QUESTÃO CURTA, DIRETA E CONCEITUAL (1 A 2 MINUTOS):
   - A questão diagnóstica DEVE SER CONCISA E RÁPIDA (tempo estimado de leitura e resposta de 1 a 2 minutos).
   - Enunciado enxuto (4 a 7 linhas no máximo), contextualizado no estilo ENEM (tecnologia, saúde, meio ambiente, trânsito ou cotidiano), direto ao ponto.
   - NUNCA gere textos labirínticos gigantescos nem contas algébricas longas e exaustivas (questões de cálculo pesado pertencem a simulados gerais de exercícios). O foco absoluto do diagnóstico é aferir o CONCEITO e o RACIOCÍNIO com precisão e rapidez.
2. CALIBRAÇÃO ADAPTATIVA PELO HISTÓRICO:
   - Se é a Questão 1: Foque no conceito basilar / fundamento central do conteúdo (dificuldade média).
   - Se o aluno acertou a anterior com segurança: Aumente ligeiramente a sofisticação ou teste uma aplicação integrada / distrator sutil para verificar se há domínio consistente.
   - Se o aluno errou a anterior ou demonstrou dúvida: Teste um conceito basilar adjacente ou pré-requisito essencial (questão mais simples e direta) para mapear se falta base (🔴) ou se é conhecimento inicial (🟠).
3. RIGOR ENEM: PROIBIDO terminantemente clichês simplórios ou infantis (nada de moedas/dados para probabilidade; nada de perguntas puramente mnemônicas de decoreba).
4. FORMATO: 4 alternativas: A, B, C, D (1 correta e 3 distratores inteligentes baseados nos erros conceituais e interpretativos mapeados).

REGRAS ESTRITAS DE NOTAÇÃO MATEMÁTICA E CIENTÍFICA (OBRIGATÓRIO):
- NUNCA use barras invertidas de comandos LaTeX como \\times, \\frac, \\text, \\cdot, \\Delta, etc., pois em strings JSON barras invertidas sofrem corrupção (ex: \\times vira tabulação + imes).
- Use sempre símbolos Unicode limpos e notação direta legível em texto puro:
  • Multiplicação: use o caractere '×' com espaços (ex: '3 × 10⁸ m/s' ou '2,0 × 10⁸ m/s').
  • Potências: use sobrescrito Unicode (10⁸, 10⁵, 2⁴) ou circunflexo (10^8, 2^4). NUNCA quebre potências em linhas separadas.
  • Frações: use formato simples em linha (ex: 2/3, 1/2, a/b).
  • Símbolos: use diretamente caracteres Unicode: √, λ, θ, Δ, Ω, μ, °, %, ±, ≥, ≤, ≠, ·.
  • Unidades: escreva o texto da unidade diretamente sem \\text (ex: m/s, km/h, J, W, Hz).

Retorne EXCLUSIVAMENTE um JSON puro no formato:
{
  "numero": ${qNum},
  "pilar": "Nome curto da competência ou pilar testado",
  "dificuldade": "${difficulty}",
  "enunciado": "Texto conciso e contextualizado da questão...",
  "alternativas": {
    "A": "Texto da alternativa A...",
    "B": "Texto da alternativa B...",
    "C": "Texto da alternativa C...",
    "D": "Texto da alternativa D..."
  },
  "correta": "A",
  "conceitoTestado": "Conceito exato avaliado nesta questão",
  "explicacao": "Resolução didática passo a passo e macete para o ENEM."
}`;

    if (apiKey) {
      for (const model of GEMINI_MODELS) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        try {
          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: 'Você é um examinador pedagógico especialista do ENEM. Responda exclusivamente em JSON válido puro em Português do Brasil.' }] },
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.5, maxOutputTokens: 1600, responseMimeType: 'application/json' }
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];
            let raw = '';
            for (const p of parts) { if (p.text && !p.thought) raw += p.text; }
            if (!raw && parts[0]?.text) raw = parts[0].text;
            const parsed = extractJson(raw);
            if (parsed && parsed.enunciado && parsed.alternativas && parsed.correta) {
              return {
                numero: qNum,
                pilar: parsed.pilar || `Pilar ${qNum}`,
                dificuldade: parsed.dificuldade || difficulty,
                enunciado: parsed.enunciado,
                alternativas: parsed.alternativas,
                correta: parsed.correta,
                conceitoTestado: parsed.conceitoTestado || mod.assunto,
                explicacao: parsed.explicacao || ''
              };
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Fallback Local Seguro (usando o cadastro real do módulo se a API falhar):
    return this.getLocalFallbackQuestion(mod, qNum, prof);
  },

  /**
   * Avalia a resposta dada pelo aluno a uma questão e DECIDE se é necessário
   * iniciar uma INVESTIGAÇÃO CONVERSACIONAL antes de prosseguir.
   */
  async evaluateAdaptiveStep({ session, mod, question, userChoice, userConfidence, userReasoning }) {
    const isCorrect = userChoice === question.correta;
    const isDoubt = userConfidence === 'duvida';
    const prof = this.getCompetencyProfileForModule(mod);
    const apiKey = this.getApiKey();

    // Se o aluno acertou E declarou certeza E deu uma explicação coerente, não há ambiguidade:
    if (isCorrect && !isDoubt && userReasoning && userReasoning.trim().length > 15) {
      return {
        needsInvestigation: false,
        isCorrect: true,
        evidencia: 'Acerto consistente com raciocínio declarado seguro.',
        motivo: 'O raciocínio e a escolha comprovam domínio seguro deste ponto.'
      };
    }

    // Se errou OU teve dúvida OU acertou no chute/sem justificativa, chamamos a IA para avaliar
    // se precisa de investigação conversacional imediata:
    const prompt = `Você é a "Professora IA", mentora do ENEM.
A estudante acabou de responder a uma questão diagnóstica sobre "${mod.assunto}" (${mod.materia}).
Pilar avaliado: "${question.pilar}"
Conceito: "${question.conceitoTestado}"
Enunciado: "${question.enunciado}"
Gabarito Oficial: [${question.correta}]
Alternativa marcada pela aluna: [${userChoice}] (${isCorrect ? 'ACERTOU' : 'ERROU'})
Nível de certeza declarado: "${userConfidence === 'certeza' ? 'Tenho certeza' : 'Estou em dúvida / Chutei'}"
Comentário / Raciocínio escrito pela aluna: "${userReasoning || '(não escreveu nada)'}"

SUA MISSÃO PEDAGÓGICA:
Avalie se a causa da resposta (seja erro, dúvida ou acerto sem explicação) é ambígua e precisa ser INVESTIGADA CONVERSALMENTE com a aluna antes de prosseguir:
As causas de erro/dúvida a distinguir são:
- CONCEITUAL: Desconhecimento do conceito basilar.
- INTERPRETACAO: Dificuldade no texto-base, distrator contextual ou não entendeu o comando.
- GRANDEZAS_E_UNIDADES: Confusão em unidades (km/h vs m/s) ou variáveis.
- MODELAGEM_OU_PROCEDIMENTO: Escolheu a fórmula ou modelo inadequado.
- CALCULO_OU_ALGEBRA: Entendeu o conceito mas errou nas contas.
- PRE_REQUISITO_AUSENTE: Falta de base prévia.
- ATENCAO_OU_ESQUECIMENTO: Lapso pontual momentâneo.

SE HOUVER AMBIGUIDADE (ou se ela errou e você precisa saber onde ela travou):
Retorne "needsInvestigation": true, com uma pergunta investigativa conversacional acolhedora (em pt-BR), empática e direta, com 2 a 3 "opcoesRapidas" sugeridas.

SE A CAUSA JÁ FOR EVIDENTE pelo comentário da aluna:
Retorne "needsInvestigation": false, com a "causaIdentificada" e "evidencia".

Retorne EXCLUSIVAMENTE em JSON puro:
{
  "needsInvestigation": true | false,
  "perguntaInvestigativa": "Texto da pergunta acolhedora para a aluna...",
  "opcoesRapidas": ["Opção 1...", "Opção 2...", "Opção 3..."],
  "hipoteses": ["INTERPRETACAO", "CONCEITUAL", "CALCULO_OU_ALGEBRA"],
  "causaIdentificada": "CONCEITUAL" | "INTERPRETACAO" | null,
  "evidencia": "Resumo da evidência colhida"
}`;

    if (apiKey) {
      for (const model of GEMINI_MODELS) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        try {
          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: 'Você é a Professora IA realizando uma sondagem investigativa de erros para o ENEM. Responda exclusivamente em JSON válido puro em Português do Brasil.' }] },
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 1000, responseMimeType: 'application/json' }
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];
            let raw = '';
            for (const p of parts) { if (p.text && !p.thought) raw += p.text; }
            if (!raw && parts[0]?.text) raw = parts[0].text;
            const parsed = extractJson(raw);
            if (parsed && typeof parsed.needsInvestigation === 'boolean') {
              return {
                needsInvestigation: parsed.needsInvestigation,
                isCorrect,
                perguntaInvestigativa: parsed.perguntaInvestigativa || 'Pode me contar um pouco mais sobre como você pensou nesta questão?',
                opcoesRapidas: parsed.opcoesRapidas || ['Fiquei em dúvida na interpretação', 'Confundi os conceitos', 'Travei nas contas'],
                hipoteses: parsed.hipoteses || ['CONCEITUAL', 'INTERPRETACAO'],
                causaIdentificada: parsed.causaIdentificada || (isCorrect ? null : 'CONCEITUAL'),
                evidencia: parsed.evidencia || (isCorrect ? 'Acerto registrado.' : 'Erro registrado.')
              };
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Heurística local de fallback:
    if (!isCorrect || isDoubt) {
      return {
        needsInvestigation: true,
        isCorrect,
        perguntaInvestigativa: `Percebi que você marcou a alternativa [${userChoice}]. Você chegou a considerar a alternativa [${question.correta}] ou a sua dúvida foi na interpretação do que a questão pediu?`,
        opcoesRapidas: [
          'Fiquei em dúvida na interpretação do texto',
          'Entendi o conceito, mas me confundi na fórmula/cálculo',
          'Não me lembrava bem da teoria deste tópico'
        ],
        hipoteses: ['INTERPRETACAO', 'CONCEITUAL', 'CALCULO_OU_ALGEBRA'],
        causaIdentificada: null,
        evidencia: isCorrect ? 'Acerto com dúvida declarada.' : 'Erro em pilar essencial.'
      };
    }

    return {
      needsInvestigation: false,
      isCorrect: true,
      evidencia: 'Acerto registrado com segurança.',
      motivo: 'Resposta correta com nível de certeza confirmado.'
    };
  },

  /**
   * Analisa a resposta dada pela aluna durante a INVESTIGAÇÃO CONVERSACIONAL
   * e extrai a causa confirmada e a evidência para o relatório.
   */
  async analyzeInvestigationResponse({ session, question, studentAnswer, hipoteses = [] }) {
    const apiKey = this.getApiKey();
    const prompt = `Você é a Professora IA do ENEM.
A aluna respondeu à sua pergunta investigativa sobre uma questão de "${question.pilar}".
Enunciado da questão: "${question.enunciado}"
Gabarito oficial: [${question.correta}]
Resposta investigativa da aluna: "${studentAnswer}"
Hipóteses iniciais consideradas: ${hipoteses.join(', ')}

Sua tarefa:
1. Identifique qual foi a causa real/confirmada do erro ou da dúvida da aluna:
   - "CONCEITUAL" (desconhecimento da teoria)
   - "INTERPRETACAO" (texto-base, distrator ou comando da questão)
   - "GRANDEZAS_E_UNIDADES" (conversões)
   - "MODELAGEM_OU_PROCEDIMENTO" (fórmula errada)
   - "CALCULO_OU_ALGEBRA" (contas)
   - "PRE_REQUISITO_AUSENTE" (falta de base)
   - "ATENCAO_OU_ESQUECIMENTO" (deslize momentâneo)
   - "INCONCLUSIVO" (se ela respondeu algo vago que não permitiu esclarecer com certeza)
2. Escreva uma breve síntese empática do que você aprendeu com a resposta dela (para citar no relatório).

Retorne em JSON puro:
{
  "causaConfirmada": "INTERPRETACAO" | "CONCEITUAL" | "CALCULO_OU_ALGEBRA" | "MODELAGEM_OU_PROCEDIMENTO" | "GRANDEZAS_E_UNIDADES" | "PRE_REQUISITO_AUSENTE" | "ATENCAO_OU_ESQUECIMENTO" | "INCONCLUSIVO",
  "tipoCausa": "CONFIRMADA" | "HIPOTESE",
  "resumoPedagogico": "Síntese da linha de pensamento da aluna...",
  "preRequisitoAfetado": "Nome do pré-requisito se houver lacuna, ou null"
}`;

    if (apiKey) {
      for (const model of GEMINI_MODELS) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        try {
          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: 'Você é a Professora IA. Responda exclusivamente em JSON válido puro em Português do Brasil.' }] },
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.3, maxOutputTokens: 600, responseMimeType: 'application/json' }
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];
            let raw = '';
            for (const p of parts) { if (p.text && !p.thought) raw += p.text; }
            if (!raw && parts[0]?.text) raw = parts[0].text;
            const parsed = extractJson(raw);
            if (parsed && parsed.causaConfirmada) {
              return parsed;
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Heurística local de fallback:
    const lower = (studentAnswer || '').toLowerCase();
    let causa = 'CONCEITUAL';
    if (lower.includes('interpreta') || lower.includes('enunciado') || lower.includes('texto') || lower.includes('comando')) {
      causa = 'INTERPRETACAO';
    } else if (lower.includes('cálculo') || lower.includes('calculo') || lower.includes('conta') || lower.includes('álgebra')) {
      causa = 'CALCULO_OU_ALGEBRA';
    } else if (lower.includes('fórmula') || lower.includes('formula') || lower.includes('modelo')) {
      causa = 'MODELAGEM_OU_PROCEDIMENTO';
    } else if (lower.includes('unidade') || lower.includes('km/h') || lower.includes('m/s')) {
      causa = 'GRANDEZAS_E_UNIDADES';
    } else if (lower.includes('pressa') || lower.includes('desatenção') || lower.includes('distração')) {
      causa = 'ATENCAO_OU_ESQUECIMENTO';
    }

    return {
      causaConfirmada: causa,
      tipoCausa: 'CONFIRMADA',
      resumoPedagogico: `A estudante indicou que a dificuldade decorreu de ${causa.toLowerCase().replace('_', ' ')}.`,
      preRequisitosAfetados: null
    };
  },

  /**
   * Conclui o diagnóstico e elabora o RELATÓRIO DEFINITIVO DENSO E COMPLETO,
   * com dupla recomendação (trilha pedagógica global + itens reais do site).
   */
  async generateComprehensiveDiagnosticReport({ session, mod, siteCatalogSummary = [] }) {
    const prof = this.getCompetencyProfileForModule(mod);
    const history = session.history || [];
    const apiKey = this.getApiKey();

    const performanceLog = history.map((item, idx) => {
      const q = item.question;
      const a = item.answer;
      const inv = item.investigation;
      return `--- QUESTÃO ${idx + 1} (${q.pilar}) ---
Enunciado: "${q.enunciado}"
Gabarito: [${q.correta}] | Resposta da aluna: [${a.userChoice}] (${a.isCorrect ? 'ACERTOU' : 'ERROU'})
Certeza declarada: "${a.userConfidence}"
Comentário escrito: "${a.userReasoning || '(sem comentário)'}"
${inv?.concluded ? `Investigação Conversacional:
- Pergunta da Professora: "${inv.question}"
- Resposta da Aluna: "${inv.answer}"
- Causa Identificada: ${inv.confirmedCause} (${inv.tipoCausa || 'CONFIRMADA'})` : 'Investigação Conversacional: Não foi necessária (evidência clara).'}`;
    }).join('\n\n');

    // Catálogo real de materiais cadastrados no site para este módulo:
    const siteMaterialsText = (siteCatalogSummary && siteCatalogSummary.length > 0)
      ? siteCatalogSummary.map(s => `- Tópico: "${s.titulo}" | Bloco: "${s.bloco}" | Videoaulas cadastradas: ${s.videos?.map(v => `"${v.titulo}" (${v.duracao || '8 min'})`).join(', ') || 'Nenhuma'} | Resumo: Disponível no site | Questões: ${s.questoesTotal || 0} questões ENEM`).join('\n')
      : 'Materiais disponíveis na Biblioteca do Site';

    const prompt = `Você é a "Professora IA", mentora especialista do ENEM.
Elabore o RELATÓRIO DIAGNÓSTICO DEFINITIVO E CIRÚRGICO sobre o desempenho da estudante em:
Módulo: "${mod.assunto}" (${mod.materia})
Competências Mapeadas do Módulo:
- Conceitos fundamentais: ${(prof.conceitosFundamentais || []).join('; ')}
- Pré-requisitos essenciais: ${(prof.preRequisitos || []).join('; ')}
- Critérios de domínio: 🔴 Não sei | 🟠 Básico | 🟡 Em desenvolvimento | 🟢 Dominado

HISTÓRICO COMPLETO DA SESSÃO COM QUESTÕES, COMENTÁRIOS E INVESTIGAÇÃO CONVERSACIONAL:
${performanceLog}

MATERIAIS E VÍDEOS QUE REALMENTE EXISTEM CADASTRADOS NO SITE PARA ESTE MÓDULO:
${siteMaterialsText}

DIRETRIZES FUNDAMENTAIS DO RELATÓRIO (RIGOR E ZERO SUPERFICIALIDADE):
1. NÍVEL DE DOMÍNIO GLOBAL (Escolha com justiça baseando-se nas evidências):
   - "DOMINADO": Apenas se demonstrou consistência segura em múltiplos contextos com raciocínio firme (NUNCA com base em acerto isolado ou chute).
   - "EM_DESENVOLVIMENTO": Boa compreensão básica, mas com oscilações em distratores ou situações complexas.
   - "BASICO": Conhecimentos iniciais e pontuais, mas lacunas conceituais importantes.
   - "NAO_SEI": Desconhecimento dos fundamentos basais ou incapacidade de interpretar os problemas.
2. ANÁLISE DO RACIOCÍNIO E DAS CONVERSAS: Cite trechos literais dos comentários e das falas da aluna na investigação conversacional, valorizando seus acertos e explicando onde a linha de pensamento desviou.
3. CAUSAS DOS ERROS: Diferencie explicitamente "CONFIRMADA" (comprovada na conversa) de "HIPOTESE".
4. MAPA DE HABILIDADES: Para cada habilidade avaliada, atribua o status ("DOMINADO", "EM_DESENVOLVIMENTO", "BASICO", "NAO_SEI", "INCONCLUSIVO" ou "NAO_AVALIADO") com a evidência correspondente.
5. DUPLA RECOMENDAÇÃO:
   - Trilha Pedagógica Global ("O que estudar"): Guia pedagógico completo e aprofundado independente do site (conceitos, leituras e exercícios para dominar o assunto em qualquer fonte).
   - Sugestões da Plataforma ("No nosso Portal"): Recomendações acionáveis mapeadas nos vídeos, resumos e tópicos que REALMENTE constam na lista acima!
6. GABARITO COMENTADO: Resolução detalhada de todas as questões com macete para o ENEM.

Retorne EXCLUSIVAMENTE em JSON puro no formato:
{
  "nivelGlobal": "DOMINADO" | "EM_DESENVOLVIMENTO" | "BASICO" | "NAO_SEI",
  "tituloVeredicto": "Frase síntese pedagógica em pt-BR (ex: 'Base Consistente com Ponto Cego em...')",
  "resumoVeredicto": "Parecer pedagógico denso e acolhedor (4 a 6 linhas bem fundamentadas).",
  "analiseRaciocinio": "Análise aprofundada dos comentários e das respostas investigativas da estudante, citando as palavras dela...",
  "causasErros": [
    {
      "pilar": "Nome do pilar",
      "causa": "Interpretação do Enunciado" | "Conceito / Fundamento" | "Álgebra e Cálculo" | "Escolha de Modelo / Fórmula" | "Grandezas e Unidades" | "Pré-requisito Ausente",
      "tipo": "CONFIRMADA" | "HIPOTESE",
      "detalhe": "Explicação pedagógica da causa do erro..."
    }
  ],
  "mapaHabilidades": [
    {
      "habilidade": "Nome da habilidade",
      "status": "DOMINADO" | "EM_DESENVOLVIMENTO" | "BASICO" | "NAO_SEI" | "INCONCLUSIVO" | "NAO_AVALIADO",
      "evidencia": "Evidência concreta observada nas respostas..."
    }
  ],
  "pontosFortes": [
    "Ponto forte real demonstrado 1...",
    "Ponto forte 2..."
  ],
  "pontosAtencao": [
    "Distrator ou pegadinha a evitar 1...",
    "Ponto cego 2..."
  ],
  "preRequisitosNecessarios": [
    "Pré-requisito que precisa ser reforçado 1..."
  ],
  "habilidadesInconclusivas": [
    "Habilidade que necessita de mais sondagem futura..."
  ],
  "trilhaPedagogicaGlobal": [
    "Passo 1 completo de estudo independente...",
    "Passo 2..."
  ],
  "sugestoesDoSite": [
    {
      "topicoTitulo": "Nome do tópico existente",
      "blocoTitulo": "Nome do bloco",
      "motivo": "Por que este tópico vai sanar a lacuna detectada...",
      "videoSugerido": "Título da videoaula cadastrada",
      "videoDuracao": "Tempo estimado"
    }
  ],
  "gabaritoComentado": [
    {
      "numero": 1,
      "pilar": "...",
      "correta": "A",
      "userChoice": "B",
      "acertou": false,
      "explicacaoDidatica": "Resolução completa e macete..."
    }
  ]
}`;

    if (apiKey) {
      for (const model of GEMINI_MODELS) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        try {
          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: 'Você é a Professora IA emitindo um relatório diagnóstico denso e completo para o ENEM. Responda exclusivamente em JSON válido puro em Português do Brasil.' }] },
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 3500, responseMimeType: 'application/json' }
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];
            let raw = '';
            for (const p of parts) { if (p.text && !p.thought) raw += p.text; }
            if (!raw && parts[0]?.text) raw = parts[0].text;
            const parsed = extractJson(raw);
            if (parsed && parsed.nivelGlobal && parsed.tituloVeredicto) {
              return parsed;
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Heurística local de fallback robusto:
    return this.getLocalFallbackReport(session, mod, prof, siteCatalogSummary);
  },

  /* ══════════════════════════════════════════════════════════════════════════
     MÉTODOS DE FALLBACK LOCAL (OFFLINE / SEM CHAVE)
     ══════════════════════════════════════════════════════════════════════════ */

  getLocalFallbackQuestion(mod, qNum, prof) {
    const pilar = prof.conceitosFundamentais?.[qNum - 1] || `Pilar ${qNum} de ${mod.assunto}`;
    return {
      numero: qNum,
      pilar,
      dificuldade: qNum === 1 ? 'medio' : qNum === 2 ? 'medio-alto' : 'aprofundado',
      enunciado: `Em uma situação-problema típica do ENEM referente a "${mod.assunto}" (${mod.materia}), um estudo avaliou o impacto do princípio relacionado a "${pilar}". Considerando a matriz de competências do exame, assinale a proposição correta:`,
      alternativas: {
        A: `A compreensão integrada deste princípio permite formular modelos preditivos e interpretar as relações de causa e efeito envolvidas no fenômeno.`,
        B: `Trata-se de uma exceção puramente teórica que não encontra aplicabilidade prática em sistemas reais ou no cotidiano.`,
        C: `Sua manifestação ocorre de maneira invariável e independente das condições do meio ou das variáveis do sistema.`,
        D: `Apenas equações avançadas do ensino superior conseguem descrever este fenômeno qualitativamente no ensino médio.`
      },
      correta: 'A',
      conceitoTestado: pilar,
      explicacao: `A alternativa [A] é a correta pois expressa com rigor a competência do ENEM de aplicar conceitos a fenômenos práticos e situações-problema reais.`
    };
  },

  getLocalFallbackReport(session, mod, prof, siteCatalogSummary) {
    const history = session.history || [];
    let acertos = 0;
    let certezas = 0;
    history.forEach(h => {
      if (h.answer?.isCorrect) acertos++;
      if (h.answer?.userConfidence === 'certeza') certezas++;
    });

    const total = history.length || 1;
    let nivelGlobal = 'BASICO';
    if (acertos === total && certezas >= total - 1) {
      nivelGlobal = 'DOMINADO';
    } else if (acertos >= Math.ceil(total / 2)) {
      nivelGlobal = 'EM_DESENVOLVIMENTO';
    } else if (acertos === 0) {
      nivelGlobal = 'NAO_SEI';
    }

    const titles = {
      DOMINADO: `Domínio Consistente nos Pilares de ${mod.assunto}`,
      EM_DESENVOLVIMENTO: `Compreensão em Desenvolvimento com Necessidade de Refinar Distratores em ${mod.assunto}`,
      BASICO: `Conhecimentos Básicos com Lacunas Conceituais Importantes em ${mod.assunto}`,
      NAO_SEI: `Necessidade de Estudo Estruturado dos Fundamentos de ${mod.assunto}`
    };

    const causas = [];
    history.forEach(h => {
      if (!h.answer?.isCorrect || h.answer?.userConfidence === 'duvida') {
        causas.push({
          pilar: h.question.pilar,
          causa: h.investigation?.confirmedCause || 'Interpretação do Enunciado',
          tipo: h.investigation?.tipoCausa || 'CONFIRMADA',
          detalhe: h.investigation?.answer || 'A aluna declarou hesitação ou oscilou entre alternativas semelhantes.'
        });
      }
    });

    return {
      nivelGlobal,
      tituloVeredicto: titles[nivelGlobal] || `Diagnóstico Pedagógico de ${mod.assunto}`,
      resumoVeredicto: `A estudante concluiu a trilha diagnóstica adaptativa de ${mod.assunto} (${mod.materia}) com ${acertos} acertos em ${total} questões testadas. Foi possível mapear com precisão os pontos fortes consolidados e os distratores que demandam atenção especial.`,
      analiseRaciocinio: history.some(h => h.answer?.userReasoning)
        ? `Seus comentários escritos demonstram raciocínio ativo em ${mod.assunto}. A análise revelou que você presta atenção nas premissas dos enunciados, com necessidade pontual de blindar os distratores clássicos do ENEM.`
        : `Você respondeu com agilidade às questões objetivas. Na próxima sessão, experimente registrar suas linhas de raciocínio no campo de comentários para enriquecer ainda mais o diagnóstico da Professora IA!`,
      causasErros: causas.length > 0 ? causas : [{
        pilar: prof.conceitosFundamentais?.[0] || 'Conceitos Gerais',
        causa: 'Interpretação do Enunciado',
        tipo: 'HIPOTESE',
        detalhe: 'Atenção aos distratores com termos restritivos ("sempre", "apenas") no ENEM.'
      }],
      mapaHabilidades: (prof.conceitosFundamentais || []).slice(0, 5).map((c, idx) => {
        const histItem = history[idx];
        let status = 'NAO_AVALIADO';
        let evidencia = 'Não testado diretamente nesta sessão de triagem.';
        if (histItem) {
          status = histItem.answer?.isCorrect ? (histItem.answer?.userConfidence === 'certeza' ? 'DOMINADO' : 'EM_DESENVOLVIMENTO') : 'BASICO';
          evidencia = histItem.answer?.isCorrect ? 'Resposta correta com justificativa compatível.' : 'Erro em alternativa distratora.';
        }
        return { habilidade: c, status, evidencia };
      }),
      pontosFortes: [
        `Compreensão das situações-problema contextuais de ${mod.assunto}`,
        `Identificação dos comandos centrais das questões avaliadas`
      ],
      pontosAtencao: [
        `Cuidado com distratores de interpretação e termos absolutistas`,
        `Treinar a verificação de unidades e modelos alternativos antes de marcar`
      ],
      preRequisitosNecessarios: (prof.preRequisitos || []).slice(0, 2),
      habilidadesInconclusivas: [],
      trilhaPedagogicaGlobal: [
        `Passo 1: Fazer uma leitura atenta do resumo teórico destacando os princípios basilares de ${mod.assunto}.`,
        `Passo 2: Resolver 5 exercícios do ENEM com foco exclusivo nos distratores para consolidar a fixação.`,
        `Passo 3: Criar um mapa mental relacionando os conceitos a aplicações práticas do dia a dia.`
      ],
      sugestoesDoSite: (siteCatalogSummary || []).slice(0, 3).map(s => ({
        topicoTitulo: s.titulo || mod.assunto,
        blocoTitulo: s.bloco || 'Bloco Essencial',
        motivo: `Contém resumo mastigado e videoaula ideal para sanar a trava conceitual identificada.`,
        videoSugerido: s.videos?.[0]?.titulo || `Videoaula Completa de ${s.titulo || mod.assunto}`,
        videoDuracao: s.videos?.[0]?.duracao || '8 min'
      })),
      gabaritoComentado: history.map((h, idx) => ({
        numero: idx + 1,
        pilar: h.question.pilar,
        correta: h.question.correta,
        userChoice: h.answer?.userChoice || '(Não respondeu)',
        acertou: Boolean(h.answer?.isCorrect),
        explicacaoDidatica: h.question.explicacao || `A alternativa correta é a [${h.question.correta}].`
      }))
    };
  },

  /* ══════════════════════════════════════════════════════════════════════════
     COMPATIBILIDADE RETROATIVA (MANTIDA PARA CHAMADAS LEGADAS)
     ══════════════════════════════════════════════════════════════════════════ */
  async generateDiagnosticQuiz({ materia, assunto, descricao, subtopicos, blocos }) {
    const mod = { materia, assunto, descricao, blocos };
    const q1 = await this.generateAdaptiveQuestion({ session: {}, mod, prevHistory: [], difficulty: 'medio' });
    const q2 = await this.generateAdaptiveQuestion({ session: {}, mod, prevHistory: [{ question: q1, answer: { isCorrect: true, userChoice: q1.correta, userConfidence: 'certeza' } }], difficulty: 'medio-alto' });
    const q3 = await this.generateAdaptiveQuestion({ session: {}, mod, prevHistory: [{ question: q1, answer: { isCorrect: true } }, { question: q2, answer: { isCorrect: true } }], difficulty: 'aprofundado' });
    return [q1, q2, q3];
  },

  async evaluateDiagnosticQuiz({ materia, assunto, questions, answers, interviewQuestion = null, interviewAnswer = null, allowDeepening = true }) {
    const mod = { materia, assunto };
    const session = {
      history: questions.map((q, idx) => ({
        question: q,
        answer: {
          userChoice: answers[idx]?.userChoice,
          userConfidence: answers[idx]?.userConfidence || 'certeza',
          userReasoning: answers[idx]?.userReasoning || '',
          isCorrect: answers[idx]?.userChoice === q.correta
        },
        investigation: interviewAnswer ? {
          question: interviewQuestion,
          answer: interviewAnswer,
          concluded: true,
          confirmedCause: 'Interpretação e Teoria',
          tipoCausa: 'CONFIRMADA'
        } : null
      }))
    };

    if (allowDeepening && !interviewAnswer) {
      const lastQ = questions[questions.length - 1];
      const lastA = answers[answers.length - 1];
      const check = await this.evaluateAdaptiveStep({
        session,
        mod,
        question: lastQ,
        userChoice: lastA?.userChoice,
        userConfidence: lastA?.userConfidence,
        userReasoning: lastA?.userReasoning
      });
      if (check.needsInvestigation) {
        return {
          precisaMaisContexto: true,
          motivo: 'Investigação conversacional necessária para calibrar o diagnóstico sem precipitação.',
          perguntaInvestigativa: check.perguntaInvestigativa,
          opcoesRapidas: check.opcoesRapidas
        };
      }
    }

    const report = await this.generateComprehensiveDiagnosticReport({ session, mod });
    return {
      ...report,
      precisaMaisContexto: false,
      veredicto: report.nivelGlobal === 'DOMINADO' ? 'DOMINADO' : report.nivelGlobal === 'EM_DESENVOLVIMENTO' ? 'REVISAR' : 'ESTUDO_NECESSARIO',
      pilares: (report.mapaHabilidades || []).map(h => ({
        pilar: h.habilidade,
        status: h.status,
        comentario: h.evidencia
      }))
    };
  },

  async generateDiagnosticQuestion({ materia, assunto, topicTitle, focus }) {
    const mod = { materia, assunto, descricao: focus };
    return this.generateAdaptiveQuestion({ session: {}, mod, prevHistory: [], difficulty: 'medio' });
  },

  async evaluateDiagnosticResponse({ question, userChoice, userConfidence, userReasoning, topicTitle, materia }) {
    return this.evaluateAdaptiveStep({
      session: {},
      mod: { materia, assunto: topicTitle },
      question,
      userChoice,
      userConfidence,
      userReasoning
    });
  }
};

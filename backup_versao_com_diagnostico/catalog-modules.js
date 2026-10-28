// catalog-modules.js — Catálogo Completo de Módulos do ENEM + Recursos de Estudo por Tópico/Habilidade
// Módulos:
// 1. Física — Cinética e Mecânica (fisica_cinetica)
// 2. Matemática — Matemática Financeira e Juros Compostos (matematica_financeira)
// 3. Matemática — Probabilidade (matematica_probabilidade)
// 4. Química — Ligações Químicas e Interações (quimica_ligacoes)
// 5. Química — Estequiometria (quimica_estequiometria)

window.EnemCatalogModules = [
  /* ══════════════════════════════════════════════════════════════════════════
     1. FÍSICA — CINÉTICA E MECÂNICA
     ══════════════════════════════════════════════════════════════════════════ */
  {
    id: 'fisica_cinetica',
    materiaId: 'fisica',
    materia: 'Física',
    assuntoId: 'cinetica',
    assunto: 'Cinética e Mecânica',
    icone: '🚀',
    cor: 'blue',
    descricao: 'Diagnóstico completo de Cinemática, Leis de Newton, Atrito, Trabalho, Potência e Conservação da Energia Mecânica com foco nas situações-problema mais recorrentes do ENEM.',
    blocos: [
      {
        id: 'bloco_1',
        ordem: 1,
        titulo: 'Velocidade Média e Movimento Uniforme (MU)',
        tempoEstimado: '6–8 min',
        descricao: 'Conceito de referencial, velocidade escalar média, conversão de unidades (km/h e m/s), função horária do MU e encontros/ultrapassagens.',
        resumo: '### Conceitos Essenciais\n- **Velocidade Escalar Média:** Mede a razão entre o deslocamento escalar ($\\Delta s$) e o intervalo de tempo total ($\\Delta t$), incluindo eventuais paradas:\n  - Fórmula: $v_m = \\frac{\\Delta s}{\\Delta t}$\n- **Conversão de Unidades (Essencial no ENEM):**\n  - De $\\text{m/s}$ para $\\text{km/h}$: multiplica por $3,6$.\n  - De $\\text{km/h}$ para $\\text{m/s}$: divide por $3,6$ (ex: $72\\text{ km/h} = 20\\text{ m/s}$; $108\\text{ km/h} = 30\\text{ m/s}$).\n- **Movimento Retilíneo Uniforme (MRU):** Velocidade escalar constante ($v \\neq 0$) e aceleração nula ($a = 0$). O móvel percorre distâncias iguais em tempos iguais.\n  - Função horária da posição: $s(t) = s_0 + v \\cdot t$\n- **Velocidade Relativa e Ultrapassagens:**\n  - Mesma direção e **sentidos opostos** (aproximação/encontro): $v_{\\text{rel}} = |v_A| + |v_B|$.\n  - Mesma direção e **mesmo sentido** (perseguição/ultrapassagem): $v_{\\text{rel}} = |v_A - v_B|$.\n  - Na ultrapassagem de corpos extensos (como um trem atravessando uma ponte ou túnel), a distância total percorrida é a **soma dos comprimentos**: $\\Delta s = L_{\\text{trem}} + L_{\\text{ponte}}$.',
        habilidades: [
          {
            id: 'M1',
            nome: 'Velocidade escalar média e conversão de unidades (km/h ↔ m/s)',
            foco: 'Converter corretamente km/h para m/s dividindo por 3,6 e calcular tempo de reação/deslocamento.'
          },
          {
            id: 'M2',
            nome: 'Função horária do Movimento Uniforme (s = s₀ + v·t)',
            foco: 'Modelar problemas de deslocamento com velocidade constante através de funções afins e gráficos s × t.'
          },
          {
            id: 'M3',
            nome: 'Velocidade relativa, encontros e ultrapassagem de corpos extensos',
            foco: 'Somar comprimentos em travessias de pontes/túneis e usar velocidade relativa em encontros ou perseguições.'
          }
        ],
        questoes: [
          {
            id: 'cin_b1_q1',
            habilidadeId: 'M1',
            contexto: 'Tempo de Reação no Trânsito',
            enunciado: 'Um motorista trafega por uma rodovia a uma velocidade constante de 108 km/h. Ao avistar um obstáculo, ele leva 0,8 segundo (tempo de reação) até acionar o pedal do freio. Qual é a distância percorrida pelo veículo apenas durante esse tempo de reação?',
            alternativas: {
              A: '24 metros.',
              B: '30 metros.',
              C: '86,4 metros.'
            },
            correta: 'A'
          },
          {
            id: 'cin_b1_q2',
            habilidadeId: 'M1',
            contexto: 'Velocidade Média em Viagem com Parada',
            enunciado: 'Um ônibus percorre 180 km em 2 horas, faz uma parada de 30 minutos em um posto rodoviário e depois percorre mais 120 km em 1 hora e 30 minutos. Qual foi a velocidade escalar média do ônibus considerando todo o trajeto do início ao fim?',
            alternativas: {
              A: '85,7 km/h.',
              B: '75,0 km/h.',
              C: '60,0 km/h.'
            },
            correta: 'B'
          },
          {
            id: 'cin_b1_q3',
            habilidadeId: 'M2',
            contexto: 'Função Horária da Posição',
            enunciado: 'Um caminhão parte do marco quilométrico km 40 de uma rodovia e segue em movimento uniforme no sentido crescente da via a uma velocidade constante de 60 km/h. Qual expressão representa sua posição s (em km) em função do tempo t (em horas) e em qual marco ele estará após 2,5 horas?',
            alternativas: {
              A: 's = 40 + 60t; estará no km 190.',
              B: 's = 60 + 40t; estará no km 160.',
              C: 's = 40 · 60t; estará no km 150.'
            },
            correta: 'A'
          },
          {
            id: 'cin_b1_q4',
            habilidadeId: 'M2',
            contexto: 'Gráfico Posição × Tempo no MU',
            enunciado: 'No gráfico da posição (s) em função do tempo (t) de um móvel em Movimento Retilíneo Uniforme, obtemos uma reta inclinada crescente. A inclinação (coeficiente angular) dessa reta representa fisicamente:',
            alternativas: {
              A: 'A aceleração escalar do móvel.',
              B: 'A distância total percorrida pelo móvel.',
              C: 'A velocidade escalar constante do móvel.'
            },
            correta: 'C'
          },
          {
            id: 'cin_b1_q5',
            habilidadeId: 'M3',
            contexto: 'Trem Atravessando um Túnel',
            enunciado: 'Uma composição ferroviária de 150 metros de comprimento mantém velocidade constante de 20 m/s ao atravessar completamente um túnel retilíneo de 450 metros de extensão. O tempo gasto desde a entrada da locomotiva até a saída completa do último vagão é de:',
            alternativas: {
              A: '22,5 segundos.',
              B: '30,0 segundos.',
              C: '15,0 segundos.'
            },
            correta: 'B'
          },
          {
            id: 'cin_b1_q6',
            habilidadeId: 'M3',
            contexto: 'Ultrapassagem na Rodovia',
            enunciado: 'Dois veículos, A e B, movem-se no mesmo sentido em faixas paralelas com velocidades constantes de 25 m/s e 20 m/s, respectivamente. Se o carro A está 100 metros atrás do carro B, desprezando o comprimento dos carros, quanto tempo levará para alcançá-lo?',
            alternativas: {
              A: '20 segundos.',
              B: '4 segundos.',
              C: '5 segundos.'
            },
            correta: 'A'
          }
        ]
      },
      {
        id: 'bloco_2',
        ordem: 2,
        titulo: 'Movimento Uniformemente Variado (MUV), Gráficos e Queda Livre',
        tempoEstimado: '8–10 min',
        descricao: 'Aceleração escalar constante, equações do MUV, Equação de Torricelli em frenagens, área sob o gráfico v × t e queda livre.',
        resumo: '### Conceitos Essenciais\n- **Aceleração Escalar Média e Constante (MUV):** No MUV, a velocidade varia de forma uniforme ao longo do tempo ($a = \\text{constante} \\neq 0$):\n  - $a = \\frac{\\Delta v}{\\Delta t}$ e $v(t) = v_0 + a \\cdot t$\n- **Função Horária da Posição no MUV:**\n  - $s(t) = s_0 + v_0 \\cdot t + \\frac{a \\cdot t^2}{2}$ (o gráfico $s \\times t$ é um arco de **parábola**).\n- **Equação de Torricelli (Sem o Tempo):** Fundamental em questões do ENEM sobre **distância de frenagem**!\n  - $v^2 = v_0^2 + 2 \\cdot a \\cdot \\Delta s$\n  - Na frenagem até parar ($v = 0$), a distância de frenagem é proporcional ao **quadrado da velocidade inicial** ($\\Delta s = \\frac{v_0^2}{2|a|}$). Dobrar a velocidade quadruplica a distância de frenagem!\n- **Propriedade Gráfica Universal:** Em qualquer gráfico da **velocidade em função do tempo ($v \\times t$)**, a **área sob a curva** é numericamente igual ao deslocamento escalar ($\\Delta s = \\text{Área}$).\n- **Queda Livre:** No vácuo (desprezando a resistência do ar), todos os corpos caem com a mesma aceleração da gravidade ($g \\approx 10\\text{ m/s}^2$), **independentemente de suas massas** ($h = \\frac{g \\cdot t^2}{2}$ e $v = g \\cdot t$).',
        habilidades: [
          {
            id: 'M4',
            nome: 'Aceleração constante, velocidade e posição no MUV',
            foco: 'Relacionar variação de velocidade com aceleração constante e aplicar as funções horárias de velocidade e posição.'
          },
          {
            id: 'M5',
            nome: 'Equação de Torricelli (frenagens) e leitura de gráficos v × t',
            foco: 'Calcular distâncias de frenagem com Torricelli e obter o deslocamento pela área sob o gráfico v × t.'
          },
          {
            id: 'M6',
            nome: 'Queda livre e lançamento vertical sob ação da gravidade',
            foco: 'Compreender que o tempo de queda livre independe da massa e aplicar h = g·t²/2.'
          }
        ],
        questoes: [
          {
            id: 'cin_b2_q1',
            habilidadeId: 'M4',
            contexto: 'Arrancada de um Veículo',
            enunciado: 'Partindo do repouso em um semáforo, um automóvel acelera uniformemente à razão de 3 m/s² durante 6 segundos. Quais são, respectivamente, a velocidade atingida e a distância percorrida ao final desse intervalo?',
            alternativas: {
              A: '18 m/s e 54 metros.',
              B: '18 m/s e 108 metros.',
              C: '9 m/s e 54 metros.'
            },
            correta: 'A'
          },
          {
            id: 'cin_b2_q2',
            habilidadeId: 'M4',
            contexto: 'Movimento Retrógrado vs. Retardado',
            enunciado: 'Um carro que se move a 20 m/s no sentido positivo da trajetória aciona os freios, sofrendo uma desaceleração constante de a = -4 m/s² até parar. Quanto tempo dura a frenagem até a parada completa?',
            alternativas: {
              A: '4 segundos.',
              B: '5 segundos.',
              C: '10 segundos.'
            },
            correta: 'B'
          },
          {
            id: 'cin_b2_q3',
            habilidadeId: 'M5',
            contexto: 'Distância de Frenagem (Torricelli)',
            enunciado: 'Em uma pista seca, um veículo a 10 m/s consegue frear até parar percorrendo uma distância mínima D, com desaceleração máxima constante. Se esse mesmo veículo estivesse na mesma pista com o dobro da velocidade (20 m/s), a nova distância mínima de frenagem seria igual a:',
            alternativas: {
              A: '2D.',
              B: '4D.',
              C: '1,4D.'
            },
            correta: 'B'
          },
          {
            id: 'cin_b2_q4',
            habilidadeId: 'M5',
            contexto: 'Área no Gráfico v × t',
            enunciado: 'O gráfico da velocidade em função do tempo de um ciclista mostra que ele parte do repouso, atinge 10 m/s em 4 segundos de forma linear e depois mantém 10 m/s constantes por mais 6 segundos. Qual foi a distância total percorrida nesses 10 segundos?',
            alternativas: {
              A: '80 metros.',
              B: '100 metros.',
              C: '60 metros.'
            },
            correta: 'A'
          },
          {
            id: 'cin_b2_q5',
            habilidadeId: 'M6',
            contexto: 'Queda Livre e Massa dos Corpos',
            enunciado: 'Duas esferas maciças de ferro, uma de 1 kg e outra de 5 kg, são abandonadas simultaneamente do repouso de uma mesma altura em uma câmara onde a resistência do ar é desprezível. Nessa situação:',
            alternativas: {
              A: 'A esfera de 5 kg chega ao solo em um quinto do tempo da esfera de 1 kg.',
              B: 'Ambas atingem o solo exatamente no mesmo instante e com a mesma velocidade final.',
              C: 'A esfera de 5 kg chega primeiro porque sofre maior aceleração gravitacional.'
            },
            correta: 'B'
          },
          {
            id: 'cin_b2_q6',
            habilidadeId: 'M6',
            contexto: 'Cálculo de Altura na Queda Livre',
            enunciado: 'Uma fruta desprende-se do galho de uma árvore e cai livremente até atingir o solo após 2,0 segundos. Adotando g = 10 m/s² e desprezando a resistência do ar, a altura do galho e a velocidade de impacto no solo são:',
            alternativas: {
              A: '20 metros e 20 m/s.',
              B: '10 metros e 20 m/s.',
              C: '40 metros e 10 m/s.'
            },
            correta: 'A'
          }
        ]
      },
      {
        id: 'bloco_3',
        ordem: 3,
        titulo: 'Leis de Newton, Peso, Normal e Força de Atrito',
        tempoEstimado: '8–10 min',
        descricao: 'Inércia (1ª Lei), Princípio Fundamental da Dinâmica (F = m·a), Ação e Reação (3ª Lei), Força Peso, Normal e Atrito Estático vs. Cinético.',
        resumo: '### Conceitos Essenciais\n- **1ª Lei de Newton (Inércia):** Todo corpo tende a manter seu estado de **repouso** ou de **Movimento Retilíneo Uniforme (MRU)** se a força resultante sobre ele for nula ($F_R = 0$). É o princípio que explica a necessidade do **cinto de segurança** e do **encosto de cabeça**.\n- **2ª Lei de Newton (Princípio Fundamental):** A força resultante é igual ao produto da massa pela aceleração:\n  - $F_R = m \\cdot a$\n- **3ª Lei de Newton (Ação e Reação):** As forças de ação e reação têm mesma intensidade, mesma direção e sentidos opostos, mas **NUNCA se anulam** porque atuam em **corpos diferentes**!\n  - Atenção: **Peso ($P = m \\cdot g$)** e **Força Normal ($N$)** atuam no mesmo corpo; portanto, **não** formam par ação-reação (a reação ao Peso está no centro da Terra).\n- **Força de Atrito ($F_{\\text{at}}$):** Opõe-se à tendência de escorregamento ou ao movimento relativo entre superfícies:\n  - Atrito Estático Máximo: $F_{\\text{at,e}}^{\\text{máx}} = \\mu_e \\cdot N$ (atua enquanto não há deslizamento; os freios **ABS** evitam o travamento das rodas para manter o atrito estático, pois $\\mu_e > \\mu_c$).\n  - Atrito Cinético (Dinâmico): $F_{\\text{at,c}} = \\mu_c \\cdot N$.',
        habilidades: [
          {
            id: 'M7',
            nome: '1ª Lei de Newton (Inércia) e 3ª Lei (Ação e Reação)',
            foco: 'Identificar situações de equilíbrio (repouso ou MRU) pela inércia e reconhecer que ação e reação atuam em corpos distintos.'
          },
          {
            id: 'M8',
            nome: '2ª Lei de Newton (F_R = m·a), Força Peso e Força Normal',
            foco: 'Calcular aceleração a partir da força resultante e diferenciar massa (invariável) de peso (P = m·g).'
          },
          {
            id: 'M9',
            nome: 'Força de atrito estático e cinético (aplicações como freio ABS)',
            foco: 'Distinguir atrito estático de cinético, calcular F_at = μ·N e explicar o funcionamento de freios ABS e tração.'
          }
        ],
        questoes: [
          {
            id: 'cin_b3_q1',
            habilidadeId: 'M7',
            contexto: 'Inércia e Segurança Veicular',
            enunciado: 'Quando um ônibus freia bruscamente, os passageiros em pé são projetados para a frente em relação ao piso do veículo. Esse fenômeno é explicado diretamente pela:',
            alternativas: {
              A: 'Terceira Lei de Newton, pois o piso aplica uma força para a frente nos passageiros.',
              B: 'Primeira Lei de Newton (Inércia), pois os passageiros tendem a manter a velocidade que possuíam antes da frenagem.',
              C: 'Força centrífuga gerada pela desaceleração das rodas.'
            },
            correta: 'B'
          },
          {
            id: 'cin_b3_q2',
            habilidadeId: 'M7',
            contexto: 'Par Ação e Reação',
            enunciado: 'Um livro repousa sobre o tampo horizontal de uma mesa. A Terra atrai o livro para baixo com a força Peso (P). De acordo com a 3ª Lei de Newton, a força de reação ao Peso do livro é:',
            alternativas: {
              A: 'A força Normal exercida pelo tampo da mesa sobre o livro, apontando para cima.',
              B: 'A força gravitacional com que o livro atrai a Terra, aplicada no centro da Terra.',
              C: 'A força que o livro aplica para baixo sobre a superfície da mesa.'
            },
            correta: 'B'
          },
          {
            id: 'cin_b3_q3',
            habilidadeId: 'M8',
            contexto: 'Segunda Lei de Newton',
            enunciado: 'Um caixote de 20 kg apoia-se em um piso horizontal sem atrito e recebe uma força horizontal de 80 N para a direita e outra de 20 N para a esquerda. A aceleração adquirida pelo caixote é de:',
            alternativas: {
              A: '3,0 m/s² para a direita.',
              B: '4,0 m/s² para a direita.',
              C: '5,0 m/s² para a direita.'
            },
            correta: 'A'
          },
          {
            id: 'cin_b3_q4',
            habilidadeId: 'M8',
            contexto: 'Força Resultante no MRU',
            enunciado: 'Um paraquedista desce verticalmente com velocidade constante de 5 m/s após abrir seu paraquedas. Sabendo que a massa total do conjunto é 80 kg e g = 10 m/s², qual é a intensidade da força de resistência do ar sobre ele?',
            alternativas: {
              A: 'Zero, pois a velocidade é constante.',
              B: '800 N para cima, equilibrando exatamente a força Peso.',
              C: '400 N para cima, metade da força Peso.'
            },
            correta: 'B'
          },
          {
            id: 'cin_b3_q5',
            habilidadeId: 'M9',
            contexto: 'Sistema de Freios ABS',
            enunciado: 'O sistema de freios ABS evita que as rodas do automóvel travem e deslizem durante uma frenagem de emergência. Fisicamente, essa tecnologia reduz a distância de parada porque:',
            alternativas: {
              A: 'Garante que atue o atrito estático entre pneu e asfalto, cujo coeficiente máximo é maior que o coeficiente de atrito cinético.',
              B: 'Aumenta o coeficiente de atrito cinético ao aquecer o pneu por escorregamento.',
              C: 'Anula o atrito com o solo para evitar o desgaste da borracha.'
            },
            correta: 'A'
          },
          {
            id: 'cin_b3_q6',
            habilidadeId: 'M9',
            contexto: 'Cálculo de Força de Atrito Estático',
            enunciado: 'Uma geladeira de massa 60 kg está em repouso sobre uma cozinha plana (g = 10 m/s²). Os coeficientes de atrito estático e cinético entre os pés da geladeira e o piso são μ_e = 0,50 e μ_c = 0,35. Se uma pessoa empurrar a geladeira horizontalmente com 220 N:',
            alternativas: {
              A: 'A geladeira permanecerá em repouso e a força de atrito valerá 220 N.',
              B: 'A geladeira permanecerá em repouso e a força de atrito valerá 300 N.',
              C: 'A geladeira entrará em movimento porque 220 N supera o atrito cinético de 210 N.'
            },
            correta: 'A'
          }
        ]
      },
      {
        id: 'bloco_4',
        ordem: 4,
        titulo: 'Trabalho, Potência, Energia Mecânica e Conservação de Energia',
        tempoEstimado: '8–10 min',
        descricao: 'Trabalho de uma força, potência mecânica e rendimento, energia cinética, potencial gravitacional/elástica e conservação da energia mecânica.',
        resumo: '### Conceitos Essenciais\n- **Trabalho de uma Força ($W$ ou $\\tau$):** Mede a energia transferida por uma força ao longo de um deslocamento $d$:\n  - $W = F \\cdot d \\cdot \\cos\\theta$ (em Joules, $\\text{J}$). Forças perpendiculares ao deslocamento (como a Normal ou a força centrípeta) realizam **trabalho nulo** ($\\cos 90^\\circ = 0$).\n  - **Teorema da Energia Cinética:** $W_{\\text{resultante}} = \\Delta E_c = E_{c,\\text{final}} - E_{c,\\text{inicial}}$.\n- **Potência Mecânica ($P$) e Rendimento ($\\eta$):**\n  - Potência média: $P_m = \\frac{W}{\\Delta t} = \\frac{\\Delta E}{\\Delta t}$ (em Watts, $\\text{W} = \\text{J/s}$) ou potências instantâneas $P = F \\cdot v$.\n  - Rendimento: $\\eta = \\frac{P_{\\text{útil}}}{P_{\\text{total}}}$.\n- **Formas de Energia Mecânica ($E_m$):**\n  - **Energia Cinética (movimento):** $E_c = \\frac{m \\cdot v^2}{2}$ (dobrar a velocidade multiplica $E_c$ por $4$!).\n  - **Energia Potencial Gravitacional (altura):** $E_{pg} = m \\cdot g \\cdot h$.\n  - **Energia Potencial Elástica (mola/deformação):** $E_{pe} = \\frac{k \\cdot x^2}{2}$.\n- **Conservação da Energia Mecânica:** Em sistemas conservativos (sem atrito/resistência do ar), a energia mecânica total permanece constante:\n  - $E_{m,\\text{inicial}} = E_{m,\\text{final}} \\Rightarrow E_{c,A} + E_{p,A} = E_{c,B} + E_{p,B}$.',
        habilidades: [
          {
            id: 'M10',
            nome: 'Trabalho de uma força, Potência mecânica e Rendimento',
            foco: 'Calcular trabalho (W = F·d·cosθ) e potência (P = ΔE/Δt) em motores, guindastes, bombas d\'água e usinas.'
          },
          {
            id: 'M11',
            nome: 'Energia Cinética, Potencial Gravitacional e Potencial Elástica',
            foco: 'Calcular E_c = m·v²/2, E_pg = m·g·h e E_pe = k·x²/2 e relacionar o trabalho resultante à variação da energia cinética.'
          },
          {
            id: 'M12',
            nome: 'Conservação e dissipação da Energia Mecânica',
            foco: 'Aplicar a conservação da energia mecânica em montanhas-russas, rampas, pêndulos e saltos, ou calcular a energia dissipada pelo atrito.'
          }
        ],
        questoes: [
          {
            id: 'cin_b4_q1',
            habilidadeId: 'M10',
            contexto: 'Potência de uma Bomba Hidráulica',
            enunciado: 'Uma bomba hidráulica eleva 300 kg de água até uma caixa-d\'água situada a 10 metros de altura em 60 segundos, com velocidade constante. Adotando g = 10 m/s², qual é a potência mecânica útil desenvolvida pela bomba?',
            alternativas: {
              A: '500 W.',
              B: '3.000 W.',
              C: '50 W.'
            },
            correta: 'A'
          },
          {
            id: 'cin_b4_q2',
            habilidadeId: 'M10',
            contexto: 'Trabalho da Força Peso e Normal',
            enunciado: 'Um operário empurra uma caixa de 10 kg por 5 metros ao longo de uma rampa horizontal aplicando uma força horizontal constante de 40 N. Durante esse deslocamento, os trabalhos realizados pela força do operário e pela força Normal são, respectivamente:',
            alternativas: {
              A: '200 J e 500 J.',
              B: '200 J e 0 J.',
              C: '40 J e 0 J.'
            },
            correta: 'B'
          },
          {
            id: 'cin_b4_q3',
            habilidadeId: 'M11',
            contexto: 'Energia Cinética e Velocidade',
            enunciado: 'Um automóvel de 1.000 kg trafega a 10 m/s (36 km/h). Se o motorista acelerar até atingir 20 m/s (72 km/h), a energia cinética do automóvel passará de:',
            alternativas: {
              A: '50.000 J para 100.000 J (dobra).',
              B: '50.000 J para 200.000 J (quadruplica).',
              C: '10.000 J para 40.000 J (quadruplica).'
            },
            correta: 'B'
          },
          {
            id: 'cin_b4_q4',
            habilidadeId: 'M11',
            contexto: 'Energia Potencial Elástica',
            enunciado: 'Em um brinquedo de lançamento, uma mola de constante elástica k = 400 N/m é comprimida em x = 0,20 m (20 cm). Qual é a energia potencial elástica armazenada na mola pronta para o disparo?',
            alternativas: {
              A: '8,0 J.',
              B: '16,0 J.',
              C: '40,0 J.'
            },
            correta: 'A'
          },
          {
            id: 'cin_b4_q5',
            habilidadeId: 'M12',
            contexto: 'Conservação de Energia em Pista de Skate',
            enunciado: 'Um skatista parte do repouso do alto de uma rampa a 3,2 metros de altura em relação à base plana. Desprezando todos os atritos e adotando g = 10 m/s², qual será a velocidade do skatista ao passar pelo ponto mais baixo da pista?',
            alternativas: {
              A: '6,4 m/s.',
              B: '8,0 m/s.',
              C: '16,0 m/s.'
            },
            correta: 'B'
          },
          {
            id: 'cin_b4_q6',
            habilidadeId: 'M12',
            contexto: 'Energia Mecânica Dissipada pelo Atrito',
            enunciado: 'Uma criança de 30 kg parte do repouso no topo de um escorregador de 3,0 m de altura e chega à base com velocidade de 6,0 m/s. Adotando g = 10 m/s², qual foi a energia mecânica dissipada pelo atrito sob forma de calor durante a descida?',
            alternativas: {
              A: '360 J.',
              B: '540 J.',
              C: '900 J.'
            },
            correta: 'A'
          }
        ]
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════════════════
     2. MATEMÁTICA — MATEMÁTICA FINANCEIRA E JUROS COMPOSTOS
     ══════════════════════════════════════════════════════════════════════════ */
  {
    id: 'matematica_financeira',
    materiaId: 'matematica',
    materia: 'Matemática',
    assuntoId: 'financeira',
    assunto: 'Matemática Financeira e Juros Compostos',
    icone: '📈',
    cor: 'green',
    descricao: 'Domínio completo de porcentagem, fatores multiplicativos de aumento e desconto sucessivos, comparação entre juros simples e compostos e cálculo de montante e taxas no ENEM.',
    blocos: [
      {
        id: 'bloco_1',
        ordem: 1,
        titulo: 'Razão, Proporção, Porcentagem e Aumentos/Descontos Sucessivos',
        tempoEstimado: '6–8 min',
        descricao: 'Cálculo percentual direto, razão e proporção em compras, fator de atualização (1 ± i) e pegadinha dos aumentos e descontos sucessivos.',
        resumo: '### Conceitos Essenciais\n- **Porcentagem como Razão Centesimal e Decimal:**\n  - $p\\% = \\frac{p}{100}$ (ex: $15\\% = 0,15$; $8\\% = 0,08$; $120\\% = 1,20$).\n- **Fator Multiplicativo (Fator de Atualização):** É a ferramenta mais rápida para o ENEM!\n  - **Aumento de $i\\%$:** multiplica por $(1 + i)$. Ex: aumento de $20\\% \\Rightarrow \\times 1,20$.\n  - **Desconto de $i\\%$:** multiplica por $(1 - i)$. Ex: desconto de $15\\% \\Rightarrow \\times 0,85$.\n- **Aumentos e Descontos Sucessivos (Pegadinha Clássica):**\n  - Dois aumentos sucessivos de $10\\%$ **NÃO** equivalem a $20\\%$! Como o segundo incide sobre o valor já aumentado: $1,10 \\times 1,10 = 1,21 \\Rightarrow$ aumento real de **$21\\%$**.\n  - Um aumento de $20\\%$ seguido de um desconto de $20\\%$ **NÃO** volta ao valor original! $1,20 \\times 0,80 = 0,96 \\Rightarrow$ resulta em um **desconto líquido de $4\\%$**.\n- **Variação Percentual Relativa:** Para saber quantos por cento um valor inicial $V_0$ variou até $V_f$:\n  - $\\Delta\\% = \\frac{V_f - V_0}{V_0} \\times 100\\%$.',
        habilidades: [
          {
            id: 'MF1',
            nome: 'Razão, proporção e cálculo de porcentagem no cotidiano',
            foco: 'Resolver problemas de descontos, comissões, impostos e custo-benefício usando razão e proporção.'
          },
          {
            id: 'MF2',
            nome: 'Fator multiplicativo e aumentos/descontos sucessivos',
            foco: 'Multiplicar fatores (1 ± i₁)·(1 ± i₂) para encontrar a taxa acumulada sem somar porcentagens indevidamente.'
          },
          {
            id: 'MF3',
            nome: 'Variação percentual relativa e recomposição de valor original',
            foco: 'Calcular o valor antes de um aumento/desconto dividindo pelo fator e determinar a taxa para retornar ao preço inicial.'
          }
        ],
        questoes: [
          {
            id: 'fin_b1_q1',
            habilidadeId: 'MF1',
            contexto: 'Comparação de Desconto em Compras',
            enunciado: 'Uma loja vende um notebook por R$ 3.200,00 a prazo, mas oferece 15% de desconto para pagamento à vista via PIX. Qual é o valor do desconto e o preço final à vista?',
            alternativas: {
              A: 'Desconto de R$ 480,00 e preço final de R$ 2.720,00.',
              B: 'Desconto de R$ 450,00 e preço final de R$ 2.750,00.',
              C: 'Desconto de R$ 320,00 e preço final de R$ 2.880,00.'
            },
            correta: 'A'
          },
          {
            id: 'fin_b1_q2',
            habilidadeId: 'MF1',
            contexto: 'Proporção e Rendimento de Combustível',
            enunciado: 'Um motorista abastece seu veículo com 40 litros de combustível a R$ 5,50 o litro. Se o posto anuncia uma promoção com redução de 10% no preço por litro, quantos reais o motorista economizará ao abastecer os mesmos 40 litros?',
            alternativas: {
              A: 'R$ 20,00.',
              B: 'R$ 22,00.',
              C: 'R$ 25,00.'
            },
            correta: 'B'
          },
          {
            id: 'fin_b1_q3',
            habilidadeId: 'MF2',
            contexto: 'Aumento Seguido de Desconto',
            enunciado: 'O preço de uma passagem aérea sofreu um reajuste de +20% na alta temporada e, no mês seguinte, recebeu um desconto promocional de 20% sobre o novo valor. Em relação ao preço inicial antes da alta temporada, o preço final:',
            alternativas: {
              A: 'Voltou exatamente ao mesmo valor inicial.',
              B: 'Ficou 4% menor que o valor inicial.',
              C: 'Ficou 4% maior que o valor inicial.'
            },
            correta: 'B'
          },
          {
            id: 'fin_b1_q4',
            habilidadeId: 'MF2',
            contexto: 'Descontos Sucessivos na Liquidação',
            enunciado: 'Um casaco está em liquidação com 30% de desconto na etiqueta. Ao pagar no caixa com o cartão da loja, o cliente ganha mais 10% de desconto sobre o valor já reduzido. Os dois descontos sucessivos de 30% e 10% equivalem a um único desconto total de:',
            alternativas: {
              A: '40%.',
              B: '37%.',
              C: '33%.'
            },
            correta: 'B'
          },
          {
            id: 'fin_b1_q5',
            habilidadeId: 'MF3',
            contexto: 'Descobrindo o Valor Antes do Reajuste',
            enunciado: 'Após um reajuste salarial de 25%, uma engenheira passou a receber R$ 7.500,00 mensais. Qual era o salário dela imediatamente antes desse reajuste?',
            alternativas: {
              A: 'R$ 6.000,00.',
              B: 'R$ 5.625,00.',
              C: 'R$ 6.250,00.'
            },
            correta: 'A'
          },
          {
            id: 'fin_b1_q6',
            habilidadeId: 'MF3',
            contexto: 'Recomposição após Queda Percentual',
            enunciado: 'As ações de uma empresa sofreram uma queda de 20% em uma semana. Na semana seguinte, qual deve ser o percentual de valorização sobre a nova cotação para que a ação recupere exatamente seu valor original?',
            alternativas: {
              A: '20%.',
              B: '25%.',
              C: '22%.'
            },
            correta: 'B'
          }
        ]
      },
      {
        id: 'bloco_2',
        ordem: 2,
        titulo: 'Juros Simples vs. Juros Compostos (Comparação Algébrica e Gráfica)',
        tempoEstimado: '6–8 min',
        descricao: 'Regime de capitalização simples (linear/PA) versus composta (exponencial/PG), comparação de montantes e leitura de gráficos.',
        resumo: '### Conceitos Essenciais\n- **Capital ($C$), Juros ($J$), Taxa ($i$) e Montante ($M = C + J$):**\n  - A taxa $i$ e o tempo $t$ devem estar sempre na **mesma unidade de tempo** (ex: taxa ao mês $\\leftrightarrow$ tempo em meses).\n- **Regime de Juros Simples (Crescimento Linear / PA):**\n  - Os juros incidem **apenas sobre o capital inicial $C$** em todos os períodos.\n  - $J = C \\cdot i \\cdot t$ e $M(t) = C \\cdot (1 + i \\cdot t)$\n  - O montante cresce em **Progressão Aritmética (PA)** de razão $r = C \\cdot i$, e seu gráfico $M \\times t$ é uma **reta**.\n- **Regime de Juros Compostos (Crescimento Exponencial / PG):**\n  - São os chamados \"juros sobre juros\": a cada período, a taxa incide sobre o **montante acumulado do período anterior**.\n  - $M(t) = C \\cdot (1 + i)^t$\n  - O montante cresce em **Progressão Geométrica (PG)** de razão $q = (1 + i)$, e seu gráfico $M \\times t$ é uma **curva exponencial**.\n- **Comparação Gráfica ($t = 1$):** Para $t = 1$ período, ambos geram o mesmo montante. Para $t > 1$, o montante composto é **sempre superior** ao simples.',
        habilidades: [
          {
            id: 'MF4',
            nome: 'Cálculo de Juros Simples e progressão linear do montante',
            foco: 'Aplicar J = C·i·t em descontos comerciais, multas lineares e financiamentos a juros simples.'
          },
          {
            id: 'MF5',
            nome: 'Comparação algébrica e gráfica entre Juros Simples (PA) e Compostos (PG)',
            foco: 'Diferenciar o crescimento linear (reta/PA) dos juros simples do crescimento exponencial (curva/PG) dos juros compostos.'
          }
        ],
        questoes: [
          {
            id: 'fin_b2_q1',
            habilidadeId: 'MF4',
            contexto: 'Aplicação a Juros Simples',
            enunciado: 'Um capital de R$ 2.000,00 é aplicado no regime de juros simples à taxa de 2% ao mês durante 8 meses. Quais serão os juros totais rendidos e o montante final resgatado?',
            alternativas: {
              A: 'Juros de R$ 320,00 e montante de R$ 2.320,00.',
              B: 'Juros de R$ 160,00 e montante de R$ 2.160,00.',
              C: 'Juros de R$ 343,00 e montante de R$ 2.343,00.'
            },
            correta: 'A'
          },
          {
            id: 'fin_b2_q2',
            habilidadeId: 'MF4',
            contexto: 'Multa e Mora Diária Simples',
            enunciado: 'Um boleto no valor de R$ 500,00 pago com atraso cobra multa fixa de 2% sobre o valor do boleto mais juros simples de mora de 0,1% ao dia de atraso. Se for pago com 15 dias de atraso, qual será o valor total desembolsado?',
            alternativas: {
              A: 'R$ 517,50.',
              B: 'R$ 510,50.',
              C: 'R$ 525,00.'
            },
            correta: 'A'
          },
          {
            id: 'fin_b2_q3',
            habilidadeId: 'MF5',
            contexto: 'PA vs. PG nos Regimes de Capitalização',
            enunciado: 'Dois investimentos A e B recebem o mesmo capital inicial de R$ 1.000,00 à taxa de 10% ao mês: A em juros simples e B em juros compostos. Os montantes de A e B ao final de cada mês formam, respectivamente:',
            alternativas: {
              A: 'Uma Progressão Aritmética de razão R$ 100,00 e uma Progressão Geométrica de razão 1,10.',
              B: 'Uma Progressão Geométrica de razão 1,10 e uma Progressão Aritmética de razão R$ 100,00.',
              C: 'Duas Progressões Geométricas de razões diferentes.'
            },
            correta: 'A'
          },
          {
            id: 'fin_b2_q4',
            habilidadeId: 'MF5',
            contexto: 'Diferença após 2 Meses',
            enunciado: 'Um investidor aplica R$ 5.000,00 por 2 meses a uma taxa de 10% ao mês. A diferença entre o montante obtido no regime de juros compostos e o montante que seria obtido no regime de juros simples é de:',
            alternativas: {
              A: 'R$ 0,00, pois para 2 meses os regimes coincidem.',
              B: 'R$ 50,00 a mais nos juros compostos.',
              C: 'R$ 100,00 a mais nos juros compostos.'
            },
            correta: 'B'
          }
        ]
      },
      {
        id: 'bloco_3',
        ordem: 3,
        titulo: 'Montante em Juros Compostos, Taxas Equivalentes e Problemas Clássicos do ENEM',
        tempoEstimado: '8–10 min',
        descricao: 'Fórmula M = C·(1 + i)^t, uso de aproximações e logaritmos, taxas equivalentes, desvalorização patrimonial e compra à vista vs. parcelada.',
        resumo: '### Conceitos Essenciais\n- **Montante e Juros no Regime Composto:**\n  - $M = C \\cdot (1 + i)^t$ e $J = M - C = C \\cdot [(1 + i)^t - 1]$\n- **Depreciação / Desvalorização Composta:** Quando um bem (como um veículo ou máquina) perde $i\\%$ de seu valor a cada ano:\n  - $V(t) = V_0 \\cdot (1 - i)^t$\n- **Uso de Logaritmos para Encontrar o Tempo ($t$):** O ENEM frequentemente pede em quanto tempo um capital dobra ou atinge certo valor:\n  - Ex: Para dobrar o capital ($M = 2C$): $(1 + i)^t = 2 \\Rightarrow t \\cdot \\log(1 + i) = \\log 2 \\Rightarrow t = \\frac{\\log 2}{\\log(1 + i)}$.\n- **Taxas Equivalentes em Juros Compostos:** Duas taxas são equivalentes quando produzem o mesmo montante no mesmo intervalo:\n  - $(1 + i_{\\text{anual}}) = (1 + i_{\\text{mensal}})^{12}$.\n- **Compra à Vista vs. Parcelada (Valor Presente):** Para comparar uma parcela futura $P$ (paga daqui a $t$ meses) com um pagamento no ato (à vista), trazemos a parcela para o valor presente dividindo por $(1 + i)^t$: $VP = \\frac{P}{(1 + i)^t}$.',
        habilidades: [
          {
            id: 'MF6',
            nome: 'Cálculo de Montante e Depreciação em Juros Compostos (M = C·(1 ± i)^t)',
            foco: 'Calcular montantes acumulados após n períodos e desvalorização anual composta de bens.'
          },
          {
            id: 'MF7',
            nome: 'Tempo de capitalização com logaritmos e taxas equivalentes',
            foco: 'Isolar o expoente t usando propriedades de logaritmos e converter taxas em juros compostos.'
          },
          {
            id: 'MF8',
            nome: 'Decisão financeira no ENEM: compra à vista vs. parcelada e amortização',
            foco: 'Descapitalizar parcelas futuras para o valor presente ou capitalizar o saldo aplicado para tomar a melhor decisão.'
          }
        ],
        questoes: [
          {
            id: 'fin_b3_q1',
            habilidadeId: 'MF6',
            contexto: 'Montante em Juros Compostos',
            enunciado: 'Uma pessoa aplica R$ 10.000,00 em um fundo de renda fixa que rende juros compostos de 1% ao mês. Considerando a aproximação 1,01¹² = 1,127, qual será o montante acumulado após 1 ano (12 meses)?',
            alternativas: {
              A: 'R$ 11.200,00.',
              B: 'R$ 11.270,00.',
              C: 'R$ 12.000,00.'
            },
            correta: 'B'
          },
          {
            id: 'fin_b3_q2',
            habilidadeId: 'MF6',
            contexto: 'Depreciação Composta de um Veículo',
            enunciado: 'Um automóvel zero-quilômetro foi adquirido por R$ 80.000,00 e sofre uma desvalorização composta de 10% ao ano sobre seu valor de mercado. Qual será o valor desse automóvel após 2 anos de uso?',
            alternativas: {
              A: 'R$ 64.000,00.',
              B: 'R$ 64.800,00.',
              C: 'R$ 72.000,00.'
            },
            correta: 'B'
          },
          {
            id: 'fin_b3_q3',
            habilidadeId: 'MF7',
            contexto: 'Tempo para Dobrar o Capital com Logaritmos',
            enunciado: 'Um capital é aplicado a juros compostos de 10% ao ano. Usando log(2) = 0,30 e log(1,1) = 0,04, em quantos anos esse capital dobrará de valor?',
            alternativas: {
              A: '7,5 anos.',
              B: '10,0 anos.',
              C: '6,0 anos.'
            },
            correta: 'A'
          },
          {
            id: 'fin_b3_q4',
            habilidadeId: 'MF7',
            contexto: 'Taxas Equivalentes no Regime Composto',
            enunciado: 'Uma instituição financeira anuncia um empréstimo com taxa de juros compostos de 20% ao semestre. A taxa anual equivalente cobrada por essa instituição é de:',
            alternativas: {
              A: '40% ao ano.',
              B: '44% ao ano.',
              C: '42% ao ano.'
            },
            correta: 'B'
          },
          {
            id: 'fin_b3_q5',
            habilidadeId: 'MF8',
            contexto: 'Decisão: À Vista com Desconto ou Aplicado',
            enunciado: 'Um produto custa R$ 1.000,00. O comprador pode pagar à vista com 10% de desconto (R$ 900,00) ou pagar R$ 1.000,00 daqui a 1 mês. Se ele possui os R$ 900,00 hoje e pode deixá-los aplicados em um investimento que rende 5% ao mês, qual é a opção financeiramente mais vantajosa?',
            alternativas: {
              A: 'Pagar à vista com desconto, pois aplicando R$ 900,00 a 5% ao mês ele terá R$ 945,00 em 1 mês, que é insuficiente para pagar os R$ 1.000,00.',
              B: 'Pagar daqui a 1 mês, pois os juros do investimento superam o desconto.',
              C: 'As duas opções são equivalentes.'
            },
            correta: 'A'
          },
          {
            id: 'fin_b3_q6',
            habilidadeId: 'MF8',
            contexto: 'Empréstimo em Duas Parcelas (Amortização)',
            enunciado: 'Uma pessoa toma R$ 2.000,00 emprestados a juros compostos de 10% ao mês para quitar em dois pagamentos mensais. No fim do 1º mês, o saldo devedor sobe para R$ 2.200,00 e ela paga uma primeira parcela de R$ 1.200,00. Qual deve ser o valor da segunda parcela, no fim do 2º mês, para quitar totalmente a dívida?',
            alternativas: {
              A: 'R$ 1.000,00.',
              B: 'R$ 1.100,00.',
              C: 'R$ 1.210,00.'
            },
            correta: 'B'
          }
        ]
      }
    ]
  },
  /* ══════════════════════════════════════════════════════════════════════════
     3. MATEMÁTICA — PROBABILIDADE
     ══════════════════════════════════════════════════════════════════════════ */
  {
    id: 'matematica_probabilidade',
    materiaId: 'matematica',
    materia: 'Matemática',
    assuntoId: 'probabilidade',
    assunto: 'Probabilidade',
    icone: '🎲',
    cor: 'peach',
    descricao: 'Mapeamento completo das habilidades de Probabilidade exigidas no ENEM: espaço amostral, probabilidade simples em tabelas, união de eventos, evento complementar, probabilidade condicional e eventos independentes.',
    blocos: [
      {
        id: 'bloco_1',
        ordem: 1,
        titulo: 'Espaço Amostral, Evento e Probabilidade Simples (Favoráveis / Possíveis)',
        tempoEstimado: '6–8 min',
        descricao: 'Definição clássica de Laplace, contagem de casos favoráveis e possíveis, lançamentos de dados/moedas e leitura de tabelas de dupla entrada.',
        resumo: '### Conceitos Essenciais\n- **Espaço Amostral ($\\Omega$) e Evento ($A$):**\n  - **Espaço Amostral ($\\Omega$):** Conjunto de todos os resultados possíveis de um experimento aleatório. Seu número de elementos é $n(\\Omega)$.\n  - **Evento ($A$):** Qualquer subconjunto do espaço amostral ($A \\subset \\Omega$), com $n(A)$ casos favoráveis.\n- **Definição Clássica de Probabilidade (Espaço Equiprovável):**\n  - $P(A) = \\frac{\\text{Casos Favoráveis}}{\\text{Casos Possíveis}} = \\frac{n(A)}{n(\\Omega)}$\n  - A probabilidade é sempre um número entre $0$ e $1$ ($0 \\le P(A) \\le 1$, ou de $0\\%$ a $100\\%$). Se $P(A) = 0$, o evento é impossível; se $P(A) = 1$, é o evento certo.\n- **Exemplos Clássicos do ENEM:**\n  - Lançamento de 2 dados honestos: $n(\\Omega) = 6 \\times 6 = 36$ pares ordenados possíveis.\n  - Lançamento de $n$ moedas: $n(\\Omega) = 2^n$ sequências possíveis.\n  - **Tabelas de Contingência (Dupla Entrada):** Leia com extrema atenção se o denominador é o **total geral da tabela** (probabilidade simples) ou apenas o total de uma linha/coluna específica.',
        habilidades: [
          {
            id: 'PR1',
            nome: 'Espaço amostral equiprovável e probabilidade clássica (Favoráveis / Possíveis)',
            foco: 'Contar corretamente o total de casos possíveis n(Ω) e os casos favoráveis n(A) em sorteios, urnas e dados.'
          },
          {
            id: 'PR2',
            nome: 'Probabilidade extraída de tabelas, gráficos e conjuntos no ENEM',
            foco: 'Interpretar tabelas de dupla entrada e diagramas de Venn para extrair a razão correta pedida no comando.'
          }
        ],
        questoes: [
          {
            id: 'prob_b1_q1',
            habilidadeId: 'PR1',
            contexto: 'Sorteio em uma Urna',
            enunciado: 'Uma urna contém 20 bolas idênticas ao toque, numeradas de 1 a 20. Retirando-se uma bola ao acaso, qual é a probabilidade de o número sorteado ser um múltiplo de 4?',
            alternativas: {
              A: '1/4 (ou 25%).',
              B: '1/5 (ou 20%).',
              C: '4/20 (ou 20%).'
            },
            correta: 'A'
          },
          {
            id: 'prob_b1_q2',
            habilidadeId: 'PR1',
            contexto: 'Lançamento Simultâneo de Dois Dados',
            enunciado: 'Dois dados honestos de 6 faces (numeradas de 1 a 6) são lançados simultaneamente. Qual é a probabilidade de a soma dos números obtidos nas faces superiores ser exatamente igual a 7?',
            alternativas: {
              A: '1/6.',
              B: '7/36.',
              C: '1/12.'
            },
            correta: 'A'
          },
          {
            id: 'prob_b1_q3',
            habilidadeId: 'PR2',
            contexto: 'Tabela de Dupla Entrada em Escola',
            enunciado: 'Em uma escola com 200 alunos do 3º ano, uma tabela mostra que 120 são meninas (das quais 45 usam óculos) e 80 são meninos (dos quais 35 usam óculos). Escolhendo-se ao acaso um estudante entre todos os 200 alunos, a probabilidade de ele usar óculos é:',
            alternativas: {
              A: '40%.',
              B: '80%.',
              C: '35%.'
            },
            correta: 'A'
          },
          {
            id: 'prob_b1_q4',
            habilidadeId: 'PR2',
            contexto: 'Diagrama de Venn e Línguas Estrangeiras',
            enunciado: 'Em um grupo de 50 candidatos a uma vaga de estágio, 30 falam Inglês, 20 falam Espanhol e 10 falam ambos os idiomas. Sorteando-se um candidato ao acaso entre os 50, qual a probabilidade de ele falar apenas Inglês?',
            alternativas: {
              A: '30/50 (60%).',
              B: '20/50 (40%).',
              C: '40/50 (80%).'
            },
            correta: 'B'
          }
        ]
      },
      {
        id: 'bloco_2',
        ordem: 2,
        titulo: 'Probabilidade da União de Eventos ("OU") e Evento Complementar ("Pelo Menos Um")',
        tempoEstimado: '6–8 min',
        descricao: 'Regra da soma para união de eventos P(A ∪ B), eventos mutuamente exclusivos e estratégia do evento complementar (1 - P(nenhum)).',
        resumo: '### Conceitos Essenciais\n- **Probabilidade da União de Dois Eventos — Conectivo \"OU\" ($A \\cup B$):**\n  - Para calcular a probabilidade de ocorrer o evento $A$ **ou** o evento $B$, somamos as probabilidades e **subtraímos a interseção** (para não contar duas vezes quem pertence a ambos):\n  - $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$\n- **Eventos Mutuamente Exclusivos (Disjuntos):**\n  - Quando $A$ e $B$ não podem ocorrer juntos ($A \\cap B = \\emptyset$), então $P(A \\cap B) = 0$ e $P(A \\cup B) = P(A) + P(B)$.\n- **Probabilidade do Evento Complementar ($A^c$ ou $\\bar{A}$):**\n  - A soma da probabilidade de um evento ocorrer com a de ele **não ocorrer** é sempre $1$ ($100\\%$):\n  - $P(A) + P(A^c) = 1 \\Rightarrow P(A) = 1 - P(A^c)$\n- **Atalho de Ouro para o ENEM (\"Pelo menos um\"):** Sempre que a questão pedir a probabilidade de ocorrer **\"pelo menos um\"** acerto/sucesso em várias tentativas:\n  - $P(\\text{pelo menos um}) = 1 - P(\\text{nenhum})$.',
        habilidades: [
          {
            id: 'PR3',
            nome: 'Probabilidade da união de dois eventos ("OU"): P(A ∪ B) = P(A) + P(B) - P(A ∩ B)',
            foco: 'Lembrar sempre de descontar a interseção P(A ∩ B) quando os eventos não são disjuntos.'
          },
          {
            id: 'PR4',
            nome: 'Evento complementar e problemas do tipo "pelo menos um"',
            foco: 'Calcular 1 - P(nenhum) para resolver rapidamente questões de "pelo menos um" sem precisar somar vários casos.'
          }
        ],
        questoes: [
          {
            id: 'prob_b2_q1',
            habilidadeId: 'PR3',
            contexto: 'União de Eventos com Interseção',
            enunciado: 'De um baralho de fichas numeradas de 1 a 15, retira-se uma ficha ao acaso. Qual é a probabilidade de o número sorteado ser múltiplo de 3 OU múltiplo de 5?',
            alternativas: {
              A: '7/15.',
              B: '8/15.',
              C: '6/15.'
            },
            correta: 'A'
          },
          {
            id: 'prob_b2_q2',
            habilidadeId: 'PR3',
            contexto: 'Pesquisa de Preferência de Leitura',
            enunciado: 'Em uma comunidade, 50% dos moradores leem o jornal A, 40% leem o jornal B e 15% leem ambos os jornais A e B. Escolhendo-se um morador ao acaso, a probabilidade de ele ler o jornal A ou o jornal B é de:',
            alternativas: {
              A: '90%.',
              B: '75%.',
              C: '60%.'
            },
            correta: 'B'
          },
          {
            id: 'prob_b2_q3',
            habilidadeId: 'PR4',
            contexto: 'Estratégia do Evento Complementar ("Pelo Menos Um")',
            enunciado: 'Uma moeda honesta é lançada 3 vezes consecutivas. Qual é a probabilidade de sair "Cara" em pelo menos um dos 3 lançamentos?',
            alternativas: {
              A: '7/8.',
              B: '3/4.',
              C: '1/2.'
            },
            correta: 'A'
          },
          {
            id: 'prob_b2_q4',
            habilidadeId: 'PR4',
            contexto: 'Alarme de Segurança Duplo',
            enunciado: 'Um cofre possui dois sensores independentes. Em caso de invasão, a probabilidade de o sensor 1 falhar é de 10% (0,10) e a de o sensor 2 falhar é de 20% (0,20). Qual é a probabilidade de pelo menos um dos sensores funcionar e disparar o alarme?',
            alternativas: {
              A: '98% (pois a chance de ambos falharem juntos é 0,10 × 0,20 = 0,02).',
              B: '70% (100% - 10% - 20%).',
              C: '90%.'
            },
            correta: 'A'
          }
        ]
      },
      {
        id: 'bloco_3',
        ordem: 3,
        titulo: 'Probabilidade Condicional e Multiplicação de Eventos Independentes ("E")',
        tempoEstimado: '8–10 min',
        descricao: 'Redução do espaço amostral no "sabendo-se que", regra do produto ("E"), eventos independentes e sorteios sem reposição.',
        resumo: '### Conceitos Essenciais\n- **Probabilidade Condicional ($P(A | B)$ — \"Sabendo-se que $B$ ocorreu\"):**\n  - A informação de que $B$ já ocorreu **reduz o espaço amostral** apenas aos elementos de $B$!\n  - $P(A | B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{n(A \\cap B)}{n(B)}$\n  - Dica prática para o ENEM: Em vez de decorar a fórmula com frações, olhe diretamente para o **subgrupo da condição $B$** como seu novo denominador.\n- **Regra da Multiplicação — Conectivo \"E\" ($A \\cap B$):**\n  - Para que dois eventos ocorram em sequência ($A$ **e** $B$):\n  - $P(A \\cap B) = P(A) \\cdot P(B | A)$\n  - Em sorteios **sem reposição**, lembre-se de diminuir $1$ do total da urna a cada retirada!\n- **Eventos Independentes:**\n  - Quando a ocorrência de $A$ não altera a chance de $B$ ($P(B|A) = P(B)$), basta multiplicar diretamente:\n  - $P(A \\text{ e } B) = P(A) \\cdot P(B)$.',
        habilidades: [
          {
            id: 'PR5',
            nome: 'Probabilidade condicional ("sabendo-se que" / redução do espaço amostral)',
            foco: 'Restringir o denominador do cálculo exatamente ao subconjunto informado na condição ("dado que / sabendo que").'
          },
          {
            id: 'PR6',
            nome: 'Multiplicação de probabilidades ("E") em eventos independentes e sem reposição',
            foco: 'Multiplicar probabilidades de etapas sucessivas (com ou sem reposição) e considerar permutações quando houver ordem variável.'
          }
        ],
        questoes: [
          {
            id: 'prob_b3_q1',
            habilidadeId: 'PR5',
            contexto: 'Probabilidade Condicional em Tabela',
            enunciado: 'Em um hospital com 100 médicos, 60 são mulheres (das quais 15 são pediatras) e 40 são homens (dos quais 5 são pediatras). Escolhendo-se um médico ao acaso e sabendo-se que a pessoa escolhida é mulher, qual é a probabilidade de ela ser pediatra?',
            alternativas: {
              A: '15/60 = 1/4 (25%).',
              B: '15/100 = 15%.',
              C: '15/20 = 3/4 (75%).'
            },
            correta: 'A'
          },
          {
            id: 'prob_b3_q2',
            habilidadeId: 'PR5',
            contexto: 'Redução do Espaço Amostral no Dado',
            enunciado: 'Um dado honesto de 6 faces foi lançado e o observador informa: "O número sorteado é par". Com base nessa informação, qual é a probabilidade de o número sorteado ser maior do que 3?',
            alternativas: {
              A: '2/3 (pois entre {2, 4, 6}, dois números são maiores que 3).',
              B: '2/6 = 1/3.',
              C: '3/6 = 1/2.'
            },
            correta: 'A'
          },
          {
            id: 'prob_b3_q3',
            habilidadeId: 'PR6',
            contexto: 'Eventos Independentes Sucessivos',
            enunciado: 'De acordo com a meteorologia, a probabilidade de chover no sábado é de 40% (0,4) e a de chover no domingo é de 30% (0,3), sendo eventos independentes. Qual a probabilidade de chover no sábado E também no domingo?',
            alternativas: {
              A: '12% (0,4 × 0,3 = 0,12).',
              B: '70% (40% + 30%).',
              C: '35%.'
            },
            correta: 'A'
          },
          {
            id: 'prob_b3_q4',
            habilidadeId: 'PR6',
            contexto: 'Retirada Sucessiva Sem Reposição',
            enunciado: 'Uma caixa contém 6 lâmpadas boas e 4 queimadas (total de 10 lâmpadas). Retirando-se 2 lâmpadas sucessivamente e sem reposição, qual é a probabilidade de ambas as lâmpadas retiradas estarem queimadas?',
            alternativas: {
              A: '4/10 × 3/9 = 12/90 = 2/15.',
              B: '4/10 × 4/10 = 16/100.',
              C: '4/10 + 3/9 = 11/15.'
            },
            correta: 'A'
          }
        ]
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════════════════
     4. QUÍMICA — LIGAÇÕES QUÍMICAS E INTERAÇÕES
     ══════════════════════════════════════════════════════════════════════════ */
  {
    id: 'quimica_ligacoes',
    materiaId: 'quimica',
    materia: 'Química',
    assuntoId: 'ligacoes',
    assunto: 'Ligações Químicas e Interações',
    icone: '🧪',
    cor: 'lav',
    descricao: 'Estudo integrado das ligações interatômicas (iônica, covalente e metálica), geometria molecular, polaridade e forças intermoleculares (hidrogênio, dipolo-dipolo e dipolo induzido) aplicadas a solubilidade e ponto de ebulição.',
    blocos: [
      {
        id: 'bloco_1',
        ordem: 1,
        titulo: 'Regra do Octeto, Ligação Iônica e Propriedades dos Compostos Iônicos',
        tempoEstimado: '6–8 min',
        descricao: 'Estabilidade eletrônica, transferência de elétrons entre metais e ametais, fórmula de compostos iônicos, retículo cristalino e condutividade elétrica.',
        resumo: '### Conceitos Essenciais\n- **Teoria do Octeto e Valência:** Os átomos ligam-se buscando estabilidade eletrônica semelhante à dos gases nobres ($8$ elétrons na camada de valência, ou $2$ elétrons para o $\\text{H}$, $\\text{He}$, $\\text{Li}$ e $\\text{Be}$).\n- **Ligação Iônica (Eletrovalente):**\n  - Ocorre com **transferência definitiva de elétrons** devido à grande diferença de eletronegatividade: **Metal** (baixa eletronegatividade, doa elétrons e vira **cátion**, $X^{y+}$) + **Ametal ou Hidrogênio** (alta eletronegatividade, recebe elétrons e vira **ânion**, $A^{x-}$).\n  - Regra prática de formulação (carga cruzada): $X^{y+} + A^{x-} \\rightarrow X_x A_y$ (ex: $\\text{Al}^{3+} + \\text{O}^{2-} \\rightarrow \\text{Al}_2\\text{O}_3$; $\\text{Ca}^{2+} + \\text{Cl}^- \\rightarrow \\text{CaCl}_2$).\n- **Propriedades dos Compostos Iônicos (Muito Cobrado no ENEM!):**\n  - Formam retículos cristalinos **sólidos à temperatura ambiente**, duros e quebradiços.\n  - Possuem **altíssimos pontos de fusão (PF) e de ebulição (PE)**.\n  - **Condutividade Elétrica:** **NÃO conduzem** corrente elétrica no estado **sólido** (os íons estão presos no retículo), mas **conduzem muito bem** quando **fundidos (líquidos)** ou **dissolvidos em água (solução aquosa)**, pois possuem **íons livres**!',
        habilidades: [
          {
            id: 'LQ1',
            nome: 'Regra do octeto, transferência de elétrons e fórmula de compostos iônicos',
            foco: 'Determinar a fórmula correta cruzando a carga do cátion metálico com a do ânion ametálico.'
          },
          {
            id: 'LQ2',
            nome: 'Propriedades dos compostos iônicos (PF/PE e condutividade elétrica)',
            foco: 'Lembrar que compostos iônicos só conduzem eletricidade quando fundidos ou em solução aquosa (íons livres).'
          }
        ],
        questoes: [
          {
            id: 'lig_b1_q1',
            habilidadeId: 'LQ1',
            contexto: 'Fórmula do Composto Iônico',
            enunciado: 'Um elemento químico X da família dos metais alcalinoterrosos (Grupo 2, possui 2 elétrons na camada de valência) combina-se com o elemento Y da família dos halogênios (Grupo 17, possui 7 elétrons na camada de valência). O tipo de ligação e a fórmula mínima do composto formado são:',
            alternativas: {
              A: 'Ligação iônica e fórmula XY₂.',
              B: 'Ligação iônica e fórmula X₂Y.',
              C: 'Ligação covalente e fórmula XY₂.'
            },
            correta: 'A'
          },
          {
            id: 'lig_b1_q2',
            habilidadeId: 'LQ1',
            contexto: 'Óxido de Alumínio (Bauxita)',
            enunciado: 'O alumínio (Al, grupo 13, forma cátion Al³⁺) combina-se com o oxigênio (O, grupo 16, forma ânion O²⁻) formando a alumina, principal componente da bauxita. A fórmula química eletricamente neutra desse óxido é:',
            alternativas: {
              A: 'Al₂O₃.',
              B: 'Al₃O₂.',
              C: 'AlO.'
            },
            correta: 'A'
          },
          {
            id: 'lig_b1_q3',
            habilidadeId: 'LQ2',
            contexto: 'Condutividade Elétrica do Sal de Cozinha',
            enunciado: 'Um estudante testa uma lâmpada ligada a dois eletrodos: no copo 1 com cloreto de sódio sólido (NaCl puro), a lâmpada não acende; no copo 2 com NaCl dissolvido em água, a lâmpada acende intensamente. Isso ocorre porque:',
            alternativas: {
              A: 'A água doa elétrons livres para os átomos neutros de sódio.',
              B: 'No estado sólido os íons Na⁺ e Cl⁻ estão fixos no retículo cristalino, enquanto em solução aquosa sofrem dissociação e ficam livres para se movimentar.',
              C: 'O NaCl sólido é um composto covalente apolar que se transforma em iônico apenas ao reagir com a água.'
            },
            correta: 'B'
          },
          {
            id: 'lig_b1_q4',
            habilidadeId: 'LQ2',
            contexto: 'Identificação de Substância por Propriedades',
            enunciado: 'Uma substância pura apresenta ponto de fusão de 801 °C, é sólida e quebradiça a 25 °C, não conduz eletricidade quando sólida, mas conduz corrente elétrica no estado líquido (fundida). Essa substância apresenta ligação predominantemente:',
            alternativas: {
              A: 'Metálica.',
              B: 'Iônica.',
              C: 'Covalente molecular.'
            },
            correta: 'B'
          }
        ]
      },
      {
        id: 'bloco_2',
        ordem: 2,
        titulo: 'Ligação Covalente (Simples, Dupla, Tripla e Dativa), Ligação Metálica e Ligas',
        tempoEstimado: '6–8 min',
        descricao: 'Compartilhamento de pares de elétrons entre ametais/hidrogênio, estruturas de Lewis, modelo do mar de elétrons e propriedades dos metais e ligas.',
        resumo: '### Conceitos Essenciais\n- **Ligação Covalente (Molecular):**\n  - Ocorre por **compartilhamento de pares de elétrons** entre átomos de alta eletronegatividade: **Ametal + Ametal**, **Ametal + Hidrogênio** ou **Hidrogênio + Hidrogênio**.\n  - **Ligação Simples ($-$):** 1 par compartilhado (ex: $\\text{H}-\\text{Cl}$, $\\text{Cl}-\\text{Cl}$). É uma ligação $\\sigma$ (sigma).\n  - **Ligação Dupla ($=$):** 2 pares compartilhados (ex: $\\text{O}=\\text{C}=\\text{O}$ no $\\text{CO}_2$; $\\text{O}=\\text{O}$ no $\\text{O}_2$). Contém $1\\,\\sigma + 1\\,\\pi$.\n  - **Ligação Tripla ($\\equiv$):** 3 pares compartilhados (ex: $\\text{N}\\equiv\\text{N}$ no gás nitrogênio $\\text{N}_2$). Contém $1\\,\\sigma + 2\\,\\pi$.\n  - **Ligação Dativa (Coordenada):** O par eletrônico compartilhado provém de um único átomo que já atingiu seu octeto (ex: $\\text{SO}_2$, $\\text{SO}_3$, $\\text{O}_3$).\n- **Ligação Metálica e Modelo do \"Mar de Elétrons\":**\n  - Ocorre entre **Metais**. Os átomos metálicos perdem facilmente seus elétrons de valência, formando cátions fixos mergulhados em uma nuvem de **elétrons livres deslocalizados (\"mar de elétrons\")**.\n  - **Propriedades dos Metais:** Excelentes condutores elétricos e térmicos **no estado sólido e líquido**, maleáveis (lâminas) e dúcteis (fios).\n  - **Ligas Metálicas:** Misturas homogêneas de metais (ex: **Aço** = $\\text{Fe} + \\text{C}$; **Bronze** = $\\text{Cu} + \\text{Sn}$; **Latão** = $\\text{Cu} + \\text{Zn}$; **Ouro 18k** = $75\\%\\text{ Au} + 25\\%\\text{ Cu/Ag}$).',
        habilidades: [
          {
            id: 'LQ3',
            nome: 'Ligação covalente (simples, dupla, tripla e coordenada) e estruturas de Lewis',
            foco: 'Contar os pares de elétrons compartilhados e pares isolados nas moléculas de H₂O, CO₂, NH₃, N₂, O₂ e CH₄.'
          },
          {
            id: 'LQ4',
            nome: 'Ligação metálica ("mar de elétrons"), propriedades dos metais e ligas metálicas',
            foco: 'Relacionar a condutividade no estado sólido, maleabilidade e ductilidade dos metais ao modelo do mar de elétrons livres.'
          }
        ],
        questoes: [
          {
            id: 'lig_b2_q1',
            habilidadeId: 'LQ3',
            contexto: 'Ligações nas Moléculas Atmosféricas',
            enunciado: 'Sabendo que o Nitrogênio (N, grupo 15) possui 5 elétrons na camada de valência e o Oxigênio (O, grupo 16) possui 6 elétrons na camada de valência, as moléculas de gás nitrogênio (N₂) e gás carbônico (CO₂, onde C é do grupo 14) apresentam, respectivamente:',
            alternativas: {
              A: 'Uma ligação covalente tripla (N≡N) e duas ligações covalentes duplas (O=C=O).',
              B: 'Uma ligação covalente dupla (N=N) e duas ligações covalentes simples (O-C-O).',
              C: 'Ligações iônicas por transferência de elétrons.'
            },
            correta: 'A'
          },
          {
            id: 'lig_b2_q2',
            habilidadeId: 'LQ3',
            contexto: 'Pares Isolados na Amônia (NH₃)',
            enunciado: 'Na molécula de amônia (NH₃), o átomo central de nitrogênio (5 elétrons de valência) estabelece três ligações covalentes simples com três átomos de hidrogênio. Quantos pares de elétrons não ligantes (isolados) restam sobre o átomo de nitrogênio?',
            alternativas: {
              A: '1 par de elétrons não ligantes (2 elétrons).',
              B: '2 pares de elétrons não ligantes (4 elétrons).',
              C: 'Nenhum par não ligante, pois todos os elétrons participam das ligações.'
            },
            correta: 'A'
          },
          {
            id: 'lig_b2_q3',
            habilidadeId: 'LQ4',
            contexto: 'Modelo do Mar de Elétrons',
            enunciado: 'O cobre (Cu) e o alumínio (Al) são largamente utilizados em fiações de transmissão elétrica e cabos porque conduzem corrente elétrica no estado sólido e podem ser esticados em fios finos (ductilidade). Essas propriedades decorrem:',
            alternativas: {
              A: 'Da presença de íons positivos e negativos livres para migrar na rede cristalina sólida.',
              B: 'Da ligação metálica, na qual cátions metálicos são mantidos unidos por uma nuvem de elétrons livres deslocalizados ("mar de elétrons").',
              C: 'De ligações covalentes apolares que se rompem facilmente sob tensão elétrica.'
            },
            correta: 'B'
          },
          {
            id: 'lig_b2_q4',
            habilidadeId: 'LQ4',
            contexto: 'Ligas Metálicas no Cotidiano',
            enunciado: 'Ao contrário dos compostos iônicos (que se quebram quando golpeados), uma barra de aço ou bronze pode ser laminada em chapas (maleabilidade) sem se fragmentar. Isso acontece porque, ao deslizar uma camada de cátions metálicos:',
            alternativas: {
              A: 'O "mar de elétrons" livres acompanha o deslocamento dos cátions, mantendo a coesão eletrostática da estrutura.',
              B: 'Os átomos metálicos formam novas ligações covalentes triplas instantaneamente.',
              C: 'Os ânions metálicos neutralizam a repulsão entre os núcleos.'
            },
            correta: 'A'
          }
        ]
      },
      {
        id: 'bloco_3',
        ordem: 3,
        titulo: 'Geometria Molecular, Polaridade e Forças Intermoleculares (Solubilidade e Ponto de Ebulição)',
        tempoEstimado: '8–10 min',
        descricao: 'Geometria VSEPR, moléculas polares vs. apolares, forças intermoleculares (dipolo induzido, dipolo permanente e ligação de hidrogênio), regra "semelhante dissolve semelhante", tensoativos e ponto de ebulição.',
        resumo: '### Conceitos Essenciais\n- **Geometria Molecular e Polaridade:**\n  - **Linear:** Toda diatômica (ex: $\\text{H}_2$, $\\text{HCl}$) ou triatômica sem par isolado no átomo central (ex: $\\text{CO}_2$, $\\text{O}=\\text{C}=\\text{O} \\rightarrow$ vetores se anulam $\\rightarrow$ **APOLAR**).\n  - **Angular:** Triatômica COM par isolado no átomo central (ex: **Água, $\\text{H}_2\\text{O}$** e $\\text{SO}_2 \\rightarrow$ **POLAR**).\n  - **Trigonal Plana:** $\\text{BF}_3$, $\\text{SO}_3$ (sem par isolado $\\rightarrow$ apolar com ligantes iguais).\n  - **Piramidal:** **Amônia ($\text{NH}_3$)** (3 ligantes + 1 par isolado no $\\text{N} \\rightarrow$ **POLAR**).\n  - **Tetraédrica:** **Metano ($\text{CH}_4$)** e $\\text{CCl}_4$ (4 ligantes iguais sem par isolado $\\rightarrow$ **APOLAR**). Hidrocarbonetos ($\\text{C}_x\\text{H}_y$, gasolina, óleos) são sempre **apolares**!\n- **Forças Intermoleculares (Da Mais Fraca para a Mais Forte):**\n  1. **Dipolo Induzido (Forças de London / Van der Waals):** Atua em moléculas **APOLARES** (ex: $\\text{CH}_4$, $\\text{CO}_2$, $\\text{O}_2$, gasolina). Aumenta com a superfície de contato/massa molar.\n  2. **Dipolo Permanente (Dipolo-Dipolo):** Atua em moléculas **POLARES** sem $\\text{H}$ ligado a $\\text{F, O, N}$ (ex: $\\text{HCl}$, $\\text{SO}_2$, acetona).\n  3. **Ligação de Hidrogênio (Ponte de Hidrogênio):** A mais intensa! Ocorre quando o **$H$ está ligado diretamente a Flúor, Oxigênio ou Nitrogênio ($\\text{F, O, N}$)** (ex: $\\text{H}_2\\text{O}$, álcoois $-\\text{OH}$, $\\text{NH}_3$, $\\text{HF}$, DNA).\n- **Impacto no Ponto de Ebulição (PE) e Solubilidade (\"Semelhante Dissolve Semelhante\"):**\n  - Quanto **mais forte** a interação intermolecular, **maior o Ponto de Ebulição (PE)** e **menor a volatilidade** (pressão de vapor).\n  - **Hidrofílico (Polar)** dissolve em água ($\\text{H}_2\\text{O}$, polar, faz ligação de $\\text{H}$); **Lipofílico/Hidrofóbico (Apolar)** dissolve em óleo/gasolina (apolar). **Sabões e detergentes (anfifílicos)** têm cauda apolar (prende na gordura) e cabeça polar/iônica (interage com a água).',
        habilidades: [
          {
            id: 'LQ5',
            nome: 'Geometria molecular (VSEPR) e polaridade das moléculas (CO₂ vs. H₂O, CH₄ vs. NH₃)',
            foco: 'Diferenciar CO₂ (linear e apolar) de H₂O (angular e polar) pela presença de pares de elétrons isolados no átomo central.'
          },
          {
            id: 'LQ6',
            nome: 'Forças intermoleculares (Dipolo Induzido, Dipolo Permanente e Ligação de Hidrogênio) e Ponto de Ebulição',
            foco: 'Identificar ligações de hidrogênio (H ligado a F, O, N) e relacionar forças intermoleculares mais intensas a maiores pontos de ebulição.'
          },
          {
            id: 'LQ7',
            nome: 'Polaridade, solubilidade ("semelhante dissolve semelhante"), vitaminas e tensoativos (sabões/detergentes)',
            foco: 'Explicar a solubilidade em água (hidrossolúvel/polar) vs. gordura (lipossolúvel/apolar) e a ação anfifílica dos detergentes.'
          }
        ],
        questoes: [
          {
            id: 'lig_b3_q1',
            habilidadeId: 'LQ5',
            contexto: 'Geometria e Polaridade: Água vs. Gás Carbônico',
            enunciado: 'Embora tanto a molécula de água (H₂O) quanto a de dióxido de carbono (CO₂) sejam formadas por três átomos e possuam ligações covalentes polares, a H₂O é uma molécula polar e o CO₂ é apolar. Essa diferença ocorre porque:',
            alternativas: {
              A: 'A H₂O possui geometria angular (devido aos pares de elétrons isolados no oxigênio), enquanto o CO₂ possui geometria linear simétrica que anula os vetores momento dipolar.',
              B: 'O CO₂ possui geometria angular e a H₂O possui geometria linear.',
              C: 'As ligações C=O no gás carbônico são puramente iônicas.'
            },
            correta: 'A'
          },
          {
            id: 'lig_b3_q2',
            habilidadeId: 'LQ5',
            contexto: 'Metano (CH₄) vs. Amônia (NH₃)',
            enunciado: 'As moléculas de metano (CH₄) e amônia (NH₃) apresentam ao redor do átomo central, respectivamente, as geometrias e polaridades:',
            alternativas: {
              A: 'Tetraédrica (apolar) e piramidal (polar).',
              B: 'Quadrada plana (polar) e trigonal plana (apolar).',
              C: 'Piramidal (apolar) e tetraédrica (polar).'
            },
            correta: 'A'
          },
          {
            id: 'lig_b3_q3',
            habilidadeId: 'LQ6',
            contexto: 'Ligação de Hidrogênio e Ponto de Ebulição',
            enunciado: 'O etanol (CH₃CH₂OH, massa molar 46 g/mol) ferve a 78 °C, enquanto o éter dimetílico (CH₃OCH₃, mesma massa molar de 46 g/mol) é um gás a 25 °C (ferve a -24 °C). O ponto de ebulição muito mais elevado do etanol deve-se ao fato de suas moléculas interagirem por:',
            alternativas: {
              A: 'Ligações de hidrogênio (pontes de hidrogênio), devido à presença da hidroxila (-OH), que são muito mais intensas que o dipolo permanente do éter.',
              B: 'Forças de dipolo induzido mais intensas na cadeia carbônica.',
              C: 'Ligações iônicas entre o oxigênio e o hidrogênio.'
            },
            correta: 'A'
          },
          {
            id: 'lig_b3_q4',
            habilidadeId: 'LQ6',
            contexto: 'Volatilidade e Interações Intermoleculares',
            enunciado: 'Três líquidos puros (propano, acetona e água) estão em frascos abertos à mesma temperatura. Sabendo que o propano faz apenas dipolo induzido, a acetona faz dipolo permanente e a água faz ligação de hidrogênio, a ordem crescente de Ponto de Ebulição é:',
            alternativas: {
              A: 'Propano < Acetona < Água.',
              B: 'Água < Acetona < Propano.',
              C: 'Acetona < Propano < Água.'
            },
            correta: 'A'
          },
          {
            id: 'lig_b3_q5',
            habilidadeId: 'LQ7',
            contexto: 'Ação Limpante do Sabão e Detergente',
            enunciado: 'Para remover manchas de gordura (óleo, apolar) de um prato usando água (polar), utiliza-se detergente. As moléculas de detergente conseguem formar micelas e remover a sujeira porque são substâncias anfifílicas (ou anfipáticas), ou seja:',
            alternativas: {
              A: 'Possuem uma longa cadeia carbônica apolar (hidrofóbica) que se dissolve na gordura e uma extremidade polar/iônica (hidrofílica) que interage com a água.',
              B: 'Transformam quimicamente a água em um hidrocarboneto apolar.',
              C: 'São totalmente apolares e evaporam junto com a gordura.'
            },
            correta: 'A'
          },
          {
            id: 'lig_b3_q6',
            habilidadeId: 'LQ7',
            contexto: 'Teor de Etanol na Gasolina e Vitaminas',
            enunciado: 'No teste para medir o teor de etanol na gasolina (formada por hidrocarbonetos apolares), adiciona-se água com sal e agita-se a mistura. O etanol migra da gasolina para a fase aquosa porque:',
            alternativas: {
              A: 'A molécula de etanol possui o grupo polar -OH capaz de estabelecer ligações de hidrogênio com as moléculas de água.',
              B: 'O etanol é um hidrocarboneto totalmente apolar e insolúvel em gasolina.',
              C: 'A gasolina faz ligações de hidrogênio mais fortes com a água do que com o etanol.'
            },
            correta: 'A'
          }
        ]
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════════════════
     5. QUÍMICA — ESTEQUIOMETRIA
     ══════════════════════════════════════════════════════════════════════════ */
  {
    id: 'quimica_estequiometria',
    materiaId: 'quimica',
    materia: 'Química',
    assuntoId: 'estequiometria',
    assunto: 'Estequiometria',
    icone: '⚖️',
    cor: 'yellow',
    descricao: 'O tema de cálculos mais cobrado em Química no ENEM: conceito de mol, massa molar, constante de Avogadro, leis de Lavoisier e Proust, balanceamento e cálculos estequiométricos com pureza, rendimento e reagente limitante.',
    blocos: [
      {
        id: 'bloco_1',
        ordem: 1,
        titulo: 'Massa Atômica, Massa Molar, Conceito de Mol e Constante de Avogadro',
        tempoEstimado: '6–8 min',
        descricao: 'Cálculo de massa molar (g/mol), relação n = m / M, Constante de Avogadro (6,0 × 10²³ entidades/mol) e Volume Molar nas CNTP.',
        resumo: '### Conceitos Essenciais\n- **Massa Atômica ($\\text{u}$) vs. Massa Molar ($M$, em $\\text{g/mol}$):**\n  - São numericamente iguais! Ex: Se $\\text{H} = 1\\text{ u}$, $\\text{C} = 12\\text{ u}$ e $\\text{O} = 16\\text{ u}$:\n  - Massa molar da água ($\\text{H}_2\\text{O}$): $M = 2(1) + 16 = 18\\text{ g/mol}$.\n  - Massa molar do gás carbônico ($\\text{CO}_2$): $M = 12 + 2(16) = 44\\text{ g/mol}$.\n- **Conceito de Mol e Quantidade de Matéria ($n$):**\n  - $n = \\frac{m}{M}$ (onde $m$ é a massa em gramas e $M$ é a massa molar em $\\text{g/mol}$).\n- **Constante de Avogadro ($N_A$):**\n  - $1\\text{ mol}$ de qualquer espécie química contém sempre $6,0 \\times 10^{23}$ entidades elementares (átomos, moléculas ou íons).\n- **Volume Molar de Gases ($V_m$):**\n  - Nas CNTP ($0\\,^\\circ\\text{C}$ e $1\\text{ atm}$), $1\\text{ mol}$ de qualquer gás ideal ocupa aproximadamente $22,4\\text{ L}$ (ou $\\approx 24,5\\text{ L}$ nas condições ambientes a $25\\,^\\circ\\text{C}$, conforme informado pela questão).\n- **Ponte Universal do Mol:**\n  - $1\\text{ mol} \\iff M\\text{ (em gramas)} \\iff 6,0 \\times 10^{23}\\text{ moléculas} \\iff 22,4\\text{ L (gás nas CNTP)}$.',
        habilidades: [
          {
            id: 'EQ1',
            nome: 'Cálculo de Massa Molar (g/mol) e conversão entre massa (g) e quantidade de matéria (mol)',
            foco: 'Somar as massas atômicas multiplicadas pelos índices da fórmula molecular e aplicar n = m / M.'
          },
          {
            id: 'EQ2',
            nome: 'Constante de Avogadro (6,0 × 10²³) e Volume Molar de gases',
            foco: 'Relacionar massa em gramas ao número de moléculas/átomos usando a Constante de Avogadro e ao volume gasoso.'
          }
        ],
        questoes: [
          {
            id: 'est_b1_q1',
            habilidadeId: 'EQ1',
            contexto: 'Massa Molar e Quantidade de Matéria da Glicose',
            enunciado: 'A glicose tem fórmula molecular C₆H₁₂O₆ (Massas molares: C = 12 g/mol; H = 1 g/mol; O = 16 g/mol). Qual é a massa molar da glicose e quantos mols existem em uma amostra de 90 gramas dessa substância?',
            alternativas: {
              A: '180 g/mol e 0,5 mol.',
              B: '180 g/mol e 2,0 mols.',
              C: '90 g/mol e 1,0 mol.'
            },
            correta: 'A'
          },
          {
            id: 'est_b1_q2',
            habilidadeId: 'EQ1',
            contexto: 'Dosagem de Carbonato de Cálcio',
            enunciado: 'Um comprimido suplementar contém 0,01 mol de carbonato de cálcio (CaCO₃). Sabendo que as massas molares são Ca = 40 g/mol, C = 12 g/mol e O = 16 g/mol, qual é a massa de CaCO₃ presente nesse comprimido?',
            alternativas: {
              A: '1,0 grama (1.000 mg).',
              B: '10,0 gramas.',
              C: '0,68 grama (680 mg).'
            },
            correta: 'A'
          },
          {
            id: 'est_b1_q3',
            habilidadeId: 'EQ2',
            contexto: 'Constante de Avogadro na Água',
            enunciado: 'Um copo contém 36 gramas de água pura (H₂O, massa molar = 18 g/mol). Adotando a constante de Avogadro igual a 6,0 × 10²³ mol⁻¹, o número total de moléculas de água nesse copo é:',
            alternativas: {
              A: '1,2 × 10²⁴ moléculas (2 mols).',
              B: '6,0 × 10²³ moléculas (1 mol).',
              C: '3,6 × 10²⁴ moléculas.'
            },
            correta: 'A'
          },
          {
            id: 'est_b1_q4',
            habilidadeId: 'EQ2',
            contexto: 'Volume Molar de Gás Carbônico',
            enunciado: 'Em determinadas condições de temperatura e pressão em que o volume molar dos gases é 25 L/mol, qual é o volume ocupado por 88 gramas de gás carbônico (CO₂, massa molar = 44 g/mol)?',
            alternativas: {
              A: '50 litros.',
              B: '25 litros.',
              C: '100 litros.'
            },
            correta: 'A'
          }
        ]
      },
      {
        id: 'bloco_2',
        ordem: 2,
        titulo: 'Leis Ponderais (Lavoisier e Proust), Balanceamento e Proporção Estequiométrica Padrão',
        tempoEstimado: '8–10 min',
        descricao: 'Conservação da massa (Lavoisier), proporções definidas (Proust), balanceamento de equações químicas e regra de três estequiométrica.',
        resumo: '### Conceitos Essenciais\n- **Leis Ponderais das Reações Químicas:**\n  - **Lei de Lavoisier (Conservação das Massas):** Em um sistema fechado, a soma das massas dos reagentes é igual à soma das massas dos produtos ($m_{\\text{reagentes}} = m_{\\text{produtos}}$).\n  - **Lei de Proust (Proporções Definidas):** As substâncias reagem e são produzidas sempre em uma razão constante e fixa de massas (e de mols).\n- **Balanceamento de Equações (Método das Tentativas — Regra \"MACHO\"):**\n  - Ajuste os coeficientes estequiométricos na ordem: **M**etais $\\rightarrow$ **A**metais (exceto C, H, O) $\\rightarrow$ **C**arbono $\\rightarrow$ **H**idrogênio $\\rightarrow$ **O**xigênio.\n  - Exemplo (Combustão completa do metano): $1\\,\\text{CH}_4 + 2\\,\\text{O}_2 \\rightarrow 1\\,\\text{CO}_2 + 2\\,\\text{H}_2\\text{O}$.\n- **Passo a Passo da Estequiometria Padrão no ENEM:**\n  1. Escreva e **confira o balanceamento** da equação química.\n  2. Na **1ª linha** da regra de três, coloque a proporção da equação (convertida para a grandeza pedida: massa em $\\text{g}$, $\\text{mol}$ ou volume em $\\text{L}$).\n  3. Na **2ª linha**, coloque o dado da questão e o $x$ que você quer descobrir.',
        habilidades: [
          {
            id: 'EQ3',
            nome: 'Leis Ponderais (Lavoisier e Proust) e balanceamento de equações químicas',
            foco: 'Aplicar a conservação das massas e igualar o número de átomos de cada elemento nos reagentes e produtos.'
          },
          {
            id: 'EQ4',
            nome: 'Cálculo estequiométrico padrão (relações massa-massa, massa-mol e massa-volume)',
            foco: 'Montar a regra de três estequiométrica relacionando os coeficientes balanceados com as massas molares.'
          }
        ],
        questoes: [
          {
            id: 'est_b2_q1',
            habilidadeId: 'EQ3',
            contexto: 'Lei de Lavoisier e Proust na Combustão',
            enunciado: 'Em um recipiente fechado, 12 g de carbono reagem completamente com 32 g de gás oxigênio formando gás carbônico. Se colocarmos 24 g de carbono para reagir completamente na mesma proporção, qual será a massa de oxigênio consumida e a massa de gás carbônico formada?',
            alternativas: {
              A: '64 g de oxigênio consumidos e 88 g de gás carbônico formados.',
              B: '32 g de oxigênio consumidos e 56 g de gás carbônico formados.',
              C: '64 g de oxigênio consumidos e 44 g de gás carbônico formados.'
            },
            correta: 'A'
          },
          {
            id: 'est_b2_q2',
            habilidadeId: 'EQ3',
            contexto: 'Balanceamento da Combustão do Etanol',
            enunciado: 'Na equação não balanceada da combustão completa do etanol: x C₂H₆O + y O₂ → z CO₂ + w H₂O, os menores coeficientes inteiros (x, y, z, w) que tornam a equação corretamente balanceada são:',
            alternativas: {
              A: '1, 3, 2, 3.',
              B: '1, 2, 2, 3.',
              C: '2, 3, 4, 6.'
            },
            correta: 'A'
          },
          {
            id: 'est_b2_q3',
            habilidadeId: 'EQ4',
            contexto: 'Estequiometria da Cal Virgem (CaCO₃ → CaO + CO₂)',
            enunciado: 'A decomposição térmica do calcário segue a equação: CaCO₃(s) → CaO(s) + CO₂(g). Sabendo que as massas molares são CaCO₃ = 100 g/mol, CaO = 56 g/mol e CO₂ = 44 g/mol, qual a massa de cal virgem (CaO) produzida pela decomposição completa de 500 kg de CaCO₃ puro?',
            alternativas: {
              A: '280 kg.',
              B: '220 kg.',
              C: '560 kg.'
            },
            correta: 'A'
          },
          {
            id: 'est_b2_q4',
            habilidadeId: 'EQ4',
            contexto: 'Produção Industrial de Amônia (Haber-Bosch)',
            enunciado: 'Dada a síntese da amônia balanceada: N₂(g) + 3 H₂(g) → 2 NH₃(g) (Massas molares: N₂ = 28 g/mol; NH₃ = 17 g/mol). Partindo-se de 56 gramas de gás nitrogênio (N₂) com excesso de hidrogênio, qual é a massa máxima de amônia (NH₃) obtida?',
            alternativas: {
              A: '68 gramas.',
              B: '34 gramas.',
              C: '56 gramas.'
            },
            correta: 'A'
          }
        ]
      },
      {
        id: 'bloco_3',
        ordem: 3,
        titulo: 'Cálculo Estequiométrico com Grau de Pureza, Rendimento da Reação e Reagente Limitante/Excesso',
        tempoEstimado: '8–10 min',
        descricao: 'Desconto de impurezas antes da reação, aplicação do rendimento percentual no produto e identificação do reagente limitante e em excesso.',
        resumo: '### Conceitos Essenciais\n- **Grau de Pureza ($p\\%$):**\n  - Minérios e reagentes comerciais contêm impurezas que **não reagem**!\n  - Desconte as impurezas logo no início: $m_{\\text{pura}} = m_{\\text{amostra bruta}} \\times \\frac{\\text{pureza}}{100}$. Só use a **massa pura** na regra de três estequiométrica!\n- **Rendimento da Reação ($R\\%$):**\n  - Na prática, reações raramente atingem $100\\%$ do valor teórico esperado.\n  - $m_{\\text{obtida (real)}} = m_{\\text{teórica (100\\%)}} \\times \\frac{R}{100}$ (ou $R = \\frac{m_{\\text{real}}}{m_{\\text{teórica}}} \\times 100\\%$). Dica: Você pode multiplicar a linha da estequiometria por $(\\text{pureza} \\times \\text{rendimento})$!\n- **Reagente Limitante e Reagente em Excesso:**\n  - Quando a questão fornece as quantidades iniciais dos **DOIS reagentes**, um deles pode acabar primeiro (**Reagente Limitante**) e o outro sobrar sem reagir (**Reagente em Excesso**).\n  - **Toda a quantidade de produto formada é comandada pelo Reagente Limitante!**\n  - *Como descobrir o Limitante rapidamente:* Divida a quantidade fornecida de cada reagente pelo seu valor estequiométrico na 1ª linha. O **menor quociente** indica o **Reagente Limitante**!',
        habilidades: [
          {
            id: 'EQ5',
            nome: 'Cálculo estequiométrico envolvendo Grau de Pureza de minérios e reagentes',
            foco: 'Calcular primeiro a massa pura do reagente (m_pura = m_total × pureza) antes de aplicar a proporção estequiométrica.'
          },
          {
            id: 'EQ6',
            nome: 'Cálculo estequiométrico com Rendimento percentual da reação (< 100%)',
            foco: 'Multiplicar o produto teórico pelo rendimento (ou dividir pelo rendimento quando se quer produzir uma massa final fixa).'
          },
          {
            id: 'EQ7',
            nome: 'Identificação do Reagente Limitante e do Reagente em Excesso',
            foco: 'Comparar as quantidades dos dois reagentes com a proporção estequiométrica e usar sempre o reagente limitante para calcular o produto.'
          }
        ],
        questoes: [
          {
            id: 'est_b3_q1',
            habilidadeId: 'EQ5',
            contexto: 'Grau de Pureza da Bauxita ou Calcário',
            enunciado: 'Uma amostra de 200 g de calcário apresenta 80% de pureza em CaCO₃ (Massas molares: CaCO₃ = 100 g/mol; CO₂ = 44 g/mol). Na decomposição térmica total dessa amostra (CaCO₃ → CaO + CO₂), qual é a massa de CO₂ liberada, considerando que as impurezas não liberam gás?',
            alternativas: {
              A: '70,4 g.',
              B: '88,0 g.',
              C: '44,0 g.'
            },
            correta: 'A'
          },
          {
            id: 'est_b3_q2',
            habilidadeId: 'EQ5',
            contexto: 'Siderurgia e Pureza da Hematita',
            enunciado: 'Uma siderúrgica processa 1.000 kg de minério hematita contendo 80% de Fe₂O₃ puro (Massas molares: Fe₂O₃ = 160 g/mol; Fe = 56 g/mol), conforme a equação: Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂. Qual a massa de ferro metálico (Fe) obtida admitindo 100% de rendimento?',
            alternativas: {
              A: '560 kg.',
              B: '700 kg.',
              C: '800 kg.'
            },
            correta: 'A'
          },
          {
            id: 'est_b3_q3',
            habilidadeId: 'EQ6',
            contexto: 'Rendimento na Síntese do Ácido Acetilsalicílico (Aspirina)',
            enunciado: 'Em um laboratório, a reação de produção de um fármaco deveria gerar teoricamente 250 g de produto (100% de rendimento). Porém, devido a perdas no processo, o rendimento real da reação foi de 80%. Qual foi a massa efetivamente obtida?',
            alternativas: {
              A: '200 g.',
              B: '220 g.',
              C: '312,5 g.'
            },
            correta: 'A'
          },
          {
            id: 'est_b3_q4',
            habilidadeId: 'EQ6',
            contexto: 'Pureza e Rendimento Combinados',
            enunciado: 'Na reação A → B, 100 g de A puro produzem teoricamente 60 g de B. Se utilizarmos 200 g de uma amostra de A com 75% de pureza em um reator cujo rendimento é de 80%, a massa final de B produzida será:',
            alternativas: {
              A: '72 g.',
              B: '90 g.',
              C: '96 g.'
            },
            correta: 'A'
          },
          {
            id: 'est_b3_q5',
            habilidadeId: 'EQ7',
            contexto: 'Reagente Limitante na Formação da Água',
            enunciado: 'Dada a reação de síntese da água: 2 H₂(g) + 1 O₂(g) → 2 H₂O(l), em que 4 g de H₂ reagem exatamente com 32 g de O₂ para formar 36 g de H₂O. Se misturarmos em um reator 10 g de H₂ com 32 g de O₂, qual é o reagente limitante e qual a massa de água formada?',
            alternativas: {
              A: 'O O₂ é o reagente limitante; formam-se 36 g de água e sobram 6 g de H₂ em excesso.',
              B: 'O H₂ é o reagente limitante; formam-se 42 g de água.',
              C: 'Não há excesso e formam-se 42 g de água.'
            },
            correta: 'A'
          },
          {
            id: 'est_b3_q6',
            habilidadeId: 'EQ7',
            contexto: 'Neutralização com Excesso em Mols',
            enunciado: 'Considere a neutralização: H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O (1 mol de ácido reage com 2 mols de base). Misturando-se 3 mols de H₂SO₄ com 4 mols de NaOH, quantos mols do sal Na₂SO₄ serão formados?',
            alternativas: {
              A: '2 mols de Na₂SO₄ (pois o NaOH é o limitante e sobra 1 mol de H₂SO₄).',
              B: '3 mols de Na₂SO₄ (pois o H₂SO₄ comanda a reação).',
              C: '4 mols de Na₂SO₄.'
            },
            correta: 'A'
          }
        ]
      }
    ]
  }
];

/* ══════════════════════════════════════════════════════════════════════════
   RECURSOS POR HABILIDADE E TÓPICO (window.CatalogTopicResources)
   Chave única estrita: ${materiaId}_${assuntoId}_${blocoId}_${habilidadeId}
   ══════════════════════════════════════════════════════════════════════════ */
window.CatalogTopicResources = {
  /* ──────────────────────────────────────────────────────────────────────────
     1. FÍSICA — CINÉTICA E MECÂNICA (M1 a M12)
     ────────────────────────────────────────────────────────────────────────── */
  fisica_cinetica_bloco_1_M1: {
    foco: 'No ENEM, a conversão entre km/h e m/s (fator 3,6) aparece quase sempre associada ao tempo de reação do motorista ou ao tempo de chegada de ondas/sinais. Nunca calcule velocidade média fazendo a média aritmética simples das velocidades: use sempre Δs_total / Δt_total!',
    videos: [],
    sites: [
      {
        id: 'site_m1_1',
        titulo: 'Velocidade Média: Fórmula, Unidades e Exercícios',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/velocidade-media/',
        resumo: 'Explicação passo a passo de Δs/Δt, regra de conversão entre km/h e m/s e questões resolvidas do ENEM.'
      },
      {
        id: 'site_m1_2',
        titulo: 'Cinemática Escalar e Velocidade Escalar Média',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/velocidade-escalar-media.htm',
        resumo: 'Conceito de referencial, distância percorrida versus deslocamento e exemplos práticos de viagens com paradas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m1_1',
        ano: 'ENEM 2020',
        habilidadeId: 'M1',
        contexto: 'Recarga de Celular na Bicicleta',
        enunciado: 'Você foi contratado para sincronizar os quatro semáforos de uma avenida, indicados pelas letras O, A, B e C, conforme a figura. Os semáforos estão separados por uma distância de 500 m. Segundo os dados estatísticos da companhia controladora de trânsito, um veículo, que parte do repouso no semáforo O, tipicamente desenvolve velocidade constante de 36 km/h após 5 s de aceleração (percorrendo 25 m nessa arrancada inicial) até chegar ao semáforo C. Para que a "onda verde" funcione sem paradas, após quanto tempo da abertura do semáforo O o semáforo A (situado a 500 m de O) deve abrir?',
        alternativas: {
          A: '47,5 segundos.',
          B: '50,0 segundos.',
          C: '52,5 segundos.',
          D: '55,0 segundos.',
          E: '18,9 segundos.'
        },
        correta: 'C',
        resolucao: '1) Convertemos a velocidade constante para m/s: 36 km/h ÷ 3,6 = 10 m/s.\n2) Nos primeiros 5 segundos de aceleração, o veículo percorre 25 m. Como o semáforo A está a 500 m de O, faltam percorrer: Δs = 500 - 25 = 475 m.\n3) Em movimento uniforme a 10 m/s, o tempo para percorrer os 475 m restantes é: Δt = 475 / 10 = 47,5 s.\n4) Somando os 5 s iniciais de arrancada: t_total = 5 + 47,5 = 52,5 segundos.'
      }
    ]
  },

  fisica_cinetica_bloco_1_M2: {
    foco: 'A função horária s = s₀ + v·t é uma função do 1º grau (afim). Nos gráficos s × t do ENEM, trechos horizontais indicam que o móvel está PARADO (v = 0), e trechos mais inclinados indicam MAIOR velocidade escalar.',
    videos: [],
    sites: [
      {
        id: 'site_m2_1',
        titulo: 'Movimento Retilíneo Uniforme (MRU): Equação e Gráficos',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/movimento-retilineo-uniforme/',
        resumo: 'Estudo da função horária da posição s = s₀ + v·t, classificação em progressivo/retrógrado e análise gráfica.'
      },
      {
        id: 'site_m2_2',
        titulo: 'Movimento Uniforme e Função Horária dos Espaços',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/movimento-uniforme.htm',
        resumo: 'Exemplos de determinação de posição inicial, velocidade e instante de passagem pela origem.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m2_1',
        ano: 'ENEM 2021',
        habilidadeId: 'M2',
        contexto: 'Sincronização de Estações Sísmicas',
        enunciado: 'No estudo de abalos sísmicos, ondas primárias (ondas P) e ondas secundárias (ondas S) propagam-se pela crosta terrestre em linha reta e com velocidades constantes de v_P = 8,0 km/s e v_S = 5,0 km/s, respectivamente. Uma estação sismográfica registra a chegada da onda S exatamente 30 segundos após a chegada da onda P do mesmo terremoto. A que distância (d) dessa estação ocorreu o epicentro do terremoto?',
        alternativas: {
          A: '90 km.',
          B: '150 km.',
          C: '240 km.',
          D: '390 km.',
          E: '400 km.'
        },
        correta: 'E',
        resolucao: '1) Como ambas as ondas percorrem a mesma distância d em movimento uniforme: t_P = d / 8 e t_S = d / 5.\n2) A diferença de tempo de chegada é Δt = t_S - t_P = 30 s.\n3) Montando a equação: (d / 5) - (d / 8) = 30.\n4) Tirando o MMC(5, 8) = 40: (8d - 5d) / 40 = 30 ⇒ 3d = 1.200 ⇒ d = 400 km.'
      }
    ]
  },

  fisica_cinetica_bloco_1_M3: {
    foco: 'Em ultrapassagens de caminhões, trens, pontes ou túneis, desenhe o início e o fim da manobra: a frente do veículo deve percorrer a soma dos dois comprimentos (L₁ + L₂) dividida pela velocidade relativa.',
    videos: [],
    sites: [
      {
        id: 'site_m3_1',
        titulo: 'Velocidade Relativa e Ultrapassagens na Cinemática',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/velocidade-relativa.htm',
        resumo: 'Regras práticas para móveis no mesmo sentido e em sentidos opostos, além de problemas clássicos de travessia de pontes.'
      },
      {
        id: 'site_m3_2',
        titulo: 'Encontro de Móveis e Corpos Extensos no MU',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/encontro-moveis.htm',
        resumo: 'Dedução do instante de encontro igualando s_A = s_B e cálculo de tempo de ultrapassagem.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m3_1',
        ano: 'ENEM 2019',
        habilidadeId: 'M3',
        contexto: 'Distância de Segurança e Ultrapassagem na Rodovia',
        enunciado: 'Em uma rodovia de pista simples, um automóvel de 4 m de comprimento trafega a 25 m/s (90 km/h) e deseja ultrapassar uma carreta de 26 m de comprimento que segue no mesmo sentido a 20 m/s (72 km/h). Para realizar a manobra com segurança, o motorista inicia a ultrapassagem estando 10 m atrás da traseira da carreta e retorna à sua faixa quando a traseira de seu automóvel está 10 m à frente da cabine da carreta. Qual é o intervalo de tempo total gasto nessa ultrapassagem?',
        alternativas: {
          A: '5,2 segundos.',
          B: '6,0 segundos.',
          C: '8,0 segundos.',
          D: '10,0 segundos.',
          E: '12,0 segundos.'
        },
        correta: 'D',
        resolucao: '1) Calculamos a velocidade relativa (mesmo sentido): v_rel = v_carro - v_carreta = 25 - 20 = 5 m/s.\n2) Calculamos o deslocamento relativo total necessário: folga inicial (10 m) + comprimento da carreta (26 m) + comprimento do carro (4 m) + folga final (10 m) = 10 + 26 + 4 + 10 = 50 metros.\n3) Tempo de ultrapassagem: Δt = Δs_rel / v_rel = 50 / 5 = 10,0 segundos.'
      }
    ]
  },

  fisica_cinetica_bloco_2_M4: {
    foco: 'Cuidado para não confundir velocidade negativa (movimento retrógrado) com aceleração contrária à velocidade (movimento retardado/frenagem). Sempre organize os dados (v₀, v, a, t, Δs) antes de escolher a fórmula do MUV.',
    videos: [],
    sites: [
      {
        id: 'site_m4_1',
        titulo: 'Movimento Uniformemente Variado (MUV): Fórmulas e Exemplos',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/movimento-uniformemente-variado/',
        resumo: 'Resumo completo das funções horárias da velocidade (v = v₀ + at) e da posição (s = s₀ + v₀t + at²/2).'
      },
      {
        id: 'site_m4_2',
        titulo: 'Aceleração Escalar Média e Classificação dos Movimentos',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/movimento-uniformemente-variado-muv.htm',
        resumo: 'Diferença entre movimento acelerado e retardado e exercícios comentados de arrancada e frenagem.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m4_1',
        ano: 'ENEM 2018',
        habilidadeId: 'M4',
        contexto: 'Teleférico e Aceleração Constante',
        enunciado: 'Um carro de testes parte do repouso em uma pista retilínea e mantém aceleração constante de 2,5 m/s² durante os primeiros 8 segundos. Em seguida, mantém a velocidade atingida constante por mais 10 segundos. Qual foi a distância total percorrida pelo veículo nesses 18 segundos de teste?',
        alternativas: {
          A: '80 metros.',
          B: '200 metros.',
          C: '280 metros.',
          D: '360 metros.',
          E: '400 metros.'
        },
        correta: 'C',
        resolucao: '1) Na 1ª etapa (MUV, 0 a 8 s): v = v₀ + a·t = 0 + 2,5 × 8 = 20 m/s. A distância percorrida no MUV é Δs₁ = (a·t²)/2 = (2,5 × 8²)/2 = 2,5 × 32 = 80 m.\n2) Na 2ª etapa (MU, por 10 s a 20 m/s): Δs₂ = v · t = 20 × 10 = 200 m.\n3) Distância total: Δs_total = 80 + 200 = 280 metros.'
      }
    ]
  },

  fisica_cinetica_bloco_2_M5: {
    foco: 'A Equação de Torricelli (v² = v₀² + 2·a·Δs) é a rainha das questões de segurança no trânsito do ENEM! E se a questão fornecer um gráfico de Velocidade × Tempo, nem pense em fórmulas: calcule a ÁREA do triângulo ou trapézio para achar a distância percorrida!',
    videos: [],
    sites: [
      {
        id: 'site_m5_1',
        titulo: 'Equação de Torricelli: Quando Usar e Exercícios do ENEM',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/equacao-de-torricelli/',
        resumo: 'Aplicação direta de v² = v₀² + 2·a·Δs em problemas que não fornecem o tempo de percurso ou frenagem.'
      },
      {
        id: 'site_m5_2',
        titulo: 'Gráficos do MUV e Cálculo do Deslocamento pela Área',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/graficos-muv.htm',
        resumo: 'Propriedade gráfica da área sob a curva v × t (retângulo, triângulo e trapézio) para obter Δs.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m5_1',
        ano: 'ENEM 2019',
        habilidadeId: 'M5',
        contexto: 'Distância Total de Parada (Reação + Frenagem)',
        enunciado: 'O manual de direção defensiva alerta que a distância total necessária para parar um veículo em emergência soma a distância percorrida durante o tempo de reação do motorista (em que o carro ainda mantém velocidade constante) com a distância de frenagem propriamente dita. Considere um motorista trafegando a 72 km/h cujo tempo de reação é de 0,75 s. Ao acionar os freios, o veículo desacelera uniformemente a 5,0 m/s² até parar. A distância total percorrida desde o instante em que avista o perigo até a parada completa é de:',
        alternativas: {
          A: '40,0 metros.',
          B: '55,0 metros.',
          C: '15,0 metros.',
          D: '70,0 metros.',
          E: '95,0 metros.'
        },
        correta: 'B',
        resolucao: '1) Convertemos a velocidade inicial: v₀ = 72 km/h ÷ 3,6 = 20 m/s.\n2) Distância de reação (MU durante 0,75 s): Δs_reação = v₀ · t_reação = 20 × 0,75 = 15,0 metros.\n3) Distância de frenagem (Torricelli com v = 0 e a = -5 m/s²): 0² = 20² + 2·(-5)·Δs_frenagem ⇒ 10 · Δs_frenagem = 400 ⇒ Δs_frenagem = 40,0 metros.\n4) Distância total de parada: 15,0 + 40,0 = 55,0 metros.'
      }
    ]
  },

  fisica_cinetica_bloco_2_M6: {
    foco: 'Na queda livre ideal (sem resistência do ar), uma pena e um martelo caem juntos porque a aceleração da gravidade g independe da massa! Além disso, como h = g·t²/2, a distância percorrida cresce com o quadrado do tempo.',
    videos: [],
    sites: [
      {
        id: 'site_m6_1',
        titulo: 'Queda Livre e Lançamento Vertical: Fórmulas e Exemplos',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/queda-livre/',
        resumo: 'Estudo de Galileu Galilei sobre a queda dos corpos, equações h = gt²/2, v = gt e v² = 2gh.'
      },
      {
        id: 'site_m6_2',
        titulo: 'Lançamento Vertical para Cima e Tempo de Subida',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/lancamento-vertical.htm',
        resumo: 'Simetria entre subida e descida, velocidade nula no ponto de altura máxima e exercícios resolvidos.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m6_1',
        ano: 'ENEM 2022',
        habilidadeId: 'M6',
        contexto: 'Régua do Tempo de Reação em Queda Livre',
        enunciado: 'Uma brincadeira comum para medir o tempo de reação de uma pessoa consiste em segurar uma régua verticalmente pela extremidade superior, enquanto o colega posiciona os dedos abertos próximos ao marco zero na base da régua, sem tocá-la. Quando a régua é solta sem aviso, o colega fecha os dedos para segurá-la. Se uma pessoa prendeu a régua exatamente na marca de 20 cm (0,20 m) de queda livre, adotando g = 10 m/s², o seu tempo de reação foi de:',
        alternativas: {
          A: '0,04 segundo.',
          B: '0,10 segundo.',
          C: '0,20 segundo.',
          D: '0,40 segundo.',
          E: '2,00 segundos.'
        },
        correta: 'C',
        resolucao: '1) A régua parte do repouso (v₀ = 0) em queda livre de uma altura h = 20 cm = 0,20 m.\n2) Pela função horária da queda livre: h = (g · t²) / 2.\n3) Substituindo os valores: 0,20 = (10 · t²) / 2 ⇒ 0,20 = 5 · t² ⇒ t² = 0,20 / 5 = 0,04.\n4) Extraindo a raiz quadrada: t = √0,04 = 0,20 segundo.'
      }
    ]
  },

  fisica_cinetica_bloco_3_M7: {
    foco: 'A 1ª Lei (Inércia) explica por que objetos continuam se movendo quando o veículo freia. Já na 3ª Lei (Ação e Reação), lembre-se da regra de ouro: Peso e Normal NUNCA são par ação-reação, pois estão aplicados no mesmo corpo!',
    videos: [],
    sites: [
      {
        id: 'site_m7_1',
        titulo: 'As Três Leis de Newton: Resumo, Fórmulas e Exemplos',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/leis-de-newton/',
        resumo: 'Explicação clara do Princípio da Inércia, da Dinâmica e da Ação e Reação com aplicações no trânsito.'
      },
      {
        id: 'site_m7_2',
        titulo: 'Terceira Lei de Newton: Por que Ação e Reação não se anulam?',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/terceira-lei-newton.htm',
        resumo: 'Exemplos de pares ação-reação de contato e de campo (gravidade) mostrando que atuam em corpos distintos.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m7_1',
        ano: 'ENEM 2018',
        habilidadeId: 'M7',
        contexto: 'Segurança Veicular: Cinto vs. Encosto de Cabeça',
        enunciado: 'Nos automóveis modernos, o cinto de segurança e o encosto de cabeça nos bancos desempenham papéis fundamentais para evitar lesões graves na coluna cervical (efeito chicote) durante colisões no trânsito. Com base na 1ª Lei de Newton (Inércia), o cinto de segurança e o encosto de cabeça protegem o ocupante principalmente em casos de, respectivamente:',
        alternativas: {
          A: 'Colisão traseira e colisão frontal.',
          B: 'Colisão frontal (ou frenagem brusca) e colisão traseira.',
          C: 'Derrapagem lateral e capotamento.',
          D: 'Aceleração brusca para ambos os dispositivos.',
          E: 'Frenagem brusca para ambos os dispositivos.'
        },
        correta: 'B',
        resolucao: '1) Em uma colisão frontal ou frenagem brusca, o carro para, mas o corpo do passageiro tende, por inércia, a continuar avançando para a frente — o cinto de segurança o retém.\n2) Em uma colisão traseira (quando outro carro bate atrás), o banco é empurrado subitamente para a frente junto com o tronco, mas a cabeça tende, por inércia, a permanecer onde estava (forçando o pescoço para trás) — o encosto de cabeça apoia e acelera a cabeça junto com o tronco.'
      }
    ]
  },

  fisica_cinetica_bloco_3_M8: {
    foco: 'Sempre que o texto do ENEM disser "velocidade constante" (mesmo em subida, descida de paraquedas ou avião em voo de cruzeiro), a aceleração é ZERO (a = 0) e, portanto, a Força Resultante é ZERO (F_R = 0)!',
    videos: [],
    sites: [
      {
        id: 'site_m8_1',
        titulo: 'Segunda Lei de Newton (Princípio Fundamental da Dinâmica)',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/segunda-lei-newton.htm',
        resumo: 'Cálculo da força resultante F_R = m·a em blocos isolados, sistemas acoplados e elevadores.'
      },
      {
        id: 'site_m8_2',
        titulo: 'Força Peso e Força Normal: Diferenças e Aplicações',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/forca-peso/',
        resumo: 'Distinção entre massa (kg) e peso (N), cálculo de P = m·g e comportamento da força Normal.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m8_1',
        ano: 'ENEM 2021',
        habilidadeId: 'M8',
        contexto: 'Dinâmica e Frenagem de Composições',
        enunciado: 'Um vagão de carga de massa total igual a 20.000 kg (20 toneladas) desloca-se sobre trilhos horizontais a uma velocidade de 15 m/s. Ao acionar o sistema de freios, uma força resultante constante e oposta ao movimento atua sobre o vagão, fazendo-o parar após 10 segundos. Qual foi a intensidade da força resultante de frenagem aplicada sobre o vagão?',
        alternativas: {
          A: '15.000 N.',
          B: '20.000 N.',
          C: '30.000 N.',
          D: '150.000 N.',
          E: '300.000 N.'
        },
        correta: 'C',
        resolucao: '1) Calculamos o módulo da desaceleração escalar: |a| = |Δv| / Δt = 15 m/s / 10 s = 1,5 m/s².\n2) Aplicando a 2ª Lei de Newton (F_R = m · |a|): F_R = 20.000 kg × 1,5 m/s² = 30.000 N (ou 30 kN).'
      }
    ]
  },

  fisica_cinetica_bloco_3_M9: {
    foco: 'O ENEM adora cobrar o sistema de freios ABS e o caminhar humano! O freio ABS impede o travamento das rodas para aproveitar a força de atrito ESTÁTICO máxima (μ_e · N), que é maior do que a força de atrito CINÉTICO (μ_c · N) de um pneu derrapando.',
    videos: [],
    sites: [
      {
        id: 'site_m9_1',
        titulo: 'Força de Atrito: Estático, Cinético e Fórmulas',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/forca-de-atrito/',
        resumo: 'Gráfico da força de atrito estático até a iminência de movimento, atrito dinâmico e questões do ENEM sobre ABS.'
      },
      {
        id: 'site_m9_2',
        titulo: 'Atrito Estático e Dinâmico no Cotidiano',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/forca-atrito.htm',
        resumo: 'Análise detalhada do papel do atrito na tração de rodas motrizes, caminhada e curvas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m9_1',
        ano: 'ENEM 2019',
        habilidadeId: 'M9',
        contexto: 'Freios ABS e Atrito Estático vs. Cinético',
        enunciado: 'O sistema de freios ABS (Anti-lock Braking System) impede o travamento das rodas do veículo quando o motorista pisa com força no pedal de freio, evitando que os pneus deslizem (derrapem) no asfalto. O gráfico da força de atrito em função da força aplicada mostra que a força de atrito sobe até um pico máximo antes do escorregamento e depois cai para um patamar menor durante o deslizamento. A eficiência do freio ABS deve-se ao fato de que:',
        alternativas: {
          A: 'O coeficiente de atrito cinético é sempre maior que o estático em altas velocidades.',
          B: 'Na iminência de deslizamento (sem travar a roda), a força de atrito estático máxima é superior à força de atrito cinético que ocorreria com a roda travada.',
          C: 'Ao destravar a roda, elimina-se totalmente o atrito com o solo, poupando os freios.',
          D: 'A força Normal do carro aumenta quando as rodas giram livremente.',
          E: 'O atrito estático atua no mesmo sentido do movimento do veículo durante a frenagem.'
        },
        correta: 'B',
        resolucao: '1) Quando a roda trava e desliza (derrapa), atua o atrito cinético (F_at,c = μ_c · N).\n2) Quando a roda continua girando na iminência de escorregar (controle eletrônico do ABS), o ponto de contato do pneu com o solo não desliza, atuando o atrito estático máximo (F_at,e = μ_e · N).\n3) Como μ_e > μ_c, a força desaceleradora máxima é maior com o ABS, reduzindo a distância de frenagem e mantendo a dirigibilidade.'
      }
    ]
  },

  fisica_cinetica_bloco_4_M10: {
    foco: 'Questões de usinas hidrelétricas, bombas d\'água e motores no ENEM cobram quase sempre Potência = Energia / Tempo = (m · g · h) / Δt. Fique atento ao rendimento (η = P_útil / P_total)!',
    videos: [],
    sites: [
      {
        id: 'site_m10_1',
        titulo: 'Trabalho e Potência Mecânica na Física',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/trabalho-na-fisica/',
        resumo: 'Definição de trabalho (Joule), potência mecânica (Watt e cv/HP) e cálculo de rendimento.'
      },
      {
        id: 'site_m10_2',
        titulo: 'Potência Mecânica e Rendimento no ENEM',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/potencia-mecanica.htm',
        resumo: 'Relação P = F·v, cálculo de potência em elevação de água e exercícios resolvidos.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m10_1',
        ano: 'ENEM 2021',
        habilidadeId: 'M10',
        contexto: 'Dimensionamento de Conjunto Motobomba',
        enunciado: 'Em uma propriedade rural, deseja-se instalar uma bomba elétrica para elevar 3.600 litros de água (densidade = 1,0 kg/L) por hora, de um poço até um reservatório localizado a 30 metros de altura. Adotando a aceleração da gravidade g = 10 m/s² e sabendo que o rendimento do conjunto motobomba é de 60% (0,60), qual deve ser a potência elétrica total consumida pelo motor da bomba?',
        alternativas: {
          A: '180 W.',
          B: '300 W.',
          C: '500 W.',
          D: '1.080 W.',
          E: '1.800 W.'
        },
        correta: 'C',
        resolucao: '1) Massa de água elevada em Δt = 1 hora (3.600 segundos): m = 3.600 kg.\n2) Energia potencial gravitacional ganha pela água (Trabalho útil): W_útil = m · g · h = 3.600 × 10 × 30 = 1.080.000 J.\n3) Potência mecânica útil: P_útil = W_útil / Δt = 1.080.000 J / 3.600 s = 300 W.\n4) Como o rendimento é η = P_útil / P_total = 0,60: P_total = 300 / 0,60 = 500 W.'
      }
    ]
  },

  fisica_cinetica_bloco_4_M11: {
    foco: 'A Energia Cinética depende do QUADRADO da velocidade (E_c = m·v²/2), enquanto a Energia Potencial Gravitacional é linear com a altura (E_pg = m·g·h). Pelo Teorema da Energia Cinética, o trabalho da força resultante é igual à variação da energia cinética!',
    videos: [],
    sites: [
      {
        id: 'site_m11_1',
        titulo: 'Energia Mecânica: Cinética, Potencial Gravitacional e Elástica',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/energia-mecanica/',
        resumo: 'Fórmulas das três modalidades de energia mecânica e exemplos numéricos comentados.'
      },
      {
        id: 'site_m11_2',
        titulo: 'Teorema da Energia Cinética e Trabalho Resultante',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/energia-cinetica.htm',
        resumo: 'Demonstração de W_R = ΔE_c e impacto do aumento de velocidade na severidade de colisões.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m11_1',
        ano: 'ENEM 2020',
        habilidadeId: 'M11',
        contexto: 'Energia Cinética e Segurança Viária',
        enunciado: 'Campanhas de segurança no trânsito alertam que um pequeno excesso de velocidade aumenta drasticamente a energia envolvida em uma eventual colisão. Compare a energia cinética de um mesmo automóvel quando trafega a 60 km/h (limite da via) com a energia cinética quando trafega a 90 km/h (50% acima do limite). Ao passar de 60 km/h para 90 km/h, a energia cinética do veículo:',
        alternativas: {
          A: 'Aumenta em 50% (fica 1,5 vez maior).',
          B: 'Aumenta em 100% (fica 2,0 vezes maior).',
          C: 'Aumenta em 125% (fica 2,25 vezes maior).',
          D: 'Aumenta em 150% (fica 2,5 vezes maior).',
          E: 'Aumenta em 225% (fica 3,25 vezes maior).'
        },
        correta: 'C',
        resolucao: '1) A energia cinética é dada por E_c = (m · v²) / 2, sendo diretamente proporcional ao quadrado da velocidade.\n2) A razão entre as velocidades é v₂ / v₁ = 90 / 60 = 1,5.\n3) Logo, a razão entre as energias cinéticas é E_c2 / E_c1 = (1,5)² = 2,25.\n4) Um fator 2,25 corresponde a um aumento percentual de (2,25 - 1) × 100% = +125%.'
      }
    ]
  },

  fisica_cinetica_bloco_4_M12: {
    foco: 'Em problemas de rampas, montanhas-russas, pêndulos ou objetos que caem sem atrito, iguale a energia mecânica inicial à final: m·g·h_inicial + m·v₀²/2 = m·g·h_final + m·v²/2 (repare que a massa m corta nos dois lados!).',
    videos: [],
    sites: [
      {
        id: 'site_m12_1',
        titulo: 'Conservação da Energia Mecânica e Sistemas Dissipativos',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/conservacao-energia-mecanica.htm',
        resumo: 'Exemplos clássicos de transformação entre energia potencial e cinética e cálculo de energia dissipada.'
      },
      {
        id: 'site_m12_2',
        titulo: 'Princípio da Conservação da Energia no ENEM',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/principio-conservacao-energia-mecanica.htm',
        resumo: 'Análise de montanhas-russas, saltos com vara, estilingues e rampas com ou sem atrito.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_m12_1',
        ano: 'ENEM 2023',
        habilidadeId: 'M12',
        contexto: 'Bate-Estacas e Conservação de Energia',
        enunciado: 'Em um canteiro de obras, um bate-estacas utiliza um bloco de ferro de massa 500 kg que é erguido até uma altura de 5,0 metros acima do topo de uma estaca de concreto e, então, abandonado em queda livre (desprezando os atritos nos trilhos-guia). Adotando g = 10 m/s², qual é a energia cinética e a velocidade do bloco no exato instante em que atinge o topo da estaca?',
        alternativas: {
          A: '25.000 J e 10 m/s.',
          B: '25.000 J e 50 m/s.',
          C: '50.000 J e 10 m/s.',
          D: '2.500 J e 10 m/s.',
          E: '12.500 J e 5 m/s.'
        },
        correta: 'A',
        resolucao: '1) No ponto mais alto (repouso, h = 5,0 m), toda a energia mecânica é potencial gravitacional: E_m = m · g · h = 500 × 10 × 5,0 = 25.000 J (25 kJ).\n2) Pela conservação da energia mecânica, ao atingir a estaca (h = 0), toda a energia potencial se converteu em energia cinética: E_c = 25.000 J.\n3) Calculando a velocidade de impacto: E_c = (m · v²)/2 ⇒ 25.000 = (500 · v²)/2 ⇒ 250 · v² = 25.000 ⇒ v² = 100 ⇒ v = 10 m/s.'
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────────────────────
     2. MATEMÁTICA — MATEMÁTICA FINANCEIRA E JUROS COMPOSTOS (MF1 a MF8)
     ────────────────────────────────────────────────────────────────────────── */
  matematica_financeira_bloco_1_MF1: {
    foco: 'Transforme porcentagens em frações ou decimais rapidamente (ex: 15% = 0,15; 5% = 0,05) e fique muito atento à base de referência da porcentagem ("porcentagem DE quem?").',
    videos: [],
    sites: [
      {
        id: 'site_mf1_1',
        titulo: 'Porcentagem: Como Calcular, Fórmulas e Exercícios do ENEM',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/porcentagem/',
        resumo: 'Guia prático de cálculo percentual, razão centesimal e questões comentadas do ENEM.'
      },
      {
        id: 'site_mf1_2',
        titulo: 'Razão, Proporção e Porcentagem na Matemática Financeira',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/matematica/porcentagem.htm',
        resumo: 'Exemplos cotidianos de descontos comerciais, impostos e divisão proporcional.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_mf1_1',
        ano: 'ENEM 2023',
        habilidadeId: 'MF1',
        contexto: 'Orçamento Doméstico e Poupança Percentual',
        enunciado: 'Um trabalhador recebe um salário líquido mensal de R$ 4.000,00. Ele destina 30% do salário para moradia, 25% para alimentação, 20% para transporte e lazer, e guarda o restante em uma aplicação financeira. Se ele deseja aumentar o valor mensal guardado em 20% no próximo mês sem alterar seu salário nem o gasto com moradia, quantos reais ele deverá economizar na soma das despesas de alimentação, transporte e lazer?',
        alternativas: {
          A: 'R$ 100,00.',
          B: 'R$ 150,00.',
          C: 'R$ 200,00.',
          D: 'R$ 250,00.',
          E: 'R$ 800,00.'
        },
        correta: 'C',
        resolucao: '1) Percentual gasto atualmente: 30% + 25% + 20% = 75%. Logo, ele guarda atualmente 100% - 75% = 25% do salário.\n2) Valor guardado atualmente: 25% de R$ 4.000,00 = 0,25 × 4.000 = R$ 1.000,00.\n3) Para aumentar o valor guardado em 20%, ele precisa guardar a mais: 20% de R$ 1.000,00 = 0,20 × 1.000 = R$ 200,00.\n4) Portanto, ele deverá reduzir suas outras despesas em R$ 200,00.'
      }
    ]
  },

  matematica_financeira_bloco_1_MF2: {
    foco: 'Nunca some nem subtraia porcentagens sucessivas diretamente! Em aumentos/descontos sucessivos, multiplique os fatores: F_total = (1 ± i₁) × (1 ± i₂).',
    videos: [],
    sites: [
      {
        id: 'site_mf2_1',
        titulo: 'Aumentos e Descontos Sucessivos: Fator Multiplicativo',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/matematica/aumentos-descontos-sucessivos.htm',
        resumo: 'Demonstração do fator de atualização (1 ± i) e resolução de pegadinhas clássicas de vestibular.'
      },
      {
        id: 'site_mf2_2',
        titulo: 'Fator de Atualização na Matemática Financeira',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/matematica/fator-atualizacao.htm',
        resumo: 'Tabela de fatores para acréscimos e abatimentos acumulados.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_mf2_1',
        ano: 'ENEM 2021',
        habilidadeId: 'MF2',
        contexto: 'Descontos Sucessivos vs. Desconto Único',
        enunciado: 'Uma rede de varejo anuncia uma promoção em que o cliente pode escolher entre três modalidades de desconto para comprar uma geladeira: Modalidade I: um desconto único de 25%; Modalidade II: dois descontos sucessivos de 13% cada; Modalidade III: um desconto de 15% seguido de outro desconto de 10% sobre o valor já reduzido. Os descontos percentuais efetivos das modalidades I, II e III são, em ordem decrescente de vantagem para o cliente:',
        alternativas: {
          A: 'I, II e III.',
          B: 'II, I e III.',
          C: 'I, III e II.',
          D: 'III, II e I.',
          E: 'As três modalidades oferecem exatamente o mesmo desconto.'
        },
        correta: 'A',
        resolucao: '1) Modalidade I: desconto efetivo de 25,00% (fator 0,75).\n2) Modalidade II (dois descontos de 13%): fator = 0,87 × 0,87 = 0,7569 ⇒ desconto efetivo de 1 - 0,7569 = 0,2431 = 24,31%.\n3) Modalidade III (15% seguido de 10%): fator = 0,85 × 0,90 = 0,7650 ⇒ desconto efetivo de 1 - 0,7650 = 0,2350 = 23,50%.\n4) Ordem decrescente de desconto (maior economia primeiro): I (25%) > II (24,31%) > III (23,50%).'
      }
    ]
  },

  matematica_financeira_bloco_1_MF3: {
    foco: 'Se um produto teve aumento de 25% (× 1,25) e você quer saber o preço ANTES do aumento, você deve DIVIDIR por 1,25 (e não tirar 25% do valor final!).',
    videos: [],
    sites: [
      {
        id: 'site_mf3_1',
        titulo: 'Cálculo de Variação Percentual e Valor Inicial',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/exercicios-de-porcentagem/',
        resumo: 'Exercícios resolvidos passo a passo sobre retorno ao preço original e redução de volume de embalagens (reduflação).'
      },
      {
        id: 'site_mf3_2',
        titulo: 'Matemática Financeira no ENEM: Dicas e Questões',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/matematica/matematica-financeira.htm',
        resumo: 'Visão geral das operações percentuais inversas mais cobradas no exame.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_mf3_1',
        ano: 'ENEM 2020',
        habilidadeId: 'MF3',
        contexto: 'Redução de Embalagem Mantendo o Preço',
        enunciado: 'Uma indústria de alimentos vendia um pacote de biscoitos de 200 g por R$ 4,00. Para não alterar o preço de R$ 4,00 na prateleira, a fábrica reduziu a massa de biscoitos do pacote de 200 g para 160 g (-20% na quantidade). Essa redução de massa mantendo o mesmo preço equivale a um aumento percentual no preço por quilograma do produto de:',
        alternativas: {
          A: '16%.',
          B: '20%.',
          C: '25%.',
          D: '40%.',
          E: '80%.'
        },
        correta: 'C',
        resolucao: '1) Preço inicial por grama: R$ 4,00 / 200 g = R$ 0,020 por grama (R$ 20,00/kg).\n2) Novo preço por grama: R$ 4,00 / 160 g = R$ 0,025 por grama (R$ 25,00/kg).\n3) Variação percentual no preço por kg: (25 - 20) / 20 = 5 / 20 = 0,25 = +25% (ou diretamente pelo inverso do fator 0,80: 1 / 0,80 = 1,25 ⇒ +25%).'
      }
    ]
  },

  matematica_financeira_bloco_2_MF4: {
    foco: 'Nos juros simples (J = C·i·t), o rendimento em reais é fixo todo mês (depende apenas do capital inicial C). Certifique-se sempre de que a taxa i e o tempo t estão na mesma unidade temporal!',
    videos: [],
    sites: [
      {
        id: 'site_mf4_1',
        titulo: 'Juros Simples: Fórmula, Como Calcular e Exercícios',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/juros-simples/',
        resumo: 'Explicação detalhada de J = C·i·t, conversão de taxa anual para mensal e exemplos resolvidos.'
      },
      {
        id: 'site_mf4_2',
        titulo: 'Capitalização Simples e Montante Linear',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/matematica/juros-simples.htm',
        resumo: 'Aplicações em boletos, descontos simples e financiamentos de curto prazo.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_mf4_1',
        ano: 'ENEM 2019',
        habilidadeId: 'MF4',
        contexto: 'Empréstimo Solidário a Juros Simples',
        enunciado: 'Uma cooperativa de agricultores concede um empréstimo de R$ 12.000,00 a um pequeno produtor rural no sistema de juros simples, com taxa de 1,5% ao mês, para ser pago em parcela única ao final de 10 meses após a colheita. Qual será o valor total (montante) a ser pago pelo produtor para quitar o empréstimo?',
        alternativas: {
          A: 'R$ 12.180,00.',
          B: 'R$ 13.500,00.',
          C: 'R$ 13.800,00.',
          D: 'R$ 13.926,00.',
          E: 'R$ 18.000,00.'
        },
        correta: 'C',
        resolucao: '1) Identificamos os dados: C = R$ 12.000,00; i = 1,5% ao mês = 0,015; t = 10 meses.\n2) Calculamos os juros simples: J = C · i · t = 12.000 × 0,015 × 10 = 12.000 × 0,15 = R$ 1.800,00.\n3) Somamos ao capital inicial para achar o montante: M = C + J = 12.000 + 1.800 = R$ 13.800,00.'
      }
    ]
  },

  matematica_financeira_bloco_2_MF5: {
    foco: 'Associe imediatamente: Juros Simples ↔ Função Afim (reta) ↔ Progressão Aritmética (PA). Juros Compostos ↔ Função Exponencial (curva côncava para cima) ↔ Progressão Geométrica (PG).',
    videos: [],
    sites: [
      {
        id: 'site_mf5_1',
        titulo: 'Diferença entre Juros Simples e Juros Compostos (Com Gráficos)',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/matematica/diferenca-entre-juros-simples-compostos.htm',
        resumo: 'Comparação lado a lado da evolução mês a mês e gráficos comparativos dos dois regimes.'
      },
      {
        id: 'site_mf5_2',
        titulo: 'Juros Simples e Compostos e as Progressões PA e PG',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/matematica-financeira/',
        resumo: 'Relação algébrica entre capitalização financeira e sequências numéricas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_mf5_1',
        ano: 'ENEM 2018',
        habilidadeId: 'MF5',
        contexto: 'Comparação entre Duas Opções de Investimento',
        enunciado: 'Um investidor dispõe de R$ 10.000,00 para aplicar durante 3 meses e analisa duas propostas: Proposta A: regime de juros simples à taxa de 12% ao mês; Proposta B: regime de juros compostos à taxa de 10% ao mês. Ao final dos 3 meses, qual proposta gera o maior montante e qual é a diferença entre elas?',
        alternativas: {
          A: 'A Proposta A rende R$ 290,00 a mais que a Proposta B.',
          B: 'A Proposta B rende R$ 310,00 a mais que a Proposta A.',
          C: 'As duas propostas geram exatamente R$ 13.310,00.',
          D: 'A Proposta A rende R$ 600,00 a mais que a Proposta B.',
          E: 'A Proposta B rende R$ 290,00 a mais que a Proposta A.'
        },
        correta: 'A',
        resolucao: '1) Proposta A (juros simples, 12% a.m. por 3 meses): M_A = 10.000 × (1 + 0,12 × 3) = 10.000 × 1,36 = R$ 13.600,00.\n2) Proposta B (juros compostos, 10% a.m. por 3 meses): M_B = 10.000 × (1,10)³ = 10.000 × 1,331 = R$ 13.310,00.\n3) Comparando os montantes: M_A - M_B = 13.600 - 13.310 = R$ 290,00 a favor da Proposta A.'
      }
    ]
  },

  matematica_financeira_bloco_3_MF6: {
    foco: 'Em questões do ENEM de juros compostos M = C·(1 + i)^t, muitas vezes a questão nem exige que você calcule a potência final: ela pede apenas a EXPRESSÃO algébrica ou fornece no texto uma tabela com o valor de (1 + i)^t pronto!',
    videos: [],
    sites: [
      {
        id: 'site_mf6_1',
        titulo: 'Juros Compostos: Fórmula, Exemplos e Questões do ENEM',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/juros-compostos/',
        resumo: 'Dedução da fórmula M = C·(1+i)^t, cálculo de juros acumulados e questões oficiais do ENEM.'
      },
      {
        id: 'site_mf6_2',
        titulo: 'Juros Compostos e Depreciação no ENEM',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/matematica/juros-compostos.htm',
        resumo: 'Exemplos de capitalização composta e desvalorização anual de bens.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_mf6_1',
        ano: 'ENEM 2022',
        habilidadeId: 'MF6',
        contexto: 'Financiamento e Evolução da Dívida no Cartão',
        enunciado: 'Uma pessoa deixou de pagar a fatura de R$ 1.000,00 do cartão de crédito, entrando no crédito rotativo que cobra juros compostos de 10% ao mês. Sem realizar nenhum pagamento nem novas compras, qual será o valor total da dívida após 4 meses? (Dado: 1,1⁴ = 1,4641)',
        alternativas: {
          A: 'R$ 1.400,00.',
          B: 'R$ 1.440,00.',
          C: 'R$ 1.464,10.',
          D: 'R$ 1.500,00.',
          E: 'R$ 1.610,51.'
        },
        correta: 'C',
        resolucao: '1) Aplicamos a fórmula do montante em juros compostos: M = C · (1 + i)^t.\n2) Substituindo C = 1.000, i = 0,10 e t = 4 meses: M = 1.000 × (1 + 0,10)⁴ = 1.000 × (1,1)⁴.\n3) Usando o dado 1,1⁴ = 1,4641: M = 1.000 × 1,4641 = R$ 1.464,10.'
      }
    ]
  },

  matematica_financeira_bloco_3_MF7: {
    foco: 'Quando a incógnita é o TEMPO t no expoente de M = C·(1 + i)^t, aplique logaritmo dos dois lados e use a propriedade do "tombo": log(a^t) = t · log(a).',
    videos: [],
    sites: [
      {
        id: 'site_mf7_1',
        titulo: 'Juros Compostos com Logaritmos no ENEM',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/matematica/juros-compostos.htm',
        resumo: 'Como isolar o tempo t usando propriedades operatórias dos logaritmos e taxas equivalentes.'
      },
      {
        id: 'site_mf7_2',
        titulo: 'Taxas Equivalentes e Proporcionais na Matemática Financeira',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/matematica/taxas-equivalentes.htm',
        resumo: 'Conversão de taxas mensais, semestrais e anuais no regime composto.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_mf7_1',
        ano: 'ENEM 2019',
        habilidadeId: 'MF7',
        contexto: 'Tempo para Triplicar um Investimento',
        enunciado: 'Um investidor aplica certa quantia em um título que rende juros compostos a uma taxa fixa de 20% ao ano. Utilizando as aproximações log₁₀(2) = 0,30, log₁₀(3) = 0,48 e sabendo que 1,2 = 12/10 = (2² × 3)/10, o tempo mínimo necessário para que o capital inicial triplique de valor é de:',
        alternativas: {
          A: '5,0 anos.',
          B: '6,0 anos.',
          C: '7,5 anos.',
          D: '8,0 anos.',
          E: '10,0 anos.'
        },
        correta: 'B',
        resolucao: '1) Queremos que M = 3C: 3C = C · (1 + 0,20)^t ⇒ (1,2)^t = 3.\n2) Aplicando log₁₀ dos dois lados: t · log(1,2) = log(3).\n3) Calculando log(1,2): log(12/10) = log(2² · 3) - log(10) = 2·log(2) + log(3) - 1 = 2(0,30) + 0,48 - 1 = 0,60 + 0,48 - 1 = 0,08.\n4) Substituindo na equação: t · 0,08 = 0,48 ⇒ t = 0,48 / 0,08 = 6,0 anos.'
      }
    ]
  },

  matematica_financeira_bloco_3_MF8: {
    foco: 'Dinheiro tem valor no tempo! Nunca some parcelas de meses diferentes sem antes trazê-las para a mesma data (dividindo por (1 + i)^t para trazer ao Valor Presente, ou capitalizando o saldo mês a mês).',
    videos: [],
    sites: [
      {
        id: 'site_mf8_1',
        titulo: 'Valor Presente, Valor Futuro e Compra à Vista vs. a Prazo',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/matematica/valor-presente-valor-futuro.htm',
        resumo: 'Como comparar pagamentos à vista com compras parceladas quando o comprador possui aplicação financeira.'
      },
      {
        id: 'site_mf8_2',
        titulo: 'Sistemas de Amortização e Parcelamentos no ENEM',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/matematica/sistemas-amortizacao.htm',
        resumo: 'Evolução do saldo devedor mês a mês após amortizações parciais.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_mf8_1',
        ano: 'ENEM 2021',
        habilidadeId: 'MF8',
        contexto: 'Empréstimo Quitado em Duas Parcelas Iguais',
        enunciado: 'Uma loja vende um eletrodoméstico que pode ser pago em duas parcelas mensais iguais de R$ 605,00, vencendo a primeira 1 mês após a compra e a segunda 2 meses após a compra. Sabendo que a loja embute juros compostos de 10% ao mês no parcelamento, qual é o valor desse eletrodoméstico para pagamento à vista no ato da compra?',
        alternativas: {
          A: 'R$ 1.050,00.',
          B: 'R$ 1.100,00.',
          C: 'R$ 1.150,00.',
          D: 'R$ 1.210,00.',
          E: 'R$ 1.000,00.'
        },
        correta: 'A',
        resolucao: '1) Trazemos cada parcela futura para o Valor Presente (data zero) dividindo por (1 + i)^t, onde i = 10% = 0,10 (logo, 1 + i = 1,1).\n2) Valor presente da 1ª parcela (t = 1): VP₁ = 605 / 1,1 = R$ 550,00.\n3) Valor presente da 2ª parcela (t = 2): VP₂ = 605 / (1,1)² = 605 / 1,21 = R$ 500,00.\n4) Valor à vista do produto: VP_total = VP₁ + VP₂ = 550 + 500 = R$ 1.050,00.'
      }
    ]
  },
  /* ──────────────────────────────────────────────────────────────────────────
     3. MATEMÁTICA — PROBABILIDADE (PR1 a PR6)
     ────────────────────────────────────────────────────────────────────────── */
  matematica_probabilidade_bloco_1_PR1: {
    foco: 'Sempre comece escrevendo claramente quem é o denominador n(Ω) (total de casos possíveis equiprováveis) e quem é o numerador n(A) (casos favoráveis). No lançamento de dois dados, o espaço amostral tem 6 × 6 = 36 pares ordenados (logo, (2,5) e (5,2) são dois resultados distintos!).',
    videos: [],
    sites: [
      {
        id: 'site_pr1_1',
        titulo: 'Probabilidade: Conceitos, Fórmulas e Exercícios do ENEM',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/probabilidade/',
        resumo: 'Definição de espaço amostral, evento equiprovável, regra de Laplace e questões comentadas.'
      },
      {
        id: 'site_pr1_2',
        titulo: 'Cálculo de Probabilidade Simples e Espaço Amostral',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/matematica/probabilidade.htm',
        resumo: 'Exemplos clássicos de dados, moedas, baralhos e sorteios em urnas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_pr1_1',
        ano: 'ENEM 2020',
        habilidadeId: 'PR1',
        contexto: 'Jogo de Tabuleiro com Dois Dados',
        enunciado: 'Em um jogo de tabuleiro, o jogador precisa lançar simultaneamente dois dados honestos de 6 faces (numeradas de 1 a 6) e avançar o número de casas correspondente à soma das faces voltadas para cima. Para vencer a partida nessa rodada, o jogador precisa tirar uma soma maior ou igual a 10. Qual é a probabilidade de o jogador vencer a partida nessa rodada?',
        alternativas: {
          A: '1/12.',
          B: '1/9.',
          C: '1/6.',
          D: '5/36.',
          E: '7/36.'
        },
        correta: 'C',
        resolucao: '1) No lançamento de dois dados de 6 faces, o espaço amostral possui n(Ω) = 6 × 6 = 36 pares ordenados possíveis.\n2) Listamos os pares cuja soma é 10, 11 ou 12:\n- Soma 10: (4,6), (5,5), (6,4) → 3 casos;\n- Soma 11: (5,6), (6,5) → 2 casos;\n- Soma 12: (6,6) → 1 caso.\n3) Total de casos favoráveis: n(A) = 3 + 2 + 1 = 6 casos.\n4) Probabilidade: P(A) = 6 / 36 = 1/6.'
      },
      {
        id: 'enem_pr1_2',
        ano: 'ENEM 2022',
        habilidadeId: 'PR1',
        contexto: 'Sorteio de Bingo Beneficente',
        enunciado: 'Em um bingo beneficente, o globo contém 75 bolas numeradas de 1 a 75. Na primeira rodada, a cartela de uma participante possui 15 números distintos entre os 75 disponíveis. Qual é a probabilidade de o primeiro número sorteado do globo estar presente na cartela dessa participante?',
        alternativas: {
          A: '1/75.',
          B: '1/15.',
          C: '1/5.',
          D: '1/3.',
          E: '4/5.'
        },
        correta: 'C',
        resolucao: '1) Total de casos possíveis no primeiro sorteio: n(Ω) = 75 bolas.\n2) Total de casos favoráveis (números da cartela): n(A) = 15 números.\n3) Probabilidade: P(A) = 15 / 75 = 1/5 (ou 20%).'
      }
    ]
  },

  matematica_probabilidade_bloco_1_PR2: {
    foco: 'Em tabelas de dupla entrada ou diagramas de Venn no ENEM, sublinhe no comando da questão QUEM está sendo sorteado ("escolhendo-se ao acaso um estudante entre TODOS os pesquisados...") para não errar o denominador!',
    videos: [],
    sites: [
      {
        id: 'site_pr2_1',
        titulo: 'Exercícios de Probabilidade no ENEM com Tabelas e Conjuntos',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/exercicios-de-probabilidade/',
        resumo: 'Coletânea de questões do ENEM envolvendo tabelas estatísticas e diagramas de Venn.'
      },
      {
        id: 'site_pr2_2',
        titulo: 'Espaço Amostral e Eventos em Tabelas de Dupla Entrada',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/matematica/espaco-amostral-evento.htm',
        resumo: 'Como organizar dados de pesquisas em conjuntos e tabelas para extrair probabilidades.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_pr2_1',
        ano: 'ENEM 2021',
        habilidadeId: 'PR2',
        contexto: 'Pesquisa de Satisfação com Clientes',
        enunciado: 'Uma empresa entrevistou 300 clientes sobre a preferência entre dois produtos, X e Y. Dos entrevistados, 160 compram o produto X, 120 compram o produto Y e 50 compram ambos os produtos (X e Y). Sorteando-se ao acaso um desses 300 clientes para ganhar um brinde, qual é a probabilidade de o cliente sorteado não comprar nenhum dos dois produtos?',
        alternativas: {
          A: '20/300 (1/15).',
          B: '50/300 (1/6).',
          C: '70/300 (7/30).',
          D: '110/300 (11/30).',
          E: '230/300 (23/30).'
        },
        correta: 'C',
        resolucao: '1) Pelo diagrama de Venn (ou princípio da inclusão-exclusão), o número de clientes que compram X ou Y é: n(X ∪ Y) = n(X) + n(Y) - n(X ∩ Y) = 160 + 120 - 50 = 230 clientes.\n2) Clientes que não compram nenhum dos dois: 300 - 230 = 70 clientes.\n3) Sorteando entre os 300 clientes: P = 70 / 300 = 7/30.'
      }
    ]
  },

  matematica_probabilidade_bloco_2_PR3: {
    foco: 'Viu o conectivo "OU" (ex: "ser múltiplo de 2 OU múltiplo de 3", "ser mulher OU ter mais de 40 anos")? Use a União de Eventos: P(A ∪ B) = P(A) + P(B) - P(A ∩ B). Nunca esqueça de subtrair a interseção!',
    videos: [],
    sites: [
      {
        id: 'site_pr3_1',
        titulo: 'Probabilidade da União de Dois Eventos',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/matematica/probabilidade-uniao-dois-eventos.htm',
        resumo: 'Regra da soma P(A ∪ B) = P(A) + P(B) - P(A ∩ B) e diferença para eventos mutuamente exclusivos.'
      },
      {
        id: 'site_pr3_2',
        titulo: 'União de Eventos e Regra do "OU" na Probabilidade',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/matematica/probabilidade-uniao-dois-eventos.htm',
        resumo: 'Exemplos resolvidos com cartas de baralho, múltiplos inteiros e pesquisas populacionais.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_pr3_1',
        ano: 'ENEM 2019',
        habilidadeId: 'PR3',
        contexto: 'Sorteio em Empresa por Setor e Gênero',
        enunciado: 'Uma empresa possui 80 funcionários, sendo 45 mulheres e 35 homens. Do total de funcionários, 28 trabalham no setor administrativo, dos quais 18 são mulheres e 10 são homens. No sorteio de uma viagem entre todos os 80 funcionários, qual é a probabilidade de a pessoa sorteada ser mulher OU trabalhar no setor administrativo?',
        alternativas: {
          A: '18/80.',
          B: '45/80.',
          C: '55/80.',
          D: '63/80.',
          E: '73/80.'
        },
        correta: 'C',
        resolucao: '1) Seja M o evento "ser mulher" (n(M) = 45) e A o evento "trabalhar no administrativo" (n(A) = 28).\n2) A interseção (mulheres que trabalham no administrativo) é n(M ∩ A) = 18.\n3) Pela regra da união: n(M ∪ A) = n(M) + n(A) - n(M ∩ A) = 45 + 28 - 18 = 55 funcionários.\n4) Logo, a probabilidade é P(M ∪ A) = 55 / 80 (ou 11/16).'
      }
    ]
  },

  matematica_probabilidade_bloco_2_PR4: {
    foco: 'Sempre que aparecer a expressão "PELO MENOS UM" (pelo menos uma vitória, pelo menos um alarme tocar, pelo menos um menino), calcule a probabilidade de NENHUM ocorrer e faça 1 - P(nenhum)! Economiza minutos preciosos na prova!',
    videos: [],
    sites: [
      {
        id: 'site_pr4_1',
        titulo: 'Probabilidade de Eventos Complementares',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/matematica/eventos-complementares.htm',
        resumo: 'Propriedade P(A) + P(A^c) = 1 e aplicação na técnica do "pelo menos um".'
      },
      {
        id: 'site_pr4_2',
        titulo: 'Como Resolver Questões de Probabilidade no ENEM',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/probabilidade/',
        resumo: 'Atalhos algébricos para eventos complementares e lançamentos repetidos.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_pr4_1',
        ano: 'ENEM 2020',
        habilidadeId: 'PR4',
        contexto: 'Acertar Pelo Menos um Alvo',
        enunciado: 'Em uma competição de tiro com arco, um atleta tem probabilidade de 70% (0,70) de acertar o centro do alvo em cada flecha disparada, de forma independente. Se ele disparar 2 flechas seguidas, qual é a probabilidade de ele acertar o centro do alvo pelo menos uma vez?',
        alternativas: {
          A: '49%.',
          B: '70%.',
          C: '85%.',
          D: '91%.',
          E: '98%.'
        },
        correta: 'D',
        resolucao: '1) A probabilidade de acertar um disparo é 0,70; logo, a probabilidade complementar de ERRAR um disparo é 1 - 0,70 = 0,30.\n2) O evento complementar de "acertar pelo menos uma vez" é "errar os dois disparos".\n3) Probabilidade de errar os dois disparos: P(errar 1º e errar 2º) = 0,30 × 0,30 = 0,09 (9%).\n4) Logo, P(pelo menos um acerto) = 1 - 0,09 = 0,91 = 91%.'
      },
      {
        id: 'enem_pr4_2',
        ano: 'ENEM 2018',
        habilidadeId: 'PR4',
        contexto: 'Sorteio de Prêmios em Rifa',
        enunciado: 'Uma pessoa comprou 2 bilhetes de uma rifa que contém um total de 10 bilhetes numerados de 1 a 10. Serão sorteados 2 prêmios em sequência e sem reposição do primeiro bilhete sorteado. Qual é a probabilidade de essa pessoa ganhar pelo menos um dos dois prêmios?',
        alternativas: {
          A: '1/5.',
          B: '2/9.',
          C: '17/45.',
          D: '2/5.',
          E: '28/45.'
        },
        correta: 'C',
        resolucao: '1) Existem 10 bilhetes no total, sendo 2 da pessoa e 8 de outros participantes.\n2) Calculamos primeiro a probabilidade complementar (NÃO ganhar nenhum prêmio nas duas extrações): P(nenhum) = (8/10) × (7/9) = 56/90 = 28/45.\n3) Pela propriedade do complementar: P(pelo menos um prêmio) = 1 - 28/45 = 17/45.'
      }
    ]
  },

  matematica_probabilidade_bloco_3_PR5: {
    foco: 'A Probabilidade Condicional é um dos tópicos mais frequentes de Matemática no ENEM! Quando o enunciado disser "Sabendo-se que...", "Dado que..." ou "Dentre aqueles que...", ESQUEÇA o total geral e use apenas o total desse grupo restrito no denominador!',
    videos: [],
    sites: [
      {
        id: 'site_pr5_1',
        titulo: 'Probabilidade Condicional: Fórmula e Questões do ENEM',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/probabilidade-condicional/',
        resumo: 'Explicação intuitiva da redução do espaço amostral e questões oficiais do ENEM resolvidas.'
      },
      {
        id: 'site_pr5_2',
        titulo: 'Probabilidade Condicional e Teorema de Bayes',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/matematica/probabilidade-condicional.htm',
        resumo: 'Exemplos de testes diagnósticos, tabelas demográficas e eventos condicionados.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_pr5_1',
        ano: 'ENEM 2023',
        habilidadeId: 'PR5',
        contexto: 'Diagnóstico Médico e Tabela de Contingência',
        enunciado: 'Em um mutirão de saúde com 500 moradores, verificou-se que 200 praticam atividade física regularmente (dos quais 30 apresentaram pressão arterial elevada) e 300 são sedentários (dos quais 90 apresentaram pressão arterial elevada). Escolhendo-se ao acaso um morador e sabendo-se que ele apresentou pressão arterial elevada, qual é a probabilidade de ele ser sedentário?',
        alternativas: {
          A: '90/500 (18%).',
          B: '90/300 (30%).',
          C: '90/120 (75%).',
          D: '120/500 (24%).',
          E: '30/120 (25%).'
        },
        correta: 'C',
        resolucao: '1) Identificamos a condição dada ("sabendo-se que ele apresentou pressão arterial elevada").\n2) Total de moradores no grupo com pressão elevada (novo espaço amostral reduzido): 30 (ativos) + 90 (sedentários) = 120 moradores.\n3) Casos favoráveis dentro desse grupo (sedentários com pressão elevada): 90 moradores.\n4) Probabilidade condicional: P(Sedentário | Pressão Elevada) = 90 / 120 = 3/4 = 75%.'
      }
    ]
  },

  matematica_probabilidade_bloco_3_PR6: {
    foco: 'Viu o conectivo "E" (acontecer A na 1ª etapa E acontecer B na 2ª etapa)? Multiplique as probabilidades! Se for SEM reposição, lembre-se de atualizar o numerador e o denominador na 2ª fração.',
    videos: [],
    sites: [
      {
        id: 'site_pr6_1',
        titulo: 'Multiplicação de Probabilidades e Eventos Independentes',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/matematica/multiplicacao-probabilidades.htm',
        resumo: 'Regra do produto P(A ∩ B) = P(A) · P(B|A) com e sem reposição.'
      },
      {
        id: 'site_pr6_2',
        titulo: 'Eventos Independentes e Sucessivos na Probabilidade',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/matematica/eventos-independentes.htm',
        resumo: 'Como identificar independência estatística e calcular probabilidades em múltiplas etapas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_pr6_1',
        ano: 'ENEM 2022',
        habilidadeId: 'PR6',
        contexto: 'Sorteio Sucessivo Sem Reposição',
        enunciado: 'Em uma gaveta há 5 meias brancas e 3 meias pretas (total de 8 meias misturadas). No escuro, uma pessoa retira ao acaso 2 meias sucessivamente, sem reposição. Qual é a probabilidade de as duas meias retiradas serem da cor preta?',
        alternativas: {
          A: '3/28.',
          B: '9/64.',
          C: '3/8.',
          D: '6/8.',
          E: '15/28.'
        },
        correta: 'A',
        resolucao: '1) Probabilidade de a 1ª meia ser preta: há 3 pretas em 8 meias ⇒ P₁ = 3/8.\n2) Sem reposição, restam 7 meias na gaveta, sendo 2 pretas. Probabilidade de a 2ª meia também ser preta: P₂ = 2/7.\n3) Multiplicando as etapas ("1ª preta E 2ª preta"): P = (3/8) × (2/7) = 6/56 = 3/28.'
      },
      {
        id: 'enem_pr6_2',
        ano: 'ENEM 2021',
        habilidadeId: 'PR6',
        contexto: 'Previsão de Chuva e Eventos Independentes',
        enunciado: 'Um agricultor planeja aplicar um defensivo agrícola que exige dois dias seguidos sem chuva. Segundo o instituto de meteorologia, a probabilidade de chover na terça-feira é de 20% e a probabilidade de chover na quarta-feira é de 30%, sendo eventos independentes. Qual é a probabilidade de NÃO chover na terça-feira E NÃO chover na quarta-feira?',
        alternativas: {
          A: '6%.',
          B: '50%.',
          C: '56%.',
          D: '70%.',
          E: '94%.'
        },
        correta: 'C',
        resolucao: '1) Probabilidade de NÃO chover na terça-feira: 100% - 20% = 80% = 0,80.\n2) Probabilidade de NÃO chover na quarta-feira: 100% - 30% = 70% = 0,70.\n3) Como são eventos independentes, multiplicamos as probabilidades: P = 0,80 × 0,70 = 0,56 = 56%.'
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────────────────────
     4. QUÍMICA — LIGAÇÕES QUÍMICAS E INTERAÇÕES (LQ1 a LQ7)
     ────────────────────────────────────────────────────────────────────────── */
  quimica_ligacoes_bloco_1_LQ1: {
    foco: 'Metal (famílias 1, 2, 13, metais de transição — tendência a DOAR elétrons, formando cátions) + Ametal (famílias 15, 16, 17 — tendência a RECEBER elétrons, formando ânions) = Ligação Iônica! Cruze as cargas para achar a fórmula neutra.',
    videos: [],
    sites: [
      {
        id: 'site_lq1_1',
        titulo: 'Ligação Iônica: Como Ocorre, Exemplos e Regra do Octeto',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/ligacao-ionica/',
        resumo: 'Explicação visual da transferência de elétrons, regra do octeto e formulação de sais e óxidos iônicos.'
      },
      {
        id: 'site_lq1_2',
        titulo: 'Compostos Iônicos e Teoria do Octeto',
        portal: 'Manual da Química',
        url: 'https://www.manualdaquimica.com/quimica-geral/ligacao-ionica.htm',
        resumo: 'Exemplos de distribuição eletrônica da camada de valência e montagem de fórmulas químicas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_lq1_1',
        ano: 'ENEM 2020',
        habilidadeId: 'LQ1',
        contexto: 'Fluoretação da Água e Formação de Compostos Iônicos',
        enunciado: 'O cálcio (Ca, número atômico Z = 20, grupo 2 da Tabela Periódica) e o flúor (F, número atômico Z = 9, grupo 17 da Tabela Periódica) combinam-se formando o mineral fluorita, utilizado na indústria química e metalúrgica. Considerando os elétrons da camada de valência desses elementos, o tipo de ligação química e a fórmula mínima do composto formado são:',
        alternativas: {
          A: 'Covalente e CaF.',
          B: 'Covalente e CaF₂.',
          C: 'Iônica e Ca₂F.',
          D: 'Iônica e CaF₂.',
          E: 'Metálica e CaF₂.'
        },
        correta: 'D',
        resolucao: '1) O Cálcio (grupo 2, metal alcalinoterroso) possui 2 elétrons na camada de valência e tende a doá-los, formando o cátion bivalente Ca²⁺.\n2) O Flúor (grupo 17, halogênio/ametal) possui 7 elétrons na camada de valência e precisa receber 1 elétron para completar o octeto, formando o ânion F⁻.\n3) A união entre metal e ametal ocorre por ligação iônica. Cruzando as cargas (Ca²⁺ e 2 F⁻), a fórmula eletricamente neutra é CaF₂.'
      }
    ]
  },

  quimica_ligacoes_bloco_1_LQ2: {
    foco: 'Propriedade campeã no ENEM: Compostos iônicos (como NaCl, CaCO₃, KOH) têm altíssimo ponto de fusão e NÃO conduzem eletricidade quando sólidos, mas CONDUZEM quando fundidos ou dissolvidos em água (graças aos íons livres)!',
    videos: [],
    sites: [
      {
        id: 'site_lq2_1',
        titulo: 'Propriedades dos Compostos Iônicos e Condutividade',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/quimica/propriedades-dos-compostos-ionicos.htm',
        resumo: 'Retículo cristalino, pontos de fusão e ebulição, dureza, quebradiço e condução eletrolítica.'
      },
      {
        id: 'site_lq2_2',
        titulo: 'Ligações Químicas: Quadro Comparativo de Propriedades',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/quimica/ligacoes-quimicas.htm',
        resumo: 'Como identificar substâncias iônicas, moleculares e metálicas a partir de tabelas de laboratório.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_lq2_1',
        ano: 'ENEM 2018',
        habilidadeId: 'LQ2',
        contexto: 'Tabela de Propriedades Físicas no Laboratório',
        enunciado: 'Um químico analisou três sólidos puros (I, II e III) em laboratório: O sólido I tem ponto de fusão de 801 °C, não conduz eletricidade no estado sólido, mas conduz muito bem quando dissolvido em água ou fundido; O sólido II tem ponto de fusão de 1.085 °C e conduz eletricidade tanto no estado sólido quanto no líquido; O sólido III tem ponto de fusão de 80 °C e não conduz eletricidade em nenhum estado físico. Os tipos de ligação predominantes nos sólidos I, II e III são, respectivamente:',
        alternativas: {
          A: 'Iônica, metálica e covalente (molecular).',
          B: 'Metálica, iônica e covalente (molecular).',
          C: 'Iônica, covalente e metálica.',
          D: 'Covalente, metálica e iônica.',
          E: 'Metálica, covalente e iônica.'
        },
        correta: 'A',
        resolucao: '1) Sólido I: Alto PF e conduz apenas fundido ou em água (íons livres) → Composto Iônico (ex: NaCl).\n2) Sólido II: Alto PF e conduz já no estado sólido (elétrons livres no mar de elétrons) → Substância Metálica (ex: Cobre).\n3) Sólido III: Baixo PF e isolante elétrico em todos os estados → Composto Covalente Molecular (ex: naftaleno).'
      },
      {
        id: 'enem_lq2_2',
        ano: 'ENEM 2021',
        habilidadeId: 'LQ2',
        contexto: 'Soro Caseiro e Soluções Eletrolíticas',
        enunciado: 'Em uma aula experimental, o professor dissolveu sacarose (açúcar comum, C₁₂H₂₂O₁₁) no copo A com água destilada e cloreto de sódio (sal de cozinha, NaCl) no copo B com água destilada. Ao mergulhar os fios de um circuito com lâmpada em cada copo, verificou-se que apenas o copo B acendeu a lâmpada. Isso se explica porque:',
        alternativas: {
          A: 'A sacarose é um composto iônico insolúvel em água.',
          B: 'O NaCl é um composto iônico que sofre dissociação em água, liberando íons Na⁺(aq) e Cl⁻(aq) móveis que transportam carga elétrica.',
          C: 'A água destilada reage com a sacarose consumindo os elétrons livres.',
          D: 'O NaCl é um metal líquido em temperatura ambiente.',
          E: 'A sacarose sofre ionização total, bloqueando a corrente elétrica.'
        },
        correta: 'B',
        resolucao: '1) A sacarose (C₁₂H₂₂O₁₁) é um composto covalente molecular neutro: ela se dissolve na água por ligações de hidrogênio, mas não forma íons livres (solução não eletrolítica).\n2) O NaCl é um composto iônico: ao dissolver-se em água, ocorre a dissociação iônica do retículo cristalino em íons livres hidratados Na⁺(aq) e Cl⁻(aq), tornando a solução condutora (eletrolítica).'
      }
    ]
  },

  quimica_ligacoes_bloco_2_LQ3: {
    foco: 'Ametal + Ametal (ou Hidrogênio) compartilham pares de elétrons (Ligação Covalente). Saiba de cor as estruturas campeãs do ENEM: H₂O (2 ligações simples e 2 pares isolados no O), CO₂ (O=C=O, 2 duplas e zero par isolado no C), NH₃ (3 simples e 1 par isolado no N) e CH₄ (4 simples).',
    videos: [],
    sites: [
      {
        id: 'site_lq3_1',
        titulo: 'Ligação Covalente: Simples, Dupla, Tripla e Dativa',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/ligacao-covalente/',
        resumo: 'Fórmulas eletrônicas de Lewis, fórmulas estruturais e exemplos das moléculas mais cobradas.'
      },
      {
        id: 'site_lq3_2',
        titulo: 'Ligação Covalente Normal e Coordenada (Dativa)',
        portal: 'Manual da Química',
        url: 'https://www.manualdaquimica.com/quimica-geral/ligacao-covalente.htm',
        resumo: 'Diferença entre ligações sigma e pi e estruturas de SO₂, SO₃, O₃ e CO.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_lq3_1',
        ano: 'ENEM 2019',
        habilidadeId: 'LQ3',
        contexto: 'Ciclo do Nitrogênio e Inércia Química do N₂',
        enunciado: 'Embora o gás nitrogênio (N₂) constitua cerca de 78% da atmosfera terrestre, a maioria dos seres vivos não consegue absorvê-lo diretamente na forma gasosa, dependendo de bactérias fixadoras para convertê-lo em amônia (NH₃) ou nitratos. A baixíssima reatividade química (alta estabilidade) da molécula de N₂ no ar atmosférico deve-se ao fato de os dois átomos de nitrogênio (grupo 15, 5 elétrons na camada de valência) estarem unidos por:',
        alternativas: {
          A: 'Uma ligação iônica de alta energia reticular.',
          B: 'Uma ligação covalente simples de baixo comprimento.',
          C: 'Uma ligação covalente tripla (N≡N) de elevada energia de ligação, difícil de ser rompida.',
          D: 'Forças intermoleculares do tipo ligação de hidrogênio.',
          E: 'Uma ligação metálica com elétrons deslocalizados.'
        },
        correta: 'C',
        resolucao: '1) O átomo de Nitrogênio (grupo 15) possui 5 elétrons na camada de valência e precisa compartilhar 3 elétrons para completar seu octeto (8 elétrons).\n2) Assim, na molécula de N₂, forma-se uma ligação covalente tripla (N≡N), composta por 1 ligação sigma e 2 ligações pi.\n3) Essa ligação tripla possui altíssima energia de ligação (945 kJ/mol), tornando a molécula de N₂ muito estável e pouco reativa.'
      }
    ]
  },

  quimica_ligacoes_bloco_2_LQ4: {
    foco: 'Metais conduzem eletricidade e calor no estado SÓLIDO graças ao "mar de elétrons" livres! E lembre-se das principais ligas metálicas cobradas no ENEM: Aço (Ferro + Carbono), Aço Inox (Fe + C + Cr + Ni), Bronze (Cobre + Estanho) e Latão (Cobre + Zinco).',
    videos: [],
    sites: [
      {
        id: 'site_lq4_1',
        titulo: 'Ligação Metálica, Mar de Elétrons e Ligas Metálicas',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/ligacao-metalica/',
        resumo: 'Teoria da nuvem eletrônica, propriedades físicas dos metais (maleabilidade, ductilidade) e principais ligas.'
      },
      {
        id: 'site_lq4_2',
        titulo: 'Ligas Metálicas no Cotidiano e na Indústria',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/quimica/ligas-metalicas.htm',
        resumo: 'Composição e aplicações do aço, bronze, latão, amálgama e ouro 18 quilates.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_lq4_1',
        ano: 'ENEM 2020',
        habilidadeId: 'LQ4',
        contexto: 'Ouro 18 Quilates e Ligas Metálicas',
        enunciado: 'Na joalheria, o ouro puro (ouro 24 quilates) é considerado muito macio e deforma-se com facilidade. Por isso, utiliza-se comumente o ouro 18 quilates, que é uma liga metálica homogênea composta por 75% em massa de ouro (Au) e 25% de outros metais, como cobre (Cu) e prata (Ag). Nessa liga metálica, a união entre os átomos de Au, Cu e Ag ocorre por:',
        alternativas: {
          A: 'Transferência definitiva de elétrons formando cátions de cobre e ânions de ouro.',
          B: 'Compartilhamento direcional de pares de elétrons formando moléculas discretas de Au₃Cu.',
          C: 'Ligação metálica, com cátions metálicos imersos em uma nuvem de elétrons livres deslocalizados.',
          D: 'Interações dipolo permanente-dipolo permanente.',
          E: 'Pontes de hidrogênio entre as camadas cristalinas.'
        },
        correta: 'C',
        resolucao: '1) Ouro (Au), Cobre (Cu) e Prata (Ag) são elementos metálicos.\n2) Entre átomos de metais (seja em um metal puro ou em uma liga metálica), a interação interatômica é a Ligação Metálica.\n3) Pelo modelo do "mar de elétrons", os cátions da rede cristalina permanecem coesos graças à nuvem de elétrons de valência deslocalizados.'
      },
      {
        id: 'enem_lq4_2',
        ano: 'ENEM 2022',
        habilidadeId: 'LQ4',
        contexto: 'Ductilidade e Maleabilidade dos Metais',
        enunciado: 'Enquanto um cristal de sal-gema (NaCl) se estilhaça ao receber o impacto de um martelo, uma pepita de ouro ou uma chapa de alumínio apenas se achata (transformando-se em lâmina), sem se quebrar. Essa propriedade mecânica dos metais (maleabilidade) é explicada pelo fato de que:',
        alternativas: {
          A: 'Os elétrons livres da ligação metálica se deslocam facilmente e continuam mantendo a atração eletrostática entre os cátions mesmo após o deslizamento das camadas.',
          B: 'Os metais não possuem estrutura cristalina ordenada no estado sólido.',
          C: 'No sal-gema ocorrem ligações metálicas rígidas e nos metais ocorrem ligações iônicas flexíveis.',
          D: 'O impacto do martelo funde instantaneamente o metal à temperatura ambiente.',
          E: 'Os átomos metálicos possuem camada de valência completa com 8 elétrons.'
        },
        correta: 'A',
        resolucao: '1) Nos compostos iônicos (NaCl), o impacto desloca uma camada de íons e coloca íons de mesma carga frente a frente (+ com + e - com -), gerando forte repulsão que fratura o cristal.\n2) Nos metais, os cátions estão cercados pelo "mar de elétrons" móvel, que funciona como um amortecedor eletrostático, permitindo o deslizamento de planos atômicos (maleabilidade e ductilidade) sem romper a ligação.'
      }
    ]
  },

  quimica_ligacoes_bloco_3_LQ5: {
    foco: 'Regra rápida de geometria e polaridade para moléculas do tipo AX_n com ligantes iguais: se NÃO sobrar par de elétrons livre no átomo central (como CO₂ linear, BF₃ trigonal, CH₄ tetraédrica), os vetores se anulam e a molécula é APOLAR! Se SOBRAR par de elétrons livre (como H₂O angular e NH₃ piramidal), a molécula é POLAR!',
    videos: [],
    sites: [
      {
        id: 'site_lq5_1',
        titulo: 'Geometria Molecular e Teoria da Repulsão (VSEPR)',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/geometria-molecular/',
        resumo: 'Esquemas espaciais das geometrias linear, angular, trigonal plana, piramidal e tetraédrica.'
      },
      {
        id: 'site_lq5_2',
        titulo: 'Polaridade das Moléculas e Vetor Momento Dipolar',
        portal: 'Manual da Química',
        url: 'https://www.manualdaquimica.com/quimica-geral/polaridade-das-moleculas.htm',
        resumo: 'Como determinar se uma molécula é polar ou apolar a partir da geometria e eletronegatividade.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_lq5_1',
        ano: 'ENEM 2021',
        habilidadeId: 'LQ5',
        contexto: 'Solubilidade de Gases em Água e Polaridade',
        enunciado: 'A amônia (NH₃) é um gás extremamente solúvel em água (H₂O), enquanto o gás metano (CH₄) e o gás carbônico (CO₂) apresentam baixa solubilidade física na água pura. Essa diferença de comportamento em relação à água (molécula angular e polar) explica-se porque:',
        alternativas: {
          A: 'A molécula de NH₃ tem geometria piramidal e é polar (além de formar ligações de hidrogênio), enquanto CH₄ (tetraédrica) e CO₂ (linear) são moléculas apolares.',
          B: 'Tanto o CH₄ quanto o CO₂ são moléculas angulares fortemente polares.',
          C: 'A amônia (NH₃) é uma molécula trigonal plana e apolar.',
          D: 'A água (H₂O) possui geometria linear e é apolar.',
          E: 'O metano (CH₄) é um composto iônico insolúvel.'
        },
        correta: 'A',
        resolucao: '1) Na amônia (NH₃), o nitrogênio possui 1 par de elétrons não ligante, gerando geometria piramidal, molécula polar e capacidade de fazer ligação de hidrogênio com a H₂O.\n2) No metano (CH₄, tetraédrica simétrica) e no dióxido de carbono (O=C=O, linear simétrica), a soma vetorial dos momentos dipolares é zero (μ_R = 0), tornando-as moléculas apolares e pouco solúveis em água.'
      }
    ]
  },

  quimica_ligacoes_bloco_3_LQ6: {
    foco: 'A Ligação de Hidrogênio (H ligado a F, O ou N, como em H₂O, álcoois -OH, ácidos carboxílicos -COOH e aminas/amidas) é a interação intermolecular mais forte! Quanto mais ligações de hidrogênio uma molécula faz, MAIOR o seu Ponto de Ebulição e MENOR a sua volatilidade!',
    videos: [],
    sites: [
      {
        id: 'site_lq6_1',
        titulo: 'Forças Intermoleculares: Dipolo Induzido, Dipolo Permanente e Ligação de Hidrogênio',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/forcas-intermoleculares/',
        resumo: 'Comparação das três forças intermoleculares e seu efeito direto na temperatura de ebulição.'
      },
      {
        id: 'site_lq6_2',
        titulo: 'Ligação de Hidrogênio (Pontes de Hidrogênio) no ENEM',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/quimica/ligacoes-hidrogenio.htm',
        resumo: 'Como as pontes de hidrogênio explicam o alto ponto de ebulição da água, tensão superficial e dupla hélice do DNA.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_lq6_1',
        ano: 'ENEM 2020',
        habilidadeId: 'LQ6',
        contexto: 'Ponto de Ebulição de Compostos Orgânicos',
        enunciado: 'Considere três substâncias orgânicas de massas molares muito próximas: I. Butano (CH₃CH₂CH₂CH₃, hidrocarboneto); II. Propanona (CH₃COCH₃, cetona); III. Propan-1-ol (CH₃CH₂CH₂OH, álcool). Sabendo que as temperaturas de ebulição (a 1 atm) dessas três substâncias, fora de ordem, são -0,5 °C, 56 °C e 97 °C, a associação correta entre cada substância e seu respectivo ponto de ebulição é:',
        alternativas: {
          A: 'I: -0,5 °C (dipolo induzido); II: 56 °C (dipolo permanente); III: 97 °C (ligação de hidrogênio).',
          B: 'I: 97 °C; II: 56 °C; III: -0,5 °C.',
          C: 'I: 56 °C; II: -0,5 °C; III: 97 °C.',
          D: 'I: -0,5 °C; II: 97 °C; III: 56 °C.',
          E: 'I: 97 °C; II: -0,5 °C; III: 56 °C.'
        },
        correta: 'A',
        resolucao: '1) Butano (I) é um hidrocarboneto apolar → interage apenas por forças fracas de dipolo induzido (London) → menor ponto de ebulição (-0,5 °C).\n2) Propanona (II) possui o grupo carbonila (C=O) polar, mas sem H ligado ao oxigênio → interage por dipolo permanente → ponto de ebulição intermediário (56 °C).\n3) Propan-1-ol (III) possui o grupo hidroxila (-OH) → faz ligações de hidrogênio intensas → maior ponto de ebulição (97 °C).'
      }
    ]
  },

  quimica_ligacoes_bloco_3_LQ7: {
    foco: 'Tema favorito de Química no ENEM: "Semelhante dissolve semelhante"! Moléculas com muitas hidroxilas (-OH, como vitamina C e glicose) são POLARES (hidrossolúveis). Moléculas com longa cadeia apenas de C e H (hidrocarbonetos, óleos, vitaminas A, D, E, K) são APOLARES (lipossolúveis). E detergentes/sabões têm as duas partes (anfifílicos)!',
    videos: [],
    sites: [
      {
        id: 'site_lq7_1',
        titulo: 'Polaridade, Solubilidade e Ação dos Sabões e Detergentes',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/quimica/como-sabao-limpa.htm',
        resumo: 'Formação de micelas, estruturas anfifílicas (tensoativos) e remoção de óleos e gorduras.'
      },
      {
        id: 'site_lq7_2',
        titulo: 'Solubilidade e Vitaminas Hidrossolúveis vs. Lipossolúveis no ENEM',
        portal: 'Manual da Química',
        url: 'https://www.manualdaquimica.com/quimica-geral/solubilidade.htm',
        resumo: 'Regra "semelhante dissolve semelhante" aplicada a vitaminas, pesticidas e derramamento de petróleo.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_lq7_1',
        ano: 'ENEM 2023',
        habilidadeId: 'LQ7',
        contexto: 'Tensoativos, Sabões e Limpeza de Penas de Aves',
        enunciado: 'Em acidentes com derramamento de petróleo no mar, aves marinhas ficam com as penas recobertas pelo óleo pesado (mistura de hidrocarbonetos apolares). Lavar as aves apenas com água pura não remove o petróleo. Para salvá-las, voluntários utilizam água adicionada de um detergente neutro (tensoativo). O detergente atua eficientemente nesse processo porque suas moléculas:',
        alternativas: {
          A: 'São totalmente apolares, reagindo com a água para formar um gás que expulsa o óleo.',
          B: 'Possuem caráter anfifílico (uma cauda carbônica apolar que interage com o petróleo por dipolo induzido e uma cabeça polar/iônica que interage com a água), formando micelas que arrastam o óleo.',
          C: 'São totalmente iônicas e insolúveis tanto na água quanto no petróleo.',
          D: 'Oxidam os hidrocarbonetos do petróleo transformando-os instantaneamente em sal de cozinha.',
          E: 'Aumentam a tensão superficial da água para impedir que ela encoste nas penas.'
        },
        correta: 'B',
        resolucao: '1) O petróleo é constituído por hidrocarbonetos apolares e a água é fortemente polar (não se misturam).\n2) O detergente é um agente tensoativo anfifílico (ou anfipático): sua longa cadeia carbônica apolar (hidrofóbica/lipofílica) dissolve-se nas gotículas de petróleo, enquanto sua extremidade polar/iônica (hidrofílica) interage com a água ao redor.\n3) Isso forma estruturas esféricas chamadas micelas, emulsificando o óleo na água e permitindo o enxágue.'
      }
    ]
  },

  /* ──────────────────────────────────────────────────────────────────────────
     5. QUÍMICA — ESTEQUIOMETRIA (EQ1 a EQ7)
     ────────────────────────────────────────────────────────────────────────── */
  quimica_estequiometria_bloco_1_EQ1: {
    foco: 'Sempre confira se a massa dada na questão está em gramas (g), miligramas (1 g = 1.000 mg), quilogramas (1 kg = 1.000 g) ou toneladas (1 t = 10⁶ g) antes de relacionar com a Massa Molar (g/mol)!',
    videos: [],
    sites: [
      {
        id: 'site_eq1_1',
        titulo: 'Massa Molar e Quantidade de Matéria (Mol)',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/massa-molar/',
        resumo: 'Como calcular a massa molar a partir da fórmula química e converter gramas em mols (n = m/M).'
      },
      {
        id: 'site_eq1_2',
        titulo: 'Conceito de Mol e Cálculo de Massa Molar',
        portal: 'Manual da Química',
        url: 'https://www.manualdaquimica.com/fisico-quimica/mol.htm',
        resumo: 'Exemplos resolvidos de conversão entre massa, número de mols e unidades de medida.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_eq1_1',
        ano: 'ENEM 2021',
        habilidadeId: 'EQ1',
        contexto: 'Suplementação de Ferro contra Anemia',
        enunciado: 'Para o tratamento de anemia ferropriva, um médico prescreveu a um paciente a ingestão diária de um comprimido contendo 304 mg de sulfato ferroso anidro (FeSO₄). Sabendo que as massas molares são Fe = 56 g/mol, S = 32 g/mol e O = 16 g/mol, qual é a quantidade de matéria (em mols) e a massa de íons ferro (Fe²⁺) ingerida diariamente por esse paciente?',
        alternativas: {
          A: '0,002 mol (2 × 10⁻³ mol) e 112 mg de ferro.',
          B: '0,001 mol (1 × 10⁻³ mol) e 56 mg de ferro.',
          C: '0,020 mol (2 × 10⁻² mol) e 112 mg de ferro.',
          D: '0,002 mol (2 × 10⁻³ mol) e 56 mg de ferro.',
          E: '0,500 mol e 152 mg de ferro.'
        },
        correta: 'A',
        resolucao: '1) Calculamos a massa molar do FeSO₄: M = 56 + 32 + 4(16) = 56 + 32 + 64 = 152 g/mol.\n2) Convertemos a massa do comprimido para gramas: m = 304 mg = 0,304 g.\n3) Quantidade de matéria (mols): n = m / M = 0,304 / 152 = 0,002 mol (2 × 10⁻³ mol de FeSO₄).\n4) Como 1 mol de FeSO₄ contém 1 mol de Fe (56 g), 0,002 mol contém: m_Fe = 0,002 × 56 g = 0,112 g = 112 mg de ferro.'
      }
    ]
  },

  quimica_estequiometria_bloco_1_EQ2: {
    foco: 'A Constante de Avogadro (6,0 × 10²³ mol⁻¹) é a ponte entre o mundo macroscópico (gramas) e o mundo microscópico (número de átomos ou moléculas): 1 mol = Massa Molar em gramas = 6,0 × 10²³ moléculas!',
    videos: [],
    sites: [
      {
        id: 'site_eq2_1',
        titulo: 'Constante de Avogadro e Número de Moléculas',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/quimica/constante-avogadro.htm',
        resumo: 'Aplicação de 6,0 × 10²³ entidades/mol em questões do ENEM e potência de base 10.'
      },
      {
        id: 'site_eq2_2',
        titulo: 'Volume Molar dos Gases e Condições Normais (CNTP)',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/quimica/volume-molar-dos-gases.htm',
        resumo: 'Relação entre mol, massa e volume ocupado por gases nas CNTP (22,4 L/mol) e condições ambientes.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_eq2_1',
        ano: 'ENEM 2019',
        habilidadeId: 'EQ2',
        contexto: 'Moléculas de Vitamina C em um Comprimido Efervescente',
        enunciado: 'Um comprimido efervescente contém 880 mg (0,88 g) de ácido ascórbico (vitamina C, fórmula molecular C₆H₈O₆, massa molar = 176 g/mol). Considere a Constante de Avogadro igual a 6,0 × 10²³ mol⁻¹. O número de moléculas de vitamina C presentes em um único comprimido efervescente é igual a:',
        alternativas: {
          A: '3,0 × 10²¹ moléculas.',
          B: '6,0 × 10²¹ moléculas.',
          C: '3,0 × 10²² moléculas.',
          D: '5,0 × 10²¹ moléculas.',
          E: '1,2 × 10²³ moléculas.'
        },
        correta: 'A',
        resolucao: '1) Sabemos que 1 mol de vitamina C tem 176 g e contém 6,0 × 10²³ moléculas.\n2) Calculamos o número de mols em 0,88 g: n = 0,88 / 176 = 0,005 mol = 5,0 × 10⁻³ mol.\n3) Multiplicamos pela Constante de Avogadro: N = (5,0 × 10⁻³) × (6,0 × 10²³) = 30 × 10²⁰ = 3,0 × 10²¹ moléculas.'
      },
      {
        id: 'enem_eq2_2',
        ano: 'ENEM 2020',
        habilidadeId: 'EQ2',
        contexto: 'Volume de Gás Metano em Biodigestor',
        enunciado: 'Em uma fazenda, um biodigestor produz 320 g de gás metano puro (CH₄, massa molar = 16 g/mol) a partir de dejetos orgânicos. Nas condições de temperatura e pressão do reservatório, 1 mol de gás ocupa 24,5 litros. Qual é o volume ocupado por essa quantidade de metano produzida?',
        alternativas: {
          A: '245 litros.',
          B: '490 litros.',
          C: '320 litros.',
          D: '448 litros.',
          E: '980 litros.'
        },
        correta: 'B',
        resolucao: '1) Número de mols de CH₄: n = m / M = 320 g / 16 g/mol = 20 mols.\n2) Como cada 1 mol ocupa 24,5 L nessas condições: V = 20 × 24,5 L = 490 litros.'
      }
    ]
  },

  quimica_estequiometria_bloco_2_EQ3: {
    foco: 'Antes de fazer qualquer conta estequiométrica no ENEM, olhe para a equação química e confira se está BALANCEADA! Use a regra MACHO (Metais → Ametais → Carbono → Hidrogênio → Oxigênio).',
    videos: [],
    sites: [
      {
        id: 'site_eq3_1',
        titulo: 'Leis Ponderais: Lei de Lavoisier e Lei de Proust',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/leis-ponderais/',
        resumo: 'Conservação das massas na natureza e lei das proporções constantes com exercícios.'
      },
      {
        id: 'site_eq3_2',
        titulo: 'Balanceamento de Equações Químicas (Regra MACHO)',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/quimica/balanceamento-equacoes-quimicas.htm',
        resumo: 'Passo a passo do método das tentativas para igualar os átomos nos reagentes e produtos.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_eq3_1',
        ano: 'ENEM 2018',
        habilidadeId: 'EQ3',
        contexto: 'Oxidação da Palha de Aço e Lei de Lavoisier',
        enunciado: 'Um estudante coloca um chumaço de palha de aço (constituída essencialmente por ferro, Fe) sobre o prato de uma balança digital aberta ao ar, registrando a massa inicial de 10,0 g. Em seguida, ele ateia fogo à palha de aço, que queima com fagulhas sem cair nada para fora do prato, formando óxido de ferro sólido (4 Fe(s) + 3 O₂(g) → 2 Fe₂O₃(s)). Ao final da reação, a leitura da balança:',
        alternativas: {
          A: 'Diminui, pois toda combustão consome e destrói parte da matéria.',
          B: 'Permanece exatamente 10,0 g, pois a massa sempre se conserva no prato aberto.',
          C: 'Aumenta, pois átomos de oxigênio (O₂) que estavam no ar gasoso foram incorporados ao ferro, formando o óxido sólido sobre o prato.',
          D: 'Zera, pois o óxido de ferro é totalmente gasoso.',
          E: 'Diminui pela metade devido à liberação de calor.'
        },
        correta: 'C',
        resolucao: '1) Pela Lei de Lavoisier, a massa total do sistema fechado (ferro + oxigênio do ar) é conservada.\n2) Porém, inicialmente a balança pesava apenas o ferro sólido (10,0 g), e não o gás oxigênio da atmosfera.\n3) Após a reação (4 Fe(s) + 3 O₂(g) → 2 Fe₂O₃(s)), o oxigênio do ar combina-se quimicamente com o ferro para formar um produto sólido (Fe₂O₃) sobre o prato, fazendo a leitura da balança aumentar!'
      }
    ]
  },

  quimica_estequiometria_bloco_2_EQ4: {
    foco: 'Na regra de três estequiométrica padrão, trabalhe apenas com as DUAS substâncias mencionadas no problema (a que tem o dado numérico e a que tem a pergunta). Você não precisa calcular a massa molar das outras substâncias da equação!',
    videos: [],
    sites: [
      {
        id: 'site_eq4_1',
        titulo: 'Cálculo Estequiométrico: Como Fazer Passo a Passo',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/calculo-estequiometrico/',
        resumo: 'Método das 3 linhas para resolver qualquer problema estequiométrico de massa, mol e volume.'
      },
      {
        id: 'site_eq4_2',
        titulo: 'Estequiometria no ENEM: Questões Resolvidas',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/quimica/calculo-estequiometrico.htm',
        resumo: 'Resolução detalhada das questões mais recorrentes de emissão de CO₂, neutralização e combustão.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_eq4_1',
        ano: 'ENEM 2023',
        habilidadeId: 'EQ4',
        contexto: 'Captura de CO₂ e Calagem do Solo',
        enunciado: 'O hidrogenocarbonato de sódio (bicarbonato de sódio, NaHCO₃, massa molar = 84 g/mol) é utilizado como fermento químico em pães e bolos porque, ao ser aquecido no forno, sofre decomposição térmica liberando gás carbônico (CO₂, massa molar = 44 g/mol), responsável por fazer a massa crescer, segundo a reação balanceada: 2 NaHCO₃(s) → Na₂CO₃(s) + CO₂(g) + H₂O(g). Se um padeiro adicionar 16,8 g de NaHCO₃ puro à receita, qual será a massa de gás carbônico (CO₂) liberada na decomposição completa?',
        alternativas: {
          A: '2,2 gramas.',
          B: '4,4 gramas.',
          C: '8,8 gramas.',
          D: '16,8 gramas.',
          E: '44,0 gramas.'
        },
        correta: 'B',
        resolucao: '1) Pela equação balanceada, 2 mols de NaHCO₃ produzem 1 mol de CO₂.\n2) Passando a proporção para massa (1ª linha): 2 × 84 g = 168 g de NaHCO₃ ———— 1 × 44 g = 44 g de CO₂.\n3) Na 2ª linha, para 16,8 g de NaHCO₃ (que é exatamente um décimo de 168 g): x = 44 / 10 = 4,4 gramas de CO₂.'
      },
      {
        id: 'enem_eq4_2',
        ano: 'ENEM 2022',
        habilidadeId: 'EQ4',
        contexto: 'Combustão do Etanol e Emissão de Gás Carbônico',
        enunciado: 'A combustão completa de 1 mol de etanol (C₂H₆O, massa molar = 46 g/mol) é representada pela equação: 1 C₂H₆O(l) + 3 O₂(g) → 2 CO₂(g) + 3 H₂O(g). Sabendo que a massa molar do CO₂ é 44 g/mol, a queima completa de 920 g de etanol puro no motor de um veículo libera qual massa de gás carbônico (CO₂)?',
        alternativas: {
          A: '440 g.',
          B: '880 g.',
          C: '1.320 g.',
          D: '1.760 g.',
          E: '2.640 g.'
        },
        correta: 'D',
        resolucao: '1) Pela equação balanceada, 1 mol de etanol (46 g) produz 2 mols de CO₂ (2 × 44 g = 88 g).\n2) Montando a proporção:\n46 g de etanol ———— 88 g de CO₂\n920 g de etanol ———— x\n3) Como 920 / 46 = 20 mols de etanol: x = 20 × 88 g = 1.760 g (ou 1,76 kg) de CO₂.'
      }
    ]
  },

  quimica_estequiometria_bloco_3_EQ5: {
    foco: 'Impureza NÃO participa da reação! Se você tem 500 kg de um minério com 80% de pureza, a primeira conta que você faz é 500 × 0,80 = 400 kg de substância pura. Use apenas os 400 kg na estequiometria!',
    videos: [],
    sites: [
      {
        id: 'site_eq5_1',
        titulo: 'Cálculo Estequiométrico com Grau de Pureza',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/quimica/calculo-estequiometrico-com-pureza-reagentes.htm',
        resumo: 'Como descontar impurezas em amostras de minérios (bauxita, hematita, calcário) e determinar o teor de pureza.'
      },
      {
        id: 'site_eq5_2',
        titulo: 'Pureza de Reagentes na Estequiometria do ENEM',
        portal: 'Manual da Química',
        url: 'https://www.manualdaquimica.com/quimica-geral/estequiometria-com-grau-pureza.htm',
        resumo: 'Exemplos passo a passo tanto para achar o produto quanto para descobrir a pureza da amostra inicial.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_eq5_1',
        ano: 'ENEM 2020',
        habilidadeId: 'EQ5',
        contexto: 'Obtenção do Cobre Metálico a partir da Calcosita',
        enunciado: 'O cobre metálico (Cu, massa molar = 63,5 g/mol) pode ser obtido a partir da ustulação do minério calcosita (Cu₂S, massa molar = 159 g/mol), de acordo com a equação balanceada: Cu₂S(s) + O₂(g) → 2 Cu(l) + SO₂(g). Uma metalúrgica processou 1.000 kg de uma amostra bruta de minério calcosita que possui 79,5% de pureza em Cu₂S. Admitindo rendimento de 100%, a massa de cobre metálico obtida foi de:',
        alternativas: {
          A: '317,5 kg.',
          B: '500,0 kg.',
          C: '635,0 kg.',
          D: '795,0 kg.',
          E: '1.270,0 kg.'
        },
        correta: 'C',
        resolucao: '1) Descontamos as impurezas para achar a massa pura de Cu₂S: m_pura = 79,5% de 1.000 kg = 795 kg de Cu₂S.\n2) Pela equação balanceada, 1 mol de Cu₂S (159 g) produz 2 mols de Cu (2 × 63,5 = 127 g).\n3) Regra de três:\n159 kg de Cu₂S ———— 127 kg de Cu\n795 kg de Cu₂S ———— x\n4) Como 795 / 159 = 5: x = 5 × 127 kg = 635,0 kg de cobre metálico.'
      }
    ]
  },

  quimica_estequiometria_bloco_3_EQ6: {
    foco: 'Cuidado com a direção da pergunta no Rendimento! Se a questão dá o reagente e pede quanto produto foi obtido com 80% de rendimento, você MULTIPLICA por 0,80. Mas se a questão diz "Quanto reagente devo usar para OBTER 800 kg de produto sabendo que o rendimento é 80%?", você deve DIVIDIR por 0,80 (pois precisará mirar em 1.000 kg teóricos)!',
    videos: [],
    sites: [
      {
        id: 'site_eq6_1',
        titulo: 'Rendimento das Reações Químicas e Cálculos no ENEM',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/rendimento-quimico/',
        resumo: 'Diferença entre rendimento teórico e rendimento real/experimental com questões do ENEM comentadas.'
      },
      {
        id: 'site_eq6_2',
        titulo: 'Cálculo Estequiométrico com Rendimento e Pureza',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/quimica/rendimento-uma-reacao.htm',
        resumo: 'Como combinar pureza e rendimento em uma única equação estequiométrica.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_eq6_1',
        ano: 'ENEM 2019',
        habilidadeId: 'EQ6',
        contexto: 'Síntese Industrial da Aspirina (AAS)',
        enunciado: 'O ácido acetilsalicílico (AAS, C₉H₈O₄, massa molar = 180 g/mol) é sintetizado a partir da reação do ácido salicílico (C₇H₆O₃, massa molar = 138 g/mol) com o anidrido acético, na proporção estequiométrica de 1 : 1 (1 mol de ácido salicílico produz 1 mol de AAS). Em um lote farmacêutico, partiu-se de 138 kg de ácido salicílico puro e obteve-se, ao final da purificação, 135 kg de AAS. Qual foi o rendimento percentual dessa síntese?',
        alternativas: {
          A: '65%.',
          B: '75%.',
          C: '80%.',
          D: '85%.',
          E: '98%.'
        },
        correta: 'B',
        resolucao: '1) Na proporção 1 : 1, 1 mol de ácido salicílico (138 g) produz teoricamente (100% de rendimento) 1 mol de AAS (180 g).\n2) Logo, partindo de 138 kg de ácido salicílico, a produção teórica máxima (100%) seria de 180 kg de AAS.\n3) Como foram obtidos na prática 135 kg de AAS, o rendimento percentual é:\nR = (massa real / massa teórica) × 100% = (135 / 180) × 100% = 0,75 × 100% = 75%.'
      }
    ]
  },

  quimica_estequiometria_bloco_3_EQ7: {
    foco: 'Como saber que a questão do ENEM é de Reagente Limitante/Excesso? Ela dá o valor inicial dos DOIS reagentes! Divida o valor dado de cada reagente pelo seu valor na 1ª linha da equação: o que der o MENOR resultado é o Limitante (e é ele quem você usa para calcular o produto)!',
    videos: [],
    sites: [
      {
        id: 'site_eq7_1',
        titulo: 'Reagente Limitante e Reagente em Excesso: Como Descobrir',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/reagente-limitante-e-reagente-em-excesso/',
        resumo: 'Método prático da razão estequiométrica para identificar rapidamente quem acaba primeiro e quem sobra.'
      },
      {
        id: 'site_eq7_2',
        titulo: 'Excesso e Limitante na Estequiometria do ENEM',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/quimica/reagente-em-excesso-reagente-limitante.htm',
        resumo: 'Exercícios comentados sobre neutralização de efluentes e reações industriais com reagentes fora da proporção.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_eq7_1',
        ano: 'ENEM 2021',
        habilidadeId: 'EQ7',
        contexto: 'Tratamento de Derramamento de Ácido Sulfúrico',
        enunciado: 'Um caminhão-tanque tombou derramando uma solução contendo 196 kg de ácido sulfúrico puro (H₂SO₄, massa molar = 98 g/mol). Para neutralizar o ácido na pista, a equipe de emergência lançou sobre o local 250 kg de carbonato de cálcio (CaCO₃, massa molar = 100 g/mol), ocorrendo a reação: H₂SO₄ + CaCO₃ → CaSO₄ + H₂O + CO₂. Ao final da reação, verifica-se que:',
        alternativas: {
          A: 'O ácido não foi totalmente neutralizado, pois faltaram 50 kg de CaCO₃.',
          B: 'O H₂SO₄ é o reagente limitante (foi totalmente neutralizado), sobrando 50 kg de CaCO₃ em excesso e liberando 88 kg de CO₂ (massa molar = 44 g/mol).',
          C: 'O CaCO₃ é o reagente limitante e sobram 54 kg de H₂SO₄ sem reagir.',
          D: 'Os dois reagentes estão em proporção estequiométrica exata, não sobrando nenhum dos dois.',
          E: 'O H₂SO₄ é o reagente limitante e foram liberados 110 kg de CO₂.'
        },
        correta: 'B',
        resolucao: '1) Pela equação balanceada (proporção 1 : 1), 1 mol de H₂SO₄ (98 g) reage exatamente com 1 mol de CaCO₃ (100 g) e produz 1 mol de CO₂ (44 g).\n2) Temos 196 kg de H₂SO₄ (que equivalem a 196 / 98 = 2.000 mols) e 250 kg de CaCO₃ (que equivalem a 250 / 100 = 2.500 mols).\n3) Como a proporção é 1 : 1, os 196 kg de H₂SO₄ (limitante) consomem exatamente 2 × 100 kg = 200 kg de CaCO₃.\n4) Portanto, todo o ácido é neutralizado, sobram 250 - 200 = 50 kg de CaCO₃ em excesso, e a massa de CO₂ formada (comandada pelo limitante H₂SO₄) é 2 × 44 kg = 88 kg.'
      }
    ]
  }
};

// Cria aliases automáticos sem underscore no bloco (ex: fisica_cinetica_bloco1_M1 <-> fisica_cinetica_bloco_1_M1)
Object.keys(window.CatalogTopicResources).forEach(function(k) {
  var alias = k.replace('_bloco_', '_bloco');
  if (alias !== k && !window.CatalogTopicResources[alias]) {
    window.CatalogTopicResources[alias] = window.CatalogTopicResources[k];
  }
});

// optica-blocks.js — Carregamento integrado do diagnostico_optica.json + Recursos de Estudo Curados
// Compatível com GitHub Pages (fetch './diagnostico_optica.json') e execução local (file:// fallback síncrono)

window.DiagnosticoOpticaData = {
  "materia": "Física",
  "assunto": "Óptica",
  "descricao": "Diagnóstico estruturado por habilidades para mapear seu domínio real em Óptica Geométrica e Física, sem punições por dúvidas ou questões em branco.",
  "blocos": [
    {
      "id": "bloco_1",
      "ordem": 1,
      "titulo": "Fundamentos da Luz",
      "tempoEstimado": "4–6 min",
      "descricao": "Propagação retilínea, câmara escura, meios ópticos, sombra, penumbra e eclipses.",
      "resumo": "### Conceitos Essenciais\n- **Propagação Retilínea:** Nos meios homogêneos e transparentes, a luz viaja sempre em linha reta. É isso que explica a formação de sombras e o fato de a imagem em uma **câmara escura de orifício** aparecer sempre **invertida** (os raios do topo cruzam o furo em linha reta e atingem a base).\n- **Meios Ópticos:**\n  - *Transparente:* Permite a passagem regular da luz; vemos com nitidez (ex: vidro liso, ar).\n  - *Translúcido:* A luz passa de forma difusa/espalhada; vemos apenas vultos sem nitidez (ex: vidro fosco, papel vegetal).\n  - *Opaco:* Bloqueia a passagem da luz.\n- **Sombra vs. Penumbra:** Fontes pontuais geram apenas sombra nítida (umbra). Fontes extensas geram uma região central totalmente escura (**umbra**) cercada por uma transição parcialmente iluminada (**penumbra**).\n- **Eclipses:** No **Eclipse Solar**, a Lua entra entre o Sol e a Terra, projetando sua sombra na Terra. No **Eclipse Lunar**, a Terra fica entre o Sol e a Lua, projetando sua sombra sobre a Lua.",
      "habilidades": [
        { "id": "A1", "nome": "Propagação retilínea e câmara escura" },
        { "id": "A2", "nome": "Classificação de meios ópticos" },
        { "id": "A3", "nome": "Sombras, penumbra e eclipses" }
      ],
      "questoes": [
        {
          "id": "opt_b1_q1",
          "habilidadeId": "A1",
          "contexto": "Câmara Escura",
          "enunciado": "Ao observar uma árvore iluminada pelo Sol através de uma câmara escura de orifício, um estudante percebe que a imagem projetada no fundo da caixa aparece totalmente invertida. Qual princípio óptico explica diretamente essa inversão?",
          "alternativas": {
            "A": "A luz sofre difração ao atravessar o pequeno orifício, invertendo a fase das frentes de onda.",
            "B": "A luz se propaga em linha reta, fazendo os raios vindos do topo da árvore atingirem a base da câmara.",
            "C": "A luz sofre refração ao passar do ar externo para o ar confinado na caixa, cruzando os raios no centro."
          },
          "correta": "B"
        },
        {
          "id": "opt_b1_q2",
          "habilidadeId": "A2",
          "contexto": "Meios Ópticos",
          "enunciado": "Uma divisória de vidro jateado (fosco) permite que a claridade de uma janela ilumine o escritório, mas impede que as pessoas enxerguem com nitidez quem está do outro lado. Fisicamente, esse vidro atua como um meio:",
          "alternativas": {
            "A": "Opaco seletivo, pois absorve a imagem e transmite apenas o calor da radiação.",
            "B": "Translúcido, pois permite a passagem da luz, mas provoca forte espalhamento (difusão) dos raios.",
            "C": "Transparente de alto índice de refração, desviando todos os raios para um único foco."
          },
          "correta": "B"
        },
        {
          "id": "opt_b1_q3",
          "habilidadeId": "A3",
          "contexto": "Sombra e Penumbra",
          "enunciado": "Quando um refletor extenso ilumina um obstáculo opaco, projeta-se na parede uma região central escura cercada por um contorno parcialmente iluminado (penumbra). A penumbra existe porque:",
          "alternativas": {
            "A": "A luz sofre interferência destrutiva parcial ao raspar nas bordas do obstáculo.",
            "B": "Apenas os raios de maior comprimento de onda conseguem contornar o objeto opaco.",
            "C": "Essa região recebe raios de luz vindos de uma parte da fonte extensa, enquanto outra parte é bloqueada pelo objeto."
          },
          "correta": "C"
        },
        {
          "id": "opt_b1_q4",
          "habilidadeId": "A3",
          "contexto": "Eclipse Solar",
          "enunciado": "Durante um eclipse solar, moradores de uma pequena faixa da Terra veem o dia escurecer completamente por alguns minutos, enquanto cidades vizinhas veem o Sol apenas parcialmente coberto. Os moradores que veem o escurecimento total estão localizados:",
          "alternativas": {
            "A": "Na região de umbra projetada pela Lua sobre a superfície da Terra.",
            "B": "Na região de penumbra da Lua, onde a refração atmosférica anula a luz solar.",
            "C": "Na região de umbra projetada pela Terra sobre a face visível da Lua."
          },
          "correta": "A"
        },
        {
          "id": "opt_b1_q5",
          "habilidadeId": "A3",
          "contexto": "Eclipse Lunar",
          "enunciado": "Em uma noite de Lua Cheia, ocorre um eclipse lunar total e a Lua perde seu brilho prateado intenso. Esse fenômeno acontece porque:",
          "alternativas": {
            "A": "A Lua entra temporariamente em fase Nova ao cruzar a órbita terrestre.",
            "B": "A Terra posiciona-se entre o Sol e a Lua, interceptando a luz solar e projetando seu cone de sombra sobre a Lua.",
            "C": "A luz solar sofre reflexão total interna na atmosfera da Terra, não conseguindo chegar até a superfície lunar."
          },
          "correta": "B"
        }
      ]
    },
    {
      "id": "bloco_2",
      "ordem": 2,
      "titulo": "Reflexão da Luz e Espelhos",
      "tempoEstimado": "8–12 min",
      "descricao": "Espelhos planos, espelhos esféricos (côncavos e convexos), raios notáveis e Equação de Gauss.",
      "resumo": "### Conceitos Essenciais\n- **Lei da Reflexão:** O ângulo de incidência é sempre igual ao ângulo de reflexão ($i = r$), ambos medidos **em relação à reta Normal** (perpendicular à superfície).\n- **Espelho Plano:** Forma imagem **virtual, direita, do mesmo tamanho** e com inversão lateral (enantiomorfa). A distância do objeto ao espelho ($d$) é igual à distância da imagem ao espelho ($d$). Logo, a distância entre a pessoa e sua imagem é $2d$.\n- **Espelho Convexo:** Sempre forma imagem **virtual, direita e menor**, aumentando o campo visual (usado em retrovisores e segurança). Seu foco é negativo ($f < 0$).\n- **Espelho Côncavo ($f > 0$):**\n  - Objeto *além de C*: imagem real, invertida e menor.\n  - Objeto *entre C e F*: imagem real, invertida e maior.\n  - Objeto *no Foco (F)*: raios saem paralelos (imprópria — usada em faróis).\n  - Objeto *entre F e Vértice (V)*: imagem **virtual, direita e maior** (espelho de maquiagem/dentista).\n- **Fórmulas:** $f = R / 2$ | Equação de Gauss: $\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{p'}$ (se $p' > 0$, imagem real; se $p' < 0$, imagem virtual).",
      "habilidades": [
        { "id": "B1", "nome": "Lei da reflexão e espelhos planos" },
        { "id": "B2", "nome": "Espelhos esféricos: formação de imagens e aplicações" },
        { "id": "B3", "nome": "Raios notáveis e relação foco-raio" },
        { "id": "B4", "nome": "Cálculos com a Equação de Gauss em espelhos" }
      ],
      "questoes": [
        {
          "id": "opt_b2_q1",
          "habilidadeId": "B1",
          "contexto": "Lei da Reflexão",
          "enunciado": "Um feixe de laser incide sobre um espelho plano formando um ângulo de 30° com a superfície do espelho. Qual é o valor do ângulo de reflexão (medido em relação à reta normal)?",
          "alternativas": {
            "A": "30°.",
            "B": "60°.",
            "C": "90°."
          },
          "correta": "B"
        },
        {
          "id": "opt_b2_q2",
          "habilidadeId": "B1",
          "contexto": "Distância no Espelho Plano",
          "enunciado": "Uma estudante está parada a 2,0 metros de um grande espelho plano vertical. Se ela caminhar 0,5 metro em direção ao espelho, qual passará a ser a distância entre a estudante e a sua própria imagem?",
          "alternativas": {
            "A": "1,5 metro.",
            "B": "3,0 metros.",
            "C": "1,0 metro."
          },
          "correta": "B"
        },
        {
          "id": "opt_b2_q3",
          "habilidadeId": "B2",
          "contexto": "Espelho de Segurança",
          "enunciado": "Espelhos esféricos convexos são amplamente instalados no alto de corredores de supermercados e saídas de garagens. A escolha desse espelho se deve ao fato de que, para qualquer posição de um objeto real, ele conjuga uma imagem:",
          "alternativas": {
            "A": "Real, direita e reduzida, focando a luz diretamente no olho do observador.",
            "B": "Virtual, direita e menor que o objeto, o que proporciona um amplo campo visual.",
            "C": "Virtual e ampliada quando o objeto está próximo, facilitando a identificação de rostos."
          },
          "correta": "B"
        },
        {
          "id": "opt_b2_q4",
          "habilidadeId": "B2",
          "contexto": "Espelho de Maquiagem",
          "enunciado": "Para enxergar detalhes do rosto ampliados e na posição normal (direita), uma pessoa utiliza um espelho esférico côncavo. Para que o espelho funcione dessa maneira, o rosto precisa estar posicionado:",
          "alternativas": {
            "A": "Entre o foco principal (F) e o vértice (V) do espelho.",
            "B": "Exatamente sobre o centro de curvatura (C) do espelho.",
            "C": "Entre o foco principal (F) e o centro de curvatura (C)."
          },
          "correta": "A"
        },
        {
          "id": "opt_b2_q5",
          "habilidadeId": "B2",
          "contexto": "Projeção com Espelho Côncavo",
          "enunciado": "Em um laboratório, uma vela acesa é colocada além do centro de curvatura (C) de um espelho côncavo. A imagem da chama conjugada por esse espelho será:",
          "alternativas": {
            "A": "Virtual, direita e menor, formada atrás do espelho.",
            "B": "Real, invertida e menor, formada entre o centro de curvatura (C) e o foco (F).",
            "C": "Real, invertida e maior, formada além do centro de curvatura (C)."
          },
          "correta": "B"
        },
        {
          "id": "opt_b2_q6",
          "habilidadeId": "B2",
          "contexto": "Farol de Automóvel",
          "enunciado": "Nos faróis de carros, coloca-se a lâmpada aproximadamente sobre o foco principal de um refletor parabólico/côncavo. O objetivo dessa geometria é fazer com que os raios refletidos:",
          "alternativas": {
            "A": "Emerjam paralelos ao eixo principal, alcançando grandes distâncias à frente.",
            "B": "Se cruzem no centro de curvatura, concentrando calor em um único ponto da pista.",
            "C": "Diverjam fortemente como se viessem de trás do carro, iluminando as laterais."
          },
          "correta": "A"
        },
        {
          "id": "opt_b2_q7",
          "habilidadeId": "B3",
          "contexto": "Raios Notáveis",
          "enunciado": "Em um espelho esférico côncavo ideal, todo raio de luz que incide passando diretamente pelo seu Centro de Curvatura (C), ao atingir o espelho:",
          "alternativas": {
            "A": "Reflete paralelamente ao eixo principal.",
            "B": "Reflete passando obrigatoriamente pelo foco principal (F).",
            "C": "Reflete sobre si mesmo, retornando exatamente pela mesma trajetória."
          },
          "correta": "C"
        },
        {
          "id": "opt_b2_q8",
          "habilidadeId": "B3",
          "contexto": "Raio de Curvatura e Foco",
          "enunciado": "Um espelho esférico côncavo foi construído a partir de uma calota esférica cujo raio de curvatura mede 60 cm. Sob condições de Gauss, qual é a distância focal desse espelho?",
          "alternativas": {
            "A": "30 cm.",
            "B": "60 cm.",
            "C": "120 cm."
          },
          "correta": "A"
        },
        {
          "id": "opt_b2_q9",
          "habilidadeId": "B4",
          "contexto": "Equação de Gauss — Côncavo",
          "enunciado": "Um objeto real é posicionado a 30 cm do vértice de um espelho côncavo de distância focal f = 10 cm. Aplicando a equação de Gauss (1/f = 1/p + 1/p'), a que distância do espelho se forma a imagem e qual a sua natureza?",
          "alternativas": {
            "A": "A 15 cm do espelho; imagem real e invertida.",
            "B": "A 15 cm do espelho; imagem virtual e direita.",
            "C": "A 20 cm do espelho; imagem real e reduzida."
          },
          "correta": "A"
        },
        {
          "id": "opt_b2_q10",
          "habilidadeId": "B4",
          "contexto": "Equação de Gauss — Convexo",
          "enunciado": "Um objeto está a 20 cm de um espelho convexo cujo módulo da distância focal é 20 cm (logo, f = -20 cm na convenção de Gauss). Qual é a posição da imagem (p')?",
          "alternativas": {
            "A": "p' = +10 cm (imagem real).",
            "B": "p' = -10 cm (imagem virtual, formada a 10 cm atrás do espelho).",
            "C": "p' = -40 cm (imagem virtual, formada a 40 cm atrás do espelho)."
          },
          "correta": "B"
        }
      ]
    },
    {
      "id": "bloco_3",
      "ordem": 3,
      "titulo": "Refração da Luz",
      "tempoEstimado": "6–10 min",
      "descricao": "Conceito de refração, índice de refração, desvio angular, Lei de Snell e reflexão total interna (fibras ópticas).",
      "resumo": "### Conceitos Essenciais\n- **O que é Refração:** É a passagem da luz de um meio para outro onde sua **velocidade de propagação muda**. *Atenção:* a frequência (cor) da luz nunca muda na refração; o que muda é a velocidade ($v$) e o comprimento de onda ($\\lambda$).\n- **Índice de Refração ($n = c / v$):** Quanto maior o índice $n$ (meio mais refringente), **menor** é a velocidade da luz naquele meio.\n- **Desvio do Raio (Incidência Oblíqua):**\n  - Do meio *menos* para o *mais* refringente ($n_1 < n_2$): a velocidade cai e o raio **se aproxima da Normal**.\n  - Do meio *mais* para o *menos* refringente ($n_1 > n_2$): a velocidade sobe e o raio **se afasta da Normal**.\n  - *Incidência perpendicular (0° com a normal):* a velocidade muda, mas **não há desvio angular**.\n- **Lei de Snell:** $n_1 \\cdot \\text{sen}(i) = n_2 \\cdot \\text{sen}(r)$.\n- **Reflexão Total Interna:** Só ocorre quando a luz tenta passar do meio **mais refringente para o menos refringente** com ângulo de incidência **maior que o ângulo limite ($L$)**.",
      "habilidades": [
        { "id": "C1", "nome": "Conceito físico da refração e posição aparente" },
        { "id": "C2", "nome": "Índice de refração e velocidade da luz" },
        { "id": "C3", "nome": "Desvio angular e incidência normal" },
        { "id": "C4", "nome": "Aplicação algébrica da Lei de Snell" },
        { "id": "C5", "nome": "Reflexão total interna e ângulo limite" }
      ],
      "questoes": [
        {
          "id": "opt_b3_q1",
          "habilidadeId": "C1",
          "contexto": "Profundidade Aparente",
          "enunciado": "Um observador na borda de uma piscina olha para um azulejo no fundo e tem a nítida impressão de que a piscina é mais rasa do que realmente é. Isso ocorre porque os raios de luz que saem da água para o ar:",
          "alternativas": {
            "A": "Sofrem reflexão total na superfície, projetando uma miragem do fundo.",
            "B": "Aumentam de velocidade ao entrar no ar e se afastam da normal, mudando a posição aparente da imagem.",
            "C": "Sofrem difração nas moléculas da água, ampliando o tamanho aparente do azulejo."
          },
          "correta": "B"
        },
        {
          "id": "opt_b3_q2",
          "habilidadeId": "C1",
          "contexto": "Grandezas na Refração",
          "enunciado": "Quando um feixe de luz monocromática vermelha passa do ar para um bloco de vidro, o que acontece com a sua velocidade de propagação e com a sua frequência?",
          "alternativas": {
            "A": "A velocidade diminui e a frequência permanece exatamente a mesma.",
            "B": "A velocidade e a frequência diminuem na mesma proporção.",
            "C": "A velocidade permanece constante, mas a frequência diminui."
          },
          "correta": "A"
        },
        {
          "id": "opt_b3_q3",
          "habilidadeId": "C2",
          "contexto": "Cálculo do Índice de Refração",
          "enunciado": "Sabendo que a velocidade da luz no vácuo é c = 3,0 × 10⁸ m/s e que em um determinado cristal a luz viaja a v = 1,5 × 10⁸ m/s, qual é o índice de refração absoluto (n = c/v) desse cristal?",
          "alternativas": {
            "A": "n = 0,5.",
            "B": "n = 1,5.",
            "C": "n = 2,0."
          },
          "correta": "C"
        },
        {
          "id": "opt_b3_q4",
          "habilidadeId": "C3",
          "contexto": "Desvio Angular",
          "enunciado": "Um raio de luz incide obliquamente passando do ar (n = 1,0) para a água (n = 1,33). Ao entrar na água, o raio refratado:",
          "alternativas": {
            "A": "Aproxima-se da reta normal, pois entrou em um meio mais refringente.",
            "B": "Afasta-se da reta normal, pois a densidade da água empurra o feixe para a superfície.",
            "C": "Segue sem sofrer desvio angular, reduzindo apenas a sua intensidade."
          },
          "correta": "A"
        },
        {
          "id": "opt_b3_q5",
          "habilidadeId": "C3",
          "contexto": "Incidência Perpendicular",
          "enunciado": "Um feixe de laser incide perpendicularmente à superfície plana de um aquário (formando 90° com o vidro, ou seja, ângulo de incidência 0° com a normal). Ao penetrar na água:",
          "alternativas": {
            "A": "O feixe sofre reflexão total por atingir o vidro de frente.",
            "B": "O feixe não sofre desvio em sua direção, mas sua velocidade de propagação diminui.",
            "C": "Nem a direção nem a velocidade mudam, logo não ocorre o fenômeno da refração."
          },
          "correta": "B"
        },
        {
          "id": "opt_b3_q6",
          "habilidadeId": "C4",
          "contexto": "Lei de Snell",
          "enunciado": "Um raio de luz passa do ar (n₁ = 1,0) para um meio transparente de índice n₂ = √3, incidindo com ângulo de 60° (dados: sen 60° = √3/2 e sen 30° = 1/2). Pela Lei de Snell (n₁·sen i = n₂·sen r), qual é o ângulo de refração?",
          "alternativas": {
            "A": "30°.",
            "B": "45°.",
            "C": "60°."
          },
          "correta": "A"
        },
        {
          "id": "opt_b3_q7",
          "habilidadeId": "C5",
          "contexto": "Condição da Reflexão Total",
          "enunciado": "Nas fibras ópticas de internet, pulsos de luz viajam quilômetros sem escapar pelas paredes do cabo graças à reflexão total interna. Para que esse fenômeno ocorra, a luz deve incidir na interface tentando passar:",
          "alternativas": {
            "A": "Do núcleo de maior índice de refração para a casca de menor índice, com ângulo maior que o ângulo limite.",
            "B": "Da casca de menor índice para o núcleo de maior índice, em qualquer ângulo de incidência.",
            "C": "De um meio para outro de igual índice de refração, incidindo a 0° com a normal."
          },
          "correta": "A"
        },
        {
          "id": "opt_b3_q8",
          "habilidadeId": "C5",
          "contexto": "Ângulo Limite",
          "enunciado": "Um raio de luz viaja de um plástico (n = 2,0) em direção ao ar (n = 1,0). Sabendo que sen(L) = n_menor / n_maior, qual é o ângulo limite (L) a partir do qual ocorre reflexão total? (Dado: sen 30° = 0,5).",
          "alternativas": {
            "A": "15°.",
            "B": "30°.",
            "C": "60°."
          },
          "correta": "B"
        }
      ]
    },
    {
      "id": "bloco_4",
      "ordem": 4,
      "titulo": "Lentes Esféricas",
      "tempoEstimado": "8–12 min",
      "descricao": "Lentes convergentes e divergentes, raios notáveis, formação de imagens e equação de Gauss/aumento linear.",
      "resumo": "### Conceitos Essenciais\n- **No Ar ($n_{\\text{lente}} > n_{\\text{ar}}$):**\n  - *Bordas Finas (biconvexa, plano-convexa):* **Convergente** ($f > 0$). Concentra raios paralelos no foco real.\n  - *Bordas Grossas (bicôncava):* **Divergente** ($f < 0$). Espalha os raios.\n- **Imagens na Lente Divergente:** Para qualquer objeto real, a imagem é **sempre virtual, direita e menor** (igual ao espelho convexo).\n- **Imagens na Lente Convergente:**\n  - Objeto *além de 2F*: real, invertida e menor (câmera fotográfica / olho).\n  - Objeto *entre 2F e F*: real, invertida e maior (projetor de cinema / objetiva do microscópio).\n  - Objeto *entre F e o Centro Óptico (O)*: **virtual, direita e maior** (Lupa).\n- **Raios Notáveis:** Raio que passa pelo **Centro Óptico (O)** atravessa a lente **sem sofrer desvio angular**.\n- **Equações:** $\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{p'}$ e Aumento Linear: $A = \\frac{i}{o} = -\\frac{p'}{p}$ | Vergência (Grau): $V = \\frac{1}{f\\text{ (em metros)}}$ em dioptrias (di).",
      "habilidades": [
        { "id": "D1", "nome": "Comportamento óptico de lentes convergentes e divergentes" },
        { "id": "D2", "nome": "Raios notáveis em lentes delgadas" },
        { "id": "D3", "nome": "Formação de imagens (lupa, projetor e lente divergente)" },
        { "id": "D4", "nome": "Equação de Gauss, vergência e aumento linear em lentes" }
      ],
      "questoes": [
        {
          "id": "opt_b4_q1",
          "habilidadeId": "D1",
          "contexto": "Tipos de Lentes",
          "enunciado": "Uma lente de vidro comum, imersa no ar, possui o centro mais espesso do que as extremidades (bordas finas). Quando um feixe de raios paralelos ao eixo principal atravessa essa lente, os raios:",
          "alternativas": {
            "A": "Convergem em direção ao foco principal real, situado do outro lado da lente.",
            "B": "Divergem como se saíssem de um foco virtual do mesmo lado da fonte.",
            "C": "Sofrem reflexão total, retornando ao meio de origem."
          },
          "correta": "A"
        },
        {
          "id": "opt_b4_q2",
          "habilidadeId": "D1",
          "contexto": "Lente Divergente",
          "enunciado": "Ao observar as letras de um livro através de uma lente esférica divergente (imersa no ar), independentemente da distância entre a lente e o papel, o leitor verá letras:",
          "alternativas": {
            "A": "Maiores e direitas (imagem virtual).",
            "B": "Menores e direitas (imagem virtual).",
            "C": "Menores e de cabeça para baixo (imagem real)."
          },
          "correta": "B"
        },
        {
          "id": "opt_b4_q3",
          "habilidadeId": "D2",
          "contexto": "Centro Óptico",
          "enunciado": "Na construção geométrica de imagens em uma lente esférica delgada ideal, todo raio de luz que incide passando exatamente pelo Centro Óptico (O) da lente:",
          "alternativas": {
            "A": "Desvia-se passando obrigatoriamente pelo foco principal.",
            "B": "Emerge paralelamente ao eixo principal da lente.",
            "C": "Atravessa a lente sem sofrer desvio angular em sua direção."
          },
          "correta": "C"
        },
        {
          "id": "opt_b4_q4",
          "habilidadeId": "D3",
          "contexto": "Funcionamento da Lupa",
          "enunciado": "Um relojoeiro utiliza uma lente convergente de distância focal f = 10 cm como lupa para enxergar uma engrenagem ampliada e direita. A que distância da lente ele deve posicionar a engrenagem?",
          "alternativas": {
            "A": "A uma distância menor que 10 cm (entre o foco e o centro óptico).",
            "B": "Exatamente a 10 cm (sobre o foco principal).",
            "C": "A uma distância maior que 20 cm (além do ponto antiprincipal 2F)."
          },
          "correta": "A"
        },
        {
          "id": "opt_b4_q5",
          "habilidadeId": "D3",
          "contexto": "Projetor de Sala de Aula",
          "enunciado": "Para projetar na parede uma imagem real e ampliada de um slide iluminado, utiliza-se uma lente convergente. Para isso, o slide deve ficar posicionado:",
          "alternativas": {
            "A": "Entre o foco (F) e o centro óptico (O) da lente.",
            "B": "Entre o foco (F) e o ponto antiprincipal (2F) da lente.",
            "C": "Muito além do ponto 2F da lente."
          },
          "correta": "B"
        },
        {
          "id": "opt_b4_q6",
          "habilidadeId": "D4",
          "contexto": "Vergência (Dioptria)",
          "enunciado": "Uma receita oftalmológica indica uma lente convergente de vergência (grau) igual a +2,0 di (dioptrias). Sabendo que V = 1/f (com f em metros), qual é a distância focal dessa lente?",
          "alternativas": {
            "A": "0,5 m (ou 50 cm).",
            "B": "2,0 m (ou 200 cm).",
            "C": "0,2 m (ou 20 cm)."
          },
          "correta": "A"
        },
        {
          "id": "opt_b4_q7",
          "habilidadeId": "D4",
          "contexto": "Equação de Gauss — Lente Convergente",
          "enunciado": "Um objeto real é colocado a 30 cm de uma lente convergente de distância focal f = 15 cm. Pela equação de Gauss (1/f = 1/p + 1/p'), onde se forma a imagem?",
          "alternativas": {
            "A": "p' = 30 cm (imagem real, do outro lado da lente).",
            "B": "p' = 10 cm (imagem real, do outro lado da lente).",
            "C": "p' = -30 cm (imagem virtual, do mesmo lado do objeto)."
          },
          "correta": "A"
        },
        {
          "id": "opt_b4_q8",
          "habilidadeId": "D4",
          "contexto": "Equação de Gauss — Lente Divergente",
          "enunciado": "Um objeto é posicionado a 20 cm de uma lente divergente cuja distância focal é f = -20 cm. Qual é a posição da imagem (p')?",
          "alternativas": {
            "A": "p' = -10 cm (virtual, a 10 cm da lente).",
            "B": "p' = +10 cm (real, a 10 cm da lente).",
            "C": "p' = -40 cm (virtual, a 40 cm da lente)."
          },
          "correta": "A"
        },
        {
          "id": "opt_b4_q9",
          "habilidadeId": "D4",
          "contexto": "Aumento Linear",
          "enunciado": "Uma lente convergente conjuga, para um objeto situado a p = 20 cm, uma imagem real situada a p' = 60 cm. Qual é o módulo do aumento linear transversal (|A| = p'/p) e a orientação dessa imagem?",
          "alternativas": {
            "A": "Imagem 3 vezes maior que o objeto e invertida.",
            "B": "Imagem 3 vezes maior que o objeto e direita.",
            "C": "Imagem reduzida a 1/3 do objeto e invertida."
          },
          "correta": "A"
        }
      ]
    },
    {
      "id": "bloco_5",
      "ordem": 5,
      "titulo": "Instrumentos Ópticos e Visão",
      "tempoEstimado": "4–6 min",
      "descricao": "Óptica do olho humano, miopia, hipermetropia, presbiopia e funcionamento de câmeras e microscópios.",
      "resumo": "### Conceitos Essenciais\n- **Olho Humano Normal (Emetrope):** Funciona como uma câmara fotográfica com lente convergente (córnea + cristalino). Projeta exatamente sobre a **retina** uma imagem **real, invertida e menor**.\n- **Miopia:** O olho é 'longo demais' ou muito convergente. A imagem de objetos distantes se forma **antes da retina**. *Correção:* **Lente Divergente** ($f < 0$, grau negativo), que espalha levemente os raios para empurrar o foco até a retina.\n- **Hipermetropia:** O olho é 'curto' ou pouco convergente. A imagem de objetos próximos se formaria **atrás da retina**. *Correção:* **Lente Convergente** ($f > 0$, grau positivo).\n- **Presbiopia (Vista Cansada):** Perda de elasticidade do cristalino com a idade, dificultando focar de perto. *Correção:* **Lente Convergente** para leitura.",
      "habilidades": [
        { "id": "E1", "nome": "Formação de imagem no olho humano" },
        { "id": "E2", "nome": "Defeitos da visão e lentes corretivas (miopia, hipermetropia e presbiopia)" },
        { "id": "E3", "nome": "Funcionamento óptico de câmeras e microscópios" }
      ],
      "questoes": [
        {
          "id": "opt_b5_q1",
          "habilidadeId": "E1",
          "contexto": "Olho Humano e Câmera",
          "enunciado": "Tanto no olho humano saudável quanto no sensor de uma câmera fotográfica, o sistema de lentes convergentes projeta no fundo (retina ou sensor) uma imagem cujas características ópticas são:",
          "alternativas": {
            "A": "Virtual, direita e do mesmo tamanho do objeto observado.",
            "B": "Real, invertida e menor que o objeto observado.",
            "C": "Real, direita e ampliada em relação ao objeto."
          },
          "correta": "B"
        },
        {
          "id": "opt_b5_q2",
          "habilidadeId": "E2",
          "contexto": "Miopia vs. Hipermetropia",
          "enunciado": "Na miopia, a imagem de objetos distantes forma-se ANTES da retina; na hipermetropia, a imagem de objetos próximos tenderia a formar-se ATRÁS da retina. As lentes corretivas para miopia e hipermetropia são, respectivamente:",
          "alternativas": {
            "A": "Divergente (grau negativo) e Convergente (grau positivo).",
            "B": "Convergente (grau positivo) e Divergente (grau negativo).",
            "C": "Cilíndrica plana e Divergente esférica."
          },
          "correta": "A"
        },
        {
          "id": "opt_b5_q3",
          "habilidadeId": "E2",
          "contexto": "Presbiopia",
          "enunciado": "Com o envelhecimento, o cristalino perde elasticidade (capacidade de acomodação visual), dificultando a leitura de perto — condição chamada presbiopia. Para corrigir essa dificuldade de leitura, utilizam-se:",
          "alternativas": {
            "A": "Lentes divergentes, para afastar o ponto próximo.",
            "B": "Lentes convergentes, auxiliando o olho a convergir os raios na retina.",
            "C": "Espelhos planos acoplados a prismas dispersores."
          },
          "correta": "B"
        },
        {
          "id": "opt_b5_q4",
          "habilidadeId": "E3",
          "contexto": "Microscópio Composto",
          "enunciado": "Um microscópio óptico composto possui duas lentes convergentes: a objetiva (perto da lâmina) e a ocular (perto do olho). A função óptica da lente objetiva é:",
          "alternativas": {
            "A": "Conjugar uma primeira imagem real e ampliada da amostra, que servirá de objeto para a ocular ampliar ainda mais.",
            "B": "Conjugar uma imagem virtual e reduzida para concentrar a luz na pupila.",
            "C": "Apenas filtrar as cores da luz sem alterar o tamanho aparente da célula."
          },
          "correta": "A"
        }
      ]
    },
    {
      "id": "bloco_6",
      "ordem": 6,
      "titulo": "Fenômenos Ondulatórios da Luz e Cores",
      "tempoEstimado": "5–8 min",
      "descricao": "Dispersão luminosa, arco-íris, cor dos objetos sob luz monocromática, difração, interferência e polarização.",
      "resumo": "### Conceitos Essenciais\n- **Dispersão da Luz:** A luz branca é policromática (mistura de todas as cores). Em meios materiais (vidro, água), **cada cor (frequência) viaja com uma velocidade ligeiramente diferente**, tendo um índice de refração próprio. O **violeta** (maior frequência) sofre o **maior desvio**; o **vermelho** sofre o menor.\n- **Arco-Íris:** Ocorre quando a luz solar sofre **refração (com dispersão)** ao entrar na gota de água, **reflexão interna** no fundo da gota e nova **refração** ao sair.\n- **Cor dos Objetos:** Um corpo iluminado não emite luz própria; ele **reflete difusamente** a cor que o caracteriza e **absorve** as demais. Ex: Um objeto vermelho sob luz puramente azul absorve o azul e parece **preto/escuro**.\n- **Fenômenos Ondulatórios:**\n  - *Difração:* Capacidade da onda de contornar obstáculos ou se espalhar ao passar por fendas da ordem do seu comprimento de onda ($\\lambda$).\n  - *Interferência:* Superposição de ondas gerando reforço (**construtiva** — faixa clara) ou anulação (**destrutiva** — faixa escura).\n  - *Polarização:* Seleção de um único plano de vibração do campo elétrico (prova que a luz é uma onda **transversal**).",
      "habilidades": [
        { "id": "F1", "nome": "Dispersão da luz em prismas e formação do arco-íris" },
        { "id": "F2", "nome": "Cor dos objetos por reflexão e absorção" },
        { "id": "F3", "nome": "Difração, interferência e polarização luminosa" }
      ],
      "questoes": [
        {
          "id": "opt_b6_q1",
          "habilidadeId": "F1",
          "contexto": "Dispersão no Prisma",
          "enunciado": "Quando um feixe estreito de luz branca atravessa um prisma de vidro, ele emerge separado nas várias cores do espectro visível. Essa separação ocorre porque, no interior do vidro:",
          "alternativas": {
            "A": "Cada cor possui uma frequência diferente e propaga-se com velocidade ligeiramente diferente, sofrendo desvios angulares distintos.",
            "B": "O vidro sofre fluorescência química e passa a emitir cores primárias quando aquecido pela luz.",
            "C": "A luz branca sofre difração exclusiva nas faces externas, sem depender do índice de refração."
          },
          "correta": "A"
        },
        {
          "id": "opt_b6_q2",
          "habilidadeId": "F1",
          "contexto": "Formação do Arco-Íris",
          "enunciado": "O arco-íris observado no céu quando o Sol ilumina uma cortina de chuva é resultado da interação da luz solar com milhões de gotículas de água. Quais fenômenos ópticos ocorrem em cada gota para formar o arco-íris?",
          "alternativas": {
            "A": "Apenas polarização e difração da luz solar na superfície externa da gota.",
            "B": "Refração com dispersão cromática na entrada da gota, reflexão interna e nova refração na saída.",
            "C": "Absorção total da luz solar pela água seguida de emissão térmica de cores."
          },
          "correta": "B"
        },
        {
          "id": "opt_b6_q3",
          "habilidadeId": "F2",
          "contexto": "Cores sob Luz Monocromática",
          "enunciado": "Em um ambiente totalmente escuro, uma bandeira que sob a luz do Sol apresenta uma faixa BRANCA e uma faixa VERMELHA é iluminada exclusivamente por um feixe de luz monocromática VERDE. De que cores serão vistas as faixas branca e vermelha, respectivamente?",
          "alternativas": {
            "A": "Branca e vermelha, pois a cor é uma propriedade intrínseca do pigmento.",
            "B": "Verde e preta (escura), pois a faixa branca reflete o verde e a vermelha absorve o verde.",
            "C": "Verde e amarela, pela mistura aditiva entre o pigmento vermelho e a luz verde."
          },
          "correta": "B"
        },
        {
          "id": "opt_b6_q4",
          "habilidadeId": "F3",
          "contexto": "Difração Luminosa",
          "enunciado": "Quando um feixe de laser passa por uma fenda extremamente estreita (com largura próxima ao comprimento de onda da luz), ele não projeta apenas um ponto na parede, mas espalha-se formando uma faixa alargada. Esse fenômeno é a:",
          "alternativas": {
            "A": "Refração atmosférica.",
            "B": "Difração da luz.",
            "C": "Reflexão total interna."
          },
          "correta": "B"
        },
        {
          "id": "opt_b6_q5",
          "habilidadeId": "F3",
          "contexto": "Experimento da Fenda Dupla",
          "enunciado": "No famoso experimento de Young, a luz coerente atravessa duas fendas paralelas e projeta em um anteparo um padrão alternado de franjas claras e franjas escuras. As franjas escuras ocorrem nos pontos onde as ondas chegam:",
          "alternativas": {
            "A": "Em oposição de fase, sofrendo interferência destrutiva.",
            "B": "Em concordância de fase, sofrendo interferência construtiva.",
            "C": "Polarizadas verticalmente, bloqueando a visão humana."
          },
          "correta": "A"
        },
        {
          "id": "opt_b6_q6",
          "habilidadeId": "F3",
          "contexto": "Lentes Polarizadas",
          "enunciado": "Fotógrafos e motoristas utilizam filtros e óculos polarizadores para eliminar o brilho ofuscante da luz refletida horizontalmente no capô de carros ou na superfície da água. O filtro polarizador funciona porque:",
          "alternativas": {
            "A": "Permite a passagem apenas das ondas luminosas cujo campo elétrico oscila em uma direção específica, bloqueando a componente perpendicular.",
            "B": "Aumenta a frequência da luz refletida, transformando o brilho visível em radiação ultravioleta invisível.",
            "C": "Funciona como uma lente divergente que desvia o reflexo para fora da retina."
          },
          "correta": "A"
        }
      ]
    }
  ]
};

// Tenta atualizar via fetch('./diagnostico_optica.json') quando servido via HTTP/HTTPS (ex: GitHub Pages)
(function loadLiveJson() {
  if (typeof fetch === 'function' && window.location && window.location.protocol.startsWith('http')) {
    fetch('./diagnostico_optica.json', { cache: 'no-store' })
      .then(function(res) { return res.ok ? res.json() : null; })
      .then(function(data) {
        if (data && Array.isArray(data.blocos)) {
          window.DiagnosticoOpticaData = data;
          if (window.OpticaUI && typeof window.OpticaUI.onDataLoaded === 'function') {
            window.OpticaUI.onDataLoaded();
          }
        }
      })
      .catch(function() { /* Fallback síncrono já está ativo */ });
  }
})();

// Recursos de Estudo e Questões Reais do ENEM estritamente isolados por chave única de Habilidade:
// Chave: fisica_optica_${blocoId}_${habilidadeId} (e alias sem underscore no bloco: fisica_optica_bloco4_D1)
window.OpticaTopicResources = {
  /* ══════════════════════════════════════════════════════════════════════════
     BLOCO 1 — FUNDAMENTOS DA LUZ (A1, A2, A3)
     ══════════════════════════════════════════════════════════════════════════ */
  fisica_optica_bloco_1_A1: {
    foco: 'Foque no cruzamento dos raios em linha reta pelo orifício da câmara escura: o raio do topo vai para a base e vice-versa, gerando uma imagem invertida e proporcional (i / o = d_i / d_o).',
    videos: [],
    sites: [
      {
        id: 'site_opt_a1_1',
        titulo: 'Princípios da Óptica Geométrica e Câmara Escura',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/principios-optica-geometrica.htm',
        resumo: 'Revisão ilustrada sobre propagação retilínea da luz, feixes luminosos e semelhança de triângulos na câmara escura.'
      },
      {
        id: 'site_opt_a1_2',
        titulo: 'Óptica Geométrica: Conceitos Fundamentais e Aplicações',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/optica-geometrica/',
        resumo: 'Resumo direto sobre fontes de luz, raios luminosos, independência dos raios e câmara escura de orifício.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_a1_1',
        ano: 'ENEM 2018',
        habilidadeId: 'A1',
        contexto: 'Câmara Escura de Orifício e Proporção Geométrica',
        enunciado: 'Uma estudante construiu uma câmara escura de orifício utilizando uma caixa de sapatos de 20 cm de comprimento (distância entre o furo e o papel vegetal no fundo). Ao apontar a câmara para um poste de iluminação situado a 10 m de distância do orifício, observou no fundo da caixa uma imagem nítida e invertida do poste com 8 cm de altura. Com base no princípio da propagação retilínea da luz, qual é a altura real desse poste?',
        alternativas: {
          A: '2,0 m.',
          B: '2,5 m.',
          C: '4,0 m.',
          D: '5,0 m.',
          E: '8,0 m.'
        },
        correta: 'C',
        resolucao: '1) Pela propagação retilínea da luz, os raios que partem do topo e da base do poste cruzam o orifício formando dois triângulos semelhantes.\n2) Convertendo as medidas para a mesma unidade (metros): comprimento da câmara p\' = 20 cm = 0,20 m; altura da imagem i = 8 cm = 0,08 m; distância do objeto p = 10 m.\n3) Aplicando a proporção da câmara escura (o / p = i / p\'):\n   o / 10 = 0,08 / 0,20 ⇒ o / 10 = 0,4 ⇒ o = 4,0 m.'
      }
    ]
  },

  fisica_optica_bloco_1_A2: {
    foco: 'Lembre-se do critério de nitidez: meio transparente transmite a luz regularmente (vemos com nitidez); meio translúcido espalha a luz por difusão (vemos apenas claridade e vultos); meio opaco bloqueia a transmissão.',
    videos: [],
    sites: [
      {
        id: 'site_opt_a2_1',
        titulo: 'Meios de Propagação da Luz: Transparente, Translúcido e Opaco',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/meios-propagacao-luz.htm',
        resumo: 'Diferenças físicas entre transmissão regular, transmissão difusa e absorção/reflexão em meios opacos.'
      },
      {
        id: 'site_opt_a2_2',
        titulo: 'Introdução à Óptica e Classificação dos Meios Ópticos',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/introducao-a-optica.htm',
        resumo: 'Exemplos do cotidiano (vidro hialino, vidro fosco, neblina, papel vegetal e madeira) cobrados em provas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_a2_1',
        ano: 'ENEM 2020',
        habilidadeId: 'A2',
        contexto: 'Transmissão Difusa em Telhados e Vidros Jateados',
        enunciado: 'Na arquitetura sustentável, blocos de vidro fosco (jateado) e telhas de policarbonato leitoso são frequentemente empregados para aproveitar a iluminação solar natural sem expor o interior do ambiente à visão direta de quem passa na rua e sem criar feixes ofuscantes concentrados. Do ponto de vista da óptica geométrica, esses materiais cumprem essa função porque atuam como meios:',
        alternativas: {
          A: 'Opacos, bloqueando a passagem dos fótons visíveis e transmitindo apenas radiação infravermelha.',
          B: 'Transparentes ideais, mantendo os raios solares paralelos e formando imagens reais no piso.',
          C: 'Translúcidos, permitindo a passagem da luz, mas provocando espalhamento (difusão) dos raios em múltiplas direções.',
          D: 'Refletores espelhados, devolvendo 100% da luz incidente de volta para a atmosfera.',
          E: 'Monocromáticos, convertendo todas as frequências solares em uma única cor fria.'
        },
        correta: 'C',
        resolucao: '1) Meios translúcidos (como vidro jateado/fosco e policarbonato leitoso) permitem que a luz os atravesse, garantindo a iluminação natural do ambiente.\n2) Porém, devido às irregularidades microscópicas do material, os raios luminosos sofrem refrações e difusões irregulares em várias direções, espalhando a claridade suavemente e impedindo a formação de imagens nítidas através da divisória.'
      }
    ]
  },

  fisica_optica_bloco_1_A3: {
    foco: 'Penumbra só ocorre quando a fonte de luz é EXTENSA! No Eclipse Solar a Lua fica entre o Sol e a Terra (Lua nova); no Eclipse Lunar a Terra fica entre o Sol e a Lua (Lua cheia).',
    videos: [],
    sites: [
      {
        id: 'site_opt_a3_1',
        titulo: 'Sombra, Penumbra e Eclipses Solar e Lunar',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/eclipse-solar-e-lunar/',
        resumo: 'Esquemas geométricos de umbra e penumbra, fases da Lua e condições para eclipses totais e parciais.'
      },
      {
        id: 'site_opt_a3_2',
        titulo: 'Sombra e Penumbra na Óptica Geométrica',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/sombra-penumbra.htm',
        resumo: 'Comparação entre sombras projetadas por fontes pontuais e por fontes extensas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_a3_1',
        ano: 'ENEM 2019',
        habilidadeId: 'A3',
        contexto: 'Geometria dos Eclipses e Sombra Projetada',
        enunciado: 'Durante um eclipse solar observado na América do Sul, habitantes de uma estreita faixa territorial viram o disco solar ser totalmente encoberto pela Lua por alguns minutos (eclipse total), enquanto moradores de estados vizinhos observaram apenas parte do Sol ser ocultada (eclipse parcial). A ocorrência simultânea de visualização total em uma faixa e parcial nas regiões vizinhas deve-se ao fato de o Sol ser uma fonte extensa, de modo que os observadores do eclipse parcial encontravam-se:',
        alternativas: {
          A: 'No interior do cone de umbra projetado pela Terra sobre a superfície lunar.',
          B: 'Na região de penumbra projetada pela Lua sobre a superfície da Terra, recebendo luz de apenas uma fração do disco solar.',
          C: 'No interior do cone de umbra da Lua, onde nenhum raio solar direto consegue chegar.',
          D: 'Fora de qualquer região de sombra ou penumbra, sofrendo apenas ilusão de óptica atmosférica.',
          E: 'Em posição oposta ao Sol, observando o fenômeno durante a fase de Lua Cheia.'
        },
        correta: 'B',
        resolucao: '1) Como o Sol é uma fonte extensa de luz, a Lua projeta no espaço duas regiões distintas: um cone central totalmente escuro (umbra) e uma região ao redor parcialmente iluminada (penumbra).\n2) Quem está na estreita faixa atingida pela UMBRA vê o eclipse solar TOTAL.\n3) Quem está nas regiões vizinhas atingidas pela PENUMBRA recebe raios vindos de uma parte do Sol enquanto outra parte é bloqueada pela Lua, observando o eclipse solar PARCIAL.'
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════════════════
     BLOCO 2 — REFLEXÃO DA LUZ E ESPELHOS (B1, B2, B3, B4)
     ══════════════════════════════════════════════════════════════════════════ */
  fisica_optica_bloco_2_B1: {
    foco: 'Cuidado com a pegadinha clássica: o ângulo de incidência é medido com a reta NORMAL (90° com o espelho), e a distância pessoa-imagem no espelho plano é o DOBRO (2d) da distância pessoa-espelho!',
    videos: [],
    sites: [
      {
        id: 'site_opt_b1_1',
        titulo: 'Reflexão da Luz e Espelhos Planos',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/espelhos-planos/',
        resumo: 'Leis da reflexão, simetria objeto-imagem, inversão lateral (enantiomorfismo) e associação de espelhos planos.'
      },
      {
        id: 'site_opt_b1_2',
        titulo: 'Espelhos Planos: Campo Visual e Translação',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/espelhos-planos.htm',
        resumo: 'Cálculo de distâncias e velocidades relativas quando o observador ou o espelho se movimenta.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_b1_1',
        ano: 'ENEM 2021',
        habilidadeId: 'B1',
        contexto: 'Exame Oftalmológico com Espelho Plano',
        enunciado: 'Em um consultório oftalmológico, a sala tem apenas 3,0 m de comprimento, mas o teste de acuidade visual exige que o paciente enxergue a tabela de letras a uma distância óptica total de 5,0 m. Para resolver o problema, o médico fixa a tabela na parede atrás da cadeira do paciente (a 3,0 m de um espelho plano preso na parede oposta) e pede que o paciente olhe para a imagem da tabela refletida no espelho. Sabendo que a tabela está a 3,0 m do espelho plano, a que distância do espelho o paciente deve se sentar para que seus olhos fiquem exatamente a 5,0 m da imagem da tabela?',
        alternativas: {
          A: '1,0 m.',
          B: '1,5 m.',
          C: '2,0 m.',
          D: '2,5 m.',
          E: '3,0 m.'
        },
        correta: 'C',
        resolucao: '1) No espelho plano, a distância da imagem ao espelho (d_i) é igual à distância do objeto ao espelho (d_o). Como a tabela está a 3,0 m na frente do espelho, sua imagem virtual forma-se a 3,0 m "atrás" do espelho.\n2) Para que a distância total entre os olhos do paciente e a imagem da tabela seja de 5,0 m, a distância (x) do paciente até a superfície do espelho deve satisfazer:\n   x + 3,0 m = 5,0 m ⇒ x = 2,0 m.'
      }
    ]
  },

  fisica_optica_bloco_2_B2: {
    foco: 'Espelho CONVEXO forma SEMPRE imagem virtual, direita e menor (amplia o campo visual: retrovisores e mercados). Espelho CÔNCAVO forma imagem virtual, direita e MAIOR apenas quando o objeto está entre o Foco (F) e o Vértice (V).',
    videos: [],
    sites: [
      {
        id: 'site_opt_b2_1',
        titulo: 'Espelhos Esféricos Côncavos e Convexos',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/espelhos-esfericos/',
        resumo: 'Resumo visual dos 5 casos do espelho côncavo, caso único do espelho convexo e aplicações práticas.'
      },
      {
        id: 'site_opt_b2_2',
        titulo: 'Formação de Imagens em Espelhos Esféricos',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/espelhos-esfericos.htm',
        resumo: 'Por que espelhos de maquiagem/dentista são côncavos e espelhos de segurança são convexos.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_b2_1',
        ano: 'ENEM 2017',
        habilidadeId: 'B2',
        contexto: 'Retrovisores Convexos e Espelhos de Maquiagem',
        enunciado: 'Nos retrovisores externos dos automóveis costuma haver uma inscrição alertando: "Os objetos refletidos no espelho estão mais próximos do que parecem". Esse tipo de espelho é escolhido pela engenharia automotiva porque fornece uma imagem direita e reduzida para qualquer posição do veículo que vem atrás, ampliando significativamente o campo visual do motorista. Já os espelhos utilizados por dentistas e para maquiagem fornecem uma imagem direita e ampliada quando posicionados bem próximos ao rosto. Os espelhos do retrovisor automotivo e de maquiagem/dentista são, respectivamente:',
        alternativas: {
          A: 'Plano e convexo.',
          B: 'Côncavo e convexo.',
          C: 'Convexo e côncavo (com o objeto entre o foco e o vértice).',
          D: 'Convexo e plano.',
          E: 'Côncavo (com o objeto no centro de curvatura) e convexo.'
        },
        correta: 'C',
        resolucao: '1) O espelho CONVEXO conjuga sempre uma imagem virtual, direita e MENOR para qualquer distância do objeto, o que faz os carros parecerem menores (e mais distantes), mas amplia o campo visual.\n2) O espelho CÔNCAVO, quando o rosto/dente é posicionado entre o foco principal (F) e o vértice (V), conjuga uma imagem virtual, direita e MAIOR (ampliada).'
      }
    ]
  },

  fisica_optica_bloco_2_B3: {
    foco: 'Raios notáveis nos espelhos esféricos: 1) Raio paralelo ao eixo principal reflete passando pelo Foco (F); 2) Raio que passa pelo Foco reflete paralelo ao eixo (usado nos faróis!); 3) Distância focal é a metade do raio: f = R / 2.',
    videos: [],
    sites: [
      {
        id: 'site_opt_b3_1',
        titulo: 'Raios Notáveis nos Espelhos Esféricos',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/espelhos-esfericos.htm',
        resumo: 'Propriedades dos quatro raios particulares e foco de refletores parabólicos/esféricos.'
      },
      {
        id: 'site_opt_b3_2',
        titulo: 'Construção Geométrica de Imagens em Espelhos',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/construcao-imagens-espelhos-esfericos.htm',
        resumo: 'Aplicação dos raios notáveis em faróis automotivos e fornos solares.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_b3_1',
        ano: 'ENEM 2020',
        habilidadeId: 'B3',
        contexto: 'Forno Solar com Espelho Côncavo',
        enunciado: 'Em uma comunidade rural, foi construído um fogão solar utilizando uma calota espelhada côncava de raio de curvatura R = 1,20 m voltada diretamente para o Sol. Como o Sol está a uma distância imensa da Terra, os raios solares chegam ao espelho praticamente paralelos ao seu eixo principal. A que distância do vértice do espelho deve ser posicionada a panela para que a luz solar refletida se concentre ao máximo em um único ponto de aquecimento?',
        alternativas: {
          A: '0,30 m.',
          B: '0,60 m.',
          C: '1,20 m.',
          D: '1,80 m.',
          E: '2,40 m.'
        },
        correta: 'B',
        resolucao: '1) Todo feixe de raios luminosos que incide paralelamente ao eixo principal de um espelho esférico côncavo reflete convergindo para o seu Foco Principal (F).\n2) A distância focal (f) de um espelho esférico de Gauss vale metade do seu raio de curvatura (R):\n   f = R / 2 = 1,20 m / 2 = 0,60 m.'
      }
    ]
  },

  fisica_optica_bloco_2_B4: {
    foco: 'Equação de Gauss: 1/f = 1/p + 1/p\'. Convenção de sinais: f > 0 (côncavo), f < 0 (convexo). Se p\' > 0, a imagem é REAL e invertida; se p\' < 0, a imagem é VIRTUAL e direita.',
    videos: [],
    sites: [
      {
        id: 'site_opt_b4_1',
        titulo: 'Equação de Gauss e Aumento Linear nos Espelhos Esféricos',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/equacao-gauss.htm',
        resumo: 'Fórmula dos pontos conjugados, referencial de Gauss e exercícios resolvidos passo a passo.'
      },
      {
        id: 'site_opt_b4_2',
        titulo: 'Estudo Analítico dos Espelhos Esféricos',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/estudo-analitico-dos-espelhos-esfericos.htm',
        resumo: 'Como usar a fórmula rápida p\' = (f · p) / (p - f) sem errar sinais.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_b4_1',
        ano: 'ENEM 2022',
        habilidadeId: 'B4',
        contexto: 'Cálculo da Posição da Imagem pela Equação de Gauss',
        enunciado: 'Um objeto luminoso é posicionado a p = 30 cm do vértice de um espelho esférico côncavo cuja distância focal tem módulo f = 20 cm. Utilizando a equação dos pontos conjugados de Gauss, a distância da imagem ao vértice do espelho (p\') e a natureza dessa imagem são, respectivamente:',
        alternativas: {
          A: '12 cm; imagem real e direita.',
          B: '50 cm; imagem virtual e invertida.',
          C: '60 cm; imagem real e invertida.',
          D: '60 cm; imagem virtual e direita.',
          E: '15 cm; imagem real e menor.'
        },
        correta: 'C',
        resolucao: '1) Para o espelho côncavo, o foco é positivo: f = +20 cm. A posição do objeto é p = +30 cm.\n2) Aplicando a Equação de Gauss: 1/f = 1/p + 1/p\' ⇒ 1/20 = 1/30 + 1/p\'.\n3) Isolando 1/p\': 1/p\' = 1/20 - 1/30 = (3 - 2) / 60 = 1/60 ⇒ p\' = +60 cm.\n4) Como p\' > 0 (+60 cm), a imagem forma-se na frente do espelho, sendo REAL e INVERTIDA.'
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════════════════
     BLOCO 3 — REFRAÇÃO DA LUZ (C1, C2, C3, C4, C5)
     ══════════════════════════════════════════════════════════════════════════ */
  fisica_optica_bloco_3_C1: {
    foco: 'Regra de ouro da refração no ENEM: quando a luz muda de meio, mudam a velocidade (v) e o comprimento de onda (λ), mas a FREQUÊNCIA (f) e a COR NUNCA mudam!',
    videos: [],
    sites: [
      {
        id: 'site_opt_c1_1',
        titulo: 'Refração da Luz: O que é, Leis e Exemplos do Cotidiano',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/refracao-da-luz/',
        resumo: 'Conceito de refração, frequência constante e ilusão de profundidade aparente em piscinas.'
      },
      {
        id: 'site_opt_c1_2',
        titulo: 'Dioptro Plano e Profundidade Aparente',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/dioptro-plano.htm',
        resumo: 'Por que objetos submersos na água parecem estar mais rasos para quem olha do ar.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_c1_1',
        ano: 'ENEM 2019',
        habilidadeId: 'C1',
        contexto: 'Pesca com Arpão e Profundidade Aparente da Água',
        enunciado: 'Indígenas que pescam com lança ou arco e flecha às margens de rios de águas cristalinas sabem, pela experiência prática, que não devem mirar diretamente na posição onde enxergam a imagem do peixe, mas sim um pouco abaixo dela. Esse fenômeno óptico ocorre porque os raios de luz refletidos pelo peixe, ao passarem da água (meio mais refringente) para o ar (meio menos refringente):',
        alternativas: {
          A: 'Sofrem reflexão total na superfície, formando uma imagem real acima do nível da água.',
          B: 'Aumentam sua frequência luminosa, deslocando o peixe fisicamente para cima.',
          C: 'Sofrem refração e afastam-se da reta normal, fazendo o observador no ar ver uma imagem virtual do peixe em uma profundidade menor (mais rasa) que a real.',
          D: 'Sofrem refração e aproximam-se da reta normal, fazendo o peixe parecer mais fundo do que realmente está.',
          E: 'Propagam-se em trajetória parabólica dentro da água parada.'
        },
        correta: 'C',
        resolucao: '1) Os raios luminosos partem do peixe (dentro da água, n ≈ 1,33) e passam para o ar (n ≈ 1,00) até chegar aos olhos do pescador.\n2) Ao passar do meio mais refringente (água) para o menos refringente (ar), o raio refratado aumenta sua velocidade e AFASTA-SE da reta normal.\n3) O cérebro humano projeta o prolongamento retilíneo desses raios refratados, formando uma imagem virtual do peixe ACIMA da posição real (mais próxima da superfície). Por isso, o pescador deve mirar abaixo da imagem observada.'
      }
    ]
  },

  fisica_optica_bloco_3_C2: {
    foco: 'Índice de refração absoluto: n = c / v. Como c = 3 × 10⁸ m/s é constante, quanto MAIOR o índice de refração (n) do meio, MENOR é a velocidade da luz (v) nele!',
    videos: [],
    sites: [
      {
        id: 'site_opt_c2_1',
        titulo: 'Índice de Refração Absoluto e Relativo',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/indice-refracao.htm',
        resumo: 'Cálculo da velocidade da luz na água, no vidro e no diamante a partir de n = c / v.'
      },
      {
        id: 'site_opt_c2_2',
        titulo: 'Refração da Luz e Velocidade de Propagação',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/refracao-luz.htm',
        resumo: 'Relação inversa entre refringência óptica e velocidade da onda eletromagnética.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_c2_1',
        ano: 'ENEM 2021',
        habilidadeId: 'C2',
        contexto: 'Velocidade da Luz em Fibra de Vidro e no Diamante',
        enunciado: 'Sabendo que a velocidade de propagação da luz no vácuo é c = 3,0 × 10⁸ m/s, um feixe de laser penetra em um bloco de vidro especial cujo índice de refração absoluto para essa frequência vale n = 1,5. Qual passa a ser a velocidade de propagação desse feixe luminoso no interior do vidro?',
        alternativas: {
          A: '1,0 × 10⁸ m/s.',
          B: '1,5 × 10⁸ m/s.',
          C: '2,0 × 10⁸ m/s.',
          D: '3,0 × 10⁸ m/s.',
          E: '4,5 × 10⁸ m/s.'
        },
        correta: 'C',
        resolucao: '1) Pela definição de índice de refração absoluto: n = c / v.\n2) Isolando a velocidade no meio (v): v = c / n.\n3) Substituindo c = 3,0 × 10⁸ m/s e n = 1,5:\n   v = (3,0 × 10⁸) / 1,5 = 2,0 × 10⁸ m/s.'
      }
    ]
  },

  fisica_optica_bloco_3_C3: {
    foco: 'De menor n para maior n (ex: ar → água): a luz freia e se APROXIMA da Normal. De maior n para menor n: acelera e se AFASTA da Normal. Incidência perpendicular (i = 0°): muda a velocidade, mas NÃO sofre desvio!',
    videos: [],
    sites: [
      {
        id: 'site_opt_c3_1',
        titulo: 'Leis da Refração e Desvio Angular da Luz',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/refracao-da-luz/',
        resumo: 'Quando o raio se aproxima ou se afasta da normal e o caso especial da incidência normal (0°).'
      },
      {
        id: 'site_opt_c3_2',
        titulo: 'Lei de Snell-Descartes e Trajetória dos Raios',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/lei-snell-descartes.htm',
        resumo: 'Análise qualitativa e geométrica dos ângulos de incidência e refração.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_c3_1',
        ano: 'ENEM 2018',
        habilidadeId: 'C3',
        contexto: 'Desvio do Feixe Luminoso ao Entrar em Meio Mais Refringente',
        enunciado: 'Um feixe estreito de luz monocromática propaga-se pelo ar (n_ar = 1,0) e incide obliquamente sobre a superfície plana e tranquila de um tanque contendo glicerina transparente (n_glicerina = 1,47). Ao penetrar na glicerina, verifica-se que o feixe refratado:',
        alternativas: {
          A: 'Mantém a mesma velocidade de propagação e não sofre desvio angular.',
          B: 'Aumenta sua velocidade de propagação e afasta-se da reta normal.',
          C: 'Diminui sua velocidade de propagação e aproxima-se da reta normal, de modo que o ângulo de refração é menor que o de incidência.',
          D: 'Diminui sua frequência de oscilação e aproxima-se da superfície horizontal.',
          E: 'Sofre reflexão total na interface ar-glicerina.'
        },
        correta: 'C',
        resolucao: '1) O feixe passa de um meio menos refringente (ar, n = 1,0) para um meio mais refringente (glicerina, n = 1,47).\n2) Como n aumenta, a velocidade da luz diminui (v = c/n).\n3) Pela Lei de Snell (n₁ · sen i = n₂ · sen r), como n₂ > n₁, temos sen r < sen i, ou seja, o raio refratado APROXIMA-SE da reta normal (r < i).'
      }
    ]
  },

  fisica_optica_bloco_3_C4: {
    foco: 'Lei de Snell-Descartes: n₁ · sen(i) = n₂ · sen(r). Sempre verifique se o ângulo dado na figura é com a NORMAL ou com a superfície (se for com a superfície, subtraia de 90° primeiro!).',
    videos: [],
    sites: [
      {
        id: 'site_opt_c4_1',
        titulo: 'Lei de Snell-Descartes: Fórmula e Exercícios Resolvidos',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/lei-snell-descartes.htm',
        resumo: 'Aplicação trigonométrica da Lei de Snell em dioptros planos e lâminas de faces paralelas.'
      },
      {
        id: 'site_opt_c4_2',
        titulo: 'Exercícios sobre Refração da Luz no ENEM',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/exercicios-sobre-refracao-da-luz/',
        resumo: 'Problemas comentados usando senos de 30°, 45° e 60°.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_c4_1',
        ano: 'ENEM 2020',
        habilidadeId: 'C4',
        contexto: 'Cálculo do Índice de Refração pela Lei de Snell',
        enunciado: 'Para determinar o índice de refração de uma resina acrílica transparente usada em lentes, um técnico faz incidir um raio de laser a partir do ar (n_ar = 1,0) formando um ângulo de incidência i = 60° com a reta normal à superfície da resina. Dentro da resina, o raio refratado forma um ângulo r = 30° com a reta normal. Dados sen(60°) = √3 / 2 e sen(30°) = 1 / 2, qual é o índice de refração dessa resina?',
        alternativas: {
          A: '1,0.',
          B: '√2 (≈ 1,41).',
          C: '1,5.',
          D: '√3 (≈ 1,73).',
          E: '2,0.'
        },
        correta: 'D',
        resolucao: '1) Aplicamos a Lei de Snell-Descartes: n_ar · sen(i) = n_resina · sen(r).\n2) Substituindo os dados: 1,0 · sen(60°) = n_resina · sen(30°).\n3) 1,0 · (√3 / 2) = n_resina · (1 / 2).\n4) Multiplicando ambos os lados por 2: n_resina = √3 ≈ 1,73.'
      }
    ]
  },

  fisica_optica_bloco_3_C5: {
    foco: 'As 2 condições obrigatórias para a Reflexão Total Interna (usada nas Fibras Ópticas): 1ª) A luz deve ir do meio MAIS refringente (n_maior) para o MENOS refringente (n_menor); 2ª) O ângulo de incidência deve ser maior que o ângulo limite (i > L, onde sen L = n_menor / n_maior).',
    videos: [],
    sites: [
      {
        id: 'site_opt_c5_1',
        titulo: 'Reflexão Total da Luz, Ângulo Limite e Fibra Óptica',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/fibra-optica/',
        resumo: 'Como funciona a fibra óptica de telecomunicações, miragens no asfalto e cálculo do ângulo limite.'
      },
      {
        id: 'site_opt_c5_2',
        titulo: 'Ângulo Limite e Reflexão Total Interna',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/reflexao-total-angulo-limite.htm',
        resumo: 'Dedução de sen L = n_menor / n_maior e questões clássicas do ENEM.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_c5_1',
        ano: 'ENEM 2022',
        habilidadeId: 'C5',
        contexto: 'Funcionamento dos Cabos de Fibra Óptica',
        enunciado: 'Os cabos de fibra óptica revolucionaram a transmissão de dados de internet em alta velocidade através dos oceanos. Uma fibra óptica é composta por um cilindro central transparente (núcleo, com índice de refração n₁) revestido por uma camada concêntrica de outro material transparente (casca, com índice de refração n₂). Para que os pulsos de luz fiquem confinados no interior do núcleo por sucessivas reflexões totais internas sem escapar para a casca, é indispensável que:',
        alternativas: {
          A: 'n₁ seja menor que n₂, e o ângulo de incidência seja menor que o ângulo limite.',
          B: 'n₁ seja igual a n₂, garantindo que a luz não sofra refração nem reflexão.',
          C: 'n₁ seja maior que n₂ (núcleo mais refringente que a casca), e o ângulo de incidência na interface núcleo-casca seja maior que o ângulo limite.',
          D: 'A casca seja feita de chumbo opaco para absorver toda a luz que tocar nas bordas.',
          E: 'O feixe incida perpendicularmente (0° com a normal) contra a parede lateral da casca.'
        },
        correta: 'C',
        resolucao: '1) A fibra óptica guia a luz por meio do fenômeno da REFLEXÃO TOTAL INTERNA.\n2) Para que ocorra reflexão total interna, a luz deve tentar passar de um meio MAIS refringente para um MENOS refringente (logo, n_núcleo > n_casca, ou seja, n₁ > n₂) e incidir na fronteira com um ângulo i superior ao ângulo limite L (sen L = n₂ / n₁).'
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════════════════
     BLOCO 4 — LENTES ESFÉRICAS (D1, D2, D3, D4)
     Vídeos de Lentes Esféricas vinculados EXCLUSIVAMENTE às chaves D1, D2, D3 e D4!
     ══════════════════════════════════════════════════════════════════════════ */
  fisica_optica_bloco_4_D1: {
    foco: 'No ar (n_lente > n_ar): lente de bordas FINAS é CONVERGENTE (f > 0) e lente de bordas GROSSAS é DIVERGENTE (f < 0). Pela Equação de Halley, se a lente for mergulhada em um meio com n_meio > n_lente, seu comportamento óptico se inverte!',
    videos: [
      {
        id: 'vid_opt_d1_1',
        titulo: 'Lentes Esféricas I — Tipos de Lentes, Bordas Finas/Grossas e Comportamento Óptico',
        canal: 'Professor Boaro',
        url: 'https://www.youtube.com/watch?v=sJTrdArAeKY',
        nota: 'Classificação das lentes esféricas (biconvexa, plano-convexa, bicôncava) e relação entre índice de refração e convergência/divergência.'
      },
      {
        id: 'vid_opt_d1_2',
        titulo: 'Lentes Esféricas: Entenda Tudo para o ENEM (Resumo Visual)',
        canal: 'Descomplica — Quer Que Desenhe?',
        url: 'https://www.youtube.com/watch?v=DYVyeOByJkQ',
        nota: 'Mapa mental completo diferenciando lentes convergentes e divergentes e suas aplicações.'
      }
    ],
    sites: [
      {
        id: 'site_opt_d1_1',
        titulo: 'Lentes Esféricas: Tipos, Nomenclatura e Comportamento',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/lentes-esfericas/',
        resumo: 'Diferença entre lentes de bordas delgadas (finas) e bordas espessas (grossas) imersas no ar.'
      },
      {
        id: 'site_opt_d1_2',
        titulo: 'Classificação e Elementos das Lentes Esféricas',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/lentes.htm',
        resumo: 'Como o índice de refração do meio externo altera a convergência de uma lente.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_d1_1',
        ano: 'ENEM 2020',
        habilidadeId: 'D1',
        contexto: 'Comportamento de Lentes Convergentes e Divergentes e Bolha de Ar na Água',
        enunciado: 'Uma lente biconvexa de vidro (bordas finas, n_vidro = 1,5), quando imersa no ar (n_ar = 1,0), comporta-se como uma lente convergente. Por outro lado, uma pequena bolha de ar com formato biconvexo aprisionada no interior de um bloco de vidro ou na água (n_água = 1,33) apresenta comportamento óptico oposto ao da lente de vidro no ar. Isso ocorre porque a bolha de ar biconvexa na água atua como uma lente:',
        alternativas: {
          A: 'Convergente, pois toda superfície de bordas finas concentra a luz independentemente do meio.',
          B: 'Divergente, pois o índice de refração da bolha de ar (1,0) é menor que o índice de refração do meio externo (água, 1,33).',
          C: 'Plana, não provocando nenhum desvio nos raios luminosos.',
          D: 'Opaca, refletindo totalmente qualquer feixe que incida sobre ela.',
          E: 'Convergente de foco infinito.'
        },
        correta: 'B',
        resolucao: '1) Uma lente de bordas finas (biconvexa) é convergente quando seu material é MAIS refringente que o meio ao redor (n_lente > n_meio).\n2) Pela Equação de Halley (1/f = (n_lente/n_meio - 1)·(1/R₁ + 1/R₂)), quando n_lente < n_meio (como uma bolha de ar n = 1,0 dentro da água n = 1,33), o termo (n_lente/n_meio - 1) fica NEGATIVO, tornando f < 0 (comportamento DIVERGENTE).'
      }
    ]
  },

  fisica_optica_bloco_4_D2: {
    foco: 'Raios notáveis nas lentes delgadas: 1) Raio paralelo ao eixo principal refrata passando pelo Foco imagem (F\'); 2) Todo raio que passa pelo Centro Óptico (O) atravessa a lente SEM sofrer desvio angular!',
    videos: [
      {
        id: 'vid_opt_d2_1',
        titulo: 'Lentes Esféricas II — Raios Notáveis e Construção Geométrica de Imagens',
        canal: 'Professor Boaro',
        url: 'https://www.youtube.com/watch?v=8i_GgkLJ2IQ',
        nota: 'Traçado passo a passo dos três raios notáveis nas lentes convergentes e divergentes.'
      }
    ],
    sites: [
      {
        id: 'site_opt_d2_1',
        titulo: 'Raios Notáveis e Construção de Imagens nas Lentes Esféricas',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/lentes-esfericas.htm',
        resumo: 'Esquemas dos raios particulares passando pelo foco, paralelos ao eixo e pelo centro óptico.'
      },
      {
        id: 'site_opt_d2_2',
        titulo: 'Comportamento dos Raios de Luz nas Lentes',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/construcao-imagens-nas-lentes-esfericas.htm',
        resumo: 'Regras geométricas para determinar graficamente a posição e o tamanho da imagem.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_d2_1',
        ano: 'ENEM 2019',
        habilidadeId: 'D2',
        contexto: 'Queima de Papel com Lente Convergente Sob o Sol',
        enunciado: 'Em uma aula prática de ciências, um professor utiliza uma lupa (lente esférica convergente de bordas finas) sob a luz do Sol do meio-dia para aquecer e acender um pequeno pedaço de papel escuro. Sabendo que os raios solares chegam à Terra praticamente paralelos entre si e que a distância focal da lupa é de 15 cm, o papel começará a queimar mais rapidamente quando for posicionado:',
        alternativas: {
          A: 'Encostado diretamente no centro óptico da lente (distância zero).',
          B: 'A 7,5 cm da lente, na metade da distância focal.',
          C: 'A 15 cm da lente, exatamente sobre o foco principal imagem, onde os raios paralelos convergem após atravessar a lente.',
          D: 'A 30 cm da lente, no ponto antiprincipal (2F), onde os raios saem paralelos.',
          E: 'Em qualquer distância, pois a lente convergente mantém o feixe cilíndrico.'
        },
        correta: 'C',
        resolucao: '1) Pelo 1º raio notável das lentes convergentes, todo feixe de raios paralelos ao eixo principal (como os raios vindos do Sol distante) atravessa a lente e converge exatamente sobre o Foco Principal Imagem (F\').\n2) Como a distância focal da lente é f = 15 cm, toda a potência solar captada pela área da lente será concentrada a 15 cm dela, maximizando o aquecimento do papel.'
      }
    ]
  },

  fisica_optica_bloco_4_D3: {
    foco: 'Casos clássicos das lentes no ENEM: 1) Lente DIVERGENTE → imagem sempre virtual, direita e menor; 2) LUPA (lente convergente com objeto entre F e O) → imagem virtual, direita e MAIOR; 3) PROJETOR DE CINEMA (objeto entre F e 2F) → imagem real, invertida e MAIOR.',
    videos: [
      {
        id: 'vid_opt_d3_1',
        titulo: 'Formação de Imagens em Lentes Convergentes e Divergentes (Lupa, Câmera e Projetor)',
        canal: 'Professor Boaro',
        url: 'https://www.youtube.com/watch?v=8i_GgkLJ2IQ',
        nota: 'Todos os 5 casos da lente convergente e o caso único da lente divergente aplicados ao ENEM.'
      }
    ],
    sites: [
      {
        id: 'site_opt_d3_1',
        titulo: 'Formação de Imagens em Lentes Esféricas: Todos os Casos',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/lentes-esfericas/',
        resumo: 'Tabela completa relacionando posição do objeto (além de 2F, em 2F, entre F e 2F, entre F e O) e características da imagem.'
      },
      {
        id: 'site_opt_d3_2',
        titulo: 'Como Funciona a Lupa e o Projetor de Slides',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/instrumentos-opticos.htm',
        resumo: 'Condições ópticas para obter imagens reais projetadas em telas vs. imagens virtuais ampliadas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_d3_1',
        ano: 'ENEM 2021',
        habilidadeId: 'D3',
        contexto: 'Uso da Lente Convergente como Lupa',
        enunciado: 'Um relojoeiro utiliza uma lente esférica convergente de distância focal f = 10 cm como lupa para enxergar com detalhes as pequenas engrenagens de um relógio. Para que ele veja através da lente uma imagem DIREITA e AMPLIADA da engrenagem, a distância (p) entre a engrenagem e a lente deve ser:',
        alternativas: {
          A: 'Menor que 10 cm (objeto posicionado entre o foco e o centro óptico da lente).',
          B: 'Exatamente igual a 10 cm (objeto posicionado sobre o foco principal).',
          C: 'Entre 10 cm e 20 cm (objeto entre o foco e o ponto antiprincipal).',
          D: 'Exatamente igual a 20 cm (objeto sobre o ponto antiprincipal).',
          E: 'Maior que 20 cm (objeto além do ponto antiprincipal).'
        },
        correta: 'A',
        resolucao: '1) Uma lente convergente funciona como LUPA (conjugando imagem virtual, direita e maior) exclusivamente quando o objeto é colocado entre o Foco Principal Objeto (F) e o Centro Óptico (O).\n2) Como a distância focal é f = 10 cm, o objeto deve estar a uma distância p < 10 cm da lente (se estivesse entre 10 cm e 20 cm, a imagem seria ampliada, porém REAL e INVERTIDA, como em um projetor).'
      }
    ]
  },

  fisica_optica_bloco_4_D4: {
    foco: 'Equação de Gauss (1/f = 1/p + 1/p\'), Vergência em dioptrias (V = 1/f com f obrigatoriamente em METROS!) e Equação de Halley / Fabricantes de Lentes: V = 1/f = (n_lente/n_meio - 1)·(1/R₁ + 1/R₂).',
    videos: [
      {
        id: 'vid_opt_d4_1',
        titulo: 'Lentes Esféricas — Equação de Gauss, Vergência e Aumento Linear',
        canal: 'Prof. Davi Oliveira — Física 2.0',
        url: 'https://www.youtube.com/watch?v=x0w9mony8Q0',
        nota: 'Resolução detalhada de exercícios sobre Equação de Gauss (1/f = 1/p + 1/p\') e cálculo de dioptrias.'
      },
      {
        id: 'vid_opt_d4_2',
        titulo: 'Lentes Esféricas III — Estudo Analítico e Equação dos Fabricantes (Halley)',
        canal: 'Professor Boaro',
        url: 'https://www.youtube.com/watch?v=_O7mg70DWHU',
        nota: 'Dedução e aplicação prática da Equação de Gauss e da Equação de Halley (Fabricantes de Lentes).'
      },
      {
        id: 'vid_opt_d4_3',
        titulo: 'Equação dos Fabricantes de Lentes (Equação de Halley)',
        canal: 'Prof. Renato Brito',
        url: 'https://www.youtube.com/watch?v=utewBfgmQXo',
        nota: 'Convenção de sinais dos raios de curvatura (face convexa R > 0, face côncava R < 0, face plana R → ∞).'
      }
    ],
    sites: [
      {
        id: 'site_opt_d4_1',
        titulo: 'Equação de Gauss, Vergência e Equação dos Fabricantes de Lentes (Halley)',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/equacao-dos-fabricantes-lentes.htm',
        resumo: 'Fórmulas analíticas completas, cálculo de dioptrias ("grau" dos óculos) e convenção de sinais.'
      },
      {
        id: 'site_opt_d4_2',
        titulo: 'Vergência (Dioptria) e Estudo Analítico das Lentes',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/vergencia-lentes.htm',
        resumo: 'Exemplos práticos convertendo centímetros para metros antes de calcular V = 1/f.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_d4_1',
        ano: 'ENEM 2022',
        habilidadeId: 'D4',
        contexto: 'Cálculo de Vergência (Dioptrias) e Equação de Gauss em Projetor',
        enunciado: 'Um projetor multimídia utiliza uma lente convergente de distância focal f = 25 cm para projetar a imagem ampliada de um microdisplay em um telão. Se o microdisplay estiver posicionado a p = 30 cm da lente, qual é a vergência (V) dessa lente em dioptrias (di) e a que distância (p\') da lente o telão deve ser colocado para que a imagem fique perfeitamente focada?',
        alternativas: {
          A: 'V = +0,04 di e p\' = 150 cm (1,5 m).',
          B: 'V = +4,0 di e p\' = 150 cm (1,5 m).',
          C: 'V = +4,0 di e p\' = 55 cm (0,55 m).',
          D: 'V = -4,0 di e p\' = 150 cm (1,5 m).',
          E: 'V = +2,5 di e p\' = 120 cm (1,2 m).'
        },
        correta: 'B',
        resolucao: '1) Cálculo da vergência (V = 1/f com f em metros): f = +25 cm = +0,25 m ⇒ V = 1 / 0,25 = +4,0 di.\n2) Cálculo da posição da imagem (p\') pela Equação de Gauss: 1/f = 1/p + 1/p\' ⇒ 1/25 = 1/30 + 1/p\'.\n3) 1/p\' = 1/25 - 1/30 = (6 - 5) / 150 = 1 / 150 ⇒ p\' = 150 cm (ou 1,5 m).'
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════════════════
     BLOCO 5 — INSTRUMENTOS ÓPTICOS E VISÃO (E1, E2, E3)
     ══════════════════════════════════════════════════════════════════════════ */
  fisica_optica_bloco_5_E1: {
    foco: 'O olho humano normal (emetrope) e a câmera fotográfica funcionam do mesmo jeito: um sistema de lentes convergentes projeta no fundo (retina ou sensor) uma imagem REAL, INVERTIDA e MENOR.',
    videos: [],
    sites: [
      {
        id: 'site_opt_e1_1',
        titulo: 'Óptica da Visão: Como o Olho Humano Forma Imagens',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/optica-visao.htm',
        resumo: 'Papel da córnea, pupila, cristalino (acomodação visual) e retina na formação da imagem real e invertida.'
      },
      {
        id: 'site_opt_e1_2',
        titulo: 'Olho Humano e Câmera Fotográfica na Óptica',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/olho-humano/',
        resumo: 'Anatomia óptica do olho e comparação direta com os elementos de uma câmera.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_e1_1',
        ano: 'ENEM 2018',
        habilidadeId: 'E1',
        contexto: 'Acomodação Visual do Cristalino e Imagem na Retina',
        enunciado: 'Para que uma pessoa com visão normal consiga enxergar nitidamente tanto uma montanha distante quanto as letras de um livro próximo aos olhos, os músculos ciliares alteram a curvatura do cristalino (processo de acomodação visual), mantendo a imagem sempre focalizada exatamente sobre a retina. A respeito da imagem projetada pelo cristalino sobre a retina, é correto afirmar que ela é:',
        alternativas: {
          A: 'Virtual, direita e maior que o objeto observado.',
          B: 'Virtual, invertida e do mesmo tamanho do objeto.',
          C: 'Real, invertida e menor que o objeto observado.',
          D: 'Real, direita e menor que o objeto observado.',
          E: 'Imprópria, formando-se no infinito.'
        },
        correta: 'C',
        resolucao: '1) O conjunto córnea + cristalino atua como uma lente convergente e os objetos que enxergamos estão situados além do ponto antiprincipal (p > 2f).\n2) Por ser projetada fisicamente sobre um anteparo (a retina), a imagem é obrigatoriamente REAL, INVERTIDA e MENOR que o objeto.'
      }
    ]
  },

  fisica_optica_bloco_5_E2: {
    foco: 'Tema queridinho do ENEM! MIOPIA = olho longo demais → imagem forma-se ANTES da retina → corrige com lente DIVERGENTE (f < 0, grau negativo). HIPERMETROPIA e PRESBIOPIA = imagem se formaria ATRÁS da retina → corrige com lente CONVERGENTE (f > 0, grau positivo).',
    videos: [],
    sites: [
      {
        id: 'site_opt_e2_1',
        titulo: 'Defeitos da Visão: Miopia, Hipermetropia, Astigmatismo e Presbiopia',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/defeitos-visao.htm',
        resumo: 'Esquemas dos raios luminosos antes e depois da correção com lentes divergentes, convergentes e cilíndricas.'
      },
      {
        id: 'site_opt_e2_2',
        titulo: 'Ametropias Visuais e Receita de Óculos no ENEM',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/miopia-e-hipermetropia/',
        resumo: 'Como interpretar receitas médicas com dioptrias positivas e negativas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_e2_1',
        ano: 'ENEM 2021',
        habilidadeId: 'E2',
        contexto: 'Correção de Miopia e Hipermetropia com Lentes Esféricas',
        enunciado: 'Após realizar exames oftalmológicos, dois irmãos receberam suas receitas de óculos: Lucas apresenta dificuldade para enxergar placas de trânsito à distância, pois em seus olhos a imagem de objetos distantes forma-se ANTES da retina; já Marina sente dor de cabeça ao ler livros de perto, pois em seus olhos a imagem de objetos próximos forma-se ATRÁS da retina. Os defeitos visuais de Lucas e Marina e os tipos de lentes esféricas que corrigem cada caso são, respectivamente:',
        alternativas: {
          A: 'Miopia (lente convergente) e hipermetropia (lente divergente).',
          B: 'Miopia (lente divergente, dioptria negativa) e hipermetropia (lente convergente, dioptria positiva).',
          C: 'Hipermetropia (lente divergente) e miopia (lente convergente).',
          D: 'Presbiopia (lente divergente) e astigmatismo (lente plana).',
          E: 'Miopia (lente cilíndrica positiva) e hipermetropia (lente bicôncava).'
        },
        correta: 'B',
        resolucao: '1) Lucas tem MIOPIA (dificuldade de ver de longe; olho excessivamente convergente/alongado que forma a imagem ANTES da retina). Para espalhar levemente os raios e recuar a imagem até a retina, usa-se lente DIVERGENTE (grau/dioptria negativa).\n2) Marina tem HIPERMETROPIA (dificuldade de ver de perto; a imagem se formaria ATRÁS da retina). Para ajudar o cristalino a convergir os raios na retina, usa-se lente CONVERGENTE (grau/dioptria positiva).'
      }
    ]
  },

  fisica_optica_bloco_5_E3: {
    foco: 'No microscópio óptico composto há 2 lentes convergentes: a OBJETIVA (perto da amostra) conjuga uma 1ª imagem real, invertida e ampliada; a OCULAR (perto do olho) funciona como uma lupa, conjugando uma imagem final virtual e ainda maior.',
    videos: [],
    sites: [
      {
        id: 'site_opt_e3_1',
        titulo: 'Instrumentos Ópticos: Lupa, Microscópio, Luneta e Câmera',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/instrumentos-opticos/',
        resumo: 'Papel da lente objetiva e da lente ocular nos instrumentos de observação e projeção.'
      },
      {
        id: 'site_opt_e3_2',
        titulo: 'Microscópio Composto e Telescópio Refrator',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/instrumentos-opticos.htm',
        resumo: 'Multiplicação dos aumentos lineares da objetiva e da ocular (A_total = A_obj × A_oc).'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_e3_1',
        ano: 'ENEM 2019',
        habilidadeId: 'E3',
        contexto: 'Associação de Lentes em um Microscópio Composto',
        enunciado: 'Um microscópio óptico escolar é constituído essencialmente por dois sistemas de lentes convergentes alinhados em um tubo: a objetiva (posicionada próxima à lâmina biológica) e a ocular (onde o estudante aproxima o olho). Se a lente objetiva utilizada produz um aumento linear de 40 vezes em módulo e a lente ocular produz um aumento de 10 vezes, a ampliação total fornecida pelo microscópio e a natureza da imagem final observada pelo olho do estudante são, respectivamente:',
        alternativas: {
          A: '50 vezes; imagem real e direita em relação ao objeto.',
          B: '400 vezes; imagem virtual e invertida em relação ao objeto original.',
          C: '400 vezes; imagem real projetada fora do microscópio.',
          D: '4 vezes; imagem virtual e direita.',
          E: '30 vezes; imagem virtual e reduzida.'
        },
        correta: 'B',
        resolucao: '1) Em uma associação de lentes como o microscópio composto, o aumento total é o produto dos aumentos de cada lente: |A_total| = |A_objetiva| × |A_ocular| = 40 × 10 = 400 vezes.\n2) A objetiva forma uma primeira imagem REAL, INVERTIDA e maior. A ocular atua como uma lupa sobre essa primeira imagem, formando uma imagem final VIRTUAL e mantendo a inversão em relação à amostra original.'
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════════════════
     BLOCO 6 — FENÔMENOS ONDULATÓRIOS DA LUZ E CORES (F1, F2, F3)
     ══════════════════════════════════════════════════════════════════════════ */
  fisica_optica_bloco_6_F1: {
    foco: 'Dispersão da luz branca no prisma e no arco-íris: no vidro/água, cada cor (frequência) viaja com velocidade diferente! O VIOLETA (maior frequência, maior n, menor velocidade no meio) sofre o MAIOR desvio; o VERMELHO sofre o menor desvio.',
    videos: [],
    sites: [
      {
        id: 'site_opt_f1_1',
        titulo: 'Dispersão da Luz, Prisma de Newton e Formação do Arco-Íris',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/dispersao-da-luz/',
        resumo: 'Por que a luz branca se decompõe nas sete cores do arco-íris ao atravessar prismas ou gotas de chuva.'
      },
      {
        id: 'site_opt_f1_2',
        titulo: 'Decomposição da Luz Branca e Índice de Refração por Cor',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/dispersao-luz.htm',
        resumo: 'Relação entre frequência da onda luminosa, velocidade no meio material e ângulo de desvio.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_f1_1',
        ano: 'ENEM 2020',
        habilidadeId: 'F1',
        contexto: 'Fenômenos Ópticos na Formação do Arco-Íris',
        enunciado: 'Quando o Sol ilumina uma região chuvosa à nossa frente, podemos observar no céu o arco-íris. Isaac Newton demonstrou que a luz solar branca é policromática, ou seja, composta pela superposição de várias cores (frequências). Para que uma gotícula esférica de água da chuva forme o arco-íris primário observado por uma pessoa na Terra, o raio de luz solar sofre, sequencialmente, na gota:',
        alternativas: {
          A: 'Difração externa, polarização magnética e absorção total.',
          B: 'Refração (com dispersão das cores) ao entrar na gota, reflexão interna na parede de trás da gota e nova refração ao sair para o ar.',
          C: 'Apenas reflexão especular na superfície externa da gota, sem penetrar na água.',
          D: 'Interferência destrutiva total de todas as cores visíveis.',
          E: 'Fusão nuclear das moléculas de água aquecidas pelo Sol.'
        },
        correta: 'B',
        resolucao: '1) Ao incidir na parede frontal da gota de água, a luz solar branca sofre REFRAÇÃO e DISPERSÃO CROMÁTICA (cada cor desvia em um ângulo ligeiramente diferente, pois o índice de refração da água varia com a frequência da luz).\n2) Em seguida, os raios coloridos atingem o fundo da gota e sofrem REFLEXÃO INTERNA.\n3) Finalmente, ao saírem pela parte frontal da gota de volta para o ar, sofrem uma SEGUNDA REFRAÇÃO, chegando separados aos olhos do observador.'
      }
    ]
  },

  fisica_optica_bloco_6_F2: {
    foco: 'A cor de um objeto opaco depende da luz que o ilumina! Corpo BRANCO reflete todas as cores; corpo PRETO absorve todas; corpo VERMELHO reflete apenas o vermelho e absorve as demais (sob luz puramente azul ou verde, o corpo vermelho parece PRETO!).',
    videos: [],
    sites: [
      {
        id: 'site_opt_f2_1',
        titulo: 'A Cor dos Objetos: Reflexão Difusa e Absorção Seletiva',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/a-cor-dos-objetos.htm',
        resumo: 'Exemplos clássicos da bandeira do Brasil e de objetos coloridos iluminados por luz monocromática.'
      },
      {
        id: 'site_opt_f2_2',
        titulo: 'Cores Primárias da Luz e Cor de um Corpo por Reflexão',
        portal: 'Brasil Escola',
        url: 'https://brasilescola.uol.com.br/fisica/cores-dos-objetos.htm',
        resumo: 'Diferença entre cores-luz (RGB) e reflexão seletiva de pigmentos sob diferentes lâmpadas.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_f2_1',
        ano: 'ENEM 2021',
        habilidadeId: 'F2',
        contexto: 'Iluminação Monocromática em Palco de Teatro',
        enunciado: 'Para criar um efeito visual em uma peça de teatro realizada em um palco totalmente escuro, uma atriz veste uma camisa BRANCA com um grande coração VERMELHO estampado no centro e uma calça AZUL. Em determinado momento da cena, o técnico de iluminação acende exclusivamente um refletor de luz monocromática AZUL sobre a atriz. Nessas condições, a plateia enxergará a camisa, o coração estampado e a calça nas cores:',
        alternativas: {
          A: 'Branca, vermelha e azul.',
          B: 'Azul, preta (escura) e azul.',
          C: 'Azul, roxa e preta.',
          D: 'Preta, vermelha e azul.',
          E: 'Azul, azul e branca.'
        },
        correta: 'B',
        resolucao: '1) O tecido BRANCO reflete difusamente qualquer cor de luz que incida sobre ele; iluminado com luz azul, reflete azul e é visto como AZUL.\n2) O pigmento VERMELHO reflete apenas a luz vermelha e absorve as demais; iluminado exclusivamente com luz azul, absorve toda a luz incidente e não reflete nada para a plateia, sendo visto como PRETO (escuro).\n3) O tecido AZUL reflete a luz azul incidente, continuando a ser visto como AZUL.'
      }
    ]
  },

  fisica_optica_bloco_6_F3: {
    foco: 'Fenômenos ondulatórios da luz: 1) DIFRAÇÃO = onda contorna obstáculos ou se espalha ao passar por fenda estreita; 2) INTERFERÊNCIA = superposição gerando franjas claras (construtiva) e escuras (destrutiva); 3) POLARIZAÇÃO = filtra um único plano de vibração (prova que a luz é onda TRANSVERSAL!).',
    videos: [],
    sites: [
      {
        id: 'site_opt_f3_1',
        titulo: 'Difração, Interferência e Polarização da Luz (Óptica Física)',
        portal: 'Toda Matéria',
        url: 'https://www.todamateria.com.br/polarizacao-da-luz/',
        resumo: 'Experimento da fenda dupla de Young, lentes polarizadas antirreflexo e cinema 3D.'
      },
      {
        id: 'site_opt_f3_2',
        titulo: 'Fenômenos Ondulatórios Aplicados à Luz no ENEM',
        portal: 'Mundo Educação',
        url: 'https://mundoeducacao.uol.com.br/fisica/difracao-interferencia-luminosa.htm',
        resumo: 'Como diferenciar refração, difração, dispersão, interferência e polarização nas questões do ENEM.'
      }
    ],
    questoesEnem: [
      {
        id: 'enem_opt_f3_1',
        ano: 'ENEM 2023',
        habilidadeId: 'F3',
        contexto: 'Óculos de Sol Polarizados e Cinema 3D',
        enunciado: 'Motoristas e pescadores costumam utilizar óculos de sol com lentes polarizadas porque elas reduzem drasticamente o brilho ofuscante da luz solar refletida horizontalmente pelo asfalto quente ou pela superfície da água, sem escurecer excessivamente o restante da paisagem. Além disso, somente as ondas transversais (como a luz) podem sofrer polarização; ondas longitudinais (como o som no ar) não podem ser polarizadas. O filtro polarizador dos óculos elimina o reflexo ofuscante porque:',
        alternativas: {
          A: 'Aumenta a velocidade da luz refletida pela água, desviando-a para fora da pupila.',
          B: 'Bloqueia seletivamente as ondas luminosas cujo campo elétrico oscila na direção horizontal (predominante na luz refletida pela superfície), permitindo a passagem apenas da componente vertical.',
          C: 'Transforma a luz visível em ondas sonoras inaudíveis por efeito fotoelétrico.',
          D: 'Provoca dispersão cromática, decompondo o reflexo branco nas cores do arco-íris.',
          E: 'Atua como um espelho côncavo que concentra o reflexo na armação dos óculos.'
        },
        correta: 'B',
        resolucao: '1) Quando a luz solar (não polarizada) reflete sob certos ângulos em superfícies horizontais não metálicas (como a água ou o asfalto), a luz refletida torna-se fortemente polarizada na direção HORIZONTAL.\n2) As lentes dos óculos polarizados possuem um eixo de transmissão VERTICAL: elas bloqueiam a componente horizontal do campo elétrico (eliminando o brilho ofuscante do reflexo) e deixam passar a componente vertical, preservando a visibilidade nítida.'
      }
    ]
  }
};

// Cria aliases automáticos sem underscore no bloco (ex: fisica_optica_bloco4_D1 <-> fisica_optica_bloco_4_D1)
Object.keys(window.OpticaTopicResources).forEach(function(k) {
  var alias = k.replace('_bloco_', '_bloco');
  if (alias !== k && !window.OpticaTopicResources[alias]) {
    window.OpticaTopicResources[alias] = window.OpticaTopicResources[k];
  }
});
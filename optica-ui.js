/* optica-ui.js — Plataforma Centralizadora de Estudos ENEM (v5 — CMS Visual 100% Editável, Sem Diagnóstico)
   Estrutura Principal:
   1. Topo Limpo com 4 Abas (🏠 Início, 📚 Biblioteca de Estudos, 📌 Minha Lista, 📈 Progressão) + Menu de 3 Barrinhas (☰) à direita
   2. Menu Lateral (☰): Troca de Perfil Local, Chave "✏️ Modo Edição (Ativo/Inativo)", Backup JSON (Exportar/Importar/Restaurar)
   3. Modo Edição Visual Completo (CMS In-App):
      - Editar textos globais (Título "Meu ENEM", boas-vindas, subtítulos)
      - Criar, editar, reordenar (↑/↓) e excluir Matérias (criando automaticamente página de estudo pronta!)
      - Criar, editar, reordenar (↑/↓) e excluir Assuntos, Blocos e Tópicos
      - Editar Resumos, Imagens (URL/Upload Base64), Sites, Videoaulas (com duração e reordenação ↑/↓) e Questões do ENEM (A–E)
   4. Módulo Biologia → Citologia já cadastrado completo (Leitura Inicial Descomplica, Vídeo Inicial, 5 Aulas numeradas com durações e Questões ENEM)
*/
(() => {
const STORAGE_KEY_V5 = 'meu-enem-v5-cms';
const STORAGE_KEY_V6 = 'meu-enem-v6-cms';

const esc = s => typeof escapeHtml === 'function'
  ? escapeHtml(s ?? '')
  : String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ══════════════════════════════════════════════════════════════════════════
   1. UTILITÁRIOS DE FORMATAÇÃO (MARKDOWN, FÓRMULAS E YOUTUBE THUMBNAIL)
   ══════════════════════════════════════════════════════════════════════════ */
function sanitizeAndFormatMathText(text) {
  if (text == null) return '';
  let s = String(text);
  // 1. Substitui primeiro o comando LaTeX completo '\times' ou '\\times':
  s = s.replace(/\\+times\b/gi, ' × ');

  // 2. Corrige o resquício corrompido de JSON onde '\t' virou tabulação antes de 'imes' (ex: tab + 'imes'):
  s = s.replace(/[\t\r\n ]+imes\b/gi, ' × ');

  // 3. Corrige quebras de linha acidentais em notação de potência como '10 \n 8 m/s' ou '10\n8':
  s = s.replace(/(\b\d+)\s*[\r\n]+\s*(\d+)\s*(m\/s|km\/h|cm|kg|m|s|J|W|Hz|N|Pa|V|A|Ω|C)?\b/gi, (m, b, exp, unit) => {
    return unit ? `${b}^${exp} ${unit}` : `${b}^${exp}`;
  });

  // 4. Converte comandos LaTeX comuns mesmo fora de delimitadores $...$:
  s = s.replace(/\\+text\{([^}]+)\}/gi, '$1');
  s = s.replace(/\\+frac\{([^}]+)\}\{([^}]+)\}/gi, '$1/$2');
  s = s.replace(/\\+cdot\b/gi, '·');
  s = s.replace(/\\+Delta\b/gi, 'Δ');
  s = s.replace(/\\+lambda\b/gi, 'λ');
  s = s.replace(/\\+theta\b/gi, 'θ');
  s = s.replace(/\\+Omega\b/gi, 'Ω');
  s = s.replace(/\\+mu\b/gi, 'μ');
  s = s.replace(/\\+approx\b/gi, '≈');
  s = s.replace(/\\+ge\b/gi, '≥');
  s = s.replace(/\\+le\b/gi, '≤');
  s = s.replace(/\\+ne\b/gi, '≠');
  s = s.replace(/\\+rightarrow\b/gi, '→');
  s = s.replace(/\\+Rightarrow\b/gi, '⇒');

  // 5. Remove barras invertidas soltas residuais antes de letras
  s = s.replace(/\\+([a-zA-Z]+)/g, '$1');

  // 6. Normaliza espaços múltiplos
  s = s.replace(/[ \t]{2,}/g, ' ');

  return s;
}

function formatMathExpr(expr) {
  let s = sanitizeAndFormatMathText(expr.trim());
  s = esc(s);
  s = s.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
  s = s.replace(/\^([a-zA-Z0-9+-]+)/g, '<sup>$1</sup>');
  s = s.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
  s = s.replace(/_([a-zA-Z0-9]+)/g, '<sub>$1</sub>');
  return `<span class="math-inline">${s}</span>`;
}

function formatInlineMarkdown(text) {
  if (text == null) return '';
  let raw = sanitizeAndFormatMathText(text);

  const mathTokens = [];
  let processed = raw.replace(/\$([^$]+)\$/g, (_, math) => {
    const idx = mathTokens.length;
    mathTokens.push(formatMathExpr(math));
    return `@@MATH_${idx}@@`;
  });

  // Formata potências fora de $...$ como '10^8', '2^4', 'x^2'
  processed = processed.replace(/\b([a-zA-Z0-9]+)\s*\^\s*\{?(-?[0-9a-zA-Z+-]+)\}?/g, '$1<sup>$2</sup>');

  processed = esc(processed);
  // Restaura tags <sup> geradas antes do esc:
  processed = processed.replace(/&lt;sup&gt;([^&]+)&lt;\/sup&gt;/g, '<sup>$1</sup>');

  processed = processed.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--green);text-decoration:underline;font-weight:600">$1 ↗</a>');
  processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  processed = processed.replace(/@@MATH_(\d+)@@/g, (_, idx) => mathTokens[Number(idx)] || '');
  return processed;
}

window.formatInlineMarkdown = formatInlineMarkdown;
window.sanitizeAndFormatMathText = sanitizeAndFormatMathText;

function renderMarkdownSummary(md) {
  if (!md) return '<p>Resumo não disponível.</p>';
  const lines = String(md).split(/\r?\n/);
  let html = '';
  let inList = false;
  let inSubList = false;

  const closeLists = () => {
    if (inSubList) { html += '</ul></li>'; inSubList = false; }
    if (inList) { html += '</ul>'; inList = false; }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed) {
      closeLists();
      continue;
    }
    if (trimmed.startsWith('### ')) {
      closeLists();
      html += `<h3 class="ob-md-h3">${formatInlineMarkdown(trimmed.slice(4))}</h3>`;
    } else if (trimmed.startsWith('## ')) {
      closeLists();
      html += `<h2 class="ob-md-h2">${formatInlineMarkdown(trimmed.slice(3))}</h2>`;
    } else if (/^\s{2,}-\s+/.test(raw)) {
      const content = raw.replace(/^\s{2,}-\s+/, '');
      if (!inList) { html += '<ul class="ob-md-list"><li>'; inList = true; }
      if (!inSubList) { html += '<ul class="ob-md-sublist">'; inSubList = true; }
      html += `<li>${formatInlineMarkdown(content)}</li>`;
    } else if (trimmed.startsWith('- ')) {
      if (inSubList) { html += '</ul></li>'; inSubList = false; }
      if (!inList) { html += '<ul class="ob-md-list">'; inList = true; }
      const content = trimmed.slice(2);
      const nextRaw = lines[i + 1] || '';
      if (/^\s{2,}-\s+/.test(nextRaw)) {
        html += `<li>${formatInlineMarkdown(content)}`;
      } else {
        html += `<li>${formatInlineMarkdown(content)}</li>`;
      }
    } else {
      closeLists();
      html += `<p class="ob-md-p">${formatInlineMarkdown(trimmed)}</p>`;
    }
  }
  closeLists();
  return html;
}

function extractYouTubeVideoId(url) {
  if (!url) return null;
  const s = String(url).trim();
  if (s.includes('youtube.com/results')) return null;
  const m1 = s.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m1) return m1[1];
  const m2 = s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m2) return m2[1];
  const m3 = s.match(/youtube\.com\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/);
  if (m3) return m3[1];
  return null;
}

function extractDomainFromUrl(url) {
  try {
    const u = new URL(String(url || '').trim());
    return u.hostname.replace(/^www\./i, '');
  } catch (e) {
    return 'site-estudo.com.br';
  }
}

/**
 * Gera o "Quadrinho Visual / Thumbnail" para qualquer Link de Leitura (Site/Artigo),
 * semelhante à miniatura do YouTube, com capa personalizada (se houver) ou capa visual do portal + favicon.
 */
function renderSiteThumbBox(site) {
  const url = site?.url || '#';
  const portal = site?.portal || site?.fonte || 'Leitura';
  const domain = extractDomainFromUrl(url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
  const customThumb = site?.thumbUrl || site?.imagemUrl || '';

  if (customThumb) {
    return `
      <a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="site-thumb-link" title="Abrir leitura: ${esc(site?.titulo || portal)}">
        <img src="${esc(customThumb)}" alt="${esc(site?.titulo || portal)}" class="video-thumb-img" loading="lazy">
        <span class="site-thumb-badge">📖 ${esc(portal)} ↗</span>
      </a>
    `;
  }

  return `
    <a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="site-thumb-link site-thumb-generated" title="Abrir leitura em ${esc(portal)} (${esc(domain)})">
      <div class="site-thumb-top">
        <img src="${esc(faviconUrl)}" alt="" class="site-thumb-favicon" loading="lazy" onerror="this.style.display='none'">
        <span class="site-thumb-portal">${esc(portal)}</span>
      </div>
      <div class="site-thumb-Mid">
        <span class="site-thumb-doc-icon">📄</span>
        <span class="site-thumb-domain">${esc(domain)}</span>
      </div>
      <div class="site-thumb-cta">📖 Abrir Resumo ↗</div>
    </a>
  `;
}

function normalizeBlockSlug(blocoId) {
  return String(blocoId || 'bloco1').replace(/_/g, '');
}

function buildTopicKey(materiaId, assuntoId, blocoId, habilidadeId) {
  return `${materiaId}_${assuntoId}_${normalizeBlockSlug(blocoId)}_${habilidadeId}`;
}

function buildAltTopicKey(materiaId, assuntoId, blocoId, habilidadeId) {
  return `${materiaId}_${assuntoId}_${blocoId}_${habilidadeId}`;
}

function slugifyId(str, fallback = 'item') {
  const s = String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return s || `${fallback}_${Date.now().toString(36)}`;
}

/* ══════════════════════════════════════════════════════════════════════════
   2. ÁREAS DO ENEM + CATÁLOGO BASE + CMS DINÂMICO 100% EDITÁVEL
   ══════════════════════════════════════════════════════════════════════════ */
const ENEM_AREAS = [
  {
    id: 'natureza',
    nome: 'Ciências da Natureza e suas Tecnologias',
    curto: 'Ciências da Natureza',
    icone: '🔬',
    desc: 'Biologia, Física e Química'
  },
  {
    id: 'matematica',
    nome: 'Matemática e suas Tecnologias',
    curto: 'Matemática',
    icone: '📐',
    desc: 'Matemática Financeira, Probabilidade, Geometria e Funções'
  },
  {
    id: 'humanas',
    nome: 'Ciências Humanas e suas Tecnologias',
    curto: 'Ciências Humanas',
    icone: '🌍',
    desc: 'História, Geografia, Filosofia e Sociologia'
  },
  {
    id: 'linguagens',
    nome: 'Linguagens, Códigos e suas Tecnologias',
    curto: 'Linguagens e Códigos',
    icone: '📚',
    desc: 'Português, Literatura, Língua Estrangeira e Artes'
  },
  {
    id: 'redacao',
    nome: 'Redação ENEM',
    curto: 'Redação',
    icone: '✍️',
    desc: 'Texto Dissertativo-Argumentativo, Repertório e 5 Competências'
  }
];

const DEFAULT_SUBJECTS_META = [
  { id: 'biologia', enemAreaId: 'natureza', nome: 'Biologia', icone: '🧬', desc: 'Citologia, estrutura celular, organelas, membrana plasmática, bioquímica e divisão celular.' },
  { id: 'fisica', enemAreaId: 'natureza', nome: 'Física', icone: '⚡', desc: 'Óptica Geométrica e Física, Cinemática, Dinâmica, Trabalho e Energia.' },
  { id: 'quimica', enemAreaId: 'natureza', nome: 'Química', icone: '🧪', desc: 'Ligações Químicas, Polaridade, Forças Intermoleculares e Estequiometria.' },
  { id: 'matematica', enemAreaId: 'matematica', nome: 'Matemática', icone: '📐', desc: 'Porcentagem, Juros Compostos, Matemática Financeira e Probabilidade.' },
  { id: 'historia', enemAreaId: 'humanas', nome: 'História', icone: '🏛️', desc: 'Brasil Colônia, Império, Era Vargas, República e História Geral no ENEM.' },
  { id: 'geografia', enemAreaId: 'humanas', nome: 'Geografia', icone: '🌍', desc: 'Clima, Biomas, Meio Ambiente, Espaço Urbano/Agrário e Geopolítica.' },
  { id: 'filosofia_sociologia', enemAreaId: 'humanas', nome: 'Filosofia e Sociologia', icone: '🦉', desc: 'Ética, Política, Contratualistas, Cidadania, Cultura e Movimentos Sociais.' },
  { id: 'portugues', enemAreaId: 'linguagens', nome: 'Português e Literatura', icone: '📖', desc: 'Interpretação de Texto, Funções da Linguagem, Variação Linguística e Literatura.' },
  { id: 'redacao', enemAreaId: 'redacao', nome: 'Redação ENEM', icone: '✍️', desc: 'Estrutura Dissertativo-Argumentativa, Repertório Sociocultural e Competência 5.' }
];

const DEFAULT_SITE_TEXTS = {
  brandTitle: 'Meu ENEM',
  homeEyebrow: 'Organizador e Centralizador de Estudos',
  homeSubtitle: 'Uma forma minha de te ajudar nos estudos, tentei organizar um conteúdos e deixar mais perfeitinho pra você meu amor, aproveite 😊💖',
  libraryTitle: 'Biblioteca de Estudos por Área do ENEM',
  librarySubtitle: 'Escolha a Área do ENEM e a matéria abaixo para acessar o "Comece por aqui", assistir às videoaulas e praticar com questões oficiais.'
};

const DEFAULT_COUNTDOWN = {
  label: 'ENEM 2026',
  title: 'ENEM 2026',
  targetDate: '2026-11-08',
  message: 'Estude com calma, um passo de cada vêz, você tem capacidade e vontade para conseguir seu objetivos, tenho muito orgulho de você💖🥰',
  quote: 'Estude com calma, um passo de cada vêz, você tem capacidade e vontade para conseguir seu objetivos, tenho muito orgulho de você💖🥰',
  enabled: true
};

function getCountdownStats() {
  const cfg = storageService.getCountdown();
  const label = cfg.label || cfg.title || 'ENEM 2026';
  const quote = cfg.quote || cfg.message || DEFAULT_COUNTDOWN.quote;
  const now = new Date();
  const target = new Date(cfg.targetDate || '2026-11-08');
  const diffMs = target.getTime() - now.getTime();
  if (isNaN(diffMs)) {
    return { ...cfg, days: 0, isPast: false, label, title: label, labelText: label, message: quote, quote };
  }
  if (diffMs <= 0) {
    return { ...cfg, days: 0, isPast: true, label, title: label, labelText: `${label} (Chegou o dia!)`, message: quote, quote };
  }
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return {
    ...cfg,
    days,
    isPast: false,
    label,
    title: label,
    labelText: `${label} · Faltam ${days} ${days === 1 ? 'dia' : 'dias'}`,
    message: quote,
    quote
  };
}

function getRawBaseModules() {
  const optData = window.DiagnosticoOpticaData || {
    materia: 'Física',
    assunto: 'Óptica',
    descricao: 'Fundamentos da luz, reflexão, espelhos, refração, lentes esféricas, visão e fenômenos ondulatórios.',
    blocos: []
  };
  const opticaModule = {
    id: 'fisica_optica',
    materiaId: 'fisica',
    materia: 'Física',
    assuntoId: 'optica',
    assunto: 'Óptica',
    icone: '🔭',
    cor: 'green',
    descricao: optData.descricao || 'Fundamentos da luz, reflexão, espelhos, refração, lentes esféricas, visão e fenômenos ondulatórios.',
    introReading: {
      titulo: 'Resumo Completo de Óptica para o ENEM (Brasil Escola)',
      portal: 'Brasil Escola',
      url: 'https://brasilescola.uol.com.br/fisica/optica.htm',
      resumo: 'Visão geral introdutória sobre propagação da luz, espelhos, refração, lentes e fenômenos ópticos.'
    },
    blocos: optData.blocos || []
  };
  const extraModules = Array.isArray(window.EnemCatalogModules) ? window.EnemCatalogModules : [];
  const bioMods = extraModules.filter(m => m.materiaId === 'biologia');
  const otherMods = extraModules.filter(m => m.materiaId !== 'biologia');
  return [...bioMods, opticaModule, ...otherMods];
}

function getBaseTopicResourcesFromGlobals(materiaId, assuntoId, blocoId, habId, habObj, blkObj) {
  const canonical = buildTopicKey(materiaId, assuntoId, blocoId, habId);
  const altKey = buildAltTopicKey(materiaId, assuntoId, blocoId, habId);
  const optMap = window.OpticaTopicResources || {};
  const catMap = window.CatalogTopicResources || {};
  const raw = optMap[canonical] || optMap[altKey] || catMap[canonical] || catMap[altKey] || {};

  const vList = (Array.isArray(raw.videos) && raw.videos.length > 0)
    ? raw.videos
    : (Array.isArray(habObj?.videos) ? habObj.videos : []);
  const sList = (Array.isArray(raw.sites) && raw.sites.length > 0)
    ? raw.sites
    : (Array.isArray(habObj?.sites) ? habObj.sites : []);
  const qList = (Array.isArray(raw.questoesEnem) && raw.questoesEnem.length > 0)
    ? raw.questoesEnem
    : (Array.isArray(habObj?.questoesEnem) ? habObj.questoesEnem : []);

  return {
    foco: raw.foco || habObj?.foco || blkObj?.descricao || '',
    preRequisito: raw.preRequisito || habObj?.preRequisito || '',
    videos: vList.filter(v => v && v.url && !String(v.url).includes('youtube.com/results')).map(v => ({ ...v })),
    sites: sList.map(s => ({ ...s })),
    questoesEnem: qList.map(q => ({ ...q, alternativas: { ...(q.alternativas || {}) } }))
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   3. PERSISTÊNCIA LOCAL (storageService) + ESTRUTURA CMS EDITÁVEL
   ══════════════════════════════════════════════════════════════════════════ */
function getDefaultStarterNotes() {
  return [
    {
      id: 'note_optica_demo',
      title: 'Óptica Geométrica — Reflexão, Refração e Macetes ENEM',
      icon: '🔬',
      materiaId: 'fisica',
      materia: 'Física',
      topicKey: 'natureza__fisica_cinetica',
      topicTitle: 'Refração da Luz e Leis de Snell',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: [
        {
          id: 'b_1',
          type: 'callout',
          icon: '💡',
          content: 'Dica da Professora IA: O ENEM adora cobrar fenômenos ópticos aplicados ao cotidiano (arco-íris, miragens, fibras ópticas e lentes corretivas de visão). Sempre atente para o índice de refração do meio!'
        },
        {
          id: 'b_2',
          type: 'h2',
          content: 'Princípios da Óptica Geométrica'
        },
        {
          id: 'b_3',
          type: 'p',
          content: '1. Propagação Retilínea: em meios homogêneos e transparentes, a luz viaja em linha reta (origem das sombras e eclipses).\n2. Independência dos Raios: raios de luz se cruzam sem interferir na trajetória um do outro.\n3. Reversibilidade: o caminho de ida é rigorosamente igual ao caminho de volta.'
        },
        {
          id: 'b_4',
          type: 'h2',
          content: 'Refração e Lei de Snell-Descartes'
        },
        {
          id: 'b_5',
          type: 'code',
          content: 'Índice de refração: n = c / v\nLei de Snell: n1 · sen(θ1) = n2 · sen(θ2)\nVelocidade no vácuo: c = 3 × 10⁸ m/s'
        },
        {
          id: 'b_6',
          type: 'todo',
          content: 'Revisar cálculo do ângulo limite (L = arcsen(n_menor / n_maior))',
          checked: true
        },
        {
          id: 'b_7',
          type: 'todo',
          content: 'Resolver 5 exercícios sobre transmissão de dados em fibra óptica',
          checked: false
        },
        {
          id: 'b_8',
          type: 'reference',
          title: 'Simulação Interativa PhET de Desvio da Luz',
          url: 'https://phet.colorado.edu/pt_BR/simulations/bending-light'
        }
      ]
    },
    {
      id: 'note_math_demo',
      title: 'Fórmulas e Raciocínios Rápidos de Matemática',
      icon: '📐',
      materiaId: 'matematica',
      materia: 'Matemática',
      topicKey: null,
      topicTitle: 'Geral',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: [
        {
          id: 'b_m1',
          type: 'callout',
          icon: '🎯',
          content: 'Estratégia TRI: Não perca tempo travado em contas imensas. Faça primeiro as questões de razão, proporção, porcentagem e estatística descritiva (média, moda e mediana).'
        },
        {
          id: 'b_m2',
          type: 'h2',
          content: 'Probabilidade Clássica e Eventos Complementares'
        },
        {
          id: 'b_m3',
          type: 'code',
          content: 'P(A) = Casos Favoráveis / Casos Possíveis\nP(não A) = 1 - P(A)\nP(A ∪ B) = P(A) + P(B) - P(A ∩ B)'
        },
        {
          id: 'b_m4',
          type: 'todo',
          content: 'Memorizar áreas planas: Círculo (π·r²), Triângulo equilátero ((l²·√3)/4)',
          checked: false
        }
      ]
    }
  ];
}

function createEmptyProfileState() {
  return {
    activeArea: 'home', // 'home' | 'library' | 'my-list' | 'progression'
    subView: 'main',    // 'main' | 'topic-study'
    activeTopicKey: null,
    activeTopicTab: 'resumo', // 'resumo' | 'videos' | 'pratica'
    libraryFilterMateria: 'all',
    libraryFilterModule: 'all',
    librarySearch: '',
    listFilterMateria: 'all',
    listFilterStatus: 'all',
    progFilterMateria: 'all',
    openAccordions: {},
    lastActivity: null, // { topicKey, label, updatedAt }
    topicProgress: {},  // { [topicKey]: { completed: bool, readSummary: bool, enemAnswers: { [qId]: { selected, checked } }, updatedAt } }
    studyList: [],      // [ { id, topicKey, materiaId, materia, assunto, blockTitle, title, subtitle, status, priority, origin } ]
    diagnosticsHistory: {}, // { [modId]: { nivelGlobal, veredicto, tituloVeredicto, acertosTotal, totalQuestoes, materia, assunto, updatedAt } }
    diagSession: null,
    myListView: 'list', // 'list' | 'notes'
    notes: getDefaultStarterNotes(),
    activeNoteId: 'note_optica_demo',
    noteSearch: ''
  };
}

const storageService = {
  data: null,
  editMode: false,
  drawerOpen: false,
  aiChatOpen: false,
  aiLoading: false,
  aiError: '',

  init() {
    let loaded = null;
    try {
      // Prioridade máxima: 'meu-enem-v5-cms' onde residem todos os perfis do usuário (ex: FFASF), customizações de física, páginas, resumos e vídeos adicionados
      const rawV5 = localStorage.getItem(STORAGE_KEY_V5);
      const rawV6 = localStorage.getItem(STORAGE_KEY_V6);
      let pV5 = null, pV6 = null;
      if (rawV5) {
        try { pV5 = JSON.parse(rawV5); } catch (e) { console.warn('Erro ao ler storage v5:', e); }
      }
      if (rawV6) {
        try { pV6 = JSON.parse(rawV6); } catch (e) { console.warn('Erro ao ler storage v6:', e); }
      }

      const v5HasData = pV5 && (
        (Array.isArray(pV5.profiles) && pV5.profiles.length > 0) ||
        (pV5.cms && (Object.keys(pV5.cms.topicsData || {}).length > 0 || Object.keys(pV5.cms.customModules || {}).length > 0))
      );
      const v6HasData = pV6 && (
        (Array.isArray(pV6.profiles) && pV6.profiles.length > 0) ||
        (pV6.cms && (Object.keys(pV6.cms.topicsData || {}).length > 0 || Object.keys(pV6.cms.customModules || {}).length > 0))
      );

      if (v5HasData) {
        loaded = pV5;
      } else if (v6HasData) {
        loaded = pV6;
      } else {
        loaded = pV5 || pV6;
      }
    } catch (e) {
      console.warn('Erro ao ler storage:', e);
    }

    if (loaded && typeof loaded === 'object' && Array.isArray(loaded.profiles)) {
      this.data = loaded;
      // Garante que se houver perfis mas activeProfileId estiver nulo, ativa o primeiro perfil existente (ex: FFASF)
      if (!this.data.activeProfileId && this.data.profiles.length > 0) {
        this.data.activeProfileId = this.data.profiles[0].id;
      }
      Object.values(this.data.profileStates || {}).forEach(st => {
        if (st && st.diagSession && st.diagSession.loading && !st.diagSession.question) {
          st.diagSession = null;
        }
      });
    } else {
      this.data = {
        version: 5,
        activeProfileId: null, // Inicia sem perfil pré-criado se for o primeiro acesso absoluto
        profiles: [],
        profileStates: {},
        cms: {
          siteTexts: { ...DEFAULT_SITE_TEXTS },
          subjectsOrder: null,        // array de ids de matérias
          customSubjects: {},         // { [matId]: { id, nome, icone, desc } }
          deletedSubjectIds: [],
          modulesOrder: null,         // array de ids de módulos
          customModules: {},          // { [modId]: { id, materiaId, materia, assuntoId, assunto, icone, descricao, introReading, introVideo, blocos } }
          deletedModuleIds: [],
          customBlocksByModule: {},   // { [modId]: { order: [], overrides: { [blkId]: { titulo, descricao, resumo } }, added: [], deletedIds: [] } }
          customTopicsByBlock: {},    // { [modId__blkId]: { order: [], added: [], deletedIds: [] } }
          topicsData: {}              // { [topicKey]: { titulo, foco, resumo, resumoImage, videos, sites, questoesEnem } }
        }
      };
    }

    if (!this.data.cms) {
      this.data.cms = {
        siteTexts: { ...DEFAULT_SITE_TEXTS },
        subjectsOrder: null,
        customSubjects: {},
        deletedSubjectIds: [],
        modulesOrder: null,
        customModules: {},
        deletedModuleIds: [],
        customBlocksByModule: {},
        customTopicsByBlock: {},
        topicsData: {}
      };
    }
    if (!this.data.cms.siteTexts) this.data.cms.siteTexts = { ...DEFAULT_SITE_TEXTS };
    if (!this.data.cms.customSubjects) this.data.cms.customSubjects = {};
    if (!this.data.cms.deletedSubjectIds) this.data.cms.deletedSubjectIds = [];
    if (!this.data.cms.customModules) this.data.cms.customModules = {};
    if (!this.data.cms.deletedModuleIds) this.data.cms.deletedModuleIds = [];
    if (!this.data.cms.customBlocksByModule) this.data.cms.customBlocksByModule = {};
    if (!this.data.cms.customTopicsByBlock) this.data.cms.customTopicsByBlock = {};
    if (!this.data.cms.topicsData) this.data.cms.topicsData = {};
    if (!this.data.cms.countdown) this.data.cms.countdown = { ...DEFAULT_COUNTDOWN };

    // Restaurar e proteger módulos fundamentais como Matemática Financeira contra apagamentos acidentais
    if (Array.isArray(this.data.cms.deletedModuleIds)) {
      this.data.cms.deletedModuleIds = this.data.cms.deletedModuleIds.filter(id => id !== 'matematica_financeira');
    }
    if (this.data.cms.customBlocksByModule && this.data.cms.customBlocksByModule['matematica_financeira']) {
      this.data.cms.customBlocksByModule['matematica_financeira'].deletedIds = [];
    }

    for (const p of this.data.profiles) {
      this.ensureProfileState(p.id);
    }
    const curProf = this.getActiveProfile();
    if (curProf?.apiKey && window.aiService?.setApiKey) {
      window.aiService.setApiKey(curProf.apiKey);
    }

    // Higienização e sincronização obrigatória de gabaritos oficiais do ENEM no storage persistido
    const officialEnemAnswersMap = {
      'enem_cit3_1': { correta: 'E', resolucao: 'E — Difusão. O sal passa do caldo, onde está mais concentrado, para a batata, onde está menos concentrado. Osmose se refere ao movimento de água; aqui, o enunciado pergunta pelo transporte do sal.' },
      'enem_cit3_2': { correta: 'B', resolucao: 'B — Bicamadas II. Caudas menores e insaturadas dificultam o encaixe entre fosfolipídios, diminuindo as interações entre eles e aumentando a fluidez. A alternativa II reúne essas características. O gabarito oficial do INEP para essa questão é B.' },
      'enem_cit3_3': { correta: 'A', resolucao: 'A — As proteínas movimentam-se no plano da bicamada lipídica. Após a fusão das células, as proteínas inicialmente concentradas em lados diferentes se misturam com o tempo. Isso demonstra a mobilidade lateral das proteínas da membrana, conforme o modelo do mosaico fluido.' },
      'enem_cit3_4': { correta: 'A', resolucao: 'A — Hidrólise. Em meio ácido, a água participa da quebra das ligações éster dos lipídios. Saponificação também envolve hidrólise, mas em meio básico.' },
      'enem_cit4_1': { correta: 'A', resolucao: 'A — Desnaturação enzimática pela alta temperatura. A água fervente desnatura as enzimas que convertem glicose em amido; o resfriamento ajuda a interromper as reações restantes. Assim, mais glicose permanece no milho, preservando o sabor doce. O gabarito oficial do ENEM 2024 confirma a alternativa A.' },
      'enem_cit4_2': { correta: 'C', resolucao: 'C — Fonte de carbono. Compostos como a glicose são degradados na respiração celular e fornecem energia para a produção de ATP. Água, vitaminas, indicadores de pH e elementos inorgânicos não são a fonte energética indicada pela questão.' },
      'enem_cit4_3': { correta: 'D', resolucao: 'D — O ambiente básico reduz a quantidade de substrato metabolizado pela enzima. O gráfico mostra menor atividade enzimática em pH acima de 8 em todas as temperaturas testadas. Com menor atividade, menos substrato é metabolizado.' },
      'enem_cit5_1': { correta: 'A', resolucao: 'A — Divisão celular. O paclitaxel atua sobre a tubulina e altera a dinâmica dos microtúbulos, que participam do fuso mitótico e da movimentação dos cromossomos. Por isso, afeta diretamente a divisão celular.' },
      'enem_cit5_2': { correta: 'C', resolucao: 'C — Recombinação genética na formação dos gametas. Na permuta genética, cromátides não irmãs de cromossomos homólogos trocam segmentos durante a meiose. Essa troca cria novas combinações de genes nos gametas.' },
      'enem_cit5_3': { correta: 'B', resolucao: 'B — Divisão do embrião em dois grupos celulares independentes. Gêmeos monozigóticos se formam quando um único embrião, originado de um óvulo fecundado por um espermatozoide, se separa em dois embriões.' },
      'enem_cit5_4': { correta: 'B', resolucao: 'B — Quimioterápico II. A escolha deve considerar tanto a redução das células tumorais quanto a preservação das células normais. O composto II reduz as células tumorais viáveis em relação ao controle e mantém — ou até aumenta — a quantidade de células normais viáveis. O III deixa menos células tumorais, mas também causa maior perda de células normais.' }
    };
    if (this.data && this.data.cms && this.data.cms.topicsData) {
      Object.values(this.data.cms.topicsData).forEach(tData => {
        if (tData && Array.isArray(tData.questoesEnem)) {
          tData.questoesEnem.forEach(q => {
            if (q && q.id && officialEnemAnswersMap[q.id]) {
              q.correta = officialEnemAnswersMap[q.id].correta;
              q.resolucao = officialEnemAnswersMap[q.id].resolucao;
            }
          });
        }
      });
    }

    this.save();
  },

  save() {
    try {
      const serialized = JSON.stringify(this.data);
      localStorage.setItem(STORAGE_KEY_V5, serialized);
      localStorage.setItem(STORAGE_KEY_V6, serialized);
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
    this.saveToIndexedDB();
  },

  saveToIndexedDB() {
    try {
      if (typeof indexedDB === 'undefined') return;
      const req = indexedDB.open('MeuEnemDB_v5', 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('state')) {
          db.createObjectStore('state');
        }
      };
      req.onsuccess = e => {
        const db = e.target.result;
        const tx = db.transaction('state', 'readwrite');
        tx.objectStore('state').put(this.data, STORAGE_KEY_V5);
      };
    } catch (e) {
      // ignora silenciosamente em ambientes sem indexedDB
    }
  },

  async saveToFolderFile() {
    const json = this.exportBackupJson();
    if (typeof window.showSaveFilePicker === 'function') {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'meu-enem-dados-salvos.json',
          types: [{
            description: 'Arquivo de Dados do Meu ENEM (.json)',
            accept: { 'application/json': ['.json'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        return { ok: true, method: 'picker' };
      } catch (err) {
        if (err && err.name === 'AbortError') return { ok: false, aborted: true };
      }
    }
    this.exportBackup();
    return { ok: true, method: 'download' };
  },

  ensureProfileState(profileId) {
    if (!profileId) {
      if (!this._guestState) this._guestState = createEmptyProfileState();
      return this._guestState;
    }
    if (!this.data.profileStates[profileId]) {
      this.data.profileStates[profileId] = createEmptyProfileState();
    }
    const st = this.data.profileStates[profileId];
    if (!st.activeArea) st.activeArea = 'home';
    if (!st.subView) st.subView = 'main';
    if (!st.openAccordions) st.openAccordions = {};
    if (!st.topicProgress) st.topicProgress = {};
    if (!Array.isArray(st.studyList)) st.studyList = [];
    if (!st.diagnosticsHistory) st.diagnosticsHistory = {};
    if (!Array.isArray(st.notes) || st.notes.length === 0) st.notes = getDefaultStarterNotes();
    if (!st.myListView) st.myListView = 'list';
    if (!st.activeNoteId && st.notes.length > 0) st.activeNoteId = st.notes[0].id;
    return st;
  },

  getProfiles() {
    return this.data.profiles || [];
  },

  getActiveProfile() {
    if (!this.data) this.init();
    if (!this.data.activeProfileId) return null;
    return this.data.profiles.find(p => p.id === this.data.activeProfileId) || null;
  },

  getActiveState() {
    if (!this.data) this.init();
    const prof = this.getActiveProfile();
    if (!prof) return this.ensureProfileState(null);
    return this.ensureProfileState(prof.id);
  },

  getCms() {
    if (!this.data) this.init();
    return this.data.cms;
  },

  setLastActivity(act) {
    const st = this.getActiveState();
    st.lastActivity = { ...act, timestamp: new Date().toISOString() };
    this.save();
  },

  exportBackup() {
    const json = this.exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const prof = this.getActiveProfile();
    const slug = (prof?.name || 'estudante').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.href = url;
    a.download = `backup-meu-enem-${slug}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  },

  importBackupText(rawStr) {
    return this.importBackupJson(rawStr);
  },

  createProfile(name, goal = '', pace = 'medio', apiKey = '') {
    const cleanName = String(name || '').trim() || 'Estudante';
    const id = 'prof_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
    const profile = {
      id,
      name: cleanName,
      goal: String(goal || '').trim(),
      pace: ['curto', 'medio', 'livre'].includes(pace) ? pace : 'medio',
      apiKey: String(apiKey || '').trim(),
      createdAt: new Date().toISOString()
    };
    this.data.profiles.push(profile);
    if (this._guestState && this.data.profiles.length === 1) {
      this.data.profileStates[id] = this._guestState;
      this._guestState = null;
    } else {
      this.ensureProfileState(id);
    }
    this.data.activeProfileId = id;
    if (profile.apiKey && window.aiService?.setApiKey) {
      window.aiService.setApiKey(profile.apiKey);
    }
    this.save();
    return profile;
  },

  updateActiveProfile(name, goal, pace, apiKey) {
    const prof = this.getActiveProfile();
    if (!prof) return null;
    if (name !== undefined && String(name).trim()) prof.name = String(name).trim();
    if (goal !== undefined) prof.goal = String(goal).trim();
    if (pace && ['curto', 'medio', 'livre'].includes(pace)) prof.pace = pace;
    if (apiKey !== undefined) {
      prof.apiKey = String(apiKey).trim();
      if (window.aiService?.setApiKey) {
        window.aiService.setApiKey(prof.apiKey);
      }
    }
    this.save();
    return prof;
  },

  switchProfile(profileId) {
    const target = this.data.profiles.find(p => p.id === profileId);
    if (!target) return false;
    this.data.activeProfileId = target.id;
    this.ensureProfileState(target.id);
    if (target.apiKey && window.aiService?.setApiKey) {
      window.aiService.setApiKey(target.apiKey);
    }
    this.save();
    return true;
  },

  deleteProfile(profileId) {
    if (!profileId || !this.data || !Array.isArray(this.data.profiles) || this.data.profiles.length <= 1) return false;
    this.data.profiles = this.data.profiles.filter(p => p.id !== profileId);
    if (this.data.profileStates) {
      delete this.data.profileStates[profileId];
    }
    if (this.data.activeProfileId === profileId) {
      this.data.activeProfileId = this.data.profiles[0]?.id || null;
    }
    this.save();
    return true;
  },

  toggleEditMode() {
    this.editMode = !this.editMode;
    return this.editMode;
  },

  getSiteTexts() {
    const texts = { ...DEFAULT_SITE_TEXTS, ...(this.data?.cms?.siteTexts || {}) };
    if (!texts.homeSubtitle || texts.homeSubtitle.includes('Todo o seu material mastigado')) {
      texts.homeSubtitle = DEFAULT_SITE_TEXTS.homeSubtitle;
    }
    return texts;
  },

  updateSiteTexts(partial) {
    this.data.cms.siteTexts = { ...this.getSiteTexts(), ...partial };
    this.save();
  },

  getCountdown() {
    const c = { ...DEFAULT_COUNTDOWN, ...(this.data?.cms?.countdown || {}) };
    if (!c.quote || c.quote.includes('Cada dia de foco')) {
      c.quote = DEFAULT_COUNTDOWN.quote;
      c.message = DEFAULT_COUNTDOWN.message;
    }
    return c;
  },

  updateCountdown(partial) {
    if (!this.data.cms) this.data.cms = {};
    if (!this.data.cms.countdown) this.data.cms.countdown = {};
    const norm = { ...partial };
    if (norm.title !== undefined) norm.label = norm.title;
    if (norm.label !== undefined) norm.title = norm.label;
    if (norm.quote !== undefined) norm.message = norm.quote;
    if (norm.message !== undefined) norm.quote = norm.message;
    this.data.cms.countdown = { ...this.getCountdown(), ...norm };
    this.save();
  },

  exportBackupJson() {
    const active = this.getActiveProfile();
    return JSON.stringify({
      app: 'meu-enem-v5-cms',
      exportedAt: new Date().toISOString(),
      activeProfileName: active ? active.name : null,
      storage: this.data
    }, null, 2);
  },

  importBackupJson(rawStr) {
    try {
      const parsed = JSON.parse(rawStr);
      const incoming = parsed.storage || parsed;
      if (!incoming || typeof incoming !== 'object') {
        return { ok: false, msg: 'Arquivo JSON inválido.' };
      }
      this.data = incoming;
      this.init();
      return { ok: true };
    } catch (e) {
      return { ok: false, msg: e.message || 'Erro ao ler JSON.' };
    }
  },

  resetToDefaults() {
    const keptProfiles = Array.isArray(this.data?.profiles) && this.data.profiles.length > 0
      ? this.data.profiles
      : [{ id: 'prof_default', name: 'Estudante', goal: '', pace: 'medio', createdAt: new Date().toISOString() }];
    const keptActiveId = this.data?.activeProfileId || keptProfiles[0].id;
    this.data = {
      version: 5,
      activeProfileId: keptActiveId,
      profiles: keptProfiles,
      profileStates: {},
      cms: createDefaultCmsState()
    };
    this.ensureProfileState(keptActiveId);
    this._guestState = null;
    this.save();
  }
};

window.storageService = storageService;

/* ══════════════════════════════════════════════════════════════════════════
   4. ÁRVORE DINÂMICA DO CATÁLOGO (MATÉRIAS → ASSUNTOS → BLOCOS → TÓPICOS)
   ══════════════════════════════════════════════════════════════════════════ */
function getEffectiveSubjects() {
  const cms = storageService.data.cms;
  const deleted = cms.deletedSubjectIds || [];
  const map = new Map();

  DEFAULT_SUBJECTS_META.forEach(s => {
    if (!deleted.includes(s.id)) {
      map.set(s.id, { ...s, ...(cms.customSubjects[s.id] || {}) });
    }
  });

  Object.values(cms.customSubjects || {}).forEach(s => {
    if (s && s.id && !deleted.includes(s.id) && !map.has(s.id)) {
      map.set(s.id, { ...s });
    }
  });

  let list = Array.from(map.values());
  if (Array.isArray(cms.subjectsOrder) && cms.subjectsOrder.length > 0) {
    const orderIdx = id => {
      const i = cms.subjectsOrder.indexOf(id);
      return i === -1 ? 9999 : i;
    };
    list.sort((a, b) => orderIdx(a.id) - orderIdx(b.id));
  }
  return list;
}

function getAllModules() {
  const cms = storageService.data.cms;
  const deletedMods = cms.deletedModuleIds || [];
  const deletedSubjects = cms.deletedSubjectIds || [];
  const subjectsMap = new Map(getEffectiveSubjects().map(s => [s.id, s]));

  const rawBase = getRawBaseModules();
  const modMap = new Map();

  rawBase.forEach(m => {
    if (deletedMods.includes(m.id) || deletedSubjects.includes(m.materiaId)) return;
    const customM = cms.customModules[m.id] || {};
    const subj = subjectsMap.get(m.materiaId);
    modMap.set(m.id, {
      ...m,
      ...customM,
      materia: subj ? subj.nome : (customM.materia || m.materia),
      blocos: buildEffectiveBlocksForModule(m.id, customM.blocos || m.blocos || [])
    });
  });

  Object.values(cms.customModules || {}).forEach(m => {
    if (!m || !m.id || deletedMods.includes(m.id) || deletedSubjects.includes(m.materiaId)) return;
    if (!modMap.has(m.id)) {
      const subj = subjectsMap.get(m.materiaId);
      modMap.set(m.id, {
        ...m,
        materia: subj ? subj.nome : (m.materia || 'Matéria'),
        blocos: buildEffectiveBlocksForModule(m.id, m.blocos || [])
      });
    }
  });

  let list = Array.from(modMap.values());
  if (Array.isArray(cms.modulesOrder) && cms.modulesOrder.length > 0) {
    const orderIdx = id => {
      const i = cms.modulesOrder.indexOf(id);
      return i === -1 ? 9999 : i;
    };
    list.sort((a, b) => orderIdx(a.id) - orderIdx(b.id));
  }
  return list;
}

function buildEffectiveBlocksForModule(modId, baseBlocks) {
  const cms = storageService.data.cms;
  const cfg = cms.customBlocksByModule[modId] || {};
  const deletedIds = cfg.deletedIds || [];
  const overrides = cfg.overrides || {};
  const added = cfg.added || [];

  const combined = [
    ...(baseBlocks || []).filter(b => !deletedIds.includes(b.id)).map(b => ({
      ...b,
      ...(overrides[b.id] || {})
    })),
    ...added.filter(b => !deletedIds.includes(b.id)).map(b => ({
      ...b,
      ...(overrides[b.id] || {})
    }))
  ];

  if (Array.isArray(cfg.order) && cfg.order.length > 0) {
    const idxOf = id => {
      const i = cfg.order.indexOf(id);
      return i === -1 ? 9999 : i;
    };
    combined.sort((a, b) => idxOf(a.id) - idxOf(b.id));
  }

  return combined.map((blk, index) => ({
    ...blk,
    ordem: index + 1,
    habilidades: buildEffectiveTopicsForBlock(modId, blk)
  }));
}

function buildEffectiveTopicsForBlock(modId, blk) {
  const cms = storageService.data.cms;
  const key = `${modId}__${blk.id}`;
  const cfg = cms.customTopicsByBlock[key] || {};
  const deletedIds = cfg.deletedIds || [];
  const added = cfg.added || [];

  const combined = [
    ...(blk.habilidades || []).filter(h => !deletedIds.includes(h.id)),
    ...added.filter(h => !deletedIds.includes(h.id))
  ];

  if (Array.isArray(cfg.order) && cfg.order.length > 0) {
    const idxOf = id => {
      const i = cfg.order.indexOf(id);
      return i === -1 ? 9999 : i;
    };
    combined.sort((a, b) => idxOf(a.id) - idxOf(b.id));
  }

  return combined;
}

function getModuleById(moduleId) {
  return getAllModules().find(m => m.id === moduleId) || getAllModules()[0] || null;
}

function resolveTopicByKey(topicKey) {
  if (!topicKey) return null;
  const cleanTarget = String(topicKey).replace(/_bloco_(\d+)_/, '_bloco$1_');
  for (const mod of getAllModules()) {
    for (const blk of (mod.blocos || [])) {
      for (const hab of (blk.habilidades || [])) {
        const canonical = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const alt = buildAltTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        if (canonical === cleanTarget || alt === topicKey || canonical === topicKey) {
          return { topicKey: canonical, altKey: alt, mod, blk, hab };
        }
      }
    }
  }
  return null;
}

function getEffectiveTopicData(topicKey) {
  const resolved = resolveTopicByKey(topicKey);
  if (!resolved) return null;
  const { mod, blk, hab, topicKey: canonical } = resolved;
  const baseRes = getBaseTopicResourcesFromGlobals(mod.materiaId, mod.assuntoId, blk.id, hab.id, hab, blk);
  const custom = storageService.data.cms.topicsData[canonical] || {};

  const titulo = custom.titulo || hab.nome;
  const foco = custom.foco !== undefined ? custom.foco : baseRes.foco;
  const preRequisito = custom.preRequisito !== undefined ? custom.preRequisito : (baseRes.preRequisito || mod.preRequisito || '');
  const resumo = custom.resumo !== undefined ? custom.resumo : (blk.resumo || '');
  const resumoImage = custom.resumoImage || '';
  const videos = Array.isArray(custom.videos)
    ? custom.videos.filter(v => v && v.url && !String(v.url).includes('youtube.com/results'))
    : baseRes.videos;
  const sites = Array.isArray(custom.sites) ? custom.sites : baseRes.sites;
  let questoesEnem = baseRes.questoesEnem || [];
  if (Array.isArray(custom.questoesEnem) && custom.questoesEnem.length > 0) {
    questoesEnem = custom.questoesEnem.map(cq => {
      const bq = (baseRes.questoesEnem || []).find(b => b && b.id === cq.id);
      if (bq) {
        return {
          ...cq,
          correta: bq.correta,
          resolucao: bq.resolucao,
          enunciado: bq.enunciado || cq.enunciado,
          alternativas: bq.alternativas || cq.alternativas,
          ano: bq.ano || cq.ano,
          contexto: bq.contexto || cq.contexto
        };
      }
      return cq;
    });
  }

  return {
    topicKey: canonical,
    mod,
    blk,
    hab,
    titulo,
    foco,
    preRequisito,
    resumo,
    resumoImage,
    videos,
    sites,
    questoesEnem
  };
}
window.getEffectiveTopicData = getEffectiveTopicData;

function saveTopicCustomData(topicKey, mutatorOrPartial) {
  const eff = getEffectiveTopicData(topicKey);
  if (!eff) return;
  const canonical = eff.topicKey;
  const prev = storageService.data.cms.topicsData[canonical] || {};
  const draft = {
    titulo: prev.titulo !== undefined ? prev.titulo : eff.titulo,
    foco: prev.foco !== undefined ? prev.foco : eff.foco,
    resumo: prev.resumo !== undefined ? prev.resumo : eff.resumo,
    resumoImage: prev.resumoImage !== undefined ? prev.resumoImage : eff.resumoImage,
    videos: Array.isArray(prev.videos) ? prev.videos.slice() : eff.videos.slice(),
    sites: Array.isArray(prev.sites) ? prev.sites.slice() : eff.sites.slice(),
    questoesEnem: Array.isArray(prev.questoesEnem) ? prev.questoesEnem.slice() : eff.questoesEnem.slice()
  };
  if (typeof mutatorOrPartial === 'function') {
    mutatorOrPartial(draft);
  } else if (mutatorOrPartial && typeof mutatorOrPartial === 'object') {
    Object.assign(draft, mutatorOrPartial);
  }
  storageService.data.cms.topicsData[canonical] = draft;
  storageService.save();
}

function getBlockCmsConfig(modId) {
  const cms = storageService.getCms();
  if (!cms.customBlocksByModule[modId]) {
    cms.customBlocksByModule[modId] = { order: [], deletedIds: [], overrides: {}, added: [] };
  }
  const cfg = cms.customBlocksByModule[modId];
  if (!cfg.order) cfg.order = [];
  if (!cfg.deletedIds) cfg.deletedIds = [];
  if (!cfg.overrides) cfg.overrides = {};
  if (!cfg.added) cfg.added = [];
  return cfg;
}

function getTopicCmsConfig(modId, blkId) {
  const cms = storageService.getCms();
  const key = `${modId}__${blkId}`;
  if (!cms.customTopicsByBlock[key]) {
    cms.customTopicsByBlock[key] = { order: [], deletedIds: [], added: [] };
  }
  const cfg = cms.customTopicsByBlock[key];
  if (!cfg.order) cfg.order = [];
  if (!cfg.deletedIds) cfg.deletedIds = [];
  if (!cfg.added) cfg.added = [];
  return cfg;
}

/* Status Simples e Direto de Estudo do Tópico (Sem Diagnóstico) */
function getTopicStudyStatus(topicKey) {
  const eff = getEffectiveTopicData(topicKey);
  if (!eff) return { status: 'pending', label: 'A estudar', badgeCls: 'neutral', enemDone: 0, enemCorrect: 0, enemTotal: 0 };
  const st = storageService.getActiveState();
  const tProg = st.topicProgress?.[eff.topicKey] || {};
  const inList = (st.studyList || []).find(i => i.topicKey === eff.topicKey);

  const enemQs = eff.questoesEnem || [];
  const ansMap = tProg.enemAnswers || {};
  const checked = enemQs.filter(q => ansMap[q.id]?.checked);
  const correct = checked.filter(q => ansMap[q.id]?.selected === q.correta);

  if (tProg.completed || (inList && inList.status === 'Concluído')) {
    return {
      status: 'completed',
      label: '✓ Concluído',
      badgeCls: 'mastered',
      enemDone: checked.length,
      enemCorrect: correct.length,
      enemTotal: enemQs.length
    };
  }

  if (inList && inList.status === 'Revisar') {
    return {
      status: 'review',
      label: '↻ Revisar',
      badgeCls: 'insufficient',
      enemDone: checked.length,
      enemCorrect: correct.length,
      enemTotal: enemQs.length
    };
  }

  if (tProg.readSummary || checked.length > 0 || (inList && inList.status === 'Em andamento')) {
    return {
      status: 'in_progress',
      label: '◐ Em estudo',
      badgeCls: 'partial',
      enemDone: checked.length,
      enemCorrect: correct.length,
      enemTotal: enemQs.length
    };
  }

  return {
    status: 'pending',
    label: 'Não iniciado',
    badgeCls: 'neutral',
    enemDone: 0,
    enemCorrect: 0,
    enemTotal: enemQs.length
  };
}

function addSkillToStudyList(topicKey, optsOrOrigin = 'Biblioteca', priorityArg = 'Média', statusArg = 'A estudar') {
  let origin = 'Biblioteca';
  let priority = priorityArg;
  let status = statusArg;
  if (optsOrOrigin && typeof optsOrOrigin === 'object') {
    origin = optsOrOrigin.origin || 'Biblioteca';
    priority = optsOrOrigin.priority || 'Média';
    status = optsOrOrigin.status || 'A estudar';
  } else if (typeof optsOrOrigin === 'string') {
    origin = optsOrOrigin;
  }
  const eff = getEffectiveTopicData(topicKey);
  if (!eff) return { added: false };
  const st = storageService.getActiveState();
  const existing = st.studyList.find(i => i.topicKey === eff.topicKey);
  if (existing) {
    existing.status = status;
    existing.priority = priority;
    existing.title = eff.titulo;
    existing.subtitle = `${eff.mod.materia} · ${eff.mod.assunto} · Bloco ${eff.blk.ordem}`;
    storageService.save();
    return { added: false, item: existing };
  }
  const newItem = {
    id: 'st_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
    topicKey: eff.topicKey,
    moduleId: eff.mod.id,
    materiaId: eff.mod.materiaId,
    materia: eff.mod.materia,
    assunto: eff.mod.assunto,
    blockId: eff.blk.id,
    skillId: eff.hab.id,
    title: eff.titulo,
    subtitle: `${eff.mod.materia} · ${eff.mod.assunto} · Bloco ${eff.blk.ordem}: ${eff.blk.titulo}`,
    origin,
    status,
    priority,
    addedAt: new Date().toISOString()
  };
  st.studyList.push(newItem);
  storageService.save();
  return { added: true, item: newItem };
}

function toggleCompleteTopic(topicKey) {
  const eff = getEffectiveTopicData(topicKey);
  if (!eff) return false;
  const st = storageService.getActiveState();
  if (!st.topicProgress[eff.topicKey]) st.topicProgress[eff.topicKey] = { enemAnswers: {} };
  const nextVal = !st.topicProgress[eff.topicKey].completed;
  st.topicProgress[eff.topicKey].completed = nextVal;
  st.topicProgress[eff.topicKey].updatedAt = new Date().toISOString();

  const inList = st.studyList.find(i => i.topicKey === eff.topicKey);
  if (nextVal) {
    if (inList) inList.status = 'Concluído';
    else addSkillToStudyList(eff.topicKey, 'Concluído no Estudo', 'Baixa', 'Concluído');
  } else if (inList && inList.status === 'Concluído') {
    inList.status = 'Em andamento';
  }
  storageService.save();
  return nextVal;
}

/* ══════════════════════════════════════════════════════════════════════════
   5. CABEÇALHO LIMPO (4 ABAS) + MENU DE 3 BARRINHAS (☰ HAMBÚRGUER LATERAL)
   ══════════════════════════════════════════════════════════════════════════ */
let activeTopModal = null;    // null | 'new-profile' | 'edit-profile'
let activeEditorModal = null; // null | { type, ... }

function getPaceLabel(pace) {
  if (pace === 'curto') return 'Sessões curtas (10–15 min)';
  if (pace === 'medio') return 'Sessões médias (25–30 min)';
  return 'Ritmo livre';
}

window.header = function() {
  const prof = storageService.getActiveProfile();
  const st = storageService.getActiveState();
  const texts = storageService.getSiteTexts();
  const isEdit = storageService.editMode;
  const curArea = st.activeArea || 'home';
  const activeListCount = (st.studyList || []).filter(i => i.status !== 'Concluído').length;
  const cdStats = getCountdownStats();

  return `
    <header class="topbar main-navbar">
      <div class="brand-wrap">
        <a class="brand" href="#" data-main-nav="home">
          <span class="brand-mark">✳</span>${esc(texts.brandTitle)}
        </a>
        ${isEdit ? `
          <button type="button" class="cms-inline-edit-btn" data-cms-open="edit-site-texts" title="Editar nome do site e textos principais">
            ✏️ Editar Textos
          </button>
        ` : ''}
      </div>

      <nav class="nav main-nav-links" aria-label="Navegação principal">
        <a href="#" data-main-nav="home" class="main-nav-item ${curArea === 'home' ? 'active' : ''}">
          🏠 Início
        </a>
        <a href="#" data-main-nav="diagnostics" class="main-nav-item ${curArea === 'diagnostics' ? 'active' : ''}">
          🎯 Diagnóstico IA
        </a>
        <a href="#" data-main-nav="library" class="main-nav-item ${curArea === 'library' ? 'active' : ''}">
          📚 Biblioteca de Estudos
        </a>
        <a href="#" data-main-nav="my-list" class="main-nav-item ${curArea === 'my-list' ? 'active' : ''}">
          📌 Minha Lista ${activeListCount > 0 ? `<span class="nav-count-pill">${activeListCount}</span>` : ''}
        </a>
        <a href="#" data-main-nav="progression" class="main-nav-item ${curArea === 'progression' ? 'active' : ''}">
          📈 Progressão
        </a>
      </nav>

      <div class="header-right-Menu">
        ${isEdit ? `
          <button type="button" class="edit-mode-toggle edit-mode-on" data-toggle-edit-mode="1" title="Clique para desativar o Modo Edição">
            ✓ Edição Ativa
          </button>
        ` : ''}
        <button type="button" class="hamburger-btn ${storageService.drawerOpen ? 'active' : ''}" data-toggle-drawer="1" aria-label="Abrir menu de configurações e perfil" title="Menu: Perfil, Modo Edição, Backup e Configurações">
          <span class="hamburger-bars" aria-hidden="true">☰</span>
          <span class="hamburger-label">Menu</span>
        </button>
      </div>
    </header>

    ${isEdit ? `
      <div class="edit-mode-banner" role="status">
        <span>✏️ <strong>Modo Edição Ativo:</strong> Todas as suas alterações (textos, matérias, vídeos, links, imagens e questões) são salvas automaticamente neste computador.</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="secondary ob-btn-sm" data-cms-open="add-subject">+ Nova Matéria</button>
          <button type="button" class="secondary ob-btn-sm" data-cms-open="add-block">+ Novo Bloco</button>
          <button type="button" class="secondary ob-btn-sm" data-cms-open="edit-site-texts">✏️ Textos do Site</button>
          <button type="button" class="secondary ob-btn-sm" data-cms-open="edit-countdown">⏳ Editar Contador ENEM</button>
          <button type="button" class="secondary ob-btn-sm" data-profile-action="save-folder-file">💾 Salvar na Pasta do PC</button>
          <button type="button" class="ob-action-pill ob-btn-sm ob-icon-del" data-profile-action="reset-defaults">↺ Restaurar Padrões Originais</button>
          <button type="button" class="primary ob-btn-sm" data-toggle-edit-mode="1">✓ Concluir Edição</button>
        </div>
      </div>
    ` : ''}

    ${storageService.drawerOpen ? renderHamburgerDrawer() : ''}
  `;
};

function renderHamburgerDrawer() {
  const prof = storageService.getActiveProfile();
  const profiles = storageService.getProfiles();
  const isEdit = storageService.editMode;
  const cdStats = getCountdownStats();

  const profilesListHtml = profiles.map(p => {
    const isAct = prof && prof.id === p.id;
    const initial = (p.name || 'E').trim().charAt(0).toUpperCase();
    const paceLabel = getPaceLabel(p.pace);
    const dateFormatted = p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';

    return `
      <div class="drawer-prof-item ${isAct ? 'active' : ''}">
        <div class="drawer-prof-avatar">${esc(initial)}</div>
        <div class="drawer-prof-info">
          <div class="drawer-prof-title-row">
            <strong>${esc(p.name)}</strong>
            ${isAct ? `<span class="op-badge mastered" style="font-size:10px;padding:2px 7px;font-weight:700">✓ Ativo</span>` : ''}
          </div>
          <small class="drawer-prof-meta">
            ${p.goal ? `🎯 ${esc(p.goal)} · ` : ''}⚡ ${esc(paceLabel)}
            ${dateFormatted ? ` · desde ${dateFormatted}` : ''}
          </small>
        </div>
        <div class="drawer-prof-actions">
          ${isAct ? `
            <button type="button" class="secondary ob-btn-sm" data-profile-action="open-edit-profile" title="Editar nome, meta e ritmo deste perfil">✏️ Editar</button>
          ` : `
            <button type="button" class="primary ob-btn-sm" data-profile-switch-id="${esc(p.id)}" title="Alternar para este perfil">Usar</button>
            ${profiles.length > 1 ? `
              <button type="button" class="ob-icon-btn ob-icon-del" data-profile-delete-id="${esc(p.id)}" title="Excluir este perfil secundário">🗑️</button>
            ` : ''}
          `}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="drawer-overlay-wrap">
      <div class="drawer-backdrop" data-close-drawer="1"></div>
      <aside class="drawer-panel" role="dialog" aria-label="Menu de Configurações">
        <div class="drawer-header">
          <div>
            <div class="eyebrow">Menu e Configurações</div>
            <h3 style="margin:2px 0 0;font-size:19px">Olá, ${esc(prof?.name || 'Estudante')}!</h3>
          </div>
          <button type="button" class="ob-icon-btn" data-close-drawer="1" title="Fechar menu">✕</button>
        </div>

        <div class="drawer-section">
          <div class="eyebrow" style="margin-bottom:8px">🧭 Navegação Rápida</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
            <button type="button" class="secondary ob-btn-sm" data-main-nav="home" style="justify-content:flex-start">🏠 Início</button>
            <button type="button" class="secondary ob-btn-sm" data-main-nav="diagnostics" style="justify-content:flex-start">🎯 Diagnóstico IA</button>
            <button type="button" class="secondary ob-btn-sm" data-main-nav="library" style="justify-content:flex-start">📚 Biblioteca</button>
            <button type="button" class="secondary ob-btn-sm" data-main-nav="my-list" style="justify-content:flex-start">📌 Minha Lista</button>
            <button type="button" class="secondary ob-btn-sm" data-main-nav="notes" style="justify-content:flex-start;grid-column:span 2">📓 Caderno de Anotações</button>
            <button type="button" class="secondary ob-btn-sm" data-main-nav="progression" style="justify-content:flex-start;grid-column:span 2">📈 Progresso Geral</button>
          </div>
        </div>

        <div class="drawer-section">
          <div class="eyebrow" style="margin-bottom:8px">⏳ Contagem Regressiva do ENEM</div>
          <div class="drawer-cd-card" style="padding:14px;background:#ffffff;border:1px solid var(--line);border-radius:12px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
              <div>
                <strong style="color:var(--green);font-size:15px;display:block">⏳ ${esc(cdStats.labelText)}</strong>
                <p style="margin:4px 0 0;font-size:12px;color:var(--muted)">"${esc(cdStats.message)}"</p>
              </div>
              ${isEdit ? `
                <button type="button" class="secondary ob-btn-sm" data-cms-open="edit-countdown" title="Editar contador e mensagem">
                  ✏️ Editar
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="drawer-section">
          <div class="eyebrow" style="margin-bottom:8px">✏️ Sistema 100% Editável (CMS)</div>
          <div class="drawer-edit-card ${isEdit ? 'on' : ''}">
            <div>
              <strong>Modo Edição ${isEdit ? '(Ativo)' : '(Inativo)'}</strong>
              <p>Permite criar e editar matérias, assuntos, introduções, blocos, vídeos, links com miniatura e questões do ENEM.</p>
            </div>
            <button type="button" class="${isEdit ? 'primary' : 'secondary'} ob-btn-sm" data-toggle-edit-mode="1">
              ${isEdit ? '✓ Concluir / Desativar Modo Edição' : '✏️ Ativar Modo Edição'}
            </button>
          </div>
        </div>

        <div class="drawer-section">
          <div class="eyebrow" style="margin-bottom:8px">🤖 Tutor com Inteligência Artificial (Google Gemini)</div>
          <div style="padding:14px;background:#ffffff;border:1px solid var(--line);border-radius:12px">
            <div style="font-size:12.5px;color:var(--text);margin-bottom:8px">
              Status da Chave: <strong>${(window.aiService?.hasApiKey?.() ? '✅ Chave Pronta e Configurada' : '⚠️ Nenhuma chave informada')}</strong>
            </div>
            <label style="font-size:11.5px;font-weight:600;display:block;margin-bottom:6px">Chave da API Gemini (ou configure no arquivo ai-service.js):</label>
            <div style="display:flex;gap:8px">
              <input type="password" id="drawer-gemini-key" value="${esc(window.aiService?.getApiKey?.() || '')}" placeholder="Cole sua chave AIzaSy..." style="font-size:12px;flex:1;padding:6px 10px;border:1px solid #d1d5db;border-radius:6px">
              <button type="button" class="primary ob-btn-sm" data-ai-save-key-input="drawer-gemini-key">Salvar</button>
            </div>
            <small style="display:block;margin-top:6px;font-size:11px;color:var(--muted)">
              Dica: Você pode colar sua chave diretamente no código no arquivo <code>ai-service.js</code> na linha <code>const GEMINI_API_KEY = "..."</code>.
            </small>
            <div style="margin-top:12px;display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px dashed #e5e7eb">
              <div>
                <strong style="font-size:12px;color:var(--text);display:block">🤖 Mascote Flutuante (Pet Bot)</strong>
                <small style="color:var(--muted);font-size:11px">Mascote arrastável e interativo com dicas do ENEM.</small>
              </div>
              <button type="button" class="secondary ob-btn-sm" data-toggle-pet-bot="1">
                ${storageService.petBotActive !== false ? '🟢 Ativo' : '⚪ Oculto'}
              </button>
            </div>
          </div>
        </div>

        <div class="drawer-section">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <div class="eyebrow" style="margin:0">👤 Perfis de Estudo (${profiles.length})</div>
            <button type="button" class="primary ob-btn-sm" data-profile-action="open-new-profile">+ Novo Perfil</button>
          </div>
          <div class="drawer-prof-list">
            ${profilesListHtml}
          </div>
          <div style="margin-top:10px;padding:9px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;font-size:11.5px;color:#166534;line-height:1.45">
            🔒 <strong>Seus Conteúdos são Fixos e Globais:</strong> Todas as matérias criadas, aulas e resumos que você cadastrou no Modo Edição são fixos no site. <strong>Trocar ou criar perfis NUNCA apaga ou altera suas edições!</strong>
          </div>
        </div>

        <div class="drawer-section">
          <div class="eyebrow" style="margin-bottom:8px">💾 Salvamento no Computador e Restauração</div>
          <p style="font-size:12px;color:var(--muted);margin:0 0 10px">
            Suas edições, vídeos, links e imagens já ficam salvos automaticamente no navegador deste computador. Você também pode salvar um arquivo direto na pasta do projeto:
          </p>
          <div style="display:grid;gap:8px">
            <button type="button" class="primary ob-btn-sm" data-profile-action="save-folder-file">
              💾 Salvar Arquivo Direto na Pasta do PC (.JSON)
            </button>
            <button type="button" class="secondary ob-btn-sm" data-profile-action="download-json">
              ⬇ Baixar Cópia de Backup (.JSON)
            </button>
            <div class="drawer-import-box">
              <label style="font-size:11.5px;font-weight:600;display:block;margin-bottom:6px">⬆ Carregar / Importar Arquivo Salvo (.JSON)</label>
              <input type="file" id="ob-import-file-input" accept=".json,application/json" style="font-size:11.5px;width:100%;margin-bottom:8px">
              <button type="button" class="secondary ob-btn-sm" style="width:100%" data-profile-action="upload-json">
                Carregar arquivo selecionado
              </button>
            </div>
            <button type="button" class="ob-action-pill ob-btn-sm ob-icon-del" style="justify-self:start;margin-top:6px;padding:8px 12px" data-profile-action="reset-defaults">
              ↺ Restaurar padrões originais de fábrica
            </button>
          </div>
        </div>
      </aside>
    </div>
  `;
}

window.layout = function(body) {
  const mustOnboard = !storageService.getActiveProfile();
  const topModalHtml = mustOnboard
    ? renderOnboardingModal(true)
    : activeTopModal === 'new-profile'
      ? renderOnboardingModal(false)
      : activeTopModal === 'edit-profile'
        ? renderEditProfileModal()
        : '';

  const editorModalHtml = activeEditorModal ? renderCmsModal(activeEditorModal) : '';
  const footerHtml = typeof footer === 'function' ? footer() : `
    <footer class="footer" style="margin-top:40px;padding:24px 0;border-top:1px solid var(--line);text-align:center;font-size:12.5px;color:var(--muted)">
      <span><strong>Meu ENEM</strong> · Plataforma de Estudos Diretos e Personalizados</span>
    </footer>
  `;

  app.innerHTML = `
    <div class="shell">
      ${window.header()}
      <main id="main-content">${body}</main>
      ${footerHtml}
    </div>
    ${topModalHtml}
    ${editorModalHtml}
    <div class="toast" role="status" aria-live="polite"></div>
  `;

  syncAiChatWidget();
  syncFloatingPetBot();
  setTimeout(() => {
    document.querySelectorAll('.notion-block-input').forEach(ta => {
      if (ta.tagName === 'TEXTAREA') {
        ta.style.height = 'auto';
        ta.style.height = Math.max(34, ta.scrollHeight) + 'px';
      }
    });
  }, 20);
};

/* ══════════════════════════════════════════════════════════════════════════
   5.5 WIDGET E COMPONENTES DO TUTOR IA (GOOGLE GEMINI)
   ══════════════════════════════════════════════════════════════════════════ */
function renderAiChatWidget() {
  const hasKey = window.aiService && typeof window.aiService.hasApiKey === 'function' ? window.aiService.hasApiKey() : false;
  const history = window.aiService?.chatHistory || [];
  const isOpen = storageService.aiChatOpen;
  const isLoading = storageService.aiLoading;
  const aiError = storageService.aiError;

  const st = storageService.getActiveState();
  let currentTopicLabel = 'Geral (ENEM 2026)';
  if (st.subView === 'topic-study' && st.activeTopicKey) {
    const eff = getEffectiveTopicData(st.activeTopicKey);
    if (eff) currentTopicLabel = `${eff.mod.materia} → ${eff.titulo}`;
  }

  const fabHtml = `
    <button type="button" class="ai-fab-btn ${isOpen ? 'active' : ''}" data-toggle-ai-chat="1" title="Tutor IA ENEM — Dúvidas e Explicações">
      <span>✨</span>
      <span>${isOpen ? 'Fechar Tutor IA' : 'Tutor IA'}</span>
    </button>
  `;

  if (!isOpen) return fabHtml;

  const messagesHtml = history.map(item => {
    if (item.role === 'user') {
      return `<div class="ai-bubble ai-bubble-user">${esc(item.text)}</div>`;
    }
    return `<div class="ai-bubble ai-bubble-model">${renderMarkdownSummary(item.text)}</div>`;
  }).join('');

  const quickChips = [
    { label: '💡 Explique o tema de forma simples', text: `Pode me explicar os conceitos essenciais de ${currentTopicLabel} com uma linguagem simples e analogias do cotidiano?` },
    { label: '🎯 Qual é a pegadinha clássica no ENEM?', text: `Quais são as principais pegadinhas e distratores que o ENEM costuma colocar nas questões sobre ${currentTopicLabel}?` },
    { label: '📝 Crie um macete / mnemônico', text: `Crie um macete ou frase mnemônica divertida para me ajudar a memorizar o conteúdo de ${currentTopicLabel}.` },
    { label: '🧪 Dê um exemplo prático do dia a dia', text: `Como o conceito de ${currentTopicLabel} se aplica na vida real ou em fatos do cotidiano?` }
  ];

  const quickChipsHtml = `
    <div class="ai-quick-chips-box">
      <span>Sugestões Rápidas:</span>
      <div class="ai-quick-chips-grid">
        ${quickChips.map(c => `
          <button type="button" class="ai-chip-btn" data-ai-quick-prompt="${esc(c.text)}">
            ${esc(c.label)}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  const noKeyAlertHtml = !hasKey ? `
    <div class="ai-no-key-alert">
      <strong>⚠️ Chave da API Google Gemini não configurada:</strong>
      <p style="margin:4px 0 8px;font-size:11.5px">
        Cole sua chave no arquivo <code>ai-service.js</code> (na linha <code>const GEMINI_API_KEY = "..."</code>) ou salve-a diretamente abaixo:
      </p>
      <div style="display:flex;gap:6px">
        <input type="password" id="ai-modal-key-input" placeholder="Cole sua chave AIzaSy..." style="font-size:11.5px;flex:1;padding:6px;border:1px solid #d1d5db;border-radius:6px">
        <button type="button" class="primary ob-btn-sm" data-ai-save-key-input="ai-modal-key-input">Salvar</button>
      </div>
    </div>
  ` : '';

  return `
    ${fabHtml}
    <aside class="ai-chat-panel" role="dialog" aria-label="Tutor IA ENEM">
      <div class="ai-chat-header">
        <div class="ai-chat-title-group">
          <strong>✨ Professora IA ENEM</strong>
          <small>Tire dúvidas, peça macetes e explicações</small>
        </div>
        <div class="ai-chat-header-actions">
          <button type="button" class="ai-chat-hdr-btn" data-toggle-pet-bot="1" title="Ativar/Ocultar Mascote RobÃ´ IA">ðŸ¤– Pet Bot</button>
          <button type="button" class="ai-chat-hdr-btn" data-clear-ai-chat="1" title="Limpar histórico da conversa">↺ Limpar</button>
          <button type="button" class="ai-chat-hdr-btn" data-close-ai-chat="1" title="Fechar painel da IA">✕</button>
        </div>
      </div>

      <div class="ai-chat-context-pill">
        📍 Contexto: <strong>${esc(currentTopicLabel)}</strong>
      </div>
      ${storageService.petBotActive !== false ? `
        <div class="ai-pet-bot-bar" data-pet-bot-click="1" title="Clique no Mascote RobÃ´ para receber uma dica rÃ¡pida!">
          <div class="ai-pet-bot-avatar">
            <svg class="ai-pet-bot-svg ${isLoading ? 'is-thinking' : ''}" viewBox="0 0 64 64" width="42" height="42">
              <line x1="32" y1="14" x2="32" y2="4" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="32" cy="4" r="3.5" fill="#34d399" class="ai-pet-antenna-light"/>
              <rect x="8" y="24" width="4" height="12" rx="2" fill="#047857"/>
              <rect x="52" y="24" width="4" height="12" rx="2" fill="#047857"/>
              <rect x="12" y="14" width="40" height="32" rx="10" fill="#1b4d3e" stroke="#10b981" stroke-width="2"/>
              <rect x="18" y="20" width="28" height="20" rx="6" fill="#06251b"/>
              <ellipse cx="26" cy="29" rx="3" ry="4" fill="#34d399" class="ai-pet-eye left"/>
              <ellipse cx="38" cy="29" rx="3" ry="4" fill="#34d399" class="ai-pet-eye right"/>
              <path d="M 28 35 Q 32 38 36 35" stroke="#34d399" stroke-width="1.8" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="ai-pet-bot-speech">
            <strong style="display:block;font-size:11px;color:#065f46">ðŸ¤– Mascote RobÃ´ Tutor</strong>
            <span id="ai-pet-bot-text" style="font-size:12px;color:#1e4638">
              ${isLoading ? 'Consultando minha rede neural... JÃ¡ te explico!' : esc(storageService.petBotMessage || `Oi! Estou acompanhando vocÃª em ${currentTopicLabel}. Se travar em qualquer questÃ£o, pode perguntar!`)}
            </span>
          </div>
        </div>
      ` : ''}

      <div class="ai-chat-messages" id="ai-chat-messages">
        ${noKeyAlertHtml}

        ${history.length === 0 ? `
          <div class="ai-bubble ai-bubble-model">
            <p><strong>Olá! Eu sou a Professora IA. 👩‍🏫</strong></p>
            <p>Estou aqui para tirar dúvidas das suas videoaulas, explicar termos difíceis, inventar macetes de memorização ou destrinchar questões oficiais do ENEM passo a passo.</p>
            <p style="margin-bottom:0">Como posso te ajudar agora com <strong>${esc(currentTopicLabel)}</strong>?</p>
          </div>
          ${quickChipsHtml}
        ` : `
          ${messagesHtml}
        `}

        ${isLoading ? `
          <div class="ai-bubble ai-bubble-loading">
            <span>⏳</span>
            <span>Professora IA pensando na melhor explicação...</span>
          </div>
        ` : ''}

        ${aiError ? `
          <div class="ai-no-key-alert" style="background:#fee2e2;border-color:#fca5a5;color:#991b1b">
            ${esc(aiError)}
          </div>
        ` : ''}
      </div>

      <div class="ai-chat-input-bar">
        <textarea id="ai-chat-input" placeholder="Tire uma dúvida... (Enter para enviar)" rows="1"></textarea>
        <button type="button" class="primary ob-btn-sm" data-ai-send="1" ${isLoading ? 'disabled' : ''}>
          ${isLoading ? '...' : 'Enviar →'}
        </button>
      </div>
    </aside>
  `;
}

function syncAiChatWidget() {
  let root = document.getElementById('ai-chat-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'ai-chat-root';
    document.body.appendChild(root);
  }

  const isOpen = storageService.aiChatOpen;
  const panel = root.querySelector('.ai-chat-panel');

  if (!isOpen) {
    if (panel || !root.querySelector('.ai-fab-btn')) {
      root.innerHTML = `
        <button type="button" class="ai-fab-btn" data-toggle-ai-chat="1" title="Tutor IA ENEM — Dúvidas e Explicações">
          <span>✨</span>
          <span>Tutor IA</span>
        </button>
      `;
    }
    return;
  }

  const st = storageService.getActiveState();
  let currentTopicLabel = 'Geral (ENEM 2026)';
  if (st.subView === 'topic-study' && st.activeTopicKey) {
    const eff = getEffectiveTopicData(st.activeTopicKey);
    if (eff) currentTopicLabel = `${eff.mod.materia} → ${eff.titulo}`;
  }

  // Se o painel ainda não existe no DOM, renderiza-o pela primeira vez:
  if (!panel) {
    root.innerHTML = renderAiChatWidget();
    const inp = document.getElementById('ai-chat-input');
    if (inp) inp.focus();
    return;
  }

  // Se o painel já existe, ATUALIZA APENAS O CONTEÚDO sem recriar o elemento DOM:
  // Dessa forma a janela fica 100% FIXA, NUNCA PISCA ao clicar fora!
  const pill = panel.querySelector('.ai-chat-context-pill');
  if (pill) {
    pill.innerHTML = `📍 Contexto: <strong>${esc(currentTopicLabel)}</strong>`;
  }

  const fab = root.querySelector('.ai-fab-btn');
  if (fab) {
    fab.classList.add('active');
    const spanText = fab.querySelector('span:last-child');
    if (spanText) spanText.innerText = 'Fechar Tutor IA';
  }

  const msgBox = document.getElementById('ai-chat-messages');
  if (msgBox) {
    const history = window.aiService?.chatHistory || [];
    const isLoading = storageService.aiLoading;
    const aiError = storageService.aiError;
    const hasKey = window.aiService && typeof window.aiService.hasApiKey === 'function' ? window.aiService.hasApiKey() : false;

    const signature = `${history.length}_${isLoading}_${currentTopicLabel}_${aiError || ''}`;
    if (msgBox.dataset.lastSig !== signature) {
      msgBox.dataset.lastSig = signature;

      const messagesHtml = history.map(item => {
        if (item.role === 'user') {
          return `<div class="ai-bubble ai-bubble-user">${esc(item.text)}</div>`;
        }
        return `<div class="ai-bubble ai-bubble-model">${renderMarkdownSummary(item.text)}</div>`;
      }).join('');

      const quickChips = [
        { label: '💡 Explique o tema de forma simples', text: `Pode me explicar os conceitos essenciais de ${currentTopicLabel} com uma linguagem simples e analogias do cotidiano?` },
        { label: '🎯 Qual é a pegadinha clássica no ENEM?', text: `Quais são as principais pegadinhas e distratores que o ENEM costuma colocar nas questões sobre ${currentTopicLabel}?` },
        { label: '📝 Crie um macete / mnemônico', text: `Crie um macete ou frase mnemônica divertida para me ajudar a memorizar o conteúdo de ${currentTopicLabel}.` },
        { label: '🧪 Dê um exemplo prático do dia a dia', text: `Como o conceito de ${currentTopicLabel} se aplica na vida real ou em fatos do cotidiano?` }
      ];

      const quickChipsHtml = `
        <div class="ai-quick-chips-box">
          <span>Sugestões Rápidas:</span>
          <div class="ai-quick-chips-grid">
            ${quickChips.map(c => `
              <button type="button" class="ai-chip-btn" data-ai-quick-prompt="${esc(c.text)}">
                ${esc(c.label)}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      const noKeyAlertHtml = !hasKey ? `
        <div class="ai-no-key-alert">
          <strong>⚠️ Chave da API Google Gemini não configurada:</strong>
          <p style="margin:4px 0 8px;font-size:11.5px">
            Cole sua chave no arquivo <code>ai-service.js</code> (na linha <code>const GEMINI_API_KEY = "..."</code>) ou salve-a diretamente abaixo:
          </p>
          <div style="display:flex;gap:6px">
            <input type="password" id="ai-modal-key-input" placeholder="Cole sua chave AIzaSy..." style="font-size:11.5px;flex:1;padding:6px;border:1px solid #d1d5db;border-radius:6px">
            <button type="button" class="primary ob-btn-sm" data-ai-save-key-input="ai-modal-key-input">Salvar</button>
          </div>
        </div>
      ` : '';

      msgBox.innerHTML = `
        ${noKeyAlertHtml}
        ${history.length === 0 ? `
          <div class="ai-bubble ai-bubble-model">
            <p><strong>Olá! Eu sou a Professora IA. 👩‍🏫</strong></p>
            <p>Estou aqui para tirar dúvidas das suas videoaulas, explicar termos difíceis, inventar macetes de memorização ou destrinchar questões oficiais do ENEM passo a passo.</p>
            <p style="margin-bottom:0">Como posso te ajudar agora com <strong>${esc(currentTopicLabel)}</strong>?</p>
          </div>
          ${quickChipsHtml}
        ` : `
          ${messagesHtml}
        `}
        ${isLoading ? `
          <div class="ai-bubble ai-bubble-loading">
            <span>⏳</span>
            <span>Professora IA pensando na melhor explicação...</span>
          </div>
        ` : ''}
        ${aiError ? `
          <div class="ai-no-key-alert" style="background:#fee2e2;border-color:#fca5a5;color:#991b1b">
            ${esc(aiError)}
          </div>
        ` : ''}
      `;
      msgBox.scrollTop = msgBox.scrollHeight;
    }
  }

  const sendBtn = panel.querySelector('[data-ai-send]');
  if (sendBtn) {
    sendBtn.disabled = storageService.aiLoading;
    sendBtn.innerText = storageService.aiLoading ? '...' : 'Enviar →';
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   5.6 MASCOTE ROBÔ FLUTUANTE & ARRASTÁVEL (PET BOT)
   ══════════════════════════════════════════════════════════════════════════ */
const PET_BOT_TIPS = [
  'Oi! Sou o Pet Bot do ENEM! Estou acompanhando seu estudo. Se travar em qualquer questão, chame a Professora IA!',
  'Macete ENEM: em questões com fórmulas de Física, a resposta correta quase sempre sai direto pela análise dimensional das unidades!',
  'Dica de ouro: leia primeiro a última frase (o comando da questão) antes de encarar o texto-base longo!',
  'Cuidado no ENEM: alternativas com termos absolutistas ("sempre", "nunca", "exclusivamente") quase sempre são distratores!',
  'Na prova de Matemática, garanta primeiro as questões de razão, proporção, regra de três e porcentagem — elas elevam muito sua pontuação pela TRI!',
  'Bora lá! Cada minuto de estudo consciente te coloca mais perto da aprovação dos seus sonhos! 🚀'
];

let petBotDragInitialized = false;

function syncFloatingPetBot() {
  let root = document.getElementById('floating-pet-bot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'floating-pet-bot';
    root.className = 'floating-pet-container';
    document.body.appendChild(root);
  }

  if (storageService.petBotActive === false) {
    root.style.display = 'none';
    return;
  }
  root.style.display = 'block';

  const tipIdx = storageService.petBotTipIdx || 0;
  const tipText = storageService.petBotMessage || PET_BOT_TIPS[tipIdx % PET_BOT_TIPS.length];
  const isBubbleOpen = Boolean(storageService.petBotBubbleOpen);

  if (!root.querySelector('.floating-pet-avatar')) {
    root.innerHTML = `
      <div class="floating-pet-bubble ${isBubbleOpen ? 'is-open' : 'is-closed'}" id="floating-pet-bubble">
        <div class="floating-pet-bubble-head">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:14px">🤖</span>
            <strong>Pet Bot Tutor</strong>
          </div>
          <button type="button" class="floating-pet-bubble-close" data-pet-bubble-close="1" title="Fechar balão">✕</button>
        </div>
        <div class="floating-pet-bubble-text" id="floating-pet-bubble-text">
          ${esc(tipText)}
        </div>
        <div class="floating-pet-bubble-actions">
          <button type="button" class="secondary ob-btn-sm" data-pet-next-tip="1" title="Próxima dica">💡 Próxima Dica</button>
          <button type="button" class="primary ob-btn-sm" data-pet-open-chat="1" title="Abrir Tutor IA">💬 Tutor IA</button>
        </div>
      </div>

      <div class="floating-pet-avatar" id="floating-pet-avatar" title="Arraste para mover ou clique para ver uma dica!">
        <svg class="floating-pet-svg" viewBox="0 0 72 72" width="56" height="56">
          <defs>
            <linearGradient id="petBotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#047857" />
            </linearGradient>
            <filter id="petGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <line x1="36" y1="16" x2="36" y2="5" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
          <circle cx="36" cy="5" r="4.5" fill="#34d399" class="ai-pet-antenna-light" filter="url(#petGlow)"/>
          <rect x="7" y="27" width="5" height="15" rx="2.5" fill="#047857"/>
          <rect x="60" y="27" width="5" height="15" rx="2.5" fill="#047857"/>
          <rect x="12" y="16" width="48" height="38" rx="12" fill="url(#petBotGrad)" stroke="#34d399" stroke-width="2.5"/>
          <rect x="18" y="22" width="36" height="24" rx="7" fill="#042016"/>
          <ellipse cx="28" cy="33" rx="4" ry="5.5" fill="#34d399" class="floating-pet-eye left" filter="url(#petGlow)"/>
          <ellipse cx="44" cy="33" rx="4" ry="5.5" fill="#34d399" class="floating-pet-eye right" filter="url(#petGlow)"/>
          <circle cx="29.5" cy="31.5" r="1.3" fill="#ffffff"/>
          <circle cx="45.5" cy="31.5" r="1.3" fill="#ffffff"/>
          <path d="M 32 39 Q 36 43 40 39" fill="none" stroke="#34d399" stroke-width="1.8" stroke-linecap="round"/>
          <ellipse cx="36" cy="55" rx="8" ry="2.5" fill="#10b981" opacity="0.6" class="floating-pet-thruster"/>
        </svg>
      </div>
    `;
    setupPetBotDraggable(root, root.querySelector('#floating-pet-avatar'));
  } else {
    const bubble = root.querySelector('#floating-pet-bubble');
    if (bubble) {
      if (isBubbleOpen) {
        bubble.classList.remove('is-closed');
        bubble.classList.add('is-open');
      } else {
        bubble.classList.remove('is-open');
        bubble.classList.add('is-closed');
      }
    }
    const txtEl = root.querySelector('#floating-pet-bubble-text');
    if (txtEl) {
      txtEl.innerText = tipText;
    }
  }
}

function handlePetBotClick() {
  const avatar = document.getElementById('floating-pet-avatar');
  if (avatar) {
    avatar.classList.remove('happy-bounce');
    void avatar.offsetWidth;
    avatar.classList.add('happy-bounce');
  }

  if (storageService.petBotBubbleOpen) {
    const curIdx = storageService.petBotTipIdx || 0;
    const nextIdx = (curIdx + 1) % PET_BOT_TIPS.length;
    storageService.petBotTipIdx = nextIdx;
    storageService.petBotMessage = PET_BOT_TIPS[nextIdx];
  } else {
    storageService.petBotBubbleOpen = true;
    if (!storageService.petBotMessage) {
      storageService.petBotMessage = PET_BOT_TIPS[storageService.petBotTipIdx || 0];
    }
  }
  syncFloatingPetBot();
}

function setupPetBotDraggable(container, avatar) {
  if (petBotDragInitialized || !avatar) return;
  petBotDragInitialized = true;

  let startX = 0, startY = 0;
  let initLeft = 0, initTop = 0;
  let isDragging = false;
  let moved = false;

  const onPointerDown = (e) => {
    if (e.target.closest('#floating-pet-bubble')) return;
    const clientX = e.clientX != null ? e.clientX : e.touches?.[0]?.clientX;
    const clientY = e.clientY != null ? e.clientY : e.touches?.[0]?.clientY;
    if (clientX == null || clientY == null) return;

    startX = clientX;
    startY = clientY;
    const rect = container.getBoundingClientRect();
    initLeft = rect.left;
    initTop = rect.top;
    isDragging = true;
    moved = false;

    document.addEventListener('mousemove', onPointerMove, { passive: false });
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX != null ? e.clientX : e.touches?.[0]?.clientX;
    const clientY = e.clientY != null ? e.clientY : e.touches?.[0]?.clientY;
    if (clientX == null || clientY == null) return;

    const dx = clientX - startX;
    const dy = clientY - startY;

    if (!moved && Math.hypot(dx, dy) > 5) {
      moved = true;
      avatar.classList.add('is-dragging');
    }

    if (moved) {
      if (e.cancelable) e.preventDefault();
      const maxLeft = Math.max(10, window.innerWidth - 75);
      const maxTop = Math.max(10, window.innerHeight - 75);
      const newLeft = Math.min(Math.max(10, initLeft + dx), maxLeft);
      const newTop = Math.min(Math.max(10, initTop + dy), maxTop);

      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
      container.style.bottom = 'auto';
      container.style.right = 'auto';
    }
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    avatar.classList.remove('is-dragging');
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend', onPointerUp);

    if (!moved) {
      handlePetBotClick();
    }
  };

  avatar.addEventListener('mousedown', onPointerDown);
  avatar.addEventListener('touchstart', onPointerDown, { passive: false });
}

function buildFullAppContext() {
  const prof = storageService.getActiveProfile();
  const st = storageService.getActiveState();
  const parts = [];

  parts.push(`ALUNO(A): ${prof?.name || 'Estudante'} | META ENEM: ${prof?.goal || 'Aprovação Universitária'} | RITMO: ${prof?.pace || 'médio'}`);

  if (st.lastActivity && st.lastActivity.label) {
    parts.push(`ÚLTIMA ATIVIDADE REGISTRADA NO SITE ("Continuar de onde parou"): "${st.lastActivity.label}" (chave do tópico: ${st.lastActivity.topicKey || ''})`);
  }

  const area = st.activeArea || 'home';
  if (area === 'home') parts.push(`TELA ATUALMENTE ABERTA: Página Inicial (Início)`);
  else if (area === 'diagnostics') parts.push(`TELA ATUALMENTE ABERTA: Diagnóstico Adaptativo por IA`);
  else if (area === 'library') parts.push(`TELA ATUALMENTE ABERTA: Biblioteca de Estudos`);
  else if (area === 'my-list') parts.push(`TELA ATUALMENTE ABERTA: Minha Lista de Estudos (total de ${(st.studyList || []).length} tópicos na lista)`);
  else if (area === 'progression') parts.push(`TELA ATUALMENTE ABERTA: Página de Progressão e Estatísticas`);

  // Se a aluna estiver estudando um tópico específico:
  if (st.subView === 'topic-study' && st.activeTopicKey) {
    const eff = getEffectiveTopicData(st.activeTopicKey);
    if (eff) {
      parts.push(`MATÉRIA: ${eff.mod.materia} (${eff.mod.enemAreaId || ''}) | ASSUNTO: ${eff.mod.assunto} | BLOCO: ${eff.blk.titulo}`);
      parts.push(`TÓPICO ABERTO NA TELA: "${eff.titulo}" (Código: ${eff.hab?.codigo || ''})`);
      if (eff.foco) parts.push(`FOCO DO ENEM PARA ESTE TÓPICO: ${eff.foco}`);
      if (eff.preRequisito) parts.push(`PRÉ-REQUISITO RECOMENDADO: ${eff.preRequisito}`);
      parts.push(`ABA VISÍVEL NO MOMENTO: ${st.activeTopicTab === 'pratica' ? 'Questões Oficiais do ENEM' : st.activeTopicTab === 'videos' ? 'Videoaulas' : 'Resumo e Leitura'}`);

      if (eff.resumo) {
        const clean = String(eff.resumo).slice(0, 1000).replace(/\r?\n+/g, ' ');
        parts.push(`RESUMO BASE DO CONTEÚDO: ${clean}`);
      }

      const qs = eff.questoesEnem || [];
      if (qs.length > 0) {
        parts.push(`=== TODAS AS QUESTÕES DO ENEM DISPONÍVEIS NESTE TÓPICO (${qs.length} questões) ===`);
        qs.forEach((q, idx) => {
          const num = idx + 1;
          const altsStr = Object.entries(q.alternativas || {})
            .map(([l, txt]) => `[${l}] ${txt}`)
            .join(' | ');
          const ansInfo = st.topicProgress?.[eff.topicKey]?.enemAnswers?.[q.id];
          const studentMarked = ansInfo?.selected
            ? `(A aluna selecionou [${ansInfo.selected}], status: ${ansInfo.checked ? (ansInfo.selected === q.correta ? 'ACERTOU' : 'ERROU') : 'NÃO VERIFICOU AINDA'})`
            : '(A aluna ainda não marcou alternativa)';

          parts.push(
            `QUESTÃO ${num} (${q.ano || 'ENEM'} - ${q.prova || 'Oficial'}): ` +
            `ENUNCIADO: "${q.enunciado}" | ` +
            `ALTERNATIVAS: ${altsStr} | ` +
            `GABARITO OFICIAL: [${q.correta}] | ` +
            `RESOLUÇÃO: "${q.resolucao || ''}" | ` +
            `SITUAÇÃO DO ALUNO: ${studentMarked}`
          );
        });
      }
    }
  }

  // Se estiver na sessão de Diagnóstico com IA:
  if (st.activeArea === 'diagnostics' && st.diagSession) {
    const ds = st.diagSession;
    parts.push(`=== SESSÃO ATIVA DE DIAGNÓSTICO COM IA ===`);
    parts.push(`MATÉRIA: ${ds.materia} | ASSUNTO: ${ds.assunto} | TÓPICO: ${ds.topicTitle}`);
    if (ds.question) {
      parts.push(`ENUNCIADO DA QUESTÃO DO DIAGNÓSTICO: "${ds.question.enunciado}"`);
      parts.push(`ALTERNATIVAS: ${Object.entries(ds.question.alternativas || {}).map(([l, t]) => `[${l}] ${t}`).join(' | ')}`);
      parts.push(`GABARITO DA IA: [${ds.question.correta}]`);
      if (ds.userChoice) parts.push(`RESPOSTA MARCADA PELA ALUNA: [${ds.userChoice}]`);
      if (ds.userConfidence) parts.push(`NÍVEL DE CERTEZA: ${ds.userConfidence === 'certeza' ? 'Tenho Certeza' : 'Estou em Dúvida'}`);
      if (ds.userReasoning) parts.push(`RACIOCÍNIO / DÚVIDA ESCRITA PELA ALUNA: "${ds.userReasoning}"`);
    }
  }

  return parts.join('\n');
}

async function sendAiUserMessage(userText) {
  if (!userText || !userText.trim()) return;
  if (!window.aiService || typeof window.aiService.sendMessage !== 'function') {
    toast('Serviço de IA não inicializado.');
    return;
  }

  const fullAppContext = buildFullAppContext();

  storageService.aiLoading = true;
  storageService.aiError = '';
  syncAiChatWidget();

  setTimeout(() => {
    const box = document.getElementById('ai-chat-messages');
    if (box) box.scrollTop = box.scrollHeight;
  }, 40);

  try {
    await window.aiService.sendMessage(userText, fullAppContext);
  } catch (err) {
    storageService.aiError = err.message || 'Erro ao consultar a IA.';
  } finally {
    storageService.aiLoading = false;
    syncAiChatWidget();
    setTimeout(() => {
      const box = document.getElementById('ai-chat-messages');
      if (box) box.scrollTop = box.scrollHeight;
      const inp = document.getElementById('ai-chat-input');
      if (inp) inp.focus();
    }, 40);
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   6. ÁREA 1: 🏠 INÍCIO (BOAS-VINDAS, CONTINUAR ESTUDANDO E MATÉRIAS)
   ══════════════════════════════════════════════════════════════════════════ */
function renderHomeArea() {
  const prof = storageService.getActiveProfile();
  const st = storageService.getActiveState();
  const texts = storageService.getSiteTexts();
  const isEdit = storageService.editMode;
  const subjects = getEffectiveSubjects();
  const modules = getAllModules();

  const name = prof ? prof.name : 'Estudante';
  const goal = prof?.goal ? `${prof.goal} — ` : '';
  const pace = getPaceLabel(prof?.pace || 'medio');

  let totalTopics = 0;
  let completedTopics = 0;
  modules.forEach(mod => {
    (mod.blocos || []).forEach(blk => {
      (blk.habilidades || []).forEach(hab => {
        totalTopics++;
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        if (getTopicStudyStatus(tKey).status === 'completed') completedTopics++;
      });
    });
  });

  const activeListItems = (st.studyList || []).filter(i => i.status !== 'Concluído');

  // Caixa "Continuar de onde parei"
  let resumeHtml = '';
  if (st.lastActivity && st.lastActivity.topicKey && resolveTopicByKey(st.lastActivity.topicKey)) {
    resumeHtml = `
      <div class="home-resume-box">
        <div>
          <span class="eyebrow">⏱ Continuar de onde você parou</span>
          <strong>📖 ${esc(st.lastActivity.label)}</strong>
        </div>
        <button type="button" class="primary" data-open-topic="${esc(st.lastActivity.topicKey)}">
          Continuar estudando →
        </button>
      </div>
    `;
  } else if (activeListItems.length > 0) {
    const nextItem = activeListItems[0];
    resumeHtml = `
      <div class="home-resume-box">
        <div>
          <span class="eyebrow">📌 Próximo tópico da sua Minha Lista</span>
          <strong>${esc(nextItem.title)} (${esc(nextItem.subtitle)})</strong>
        </div>
        <button type="button" class="primary" data-open-topic="${esc(nextItem.topicKey)}">
          Estudar Agora →
        </button>
      </div>
    `;
  } else {
    resumeHtml = `
      <div class="home-resume-box">
        <div>
          <span class="eyebrow">🧬 Novo Roteiro Disponível: Biologia → Citologia</span>
          <strong>Comece pelo roteiro mastigado de Citologia ou escolha qualquer matéria abaixo</strong>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button type="button" class="primary" data-quick-library="biologia_citologia">
            🧬 Abrir Biologia: Citologia →
          </button>
          <button type="button" class="secondary" data-main-nav="library">
            📚 Ver Biblioteca Completa
          </button>
        </div>
      </div>
    `;
  }

  const subjectsCardsHtml = subjects.map((subj, sIdx) => {
    const matModules = modules.filter(m => m.materiaId === subj.id);
    const modRowsHtml = matModules.map((m, mIdx) => {
      const bCount = (m.blocos || []).length;
      const tCount = (m.blocos || []).reduce((acc, b) => acc + (b.habilidades?.length || 0), 0);

      return `
        <div class="home-module-item">
          <div class="home-module-info">
            <span class="home-module-icon">${m.icone || '📘'}</span>
            <div>
              <strong>${esc(m.assunto)}</strong>
              <small>${bCount} ${bCount === 1 ? 'bloco' : 'blocos'} · ${tCount} ${tCount === 1 ? 'tópico' : 'tópicos'}</small>
            </div>
          </div>
          <div class="home-module-actions">
            <button type="button" class="primary ob-btn-sm" data-quick-library="${esc(m.id)}">
              📖 Abrir Estudo →
            </button>
            ${isEdit ? `
              <button type="button" class="ob-icon-btn" data-cms-move-mod="${esc(m.id)}" data-dir="-1" title="Subir assunto">↑</button>
              <button type="button" class="ob-icon-btn" data-cms-move-mod="${esc(m.id)}" data-dir="1" title="Descer assunto">↓</button>
              <button type="button" class="ob-icon-btn" data-cms-open="edit-module" data-mod-id="${esc(m.id)}" title="Editar assunto">✏️</button>
              <button type="button" class="ob-icon-btn ob-icon-del" data-cms-delete-mod="${esc(m.id)}" title="Excluir assunto">✕</button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <article class="panel home-subject-card">
        <div class="home-subject-head" style="justify-content:space-between">
          <div style="display:flex;align-items:flex-start;gap:12px">
            <span class="symbol">${subj.icone || '📘'}</span>
            <div>
              <h3>${esc(subj.nome)}</h3>
              <p>${esc(subj.desc || '')}</p>
            </div>
          </div>
          ${isEdit ? `
            <div style="display:flex;gap:4px">
              <button type="button" class="ob-icon-btn" data-cms-move-subj="${esc(subj.id)}" data-dir="-1" ${sIdx === 0 ? 'disabled' : ''} title="Mover matéria para trás">↑</button>
              <button type="button" class="ob-icon-btn" data-cms-move-subj="${esc(subj.id)}" data-dir="1" ${sIdx === subjects.length - 1 ? 'disabled' : ''} title="Mover matéria para frente">↓</button>
              <button type="button" class="ob-icon-btn" data-cms-open="edit-subject" data-subj-id="${esc(subj.id)}" title="Editar matéria">✏️</button>
              <button type="button" class="ob-icon-btn ob-icon-del" data-cms-delete-subj="${esc(subj.id)}" title="Excluir matéria">✕</button>
            </div>
          ` : ''}
        </div>

        <div class="home-module-list">
          ${modRowsHtml || `<p style="font-size:12.5px;color:var(--muted);margin:0">Nenhum assunto cadastrado ainda nesta matéria.</p>`}
        </div>

        ${isEdit ? `
          <div style="margin-top:auto;padding-top:10px;border-top:1px dashed var(--line)">
            <button type="button" class="secondary ob-btn-sm" style="width:100%" data-cms-open="add-module" data-subj-id="${esc(subj.id)}">
              + Novo Assunto / Página de Estudo em ${esc(subj.nome)}
            </button>
          </div>
        ` : ''}
      </article>
    `;
  }).join('');

  window.layout(`
    <section class="panel home-welcome-hero" style="margin-bottom:24px">
      <div class="home-welcome-top">
        <div>
          <div class="eyebrow">${esc(texts.homeEyebrow)} · ${esc(pace)}</div>
          <h1 class="page-title" style="margin:6px 0 8px">Olá, ${esc(name)}!</h1>
          <p class="lede">${esc(goal)}${esc(texts.homeSubtitle)}</p>
        </div>
        <div class="home-stats-pills">
          <div class="home-stat-box">
            <strong>${completedTopics}/${totalTopics}</strong>
            <span>Tópicos Concluídos</span>
          </div>
          <div class="home-stat-box">
            <strong>${activeListItems.length}</strong>
            <span>Na Minha Lista</span>
          </div>
        </div>
      </div>

      <div class="home-countdown-widget">
        <div class="countdown-badge">
          <span class="countdown-badge-icon">⏳</span>
          <div class="countdown-badge-text">
            <strong>${esc(getCountdownStats().labelText)}</strong>
            <small>${getCountdownStats().isPast ? 'Chegou o momento de brilhar!' : 'Reta final com foco e consistência'}</small>
          </div>
        </div>
        <div class="countdown-quote-box">
          <span class="quote-sparkle">✨</span>
          <p class="quote-text">"${esc(getCountdownStats().message)}"</p>
        </div>
        ${isEdit ? `
          <button type="button" class="cms-inline-edit-btn" data-cms-open="edit-countdown" title="Editar meta do ENEM e frase motivacional">
            ✏️ Editar Cronômetro e Frase Motivacional
          </button>
        ` : ''}
      </div>

      ${resumeHtml}
    </section>

    <!-- BANNER DO DIAGNÓSTICO INTELIGENTE POR IA -->
    <section class="panel home-diag-hero-banner" style="margin-bottom:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap">
        <div style="flex:1 1 360px">
          <div class="eyebrow" style="color:var(--green)">⚡ Diagnóstico Adaptativo por IA</div>
          <h2 style="margin:4px 0 6px;font-size:20px">Descubra o que você já domina antes de começar a estudar</h2>
          <p style="margin:0;font-size:13.5px;color:var(--muted);line-height:1.5">
            Não perca tempo estudando o que já sabe. A Professora IA gera questões rápidas de sondagem para testar seu raciocínio, avalia sua certeza e seus comentários escritos, e mapeia seus pontos fortes e fracos em todas as 4 áreas do ENEM.
          </p>
        </div>
        <button type="button" class="primary" data-main-nav="diagnostics" style="padding:12px 22px;font-size:14px;white-space:nowrap">
          🎯 Fazer Diagnóstico com IA →
        </button>
      </div>
    </section>

    <section class="home-subjects-section">
      <div class="section-head-row" style="margin-bottom:18px">
        <div>
          <div class="eyebrow">Acesso Direto por Matéria e Assunto</div>
          <h2 class="section-title">O que vamos estudar hoje?</h2>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${isEdit ? `
            <button type="button" class="primary ob-btn-sm" data-cms-open="add-subject">
              + Nova Matéria
            </button>
            <button type="button" class="secondary ob-btn-sm" data-cms-open="add-block">
              + Novo Bloco
            </button>
          ` : ''}
          <button type="button" class="secondary ob-btn-sm" data-main-nav="library">📚 Biblioteca Completa</button>
          <button type="button" class="secondary ob-btn-sm" data-main-nav="my-list">📌 Minha Lista (${(st.studyList || []).length})</button>
        </div>
      </div>

      <div class="home-subjects-grid">
        ${subjectsCardsHtml}
      </div>
    </section>
  `);
}


/* ══════════════════════════════════════════════════════════════════════════
   7. ÁREA 2: 📚 BIBLIOTECA DE ESTUDOS (ACORDEÕES ⌄ + CMS + PÁGINA DE ESTUDO)
   ══════════════════════════════════════════════════════════════════════════ */
function renderLibraryArea() {
  const st = storageService.getActiveState();
  if (st.subView === 'topic-study' && st.activeTopicKey) {
    return renderTopicStudyPage(st.activeTopicKey);
  }

  const texts = storageService.getSiteTexts();
  const isEdit = storageService.editMode;
  const subjects = getEffectiveSubjects();
  const modules = getAllModules();
  const filterEnemArea = st.libraryFilterEnemArea || 'all';
  const filterMat = st.libraryFilterMateria || 'all';
  const filterMod = st.libraryFilterModule || 'all';
  const searchQ = (st.librarySearch || '').trim().toLowerCase();

  if (!st.openAccordions) st.openAccordions = {};

  // Mapeia cada matéria para sua Área do ENEM
  const subjMap = new Map(subjects.map(s => [s.id, s]));
  const getModuleEnemAreaId = mod => {
    if (mod.enemAreaId) return mod.enemAreaId;
    const s = subjMap.get(mod.materiaId);
    return s?.enemAreaId || 'natureza';
  };

  // Na Biblioteca de Estudos: exibir apenas matérias e assuntos com conteúdo completo (Física: Óptica; Biologia: Citologia e Fisiologia Celular)
  const isLibraryModule = m => {
    if (m.id === 'biologia_citologia' || m.id === 'fisica_optica') return true;
    if (storageService.data?.cms?.customModules?.[m.id]) return true;
    return false;
  };

  const libraryModules = modules.filter(isLibraryModule);

  const librarySubjects = subjects.filter(s => {
    if (s.id === 'biologia' || s.id === 'fisica') return true;
    if (storageService.data?.cms?.customSubjects?.[s.id]) return true;
    return false;
  });

  const visibleSubjects = librarySubjects.filter(s => filterEnemArea === 'all' || (s.enemAreaId || 'natureza') === filterEnemArea);

  const filteredModules = libraryModules.filter(m => {
    const mArea = getModuleEnemAreaId(m);
    if (filterEnemArea !== 'all' && mArea !== filterEnemArea) return false;
    if (filterMat !== 'all' && m.materiaId !== filterMat) return false;
    if (filterMod !== 'all' && m.id !== filterMod) return false;
    return true;
  });

  const renderSingleModuleAccordion = (mod, isDefaultOpen) => {
    const ytIntroId = mod.introVideo?.url ? extractYouTubeVideoId(mod.introVideo.url) : null;
    const ytThumb = ytIntroId ? `https://i.ytimg.com/vi/${ytIntroId}/hqdefault.jpg` : null;

    // Seção "Comece por aqui · Introdução" presente em TODOS os assuntos, com botão de Editar direto!
    const introBoxHtml = `
      <div class="citologia-intro-banner">
        <div class="section-head-row" style="margin-bottom:10px;align-items:center">
          <div class="eyebrow" style="color:var(--green)">🚀 Comece por aqui · Introdução a ${esc(mod.assunto)}</div>
          ${isEdit ? `
            <button type="button" class="secondary ob-btn-sm" data-cms-open="edit-module" data-mod-id="${esc(mod.id)}">
              ✏️ Editar Introdução (Leitura e Vídeo Inicial)
            </button>
          ` : ''}
        </div>

        ${(mod.introReading?.url || mod.introVideo?.url) ? `
          <div class="citologia-intro-grid">
            ${mod.introReading?.url ? `
              <div class="citologia-intro-card">
                ${renderSiteThumbBox(mod.introReading)}
                <div style="flex:1;min-width:180px">
                  <span class="op-badge mastered">📖 Leitura Inicial · ${esc(mod.introReading.portal || 'Artigo')}</span>
                  <h4 style="margin:6px 0 4px;font-size:15px">${esc(mod.introReading.titulo || 'Resumo Inicial')}</h4>
                  <p style="margin:0 0 10px;font-size:12.5px;color:var(--muted)">${esc(mod.introReading.resumo || '')}</p>
                  <a href="${esc(mod.introReading.url)}" target="_blank" rel="noopener noreferrer" class="primary ob-btn-sm">
                    📖 Abrir ${esc(mod.introReading.titulo)} ↗
                  </a>
                </div>
              </div>
            ` : ''}

            ${mod.introVideo?.url ? `
              <div class="citologia-intro-card">
                ${ytThumb ? `
                  <a href="${esc(mod.introVideo.url)}" target="_blank" rel="noopener noreferrer" class="video-thumb-link" style="width:175px">
                    <img src="${esc(ytThumb)}" alt="Vídeo Inicial" class="video-thumb-img" loading="lazy">
                    <span class="video-thumb-play">▶</span>
                  </a>
                ` : `<div class="ob-resource-icon">▶️</div>`}
                <div style="flex:1;min-width:180px">
                  <span class="op-badge partial">▶️ ${esc(mod.introVideo.duracao || 'Vídeo Inicial')}</span>
                  <h4 style="margin:6px 0 4px;font-size:15px">${esc(mod.introVideo.titulo || 'Vídeo Introdutório')}</h4>
                  <p style="margin:0 0 10px;font-size:12.5px;color:var(--muted)">Ou, se preferir, comece assistindo a esta aula introdutória no YouTube.</p>
                  <a href="${esc(mod.introVideo.url)}" target="_blank" rel="noopener noreferrer" class="secondary ob-btn-sm">
                    ▶ Assistir Vídeo Inicial no YouTube ↗
                  </a>
                </div>
              </div>
            ` : ''}
          </div>
        ` : (isEdit ? `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:8px 4px">
            <span style="font-size:12.5px;color:var(--muted)">Adicione um link de leitura inicial ou vídeo introdutório para começar ${esc(mod.assunto)}.</span>
            <button type="button" class="primary ob-btn-sm" data-cms-open="edit-module" data-mod-id="${esc(mod.id)}">+ Adicionar Leitura / Vídeo Inicial</button>
          </div>
        ` : '')}
      </div>
    `;

    const blocksList = mod.blocos || [];
    const blocksHtml = blocksList.map((blk, blkIdx) => {
      const matchingHabs = (blk.habilidades || []).filter(hab => {
        if (!searchQ) return true;
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const eff = getEffectiveTopicData(tKey);
        const hay = `${mod.materia} ${mod.assunto} ${blk.titulo} ${eff?.titulo || hab.nome} ${eff?.foco || ''}`.toLowerCase();
        return hay.includes(searchQ);
      });

      if (matchingHabs.length === 0 && !isEdit) return '';

      const habRowsHtml = matchingHabs.map((hab, hIdx) => {
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const eff = getEffectiveTopicData(tKey);
        const stInfo = getTopicStudyStatus(tKey);
        const inList = (st.studyList || []).find(i => i.topicKey === tKey);
        const vidCount = eff.videos.length;
        const siteCount = eff.sites.length;
        const enemCount = eff.questoesEnem.length;
        const firstVidDur = eff.videos.find(v => v.duracao)?.duracao || '';

        return `
          <div class="lib-topic-row">
            <div class="lib-topic-main">
              <div class="lib-topic-top">
                <strong class="lib-topic-title">${esc(eff.titulo)}</strong>
                ${firstVidDur ? `<span class="op-badge partial">⏱ ${esc(firstVidDur)}</span>` : ''}
                ${stInfo.status !== 'pending' ? `<span class="op-badge ${stInfo.badgeCls}">${esc(stInfo.label)}</span>` : ''}
                ${inList ? `<span class="ob-origin-tag">📌 Na Lista (${esc(inList.status)})</span>` : ''}
              </div>
              ${eff.foco ? `<p class="lib-topic-foco">${formatInlineMarkdown(eff.foco)}</p>` : ''}
              <div class="lib-topic-chips">
                ${eff.preRequisito ? `<span class="chip-prereq">💡 Requer: ${esc(eff.preRequisito)}</span>` : ''}
                <span>📖 Resumo${siteCount > 0 ? ` + ${siteCount} site(s)` : ''}</span>
                ${vidCount > 0 ? `<span>▶️ ${vidCount} videoaula(s)</span>` : ''}
                ${enemCount > 0 ? `<span>📝 ${enemCount} questão(ões) ENEM</span>` : ''}
              </div>
            </div>

            <div class="lib-topic-actions">
              <button type="button" class="primary ob-btn-sm" data-open-topic="${esc(tKey)}">
                Estudar Agora →
              </button>
              <button type="button" class="secondary ob-btn-sm" data-lib-add-list="${esc(tKey)}">
                ${inList ? '✓ Na Lista' : '+ Minha Lista'}
              </button>
              ${isEdit ? `
                <button type="button" class="ob-icon-btn" data-cms-move-topic="${esc(hab.id)}" data-mod-id="${esc(mod.id)}" data-blk-id="${esc(blk.id)}" data-dir="-1" ${hIdx === 0 ? 'disabled' : ''} title="Subir tópico">↑</button>
                <button type="button" class="ob-icon-btn" data-cms-move-topic="${esc(hab.id)}" data-mod-id="${esc(mod.id)}" data-blk-id="${esc(blk.id)}" data-dir="1" ${hIdx === matchingHabs.length - 1 ? 'disabled' : ''} title="Descer tópico">↓</button>
                <button type="button" class="ob-icon-btn" data-cms-open="edit-topic" data-topic-key="${esc(tKey)}" title="Editar tópico">✏️</button>
                <button type="button" class="ob-icon-btn ob-icon-del" data-cms-delete-topic="${esc(hab.id)}" data-mod-id="${esc(mod.id)}" data-blk-id="${esc(blk.id)}" title="Excluir tópico">✕</button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

      const blkAccId = `lib_blk_${mod.id}_${blk.id}`;
      // Deixa o Bloco 1 aberto por padrão para que o botão "Estudar Agora →" apareça logo abaixo da Introdução!
      const defaultBlkOpen = blkIdx === 0;
      const isBlkOpen = searchQ
        ? true
        : (st.openAccordions[blkAccId] !== undefined ? st.openAccordions[blkAccId] : defaultBlkOpen);

      return `
        <details class="clean-accordion lib-block-accordion" data-acc-id="${esc(blkAccId)}" ${isBlkOpen ? 'open' : ''}>
          <summary class="clean-accordion-summary lib-block-summary">
            <div class="clean-acc-left">
              <span class="ob-hub-order">Bloco ${blk.ordem}</span>
              <div class="clean-acc-titles">
                <strong class="lib-block-title">${esc(blk.titulo)}</strong>
                <small class="clean-acc-sub">${matchingHabs.length} ${matchingHabs.length === 1 ? 'aula/tópico' : 'aulas/tópicos'} com botão "Estudar Agora →"</small>
              </div>
            </div>
            <div class="clean-acc-right">
              <span class="acc-chevron" aria-hidden="true">⌄</span>
            </div>
          </summary>

          <div class="clean-accordion-body lib-block-body">
            ${isEdit ? `
              <div class="editor-inline-toolbar" style="margin-bottom:12px">
                <span>📋 <strong>Aulas e Tópicos do Bloco ${blk.ordem}:</strong></span>
                <div style="display:flex;gap:6px;flex-wrap:wrap">
                  <button type="button" class="primary ob-btn-sm" data-cms-open="add-topic" data-mod-id="${esc(mod.id)}" data-blk-id="${esc(blk.id)}">+ Novo Tópico / Aula neste Bloco</button>
                  <button type="button" class="secondary ob-btn-sm" data-cms-open="edit-block" data-mod-id="${esc(mod.id)}" data-blk-id="${esc(blk.id)}">✏️ Editar Bloco</button>
                  <button type="button" class="ob-icon-btn" data-cms-move-block="${esc(blk.id)}" data-mod-id="${esc(mod.id)}" data-dir="-1" ${blkIdx === 0 ? 'disabled' : ''} title="Subir bloco">↑</button>
                  <button type="button" class="ob-icon-btn" data-cms-move-block="${esc(blk.id)}" data-mod-id="${esc(mod.id)}" data-dir="1" ${blkIdx === blocksList.length - 1 ? 'disabled' : ''} title="Descer bloco">↓</button>
                  <button type="button" class="ob-icon-btn ob-icon-del" data-cms-delete-block="${esc(blk.id)}" data-mod-id="${esc(mod.id)}" title="Excluir bloco">✕</button>
                </div>
              </div>
            ` : ''}

            <div class="lib-topics-list">
              ${habRowsHtml || `<p style="margin:0;font-size:13px;color:var(--muted)">Nenhum tópico neste bloco ainda.</p>`}
            </div>
          </div>
        </details>
      `;
    }).filter(Boolean).join('');

    if (!blocksHtml && !isEdit) return '';

    const totalModBlocks = (mod.blocos || []).length;
    const totalModTopics = (mod.blocos || []).reduce((a, b) => a + (b.habilidades?.length || 0), 0);
    const modAccId = `lib_mod_${mod.id}`;
    const isModOpen = (searchQ || filterMod !== 'all')
      ? true
      : (st.openAccordions[modAccId] !== undefined ? st.openAccordions[modAccId] : isDefaultOpen);

    return `
      <details class="panel clean-accordion lib-module-accordion" data-acc-id="${esc(modAccId)}" ${isModOpen ? 'open' : ''}>
        <summary class="clean-accordion-summary lib-module-summary">
          <div class="clean-acc-left">
            <span class="lib-module-icon">${mod.icone || '📘'}</span>
            <div class="clean-acc-titles">
              <span class="eyebrow">${esc(mod.materia)}</span>
              <h2 class="section-title" style="margin:2px 0;font-size:22px">${esc(mod.assunto)}</h2>
              <small class="clean-acc-sub">${totalModBlocks} ${totalModBlocks === 1 ? 'bloco' : 'blocos'} · ${totalModTopics} ${totalModTopics === 1 ? 'tópico' : 'tópicos'} de estudo</small>
            </div>
          </div>
          <div class="clean-acc-right">
            <span class="acc-hint-label">Abrir / Fechar</span>
            <span class="acc-chevron" aria-hidden="true">⌄</span>
          </div>
        </summary>

        <div class="clean-accordion-body lib-module-body">
          ${isEdit ? `
            <div class="editor-inline-toolbar" style="margin-bottom:14px">
              <span>⚙️ <strong>Opções de ${esc(mod.assunto)}:</strong></span>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button type="button" class="primary ob-btn-sm" data-cms-open="add-block" data-mod-id="${esc(mod.id)}">+ Novo Bloco</button>
                <button type="button" class="secondary ob-btn-sm" data-cms-open="edit-module" data-mod-id="${esc(mod.id)}">✏️ Editar Assunto / Introdução</button>
                <button type="button" class="ob-icon-btn" data-cms-move-mod="${esc(mod.id)}" data-dir="-1" title="Subir assunto">↑</button>
                <button type="button" class="ob-icon-btn" data-cms-move-mod="${esc(mod.id)}" data-dir="1" title="Descer assunto">↓</button>
                <button type="button" class="ob-icon-btn ob-icon-del" data-cms-delete-mod="${esc(mod.id)}" title="Excluir assunto">✕</button>
              </div>
            </div>
          ` : ''}

          ${introBoxHtml}

          <div class="lib-blocks-stack">
            ${blocksHtml}
          </div>
        </div>
      </details>
    `;
  };

  // Agrupa os Assuntos/Módulos por Área do ENEM na Biblioteca de Estudos!
  let globalModCounter = 0;
  const areasSectionsHtml = ENEM_AREAS.map(area => {
    if (filterEnemArea !== 'all' && filterEnemArea !== area.id) return '';
    const areaMods = filteredModules.filter(m => getModuleEnemAreaId(m) === area.id);

    if (areaMods.length === 0 && !isEdit && filterEnemArea !== area.id) return '';

    const areaModsHtml = areaMods.map(m => {
      const html = renderSingleModuleAccordion(m, globalModCounter === 0);
      if (html) globalModCounter++;
      return html;
    }).filter(Boolean).join('');

    return `
      <section class="enem-area-group">
        <div class="enem-area-header">
          <div class="enem-area-title-wrap">
            <span class="enem-area-icon">${area.icone}</span>
            <div>
              <div class="eyebrow">Área do ENEM</div>
              <h2 class="section-title" style="margin:2px 0 0;font-size:22px">${esc(area.nome)}</h2>
              <small style="color:var(--muted);font-size:12.5px">${esc(area.desc)}</small>
            </div>
          </div>
          ${isEdit ? `
            <button type="button" class="secondary ob-btn-sm" data-cms-open="add-subject" data-enem-area="${esc(area.id)}">
              + Nova Matéria em ${esc(area.curto)}
            </button>
          ` : ''}
        </div>
        <div class="enem-area-modules">
          ${areaModsHtml || `
            <p style="font-size:13.5px;color:var(--muted);margin:14px 0 16px;padding:14px 18px;background:#ffffff;border:1px dashed var(--line);border-radius:12px;line-height:1.5">
              📚 Conteúdo completo em desenvolvimento para esta área. Use a aba <strong>🎯 Diagnóstico IA</strong> no topo para testar e avaliar seus conhecimentos nessa área com a Professora IA!
            </p>
          `}
        </div>
      </section>
    `;
  }).filter(Boolean).join('');

  window.layout(`
    <section class="op-hero" style="padding-bottom:12px">
      <div>
        <div class="eyebrow">Organizado pelas 4 Áreas do ENEM + Redação</div>
        <h1 class="page-title">${esc(texts.libraryTitle)}</h1>
        <p class="lede">${esc(texts.librarySubtitle)}</p>
      </div>
      ${isEdit ? `
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="primary ob-btn-sm" data-cms-open="add-subject">+ Nova Matéria</button>
          <button type="button" class="secondary ob-btn-sm" data-cms-open="add-module" data-subj-id="${esc(filterMat !== 'all' ? filterMat : (subjects[0]?.id || 'biologia'))}">+ Novo Assunto</button>
        </div>
      ` : ''}
    </section>

    <section class="panel lib-filter-bar">
      <div class="lib-search-row">
        <input type="search" id="lib-search-input" class="lib-search-input"
          placeholder="🔍 Pesquisar assunto, aula ou tópico (ex: Citologia, Organelas, Mitose, Óptica, História, Redação)..."
          value="${esc(st.librarySearch || '')}">
        ${(st.librarySearch || filterEnemArea !== 'all' || filterMat !== 'all' || filterMod !== 'all') ? `
          <button type="button" class="secondary ob-btn-sm" data-lib-clear-search="1">Mostrar tudo</button>
        ` : ''}
      </div>

      <div class="lib-filters-group">
        <div class="eyebrow" style="margin-bottom:6px">1. Filtrar por Área do ENEM</div>
        <div class="ob-filter-pills" role="tablist" aria-label="Filtrar por Área do ENEM">
          <button type="button" class="ob-filter-pill ${filterEnemArea === 'all' ? 'active' : ''}" data-lib-filter-area="all">Todas as Áreas do ENEM</button>
          ${ENEM_AREAS.map(a => `
            <button type="button" class="ob-filter-pill ${filterEnemArea === a.id ? 'active' : ''}" data-lib-filter-area="${esc(a.id)}">
              ${a.icone} ${esc(a.curto)}
            </button>
          `).join('')}
        </div>

        <div class="eyebrow" style="margin:12px 0 6px">2. Filtrar por Matéria e Assunto</div>
        <div class="ob-filter-pills" role="tablist" aria-label="Filtrar por Matéria">
          <button type="button" class="ob-filter-pill ${filterMat === 'all' ? 'active' : ''}" data-lib-filter-mat="all">Todas as Matérias</button>
          ${visibleSubjects.map(s => `
            <button type="button" class="ob-filter-pill ${filterMat === s.id ? 'active' : ''}" data-lib-filter-mat="${esc(s.id)}">
              ${s.icone || '📘'} ${esc(s.nome)}
            </button>
          `).join('')}
        </div>

        <div class="ob-filter-pills" style="margin-top:8px" role="tablist" aria-label="Filtrar por Assunto">
          <button type="button" class="ob-filter-pill ${filterMod === 'all' ? 'active' : ''}" data-lib-filter-mod="all">Todos os Assuntos</button>
          ${libraryModules
            .filter(m => (filterEnemArea === 'all' || getModuleEnemAreaId(m) === filterEnemArea) && (filterMat === 'all' || m.materiaId === filterMat))
            .map(m => `
              <button type="button" class="ob-filter-pill ${filterMod === m.id ? 'active' : ''}" data-lib-filter-mod="${esc(m.id)}">
                ${m.icone || ''} ${esc(m.assunto)}
              </button>
            `).join('')}
        </div>
      </div>
    </section>

    <div class="lib-catalog-body">
      ${areasSectionsHtml || `
        <div class="panel empty">
          <h3>Nenhum tópico encontrado</h3>
          <p>Tente outro termo de pesquisa ou limpe os filtros acima.</p>
          <button type="button" class="primary" data-lib-clear-search="1">Mostrar tudo</button>
        </div>
      `}
    </div>
  `);
}

/**
 * Página Interna de Estudo do Tópico (3 Abas Limpas e 100% Editáveis):
 * 1. [ 📖 Resumo e Sites ]
 * 2. [ ▶️ Videoaulas ]
 * 3. [ 📝 Questões do ENEM ]
 */
function renderTopicStudyPage(topicKey) {
  const eff = getEffectiveTopicData(topicKey);
  if (!eff) {
    const st = storageService.getActiveState();
    st.subView = 'main';
    return renderLibraryArea();
  }

  const st = storageService.getActiveState();
  const isEdit = storageService.editMode;
  const activeTab = ['resumo', 'videos', 'pratica'].includes(st.activeTopicTab) ? st.activeTopicTab : 'resumo';
  const stInfo = getTopicStudyStatus(eff.topicKey);
  const inList = (st.studyList || []).find(i => i.topicKey === eff.topicKey);
  const tProg = st.topicProgress?.[eff.topicKey] || { enemAnswers: {} };

  const siblings = eff.blk.habilidades || [];
  const curHabIdx = siblings.findIndex(h => h.id === eff.hab.id);
  const prevHab = curHabIdx > 0 ? siblings[curHabIdx - 1] : null;
  const nextHab = curHabIdx >= 0 && curHabIdx < siblings.length - 1 ? siblings[curHabIdx + 1] : null;

  let tabBodyHtml = '';

  /* ABA 1: [ 📖 Resumo e Sites ] — Com Quadrinho Visual / Thumbnail do Link! */
  if (activeTab === 'resumo') {
    const sitesCardsHtml = eff.sites.length > 0 ? eff.sites.map((site, sIdx) => `
      <article class="ob-resource-card video-card-clean site-card-clean">
        ${renderSiteThumbBox(site)}
        <div class="ob-resource-body">
          <div class="ob-resource-meta">
            <span class="op-badge mastered">🌐 ${esc(site.portal || site.fonte || 'Leitura Recomendada')}</span>
            <span style="font-size:11.5px;color:var(--muted)">${esc(extractDomainFromUrl(site.url))}</span>
          </div>
          <h4 style="margin:6px 0;font-size:16px">${esc(site.titulo)}</h4>
          <p style="margin-bottom:10px">${formatInlineMarkdown(site.resumo || site.objetivo || '')}</p>
          <div class="ob-resource-actions">
            <a href="${esc(site.url)}" target="_blank" rel="noopener noreferrer" class="primary ob-btn-sm">
              📖 Abrir leitura (${esc(site.portal || site.fonte || 'Site')}) ↗
            </a>
            ${isEdit ? `
              <button type="button" class="ob-icon-btn" data-cms-move-site="${sIdx}" data-topic-key="${esc(eff.topicKey)}" data-dir="-1" ${sIdx === 0 ? 'disabled' : ''} title="Subir link">↑</button>
              <button type="button" class="ob-icon-btn" data-cms-move-site="${sIdx}" data-topic-key="${esc(eff.topicKey)}" data-dir="1" ${sIdx === eff.sites.length - 1 ? 'disabled' : ''} title="Descer link">↓</button>
              <button type="button" class="secondary ob-btn-sm" data-cms-open="edit-site" data-topic-key="${esc(eff.topicKey)}" data-item-idx="${sIdx}">✏️ Editar Link</button>
              <button type="button" class="ob-action-pill ob-btn-sm ob-icon-del" data-cms-delete-site="${sIdx}" data-topic-key="${esc(eff.topicKey)}">🗑️ Excluir</button>
            ` : ''}
          </div>
        </div>
      </article>
    `).join('') : `
      <div class="empty" style="padding:18px;border:1px dashed var(--line);border-radius:12px">
        <p style="margin:0 0 10px">Nenhum link ou site cadastrado neste tópico ainda.</p>
        ${isEdit ? `<button type="button" class="primary ob-btn-sm" data-cms-open="add-site" data-topic-key="${esc(eff.topicKey)}">+ Adicionar Site / Leitura com Miniatura</button>` : ''}
      </div>
    `;

    tabBodyHtml = `
      <div class="ob-study-tab-pane">
        ${isEdit ? `
          <div class="editor-inline-toolbar" style="margin-bottom:14px">
            <span>✏️ <strong>Modo Edição: Personalizar este Tópico:</strong></span>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="primary ob-btn-sm" data-cms-open="edit-topic" data-topic-key="${esc(eff.topicKey)}">
                ✏️ Editar Título, Resumo, Pré-requisito e Imagem
              </button>
              <button type="button" class="secondary ob-btn-sm" data-cms-open="add-site" data-topic-key="${esc(eff.topicKey)}">
                + Adicionar Site / Link
              </button>
              <button type="button" class="secondary ob-btn-sm" data-cms-open="add-video" data-topic-key="${esc(eff.topicKey)}">
                + Adicionar Videoaula
              </button>
              <button type="button" class="secondary ob-btn-sm" data-cms-open="add-enem-q" data-topic-key="${esc(eff.topicKey)}">
                + Adicionar Questão do ENEM
              </button>
              ${eff.resumoImage ? `
                <button type="button" class="ob-action-pill ob-btn-sm ob-icon-del" data-cms-remove-resumo-img="${esc(eff.topicKey)}">
                  🗑️ Remover Imagem
                </button>
              ` : ''}
            </div>
          </div>
        ` : ''}

        ${eff.resumoImage ? `
          <figure class="topic-illustration-box">
            <img src="${esc(eff.resumoImage)}" alt="Ilustração de ${esc(eff.titulo)}" class="topic-illustration-img">
          </figure>
        ` : ''}

        <div class="ob-review-body">
          <div class="eyebrow" style="margin-bottom:8px">Resumo de Estudo · ${esc(eff.blk.titulo)}</div>
          ${renderMarkdownSummary(eff.resumo)}
        </div>

        <hr class="topic-divider">

        <div class="topic-sites-section">
          <div class="section-head-row" style="margin-bottom:12px">
            <div>
              <div class="eyebrow">Leitura Inicial e Sites Recomendados</div>
              <h3 class="section-title" style="font-size:20px;margin:4px 0">Materiais de Leitura</h3>
            </div>
            ${isEdit ? `
              <button type="button" class="primary ob-btn-sm" data-cms-open="add-site" data-topic-key="${esc(eff.topicKey)}">
                + Adicionar Site / Link
              </button>
            ` : ''}
          </div>
          <div class="ob-resource-list">
            ${sitesCardsHtml}
          </div>
        </div>

        <div class="actions" style="margin-top:26px;padding-top:16px;border-top:1px solid var(--line);justify-content:space-between">
          <button type="button" class="secondary" data-switch-topic-tab="videos">
            ▶️ Ir para Videoaulas (${eff.videos.length}) →
          </button>
          <button type="button" class="primary" data-switch-topic-tab="pratica">
            📝 Questões do ENEM (${eff.questoesEnem.length}) →
          </button>
        </div>
      </div>
    `;
  }

  /* ABA 2: [ ▶️ Videoaulas ] — Miniatura Oficial do YouTube + Duração + Reordenação */
  else if (activeTab === 'videos') {
    const videosListHtml = eff.videos.length > 0 ? eff.videos.map((v, vIdx) => {
      const ytId = extractYouTubeVideoId(v.url);
      const thumbUrl = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : null;
      return `
        <article class="ob-resource-card video-card-clean">
          ${thumbUrl ? `
            <a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer" class="video-thumb-link" title="Assistir ${esc(v.titulo)} no YouTube">
              <img src="${esc(thumbUrl)}" alt="Miniatura da aula ${esc(v.titulo)}" class="video-thumb-img" loading="lazy">
              <span class="video-thumb-play">▶</span>
            </a>
          ` : `
            <div class="ob-resource-icon">🎬</div>
          `}
          <div class="ob-resource-body">
            <div class="ob-resource-meta">
              ${v.duracao ? `<span class="op-badge mastered">⏱ ${esc(v.duracao)}</span>` : ''}
              <span class="op-badge partial">${esc(v.canal || 'YouTube')}</span>
            </div>
            <h4 style="margin:6px 0;font-size:16px">${esc(v.titulo)}</h4>
            ${(v.nota || v.objetivo) ? `<p style="margin-bottom:10px">${esc(v.nota || v.objetivo)}</p>` : ''}
            <div class="ob-resource-actions">
              <a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer" class="primary ob-btn-sm">
                ▶ Assistir aula no YouTube ↗
              </a>
              ${isEdit ? `
                <button type="button" class="ob-icon-btn" data-cms-move-video="${vIdx}" data-topic-key="${esc(eff.topicKey)}" data-dir="-1" ${vIdx === 0 ? 'disabled' : ''} title="Subir vídeo">↑</button>
                <button type="button" class="ob-icon-btn" data-cms-move-video="${vIdx}" data-topic-key="${esc(eff.topicKey)}" data-dir="1" ${vIdx === eff.videos.length - 1 ? 'disabled' : ''} title="Descer vídeo">↓</button>
                <button type="button" class="secondary ob-btn-sm" data-cms-open="edit-video" data-topic-key="${esc(eff.topicKey)}" data-item-idx="${vIdx}">
                  ✏️ Editar
                </button>
                <button type="button" class="ob-action-pill ob-btn-sm ob-icon-del" data-cms-delete-video="${vIdx}" data-topic-key="${esc(eff.topicKey)}">
                  🗑️ Excluir
                </button>
              ` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('') : `
      <div class="panel empty video-empty-state">
        <div style="font-size:32px;margin-bottom:8px">🎬</div>
        <h3 style="margin:0 0 6px;color:var(--ink)">Nenhuma videoaula cadastrada neste tópico</h3>
        <p style="margin:0 auto 16px;max-width:440px">
          ${isEdit ? `Clique abaixo para adicionar uma videoaula do YouTube com título e tempo de duração para <strong>${esc(eff.titulo)}</strong>.` : `Nenhuma videoaula cadastrada para <strong>${esc(eff.titulo)}</strong>.`}
        </p>
        ${isEdit ? `
          <button type="button" class="primary" data-cms-open="add-video" data-topic-key="${esc(eff.topicKey)}">
            + Adicionar Videoaula
          </button>
        ` : ''}
      </div>
    `;

    tabBodyHtml = `
      <div class="ob-study-tab-pane">
        <div class="section-head-row" style="margin-bottom:14px">
          <div>
            <div class="eyebrow">Aulas em Vídeo</div>
            <h3 class="section-title" style="font-size:21px;margin:4px 0">Videoaulas: ${esc(eff.titulo)}</h3>
          </div>
          ${isEdit ? `
            <button type="button" class="primary ob-btn-sm" data-cms-open="add-video" data-topic-key="${esc(eff.topicKey)}">
              + Adicionar Videoaula
            </button>
          ` : ''}
        </div>

        <div class="ob-resource-list">
          ${videosListHtml}
        </div>

        <div class="actions" style="margin-top:26px;padding-top:16px;border-top:1px solid var(--line);justify-content:space-between">
          <button type="button" class="secondary" data-switch-topic-tab="resumo">
            ← Voltar para Resumo e Sites
          </button>
          <button type="button" class="primary" data-switch-topic-tab="pratica">
            📝 Ir para Questões do ENEM (${eff.questoesEnem.length}) →
          </button>
        </div>
      </div>
    `;
  }

  /* ABA 3: [ 📝 Questões do ENEM ] */
  else if (activeTab === 'pratica') {
    const enemAnsMap = tProg.enemAnswers || {};
    const letters = ['A', 'B', 'C', 'D', 'E'];

    const enemCardsHtml = eff.questoesEnem.length > 0 ? eff.questoesEnem.map((q, idx) => {
      const aSt = enemAnsMap[q.id] || { selected: null, checked: false };
      const isCorrect = aSt.checked && aSt.selected === q.correta;
      const availableLetters = letters.filter(l => q.alternativas && q.alternativas[l] !== undefined);

      return `
        <article class="ob-practice-q-card enem-official-card">
          <div class="ob-question-header">
            <div class="ob-q-head-left">
              <span class="enem-year-badge">${esc(q.ano || 'ENEM Oficial')}</span>
              <span class="ob-q-badge">Questão ${idx + 1} de ${eff.questoesEnem.length}</span>
              ${q.contexto ? `<span class="ob-situacao-pill">${esc(q.contexto)}</span>` : ''}
            </div>
            ${isEdit ? `
              <div style="display:flex;gap:6px">
                <button type="button" class="ob-action-pill ob-btn-sm" data-cms-open="edit-enem-q" data-topic-key="${esc(eff.topicKey)}" data-item-idx="${idx}">✏️ Editar</button>
                <button type="button" class="ob-action-pill ob-btn-sm ob-icon-del" data-cms-delete-enem-q="${idx}" data-topic-key="${esc(eff.topicKey)}">🗑️ Excluir</button>
              </div>
            ` : ''}
          </div>

          ${q.imagemUrl ? `
            <figure class="q-illustration-box">
              <img src="${esc(q.imagemUrl)}" alt="Imagem da questão ${esc(q.ano)}" class="q-illustration-img">
            </figure>
          ` : ''}

          <div class="ob-q-title enem-q-enunciado">${formatInlineMarkdown(q.enunciado)}</div>

          <div class="enem-options-list" role="radiogroup" aria-label="Alternativas da questão ${idx + 1}">
            ${availableLetters.map(l => {
              let cls = 'enem-option-btn';
              if (aSt.selected === l) cls += ' ob-option-selected';
              if (aSt.checked) {
                if (l === q.correta) cls += ' ob-option-correct';
                else if (aSt.selected === l && l !== q.correta) cls += ' ob-option-wrong';
              }
              return `
                <button type="button" class="${cls}"
                  data-enem-select-q="${esc(q.id)}"
                  data-enem-select-letter="${l}"
                  data-topic-key="${esc(eff.topicKey)}">
                  <span class="ob-option-letter">${l}</span>
                  <span class="ob-option-text">${formatInlineMarkdown(q.alternativas[l])}</span>
                </button>
              `;
            }).join('')}
          </div>

          <div class="actions" style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <button type="button" class="primary ob-btn-sm"
              data-enem-check-q="${esc(q.id)}"
              data-topic-key="${esc(eff.topicKey)}"
              ${!aSt.selected ? 'disabled' : ''}>
              ✓ Verificar resposta e ver resolução
            </button>
            <button type="button" class="secondary ob-btn-sm ai-ask-btn"
              data-ai-explain-q="${esc(q.id)}"
              data-topic-key="${esc(eff.topicKey)}"
              title="Pedir para a Professora IA explicar esta questão do ENEM passo a passo">
              ✨ Explicar com IA
            </button>
            ${aSt.checked ? `
              <span class="op-badge ${isCorrect ? 'mastered' : 'study'}" style="font-size:12px;padding:6px 12px">
                ${isCorrect ? `🎉 Você acertou! Gabarito Oficial: ${q.correta}` : `✕ Resposta incorreta · Gabarito Oficial: ${q.correta}`}
              </span>
            ` : ''}
          </div>

          ${aSt.checked ? `
            <div class="enem-resolution-box ${isCorrect ? 'good' : 'learn'}">
              <div class="eyebrow" style="margin-bottom:6px">📘 Resolução Comentada Passo a Passo (${esc(q.ano || 'ENEM')})</div>
              <div class="enem-resolution-text">${renderMarkdownSummary(q.resolucao || `Alternativa correta: **${q.correta}**.`)}</div>
            </div>
          ` : ''}
        </article>
      `;
    }).join('') : `
      <div class="panel empty">
        <p>Nenhuma questão do ENEM cadastrada neste tópico ainda.</p>
        ${isEdit ? `<button type="button" class="primary ob-btn-sm" data-cms-open="add-enem-q" data-topic-key="${esc(eff.topicKey)}">+ Adicionar Questão do ENEM</button>` : ''}
      </div>
    `;

    tabBodyHtml = `
      <div class="ob-study-tab-pane">
        <div class="section-head-row" style="margin-bottom:14px">
          <div>
            <div class="eyebrow">Questões Oficiais do ENEM Comentadas</div>
            <h3 class="section-title" style="font-size:21px;margin:4px 0">Questões do ENEM: ${esc(eff.titulo)}</h3>
          </div>
          ${isEdit ? `
            <button type="button" class="primary ob-btn-sm" data-cms-open="add-enem-q" data-topic-key="${esc(eff.topicKey)}">
              + Nova Questão ENEM
            </button>
          ` : ''}
        </div>

        <div class="ob-practice-list">
          ${enemCardsHtml}
        </div>

        <div class="ob-confirm-evolution-box">
          <div style="margin-bottom:12px">
            <div class="eyebrow">Conclusão do Tópico</div>
            <h4 style="font-size:17px;margin:4px 0">Finalizou o estudo de "${esc(eff.titulo)}"?</h4>
            <p>Marque este tópico como <strong>Concluído</strong> para registrá-lo na sua <strong>Progressão</strong> e na <strong>Minha Lista</strong>.</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button type="button" class="primary" data-toggle-complete-topic="${esc(eff.topicKey)}">
              ${stInfo.status === 'completed' ? '✓ Tópico Concluído (Clique se quiser reabrir)' : '✓ Marcar Tópico como Concluído / Estudado'}
            </button>
            <button type="button" class="secondary" data-lib-mark-review="${esc(eff.topicKey)}">
              ↻ Marcar para Revisar Depois
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.layout(`
    <div class="back-row" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <button type="button" class="link-btn" data-back-to-catalog="1">
        ← Voltar para ${esc(eff.mod.materia)} · ${esc(eff.mod.assunto)}
      </button>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        ${prevHab ? `<button type="button" class="link-btn" data-open-topic="${esc(buildTopicKey(eff.mod.materiaId, eff.mod.assuntoId, eff.blk.id, prevHab.id))}">← Tópico anterior</button>` : ''}
        ${nextHab ? `<button type="button" class="link-btn" data-open-topic="${esc(buildTopicKey(eff.mod.materiaId, eff.mod.assuntoId, eff.blk.id, nextHab.id))}">Próximo tópico →</button>` : ''}
      </div>
    </div>

    <section class="panel ob-study-workspace-head">
      <div class="ob-study-item-badges">
        <span class="ob-hub-order">${esc(eff.mod.materia)} · ${esc(eff.mod.assunto)} · Bloco ${eff.blk.ordem}</span>
        <span class="op-badge ${stInfo.badgeCls}">${esc(stInfo.label)}</span>
        ${eff.preRequisito ? `<span class="topic-prereq-badge">💡 Pré-requisito recomendado: ${esc(eff.preRequisito)}</span>` : ''}
      </div>

      <div class="ob-workspace-title-row">
        <div>
          <h1 class="page-title" style="font-size:clamp(22px,3vw,30px);margin:4px 0">
            ${esc(eff.titulo)}
          </h1>
          <p class="section-copy" style="margin:0">${esc(eff.blk.titulo)}</p>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <button type="button" class="secondary ob-btn-sm ai-ask-btn" data-ai-ask-topic="${esc(eff.topicKey)}" title="Tirar dúvidas deste assunto com a Professora IA">
            ✨ Dúvidas com IA
          </button>
          <button type="button" class="${stInfo.status === 'completed' ? 'primary' : 'secondary'} ob-btn-sm" data-toggle-complete-topic="${esc(eff.topicKey)}">
            ${stInfo.status === 'completed' ? '✓ Concluído' : '✓ Marcar como Concluído'}
          </button>
          <button type="button" class="secondary ob-btn-sm" data-lib-add-list="${esc(eff.topicKey)}">
            ${inList ? `📌 Na Lista (${esc(inList.status)})` : '+ Minha Lista'}
          </button>
        </div>
      </div>

      <div class="ob-workspace-tabs" role="tablist" aria-label="Abas de estudo do tópico" style="margin-bottom:0;border-bottom:0;padding-bottom:0">
        <button type="button" class="ob-ws-tab ${activeTab === 'resumo' ? 'active' : ''}" data-switch-topic-tab="resumo">
          📖 Resumo e Sites (${eff.sites.length})
        </button>
        <button type="button" class="ob-ws-tab ${activeTab === 'videos' ? 'active' : ''}" data-switch-topic-tab="videos">
          ▶️ Videoaulas (${eff.videos.length})
        </button>
        <button type="button" class="ob-ws-tab ${activeTab === 'pratica' ? 'active' : ''}" data-switch-topic-tab="pratica">
          📝 Questões do ENEM (${eff.questoesEnem.length})
        </button>
      </div>
    </section>

    <section class="panel" style="margin-top:16px;margin-bottom:40px">
      ${tabBodyHtml}
    </section>
  `);
}

/* ══════════════════════════════════════════════════════════════════════════
   8. ÁREA 3: 📌 MINHA LISTA (ORGANIZADOR DE ROTINA SEM RIGIDEZ)
   ══════════════════════════════════════════════════════════════════════════ */
function renderMyListArea() {
  const st = storageService.getActiveState();
  if (!Array.isArray(st.notes) || st.notes.length === 0) st.notes = getDefaultStarterNotes();
  if (!st.activeNoteId && st.notes.length > 0) st.activeNoteId = st.notes[0].id;

  if (st.myListView === 'notes') {
    return renderNotesNotebookArea();
  }

  const subjects = getEffectiveSubjects();
  const modules = getAllModules();
  const list = st.studyList || [];
  const filterStatus = st.listFilterStatus || 'all';
  const filterMat = st.listFilterMateria || 'all';

  const filteredList = list.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterMat !== 'all' && item.materiaId !== filterMat) return false;
    return true;
  });

  const allTopicGroups = [];
  modules.forEach(mod => {
    const group = { label: `${mod.materia} · ${mod.assunto}`, topics: [] };
    (mod.blocos || []).forEach(blk => {
      (blk.habilidades || []).forEach(hab => {
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const eff = getEffectiveTopicData(tKey);
        group.topics.push({
          topicKey: tKey,
          label: eff?.titulo || hab.nome
        });
      });
    });
    if (group.topics.length > 0) allTopicGroups.push(group);
  });

  const counts = {
    all: list.length,
    'A estudar': list.filter(i => i.status === 'A estudar').length,
    'Em andamento': list.filter(i => i.status === 'Em andamento').length,
    'Revisar': list.filter(i => i.status === 'Revisar').length,
    'Concluído': list.filter(i => i.status === 'Concluído').length
  };

  const itemsHtml = filteredList.length > 0 ? filteredList.map(item => {
    const realIndex = list.findIndex(x => x.id === item.id);
    const eff = getEffectiveTopicData(item.topicKey);
    const subjName = eff?.mod?.materia || item.materia || 'Estudo';
    const assuntoName = eff?.mod?.assunto || 'Assunto';
    const prereq = eff?.preRequisito;

    let statusSlug = 'estudar';
    let statusIcon = '⏳';
    if (item.status === 'Concluído') { statusSlug = 'concluido'; statusIcon = '🎉'; }
    else if (item.status === 'Em andamento') { statusSlug = 'andamento'; statusIcon = '⚡'; }
    else if (item.status === 'Revisar') { statusSlug = 'revisar'; statusIcon = '↻'; }

    let prioSlug = 'media';
    if (item.priority === 'Alta') prioSlug = 'alta';
    else if (item.priority === 'Baixa') prioSlug = 'baixa';

    return `
      <article class="my-list-card status-${statusSlug}">
        <div class="my-list-indicator"></div>
        <div class="my-list-body">
          <div class="my-list-top-meta">
            <span class="my-list-badge-subject">${esc(subjName)} · ${esc(assuntoName)}</span>
            <span class="my-list-badge-status ${statusSlug}">${statusIcon} ${esc(item.status)}</span>
            <span class="my-list-badge-prio ${prioSlug}">Prioridade ${esc(item.priority)}</span>
            ${prereq ? `<span class="my-list-badge-prereq">💡 Requer: ${esc(prereq)}</span>` : ''}
          </div>

          <h3 class="my-list-title">${esc(item.title)}</h3>
          ${item.subtitle ? `<p class="my-list-foco">${esc(item.subtitle)}</p>` : ''}

          <div class="my-list-actions">
            <button type="button" class="primary ob-btn-sm" data-open-topic="${esc(item.topicKey)}">
              📖 Estudar Agora (Resumo, Vídeos e Questões) →
            </button>
            <button type="button" class="secondary ob-btn-sm" data-toggle-complete-topic="${esc(item.topicKey)}">
              ${item.status === 'Concluído' ? '↻ Reabrir' : '✓ Concluir'}
            </button>
          </div>
        </div>

        <div class="my-list-side-controls">
          <label class="my-list-ctrl-row">
            <span>Status</span>
            <select class="ob-select" data-list-status-id="${esc(item.id)}">
              <option value="A estudar" ${item.status === 'A estudar' ? 'selected' : ''}>A estudar</option>
              <option value="Em andamento" ${item.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
              <option value="Revisar" ${item.status === 'Revisar' ? 'selected' : ''}>Revisar</option>
              <option value="Concluído" ${item.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
            </select>
          </label>

          <label class="my-list-ctrl-row">
            <span>Prioridade</span>
            <select class="ob-select" data-list-prio-id="${esc(item.id)}">
              <option value="Alta" ${item.priority === 'Alta' ? 'selected' : ''}>Alta</option>
              <option value="Média" ${item.priority === 'Média' ? 'selected' : ''}>Média</option>
              <option value="Baixa" ${item.priority === 'Baixa' ? 'selected' : ''}>Baixa</option>
            </select>
          </label>

          <div class="my-list-order-btns">
            <div style="display:flex;gap:4px">
              <button type="button" class="ob-icon-btn" data-list-move-up="${esc(item.id)}" ${realIndex <= 0 ? 'disabled' : ''} title="Subir item">↑</button>
              <button type="button" class="ob-icon-btn" data-list-move-down="${esc(item.id)}" ${realIndex >= list.length - 1 ? 'disabled' : ''} title="Descer item">↓</button>
            </div>
            <button type="button" class="ob-icon-btn ob-icon-del" data-list-delete="${esc(item.id)}" title="Remover da lista">🗑️ Excluir</button>
          </div>
        </div>
      </article>
    `;
  }).join('') : `
    <div class="panel empty">
      <h3 style="margin:0 0 8px;color:var(--ink)">Sua lista está vazia neste filtro</h3>
      <p style="margin:0 auto 16px;max-width:460px">
        Adicione tópicos abaixo ou clique em <strong>"+ Minha Lista"</strong> em qualquer aula da <strong>Biblioteca de Estudos</strong>.
      </p>
      <button type="button" class="primary" data-main-nav="library">📚 Explorar Biblioteca de Estudos</button>
    </div>
  `;

  /* Sugestões da IA com base no Diagnóstico */
  const diagHistory = st.diagnosticsHistory || {};
  const currentListKeys = new Set(list.map(i => i.topicKey));

  const suggestedMods = modules.filter(m => {
    const hist = diagHistory[m.id];
    if (!hist) return false;
    const nivel = hist.nivelGlobal || hist.veredicto;
    const needsStudy = (
      nivel === 'EM_DESENVOLVIMENTO' ||
      nivel === 'BASICO' ||
      nivel === 'NAO_SEI' ||
      nivel === 'REVISAR' ||
      nivel === 'ESTUDO_NECESSARIO'
    );
    if (!needsStudy) return false;
    const firstHab = m.blocos?.[0]?.habilidades?.[0];
    const tKey = firstHab ? buildTopicKey(m.materiaId, m.assuntoId, m.blocos[0].id, firstHab.id) : null;
    if (tKey && currentListKeys.has(tKey)) return false;
    const alreadyInList = list.some(item => {
      if (item.topicKey && item.topicKey.includes(`${m.materiaId}__${m.assuntoId}`)) return true;
      if (item.materiaId === m.materiaId && item.assunto === m.assunto) return true;
      return false;
    });
    return !alreadyInList;
  });

  let aiSuggestionsHtml = '';
  if (suggestedMods.length > 0) {
    if (st.hideAiSuggestions) {
      aiSuggestionsHtml = `
        <div class="my-list-ai-collapsed-pill">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:16px">✨</span>
            <span>A Professora IA tem <strong>${suggestedMods.length} ${suggestedMods.length === 1 ? 'sugestão' : 'sugestões'} de estudo</strong> baseada(s) no seu diagnóstico.</span>
          </div>
          <button type="button" class="secondary ob-btn-sm" data-toggle-ai-suggestions="1">
            👁️ Ver Sugestões da IA
          </button>
        </div>
      `;
    } else {
      const cardsHtml = suggestedMods.map(m => {
        const hist = diagHistory[m.id];
        const nivel = hist.nivelGlobal || hist.veredicto;
        const isUrgente = nivel === 'NAO_SEI' || nivel === 'ESTUDO_NECESSARIO';
        const isBasico = nivel === 'BASICO';
        const badgeHtml = getMasteryBadgeHtml(nivel);
        const reasonText = isUrgente
          ? 'Diagnóstico indicou ausência de base neste tópico. Recomendado estudar desde os conceitos essenciais.'
          : isBasico
          ? 'Diagnóstico indicou compreensão inicial com lacunas em fundamentos. Recomendado reforçar a teoria.'
          : 'Diagnóstico indicou boa noção, com oscilação em distratores e pegadinhas. Recomendado revisar com questões.';

        return `
          <article class="ai-suggestion-card ${isUrgente ? 'border-estudo' : isBasico ? 'border-basico' : 'border-revisao'}">
            <div class="ai-sug-card-head">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:24px">${m.icone || '📘'}</span>
                <div>
                  <div style="font-size:11.5px;color:var(--muted);font-weight:600">${esc(m.materia)}</div>
                  <strong style="font-size:15px;color:var(--ink)">${esc(m.assunto)}</strong>
                </div>
              </div>
              ${badgeHtml}
            </div>

            <p class="ai-sug-reason">${reasonText}</p>

            <div class="ai-sug-card-actions">
              <button type="button" class="primary ob-btn-sm" data-add-suggested-to-list="${esc(m.id)}">
                + Adicionar à Minha Lista
              </button>
              <button type="button" class="secondary ob-btn-sm" data-quick-library="${esc(m.id)}">
                📖 Ver Roteiro
              </button>
            </div>
          </article>
        `;
      }).join('');

      aiSuggestionsHtml = `
        <section class="panel ai-suggestions-panel">
          <div class="ai-sug-header">
            <div style="display:flex;align-items:center;gap:10px">
              <div class="ai-sug-icon-bubble">✨</div>
              <div>
                <h3 style="margin:0;font-size:16px;color:var(--ink);display:flex;align-items:center;gap:6px">
                  Sugestões da Professora IA
                  <span class="op-badge" style="background:#e0f2fe;color:#0369a1;font-weight:600">${suggestedMods.length} ${suggestedMods.length === 1 ? 'conteúdo recomendado' : 'conteúdos recomendados'}</span>
                </h3>
                <p style="margin:2px 0 0;font-size:12.5px;color:var(--muted)">
                  Identificados através do seu <strong>Diagnóstico Adaptativo</strong>. Você pode adicioná-los à sua rotina quando quiser:
                </p>
              </div>
            </div>
            <button type="button" class="ob-icon-btn" data-toggle-ai-suggestions="1" title="Ocultar sugestões da IA" style="padding:4px 8px;font-size:12px;color:var(--muted)">
              ✕ Ocultar
            </button>
          </div>

          <div class="ai-suggestions-grid">
            ${cardsHtml}
          </div>
        </section>
      `;
    }
  } else if (Object.keys(diagHistory).length === 0 && !st.hideAiSuggestions) {
    aiSuggestionsHtml = `
      <div class="ai-suggestions-banner empty-diag">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:26px">🎯</span>
          <div>
            <strong style="display:block;font-size:13.5px;color:var(--ink)">Quer sugestões inteligentes de estudo?</strong>
            <small style="color:var(--muted);font-size:12px">Faça um diagnóstico rápido com a IA para descobrir o que você já domina e o que priorizar.</small>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button type="button" class="primary ob-btn-sm" data-main-nav="diagnostics">🎯 Fazer Diagnóstico com IA</button>
          <button type="button" class="ob-icon-btn" data-toggle-ai-suggestions="1" title="Ocultar">✕</button>
        </div>
      </div>
    `;
  }

  window.layout(`
    <section class="op-hero" style="padding-bottom:14px">
      <div>
        <div class="eyebrow">Organização Pessoal</div>
        <h1 class="page-title">Minha Lista de Estudos</h1>
        <p class="lede">
          Organize os tópicos que você quer estudar, revisar ou já concluiu. Clique em <strong>Estudar Agora</strong> para abrir direto os resumos, vídeos e questões.
        </p>
      </div>
    </section>

    <!-- Switcher: Minha Lista vs Caderno de Anotações -->
    <div class="my-list-view-switcher" style="margin-bottom:20px">
      <button type="button" class="my-list-view-tab active" data-switch-my-list-view="list">
        <span>📌 Lista de Estudos</span>
        <span class="view-pill-count">${counts.all}</span>
      </button>
      <button type="button" class="my-list-view-tab" data-switch-my-list-view="notes">
        <span>📓 Caderno de Anotações (Notion)</span>
        <span class="view-pill-count">${(st.notes || []).length}</span>
      </button>
    </div>

    <section class="my-list-summary-bar">
      <div class="my-list-stat-pill">
        <strong>${counts.all}</strong>
        <span>Total na Lista</span>
      </div>
      <div class="my-list-stat-pill">
        <strong style="color:#64748b">${counts['A estudar']}</strong>
        <span>A Estudar</span>
      </div>
      <div class="my-list-stat-pill">
        <strong style="color:#2563eb">${counts['Em andamento']}</strong>
        <span>Em Andamento</span>
      </div>
      <div class="my-list-stat-pill">
        <strong style="color:#d97706">${counts['Revisar']}</strong>
        <span>Para Revisar</span>
      </div>
      <div class="my-list-stat-pill">
        <strong style="color:#16a34a">${counts['Concluído']}</strong>
        <span>Concluídos 🎉</span>
      </div>
    </section>

    <section class="panel ob-study-toolbar">
      <div class="lib-filters-group" style="width:100%">
        <div class="ob-filter-pills" role="tablist">
          ${['all', 'A estudar', 'Em andamento', 'Revisar', 'Concluído'].map(f => `
            <button type="button" class="ob-filter-pill ${filterStatus === f ? 'active' : ''}" data-list-filter-status="${f}">
              ${f === 'all' ? 'Todos os Status' : f} (${counts[f] || 0})
            </button>
          `).join('')}
        </div>

        <div class="ob-filter-pills" style="margin-top:8px" role="tablist">
          <button type="button" class="ob-filter-pill ${filterMat === 'all' ? 'active' : ''}" data-list-filter-mat="all">Todas as Matérias</button>
          ${subjects.map(s => `
            <button type="button" class="ob-filter-pill ${filterMat === s.id ? 'active' : ''}" data-list-filter-mat="${esc(s.id)}">
              ${s.icone || '📘'} ${esc(s.nome)}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="ob-manual-add-box" style="width:100%;margin-top:10px;padding-top:12px;border-top:1px solid var(--line)">
        <select id="ob-manual-topic-select" class="ob-select" style="flex:1">
          <option value="">+ Escolher um tópico para adicionar à Minha Lista...</option>
          ${allTopicGroups.map(grp => `
            <optgroup label="${esc(grp.label)}">
              ${grp.topics.map(t => `<option value="${esc(t.topicKey)}">${esc(t.label)}</option>`).join('')}
            </optgroup>
          `).join('')}
        </select>
        <button type="button" class="primary ob-btn-sm" data-list-manual-add="1">Adicionar</button>
      </div>
    </section>

    ${aiSuggestionsHtml}

    <section class="my-list-container">
      ${itemsHtml}
    </section>
  `);
}

/* ══════════════════════════════════════════════════════════════════════════
   8.5 CADERNO DE ANOTAÇÕES MODULAR (ESTILO NOTION)
   ══════════════════════════════════════════════════════════════════════════ */
function compressAndReadImageFile(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const rawUrl = e.target.result;
    const img = new Image();
    img.onload = () => {
      const maxDim = 1200;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', 0.85));
      } else {
        callback(rawUrl);
      }
    };
    img.onerror = () => callback(rawUrl);
    img.src = rawUrl;
  };
  reader.readAsDataURL(file);
}

function renderNotesNotebookArea() {
  const st = storageService.getActiveState();
  if (!Array.isArray(st.notes) || st.notes.length === 0) {
    st.notes = getDefaultStarterNotes();
  }
  if (!st.activeNoteId || !st.notes.some(n => n.id === st.activeNoteId)) {
    st.activeNoteId = st.notes[0]?.id || null;
  }

  const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId) || st.notes[0] || {
    id: 'empty_note',
    title: 'Nova Página',
    icon: '📝',
    materiaId: 'geral',
    materia: 'Geral',
    blocks: []
  };

  const subjects = getEffectiveSubjects();
  const modules = getAllModules();
  const searchQ = (st.noteSearch || '').toLowerCase().trim();

  const filteredNotes = searchQ
    ? st.notes.filter(n => (n.title || '').toLowerCase().includes(searchQ) || (n.materia || '').toLowerCase().includes(searchQ))
    : st.notes;

  const sidebarPagesHtml = filteredNotes.map(note => `
    <div class="notion-sidebar-item ${note.id === activeNote.id ? 'active' : ''}" data-select-note="${esc(note.id)}">
      <span class="notion-sidebar-icon">${note.icon || '📝'}</span>
      <span class="notion-sidebar-title">${esc(note.title || 'Sem título')}</span>
      ${note.materia ? `<span class="notion-sidebar-mat-badge">${esc(note.materia)}</span>` : ''}
      <button type="button" class="notion-sidebar-del-btn" data-delete-note="${esc(note.id)}" title="Excluir página">✕</button>
    </div>
  `).join('');

  const subjectsOptionsHtml = subjects.map(s => `
    <option value="${esc(s.id)}" ${activeNote.materiaId === s.id ? 'selected' : ''}>${s.icone || '📘'} ${esc(s.nome)}</option>
  `).join('');

  const currentSubjMods = modules.filter(m => m.materiaId === activeNote.materiaId);
  const topicsOptionsHtml = currentSubjMods.map(m => `
    <optgroup label="${esc(m.assunto)}">
      ${(m.blocos || []).flatMap(b => (b.habilidades || []).map(h => {
        const tKey = buildTopicKey(m.materiaId, m.assuntoId, b.id, h.id);
        return `<option value="${esc(tKey)}" ${activeNote.topicKey === tKey ? 'selected' : ''}>${esc(h.nome)}</option>`;
      })).join('')}
    </optgroup>
  `).join('');

  const blocksHtml = (activeNote.blocks || []).map((b, idx) => {
    let blockContentHtml = '';

    if (b.type === 'h1' || b.type === 'h2' || b.type === 'h3') {
      const cls = b.type === 'h1' ? 'notion-h1' : b.type === 'h2' ? 'notion-h2' : 'notion-h3';
      const pl = b.type === 'h1' ? 'Título Grande (H1)...' : b.type === 'h2' ? 'Subtítulo (H2)...' : 'Subseção (H3)...';
      blockContentHtml = `
        <input type="text" class="notion-block-input ${cls}" data-note-block-id="${esc(b.id)}" value="${esc(b.content || '')}" placeholder="${pl}">
      `;
    } else if (b.type === 'bullet') {
      blockContentHtml = `
        <div class="notion-bullet-row">
          <span class="notion-bullet-dot">•</span>
          <textarea class="notion-block-input notion-bullet" data-note-block-id="${esc(b.id)}" placeholder="Item da lista...">${esc(b.content || '')}</textarea>
        </div>
      `;
    } else if (b.type === 'todo') {
      blockContentHtml = `
        <div class="notion-todo-row">
          <input type="checkbox" class="notion-todo-check" data-note-todo-id="${esc(b.id)}" ${b.checked ? 'checked' : ''}>
          <textarea class="notion-block-input notion-todo ${b.checked ? 'is-checked' : ''}" data-note-block-id="${esc(b.id)}" placeholder="Tarefa / meta de estudo...">${esc(b.content || '')}</textarea>
        </div>
      `;
    } else if (b.type === 'callout') {
      blockContentHtml = `
        <div class="notion-callout">
          <button type="button" class="notion-callout-icon-btn" data-change-callout-icon="${esc(b.id)}" title="Clique para trocar emoji">${b.icon || '💡'}</button>
          <textarea class="notion-block-input notion-callout-text" data-note-block-id="${esc(b.id)}" placeholder="Destaque importante, macete ou pegadinha do ENEM...">${esc(b.content || '')}</textarea>
        </div>
      `;
    } else if (b.type === 'quote') {
      blockContentHtml = `
        <div class="notion-quote">
          <textarea class="notion-block-input notion-quote-text" data-note-block-id="${esc(b.id)}" placeholder="Citação ou frase-chave...">${esc(b.content || '')}</textarea>
        </div>
      `;
    } else if (b.type === 'code') {
      blockContentHtml = `
        <div class="notion-code">
          <div class="notion-code-header">
            <span>📐 Fórmula / Modelo Matemático</span>
          </div>
          <textarea class="notion-block-input notion-code-text" data-note-block-id="${esc(b.id)}" placeholder="Cole fórmulas, deduções ou modelos aqui...">${esc(b.content || '')}</textarea>
        </div>
      `;
    } else if (b.type === 'image') {
      if (b.src) {
        blockContentHtml = `
          <div class="notion-image-card">
            <img src="${b.src}" alt="Imagem anexada" class="notion-img-preview">
            <input type="text" class="notion-img-caption" data-note-block-id="${esc(b.id)}" data-field="caption" value="${esc(b.caption || '')}" placeholder="Adicionar legenda à imagem...">
            <div class="notion-img-actions">
              <label class="secondary ob-btn-sm" style="cursor:pointer">
                🔄 Trocar imagem
                <input type="file" accept="image/*" class="notion-file-input" data-note-image-upload="${esc(b.id)}" style="display:none">
              </label>
            </div>
          </div>
        `;
      } else {
        blockContentHtml = `
          <div class="notion-image-placeholder">
            <label class="notion-upload-zone" style="cursor:pointer">
              <span style="font-size:32px">📷</span>
              <strong>Clique para anexar imagem da aula, diagrama ou fórmula</strong>
              <small style="color:var(--muted)">Formatos PNG, JPG, WEBP salvos localmente</small>
              <input type="file" accept="image/*" class="notion-file-input" data-note-image-upload="${esc(b.id)}" style="display:none">
            </label>
          </div>
        `;
      }
    } else if (b.type === 'reference') {
      blockContentHtml = `
        <div class="notion-ref-card">
          <div class="notion-ref-icon">🔗</div>
          <div style="flex:1">
            <input type="text" class="notion-ref-title" data-note-block-id="${esc(b.id)}" data-field="title" value="${esc(b.title || '')}" placeholder="Título da Referência, Artigo ou Vídeo">
            <input type="url" class="notion-ref-url" data-note-block-id="${esc(b.id)}" data-field="url" value="${esc(b.url || '')}" placeholder="https://link-da-referencia.com">
          </div>
          ${b.url ? `<a href="${esc(b.url)}" target="_blank" rel="noopener noreferrer" class="secondary ob-btn-sm" style="align-self:center">↗ Abrir</a>` : ''}
        </div>
      `;
    } else if (b.type === 'divider') {
      blockContentHtml = `<div class="notion-divider"><hr></div>`;
    } else {
      blockContentHtml = `
        <textarea class="notion-block-input notion-p" data-note-block-id="${esc(b.id)}" placeholder="Escreva algo ou use notação matemática (ex: c = 3 × 10⁸ m/s)...">${esc(b.content || '')}</textarea>
      `;
    }

    return `
      <div class="notion-block-row" data-block-id="${esc(b.id)}">
        <div class="notion-block-controls">
          <button type="button" class="notion-ctrl-btn" data-move-block-up="${esc(b.id)}" ${idx === 0 ? 'disabled' : ''} title="Mover bloco para cima">↑</button>
          <button type="button" class="notion-ctrl-btn" data-move-block-down="${esc(b.id)}" ${idx === activeNote.blocks.length - 1 ? 'disabled' : ''} title="Mover bloco para baixo">↓</button>
          <button type="button" class="notion-ctrl-btn del" data-delete-block="${esc(b.id)}" title="Excluir este bloco">✕</button>
        </div>
        <div class="notion-block-content">
          ${blockContentHtml}
        </div>
      </div>
    `;
  }).join('');

  const emojiList = ['📝', '🔬', '📐', '🧪', '🧬', '📚', '✍️', '🎯', '💡', '⚡', '⭐', '🚀', '🧠', '📖', '🔖', '📌', '🏆'];

  window.layout(`
    <section class="op-hero" style="padding-bottom:14px">
      <div>
        <div class="eyebrow">Organização & Escrita</div>
        <h1 class="page-title">Caderno de Anotações</h1>
        <p class="lede">
          Seu espaço modular estilo Notion para resumir matérias, anotar macetes, referências e colar imagens das aulas do ENEM.
        </p>
      </div>
    </section>

    <!-- Switcher: Minha Lista vs Caderno de Anotações -->
    <div class="my-list-view-switcher" style="margin-bottom:20px">
      <button type="button" class="my-list-view-tab" data-switch-my-list-view="list">
        <span>📌 Lista de Estudos</span>
        <span class="view-pill-count">${(st.studyList || []).length}</span>
      </button>
      <button type="button" class="my-list-view-tab active" data-switch-my-list-view="notes">
        <span>📓 Caderno de Anotações (Notion)</span>
        <span class="view-pill-count">${(st.notes || []).length}</span>
      </button>
    </div>

    <!-- Container Principal do Notion (Sidebar + Canvas) -->
    <div class="notion-notebook-container">
      <!-- SIDEBAR NOTION -->
      <aside class="notion-sidebar">
        <div class="notion-sidebar-head">
          <button type="button" class="primary ob-btn-sm" data-create-new-note="1" style="width:100%;justify-content:center">
            <span>+</span> Nova Página
          </button>
        </div>

        <div style="padding:10px 14px 4px">
          <input type="search" id="notion-search-input" class="notion-search-input" placeholder="🔍 Buscar páginas..." value="${esc(st.noteSearch || '')}">
        </div>

        <div class="notion-sidebar-list">
          ${sidebarPagesHtml || '<div style="padding:14px;color:var(--muted);font-size:12.5px;text-align:center">Nenhuma página encontrada.</div>'}
        </div>

        <div class="notion-sidebar-footer">
          <span>${(st.notes || []).length} ${st.notes?.length === 1 ? 'página salva' : 'páginas salvas'}</span>
        </div>
      </aside>

      <!-- CANVAS DO DOCUMENTO NOTION -->
      <main class="notion-canvas">
        <div class="notion-doc-top-bar">
          <!-- Seletor de Ícone Emoji -->
          <div class="notion-icon-picker-wrap">
            <button type="button" class="notion-page-icon-btn" data-toggle-emoji-popover="1" title="Clique para trocar o emoji da página">
              ${activeNote.icon || '📝'}
            </button>
            <div class="notion-emoji-popover ${st.showEmojiPopover ? 'is-open' : ''}" id="notion-emoji-popover">
              ${emojiList.map(em => `
                <button type="button" class="notion-emoji-opt" data-select-emoji="${em}">${em}</button>
              `).join('')}
            </div>
          </div>

          <!-- Ações do Documento -->
          <div style="display:flex;gap:8px;align-items:center;margin-left:auto;flex-wrap:wrap">
            <button type="button" class="secondary ob-btn-sm" data-ai-review-note="${esc(activeNote.id)}" title="Pedir para a Professora IA revisar este resumo">
              ✨ Revisar com Professora IA
            </button>
            <button type="button" class="ob-icon-btn ob-icon-del" data-delete-note="${esc(activeNote.id)}" title="Excluir esta página">
              🗑️
            </button>
          </div>
        </div>

        <!-- Título da Página (Editável estilo Notion) -->
        <input type="text" id="notion-page-title" class="notion-page-title-input" value="${esc(activeNote.title || '')}" placeholder="Sem título">

        <!-- Propriedades da Página (Properties: Matéria, Tópico e Data) -->
        <div class="notion-props-panel">
          <div class="notion-prop-row">
            <span class="notion-prop-label">🏷️ Matéria</span>
            <select class="notion-prop-select" data-note-materia="1">
              <option value="geral" ${activeNote.materiaId === 'geral' ? 'selected' : ''}>🌐 Geral (Interdisciplinar)</option>
              ${subjectsOptionsHtml}
            </select>
          </div>

          <div class="notion-prop-row">
            <span class="notion-prop-label">📚 Tópico do Site</span>
            <select class="notion-prop-select" data-note-topic="1">
              <option value="">(Nenhum tópico vinculado)</option>
              ${topicsOptionsHtml}
            </select>
            ${activeNote.topicKey ? `
              <button type="button" class="link-btn" data-open-topic="${esc(activeNote.topicKey)}" style="font-size:12px;margin-left:8px;white-space:nowrap">
                📖 Ver Aula no Portal ↗
              </button>
            ` : ''}
          </div>

          <div class="notion-prop-row">
            <span class="notion-prop-label">🕒 Atualização</span>
            <span style="font-size:12px;color:var(--muted)">${new Date(activeNote.updatedAt || Date.now()).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <!-- Fluxo de Blocos Modulares -->
        <div class="notion-blocks-stream">
          ${blocksHtml}
        </div>

        <!-- Barra Rápida de Adição de Novos Blocos -->
        <div class="notion-add-block-bar">
          <span style="font-size:11.5px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px">+ Inserir:</span>
          <button type="button" class="notion-tool-btn" data-add-block-type="p"><span>¶</span> Texto</button>
          <button type="button" class="notion-tool-btn" data-add-block-type="h2"><span>H2</span> Título</button>
          <button type="button" class="notion-tool-btn" data-add-block-type="h3"><span>H3</span> Subtítulo</button>
          <button type="button" class="notion-tool-btn" data-add-block-type="bullet"><span>•</span> Lista</button>
          <button type="button" class="notion-tool-btn" data-add-block-type="todo"><span>☑</span> Tarefa</button>
          <button type="button" class="notion-tool-btn" data-add-block-type="callout"><span>💡</span> Destaque</button>
          <button type="button" class="notion-tool-btn" data-add-block-type="code"><span>📐</span> Fórmula</button>
          <label class="notion-tool-btn" style="cursor:pointer">
            <span>📷</span> Anexar Imagem
            <input type="file" accept="image/*" data-add-image-block="1" style="display:none">
          </label>
          <button type="button" class="notion-tool-btn" data-add-block-type="reference"><span>🔗</span> Referência</button>
          <button type="button" class="notion-tool-btn" data-add-block-type="divider"><span>—</span> Divisor</button>
        </div>
      </main>
    </div>
  `);
}

/* ══════════════════════════════════════════════════════════════════════════
   9. ÁREA 4: 📈 PROGRESSÃO (SIMPLIFICADA, DIRETA E COM ACORDEÕES ⌄)
   ══════════════════════════════════════════════════════════════════════════ */
function renderProgressionArea() {
  const st = storageService.getActiveState();
  const subjects = getEffectiveSubjects();
  const modules = getAllModules();
  const filterMat = st.progFilterMateria || 'all';
  if (!st.openAccordions) st.openAccordions = {};

  const visibleModules = modules.filter(m => filterMat === 'all' || m.materiaId === filterMat);

  let totalTopics = 0;
  let completedTopics = 0;
  let inProgressTopics = 0;
  let totalEnemAnswered = 0;
  let totalEnemCorrect = 0;

  visibleModules.forEach(mod => {
    (mod.blocos || []).forEach(blk => {
      (blk.habilidades || []).forEach(hab => {
        totalTopics++;
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const stInfo = getTopicStudyStatus(tKey);
        if (stInfo.status === 'completed') completedTopics++;
        else if (stInfo.status === 'in_progress' || stInfo.status === 'review') inProgressTopics++;
        totalEnemAnswered += stInfo.enemDone;
        totalEnemCorrect += stInfo.enemCorrect;
      });
    });
  });

  const pctTopics = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const pctEnem = totalEnemAnswered > 0 ? Math.round((totalEnemCorrect / totalEnemAnswered) * 100) : null;

  const modulesBreakdownHtml = visibleModules.map(mod => {
    let modTopicsTotal = 0;
    let modCompleted = 0;
    let modEnemDone = 0;
    let modEnemCorrect = 0;

    const blocksAccHtml = (mod.blocos || []).map(blk => {
      let blkCompleted = 0;
      const blkHabs = blk.habilidades || [];

      const topicRowsHtml = blkHabs.map(hab => {
        modTopicsTotal++;
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const eff = getEffectiveTopicData(tKey);
        const stInfo = getTopicStudyStatus(tKey);

        if (stInfo.status === 'completed') {
          modCompleted++;
          blkCompleted++;
        }
        modEnemDone += stInfo.enemDone;
        modEnemCorrect += stInfo.enemCorrect;

        return `
          <div class="prog-skill-row">
            <div class="prog-skill-info">
              <div class="prog-skill-top">
                <strong>${esc(eff?.titulo || hab.nome)}</strong>
                <span class="op-badge ${stInfo.badgeCls}">${esc(stInfo.label)}</span>
              </div>
              <div class="prog-skill-meta">
                <span>📝 <strong>Questões do ENEM praticadas:</strong> ${stInfo.enemDone} de ${stInfo.enemTotal} (${stInfo.enemCorrect} acerto(s))</span>
              </div>
            </div>
            <div class="prog-skill-actions">
              <button type="button" class="${stInfo.status === 'completed' ? 'secondary' : 'primary'} ob-btn-sm" data-toggle-complete-topic="${esc(tKey)}">
                ${stInfo.status === 'completed' ? '✓ Concluído' : 'Marcar Concluído'}
              </button>
              <button type="button" class="secondary ob-btn-sm" data-open-topic="${esc(tKey)}">
                📖 Abrir Aula
              </button>
            </div>
          </div>
        `;
      }).join('');

      const progBlkAccId = `prog_blk_${mod.id}_${blk.id}`;
      const defaultOpen = (mod.blocos || []).length === 1;
      const isProgBlkOpen = st.openAccordions[progBlkAccId] !== undefined ? st.openAccordions[progBlkAccId] : defaultOpen;

      return `
        <details class="clean-accordion lib-block-accordion" data-acc-id="${esc(progBlkAccId)}" ${isProgBlkOpen ? 'open' : ''}>
          <summary class="clean-accordion-summary lib-block-summary">
            <div class="clean-acc-left">
              <span class="ob-hub-order">Bloco ${blk.ordem}</span>
              <div class="clean-acc-titles">
                <strong class="lib-block-title">${esc(blk.titulo)}</strong>
                <small class="clean-acc-sub">${blkCompleted} de ${blkHabs.length} tópicos concluídos</small>
              </div>
            </div>
            <div class="clean-acc-right">
              <span class="acc-chevron" aria-hidden="true">⌄</span>
            </div>
          </summary>
          <div class="clean-accordion-body lib-block-body">
            <div class="prog-skills-table">
              ${topicRowsHtml}
            </div>
          </div>
        </details>
      `;
    }).join('');

    const modPct = modTopicsTotal > 0 ? Math.round((modCompleted / modTopicsTotal) * 100) : 0;
    const progModAccId = `prog_mod_${mod.id}`;
    const isProgModOpen = st.openAccordions[progModAccId] === true;

    return `
      <details class="panel clean-accordion prog-module-accordion" data-acc-id="${esc(progModAccId)}" ${isProgModOpen ? 'open' : ''}>
        <summary class="clean-accordion-summary lib-module-summary">
          <div class="clean-acc-left">
            <span class="lib-module-icon">${mod.icone || '📘'}</span>
            <div class="clean-acc-titles">
              <span class="eyebrow">${esc(mod.materia)}</span>
              <h3 class="section-title" style="margin:2px 0;font-size:21px">${esc(mod.assunto)}</h3>
              <small class="clean-acc-sub">
                <strong>${modCompleted} de ${modTopicsTotal}</strong> tópicos concluídos (${modPct}%) ·
                <strong>${modEnemDone}</strong> questões do ENEM praticadas (${modEnemCorrect} acertos)
              </small>
            </div>
          </div>
          <div class="clean-acc-right">
            <span class="acc-hint-label">${modPct}% concluído</span>
            <span class="acc-chevron" aria-hidden="true">⌄</span>
          </div>
        </summary>

        <div class="clean-accordion-body lib-module-body">
          <div class="lib-blocks-stack">
            ${blocksAccHtml}
          </div>
        </div>
      </details>
    `;
  }).join('');

  window.layout(`
    <section class="op-hero" style="padding-bottom:14px">
      <div>
        <div class="eyebrow">Acompanhamento Direto</div>
        <h1 class="page-title">Sua Progressão</h1>
        <p class="lede">
          Veja quais aulas e tópicos você já concluiu e acompanhe as questões do ENEM que já praticou. Clique em qualquer matéria abaixo para expandir os detalhes.
        </p>
      </div>
    </section>

    <section class="panel lib-filter-bar" style="margin-bottom:20px">
      <div class="ob-filter-pills" role="tablist">
        <button type="button" class="ob-filter-pill ${filterMat === 'all' ? 'active' : ''}" data-prog-filter-mat="all">Todas as Matérias</button>
        ${subjects.map(s => `
          <button type="button" class="ob-filter-pill ${filterMat === s.id ? 'active' : ''}" data-prog-filter-mat="${esc(s.id)}">
            ${s.icone || '📘'} ${esc(s.nome)}
          </button>
        `).join('')}
      </div>
    </section>

    <section class="panel" style="margin-bottom:22px;padding:20px">
      <div class="ob-perf-metrics-row">
        <div class="ob-perf-metric">
          <span class="ob-perf-num">${completedTopics} / ${totalTopics}</span>
          <span class="ob-perf-label">Tópicos Concluídos (${pctTopics}%)</span>
        </div>
        <div class="ob-perf-metric">
          <span class="ob-perf-num">${inProgressTopics}</span>
          <span class="ob-perf-label">Tópicos em Estudo ou Revisão</span>
        </div>
        <div class="ob-perf-metric">
          <span class="ob-perf-num">${totalEnemAnswered}</span>
          <span class="ob-perf-label">Questões do ENEM Praticadas (${totalEnemCorrect} acertos${pctEnem !== null ? ` · ${pctEnem}%` : ''})</span>
        </div>
      </div>
    </section>

    <div class="prog-modules-stack" style="margin-bottom:40px">
      ${modulesBreakdownHtml}
    </div>
  `);
}


/* ══════════════════════════════════════════════════════════════════════════
   10. MODAIS: ONBOARDING (NOME EM BRANCO), PERFIL E CMS VISUAL 100% EDITÁVEL
   ══════════════════════════════════════════════════════════════════════════ */
function renderOnboardingModal(isFirstSetup) {
  return `
    <div class="ob-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ob-welcome-title">
      <div class="panel ob-modal-card">
        <div class="eyebrow">${isFirstSetup ? 'Bem-vinda(o) ao Meu ENEM' : 'Novo Perfil Local'}</div>
        <h2 id="ob-welcome-title" class="section-title" style="margin-top:4px">
          ${isFirstSetup ? 'Crie seu perfil para começar' : 'Criar novo perfil de estudo'}
        </h2>
        <p class="section-copy" style="margin-bottom:18px">
          Escolha seu nome e seu ritmo de estudo preferido. Seus dados ficam salvos neste navegador e você pode exportar backup em JSON quando quiser pelo menu <strong>☰</strong>.
        </p>

        <div class="ob-form-grid">
          <label class="ob-field">
            <span>Seu nome *</span>
            <input type="text" id="ob-prof-name" placeholder="Digite seu nome..." value="" autocomplete="off" autofocus>
          </label>

          <label class="ob-field">
            <span>Foco atual / Curso ou Meta no ENEM (opcional)</span>
            <input type="text" id="ob-prof-goal" placeholder="Ex.: Focar em Natureza e Matemática" value="">
          </label>

          <label class="ob-field">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:4px">
              <span>Chave de API do Google Gemini (Opcional)</span>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style="font-size:11.5px;color:var(--green);font-weight:700">Obter chave grátis no Google AI Studio ↗</a>
            </div>
            <input type="text" id="ob-prof-apikey" placeholder="Cole sua chave AIzaSy... (opcional)" value="${esc(window.aiService?.getApiKey?.() || '')}" autocomplete="off" style="font-family:monospace;letter-spacing:0.5px">
            <small style="font-size:11.5px;color:var(--muted);margin-top:4px;line-height:1.45;display:block">
              🔒 <strong>100% Privada e Segura:</strong> Sua chave fica salva exclusivamente no seu navegador (<code>localStorage</code>) e <strong>nunca</strong> sobe para o GitHub. Assim o Google nunca desabilitará sua chave por exposição pública!
            </small>
          </label>

          <div class="ob-field">
            <span>Ritmo de sessão preferido</span>
            <div class="ob-pace-grid" id="ob-pace-selector">
              <label class="ob-pace-option">
                <input type="radio" name="ob-pace" value="curto">
                <strong>Curto</strong>
                <small>10–15 min</small>
              </label>
              <label class="ob-pace-option selected">
                <input type="radio" name="ob-pace" value="medio" checked>
                <strong>Médio</strong>
                <small>25–30 min</small>
              </label>
              <label class="ob-pace-option">
                <input type="radio" name="ob-pace" value="livre">
                <strong>Livre</strong>
                <small>Sem tempo fixo</small>
              </label>
            </div>
          </div>
        </div>

        <div class="actions" style="margin-top:22px;justify-content:flex-end">
          ${isFirstSetup
            ? `<button type="button" class="secondary" data-profile-action="skip-onboarding">Entrar direto como Estudante</button>`
            : `<button type="button" class="secondary" data-profile-action="close-modal">Cancelar</button>`}
          <button type="button" class="primary" data-profile-action="save-new-profile">
            Começar meus estudos →
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderEditProfileModal() {
  const prof = storageService.getActiveProfile();
  if (!prof) return '';
  return `
    <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
      <div class="panel ob-modal-card">
        <div class="eyebrow">Configurações do Perfil</div>
        <h2 class="section-title" style="margin-top:4px">Editar Perfil Atual</h2>
        <div class="ob-form-grid" style="margin-top:14px">
          <label class="ob-field">
            <span>Nome *</span>
            <input type="text" id="ob-edit-prof-name" value="${esc(prof.name)}" autocomplete="off">
          </label>
          <label class="ob-field">
            <span>Foco atual / Meta no ENEM</span>
            <input type="text" id="ob-edit-prof-goal" value="${esc(prof.goal || '')}">
          </label>
          <label class="ob-field">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:4px">
              <span>Chave de API do Google Gemini</span>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style="font-size:11.5px;color:var(--green);font-weight:700">Obter chave grátis no Google AI Studio ↗</a>
            </div>
            <input type="text" id="ob-edit-prof-apikey" placeholder="Cole sua chave AIzaSy..." value="${esc(prof.apiKey || window.aiService?.getApiKey?.() || '')}" autocomplete="off" style="font-family:monospace;letter-spacing:0.5px">
            <small style="font-size:11.5px;color:var(--muted);margin-top:4px;line-height:1.45;display:block">
              🔒 Salva exclusivamente no seu navegador (<code>localStorage</code>) e nunca enviada ao GitHub.
            </small>
          </label>
          <div class="ob-field">
            <span>Ritmo de sessão preferido</span>
            <div class="ob-pace-grid" id="ob-pace-selector">
              <label class="ob-pace-option ${prof.pace === 'curto' ? 'selected' : ''}">
                <input type="radio" name="ob-edit-pace" value="curto" ${prof.pace === 'curto' ? 'checked' : ''}>
                <strong>Curto</strong>
                <small>10–15 min</small>
              </label>
              <label class="ob-pace-option ${(!prof.pace || prof.pace === 'medio') ? 'selected' : ''}">
                <input type="radio" name="ob-edit-pace" value="medio" ${(!prof.pace || prof.pace === 'medio') ? 'checked' : ''}>
                <strong>Médio</strong>
                <small>25–30 min</small>
              </label>
              <label class="ob-pace-option ${prof.pace === 'livre' ? 'selected' : ''}">
                <input type="radio" name="ob-edit-pace" value="livre" ${prof.pace === 'livre' ? 'checked' : ''}>
                <strong>Livre</strong>
                <small>Sem tempo fixo</small>
              </label>
            </div>
          </div>
        </div>
        <div class="actions" style="margin-top:22px;justify-content:flex-end">
          <button type="button" class="secondary" data-profile-action="close-modal">Cancelar</button>
          <button type="button" class="primary" data-profile-action="save-edit-profile">Salvar Alterações</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Modal Universal do CMS Visual (Editar textos, matérias, assuntos, blocos, tópicos, vídeos, sites e questões)
 */
function renderCmsModal(cfg) {
  const { type, subjId, modId, blkId, topicKey, itemIdx } = cfg;

  /* 1. Editar Textos Globais do Site */
  if (type === 'edit-site-texts') {
    const t = storageService.getSiteTexts();
    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-card" style="max-width:600px">
          <div class="eyebrow">✏️ Personalizar Textos do Site</div>
          <h2 class="section-title" style="margin-top:4px">Textos e Títulos Principais</h2>
          <div class="ob-form-grid" style="margin-top:14px">
            <label class="ob-field">
              <span>Nome da Plataforma (Topo Esquerdo)</span>
              <input type="text" id="cms-brand-title" value="${esc(t.brandTitle)}">
            </label>
            <label class="ob-field">
              <span>Subtítulo Superior da Tela Inicial (Eyebrow)</span>
              <input type="text" id="cms-home-eyebrow" value="${esc(t.homeEyebrow)}">
            </label>
            <label class="ob-field">
              <span>Texto de Boas-Vindas da Tela Inicial</span>
              <textarea id="cms-home-sub" class="editor-textarea" rows="2">${esc(t.homeSubtitle)}</textarea>
            </label>
            <label class="ob-field">
              <span>Título da Biblioteca de Estudos</span>
              <input type="text" id="cms-lib-title" value="${esc(t.libraryTitle)}">
            </label>
            <label class="ob-field">
              <span>Subtítulo da Biblioteca de Estudos</span>
              <textarea id="cms-lib-sub" class="editor-textarea" rows="2">${esc(t.librarySubtitle)}</textarea>
            </label>
          </div>
          <div class="actions" style="margin-top:20px;justify-content:flex-end">
            <button type="button" class="secondary" data-cms-close="1">Cancelar</button>
            <button type="button" class="primary" data-cms-save="site-texts">💾 Salvar Textos</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 1.1 Editar Contador do ENEM e Frase Motivacional */
  if (type === 'edit-countdown') {
    const cd = storageService.getCountdown();
    const curTitle = cd.title || cd.label || 'ENEM 2026';
    const curQuote = cd.quote !== undefined && cd.quote !== null ? cd.quote : (cd.message || '');
    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-card" style="max-width:560px">
          <div class="eyebrow">⏳ Contagem Regressiva & Mensagem</div>
          <h2 class="section-title" style="margin-top:4px">Editar Contador do ENEM</h2>
          <div class="ob-form-grid" style="margin-top:14px">
            <label class="ob-field">
              <span>Nome do Evento / Meta</span>
              <input type="text" id="cms-cd-title" value="${esc(curTitle)}" placeholder="Ex.: ENEM 2026">
            </label>
            <label class="ob-field">
              <span>Data do ENEM (Ano-Mês-Dia)</span>
              <input type="date" id="cms-cd-date" value="${esc(cd.targetDate || '2026-11-08')}">
            </label>
            <label class="ob-field">
              <span>Frase Motivacional para a Estudante</span>
              <textarea id="cms-cd-quote" class="editor-textarea" rows="3" placeholder="Frase de incentivo...">${esc(curQuote)}</textarea>
            </label>
            <label class="ob-field">
              <span>Exibir Contador</span>
              <select id="cms-cd-enabled" class="ob-select">
                <option value="true" ${cd.enabled !== false ? 'selected' : ''}>Sim, exibir no topo e na tela inicial</option>
                <option value="false" ${cd.enabled === false ? 'selected' : ''}>Não, ocultar temporariamente</option>
              </select>
            </label>
          </div>
          <div class="actions" style="margin-top:20px;justify-content:flex-end">
            <button type="button" class="secondary" data-cms-close="1">Cancelar</button>
            <button type="button" class="primary" data-cms-save="countdown">💾 Salvar Contador</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 2. Adicionar ou Editar Matéria */
  if (type === 'add-subject' || type === 'edit-subject') {
    const isEdit = type === 'edit-subject';
    const subj = isEdit ? getEffectiveSubjects().find(s => s.id === subjId) : null;
    const curArea = cfg.enemArea || subj?.enemAreaId || 'natureza';
    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-card" style="max-width:560px">
          <div class="eyebrow">${isEdit ? '✏️ Editar Matéria' : '➕ Nova Matéria'}</div>
          <h2 class="section-title" style="margin-top:4px">${isEdit ? `Editar ${esc(subj?.nome || 'Matéria')}` : 'Adicionar Nova Matéria'}</h2>
          ${!isEdit ? `
            <p class="section-copy" style="margin-bottom:14px">
              Ao criar uma nova matéria, o sistema já cria automaticamente uma <strong>Página de Estudo (Assunto + Bloco 1 + Tópico 1)</strong> pronta para você adicionar vídeos, resumos e questões!
            </p>
          ` : ''}
          <div class="ob-form-grid" style="margin-top:12px">
            <label class="ob-field">
              <span>Área do ENEM *</span>
              <select id="cms-subj-area" class="ob-select">
                ${ENEM_AREAS.map(a => `<option value="${esc(a.id)}" ${a.id === curArea ? 'selected' : ''}>${a.icone} ${esc(a.nome)}</option>`).join('')}
              </select>
            </label>
            <div style="display:grid;grid-template-columns:110px 1fr;gap:12px">
              <label class="ob-field">
                <span>Ícone / Emoji</span>
                <input type="text" id="cms-subj-icon" value="${esc(subj?.icone || '📘')}" placeholder="Ex.: 🧬">
              </label>
              <label class="ob-field">
                <span>Nome da Matéria *</span>
                <input type="text" id="cms-subj-name" value="${esc(subj?.nome || '')}" placeholder="Ex.: Biologia, História, Redação...">
              </label>
            </div>
            <label class="ob-field">
              <span>Descrição curta da Matéria</span>
              <input type="text" id="cms-subj-desc" value="${esc(subj?.desc || '')}" placeholder="Ex.: Citologia, Ecologia, Genética e Fisiologia">
            </label>
            ${!isEdit ? `
              <label class="ob-field">
                <span>Nome do Primeiro Assunto / Página de Estudo *</span>
                <input type="text" id="cms-subj-first-mod" value="" placeholder="Ex.: Citologia, Ecologia, Brasil Colônia...">
              </label>
            ` : ''}
          </div>
          <div class="actions" style="margin-top:20px;justify-content:flex-end">
            <button type="button" class="secondary" data-cms-close="1">Cancelar</button>
            <button type="button" class="primary" data-cms-save="${type}">💾 Salvar Matéria</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 3. Adicionar ou Editar Assunto / Página de Estudo (Módulo) */
  if (type === 'add-module' || type === 'edit-module') {
    const isEdit = type === 'edit-module';
    const mod = isEdit ? getModuleById(modId) : null;
    const subjects = getEffectiveSubjects();
    const defaultSubjByArea = cfg.enemArea ? subjects.find(s => s.enemAreaId === cfg.enemArea)?.id : '';
    const targetSubjId = isEdit ? mod?.materiaId : (subjId || defaultSubjByArea || subjects[0]?.id || 'biologia');

    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-card" style="max-width:680px;max-height:90vh;overflow-y:auto">
          <div class="eyebrow">${isEdit ? '✏️ Editar Assunto / Página de Estudo' : '➕ Novo Assunto / Página de Estudo'}</div>
          <h2 class="section-title" style="margin-top:4px">${isEdit ? `Editar: ${esc(mod?.assunto || '')}` : 'Criar Nova Página de Estudo'}</h2>

          <div class="ob-form-grid" style="margin-top:14px">
            <div style="display:grid;grid-template-columns:1fr 100px;gap:12px">
              <label class="ob-field">
                <span>Matéria *</span>
                <select id="cms-mod-subj" class="ob-select" ${isEdit ? 'disabled' : ''}>
                  ${subjects.map(s => `<option value="${esc(s.id)}" ${s.id === targetSubjId ? 'selected' : ''}>${s.icone || '📘'} ${esc(s.nome)}</option>`).join('')}
                </select>
              </label>
              <label class="ob-field">
                <span>Ícone</span>
                <input type="text" id="cms-mod-icon" value="${esc(mod?.icone || '📘')}">
              </label>
            </div>

            <label class="ob-field">
              <span>Nome do Assunto (Ex.: Citologia, Óptica, Ecologia) *</span>
              <input type="text" id="cms-mod-name" value="${esc(mod?.assunto || '')}" placeholder="Ex.: Citologia">
            </label>

            <label class="ob-field">
              <span>Descrição / Subtítulo do Assunto</span>
              <input type="text" id="cms-mod-desc" value="${esc(mod?.descricao || '')}" placeholder="Ex.: Roteiro direto com leitura inicial, videoaulas e questões do ENEM.">
            </label>

            <hr class="topic-divider" style="margin:8px 0">
            <div class="eyebrow" style="color:var(--green)">🚀 Seção "Comece por aqui" (Opcional — aparece no topo do assunto)</div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <label class="ob-field">
                <span>Título da Leitura Inicial</span>
                <input type="text" id="cms-mod-read-title" value="${esc(mod?.introReading?.titulo || '')}" placeholder="Ex.: Resumo de Citologia (Descomplica)">
              </label>
              <label class="ob-field">
                <span>Nome do Site / Portal</span>
                <input type="text" id="cms-mod-read-portal" value="${esc(mod?.introReading?.portal || 'Descomplica')}" placeholder="Ex.: Descomplica">
              </label>
            </div>
            <label class="ob-field">
              <span>Link (URL) da Leitura Inicial</span>
              <input type="url" id="cms-mod-read-url" value="${esc(mod?.introReading?.url || '')}" placeholder="https://descomplica.com.br/blog/citologia-resumo/">
            </label>

            <div style="display:grid;grid-template-columns:1fr 140px;gap:10px">
              <label class="ob-field">
                <span>Título do Vídeo Inicial (Opcional)</span>
                <input type="text" id="cms-mod-vid-title" value="${esc(mod?.introVideo?.titulo || '')}" placeholder="Ex.: Introdução à Citologia">
              </label>
              <label class="ob-field">
                <span>Duração / Tag</span>
                <input type="text" id="cms-mod-vid-dur" value="${esc(mod?.introVideo?.duracao || 'Vídeo Inicial')}" placeholder="Ex.: 15 minutos">
              </label>
            </div>
            <label class="ob-field">
              <span>Link do YouTube do Vídeo Inicial</span>
              <input type="url" id="cms-mod-vid-url" value="${esc(mod?.introVideo?.url || '')}" placeholder="https://www.youtube.com/watch?v=...">
            </label>
          </div>

          <div class="actions" style="margin-top:20px;justify-content:flex-end">
            <button type="button" class="secondary" data-cms-close="1">Cancelar</button>
            <button type="button" class="primary" data-cms-save="${type}">💾 Salvar Assunto</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 4. Adicionar ou Editar Bloco */
  if (type === 'add-block' || type === 'edit-block') {
    const isEdit = type === 'edit-block';
    const allMods = getAllModules();
    const effectiveModId = modId || (allMods[0]?.id || '');
    const mod = getModuleById(effectiveModId);
    const blk = isEdit ? (mod?.blocos || []).find(b => b.id === blkId) : null;

    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-card" style="max-width:580px">
          <div class="eyebrow">${isEdit ? `${esc(mod?.materia || '')} · ${esc(mod?.assunto || '')}` : 'Adicionar Novo Bloco de Conteúdo'}</div>
          <h2 class="section-title" style="margin-top:4px">${isEdit ? '✏️ Editar Bloco' : '➕ Novo Bloco de Estudo'}</h2>
          <div class="ob-form-grid" style="margin-top:14px">
            ${!isEdit ? `
              <label class="ob-field">
                <span>Assunto / Página de Estudo de Destino *</span>
                <select id="cms-blk-mod" class="ob-select">
                  ${allMods.map(m => `<option value="${esc(m.id)}" ${m.id === effectiveModId ? 'selected' : ''}>${m.icone || '📘'} ${esc(m.materia)} → ${esc(m.assunto)}</option>`).join('')}
                </select>
              </label>
            ` : ''}
            <label class="ob-field">
              <span>Título do Bloco *</span>
              <input type="text" id="cms-blk-title" value="${esc(blk?.titulo || '')}" placeholder="Ex.: Roteiro Essencial de Citologia">
            </label>
            <label class="ob-field">
              <span>Descrição Curta</span>
              <input type="text" id="cms-blk-desc" value="${esc(blk?.descricao_curta || '')}" placeholder="Ex.: Aulas essenciais e questões comentadas">
            </label>
            <label class="ob-field">
              <span>Resumo Base do Bloco (Markdown opcional)</span>
              <textarea id="cms-blk-resumo" class="editor-textarea" rows="5" placeholder="Resumo geral deste bloco...">${esc(blk?.resumo || '')}</textarea>
            </label>
          </div>
          <div class="actions" style="margin-top:20px;justify-content:flex-end">
            <button type="button" class="secondary" data-cms-close="1">Cancelar</button>
            <button type="button" class="primary" data-cms-save="${type}">💾 Salvar Bloco</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 5. Adicionar ou Editar Tópico / Aula */
  if (type === 'add-topic' || type === 'edit-topic') {
    const isEdit = type === 'edit-topic';
    const eff = isEdit ? getEffectiveTopicData(topicKey) : null;
    const mod = isEdit ? eff?.mod : getModuleById(modId);
    const blk = isEdit ? eff?.blk : (mod?.blocos || []).find(b => b.id === blkId);

    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-card" style="max-width:700px;max-height:90vh;overflow-y:auto">
          <div class="eyebrow">${esc(mod?.materia || '')} · ${esc(mod?.assunto || '')} · ${esc(blk?.titulo || '')}</div>
          <h2 class="section-title" style="margin-top:4px">${isEdit ? '✏️ Editar Tópico / Aula' : '➕ Novo Tópico / Aula'}</h2>

          <div class="ob-form-grid" style="margin-top:14px">
            <label class="ob-field">
              <span>Nome do Tópico / Aula *</span>
              <input type="text" id="cms-topic-title" value="${esc(eff?.titulo || '')}" placeholder="Ex.: 1. Tipos de células">
            </label>

            <label class="ob-field">
              <span>Descrição / Foco no ENEM</span>
              <input type="text" id="cms-topic-foco" value="${esc(eff?.foco || '')}" placeholder="Ex.: Diferenciar células procariontes, eucariontes, vegetais e animais.">
            </label>

            <label class="ob-field">
              <span>Pré-requisito Recomendado (Opcional - Didática leve)</span>
              <input type="text" id="cms-topic-prereq" value="${esc(eff?.preRequisito || '')}" placeholder="Ex.: Refração da Luz, Porcentagem Básica, Citologia Geral">
            </label>

            <label class="ob-field">
              <span>Resumo Didático (Suporta Markdown: ### Títulos, - Listas, **Negrito**)</span>
              <textarea id="cms-topic-resumo" class="editor-textarea" rows="8" placeholder="Escreva aqui o resumo mastigado deste tópico...">${esc(eff?.resumo || '')}</textarea>
            </label>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:end">
              <label class="ob-field">
                <span>Imagem Ilustrativa (URL opcional)</span>
                <input type="url" id="cms-topic-img-url" value="${esc(eff?.resumoImage?.startsWith('data:') ? '' : (eff?.resumoImage || ''))}" placeholder="https://.../imagem.png">
              </label>
              <label class="ob-field">
                <span>Ou enviar imagem do computador</span>
                <input type="file" id="cms-topic-img-file" accept="image/*" style="font-size:12px">
              </label>
            </div>

            ${!isEdit ? `
              <hr class="topic-divider" style="margin:6px 0">
              <div class="eyebrow">🎬 Adicionar Videoaula Junto com o Tópico (Opcional)</div>
              <div style="display:grid;grid-template-columns:1fr 150px;gap:10px">
                <label class="ob-field">
                  <span>Link do YouTube da Videoaula</span>
                  <input type="url" id="cms-topic-vid-url" placeholder="https://www.youtube.com/watch?v=...">
                </label>
                <label class="ob-field">
                  <span>Tempo / Duração</span>
                  <input type="text" id="cms-topic-vid-dur" placeholder="Ex.: 17 minutos">
                </label>
              </div>
            ` : ''}
          </div>

          <div class="actions" style="margin-top:20px;justify-content:flex-end">
            <button type="button" class="secondary" data-cms-close="1">Cancelar</button>
            <button type="button" class="primary" data-cms-save="${type}">💾 Salvar Tópico</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 6. Adicionar ou Editar Videoaula (com Tempo/Duração) */
  if (type === 'add-video' || type === 'edit-video') {
    const eff = getEffectiveTopicData(topicKey);
    const isEdit = type === 'edit-video';
    const curVid = (isEdit && eff.videos[itemIdx]) ? eff.videos[itemIdx] : { titulo: eff?.titulo || '', url: '', duracao: '', canal: 'YouTube', nota: '' };

    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-card" style="max-width:560px">
          <div class="eyebrow">${ isEdit ? '✏️ Editar Videoaula' : '🎬 Adicionar Videoaula' } · ${esc(eff?.titulo || '')}</div>
          <h2 class="section-title" style="margin-top:4px">${isEdit ? 'Editar Videoaula' : 'Nova Videoaula do YouTube'}</h2>

          <div class="ob-form-grid" style="margin-top:14px">
            <label class="ob-field">
              <span>Título da Videoaula *</span>
              <input type="text" id="cms-vid-title" value="${esc(curVid.titulo || '')}" placeholder="Ex.: 1. Tipos de células">
            </label>
            <label class="ob-field">
              <span>Link do YouTube (URL) *</span>
              <input type="url" id="cms-vid-url" value="${esc(curVid.url || '')}" placeholder="https://www.youtube.com/watch?v=-G7UzmBWzUo">
            </label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label class="ob-field">
                <span>Tempo / Duração da Aula</span>
                <input type="text" id="cms-vid-dur" value="${esc(curVid.duracao || '')}" placeholder="Ex.: 17 minutos">
              </label>
              <label class="ob-field">
                <span>Canal / Professor(a)</span>
                <input type="text" id="cms-vid-channel" value="${esc(curVid.canal || 'YouTube')}" placeholder="Ex.: Biologia Total, Prof. Boaro...">
              </label>
            </div>
            <label class="ob-field">
              <span>Observação sobre a aula (opcional)</span>
              <input type="text" id="cms-vid-note" value="${esc(curVid.nota || curVid.objetivo || '')}" placeholder="Ex.: Aula direta ao ponto sobre procariontes e eucariontes">
            </label>
          </div>

          <div class="actions" style="margin-top:20px;justify-content:flex-end">
            <button type="button" class="secondary" data-cms-close="1">Cancelar</button>
            <button type="button" class="primary" data-cms-save="${type}">💾 Salvar Videoaula</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 7. Adicionar ou Editar Site / Leitura */
  if (type === 'add-site' || type === 'edit-site') {
    const eff = getEffectiveTopicData(topicKey);
    const isEdit = type === 'edit-site';
    const curSite = (isEdit && eff.sites[itemIdx]) ? eff.sites[itemIdx] : { titulo: '', portal: 'Descomplica', url: '', resumo: '', thumbUrl: '' };

    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-card" style="max-width:560px">
          <div class="eyebrow">${isEdit ? '✏️ Editar Site / Leitura' : '🌐 Adicionar Site / Leitura'} · ${esc(eff?.titulo || '')}</div>
          <h2 class="section-title" style="margin-top:4px">${isEdit ? 'Editar Link de Estudo' : 'Novo Link de Leitura'}</h2>

          <div class="ob-form-grid" style="margin-top:14px">
            <label class="ob-field">
              <span>Título do Artigo ou Resumo *</span>
              <input type="text" id="cms-site-title" value="${esc(curSite.titulo || '')}" placeholder="Ex.: Resumo de Citologia (Descomplica)">
            </label>
            <label class="ob-field">
              <span>Nome do Portal / Site *</span>
              <input type="text" id="cms-site-portal" value="${esc(curSite.portal || curSite.fonte || 'Descomplica')}" placeholder="Ex.: Descomplica, Brasil Escola, Toda Matéria">
            </label>
            <label class="ob-field">
              <span>URL Completa do Artigo *</span>
              <input type="url" id="cms-site-url" value="${esc(curSite.url || '')}" placeholder="https://descomplica.com.br/blog/citologia-resumo/">
            </label>
            <label class="ob-field">
              <span>Breve descrição do que ler</span>
              <input type="text" id="cms-site-desc" value="${esc(curSite.resumo || curSite.objetivo || '')}" placeholder="Ex.: Leitura inicial com visão geral das células e organelas.">
            </label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:end">
              <label class="ob-field">
                <span>Miniatura / Capa do Link (URL opcional)</span>
                <input type="url" id="cms-site-thumb-url" value="${esc(curSite.thumbUrl?.startsWith('data:') ? '' : (curSite.thumbUrl || ''))}" placeholder="Deixe vazio para capa automática">
              </label>
              <label class="ob-field">
                <span>Ou enviar capa do computador</span>
                <input type="file" id="cms-site-thumb-file" accept="image/*" style="font-size:12px">
              </label>
            </div>
          </div>

          <div class="actions" style="margin-top:20px;justify-content:flex-end">
            <button type="button" class="secondary" data-cms-close="1">Cancelar</button>
            <button type="button" class="primary" data-cms-save="${type}">💾 Salvar Link</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 8. Adicionar ou Editar Questão do ENEM */
  if (type === 'add-enem-q' || type === 'edit-enem-q') {
    const eff = getEffectiveTopicData(topicKey);
    const isEdit = type === 'edit-enem-q';
    const curQ = (isEdit && eff.questoesEnem[itemIdx])
      ? eff.questoesEnem[itemIdx]
      : { ano: 'ENEM 2023', contexto: '', enunciado: '', imagemUrl: '', alternativas: { A: '', B: '', C: '', D: '', E: '' }, correta: 'A', resolucao: '' };

    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-card" style="max-width:700px;max-height:90vh;overflow-y:auto">
          <div class="eyebrow">${isEdit ? '✏️ Editar Questão do ENEM' : '📝 Nova Questão do ENEM'} · ${esc(eff?.titulo || '')}</div>
          <h2 class="section-title" style="margin-top:4px">${isEdit ? 'Editar Questão Comentada' : 'Adicionar Questão Oficial do ENEM'}</h2>

          <div class="ob-form-grid" style="margin-top:14px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label class="ob-field">
                <span>Ano / Edição da Prova *</span>
                <input type="text" id="cms-q-ano" value="${esc(curQ.ano || 'ENEM 2023')}" placeholder="Ex.: ENEM 2023">
              </label>
              <label class="ob-field">
                <span>Contexto / Tema da Questão</span>
                <input type="text" id="cms-q-ctx" value="${esc(curQ.contexto || '')}" placeholder="Ex.: Organelas e síntese proteica">
              </label>
            </div>

            <label class="ob-field">
              <span>Enunciado Completo *</span>
              <textarea id="cms-q-enunciado" class="editor-textarea" rows="4" placeholder="Cole aqui o texto-base e o comando da questão...">${esc(curQ.enunciado || '')}</textarea>
            </label>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:end">
              <label class="ob-field">
                <span>Imagem da Questão (URL opcional)</span>
                <input type="url" id="cms-q-img-url" value="${esc(curQ.imagemUrl?.startsWith('data:') ? '' : (curQ.imagemUrl || ''))}" placeholder="https://.../figura.png">
              </label>
              <label class="ob-field">
                <span>Ou enviar imagem do computador</span>
                <input type="file" id="cms-q-img-file" accept="image/*" style="font-size:12px">
              </label>
            </div>

            ${['A', 'B', 'C', 'D', 'E'].map(letter => `
              <label class="ob-field">
                <span>Alternativa ${letter} *</span>
                <input type="text" id="cms-q-alt-${letter}" value="${esc(curQ.alternativas?.[letter] || '')}" placeholder="Texto da alternativa ${letter}">
              </label>
            `).join('')}

            <label class="ob-field">
              <span>Gabarito Oficial *</span>
              <select id="cms-q-correta" class="ob-select">
                ${['A', 'B', 'C', 'D', 'E'].map(l => `<option value="${l}" ${curQ.correta === l ? 'selected' : ''}>Alternativa ${l}</option>`).join('')}
              </select>
            </label>

            <label class="ob-field">
              <span>Resolução Comentada Passo a Passo *</span>
              <textarea id="cms-q-resolucao" class="editor-textarea" rows="4" placeholder="Explique passo a passo por que a alternativa está correta...">${esc(curQ.resolucao || '')}</textarea>
            </label>
          </div>

          <div class="actions" style="margin-top:20px;justify-content:flex-end">
            <button type="button" class="secondary" data-cms-close="1">Cancelar</button>
            <button type="button" class="primary" data-cms-save="${type}">💾 Salvar Questão</button>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}


/* ══════════════════════════════════════════════════════════════════════════
   10.5 ÁREA: 🎯 DIAGNÓSTICO ADAPTATIVO POR IA (TODOS OS CONTEÚDOS & ÁREAS)
   ══════════════════════════════════════════════════════════════════════════ */

function getModuleSiteCatalogSummary(modId) {
  const mod = getModuleById(modId);
  if (!mod) return [];
  const list = [];
  (mod.blocos || []).forEach(blk => {
    (blk.habilidades || []).forEach(hab => {
      const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
      const eff = getEffectiveTopicData(tKey);
      list.push({
        topicKey: tKey,
        titulo: hab.nome,
        bloco: blk.titulo,
        foco: eff?.foco || hab.foco || blk.descricao || '',
        videos: (eff?.videos || []).map(v => ({ titulo: v.titulo, duracao: v.duracao || '8 min', url: v.url })),
        resumoDisponivel: Boolean(eff?.resumo || blk.resumo),
        questoesTotal: eff?.questoesEnem?.length || 0
      });
    });
  });
  return list;
}

function getMasteryBadgeHtml(statusId) {
  if (statusId === 'DOMINADO') {
    return '<span class="op-badge mastered diag-badge-dominado">🟢 Dominado</span>';
  }
  if (statusId === 'EM_DESENVOLVIMENTO' || statusId === 'REVISAR') {
    return '<span class="op-badge study diag-badge-desenvolvimento">🟡 Em desenvolvimento</span>';
  }
  if (statusId === 'BASICO') {
    return '<span class="op-badge diag-badge-basico">🟠 Básico</span>';
  }
  if (statusId === 'NAO_SEI' || statusId === 'ESTUDO_NECESSARIO') {
    return '<span class="op-badge diag-badge-nao-sei">🔴 Estudo necessário</span>';
  }
  if (statusId === 'INCONCLUSIVO') {
    return '<span class="op-badge diag-badge-inconclusivo">❓ Inconclusivo</span>';
  }
  return '<span class="op-badge diag-badge-none">⚪ Não realizado</span>';
}

function renderDiagnosticsArea() {
  const st = storageService.getActiveState();
  const ds = st.diagSession;

  if (ds) {
    return renderActiveDiagnosticSession(ds);
  }

  const curAreaFilter = st.diagAreaFilter || 'natureza';
  const subjects = getEffectiveSubjects();
  const modules = getAllModules();
  const diagHistory = st.diagnosticsHistory || {};

  const filteredSubjects = curAreaFilter === 'all'
    ? subjects
    : subjects.filter(s => s.enemAreaId === curAreaFilter);

  const areasNavHtml = [
    { id: 'natureza', nome: 'Ciências da Natureza', icone: '🔬' },
    { id: 'matematica', nome: 'Matemática', icone: '📐' },
    { id: 'humanas', nome: 'Ciências Humanas', icone: '🌍' },
    { id: 'linguagens', nome: 'Linguagens e Códigos', icone: '📚' },
    { id: 'redacao', nome: 'Redação ENEM', icone: '✍️' },
    { id: 'all', nome: 'Todas as Áreas', icone: '🌐' }
  ].map(a => `
    <button type="button" class="diag-area-btn ${curAreaFilter === a.id ? 'active' : ''}" data-diag-filter-area="${esc(a.id)}">
      <span>${a.icone}</span>
      <span>${esc(a.nome)}</span>
    </button>
  `).join('');

  const subjectsCardsHtml = filteredSubjects.map(subj => {
    const matModules = modules.filter(m => m.materiaId === subj.id);
    if (matModules.length === 0) return '';

    const modCards = matModules.map(m => {
      const hist = diagHistory[m.id];
      const statusBadge = getMasteryBadgeHtml(hist ? (hist.nivelGlobal || hist.veredicto) : null);
      const totalHabs = (m.blocos || []).reduce((acc, b) => acc + (b.habilidades?.length || 0), 0);

      return `
        <article class="diag-mod-card">
          <div class="diag-mod-head">
            <div style="display:flex;align-items:flex-start;gap:12px">
              <span style="font-size:28px">${m.icone || subj.icone || '📘'}</span>
              <div class="diag-mod-title-group">
                <strong>${esc(m.assunto)}</strong>
                <small>${esc(subj.nome)} · ${totalHabs} ${totalHabs === 1 ? 'tópico' : 'tópicos'}</small>
              </div>
            </div>
            ${statusBadge}
          </div>

          <p style="margin:0;font-size:13px;color:var(--muted);line-height:1.5">
            ${esc(m.descricao || `Diagnóstico adaptativo com IA para mapear pontos fortes, travas conceituais e distratores de ${m.assunto}.`)}
          </p>

          <div style="display:flex;gap:8px;margin-top:auto;flex-wrap:wrap">
            <button type="button" class="primary ob-btn-sm" data-start-ai-diag="${esc(m.id)}" style="flex:1;justify-content:center">
              ⚡ Diagnóstico com IA
            </button>
            <button type="button" class="secondary ob-btn-sm" data-quick-library="${esc(m.id)}" title="Abrir roteiro completo">
              📖 Roteiro
            </button>
            ${hist && (hist.veredicto === 'REVISAR' || hist.veredicto === 'ESTUDO_NECESSARIO' || hist.nivelGlobal === 'EM_DESENVOLVIMENTO' || hist.nivelGlobal === 'BASICO' || hist.nivelGlobal === 'NAO_SEI') ? `
              <button type="button" class="secondary ob-btn-sm" data-add-suggested-to-list="${esc(m.id)}" title="Adicionar à Minha Lista">
                📌 + Lista
              </button>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    return `
      <section style="margin-bottom:28px">
        <div class="section-head-row" style="margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:20px">${subj.icone || '📘'}</span>
            <h3 style="margin:0;font-size:18px">${esc(subj.nome)}</h3>
          </div>
        </div>
        <div class="diag-modules-grid">
          ${modCards}
        </div>
      </section>
    `;
  }).join('');

  window.layout(`
    <section class="panel home-diag-hero-banner" style="margin-bottom:24px">
      <div class="eyebrow" style="color:var(--green)">🎯 Sistema de Diagnóstico Adaptativo & Investigativo</div>
      <h1 class="page-title" style="margin:6px 0 8px">Diagnóstico com Inteligência Artificial</h1>
      <p class="lede" style="margin:0;max-width:760px">
        Avalie seu conhecimento em todos os conteúdos cadastrados no site antes de perder tempo estudando o que já sabe. A Professora IA adapta o nível das questões passo a passo, investiga a causa real dos erros (conceito, interpretação, unidades, fórmula ou cálculo) e classifica seu domínio em 4 níveis com base em evidências.
      </p>

      <div class="diag-hero-actions-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:14px;margin-top:20px">
        <div class="diag-hero-action-card" style="background:#ffffff;border:1px solid var(--line);border-radius:12px;padding:16px;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:22px">⚡</span>
              <strong style="font-size:15px;color:var(--text)">Triagem Rápida por Grande Área</strong>
            </div>
            <p style="margin:0 0 12px;font-size:12.5px;color:var(--muted);line-height:1.5">
              Faça uma sondagem sequencial adaptativa sobre os pilares mais cobrados na Área selecionada no filtro abaixo.
            </p>
          </div>
          <button type="button" class="secondary ob-btn-sm" data-diag-area-triage="${esc(curAreaFilter)}" style="width:100%;justify-content:center">
            Iniciar Triagem de ${curAreaFilter === 'natureza' ? 'Natureza' : curAreaFilter === 'matematica' ? 'Matemática' : curAreaFilter === 'humanas' ? 'Humanas' : curAreaFilter === 'linguagens' ? 'Linguagens' : curAreaFilter === 'redacao' ? 'Redação' : 'Todas as Áreas'} →
          </button>
        </div>

        <div class="diag-hero-action-card" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:22px">🎯</span>
              <strong style="font-size:15px;color:#166534">Simulado Diagnóstico Geral ENEM (360°)</strong>
            </div>
            <p style="margin:0 0 12px;font-size:12.5px;color:#1e4638;line-height:1.5">
              Uma questão estratégica de cada grande área para mapear seu perfil geral de prontidão para a prova.
            </p>
          </div>
          <button type="button" class="primary ob-btn-sm" data-diag-broad-triage="1" style="width:100%;justify-content:center">
            Fazer Simulado Diagnóstico Geral 360° →
          </button>
        </div>
      </div>
    </section>

    <div class="diag-area-nav">
      ${areasNavHtml}
    </div>

    ${subjectsCardsHtml || `
      <div class="panel empty">
        <p>Nenhuma matéria cadastrada nesta área ainda.</p>
      </div>
    `}
  `);
}

function renderActiveDiagnosticSession(ds) {
  // 1. Tela de Carregamento (Gerando questão ou avaliando evidências)
  if (ds.loading) {
    const msg = ds.loadingMsg || 'A Professora IA está calibrando sua trilha adaptativa...';
    window.layout(`
      <div class="diag-session-container">
        <div class="panel" style="padding:48px 32px;text-align:center">
          <div style="font-size:42px;margin-bottom:14px">🧠</div>
          <h2 style="margin:0 0 8px">${esc(msg)}</h2>
          <p style="color:var(--muted);font-size:14.5px;max-width:620px;margin:0 auto 24px;line-height:1.6">
            Mapeando competências, distratores e pré-requisitos de <strong>${esc(ds.scopeTitle || ds.assunto)}</strong> para conduzir uma avaliação de alto nível.
          </p>
          <button type="button" class="secondary ob-btn-sm" data-diag-cancel="1">← Cancelar e Voltar</button>
        </div>
      </div>
    `);
    return;
  }

  // 2. Tela de Investigação Conversacional da Professora IA (Ponto Crucial)
  if (ds.step === 'investigating' && ds.investigation) {
    const inv = ds.investigation;
    const optionsHtml = (inv.options || []).map(opt => `
      <button type="button" class="diag-interview-chip" data-diag-interview-chip="${esc(opt)}">
        💬 "${esc(opt)}"
      </button>
    `).join('');

    window.layout(`
      <div class="diag-session-container">
        <div class="back-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <button type="button" class="link-btn" data-diag-cancel="1">
            ← Cancelar Diagnóstico
          </button>
          <span class="eyebrow" style="margin:0;color:var(--green)">
            🎯 Investigação Pedagógica: ${esc(ds.scopeTitle || ds.assunto)}
          </span>
        </div>

        <div class="panel ai-interview-panel">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            <span style="font-size:36px">👩‍🏫</span>
            <div>
              <h2 style="margin:0 0 2px;font-size:20px;color:var(--text)">Sondagem Investigativa da Professora IA</h2>
              <small style="color:var(--muted);font-size:12.5px">Antes de classificar sua resposta, a IA quer entender sua linha de raciocínio nesta questão:</small>
            </div>
          </div>

          <div class="ai-interview-bubble">
            <strong>Professora IA:</strong>
            <p style="margin:6px 0 0;font-size:14.5px;color:#1e4638">
              ${formatInlineMarkdown(inv.question || 'Gostaria de entender melhor como você pensou nesta questão. Pode me contar rapidinho?')}
            </p>
          </div>

          ${optionsHtml ? `
            <div style="margin-bottom:14px">
              <span style="font-size:12px;font-weight:600;color:var(--muted);display:block;margin-bottom:6px">Sugestões rápidas de raciocínio (ou digite abaixo com suas próprias palavras):</span>
              <div class="diag-interview-chips-grid">
                ${optionsHtml}
              </div>
            </div>
          ` : ''}

          <div style="margin-bottom:16px">
            <label for="diag-investigation-response" style="font-size:12.5px;font-weight:600;display:block;margin-bottom:6px;color:var(--text)">
              ✍️ Sua explicação para a Professora IA:
            </label>
            <textarea id="diag-investigation-response" placeholder="Digite aqui o que você pensou, se houve dúvida na interpretação, na fórmula ou nas contas..." style="width:100%;min-height:110px;padding:12px;border:1px solid var(--line);border-radius:10px;font-family:inherit;font-size:13.5px;resize:vertical;line-height:1.5">${esc(inv.studentAnswer || '')}</textarea>
          </div>

          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
            <button type="button" class="primary" data-diag-submit-investigation="1" style="flex:1;padding:13px;font-size:14.5px">
              Enviar Explicação e Continuar Diagnóstico →
            </button>
            <button type="button" class="secondary ob-btn-sm" data-diag-skip-investigation="1">
              Pular conversa e continuar
            </button>
          </div>
        </div>
      </div>
    `);
    return;
  }

  // 3. Tela de Questão Adaptativa Ativa (1 questão por vez)
  if (ds.step === 'question' && ds.currentQuestion) {
    const q = ds.currentQuestion;
    const curAns = ds.pendingAnswer || { userChoice: null, userConfidence: 'certeza', userReasoning: '' };
    const qNum = (ds.history?.length || 0) + 1;
    const letters = ['A', 'B', 'C', 'D'];

    const optionsHtml = letters.map(letter => {
      const text = q.alternativas?.[letter];
      if (!text) return '';
      const isSelected = curAns.userChoice === letter;
      return `
        <button type="button" class="enem-option-btn ${isSelected ? 'ob-option-selected' : ''}" data-diag-select-choice="${letter}">
          <span class="ob-option-letter">${letter}</span>
          <span class="ob-option-text">${formatInlineMarkdown(text)}</span>
        </button>
      `;
    }).join('');

    window.layout(`
      <div class="diag-session-container">
        <div class="back-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <button type="button" class="link-btn" data-diag-cancel="1">
            ← Sair do Diagnóstico
          </button>
          <span class="eyebrow" style="margin:0;color:var(--green)">
            🎯 Diagnóstico Adaptativo: ${esc(ds.scopeTitle || ds.assunto)}
          </span>
        </div>

        <div class="diag-stepper-bar">
          <div class="diag-step-item active">
            <span class="diag-step-num">${qNum}</span>
            <span class="diag-step-name">Questão ${qNum}: ${esc(q.pilar || 'Pilar Essencial')}</span>
          </div>
          <div class="diag-step-item">
            <span class="diag-step-num">⚡</span>
            <span class="diag-step-name">Nível Adaptativo (${esc(q.dificuldade || 'médio')})</span>
          </div>
          ${ds.history && ds.history.length > 0 ? `
            <div class="diag-step-item done">
              <span class="diag-step-num">✓</span>
              <span class="diag-step-name">${ds.history.length} evidência(s) colhida(s)</span>
            </div>
          ` : ''}
        </div>

        <div class="diag-session-grid">
          <div class="diag-question-panel">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
              <span class="eyebrow" style="color:var(--green)">Questão ${qNum} · Nível ENEM</span>
              <span class="op-badge study">🎯 ${esc(q.pilar || 'Competência Essencial')}</span>
            </div>

            <p class="diag-question-enunciado">${formatInlineMarkdown(q.enunciado)}</p>

            <div class="enem-options-list" role="radiogroup" aria-label="Alternativas">
              ${optionsHtml}
            </div>

            <div class="diag-conf-box">
              <strong style="font-size:12.5px;display:block;color:var(--text)">Nível de segurança nesta resposta:</strong>
              <small style="color:var(--muted);font-size:11.5px">A IA diferencia acerto seguro de acerto no chute ou dúvida para não superestimar seu domínio.</small>
              <div class="diag-conf-buttons">
                <button type="button" class="diag-conf-btn ${curAns.userConfidence === 'certeza' ? 'active-certeza' : ''}" data-diag-select-conf="certeza">
                  ✓ Tenho certeza
                </button>
                <button type="button" class="diag-conf-btn ${curAns.userConfidence === 'duvida' ? 'active-duvida' : ''}" data-diag-select-conf="duvida">
                  ? Estou em dúvida / Chutei
                </button>
              </div>
            </div>

            <div style="display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap">
              <button type="button" class="primary" data-diag-confirm-answer="1" style="flex:1;padding:13px;font-size:14.5px" ${!curAns.userChoice ? 'disabled' : ''}>
                Confirmar Resposta e Analisar Evidência com IA →
              </button>
            </div>

            ${ds.history && ds.history.length > 0 ? `
              <div style="text-align:center;margin-top:6px">
                <button type="button" class="link-btn" data-diag-conclude-early="1" style="font-size:12px;color:var(--muted)">
                  ⚡ Concluir diagnóstico agora com as evidências coletadas até aqui
                </button>
              </div>
            ` : ''}
          </div>

          <div class="diag-reasoning-panel">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:18px">✍️</span>
              <strong style="font-size:14px;color:var(--text)">Seu Raciocínio, Dúvida ou Anotações</strong>
            </div>
            <p style="margin:0;font-size:12px;color:var(--muted);line-height:1.5">
              Escreva como você pensou ou onde sentiu dúvida. A Professora IA vai <strong>ler seus comentários</strong> para identificar se sua trava é conceitual, interpretativa ou de cálculo!
            </p>
            <textarea id="diag-user-reasoning" placeholder="Exemplo: Fiquei em dúvida entre B e C porque... OU: Usei a fórmula tal porque a velocidade era constante...">${esc(curAns.userReasoning || '')}</textarea>
            <div style="background:#f4f8f5;border:1px solid #d4e7da;border-radius:8px;padding:10px;font-size:11.5px;color:#1e4638">
              💡 <strong>Dica da Professora IA:</strong> Se errar, fique tranquilo! A IA não te penaliza; ela vai conversar com você para descobrir exatamente onde estava a pegadinha.
            </div>
          </div>
        </div>
      </div>
    `);
    return;
  }

  // 4. Tela de Relatório Diagnóstico Consolidado (Denso e Completo)
  if (ds.step === 'result' && ds.result) {
    const res = ds.result;
    const nivel = res.nivelGlobal || 'BASICO';
    const isDominado = nivel === 'DOMINADO';
    const isDesenvolvimento = nivel === 'EM_DESENVOLVIMENTO';
    const isBasico = nivel === 'BASICO';
    const isNaoSei = nivel === 'NAO_SEI';

    const history = ds.history || [];
    const totalQ = history.length || 1;
    const acertosCount = history.filter(h => h.answer?.isCorrect).length;
    const certezaCount = history.filter(h => h.answer?.userConfidence === 'certeza').length;

    // Causas de erro formatadas
    const causasHtml = (res.causasErros || []).map(c => `
      <div style="background:#fafaf9;border:1px solid #e5e7eb;border-radius:10px;padding:12px;margin-bottom:8px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px">
          <strong style="font-size:13px;color:var(--text)">${esc(c.pilar || 'Pilar')}</strong>
          <span class="diag-cause-tag ${c.tipo === 'CONFIRMADA' ? 'confirmada' : 'hipotese'}">
            ${c.tipo === 'CONFIRMADA' ? '✓ Causa Confirmada na Conversa' : '⚠️ Hipótese Pedagógica'}
          </span>
        </div>
        <div style="font-size:12.5px;font-weight:600;color:#92400e;margin-bottom:4px">
          ${esc(c.causa || 'Interpretação')}
        </div>
        <p style="margin:0;font-size:12px;color:var(--muted);line-height:1.5">
          ${esc(c.detalhe || '')}
        </p>
      </div>
    `).join('');

    // Mapa de Habilidades com os 4 níveis + inconclusivo/não avaliado
    const mapaHabsHtml = (res.mapaHabilidades || []).map(h => {
      const bHtml = getMasteryBadgeHtml(h.status);
      return `
        <div class="diag-pillar-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <strong style="font-size:13.5px;color:var(--text)">${esc(h.habilidade)}</strong>
            ${bHtml}
          </div>
          <p style="margin:0;font-size:12.5px;color:var(--muted);line-height:1.5">
            ${esc(h.evidencia || '')}
          </p>
        </div>
      `;
    }).join('');

    // Sugestões da Plataforma (Materiais que REALMENTE existem no site)
    const sugestoesSiteHtml = (res.sugestoesDoSite || []).map(s => `
      <div class="diag-site-sug-card" style="background:#ffffff;border:1px solid #e2e8f0;border-left:4px solid var(--green);border-radius:10px;padding:14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;flex-wrap:wrap">
          <strong style="font-size:13.5px;color:var(--text)">📖 ${esc(s.topicoTitulo || s.blocoTitulo || 'Tópico Cadastrado')}</strong>
          ${s.videoDuracao ? `<span class="op-badge study">⏱️ ${esc(s.videoDuracao)}</span>` : ''}
        </div>
        <p style="margin:0 0 8px;font-size:12.5px;color:var(--muted);line-height:1.5">
          ${esc(s.motivo || 'Recomendado para sanar a lacuna conceitual detectada.')}
        </p>
        ${s.videoSugerido ? `
          <div style="font-size:12px;color:#166534;font-weight:600;margin-bottom:8px">
            🎬 Videoaula no portal: "${esc(s.videoSugerido)}"
          </div>
        ` : ''}
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="secondary ob-btn-sm" data-quick-library="${esc(ds.modId)}" title="Abrir material de estudo no site">
            📖 Abrir Aula no Portal
          </button>
          <button type="button" class="secondary ob-btn-sm" data-add-suggested-to-list="${esc(ds.modId)}" title="Adicionar à Minha Lista">
            📌 + Minha Lista
          </button>
        </div>
      </div>
    `).join('');

    // Trilha Pedagógica Global (O que estudar em qualquer lugar)
    const trilhaGlobalHtml = (res.trilhaPedagogicaGlobal || []).map((step, idx) => `
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:13px;line-height:1.5">
        <span style="width:22px;height:22px;border-radius:50%;background:#e0f2fe;color:#0369a1;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">
          ${idx + 1}
        </span>
        <span style="color:var(--text)">${formatInlineMarkdown(step)}</span>
      </div>
    `).join('');

    // Gabarito Comentado com Macetes
    const gabaritoCardsHtml = (res.gabaritoComentado || []).map((g, idx) => {
      const origItem = history[idx] || {};
      const reasoning = origItem.answer?.userReasoning || '';
      const invResp = origItem.investigation?.answer || '';
      return `
        <div class="diag-gabarito-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap">
            <span class="eyebrow" style="color:var(--green);margin:0">Questão ${g.numero}: ${esc(g.pilar)}</span>
            <div style="display:flex;gap:6px;align-items:center">
              <span style="font-size:12px;color:var(--muted)">Sua escolha: <strong>[${esc(g.userChoice)}]</strong></span>
              <span class="op-badge ${g.acertou ? 'mastered' : 'diag-badge-nao-sei'}">
                ${g.acertou ? '✓ Acertou' : `✕ Gabarito Oficial: [${esc(g.correta)}]`}
              </span>
            </div>
          </div>
          ${origItem.question?.enunciado ? `<p style="margin:0 0 10px;font-size:13px;color:var(--text);line-height:1.5">${formatInlineMarkdown(origItem.question.enunciado)}</p>` : ''}
          ${reasoning ? `
            <div style="background:#f8fafc;border-left:3px solid #94a3b8;padding:8px 12px;border-radius:4px;font-size:12px;color:var(--muted);font-style:italic;margin-bottom:8px">
              Seu comentário: "${esc(reasoning)}"
            </div>
          ` : ''}
          ${invResp ? `
            <div style="background:#f0fdf4;border-left:3px solid #10b981;padding:8px 12px;border-radius:4px;font-size:12px;color:#166534;margin-bottom:8px">
              Sua resposta à Professora IA na investigação: "${esc(invResp)}"
            </div>
          ` : ''}
          <div style="background:#fafaf9;border:1px solid #e5e7eb;border-radius:8px;padding:12px;font-size:12.5px;line-height:1.5;color:var(--text)">
            <strong>📘 Explicação e Macete ENEM:</strong> ${formatInlineMarkdown(g.explicacaoDidatica || '')}
          </div>
        </div>
      `;
    }).join('');

    const bannerClass = isDominado ? 'dominado' : isDesenvolvimento ? 'revisar' : isBasico ? 'basico' : 'estudo-necessario';
    const bannerIcon = isDominado ? '🟢' : isDesenvolvimento ? '🟡' : isBasico ? '🟠' : '🔴';

    window.layout(`
      <div class="diag-session-container">
        <div class="back-row" style="margin-bottom:14px">
          <button type="button" class="link-btn" data-diag-finish="1">
            ← Voltar para a Seleção de Diagnósticos
          </button>
        </div>

        <div class="panel diag-result-card">
          <div class="diag-verdict-banner ${bannerClass}">
            <span style="font-size:42px">${bannerIcon}</span>
            <div style="flex:1">
              <div class="eyebrow" style="color:inherit">Resultado do Diagnóstico Inteligente & Investigativo com IA</div>
              <h2 style="margin:2px 0 6px;font-size:22px">
                ${esc(res.tituloVeredicto || 'Diagnóstico Concluído')}
              </h2>
              <p style="margin:0;font-size:14px;opacity:0.95;line-height:1.5">
                ${renderMarkdownSummary(res.resumoVeredicto || '')}
              </p>
            </div>
          </div>

          <!-- Métricas de Desempenho -->
          <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
            <div style="background:#fafaf9;border:1px solid #e5e7eb;border-radius:10px;padding:12px 18px;flex:1;min-width:180px">
              <span style="font-size:11.5px;color:var(--muted);font-weight:600;display:block">DESEMPENHO GLOBAL</span>
              <strong style="font-size:18px;color:var(--text)">${acertosCount} de ${totalQ} Acertos</strong>
            </div>
            <div style="background:#fafaf9;border:1px solid #e5e7eb;border-radius:10px;padding:12px 18px;flex:1;min-width:180px">
              <span style="font-size:11.5px;color:var(--muted);font-weight:600;display:block">NÍVEL DE SEGURANÇA</span>
              <strong style="font-size:18px;color:var(--text)">${certezaCount} de ${totalQ} com Certeza</strong>
            </div>
            <div style="background:#fafaf9;border:1px solid #e5e7eb;border-radius:10px;padding:12px 18px;flex:1;min-width:180px">
              <span style="font-size:11.5px;color:var(--muted);font-weight:600;display:block">NÍVEL OFICIAL DE DOMÍNIO</span>
              <strong style="font-size:18px;color:${isDominado ? '#166534' : isDesenvolvimento ? '#92400e' : isBasico ? '#c2410c' : '#991b1b'}">
                ${isDominado ? '🟢 Dominado' : isDesenvolvimento ? '🟡 Em desenvolvimento' : isBasico ? '🟠 Básico' : '🔴 Não sei / Estudo necessário'}
              </strong>
            </div>
          </div>

          <!-- Análise do Raciocínio Escrito e Conversa -->
          ${res.analiseRaciocinio ? `
            <div style="margin-bottom:22px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <span style="font-size:20px">👩‍🏫</span>
                <h3 style="font-size:16px;margin:0;color:var(--text)">Análise dos seus Comentários e da Conversa Investigativa</h3>
              </div>
              <div class="diag-quote-box">
                ${renderMarkdownSummary(res.analiseRaciocinio)}
              </div>
            </div>
          ` : ''}

          <!-- Causas de Erro (Diferenciando Confirmada vs Hipótese) -->
          ${causasHtml ? `
            <div style="margin-bottom:22px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <span style="font-size:20px">🔍</span>
                <h3 style="font-size:16px;margin:0;color:var(--text)">Diagnóstico de Causas dos Erros & Dúvidas</h3>
              </div>
              <div>${causasHtml}</div>
            </div>
          ` : ''}

          <!-- Mapa de Habilidades Mapeadas -->
          ${mapaHabsHtml ? `
            <div style="margin-bottom:22px">
              <h3 style="font-size:16px;margin:0 0 10px;color:var(--text)">📊 Mapa de Competências e Habilidades do Módulo</h3>
              <div class="diag-pillars-grid">
                ${mapaHabsHtml}
              </div>
            </div>
          ` : ''}

          <!-- Pré-Requisitos Necessários -->
          ${res.preRequisitosNecessarios && res.preRequisitosNecessarios.length > 0 ? `
            <div style="background:#fffbeb;border:1px solid #fef3c7;border-radius:12px;padding:14px 18px;margin-bottom:22px">
              <strong style="color:#92400e;font-size:13.5px;display:flex;align-items:center;gap:6px;margin-bottom:6px">
                <span>🔑</span> Pré-requisitos Fundamentais que Demandam Reforço:
              </strong>
              <ul style="margin:0;padding-left:18px;color:#78350f;font-size:13px">
                ${res.preRequisitosNecessarios.map(p => `<li>${formatInlineMarkdown(p)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- DUPLA RECOMENDAÇÃO: Trilha Global vs Sugestões da Plataforma -->
          <div class="diag-dual-recs-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:24px 0">
            <!-- Coluna 1: Trilha Pedagógica Global -->
            <div class="diag-rec-col global" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
                <span style="font-size:20px">📚</span>
                <h3 style="font-size:15px;margin:0;color:var(--text)">Trilha Pedagógica Global (O que estudar)</h3>
              </div>
              <p style="margin:0 0 14px;font-size:12px;color:var(--muted);line-height:1.4">
                Orientações conceituais completas para você dominar este assunto em qualquer apostila, livro ou fonte externa:
              </p>
              ${trilhaGlobalHtml}
            </div>

            <!-- Coluna 2: Sugestões Práticas no Nosso Site -->
            <div class="diag-rec-col site" style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:18px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
                <span style="font-size:20px">✨</span>
                <h3 style="font-size:15px;margin:0;color:#166534">Sugestões da Plataforma (No nosso Portal)</h3>
              </div>
              <p style="margin:0 0 14px;font-size:12px;color:#1e4638;line-height:1.4">
                Videoaulas e resumos que já estão mastigados e cadastrados no site para você estudar agora:
              </p>
              ${sugestoesSiteHtml || '<p style="font-size:12px;color:var(--muted)">Consulte a Biblioteca de Estudos do site para acessar os resumos completos.</p>'}
            </div>
          </div>

          <!-- Gabarito Comentado Oficial -->
          <div style="margin-top:24px">
            <h3 style="font-size:16px;margin:0 0 12px;color:var(--text)">📘 Gabarito Comentado e Macetes das Questões</h3>
            ${gabaritoCardsHtml}
          </div>

          <!-- Ações Finais -->
          <div class="actions" style="border-top:1px solid var(--line);padding-top:20px;margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
            <button type="button" class="primary" data-add-suggested-to-list="${esc(ds.modId)}">
              📌 Adicionar Conteúdo à Minha Lista de Estudos
            </button>
            <button type="button" class="secondary" data-quick-library="${esc(ds.modId)}">
              📖 Abrir Videoaulas e Resumos no Portal
            </button>
            <button type="button" class="secondary" data-diag-finish="1">
              Fazer Outro Diagnóstico
            </button>
          </div>
        </div>
      </div>
    `);
    return;
  }
}

async function startAiDiagnostic(modId) {
  const mod = getModuleById(modId);
  if (!mod) return;

  const st = storageService.getActiveState();
  st.activeArea = 'diagnostics';
  st.subView = 'diag-session';

  st.diagSession = {
    mode: 'module',
    modId,
    materia: mod.materia,
    assunto: mod.assunto,
    scopeTitle: `${mod.materia} → ${mod.assunto}`,
    step: 'question',
    loading: true,
    loadingMsg: `A Professora IA está elaborando a primeira questão adaptativa de ${mod.assunto}...`,
    history: [],
    currentQuestion: null,
    pendingAnswer: { userChoice: null, userConfidence: 'certeza', userReasoning: '' },
    investigation: null,
    result: null
  };
  storageService.save();
  renderPlatform();

  try {
    const q1 = await window.aiService.generateAdaptiveQuestion({
      session: st.diagSession,
      mod,
      prevHistory: [],
      difficulty: 'medio'
    });
    st.diagSession.currentQuestion = q1;
  } catch (err) {
    console.warn('Fallback ativado na geração adaptativa:', err);
    const prof = window.aiService.getCompetencyProfileForModule(mod);
    st.diagSession.currentQuestion = window.aiService.getLocalFallbackQuestion(mod, 1, prof);
  } finally {
    st.diagSession.loading = false;
    storageService.save();
    renderPlatform();
  }
}

async function startAreaDiagnostic(areaId) {
  const st = storageService.getActiveState();
  st.activeArea = 'diagnostics';
  st.subView = 'diag-session';

  const modules = getAllModules();
  const subjects = getEffectiveSubjects();
  const targetSubjs = areaId === 'all' ? subjects : subjects.filter(s => s.enemAreaId === areaId);
  const targetSubjIds = targetSubjs.map(s => s.id);
  const areaMods = modules.filter(m => targetSubjIds.includes(m.materiaId));
  const effectiveMod = areaMods[0] || modules[0];

  const areaName = areaId === 'natureza' ? 'Ciências da Natureza' : areaId === 'matematica' ? 'Matemática' : areaId === 'humanas' ? 'Ciências Humanas' : areaId === 'linguagens' ? 'Linguagens e Códigos' : areaId === 'redacao' ? 'Redação ENEM' : 'Geral ENEM';

  st.diagSession = {
    mode: 'area',
    areaId,
    modId: effectiveMod?.id || 'area_triage',
    materia: areaName,
    assunto: `Triagem Adaptativa de ${areaName}`,
    scopeTitle: `Área do ENEM: ${areaName}`,
    step: 'question',
    loading: true,
    loadingMsg: `A Professora IA está calibrando a sondagem adaptativa de ${areaName}...`,
    history: [],
    currentQuestion: null,
    pendingAnswer: { userChoice: null, userConfidence: 'certeza', userReasoning: '' },
    investigation: null,
    result: null
  };
  storageService.save();
  renderPlatform();

  try {
    const q1 = await window.aiService.generateAdaptiveQuestion({
      session: st.diagSession,
      mod: effectiveMod,
      prevHistory: [],
      difficulty: 'medio'
    });
    st.diagSession.currentQuestion = q1;
  } catch (err) {
    const prof = window.aiService.getCompetencyProfileForModule(effectiveMod);
    st.diagSession.currentQuestion = window.aiService.getLocalFallbackQuestion(effectiveMod, 1, prof);
  } finally {
    st.diagSession.loading = false;
    storageService.save();
    renderPlatform();
  }
}

async function startBroadDiagnostic() {
  return startAreaDiagnostic('all');
}

async function confirmDiagnosticAnswer() {
  const st = storageService.getActiveState();
  const ds = st.diagSession;
  if (!ds || ds.loading || !ds.currentQuestion) return;

  const reasoningInput = document.getElementById('diag-user-reasoning');
  if (reasoningInput) {
    ds.pendingAnswer.userReasoning = reasoningInput.value.trim();
  }

  if (!ds.pendingAnswer.userChoice) {
    toast('Selecione uma alternativa antes de continuar!');
    return;
  }

  const userChoice = ds.pendingAnswer.userChoice;
  const userConfidence = ds.pendingAnswer.userConfidence;
  const userReasoning = ds.pendingAnswer.userReasoning;
  const mod = getModuleById(ds.modId) || { id: ds.modId, materia: ds.materia, assunto: ds.assunto };

  ds.loading = true;
  ds.loadingMsg = 'A Professora IA está avaliando seu raciocínio e calibrando evidências...';
  renderPlatform();

  try {
    const stepCheck = await window.aiService.evaluateAdaptiveStep({
      session: ds,
      mod,
      question: ds.currentQuestion,
      userChoice,
      userConfidence,
      userReasoning
    });

    // Se houver dúvida ou erro que demande investigação conversacional:
    if (stepCheck.needsInvestigation && stepCheck.perguntaInvestigativa) {
      ds.step = 'investigating';
      ds.investigation = {
        question: stepCheck.perguntaInvestigativa,
        options: stepCheck.opcoesRapidas || [],
        hypotheses: stepCheck.hipoteses || [],
        isCorrect: stepCheck.isCorrect,
        userChoice,
        userConfidence,
        userReasoning,
        studentAnswer: ''
      };
      ds.loading = false;
      storageService.save();
      renderPlatform();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Se a evidência já for cristalina e suficiente:
    ds.history.push({
      question: ds.currentQuestion,
      answer: {
        userChoice,
        userConfidence,
        userReasoning,
        isCorrect: stepCheck.isCorrect
      },
      investigation: {
        concluded: false,
        confirmedCause: stepCheck.causaIdentificada || (stepCheck.isCorrect ? null : 'CONCEITUAL'),
        tipoCausa: 'CONFIRMADA',
        answer: userReasoning || '(Evidência colhida diretamente do comentário)'
      }
    });

    // Decide se gera próxima questão ou se conclui o diagnóstico:
    const maxQ = ds.mode === 'area' ? 4 : 3;
    const consistentMastery = ds.history.length >= 2 && ds.history.every(h => h.answer?.isCorrect && h.answer?.userConfidence === 'certeza');

    if (ds.history.length >= maxQ || consistentMastery) {
      await concludeDiagnosticSession();
      return;
    }

    // Avança para a próxima questão adaptativa:
    ds.loadingMsg = 'A Professora IA está elaborando a próxima questão adaptativa...';
    const nextQ = await window.aiService.generateAdaptiveQuestion({
      session: ds,
      mod,
      prevHistory: ds.history,
      difficulty: ds.history.length === 1 ? 'medio-alto' : 'aprofundado'
    });
    ds.currentQuestion = nextQ;
    ds.pendingAnswer = { userChoice: null, userConfidence: 'certeza', userReasoning: '' };
    ds.step = 'question';
  } catch (err) {
    console.warn('Erro na avaliação adaptativa:', err);
    await concludeDiagnosticSession();
  } finally {
    ds.loading = false;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function submitDiagnosticInvestigation(studentAnswer) {
  const st = storageService.getActiveState();
  const ds = st.diagSession;
  if (!ds || !ds.investigation) return;

  const answerText = studentAnswer || document.getElementById('diag-investigation-response')?.value?.trim() || '(Resposta enviada sem texto)';
  const mod = getModuleById(ds.modId) || { id: ds.modId, materia: ds.materia, assunto: ds.assunto };

  ds.loading = true;
  ds.loadingMsg = 'Processando sua explicação com a Professora IA...';
  renderPlatform();

  try {
    const analysis = await window.aiService.analyzeInvestigationResponse({
      session: ds,
      question: ds.currentQuestion,
      studentAnswer: answerText,
      hipoteses: ds.investigation.hypotheses || []
    });

    ds.history.push({
      question: ds.currentQuestion,
      answer: {
        userChoice: ds.investigation.userChoice,
        userConfidence: ds.investigation.userConfidence,
        userReasoning: ds.investigation.userReasoning,
        isCorrect: ds.investigation.isCorrect
      },
      investigation: {
        question: ds.investigation.question,
        answer: answerText,
        concluded: true,
        confirmedCause: analysis.causaConfirmada || 'INTERPRETACAO',
        tipoCausa: analysis.tipoCausa || 'CONFIRMADA',
        resumoPedagogico: analysis.resumoPedagogico || ''
      }
    });

    ds.investigation = null;

    const maxQ = ds.mode === 'area' ? 4 : 3;
    if (ds.history.length >= maxQ) {
      await concludeDiagnosticSession();
      return;
    }

    // Próxima questão adaptativa pós-investigação:
    ds.loadingMsg = 'Calibrando próxima questão para verificar sua evolução...';
    const nextQ = await window.aiService.generateAdaptiveQuestion({
      session: ds,
      mod,
      prevHistory: ds.history,
      difficulty: 'medio'
    });
    ds.currentQuestion = nextQ;
    ds.pendingAnswer = { userChoice: null, userConfidence: 'certeza', userReasoning: '' };
    ds.step = 'question';
  } catch (err) {
    console.warn('Erro ao processar investigação:', err);
    await concludeDiagnosticSession();
  } finally {
    ds.loading = false;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function concludeDiagnosticSession() {
  const st = storageService.getActiveState();
  const ds = st.diagSession;
  if (!ds) return;

  ds.loading = true;
  ds.loadingMsg = 'A Professora IA está elaborando o seu Relatório Diagnóstico Consolidado...';
  renderPlatform();

  const mod = getModuleById(ds.modId) || { id: ds.modId, materia: ds.materia, assunto: ds.assunto };
  const siteCatalog = getModuleSiteCatalogSummary(ds.modId);

  try {
    const report = await window.aiService.generateComprehensiveDiagnosticReport({
      session: ds,
      mod,
      siteCatalogSummary: siteCatalog
    });

    ds.result = report;
    ds.step = 'result';

    if (!st.diagnosticsHistory) st.diagnosticsHistory = {};
    st.diagnosticsHistory[ds.modId] = {
      nivelGlobal: report.nivelGlobal,
      veredicto: report.nivelGlobal,
      tituloVeredicto: report.tituloVeredicto || 'Diagnóstico Concluído',
      acertosTotal: (ds.history || []).filter(h => h.answer?.isCorrect).length,
      totalQuestoes: ds.history?.length || 1,
      materia: ds.materia,
      assunto: ds.assunto,
      updatedAt: new Date().toISOString()
    };
    storageService.save();
  } catch (err) {
    console.warn('Erro ao gerar relatório final com IA:', err);
    const prof = window.aiService.getCompetencyProfileForModule(mod);
    const fallbackReport = window.aiService.getLocalFallbackReport(ds, mod, prof, siteCatalog);
    ds.result = fallbackReport;
    ds.step = 'result';

    if (!st.diagnosticsHistory) st.diagnosticsHistory = {};
    st.diagnosticsHistory[ds.modId] = {
      nivelGlobal: fallbackReport.nivelGlobal,
      veredicto: fallbackReport.nivelGlobal,
      tituloVeredicto: fallbackReport.tituloVeredicto,
      acertosTotal: (ds.history || []).filter(h => h.answer?.isCorrect).length,
      totalQuestoes: ds.history?.length || 1,
      materia: ds.materia,
      assunto: ds.assunto,
      updatedAt: new Date().toISOString()
    };
    storageService.save();
  } finally {
    ds.loading = false;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   11. ROTEADOR PRINCIPAL E EVENT LISTENERS GLOBAIS
   ══════════════════════════════════════════════════════════════════════════ */
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

function renderPlatform() {
  window.renderPlatform = renderPlatform;
  const st = storageService.getActiveState();
  const area = st.activeArea || 'home';
  if (area === 'home') return renderHomeArea();
  if (area === 'diagnostics') return renderDiagnosticsArea();
  if (area === 'library') return renderLibraryArea();
  if (area === 'my-list') return renderMyListArea();
  if (area === 'progression') return renderProgressionArea();
  return renderHomeArea();
}

window.homeView = function() {
  renderPlatform();
};

document.addEventListener('click', async event => {
  const target = event.target.closest('button, a, [data-profile-action], [data-main-nav], [data-toggle-drawer], [data-close-drawer], [data-cms-open], [data-toggle-ai-chat], [data-close-ai-chat], [data-clear-ai-chat], [data-ai-send], [data-ai-quick-prompt], [data-ai-explain-q], [data-ai-ask-topic], [data-ai-save-key-input], [data-start-ai-diag], [data-diag-area-triage], [data-diag-broad-triage], [data-diag-select-choice], [data-diag-select-conf], [data-diag-confirm-answer], [data-diag-next-q], [data-diag-prev-q], [data-diag-submit], [data-diag-cancel], [data-diag-finish], [data-diag-interview-chip], [data-diag-submit-interview], [data-diag-skip-interview], [data-diag-submit-investigation], [data-diag-skip-investigation], [data-diag-conclude-early], [data-diag-filter-area], [data-diag-mark-completed], [data-diag-add-my-list], [data-add-suggested-to-list], [data-toggle-ai-suggestions], [data-toggle-pet-bot], [data-pet-bot-click], [data-pet-bubble-close], [data-pet-next-tip], [data-pet-open-chat], [data-switch-my-list-view], [data-create-new-note], [data-select-note], [data-delete-note], [data-toggle-emoji-popover], [data-select-emoji], [data-change-callout-icon], [data-add-block-type], [data-delete-block], [data-move-block-up], [data-move-block-down], [data-ai-review-note], [data-profile-switch-id], [data-profile-delete-id]');
  if (!target) return;

  /* 0.0 DiagnÃ³stico Adaptativo & Investigativo por IA */
  if (target.dataset.startAiDiag) {
    event.preventDefault();
    const modId = target.dataset.startAiDiag;
    startAiDiagnostic(modId);
    return;
  }
  if (target.dataset.diagAreaTriage) {
    event.preventDefault();
    const areaId = target.dataset.diagAreaTriage;
    startAreaDiagnostic(areaId);
    return;
  }
  if (target.dataset.diagBroadTriage) {
    event.preventDefault();
    startBroadDiagnostic();
    return;
  }
  if (target.dataset.diagSelectChoice) {
    event.preventDefault();
    const st = storageService.getActiveState();
    if (st.diagSession && st.diagSession.step === 'question') {
      const reasoningInput = document.getElementById('diag-user-reasoning');
      if (reasoningInput && st.diagSession.pendingAnswer) {
        st.diagSession.pendingAnswer.userReasoning = reasoningInput.value;
      }
      if (!st.diagSession.pendingAnswer) {
        st.diagSession.pendingAnswer = { userChoice: null, userConfidence: 'certeza', userReasoning: '' };
      }
      st.diagSession.pendingAnswer.userChoice = target.dataset.diagSelectChoice;
      renderPlatform();
    }
    return;
  }
  if (target.dataset.diagSelectConf) {
    event.preventDefault();
    const st = storageService.getActiveState();
    if (st.diagSession && st.diagSession.step === 'question') {
      const reasoningInput = document.getElementById('diag-user-reasoning');
      if (reasoningInput && st.diagSession.pendingAnswer) {
        st.diagSession.pendingAnswer.userReasoning = reasoningInput.value;
      }
      if (!st.diagSession.pendingAnswer) {
        st.diagSession.pendingAnswer = { userChoice: null, userConfidence: 'certeza', userReasoning: '' };
      }
      st.diagSession.pendingAnswer.userConfidence = target.dataset.diagSelectConf;
      renderPlatform();
    }
    return;
  }
  if (target.dataset.diagConfirmAnswer) {
    event.preventDefault();
    confirmDiagnosticAnswer();
    return;
  }
  if (target.dataset.diagInterviewChip) {
    event.preventDefault();
    const txt = target.dataset.diagInterviewChip;
    const inp = document.getElementById('diag-investigation-response') || document.getElementById('diag-interview-response');
    if (inp) {
      inp.value = txt;
      inp.focus();
    }
    return;
  }
  if (target.dataset.diagSubmitInvestigation || target.dataset.diagSubmitInterview) {
    event.preventDefault();
    const inp = document.getElementById('diag-investigation-response') || document.getElementById('diag-interview-response');
    const val = inp?.value?.trim() || 'Resposta enviada';
    submitDiagnosticInvestigation(val);
    return;
  }
  if (target.dataset.diagSkipInvestigation || target.dataset.diagSkipInterview) {
    event.preventDefault();
    submitDiagnosticInvestigation('(A estudante optou por continuar sem detalhar a resposta)');
    return;
  }
  if (target.dataset.diagConcludeEarly) {
    event.preventDefault();
    concludeDiagnosticSession();
    return;
  }
  if (target.dataset.diagCancel || target.dataset.diagFinish) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.diagSession = null;
    st.activeArea = 'diagnostics';
    st.subView = 'main';
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (target.dataset.togglePetBot) {
    event.preventDefault();
    storageService.petBotActive = storageService.petBotActive === false ? true : false;
    syncFloatingPetBot();
    syncAiChatWidget();
    renderPlatform();
    return;
  }
  if (target.dataset.petBotClick) {
    event.preventDefault();
    handlePetBotClick();
    return;
  }
  if (target.dataset.petBubbleClose) {
    event.preventDefault();
    storageService.petBotBubbleOpen = false;
    syncFloatingPetBot();
    return;
  }
  if (target.dataset.petNextTip) {
    event.preventDefault();
    const curIdx = storageService.petBotTipIdx || 0;
    const nextIdx = (curIdx + 1) % PET_BOT_TIPS.length;
    storageService.petBotTipIdx = nextIdx;
    storageService.petBotMessage = PET_BOT_TIPS[nextIdx];
    syncFloatingPetBot();
    return;
  }
  if (target.dataset.petOpenChat) {
    event.preventDefault();
    storageService.aiChatOpen = true;
    syncAiChatWidget();
    return;
  }
  if (target.dataset.diagFilterArea) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.diagAreaFilter = target.dataset.diagFilterArea;
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.diagMarkCompleted) {
    event.preventDefault();
    const modId = target.dataset.diagMarkCompleted;
    const mod = getModuleById(modId);
    const st = storageService.getActiveState();
    if (mod) {
      (mod.blocos || []).forEach(blk => {
        (blk.habilidades || []).forEach(hab => {
          const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
          if (!st.topicProgress[tKey]) st.topicProgress[tKey] = {};
          st.topicProgress[tKey].completed = true;
          st.topicProgress[tKey].updatedAt = new Date().toISOString();
        });
      });
      storageService.save();
      toast(`Parabéns! "${mod.assunto}" registrado como Concluído e Dominado na sua Progressão.`);
    }
    st.diagSession = null;
    renderPlatform();
    return;
  }
  if (target.dataset.diagAddMyList) {
    event.preventDefault();
    const modId = target.dataset.diagAddMyList;
    const mod = getModuleById(modId);
    const st = storageService.getActiveState();
    if (mod) {
      const firstHab = mod.blocos?.[0]?.habilidades?.[0];
      const tKey = firstHab ? buildTopicKey(mod.materiaId, mod.assuntoId, mod.blocos[0].id, firstHab.id) : null;
      if (tKey) {
        if (!st.studyList) st.studyList = [];
        const already = st.studyList.some(item => item.topicKey === tKey);
        if (!already) {
          const hist = (st.diagnosticsHistory || {})[modId];
          const isEstudo = hist?.nivelGlobal === 'NAO_SEI' || hist?.veredicto === 'ESTUDO_NECESSARIO';
          st.studyList.push({
            id: `list_${Date.now()}`,
            topicKey: tKey,
            materiaId: mod.materiaId,
            materia: mod.materia,
            assunto: mod.assunto,
            blockTitle: mod.blocos?.[0]?.titulo || mod.assunto,
            title: firstHab.nome,
            subtitle: firstHab.codigo || 'Tópico 1',
            status: isEstudo ? 'A estudar' : 'Revisar',
            priority: isEstudo ? 'Alta' : 'Média',
            origin: 'Diagnóstico IA',
            addedAt: new Date().toISOString()
          });
          storageService.save();
          toast(`"${mod.assunto}" adicionado com prioridade à sua Minha Lista!`);
        } else {
          toast(`"${mod.assunto}" já estava na sua Minha Lista.`);
        }
      }
    }
    st.diagSession = null;
    renderPlatform();
    return;
  }
  if (target.dataset.addSuggestedToList) {
    event.preventDefault();
    const modId = target.dataset.addSuggestedToList;
    const mod = getModuleById(modId);
    const st = storageService.getActiveState();
    if (mod) {
      const firstHab = mod.blocos?.[0]?.habilidades?.[0];
      const tKey = firstHab ? buildTopicKey(mod.materiaId, mod.assuntoId, mod.blocos[0].id, firstHab.id) : null;
      if (tKey) {
        if (!st.studyList) st.studyList = [];
        const already = st.studyList.some(item => item.topicKey === tKey);
        if (!already) {
          const hist = (st.diagnosticsHistory || {})[modId];
          const isEstudo = hist?.nivelGlobal === 'NAO_SEI' || hist?.veredicto === 'ESTUDO_NECESSARIO';
          st.studyList.push({
            id: `list_${Date.now()}`,
            topicKey: tKey,
            materiaId: mod.materiaId,
            materia: mod.materia,
            assunto: mod.assunto,
            blockTitle: mod.blocos?.[0]?.titulo || mod.assunto,
            title: firstHab.nome,
            subtitle: firstHab.codigo || 'Tópico Principal',
            status: isEstudo ? 'A estudar' : 'Revisar',
            priority: isEstudo ? 'Alta' : 'Média',
            origin: 'Sugestão da IA',
            addedAt: new Date().toISOString()
          });
          storageService.save();
          toast(`"${mod.assunto}" adicionado à sua Minha Lista!`);
        } else {
          toast(`"${mod.assunto}" já está na sua Minha Lista.`);
        }
      }
    }
    renderPlatform();
    return;
  }
  if (target.dataset.toggleAiSuggestions) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.hideAiSuggestions = !st.hideAiSuggestions;
    storageService.save();
    renderPlatform();
    return;
  }

  /* 0.1 Tutor IA (Google Gemini) */
  if (target.dataset.toggleAiChat) {
    event.preventDefault();
    storageService.aiChatOpen = !storageService.aiChatOpen;
    syncAiChatWidget();
    if (storageService.aiChatOpen) {
      setTimeout(() => {
        const inp = document.getElementById('ai-chat-input');
        if (inp) inp.focus();
      }, 50);
    }
    return;
  }
  if (target.dataset.closeAiChat) {
    event.preventDefault();
    storageService.aiChatOpen = false;
    syncAiChatWidget();
    return;
  }
  if (target.dataset.clearAiChat) {
    event.preventDefault();
    if (window.aiService?.clearHistory) window.aiService.clearHistory();
    storageService.aiError = '';
    syncAiChatWidget();
    toast('Conversa com a Professora IA reiniciada!');
    return;
  }
  if (target.dataset.aiSend) {
    event.preventDefault();
    const inp = document.getElementById('ai-chat-input');
    const txt = inp?.value?.trim();
    if (txt) {
      inp.value = '';
      sendAiUserMessage(txt);
    }
    return;
  }
  if (target.dataset.aiQuickPrompt) {
    event.preventDefault();
    const promptText = target.dataset.aiQuickPrompt;
    sendAiUserMessage(promptText);
    return;
  }
  if (target.dataset.aiAskTopic) {
    event.preventDefault();
    const topicKey = target.dataset.aiAskTopic;
    const eff = getEffectiveTopicData(topicKey);
    storageService.aiChatOpen = true;
    syncAiChatWidget();
    sendAiUserMessage(`Olá Professora IA! Estou estudando o tópico "${eff ? eff.titulo : 'atual'}" (${eff?.mod?.materia || 'ENEM'}). Poderia me dar uma visão geral dos pontos mais cobrados pelo ENEM sobre esse assunto?`);
    return;
  }
  if (target.dataset.aiExplainQ) {
    event.preventDefault();
    const qId = target.dataset.aiExplainQ;
    const topicKey = target.dataset.topicKey;
    const eff = getEffectiveTopicData(topicKey);
    const q = (eff?.questoesEnem || []).find(item => item.id === qId);
    if (!q) {
      toast('Questão não encontrada.');
      return;
    }

    storageService.aiChatOpen = true;
    syncAiChatWidget();

    const altsText = Object.entries(q.alternativas || {})
      .map(([l, text]) => `${l}) ${text}`)
      .join('\n');

    const questionPrompt = `Poderia me explicar detalhadamente a seguinte questão oficial do ENEM (${q.ano || 'ENEM'} - ${q.prova || 'Oficial'}) sobre "${eff.titulo}"?\n\n` +
      `Enunciado:\n${q.enunciado}\n\n` +
      `Alternativas:\n${altsText}\n\n` +
      `Gabarito Oficial: Alternativa ${q.correta}\n\n` +
      `Por favor, explique com uma linguagem didática:\n` +
      `1. O raciocínio e a interpretação para resolver;\n` +
      `2. Por que a alternativa ${q.correta} está absolutamente correta;\n` +
      `3. Por que as outras alternativas estão incorretas (pegadinhas comuns).`;

    sendAiUserMessage(questionPrompt);
    return;
  }
  if (target.dataset.aiSaveKeyInput) {
    event.preventDefault();
    const inputId = target.dataset.aiSaveKeyInput;
    const inp = document.getElementById(inputId);
    const val = inp?.value?.trim() || '';
    if (window.aiService?.setApiKey) {
      window.aiService.setApiKey(val);
      syncAiChatWidget();
      toast(val ? 'Chave da API Gemini salva com sucesso!' : 'Chave removida.');
    }
    return;
  }

  /* 0. Menu Hambúrguer (☰) e Modo Edição */
  if (target.dataset.toggleDrawer) {
    event.preventDefault();
    storageService.drawerOpen = !storageService.drawerOpen;
    renderPlatform();
    return;
  }
  if (target.dataset.closeDrawer) {
    event.preventDefault();
    storageService.drawerOpen = false;
    renderPlatform();
    return;
  }
  if (target.dataset.toggleEditMode) {
    event.preventDefault();
    storageService.toggleEditMode();
    storageService.drawerOpen = false;
    renderPlatform();
    toast(storageService.editMode ? '✏️ Modo Edição ativado! Agora você pode personalizar tudo.' : 'Modo Edição concluído.');
    return;
  }

  /* 1. Navegação Principal */
  if (target.dataset.mainNav) {
    event.preventDefault();
    const dest = target.dataset.mainNav;
    const st = storageService.getActiveState();
    if (dest === 'notes') {
      st.activeArea = 'my-list';
      st.myListView = 'notes';
    } else {
      st.activeArea = dest;
      st.subView = 'main';
      if (dest === 'my-list' && !st.myListView) {
        st.myListView = 'list';
      }
    }
    if (dest === 'diagnostics' && (!st.diagSession || st.diagSession.step === 'result')) {
      st.diagSession = null;
    }
    storageService.drawerOpen = false;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  /* 2. Atalho Rápido para Assunto na Biblioteca */
  if (target.dataset.quickLibrary) {
    event.preventDefault();
    const modId = target.dataset.quickLibrary;
    const mod = getModuleById(modId);
    const st = storageService.getActiveState();
    st.activeArea = 'library';
    st.subView = 'main';
    st.libraryFilterEnemArea = 'all';
    st.libraryFilterMateria = mod ? mod.materiaId : 'all';
    st.libraryFilterModule = modId;
    if (!st.openAccordions) st.openAccordions = {};
    st.openAccordions[`lib_mod_${modId}`] = true;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  /* 3. Ações de Perfil e Backup JSON */
  const profAction = target.dataset.profileAction;
  if (profAction) {
    event.preventDefault();
    if (profAction === 'skip-onboarding') {
      if (!storageService.getActiveProfile()) {
        storageService.createProfile('Estudante', '', 'medio');
      }
      activeTopModal = null;
      renderPlatform();
      return;
    }
    if (profAction === 'open-new-profile') {
      storageService.drawerOpen = false;
      activeTopModal = 'new-profile';
      renderPlatform();
      return;
    }
    if (profAction === 'open-edit-profile') {
      storageService.drawerOpen = false;
      if (!storageService.getActiveProfile()) {
        storageService.createProfile('Estudante', '', 'medio');
      }
      activeTopModal = 'edit-profile';
      renderPlatform();
      return;
    }
    if (profAction === 'close-modal') {
      activeTopModal = null;
      renderPlatform();
      return;
    }
    if (profAction === 'save-new-profile') {
      const nameEl = document.getElementById('ob-prof-name');
      const goalEl = document.getElementById('ob-prof-goal');
      const paceEl = document.querySelector('input[name="ob-pace"]:checked');
      const apiKeyEl = document.getElementById('ob-prof-apikey');
      const name = nameEl ? nameEl.value.trim() : '';
      if (!name) {
        toast('Por favor, digite seu nome para continuar.');
        nameEl?.focus();
        return;
      }
      const apiKey = apiKeyEl ? apiKeyEl.value.trim() : '';
      const p = storageService.createProfile(name, goalEl?.value || '', paceEl?.value || 'medio', apiKey);
      if (apiKey && window.aiService?.setApiKey) {
        window.aiService.setApiKey(apiKey);
      }
      activeTopModal = null;
      renderPlatform();
      toast(`Bem-vinda(o), ${p.name}!`);
      return;
    }
    if (profAction === 'save-edit-profile') {
      const name = document.getElementById('ob-edit-prof-name')?.value?.trim();
      const goal = document.getElementById('ob-edit-prof-goal')?.value?.trim() || '';
      const pace = document.querySelector('input[name="ob-edit-pace"]:checked')?.value || 'medio';
      const apiKey = document.getElementById('ob-edit-prof-apikey')?.value?.trim();
      if (!name) {
        toast('Digite um nome válido.');
        return;
      }
      storageService.updateActiveProfile(name, goal, pace, apiKey);
      if (apiKey !== undefined && window.aiService?.setApiKey) {
        window.aiService.setApiKey(apiKey);
      }
      activeTopModal = null;
      renderPlatform();
      toast('Perfil atualizado com sucesso!');
      return;
    }
    if (profAction === 'save-folder-file') {
      const res = await storageService.saveToFolderFile();
      if (res && res.ok) {
        storageService.drawerOpen = false;
        renderPlatform();
        toast(res.mode === 'folder' ? '💾 Dados salvos diretamente na pasta do computador!' : '💾 Arquivo de dados salvo na pasta do computador!');
      }
      return;
    }
    if (profAction === 'download-json') {
      storageService.exportBackup();
      toast('Backup .JSON exportado com sucesso!');
      return;
    }
    if (profAction === 'upload-json') {
      const fileInput = document.getElementById('ob-import-file-input');
      const file = fileInput?.files?.[0];
      if (!file) {
        toast('Selecione um arquivo .json primeiro.');
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        const res = storageService.importBackupText(String(e.target?.result || ''));
        if (res.ok) {
          storageService.drawerOpen = false;
          renderPlatform();
          toast('Backup importado e restaurado com sucesso!');
        } else {
          toast(`Erro ao importar: ${res.msg}`);
        }
      };
      reader.readAsText(file);
      return;
    }
    if (profAction === 'reset-defaults') {
      if (confirm('Deseja restaurar as matérias e textos para o padrão original de fábrica?')) {
        storageService.resetToDefaults();
        storageService.drawerOpen = false;
        renderPlatform();
        toast('Padrões originais restaurados.');
      }
      return;
    }
  }

  if (target.dataset.profileSwitchId) {
    event.preventDefault();
    storageService.switchProfile(target.dataset.profileSwitchId);
    storageService.drawerOpen = false;
    renderPlatform();
    const prof = storageService.getActiveProfile();
    toast(`Perfil alternado para ${prof?.name || 'Estudante'}.`);
    return;
  }

  if (target.dataset.profileDeleteId) {
    event.preventDefault();
    const pid = target.dataset.profileDeleteId;
    const profs = storageService.getProfiles();
    const targetProf = profs.find(p => p.id === pid);
    if (!targetProf) return;
    if (confirm(`Deseja excluir o perfil "${targetProf.name}"?\n\n(Aviso de Segurança: Suas matérias e conteúdos criados/editados no site continuam 100% seguros e intactos).`)) {
      storageService.deleteProfile(pid);
      renderPlatform();
      toast(`Perfil "${targetProf.name}" excluído.`);
    }
    return;
  }

  /* 4. Abrir Tópico / Aula ("Estudar Agora") */
  if (target.dataset.openTopic) {
    event.preventDefault();
    const tKey = target.dataset.openTopic;
    const eff = getEffectiveTopicData(tKey);
    if (!eff) return;

    const st = storageService.getActiveState();
    st.activeArea = 'library';
    st.subView = 'topic-study';
    st.activeTopicKey = tKey;
    st.activeTopicTab = 'resumo';
    if (!st.topicProgress) st.topicProgress = {};
    if (!st.topicProgress[tKey]) {
      st.topicProgress[tKey] = { summaryRead: true, status: 'Em andamento', enemAnswers: {} };
    } else {
      st.topicProgress[tKey].summaryRead = true;
    }
    storageService.setLastActivity({
      type: 'topic',
      topicKey: tKey,
      label: `${eff.mod.materia} · ${eff.mod.assunto} — ${eff.titulo}`
    });
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target.dataset.backToCatalog) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.subView = 'main';
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target.dataset.switchTopicTab) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.activeTopicTab = target.dataset.switchTopicTab;
    storageService.save();
    renderPlatform();
    return;
  }

  /* 5. Marcar Tópico como Concluído / Revisar / Adicionar à Lista */
  if (target.dataset.toggleCompleteTopic) {
    event.preventDefault();
    const tKey = target.dataset.toggleCompleteTopic;
    const isNowCompleted = toggleCompleteTopic(tKey);
    renderPlatform();
    toast(isNowCompleted ? '🎉 Tópico marcado como Concluído!' : 'Tópico reaberto para estudo.');
    return;
  }

  if (target.dataset.libMarkReview) {
    event.preventDefault();
    const tKey = target.dataset.libMarkReview;
    const st = storageService.getActiveState();
    if (!st.topicProgress[tKey]) st.topicProgress[tKey] = { summaryRead: true, enemAnswers: {} };
    st.topicProgress[tKey].status = 'Revisar';
    addSkillToStudyList(tKey, { status: 'Revisar', priority: 'Alta' });
    storageService.save();
    renderPlatform();
    toast('Tópico marcado para revisão na Minha Lista!');
    return;
  }

  if (target.dataset.libAddList) {
    event.preventDefault();
    const tKey = target.dataset.libAddList;
    const res = addSkillToStudyList(tKey, { status: 'A estudar', priority: 'Média' });
    renderPlatform();
    toast(res.added ? '📌 Tópico adicionado à Minha Lista!' : 'Este tópico já está na sua Minha Lista.');
    return;
  }

  /* 6. Questões do ENEM dentro do Tópico */
  if (target.dataset.enemSelectQ) {
    event.preventDefault();
    const qId = target.dataset.enemSelectQ;
    const letter = target.dataset.enemSelectLetter;
    const tKey = target.dataset.topicKey;
    const st = storageService.getActiveState();
    if (!st.topicProgress[tKey]) st.topicProgress[tKey] = { summaryRead: true, enemAnswers: {} };
    if (!st.topicProgress[tKey].enemAnswers) st.topicProgress[tKey].enemAnswers = {};
    const prev = st.topicProgress[tKey].enemAnswers[qId] || {};
    st.topicProgress[tKey].enemAnswers[qId] = { ...prev, selected: letter };
    storageService.save();
    renderPlatform();
    return;
  }

  if (target.dataset.enemCheckQ) {
    event.preventDefault();
    const qId = target.dataset.enemCheckQ;
    const tKey = target.dataset.topicKey;
    const st = storageService.getActiveState();
    const cur = st.topicProgress?.[tKey]?.enemAnswers?.[qId];
    if (!cur || !cur.selected) return;
    cur.checked = true;
    storageService.save();
    renderPlatform();
    return;
  }

  /* 7. Filtros da Biblioteca, Minha Lista e Progressão */
  if (target.dataset.libFilterArea) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.libraryFilterEnemArea = target.dataset.libFilterArea;
    st.libraryFilterMateria = 'all';
    st.libraryFilterModule = 'all';
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.libFilterMat) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.libraryFilterMateria = target.dataset.libFilterMat;
    st.libraryFilterModule = 'all';
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.libFilterMod) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.libraryFilterModule = target.dataset.libFilterMod;
    if (st.libraryFilterModule !== 'all') {
      if (!st.openAccordions) st.openAccordions = {};
      st.openAccordions[`lib_mod_${st.libraryFilterModule}`] = true;
    }
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.libClearSearch) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.librarySearch = '';
    st.libraryFilterEnemArea = 'all';
    st.libraryFilterMateria = 'all';
    st.libraryFilterModule = 'all';
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.listFilterStatus) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.listFilterStatus = target.dataset.listFilterStatus;
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.listFilterMat) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.listFilterMateria = target.dataset.listFilterMat;
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.progFilterMat) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.progFilterMateria = target.dataset.progFilterMat;
    storageService.save();
    renderPlatform();
    return;
  }

  /* 8. Ações na Minha Lista */
  if (target.dataset.listManualAdd) {
    event.preventDefault();
    const sel = document.getElementById('ob-manual-topic-select');
    const tKey = sel?.value;
    if (!tKey) {
      toast('Escolha um tópico no menu primeiro.');
      return;
    }
    const res = addSkillToStudyList(tKey, { status: 'A estudar', priority: 'Média' });
    renderPlatform();
    toast(res.added ? 'Tópico adicionado à Minha Lista!' : 'Este tópico já está na sua lista.');
    return;
  }
  if (target.dataset.listMoveUp || target.dataset.listMoveDown) {
    event.preventDefault();
    const itemId = target.dataset.listMoveUp || target.dataset.listMoveDown;
    const dir = target.dataset.listMoveUp ? -1 : 1;
    const st = storageService.getActiveState();
    const list = st.studyList || [];
    const idx = list.findIndex(i => i.id === itemId);
    const swapIdx = idx + dir;
    if (idx >= 0 && swapIdx >= 0 && swapIdx < list.length) {
      const tmp = list[idx];
      list[idx] = list[swapIdx];
      list[swapIdx] = tmp;
      storageService.save();
      renderPlatform();
    }
    return;
  }
  if (target.dataset.listDelete) {
    event.preventDefault();
    const itemId = target.dataset.listDelete;
    const st = storageService.getActiveState();
    st.studyList = (st.studyList || []).filter(i => i.id !== itemId);
    storageService.save();
    renderPlatform();
    toast('Item removido da Minha Lista.');
    return;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     8.5 AÇÕES DO CADERNO DE ANOTAÇÕES (ESTILO NOTION)
     ═══════════════════════════════════════════════════════════════════════ */
  if (target.dataset.switchMyListView) {
    event.preventDefault();
    const st = storageService.getActiveState();
    st.myListView = target.dataset.switchMyListView;
    storageService.save();
    renderPlatform();
    return;
  }

  if (target.dataset.createNewNote) {
    event.preventDefault();
    const st = storageService.getActiveState();
    if (!Array.isArray(st.notes)) st.notes = [];
    const newNote = {
      id: 'note_' + Date.now(),
      title: 'Nova Página',
      icon: '📝',
      materiaId: 'geral',
      materia: 'Geral',
      topicKey: '',
      updatedAt: Date.now(),
      blocks: [
        { id: 'b_head_' + Date.now(), type: 'h2', content: 'Anotações da Aula' },
        { id: 'b_intro_' + Date.now(), type: 'p', content: 'Escreva suas observações, fórmulas e dúvidas aqui...' }
      ]
    };
    st.notes.unshift(newNote);
    st.activeNoteId = newNote.id;
    storageService.save();
    renderPlatform();
    setTimeout(() => {
      const titleInput = document.getElementById('notion-page-title');
      if (titleInput) {
        titleInput.focus();
        titleInput.select();
      }
    }, 50);
    return;
  }

  if (target.dataset.selectNote) {
    if (event.target.closest('[data-delete-note]')) return;
    event.preventDefault();
    const st = storageService.getActiveState();
    st.activeNoteId = target.dataset.selectNote;
    storageService.save();
    renderPlatform();
    return;
  }

  if (target.dataset.deleteNote) {
    event.preventDefault();
    event.stopPropagation();
    const noteId = target.dataset.deleteNote;
    const st = storageService.getActiveState();
    const note = (st.notes || []).find(n => n.id === noteId);
    const title = note ? note.title : 'esta página';
    if (!confirm(`Deseja realmente excluir a página "${title}"?`)) return;
    st.notes = (st.notes || []).filter(n => n.id !== noteId);
    if (st.activeNoteId === noteId) {
      st.activeNoteId = st.notes[0]?.id || null;
    }
    storageService.save();
    renderPlatform();
    toast('Página excluída.');
    return;
  }

  if (target.dataset.toggleEmojiPopover) {
    event.preventDefault();
    const pop = document.getElementById('notion-emoji-popover');
    if (pop) {
      pop.classList.toggle('is-open');
    }
    return;
  }

  if (target.dataset.selectEmoji) {
    event.preventDefault();
    const emoji = target.dataset.selectEmoji;
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
    if (activeNote) {
      activeNote.icon = emoji;
      activeNote.updatedAt = Date.now();
      storageService.save();
      renderPlatform();
    }
    return;
  }

  if (target.dataset.changeCalloutIcon) {
    event.preventDefault();
    const blockId = target.dataset.changeCalloutIcon;
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
    if (activeNote) {
      const blk = (activeNote.blocks || []).find(b => b.id === blockId);
      if (blk) {
        const icons = ['💡', '⚠️', '⭐', '🔥', '📌', '🎯', '🧪', '🧠', '✅', '🚀'];
        const curIdx = icons.indexOf(blk.icon || '💡');
        blk.icon = icons[(curIdx + 1) % icons.length];
        activeNote.updatedAt = Date.now();
        storageService.save();
        renderPlatform();
      }
    }
    return;
  }

  if (target.dataset.addBlockType) {
    event.preventDefault();
    const type = target.dataset.addBlockType;
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
    if (activeNote) {
      if (!Array.isArray(activeNote.blocks)) activeNote.blocks = [];
      const newBlock = {
        id: 'blk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        type,
        content: '',
        checked: false,
        icon: type === 'callout' ? '💡' : undefined,
        title: type === 'reference' ? '' : undefined,
        url: type === 'reference' ? '' : undefined,
        src: type === 'image' ? '' : undefined,
        caption: type === 'image' ? '' : undefined
      };
      activeNote.blocks.push(newBlock);
      activeNote.updatedAt = Date.now();
      storageService.save();
      renderPlatform();
      setTimeout(() => {
        const el = document.querySelector(`[data-note-block-id="${newBlock.id}"]`);
        if (el) el.focus();
      }, 50);
    }
    return;
  }

  if (target.dataset.deleteBlock) {
    event.preventDefault();
    const blockId = target.dataset.deleteBlock;
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
    if (activeNote && Array.isArray(activeNote.blocks)) {
      activeNote.blocks = activeNote.blocks.filter(b => b.id !== blockId);
      activeNote.updatedAt = Date.now();
      storageService.save();
      renderPlatform();
    }
    return;
  }

  if (target.dataset.moveBlockUp || target.dataset.moveBlockDown) {
    event.preventDefault();
    const blockId = target.dataset.moveBlockUp || target.dataset.moveBlockDown;
    const dir = target.dataset.moveBlockUp ? -1 : 1;
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
    if (activeNote && Array.isArray(activeNote.blocks)) {
      const idx = activeNote.blocks.findIndex(b => b.id === blockId);
      if (idx >= 0 && idx + dir >= 0 && idx + dir < activeNote.blocks.length) {
        const temp = activeNote.blocks[idx];
        activeNote.blocks[idx] = activeNote.blocks[idx + dir];
        activeNote.blocks[idx + dir] = temp;
        activeNote.updatedAt = Date.now();
        storageService.save();
        renderPlatform();
      }
    }
    return;
  }

  if (target.dataset.aiReviewNote) {
    event.preventDefault();
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === target.dataset.aiReviewNote) || (st.notes || [])[0];
    if (!activeNote) return;

    let textBlocks = (activeNote.blocks || []).map(b => {
      if (b.type === 'h1' || b.type === 'h2' || b.type === 'h3') return `### ${b.content || ''}`;
      if (b.type === 'bullet') return `• ${b.content || ''}`;
      if (b.type === 'todo') return `[${b.checked ? 'X' : ' '}] ${b.content || ''}`;
      if (b.type === 'callout') return `> 💡 ${b.content || ''}`;
      if (b.type === 'code') return `Fórmula / Modelo:\n${b.content || ''}`;
      if (b.type === 'reference') return `Referência: ${b.title || ''} (${b.url || ''})`;
      return b.content || '';
    }).filter(Boolean).join('\n');

    const prompt = `Olá, Professora IA! Aqui estão as minhas anotações de estudo no meu Caderno sobre "${activeNote.title}" (${activeNote.materia || 'Geral'}):\n\n${textBlocks}\n\nPor favor, faça uma revisão acolhedora e direta: diga se meus resumos e fórmulas estão corretos segundo o ENEM, aponte qualquer pegadinha ou detalhe que costuma cair na prova sobre esse assunto e deixe uma dica prática!`;

    storageService.aiChatOpen = true;
    renderPlatform();
    setTimeout(() => {
      sendAiUserMessage(prompt);
    }, 120);
    return;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     9. AÇÕES DO CMS VISUAL (CRIAR, EDITAR, MOVER E EXCLUIR TUDO)
     ═══════════════════════════════════════════════════════════════════════ */
  if (target.dataset.cmsOpen) {
    event.preventDefault();
    activeEditorModal = {
      type: target.dataset.cmsOpen,
      subjId: target.dataset.subjId || '',
      modId: target.dataset.modId || '',
      blkId: target.dataset.blkId || '',
      topicKey: target.dataset.topicKey || '',
      enemArea: target.dataset.enemArea || '',
      itemIdx: target.dataset.itemIdx !== undefined ? Number(target.dataset.itemIdx) : -1
    };
    renderPlatform();
    return;
  }

  if (target.dataset.cmsClose) {
    event.preventDefault();
    activeEditorModal = null;
    renderPlatform();
    return;
  }

  /* Mover / Excluir Matérias */
  if (target.dataset.cmsMoveSubj) {
    event.preventDefault();
    const sId = target.dataset.cmsMoveSubj;
    const dir = Number(target.dataset.dir || 0);
    const cms = storageService.getCms();
    const curIds = getEffectiveSubjects().map(s => s.id);
    const idx = curIds.indexOf(sId);
    const swap = idx + dir;
    if (idx >= 0 && swap >= 0 && swap < curIds.length) {
      const tmp = curIds[idx];
      curIds[idx] = curIds[swap];
      curIds[swap] = tmp;
      cms.subjectsOrder = curIds;
      storageService.save();
      renderPlatform();
    }
    return;
  }

  if (target.dataset.cmsDeleteSubj) {
    event.preventDefault();
    const sId = target.dataset.cmsDeleteSubj;
    const subj = getEffectiveSubjects().find(s => s.id === sId);
    if (!confirm(`Deseja realmente ocultar/excluir a matéria "${subj?.nome || sId}"?`)) return;
    const cms = storageService.getCms();
    if (!cms.deletedSubjectIds.includes(sId)) cms.deletedSubjectIds.push(sId);
    storageService.save();
    renderPlatform();
    toast('Matéria removida.');
    return;
  }

  /* Mover / Excluir Assuntos (Módulos) */
  if (target.dataset.cmsMoveMod) {
    event.preventDefault();
    const mId = target.dataset.cmsMoveMod;
    const dir = Number(target.dataset.dir || 0);
    const cms = storageService.getCms();
    const curIds = getAllModules().map(m => m.id);
    const idx = curIds.indexOf(mId);
    const swap = idx + dir;
    if (idx >= 0 && swap >= 0 && swap < curIds.length) {
      const tmp = curIds[idx];
      curIds[idx] = curIds[swap];
      curIds[swap] = tmp;
      cms.modulesOrder = curIds;
      storageService.save();
      renderPlatform();
    }
    return;
  }

  if (target.dataset.cmsDeleteMod) {
    event.preventDefault();
    const mId = target.dataset.cmsDeleteMod;
    const mod = getModuleById(mId);
    if (!confirm(`Deseja realmente excluir o assunto "${mod?.assunto || mId}"?`)) return;
    const cms = storageService.getCms();
    if (!cms.deletedModuleIds.includes(mId)) cms.deletedModuleIds.push(mId);
    storageService.save();
    renderPlatform();
    toast('Assunto removido.');
    return;
  }

  /* Mover / Excluir Blocos */
  if (target.dataset.cmsMoveBlock) {
    event.preventDefault();
    const bId = target.dataset.cmsMoveBlock;
    const mId = target.dataset.modId;
    const dir = Number(target.dataset.dir || 0);
    const mod = getModuleById(mId);
    if (!mod) return;
    const cfg = getBlockCmsConfig(mId);
    const curIds = mod.blocos.map(b => b.id);
    const idx = curIds.indexOf(bId);
    const swap = idx + dir;
    if (idx >= 0 && swap >= 0 && swap < curIds.length) {
      const tmp = curIds[idx];
      curIds[idx] = curIds[swap];
      curIds[swap] = tmp;
      cfg.order = curIds;
      storageService.save();
      renderPlatform();
    }
    return;
  }

  if (target.dataset.cmsDeleteBlock) {
    event.preventDefault();
    const bId = target.dataset.cmsDeleteBlock;
    const mId = target.dataset.modId;
    if (!confirm('Deseja excluir este bloco de estudos?')) return;
    const cfg = getBlockCmsConfig(mId);
    if (!cfg.deletedIds.includes(bId)) cfg.deletedIds.push(bId);
    storageService.save();
    renderPlatform();
    toast('Bloco removido.');
    return;
  }

  /* Mover / Excluir Tópicos */
  if (target.dataset.cmsMoveTopic) {
    event.preventDefault();
    const hId = target.dataset.cmsMoveTopic;
    const mId = target.dataset.modId;
    const bId = target.dataset.blkId;
    const dir = Number(target.dataset.dir || 0);
    const mod = getModuleById(mId);
    const blk = (mod?.blocos || []).find(b => b.id === bId);
    if (!blk) return;
    const cfg = getTopicCmsConfig(mId, bId);
    const curIds = blk.habilidades.map(h => h.id);
    const idx = curIds.indexOf(hId);
    const swap = idx + dir;
    if (idx >= 0 && swap >= 0 && swap < curIds.length) {
      const tmp = curIds[idx];
      curIds[idx] = curIds[swap];
      curIds[swap] = tmp;
      cfg.order = curIds;
      storageService.save();
      renderPlatform();
    }
    return;
  }

  if (target.dataset.cmsDeleteTopic) {
    event.preventDefault();
    const hId = target.dataset.cmsDeleteTopic;
    const mId = target.dataset.modId;
    const bId = target.dataset.blkId;
    if (!confirm('Deseja remover este tópico/aula?')) return;
    const cfg = getTopicCmsConfig(mId, bId);
    if (!cfg.deletedIds.includes(hId)) cfg.deletedIds.push(hId);
    storageService.save();
    renderPlatform();
    toast('Tópico removido.');
    return;
  }

  /* Mover / Excluir Videoaulas, Sites e Questões dentro de um Tópico */
  if (target.dataset.cmsMoveVideo !== undefined) {
    event.preventDefault();
    const idx = Number(target.dataset.cmsMoveVideo);
    const dir = Number(target.dataset.dir || 0);
    const tKey = target.dataset.topicKey;
    const eff = getEffectiveTopicData(tKey);
    const newVids = [...eff.videos];
    const swap = idx + dir;
    if (idx >= 0 && swap >= 0 && swap < newVids.length) {
      const tmp = newVids[idx];
      newVids[idx] = newVids[swap];
      newVids[swap] = tmp;
      saveTopicCustomData(tKey, { videos: newVids });
      renderPlatform();
    }
    return;
  }

  if (target.dataset.cmsDeleteVideo !== undefined) {
    event.preventDefault();
    const idx = Number(target.dataset.cmsDeleteVideo);
    const tKey = target.dataset.topicKey;
    const eff = getEffectiveTopicData(tKey);
    const newVids = eff.videos.filter((_, i) => i !== idx);
    saveTopicCustomData(tKey, { videos: newVids });
    renderPlatform();
    toast('Videoaula removida.');
    return;
  }

  if (target.dataset.cmsMoveSite !== undefined) {
    event.preventDefault();
    const idx = Number(target.dataset.cmsMoveSite);
    const dir = Number(target.dataset.dir || 0);
    const tKey = target.dataset.topicKey;
    const eff = getEffectiveTopicData(tKey);
    const newSites = [...eff.sites];
    const swap = idx + dir;
    if (idx >= 0 && swap >= 0 && swap < newSites.length) {
      const tmp = newSites[idx];
      newSites[idx] = newSites[swap];
      newSites[swap] = tmp;
      saveTopicCustomData(tKey, { sites: newSites });
      renderPlatform();
    }
    return;
  }

  if (target.dataset.cmsDeleteSite !== undefined) {
    event.preventDefault();
    const idx = Number(target.dataset.cmsDeleteSite);
    const tKey = target.dataset.topicKey;
    const eff = getEffectiveTopicData(tKey);
    const newSites = eff.sites.filter((_, i) => i !== idx);
    saveTopicCustomData(tKey, { sites: newSites });
    renderPlatform();
    toast('Link removido.');
    return;
  }

  if (target.dataset.cmsDeleteEnemQ !== undefined) {
    event.preventDefault();
    const idx = Number(target.dataset.cmsDeleteEnemQ);
    const tKey = target.dataset.topicKey;
    const eff = getEffectiveTopicData(tKey);
    const newQs = eff.questoesEnem.filter((_, i) => i !== idx);
    saveTopicCustomData(tKey, { questoesEnem: newQs });
    renderPlatform();
    toast('Questão removida.');
    return;
  }

  if (target.dataset.cmsRemoveResumoImg) {
    event.preventDefault();
    const tKey = target.dataset.cmsRemoveResumoImg;
    saveTopicCustomData(tKey, { resumoImage: '' });
    renderPlatform();
    toast('Imagem removida.');
    return;
  }

  /* SALVAR FORMULÁRIOS DO MODAL CMS */
  if (target.dataset.cmsSave && activeEditorModal) {
    event.preventDefault();
    const saveType = target.dataset.cmsSave;
    const { subjId, modId, blkId, topicKey, itemIdx } = activeEditorModal;

    /* 1. Salvar Textos do Site */
    if (saveType === 'site-texts') {
      storageService.updateSiteTexts({
        brandTitle: document.getElementById('cms-brand-title')?.value?.trim() || 'Meu ENEM',
        homeEyebrow: document.getElementById('cms-home-eyebrow')?.value?.trim() || 'Organizador de Estudos ENEM',
        homeSubtitle: document.getElementById('cms-home-sub')?.value?.trim() || '',
        libraryTitle: document.getElementById('cms-lib-title')?.value?.trim() || 'Biblioteca de Estudos',
        librarySubtitle: document.getElementById('cms-lib-sub')?.value?.trim() || ''
      });
      activeEditorModal = null;
      renderPlatform();
      toast('Textos do site atualizados!');
      return;
    }

    /* 1.1 Salvar Contador do ENEM e Frase Motivacional */
    if (saveType === 'countdown') {
      const title = document.getElementById('cms-cd-title')?.value?.trim() || 'ENEM 2026';
      const targetDate = document.getElementById('cms-cd-date')?.value?.trim() || '2026-11-08';
      const quote = document.getElementById('cms-cd-quote')?.value?.trim() || '';
      const enabled = document.getElementById('cms-cd-enabled')?.value !== 'false';
      storageService.updateCountdown({ title, label: title, targetDate, quote, message: quote, enabled });
      activeEditorModal = null;
      renderPlatform();
      toast('Contador e frase motivacional atualizados com sucesso!');
      return;
    }

    /* 2. Salvar Nova Matéria (criando automaticamente Página de Estudo + Bloco 1 + Tópico 1) ou Editar Matéria */
    if (saveType === 'add-subject' || saveType === 'edit-subject') {
      const nome = document.getElementById('cms-subj-name')?.value?.trim();
      const icone = document.getElementById('cms-subj-icon')?.value?.trim() || '📘';
      const desc = document.getElementById('cms-subj-desc')?.value?.trim() || 'Estudos diretos para o ENEM';
      const enemAreaId = document.getElementById('cms-subj-area')?.value || 'natureza';
      if (!nome) {
        toast('Digite o nome da matéria.');
        return;
      }
      const cms = storageService.getCms();
      if (saveType === 'add-subject') {
        const firstModName = document.getElementById('cms-subj-first-mod')?.value?.trim() || `Introdução a ${nome}`;
        const newSubjId = slugifyId(nome) + '_' + Date.now().toString().slice(-4);
        const newAssuntoId = slugifyId(firstModName);
        const newModId = `${newSubjId}_${newAssuntoId}`;

        cms.customSubjects[newSubjId] = { id: newSubjId, nome, icone, areaId: newSubjId, enemAreaId, desc };
        cms.customModules[newModId] = {
          id: newModId,
          materiaId: newSubjId,
          materia: nome,
          enemAreaId,
          assuntoId: newAssuntoId,
          assunto: firstModName,
          icone,
          cor: '#2f5d50',
          descricao: `Roteiro de estudos de ${firstModName} (${nome}).`,
          blocos: [
            {
              id: 'bloco_1',
              ordem: 1,
              titulo: `Roteiro Principal — ${firstModName}`,
              descricao_curta: `Aulas, resumos e questões sobre ${firstModName}.`,
              resumo: `### Resumo de ${firstModName}\n\nUse o botão **Editar** para personalizar este resumo ou adicionar links e videoaulas.`,
              habilidades: [
                {
                  id: `TOP_1`,
                  codigo: 'T1',
                  nome: `1. Fundamentos de ${firstModName}`,
                  foco: `Conceitos essenciais de ${firstModName} para o ENEM.`,
                  resumo: `### 1. Fundamentos de ${firstModName}\n\nAdicione aqui seus pontos principais, links de leitura e videoaulas do YouTube.`,
                  videos: [],
                  sites: [],
                  questoesEnem: []
                }
              ]
            }
          ]
        };
        storageService.save();
        activeEditorModal = null;
        renderPlatform();
        toast(`Matéria "${nome}" e página "${firstModName}" criadas com sucesso!`);
      } else {
        cms.customSubjects[subjId] = { ...(cms.customSubjects[subjId] || {}), id: subjId, nome, icone, enemAreaId, desc };
        storageService.save();
        activeEditorModal = null;
        renderPlatform();
        toast('Matéria atualizada!');
      }
      return;
    }

    /* 3. Salvar Novo Assunto / Página de Estudo ou Editar Assunto */
    if (saveType === 'add-module' || saveType === 'edit-module') {
      const assunto = document.getElementById('cms-mod-name')?.value?.trim();
      const icone = document.getElementById('cms-mod-icon')?.value?.trim() || '📘';
      const descricao = document.getElementById('cms-mod-desc')?.value?.trim() || '';
      const readTitle = document.getElementById('cms-mod-read-title')?.value?.trim() || '';
      const readPortal = document.getElementById('cms-mod-read-portal')?.value?.trim() || 'Artigo';
      const readUrl = document.getElementById('cms-mod-read-url')?.value?.trim() || '';
      const vidTitle = document.getElementById('cms-mod-vid-title')?.value?.trim() || '';
      const vidDur = document.getElementById('cms-mod-vid-dur')?.value?.trim() || 'Vídeo Inicial';
      const vidUrl = document.getElementById('cms-mod-vid-url')?.value?.trim() || '';

      if (!assunto) {
        toast('Digite o nome do assunto.');
        return;
      }

      const introReading = readUrl ? { titulo: readTitle || `Resumo de ${assunto}`, portal: readPortal, url: readUrl, resumo: 'Leitura introdutória recomendada.' } : null;
      const introVideo = vidUrl ? { titulo: vidTitle || `Introdução a ${assunto}`, url: vidUrl, duracao: vidDur } : null;

      const cms = storageService.getCms();
      if (saveType === 'add-module') {
        const chosenSubjId = document.getElementById('cms-mod-subj')?.value || subjId || 'biologia';
        const subjObj = getEffectiveSubjects().find(s => s.id === chosenSubjId);
        const assuntoId = slugifyId(assunto) + '_' + Date.now().toString().slice(-3);
        const newModId = `${chosenSubjId}_${assuntoId}`;

        cms.customModules[newModId] = {
          id: newModId,
          materiaId: chosenSubjId,
          materia: subjObj?.nome || chosenSubjId,
          assuntoId,
          assunto,
          icone,
          cor: '#2f5d50',
          descricao: descricao || `Estudo direto de ${assunto}.`,
          introReading,
          introVideo,
          blocos: [
            {
              id: 'bloco_1',
              ordem: 1,
              titulo: `Roteiro de Estudo — ${assunto}`,
              descricao_curta: `Tópicos e videoaulas de ${assunto}.`,
              resumo: `### ${assunto}\n\nResumo geral de ${assunto}.`,
              habilidades: [
                {
                  id: `TOP_${Date.now().toString().slice(-4)}`,
                  codigo: 'T1',
                  nome: `1. Introdução a ${assunto}`,
                  foco: `Conceitos fundamentais de ${assunto}.`,
                  resumo: `### 1. Introdução a ${assunto}\n\nAdicione aqui seu resumo, links e videoaulas.`,
                  videos: [],
                  sites: introReading ? [introReading] : [],
                  questoesEnem: []
                }
              ]
            }
          ]
        };
        storageService.save();
        activeEditorModal = null;
        renderPlatform();
        toast(`Página de estudo "${assunto}" criada e pronta para uso!`);
      } else {
        const prevMod = cms.customModules[modId] || {};
        cms.customModules[modId] = { ...prevMod, assunto, icone, descricao, introReading, introVideo };
        storageService.save();
        activeEditorModal = null;
        renderPlatform();
        toast(`Assunto "${assunto}" atualizado!`);
      }
      return;
    }

    /* 4. Salvar Novo Bloco ou Editar Bloco */
    if (saveType === 'add-block' || saveType === 'edit-block') {
      const chosenModId = document.getElementById('cms-blk-mod')?.value || modId;
      if (!chosenModId) {
        toast('Selecione uma matéria/assunto de destino para o bloco.');
        return;
      }
      const titulo = document.getElementById('cms-blk-title')?.value?.trim();
      const descricao_curta = document.getElementById('cms-blk-desc')?.value?.trim() || '';
      const resumo = document.getElementById('cms-blk-resumo')?.value?.trim() || '';
      if (!titulo) {
        toast('Digite o título do bloco.');
        return;
      }
      const cfg = getBlockCmsConfig(chosenModId);
      if (saveType === 'add-block') {
        const newBlkId = `bloco_custom_${Date.now()}`;
        cfg.added.push({
          id: newBlkId,
          ordem: 99,
          titulo,
          descricao_curta,
          resumo: resumo || `### ${titulo}`,
          habilidades: [
            {
              id: `HAB_CUSTOM_${Date.now()}`,
              codigo: 'T1',
              nome: `1. Aula Inicial — ${titulo}`,
              foco: descricao_curta || `Estudo de ${titulo}`,
              resumo: resumo || `### ${titulo}\n\nResumo inicial.`
            }
          ]
        });
        storageService.save();
        activeEditorModal = null;
        renderPlatform();
        toast(`Novo bloco "${titulo}" adicionado com sucesso!`);
      } else {
        cfg.overrides[blkId] = { ...(cfg.overrides[blkId] || {}), titulo, descricao_curta, resumo };
        storageService.save();
        activeEditorModal = null;
        renderPlatform();
        toast(`Bloco "${titulo}" atualizado!`);
      }
      return;
    }

    /* 5. Salvar Novo Tópico / Aula ou Editar Tópico */
    if (saveType === 'add-topic' || saveType === 'edit-topic') {
      const titulo = document.getElementById('cms-topic-title')?.value?.trim();
      const foco = document.getElementById('cms-topic-foco')?.value?.trim() || '';
      const preRequisito = document.getElementById('cms-topic-prereq')?.value?.trim() || '';
      const resumo = document.getElementById('cms-topic-resumo')?.value || '';
      let imgUrl = document.getElementById('cms-topic-img-url')?.value?.trim() || '';
      const imgFile = document.getElementById('cms-topic-img-file')?.files?.[0];

      if (!titulo) {
        toast('Digite o nome do tópico/aula.');
        return;
      }
      if (imgFile) {
        imgUrl = await readFileAsDataUrl(imgFile);
      }

      if (saveType === 'add-topic') {
        const mod = getModuleById(modId);
        const cfg = getTopicCmsConfig(modId, blkId);
        const newHabId = `HAB_${Date.now()}`;
        cfg.added.push({
          id: newHabId,
          codigo: 'AULA',
          nome: titulo,
          foco,
          preRequisito,
          resumo: resumo || `### ${titulo}\n\n${foco}`
        });

        const newTKey = buildTopicKey(mod.materiaId, mod.assuntoId, blkId, newHabId);
        const vidUrl = document.getElementById('cms-topic-vid-url')?.value?.trim() || '';
        const vidDur = document.getElementById('cms-topic-vid-dur')?.value?.trim() || '';
        const initialVideos = vidUrl ? [{ titulo, url: vidUrl, duracao: vidDur || 'Videoaula', canal: 'YouTube', nota: foco }] : [];

        saveTopicCustomData(newTKey, {
          titulo,
          foco,
          preRequisito,
          resumo: resumo || `### ${titulo}\n\n${foco}`,
          resumoImage: imgUrl,
          videos: initialVideos
        });
        activeEditorModal = null;
        renderPlatform();
        toast('Novo tópico adicionado com sucesso!');
      } else {
        const eff = getEffectiveTopicData(topicKey);
        const finalImg = imgUrl || (eff?.resumoImage?.startsWith('data:') ? eff.resumoImage : '');
        saveTopicCustomData(topicKey, { titulo, foco, preRequisito, resumo, resumoImage: finalImg });
        activeEditorModal = null;
        renderPlatform();
        toast('Tópico atualizado!');
      }
      return;
    }

    /* 6. Salvar Videoaula (com Duração) */
    if (saveType === 'add-video' || saveType === 'edit-video') {
      const titulo = document.getElementById('cms-vid-title')?.value?.trim();
      const url = document.getElementById('cms-vid-url')?.value?.trim();
      const duracao = document.getElementById('cms-vid-dur')?.value?.trim() || '';
      const canal = document.getElementById('cms-vid-channel')?.value?.trim() || 'YouTube';
      const nota = document.getElementById('cms-vid-note')?.value?.trim() || '';
      if (!titulo || !url) {
        toast('Preencha o título e o link do YouTube.');
        return;
      }
      const eff = getEffectiveTopicData(topicKey);
      const newVideos = [...eff.videos];
      const vObj = { titulo, url, duracao, canal, nota };
      if (saveType === 'edit-video' && itemIdx >= 0 && itemIdx < newVideos.length) {
        newVideos[itemIdx] = vObj;
      } else {
        newVideos.push(vObj);
      }
      saveTopicCustomData(topicKey, { videos: newVideos });
      activeEditorModal = null;
      renderPlatform();
      toast('Videoaula salva!');
      return;
    }

    /* 7. Salvar Site / Leitura */
    if (saveType === 'add-site' || saveType === 'edit-site') {
      const titulo = document.getElementById('cms-site-title')?.value?.trim();
      const portal = document.getElementById('cms-site-portal')?.value?.trim() || 'Artigo';
      const url = document.getElementById('cms-site-url')?.value?.trim();
      const resumo = document.getElementById('cms-site-desc')?.value?.trim() || '';
      let thumbUrl = document.getElementById('cms-site-thumb-url')?.value?.trim() || '';
      const thumbFile = document.getElementById('cms-site-thumb-file')?.files?.[0];
      if (!titulo || !url) {
        toast('Preencha o título e a URL do site.');
        return;
      }
      if (thumbFile) {
        thumbUrl = await readFileAsDataUrl(thumbFile);
      }
      const eff = getEffectiveTopicData(topicKey);
      const newSites = [...eff.sites];
      const prevThumb = (saveType === 'edit-site' && newSites[itemIdx]?.thumbUrl?.startsWith('data:') && !thumbUrl)
        ? newSites[itemIdx].thumbUrl
        : thumbUrl;
      const sObj = { titulo, portal, url, resumo, thumbUrl: prevThumb };
      if (saveType === 'edit-site' && itemIdx >= 0 && itemIdx < newSites.length) {
        newSites[itemIdx] = sObj;
      } else {
        newSites.push(sObj);
      }
      saveTopicCustomData(topicKey, { sites: newSites });
      activeEditorModal = null;
      renderPlatform();
      toast('Link salvo!');
      return;
    }

    /* 8. Salvar Questão do ENEM */
    if (saveType === 'add-enem-q' || saveType === 'edit-enem-q') {
      const ano = document.getElementById('cms-q-ano')?.value?.trim() || 'ENEM Oficial';
      const contexto = document.getElementById('cms-q-ctx')?.value?.trim() || '';
      const enunciado = document.getElementById('cms-q-enunciado')?.value?.trim();
      let imagemUrl = document.getElementById('cms-q-img-url')?.value?.trim() || '';
      const imgFile = document.getElementById('cms-q-img-file')?.files?.[0];
      const correta = document.getElementById('cms-q-correta')?.value || 'A';
      const resolucao = document.getElementById('cms-q-resolucao')?.value?.trim() || '';

      const alternativas = {};
      ['A', 'B', 'C', 'D', 'E'].forEach(l => {
        alternativas[l] = document.getElementById(`cms-q-alt-${l}`)?.value?.trim() || `Alternativa ${l}`;
      });

      if (!enunciado) {
        toast('Digite o enunciado da questão.');
        return;
      }
      if (imgFile) {
        imagemUrl = await readFileAsDataUrl(imgFile);
      }

      const eff = getEffectiveTopicData(topicKey);
      const newQs = [...eff.questoesEnem];
      const prevId = (saveType === 'edit-enem-q' && newQs[itemIdx]) ? newQs[itemIdx].id : `ENEM_CUSTOM_${Date.now()}`;
      const prevImg = (saveType === 'edit-enem-q' && newQs[itemIdx]?.imagemUrl?.startsWith('data:') && !imagemUrl) ? newQs[itemIdx].imagemUrl : imagemUrl;

      const qObj = { id: prevId, ano, contexto, enunciado, imagemUrl: prevImg, alternativas, correta, resolucao };
      if (saveType === 'edit-enem-q' && itemIdx >= 0 && itemIdx < newQs.length) {
        newQs[itemIdx] = qObj;
      } else {
        newQs.push(qObj);
      }
      saveTopicCustomData(topicKey, { questoesEnem: newQs });
      activeEditorModal = null;
      renderPlatform();
      toast('Questão do ENEM salva!');
      return;
    }
  }
});

/* Eventos de Mudança (Selects e Radio Buttons) */
document.addEventListener('change', event => {
  const t = event.target;
  if (!t) return;

  if (t.name === 'ob-pace' || t.name === 'ob-edit-pace') {
    document.querySelectorAll('#ob-pace-selector .ob-pace-option').forEach(el => el.classList.remove('selected'));
    t.closest('.ob-pace-option')?.classList.add('selected');
    return;
  }

  if (t.dataset.listStatusId) {
    const st = storageService.getActiveState();
    const item = (st.studyList || []).find(i => i.id === t.dataset.listStatusId);
    if (item) {
      item.status = t.value;
      if (item.topicKey) {
        if (!st.topicProgress) st.topicProgress = {};
        if (!st.topicProgress[item.topicKey]) st.topicProgress[item.topicKey] = { summaryRead: true, enemAnswers: {} };
        st.topicProgress[item.topicKey].status = t.value;
      }
      storageService.save();
      renderPlatform();
      toast(`Status atualizado para "${item.status}".`);
    }
    return;
  }

  if (t.dataset.listPrioId) {
    const st = storageService.getActiveState();
    const item = (st.studyList || []).find(i => i.id === t.dataset.listPrioId);
    if (item) {
      item.priority = t.value;
      storageService.save();
      renderPlatform();
      toast(`Prioridade alterada para "${item.priority}".`);
    }
    return;
  }

  /* Ações de Mudança no Caderno de Anotações (Notion) */
  if (t.dataset.noteTodoId) {
    const blockId = t.dataset.noteTodoId;
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
    if (activeNote && Array.isArray(activeNote.blocks)) {
      const blk = activeNote.blocks.find(b => b.id === blockId);
      if (blk) {
        blk.checked = t.checked;
        activeNote.updatedAt = Date.now();
        storageService.save();
        const row = t.closest('.notion-todo-row');
        const textarea = row ? row.querySelector('textarea') : null;
        if (textarea) {
          if (blk.checked) textarea.classList.add('is-checked');
          else textarea.classList.remove('is-checked');
        }
      }
    }
    return;
  }

  if (t.dataset.noteMateria) {
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
    if (activeNote) {
      activeNote.materiaId = t.value;
      const subjects = getEffectiveSubjects();
      const sub = subjects.find(s => s.id === t.value);
      activeNote.materia = sub ? sub.nome : (t.value === 'geral' ? 'Geral' : t.value);
      activeNote.topicKey = '';
      activeNote.updatedAt = Date.now();
      storageService.save();
      renderPlatform();
    }
    return;
  }

  if (t.dataset.noteTopic) {
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
    if (activeNote) {
      activeNote.topicKey = t.value;
      activeNote.updatedAt = Date.now();
      storageService.save();
      renderPlatform();
    }
    return;
  }

  if (t.dataset.addImageBlock && t.files && t.files[0]) {
    const file = t.files[0];
    compressAndReadImageFile(file, (dataUrl) => {
      const st = storageService.getActiveState();
      const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
      if (activeNote) {
        if (!Array.isArray(activeNote.blocks)) activeNote.blocks = [];
        activeNote.blocks.push({
          id: 'blk_img_' + Date.now(),
          type: 'image',
          src: dataUrl,
          caption: file.name ? file.name.replace(/\.[^/.]+$/, "") : 'Imagem de Estudo'
        });
        activeNote.updatedAt = Date.now();
        storageService.save();
        renderPlatform();
        toast('Imagem anexada com sucesso!');
      }
    });
    return;
  }

  if (t.dataset.noteImageUpload && t.files && t.files[0]) {
    const blockId = t.dataset.noteImageUpload;
    const file = t.files[0];
    compressAndReadImageFile(file, (dataUrl) => {
      const st = storageService.getActiveState();
      const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
      if (activeNote && Array.isArray(activeNote.blocks)) {
        const blk = activeNote.blocks.find(b => b.id === blockId);
        if (blk) {
          blk.src = dataUrl;
          if (!blk.caption) blk.caption = file.name ? file.name.replace(/\.[^/.]+$/, "") : 'Imagem anexada';
          activeNote.updatedAt = Date.now();
          storageService.save();
          renderPlatform();
          toast('Imagem atualizada!');
        }
      }
    });
    return;
  }
});

/* Busca em Tempo Real e Auto-salvamento de Anotações */
document.addEventListener('input', event => {
  const t = event.target;
  if (!t) return;

  if (t.id === 'lib-search-input') {
    const st = storageService.getActiveState();
    st.librarySearch = t.value;
    const pos = t.selectionStart;
    storageService.save();
    renderPlatform();
    const newInput = document.getElementById('lib-search-input');
    if (newInput) {
      newInput.focus();
      try { newInput.setSelectionRange(pos, pos); } catch (e) {}
    }
    return;
  }

  if (t.id === 'notion-page-title') {
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
    if (activeNote) {
      activeNote.title = t.value;
      activeNote.updatedAt = Date.now();
      storageService.save();
      const sidebarItem = document.querySelector(`.notion-sidebar-item[data-select-note="${activeNote.id}"] .notion-sidebar-title`);
      if (sidebarItem) {
        sidebarItem.textContent = t.value || 'Sem título';
      }
    }
    return;
  }

  if (t.id === 'notion-search-input') {
    const st = storageService.getActiveState();
    st.noteSearch = t.value;
    storageService.save();
    const q = t.value.toLowerCase().trim();
    document.querySelectorAll('.notion-sidebar-item').forEach(item => {
      const noteId = item.dataset.selectNote;
      const note = (st.notes || []).find(n => n.id === noteId);
      if (!note) return;
      const match = !q || (note.title || '').toLowerCase().includes(q) || (note.materia || '').toLowerCase().includes(q);
      item.style.display = match ? 'flex' : 'none';
    });
    return;
  }

  if (t.dataset.noteBlockId) {
    const blockId = t.dataset.noteBlockId;
    const field = t.dataset.field || 'content';
    const st = storageService.getActiveState();
    const activeNote = (st.notes || []).find(n => n.id === st.activeNoteId);
    if (activeNote && Array.isArray(activeNote.blocks)) {
      const blk = activeNote.blocks.find(b => b.id === blockId);
      if (blk) {
        blk[field] = t.value;
        activeNote.updatedAt = Date.now();
        storageService.save();
      }
    }
    if (t.tagName === 'TEXTAREA') {
      t.style.height = 'auto';
      t.style.height = t.scrollHeight + 'px';
    }
    return;
  }
});

/* Persistência do Estado Aberto/Fechado dos Acordeões (<details data-acc-id>) */
document.addEventListener('toggle', event => {
  const det = event.target;
  if (det && det.tagName === 'DETAILS' && det.dataset.accId) {
    const st = storageService.getActiveState();
    if (!st.openAccordions) st.openAccordions = {};
    st.openAccordions[det.dataset.accId] = det.open;
    storageService.save();
  }
}, true);

/* Atalho de Teclado no Chat da IA: Enter para enviar */
document.addEventListener('keydown', event => {
  if (event.target && event.target.id === 'ai-chat-input' && event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    const txt = event.target.value?.trim();
    if (txt && !storageService.aiLoading) {
      event.target.value = '';
      sendAiUserMessage(txt);
    }
  }
});

/* Inicializa a Plataforma */
renderPlatform();

})();

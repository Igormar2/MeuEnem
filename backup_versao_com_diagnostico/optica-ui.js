/* optica-ui.js — Plataforma Inteligente de Estudos para o ENEM (v4)
   Arquitetura Completa:
   1. Menu Superior Fixo com as 5 Áreas:
      - 🏠 Início (Boas-vindas, "Continuar de onde parei", Atalhos por Matéria)
      - 📚 Biblioteca de Estudos (Catálogo livre Matéria → Assunto → Bloco → Habilidade/Tópico com 3 abas: Resumo e Sites, Videoaulas, Prática e Confirmação ENEM)
      - 🎯 Diagnósticos (Avaliação por blocos em todos os 6 módulos: Óptica, Cinética/Mecânica, Matemática Financeira, Probabilidade, Ligações Químicas, Estequiometria)
      - 📌 Minha Lista (Plano de estudos vivo integrado entre Diagnósticos e Biblioteca)
      - 📈 Progressão (3 camadas separadas: Progresso de Estudo, Desempenho Observado com amostra e Nível de Domínio por Habilidade)
   2. Área de Perfil Local (2+ Usuários) + ✏️ Modo Edição Visual In-App + 💾 Backup JSON
   3. Isolamento Estrito por Chave Única de Tópico ([materiaId]_[assuntoId]_[blocoId]_[habilidadeId], ex: fisica_optica_bloco4_D1)
*/
(() => {
const STORAGE_KEY_V4 = 'meu-enem-v4-platform';
const STORAGE_KEY_V3 = 'meu-enem-v3-storage';
const LEGACY_KEY = 'meu-enem-prototype-v2';

const esc = s => typeof escapeHtml === 'function'
  ? escapeHtml(s ?? '')
  : String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ══════════════════════════════════════════════════════════════════════════
   1. CATÁLOGO UNIFICADO MULTI-MATÉRIAS E CHAVE ÚNICA DE TÓPICO (topicKey)
   ══════════════════════════════════════════════════════════════════════════ */
function normalizeBlockSlug(blocoId) {
  return String(blocoId || 'bloco1').replace(/_/g, ''); // 'bloco_4' -> 'bloco4'
}

/**
 * Gera a chave única exclusiva por Habilidade/Tópico:
 * [materiaId]_[assuntoId]_[blocoId]_[habilidadeId]
 * Exemplo: 'fisica_optica_bloco4_D1'
 */
function buildTopicKey(materiaId, assuntoId, blocoId, habilidadeId) {
  return `${materiaId}_${assuntoId}_${normalizeBlockSlug(blocoId)}_${habilidadeId}`;
}

function buildAltTopicKey(materiaId, assuntoId, blocoId, habilidadeId) {
  return `${materiaId}_${assuntoId}_${blocoId}_${habilidadeId}`;
}

function getAllModules() {
  const optData = window.DiagnosticoOpticaData || {
    materia: 'Física',
    assunto: 'Óptica',
    descricao: 'Diagnóstico e estudo estruturado em Óptica Geométrica e Física.',
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
    blocos: optData.blocos || []
  };
  const extraModules = Array.isArray(window.EnemCatalogModules) ? window.EnemCatalogModules : [];
  return [opticaModule, ...extraModules];
}

function getModuleById(moduleId) {
  return getAllModules().find(m => m.id === moduleId) || getAllModules()[0];
}

function getBlockFromModule(mod, blockId) {
  if (!mod || !Array.isArray(mod.blocos)) return null;
  return mod.blocos.find(b => b.id === blockId || normalizeBlockSlug(b.id) === normalizeBlockSlug(blockId)) || null;
}

/**
 * Busca um tópico/habilidade em qualquer módulo a partir do seu topicKey
 * (aceita tanto 'fisica_optica_bloco4_D1' quanto 'fisica_optica_bloco_4_D1')
 */
function resolveTopicByKey(topicKey) {
  if (!topicKey) return null;
  const cleanTarget = String(topicKey).replace(/_bloco_(\d+)_/, '_bloco$1_');
  for (const mod of getAllModules()) {
    for (const blk of (mod.blocos || [])) {
      for (const hab of (blk.habilidades || [])) {
        const canonical = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        if (canonical === cleanTarget) {
          return {
            topicKey: canonical,
            altKey: buildAltTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id),
            mod,
            blk,
            hab
          };
        }
      }
    }
  }
  return null;
}

/**
 * Retorna os recursos base (foco, videos, sites, questoesEnem) definidos no código para um topicKey
 */
function getBaseTopicResources(topicKey) {
  const resolved = resolveTopicByKey(topicKey);
  if (!resolved) return { foco: '', videos: [], sites: [], questoesEnem: [] };
  const { topicKey: canonical, altKey, hab, blk } = resolved;
  const optMap = window.OpticaTopicResources || {};
  const catMap = window.CatalogTopicResources || {};
  const raw = optMap[canonical] || optMap[altKey] || catMap[canonical] || catMap[altKey] || {};
  return {
    foco: raw.foco || hab.foco || blk.descricao || '',
    videos: Array.isArray(raw.videos) ? raw.videos.filter(v => v && v.url && !String(v.url).includes('youtube.com/results')) : [],
    sites: Array.isArray(raw.sites) ? raw.sites : [],
    questoesEnem: Array.isArray(raw.questoesEnem) ? raw.questoesEnem : []
  };
}

/**
 * Combina os dados base do tópico com as customizações salvas no Modo Edição (isoladas por topicKey!)
 */
function getEffectiveTopicData(topicKey) {
  const resolved = resolveTopicByKey(topicKey);
  if (!resolved) return null;
  const { mod, blk, hab } = resolved;
  const canonical = resolved.topicKey;
  const baseRes = getBaseTopicResources(canonical);
  const custom = storageService.getTopicCustomContent(canonical);

  const titulo = custom.customTitle || hab.nome;
  const foco = custom.customFoco !== undefined && custom.customFoco !== null ? custom.customFoco : baseRes.foco;
  const resumo = custom.customResumo !== undefined && custom.customResumo !== null ? custom.customResumo : (blk.resumo || '');
  const resumoImage = custom.resumoImage || '';

  // Vídeos estritamente isolados por topicKey (filtra qualquer link falso de busca)
  const rawVideos = Array.isArray(custom.videos) ? custom.videos : baseRes.videos;
  const videos = rawVideos.filter(v => v && v.url && !String(v.url).includes('youtube.com/results'));

  // Sites brasileiros estritamente isolados por topicKey
  const sites = Array.isArray(custom.sites) ? custom.sites : baseRes.sites;

  // Questões ENEM (5 alternativas A-E) estritamente isoladas por topicKey
  const questoesEnem = Array.isArray(custom.questoesEnem) ? custom.questoesEnem : baseRes.questoesEnem;

  return {
    topicKey: canonical,
    mod,
    blk,
    hab,
    titulo,
    foco,
    resumo,
    resumoImage,
    videos,
    sites,
    questoesEnem
  };
}

/**
 * Retorna as questões de diagnóstico de um bloco, aplicando eventuais edições do Modo Editor
 */
function getEffectiveBlockDiagnosticQuestions(moduleId, blockId) {
  const mod = getModuleById(moduleId);
  const blk = getBlockFromModule(mod, blockId);
  if (!blk) return [];
  const blockCustomKey = `${mod.materiaId}_${mod.assuntoId}_${normalizeBlockSlug(blk.id)}`;
  const customBlock = storageService.getBlockCustomContent(blockCustomKey);
  if (Array.isArray(customBlock.diagnosticQuestions)) {
    return customBlock.diagnosticQuestions;
  }
  return blk.questoes || [];
}

function getEffectiveBlockSummary(moduleId, blockId) {
  const mod = getModuleById(moduleId);
  const blk = getBlockFromModule(mod, blockId);
  if (!blk) return { titulo: '', descricao: '', resumo: '', resumoImage: '' };
  const blockCustomKey = `${mod.materiaId}_${mod.assuntoId}_${normalizeBlockSlug(blk.id)}`;
  const customBlock = storageService.getBlockCustomContent(blockCustomKey);
  return {
    titulo: customBlock.customTitle || blk.titulo,
    descricao: customBlock.customDesc || blk.descricao,
    resumo: customBlock.customResumo !== undefined && customBlock.customResumo !== null ? customBlock.customResumo : (blk.resumo || ''),
    resumoImage: customBlock.resumoImage || ''
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   2. FORMATADOR DE MARKDOWN, FÓRMULAS MATEMÁTICAS E EMBED DO YOUTUBE
   ══════════════════════════════════════════════════════════════════════════ */
function formatMathExpr(expr) {
  let s = esc(expr.trim());
  s = s.replace(/\\text\{([^}]+)\}/g, '<span class="math-text">$1</span>');
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-frac"><span class="math-num">$1</span><span class="math-den">$2</span></span>');
  s = s.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
  s = s.replace(/\^([a-zA-Z0-9+-]+)/g, '<sup>$1</sup>');
  s = s.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
  s = s.replace(/_([a-zA-Z0-9]+)/g, '<sub>$1</sub>');
  s = s.replace(/\\lambda/g, 'λ')
       .replace(/\\cdot/g, '·')
       .replace(/\\times/g, '×')
       .replace(/\\Delta/g, 'Δ')
       .replace(/\\theta/g, 'θ')
       .replace(/\\cup/g, '∪')
       .replace(/\\cap/g, '∩')
       .replace(/\\Omega/g, 'Ω')
       .replace(/\\rightarrow/g, '→')
       .replace(/\\ge/g, '≥')
       .replace(/\\le/g, '≤')
       .replace(/\\ne/g, '≠');
  return `<span class="math-inline">${s}</span>`;
}

function formatInlineMarkdown(text) {
  const mathTokens = [];
  let processed = String(text ?? '').replace(/\$([^$]+)\$/g, (_, math) => {
    const idx = mathTokens.length;
    mathTokens.push(formatMathExpr(math));
    return `@@MATH_${idx}@@`;
  });
  processed = esc(processed);
  processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  processed = processed.replace(/@@MATH_(\d+)@@/g, (_, idx) => mathTokens[Number(idx)] || '');
  return processed;
}

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

function extractYouTubeEmbedUrl(url) {
  const id = extractYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/* ══════════════════════════════════════════════════════════════════════════
   3. PERSISTÊNCIA CONFIÁVEL (storageService) + MIGRAÇÃO E ISOLAMENTO DE VÍDEOS
   ══════════════════════════════════════════════════════════════════════════ */
function createEmptyModuleDiagState(mod) {
  const blocksObj = {};
  (mod.blocos || []).forEach(b => {
    blocksObj[b.id] = {
      activityStatus: 'not_started', // 'not_started' | 'in_progress' | 'completed' | 'not_assessed'
      currentQuestionIndex: 0,
      viewedSummary: false,
      skipped: false,
      answers: {}, // { [q.id]: { selected: 'A'|'B'|'C'|null, confidence: 'sure'|'unsure'|null, updatedAt } }
      evaluation: null
    };
  });
  return { blocks: blocksObj };
}

function createEmptyProfileState() {
  const moduleStates = {};
  getAllModules().forEach(mod => {
    moduleStates[mod.id] = createEmptyModuleDiagState(mod);
  });

  return {
    mainArea: 'home', // 'home' | 'library' | 'diagnostics' | 'my-list' | 'progression'
    subView: 'main',  // 'main' | 'topic-study' | 'diag-pre' | 'diag-summary' | 'diag-question' | 'diag-closing'
    activeModuleId: 'fisica_optica',
    activeBlockId: 'bloco_1',
    activeTopicKey: 'fisica_optica_bloco1_A1',
    activeTopicTab: 'resumo', // 'resumo' | 'videos' | 'pratica'
    libraryFilterMateria: 'all',
    libraryFilterModule: 'all',
    librarySearch: '',
    listFilterMateria: 'all',
    listFilterStatus: 'all',
    progressionFilterMateria: 'all',
    diagModal: null, // null | 'confirm-finish' | 'confirm-skip'
    lastActivity: null, // { type: 'topic'|'diag', label, topicKey, moduleId, blockId, updatedAt }
    moduleStates,
    topicProgress: {}, // { [topicKey]: { readSummary: bool, watchedVideo: bool, confirmedMastery: bool, enemAnswers: { [qId]: { selected, checked, isCorrect } }, updatedAt } }
    studyList: []
  };
}

const storageService = {
  data: null,
  editMode: false,

  init() {
    let loadedV4 = null;
    try {
      const rawV4 = localStorage.getItem(STORAGE_KEY_V4);
      if (rawV4) loadedV4 = JSON.parse(rawV4);
    } catch (e) {
      console.warn('Erro ao ler storage v4:', e);
    }

    if (loadedV4 && typeof loadedV4 === 'object' && Array.isArray(loadedV4.profiles)) {
      this.data = loadedV4;
      if (!this.data.customContent) this.data.customContent = { topics: {}, blocks: {} };
    } else {
      this.data = {
        version: 4,
        activeProfileId: null,
        profiles: [],
        profileStates: {},
        customContent: {
          topics: {}, // { [topicKey]: { customTitle, customFoco, customResumo, resumoImage, videos, sites, questoesEnem } }
          blocks: {}  // { [blockKey]: { customTitle, customDesc, customResumo, resumoImage, diagnosticQuestions } }
        }
      };
      this.migrateFromV3IfPresent();
    }

    for (const prof of this.data.profiles) {
      this.ensureProfileState(prof.id);
    }
    this.persist();
  },

  /**
   * Migra perfis, respostas de Óptica, Lista de Estudos e preserva vídeos de Lentes Esféricas
   * cadastrados manualmente pelo usuário no v3, isolando-os exclusivamente em Bloco 4 (D1..D4)
   */
  migrateFromV3IfPresent() {
    try {
      const rawV3 = localStorage.getItem(STORAGE_KEY_V3);
      if (!rawV3) return;
      const v3 = JSON.parse(rawV3);
      if (!v3 || !Array.isArray(v3.profiles)) return;

      this.data.profiles = v3.profiles;
      this.data.activeProfileId = v3.activeProfileId || (v3.profiles[0] && v3.profiles[0].id) || null;

      for (const prof of v3.profiles) {
        const oldSt = v3.profileStates?.[prof.id];
        const newSt = createEmptyProfileState();

        if (oldSt && oldSt.optics) {
          // 1. Migra respostas e avaliações dos 6 blocos de Óptica
          if (oldSt.optics.blocks) {
            Object.keys(oldSt.optics.blocks).forEach(bId => {
              if (newSt.moduleStates['fisica_optica'].blocks[bId]) {
                newSt.moduleStates['fisica_optica'].blocks[bId] = oldSt.optics.blocks[bId];
              }
            });
          }

          // 2. Migra itens da Lista de Estudos
          if (Array.isArray(oldSt.optics.studyList)) {
            oldSt.optics.studyList.forEach(oldItem => {
              const blkId = oldItem.blockId || 'bloco_1';
              const optMod = getModuleById('fisica_optica');
              const blk = getBlockFromModule(optMod, blkId);
              const skId = oldItem.skillId || (blk && blk.habilidades?.[0]?.id) || 'A1';
              const tKey = buildTopicKey('fisica', 'optica', blkId, skId);

              newSt.studyList.push({
                id: oldItem.id || ('st_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)),
                topicKey: tKey,
                moduleId: 'fisica_optica',
                materiaId: 'fisica',
                materia: 'Física',
                assunto: 'Óptica',
                blockId: blkId,
                skillId: skId,
                title: oldItem.title || `${skId} — Tópico de Óptica`,
                subtitle: oldItem.subtitle || `Física · Óptica`,
                origin: oldItem.origin || 'Adicionado manualmente',
                status: oldItem.status || 'A estudar',
                priority: oldItem.priority || 'Média',
                addedAt: oldItem.addedAt || new Date().toISOString(),
                updatedAt: oldItem.updatedAt || new Date().toISOString()
              });
            });
          }

          // 3. Migra e isola vídeos customizados salvos anteriormente pelo usuário!
          if (oldSt.optics.customResources && typeof oldSt.optics.customResources === 'object') {
            Object.entries(oldSt.optics.customResources).forEach(([bId, resObj]) => {
              const vids = Array.isArray(resObj?.videos) ? resObj.videos : [];
              vids.forEach(v => {
                if (!v || !v.url || String(v.url).includes('youtube.com/results')) return;
                const text = `${v.titulo || ''} ${v.canal || ''} ${v.objetivo || ''} ${v.nota || ''}`.toLowerCase();
                let targetTopicKey = null;

                // Se for sobre Lentes Esféricas, Gauss, Halley, convergentes/divergentes ou veio do bloco_4:
                if (
                  bId === 'bloco_4' ||
                  text.includes('lente') ||
                  text.includes('halley') ||
                  text.includes('fabricante') ||
                  text.includes('convergente') ||
                  text.includes('divergente') ||
                  text.includes('vergência') ||
                  text.includes('dioptria') ||
                  text.includes('gauss')
                ) {
                  if (text.includes('halley') || text.includes('fabricante') || text.includes('gauss') || text.includes('vergência') || text.includes('dioptria') || text.includes('equação')) {
                    targetTopicKey = 'fisica_optica_bloco4_D4';
                  } else if (text.includes('formação de imagem') || text.includes('imagens') || text.includes('lupa') || text.includes('projetor')) {
                    targetTopicKey = 'fisica_optica_bloco4_D3';
                  } else if (text.includes('raios notáveis') || text.includes('centro óptico')) {
                    targetTopicKey = 'fisica_optica_bloco4_D2';
                  } else {
                    targetTopicKey = 'fisica_optica_bloco4_D1';
                  }
                } else {
                  // Associa à primeira habilidade do respectivo bloco
                  const optMod = getModuleById('fisica_optica');
                  const blk = getBlockFromModule(optMod, bId);
                  const firstHab = blk?.habilidades?.[0]?.id || 'A1';
                  targetTopicKey = buildTopicKey('fisica', 'optica', bId, firstHab);
                }

                if (targetTopicKey) {
                  const curTopicCustom = this.getTopicCustomContent(targetTopicKey);
                  const baseVids = getBaseTopicResources(targetTopicKey).videos;
                  const existingList = Array.isArray(curTopicCustom.videos) ? curTopicCustom.videos : [...baseVids];
                  if (!existingList.some(x => x.url === v.url)) {
                    existingList.push({
                      id: v.id || ('vid_mig_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5)),
                      titulo: v.titulo || 'Videoaula cadastrada',
                      canal: v.canal || 'YouTube',
                      url: v.url,
                      nota: v.nota || v.objetivo || ''
                    });
                    curTopicCustom.videos = existingList;
                    this.saveTopicCustomContent(targetTopicKey, curTopicCustom);
                  }
                }
              });
            });
          }
        }
        this.data.profileStates[prof.id] = newSt;
      }
    } catch (e) {
      console.warn('Aviso ao migrar dados v3:', e);
    }
  },

  persist() {
    try {
      localStorage.setItem(STORAGE_KEY_V4, JSON.stringify(this.data));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
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
    if (!st.moduleStates) st.moduleStates = {};
    getAllModules().forEach(mod => {
      if (!st.moduleStates[mod.id] || !st.moduleStates[mod.id].blocks) {
        st.moduleStates[mod.id] = createEmptyModuleDiagState(mod);
      } else {
        (mod.blocos || []).forEach(b => {
          if (!st.moduleStates[mod.id].blocks[b.id]) {
            st.moduleStates[mod.id].blocks[b.id] = {
              activityStatus: 'not_started',
              currentQuestionIndex: 0,
              viewedSummary: false,
              skipped: false,
              answers: {},
              evaluation: null
            };
          }
        });
      }
    });
    if (!st.topicProgress) st.topicProgress = {};
    if (!Array.isArray(st.studyList)) st.studyList = [];
    if (!st.mainArea) st.mainArea = 'home';
    if (!st.subView) st.subView = 'main';
    return st;
  },

  getProfiles() {
    return this.data.profiles || [];
  },

  getActiveProfile() {
    if (!this.data.activeProfileId) return null;
    return this.data.profiles.find(p => p.id === this.data.activeProfileId) || null;
  },

  getActiveState() {
    const prof = this.getActiveProfile();
    if (!prof) return this.ensureProfileState(null);
    return this.ensureProfileState(prof.id);
  },

  createProfile({ name, goal, pace }) {
    const cleanName = String(name || '').trim() || 'Estudante';
    const id = 'prof_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
    const profile = {
      id,
      name: cleanName,
      goal: String(goal || '').trim(),
      pace: ['curto', 'medio', 'livre'].includes(pace) ? pace : 'medio',
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
    this.persist();
    return profile;
  },

  updateActiveProfile({ name, goal, pace }) {
    const prof = this.getActiveProfile();
    if (!prof) return null;
    if (name !== undefined && String(name).trim()) prof.name = String(name).trim();
    if (goal !== undefined) prof.goal = String(goal).trim();
    if (pace && ['curto', 'medio', 'livre'].includes(pace)) prof.pace = pace;
    this.persist();
    return prof;
  },

  switchProfile(profileId) {
    const target = this.data.profiles.find(p => p.id === profileId);
    if (!target) return false;
    this.data.activeProfileId = target.id;
    this.ensureProfileState(target.id);
    this.persist();
    return true;
  },

  deleteProfile(profileId) {
    if (this.data.profiles.length <= 1) return false;
    this.data.profiles = this.data.profiles.filter(p => p.id !== profileId);
    delete this.data.profileStates[profileId];
    if (this.data.activeProfileId === profileId) {
      this.data.activeProfileId = this.data.profiles[0]?.id || null;
    }
    this.persist();
    return true;
  },

  /* Custom Content isolado por topicKey (Modo Edição In-App) */
  getTopicCustomContent(topicKey) {
    const resolved = resolveTopicByKey(topicKey);
    const canonical = resolved ? resolved.topicKey : String(topicKey);
    if (!this.data.customContent) this.data.customContent = { topics: {}, blocks: {} };
    if (!this.data.customContent.topics) this.data.customContent.topics = {};
    return this.data.customContent.topics[canonical] || {};
  },

  saveTopicCustomContent(topicKey, newCustomObj) {
    const resolved = resolveTopicByKey(topicKey);
    const canonical = resolved ? resolved.topicKey : String(topicKey);
    if (!this.data.customContent) this.data.customContent = { topics: {}, blocks: {} };
    if (!this.data.customContent.topics) this.data.customContent.topics = {};
    this.data.customContent.topics[canonical] = {
      ...this.getTopicCustomContent(canonical),
      ...newCustomObj,
      updatedAt: new Date().toISOString()
    };
    this.persist();
  },

  getBlockCustomContent(blockCustomKey) {
    if (!this.data.customContent) this.data.customContent = { topics: {}, blocks: {} };
    if (!this.data.customContent.blocks) this.data.customContent.blocks = {};
    return this.data.customContent.blocks[blockCustomKey] || {};
  },

  saveBlockCustomContent(blockCustomKey, newBlockObj) {
    if (!this.data.customContent) this.data.customContent = { topics: {}, blocks: {} };
    if (!this.data.customContent.blocks) this.data.customContent.blocks = {};
    this.data.customContent.blocks[blockCustomKey] = {
      ...this.getBlockCustomContent(blockCustomKey),
      ...newBlockObj,
      updatedAt: new Date().toISOString()
    };
    this.persist();
  },

  exportBackupJSON() {
    const active = this.getActiveProfile();
    const payload = {
      app: 'meu-enem-platform-v4',
      exportedAt: new Date().toISOString(),
      activeProfileName: active ? active.name : null,
      storage: this.data
    };
    return JSON.stringify(payload, null, 2);
  },

  importBackupJSON(jsonString) {
    const parsed = JSON.parse(jsonString);
    const incoming = parsed.storage || parsed;
    if (!incoming || !Array.isArray(incoming.profiles)) {
      throw new Error('Formato de arquivo JSON inválido para backup do Meu ENEM.');
    }
    this.data = incoming;
    if (!this.data.customContent) this.data.customContent = { topics: {}, blocks: {} };
    if (!this.data.activeProfileId && this.data.profiles.length > 0) {
      this.data.activeProfileId = this.data.profiles[0].id;
    }
    for (const p of this.data.profiles) {
      this.ensureProfileState(p.id);
    }
    this.persist();
    return true;
  }
};

window.storageService = storageService;

/* ══════════════════════════════════════════════════════════════════════════
   4. MOTOR DETERMINÍSTICO DE AVALIAÇÃO (3 CAMADAS SEPARADAS) E PROGRESSÃO
   ══════════════════════════════════════════════════════════════════════════ */
function evaluateBlock(moduleId, blockDef, bState) {
  const questions = getEffectiveBlockDiagnosticQuestions(moduleId, blockDef.id);
  const totalQuestions = questions.length;
  const answersMap = bState.answers || {};

  const answeredQuestions = questions.filter(q => {
    const a = answersMap[q.id];
    return a && ['A', 'B', 'C', 'D', 'E'].includes(a.selected);
  });

  const answeredCount = answeredQuestions.length;
  const blankCount = totalQuestions - answeredCount;
  const correctCount = answeredQuestions.filter(q => answersMap[q.id].selected === q.correta).length;
  const accuracyRate = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : null;

  const activityStatus = (bState.skipped || answeredCount === 0) ? 'not_assessed' : 'completed';

  const skillsResult = {};
  (blockDef.habilidades || []).forEach(hab => {
    const habQuestions = questions.filter(q => q.habilidadeId === hab.id);
    const total = habQuestions.length;
    const habAnswered = habQuestions.filter(q => {
      const a = answersMap[q.id];
      return a && ['A', 'B', 'C', 'D', 'E'].includes(a.selected);
    });
    const answered = habAnswered.length;
    const blank = total - answered;
    const correct = habAnswered.filter(q => answersMap[q.id].selected === q.correta).length;
    const doubtCount = habAnswered.filter(q => answersMap[q.id].confidence === 'unsure').length;
    const sureCount = habAnswered.filter(q => answersMap[q.id].confidence === 'sure').length;

    let status = 'not_assessed';
    let label = 'Não avaliada';
    let reason = '';
    let nextStep = '';
    let prioritySuggestion = null;

    if (answered === 0) {
      status = 'not_assessed';
      label = 'Não avaliada';
      reason = `Nenhuma questão desta habilidade foi respondida (${total} em branco). Questões em branco nunca contam como erro.`;
      nextStep = 'Você pode fazer o diagnóstico quando quiser ou abrir este tópico direto na Biblioteca de Estudos.';
    } else if (answered === 1 && total > 1 && (correct === 0 || doubtCount > 0)) {
      status = 'inconclusive';
      label = 'Inconclusiva';
      prioritySuggestion = 'Média';
      reason = `Apenas 1 de ${total} questões foi respondida (${correct === 0 ? 'com erro' : 'marcada com dúvida'}) e ${blank} ficou em branco.`;
      nextStep = 'Amostra pequena: recomendamos ler o Resumo na Biblioteca e resolver as Questões ENEM de confirmação.';
    } else if (correct === answered && doubtCount === 0) {
      status = 'mastered';
      label = 'Dominada';
      reason = `100% de acerto nas questões respondidas (${correct} de ${answered}) com segurança.`;
      nextStep = 'Habilidade consolidada! Se quiser, passe direto para os próximos tópicos ou resolva 1 questão oficial do ENEM para manter o ritmo.';
    } else if ((correct / answered) >= 0.5 || (correct === answered && doubtCount > 0)) {
      status = 'partial';
      label = 'Em evolução';
      prioritySuggestion = 'Média';
      if (correct === answered && doubtCount > 0) {
        reason = `Acertou 100% das respondidas (${correct} de ${answered}), mas sinalizou "Estou em dúvida" em ${doubtCount}.`;
        nextStep = 'Você já acerta as questões, mas vale revisar o Resumo e resolver as Questões ENEM para ganhar total confiança.';
      } else {
        reason = `Acertou ${correct} de ${answered} questões respondidas (${Math.round((correct / answered) * 100)}%).`;
        nextStep = 'Boa base! Revise os pontos-chave na Biblioteca e confirme seu aprendizado nas Questões Oficiais do ENEM.';
      }
    } else {
      status = 'study';
      label = 'Precisa estudar';
      prioritySuggestion = 'Alta';
      reason = `Acertou ${correct} de ${answered} questões respondidas.`;
      nextStep = 'Prioridade recomendada: abra este tópico na Biblioteca de Estudos, leia o resumo e os sites brasileiros e pratique as questões comentadas do ENEM.';
    }

    skillsResult[hab.id] = {
      id: hab.id,
      nome: hab.nome,
      status,
      label,
      total,
      answered,
      blank,
      correct,
      doubtCount,
      sureCount,
      reason,
      nextStep,
      prioritySuggestion
    };
  });

  let blockDomainStatus = 'not_assessed';
  let blockDomainLabel = 'Não avaliado';
  const evalSkills = Object.values(skillsResult).filter(s => s.status !== 'not_assessed');

  if (activityStatus === 'not_assessed' || evalSkills.length === 0) {
    blockDomainStatus = 'not_assessed';
    blockDomainLabel = 'Não avaliado';
  } else if (evalSkills.every(s => s.status === 'mastered')) {
    blockDomainStatus = 'mastered';
    blockDomainLabel = 'Dominado';
  } else if (evalSkills.every(s => s.status === 'inconclusive')) {
    blockDomainStatus = 'inconclusive';
    blockDomainLabel = 'Inconclusivo';
  } else if (evalSkills.some(s => s.status === 'study')) {
    const studyCount = evalSkills.filter(s => s.status === 'study').length;
    if (studyCount > evalSkills.length / 2) {
      blockDomainStatus = 'study';
      blockDomainLabel = 'Precisa estudar';
    } else {
      blockDomainStatus = 'partial';
      blockDomainLabel = 'Em evolução / Parcial';
    }
  } else {
    blockDomainStatus = 'partial';
    blockDomainLabel = 'Em evolução / Parcial';
  }

  return {
    activityStatus,
    totalQuestions,
    answeredCount,
    blankCount,
    correctCount,
    accuracyRate,
    blockDomainStatus,
    blockDomainLabel,
    skills: skillsResult,
    evaluatedAt: new Date().toISOString()
  };
}

function getBlockLiveActivityStatus(moduleId, blockDef, bState) {
  const questions = getEffectiveBlockDiagnosticQuestions(moduleId, blockDef.id);
  const total = questions.length;
  if (!bState) return { code: 'not_started', label: 'Não iniciado', answered: 0, total };
  const answered = questions.filter(q => {
    const a = bState.answers?.[q.id];
    return a && ['A', 'B', 'C', 'D', 'E'].includes(a.selected);
  }).length;

  if (bState.activityStatus === 'completed') {
    return { code: 'completed', label: 'Concluído', answered, total };
  }
  if (bState.activityStatus === 'not_assessed') {
    return { code: 'not_assessed', label: 'Não avaliado', answered, total };
  }
  if (bState.activityStatus === 'in_progress' || answered > 0) {
    const qNum = Math.min(total, (bState.currentQuestionIndex || 0) + 1);
    return { code: 'in_progress', label: `Em andamento (Questão ${qNum} de ${total})`, answered, total, qNum };
  }
  return { code: 'not_started', label: 'Não iniciado', answered: 0, total };
}

/**
 * Obtém o status consolidado de uma Habilidade/Tópico combinando o Diagnóstico e a Confirmação ENEM na Biblioteca
 */
function getSkillConsolidatedStatus(topicKey) {
  const resolved = resolveTopicByKey(topicKey);
  if (!resolved) return { status: 'not_assessed', label: 'Não avaliada', reason: '', nextStep: '', sampleText: '0 questões respondidas', studyDone: false };

  const { mod, blk, hab } = resolved;
  const canonical = resolved.topicKey;
  const st = storageService.getActiveState();
  const bState = st.moduleStates?.[mod.id]?.blocks?.[blk.id];
  const tProg = st.topicProgress?.[canonical] || {};
  const effTopic = getEffectiveTopicData(canonical);

  // Questões ENEM respondidas e verificadas na aba Prática e Confirmação
  const enemQs = effTopic?.questoesEnem || [];
  const enemAnsMap = tProg.enemAnswers || {};
  const enemChecked = enemQs.filter(q => enemAnsMap[q.id]?.checked);
  const enemCorrect = enemChecked.filter(q => enemAnsMap[q.id]?.selected === q.correta);

  // Questões de diagnóstico respondidas
  const diagEv = bState?.evaluation?.skills?.[hab.id];
  const diagAnswered = diagEv ? diagEv.answered : 0;
  const diagTotal = diagEv ? diagEv.total : (blk.questoes || []).filter(q => q.habilidadeId === hab.id).length;
  const diagCorrect = diagEv ? diagEv.correct : 0;

  const totalAnswered = diagAnswered + enemChecked.length;
  const totalAvailable = diagTotal + enemQs.length;
  const totalCorrect = diagCorrect + enemCorrect.length;

  const sampleText = totalAnswered > 0
    ? `${totalAnswered} de ${totalAvailable} questões respondidas · ${totalCorrect} acerto(s)`
    : `0 de ${totalAvailable} questões respondidas`;

  // Se o estudante confirmou o aprendizado na Biblioteca (ou acertou todas as questões ENEM verificadas)
  if (tProg.confirmedMastery) {
    return {
      status: 'mastered',
      label: 'Dominada',
      reason: `Aprendizado confirmado no estudo do tópico (${sampleText}).`,
      nextStep: 'Tópico concluído e dominado! Faça apenas revisões espaçadas quando desejar.',
      sampleText,
      studyDone: true,
      diagAnswered,
      enemAnswered: enemChecked.length,
      totalAnswered,
      totalCorrect
    };
  }

  if (diagEv && diagEv.status !== 'not_assessed') {
    return {
      status: diagEv.status,
      label: diagEv.label,
      reason: diagEv.reason,
      nextStep: diagEv.nextStep,
      sampleText,
      studyDone: Boolean(tProg.readSummary || enemChecked.length > 0),
      diagAnswered,
      enemAnswered: enemChecked.length,
      totalAnswered,
      totalCorrect
    };
  }

  if (enemChecked.length > 0) {
    const rate = enemCorrect.length / enemChecked.length;
    if (rate === 1) {
      return {
        status: 'mastered',
        label: 'Dominada',
        reason: `Acertou ${enemCorrect.length} de ${enemChecked.length} questão(ões) ENEM na Prática do tópico.`,
        nextStep: 'Excelente! Clique em "Confirmar Aprendizado" na aba Prática para marcar o tópico como concluído.',
        sampleText,
        studyDone: true,
        diagAnswered,
        enemAnswered: enemChecked.length,
        totalAnswered,
        totalCorrect
      };
    } else if (rate >= 0.5) {
      return {
        status: 'partial',
        label: 'Em evolução',
        reason: `Acertou ${enemCorrect.length} de ${enemChecked.length} questão(ões) ENEM na Prática.`,
        nextStep: 'Leia a resolução comentada passo a passo e revise o resumo do tópico.',
        sampleText,
        studyDone: true,
        diagAnswered,
        enemAnswered: enemChecked.length,
        totalAnswered,
        totalCorrect
      };
    } else {
      return {
        status: 'study',
        label: 'Precisa estudar',
        reason: `Acertou ${enemCorrect.length} de ${enemChecked.length} questão(ões) ENEM na Prática.`,
        nextStep: 'Revise o resumo didático, os sites brasileiros e as videoaulas deste tópico.',
        sampleText,
        studyDone: true,
        diagAnswered,
        enemAnswered: enemChecked.length,
        totalAnswered,
        totalCorrect
      };
    }
  }

  return {
    status: 'not_assessed',
    label: 'Não avaliada',
    reason: 'Ainda sem questões respondidas no diagnóstico ou na prática ENEM.',
    nextStep: 'Comece estudando livremente pela Biblioteca ou faça o diagnóstico do bloco.',
    sampleText,
    studyDone: Boolean(tProg.readSummary),
    diagAnswered: 0,
    enemAnswered: 0,
    totalAnswered: 0,
    totalCorrect: 0
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   5. OPERAÇÕES DA "MINHA LISTA" (PLANO DE ESTUDOS VIVO) E CONFIRMAÇÃO
   ══════════════════════════════════════════════════════════════════════════ */
const STUDY_STATUSES = ['A estudar', 'Em andamento', 'A praticar', 'Revisar novamente', 'Concluído'];
const STUDY_PRIORITIES = ['Alta', 'Média', 'Revisão'];

function addOrUpdateStudyItemByTopicKey({ topicKey, origin = 'Adicionado manualmente', status = 'A estudar', priority = 'Média' }) {
  const eff = getEffectiveTopicData(topicKey);
  if (!eff) return null;
  const st = storageService.getActiveState();
  const canonical = eff.topicKey;

  const existing = st.studyList.find(item => item.topicKey === canonical);
  if (existing) {
    existing.status = status;
    existing.priority = priority;
    existing.title = `${eff.hab.id} — ${eff.titulo}`;
    existing.subtitle = `${eff.mod.materia} · ${eff.mod.assunto} · Bloco ${eff.blk.ordem}`;
    existing.updatedAt = new Date().toISOString();
    storageService.persist();
    return { item: existing, isNew: false };
  }

  const newItem = {
    id: 'st_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
    topicKey: canonical,
    moduleId: eff.mod.id,
    materiaId: eff.mod.materiaId,
    materia: eff.mod.materia,
    assunto: eff.mod.assunto,
    blockId: eff.blk.id,
    skillId: eff.hab.id,
    title: `${eff.hab.id} — ${eff.titulo}`,
    subtitle: `${eff.mod.materia} · ${eff.mod.assunto} · Bloco ${eff.blk.ordem}: ${eff.blk.titulo}`,
    origin,
    status,
    priority,
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  st.studyList.push(newItem);
  storageService.persist();
  return { item: newItem, isNew: true };
}

function addBlockSkillsToStudyList(moduleId, blockId, mode = 'study') {
  const mod = getModuleById(moduleId);
  const blk = getBlockFromModule(mod, blockId);
  if (!mod || !blk) return 0;
  const status = mode === 'review' ? 'Revisar novamente' : 'A estudar';
  const priority = mode === 'review' ? 'Revisão' : 'Alta';
  let count = 0;

  (blk.habilidades || []).forEach(hab => {
    const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
    if (addOrUpdateStudyItemByTopicKey({ topicKey: tKey, origin: 'Adicionado manualmente', status, priority })) {
      count++;
    }
  });
  return count;
}

function addRecommendedFromBlockEvaluation(moduleId, blockId) {
  const mod = getModuleById(moduleId);
  const blk = getBlockFromModule(mod, blockId);
  if (!mod || !blk) return 0;
  const st = storageService.getActiveState();
  const bState = st.moduleStates?.[mod.id]?.blocks?.[blk.id];
  if (!bState || !bState.evaluation) return 0;

  let added = 0;
  Object.values(bState.evaluation.skills || {}).forEach(sk => {
    if (['study', 'partial', 'inconclusive'].includes(sk.status)) {
      const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, sk.id);
      const priority = sk.status === 'study' ? 'Alta' : 'Média';
      const status = sk.status === 'study' ? 'A estudar' : 'A praticar';
      addOrUpdateStudyItemByTopicKey({
        topicKey: tKey,
        origin: 'Adicionado pelo diagnóstico',
        status,
        priority
      });
      added++;
    }
  });
  return added;
}

function confirmTopicLearning(topicKey) {
  const eff = getEffectiveTopicData(topicKey);
  if (!eff) return false;
  const canonical = eff.topicKey;
  const st = storageService.getActiveState();
  st.topicProgress[canonical] = st.topicProgress[canonical] || { enemAnswers: {} };
  st.topicProgress[canonical].confirmedMastery = true;
  st.topicProgress[canonical].readSummary = true;
  st.topicProgress[canonical].updatedAt = new Date().toISOString();

  // Atualiza ou adiciona na Minha Lista como Concluído
  const existing = st.studyList.find(i => i.topicKey === canonical);
  if (existing) {
    existing.status = 'Concluído';
    existing.updatedAt = new Date().toISOString();
  } else {
    addOrUpdateStudyItemByTopicKey({
      topicKey: canonical,
      origin: 'Confirmado na Biblioteca',
      status: 'Concluído',
      priority: 'Revisão'
    });
  }
  storageService.persist();
  return true;
}

/* ══════════════════════════════════════════════════════════════════════════
   6. MENU SUPERIOR FIXO (AS 5 ÁREAS + PERFIL / MODO EDIÇÃO / BACKUP)
   ══════════════════════════════════════════════════════════════════════════ */
let activeTopModal = null; // null | 'onboarding' | 'profile-switcher' | 'backup-json'
let activeEditorModal = null; // null | { type: 'edit-topic'|'add-video'|'edit-video'|'add-site'|'edit-site'|'add-enem-q'|'edit-enem-q'|'add-diag-q'|'edit-diag-q', topicKey, moduleId, blockId, itemId }

function getInitials(name) {
  const parts = String(name || 'ES').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return String(parts[0] || 'ES').slice(0, 2).toUpperCase();
}

function getPaceLabel(pace) {
  if (pace === 'curto') return 'Ritmo curto (10–15 min)';
  if (pace === 'medio') return 'Ritmo médio (25–30 min)';
  return 'Ritmo livre';
}

function navigateToArea(areaName, extra = {}) {
  const st = storageService.getActiveState();
  st.mainArea = areaName;
  st.subView = extra.subView || 'main';
  if (extra.moduleId) st.activeModuleId = extra.moduleId;
  if (extra.blockId) st.activeBlockId = extra.blockId;
  if (extra.topicKey) {
    const resolved = resolveTopicByKey(extra.topicKey);
    if (resolved) {
      st.activeTopicKey = resolved.topicKey;
      st.activeModuleId = resolved.mod.id;
      st.activeBlockId = resolved.blk.id;
    }
  }
  if (extra.topicTab) st.activeTopicTab = extra.topicTab;
  if (extra.libraryFilterMateria !== undefined) st.libraryFilterMateria = extra.libraryFilterMateria;
  if (extra.libraryFilterModule !== undefined) st.libraryFilterModule = extra.libraryFilterModule;
  st.diagModal = null;

  // Registra última atividade para o botão "Continuar de onde parei"
  if (st.subView === 'topic-study') {
    const eff = getEffectiveTopicData(st.activeTopicKey);
    if (eff) {
      st.topicProgress[eff.topicKey] = st.topicProgress[eff.topicKey] || { enemAnswers: {} };
      st.topicProgress[eff.topicKey].readSummary = true;
      st.lastActivity = {
        type: 'topic',
        label: `${eff.mod.assunto} · ${eff.hab.id}: ${eff.titulo}`,
        topicKey: eff.topicKey,
        moduleId: eff.mod.id,
        blockId: eff.blk.id,
        updatedAt: new Date().toISOString()
      };
    }
  } else if (st.mainArea === 'diagnostics' && ['diag-pre', 'diag-summary', 'diag-question'].includes(st.subView)) {
    const mod = getModuleById(st.activeModuleId);
    const blk = getBlockFromModule(mod, st.activeBlockId);
    if (mod && blk) {
      st.lastActivity = {
        type: 'diag',
        label: `Diagnóstico de ${mod.assunto} · Bloco ${blk.ordem}: ${blk.titulo}`,
        moduleId: mod.id,
        blockId: blk.id,
        updatedAt: new Date().toISOString()
      };
    }
  }

  storageService.persist();
  renderPlatform();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.header = function() {
  const prof = storageService.getActiveProfile();
  const st = storageService.getActiveState();
  const activeStudyCount = (st.studyList || []).filter(i => i.status !== 'Concluído').length;
  const totalStudyCount = (st.studyList || []).length;
  const badgeCount = activeStudyCount || totalStudyCount;

  const greetingName = prof ? esc(prof.name) : 'Estudante';
  const initials = prof ? esc(getInitials(prof.name)) : 'ES';
  const curArea = st.activeArea || st.mainArea || 'home';
  const isEdit = storageService.editMode;

  return `
    <header class="topbar main-navbar">
      <a class="brand" href="#" data-main-nav="home">
        <span class="brand-mark">✳</span>meu enem
      </a>

      <nav class="nav main-nav-links" aria-label="Navegação principal da plataforma">
        <a href="#" data-main-nav="home" class="main-nav-item ${curArea === 'home' ? 'active' : ''}">
          🏠 Início
        </a>
        <a href="#" data-main-nav="library" class="main-nav-item ${curArea === 'library' ? 'active' : ''}">
          📚 Biblioteca de Estudos
        </a>
        <a href="#" data-main-nav="diagnostics" class="main-nav-item ${curArea === 'diagnostics' ? 'active' : ''}">
          🎯 Diagnósticos
        </a>
        <a href="#" data-main-nav="my-list" class="main-nav-item ${curArea === 'my-list' ? 'active' : ''}">
          📌 Minha Lista ${badgeCount > 0 ? `<span class="nav-count-pill">${badgeCount}</span>` : ''}
        </a>
        <a href="#" data-main-nav="progression" class="main-nav-item ${curArea === 'progression' ? 'active' : ''}">
          📈 Progressão
        </a>
      </nav>

      <div class="profile-bar">
        <button type="button"
          class="edit-mode-toggle ${isEdit ? 'edit-mode-on' : ''}"
          data-toggle-edit-mode="1"
          aria-pressed="${isEdit}"
          title="Ativar ou desativar o Modo Edição para alterar textos, imagens, vídeos, links e questões diretamente na tela">
          ✏️ Modo Edição ${isEdit ? '<strong>ATIVO</strong>' : ''}
        </button>

        <button type="button" class="backup-header-btn" data-profile-action="open-backup" title="Exportar ou Importar progresso e edições em JSON">
          💾 Backup
        </button>

        <button type="button" class="profile-trigger" data-profile-action="open-switcher" title="Alternar perfil local ou editar preferências">
          <span class="profile-greeting">Olá, <strong>${greetingName}</strong></span>
          <span class="avatar">${initials}</span>
          <span class="profile-caret">▾</span>
        </button>
      </div>
    </header>
    ${isEdit ? `
      <div class="edit-mode-banner" role="status">
        <span>✏️ <strong>Modo Edição Ativo:</strong> Os botões de edição estão visíveis nos tópicos, resumos, vídeos, sites e questões. Todas as alterações são salvas automaticamente neste navegador.</span>
        <button type="button" class="ob-btn-sm secondary" data-toggle-edit-mode="1">Concluir Edição</button>
      </div>
    ` : ''}
  `;
};

window.layout = function(body) {
  const mustOnboard = !storageService.getActiveProfile();
  const topModalHtml = mustOnboard
    ? renderOnboardingModal(true)
    : activeTopModal === 'profile-switcher'
      ? renderProfileSwitcherModal()
      : activeTopModal === 'onboarding'
        ? renderOnboardingModal(false)
        : activeTopModal === 'backup-json'
          ? renderBackupModal()
          : '';

  const editorModalHtml = activeEditorModal ? renderInAppEditorModal(activeEditorModal) : '';

  app.innerHTML = `
    <div class="shell">
      ${window.header()}
      <main id="main-content">${body}</main>
      ${footer()}
    </div>
    ${topModalHtml}
    ${editorModalHtml}
    <div class="toast" role="status" aria-live="polite"></div>
  `;
};

/* ══════════════════════════════════════════════════════════════════════════
   7. ÁREA 1: 🏠 INÍCIO (PAINEL DE BOAS-VINDAS + CONTINUAR DE ONDE PAREI)
   ══════════════════════════════════════════════════════════════════════════ */
function renderHomeArea() {
  const prof = storageService.getActiveProfile();
  const st = storageService.getActiveState();
  const modules = getAllModules();

  const name = prof ? prof.name : 'Rafaela';
  const goal = prof?.goal || 'Preparação Inteligente para o ENEM';
  const pace = getPaceLabel(prof?.pace || 'medio');

  // Calcula estatísticas gerais
  let totalSkills = 0;
  let masteredSkills = 0;
  let evaluatedSkills = 0;
  let completedBlocks = 0;
  let totalBlocks = 0;

  modules.forEach(mod => {
    (mod.blocos || []).forEach(blk => {
      totalBlocks++;
      const bState = st.moduleStates?.[mod.id]?.blocks?.[blk.id];
      if (bState?.activityStatus === 'completed') completedBlocks++;
      (blk.habilidades || []).forEach(hab => {
        totalSkills++;
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const cSt = getSkillConsolidatedStatus(tKey);
        if (cSt.status !== 'not_assessed') evaluatedSkills++;
        if (cSt.status === 'mastered') masteredSkills++;
      });
    });
  });

  const activeListItems = (st.studyList || []).filter(i => i.status !== 'Concluído');
  const completedListItems = (st.studyList || []).filter(i => i.status === 'Concluído');

  // Determina ação do botão "Continuar de onde parei"
  let resumeHtml = '';
  if (st.lastActivity) {
    const la = st.lastActivity;
    if (la.type === 'topic' && la.topicKey) {
      resumeHtml = `
        <div class="home-resume-box">
          <div>
            <span class="eyebrow">⏱ Continuar exatamente de onde você parou</span>
            <strong>📖 Estudo: ${esc(la.label)}</strong>
          </div>
          <button type="button" class="primary" data-open-topic="${esc(la.topicKey)}">
            Continuar de onde parei →
          </button>
        </div>
      `;
    } else if (la.type === 'diag' && la.moduleId && la.blockId) {
      resumeHtml = `
        <div class="home-resume-box">
          <div>
            <span class="eyebrow">⏱ Continuar exatamente de onde você parou</span>
            <strong>🎯 ${esc(la.label)}</strong>
          </div>
          <button type="button" class="primary" data-diag-open-block="${esc(la.blockId)}" data-diag-module="${esc(la.moduleId)}">
            Continuar de onde parei →
          </button>
        </div>
      `;
    }
  }

  if (!resumeHtml) {
    if (activeListItems.length > 0) {
      const nextItem = activeListItems[0];
      resumeHtml = `
        <div class="home-resume-box">
          <div>
            <span class="eyebrow">📌 Próximo item prioritário da sua Lista</span>
            <strong>${esc(nextItem.title)} (${esc(nextItem.subtitle)})</strong>
          </div>
          <button type="button" class="primary" data-open-topic="${esc(nextItem.topicKey)}">
            Continuar de onde parei →
          </button>
        </div>
      `;
    } else {
      resumeHtml = `
        <div class="home-resume-box">
          <div>
            <span class="eyebrow">🚀 Comece agora sem burocracia</span>
            <strong>Explore a Biblioteca de Estudos ou descubra sua base com um Diagnóstico</strong>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button type="button" class="primary" data-main-nav="library">
              📚 Abrir Biblioteca de Estudos →
            </button>
            <button type="button" class="secondary" data-main-nav="diagnostics">
              🎯 Ir para Diagnósticos
            </button>
          </div>
        </div>
      `;
    }
  }

  // Agrupa módulos por Matéria (Física, Matemática, Química)
  const materiasOrder = [
    { id: 'fisica', nome: 'Física', icone: '⚡', desc: 'Óptica Geométrica e Física, Cinemática, Dinâmica e Energia.' },
    { id: 'matematica', nome: 'Matemática', icone: '📐', desc: 'Porcentagem, Juros Compostos, Taxas e Probabilidade.' },
    { id: 'quimica', nome: 'Química', icone: '🧪', desc: 'Ligações Químicas, Polaridade, Forças Intermoleculares e Estequiometria.' }
  ];

  const materiasCardsHtml = materiasOrder.map(mat => {
    const matModules = modules.filter(m => m.materiaId === mat.id);
    const modRowsHtml = matModules.map(m => {
      const bCount = (m.blocos || []).length;
      const sCount = (m.blocos || []).reduce((acc, b) => acc + (b.habilidades?.length || 0), 0);
      const qEnemCount = (m.blocos || []).reduce((acc, b) => {
        return acc + (b.habilidades || []).reduce((s2, h) => {
          const eff = getEffectiveTopicData(buildTopicKey(m.materiaId, m.assuntoId, b.id, h.id));
          return s2 + (eff?.questoesEnem?.length || 0);
        }, 0);
      }, 0);

      return `
        <div class="home-module-item">
          <div class="home-module-info">
            <span class="home-module-icon">${m.icone || '📘'}</span>
            <div>
              <strong>${esc(m.assunto)}</strong>
              <small>${bCount} blocos · ${sCount} habilidades · ${qEnemCount} questões oficiais do ENEM</small>
            </div>
          </div>
          <div class="home-module-actions">
            <button type="button" class="primary ob-btn-sm" data-Quick-Library="${esc(m.id)}">
              📖 Estudar
            </button>
            <button type="button" class="secondary ob-btn-sm" data-Quick-Diag="${esc(m.id)}">
              🎯 Diagnóstico
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <article class="panel home-subject-card">
        <div class="home-subject-head">
          <span class="symbol">${mat.icone}</span>
          <div>
            <h3>${esc(mat.nome)}</h3>
            <p>${esc(mat.desc)}</p>
          </div>
        </div>
        <div class="home-module-list">
          ${modRowsHtml}
        </div>
      </article>
    `;
  }).join('');

  window.layout(`
    <section class="panel home-welcome-hero">
      <div class="home-welcome-top">
        <div>
          <div class="eyebrow">Plataforma de Estudos ENEM · ${esc(pace)}</div>
          <h1 class="page-title" style="margin:6px 0 8px">Olá, ${esc(name)}!</h1>
          <p class="lede">
            ${esc(goal)} — Escolha livremente o que quer estudar na <strong>Biblioteca</strong>, avalie sua base nos <strong>Diagnósticos</strong> ou siga seu plano na <strong>Minha Lista</strong>.
          </p>
        </div>
        <div class="home-stats-pills">
          <div class="home-stat-box">
            <strong>${masteredSkills}/${totalSkills}</strong>
            <span>Habilidades Dominadas</span>
          </div>
          <div class="home-stat-box">
            <strong>${activeListItems.length}</strong>
            <span>Ativos na Minha Lista</span>
          </div>
          <div class="home-stat-box">
            <strong>${completedBlocks}/${totalBlocks}</strong>
            <span>Blocos Diagnosticados</span>
          </div>
        </div>
      </div>

      ${resumeHtml}
    </section>

    <section class="home-subjects-section">
      <div class="section-head-row">
        <div>
          <div class="eyebrow">Acesso Direto por Matéria e Assunto</div>
          <h2 class="section-title">O que vamos estudar hoje?</h2>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="secondary" data-main-nav="library">📚 Ver Catálogo Completo</button>
          <button type="button" class="secondary" data-main-nav="my-list">📌 Abrir Minha Lista (${activeListItems.length + completedListItems.length})</button>
        </div>
      </div>

      <div class="home-subjects-grid">
        ${materiasCardsHtml}
      </div>
    </section>
  `);
}

/* ══════════════════════════════════════════════════════════════════════════
   8. ÁREA 2: 📚 BIBLIOTECA DE ESTUDOS (CATÁLOGO E PÁGINA DE ESTUDO DO TÓPICO)
   ══════════════════════════════════════════════════════════════════════════ */
function renderLibraryArea() {
  const st = storageService.getActiveState();
  if (st.subView === 'topic-study' && st.activeTopicKey) {
    return renderTopicStudyPage(st.activeTopicKey);
  }

  const modules = getAllModules();
  const filterMat = st.libraryFilterMateria || 'all';
  const filterMod = st.libraryFilterModule || 'all';
  const searchQ = (st.librarySearch || '').trim().toLowerCase();

  const filteredModules = modules.filter(m => {
    if (filterMat !== 'all' && m.materiaId !== filterMat) return false;
    if (filterMod !== 'all' && m.id !== filterMod) return false;
    return true;
  });

  if (!st.openAccordions) st.openAccordions = {};

  const modulesHtml = filteredModules.map((mod, modIdx) => {
    const blocksHtml = (mod.blocos || []).map((blk, blkIdx) => {
      const effBlk = getEffectiveBlockSummary(mod.id, blk.id);
      const matchingHabs = (blk.habilidades || []).filter(hab => {
        if (!searchQ) return true;
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const eff = getEffectiveTopicData(tKey);
        const hay = `${mod.materia} ${mod.assunto} ${effBlk.titulo} ${hab.id} ${eff?.titulo || hab.nome} ${eff?.foco || ''}`.toLowerCase();
        return hay.includes(searchQ);
      });

      if (matchingHabs.length === 0) return '';

      const habRowsHtml = matchingHabs.map(hab => {
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const eff = getEffectiveTopicData(tKey);
        const cons = getSkillConsolidatedStatus(tKey);
        const inList = (st.studyList || []).find(i => i.topicKey === tKey);
        const vidCount = eff.videos.length;
        const siteCount = eff.sites.length;
        const enemCount = eff.questoesEnem.length;

        return `
          <div class="lib-topic-row">
            <div class="lib-topic-main">
              <div class="lib-topic-top">
                <span class="ob-skill-code">${esc(hab.id)}</span>
                <strong class="lib-topic-title">${esc(eff.titulo)}</strong>
                ${cons.status !== 'not_assessed' ? `<span class="op-badge ${cons.status}">${esc(cons.label)}</span>` : ''}
                ${inList ? `<span class="ob-origin-tag">📌 Na Lista (${esc(inList.status)})</span>` : ''}
              </div>
              ${eff.foco ? `<p class="lib-topic-foco">${formatInlineMarkdown(eff.foco)}</p>` : ''}
              <div class="lib-topic-chips">
                <span>📖 Resumo + ${siteCount} site(s)</span>
                ${vidCount > 0 ? `<span>▶️ ${vidCount} videoaula(s)</span>` : ''}
                <span>📝 ${enemCount} questão(ões) ENEM</span>
              </div>
            </div>

            <div class="lib-topic-actions">
              <button type="button" class="primary ob-btn-sm" data-open-topic="${esc(tKey)}">
                Estudar Agora →
              </button>
              <button type="button" class="secondary ob-btn-sm" data-lib-add-list="${esc(tKey)}" title="Adicionar à Minha Lista">
                ${inList ? '✓ Na Lista' : '+ Minha Lista'}
              </button>
              <button type="button" class="ob-action-pill ob-btn-sm" data-lib-mark-review="${esc(tKey)}" title="Marcar para Revisar">
                ↻ Revisar
              </button>
            </div>
          </div>
        `;
      }).join('');

      const blkAccId = `lib_blk_${mod.id}_${blk.id}`;
      const isBlkOpen = searchQ
        ? true
        : (st.openAccordions[blkAccId] !== undefined ? st.openAccordions[blkAccId] : false);

      return `
        <details class="clean-accordion lib-block-accordion" data-acc-id="${esc(blkAccId)}" ${isBlkOpen ? 'open' : ''}>
          <summary class="clean-accordion-summary lib-block-summary">
            <div class="clean-acc-left">
              <span class="ob-hub-order">Bloco ${blk.ordem}</span>
              <div class="clean-acc-titles">
                <strong class="lib-block-title">${esc(effBlk.titulo)}</strong>
                <small class="clean-acc-sub">${matchingHabs.length} tópicos · Clique para abrir ou fechar</small>
              </div>
            </div>
            <div class="clean-acc-right">
              <span class="acc-chevron" aria-hidden="true">⌄</span>
            </div>
          </summary>

          <div class="clean-accordion-body lib-block-body">
            <div class="lib-block-subbar">
              <p class="lib-block-desc">${formatInlineMarkdown(effBlk.descricao)}</p>
              <button type="button" class="secondary ob-btn-sm" data-diag-open-block="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
                🎯 Fazer Diagnóstico deste Bloco
              </button>
            </div>
            <div class="lib-topics-list">
              ${habRowsHtml}
            </div>
          </div>
        </details>
      `;
    }).filter(Boolean).join('');

    if (!blocksHtml) return '';

    const totalModBlocks = (mod.blocos || []).length;
    const totalModSkills = (mod.blocos || []).reduce((a, b) => a + (b.habilidades?.length || 0), 0);
    const modAccId = `lib_mod_${mod.id}`;
    const isModOpen = (searchQ || filterMod !== 'all')
      ? true
      : (st.openAccordions[modAccId] !== undefined ? st.openAccordions[modAccId] : (modIdx === 0));

    return `
      <details class="panel clean-accordion lib-module-accordion" data-acc-id="${esc(modAccId)}" ${isModOpen ? 'open' : ''}>
        <summary class="clean-accordion-summary lib-module-summary">
          <div class="clean-acc-left">
            <span class="lib-module-icon">${mod.icone || '📘'}</span>
            <div class="clean-acc-titles">
              <span class="eyebrow">${esc(mod.materia)}</span>
              <h2 class="section-title" style="margin:2px 0;font-size:22px">${esc(mod.assunto)}</h2>
              <small class="clean-acc-sub">${totalModBlocks} blocos · ${totalModSkills} habilidades mapeadas</small>
            </div>
          </div>
          <div class="clean-acc-right">
            <span class="acc-hint-label">Ver blocos</span>
            <span class="acc-chevron" aria-hidden="true">⌄</span>
          </div>
        </summary>

        <div class="clean-accordion-body lib-module-body">
          <p class="section-copy" style="margin:0 0 14px">${esc(mod.descricao)}</p>
          <div class="lib-blocks-stack">
            ${blocksHtml}
          </div>
        </div>
      </details>
    `;
  }).filter(Boolean).join('');

  window.layout(`
    <section class="op-hero" style="padding-bottom:12px">
      <div>
        <div class="eyebrow">Catálogo de Conteúdos</div>
        <h1 class="page-title">Biblioteca de Estudos</h1>
        <p class="lede">
          Escolha qualquer tópico abaixo para ler o resumo, acessar sites confiáveis, assistir às videoaulas e praticar com questões oficiais do ENEM.
        </p>
      </div>
    </section>

    <section class="panel lib-filter-bar">
      <div class="lib-search-row">
        <input type="search" id="lib-search-input" class="lib-search-input"
          placeholder="🔍 Pesquisar assunto ou tópico (ex: Lentes, Juros, Estequiometria, Espelhos)..."
          value="${esc(st.librarySearch || '')}">
        ${st.librarySearch ? `<button type="button" class="secondary ob-btn-sm" data-lib-clear-search="1">Limpar busca</button>` : ''}
      </div>

      <div class="lib-filters-group">
        <div class="ob-filter-pills" role="tablist" aria-label="Filtrar por Matéria">
          <button type="button" class="ob-filter-pill ${filterMat === 'all' ? 'active' : ''}" data-lib-filter-mat="all">Todas as Matérias</button>
          <button type="button" class="ob-filter-pill ${filterMat === 'fisica' ? 'active' : ''}" data-lib-filter-mat="fisica">⚡ Física</button>
          <button type="button" class="ob-filter-pill ${filterMat === 'matematica' ? 'active' : ''}" data-lib-filter-mat="matematica">📐 Matemática</button>
          <button type="button" class="ob-filter-pill ${filterMat === 'quimica' ? 'active' : ''}" data-lib-filter-mat="quimica">🧪 Química</button>
        </div>

        <div class="ob-filter-pills" style="margin-top:8px" role="tablist" aria-label="Filtrar por Assunto">
          <button type="button" class="ob-filter-pill ${filterMod === 'all' ? 'active' : ''}" data-lib-filter-mod="all">Todos os Assuntos</button>
          ${modules
            .filter(m => filterMat === 'all' || m.materiaId === filterMat)
            .map(m => `
              <button type="button" class="ob-filter-pill ${filterMod === m.id ? 'active' : ''}" data-lib-filter-mod="${esc(m.id)}">
                ${m.icone || ''} ${esc(m.assunto)}
              </button>
            `).join('')}
        </div>
      </div>
    </section>

    <div class="lib-catalog-body">
      ${modulesHtml || `
        <div class="panel empty">
          <h3>Nenhum tópico encontrado para "${esc(st.librarySearch)}"</h3>
          <p>Tente outro termo ou limpe os filtros acima.</p>
          <button type="button" class="primary" data-lib-clear-search="1">Mostrar todos os tópicos</button>
        </div>
      `}
    </div>
  `);
}

/**
 * Página Interna de Estudo do Tópico na Biblioteca (3 Abas Limpas):
 * 1. [ 📖 Resumo e Sites ]
 * 2. [ ▶️ Videoaulas ]
 * 3. [ 📝 Prática e Confirmação (Questões ENEM) ]
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
  const cons = getSkillConsolidatedStatus(eff.topicKey);
  const inList = (st.studyList || []).find(i => i.topicKey === eff.topicKey);
  const tProg = st.topicProgress?.[eff.topicKey] || { enemAnswers: {} };

  // Navegação entre habilidades do mesmo bloco
  const siblings = eff.blk.habilidades || [];
  const curHabIdx = siblings.findIndex(h => h.id === eff.hab.id);
  const prevHab = curHabIdx > 0 ? siblings[curHabIdx - 1] : null;
  const nextHab = curHabIdx >= 0 && curHabIdx < siblings.length - 1 ? siblings[curHabIdx + 1] : null;

  let tabBodyHtml = '';

  /* ABA 1: [ 📖 Resumo e Sites ] */
  if (activeTab === 'resumo') {
    const sitesCardsHtml = eff.sites.length > 0 ? eff.sites.map(site => `
      <article class="ob-resource-card">
        <div class="ob-resource-icon">🌐</div>
        <div class="ob-resource-body">
          <div class="ob-resource-meta">
            <span class="op-badge mastered">${esc(site.portal || site.fonte || 'Portal Educacional')}</span>
          </div>
          <h4>${esc(site.titulo)}</h4>
          <p>${formatInlineMarkdown(site.resumo || site.objetivo || '')}</p>
          <div class="ob-resource-actions">
            <a href="${esc(site.url)}" target="_blank" rel="noopener noreferrer" class="secondary ob-btn-sm">
              Ler no ${esc(site.portal || site.fonte || 'Portal')} ↗
            </a>
            ${isEdit ? `
              <button type="button" class="ob-action-pill ob-btn-sm" data-editor-open="edit-site" data-topic-key="${esc(eff.topicKey)}" data-item-id="${esc(site.id || site.url)}">✏️ Editar</button>
              <button type="button" class="ob-action-pill ob-btn-sm ob-icon-del" data-editor-delete-site="${esc(site.id || site.url)}" data-topic-key="${esc(eff.topicKey)}">🗑️ Excluir</button>
            ` : ''}
          </div>
        </div>
      </article>
    `).join('') : `
      <div class="empty" style="padding:18px;border:1px dashed var(--line);border-radius:12px">
        <p style="margin:0 0 10px">Nenhum site cadastrado ainda neste tópico.</p>
        <button type="button" class="secondary ob-btn-sm" data-editor-open="add-site" data-topic-key="${esc(eff.topicKey)}">+ Adicionar Site/Leitura</button>
      </div>
    `;

    tabBodyHtml = `
      <div class="ob-study-tab-pane">
        ${isEdit ? `
          <div class="editor-inline-toolbar">
            <span>✏️ <strong>Editar Resumo e Imagem deste Tópico:</strong></span>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="primary ob-btn-sm" data-editor-open="edit-topic" data-topic-key="${esc(eff.topicKey)}">
                ✏️ Editar Título, Resumo e Imagem
              </button>
              ${eff.resumoImage ? `
                <button type="button" class="secondary ob-btn-sm ob-icon-del" data-editor-remove-resumo-img="${esc(eff.topicKey)}">
                  🗑️ Remover Imagem Ilustrativa
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
          <div class="eyebrow" style="margin-bottom:8px">Resumo Didático · ${esc(eff.blk.titulo)}</div>
          ${renderMarkdownSummary(eff.resumo)}
        </div>

        <hr class="topic-divider">

        <div class="topic-sites-section">
          <div class="section-head-row" style="margin-bottom:12px">
            <div>
              <div class="eyebrow">Sites Confiáveis</div>
              <h3 class="section-title" style="font-size:20px;margin:4px 0">Leitura Complementar</h3>
            </div>
            <button type="button" class="secondary ob-btn-sm" data-editor-open="add-site" data-topic-key="${esc(eff.topicKey)}">
              + Adicionar Site
            </button>
          </div>
          <div class="ob-resource-list">
            ${sitesCardsHtml}
          </div>
        </div>

        <div class="actions" style="margin-top:26px;padding-top:16px;border-top:1px solid var(--line);justify-content:space-between">
          <button type="button" class="secondary" data-switch-topic-tab="videos">
            ▶️ Ver Videoaulas (${eff.videos.length}) →
          </button>
          <button type="button" class="primary" data-switch-topic-tab="pratica">
            📝 Praticar Questões ENEM (${eff.questoesEnem.length}) →
          </button>
        </div>
      </div>
    `;
  }

  /* ABA 2: [ ▶️ Videoaulas ] — Miniatura clicável do YouTube sem Erro 153! */
  else if (activeTab === 'videos') {
    const videosListHtml = eff.videos.length > 0 ? eff.videos.map(v => {
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
              <span class="op-badge partial">${esc(v.canal || 'YouTube')}</span>
            </div>
            <h4 style="margin:6px 0;font-size:16px">${esc(v.titulo)}</h4>
            ${(v.nota || v.objetivo) ? `<p style="margin-bottom:10px">${esc(v.nota || v.objetivo)}</p>` : ''}
            <div class="ob-resource-actions">
              <a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer" class="primary ob-btn-sm">
                ▶ Assistir aula no YouTube ↗
              </a>
              <button type="button" class="secondary ob-btn-sm" data-editor-open="edit-video" data-topic-key="${esc(eff.topicKey)}" data-item-id="${esc(v.id || v.url)}">
                ✏️ Editar
              </button>
              <button type="button" class="ob-action-pill ob-btn-sm ob-icon-del" data-editor-delete-video="${esc(v.id || v.url)}" data-topic-key="${esc(eff.topicKey)}">
                🗑️ Excluir
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('') : `
      <div class="panel empty video-empty-state">
        <div style="font-size:32px;margin-bottom:8px">🎬</div>
        <h3 style="margin:0 0 6px;color:var(--ink)">Nenhuma videoaula cadastrada ainda neste tópico</h3>
        <p style="margin:0 auto 16px;max-width:440px">
          Adicione links de aulas do YouTube específicas para <strong>${esc(eff.titulo)}</strong>.
        </p>
        <button type="button" class="primary" data-editor-open="add-video" data-topic-key="${esc(eff.topicKey)}">
          + Adicionar Vídeo
        </button>
      </div>
    `;

    tabBodyHtml = `
      <div class="ob-study-tab-pane">
        <div class="section-head-row" style="margin-bottom:14px">
          <div>
            <div class="eyebrow">Aulas em Vídeo</div>
            <h3 class="section-title" style="font-size:21px;margin:4px 0">Videoaulas: ${esc(eff.titulo)}</h3>
          </div>
          <button type="button" class="primary ob-btn-sm" data-editor-open="add-video" data-topic-key="${esc(eff.topicKey)}">
            + Adicionar Vídeo
          </button>
        </div>

        <div class="ob-resource-list">
          ${videosListHtml}
        </div>

        <div class="actions" style="margin-top:26px;padding-top:16px;border-top:1px solid var(--line);justify-content:space-between">
          <button type="button" class="secondary" data-switch-topic-tab="resumo">
            ← Voltar para Resumo e Sites
          </button>
          <button type="button" class="primary" data-switch-topic-tab="pratica">
            📝 Praticar Questões ENEM (${eff.questoesEnem.length}) →
          </button>
        </div>
      </div>
    `;
  }

  /* ABA 3: [ 📝 Prática e Confirmação (Questões ENEM) ] */
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
              <span class="ob-skill-tag">Habilidade ${esc(q.habilidadeId || eff.hab.id)}</span>
              ${q.contexto ? `<span class="ob-situacao-pill">${esc(q.contexto)}</span>` : ''}
            </div>
            ${isEdit ? `
              <div style="display:flex;gap:6px">
                <button type="button" class="ob-action-pill ob-btn-sm" data-editor-open="edit-enem-q" data-topic-key="${esc(eff.topicKey)}" data-item-id="${esc(q.id)}">✏️ Editar Questão</button>
                <button type="button" class="ob-action-pill ob-btn-sm ob-icon-del" data-editor-delete-enem-q="${esc(q.id)}" data-topic-key="${esc(eff.topicKey)}">🗑️ Excluir</button>
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

          <div class="actions" style="margin-top:14px">
            <button type="button" class="primary ob-btn-sm"
              data-enem-check-q="${esc(q.id)}"
              data-topic-key="${esc(eff.topicKey)}"
              ${!aSt.selected ? 'disabled' : ''}>
              ✓ Responder e ver resolução comentada
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
        <p>Nenhuma questão oficial do ENEM cadastrada ainda neste tópico.</p>
        <button type="button" class="primary ob-btn-sm" data-editor-open="add-enem-q" data-topic-key="${esc(eff.topicKey)}">+ Nova Questão ENEM</button>
      </div>
    `;

    tabBodyHtml = `
      <div class="ob-study-tab-pane">
        <div class="section-head-row" style="margin-bottom:14px">
          <div>
            <div class="eyebrow">Questões Oficiais do ENEM (5 Alternativas A–E e Gabarito Comentado)</div>
            <h3 class="section-title" style="font-size:22px;margin:4px 0">Prática e Confirmação de Aprendizado</h3>
            <p class="section-copy">Resolva as questões oficiais abaixo para comprovar seu domínio no tópico e atualizar sua Progressão.</p>
          </div>
          <button type="button" class="secondary ob-btn-sm" data-editor-open="add-enem-q" data-topic-key="${esc(eff.topicKey)}">
            + Nova Questão ENEM
          </button>
        </div>

        <div class="ob-practice-list">
          ${enemCardsHtml}
        </div>

        <div class="ob-confirm-evolution-box">
          <div style="margin-bottom:12px">
            <div class="eyebrow">Confirmação de Domínio Real</div>
            <h4 style="font-size:17px;margin:4px 0">Compreendeu a resolução e sente segurança em "${esc(eff.titulo)}"?</h4>
            <p>Ao confirmar o aprendizado, esta habilidade (<strong>${esc(eff.hab.id)}</strong>) é marcada como <strong>Concluída</strong> na sua Lista e <strong>Dominada</strong> na aba Progressão.</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button type="button" class="primary" data-confirm-topic-learning="${esc(eff.topicKey)}">
              ${tProg.confirmedMastery ? '✓ Aprendizado já Confirmado (Dominado)' : '✓ Confirmar Aprendizado (Marcar Tópico como Concluído/Dominado)'}
            </button>
            <button type="button" class="secondary" data-lib-mark-review="${esc(eff.topicKey)}">
              ↻ Marcar para Revisar Novamente
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.layout(`
    <div class="back-row" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <button type="button" class="link-btn" data-back-to-catalog="1">
        ← Voltar para a Biblioteca (${esc(eff.mod.assunto)})
      </button>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        ${prevHab ? `<button type="button" class="link-btn" data-open-topic="${esc(buildTopicKey(eff.mod.materiaId, eff.mod.assuntoId, eff.blk.id, prevHab.id))}">← Tópico anterior</button>` : ''}
        ${nextHab ? `<button type="button" class="link-btn" data-open-topic="${esc(buildTopicKey(eff.mod.materiaId, eff.mod.assuntoId, eff.blk.id, nextHab.id))}">Próximo tópico →</button>` : ''}
      </div>
    </div>

    <section class="panel ob-study-workspace-head">
      <div class="ob-study-item-badges">
        <span class="ob-hub-order">${esc(eff.mod.materia)} · ${esc(eff.mod.assunto)} · Bloco ${eff.blk.ordem}</span>
        ${cons.status !== 'not_assessed' ? `<span class="op-badge ${cons.status}">${esc(cons.label)}</span>` : ''}
      </div>

      <div class="ob-workspace-title-row">
        <div>
          <h1 class="page-title" style="font-size:clamp(22px,3vw,30px);margin:4px 0">
            ${esc(eff.titulo)}
          </h1>
          <p class="section-copy" style="margin:0">${esc(eff.blk.titulo)}</p>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <button type="button" class="secondary ob-btn-sm" data-lib-add-list="${esc(eff.topicKey)}">
            ${inList ? `✓ Na Lista (${esc(inList.status)})` : '+ Adicionar à Minha Lista'}
          </button>
          <button type="button" class="ob-action-pill ob-btn-sm" data-lib-mark-review="${esc(eff.topicKey)}">
            ↻ Marcar para Revisar
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
          📝 Questões ENEM (${eff.questoesEnem.length})
        </button>
      </div>
    </section>

    <section class="panel" style="margin-top:16px;margin-bottom:40px">
      ${tabBodyHtml}
    </section>
  `);
}


/* ══════════════════════════════════════════════════════════════════════════
   9. ÁREA 3: 🎯 DIAGNÓSTICOS (TODOS OS 6 MÓDULOS + FLUXO GUIADO E LIVRE)
   ══════════════════════════════════════════════════════════════════════════ */
function isGenericYoutubeSearchUrl(url) {
  return String(url || '').includes('youtube.com/results');
}

// Compatibilidade unificada para storageService
Object.assign(storageService, {
  save() {
    this.persist();
  },
  toggleEditMode() {
    this.editMode = !this.editMode;
    return this.editMode;
  },
  recordLastActivity(act) {
    const st = this.getActiveState();
    st.lastActivity = { ...act, updatedAt: new Date().toISOString() };
    this.persist();
  },
  ensureModuleDiagState(st, moduleId) {
    const targetSt = st || this.getActiveState();
    if (!targetSt.moduleStates) targetSt.moduleStates = {};
    const mod = getModuleById(moduleId);
    if (!targetSt.moduleStates[moduleId] || !targetSt.moduleStates[moduleId].blocks) {
      targetSt.moduleStates[moduleId] = createEmptyModuleDiagState(mod);
    } else if (mod && Array.isArray(mod.blocos)) {
      mod.blocos.forEach(b => {
        if (!targetSt.moduleStates[moduleId].blocks[b.id]) {
          targetSt.moduleStates[moduleId].blocks[b.id] = {
            activityStatus: 'not_started',
            currentIndex: 0,
            summaryViewed: false,
            activeFilterSkillIds: null,
            answers: {},
            evaluation: null
          };
        }
      });
    }
    return targetSt.moduleStates[moduleId];
  },
  exportBackupJson() {
    return this.exportBackupJSON();
  },
  importBackupJson(rawStr) {
    try {
      this.importBackupJSON(rawStr);
      return { ok: true };
    } catch (e) {
      return { ok: false, msg: e.message || 'JSON inválido' };
    }
  },
  getCustomBlock(moduleId, blockId) {
    const mod = getModuleById(moduleId);
    if (!mod) return {};
    const key = `${mod.materiaId}_${mod.assuntoId}_${normalizeBlockSlug(blockId)}`;
    return this.getBlockCustomContent(key);
  },
  updateCustomBlock(moduleId, blockId, mutatorFn) {
    const mod = getModuleById(moduleId);
    if (!mod) return;
    const key = `${mod.materiaId}_${mod.assuntoId}_${normalizeBlockSlug(blockId)}`;
    const cur = { ...this.getBlockCustomContent(key) };
    mutatorFn(cur);
    this.saveBlockCustomContent(key, cur);
  },
  updateCustomTopic(topicKey, mutatorFn) {
    const eff = getEffectiveTopicData(topicKey);
    if (!eff) return;
    const canonical = eff.topicKey;
    const rawCustom = { ...this.getTopicCustomContent(canonical) };
    const helper = {
      titulo: rawCustom.customTitle || eff.titulo,
      foco: rawCustom.customFoco !== undefined ? rawCustom.customFoco : eff.foco,
      resumo: rawCustom.customResumo !== undefined ? rawCustom.customResumo : eff.resumo,
      resumoImage: rawCustom.resumoImage || '',
      deletedVideoIds: rawCustom.deletedVideoIds || [],
      addedVideos: Array.isArray(rawCustom.videos) ? rawCustom.videos.slice() : eff.videos.slice(),
      deletedSiteIds: rawCustom.deletedSiteIds || [],
      addedSites: Array.isArray(rawCustom.sites) ? rawCustom.sites.slice() : eff.sites.slice(),
      deletedEnemIds: rawCustom.deletedEnemIds || [],
      addedEnem: Array.isArray(rawCustom.questoesEnem) ? rawCustom.questoesEnem.slice() : eff.questoesEnem.slice()
    };
    mutatorFn(helper);
    const nextCustom = {
      ...rawCustom,
      customTitle: helper.titulo,
      customFoco: helper.foco,
      customResumo: helper.resumo,
      resumoImage: helper.resumoImage,
      deletedVideoIds: helper.deletedVideoIds,
      videos: helper.addedVideos.filter(v => !helper.deletedVideoIds.includes(v.id || v.url)),
      deletedSiteIds: helper.deletedSiteIds,
      sites: helper.addedSites.filter(s => !helper.deletedSiteIds.includes(s.id || s.url)),
      deletedEnemIds: helper.deletedEnemIds,
      questoesEnem: helper.addedEnem.filter(q => !helper.deletedEnemIds.includes(q.id))
    };
    this.saveTopicCustomContent(canonical, nextCustom);
  }
});

// Suporta createProfile(name, goal, pace) ou createProfile({ name, goal, pace })
const _origCreateProfile = storageService.createProfile.bind(storageService);
storageService.createProfile = function(a, b, c) {
  if (typeof a === 'object' && a !== null) return _origCreateProfile(a);
  return _origCreateProfile({ name: a, goal: b, pace: c });
};
const _origUpdateProfile = storageService.updateActiveProfile.bind(storageService);
storageService.updateActiveProfile = function(a, b, c) {
  if (typeof a === 'object' && a !== null) return _origUpdateProfile(a);
  return _origUpdateProfile({ name: a, goal: b, pace: c });
};
storageService.init();
if (storageService.data && !Object.getOwnPropertyDescriptor(storageService.data, 'statesByProfile')) {
  Object.defineProperty(storageService.data, 'statesByProfile', {
    get() { return storageService.data.profileStates; }
  });
}

function getActivityMeta(status) {
  const code = typeof status === 'object' && status !== null ? status.code : status;
  const map = {
    not_started: { label: 'Não iniciado', cls: 'neutral', icon: '○' },
    in_progress: { label: 'Em andamento', cls: 'partial', icon: '◐' },
    completed:   { label: 'Concluído', cls: 'mastered', icon: '✓' },
    skipped:     { label: 'Pulado', cls: 'insufficient', icon: '⏭' },
    not_assessed:{ label: 'Não avaliado', cls: 'neutral', icon: '○' }
  };
  return map[code] || map.not_started;
}

function getSkillStatusMeta(status) {
  const map = {
    not_assessed: {
      label: 'Não avaliada',
      cls: 'neutral',
      icon: '○',
      advice: 'Nenhuma questão respondida ainda para esta habilidade.'
    },
    insufficient: {
      label: 'Evidência insuficiente',
      cls: 'insufficient',
      icon: '…',
      advice: 'Amostra pequena (questões em branco). Responda mais questões ou pratique questões ENEM para confirmar.'
    },
    inconclusive: {
      label: 'Inconclusiva',
      cls: 'insufficient',
      icon: '…',
      advice: 'Amostra pequena (questões em branco). Responda mais questões ou pratique questões ENEM para confirmar.'
    },
    mastered: {
      label: 'Dominada',
      cls: 'mastered',
      icon: '✓',
      advice: 'Domínio demonstrado com segurança nas questões respondidas.'
    },
    partial: {
      label: 'Em evolução (Parcial)',
      cls: 'partial',
      icon: '◐',
      advice: 'Bom caminho, mas houve dúvida ou oscilação. Vale revisão pontual e prática ENEM.'
    },
    study: {
      label: 'Precisa estudar',
      cls: 'study',
      icon: '!',
      advice: 'Prioridade recomendada para leitura do resumo, videoaula e prática.'
    }
  };
  return map[status] || map.not_assessed;
}

function addSkillToStudyList(topicKey, origin = 'Diagnóstico', priority = 'Média', status = 'A estudar') {
  const st = storageService.getActiveState();
  const eff = getEffectiveTopicData(topicKey);
  if (!eff) return { added: false };
  const existed = (st.studyList || []).some(i => i.topicKey === eff.topicKey);
  const res = addOrUpdateStudyItemByTopicKey({
    topicKey: eff.topicKey,
    origin,
    status,
    priority
  });
  return { added: Boolean(res && !existed), item: res?.item };
}

// Sobrescreve evaluateBlock e getBlockLiveActivityStatus para suportar (blk, bSt) e (modId, blk, bSt) + q.habilidade / q.habilidadeId
evaluateBlock = function(arg1, arg2, arg3) {
  const blockObj = (typeof arg1 === 'string') ? arg2 : arg1;
  const bState = (typeof arg1 === 'string') ? arg3 : arg2;
  const safeState = bState || { answers: {}, activityStatus: 'not_started' };
  const questions = (blockObj && blockObj.questoes) ? blockObj.questoes : [];
  const habilidades = (blockObj && blockObj.habilidades) ? blockObj.habilidades : [];
  const answers = safeState.answers || {};

  let totalQuestions = questions.length;
  let totalAnswered = 0;
  let totalBlank = 0;
  let totalCorrect = 0;

  const skillBuckets = {};
  habilidades.forEach(h => {
    skillBuckets[h.id] = {
      id: h.id,
      nome: h.nome,
      total: 0,
      answered: 0,
      blank: 0,
      correct: 0,
      wrong: 0,
      certezaCorrect: 0,
      duvidaCorrect: 0,
      doubtCount: 0,
      sureCount: 0,
      status: 'not_assessed',
      label: 'Não avaliada',
      reason: '',
      nextStep: ''
    };
  });

  questions.forEach(q => {
    const habId = q.habilidade || q.habilidadeId;
    const bucket = skillBuckets[habId];
    if (bucket) bucket.total += 1;

    const ans = answers[q.id];
    const choice = ans ? (ans.choice || ans.selected || null) : null;
    if (!choice) {
      totalBlank += 1;
      if (bucket) bucket.blank += 1;
      return;
    }

    totalAnswered += 1;
    if (bucket) bucket.answered += 1;

    const isCorrect = choice === q.correta;
    const conf = ans.confidence === 'duvida' || ans.confidence === 'unsure' ? 'duvida' : 'certeza';

    if (bucket) {
      if (conf === 'duvida') bucket.doubtCount += 1;
      else bucket.sureCount += 1;
    }

    if (isCorrect) {
      totalCorrect += 1;
      if (bucket) {
        bucket.correct += 1;
        if (conf === 'duvida') bucket.duvidaCorrect += 1;
        else bucket.certezaCorrect += 1;
      }
    } else if (bucket) {
      bucket.wrong += 1;
    }
  });

  Object.values(skillBuckets).forEach(b => {
    if (b.answered === 0) {
      b.status = 'not_assessed';
      b.label = 'Não avaliada';
    } else if (b.answered < b.total && b.wrong === 0 && b.certezaCorrect < b.total) {
      b.status = 'insufficient';
      b.label = 'Inconclusiva';
    } else if (b.correct === b.answered && b.duvidaCorrect === 0 && b.answered === b.total) {
      b.status = 'mastered';
      b.label = 'Dominada';
    } else if (b.correct === b.answered && b.duvidaCorrect > 0) {
      b.status = 'partial';
      b.label = 'Em evolução (Parcial)';
    } else if (b.correct > 0 && b.wrong > 0) {
      b.status = 'partial';
      b.label = 'Em evolução (Parcial)';
    } else {
      b.status = 'study';
      b.label = 'Precisa estudar';
    }
    const meta = getSkillStatusMeta(b.status);
    b.reason = meta.advice;
    b.nextStep = meta.advice;
  });

  const accuracyOnAnswered = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;
  return {
    totalQuestions,
    totalAnswered,
    answeredCount: totalAnswered,
    totalBlank,
    blankCount: totalBlank,
    totalCorrect,
    correctCount: totalCorrect,
    accuracyOnAnswered,
    accuracyRate: accuracyOnAnswered,
    skills: skillBuckets
  };
};

getBlockLiveActivityStatus = function(arg1, arg2, arg3) {
  const blockObj = (typeof arg1 === 'string') ? arg2 : arg1;
  const bState = (typeof arg1 === 'string') ? arg3 : arg2;
  if (!bState) return 'not_started';
  if (bState.activityStatus === 'completed') return 'completed';
  if (bState.activityStatus === 'skipped') return 'skipped';
  const questions = (blockObj && blockObj.questoes) ? blockObj.questoes : [];
  const answeredCount = questions.filter(q => {
    const a = bState.answers?.[q.id];
    return Boolean(a && (a.choice || a.selected));
  }).length;
  if (answeredCount > 0 || bState.activityStatus === 'in_progress') return 'in_progress';
  return 'not_started';
};

function getEffectiveBlockQuestions(moduleId, blockId) {
  const mod = getModuleById(moduleId);
  if (!mod) return [];
  const blk = (mod.blocos || []).find(b => b.id === blockId);
  if (!blk) return [];
  const baseQs = (blk.questoes || []).slice();
  const customBlk = storageService.getCustomBlock(moduleId, blockId);
  const deletedIds = customBlk?.deletedDiagQIds || [];
  const overrides = customBlk?.diagQOverrides || {};
  const added = customBlk?.addedDiagQs || [];

  const filteredBase = baseQs
    .filter(q => !deletedIds.includes(q.id))
    .map(q => overrides[q.id] ? { ...q, ...overrides[q.id] } : q);

  return [...filteredBase, ...added].map(q => ({
    ...q,
    habilidade: q.habilidade || q.habilidadeId || '',
    habilidadeId: q.habilidadeId || q.habilidade || '',
    situacao: q.situacao || q.contexto || '',
    contexto: q.contexto || q.situacao || ''
  }));
}

function getEffectiveDiagnosticBlock(moduleId, blockId) {
  const mod = getModuleById(moduleId);
  if (!mod) return null;
  const blk = (mod.blocos || []).find(b => b.id === blockId);
  if (!blk) return null;
  const effSum = getEffectiveBlockSummary(moduleId, blockId);
  const effQs = getEffectiveBlockQuestions(moduleId, blockId);
  return {
    ...blk,
    titulo: effSum.titulo,
    descricao: effSum.descricao,
    resumo: effSum.resumo,
    questoes: effQs
  };
}

function renderDiagnosticsArea() {
  const st = storageService.getActiveState();
  const modules = getAllModules();
  const activeModId = st.activeDiagModuleId && getModuleById(st.activeDiagModuleId)
    ? st.activeDiagModuleId
    : 'fisica_optica';
  st.activeDiagModuleId = activeModId;

  const mod = getModuleById(activeModId);
  const modState = storageService.ensureModuleDiagState(st, activeModId);

  if (st.subView === 'diag-pre-block' && st.activeDiagBlockId) {
    return renderDiagPreBlock(mod, st.activeDiagBlockId, modState);
  }
  if (st.subView === 'diag-summary' && st.activeDiagBlockId) {
    return renderDiagBlockSummary(mod, st.activeDiagBlockId, modState);
  }
  if (st.subView === 'diag-question' && st.activeDiagBlockId) {
    return renderDiagBlockQuestion(mod, st.activeDiagBlockId, modState);
  }
  if (st.subView === 'diag-closing' && st.activeDiagBlockId) {
    return renderDiagBlockClosing(mod, st.activeDiagBlockId, modState);
  }

  // Visão Principal de Diagnósticos: Seletor de Matéria/Módulo + Grade de Blocos
  const totalBlocks = (mod.blocos || []).length;
  let completedCount = 0;
  let totalSkills = 0;
  let masteredCount = 0;

  (mod.blocos || []).forEach(blk => {
    const bSt = modState.blocks[blk.id];
    const effB = getEffectiveDiagnosticBlock(mod.id, blk.id);
    const liveStatus = getBlockLiveActivityStatus(effB, bSt);
    if (liveStatus === 'completed') completedCount++;
    (blk.habilidades || []).forEach(h => {
      totalSkills++;
      const cSt = getSkillConsolidatedStatus(buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, h.id));
      if (cSt.status === 'mastered') masteredCount++;
    });
  });

  const blocksGridHtml = (mod.blocos || []).map(rawBlk => {
    const blk = getEffectiveDiagnosticBlock(mod.id, rawBlk.id);
    const bSt = modState.blocks[blk.id];
    const liveStatus = getBlockLiveActivityStatus(blk, bSt);
    const actMeta = getActivityMeta(liveStatus);
    const ev = bSt.evaluation || evaluateBlock(blk, bSt);

    const answeredNow = (blk.questoes || []).filter(q => bSt.answers?.[q.id]?.choice).length;
    const totalQ = (blk.questoes || []).length;

    let perfLine = 'Nenhuma questão respondida ainda';
    if (liveStatus === 'completed' && bSt.evaluation) {
      perfLine = `${ev.totalCorrect} acerto(s) em ${ev.totalAnswered} respondida(s) (de ${ev.totalQuestions})`;
      if (ev.totalBlank > 0) perfLine += ` · ${ev.totalBlank} em branco`;
    } else if (answeredNow > 0) {
      perfLine = `${answeredNow} de ${totalQ} questões respondidas até agora`;
    }

    const habPillsHtml = (blk.habilidades || []).map(h => {
      const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, h.id);
      const cSt = getSkillConsolidatedStatus(tKey);
      if (cSt.status === 'not_assessed') return '';
      return `<span class="op-badge ${cSt.status}" title="${esc(h.nome)}: ${esc(cSt.label)}">${esc(h.nome)}: ${esc(cSt.label)}</span>`;
    }).filter(Boolean).join(' ');

    let primaryBtnLabel = 'Iniciar Bloco';
    if (liveStatus === 'in_progress') primaryBtnLabel = 'Continuar Bloco';
    else if (liveStatus === 'completed') primaryBtnLabel = 'Ver Resultado / Refazer';
    else if (liveStatus === 'skipped') primaryBtnLabel = 'Retomar Bloco Pulado';

    return `
      <article class="panel ob-hub-card status-${liveStatus}">
        <div class="ob-hub-card-top">
          <span class="ob-hub-order">${esc(mod.materia)} · Bloco ${blk.ordem} de ${totalBlocks}</span>
          <span class="op-badge ${actMeta.cls}">${actMeta.icon} ${actMeta.label}</span>
        </div>

        <h3 class="ob-hub-title">${esc(blk.titulo)}</h3>
        <p class="ob-hub-desc">${esc(blk.descricao)}</p>

        <div class="ob-hub-stats">
          <div class="ob-hub-stat-line">
            <strong>Avaliação:</strong> ${totalQ} questões · ${(blk.habilidades || []).length} tópicos
          </div>
          ${(liveStatus === 'completed' || answeredNow > 0) ? `
            <div class="ob-hub-stat-line">
              <strong>Desempenho:</strong> ${esc(perfLine)}
            </div>
          ` : ''}
        </div>

        ${habPillsHtml ? `
          <div class="ob-hub-skills-preview">
            ${habPillsHtml}
          </div>
        ` : ''}

        <div class="ob-hub-actions">
          <button type="button" class="primary ob-btn-sm" data-diag-open-block="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
            ${primaryBtnLabel}
          </button>
          <button type="button" class="secondary ob-btn-sm" data-diag-open-summary="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
            📖 Ver Resumo
          </button>
          ${liveStatus === 'completed' ? `
            <button type="button" class="ob-action-pill ob-btn-sm" data-diag-open-closing="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
              📊 Relatório
            </button>
          ` : ''}
        </div>
      </article>
    `;
  }).join('');

  window.layout(`
    <section class="op-hero" style="padding-bottom:14px">
      <div>
        <div class="eyebrow">Avaliação Pedagógica por Habilidade e Nível de Confiança</div>
        <h1 class="page-title">Diagnósticos</h1>
        <p class="lede">
          Descubra o que você já domina e o que precisa entrar na sua <strong>Minha Lista</strong>. Questões deixadas em branco nunca contam como erro, e consultar o resumo antes do bloco não penaliza seu resultado.
        </p>
      </div>

      <div class="op-Quick-stats">
        <div class="op-stat-card">
          <span class="op-stat-num">${completedCount}/${totalBlocks}</span>
          <span class="op-stat-label">Blocos Concluídos (${esc(mod.assunto)})</span>
        </div>
        <div class="op-stat-card">
          <span class="op-stat-num">${masteredCount}/${totalSkills}</span>
          <span class="op-stat-label">Habilidades Dominadas</span>
        </div>
      </div>
    </section>

    <section class="panel lib-filter-bar" style="margin-bottom:20px">
      <div class="eyebrow" style="margin-bottom:8px">Selecione a Matéria e o Assunto do Diagnóstico</div>
      <div class="ob-filter-pills" role="tablist">
        ${modules.map(m => `
          <button type="button" class="ob-filter-pill ${m.id === mod.id ? 'active' : ''}" data-diag-select-module="${esc(m.id)}">
            ${m.icone || '📘'} ${esc(m.materia)}: <strong>${esc(m.assunto)}</strong>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="panel ob-hub-modes-bar" style="margin-bottom:22px">
      <div class="ob-mode-info">
        <strong>${mod.icone || '🎯'} Diagnóstico de ${esc(mod.materia)} — ${esc(mod.assunto)}:</strong>
        <span>Siga a sequência recomendada no <strong>Diagnóstico Guiado</strong> ou escolha qualquer bloco livremente abaixo.</span>
      </div>
      <div class="ob-mode-buttons">
        <button type="button" class="primary" data-diag-guided-start="${esc(mod.id)}">
          ▶ Diagnóstico Guiado (Bloco 1 ao ${totalBlocks})
        </button>
        <button type="button" class="secondary" data-Quick-Library="${esc(mod.id)}">
          📚 Estudar ${esc(mod.assunto)} na Biblioteca
        </button>
      </div>
    </section>

    <section class="ob-hub-section">
      <div class="ob-section-head">
        <div>
          <div class="eyebrow">Escolha Livre de Blocos · ${esc(mod.assunto)}</div>
          <h2 class="section-title">Os ${totalBlocks} Blocos de Avaliação</h2>
        </div>
      </div>

      <div class="ob-hub-grid">
        ${blocksGridHtml}
      </div>
    </section>
  `);
}

function renderDiagPreBlock(mod, blockId, modState) {
  const blk = getEffectiveDiagnosticBlock(mod.id, blockId);
  if (!blk) return renderDiagnosticsArea();
  const bSt = modState.blocks[blk.id];
  const liveStatus = getBlockLiveActivityStatus(blk, bSt);
  const actMeta = getActivityMeta(liveStatus);
  const answeredCount = (blk.questoes || []).filter(q => bSt.answers?.[q.id]?.choice).length;
  const isRetake = Array.isArray(bSt.activeFilterSkillIds) && bSt.activeFilterSkillIds.length > 0;

  window.layout(`
    <div class="back-row">
      <button type="button" class="link-btn" data-diag-back-hub="1">← Voltar para os blocos de ${esc(mod.assunto)}</button>
    </div>

    <section class="panel ob-preblock-card">
      <div class="ob-preblock-top">
        <span class="ob-hub-order">${esc(mod.materia)} · ${esc(mod.assunto)} · Bloco ${blk.ordem}</span>
        <span class="op-badge ${actMeta.cls}">${actMeta.icon} ${actMeta.label}</span>
      </div>

      <h1 class="page-title">${esc(blk.titulo)}</h1>
      <p class="lede">${esc(blk.descricao)}</p>

      ${isRetake ? `
        <div class="op-Retake-banner" style="margin-top:16px">
          <span>🎯 <strong>Modo Reteste Focado:</strong> Avaliando apenas as habilidades selecionadas (${bSt.activeFilterSkillIds.join(', ')}).</span>
          <button type="button" class="link-btn" data-diag-clear-filter="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">Avaliar todas do bloco</button>
        </div>
      ` : ''}

      <div class="ob-preblock-skills">
        <h3>O que será avaliado neste bloco (${(blk.habilidades || []).length} habilidades · ${(blk.questoes || []).length} questões)</h3>
        <div class="ob-skills-checklist">
          ${(blk.habilidades || []).map(h => {
            const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, h.id);
            return `
              <div class="ob-skill-check-item" style="justify-content:space-between;align-items:center">
                <div style="display:flex;gap:10px;align-items:baseline">
                  <span class="ob-skill-code">${esc(h.id)}</span>
                  <span>${esc(h.nome)}</span>
                </div>
                <button type="button" class="link-btn" style="font-size:12px" data-open-topic="${esc(tKey)}">📖 Estudar na Biblioteca →</button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="ob-preblock-notice">
        <p>
          💡 <strong>Liberdade e transparência:</strong> Você pode consultar o resumo rápido deste bloco antes de responder às questões (sem nenhuma penalidade), pular questões que não souber e encerrar o bloco quando desejar.
        </p>
      </div>

      <div class="actions ob-preblock-actions">
        <button type="button" class="primary" data-diag-start-questions="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
          ${answeredCount > 0 && liveStatus !== 'completed' ? `Continuar diagnóstico (${answeredCount}/${blk.questoes.length})` : 'Começar diagnóstico'}
        </button>
        <button type="button" class="secondary" data-diag-open-summary="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
          📖 Ver resumo primeiro
        </button>
        ${liveStatus === 'completed' ? `
          <button type="button" class="secondary" data-diag-open-closing="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
            📊 Ver relatório deste bloco
          </button>
        ` : ''}
      </div>
    </section>
  `);
}

function renderDiagBlockSummary(mod, blockId, modState) {
  const blk = getEffectiveDiagnosticBlock(mod.id, blockId);
  if (!blk) return renderDiagnosticsArea();
  const bSt = modState.blocks[blk.id];
  bSt.summaryViewed = true;
  storageService.save();

  window.layout(`
    <div class="back-row">
      <button type="button" class="link-btn" data-diag-open-block="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">← Voltar para a apresentação do Bloco ${blk.ordem}</button>
    </div>

    <section class="panel ob-summary-card">
      <div class="ob-preblock-top">
        <span class="ob-hub-order">Resumo Pré-Bloco · ${esc(mod.assunto)} · Bloco ${blk.ordem}</span>
        <span class="op-badge mastered">Consulta livre (sem penalidade)</span>
      </div>

      <h1 class="page-title">Resumo: ${esc(blk.titulo)}</h1>
      <p class="section-copy">Revise as ideias e fórmulas essenciais abaixo antes de iniciar as questões diagnósticas.</p>

      <div class="ob-review-body">
        ${renderMarkdownSummary(blk.resumo)}
      </div>

      <div class="actions ob-summary-actions">
        <button type="button" class="primary" data-diag-start-questions="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
          Ir para as questões do Bloco ${blk.ordem} →
        </button>
        <button type="button" class="secondary" data-diag-back-hub="1">
          Voltar aos blocos
        </button>
      </div>
    </section>
  `);
}

function getActiveDiagQuestionList(blk, bSt) {
  const all = blk.questoes || [];
  if (Array.isArray(bSt.activeFilterSkillIds) && bSt.activeFilterSkillIds.length > 0) {
    const filtered = all.filter(q => bSt.activeFilterSkillIds.includes(q.habilidade));
    if (filtered.length > 0) return filtered;
  }
  return all;
}

function renderDiagBlockQuestion(mod, blockId, modState) {
  const st = storageService.getActiveState();
  const isEdit = storageService.editMode;
  const blk = getEffectiveDiagnosticBlock(mod.id, blockId);
  if (!blk) return renderDiagnosticsArea();

  const bSt = modState.blocks[blk.id];
  const questions = getActiveDiagQuestionList(blk, bSt);
  const totalQ = questions.length;
  if (totalQ === 0) return renderDiagPreBlock(mod, blockId, modState);

  let idx = typeof bSt.currentIndex === 'number' ? bSt.currentIndex : 0;
  if (idx < 0) idx = 0;
  if (idx >= totalQ) idx = totalQ - 1;
  bSt.currentIndex = idx;

  const q = questions[idx];
  const savedAns = bSt.answers?.[q.id] || { choice: null, confidence: null };
  const skillObj = (blk.habilidades || []).find(h => h.id === q.habilidade);

  const answeredInList = questions.filter(item => bSt.answers?.[item.id]?.choice).length;
  const blankInList = totalQ - answeredInList;
  const pct = Math.round(((idx + 1) / totalQ) * 100);

  const dotsHtml = questions.map((item, i) => {
    const a = bSt.answers?.[item.id];
    const hasChoice = Boolean(a && a.choice);
    const isCurrent = i === idx;
    let cls = 'ob-q-dot';
    if (isCurrent) cls += ' current';
    if (hasChoice) cls += ' answered';
    return `<button type="button" class="${cls}" data-diag-jump-q="${i}" title="Questão ${i + 1} (${hasChoice ? 'Respondida' : 'Em branco'})">${i + 1}</button>`;
  }).join('');

  const letters = ['A', 'B', 'C'];
  const optionsHtml = letters.map(letter => {
    const text = q.alternativas?.[letter] || '';
    const isSelected = savedAns.choice === letter;
    return `
      <button type="button" class="enem-option-btn ${isSelected ? 'ob-option-selected' : ''}" data-diag-select-choice="${letter}">
        <span class="ob-option-letter">${letter}</span>
        <span class="ob-option-text">${formatInlineMarkdown(text)}</span>
      </button>
    `;
  }).join('');

  const confidenceHtml = `
    <div class="ob-confidence-box ${savedAns.choice ? 'visible' : 'muted'}">
      <div class="ob-confidence-label">
        <strong>Nível de segurança nesta resposta:</strong>
        <span>(Ajuda a diferenciar domínio firme de acerto com dúvida)</span>
      </div>
      <div class="ob-confidence-buttons">
        <button type="button" class="ob-conf-btn ${savedAns.confidence === 'certeza' ? 'active-certeza' : ''}" data-diag-select-conf="certeza">
          ✓ Tenho certeza
        </button>
        <button type="button" class="ob-conf-btn ${savedAns.confidence === 'duvida' ? 'active-duvida' : ''}" data-diag-select-conf="duvida">
          ? Estou em dúvida
        </button>
      </div>
    </div>
  `;

  const modalHtml = renderDiagnosticModal(blk, bSt, questions, blankInList, st);

  window.layout(`
    <div class="ob-quiz-topbar">
      <button type="button" class="link-btn" data-diag-save-exit="1">← Sair e salvar progresso</button>
      <div class="ob-quiz-top-meta">
        <span><strong>${esc(mod.assunto)} · Bloco ${blk.ordem}:</strong> ${esc(blk.titulo)}</span>
      </div>
      <div class="ob-quiz-top-actions">
        <button type="button" class="secondary ob-btn-sm" data-diag-open-summary="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">📖 Ver Resumo</button>
        <button type="button" class="ob-action-pill ob-btn-sm" data-diag-request-skip-block="1">⏭ Pular bloco</button>
      </div>
    </div>

    <div class="ob-progress-track" aria-hidden="true">
      <div class="ob-progress-fill" style="width:${pct}%"></div>
    </div>

    <div class="ob-q-dots-bar" role="navigation" aria-label="Navegação entre questões do bloco">
      ${dotsHtml}
    </div>

    <section class="panel ob-question-panel enem-official-card">
      ${isEdit ? `
        <div class="editor-inline-toolbar" style="margin-bottom:14px">
          <span>✏️ <strong>Editor de Questão Diagnóstica:</strong></span>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="primary ob-btn-sm" data-editor-open="edit-diag-q" data-diag-module="${esc(mod.id)}" data-diag-block="${esc(blk.id)}" data-item-id="${esc(q.id)}">
              ✏️ Editar esta Questão / Imagem
            </button>
            <button type="button" class="secondary ob-btn-sm" data-editor-open="add-diag-q" data-diag-module="${esc(mod.id)}" data-diag-block="${esc(blk.id)}">
              + Nova Questão Diagnóstica neste Bloco
            </button>
            ${questions.length > 1 ? `
              <button type="button" class="ob-action-pill ob-btn-sm ob-icon-del" data-editor-delete-diag-q="${esc(q.id)}" data-diag-module="${esc(mod.id)}" data-diag-block="${esc(blk.id)}">
                🗑️ Excluir Questão
              </button>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <div class="ob-question-header">
        <div class="ob-q-head-left">
          <span class="enem-year-badge">Questão ${idx + 1} de ${totalQ}</span>
          ${skillObj ? `<span class="ob-skill-tag">${esc(skillObj.nome)}</span>` : ''}
          ${q.situacao ? `<span class="ob-situacao-pill">${esc(q.situacao)}</span>` : ''}
        </div>
        ${savedAns.choice ? `
          <button type="button" class="ob-clear-choice-btn" data-diag-clear-answer="1">✕ Limpar resposta</button>
        ` : `<span class="ob-blank-indicator">Em branco</span>`}
      </div>

      ${q.imagemUrl ? `
        <figure class="q-illustration-box">
          <img src="${esc(q.imagemUrl)}" alt="Imagem da questão" class="q-illustration-img">
        </figure>
      ` : ''}

      <div class="ob-q-title enem-q-enunciado">${formatInlineMarkdown(q.enunciado)}</div>

      <div class="enem-options-list" role="radiogroup" aria-label="Alternativas da questão">
        ${optionsHtml}
      </div>

      ${confidenceHtml}

      <div class="ob-question-footer">
        <div class="ob-nav-left">
          <button type="button" class="secondary ob-btn-sm" data-diag-prev-q="1" ${idx === 0 ? 'disabled' : ''}>
            ← Anterior
          </button>
          <button type="button" class="secondary ob-btn-sm" data-diag-skip-q="1">
            Pular / Deixar em branco →
          </button>
        </div>

        <div class="ob-nav-right">
          ${idx < totalQ - 1 ? `
            <button type="button" class="primary" data-diag-next-q="1">
              Próxima questão →
            </button>
          ` : `
            <button type="button" class="primary ob-finish-btn" data-diag-request-finish="1">
              Finalizar Bloco ${blk.ordem} ✓
            </button>
          `}
        </div>
      </div>
    </section>

    ${modalHtml}
  `);
}

function renderDiagnosticModal(blk, bSt, questions, blankInList, st) {
  if (!st.pendingModal) return '';

  if (st.pendingModal === 'confirm-finish-blanks') {
    const answeredCount = questions.length - blankInList;
    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-box">
          <div class="eyebrow">Confirmação de fechamento</div>
          <h3>Você deixou ${blankInList} ${blankInList === 1 ? 'questão em branco' : 'questões em branco'}</h3>
          <p>
            Você respondeu <strong>${answeredCount} de ${questions.length}</strong> questões neste bloco.
            Questões em branco <strong>não são tratadas como erro</strong> — as habilidades sem amostra suficiente ficarão como <em>Não avaliada</em> ou <em>Evidência insuficiente</em>.
          </p>
          <div class="actions">
            <button type="button" class="primary" data-diag-confirm-finish="1">
              Finalizar bloco mesmo assim
            </button>
            <button type="button" class="secondary" data-diag-go-first-blank="1">
              Revisar questões em branco
            </button>
            <button type="button" class="link-btn" data-diag-close-modal="1">
              Continuar respondendo
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (st.pendingModal === 'confirm-skip-block') {
    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-box">
          <div class="eyebrow">Pular bloco inteiro</div>
          <h3>Deseja pular o Bloco ${blk.ordem} (${esc(blk.titulo)})?</h3>
          <p>
            O bloco será marcado como <strong>Pulado</strong> e suas habilidades permanecerão como <strong>Não avaliada</strong>. Você pode retomá-lo quando quiser ou estudar seus tópicos direto na Biblioteca.
          </p>
          <div class="actions">
            <button type="button" class="primary" data-diag-confirm-skip-block="1">
              Confirmar e pular bloco
            </button>
            <button type="button" class="secondary" data-diag-close-modal="1">
              Voltar para a questão
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

function renderDiagBlockClosing(mod, blockId, modState) {
  const st = storageService.getActiveState();
  const blk = getEffectiveDiagnosticBlock(mod.id, blockId);
  if (!blk) return renderDiagnosticsArea();

  const bSt = modState.blocks[blk.id];
  const ev = evaluateBlock(blk, bSt);
  bSt.evaluation = ev;
  storageService.save();

  const actMeta = getActivityMeta(bSt.activityStatus);
  const nextBlk = (mod.blocos || []).find(b => b.ordem === blk.ordem + 1);

  const pendingSkills = (blk.habilidades || [])
    .filter(h => {
      const s = ev.skills[h.id]?.status;
      return s !== 'mastered';
    })
    .map(h => h.id);

  let perfSummaryHtml = '';
  if (ev.totalAnswered === 0) {
    perfSummaryHtml = `
      <div class="ob-perf-empty-notice">
        <strong>Nenhuma questão foi respondida neste bloco (${ev.totalBlank} em branco de ${ev.totalQuestions}).</strong>
        <p>Como não houve respostas, nenhuma nota foi atribuída e todas as habilidades permanecem como <strong>Não avaliada</strong>.</p>
      </div>
    `;
  } else {
    perfSummaryHtml = `
      <div class="ob-perf-metrics-row">
        <div class="ob-perf-metric">
          <span class="ob-perf-num">${ev.totalCorrect} / ${ev.totalAnswered}</span>
          <span class="ob-perf-label">Acertos nas respondidas (${ev.accuracyOnAnswered}%)</span>
        </div>
        <div class="ob-perf-metric">
          <span class="ob-perf-num">${ev.totalAnswered} de ${ev.totalQuestions}</span>
          <span class="ob-perf-label">Questões respondidas (Amostra)</span>
        </div>
        <div class="ob-perf-metric">
          <span class="ob-perf-num">${ev.totalBlank}</span>
          <span class="ob-perf-label">Deixadas em branco (não são erro)</span>
        </div>
      </div>
    `;
  }

  const skillsRowsHtml = (blk.habilidades || []).map(h => {
    const sk = ev.skills[h.id];
    const meta = getSkillStatusMeta(sk.status);
    const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, h.id);
    const inList = (st.studyList || []).find(i => i.topicKey === tKey);

    let detailText = '';
    if (sk.answered === 0) {
      detailText = `0 de ${sk.total} questões respondidas (${sk.blank} em branco).`;
    } else {
      detailText = `${sk.correct} acerto(s) em ${sk.answered} respondida(s) (de ${sk.total} do bloco).`;
      if (sk.certezaCorrect > 0) detailText += ` ${sk.certezaCorrect} com certeza.`;
      if (sk.duvidaCorrect > 0) detailText += ` ${sk.duvidaCorrect} com dúvida.`;
      if (sk.wrong > 0) detailText += ` ${sk.wrong} erro(s).`;
    }

    return `
      <div class="ob-closing-skill-card status-${sk.status}">
        <div class="ob-closing-skill-main">
          <div class="ob-closing-skill-head">
            <span class="ob-skill-code">${esc(h.id)}</span>
            <strong>${esc(h.nome)}</strong>
            <span class="op-badge ${meta.cls}">${meta.icon} ${meta.label}</span>
          </div>
          <p class="ob-closing-skill-detail">${esc(detailText)} — <em>${meta.advice}</em></p>
        </div>
        <div class="ob-closing-skill-actions">
          <button type="button" class="primary ob-btn-sm" data-open-topic="${esc(tKey)}">
            📖 Estudar na Biblioteca
          </button>
          <button type="button" class="secondary ob-btn-sm" data-lib-add-list="${esc(tKey)}">
            ${inList ? `✓ Na Minha Lista (${esc(inList.status)})` : '+ Adicionar à Minha Lista'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  window.layout(`
    <div class="back-row">
      <button type="button" class="link-btn" data-diag-back-hub="1">← Voltar para os blocos de ${esc(mod.assunto)}</button>
    </div>

    <section class="panel ob-closing-hero">
      <div class="ob-preblock-top">
        <span class="ob-hub-order">Resultado do Bloco ${blk.ordem} · ${esc(mod.assunto)}</span>
        <span class="op-badge ${actMeta.cls}">${actMeta.icon} ${actMeta.label}</span>
      </div>
      <h1 class="page-title">${esc(blk.titulo)}</h1>
      <p class="lede">
        Diagnóstico separado em 3 camadas transparentes: <strong>Atividade Realizada</strong>, <strong>Desempenho Observado</strong> e <strong>Domínio por Habilidade</strong>.
      </p>
    </section>

    <div class="ob-closing-layers">
      <section class="panel ob-layer-card">
        <div class="eyebrow">Camada 1 · Atividade Realizada</div>
        <h3>Status da Atividade: <span class="op-badge ${actMeta.cls}">${actMeta.icon} ${actMeta.label}</span></h3>
        <p class="section-copy">
          Você respondeu <strong>${ev.totalAnswered}</strong> de <strong>${ev.totalQuestions}</strong> questões deste bloco
          ${ev.totalBlank > 0 ? ` e deixou <strong>${ev.totalBlank}</strong> em branco` : ' (nenhuma em branco)'}.
          ${bSt.summaryViewed ? ' O resumo pré-bloco foi consultado antes da resolução.' : ''}
        </p>
      </section>

      <section class="panel ob-layer-card">
        <div class="eyebrow">Camada 2 · Desempenho Observado (Com Tamanho da Amostra)</div>
        <h3>Resultado nas Questões Respondidas</h3>
        ${perfSummaryHtml}
      </section>

      <section class="panel ob-layer-card">
        <div class="ob-section-head">
          <div>
            <div class="eyebrow">Camada 3 · Leitura Pedagógica por Habilidade</div>
            <h3>Classificação Individual das ${(blk.habilidades || []).length} Habilidades</h3>
          </div>
          ${pendingSkills.length > 0 ? `
            <button type="button" class="secondary ob-btn-sm" data-diag-add-all-pending="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
              + Adicionar todas as pendentes (${pendingSkills.length}) à Minha Lista
            </button>
          ` : ''}
        </div>

        <div class="ob-closing-skills-list">
          ${skillsRowsHtml}
        </div>
      </section>
    </div>

    <section class="panel ob-closing-next-bar">
      <div>
        <div class="eyebrow">Próximos passos livres</div>
        <h3>Como você prefere continuar?</h3>
      </div>
      <div class="actions">
        ${nextBlk ? `
          <button type="button" class="primary" data-diag-open-block="${esc(nextBlk.id)}" data-diag-module="${esc(mod.id)}">
            Ir para o Bloco ${nextBlk.ordem}: ${esc(nextBlk.titulo)} →
          </button>
        ` : `
          <button type="button" class="primary" data-main-nav="progression">
            📈 Ver Progressão Consolidada →
          </button>
        `}
        ${pendingSkills.length > 0 ? `
          <button type="button" class="secondary" data-diag-retake-pending="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
            ↻ Refazer apenas habilidades pendentes (${pendingSkills.length})
          </button>
        ` : ''}
        <button type="button" class="secondary" data-diag-retake-all="${esc(blk.id)}" data-diag-module="${esc(mod.id)}">
          Refazer bloco completo
        </button>
        <button type="button" class="secondary" data-main-nav="my-list">
          📌 Abrir Minha Lista (${(st.studyList || []).length})
        </button>
      </div>
    </section>
  `);
}

/* ══════════════════════════════════════════════════════════════════════════
   10. ÁREA 4: 📌 MINHA LISTA (PLANO VIVO MULTI-MATÉRIAS + REORDENAÇÃO)
   ══════════════════════════════════════════════════════════════════════════ */
function renderMyListArea() {
  const st = storageService.getActiveState();
  const list = st.studyList || [];
  const filterStatus = st.listFilterStatus || 'all';
  const filterMat = st.listFilterMateria || 'all';

  const filteredList = list.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterMat !== 'all' && item.materiaId !== filterMat) return false;
    return true;
  });

  // Opções para adicionar manualmente qualquer habilidade de qualquer matéria
  const modules = getAllModules();
  const allSkillOptions = [];
  modules.forEach(mod => {
    (mod.blocos || []).forEach(blk => {
      (blk.habilidades || []).forEach(hab => {
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        allSkillOptions.push({
          topicKey: tKey,
          label: `[${mod.materia} · ${mod.assunto}] Bloco ${blk.ordem} (${hab.id}) — ${hab.nome}`
        });
      });
    });
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
    const prioCls = item.priority === 'Alta' ? 'study' : item.priority === 'Média' ? 'partial' : 'neutral';
    const statusCls = item.status === 'Concluído' ? 'mastered' : item.status === 'Em andamento' ? 'partial' : item.status === 'Revisar' ? 'insufficient' : 'study';

    return `
      <article class="panel ob-study-item status-${statusCls}">
        <div class="ob-study-item-left">
          <div class="ob-study-item-badges">
            <span class="op-badge ${prioCls}">Prioridade ${esc(item.priority)}</span>
            <span class="op-badge ${statusCls}">${esc(item.status)}</span>
            <span class="ob-origin-tag">Origem: ${esc(item.origin)}</span>
          </div>
          <h3 class="ob-study-item-title">${esc(item.title)}</h3>
          <p class="ob-study-item-sub">${esc(item.subtitle)}</p>

          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="primary ob-btn-sm" data-open-topic="${esc(item.topicKey)}">
              📖 Ir para o Estudo (Resumo, Vídeos e Questões ENEM) →
            </button>
          </div>
        </div>

        <div class="ob-study-item-controls">
          <label class="ob-ctrl-label">
            Status
            <select class="ob-select" data-list-status-id="${esc(item.id)}">
              <option value="A estudar" ${item.status === 'A estudar' ? 'selected' : ''}>A estudar</option>
              <option value="Em andamento" ${item.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
              <option value="Revisar" ${item.status === 'Revisar' ? 'selected' : ''}>Revisar</option>
              <option value="Concluído" ${item.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
            </select>
          </label>

          <label class="ob-ctrl-label">
            Prioridade
            <select class="ob-select" data-list-prio-id="${esc(item.id)}">
              <option value="Alta" ${item.priority === 'Alta' ? 'selected' : ''}>Alta</option>
              <option value="Média" ${item.priority === 'Média' ? 'selected' : ''}>Média</option>
              <option value="Baixa" ${item.priority === 'Baixa' ? 'selected' : ''}>Baixa</option>
            </select>
          </label>

          <div class="ob-item-icon-btns">
            <button type="button" class="ob-icon-btn" data-list-move-up="${esc(item.id)}" ${realIndex <= 0 ? 'disabled' : ''} title="Subir item">↑</button>
            <button type="button" class="ob-icon-btn" data-list-move-down="${esc(item.id)}" ${realIndex >= list.length - 1 ? 'disabled' : ''} title="Descer item">↓</button>
            <button type="button" class="ob-icon-btn ob-icon-del" data-list-delete="${esc(item.id)}" title="Remover da lista">✕</button>
          </div>
        </div>
      </article>
    `;
  }).join('') : `
    <div class="panel empty">
      <h3 style="margin:0 0 8px;color:var(--ink)">Nenhum item encontrado neste filtro</h3>
      <p style="margin:0 auto 16px;max-width:480px">
        Adicione habilidades manualmente abaixo, explore a <strong>Biblioteca de Estudos</strong> ou realize um <strong>Diagnóstico</strong> para receber recomendações automáticas.
      </p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button type="button" class="primary" data-main-nav="library">📚 Explorar Biblioteca de Estudos</button>
        <button type="button" class="secondary" data-main-nav="diagnostics">🎯 Fazer um Diagnóstico</button>
      </div>
    </div>
  `;

  window.layout(`
    <section class="op-hero" style="padding-bottom:14px">
      <div>
        <div class="eyebrow">Organização Flexível da Rotina · Persistência Local Automática</div>
        <h1 class="page-title">Minha Lista de Estudos</h1>
        <p class="lede">
          Combine as recomendações dos seus diagnósticos com os tópicos escolhidos livremente na Biblioteca. Altere prioridades, reordene sua fila e clique em <strong>Ir para o Estudo</strong> para abrir direto o material completo.
        </p>
      </div>
    </section>

    <section class="panel ob-study-toolbar">
      <div class="lib-filters-group" style="width:100%">
        <div class="ob-filter-pills" role="tablist" aria-label="Filtrar por Status">
          ${['all', 'A estudar', 'Em andamento', 'Revisar', 'Concluído'].map(f => `
            <button type="button" class="ob-filter-pill ${filterStatus === f ? 'active' : ''}" data-list-filter-status="${f}">
              ${f === 'all' ? 'Todos os Status' : f} (${counts[f] || 0})
            </button>
          `).join('')}
        </div>

        <div class="ob-filter-pills" style="margin-top:8px" role="tablist" aria-label="Filtrar por Matéria">
          <button type="button" class="ob-filter-pill ${filterMat === 'all' ? 'active' : ''}" data-list-filter-mat="all">Todas as Matérias</button>
          <button type="button" class="ob-filter-pill ${filterMat === 'fisica' ? 'active' : ''}" data-list-filter-mat="fisica">⚡ Física</button>
          <button type="button" class="ob-filter-pill ${filterMat === 'matematica' ? 'active' : ''}" data-list-filter-mat="matematica">📐 Matemática</button>
          <button type="button" class="ob-filter-pill ${filterMat === 'quimica' ? 'active' : ''}" data-list-filter-mat="quimica">🧪 Química</button>
        </div>
      </div>

      <div class="ob-manual-add-box" style="width:100%;margin-top:10px;padding-top:12px;border-top:1px solid var(--line)">
        <select id="ob-manual-topic-select" class="ob-select" style="flex:1">
          <option value="">+ Escolher qualquer tópico/habilidade para adicionar à Minha Lista...</option>
          ${allSkillOptions.map(opt => `<option value="${esc(opt.topicKey)}">${esc(opt.label)}</option>`).join('')}
        </select>
        <button type="button" class="primary ob-btn-sm" data-list-manual-add="1">Adicionar à Minha Lista</button>
      </div>
    </section>

    <section class="ob-study-list-container" style="margin-bottom:40px">
      ${itemsHtml}
    </section>
  `);
}

/* ══════════════════════════════════════════════════════════════════════════
   11. ÁREA 5: 📈 PROGRESSÃO (EVOLUÇÃO REAL EM 3 CAMADAS SEPARADAS)
   ══════════════════════════════════════════════════════════════════════════ */
function renderProgressionArea() {
  const st = storageService.getActiveState();
  const modules = getAllModules();
  const filterMat = st.progFilterMateria || 'all';

  const visibleModules = modules.filter(m => filterMat === 'all' || m.materiaId === filterMat);

  // Calcula métricas consolidadas das 3 camadas nos módulos visíveis
  let totalBlocks = 0;
  let completedBlocks = 0;
  let inProgressBlocks = 0;
  let skippedBlocks = 0;

  let totalDiagAnswered = 0;
  let totalDiagQuestions = 0;
  let totalDiagCorrect = 0;
  let totalEnemAnswered = 0;
  let totalEnemCorrect = 0;

  const skillCounts = {
    mastered: 0,
    partial: 0,
    study: 0,
    insufficient: 0,
    not_assessed: 0,
    total: 0
  };

  visibleModules.forEach(mod => {
    const modDiag = storageService.ensureModuleDiagState(st, mod.id);
    (mod.blocos || []).forEach(rawBlk => {
      totalBlocks++;
      const blk = getEffectiveDiagnosticBlock(mod.id, rawBlk.id);
      const bSt = modDiag.blocks[blk.id];
      const liveStatus = getBlockLiveActivityStatus(blk, bSt);
      if (liveStatus === 'completed') completedBlocks++;
      else if (liveStatus === 'in_progress') inProgressBlocks++;
      else if (liveStatus === 'skipped') skippedBlocks++;

      const ev = evaluateBlock(blk, bSt);
      totalDiagQuestions += ev.totalQuestions;
      totalDiagAnswered += ev.totalAnswered;
      totalDiagCorrect += ev.totalCorrect;

      (blk.habilidades || []).forEach(hab => {
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const cSt = getSkillConsolidatedStatus(tKey);
        skillCounts.total++;
        skillCounts[cSt.status] = (skillCounts[cSt.status] || 0) + 1;

        const tProg = st.topicProgress?.[tKey];
        if (tProg && tProg.enemAnswers) {
          const effT = getEffectiveTopicData(tKey);
          (effT?.questoesEnem || []).forEach(eq => {
            const ans = tProg.enemAnswers[eq.id];
            if (ans && ans.checked && ans.selected) {
              totalEnemAnswered++;
              if (ans.selected === eq.correta) totalEnemCorrect++;
            }
          });
        }
      });
    });
  });

  const completedTopicsInList = (st.studyList || []).filter(i => i.status === 'Concluído' && (filterMat === 'all' || i.materiaId === filterMat)).length;
  const totalSampleAnswered = totalDiagAnswered + totalEnemAnswered;
  const totalSampleCorrect = totalDiagCorrect + totalEnemCorrect;
  const overallAcc = totalSampleAnswered > 0 ? Math.round((totalSampleCorrect / totalSampleAnswered) * 100) : null;

  if (!st.openAccordions) st.openAccordions = {};

  const modulesBreakdownHtml = visibleModules.map(mod => {
    const modDiag = storageService.ensureModuleDiagState(st, mod.id);
    let modSkillsTotal = 0;
    let modMastered = 0;
    let modAnsweredQ = 0;
    let modTotalQ = 0;
    let modCorrectQ = 0;

    const blocksAccHtml = (mod.blocos || []).map(rawBlk => {
      const blk = getEffectiveDiagnosticBlock(mod.id, rawBlk.id);
      const bSt = modDiag.blocks[blk.id];
      const ev = evaluateBlock(blk, bSt);
      modTotalQ += ev.totalQuestions;
      modAnsweredQ += ev.totalAnswered;
      modCorrectQ += ev.totalCorrect;

      let blkMastered = 0;
      const blkSkills = blk.habilidades || [];

      const skillRowsHtml = blkSkills.map(hab => {
        modSkillsTotal++;
        const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
        const cSt = getSkillConsolidatedStatus(tKey);
        if (cSt.status === 'mastered') {
          modMastered++;
          blkMastered++;
        }

        let humanExplanation = '';
        if (cSt.status === 'mastered') {
          humanExplanation = cSt.confirmedMastery
            ? 'Domínio confirmado pela resolução de questões ENEM e autoavaliação no tópico.'
            : 'Domínio demonstrado com segurança nas questões avaliadas. Mantenha revisões espaçadas.';
        } else if (cSt.status === 'partial') {
          humanExplanation = 'Em evolução: você já acerta parte das questões ou acertou com dúvida. Pratique mais questões ENEM para firmar.';
        } else if (cSt.status === 'study') {
          humanExplanation = 'Prioridade de estudo: revise o resumo didático e as videoaulas antes de tentar novamente.';
        } else if (cSt.status === 'insufficient') {
          humanExplanation = 'Amostra pequena até agora: responda mais questões diagnósticas ou do ENEM para consolidar.';
        } else {
          humanExplanation = 'Ainda não avaliada: estude livremente na Biblioteca ou faça o diagnóstico do bloco.';
        }

        return `
          <div class="prog-skill-row">
            <div class="prog-skill-info">
              <div class="prog-skill-top">
                <span class="ob-skill-code">${esc(hab.id)}</span>
                <strong>${esc(hab.nome)}</strong>
                <span class="op-badge ${cSt.status}">${esc(cSt.label)}</span>
              </div>
              <div class="prog-skill-meta">
                <span>📊 <strong>Amostra observada:</strong> ${esc(cSt.sampleText)}</span>
                <span>💡 ${esc(humanExplanation)}</span>
              </div>
            </div>
            <div class="prog-skill-actions">
              <button type="button" class="primary ob-btn-sm" data-open-topic="${esc(tKey)}">
                📖 Estudar Tópico
              </button>
              <button type="button" class="secondary ob-btn-sm" data-open-topic-practice="${esc(tKey)}">
                📝 Praticar ENEM
              </button>
            </div>
          </div>
        `;
      }).join('');

      const progBlkAccId = `prog_blk_${mod.id}_${blk.id}`;
      const isProgBlkOpen = st.openAccordions[progBlkAccId] === true;

      return `
        <details class="clean-accordion lib-block-accordion" data-acc-id="${esc(progBlkAccId)}" ${isProgBlkOpen ? 'open' : ''}>
          <summary class="clean-accordion-summary lib-block-summary">
            <div class="clean-acc-left">
              <span class="ob-hub-order">Bloco ${blk.ordem}</span>
              <div class="clean-acc-titles">
                <strong class="lib-block-title">${esc(blk.titulo)}</strong>
                <small class="clean-acc-sub">${blkMastered} de ${blkSkills.length} habilidades dominadas · Clique para abrir</small>
              </div>
            </div>
            <div class="clean-acc-right">
              <span class="acc-chevron" aria-hidden="true">⌄</span>
            </div>
          </summary>
          <div class="clean-accordion-body lib-block-body">
            <div class="prog-skills-table">
              ${skillRowsHtml}
            </div>
          </div>
        </details>
      `;
    }).join('');

    const pctMastered = modSkillsTotal > 0 ? Math.round((modMastered / modSkillsTotal) * 100) : 0;
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
                <strong>${modMastered} de ${modSkillsTotal}</strong> habilidades dominadas (${pctMastered}%) ·
                Amostra no diagnóstico: ${modAnsweredQ} de ${modTotalQ} questões respondidas
              </small>
            </div>
          </div>
          <div class="clean-acc-right">
            <span class="acc-hint-label">Expandir</span>
            <span class="acc-chevron" aria-hidden="true">⌄</span>
          </div>
        </summary>

        <div class="clean-accordion-body lib-module-body">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">
            <span style="font-size:13px;color:var(--muted)">Clique em qualquer bloco abaixo para abrir ou recolher suas habilidades:</span>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="secondary ob-btn-sm" data-Quick-Library="${esc(mod.id)}">📚 Abrir na Biblioteca</button>
              <button type="button" class="secondary ob-btn-sm" data-Quick-Diag="${esc(mod.id)}">🎯 Ir ao Diagnóstico</button>
            </div>
          </div>

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
        <div class="eyebrow">Transparência Pedagógica · Separação Rigorosa em 3 Camadas</div>
        <h1 class="page-title">Progressão e Domínio Real</h1>
        <p class="lede">
          Acompanhe sua evolução sem confundir <strong>quantidade de atividades feitas</strong> com <strong>desempenho nas questões respondidas</strong> e <strong>domínio real de cada habilidade</strong>.
        </p>
      </div>
    </section>

    <section class="panel lib-filter-bar" style="margin-bottom:20px">
      <div class="ob-filter-pills" role="tablist" aria-label="Filtrar Progressão por Matéria">
        <button type="button" class="ob-filter-pill ${filterMat === 'all' ? 'active' : ''}" data-prog-filter-mat="all">Todas as Matérias</button>
        <button type="button" class="ob-filter-pill ${filterMat === 'fisica' ? 'active' : ''}" data-prog-filter-mat="fisica">⚡ Física</button>
        <button type="button" class="ob-filter-pill ${filterMat === 'matematica' ? 'active' : ''}" data-prog-filter-mat="matematica">📐 Matemática</button>
        <button type="button" class="ob-filter-pill ${filterMat === 'quimica' ? 'active' : ''}" data-prog-filter-mat="quimica">🧪 Química</button>
      </div>
    </section>

    <div class="ob-closing-layers" style="margin-bottom:26px">
      <section class="panel ob-layer-card">
        <div class="eyebrow">1. Progresso de Estudo (Atividade Feita)</div>
        <h3>O que você já percorreu na plataforma</h3>
        <div class="ob-perf-metrics-row">
          <div class="ob-perf-metric">
            <span class="ob-perf-num">${completedBlocks} / ${totalBlocks}</span>
            <span class="ob-perf-label">Blocos Diagnósticos Concluídos</span>
          </div>
          <div class="ob-perf-metric">
            <span class="ob-perf-num">${inProgressBlocks}</span>
            <span class="ob-perf-label">Blocos em Andamento (${skippedBlocks} pulados)</span>
          </div>
          <div class="ob-perf-metric">
            <span class="ob-perf-num">${completedTopicsInList}</span>
            <span class="ob-perf-label">Tópicos Concluídos na Minha Lista</span>
          </div>
        </div>
      </section>

      <section class="panel ob-layer-card">
        <div class="eyebrow">2. Desempenho Observado (Sempre com Tamanho da Amostra)</div>
        <h3>Taxa de acerto nas questões efetivamente respondidas</h3>
        <div class="ob-perf-metrics-row">
          <div class="ob-perf-metric">
            <span class="ob-perf-num">${overallAcc !== null ? `${overallAcc}%` : '—'}</span>
            <span class="ob-perf-label">Aproveitamento Geral (${totalSampleCorrect} acertos em ${totalSampleAnswered} respondidas)</span>
          </div>
          <div class="ob-perf-metric">
            <span class="ob-perf-num">${totalDiagAnswered} de ${totalDiagQuestions}</span>
            <span class="ob-perf-label">Questões Diagnósticas Respondidas (${totalDiagCorrect} acertos)</span>
          </div>
          <div class="ob-perf-metric">
            <span class="ob-perf-num">${totalEnemAnswered}</span>
            <span class="ob-perf-label">Questões Oficiais do ENEM Respondidas (${totalEnemCorrect} acertos)</span>
          </div>
        </div>
      </section>

      <section class="panel ob-layer-card">
        <div class="eyebrow">3. Nível de Domínio por Habilidade (${skillCounts.total} habilidades mapeadas)</div>
        <h3>Situação consolidada das suas habilidades</h3>
        <div class="ob-perf-metrics-row" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
          <div class="ob-perf-metric">
            <span class="ob-perf-num" style="color:var(--accent)">${skillCounts.mastered}</span>
            <span class="ob-perf-label">✓ Dominadas</span>
          </div>
          <div class="ob-perf-metric">
            <span class="ob-perf-num" style="color:var(--gold)">${skillCounts.partial}</span>
            <span class="ob-perf-label">◐ Em evolução (Parcial)</span>
          </div>
          <div class="ob-perf-metric">
            <span class="ob-perf-num" style="color:var(--warm)">${skillCounts.study}</span>
            <span class="ob-perf-label">! Precisam estudar</span>
          </div>
          <div class="ob-perf-metric">
            <span class="ob-perf-num">${skillCounts.insufficient}</span>
            <span class="ob-perf-label">… Inconclusivas (amostra pequena)</span>
          </div>
          <div class="ob-perf-metric">
            <span class="ob-perf-num" style="color:var(--muted)">${skillCounts.not_assessed}</span>
            <span class="ob-perf-label">○ Não avaliadas</span>
          </div>
        </div>
      </section>
    </div>

    <div class="prog-modules-stack" style="display:grid;gap:22px;margin-bottom:40px">
      ${modulesBreakdownHtml}
    </div>
  `);
}


/* ══════════════════════════════════════════════════════════════════════════
   12. MODAIS DE PERFIL, ONBOARDING, BACKUP JSON E MODO EDITOR VISUAL IN-APP
   ══════════════════════════════════════════════════════════════════════════ */
function renderOnboardingModal(isFirstSetup) {
  return `
    <div class="ob-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ob-welcome-title">
      <div class="panel ob-modal-box ob-welcome-modal">
        <div class="eyebrow">${isFirstSetup ? 'Boas-vindas à Plataforma ENEM' : 'Novo Perfil Local'}</div>
        <h2 id="ob-welcome-title" style="margin:6px 0 8px;font-family:var(--serif);font-size:28px">
          ${isFirstSetup ? 'Vamos configurar seu espaço de estudos?' : 'Criar outro perfil neste navegador'}
        </h2>
        <p style="margin:0 0 18px;color:var(--muted);line-height:1.55">
          Seus diagnósticos, itens da Minha Lista, respostas de questões ENEM e edições personalizadas ficam salvos localmente neste navegador (compatível com GitHub Pages).
        </p>

        <div class="ob-form-grid">
          <label class="ob-form-field">
            <span>Seu nome *</span>
            <input type="text" id="ob-prof-name" class="ob-input" placeholder="Ex.: Rafaela" value="${isFirstSetup ? 'Rafaela' : ''}" autofocus>
          </label>

          <label class="ob-form-field">
            <span>Foco atual / Curso ou Meta no ENEM (opcional)</span>
            <input type="text" id="ob-prof-goal" class="ob-input" placeholder="Ex.: Focar em Natureza e Matemática">
          </label>

          <div class="ob-form-field">
            <span>Ritmo de sessão preferido</span>
            <div class="ob-pace-options" id="ob-pace-group">
              <label class="ob-pace-card">
                <input type="radio" name="ob-prof-pace" value="curto">
                <strong>Curto</strong>
                <small>10–15 min</small>
              </label>
              <label class="ob-pace-card">
                <input type="radio" name="ob-prof-pace" value="medio" checked>
                <strong>Médio</strong>
                <small>25–30 min</small>
              </label>
              <label class="ob-pace-card">
                <input type="radio" name="ob-prof-pace" value="livre">
                <strong>Livre</strong>
                <small>Sem tempo fixo</small>
              </label>
            </div>
          </div>
        </div>

        <div class="actions" style="margin-top:22px">
          <button type="button" class="primary" data-profile-action="save-new-profile">
            ${isFirstSetup ? 'Entrar na Plataforma →' : 'Criar e ativar perfil'}
          </button>
          ${!isFirstSetup ? `
            <button type="button" class="secondary" data-profile-action="close-top-modal">Cancelar</button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderProfileSwitcherModal() {
  const profiles = storageService.getProfiles();
  const active = storageService.getActiveProfile();

  const rowsHtml = profiles.map(p => {
    const isAct = active && active.id === p.id;
    const st = storageService.data.statesByProfile[p.id];
    const listCount = st?.studyList?.length || 0;
    return `
      <div class="ob-prof-row ${isAct ? 'active' : ''}">
        <div>
          <strong>${esc(p.name)}</strong> ${isAct ? '<span class="op-badge mastered">Ativo</span>' : ''}
          <div style="font-size:12px;color:var(--muted);margin-top:3px">
            ${esc(p.goal || 'Sem meta definida')} · Ritmo: ${getPaceLabel(p.pace)} · ${listCount} itens na Minha Lista
          </div>
        </div>
        <div>
          ${!isAct ? `
            <button type="button" class="primary ob-btn-sm" data-profile-switch-id="${esc(p.id)}">Alternar para ${esc(p.name)}</button>
          ` : `<span style="font-size:12px;color:var(--accent);font-weight:700">Em uso</span>`}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="ob-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ob-switch-title">
      <div class="panel ob-modal-box">
        <div class="eyebrow">Perfis Locais (Para 2 ou mais usuários)</div>
        <h3 id="ob-switch-title">Alternar ou Gerenciar Perfil</h3>
        <p>Cada perfil mantém seu próprio histórico de diagnóstico, questões ENEM e Minha Lista sem misturar os dados.</p>

        <div class="ob-prof-list">
          ${rowsHtml}
        </div>

        ${active ? `
          <details class="ob-edit-profile-details">
            <summary>Editar dados do perfil atual (${esc(active.name)})</summary>
            <div class="ob-form-grid" style="margin-top:12px">
              <label class="ob-form-field">
                <span>Nome</span>
                <input type="text" id="ob-edit-prof-name" class="ob-input" value="${esc(active.name)}">
              </label>
              <label class="ob-form-field">
                <span>Meta / Foco no ENEM</span>
                <input type="text" id="ob-edit-prof-goal" class="ob-input" value="${esc(active.goal || '')}">
              </label>
              <label class="ob-form-field">
                <span>Ritmo preferido</span>
                <select id="ob-edit-prof-pace" class="ob-select">
                  <option value="curto" ${active.pace === 'curto' ? 'selected' : ''}>Curto (10-15 min)</option>
                  <option value="medio" ${active.pace === 'medio' ? 'selected' : ''}>Médio (25-30 min)</option>
                  <option value="livre" ${active.pace === 'livre' ? 'selected' : ''}>Livre</option>
                </select>
              </label>
              <button type="button" class="secondary ob-btn-sm" data-profile-action="update-current-profile">Salvar alterações do perfil</button>
            </div>
          </details>
        ` : ''}

        <div class="actions" style="margin-top:20px;justify-content:space-between">
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button type="button" class="secondary" data-profile-action="open-new-profile">+ Adicionar outro perfil</button>
            <button type="button" class="secondary" data-profile-action="open-backup">💾 Backup JSON</button>
          </div>
          <button type="button" class="primary" data-profile-action="close-top-modal">Fechar</button>
        </div>
      </div>
    </div>
  `;
}

function renderBackupModal() {
  return `
    <div class="ob-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ob-backup-title">
      <div class="panel ob-modal-box">
        <div class="eyebrow">Portabilidade e Segurança · GitHub Pages</div>
        <h3 id="ob-backup-title">Backup de Dados (Exportar / Importar JSON)</h3>
        <p>
          Exporte um arquivo <code>.json</code> contendo todos os perfis locais, respostas dos diagnósticos, Minha Lista e todas as videoaulas, sites, imagens e questões adicionadas no <strong>Modo Edição</strong>.
        </p>

        <div class="ob-backup-cards">
          <div class="ob-backup-card">
            <h4>⬇ Exportar progresso e edições</h4>
            <p>Baixa um arquivo <code>backup-enem-estudos.json</code> para o seu computador.</p>
            <button type="button" class="primary ob-btn-sm" data-profile-action="download-json">
              Baixar arquivo .JSON
            </button>
          </div>

          <div class="ob-backup-card">
            <h4>⬆ Importar progresso (.JSON)</h4>
            <p>Carregue um arquivo <code>.json</code> exportado anteriormente para restaurar perfis, listas e edições.</p>
            <input type="file" id="ob-import-file-input" accept=".json,application/json" style="font-size:12px;margin-bottom:10px;max-width:100%">
            <button type="button" class="secondary ob-btn-sm" data-profile-action="upload-json">
              Restaurar do arquivo selecionado
            </button>
          </div>
        </div>

        <div class="actions" style="margin-top:20px">
          <button type="button" class="secondary" data-profile-action="close-top-modal">Fechar</button>
        </div>
      </div>
    </div>
  `;
}

function renderInAppEditorModal(cfg) {
  if (!cfg || !cfg.type) return '';

  /* 1. EDITAR TÓPICO, RESUMO DIDÁTICO E IMAGEM ILUSTRATIVA */
  if (cfg.type === 'edit-topic') {
    const eff = getEffectiveTopicData(cfg.topicKey);
    if (!eff) return '';
    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-box editor-modal-wide">
          <div class="eyebrow">✏️ Modo Editor Visual · Chave Isolada: ${esc(eff.topicKey)}</div>
          <h3>Editar Tópico, Resumo e Imagem Ilustrativa</h3>
          <div class="ob-form-grid">
            <label class="ob-form-field">
              <span>Título da Habilidade / Tópico *</span>
              <input type="text" id="ed-topic-title" class="ob-input" value="${esc(eff.titulo)}">
            </label>
            <label class="ob-form-field">
              <span>Resumo do Foco Direto na Habilidade *</span>
              <textarea id="ed-topic-foco" class="ob-input" rows="2">${esc(eff.foco)}</textarea>
            </label>
            <label class="ob-form-field">
              <span>Imagem Ilustrativa no Resumo (URL da imagem ou Base64 abaixo)</span>
              <input type="text" id="ed-topic-img-url" class="ob-input" placeholder="Cole a URL de uma imagem (https://...) ou envie um arquivo abaixo" value="${esc(eff.resumoImage || '')}">
            </label>
            <label class="ob-form-field">
              <span>Ou enviar imagem do computador (converte automaticamente para Base64 local)</span>
              <input type="file" id="ed-topic-img-file" accept="image/*" class="ob-input">
            </label>
            <label class="ob-form-field">
              <span>Texto do Resumo Didático (suporta títulos ##, listas - e negrito **)</span>
              <textarea id="ed-topic-resumo" class="ob-input" rows="10" style="font-family:monospace;font-size:13px">${esc(eff.resumo)}</textarea>
            </label>
          </div>
          <div class="actions" style="margin-top:18px">
            <button type="button" class="primary" data-editor-save="edit-topic" data-topic-key="${esc(eff.topicKey)}">💾 Salvar Alterações</button>
            <button type="button" class="secondary" data-editor-close="1">Cancelar</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 2. ADICIONAR OU EDITAR VIDEOAULA (ISOLADA POR TOPICKEY) */
  if (cfg.type === 'add-video' || cfg.type === 'edit-video') {
    const eff = getEffectiveTopicData(cfg.topicKey);
    if (!eff) return '';
    const existing = cfg.type === 'edit-video'
      ? eff.videos.find(v => (v.id || v.url) === cfg.itemId)
      : null;

    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-box">
          <div class="eyebrow">🎬 Videoaula Isolada · ${esc(eff.topicKey)}</div>
          <h3>${existing ? 'Editar Videoaula' : 'Adicionar Videoaula neste Tópico'}</h3>
          <p style="font-size:13px;color:var(--muted)">
            Esta videoaula ficará vinculada <strong>exclusivamente</strong> à habilidade <strong>${esc(eff.hab.id)} (${esc(eff.titulo)})</strong> e nunca vazará para outros blocos.
          </p>
          <div class="ob-form-grid">
            <label class="ob-form-field">
              <span>Título da Videoaula *</span>
              <input type="text" id="ed-vid-title" class="ob-input" placeholder="Ex.: Lentes Esféricas — Equação de Gauss e Aumento Linear" value="${esc(existing?.titulo || '')}">
            </label>
            <label class="ob-form-field">
              <span>Canal ou Professor *</span>
              <input type="text" id="ed-vid-canal" class="ob-input" placeholder="Ex.: Prof. Boaro / Ciência Todo Dia / Ferretto" value="${esc(existing?.canal || '')}">
            </label>
            <label class="ob-form-field">
              <span>Link Direto do Vídeo no YouTube * (Ex: https://www.youtube.com/watch?v=...)</span>
              <input type="url" id="ed-vid-url" class="ob-input" placeholder="https://www.youtube.com/watch?v=..." value="${esc(existing?.url || '')}">
            </label>
            <label class="ob-form-field">
              <span>Observação / O que focar na aula (opcional)</span>
              <input type="text" id="ed-vid-nota" class="ob-input" placeholder="Ex.: Excelente explicação sobre convenção de sinais" value="${esc(existing?.nota || existing?.objetivo || '')}">
            </label>
          </div>
          <div class="actions" style="margin-top:18px">
            <button type="button" class="primary" data-editor-save="${cfg.type}" data-topic-key="${esc(eff.topicKey)}" data-item-id="${esc(cfg.itemId || '')}">
              💾 Salvar Videoaula
            </button>
            <button type="button" class="secondary" data-editor-close="1">Cancelar</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 3. ADICIONAR OU EDITAR SITE BRASILEIRO (ISOLADO POR TOPICKEY) */
  if (cfg.type === 'add-site' || cfg.type === 'edit-site') {
    const eff = getEffectiveTopicData(cfg.topicKey);
    if (!eff) return '';
    const existing = cfg.type === 'edit-site'
      ? eff.sites.find(s => (s.id || s.url) === cfg.itemId)
      : null;

    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-box">
          <div class="eyebrow">🌐 Site Educacional · ${esc(eff.topicKey)}</div>
          <h3>${existing ? 'Editar Site / Leitura' : 'Adicionar Site / Leitura Complementar'}</h3>
          <div class="ob-form-grid">
            <label class="ob-form-field">
              <span>Título do Artigo ou Página *</span>
              <input type="text" id="ed-site-title" class="ob-input" placeholder="Ex.: Juros Compostos: fórmula e exemplos" value="${esc(existing?.titulo || '')}">
            </label>
            <label class="ob-form-field">
              <span>Nome do Portal Brasileiro *</span>
              <input type="text" id="ed-site-portal" class="ob-input" placeholder="Ex.: Toda Matéria, Mundo Educação, Brasil Escola, Manual da Química" value="${esc(existing?.portal || existing?.fonte || 'Toda Matéria')}">
            </label>
            <label class="ob-form-field">
              <span>URL Direta do Artigo *</span>
              <input type="url" id="ed-site-url" class="ob-input" placeholder="https://www.todamateria.com.br/..." value="${esc(existing?.url || '')}">
            </label>
            <label class="ob-form-field">
              <span>Resumo do que a estudante vai revisar neste link *</span>
              <input type="text" id="ed-site-resumo" class="ob-input" placeholder="Ex.: Dedução da fórmula e exemplos passo a passo" value="${esc(existing?.resumo || existing?.objetivo || '')}">
            </label>
          </div>
          <div class="actions" style="margin-top:18px">
            <button type="button" class="primary" data-editor-save="${cfg.type}" data-topic-key="${esc(eff.topicKey)}" data-item-id="${esc(cfg.itemId || '')}">
              💾 Salvar Site
            </button>
            <button type="button" class="secondary" data-editor-close="1">Cancelar</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 4. ADICIONAR OU EDITAR QUESTÃO OFICIAL DO ENEM (5 ALTERNATIVAS A–E + IMAGEM + RESOLUÇÃO) */
  if (cfg.type === 'add-enem-q' || cfg.type === 'edit-enem-q') {
    const eff = getEffectiveTopicData(cfg.topicKey);
    if (!eff) return '';
    const existing = cfg.type === 'edit-enem-q'
      ? eff.questoesEnem.find(q => q.id === cfg.itemId)
      : null;

    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-box editor-modal-wide">
          <div class="eyebrow">📝 Questão Oficial do ENEM · ${esc(eff.topicKey)}</div>
          <h3>${existing ? 'Editar Questão do ENEM' : 'Adicionar Nova Questão do ENEM (A–E)'}</h3>
          <div class="ob-form-grid">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label class="ob-form-field">
                <span>Edição / Ano do ENEM *</span>
                <input type="text" id="ed-enem-ano" class="ob-input" placeholder="Ex.: ENEM 2023" value="${esc(existing?.ano || 'ENEM 2023')}">
              </label>
              <label class="ob-form-field">
                <span>Contexto / Tema da Questão</span>
                <input type="text" id="ed-enem-ctx" class="ob-input" placeholder="Ex.: Correção da miopia com lentes divergentes" value="${esc(existing?.contexto || '')}">
              </label>
            </div>

            <label class="ob-form-field">
              <span>Enunciado Completo da Questão *</span>
              <textarea id="ed-enem-enunc" class="ob-input" rows="4">${esc(existing?.enunciado || '')}</textarea>
            </label>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label class="ob-form-field">
                <span>Imagem na Questão (URL ou Base64)</span>
                <input type="text" id="ed-enem-img-url" class="ob-input" placeholder="URL da imagem ou envie arquivo ao lado" value="${esc(existing?.imagemUrl || '')}">
              </label>
              <label class="ob-form-field">
                <span>Ou enviar imagem do computador</span>
                <input type="file" id="ed-enem-img-file" accept="image/*" class="ob-input">
              </label>
            </div>

            <div class="ob-form-grid" style="gap:8px">
              <label class="ob-form-field"><span>Alternativa A *</span><input type="text" id="ed-enem-alt-A" class="ob-input" value="${esc(existing?.alternativas?.A || '')}"></label>
              <label class="ob-form-field"><span>Alternativa B *</span><input type="text" id="ed-enem-alt-B" class="ob-input" value="${esc(existing?.alternativas?.B || '')}"></label>
              <label class="ob-form-field"><span>Alternativa C *</span><input type="text" id="ed-enem-alt-C" class="ob-input" value="${esc(existing?.alternativas?.C || '')}"></label>
              <label class="ob-form-field"><span>Alternativa D *</span><input type="text" id="ed-enem-alt-D" class="ob-input" value="${esc(existing?.alternativas?.D || '')}"></label>
              <label class="ob-form-field"><span>Alternativa E *</span><input type="text" id="ed-enem-alt-E" class="ob-input" value="${esc(existing?.alternativas?.E || '')}"></label>
            </div>

            <label class="ob-form-field">
              <span>Gabarito Oficial (Alternativa Correta) *</span>
              <select id="ed-enem-correta" class="ob-select">
                ${['A', 'B', 'C', 'D', 'E'].map(l => `<option value="${l}" ${(existing?.correta || 'A') === l ? 'selected' : ''}>Alternativa ${l}</option>`).join('')}
              </select>
            </label>

            <label class="ob-form-field">
              <span>Resolução Comentada Passo a Passo *</span>
              <textarea id="ed-enem-res" class="ob-input" rows="4">${esc(existing?.resolucao || '')}</textarea>
            </label>
          </div>
          <div class="actions" style="margin-top:18px">
            <button type="button" class="primary" data-editor-save="${cfg.type}" data-topic-key="${esc(eff.topicKey)}" data-item-id="${esc(cfg.itemId || '')}">
              💾 Salvar Questão ENEM
            </button>
            <button type="button" class="secondary" data-editor-close="1">Cancelar</button>
          </div>
        </div>
      </div>
    `;
  }

  /* 5. ADICIONAR OU EDITAR QUESTÃO DIAGNÓSTICA (A–C + IMAGEM) */
  if (cfg.type === 'add-diag-q' || cfg.type === 'edit-diag-q') {
    const blk = getEffectiveDiagnosticBlock(cfg.moduleId, cfg.blockId);
    if (!blk) return '';
    const existing = cfg.type === 'edit-diag-q'
      ? (blk.questoes || []).find(q => q.id === cfg.itemId)
      : null;

    return `
      <div class="ob-modal-backdrop" role="dialog" aria-modal="true">
        <div class="panel ob-modal-box editor-modal-wide">
          <div class="eyebrow">🎯 Questão Diagnóstica · ${esc(blk.titulo)}</div>
          <h3>${existing ? 'Editar Questão Diagnóstica' : 'Adicionar Nova Questão Diagnóstica no Bloco'}</h3>
          <div class="ob-form-grid">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label class="ob-form-field">
                <span>Habilidade Avaliada *</span>
                <select id="ed-diag-hab" class="ob-select">
                  ${(blk.habilidades || []).map(h => `<option value="${esc(h.id)}" ${(existing?.habilidade || blk.habilidades[0]?.id) === h.id ? 'selected' : ''}>${esc(h.id)} — ${esc(h.nome)}</option>`).join('')}
                </select>
              </label>
              <label class="ob-form-field">
                <span>Situação / Contexto Curto</span>
                <input type="text" id="ed-diag-sit" class="ob-input" value="${esc(existing?.situacao || 'Aplicação Conceitual')}">
              </label>
            </div>

            <label class="ob-form-field">
              <span>Enunciado da Questão *</span>
              <textarea id="ed-diag-enunc" class="ob-input" rows="3">${esc(existing?.enunciado || '')}</textarea>
            </label>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label class="ob-form-field">
                <span>Imagem na Questão (URL ou Base64)</span>
                <input type="text" id="ed-diag-img-url" class="ob-input" value="${esc(existing?.imagemUrl || '')}">
              </label>
              <label class="ob-form-field">
                <span>Ou enviar imagem do computador</span>
                <input type="file" id="ed-diag-img-file" accept="image/*" class="ob-input">
              </label>
            </div>

            <label class="ob-form-field"><span>Alternativa A *</span><input type="text" id="ed-diag-alt-A" class="ob-input" value="${esc(existing?.alternativas?.A || '')}"></label>
            <label class="ob-form-field"><span>Alternativa B *</span><input type="text" id="ed-diag-alt-B" class="ob-input" value="${esc(existing?.alternativas?.B || '')}"></label>
            <label class="ob-form-field"><span>Alternativa C *</span><input type="text" id="ed-diag-alt-C" class="ob-input" value="${esc(existing?.alternativas?.C || '')}"></label>

            <label class="ob-form-field">
              <span>Alternativa Correta *</span>
              <select id="ed-diag-correta" class="ob-select">
                ${['A', 'B', 'C'].map(l => `<option value="${l}" ${(existing?.correta || 'A') === l ? 'selected' : ''}>Alternativa ${l}</option>`).join('')}
              </select>
            </label>
          </div>
          <div class="actions" style="margin-top:18px">
            <button type="button" class="primary" data-editor-save="${cfg.type}" data-diag-module="${esc(cfg.moduleId)}" data-diag-block="${esc(cfg.blockId)}" data-item-id="${esc(cfg.itemId || '')}">
              💾 Salvar Questão Diagnóstica
            </button>
            <button type="button" class="secondary" data-editor-close="1">Cancelar</button>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

/* ══════════════════════════════════════════════════════════════════════════
   13. ROTEADOR PRINCIPAL (AS 5 ÁREAS) E EVENT LISTENERS DELEGADOS
   ══════════════════════════════════════════════════════════════════════════ */
function renderPlatform() {
  if (!storageService.data) storageService.init();
  const st = storageService.getActiveState();
  const area = st.activeArea || st.mainArea || 'home';
  st.activeArea = area;
  st.mainArea = area;

  if (area === 'home') return renderHomeArea();
  if (area === 'library') return renderLibraryArea();
  if (area === 'diagnostics') return renderDiagnosticsArea();
  if (area === 'my-list') return renderMyListArea();
  if (area === 'progression') return renderProgressionArea();
  return renderHomeArea();
}

// Sobrescreve window.render do protótipo antigo para usar sempre a nova arquitetura de 5 áreas
window.render = function() {
  renderPlatform();
};

function openTopicInLibrary(topicKey, initialTab = 'resumo') {
  const eff = getEffectiveTopicData(topicKey);
  if (!eff) return;
  const st = storageService.getActiveState();
  st.activeArea = 'library';
  st.subView = 'topic-study';
  st.activeTopicKey = eff.topicKey;
  st.activeTopicTab = initialTab;
  storageService.recordLastActivity({
    type: 'topic',
    topicKey: eff.topicKey,
    label: `${eff.mod.assunto} · ${eff.hab.id}: ${eff.titulo}`
  });
  storageService.save();
  renderPlatform();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function finalizeDiagnosticBlock(mod, blk, bSt, st) {
  bSt.activityStatus = 'completed';
  bSt.activeFilterSkillIds = null;
  bSt.completedAt = new Date().toISOString();
  bSt.evaluation = evaluateBlock(blk, bSt);

  // Alimenta automaticamente a Minha Lista com habilidades que precisam de estudo ou reforço
  (blk.habilidades || []).forEach(hab => {
    const sk = bSt.evaluation.skills[hab.id];
    const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
    if (!sk) return;
    if (sk.status === 'study') {
      addSkillToStudyList(tKey, 'Diagnóstico', 'Alta', 'A estudar');
    } else if (sk.status === 'partial') {
      addSkillToStudyList(tKey, 'Diagnóstico', 'Média', 'Revisar');
    } else if (sk.status === 'insufficient') {
      addSkillToStudyList(tKey, 'Diagnóstico', 'Baixa', 'Revisar');
    }
  });

  st.pendingModal = null;
  st.subView = 'diag-closing';
  storageService.save();
  renderPlatform();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Helper para ler arquivo de imagem como DataURL Base64
function readImageFileAsDataUrl(fileInput) {
  return new Promise(resolve => {
    const file = fileInput?.files?.[0];
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = e => resolve(String(e.target?.result || ''));
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

document.addEventListener('click', async event => {
  const target = event.target.closest('button, [data-main-nav], [data-open-topic], [data-profile-action]');
  if (!target) return;

  /* 1. NAVEGAÇÃO PRINCIPAL ENTRE AS 5 ÁREAS */
  const mainNav = target.dataset.mainNav;
  if (mainNav) {
    const st = storageService.getActiveState();
    st.activeArea = mainNav;
    st.subView = 'main';
    st.pendingModal = null;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  /* 2. ATALHOS RÁPIDOS DE MATÉRIA/MÓDULO (INÍCIO / PROGRESSÃO) */
  if (target.dataset.quickLibrary) {
    const modId = target.dataset.quickLibrary;
    const mod = getModuleById(modId);
    const st = storageService.getActiveState();
    st.activeArea = 'library';
    st.subView = 'main';
    st.libraryFilterMateria = mod ? mod.materiaId : 'all';
    st.libraryFilterModule = modId;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target.dataset.quickDiag) {
    const modId = target.dataset.quickDiag;
    const st = storageService.getActiveState();
    st.activeArea = 'diagnostics';
    st.subView = 'main';
    st.activeDiagModuleId = modId;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  /* 3. ALTERNAR MODO EDIÇÃO IN-APP */
  if (target.dataset.toggleEditMode) {
    const nextState = storageService.toggleEditMode();
    renderPlatform();
    if (typeof showToast === 'function') {
      showToast(nextState ? '✏️ Modo Edição ativado! Botões de edição visíveis.' : 'Modo Edição desativado.');
    }
    return;
  }

  /* 4. AÇÕES DE PERFIL E BACKUP JSON */
  const profAction = target.dataset.profileAction;
  if (profAction) {
    if (profAction === 'open-switcher') {
      activeTopModal = 'profile-switcher';
      renderPlatform();
      return;
    }
    if (profAction === 'open-new-profile') {
      activeTopModal = 'onboarding';
      renderPlatform();
      return;
    }
    if (profAction === 'open-backup') {
      activeTopModal = 'backup-json';
      renderPlatform();
      return;
    }
    if (profAction === 'close-top-modal') {
      activeTopModal = null;
      renderPlatform();
      return;
    }
    if (profAction === 'save-new-profile') {
      const nameEl = document.getElementById('ob-prof-name');
      const goalEl = document.getElementById('ob-prof-goal');
      const paceEl = document.querySelector('input[name="ob-prof-pace"]:checked');
      const name = nameEl ? nameEl.value.trim() : 'Rafaela';
      const goal = goalEl ? goalEl.value.trim() : '';
      const pace = paceEl ? paceEl.value : 'medio';
      const p = storageService.createProfile(name || 'Rafaela', goal, pace);
      activeTopModal = null;
      renderPlatform();
      if (typeof showToast === 'function') showToast(`Perfil "${p.name}" ativo!`);
      return;
    }
    if (profAction === 'update-current-profile') {
      const nameEl = document.getElementById('ob-edit-prof-name');
      const goalEl = document.getElementById('ob-edit-prof-goal');
      const paceEl = document.getElementById('ob-edit-prof-pace');
      storageService.updateActiveProfile(
        nameEl ? nameEl.value : 'Rafaela',
        goalEl ? goalEl.value : '',
        paceEl ? paceEl.value : 'medio'
      );
      activeTopModal = null;
      renderPlatform();
      if (typeof showToast === 'function') showToast('Perfil atualizado!');
      return;
    }
    if (profAction === 'download-json') {
      const jsonStr = storageService.exportBackupJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const activeProf = storageService.getActiveProfile();
      const safeName = (activeProf?.name || 'estudante').toLowerCase().replace(/[^a-z0-9]/g, '-');
      a.href = url;
      a.download = `backup-enem-${safeName}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      if (typeof showToast === 'function') showToast('Arquivo .JSON exportado com sucesso!');
      return;
    }
    if (profAction === 'upload-json') {
      const input = document.getElementById('ob-import-file-input');
      const file = input?.files?.[0];
      if (!file) {
        if (typeof showToast === 'function') showToast('Selecione um arquivo .json primeiro.');
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        const res = storageService.importBackupJson(String(e.target?.result || ''));
        if (res.ok) {
          activeTopModal = null;
          renderPlatform();
          if (typeof showToast === 'function') showToast('Backup importado com sucesso!');
        } else {
          if (typeof showToast === 'function') showToast(`Erro: ${res.msg}`);
        }
      };
      reader.readAsText(file);
      return;
    }
  }

  if (target.dataset.profileSwitchId) {
    storageService.switchProfile(target.dataset.profileSwitchId);
    activeTopModal = null;
    renderPlatform();
    const active = storageService.getActiveProfile();
    if (typeof showToast === 'function') showToast(`Alternado para o perfil de ${active?.name || 'usuário'}!`);
    return;
  }

  /* 5. BIBLIOTECA DE ESTUDOS E PÁGINA INTERNA DO TÓPICO */
  if (target.dataset.openTopic) {
    openTopicInLibrary(target.dataset.openTopic, 'resumo');
    return;
  }
  if (target.dataset.openTopicPractice) {
    openTopicInLibrary(target.dataset.openTopicPractice, 'pratica');
    return;
  }
  if (target.dataset.backToCatalog) {
    const st = storageService.getActiveState();
    st.subView = 'main';
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (target.dataset.switchTopicTab) {
    const st = storageService.getActiveState();
    st.activeTopicTab = target.dataset.switchTopicTab;
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.libFilterMat) {
    const st = storageService.getActiveState();
    st.libraryFilterMateria = target.dataset.libFilterMat;
    st.libraryFilterModule = 'all';
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.libFilterMod) {
    const st = storageService.getActiveState();
    st.libraryFilterModule = target.dataset.libFilterMod;
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.libClearSearch) {
    const st = storageService.getActiveState();
    st.librarySearch = '';
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.libAddList) {
    const tKey = target.dataset.libAddList;
    const res = addSkillToStudyList(tKey, 'Escolha livre na Biblioteca', 'Média', 'A estudar');
    renderPlatform();
    if (typeof showToast === 'function') {
      showToast(res.added ? '📌 Tópico adicionado à Minha Lista!' : 'Este tópico já está na sua Minha Lista.');
    }
    return;
  }
  if (target.dataset.libMarkReview) {
    const tKey = target.dataset.libMarkReview;
    addSkillToStudyList(tKey, 'Marcado para Revisão', 'Alta', 'Revisar');
    renderPlatform();
    if (typeof showToast === 'function') showToast('↻ Tópico marcado como "Revisar" na Minha Lista!');
    return;
  }

  /* 6. PRÁTICA DE QUESTÕES OFICIAIS DO ENEM E CONFIRMAÇÃO DE APRENDIZADO */
  if (target.dataset.enemSelectQ) {
    const qId = target.dataset.enemSelectQ;
    const letter = target.dataset.enemSelectLetter;
    const tKey = target.dataset.topicKey;
    const st = storageService.getActiveState();
    if (!st.topicProgress) st.topicProgress = {};
    if (!st.topicProgress[tKey]) st.topicProgress[tKey] = { enemAnswers: {}, confirmedMastery: false };
    st.topicProgress[tKey].enemAnswers[qId] = {
      selected: letter,
      checked: false
    };
    storageService.save();
    renderPlatform();
    return;
  }

  if (target.dataset.enemCheckQ) {
    const qId = target.dataset.enemCheckQ;
    const tKey = target.dataset.topicKey;
    const st = storageService.getActiveState();
    const cur = st.topicProgress?.[tKey]?.enemAnswers?.[qId];
    if (cur && cur.selected) {
      cur.checked = true;
      storageService.save();
      renderPlatform();
    }
    return;
  }

  if (target.dataset.confirmTopicLearning) {
    const tKey = target.dataset.confirmTopicLearning;
    confirmTopicLearning(tKey);
    renderPlatform();
    if (typeof showToast === 'function') {
      showToast('🎉 Aprendizado confirmado! Habilidade marcada como Dominada na Progressão e Concluída na Minha Lista.');
    }
    return;
  }

  /* 7. FLUXO DE DIAGNÓSTICOS (TODOS OS 6 MÓDULOS) */
  if (target.dataset.diagSelectModule) {
    const st = storageService.getActiveState();
    st.activeDiagModuleId = target.dataset.diagSelectModule;
    st.subView = 'main';
    st.pendingModal = null;
    storageService.save();
    renderPlatform();
    return;
  }

  if (target.dataset.diagGuidedStart) {
    const modId = target.dataset.diagGuidedStart;
    const mod = getModuleById(modId);
    const st = storageService.getActiveState();
    const modState = storageService.ensureModuleDiagState(st, modId);
    let targetBlk = (mod.blocos || [])[0];
    for (const rawB of (mod.blocos || [])) {
      const effB = getEffectiveDiagnosticBlock(modId, rawB.id);
      const live = getBlockLiveActivityStatus(effB, modState.blocks[rawB.id]);
      if (live !== 'completed') {
        targetBlk = rawB;
        break;
      }
    }
    st.activeArea = 'diagnostics';
    st.activeDiagModuleId = modId;
    st.activeDiagBlockId = targetBlk.id;
    st.subView = 'diag-pre-block';
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target.dataset.diagBackHub) {
    const st = storageService.getActiveState();
    st.subView = 'main';
    st.pendingModal = null;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target.dataset.diagOpenBlock) {
    const blkId = target.dataset.diagOpenBlock;
    const modId = target.dataset.diagModule || storageService.getActiveState().activeDiagModuleId || 'fisica_optica';
    const mod = getModuleById(modId);
    const blk = getEffectiveDiagnosticBlock(modId, blkId);
    const st = storageService.getActiveState();
    st.activeArea = 'diagnostics';
    st.activeDiagModuleId = modId;
    st.activeDiagBlockId = blkId;
    st.subView = 'diag-pre-block';
    st.pendingModal = null;
    if (mod && blk) {
      storageService.recordLastActivity({
        type: 'diag',
        moduleId: modId,
        blockId: blkId,
        label: `Diagnóstico de ${mod.assunto} · Bloco ${blk.ordem}: ${blk.titulo}`
      });
    }
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target.dataset.diagOpenSummary) {
    const blkId = target.dataset.diagOpenSummary;
    const modId = target.dataset.diagModule || storageService.getActiveState().activeDiagModuleId || 'fisica_optica';
    const st = storageService.getActiveState();
    st.activeArea = 'diagnostics';
    st.activeDiagModuleId = modId;
    st.activeDiagBlockId = blkId;
    st.subView = 'diag-summary';
    st.pendingModal = null;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target.dataset.diagStartQuestions) {
    const blkId = target.dataset.diagStartQuestions;
    const modId = target.dataset.diagModule || storageService.getActiveState().activeDiagModuleId || 'fisica_optica';
    const st = storageService.getActiveState();
    const modState = storageService.ensureModuleDiagState(st, modId);
    const bSt = modState.blocks[blkId];
    if (bSt.activityStatus === 'not_started' || bSt.activityStatus === 'skipped') {
      bSt.activityStatus = 'in_progress';
    }
    st.activeArea = 'diagnostics';
    st.activeDiagModuleId = modId;
    st.activeDiagBlockId = blkId;
    st.subView = 'diag-question';
    st.pendingModal = null;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target.dataset.diagOpenClosing) {
    const blkId = target.dataset.diagOpenClosing;
    const modId = target.dataset.diagModule || storageService.getActiveState().activeDiagModuleId || 'fisica_optica';
    const st = storageService.getActiveState();
    st.activeArea = 'diagnostics';
    st.activeDiagModuleId = modId;
    st.activeDiagBlockId = blkId;
    st.subView = 'diag-closing';
    st.pendingModal = null;
    storageService.save();
    renderPlatform();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target.dataset.diagClearFilter) {
    const blkId = target.dataset.diagClearFilter;
    const modId = target.dataset.diagModule || storageService.getActiveState().activeDiagModuleId;
    const st = storageService.getActiveState();
    const modState = storageService.ensureModuleDiagState(st, modId);
    if (modState.blocks[blkId]) {
      modState.blocks[blkId].activeFilterSkillIds = null;
      modState.blocks[blkId].currentIndex = 0;
    }
    storageService.save();
    renderPlatform();
    return;
  }

  // Interações dentro do Quiz Diagnóstico
  const st = storageService.getActiveState();
  if (st.activeArea === 'diagnostics' && st.activeDiagModuleId && st.activeDiagBlockId) {
    const mod = getModuleById(st.activeDiagModuleId);
    const blk = getEffectiveDiagnosticBlock(st.activeDiagModuleId, st.activeDiagBlockId);
    const modState = storageService.ensureModuleDiagState(st, st.activeDiagModuleId);
    const bSt = modState.blocks[st.activeDiagBlockId];

    if (blk && bSt) {
      const qList = getActiveDiagQuestionList(blk, bSt);
      const q = qList[bSt.currentIndex || 0];

      if (target.dataset.diagSelectChoice && q) {
        const letter = target.dataset.diagSelectChoice;
        const prev = bSt.answers[q.id] || {};
        bSt.answers[q.id] = {
          choice: letter,
          confidence: prev.confidence || 'certeza'
        };
        if (bSt.activityStatus === 'not_started') bSt.activityStatus = 'in_progress';
        storageService.save();
        renderPlatform();
        return;
      }

      if (target.dataset.diagSelectConf && q) {
        const conf = target.dataset.diagSelectConf;
        const prev = bSt.answers[q.id] || { choice: null };
        bSt.answers[q.id] = {
          choice: prev.choice,
          confidence: conf
        };
        storageService.save();
        renderPlatform();
        return;
      }

      if (target.dataset.diagClearAnswer && q) {
        delete bSt.answers[q.id];
        storageService.save();
        renderPlatform();
        return;
      }

      if (target.dataset.diagJumpQ !== undefined) {
        bSt.currentIndex = Number(target.dataset.diagJumpQ);
        storageService.save();
        renderPlatform();
        return;
      }

      if (target.dataset.diagPrevQ) {
        if (bSt.currentIndex > 0) bSt.currentIndex -= 1;
        storageService.save();
        renderPlatform();
        return;
      }

      if (target.dataset.diagNextQ) {
        if (bSt.currentIndex < qList.length - 1) bSt.currentIndex += 1;
        storageService.save();
        renderPlatform();
        return;
      }

      if (target.dataset.diagSkipQ) {
        if (q && (!bSt.answers[q.id] || !bSt.answers[q.id].choice)) {
          delete bSt.answers[q.id];
        }
        if (bSt.currentIndex < qList.length - 1) {
          bSt.currentIndex += 1;
          storageService.save();
          renderPlatform();
        } else {
          const blankCount = qList.filter(item => !bSt.answers?.[item.id]?.choice).length;
          if (blankCount > 0) {
            st.pendingModal = 'confirm-finish-blanks';
            storageService.save();
            renderPlatform();
          } else {
            finalizeDiagnosticBlock(mod, blk, bSt, st);
          }
        }
        return;
      }

      if (target.dataset.diagSaveExit) {
        const ansCount = (blk.questoes || []).filter(item => bSt.answers?.[item.id]?.choice).length;
        if (ansCount > 0 && bSt.activityStatus !== 'completed') {
          bSt.activityStatus = 'in_progress';
        }
        st.subView = 'main';
        st.pendingModal = null;
        storageService.save();
        renderPlatform();
        if (typeof showToast === 'function') showToast('Progresso do bloco salvo!');
        return;
      }

      if (target.dataset.diagRequestSkipBlock) {
        st.pendingModal = 'confirm-skip-block';
        storageService.save();
        renderPlatform();
        return;
      }

      if (target.dataset.diagConfirmSkipBlock) {
        bSt.activityStatus = 'skipped';
        bSt.evaluation = evaluateBlock(blk, bSt);
        st.pendingModal = null;
        st.subView = 'main';
        storageService.save();
        renderPlatform();
        if (typeof showToast === 'function') showToast(`Bloco ${blk.ordem} marcado como Pulado.`);
        return;
      }

      if (target.dataset.diagRequestFinish) {
        const blankCount = qList.filter(item => !bSt.answers?.[item.id]?.choice).length;
        if (blankCount > 0) {
          st.pendingModal = 'confirm-finish-blanks';
          storageService.save();
          renderPlatform();
        } else {
          finalizeDiagnosticBlock(mod, blk, bSt, st);
        }
        return;
      }

      if (target.dataset.diagConfirmFinish) {
        finalizeDiagnosticBlock(mod, blk, bSt, st);
        return;
      }

      if (target.dataset.diagGoFirstBlank) {
        const firstBlankIdx = qList.findIndex(item => !bSt.answers?.[item.id]?.choice);
        if (firstBlankIdx >= 0) bSt.currentIndex = firstBlankIdx;
        st.pendingModal = null;
        storageService.save();
        renderPlatform();
        return;
      }

      if (target.dataset.diagCloseModal) {
        st.pendingModal = null;
        storageService.save();
        renderPlatform();
        return;
      }

      if (target.dataset.diagAddAllPending) {
        const ev = bSt.evaluation || evaluateBlock(blk, bSt);
        let addedCount = 0;
        (blk.habilidades || []).forEach(hab => {
          const sk = ev.skills[hab.id];
          if (!sk || sk.status !== 'mastered') {
            const tKey = buildTopicKey(mod.materiaId, mod.assuntoId, blk.id, hab.id);
            const prio = sk?.status === 'study' ? 'Alta' : 'Média';
            const res = addSkillToStudyList(tKey, 'Diagnóstico', prio, 'A estudar');
            if (res.added) addedCount++;
          }
        });
        renderPlatform();
        if (typeof showToast === 'function') {
          showToast(addedCount > 0 ? `${addedCount} habilidade(s) adicionada(s) à Minha Lista!` : 'Todas as habilidades pendentes já estão na Minha Lista.');
        }
        return;
      }

      if (target.dataset.diagRetakePending) {
        const ev = bSt.evaluation || evaluateBlock(blk, bSt);
        const pendingIds = (blk.habilidades || [])
          .filter(h => ev.skills[h.id]?.status !== 'mastered')
          .map(h => h.id);
        if (pendingIds.length > 0) {
          (blk.questoes || []).forEach(item => {
            if (pendingIds.includes(item.habilidade)) {
              delete bSt.answers[item.id];
            }
          });
          bSt.activeFilterSkillIds = pendingIds;
          bSt.currentIndex = 0;
          bSt.activityStatus = 'in_progress';
          st.subView = 'diag-question';
          storageService.save();
          renderPlatform();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      if (target.dataset.diagRetakeAll) {
        bSt.answers = {};
        bSt.currentIndex = 0;
        bSt.activeFilterSkillIds = null;
        bSt.activityStatus = 'in_progress';
        bSt.evaluation = null;
        st.subView = 'diag-question';
        storageService.save();
        renderPlatform();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
  }

  /* 8. AÇÕES DA MINHA LISTA E PROGRESSÃO */
  if (target.dataset.listFilterStatus) {
    st.listFilterStatus = target.dataset.listFilterStatus;
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.listFilterMat) {
    st.listFilterMateria = target.dataset.listFilterMat;
    storageService.save();
    renderPlatform();
    return;
  }
  if (target.dataset.listManualAdd) {
    const sel = document.getElementById('ob-manual-topic-select');
    const tKey = sel ? sel.value : '';
    if (!tKey) {
      if (typeof showToast === 'function') showToast('Escolha um tópico na caixa de seleção primeiro.');
      return;
    }
    const res = addSkillToStudyList(tKey, 'Escolha manual', 'Média', 'A estudar');
    renderPlatform();
    if (typeof showToast === 'function') {
      showToast(res.added ? '📌 Tópico adicionado à Minha Lista!' : 'Este tópico já está na Minha Lista.');
    }
    return;
  }
  if (target.dataset.listMoveUp) {
    const id = target.dataset.listMoveUp;
    const idx = st.studyList.findIndex(i => i.id === id);
    if (idx > 0) {
      const tmp = st.studyList[idx - 1];
      st.studyList[idx - 1] = st.studyList[idx];
      st.studyList[idx] = tmp;
      storageService.save();
      renderPlatform();
    }
    return;
  }
  if (target.dataset.listMoveDown) {
    const id = target.dataset.listMoveDown;
    const idx = st.studyList.findIndex(i => i.id === id);
    if (idx >= 0 && idx < st.studyList.length - 1) {
      const tmp = st.studyList[idx + 1];
      st.studyList[idx + 1] = st.studyList[idx];
      st.studyList[idx] = tmp;
      storageService.save();
      renderPlatform();
    }
    return;
  }
  if (target.dataset.listDelete) {
    const id = target.dataset.listDelete;
    st.studyList = st.studyList.filter(i => i.id !== id);
    storageService.save();
    renderPlatform();
    if (typeof showToast === 'function') showToast('Item removido da Minha Lista.');
    return;
  }
  if (target.dataset.progFilterMat) {
    st.progFilterMateria = target.dataset.progFilterMat;
    storageService.save();
    renderPlatform();
    return;
  }

  /* 9. AÇÕES DO MODO EDITOR VISUAL IN-APP */
  if (target.dataset.editorOpen) {
    activeEditorModal = {
      type: target.dataset.editorOpen,
      topicKey: target.dataset.topicKey || null,
      moduleId: target.dataset.diagModule || null,
      blockId: target.dataset.diagBlock || null,
      itemId: target.dataset.itemId || null
    };
    renderPlatform();
    return;
  }

  if (target.dataset.editorClose) {
    activeEditorModal = null;
    renderPlatform();
    return;
  }

  if (target.dataset.editorRemoveResumoImg) {
    const tKey = target.dataset.editorRemoveResumoImg;
    storageService.updateCustomTopic(tKey, custom => {
      custom.resumoImage = '';
    });
    renderPlatform();
    if (typeof showToast === 'function') showToast('Imagem ilustrativa removida.');
    return;
  }

  if (target.dataset.editorDeleteVideo) {
    const vidId = target.dataset.editorDeleteVideo;
    const tKey = target.dataset.topicKey;
    storageService.updateCustomTopic(tKey, custom => {
      if (!custom.deletedVideoIds) custom.deletedVideoIds = [];
      if (!custom.deletedVideoIds.includes(vidId)) custom.deletedVideoIds.push(vidId);
      if (custom.addedVideos) {
        custom.addedVideos = custom.addedVideos.filter(v => (v.id || v.url) !== vidId);
      }
    });
    renderPlatform();
    if (typeof showToast === 'function') showToast('Videoaula removida deste tópico.');
    return;
  }

  if (target.dataset.editorDeleteSite) {
    const siteId = target.dataset.editorDeleteSite;
    const tKey = target.dataset.topicKey;
    storageService.updateCustomTopic(tKey, custom => {
      if (!custom.deletedSiteIds) custom.deletedSiteIds = [];
      if (!custom.deletedSiteIds.includes(siteId)) custom.deletedSiteIds.push(siteId);
      if (custom.addedSites) {
        custom.addedSites = custom.addedSites.filter(s => (s.id || s.url) !== siteId);
      }
    });
    renderPlatform();
    if (typeof showToast === 'function') showToast('Site removido deste tópico.');
    return;
  }

  if (target.dataset.editorDeleteEnemQ) {
    const qId = target.dataset.editorDeleteEnemQ;
    const tKey = target.dataset.topicKey;
    storageService.updateCustomTopic(tKey, custom => {
      if (!custom.deletedEnemIds) custom.deletedEnemIds = [];
      if (!custom.deletedEnemIds.includes(qId)) custom.deletedEnemIds.push(qId);
      if (custom.addedEnem) {
        custom.addedEnem = custom.addedEnem.filter(q => q.id !== qId);
      }
    });
    renderPlatform();
    if (typeof showToast === 'function') showToast('Questão ENEM excluída.');
    return;
  }

  if (target.dataset.editorDeleteDiagQ) {
    const qId = target.dataset.editorDeleteDiagQ;
    const modId = target.dataset.diagModule;
    const blkId = target.dataset.diagBlock;
    storageService.updateCustomBlock(modId, blkId, customBlk => {
      if (!customBlk.deletedDiagQIds) customBlk.deletedDiagQIds = [];
      if (!customBlk.deletedDiagQIds.includes(qId)) customBlk.deletedDiagQIds.push(qId);
      if (customBlk.addedDiagQs) {
        customBlk.addedDiagQs = customBlk.addedDiagQs.filter(q => q.id !== qId);
      }
    });
    renderPlatform();
    if (typeof showToast === 'function') showToast('Questão diagnóstica excluída.');
    return;
  }

  if (target.dataset.editorSave) {
    const saveType = target.dataset.editorSave;
    const tKey = target.dataset.topicKey;

    if (saveType === 'edit-topic' && tKey) {
      const title = document.getElementById('ed-topic-title')?.value?.trim();
      const foco = document.getElementById('ed-topic-foco')?.value?.trim();
      const resumo = document.getElementById('ed-topic-resumo')?.value;
      const imgUrlInput = document.getElementById('ed-topic-img-url')?.value?.trim();
      const fileInput = document.getElementById('ed-topic-img-file');
      const uploadedDataUrl = await readImageFileAsDataUrl(fileInput);

      storageService.updateCustomTopic(tKey, custom => {
        if (title) custom.titulo = title;
        if (foco) custom.foco = foco;
        if (typeof resumo === 'string') custom.resumo = resumo;
        if (uploadedDataUrl) custom.resumoImage = uploadedDataUrl;
        else if (imgUrlInput !== undefined) custom.resumoImage = imgUrlInput;
      });
      activeEditorModal = null;
      renderPlatform();
      if (typeof showToast === 'function') showToast('💾 Tópico e resumo atualizados!');
      return;
    }

    if ((saveType === 'add-video' || saveType === 'edit-video') && tKey) {
      const titulo = document.getElementById('ed-vid-title')?.value?.trim();
      const canal = document.getElementById('ed-vid-canal')?.value?.trim() || 'YouTube';
      const url = document.getElementById('ed-vid-url')?.value?.trim();
      const nota = document.getElementById('ed-vid-nota')?.value?.trim() || '';

      if (!titulo || !url || isGenericYoutubeSearchUrl(url)) {
        if (typeof showToast === 'function') showToast('Informe um título e um link direto válido de vídeo do YouTube.');
        return;
      }

      const itemId = target.dataset.itemId;
      storageService.updateCustomTopic(tKey, custom => {
        if (!custom.addedVideos) custom.addedVideos = [];
        if (saveType === 'edit-video' && itemId) {
          if (!custom.deletedVideoIds) custom.deletedVideoIds = [];
          if (!custom.deletedVideoIds.includes(itemId)) custom.deletedVideoIds.push(itemId);
          custom.addedVideos = custom.addedVideos.filter(v => (v.id || v.url) !== itemId);
        }
        custom.addedVideos.push({
          id: `vid_${Date.now()}`,
          titulo,
          canal,
          url,
          nota
        });
      });
      activeEditorModal = null;
      renderPlatform();
      if (typeof showToast === 'function') showToast('🎬 Videoaula salva neste tópico!');
      return;
    }

    if ((saveType === 'add-site' || saveType === 'edit-site') && tKey) {
      const titulo = document.getElementById('ed-site-title')?.value?.trim();
      const portal = document.getElementById('ed-site-portal')?.value?.trim() || 'Portal Educacional';
      const url = document.getElementById('ed-site-url')?.value?.trim();
      const resumo = document.getElementById('ed-site-resumo')?.value?.trim() || '';

      if (!titulo || !url) {
        if (typeof showToast === 'function') showToast('Preencha o título e a URL do site.');
        return;
      }

      const itemId = target.dataset.itemId;
      storageService.updateCustomTopic(tKey, custom => {
        if (!custom.addedSites) custom.addedSites = [];
        if (saveType === 'edit-site' && itemId) {
          if (!custom.deletedSiteIds) custom.deletedSiteIds = [];
          if (!custom.deletedSiteIds.includes(itemId)) custom.deletedSiteIds.push(itemId);
          custom.addedSites = custom.addedSites.filter(s => (s.id || s.url) !== itemId);
        }
        custom.addedSites.push({
          id: `site_${Date.now()}`,
          titulo,
          portal,
          url,
          resumo
        });
      });
      activeEditorModal = null;
      renderPlatform();
      if (typeof showToast === 'function') showToast('🌐 Site salvo neste tópico!');
      return;
    }

    if ((saveType === 'add-enem-q' || saveType === 'edit-enem-q') && tKey) {
      const ano = document.getElementById('ed-enem-ano')?.value?.trim() || 'ENEM';
      const contexto = document.getElementById('ed-enem-ctx')?.value?.trim() || '';
      const enunciado = document.getElementById('ed-enem-enunc')?.value?.trim();
      const imgUrlInput = document.getElementById('ed-enem-img-url')?.value?.trim() || '';
      const fileInput = document.getElementById('ed-enem-img-file');
      const uploadedDataUrl = await readImageFileAsDataUrl(fileInput);
      const A = document.getElementById('ed-enem-alt-A')?.value?.trim() || '';
      const B = document.getElementById('ed-enem-alt-B')?.value?.trim() || '';
      const C = document.getElementById('ed-enem-alt-C')?.value?.trim() || '';
      const D = document.getElementById('ed-enem-alt-D')?.value?.trim() || '';
      const E = document.getElementById('ed-enem-alt-E')?.value?.trim() || '';
      const correta = document.getElementById('ed-enem-correta')?.value || 'A';
      const resolucao = document.getElementById('ed-enem-res')?.value?.trim() || '';

      if (!enunciado || !A || !B || !C || !D || !E) {
        if (typeof showToast === 'function') showToast('Preencha o enunciado e as 5 alternativas (A–E).');
        return;
      }

      const itemId = target.dataset.itemId;
      const eff = getEffectiveTopicData(tKey);
      storageService.updateCustomTopic(tKey, custom => {
        if (!custom.addedEnem) custom.addedEnem = [];
        if (saveType === 'edit-enem-q' && itemId) {
          if (!custom.deletedEnemIds) custom.deletedEnemIds = [];
          if (!custom.deletedEnemIds.includes(itemId)) custom.deletedEnemIds.push(itemId);
          custom.addedEnem = custom.addedEnem.filter(q => q.id !== itemId);
        }
        custom.addedEnem.push({
          id: itemId || `enem_custom_${Date.now()}`,
          ano,
          habilidadeId: eff?.hab?.id || '',
          contexto,
          enunciado,
          imagemUrl: uploadedDataUrl || imgUrlInput,
          alternativas: { A, B, C, D, E },
          correta,
          resolucao
        });
      });
      activeEditorModal = null;
      renderPlatform();
      if (typeof showToast === 'function') showToast('📝 Questão ENEM salva com sucesso!');
      return;
    }

    if (saveType === 'add-diag-q' || saveType === 'edit-diag-q') {
      const modId = target.dataset.diagModule;
      const blkId = target.dataset.diagBlock;
      const itemId = target.dataset.itemId;
      const habilidade = document.getElementById('ed-diag-hab')?.value || '';
      const situacao = document.getElementById('ed-diag-sit')?.value?.trim() || '';
      const enunciado = document.getElementById('ed-diag-enunc')?.value?.trim() || '';
      const imgUrlInput = document.getElementById('ed-diag-img-url')?.value?.trim() || '';
      const fileInput = document.getElementById('ed-diag-img-file');
      const uploadedDataUrl = await readImageFileAsDataUrl(fileInput);
      const A = document.getElementById('ed-diag-alt-A')?.value?.trim() || '';
      const B = document.getElementById('ed-diag-alt-B')?.value?.trim() || '';
      const C = document.getElementById('ed-diag-alt-C')?.value?.trim() || '';
      const correta = document.getElementById('ed-diag-correta')?.value || 'A';

      if (!enunciado || !A || !B || !C) {
        if (typeof showToast === 'function') showToast('Preencha o enunciado e as 3 alternativas (A–C).');
        return;
      }

      storageService.updateCustomBlock(modId, blkId, customBlk => {
        if (saveType === 'edit-diag-q' && itemId) {
          if (!customBlk.diagQOverrides) customBlk.diagQOverrides = {};
          customBlk.diagQOverrides[itemId] = {
            id: itemId,
            habilidade,
            situacao,
            enunciado,
            imagemUrl: uploadedDataUrl || imgUrlInput,
            alternativas: { A, B, C },
            correta
          };
          if (customBlk.addedDiagQs) {
            customBlk.addedDiagQs = customBlk.addedDiagQs.map(q => q.id === itemId ? customBlk.diagQOverrides[itemId] : q);
          }
        } else {
          if (!customBlk.addedDiagQs) customBlk.addedDiagQs = [];
          customBlk.addedDiagQs.push({
            id: `diag_custom_${Date.now()}`,
            habilidade,
            situacao,
            enunciado,
            imagemUrl: uploadedDataUrl || imgUrlInput,
            alternativas: { A, B, C },
            correta
          });
        }
      });
      activeEditorModal = null;
      renderPlatform();
      if (typeof showToast === 'function') showToast('🎯 Questão diagnóstica salva!');
      return;
    }
  }
});

document.addEventListener('change', event => {
  const target = event.target;
  if (!target) return;
  const st = storageService.getActiveState();

  if (target.dataset.listStatusId) {
    const item = (st.studyList || []).find(i => i.id === target.dataset.listStatusId);
    if (item) {
      item.status = target.value;
      storageService.save();
      renderPlatform();
      if (typeof showToast === 'function') showToast(`Status alterado para "${item.status}".`);
    }
    return;
  }

  if (target.dataset.listPrioId) {
    const item = (st.studyList || []).find(i => i.id === target.dataset.listPrioId);
    if (item) {
      item.priority = target.value;
      storageService.save();
      renderPlatform();
      if (typeof showToast === 'function') showToast(`Prioridade alterada para "${item.priority}".`);
    }
    return;
  }
});

document.addEventListener('input', event => {
  const target = event.target;
  if (target && target.id === 'lib-search-input') {
    const st = storageService.getActiveState();
    st.librarySearch = target.value;
    storageService.save();
    const pos = target.selectionStart || target.value.length;
    renderPlatform();
    const newInput = document.getElementById('lib-search-input');
    if (newInput) {
      newInput.focus();
      try { newInput.setSelectionRange(pos, pos); } catch (_) {}
    }
  }
});

document.addEventListener('toggle', event => {
  const detailsEl = event.target;
  if (detailsEl && detailsEl.dataset && detailsEl.dataset.accId) {
    const st = storageService.getActiveState();
    if (!st.openAccordions) st.openAccordions = {};
    st.openAccordions[detailsEl.dataset.accId] = detailsEl.open;
    storageService.save();
  }
}, true);

// Inicializa na carga da página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => renderPlatform());
} else {
  renderPlatform();
}
})();


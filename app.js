'use strict';

/* =========================================================
   Constantes
   ========================================================= */

const SAISONS = [
  { id: 'printemps', label: 'Printemps', emoji: '🌱' },
  { id: 'ete', label: 'Été', emoji: '☀️' },
  { id: 'automne', label: 'Automne', emoji: '🍂' },
  { id: 'hiver', label: 'Hiver', emoji: '❄️' },
];
const REPAS = [{ id: 'midi', label: 'Midi' }, { id: 'soir', label: 'Soir' }];
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const CATEGORIES = ['Entrée', 'Plat', 'Accompagnement', 'Soupe', 'Salade', 'Dessert', 'Petit-déj', 'Goûter', 'Boisson', 'Sauce'];
const CAT_EMOJI = {
  'Entrée': '🥗', 'Plat': '🍲', 'Accompagnement': '🥔', 'Soupe': '🥣', 'Salade': '🥬',
  'Dessert': '🍰', 'Petit-déj': '🥐', 'Goûter': '🍪', 'Boisson': '🍹', 'Sauce': '🫙',
};
const CAT_COLOR = {
  'Entrée': '#5fa04c', 'Plat': '#d4572f', 'Accompagnement': '#c99a2e', 'Soupe': '#d06a26', 'Salade': '#4f9a5c',
  'Dessert': '#d2577f', 'Petit-déj': '#e6a31e', 'Goûter': '#a8693a', 'Boisson': '#4f86c0', 'Sauce': '#8a5aa8',
};
const KICKERS = {
  recettes: () => ({ printemps: 'Vive le printemps 🌱', ete: 'C’est l’été ☀️', automne: 'C’est l’automne 🍂', hiver: 'Bonjour l’hiver ❄️' }[currentSeason()]),
  semaine: () => 'Au menu cette semaine',
  courses: () => 'Direction le marché',
  prix: () => 'Combien ça coûte ?',
};

// Illustrations
const POT_ART = `<svg class="empty-art" viewBox="80 40 352 370" aria-hidden="true">
  <ellipse cx="256" cy="398" rx="150" ry="13" fill="#5a1d10" opacity=".15"/>
  <g class="steam" fill="none" stroke="#e8b9a3" stroke-width="13" stroke-linecap="round">
    <path pathLength="1" d="M206 150c-18-22 18-34 0-60"/><path pathLength="1" d="M256 140c-18-22 18-34 0-62"/><path pathLength="1" d="M306 150c-18-22 18-34 0-60"/>
  </g>
  <rect x="86" y="258" width="66" height="30" rx="15" fill="#1c4a3e"/><rect x="360" y="258" width="66" height="30" rx="15" fill="#1c4a3e"/>
  <path d="M118 246H394V316a76 76 0 0 1-76 76H194a76 76 0 0 1-76-76Z" fill="#2f7563"/>
  <path d="M148 290v24a50 50 0 0 0 22 42" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="13" stroke-linecap="round"/>
  <path d="M104 248a152 72 0 0 1 304 0Z" fill="#4a9682"/><rect x="96" y="240" width="320" height="18" rx="9" fill="#24604f"/>
  <circle cx="256" cy="166" r="16" fill="#f2c25c"/><rect x="236" y="166" width="40" height="18" rx="8" fill="#f2c25c"/>
  <path d="M296 318c18-26 52-26 62-20-8 22-38 36-62 20Z" fill="#9fcf7a"/>
</svg>`;
const BASKET_ART = `<svg class="empty-art" viewBox="0 0 200 170" aria-hidden="true">
  <ellipse cx="100" cy="158" rx="70" ry="7" fill="#5a1d10" opacity=".15"/>
  <path d="M120 70 158 18" stroke="#e6b35a" stroke-width="16" stroke-linecap="round"/>
  <path d="M124 64l30-40" stroke="#c98f35" stroke-width="2" stroke-dasharray="6 7" stroke-linecap="round"/>
  <path d="M70 72 52 30" stroke="#e8742f" stroke-width="13" stroke-linecap="round"/>
  <path d="M52 30c-6-10-14-10-18-8M52 30c-2-11 2-15 6-17M52 30c6-7 12-8 16-6" stroke="#5fa04c" stroke-width="4" stroke-linecap="round" fill="none"/>
  <circle cx="98" cy="66" r="17" fill="#e2483a"/><path d="M92 50l6 5 6-5" stroke="#5fa04c" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M60 70 C60 22 140 22 140 70" stroke="#a8693a" stroke-width="7" fill="none"/>
  <path d="M28 72h144l-14 74a12 12 0 0 1-12 10H54a12 12 0 0 1-12-10Z" fill="#c98f5a"/>
  <path d="M38 96h124M44 122h112" stroke="#a8693a" stroke-width="4"/>
  <path d="M70 72v84M100 72v84M130 72v84" stroke="#a8693a" stroke-width="4" opacity=".6"/>
  <rect x="22" y="66" width="156" height="14" rx="7" fill="#a8693a"/>
</svg>`;

const TEMPS = [
  { id: '15', label: '≤ 15 min', test: t => t <= 15 },
  { id: '30', label: '≤ 30 min', test: t => t <= 30 },
  { id: '60', label: '≤ 1 h', test: t => t <= 60 },
  { id: 'plus', label: '> 1 h', test: t => t > 60 },
];

// Unités reconnues dans les lignes d'ingrédients (alias écrits sans accents).
const UNIT_ALIASES = {
  'g': ['g', 'gr', 'gramme', 'grammes'],
  'kg': ['kg', 'kilo', 'kilos', 'kilogramme', 'kilogrammes'],
  'ml': ['ml', 'millilitre', 'millilitres'],
  'cl': ['cl', 'centilitre', 'centilitres'],
  'dl': ['dl'],
  'l': ['l', 'litre', 'litres'],
  'c. à soupe': ['c. a soupe', 'c.a.s.', 'c.a.s', 'c a s', 'cas', 'cs', 'cuillere a soupe', 'cuilleres a soupe', 'cuil. a soupe', 'c. s.', 'c.s.'],
  'c. à café': ['c. a cafe', 'c.a.c.', 'c.a.c', 'c a c', 'cac', 'cc', 'cuillere a cafe', 'cuilleres a cafe', 'cuil. a cafe', 'c. c.', 'c.c.'],
  'pincée': ['pincee', 'pincees'],
  'gousse': ['gousse', 'gousses'],
  'tranche': ['tranche', 'tranches'],
  'botte': ['botte', 'bottes'],
  'bouquet': ['bouquet', 'bouquets'],
  'brin': ['brin', 'brins'],
  'feuille': ['feuille', 'feuilles'],
  'sachet': ['sachet', 'sachets'],
  'boîte': ['boite', 'boites'],
  'pot': ['pot', 'pots'],
  'verre': ['verre', 'verres'],
  'tasse': ['tasse', 'tasses'],
  'poignée': ['poignee', 'poignees'],
  'filet': ['filet', 'filets'],
  'morceau': ['morceau', 'morceaux'],
  'paquet': ['paquet', 'paquets'],
  'bocal': ['bocal', 'bocaux'],
};
// Unités de masse/volume convertibles : [unité de base, facteur]
const BASE = { g: ['g', 1], kg: ['g', 1000], ml: ['ml', 1], cl: ['ml', 10], dl: ['ml', 100], l: ['ml', 1000] };
const PRICE_UNITS = ['pièce', 'kg', 'g', 'l', 'cl', 'ml', 'botte', 'bouquet', 'sachet', 'boîte', 'pot', 'paquet', 'bocal'];

const RAYONS = [
  ['Fruits & légumes', 'pomme poire banane citron orange pamplemousse carotte oignon ail echalote tomate courgette aubergine poivron salade laitue mache roquette epinard poireau potimarron courge butternut potiron champignon pomme-de-terre pomme de terre patate patate douce chou chou-fleur brocoli haricot vert concombre radis betterave celeri fenouil navet panais topinambour blette artichaut asperge petit pois endive persil coriandre basilic menthe ciboulette thym romarin laurier sauge aneth estragon gingembre avocat fraise framboise myrtille cassis groseille kiwi mangue ananas raisin prune abricot peche nectarine melon pasteque clementine mandarine rhubarbe cerise figue coing citron vert legume fruit herbe'],
  ['Crèmerie & œufs', 'lait beurre creme oeuf fromage yaourt parmesan gruyere emmental comte mozzarella feta chevre ricotta mascarpone faisselle fromage blanc skyr roquefort reblochon camembert brie creme fraiche'],
  ['Boucherie & poissonnerie', 'poulet boeuf veau porc agneau dinde canard jambon lardon saucisse chorizo viande steak escalope saumon thon cabillaud colin crevette moule poisson lieu merlu sardine maquereau truite bacon magret filet mignon roti'],
  ['Boulangerie', 'pain baguette brioche pate brisee pate feuilletee pate sablee pate a pizza tortilla wrap'],
  ['Épicerie', 'lait de coco creme de coco lait d amande lait d avoine boisson vegetale farine sucre sel poivre huile vinaigre riz pate lentille pois chiche haricot rouge haricot blanc quinoa boulgour semoule epice cumin curry paprika cannelle muscade curcuma chocolat levure miel sirop moutarde sauce soja tamari bouillon concentre coulis conserve amande noisette noix cajou graine flocon avoine cafe the vanille olive capre cornichon tofu tempeh polenta fecule maizena biscuit compote confiture'],
];
const RAYON_ORDER = ['Fruits & légumes', 'Boulangerie', 'Boucherie & poissonnerie', 'Crèmerie & œufs', 'Épicerie', 'Autres'];

const STORE_KEY = 'carnet-recettes-v1';

/* =========================================================
   Utilitaires
   ========================================================= */

const $ = sel => document.querySelector(sel);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const mondayOf = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
const shortDate = d => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
const fmt = n => Number(n.toFixed(2)).toLocaleString('fr-FR');
const euro = n => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
const num = v => { const n = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? n : null; };

// Minuscule + accents retirés, en gardant la même longueur (pour comparer aux alias).
const fold = s => s.toLowerCase()
  .replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[îï]/g, 'i')
  .replace(/[ôö]/g, 'o').replace(/[ùûü]/g, 'u').replace(/ç/g, 'c').replace(/[’]/g, "'");

// Clé d'ingrédient : sans accents, sans parenthèses, mots au singulier.
function normKey(name) {
  return String(name).toLowerCase()
    .replace(/œ/g, 'oe').replace(/æ/g, 'ae')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9 -]/g, ' ')
    .split(/\s+/).filter(Boolean)
    .map(w => (w.length > 3 && /[sx]$/.test(w) ? w.slice(0, -1) : w))
    .join(' ');
}

function currentSeason(d = new Date()) {
  const m = d.getMonth();
  if (m >= 2 && m <= 4) return 'printemps';
  if (m >= 5 && m <= 7) return 'ete';
  if (m >= 8 && m <= 10) return 'automne';
  return 'hiver';
}

function lvcSearchUrl(name) {
  return 'https://www.google.com/search?q=' + encodeURIComponent('site:lavieclaire.com ' + name);
}

/* =========================================================
   Lecture des ingrédients ("200 g de farine")
   ========================================================= */

const ALIAS_LIST = Object.entries(UNIT_ALIASES)
  .flatMap(([unit, aliases]) => aliases.map(a => [a, unit]))
  .sort((a, b) => b[0].length - a[0].length);
const FRACTIONS = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3 };

function parseIngredient(line) {
  let s = line.trim().replace(/^[-•*·]\s*/, '');
  if (!s) return null;
  let qty = null;
  let unit = '';

  const m = s.match(/^(\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+))?(?:\s*(?:-|à|a)\s*\d+(?:[.,]\d+)?(?=\s|$|[a-zA-Z]))?/);
  if (m) {
    qty = parseFloat(m[1].replace(',', '.'));
    if (m[2]) qty /= parseFloat(m[2]);
    s = s.slice(m[0].length);
  } else if (FRACTIONS[s[0]] !== undefined) {
    qty = FRACTIONS[s[0]];
    s = s.slice(1);
  }
  if (qty !== null) {
    const t = s.trimStart();
    if (FRACTIONS[t[0]] !== undefined) { qty += FRACTIONS[t[0]]; s = t.slice(1); }
  }
  s = s.trimStart();

  const low = fold(s);
  for (const [alias, u] of ALIAS_LIST) {
    if (low.startsWith(alias)) {
      const next = low.charAt(alias.length);
      if (next === '' || /\s/.test(next)) {
        unit = u;
        s = s.slice(alias.length).trimStart();
        break;
      }
    }
  }
  s = s.replace(/^(?:de\s+la\s+|de\s+l['’]\s*|du\s+|des\s+|de\s+|d['’]\s*)/i, '').trim();
  if (!s) return null;
  return { qty, unit, name: s };
}

function parseIngredients(text) {
  return String(text || '').split('\n').map(parseIngredient).filter(Boolean);
}

// Une ligne sans quantité "sel, poivre" ou "sel et poivre" devient plusieurs articles.
function expandIngredient(ing) {
  const clean = ing.name.replace(/\(.*?\)/g, '').trim();
  if (ing.qty === null && !ing.unit) {
    return clean.split(/,|\set\s/).map(n => n.trim()).filter(Boolean).map(name => ({ qty: null, unit: '', name }));
  }
  return [{ ...ing, name: clean.split(',')[0].trim() || clean }];
}

function unitLabel(unit, q) {
  if (!unit || BASE[unit] || unit.startsWith('c. à')) return unit;
  if (q > 1 && !/[sx]$/.test(unit)) return unit === 'morceau' ? 'morceaux' : unit === 'bocal' ? 'bocaux' : unit + 's';
  return unit;
}

// Pour les courses : on arrondit au-dessus (on n'achète pas 4,67 pommes).
function shopQty(q, base) {
  if (q === null || base === 'g' || base === 'ml') return q;
  if (!base) return Math.ceil(q - 0.01);
  return Math.ceil(q * 2 - 0.01) / 2;
}

// Dans une recette : quantités "à la cuisinière" (¼, ½…) pour les unités non métriques.
function roundCount(q) {
  return q >= 2 ? Math.round(q * 2) / 2 : Math.max(0.25, Math.round(q * 4) / 4);
}

function fmtQty(q, base) {
  if (q === null) return '';
  if (base === 'g') return q >= 1000 ? fmt(q / 1000) + ' kg' : fmt(Math.round(q)) + ' g';
  if (base === 'ml') return q >= 1000 ? fmt(q / 1000) + ' l' : q >= 100 ? fmt(q / 10) + ' cl' : fmt(q) + ' ml';
  if (!base) return fmt(q);
  return fmt(q) + ' ' + unitLabel(base, q);
}

function ingredientText(ing, ratio = 1) {
  if (ing.qty === null) return esc((ing.unit ? ing.unit + ' de ' : '') + ing.name);
  const q = BASE[ing.unit] || ratio === 1 ? ing.qty * ratio : roundCount(ing.qty * ratio);
  const u = ing.unit ? ' ' + unitLabel(ing.unit, q) : '';
  const sep = ing.unit ? (/^[aeiouyhéèêâîô]/i.test(ing.name) ? " d'" : ' de ') : ' ';
  return `<b>${fmt(q)}${esc(u)}</b>${esc(sep + ing.name)}`;
}

/* =========================================================
   Rayons
   ========================================================= */

const RAYON_KEYWORDS = RAYONS.flatMap(([rayon, words]) => {
  // Les mots composés sont séparés par des espaces dans la liste : on reconstruit
  // les expressions connues en essayant les groupes de 1 à 4 mots.
  const tokens = words.split(' ');
  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    for (let n = 1; n <= 4 && i + n <= tokens.length; n++) {
      out.push([normKey(tokens.slice(i, i + n).join(' ')), rayon]);
    }
  }
  return out;
}).sort((a, b) => b[0].length - a[0].length);

const rayonCache = new Map();
function guessRayon(key) {
  if (rayonCache.has(key)) return rayonCache.get(key);
  const hay = ' ' + key + ' ';
  let found = 'Autres';
  for (const [kw, rayon] of RAYON_KEYWORDS) {
    if (kw && hay.includes(' ' + kw + ' ')) { found = rayon; break; }
  }
  if (found === 'Autres') {
    // deuxième essai : mot-clé en début de mot (ex. "tomates cerises")
    for (const [kw, rayon] of RAYON_KEYWORDS) {
      if (kw.length > 2 && hay.includes(' ' + kw)) { found = rayon; break; }
    }
  }
  rayonCache.set(key, found);
  return found;
}

/* =========================================================
   Données
   ========================================================= */

function emptyState() {
  return { recipes: [], plan: {}, prices: {}, checked: {}, extras: {} };
}

function normalizeState(s) {
  const st = { ...emptyState(), ...s };
  st.recipes = (st.recipes || []).map(r => ({
    id: r.id || uid(),
    nom: r.nom || 'Sans titre',
    categorie: r.categorie || 'Plat',
    saisons: Array.isArray(r.saisons) ? r.saisons : [],
    prep: num(r.prep) ?? 0,
    cuisson: num(r.cuisson) ?? 0,
    portions: num(r.portions) || 4,
    ingredientsText: r.ingredientsText || '',
    ingredients: parseIngredients(r.ingredientsText || ''),
    etapes: r.etapes || '',
    notes: r.notes || '',
    photo: r.photo || '',
    favori: !!r.favori,
    cree: r.cree || Date.now(),
  }));
  return st;
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch (e) { /* données illisibles : on repart à vide */ }
  return emptyState();
}

let state = load();

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    toast('⚠️ Mémoire pleine : retire quelques photos ou exporte tes données.');
  }
}

const getRecipe = id => state.recipes.find(r => r.id === id);
const totalTime = r => (r.prep || 0) + (r.cuisson || 0);
const fmtTime = min => {
  if (!min) return '';
  if (min < 60) return min + ' min';
  const h = Math.floor(min / 60), m = min % 60;
  return h + ' h' + (m ? ' ' + pad(m) : '');
};

/* =========================================================
   Planning, liste de courses, prix
   ========================================================= */

function slotKey(date, repas) { return date + '|' + repas; }

function weekEntries(weekStart) {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = iso(addDays(fromIso(weekStart), i));
    for (const r of REPAS) {
      for (const e of state.plan[slotKey(d, r.id)] || []) {
        const rec = getRecipe(e.rid);
        if (rec) out.push({ ...e, rec, date: d, repas: r.id });
      }
    }
  }
  return out;
}

// Additionne les ingrédients de plusieurs recettes (avec portions ajustées).
function aggregate(entries, extras = []) {
  const map = new Map();
  const add = (item, ratio, source) => {
    const nameKey = normKey(item.name);
    if (!nameKey) return;
    let base = item.unit || '';
    let q = null;
    if (item.qty !== null) {
      if (BASE[item.unit]) { base = BASE[item.unit][0]; q = item.qty * BASE[item.unit][1] * ratio; }
      else q = item.qty * ratio;
    }
    const key = nameKey + '|' + base;
    let entry = map.get(key);
    if (!entry) {
      entry = { key, nameKey, name: item.name, base, qty: null, sources: new Set(), extra: false };
      map.set(key, entry);
    }
    if (q !== null) entry.qty = (entry.qty || 0) + q;
    if (source) entry.sources.add(source);
  };
  for (const e of entries) {
    const ratio = e.rec.portions ? e.portions / e.rec.portions : 1;
    for (const ing of e.rec.ingredients) for (const it of expandIngredient(ing)) add(it, ratio, e.rec.nom);
  }
  for (const x of extras) {
    const ing = parseIngredient(x.text);
    if (!ing) continue;
    for (const it of expandIngredient(ing)) {
      add(it, 1, null);
      const nameKey = normKey(it.name);
      const base = it.qty !== null && BASE[it.unit] ? BASE[it.unit][0] : (it.unit || '');
      const entry = map.get(nameKey + '|' + base);
      if (entry) { entry.extra = true; entry.extraIds = [...(entry.extraIds || []), x.id]; }
    }
  }
  return [...map.values()];
}

function priceBase(p) {
  if (BASE[p.unite]) return [BASE[p.unite][0], p.quantite * BASE[p.unite][1]];
  if (p.unite === 'pièce') return ['', p.quantite];
  return [p.unite, p.quantite];
}

function itemCost(entry) {
  const p = state.prices[entry.nameKey];
  if (!p || entry.qty === null || !p.quantite) return null;
  const [base, amount] = priceBase(p);
  if (base !== entry.base) return null;
  return entry.qty / amount * p.prix;
}

function costSummary(items) {
  let total = 0, missing = 0;
  for (const it of items) {
    const c = itemCost(it);
    if (c === null) missing++; else total += c;
  }
  return { total, missing };
}

function recipeCost(rec, portions) {
  return costSummary(aggregate([{ rec, portions }]));
}

function fmtPrice(p) {
  if (!p) return '';
  const q = p.quantite === 1 && (p.unite === 'kg' || p.unite === 'l' || p.unite === 'pièce') ? '' : fmt(p.quantite) + ' ';
  const article = p.unite === 'pièce' ? 'la' : (p.quantite === 1 ? 'le' : 'les');
  return `${euro(p.prix)} ${article} ${q}${p.unite}`;
}

/* =========================================================
   État de l'interface
   ========================================================= */

const ui = {
  tab: 'recettes',
  q: '',
  saison: null,
  temps: null,
  cat: '',
  fav: false,
  tri: 'nom',
  weekStart: iso(mondayOf(new Date())),
  prixQ: '',
  pickerQ: '',
  pickerSaison: null,
};

/* =========================================================
   Rendu : Recettes
   ========================================================= */

function chip(label, active, action, value, extra = '') {
  return `<button class="chip${active ? ' on' : ''}" data-action="${action}" data-value="${esc(value)}" ${extra}>${label}</button>`;
}

function filterRecipes({ q = '', saison = null, temps = null, cat = '', fav = false, tri = 'nom' }) {
  const fq = normKey(q);
  let list = state.recipes.filter(r => {
    if (fq && !normKey(r.nom + ' ' + r.ingredientsText + ' ' + r.categorie).includes(fq)) return false;
    if (saison && r.saisons.length && !r.saisons.includes(saison)) return false;
    if (temps) { const t = TEMPS.find(x => x.id === temps); if (t && !t.test(totalTime(r))) return false; }
    if (cat && r.categorie !== cat) return false;
    if (fav && !r.favori) return false;
    return true;
  });
  const cmp = {
    nom: (a, b) => a.nom.localeCompare(b.nom, 'fr'),
    rapide: (a, b) => totalTime(a) - totalTime(b) || a.nom.localeCompare(b.nom, 'fr'),
    recent: (a, b) => b.cree - a.cree,
  }[tri];
  return list.sort(cmp);
}

function seasonBadges(r) {
  if (!r.saisons.length || r.saisons.length === 4) return '<span class="muted">Toute l’année</span>';
  return SAISONS.filter(s => r.saisons.includes(s.id)).map(s => `<span title="${s.label}">${s.emoji}</span>`).join('');
}

function plate(r) {
  return `<div class="plate" style="--c: ${CAT_COLOR[r.categorie] || '#d4572f'}" aria-hidden="true">${r.photo ? `<img src="${r.photo}" alt="">` : (CAT_EMOJI[r.categorie] || '🍽️')}</div>`;
}

function seasonDots(r) {
  if (!r.saisons.length || r.saisons.length === 4) return '<span>Toute l’année</span>';
  return `<span class="season-dots">${SAISONS.filter(s => r.saisons.includes(s.id)).map(s => `<i style="--c: var(--s-${s.id})" title="${s.label}"></i>`).join('')}</span>
    <span>${SAISONS.filter(s => r.saisons.includes(s.id)).map(s => s.label).join(', ')}</span>`;
}

function recipeCard(r, i = 0) {
  const t = totalTime(r);
  return `<button class="card recipe-card" style="--i: ${i}; --c: ${CAT_COLOR[r.categorie] || '#d4572f'}" data-action="open-recipe" data-id="${r.id}">
    ${plate(r)}
    <div class="card-body">
      <div class="card-title">${esc(r.nom)}</div>
      <div class="card-meta">
        ${t ? `<span class="pill">⏱ ${fmtTime(t)}</span>` : ''}
        ${seasonDots(r)}
      </div>
    </div>
    ${r.favori ? '<span class="fav-ribbon star">★</span>' : ''}
  </button>`;
}

function renderRecettes() {
  if (!state.recipes.length) {
    return `<div class="empty">
      ${POT_ART}
      <h2>Ton carnet est vide</h2>
      <p>Ajoute ta première recette, ou charge quelques exemples pour découvrir l’appli.</p>
      <button class="btn primary" data-action="new-recipe">+ Ajouter une recette</button>
      <button class="btn" data-action="load-examples">Charger des exemples</button>
    </div>`;
  }
  const now = currentSeason();
  return `
    <div class="filters">
      <input type="search" id="search" class="input" placeholder="Rechercher une recette, un ingrédient…" value="${esc(ui.q)}" autocomplete="off">
      <div class="chips" role="group" aria-label="Saison">
        ${chip('Toutes saisons', !ui.saison, 'f-saison', '')}
        ${SAISONS.map(s => chip(`${s.emoji} ${s.label}${s.id === now ? ' •' : ''}`, ui.saison === s.id, 'f-saison', s.id, `style="--c: var(--s-${s.id})"`)).join('')}
      </div>
      <div class="chips" role="group" aria-label="Temps">
        ${chip('⏱ Tous temps', !ui.temps, 'f-temps', '')}
        ${TEMPS.map(t => chip(t.label, ui.temps === t.id, 'f-temps', t.id)).join('')}
      </div>
      <div class="row">
        <select id="f-cat" class="input small" aria-label="Catégorie">
          <option value="">Toutes catégories</option>
          ${CATEGORIES.map(c => `<option ${ui.cat === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <select id="f-tri" class="input small" aria-label="Trier">
          <option value="nom" ${ui.tri === 'nom' ? 'selected' : ''}>A → Z</option>
          <option value="rapide" ${ui.tri === 'rapide' ? 'selected' : ''}>Plus rapides</option>
          <option value="recent" ${ui.tri === 'recent' ? 'selected' : ''}>Plus récentes</option>
        </select>
        ${chip(ui.fav ? '★ Favoris' : '☆ Favoris', ui.fav, 'f-fav', '')}
      </div>
    </div>
    <div id="recipe-list"></div>
    <button class="fab" data-action="new-recipe" aria-label="Nouvelle recette">+</button>`;
}

function renderRecipeList() {
  const el = $('#recipe-list');
  if (!el) return;
  const list = filterRecipes(ui);
  el.innerHTML = list.length
    ? `<p class="count">${list.length} recette${list.length > 1 ? 's' : ''}</p><div class="cards">${list.map((r, i) => recipeCard(r, i)).join('')}</div>`
    : '<p class="empty-small">Aucune recette ne correspond à ces filtres.</p>';
}

/* =========================================================
   Rendu : Semaine
   ========================================================= */

function weekNav() {
  const start = fromIso(ui.weekStart);
  const end = addDays(start, 6);
  const isCurrent = ui.weekStart === iso(mondayOf(new Date()));
  return `<div class="chalkboard">
    <button class="icon-btn" data-action="week" data-value="-7" aria-label="Semaine précédente">‹</button>
    <div class="chalk-title">
      <strong>${ui.tab === 'courses' ? 'Courses' : 'Menu'} ${isCurrent ? 'de la semaine' : 'du ' + shortDate(start)}</strong>
      <i class="chalk-line"></i>
      <span>du ${shortDate(start)} au ${shortDate(end)}</span>
    </div>
    <button class="icon-btn" data-action="week" data-value="7" aria-label="Semaine suivante">›</button>
  </div>`;
}

function renderSemaine() {
  const start = fromIso(ui.weekStart);
  const today = iso(new Date());
  const entries = weekEntries(ui.weekStart);
  const days = JOURS.map((jour, i) => {
    const d = iso(addDays(start, i));
    const slots = REPAS.map(r => {
      const list = state.plan[slotKey(d, r.id)] || [];
      const items = list.map((e, idx) => {
        const rec = getRecipe(e.rid);
        if (!rec) return '';
        return `<div class="planned">
          <button class="planned-name" data-action="open-recipe" data-id="${rec.id}">${esc(rec.nom)}</button>
          <div class="stepper" aria-label="Portions">
            <button data-action="plan-portions" data-slot="${slotKey(d, r.id)}" data-idx="${idx}" data-value="-1" aria-label="Moins">−</button>
            <span>${e.portions} p.</span>
            <button data-action="plan-portions" data-slot="${slotKey(d, r.id)}" data-idx="${idx}" data-value="1" aria-label="Plus">+</button>
          </div>
          <button class="icon-btn small" data-action="plan-remove" data-slot="${slotKey(d, r.id)}" data-idx="${idx}" aria-label="Retirer">✕</button>
        </div>`;
      }).join('');
      return `<div class="slot">
        <div class="slot-label">${r.id === 'midi' ? '☀️' : '🌙'}<br>${r.label}</div>
        <div class="slot-items">${items}
          <button class="add-slot" data-action="pick-recipe" data-slot="${slotKey(d, r.id)}">+ Ajouter</button>
        </div>
      </div>`;
    }).join('');
    return `<section class="day${d === today ? ' today' : ''}" style="--i: ${i}" aria-label="${jour}">
      <div class="date-badge"><small>${jour.slice(0, 3)}</small><b>${addDays(start, i).getDate()}</b></div>
      <div class="slots">${slots}</div>
    </section>`;
  }).join('');

  const cost = costSummary(shoppingItems());
  return `${weekNav()}
    <div class="summary">
      <span>${entries.length} repas prévu${entries.length > 1 ? 's' : ''}</span>
      ${cost.total ? `<span class="pill mustard">≈ ${euro(cost.total)}${cost.missing ? '*' : ''}</span>` : ''}
    </div>
    ${days}
    <div class="actions-bottom">
      <button class="btn primary" data-tab="courses">🛒 Voir la liste de courses</button>
      ${entries.length ? '<button class="btn ghost" data-action="clear-week">Vider la semaine</button>' : ''}
    </div>`;
}

/* =========================================================
   Rendu : Courses
   ========================================================= */

function shoppingItems() {
  const items = aggregate(weekEntries(ui.weekStart), state.extras[ui.weekStart] || []);
  const checked = state.checked[ui.weekStart] || {};
  for (const it of items) {
    it.rayon = guessRayon(it.nameKey);
    it.checked = !!checked[it.key];
    it.qty = shopQty(it.qty, it.base);
    it.cost = itemCost(it);
  }
  return items;
}

function renderCourses() {
  const items = shoppingItems();
  const groups = new Map();
  for (const it of items) {
    if (!groups.has(it.rayon)) groups.set(it.rayon, []);
    groups.get(it.rayon).push(it);
  }
  const { total, missing } = costSummary(items);
  const left = items.filter(i => !i.checked).length;

  const groupHtml = RAYON_ORDER.filter(r => groups.has(r)).map(rayon => {
    const list = groups.get(rayon).sort((a, b) => (a.checked - b.checked) || a.name.localeCompare(b.name, 'fr'));
    return `<section class="group">
      <h3>${esc(rayon)}</h3>
      ${list.map(it => `<div class="item${it.checked ? ' checked' : ''}">
        <label class="item-check">
          <input type="checkbox" data-action="check" data-key="${esc(it.key)}" ${it.checked ? 'checked' : ''}>
          <span class="item-text">
            <span class="item-name">${esc(it.name)}</span>
            ${it.qty !== null ? `<span class="item-qty">${fmtQty(it.qty, it.base)}</span>` : ''}
            ${it.sources.size ? `<span class="item-src">${[...it.sources].map(esc).join(' · ')}</span>` : ''}
          </span>
        </label>
        <button class="price-tag${it.cost === null ? ' none' : ''}" data-action="edit-price" data-key="${esc(it.nameKey)}" data-name="${esc(it.name)}" data-base="${esc(it.base)}">
          ${it.cost !== null ? '≈ ' + euro(it.cost) : (state.prices[it.nameKey] ? 'unité ?' : '+ prix')}
        </button>
        ${it.extra ? `<button class="icon-btn small" data-action="extra-remove" data-ids="${esc((it.extraIds || []).join(','))}" aria-label="Retirer">✕</button>` : ''}
      </div>`).join('')}
    </section>`;
  }).join('');

  return `${weekNav()}
    <form class="add-extra" data-form="extra">
      <input name="text" class="input" placeholder="Ajouter un article (ex. 1 kg de pommes)" autocomplete="off">
      <button class="btn primary" type="submit">Ajouter</button>
    </form>
    ${items.length ? `
      <div class="summary">
        <span>${left} article${left > 1 ? 's' : ''} à acheter</span>
        ${total ? `<span class="pill mustard">≈ <b>${euro(total)}</b></span>` : ''}
      </div>
      ${missing ? `<p class="hint">${missing} article${missing > 1 ? 's' : ''} sans prix. Touche « + prix » pour en noter un (prix La Vie Claire par exemple).</p>` : ''}
      <div class="notepad">${groupHtml}</div>
      <div class="actions-bottom">
        <button class="btn" data-action="share-list">📤 Partager la liste</button>
        <button class="btn ghost" data-action="uncheck-all">Tout décocher</button>
      </div>`
    : `<div class="empty">
        ${BASKET_ART}
        <h2>Rien à acheter pour l’instant</h2>
        <p>Choisis des recettes dans l’onglet <b>Semaine</b> : la liste se remplit toute seule.</p>
        <button class="btn primary" data-tab="semaine">📅 Planifier la semaine</button>
      </div>`}`;
}

function listAsText() {
  const items = shoppingItems().filter(i => !i.checked);
  const start = fromIso(ui.weekStart);
  let txt = `🛒 Courses – semaine du ${shortDate(start)}\n`;
  for (const rayon of RAYON_ORDER) {
    const list = items.filter(i => i.rayon === rayon);
    if (!list.length) continue;
    txt += `\n${rayon}\n`;
    for (const it of list) txt += `☐ ${it.name}${it.qty !== null ? ' – ' + fmtQty(it.qty, it.base) : ''}\n`;
  }
  return txt;
}

/* =========================================================
   Rendu : Prix
   ========================================================= */

function allIngredients() {
  const map = new Map();
  for (const r of state.recipes) {
    for (const ing of r.ingredients) for (const it of expandIngredient(ing)) {
      const k = normKey(it.name);
      if (!k) continue;
      const base = it.qty !== null && BASE[it.unit] ? BASE[it.unit][0] : (it.unit || '');
      if (!map.has(k)) map.set(k, { key: k, name: it.name, base });
    }
  }
  for (const [k, p] of Object.entries(state.prices)) if (!map.has(k)) map.set(k, { key: k, name: p.nom || k, base: '' });
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

function renderPrix() {
  return `
    <div class="info">
      <p><b>Relier tes courses aux prix La Vie Claire</b></p>
      <p>Note le prix d’un produit une seule fois (en magasin ou sur le site) : l’appli s’en souvient et
      estime le coût de chaque recette et de ta liste de courses. Le bouton 🔎 ouvre la recherche du produit sur lavieclaire.com.</p>
    </div>
    <input type="search" id="prix-search" class="input" placeholder="Rechercher un ingrédient…" value="${esc(ui.prixQ)}" autocomplete="off">
    <div id="prix-list"></div>`;
}

function renderPrixList() {
  const el = $('#prix-list');
  if (!el) return;
  const q = normKey(ui.prixQ);
  const list = allIngredients().filter(i => !q || i.key.includes(q));
  if (!list.length) {
    el.innerHTML = `<p class="empty-small">${state.recipes.length ? 'Aucun ingrédient trouvé.' : 'Les ingrédients de tes recettes apparaîtront ici.'}</p>`;
    return;
  }
  const priced = list.filter(i => state.prices[i.key]).length;
  el.innerHTML = `<p class="count">${priced} / ${list.length} ingrédients avec un prix</p>
    <div class="price-list">${list.map(i => {
      const p = state.prices[i.key];
      return `<div class="price-row">
        <div class="price-name">${esc(i.name)}
          ${p ? `<span class="price-val">${fmtPrice(p)}${p.date ? ` <span class="muted">· ${new Date(p.date).toLocaleDateString('fr-FR')}</span>` : ''}</span>` : '<span class="muted">pas de prix</span>'}
        </div>
        <a class="icon-btn small" href="${lvcSearchUrl(i.name)}" target="_blank" rel="noopener" aria-label="Chercher sur La Vie Claire">🔎</a>
        <button class="btn small" data-action="edit-price" data-key="${esc(i.key)}" data-name="${esc(i.name)}" data-base="${esc(i.base)}">${p ? 'Modifier' : '+ Prix'}</button>
      </div>`;
    }).join('')}</div>`;
}

/* =========================================================
   Fenêtres (modales)
   ========================================================= */

const modal = $('#modal');
let modalOnClose = null;

function openModal(html, onMount) {
  $('#modal-body').innerHTML = html;
  if (!modal.open) modal.showModal();
  modal.scrollTop = 0;
  if (onMount) onMount($('#modal-body'));
}
function closeModal() {
  if (modal.open) modal.close();
}
modal.addEventListener('close', () => { if (modalOnClose) { const f = modalOnClose; modalOnClose = null; f(); } });
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

function showRecipe(id, portions) {
  const r = getRecipe(id);
  if (!r) return;
  const p = portions || r.portions;
  const ratio = p / r.portions;
  const steps = r.etapes.split('\n').map(s => s.trim()).filter(Boolean);
  const cost = recipeCost(r, p);
  openModal(`
    <div class="hero-wrap">${r.photo ? `<img class="hero" src="${r.photo}" alt="">` : `<div class="hero-art">${plate(r)}</div>`}</div>
    <div class="modal-head">
      <h2>${esc(r.nom)}</h2>
      <button class="icon-btn fav" data-action="toggle-fav" data-id="${r.id}" aria-label="Favori">${r.favori ? '★' : '☆'}</button>
    </div>
    <div class="meta-line">
      <span class="pill">${CAT_EMOJI[r.categorie] || ''} ${esc(r.categorie)}</span>
      <span class="pill sage">${seasonBadges(r)}</span>
      ${r.prep ? `<span class="pill">🔪 ${fmtTime(r.prep)}</span>` : ''}
      ${r.cuisson ? `<span class="pill">🔥 ${fmtTime(r.cuisson)}</span>` : ''}
      ${cost.total ? `<span class="pill mustard">≈ ${euro(cost.total)}${cost.missing ? '*' : ''}</span>` : ''}
    </div>
    <div class="portions">
      <span>Pour</span>
      <div class="stepper big">
        <button data-action="detail-portions" data-id="${r.id}" data-value="${Math.max(1, p - 1)}" aria-label="Moins">−</button>
        <span>${p} pers.</span>
        <button data-action="detail-portions" data-id="${r.id}" data-value="${p + 1}" aria-label="Plus">+</button>
      </div>
    </div>
    <h3>Ingrédients</h3>
    ${r.ingredients.length ? `<ul class="ing-list">${r.ingredients.map(i => `<li>${ingredientText(i, ratio)}</li>`).join('')}</ul>` : '<p class="muted">Aucun ingrédient.</p>'}
    ${steps.length ? `<h3>Préparation</h3><ol class="steps">${steps.map(s => `<li>${esc(s.replace(/^\d+[.)-]\s*/, ''))}</li>`).join('')}</ol>` : ''}
    ${r.notes ? `<h3>Notes</h3><p class="notes">${esc(r.notes)}</p>` : ''}
    ${cost.total && cost.missing ? `<p class="hint">* estimation partielle : ${cost.missing} ingrédient${cost.missing > 1 ? 's' : ''} sans prix.</p>` : ''}
    <div class="modal-actions">
      <button class="btn primary" data-action="plan-recipe" data-id="${r.id}" data-portions="${p}">📅 Planifier</button>
      <button class="btn" data-action="edit-recipe" data-id="${r.id}">✏️ Modifier</button>
      <button class="btn danger" data-action="delete-recipe" data-id="${r.id}">🗑</button>
      <button class="btn ghost" data-action="close">Fermer</button>
    </div>`);
}

let formPhoto = '';

function showRecipeForm(id) {
  const r = id ? getRecipe(id) : null;
  formPhoto = r?.photo || '';
  const now = currentSeason();
  const saisons = r ? r.saisons : [];
  openModal(`
    <h2>${r ? 'Modifier la recette' : 'Nouvelle recette'}</h2>
    <form data-form="recipe" data-id="${r?.id || ''}" class="form">
      <label>Nom<input name="nom" class="input" required value="${esc(r?.nom || '')}" placeholder="Ex. Soupe de potimarron"></label>
      <div class="row">
        <label>Catégorie<select name="categorie" class="input">${CATEGORIES.map(c => `<option ${(r?.categorie || 'Plat') === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
        <label>Portions<input name="portions" class="input" type="number" min="1" inputmode="numeric" value="${r?.portions || 4}"></label>
      </div>
      <fieldset>
        <legend>Saisons <span class="muted">(aucune = toute l’année)</span></legend>
        <div class="chips">${SAISONS.map(s => `<label class="chip check" style="--c: var(--s-${s.id})"><input type="checkbox" name="saisons" value="${s.id}" ${saisons.includes(s.id) ? 'checked' : ''}><span>${s.emoji} ${s.label}${s.id === now ? ' •' : ''}</span></label>`).join('')}</div>
      </fieldset>
      <div class="row">
        <label>Préparation (min)<input name="prep" class="input" type="number" min="0" inputmode="numeric" value="${r?.prep || ''}" placeholder="15"></label>
        <label>Cuisson (min)<input name="cuisson" class="input" type="number" min="0" inputmode="numeric" value="${r?.cuisson || ''}" placeholder="30"></label>
      </div>
      <label>Ingrédients <span class="muted">(un par ligne : « 200 g de farine », « 3 œufs », « sel, poivre »)</span>
        <textarea name="ingredientsText" class="input" rows="8" placeholder="1 potimarron&#10;2 pommes de terre&#10;1 oignon&#10;20 cl de crème&#10;sel, poivre">${esc(r?.ingredientsText || '')}</textarea>
      </label>
      <div id="ing-preview" class="ing-preview"></div>
      <label>Préparation <span class="muted">(une étape par ligne)</span>
        <textarea name="etapes" class="input" rows="7">${esc(r?.etapes || '')}</textarea>
      </label>
      <label>Notes<textarea name="notes" class="input" rows="2" placeholder="Astuces, variantes, d’où vient la recette…">${esc(r?.notes || '')}</textarea></label>
      <div class="photo-field">
        <div id="photo-preview">${formPhoto ? `<img src="${formPhoto}" alt="">` : ''}</div>
        <button type="button" class="btn" data-action="pick-photo">📷 ${formPhoto ? 'Changer la photo' : 'Ajouter une photo'}</button>
        ${formPhoto ? '<button type="button" class="btn ghost" data-action="remove-photo">Retirer</button>' : ''}
      </div>
      <div class="modal-actions">
        <button class="btn primary" type="submit">Enregistrer</button>
        <button class="btn ghost" type="button" data-action="${r ? 'open-recipe' : 'close'}" data-id="${r?.id || ''}">Annuler</button>
      </div>
    </form>`, body => {
    const ta = body.querySelector('[name=ingredientsText]');
    const update = () => {
      const list = parseIngredients(ta.value);
      body.querySelector('#ing-preview').innerHTML = list.length
        ? 'Compris : ' + list.map(i => `<span class="pill small">${i.qty !== null ? fmt(i.qty) + ' ' : ''}${esc(i.unit ? i.unit + ' · ' : '')}${esc(i.name)}</span>`).join('')
        : '';
    };
    ta.addEventListener('input', update);
    update();
    if (!r) body.querySelector('[name=nom]').focus();
  });
}

function showPicker(slot) {
  ui.pickerQ = '';
  ui.pickerSaison = null;
  const [date, repas] = slot.split('|');
  const d = fromIso(date);
  const label = `${JOURS[(d.getDay() + 6) % 7]} ${REPAS.find(r => r.id === repas).label.toLowerCase()}`;
  if (!state.recipes.length) {
    openModal(`<h2>Aucune recette</h2><p>Ajoute d’abord des recettes dans ton carnet.</p>
      <div class="modal-actions"><button class="btn primary" data-action="new-recipe">+ Ajouter une recette</button><button class="btn ghost" data-action="close">Fermer</button></div>`);
    return;
  }
  const now = currentSeason();
  openModal(`
    <h2>${label}</h2>
    <input type="search" id="picker-search" class="input" placeholder="Rechercher…" autocomplete="off">
    <div class="chips">
      ${chip('Toutes', true, 'picker-saison', '')}
      ${SAISONS.map(s => chip(`${s.emoji} ${s.label}${s.id === now ? ' •' : ''}`, false, 'picker-saison', s.id, `style="--c: var(--s-${s.id})"`)).join('')}
    </div>
    <div id="picker-list" class="picker-list" data-slot="${slot}"></div>
    <div class="modal-actions"><button class="btn ghost" data-action="close">Fermer</button></div>`, body => {
    renderPickerList();
    body.querySelector('#picker-search').addEventListener('input', e => { ui.pickerQ = e.target.value; renderPickerList(); });
  });
}

function renderPickerList() {
  const el = $('#picker-list');
  if (!el) return;
  const list = filterRecipes({ q: ui.pickerQ, saison: ui.pickerSaison, tri: 'nom' });
  el.innerHTML = list.length ? list.map(r => `<button class="picker-item" data-action="pick" data-id="${r.id}">
    <span>${CAT_EMOJI[r.categorie] || '🍽️'} ${esc(r.nom)}${r.favori ? ' <span class="star">★</span>' : ''}</span>
    <span class="muted">${totalTime(r) ? fmtTime(totalTime(r)) : ''}</span>
  </button>`).join('') : '<p class="empty-small">Aucune recette.</p>';
  $('#modal-body').querySelectorAll('[data-action=picker-saison]').forEach(b => b.classList.toggle('on', (b.dataset.value || null) === ui.pickerSaison));
}

function showPlanForm(id, portions) {
  const r = getRecipe(id);
  const thisWeek = iso(mondayOf(new Date()));
  const def = ui.weekStart === thisWeek ? iso(new Date()) : ui.weekStart;
  const hour = new Date().getHours();
  openModal(`
    <h2>Planifier « ${esc(r.nom)} »</h2>
    <form data-form="plan" data-id="${r.id}" class="form">
      <div class="row">
        <label>Jour<input type="date" name="date" class="input" value="${def}" required></label>
        <label>Repas<select name="repas" class="input">${REPAS.map(x => `<option value="${x.id}" ${(hour >= 14 ? 'soir' : 'midi') === x.id ? 'selected' : ''}>${x.label}</option>`).join('')}</select></label>
      </div>
      <label>Portions<input type="number" name="portions" class="input" min="1" inputmode="numeric" value="${portions || r.portions}"></label>
      <div class="modal-actions">
        <button class="btn primary" type="submit">Ajouter au planning</button>
        <button class="btn ghost" type="button" data-action="open-recipe" data-id="${r.id}">Annuler</button>
      </div>
    </form>`);
}

function showPriceForm(key, name, base) {
  const p = state.prices[key];
  const defUnit = p?.unite || (base === 'g' ? 'kg' : base === 'ml' ? 'l' : base || 'pièce');
  const units = [...new Set([...PRICE_UNITS, defUnit])];
  const exemple = base === 'g' ? 'ex. 3,20 € le kg, ou 1,95 € les 500 g' : base === 'ml' ? 'ex. 1,49 € le l' : 'ex. 0,80 € la pièce';
  openModal(`
    <h2>Prix : ${esc(name)}</h2>
    <form data-form="price" data-key="${esc(key)}" data-name="${esc(name)}" class="form">
      <div class="row price-row-form">
        <label>Prix (€)<input name="prix" class="input" inputmode="decimal" required value="${p ? String(p.prix).replace('.', ',') : ''}" placeholder="2,40"></label>
        <label>pour<input name="quantite" class="input" inputmode="decimal" required value="${p ? String(p.quantite).replace('.', ',') : '1'}"></label>
        <label>unité<select name="unite" class="input">${units.map(u => `<option ${u === defUnit ? 'selected' : ''}>${esc(u)}</option>`).join('')}</select></label>
      </div>
      <p class="hint">${exemple}. L’unité doit correspondre à celle des recettes (poids, volume ou pièces) pour que le coût soit calculé.</p>
      <a class="btn" href="${lvcSearchUrl(name)}" target="_blank" rel="noopener">🔎 Chercher « ${esc(name)} » sur La Vie Claire</a>
      <div class="modal-actions">
        <button class="btn primary" type="submit">Enregistrer</button>
        ${p ? '<button class="btn danger" type="button" data-action="delete-price" data-key="' + esc(key) + '">Supprimer</button>' : ''}
        <button class="btn ghost" type="button" data-action="close">Annuler</button>
      </div>
    </form>`);
}

function showMenu() {
  const n = state.recipes.length;
  let size = 0;
  try { size = (localStorage.getItem(STORE_KEY) || '').length; } catch (e) { /* ignore */ }
  openModal(`
    <h2>Mes données</h2>
    <p class="muted">${n} recette${n > 1 ? 's' : ''} · ${(size / 1024 / 1024).toFixed(1).replace('.', ',')} Mo utilisés sur ce téléphone.</p>
    <p>Tout est enregistré sur cet appareil. Pense à exporter une sauvegarde de temps en temps,
    ou pour envoyer tes recettes à quelqu’un (il ou elle n’aura qu’à l’importer).</p>
    <div class="menu-list">
      <button class="btn" data-action="export">💾 Exporter une sauvegarde</button>
      <button class="btn" data-action="import">📂 Importer (fusionner avec mes recettes)</button>
      <button class="btn" data-action="load-examples">🍲 Ajouter les recettes d’exemple</button>
      <button class="btn danger" data-action="reset">🗑 Tout effacer</button>
    </div>
    <div class="modal-actions"><button class="btn ghost" data-action="close">Fermer</button></div>`);
}

/* =========================================================
   Rendu principal
   ========================================================= */

const TITLES = { recettes: 'Mes recettes', semaine: 'Planning', courses: 'Liste de courses', prix: 'Prix' };

function render() {
  $('#title').textContent = TITLES[ui.tab];
  $('#kicker').textContent = KICKERS[ui.tab]();
  document.querySelectorAll('.tabbar [data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === ui.tab));
  const view = $('#view');
  view.classList.remove('enter');
  view.innerHTML = { recettes: renderRecettes, semaine: renderSemaine, courses: renderCourses, prix: renderPrix }[ui.tab]();
  if (ui.tab === 'recettes') renderRecipeList();
  if (ui.tab === 'prix') renderPrixList();
}

function setTab(tab) {
  ui.tab = tab;
  closeModal();
  render();
  const view = $('#view');
  view.classList.remove('enter');
  void view.offsetWidth;
  view.classList.add('enter');
  window.scrollTo(0, 0);
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* =========================================================
   Actions
   ========================================================= */

const actions = {
  'menu': showMenu,
  'close': closeModal,
  'new-recipe': () => showRecipeForm(null),
  'open-recipe': el => showRecipe(el.dataset.id),
  'edit-recipe': el => showRecipeForm(el.dataset.id),
  'detail-portions': el => showRecipe(el.dataset.id, parseInt(el.dataset.value, 10)),
  'delete-recipe': el => {
    const r = getRecipe(el.dataset.id);
    if (!r || !confirm(`Supprimer « ${r.nom} » ?`)) return;
    state.recipes = state.recipes.filter(x => x.id !== r.id);
    for (const k of Object.keys(state.plan)) state.plan[k] = state.plan[k].filter(e => e.rid !== r.id);
    save(); closeModal(); render(); toast('Recette supprimée');
  },
  'toggle-fav': el => {
    const r = getRecipe(el.dataset.id);
    r.favori = !r.favori;
    save();
    el.textContent = r.favori ? '★' : '☆';
    el.classList.toggle('on', r.favori);
    render();
  },
  'f-saison': el => { ui.saison = el.dataset.value || null; render(); },
  'f-temps': el => { ui.temps = el.dataset.value || null; render(); },
  'f-fav': () => { ui.fav = !ui.fav; render(); },
  'week': el => { ui.weekStart = iso(addDays(fromIso(ui.weekStart), parseInt(el.dataset.value, 10))); render(); },
  'pick-recipe': el => showPicker(el.dataset.slot),
  'picker-saison': el => { ui.pickerSaison = el.dataset.value || null; renderPickerList(); },
  'pick': el => {
    const slot = $('#picker-list').dataset.slot;
    const r = getRecipe(el.dataset.id);
    (state.plan[slot] = state.plan[slot] || []).push({ rid: r.id, portions: r.portions });
    save(); closeModal(); render(); toast(`« ${r.nom} » ajoutée`);
  },
  'plan-recipe': el => showPlanForm(el.dataset.id, parseInt(el.dataset.portions, 10)),
  'plan-portions': el => {
    const e = state.plan[el.dataset.slot][el.dataset.idx];
    e.portions = Math.max(1, e.portions + parseInt(el.dataset.value, 10));
    save(); render();
  },
  'plan-remove': el => {
    state.plan[el.dataset.slot].splice(el.dataset.idx, 1);
    if (!state.plan[el.dataset.slot].length) delete state.plan[el.dataset.slot];
    save(); render();
  },
  'clear-week': () => {
    if (!confirm('Retirer tous les repas de cette semaine ?')) return;
    for (let i = 0; i < 7; i++) {
      const d = iso(addDays(fromIso(ui.weekStart), i));
      for (const r of REPAS) delete state.plan[slotKey(d, r.id)];
    }
    delete state.checked[ui.weekStart];
    save(); render();
  },
  'check': el => {
    const c = state.checked[ui.weekStart] = state.checked[ui.weekStart] || {};
    if (el.checked) c[el.dataset.key] = true; else delete c[el.dataset.key];
    save();
    el.closest('.item')?.classList.toggle('checked', el.checked);
    setTimeout(render, 450);
  },
  'uncheck-all': () => { delete state.checked[ui.weekStart]; save(); render(); },
  'extra-remove': el => {
    const ids = el.dataset.ids.split(',');
    state.extras[ui.weekStart] = (state.extras[ui.weekStart] || []).filter(x => !ids.includes(x.id));
    save(); render();
  },
  'share-list': async () => {
    const text = listAsText();
    try {
      if (navigator.share) { await navigator.share({ text }); return; }
      await navigator.clipboard.writeText(text);
      toast('Liste copiée 📋');
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      openModal(`<h2>Liste de courses</h2><textarea class="input" rows="14" readonly>${esc(text)}</textarea>
        <div class="modal-actions"><button class="btn ghost" data-action="close">Fermer</button></div>`);
    }
  },
  'edit-price': el => showPriceForm(el.dataset.key, el.dataset.name, el.dataset.base),
  'delete-price': el => { delete state.prices[el.dataset.key]; save(); closeModal(); render(); },
  'pick-photo': () => $('#photo-file').click(),
  'remove-photo': () => {
    formPhoto = '';
    $('#photo-preview').innerHTML = '';
    toast('Photo retirée (enregistre pour valider)');
  },
  'export': () => {
    const blob = new Blob([JSON.stringify({ app: 'carnet-recettes', version: 1, ...state }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `recettes-${iso(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  'import': () => $('#import-file').click(),
  'load-examples': () => {
    const existing = new Set(state.recipes.map(r => normKey(r.nom)));
    const add = normalizeState({ recipes: EXEMPLES }).recipes.filter(r => !existing.has(normKey(r.nom)));
    state.recipes.push(...add);
    for (const [k, p] of Object.entries(EXEMPLE_PRIX)) if (!state.prices[k]) state.prices[k] = p;
    save(); closeModal(); setTab('recettes');
    toast(add.length ? `${add.length} recettes ajoutées` : 'Les exemples sont déjà là');
  },
  'reset': () => {
    if (!confirm('Effacer toutes les recettes, le planning et les prix ? (Pense à exporter avant !)')) return;
    if (!confirm('Vraiment tout effacer ?')) return;
    state = emptyState(); save(); closeModal(); setTab('recettes');
  },
};

document.addEventListener('click', e => {
  const tabEl = e.target.closest('[data-tab]');
  if (tabEl) { setTab(tabEl.dataset.tab); return; }
  const el = e.target.closest('[data-action]');
  if (!el || el.tagName === 'INPUT') return;
  const fn = actions[el.dataset.action];
  if (fn) { e.preventDefault(); fn(el, e); }
});

document.addEventListener('change', e => {
  const el = e.target;
  if (el.matches('input[type=checkbox][data-action]')) { actions[el.dataset.action]?.(el, e); return; }
  if (el.id === 'f-cat') { ui.cat = el.value; renderRecipeList(); }
  if (el.id === 'f-tri') { ui.tri = el.value; renderRecipeList(); }
});

document.addEventListener('input', e => {
  if (e.target.id === 'search') { ui.q = e.target.value; renderRecipeList(); }
  if (e.target.id === 'prix-search') { ui.prixQ = e.target.value; renderPrixList(); }
});

document.addEventListener('submit', e => {
  const form = e.target.closest('[data-form]');
  if (!form) return;
  e.preventDefault();
  const fd = new FormData(form);
  const kind = form.dataset.form;

  if (kind === 'recipe') {
    const id = form.dataset.id;
    const data = {
      nom: fd.get('nom').trim() || 'Sans titre',
      categorie: fd.get('categorie'),
      portions: Math.max(1, num(fd.get('portions')) || 4),
      saisons: fd.getAll('saisons'),
      prep: Math.max(0, num(fd.get('prep')) || 0),
      cuisson: Math.max(0, num(fd.get('cuisson')) || 0),
      ingredientsText: fd.get('ingredientsText').trim(),
      etapes: fd.get('etapes').trim(),
      notes: fd.get('notes').trim(),
      photo: formPhoto,
    };
    data.ingredients = parseIngredients(data.ingredientsText);
    let r = id && getRecipe(id);
    if (r) Object.assign(r, data);
    else { r = { id: uid(), favori: false, cree: Date.now(), ...data }; state.recipes.push(r); }
    save(); render(); showRecipe(r.id); toast('Recette enregistrée');
  }

  if (kind === 'plan') {
    const date = fd.get('date');
    if (!date) return;
    const slot = slotKey(date, fd.get('repas'));
    (state.plan[slot] = state.plan[slot] || []).push({ rid: form.dataset.id, portions: Math.max(1, num(fd.get('portions')) || 1) });
    ui.weekStart = iso(mondayOf(fromIso(date)));
    save(); closeModal(); render(); toast('Ajoutée au planning 📅');
  }

  if (kind === 'price') {
    const prix = num(fd.get('prix'));
    const quantite = num(fd.get('quantite'));
    if (prix === null || !quantite) { toast('Indique un prix et une quantité'); return; }
    state.prices[form.dataset.key] = { nom: form.dataset.name, prix, quantite, unite: fd.get('unite'), date: Date.now() };
    save(); closeModal(); render(); toast('Prix enregistré');
  }

  if (kind === 'extra') {
    const text = fd.get('text').trim();
    if (!text) return;
    (state.extras[ui.weekStart] = state.extras[ui.weekStart] || []).push({ id: uid(), text });
    save(); render();
    $('.add-extra input')?.focus();
  }
});

$('#import-file').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = normalizeState(JSON.parse(await file.text()));
    const ids = new Set(state.recipes.map(r => r.id));
    const names = new Set(state.recipes.map(r => normKey(r.nom)));
    const nouvelles = data.recipes.filter(r => !ids.has(r.id) && !names.has(normKey(r.nom)));
    state.recipes.push(...nouvelles);
    state.prices = { ...data.prices, ...state.prices };
    for (const [k, v] of Object.entries(data.plan)) if (!state.plan[k]) state.plan[k] = v.filter(e => getRecipe(e.rid));
    save(); closeModal(); setTab('recettes');
    toast(`${nouvelles.length} recette${nouvelles.length > 1 ? 's' : ''} importée${nouvelles.length > 1 ? 's' : ''}`);
  } catch (err) {
    toast('Fichier illisible 😕');
  }
});

$('#photo-file').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    formPhoto = await resizeImage(file, 800, 0.72);
    $('#photo-preview').innerHTML = `<img src="${formPhoto}" alt="">`;
  } catch (err) {
    toast('Impossible de lire cette image');
  }
});

function resizeImage(file, max, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
    img.src = url;
  });
}

/* =========================================================
   Exemples
   ========================================================= */

const EXEMPLES = [
  {
    nom: 'Velouté de potimarron', categorie: 'Soupe', saisons: ['automne', 'hiver'], prep: 15, cuisson: 30, portions: 4,
    ingredientsText: '1 potimarron\n2 pommes de terre\n1 oignon\n1 gousse d\'ail\n1 l de bouillon de légumes\n10 cl de crème de coco\nsel, poivre',
    etapes: 'Laver le potimarron, retirer les graines et le couper en cubes (inutile de l’éplucher).\nÉplucher et couper les pommes de terre et l’oignon.\nFaire revenir l’oignon et l’ail 3 minutes dans une casserole.\nAjouter les légumes et le bouillon, cuire 25 minutes.\nMixer avec la crème de coco, saler, poivrer.',
    notes: 'Délicieux avec quelques graines de courge grillées.',
  },
  {
    nom: 'Ratatouille', categorie: 'Plat', saisons: ['ete'], prep: 25, cuisson: 45, portions: 4,
    ingredientsText: '2 courgettes\n1 aubergine\n2 poivrons\n4 tomates\n1 oignon\n2 gousses d\'ail\n3 c. à soupe d\'huile d\'olive\n1 brin de thym\nsel, poivre',
    etapes: 'Couper tous les légumes en dés.\nFaire revenir l’oignon dans l’huile d’olive.\nAjouter poivrons et aubergine, cuire 10 minutes.\nAjouter courgettes, tomates, ail et thym.\nLaisser mijoter 35 minutes à feu doux.',
  },
  {
    nom: 'Salade de lentilles', categorie: 'Salade', saisons: [], prep: 15, cuisson: 20, portions: 4,
    ingredientsText: '250 g de lentilles vertes\n1 échalote\n2 carottes\n100 g de feta\n3 c. à soupe d\'huile d\'olive\n1 c. à soupe de vinaigre\n1 c. à café de moutarde\npersil',
    etapes: 'Cuire les lentilles 20 minutes dans l’eau non salée, égoutter.\nRâper les carottes, ciseler l’échalote.\nPréparer la vinaigrette : moutarde, vinaigre, huile.\nMélanger le tout, ajouter la feta émiettée et le persil.',
  },
  {
    nom: 'Crumble pommes-poires', categorie: 'Dessert', saisons: ['automne', 'hiver'], prep: 15, cuisson: 30, portions: 6,
    ingredientsText: '4 pommes\n2 poires\n100 g de farine\n80 g de sucre complet\n80 g de beurre\n50 g de poudre d\'amande\n1 c. à café de cannelle',
    etapes: 'Préchauffer le four à 180 °C.\nÉplucher et couper les fruits en dés, les mettre dans un plat avec la cannelle.\nSabler du bout des doigts farine, sucre, poudre d’amande et beurre.\nRépartir sur les fruits et enfourner 30 minutes.',
  },
  {
    nom: 'Omelette aux herbes', categorie: 'Plat', saisons: ['printemps', 'ete'], prep: 5, cuisson: 5, portions: 2,
    ingredientsText: '4 œufs\n1 c. à soupe de crème\nciboulette\npersil\n10 g de beurre\nsel, poivre',
    etapes: 'Battre les œufs avec la crème et les herbes ciselées.\nFaire fondre le beurre dans une poêle.\nVerser les œufs et cuire 3 à 4 minutes en ramenant les bords vers le centre.',
  },
];

// Prix indicatifs pour la démo (à remplacer par les vrais prix relevés).
const EXEMPLE_PRIX = {
  'potimarron': { nom: 'potimarron', prix: 2.5, quantite: 1, unite: 'pièce' },
  'pomme de terre': { nom: 'pommes de terre', prix: 0.35, quantite: 1, unite: 'pièce' },
  'oignon': { nom: 'oignon', prix: 0.3, quantite: 1, unite: 'pièce' },
  'lentille verte': { nom: 'lentilles vertes', prix: 3.95, quantite: 500, unite: 'g' },
  'farine': { nom: 'farine', prix: 1.89, quantite: 1, unite: 'kg' },
};

/* =========================================================
   Démarrage
   ========================================================= */

if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

setTab('recettes');

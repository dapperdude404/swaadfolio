const SwaadfolioLanguage = (() => {
  const key = 'swaadfolio.v1.language';
  let current = 'en';
  try { const saved = localStorage.getItem(key); if (Object.hasOwn(SwaadfolioUI, saved)) current = saved; } catch {}
  const originals = new WeakMap();
  function translate(source) {
    if (current === 'en') return source;
    const idx = {'hi-Latn':0,fr:1,es:2}[current];
    const trimmed = source.trim();
    const label = SwaadfolioLabels[trimmed]?.[idx];
    if (label) return source.replace(trimmed, label);
    let m = trimmed.match(/^Step (\d+) of (\d+)$/);
    if (m) return current === 'hi-Latn' ? `Step ${m[1]} / ${m[2]}` : current === 'fr' ? `Étape ${m[1]} sur ${m[2]}` : `Paso ${m[1]} de ${m[2]}`;
    m = trimmed.match(/^Serves (\d+)$/);
    if (m) return current === 'hi-Latn' ? `${m[1]} logon ke liye` : `${m[1]} ${current === 'fr' ? 'portions' : 'porciones'}`;
    return source;
  }
  function apply() {
    const select = document.getElementById('language');
    if (!select) return;
    select.value = current;
    document.documentElement.lang = current;
    document.getElementById('language-notice').textContent = SwaadfolioUI[current].notice;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('script,style,option,textarea,[data-no-translate],.ingredient-original,.ingredient-hinglish,.steps,.note,.detail-intro>p,.card-info>p')) continue;
      const previous = originals.get(node);
      const source = previous && node.nodeValue === previous.applied ? previous.source : node.nodeValue;
      const applied = translate(source);
      if (node.nodeValue !== applied) node.nodeValue = applied;
      originals.set(node,{source,applied});
    }
    document.querySelectorAll('[data-note-label]').forEach(el => el.textContent = translate('Kitchen note'));
    document.querySelectorAll('[data-language-label]').forEach(el => {
      const label = translate(el.dataset.languageLabel);
      el.setAttribute('aria-label', label + (el.dataset.recipeName ? ' · ' + el.dataset.recipeName : ''));
      if (el.hasAttribute('title')) el.title = label;
    });
    const search = document.getElementById('search');
    if (search) search.placeholder = translate('Search dishes or ingredients');
  }
  function set(value) {
    if (!Object.hasOwn(SwaadfolioUI,value)) return;
    current = value;
    try { localStorage.setItem(key,value); } catch {}
  }
  function recipe(r, portion) {
    const pack = current === 'hi-Latn' ? SwaadfolioHinglish[r.id] : null;
    const steps = (pack?.steps || r.steps).map(step => r.id === 'besan-chilla' && portion !== r.servings ? step.replace(/¾ cup (water|paani)/,(_,word)=> Number((.75 * portion / 2).toFixed(3))+' cup '+word) : step);
    return {steps,tip:pack?.tip || r.tip,lang:pack?'hi-Latn':'en'};
  }
  return {get current(){return current;},apply,set,recipe};
})();

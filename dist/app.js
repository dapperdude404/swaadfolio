(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const courses = {"All recipes":"grid", Breakfast:"sun", Mains:"bowl", Sides:"leaf", Snacks:"snack", Desserts:"sweet"};
  const shapes = {
    book:'<path d="M3 4.5c3.5-.5 6.4.2 9 2.3 2.6-2.1 5.5-2.8 9-2.3v14.2c-3.5-.5-6.3.1-9 2.3-2.7-2.2-5.5-2.8-9-2.3zM12 6.8V21"/>',
    bookmark:'<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/>',
    plus:'<path d="M12 5v14M5 12h14"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
    clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.1 1.8"/>',
    serve:'<path d="M3 19h18M5 16a7 7 0 0 1 14 0zM12 8V5m-1.5 0h3"/>',
    search:'<circle cx="10" cy="10" r="6.5"/><path d="m15.2 15.2 5.2 5.2"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/>',
    sun:'<path d="M3 18h18M6 15a6 6 0 0 1 12 0M12 3v3M3.7 6.5l2 2M20.3 6.5l-2 2M2 13h2.3M22 13h-2.3"/>',
    bowl:'<path d="M3 11h18c-.5 5.7-3.5 8.4-9 8.4S3.5 16.7 3 11zM8.5 21h7M7.5 8c-1-1.4 1.3-2.2.4-3.5M12 8c-1.1-1.8 1.5-3 .7-5M17 8c-.7-1.4 1-2 .7-3.4"/>',
    leaf:'<path d="M20.5 3c-8.3.3-15.9 3-15.9 10.3 0 4.8 5.8 7.3 9.9 4.3 4.2-3 5.2-8.5 6-14.6zM3 21l12-12"/>',
    snack:'<path d="M10.7 4.8a1.5 1.5 0 0 1 2.6 0l7 12.3a1.5 1.5 0 0 1-1.3 2.3H5a1.5 1.5 0 0 1-1.3-2.3zM8 15l6.3 4.4"/>',
    sweet:'<path d="M3 11h18a9 9 0 0 1-8 8v2h-2v-2a9 9 0 0 1-8-8zM6.3 10.5a4 4 0 0 1 5.2-4.1 3.5 3.5 0 0 1 6.8.8M16 5.5l2.3-2.8"/>',
    flower:'<path d="M12 2c2 0 2.2 2.7 2.1 4.4 1.2-1.2 3.4-2.8 4.7-1.5s-.4 3.5-1.6 4.7c1.7-.1 4.4.1 4.4 2.1s-2.7 2.2-4.4 2.1c1.2 1.2 2.9 3.4 1.6 4.7s-3.5-.3-4.7-1.5c.1 1.7-.1 4.4-2.1 4.4s-2.2-2.7-2.1-4.4c-1.2 1.2-3.4 2.8-4.7 1.5s.4-3.5 1.6-4.7c-1.7.1-4.4-.1-4.4-2.1s2.7-2.2 4.4-2.1C5.6 8.4 3.9 6.2 5.2 4.9s3.5.3 4.7 1.5C9.8 4.7 10 2 12 2z"/><circle cx="12" cy="11.8" r="1.8"/>',
    level:'<path d="M4 20v-5h3v5zM10.5 20v-9h3v9zM17 20V5h3v15z"/>'
  };
  function icon(name) { return '<svg aria-hidden="true" class="ico" viewBox="0 0 24 24">' + shapes[name] + '</svg>'; }
  document.querySelectorAll("[data-icon]").forEach(el => { el.outerHTML = icon(el.dataset.icon); });
  const chars = {"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"};
  function esc(value) { return String(value ?? "").replace(/[&<>"']/g, ch => chars[ch]); }
  const prefix = "swaadfolio.v1.";
  const favouriteKey = id => prefix + "saved." + id;
  const recipeKey = id => prefix + "recipe." + id;
  const curated = new Map(SwaadfolioRecipes.map(r => [r.id, r]));
  function ingredientGuide(recipe, index) {
    const entry = SwaadfolioIngredientGuide[recipe.id]?.[index];
    if (!entry) return null;
    const [name, photo] = entry.split("|");
    return { name, photo };
  }
  let recipes = [], saved = new Set(), route = {}, toastTimer;
  let storageWorks = true;
  const filters = {
    recipes:{course:"All recipes", query:"", scroll:0},
    saved:{course:"All recipes", query:"", scroll:0}
  };
  const checklists = new Map();
  const cookState = new Map();
  let portions = new Map();
  const chillaAmounts = ["cup besan (chickpea flour)", "cup water, plus more as needed", "small onion, finely chopped", "small tomato, finely chopped", "green chilli, finely chopped, optional", "tbsp chopped coriander", "tsp cumin seeds", "tsp turmeric", "tsp salt", "tsp oil, for cooking"];
  const chillaNumbers = [1, .75, 1, 1, 1, 2, .5, .25, .5, 2];
  function scaledChilla(i, servings) { return Number((chillaNumbers[i] * servings / 2).toFixed(3)) + " " + chillaAmounts[i]; }
  const listOfText = a => Array.isArray(a) && a.length > 0 && a.every(v => typeof v === "string" && v.trim());
  function validPersonal(r, id) {
    return r && r.id === id && /^mine-[a-z0-9-]+$/.test(id) && typeof r.name === "string" && r.name.trim()
      && typeof r.region === "string" && typeof r.description === "string" && r.country === "IN"
      && Object.hasOwn(courses, r.course) && r.course !== "All recipes"
      && Number.isInteger(r.minutes) && r.minutes > 0 && Number.isInteger(r.servings) && r.servings > 0
      && listOfText(r.ingredients) && listOfText(r.steps);
  }
  function readBook() {
    const own = [], ids = [];
    try {
      for (let n = 0; n < localStorage.length; n++) {
        const key = localStorage.key(n) || "";
        if (key.startsWith(prefix + "saved.")) ids.push(key.slice((prefix + "saved.").length));
        if (!key.startsWith(prefix + "recipe.")) continue;
        const id = key.slice((prefix + "recipe.").length);
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (validPersonal(item, id)) own.push(item);
        } catch { /* A damaged entry leaves the rest of the book readable. */ }
      }
      storageWorks = true;
    } catch { storageWorks = false; }
    own.sort((a,b) => (b.created || 0) - (a.created || 0));
    recipes = [...own, ...SwaadfolioRecipes];
    const known = new Set(recipes.map(item => item.id));
    saved = new Set(ids.filter(id => known.has(id)));
    byId("saved-count").textContent = saved.size;
    byId("saved-count").hidden = !saved.size;
  }
  function notify(message) {
    clearTimeout(toastTimer);
    byId("toast").textContent = message;
    toastTimer = setTimeout(() => { byId("toast").textContent = ""; }, 3000);
  }
  function current() {
    const parts = location.hash.slice(1).split("/").filter(Boolean);
    const view = parts[0] === "saved" ? "saved" : "recipes";
    if (view === "saved") parts.shift();
    if (parts[0] === "recipe") return {view, page:"detail", id:parts[1]};
    if (parts[0] === "edit" || parts[0] === "add") return {view, page:"editor", id:parts[0] === "edit" ? parts[1] : null};
    return {view, page:"book"};
  }
  const hrefFor = (id, view = "recipes") => (view === "saved" ? "#saved/recipe/" : "#recipe/") + id;
  function imageFor(r) {
    if (curated.has(r.id)) return '<img src="assets/' + r.id + '.webp" alt="" loading="lazy">';
    if (typeof r.photo === "string" && /^data:image\/(?:webp|jpeg|png);base64,[a-zA-Z0-9+/=]+$/.test(r.photo)) {
      return '<img src="' + r.photo + '" alt="" loading="lazy">';
    }
    return '<div class="placeholder" aria-hidden="true">' + icon("book") + '</div>';
  }
  function saveButton(r, compact) {
    const isSaved = saved.has(r.id);
    const text = isSaved ? "Remove from saved recipes" : "Save recipe";
    return '<button type="button" class="' + (compact ? "bookmark" : "button ghost") + '" data-save="' + esc(r.id) +
      '" aria-pressed="' + isSaved + '" aria-label="' + esc(text + " · " + r.name) + '" title="' + text + '">' +
      icon("bookmark") + (compact ? "" : (isSaved ? "Saved" : "Save recipe")) + '</button>';
  }
  function normal(s) { return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); }
  function cards() {
    const f = filters[route.view], terms = normal(f.query).split(/\s+/).filter(Boolean);
    const pool = route.view === "saved" ? recipes.filter(r => saved.has(r.id)) : recipes;
    const rows = pool.filter(r => {
      if (f.course !== "All recipes" && f.course !== r.course) return false;
      const names = (SwaadfolioIngredientGuide[r.id] || []).map(entry => entry.split("|")[0]);
      const haystack = normal([r.name,r.region,r.course,r.description,...r.ingredients,...names].join(" "));
      return terms.every(term => haystack.includes(term));
    });
    byId("clear").hidden = !f.query;
    byId("result-count").textContent = rows.length + (rows.length === 1 ? " recipe" : " recipes") + (terms.length ? " found" : "");
    byId("grid").innerHTML = rows.map(r =>
      '<article class="card"><a class="card-link" href="' + hrefFor(r.id,route.view) + '" aria-label="' + esc("Open " + r.name) + '">' +
      '<div class="card-photo">' + imageFor(r) + '</div><div class="card-info"><span class="region">' + esc(r.region) + '</span><h3>' +
      esc(r.name) + '</h3><p>' + esc(r.description) + '</p><div class="meta"><span>' + icon("clock") + esc(r.minutes) +
      ' min</span><i class="sep"></i><span>' + icon(courses[r.course]) + esc(r.course) + '</span></div></div></a>' + saveButton(r,true) + '</article>'
    ).join("");
    const empty = byId("empty"); empty.hidden = !!rows.length;
    if (!rows.length) {
      const firstSave = route.view === "saved" && !pool.length;
      empty.innerHTML = icon(firstSave ? "bookmark" : "search") + "<h3>" + (firstSave ? "Your saved recipes" : "No matching recipes") +
        "</h3><p>" + (firstSave ? "Tap the bookmark on a recipe to keep it here." : "Try another ingredient or choose a different course.") + "</p>" +
        (firstSave ? '<a class="button ghost" href="#recipes">Explore recipes</a>' : '<button class="button ghost" data-reset>Clear filters</button>');
    }
  }
  function showBook() {
    const f = filters[route.view], isSaved = route.view === "saved";
    byId("feature").hidden = isSaved;
    byId("collection-title").textContent = isSaved ? "Saved recipes" : "The Indian collection";
    byId("kicker").textContent = isSaved ? "My cookbook" : "Regional cookbook";
    byId("search").value = f.query;
    byId("filters").innerHTML = Object.entries(courses).map(([c,i]) => '<button type="button" class="filter" data-course="' + c +
      '" aria-pressed="' + (f.course === c) + '">' + icon(i) + c + '</button>').join("");
    cards();
    document.title = (isSaved ? "Saved recipes" : "Indian recipe book") + " · Swaadfolio";
  }
  function backLink(view) { return '<a class="back" href="#' + view + '">' + icon("book") + (view === "saved" ? "Back to saved recipes" : "Back to recipe book") + '</a>'; }
  function missing(el) {
    el.innerHTML = backLink("recipes") + '<div class="empty"><h1 tabindex="-1">Recipe unavailable</h1><p>Personal recipes open in the browser where they were added.</p><a href="#recipes" class="button primary">Open recipe book</a></div>';
    document.title = "Recipe unavailable · Swaadfolio";
  }
  function showDetail() {
    const el = byId("detail"), r = recipes.find(item => item.id === route.id);
    if (!r) { missing(el); return; }
    const checked = checklists.get(r.id) || new Set();
    const portion = portions.get(r.id) || r.servings;
    const cooking = cookState.get(r.id);
    const steps = r.id === "besan-chilla" && portion !== r.servings ? r.steps.map(step => step.replace("¾ cup water", Number((.75 * portion / 2).toFixed(3)) + " cup water")) : r.steps;
    const level = r.difficulty ? '<span>' + icon("level") + esc(r.difficulty) + '</span>' : "";
    el.innerHTML = backLink(route.view) + '<div class="detail-lead"><div class="detail-photo">' + imageFor(r) +
      '</div><div class="detail-intro"><span class="overline">' + esc(r.region) + ' · ' + esc(r.course) + '</span><h1 tabindex="-1">' + esc(r.name) +
      '</h1><p>' + esc(r.description) + '</p><div class="meta"><span>' + icon("clock") + esc(r.minutes) + ' min</span><span>' +
      icon("serve") + 'Serves ' + esc(portion) + '</span>' + level + '</div><div class="actions">' + saveButton(r,false) +
      (curated.has(r.id) ? '' : '<a class="button ghost" href="#edit/' + r.id + '">Edit recipe</a>') +
      '</div></div></div><div class="cook-tools"><button type="button" class="button primary" data-cook-start>' + (cooking ? 'Close cooking mode' : 'Start beginner cooking mode') + '</button>' + (r.id === 'besan-chilla' ? '<label>Servings <select data-portions aria-label="Choose servings">' + [1,2,3,4,5,6].map(n => '<option value="' + n + '"' + (n === portion ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></label><p>Quantities are estimates. Adjust seasoning to taste; follow the adjusted ingredient list. Cooking time and pan size may change.</p>' : '<p>Smart portions are coming to more recipes. This recipe serves ' + esc(r.servings) + '.</p>') + '</div>' + (cooking ? '<section class="cook-panel" aria-label="Beginner cooking mode"><p>Step ' + (cooking.step + 1) + ' of ' + r.steps.length + '</p><h2>Let’s cook, step by step</h2><p aria-live="polite">' + esc(steps[cooking.step]) + '</p><p>Tip: Read the step first. Low heat means dheemi aanch; simmer means gently bubbling.</p><div class="actions"><button type="button" class="button ghost" data-cook-prev ' + (cooking.step === 0 ? 'disabled' : '') + '>Previous</button><button type="button" class="button primary" data-cook-next ' + (cooking.step === r.steps.length - 1 ? 'disabled' : '') + '>Next step</button></div></section>' : '') + '<div class="columns"><section class="ingredients"><h2>Ingredients</h2><p class="measurement-help">tsp = chhota chamach · tbsp = bada chamach</p><ul>' +
      r.ingredients.map((s,i) => {
        const guide = ingredientGuide(r, i);
        const photo = guide?.photo ? '<img class="ingredient-photo" src="assets/ingredients/' + esc(guide.photo) + '.jpg" alt="" loading="lazy">' : "";
        const name = guide ? '<small class="ingredient-hinglish">' + esc(guide.name) + '</small>' : "";
        return '<li><label><input type="checkbox" data-ingredient="' + i + '"' +
          (checked.has(i) ? ' checked' : '') + '>' + photo + '<span class="ingredient-copy"><span class="ingredient-original">' + esc(r.id === 'besan-chilla' && portion !== r.servings ? scaledChilla(i, portion) : s) + '</span>' + name + '</span></label></li>';
      }).join("") +
      '</ul></section><section><h2>Method</h2><ol class="steps">' + steps.map(s => "<li><span>" + esc(s) + "</span></li>").join("") +
      '</ol>' + (r.tip ? '<aside class="note"><strong>Kitchen note</strong>' + esc(r.tip) + '</aside>' : "") + '</section></div>';
    document.title = r.name + " · Swaadfolio";
  }
  function formField(label,name,value,options={}) {
    const required = options.optional ? "" : " required";
    let input;
    if (options.rows) input = '<textarea name="' + name + '" rows="' + options.rows + '" maxlength="' + (options.max || 6000) + '"' + required + '>' + esc(value) + '</textarea>';
    else input = '<input name="' + name + '" type="' + (options.number ? "number" : "text") + '"' +
      (options.number ? ' min="1" max="' + options.max + '" step="1"' : ' maxlength="' + (options.max || 90) + '"') + ' value="' + esc(value) + '"' + required + '>';
    return '<label class="field ' + (options.classes || "") + '"><span>' + label + '</span>' + input + '</label>';
  }
  function showEditor() {
    const el = byId("editor"), r = route.id ? recipes.find(item => item.id === route.id && !curated.has(item.id)) : null;
    if (route.id && !r) { missing(el); return; }
    const title = r ? "Edit recipe" : "Add a recipe";
    const opts = Object.keys(courses).slice(1).map(c => '<option' + (r?.course === c ? " selected" : "") + '>' + c + '</option>').join("");
    el.innerHTML = (r ? '<a class="back" href="' + hrefFor(r.id) + '">' + icon("book") + 'Back to recipe</a>' : backLink("recipes")) +
      '<div class="overline">' + icon("flower") + 'My cookbook</div><h1 tabindex="-1">' + title + '</h1><p class="editor-intro">Write down an Indian recipe from your kitchen. Your personal recipes and favourites stay in this browser.</p>' +
      '<form class="recipe-form" id="recipe-form"><div class="fields">' +
      formField("Recipe name","name",r?.name,{classes:"wide",max:90}) + formField("Indian state or region","region",r?.region,{classes:"small-wide",max:70}) +
      '<label class="field small-wide"><span>Course</span><select name="course">' + opts + '</select></label>' +
      formField("Total time (minutes)","minutes",r?.minutes || 30,{number:true,max:10080}) +
      formField("Servings","servings",r?.servings || 2,{number:true,max:200}) +
      formField("Short description (optional)","description",r?.description,{classes:"wide",rows:2,max:220,optional:true}) +
      formField("Ingredients · one per line","ingredients",r?.ingredients.join("\n"),{classes:"wide",rows:5}) +
      formField("Method · one step per line","steps",r?.steps.join("\n"),{classes:"wide",rows:5,max:12000}) +
      '<label class="field wide"><span>' + (r?.photo ? "Replace photo (optional)" : "Photo (optional)") +
      '</span><input type="file" name="photo" accept="image/jpeg,image/png,image/webp"><small>JPG, PNG or WebP, up to 5 MB.</small></label></div>' +
      '<p class="error" role="alert" hidden></p><div class="actions"><button type="submit" class="button primary">' + (r ? "Save changes" : "Add to recipe book") +
      '</button><a class="button ghost" href="' + (r ? hrefFor(r.id) : "#recipes") + '">Cancel</a>' +
      (r ? '<button class="button ghost" type="button" data-delete>Delete recipe</button>' : '') + '</div></form>' +
      '<dialog id="delete-dialog"><h2>Delete this recipe?</h2><p>Remove this recipe from this browser.</p><form method="dialog" class="actions"><button class="button ghost" value="cancel" autofocus>Keep recipe</button><button class="button primary" value="delete">Delete recipe</button></form></dialog>';
    byId("delete-dialog").addEventListener("close", function() {
      if (this.returnValue !== "delete" || !r) return;
      try { localStorage.removeItem(recipeKey(r.id)); localStorage.removeItem(favouriteKey(r.id)); }
      catch { notify("Browser storage is unavailable."); return; }
      checklists.delete(r.id); location.hash = "recipes"; notify("Recipe deleted.");
    });
    document.title = title + " · Swaadfolio";
  }
  async function preparePhoto(file) {
    if (!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size > 5*1024*1024)
      throw Error("Choose a JPG, PNG or WebP photo under 5 MB.");
    const url = URL.createObjectURL(file);
    try {
      const img = new Image(); img.src = url;
      try { await img.decode(); } catch { throw Error("This photo could not be opened. Choose another image."); }
      const scale = Math.min(1,850/Math.max(img.naturalWidth,img.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1,Math.round(img.naturalWidth*scale));
      canvas.height = Math.max(1,Math.round(img.naturalHeight*scale));
      canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
      return canvas.toDataURL("image/webp",.78);
    } finally { URL.revokeObjectURL(url); }
  }
  async function storeForm(form) {
    const n = form.elements;
    for (const name of ["name","region","ingredients","steps"]) {
      n[name].setCustomValidity(n[name].value.trim() ? "" : "Please enter some text.");
    }
    if (!form.reportValidity()) return;
    const button = form.querySelector('[type="submit"]'), error = form.querySelector(".error");
    button.disabled = true; error.hidden = true;
    const editId = route.id, hash = location.hash;
    try {
      const old = editId ? JSON.parse(localStorage.getItem(recipeKey(editId))) : null;
      if (editId && !old) throw Error("This recipe was removed in another tab.");
      const photo = n.photo.files[0] ? await preparePhoto(n.photo.files[0]) : (old?.photo || "");
      if (!form.isConnected || location.hash !== hash) return;
      const id = editId || ("mine-" + (globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2)));
      const lines = input => input.value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
      const item = {id,country:"IN",created:old?.created || Date.now(),name:n.name.value.trim(),region:n.region.value.trim(),
        course:n.course.value,minutes:Number(n.minutes.value),servings:Number(n.servings.value),description:n.description.value.trim(),
        ingredients:lines(n.ingredients),steps:lines(n.steps),photo};
      if (!validPersonal(item,id)) throw Error("Check the recipe fields and try again.");
      localStorage.setItem(recipeKey(id), JSON.stringify(item));
      checklists.delete(id); location.hash=hrefFor(id); notify(editId ? "Changes saved." : "Recipe added to your book.");
    } catch (err) {
      error.textContent = err.name === "QuotaExceededError" ? "This browser is out of space. Try a smaller photo or remove an older personal recipe." :
        err.name === "SecurityError" ? "Enable browser storage to keep personal recipes." : err.message;
      error.hidden=false;
    } finally { button.disabled=false; }
  }
  function applyRoute(initial=false) {
    const past = route, next = current();
    if (past.page === "book") filters[past.view].scroll = window.scrollY;
    route = next; readBook();
    byId("book-view").hidden=route.page!=="book"; byId("detail").hidden=route.page!=="detail"; byId("editor").hidden=route.page!=="editor";
    for(const [name,id] of [["recipes","nav-book"],["saved","nav-saved"]]) {
      if(route.view===name && route.page!=="editor") byId(id).setAttribute("aria-current","page"); else byId(id).removeAttribute("aria-current");
    }
    if (route.page==="book") showBook(); else if (route.page==="detail") showDetail(); else showEditor();
    if (!initial) {
      const title = route.page==="book" ? byId(route.view==="saved" ? "collection-title":"feature-title") : document.querySelector(".subview:not([hidden]) h1");
      title?.focus({preventScroll:true});
      window.scrollTo(0, route.page==="book" && past.page==="detail" && route.view===past.view ? filters[route.view].scroll : 0);
    }
  }
  document.addEventListener("click", event => {
    const b = event.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-cook-start") || b.hasAttribute("data-cook-prev") || b.hasAttribute("data-cook-next")) {
      const state = cookState.get(route.id);
      if (b.hasAttribute("data-cook-start")) { if (state) cookState.delete(route.id); else cookState.set(route.id, {step:0}); }
      else if (state) state.step += b.hasAttribute("data-cook-next") ? 1 : -1;
      const selector = b.hasAttribute("data-cook-start") ? "[data-cook-start]" : b.hasAttribute("data-cook-next") ? "[data-cook-next]" : "[data-cook-prev]";
      showDetail(); const target = byId("detail").querySelector(selector); (target && !target.disabled ? target : byId("detail").querySelector("[data-cook-start]")).focus({preventScroll:true});
    } else if (b.hasAttribute("data-save")) {
      const id = b.dataset.save;
      try {
        const key = favouriteKey(id);
        if (localStorage.getItem(key)) localStorage.removeItem(key); else localStorage.setItem(key,"1");
      } catch { notify("Enable browser storage to save favourites."); return; }
      readBook();
      if(route.page==="detail") showDetail(); else cards();
      (document.querySelector((route.page==="detail" ? '#detail ' : '#grid ')+'[data-save="'+id+'"]') ||
        document.querySelector('#grid [data-save]') || byId("collection-title")).focus({preventScroll:true});
      notify(saved.has(id) ? "Recipe saved." : "Removed from saved recipes.");
    } else if (b.hasAttribute("data-course")) {
      filters[route.view].course=b.dataset.course;
      byId("filters").querySelectorAll("button").forEach(a=>a.setAttribute("aria-pressed",String(a===b)));
      cards();
    } else if (b.hasAttribute("data-reset") || b.id==="clear") {
      filters[route.view].query="";
      if (b.hasAttribute("data-reset")) filters[route.view].course="All recipes";
      showBook(); byId("search").focus();
    } else if (b.hasAttribute("data-delete")) byId("delete-dialog").showModal();
  });
  byId("search").addEventListener("input", e=>{filters[route.view].query=e.target.value; cards();});
  byId("search-form").addEventListener("submit",e=>e.preventDefault());
  byId("editor").addEventListener("input",e=>{if(typeof e.target.setCustomValidity==="function")e.target.setCustomValidity("");});
  byId("editor").addEventListener("submit", e=>{if(e.target.id==="recipe-form"){e.preventDefault();storeForm(e.target);}});
  byId("detail").addEventListener("change", e=>{
    if(e.target.hasAttribute("data-portions")) { portions.set(route.id, Number(e.target.value)); showDetail(); byId("detail").querySelector("[data-portions]").focus({preventScroll:true}); return; }
    if(!e.target.hasAttribute("data-ingredient"))return;
    const checks=checklists.get(route.id)||new Set(), i=Number(e.target.dataset.ingredient);
    if(e.target.checked)checks.add(i);else checks.delete(i);
    checklists.set(route.id,checks);
  });
  document.querySelector(".skip").addEventListener("click",e=>{e.preventDefault();byId("main").focus();});
  window.addEventListener("hashchange",()=>applyRoute());
  window.addEventListener("storage", e=>{
    if(e.key && !e.key.startsWith(prefix))return;
    readBook(); if(route.page==="book") cards(); else if(route.page==="detail")showDetail();
  });
  applyRoute(true);
  if(!storageWorks) notify("Browser storage is unavailable. You can still explore the recipes.");
})();

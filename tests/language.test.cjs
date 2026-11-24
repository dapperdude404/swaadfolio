const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..','dist');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const ctx=vm.createContext({localStorage:{getItem:()=>null,setItem:()=>{}},document:{}});
for(const f of ['recipes.js','locales/hinglish.js','locales/ui.js','language.js'])vm.runInContext(read(f),ctx);
const run=s=>vm.runInContext(s,ctx);
test('all curated Hinglish methods preserve step counts and numerical quantities/times',()=>{
 const recipes=run('SwaadfolioRecipes'),pack=run('SwaadfolioHinglish');
 for(const r of recipes){assert.equal(pack[r.id].steps.length,r.steps.length,r.id);assert.ok(pack[r.id].tip);
 r.steps.forEach((s,i)=>assert.deepEqual(Array.from(pack[r.id].steps[i].match(/[\d¼½¾]+/g)||[]),Array.from(s.match(/[\d¼½¾]+/g)||[]),r.id+' step '+i));}
});
test('portion changes update Hinglish method water and restore original English',()=>{
 run("SwaadfolioLanguage.set('hi-Latn')");
 assert.match(run("SwaadfolioLanguage.recipe(SwaadfolioRecipes.find(r=>r.id==='besan-chilla'),4).steps[0]"),/1.5 cup paani/);
 run("SwaadfolioLanguage.set('en')");
 assert.match(run("SwaadfolioLanguage.recipe(SwaadfolioRecipes.find(r=>r.id==='besan-chilla'),2).steps[0]"),/¾ cup water/);
});
test('unsupported recipes and interface-only packs fall back honestly to English',()=>{
 for(const lang of ['fr','es']){run(`SwaadfolioLanguage.set('${lang}')`);assert.equal(run('SwaadfolioLanguage.recipe(SwaadfolioRecipes[0],3).lang'),'en');}
 run("SwaadfolioLanguage.set('hi-Latn')");assert.equal(run("SwaadfolioLanguage.recipe({id:'mine-test',steps:['Original'],tip:'Note',servings:1},1).steps[0]"),'Original');
 run("SwaadfolioLanguage.set('unknown')");assert.equal(run('SwaadfolioLanguage.current'),'hi-Latn');
});

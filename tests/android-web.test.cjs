const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
function boot(hash='#recipe/besan-chilla',storage={}) {
 const dom=new JSDOM(fs.readFileSync('dist/index.html','utf8'),{url:'https://appassets.androidplatform.net/assets/www/index.html'+hash,runScripts:'outside-only',pretendToBeVisual:true});
 dom.window.scrollTo=()=>{};
 for(const [k,v] of Object.entries(storage)) dom.window.localStorage.setItem(k,v);
 require('node:vm').runInContext([...dom.window.document.querySelectorAll('script[src]')].map(script=>fs.readFileSync('dist/'+script.getAttribute('src'),'utf8')).join('\n;\n'),dom.getInternalVMContext());
 return dom;
}
function change(w,selector,value) {const el=w.document.querySelector(selector);el.value=value;el.dispatchEvent(new w.Event('change',{bubbles:true}));}
test('Android origin: cooking navigation, checklist, six portions and language switching stay consistent',()=>{
 const dom=boot(),w=dom.window,d=w.document;
 d.querySelector('[data-cook-start]').click();
 assert.equal(d.querySelector('[data-cook-prev]').disabled,true);
 d.querySelector('[data-cook-next]').click();
 assert.match(d.querySelector('.cook-panel').textContent,/Step 2 of 4/);
 d.querySelector('[data-ingredient]').click();
 change(w,'[data-portions]','6');
 change(w,'#language','hi-Latn');
 assert.match(d.querySelector('.steps').textContent,/2.25 cup paani/);
 assert.match(d.querySelector('.ingredients').textContent,/2.25 cup water/);
 assert.match(d.querySelector('.cook-panel').textContent,/Step 2 \/ 4/);
 assert.equal(d.querySelector('[data-ingredient]').checked,true);
 d.querySelector('[data-cook-prev]').click();
 assert.match(d.querySelector('.cook-panel').textContent,/2.25 cup paani/);
 for(let i=0;i<3;i++)d.querySelector('[data-cook-next]').click();
 assert.equal(d.querySelector('[data-cook-next]').disabled,true);
 change(w,'#language','en');
 assert.match(d.querySelector('.steps').textContent,/2.25 cup water/);
 change(w,'[data-portions]','2');
 assert.match(d.querySelector('.steps').textContent,/¾ cup water/);
 dom.window.close();
});
test('Android origin: saved recipes and language survive a new document; personal recipes are retained',()=>{
 const personal={id:'mine-test',name:'Family recipe',region:'India',country:'IN',course:'Mains',minutes:20,servings:2,description:'Personal dish',ingredients:['1 cup rice'],steps:['Cook rice.']};
 const dom=boot('#recipe/besan-chilla',{'swaadfolio.v1.recipe.mine-test':JSON.stringify(personal)}),w=dom.window;
 w.document.querySelector('#detail [data-save]').click();change(w,'#language','hi-Latn');
 const saved=Object.fromEntries(Object.keys(w.localStorage).map(k=>[k,w.localStorage.getItem(k)]));w.close();
 const restored=boot('#recipes',saved),d=restored.window.document;
 assert.equal(d.querySelector('#language').value,'hi-Latn');
 assert.equal(d.querySelector('[data-save="besan-chilla"]').getAttribute('aria-pressed'),'true');
 assert.match(d.querySelector('#grid').textContent,/Family recipe/);
 const search=d.querySelector('#search');search.value='pyaaz';search.dispatchEvent(new restored.window.Event('input'));
 assert.ok(d.querySelectorAll('#grid .card').length>0);
 restored.window.close();
});

const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="(assets\/[^"?]+)/g))assert.ok(fs.existsSync(path.join(root,match[1])),`Missing page asset: ${match[1]}`);
const Empty=()=>{};Empty.PRESENTED_IMAGE_SIMPLE='empty';
const context={window:{DataTagging:{useStore(){},getTaxonomy:()=>[],get:()=>({tags:[]})}},React:{createElement:(type,props,...children)=>({type,props,children}),useState:initial=>[initial,()=>{}],useEffect(){}},antd:{Empty}};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'assets/tag-analysis.js'),'utf8'),context);
assert.doesNotThrow(()=>context.window.TagCoverage.Component({scope:'test',records:[]}), 'Missing optional bubble script must not blank the analysis page');
assert.ok(!html.includes('tag-bubbles.js'),'Removed bubble script is not referenced');
console.log('PASS: all page assets exist and analysis renders without the removed bubble chart.');

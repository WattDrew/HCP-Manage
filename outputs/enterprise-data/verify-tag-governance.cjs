const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../../assets/data-tagging.js'),'utf8'),values=new Map(),timers=[];
let slots=[],cursor=0,notices=[];
function load(){
 const c={window:{addEventListener(){}},React:{memo:f=>f,createElement:(type,props,...children)=>({type,props:props||{},children}),useState:initial=>{const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return[slots[i],v=>slots[i]=typeof v==='function'?v(slots[i]):v];},useEffect:fn=>fn()},antd:{message:Object.fromEntries(['success','warning','error','info'].map(k=>[k,msg=>notices.push([k,msg])]))},localStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},setTimeout:fn=>{timers.push(fn);return timers.length;},Date};vm.createContext(c);vm.runInContext(source,c);return c.window.DataTagging;
}
let T=load();const scope='connected',record={id:'history',doctorProfile:{verified:true,department:'眼科',title:'主任医师',hospitalLevel:'三级甲等',region:'上海'},conversation:[{sender:'rep',text:'您好，交流儿童近视、OK 镜以及随访频次、视力检查和户外活动。'},{sender:'doctor',text:'我关注安全性，需要研究证据。'}]};
const storedKey=JSON.stringify([scope,record.id]);
T.registerProject(scope,{connected:true,records:[record]});
assert.equal(T.policy(scope).remaining,3);assert.ok(T.get(scope,record).tags.some(t=>t.label==='眼科'));assert.ok(T.get(scope,record).tags.some(t=>t.label==='儿童近视'));assert.ok(!T.get(scope,{id:'else'}).tags.length);
let annotations=JSON.parse(values.get('hcp-annotations-v1'));annotations[storedKey].tags.push({group:'讨论主题',label:'价格',source:'AI'},{group:'医生关注偏好',label:'关注疗效',source:'人工'});values.set('hcp-annotations-v1',JSON.stringify(annotations));T.refreshTaxonomy();
const copy=()=>JSON.parse(JSON.stringify(T.getTaxonomy(scope)));
function add(label){const rows=copy();rows.find(r=>r[1]==='讨论主题')[2].push(label);return T.saveTaxonomy(scope,rows);}
assert.ok(add('随访频次'));assert.equal(T.policy(scope).remaining,2);assert.ok(T.renameLabel(scope,'讨论主题','随访频次','视力检查'));assert.equal(T.policy(scope).remaining,2,'Renaming consumes no quota');
assert.ok(add('户外活动'));assert.ok(add('研究证据'));assert.equal(T.policy(scope).remaining,0);assert.equal(add('第四个'),false);
let rows=copy();rows[0][3]='new rules';assert.equal(T.saveTaxonomy(scope,rows),false,'Rules locked');rows=copy();rows.push(['','新分类',[]]);assert.equal(T.saveTaxonomy(scope,rows),false,'Structure locked');
// Re-open before callbacks to verify persisted jobs are resumed.
timers.length=0;T=load();T.registerProject(scope,{connected:true,records:[record]});while(timers.length)timers.shift()();
let tags=T.get(scope,record).tags;assert.ok(tags.some(t=>t.label==='视力检查'));assert.ok(tags.some(t=>t.label==='户外活动'));assert.ok(tags.some(t=>t.label==='研究证据'));assert.ok(tags.some(t=>t.label==='价格'&&t.source==='AI'));assert.ok(tags.some(t=>t.label==='关注疗效'&&t.source==='人工'));assert.ok(!tags.some(t=>t.label==='包含开场'),'Backfill adds only selected new tags');assert.equal(Object.keys(JSON.parse(values.get('hcp-tag-backfills-v1'))).length,0);
assert.ok(T.renameLabel(scope,'讨论主题','价格','治疗费用'));assert.ok(T.get(scope,record).tags.some(t=>t.label==='治疗费用'));assert.ok(!T.get(scope,record).tags.some(t=>t.label==='价格'));
assert.ok(T.deleteSchemaLabels(scope,[{group:'讨论主题',label:'户外活动'},{group:'医生职业背景',label:'眼科'}]));T.registerProject(scope,{connected:false,records:[record]});assert.equal(T.policy(scope).remaining,0,'Deletion does not refund quota or unlock project');assert.ok(!T.get(scope,record).tags.some(t=>t.label==='眼科'),'Dynamic deletion is not undone');assert.equal(add('不能补回名额'),false);
const free='not-connected';T.registerProject(free,{records:[{id:'unknown',conversation:[{text:'你好',sender:'doctor'}],doctorProfile:{verified:false,department:'内科'}}]});rows=JSON.parse(JSON.stringify(T.getTaxonomy(free)));rows[0][3]='editable';rows.push(['整段对话','新分类',['甲','乙','丙','丁']]);assert.ok(T.saveTaxonomy(free,rows),'Unconnected projects remain unrestricted');assert.ok(!T.get(free,{id:'unknown'}).tags.length,'Do not invent missing profile or discussion entities');
console.log('PASS: connection locks, cumulative quota, rename propagation, deletion, targeted durable historical backfill, preserved AI/manual tags, dynamic profile/entities, no invented labels.');

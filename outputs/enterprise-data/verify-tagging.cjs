const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../../assets/data-tagging.js'),'utf8');
const values=new Map(),timers=[];let failures=false;
function load(){
  const ctx={window:{},React:{memo:fn=>fn,createElement(){},useState(){},useEffect(){}},antd:{},initialConversation:['您好','你好','如何选择治疗？','需要更多安全性研究证据'],localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>{if(failures)throw Error('quota');values.set(k,v);}},setTimeout:fn=>{timers.push(fn);return timers.length;},document:{},Date};
  ctx.antd.message={success(){},info(){},error(){}};
  vm.createContext(ctx);vm.runInContext(source,ctx);return ctx.window.DataTagging;
}
let T=load();const a={id:'record-1'},b={id:'record-2'};
assert.equal(T.taxonomy.length,12);assert.equal(T.taxonomy.filter(t=>t[0]==='整段对话').length,9);
T.start('enterprise-A/project-1',[a,b]);assert.equal(timers.length,2);assert.equal(T.get('enterprise-A/project-1',a).status,'running');
T.start('enterprise-A/project-1',[a]);assert.equal(timers.length,2,'No duplicate jobs');
timers.splice(0).forEach(fn=>fn());
assert.equal(T.get('enterprise-A/project-1',a).status,'done');
assert.ok(T.get('enterprise-A/project-1',a).tags.some(t=>t.label==='关注安全性'&&t.index===3));
assert.equal(T.get('enterprise-B/project-1',a).status,'none','Enterprise isolation');
assert.equal(T.get('enterprise-A/project-2',a).status,'none','Project isolation');
T.start('enterprise-A/project-1',[a]);assert.equal(timers.length,0,'Skip completed records');
T=load();assert.equal(T.get('enterprise-A/project-1',a).status,'done','Persist results across reload');
T.start('enterprise-A/project-1',[a],true);assert.equal(T.get('enterprise-A/project-1',a).status,'running');
const restored=load();assert.equal(restored.get('enterprise-A/project-1',a).status,'done','Reload leaves interrupted jobs retryable');
timers.splice(0).forEach(fn=>fn());
const repOnly={id:'rep-only',conversation:[{sender:'rep',text:'安全性和疗效研究，您关注吗？'},{sender:'doctor',text:'你好'}]};
T.start('enterprise-A/project-1',[repOnly]);timers.splice(0).forEach(fn=>fn());
assert.ok(!T.get('enterprise-A/project-1',repOnly).tags.some(t=>t.group==='医生关注偏好'),'Do not infer doctor preferences from representative speech');
const manual=JSON.parse(values.get('hcp-annotations-v1'));manual[JSON.stringify(['enterprise-A/project-1','record-1'])].tags.push({group:'医生关注偏好',label:'人工添加标签',source:'人工'});values.set('hcp-annotations-v1',JSON.stringify(manual));T=load();T.start('enterprise-A/project-1',[a],true);timers.splice(0).forEach(fn=>fn());assert.ok(T.get('enterprise-A/project-1',a).tags.some(t=>t.label==='人工添加标签'),'Default rerun preserves manual tags');T.start('enterprise-A/project-1',[a],true,true);timers.splice(0).forEach(fn=>fn());assert.ok(!T.get('enterprise-A/project-1',a).tags.some(t=>t.label==='人工添加标签'),'Explicit override replaces manual tags');
values.set('hcp-tag-schemas-v1',JSON.stringify({'custom-project':[['','讨论主题',['研究结果']]]}));T=load();assert.equal(T.getTaxonomy('custom-project').length,1);assert.equal(T.getTaxonomy('other-project').length,12,'Schema isolated by project');T.start('custom-project',[{id:'schema-record'}]);timers.splice(0).forEach(fn=>fn());assert.ok(T.get('custom-project',{id:'schema-record'}).tags.every(t=>t.group==='讨论主题'&&t.label==='研究结果'),'AI output follows the saved schema');
failures=true;T.start('enterprise-A/project-1',[{id:'quota'}]);assert.equal(timers.length,0);assert.equal(T.get('enterprise-A/project-1',{id:'quota'}).status,'none','Storage failure does not pretend to save');
console.log('PASS: taxonomy, batch processing, duplicate prevention, tenant/project isolation, persistence, interrupted recovery, speaker attribution, storage failure.');

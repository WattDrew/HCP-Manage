const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const context={window:{},React:{createElement(){}},antd:{},Map,Set};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../../assets/tag-analysis.js'),'utf8'),context);
const {summarize,coverageBand,sortTags}=context.window.TagCoverage;assert.deepEqual([0,1,2,3,100].map(coverageBand),['zero','one','two','many','many']);
const scheme=[['','主题',['安全性','疗效']],['','场景',['初次拜访']]];
const records=[{id:'a'},{id:'b'},{id:'c'},{id:'a'}];
const tags={a:[{group:'主题',label:'安全性',source:'AI'},{group:'主题',label:'安全性',source:'人工'},{group:'主题',label:'疗效',source:'AI'}],b:[{group:'主题',label:'安全性',source:'AI'},{group:'场景',label:'初次拜访',source:'AI'}],c:[]};
const read=r=>({tags:tags[r.id]});
let result=summarize(records,read,scheme);
assert.equal(result.total,3,'Deduplicate records');assert.equal(result.tagged,2);assert.equal(result.coverage,67);assert.equal(result.instances,4,'Deduplicate each record/tag, manual takes precedence');
assert.equal(result.ai,3);assert.equal(result.manual,1);assert.equal(result.average,'2.0');assert.equal(result.categories[0].count,2,'Multiple tags in a category count as one covered record');
assert.equal(result.allTags.length,3);assert.deepEqual(Array.from(result.allTags.find(t=>t.label==='安全性').recordIds).sort(),['a','b']);assert.equal(result.ranking[0].label,'安全性');assert.equal(result.ranking[0].count,2);assert.equal(result.ranking[0].ai,1);assert.equal(result.ranking[0].manual,1);
result=summarize(records,read,scheme,'manual');assert.equal(result.tagged,1);assert.equal(result.coverage,33);assert.equal(result.instances,1);assert.equal(result.categories[1].count,0);
assert.equal(result.allTags.length,3,'Source filtering retains zero-count preset tags');assert.equal(result.allTags.find(t=>t.label==='疗效').count,0);result=summarize([],read,scheme);assert.equal(result.allTags.length,3,'All presets remain visible without data');assert.equal(result.coverage,0);assert.equal(result.average,'0');assert.equal(result.ranking.length,0);assert.equal(result.covered,0);
result=summarize(records,r=>({tags:[]}),scheme);assert.equal(result.untagged,3);assert.equal(result.instances,0);
console.log('PASS: unique records/tags, category denominator, source filtering, ranking, zero/empty data.');

const order=[{label:'B',count:0},{label:'A',count:2},{label:'C',count:1}];assert.deepEqual(Array.from(sortTags(order,'desc'),t=>t.count),[2,1,0]);assert.deepEqual(Array.from(sortTags(order,'asc'),t=>t.count),[0,1,2]);assert.deepEqual(Array.from(sortTags(order,'default',['C','B','A']),t=>t.label),['C','B','A']);assert.deepEqual(Array.from(sortTags([{label:'B',count:1},{label:'A',count:1}],'desc',['B','A']),t=>t.label),['B','A'],'Ties preserve taxonomy order');

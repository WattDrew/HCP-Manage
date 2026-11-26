const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
let open=false;
const coverage=()=>{},library=()=>{};
const context={window:{TagCoverage:{Component:coverage},DataTagging:{Library:library}},antd:{},React:{
  Fragment:'fragment',createElement:(type,props,...children)=>({type,props:props||{},children}),
  useEffect(){},
  useState:initial=>initial===false?[open,value=>{open=value;}]:[initial,()=>{}]
}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../../assets/demand-data-views.js'),'utf8'),context);
const records=[{key:'visible',stage:'final_approved'},{key:'pending',stage:'initial_approved'},{key:'hidden',stage:'pending_cleaning'}];
const render=scope=>context.window.DemandDataViews.ProjectAnalysis({scope,records,current:2,target:10,approved:1});
let tree=render('P-001');
assert.equal(tree.children[0].props.scope,'P-001');
assert.equal(tree.children[0].props.records,tree.children[1].props.records,'Progress and coverage use the same records');
assert.equal(tree.children[1].type,coverage);
assert.deepEqual(Array.from(tree.children[1].props.records,r=>r.key),['visible','pending'],'Only demand-visible records enter coverage');
assert.equal(tree.children[1].props.scope,'P-001');
tree.children[1].props.onEditSchema();
tree=render('P-001');
assert.equal(tree.children[2].type,library);
assert.equal(tree.children[2].props.editor,true);
assert.equal(tree.children[2].props.open,true);
assert.equal(tree.children[2].props.scope,'P-001');
tree.children[2].props.onClose();
assert.equal(render('P-002').children[2].props.open,false);
assert.equal(render('P-002').children[1].props.scope,'P-002');
console.log('PASS: demand-visible coverage, project scope, management open/close, reused schema editor.');

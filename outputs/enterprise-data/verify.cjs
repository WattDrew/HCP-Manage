// Interaction checks for the isolated static prototype, without browser dependencies.
const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict'), path=require('node:path');
const values=new Map(), slots=[];let cursor=0,tree;
const component=name=>Object.assign(function(){},{displayName:name});
const antd=Object.fromEntries(['Button','Card','Table','Tabs','Input','Select','Tag','Space','Progress','Modal','Empty','Alert','Descriptions','Drawer','Segmented','Checkbox'].map(n=>[n,component(n)]));
antd.Space.Compact=component('Compact');
const sandbox={window:{addEventListener(){},removeEventListener(){}},Icon:component('Icon'),Person:component('Person'),initialConversation:['张主任您好','你好','今天主要想跟您交流一下儿童近视防控这块。最近门诊这类患者多吗？','挺多的，尤其是低龄儿童，现在家长对近视也比较焦虑。','那您现在临床上对于低龄近视患儿，一般会怎么做干预？','要看具体情况。首先是用眼习惯、户外活动，必要时也会考虑药物或者 OK 镜。'],localStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)},React:{
  createElement:(type,props,...children)=>['Dataset','Analysis'].includes(type?.name)?type({...props,children}):({type,props:{...props,children}}),Fragment:component('Fragment'),
  useState:initial=>{const index=cursor++;if(!(index in slots))slots[index]=typeof initial==='function'?initial():initial;return [slots[index],v=>{slots[index]=typeof v==='function'?v(slots[index]):v;}];},useEffect(){}
},antd};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(__dirname,'../../assets/demand-data-views.js'),'utf8'),sandbox);vm.runInContext(fs.readFileSync(path.join(__dirname,'../../assets/enterprise-data.js'),'utf8'),sandbox);
const render=()=>{cursor=0;tree=sandbox.window.EnterpriseData({message:{success(){},error(){}}});return tree;};
const nodes=(root=tree)=>!root||typeof root!=='object'?[]:[root,...(root.props?.children||[]).flat(Infinity).filter(n=>n!==undefined).flatMap(n=>nodes(n))];
const text=n=>typeof n==='string'?n:typeof n==='number'?String(n):[n?.props?.title,n?.props?.description,n?.props?.message,...(n?.props?.children||[])].flat(Infinity).filter(v=>v!==undefined&&v!==null).map(text).join('');
const find=(type,predicate=()=>true)=>{const n=nodes().find(n=>n.type?.displayName===type&&predicate(n.props,n));assert.ok(n,`Missing ${type}`);return n;};
const click=label=>{find('Button',(_,n)=>text(n)===label).props.onClick();render();};
const table=()=>find('Table').props;
const selectEnterprise=id=>{find('Select',p=>p.id==='enterprise-select').props.onChange(id);render();};
const query=id=>{click('添加企业');find('Input',p=>p.id==='enterprise-id-input').props.onChange({target:{value:id}});render();click('查询');};
render();assert.equal(table().dataSource.length,2);assert.ok(table().dataSource.every(p=>p.enterprise==='ENT-10001'));
selectEnterprise('ENT-10002');assert.equal(table().dataSource[0].name,'糖尿病管理采集项目');
selectEnterprise('ENT-10003');assert.equal(table().dataSource[0].enterprise,'ENT-10002','Unadded enterprise cannot be selected');
for(const [id,error] of [['','请输入企业 ID'],['unknown','未查询到对应企业'],['ENT-20001','仅支持添加需求端企业'],['ENT-10004','暂无该企业数据的查看权限']]){
  query(id);assert.ok(nodes().some(n=>n.type?.displayName==='Alert'&&n.props.message.includes(error)));assert.equal(find('Modal').props.okButtonProps.disabled,true);find('Modal').props.onCancel();render();
}
query(' ENT-10003 ');find('Modal').props.onOk();render();assert.ok(text(tree).includes('该企业暂无采集项目'));
assert.equal(find('Select',p=>p.id==='enterprise-select').props.options.length,3);
query('ENT-10003');assert.equal(find('Modal').props.okText,'切换到该企业');find('Modal').props.onOk();render();assert.equal(find('Select',p=>p.id==='enterprise-select').props.options.length,3);
selectEnterprise('ENT-10001');let p=table().dataSource[0];table().columns.at(-1).render(null,p).props.onClick();render();
assert.ok(!nodes().some(n=>n.props?.className==='enterprise-switch-card'),'Project detail hides enterprise switch');
assert.deepEqual(Array.from(find('Tabs').props.items,x=>x.label),['数据集','数据分析']);
assert.equal(find('Tabs').props.activeKey,'data');assert.equal(table().dataSource.length,12);
assert.deepEqual(Array.from(table().columns,c=>c.title),['采集对象','采集用 E 人','来源接口','对话轮次','数据状态','时间','操作']);
assert.deepEqual(Array.from(find('Segmented').props.options,o=>o.label),['全部 12','待审核 3','终审未通过 3','终审通过 6']);
find('Segmented').props.onChange('final_rejected');render();assert.ok(table().dataSource.every(r=>r.stage==='final_rejected'));assert.equal(table().pagination.pageSize,5);
let record=table().dataSource[0];nodes(table().columns.at(-1).render(null,record)).find(n=>n.type?.displayName==='Button').props.onClick();render();assert.ok(find('Drawer').props.open);
const conversationNode=nodes(find('Drawer')).find(n=>n.props?.className==='conversation');
assert.ok(conversationNode);assert.equal(conversationNode.props['data-view-side'],'demand');assert.equal(conversationNode.props['data-read-only'],'true');
assert.equal(nodes(conversationNode).filter(n=>n.props?.className==='bubble').length,6);
assert.equal(find('Drawer').props.width,560);assert.equal(find('Drawer').props.footer,undefined);
assert.equal(conversationNode.props['data-rejection-reason'],record.reason);
assert.ok(!nodes(find('Drawer')).some(n=>n.type?.displayName==='Input'||n.type?.displayName==='Button'));
find('Tabs').props.onChange('analysis');render();assert.ok(text(tree).includes('DATA COLLECTION PROGRESS'));assert.ok(text(tree).includes('采集完成度'));assert.ok(text(tree).includes('待采集 348'));
find('Button',p=>p['aria-label']==='返回企业项目列表').props.onClick();render();assert.equal(find('Select',p=>p.id==='enterprise-select').props.value,'ENT-10001');
selectEnterprise('ENT-10002');assert.equal(table().dataSource[0].enterprise,'ENT-10002');assert.equal(find('Drawer').props.open,false);
assert.ok(!nodes().some(n=>n.type?.displayName==='Button'&&/编辑|删除|审核|导出|停止|恢复/.test(text(n))));
// Remount simulates a refresh and checks persisted selection and added enterprises.
slots.length=0;render();assert.equal(find('Select',p=>p.id==='enterprise-select').props.value,'ENT-10002');assert.equal(find('Select',p=>p.id==='enterprise-select').props.options.length,3);
values.set('hcp-enterprise-viewer-v1',JSON.stringify({ids:[],selected:'ENT-10001'}));slots.length=0;render();assert.ok(text(tree).includes('暂无企业，请先添加企业'));assert.equal(nodes().filter(n=>n.type?.displayName==='Table').length,0);
// Verify the same enhancement functions used by demand-side drawers recognize this read-only drawer.
const detailSource=fs.readFileSync(path.join(__dirname,'../../assets/hcp-data-detail.js'),'utf8');
const shared={selectedSide:()=> 'collector'};
vm.createContext(shared);
for(const name of ['reasonFor','getRecordMeta','logPanel','subjectPanel']){
  const start=detailSource.indexOf(`  function ${name}(`);
  const end=detailSource.indexOf('\n  function ',start+1);
  vm.runInContext(detailSource.slice(start,end),shared);
}
const meta=shared.getRecordMeta({querySelectorAll:()=>[{classList:{contains:()=>false},querySelector:()=>({textContent:'张*医生 · 医生'})}],querySelector:selector=>selector==='.conversation'?{dataset:{readOnly:'true',viewSide:'demand',rejectionReason:'本条记录的驳回原因'}}:{textContent:'终审未通过'}});
assert.equal(meta.isDemand,true);assert.equal(meta.readOnly,true);assert.equal(shared.reasonFor(meta),'本条记录的驳回原因');
assert.ok(shared.logPanel(meta).includes('终审未通过'));assert.ok(shared.logPanel(meta).includes('查看原始对话内容'));
assert.ok(shared.subjectPanel(meta).includes('credential-photo masked'));assert.ok(shared.subjectPanel(meta).includes('张*医生'));
console.log('PASS: enterprise scope, ID validation, details, read-only actions, persistence and shared demand-side logs/masked subject information.');

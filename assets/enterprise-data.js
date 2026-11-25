/* Enterprise read-only prototype. Fixtures are intentionally independent of editable workspace data. */
window.EnterpriseData = (() => {
  const h = React.createElement;
  const {useState, useEffect} = React;
  const {Button, Card, Table, Tabs, Input, Select, Tag, Space, Progress, Modal, Empty, Alert, Drawer} = antd;
  const STORAGE = 'hcp-enterprise-viewer-v1';
  const directory = [
    {id:'ENT-10001', name:'华东医疗数据服务中心', type:'demand', allowed:true},
    {id:'ENT-10002', name:'华南医学调研有限公司', type:'demand', allowed:true},
    {id:'ENT-10003', name:'北京博采医疗科技有限公司', type:'demand', allowed:true},
    {id:'ENT-10004', name:'北方医学研究中心', type:'demand', allowed:false},
    {id:'ENT-20001', name:'核盛网络科技有限公司', type:'collector', allowed:true}
  ];
  const canView = id => directory.some(e => e.id === id && e.type === 'demand' && e.allowed);
  function readSaved() {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return {ids:['ENT-10001','ENT-10002'], selected:'ENT-10001'};
      const parsed = JSON.parse(raw);
      const ids = Array.isArray(parsed.ids) ? [...new Set(parsed.ids.filter(canView))] : [];
      return {ids, selected:ids.includes(parsed.selected) ? parsed.selected : ids[0]};
    } catch { return {ids:[], selected:undefined}; }
  }
  const projects = [
    {id:'E1-P1', enterprise:'ENT-10001', name:'眼科数据采集项目', owner:'小贝', specialty:'内科｜主任医生', current:652, target:1000, state:'active', goal:'提升眼科疾病沟通的专业性与自然度', date:'2026.09.17'},
    {id:'E1-P2', enterprise:'ENT-10001', name:'呼吸科数据采集项目', owner:'李医生', specialty:'呼吸内科｜主任医师', current:186, target:800, state:'active', goal:'采集呼吸科常见疾病沟通场景', date:'2026.09.18'},
    {id:'E1-P3', enterprise:'ENT-10001', name:'心血管随访采集项目', owner:'王医生', specialty:'心内科｜主任医师', current:500, target:500, state:'done', goal:'完善心血管慢病随访语料', date:'2026.08.20'},
    {id:'E1-P4', enterprise:'ENT-10001', name:'儿科沟通采集项目', owner:'陈医生', specialty:'儿科｜主治医师', current:32, target:300, state:'void', goal:'采集儿科沟通场景', date:'2026.08.12'},
    {id:'E2-P1', enterprise:'ENT-10002', name:'糖尿病管理采集项目', owner:'陈医生', specialty:'内分泌科｜主任医师', current:218, target:600, state:'active', goal:'完善糖尿病患者管理沟通语料', date:'2026.10.05'},
    {id:'E2-P2', enterprise:'ENT-10002', name:'肿瘤科拜访采集项目', owner:'赵医生', specialty:'肿瘤科｜副主任医师', current:400, target:400, state:'done', goal:'提升肿瘤领域专业沟通能力', date:'2026.09.01'}
  ];
  const apiNames = ['华东区域采集 API','华南区域采集 API','华北区域采集 API'];
  const apiStates = ['active','pending','done'];
  const stateText = {active:'进行中', done:'已完成', void:'已作废', pending:'待对接', stopped:'已停止', approved:'已采用', reviewing:'待审核', rejected:'已驳回'};
  const stateColor = {active:'processing',done:'success',pending:'warning',approved:'success',reviewing:'warning',rejected:'error'};
  const status = (state, api) => h(Tag,{color:stateColor[state]},api && state==='active' ? '采集中' : stateText[state]);
  const apiRows = p => apiNames.slice(0, p.state === 'active' ? 3 : 2).map((name,i)=>({
    id:`${p.id}-API-${i+1}`, enterprise:p.enterprise, project:p.id, name,
    peak:Math.ceil(p.target/2), collector:['张三','小贝','李四'][i],
    state:p.state==='done'?'done':p.state==='void'?'stopped':apiStates[i],
    company:['核盛网络科技有限公司','—','北京博采数据服务有限公司'][i], created:p.date+' 10:28'
  }));
  const dataRows = p => Array.from({length: p.id==='E1-P1'?12:6},(_,i)=>({
    id:`${p.id}-D-${String(i+1).padStart(3,'0')}`, enterprise:p.enterprise, project:p.id,
    name:['张*医生','李*医生','王*医生','赵*医生'][i%4], turns:18+i%7,
    api:apiRows(p)[i%apiRows(p).length].name,
    state:p.state==='done'?'approved':['approved','reviewing','approved','rejected'][i%4],
    stage:p.state==='done'?'final_approved':['final_approved','initial_approved','final_approved','final_rejected'][i%4],
    dataOrigin:i%2?'元医AI':'新浪健康',
    collector:'张三',
    time:`${p.date} ${String(9+i%8).padStart(2,'0')}:25`,
    reason:i%4===3?'对话未覆盖要求的专业沟通场景':'—'
  }));
  const pagination = {pageSize:6, showSizeChanger:false, showTotal:n=>`共 ${n} 条`};
  function Component({message}) {
    const [saved,setSaved] = useState(readSaved);
    const [projectId,setProjectId] = useState(null);
    const [tab,setTab] = useState('data');
    const [filter,setFilter] = useState('active');
    const [keyword,setKeyword] = useState('');
    const [dataFilter,setDataFilter] = useState('all');
    const [open,setOpen] = useState(false);
    const [input,setInput] = useState('');
    const [match,setMatch] = useState(null);
    const [error,setError] = useState('');
    const [inspected,setInspected] = useState(null);
    const [actionsHost,setActionsHost] = useState(null);
    const [tagLibrary,setTagLibrary] = useState(false);
    useEffect(()=>{
      const target=new URLSearchParams(window.location.search).get('tagManagementProject');
      const found=projects.find(p=>p.id===target&&saved.ids.includes(p.enterprise)&&canView(p.enterprise));
      if(found){setSaved(current=>({...current,selected:found.enterprise}));setProjectId(found.id);setTab('analysis');setTagLibrary(true);}
    },[]);
    useEffect(()=>{
      const onStorage=e=>{if(e.key===STORAGE || e.key===null){setSaved(readSaved());resetView();}};
      window.addEventListener('storage',onStorage);
      return ()=>window.removeEventListener('storage',onStorage);
    },[]);
    function resetView(){setProjectId(null);setFilter('active');setKeyword('');setTab('data');setDataFilter('all');setInspected(null);}
    function persist(next){
      try {localStorage.setItem(STORAGE,JSON.stringify(next));setSaved(next);return true;}
      catch {message.error('无法保存企业关联，请检查浏览器存储后重试');return false;}
    }
    const enterprises = directory.filter(e=>saved.ids.includes(e.id)&&canView(e.id));
    const enterprise = enterprises.find(e=>e.id===saved.selected);
    // Every child lookup is constrained by both the added enterprise and the parent project.
    const scopedProjects = enterprise ? projects.filter(p=>p.enterprise===enterprise.id) : [];
    const project = scopedProjects.find(p=>p.id===projectId);
    const records = project ? dataRows(project).filter(r=>r.enterprise===enterprise.id && r.project===project.id) : [];
    const drawerItem = inspected && records.find(r=>r.id===inspected.id);
    function switchEnterprise(id){if(enterprises.some(e=>e.id===id)&&persist({...saved,selected:id}))resetView();}
    function startAdd(){setInput('');setMatch(null);setError('');setOpen(true);}
    function query(){
      const id=input.trim();setInput(id);setMatch(null);
      if(!id){setError('请输入企业 ID');return;}
      const found=directory.find(e=>e.id===id);
      if(!found){setError('未查询到对应企业，请检查企业 ID');return;}
      if(found.type!=='demand'){setError('仅支持添加需求端企业');return;}
      if(!found.allowed){setError('暂无该企业数据的查看权限');return;}
      setError('');setMatch(found);
    }
    function add(){
      if(!match || match.id!==input.trim() || !canView(match.id))return;
      const duplicate=saved.ids.includes(match.id);
      const next={ids:duplicate?saved.ids:[...saved.ids,match.id],selected:match.id};
      if(persist(next)){resetView();setOpen(false);message.success(duplicate?'已切换到该企业':'企业已添加');}
    }
    const view = p=>{setProjectId(p.id);setTab('data');setDataFilter('all');};
    const link = (label,action)=>h(Button,{type:'link',style:{padding:0},onClick:action},label);
    const table = (columns,rows,key)=>h('div',{className:'table-wrap'},h(Table,{key,rowKey:'id',columns,dataSource:rows,pagination,scroll:{x:950},locale:{emptyText:h(Empty,{image:Empty.PRESENTED_IMAGE_SIMPLE,description:'暂无符合条件的数据'})}}));
    const projectColumns = [
      {title:'项目名称',dataIndex:'name',width:260,render:(name,p)=>h('div',{className:'project-cell'},h('span',{className:'project-icon'},h(Icon,{name:'data'})),link(name,()=>view(p)))},
      {title:'提升 E 人',dataIndex:'owner',render:(v,p)=>h('div',null,v,h('div',{className:'cell-meta'},p.specialty))},
      {title:'已采集 / 目标',render:(_,p)=>`${p.current.toLocaleString()} / ${p.target.toLocaleString()} 条`},
      {title:'状态',dataIndex:'state',render:s=>status(s)},
      {title:'采集进度',width:200,render:(_,p)=>h(Progress,{percent:Math.min(100,Math.round(p.current/p.target*100)),size:'small'})},
      {title:'操作',width:80,render:(_,p)=>link('查看',()=>view(p))}
    ];
    let detailContent;
    if(project){
      if(tab==='data')detailContent=h(window.DemandDataViews.Dataset,{
        tagDetail:true, actionsHost, records, filter:dataFilter, onFilter:setDataFilter, onView:r=>setInspected({kind:'data',id:r.id}),onManageTags:()=>window.DataTagging.openManagement(project.id),
        resolveApi:r=>r.api, renderPerson:r=>h(Person,{name:r.collector,sub:'医药代表'}),scopeKey:project.id
      });
      if(tab==='analysis')detailContent=h(React.Fragment,null,h(window.DemandDataViews.Analysis,{
        current:project.current,target:project.target,
        approved:Math.round(project.current*records.filter(r=>r.stage==='final_approved').length/Math.max(1,records.length))
      }),h(window.TagCoverage.Component,{key:project.id,scope:project.id,records,onEditSchema:()=>setTagLibrary(true)}));
    }
    return h('section',{className:'enterprise-viewer'},
      !project && h('div',{className:'page-heading'},h('div',null,h('h1',null,'企业采集数据'),h('div',{className:'subtitle'},'查看已添加需求端企业的采集项目与数据')),h(Button,{type:'primary',icon:h(Icon,{name:'plus'}),onClick:startAdd},'添加企业')),
      !project && h(Card,{className:'enterprise-switch-card'},h('div',{className:'enterprise-switch-row'},
        h('div',{className:'enterprise-switch-control'},h('label',{htmlFor:'enterprise-select'},'当前企业'),h(Select,{id:'enterprise-select','aria-label':'切换企业',showSearch:true,optionFilterProp:'label',value:enterprise?.id,placeholder:'请选择已添加企业',onChange:switchEnterprise,options:enterprises.map(e=>({value:e.id,label:e.name})),notFoundContent:'暂无已添加企业',style:{width:320,maxWidth:'100%'}})),
        h(Space,{wrap:true},enterprise&&h('span',{className:'cell-meta'},'企业 ID：'+enterprise.id),h(Tag,{color:'blue'},'只读查看')))),
      !enterprise ? h(Card,null,h(Empty,{description:'暂无企业，请先添加企业'},h(Button,{type:'primary',onClick:startAdd},'添加企业'))) :
      !project ? h(React.Fragment,null,
        h(Card,{className:'table-card'},h('div',{className:'section-title'},'项目列表'),
          scopedProjects.length===0?h('div',{className:'empty-module'},h(Empty,{description:'该企业暂无采集项目'})):
          h(React.Fragment,null,h('div',{className:'toolbar'},h(Input,{value:keyword,allowClear:true,placeholder:'搜索项目名称',prefix:h(Icon,{name:'search',size:16}),onChange:e=>setKeyword(e.target.value)})),
            h(Tabs,{activeKey:filter,onChange:setFilter,items:['active','done','void'].map(key=>({key,label:stateText[key]}))}),
            table(projectColumns,scopedProjects.filter(p=>p.state===filter&&p.name.includes(keyword.trim())),`${enterprise.id}-${filter}-${keyword}`)))) :
      h(React.Fragment,null,
        h('div',{className:'page-heading enterprise-project-heading'},h(Space,null,h(Button,{icon:h(Icon,{name:'arrow'}),'aria-label':'返回企业项目列表',onClick:()=>{setProjectId(null);setInspected(null);}}),h('h2',null,project.name),status(project.state)),tab==='data'&&h('div',{className:'enterprise-project-actions',ref:setActionsHost})),
        h(Card,{className:'table-card'},h(Tabs,{activeKey:tab,onChange:key=>{setTab(key);setInspected(null);},items:[{key:'data',label:'数据集'},{key:'analysis',label:'数据分析'}]}),detailContent)),
      h(window.DataTagging.Library,{editor:true,scope:project?.id,open:tagLibrary,onClose:()=>setTagLibrary(false)}),
      h(Modal,{title:'添加企业',open,onCancel:()=>setOpen(false),onOk:add,okText:match&&saved.ids.includes(match.id)?'切换到该企业':'确认添加',okButtonProps:{disabled:!match},cancelText:'取消'},
        h('label',{htmlFor:'enterprise-id-input',className:'enterprise-field-label'},'企业 ID'),
        h(Space.Compact,{style:{width:'100%'}},h(Input,{id:'enterprise-id-input',value:input,maxLength:64,placeholder:'请输入完整企业 ID',onPressEnter:query,onChange:e=>{setInput(e.target.value);setMatch(null);setError('');}}),h(Button,{onClick:query},'查询')),
        error&&h(Alert,{type:'error',showIcon:true,message:error}),
        match&&h('div',{className:'enterprise-match'},h('strong',null,match.name),h('p',{className:'cell-meta'},match.id+' · 需求端企业'),saved.ids.includes(match.id)&&h(Alert,{type:'info',message:'该企业已添加，可直接切换查看'}))),
      h(Drawer,{
        key:drawerItem?.id || 'closed-record', title:'数据详情', width:560, zIndex:1200,
        open:!!drawerItem, destroyOnClose:true, onClose:()=>setInspected(null),
        extra:drawerItem&&h(Tag,{color:{approved:'success',reviewing:'warning',rejected:'error'}[drawerItem.state]},
          {approved:'终审通过',reviewing:'待审核',rejected:'终审未通过'}[drawerItem.state])
      },drawerItem&&h('div',{
        className:'conversation', 'data-view-side':'demand', 'data-read-only':'true',
        'data-rejection-reason':drawerItem.state==='rejected'?drawerItem.reason:''
      },initialConversation.map((text,i)=>h('div',{
        key:i,className:`message-row ${i%2===0?'right':''}`
      },h('div',{className:'message-label'},i%2===0?'张三 · 医药代表':`${drawerItem.name} · 医生`),
        h('div',{className:'bubble'},text))))));
  }
  return Component;
})();

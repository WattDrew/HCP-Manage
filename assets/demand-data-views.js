/* Shared demand-side presentation, also used by the read-only enterprise viewer. */
window.DemandDataViews = (() => {
  const h=React.createElement;
  const {Table,Tag,Button,Space,Checkbox,Input,Select,Modal,Alert}=antd;
  const states={initial_approved:['待审核','warning'],final_rejected:['终审未通过','error'],final_approved:['终审通过','success']};
  function Dataset({records,filter,onFilter,onView,resolveApi,renderPerson,pagination,scopeKey,tagDetail=false,actionsHost}){
    const T=window.DataTagging; T.useStore();
    const [batch,setBatch]=React.useState(false),[selected,setSelected]=React.useState([]),[search,setSearch]=React.useState(''),[tagSearch,setTagSearch]=React.useState(''),[tagState,setTagState]=React.useState('all'),[library,setLibrary]=React.useState(false),[detail,setDetail]=React.useState(null);
    const scope=String(scopeKey);
    React.useEffect(()=>{setBatch(false);setSelected([]);setDetail(null);setSearch('');setTagSearch('');setTagState('all');},[scope]);
    React.useEffect(()=>setSelected([]),[filter,search,tagState,tagSearch]);
    const inspect=r=>tagDetail?setDetail(r):onView(r);
    const eligible=records.filter(r=>selected.includes(r.key||r.id));
    const tagTerms=[...new Set(tagSearch.trim().split(/[、\s,，]+/u).filter(Boolean))];
    const running=records.filter(r=>T.get(scope,r).status==='running').length;
    function run(rows){T.request(scope,rows,()=>{setSelected([]);setBatch(false);});}
    const visible=records.filter(r=>states[r.stage]);
    const filtered=visible.filter(r=>{const e=T.get(scope,r);return (filter==='all'||r.stage===filter)&&(!search.trim()||String(r.name||'').includes(search.trim()))&&(tagState==='all'||e.status===tagState)&&tagTerms.every(v=>e.tags.some(t=>t.label.includes(v)));});
    const options=[{label:'全部数据状态',value:'all'},...Object.entries(states).map(([value,meta])=>({value,label:meta[0]}))];
    const columns=[
      {title:'采集对象',dataIndex:'name',width:130,render:name=>name.endsWith('医生')?`${name.slice(0,1)}*医生`:name},
      {title:'采集用 E 人',width:180,render:(_,r)=>renderPerson(r)},
      {title:'来源接口',width:180,render:(_,r)=>resolveApi(r)},
      {title:'数据标签',width:255,render:(_,r)=>h(T.Cell,{scope,record:r})},
      {title:'对话轮次',dataIndex:'turns',width:100},
      {title:'数据状态',dataIndex:'stage',width:150,render:(_,r)=>h(Tag,{color:states[r.stage][1]},states[r.stage][0])},
      {title:'时间',dataIndex:'time',width:160},
      {title:'操作',width:160,fixed:'right',render:(_,r)=>h(Space,null,h(Button,{type:'link',style:{padding:0},onClick:()=>inspect(r)},'查看'),T.get(scope,r).status!=='done'&&h(Button,{type:'link',style:{padding:0},loading:T.get(scope,r).status==='running',onClick:()=>run([r])},'AI 打标'))}
    ];
    const allSelected=filtered.length>0&&filtered.every(r=>selected.includes(r.key||r.id));
    const actions=h('div',{className:'tag-toolbar-actions'},!tagDetail&&h(Button,{onClick:()=>setLibrary(true)},'标签体系'),batch?h(React.Fragment,null,h('span',{className:'tag-selected-count'},`已选 ${selected.length} 条`),h(Button,{onClick:()=>{setSelected([]);setBatch(false);}},'取消'),h(Button,{disabled:!filtered.length,onClick:()=>setSelected(allSelected?[]:filtered.map(r=>r.key||r.id))},allSelected?'取消全选':'全选'),h(Button,{type:'primary',disabled:!eligible.length,onClick:()=>run(eligible)},'AI 打标')):h(Button,{disabled:!filtered.length,onClick:()=>{setBatch(true);setSelected([]);}},'批量操作'));
    return h('div',{className:'table-wrap task-flow-table record-data-table',style:{paddingTop:20}},
      h('div',{className:'tag-list-toolbar'},h(Input,{allowClear:true,placeholder:'搜索采集对象',value:search,onChange:e=>setSearch(e.target.value),style:{width:215}}),h(Select,{'aria-label':'数据状态筛选',value:filter,onChange:onFilter,options,style:{width:160}}),h(Input,{'aria-label':'标签搜索',allowClear:true,placeholder:'搜索标签，多个用顿号或空格分隔',title:'多个标签需同时匹配，支持部分文字搜索',value:tagSearch,onChange:e=>setTagSearch(e.target.value),style:{width:300}}),h(Select,{value:tagState,onChange:setTagState,style:{width:140},options:[{value:'all',label:'全部打标状态'},{value:'none',label:'未打标'},{value:'running',label:'打标中'},{value:'done',label:'已打标'},{value:'failed',label:'打标失败'}]}),!tagDetail&&actions),
      actionsHost&&ReactDOM.createPortal(actions,actionsHost),
      running>0&&h(Alert,{type:'info',showIcon:true,message:`正在为 ${running} 条数据生成标签，可继续浏览页面。`}),
      h(Table,{key:`${scopeKey}-${filter}`,rowKey:r=>r.key||r.id,columns,dataSource:filtered,rowSelection:batch?{selectedRowKeys:selected,onChange:setSelected,preserveSelectedRowKeys:true}:undefined,
        pagination:pagination||{pageSize:5,showSizeChanger:false,showTotal:n=>`共 ${n} 条`},scroll:{x:1370},
        locale:{emptyText:'暂无符合条件的数据'}}),h(T.Library,{scope,open:library,onClose:()=>setLibrary(false)}),detail&&h(T.Detail,{key:scope+String(detail.key||detail.id),scope,record:detail,records:visible,onClose:()=>setDetail(null)}));
  }
  function Analysis({current,target,approved}){
    const collected=Math.max(0,Number(current)||0), goal=Math.max(0,Number(target)||0);
    const reviewed=Math.min(collected,Math.max(0,Number(approved)||0)), awaiting=collected-reviewed, remaining=Math.max(0,goal-collected);
    // One dot represents one item for normal project sizes; cap rendering for large targets.
    const total=Math.max(goal,collected), count=Math.min(total,5000), scale=total/Math.max(1,count);
    const legend=(type,label,n)=>h('span',{key:type},h('i',{className:`legend-dot ${type}`}),`${label} ${n.toLocaleString()}`);
    return h('div',{className:'analysis-grid analysis-dashboard','data-enhanced':'true',style:{display:'block',gridTemplateColumns:'none',gap:0}},
      h('div',{className:'collection-layout collection-layout-single'},h('section',{className:'collection-signal'},
        h('div',{className:'signal-label'},'DATA COLLECTION PROGRESS'),
        h('div',{className:'signal-summary'},h('div',null,h('strong',null,`${goal?Math.round(collected/goal*100):0}%`),h('span',null,'采集完成度')),
          h('div',{className:'signal-count'},h('b',null,collected.toLocaleString()),h('span',null,` / ${goal.toLocaleString()} 条`),h('small',null,'已采集数据 / 目标数量'))),
        h('div',{className:'signal-dots','aria-label':`已审核 ${reviewed} 条，待审核 ${awaiting} 条，待采集 ${remaining} 条`},
          Array.from({length:count},(_,i)=>h('i',{key:i,className:`signal-dot ${i*scale<reviewed?'cleaned':i*scale<collected?'awaiting-clean':'uncollected'}`}))),
        h('div',{className:'signal-legend'},legend('uncollected','待采集',remaining),legend('awaiting-clean','待审核',awaiting),legend('cleaned','已审核',reviewed)))));
  }
  return {Dataset,Analysis};
})();

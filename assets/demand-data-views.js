/* Shared demand-side presentation, also used by the read-only enterprise viewer. */
window.DemandDataViews = (() => {
  const h=React.createElement;
  const {Table,Tag,Button,Space,Checkbox,Input,Select,Modal,Alert,Empty}=antd;
  const states={initial_approved:['待审核','warning'],final_rejected:['终审未通过','error'],final_approved:['终审通过','success']};
  function Dataset({records,filter,onFilter,onView,resolveApi,renderPerson,pagination,scopeKey,tagDetail=false,actionsHost,onManageTags,readOnly=false,maskNames=true}){
    const T=window.DataTagging; T.useStore();
    const [batch,setBatch]=React.useState(false),[selected,setSelected]=React.useState([]),[search,setSearch]=React.useState(''),[tagSearch,setTagSearch]=React.useState(''),[tagState,setTagState]=React.useState('all'),[library,setLibrary]=React.useState(false),[detail,setDetail]=React.useState(null);
    const [specifiedOpen,setSpecifiedOpen]=React.useState(false),[pickedTags,setPickedTags]=React.useState([]),[pickerSearch,setPickerSearch]=React.useState('');
    const scope=String(scopeKey);
    React.useEffect(()=>{setSpecifiedOpen(false);setPickedTags([]);setPickerSearch('');},[scope]);
    const tagId=(group,label)=>JSON.stringify([group,label]);
    const labelGroups=T.getTaxonomy(scope).map(([,group,labels])=>({group,labels:[...new Set([...labels,...records.flatMap(r=>T.get(scope,r).tags.filter(t=>t.group===group).map(t=>t.label))])]}));
    const allLabels=labelGroups.flatMap(({group,labels})=>labels.map(label=>({group,label,id:tagId(group,label)})));
    const shownGroups=labelGroups.map(({group,labels})=>({group,labels:labels.filter(label=>!pickerSearch.trim()||group.includes(pickerSearch.trim())||label.includes(pickerSearch.trim()))})).filter(item=>item.labels.length);
    const openSpecified=()=>{setPickedTags([]);setPickerSearch('');setSpecifiedOpen(true);};
    const startSpecified=()=>{
      if(!pickedTags.length||!eligible.length)return;
      T.start(scope,eligible,true,false,allLabels.filter(t=>pickedTags.includes(t.id)));
      setSpecifiedOpen(false);setSelected([]);setBatch(false);
    };
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
      {title:'采集对象',dataIndex:'name',width:130,render:name=>maskNames&&name.endsWith('医生')?`${name.slice(0,1)}*医生`:name},
      {title:'采集用 E 人',width:180,render:(_,r)=>renderPerson(r)},
      {title:'来源接口',width:180,render:(_,r)=>resolveApi(r)},
      {title:'数据标签',width:255,render:(_,r)=>h(T.Cell,{scope,record:r})},
      {title:'对话轮次',dataIndex:'turns',width:100},
      {title:'数据状态',dataIndex:'stage',width:150,render:(_,r)=>h(Tag,{color:states[r.stage][1]},states[r.stage][0])},
      {title:'数据来源',dataIndex:'dataOrigin',width:120,render:value=>value||'—'},
      {title:'时间',dataIndex:'time',width:160},
      {title:'操作',width:160,fixed:'right',render:(_,r)=>h(Space,null,h(Button,{type:'link',style:{padding:0},onClick:()=>inspect(r)},'查看'),!readOnly&&T.get(scope,r).status!=='done'&&h(Button,{type:'link',style:{padding:0},loading:T.get(scope,r).status==='running',onClick:()=>run([r])},'AI 打标'))}
    ];
    const allSelected=filtered.length>0&&filtered.every(r=>selected.includes(r.key||r.id));
    const actions=h('div',{className:'tag-toolbar-actions'},batch?h(React.Fragment,null,h('span',{className:'tag-selected-count'},`已选 ${selected.length} 条`),h(Button,{onClick:()=>{setSelected([]);setBatch(false);}},'取消'),h(Button,{disabled:!filtered.length,onClick:()=>setSelected(allSelected?[]:filtered.map(r=>r.key||r.id))},allSelected?'取消全选':'全选'),h(Button,{disabled:!eligible.length,onClick:openSpecified},'指定标签打标'),h(Button,{type:'primary',disabled:!eligible.length,onClick:()=>run(eligible)},'AI 打标')):h(Button,{disabled:!filtered.length,onClick:()=>{setBatch(true);setSelected([]);}},'批量操作'));
    return h('div',{className:'table-wrap task-flow-table record-data-table',style:{paddingTop:20}},
      h('div',{className:'tag-list-toolbar'},h(Input,{allowClear:true,placeholder:'搜索采集对象',value:search,onChange:e=>setSearch(e.target.value),style:{width:215}}),h(Select,{'aria-label':'数据状态筛选',value:filter,onChange:onFilter,options,style:{width:160}}),h(Input,{'aria-label':'标签搜索',allowClear:true,placeholder:'搜索标签，多个用顿号或空格分隔',title:'多个标签需同时匹配，支持部分文字搜索',value:tagSearch,onChange:e=>setTagSearch(e.target.value),style:{width:300}}),h(Select,{value:tagState,onChange:setTagState,style:{width:140},options:[{value:'all',label:'全部打标状态'},{value:'none',label:'未打标'},{value:'running',label:'打标中'},{value:'done',label:'已打标'},{value:'failed',label:'打标失败'}]}),!readOnly&&!tagDetail&&actions),
      !readOnly&&actionsHost&&ReactDOM.createPortal(actions,actionsHost),
      running>0&&h(Alert,{type:'info',showIcon:true,message:`正在为 ${running} 条数据生成标签，可继续浏览页面。`}),
      !readOnly&&h(Modal,{title:'指定标签打标',open:specifiedOpen,width:760,onCancel:()=>setSpecifiedOpen(false),onOk:startSpecified,okText:'确认并开始 AI 打标',cancelText:'取消',okButtonProps:{disabled:!pickedTags.length||!eligible.length}},
        h('div',{style:{display:'flex',gap:16,alignItems:'center',marginBottom:16}},
          h(Input,{allowClear:true,'aria-label':'搜索可选标签',placeholder:'搜索标签或分类',value:pickerSearch,onChange:e=>setPickerSearch(e.target.value)}),
          h(Button,{disabled:!allLabels.length,onClick:()=>setPickedTags(pickedTags.length===allLabels.length?[]:allLabels.map(t=>t.id))},pickedTags.length===allLabels.length&&allLabels.length?'取消全选':'全选')),
        h('div',{style:{marginBottom:16,color:'#667085'}},`已选 ${pickedTags.length} / ${allLabels.length} 个标签`),
        h('div',{style:{maxHeight:420,overflowY:'auto',paddingRight:8}},shownGroups.length?shownGroups.map(({group,labels})=>h('section',{key:group,style:{marginBottom:20}},
          h('h4',{style:{margin:'0 0 12px'}},group),
          h('div',{style:{display:'flex',gap:'8px 8px',flexWrap:'wrap'}},labels.map(label=>{
            const id=tagId(group,label),active=pickedTags.includes(id);return h(Button,{key:id,'aria-pressed':active,type:active?'primary':'default',onClick:()=>setPickedTags(previous=>previous.includes(id)?previous.filter(value=>value!==id):[...previous,id])},label);
          })))):h(Empty,{description:'暂无可选标签'})),
        ),
      h(Table,{key:`${scopeKey}-${filter}`,rowKey:r=>r.key||r.id,columns,dataSource:filtered,rowSelection:!readOnly&&batch?{selectedRowKeys:selected,onChange:setSelected,preserveSelectedRowKeys:true}:undefined,
        pagination:pagination||{pageSize:5,showSizeChanger:false,showTotal:n=>`共 ${n} 条`},scroll:{x:1490},
        locale:{emptyText:'暂无符合条件的数据'}}),h(T.Library,{scope,open:library,onClose:()=>setLibrary(false)}),detail&&h(T.Detail,{key:scope+String(detail.key||detail.id),scope,record:detail,records:visible,onClose:()=>setDetail(null),onManageTags,readOnly}));
  }
  function Analysis({scope,records=[],onBandFilter,bandFilter='all'}){
    const T=window.DataTagging;T.useStore();
    const stats=window.TagCoverage.summarize(records,r=>T.get(scope,r),T.getTaxonomy(scope));
    const model=window.TagCoverage.progress(stats.allTags);
    const labels={zero:'未覆盖',one:'1 条',two:'2 条',many:'3 条及以上'};
    const select=band=>onBandFilter?.(bandFilter===band?'all':band);
    return h('div',{className:'analysis-grid analysis-dashboard','data-enhanced':'true',style:{display:'block',gridTemplateColumns:'none',gap:0}},
      h('div',{className:'collection-layout collection-layout-single'},h('section',{className:'collection-signal'},
        h('div',{className:'signal-label'},'TAG COLLECTION PROGRESS',h('button',{type:'button',className:'signal-help',title:'完成度 = 各标签已完成名额之和 ÷（标签总数 × 3）。每个标签最多计 3 条；点阵按四种状态的标签占比分配，共 1,000 个点。','aria-label':'查看完成度计算规则'},'?')),
        h('div',{className:'signal-summary'},h('div',null,h('strong',null,`${model.percent}%`),h('span',null,'标签采集完成度')),
          h('div',{className:'signal-count'},h('b',null,model.achieved.toLocaleString()),h('span',null,` / ${model.total.toLocaleString()} 个`),h('small',null,'已达标标签 / 标签总数'))),
        h('div',{className:'signal-dots',title:`已完成 ${model.completed} / ${model.target} 个采集名额，还差 ${model.target-model.completed} 个`,'aria-label':`标签分布：${Object.entries(labels).map(([b,l])=>l+' '+model.counts[b]+' 个标签').join('，')}，完成度 ${model.percent}%`},
          model.dots.map((band,i)=>h('i',{key:i,className:`signal-dot ${band}`,title:labels[band],onClick:()=>select(band),'aria-hidden':'true'}))),
        h('div',{className:'signal-legend'},Object.entries(labels).map(([band,label])=>h('button',{type:'button',key:band,'aria-pressed':bandFilter===band,title:`${label}：${model.counts[band]} 个标签`,'aria-label':`${label}：${model.counts[band]} 个标签`,onClick:()=>select(band)},h('i',{className:`legend-dot ${band}`}),`${model.counts[band]}条`))))));
  }
  function ProjectAnalysis({scope,records,current,target,approved,manageTags=true}){
    const [managementOpen,setManagementOpen]=React.useState(false);
    const [bandFilter,setBandFilter]=React.useState('all');
    React.useEffect(()=>setBandFilter('all'),[scope]);
    const demandRecords=records.filter(r=>states[r.stage]);
    return h(React.Fragment,null,
      h(Analysis,{scope,records:demandRecords,bandFilter,onBandFilter:setBandFilter}),
      h(window.TagCoverage.Component,{scope,records:demandRecords,bandFilter,onBandFilter:setBandFilter,onEditSchema:manageTags?()=>setManagementOpen(true):undefined}),
      manageTags&&h(window.DataTagging.Library,{editor:true,scope,open:managementOpen,onClose:()=>setManagementOpen(false)}));
  }
  return {Dataset,Analysis,ProjectAnalysis};
})();

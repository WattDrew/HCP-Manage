window.TagCoverage = (() => {
  const h=React.createElement;
  const {Select,Empty,Input,Table,Button,Modal,Tag,Checkbox}=antd;
  const ratio=(count,total)=>total?Math.round(count/total*100):0;
  function summarize(records,read,scheme,source='all'){
    const groups=new Map(scheme.map(([,name])=>[name,{name,count:0}])),ranking=new Map();
    let tagged=0,instances=0,ai=0,manual=0;
    const addTag=(group,label)=>{const key=JSON.stringify([group,label]);if(!ranking.has(key))ranking.set(key,{key,group,label,count:0,ai:0,manual:0,recordIds:[]});};
    for(const [,group,labels] of scheme)for(const label of labels)addTag(group,label);
    // A record contributes at most once to each category and each distinct tag.
    const uniqueRecords=[...new Map(records.map(r=>[String(r.key||r.id),r])).values()];
    for(const record of uniqueRecords){
      const unique=new Map();
      for(const t of read(record).tags||[]){
        const key=JSON.stringify([t.group,t.label]);
        if(!unique.has(key)||t.source==='人工')unique.set(key,t);
      }
      for(const t of unique.values()){addTag(t.group,t.label);if(!groups.has(t.group))groups.set(t.group,{name:t.group,count:0});}
      const tags=[...unique.values()].filter(t=>source==='all'||(source==='manual'?t.source==='人工':t.source!=='人工'));
      if(tags.length)tagged++;
      instances+=tags.length;
      for(const name of new Set(tags.map(t=>t.group))){
        if(!groups.has(name))groups.set(name,{name,count:0});
        groups.get(name).count++;
      }
      for(const t of tags){
        const key=JSON.stringify([t.group,t.label]);
        addTag(t.group,t.label);
        const row=ranking.get(key);row.count++;row.recordIds.push(String(record.key||record.id));
        if(t.source==='人工'){manual++;row.manual++;}else{ai++;row.ai++;}
      }
    }
    const total=uniqueRecords.length,categories=[...groups.values()].sort((a,b)=>b.count-a.count);
    return {total,tagged,untagged:total-tagged,coverage:ratio(tagged,total),instances,ai,manual,
      categories,covered:categories.filter(c=>c.count>0).length,
      average:tagged?(instances/tagged).toFixed(1):'0',
      allTags:[...ranking.values()].sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'zh-CN')),
      ranking:[...ranking.values()].filter(r=>r.count>0).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'zh-CN'))};
  }
  const coverageBand=count=>count===0?'zero':count===1?'one':count===2?'two':'many';
  // Allocate exactly 1,000 dots by largest remainder; progress uses capped slots.
  function progress(allTags){
    const bands=['many','two','one','zero'];
    const total=allTags.length,completed=allTags.reduce((n,t)=>n+Math.min(3,Math.max(0,t.count)),0),target=total*3;
    const counts=Object.fromEntries(bands.map(b=>[b,allTags.filter(t=>coverageBand(t.count)===b).length]));
    const shares=bands.map(b=>({band:b,exact:total?counts[b]/total*1000:(b==='zero'?1000:0)}));
    shares.forEach(s=>{s.dots=Math.floor(s.exact);});
    const remainder=1000-shares.reduce((n,s)=>n+s.dots,0);
    [...shares].sort((a,b)=>(b.exact-b.dots)-(a.exact-a.dots)).slice(0,remainder).forEach(s=>s.dots++);
    return {total,completed,target,counts,achieved:counts.many,percent:target?(completed===target?100:Math.min(99,Math.round(completed/target*100))):0,
      dots:shares.flatMap(s=>Array(s.dots).fill(s.band))};
  }
  function sortTags(tags,mode,presets=[]){
    const index=label=>{const i=presets.indexOf(label);return i<0?presets.length:i;};
    return tags.map((tag,position)=>({tag,position})).sort((a,b)=>{
      const countOrder=mode==='desc'?b.tag.count-a.tag.count:mode==='asc'?a.tag.count-b.tag.count:0;
      return countOrder||index(a.tag.label)-index(b.tag.label)||a.position-b.position;
    }).map(item=>item.tag);
  }
  function Component({scope,records,onEditSchema,bandFilter='all',onBandFilter}){
    const T=window.DataTagging;T.useStore();
    const [category,setCategory]=React.useState('all'),[query,setQuery]=React.useState(''),[coverageFilter,setCoverageFilter]=React.useState('all'),[tagKey,setTagKey]=React.useState(null),[inspected,setInspected]=React.useState(null),[sort,setSort]=React.useState('default');
    React.useEffect(()=>{setCategory('all');setQuery('');setCoverageFilter('all');setTagKey(null);setInspected(null);setSort('default');},[scope]);
    React.useEffect(()=>{setCategory('all');setQuery('');setCoverageFilter('all');},[bandFilter]);
    const stats=summarize(records,r=>T.get(scope,r),T.getTaxonomy(scope));
    const terms=query.trim().split(/[、\s,，]+/u).filter(Boolean);
    const fullRows=stats.allTags.filter(t=>(category==='all'||t.group===category)&&(!terms.length||terms.some(v=>t.label.includes(v)))&&(coverageFilter==='all'||t.count===0)&&(bandFilter==='all'||coverageBand(t.count)===bandFilter));
    const groupNames=[...new Set([...T.getTaxonomy(scope).map(([,name])=>name),...stats.allTags.map(t=>t.group)])];
    const mapGroups=groupNames.map(name=>({name,tags:sortTags(fullRows.filter(t=>t.group===name),sort,T.getTaxonomy(scope).find(([,g])=>g===name)?.[2]||[])})).filter(g=>g.tags.length||(!query.trim()&&category==='all'&&coverageFilter==='all'&&bandFilter==='all'));
    const selectedTag=stats.allTags.find(t=>t.key===tagKey);
    const matched=selectedTag?records.filter(r=>selectedTag.recordIds.includes(String(r.key||r.id))):[];


    return h('section',{className:'tag-coverage'},
      h('section',{className:'tag-analysis-module'},h('header',{className:'tag-module-heading'},h('h3',null,'标签覆盖图'),onEditSchema&&h(Button,{onClick:onEditSchema},'标签管理')),
        h('div',{className:'tag-chart-card tag-map-card'},
        h('div',{className:'tag-map-legend','aria-label':'覆盖数量图例'},[['zero','未覆盖'],['one','1 条'],['two','2 条'],['many','3 条及以上']].map(([band,label])=>h('span',{key:band,className:band},h('i',null),label))),
        h('div',{className:'tag-all-toolbar tag-map-toolbar'},bandFilter!=='all'&&h(Button,{size:'small',onClick:()=>onBandFilter?.('all')},'显示全部标签'),h(Input,{'aria-label':'搜索覆盖图标签',allowClear:true,placeholder:'搜索标签，多个用顿号或空格分隔',title:'多个关键词匹配任一标签',value:query,onChange:e=>setQuery(e.target.value),style:{width:300}}),h(Select,{'aria-label':'覆盖图分类',value:category,onChange:setCategory,style:{width:175},options:[{label:'全部分类',value:'all'},...groupNames.map(name=>({label:name,value:name}))]}),h(Select,{'aria-label':'覆盖图排序',value:sort,onChange:setSort,style:{width:180},options:[{label:'默认',value:'default'},{label:'覆盖数从高到低',value:'desc'},{label:'覆盖数从低到高',value:'asc'}]}),h(Checkbox,{checked:coverageFilter==='zero',onChange:e=>setCoverageFilter(e.target.checked?'zero':'all')},'只看未覆盖')),
        mapGroups.length?h('div',{className:'tag-map-groups'},mapGroups.map(g=>h('section',{className:'tag-map-group',key:g.name},h('h5',null,g.name),h('div',{className:'tag-map-cells'},g.tags.length?g.tags.map(t=>h('button',{type:'button',key:t.key,className:`tag-map-cell ${coverageBand(t.count)}`,'aria-label':`${g.name} / ${t.label}，覆盖 ${t.count} 条数据`,title:`${g.name} / ${t.label}：${t.count} / ${stats.total} 条，AI ${t.ai} 条，手动 ${t.manual} 条`,onClick:()=>setTagKey(t.key)},h('span',null,t.label),h('b',null,t.count))):h('small',{className:'tag-map-empty'},'暂无预设或已提取标签'))))):h(Empty,{image:Empty.PRESENTED_IMAGE_SIMPLE,description:coverageFilter==='zero'?'当前筛选范围没有未覆盖标签':'暂无符合条件的标签'}))),
      h(Modal,{title:selectedTag?'标签分析 · '+selectedTag.label:'标签分析',open:!!selectedTag,width:780,onCancel:()=>setTagKey(null),footer:h(Button,{onClick:()=>setTagKey(null)},'关闭')},selectedTag&&h('div',null,h('p',{className:'tag-chart-note'},`${selectedTag.group} · 覆盖 ${selectedTag.count} / ${stats.total} 条数据（${ratio(selectedTag.count,stats.total)}%）`),h('div',{className:'tag-single-source'},h('span',{className:'tag-count-ai'},`AI 打标 ${selectedTag.ai} 条`),h('span',{className:'tag-count-manual'},`手动打标 ${selectedTag.manual} 条`)),h(Table,{size:'small',rowKey:r=>r.key||r.id,dataSource:matched,locale:{emptyText:'暂无数据覆盖该标签'},pagination:{pageSize:5,showSizeChanger:false},columns:[{title:'采集对象',dataIndex:'name'},{title:'数据编号',render:(_,r)=>r.key||r.id},{title:'采集时间',dataIndex:'time'},{title:'操作',render:(_,r)=>h(Button,{type:'link',onClick:()=>{setTagKey(null);setInspected(r);}},'查看')}]}))),
      inspected&&h(T.Detail,{key:String(inspected.key||inspected.id),scope,record:inspected,records,onClose:()=>setInspected(null),onManageTags:onEditSchema||(()=>T.openManagement(scope))}));
  }
  return {summarize,coverageBand,progress,sortTags,Component};
})();

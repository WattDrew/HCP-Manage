/* Project-scoped annotation interactions for the local workspace. */
window.DataTagging = (() => {
  const h=React.createElement, {useState,useEffect}=React;
  const {Button,Tag,Space,Select,Input,Modal,Alert,Empty,Tabs,Drawer,Popover,Progress,Checkbox,message}=antd;
  const taxonomy=[
    ['整段对话','医生职业背景',[],'包含科室、职称、医院等级、地区。根据 HCP 职业认证信息提取具体内容作为标签，例如眼科、主任医师、三级甲等、上海；认证信息缺失的字段不推测、不补全。'],
    ['整段对话','医生关注偏好',['关注疗效','关注安全性','关注证据','关注患者负担','关注使用便利性']],
    ['整段对话','沟通风格（DISC）',['直接简洁','重视细节','积极互动','谨慎求证']],
    ['整段对话','拜访场景',['首次介绍','常规复访','学术交流','产品交流','异议沟通','资料反馈']],
    ['整段对话','关系阶段',['初次接触','已建立联系','持续交流']],
    ['整段对话','沟通结果',['完成信息交流','问题得到回应','仍有未解决异议','同意接收资料','同意进一步交流','明确约定下一步','未明确下一步','明确拒绝继续交流']],
    ['整段对话','拜访完整度',['五步完整','包含开场','包含探询','包含产品呈现','包含异议处理','包含总结']],
    ['整段对话','医生参与度',['高度参与','主动交流','正常互动','被动回应','明显抵触','提前结束']],
    ['整段对话','整体评级',['优秀','良好','一般','较差','很差'],'综合主题相关性、信息具体性、互动有效性和交流完整性，选择一个等级：优秀为紧扣主题、信息具体充分、互动深入且完整收尾；良好为主要主题清晰、信息较具体、互动有效，仅有少量缺漏；一般为基本相关且有有效信息，但较笼统或关键内容覆盖不足；较差为偏题或重复较多、有效信息较少；很差为几乎无相关有效信息、交流难以形成实质内容。信息不足以判断时不打标；不以医生是否认可产品或愿意处方、采购作为评级依据。'],
    ['对话片段','讨论主题',['疾病认知','诊断评估','治疗选择','随访管理','起效时间','疗效程度','持续效果','疗效差异','不良反应','禁忌','相互作用','长期安全性','适应证','用法用量','疗程','操作方法','使用便利性','研究设计','研究结果','指南共识','真实世界证据','证据适用性','价格','医保','患者负担','院内准入','供应情况','依从性','患者教育','接受程度','特殊人群管理']],
    ['对话片段','涉及对象',[],'从对话中提取明确讨论的疾病、药品、医疗器械、治疗方式及患者群体，使用具体名称作为标签，例如儿童近视、OK 镜、低龄儿童。同一对象去重，有明确同义关系时统一名称；不猜测模糊药名、品牌或成分，不把讨论疾病理解为医生本人患病，不提取患者姓名、联系方式等身份信息。'],
    ['对话片段','询问与核实',['提问','追问','质疑','澄清确认']]
  ];
  const storage='hcp-annotations-v1';
  let saved={}; try{saved=JSON.parse(localStorage.getItem(storage)||'{}');if(!saved||Array.isArray(saved)||typeof saved!=='object')saved={};}catch{}
  // A page reload cancels local timers; restore those records to a retryable state.
  for(const entry of Object.values(saved)){if(entry.status==='running')entry.status=entry.tags?.length?'done':'none';}
  const listeners=new Set(), jobs=new Map();
  const schemaStorage='hcp-tag-schemas-v1';
  let schemas={};try{const raw=JSON.parse(localStorage.getItem(schemaStorage)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw))schemas=raw;}catch{}
  // Upgrade existing project schemas once, preserving custom labels and notes.
  const schemaNotesMigration='hcp-tag-schema-notes-v1';
  if(!localStorage.getItem(schemaNotesMigration)){
    const next={};
    for(const [scope,rows] of Object.entries(schemas)){
      next[scope]=Array.isArray(rows)?rows.map(row=>{
        const preset=taxonomy.find(t=>t[1]===row[1]&&t[3]);
        if(!preset)return row;
        const labels=row[1]==='医生职业背景'&&JSON.stringify(row[2])===JSON.stringify(['科室','职称','医院等级','地区'])?[]:row[2];
        return [row[0],row[1],labels,row[3]?.trim()?row[3]:preset[3]];
      }):rows;
    }
    try{localStorage.setItem(schemaStorage,JSON.stringify(next));localStorage.setItem(schemaNotesMigration,'1');schemas=next;}catch{}
  }
  // Replace only the previous default note; retain project-specific wording.
  {
    let changed=false;
    const next={...schemas};
    for(const [scope,rows] of Object.entries(schemas)){
      if(!Array.isArray(rows))continue;
      next[scope]=rows.map(row=>{
        if(row[1]!=='医生职业背景'||row[3]!=='包含科室、职称、医院等级、地区。根据对话中明确表达的信息提取具体内容作为标签，例如眼科、主任医师、三级甲等、上海；未提及的信息不推测、不补全。')return row;
        changed=true;
        return [...row.slice(0,3),taxonomy.find(t=>t[1]==='医生职业背景')[3]];
      });
    }
    if(changed){try{localStorage.setItem(schemaStorage,JSON.stringify(next));schemas=next;}catch{}}
  }
  const getTaxonomy=scope=>Array.isArray(schemas[String(scope)])?schemas[String(scope)]:taxonomy;
  function saveTaxonomy(scope,rows){
    const next={...schemas,[String(scope)]:rows};
    try{localStorage.setItem(schemaStorage,JSON.stringify(next));schemas=next;listeners.forEach(fn=>fn());return true;}
    catch{message.error('标签体系保存失败，请检查浏览器存储后重试');return false;}
  }

  const key=(scope,r)=>JSON.stringify([scope,String(r.key||r.id)]);
  const get=(scope,r)=>saved[key(scope,r)]||{status:'none',tags:[]};
  function put(scope,r,value){
    const next={...saved,[key(scope,r)]:value};
    try{localStorage.setItem(storage,JSON.stringify(next));saved=next;listeners.forEach(fn=>fn());return true;}
    catch{message.error('标签保存失败，请检查浏览器存储后重试');return false;}
  }
  function useStore(){const [,update]=useState(0);useEffect(()=>{const fn=()=>update(n=>n+1);listeners.add(fn);return()=>listeners.delete(fn);},[]);}
  function messages(r){return (r.conversation||initialConversation).map((v,i)=>typeof v==='string'?{text:v,sender:i%2?'doctor':'rep'}:{...v,sender:v.sender|| (i%2?'doctor':'rep')});}
  function infer(r,scope){
    const msgs=messages(r),tags=[];
    const add=(group,label,index)=>{if(!tags.some(t=>t.group===group&&t.label===label))tags.push({group,label,index,source:'AI'});};
    msgs.forEach((m,i)=>{
      if(/您好|你好/.test(m.text))add('拜访完整度','包含开场',i);
      if(/[？?]/.test(m.text)){add('拜访完整度','包含探询',i);if(m.sender==='doctor')add('询问与核实','提问',i);}
      if(m.sender==='doctor'){
        if(/安全|副作用|不良反应/.test(m.text))add('医生关注偏好','关注安全性',i);
        if(/疗效|效果/.test(m.text))add('医生关注偏好','关注疗效',i);
        if(/研究|证据|指南/.test(m.text))add('医生关注偏好','关注证据',i);
        if(/费用|价格|负担/.test(m.text))add('医生关注偏好','关注患者负担',i);
        if(/发我|给我.*资料/.test(m.text))add('沟通结果','同意接收资料',i);
        if(/下次|再聊/.test(m.text))add('沟通结果','同意进一步交流',i);
      }
      for(const [pattern,label] of [[/诊断|检查/,'诊断评估'],[/干预|治疗|药物|OK 镜/,'治疗选择'],[/随访/,'随访管理'],[/副作用|不良反应/,'不良反应'],[/用量|剂量/,'用法用量'],[/价格|费用/,'价格'],[/研究|证据/,'研究结果'],[/依从|坚持/,'依从性'],[/用眼习惯|户外活动/,'患者教育']])if(pattern.test(m.text))add('讨论主题',label,i);
      for(const term of ['儿童近视','干眼','白内障','糖尿病','老年患者','低龄儿童','OK 镜'])if(m.text.includes(term))add('涉及对象',term,i);
    });
    const scheme=getTaxonomy(scope);
    for(const [,group,labels] of scheme)for(const label of labels){const index=msgs.findIndex(m=>m.text.includes(label));if(index>=0)add(group,label,index);}
    return tags.filter(t=>scheme.some(([,group,labels])=>group===t.group&&(group==='涉及对象'||labels.includes(t.label))));
  }
  function mergeTags(previous,generated,overwriteManual){
    const manual=overwriteManual?[]:previous.filter(t=>t.source==='人工');
    return [...manual,...generated.filter(t=>!manual.some(m=>m.group===t.group&&m.label===t.label))];
  }
  function request(scope,records,onDone){
    let overwriteManual=false;
    Modal.confirm({title:records.length===1&&get(scope,records[0]).status==='done'?'重新 AI 打标':`AI 打标 · ${records.length} 条数据`,content:h('div',{className:'tag-overwrite-options'},h('p',null,'将重新生成 AI 标签，默认保留手动标签。'),h(Checkbox,{defaultChecked:false,onChange:e=>{overwriteManual=e.target.checked;}},'覆盖手动标签'),h('small',null,'勾选后将覆盖手动添加的标签，以及编辑过的 AI 标签。')),okText:'开始打标',cancelText:'取消',onOk:()=>{start(scope,records,true,overwriteManual);onDone?.();}});
  }
  function start(scope,records,rerun=false,overwriteManual=false,allowedTags=null){
    const selectedKeys=allowedTags && new Set(allowedTags.map(t=>JSON.stringify([t.group,t.label])));
    let count=0;
    records.forEach(r=>{
      const k=key(scope,r),old=get(scope,r);if(jobs.has(k)||(!rerun&&old.status==='done'))return;
      if(!put(scope,r,{...old,status:'running'}))return;count++;
      const timer=setTimeout(()=>{
        jobs.delete(k);
        const matches=infer(r,scope).filter(t=>!selectedKeys||selectedKeys.has(JSON.stringify([t.group,t.label])));
        const tags=selectedKeys
          ? [...old.tags.filter(t=>t.source!=='人工'&&!selectedKeys.has(JSON.stringify([t.group,t.label]))),...mergeTags(old.tags,matches,overwriteManual)]
          : mergeTags(old.tags,matches,overwriteManual);
        if(!put(scope,r,{status:'done',tags,updated:new Date().toISOString()})){saved[k]={...old,status:'failed'};listeners.forEach(fn=>fn());}
      },850+count*200);
      jobs.set(k,timer);
    });
    if(count)message.success(`已开始处理 ${count} 条数据`);else message.info('所选数据已有标签或正在处理中');
  }
  const stamp=v=>v?new Date(v).toLocaleString('zh-CN',{hour12:false}):'';
  function Cell({scope,record}){
    useStore();const entry=get(scope,record);
    if(entry.status==='running')return h('span',{className:'tag-muted'},'◌ 正在打标…');
    if(entry.status==='failed')return h(Tag,{color:'error'},'打标失败');
    if(entry.status!=='done')return h('span',{className:'tag-muted'},'未打标');
    return h('div',{className:'tag-cell'},entry.tags.slice(0,2).map(t=>h(Tag,{key:t.group+t.label,color:t.source==='人工'?'orange':'blue',title:t.source==='人工'?'手动打标':'AI 打标'},t.label)),entry.tags.length>2&&h(Popover,{title:'全部标签',content:h('div',{className:'tag-popover'},entry.tags.map(t=>h(Tag,{key:t.group+t.label,color:t.source==='人工'?'orange':'blue',title:t.source==='人工'?'手动打标':'AI 打标'},`${t.group} · ${t.label}`)))},h(Tag,{className:'tag-more'},`+${entry.tags.length-2}`)),!entry.tags.length&&h('span',{className:'tag-muted'},'未识别到标签'));
  }
  function Library({open,onClose,scope='default'}){
    useStore();
    const [editing,setEditing]=useState(false),[rows,setRows]=useState([]);
    useEffect(()=>{if(open){setEditing(false);setRows([]);}},[open,scope]);
    function begin(){setRows(getTaxonomy(scope).map(([level,name,labels,note=''])=>({level,name,text:labels.join('、'),note})));setEditing(true);}
    function change(index,field,value){setRows(rows.map((row,i)=>i===index?{...row,[field]:value}:row));}
    function save(){
      if(!rows.length){message.warning('请至少保留一个分类');return;}
      const names=rows.map(r=>r.name.trim());
      if(names.some(n=>!n)){message.warning('请填写分类名称');return;}
      if(new Set(names).size!==names.length){message.warning('分类名称不能重复');return;}
      const next=rows.map((r,i)=>[r.level||'',names[i],[...new Set(r.text.split(/[、\n,，]+/u).map(v=>v.trim()).filter(Boolean))],r.note.trim()]);
      if(saveTaxonomy(scope,next)){setEditing(false);message.success('标签体系已保存');}
    }
    return h(Modal,{title:'标签体系',open,onCancel:()=>{setEditing(false);onClose();},width:850,footer:editing?h('div',{className:'tag-schema-footer'},h(Button,{onClick:()=>setRows([...rows,{level:'',name:'',text:'',note:''}])},'+ 新增分类'),h(Space,null,h(Button,{onClick:()=>setEditing(false)},'取消'),h(Button,{type:'primary',onClick:save},'保存'))):h(Button,{onClick:onClose},'关闭')},
      h('div',{className:'tag-schema-toolbar'},h('small',null,'用于当前项目的后续 AI 打标，已有数据标签保留原值。'),!editing&&h(Button,{onClick:begin},'编辑标签体系')),
      h('div',{className:'tag-schema-list'},editing?rows.map((row,index)=>h('section',{key:index,className:'tag-schema-edit-row'},h(Input,{'aria-label':`分类名称 ${index+1}`,placeholder:'分类名称',maxLength:40,value:row.name,onChange:e=>change(index,'name',e.target.value)}),h('div',{className:'tag-schema-edit-fields'},h(Input.TextArea,{'aria-label':`分类标签 ${index+1}`,placeholder:'输入标签，多个标签用顿号分隔',autoSize:{minRows:2,maxRows:5},value:row.text,onChange:e=>change(index,'text',e.target.value)}),h(Input.TextArea,{'aria-label':`分类备注 ${index+1}`,placeholder:'备注（选填）：说明 AI 应如何判断和使用本分类标签',autoSize:{minRows:2,maxRows:5},value:row.note,onChange:e=>change(index,'note',e.target.value)})),h(Button,{danger:true,type:'text','aria-label':`删除分类 ${index+1}`,onClick:()=>setRows(rows.filter((_,i)=>i!==index))},'删除'))):getTaxonomy(scope).map(([,name,labels,note=''])=>h('section',{key:name,className:'tag-schema-view-row'},h('b',null,name),h('div',{className:'tag-schema-view-content'},h('p',null,labels.length?labels.join('、'):'-'),note.trim()&&h('p',{className:'tag-schema-note'},'备注：'+note))))));
  }
  const NativeContent=React.memo(function NativeContent({record}){
    return h('div',{className:'tag-native-body'},h('div',{className:'conversation','data-view-side':'demand','data-read-only':'true','data-record-status':({final_approved:'终审通过',final_rejected:'终审未通过',initial_approved:'待审核'}[record.stage]||''),'data-rejection-reason':record.stage==='final_rejected'?record.reason:''},messages(record).map((m,i)=>h('div',{key:i,id:`tag-message-current-${i}`,className:`message-row ${m.sender==='doctor'?'':'right'}`},h('div',{className:'message-label'},m.sender==='doctor'?`${record.name} · 医生`:'张三 · 医药代表'),h('div',{className:'bubble'},m.text)))));
  });
  function Detail({scope,record,records=[],onClose}){
    useStore();
    const [editing,setEditing]=useState(false),[draft,setDraft]=useState([]),[field,setField]=useState(null);
    const [pickerGroup,setPickerGroup]=useState(null),[pickerSelected,setPickerSelected]=useState([]),[pickerSearch,setPickerSearch]=useState(''),[newTagName,setNewTagName]=useState(''),[pickerNew,setPickerNew]=useState([]),[newLabels,setNewLabels]=useState([]);
    const [newTagGroup,setNewTagGroup]=useState('');
    const entry=get(scope,record),shown=editing?draft:entry.tags;
    function openEdit(){setDraft(entry.tags.map(t=>({...t})));setField(null);setNewLabels([]);setEditing(true);}
    function cancelEdit(){setField(null);setDraft([]);setNewLabels([]);setPickerGroup(null);setEditing(false);}
    function withField(){
      if(!field)return draft;
      const label=field.label.trim();
      if(!label){message.warning('请输入标签名称');return null;}
      if(draft.some((t,i)=>i!==field.index&&t.group===field.group&&t.label===label)){message.warning('该分类下已存在相同标签');return null;}
      const tag={group:field.group,label,source:'人工'};
      return field.index===undefined?[...draft,tag]:draft.map((t,i)=>i===field.index?tag:t);
    }
    function commitField(){const next=withField();if(next){setDraft(next);setField(null);}}
    function saveEdit(){
      const next=withField();if(!next)return;
      const additions=newLabels.filter(t=>next.some(item=>item.group===t.group&&item.label===t.label));
      if(additions.length){
        const scheme=getTaxonomy(scope).map(row=>[...row.slice(0,2),[...row[2]],...row.slice(3)]);
        additions.forEach(t=>{let row=scheme.find(([,group])=>group===t.group);if(!row){row=['整段对话',t.group,[]];scheme.push(row);}if(!row[2].includes(t.label))row[2].push(t.label);});
        if(!saveTaxonomy(scope,scheme))return;
      }
      if(put(scope,record,{status:'done',tags:next,updated:new Date().toISOString()})){setEditing(false);setField(null);setNewLabels([]);message.success('标签已保存');}
    }
    const tagId=(group,label)=>JSON.stringify([group,label]);
    const groupNames=[...new Set([...getTaxonomy(scope).map(row=>row[1]),...draft.map(t=>t.group)])];
    const pickerGroups=groupNames.map(group=>({group,labels:[...new Set([...(getTaxonomy(scope).find(([,g])=>g===group)?.[2]||[]),...records.flatMap(r=>get(scope,r).tags.filter(t=>t.group===group).map(t=>t.label)),...draft.filter(t=>t.group===group).map(t=>t.label),...pickerNew.filter(t=>t.group===group).map(t=>t.label)])]}));
    const allPickerLabels=pickerGroups.flatMap(({group,labels})=>labels.map(label=>({group,label,id:tagId(group,label)})));
    const available=allPickerLabels.map(t=>t.id);
    const shownPickerGroups=pickerGroups.map(({group,labels})=>({group,labels:labels.filter(label=>!pickerSearch.trim()||group.includes(pickerSearch.trim())||label.includes(pickerSearch.trim()))})).filter(item=>item.labels.length);
    function openPicker(group){if(field){message.info('请先完成当前标签的编辑');return;}setPickerGroup(group);setNewTagGroup(group);setPickerSelected(draft.map(t=>tagId(t.group,t.label)));setPickerSearch('');setNewTagName('');setPickerNew([]);}
    function createPickerLabel(){
      const label=newTagName.trim();if(!label){message.warning('请输入标签名称');return;}
      if(allPickerLabels.some(t=>t.group===newTagGroup&&t.label===label)){message.warning('该分类下已存在相同标签');return;}
      setPickerNew(previous=>[...previous,{group:newTagGroup,label}]);setPickerSelected(previous=>[...previous,tagId(newTagGroup,label)]);setNewTagName('');setPickerSearch('');
    }
    function confirmPicker(){
      const chosen=allPickerLabels.filter(t=>pickerSelected.includes(t.id));
      setDraft(previous=>chosen.map(({group,label})=>previous.find(item=>item.group===group&&item.label===label)||{group,label,source:'人工'}));
      setNewLabels(previous=>[...previous,...pickerNew.filter(t=>pickerSelected.includes(tagId(t.group,t.label)))]);setPickerGroup(null);
    }
    function editTag(group,index,label=''){if(field){message.info('请先完成当前标签的编辑');return;}setField({group,index,label});}
    function rerun(){request(scope,[record]);}
    const input=group=>field?.group===group&&h('div',{className:'tag-inline-input'},h(Input,{'aria-label':'标签名称',autoFocus:true,maxLength:40,size:'small',value:field.label,onChange:e=>setField({...field,label:e.target.value}),onPressEnter:commitField,onKeyDown:e=>{if(e.key==='Escape')setField(null);}}),h(Button,{size:'small','aria-label':'完成标签输入',onClick:commitField},'✓'),h(Button,{size:'small','aria-label':'取消标签输入',onClick:()=>setField(null)},'×'));
    return h(Drawer,{title:h(Space,null,'数据详情',h(Tag,{color:'blue'},record.name)),className:'tag-detail-drawer',width:'min(820px, 96vw)',open:true,onClose,destroyOnClose:true},
      h(Modal,{title:'添加标签',open:pickerGroup!==null,width:760,onCancel:()=>setPickerGroup(null),onOk:confirmPicker,okText:'确认',cancelText:'取消'},
        h('div',{style:{display:'flex',gap:16,alignItems:'center',marginBottom:16}},h(Input,{'aria-label':'搜索已有标签',placeholder:'搜索标签或分类',allowClear:true,value:pickerSearch,onChange:e=>setPickerSearch(e.target.value)}),h(Button,{disabled:!available.length,onClick:()=>setPickerSelected(pickerSelected.length===available.length?[]:available)},pickerSelected.length===available.length&&available.length?'取消全选':'全选')),
        h('div',{style:{display:'flex',gap:8,marginBottom:16}},h(Select,{'aria-label':'新增标签分类',value:newTagGroup,onChange:setNewTagGroup,options:groupNames.map(group=>({value:group,label:group})),style:{width:180,flexShrink:0}}),h(Input,{'aria-label':'新增标签名称',placeholder:'输入新标签名称',maxLength:40,value:newTagName,onChange:e=>setNewTagName(e.target.value),onPressEnter:createPickerLabel}),h(Button,{onClick:createPickerLabel},'新增标签')),
        h('div',{style:{color:'#667085',marginBottom:16}},`已选 ${pickerSelected.length} / ${allPickerLabels.length} 个标签`),
        h('div',{style:{maxHeight:420,overflowY:'auto',paddingRight:8}},shownPickerGroups.length?shownPickerGroups.map(({group,labels})=>h('section',{key:group,style:{marginBottom:20}},
          h('h4',{style:{margin:'0 0 12px'}},group),
          h('div',{style:{display:'flex',gap:8,flexWrap:'wrap'}},labels.map(label=>{
            const id=tagId(group,label);return h(Button,{key:id,'aria-pressed':pickerSelected.includes(id),type:pickerSelected.includes(id)?'primary':'default',onClick:()=>setPickerSelected(previous=>previous.includes(id)?previous.filter(value=>value!==id):[...previous,id])},label);
          })))):h(Empty,{description:'暂无可选标签'}))),
      h('div',{className:'tag-detail-layout'},
        h('aside',{className:'tag-sidebar tag-sidebar-inline'},
          h('div',{className:'tag-side-title'},h('h3',null,'数据标签')),h('div',{className:'tag-source-legend'},h('span',{className:'ai'},'AI 打标'),h('span',{className:'manual'},'手动打标')),
          h('div',{className:'tag-inline-actions'},editing?h(React.Fragment,null,h(Button,{size:'small',type:'primary',onClick:saveEdit},'确认'),h(Button,{size:'small',onClick:cancelEdit},'取消')):h(React.Fragment,null,h(Button,{size:'small',loading:entry.status==='running',onClick:()=>entry.status==='done'?rerun():start(scope,[record])},entry.status==='done'?'重新 AI 打标':'AI 自动打标'),h(Button,{size:'small',disabled:entry.status==='running',onClick:openEdit},'编辑标签'))),
          editing&&h('small',{className:'tag-inline-hint'},'双击标签修改，点击 × 删除'),
          h('div',{className:'tag-side-scroll'},entry.status==='running'?h(Empty,{description:'正在生成标签…',image:Empty.PRESENTED_IMAGE_SIMPLE}):!editing&&!shown.length?h(Empty,{description:'暂无标签',image:Empty.PRESENTED_IMAGE_SIMPLE}):[...getTaxonomy(scope),...shown.filter(t=>!getTaxonomy(scope).some(([,g])=>g===t.group)).filter((t,i,a)=>a.findIndex(o=>o.group===t.group)===i).map(t=>['',t.group,[]])].map(([,group])=>{
            const tags=shown.map((t,index)=>({...t,index})).filter(t=>t.group===group);
            if(!editing&&!tags.length)return null;
            return h('section',{className:'tag-group',key:group},h('h4',null,group),h('div',{className:'tag-chip-wrap'},tags.map(t=>field?.group===group&&field.index===t.index?null:h('span',{key:t.index,className:`tag-inline-chip ${t.source==='人工'?'source-manual':'source-ai'} ${editing?'is-editing':''}`,onDoubleClick:()=>editing&&editTag(group,t.index,t.label),title:(t.source==='人工'?'手动打标':'AI 打标')+(editing?' · 双击修改标签':'')},h('span',null,t.label),editing&&h('button',{type:'button','aria-label':`移除标签 ${t.label}`,onClick:()=>{setDraft(draft.filter((_,i)=>i!==t.index));setField(null);},onDoubleClick:e=>e.stopPropagation()},'×'))),editing&&!field&&h('button',{type:'button',className:'tag-add-chip','aria-label':`添加${group}标签`,onClick:()=>openPicker(group)},'+')),input(group));
          })),
          h('footer',null,entry.updated?'更新于 '+stamp(entry.updated):'')),
        h('main',{className:'tag-detail-main'},h(NativeContent,{record}))));
  }
  return {taxonomy,getTaxonomy,get,useStore,start,request,Cell,Library,Detail};
})();

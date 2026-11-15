const collectorParams=new URLSearchParams(window.location.search);
window.collectorTaskStates=(collectorParams.get('taskStates')||collectorParams.get('taskStatus')||'active').split(',');
window.collectorTasks=[
  {apiKey:'API-001',name:'华东区域采集 API',subtitle:'情景演练',duration:'每次对话约 10 分钟'},
  {apiKey:'API-003',name:'华北区域采集 API',subtitle:'情景演练',duration:'每次对话约 10 分钟'},
  {apiKey:'API-004',name:'西南区域采集 API',subtitle:'情景演练',duration:'每次对话约 10 分钟'},
  {apiKey:'API-005',name:'华中区域采集 API',subtitle:'情景演练',duration:'每次对话约 10 分钟'}
].map((task,index)=>({...task,state:collectorTaskStates[index]||'invalid'}));
window.selectedCollectorTask=0;
window.collectorTaskState=collectorTasks[0].state;
window.collectorTaskStatusMeta={
  active:{label:'进行中',className:'task-status-active'},
  stopped:{label:'已失效',className:'task-status-invalid'},
  done:{label:'已完成',className:'task-status-done'},
  invalid:{label:'已移除',className:'task-status-removed'}
};
const baseRenderHome=window.renderHome;
window.renderHome=function(){baseRenderHome();const bar=document.querySelector('.bar');let notice=bar.querySelector('#header-notice');if(!notice){notice=document.createElement('button');notice.id='header-notice';notice.className='header-notice';notice.type='button';notice.setAttribute('aria-label','消息中心');notice.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 10a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 22h4"/></svg><i>1</i>';notice.onclick=()=>go('notices');bar.append(notice);}};
window.certStep=window.certStep||1;
window.pickCareer=function(value){career=value;render();};
const roleIcons={医生:'<path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 9v8m-4-4h8"/>',医技:'<path d="M5 4h14v16H5zM8 8h8m-8 4h8m-8 4h4"/>',药师:'<path d="M9 4h6v5l3 5a4 4 0 0 1-3.5 6h-5A4 4 0 0 1 6 14l3-5V4Zm0 0h6"/>',护士:'<path d="M12 21s-7-4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-7 10-7 10ZM9 13h6m-3-3v6"/>',医疗机构其它人员:'<path d="M4 20V6h16v14M8 6V3h8v3M8 11h2m4 0h2m-8 4h2m4 0h2"/>',非医疗机构人员:'<path d="M4 20v-9l8-5 8 5v9M9 20v-4h6v4M9 12h.01M15 12h.01"/>'};
const roleIcon=name=>`<svg viewBox="0 0 24 24" aria-hidden="true">${roleIcons[name]}</svg>`;
window.renderCert=function(){
  title.textContent='职业认证';
  const roles=['医生','医技','药师','护士','医疗机构其它人员','非医疗机构人员'],step=window.certStep;
  const head=`<section class="verify-flow"><div class="verify-intro"><span class="verify-mark">✦</span><div><h1>职业认证</h1><p>完成认证后，为您匹配更合适的服务</p></div></div><div class="verify-steps"><div class="${step>=1?'active':''}"><b>1</b><span>选择职业</span></div><i></i><div class="${step>=2?'active':''}"><b>2</b><span>基本信息</span></div><i></i><div class="${step>=3?'active':''}"><b>3</b><span>上传附件</span></div></div>`;
  if(step===1){app.innerHTML=head+`<div class="verify-title"><h2>您属于哪类职业？</h2><p>选择后可在下一步补充认证资料。</p></div><div class="role-grid">${roles.map((name,i)=>`<button class="role-card ${i===0?'featured':''} ${career===name?'selected':''}" onclick="pickCareer('${name}')"><i>${roleIcon(name)}</i><span>${name}</span>${career===name?'<b>✓</b>':''}</button>`).join('')}</div><button class="primary verify-next" onclick="certStep=2;render()">下一步</button><button class="verify-skip" onclick="go('home')">暂不认证</button></section>`;return}
  if(step===2){const fields=[['姓名','请输入真实姓名'],['第一执业医院','请选择医院'],['等级','请选择等级'],['地区','请选择地区'],['科室','请选择科室'],['职称','请选择职称']];app.innerHTML=head+`<div class="verify-title"><h2>填写基本信息</h2><p>信息将仅用于职业身份认证。</p></div><div class="verify-form">${fields.map(([label,placeholder],i)=>`<label><span>${label}</span><input ${i===0?'required':''} placeholder="${placeholder}"><b>${i?'›':''}</b></label>`).join('')}</div><div class="verify-actions"><button onclick="certStep=1;render()">上一步</button><button class="primary" onclick="certStep=3;render()">下一步</button></div></section>`;return}
  app.innerHTML=head+`<div class="verify-title"><h2>上传认证附件</h2><p>清晰的证件照片可加快审核进度。</p></div><section class="verify-upload"><div class="upload-heading"><span>职业凭证</span><small>工作证、执业证等</small></div><button class="upload-tile"><i>＋</i><span>上传图片</span></button></section><section class="verify-upload"><div class="upload-heading"><span>身份证</span><small>请上传正反面</small></div><div class="upload-row"><button class="upload-tile"><i>＋</i><span>人像面</span></button><button class="upload-tile"><i>＋</i><span>国徽面</span></button></div></section><div class="verify-actions"><button onclick="certStep=2;render()">上一步</button><button class="primary" onclick="go('home')">确认提交</button></div></section>`;
};
window.getTaskConversationStats=function(){
  const screened=records.filter(r=>!['in_progress','initial_screening','initial_screen_rejected','ai_screen_failed'].includes(r.stage)).length;
  const submitted=records.filter(r=>['pending_initial_review','initial_rejected','pending_final_review','final_rejected','final_approved'].includes(r.stage)).length;
  return {dialogues:records.length,screened,submitted,adopted:records.filter(r=>r.stage==='final_approved').length};
};
window.renderTasks=function(){
  title.textContent='专项采集';
  const activeCount=collectorTasks.filter(task=>task.state==='active').length;
  const endedCount=collectorTasks.length-activeCount;
  const shown=collectorTasks.map((task,index)=>({task,index})).filter(({task})=>taskFilter==='all'||taskFilter==='active'&&task.state==='active'||taskFilter==='ended'&&task.state!=='active');
  const content=shown.length?shown.map(({task,index})=>{
    const meta=collectorTaskStatusMeta[task.state]||collectorTaskStatusMeta.invalid;
    return `<article class="task"><div class="task-heading"><div class="ico">${icon('eye')}</div><div><h3>${task.name}</h3><small>${task.subtitle}</small></div><span class="pill task-status ${meta.className}">${meta.label}</span></div><div class="task-bottom"><span>${task.duration}</span><button class="primary" onclick="openCollectorTask(${index})">查看详情 ${icon('arrow')}</button></div></article>`;
  }).join(''):'<div class="empty">当前状态暂无专项采集</div>';
  app.innerHTML=`<div class="task-filter-row"><div class="seg"><button class="${taskFilter==='all'?'active':''}" onclick="filterTasks('all')">全部 ${collectorTasks.length}</button><button class="${taskFilter==='active'?'active':''}" onclick="filterTasks('active')">进行中 ${activeCount}</button><button class="${taskFilter==='ended'?'active':''}" onclick="filterTasks('ended')">已结束 ${endedCount}</button></div></div>${content}`;
};
window.openCollectorTask=function(index){
  selectedCollectorTask=index;
  collectorTaskState=collectorTasks[index].state;
  go('detail');
};
const doctorConversationStatus={
  in_progress:['进行中','#eaf3ff','#2878d0'],
  initial_screening:['初筛中','#eaf3ff','#2878d0'],
  initial_screen_rejected:['初筛未通过','#fff1f0','#cf3f3f'],
  ai_screen_failed:['AI初筛失败','#fff1f0','#cf3f3f'],
  pending_submit:['待提交','#fff3df','#ac7b28'],
  pending_initial_review:['待初审','#eef2f7','#667085'],
  initial_rejected:['初审未通过','#fff1f0','#cf3f3f'],
  pending_final_review:['待终审','#eef2f7','#667085'],
  final_approved:['终审通过','#eaf8f1','#27845b'],
  final_rejected:['终审未通过','#fff1f0','#cf3f3f']
};
records=[
  {stage:'in_progress',time:'09.17 11:25'},
  {stage:'initial_screening',time:'09.17 10:48'},
  {stage:'initial_screen_rejected',time:'09.16 16:20'},
  {stage:'ai_screen_failed',time:'09.16 14:05'},
  {stage:'pending_submit',time:'09.15 15:36'},
  {stage:'pending_initial_review',time:'09.15 11:12'},
  {stage:'initial_rejected',time:'09.14 17:08'},
  {stage:'pending_final_review',time:'09.14 09:42'},
  {stage:'final_approved',time:'09.13 16:35'},
  {stage:'final_rejected',time:'09.13 10:18'}
];
const doctorStatus=r=>doctorConversationStatus[r.stage]||doctorConversationStatus.pending_submit;
window.renderRecords=function(){
  title.textContent='历史对话';
  const actionable=['in_progress','initial_screen_rejected','ai_screen_failed','pending_submit','initial_rejected','final_rejected'];
  const reviewing=['initial_screening','pending_initial_review','pending_final_review'];
  const completed=['final_approved'];
  const groups={actionable,reviewing,completed};
  const shown=records.map((r,i)=>({r,i})).filter(({r})=>recordFilter==='all'||groups[recordFilter].includes(r.stage));
  const items=shown.map(({r,i})=>{const status=doctorStatus(r);return `<button class="record" onclick="selected=${i};go('record')"><div class="avatar">张</div><div class="record-info"><b>眼科拜访对话</b><small>张三 · ${r.time}</small><span class="pill conversation-status" style="background:${status[1]};color:${status[2]}">${status[0]}</span></div>${icon('chevron')}</button>`}).join('');
  app.innerHTML=`<div class="seg history-filter"><button class="${recordFilter==='all'?'active':''}" onclick="filterRecords('all')">全部 ${records.length}</button><button class="${recordFilter==='actionable'?'active':''}" onclick="filterRecords('actionable')">待处理 ${records.filter(r=>actionable.includes(r.stage)).length}</button><button class="${recordFilter==='reviewing'?'active':''}" onclick="filterRecords('reviewing')">审核中 ${records.filter(r=>reviewing.includes(r.stage)).length}</button><button class="${recordFilter==='completed'?'active':''}" onclick="filterRecords('completed')">已完成 ${records.filter(r=>completed.includes(r.stage)).length}</button></div>${items}`;
};
window.renderRecord=function(){
  title.textContent='对话详情';
  const r=records[selected],status=doctorStatus(r),recollect=['initial_screen_rejected','initial_rejected','final_rejected'].includes(r.stage);
  const actions=r.stage==='in_progress'?'<button class="primary" onclick="go(\'voice\')">继续对话</button>':recollect?'<button class="primary" onclick="go(\'voice\')">重新采集</button>':r.stage==='ai_screen_failed'?'<button class="primary" onclick="retryInitialScreen()">重试初筛</button>':r.stage==='pending_submit'?'<button class="primary secondary" onclick="go(\'voice\')">再次对话</button><button class="primary" onclick="confirmSubmit()">确认提交</button>':'<button class="primary secondary" onclick="go(\'records\')">返回历史对话</button>';
  app.innerHTML=`<div class="chat-state record-status">眼科专项采集<span class="pill conversation-status" style="background:${status[1]};color:${status[2]}">${status[0]}</span></div><div class="chat">${messages()}</div><div class="row">${actions}</div>`;
};
window.retryInitialScreen=function(){records[selected].stage='initial_screening';go('records')};
submitted=function(){records[selected].stage='pending_initial_review';go('records')};

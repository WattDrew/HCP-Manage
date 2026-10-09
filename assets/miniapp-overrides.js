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
  const screened=records.filter(r=>!['ai_screening','ai_rejected'].includes(r.stage)).length;
  const submitted=records.filter(r=>['submitted','initial_rejected','initial_approved','final_rejected','final_approved'].includes(r.stage)).length;
  return {dialogues:records.length,screened,submitted,adopted:records.filter(r=>r.stage==='final_approved').length};
};
window.renderTasks=function(){
  title.textContent='专项采集';
  const completed=records.some(r=>r.stage==='final_approved');
  const status=completed?'<span class="pill task-completed">已完成</span>':'';
  const content=taskFilter!=='ended'?`<article class="task"><div class="task-heading"><div class="ico">${icon('eye')}</div><div><h3>眼科专项采集</h3><small>情景演练</small></div>${status}</div><div class="task-bottom"><span>每次对话约 10 分钟</span><button class="primary" onclick="go('detail')">查看详情 ${icon('arrow')}</button></div></article>`:'<div class="empty">暂无已结束的专项采集<br>已结束的专项采集将展示在这里</div>';
  app.innerHTML=`<div class="task-filter-row"><div class="seg"><button class="${taskFilter==='all'?'active':''}" onclick="filterTasks('all')">全部 1</button><button class="${taskFilter==='active'?'active':''}" onclick="filterTasks('active')">进行中 1</button><button class="${taskFilter==='ended'?'active':''}" onclick="filterTasks('ended')">已结束 0</button></div><button class="history-link" onclick="go('records')">历史对话 ›</button></div>${content}`;
};
const doctorConversationStatus={
  ai_screening:['AI 初筛中','#eaf3ff','#2878d0'],
  ai_rejected:['AI 初筛未通过','#fff1f0','#cf3f3f'],
  pending_submit:['待提交','#fff3df','#ac7b28'],
  submitted:['已提交','#eef2f7','#667085'],
  initial_rejected:['初审未通过<br>需要重新采集','#fff1f0','#cf3f3f'],
  initial_approved:['初审已通过','#eaf3ff','#2878d0'],
  final_rejected:['终审未通过<br>需要重新采集','#fff1f0','#cf3f3f'],
  final_approved:['已采用','#eaf8f1','#27845b']
};
records=[
  {stage:'pending_submit',time:'09.17 11:25'},
  {stage:'ai_screening',time:'09.17 10:48'},
  {stage:'ai_rejected',time:'09.16 16:20'},
  {stage:'submitted',time:'09.16 14:05'},
  {stage:'initial_rejected',time:'09.15 15:36'},
  {stage:'initial_approved',time:'09.15 11:12'},
  {stage:'final_rejected',time:'09.14 17:08'},
  {stage:'final_approved',time:'09.14 09:42'}
];
const doctorStatus=r=>doctorConversationStatus[r.stage]||doctorConversationStatus.pending_submit;
window.renderRecords=function(){
  title.textContent='历史对话';
  const actionable=['pending_submit','ai_rejected','initial_rejected','final_rejected'];
  const reviewing=['ai_screening','submitted','initial_approved'];
  const completed=['final_approved'];
  const groups={actionable,reviewing,completed};
  const shown=records.map((r,i)=>({r,i})).filter(({r})=>recordFilter==='all'||groups[recordFilter].includes(r.stage));
  const items=shown.map(({r,i})=>{const status=doctorStatus(r);return `<button class="record" onclick="selected=${i};go('record')"><div class="avatar">张</div><div class="record-info"><b>眼科拜访对话</b><small>张三 · ${r.time}</small><span class="pill conversation-status" style="background:${status[1]};color:${status[2]}">${status[0]}</span></div>${icon('chevron')}</button>`}).join('');
  app.innerHTML=`<div class="seg history-filter"><button class="${recordFilter==='all'?'active':''}" onclick="filterRecords('all')">全部 ${records.length}</button><button class="${recordFilter==='actionable'?'active':''}" onclick="filterRecords('actionable')">待处理 ${records.filter(r=>actionable.includes(r.stage)).length}</button><button class="${recordFilter==='reviewing'?'active':''}" onclick="filterRecords('reviewing')">审核中 ${records.filter(r=>reviewing.includes(r.stage)).length}</button><button class="${recordFilter==='completed'?'active':''}" onclick="filterRecords('completed')">已完成 ${records.filter(r=>completed.includes(r.stage)).length}</button></div>${items}`;
};
window.renderRecord=function(){
  title.textContent='对话详情';
  const r=records[selected],status=doctorStatus(r),retry=['ai_rejected','initial_rejected','final_rejected'].includes(r.stage);
  app.innerHTML=`<div class="chat-state record-status">眼科专项采集<span class="pill conversation-status" style="background:${status[1]};color:${status[2]}">${status[0]}</span></div><div class="chat">${messages()}</div><div class="row">${retry?'<button class="primary" onclick="go(\'chat\')">重新采集</button>':r.stage==='pending_submit'?'<button class="primary secondary" onclick="go(\'chat\')">再次对话</button><button class="primary" onclick="confirmSubmit()">确认提交</button>':'<button class="primary secondary" onclick="go(\'records\')">返回历史对话</button>'}</div>`;
};
submitted=function(){records[selected].stage='submitted';go('records')};

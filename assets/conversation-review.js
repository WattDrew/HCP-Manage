const baseReviewVoice=window.renderVoice;
window.renderVoice=function(){
  baseReviewVoice();
  document.querySelector('#endNow').onclick=()=>{modal.classList.remove('open');selected=0;records[selected].stage='pending_submit';go('review')};
};
window.renderReview=function(){
  title.textContent='查看对话';
  const messages=[['me','张主任您好'],['','你好，今天想和您聊聊近视防控的诊疗经验。'],['me','好的。最近低龄近视患儿明显增多。'],['','确实如此，低龄患者的干预窗口更需要关注。']];
  app.innerHTML=`<section class="review-page"><div class="review-meta"><span>眼科专项采集</span><small>AI 初筛通过 · 待提交</small></div><div class="review-list">${messages.map(([side,text])=>`<div class="message ${side}"><div class="message-label">${side?'张三 · 医药代表':'张主任'}</div><div class="bubble">${text}</div></div>`).join('')}</div><div class="review-actions"><button onclick="go('voice')">再练 1 次</button><button class="primary" onclick="confirmSubmit()">提交对话</button></div></section>`;
};
const baseReviewRender=window.render;
window.render=function(){
  if(page!=='review'){baseReviewRender();return}
  app.dataset.page=page;
  back.style.display='flex';
  back.innerHTML=icon('back');
  brandmark.innerHTML='';
  capsule.style.display='none';
  document.querySelector('.bar').style.display='flex';
  nav.style.display='none';
  title.textContent='查看对话';
  renderReview();
};
back.onclick=()=>go(page==='review'?'voice':page==='cert'?'login':page==='notices'||page==='tasks'?'home':page==='detail'?'tasks':page==='voice'?'detail':page==='chat'?'voice':page==='records'?'tasks':page==='record'?'records':'home');

window.renderDetail=function(){
  title.textContent='专项详情';
  app.innerHTML=`<section class="detail-flow"><div class="detail-main"><h1>眼科专项采集</h1><span class="pill">进行中</span><div class="detail-metrics"><div><strong>5</strong><span>已对话</span></div><div><strong>3</strong><span>已提交</span></div></div><section class="card"><h3>采集要求</h3><p>围绕眼科近视防控场景开展自然交流，了解患者情况、诊疗习惯、产品认知、竞品情况、临床痛点及未满足需求。</p><div class="person"><div class="avatar">张</div><div><b>张三</b><small>医药代表 · 采集人</small></div></div></section><button type="button" class="conversation-record-card" onclick="go('records')"><span>对话记录</span><span><strong>${records.length}</strong> 条 <b>›</b></span></button><section class="card info"><p>建议对话时长 <b>10 分钟</b></p><p>发起方 <b>核盛健康管理</b></p><p>发起时间 <b>09.17 11:25</b></p></section></div><button class="primary start-voice" onclick="go('voice')">开始对话</button></section>`;
};
window.renderVoice=function(){
  title.textContent='张三';
  modal.querySelector('#modal-title').textContent='结束本次对话？';
  modal.querySelector('.sheet p').textContent='结束后，本次对话将保存为草稿记录。';
  document.querySelector('#endNow').textContent='确认结束';
  document.querySelector('#continue').textContent='继续对话';
  document.querySelector('#endNow').onclick=()=>{modal.classList.remove('open');go('detail')};
  document.querySelector('#continue').onclick=()=>modal.classList.remove('open');
  app.innerHTML=`<section class="voice-page"><div class="voice-top"><button onclick="go('detail')">‹</button><b>张三</b><span>••• ◉</span></div><div class="voice-profile"><div class="voice-avatar">张</div><p>张主任</p><small>眼科 · 主任医师</small></div><p class="voice-desc">围绕眼科近视防控场景展开自然交流，了解临床诊疗习惯与实际需求。</p><div class="voice-wave">|||||||||||||</div><h2>我在听，你说</h2><small class="voice-time">08:56</small><div class="voice-modes"><button onclick="modal.classList.add('open')" aria-label="结束对话">⌕</button><button onclick="go('chat')" aria-label="进入文字对话">▤</button><button aria-label="更多操作">⋮</button></div><div class="voice-actions"><button class="hangup" onclick="modal.classList.add('open')" aria-label="挂断">⌕</button><button class="talk">♧ <span>按住说话</span></button></div><small class="voice-disclaimer">对话由 AI 生成，仅供参考</small></section>`;
};
window.renderChat=function(){
  title.textContent='文字对话';
  const list=[['me','张主任您好'],['','你好'],['me','今天主要想跟您交流一下儿童近视防控这块。最近门诊这类患者多吗？'],['','挺多的，尤其是低龄儿童，现在家长对近视也比较焦虑。'],...chat.map(t=>['me',t])];
  app.innerHTML=`<section class="text-dialog"><div class="dialog-state"><span></span>对话进行中 · 眼科数据采集</div><div class="chat" id="chat">${list.map(([m,t])=>`<div class="message ${m}"><div class="message-label">${m?'张三 · 医药代表':'张主任'}</div><div class="bubble">${escapeHtml(t)}</div></div>`).join('')}</div><form class="compose" onsubmit="event.preventDefault();send()"><input id="msg" placeholder="输入本轮对话内容…"><button>发送</button></form></section>`;
};
window.render=function(){
  const entry=['login','cert'].includes(page),voice=page==='voice',showNav=page==='home';
  app.dataset.page=page;
  back.style.display=['cert','notices','tasks','detail','voice','chat','records','record'].includes(page)&&!voice?'flex':'none';
  back.innerHTML=icon('back');
  brandmark.innerHTML=page==='home'?icon('spark'):'';
  capsule.style.display=page==='home'?'block':'none';
  document.querySelector('.bar').style.display=entry||voice?'none':'flex';
  nav.style.display=showNav?'flex':'none';
  nav.innerHTML=`<button class="active" onclick="go('home')">⌂<span>工作台</span></button><button>◌<span>沟通</span></button><button>♙<span>我的</span></button>`;
  ({login:renderLogin,cert:renderCert,home:renderHome,notices:renderNotices,tasks:renderTasks,detail:renderDetail,voice:renderVoice,chat:renderChat,records:renderRecords,record:renderRecord}[page])();
};
back.onclick=()=>go(page==='cert'?'login':page==='notices'||page==='tasks'?'home':page==='detail'?'tasks':page==='voice'?'detail':page==='chat'?'voice':page==='records'?'tasks':page==='record'?'records':'home');

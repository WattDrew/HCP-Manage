(function () {
  const reasons = {
    '初审未通过': '有效诊疗信息不足，对“低龄儿童近视干预方案”的回答较笼统，未说明适用人群与判断依据。请补充完整后重新采集。',
    '终审未通过': '核心结论缺少具体临床依据，且未覆盖任务要求中的随访频次与疗效评估标准。本条数据暂不采用。'
  };
  const reviewReasons = {};
  let audioTimer = null;

  function reasonFor(meta) {
    const stage = meta.status === '初审未通过' ? 'initial_rejected' : meta.status === '终审未通过' ? 'final_rejected' : '';
    return reviewReasons[`${meta.name}:${meta.status}`] || (stage ? localStorage.getItem(`hcp-rejection-${stage}`) : '') || reasons[meta.status] || '';
  }

  function selectedSide() {
    const selected = document.querySelector('.ant-menu-item-selected');
    return selected && selected.textContent.includes('采集项目') ? 'demand' : 'collector';
  }

  function getRecordMeta(drawer) {
    const doctorRow = Array.from(drawer.querySelectorAll('.message-row')).find(row => !row.classList.contains('right'));
    const name = (doctorRow?.querySelector('.message-label')?.textContent || '张医生').replace(' · 医生', '');
    const status = drawer.querySelector('.ant-drawer-extra .ant-tag')?.textContent.trim() || '';
    const isDemand = selectedSide() === 'demand';
    return { name, status, isDemand };
  }

  function audioControl(speaker, duration) {
    return `<button type="button" class="admin-audio" aria-label="播放${speaker}语音"><span class="admin-audio-icon">▶</span><span class="admin-wave">${'<i></i>'.repeat(24)}</span><span class="admin-audio-time">${duration}</span></button>`;
  }

  function logPanel(meta) {
    const initialPending = ['待错别字清洗', '待初审'].includes(meta.status);
    const initialState = meta.status === '初审未通过' ? ['未通过', 'error'] : initialPending ? ['待处理', 'pending'] : ['通过', 'done'];
    const finalState = meta.status === '终审未通过' ? ['未通过', 'error'] : meta.status === '终审通过' ? ['通过', 'done'] : ['待处理', 'pending'];
    const events = [
      ['2026.09.18 10:12:45', '终审' + finalState[0], '', finalState[1], finalState[0] === '通过' ? ['final', '查看终审对话内容'] : null],
      ['2026.09.17 15:20:36', '初审' + initialState[0], '', initialState[1], initialState[0] === '通过' ? ['initial', '查看初审对话内容'] : null],
      ['2026.09.17 13:52:18', 'AI 初筛通过', '', 'done'],
      ['2026.09.17 13:50:06', '提交对话', '', 'done', ['raw', '查看原始对话内容']],
      ['2026.09.17 11:33:58', '结束对话', '', 'done'],
      ['2026.09.17 11:25:02', '开始对话', 'Apple iPhone 15 Pro · iOS 19.1 · 元医 AI 3.8.2', 'done'],
      ['2026.09.17 11:24:38', '阅读并同意知情同意协议', '', 'done', ['consent', '查看']]
    ];
    return `<section class="detail-module log-module"><div class="log-timeline">${events.map(event => `<article class="log-event ${event[3]}"><i></i><div><time>${event[0]}</time><b>${event[1]}</b>${event[2] ? `<p>${event[2]}</p>` : ''}${event[4] ? `<button type="button" class="log-event-action" data-log-action="${event[4][0]}">${event[4][1]}</button>` : ''}</div></article>`).join('')}</div></section>`;
  }

  function subjectPanel(meta) {
    const name = meta.isDemand ? meta.name.slice(0, 1) + '*医生' : meta.name;
    const identityRows = [
      ['职业类型', '医生'], ['姓名', name], ['第一执业医院', '上海市第一人民医院'], ['等级', '三级甲等'],
      ['地区', '上海市 · 虹口区'], ['科室', '眼科'], ['职称', '主任医师'], ['认证状态', '已通过']
    ];
    const rows = items => items.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
    const credentialControl = meta.isDemand
      ? `<button type="button" class="credential-photo masked" data-masked="true" aria-label="执业凭证信息已脱敏"><img src="assets/demo-medical-license.svg" alt=""><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9 5.2 9 5.2a14.2 14.2 0 0 1-2.1 2.5M6.6 6.6A15.5 15.5 0 0 0 3 9.2S6.5 14.5 12 14.5c1 0 2-.2 2.8-.5"/></svg></button>`
      : `<button type="button" class="credential-photo" data-masked="false" aria-label="查看执业凭证详情"><img src="assets/demo-medical-license.svg" alt="虚构医师执业凭证演示图片"></button>`;
    return `<section class="detail-module subject-module"><h4 class="identity-section-title">职业认证信息</h4><dl class="identity-grid">${rows(identityRows)}<div class="credential-row"><dt>执业凭证</dt><dd>${credentialControl}</dd></div></dl></section>`;
  }

  function showCredentialToast() {
    let toast = document.querySelector('#credentialToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'credentialToast';
      toast.className = 'credential-toast';
      toast.textContent = '执业凭证信息已脱敏';
      document.body.append(toast);
    }
    clearTimeout(toast.hideTimer);
    toast.classList.add('show');
    toast.hideTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function credentialDialog() {
    let dialog = document.querySelector('#credentialDialog');
    if (dialog) return dialog;
    dialog = document.createElement('div');
    dialog.id = 'credentialDialog';
    dialog.className = 'credential-dialog';
    dialog.innerHTML = `<div class="credential-dialog-card"><div><h2>执业凭证</h2><button type="button" aria-label="关闭">×</button></div><img src="assets/demo-medical-license.svg" alt="虚构医师执业凭证演示图片"><p>演示数据 · 已通过职业认证核验</p></div>`;
    document.body.append(dialog);
    const close = () => dialog.classList.remove('open');
    dialog.querySelector('button').onclick = close;
    dialog.onclick = event => { if (event.target === dialog) close(); };
    return dialog;
  }

  function consentDialog() {
    let dialog = document.querySelector('#adminConsentDialog');
    if (dialog) return dialog;
    dialog = document.createElement('div');
    dialog.id = 'adminConsentDialog';
    dialog.className = 'admin-consent-dialog';
    dialog.innerHTML = `<div class="admin-consent-card"><div class="admin-consent-head"><div><small>协议版本 HCP-ICF-2026.09</small><h2>HCP 对话数据采集知情同意协议</h2></div><button type="button" aria-label="关闭">×</button></div><div class="admin-consent-copy"><p>本人知悉并自愿参与本次 HCP 对话数据采集。采集内容包括对话语音及转写文本、对话时间与时长、设备基础信息，以及本人提交的职业认证信息。</p><h3>数据用途</h3><p>相关数据用于医学场景下的产品研究、服务优化及 AI 能力训练与评估，不用于自动化诊疗决策。</p><h3>隐私与安全</h3><p>数据将经过必要的去标识化处理，仅向授权项目人员开放。本人承诺不在对话中披露患者姓名、联系方式等可识别身份的信息。</p><h3>自愿参与与撤回</h3><p>本人有权在提交前结束对话；提交后可联系项目发起方申请撤回授权，但已完成匿名化且无法关联到本人的数据可能无法单独撤回。</p></div><div class="admin-signature"><span>签署人：张医生</span><span>签署时间：2026.09.17 11:24:38</span><b>已签署</b></div></div>`;
    document.body.append(dialog);
    dialog.querySelector('button').onclick = () => dialog.classList.remove('open');
    dialog.onclick = event => { if (event.target === dialog) dialog.classList.remove('open'); };
    return dialog;
  }

  function logConversationMarkup(action, meta) {
    const doctorName = meta.name || '王医生';
    const rawMessages = [
      ['right', '张三 · 医药代表', '张主任您好'],
      ['', `${doctorName} · 医生`, '你好'],
      ['right', '张三 · 医药代表', '今天主要想跟您交流一下儿童近视防控这块。最近门诊这类患者多吗？'],
      ['', `${doctorName} · 医生`, '挺多的，尤其是低龄儿童，现在家长对近视也比较焦虑。'],
      ['right', '张三 · 医药代表', '那您现在临床上对于低龄近视患儿，一般会怎么做干预？'],
      ['', `${doctorName} · 医生`, '要看具体情况。首先是用眼习惯、户外活动，必要时也会考虑药物或者 OK 镜。']
    ];
    const reviewedMessages = rawMessages.map((message, index) => index === 0 ? ['right', message[1], '张主任，您好。'] : message);
    const messages = action === 'raw' ? rawMessages : reviewedMessages;
    return `<div class="conversation log-detail-conversation">${messages.map(message => `<div class="message-row ${message[0]}"><div class="message-label">${message[1]}</div><div class="bubble">${message[2]}</div></div>`).join('')}</div>`;
  }

  function logConsentMarkup() {
    return `<div class="admin-consent-copy log-consent-copy"><p>本人知悉并自愿参与本次 HCP 对话数据采集。采集内容包括对话语音及转写文本、对话时间与时长、设备基础信息，以及本人提交的职业认证信息。</p><h3>数据用途</h3><p>相关数据用于医学场景下的产品研究、服务优化及 AI 能力训练与评估，不用于自动化诊疗决策。</p><h3>隐私与安全</h3><p>数据将经过必要的去标识化处理，仅向授权项目人员开放。本人承诺不在对话中披露患者姓名、联系方式等可识别身份的信息。</p><h3>自愿参与与撤回</h3><p>本人有权在提交前结束对话；提交后可联系项目发起方申请撤回授权，但已完成匿名化且无法关联到本人的数据可能无法单独撤回。</p></div>`;
  }

  function openLogDetailDrawer(action, meta) {
    let drawer = document.querySelector('#logDetailDrawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'logDetailDrawer';
      drawer.className = 'log-detail-drawer';
      drawer.innerHTML = `<div class="log-detail-mask"></div><aside class="log-detail-panel" aria-modal="true" role="dialog"><header><h2></h2><button type="button" class="log-detail-close" aria-label="关闭">×</button></header><div class="log-detail-body"></div></aside>`;
      document.body.append(drawer);
      const close = () => drawer.classList.remove('open');
      drawer.querySelector('.log-detail-close').onclick = close;
      drawer.querySelector('.log-detail-mask').onclick = close;
    }
    const titles = { raw: '原始对话内容', initial: '初审对话内容', final: '终审对话内容', consent: '知情同意协议' };
    drawer.querySelector('h2').textContent = titles[action];
    drawer.querySelector('.log-detail-body').innerHTML = action === 'consent' ? logConsentMarkup() : logConversationMarkup(action, meta);
    enhanceMessageAudio(drawer);
    drawer.classList.add('open');
  }

  function bindAudio(button) {
    button.onclick = () => {
      if (audioTimer) { clearTimeout(audioTimer); audioTimer = null; }
      const active = button.classList.contains('playing');
      document.querySelectorAll('.admin-audio.playing').forEach(item => {
        item.classList.remove('playing');
        item.querySelector('.admin-audio-icon').textContent = '▶';
      });
      if (active) return;
      button.classList.add('playing');
      button.querySelector('.admin-audio-icon').textContent = 'Ⅱ';
      audioTimer = setTimeout(() => {
        button.classList.remove('playing');
        button.querySelector('.admin-audio-icon').textContent = '▶';
        audioTimer = null;
      }, 5000);
    };
  }

  function enhanceMessageAudio(drawer) {
    const durations = ['00:05', '00:02', '00:18', '00:11', '00:09', '00:16', '00:07', '00:14'];
    drawer.querySelectorAll('.conversation .message-row').forEach((row, index) => {
      const actions = row.querySelector('.bubble-actions');
      let audio = row.querySelector('.admin-audio');
      if (!audio) {
        const speaker = row.classList.contains('right') ? '医药代表' : '医生';
        if (actions) actions.insertAdjacentHTML('beforebegin', audioControl(speaker, durations[index % durations.length]));
        else row.insertAdjacentHTML('beforeend', audioControl(speaker, durations[index % durations.length]));
        audio = row.querySelector('.admin-audio');
        bindAudio(audio);
      } else if (actions && audio.nextElementSibling !== actions) {
        row.insertBefore(audio, actions);
      }
    });
  }

  function enhanceDrawer(drawer) {
    if (drawer.dataset.hcpEnhanced) return;
    const body = drawer.querySelector('.ant-drawer-body');
    const title = drawer.querySelector('.ant-drawer-title')?.textContent || '';
    if (!body || !['数据详情', '对话审核'].some(text => title.includes(text))) return;
    const conversation = body.querySelector('.conversation');
    if (!conversation) return;
    drawer.dataset.hcpEnhanced = 'true';
    const meta = getRecordMeta(drawer);
    const nativeChildren = Array.from(body.children);
    const tabs = document.createElement('div');
    tabs.className = 'detail-module-tabs';
    tabs.innerHTML = '<button class="active" data-module="conversation">对话内容</button><button data-module="logs">数据日志</button><button data-module="subject">采集对象信息</button>';
    const logs = document.createElement('div');
    logs.className = 'module-panel';
    logs.innerHTML = logPanel(meta);
    const subject = document.createElement('div');
    subject.className = 'module-panel';
    subject.innerHTML = subjectPanel(meta);
    body.prepend(tabs);
    body.append(logs, subject);
    const reason = reasonFor(meta);
    if (reason) {
      const alert = document.createElement('div');
      alert.className = 'admin-rejection inline';
      alert.innerHTML = `<b>${meta.status === '初审未通过' ? '初审驳回原因' : '终审驳回原因'}</b><p>${reason}</p>`;
      conversation.before(alert);
      nativeChildren.push(alert);
    }
    const panels = { logs, subject };
    tabs.onclick = event => {
      const button = event.target.closest('button');
      if (!button) return;
      tabs.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
      const key = button.dataset.module;
      nativeChildren.forEach(item => { item.hidden = key !== 'conversation'; });
      Object.entries(panels).forEach(([name, panel]) => panel.classList.toggle('active', name === key));
      const footer = drawer.querySelector('.ant-drawer-footer');
      if (footer) footer.style.display = key === 'conversation' ? '' : 'none';
    };
    logs.onclick = event => {
      const actionButton = event.target.closest('.log-event-action');
      if (!actionButton) return;
      openLogDetailDrawer(actionButton.dataset.logAction, meta);
    };
    subject.querySelector('.credential-photo').onclick = event => {
      if (event.currentTarget.dataset.masked === 'true') showCredentialToast();
      else credentialDialog().classList.add('open');
    };
  }

  function rejectionDialog() {
    let dialog = document.querySelector('#reviewRejectDialog');
    if (dialog) return dialog;
    dialog = document.createElement('div');
    dialog.id = 'reviewRejectDialog';
    dialog.className = 'review-reject-dialog';
    dialog.innerHTML = `<div class="review-reject-card"><div class="review-reject-head"><h2>填写驳回原因</h2><button type="button" aria-label="关闭">×</button></div><p>请说明本条数据未通过审核的具体原因，医生将在元医 AI 中看到该内容。</p><textarea maxlength="300" rows="5" placeholder="请输入具体驳回原因（必填）"></textarea><div class="review-reject-error"></div><div class="review-reject-actions"><button type="button" class="cancel">取消</button><button type="button" class="confirm">确认驳回</button></div></div>`;
    document.body.append(dialog);
    const close = () => dialog.classList.remove('open');
    dialog.querySelector('.review-reject-head button').onclick = close;
    dialog.querySelector('.cancel').onclick = close;
    dialog.onclick = event => { if (event.target === dialog) close(); };
    return dialog;
  }

  function requestRejection(button) {
    const drawer = button.closest('.ant-drawer-content');
    const meta = getRecordMeta(drawer);
    const status = button.textContent.includes('初审') ? '初审未通过' : '终审未通过';
    const dialog = rejectionDialog();
    const input = dialog.querySelector('textarea');
    const error = dialog.querySelector('.review-reject-error');
    input.value = '';
    error.textContent = '';
    dialog.classList.add('open');
    setTimeout(() => input.focus(), 0);
    dialog.querySelector('.confirm').onclick = () => {
      const value = input.value.trim();
      if (!value) { error.textContent = '请填写驳回原因'; return; }
      reviewReasons[`${meta.name}:${status}`] = value;
      localStorage.setItem(`hcp-rejection-${status === '初审未通过' ? 'initial_rejected' : 'final_rejected'}`, value);
      dialog.classList.remove('open');
      button.dataset.allowReject = 'true';
      button.click();
    };
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.ant-drawer-footer button');
    if (!button || !['初审不通过', '终审不通过'].includes(button.textContent.trim())) return;
    if (button.dataset.allowReject === 'true') { delete button.dataset.allowReject; return; }
    event.preventDefault();
    event.stopImmediatePropagation();
    requestRejection(button);
  }, true);

  function scan() {
    document.querySelectorAll('.ant-drawer-content').forEach(drawer => {
      enhanceDrawer(drawer);
      enhanceMessageAudio(drawer);
    });
  }
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  scan();
}());

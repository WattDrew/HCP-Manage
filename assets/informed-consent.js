(function () {
  const rejectionReasons = {
    ai_rejected: 'AI 初筛意见：本次对话有效轮次不足，存在连续短句回答，未形成可用于审核的完整诊疗观点。请重新完成对话。',
    initial_rejected: '初审意见：有效诊疗信息不足，对“低龄儿童近视干预方案”的回答较笼统，未说明适用人群与判断依据。请补充完整后重新采集。',
    final_rejected: '终审意见：核心结论缺少具体临床依据，且未覆盖任务要求中的随访频次与疗效评估标准。本条数据暂不采用。'
  };
  let consentAccepted = false;
  let playingTimer = null;

  function ensureConsentSheet() {
    if (document.querySelector('#consentModal')) return;
    const wrapper = document.createElement('div');
    wrapper.id = 'consentModal';
    wrapper.className = 'consent-modal';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-modal', 'true');
    wrapper.setAttribute('aria-labelledby', 'consentTitle');
    wrapper.innerHTML = `
      <div class="consent-sheet">
        <div class="consent-handle"></div>
        <div class="consent-heading">
          <div><small>开始采集前</small><h2 id="consentTitle">知情同意协议</h2></div>
          <button type="button" class="consent-close" aria-label="关闭">×</button>
        </div>
        <div class="consent-copy">
          <p>感谢您参与本次 HCP 对话数据采集。为保障您的合法权益，请在开始前阅读以下说明：</p>
          <h3>一、采集目的</h3>
          <p>本次对话将用于医学场景下的产品研究、服务优化及 AI 能力训练与评估，不用于对您进行自动化诊疗决策。</p>
          <h3>二、采集内容</h3>
          <p>我们将记录对话语音、转写文本、对话时间与时长、设备基础信息，以及您已提交的职业认证信息。请勿在对话中披露患者姓名、联系方式等可识别个人身份的信息。</p>
          <h3>三、使用与保护</h3>
          <p>数据将经过必要的去标识化处理，仅向授权的项目人员开放，并按适用法律法规及项目安全规范保存。未经另行授权，不会用于公开传播或与本项目无关的用途。</p>
          <h3>四、自愿参与</h3>
          <p>参与完全自愿。您可在提交前结束对话；提交后如需撤回授权，可联系项目发起方申请处理，但已完成匿名化且无法关联到您的数据可能无法单独撤回。</p>
          <h3>五、联系方式</h3>
          <p>如对协议或数据使用有疑问，请联系项目发起方“核盛健康管理”。协议版本：HCP-ICF-2026.09。</p>
        </div>
        <label class="consent-check"><input id="consentCheck" type="checkbox"> <span>我已阅读并同意《知情同意协议》</span></label>
        <button type="button" class="primary consent-confirm" disabled>同意并开始对话</button>
      </div>`;
    document.querySelector('.phone').append(wrapper);
    const checkbox = wrapper.querySelector('#consentCheck');
    const confirm = wrapper.querySelector('.consent-confirm');
    const close = () => wrapper.classList.remove('open');
    wrapper.querySelector('.consent-close').onclick = close;
    wrapper.addEventListener('click', event => { if (event.target === wrapper) close(); });
    checkbox.onchange = () => { confirm.disabled = !checkbox.checked; };
    confirm.onclick = () => {
      consentAccepted = true;
      close();
      go('voice');
    };
  }

  window.requestConsent = function () {
    if (consentAccepted) { go('voice'); return; }
    ensureConsentSheet();
    const sheet = document.querySelector('#consentModal');
    const checkbox = sheet.querySelector('#consentCheck');
    checkbox.checked = false;
    sheet.querySelector('.consent-confirm').disabled = true;
    sheet.classList.add('open');
  };

  function audioPlayer() {
    return `<button type="button" class="fake-audio" onclick="toggleFakeAudio(this)" aria-label="播放医生原始语音">
      <span class="audio-play">▶</span><span class="audio-wave">${'<i></i>'.repeat(18)}</span><time>00:18</time>
    </button>`;
  }

  window.toggleFakeAudio = function (button) {
    if (playingTimer) { clearTimeout(playingTimer); playingTimer = null; }
    document.querySelectorAll('.fake-audio.playing').forEach(item => {
      item.classList.remove('playing');
      item.querySelector('.audio-play').textContent = '▶';
    });
    if (button.dataset.wasPlaying === 'true') {
      button.dataset.wasPlaying = 'false';
      return;
    }
    document.querySelectorAll('.fake-audio').forEach(item => { item.dataset.wasPlaying = 'false'; });
    button.dataset.wasPlaying = 'true';
    button.classList.add('playing');
    button.querySelector('.audio-play').textContent = 'Ⅱ';
    playingTimer = setTimeout(() => {
      button.classList.remove('playing');
      button.dataset.wasPlaying = 'false';
      button.querySelector('.audio-play').textContent = '▶';
      playingTimer = null;
    }, 5000);
  };

  const baseDetail = window.renderDetail;
  window.renderDetail = function () {
    baseDetail();
    const start = app.querySelector('.start-voice');
    if (start) start.onclick = window.requestConsent;
  };

  const baseRecord = window.renderRecord;
  window.renderRecord = function () {
    baseRecord();
    const record = records[selected];
    const chatPanel = app.querySelector('.chat');
    if (!record || !chatPanel) return;
    if (rejectionReasons[record.stage]) {
      const reason = document.createElement('section');
      reason.className = 'mobile-rejection';
      const reasonTitle = record.stage === 'ai_rejected' ? 'AI 初筛不通过原因' : record.stage === 'initial_rejected' ? '初审驳回原因' : '终审驳回原因';
      const reasonSource = record.stage === 'ai_rejected' ? '系统初筛' : record.stage === 'initial_rejected' ? '采集管理端' : '需求端';
      const reasonText = localStorage.getItem(`hcp-rejection-${record.stage}`) || rejectionReasons[record.stage];
      reason.innerHTML = `<div><b>${reasonTitle}</b><span>${reasonSource}</span></div><p>${reasonText}</p>`;
      chatPanel.before(reason);
    }
    const doctorMessage = chatPanel.querySelector('.message:not(.me)');
    if (doctorMessage) doctorMessage.insertAdjacentHTML('beforeend', audioPlayer());
  };

  ensureConsentSheet();
  if (page === 'detail') render();
}());

(function () {
  const rejectionReasons = {
    initial_screen_rejected: '初筛意见：本次对话有效轮次不足，存在连续短句回答，未形成可用于审核的完整诊疗观点。请重新完成对话。',
    initial_rejected: '初审意见：有效诊疗信息不足，对“低龄儿童近视干预方案”的回答较笼统，未说明适用人群与判断依据。请补充完整后重新采集。',
    final_rejected: '终审意见：核心结论缺少具体临床依据，且未覆盖任务要求中的随访频次与疗效评估标准。本条数据暂不采用。'
  };
  let consentAccepted = false;
  let playingTimer = null;
  const defaultBackHandler = back.onclick;

  function ensureConsentPrompt() {
    if (document.querySelector('#consentPrompt')) return;
    const prompt = document.createElement('div');
    prompt.id = 'consentPrompt';
    prompt.className = 'consent-prompt';
    prompt.setAttribute('role', 'dialog');
    prompt.setAttribute('aria-modal', 'true');
    prompt.setAttribute('aria-labelledby', 'consentPromptTitle');
    prompt.innerHTML = `
      <div class="consent-prompt-card">
        <h2 id="consentPromptTitle">请阅读并同意协议</h2>
        <p>开始对话前，请确认您已阅读并同意《知情同意协议》。</p>
        <div class="consent-prompt-actions">
          <button type="button" class="consent-disagree">不同意</button>
          <button type="button" class="consent-agree">同意</button>
        </div>
      </div>`;
    document.querySelector('.phone').append(prompt);
    prompt.querySelector('.consent-disagree').onclick = () => prompt.classList.remove('open');
    prompt.querySelector('.consent-agree').onclick = () => {
      consentAccepted = true;
      prompt.classList.remove('open');
      go('voice');
    };
  }

  window.showConsentAgreement = function () {
    page = 'consent';
    title.textContent = '知情同意协议';
    app.dataset.page = 'consent';
    back.style.display = 'flex';
    back.innerHTML = icon('back');
    brandmark.innerHTML = '';
    capsule.style.display = 'none';
    document.querySelector('.bar').style.display = 'flex';
    nav.style.display = 'none';
    app.innerHTML = `
      <article class="consent-page">
        <header>
          <span>开始采集前</span>
          <h1>知情同意协议</h1>
          <p>协议版本：HCP-ICF-2026.09</p>
        </header>
        <section>
          <p>感谢您参与本次 HCP 对话数据采集。为保障您的合法权益，请在开始前阅读以下说明：</p>
          <h2>一、采集目的</h2>
          <p>本次对话将用于医学场景下的产品研究、服务优化及 AI 能力训练与评估，不用于对您进行自动化诊疗决策。</p>
          <h2>二、采集内容</h2>
          <p>我们将记录对话语音、转写文本、对话时间与时长、设备基础信息，以及您已提交的职业认证信息。请勿在对话中披露患者姓名、联系方式等可识别个人身份的信息。</p>
          <h2>三、使用与保护</h2>
          <p>数据将经过必要的去标识化处理，仅向授权的项目人员开放，并按适用法律法规及项目安全规范保存。未经另行授权，不会用于公开传播或与本项目无关的用途。</p>
          <h2>四、自愿参与</h2>
          <p>参与完全自愿。您可在提交前结束对话；提交后如需撤回授权，可联系项目发起方申请处理，但已完成匿名化且无法关联到您的数据可能无法单独撤回。</p>
          <h2>五、联系方式</h2>
          <p>如对协议或数据使用有疑问，请联系项目发起方“核盛健康管理”。</p>
        </section>
      </article>`;
    app.scrollTop = 0;
    back.onclick = defaultBackHandler;
  };

  window.requestConsent = function () {
    if (consentAccepted) {
      go('voice');
      return;
    }
    ensureConsentPrompt();
    document.querySelector('#consentPrompt').classList.add('open');
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
    if (!start) return;
    start.onclick = window.requestConsent;
    start.insertAdjacentHTML('afterend', `
      <label class="consent-choice">
        <input id="consentChoice" type="radio" name="collectionConsent" ${consentAccepted ? 'checked' : ''}>
        <span class="consent-radio" aria-hidden="true"></span>
        <span>我已阅读并同意<button type="button" class="consent-link">《知情同意协议》</button></span>
      </label>`);
    app.querySelector('#consentChoice').onchange = event => {
      consentAccepted = event.target.checked;
    };
    app.querySelector('.consent-link').onclick = event => {
      event.preventDefault();
      window.showConsentAgreement();
    };
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
      const reasonTitle = record.stage === 'initial_screen_rejected' ? '初筛未通过原因' : record.stage === 'initial_rejected' ? '初审未通过原因' : '终审未通过原因';
      const reasonSource = record.stage === 'initial_screen_rejected' ? '系统初筛' : record.stage === 'initial_rejected' ? '采集管理端' : '需求端';
      const reasonText = localStorage.getItem(`hcp-rejection-${record.stage}`) || rejectionReasons[record.stage];
      reason.innerHTML = `<div><b>${reasonTitle}</b><span>${reasonSource}</span></div><p>${reasonText}</p>`;
      chatPanel.before(reason);
    }
    const doctorMessage = chatPanel.querySelector('.message:not(.me)');
    if (doctorMessage) doctorMessage.insertAdjacentHTML('beforeend', audioPlayer());
  };

  if (page === 'detail') render();
}());

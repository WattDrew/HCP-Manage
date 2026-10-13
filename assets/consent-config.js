(function () {
  const storageKey = 'yubei-api-consent-config';
  const defaultAgreement = {
    name: 'HCP 对话数据采集知情同意协议',
    version: 'HCP-ICF-2026.09',
    text: '本人知悉并自愿参与本次 HCP 对话数据采集。采集内容包括对话语音及转写文本、对话时间与时长、设备基础信息，以及本人提交的职业认证信息。相关数据仅用于医学场景下的产品研究、服务优化及 AI 能力训练与评估，并将经过必要的去标识化处理。'
  };
  let config = readConfig();

  function readConfig() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || { type: 'default' }; }
    catch (_) { return { type: 'default' }; }
  }
  function saveConfig(next) { config = next; localStorage.setItem(storageKey, JSON.stringify(next)); }
  function agreementName() { return config.type === 'custom' ? config.fileName : defaultAgreement.name; }

  function toast(text) {
    const node = document.createElement('div');
    node.className = 'consent-toast'; node.textContent = text;
    document.body.append(node); requestAnimationFrame(() => node.classList.add('show'));
    setTimeout(() => { node.classList.remove('show'); setTimeout(() => node.remove(), 180); }, 2200);
  }
  function closeModal() { document.querySelector('.consent-config-overlay')?.remove(); }
  function showAgreement() {
    const isCustom = config.type === 'custom';
    const body = isCustom
      ? `<div class="consent-file-preview"><span class="consent-doc-icon">DOC</span><div><b>${escapeHtml(config.fileName)}</b><p>自定义上传协议 · ${config.updatedAt || '刚刚更新'}</p></div></div><p class="consent-preview-tip">该原型仅保存了上传文件的名称；实际系统可在此处加载并预览文件内容。</p>`
      : `<div class="consent-agreement-copy"><p>${defaultAgreement.text}</p><h3>数据用途</h3><p>相关数据用于医学场景下的产品研究、服务优化及 AI 能力训练与评估，不用于自动化诊疗决策。</p><h3>自愿参与与撤回</h3><p>本人有权在提交前结束对话；提交后可联系项目发起方申请撤回授权。</p></div>`;
    openModal(`查看${isCustom ? '自定义协议' : '系统默认协议'}`, `<div class="consent-version">${isCustom ? '已上传文件' : defaultAgreement.version}</div><h2>${escapeHtml(agreementName())}</h2>${body}`, `<button class="consent-secondary" data-close>关闭</button>`);
  }
  function openEditor() {
    const current = config.type;
    const customDetail = current === 'custom' ? `<div class="consent-current-file">当前文件：<b>${escapeHtml(config.fileName)}</b></div>` : '';
    openModal('配置知情同意协议', `<p class="consent-help">采集对象开始对话前须阅读并同意该协议。</p><div class="consent-choice-list"><label class="consent-choice ${current === 'default' ? 'selected' : ''}"><input type="radio" name="consentType" value="default" ${current === 'default' ? 'checked' : ''}><span><b>系统默认协议</b><small>${defaultAgreement.name}</small></span><button type="button" class="consent-inline-link" data-view-default>查看详情</button></label><label class="consent-choice ${current === 'custom' ? 'selected' : ''}"><input type="radio" name="consentType" value="custom" ${current === 'custom' ? 'checked' : ''}><span><b>自定义上传</b><small>支持 .doc、.docx 格式，单个文件不超过 10MB</small></span></label></div><div class="consent-upload-area ${current === 'custom' ? 'active' : ''}">${customDetail}<input id="consentDocInput" type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"><label for="consentDocInput" class="consent-upload-button">选择 DOC 文件</label><span class="consent-selected-file"></span></div>`, `<button class="consent-secondary" data-close>取消</button><button class="consent-primary" data-save>保存</button>`);
    bindEditor();
  }
  function bindEditor() {
    const overlay = document.querySelector('.consent-config-overlay');
    const upload = overlay.querySelector('.consent-upload-area'), fileInput = overlay.querySelector('#consentDocInput'), name = overlay.querySelector('.consent-selected-file');
    overlay.querySelectorAll('input[name="consentType"]').forEach(input => input.onchange = () => {
      overlay.querySelectorAll('.consent-choice').forEach(x => x.classList.toggle('selected', x.querySelector('input').checked));
      upload.classList.toggle('active', input.value === 'custom' && input.checked);
    });
    fileInput.onchange = () => { const file = fileInput.files[0]; name.textContent = file ? file.name : ''; };
    overlay.querySelector('[data-view-default]').onclick = event => { event.preventDefault(); showDefaultInPlace(); };
    overlay.querySelector('[data-save]').onclick = () => {
      const type = overlay.querySelector('input[name="consentType"]:checked').value;
      const file = fileInput.files[0];
      if (type === 'custom' && !file && config.type !== 'custom') { toast('请先选择 DOC 文件'); return; }
      if (file && !/\.docx?$/i.test(file.name)) { toast('仅支持上传 DOC 或 DOCX 文件'); return; }
      saveConfig(type === 'custom' ? { type, fileName: file?.name || config.fileName, updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }) } : { type: 'default' });
      closeModal(); injectRow(); toast(type === 'custom' ? '自定义协议已保存' : '已切换为系统默认协议');
    };
  }
  function showDefaultInPlace() {
    const overlay = document.querySelector('.consent-config-overlay');
    overlay.querySelector('.consent-modal').classList.add('preview-mode');
    overlay.querySelector('.consent-modal-title').textContent = '系统默认协议详情';
    overlay.querySelector('.consent-modal-body').innerHTML = `<div class="consent-version">${defaultAgreement.version}</div><h2>${defaultAgreement.name}</h2><div class="consent-agreement-copy"><p>${defaultAgreement.text}</p><h3>数据用途</h3><p>相关数据用于医学场景下的产品研究、服务优化及 AI 能力训练与评估，不用于自动化诊疗决策。</p></div>`;
    overlay.querySelector('.consent-modal-footer').innerHTML = '<button class="consent-secondary" data-close>关闭</button>';
    overlay.querySelectorAll('[data-close]').forEach(button => { button.onclick = closeModal; });
  }
  function openModal(title, body, footer) {
    closeModal();
    const overlay = document.createElement('div'); overlay.className = 'consent-config-overlay';
    overlay.innerHTML = `<section class="consent-modal" role="dialog" aria-modal="true"><header><h2 class="consent-modal-title">${title}</h2><button type="button" aria-label="关闭" data-close>×</button></header><div class="consent-modal-body">${body}</div><footer class="consent-modal-footer">${footer}</footer></section>`;
    document.body.append(overlay); overlay.querySelectorAll('[data-close]').forEach(button => { button.onclick = closeModal; });
    overlay.onclick = event => { if (event.target === overlay) closeModal(); };
  }
  function escapeHtml(value) { const node = document.createElement('span'); node.textContent = value || ''; return node.innerHTML; }
  function injectRow() {
    const descriptions = Array.from(document.querySelectorAll('.ant-descriptions')).filter(node => node.textContent.includes('所属项目') && node.textContent.includes('已接收数据'));
    descriptions.forEach(description => {
      if (description.querySelector('[data-consent-row]')) return;
      const table = description.querySelector('table tbody') || description.querySelector('tbody');
      if (!table) return;
      const row = document.createElement('tr'); row.className = 'ant-descriptions-row'; row.dataset.consentRow = 'true';
      row.innerHTML = `<th class="ant-descriptions-item-label">知情同意协议</th><td class="ant-descriptions-item-content"><div class="consent-row-value"><span class="consent-type-tag ${config.type}">${config.type === 'custom' ? '自定义上传' : '系统默认'}</span><span class="consent-name">${escapeHtml(agreementName())}</span><span class="consent-row-actions"><button type="button" data-consent-view>查看详情</button>${config.type === 'custom' ? '<button type="button" data-consent-delete>删除</button>' : ''}<button type="button" data-consent-edit>${config.type === 'custom' ? '更新' : '编辑'}</button></span></div></td>`;
      table.append(row);
      row.querySelector('[data-consent-view]').onclick = showAgreement;
      row.querySelector('[data-consent-edit]').onclick = openEditor;
      row.querySelector('[data-consent-delete]')?.addEventListener('click', () => { saveConfig({ type: 'default' }); injectRow(); row.remove(); toast('自定义协议已删除，已恢复系统默认协议'); setTimeout(injectRow, 0); });
    });
  }
  const observer = new MutationObserver(injectRow);
  observer.observe(document.body, { childList: true, subtree: true });
  injectRow();
})();

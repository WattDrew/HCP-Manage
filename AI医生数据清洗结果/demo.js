const state = {
  examples: [],
  knowledge: [],
  activeExampleId: null,
  activeKnowledgeId: null,
  selectedExampleIds: [],
};

const stageLabels = {
  opening: "开场",
  needs_discovery: "需求了解",
  evidence_review: "证据审查",
  safety_review: "安全性审查",
  eligibility_review: "适用性审查",
  clinical_application: "临床应用",
  claim_challenge: "宣称质疑",
  decision_boundary: "决策边界",
  commercial_topic: "商业话题",
  clarification: "澄清",
  closing: "收尾",
  repair: "对话修复",
};

const claimTypeLabels = {
  natural_history: "自然病程",
  efficacy: "有效性",
  risk_reduction: "风险降低",
  eligibility: "适用性",
  contraindication: "禁忌证",
  safety: "安全性",
  safety_course: "安全性进程",
  dose_response: "剂量反应",
  long_term_safety: "长期安全性",
  treatment_duration: "疗程",
  combination_therapy: "联合治疗",
  risk_factor: "危险因素",
};

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

async function readJsonl(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`无法加载 ${path}`);
  const text = await response.text();
  return text.trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function renderIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
}

function fillSelect(select, values, labels = {}) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = labels[value] || value;
    select.append(option);
  });
}

function filteredExamples() {
  const query = $("#exampleSearch").value.trim().toLowerCase();
  const stage = $("#stageFilter").value;
  const topic = $("#topicFilter").value;
  return state.examples.filter((item) => {
    const haystack = [item.scene, item.representative_intent, item.doctor_action, item.topic, item.input, item.ideal_response, ...item.tags].join(" ").toLowerCase();
    return (!query || haystack.includes(query)) && (!stage || item.stage === stage) && (!topic || item.topic === topic);
  });
}

function filteredKnowledge() {
  const query = $("#knowledgeSearch").value.trim().toLowerCase();
  const claimType = $("#claimTypeFilter").value;
  const review = $("#reviewFilter").value;
  return state.knowledge.filter((item) => {
    const haystack = [item.topic, item.raw_claim, item.population, item.asserted_source, ...item.verification_required].join(" ").toLowerCase();
    return (!query || haystack.includes(query)) && (!claimType || item.claim_type === claimType) && (!review || item.review_status === review);
  });
}

function renderExampleList() {
  const items = filteredExamples();
  $("#exampleResultCount").textContent = `${items.length} 条结果`;
  $("#exampleList").innerHTML = items.length ? items.map((item) => `
    <button class="record-button ${item.id === state.activeExampleId ? "is-active" : ""}" type="button" data-example-id="${item.id}">
      <span class="record-meta"><span class="record-id">${item.id}</span><span class="badge">${escapeHtml(stageLabels[item.stage] || item.stage)}</span></span>
      <span class="record-title">${escapeHtml(item.scene)} · ${escapeHtml(item.doctor_action)}</span>
      <span class="record-preview">${escapeHtml(item.input)}</span>
    </button>`).join("") : `<div class="empty-state">没有匹配的示例</div>`;

  $("#exampleList").querySelectorAll("[data-example-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeExampleId = button.dataset.exampleId;
      renderExampleList();
      renderExampleDetail();
    });
  });
}

function renderExampleDetail() {
  const item = state.examples.find((entry) => entry.id === state.activeExampleId);
  if (!item) {
    $("#exampleDetail").innerHTML = `<div class="empty-state">请选择一条示例</div>`;
    return;
  }
  const selected = state.selectedExampleIds.includes(item.id);
  $("#exampleDetail").innerHTML = `
    <div class="detail-header">
      <div><span class="section-kicker">${item.id}</span><h2>${escapeHtml(item.scene)}</h2></div>
      <div class="detail-actions">
        <button class="button ${selected ? "button-ghost" : "button-primary"}" id="toggleSelection" type="button">
          <i data-lucide="${selected ? "check" : "plus"}" aria-hidden="true"></i>
          <span>${selected ? "已加入上下文" : "加入上下文"}</span>
        </button>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-field"><span>对话阶段</span><strong>${escapeHtml(stageLabels[item.stage] || item.stage)}</strong></div>
      <div class="detail-field"><span>代表意图</span><strong>${escapeHtml(item.representative_intent)}</strong></div>
      <div class="detail-field"><span>医生行为</span><strong>${escapeHtml(item.doctor_action)}</strong></div>
    </div>
    <div class="conversation">
      <div class="message user"><span>医药代表</span>${escapeHtml(item.input)}</div>
      <div class="message assistant"><span>AI 医生·理想回复</span>${escapeHtml(item.ideal_response)}</div>
    </div>
    <div class="subsection"><h3>行为标签</h3><div class="tag-list">${item.tags.map((tag) => `<span class="badge teal">${escapeHtml(tag)}</span>`).join("")}</div></div>
    <div class="subsection"><h3>重写说明</h3><div class="note-box">${escapeHtml(item.rewrite_notes)}</div></div>
    <div class="subsection"><h3>原始来源</h3><div class="tag-list">${item.source_refs.map((ref) => `<span class="badge">${escapeHtml(ref)}</span>`).join("")}</div></div>`;

  $("#toggleSelection").addEventListener("click", () => toggleSelection(item.id));
  renderIcons();
}

function toggleSelection(id) {
  const index = state.selectedExampleIds.indexOf(id);
  if (index >= 0) {
    state.selectedExampleIds.splice(index, 1);
  } else if (state.selectedExampleIds.length >= 5) {
    showToast("最多选择5条示例");
    return;
  } else {
    state.selectedExampleIds.push(id);
  }
  renderExampleDetail();
  renderSelection();
}

function renderSelection() {
  const selected = state.selectedExampleIds.map((id) => state.examples.find((item) => item.id === id)).filter(Boolean);
  $("#selectedCount").textContent = `${selected.length} / 5`;
  $("#previewPrompt").disabled = selected.length === 0;
  $("#selectionList").innerHTML = selected.length ? selected.map((item) => `
    <div class="selection-item">
      <div class="selection-top"><span class="badge teal">${escapeHtml(stageLabels[item.stage] || item.stage)}</span><button class="remove-button" type="button" data-remove-id="${item.id}" aria-label="移除 ${item.id}"><i data-lucide="x" aria-hidden="true"></i></button></div>
      <strong>${escapeHtml(item.id)} · ${escapeHtml(item.doctor_action)}</strong>
      <p>${escapeHtml(item.input)}</p>
    </div>`).join("") : `<div class="selection-empty">尚未选择示例<br>从左侧选择一条数据开始</div>`;
  $("#selectionList").querySelectorAll("[data-remove-id]").forEach((button) => button.addEventListener("click", () => toggleSelection(button.dataset.removeId)));
  renderIcons();
}

function renderKnowledgeList() {
  const items = filteredKnowledge();
  $("#knowledgeResultCount").textContent = `${items.length} 条结果`;
  $("#knowledgeList").innerHTML = items.length ? items.map((item) => `
    <button class="record-button ${item.id === state.activeKnowledgeId ? "is-active" : ""}" type="button" data-knowledge-id="${item.id}">
      <span class="record-meta"><span class="record-id">${item.id}</span><span class="badge amber">待审核</span></span>
      <span class="record-title">${escapeHtml(item.topic)}</span>
      <span class="record-preview">${escapeHtml(item.raw_claim)}</span>
    </button>`).join("") : `<div class="empty-state">没有匹配的知识候选</div>`;
  $("#knowledgeList").querySelectorAll("[data-knowledge-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeKnowledgeId = button.dataset.knowledgeId;
      renderKnowledgeList();
      renderKnowledgeDetail();
    });
  });
}

function renderKnowledgeDetail() {
  const item = state.knowledge.find((entry) => entry.id === state.activeKnowledgeId);
  if (!item) {
    $("#knowledgeDetail").innerHTML = `<div class="empty-state">请选择一条知识候选</div>`;
    return;
  }
  $("#knowledgeDetail").innerHTML = `
    <div class="detail-header">
      <div><span class="section-kicker">${item.id}</span><h2>${escapeHtml(item.topic)}</h2></div>
      <span class="badge amber">待医学审核</span>
    </div>
    <div class="warning-banner"><i data-lucide="shield-alert" aria-hidden="true"></i><span>当前仅为从对话中抽取的宣称，不可用于生成医学回复。</span></div>
    <div class="claim-box"><span class="section-kicker">原始宣称</span>${escapeHtml(item.raw_claim)}</div>
    <div class="detail-grid">
      <div class="detail-field"><span>知识类型</span><strong>${escapeHtml(claimTypeLabels[item.claim_type] || item.claim_type)}</strong></div>
      <div class="detail-field"><span>适用人群</span><strong>${escapeHtml(item.population)}</strong></div>
      <div class="detail-field"><span>可用于生成</span><strong>否</strong></div>
    </div>
    <div class="subsection"><h3>核验清单</h3><ul class="check-list">${item.verification_required.map((value) => `<li><i data-lucide="circle-dashed" aria-hidden="true"></i><span>${escapeHtml(value)}</span></li>`).join("")}</ul></div>
    <div class="subsection"><h3>当前声称来源</h3><div class="source-box">${escapeHtml(item.asserted_source)}</div></div>
    <div class="subsection"><h3>原始对话位置</h3><div class="tag-list">${item.source_refs.map((ref) => `<span class="badge">${escapeHtml(ref)}</span>`).join("")}</div></div>`;
  renderIcons();
}

function previewPrompt() {
  const messages = [];
  state.selectedExampleIds.forEach((id, index) => {
    const item = state.examples.find((entry) => entry.id === id);
    if (!item) return;
    messages.push({ role: "user", content: `【独立示例${index + 1}】\n医药代表：${item.input}` });
    messages.push({ role: "assistant", content: item.ideal_response });
  });
  $("#promptPreview code").textContent = JSON.stringify(messages, null, 2);
  $("#promptDialog").showModal();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function bindEvents() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;
      document.querySelectorAll("[data-tab]").forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      $("#examplesPanel").hidden = target !== "examples";
      $("#knowledgePanel").hidden = target !== "knowledge";
    });
  });

  ["#exampleSearch", "#stageFilter", "#topicFilter"].forEach((selector) => $(selector).addEventListener(selector.includes("Search") ? "input" : "change", renderExampleList));
  ["#knowledgeSearch", "#claimTypeFilter", "#reviewFilter"].forEach((selector) => $(selector).addEventListener(selector.includes("Search") ? "input" : "change", renderKnowledgeList));

  $("#clearExampleFilters").addEventListener("click", () => {
    $("#exampleSearch").value = "";
    $("#stageFilter").value = "";
    $("#topicFilter").value = "";
    renderExampleList();
  });
  $("#clearKnowledgeFilters").addEventListener("click", () => {
    $("#knowledgeSearch").value = "";
    $("#claimTypeFilter").value = "";
    $("#reviewFilter").value = "";
    renderKnowledgeList();
  });
  $("#clearSelection").addEventListener("click", () => {
    state.selectedExampleIds = [];
    renderExampleDetail();
    renderSelection();
  });
  $("#previewPrompt").addEventListener("click", previewPrompt);
  $("#closeDialog").addEventListener("click", () => $("#promptDialog").close());
  $("#promptDialog").addEventListener("click", (event) => {
    if (event.target === $("#promptDialog")) $("#promptDialog").close();
  });
  $("#copyPrompt").addEventListener("click", async () => {
    await navigator.clipboard.writeText($("#promptPreview code").textContent);
    showToast("已复制 Few-shot JSON");
  });
}

async function init() {
  try {
    [state.examples, state.knowledge] = await Promise.all([
      readJsonl("examples.jsonl"),
      readJsonl("knowledge_candidates.jsonl"),
    ]);
    state.activeExampleId = state.examples[0]?.id || null;
    state.activeKnowledgeId = state.knowledge[0]?.id || null;
    $("#exampleCount").textContent = state.examples.length;
    $("#knowledgeCount").textContent = state.knowledge.length;
    fillSelect($("#stageFilter"), [...new Set(state.examples.map((item) => item.stage))], stageLabels);
    fillSelect($("#topicFilter"), [...new Set(state.examples.map((item) => item.topic))].sort());
    fillSelect($("#claimTypeFilter"), [...new Set(state.knowledge.map((item) => item.claim_type))], claimTypeLabels);
    bindEvents();
    renderExampleList();
    renderExampleDetail();
    renderSelection();
    renderKnowledgeList();
    renderKnowledgeDetail();
    renderIcons();
  } catch (error) {
    document.querySelector("main").innerHTML = `<div class="empty-state"><strong>数据加载失败</strong><br>${escapeHtml(error.message)}<br><br>请通过本地 HTTP 服务打开该页面。</div>`;
  }
}

init();

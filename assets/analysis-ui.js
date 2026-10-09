/* Enhances the analysis tab while retaining React's original panel node. */
(function () {
  function enhance() {
    var grid = document.querySelector('.table-card > .ant-card-body > .analysis-grid');
    if (!grid || grid.dataset.enhanced) return;
    var original = grid.textContent.replace(/\s+/g, ' ').trim();
    var cleanRate = Number((original.match(/(\d+)%/) || [0, 67])[1]);
    var pageText = document.body.textContent.replace(/\s+/g, ' ');
    var collectionMatch = pageText.match(/采集进度\s*(\d+)\s*\/\s*(\d+)/);
    var target = collectionMatch ? Number(collectionMatch[2]) : 1000;
    var collected = collectionMatch ? Number(collectionMatch[1]) : 652;
    var cleaned = Math.min(collected, Math.round(collected * cleanRate / 100));
    var awaitingClean = collected - cleaned;
    var uncollected = target - collected;
    var dots = Array.from({ length: target }, function (_, index) {
      var state = index < cleaned ? 'cleaned' : index < collected ? 'awaiting-clean' : 'uncollected';
      return '<i class="signal-dot ' + state + '"></i>';
    }).join('');

    grid.dataset.enhanced = 'true';
    grid.classList.add('analysis-dashboard');
    grid.style.display = 'block';
    grid.style.gridTemplateColumns = 'none';
    grid.style.gap = '0';
    // Keep the React-owned root panel; replacing it breaks tab unmounting.
    grid.innerHTML = `
      <div class="collection-layout">
        <section class="collection-signal">
          <div class="signal-label">DATA COLLECTION PROGRESS</div>
          <div class="signal-summary">
            <div><strong>${Math.round(collected / target * 100)}%</strong><span>采集完成度</span></div>
            <div class="signal-count"><b>${collected}</b><span> / ${target.toLocaleString()} 条</span><small>已采集数据 / 目标数量</small></div>
          </div>
          <div class="signal-dots" aria-label="已审核 ${cleaned} 条，待审核 ${awaitingClean} 条，待采集 ${uncollected} 条">${dots}</div>
          <div class="signal-legend">
            <span><i class="legend-dot uncollected"></i>待采集 ${uncollected}</span>
            <span><i class="legend-dot awaiting-clean"></i>待审核 ${awaitingClean}</span>
            <span><i class="legend-dot cleaned"></i>已审核 ${cleaned}</span>
          </div>
        </section>
        <aside class="effect-card">
          <div class="effect-kicker">⌘&nbsp; 数据审核分析</div>
          <div class="effect-status">
            <div><span>待采集</span><b class="status-pending">${uncollected} 条</b></div>
            <div><span>数据审核</span><b class="status-warn">待审核 ${awaitingClean}</b></div>
            <div><span>证据追问</span><b class="status-warn">建议补充</b></div>
            <div><span>角色一致性</span><b class="status-pending">待验证</b></div>
          </div>
          <div class="advice-heading">下一步建议</div>
          <div class="advice-list">
            <p><b>1</b> 优先审核已采集的 ${awaitingClean} 条数据，避免积压。</p>
            <p><b>2</b> 补充医生在证据不足时的追问与判断变化。</p>
            <p><b>3</b> 对比不同角色话术，校验身份与表达的一致性。</p>
          </div>
        </aside>
      </div>
      <section class="analysis-gap-card">
        <strong>当前缺口 · 证据追问与角色一致性</strong>
        <p>继续采集医生在证据不足时会怎样追问，以及看到补充证据后如何改变判断；下一轮重点验证角色是否保持稳定、专业的表达方式。</p>
      </section>`;
  }

  new MutationObserver(enhance).observe(document.body, { childList: true, subtree: true });
  enhance();
}());

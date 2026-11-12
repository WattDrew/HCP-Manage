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
      <div class="collection-layout collection-layout-single">
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
      </div>`;
  }

  new MutationObserver(enhance).observe(document.body, { childList: true, subtree: true });
  enhance();
}());

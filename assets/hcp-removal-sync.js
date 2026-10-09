(function () {
  const storageKey = 'yubei-removed-task-hcps';
  const currentHcpKey = 'H-001';
  const taskPages = new Set(['detail', 'chat', 'voice', 'review', 'record']);

  function taskRemoved() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]').includes(currentHcpKey);
    } catch {
      return false;
    }
  }

  const baseRenderHome = window.renderHome;
  window.renderHome = function () {
    baseRenderHome();
    if (!taskRemoved()) return;
    document.querySelector('.notice-entry i')?.remove();
    document.querySelector('#header-notice i')?.remove();
  };

  const baseRenderTasks = window.renderTasks;
  window.renderTasks = function () {
    if (!taskRemoved()) {
      baseRenderTasks();
      return;
    }
    title.textContent = '专项采集';
    app.innerHTML = '<div class="task-filter-row"><div class="seg"><button class="active">全部 0</button><button>进行中 0</button><button>已结束 0</button></div></div><div class="empty">暂无专项采集<br>可参与的任务将展示在这里</div>';
  };

  const baseRenderNotices = window.renderNotices;
  window.renderNotices = function () {
    baseRenderNotices();
    if (!taskRemoved()) return;
    app.querySelectorAll('.notice-row.unread').forEach(item => item.remove());
  };

  const baseRenderRecords = window.renderRecords;
  window.renderRecords = function () {
    if (!taskRemoved()) {
      baseRenderRecords();
      return;
    }
    title.textContent = '历史对话';
    app.innerHTML = '<div class="seg history-filter"><button class="active">全部 0</button><button>待处理 0</button><button>审核中 0</button><button>已完成 0</button></div><div class="empty">暂无历史对话<br>已移除任务的数据已隐藏</div>';
  };

  const baseGo = window.go;
  window.go = function (nextPage) {
    baseGo(taskRemoved() && taskPages.has(nextPage) ? 'tasks' : nextPage);
  };

  window.addEventListener('storage', event => {
    if (event.key !== storageKey) return;
    if (taskRemoved() && taskPages.has(page)) page = 'tasks';
    render();
  });
})();

(() => {
  const renderProfile = () => {
    const details = document.querySelector('.profile-details');
    if (!details || details.dataset.flatLayout) return;

    details.dataset.flatLayout = 'true';
    const body = details.querySelector('.ant-card-body');
    if (!body) return;

    body.innerHTML = `
      <div class="profile-grid">
        <section class="profile-info-card enterprise-info">
          <h2>实名认证</h2>
          <dl>
            <div><dt>企业名称</dt><dd>上海元采数据服务有限公司</dd></div>
            <div><dt>企业 ID</dt><dd>HCP-ENT-20261008</dd></div>
            <div><dt>认证方式</dt><dd>企业认证</dd></div>
            <div><dt>创建时间</dt><dd>2026-10-08 09:30:15</dd></div>
          </dl>
        </section>
        <section class="profile-info-card account-info">
          <h2>账号信息</h2>
          <dl>
            <div><dt>姓名</dt><dd>周新华</dd></div>
            <div><dt>手机号</dt><dd>138****8888</dd></div>
            <div><dt>账号角色</dt><dd>超级管理员</dd></div>
          </dl>
        </section>
        <section class="profile-info-card login-info">
          <h2>登录方式</h2>
          <div class="login-method">
            <span class="method-icon">手</span>
            <div><strong>手机号登录</strong><p>138****8888</p></div>
            <span class="method-tag">已绑定</span>
          </div>
          <div class="login-method">
            <span class="method-icon">密</span>
            <div><strong>账号密码</strong><p>已设置登录密码</p></div>
            <button type="button">修改密码</button>
          </div>
        </section>
      </div>`;
  };

  new MutationObserver(renderProfile).observe(document.body, { childList: true, subtree: true });
  renderProfile();
})();

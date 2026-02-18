(function() {
  const isPost = document.body.classList.contains('page-post');
  const isHome = document.body.classList.contains('page-home');

  function initReadingProgress() {
    if (!isPost) return;
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.appendChild(bar);

    const calc = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      bar.style.transform = `scaleX(${percent})`;
    };

    calc();
    window.addEventListener('scroll', calc, { passive: true });
    window.addEventListener('resize', calc);
  }

  function initTocButton() {
    if (!isPost) return;
    const tocEl = document.getElementById('toc');
    if (!tocEl) return;

    const btn = document.createElement('a');
    btn.id = 'toc-fab';
    btn.href = '#toc';
    btn.setAttribute('aria-label', '打开目录');
    btn.innerHTML = '<i class="iconfont icon-list"></i>';
    document.body.appendChild(btn);

    const toggle = () => {
      const show = window.scrollY > 240;
      btn.classList.toggle('visible', show);
    };

    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

  function initHomeAvatarCard() {
    if (!isHome) return;
    const board = document.getElementById('board');
    if (!board) return;

    const container = board.querySelector('.container');
    if (!container) return;

    const card = document.createElement('div');
    card.className = 'home-avatar-card';
    card.innerHTML = `
      <img class="avatar-img" src="/images/avatar.gif" alt="avatar">
      <div class="avatar-name">珅哥</div>
      <div class="divider"></div>
      <div class="contact-info">
        <span>QQ: <a href="http://wpa.qq.com/msgrd?v=3&uin=3492675568&site=qq&menu=yes" target="_blank">3492675568</a></span>
        <span>微信: yys08060910</span>
        <span>邮箱: <a href="mailto:3492675568@qq.com">3492675568@qq.com</a></span>
      </div>
      <div class="social-links">
        <a href="https://github.com/yys806" target="_blank" title="GitHub">
          <i class="iconfont icon-github-fill"></i>
        </a>
        <a href="https://shen-intro.de5.net/" target="_blank" title="个人介绍">
          <i class="iconfont icon-user-fill"></i>
        </a>
      </div>
    `;

    container.insertBefore(card, container.firstChild);
  }

  function bootstrap() {
    initReadingProgress();
    initTocButton();
    initHomeAvatarCard();
  }

  if (document.readyState !== 'loading') {
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap);
  }
})();

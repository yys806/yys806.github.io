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

  function initCursorGlow() {
    if (window.innerWidth < 768) return;
    
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let visible = false;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        glow.classList.add('active');
        visible = true;
      }
    });

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('active');
      visible = false;
    });

    function animate() {
      glow.style.left = mouseX + 'px';
      glow.style.top = mouseY + 'px';
      requestAnimationFrame(animate);
    }
    animate();
  }

  function initPageTransition() {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    transition.innerHTML = '<div class="page-transition-spinner"></div>';
    document.body.appendChild(transition);

    setTimeout(() => {
      transition.classList.add('hidden');
    }, 100);

    document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]').forEach(link => {
      if (link.target === '_blank') return;
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript')) {
          e.preventDefault();
          transition.classList.remove('hidden');
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    });

    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        transition.classList.add('hidden');
      }
    });
  }

  function initVisitorStats() {
    if (!isHome) return;
    
    const card = document.querySelector('.home-avatar-card');
    if (!card) return;

    const stats = document.createElement('div');
    stats.className = 'visitor-stats';
    stats.innerHTML = `
      <div class="stat-item">
        <span class="stat-number" id="busuanzi_value_site_pv">--</span>
        <span class="stat-label">访问量</span>
      </div>
      <div class="stat-item">
        <span class="stat-number" id="busuanzi_value_site_uv">--</span>
        <span class="stat-label">访客数</span>
      </div>
    `;
    
    card.after(stats);

    if (window.busuanzi) {
      window.busuanzi.fetch();
    }
  }

  function initRewardButton() {
    const btn = document.createElement('button');
    btn.className = 'reward-float-btn';
    btn.innerHTML = '<i class="iconfont icon-love"></i>';
    btn.setAttribute('aria-label', '打赏');
    document.body.appendChild(btn);

    const modal = document.createElement('div');
    modal.className = 'reward-modal';
    modal.innerHTML = `
      <div class="reward-modal-content">
        <div class="reward-modal-title">请我喝杯咖啡 ☕</div>
        <div class="reward-qrcodes">
          <div class="reward-qrcode-item">
            <img src="/images/微信.jpg" alt="微信">
            <span>微信</span>
          </div>
          <div class="reward-qrcode-item">
            <img src="/images/支付宝.jpg" alt="支付宝">
            <span>支付宝</span>
          </div>
        </div>
        <button class="reward-modal-close">关闭</button>
      </div>
    `;
    document.body.appendChild(modal);

    btn.addEventListener('click', () => {
      modal.classList.add('show');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('reward-modal-close')) {
        modal.classList.remove('show');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.classList.remove('show');
      }
    });
  }

  function bootstrap() {
    initReadingProgress();
    initTocButton();
    initHomeAvatarCard();
    initCursorGlow();
    initPageTransition();
    initVisitorStats();
    initRewardButton();
  }

  if (document.readyState !== 'loading') {
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap);
  }
})();

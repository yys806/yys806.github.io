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

    const tocList = tocEl.querySelector('.toc');
    if (!tocList) return;

    const btn = document.createElement('div');
    btn.id = 'toc-fab';
    btn.setAttribute('aria-label', '打开目录');
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.innerHTML = '<i class="iconfont icon-list"></i>';
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'toc-float-panel';
    panel.innerHTML = `
      <div class="toc-float-panel-header">
        <div class="toc-float-panel-title">
          <i class="iconfont icon-list"></i>
          <span>目录</span>
        </div>
        <button class="toc-float-panel-close" aria-label="关闭">
          <i class="iconfont icon-arrowleft"></i>
        </button>
      </div>
      <div class="toc-float-panel-body">
        <ul>${tocList.innerHTML}</ul>
      </div>
    `;
    document.body.appendChild(panel);

    let isOpen = false;

    const toggle = () => {
      const show = window.scrollY > 240;
      btn.classList.toggle('visible', show);
      if (!show && isOpen) {
        closePanel();
      }
    };

    const openPanel = () => {
      panel.classList.add('show');
      btn.classList.add('active');
      isOpen = true;
    };

    const closePanel = () => {
      panel.classList.remove('show');
      btn.classList.remove('active');
      isOpen = false;
    };

    btn.addEventListener('click', () => {
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isOpen) {
          closePanel();
        } else {
          openPanel();
        }
      }
    });

    panel.querySelector('.toc-float-panel-close').addEventListener('click', closePanel);

    document.addEventListener('click', (e) => {
      if (isOpen && !panel.contains(e.target) && !btn.contains(e.target)) {
        closePanel();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
    });

    const tocLinks = panel.querySelectorAll('.toc-float-panel-body a');
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');

    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          closePanel();
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });

    const highlight = () => {
      let current = '';
      headings.forEach(h => {
        const rect = h.getBoundingClientRect();
        if (rect.top <= 100) {
          current = h.id;
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    };

    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
    window.addEventListener('scroll', highlight, { passive: true });
    highlight();
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

  function initSidebarToc() {
    if (!isPost) return;
    if (window.innerWidth < 1400) return;

    const tocEl = document.getElementById('toc');
    if (!tocEl) return;

    const tocList = tocEl.querySelector('.toc');
    if (!tocList) return;

    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar-toc';
    sidebar.innerHTML = `
      <div class="sidebar-toc-title">
        <i class="iconfont icon-list"></i>
        <span>目录</span>
      </div>
      <ul class="sidebar-toc-list">${tocList.innerHTML}</ul>
    `;
    document.body.appendChild(sidebar);

    const toggle = () => {
      const show = window.scrollY > 400;
      sidebar.classList.toggle('visible', show);
    };

    toggle();
    window.addEventListener('scroll', toggle, { passive: true });

    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    const tocLinks = sidebar.querySelectorAll('.sidebar-toc-list a');

    const highlight = () => {
      let current = '';
      headings.forEach(h => {
        const rect = h.getBoundingClientRect();
        if (rect.top <= 100) {
          current = h.id;
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', highlight, { passive: true });
    highlight();

    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  function initArticleRecommend() {
    if (!isPost) return;

    fetch('/local-search.xml')
      .then(res => res.text())
      .then(str => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(str, 'text/xml');
        const entries = xml.querySelectorAll('entry');
        
        const currentPath = window.location.pathname;
        const articles = [];
        
        entries.forEach((entry, i) => {
          const url = entry.querySelector('url')?.textContent || '';
          if (url === currentPath) return;
          if (articles.length >= 3) return;
          
          const title = entry.querySelector('title')?.textContent || '未命名';
          const content = entry.querySelector('content')?.textContent || '';
          const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
          const img = imgMatch ? imgMatch[1] : '/img/default.png';
          
          articles.push({ url, title, img, date: '' });
        });
        
        if (articles.length === 0) return;
        
        const float = document.createElement('div');
        float.className = 'article-recommend-float';
        float.innerHTML = `
          <div class="article-recommend-header">
            <div class="article-recommend-title">
              <i class="iconfont icon-archive-fill"></i>
              <span>推荐阅读</span>
            </div>
            <button class="article-recommend-close" aria-label="关闭">
              <i class="iconfont icon-arrowleft"></i>
            </button>
          </div>
          <div class="article-recommend-list">
            ${articles.map(item => `
              <a href="${item.url}" class="article-recommend-item">
                <img class="article-recommend-img" src="${item.img}" alt="${item.title}">
                <div class="article-recommend-info">
                  <div class="article-recommend-name">${item.title}</div>
                </div>
              </a>
            `).join('')}
          </div>
        `;
        document.body.appendChild(float);

        let shown = false;
        let closed = false;

        const toggle = () => {
          if (closed) return;
          const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
          if (scrollPercent > 0.3 && !shown) {
            float.classList.add('show');
            shown = true;
          }
        };

        window.addEventListener('scroll', toggle, { passive: true });

        float.querySelector('.article-recommend-close').addEventListener('click', () => {
          float.classList.remove('show');
          closed = true;
        });
      })
      .catch(() => {});
  }

  function initImageLazyLoad() {
    const images = document.querySelectorAll('.markdown-body img, .index-img img');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              delete img.dataset.src;
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      images.forEach(img => {
        observer.observe(img);
      });
    } else {
      images.forEach(img => {
        img.classList.add('loaded');
      });
    }
  }

  function initAnimationThrottle() {
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
  }

  function initSocialShare() {
    if (!isPost) return;

    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    const title = document.title.split(' - ')[0] || document.title;
    const url = window.location.href;

    const container = document.createElement('div');
    container.className = 'social-share-container';
    container.innerHTML = `
      <span class="social-share-label">分享到</span>
      <button class="social-share-btn weibo" data-platform="weibo" title="分享到微博">
        <i class="iconfont icon-weibo-fill"></i>
      </button>
      <button class="social-share-btn qq" data-platform="qq" title="分享到QQ">
        <i class="iconfont icon-qq-fill"></i>
      </button>
      <button class="social-share-btn wechat" data-platform="wechat" title="分享到微信">
        <i class="iconfont icon-wechat-fill"></i>
        <div class="social-share-qrcode">
          <canvas id="share-qrcode-canvas"></canvas>
          <span>微信扫码分享</span>
        </div>
      </button>
      <button class="social-share-btn copy" data-platform="copy" title="复制链接">
        <i class="iconfont icon-link"></i>
      </button>
    `;

    const divider = postContent.querySelector('hr');
    if (divider) {
      divider.after(container);
    } else {
      postContent.appendChild(container);
    }

    container.querySelectorAll('.social-share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        const encodedTitle = encodeURIComponent(title);
        const encodedUrl = encodeURIComponent(url);

        switch (platform) {
          case 'weibo':
            window.open(`https://service.weibo.com/share/share.php?title=${encodedTitle}&url=${encodedUrl}`, '_blank', 'width=600,height=400');
            break;
          case 'qq':
            window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}`, '_blank', 'width=600,height=400');
            break;
          case 'wechat':
            break;
          case 'copy':
            navigator.clipboard.writeText(url).then(() => {
              showToast('链接已复制到剪贴板');
            }).catch(() => {
              showToast('复制失败，请手动复制');
            });
            break;
        }
      });
    });

    initWechatQRCode(url);
  }

  function initWechatQRCode(url) {
    const canvas = document.getElementById('share-qrcode-canvas');
    if (!canvas) return;

    const size = 120;
    canvas.width = size;
    canvas.height = size;

    const qr = new QRCode(canvas, {
      text: url,
      width: size,
      height: size,
      colorDark: '#1f3b57',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  function showToast(message) {
    const existing = document.querySelector('.share-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'share-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      animation: toastIn 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  function bootstrap() {
    initReadingProgress();
    initTocButton();
    initHomeAvatarCard();
    initCursorGlow();
    initPageTransition();
    initRewardButton();
    initSidebarToc();
    initArticleRecommend();
    initImageLazyLoad();
    initAnimationThrottle();
    initSocialShare();
  }

  if (document.readyState !== 'loading') {
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap);
  }
})();

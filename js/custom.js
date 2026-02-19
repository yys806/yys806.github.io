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

  const API_KEY = 'cfa7d3f8839bb7bf118';

  function getTodayKey() {
    const today = new Date();
    return `blog_cache_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  }

  function getCachedData() {
    const key = getTodayKey();
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const data = JSON.parse(cached);
        return data;
      }
    } catch (e) {}
    return null;
  }

  function setCachedData(data) {
    const key = getTodayKey();
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  }

  async function fetchLunarData() {
    try {
      const res = await fetch(`https://apis.tianapi.com/lunar/index?key=${API_KEY}`);
      const data = await res.json();
      if (data.code === 200) return data.result;
    } catch (e) {}
    return null;
  }

  async function fetchNewsData(type) {
    const urls = {
      keji: `https://apis.tianapi.com/keji/index?key=${API_KEY}&num=5&rand=1`,
      internet: `https://apis.tianapi.com/internet/index?key=${API_KEY}&num=5&rand=1`,
      world: `https://apis.tianapi.com/world/index?key=${API_KEY}&num=5&rand=1`,
      general: `https://apis.tianapi.com/generalnews/index?key=${API_KEY}&num=5&rand=1`
    };
    try {
      const res = await fetch(urls[type]);
      const data = await res.json();
      if (data.code === 200) return data.result.list;
    } catch (e) {}
    return [];
  }

  function initHomePanels() {
    if (!isHome) return;

    const card = document.querySelector('.home-avatar-card');
    if (!card) return;

    const panelsContainer = document.createElement('div');
    panelsContainer.className = 'home-panels';
    panelsContainer.innerHTML = `
      <div class="lunar-panel">
        <div class="lunar-header">
          <div class="lunar-header-left">
            <div class="lunar-icon">📅</div>
            <div>
              <div class="lunar-title">今日黄历</div>
              <div class="lunar-subtitle">点击展开详情</div>
            </div>
          </div>
          <div class="lunar-expand-icon">
            <i class="iconfont icon-arrowdown"></i>
          </div>
        </div>
        <div class="lunar-body">
          <div class="lunar-summary">
            <div class="lunar-summary-item">
              <div class="lunar-summary-label">农历</div>
              <div class="lunar-summary-value lunar-month">--</div>
            </div>
            <div class="lunar-summary-item">
              <div class="lunar-summary-label">生肖</div>
              <div class="lunar-summary-value lunar-zodiac">--</div>
            </div>
            <div class="lunar-summary-item">
              <div class="lunar-summary-label">宜</div>
              <div class="lunar-summary-value lunar-fitness-short">--</div>
            </div>
          </div>
          <div class="lunar-details">
            <div class="lunar-detail-grid"></div>
            <div class="lunar-fitness">
              <div class="lunar-fitness-label">宜</div>
              <div class="lunar-fitness-value">--</div>
            </div>
            <div class="lunar-taboo">
              <div class="lunar-taboo-label">忌</div>
              <div class="lunar-taboo-value">--</div>
            </div>
          </div>
        </div>
      </div>
      <div class="news-panel">
        <div class="news-header">
          <div class="news-tabs">
            <button class="news-tab active" data-type="keji">科技</button>
            <button class="news-tab" data-type="internet">互联网</button>
            <button class="news-tab" data-type="world">国际</button>
            <button class="news-tab" data-type="general">综合</button>
          </div>
        </div>
        <div class="news-body">
          <div class="news-list"></div>
        </div>
      </div>
    `;

    card.after(panelsContainer);

    const lunarPanel = panelsContainer.querySelector('.lunar-panel');
    const lunarHeader = panelsContainer.querySelector('.lunar-header');
    const newsTabs = panelsContainer.querySelectorAll('.news-tab');
    const newsList = panelsContainer.querySelector('.news-list');

    lunarHeader.addEventListener('click', () => {
      lunarPanel.classList.toggle('expanded');
    });

    let currentNewsType = 'keji';

    newsTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        newsTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentNewsType = tab.dataset.type;
        renderNews(currentNewsType);
      });
    });

    async function loadAllData() {
      let cached = getCachedData();
      
      if (!cached) {
        const [lunar, keji, internet, world, general] = await Promise.all([
          fetchLunarData(),
          fetchNewsData('keji'),
          fetchNewsData('internet'),
          fetchNewsData('world'),
          fetchNewsData('general')
        ]);

        cached = { lunar, news: { keji, internet, world, general } };
        setCachedData(cached);
      }

      renderLunar(cached.lunar);
      renderNews(currentNewsType);
    }

    function renderLunar(data) {
      if (!data) return;

      const month = panelsContainer.querySelector('.lunar-month');
      const zodiac = panelsContainer.querySelector('.lunar-zodiac');
      const fitnessShort = panelsContainer.querySelector('.lunar-fitness-short');
      const detailGrid = panelsContainer.querySelector('.lunar-detail-grid');
      const fitnessValue = panelsContainer.querySelector('.lunar-fitness-value');
      const tabooValue = panelsContainer.querySelector('.lunar-taboo-value');

      month.textContent = data.lubarmonth + data.lunarday;
      zodiac.textContent = data.shengxiao;
      fitnessShort.textContent = data.fitness ? data.fitness.split('.')[0] : '--';
      
      fitnessValue.textContent = data.fitness || '诸事皆宜';
      tabooValue.textContent = data.taboo || '无';

      const details = [
        { label: '公历', value: data.gregoriandate },
        { label: '农历', value: data.lunardate },
        { label: '天干地支', value: data.tiangandizhiyear },
        { label: '五行', value: data.wuxingnayear },
        { label: '节气', value: data.jieqi || '无' },
        { label: '星宿', value: data.xingsu },
        { label: '冲煞', value: data.chongsha },
        { label: '值神', value: data.jianshen }
      ];

      detailGrid.innerHTML = details.map(d => `
        <div class="lunar-detail-item">
          <span class="lunar-detail-label">${d.label}</span>
          <span class="lunar-detail-value">${d.value}</span>
        </div>
      `).join('');
    }

    const newsCache = {};

    function renderNews(type) {
      const cached = getCachedData();
      const newsData = cached?.news?.[type] || newsCache[type] || [];

      if (newsData.length === 0) {
        newsList.innerHTML = '<div class="news-empty">暂无新闻数据</div>';
        return;
      }

      newsList.innerHTML = newsData.map(item => `
        <a href="${item.url}" class="news-item" target="_blank" rel="noopener">
          <img class="news-item-img" src="${item.picUrl || '/img/default.png'}" alt="${item.title}" loading="lazy" onerror="this.src='/img/default.png'">
          <div class="news-item-content">
            <div class="news-item-title">${item.title}</div>
            <div class="news-item-meta">
              <span class="news-item-source">${item.source || '资讯'}</span>
              <span>${item.ctime || ''}</span>
            </div>
          </div>
        </a>
      `).join('');
    }

    loadAllData();
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
    initHomePanels();
  }

  if (document.readyState !== 'loading') {
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap);
  }
})();

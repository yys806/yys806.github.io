(function() {
  const isPost = document.body.classList.contains('page-post');

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

  function bootstrap() {
    initReadingProgress();
    initTocButton();
  }

  if (document.readyState !== 'loading') {
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap);
  }
})();

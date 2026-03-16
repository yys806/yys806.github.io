(function () {
  function isPostPage() {
    return !!document.querySelector('.markdown-body');
  }

  function getOrCreateBar() {
    var bar = document.getElementById('reading-progress') || document.getElementById('reading-progress-bar');
    if (bar) {
      return bar;
    }
    bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', '阅读进度');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', '0');
    document.body.insertBefore(bar, document.body.firstChild);
    return bar;
  }

  function init() {
    if (!isPostPage()) {
      return;
    }
    if (window.__readingProgressInitialized) {
      return;
    }
    window.__readingProgressInitialized = true;

    var bar = getOrCreateBar();
    var ticking = false;

    function update() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var percent = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      var val = Math.round(percent * 100);
      bar.style.width = (percent * 100).toFixed(2) + '%';
      bar.setAttribute('aria-valuenow', String(val));
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

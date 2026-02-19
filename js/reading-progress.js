/* global Fluid, CONFIG */

Fluid.plugins = Fluid.plugins || {};

Fluid.plugins.readingProgress = {
  init: function() {
    if (!document.body.classList.contains('page-post')) {
      return;
    }
    this.createProgressBar();
    this.bindEvents();
  },
  
  createProgressBar: function() {
    var progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.id = 'reading-progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', '阅读进度');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', '0');
    document.body.insertBefore(progressBar, document.body.firstChild);
  },
  
  bindEvents: function() {
    var self = this;
    var ticking = false;
    
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          self.updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    
    this.updateProgress();
  },
  
  updateProgress: function() {
    var progressBar = document.getElementById('reading-progress-bar');
    if (!progressBar) return;
    
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (docHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    
    var progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    var progressInt = Math.round(progress);
    
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', progressInt);
    progressBar.setAttribute('data-progress', progressInt);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  if (typeof CONFIG !== 'undefined' && CONFIG.reading_progress && CONFIG.reading_progress.enable) {
    Fluid.plugins.readingProgress.init();
  }
});

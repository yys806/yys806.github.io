/* global Fluid, CONFIG */

Fluid.plugins = Fluid.plugins || {};

Fluid.plugins.share = {
  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    document.querySelectorAll('.share-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var type = this.dataset.share;
        if (!type) return;

        e.preventDefault();

        switch (type) {
          case 'copy':
            self.copyLink();
            break;
          case 'qrcode':
            self.showQRCode();
            break;
          case 'wechat':
            self.showQRCode();
            break;
          default:
            self.shareToSocial(type);
        }
      });
    });

    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('qrcode-modal')) {
        self.hideQRCode();
      }
    });

    document.querySelectorAll('.qrcode-close').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        self.hideQRCode();
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        self.hideQRCode();
      }
    });
  },

  copyLink: function() {
    var url = window.location.href;
    var self = this;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function() {
        self.showToast('链接已复制到剪贴板');
      }).catch(function() {
        self.fallbackCopy(url);
      });
    } else {
      this.fallbackCopy(url);
    }
  },

  fallbackCopy: function(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      this.showToast('链接已复制到剪贴板');
    } catch (err) {
      this.showToast('复制失败，请手动复制');
    }

    document.body.removeChild(textarea);
  },

  shareToSocial: function(type) {
    var url = encodeURIComponent(window.location.href);
    var title = encodeURIComponent(document.title);
    var shareUrl = '';

    switch (type) {
      case 'weibo':
        shareUrl = 'https://service.weibo.com/share/share.php?url=' + url + '&title=' + title;
        break;
      case 'twitter':
        shareUrl = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title;
        break;
      case 'facebook':
        shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
        break;
      case 'linkedin':
        shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;
        break;
      case 'qq':
        shareUrl = 'https://connect.qq.com/widget/shareqq/index.html?url=' + url + '&title=' + title;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=500,menubar=no,toolbar=no,status=no');
    }
  },

  showQRCode: function() {
    var modal = document.getElementById('qrcode-modal');
    var container = document.getElementById('qrcode-container');
    if (!modal || !container) return;

    container.innerHTML = '';
    container.dataset.generated = '';
    container.dataset.retry = '0';

    this.generateQRCode();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  hideQRCode: function() {
    var modal = document.getElementById('qrcode-modal');
    if (!modal) return;

    modal.classList.remove('show');
    document.body.style.overflow = '';
  },

  generateQRCode: function() {
    var container = document.getElementById('qrcode-container');
    if (!container) return;

    var url = window.location.href;

    if (container.dataset.generated === 'true') {
      return;
    }

    if (url.indexOf('localhost') !== -1 || url.indexOf('127.0.0.1') !== -1) {
      container.innerHTML = '<div style="padding: 40px 0; color: #999; font-size: 14px;">本地环境无法生成二维码<br>部署到线上后即可正常显示<br><br><a href="' + url + '" target="_blank" style="color: var(--link-hover-color);">' + url + '</a></div>';
      container.dataset.generated = 'true';
      return;
    }

    container.innerHTML = '<div style="padding: 60px 0; color: #999;">加载中...</div>';

    var self = this;
    var apiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=' + encodeURIComponent(url);
    var img = new Image();

    img.onload = function() {
      container.innerHTML = '';
      img.alt = '微信扫一扫分享';
      img.style.display = 'block';
      container.appendChild(img);
      container.dataset.generated = 'true';
    };

    img.onerror = function() {
      self.showQRCodeFallback(container, url);
    };

    img.src = apiUrl;

    setTimeout(function() {
      if (!container.dataset.generated) {
        self.showQRCodeFallback(container, url);
      }
    }, 5000);
  },

  showQRCodeFallback: function(container, url) {
    var text = encodeURIComponent(url);
    var fallbackApis = [
      'https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=' + text,
      'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chld=M|2&chl=' + text
    ];

    var index = parseInt(container.dataset.retry || '0', 10);
    if (index >= fallbackApis.length) {
      container.innerHTML = '<div style="padding: 40px 0; color: #999; font-size: 14px;">二维码加载失败<br>请复制链接手动分享</div>';
      return;
    }

    container.dataset.retry = (index + 1).toString();
    var img = new Image();

    var self = this;
    img.onload = function() {
      container.innerHTML = '';
      img.alt = '微信扫一扫分享';
      img.style.display = 'block';
      container.appendChild(img);
      container.dataset.generated = 'true';
    };

    img.onerror = function() {
      self.showQRCodeFallback(container, url);
    };

    img.src = fallbackApis[index];
  },

  showToast: function(message) {
    var existingToast = document.querySelector('.share-toast');
    if (existingToast) {
      existingToast.remove();
    }

    var toast = document.createElement('div');
    toast.className = 'share-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
      toast.classList.add('show');
    }, 10);

    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        toast.remove();
      }, 300);
    }, 2000);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  if (typeof CONFIG !== 'undefined' && CONFIG.share && CONFIG.share.enable) {
    Fluid.plugins.share.init();
  }
});

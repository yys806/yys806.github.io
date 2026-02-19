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
      if (e.target.classList.contains('qrcode-modal') || 
          e.target.classList.contains('qrcode-close')) {
        self.hideQRCode();
      }
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
    if (!modal) return;

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
    if (!container || container.dataset.generated === 'true') return;

    var url = window.location.href;

    if (typeof QRCode !== 'undefined') {
      new QRCode(container, {
        text: url,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
      container.dataset.generated = 'true';
    } else {
      var apiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
      var img = document.createElement('img');
      img.src = apiUrl;
      img.alt = '二维码';
      img.width = 200;
      img.height = 200;
      container.innerHTML = '';
      container.appendChild(img);
      container.dataset.generated = 'true';
    }
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

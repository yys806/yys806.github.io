/* Hexo 站内互链标签（2026-11-10 建）
 *
 * 用法：{% post_ref 文章标题 %}
 *       {% post_ref 文章标题 | 想显示的短文字 %}
 *
 * 为什么不用内置的 post_link：
 *   post_link 先按「文件名(slug)」找文章，文件名一改链接就断。
 *   本标签按 front-matter 的 title 找，改名文件不影响链接。
 *
 * 查找顺序：title 精确匹配 → slug → 文件名词干。
 * 找不到时输出可见的红色提示（不中断构建），方便发现。
 */
'use strict';

hexo.extend.tag.register('post_ref', function (args) {
  var raw = args.join(' ').trim();
  if (!raw) return '';

  var label = '';
  var sep = raw.indexOf('|');
  if (sep !== -1) {
    label = raw.slice(sep + 1).trim();
    raw = raw.slice(0, sep).trim();
  }
  if (!raw) return '';

  var posts = hexo.model('Post');
  var post = posts.findOne({ title: raw });
  if (!post) post = posts.findOne({ slug: raw });
  if (!post) {
    // 模糊兜底：忽略空格、全半角标点差异（标题改一个冒号也不至于断链）
    var norm = function (s) {
      return String(s || '').replace(/\s+/g, '')
        .replace(/[：:]/g, ':').replace(/[，,]/g, ',').replace(/[（(]/g, '(').replace(/[）)]/g, ')');
    };
    var target = norm(raw);
    post = posts.filter(function (p) { return norm(p.title) === target; }).first();
  }
  if (!post) {
    post = posts.filter(function (p) {
      var src = (p.source || '').replace(/\\/g, '/');
      var base = src.split('/').pop().replace(/\.md$/i, '');
      var stem = base.replace(/^\d{6}-/, '');
      return base === raw || stem === raw;
    }).first();
  }

  if (!post) {
    return '<span style="color:#c00">［站内链接失效：' + raw + '］</span>';
  }

  var text = label || post.title || post.slug;
  var urlFor = hexo.extend.helper.get('url_for');
  var href = urlFor.call(hexo, post.path);
  return '<a href="' + href + '" title="' + (post.title || post.slug) + '">' + text + '</a>';
});

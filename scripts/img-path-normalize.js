/* Hexo 构建期图片路径纠偏（2026-11-10 建）
 *
 * 背景：博客改用 Obsidian 编辑（vault = source/）。Obsidian 粘贴图片生成的链接
 * 可能是 images/x.png 或 ./images/x.png（相对当前文章），而本站图片统一放在
 * source/images/，线上要靠站根路径 /images/x.png 才能解析。
 *
 * 做法：只在「渲染之后」把 <img src> 里的相对 images/ 前缀补成 /images/，
 * 不改任何 .md 原文 —— 笔记里怎么写都无所谓，构建时统一纠正。
 *
 * 兼容：已经是 /images/... 的不动；外链(http/https/data:)不动。
 */
'use strict';

hexo.extend.filter.register('after_post_render', function (data) {
  if (!data || !data.content) return data;

  data.content = data.content.replace(
    /(<img\b[^>]*?\bsrc\s*=\s*)(["'])(?:\.\/)?(images\/[^"']+)\2/gi,
    function (m, prefix, quote, path) {
      return prefix + quote + '/' + path + quote;
    }
  );

  return data;
});

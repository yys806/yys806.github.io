/* Hexo 公式保护层（2026-11-10 建）
 *
 * 问题：Hexo 的 marked 渲染器会把 $$...$$ 之间的换行转成 <br>，把公式里的
 *       _ * 当 markdown 语法处理，导致行内/行间公式到页面时已经变形，MathJax 认不出来。
 *
 * 做法：渲染前把公式整体抽成占位符，渲染后再原样放回（只把 & < > 转义）。
 *       这样 markdown 完全碰不到公式内容，MathJax 拿到的是干净原文。
 *
 * 规则：
 *   行间：$$ ... $$（可跨行）
 *   行内：$...$（不跨行，且内容里要有 LaTeX 特征字符 \ ^ _ { } =，避免误伤 "$5" 这类金额）
 *   代码块（``` 或缩进四空格）里的内容不处理。
 */
'use strict';

var BLOCK_RE = /\$\$([\s\S]+?)\$\$/g;
var INLINE_RE = /(?<!\$)\$(?!\$)([^\n$]{1,300}?)(?<!\$)\$(?!\$)/g;
var LATEX_HINT = /[\\^_{}=]/;

function esc(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* 把代码块（围栏 + 缩进）先摘出来，避免公式规则误伤代码 */
function splitCodeBlocks(src) {
  var saved = [];
  var out = src.replace(/(^|\n)(`{3,}[\s\S]*?`{3,}|~{3,}[\s\S]*?~{3,})/g, function (m) {
    saved.push(m);
    return '\n@@HEXOMATHCODE' + (saved.length - 1) + '@@\n';
  });
  return { text: out, saved: saved };
}

function mergeCodeBlocks(src, saved) {
  return src.replace(/@@HEXOMATHCODE(\d+)@@/g, function (m, i) {
    return saved[Number(i)];
  });
}

hexo.extend.filter.register('before_post_render', function (data) {
  if (!data || typeof data.content !== 'string') return data;

  var parts = splitCodeBlocks(data.content);
  var store = [];
  var text = parts.text;

  // 行间公式
  text = text.replace(BLOCK_RE, function (m, body) {
    store.push({ kind: 'block', tex: body });
    return '@@HEXOMATH' + (store.length - 1) + '@@';
  });

  // 行内公式
  text = text.replace(INLINE_RE, function (m, body) {
    if (!LATEX_HINT.test(body)) return m;      // 不像公式（例如金额）就原样留着
    store.push({ kind: 'inline', tex: body });
    return '@@HEXOMATH' + (store.length - 1) + '@@';
  });

  data._hexoMath = { store: store, code: parts.saved };
  data.content = text;
  return data;
});

hexo.extend.filter.register('after_post_render', function (data) {
  if (!data || typeof data.content !== 'string') return data;
  var st = data._hexoMath;
  if (!st) return data;

  data.content = data.content.replace(/@@HEXOMATH(\d+)@@/g, function (m, i) {
    var item = st.store[Number(i)];
    if (!item) return m;
    var tex = esc(item.tex);
    if (item.kind === 'block') {
      return '$$' + tex + '$$';
    }
    return '$' + tex + '$';
  });

  data.content = mergeCodeBlocks(data.content, st.code || []);
  delete data._hexoMath;
  return data;
});

from __future__ import annotations

import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List
from urllib.parse import urlencode

import feedparser
from openai import OpenAI

ARXIV_API = "http://export.arxiv.org/api/query"


def fetch_paper(max_results: int = 1) -> Dict[str, Any]:
    """
    Fetch the latest cs.AI paper from arXiv via RSS.
    """
    params = {
        "search_query": "cat:cs.AI",
        "sortBy": "submittedDate",
        "sortOrder": "descending",
        "max_results": str(max_results),
    }
    url = f"{ARXIV_API}?{urlencode(params)}"
    feed = feedparser.parse(url)

    if getattr(feed, "bozo", False):
        raise RuntimeError(f"Feed parse error: {feed.bozo_exception}")

    if not feed.entries:
        raise RuntimeError("未从 arXiv 拉取到任何论文。")

    entry = feed.entries[0]
    authors: List[str] = [
        author.get("name", "").strip()
        for author in entry.get("authors", [])
        if author.get("name")
    ]

    return {
        "title": entry.get("title", "").strip(),
        "summary": entry.get("summary", "").strip(),
        "link": entry.get("link", "").strip(),
        "published": entry.get("published", "").strip(),
        "authors": authors,
    }


def summarize_paper(paper: Dict[str, Any]) -> Dict[str, str]:
    """
    Call an OpenAI-compatible LLM (e.g., 硅基流动) to generate a Chinese blog post.
    """
    api_key = os.getenv("LLM_API_KEY")
    base_url = os.getenv("LLM_BASE_URL")
    model = os.getenv("LLM_MODEL", "deepseek-chat")

    if not api_key or not base_url:
        raise RuntimeError("缺少 LLM_API_KEY 或 LLM_BASE_URL 环境变量。")

    client = OpenAI(api_key=api_key, base_url=base_url)

    system_prompt = (
        "你是一个同济大学人工智能专业的学霸，"
        "需要用通俗易懂、略带极客幽默感的中文解读这篇论文。"
        "不要只是翻译摘要，要提炼痛点、创新点和应用场景。"
    )

    authors = paper.get("authors") or []
    author_str = "、".join(authors) if authors else "未知作者"

    user_prompt = f"""论文信息：
- 标题：{paper.get("title", "未知标题")}
- 作者：{author_str}
- 发布时间：{paper.get("published", "未知时间")}
- 摘要：{paper.get("summary", "无摘要")}
- 原文链接：{paper.get("link", "")}

请生成一篇中文技术博客，保持轻度极客幽默，避免逐字翻译，突出痛点、创新点和应用场景。
务必按以下格式输出，便于解析：
标题：<吸引人的中文标题>
正文：
## 一句话总结
...
## 它解决了什么问题？
...
## 核心方法是什么？
...
## 学霸点评
...
## 原文链接
<直接贴出链接>
"""

    completion = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
    )

    content = completion.choices[0].message.content if completion.choices else ""
    if not content:
        raise RuntimeError("LLM 未返回内容。")

    title = None
    body_lines: List[str] = []
    recording_body = False

    for line in content.splitlines():
        stripped = line.strip()
        if stripped.startswith("标题"):
            parts = stripped.split("：", 1)
            if len(parts) == 2:
                title = parts[1].strip()
            continue
        if stripped.startswith("正文"):
            recording_body = True
            continue
        if recording_body:
            body_lines.append(line)

    if not title:
        title = paper.get("title", "AI Paper Daily")

    body = "\n".join(body_lines).strip() if body_lines else content.strip()
    return {"title": title, "body": body}


def save_to_hexo(title: str, body: str) -> Path:
    """
    Save the generated post into Hexo's source/_posts directory.
    """
    posts_dir = Path("source") / "_posts"
    posts_dir.mkdir(parents=True, exist_ok=True)

    now = datetime.now()
    date_prefix = now.strftime("%Y-%m-%d")
    timestamp = now.strftime("%Y-%m-%d %H:%M:%S")

    base_name = f"{date_prefix}-paper-daily.md"
    target = posts_dir / base_name

    suffix = 1
    while target.exists():
        target = posts_dir / f"{date_prefix}-paper-daily-{suffix}.md"
        suffix += 1
        if suffix > 50:
            raise RuntimeError("当天生成的文章过多，放弃写入以避免死循环。")

    front_matter = (
        "---\n"
        f"title: {title}\n"
        f"date: {timestamp}\n"
        "categories: AI Daily\n"
        "tags: 每日AI自动抓取\n"
        "---\n\n"
    )

    target.write_text(front_matter + body + "\n", encoding="utf-8")
    return target


def main() -> None:
    try:
        paper = fetch_paper()
    except Exception as exc:
        print(f"[ERROR] 获取论文失败: {exc}", file=sys.stderr)
        sys.exit(1)

    try:
        summary = summarize_paper(paper)
    except Exception as exc:
        print(f"[ERROR] LLM 生成失败: {exc}", file=sys.stderr)
        sys.exit(1)

    try:
        path = save_to_hexo(summary["title"], summary["body"])
    except Exception as exc:
        print(f"[ERROR] 写入文件失败: {exc}", file=sys.stderr)
        sys.exit(1)

    print(f"[OK] 生成完成，已保存到 {path}")


if __name__ == "__main__":
    main()

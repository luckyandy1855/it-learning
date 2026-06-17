# HTML5 语义化标签（HTML-028）

## 🎯 本节学习目标

- 理解"语义化"的含义及其对 SEO、无障碍、AI 爬虫的价值
- 掌握 HTML5 核心语义标签（header/nav/main/article/section/aside/footer 等）的适用场景
- 能够用语义标签构建完整的知识库文章页结构
- 了解 AI RAG 系统如何依赖语义标签提取高质量内容

---

## 📖 什么是语义化

**语义化（Semantics）**是指用"有意义"的标签来描述内容的角色，而不是单纯用 `<div>` 和 `<span>` 堆砌结构。

```html
<!-- 非语义化（全是 div，需要靠 class 名猜测含义） -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="content">...</div>

<!-- 语义化（标签本身即含义） -->
<header>...</header>
<nav>...</nav>
<main>...</main>
```

**为什么重要**：

1. **搜索引擎**：Google 优先抓取 `<article>`、`<main>` 内的内容
2. **屏幕阅读器**：视障用户通过语义标签跳转页面各区域
3. **AI RAG 爬虫**：向量数据库构建时需定位 `<article>` 正文，而非全量 HTML
4. **可维护性**：团队成员无需看 CSS 就能理解页面结构

---

## 🧠 原理讲解

浏览器维护一棵**无障碍树（Accessibility Tree）**，与 DOM 树并行。语义标签会自动在无障碍树中生成对应角色（Role）：

```text
<header>  → role="banner"
<nav>     → role="navigation"
<main>    → role="main"
<article> → role="article"
<section> → role="region"（需要有 aria-label）
<aside>   → role="complementary"
<footer>  → role="contentinfo"
```

屏幕阅读器和 AI 爬虫都依赖这棵树。使用 `<div>` 虽然可以用 `role` 属性手动声明，但语义标签是"天然正确"的。

---

## 🏗 基本结构

```html
<body>
  <header>        <!-- 全站/文章头部 -->
    <nav>...</nav>
  </header>

  <main>          <!-- 页面主体（每页只能有一个）-->
    <article>     <!-- 独立可复用内容（文章/博文） -->
      <header>文章标题 + 元信息</header>
      <section>第一章</section>
      <section>第二章</section>
    </article>

    <aside>       <!-- 侧边栏：相关文章、广告 -->
    </aside>
  </main>

  <footer>        <!-- 全站页脚 -->
  </footer>
</body>
```

> `<header>` 和 `<footer>` 可以出现在 `<article>` 内部，此时含义是"文章的头部/尾部"，不冲突。

---

## ✅ 完整代码

**场景：AI 知识库文章页（完整语义结构）**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RAG 检索增强生成原理详解 — 阿基米德 AI 知识库</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, 'PingFang SC', sans-serif; background: #f7f7f9; color: #1a1a2e; line-height: 1.7; }
    a { color: #5a4fcf; text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ── 全站 header ── */
    body > header {
      background: #1a1a2e; color: #fff; padding: 0 32px;
      display: flex; align-items: center; justify-content: space-between; height: 56px;
    }
    .site-logo { font-weight: 700; font-size: 1.05rem; color: #a99ef5; }
    body > header nav ul { list-style: none; display: flex; gap: 24px; }
    body > header nav a { color: #ccc; font-size: .9rem; }
    body > header nav a:hover { color: #fff; }

    /* ── 面包屑导航 ── */
    .breadcrumb { max-width: 1100px; margin: 0 auto; padding: 12px 24px; font-size: .82rem; color: #888; }
    .breadcrumb a { color: #5a4fcf; }
    .breadcrumb span { margin: 0 6px; }

    /* ── 主体布局 ── */
    main { max-width: 1100px; margin: 0 auto; padding: 0 24px 60px; display: flex; gap: 40px; align-items: flex-start; }

    /* ── 文章 ── */
    article { flex: 1; min-width: 0; }
    article > header { border-bottom: 1px solid #e8e8f0; padding-bottom: 20px; margin-bottom: 28px; }
    .article-category { display: inline-block; background: #ebe8ff; color: #5a4fcf; font-size: .78rem; padding: 3px 10px; border-radius: 20px; margin-bottom: 12px; }
    h1 { font-size: 1.85rem; line-height: 1.3; margin-bottom: 12px; }
    .article-meta { font-size: .82rem; color: #888; display: flex; flex-wrap: wrap; gap: 16px; }
    time { color: #888; }

    /* ── 内容 section ── */
    section { margin-bottom: 36px; }
    section h2 { font-size: 1.25rem; margin-bottom: 12px; padding-left: 12px; border-left: 4px solid #7c6df0; }
    section h3 { font-size: 1.05rem; margin: 16px 0 8px; color: #333; }
    section p { margin-bottom: 12px; color: #333; }
    section ul, section ol { padding-left: 20px; margin-bottom: 12px; }
    section li { margin-bottom: 6px; color: #444; }

    /* AI 关键词高亮（mark 标签） */
    mark { background: #fff3cd; color: #856404; border-radius: 3px; padding: 1px 4px; }

    /* figure / figcaption */
    figure { background: #fff; border: 1px solid #e8e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; }
    figcaption { font-size: .8rem; color: #888; margin-top: 8px; text-align: center; }
    .diagram { background: #f0eeff; border-radius: 6px; padding: 20px; text-align: center; font-size: .9rem; color: #5a4fcf; font-family: monospace; white-space: pre; }

    /* details / summary */
    details { border: 1px solid #e0e0f0; border-radius: 8px; padding: 12px 16px; margin: 16px 0; background: #fafafe; }
    summary { cursor: pointer; font-weight: 600; color: #5a4fcf; font-size: .9rem; }
    details[open] summary { margin-bottom: 10px; }
    details p { font-size: .88rem; color: #555; }

    /* ── 文章尾部 ── */
    article > footer { border-top: 1px solid #e8e8f0; padding-top: 20px; margin-top: 8px; font-size: .82rem; color: #888; }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .tag { background: #f0eeff; color: #5a4fcf; padding: 3px 10px; border-radius: 20px; font-size: .78rem; }

    /* ── aside 侧边栏 ── */
    aside { width: 280px; flex-shrink: 0; position: sticky; top: 20px; }
    .aside-card { background: #fff; border: 1px solid #e8e8f0; border-radius: 10px; padding: 18px; margin-bottom: 20px; }
    .aside-card h3 { font-size: .9rem; font-weight: 700; margin-bottom: 14px; color: #333; padding-bottom: 10px; border-bottom: 1px solid #f0f0f8; }
    .related-list { list-style: none; }
    .related-list li { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f5f5fa; }
    .related-list li:last-child { margin: 0; padding: 0; border: none; }
    .related-list a { font-size: .85rem; color: #333; display: block; margin-bottom: 3px; }
    .related-list small { color: #aaa; font-size: .75rem; }

    /* 目录（TOC） */
    .toc-list { list-style: none; }
    .toc-list li { margin-bottom: 8px; }
    .toc-list a { font-size: .84rem; color: #666; display: flex; align-items: center; gap: 6px; }
    .toc-list a::before { content: '§'; color: #c0b8f5; font-size: .75rem; }
    .toc-list a:hover { color: #5a4fcf; }

    /* ── 全站 footer ── */
    body > footer { background: #1a1a2e; color: #888; text-align: center; padding: 28px; font-size: .82rem; margin-top: 0; }
    body > footer nav { margin-top: 10px; display: flex; justify-content: center; gap: 20px; }
    body > footer nav a { color: #666; font-size: .8rem; }
  </style>
</head>
<body>

<!-- ① 全站页眉 -->
<header>
  <div class="site-logo">⚗️ 阿基米德 AI 知识库</div>
  <nav aria-label="主导航">
    <ul>
      <li><a href="/">首页</a></li>
      <li><a href="/ai-tools">AI 工具</a></li>
      <li><a href="/workflow">工作流</a></li>
      <li><a href="/rag" aria-current="page">RAG 专题</a></li>
    </ul>
  </nav>
</header>

<!-- ② 面包屑（辅助导航，不算主 nav） -->
<nav class="breadcrumb" aria-label="面包屑导航">
  <a href="/">首页</a><span aria-hidden="true">›</span>
  <a href="/rag">RAG 专题</a><span aria-hidden="true">›</span>
  <span aria-current="page">原理详解</span>
</nav>

<!-- ③ 主体内容区（每页唯一） -->
<main>

  <!-- ④ 文章主体 -->
  <article>

    <!-- 文章头部：标题、元信息 -->
    <header>
      <div class="article-category">RAG 专题</div>
      <h1>检索增强生成（RAG）原理详解：让 AI 精准回答你的私有数据</h1>
      <div class="article-meta">
        <span>作者：阿基米德实验室</span>
        <time datetime="2024-11-20">2024 年 11 月 20 日</time>
        <span>阅读时长：约 8 分钟</span>
        <span>🔖 已收藏 328 次</span>
      </div>
    </header>

    <!-- ── 第一节：什么是 RAG ── -->
    <section id="what-is-rag">
      <h2>什么是 RAG</h2>
      <p>
        <mark>RAG（Retrieval-Augmented Generation，检索增强生成）</mark>是一种将
        外部知识库与大语言模型结合的技术方案。简单说：
        <strong>先检索相关文档，再把检索结果塞进 Prompt，让 LLM 基于真实数据回答问题。</strong>
      </p>
      <p>它解决了 LLM 两大核心问题：知识截止日期（训练数据过时）和幻觉（瞎编事实）。</p>

      <!-- figure + figcaption：对图表或代码示例加语义说明 -->
      <figure>
        <div class="diagram">用户提问 → [检索器] → 知识库（向量数据库）
      ↓
相关文档片段（Top-K）
      ↓
[LLM] + Prompt = 精准回答</div>
        <figcaption>图 1：RAG 系统基本流程（检索 → 增强 → 生成）</figcaption>
      </figure>

      <!-- details/summary：折叠的补充说明 -->
      <details>
        <summary>为什么不直接把全量文档塞进 Prompt？</summary>
        <p>
          LLM 的上下文窗口有长度限制（即便 Claude 支持 200K Token，成本也极高）。
          RAG 通过语义检索，只取最相关的 3–5 段文字，大幅降低 Token 消耗，
          同时让模型聚焦在真正有用的内容上，回答更准确。
        </p>
      </details>
    </section>

    <!-- ── 第二节：核心步骤 ── -->
    <section id="how-it-works">
      <h2>RAG 的核心步骤</h2>
      <h3>步骤一：文档切片与向量化</h3>
      <p>
        将知识库（PDF / Markdown / 网页）切割为固定大小的文本块，
        再用 Embedding 模型（如 OpenAI text-embedding-3-small）转换为向量，
        存入向量数据库（Pinecone / Chroma / Weaviate）。
      </p>
      <ul>
        <li>切片大小：通常 512–1024 Token，带 10–20% 重叠（防止截断上下文）</li>
        <li>向量维度：OpenAI 小模型 1536 维，大模型 3072 维</li>
      </ul>

      <h3>步骤二：语义检索</h3>
      <p>
        用户提问 → Embedding → 向量数据库相似度搜索（余弦相似度）→
        取 Top-K 相关片段（一般 K=3–5）。
      </p>

      <h3>步骤三：增强生成</h3>
      <p>将检索到的片段拼入 Prompt，让 LLM 基于这些"参考资料"回答，并标注来源。</p>
    </section>

    <!-- ── 第三节：语义 HTML 与 RAG 的关系 ── -->
    <section id="html-and-rag">
      <h2>语义 HTML 如何影响 RAG 质量</h2>
      <p>
        RAG 系统在构建知识库时需要爬取网页。<mark>语义标签</mark>让爬虫能精准定位正文内容，
        避免把导航栏、广告、页脚文字也混入知识库，大幅提升检索质量。
      </p>
      <ul>
        <li>爬取 <code>&lt;article&gt;</code> / <code>&lt;main&gt;</code>：获取干净正文</li>
        <li>读取 <code>&lt;h1&gt;</code>–<code>&lt;h3&gt;</code>：提取结构化章节标题</li>
        <li>识别 <code>&lt;time&gt;</code>：判断内容时效性</li>
        <li>跳过 <code>&lt;nav&gt;</code> / <code>&lt;aside&gt;</code>：过滤导航和侧边栏噪声</li>
      </ul>
    </section>

    <!-- 文章尾部：标签、版权 -->
    <footer>
      <span>分类：RAG 专题 · 技术原理</span>
      <div class="tags">
        <span class="tag">RAG</span>
        <span class="tag">向量数据库</span>
        <span class="tag">LLM</span>
        <span class="tag">检索增强</span>
        <span class="tag">Embedding</span>
      </div>
    </footer>
  </article>

  <!-- ⑤ 侧边栏：相关内容 -->
  <aside aria-label="相关内容">
    <!-- 目录 -->
    <div class="aside-card">
      <h3>📋 本文目录</h3>
      <ul class="toc-list">
        <li><a href="#what-is-rag">什么是 RAG</a></li>
        <li><a href="#how-it-works">RAG 的核心步骤</a></li>
        <li><a href="#html-and-rag">语义 HTML 与 RAG</a></li>
      </ul>
    </div>

    <!-- 相关文章 -->
    <div class="aside-card">
      <h3>🔗 相关文章</h3>
      <ul class="related-list">
        <li>
          <a href="/vector-db">向量数据库选型：Pinecone vs Chroma vs Weaviate</a>
          <small>2024-10-15 · 阅读 1.2k</small>
        </li>
        <li>
          <a href="/embedding">OpenAI Embedding 模型使用指南</a>
          <small>2024-09-20 · 阅读 890</small>
        </li>
        <li>
          <a href="/prompt-engineering">RAG Prompt 工程：如何减少幻觉</a>
          <small>2024-11-05 · 阅读 2.1k</small>
        </li>
      </ul>
    </div>
  </aside>

</main>

<!-- ⑥ 全站页脚 -->
<footer>
  <p>© 2024 阿基米德 AI 实验室 · 不聊概念，只做实验</p>
  <nav aria-label="页脚导航">
    <a href="/about">关于</a>
    <a href="/privacy">隐私政策</a>
    <a href="/sitemap.xml">站点地图</a>
  </nav>
</footer>

</body>
</html>
```

---

## 🔍 逐行解析

**`<header>` 出现两次**
第一次是全站 `<body>` 的直接子元素，代表全站页眉；第二次在 `<article>` 内部，代表文章头部。两者语义不同，完全合法。

**`<nav aria-label="主导航">`**
页面可能有多个 `<nav>`（主导航 + 面包屑 + 页脚导航），用 `aria-label` 区分它们，屏幕阅读器用户能快速跳转到正确的导航区。

**`<main>`**
每个页面只能有一个 `<main>`，且不能嵌套在 `<article>`、`<aside>`、`<header>` 等元素中。

**`<article>` vs `<section>`**
`<article>` 是独立、可单独发布的内容（博客文章、新闻、评论）；`<section>` 是文章内部的逻辑分组，需要有标题。

**`<mark>` 高亮**
语义化的高亮标签，表示"被标记/需要注意"的文字，不同于 `<b>`（加粗）或 `<strong>`（重要）。

**`<time datetime="...">`**
`datetime` 属性提供机器可读的时间格式，搜索引擎和 AI 爬虫依赖它判断内容时效性。

**`<details>/<summary>`**
原生折叠组件，无需 JS 即可实现展开/收起。`<summary>` 是永远可见的摘要，点击后展开 `<details>` 的其余内容。

---

## 🌐 浏览器表现

- `<details>/<summary>`：Chrome/Firefox/Safari 原生支持折叠动画
- `<mark>`：默认黄色背景高亮，可用 CSS 覆盖
- 语义标签本身不影响视觉（无默认样式差异），布局仍由 CSS 控制
- 屏幕阅读器（NVDA、VoiceOver）会在遇到 `<nav>`、`<main>` 等标签时宣告区域名称

---

## 📦 常见属性/API

| 标签 | 默认 ARIA Role | 说明与典型用法 |
|------|--------------|--------------|
| `<header>` | `banner`（顶层时） | 全站或文章的头部区域，含 logo、导航、标题 |
| `<nav>` | `navigation` | 导航链接集合，主导航/面包屑/分页 |
| `<main>` | `main` | 页面主体内容，每页唯一，不嵌套在其他语义标签内 |
| `<article>` | `article` | 独立可复用的内容单元（文章/评论/产品卡片） |
| `<section>` | `region`（有 aria-label 时） | 文章内有主题的分组，必须有标题（h1–h6） |
| `<aside>` | `complementary` | 与主内容相关但可独立存在的补充内容（侧边栏） |
| `<footer>` | `contentinfo`（顶层时） | 版权、联系方式、相关链接等页脚信息 |
| `<figure>` | `figure` | 图片、代码块、图表等配有说明的独立内容 |
| `<figcaption>` | （figure 的子元素） | figure 的标题/说明文字 |
| `<time>` | — | 时间/日期，`datetime` 属性提供机器可读格式 |
| `<mark>` | `mark` | 高亮/标记文字（搜索关键词、AI 识别结果） |
| `<details>` | `group` | 折叠/展开容器，`open` 属性控制默认展开 |
| `<summary>` | `button` | `<details>` 的可见摘要行，点击切换展开状态 |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. `<main>` 每页只能有一个**

```html
<!-- ❌ 错误：两个 main -->
<main>首页内容</main>
<main>博客列表</main>

<!-- ✅ 正确 -->
<main>
  <section>首页推荐</section>
  <section>最新文章</section>
</main>
```

**2. `<section>` 必须有标题**

```html
<!-- ❌ section 没有标题，改用 div -->
<section>
  <p>随机内容</p>
</section>

<!-- ✅ section 有 h2，表达清晰的语义 -->
<section>
  <h2>技术原理</h2>
  <p>...</p>
</section>
```

**3. `<article>` vs `<section>` 判断口诀**

> 能不能单独发布到 RSS / 复制到另一个网站仍有意义？→ 能：`<article>`；不能：`<section>`

---

## ⚠️ 易错点

| 错误 | 正确做法 |
|------|---------|
| 把 `<header>` 当成"标题"用（混淆与 `<h1>`） | `<header>` 是区块容器，`<h1>` 才是标题文字 |
| `<section>` 没有 `<h2>` | 没有标题的分组改用 `<div>` |
| 把页面所有导航都用同一个 `<nav>` | 多个导航用 `aria-label` 区分 |
| `<aside>` 放主要内容 | `<aside>` 只放补充/相关内容，主内容放 `<main>` 内 |
| `<footer>` 只在页面底部 | `<footer>` 可出现在 `<article>` 内（文章尾部） |

---

## 💡 最佳实践

1. **先画结构，再写代码**：在纸上标注每个区块是 header/main/aside/footer，确认语义后再写 HTML
2. **给多个 nav 加 `aria-label`**：区分主导航、面包屑、页脚导航
3. **`<time>` 加 `datetime`**：让爬虫和 AI 能正确理解发布时间
4. **`<details>/<summary>` 代替 JS 手写折叠**：原生支持，无障碍，零 JS

---

## 🚀 AI 应用场景

### 场景 1：RAG 爬虫依赖语义标签提取 `<article>` 正文

```js
// ── 服务端 Node.js：用 cheerio 解析 HTML，提取语义内容 ──
const cheerio = require('cheerio');

function extractForRAG(html, url) {
  const $ = cheerio.load(html);

  // ✅ 优先从语义标签提取内容
  const title   = $('h1').first().text().trim()
               || $('title').text().trim();
  const content = $('article').text().trim()
               || $('main').text().trim()
               || $('body').text().trim();   // 降级兜底

  // 提取发布时间（用于判断内容时效）
  const publishTime = $('time[datetime]').attr('datetime')
                   || $('meta[property="article:published_time"]').attr('content');

  // 过滤掉噪声区域（导航、侧边栏、广告）
  $('nav, aside, header, footer, script, style').remove();
  const cleanContent = $('article, main').text().trim();

  return {
    url,
    title,
    content: cleanContent || content,
    publishedAt: publishTime,
    wordCount: cleanContent.length,
  };
}

// 对比：爬非语义页面（div.content）的脆弱性
function extractLegacy(html) {
  const $ = cheerio.load(html);
  // ❌ 依赖 class 名，换个网站就失效
  return $('div.content, div.article-body, div.post-content').first().text();
}
```

---

### 场景 2：`<mark>` 高亮 AI 搜索关键词

```html
<article id="articleContent">
  <p>RAG（检索增强生成）是一种将外部知识库与大语言模型结合的技术方案。</p>
  <p>它解决了 LLM 的知识截止日期问题和幻觉问题。</p>
</article>

<input type="search" id="searchInput" placeholder="搜索关键词…" oninput="highlightKeyword(this.value)">
```

```js
// 高亮搜索关键词（使用 <mark> 标签）
function highlightKeyword(keyword) {
  const article = document.getElementById('articleContent');

  // 还原：先清除所有 <mark>
  article.innerHTML = article.innerHTML
    .replace(/<mark class="ai-highlight">(.*?)<\/mark>/gi, '$1');

  if (!keyword.trim()) return;

  // 转义特殊字符，创建正则
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex   = new RegExp(`(${escaped})`, 'gi');

  // 只在文本节点内替换，避免破坏 HTML 标签属性
  walkTextNodes(article, (node) => {
    if (regex.test(node.nodeValue)) {
      const span = document.createElement('span');
      span.innerHTML = node.nodeValue.replace(
        regex,
        '<mark class="ai-highlight">$1</mark>'
      );
      node.parentNode.replaceChild(span, node);
    }
  });
}

function walkTextNodes(el, callback) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes  = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  nodes.forEach(callback);
}
```

---

### 场景 3：AI 自动生成语义化 HTML 骨架

```js
// 给 Claude API 发 Prompt，自动生成语义化 HTML 骨架
async function generateSemanticHTML(pageDescription) {
  const prompt = `
你是一名前端开发专家，擅长 HTML5 语义化结构设计。
根据以下页面描述，生成完整的语义化 HTML 骨架（不含 CSS/JS）：

页面描述：${pageDescription}

要求：
1. 使用 HTML5 语义标签（header/nav/main/article/section/aside/footer）
2. 每个 nav 加 aria-label
3. 图片用 figure + figcaption
4. 时间用 <time datetime="...">
5. 折叠内容用 <details>/<summary>
6. 不要用 <div> 替代语义标签
7. 只输出 HTML，不要解释

`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         'YOUR_ANTHROPIC_KEY',
      'anthropic-version': '2023-06-01',
      'Content-Type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-opus-4-5',
      max_tokens: 2048,
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  return data.content[0].text;
}

// 使用示例
generateSemanticHTML('一个 AI 工具评测文章页，包含侧边栏相关工具推荐和目录')
  .then(html => {
    document.getElementById('preview').innerHTML = html;
    console.log('生成完成，请检查语义结构');
  });
```

---

## 📝 练习题

**题 1（基础）**：写出一个博客首页的语义结构骨架（只需 HTML 标签，不需要内容），包含：全站 header + 主导航、main 内的文章列表（每篇是 `<article>`）、右侧 aside 归档、页脚 footer。

**题 2（进阶）**：用 `<details>/<summary>` 实现一个 FAQ 组件，包含 5 个问答，默认第一个展开（`open` 属性）。

**题 3（AI 场景）**：你要为一个 RAG 知识库构建爬虫，爬取博客文章。请编写 JS 函数 `extractArticleData(html)`，优先从语义标签（`<article>`、`<main>`、`<h1>`、`<time>`）提取：文章标题、正文、发布时间，并过滤掉 `<nav>`、`<aside>`、`<footer>` 内的噪声内容。

---

## 📌 本节总结

| 标签 | 核心语义 | 常见错误 |
|------|---------|---------|
| `<header>` | 页面/区块头部 | 误以为只能用在 `<body>` 顶部 |
| `<nav>` | 导航链接集合 | 把所有链接都包进 nav |
| `<main>` | 页面唯一主体 | 用了多个 main |
| `<article>` | 独立可发布内容 | 与 section 混用 |
| `<section>` | 有主题的内容分组 | 没有配套标题 |
| `<aside>` | 补充/侧边内容 | 把主要内容放进去 |
| `<footer>` | 页面/区块尾部 | 以为只能在最底部 |
| `<mark>` | 高亮/标记文字 | 用 `<b>` 或 span+css 替代 |
| `<time>` | 时间日期 | 忘记加 `datetime` 属性 |
| `<details>/<summary>` | 原生折叠组件 | 用 JS+div 重写轮子 |

语义化不是可选项——它直接影响 SEO 排名、AI 爬虫质量、屏幕阅读器体验。从第一行 HTML 开始就用对标签，是前端开发的基本功。

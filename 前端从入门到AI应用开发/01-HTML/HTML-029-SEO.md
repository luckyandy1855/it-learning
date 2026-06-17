# HTML 与 SEO（HTML-029）

## 🎯 本节学习目标

- 理解 HTML 层面的 SEO 配置项及各自的作用
- 掌握 `<title>`、`<meta>`、Open Graph、Twitter Card 的写法
- 学会用 JSON-LD 结构化数据向搜索引擎/AI 声明内容类型
- 能够用 AI（Claude）自动填充 description、用 DALL-E 生成 og:image

---

## 📖 什么是 SEO

**SEO（Search Engine Optimization，搜索引擎优化）**是让页面在 Google、Bing、百度等搜索结果中排名靠前的技术与策略。

HTML 是 SEO 的基础层：搜索引擎爬虫首先读取 HTML 标签，再评估内容质量。优化 HTML 结构是 SEO 成本最低、收益最稳定的手段。

**2024 年的新变化**：Perplexity、ChatGPT Search、Claude.ai 等 AI 搜索引擎同样读取 HTML 标签和结构化数据，`<meta>` 和 JSON-LD 的重要性进一步提升。

---

## 🧠 原理讲解

搜索引擎爬虫读取页面的顺序：

```text
1. <title>            → 搜索结果标题（SERP 蓝链）
2. <meta name="description"> → 搜索结果摘要（SERP 描述）
3. <h1> + 语义标签      → 内容主题识别
4. <link rel="canonical"> → 判断页面权威版本
5. <meta name="robots">   → 爬取/收录控制
6. JSON-LD / Microdata  → 富媒体结果（Rich Results）
7. og:* / twitter:*     → 社交分享预览
```

AI 搜索引擎（Perplexity）额外读取：JSON-LD、`<article>` 正文、`<time>` 时间，用来判断内容权威性和时效性。

---

## 🏗 基本结构

```html
<head>
  <!-- 1. 标题（最重要，60 字符以内）-->
  <title>页面标题 — 站点名</title>

  <!-- 2. 描述（搜索结果摘要，150 字符以内）-->
  <meta name="description" content="...">

  <!-- 3. 规范链接（避免重复内容问题）-->
  <link rel="canonical" href="https://example.com/article-slug">

  <!-- 4. 社交分享（Open Graph / Twitter Card）-->
  <meta property="og:title" content="...">
  <meta property="og:image" content="...">

  <!-- 5. 结构化数据（JSON-LD）-->
  <script type="application/ld+json">{ "@context": "https://schema.org", ... }</script>
</head>
```

---

## ✅ 完整代码

**场景：AI 内容站文章页完整 SEO 配置**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ① 核心 SEO 标签 -->
  <title>RAG 检索增强生成完全指南：原理、实战与避坑 — 阿基米德 AI 知识库</title>
  <meta name="description" content="深入解析 RAG（检索增强生成）技术原理，手把手演示 Pinecone + OpenAI Embedding 构建私有知识库，附真实测试数据与踩坑记录。适合有基础的前端/后端开发者。">

  <!-- 关键词（Google 基本忽略，但百度仍参考）-->
  <meta name="keywords" content="RAG,检索增强生成,向量数据库,LLM,知识库">

  <!-- 作者 -->
  <meta name="author" content="阿基米德实验室">

  <!-- ② 爬虫控制 -->
  <!-- index：允许收录；follow：允许跟踪链接 -->
  <meta name="robots" content="index, follow">

  <!-- ③ 规范链接（canonical）
       解决：同一内容多个 URL（?utm_source=xxx）导致权重分散 -->
  <link rel="canonical" href="https://lab.archimedes.ai/rag-guide">

  <!-- ④ 多语言（hreflang）
       告知搜索引擎同一内容的不同语言版本 -->
  <link rel="alternate" hreflang="zh-CN" href="https://lab.archimedes.ai/rag-guide">
  <link rel="alternate" hreflang="en"    href="https://lab.archimedes.ai/en/rag-guide">

  <!-- ⑤ Open Graph（控制微信/Facebook/LinkedIn 分享卡片）-->
  <meta property="og:type"        content="article">
  <meta property="og:title"       content="RAG 检索增强生成完全指南：原理、实战与避坑">
  <meta property="og:description" content="手把手演示 Pinecone + OpenAI Embedding 构建私有知识库，附真实测试数据。">
  <meta property="og:image"       content="https://lab.archimedes.ai/images/rag-guide-og.jpg">
  <meta property="og:image:width"  content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url"         content="https://lab.archimedes.ai/rag-guide">
  <meta property="og:site_name"   content="阿基米德 AI 知识库">
  <meta property="og:locale"      content="zh_CN">
  <!-- 文章专用 OG 属性 -->
  <meta property="article:published_time" content="2024-11-20T08:00:00+08:00">
  <meta property="article:modified_time"  content="2024-12-01T10:30:00+08:00">
  <meta property="article:author"         content="阿基米德实验室">
  <meta property="article:tag"            content="RAG">
  <meta property="article:tag"            content="LLM">

  <!-- ⑥ Twitter Card（控制 X / Twitter 分享卡片）-->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@archimedes_ai">
  <meta name="twitter:creator"     content="@archimedes_ai">
  <meta name="twitter:title"       content="RAG 检索增强生成完全指南：原理、实战与避坑">
  <meta name="twitter:description" content="手把手演示 Pinecone + OpenAI Embedding 构建私有知识库，附真实测试数据。">
  <meta name="twitter:image"       content="https://lab.archimedes.ai/images/rag-guide-og.jpg">

  <!-- ⑦ JSON-LD 结构化数据（Article Schema）
       让 Google 显示"富媒体搜索结果"（作者、发布时间、面包屑等）
       同时让 Perplexity 等 AI 搜索引擎精确理解内容类型 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "RAG 检索增强生成完全指南：原理、实战与避坑",
    "description": "深入解析 RAG 技术原理，手把手演示 Pinecone + OpenAI Embedding 构建私有知识库。",
    "image": "https://lab.archimedes.ai/images/rag-guide-og.jpg",
    "datePublished": "2024-11-20T08:00:00+08:00",
    "dateModified":  "2024-12-01T10:30:00+08:00",
    "author": {
      "@type": "Person",
      "name": "阿基米德实验室",
      "url":  "https://lab.archimedes.ai/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "阿基米德 AI 知识库",
      "logo": {
        "@type":  "ImageObject",
        "url":    "https://lab.archimedes.ai/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "@id",
      "@id":   "https://lab.archimedes.ai/rag-guide"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "首页",   "item": "https://lab.archimedes.ai" },
        { "@type": "ListItem", "position": 2, "name": "RAG 专题", "item": "https://lab.archimedes.ai/rag" },
        { "@type": "ListItem", "position": 3, "name": "完全指南" }
      ]
    },
    "keywords": ["RAG", "检索增强生成", "向量数据库", "LLM", "Pinecone"],
    "inLanguage": "zh-CN"
  }
  </script>

  <!-- ⑧ 性能相关 -->
  <!-- preconnect：提前建立与 CDN / API 服务器的连接 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <!-- DNS prefetch：提前解析域名 -->
  <link rel="dns-prefetch" href="https://cdn.archimedes.ai">
  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <style>
    body { font-family: system-ui, 'PingFang SC', sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a1a2e; line-height: 1.7; }
    h1 { font-size: 1.9rem; margin-bottom: 8px; }
    .meta { color: #888; font-size: .85rem; margin-bottom: 24px; }
    p { margin-bottom: 14px; color: #333; }
    .seo-note { background: #f0eeff; border-left: 4px solid #7c6df0; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: .85rem; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>RAG 检索增强生成完全指南：原理、实战与避坑</h1>
  <div class="meta">
    作者：阿基米德实验室 ·
    <time datetime="2024-11-20">2024 年 11 月 20 日</time> ·
    阅读时长 8 分钟
  </div>
  <div class="seo-note">
    💡 本页 SEO 配置说明：head 中包含完整的 og、twitter card、JSON-LD，
    可在浏览器开发者工具 Elements 面板中查看所有 meta 标签。
  </div>
  <p>RAG（检索增强生成）是 2024 年最重要的 AI 工程技术之一。本文从原理到实战，帮你彻底搞清楚 RAG 的每个环节……</p>
</body>
</html>
```

---

## 🔍 逐行解析

**`<title>` 格式**
`页面标题 — 站点名`，60 个字符以内，Google 超出会截断。核心关键词尽量靠前。

**`<meta name="description">`**
不影响排名，但影响点击率（CTR）。写得好，搜索结果摘要就是这段文字；写得差，Google 会自动从正文截取。

**`<link rel="canonical">`**
同一篇文章可能有多个 URL（带参数、带 www、HTTP/HTTPS），`canonical` 告诉爬虫哪个是"权威版本"，避免权重分散。

**`og:image` 尺寸要求**
1200×630px（1.91:1），JPEG 或 PNG，小于 8MB。尺寸不对，微信/Facebook 会拒绝显示缩略图。

**`twitter:card: "summary_large_image"`**
大图模式，分享时显示大横幅图片，点击率比 `summary`（小图）高约 30%。

**JSON-LD `type: "TechArticle"`**
比通用 `Article` 更精确，让 Google 知道这是技术类文章，有助于在技术搜索中排名。

---

## 🌐 浏览器表现

| 场景 | 效果 |
|------|------|
| Google 搜索结果 | `<title>` 作为蓝链，`<meta description>` 作为摘要 |
| JSON-LD 配置正确 | Google 显示面包屑、发布时间（富媒体结果） |
| 微信分享 | og:title + og:image 显示为卡片 |
| X (Twitter) 分享 | twitter:title + twitter:image 显示为大图卡片 |
| Perplexity 引用 | JSON-LD 中的作者/时间/标题作为来源信息 |

---

## 📦 常见属性/API

| 标签/属性 | 类型 | 说明 |
|----------|------|------|
| `<title>` | HTML 标签 | 搜索结果标题 + 浏览器 Tab 文字，60 字符内 |
| `<meta name="description">` | Meta 标签 | 搜索结果摘要，150 字符内，不影响排名但影响 CTR |
| `<meta property="og:title">` | Open Graph | 社交分享卡片标题（微信/Facebook/LinkedIn） |
| `<meta property="og:image">` | Open Graph | 分享卡片封面图，1200×630px |
| `<meta property="og:type">` | Open Graph | 内容类型：`article` / `website` / `product` |
| `<link rel="canonical">` | Link 标签 | 声明页面权威 URL，避免重复内容问题 |
| `<meta name="robots">` | Meta 标签 | 控制爬虫行为：`index,follow` / `noindex,nofollow` |
| `<link rel="alternate" hreflang>` | Link 标签 | 多语言页面关联，告知搜索引擎语言版本 |
| `<script type="application/ld+json">` | JSON-LD | 结构化数据，支持 Article/Product/FAQ/BreadcrumbList |
| `<meta name="twitter:card">` | Twitter Card | X 分享卡片类型：`summary` / `summary_large_image` |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. Title 是 SEO 最重要的单个 HTML 元素**

```html
<!-- ❌ 差：没有关键词，没有品牌 -->
<title>文章详情</title>

<!-- ✅ 好：关键词靠前，品牌在后，60 字符以内 -->
<title>RAG 完全指南：原理与实战 — 阿基米德 AI 知识库</title>
```

**2. `canonical` 防止重复内容惩罚**

```html
<!-- 这四个 URL 对搜索引擎来说是"四个不同页面" -->
<!-- https://example.com/article -->
<!-- https://example.com/article?utm_source=twitter -->
<!-- http://example.com/article -->
<!-- https://www.example.com/article -->

<!-- 用 canonical 声明哪个是唯一权威版本 -->
<link rel="canonical" href="https://example.com/article">
```

**3. JSON-LD 必须有效（用 Google Rich Results Test 验证）**

```js
// 验证 URL：https://search.google.com/test/rich-results
// 常见错误：datePublished 格式必须是 ISO 8601
// ✅ "2024-11-20T08:00:00+08:00"
// ❌ "2024年11月20日"
```

---

## ⚠️ 易错点

| 错误 | 正确做法 |
|------|---------|
| 每个页面用同一个 title | 每页唯一 title，含页面核心关键词 |
| description 超过 160 字符 | 搜索结果会截断，保持 120–150 字符 |
| og:image 尺寸不是 1200×630 | 按比例要求生成，否则社交平台拒绝显示 |
| JSON-LD 日期格式错误 | 必须是 ISO 8601 格式（`YYYY-MM-DDTHH:mm:ss±HH:MM`） |
| 内容页漏写 canonical | 所有可被索引的页面都应有 canonical |
| `<meta name="keywords">` 关键词堆砌 | Google 已忽略，过度堆砌可能被惩罚 |

---

## 💡 最佳实践

1. **动态页面用 JS 设置 meta**：SPA（React/Vue）需要在路由变化时更新 title 和 description
2. **og:image 存 CDN**：必须是公开可访问的绝对 URL，不能是相对路径
3. **定期用 Google Search Console 检查**：404、重复内容、结构化数据错误
4. **AI 内容站特别注意 `datePublished`**：Perplexity 引用时会显示发布时间，过旧的内容被降权

---

## 🚀 AI 应用场景

### 场景 1：Claude 自动提取摘要生成 `<meta description>`

```js
// 文章发布流程：AI 自动生成 SEO meta 信息
async function generateSEOMeta(articleContent, articleTitle) {
  const prompt = `
你是一名 SEO 专家。根据以下文章标题和内容，生成：

1. meta description（120-150 字中文，包含核心关键词，吸引用户点击，不要用引号）
2. 3-5 个 SEO 关键词（逗号分隔）
3. og:title（50 字以内，比原标题更口语化）

文章标题：${articleTitle}

文章内容（前 500 字）：
${articleContent.slice(0, 500)}

请以 JSON 格式输出，不要有其他文字：
{
  "description": "...",
  "keywords": "...",
  "ogTitle": "..."
}
`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         'YOUR_ANTHROPIC_KEY',
      'anthropic-version': '2023-06-01',
      'Content-Type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5',   // 快速、便宜，适合批量处理
      max_tokens: 400,
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  const data   = await res.json();
  const text   = data.content[0].text;
  const parsed = JSON.parse(text);
  return parsed;
}

// 动态插入 meta 标签
async function injectSEOMeta(articleTitle, articleContent) {
  const meta = await generateSEOMeta(articleContent, articleTitle);

  document.title = `${articleTitle} — 阿基米德 AI 知识库`;

  setMeta('description', meta.description);
  setMeta('keywords',    meta.keywords);
  setOGMeta('og:title',       meta.ogTitle);
  setOGMeta('og:description', meta.description);
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setOGMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.content = content;
}
```

---

### 场景 2：DALL-E 生成封面图，自动设置为 `og:image`

```js
// 用 DALL-E 3 生成文章封面图，自动上传并设置 og:image
async function generateOGImage(articleTitle, articleTopic) {
  // 1. 用 DALL-E 3 生成封面图（1792×1024，比例接近 og:image）
  const imageRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer YOUR_OPENAI_KEY`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:   'dall-e-3',
      prompt:  `技术文章封面图，主题：${articleTopic}。
                风格：简洁科技感，深蓝色背景，白色/紫色图形元素，无文字。
                尺寸：1792×1024，适合社交媒体分享卡片。`,
      n:       1,
      size:    '1792x1024',
      quality: 'standard',
    }),
  });

  const imageData = await imageRes.json();
  const imageUrl  = imageData.data[0].url;  // 临时 URL，1 小时过期

  // 2. 上传到自己的 CDN（避免 OpenAI 临时链接过期）
  const uploadRes = await fetch('/api/upload-og-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ imageUrl, title: articleTitle }),
  });
  const { permanentUrl } = await uploadRes.json();

  // 3. 设置 og:image
  setOGMeta('og:image', permanentUrl);
  setOGMeta('twitter:image', permanentUrl);

  return permanentUrl;
}
```

---

### 场景 3：JS 动态设置 meta（SPA 路由切换时更新 SEO 信息）

```js
// SPA（单页应用）的 SEO 管理器
class SEOManager {
  static setPage({ title, description, ogImage, canonical, jsonLD }) {
    // 标题
    document.title = title;

    // meta tags
    if (description) SEOManager._setMeta('description', description);
    if (canonical)   SEOManager._setLink('canonical',   canonical);

    // Open Graph
    if (title)   SEOManager._setOG('og:title',       title);
    if (ogImage) SEOManager._setOG('og:image',        ogImage);
    if (canonical) SEOManager._setOG('og:url',        canonical);

    // Twitter Card
    if (title)   SEOManager._setOG('twitter:title',   title, 'name');
    if (ogImage) SEOManager._setOG('twitter:image',   ogImage, 'name');

    // JSON-LD：移除旧的，插入新的
    document.querySelector('script[type="application/ld+json"]')?.remove();
    if (jsonLD) {
      const script       = document.createElement('script');
      script.type        = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLD);
      document.head.appendChild(script);
    }
  }

  static _setMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`)
          || document.head.appendChild(Object.assign(document.createElement('meta'), { name }));
    el.content = content;
  }

  static _setOG(property, content, attr = 'property') {
    let el = document.querySelector(`meta[${attr}="${property}"]`)
          || document.head.appendChild(document.createElement('meta'));
    el.setAttribute(attr, property);
    el.content = content;
  }

  static _setLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`)
          || document.head.appendChild(Object.assign(document.createElement('link'), { rel }));
    el.href = href;
  }
}

// 使用示例：路由变化时调用
SEOManager.setPage({
  title:       'RAG 完全指南 — 阿基米德 AI 知识库',
  description: '手把手演示 Pinecone + OpenAI Embedding 构建私有知识库，附真实测试数据。',
  ogImage:     'https://cdn.archimedes.ai/rag-guide-og.jpg',
  canonical:   'https://lab.archimedes.ai/rag-guide',
  jsonLD: {
    '@context':      'https://schema.org',
    '@type':         'TechArticle',
    'headline':      'RAG 完全指南',
    'datePublished': '2024-11-20T08:00:00+08:00',
    'author':        { '@type': 'Person', 'name': '阿基米德实验室' },
  },
});
```

---

## 📝 练习题

**题 1（基础）**：为一篇题为"如何用 ChatGPT 写周报"的文章，编写完整的 `<head>` SEO 配置，包含 title、description、canonical、og 四件套（og:title/description/image/type）。

**题 2（进阶）**：编写一个 FAQ 页面的 JSON-LD 结构化数据（`@type: "FAQPage"`），包含 3 个问答，让 Google 可能展示"富媒体搜索结果"。参考 Schema.org 文档。

**题 3（AI 场景）**：设计一个 `generateArticleMeta(title, content)` 函数，调用 Claude API，输入文章标题和内容（前 600 字），自动输出：description（中文 120 字内）、ogTitle（50 字内）、3 个关键词。要求：用 `claude-haiku-4-5` 模型，返回解析后的 JSON 对象，并附错误处理（API 调用失败时返回基于 title 的降级 meta）。

---

## 📌 本节总结

| 配置项 | 作用 | 优先级 |
|--------|------|--------|
| `<title>` | 搜索结果蓝链 + Tab 标题 | ⭐⭐⭐⭐⭐ |
| `<meta description>` | 搜索结果摘要（影响 CTR） | ⭐⭐⭐⭐ |
| `<link canonical>` | 防重复内容 | ⭐⭐⭐⭐ |
| `og:title / og:image` | 社交分享卡片 | ⭐⭐⭐⭐ |
| `twitter:card` | X 分享大图卡片 | ⭐⭐⭐ |
| `JSON-LD Article` | 富媒体结果 + AI 搜索理解 | ⭐⭐⭐⭐ |
| `hreflang` | 多语言站点 | ⭐⭐（有多语言时必须） |
| `meta robots` | 控制爬取行为 | ⭐⭐⭐ |

SEO 的 HTML 配置是一次性工作，但收益是长期的。结合 AI 自动化（Claude 生成 description、DALL-E 生成封面图），可以做到每篇文章发布即配置完整，无需手动维护。

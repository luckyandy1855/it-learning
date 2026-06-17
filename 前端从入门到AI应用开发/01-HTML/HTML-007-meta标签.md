# `<meta>` 标签（HTML-007）

## 🎯 本节学习目标

学完本节，你将能够：

- 理解 `<meta>` 标签的作用机制和语义
- 区分 `name/content`、`property/content`、`http-equiv/content` 三种写法的使用场景
- 掌握 SEO、Open Graph、Twitter Card、主题色等全套 meta 配置
- 能够用 JavaScript 动态更新 meta 标签，为 AI 生成内容页面实现动态 SEO 和社交分享卡片

---

## 📖 什么是 `<meta>` 标签

`<meta>` 是 HTML 文档中用于声明**元数据（metadata）**的标签。元数据是"关于数据的数据"——它描述页面的内容、行为和属性，但本身不显示在页面上。

`<meta>` 标签是**自闭合标签**（void element），没有结束标签，也没有内容：

```html
<!-- 自闭合写法（推荐） -->
<meta charset="UTF-8" />

<!-- 也可以不写斜杠（HTML5 允许） -->
<meta charset="UTF-8">
```

**谁会读取 meta 标签？**

```text
<meta> 的受众
    ├── 浏览器         → charset（编码）、viewport（视口）、http-equiv（行为控制）
    ├── 搜索引擎       → description、robots、canonical
    ├── 社交平台爬虫   → og:title、og:image、twitter:card
    └── 操作系统/App   → theme-color（移动端浏览器工具栏颜色）
```

---

## 🧠 原理讲解

### `<meta>` 的三种工作模式

**模式一：`name` + `content`（最常见）**

向文档命名空间注册键值对，目标受众通常是搜索引擎和爬虫：

```html
<meta name="description" content="页面描述文字" />
```

**模式二：`property` + `content`（Open Graph 协议）**

`property` 属性来自 Open Graph 协议，不是 HTML 标准属性，但被所有主流社交平台支持：

```html
<meta property="og:title" content="页面标题" />
```

**模式三：`http-equiv` + `content`（模拟 HTTP 响应头）**

让 HTML 文档"自带"HTTP 响应头，用于不能修改服务器配置的场景：

```html
<!-- 相当于 HTTP 头：Content-Security-Policy: ... -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
```

### 浏览器读取 meta 的时机

```text
浏览器解析 HTML 流
    ↓
遇到 <meta charset>   → 立即重新解码已接收字节（最高优先级）
遇到 <meta viewport>  → 影响后续布局计算（渲染前生效）
遇到 <meta http-equiv="refresh"> → 启动定时跳转计时器
遇到 <meta name="robots"> → 缓存到爬虫控制策略
遇到 <meta property="og:*"> → 供后续社交平台爬虫抓取
```

---

## 🏗 基本结构

```html
<head>
  <!-- 模式一：name/content -->
  <meta name="description" content="页面描述" />

  <!-- 模式二：property/content（Open Graph） -->
  <meta property="og:title" content="页面标题" />

  <!-- 模式三：http-equiv/content -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <!-- 特殊：charset 只有 charset 属性 -->
  <meta charset="UTF-8" />
</head>
```

---

## ✅ 完整代码

以下是为 AI 工具页面配置的完整 meta 标签集，覆盖 SEO、Open Graph、Twitter Card 和主题配置：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <!-- ═══ 1. 基础：字符编码 ═══ -->
  <meta charset="UTF-8" />

  <!-- ═══ 2. 移动端视口 ═══ -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

  <!-- ═══ 3. SEO：页面描述 ═══ -->
  <meta name="description" content="AIWriter 是基于大语言模型的智能写作工具，支持文章生成、邮件润色、代码注释，免费体验 30 天。" />

  <!-- ═══ 4. SEO：关键词（现代搜索引擎权重较低，但仍有参考价值）═══ -->
  <meta name="keywords" content="AI写作,写作助手,文章生成,GPT写作,Claude写作" />

  <!-- ═══ 5. SEO：爬虫控制 ═══ -->
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

  <!-- ═══ 6. 兼容性：强制 IE 使用最新渲染引擎（历史遗留，现代项目可省略）═══ -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <!-- ═══ 7. Open Graph：微信/Slack/LinkedIn 分享卡片 ═══ -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="AIWriter — 让写作快 10 倍的 AI 工具" />
  <meta property="og:description" content="基于大语言模型，免费体验 30 天" />
  <meta property="og:image" content="https://aiwriter.example.com/og-cover-1200x630.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="AIWriter 产品截图" />
  <meta property="og:url" content="https://aiwriter.example.com" />
  <meta property="og:site_name" content="AIWriter" />
  <meta property="og:locale" content="zh_CN" />

  <!-- ═══ 8. Twitter Card：Twitter/X 平台分享预览 ═══ -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@aiwriter_app" />
  <meta name="twitter:creator" content="@aiwriter_app" />
  <meta name="twitter:title" content="AIWriter — 让写作快 10 倍" />
  <meta name="twitter:description" content="基于大语言模型，免费体验 30 天" />
  <meta name="twitter:image" content="https://aiwriter.example.com/twitter-card-1200x628.png" />
  <meta name="twitter:image:alt" content="AIWriter 产品截图" />

  <!-- ═══ 9. 主题色：移动端浏览器工具栏颜色 ═══ -->
  <meta name="theme-color" content="#6366f1" />
  <!-- 深色模式下的主题色 -->
  <meta name="theme-color" content="#4f46e5" media="(prefers-color-scheme: dark)" />

  <!-- ═══ 10. Referrer 策略：控制请求头中 Referer 信息的发送范围 ═══ -->
  <meta name="referrer" content="strict-origin-when-cross-origin" />

  <!-- ═══ 11. 安全：内容安全策略（防 XSS）═══ -->
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self'; connect-src 'self' https://api.openai.com https://api.anthropic.com;" />

  <title>AIWriter — 让写作快 10 倍的 AI 工具</title>
</head>
<body>
  <div id="app"></div>

  <script>
    // 演示：动态更新 og:image 为 AI 生成的封面图
    async function updateOgImageWithAIGenerated(articleTitle) {
      // 模拟调用 AI 图片生成 API 获取封面图 URL
      const aiGeneratedImageUrl = await generateCoverImage(articleTitle);

      // 更新 og:image meta 标签内容
      const ogImageMeta = document.querySelector('meta[property="og:image"]');
      if (ogImageMeta) {
        ogImageMeta.setAttribute('content', aiGeneratedImageUrl);
        console.log('og:image 已更新为 AI 生成封面：', aiGeneratedImageUrl);
      }
    }

    // 模拟 AI 图片生成（实际项目中调用 DALL-E 或 Stable Diffusion API）
    async function generateCoverImage(title) {
      // 实际代码：
      // const response = await fetch('https://api.openai.com/v1/images/generations', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${API_KEY}` },
      //   body: JSON.stringify({ prompt: `Blog cover for: ${title}`, size: '1200x630' })
      // });
      // const data = await response.json();
      // return data.data[0].url;

      return `https://aiwriter.example.com/generated/${encodeURIComponent(title)}.png`;
    }
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

| 标签 | 属性组合 | 作用详解 |
|------|---------|----------|
| `<meta charset="UTF-8">` | `charset` | 声明文档编码为 UTF-8，支持全球所有语言字符。必须出现在文档前 1024 字节内。 |
| `<meta name="viewport" content="width=device-width, initial-scale=1.0">` | `name`+`content` | `width=device-width` 让布局宽度等于设备屏幕宽度；`initial-scale=1.0` 禁止初始缩放；`maximum-scale=5.0` 允许用户最多放大 5 倍（无障碍要求）。 |
| `<meta name="description" content="...">` | `name`+`content` | 搜索结果页面（SERP）中标题下方的灰色摘要文字。建议 120–160 字符。直接影响点击率，但不影响排名。 |
| `<meta name="keywords" content="...">` | `name`+`content` | 历史遗留标签。Google 已不读取此标签用于排名，Bing 仍略微参考。保留无害，可用于内部搜索。 |
| `<meta name="robots" content="index, follow">` | `name`+`content` | 控制搜索引擎爬虫行为：`index` 允许被收录；`follow` 允许追踪链接；`noindex` 阻止收录。 |
| `<meta http-equiv="X-UA-Compatible" content="IE=edge">` | `http-equiv`+`content` | 告诉 IE 浏览器使用最新渲染引擎，防止 IE 进入"兼容模式"（现代项目通常可省略）。 |
| `<meta property="og:type" content="website">` | `property`+`content` | Open Graph 页面类型：`website`（网站）、`article`（文章）、`product`（商品）。 |
| `<meta property="og:image" content="https://...">` | `property`+`content` | 社交分享时的封面图。必须是绝对 URL，建议尺寸 1200×630px（16:9）。 |
| `<meta name="twitter:card" content="summary_large_image">` | `name`+`content` | Twitter 卡片类型：`summary_large_image` 显示大图卡片，`summary` 显示小图，`app` 用于 App 推广。 |
| `<meta name="theme-color" content="#6366f1">` | `name`+`content` | 移动端 Chrome/Safari 浏览器工具栏的颜色，提升品牌一致性。支持 `media` 属性区分深浅色模式。 |
| `<meta name="referrer" content="...">` | `name`+`content` | 控制页面发起请求时 HTTP Referer 头的内容：`no-referrer` 不发送；`strict-origin-when-cross-origin` 跨域时只发送源（安全推荐值）。 |
| `<meta http-equiv="Content-Security-Policy" content="...">` | `http-equiv`+`content` | 内容安全策略，限制页面可加载的资源来源，防止 XSS 攻击。是 AI 应用的安全关键配置。 |

---

## 🌐 浏览器表现

### 各 meta 标签在不同场景的实际效果

**1. description 在 Google 搜索结果中的显示**

```text
┌─────────────────────────────────────────────────────┐
│ AIWriter — 让写作快 10 倍的 AI 工具                   │  ← <title>
│ https://aiwriter.example.com                         │
│ AIWriter 是基于大语言模型的智能写作工具，支持文章         │  ← <meta name="description">
│ 生成、邮件润色、代码注释，免费体验 30 天。              │
└─────────────────────────────────────────────────────┘
```

**2. og 标签在微信分享时的效果**

```text
┌─────────────────────────┐
│ [封面图 og:image]        │  ← 1200×630 封面图
│                         │
│ AIWriter — 让写作快 10 倍 │  ← og:title
│ 基于大语言模型，免费体验 30 天│  ← og:description
│ aiwriter.example.com    │  ← og:url
└─────────────────────────┘
```

**3. theme-color 在移动端的效果**

在 Android Chrome 中，浏览器顶部状态栏和地址栏会变为 `#6366f1` 紫色，与页面主色调一致。

---

## 📦 常见属性 / API

### 完整 meta 属性参考表

| meta 类型 | 属性与值 | 用途说明 | 示例 |
|-----------|---------|---------|------|
| 字符编码 | `charset="UTF-8"` | 文档字符编码，支持全 Unicode | `<meta charset="UTF-8" />` |
| 移动视口-宽度 | `name="viewport" content="width=device-width"` | 布局宽度跟随设备屏幕宽度 | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| 移动视口-缩放 | `content="initial-scale=1.0"` | 禁止浏览器初始缩放，1:1 像素比 | 同上 |
| SEO 描述 | `name="description"` | 搜索结果摘要，建议 120–160 字符 | `<meta name="description" content="AI写作助手">` |
| SEO 关键词 | `name="keywords"` | 历史遗留，Google 不读取，可选 | `<meta name="keywords" content="AI,写作">` |
| 爬虫控制 | `name="robots"` | `index/noindex`、`follow/nofollow` | `<meta name="robots" content="index, follow">` |
| OG 标题 | `property="og:title"` | 社交分享卡片标题（可与 title 不同） | `<meta property="og:title" content="产品标题">` |
| OG 描述 | `property="og:description"` | 社交分享卡片副标题 | `<meta property="og:description" content="...">` |
| OG 封面图 | `property="og:image"` | 分享卡片图片，必须绝对 URL，建议 1200×630 | `<meta property="og:image" content="https://...">` |
| OG 类型 | `property="og:type"` | 内容类型：`website`/`article`/`product` | `<meta property="og:type" content="website">` |
| OG URL | `property="og:url"` | 页面规范 URL | `<meta property="og:url" content="https://...">` |
| OG 地区 | `property="og:locale"` | 内容语言地区，影响分享平台语言 | `<meta property="og:locale" content="zh_CN">` |
| Twitter 卡片 | `name="twitter:card"` | `summary_large_image`（大图）/ `summary`（小图）/ `app` | `<meta name="twitter:card" content="summary_large_image">` |
| Twitter 图片 | `name="twitter:image"` | Twitter 分享封面图 | `<meta name="twitter:image" content="https://...">` |
| IE 兼容 | `http-equiv="X-UA-Compatible"` | 强制 IE 用最新引擎 | `<meta http-equiv="X-UA-Compatible" content="IE=edge">` |
| 主题色 | `name="theme-color"` | 移动端浏览器工具栏颜色，支持 media 属性 | `<meta name="theme-color" content="#6366f1">` |
| 来源策略 | `name="referrer"` | 控制 Referer 请求头：`no-referrer`/`strict-origin-when-cross-origin` | `<meta name="referrer" content="strict-origin-when-cross-origin">` |
| 内容安全策略 | `http-equiv="Content-Security-Policy"` | 防 XSS，限制脚本/连接来源 | `<meta http-equiv="Content-Security-Policy" content="...">` |
| 页面刷新 | `http-equiv="refresh"` | 定时刷新或跳转（不推荐，影响用户体验） | `<meta http-equiv="refresh" content="5;url=https://...">` |
| 作者 | `name="author"` | 声明页面作者，部分搜索引擎读取 | `<meta name="author" content="Andy">` |
| 版权 | `name="copyright"` | 声明版权所有者 | `<meta name="copyright" content="2026 AIWriter">` |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. description 是搜索结果点击率的关键**

Google 不保证使用你写的 description（有时会自动提取页面内容），但写好的 description 出现时，点击率（CTR）显著高于自动生成的版本。建议：包含核心价值主张 + 行动召唤。

**2. og:image 必须是绝对 URL 且尺寸合规**

相对路径会导致分享卡片显示不出封面图。推荐尺寸：1200×630px（Facebook/微信标准），文件大小建议 < 1MB。

**3. twitter:card 必须配合 twitter:image**

单独设置 `twitter:card` 但不提供 `twitter:image`，Twitter 只显示 `summary`（小方块）卡片，视觉效果差很多。

**4. robots meta 控制页面是否被搜索引擎收录**

对于 AI 工具的后台管理页面、用户私有内容页面，一定要加 `<meta name="robots" content="noindex, nofollow">`，防止敏感页面被搜索引擎抓取。

**5. CSP 是 AI 应用的安全必配**

AI 返回的内容可能包含恶意 HTML/JS，`Content-Security-Policy` 是浏览器层面的最后防线。

---

## ⚠️ 易错点

**❌ 错误 1：og:image 用相对路径**

```html
<!-- 错误：社交平台爬虫不知道相对路径的基准 -->
<meta property="og:image" content="/images/cover.png" />

<!-- 正确：必须完整 URL -->
<meta property="og:image" content="https://example.com/images/cover.png" />
```

**❌ 错误 2：description 超过 160 字符**

```html
<!-- 错误：搜索结果中被截断 -->
<meta name="description" content="这是一款非常优秀的AI写作工具，支持非常多的功能包括但不限于文章生成、邮件回复、代码注释、创意写作、报告生成、翻译润色等等，欢迎免费试用30天...">

<!-- 正确：控制在120字符以内，核心信息前置 -->
<meta name="description" content="AI写作工具，支持文章生成、邮件回复、代码注释，免费体验30天。">
```

**❌ 错误 3：混淆 `name` 和 `property`**

```html
<!-- 错误：og 属性用了 name -->
<meta name="og:title" content="..." />

<!-- 正确：og 属性必须用 property -->
<meta property="og:title" content="..." />
```

**❌ 错误 4：theme-color 用不支持的色彩格式**

```html
<!-- 部分浏览器不支持 oklch/lab 等新色彩空间 -->
<meta name="theme-color" content="oklch(50% 0.3 270)" />

<!-- 正确：使用十六进制或 rgb() -->
<meta name="theme-color" content="#6366f1" />
```

---

## 💡 最佳实践

**1. 用 Open Graph 调试工具验证配置**

- Facebook：`https://developers.facebook.com/tools/debug/`
- Twitter：`https://cards-dev.twitter.com/validator`
- LinkedIn：`https://www.linkedin.com/post-inspector/`

开发完成后，用这些工具粘贴 URL，立刻看到分享卡片预览。

**2. description 写法公式**

```text
[产品名] + [核心功能] + [差异化优势] + [行动召唤]
示例：AIWriter — 基于 Claude 3.5 的写作助手，5 秒生成高质量文章，每月免费 100 次，立即体验。
```

**3. 为不同页面设置不同的 og 内容**

首页、产品详情页、博客文章页应各有专属的 og:title、og:description、og:image，不要全站用一张封面图。

**4. 利用 `<meta name="robots" content="noindex">` 保护 AI 内容**

如果你的 AI 工具生成的内容是用户私有内容（如 AI 写的私人日记），应加 noindex 防止被抓取。

---

## 🚀 AI 应用场景

### 用 JS 动态更新 meta，实现 AI 内容页的动态 SEO 和社交分享卡片

**场景**：AI 内容创作平台，用户每生成一篇文章就有独立分享页。每篇文章的标题、描述、封面图都是 AI 生成的，需要动态更新 meta 标签。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AIWriter — 正在生成...</title>

  <!-- 初始 meta（占位值，JS 加载后动态替换）-->
  <meta name="description" content="AI 正在为您生成文章..." />
  <meta property="og:title" content="AIWriter — AI 内容平台" />
  <meta property="og:description" content="AI 为您生成的专属内容" />
  <meta property="og:image" content="https://aiwriter.example.com/og-default.png" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://aiwriter.example.com/og-default.png" />
</head>
<body>
  <div id="article-container">
    <div id="loading">AI 正在生成内容，请稍候...</div>
    <article id="article-content" hidden></article>
  </div>

  <script>
    /**
     * 动态更新所有 meta 标签
     * @param {Object} config - meta 配置对象
     */
    function updateMetaTags(config) {
      // 辅助函数：更新或创建 meta 标签
      function setMeta(selector, attribute, value) {
        let meta = document.querySelector(selector);
        if (!meta) {
          meta = document.createElement('meta');
          // 解析 selector 提取属性名和值
          const match = selector.match(/\[(\w+(?:-\w+)*)="([^"]+)"\]/);
          if (match) meta.setAttribute(match[1], match[2]);
          document.head.appendChild(meta);
        }
        meta.setAttribute(attribute, value);
      }

      // 更新页面 title
      if (config.title) {
        document.title = `${config.title} — AIWriter`;
      }

      // 更新 SEO description
      if (config.description) {
        setMeta('meta[name="description"]', 'content', config.description);
      }

      // 更新 Open Graph 标签
      if (config.ogTitle) {
        setMeta('meta[property="og:title"]', 'content', config.ogTitle);
      }
      if (config.ogDescription) {
        setMeta('meta[property="og:description"]', 'content', config.ogDescription);
      }
      if (config.ogImage) {
        // 核心功能：用 AI 生成的封面图 URL 替换 og:image
        setMeta('meta[property="og:image"]', 'content', config.ogImage);
        setMeta('meta[name="twitter:image"]', 'content', config.ogImage);
        console.log('[Meta] og:image 已更新为 AI 生成封面：', config.ogImage);
      }
      if (config.ogType) {
        setMeta('meta[property="og:type"]', 'content', config.ogType);
      }
    }

    /**
     * 模拟调用 AI API 生成文章内容和封面图
     * 实际项目中替换为真实 API 调用
     */
    async function generateAIArticle(prompt) {
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 实际代码：
      // const response = await fetch('https://api.anthropic.com/v1/messages', {
      //   method: 'POST',
      //   headers: {
      //     'x-api-key': API_KEY,
      //     'anthropic-version': '2023-06-01',
      //     'content-type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     model: 'claude-3-5-sonnet-20241022',
      //     max_tokens: 1024,
      //     messages: [{ role: 'user', content: prompt }]
      //   })
      // });
      // const data = await response.json();

      // 模拟返回结果
      return {
        title: '2026 年 AI 写作工具完全指南',
        content: '<p>这是 AI 生成的文章内容...</p>',
        summary: '详解 2026 年最值得使用的 AI 写作工具，含真实测评数据和使用场景对比。',
        // AI 生成的封面图 URL（实际调用 DALL-E 3 / Stable Diffusion）
        coverImageUrl: 'https://aiwriter.example.com/generated/covers/ai-writing-guide-2026.webp'
      };
    }

    /**
     * 主流程：生成内容并更新 meta
     */
    async function init() {
      const urlParams = new URLSearchParams(window.location.search);
      const prompt = urlParams.get('prompt') || '写一篇关于AI写作工具的指南';

      try {
        // 1. 调用 AI 生成内容
        const result = await generateAIArticle(prompt);

        // 2. 渲染文章内容到页面
        document.getElementById('loading').hidden = true;
        const articleEl = document.getElementById('article-content');
        articleEl.innerHTML = `<h1>${result.title}</h1>${result.content}`;
        articleEl.hidden = false;

        // 3. 动态更新 meta 标签（核心：用 AI 生成封面图替换 og:image）
        updateMetaTags({
          title: result.title,
          description: result.summary,
          ogTitle: result.title,
          ogDescription: result.summary,
          ogImage: result.coverImageUrl,  // ← AI 生成的封面图 URL
          ogType: 'article'
        });

        console.log('[完成] 文章已生成，meta 标签已更新');
        console.log('[og:image]', result.coverImageUrl);

      } catch (error) {
        console.error('[错误] AI 生成失败：', error);
        document.getElementById('loading').textContent = '生成失败，请刷新重试';
      }
    }

    // 页面加载完成后启动
    document.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>
```

**重要说明：** 动态更新 meta 对**社交平台爬虫无效**。微信、Twitter 等爬虫在页面加载时只读取 HTML 源码，不执行 JS。如果需要社交分享卡片准确显示 AI 生成的内容，必须使用**服务端渲染（SSR）**，在服务器返回 HTML 时就注入正确的 meta 值。动态更新 `document.title` 等对用户和 Google 爬虫有效。

---

## 📝 练习题

**题目 1（基础）：** 下面的 meta 配置有几处错误？

```html
<meta name="og:title" content="我的AI工具" />
<meta property="description" content="这是描述" />
<meta property="og:image" content="/cover.jpg" />
<meta name="twitter:card" content="large_image" />
```

参考答案：① `og:title` 应用 `property` 不是 `name`；② `description` 应用 `name` 不是 `property`；③ `og:image` 必须绝对 URL；④ twitter:card 值应为 `summary_large_image` 不是 `large_image`。

**题目 2（AI 场景）：** 编写一个 JS 函数 `updateArticleMeta(article)`，接收一个文章对象 `{ title, summary, imageUrl, url }`，同时更新以下标签：`document.title`、`meta[name="description"]`、`meta[property="og:title"]`、`meta[property="og:description"]`、`meta[property="og:image"]`、`meta[name="twitter:image"]`。

**题目 3（思考）：** 你的 AI 工具生成了一篇热门文章，朋友分享到微信后封面图显示的是默认占位图而不是 AI 生成的封面图，原因是什么？应该如何解决？

---

## 📌 本节总结

| meta 类型 | 写法 | 核心价值 |
|-----------|------|---------|
| charset | `<meta charset="UTF-8">` | 防中文乱码，必须第一行 |
| viewport | `name="viewport"` | 移动端适配，缺失导致桌面缩小版 |
| description | `name="description"` | 搜索摘要，影响点击率 |
| robots | `name="robots"` | 控制爬虫，私有页面加 noindex |
| og:* | `property="og:*"` | 社交分享卡片，image 必须绝对 URL |
| twitter:* | `name="twitter:*"` | Twitter/X 分享，card+image 配合使用 |
| theme-color | `name="theme-color"` | 移动端浏览器工具栏颜色 |
| CSP | `http-equiv="Content-Security-Policy"` | AI 应用防 XSS 必配 |

`<meta>` 标签虽小，但覆盖的范围极广：从字符编码到搜索优化，从社交分享到安全防护。对于 AI 工具来说，正确配置 meta 标签是产品从"能用"到"好用且被发现"的关键一步。

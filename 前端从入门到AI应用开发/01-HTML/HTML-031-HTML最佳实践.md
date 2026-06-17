# HTML 最佳实践（HTML-031）

## 🎯 本节学习目标

- 系统掌握 HTML 在性能、安全、语义、可维护性、无障碍五个维度的最佳实践
- 理解 CSP、`defer`、`preconnect` 等配置的原理与正确用法
- 能够用 AI（Claude）自动审查 HTML 代码质量
- 识别 AI 生成 HTML 代码时的常见质量问题

---

## 📖 什么是最佳实践

**最佳实践（Best Practices）**是经过大量工程经验沉淀的、在特定场景下"最少出错、最易维护、性能最优"的写法规范。

HTML 最佳实践不是死板的规定，而是一套权衡后的工程决策：

- 性能：减少页面加载时间
- 安全：防止 XSS、点击劫持等攻击
- 语义：让机器（爬虫/AI/屏幕阅读器）正确理解内容
- 可维护性：降低团队协作和长期维护成本
- 无障碍：让所有用户都能使用

---

## 🧠 原理讲解

**为什么这些实践重要？**

以 `<script>` 为例：

```text
默认（无 defer/async）：
HTML 解析 → 遇到 <script> → 暂停解析 → 下载 JS → 执行 JS → 继续解析
（页面白屏时间 = 所有 <script> 下载 + 执行时间）

defer：
HTML 解析与 JS 下载并行 → 解析完成后执行（保留顺序）
（白屏时间只受 HTML 解析影响）

async：
HTML 解析与 JS 下载并行 → JS 下载完立刻执行（不保留顺序）
（适合无依赖的独立脚本，如统计埋点）
```

**CSP（内容安全策略）的工作原理**：

```text
浏览器收到 CSP Header（或 meta）→
解析资源加载规则 →
阻止不符合规则的资源（JS/CSS/图片/iframe）
→ 降低 XSS 攻击面
```

---

## 🏗 基本结构

最佳实践的 HTML 模板骨架：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- 安全：CSP -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
  <!-- 性能：preconnect -->
  <link rel="preconnect" href="https://api.example.com">
  <title>页面标题 — 站点名</title>
  <!-- CSS 放 head -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- 语义标签 -->
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
  <!-- JS 放 body 末尾，加 defer -->
  <script src="app.js" defer></script>
</body>
</html>
```

---

## ✅ 完整代码

**场景：符合所有最佳实践的 AI 工具页面模板**

```html
<!DOCTYPE html>
<!-- ✅ lang 属性：声明页面语言，屏幕阅读器据此选择发音引擎 -->
<html lang="zh-CN">
<head>
  <!-- ✅ charset 必须是第一个 meta，防止乱码 -->
  <meta charset="UTF-8">

  <!-- ✅ viewport：移动端适配基础配置 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ✅ 安全：内容安全策略（CSP）
       说明：
       - default-src 'self'：默认只允许同域资源
       - script-src 'self' 'nonce-RANDOM123'：只允许同域 JS + 有 nonce 的内联脚本
       - style-src 'self' 'unsafe-inline'：允许同域 CSS + 内联样式（生产环境建议去掉 unsafe-inline）
       - img-src 'self' https: data:：允许同域图片、HTTPS 图片、Base64 图片
       - connect-src 'self' https://api.anthropic.com：只允许向这些接口发 fetch/XHR
       - frame-ancestors 'none'：禁止被嵌入 iframe（防点击劫持）
  -->
  <meta
    http-equiv="Content-Security-Policy"
    content="
      default-src 'self';
      script-src  'self' 'nonce-RANDOM123';
      style-src   'self' 'unsafe-inline';
      img-src     'self' https: data:;
      connect-src 'self' https://api.anthropic.com https://api.openai.com;
      frame-ancestors 'none';
    "
  >

  <!-- ✅ 安全：防点击劫持（CSP frame-ancestors 的 HTTP Header 等效方案，部分老浏览器需要）-->
  <meta http-equiv="X-Frame-Options" content="DENY">

  <!-- ✅ 安全：禁止浏览器自动嗅探 MIME 类型 -->
  <meta http-equiv="X-Content-Type-Options" content="nosniff">

  <!-- ✅ SEO：页面标题（60 字以内，含核心关键词）-->
  <title>AI 提示词助手 — 阿基米德实验室</title>

  <!-- ✅ SEO：页面描述 -->
  <meta name="description" content="一键优化 AI 提示词，支持 Claude / GPT-4 / Gemini，提升 AI 输出质量。">

  <!-- ✅ 性能：preconnect 提前建立 TCP+TLS 连接（对 API / CDN 域名） -->
  <link rel="preconnect" href="https://api.anthropic.com">
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

  <!-- ✅ 性能：DNS prefetch（preconnect 不支持时的降级方案）-->
  <link rel="dns-prefetch" href="https://cdn.archimedes.ai">

  <!-- ✅ 性能：预加载关键资源（首屏 LCP 图片）-->
  <link rel="preload" href="/hero-image.webp" as="image" type="image/webp">

  <!-- ✅ 规范链接 -->
  <link rel="canonical" href="https://lab.archimedes.ai/prompt-tool">

  <!-- ✅ Favicon（多格式） -->
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- ✅ Open Graph -->
  <meta property="og:title"       content="AI 提示词助手 — 阿基米德实验室">
  <meta property="og:description" content="一键优化 AI 提示词，提升 AI 输出质量。">
  <meta property="og:image"       content="https://lab.archimedes.ai/og-prompt-tool.jpg">
  <meta property="og:type"        content="website">

  <!-- ✅ CSS 放在 head（阻塞渲染，但避免 FOUC 无样式闪烁）-->
  <link rel="stylesheet" href="/styles/main.css">

  <!-- ✅ 关键 CSS 内联（首屏核心样式，避免额外请求）-->
  <style>
    /* 关键路径 CSS：仅包含首屏可见内容的样式 */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: system-ui, 'PingFang SC', -apple-system, sans-serif;
      background: #0f0f13;
      color: #e8e8e8;
      line-height: 1.6;
      min-height: 100vh;
    }

    /* 跳转链接（无障碍）*/
    .skip-link {
      position: absolute; top: -999px; left: 8px;
      background: #7c6df0; color: #fff; padding: 8px 16px;
      border-radius: 0 0 6px 6px; z-index: 9999;
      text-decoration: none; font-size: .9rem;
    }
    .skip-link:focus { top: 0; }
    .sr-only {
      position: absolute; width: 1px; height: 1px;
      padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }

    /* 页头 */
    header {
      background: #1a1a24;
      border-bottom: 1px solid #2a2a3a;
      padding: 14px 24px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo { font-weight: 700; font-size: 1.05rem; color: #a99ef5; text-decoration: none; }

    nav ul { list-style: none; display: flex; gap: 24px; }
    nav a  { color: #bbb; text-decoration: none; font-size: .9rem; }
    nav a:hover, nav a[aria-current] { color: #fff; }

    /* 主体 */
    main { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
    .hero { text-align: center; margin-bottom: 48px; }
    .hero h1 { font-size: 2rem; margin-bottom: 12px; }
    .hero p  { color: #888; max-width: 480px; margin: 0 auto; }

    /* 工具卡片 */
    .tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .tool-card {
      background: #1a1a24; border: 1px solid #2a2a3a; border-radius: 12px; padding: 24px;
      transition: border-color .2s;
    }
    .tool-card:hover { border-color: #5a4fcf; }
    .tool-card h2 { font-size: 1.05rem; margin-bottom: 8px; }
    .tool-card p  { color: #777; font-size: .88rem; margin-bottom: 16px; }
    .card-btn {
      display: inline-block; padding: 8px 18px;
      background: #7c6df0; color: #fff;
      border: none; border-radius: 6px;
      font-size: .88rem; cursor: pointer; text-decoration: none;
      font-weight: 600;
    }
    .card-btn:hover { background: #6a5cd8; }
    /* ✅ 焦点样式：仅键盘导航时可见 */
    .card-btn:focus-visible {
      outline: 3px solid #fff;
      outline-offset: 2px;
    }

    /* 页脚 */
    footer {
      text-align: center; padding: 28px; color: #555;
      font-size: .82rem; border-top: 1px solid #1a1a24;
    }

    /* ✅ 响应式（移动端适配）*/
    @media (max-width: 600px) {
      .hero h1 { font-size: 1.5rem; }
      main     { padding: 24px 16px; }
    }
  </style>
</head>
<body>

  <!-- ✅ 无障碍：跳转链接 -->
  <a href="#mainContent" class="skip-link">跳转到主内容</a>

  <!-- ✅ 语义：使用 header/nav/main/footer -->
  <header>
    <!-- ✅ 品牌链接有文字（不用纯图标）-->
    <a href="/" class="logo" aria-label="阿基米德实验室 首页">⚗️ 阿基米德实验室</a>

    <!-- ✅ nav + aria-label 区分多个导航 -->
    <nav aria-label="主导航">
      <ul>
        <li><a href="/tools">AI 工具</a></li>
        <li><a href="/prompt" aria-current="page">提示词助手</a></li>
        <li><a href="/blog">博客</a></li>
        <li><a href="/about">关于</a></li>
      </ul>
    </nav>
  </header>

  <!-- ✅ main：页面主体，id 供跳转链接使用 -->
  <main id="mainContent">
    <div class="hero">
      <!-- ✅ 每页只有一个 h1 -->
      <h1>AI 提示词优化助手</h1>
      <p>输入原始提示词，AI 自动优化结构、补充细节、提升输出质量</p>
    </div>

    <!-- ✅ 工具卡片列表（使用 article 表示可独立内容） -->
    <div class="tool-grid" role="list">
      <article class="tool-card" role="listitem">
        <h2>提示词优化</h2>
        <!-- ✅ 图片有 alt 文字（或 alt="" 表示纯装饰）-->
        <img src="/icons/optimize.svg" alt="" width="40" height="40" loading="lazy">
        <p>输入模糊提示词，AI 自动补充上下文、角色、输出格式，提升 3–5 倍效果。</p>
        <a href="/prompt/optimize" class="card-btn" aria-label="前往提示词优化工具">立即使用</a>
      </article>

      <article class="tool-card" role="listitem">
        <h2>提示词模板库</h2>
        <img src="/icons/library.svg" alt="" width="40" height="40" loading="lazy">
        <p>300+ 经过测试的提示词模板，覆盖写作、代码、分析、翻译等场景。</p>
        <a href="/prompt/library" class="card-btn" aria-label="浏览提示词模板库">浏览模板</a>
      </article>

      <article class="tool-card" role="listitem">
        <h2>多模型对比</h2>
        <img src="/icons/compare.svg" alt="" width="40" height="40" loading="lazy">
        <p>同一提示词在 Claude / GPT-4 / Gemini 上的输出对比，找到最适合你场景的模型。</p>
        <a href="/prompt/compare" class="card-btn" aria-label="开始多模型对比测试">开始对比</a>
      </article>
    </div>
  </main>

  <!-- ✅ 语义：footer 含版权和辅助链接 -->
  <footer>
    <p>© 2024 阿基米德实验室 · 不聊概念，只做实验</p>
    <nav aria-label="页脚导航" style="margin-top:10px">
      <a href="/privacy" style="color:#555;margin:0 12px">隐私政策</a>
      <a href="/terms"   style="color:#555;margin:0 12px">使用条款</a>
      <a href="/sitemap.xml" style="color:#555;margin:0 12px">站点地图</a>
    </nav>
  </footer>

  <!-- ✅ 性能：JS 放 body 末尾，加 defer（延迟执行，不阻塞 HTML 解析）-->
  <!-- ✅ 安全：加 nonce（匹配 CSP 中的 nonce-RANDOM123）-->
  <script src="/js/app.js" defer nonce="RANDOM123"></script>

  <!-- ✅ 安全：第三方 JS 加 integrity + crossorigin（SRI 子资源完整性）-->
  <script
    src="https://cdn.jsdelivr.net/npm/marked@9/marked.min.js"
    integrity="sha384-XXXX"
    crossorigin="anonymous"
    defer
  ></script>

  <!-- JSON-LD 结构化数据 -->
  <script type="application/ld+json" nonce="RANDOM123">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI 提示词助手",
    "url": "https://lab.archimedes.ai/prompt-tool",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser"
  }
  </script>

</body>
</html>
```

---

## 🔍 逐行解析

**`lang="zh-CN"`**
告知浏览器、屏幕阅读器、翻译插件页面语言。缺失时屏幕阅读器可能用错误发音引擎朗读中文。

**CSP `nonce`**
每次请求生成随机字符串（服务端填入 HTML），只有带匹配 nonce 的脚本才能执行，从根本上阻止注入的 JS 运行。

**`<link rel="preconnect">`**
提前完成 TCP 握手 + TLS 协商（约 100–300ms），让后续 fetch 请求更快。只对关键 API 域名使用，过多反而浪费连接资源。

**`<img loading="lazy"`**
非首屏图片延迟加载，浏览器进入视口前不发起请求，节省带宽，提升 FCP 指标。

**`integrity` + `crossorigin`**
SRI（子资源完整性）：浏览器验证 CDN 返回的文件哈希值，防止 CDN 被劫持时注入恶意代码。

---

## 🌐 浏览器表现

| 配置 | 效果 |
|------|------|
| `defer` | JS 下载与 HTML 解析并行，页面渲染不被阻塞 |
| `preconnect` | 首个 API 请求延迟降低 100–300ms |
| `loading="lazy"` | 非首屏图片按需加载，节省 40–60% 图片请求 |
| CSP | 浏览器控制台显示 CSP 违规报告，阻止不合规资源 |
| `lang` | 浏览器翻译功能自动识别，屏幕阅读器使用正确发音 |

---

## 📦 常见属性/API

| 最佳实践分类 | 实践条目 | 说明 |
|------------|---------|------|
| **性能** | `<script defer>` | JS 延迟执行，不阻塞 HTML 解析 |
| **性能** | `<link rel="preconnect">` | 提前建立 API / CDN TCP+TLS 连接 |
| **性能** | `<img loading="lazy">` | 非首屏图片懒加载 |
| **安全** | `Content-Security-Policy` meta | 限制可加载的脚本/样式/接口来源 |
| **安全** | `X-Frame-Options: DENY` | 防止页面被嵌入 iframe（点击劫持） |
| **安全** | `integrity` + `crossorigin` | SRI 子资源完整性校验第三方 CDN 资源 |
| **语义** | `lang="zh-CN"` | 声明页面语言，影响翻译/朗读/SEO |
| **语义** | 唯一 `<h1>` | 每页只有一个 h1，表达最重要的主题 |
| **语义** | `<header>/<main>/<footer>` | 用语义标签代替通用 div |
| **可维护性** | 注释分块 | 大段 HTML 用 `<!-- 区块名 -->` 注释分隔 |
| **可维护性** | CSS/JS 分离 | 避免大量内联样式和事件属性（onclick="..."） |
| **无障碍** | `aria-label` / `aria-current` | 给导航项、按钮提供明确的名称和状态 |
| **无障碍** | `.skip-link` | 键盘用户可跳过导航到主内容 |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. `defer` vs `async` vs 无属性**

```html
<!-- 无属性：阻塞解析，页面白屏等待 JS（除非 JS 体积极小）-->
<script src="app.js"></script>

<!-- defer：与 HTML 解析并行下载，解析完成后按顺序执行 ✅ 推荐 -->
<script src="app.js" defer></script>

<!-- async：并行下载，下载完立即执行（乱序）→ 适合无依赖的独立脚本 -->
<script src="analytics.js" async></script>
```

**2. 图片必须有 `alt` 属性**

```html
<!-- ❌ 没有 alt，屏幕阅读器读文件名，SEO 丢分 -->
<img src="logo.png">

<!-- ✅ 有内容的图片写描述 -->
<img src="rag-diagram.png" alt="RAG 系统流程图：用户提问→检索→LLM生成">

<!-- ✅ 装饰性图片用 alt="" 跳过朗读 -->
<img src="divider.svg" alt="">
```

**3. 内联样式/脚本限制在最小范围**

```html
<!-- ❌ 滥用内联事件 → 难以维护，且违反 CSP -->
<button onclick="document.getElementById('box').style.display='none'">关闭</button>

<!-- ✅ 行为放 JS 文件，结构与逻辑分离 -->
<button id="closeBtn" aria-label="关闭">关闭</button>
<script defer>
  document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('box').hidden = true;
  });
</script>
```

---

## ⚠️ 易错点

| 错误 | 正确做法 |
|------|---------|
| `<script>` 放在 `<head>` 无 `defer` | 放 `</body>` 前或加 `defer` |
| 多个 `<h1>` | 每页唯一 `<h1>`，下级用 `<h2>`–`<h6>` |
| `<img>` 缺少 `width`/`height` | 声明尺寸防止布局偏移（CLS 指标） |
| 密码/Token 写在 HTML 注释里 | HTML 注释对用户可见，绝不放敏感信息 |
| `innerHTML = userInput` | XSS 注入，改用 `textContent` 或 DOMPurify |
| 所有 `<a>` 都用 `target="_blank"` | 加 `rel="noopener noreferrer"` 防 tabnapping 攻击 |

---

## 💡 最佳实践

1. **HTML 校验**：用 [W3C Validator](https://validator.w3.org/) 定期检查，CI 流程中可集成 `html-validate`
2. **性能审计**：用 Chrome DevTools Lighthouse 分析 FCP / LCP / CLS 指标
3. **安全审计**：用 [Security Headers](https://securityheaders.com/) 检查响应头
4. **无障碍审计**：用 Chrome 扩展 [axe DevTools](https://www.deque.com/axe/) 自动扫描 ARIA 问题

---

## 🚀 AI 应用场景

### 场景 1：用 Claude 审查 HTML 代码质量——可直接使用的 Prompt 模板

```text
[HTML 代码质量审查 Prompt]

你是一名资深前端工程师，专注于 HTML 代码质量。请对以下 HTML 代码进行全面审查，
并按照以下维度逐条列出问题，每条说明：问题描述、严重程度（高/中/低）、修复建议。

审查维度：
1. 语义化：是否正确使用 HTML5 语义标签（header/main/article/section 等）？
   - 是否有多余的 div/span 可替换为语义标签？
   - heading 层级是否正确（h1 唯一，h2-h6 顺序递进）？

2. 性能：
   - script 标签是否有 defer/async？
   - 图片是否有 loading="lazy"？
   - 是否有不必要的 preload？

3. 安全：
   - 是否有 innerHTML 直接插入用户输入（XSS 风险）？
   - target="_blank" 链接是否有 rel="noopener noreferrer"？
   - 是否有 API Key 或敏感信息暴露在 HTML/注释中？

4. 无障碍：
   - img 是否都有 alt 属性？
   - 表单 label 是否关联 input（for + id）？
   - 按钮/链接是否有可理解的文字或 aria-label？
   - 颜色对比度是否足够（需要观察 CSS 颜色值）？
   - 是否有 aria-live 用于动态内容区域？

5. 可维护性：
   - 是否有大量内联样式（style 属性）？
   - 是否有内联事件处理（onclick="..."）？
   - 代码结构是否清晰，有无注释说明复杂区块？

以下是需要审查的 HTML 代码：
---
[在此粘贴你的 HTML 代码]
---

请以 Markdown 格式输出，每个维度一个标题，问题用列表呈现。
最后给出一个总体评分（满分 10 分）和优先修复建议（不超过 3 条）。
```

---

### 场景 2：AI 生成 HTML 代码时的常见质量问题清单

以下是使用 ChatGPT / Claude 生成 HTML 时频繁出现的问题，使用 AI 代码时务必检查：

```js
// AI 生成 HTML 代码质量自检函数
function auditAIGeneratedHTML(htmlString) {
  const issues = [];
  const parser = new DOMParser();
  const doc    = parser.parseFromString(htmlString, 'text/html');

  // ── 检查项 1：lang 属性 ──────────────────────────────────
  if (!doc.documentElement.hasAttribute('lang')) {
    issues.push({ severity: '高', desc: '<html> 缺少 lang 属性', fix: '加 lang="zh-CN"' });
  }

  // ── 检查项 2：多个 h1 ────────────────────────────────────
  const h1s = doc.querySelectorAll('h1');
  if (h1s.length > 1) {
    issues.push({ severity: '中', desc: `页面有 ${h1s.length} 个 h1`, fix: '只保留一个 h1，其余改为 h2' });
  }

  // ── 检查项 3：img 缺少 alt ───────────────────────────────
  doc.querySelectorAll('img').forEach((img, i) => {
    if (!img.hasAttribute('alt')) {
      issues.push({ severity: '高', desc: `第 ${i+1} 个 img 缺少 alt 属性`, fix: '有意义的图片写描述，装饰性图片写 alt=""' });
    }
  });

  // ── 检查项 4：script 无 defer/async ─────────────────────
  doc.querySelectorAll('script[src]').forEach((s, i) => {
    if (!s.hasAttribute('defer') && !s.hasAttribute('async')) {
      issues.push({ severity: '中', desc: `第 ${i+1} 个外部 script 无 defer/async`, fix: '加 defer 属性' });
    }
  });

  // ── 检查项 5：target=_blank 无 rel ───────────────────────
  doc.querySelectorAll('a[target="_blank"]').forEach((a, i) => {
    if (!a.rel.includes('noopener')) {
      issues.push({ severity: '中', desc: `第 ${i+1} 个 target="_blank" 链接缺少 rel="noopener"`, fix: '加 rel="noopener noreferrer"' });
    }
  });

  // ── 检查项 6：form 无 label 关联 ─────────────────────────
  doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"])').forEach((inp, i) => {
    const id = inp.id;
    if (!id || !doc.querySelector(`label[for="${id}"]`)) {
      issues.push({ severity: '高', desc: `第 ${i+1} 个 input 无关联 label`, fix: '加 id，并用 <label for="id"> 关联' });
    }
  });

  // ── 检查项 7：button 无文字/aria-label ───────────────────
  doc.querySelectorAll('button').forEach((btn, i) => {
    const hasText  = btn.textContent.trim().length > 0;
    const hasLabel = btn.hasAttribute('aria-label');
    if (!hasText && !hasLabel) {
      issues.push({ severity: '高', desc: `第 ${i+1} 个 button 无文字且无 aria-label`, fix: '加文字内容或 aria-label' });
    }
  });

  // 输出报告
  if (issues.length === 0) {
    console.log('✅ 未发现常见问题');
    return;
  }

  console.group(`⚠️ 发现 ${issues.length} 个问题`);
  issues.forEach(({ severity, desc, fix }) => {
    const icon = severity === '高' ? '🔴' : severity === '中' ? '🟡' : '🟢';
    console.log(`${icon} [${severity}] ${desc}`);
    console.log(`   → 修复：${fix}`);
  });
  console.groupEnd();

  return issues;
}

// 使用示例
const aiGeneratedCode = `
<html>
<body>
  <h1>标题一</h1>
  <h1>标题二</h1>
  <img src="logo.png">
  <button onclick="doSomething()">→</button>
  <a href="https://x.com" target="_blank">Twitter</a>
  <script src="app.js"></script>
</body>
</html>
`;

auditAIGeneratedHTML(aiGeneratedCode);
```

---

## 📝 练习题

**题 1（基础）**：找出以下 HTML 片段中的所有问题（至少 5 个），并给出修复版本：

```html
<html>
<head><title>我的工具</title></head>
<body>
  <div class="header">
    <div class="nav">
      <div onclick="go('/')">首页</div>
      <div onclick="go('/tool')">工具</div>
    </div>
  </div>
  <div class="main">
    <h1>AI 工具</h1>
    <h1>产品介绍</h1>
    <img src="banner.jpg">
    <div class="content">...</div>
  </div>
  <script src="main.js"></script>
</body>
</html>
```

**题 2（进阶）**：为一个使用 CDN 引入 `vue.min.js` 的页面，添加 SRI 完整性校验（`integrity` + `crossorigin`）。查找 Vue 3 CDN 的 SHA-384 哈希值并写出完整的 `<script>` 标签。

**题 3（AI 场景）**：将本节"HTML 代码质量审查 Prompt 模板"应用于 HTML-025（iframe）的完整代码，把完整代码粘贴给 Claude，记录：发现了几个问题、哪些问题是真实 Bug、哪些是 Claude 的误判，写一份 200 字的审查报告。

---

## 📌 本节总结

| 维度 | 核心最佳实践 |
|------|------------|
| 性能 | `defer` 脚本 / `loading="lazy"` 图片 / `preconnect` 关键域名 |
| 安全 | CSP meta / `noopener` / SRI / 禁止 innerHTML + 用户输入 |
| 语义 | `lang` / 唯一 `h1` / 语义标签替代 div / `alt` 文字 |
| 可维护性 | 结构/样式/行为分离 / 注释分块 / 避免内联事件 |
| 无障碍 | `aria-label` / `label[for]` / 颜色对比度 / Skip Link |

掌握这五个维度的最佳实践，配合 AI 自动代码审查，能让你写出质量远超平均水平的 HTML。AI 会生成代码，但不会自动遵守所有最佳实践——这就是人类开发者的核心价值所在。

# HTML 知识树（HTML-901）

## 🎯 本节学习目标

- 建立 HTML-001 至 HTML-032 的完整知识地图
- 理清文档结构、文本语义、媒体、表单、高级专题之间的依赖关系
- 能够判断每个知识点在 AI Web 开发中的价值
- 为 CSS、JavaScript 和 React 模块学习建立前置索引

---

## 📖 什么是 HTML 知识树

HTML 知识树是一张学习地图。它把零散标签和概念按工程关系组织起来，帮助你知道先学什么、后学什么、哪里容易混淆。

本附录覆盖 HTML-001 到 HTML-032，共 32 篇正文。你可以把它当成复习清单、查漏补缺表，也可以当成后续写 AI 应用页面时的结构参考。

---

## 🧠 原理讲解

HTML 的学习顺序可以按三条主线理解：

```text
第一条：页面能不能被浏览器正确解析
DOCTYPE → html → head → meta/title → body

第二条：内容有没有清晰语义
h1~h6 → p → strong/em → ul/ol/li → table → HTML5 语义标签

第三条：用户能不能完成任务
a/img/video/audio → form/input/textarea/select/button → iframe → SEO/Accessibility/最佳实践
```

AI Web 应用并没有脱离这三条主线。聊天页面、提示词工具、RAG 知识库、模型控制台，本质上都是 HTML 结构、表单输入、内容展示和安全嵌入的组合。

---

## 🏗 基本结构

```text
HTML 模块
├── 001~005：入门与文档基础
├── 006~009：head/body 页面配置
├── 010~015：文本与内联语义
├── 016~020：链接、媒体、列表、表格、表单
├── 021~025：表单控件与 iframe
├── 026~032：媒体增强、语义化、SEO、无障碍、最佳实践、综合项目
└── 901~903：知识树、易错点、综合练习
```

---

## ✅ 完整代码

下面是一段最小 AI 页面骨架，串起 HTML 模块中的核心知识点：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="AI 助手页面示例，包含提示词输入和回答展示。">
  <title>AI 助手</title>
</head>
<body>
  <header>
    <h1>AI 助手</h1>
    <nav aria-label="主导航">
      <ul>
        <li><a href="#chat">对话</a></li>
        <li><a href="#history">历史</a></li>
      </ul>
    </nav>
  </header>

  <main id="chat">
    <section aria-labelledby="prompt-title">
      <h2 id="prompt-title">提示词输入</h2>
      <form action="/api/chat" method="post">
        <label for="prompt">请输入问题</label>
        <textarea id="prompt" name="prompt" rows="6" required></textarea>
        <button type="submit">发送</button>
      </form>
    </section>

    <section aria-labelledby="answer-title" aria-live="polite">
      <h2 id="answer-title">AI 回答</h2>
      <article>
        <p>这里显示模型返回的内容。</p>
      </article>
    </section>
  </main>

  <footer>
    <p>AI 页面 HTML 骨架示例。</p>
  </footer>
</body>
</html>
```

---

## 🔍 逐行解析

`DOCTYPE/html/head/body` 保证浏览器用标准方式解析页面。

`lang/charset/viewport/title/description` 让页面具备基础可读性、移动端适配和搜索摘要能力。

`header/nav/main/section/article/footer` 给页面建立语义骨架，让人、浏览器、屏幕阅读器和 AI 抓取器都能理解内容区域。

`form/label/textarea/button` 构成 AI 应用最常见的输入链路。

`aria-live="polite"` 为流式 AI 输出预留无障碍能力，后续 JavaScript 模块会让它真正动态更新。

---

## 🌐 浏览器表现

浏览器会按默认样式展示标题、导航列表、表单、文本区域和按钮。即使没有 CSS，页面也能提交表单、跳转锚点、展示层级。

这正是 HTML 的价值：先保证内容结构和交互语义成立，再用 CSS 美化，用 JavaScript 增强。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `<!DOCTYPE html>` | 声明 | 启用 HTML5 标准模式 | `<!DOCTYPE html>` |
| `lang` | 全局属性 | 声明内容语言 | `<html lang="zh-CN">` |
| `charset` | meta 属性 | 声明字符编码 | `<meta charset="UTF-8">` |
| `viewport` | meta 配置 | 移动端视口配置 | `width=device-width` |
| `href` | a/link 属性 | 链接目标 | `<a href="/docs">` |
| `src` | 媒体属性 | 资源地址 | `<img src="cover.jpg">` |
| `alt` | img 属性 | 图片替代文本 | `alt="流程图"` |
| `action` | form 属性 | 表单提交地址 | `action="/api/chat"` |
| `method` | form 属性 | 表单提交方法 | `method="post"` |
| `type` | input/button 属性 | 控件类型 | `type="submit"` |
| `required` | 表单属性 | 必填字段 | `<textarea required>` |
| `sandbox` | iframe 属性 | 限制嵌入页面权限 | `sandbox="allow-forms"` |
| `aria-label` | ARIA 属性 | 提供可访问名称 | `aria-label="主导航"` |
| `aria-live` | ARIA 属性 | 宣告动态内容更新 | `aria-live="polite"` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- HTML 先解决结构和语义，再交给 CSS 和 JavaScript 负责表现与交互
- AI 应用的输入区本质是表单，输出区本质是内容容器
- 语义标签、alt、label、aria 属性会直接影响可访问性和机器理解
- SEO、无障碍、安全和性能不是上线前补丁，而是 HTML 编写阶段就要考虑的基础质量

---

## ⚠️ 易错点

- 把 HTML 当成样式工具，用标题标签控制字号、用表格做布局
- 只写 placeholder 不写 label，导致表单可用性和无障碍体验下降
- AI 输出内容未经清洗直接插入页面，留下 XSS 风险
- iframe 缺少 sandbox，外部工具权限过大
- 图片、视频、音频没有替代文本或 fallback，加载失败后信息丢失

---

## 💡 最佳实践

- 写页面前先画结构树，再填具体标签
- 每个页面只保留一个最核心的 `<h1>`
- 表单字段优先用原生控件，少用 div 模拟控件
- 重要图片写具体 alt，装饰图片才使用空 alt
- AI 生成 HTML 后，必须二次 review 语义、安全和可访问性

---

## 🚀 AI 应用场景

HTML 知识树可以直接转成 AI 代码审查 Prompt，让模型按模块检查页面质量：

```text
请按以下 HTML 知识树审查我的页面：
1. 文档基础：DOCTYPE、lang、charset、viewport、title 是否完整。
2. 语义结构：header/main/section/footer 是否合理，标题层级是否跳级。
3. 表单输入：label、required、type、name 是否完整。
4. 媒体资源：img alt、video/audio fallback 是否存在。
5. 安全嵌入：iframe 是否使用 sandbox 和 title。
6. 无障碍：aria-label、aria-live、键盘可访问性是否满足基础要求。
7. AI 输出：是否避免直接渲染未经清洗的 HTML。

请输出：问题列表、风险等级、修复建议和修复后的代码片段。
```

---

## 📝 练习题

1. [基础题] 按知识树画出一个 AI 聊天页面的 HTML 结构，不需要写完整内容。
2. [基础题] 找出 `head` 里至少 5 个必须或常用配置项，并说明作用。
3. [进阶题] 把一个全是 div 的页面改造成语义化结构。
4. [进阶题] 为一个 AI 提示词表单补齐 label、name、required 和合理的 type。
5. [AI 场景题] 写一段 Prompt，让 AI 根据本知识树审查你写的 HTML 页面。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| 文档基础 | 决定浏览器能否正确解析页面 |
| head 配置 | 决定编码、移动端、标题、SEO 和分享效果 |
| 文本语义 | 决定内容层级和机器理解质量 |
| 表单系统 | 构成 AI 应用最常见的输入界面 |
| 媒体与 iframe | 支撑多模态展示和外部工具嵌入 |
| SEO/无障碍 | 让内容能被搜索、引用和更多用户访问 |
| 最佳实践 | 把 HTML 从能跑提升到可维护、可上线 |

### HTML-001~032 总览

| 编号 | 主题 | 重要程度 | AI 开发相关度 | 复习重点 |
|------|------|----------|---------------|----------|
| HTML-001 | HTML 简介 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | HTML 是 AI Web 界面的骨架 |
| HTML-002 | 第一个 HTML 页面 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 最小页面、编码、标题、内容 |
| HTML-003 | HTML 基本结构 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | DOCTYPE/html/head/body 层级 |
| HTML-004 | DOCTYPE 详解 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 标准模式与怪异模式 |
| HTML-005 | html 标签 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | lang、dir、多语言应用 |
| HTML-006 | head 标签 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 页面配置集中区 |
| HTML-007 | meta 标签 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | charset、viewport、SEO、OG |
| HTML-008 | title 标签 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 标签页标题、搜索标题、状态提示 |
| HTML-009 | body 标签 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 可见内容与页面事件 |
| HTML-010 | h1~h6 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 标题层级、Markdown 渲染 |
| HTML-011 | p | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 段落、流式输出文本 |
| HTML-012 | div | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 布局容器、消息气泡 |
| HTML-013 | span | ⭐⭐⭐ | ⭐⭐⭐⭐ | 内联高亮、关键词标注 |
| HTML-014 | strong | ⭐⭐⭐ | ⭐⭐⭐⭐ | 重要内容、Markdown 加粗 |
| HTML-015 | em | ⭐⭐⭐ | ⭐⭐⭐ | 强调语气、Markdown 斜体 |
| HTML-016 | a | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 引用来源、外链安全 |
| HTML-017 | img | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | AI 生成图展示、alt |
| HTML-018 | ul/ol/li | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | AI 结构化列表输出 |
| HTML-019 | table | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Markdown 表格、数据展示 |
| HTML-020 | form | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 提示词提交入口 |
| HTML-021 | input | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 文本、文件、范围、选项输入 |
| HTML-022 | textarea | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 长提示词编辑器 |
| HTML-023 | select | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 模型选择、配置选择 |
| HTML-024 | button | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 发送、停止、重置、复制 |
| HTML-025 | iframe | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 嵌入 AI 工具、安全沙盒 |
| HTML-026 | video | ⭐⭐⭐ | ⭐⭐⭐⭐ | AI 视频展示、字幕 |
| HTML-027 | audio | ⭐⭐⭐ | ⭐⭐⭐⭐ | TTS/STT 音频播放 |
| HTML-028 | HTML5 语义化 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | RAG 抓取、可访问结构 |
| HTML-029 | SEO | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | AI 内容站、搜索摘要 |
| HTML-030 | Accessibility | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | aria-live、键盘、读屏 |
| HTML-031 | HTML 最佳实践 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 安全、性能、质量审查 |
| HTML-032 | 综合项目 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | AI 提示词工具箱静态骨架 |

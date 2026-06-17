# 综合项目：AI 提示词工具箱（HTML-032）

## 🎯 本节学习目标

- 能够把 HTML-001 至 HTML-031 的核心知识整合到一个完整页面中
- 掌握静态 HTML 项目的文件组织、页面结构和语义分区
- 能够只使用 HTML 搭建「AI 提示词工具箱」的基础骨架
- 建立发布前自查习惯，检查语义、表单、媒体、iframe、SEO 和无障碍细节

---

## 📖 什么是综合项目

综合项目不是再学习一个新标签，而是把前面学过的 HTML 知识放到真实页面里一起使用。

本节要完成一个「AI 提示词工具箱」静态页面。它包含页面头部、导航、提示词输入区、模型选择、文件上传、提示词模板列表、AI 输出展示区、资源链接、iframe 预览区和页脚。

这一版项目**只写 HTML**，不写 CSS，也不写 JavaScript。这样做的目的，是让你先把页面骨架、内容层级、表单字段和语义结构搭稳。样式和交互会在 CSS、JavaScript 模块继续补上。

---

## 🧠 原理讲解

一个可维护的 HTML 页面，通常由三层结构组成：

```text
文档级结构：
DOCTYPE / html / head / body

页面级结构：
header / nav / main / section / aside / footer

功能级结构：
form / input / textarea / select / button / table / iframe / audio / video
```

综合项目的关键，不是把所有标签堆在一起，而是让每个标签承担明确职责：

- `<header>` 放产品名称、全局入口和页面介绍
- `<nav>` 放页面内导航或主要模块入口
- `<main>` 放当前页面独有的核心功能
- `<section>` 拆分功能区域
- `<form>` 收集用户输入
- `<label>` 绑定表单字段，提升可用性和无障碍体验
- `<iframe>` 嵌入 AI 小工具或预览页面，并通过 `sandbox` 控制风险
- `<table>` 承载结构化模板数据
- `<footer>` 放版权、帮助链接和补充说明

这类结构对 AI 应用尤其重要。浏览器、搜索引擎、屏幕阅读器、RAG 抓取器和代码生成工具，都会依赖清晰的 HTML 结构理解页面内容。

---

## 🏗 基本结构

AI 提示词工具箱的最小 HTML 骨架如下：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 提示词工具箱</title>
</head>
<body>
  <header>
    <h1>AI 提示词工具箱</h1>
    <p>管理提示词、模型选择、文件输入和输出预览。</p>
  </header>

  <main>
    <section aria-labelledby="prompt-editor-title">
      <h2 id="prompt-editor-title">提示词编辑器</h2>
      <form action="/api/prompts" method="post" enctype="multipart/form-data">
        <label for="prompt">提示词</label>
        <textarea id="prompt" name="prompt" rows="8" required></textarea>

        <label for="model">模型</label>
        <select id="model" name="model">
          <option value="gpt-4.1">GPT-4.1</option>
          <option value="claude-sonnet">Claude Sonnet</option>
        </select>

        <button type="submit">生成结果</button>
      </form>
    </section>
  </main>
</body>
</html>
```

---

## ✅ 完整代码

下面是一份只使用 HTML 的完整页面。你可以保存为 `index.html` 后直接用浏览器打开。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta
    name="description"
    content="一个只使用 HTML 搭建的 AI 提示词工具箱，用于管理提示词、模型选择、文件上传和结果预览。"
  >
  <meta property="og:title" content="AI 提示词工具箱">
  <meta
    property="og:description"
    content="整理提示词模板、上传上下文文件、选择模型，并预览 AI 输出结果。"
  >
  <meta property="og:type" content="website">
  <link rel="canonical" href="https://example.com/ai-prompt-toolbox">
  <title>AI 提示词工具箱</title>
</head>

<body>
  <a href="#main-content">跳到主要内容</a>

  <header>
    <h1>AI 提示词工具箱</h1>
    <p>把常用提示词、上下文文件、模型选择和输出结果集中管理。</p>

    <nav aria-label="页面导航">
      <ul>
        <li><a href="#prompt-editor">提示词编辑</a></li>
        <li><a href="#template-library">模板库</a></li>
        <li><a href="#result-preview">输出预览</a></li>
        <li><a href="#embed-preview">嵌入预览</a></li>
        <li><a href="#project-checklist">自查清单</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content">
    <section id="prompt-editor" aria-labelledby="prompt-editor-title">
      <h2 id="prompt-editor-title">提示词编辑区</h2>
      <p>填写任务目标、补充上下文，选择模型后提交给后端 AI 服务。</p>

      <form action="/api/prompts" method="post" enctype="multipart/form-data">
        <fieldset>
          <legend>任务基础信息</legend>

          <p>
            <label for="task-name">任务名称</label>
            <input
              id="task-name"
              name="taskName"
              type="text"
              maxlength="80"
              placeholder="例如：生成公众号文章大纲"
              required
            >
          </p>

          <p>
            <label for="task-type">任务类型</label>
            <select id="task-type" name="taskType" required>
              <option value="">请选择任务类型</option>
              <option value="writing">内容写作</option>
              <option value="coding">代码辅助</option>
              <option value="research">资料整理</option>
              <option value="summary">总结归纳</option>
              <option value="translation">翻译润色</option>
            </select>
          </p>

          <p>
            <label for="model">选择模型</label>
            <select id="model" name="model" required>
              <optgroup label="OpenAI">
                <option value="gpt-4.1">GPT-4.1</option>
                <option value="gpt-4.1-mini">GPT-4.1 mini</option>
              </optgroup>
              <optgroup label="Anthropic">
                <option value="claude-sonnet-4">Claude Sonnet 4</option>
                <option value="claude-opus-4">Claude Opus 4</option>
              </optgroup>
              <optgroup label="Google">
                <option value="gemini-pro">Gemini Pro</option>
              </optgroup>
            </select>
          </p>
        </fieldset>

        <fieldset>
          <legend>提示词正文</legend>

          <p>
            <label for="system-prompt">系统提示词</label>
            <textarea
              id="system-prompt"
              name="systemPrompt"
              rows="6"
              placeholder="定义 AI 的角色、边界、输出风格和禁止事项。"
            ></textarea>
          </p>

          <p>
            <label for="user-prompt">用户提示词</label>
            <textarea
              id="user-prompt"
              name="userPrompt"
              rows="10"
              placeholder="写清楚任务目标、背景、输入材料和期望输出格式。"
              required
            ></textarea>
          </p>

          <p>
            <label for="context-file">上传上下文文件</label>
            <input
              id="context-file"
              name="contextFile"
              type="file"
              accept=".txt,.md,.pdf,.docx"
            >
          </p>
        </fieldset>

        <fieldset>
          <legend>输出偏好</legend>

          <p>
            <label for="output-format">输出格式</label>
            <select id="output-format" name="outputFormat">
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
              <option value="json">JSON</option>
              <option value="plain-text">纯文本</option>
            </select>
          </p>

          <p>
            <label for="temperature">创造性强度</label>
            <input
              id="temperature"
              name="temperature"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value="0.7"
            >
          </p>

          <p>
            <input id="save-template" name="saveTemplate" type="checkbox" value="yes">
            <label for="save-template">保存为常用提示词模板</label>
          </p>
        </fieldset>

        <p>
          <button type="submit">生成 AI 输出</button>
          <button type="reset">清空表单</button>
        </p>
      </form>
    </section>

    <section id="template-library" aria-labelledby="template-library-title">
      <h2 id="template-library-title">提示词模板库</h2>
      <p>用表格保存常用提示词，方便后续迁移到数据库或知识库系统。</p>

      <table>
        <caption>常用 AI 提示词模板</caption>
        <thead>
          <tr>
            <th scope="col">模板名称</th>
            <th scope="col">适用场景</th>
            <th scope="col">推荐模型</th>
            <th scope="col">关键输入</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">文章大纲生成器</th>
            <td>公众号、博客、课程文章</td>
            <td>Claude Sonnet 4</td>
            <td>主题、受众、观点、案例</td>
          </tr>
          <tr>
            <th scope="row">代码审查助手</th>
            <td>前端组件、接口调用、错误处理</td>
            <td>GPT-4.1</td>
            <td>代码片段、预期行为、报错信息</td>
          </tr>
          <tr>
            <th scope="row">会议纪要整理器</th>
            <td>访谈、项目会议、复盘讨论</td>
            <td>Gemini Pro</td>
            <td>原始记录、参会人、待办格式</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="result-preview" aria-labelledby="result-preview-title">
      <h2 id="result-preview-title">AI 输出预览</h2>
      <p>真实项目中，这里会由 JavaScript 接收接口返回内容并逐步渲染。</p>

      <article aria-labelledby="sample-result-title">
        <h3 id="sample-result-title">示例输出：公众号文章大纲</h3>
        <p><strong>标题建议：</strong>为什么 AI 工具越多，越需要自己的提示词系统</p>
        <ol>
          <li>从工具收藏夹到工作流资产</li>
          <li>提示词模板如何减少重复沟通</li>
          <li>如何给不同模型准备不同上下文</li>
          <li>如何复盘一次 AI 输出质量</li>
        </ol>
        <blockquote>
          <p>好的提示词不是一句神奇咒语，而是一套可复用的任务说明书。</p>
        </blockquote>
      </article>

      <aside aria-labelledby="result-note-title">
        <h3 id="result-note-title">输出区注意事项</h3>
        <ul>
          <li>流式输出时要配合 `aria-live`，让屏幕阅读器知道内容正在更新。</li>
          <li>AI 返回 Markdown 时，渲染成 HTML 前必须做安全过滤。</li>
          <li>代码块需要保留语言信息，方便后续高亮和复制。</li>
        </ul>
      </aside>
    </section>

    <section id="media-materials" aria-labelledby="media-materials-title">
      <h2 id="media-materials-title">多模态素材区</h2>
      <p>当 AI 任务涉及图片、音频或视频时，可以用 HTML 媒体标签提供预览。</p>

      <figure>
        <img
          src="https://example.com/assets/prompt-workflow.png"
          alt="AI 提示词从输入、模型处理到结果输出的流程图"
          loading="lazy"
          width="960"
          height="540"
        >
        <figcaption>提示词工具箱的基础工作流示意图。</figcaption>
      </figure>

      <figure>
        <video controls preload="metadata" poster="https://example.com/assets/demo-poster.jpg">
          <source src="https://example.com/assets/ai-tool-demo.mp4" type="video/mp4">
          您的浏览器不支持 video 标签。
        </video>
        <figcaption>AI 工具演示视频预览。</figcaption>
      </figure>

      <figure>
        <audio controls preload="metadata">
          <source src="https://example.com/assets/prompt-reading.mp3" type="audio/mpeg">
          您的浏览器不支持 audio 标签。
        </audio>
        <figcaption>提示词朗读音频预览。</figcaption>
      </figure>
    </section>

    <section id="embed-preview" aria-labelledby="embed-preview-title">
      <h2 id="embed-preview-title">iframe 嵌入预览</h2>
      <p>可以把外部 AI 小工具嵌入到当前知识库页面中，但必须限制权限。</p>

      <iframe
        src="https://example.com/embed/ai-helper"
        title="AI 提示词助手嵌入预览"
        width="100%"
        height="480"
        loading="lazy"
        sandbox="allow-forms allow-scripts"
        referrerpolicy="no-referrer"
      >
        <p>
          当前浏览器不支持 iframe。
          <a href="https://example.com/embed/ai-helper">打开 AI 提示词助手</a>
        </p>
      </iframe>
    </section>

    <section id="project-structure" aria-labelledby="project-structure-title">
      <h2 id="project-structure-title">项目文件组织</h2>
      <p>本节只创建 HTML 文件。后续模块会逐步加入 CSS、JavaScript 和构建工具。</p>

      <pre><code>ai-prompt-toolbox/
├── index.html
├── README.md
├── assets/
│   ├── images/
│   ├── audio/
│   └── video/
└── docs/
    └── prompt-template-notes.md</code></pre>
    </section>

    <section id="project-checklist" aria-labelledby="project-checklist-title">
      <h2 id="project-checklist-title">项目自查清单</h2>

      <ul>
        <li>页面是否包含 `<!DOCTYPE html>`、`lang`、`charset`、`viewport` 和 `title`。</li>
        <li>主内容是否放在 `<main>` 中，并且每个功能区都有清晰标题。</li>
        <li>表单字段是否都有 `<label>`，必填项是否使用 `required`。</li>
        <li>文件上传是否限制了合理的 `accept` 类型。</li>
        <li>表格是否包含 `<caption>`、`thead`、`tbody` 和 `scope`。</li>
        <li>图片是否有有效 `alt`，媒体是否有 fallback 文案。</li>
        <li>iframe 是否设置 `title`、`sandbox`、`loading` 和 `referrerpolicy`。</li>
        <li>AI 输出区域是否为后续 `aria-live` 和安全渲染预留位置。</li>
        <li>页面是否已经清理所有临时占位内容，保证每个区域都有真实文案。</li>
      </ul>
    </section>
  </main>

  <footer>
    <p>© 2026 阿基米德 AI 实验室。用于前端教材 HTML 综合项目演示。</p>
    <p>
      <a href="/privacy">隐私说明</a>
      <a href="/terms">使用条款</a>
      <a href="/help">帮助中心</a>
    </p>
  </footer>
</body>
</html>
```

---

## 🔍 逐行解析

`<!DOCTYPE html>` 声明使用 HTML5 标准模式，避免浏览器进入怪异模式。

`<html lang="zh-CN">` 告诉浏览器、翻译工具和屏幕阅读器：这个页面主要使用简体中文。

`<meta charset="UTF-8">` 设置字符编码，防止中文乱码。

`<meta name="viewport">` 是移动端页面的基础配置。如果缺失，手机浏览器可能会按桌面宽度缩放页面。

`<meta name="description">` 和 Open Graph 标签服务于搜索引擎、社交分享和内容卡片生成。

`<a href="#main-content">跳到主要内容</a>` 是无障碍跳转链接，方便键盘用户跳过重复导航。

`<header>` 包含产品名称、简介和导航。这里的 `<h1>` 是页面最高级标题。

`<nav aria-label="页面导航">` 明确说明导航用途，避免页面中存在多个导航时语义不清。

`<main id="main-content">` 包裹当前页面最核心的功能：提示词编辑、模板库、输出预览和嵌入预览。

`<section aria-labelledby="...">` 让功能区与标题建立关联，屏幕阅读器能读出更清楚的区域名称。

`<form action="/api/prompts" method="post" enctype="multipart/form-data">` 表示表单会以 POST 方式提交，并支持文件上传。

`<fieldset>` 和 `<legend>` 把表单分组，适合字段较多的 AI 工具配置页。

`<label for="...">` 与字段 `id` 对应，点击标签也能聚焦输入框。

`<textarea>` 用于长提示词输入，比 `<input type="text">` 更适合多段任务说明。

`<select>`、`<optgroup>` 和 `<option>` 组成模型选择器，可按供应商分组。

`<input type="file" accept=".txt,.md,.pdf,.docx">` 限制上传文件类型，但这只是前端提示，服务端仍需验证。

`<input type="range">` 用于选择创造性强度，后续可映射到模型参数 `temperature`。

`<table>` 展示结构化模板数据，`caption` 说明表格主题，`scope` 帮助读屏软件理解表头关系。

`<article>` 表示一段独立输出结果，适合承载 AI 生成的文章、摘要或回答。

`<aside>` 放补充提醒，不干扰主流程。

`<figure>`、`<figcaption>`、`<img>`、`<video>`、`<audio>` 用于多模态素材预览。

`<iframe>` 嵌入外部 AI 工具。`sandbox` 控制权限，`title` 说明嵌入内容，`referrerpolicy` 降低来源信息泄露。

`<pre><code>` 展示项目目录结构。`pre` 保留换行和缩进，`code` 表示代码或命令式文本。

`<footer>` 放版权、条款、隐私和帮助入口。

---

## 🌐 浏览器表现

由于本项目没有 CSS，浏览器会使用默认样式渲染页面：

- 标题会按 `<h1>`、`<h2>`、`<h3>` 自动形成字号层级
- 表单控件会显示为浏览器默认输入框、下拉框、按钮和文件选择器
- 表格会按默认边距显示，但没有边框样式
- 图片、视频、音频和 iframe 会根据属性加载外部资源
- 页面内导航点击后会跳转到对应 `id` 区域

这正好适合 HTML 学习阶段：先观察默认结构，再进入 CSS 模块学习如何控制布局、颜色、间距和响应式。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `lang` | 全局属性 | 声明页面或局部内容语言 | `<html lang="zh-CN">` |
| `id` | 全局属性 | 定义唯一标识，可用于锚点和 label 关联 | `<main id="main-content">` |
| `aria-labelledby` | ARIA 属性 | 用某个标题元素命名当前区域 | `<section aria-labelledby="title">` |
| `action` | form 属性 | 表单提交目标地址 | `<form action="/api/prompts">` |
| `method` | form 属性 | 表单提交方法 | `method="post"` |
| `enctype` | form 属性 | 表单编码方式，上传文件时需要 | `multipart/form-data` |
| `for` | label 属性 | 绑定表单字段 id | `<label for="prompt">` |
| `required` | 表单属性 | 标记必填字段 | `<textarea required>` |
| `maxlength` | 表单属性 | 限制最大输入长度 | `maxlength="80"` |
| `accept` | file 属性 | 限制文件选择类型 | `accept=".txt,.md,.pdf"` |
| `scope` | th 属性 | 标明表头作用范围 | `<th scope="col">` |
| `alt` | img 属性 | 图片替代文本 | `alt="提示词流程图"` |
| `loading` | img/iframe 属性 | 控制懒加载 | `loading="lazy"` |
| `sandbox` | iframe 属性 | 限制嵌入页面权限 | `sandbox="allow-forms"` |
| `referrerpolicy` | 资源属性 | 控制 Referer 发送策略 | `referrerpolicy="no-referrer"` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 综合页面先看结构，不要急着写样式和交互
- 表单字段必须用 `label` 明确命名，尤其是 AI 工具这类输入密集页面
- AI 输出内容最终会变成 HTML 节点，必须提前考虑语义、安全和无障碍
- iframe 嵌入外部 AI 工具时，要默认收紧权限，再按需开放
- 项目文件组织要为后续 CSS、JS、资源和文档扩展留出位置

---

## ⚠️ 易错点

- 易错点1：把整个页面都写成 `<div>`，没有语义层级。正确写法：用 `header/main/section/footer` 拆分区域。
- 易错点2：表单只有 placeholder，没有 label。正确写法：每个输入控件都配套 `<label for="字段id">`。
- 易错点3：文件上传只在前端写 `accept` 就认为安全。正确写法：前端限制 + 服务端校验文件类型、大小和内容。
- 易错点4：iframe 不写 `sandbox`。正确写法：先写 `sandbox`，再只添加必要权限。
- 易错点5：AI 输出区域直接渲染未经处理的 HTML。正确写法：后续用安全的 Markdown/HTML 渲染流程过滤危险标签和属性。

---

## 💡 最佳实践

- 先写页面大纲：标题、导航、主要区域、页脚，再补细节标签
- 表单按任务信息、提示词正文、输出偏好分组，降低认知负担
- 对所有媒体资源写 fallback 文案，保证加载失败时仍能理解内容
- 用 `caption`、`scope`、`alt`、`title`、`aria-labelledby` 补足机器可读信息
- 项目目录从第一天就分清 HTML、资源、文档，后续扩展时更稳

---

## 🚀 AI 应用场景

这个综合项目就是一个 AI 应用的 HTML 原型。虽然现在没有 CSS 和 JavaScript，但它已经定义了后续开发所需的关键界面契约：

- `taskName`：任务名称，可用于保存历史记录
- `taskType`：任务类型，可用于选择不同系统提示词
- `model`：模型选择，可映射到不同 API Provider
- `systemPrompt`：系统提示词，可控制 AI 角色和边界
- `userPrompt`：用户提示词，是真正提交给模型的任务说明
- `contextFile`：上下文文件，后续可接入 RAG、文档解析或多模态输入
- `outputFormat`：输出格式，可影响后端提示词和渲染策略
- `temperature`：创造性强度，可映射到模型参数

示例：后续 JavaScript 可以按这些字段组装请求体。

```json
{
  "taskName": "生成公众号文章大纲",
  "taskType": "writing",
  "model": "claude-sonnet-4",
  "systemPrompt": "你是一个中文内容策划助手。",
  "userPrompt": "请围绕 AI 提示词管理写一份文章大纲。",
  "outputFormat": "markdown",
  "temperature": 0.7
}
```

在真实 AI Web 应用里，HTML 的作用不是负责「智能」，而是负责把任务输入、上下文、模型配置和输出区域清楚地摆出来。HTML 写得越清晰，后续 CSS 布局、JavaScript 交互和 AI 接口对接就越顺。

---

## 📝 练习题

1. [基础题] 在完整代码中新增一个「输出语言」下拉框，选项包含中文、英文、日文，并为它添加正确的 `label`。
2. [基础题] 给模板库表格新增一行「小红书标题生成器」，并补齐适用场景、推荐模型和关键输入。
3. [进阶题] 为 AI 输出预览区新增一个 `<section>`，展示「历史生成记录」，要求使用有序列表。
4. [进阶题] 把文件上传区域扩展为两个字段：一个上传参考资料，一个上传图片素材，并分别设置合理的 `accept`。
5. [AI 场景题] 设计一个适合「代码解释助手」的表单字段结构，至少包含代码输入、编程语言、解释深度和输出格式。
6. [AI 场景题] 说明为什么 AI 输出内容不能直接作为 HTML 插入页面，并写出至少 3 条安全检查规则。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| 综合项目 | 用真实页面把零散标签组织成可运行的 HTML 骨架 |
| 语义结构 | `header/main/section/footer` 让页面层级更清楚 |
| 表单设计 | `form/fieldset/label/input/textarea/select/button` 构成 AI 输入界面 |
| 模板库 | `table/caption/th/scope` 适合展示结构化提示词资产 |
| 多模态预览 | `img/video/audio` 可以承载 AI 图片、视频和语音素材 |
| iframe | 可嵌入外部 AI 工具，但必须控制权限 |
| 项目组织 | 清晰目录能支撑后续 CSS、JS、资源和文档扩展 |

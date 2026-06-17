# 第一个 HTML 页面（HTML-002）

---

## 🎯 本节学习目标

1. 能够从零搭建一个 AI 聊天界面 HTML 原型，并在浏览器中成功运行
2. 理解 `file://` 协议与 `http://` 协议的差异，以及 Live Server 的作用
3. 掌握 VS Code + Live Server 的基础开发工作流

---

## 📖 什么是"运行一个 HTML 文件"

写好的 HTML 文件本质上是一个**纯文本文件**，后缀名为 `.html`。要让它在浏览器中显示，有三种方式：

| 方式 | 操作 | 适用场景 | 限制 |
|------|------|----------|------|
| **双击打开** | 双击 `.html` 文件 | 快速预览静态页面 | 无法使用 AJAX、fetch 等网络请求 |
| **Live Server**（推荐） | VS Code 插件，点击"Go Live" | 开发阶段实时预览 | 需安装 VS Code 插件 |
| **本地服务器** | 如 `python -m http.server` | 接近真实环境测试 | 需要终端操作 |
| **部署到服务器** | 上传到 Vercel、GitHub Pages 等 | 正式发布 | 需要网络配置 |

**双击 vs Live Server vs 服务端的核心差异：**

- **双击**：使用 `file://` 协议，某些浏览器安全策略会阻止跨文件的资源加载（如外部 JS 库），`fetch()` 请求 AI API 会报 CORS 错误
- **Live Server**：使用 `http://localhost:端口` 协议，与正式服务器行为一致，支持所有现代 Web API
- **服务端**：线上真实环境，适合最终交付

---

## 🧠 原理讲解

**浏览器如何加载本地 HTML 文件**

当你双击一个 HTML 文件时，操作系统会调用默认浏览器，并传入 `file:///Users/andymacbook/Desktop/index.html` 这样的路径（注意是三个斜杠）。

```text
用户双击 index.html
       ↓
操作系统调用浏览器，传入 file:// URL
       ↓
浏览器从本地磁盘读取文件内容（不经过网络）
       ↓
解析 HTML → 构建 DOM → 渲染页面
```

**`file://` 协议 vs `http://` 协议的关键差异：**

| 对比项 | `file://` 协议 | `http://` 协议 |
|--------|---------------|----------------|
| 来源 | 本地磁盘文件系统 | 网络服务器（含 localhost） |
| CORS 策略 | 严格，部分 API 受限 | 正常，符合标准规范 |
| `fetch()` 请求 | 被浏览器安全策略阻止 | 正常工作 |
| 相对路径加载 | 基于文件路径 | 基于 URL 路径 |
| Service Worker | 不支持 | 支持 |
| 热重载（实时刷新） | 不支持 | Live Server 支持 |

**Live Server 的工作原理：**

```text
VS Code 启动 Live Server
       ↓
在本地启动一个轻量 HTTP 服务器（默认端口 5500）
       ↓
监听文件变化（文件保存时触发）
       ↓
通过 WebSocket 通知浏览器自动刷新页面
```

---

## 🏗 基本结构

带 DOCTYPE、html、head、body 的最简 HTML 页面：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>我的第一个页面</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

---

## ✅ 完整代码

以下是一个带标题栏 + 消息气泡列表 + 输入框 + 发送按钮的 **AI 聊天界面骨架**（纯 HTML，无 CSS/JS）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI 聊天原型 - HTML 版</title>
  </head>
  <body>

    <!-- ===== 应用根容器 ===== -->
    <div id="app">

      <!-- 标题栏：显示 AI 名称和会话信息 -->
      <header id="chat-header">
        <h1>Claude AI 聊天助手</h1>
        <p>模型：Claude 3.7 Sonnet &nbsp;|&nbsp; 当前会话：第 1 次对话</p>
      </header>

      <!-- 消息列表区：展示历史对话气泡 -->
      <section id="messages" aria-label="对话记录">

        <!-- AI 欢迎消息 -->
        <article class="message ai-message">
          <h2>Claude</h2>
          <p>你好！我是 Claude，由 Anthropic 开发的 AI 助手。</p>
          <p>我可以帮你：写代码、分析数据、翻译文字、回答问题……</p>
          <time datetime="2026-06-16T10:00:00">10:00</time>
        </article>

        <!-- 用户消息 -->
        <article class="message user-message">
          <h2>你</h2>
          <p>请帮我写一个 Python 函数，计算斐波那契数列的第 n 项。</p>
          <time datetime="2026-06-16T10:01:00">10:01</time>
        </article>

        <!-- AI 回复（含代码） -->
        <article class="message ai-message">
          <h2>Claude</h2>
          <p>当然！这是一个使用递归 + 记忆化优化的斐波那契函数：</p>
          <pre><code>def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n &lt;= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]</code></pre>
          <time datetime="2026-06-16T10:01:05">10:01</time>
        </article>

      </section>

      <!-- 输入区：用户输入问题并发送 -->
      <footer id="input-area">
        <form id="chat-form" action="#" method="get">
          <label for="user-input">输入你的问题：</label>
          <textarea
            id="user-input"
            name="message"
            rows="3"
            cols="60"
            placeholder="发消息给 Claude（Shift+Enter 换行，Enter 发送）"
            autofocus
          ></textarea>
          <div id="toolbar">
            <button type="button" id="attach-btn">📎 上传文件</button>
            <button type="submit" id="send-btn">发送 ↑</button>
          </div>
        </form>
      </footer>

    </div>

  </body>
</html>
```

---

## 🔍 逐行解析

| 行/区块 | 代码 | 作用说明 |
|---------|------|----------|
| 1 | `<!DOCTYPE html>` | HTML5 文档类型声明，触发浏览器标准模式 |
| 2 | `<html lang="zh-CN">` | 根元素，`lang` 告知浏览器/屏幕阅读器页面语言 |
| 4 | `<meta charset="UTF-8" />` | 字符编码声明，确保中文、特殊符号正确渲染 |
| 5 | `<meta name="viewport" …>` | 移动端适配，防止手机页面缩小 |
| 6 | `<title>AI 聊天原型</title>` | 浏览器标签页标题，也是搜索结果显示的标题 |
| 12 | `<header id="chat-header">` | 语义化头部，对应聊天窗口的顶部标题栏 |
| 19 | `<section id="messages" aria-label="对话记录">` | 语义化区域，`aria-label` 为无障碍设备提供描述 |
| 22 | `<article class="message ai-message">` | 每条消息是一个独立 `article`，语义明确 |
| 24 | `<h2>Claude</h2>` | 消息发送者名称（二级标题） |
| 28 | `<time datetime="…">10:00</time>` | 语义化时间标签，`datetime` 属性为机器可读格式 |
| 37 | `<pre><code>…</code></pre>` | 代码块，`pre` 保留空格和换行，`code` 标记代码内容 |
| 38 | `n &lt;= 1` | `<` 符号转义为 `&lt;`，避免被解析为 HTML 标签 |
| 44 | `<footer id="input-area">` | 语义化底部，对应聊天界面的输入区域 |
| 45 | `<form id="chat-form">` | 将输入区包裹在表单中，便于后续 JS 监听 submit 事件 |
| 46 | `<label for="user-input">` | 关联输入框，点击 label 可聚焦对应输入框 |
| 48 | `<textarea … autofocus>` | 多行输入框，`autofocus` 让页面加载后自动聚焦 |
| 54 | `<button type="button">附件</button>` | `type="button"` 防止点击时触发表单提交 |
| 55 | `<button type="submit">发送</button>` | 提交按钮，触发表单 submit 事件 |

---

## 🌐 浏览器表现

在没有 CSS 的情况下，该页面在浏览器中的视觉效果：

- **标题栏**：`Claude AI 聊天助手` 以 `<h1>` 大字体显示，下方是模型信息段落
- **消息区**：三个 `<article>` 从上到下线性排列，每条消息包含发送者名称（`<h2>`）、正文段落、时间戳
- **代码块**：`<pre><code>` 以等宽字体（如 Courier New）显示，缩进完整保留
- **输入区**：标签"输入你的问题："在文本框左上方，文本框为 3 行高度，下方两个原始样式按钮
- **整体**：无布局，所有元素从上到下堆叠，内容可读但不美观

> 这就是 HTML 的本质：**结构和内容**，没有 CSS 就没有视觉设计，但结构是完整的。

---

## 📦 常见属性 / API

`<html>`、`<head>`、`<body>` 的主要属性：

| 元素 | 属性 | 示例 | 说明 |
|------|------|------|------|
| `<html>` | `lang` | `lang="zh-CN"` | 页面语言代码，影响 TTS、翻译功能 |
| `<html>` | `dir` | `dir="ltr"` | 文字方向，`ltr`（左到右）或 `rtl`（右到左） |
| `<html>` | `data-theme` | `data-theme="dark"` | 自定义主题属性，CSS 变量配合实现暗色模式 |
| `<head>` | —（无直接属性） | — | `<head>` 本身不常用属性，内部元素有各自属性 |
| `<meta>` | `charset` | `charset="UTF-8"` | 字符编码，必须放在 `<head>` 最前面 |
| `<meta>` | `name` + `content` | `name="description" content="…"` | 页面描述，用于 SEO 和搜索结果摘要 |
| `<meta>` | `name="viewport"` | `content="width=device-width"` | 移动端视口设置 |
| `<body>` | `onload` | `onload="init()"` | 页面加载完成后执行的 JS（现代开发推荐用 `addEventListener`） |
| `<body>` | `class` | `class="dark-mode"` | 通过切换 body 的 class 实现全局主题切换 |
| `<title>` | —（无属性） | `<title>AI 工具</title>` | 标签页标题，也是 bookmark 保存时的默认名称 |

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **Live Server 插件是前端开发必备工具**：在 VS Code 中安装 Live Server（作者：Ritwick Dey），右键 HTML 文件选择"Open with Live Server"，即可在浏览器中实时预览，保存文件自动刷新，告别手动刷新。

2. **`file://` vs `http://` 的区别决定了你能用哪些 Web API**：用双击打开本地 HTML 时，`fetch()` 请求 AI API 会因 CORS 策略失败；用 Live Server 或任何 HTTP 服务器则一切正常。开发 AI 应用时**必须用 Live Server**。

3. **文件编码必须设置为 UTF-8**：`<meta charset="UTF-8">` 是中文页面的必写项，缺少这一行，中文内容会显示为乱码。

---

## ⚠️ 易错点

**1. 文件编码问题：中文乱码**

```html
<!-- ❌ 缺少 charset 声明，中文可能乱码 -->
<head>
  <title>AI 聊天</title>
</head>

<!-- ✅ 正确：charset 放在 head 最前面 -->
<head>
  <meta charset="UTF-8" />
  <title>AI 聊天</title>
</head>
```

同时确保文件保存时也使用 UTF-8 编码（VS Code 右下角可查看/更改）。

**2. 文件后缀名错误**

```text
❌ index.txt      → 浏览器不会识别为 HTML 页面
❌ index.HTML     → 某些系统区分大小写，统一用小写
✅ index.html     → 标准写法，所有系统兼容
```

**3. 路径问题：图片/CSS/JS 加载失败**

```html
<!-- ❌ 绝对路径，换电脑或部署到服务器后失效 -->
<img src="C:\Users\andy\Desktop\logo.png" />

<!-- ✅ 相对路径，文件夹结构不变则始终有效 -->
<img src="./assets/logo.png" />
<link rel="stylesheet" href="./css/style.css" />
```

**4. 忘记保存文件就刷新浏览器**

Live Server 监听的是**磁盘上的文件**，必须先保存（`Ctrl+S` / `Cmd+S`）才能看到变化。VS Code 可以开启"自动保存"：File → Auto Save。

---

## 💡 最佳实践

**推荐工具链：VS Code + Live Server**

1. 安装 [VS Code](https://code.visualstudio.com/)
2. 在 VS Code 扩展市场搜索 **"Live Server"**（作者 Ritwick Dey），点击安装
3. 创建项目文件夹，如 `ai-chat-prototype/`
4. 在 VS Code 中打开该文件夹（File → Open Folder）
5. 新建 `index.html`，粘贴代码
6. 右键文件 → **Open with Live Server**，浏览器自动打开 `http://127.0.0.1:5500/index.html`
7. 修改代码后按 `Ctrl+S`，浏览器自动刷新

**推荐项目结构：**

```text
ai-chat-prototype/
├── index.html          # HTML 骨架
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 交互逻辑
└── assets/
    └── logo.svg        # 图片资源
```

---

## 🚀 AI 应用场景

### 场景 1：用 VS Code + Live Server 快速预览 AI 工具 HTML 原型

当你让 Claude 或 ChatGPT 生成了一个 HTML 界面原型时，本地运行的标准流程：

1. 向 AI 发送请求：`"帮我生成一个 AI 聊天界面的 HTML 原型，包含消息列表和输入框"`
2. 复制 AI 生成的完整 HTML 代码
3. 在 VS Code 中新建 `index.html`，粘贴代码
4. 右键 → Open with Live Server → 在浏览器预览
5. 发现问题后，继续向 AI 描述要修改的地方，获取更新代码

### 场景 2：用 Claude 生成的 HTML 搭建 Claude API 调试页面

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Claude API 调试器</title>
</head>
<body>
  <h1>Claude API 快速调试</h1>

  <div id="api-config">
    <label for="api-key">API Key：</label>
    <input type="password" id="api-key" placeholder="sk-ant-..." size="50" />
  </div>

  <div id="prompt-area">
    <label for="prompt-input">输入 Prompt：</label><br />
    <textarea id="prompt-input" rows="5" cols="70" placeholder="输入你的 prompt…"></textarea><br />
    <button id="send-btn" type="button" onclick="callClaudeAPI()">发送给 Claude</button>
  </div>

  <div id="response-area">
    <h2>Claude 的回复：</h2>
    <pre id="response-output">（等待回复…）</pre>
  </div>

  <script>
    async function callClaudeAPI() {
      const apiKey = document.getElementById('api-key').value.trim();
      const prompt = document.getElementById('prompt-input').value.trim();
      const outputEl = document.getElementById('response-output');

      if (!apiKey || !prompt) {
        outputEl.textContent = '请填写 API Key 和 Prompt！';
        return;
      }

      outputEl.textContent = '请求中，请稍候…';

      try {
        // 注意：直接在前端调用 API 会暴露 Key，仅用于本地调试
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-7-sonnet-20250219',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }]
          })
        });

        const data = await response.json();
        // 提取 AI 回复文本并显示
        outputEl.textContent = data.content?.[0]?.text || JSON.stringify(data, null, 2);
      } catch (err) {
        outputEl.textContent = '请求失败：' + err.message;
      }
    }
  </script>
</body>
</html>
```

> 将此文件用 Live Server 打开（`http://localhost:5500`），填入你的 Claude API Key 即可直接调试。**注意：此页面仅用于本地开发调试，不要部署到公网（会暴露 API Key）。**

---

## 📝 练习题

### 基础题

**题目 1：运行方式判断**

以下哪种情况**不需要** Live Server，哪种情况**必须**使用 Live Server？

```text
A. 纯静态 HTML + CSS 页面，只展示文字和图片，无 JS 请求
B. 需要调用 fetch() 请求外部 AI API
C. 使用了 Service Worker 做缓存
D. 只查看 HTML 结构（不需要交互）
```

<details>
<summary>参考答案</summary>

- 不需要 Live Server：A、D（纯静态内容双击即可预览）
- 必须使用 Live Server（或其他 HTTP 服务器）：B、C（涉及网络请求和 Service Worker）

</details>

---

### 进阶题

**题目 2：修正文件结构问题**

以下 HTML 有哪些可以改进的地方？（至少找出 3 点）

```html
<html>
<head>
<title>测试</title>
</head>
<body>
<H1>AI助手</H1>
<img src="D:\Users\andy\logo.png">
<p>欢迎使用
</body>
</html>
```

<details>
<summary>参考答案</summary>

1. 缺少 `<!DOCTYPE html>` 声明
2. `<html>` 缺少 `lang` 属性
3. 缺少 `<meta charset="UTF-8">`
4. `<H1>` 应改为小写 `<h1>`
5. `<img>` 使用了绝对路径，应改为相对路径
6. `<p>` 标签未闭合，应添加 `</p>`

</details>

---

### AI 场景题

**题目 3：搭建 Claude API 调试页面骨架**

仅用 HTML（无 CSS、无 JS 逻辑），为"Claude API 调试工具"创建一个完整的页面骨架，要求包含：

1. 页面标题（标签页名称）
2. 一个标题 `<h1>Claude API 调试器</h1>`
3. API Key 输入框（密码类型，带 label）
4. 模型选择下拉菜单（包含至少 2 个 Claude 模型选项）
5. Prompt 多行文本输入框（带 label 和 placeholder）
6. 发送按钮和清除按钮
7. 显示 API 响应的区域（带标题）

<details>
<summary>参考示例</summary>

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Claude API 调试器</title>
</head>
<body>
  <h1>Claude API 调试器</h1>

  <fieldset>
    <legend>API 配置</legend>
    <label for="api-key">API Key：</label>
    <input type="password" id="api-key" placeholder="sk-ant-..." size="50" />

    <br /><br />

    <label for="model-select">模型：</label>
    <select id="model-select">
      <option value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet</option>
      <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
      <option value="claude-opus-4-5">Claude Opus 4.5</option>
    </select>
  </fieldset>

  <fieldset>
    <legend>输入 Prompt</legend>
    <label for="system-prompt">系统提示词（System Prompt）：</label><br />
    <textarea id="system-prompt" rows="3" cols="70" placeholder="你是一个专业的 AI 助手…"></textarea>
    <br /><br />
    <label for="user-prompt">用户消息：</label><br />
    <textarea id="user-prompt" rows="5" cols="70" placeholder="输入你的问题…"></textarea>
    <br /><br />
    <button type="button" id="send-btn">发送 ↑</button>
    <button type="button" id="clear-btn">清除</button>
  </fieldset>

  <fieldset>
    <legend>API 响应</legend>
    <pre id="response-output">（等待响应…）</pre>
  </fieldset>
</body>
</html>
```

</details>

---

## 📌 本节总结

| 知识点 | 核心要点 |
|--------|----------|
| 运行 HTML 的三种方式 | 双击（file://）、Live Server（http://localhost）、部署到服务器 |
| `file://` vs `http://` | `file://` 下 `fetch()` 会被 CORS 拦截；开发 AI 应用必须用 HTTP 服务器 |
| Live Server 安装 | VS Code 扩展市场搜索"Live Server"（Ritwick Dey），安装后右键 HTML 文件启动 |
| 文件编码 | 必须在 `<head>` 最前面写 `<meta charset="UTF-8">`，文件本身也要以 UTF-8 保存 |
| 文件后缀 | 统一使用小写 `.html`，不要用 `.HTML` 或 `.txt` |
| 相对路径 | 引用 CSS、JS、图片时使用相对路径（`./css/style.css`），避免绝对路径 |
| AI 开发工作流 | AI 生成代码 → VS Code 粘贴 → Live Server 预览 → 发现问题 → 继续向 AI 提问 |

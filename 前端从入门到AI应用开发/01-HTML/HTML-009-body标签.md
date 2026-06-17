# `<body>` 标签（HTML-009）

## 🎯 本节学习目标

学完本节，你将能够：

- 理解 `<body>` 标签在 HTML 文档结构中的作用
- 掌握 `<body>` 的常用属性和事件处理器
- 区分 `DOMContentLoaded` 和 `window.onload` 的触发时机
- 用 `visibilitychange` 事件在 AI 应用中实现节能实践（页面隐藏时暂停 API 轮询）
- 用 `<body>` 的 `data-theme` 属性实现深浅色主题切换

---

## 📖 什么是 `<body>` 标签

`<body>` 标签定义了 HTML 文档中**用户可见的内容区域**。所有在浏览器窗口中显示的内容——文字、图片、按钮、表单、视频——都必须写在 `<body>` 内。

一个 HTML 文档只能有**一个** `<body>` 标签，它是 `<html>` 的直接子元素，与 `<head>` 并列：

```text
<html>
  ├── <head>   → 配置区（不可见）
  └── <body>   → 内容区（可见）
```

`<body>` 还承担另一个重要职责：作为**全局事件绑定点**。页面级别的生命周期事件（加载完成、关闭、滚动、尺寸变化）都挂在 `<body>` 或 `window` 上。

---

## 🧠 原理讲解

### 浏览器渲染 `<body>` 的流程

```text
HTML 解析完 <head>
    ↓
开始解析 <body>
    ├── 构建 DOM 树（将 HTML 元素转为 JS 可操作的节点树）
    ├── 遇到 <img>、<script> 等资源 → 发起网络请求（异步）
    ├── 结合 <head> 中的 CSS → 构建 CSSOM
    ├── DOM + CSSOM 合并 → Render Tree（渲染树）
    ├── Layout（布局计算：每个元素的大小和位置）
    └── Paint（像素绘制到屏幕）
        ↓
    触发 DOMContentLoaded（DOM 构建完成，图片可能未加载）
        ↓
    所有资源（图片、字体、iframe）加载完成
        ↓
    触发 window.load（load 事件）
```

### 三个关键生命周期事件

**1. `DOMContentLoaded`（最常用）**

DOM 树构建完成时触发。此时所有 HTML 元素都可用，但外部图片、字体可能还在下载。

**适合场景**：初始化 JS 逻辑、绑定事件、调用 API。

**2. `window.onload`（等待所有资源）**

页面上所有资源（图片、样式、脚本、字体、iframe）全部加载完成后触发。

**适合场景**：需要读取图片尺寸、操作 iframe 内容的场景。

**3. `beforeunload`（用户离开前）**

用户关闭标签页或导航离开时触发，可用于保存数据或询问用户是否确认离开。

```text
时间轴：
开始加载 HTML
    │
    ├── [HTML 解析完成]
    │         ↓
    │   DOMContentLoaded（DOM 就绪，图片未必加载完）
    │
    ├── [图片、字体、其他资源全部加载完]
    │         ↓
    │   window.load
    │
    │         ← 用户正常使用页面 →
    │
    └── [用户关闭/离开]
              ↓
        beforeunload → unload
```

---

## 🏗 基本结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>页面标题</title>
</head>
<body>
  <!-- 所有可见内容写在这里 -->
  <h1>欢迎</h1>
  <p>这是页面内容。</p>
</body>
</html>
```

`<body>` 标签本身很简洁，复杂度来自它内部的子元素和挂载其上的事件监听器。

---

## ✅ 完整代码

以下是一个 AI 聊天应用的完整 `<body>` 结构，包含 `onload` 初始化 AI SDK、`onbeforeunload` 保存对话历史、`data-theme` 主题切换三大功能：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI 聊天助手 — ClaudeHelper</title>
  <style>
    /* CSS 变量实现主题切换：body[data-theme="dark"] 时覆盖默认值 */
    :root {
      --bg-primary:    #ffffff;
      --bg-secondary:  #f8fafc;
      --text-primary:  #1e293b;
      --text-secondary:#64748b;
      --accent:        #6366f1;
      --border:        #e2e8f0;
      --msg-ai-bg:     #f1f5f9;
      --msg-user-bg:   #6366f1;
      --msg-user-text: #ffffff;
    }

    body[data-theme="dark"] {
      --bg-primary:    #0f172a;
      --bg-secondary:  #1e293b;
      --text-primary:  #f1f5f9;
      --text-secondary:#94a3b8;
      --accent:        #818cf8;
      --border:        #334155;
      --msg-ai-bg:     #1e293b;
      --msg-user-bg:   #4f46e5;
      --msg-user-text: #ffffff;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg-secondary);
      color: var(--text-primary);
      transition: background 0.3s, color 0.3s;
      min-height: 100vh;
    }

    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-width: 720px;
      margin: 0 auto;
      background: var(--bg-primary);
      border-left: 1px solid var(--border);
      border-right: 1px solid var(--border);
    }

    /* 顶部导航 */
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-primary);
    }
    .app-title { font-size: 16px; font-weight: 600; color: var(--text-primary); }
    .sdk-status {
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      background: #fef3c7;
      color: #92400e;
    }
    .sdk-status.ready { background: #dcfce7; color: #166534; }
    .theme-toggle {
      background: none;
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      color: var(--text-primary);
      font-size: 14px;
    }

    /* 消息区域 */
    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .message {
      display: flex;
      gap: 10px;
      max-width: 85%;
      line-height: 1.6;
    }
    .message.ai { align-self: flex-start; }
    .message.user { align-self: flex-end; flex-direction: row-reverse; }
    .message-bubble {
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
    }
    .message.ai .message-bubble { background: var(--msg-ai-bg); color: var(--text-primary); }
    .message.user .message-bubble { background: var(--msg-user-bg); color: var(--msg-user-text); }

    /* 系统消息（SDK 初始化日志） */
    .system-message {
      text-align: center;
      font-size: 12px;
      color: var(--text-secondary);
      padding: 6px 14px;
      background: var(--bg-secondary);
      border-radius: 20px;
      align-self: center;
    }

    /* 输入区域 */
    .input-area {
      padding: 16px 20px;
      border-top: 1px solid var(--border);
      background: var(--bg-primary);
      display: flex;
      gap: 10px;
    }
    .message-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 14px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      outline: none;
      resize: none;
    }
    .message-input:focus { border-color: var(--accent); }
    .send-btn {
      padding: 10px 20px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
    }
    .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  </style>
</head>

<!--
  body 属性说明：
  - data-theme：自定义数据属性，JS 修改此值触发 CSS 变量切换实现主题
  - onload：等同于 window.onload，所有资源加载完成后触发
  - 注意：现代开发中更推荐在 JS 中用 addEventListener，此处演示属性写法
-->
<body data-theme="light">

  <div class="app-layout">

    <!-- 顶部：标题 + SDK 状态 + 主题切换 -->
    <header class="app-header">
      <span class="app-title">🤖 ClaudeHelper</span>
      <span class="sdk-status" id="sdk-status">SDK 初始化中...</span>
      <button class="theme-toggle" id="theme-toggle">🌙 深色</button>
    </header>

    <!-- 消息列表 -->
    <main class="messages-area" id="messages-area">
      <!-- 消息由 JS 动态插入 -->
    </main>

    <!-- 输入区域 -->
    <footer class="input-area">
      <textarea
        class="message-input"
        id="message-input"
        rows="1"
        placeholder="输入消息，按 Enter 发送..."
      ></textarea>
      <button class="send-btn" id="send-btn" disabled>发送</button>
    </footer>

  </div>

  <script>
    // ═══════════════════════════════════════════════════
    // 工具函数
    // ═══════════════════════════════════════════════════

    function addMessage(text, role) {
      const area = document.getElementById('messages-area');
      const msg = document.createElement('div');
      msg.className = `message ${role}`;
      msg.innerHTML = `<div class="message-bubble">${text}</div>`;
      area.appendChild(msg);
      area.scrollTop = area.scrollHeight;
      return msg;
    }

    function addSystemMessage(text) {
      const area = document.getElementById('messages-area');
      const msg = document.createElement('div');
      msg.className = 'system-message';
      msg.textContent = text;
      area.appendChild(msg);
      area.scrollTop = area.scrollHeight;
    }

    // ═══════════════════════════════════════════════════
    // 一、AI SDK 初始化
    // DOMContentLoaded vs window.onload 的实际应用
    // ═══════════════════════════════════════════════════

    // DOMContentLoaded：DOM 就绪即初始化 UI（不等图片）
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[DOMContentLoaded] DOM 构建完成，初始化 UI...');
      addSystemMessage('页面 DOM 就绪，开始初始化...');

      // 绑定用户交互事件（DOM 就绪后即可绑定，不需等图片加载）
      setupEventListeners();
    });

    // window.onload：所有资源加载完成后初始化 AI SDK
    // 为什么用 onload 而不是 DOMContentLoaded？
    // → AI SDK（如 Anthropic JS SDK）可能依赖 WebCrypto API，需确保浏览器完全就绪
    // → 如果 SDK 脚本是动态加载的（非 defer），需等 load 事件
    window.addEventListener('load', async () => {
      console.log('[window.load] 所有资源加载完毕，初始化 AI SDK...');
      addSystemMessage('所有资源加载完毕，正在连接 AI 服务...');

      try {
        await initAISDK();
      } catch (error) {
        console.error('[SDK] 初始化失败：', error);
        document.getElementById('sdk-status').textContent = 'SDK 初始化失败';
      }
    });

    /**
     * 模拟 AI SDK 初始化
     * 实际项目中替换为：
     * import Anthropic from '@anthropic-ai/sdk';
     * const client = new Anthropic({ apiKey: '...' });
     */
    async function initAISDK() {
      // 模拟 SDK 初始化耗时（验证 API Key、建立连接等）
      await new Promise(resolve => setTimeout(resolve, 1200));

      // SDK 初始化成功
      const statusEl = document.getElementById('sdk-status');
      statusEl.textContent = '✅ SDK 就绪';
      statusEl.className = 'sdk-status ready';

      // 启用发送按钮
      document.getElementById('send-btn').disabled = false;

      // 显示欢迎消息
      addSystemMessage('AI SDK 初始化完成');
      addMessage('你好！我是 Claude，有什么可以帮助你的？', 'ai');

      console.log('[SDK] AI SDK 初始化成功');
      return true;
    }

    // ═══════════════════════════════════════════════════
    // 二、用户离开前保存对话历史
    // beforeunload 事件实践
    // ═══════════════════════════════════════════════════

    const conversationHistory = [];

    // beforeunload：用户关闭标签页或刷新前触发
    window.addEventListener('beforeunload', (event) => {
      if (conversationHistory.length > 0) {
        // 保存对话历史到 localStorage
        saveConversationToStorage();
        console.log('[beforeunload] 对话历史已保存，共', conversationHistory.length, '条');

        // 可选：询问用户是否确认离开（现代浏览器会忽略自定义文字）
        // event.preventDefault();
        // event.returnValue = ''; // 触发浏览器默认的"确定离开？"对话框
      }
    });

    function saveConversationToStorage() {
      try {
        const saveData = {
          timestamp: Date.now(),
          messages: conversationHistory
        };
        localStorage.setItem('claude_chat_history', JSON.stringify(saveData));
        console.log('[Storage] 对话已保存到 localStorage');
      } catch (error) {
        console.error('[Storage] 保存失败：', error);
      }
    }

    function loadConversationFromStorage() {
      try {
        const saved = localStorage.getItem('claude_chat_history');
        if (saved) {
          const data = JSON.parse(saved);
          const age = Date.now() - data.timestamp;
          // 只恢复24小时内的对话
          if (age < 24 * 60 * 60 * 1000) {
            return data.messages;
          }
        }
      } catch (error) {
        console.error('[Storage] 读取失败：', error);
      }
      return [];
    }

    // ═══════════════════════════════════════════════════
    // 三、data-theme 主题切换
    // ═══════════════════════════════════════════════════

    function setupThemeToggle() {
      const themeToggle = document.getElementById('theme-toggle');

      // 读取用户上次选择的主题
      const savedTheme = localStorage.getItem('theme') || 'light';
      applyTheme(savedTheme);

      themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }

    function applyTheme(theme) {
      // 修改 body 的 data-theme 属性，触发 CSS 变量切换
      document.body.setAttribute('data-theme', theme);
      const btn = document.getElementById('theme-toggle');
      btn.textContent = theme === 'dark' ? '☀️ 浅色' : '🌙 深色';
      console.log('[Theme] 切换到', theme, '模式');
    }

    // ═══════════════════════════════════════════════════
    // 四、事件监听：发送消息
    // ═══════════════════════════════════════════════════

    function setupEventListeners() {
      setupThemeToggle();

      const input = document.getElementById('message-input');
      const sendBtn = document.getElementById('send-btn');

      // Enter 发送，Shift+Enter 换行
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (!sendBtn.disabled) sendMessage();
        }
      });

      sendBtn.addEventListener('click', sendMessage);
    }

    async function sendMessage() {
      const input = document.getElementById('message-input');
      const sendBtn = document.getElementById('send-btn');
      const text = input.value.trim();
      if (!text) return;

      // 记录到对话历史
      conversationHistory.push({ role: 'user', content: text, ts: Date.now() });

      addMessage(text, 'user');
      input.value = '';
      sendBtn.disabled = true;

      document.title = '⏳ 正在思考... — ClaudeHelper';

      // 模拟 AI 响应
      await new Promise(resolve => setTimeout(resolve, 1500));
      const aiReply = `关于"${text.slice(0, 20)}"，这是 AI 的回复内容...`;
      conversationHistory.push({ role: 'assistant', content: aiReply, ts: Date.now() });
      addMessage(aiReply, 'ai');

      document.title = `✅ ClaudeHelper — ${conversationHistory.filter(m => m.role === 'assistant').length} 条回复`;
      sendBtn.disabled = false;
    }
  </script>

  <!--
    ═══════════════════════════════════════════════════
    五、visibilitychange 节能实践（独立脚本块，便于演示）
    ═══════════════════════════════════════════════════
  -->
  <script>
    /**
     * AI 应用节能实践：页面隐藏时暂停 API 轮询
     *
     * 场景：部分 AI 应用需要定期轮询服务器（如检查长任务状态）。
     * 当用户切换到其他标签页时，继续轮询是资源浪费。
     * visibilitychange 事件可以精准检测页面可见性，实现智能暂停/恢复。
     */

    class AIPollingManager {
      constructor() {
        this.pollTimer = null;
        this.pollInterval = 3000; // 3秒轮询一次
        this.isPaused = false;
        this.pollCount = 0;

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            this.pause();
          } else {
            this.resume();
          }
        });
      }

      start() {
        console.log('[Polling] 开始轮询 AI 任务状态');
        this._doPoll();
        this.pollTimer = setInterval(() => {
          if (!this.isPaused) this._doPoll();
        }, this.pollInterval);
      }

      pause() {
        if (!this.isPaused) {
          this.isPaused = true;
          console.log('[Polling] 页面隐藏，暂停 API 轮询（节省带宽和服务器资源）');
          // 实际项目中还可以：
          // - 取消正在进行的 fetch 请求（AbortController）
          // - 暂停 WebSocket 心跳
          // - 停止音频/视频播放
        }
      }

      resume() {
        if (this.isPaused) {
          this.isPaused = false;
          console.log('[Polling] 页面恢复可见，恢复 API 轮询');
          this._doPoll(); // 立即执行一次，获取最新状态
        }
      }

      stop() {
        if (this.pollTimer) {
          clearInterval(this.pollTimer);
          this.pollTimer = null;
          console.log('[Polling] 停止轮询');
        }
      }

      async _doPoll() {
        this.pollCount++;
        console.log(`[Polling] 第 ${this.pollCount} 次轮询 AI 任务状态...`);

        // 模拟 API 请求
        // 实际代码：
        // const response = await fetch('/api/ai-task/status?id=xxx', {
        //   signal: this.abortController.signal
        // });
        // const data = await response.json();
        // if (data.status === 'completed') this.stop();

        // 模拟响应
        const mockStatus = this.pollCount < 5 ? 'processing' : 'completed';
        console.log(`[Polling] 任务状态：${mockStatus}`);

        if (mockStatus === 'completed') {
          this.stop();
          addSystemMessage('AI 长任务已完成！');
        }
      }
    }

    // 使用示例（当 SDK 初始化完成后可以启动轮询）
    // const poller = new AIPollingManager();
    // window.addEventListener('load', () => poller.start());
    console.log('[visibilitychange] AIPollingManager 已定义，可在长任务场景中使用');
  </script>

</body>
</html>
```

---

## 🔍 逐行解析

**`<body>` 标签属性：**

| 代码 | 解析 |
|------|------|
| `<body data-theme="light">` | `data-theme` 是自定义数据属性，CSS 通过 `body[data-theme="dark"]` 选择器匹配并应用深色主题变量。JS 用 `document.body.setAttribute('data-theme', 'dark')` 修改。 |

**生命周期事件：**

| 代码 | 解析 |
|------|------|
| `document.addEventListener('DOMContentLoaded', ...)` | DOM 树构建完成时触发。此时 HTML 元素已全部可访问，适合绑定事件监听器、初始化 UI 状态。 |
| `window.addEventListener('load', ...)` | 所有资源（图片、字体、iframe）加载完成后触发。AI SDK 初始化放在这里，确保浏览器 API 完全可用。 |
| `window.addEventListener('beforeunload', ...)` | 用户关闭标签页或离开前触发。用于保存对话历史到 localStorage，防止数据丢失。 |
| `document.addEventListener('visibilitychange', ...)` | 用户切换标签页或最小化窗口时触发。`document.hidden` 为 `true` 表示页面不可见，此时暂停 API 轮询。 |

**主题切换核心逻辑：**

| 代码 | 解析 |
|------|------|
| `document.body.setAttribute('data-theme', theme)` | 修改 `<body>` 的 `data-theme` 属性，CSS 变量自动切换，所有使用 `var(--*)` 的样式同步更新。 |
| `CSS :root { --bg-primary: #fff }` | CSS 变量定义在 `:root`（等同于 html 元素），全局可用。 |
| `body[data-theme="dark"] { --bg-primary: #0f172a }` | 覆盖深色模式下的变量值。修改属性即触发重渲染，无需 JS 操作任何样式。 |

---

## 🌐 浏览器表现

### 事件触发顺序的可视化

打开 DevTools → Console 面板，加载本页面可观察到以下输出顺序：

```text
时间线（从上到下）：

[DOMContentLoaded] DOM 构建完成，初始化 UI...    ← 最先触发
[window.load] 所有资源加载完毕，初始化 AI SDK...  ← 图片等资源加载完后触发
[SDK] AI SDK 初始化成功                           ← 异步初始化完成

---- 用户切换到其他标签页 ----
[Polling] 页面隐藏，暂停 API 轮询

---- 用户切回标签页 ----
[Polling] 页面恢复可见，恢复 API 轮询

---- 用户关闭标签页 ----
[beforeunload] 对话历史已保存，共 3 条
[Storage] 对话已保存到 localStorage
```

### `data-theme` 切换的 DevTools 观察

在 Elements 面板中点击 body 元素，切换主题时可实时看到：

```text
<body data-theme="light">  →  <body data-theme="dark">
```

Styles 面板中同步显示 CSS 变量从 `#ffffff` 切换为 `#0f172a`。

---

## 📦 常见属性 / API

`<body>` 的属性和事件处理器：

| 属性/事件 | 类型 | 用途说明 | AI 应用场景示例 |
|-----------|------|---------|----------------|
| `onload` | 事件属性 | 等价于 `window.onload`，所有资源加载完成后触发 | 初始化 AI SDK、加载历史对话 |
| `onunload` | 事件属性 | 页面完全卸载时触发（现代浏览器行为不稳定，推荐用 `beforeunload`） | 清理 WebSocket 连接 |
| `onbeforeunload` | 事件属性 | 用户离开前触发，可阻止默认跳转或弹确认框 | 保存 AI 对话历史到 localStorage |
| `onresize` | 事件属性 | 浏览器窗口尺寸改变时触发 | 响应式布局调整，移动端/桌面端切换不同 AI 界面 |
| `onscroll` | 事件属性 | 页面滚动时触发 | AI 聊天页面自动滚动到最新消息；滚动到顶部加载历史记录 |
| `class` | 属性 | 为 body 添加 CSS 类名 | 用 `class="loading"` 显示全局加载遮罩 |
| `id` | 属性 | 为 body 设置唯一 ID | 通常不需要，`document.body` 即可直接访问 |
| `style` | 属性 | 内联样式（不推荐，优先用 class） | 紧急覆盖样式 |
| `data-theme` | 自定义数据属性 | 存储主题状态，供 CSS 和 JS 读取 | `data-theme="dark"` 触发深色模式 CSS 变量 |
| `data-user-id` | 自定义数据属性 | 存储全局用户信息 | `data-user-id="123"` 供任意子元素读取 |
| `dir` | 属性 | 文字方向：`ltr`（从左到右）/ `rtl`（从右到左） | 多语言 AI 工具支持阿拉伯语等 RTL 语言 |
| `lang` | 属性 | 覆盖 `<html lang>`，声明 body 内容语言 | 主要内容语言与 html 不同的场景 |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. `DOMContentLoaded` vs `window.onload` 的核心区别**

绝大多数初始化逻辑用 `DOMContentLoaded`，它更快（不等图片）。只有在必须确保所有资源（包括图片、字体）就绪时才用 `window.onload`。

**2. `data-*` 属性是 CSS 与 JS 共享状态的桥梁**

在 `<body>` 上设置 `data-theme`、`data-user-role` 等属性，CSS 可以用属性选择器读取，JS 可以用 `dataset` API 读写。这是实现主题切换、权限控制等全局状态的优雅方式。

**3. `beforeunload` 是防止数据丢失的安全网**

AI 对话的成本较高，用户不小心关闭标签页会丢失所有内容。`beforeunload` + localStorage 是保护用户数据的标准做法。

**4. `visibilitychange` 是 AI 应用节能的关键 API**

AI API 调用有成本，轮询有性能开销。页面隐藏时暂停一切非必要操作，是优秀 AI 工具的细节体现。

**5. `<script>` 的最佳位置是 `</body>` 之前（或在 `<head>` 中加 defer）**

把 `<script>` 放在 `</body>` 前的传统做法和 `defer` 属性效果相同，但 `defer` 更语义化，推荐在 `<head>` 中使用 `defer`。

---

## ⚠️ 易错点

**❌ 错误 1：在 `DOMContentLoaded` 之前操作 DOM**

```html
<head>
  <script>
    // 错误：此时 DOM 尚未构建，document.getElementById 返回 null
    document.getElementById('app').innerHTML = '初始化中';
  </script>
</head>

<!-- 正确方式一：事件监听 -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('app').innerHTML = '初始化中';
  });
</script>

<!-- 正确方式二：script 放在 body 末尾 -->
<body>
  <div id="app"></div>
  <script>
    document.getElementById('app').innerHTML = '初始化中'; // 此时 #app 已存在
  </script>
</body>
```

**❌ 错误 2：在 `beforeunload` 中做异步操作**

```js
// 错误：异步操作不会在页面卸载前完成
window.addEventListener('beforeunload', async () => {
  await fetch('/api/save-session', { ... }); // 页面已卸载，请求被取消
});

// 正确：使用同步 localStorage 或 sendBeacon（不阻塞卸载）
window.addEventListener('beforeunload', () => {
  localStorage.setItem('session', JSON.stringify(data)); // 同步，可靠
  navigator.sendBeacon('/api/analytics', JSON.stringify(data)); // 异步但可靠
});
```

**❌ 错误 3：用 `window.onfocus`/`onblur` 代替 `visibilitychange`**

```js
// 错误：onfocus 在用户 Alt+Tab 切走时触发，不是标签页切换
window.onblur = () => pausePolling();
window.onfocus = () => resumePolling();

// 正确：visibilitychange 专门处理标签页可见性
document.addEventListener('visibilitychange', () => {
  document.hidden ? pausePolling() : resumePolling();
});
```

**❌ 错误 4：`data-theme` 属性与 CSS 选择器不匹配**

```css
/* 错误：data-theme 值用了引号内的不一致 */
body[data-theme='Dark'] { } /* 'D' 大写 */
```

```js
// JS 中设置时用小写
document.body.setAttribute('data-theme', 'dark'); /* 'd' 小写 */
```

CSS 选择器和 JS 设置的值必须完全一致（大小写敏感）。

---

## 💡 最佳实践

**1. 用 CSS 变量 + `data-theme` 实现主题，而不是切换 class**

```css
/* 推荐：属性选择器更语义化 */
body[data-theme="dark"] { --bg: #000; }

/* 可行但不够语义化 */
body.dark-mode { --bg: #000; }
```

**2. 遵循 `DOMContentLoaded` → `load` 的分级初始化模式**

```js
// 第一阶段：DOM 就绪（快），初始化界面交互
document.addEventListener('DOMContentLoaded', () => {
  bindUIEvents();       // 绑定按钮点击等
  restoreUserPrefs();   // 读取 localStorage 中的用户设置
});

// 第二阶段：所有资源就绪（慢），初始化重依赖
window.addEventListener('load', () => {
  initAISDK();          // 初始化 AI SDK（可能依赖 WebCrypto 等浏览器 API）
  loadExternalPlugins(); // 加载第三方插件
});
```

**3. `beforeunload` 只做同步的轻量操作**

页面卸载时间窗口极短（通常 < 100ms），只做 `localStorage.setItem` 等同步操作，复杂的网络请求用 `navigator.sendBeacon`。

**4. `visibilitychange` 与 AI 资源管理结合**

```js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // 暂停：API 轮询、流式输出监听、定时刷新
    aiPoller.pause();
    streamReader.pause();
    clearInterval(autoRefreshTimer);
  } else {
    // 恢复：重新拉取最新状态
    aiPoller.resume();
    streamReader.resume();
    fetchLatestStatus();
  }
});
```

---

## 🚀 AI 应用场景

### 场景一：初始化 AI SDK（`DOMContentLoaded` + `window.onload` 的差异）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>AI SDK 初始化演示</title>
  <!-- SDK 脚本：defer 保证 DOM 就绪前执行完，但 load 事件后才更可靠 -->
  <script src="https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk/dist/browser.js" defer></script>
</head>
<body>
  <div id="status">加载中...</div>

  <script>
    /**
     * DOMContentLoaded vs load 在 AI 应用中的实际分工：
     *
     * DOMContentLoaded（早）→ 初始化 UI、绑定事件
     *   此时 SDK 脚本可能还在下载（如果没有 defer 的话）
     *
     * load（晚）→ 初始化 AI SDK
     *   此时 defer 脚本已执行完毕，SDK 全局变量可用
     */

    // 阶段一：DOM 就绪 → 初始化界面
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('status').textContent = 'DOM 就绪，等待 SDK...';
      console.log('[1] DOMContentLoaded 触发');
      console.log('[1] document.body 可用:', !!document.body);
      console.log('[1] SDK 全局变量可能不可用（defer 脚本可能还在下载）');
    });

    // 阶段二：所有资源就绪 → 初始化 AI SDK
    window.addEventListener('load', () => {
      console.log('[2] window.load 触发');
      console.log('[2] 所有 defer 脚本已执行完毕，SDK 应该可用');

      // 实际项目中的 SDK 初始化：
      // if (typeof Anthropic !== 'undefined') {
      //   const client = new Anthropic({ apiKey: 'your-api-key' });
      //   window.__aiClient = client; // 存储为全局变量供其他模块使用
      //   document.getElementById('status').textContent = 'AI SDK 就绪 ✅';
      // }

      document.getElementById('status').textContent = '所有资源加载完毕 ✅';
    });
  </script>
</body>
</html>
```

### 场景二：`visibilitychange` 在 AI 应用中的节能实践

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>AI 节能模式演示</title>
</head>
<body>
  <div id="poll-status">轮询状态：运行中</div>
  <div id="poll-count">轮询次数：0</div>
  <div id="visibility-log"></div>

  <script>
    /**
     * AI 应用节能实践：
     * 页面隐藏时暂停一切非必要的资源消耗
     *
     * 典型场景：
     * - AI 长任务（文章生成、代码审查）的状态轮询
     * - 实时 AI 推荐的刷新
     * - 语音 AI 的麦克风监听
     * - AI 动画/可视化的渲染循环
     */

    let pollCount = 0;
    let pollTimer = null;
    let isPaused = false;

    // 日志函数
    function log(msg) {
      const el = document.getElementById('visibility-log');
      const entry = document.createElement('div');
      entry.style.cssText = 'font-size:12px; color:#64748b; margin:2px 0;';
      entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
      el.prepend(entry);
    }

    // 轮询函数（模拟 AI 任务状态检查）
    function pollAIStatus() {
      if (isPaused) return;
      pollCount++;
      document.getElementById('poll-count').textContent = `轮询次数：${pollCount}`;
      log(`第 ${pollCount} 次检查 AI 任务状态`);
      // 实际：fetch('/api/ai-task/status').then(...)
    }

    // 启动轮询
    function startPolling() {
      isPaused = false;
      document.getElementById('poll-status').textContent = '轮询状态：运行中 🟢';
      if (!pollTimer) {
        pollTimer = setInterval(pollAIStatus, 2000);
      }
      log('开始轮询');
    }

    // 暂停轮询（页面不可见时调用）
    function pausePolling() {
      isPaused = true;
      document.getElementById('poll-status').textContent = '轮询状态：已暂停（节能模式）🟡';
      log('暂停轮询 — 页面进入后台，节省 API 调用费用');
    }

    // 恢复轮询（页面重新可见时调用）
    function resumePolling() {
      isPaused = false;
      document.getElementById('poll-status').textContent = '轮询状态：运行中 🟢';
      // 立即执行一次，获取最新状态（不等下一个 interval）
      pollAIStatus();
      log('恢复轮询 — 页面重新进入前台');
    }

    // 核心：监听页面可见性
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pausePolling();
      } else {
        resumePolling();
      }
    });

    // 同时处理窗口关闭前的清理
    window.addEventListener('beforeunload', () => {
      clearInterval(pollTimer);
      log('页面关闭，已清理定时器');
    });

    // 页面加载后启动
    document.addEventListener('DOMContentLoaded', startPolling);
  </script>
</body>
</html>
```

---

## 📝 练习题

**题目 1（基础）：** 以下代码有什么问题？为什么会报错？

```html
<head>
  <script>
    document.getElementById('btn').addEventListener('click', () => {
      alert('clicked');
    });
  </script>
</head>
<body>
  <button id="btn">点击我</button>
</body>
```

参考答案：`<script>` 在 `<head>` 中且没有 `defer` 属性，执行时 `<body>` 尚未解析，`getElementById('btn')` 返回 `null`，调用 `addEventListener` 报错。修正：加 `defer` 属性，或把脚本移到 `</body>` 前，或用 `DOMContentLoaded` 事件包裹代码。

**题目 2（AI 场景）：** 实现一个完整的 AI 聊天页面生命周期管理：
- `DOMContentLoaded` 时：从 `localStorage` 读取历史对话，渲染到页面
- `window.load` 时：初始化 AI SDK，连接 WebSocket
- `beforeunload` 时：保存当前对话到 `localStorage`
- `visibilitychange` 时：隐藏时暂停 WebSocket 心跳，显示时恢复

请写出每个阶段的伪代码结构（不需要实现真实 API 调用）。

**题目 3（思考）：** 为什么 `navigator.sendBeacon` 比 `fetch` 更适合在 `beforeunload` 中发送数据？两者在页面卸载场景下有什么根本区别？

---

## 📌 本节总结

| 要点 | 核心结论 |
|------|---------|
| `<body>` 的职责 | 所有可见内容的容器，也是全局生命周期事件的绑定点 |
| `DOMContentLoaded` | DOM 构建完成即触发，不等图片，适合 UI 初始化和事件绑定 |
| `window.load` | 所有资源加载完成才触发，适合依赖图片尺寸或外部 SDK 的操作 |
| `beforeunload` | 用户离开前的最后机会，只做同步轻量操作（localStorage） |
| `visibilitychange` | AI 应用节能关键：隐藏时暂停 API 轮询，恢复时立即拉取最新状态 |
| `data-theme` | CSS 变量 + 属性选择器实现主题切换，无需操作任何样式属性 |
| JS 初始化最佳实践 | DOMContentLoaded（UI） → load（SDK） → 用户交互 → beforeunload（保存） |

`<body>` 是用户看到的一切内容的家，也是 AI 应用生命周期管理的核心舞台。掌握它的事件体系，是构建高质量 AI Web 应用的基础能力。

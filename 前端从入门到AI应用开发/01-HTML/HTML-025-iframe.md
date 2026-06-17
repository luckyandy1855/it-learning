# 内嵌框架 <iframe>（HTML-025）

---

## 🎯 本节学习目标

- 掌握 `<iframe>` 的作用与基本用法
- 理解 `sandbox` 属性各值的安全边界和风险控制
- 学会用 `postMessage` 实现主页面与 iframe 内 AI 工具的双向通信
- 能够构建安全的知识库页面内嵌 AI 工具，含 lazy loading 和 fallback

---

## 📖 什么是 `<iframe>`？

`<iframe>`（inline frame，内嵌框架）是 HTML 中用于在当前页面内**嵌入另一个独立网页**的标签。被嵌入的内容有自己的浏览上下文（browsing context），与父页面相互隔离。

```html
<iframe src="https://tool.example.com/ai-chat" width="100%" height="500"></iframe>
```

**典型用途**：

- 在知识库系统（Notion、Confluence）中嵌入 AI 聊天工具
- 嵌入第三方 AI 演示（Hugging Face Spaces、CodePen）
- 安全沙盒执行用户提交的代码
- 嵌入地图、视频播放器、支付页面

---

## 🧠 原理讲解

**安全隔离**：默认情况下，iframe 内的页面与父页面不共享 DOM、JavaScript 变量、Cookie（跨域时）。这使 iframe 成为嵌入不完全信任内容的安全边界。

**`sandbox` 属性**：进一步限制 iframe 的能力。空值 `sandbox=""` 会禁用所有特性（脚本、表单、弹窗等）；通过逐个添加 `allow-*` 值来按需开放权限。

**`postMessage` 通信原理**：

```text
主页面 → iframe.contentWindow.postMessage(data, origin)
iframe → window.parent.postMessage(data, origin)
```

两侧都通过 `window.addEventListener('message', handler)` 接收消息。必须校验 `event.origin` 防止 XSS 攻击。

**`lazy` loading**：`loading="lazy"` 让 iframe 延迟到进入视口时才加载，优化首屏性能。

---

## 🏗 基本结构

```html
<iframe
  src="https://ai-tool.example.com"
  title="AI 工具"
  width="100%"
  height="600"
  sandbox="allow-scripts allow-forms"
  allow="clipboard-write"
  loading="lazy"
  referrerpolicy="no-referrer"
>
  <!-- fallback：浏览器不支持 iframe 时显示 -->
  <p>您的浏览器不支持 iframe，请
    <a href="https://ai-tool.example.com">直接访问工具</a>
  </p>
</iframe>
```

---

## ✅ 完整代码：知识库页面内嵌 AI 工具

含 `sandbox` 安全配置、`postMessage` 双向通信、lazy loading、fallback 内容：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 知识库助手</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0d1117;
      color: #e1e4e8;
      display: flex;
      min-height: 100vh;
    }

    /* ── 侧边栏（知识库导航） ── */
    .sidebar {
      width: 240px;
      background: #161b22;
      border-right: 1px solid #30363d;
      padding: 24px 16px;
      flex-shrink: 0;
    }

    .sidebar h2 {
      font-size: 14px;
      color: #6e7681;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    .nav-item {
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      color: #8b949e;
      transition: all 0.15s;
      margin-bottom: 2px;
    }

    .nav-item:hover, .nav-item.active {
      background: #21262d;
      color: #e1e4e8;
    }

    /* ── 主内容区 ── */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* ── 顶栏 ── */
    .topbar {
      padding: 16px 24px;
      border-bottom: 1px solid #30363d;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .topbar h1 { font-size: 16px; font-weight: 600; }

    .send-prompt-form {
      display: flex;
      gap: 8px;
    }

    .send-prompt-form input {
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 6px;
      color: #e1e4e8;
      font-size: 13px;
      padding: 6px 12px;
      width: 240px;
    }

    .send-prompt-form input:focus {
      outline: none;
      border-color: #58a6ff;
    }

    .send-btn {
      background: #238636;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      padding: 6px 14px;
      cursor: pointer;
    }

    /* ── iframe 容器 ── */
    .iframe-container {
      flex: 1;
      position: relative;
      background: #0d1117;
    }

    #ai-iframe {
      width: 100%;
      height: 100%;
      min-height: 500px;
      border: none;
      display: block;
    }

    /* loading 遮罩 */
    .iframe-overlay {
      position: absolute;
      inset: 0;
      background: #0d1117;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      transition: opacity 0.3s;
    }

    .iframe-overlay.hidden { opacity: 0; pointer-events: none; }

    @keyframes spin { to { transform: rotate(360deg); } }

    .loader {
      width: 32px;
      height: 32px;
      border: 3px solid #30363d;
      border-top-color: #58a6ff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .loader-text { font-size: 13px; color: #6e7681; }

    /* fallback（当 iframe 加载失败时显示） */
    .iframe-fallback {
      display: none;
      padding: 40px;
      text-align: center;
    }

    .iframe-fallback a {
      color: #58a6ff;
      text-decoration: none;
    }

    /* ── 通信日志面板 ── */
    .message-log {
      border-top: 1px solid #30363d;
      padding: 12px 24px;
      max-height: 160px;
      overflow-y: auto;
      background: #0d1117;
    }

    .message-log h3 {
      font-size: 11px;
      color: #6e7681;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .log-entry {
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 12px;
      line-height: 1.6;
      color: #8b949e;
      padding: 2px 0;
      border-bottom: 1px solid #161b22;
    }

    .log-entry.sent { color: #58a6ff; }
    .log-entry.received { color: #3fb950; }
    .log-entry.error { color: #f85149; }
  </style>
</head>
<body>

  <!-- 侧边栏 -->
  <div class="sidebar">
    <h2>知识库</h2>
    <div class="nav-item active">📄 产品文档</div>
    <div class="nav-item">🔧 API 参考</div>
    <div class="nav-item">💡 使用案例</div>
    <div class="nav-item">❓ 常见问题</div>
    <hr style="border-color:#21262d;margin:16px 0">
    <div class="nav-item">🤖 AI 助手</div>
  </div>

  <!-- 主内容区 -->
  <div class="main">

    <!-- 顶栏：向 iframe 发送 prompt -->
    <div class="topbar">
      <h1>🤖 内嵌 AI 助手</h1>
      <div class="send-prompt-form">
        <input
          type="text"
          id="host-prompt"
          placeholder="向 AI 工具发送消息…"
        >
        <button class="send-btn" type="button" onclick="sendToIframe()">
          发送
        </button>
      </div>
    </div>

    <!-- iframe 容器 -->
    <div class="iframe-container">

      <!-- loading 遮罩 -->
      <div class="iframe-overlay" id="overlay">
        <div class="loader"></div>
        <div class="loader-text">正在加载 AI 工具…</div>
      </div>

      <!--
        ⚙️ sandbox 安全配置说明：
        - allow-scripts    : 允许运行 JavaScript（AI 工具必须）
        - allow-forms      : 允许提交表单（AI 聊天必须）
        - allow-same-origin: 允许 iframe 访问其自身 cookie/storage（谨慎开放）
        注意：allow-scripts + allow-same-origin 同时开放风险较高，见安全说明
      -->
      <iframe
        id="ai-iframe"
        src="about:blank"
        data-src="https://huggingface.co/chat"
        title="AI 聊天助手"
        sandbox="allow-scripts allow-forms allow-popups"
        allow="clipboard-write; microphone"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      >
        <!-- Fallback 内容：浏览器不支持 iframe 时显示 -->
        <div class="iframe-fallback">
          <p>您的浏览器不支持内嵌框架。</p>
          <p>请<a href="https://huggingface.co/chat" target="_blank">直接访问 AI 工具</a></p>
        </div>
      </iframe>
    </div>

    <!-- postMessage 通信日志 -->
    <div class="message-log" id="message-log">
      <h3>📡 postMessage 通信日志</h3>
      <div class="log-entry">等待通信消息…</div>
    </div>

  </div>

  <script>
    const iframe  = document.getElementById('ai-iframe');
    const overlay = document.getElementById('overlay');
    const logEl   = document.getElementById('message-log');

    // ── 1. Lazy loading：iframe 进入视口后才加载 ──
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const src = iframe.dataset.src;
          if (src && !iframe.src.includes(src)) {
            iframe.src = src;
          }
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(iframe);

    // ── 2. iframe 加载完成，隐藏 loading 遮罩 ──
    iframe.addEventListener('load', () => {
      overlay.classList.add('hidden');
      log('系统', 'iframe 加载完成', 'received');
    });

    // ── 3. iframe 加载出错，显示 fallback ──
    iframe.addEventListener('error', () => {
      overlay.classList.add('hidden');
      iframe.style.display = 'none';
      document.querySelector('.iframe-fallback').style.display = 'block';
      log('错误', 'iframe 加载失败，显示 fallback', 'error');
    });

    // ── 4. 向 iframe 发送 prompt（postMessage） ──
    function sendToIframe() {
      const promptInput = document.getElementById('host-prompt');
      const prompt = promptInput.value.trim();
      if (!prompt) return;

      const message = {
        type: 'SET_PROMPT',
        payload: { text: prompt },
        from: 'host-page'
      };

      // 发送给 iframe
      // 生产环境替换 '*' 为具体 origin：'https://ai-tool.example.com'
      iframe.contentWindow.postMessage(message, '*');

      log('发送', JSON.stringify(message), 'sent');
      promptInput.value = '';
    }

    // ── 5. 接收来自 iframe 的消息 ──
    window.addEventListener('message', (event) => {
      // ⚠️ 安全关键：始终校验 origin
      // 生产环境：
      // if (event.origin !== 'https://ai-tool.example.com') return;

      const data = event.data;

      // 只处理结构化消息（忽略第三方扩展等的消息）
      if (!data || typeof data !== 'object' || !data.type) return;

      log('接收', JSON.stringify(data), 'received');

      // 根据消息类型处理
      switch (data.type) {
        case 'AI_RESPONSE':
          console.log('AI 回复:', data.payload.text);
          break;
        case 'READY':
          log('系统', 'AI 工具已就绪，可以发送消息', 'received');
          break;
        case 'ERROR':
          log('错误', 'AI 工具报错: ' + data.payload.message, 'error');
          break;
      }
    });

    // ── 回车键发送 ──
    document.getElementById('host-prompt').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendToIframe();
    });

    // ── 日志辅助函数 ──
    function log(label, content, type = '') {
      const h3 = logEl.querySelector('h3');
      const firstEntry = logEl.querySelector('.log-entry');
      if (firstEntry && firstEntry.textContent === '等待通信消息…') {
        firstEntry.remove();
      }

      const entry = document.createElement('div');
      entry.className = `log-entry ${type}`;
      entry.textContent = `[${new Date().toLocaleTimeString()}] [${label}] ${content}`;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
    }
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

| 代码片段 | 说明 |
|---|---|
| `sandbox="allow-scripts allow-forms"` | 只开放脚本执行和表单提交，其余全部禁止 |
| `data-src="..."` + JS 设置 `iframe.src` | 实现 lazy loading：先不设 src，观察到视口后才赋值 |
| `referrerpolicy="no-referrer-when-downgrade"` | 控制请求中携带的 Referrer 信息 |
| `iframe.contentWindow.postMessage(msg, '*')` | 向 iframe 发消息，生产环境替换 `'*'` 为具体 origin |
| `window.addEventListener('message', ...)` | 接收所有 postMessage，必须校验 `event.origin` |
| `if (!data.type) return` | 过滤非结构化消息，避免处理浏览器扩展等无关消息 |
| `IntersectionObserver` | 监听元素进入视口，替代 `loading="lazy"` 的手动实现 |
| `<div>` fallback 在 `<iframe>` 内 | 标准降级方案，现代浏览器全部支持 iframe，几乎不触发 |

---

## 🌐 浏览器表现

- **同源 vs 跨域** — 同源 iframe 可通过 `contentDocument` 直接访问 DOM；跨域 iframe 只能通过 `postMessage` 通信
- **`sandbox` 空值** — 限制最严格，脚本、表单、弹窗、same-origin 全部禁止
- **`loading="lazy"`** — Chrome 77+ / Firefox 121+ 支持；旧浏览器忽略该属性（立即加载）
- **X-Frame-Options** — 被嵌入的服务器可设置 `X-Frame-Options: DENY` 拒绝被嵌入，此时 iframe 显示空白
- **CSP frame-ancestors** — 现代防嵌入机制，优先级高于 X-Frame-Options

---

## 📦 常见属性 / API

**`<iframe>` 主要属性：**

| 属性 | 说明 | 示例 |
|---|---|---|
| `src` | 嵌入页面的 URL | `src="https://tool.ai"` |
| `srcdoc` | 直接写 HTML 内容（而非外部 URL） | `srcdoc="<p>Hello</p>"` |
| `width` / `height` | 宽高（像素或百分比） | `width="100%" height="600"` |
| `sandbox` | 安全限制（空值最严，逐项开放） | `sandbox="allow-scripts"` |
| `allow` | 功能策略（摄像头、麦克风等） | `allow="microphone; camera"` |
| `loading` | 加载时机（`eager`=立即 / `lazy`=懒加载） | `loading="lazy"` |
| `referrerpolicy` | 控制 Referer 头 | `referrerpolicy="no-referrer"` |
| `name` | 框架名称，可作为 `<a target>` 目标 | `name="ai-frame"` |
| `title` | 无障碍描述（屏幕阅读器用） | `title="AI 聊天工具"` |

**`sandbox` 值详解：**

| sandbox 值 | 作用 | 风险级别 |
|---|---|---|
| `""` (空) | 禁用所有特性 | 最安全，但大多数工具无法工作 |
| `allow-scripts` | 允许运行 JavaScript | ⭐ AI 工具必须，但会执行任意 JS |
| `allow-forms` | 允许提交表单 | 低风险，聊天框必须 |
| `allow-same-origin` | 允许访问自身 cookie/storage | ⚠️ 高风险，见下方说明 |
| `allow-popups` | 允许 `window.open()` 弹窗 | 中风险，可能弹广告窗 |
| `allow-popups-to-escape-sandbox` | 允许弹出的新窗口不继承沙盒限制 | ⚠️ 高风险 |
| `allow-top-navigation` | 允许导航父框架（跳转当前页） | ⚠️ 高风险，可能劫持导航 |
| `allow-downloads` | 允许触发下载 | 低风险，需要时开放 |
| `allow-modals` | 允许 `alert()`、`confirm()` | 低风险，但会影响体验 |
| `allow-pointer-lock` | 允许锁定鼠标指针 | 游戏场景使用 |

**`allow-scripts` + `allow-same-origin` 的特殊风险：**

两者同时设置时，iframe 内的脚本可以**移除自身的 sandbox 属性**（因为它既能运行脚本，又能访问 same-origin 的 DOM 包括父框架），这实际上完全绕过了沙盒保护。

```html
<!-- ⚠️ 危险组合：同源页面不要这样写 -->
<iframe sandbox="allow-scripts allow-same-origin" src="same-origin-page.html">
```

仅在嵌入**跨域**第三方工具时，这两个属性才可以同时使用（因为跨域 iframe 本身无法访问父页面 DOM）。

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **`sandbox` 最小权限原则** — 只开放必须的 `allow-*`，AI 工具通常只需要 `allow-scripts allow-forms`

2. **`postMessage` 必须校验 origin** — `event.origin !== 'https://expected.com'` 是防止 XSS 的第一道防线

3. **跨域 iframe 无法直接访问 DOM** — 只能通过 `postMessage` 通信，这是设计边界而非 bug

4. **X-Frame-Options 会阻断 iframe** — 如果嵌入后显示空白，先检查被嵌入页面的响应头

5. **`loading="lazy"` 适合非首屏 iframe** — AI 工具通常在页面下方，lazy loading 可大幅减少首屏时间

---

## ⚠️ 易错点

**1. 误用 `allow-top-navigation`**

```html
<!-- ⚠️ 危险：iframe 内的恶意脚本可以把父页面跳转到钓鱼网站 -->
<iframe sandbox="allow-scripts allow-top-navigation">

<!-- ✅ 如必须允许导航，用更安全的子集 -->
<iframe sandbox="allow-scripts allow-top-navigation-by-user-activation">
<!-- 只有用户点击才能触发导航，脚本自动跳转被阻止 -->
```

**2. `postMessage` 忘记校验 origin**

```js
// ❌ 危险：接受任何来源的消息
window.addEventListener('message', (event) => {
  executeUserCommand(event.data); // 恶意网站可以发消息劫持
});

// ✅ 始终校验 origin
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://your-ai-tool.com') return;
  executeUserCommand(event.data);
});
```

**3. `srcdoc` 中的 HTML 需要 HTML 转义**

```html
<!-- ❌ 引号冲突导致 HTML 解析错误 -->
<iframe srcdoc="<p class="hello">Hi</p>">

<!-- ✅ 使用 HTML 实体编码 -->
<iframe srcdoc='<p class="hello">Hi</p>'>
<!-- 或使用 &quot; 编码 -->
<iframe srcdoc="<p class=&quot;hello&quot;>Hi</p>">
```

**4. iframe 高度自适应内容**

iframe 不会自动根据内容高度调整自身高度（跨域时完全无法读取内容高度）：

```js
// 同源方案：监听 iframe 内容变化
iframe.contentDocument.body.addEventListener('resize', () => {
  iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px';
});

// 跨域方案：iframe 内发 postMessage
// iframe 内部：
window.parent.postMessage({ type: 'RESIZE', height: document.body.scrollHeight }, '*');
// 主页面：
window.addEventListener('message', (e) => {
  if (e.data.type === 'RESIZE') iframe.style.height = e.data.height + 'px';
});
```

---

## 💡 最佳实践

1. **始终设置 `title` 属性** — 屏幕阅读器需要这个描述

2. **用 `data-src` 实现 lazy loading** — 比 `loading="lazy"` 更兼容旧浏览器

3. **在 iframe 加载失败时显示有意义的 fallback**

```html
<iframe src="..." onerror="showFallback()">
  <p>AI 工具暂时不可用，请<a href="...">直接访问</a></p>
</iframe>
```

4. **生产环境 postMessage 指定精确 origin**

```js
// ❌ 开发方便但不安全
iframe.contentWindow.postMessage(data, '*');

// ✅ 生产必须指定
iframe.contentWindow.postMessage(data, 'https://ai-tool.example.com');
```

5. **嵌入第三方 AI 工具前检查其 Content-Security-Policy**

```bash
# 检查目标页面是否允许被 iframe 嵌入
curl -I https://target-ai-tool.com | grep -i "x-frame-options\|content-security-policy"
```

---

## 🚀 AI 应用场景

### 场景：postMessage 与 iframe 内 AI 工具通信

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>postMessage 与 AI 工具通信</title>
  <style>
    body { font-family: system-ui; background: #1a1a2e; color: #eee; padding: 24px; }
    .layout { display: flex; gap: 16px; height: 500px; }
    .controls {
      width: 280px;
      background: #16213e;
      border: 1px solid #333;
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .controls h3 { font-size: 14px; margin-bottom: 4px; }
    input, textarea {
      width: 100%;
      background: #0d1117;
      border: 1px solid #333;
      border-radius: 6px;
      color: #eee;
      padding: 8px 10px;
      font-size: 13px;
      font-family: inherit;
    }
    button {
      background: #238636;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px;
      cursor: pointer;
      font-size: 13px;
    }
    iframe {
      flex: 1;
      border: 1px solid #333;
      border-radius: 10px;
    }
    .log {
      background: #0d1117;
      border: 1px solid #333;
      border-radius: 6px;
      font-family: monospace;
      font-size: 11px;
      padding: 8px;
      flex: 1;
      overflow-y: auto;
      color: #aaa;
      line-height: 1.8;
    }
    .log .s { color: #58a6ff; }
    .log .r { color: #3fb950; }
  </style>
</head>
<body>
  <div class="layout">
    <div class="controls">
      <h3>📡 向 AI 工具发送消息</h3>

      <div>
        <label style="font-size:12px;color:#888">消息类型</label>
        <input type="text" id="msg-type" value="SET_PROMPT" placeholder="消息类型">
      </div>

      <div>
        <label style="font-size:12px;color:#888">消息内容</label>
        <textarea id="msg-payload" rows="3" placeholder="消息内容（文字）"></textarea>
      </div>

      <button onclick="sendMsg()">发送 postMessage</button>

      <h3>📋 通信日志</h3>
      <div class="log" id="log">等待消息…<br></div>
    </div>

    <iframe
      id="tool-iframe"
      srcdoc="
        <html>
        <head><style>
          body { font-family: system-ui; background: #0d1117; color: #eee; padding: 24px; }
          #output { background:#16213e; padding:12px; border-radius:8px; margin-top:12px; min-height:80px; font-size:13px; line-height:1.6; }
        </style></head>
        <body>
          <h3 style='font-size:14px;color:#8b949e'>🤖 AI 工具（iframe 内部）</h3>
          <div id='output'>等待主页面发送消息…</div>
          <script>
            window.addEventListener('message', function(event) {
              // 沙盒内也校验 origin（此处 srcdoc 为 null，跳过校验演示）
              var data = event.data;
              if (!data || !data.type) return;

              var output = document.getElementById('output');
              if (data.type === 'SET_PROMPT') {
                output.textContent = '收到提示词：' + data.payload;
                // 回复主页面
                window.parent.postMessage({
                  type: 'AI_RESPONSE',
                  result: '已处理：' + data.payload
                }, '*');
              }
            });
          <\/script>
        </body>
        </html>
      "
      sandbox="allow-scripts allow-same-origin"
      title="演示用 AI 工具（srcdoc 模式）"
    ></iframe>
  </div>

  <script>
    const logEl = document.getElementById('log');

    function addLog(direction, content) {
      const cls = direction === '发送' ? 's' : 'r';
      logEl.innerHTML += `<span class="${cls}">[${new Date().toLocaleTimeString()}] ${direction}: ${content}</span><br>`;
      logEl.scrollTop = logEl.scrollHeight;
    }

    // 向 iframe 发送 postMessage
    function sendMsg() {
      const type = document.getElementById('msg-type').value.trim();
      const payload = document.getElementById('msg-payload').value.trim();
      if (!type || !payload) return;

      const msg = { type, payload };
      document.getElementById('tool-iframe').contentWindow.postMessage(msg, '*');
      addLog('发送', JSON.stringify(msg));
    }

    // 接收 iframe 的消息
    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object' || !data.type) return;

      // 过滤非 AI 工具的消息
      if (data.type === 'SET_PROMPT') return; // 忽略自己发的

      addLog('接收', JSON.stringify(data));
    });
  </script>
</body>
</html>
```

---

## 📝 练习题

**基础题**

1. 写一个 `<iframe>` 嵌入 `https://example.com`，设置宽度 100%、高度 400px、lazy loading，并在不支持 iframe 的情况下显示"请直接访问链接"的 fallback 文字。

2. 解释以下三种 sandbox 配置的区别和适用场景：
   - `sandbox=""`
   - `sandbox="allow-scripts"`
   - `sandbox="allow-scripts allow-forms allow-popups"`

3. 为什么在 `window.addEventListener('message', ...)` 处理函数中必须校验 `event.origin`？如果不校验会有什么安全风险？

**进阶题**

4. 实现一个主页面向 iframe 发送主题切换命令的功能：主页面有一个按钮"切换深色/浅色主题"，点击后通过 `postMessage` 向 iframe 发送 `{ type: 'THEME_CHANGE', theme: 'dark' | 'light' }`，iframe 内接收后修改 `document.body.style.background`。

**AI 场景题**

5. 构建一个"AI 工具嵌入面板"：
   - 一个 `<iframe>` 使用 `srcdoc` 模拟 AI 工具（内含一个文字区域显示收到的 prompt）
   - `sandbox` 只开放 `allow-scripts`
   - 主页面有一个文本输入框和"发送给 AI"按钮，点击后 `postMessage` 发送 `{ type: 'PROMPT', text: '...' }`
   - 主页面通过 `message` 事件接收 iframe 回复的 `{ type: 'RESPONSE', text: '...' }` 并显示在页面上
   - 在主页面右下角显示通信日志（发送/接收各用不同颜色）

---

## 📌 本节总结

| 知识点 | 核心结论 |
|---|---|
| `<iframe>` 的隔离性 | 独立浏览上下文，跨域时无法直接访问 DOM |
| `sandbox` 最小权限 | 空值最严；AI 工具通常只需 `allow-scripts allow-forms`；避免 `allow-top-navigation` |
| `allow-scripts + allow-same-origin` 组合 | 同源页面危险组合，可绕过沙盒；跨域时相对安全 |
| `postMessage` 通信 | 跨域通信唯一方案；必须校验 `event.origin`；用结构化消息 `{ type, payload }` |
| lazy loading | `loading="lazy"` 或手动 `data-src` + IntersectionObserver |
| 被嵌入限制 | 目标页面可通过 `X-Frame-Options` 或 CSP `frame-ancestors` 拒绝被嵌入 |

`<iframe>` 是 AI 工具集成的重要手段，`sandbox` + `postMessage` 的组合让嵌入既安全又有双向通信能力。至此，HTML 表单模块（HTML-020 到 HTML-025）全部完成，下一阶段将进入 CSS 基础模块。

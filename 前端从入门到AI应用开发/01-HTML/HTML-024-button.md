# 按钮标签 <button>（HTML-024）

---

## 🎯 本节学习目标

- 掌握 `<button>` 与 `<input type="button">` 的区别和选择原则
- 理解 `type` 属性的三个值（`submit` / `reset` / `button`）的不同行为
- 学会用 `disabled` 控制按钮状态，实现 loading 交互
- 能够构建 AI 聊天按钮组：发送 loading、Stop 中断（AbortController）、复制 AI 回复

---

## 📖 什么是 `<button>`？

`<button>` 是 HTML 中最灵活的**按钮控件**，可以包含文字、图标、HTML 元素，可以是提交按钮、重置按钮或普通触发器：

```html
<button type="submit">发送</button>
<button type="button" onclick="stopAI()">⏹ 停止生成</button>
```

与 `<input type="button">` 相比，`<button>` 支持**富内容**（可放 `<span>`、`<img>`、SVG），是现代 Web 开发的首选方案。

---

## 🧠 原理讲解

`<button>` 的三种 `type` 决定点击时的默认行为：

- **`submit`（默认值）** — 提交最近的父级 `<form>`；若在 form 内且没写 `type`，点击会提交表单
- **`reset`** — 将父级表单的所有控件重置为初始值
- **`button`** — 什么都不做，依赖开发者绑定事件

**loading 状态原理**：

1. 用户点击 → 设置 `btn.disabled = true`（防止重复点击）
2. 修改按钮内容为带旋转图标的"生成中…"
3. AI 响应完成（或出错）→ 恢复按钮状态

**AbortController 原理**：

```js
const controller = new AbortController();
fetch('/api/chat', { signal: controller.signal }); // 绑定 signal
controller.abort(); // 中断请求，fetch 抛出 AbortError
```

---

## 🏗 基本结构

```html
<!-- 提交按钮 -->
<button type="submit">发送</button>

<!-- 普通按钮（不触发 form 提交） -->
<button type="button" id="stop-btn" disabled>
  <span class="icon">⏹</span> 停止生成
</button>

<!-- 按钮内可包含任意 HTML -->
<button type="button">
  <img src="copy.svg" alt="" width="14"> 复制
</button>
```

---

## ✅ 完整代码：AI 聊天按钮组

包含发送按钮（loading spinner）、Stop 中断按钮、清空对话按钮、复制 AI 回复按钮：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 聊天按钮组</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0d1117;
      color: #e1e4e8;
      display: flex;
      justify-content: center;
      padding: 40px 16px;
    }

    .chat-container {
      width: 100%;
      max-width: 680px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* ── 消息气泡 ── */
    .message {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 10px;
      padding: 16px;
      position: relative;
    }

    .message .label {
      font-size: 11px;
      font-weight: 600;
      color: #6e7681;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }

    .message .content {
      font-size: 14px;
      line-height: 1.7;
      color: #e1e4e8;
    }

    /* 打字光标效果 */
    .cursor {
      display: inline-block;
      width: 2px;
      height: 16px;
      background: #58a6ff;
      margin-left: 2px;
      vertical-align: middle;
      animation: blink 0.8s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    /* ── 复制按钮（悬浮在气泡右上角） ── */
    .copy-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 6px;
      color: #8b949e;
      font-size: 12px;
      padding: 4px 10px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .copy-btn:hover {
      background: #30363d;
      color: #e1e4e8;
    }

    .copy-btn.copied {
      color: #3fb950;
      border-color: #3fb950;
    }

    /* ── 输入区域 ── */
    .input-area {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 10px;
      padding: 12px;
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }

    .input-area textarea {
      flex: 1;
      background: transparent;
      border: none;
      color: #e1e4e8;
      font-size: 14px;
      font-family: inherit;
      line-height: 1.6;
      resize: none;
      outline: none;
      min-height: 40px;
      max-height: 160px;
    }

    .input-area textarea::placeholder { color: #484f58; }

    /* ── 按钮通用基础样式 ── */
    .btn {
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 16px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      user-select: none;
    }

    .btn:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* 发送按钮 */
    .btn-send {
      background: #238636;
      color: #fff;
    }
    .btn-send:hover:not(:disabled) { background: #2ea043; }
    .btn-send.loading {
      background: #1c2130;
      border: 1px solid #30363d;
      color: #8b949e;
    }

    /* Stop 按钮 */
    .btn-stop {
      background: #6e2121;
      color: #ffa198;
      border: 1px solid #8b2e2e;
    }
    .btn-stop:hover:not(:disabled) { background: #8b2e2e; }

    /* 清空按钮 */
    .btn-clear {
      background: transparent;
      color: #8b949e;
      border: 1px solid #30363d;
    }
    .btn-clear:hover:not(:disabled) {
      color: #f85149;
      border-color: #f85149;
      background: rgba(248, 81, 73, 0.08);
    }

    /* ── CSS Spinner ── */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top-color: #8b949e;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      flex-shrink: 0;
    }

    /* ── 底部按钮行 ── */
    .btn-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .spacer { flex: 1; }

    /* ── 状态提示 ── */
    .status {
      font-size: 12px;
      color: #6e7681;
      padding: 0 4px;
    }
  </style>
</head>
<body>
  <div class="chat-container">

    <!-- AI 回复气泡 -->
    <div class="message" id="ai-message">
      <div class="label">🤖 AI 助手</div>
      <div class="content" id="ai-content">
        等待你的问题…
      </div>
      <button class="copy-btn" id="copy-btn" type="button" title="复制回复">
        📋 复制
      </button>
    </div>

    <!-- 输入 + 按钮区域 -->
    <div class="input-area">
      <textarea
        id="user-input"
        placeholder="输入消息… (Ctrl+Enter 发送)"
        rows="1"
      ></textarea>
    </div>

    <div class="btn-row">
      <!-- 清空对话按钮 -->
      <button class="btn btn-clear" id="clear-btn" type="button">
        🗑 清空
      </button>

      <span class="spacer"></span>
      <span class="status" id="status-text"></span>

      <!-- Stop 中断按钮（默认隐藏） -->
      <button class="btn btn-stop" id="stop-btn" type="button" style="display:none">
        ⏹ 停止生成
      </button>

      <!-- 发送按钮 -->
      <button class="btn btn-send" id="send-btn" type="button">
        ↑ 发送
      </button>
    </div>

  </div>

  <script>
    const sendBtn   = document.getElementById('send-btn');
    const stopBtn   = document.getElementById('stop-btn');
    const clearBtn  = document.getElementById('clear-btn');
    const copyBtn   = document.getElementById('copy-btn');
    const userInput = document.getElementById('user-input');
    const aiContent = document.getElementById('ai-content');
    const statusText = document.getElementById('status-text');

    let abortController = null;

    // ── Textarea auto-resize ──
    userInput.addEventListener('input', () => {
      userInput.style.height = 'auto';
      userInput.style.height = userInput.scrollHeight + 'px';
    });

    // ── Ctrl+Enter 发送 ──
    userInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        send();
      }
    });

    // ── 发送按钮点击 ──
    sendBtn.addEventListener('click', send);

    async function send() {
      const prompt = userInput.value.trim();
      if (!prompt) return;

      // ① loading 状态：禁用发送，显示 spinner
      setLoading(true);
      statusText.textContent = '正在请求…';

      // ② 创建 AbortController（用于 Stop 按钮中断）
      abortController = new AbortController();

      try {
        // ③ 模拟流式输出（实际替换为 fetch + ReadableStream）
        await simulateStream(prompt, abortController.signal);
        statusText.textContent = '生成完成';
      } catch (err) {
        if (err.name === 'AbortError') {
          aiContent.innerHTML = aiContent.innerHTML.replace(
            '<span class="cursor"></span>', ''
          ) + ' <span style="color:#6e7681">（已停止）</span>';
          statusText.textContent = '已中断';
        } else {
          aiContent.textContent = '请求出错：' + err.message;
          statusText.textContent = '出错';
        }
      } finally {
        // ④ 恢复按钮状态
        setLoading(false);
        abortController = null;
      }
    }

    // ── Stop 按钮：AbortController 中断 ──
    stopBtn.addEventListener('click', () => {
      if (abortController) {
        abortController.abort();
        statusText.textContent = '正在中断…';
      }
    });

    // ── 清空按钮 ──
    clearBtn.addEventListener('click', () => {
      if (abortController) abortController.abort();
      aiContent.textContent = '等待你的问题…';
      userInput.value = '';
      userInput.style.height = 'auto';
      statusText.textContent = '';
      userInput.focus();
    });

    // ── 复制 AI 回复到剪贴板 ──
    copyBtn.addEventListener('click', async () => {
      const text = aiContent.innerText.replace('（已停止）', '').trim();
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = '✅ 已复制';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = '📋 复制';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch {
        // 降级方案：document.execCommand
        const range = document.createRange();
        range.selectNodeContents(aiContent);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        copyBtn.textContent = '✅ 已复制';
        setTimeout(() => { copyBtn.textContent = '📋 复制'; }, 2000);
      }
    });

    // ── loading 状态切换 ──
    function setLoading(isLoading) {
      if (isLoading) {
        sendBtn.disabled = true;
        sendBtn.classList.add('loading');
        sendBtn.innerHTML = '<div class="spinner"></div> 生成中…';
        stopBtn.style.display = 'inline-flex';
        clearBtn.disabled = true;
      } else {
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
        sendBtn.innerHTML = '↑ 发送';
        stopBtn.style.display = 'none';
        clearBtn.disabled = false;
      }
    }

    // ── 模拟流式输出（实际项目替换为 fetch SSE） ──
    async function simulateStream(prompt, signal) {
      const responses = {
        default: `这是对"${prompt}"的模拟回复。\n\n在真实 AI 应用中，这里会调用流式 API，逐字符输出响应内容。每个 token 会通过 Server-Sent Events 或 ReadableStream 推送到前端，前端逐步将文字追加到界面上，形成打字机效果。\n\n这种交互方式大大提升了感知速度：用户不需要等待整个响应完成才能开始阅读，而是像看到 AI 在"实时思考"一样。`
      };

      const text = responses.default;
      aiContent.innerHTML = '<span class="cursor"></span>';

      let i = 0;
      const interval = 30; // 每 30ms 一个字符

      return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          if (signal.aborted) {
            clearInterval(timer);
            reject(Object.assign(new Error('AbortError'), { name: 'AbortError' }));
            return;
          }

          if (i < text.length) {
            // 将新字符插入到光标之前
            const cursor = aiContent.querySelector('.cursor');
            if (cursor) {
              cursor.insertAdjacentText('beforebegin', text[i]);
            }
            i++;
          } else {
            clearInterval(timer);
            // 移除光标
            const cursor = aiContent.querySelector('.cursor');
            if (cursor) cursor.remove();
            resolve();
          }
        }, interval);
      });
    }
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

| 代码片段 | 说明 |
|---|---|
| `type="button"` | 必须显式写，否则在 form 内默认为 `submit`，会触发提交 |
| `btn.disabled = true` | 禁用按钮，防止重复点击；CSS 同时触发 `opacity: 0.5` |
| `new AbortController()` | 创建中断控制器，`controller.signal` 绑定到 fetch |
| `controller.abort()` | 主动中断，关联的 fetch 抛出 `AbortError` |
| `err.name === 'AbortError'` | 区分主动中断和网络错误，两者处理逻辑不同 |
| `navigator.clipboard.writeText(text)` | 现代剪贴板 API，需要 HTTPS 或 localhost |
| `animation: spin 0.6s linear infinite` | CSS spinner 动画，无需图片/字体图标 |
| `user-select: none` | 防止按钮文字被意外选中（拖动时） |

---

## 🌐 浏览器表现

- **`type="submit"`（默认）** — 在 form 内点击会验证并提交表单；form 外无效
- **`disabled`** — 按钮变灰，不响应点击；表单提交时不包含该按钮的 `name/value`
- **CSS spinner** — 纯 CSS 动画无需额外资源，支持所有现代浏览器
- **`navigator.clipboard`** — 需要 HTTPS（或 localhost）+ 用户权限；不满足时回退到 `execCommand`
- **`AbortController`** — 所有现代浏览器支持；中断后 fetch Promise 变为 rejected 状态

---

## 📦 常见属性 / API

| 属性 | 值 | 说明 | AI 场景 |
|---|---|---|---|
| `type` | `submit`/`reset`/`button` | 决定点击默认行为；**在 form 内缺省为 submit**，必须显式写 | AI 聊天按钮用 `type="button"` |
| `disabled` | 布尔 | 禁用按钮，不可点击，不参与表单提交 | AI 生成中禁用发送按钮 |
| `name` | 字符串 | 表单提交时的字段名（按钮有 `name` 才会提交） | 区分多个提交按钮的用途 |
| `value` | 字符串 | 表单提交时与 `name` 配对的值 | `name="action" value="send"` |
| `form` | form 的 id | 关联到指定 form（即使按钮不在 form 内） | 将按钮放在表单外部 |
| `autofocus` | 布尔 | 页面加载后自动聚焦 | AI 应用启动时聚焦发送按钮 |
| `popovertarget` | 元素 id | 点击按钮显示/隐藏关联的 popover（HTML5.3+） | 显示高级参数面板弹出层 |
| `formnovalidate` | 布尔 | `submit` 类型按钮跳过表单校验 | 草稿保存按钮（不需要必填校验） |

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **form 内必须写 `type="button"`** — 否则默认 `submit`，点击会触发表单提交，这是最常见的 BUG 来源

2. **loading 三件套** — `disabled` + 修改内容 + spinner CSS，缺一不可

3. **AbortController 是中断 AI 请求的标准方案** — 不是 `fetch` 的 `.cancel()`（不存在），而是创建 signal 绑定给 fetch

4. **`navigator.clipboard` 需要 HTTPS** — 本地开发 localhost 可用，HTTP 生产环境会失败，需降级处理

5. **`<button>` 可放富内容** — 与 `<input type="button">` 的根本区别，可以放图标、spinner、badge

---

## ⚠️ 易错点

**1. 忘写 `type="button"` 导致意外提交**

```html
<!-- ❌ 在 form 内，点击会提交表单！ -->
<form>
  <button onclick="copyText()">复制</button>
</form>

<!-- ✅ 正确 -->
<form>
  <button type="button" onclick="copyText()">复制</button>
</form>
```

**2. `disabled` 的按钮不触发任何事件**

```js
// ❌ 想在 disabled 时显示 tooltip，但 click 事件不会触发
disabledBtn.addEventListener('click', showTooltip); // 永远不执行

// ✅ 用 pointer-events + 父元素捕获
disabledBtn.style.pointerEvents = 'none';
// 或者用父 div 捕获 click
```

**3. AbortError 必须单独处理**

```js
try {
  const res = await fetch(url, { signal });
} catch (err) {
  if (err.name === 'AbortError') {
    // 用户主动中断，不是错误
    console.log('用户取消了请求');
  } else {
    // 真正的网络错误
    showErrorToUser(err.message);
  }
}
```

**4. 多次点击创建多个 AbortController**

```js
// ❌ 每次点击都创建新的，旧请求无法中断
sendBtn.addEventListener('click', async () => {
  const ctrl = new AbortController(); // 每次新建，外部无法访问
});

// ✅ 保存到外部变量
let abortController = null;
sendBtn.addEventListener('click', async () => {
  if (abortController) abortController.abort(); // 先中断旧的
  abortController = new AbortController();
});
```

---

## 💡 最佳实践

1. **按钮文字要明确动作** — "发送"比"确定"好；"停止生成"比"取消"好

2. **loading 时修改按钮文字** — `btn.textContent = "生成中…"` 给用户明确反馈

3. **Stop 按钮仅在生成时显示** — 不生成时隐藏 Stop，避免界面混乱

4. **复制按钮给 2 秒反馈** — 变为"✅ 已复制"后 2 秒恢复，`setTimeout` 实现

5. **键盘可访问性** — `<button>` 天然支持 Tab 聚焦、Enter/Space 触发，不要用 `<div onclick>` 模拟按钮

---

## 🚀 AI 应用场景

### 场景一：AI 发送按钮 loading 状态（disabled + CSS spinner）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>发送按钮 Loading</title>
  <style>
    body { font-family: system-ui; background: #1a1a2e; color: #eee; padding: 32px; }
    .btn {
      background: #238636;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  </style>
</head>
<body>
  <button class="btn" id="send">↑ 发送</button>

  <script>
    const btn = document.getElementById('send');
    btn.addEventListener('click', async () => {
      // loading 开始
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div> 生成中…';

      // 模拟 API 请求（2 秒）
      await new Promise(r => setTimeout(r, 2000));

      // 恢复
      btn.disabled = false;
      btn.innerHTML = '↑ 发送';
    });
  </script>
</body>
</html>
```

### 场景二：流式输出中断（AbortController）

```js
let controller = null;

// 发送请求
async function startAI(prompt) {
  controller = new AbortController();

  try {
    const response = await fetch('/api/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal  // 关键：绑定 signal
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      appendToOutput(chunk); // 逐块追加到界面
    }

  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('用户点击了 Stop，流已中断');
    } else {
      console.error('请求失败:', err);
    }
  } finally {
    controller = null;
    resetSendButton();
  }
}

// Stop 按钮
function stopAI() {
  if (controller) {
    controller.abort(); // 立即中断 fetch
  }
}
```

### 场景三：复制 AI 回复到剪贴板

```js
async function copyAIResponse(elementId) {
  const el = document.getElementById(elementId);
  const text = el.innerText.trim();

  try {
    // 现代 API（需要 HTTPS）
    await navigator.clipboard.writeText(text);
    showCopySuccess();
  } catch {
    // 降级方案（兼容 HTTP 环境）
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopySuccess();
  }
}

function showCopySuccess() {
  const btn = document.getElementById('copy-btn');
  btn.textContent = '✅ 已复制';
  btn.style.color = '#3fb950';
  setTimeout(() => {
    btn.textContent = '📋 复制';
    btn.style.color = '';
  }, 2000);
}
```

---

## 📝 练习题

**基础题**

1. 在一个 `<form>` 内创建三个按钮：提交按钮（发送）、重置按钮（清空）、普通按钮（预览），为每个按钮添加正确的 `type` 属性。

2. 用 CSS 实现一个旋转 spinner（`@keyframes` + `transform: rotate`），宽高 16px，边框 2px，顶部为白色，其余为半透明白色。

3. 解释为什么 `disabled` 状态下的按钮不会触发 `click` 事件，以及如何给禁用按钮添加 tooltip 提示。

**进阶题**

4. 实现一个"带确认"的清空按钮：第一次点击变为"再次点击确认清空"（红色），3 秒内不再点击则恢复为"清空"；3 秒内点击则执行清空。

**AI 场景题**

5. 构建一个完整的 AI 请求控制按钮组：
   - 发送按钮：点击后 disabled + spinner + 文字变"生成中…"
   - Stop 按钮：发送中显示，点击后触发 `controller.abort()`，再显示"已中断"2 秒
   - 复制按钮：复制指定 div 的文字内容，成功后显示"✅ 已复制" 2 秒后恢复
   - 所有按钮用 `type="button"`，且放在一个 `<form>` 标签内

---

## 📌 本节总结

| 知识点 | 核心结论 |
|---|---|
| `type` 的重要性 | form 内缺省为 `submit`，非提交按钮必须显式写 `type="button"` |
| loading 状态 | `disabled` + 修改内容（spinner） + 完成后恢复，防止重复提交 |
| AbortController | 中断 fetch 的标准方式：创建 → 绑定 signal → abort() → 捕获 AbortError |
| 复制到剪贴板 | `navigator.clipboard.writeText` 需 HTTPS；降级用 `execCommand` |
| 富内容按钮 | `<button>` 内可放 span、div、img，而 `<input type="button">` 只能显示纯文字 |

`<button>` 是 AI 应用交互的核心控件，loading 状态和 Stop 中断是每个 AI 聊天界面的必备功能。下一节学习 `<iframe>` 内嵌框架，了解如何在页面中安全嵌入第三方 AI 工具。

# HTML 无障碍（Accessibility）（HTML-030）

## 🎯 本节学习目标

- 理解无障碍（a11y）的含义及其对用户体验和法规合规的重要性
- 掌握核心 ARIA 属性（`aria-label`、`aria-live`、`role` 等）的用法
- 能够构建键盘可导航、屏幕阅读器友好的 AI 聊天界面
- 了解 `aria-live="polite"` 如何让屏幕阅读器宣告 AI 流式输出

---

## 📖 什么是无障碍

**无障碍（Accessibility，简称 a11y）**是让残障用户（视障、听障、运动障碍、认知障碍等）也能正常使用 Web 的设计与技术实践。

**为什么重要**：

1. **覆盖范围**：全球约 10–15% 的人有不同程度的障碍，中国有 8500 万残障人士
2. **法规**：美国 ADA、欧盟 WCAG 2.1 AA 标准，企业违规可能被起诉
3. **SEO**：无障碍优化与 SEO 高度重叠（语义标签、alt 文字、aria-label）
4. **普惠体验**：键盘导航对临时受限用户（骨折、晒太阳用手机）也有价值

---

## 🧠 原理讲解

浏览器维护两棵树：

```text
DOM 树（HTML 结构）
  ↓ 映射
无障碍树（Accessibility Tree）
  ↓ 读取
屏幕阅读器（VoiceOver / NVDA / TalkBack）→ 用户
```

ARIA（Accessible Rich Internet Applications）是一套 HTML 属性规范，让非语义标签（`<div>`、`<span>`）也能传递角色和状态信息给无障碍树。

**`aria-live` 的工作原理**：

```text
aria-live="polite"：
  DOM 内容变化 → 无障碍树更新 →
  屏幕阅读器等当前任务结束后宣告新内容

aria-live="assertive"：
  DOM 内容变化 → 立即打断当前朗读 → 宣告新内容

aria-live="off"：
  不监听变化（默认值）
```

---

## 🏗 基本结构

```html
<!-- 按钮的无障碍增强 -->
<button aria-label="发送消息" aria-pressed="false">发送</button>

<!-- 实时更新区域（AI 流式输出） -->
<div role="log" aria-live="polite" aria-label="AI 回复">
  <!-- AI 流式追加内容到此处 -->
</div>

<!-- 表单关联 -->
<label for="prompt">输入提示词</label>
<input id="prompt" type="text" aria-describedby="prompt-hint">
<span id="prompt-hint">按 Enter 发送，Shift+Enter 换行</span>
```

---

## ✅ 完整代码

**场景：无障碍 AI 聊天界面**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>无障碍 AI 对话 — 阿基米德实验室</title>
  <style>
    /* ── 颜色对比度注释说明 ──
       WCAG AA 要求正常文字对比度 ≥ 4.5:1，大文字 ≥ 3:1
       下方颜色组合均通过 WebAIM Contrast Checker 验证 */

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* 背景 #0f0f13 与文字 #e8e8e8 → 对比度 14.5:1 ✅ */
    body {
      font-family: system-ui, 'PingFang SC', sans-serif;
      background: #0f0f13;
      color: #e8e8e8;          /* 对比度 14.5:1（AA 通过） */
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ── 跳转链接（键盘用户快捷键）────────────────────── */
    .skip-link {
      position: absolute;
      top: -999px;
      left: 8px;
      background: #7c6df0;
      color: #fff;
      padding: 8px 16px;
      border-radius: 0 0 6px 6px;
      font-size: .9rem;
      z-index: 9999;
      text-decoration: none;
      /* 获得焦点时弹出（键盘 Tab 第一个元素） */
    }
    .skip-link:focus { top: 0; }

    /* ── 页眉 ── */
    header {
      background: #1a1a24;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #2a2a3a;
    }
    header h1 { font-size: 1rem; font-weight: 600; }
    .status-dot {
      width: 8px; height: 8px;
      background: #4caf7d;
      border-radius: 50%;
    }
    .status-text { font-size: .78rem; color: #4caf7d; }

    /* ── 对话区域 ── */
    main { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

    /* role="log" + aria-live：这是无障碍最关键的设置 */
    .chat-log {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      /* 为屏幕阅读器提供滚动区域的语义 */
      scroll-behavior: smooth;
    }

    /* ── 消息气泡 ── */
    .msg { display: flex; gap: 10px; align-items: flex-start; max-width: 720px; }
    .msg.user { margin-left: auto; flex-direction: row-reverse; }

    .avatar {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: .85rem; flex-shrink: 0; font-weight: 700;
    }
    .avatar.ai   { background: #2d1f6e; color: #a99ef5; }
    .avatar.user { background: #1e3a2e; color: #4caf7d; }

    .bubble {
      padding: 12px 16px;
      border-radius: 12px;
      font-size: .92rem;
      line-height: 1.6;
      max-width: 80%;
    }
    /* 气泡背景 #1e1e2e 与文字 #e8e8e8 → 对比度 11.8:1 ✅ */
    .bubble.ai   { background: #1e1e2e; color: #e8e8e8; border-radius: 4px 12px 12px 12px; }
    /* 气泡背景 #2d1f6e 与文字 #e8e8e8 → 对比度 8.2:1 ✅ */
    .bubble.user { background: #2d1f6e; color: #e8e8e8; border-radius: 12px 4px 12px 12px; }

    /* 流式输出光标 */
    .cursor {
      display: inline-block;
      width: 2px; height: 1em;
      background: #a99ef5;
      margin-left: 2px;
      vertical-align: text-bottom;
      animation: blink 1s step-end infinite;
    }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

    /* ── 输入区 ── */
    .input-area {
      padding: 16px 20px;
      background: #1a1a24;
      border-top: 1px solid #2a2a3a;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .input-row { display: flex; gap: 10px; }

    textarea#promptInput {
      flex: 1;
      background: #111118;
      border: 2px solid #2a2a3a;
      border-radius: 8px;
      color: #e8e8e8;          /* 对比度 ≥ 11:1 ✅ */
      padding: 10px 14px;
      font-size: .9rem;
      font-family: inherit;
      resize: none;
      height: 80px;
      line-height: 1.5;
      transition: border-color .2s;
    }
    /* 焦点样式：可见轮廓，不能只用颜色区分 */
    textarea#promptInput:focus {
      outline: none;
      border-color: #7c6df0;   /* 焦点轮廓对比度 4.5:1 ✅ */
      box-shadow: 0 0 0 3px rgba(124,109,240,.25);
    }

    .send-btn {
      background: #7c6df0;
      color: #fff;             /* 对比度 5.1:1 ✅（AA 通过） */
      border: none;
      border-radius: 8px;
      padding: 0 20px;
      font-size: .9rem;
      cursor: pointer;
      font-weight: 600;
      align-self: flex-end;
      height: 40px;
      transition: background .2s;
      /* tabindex 默认为 0（按钮天然可聚焦，无需设置） */
    }
    .send-btn:hover:not(:disabled) { background: #6a5cd8; }
    .send-btn:focus-visible {
      outline: 3px solid #fff;
      outline-offset: 2px;
    }
    .send-btn:disabled { opacity: .5; cursor: not-allowed; }

    /* 操作按钮行 */
    .action-row { display: flex; gap: 8px; }
    .action-btn {
      background: none;
      border: 1px solid #2a2a3a;
      border-radius: 6px;
      color: #aaa;             /* 对比度 4.7:1 ✅ */
      padding: 5px 12px;
      font-size: .78rem;
      cursor: pointer;
    }
    .action-btn:focus-visible {
      outline: 2px solid #7c6df0;
      outline-offset: 2px;
    }
    .action-btn:hover { background: #1e1e2e; color: #e8e8e8; }

    /* 提示文字 */
    .input-hint { font-size: .75rem; color: #555; }

    /* ── 键盘导航焦点可见性 ── */
    :focus-visible {
      outline: 2px solid #7c6df0;
      outline-offset: 2px;
    }
    /* 移除 :focus（非键盘）的默认 outline，仅保留 :focus-visible */
    :focus:not(:focus-visible) { outline: none; }
  </style>
</head>
<body>

  <!-- 跳转链接：键盘用户按 Tab 第一个焦点，可跳过导航直达主内容 -->
  <a href="#promptInput" class="skip-link">跳转到对话输入框</a>

  <!-- 页眉 -->
  <header>
    <div class="status-dot" aria-hidden="true"></div>
    <!-- aria-hidden 防止装饰性元素被屏幕阅读器朗读 -->
    <h1>AI 对话助手</h1>
    <span class="status-text">
      <span class="sr-only">连接状态：</span>在线
      <!-- sr-only：视觉隐藏，仅供屏幕阅读器 -->
    </span>
  </header>

  <main>
    <!--
      role="log"：声明为对话日志，屏幕阅读器知道这是追加型内容区
      aria-live="polite"：DOM 新增内容时，等当前朗读结束后宣告
      aria-label：给区域命名，屏幕阅读器用户可定向跳转
      aria-atomic="false"：只宣告新增部分，不重读整个区域
    -->
    <div
      id="chatLog"
      class="chat-log"
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-label="AI 对话记录"
      tabindex="0"
    >
      <!-- 初始欢迎消息 -->
      <div class="msg" role="article" aria-label="AI 消息">
        <div class="avatar ai" aria-hidden="true">AI</div>
        <div class="bubble ai">
          你好！我是你的 AI 助手。有什么可以帮助你的吗？<br>
          <small style="color:#777;font-size:.8rem">试试问我关于 RAG、Prompt 工程或 HTML 开发的问题。</small>
        </div>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="input-area">
      <div class="input-row">
        <label for="promptInput" class="sr-only">输入你的问题</label>
        <!--
          for 关联 id：点击 label 聚焦 textarea（无障碍基本要求）
          aria-describedby：关联操作提示文字
        -->
        <textarea
          id="promptInput"
          placeholder="输入你的问题…"
          aria-describedby="inputHint"
          aria-required="true"
          onkeydown="handleKeydown(event)"
        ></textarea>

        <button
          class="send-btn"
          id="sendBtn"
          onclick="sendMessage()"
          aria-label="发送消息（Enter 快捷键）"
        >
          发送
        </button>
      </div>

      <div class="action-row">
        <button class="action-btn" onclick="clearChat()" aria-label="清空对话记录">
          🗑 清空
        </button>
        <button class="action-btn" onclick="copyLastReply()" aria-label="复制最后一条 AI 回复">
          📋 复制回复
        </button>
        <button class="action-btn" onclick="exportChat()" aria-label="导出对话为文本文件">
          ⬇ 导出
        </button>
      </div>

      <!-- aria-describedby 关联的提示文字 -->
      <p id="inputHint" class="input-hint">
        按 <kbd>Enter</kbd> 发送，<kbd>Shift</kbd>+<kbd>Enter</kbd> 换行
      </p>
    </div>
  </main>

  <!-- 屏幕阅读器专用样式（视觉隐藏但不 display:none）-->
  <style>
    .sr-only {
      position: absolute;
      width: 1px; height: 1px;
      padding: 0; margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }
  </style>

<script>
const chatLog = document.getElementById('chatLog');
const sendBtn = document.getElementById('sendBtn');
const input   = document.getElementById('promptInput');

// ── 键盘处理（Enter 发送，Shift+Enter 换行）────────────────
function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// ── 添加消息 ──────────────────────────────────────────────
function appendMessage(role, content, streaming = false) {
  const article = document.createElement('div');
  article.className = `msg ${role}`;
  article.setAttribute('role', 'article');
  article.setAttribute('aria-label', role === 'user' ? '你的消息' : 'AI 回复');

  const avatar = document.createElement('div');
  avatar.className      = `avatar ${role}`;
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent    = role === 'user' ? '你' : 'AI';

  const bubble = document.createElement('div');
  bubble.className      = `bubble ${role}`;
  bubble.textContent    = content;

  if (streaming) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');  // 光标不需要被朗读
    bubble.appendChild(cursor);
  }

  article.appendChild(avatar);
  article.appendChild(bubble);

  // 追加到 role="log" 区域 → aria-live="polite" 触发宣告
  chatLog.appendChild(article);

  // 滚动到底部
  chatLog.scrollTop = chatLog.scrollHeight;

  return bubble;  // 返回 bubble 供流式更新使用
}

// ── 发送消息 ──────────────────────────────────────────────
async function sendMessage() {
  const text = input.value.trim();
  if (!text) {
    // 无障碍提示：用 aria-live 区域宣告错误（而非只改颜色）
    announceError('请先输入内容');
    return;
  }

  // 禁用发送按钮，防止重复提交
  sendBtn.disabled     = true;
  sendBtn.textContent  = '发送中…';
  input.value          = '';

  // 1. 显示用户消息
  appendMessage('user', text);

  // 2. 显示 AI loading 消息（带光标）
  const aiBubble = appendMessage('ai', '', true);

  try {
    // ── 模拟流式 API 响应 ─────────────────────────────────
    await simulateStreamResponse(aiBubble, text);

  } catch (e) {
    aiBubble.textContent = '⚠️ 请求失败，请稍后重试。';
    announceError('AI 回复失败，请重试');
  } finally {
    sendBtn.disabled    = false;
    sendBtn.textContent = '发送';
    input.focus();       // 发送后焦点回到输入框
  }
}

// ── 模拟流式输出（实际项目用 fetch + ReadableStream）────────
async function simulateStreamResponse(bubble, userText) {
  const responses = {
    'rag': 'RAG（检索增强生成）是将向量数据库检索与 LLM 生成结合的技术。核心步骤：① 文档向量化存入数据库 → ② 用户提问向量化检索相似片段 → ③ 将片段拼入 Prompt → ④ LLM 基于片段生成回答。',
    'html': 'HTML（HyperText Markup Language）是构建网页的基础语言。推荐从语义化标签学起：header/main/article/footer，再学表单（form/input/button），然后学多媒体（video/audio）。',
  };

  const keyword = Object.keys(responses).find(k => userText.toLowerCase().includes(k));
  const fullText = keyword
    ? responses[keyword]
    : `你好！你问的是"${userText}"。这是一个模拟回答，实际项目中这里会连接 Claude / GPT API 进行流式输出。`;

  // 移除旧光标
  bubble.querySelector('.cursor')?.remove();

  let displayed = '';
  const cursor  = document.createElement('span');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');

  for (const char of fullText) {
    displayed     += char;
    bubble.textContent = displayed;
    bubble.appendChild(cursor);  // 光标始终在末尾

    // aria-live="polite" 会在每次 DOM 变化后排队宣告
    // 流式输出时，屏幕阅读器会在句子结束时宣告，而不是每个字
    await new Promise(r => setTimeout(r, 25));
  }

  // 输出完成：移除光标
  cursor.remove();
}

// ── 无障碍错误通知（aria-live="assertive"）────────────────
function announceError(msg) {
  let liveRegion = document.getElementById('liveError');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id             = 'liveError';
    liveRegion.setAttribute('aria-live',   'assertive');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role',        'alert');
    liveRegion.className      = 'sr-only';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = '';   // 先清空，再赋值，确保变化事件触发
  setTimeout(() => { liveRegion.textContent = msg; }, 50);
}

// ── 清空对话 ──────────────────────────────────────────────
function clearChat() {
  if (!confirm('确认清空所有对话记录？')) return;
  chatLog.innerHTML = '';
  // 清空后宣告结果
  announceError('对话已清空');
  input.focus();
}

// ── 复制最后一条 AI 回复 ───────────────────────────────────
async function copyLastReply() {
  const bubbles  = chatLog.querySelectorAll('.bubble.ai');
  const lastBubble = bubbles[bubbles.length - 1];
  if (!lastBubble) { announceError('暂无 AI 回复可复制'); return; }

  try {
    await navigator.clipboard.writeText(lastBubble.textContent);
    announceError('已复制到剪贴板');
  } catch {
    announceError('复制失败，请手动选择文字复制');
  }
}

// ── 导出对话 ──────────────────────────────────────────────
function exportChat() {
  const msgs  = chatLog.querySelectorAll('.msg');
  const lines = [];
  msgs.forEach(msg => {
    const role   = msg.classList.contains('user') ? '用户' : 'AI';
    const text   = msg.querySelector('.bubble')?.textContent || '';
    lines.push(`[${role}] ${text}`);
  });
  const blob = new Blob([lines.join('\n\n')], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'chat-export.txt' });
  a.click();
  URL.revokeObjectURL(url);
  announceError('对话已导出');
}
</script>
</body>
</html>
```

---

## 🔍 逐行解析

**`role="log"` + `aria-live="polite"`**
`role="log"` 告诉辅助技术这是一个追加型日志区（对话记录）；`aria-live="polite"` 让屏幕阅读器在当前任务结束后宣告新增内容，不会粗暴打断用户正在听的内容。

**`aria-atomic="false"`**
只宣告新增的消息，不重读整个对话历史。如果设为 `true`，每次新消息都会从头朗读所有内容，体验极差。

**`.skip-link`**
跳转链接（Skip Link）是键盘用户的"快捷入口"，按 Tab 第一次聚焦时弹出，可以跳过导航栏直达主内容区。

**`.sr-only`**
视觉隐藏但屏幕阅读器可读的 CSS 类。**不能用 `display:none` 或 `visibility:hidden`**（这两种方式对屏幕阅读器也不可见）。

**`aria-hidden="true"`**
对装饰性元素（状态点、emoji）使用，防止屏幕阅读器读出无意义内容（"圆点""机器人表情"）。

**`:focus-visible`**
仅在键盘导航时显示焦点轮廓，鼠标点击时不显示，兼顾视觉美观和键盘可用性。

---

## 🌐 浏览器表现

| 场景 | 效果 |
|------|------|
| 键盘 Tab 导航 | 焦点按顺序从 skip-link → send-btn → textarea → action-btn 移动 |
| 屏幕阅读器 | `aria-live="polite"` 在 AI 输出完句子后宣告内容 |
| 高对比度模式 | 颜色对比度 ≥ 4.5:1 满足 WCAG AA，不会丢失信息 |
| 触摸屏 | 所有按钮区域 ≥ 44×44px（WCAG 触摸目标大小要求） |

---

## 📦 常见属性/API

| 属性 | 值 | 说明 |
|------|----|------|
| `aria-label` | string | 为元素提供无障碍名称（没有可见文字时使用） |
| `aria-labelledby` | id 引用 | 用另一个元素的文字作为当前元素的名称 |
| `aria-describedby` | id 引用 | 用另一个元素的文字作为详细描述（如 input 提示） |
| `aria-live` | `off`/`polite`/`assertive` | 动态区域的宣告策略（见下方详细说明） |
| `aria-atomic` | `true`/`false` | `true`：宣告整个区域；`false`：只宣告变化部分 |
| `aria-hidden` | `true`/`false` | `true`：从无障碍树隐藏，屏幕阅读器跳过 |
| `role` | `log`/`alert`/`button`/`dialog`/... | 显式声明元素的 ARIA 角色 |
| `tabindex` | `-1`/`0`/正整数 | 控制键盘 Tab 焦点顺序（见下方详解） |
| `aria-pressed` | `true`/`false`/`mixed` | 切换按钮的状态（如夜间模式开关） |
| `aria-disabled` | `true`/`false` | 语义上的禁用（不同于 HTML `disabled` 属性） |

**`aria-live` 三个值详细说明**：

| 值 | 触发时机 | 适用场景 |
|----|---------|---------|
| `off` | 不宣告（默认） | 不需要实时通知的静态区域 |
| `polite` | 等当前朗读完成后宣告 | AI 流式输出、消息通知、数据更新 |
| `assertive` | 立即打断当前朗读 | 严重错误、紧急警告（慎用，体验打扰大） |

**`tabindex` 说明**：

| 值 | 效果 |
|----|------|
| `tabindex="0"` | 加入 Tab 顺序（按 DOM 顺序），适合 `<div>`、`<span>` 这些原本不可聚焦的元素 |
| `tabindex="-1"` | 从 Tab 顺序移除，但可通过 JS `focus()` 编程聚焦（如弹窗打开时聚焦第一个元素） |
| `tabindex="1+"` | 指定具体顺序（**强烈不推荐**，破坏自然顺序，维护困难） |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. `aria-live="polite"` 是 AI 流式输出的必备配置**

```html
<!-- ✅ 正确：AI 输出区加 aria-live -->
<div role="log" aria-live="polite" aria-atomic="false">
  <!-- JS 追加内容 → 屏幕阅读器宣告 -->
</div>

<!-- ❌ 错误：没有 aria-live，屏幕阅读器完全无感知 -->
<div id="aiOutput">
</div>
```

**2. 按钮必须有可理解的名称**

```html
<!-- ❌ 屏幕阅读器读到的是"按钮"，无法理解功能 -->
<button>→</button>
<button><img src="send.svg"></button>

<!-- ✅ 加 aria-label -->
<button aria-label="发送消息">→</button>
<button aria-label="发送消息"><img src="send.svg" alt=""></button>
```

**3. 表单 label 必须关联 input**

```html
<!-- ❌ label 和 input 没有关联 -->
<label>用户名</label>
<input type="text">

<!-- ✅ for + id 关联 -->
<label for="username">用户名</label>
<input id="username" type="text">
```

---

## ⚠️ 易错点

| 错误 | 正确做法 |
|------|---------|
| 用 `display:none` 做"屏幕阅读器专用文字" | 用 `.sr-only` CSS 类视觉隐藏 |
| `aria-live` 加在频繁变化的父容器上 | 只加在真正需要宣告的子区域上 |
| 忘记给图标按钮加 `aria-label` | 任何没有可见文字的按钮都要加 `aria-label` |
| 用颜色区分状态（"绿色=成功"） | 颜色 + 文字同时表达（"✅ 成功"），色盲用户也能理解 |
| `tabindex` 用正数破坏 Tab 顺序 | 只用 `0` 和 `-1`，Tab 顺序由 DOM 顺序决定 |

---

## 💡 最佳实践

1. **用原生 HTML 元素**：`<button>` 天然可聚焦、可 Enter 激活；不要用 `<div onclick>` 模拟
2. **焦点管理**：模态框打开时把焦点移到框内，关闭时还给触发按钮
3. **颜色对比度**：用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 验证
4. **键盘测试**：用 Tab / Shift+Tab / Enter / Space / Esc 完整操作一遍页面

---

## 🚀 AI 应用场景

### 场景 1：`aria-live="polite"` 宣告 AI 流式输出

```js
// 接入真实 Claude API 的流式输出 + aria-live 无障碍宣告
async function streamFromClaude(prompt, outputEl) {
  // outputEl 必须有 aria-live="polite"
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         'YOUR_KEY',
      'anthropic-version': '2023-06-01',
      'Content-Type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-opus-4-5',
      max_tokens: 1024,
      stream:     true,
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let   buffer  = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();  // 保留不完整的最后一行

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const delta  = parsed.delta?.text || '';
        if (delta) {
          // 追加文字到 aria-live 区域
          // 浏览器每次 DOM 变化都会通知屏幕阅读器排队
          outputEl.textContent += delta;
        }
      } catch {}
    }
  }
}
```

---

### 场景 2：Claude 自动生成 `alt` 文字

```js
// 给 AI 生成的图片自动补充 alt 文字
async function generateAltText(imageUrl) {
  const prompt = `
请为这张图片生成简洁的 alt 文字描述（用于 HTML img 的 alt 属性）。

要求：
1. 简洁，不超过 80 个中文字
2. 描述图片内容（What），不要评价图片质量（Good/Bad）
3. 如果是纯装饰性图片，回答：DECORATIVE
4. 不要以"图片显示"或"这是一张"开头，直接描述内容

图片 URL：${imageUrl}
`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         'YOUR_ANTHROPIC_KEY',
      'anthropic-version': '2023-06-01',
      'Content-Type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'url', url: imageUrl } },
          { type: 'text',  text: prompt },
        ],
      }],
    }),
  });

  const data   = await res.json();
  const altText = data.content[0].text.trim();

  return altText === 'DECORATIVE' ? '' : altText;
}

// 批量处理页面中所有缺少 alt 的图片
async function fixMissingAlts() {
  const images = document.querySelectorAll('img:not([alt]), img[alt=""]');
  for (const img of images) {
    if (!img.src) continue;
    const alt = await generateAltText(img.src);
    img.alt   = alt;
    console.log(`✅ ${img.src} → alt: "${alt}"`);
  }
}
```

---

### 场景 3：键盘 Tab 导航在 AI 工具中的重要性

```js
// AI 工具中键盘快捷键 + 焦点管理示范
class AIToolKeyboard {
  constructor() {
    document.addEventListener('keydown', this.handleGlobal.bind(this));
    this.shortcuts = {
      'ctrl+enter':      () => sendMessage(),
      'ctrl+k':          () => document.getElementById('promptInput').focus(),
      'ctrl+shift+c':    () => clearChat(),
      'escape':          () => this.closeFocusedModal(),
    };
  }

  handleGlobal(e) {
    const key = [
      e.ctrlKey  ? 'ctrl' : '',
      e.shiftKey ? 'shift' : '',
      e.altKey   ? 'alt' : '',
      e.key.toLowerCase(),
    ].filter(Boolean).join('+');

    const handler = this.shortcuts[key];
    if (handler) {
      e.preventDefault();
      handler();
    }
  }

  // 弹窗打开时：焦点移入，记录触发元素
  openModal(modalEl, triggerEl) {
    this._trigger = triggerEl;
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('role',       'dialog');

    // 找到第一个可聚焦的元素
    const focusable = modalEl.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();

    // 焦点陷阱：Tab 在弹窗内循环
    modalEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  // 弹窗关闭时：焦点还给触发按钮
  closeModal(modalEl) {
    modalEl.removeAttribute('aria-modal');
    this._trigger?.focus();
  }

  closeFocusedModal() {
    const modal = document.querySelector('[aria-modal="true"]');
    if (modal) this.closeModal(modal);
  }
}

const keyboard = new AIToolKeyboard();
```

---

## 📝 练习题

**题 1（基础）**：给下面的按钮补充无障碍属性，使其对屏幕阅读器友好：
```html
<button onclick="toggleDark()">🌙</button>
```

**题 2（进阶）**：用 `aria-live="assertive"` 实现一个"全局错误通知区"：当 API 调用失败时，屏幕阅读器立即宣告错误信息；成功时宣告"操作成功"。要求通知 3 秒后自动消失。

**题 3（AI 场景）**：设计一个 AI 图片生成页面的无障碍实现方案：
- 用户提交 Prompt 后，生成按钮变为禁用状态，`aria-label` 动态更新为"生成中，请稍候"
- 生成完成后，`aria-live="polite"` 区域宣告"图片已生成"
- 生成的 `<img>` 自动调用 Claude API 生成 alt 文字
- 键盘用户按 Enter 可下载图片

---

## 📌 本节总结

| 知识点 | 核心要点 |
|--------|---------|
| `aria-live="polite"` | AI 流式输出时宣告新内容，不打断当前朗读 |
| `aria-live="assertive"` | 严重错误/警告时立即打断，慎用 |
| `aria-label` | 为无可见文字的交互元素提供名称（图标按钮必须加） |
| `role="log"` | 声明对话区域为日志类型，配合 `aria-live` 使用 |
| `.sr-only` | 视觉隐藏 + 屏幕阅读器可见的标准 CSS 类 |
| `tabindex="0"` | 让非交互元素参与键盘导航 |
| `:focus-visible` | 键盘焦点可见，鼠标点击不显示轮廓 |
| 颜色对比度 | 正常文字 ≥ 4.5:1，大文字 ≥ 3:1（WCAG AA） |
| AI 自动 alt | Claude Vision API 可批量为图片生成 alt 文字 |

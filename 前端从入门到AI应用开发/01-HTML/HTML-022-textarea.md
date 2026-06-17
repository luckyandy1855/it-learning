# 多行文本框 <textarea>（HTML-022）

---

## 🎯 本节学习目标

- 掌握 `<textarea>` 与 `<input type="text">` 的本质区别
- 理解 `rows`、`cols`、`maxlength`、`placeholder` 等核心属性
- 学会用 JavaScript 实现 auto-resize 自动扩展高度
- 能够构建 AI 提示词编辑器：含字符计数、快捷键发送、行高亮

---

## 📖 什么是 `<textarea>`？

`<textarea>` 是 HTML 中用于**多行文本输入**的控件。与 `<input type="text">` 的单行输入不同，`<textarea>` 支持用户输入换行符，适合长文本场景：

- AI 提示词编写（多段落、多行指令）
- 评论、留言、文章草稿
- 代码片段输入
- 系统提示词（System Prompt）配置

```html
<textarea name="prompt" rows="6" placeholder="请输入你的提示词…"></textarea>
```

**关键区别**：`<textarea>` 有开始和结束标签，默认内容写在两个标签之间，而不是 `value` 属性。

---

## 🧠 原理讲解

`<textarea>` 的高度由 `rows` 决定（初始行数），宽度由 `cols` 或 CSS `width` 决定。用户可以拖动右下角的 resize 手柄改变大小（可通过 CSS `resize: none` 禁用）。

**auto-resize 原理**：当文本内容超过初始高度时，`scrollHeight` 会大于 `clientHeight`。我们将元素高度设为 `scrollHeight`，就实现了内容驱动的自动扩展：

```js
textarea.style.height = 'auto';          // 先重置，让 scrollHeight 收缩
textarea.style.height = textarea.scrollHeight + 'px'; // 再撑开到内容高度
```

**token 估算原理**：LLM 的 token 数约等于英文单词数，中文大致是字符数 × 1.5。粗略估算：`tokenCount ≈ text.length / 4`（英文偏准，中文偏低）。

---

## 🏗 基本结构

```html
<textarea
  id="editor"
  name="prompt"
  rows="8"
  cols="60"
  maxlength="4000"
  placeholder="请在此输入提示词…"
  spellcheck="false"
>默认内容写在这里</textarea>
```

- `rows` — 初始可见行数（默认 2）
- `cols` — 初始可见列数（通常用 CSS width 代替）
- `maxlength` — 最大字符数限制
- `placeholder` — 空内容时显示的提示文字
- `spellcheck="false"` — 关闭红色拼写检查波浪线（代码/提示词场景常用）

---

## ✅ 完整代码：AI 提示词编辑器

一个接近真实 AI 产品的提示词编辑器，含 auto-resize、字符计数、Ctrl+Enter 发送、当前行高亮：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 提示词编辑器</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0d1117;
      color: #e1e4e8;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 48px 16px;
      min-height: 100vh;
    }

    .editor-container {
      width: 100%;
      max-width: 720px;
    }

    .editor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .editor-title {
      font-size: 14px;
      font-weight: 600;
      color: #8b949e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .shortcut-hint {
      font-size: 12px;
      color: #6e7681;
    }

    .shortcut-hint kbd {
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 4px;
      padding: 1px 5px;
      font-size: 11px;
      font-family: monospace;
    }

    .textarea-wrapper {
      position: relative;
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 10px;
      overflow: hidden;
      transition: border-color 0.2s;
    }

    .textarea-wrapper:focus-within {
      border-color: #58a6ff;
      box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.12);
    }

    #prompt-editor {
      width: 100%;
      min-height: 180px;
      background: transparent;
      border: none;
      color: #e1e4e8;
      font-family: "SF Mono", "Fira Code", "Consolas", monospace;
      font-size: 14px;
      line-height: 1.7;
      padding: 16px;
      resize: none;        /* 禁用手动拖拽 resize，改用 auto-resize */
      outline: none;
      overflow: hidden;    /* 配合 auto-resize，隐藏滚动条 */
      spellcheck: false;
    }

    #prompt-editor::placeholder {
      color: #484f58;
    }

    /* 底部工具栏 */
    .editor-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      background: #0d1117;
      border-top: 1px solid #21262d;
    }

    .stats {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #6e7681;
    }

    .stats .warn { color: #f85149; }
    .stats .ok   { color: #3fb950; }

    .send-btn {
      background: #238636;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      padding: 6px 16px;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .send-btn:hover { background: #2ea043; }
    .send-btn:disabled {
      background: #21262d;
      color: #484f58;
      cursor: not-allowed;
    }

    /* 当前行高亮（通过 JS 动态添加 class） */
    .line-highlight-overlay {
      position: absolute;
      left: 0;
      right: 0;
      pointer-events: none;
      background: rgba(88, 166, 255, 0.05);
      border-left: 2px solid rgba(88, 166, 255, 0.3);
      transition: top 0.1s ease;
    }

    .status-bar {
      margin-top: 8px;
      font-size: 12px;
      color: #6e7681;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="editor-container">
    <div class="editor-header">
      <span class="editor-title">提示词编辑器（System Prompt）</span>
      <span class="shortcut-hint">
        发送：<kbd>Ctrl</kbd>+<kbd>Enter</kbd>
      </span>
    </div>

    <div class="textarea-wrapper">
      <!-- 行高亮覆盖层 -->
      <div class="line-highlight-overlay" id="line-highlight"></div>

      <textarea
        id="prompt-editor"
        name="prompt"
        rows="8"
        maxlength="8000"
        spellcheck="false"
        autocomplete="off"
        placeholder="在此输入你的提示词…

示例：
你是一位专业的代码审查助手。
请用中文回复，指出代码中的问题并给出改进建议。
每个问题请标注严重程度：🔴 严重 / 🟡 警告 / 🟢 建议"
      ></textarea>

      <div class="editor-footer">
        <div class="stats">
          <span id="char-stat">0 字符</span>
          <span id="token-est">≈ 0 tokens</span>
          <span id="line-stat">第 1 行</span>
        </div>
        <button class="send-btn" id="send-btn" disabled>
          ↑ 发送
        </button>
      </div>
    </div>

    <div class="status-bar">
      <span id="status-msg">输入提示词后按 Ctrl+Enter 发送</span>
      <span>最大 8000 字符</span>
    </div>
  </div>

  <script>
    const editor = document.getElementById('prompt-editor');
    const charStat = document.getElementById('char-stat');
    const tokenEst = document.getElementById('token-est');
    const lineStat = document.getElementById('line-stat');
    const sendBtn = document.getElementById('send-btn');
    const statusMsg = document.getElementById('status-msg');
    const lineHighlight = document.getElementById('line-highlight');

    const MAX_LEN = 8000;

    // ── auto-resize：内容驱动自动扩展高度 ──
    function autoResize() {
      editor.style.height = 'auto';
      editor.style.height = editor.scrollHeight + 'px';
    }

    // ── 更新统计信息 ──
    function updateStats() {
      const text = editor.value;
      const len = text.length;
      const lines = text.split('\n');
      const tokenCount = Math.ceil(len / 4); // 粗略估算

      // 字符计数（临近上限时变红）
      const isWarn = len > MAX_LEN * 0.9;
      charStat.textContent = `${len.toLocaleString()} 字符`;
      charStat.className = isWarn ? 'warn' : '';

      // Token 估算
      tokenEst.textContent = `≈ ${tokenCount.toLocaleString()} tokens`;

      // 当前光标所在行号
      const cursorPos = editor.selectionStart;
      const textBeforeCursor = text.substring(0, cursorPos);
      const currentLine = textBeforeCursor.split('\n').length;
      lineStat.textContent = `第 ${currentLine} 行 / 共 ${lines.length} 行`;

      // 发送按钮状态
      sendBtn.disabled = len === 0;
    }

    // ── 行高亮：计算当前行的 top 位置 ──
    function updateLineHighlight() {
      const text = editor.value;
      const cursorPos = editor.selectionStart;
      const textBeforeCursor = text.substring(0, cursorPos);
      const lineIndex = textBeforeCursor.split('\n').length - 1;

      const lineHeight = parseFloat(getComputedStyle(editor).lineHeight);
      const paddingTop = parseFloat(getComputedStyle(editor).paddingTop);
      const top = paddingTop + lineIndex * lineHeight;

      lineHighlight.style.top = top + 'px';
      lineHighlight.style.height = lineHeight + 'px';
    }

    // ── 主事件：input 时更新所有状态 ──
    editor.addEventListener('input', () => {
      autoResize();
      updateStats();
      updateLineHighlight();
    });

    // ── 光标移动时更新行号和高亮 ──
    editor.addEventListener('keyup', updateLineHighlight);
    editor.addEventListener('click', updateLineHighlight);

    // ── Ctrl+Enter 发送 ──
    editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (editor.value.trim()) {
          handleSend();
        }
      }
    });

    // ── 发送按钮点击 ──
    sendBtn.addEventListener('click', handleSend);

    function handleSend() {
      const prompt = editor.value.trim();
      if (!prompt) return;

      // 模拟发送状态
      sendBtn.disabled = true;
      sendBtn.textContent = '发送中…';
      statusMsg.textContent = `正在发送 ${prompt.length} 字符的提示词…`;

      // 实际项目中这里调用 fetch('/api/chat', {...})
      setTimeout(() => {
        console.log('发送提示词:', prompt);
        statusMsg.textContent = '✅ 发送成功（模拟）';
        sendBtn.textContent = '↑ 发送';
        sendBtn.disabled = false;
      }, 1200);
    }

    // 初始化
    updateStats();
    updateLineHighlight();
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

| 代码片段 | 说明 |
|---|---|
| `rows="8"` | 初始显示 8 行高度，auto-resize 后可继续增长 |
| `resize: none` | CSS 禁用手动拖拽 resize 手柄，由 JS 控制高度 |
| `overflow: hidden` | 配合 auto-resize，内容撑开后不出现滚动条 |
| `spellcheck="false"` | 关闭拼写检查，避免代码/专业词汇被标红波浪线 |
| `editor.scrollHeight` | 内容实际高度（包含不可见区域），auto-resize 的核心 |
| `text.length / 4` | Token 数粗略估算，实际应调用 tokenizer API |
| `e.ctrlKey && e.key === 'Enter'` | 检测 Ctrl+Enter 组合键，`metaKey` 兼容 macOS Cmd |
| `textBeforeCursor.split('\n').length` | 计算光标所在行号：光标前文本按换行分割的数组长度 |

---

## 🌐 浏览器表现

- **默认 resize** — 右下角有拖拽手柄，CSS `resize: vertical / horizontal / none / both` 控制
- **换行行为** — 用户按 Enter 插入换行符，`wrap="hard"` 可在提交时将视觉换行转为实际 `\n`
- **默认内容** — 写在开闭标签之间（包含前后空白），用 JS 设置时用 `textarea.value = "..."`
- **移动端** — 软键盘弹出时，`rows` 指定的高度不变，内容超出则出现滚动条（除非设置了 auto-resize）

---

## 📦 常见属性 / API

| 属性 | 值类型 | 说明 | AI 场景 |
|---|---|---|---|
| `rows` | 整数 | 初始可见行数，默认 2 | 设置提示词输入框初始高度 |
| `cols` | 整数 | 初始可见列数，通常用 CSS 代替 | 基本不用，建议用 `width: 100%` |
| `maxlength` | 整数 | 最大字符数，超出无法输入 | 限制提示词长度，避免超出 context window |
| `minlength` | 整数 | 最小字符数，提交时校验 | 确保提示词不为空（但 `required` 更常用） |
| `placeholder` | 字符串 | 空内容时显示的提示文字 | 展示提示词示例，引导用户写出好的 prompt |
| `readonly` | 布尔 | 只读，不可编辑但可选中复制 | 展示 AI 生成的 System Prompt 供用户复制 |
| `disabled` | 布尔 | 禁用，不可操作，不参与提交 | AI 响应中禁用输入框，防止重复发送 |
| `wrap` | `soft`/`hard` | `hard` 在提交时把视觉换行转为 `\n` | 代码类提示词用 `hard` 保留格式 |
| `spellcheck` | `true`/`false` | 是否显示拼写检查波浪线 | 代码、专业术语场景设为 `false` |

**JavaScript API：**

| API | 说明 |
|---|---|
| `textarea.value` | 读取/设置内容 |
| `textarea.scrollHeight` | 内容实际高度（auto-resize 核心） |
| `textarea.selectionStart` | 光标起始位置（字符索引） |
| `textarea.selectionEnd` | 光标结束位置（选中时与 `selectionStart` 不同） |
| `textarea.setSelectionRange(s, e)` | JS 控制光标位置或选中范围 |
| `textarea.focus()` | 将焦点移到 textarea |
| `input` 事件 | 内容变化时触发（推荐，兼容粘贴/拖拽） |
| `change` 事件 | 失去焦点且内容改变时触发（不实时） |

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **`<textarea>` 没有 `value` 属性** — 默认内容写在标签之间；JS 读写用 `.value`
2. **auto-resize 两步操作** — 先设 `height: auto` 收缩，再设 `scrollHeight`，缺一不可
3. **`input` 事件比 `change` 实时** — AI 场景几乎全用 `input` 事件做实时监听
4. **`wrap="hard"` 提交行为** — 启用后，80 列处会插入实际换行符，默认 `wrap="soft"` 只是视觉换行
5. **spellcheck 影响代码类内容** — 提示词含代码时必须关闭，否则变量名全变红色

---

## ⚠️ 易错点

**1. 默认内容不要有多余空白**

```html
<!-- ❌ 错误：value 前后有换行，用户看到多余空白 -->
<textarea name="prompt">
  你好世界
</textarea>

<!-- ✅ 正确：紧挨着标签 -->
<textarea name="prompt">你好世界</textarea>

<!-- ✅ 或者用 JS 设置，最干净 -->
<textarea name="prompt" id="editor"></textarea>
<script>document.getElementById('editor').value = '你好世界';</script>
```

**2. `resize: none` 要配合 auto-resize 使用**

```css
/* 禁用手动 resize，改用 JS auto-resize */
textarea { resize: none; overflow: hidden; }
```

如果只写 `resize: none` 却没实现 auto-resize，内容超出时会出现滚动条，体验极差。

**3. Ctrl+Enter 与表单 submit 的冲突**

```js
editor.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault(); // 阻止触发 form submit
    handleSend();
  }
});
```

**4. Token 估算≠实际 Token**

`text.length / 4` 是英文经验值，中文 1 字≈1.5 token。精确计算需调用 `tiktoken`（openai 库）或 API 的 `/tokenize` 端点。

---

## 💡 最佳实践

1. **始终设置 `spellcheck="false"`** — 提示词编辑器场景，拼写检查会误报专业术语
2. **auto-resize 设置最小高度** — 避免空内容时 textarea 塌缩为 0

```css
textarea { min-height: 120px; }
```

3. **`maxlength` 配合字符计数 UI** — 用户看不到上限时不知道还能输入多少

4. **移动端设置 `font-size: 16px`** — 低于 16px 会触发 iOS Safari 自动缩放，破坏布局

5. **发送期间禁用编辑框**

```js
editor.disabled = true;  // 发送中禁止修改
// AI 响应完成后
editor.disabled = false;
editor.focus();
```

---

## 🚀 AI 应用场景

### 场景一：大模型提示词编辑器 auto-resize

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Auto-resize 提示词编辑器</title>
  <style>
    body { font-family: system-ui; background: #1a1a2e; color: #eee; padding: 32px; }
    .wrapper {
      background: #16213e;
      border: 1px solid #30363d;
      border-radius: 10px;
      overflow: hidden;
    }
    textarea {
      width: 100%;
      min-height: 120px;
      background: transparent;
      border: none;
      color: #e1e4e8;
      font-size: 14px;
      line-height: 1.7;
      padding: 16px;
      resize: none;
      outline: none;
      overflow: hidden;
      font-family: monospace;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      border-top: 1px solid #21262d;
      font-size: 12px;
      color: #6e7681;
    }
    button {
      background: #238636;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 6px 14px;
      cursor: pointer;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <textarea id="ta" placeholder="输入提示词…"></textarea>
    <div class="footer">
      <span>
        <span id="chars">0</span> 字符 ·
        <span id="tokens">≈ 0</span> tokens
      </span>
      <button onclick="send()">发送 Ctrl+Enter</button>
    </div>
  </div>

  <script>
    const ta = document.getElementById('ta');
    const charsEl = document.getElementById('chars');
    const tokensEl = document.getElementById('tokens');

    ta.addEventListener('input', () => {
      // auto-resize
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';

      // 统计
      const len = ta.value.length;
      charsEl.textContent = len.toLocaleString();
      tokensEl.textContent = '≈ ' + Math.ceil(len / 4).toLocaleString();
    });

    ta.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        send();
      }
    });

    function send() {
      if (!ta.value.trim()) return;
      console.log('发送:', ta.value);
      alert('已发送（查看控制台）');
    }
  </script>
</body>
</html>
```

### 场景二：实时 token 估算 + Ctrl+Enter 完整版

```js
// 更精准的中文 token 估算
function estimateTokens(text) {
  // 中文字符（每字约 1.5 token）
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  // 英文单词（每词约 1.3 token）
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  // 数字和符号（每个约 0.5 token）
  const others = text.length - chineseChars - englishWords;

  return Math.ceil(chineseChars * 1.5 + englishWords * 1.3 + others * 0.5);
}

// 使用
textarea.addEventListener('input', () => {
  const tokens = estimateTokens(textarea.value);
  document.getElementById('token-count').textContent = `≈ ${tokens} tokens`;

  // 接近 context limit 时警告（以 GPT-4o 128K 为例）
  if (tokens > 100000) {
    document.getElementById('token-count').style.color = '#f85149';
  }
});
```

---

## 📝 练习题

**基础题**

1. 创建一个 `<textarea>`，最多 200 字符，初始显示 5 行，placeholder 为"请简要描述你的需求"，并且关闭拼写检查。

2. 用 JavaScript 监听一个 `<textarea>` 的 `input` 事件，实时在旁边的 `<span>` 中显示已输入字符数，格式为"已输入 X / 500 字符"。

3. `textarea.value` 和写在标签之间的默认内容有什么区别？哪种方式更推荐用于动态设置内容？

**进阶题**

4. 实现 auto-resize：当用户输入内容超过初始高度时，textarea 自动增高，内容不超时高度恢复。要求：最小高度 100px，最大高度 400px（超出后出现滚动条）。

**AI 场景题**

5. 构建一个"AI System Prompt 编辑器"：
   - `<textarea>` 初始高度 6 行，支持 auto-resize，最大高度 500px
   - 底部实时显示：字符数、估算 token 数（用 `length/4` 粗算）、当前行数
   - 按 `Ctrl+Enter` 触发保存，`console.log` 输出提示词内容
   - 字符数超过 2000 时，底部字符数显示变红色并提示"提示词较长，可能影响响应速度"
   - 提供一个"清空"按钮，点击后清空内容并将焦点移回 textarea

---

## 📌 本节总结

| 知识点 | 核心结论 |
|---|---|
| `<textarea>` vs `<input>` | textarea 支持多行，有开闭标签，默认内容写在标签中间 |
| auto-resize 原理 | 先 `height:auto` 收缩，再设 `scrollHeight`，必须配合 `overflow:hidden` |
| token 估算 | `length / 4` 是英文粗估，中文偏低；精确需调用 tokenizer |
| Ctrl+Enter 发送 | 监听 `keydown`，检查 `ctrlKey + key==='Enter'`，必须 `preventDefault()` |
| 必须关闭 spellcheck | 代码/专业词汇场景用 `spellcheck="false"` 避免干扰 |
| 发送中禁用 textarea | `disabled=true` 防止重复提交，响应完成后 `focus()` 回来 |

`<textarea>` 是 AI 应用中最核心的输入控件，几乎每个 AI 聊天界面都有它的身影。下一节学习 `<select>` 下拉选择框，用于 AI 模型选择器的构建。

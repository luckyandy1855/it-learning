# `<title>` 标签（HTML-008）

## 🎯 本节学习目标

学完本节，你将能够：

- 理解 `<title>` 标签的作用范围和限制
- 掌握 `document.title` API 的使用方法
- 用 JavaScript 实现 AI 对话状态的动态 title 更新
- 实现"浏览器 Tab Notification"效果，在标签页显示未读消息数

---

## 📖 什么是 `<title>` 标签

`<title>` 标签定义文档的**标题**，是 HTML 中唯一必须存在于 `<head>` 内的文本内容标签。

`<title>` 的内容会出现在以下三个地方：

```text
<title> 的显示位置
    ├── 浏览器标签栏        → 标签页左上角的文字
    ├── 浏览器收藏夹        → 用户收藏页面时的默认名称
    └── 搜索引擎结果页      → 搜索结果中的蓝色可点击标题
```

`<title>` 只能包含纯文本，不能包含任何 HTML 标签：

```html
<!-- 正确 -->
<title>AI 助手 — ClaudeHelper</title>

<!-- 错误：<title> 内的 HTML 标签会被当作文本输出 -->
<title><strong>AI 助手</strong></title>
```

---

## 🧠 原理讲解

### `<title>` 在浏览器中的处理机制

```text
浏览器解析 HTML
    ↓
遇到 <title>...</title>
    ├── 提取文本内容（strip 所有标签）
    ├── 写入浏览器进程的 Tab 标题区域
    ├── 更新 window.document.title 属性
    └── 异步通知操作系统（用于任务栏、Alt+Tab 切换显示）

document.title = '新标题'
    ├── 直接更新 Tab 显示（同步，立即生效）
    ├── 不修改 HTML 源码中的 <title> 标签
    └── 操作系统 Alt+Tab 界面同步更新
```

### `document.title` 的工作原理

`document.title` 是 `Document` 接口上的一个字符串属性，读写均支持：

- **读取**：返回当前 `<title>` 标签的文本内容（或通过 JS 最后一次设置的值）
- **写入**：立即更新浏览器标签栏显示，不触发页面刷新

这个特性让"动态 title"成为可能——无需刷新页面，仅通过 JS 就能实时修改标签栏文字，给用户传递状态信息。

### SEO 视角：`<title>` 的权重

在搜索引擎优化中，`<title>` 是**权重最高的页面内容**之一：

```text
SEO 权重排序（从高到低）
    1. <title>         ← 最高权重，直接影响排名关键词
    2. <h1>            ← 页面主标题
    3. <meta description> ← 不直接影响排名，影响点击率
    4. 正文内容         ← 关键词密度
```

---

## 🏗 基本结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>页面标题 — 网站名称</title>
</head>
<body>
  <!-- 页面内容 -->
</body>
</html>
```

推荐的 `<title>` 格式：`页面主题 — 品牌/网站名称`

- 页面主题在前（搜索结果截断时保留最重要信息）
- 品牌名在后（品牌曝光）
- 用破折号（`—`）或竖线（`|`）分隔

---

## ✅ 完整代码

以下代码演示 AI 对话过程中动态修改 title 的完整实现：从"AI助手"→"正在思考..."→"Claude - 已回复 3 条消息"，以及浏览器 Tab Notification 效果。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI助手 — ClaudeHelper</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f8fafc; }
    .chat-container {
      max-width: 640px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .chat-header {
      background: #6366f1;
      color: white;
      padding: 16px 20px;
      font-size: 16px;
      font-weight: 600;
    }
    .chat-messages {
      padding: 20px;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .message {
      padding: 12px 16px;
      border-radius: 8px;
      max-width: 80%;
      line-height: 1.5;
    }
    .message.user {
      background: #6366f1;
      color: white;
      align-self: flex-end;
    }
    .message.ai {
      background: #f1f5f9;
      color: #334155;
      align-self: flex-start;
    }
    .message.thinking {
      background: #fef3c7;
      color: #92400e;
      align-self: flex-start;
      font-style: italic;
    }
    .chat-input-area {
      padding: 16px 20px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 10px;
    }
    .chat-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    .chat-input:focus { border-color: #6366f1; }
    .send-btn {
      padding: 10px 20px;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }
    .send-btn:disabled { background: #a5b4fc; cursor: not-allowed; }
    .status-bar {
      padding: 8px 20px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>

<div class="chat-container">
  <div class="chat-header">🤖 ClaudeHelper AI 助手</div>
  <div class="chat-messages" id="messages">
    <div class="message ai">你好！我是 Claude，有什么可以帮助你的？</div>
  </div>
  <div class="status-bar" id="status-bar">就绪</div>
  <div class="chat-input-area">
    <input class="chat-input" id="user-input" type="text" placeholder="输入消息..." />
    <button class="send-btn" id="send-btn" onclick="sendMessage()">发送</button>
  </div>
</div>

<script>
  // ═══════════════════════════════════════════════════
  // 核心：动态 title 管理器
  // ═══════════════════════════════════════════════════

  const TitleManager = {
    // 基础标题（始终作为前缀或后缀）
    baseTitle: 'ClaudeHelper',

    // 未读消息数（用于 Tab Notification）
    unreadCount: 0,

    // Tab Notification 闪烁定时器
    _flashTimer: null,
    _isFlashing: false,

    /**
     * 阶段一：空闲状态
     * 用户刚打开页面，显示产品名称
     */
    setIdle() {
      document.title = `AI助手 — ${this.baseTitle}`;
      this._updateStatusBar('就绪');
      console.log('[Title] 状态：空闲', document.title);
    },

    /**
     * 阶段二：用户发送消息后，AI 正在处理
     * 显示加载状态，让用户知道系统在工作
     */
    setThinking() {
      document.title = `⏳ 正在思考... — ${this.baseTitle}`;
      this._updateStatusBar('AI 正在生成回复...');
      console.log('[Title] 状态：思考中', document.title);
    },

    /**
     * 阶段三：AI 回复完成
     * 显示回复计数，提供有效信息
     * @param {number} replyCount - 当前对话中 AI 的回复次数
     */
    setReplied(replyCount) {
      document.title = `✅ ${this.baseTitle} - 已回复 ${replyCount} 条消息`;
      this._updateStatusBar(`AI 已完成回复（共 ${replyCount} 条）`);
      console.log('[Title] 状态：已回复', document.title);
    },

    /**
     * Tab Notification：页面隐藏时在 title 显示未读消息数
     * 模拟微信等 IM 应用的未读消息提醒
     * @param {number} count - 未读消息数
     */
    setUnreadBadge(count) {
      this.unreadCount = count;
      if (count > 0) {
        document.title = `(${count}) ${this.baseTitle} — ${count} 条未读消息`;
      } else {
        this.setIdle();
      }
      console.log('[Title] 未读消息数：', count, '→', document.title);
    },

    /**
     * Tab Notification：闪烁效果
     * 在两个标题之间交替切换，吸引用户注意力
     * @param {string} alternateTitle - 交替显示的标题
     * @param {number} intervalMs - 切换间隔（毫秒）
     */
    startFlashing(alternateTitle, intervalMs = 1000) {
      this.stopFlashing(); // 先清除已有的闪烁

      const originalTitle = document.title;
      this._isFlashing = true;

      this._flashTimer = setInterval(() => {
        document.title = this._isFlashing ? alternateTitle : originalTitle;
        this._isFlashing = !this._isFlashing;
      }, intervalMs);

      console.log('[Title] 开始闪烁提醒');
    },

    /**
     * 停止 title 闪烁
     */
    stopFlashing() {
      if (this._flashTimer) {
        clearInterval(this._flashTimer);
        this._flashTimer = null;
        this._isFlashing = false;
        console.log('[Title] 停止闪烁');
      }
    },

    // 更新页面底部状态栏（辅助显示）
    _updateStatusBar(text) {
      const bar = document.getElementById('status-bar');
      if (bar) bar.textContent = text;
    }
  };

  // ═══════════════════════════════════════════════════
  // 对话逻辑
  // ═══════════════════════════════════════════════════

  let aiReplyCount = 0;  // AI 回复计数器

  async function sendMessage() {
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const text = input.value.trim();
    if (!text) return;

    // 1. 渲染用户消息
    appendMessage(text, 'user');
    input.value = '';
    sendBtn.disabled = true;

    // 2. 显示"正在思考"状态
    const thinkingEl = appendMessage('AI 正在思考...', 'thinking');
    TitleManager.setThinking();  // ← Title 变为"⏳ 正在思考..."

    // 3. 模拟 AI API 调用（实际替换为 fetch Anthropic/OpenAI API）
    await simulateAIResponse(1800);

    // 4. AI 回复完成
    thinkingEl.remove();
    aiReplyCount++;
    const aiResponse = generateMockResponse(text);
    appendMessage(aiResponse, 'ai');

    // 5. 更新 Title 为"已回复 N 条消息"
    TitleManager.setReplied(aiReplyCount);  // ← Title 变为"✅ Claude - 已回复 3 条消息"

    sendBtn.disabled = false;
    input.focus();
  }

  function appendMessage(text, role) {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function simulateAIResponse(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function generateMockResponse(userText) {
    const responses = [
      `关于"${userText.slice(0, 20)}"，这是一个很好的问题。根据我的分析...`,
      `我理解你的问题。让我来解释一下相关概念：首先...`,
      `这个问题可以从多个角度来看。从技术层面而言...`
    ];
    return responses[aiReplyCount % responses.length];
  }

  // ═══════════════════════════════════════════════════
  // Tab Notification：页面可见性 API
  // 页面隐藏时显示未读消息数 + 闪烁提醒
  // ═══════════════════════════════════════════════════

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // 页面进入后台（用户切换到其他标签页）
      if (aiReplyCount > 0) {
        // 在 title 显示未读数 + 闪烁
        TitleManager.setUnreadBadge(aiReplyCount);
        TitleManager.startFlashing(`🔔 ${aiReplyCount} 条新消息 — ClaudeHelper`);
      }
    } else {
      // 页面重新进入前台（用户切回标签页）
      TitleManager.stopFlashing();
      TitleManager.setReplied(aiReplyCount);  // 恢复正常状态
    }
  });

  // 回车键发送
  document.getElementById('user-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) sendMessage();
  });

  // 初始化：页面加载完成，设置空闲状态
  TitleManager.setIdle();  // ← 初始 Title = "AI助手 — ClaudeHelper"
</script>

</body>
</html>
```

---

## 🔍 逐行解析

**HTML 部分：**

| 元素/属性 | 解析 |
|---------|------|
| `<title>AI助手 — ClaudeHelper</title>` | 初始标题，格式为"功能 — 品牌"。页面加载完成后 JS 会调用 `TitleManager.setIdle()` 保持一致。 |
| `id="messages"` | 消息列表容器，JS 通过此 ID 插入新消息。 |
| `id="status-bar"` | 页面底部状态栏，与 title 同步显示当前状态，面向页面内用户。 |

**JS 核心逻辑：**

| 方法 | 调用时机 | document.title 变化 |
|------|---------|-------------------|
| `TitleManager.setIdle()` | 页面初始化 | `"AI助手 — ClaudeHelper"` |
| `TitleManager.setThinking()` | 用户点击发送 | `"⏳ 正在思考... — ClaudeHelper"` |
| `TitleManager.setReplied(3)` | AI 回复完成 | `"✅ ClaudeHelper - 已回复 3 条消息"` |
| `TitleManager.setUnreadBadge(3)` | 页面隐藏 + 有新消息 | `"(3) ClaudeHelper — 3 条未读消息"` |
| `TitleManager.startFlashing(...)` | 页面隐藏时吸引注意力 | 每秒交替：原标题 ↔ "🔔 3 条新消息" |
| `TitleManager.stopFlashing()` | 用户切回标签页 | 恢复正常标题，停止闪烁 |

---

## 🌐 浏览器表现

### 不同状态下标签栏的显示

```text
状态一：空闲（页面刚加载）
[🌐 AI助手 — ClaudeHelper      ×]

状态二：AI 思考中（用户发送后）
[⌛ ⏳ 正在思考... — ClaudeHelper ×]

状态三：AI 回复完成（第3条）
[✅ ClaudeHelper - 已回复 3 条消息×]

状态四：用户切到其他标签（Tab Notification）
第 0 秒：[(3) ClaudeHelper — 3条未读×]
第 1 秒：[🔔 3 条新消息 — ClaudeHelper×]
第 2 秒：[(3) ClaudeHelper — 3条未读×]  ← 持续闪烁
...
用户切回：[✅ ClaudeHelper - 已回复 3 条消息×]  ← 停止闪烁
```

### 注意事项

- `⏳`、`✅`、`🔔` 等 emoji 在不同系统标签栏中的渲染效果有差异，Windows 上部分 emoji 会显示为方块
- 标签栏宽度有限，过长的 title 会被截断，截断点因浏览器而异
- iOS Safari 对 `document.title` 修改有轻微延迟（约 100ms）

---

## 📦 常见属性 / API

### `<title>` 标签的限制与规则

| 维度 | 规则/限制 | 说明 |
|------|---------|------|
| 字符数建议 | 标题部分 ≤ 60 字符 | Google 搜索结果截断点约 600px 像素宽，相当于约 60 个英文字符或 30 个中文字符 |
| HTML 标签 | 不允许 | `<title>` 内只能是纯文本，写入 `<strong>` 等标签会被当作文本显示 |
| 特殊字符 | 需 HTML 实体编码 | `&amp;`（&）、`&lt;`（<）、`&gt;`（>）、`&quot;`（"）、`&#39;`（'） |
| 特殊字符（JS） | 直接赋值字符串 | `document.title = 'A & B'` 会正确显示 `A & B`（不需要 HTML 转义） |
| 唯一性 | 每个 HTML 文档只能有一个 `<title>` | 出现多个时，浏览器通常取第一个 |
| 多语言 | 跟随 `<html lang>` 属性 | 屏幕阅读器根据 lang 属性用对应语言朗读 title |
| 空 title | 允许但不推荐 | `<title></title>` 合法，但搜索引擎可能自动提取 h1 内容填充 |
| `document.title` API | 读写字符串属性 | `document.title` 读取；`document.title = '新标题'` 写入，立即生效 |
| 修改时机 | 任意时刻均可 | 页面加载前、加载中、加载后均可通过 JS 修改 |
| 持久化 | 仅当前会话 | 刷新页面后恢复 HTML 中的原始 `<title>` 值 |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. `document.title` 是最简单的用户状态通知手段**

在 WebSocket 未推送、页面在后台时，动态 title 是成本最低的"通知"方式——不需要请求 Notification 权限，所有浏览器都支持。

**2. `<title>` 是 SEO 权重最高的页面元素**

写好 title 是 SEO 的第一步。格式建议：`核心关键词 — 次要关键词 | 品牌名`，关键词前置，总长度 ≤ 60 字符。

**3. Tab Notification 闪烁需要节制**

过于频繁的 title 闪烁会让用户感到烦躁。建议：只在页面隐藏时闪烁，用户切回后立即停止；不要在页面可见时闪烁。

**4. `document.hidden` + `visibilitychange` 是 Tab 状态检测的标准 API**

不要用 `window.onfocus`/`onblur` 检测标签切换（它检测的是浏览器窗口焦点，不是标签页切换）。

---

## ⚠️ 易错点

**❌ 错误 1：title 写得太长**

```html
<!-- 错误：搜索结果被截断，关键信息丢失 -->
<title>2026年最好用的AI写作工具完全使用指南 — ClaudeHelper AI 写作助手平台</title>

<!-- 正确：核心信息在前60字符内 -->
<title>AI写作工具指南 2026 — ClaudeHelper</title>
```

**❌ 错误 2：JS 中使用 HTML 实体**

```js
// 错误：document.title 接收纯文本，& 会被当作字面量显示
document.title = 'ClaudeHelper &amp; AI';
// 标签栏显示："ClaudeHelper &amp; AI"（原样显示实体）

// 正确：直接写字符
document.title = 'ClaudeHelper & AI';
// 标签栏显示："ClaudeHelper & AI"
```

**❌ 错误 3：用 `window.onfocus` 检测标签切换**

```js
// 错误：onfocus 检测的是浏览器窗口焦点，用户 Alt+Tab 切走时才触发
window.onfocus = () => { TitleManager.stopFlashing(); };

// 正确：用 visibilitychange 检测标签可见性
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) TitleManager.stopFlashing();
});
```

**❌ 错误 4：忘记在页面重新可见时停止闪烁**

```js
// 错误：只启动闪烁，不停止
document.addEventListener('visibilitychange', () => {
  if (document.hidden) TitleManager.startFlashing('🔔 新消息');
  // 缺少 else 分支！用户切回后 title 还在闪烁
});

// 正确：
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    TitleManager.startFlashing('🔔 新消息');
  } else {
    TitleManager.stopFlashing();  // ← 必须停止
  }
});
```

---

## 💡 最佳实践

**1. 建立 title 状态机**

为 AI 应用设计明确的 title 状态机，每个状态对应一个语义清晰的标题：

```text
空闲 → 思考中 → 已回复 → [后台] 未读提醒 → [切回] 已回复
```

**2. title 包含动作反馈，减少用户焦虑**

用户点击发送后切到其他标签做其他事，"⏳ 正在思考..." 的 title 告诉他 AI 还在工作；"✅ 已回复" 的 title 引导他切回查看。这比没有任何反馈的静态 title 用户体验好得多。

**3. 不同页面的 title 格式统一**

```text
首页：     品牌名 — 一句话 tagline
产品页：   产品名 — 核心功能 | 品牌名
文章页：   文章标题（前60字符）| 品牌名
404 页：   页面未找到 | 品牌名
```

**4. 利用 title 传递实时进度**

AI 长任务（如生成长文章）可用 title 显示进度百分比：

```js
function updateProgress(percent) {
  document.title = `${percent}% 生成中... — AIWriter`;
}
```

---

## 🚀 AI 应用场景

### 完整的 AI 对话 Tab 状态通知系统

以下展示三个典型 AI 应用场景中 `document.title` 的完整实践代码：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>AI 助手 — ClaudeHelper</title>
</head>
<body>
<script>
  // ═══════════════════════════════════════════════════
  // 场景一：AI 对话状态 title 动态更新
  // 模拟完整的 AI 对话生命周期
  // ═══════════════════════════════════════════════════

  async function simulateFullConversation() {
    console.log('=== AI 对话 Title 状态演示 ===');

    // 状态1：空闲
    document.title = 'AI助手 — ClaudeHelper';
    console.log('1. 空闲状态:', document.title);
    await sleep(1000);

    // 状态2：用户发送消息，AI 开始思考
    document.title = '⏳ 正在思考... — ClaudeHelper';
    console.log('2. 思考状态:', document.title);
    await sleep(2000);

    // 状态3：第1条回复完成
    document.title = '✅ ClaudeHelper - 已回复 1 条消息';
    console.log('3. 已回复(1):', document.title);
    await sleep(1000);

    // 状态4：继续对话，再次思考
    document.title = '⏳ 正在思考... — ClaudeHelper';
    console.log('4. 思考状态:', document.title);
    await sleep(1800);

    // 状态5：第2条回复完成
    document.title = '✅ ClaudeHelper - 已回复 2 条消息';
    console.log('5. 已回复(2):', document.title);
    await sleep(1000);

    // 状态6：第3条回复完成
    document.title = '✅ ClaudeHelper - 已回复 3 条消息';
    console.log('6. 已回复(3):', document.title);
  }

  // ═══════════════════════════════════════════════════
  // 场景二：浏览器 Tab Notification
  // 页面隐藏时显示未读消息数，吸引用户切回
  // ═══════════════════════════════════════════════════

  class TabNotificationManager {
    constructor() {
      this.unreadCount = 0;
      this.originalTitle = document.title;
      this.flashTimer = null;
      this.isAlternate = false;
    }

    // 增加未读消息数并更新 title
    addUnread(count = 1) {
      this.unreadCount += count;
      this.originalTitle = document.title; // 保存当前正常标题

      if (document.hidden) {
        // 页面在后台：显示未读数 + 启动闪烁
        this._showUnreadTitle();
        this._startFlash();
      }
      // 页面在前台：不打扰用户，只更新内部计数
    }

    // 用户切回：清除未读数
    clearUnread() {
      this.unreadCount = 0;
      this._stopFlash();
      document.title = this.originalTitle;
    }

    _showUnreadTitle() {
      document.title = `(${this.unreadCount}) 条新消息 — ClaudeHelper`;
    }

    _startFlash() {
      this._stopFlash(); // 防止重复
      this.isAlternate = false;

      this.flashTimer = setInterval(() => {
        document.title = this.isAlternate
          ? `(${this.unreadCount}) 条新消息 — ClaudeHelper`
          : `🔔 ${this.unreadCount} 条未读 — ClaudeHelper`;
        this.isAlternate = !this.isAlternate;
      }, 1200);
    }

    _stopFlash() {
      if (this.flashTimer) {
        clearInterval(this.flashTimer);
        this.flashTimer = null;
      }
    }
  }

  const tabNotify = new TabNotificationManager();

  // 监听页面可见性变化
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && tabNotify.unreadCount > 0) {
      // 用户切回页面：清除未读提醒
      tabNotify.clearUnread();
      console.log('[Tab] 用户切回，已清除未读提醒');
    }
  });

  // ═══════════════════════════════════════════════════
  // 场景三：AI 长任务进度 title
  // 适用于文章生成、批量处理等耗时任务
  // ═══════════════════════════════════════════════════

  async function simulateLongTaskWithProgress() {
    console.log('\n=== AI 长任务进度 Title 演示 ===');
    const steps = [
      { percent: 0,   label: '准备中' },
      { percent: 20,  label: '分析主题' },
      { percent: 45,  label: '生成大纲' },
      { percent: 70,  label: '撰写内容' },
      { percent: 90,  label: '润色优化' },
      { percent: 100, label: '完成' },
    ];

    for (const step of steps) {
      if (step.percent === 100) {
        document.title = `✅ 文章生成完成 — AIWriter`;
      } else {
        document.title = `${step.percent}% ${step.label}... — AIWriter`;
      }
      console.log(`[进度] ${document.title}`);
      await sleep(800);
    }
  }

  // 工具函数
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ═══════════════════════════════════════════════════
  // 演示执行
  // ═══════════════════════════════════════════════════
  async function runDemo() {
    await simulateFullConversation();

    await sleep(1000);
    console.log('\n=== 模拟 Tab Notification：AI 发来新消息 ===');
    // 模拟 AI 推送3条消息（实际通过 WebSocket 接收）
    tabNotify.addUnread(1);
    await sleep(500);
    tabNotify.addUnread(1);
    await sleep(500);
    tabNotify.addUnread(1);
    console.log('[Tab] 未读数：', tabNotify.unreadCount);

    await sleep(2000);
    await simulateLongTaskWithProgress();
  }

  document.addEventListener('DOMContentLoaded', runDemo);
</script>
</body>
</html>
```

---

## 📝 练习题

**题目 1（基础）：** 以下 title 有什么问题？请修正：

```html
<title>欢迎使用我们公司推出的全新 AI 智能写作助手工具 ClaudeHelper，让你的写作效率提升十倍！</title>
```

参考答案：总长度超过 60 字符，搜索结果会被截断。修正：`<title>AI 写作效率提升 10 倍 — ClaudeHelper</title>`

**题目 2（AI 场景）：** 实现一个 `AITitleManager` 类，支持以下功能：
- `sendingMessage()`：用户发送消息时调用，title 显示"⏳ 发送中..."
- `aiTyping(charsCount)`：AI 正在流式输出时调用，title 显示当前已输出字符数（如"✍️ 已生成 128 字..."）
- `aiDone(totalChars)`：AI 输出完成，title 显示总字符数（如"✅ 生成完成（共 512 字）"）
- `reset()`：重置为初始标题

**题目 3（思考）：** `document.title` 动态更新对搜索引擎 SEO 有效吗？为什么？如果想让不同的 AI 生成内容页面有不同的 title，应该怎么做？

---

## 📌 本节总结

| 要点 | 核心结论 |
|------|---------|
| `<title>` 的显示位置 | 标签栏 + 收藏夹 + 搜索结果，三处都重要 |
| 字符数限制 | 搜索结果约 60 字符截断，关键词前置 |
| 纯文本限制 | 不能包含 HTML 标签，JS 赋值直接用字符（不需 HTML 实体） |
| `document.title` | 读写均支持，修改立即生效，不触发页面刷新 |
| AI 对话状态 | 空闲 → 思考中 → 已回复，用 title 传递每个阶段 |
| Tab Notification | `visibilitychange` + title 闪烁，成本最低的后台通知方案 |
| 进度显示 | AI 长任务用百分比更新 title，减少用户焦虑 |
| SEO 效果 | 动态 title 对用户有效，对搜索引擎需配合 SSR 使用 |

`<title>` 是最简单的 HTML 元素之一，却是 SEO 权重最高的标签，也是 AI 应用中传递实时状态的低成本手段。掌握 `document.title` 的动态更新，能让你的 AI 产品在细节体验上更上一层楼。

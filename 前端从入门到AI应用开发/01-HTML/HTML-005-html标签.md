# html 标签（HTML-005）

---

## 🎯 本节学习目标

1. 掌握 `<html>` 元素的所有常用属性及其实际作用
2. 理解 `lang` 属性对 AI 多语言应用（TTS、翻译、i18n）的重要意义
3. 能够用 JavaScript 动态设置 `<html lang>` 和切换暗色主题 `data-theme="dark"`

---

## 📖 什么是 `<html>` 标签

`<html>` 是 HTML 文档的**根元素**（Root Element），是整个 DOM 树的起点。在一个合法的 HTML 文档中，它：

- 直接包含 `<head>` 和 `<body>` 两个子元素
- 在 DOM 树中通过 `document.documentElement` 访问
- 所有 CSS 变量、主题类名、语言属性通常都设置在这里，因为它是所有元素的祖先

```text
Document
└── html  ← 根元素（document.documentElement）
    ├── head
    └── body
```

`<html>` 标签虽然看起来简单，但其属性对 AI 多语言应用、无障碍访问、主题切换有着至关重要的影响。

---

## 🧠 原理讲解

### `lang` 属性的工作原理

`lang` 属性使用 [BCP 47](https://www.ietf.org/rfc/bcp/bcp47.txt) 语言标签规范，格式为 `语言-地区`（如 `zh-CN`、`en-US`、`ja-JP`）。

当浏览器读取到 `<html lang="zh-CN">` 时，以下系统会接收到这个信息：

```text
<html lang="zh-CN">
        │
        ├──→ 浏览器翻译功能
        │    （Chrome 右键"翻译成中文"时知道当前是中文，不会弹出翻译提示）
        │
        ├──→ 屏幕阅读器 / TTS 引擎
        │    （选择正确的语音库：zh-CN = 普通话语音，en-US = 英语语音）
        │
        ├──→ 浏览器自动填充
        │    （根据语言提供本地化的日期格式、货币格式）
        │
        ├──→ CSS 的 :lang() 伪类选择器
        │    :lang(zh) { font-family: "PingFang SC", sans-serif; }
        │
        └──→ JavaScript 的 Intl API
             Intl.DateTimeFormat(document.documentElement.lang).format(new Date())
```

### `data-theme` 属性实现暗色模式的原理

通过在 `<html>` 上设置 `data-theme="dark"` 或 `data-theme="light"`，配合 CSS 变量：

```css
/* 亮色主题（默认） */
:root, [data-theme="light"] {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
  --message-ai-bg: #f0f0f0;
  --message-user-bg: #007acc;
}

/* 暗色主题 */
[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #e0e0e0;
  --message-ai-bg: #2d2d2d;
  --message-user-bg: #005a9e;
}
```

当 JS 执行 `document.documentElement.setAttribute('data-theme', 'dark')` 时，CSS 变量立即切换，整个页面主题随之改变——无需重新加载页面。

---

## 🏗 基本结构

```html
<!DOCTYPE html>
<html lang="zh-CN" dir="ltr" data-theme="light">
  <head>...</head>
  <body>...</body>
</html>
```

---

## ✅ 完整代码

以下是一个 **AI 聊天应用**，展示 `<html>` 标签属性的综合应用：支持多语言切换、暗色/亮色主题切换，并演示 `lang` 属性对 TTS 语音合成的影响：

```html
<!DOCTYPE html>
<html lang="zh-CN" dir="ltr" data-theme="light" data-mode="chat">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI 聊天助手 — 多语言主题演示</title>
  <style>
    /* CSS 变量定义在 :root，跟随 html[data-theme] 切换 */
    :root, [data-theme="light"] {
      --bg: #f9f9f9;
      --surface: #ffffff;
      --text: #1a1a1a;
      --border: #e0e0e0;
      --ai-bubble: #f0f4ff;
      --user-bubble: #007acc;
      --user-text: #ffffff;
      --btn-bg: #007acc;
      --btn-text: #ffffff;
    }

    [data-theme="dark"] {
      --bg: #121212;
      --surface: #1e1e1e;
      --text: #e0e0e0;
      --border: #333333;
      --ai-bubble: #2d2d3d;
      --user-bubble: #005a9e;
      --user-text: #ffffff;
      --btn-bg: #005a9e;
      --btn-text: #ffffff;
    }

    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      transition: background 0.3s, color 0.3s;
    }

    #app { max-width: 700px; margin: 0 auto; padding: 20px; }

    #toolbar {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      align-items: center;
    }

    #messages {
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--surface);
      padding: 16px;
      min-height: 300px;
      max-height: 400px;
      overflow-y: auto;
    }

    .message { margin: 8px 0; padding: 10px 14px; border-radius: 8px; max-width: 80%; }
    .ai-message { background: var(--ai-bubble); align-self: flex-start; }
    .user-message { background: var(--user-bubble); color: var(--user-text); margin-left: auto; }

    button {
      background: var(--btn-bg);
      color: var(--btn-text);
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
    }

    select {
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
    }

    #input-area { display: flex; gap: 8px; margin-top: 12px; }
    #user-input { flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); color: var(--text); }
    #lang-display { font-size: 12px; color: #888; margin-top: 8px; }
  </style>
</head>
<body>
<div id="app">
  <h1>AI 聊天助手</h1>

  <!-- 工具栏：语言切换 + 主题切换 + TTS 演示 -->
  <div id="toolbar">
    <label for="lang-select">语言：</label>
    <select id="lang-select" onchange="switchLanguage(this.value)">
      <option value="zh-CN">中文（简体）</option>
      <option value="en-US">English (US)</option>
      <option value="ja-JP">日本語</option>
      <option value="ar-SA" dir="rtl">العربية</option>
    </select>

    <button onclick="toggleTheme()">切换主题</button>
    <button onclick="speakLatestMessage()">🔊 朗读最新消息</button>
  </div>

  <p id="lang-display">当前语言：zh-CN | 方向：ltr | 主题：light</p>

  <!-- 消息区 -->
  <div id="messages">
    <div class="message ai-message" data-role="assistant">
      你好！我是 AI 助手。请选择语言和主题，体验多语言支持效果。
    </div>
  </div>

  <!-- 输入区 -->
  <div id="input-area">
    <input type="text" id="user-input" placeholder="输入消息…" />
    <button onclick="sendMessage()">发送</button>
  </div>
</div>

<script>
  // === 语言切换：动态修改 <html lang> 和 dir 属性 ===
  function switchLanguage(langCode) {
    const htmlEl = document.documentElement;

    // 设置 lang 属性
    htmlEl.setAttribute('lang', langCode);

    // 根据语言设置文字方向（阿拉伯语等从右到左）
    const rtlLanguages = ['ar-SA', 'ar', 'he', 'fa', 'ur'];
    const isRTL = rtlLanguages.some(rtl => langCode.startsWith(rtl));
    htmlEl.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    // 更新显示信息
    updateLangDisplay();

    // 向消息区追加一条切换提示
    const messages = {
      'zh-CN': '已切换到中文（简体）。TTS 将使用普通话语音引擎。',
      'en-US': 'Switched to English (US). TTS will use English voice engine.',
      'ja-JP': '日本語に切り替えました。TTSは日本語音声エンジンを使用します。',
      'ar-SA': 'تم التبديل إلى العربية. سيستخدم TTS محرك الصوت العربي.'
    };
    appendAIMessage(messages[langCode] || `切换到：${langCode}`);
  }

  // === 主题切换：动态修改 <html data-theme> 属性 ===
  function toggleTheme() {
    const htmlEl = document.documentElement;
    const current = htmlEl.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', next);
    updateLangDisplay();

    // 同时将主题偏好存入 localStorage（持久化）
    localStorage.setItem('theme', next);
    appendAIMessage(`主题已切换为：${next === 'dark' ? '暗色' : '亮色'}模式`);
  }

  // === TTS 语音合成：使用 <html lang> 决定语音语言 ===
  function speakLatestMessage() {
    if (!window.speechSynthesis) {
      alert('您的浏览器不支持 Web Speech API');
      return;
    }

    // 获取最后一条 AI 消息
    const aiMessages = document.querySelectorAll('.ai-message');
    const lastMsg = aiMessages[aiMessages.length - 1];
    if (!lastMsg) return;

    const text = lastMsg.textContent.trim();
    // 关键：使用 document.documentElement.lang 作为 TTS 语言
    const lang = document.documentElement.lang || 'zh-CN';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;  // ← html lang 属性决定 TTS 语音语言
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.cancel(); // 停止当前播放
    window.speechSynthesis.speak(utterance);

    appendAIMessage(`正在用 ${lang} 语音朗读最新消息…`);
  }

  // === 发送消息（模拟） ===
  function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    // 追加用户消息
    const messagesDiv = document.getElementById('messages');
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.setAttribute('data-role', 'user');
    userMsg.textContent = text;
    messagesDiv.appendChild(userMsg);

    // 模拟 AI 回复（实际项目中这里调用 AI API）
    setTimeout(() => {
      const lang = document.documentElement.lang;
      const replies = {
        'zh-CN': `收到你的消息："${text}"。（当前语言：${lang}）`,
        'en-US': `Got your message: "${text}". (Current lang: ${lang})`,
        'ja-JP': `メッセージを受け取りました："${text}"。（言語：${lang}）`,
        'ar-SA': `تلقيت رسالتك: "${text}". (اللغة: ${lang})`
      };
      appendAIMessage(replies[lang] || `Received: "${text}"`);
    }, 500);

    input.value = '';
    input.focus();
  }

  // 追加 AI 消息到消息列表
  function appendAIMessage(text) {
    const messagesDiv = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = 'message ai-message';
    div.setAttribute('data-role', 'assistant');
    div.textContent = text;
    messagesDiv.appendChild(div);
    div.scrollIntoView({ behavior: 'smooth' });
  }

  // 更新语言和主题信息显示
  function updateLangDisplay() {
    const htmlEl = document.documentElement;
    const lang = htmlEl.getAttribute('lang') || 'zh-CN';
    const dir = htmlEl.getAttribute('dir') || 'ltr';
    const theme = htmlEl.getAttribute('data-theme') || 'light';
    document.getElementById('lang-display').textContent =
      `当前语言：${lang} | 方向：${dir} | 主题：${theme}`;
  }

  // 页面加载时恢复主题偏好
  (function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
    updateLangDisplay();
  })();

  // 支持 Enter 键发送
  document.getElementById('user-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
</script>
</body>
</html>
```

---

## 🔍 逐行解析

| 属性/代码 | 说明 |
|-----------|------|
| `<html lang="zh-CN">` | 声明页面语言为简体中文，影响 TTS、浏览器翻译、`:lang()` CSS 选择器 |
| `dir="ltr"` | 文字方向从左到右（Left to Right），阿拉伯语等需设为 `rtl` |
| `data-theme="light"` | 自定义属性，CSS 通过 `[data-theme="dark"]` 选择器匹配，切换 CSS 变量 |
| `data-mode="chat"` | 自定义模式属性，可用于区分不同功能模式（chat/search/draw） |
| `document.documentElement` | JS 中访问 `<html>` 元素的标准方式 |
| `htmlEl.setAttribute('lang', langCode)` | 动态修改 `lang` 属性，TTS API 读取此值决定语音语言 |
| `utterance.lang = lang` | Web Speech API 的语言设置，直接使用 `html.lang` 属性值 |
| `localStorage.setItem('theme', next)` | 将主题偏好持久化，下次访问自动恢复 |
| `[data-theme="dark"] { --bg: #121212; }` | CSS 属性选择器，匹配 `html[data-theme="dark"]`，切换所有 CSS 变量 |

---

## 🌐 浏览器表现

- **`lang` 属性**：Chrome 右上角翻译按钮会根据 `lang` 属性决定是否显示"翻译成中文"提示；如果 `lang="zh-CN"` 且用户系统语言也是中文，浏览器不会弹出翻译提示
- **`dir="rtl"`**：整个页面文字方向反转，文本右对齐，滚动条移到左侧，页面布局镜像翻转
- **`data-theme`**：属性本身不影响显示，只有配合 CSS `[data-theme]` 属性选择器才有效果
- **DevTools 中的 `<html>` 元素**：在 Elements 面板中可直接双击编辑 `lang`、`data-theme` 等属性，实时查看效果

---

## 📦 常见属性 / API

`<html>` 标签的完整属性列表：

| 属性 | 类型 | 示例值 | 作用说明 |
|------|------|--------|----------|
| `lang` | 标准属性 | `zh-CN`、`en-US`、`ja-JP` | 声明页面语言，影响 TTS、浏览器翻译、`Intl` API、`:lang()` CSS 伪类 |
| `dir` | 标准属性 | `ltr`（默认）、`rtl`、`auto` | 文字排列方向，`rtl` 用于阿拉伯语、希伯来语等从右到左书写的语言 |
| `xmlns` | XHTML 专用 | `http://www.w3.org/1999/xhtml` | XHTML 文档的命名空间声明，HTML5 中不需要 |
| `data-theme` | 自定义属性 | `light`、`dark`、`system` | 配合 CSS 变量实现主题切换，是暗色模式的最常用实现方式 |
| `data-mode` | 自定义属性 | `chat`、`search`、`draw` | 标记应用当前功能模式，CSS 可针对不同模式设置不同样式 |
| `data-color-scheme` | 自定义属性 | `light dark` | 某些框架（如 Tailwind）使用此属性控制颜色方案 |
| `class` | 标准属性 | `dark`、`no-js`、`loaded` | 通过切换 html 的 class 名实现主题切换（Tailwind CSS 的暗色模式方案） |
| `style` | 标准属性 | `--primary: #007acc` | 在根元素设置全局 CSS 变量（不推荐，通常用 `:root` 或 `[data-theme]`） |
| `id` | 标准属性 | 极少使用 | html 元素很少设置 id，`document.documentElement` 已可直接访问 |
| `hidden` | 标准属性 | `hidden` | 不应设置在 html 上，设置后整个页面不可见 |
| `translate` | 标准属性 | `no` | 设置为 `no` 时，浏览器翻译工具会跳过此元素内容（可用于代码块等不应翻译的内容） |
| `spellcheck` | 标准属性 | `true`/`false` | 控制浏览器拼写检查，设在 html 上影响整个页面 |

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **`lang` 属性是 AI 多语言应用的基础配置**：Web Speech API（TTS/STT）、浏览器翻译、`Intl` 国际化 API 都依赖 `lang` 属性确定语言。构建多语言 AI 应用时，必须在语言切换时同步更新 `<html lang>`。

2. **`data-theme` + CSS 变量是现代主题切换的标准方案**：在 `<html>` 上设置 `data-theme` 属性，配合 CSS `[data-theme="dark"]` 选择器和 CSS 自定义变量（`--bg-color` 等），是 2024 年主流 AI 产品（包括 Claude、ChatGPT）采用的主题切换方案。

3. **`document.documentElement` 是 JS 访问 `<html>` 的标准方式**：不要用 `document.querySelector('html')`，使用 `document.documentElement`，语义更清晰、性能更好，是操作根元素属性（`lang`、`data-theme`、`dir`）的正确入口。

---

## ⚠️ 易错点

**1. `lang` 属性使用了错误的语言代码**

```html
<!-- ❌ 错误：不规范的语言代码 -->
<html lang="chinese">
<html lang="zh">   <!-- 有时可接受，但不够精确 -->
<html lang="CN">   <!-- 错误，地区代码单独不合法 -->

<!-- ✅ 正确：BCP 47 格式，语言-地区 -->
<html lang="zh-CN">  <!-- 简体中文 -->
<html lang="zh-TW">  <!-- 繁体中文（台湾） -->
<html lang="en-US">  <!-- 美式英语 -->
<html lang="en-GB">  <!-- 英式英语 -->
```

**2. 多语言页面忘记更新 `lang` 属性**

```js
// ❌ 错误：切换界面语言后，忘记同步更新 html lang
function switchToEnglish() {
  document.getElementById('title').textContent = 'AI Assistant';
  // 漏掉了 html lang 的更新！TTS 还是会用中文语音读英文内容
}

// ✅ 正确：切换语言时同步更新 html lang
function switchToEnglish() {
  document.documentElement.setAttribute('lang', 'en-US');
  document.getElementById('title').textContent = 'AI Assistant';
}
```

**3. `dir="rtl"` 只设置在局部元素，未设置在 `<html>` 上**

```html
<!-- ❌ 仅在 div 上设置 rtl，可能导致部分布局（如 flex）方向不一致 -->
<html lang="ar-SA">
  <body>
    <div dir="rtl">محتوى عربي</div>
  </body>
</html>

<!-- ✅ 阿拉伯语页面：在 html 上同时设置 lang 和 dir -->
<html lang="ar-SA" dir="rtl">
```

**4. 主题切换时忘记持久化**

```js
// ❌ 页面刷新后主题丢失
document.documentElement.setAttribute('data-theme', 'dark');

// ✅ 同时存入 localStorage，页面加载时恢复
document.documentElement.setAttribute('data-theme', 'dark');
localStorage.setItem('theme', 'dark');
```

---

## 💡 最佳实践

**1. `<html>` 标签的推荐写法**

```html
<!-- 推荐：完整的根元素配置 -->
<html lang="zh-CN" dir="ltr" data-theme="light">
```

**2. 多语言应用的语言切换模板**

```js
/**
 * 切换应用语言
 * @param {string} langCode - BCP 47 语言代码，如 "zh-CN"、"en-US"
 */
function setLanguage(langCode) {
  const html = document.documentElement;

  // 1. 更新 lang 属性（影响 TTS、翻译、Intl API）
  html.setAttribute('lang', langCode);

  // 2. 更新文字方向
  const rtlLangs = ['ar', 'he', 'fa', 'ur', 'yi'];
  const isRTL = rtlLangs.some(code => langCode.toLowerCase().startsWith(code));
  html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

  // 3. 持久化（下次加载自动恢复）
  localStorage.setItem('preferredLang', langCode);

  // 4. 触发自定义事件（通知其他模块语言已变更）
  document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang: langCode } }));
}
```

**3. 系统主题感知（跟随用户操作系统偏好）**

```js
// 检测系统是否偏好暗色模式
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

// 优先使用用户手动设置的主题，其次跟随系统
const theme = savedTheme || (prefersDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', theme);

// 监听系统主题变化（用户切换系统设置时自动更新）
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    // 只有用户没有手动设置主题时，才跟随系统
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});
```

---

## 🚀 AI 应用场景

### 场景 1：`lang` 属性对 AI 多语言应用的意义

**浏览器翻译 API**：当用户访问一个 `lang="en-US"` 的 AI 工具页面时，Chrome 会自动弹出"翻译成中文"的提示条。如果 `lang="zh-CN"`，则不会提示（因为页面本身就是中文）。这对于部署到海外的 AI 产品非常重要——正确设置 `lang` 可以控制翻译提示的触发行为。

**TTS 语音合成语言识别**：Web Speech API 的 `SpeechSynthesisUtterance.lang` 决定了 TTS 引擎选用哪种语音。将其设为 `document.documentElement.lang` 可以自动跟随页面语言：

```js
// AI 语音播报：自动使用页面当前语言
function readAloudAIResponse(text) {
  const utterance = new SpeechSynthesisUtterance(text);

  // 使用 html[lang] 属性决定语音语言，无需硬编码
  utterance.lang = document.documentElement.lang;

  // 可选：选择特定语音（如某个品牌的 TTS 语音）
  const voices = speechSynthesis.getVoices();
  const targetVoice = voices.find(v => v.lang === utterance.lang);
  if (targetVoice) utterance.voice = targetVoice;

  speechSynthesis.speak(utterance);
}
```

**i18n（国际化）集成**：主流 i18n 库（如 `i18next`、`vue-i18n`、React `react-intl`）在切换语言时都会自动更新 `document.documentElement.lang`，同时触发 `Intl` API 使用正确的本地化格式。

### 场景 2：根据 `navigator.language` 动态设置 `<html lang>` 和切换暗色主题

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <title>AI 助手 — 自适应语言与主题</title>
  <style>
    :root, [data-theme="light"] {
      --bg: #ffffff; --text: #1a1a1a; --card: #f5f5f5;
    }
    [data-theme="dark"] {
      --bg: #121212; --text: #e0e0e0; --card: #1e1e1e;
    }
    body { background: var(--bg); color: var(--text); font-family: system-ui; padding: 24px; transition: all 0.3s; }
    .card { background: var(--card); border-radius: 12px; padding: 20px; margin: 12px 0; }
    #info { font-family: monospace; font-size: 13px; line-height: 1.8; }
  </style>
</head>
<body>

<h1>AI 助手 — 自适应配置</h1>
<div class="card">
  <pre id="info">初始化中…</pre>
</div>

<script>
  /**
   * 初始化：根据用户浏览器语言和系统主题自动配置页面
   */
  function initAdaptiveConfig() {
    const html = document.documentElement;

    // ===== 1. 自动检测并设置语言 =====
    // navigator.language 返回用户浏览器语言设置（如 "zh-CN"、"en-US"）
    const browserLang = navigator.language || 'zh-CN';

    // 设置 html[lang]，影响 TTS、翻译、Intl API
    html.setAttribute('lang', browserLang);

    // 处理文字方向（RTL 语言自动切换）
    const rtlPrefixes = ['ar', 'he', 'fa', 'ur'];
    const isRTL = rtlPrefixes.some(p => browserLang.toLowerCase().startsWith(p));
    html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    // ===== 2. 自动检测并设置主题 =====
    const savedTheme = localStorage.getItem('ai-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', theme);

    // ===== 3. 显示配置信息 =====
    const infoEl = document.getElementById('info');
    infoEl.textContent = [
      `navigator.language     = "${navigator.language}"`,
      `navigator.languages    = [${navigator.languages.slice(0, 3).map(l => `"${l}"`).join(', ')}]`,
      `html[lang]             = "${html.getAttribute('lang')}"`,
      `html[dir]              = "${html.getAttribute('dir')}"`,
      `html[data-theme]       = "${html.getAttribute('data-theme')}"`,
      `系统暗色偏好            = ${systemPrefersDark}`,
      `localStorage 主题      = "${savedTheme || '（未设置，跟随系统）'}"`,
      '',
      `Intl 日期格式示例       = ${new Intl.DateTimeFormat(browserLang, {
        year: 'numeric', month: 'long', day: 'numeric'
      }).format(new Date())}`,
      `Intl 货币格式示例       = ${new Intl.NumberFormat(browserLang, {
        style: 'currency',
        currency: browserLang.startsWith('zh') ? 'CNY' : 'USD'
      }).format(1234.56)}`
    ].join('\n');

    // ===== 4. 监听系统主题变化 =====
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('ai-theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        console.log(`系统主题已变更，自动切换为：${newTheme}`);
      }
    });
  }

  initAdaptiveConfig();
</script>

</body>
</html>
```

---

## 📝 练习题

### 基础题

**题目 1：属性匹配**

将以下 `<html>` 属性与对应的效果连线：

```text
属性                              效果
A. lang="ar-SA"              1. 页面内容整体从右向左显示
B. dir="rtl"                 2. CSS :lang(ar) 选择器生效
C. data-theme="dark"         3. CSS [data-theme="dark"] 选择器生效
D. class="dark"              4. Tailwind CSS dark: 前缀类生效（需配置）
E. translate="no"            5. 浏览器翻译工具跳过此元素内容
```

<details>
<summary>参考答案</summary>

A-2，B-1，C-3，D-4，E-5

注意：A（lang="ar-SA"）同时也会影响 TTS 和翻译，但 B（dir="rtl"）才是控制视觉方向的属性；两者通常需要配合使用。

</details>

---

### 进阶题

**题目 2：分析 lang 属性影响**

以下代码有 2 处与 `lang` 属性相关的问题，请找出并修正：

```js
// 多语言 AI 应用的语言切换函数
function switchLang(code) {
  document.body.setAttribute('lang', code);  // 问题1

  const utter = new SpeechSynthesisUtterance('Hello AI');
  utter.lang = 'en-US';  // 问题2（假设用户刚切换到了日语 ja-JP）
  speechSynthesis.speak(utter);
}
```

<details>
<summary>参考答案</summary>

问题1：`lang` 属性应设置在 `document.documentElement`（即 `<html>` 元素）上，而非 `document.body`。屏幕阅读器、浏览器翻译等功能都读取 `<html lang>` 属性。

修正：`document.documentElement.setAttribute('lang', code);`

问题2：TTS 的语言硬编码为 `'en-US'`，不会跟随用户切换的语言。应动态读取当前语言：

修正：`utter.lang = document.documentElement.lang;`

</details>

---

### AI 场景题

**题目 3：为 AI 助手实现完整的多语言 + 暗色模式初始化**

基于本节所学，完成以下 JS 函数：

```js
/**
 * AI 助手应用初始化
 * 要求：
 * 1. 根据 navigator.language 自动设置 <html lang> 和 dir
 * 2. 读取 localStorage 中的主题偏好，若无则跟随系统暗色模式
 * 3. 将当前 lang 值传给 TTS 初始化函数（用 console.log 模拟）
 * 4. 用 Intl.DateTimeFormat 格式化当前日期，在页面某元素中显示
 */
function initAIAssistant() {
  // 在这里补全初始化逻辑
}
```

<details>
<summary>参考答案</summary>

```js
function initAIAssistant() {
  const html = document.documentElement;

  // 1. 语言检测与设置
  const lang = navigator.language || 'zh-CN';
  html.setAttribute('lang', lang);
  const rtl = ['ar','he','fa','ur'].some(p => lang.toLowerCase().startsWith(p));
  html.setAttribute('dir', rtl ? 'rtl' : 'ltr');

  // 2. 主题设置
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  html.setAttribute('data-theme', savedTheme || (systemDark ? 'dark' : 'light'));

  // 3. TTS 初始化（传入当前语言）
  console.log('TTS 初始化，语言：', html.getAttribute('lang'));

  // 4. 本地化日期显示
  const dateStr = new Intl.DateTimeFormat(lang, {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  }).format(new Date());

  const dateEl = document.getElementById('current-date');
  if (dateEl) dateEl.textContent = dateStr;
}
```

</details>

---

## 📌 本节总结

| 知识点 | 核心要点 |
|--------|----------|
| `<html>` 是根元素 | DOM 树起点，JS 通过 `document.documentElement` 访问 |
| `lang` 属性 | BCP 47 格式（`zh-CN`、`en-US`），影响 TTS、翻译、CSS `:lang()`、`Intl` API |
| `dir` 属性 | `ltr`（默认）或 `rtl`，控制整页文字方向，阿拉伯语、希伯来语需设为 `rtl` |
| `data-theme` | 自定义属性，配合 CSS `[data-theme="dark"]` 和变量实现主题切换 |
| `document.documentElement` | 访问 `<html>` 元素的标准 JS 方式 |
| 主题持久化 | `localStorage` 存储主题偏好，结合 `prefers-color-scheme` 跟随系统 |
| TTS 与 `lang` | `SpeechSynthesisUtterance.lang` 设为 `document.documentElement.lang`，自动跟随页面语言 |
| `Intl` API | `new Intl.DateTimeFormat(lang)` 等，使用 `html.lang` 实现本地化数字/日期格式 |

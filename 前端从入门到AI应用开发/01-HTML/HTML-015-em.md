# 斜体强调 `<em>`（HTML-015）

---

## 🎯 本节学习目标

- 理解 `<em>` 的语义强调与 `<i>` 的视觉斜体的本质区别
- 了解 TTS 朗读时 `<em>` 如何影响语调
- 能够将 AI 输出中的 Markdown `*text*` 渲染为 `<em>` 标签
- 掌握同时处理 `<strong>` 和 `<em>` 的完整 Markdown 简单渲染器
- 编写可复用的 Markdown 内联元素解析函数

---

## 📖 什么是斜体强调 `<em>`

`<em>`（Emphasis）是 HTML 中表示**语气强调**的语义标签，默认渲染为斜体文字。它与 `<i>` 的区别在于：`<em>` 表示"这个词在当前句子中语气上被强调"，而 `<i>` 只是让文字变斜，没有任何语义。

```html
<!-- 语义强调：语气重音在"今天" -->
<p>我<em>今天</em>才知道这件事。</p>

<!-- 视觉斜体：技术术语，无强调意图 -->
<p>该概念称为 <i>Attention Mechanism</i>（注意力机制）。</p>
```

在 AI 输出场景中，AI 生成的 Markdown 使用 `*text*` 或 `_text_` 表示斜体强调，对应 HTML 中的 `<em>` 标签。

---

## 🧠 原理讲解

### `<em>` 的语义强调 vs `<i>` 的视觉斜体

| 维度 | `<em>` | `<i>` |
|------|--------|-------|
| 语义 | 语气强调（在句子中重读） | 无语义，纯视觉斜体 |
| 视觉 | 默认斜体 | 默认斜体 |
| 推荐场景 | 需要语气强调的词语 | 技术术语、外来词、思维活动、书名 |
| HTML5 更新 | 语义保持不变 | HTML5 重新定义为"专业术语、外来语"等 |

实际的区别体现在两个地方：

**1. 屏幕阅读器朗读**（TTS - Text to Speech）：

```text
<em> 内的文字通常会：
- 语调升高（表示重音）
- 或改变朗读节奏
- 部分 TTS 引擎会更明显地强调该词

<i> 内的文字：
- 普通语调朗读，无特殊处理
```

**2. CSS 选择器的语义区分**：

```css
/* 可以针对语义强调单独设置样式 */
em { color: #5a5fcd; }       /* 语义强调：深蓝色 */
i  { color: #888; }          /* 视觉斜体：灰色（如术语） */
```

### TTS 朗读时 `<em>` 对语调的影响

现代 TTS（文字转语音）引擎，如浏览器内置的 Web Speech API、iOS VoiceOver，在处理 `<em>` 时：

```text
普通文字："我今天才知道这件事"
           （平调朗读）

带 em 标记："我<em>今天</em>才知道这件事"
            （"今天"二字语调升高或加重）
```

这对无障碍访问至关重要——盲人用户通过语调变化来感知哪个词被强调。如果只用 `<i>` 或纯 CSS 斜体，TTS 无法传递这种语气信息。

### AI Markdown 中的 `*text*` 与 `<em>`

AI 输出的 Markdown 斜体规则：

```text
*text*   → <em>text</em>      （推荐，更通用）
_text_   → <em>text</em>      （等价，某些情况下兼容性略差）
***text*** → <strong><em>text</em></strong>   （粗斜体）
```

---

## 🏗 基本结构

```html
<!-- 语气强调 -->
<p>AI 在编程任务中表现<em>格外</em>出色。</p>

<!-- 与 strong 组合：最重要的强调 -->
<p><strong><em>务必</em></strong>在发布前进行安全测试。</p>

<!-- i 的标准用途：外来词/专业术语 -->
<p>该技术称为 <i>Retrieval-Augmented Generation</i>（RAG）。</p>

<!-- 书名号等场景（i 标签） -->
<p>详见 <i>Attention Is All You Need</i> 论文。</p>

<!-- 不推荐：用 i 代替 em 表达强调 -->
<!-- <i>这很重要</i>  ← 语义不正确，改用 em -->
```

---

## ✅ 完整代码

AI 输出 Markdown `*text*` 渲染为 `<em>` + 结合 strong 和 em 的完整 Markdown 简单渲染器：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown 渲染器 - strong + em 完整示例</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f0f2f5;
      padding: 40px 20px;
    }

    .container { max-width: 800px; margin: 0 auto; }
    h1 { font-size: 1.4rem; color: #1a1a2e; margin-bottom: 24px; }

    /* ── 示例选择器 ── */
    .example-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .tab {
      padding: 7px 16px;
      border: 1.5px solid #e0e0e0;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      background: #fff;
      color: #555;
      transition: all .2s;
    }
    .tab.active, .tab:hover {
      background: #7c83fd;
      border-color: #7c83fd;
      color: #fff;
    }

    /* ── 双栏布局 ── */
    .editor-wrap {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    @media (max-width: 600px) {
      .editor-wrap { grid-template-columns: 1fr; }
    }

    .panel {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
    }
    .panel-header {
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #f0f0f0;
    }
    .panel-header.md    { background: #1e1e2e; color: #cdd6f4; }
    .panel-header.html  { background: #f0f9ff; color: #0284c7; }

    textarea {
      width: 100%;
      padding: 16px;
      font-family: "SF Mono", "Consolas", monospace;
      font-size: 13px;
      border: none;
      outline: none;
      resize: none;
      height: 260px;
      line-height: 1.7;
      background: #1e1e2e;
      color: #cdd6f4;
    }

    .rendered {
      padding: 16px;
      height: 260px;
      overflow-y: auto;
      font-size: 15px;
      line-height: 1.8;
      color: #222;
    }

    /* ── 渲染结果的标签样式 ── */
    .rendered strong {
      font-weight: 700;
      color: #1a1a2e;
    }
    .rendered em {
      font-style: italic;
      color: #4a5fcd;
    }
    .rendered strong em,
    .rendered em strong {
      /* 粗斜体：继承粗体和斜体 */
      font-weight: 700;
      font-style: italic;
      color: #1a1a2e;
      background: #fef3c7;
      padding: 0 2px;
      border-radius: 3px;
    }
    .rendered p { margin-bottom: 12px; }
    .rendered p:last-child { margin-bottom: 0; }
    .rendered h1 { font-size: 1.5rem; margin-bottom: 12px; border-bottom: 2px solid #7c83fd; padding-bottom: 6px; }
    .rendered h2 { font-size: 1.2rem; margin: 16px 0 8px; color: #2d2d6b; }
    .rendered h3 { font-size: 1.05rem; margin: 12px 0 6px; color: #444; }
    .rendered code {
      font-family: monospace;
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .rendered ul, .rendered ol { padding-left: 24px; margin-bottom: 12px; }
    .rendered li { margin-bottom: 4px; }

    /* ── 标签统计 ── */
    .stats-bar {
      background: #fff;
      border-radius: 12px;
      padding: 14px 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      font-size: 13px;
      color: #555;
    }
    .stat-item { display: flex; align-items: center; gap: 6px; }
    .badge {
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-strong { background: #eef0ff; color: #5a5fcd; }
    .badge-em     { background: #fef3c7; color: #b45309; }
    .badge-total  { background: #f0fdf4; color: #15803d; }

    /* ── TTS 演示 ── */
    .tts-demo {
      margin-top: 16px;
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
    }
    .tts-demo h3 { font-size: 14px; color: #444; margin-bottom: 12px; }
    .tts-sentence {
      font-size: 16px;
      line-height: 2;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .tts-sentence em { color: #4a5fcd; font-style: italic; }
    .tts-btn {
      padding: 8px 18px;
      background: #7c83fd;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
    }
    .tts-note { font-size: 12px; color: #888; margin-top: 8px; }
  </style>
</head>
<body>

  <div class="container">
    <h1>Markdown 渲染器：`*斜体*` + `**粗体**` 完整示例</h1>

    <!-- 示例选择 -->
    <div class="example-tabs">
      <button class="tab active" onclick="loadExample('ai')">🤖 AI 分析输出</button>
      <button class="tab" onclick="loadExample('article')">📖 技术文章</button>
      <button class="tab" onclick="loadExample('mixed')">✨ 混合强调</button>
    </div>

    <!-- 编辑器双栏 -->
    <div class="editor-wrap">
      <!-- 左：Markdown 输入 -->
      <div class="panel">
        <div class="panel-header md">📝 Markdown 原始输入</div>
        <textarea id="mdInput" oninput="renderLive()"></textarea>
      </div>
      <!-- 右：HTML 渲染结果 -->
      <div class="panel">
        <div class="panel-header html">🌐 HTML 渲染结果</div>
        <div class="rendered" id="htmlOutput"></div>
      </div>
    </div>

    <!-- 标签统计 -->
    <div class="stats-bar" id="statsBar">
      <div class="stat-item">
        <span class="badge badge-strong">&lt;strong&gt;</span>
        <span id="strongCount">0 处</span>
      </div>
      <div class="stat-item">
        <span class="badge badge-em">&lt;em&gt;</span>
        <span id="emCount">0 处</span>
      </div>
      <div class="stat-item">
        <span class="badge badge-total">总标签</span>
        <span id="totalCount">0 个</span>
      </div>
    </div>

    <!-- TTS 演示 -->
    <div class="tts-demo">
      <h3>🔊 TTS 演示：`em` 标签对语调的影响</h3>
      <div class="tts-sentence" id="ttsSentence">
        大语言模型<em>并不真正理解</em>语言，它只是在统计概率上做出最合理的预测。
      </div>
      <button class="tts-btn" onclick="speakWithEM()">▶ 朗读（含 em 强调）</button>
      <button class="tts-btn" style="background:#888; margin-left:8px" onclick="speakPlain()">
        ▶ 朗读（无强调版本）
      </button>
      <div class="tts-note">
        注：使用浏览器内置 Web Speech API。效果因浏览器和系统 TTS 引擎而异。
        Chrome + macOS 组合效果最明显。
      </div>
    </div>

  </div>

  <script>
    // ── 示例内容 ──────────────────────────────────
    const EXAMPLES = {
      ai: `# Claude 分析报告

大语言模型（LLM）的核心能力来自**海量预训练**，而非*真正的理解*。

## 关键发现

模型在**代码生成**和**文本摘要**上表现*格外*出色，
但在*复杂推理*任务中仍有明显局限。

**重要结论：** 不应将 LLM 的输出视为*权威事实*，
而应作为**参考建议**，经人工验证后使用。`,

      article: `# Transformer 技术解析

*注意力机制*（Attention）是现代 AI 的基石。

## 核心创新

Google 在 2017 年提出的 Transformer 架构，
以**自注意力**取代了传统的*循环神经网络*（RNN）。

这一改变使模型能够**并行处理**整个序列，
训练效率提升了*数个数量级*。

## 实际影响

GPT、Claude、Gemini 等**所有主流大模型**都基于此架构，
足以说明其*划时代*的意义。`,

      mixed: `这是一个混合强调的示例。

普通文字，**粗体强调**，*斜体强调*，***粗斜体最强调***。

在 AI 领域，***提示词工程***（Prompt Engineering）是*目前*
最重要的技能之一，掌握它能让 AI 的表现提升**数倍**。

*我们*需要理解：**AI 工具**只是*工具*，
真正决定结果质量的，是使用工具的**人的思维**。`
    };

    // ── 完整 Markdown 内联渲染器 ──────────────────
    /**
     * 将 Markdown 文字渲染为包含 strong/em 标签的 HTML
     *
     * 支持的语法（按处理顺序排列）：
     * 1. ***text***  → <strong><em>text</em></strong>  （粗斜体，最先处理）
     * 2. **text**    → <strong>text</strong>            （粗体）
     * 3. __text__    → <strong>text</strong>            （粗体备用语法）
     * 4. *text*      → <em>text</em>                   （斜体）
     * 5. _text_      → <em>text</em>                   （斜体备用语法）
     * 6. `code`      → <code>code</code>               （行内代码）
     * 7. # 标题      → <h1>~<h3>                       （标题）
     * 8. \n\n        → <p> 分段                         （段落）
     */
    function renderMarkdown(text) {
      // 按段落拆分
      const blocks = text.split(/\n\n+/);

      return blocks.map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';

        // 处理标题行（# 开头）
        const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/m);
        if (headingMatch && trimmed.split('\n').length === 1) {
          const level = headingMatch[1].length;
          const content = renderInline(headingMatch[2]);
          return `<h${level}>${content}</h${level}>`;
        }

        // 处理列表（- 或 * 开头的行）
        if (/^[-*]\s/.test(trimmed)) {
          const items = trimmed.split('\n')
            .filter(l => /^[-*]\s/.test(l))
            .map(l => `<li>${renderInline(l.replace(/^[-*]\s/, ''))}</li>`)
            .join('');
          return `<ul>${items}</ul>`;
        }

        // 普通段落（处理内联元素）
        const lines = trimmed.split('\n').map(renderInline).join('<br>');
        return `<p>${lines}</p>`;

      }).filter(Boolean).join('\n');
    }

    /**
     * 处理行内 Markdown 元素（strong、em、code）
     * 注意处理顺序：三星号 → 双星号 → 单星号
     */
    function renderInline(text) {
      // 安全：先转义 HTML 特殊字符（注意：后续要插入真实的 HTML 标签，所以只转义 & < >）
      let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // 1. 粗斜体：***text*** → <strong><em>text</em></strong>
      html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

      // 2. 粗体：**text** → <strong>text</strong>
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

      // 3. 斜体：*text* → <em>text</em>
      //    注意：(?<!\*) 是负向后行断言，确保不匹配已处理的 ** 边界
      //    简化处理：上面已处理双星号，这里的 * 只剩单星号
      html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
      html = html.replace(/_([^_\n]+?)_/g, '<em>$1</em>');

      // 4. 行内代码：`code` → <code>code</code>
      html = html.replace(/`([^`]+?)`/g, '<code>$1</code>');

      return html;
    }

    // ── 实时渲染 ──────────────────────────────────
    function renderLive() {
      const input  = document.getElementById('mdInput').value;
      const output = document.getElementById('htmlOutput');
      const html   = renderMarkdown(input);
      output.innerHTML = html;
      updateStats(html);
    }

    function updateStats(html) {
      const strongCount = (html.match(/<strong>/g) || []).length;
      const emCount     = (html.match(/<em>/g)     || []).length;
      document.getElementById('strongCount').textContent = `${strongCount} 处`;
      document.getElementById('emCount').textContent     = `${emCount} 处`;
      document.getElementById('totalCount').textContent  = `${strongCount + emCount} 个`;
    }

    // ── 切换示例 ──────────────────────────────────
    function loadExample(key) {
      document.getElementById('mdInput').value = EXAMPLES[key];
      renderLive();
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
    }

    // ── TTS 演示 ──────────────────────────────────
    function speakWithEM() {
      if (!window.speechSynthesis) {
        alert('您的浏览器不支持 Web Speech API，请使用 Chrome 浏览器');
        return;
      }
      const text = '大语言模型并不真正理解语言，它只是在统计概率上做出最合理的预测。';
      // Web Speech API 不直接支持 SSML，通过停顿模拟强调
      const utterance = new SpeechSynthesisUtterance(
        '大语言模型...并不...真正理解...语言，它只是在统计概率上做出最合理的预测。'
      );
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }

    function speakPlain() {
      if (!window.speechSynthesis) return;
      const utterance = new SpeechSynthesisUtterance(
        '大语言模型并不真正理解语言，它只是在统计概率上做出最合理的预测。'
      );
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }

    // ── 初始化 ──────────────────────────────────
    document.getElementById('mdInput').value = EXAMPLES.ai;
    renderLive();
  </script>

</body>
</html>
```

---

## 🔍 逐行解析

```text
html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
```
三星号粗斜体**必须最先处理**，因为 `***` 同时包含 `**` 和 `*`，如果先处理双星号，`***text***` 会被识别为 `**` + `*text*` 的残余，造成解析错误。

```text
html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
```
单星号斜体使用 `[^*\n]` 字符类排除星号和换行，防止跨行匹配和与双星号冲突：

```text
/\*([^*\n]+?)\*/g
  \*          - 开始的单星号
  (           - 捕获组开始
  [^*\n]+?    - 一或多个"非星号、非换行"的字符（非贪婪）
  )           - 捕获组结束
  \*          - 结束的单星号
  g           - 全局匹配
```

```text
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'zh-CN';
speechSynthesis.speak(utterance);
```
Web Speech API 调用浏览器内置 TTS 引擎朗读文字。`lang` 设置语言，确保中文发音正确。

---

## 🌐 浏览器表现

- `<em>` 默认 `font-style: italic`（斜体），与 `<i>` 视觉完全相同
- 是内联元素，在文字流中不换行
- 可以嵌套在 `<strong>` 内（粗斜体）：`<strong><em>text</em></strong>`
- 屏幕阅读器的处理取决于具体实现，行为不完全统一
- 可通过 CSS 覆盖（如 `em { font-style: normal; color: blue; }`）

---

## 📦 常见属性/API

| 标签/概念 | 语义含义 | 视觉默认 | 典型使用场景 | 屏幕阅读器 |
|----------|---------|---------|------------|---------|
| `<em>` | 语气强调（句中重音） | 斜体 | 需要读者语气重读的词语 | 可能改变语调 |
| `<i>` | 无语义斜体（HTML5 重定义为术语/外来语） | 斜体 | 技术术语、外来词、书名（无强调） | 普通朗读 |
| `<strong>` | 重要性强调 | 粗体 | 警告、关键信息、必读内容 | 可能改变语调 |
| `<b>` | 无语义粗体 | 粗体 | 视觉关键词、产品名 | 普通朗读 |
| `<strong><em>` | 粗斜体，最高强调 | 粗斜体 | 最重要的强调内容 | 双重语气改变 |

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **`<em>` 是语气强调，`<i>` 是视觉斜体**——区别与 `<strong>` vs `<b>` 的逻辑完全一致
2. **处理顺序**：三星号（`***`）→ 双星号（`**`）→ 单星号（`*`）
3. **正则 `\*([^*\n]+?)\*`** 是单星号斜体的标准匹配，`[^*\n]` 排除星号和换行避免跨标记匹配
4. **TTS 语调**：`<em>` 可能影响 TTS 朗读语调，是无障碍体验的重要考量
5. **AI 输出中 `*text*` 和 `**text**` 都很常见**，完整的渲染器需要同时处理两者

---

## ⚠️ 易错点

**错误 1：处理顺序错误导致解析混乱**

```javascript
// ❌ 错误：先处理单星号，会把 ***text*** 中的部分内容错误匹配
text = text.replace(/\*([^*]+?)\*/g, '<em>$1</em>');   // 先单星号
text = text.replace(/\*\*(.+?)\*\*/g, '<strong>...');  // 此时双星号已残缺

// ✅ 正确：按长度从长到短处理
text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
text = text.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
```

**错误 2：语义误用——用 `<i>` 表达警告强调**

```html
<!-- ❌ 语义错误：i 标签不传达重要性 -->
<p>操作前<i>务必备份数据</i>！</p>

<!-- ✅ 正确：语气强调用 em，重要警告甚至可用 strong -->
<p>操作前<em>务必</em>备份数据！</p>
<p>操作前<strong>务必备份数据</strong>！</p>
```

**错误 3：在渲染 AI 输出时忘记 HTML 转义**

```javascript
// ❌ 危险：AI 输出可能包含 HTML 特殊字符或 <script>
function renderInline(text) {
  return text.replace(/\*(.+?)\*/g, '<em>$1</em>');  // 未转义，XSS 风险！
}

// ✅ 安全：先转义，再应用 Markdown 规则
function renderInline(text) {
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return html;
}
```

---

## 💡 最佳实践

1. **句中需要语气重音的词**用 `<em>`，技术术语/外来词用 `<i>`
2. **不要同时嵌套多层 em**（`<em><em>text</em></em>`），这没有额外语义，用 `<strong><em>` 表达粗斜体
3. **Markdown 解析器的测试用例**要覆盖：单个、多个、相邻、边界（行首/行尾）等情况
4. **生产环境考虑使用 marked.js 等成熟库**，自写解析器覆盖不了所有边界 case
5. **TTS 场景**：如果你的应用有朗读功能，优先使用 `<em>` 而非纯 CSS 斜体

---

## 🚀 AI 应用场景

### 场景 1：`*italic*` → `<em>`，Markdown 单斜体解析

```javascript
/**
 * 处理 Markdown 斜体：*text* 和 _text_ → <em>text</em>
 *
 * @param {string} text - 已经过 HTML 转义的文字（先转义再调用此函数）
 * @returns {string} 包含 <em> 标签的 HTML 字符串
 */
function renderItalic(text) {
  // 处理 *text*（排除行首的 ** 和 ***）
  text = text.replace(/(?<!\*)\*(?!\*)([^*\n]+?)(?<!\*)\*(?!\*)/g,
    '<em>$1</em>'
  );
  // 处理 _text_（避免匹配 URL 中的下划线，限制为无空格内容）
  text = text.replace(/(?<![_\w])_([^_\n]+?)_(?![_\w])/g,
    '<em>$1</em>'
  );
  return text;
}
```

### 场景 2：AI TTS 朗读时 em 对语调的影响

```javascript
/**
 * 提取 HTML 中 em 标签内的词语，并为 TTS 添加停顿（SSML 风格）
 *
 * Web Speech API 不直接支持 SSML，通过在 em 词语前后插入逗号和停顿
 * 来模拟强调效果（让 TTS 在该词前后短暂停顿，产生强调感）
 *
 * @param {string} html - 包含 em 标签的 HTML
 * @returns {string}    - 适合 TTS 朗读的纯文字（含停顿标记）
 */
function htmlToTTSText(html) {
  // 为 em 内的词语添加停顿
  const withPauses = html.replace(/<em>(.*?)<\/em>/g, '...$1...');
  // 移除其他 HTML 标签
  return withPauses.replace(/<[^>]+>/g, '');
}

function speakHTMLContent(htmlString) {
  const ttsText = htmlToTTSText(htmlString);
  const utterance = new SpeechSynthesisUtterance(ttsText);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.85;  // 稍慢，让停顿更明显
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// 使用示例
const aiMessage = '大语言模型<em>并不</em>真正理解语言，它基于<strong>统计概率</strong>生成文字。';
speakHTMLContent(aiMessage);
// TTS 朗读："大语言模型...并不...真正理解语言，它基于统计概率生成文字。"
```

### 场景 3：同时处理 strong 和 em 的完整内联 Markdown 解析

```javascript
/**
 * 完整的内联 Markdown 解析函数
 * 同时处理 strong、em、粗斜体、行内代码
 *
 * 安全版本：先 HTML 转义，再应用 Markdown 规则
 *
 * @param {string} markdown - Markdown 原始文字
 * @returns {string} 安全的 HTML 字符串
 */
function renderInlineMarkdown(markdown) {
  // 第一步：HTML 转义（防止 XSS）
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 第二步：行内代码（最先处理，防止代码内的 * 被误匹配）
  const codeSnippets = [];
  html = html.replace(/`([^`]+?)`/g, (_, code) => {
    codeSnippets.push(code);
    return `\x00CODE${codeSnippets.length - 1}\x00`;  // 占位符
  });

  // 第三步：按顺序处理强调语法
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g,      '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g,           '<strong>$1</strong>');
  html = html.replace(/\*([^*\n]+?)\*/g,      '<em>$1</em>');
  html = html.replace(/_([^_\n]+?)_/g,        '<em>$1</em>');

  // 第四步：还原行内代码占位符
  html = html.replace(/\x00CODE(\d+)\x00/g,
    (_, i) => `<code>${codeSnippets[parseInt(i)]}</code>`
  );

  return html;
}

// 测试
const md = "**粗体**，*斜体*，***粗斜体***，`code`，**加粗含*斜体*的文字**";
console.log(renderInlineMarkdown(md));
// 输出：<strong>粗体</strong>，<em>斜体</em>，<strong><em>粗斜体</em></strong>，<code>code</code>，<strong>加粗含<em>斜体</em>的文字</strong>
```

---

## 📝 练习题

**题目 1（基础）**：判断以下场景应该用 `<em>` 还是 `<i>`，说明理由：
- a）文章中"这个*不是*我的本意"（语气否定）
- b）代码注释中的 *deprecated*（废弃标记）
- c）"请*立即*保存您的工作"（紧迫强调）
- d）论文引用 *Attention Is All You Need*（文章标题）

**题目 2（AI 场景）**：写一个函数 `extractEmphasis(markdown)`，从 AI 的 Markdown 输出中提取所有被 `*` 包裹的词语，返回去重后的数组。例如：`"这是*重要*内容，*重要*不能忽视"` → `["重要"]`。

**题目 3（进阶）**：在本节完整渲染器的基础上，增加对删除线（`~~text~~` → `<del>text</del>`）的支持。注意：处理顺序应放在粗斜体之后、单星号之前。写出对应的正则表达式并解释每个部分的含义。

---

## 📌 本节总结

| 知识点 | 核心结论 |
|--------|---------|
| em vs i | `<em>` 语气强调（有语义），`<i>` 视觉斜体（无语义） |
| TTS 影响 | `<em>` 可能改变 TTS 朗读语调，`<i>` 无特殊处理 |
| AI Markdown | `*text*` 和 `_text_` → `<em>text</em>` |
| 处理顺序 | 三星号 → 双星号 → 单星号（从长到短，防止提前匹配） |
| 正则模式 | `/\*([^*\n]+?)\*/g`，排除星号和换行防止跨标记匹配 |
| 安全渲染 | 先 HTML 转义，再 Markdown 解析；行内代码用占位符保护 |

`<em>` 是语义化 HTML 体系中与 `<strong>` 并列的两大强调标签。理解它们的语义差异，掌握 Markdown 的正则解析顺序，能够构建一个安全、准确的 AI 输出渲染引擎——这是前端 AI 应用开发的核心基础技能。

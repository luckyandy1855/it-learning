# 强调标签 `<strong>`（HTML-014）

---

## 🎯 本节学习目标

- 理解 `<strong>` 的语义强调与 `<b>` 的视觉粗体的本质区别
- 了解屏幕阅读器如何处理 `<strong>` 标签
- 能够将 AI 输出中的 Markdown `**text**` 渲染为 `<strong>` 标签
- 掌握用正则表达式解析 Markdown 粗体的方法
- 建立语义化 HTML 的正确观念

---

## 📖 什么是强调标签 `<strong>`

`<strong>` 是 HTML 中表示**重要性强调**的语义标签，默认渲染为粗体文字。与外观相同的 `<b>` 标签不同，`<strong>` 携带明确的语义含义：**这段内容在逻辑上更重要、需要特别关注**。

```html
<p>
  注意：<strong>请勿将 API 密钥提交到公开仓库</strong>，
  一旦泄露，请立即在控制台重置。
</p>
```

在 AI 输出场景中，几乎所有 AI（ChatGPT、Claude、Gemini）在输出 Markdown 时都大量使用 `**粗体**` 来强调关键概念，前端渲染时需要将其正确转换为 `<strong>` 而非 `<b>`。

---

## 🧠 原理讲解

### 语义 vs 样式：`<strong>` vs `<b>` 的核心区别

HTML 有一个基本原则：**结构与样式分离**。标签负责表达"内容是什么"（语义），CSS 负责控制"内容长什么样"（样式）。

| 维度 | `<strong>` | `<b>` |
|------|-----------|------|
| 语义 | 重要内容，逻辑强调 | 无语义，仅视觉粗体 |
| 视觉 | 默认粗体 | 默认粗体 |
| 屏幕阅读器 | 通常会改变语调/重音 | 无特殊处理 |
| 搜索引擎 | 赋予内容更高权重 | 几乎无额外权重 |
| 推荐场景 | 警告、关键步骤、核心概念 | 产品名、关键词、引导词（视觉区分，无语义意义） |

### 屏幕阅读器如何处理 `<strong>`

屏幕阅读器（如 macOS VoiceOver、Windows NVDA）在朗读 `<strong>` 内的内容时，通常会：
- **升高音调**或**加重语气**，使盲人用户"听到"强调
- 部分阅读器会在朗读前说"strong"以提示

而 `<b>` 标签的内容，屏幕阅读器会以普通语调朗读，因为 `<b>` 只是外观粗体，没有语义强调的含义。

### AI Markdown 输出中的 `**bold**`

AI 大语言模型的 Markdown 输出标准中，`**text**` 和 `__text__` 都表示粗体强调，对应 HTML 中的 `<strong>` 标签：

```text
Markdown：  **注意力机制** 是 Transformer 的核心
HTML：      <strong>注意力机制</strong> 是 Transformer 的核心
```

渲染 AI 输出时，应将 `**...**` 转为 `<strong>` 而非 `<b>`，以保留原始的语义强调意图。

---

## 🏗 基本结构

```html
<!-- 标准用法：语义强调 -->
<p><strong>警告：</strong>此操作不可撤销。</p>

<!-- 在列表中强调关键步骤 -->
<ol>
  <li><strong>第一步：</strong>安装依赖 <code>npm install</code></li>
  <li><strong>第二步：</strong>配置环境变量</li>
</ol>

<!-- strong 可以嵌套在其他内联元素中 -->
<p>该模型在 <em>代码生成</em> 任务中表现<strong>极其优异</strong>。</p>

<!-- 不推荐的用法：仅为了视觉粗体 -->
<!-- <b>产品名称</b> -->    <!-- 如无强调语义，用 CSS font-weight 替代 -->
```

---

## ✅ 完整代码

AI 输出 Markdown `**text**` 渲染为 `<strong>` 的完整示例（含简单 Markdown 解析器）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown 粗体解析器 - strong 标签演示</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f0f2f5;
      padding: 40px 20px;
    }

    .container {
      max-width: 780px;
      margin: 0 auto;
    }

    h1 { font-size: 1.4rem; color: #1a1a2e; margin-bottom: 24px; }

    /* ── 上方：Markdown 输入区 ── */
    .panel {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
    }
    .panel-title {
      font-size: 12px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    textarea {
      width: 100%;
      height: 140px;
      font-family: "SF Mono", "Consolas", monospace;
      font-size: 14px;
      padding: 12px;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      resize: vertical;
      outline: none;
      line-height: 1.6;
    }
    textarea:focus { border-color: #7c83fd; }

    /* ── 按钮区 ── */
    .actions {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
    }
    button {
      padding: 9px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
    }
    .btn-render { background: #7c83fd; color: #fff; font-weight: 600; }
    .btn-reset  { background: #f0f0f0; color: #555; }

    /* ── 下方：渲染结果 ── */
    .rendered-output {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
    }

    .output-header {
      background: linear-gradient(135deg, #1a1a2e, #2d2d6b);
      color: #fff;
      padding: 14px 20px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .output-body {
      padding: 24px;
      font-size: 15px;
      line-height: 1.8;
      color: #222;
      min-height: 80px;
    }

    /* strong 标签的渲染样式 */
    .output-body strong {
      font-weight: 700;
      color: #1a1a2e;
      background: linear-gradient(to bottom, transparent 60%, #eef0ff 60%);
      padding: 0 2px;
    }

    /* em 标签的渲染样式 */
    .output-body em {
      font-style: italic;
      color: #4a4a8a;
    }

    .output-body p { margin-bottom: 12px; }
    .output-body p:last-child { margin-bottom: 0; }

    /* ── HTML 源码展示 ── */
    .source-panel {
      margin-top: 16px;
    }
    .source-code {
      font-family: "SF Mono", "Consolas", monospace;
      font-size: 13px;
      background: #1e1e2e;
      color: #cdd6f4;
      padding: 16px 20px;
      border-radius: 8px;
      overflow-x: auto;
      line-height: 1.7;
      white-space: pre-wrap;
      word-break: break-all;
    }
    /* 源码中的标签高亮 */
    .source-code .tag     { color: #89dceb; }
    .source-code .content { color: #a6e3a1; }

    /* ── 对比区 ── */
    .compare-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 14px;
    }
    .compare-table th {
      background: #f5f5ff;
      padding: 10px 16px;
      text-align: left;
      color: #444;
    }
    .compare-table td {
      padding: 10px 16px;
      border-top: 1px solid #f0f0f0;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>Markdown → HTML：`**粗体**` 渲染为 &lt;strong&gt;</h1>

    <!-- Markdown 输入 -->
    <div class="panel">
      <div class="panel-title">📝 Markdown 输入（AI 原始输出）</div>
      <textarea id="markdownInput">**注意力机制**是 Transformer 架构的核心创新。

它通过计算 **Query（查询）**、**Key（键）**、**Value（值）** 三个矩阵的点积，
为序列中的每个位置生成加权表示。

**关键优势：** 与传统 RNN 相比，Transformer 可以**并行处理**整个序列，
大幅提升了训练效率。这也是为什么现代大语言模型能够在如此**海量的语料**上完成训练。</textarea>
    </div>

    <div class="actions">
      <button class="btn-render" onclick="renderMarkdown()">▶ 渲染为 HTML</button>
      <button class="btn-reset"  onclick="resetDemo()">↺ 重置</button>
    </div>

    <!-- 渲染输出 -->
    <div class="rendered-output">
      <div class="output-header">🤖 渲染结果（strong 标签生效）</div>
      <div class="output-body" id="outputBody">
        <p>点击「渲染为 HTML」查看 Markdown 粗体的渲染效果…</p>
      </div>
    </div>

    <!-- HTML 源码展示 -->
    <div class="panel source-panel">
      <div class="panel-title">🔍 生成的 HTML 源码</div>
      <div class="source-code" id="sourceCode">（渲染后在此显示 HTML 源码）</div>
    </div>

  </div>

  <script>
    /**
     * 简单 Markdown 解析器
     * 支持：**粗体** → <strong>，*斜体* → <em>，段落 → <p>
     */
    function parseMarkdown(text) {
      // 按段落分割（空行分隔）
      const paragraphs = text.split(/\n\n+/).filter(p => p.trim());

      return paragraphs.map(para => {
        let html = para.trim();

        // 1. 处理粗体：**text** 或 __text__ → <strong>
        //    正则说明：
        //    \*\*   - 两个星号（需转义）
        //    (.+?)  - 非贪婪匹配任意字符（捕获组1）
        //    \*\*   - 结束的两个星号
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // 2. 处理斜体：*text* 或 _text_ → <em>
        //    注意：要在粗体之后处理，避免 ** 被 * 提前匹配
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');

        // 3. 换行处理：单个换行转为 <br>（段落内换行）
        html = html.replace(/\n/g, '<br>');

        return `<p>${html}</p>`;
      }).join('\n');
    }

    function renderMarkdown() {
      const input = document.getElementById('markdownInput').value;
      const output = document.getElementById('outputBody');
      const source = document.getElementById('sourceCode');

      // 渲染到页面
      const renderedHTML = parseMarkdown(input);
      output.innerHTML = renderedHTML;

      // 显示 HTML 源码（高亮 strong 标签）
      const highlighted = renderedHTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(&lt;strong&gt;)(.*?)(&lt;\/strong&gt;)/g,
          '<span class="tag">$1</span><span class="content">$2</span><span class="tag">$3</span>'
        );
      source.innerHTML = highlighted;
    }

    function resetDemo() {
      document.getElementById('outputBody').innerHTML =
        '<p>点击「渲染为 HTML」查看 Markdown 粗体的渲染效果…</p>';
      document.getElementById('sourceCode').textContent = '（渲染后在此显示 HTML 源码）';
    }

    // 页面加载时自动渲染一次
    renderMarkdown();
  </script>

</body>
</html>
```

---

## 🔍 逐行解析

```text
html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
```
正则表达式逐步拆解：

```text
/\*\*(.+?)\*\*/g
  \*\*      - 匹配两个星号（* 在正则中有特殊含义，需要 \ 转义）
  (         - 开始捕获组
  .+?       - 非贪婪匹配：至少 1 个任意字符，尽可能少匹配
             （非贪婪 ? 确保 **A** 和 **B** 各自独立匹配，不合并）
  )         - 结束捕获组
  \*\*      - 匹配结束的两个星号
  g         - 全局标志：匹配所有出现位置，不仅第一个
```

替换字符串 `'<strong>$1</strong>'` 中的 `$1` 引用第一个捕获组的内容（即两个 `**` 之间的文字）。

```text
html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
```
必须在粗体替换**之后**执行，否则 `**text**` 会被 `*` 的单星号规则提前匹配（先处理双星号，再处理单星号）。

---

## 🌐 浏览器表现

- `<strong>` 默认渲染为粗体（`font-weight: bold`），与 `<b>` 视觉完全相同
- 是内联元素，在文字流中不换行
- 可以通过 CSS 覆盖默认样式（如改变颜色、添加下划线等）
- 屏幕阅读器根据实现不同会有不同处理（部分加重语气，部分无特殊处理）

---

## 📦 常见属性/API

| 标签/概念 | 语义 | 视觉默认 | 推荐场景 | 屏幕阅读器 | SEO 权重 |
|----------|------|---------|---------|----------|---------|
| `<strong>` | 重要性强调（语义） | 粗体 | 警告、关键步骤、核心概念 | 可能改变语调 | 略高于普通文字 |
| `<b>` | 无语义，视觉粗体 | 粗体 | 产品名、关键词（无强调意图） | 普通朗读 | 无额外权重 |
| `<em>` | 语义斜体强调 | 斜体 | 术语、外来词、需要强调的词 | 可能改变语调 | 略高于普通文字 |
| `<i>` | 无语义，视觉斜体 | 斜体 | 技术术语、思维活动文字 | 普通朗读 | 无额外权重 |
| `font-weight: bold` | 无语义，纯 CSS | 粗体 | 视觉设计，无语义需求 | 无特殊处理 | 无额外权重 |

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **`<strong>` ≠ `<b>`**：两者视觉相同，但语义不同；有强调意图用 `<strong>`，纯视觉用 `<b>` 或 CSS
2. **AI Markdown `**text**` → `<strong>`**，这是所有 AI 输出渲染器的核心规则
3. **正则 `\*\*(.+?)\*\*`**：双星号粗体的标准匹配模式，记住非贪婪匹配 `?` 的作用
4. **先处理双星号，再处理单星号**，顺序错误会导致解析混乱
5. **渲染 AI 输出时注意 XSS 安全**：将 Markdown 文字渲染为 HTML 时，先对原始文字中的特殊字符转义，再应用 Markdown 规则

---

## ⚠️ 易错点

**错误 1：混淆 `<strong>` 和 `<b>`**

```html
<!-- ❌ 语义错误：警告信息用 b，传达不了重要性 -->
<b>警告：此操作不可撤销！</b>

<!-- ✅ 正确：警告用 strong 表达重要性 -->
<strong>警告：此操作不可撤销！</strong>
```

**错误 2：正则贪婪匹配导致合并多个粗体**

```javascript
// ❌ 错误：贪婪匹配 .+ 会把中间的 ** 也吃掉
"**A** 和 **B**".replace(/\*\*(.+)\*\*/g, '<strong>$1</strong>');
// 结果：<strong>A** 和 **B</strong>  ← 错误！

// ✅ 正确：非贪婪匹配 .+?
"**A** 和 **B**".replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
// 结果：<strong>A</strong> 和 <strong>B</strong>  ✓
```

**错误 3：单星号先于双星号处理**

```javascript
// ❌ 错误顺序
text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');    // 先处理单星号
text = text.replace(/\*\*(.+?)\*\*/g, '<strong>...</strong>'); // 已被破坏

// ✅ 正确顺序：双星号先处理
text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');  // 先双星号
text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');              // 再单星号
```

---

## 💡 最佳实践

1. **有语义需求时用 `<strong>`**：警告、注意事项、关键概念、必读内容
2. **纯视觉粗体用 CSS**：标题、导航项的粗体，不代表强调，应用 `font-weight: bold`
3. **不要为了 SEO 滥用 `<strong>`**：搜索引擎会识别关键词密度，滥用会适得其反
4. **Markdown 渲染器要考虑嵌套**：`***text***` 表示又粗又斜，对应 `<strong><em>text</em></strong>`
5. **生产环境使用成熟的 Markdown 库**（如 marked.js、micromark），自写解析器仅适合学习和简单场景

---

## 🚀 AI 应用场景

### 场景：用正则将 AI 输出的 Markdown 粗体渲染为 `<strong>`

以下是生产级别可用的粗体解析函数：

```javascript
/**
 * 将 AI 输出中的 Markdown 粗体标记转换为 HTML <strong> 标签
 *
 * 支持的语法：
 *   **text**  → <strong>text</strong>
 *   __text__  → <strong>text</strong>
 *
 * 安全处理：先转义 HTML 特殊字符，再应用 Markdown 规则
 *
 * @param {string} markdown - AI 返回的 Markdown 原始文字
 * @returns {string}        - 包含 <strong> 标签的 HTML 字符串
 */
function renderBold(markdown) {
  // 第一步：转义 HTML 特殊字符（防止 XSS）
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  // 第二步：将 **text** 转换为 <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 第三步：将 __text__ 转换为 <strong>（另一种 Markdown 粗体语法）
  html = html.replace(/__([\s\S]+?)__/g, '<strong>$1</strong>');

  return html;
}

// 使用示例
const aiOutput = "**注意：**请确保 API 密钥安全，**不要**提交到 Git 仓库。";
const rendered = renderBold(aiOutput);
// 结果：<strong>注意：</strong>请确保 API 密钥安全，<strong>不要</strong>提交到 Git 仓库。

// 安全地插入到页面（innerHTML 接受经过转义的内容）
document.querySelector('.ai-bubble').innerHTML = rendered;
```

**在 AI 流式输出中实时渲染粗体**：

```javascript
/**
 * 接收 AI 流式文字块，积累缓冲区，检测完整粗体后再渲染
 * 解决流式场景下 ** 可能被拆分到不同数据包的问题
 */
class StreamingMarkdownRenderer {
  constructor(container) {
    this.container = container;
    this.buffer    = '';       // 缓冲未完成的 Markdown
    this.currentP  = null;     // 当前段落元素
  }

  // 接收新的文字块（每次 SSE 收到数据时调用）
  append(chunk) {
    this.buffer += chunk;

    // 检测段落分隔
    if (this.buffer.includes('\n\n')) {
      const [complete, rest] = this.buffer.split('\n\n');
      this._renderParagraph(complete);
      this.buffer = rest || '';
    } else {
      // 段落未完成，更新当前段落的内容（带粗体渲染）
      this._updateCurrentP(this.buffer);
    }
  }

  // 流结束时，渲染剩余内容
  flush() {
    if (this.buffer.trim()) {
      this._renderParagraph(this.buffer);
      this.buffer = '';
    }
  }

  _renderParagraph(text) {
    const p = document.createElement('p');
    p.innerHTML = renderBold(text);  // 调用上面的 renderBold 函数
    this.container.appendChild(p);
    this.currentP = null;
    this.container.scrollTop = this.container.scrollHeight;
  }

  _updateCurrentP(text) {
    if (!this.currentP) {
      this.currentP = document.createElement('p');
      this.container.appendChild(this.currentP);
    }
    this.currentP.innerHTML = renderBold(text);
    this.container.scrollTop = this.container.scrollHeight;
  }
}

// 使用示例
const renderer = new StreamingMarkdownRenderer(document.getElementById('messageList'));
// 模拟 SSE 流
['**注意：**这是', '一个**重要**', '的消息。\n\n', '第二段内容。'].forEach(chunk => {
  renderer.append(chunk);
});
renderer.flush();
```

---

## 📝 练习题

**题目 1（基础）**：下面哪些场景应该用 `<strong>`，哪些应该用 `<b>`？说明理由：
- a）网站 Logo 旁边的品牌名称
- b）表单中"必填项"的提示文字
- c）医疗网站上的"紧急情况请拨打 120"

**题目 2（AI 场景）**：写一个函数 `countBoldWords(markdown)`，接受 AI 的 Markdown 输出字符串，返回其中被 `**` 包裹的词语数组。例如输入 `"**A** 和 **B** 很重要"` 返回 `["A", "B"]`。

**题目 3（进阶）**：扩展本节的 `parseMarkdown` 函数，增加对 `***text***`（粗斜体）的支持，将其渲染为 `<strong><em>text</em></strong>`。注意：处理顺序很重要，需在双星号和单星号规则之前处理三星号。

---

## 📌 本节总结

| 知识点 | 核心结论 |
|--------|---------|
| strong vs b | `<strong>` 有语义强调，`<b>` 是纯视觉粗体 |
| 屏幕阅读器 | `<strong>` 可能改变朗读语调，`<b>` 无特殊处理 |
| AI Markdown | `**text**` → `<strong>`，是 Markdown 规范的标准映射 |
| 正则模式 | `/\*\*(.+?)\*\*/g`，非贪婪匹配防止合并多个粗体 |
| 处理顺序 | 先处理三星号（粗斜体），再处理双星号（粗体），最后处理单星号（斜体） |
| 安全渲染 | 先 HTML 转义，再应用 Markdown 规则，防止 XSS |

`<strong>` 是 HTML 语义化体系中的重要一员，也是 AI 输出渲染中出现频率最高的语义标签。掌握它与 `<b>` 的区别，以及 Markdown 粗体的正则解析，是构建 AI 输出渲染引擎的核心技能。

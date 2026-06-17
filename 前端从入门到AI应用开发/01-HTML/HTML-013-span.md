# 内联容器 `<span>`（HTML-013）

---

## 🎯 本节学习目标

- 理解 `<span>` 作为内联容器与 `<div>` 的本质区别
- 掌握 `<span>` 在文字中标记关键词、计数器等的用法
- 能够用 JavaScript 高亮 AI 输出中的关键词
- 实现 Token 计数器标注
- 理解 span 在代码高亮中的作用

---

## 📖 什么是内联容器 `<span>`

`<span>` 是 HTML 中最通用的**内联（inline）容器标签**，与 `<div>` 并列为两大通用容器。区别在于：`<div>` 是块级容器（独占一行），`<span>` 是内联容器（在行内流动，不换行）。

`<span>` 本身没有任何默认样式，专门用于在一段文字中标记出某个词或片段，然后通过 CSS 或 JavaScript 对它进行样式控制或数据操作。

```html
<p>
  注意力机制是 <span class="highlight">Transformer</span> 的核心创新，
  本次回复共消耗 <span class="token-count">128 tokens</span>。
</p>
```

---

## 🧠 原理讲解

### 内联元素与文字流

内联元素随文字在同一行中流动，不会打断文字的布局。这是 `<span>` 与 `<div>` 最根本的区别：

```text
块级（div）：
┌──────────────────────────┐
│ 独占一整行                │
└──────────────────────────┘
┌──────────────────────────┐
│ 下一个 div 另起一行       │
└──────────────────────────┘

内联（span）：
这是正文文字 [span 在行内] 继续正文，不换行。
```

### span 的应用原理

`<span>` 的价值在于它将"定位"和"标记"分离：

1. **定位**：告诉浏览器"这个词需要特殊处理"
2. **标记**：通过 `class`、`data-*`、`id` 传递元数据
3. **处理**：CSS 根据 class 改变样式，JS 根据选择器操作内容

在 AI 输出场景中，span 是实现三大功能的核心：
- **关键词高亮**：`<span class="highlight">重要概念</span>`
- **Token 计数标注**：`<span class="token-count">128 tokens</span>`
- **代码语法高亮**：`<span class="keyword">function</span>`

---

## 🏗 基本结构

```html
<!-- 在段落中高亮关键词 -->
<p>大语言模型基于 <span class="highlight">Transformer</span> 架构。</p>

<!-- Token 计数标记 -->
<div class="ai-footer">
  <span class="token-count">输入：89 tokens</span>
  <span class="token-count">输出：142 tokens</span>
</div>

<!-- 代码高亮（语法着色） -->
<code>
  <span class="keyword">const</span>
  <span class="var-name">model</span>
  <span class="operator">=</span>
  <span class="string">'claude-3-5-sonnet'</span>
</code>

<!-- 带数据属性的 span -->
<span class="entity" data-type="person" data-confidence="0.95">张三</span>
```

---

## ✅ 完整代码

AI 输出中高亮关键词 + Token 计数标记完整示例：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 输出关键词高亮 + Token 计数</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f5f5f5;
      padding: 40px 20px;
    }

    .demo-wrap {
      max-width: 720px;
      margin: 0 auto;
    }

    h1 { font-size: 1.4rem; color: #1a1a2e; margin-bottom: 24px; }

    /* ── 控制面板 ── */
    .controls {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
    }
    .controls label {
      font-size: 13px;
      color: #555;
      display: block;
      margin-bottom: 6px;
    }
    .keyword-input {
      width: 100%;
      padding: 9px 14px;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      margin-bottom: 10px;
    }
    .keyword-input:focus { border-color: #7c83fd; }
    .btn-group { display: flex; gap: 8px; }
    button {
      padding: 8px 18px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-primary { background: #7c83fd; color: #fff; }
    .btn-clear   { background: #f0f0f0; color: #555; }
    .btn-primary:hover { background: #5a61e8; }

    /* ── AI 消息卡片 ── */
    .ai-card {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
    }

    /* 卡片头部 */
    .ai-card-header {
      background: linear-gradient(135deg, #1a1a2e, #2d2d6b);
      color: #fff;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ai-card-header .name {
      font-size: 14px;
      font-weight: 600;
      display: flex; align-items: center; gap: 8px;
    }

    /* Token 计数 span —— 在头部右侧显示 */
    .token-badge {
      display: flex;
      gap: 10px;
    }
    .token-count {
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 20px;
      font-weight: 500;
    }
    .token-count.input-token  { background: rgba(124,131,253,.3); color: #b0b7ff; }
    .token-count.output-token { background: rgba(124,253,156,.2); color: #7cfd9c; }

    /* 正文区 */
    .ai-card-body {
      padding: 24px;
      font-size: 15px;
      line-height: 1.8;
      color: #222;
    }
    .ai-card-body p { margin-bottom: 14px; }
    .ai-card-body p:last-child { margin-bottom: 0; }

    /* ── 高亮关键词 span ── */
    span.highlight {
      background: #fef08a;         /* 黄色高亮背景 */
      color: #713f12;              /* 深棕色文字，确保对比度 */
      padding: 1px 4px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background .2s;
    }
    span.highlight:hover { background: #fde047; }

    /* ── 实体标注 span（命名实体识别风格）── */
    span.entity-tech {
      background: #dbeafe;
      color: #1d4ed8;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 0.9em;
      font-weight: 500;
    }
    span.entity-tech::after {
      content: " [技术]";
      font-size: 0.75em;
      opacity: 0.65;
    }

    /* 高亮统计 */
    .highlight-stats {
      font-size: 12px;
      color: #888;
      padding: 10px 20px;
      border-top: 1px solid #f0f0f0;
      background: #fafafa;
    }
  </style>
</head>
<body>

  <div class="demo-wrap">
    <h1>AI 输出关键词高亮 + Token 计数器演示</h1>

    <!-- 控制面板 -->
    <div class="controls">
      <label>输入要高亮的关键词（多个词用英文逗号分隔）：</label>
      <input class="keyword-input" id="keywordInput"
        value="Transformer,注意力机制,预训练,微调,RLHF">
      <div class="btn-group">
        <button class="btn-primary" onclick="applyHighlight()">✨ 应用高亮</button>
        <button class="btn-clear"   onclick="clearHighlight()">✕ 清除高亮</button>
      </div>
    </div>

    <!-- AI 消息卡片 -->
    <div class="ai-card">

      <!-- 头部：模型名 + Token 计数 span -->
      <div class="ai-card-header">
        <div class="name">🤖 Claude 3.5 Sonnet</div>
        <div class="token-badge">
          <!-- Token 计数用 span 标注，因为它在行内显示 -->
          <span class="token-count input-token"  id="inputTokens">↑ 89 tokens</span>
          <span class="token-count output-token" id="outputTokens">↓ 0 tokens</span>
        </div>
      </div>

      <!-- 正文：AI 输出内容（关键词将被 span 包裹） -->
      <div class="ai-card-body" id="aiContent">
        <p>
          大语言模型（LLM）的核心技术是 Transformer 架构。
          Transformer 于 2017 年由 Google 团队提出，其最重要的创新是
          注意力机制（Self-Attention），它允许模型在生成每个词时动态参考
          整个上下文序列。
        </p>
        <p>
          现代 LLM 的训练分为两个阶段：首先是预训练阶段，模型在海量文本上
          学习语言统计规律；随后是微调阶段，通过 RLHF（基于人类反馈的强化学习）
          使模型的输出更符合人类偏好。正是预训练与微调的结合，
          造就了 ChatGPT 和 Claude 等产品的出色表现。
        </p>
      </div>

      <!-- 高亮统计 -->
      <div class="highlight-stats" id="highlightStats">
        点击「应用高亮」查看关键词标注效果
      </div>

    </div>
  </div>

  <script>
    // 保存原始 HTML，用于清除高亮
    const originalHTML = document.getElementById('aiContent').innerHTML;

    // Token 计数模拟（每秒递增，模拟流式输出）
    let outputTokenCount = 0;
    const outputSpan = document.getElementById('outputTokens');
    const tokenInterval = setInterval(() => {
      if (outputTokenCount < 142) {
        outputTokenCount += Math.floor(Math.random() * 8) + 1;
        outputTokenCount = Math.min(outputTokenCount, 142);
        outputSpan.textContent = `↓ ${outputTokenCount} tokens`;
      } else {
        clearInterval(tokenInterval);
      }
    }, 200);

    /**
     * 将 AI 输出文字中的关键词包裹为 <span class="highlight">
     * 核心原理：
     * 1. 获取文字内容（用正则匹配关键词）
     * 2. 将匹配词替换为带 span 的 HTML
     * 注意：需要用 innerHTML 写入（因为要插入标签），
     *       但关键词来自用户自定义输入，需要转义特殊字符
     */
    function applyHighlight() {
      const keywordsRaw = document.getElementById('keywordInput').value;
      const keywords = keywordsRaw
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      if (keywords.length === 0) return;

      // 先恢复原始内容
      const container = document.getElementById('aiContent');
      container.innerHTML = originalHTML;

      // 对每个关键词在文字节点中进行替换
      let totalCount = 0;
      keywords.forEach(keyword => {
        totalCount += highlightKeyword(container, keyword);
      });

      document.getElementById('highlightStats').textContent =
        `共找到并标注了 ${totalCount} 处关键词（${keywords.length} 个关键词）`;
    }

    /**
     * 在指定容器中高亮单个关键词
     * 递归遍历文字节点，避免破坏已有 HTML 结构
     */
    function highlightKeyword(container, keyword) {
      let count = 0;
      // 遍历所有文字节点
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null
      );

      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }

      textNodes.forEach(textNode => {
        const text = textNode.textContent;
        if (!text.includes(keyword)) return;

        // 创建临时容器来解析带 span 的 HTML
        const temp = document.createElement('span');
        // 将关键词替换为带高亮 span 的 HTML
        temp.innerHTML = text.replace(
          new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          `<span class="highlight">${keyword}</span>`
        );

        count += temp.querySelectorAll('.highlight').length;

        // 用新节点替换原文字节点
        textNode.parentNode.replaceChild(temp, textNode);
        // 展开临时容器（将其子节点移出）
        temp.replaceWith(...temp.childNodes);
      });

      return count;
    }

    /** 清除所有高亮，恢复原始内容 */
    function clearHighlight() {
      document.getElementById('aiContent').innerHTML = originalHTML;
      document.getElementById('highlightStats').textContent =
        '高亮已清除，点击「应用高亮」重新标注';
    }
  </script>

</body>
</html>
```

---

## 🔍 逐行解析

```text
<span class="token-count input-token" id="inputTokens">↑ 89 tokens</span>
```
Token 计数用 `<span>` 而非 `<div>`，因为它在头部导航栏的同一行内显示，是内联内容。使用 `id` 供 JS 更新计数值。

```text
<span class="highlight">Transformer</span>
```
关键词用 `<span>` 包裹后，可通过 CSS 加背景色高亮，不影响文字的行内布局。

```text
temp.innerHTML = text.replace(regexp, `<span class="highlight">${keyword}</span>`);
```
将匹配到的关键词文字替换为带 `<span>` 标签的 HTML 字符串。这是动态高亮的核心操作。

```text
document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null)
```
安全地遍历所有文字节点（TextNode），而不破坏已有的 HTML 标签结构，是处理 DOM 文字内容的专业方式。

---

## 🌐 浏览器表现

- `<span>` 默认 `display: inline`，在文字流中占据其内容宽度，不换行
- 无默认 margin、padding、border、背景色
- 支持所有内联 CSS 属性（color、font-size、background 等）
- 通过 CSS 改为 `display: inline-block` 可以设置宽高，但通常不需要

---

## 📦 常见属性/API

| 对比项 | `<span>` | `<div>` |
|--------|---------|---------|
| 默认显示 | `inline`（行内，不换行） | `block`（块级，独占一行） |
| 默认尺寸 | 由内容决定 | 宽度撑满父容器 |
| 典型用途 | 段落内标记词语、计数器、语法高亮 | 布局分组、消息气泡、页面区块 |
| 嵌套规则 | 可在 `<p>`、`<li>` 等内联上下文中使用 | 不能放在 `<p>` 内（块不能嵌块） |
| CSS 修改显示 | 可改为 `inline-block` 或 `block` | 可改为 `inline`（较少见） |

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **`<span>` 是行内的，`<div>` 是块级的**——选择哪个取决于内容是否需要换行
2. **高亮关键词的标准做法**：用正则替换文字，将匹配词包裹为 `<span class="highlight">`
3. **Token 计数器**：用 `<span>` 在行内显示，通过 `textContent` 动态更新数字
4. **代码高亮**：每个语法元素（关键字、字符串、变量）对应一个 `<span>`，通过 class 添加颜色
5. **遍历文字节点用 `TreeWalker`**，比 innerHTML 替换更安全（不破坏已有标签结构）

---

## ⚠️ 易错点

**错误 1：在块级上下文中用 span 做布局**

```html
<!-- ❌ 错误：span 是行内，设置 width/margin 通常无效 -->
<span style="width: 200px; margin: 20px 0;">这不会有预期效果</span>

<!-- ✅ 正确：需要尺寸控制时用 div 或改为 inline-block -->
<span style="display: inline-block; width: 200px;">可以设置宽度了</span>
```

**错误 2：innerHTML 替换时破坏已有 span 标签**

```javascript
// ❌ 危险：如果内容已有 <span>，直接 innerHTML 替换会破坏嵌套结构
container.innerHTML = container.innerHTML.replace(/关键词/g, '<span>关键词</span>');

// ✅ 安全：用 TreeWalker 只替换文字节点，不动已有标签
```

**错误 3：用 span 代替语义标签**

```html
<!-- ❌ 不推荐：用 span 模拟强调 -->
<span style="font-weight: bold;">重要词</span>

<!-- ✅ 推荐：使用语义标签 -->
<strong>重要词</strong>
```

---

## 💡 最佳实践

1. **内联标记用 span，布局分组用 div**——这是最基本的选择原则
2. **给 span 一个有意义的 class**：`.highlight`、`.token-count`、`.keyword` 比 `.red-text` 更有语义
3. **代码高亮库（如 Prism.js、highlight.js）都基于 span**：了解 span 是理解这些库的前提
4. **Token 计数器用 `span` 而非文字拼接**，便于 JS 精确更新，不影响周围文字
5. **高亮功能要考虑大小写和特殊字符**：正则中用 `i` 标志不区分大小写，用 `\\$&` 转义特殊字符

---

## 🚀 AI 应用场景

### 场景 1：高亮 AI 输出中的关键词

```javascript
/**
 * 简洁版关键词高亮函数
 * 适合 AI 聊天消息气泡中使用
 *
 * @param {HTMLElement} element - 要处理的元素
 * @param {string[]} keywords   - 关键词数组
 */
function highlightKeywords(element, keywords) {
  // 将关键词转为正则表达式（转义特殊字符，支持多个关键词）
  const pattern = keywords
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const regex = new RegExp(`(${pattern})`, 'gi');

  // 遍历文字节点并替换
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    if (!regex.test(node.textContent)) return;
    regex.lastIndex = 0; // 重置正则状态

    const span = document.createElement('span');
    span.innerHTML = node.textContent.replace(regex,
      '<span class="highlight">$1</span>'
    );
    node.replaceWith(...span.childNodes);
  });
}

// 使用：高亮 AI 回答中的技术词汇
const bubble = document.querySelector('.ai-bubble');
highlightKeywords(bubble, ['Transformer', '注意力机制', 'RLHF']);
```

### 场景 2：Token 计数器标注

```javascript
/**
 * 更新 Token 计数显示
 * @param {number} inputTokens  - 输入 token 数
 * @param {number} outputTokens - 输出 token 数
 */
function updateTokenCount(inputTokens, outputTokens) {
  // 通过 span 的 id 精确更新，不影响周围文字
  const inputSpan  = document.getElementById('inputTokens');
  const outputSpan = document.getElementById('outputTokens');

  if (inputSpan)  inputSpan.textContent  = `↑ ${inputTokens} tokens`;
  if (outputSpan) outputSpan.textContent = `↓ ${outputTokens} tokens`;

  // 超出上下文限制时用 span 标红警告
  const MAX_CONTEXT = 128000;
  if (inputTokens + outputTokens > MAX_CONTEXT * 0.9) {
    outputSpan.style.color = '#ef4444'; // 红色警告
    outputSpan.title = '即将超出上下文限制';
  }
}

// 在 SSE 流式输出时实时更新
updateTokenCount(89, 142);
```

### 场景 3：代码高亮中的 span 应用（语法着色原理）

```javascript
/**
 * 极简 JS 关键字高亮（演示 span 在代码高亮中的原理）
 */
function highlightJS(code) {
  const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for'];
  const strings  = /('.*?'|".*?"|`.*?`)/g;
  const comments = /(\/\/.*$)/gm;

  return code
    // 高亮字符串
    .replace(strings,  '<span class="token-string">$1</span>')
    // 高亮注释
    .replace(comments, '<span class="token-comment">$1</span>')
    // 高亮关键词
    .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'),
      '<span class="token-keyword">$1</span>'
    );
}

// 使用
const codeEl = document.querySelector('code');
codeEl.innerHTML = highlightJS(codeEl.textContent);
```

---

## 📝 练习题

**题目 1（基础）**：在一段介绍 AI 的文字中，用 `<span>` 标注三处关键词（自选），要求每个 span 有不同的 class，并写出对应的 CSS 样式（至少设置颜色和背景色）。

**题目 2（AI 场景）**：实现函数 `createTokenBadge(inputCount, outputCount)`，返回一个 `<div>` 元素，内含两个 `<span>`，分别显示输入和输出的 token 数。输入 span 用蓝色，输出 span 用绿色，超过 10000 tokens 时用红色。

**题目 3（进阶）**：实现"智能实体标注"功能：给定一段 AI 输出文字和一个实体列表（`[{text: "Claude", type: "AI产品"}, {text: "Anthropic", type: "公司"}]`），将每个实体包裹为 `<span class="entity" data-type="AI产品">Claude</span>` 的形式，同时在 span 后添加小字标注（如 `[AI产品]`）。

---

## 📌 本节总结

| 知识点 | 核心结论 |
|--------|---------|
| 显示类型 | `inline`（行内），随文字流动，不换行 |
| 与 div 的区别 | span 用于行内标记，div 用于块级分组 |
| 核心用途 | 关键词高亮、Token 计数、代码语法着色、实体标注 |
| JS 操作 | `createElement('span')` + 设置 `class`/`textContent` |
| 安全高亮 | 用 `TreeWalker` 遍历文字节点，比直接替换 innerHTML 更安全 |
| Token 计数 | 用 span 的 `id` 精确更新数字，不影响周围文字 |

`<span>` 是 AI 输出界面中最精密的"笔刷"——它让我们可以在不改变排版结构的前提下，对任意词语进行样式标注和数据绑定。掌握 span 的使用，是构建 AI 输出高亮、Token 统计和代码着色等功能的关键。

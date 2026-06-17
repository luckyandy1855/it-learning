# 列表标签 ul / ol / li（HTML-018）

---

## 🎯 本节学习目标

1. 掌握 `<ul>`、`<ol>`、`<li>` 三大列表标签的语义和用法
2. 理解 `<ol>` 的 `type`、`start`、`reversed` 属性
3. 了解 `<dl>`、`<dt>`、`<dd>` 描述列表的适用场景
4. 能用列表标签渲染 AI 推理步骤（Chain of Thought）和 AI 生成的建议列表
5. 掌握 Markdown 列表 → HTML 列表的 JS 解析实现

---

## 📖 什么是列表标签

HTML 提供三种原生列表：

| 列表类型 | 标签 | 用途 |
|----------|------|------|
| 无序列表 | `<ul>` | 顺序无关的项目（特性、建议） |
| 有序列表 | `<ol>` | 顺序重要的步骤（操作流程、推理步骤） |
| 描述列表 | `<dl>` | 术语与定义的配对（名词解释、参数说明） |

列表项统一用 `<li>`（list item）。`<dl>` 使用 `<dt>`（term）和 `<dd>`（description）代替 `<li>`。

```html
<!-- 无序列表 -->
<ul>
  <li>Claude</li>
  <li>ChatGPT</li>
</ul>

<!-- 有序列表 -->
<ol>
  <li>分析问题</li>
  <li>制定方案</li>
  <li>执行</li>
</ol>
```

---

## 🧠 原理讲解

列表标签的核心价值是**语义**，而非样式：

```text
<ul> = "这些项目之间没有先后顺序"
<ol> = "这些项目必须按此顺序排列"
<dl> = "这是一组术语与其解释"
```

搜索引擎和 screen reader 会根据语义选择正确的读取方式：
- `<ol>` 中的 `<li>` 会被 screen reader 读出序号（"第一步、第二步..."）
- `<ul>` 的 `<li>` 只读"项目符号"
- 正确的语义也影响 SEO 权重

**嵌套列表**：`<li>` 内部可以再嵌套 `<ul>` 或 `<ol>`，用于表达层级关系，如 AI 思维链的子步骤。

---

## 🏗 基本结构

```html
<!-- 无序列表：最简结构 -->
<ul>
  <li>项目一</li>
  <li>项目二</li>
</ul>

<!-- 有序列表：从第 3 步开始，倒序 -->
<ol start="3" reversed>
  <li>第三步（显示为 5）</li>
  <li>第四步（显示为 4）</li>
  <li>第五步（显示为 3）</li>
</ol>

<!-- 嵌套列表 -->
<ol>
  <li>主步骤一
    <ul>
      <li>子步骤 A</li>
      <li>子步骤 B</li>
    </ul>
  </li>
  <li>主步骤二</li>
</ol>

<!-- 描述列表 -->
<dl>
  <dt>Temperature</dt>
  <dd>控制 AI 输出的随机程度，0 最确定，1 最随机</dd>
  <dt>Top-p</dt>
  <dd>核采样参数，控制词汇选择的多样性</dd>
</dl>
```

---

## ✅ 完整代码

以下是一个 **AI 思维链（Chain of Thought）展示界面**，用 `<ol>` 展示 AI 推理步骤，用 `<ul>` 展示 AI 输出的建议列表，带嵌套子步骤：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI 思维链展示</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.7;
      padding: 2rem;
    }

    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .subtitle { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; }

    .chat-container { max-width: 780px; margin: 0 auto; }

    /* 用户消息气泡 */
    .user-msg {
      background: #6366f1;
      color: #fff;
      padding: 1rem 1.25rem;
      border-radius: 1rem 1rem 0.25rem 1rem;
      margin-bottom: 1.25rem;
      max-width: 70%;
      margin-left: auto;
    }

    /* AI 回复区域 */
    .ai-reply {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 0.25rem 1rem 1rem 1rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }

    .ai-reply .ai-label {
      font-size: 0.75rem;
      color: #6366f1;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
      text-transform: uppercase;
    }

    /* 思维链标题 */
    .cot-title {
      font-size: 0.85rem;
      color: #94a3b8;
      font-style: italic;
      margin-bottom: 0.75rem;
      border-left: 3px solid #c7d2fe;
      padding-left: 0.75rem;
    }

    /* 有序列表：AI 推理步骤 */
    .reasoning-steps {
      list-style: none;
      counter-reset: step-counter;
      margin-bottom: 1.5rem;
    }
    .reasoning-steps > li {
      counter-increment: step-counter;
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px dashed #f1f5f9;
    }
    .reasoning-steps > li:last-child { border-bottom: none; margin-bottom: 0; }
    .reasoning-steps > li::before {
      content: counter(step-counter);
      min-width: 1.75rem;
      height: 1.75rem;
      background: #6366f1;
      color: #fff;
      border-radius: 50%;
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 0.1rem;
    }

    .step-content { flex: 1; }
    .step-title { font-weight: 600; margin-bottom: 0.35rem; }
    .step-detail { color: #475569; font-size: 0.9rem; }

    /* 嵌套无序子步骤 */
    .sub-steps {
      list-style: disc;
      padding-left: 1.25rem;
      margin-top: 0.5rem;
      color: #64748b;
      font-size: 0.875rem;
    }
    .sub-steps li { margin-bottom: 0.25rem; }

    /* 无序列表：AI 建议 */
    .answer-title {
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: #0f172a;
    }
    .suggestions {
      list-style: none;
      margin-bottom: 1rem;
    }
    .suggestions > li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.6rem 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
      background: #f8fafc;
      font-size: 0.9rem;
    }
    .suggestions > li::before {
      content: '✦';
      color: #6366f1;
      flex-shrink: 0;
      font-size: 0.75rem;
      margin-top: 0.15rem;
    }

    /* 描述列表：参数说明 */
    .params-section { margin-top: 1.5rem; }
    .params-section h3 { font-size: 1rem; margin-bottom: 0.75rem; color: #475569; }
    .params dl { display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 1rem; }
    .params dt {
      font-weight: 600;
      color: #6366f1;
      font-family: monospace;
      padding: 0.25rem 0;
    }
    .params dd {
      color: #475569;
      font-size: 0.875rem;
      padding: 0.25rem 0;
      border-bottom: 1px solid #f1f5f9;
    }
  </style>
</head>
<body>

<div class="chat-container">
  <h1>🧠 AI 思维链展示</h1>
  <p class="subtitle">Chain of Thought — 让 AI 推理过程可见</p>

  <!-- 用户输入 -->
  <div class="user-msg">
    如何提升 Claude 的回答质量？请给出可操作的建议。
  </div>

  <!-- AI 回复：含思维链 + 建议列表 -->
  <div class="ai-reply">
    <div class="ai-label">Claude · 思维链模式</div>

    <!-- 思维链：有序列表 ol + li，带嵌套 ul 子步骤 -->
    <div class="cot-title">🔍 推理过程（Chain of Thought）</div>

    <ol class="reasoning-steps">
      <li>
        <div class="step-content">
          <div class="step-title">理解问题意图</div>
          <div class="step-detail">
            用户问的是"提升回答质量"，需要区分几个子维度：
            <ul class="sub-steps">
              <li>准确性（事实是否正确）</li>
              <li>完整性（是否覆盖关键点）</li>
              <li>可操作性（建议是否具体）</li>
            </ul>
          </div>
        </div>
      </li>

      <li>
        <div class="step-content">
          <div class="step-title">检索相关知识</div>
          <div class="step-detail">
            影响 AI 输出质量的因素主要集中在输入端（Prompt 设计）和参数设置：
            <ul class="sub-steps">
              <li>Prompt 中的角色设定、任务描述、格式要求</li>
              <li>Temperature 参数控制随机性</li>
              <li>System Prompt 的权重高于 User Prompt</li>
            </ul>
          </div>
        </div>
      </li>

      <li>
        <div class="step-content">
          <div class="step-title">整合最优建议</div>
          <div class="step-detail">
            综合考虑普通用户的使用门槛，优先推荐无需修改参数即可见效的方法：
            <ul class="sub-steps">
              <li>提示词结构优化（优先级最高）</li>
              <li>示例驱动（Few-shot）</li>
              <li>逐步分解复杂任务</li>
            </ul>
          </div>
        </div>
      </li>

      <li>
        <div class="step-content">
          <div class="step-title">形成可操作输出</div>
          <div class="step-detail">将建议格式化为清单，便于用户直接参照执行。</div>
        </div>
      </li>
    </ol>

    <!-- 最终建议：无序列表 ul + li -->
    <div class="answer-title">📋 提升 Claude 回答质量的 5 个方法</div>
    <ul class="suggestions">
      <li>在 Prompt 开头明确角色："你是一位资深产品经理，请以专业视角..."</li>
      <li>用"三段式"结构描述任务：背景 + 具体需求 + 期望输出格式</li>
      <li>提供 1-3 个示例（Few-shot），让 AI 模仿输出风格</li>
      <li>复杂任务分步提问，每步确认后再继续，避免一次性发送过多要求</li>
      <li>在结尾加"如有不确定请说明"，减少 AI 幻觉的置信度虚高问题</li>
    </ul>

    <!-- 描述列表：参数说明 -->
    <div class="params-section">
      <h3>⚙️ 关键 API 参数说明</h3>
      <div class="params">
        <dl>
          <dt>temperature</dt>
          <dd>输出随机性，0~1，创意写作用 0.8，精确回答用 0.2</dd>
          <dt>top_p</dt>
          <dd>核采样，控制词汇多样性，与 temperature 通常只调其一</dd>
          <dt>max_tokens</dt>
          <dd>最大输出 token 数，控制回答长度上限</dd>
          <dt>system</dt>
          <dd>系统级指令，优先级高于用户消息，适合设定角色和约束</dd>
        </dl>
      </div>
    </div>
  </div>

  <!-- 动态渲染区：JS 解析 Markdown 列表 -->
  <div class="ai-reply" id="dynamic-section">
    <div class="ai-label">动态渲染示例</div>
    <p style="color:#64748b; font-size:0.9rem; margin-bottom:1rem;">
      以下内容由 JS 解析 Markdown 列表后动态生成：
    </p>
    <div id="md-output"></div>
  </div>
</div>

<script>
// AI 输出的 Markdown 列表文本（模拟 API 返回）
const markdownList = `
1. 分析用户真实需求
   - 区分表面需求与深层需求
   - 确认任务优先级
2. 设计提示词框架
   - 角色设定
   - 格式约束
   - 示例提供
3. 验证输出质量
4. 迭代优化

以下是额外的无序建议：
- 保持提示词简洁，避免超过 500 字
- 高复杂度任务使用 Claude 3.5 Sonnet 或以上版本
- 对输出结果进行二次校验
`;

// 简易 Markdown 列表解析器
function parseMarkdownLists(text) {
  const lines = text.split('\n');
  let html = '';
  let inOl = false;
  let inUl = false;
  let inSubUl = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 有序列表项（如 "1. "、"2. "）
    const olMatch = line.match(/^(\d+)\.\s+(.+)/);
    // 无序子项（以 2-3 个空格或 tab 开头的 "- "）
    const subUlMatch = line.match(/^[ \t]{2,4}-\s+(.+)/);
    // 无序列表项（以 "- " 开头）
    const ulMatch = !subUlMatch && line.match(/^-\s+(.+)/);

    if (olMatch) {
      if (inSubUl) { html += '</ul>'; inSubUl = false; }
      if (inUl) { html += '</ul>'; inUl = false; }
      if (!inOl) { html += '<ol style="padding-left:1.5rem;margin-bottom:0.75rem;">'; inOl = true; }
      html += `<li style="margin-bottom:0.5rem;">${olMatch[2]}`;
    } else if (subUlMatch) {
      if (!inSubUl) { html += '<ul style="padding-left:1.25rem;margin-top:0.35rem;list-style:disc;color:#64748b;font-size:0.875rem;">'; inSubUl = true; }
      html += `<li>${subUlMatch[1]}</li>`;
    } else if (ulMatch) {
      if (inSubUl) { html += '</ul>'; inSubUl = false; }
      if (inOl) {
        // 关闭上一个 ol 中最后的 li
        html += '</li></ol>';
        inOl = false;
      }
      if (!inUl) { html += '<ul style="padding-left:1.5rem;margin-bottom:0.5rem;list-style:disc;">'; inUl = true; }
      html += `<li style="margin-bottom:0.35rem;">${ulMatch[1]}</li>`;
    } else {
      // 非列表行：关闭当前所有打开的列表
      if (inSubUl) { html += '</ul></li>'; inSubUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      if (inUl) { html += '</ul>'; inUl = false; }
      if (line.trim()) {
        html += `<p style="margin-bottom:0.5rem;color:#475569;font-size:0.9rem;">${line.trim()}</p>`;
      }
    }
  }

  // 关闭未闭合的标签
  if (inSubUl) html += '</ul></li>';
  if (inOl) html += '</ol>';
  if (inUl) html += '</ul>';

  return html;
}

document.getElementById('md-output').innerHTML = parseMarkdownLists(markdownList);
</script>

</body>
</html>
```

---

## 🔍 逐行解析

```text
<ol class="reasoning-steps">     → 有序列表，语义：步骤有明确顺序
  <li>                           → 列表项，浏览器自动生成序号
    <ul class="sub-steps">       → 嵌套无序列表，语义：子项无顺序
      <li>子步骤 A</li>          → 内层列表项
    </ul>
  </li>
</ol>

<ul class="suggestions">         → 无序列表，语义：建议之间无顺序
  <li>...</li>                   → 各建议项
</ul>

<dl>                             → 描述列表容器
  <dt>temperature</dt>           → 术语名称（definition term）
  <dd>控制随机性...</dd>         → 对应解释（definition description）
</dl>
```

---

## 🌐 浏览器表现

| 列表类型 | 默认样式 | screen reader 朗读方式 |
|----------|----------|-----------------------|
| `<ul>` | 圆点（disc）| "项目符号列表，包含 N 项" |
| `<ol>` | 阿拉伯数字 | "有序列表，包含 N 项，第一项..." |
| `<ol type="A">` | 大写字母 A, B, C | 按字母序朗读 |
| `<ol reversed>` | 序号倒数 | 从最大数倒数朗读 |
| `<dl>` | `<dt>` 粗体，`<dd>` 缩进 | "术语：值" 配对朗读 |

---

## 📦 常见属性

| 标签/属性 | 说明 | 示例 |
|-----------|------|------|
| `<ul>` | 无序列表容器，`<li>` 的父元素 | `<ul>...</ul>` |
| `<ol>` | 有序列表容器，`<li>` 的父元素 | `<ol>...</ol>` |
| `<li>` | 列表项，`<ul>` 或 `<ol>` 的直接子元素 | `<li>第一项</li>` |
| `<ol type>` | 序号类型：`1`（数字）、`A`/`a`（字母）、`I`/`i`（罗马数字） | `<ol type="A">` |
| `<ol start>` | 起始序号，整数值 | `<ol start="5">` 从 5 开始 |
| `<ol reversed>` | 倒序排列，序号从大到小 | `<ol reversed>` |
| `<li value>` | 覆盖当前项的序号值（仅在 `<ol>` 中有效） | `<li value="10">` |
| `<dl>` | 描述列表，含 `<dt>` 和 `<dd>` 对 | `<dl>...</dl>` |
| `<dt>` | 描述列表的术语/标题 | `<dt>Temperature</dt>` |
| `<dd>` | 对应 `<dt>` 的解释说明，可多个 | `<dd>控制随机性</dd>` |

**`<dl>` vs `<ul>` 选择指南：**

```text
用 <ul>：项目之间平等，没有配对关系（特性列表、工具列表）
用 <ol>：有明确顺序（步骤、排名、推理链）
用 <dl>：术语与解释配对（名词解释、参数文档、FAQ 问答）
```

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. `<ol>` 的 `start` + `reversed` 组合**

```html
<!-- 第 3-5 步，倒序显示为 5、4、3 -->
<ol start="3" reversed>
  <li>步骤三（显示 5）</li>
  <li>步骤四（显示 4）</li>
  <li>步骤五（显示 3）</li>
</ol>
```

**2. 嵌套列表的正确写法**

```html
<!-- ✅ 嵌套列表必须在 <li> 内部，不能在 <ul>/<ol> 直接子级 -->
<ul>
  <li>主项目
    <ul>           <!-- ✅ 在 <li> 内 -->
      <li>子项</li>
    </ul>
  </li>
</ul>

<!-- ❌ 错误：<ul> 直接嵌套 <ul> -->
<ul>
  <ul>
    <li>错误</li>
  </ul>
</ul>
```

**3. CSS 重置列表样式**

```css
/* 重置浏览器默认的 padding 和 list-style */
ul, ol {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
```

---

## ⚠️ 易错点

**错误 1：`<ul>`/`<ol>` 的直接子元素必须是 `<li>`**

```html
<!-- ❌ 错误：直接放 <p> 在 <ul> 里 -->
<ul>
  <p>这是错误的</p>
</ul>

<!-- ✅ 正确 -->
<ul>
  <li><p>这样可以</p></li>
</ul>
```

**错误 2：把 `<dl>` 当纯样式表格用**

`<dl>` 的语义是"术语与定义的配对"，不应用来做两列布局，那样应该用 CSS Grid 或 `<table>`。

**错误 3：序号通过 `<li>` 手写数字**

```html
<!-- ❌ 错误：序号不应手写，改顺序时会乱 -->
<ul>
  <li>1. 第一步</li>
  <li>2. 第二步</li>
</ul>

<!-- ✅ 正确：用 <ol> 让浏览器自动生成序号 -->
<ol>
  <li>第一步</li>
  <li>第二步</li>
</ol>
```

---

## 💡 最佳实践

1. **AI 推理步骤用 `<ol>`**，建议列表用 `<ul>`，API 参数说明用 `<dl>`——语义选择决定无障碍质量
2. **CSS `counter` 自定义序号**比默认序号更灵活，可做圆圈序号、自定义前缀等
3. **嵌套不超过 3 层**，超过 3 层应重新考虑信息架构
4. **导航栏用 `<nav>` + `<ul>` + `<li>` + `<a>` 组合**，是最规范的 HTML 导航结构
5. **AI 生成 Markdown 后必须在前端转为真正的 `<ol>`/`<ul>`**，不要直接用字符串展示

---

## 🚀 AI 应用场景

### 场景一：AI 输出 Markdown 列表 → HTML 列表渲染

AI API（如 Claude、ChatGPT）返回的内容通常是 Markdown 格式：

```text
- 建议一
- 建议二

1. 步骤一
2. 步骤二
```

前端需要将其渲染为真正的 HTML 列表，而不是直接 `innerHTML`（安全风险）：

```html
<div id="output"></div>

<script>
// 将 AI 返回的 Markdown 列表解析为安全的 HTML 列表
function markdownListToHTML(text) {
  const lines = text.trim().split('\n');
  let html = '';
  let currentType = null; // 'ul' | 'ol' | null

  lines.forEach(line => {
    const ulMatch = line.match(/^[-*+]\s+(.+)/);      // 无序：- item
    const olMatch = line.match(/^\d+\.\s+(.+)/);       // 有序：1. item

    if (ulMatch) {
      if (currentType !== 'ul') {
        if (currentType) html += `</${currentType}>`;
        html += '<ul>';
        currentType = 'ul';
      }
      // 转义 HTML 特殊字符，防止 XSS
      html += `<li>${escapeHTML(ulMatch[1])}</li>`;
    } else if (olMatch) {
      if (currentType !== 'ol') {
        if (currentType) html += `</${currentType}>`;
        html += '<ol>';
        currentType = 'ol';
      }
      html += `<li>${escapeHTML(olMatch[1])}</li>`;
    } else {
      // 非列表行，关闭当前列表
      if (currentType) {
        html += `</${currentType}>`;
        currentType = null;
      }
      if (line.trim()) {
        html += `<p>${escapeHTML(line.trim())}</p>`;
      }
    }
  });

  if (currentType) html += `</${currentType}>`;
  return html;
}

// 防止 XSS 的 HTML 转义函数
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 模拟 AI API 返回的 Markdown
const aiMarkdown = `以下是推荐的 AI 工具：
- Claude：长文档处理与代码分析
- ChatGPT：多模态输入，插件丰富
- Perplexity：实时搜索，附引用来源

使用步骤：
1. 选择适合场景的 AI 工具
2. 设计清晰的提示词
3. 验证并迭代输出结果`;

document.getElementById('output').innerHTML = markdownListToHTML(aiMarkdown);
</script>
```

### 场景二：嵌套列表渲染 AI 思维链

```html
<div id="cot-output"></div>

<script>
// 模拟 Claude 开启 extended thinking 后返回的思维链数据结构
const thinkingData = {
  steps: [
    {
      title: "理解问题",
      detail: "用户想了解大模型幻觉的成因",
      subPoints: ["语言模型的统计本质", "训练数据覆盖的局限性"]
    },
    {
      title: "分析核心原因",
      detail: "幻觉（Hallucination）源于模型对未知领域的"自信补全"",
      subPoints: [
        "模型优化目标是预测下一个 token，而非事实核查",
        "RLHF 训练可能强化了听起来合理但不准确的回答"
      ]
    },
    {
      title: "形成解答",
      detail: "总结可供普通用户理解的解释"
    }
  ]
};

function renderChainOfThought(data) {
  const ol = document.createElement('ol');
  ol.style.cssText = 'padding-left:1.5rem; line-height:1.8;';

  data.steps.forEach(step => {
    const li = document.createElement('li');
    li.style.marginBottom = '0.75rem';

    const title = document.createElement('strong');
    title.textContent = step.title;
    li.appendChild(title);

    if (step.detail) {
      const detail = document.createElement('p');
      detail.textContent = step.detail;
      detail.style.cssText = 'color:#475569; font-size:0.9rem; margin:0.25rem 0;';
      li.appendChild(detail);
    }

    // 嵌套无序子列表
    if (step.subPoints && step.subPoints.length > 0) {
      const subUl = document.createElement('ul');
      subUl.style.cssText = 'padding-left:1.25rem; color:#64748b; font-size:0.875rem;';
      step.subPoints.forEach(point => {
        const subLi = document.createElement('li');
        subLi.textContent = point;
        subUl.appendChild(subLi);
      });
      li.appendChild(subUl);
    }

    ol.appendChild(li);
  });

  return ol;
}

document.getElementById('cot-output').appendChild(renderChainOfThought(thinkingData));
</script>
```

---

## 📝 练习题

**题目 1（基础）**：用 `<ol>` 创建一个"如何向 AI 提问"的 5 步操作指南，用 `<ul>` 列出每步的注意事项（嵌套在对应 `<li>` 内）。

**题目 2（进阶）**：用 `<dl>` 创建一个 AI API 参数说明表，包含 `temperature`、`top_p`、`max_tokens`、`system`、`stop` 五个参数，每个参数配一个 `<dd>` 说明默认值和适用场景。

**题目 3（AI 场景）**：编写一个函数 `renderAIResponse(markdown)`，接收 AI 返回的 Markdown 字符串（包含有序列表、无序列表和普通段落的混合内容），输出安全的 HTML 字符串（需防 XSS），并将结果渲染到页面指定容器中。要求：
- 有序列表（`1. `）渲染为 `<ol><li>`
- 无序列表（`- `）渲染为 `<ul><li>`
- 普通文本渲染为 `<p>`
- 所有内容进行 HTML 转义，防止注入攻击

---

## 📌 本节总结

| 知识点 | 核心要点 |
|--------|---------|
| `<ul>` | 无序列表，用于顺序无关的项目，如建议、特性 |
| `<ol>` | 有序列表，用于步骤、推理链，序号自动生成 |
| `<li>` | 列表项，必须在 `<ul>`/`<ol>` 内，可嵌套列表 |
| `<ol start>` | 从指定数字开始计数 |
| `<ol reversed>` | 倒序计数 |
| `<ol type>` | 序号类型：1、A、a、I、i |
| `<dl>/<dt>/<dd>` | 描述列表，适合术语与定义、参数说明 |
| AI 场景 | Markdown `- ` → `<ul><li>`，`1. ` → `<ol><li>`；注意 XSS 防护 |

列表标签的语义选择是 HTML 写作的基本功，在 AI 应用中，正确将 AI 的 Markdown 输出转换为语义正确的 HTML 列表，是前端对接 AI API 的必备技能。

# 标题标签 h1~h6（HTML-010）

---

## 🎯 本节学习目标

- 理解 h1~h6 标签的语义含义与文档大纲算法
- 掌握 h1 只用一次的原则及原因
- 了解搜索引擎如何权衡标题层级
- 能够为 AI 知识库文章页面构建合理的标题层级
- 掌握用 JavaScript 将 Markdown 标题解析为 HTML 标题的方法

---

## 📖 什么是标题标签 h1~h6

HTML 提供了 6 个级别的标题标签，从 `<h1>` 到 `<h6>`，数字越小级别越高，字体默认越大。标题标签是 HTML 中最重要的**语义化标签**之一，它们不仅影响页面的视觉呈现，更直接决定文档结构、SEO 排名和无障碍访问体验。

```text
h1 > h2 > h3 > h4 > h5 > h6
最高级           最低级
```

在 AI 应用场景中，几乎所有 AI（ChatGPT、Claude、Gemini）生成的 Markdown 内容都大量使用 `#`（h1）和 `##`（h2）、`###`（h3），渲染引擎需要将其正确转换为 HTML 标题标签。

---

## 🧠 原理讲解

### 文档大纲算法（Document Outline）

浏览器和辅助技术（屏幕阅读器）通过"文档大纲算法"来理解页面内容的层级结构。每一个标题标签都是大纲中的一个节点：

```text
h1: 大模型技术解析
  h2: 一、Transformer 架构
    h3: 1.1 注意力机制
    h3: 1.2 位置编码
  h2: 二、训练方法
    h3: 2.1 预训练
    h3: 2.2 微调
```

这棵树状结构使屏幕阅读器用户可以快速跳转到任意章节，也让搜索引擎蜘蛛高效提取关键信息。

### h1 只用一次的原则

每个页面只应出现**一个** `<h1>`，原因如下：

1. **语义唯一性**：h1 代表整篇文章的主题，就像书的书名，一本书只有一个书名。
2. **SEO 权重**：搜索引擎将 h1 视为页面最重要的关键词载体，多个 h1 会稀释权重，甚至被判为关键词堆砌。
3. **辅助技术**：屏幕阅读器用户习惯按 h1 快速定位页面主题，多个 h1 会造成混乱。

> 注意：HTML5 规范允许每个 `<section>` 内有独立的 h1，但实际 SEO 和辅助技术实现中，仍建议全页只有一个 h1。

### 搜索引擎如何权衡标题层级

| 标签 | SEO 权重 | 搜索引擎处理方式 |
|------|---------|--------------|
| h1   | 最高     | 提取为页面核心关键词，强烈影响排名 |
| h2   | 高       | 章节主题词，辅助关键词覆盖 |
| h3   | 中       | 细粒度主题，长尾词覆盖 |
| h4~h6 | 低～极低 | 几乎不被单独权重，影响整体语义 |

---

## 🏗 基本结构

```html
<h1>页面主标题（全页唯一）</h1>
<h2>章节标题</h2>
<h3>小节标题</h3>
<h4>更细粒度的分组</h4>
<h5>次级分组</h5>
<h6>最低级标题（较少使用）</h6>
```

**关键规则**：
- 不要跳级（如从 h2 直接跳到 h4）
- 不要用标题标签仅为了控制字体大小（应用 CSS）
- 每个 h2 之下的内容在语义上应属于该 h2 的范围

---

## ✅ 完整代码

AI 知识库文章页面，模拟 ChatGPT 输出 Markdown 并渲染为 HTML 标题层级：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>大模型技术解析 - AI 知识库</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f5f5f5;
      color: #1a1a1a;
    }

    /* 顶部导航 */
    .nav {
      background: #1a1a2e;
      color: #fff;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-logo { font-size: 18px; font-weight: 700; color: #7c83fd; }
    .nav-sub  { font-size: 13px; color: #aaa; }

    /* 主区域 */
    .container {
      max-width: 820px;
      margin: 32px auto;
      background: #fff;
      border-radius: 12px;
      padding: 40px 48px;
      box-shadow: 0 2px 16px rgba(0,0,0,.08);
    }

    /* 标题样式 */
    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #1a1a2e;
      border-bottom: 3px solid #7c83fd;
      padding-bottom: 12px;
      margin-bottom: 8px;
    }
    .meta {
      font-size: 13px;
      color: #888;
      margin-bottom: 32px;
    }
    h2 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #2d2d6b;
      margin: 36px 0 14px;
      padding-left: 12px;
      border-left: 4px solid #7c83fd;
    }
    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #444;
      margin: 22px 0 10px;
    }
    p {
      line-height: 1.8;
      color: #333;
      margin-bottom: 14px;
    }
    .tag {
      display: inline-block;
      background: #eef0ff;
      color: #5a5fcd;
      font-size: 12px;
      padding: 2px 10px;
      border-radius: 20px;
      margin-right: 6px;
    }

    /* AI 生成标记 */
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f0fdf4;
      color: #15803d;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid #bbf7d0;
      margin-bottom: 24px;
    }
  </style>
</head>
<body>

  <nav class="nav">
    <span class="nav-logo">🤖 AI 知识库</span>
    <span class="nav-sub">/ 大模型技术</span>
  </nav>

  <div class="container">

    <!-- h1：全页唯一主标题 -->
    <h1>大模型技术解析：从 Transformer 到 ChatGPT</h1>

    <div class="meta">
      <span class="tag">深度学习</span>
      <span class="tag">NLP</span>
      <span class="tag">LLM</span>
      · 阅读约 8 分钟 · 由 Claude 生成并人工审校
    </div>

    <div class="ai-badge">✨ AI 辅助生成内容，已验证准确性</div>

    <!-- h2：第一章 -->
    <h2>一、Transformer 架构</h2>
    <p>
      Transformer 由 Google 在 2017 年提出，彻底改变了自然语言处理领域。
      其核心创新是<strong>自注意力机制</strong>，允许模型在处理每个词时
      同时考虑序列中所有其他词的上下文关系。
    </p>

    <!-- h3：小节 -->
    <h3>1.1 自注意力机制</h3>
    <p>
      自注意力（Self-Attention）通过计算 Query、Key、Value 三个矩阵的点积，
      为序列中的每个位置生成一个加权表示。权重越高，说明两个词之间的关联越强。
    </p>

    <h3>1.2 位置编码</h3>
    <p>
      由于 Transformer 并行处理序列，没有 RNN 的顺序信息，因此需要显式的
      <em>位置编码</em>来注入词序信息。常见方式包括正弦位置编码和可学习位置编码。
    </p>

    <!-- h2：第二章 -->
    <h2>二、大规模预训练</h2>
    <p>
      现代大语言模型的能力主要来自海量文本上的预训练。通过预测下一个词（自回归）
      或还原被遮蔽词（Masked LM），模型学到了语言的深层统计规律。
    </p>

    <h3>2.1 预训练阶段</h3>
    <p>
      GPT 系列采用自回归语言模型，在万亿 token 级别的语料上训练，
      使模型具备通用的文本理解和生成能力。
    </p>

    <h3>2.2 指令微调与 RLHF</h3>
    <p>
      预训练后的模型经过<strong>指令微调（Instruction Tuning）</strong>
      和基于人类反馈的强化学习（RLHF），才能真正理解用户意图并给出
      有帮助、无害的回答——这正是 ChatGPT 成功的关键。
    </p>

    <!-- h2：第三章 -->
    <h2>三、实际应用与局限性</h2>
    <p>
      大语言模型在代码生成、文本摘要、问答系统等场景表现优异，
      但仍面临幻觉（Hallucination）、知识截止、推理成本高等挑战。
    </p>

    <h3>3.1 幻觉问题</h3>
    <p>
      模型可能以极高置信度生成事实错误的内容。缓解方法包括：RAG（检索增强生成）、
      事实核查链、工具调用等。
    </p>

  </div>

</body>
</html>
```

---

## 🔍 逐行解析

```text
<h1>大模型技术解析：从 Transformer 到 ChatGPT</h1>
```
全页唯一的 h1，是页面核心主题，搜索引擎直接用它提取关键词。

```text
<h2>一、Transformer 架构</h2>
```
文章第一个顶层章节，h2 紧跟 h1，层级连续，不跳级。

```text
<h3>1.1 自注意力机制</h3>
```
h2 下的小节，h3 是 h2 的子级，逻辑上属于"Transformer 架构"这一章的细分。

```text
border-left: 4px solid #7c83fd;  /* h2 的左边框装饰 */
```
纯视觉样式，用 CSS 区分 h2 层级，不影响语义大纲。

---

## 🌐 浏览器表现

| 标签 | 默认字体大小 | 默认粗细 | 是否块级 |
|------|------------|---------|---------|
| h1   | 2em（≈32px） | bold    | 是      |
| h2   | 1.5em（≈24px）| bold   | 是      |
| h3   | 1.17em（≈18.7px）| bold | 是     |
| h4   | 1em（≈16px） | bold   | 是      |
| h5   | 0.83em（≈13.3px）| bold | 是     |
| h6   | 0.67em（≈10.7px）| bold | 是     |

> 默认样式因浏览器而略有差异，实际开发中应通过 CSS Reset 统一，再自定义标题样式。

---

## 📦 常见属性/API

| 标签/属性 | 默认字体大小 | SEO 权重 | 典型用途 | 是否推荐多次使用 | 备注 |
|----------|------------|---------|---------|---------------|------|
| `<h1>`   | 2em        | ★★★★★  | 页面主标题、文章标题 | ❌ 全页唯一 | SEO 最重要的文本信号 |
| `<h2>`   | 1.5em      | ★★★★   | 主要章节、栏目标题 | ✅ 可多次 | 关键词覆盖的主力 |
| `<h3>`   | 1.17em     | ★★★    | 章节下的小节 | ✅ 可多次 | 长尾词覆盖 |
| `<h4>`   | 1em        | ★★      | 细粒度分组、FAQ 问题 | ✅ 可多次 | 与正文大小相近，注意区分 |
| `<h5>`   | 0.83em     | ★       | 注释性分组、侧边栏 | ✅ 可多次 | 极少独立使用 |
| `<h6>`   | 0.67em     | ☆       | 最低级分组（罕见） | ✅ 可多次 | 实际项目中极少出现 |

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **h1 全页只用一次**，它是页面身份证
2. **层级不跳级**：h2 下只能接 h3，不能直接接 h4
3. **标题表达语义，不表达样式**：想要大字体用 CSS，不要用 h1 只是为了"字大"
4. **AI 输出 Markdown 的 `#` 对应 h1，`##` 对应 h2**，渲染时务必保持层级正确
5. **屏幕阅读器依赖标题导航**，语义正确的标题层级是无障碍的基础

---

## ⚠️ 易错点

**错误 1：把标题当样式工具**

```html
<!-- ❌ 错误：用 h3 只是因为字体大小合适 -->
<h3>注意事项</h3>  <!-- 如果这里实际上是 h5 级别的内容 -->

<!-- ✅ 正确：使用符合层级的标签，样式用 CSS 调整 -->
<h5 class="note-heading">注意事项</h5>
```

**错误 2：层级跳跃**

```html
<!-- ❌ 错误：从 h2 直接跳到 h4 -->
<h2>章节一</h2>
<h4>子小节</h4>

<!-- ✅ 正确：层级连续 -->
<h2>章节一</h2>
<h3>子小节</h3>
```

**错误 3：多个 h1**

```html
<!-- ❌ 错误 -->
<h1>文章标题</h1>
<h1>另一个重要标题</h1>

<!-- ✅ 正确 -->
<h1>文章标题</h1>
<h2>另一个重要标题</h2>
```

---

## 💡 最佳实践

1. 在写 HTML 前，先规划好文章的大纲树（可用注释标注）
2. h1 包含页面最核心的关键词，帮助 SEO
3. 用 CSS 的 `font-size`、`font-weight` 来控制视觉大小，而不是选错误的标题级别
4. AI 知识库、文档站点建议为每个 h2/h3 生成锚点链接（`id` + `#`），方便用户分享
5. 对于 AI 生成的 Markdown 内容，渲染时需检查 h1 是否重复（AI 经常在内容中写多个 `#` 标题）

---

## 🚀 AI 应用场景

### 场景：Markdown 渲染器将 `#` 转为 HTML 标题

ChatGPT、Claude 等 AI 输出的 Markdown 中大量使用 `#`、`##`、`###`。渲染时需将它们转为对应的 HTML 标题标签。

**为什么 AI 多用 h2/h3 而不是 h1？**

AI 生成的内容通常是文章的**一部分**（一个章节的内容），主标题 h1 由页面的宿主环境提供。如果 AI 在其输出中大量使用 `#`（h1），插入页面后会出现多个 h1，破坏文档结构和 SEO。因此，良好的 AI 输出规范是：内容本身从 `##`（h2）开始，主题词放在 `##` 标题中。

### 可运行代码：JS 将 Markdown 标题解析为 HTML

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Markdown 标题解析器</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; }
    textarea {
      width: 100%; height: 160px; font-family: monospace;
      font-size: 14px; padding: 12px; border: 1px solid #ddd;
      border-radius: 8px; resize: vertical;
    }
    button {
      margin-top: 12px; padding: 8px 20px;
      background: #7c83fd; color: #fff; border: none;
      border-radius: 6px; cursor: pointer; font-size: 14px;
    }
    #output {
      margin-top: 20px; padding: 20px;
      border: 1px solid #eee; border-radius: 8px;
      background: #fafafa; min-height: 80px;
    }
    #output h1 { font-size: 1.8rem; border-bottom: 2px solid #7c83fd; }
    #output h2 { font-size: 1.3rem; color: #2d2d6b; }
    #output h3 { font-size: 1.1rem; color: #555; }
  </style>
</head>
<body>
  <h1>Markdown 标题解析器</h1>
  <p>输入 Markdown 文本，点击解析，查看 HTML 标题渲染结果：</p>

  <textarea id="input" placeholder="# 大模型技术
## 一、Transformer
### 1.1 注意力机制
## 二、训练方法
### 2.1 预训练
普通段落文字不处理。"></textarea>

  <button onclick="parseMarkdown()">▶ 解析为 HTML</button>

  <div id="output">渲染结果将在此显示…</div>

  <script>
    /**
     * 将 Markdown 中的标题行转为对应 HTML 标题标签
     * 只处理 # 开头的标题行，其余行包裹为 <p>
     */
    function parseMarkdown() {
      const input = document.getElementById('input').value;
      const output = document.getElementById('output');

      // 按行分割
      const lines = input.split('\n');
      let html = '';

      lines.forEach(line => {
        const trimmed = line.trim();

        // 匹配 h1~h6：以 1~6 个 # 开头，后跟空格
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);

        if (headingMatch) {
          const level = headingMatch[1].length;  // # 的数量 = 标题级别
          const text  = headingMatch[2];          // 标题文字
          html += `<h${level}>${text}</h${level}>\n`;
        } else if (trimmed !== '') {
          // 非标题的非空行，包裹为段落
          html += `<p>${trimmed}</p>\n`;
        }
      });

      output.innerHTML = html;
    }
  </script>
</body>
</html>
```

**代码要点解析**：

```text
/^(#{1,6})\s+(.+)$/
  ^          - 行首
  (#{1,6})   - 捕获组1：1到6个#号
  \s+        - 至少一个空格（标准 Markdown 语法要求 # 后有空格）
  (.+)$      - 捕获组2：标题文字到行尾
```

---

## 📝 练习题

**题目 1（基础）**：下面的标题结构有什么问题？请修正：

```html
<h1>AI 工具评测</h1>
<h1>ChatGPT 详解</h1>
<h3>什么是 GPT</h3>
```

**题目 2（AI 场景）**：写一个函数 `extractOutline(html)`，接受包含 h1~h3 标签的 HTML 字符串，返回一个数组，每个元素包含 `{ level: 2, text: "章节名" }` 的格式，用于生成文章目录。

**题目 3（实践）**：仿照完整代码，设计一个"AI 学习笔记"页面，包含：
- h1：笔记主题（如"提示词工程学习笔记"）
- 至少 3 个 h2（三个学习模块）
- 每个 h2 下至少 1 个 h3

---

## 📌 本节总结

| 知识点 | 核心结论 |
|--------|---------|
| h1 使用次数 | 全页唯一，代表页面主题 |
| 层级规则 | 不跳级，h2 下只接 h3 |
| 语义 vs 样式 | 标题标签表达语义，字体大小用 CSS |
| SEO | h1 > h2 > h3，关键词越靠前级别越高效果越好 |
| AI 场景 | Markdown `#` → h1，AI 内容建议从 `##` 开始 |
| JS 解析 | 正则 `/^(#{1,6})\s+(.+)$/` 可提取标题级别和文字 |

标题标签是 HTML 语义化的起点，掌握好 h1~h6 的使用规范，是写出高质量、SEO 友好、无障碍页面的第一步。

# 表格标签 `<table>`（HTML-019）

---

## 🎯 本节学习目标

1. 掌握 `<table>` 相关的全部结构标签：`<caption>`、`<colgroup>`、`<col>`、`<thead>`、`<tbody>`、`<tfoot>`、`<tr>`、`<th>`、`<td>`
2. 理解 `<th scope>` 属性对无障碍访问的意义
3. 能构建语义完整的 AI 模型对比表格
4. 掌握将 Markdown 表格（`| col |` 格式）解析为 HTML `<table>` 的 JS 实现

---

## 📖 什么是 `<table>` 标签

`<table>` 是 HTML 中表示**二维表格数据**的标签。表格由行（`<tr>`）和列（`<th>`/`<td>`）交叉构成，适合展示具有行列关系的结构化数据。

```html
<table>
  <tr>
    <th>模型</th>
    <th>厂商</th>
  </tr>
  <tr>
    <td>Claude 3.5</td>
    <td>Anthropic</td>
  </tr>
</table>
```

**重要**：`<table>` 只用于**数据表格**，不要用于页面布局（那是 CSS Flexbox/Grid 的职责）。

---

## 🧠 原理讲解

表格的渲染分三个层次：

```text
1. 结构层：<table> → <thead>/<tbody>/<tfoot> → <tr> → <th>/<td>
2. 列组层：<colgroup> + <col>（影响整列样式，无需遍历每个 td）
3. 辅助层：<caption>（标题）、scope 属性（无障碍行列关联）
```

浏览器渲染表格时，必须先加载全部数据才能确定列宽，这是表格相较于 Flex/Grid 布局性能较低的原因。

`scope` 属性告诉 screen reader 此 `<th>` 关联的是**行**还是**列**：

```text
<th scope="col">  → 该标题头属于这一列的所有 td
<th scope="row">  → 该标题头属于这一行的所有 td
```

---

## 🏗 基本结构

```html
<table>
  <caption>表格标题</caption>

  <!-- 列组：可为整列统一设置宽度/样式 -->
  <colgroup>
    <col style="width: 30%" />
    <col style="width: 35%" />
    <col style="width: 35%" />
  </colgroup>

  <!-- 表头 -->
  <thead>
    <tr>
      <th scope="col">列一</th>
      <th scope="col">列二</th>
      <th scope="col">列三</th>
    </tr>
  </thead>

  <!-- 表体 -->
  <tbody>
    <tr>
      <th scope="row">行标题</th>  <!-- 行标题用 th，加 scope="row" -->
      <td>数据</td>
      <td>数据</td>
    </tr>
  </tbody>

  <!-- 表尾（汇总行） -->
  <tfoot>
    <tr>
      <td colspan="3">合计 / 说明</td>
    </tr>
  </tfoot>
</table>
```

---

## ✅ 完整代码

以下是一个 **AI 模型对比表格**，包含完整的 `<thead>`/`<tbody>`/`<tfoot>`、`<caption>`、`<th scope>`无障碍属性和 `<colgroup>` 样式分组：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI 模型对比</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      padding: 2rem;
      line-height: 1.6;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p.intro { color: #64748b; margin-bottom: 2rem; font-size: 0.9rem; }

    .table-wrapper {
      overflow-x: auto; /* 小屏横向滚动 */
      border-radius: 0.75rem;
      box-shadow: 0 1px 8px rgba(0,0,0,0.08);
      margin-bottom: 2rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      font-size: 0.9rem;
    }

    /* caption 位于表格上方 */
    caption {
      caption-side: top;
      font-size: 0.8rem;
      color: #94a3b8;
      padding: 0.75rem 1rem;
      text-align: left;
      background: #f8fafc;
      border-radius: 0.75rem 0.75rem 0 0;
      border-bottom: 1px solid #e2e8f0;
    }

    /* colgroup 控制列背景 */
    col.col-feature { background: #fafafa; }
    col.col-claude  { background: #fdf4ff; }
    col.col-gpt     { background: #f0f9ff; }
    col.col-gemini  { background: #f0fdf4; }

    thead { background: #0f172a; color: #fff; }
    thead th {
      padding: 0.9rem 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }

    tbody tr { border-bottom: 1px solid #f1f5f9; }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: #f8fafc; }

    tbody th {
      padding: 0.8rem 1rem;
      font-weight: 600;
      color: #475569;
      font-size: 0.85rem;
      background: #fafafa;
      border-right: 1px solid #e2e8f0;
      white-space: nowrap;
      vertical-align: top;
    }

    tbody td {
      padding: 0.8rem 1rem;
      color: #334155;
      vertical-align: top;
    }

    /* 评分徽章 */
    .badge {
      display: inline-block;
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .badge-green  { background: #dcfce7; color: #166534; }
    .badge-blue   { background: #dbeafe; color: #1e40af; }
    .badge-purple { background: #f3e8ff; color: #7e22ce; }
    .badge-gray   { background: #f1f5f9; color: #475569; }

    /* 星级评分 */
    .stars { color: #f59e0b; letter-spacing: 0.05em; }

    /* tfoot 汇总行 */
    tfoot tr { background: #f8fafc; border-top: 2px solid #e2e8f0; }
    tfoot td {
      padding: 0.75rem 1rem;
      color: #64748b;
      font-size: 0.8rem;
    }
    tfoot td:first-child {
      font-weight: 600;
      color: #475569;
    }

    /* Markdown 表格渲染区 */
    .md-section { margin-top: 2rem; }
    .md-section h2 { font-size: 1.1rem; margin-bottom: 0.75rem; }
    .md-input {
      width: 100%;
      font-family: monospace;
      font-size: 0.85rem;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
      resize: vertical;
      min-height: 120px;
      background: #1e293b;
      color: #e2e8f0;
    }
    .btn {
      background: #6366f1;
      color: #fff;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    .btn:hover { background: #4f46e5; }
    #md-table-output table {
      border-collapse: collapse;
      width: 100%;
      font-size: 0.875rem;
      background: #fff;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    #md-table-output th {
      background: #1e293b;
      color: #fff;
      padding: 0.6rem 1rem;
      text-align: left;
    }
    #md-table-output td {
      padding: 0.6rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    #md-table-output tr:last-child td { border-bottom: none; }
    #md-table-output .align-left   { text-align: left; }
    #md-table-output .align-center { text-align: center; }
    #md-table-output .align-right  { text-align: right; }
  </style>
</head>
<body>

<h1>🤖 AI 大模型对比</h1>
<p class="intro">数据来源：各官方文档及独立基准测试，更新于 2026 年 6 月</p>

<div class="table-wrapper">
  <table>

    <!-- 表格说明标题 -->
    <caption>
      表 1：主流 AI 大模型能力对比（Claude 3.5 Sonnet / GPT-4o / Gemini 1.5 Pro）
      · 评分仅供参考，实际表现因场景而异
    </caption>

    <!-- 列组：为每列设置不同背景色，无需修改每个 td -->
    <colgroup>
      <col class="col-feature" />   <!-- 特性列 -->
      <col class="col-claude" />    <!-- Claude 列 -->
      <col class="col-gpt" />       <!-- GPT-4o 列 -->
      <col class="col-gemini" />    <!-- Gemini 列 -->
    </colgroup>

    <!-- 表头：scope="col" 声明这是列标题 -->
    <thead>
      <tr>
        <th scope="col">对比维度</th>
        <th scope="col">Claude 3.5 Sonnet</th>
        <th scope="col">GPT-4o</th>
        <th scope="col">Gemini 1.5 Pro</th>
      </tr>
    </thead>

    <!-- 表体：行标题用 th + scope="row" -->
    <tbody>

      <tr>
        <th scope="row">开发厂商</th>
        <td>Anthropic</td>
        <td>OpenAI</td>
        <td>Google DeepMind</td>
      </tr>

      <tr>
        <th scope="row">上下文窗口</th>
        <td>200K tokens</td>
        <td>128K tokens</td>
        <td>1M tokens</td>
      </tr>

      <tr>
        <th scope="row">多模态能力</th>
        <td>
          <span class="badge badge-purple">文本 + 图像</span>
        </td>
        <td>
          <span class="badge badge-blue">文本 + 图像 + 音频</span>
        </td>
        <td>
          <span class="badge badge-green">文本 + 图像 + 视频 + 音频</span>
        </td>
      </tr>

      <tr>
        <th scope="row">代码能力</th>
        <td><span class="stars">★★★★★</span> 顶尖</td>
        <td><span class="stars">★★★★★</span> 顶尖</td>
        <td><span class="stars">★★★★☆</span> 优秀</td>
      </tr>

      <tr>
        <th scope="row">长文档处理</th>
        <td><span class="stars">★★★★★</span> 极强</td>
        <td><span class="stars">★★★★☆</span> 优秀</td>
        <td><span class="stars">★★★★★</span> 极强（100万token）</td>
      </tr>

      <tr>
        <th scope="row">中文能力</th>
        <td><span class="stars">★★★★☆</span> 优秀</td>
        <td><span class="stars">★★★★★</span> 顶尖</td>
        <td><span class="stars">★★★★★</span> 顶尖</td>
      </tr>

      <tr>
        <th scope="row">安全性设计</th>
        <td>Constitutional AI，拒绝率较高</td>
        <td>RLHF + 内容策略</td>
        <td>Google 安全框架</td>
      </tr>

      <tr>
        <th scope="row">API 定价<br /><small>（输入/百万token）</small></th>
        <td>$3.00</td>
        <td>$2.50</td>
        <td>$1.25（128K内）</td>
      </tr>

      <tr>
        <th scope="row">适合场景</th>
        <td>代码审查、长文档分析、写作润色</td>
        <td>通用对话、多模态、插件集成</td>
        <td>超长文档、视频理解、Google 生态</td>
      </tr>

    </tbody>

    <!-- 表尾：汇总说明 -->
    <tfoot>
      <tr>
        <td>综合推荐</td>
        <td>
          <span class="badge badge-purple">代码首选</span>
        </td>
        <td>
          <span class="badge badge-blue">通用首选</span>
        </td>
        <td>
          <span class="badge badge-green">超长文档</span>
        </td>
      </tr>
      <tr>
        <td colspan="4" style="font-style:italic; color:#94a3b8;">
          * 以上数据为测试时版本，模型持续更新，实际能力以官网最新说明为准。
        </td>
      </tr>
    </tfoot>

  </table>
</div>

<!-- Markdown 表格渲染演示 -->
<div class="md-section">
  <h2>🔄 Markdown 表格 → HTML Table 实时渲染</h2>
  <textarea class="md-input" id="md-input">| 工具 | 厂商 | 定价 | 适合场景 |
| :--- | :---: | ---: | :--- |
| Claude | Anthropic | $3/M | 代码、长文档 |
| ChatGPT | OpenAI | $2.5/M | 通用、多模态 |
| Gemini | Google | $1.25/M | 视频、超长文 |</textarea>
  <br />
  <button class="btn" onclick="renderMarkdownTable()">渲染为 HTML 表格</button>
  <div id="md-table-output"></div>
</div>

<script>
// Markdown 表格 → HTML Table 解析器
function parseMarkdownTable(markdown) {
  const lines = markdown.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return '<p style="color:#ef4444;">无效的 Markdown 表格</p>';

  // 第一行：表头
  const headerCells = parseRow(lines[0]);
  // 第二行：对齐声明（:--- / :---: / ---:）
  const alignRow = parseRow(lines[1]);
  const aligns = alignRow.map(cell => {
    const c = cell.trim();
    if (c.startsWith(':') && c.endsWith(':')) return 'align-center';
    if (c.endsWith(':')) return 'align-right';
    return 'align-left';
  });
  // 其余行：数据行
  const dataRows = lines.slice(2);

  let html = '<table><thead><tr>';
  headerCells.forEach((cell, i) => {
    html += `<th class="${aligns[i] || 'align-left'}">${escapeHTML(cell)}</th>`;
  });
  html += '</tr></thead><tbody>';

  dataRows.forEach(line => {
    const cells = parseRow(line);
    html += '<tr>';
    cells.forEach((cell, i) => {
      html += `<td class="${aligns[i] || 'align-left'}">${escapeHTML(cell)}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  return html;
}

// 解析一行：按 | 分割，去掉首尾空 | 和多余空格
function parseRow(line) {
  return line
    .split('|')
    .slice(1, -1)   // 去掉首尾的空字符串
    .map(cell => cell.trim());
}

// HTML 特殊字符转义（防 XSS）
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMarkdownTable() {
  const input = document.getElementById('md-input').value;
  document.getElementById('md-table-output').innerHTML = parseMarkdownTable(input);
}

// 页面加载时自动渲染一次
renderMarkdownTable();
</script>

</body>
</html>
```

---

## 🔍 逐行解析

```text
<table>                          → 表格容器
  <caption>...</caption>         → 表格标题，caption-side: top/bottom 控制位置

  <colgroup>                     → 列组容器（不渲染任何内容）
    <col style="width:30%" />    → 对应表格第 1 列，可设 width/background
    <col class="col-claude" />   → 对应第 2 列，通过 CSS 类设置样式
  </colgroup>

  <thead>                        → 表头区域（浏览器打印时每页重复显示）
    <tr>                         → 表头行
      <th scope="col">列标题</th> → 列标题，scope="col" 声明关联方向
    </tr>
  </thead>

  <tbody>                        → 表体区域（主要数据）
    <tr>
      <th scope="row">行标题</th> → 行标题，scope="row" 无障碍声明
      <td>数据单元格</td>
    </tr>
  </tbody>

  <tfoot>                        → 表尾区域（汇总、注释）
    <tr>
      <td colspan="4">合并4列</td> → colspan 合并横向单元格
    </tr>
  </tfoot>
</table>
```

---

## 🌐 浏览器表现

| 功能 | 表现 |
|------|------|
| `<thead>` 在打印时 | 每页顶部自动重复显示表头 |
| `<tfoot>` 在打印时 | 每页底部自动重复显示表尾 |
| `border-collapse: collapse` | 相邻单元格共享边框，表格更紧凑 |
| `<th scope="col/row">` | screen reader 读每个 td 时，会先朗读对应的 th 标题 |
| `<colgroup>` + `<col>` | 设置整列宽度/背景，无需给每个 td 单独加样式 |
| `overflow-x: auto` 在父容器 | 小屏幕时表格横向可滚动，不撑破页面 |

---

## 📦 常见属性 / API

| 元素/属性 | 用途 | 示例 |
|-----------|------|------|
| `<table>` | 表格容器，所有表格内容的根 | `<table>...</table>` |
| `<caption>` | 表格标题（必须是 table 第一个子元素） | `<caption>AI 模型对比</caption>` |
| `<colgroup>` | 列组容器，配合 `<col>` 对列统一设样式 | `<colgroup><col /><col /></colgroup>` |
| `<col>` | 单个列的样式声明，自闭合，与 HTML 列顺序一一对应 | `<col style="width:20%" />` |
| `<thead>` | 表头区域，包含列标题行 | `<thead><tr>...</tr></thead>` |
| `<tbody>` | 表体区域，包含数据行；可有多个 tbody | `<tbody>...</tbody>` |
| `<tfoot>` | 表尾区域，含汇总或注释行 | `<tfoot>...</tfoot>` |
| `<tr>` | 表格行，在 thead/tbody/tfoot 内 | `<tr>...</tr>` |
| `<th>` | 表头单元格，默认加粗居中；配合 `scope` 做无障碍 | `<th scope="col">列名</th>` |
| `<td>` | 数据单元格，普通内容 | `<td>Claude</td>` |
| `colspan` | 横向合并 N 个单元格 | `<td colspan="2">合并</td>` |
| `rowspan` | 纵向合并 N 个单元格 | `<td rowspan="3">合并</td>` |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. `border-collapse: collapse` 是表格必设 CSS**

```css
table {
  border-collapse: collapse; /* 合并相邻边框，避免双重边框 */
  width: 100%;
}
td, th {
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
}
```

**2. `colspan` 和 `rowspan` 合并单元格**

```html
<table>
  <tr>
    <td colspan="2">横跨两列</td>  <!-- 占用 2 列，后面少写 1 个 td -->
  </tr>
  <tr>
    <td rowspan="2">纵跨两行</td>   <!-- 占用 2 行，下一行少写 1 个 td -->
    <td>右侧数据</td>
  </tr>
  <tr>
    <!-- 此行因 rowspan 少写一个 td -->
    <td>右侧数据 2</td>
  </tr>
</table>
```

**3. `scope` 属性是无障碍必须**

```html
<!-- 列标题 -->
<th scope="col">能力</th>
<th scope="col">Claude</th>

<!-- 行标题（左列的 th） -->
<th scope="row">代码能力</th>

<!-- 多列/多行合并的标题 -->
<th scope="colgroup" colspan="2">主流模型</th>
```

---

## ⚠️ 易错点

**错误 1：`colspan` 导致列数不对**

```html
<!-- 原本 3 列的表格 -->
<tr>
  <td colspan="2">合并两列</td>  <!-- 这一行只需再写 1 个 td -->
  <td>第三列</td>                <!-- ✅ 正确 -->
  <!-- ❌ 如果再多写一个 td，会出现 4 列，布局错乱 -->
</tr>
```

**错误 2：`<caption>` 不是第一个子元素**

```html
<!-- ❌ 错误：caption 必须是 table 的第一个子元素 -->
<table>
  <thead>...</thead>
  <caption>标题</caption>   <!-- 错误位置 -->
</table>

<!-- ✅ 正确 -->
<table>
  <caption>标题</caption>   <!-- 第一个 -->
  <thead>...</thead>
</table>
```

**错误 3：用 `<table>` 做页面布局**

```html
<!-- ❌ 不要这样做！用 CSS Flexbox/Grid 代替 -->
<table>
  <tr>
    <td>左边栏</td>
    <td>主内容</td>
    <td>右边栏</td>
  </tr>
</table>
```

---

## 💡 最佳实践

1. **小屏幕务必在父容器加 `overflow-x: auto`**，防止表格撑破页面
2. **行列标题都加 `scope` 属性**，这是 WCAG 2.1 AA 级无障碍要求
3. **用 `<colgroup>` + `<col>` 统一设置列宽**，比给每个 `<td>` 加 style 更高效
4. **AI 生成的 Markdown 表格解析时必须转义 HTML 字符**，防止 XSS 注入
5. **表格数据量大时考虑虚拟滚动**，只渲染可视区域的行

---

## 🚀 AI 应用场景

### 场景一：AI 输出 Markdown 表格解析为 HTML table

AI 经常在回答中输出 Markdown 格式的表格：

```text
| 模型 | 上下文 | 价格 |
| :--- | :---: | ---: |
| Claude | 200K | $3/M |
| GPT-4o | 128K | $2.5/M |
```

前端解析时需处理三种对齐方式（`:---`、`:---:`、`---:`）：

```html
<div id="table-container"></div>

<script>
function markdownTableToHTML(markdown) {
  const lines = markdown.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return null;

  const headers = splitRow(lines[0]);
  const alignSpecs = splitRow(lines[1]);
  const aligns = alignSpecs.map(spec => {
    const s = spec.trim();
    if (s.startsWith(':') && s.endsWith(':')) return 'center';
    if (s.endsWith(':'))  return 'right';
    return 'left';
  });

  const table = document.createElement('table');
  table.style.cssText = 'border-collapse:collapse; width:100%; font-size:0.875rem;';

  // thead
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach((h, i) => {
    const th = document.createElement('th');
    th.textContent = h;
    th.scope = 'col';
    th.style.cssText = `text-align:${aligns[i]}; padding:0.6rem 1rem; background:#1e293b; color:#fff;`;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // tbody
  const tbody = document.createElement('tbody');
  lines.slice(2).forEach(line => {
    const cells = splitRow(line);
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #f1f5f9';
    cells.forEach((cell, i) => {
      const td = document.createElement('td');
      td.textContent = cell;  // 使用 textContent 自动转义，防 XSS
      td.style.cssText = `text-align:${aligns[i]}; padding:0.6rem 1rem;`;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

function splitRow(line) {
  return line.split('|').slice(1, -1).map(c => c.trim());
}

// 模拟 AI API 返回含 Markdown 表格的响应
const aiResponseText = `| 模型 | 上下文窗口 | 输入定价 | 推荐场景 |
| :--- | :---: | ---: | :--- |
| Claude 3.5 Sonnet | 200K | $3.00/M | 代码、长文档 |
| GPT-4o | 128K | $2.50/M | 通用、多模态 |
| Gemini 1.5 Pro | 1M | $1.25/M | 超长文档 |`;

const tableEl = markdownTableToHTML(aiResponseText);
if (tableEl) {
  document.getElementById('table-container').appendChild(tableEl);
}
</script>
```

### 场景二：用 JS 动态生成 AI 模型对比表格

```html
<div id="comparison-table"></div>

<script>
// 模拟来自 AI 或配置文件的模型数据
const models = [
  { name: "Claude 3.5 Sonnet", vendor: "Anthropic", context: "200K", score: 95, best: "代码/文档" },
  { name: "GPT-4o",            vendor: "OpenAI",    context: "128K", score: 93, best: "通用/多模态" },
  { name: "Gemini 1.5 Pro",    vendor: "Google",    context: "1M",   score: 90, best: "超长文档" }
];

function buildComparisonTable(data) {
  const wrapper = document.createElement('div');
  wrapper.style.overflowX = 'auto';

  const table = document.createElement('table');
  table.style.cssText = 'border-collapse:collapse; width:100%; font-size:0.875rem;';

  // caption
  const caption = document.createElement('caption');
  caption.textContent = `AI 模型对比（共 ${data.length} 款，生成于 ${new Date().toLocaleDateString('zh-CN')}）`;
  caption.style.cssText = 'text-align:left; padding:0.5rem; color:#64748b; font-size:0.8rem;';
  table.appendChild(caption);

  // thead
  const headers = ['模型', '厂商', '上下文', '综合评分', '最佳场景'];
  const thead = document.createElement('thead');
  const headerTr = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    th.scope = 'col';
    th.style.cssText = 'padding:0.75rem 1rem; background:#0f172a; color:#fff; text-align:left;';
    headerTr.appendChild(th);
  });
  thead.appendChild(headerTr);
  table.appendChild(thead);

  // tbody
  const tbody = document.createElement('tbody');
  data.forEach(model => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #f1f5f9';

    const cells = [model.name, model.vendor, model.context, `${model.score}分`, model.best];
    cells.forEach((value, i) => {
      const td = document.createElement('td');
      td.textContent = value;
      td.style.cssText = 'padding:0.75rem 1rem; color:#334155;';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  wrapper.appendChild(table);
  return wrapper;
}

document.getElementById('comparison-table').appendChild(buildComparisonTable(models));
</script>
```

---

## 📝 练习题

**题目 1（基础）**：用 HTML 创建一个 4 列 5 行的表格，包含 `<caption>`、`<thead>`、`<tbody>`，表头使用 `scope="col"`，首列为行标题使用 `scope="row"`。

**题目 2（进阶）**：在题目 1 的基础上，用 `<colgroup>` 为四列分别设置不同的背景色，并在底部加一个 `<tfoot>` 行，用 `colspan="4"` 合并所有单元格，显示数据来源说明。

**题目 3（AI 场景）**：编写一个函数 `parseAndRenderTable(markdownText, containerId)`，解析 AI 返回的 Markdown 表格（含对齐声明 `:---`、`:---:`、`---:`），渲染为完整的 HTML `<table>`，要求：
- 使用 DOM 方法（不使用 `innerHTML`），防止 XSS 注入
- 正确处理左对齐、居中、右对齐三种对齐方式
- 表头加 `scope="col"` 无障碍属性
- 表格外层加 `overflow-x: auto` 适配小屏滚动

---

## 📌 本节总结

| 知识点 | 核心要点 |
|--------|---------|
| `<table>` | 表格容器，仅用于数据，不用于布局 |
| `<caption>` | 表格标题，必须是 table 第一个子元素 |
| `<colgroup>/<col>` | 统一设置整列样式，比逐个 td 设置高效 |
| `<thead>/<tbody>/<tfoot>` | 表格分区，提升语义和打印体验 |
| `<th scope>` | 无障碍必须：`col` 声明列标题，`row` 声明行标题 |
| `<td colspan/rowspan>` | 合并单元格，注意总列数 |
| Markdown 表格解析 | 按 `|` 分割，处理对齐，用 textContent 防 XSS |

表格是展示结构化数据的最佳 HTML 工具，在 AI 应用中，将 AI 返回的 Markdown 表格正确渲染为语义化 HTML 是对接 AI API 的高频任务。

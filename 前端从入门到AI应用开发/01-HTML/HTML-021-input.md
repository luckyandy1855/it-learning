# 输入框标签 <input>（HTML-021）

---

## 🎯 本节学习目标

- 掌握 `<input>` 的作用与基本语法
- 理解 `type` 属性决定输入框行为的原理
- 学会 17 种常用 `type` 值，能根据场景选择正确类型
- 掌握 `maxlength`、`accept`、`placeholder` 等常用属性
- 能够构建 AI 提示词高级输入表单，含文件上传、参数滑块、流式控制

---

## 📖 什么是 `<input>`？

`<input>` 是 HTML 中最核心的**表单控件**，用于接收用户输入。它是一个**自闭合标签**（void element），没有结束标签，所有信息通过属性传递。

```html
<input type="text" name="prompt" placeholder="输入你的问题…">
```

`type` 属性决定输入框的形态：文本框、密码框、滑块、文件选择器……都是同一个标签，靠 `type` 区分。这让 `<input>` 成为 HTML 中功能最丰富的单个元素。

---

## 🧠 原理讲解

浏览器根据 `type` 属性渲染不同的 UI 控件，并对应不同的输入约束与校验逻辑：

- `type="text"` → 普通文本框，无校验
- `type="email"` → 浏览器内置邮箱格式校验（含 `@`）
- `type="number"` → 只允许数字，可设 `min` / `max` / `step`
- `type="file"` → 触发系统文件选择对话框，`accept` 限制格式
- `type="range"` → 渲染为滑块，适合连续数值调节（如 AI 的 temperature）
- `type="hidden"` → 对用户不可见，但会随表单提交，常用于传递 session_id、token 等元数据

**重要**：`<input>` 必须放在 `<form>` 内才能随表单提交，单独使用时需用 JavaScript 读取值（`.value` 属性）。

---

## 🏗 基本结构

```html
<input
  type="text"
  id="user-prompt"
  name="prompt"
  placeholder="请输入提示词"
  maxlength="2000"
  required
>
```

- `type` — 控件类型（必填，缺省值为 `text`）
- `id` — 与 `<label for="">` 关联
- `name` — 表单提交时的字段名
- `placeholder` — 占位提示文字
- `maxlength` — 最大字符数限制
- `required` — 提交时必填校验

---

## ✅ 完整代码：AI 提示词高级输入表单

以下是一个真实 AI 应用中的高级输入表单，包含文本输入、文件上传、温度滑块、流式输出开关和隐藏字段：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 提示词高级输入面板</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0f1117;
      color: #e1e4e8;
      display: flex;
      justify-content: center;
      padding: 40px 16px;
    }
    .panel {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      padding: 32px;
      width: 100%;
      max-width: 640px;
    }
    h2 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 24px;
      color: #f0f6fc;
    }
    .field {
      margin-bottom: 20px;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #8b949e;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    input[type="text"],
    input[type="file"] {
      width: 100%;
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 8px;
      color: #e1e4e8;
      font-size: 14px;
      padding: 10px 14px;
      transition: border-color 0.2s;
    }
    input[type="text"]:focus {
      outline: none;
      border-color: #58a6ff;
    }
    input[type="file"] {
      padding: 8px 12px;
      cursor: pointer;
    }
    .range-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    input[type="range"] {
      flex: 1;
      accent-color: #58a6ff;
      cursor: pointer;
    }
    .range-value {
      min-width: 36px;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      color: #58a6ff;
      background: #1c2130;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 2px 8px;
    }
    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #58a6ff;
      cursor: pointer;
    }
    .checkbox-label {
      font-size: 14px;
      color: #e1e4e8;
      text-transform: none;
      letter-spacing: 0;
    }
    .hint {
      font-size: 12px;
      color: #6e7681;
      margin-top: 4px;
    }
    button[type="submit"] {
      width: 100%;
      background: #238636;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      padding: 12px;
      cursor: pointer;
      margin-top: 8px;
      transition: background 0.2s;
    }
    button[type="submit"]:hover { background: #2ea043; }
  </style>
</head>
<body>
  <div class="panel">
    <h2>⚙️ AI 提示词高级输入面板</h2>

    <form id="ai-form" action="/api/chat" method="POST" enctype="multipart/form-data">

      <!-- 文本输入框：提示词主体 -->
      <div class="field">
        <label for="prompt">提示词（Prompt）</label>
        <input
          type="text"
          id="prompt"
          name="prompt"
          placeholder="请输入你的提示词，最多 500 字符…"
          maxlength="500"
          required
          autocomplete="off"
        >
        <div class="hint" id="char-count">已输入 0 / 500 字符</div>
      </div>

      <!-- 文件上传：多模态输入，限制格式 -->
      <div class="field">
        <label for="attachment">上传附件（PDF / TXT / MD）</label>
        <input
          type="file"
          id="attachment"
          name="attachment"
          accept=".pdf,.txt,.md"
          multiple
        >
        <div class="hint">支持 PDF、纯文本、Markdown 文件，可多选</div>
      </div>

      <!-- Range 滑块：控制 Temperature 0~2 -->
      <div class="field">
        <label for="temperature">Temperature（创意度）</label>
        <div class="range-row">
          <span style="font-size:12px;color:#6e7681">精确 0</span>
          <input
            type="range"
            id="temperature"
            name="temperature"
            min="0"
            max="2"
            step="0.1"
            value="0.7"
          >
          <span style="font-size:12px;color:#6e7681">随机 2</span>
          <span class="range-value" id="temp-display">0.7</span>
        </div>
        <div class="hint">值越高输出越有创意，值越低越精确稳定</div>
      </div>

      <!-- Checkbox：开启流式输出 -->
      <div class="field">
        <div class="checkbox-row">
          <input
            type="checkbox"
            id="streaming"
            name="streaming"
            value="true"
            checked
          >
          <label for="streaming" class="checkbox-label">开启流式输出（Streaming）</label>
        </div>
        <div class="hint">开启后 AI 逐字输出，关闭后等待完整响应</div>
      </div>

      <!-- Hidden 字段：传递 session_id -->
      <input type="hidden" name="session_id" value="sess_a1b2c3d4e5f6">
      <input type="hidden" name="model" value="gpt-4o">

      <button type="submit">🚀 发送请求</button>
    </form>
  </div>

  <script>
    // 实时显示字符计数
    const promptInput = document.getElementById('prompt');
    const charCount = document.getElementById('char-count');
    promptInput.addEventListener('input', () => {
      const len = promptInput.value.length;
      charCount.textContent = `已输入 ${len} / 500 字符`;
      charCount.style.color = len > 450 ? '#f85149' : '#6e7681';
    });

    // 实时显示 temperature 滑块值
    const tempSlider = document.getElementById('temperature');
    const tempDisplay = document.getElementById('temp-display');
    tempSlider.addEventListener('input', () => {
      tempDisplay.textContent = tempSlider.value;
    });
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

| 代码片段 | 说明 |
|---|---|
| `type="text" maxlength="500"` | 文本框，最多 500 字符，超出无法继续输入 |
| `accept=".pdf,.txt,.md"` | 文件选择框只显示指定格式，`multiple` 允许多选 |
| `type="range" min="0" max="2" step="0.1"` | 滑块范围 0~2，步长 0.1，对应 LLM temperature |
| `type="checkbox" value="true" checked` | 复选框，默认勾选，提交时值为 `"true"` |
| `type="hidden" name="session_id"` | 隐藏字段，用户不可见但随表单提交，常传 token |
| `oninput` / `addEventListener('input', ...)` | 实时监听输入变化，无需等到提交 |

---

## 🌐 浏览器表现

- **`type="text"`** — 单行文本框，`maxlength` 到达上限后键盘输入被阻断
- **`type="file"`** — 点击后弹出系统文件选择器，`accept` 会过滤文件类型（用户仍可手动选 All Files 绕过，需后端二次校验）
- **`type="range"`** — 滑块 UI，移动端为触摸滑块，PC 端可用方向键微调
- **`type="checkbox"`** — 勾选状态下提交 `value`，未勾选时该字段**不会出现**在提交数据中
- **`type="hidden"`** — 在页面上完全不可见，DevTools Elements 面板中可查看

---

## 📦 常见属性 / API：type 属性全集

| type 值 | 用途 | AI 应用场景示例 |
|---|---|---|
| `text` | 单行纯文本输入 | 提示词主体、用户姓名、搜索关键词 |
| `password` | 密码（字符隐藏） | API Key 输入框（`****` 遮盖） |
| `email` | 邮箱（含格式校验） | AI 工具注册邮箱、发送报告邮件 |
| `number` | 纯数字输入 | 设置 max_tokens（整数），设置 top_k |
| `range` | 滑块（连续数值） | temperature（0~2）、top_p（0~1）调节 |
| `checkbox` | 多选复选框 | 开启 streaming、开启 function calling |
| `radio` | 单选按钮组 | 选择回答语言（中文 / 英文 / 日文） |
| `file` | 文件选择 | 上传 PDF 知识库、上传图片做视觉分析 |
| `date` | 日期选择器 | 设定 AI 分析数据的起止日期 |
| `time` | 时间选择器 | 定时任务调度（几点触发 AI 摘要） |
| `color` | 颜色选择器 | AI 生成的图表颜色主题自定义 |
| `search` | 搜索框（含清除按钮） | AI 知识库语义搜索入口 |
| `url` | URL 输入（格式校验） | 输入网页 URL 让 AI 爬取摘要 |
| `tel` | 电话号码输入 | AI 客服系统绑定手机号 |
| `hidden` | 隐藏字段 | 传递 session_id、model、user_id 元数据 |
| `submit` | 提交按钮（input 版） | 触发表单提交，功能等同 `<button type="submit">` |
| `reset` | 重置按钮 | 清空所有表单字段回到默认值 |
| `button` | 普通按钮（无默认行为） | 绑定自定义 JS 逻辑（如预览提示词效果） |

**其他常用属性：**

| 属性 | 说明 |
|---|---|
| `placeholder` | 未输入时的提示文字，输入后消失 |
| `maxlength` | 最大字符数（`text`、`password` 等文本类有效） |
| `minlength` | 最小字符数，提交时校验 |
| `required` | 必填项，提交时为空则阻断 |
| `disabled` | 禁用，不可操作，不参与表单提交 |
| `readonly` | 只读，可复制但不可编辑 |
| `autocomplete` | 浏览器自动填充（`on` / `off`） |
| `autofocus` | 页面加载后自动获得焦点 |
| `min` / `max` | 数值范围（`number`、`range`、`date` 有效） |
| `step` | 步进单位（`range` 中 `step="0.1"` 控制精度） |
| `multiple` | 允许多值（`file` 多文件，`email` 多邮箱） |
| `accept` | 限制文件类型（`file` 专用） |
| `pattern` | 正则表达式校验（如 `[A-Za-z]{3,}`） |
| `name` | 表单字段名，提交时作为键名 |
| `value` | 当前值或默认值 |

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **`type` 决定一切** — 同一个 `<input>` 标签，加不同 `type` 就是完全不同的控件
2. **`name` 是必须的** — 只有带 `name` 属性的控件才会出现在表单提交数据中
3. **`value` 的双重角色** — 既是默认值设置，也是 JS 读取当前值的方式（`input.value`）
4. **`hidden` 安全提示** — `type="hidden"` 用户不可见，但在 DevTools 中完全可以看到并修改，**不能用于存放真正的敏感信息**（如密码、未加密 token）
5. **`accept` 仅为前端过滤** — 文件类型限制必须在服务器端二次验证
6. **`checkbox` 未勾选不提交** — 这是常见坑，后端需要处理"字段缺失 = 未勾选"的逻辑

---

## ⚠️ 易错点

**1. `type="number"` 与 `type="text"` 读取值的差异**

```js
// type="number"
input.value         // 字符串 "42"，注意是字符串不是数字
Number(input.value) // 数字 42
input.valueAsNumber // 数字 42（推荐）
```

**2. `checkbox` 未选中时不提交**

```html
<!-- 解决方案：用 hidden 字段作默认值 -->
<input type="hidden" name="streaming" value="false">
<input type="checkbox" name="streaming" value="true">
```
表单提交时：勾选 → `streaming=true`；未勾选 → `streaming=false`（来自 hidden）

**3. `placeholder` 不是 `value`**

```js
input.value       // "" （空字符串，placeholder 不参与）
input.placeholder // "请输入提示词…"
```

**4. `type="file"` 无法用 JS 直接设置 `.value`**

出于安全限制，以下代码报错：
```js
fileInput.value = "/path/to/file.pdf"; // 错误！SecurityError
```
只能通过用户操作选择文件，或使用 `DataTransfer` API。

---

## 💡 最佳实践

1. **始终关联 `<label>`** — 提高可访问性（屏幕阅读器），点击 label 可聚焦 input

```html
<label for="temp">Temperature</label>
<input type="range" id="temp" name="temperature">
```

2. **用 `autocomplete="off"` 保护 API Key 输入框** — 避免浏览器记住敏感内容

```html
<input type="password" name="api-key" autocomplete="new-password">
```

3. **`type="range"` 配合实时显示当前值** — 否则用户不知道数值是多少

```html
<input type="range" id="temp" oninput="display.textContent=this.value">
<output id="display">0.7</output>
```

4. **文件上传加后端校验** — `accept` 只是前端提示，不能信任

5. **`required` + `novalidate` 的组合** — 禁用浏览器默认校验，自定义校验 UI

---

## 🚀 AI 应用场景

### 场景一：多模态文件输入（type=file）

```html
<label for="files">上传参考材料</label>
<input
  type="file"
  id="files"
  name="files"
  accept=".jpg,.jpeg,.png,.pdf"
  multiple
>
```

```js
const fileInput = document.getElementById('files');
fileInput.addEventListener('change', async () => {
  const files = Array.from(fileInput.files);
  
  files.forEach(file => {
    console.log(`文件名: ${file.name}`);
    console.log(`类型: ${file.type}`);
    console.log(`大小: ${(file.size / 1024).toFixed(1)} KB`);
  });

  // 构建 FormData 发送到后端
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('prompt', '请分析以上材料');

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
    // 注意：不要手动设置 Content-Type，让浏览器自动处理 boundary
  });
  const result = await response.json();
  console.log(result);
});
```

### 场景二：AI 参数面板（type=range 实时联动）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>AI 参数实时面板</title>
  <style>
    body { font-family: system-ui; background: #1a1a2e; color: #eee; padding: 32px; }
    .param { margin: 16px 0; }
    label { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .val { color: #7c83fd; font-weight: bold; }
    input[type=range] { width: 100%; accent-color: #7c83fd; }
    pre {
      background: #16213e;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px;
      margin-top: 24px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <h3>LLM 参数调节面板</h3>

  <div class="param">
    <label>
      Temperature
      <span class="val" id="temp-val">0.7</span>
    </label>
    <input type="range" id="temperature" min="0" max="2" step="0.1" value="0.7"
           oninput="update()">
  </div>

  <div class="param">
    <label>
      Top P
      <span class="val" id="topp-val">0.9</span>
    </label>
    <input type="range" id="top_p" min="0" max="1" step="0.05" value="0.9"
           oninput="update()">
  </div>

  <div class="param">
    <label>
      Max Tokens
      <span class="val" id="tokens-val">2048</span>
    </label>
    <input type="range" id="max_tokens" min="256" max="8192" step="256" value="2048"
           oninput="update()">
  </div>

  <pre id="params-preview"></pre>

  <script>
    function update() {
      const params = {
        model: "gpt-4o",
        temperature: parseFloat(document.getElementById('temperature').value),
        top_p: parseFloat(document.getElementById('top_p').value),
        max_tokens: parseInt(document.getElementById('max_tokens').value)
      };

      document.getElementById('temp-val').textContent = params.temperature;
      document.getElementById('topp-val').textContent = params.top_p;
      document.getElementById('tokens-val').textContent = params.max_tokens;

      document.getElementById('params-preview').textContent =
        JSON.stringify(params, null, 2);
    }

    update(); // 初始化显示
  </script>
</body>
</html>
```

---

## 📝 练习题

**基础题**

1. 写一个输入框，类型为邮箱，必填，最大长度 100 字符，placeholder 为"请输入你的邮箱"。
2. 写一个文件上传输入框，只允许上传 `.png`、`.jpg`、`.gif` 图片，支持多选。
3. `type="checkbox"` 在表单中未勾选时，提交的数据中会有这个字段吗？如何确保后端总能收到这个字段？

**进阶题**

4. 实现一个 `type="range"` 滑块，范围 0~1，步长 0.05，旁边实时显示当前数值，并在数值变化时输出 `console.log("top_p changed:", value)`。

**AI 场景题**

5. 构建一个"AI 图片分析"输入面板，要求：
   - `type="file"` 接受 `.jpg,.jpeg,.png,.webp`，支持多选
   - 选择文件后，用 JS 读取每个文件的名称和大小，显示在页面上
   - 一个 `type="range"` 滑块控制"分析精度"（1~5 档），旁边显示当前值
   - 一个 `type="hidden"` 字段传递 `task_type="image_analysis"`
   - 点击"开始分析"按钮时，`console.log` 输出所有参数（文件列表、精度、task_type）

---

## 📌 本节总结

| 知识点 | 核心结论 |
|---|---|
| `<input>` 是自闭合标签 | 没有 `</input>`，所有信息通过属性配置 |
| `type` 决定控件形态 | 17+ 种类型，覆盖文本、数字、文件、滑块等所有场景 |
| `name` 属性必须有 | 缺少 `name` 的控件不参与表单提交 |
| `value` 的读取 | JS 通过 `input.value` 读取，`type=number` 推荐用 `valueAsNumber` |
| AI 最常用的 type | `text`（提示词）、`file`（多模态）、`range`（temperature/top_p）、`hidden`（session_id）、`checkbox`（开关） |
| 安全注意事项 | `accept` 仅前端过滤；`hidden` 字段用户可见于 DevTools；文件类型必须后端二次校验 |

`<input>` 是构建 AI 应用交互界面的基础砖块。下一节我们学习多行文本框 `<textarea>`，它专为提示词编辑而生。

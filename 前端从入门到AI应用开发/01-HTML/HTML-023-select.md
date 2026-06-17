# 下拉选择框 <select>（HTML-023）

---

## 🎯 本节学习目标

- 掌握 `<select>`、`<option>`、`<optgroup>` 三者的关系与用法
- 理解 `multiple`、`size`、`selected`、`disabled` 等关键属性
- 学会用 `onchange` 事件联动更新关联 UI（如模型参数面板）
- 能够构建 AI 模型选择器：含 optgroup 分组、动态填充 option、参数联动显示

---

## 📖 什么是 `<select>`？

`<select>` 是 HTML 的**下拉选择框**，允许用户从预设选项中选一个（或多个）。它由三个标签协作构成：

- `<select>` — 选择框容器，定义整体行为
- `<option>` — 单个选项，`value` 是提交的值，标签内容是显示文字
- `<optgroup>` — 选项分组，用 `label` 属性显示分组标题（不可选中）

```html
<select name="model">
  <optgroup label="OpenAI">
    <option value="gpt-4o">GPT-4o</option>
    <option value="gpt-4o-mini">GPT-4o Mini</option>
  </optgroup>
  <optgroup label="Anthropic">
    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
  </optgroup>
</select>
```

在 AI 应用中，`<select>` 最典型的用途是**模型选择器**——让用户在多个 LLM 之间切换，并联动显示对应的参数上限、定价、特性等信息。

---

## 🧠 原理讲解

`<select>` 的选中状态由两种方式控制：

1. **HTML 属性**：`<option selected>` 设置默认选中项
2. **JavaScript**：`select.value = "gpt-4o"` 或 `option.selected = true`

`<select>` 提交时，`name` 是键，选中 `<option>` 的 `value` 是值。若 `<option>` 没有 `value` 属性，提交的是其文本内容。

`multiple` 属性将下拉框变为**多选列表**：按住 Ctrl（Mac: Cmd）或 Shift 可选多项，读取时需遍历 `select.selectedOptions`。

`size` 属性控制同时可见的行数：`size="1"` 是标准下拉框；`size>1` 时显示为列表框（不再是下拉）。

---

## 🏗 基本结构

```html
<!-- 单选下拉框 -->
<select id="model-select" name="model" required>
  <option value="">-- 请选择模型 --</option>
  <optgroup label="OpenAI">
    <option value="gpt-4o" selected>GPT-4o</option>
    <option value="gpt-4o-mini">GPT-4o Mini</option>
  </optgroup>
  <optgroup label="Anthropic">
    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
  </optgroup>
</select>

<!-- 多选列表框 -->
<select name="tags" multiple size="5">
  <option value="code">代码生成</option>
  <option value="analysis">数据分析</option>
  <option value="write">内容创作</option>
</select>
```

---

## ✅ 完整代码：AI 模型选择器

包含三家厂商的 optgroup 分组、选中后动态显示模型参数描述、size=1 和 multiple 两种展示：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 模型选择器</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0d1117;
      color: #e1e4e8;
      padding: 40px 16px;
      display: flex;
      justify-content: center;
    }
    .container {
      width: 100%;
      max-width: 640px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    h2 {
      font-size: 18px;
      font-weight: 600;
      color: #f0f6fc;
      margin-bottom: 4px;
    }
    .section-label {
      font-size: 12px;
      color: #6e7681;
      margin-bottom: 12px;
    }
    /* ── 单选下拉框样式 ── */
    .select-wrapper {
      position: relative;
    }
    select {
      width: 100%;
      appearance: none;
      -webkit-appearance: none;
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      color: #e1e4e8;
      font-size: 14px;
      padding: 10px 36px 10px 14px;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    select:focus {
      outline: none;
      border-color: #58a6ff;
    }
    .select-arrow {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #8b949e;
      font-size: 10px;
    }
    /* ── 模型信息卡片 ── */
    .model-info {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 10px;
      padding: 16px;
      margin-top: 12px;
    }
    .model-info h3 {
      font-size: 15px;
      font-weight: 600;
      color: #f0f6fc;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .model-info .badge {
      font-size: 11px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 20px;
      background: #1c2130;
      border: 1px solid #30363d;
      color: #8b949e;
    }
    .param-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .param-item {
      background: #0d1117;
      border: 1px solid #21262d;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .param-item .key {
      font-size: 11px;
      color: #6e7681;
      margin-bottom: 4px;
    }
    .param-item .val {
      font-size: 13px;
      font-weight: 600;
      color: #58a6ff;
    }
    .model-desc {
      font-size: 13px;
      color: #8b949e;
      line-height: 1.6;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #21262d;
    }
    /* ── 多选列表框 ── */
    select[multiple] {
      padding: 6px;
      height: auto;
    }
    select[multiple] option {
      padding: 6px 10px;
      border-radius: 4px;
      margin: 2px 0;
    }
    .selected-tags {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      min-height: 28px;
    }
    .tag {
      background: #1c2130;
      border: 1px solid #30363d;
      border-radius: 20px;
      font-size: 12px;
      padding: 3px 10px;
      color: #8b949e;
    }
    .divider {
      border: none;
      border-top: 1px solid #21262d;
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- ──────── 区块一：单选下拉框（size=1） ──────── -->
    <div>
      <h2>模型选择器</h2>
      <p class="section-label">从三家厂商中选择一个 AI 模型，选中后自动显示参数信息</p>

      <div class="select-wrapper">
        <select id="model-select" name="model">
          <option value="">── 请选择模型 ──</option>

          <optgroup label="🟢 OpenAI">
            <option value="gpt-4o" data-ctx="128000" data-out="4096" data-price="$5/M" data-badge="旗舰">GPT-4o</option>
            <option value="gpt-4o-mini" data-ctx="128000" data-out="16000" data-price="$0.15/M" data-badge="经济">GPT-4o Mini</option>
            <option value="o3-mini" data-ctx="200000" data-out="100000" data-price="$1.1/M" data-badge="推理">o3 Mini</option>
          </optgroup>

          <optgroup label="🟣 Anthropic">
            <option value="claude-3-5-sonnet" data-ctx="200000" data-out="8192" data-price="$3/M" data-badge="旗舰">Claude 3.5 Sonnet</option>
            <option value="claude-3-5-haiku" data-ctx="200000" data-out="8192" data-price="$0.8/M" data-badge="快速">Claude 3.5 Haiku</option>
            <option value="claude-opus-4" data-ctx="200000" data-out="32000" data-price="$15/M" data-badge="顶级">Claude Opus 4</option>
          </optgroup>

          <optgroup label="🔵 Google">
            <option value="gemini-1.5-pro" data-ctx="1048576" data-out="8192" data-price="$3.5/M" data-badge="长上下文">Gemini 1.5 Pro</option>
            <option value="gemini-2.0-flash" data-ctx="1048576" data-out="8192" data-price="$0.1/M" data-badge="经济">Gemini 2.0 Flash</option>
            <option value="gemini-2.5-pro" data-ctx="1048576" data-out="65536" data-price="$7/M" data-badge="旗舰">Gemini 2.5 Pro</option>
          </optgroup>
        </select>
        <span class="select-arrow">▼</span>
      </div>

      <!-- 模型参数信息卡片（onchange 联动） -->
      <div class="model-info" id="model-info" style="display:none">
        <h3 id="model-name">模型名称 <span class="badge" id="model-badge"></span></h3>
        <div class="param-grid">
          <div class="param-item">
            <div class="key">Context 上限</div>
            <div class="val" id="model-ctx">—</div>
          </div>
          <div class="param-item">
            <div class="key">最大输出</div>
            <div class="val" id="model-out">—</div>
          </div>
          <div class="param-item">
            <div class="key">定价（输入）</div>
            <div class="val" id="model-price">—</div>
          </div>
        </div>
        <div class="model-desc" id="model-desc"></div>
      </div>
    </div>

    <hr class="divider">

    <!-- ──────── 区块二：多选列表框（multiple） ──────── -->
    <div>
      <h2>能力标签筛选</h2>
      <p class="section-label">按住 Ctrl（Mac: ⌘）多选，筛选支持特定能力的模型</p>

      <select name="capabilities" id="caps-select" multiple size="6">
        <option value="code">💻 代码生成 / 调试</option>
        <option value="analysis">📊 数据分析 / 解读</option>
        <option value="write">✍️ 内容创作 / 写作</option>
        <option value="vision">👁️ 图像理解（Vision）</option>
        <option value="reasoning">🧠 复杂推理 / 数学</option>
        <option value="function">🔧 Function Calling</option>
        <option value="long">📄 超长上下文（>100K）</option>
        <option value="multilingual">🌐 多语言支持</option>
      </select>

      <div class="selected-tags" id="selected-tags">
        <span style="color:#484f58;font-size:13px">尚未选择任何能力标签</span>
      </div>
    </div>

  </div>

  <script>
    // ── 模型描述数据 ──
    const modelDescs = {
      'gpt-4o':            '多模态旗舰模型，支持文本、图像、音频输入，响应速度快，综合能力均衡。',
      'gpt-4o-mini':       '轻量级模型，成本极低，适合高并发、简单问答、内容分类等场景。',
      'o3-mini':           '专为复杂推理设计，支持数学、代码、科学问题的深度思考（Chain of Thought）。',
      'claude-3-5-sonnet': '代码能力顶级，Artifacts 特性强大，Computer Use 支持，200K context。',
      'claude-3-5-haiku':  '速度最快的 Claude 模型，成本低，适合实时对话、快速分类、工具调用。',
      'claude-opus-4':     'Anthropic 最强模型，深度推理与创作能力突出，适合复杂长任务。',
      'gemini-1.5-pro':    '100 万 token 超长上下文，可一次处理整本书、完整代码库、长视频字幕。',
      'gemini-2.0-flash':  '多模态快速模型，支持图像/音频/视频，成本极低，适合实时应用。',
      'gemini-2.5-pro':    'Google 旗舰推理模型，原生多模态，长上下文与编码能力领先。'
    };

    // ── 单选：onchange 联动显示模型参数 ──
    const modelSelect = document.getElementById('model-select');
    const modelInfo   = document.getElementById('model-info');

    modelSelect.addEventListener('change', () => {
      const selectedOption = modelSelect.options[modelSelect.selectedIndex];
      const value = modelSelect.value;

      if (!value) {
        modelInfo.style.display = 'none';
        return;
      }

      // 读取 data-* 属性
      const ctx   = selectedOption.dataset.ctx;
      const out   = selectedOption.dataset.out;
      const price = selectedOption.dataset.price;
      const badge = selectedOption.dataset.badge;

      document.getElementById('model-name').childNodes[0].textContent = selectedOption.text + ' ';
      document.getElementById('model-badge').textContent = badge;
      document.getElementById('model-ctx').textContent =
        parseInt(ctx).toLocaleString() + ' tokens';
      document.getElementById('model-out').textContent =
        parseInt(out).toLocaleString() + ' tokens';
      document.getElementById('model-price').textContent = price;
      document.getElementById('model-desc').textContent =
        modelDescs[value] || '暂无描述';

      modelInfo.style.display = 'block';
    });

    // ── 多选：onchange 显示已选标签 ──
    const capsSelect   = document.getElementById('caps-select');
    const selectedTags = document.getElementById('selected-tags');

    capsSelect.addEventListener('change', () => {
      const selected = Array.from(capsSelect.selectedOptions);

      if (selected.length === 0) {
        selectedTags.innerHTML =
          '<span style="color:#484f58;font-size:13px">尚未选择任何能力标签</span>';
        return;
      }

      selectedTags.innerHTML = selected.map(opt =>
        `<span class="tag">${opt.text}</span>`
      ).join('');
    });

    // ── 演示：动态填充 option（模拟 API 返回） ──
    // 实际场景中从 /api/models 获取后动态添加
    function addModelFromAPI(modelData) {
      const { group, value, label } = modelData;
      
      // 找到或创建 optgroup
      let optgroup = modelSelect.querySelector(`optgroup[label="${group}"]`);
      if (!optgroup) {
        optgroup = document.createElement('optgroup');
        optgroup.label = group;
        modelSelect.appendChild(optgroup);
      }

      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      optgroup.appendChild(option);
    }

    // 模拟 API 动态添加一个新模型（实际开发中替换为 fetch）
    setTimeout(() => {
      addModelFromAPI({
        group: '🟢 OpenAI',
        value: 'gpt-4-turbo',
        label: 'GPT-4 Turbo（动态加载）'
      });
    }, 1000);
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

| 代码片段 | 说明 |
|---|---|
| `<optgroup label="🟢 OpenAI">` | 分组容器，`label` 显示分组标题（用户无法选中） |
| `<option value="gpt-4o" data-ctx="128000">` | `value` 是提交值，`data-*` 自定义属性存额外参数 |
| `option.selected` | 布尔属性，设为 `true` 则该项默认选中 |
| `select.options[select.selectedIndex]` | 获取当前选中的 option 元素 |
| `selectedOption.dataset.ctx` | 读取 `data-ctx` 属性，`data-` 开头的自定义属性通过 `.dataset` 访问 |
| `Array.from(capsSelect.selectedOptions)` | `multiple` 模式下获取所有选中项（返回 HTMLOptionsCollection，需转数组） |
| `document.createElement('option')` | 动态创建 option，模拟 API 返回后填充 |

---

## 🌐 浏览器表现

- **`size="1"`（默认）** — 经典下拉框，点击展开选项列表
- **`size>1`** — 渲染为列表框，同时显示多行选项
- **`multiple`** — 默认显示所有选项，Ctrl+点击多选；移动端不弹出原生下拉
- **`optgroup`** — 在下拉列表中显示加粗不可点击的分组标题，样式由浏览器原生决定
- **`disabled` 的 option** — 显示为灰色，不可选中，不参与提交

---

## 📦 常见属性 / API

**`<select>` 元素属性：**

| 属性 | 说明 | 示例 |
|---|---|---|
| `name` | 表单字段名 | `name="model"` |
| `multiple` | 允许多选（需 Ctrl/Cmd 辅助） | `<select multiple>` |
| `size` | 可见行数，>1 时变为列表框 | `size="5"` |
| `disabled` | 禁用整个选择框 | `disabled` |
| `required` | 必填（不能选值为 `""` 的默认选项） | `required` |

**`<option>` 元素属性：**

| 属性 | 说明 | 示例 |
|---|---|---|
| `value` | 提交的值（缺省时用文本内容） | `value="gpt-4o"` |
| `selected` | 默认选中 | `selected` |
| `disabled` | 禁用该选项（灰色，不可选） | `disabled` |

**`<optgroup>` 元素属性：**

| 属性 | 说明 | 示例 |
|---|---|---|
| `label` | 分组标题（显示但不可选） | `label="OpenAI"` |
| `disabled` | 禁用整组选项 | `disabled` |

**JavaScript API：**

| API | 说明 |
|---|---|
| `select.value` | 当前选中项的 `value` |
| `select.selectedIndex` | 当前选中项的索引 |
| `select.options` | 所有 option 的集合 |
| `select.selectedOptions` | 所有选中的 option（`multiple` 用） |
| `select.add(option)` | 动态添加 option |
| `select.remove(index)` | 动态删除 option |
| `change` 事件 | 选中项改变时触发 |

---

## ⭐⭐⭐⭐⭐ 必学重点

1. **`optgroup` 不可选** — `<optgroup>` 只是视觉分组，用户无法选中它，不参与表单提交
2. **`value` vs 显示文字** — `value` 是提交给服务器的值，标签内容是用户看到的文字，两者可以不同
3. **`multiple` 时必须用 `selectedOptions`** — 单选用 `select.value`；多选必须遍历 `select.selectedOptions`
4. **空 value 作占位符** — `<option value="">请选择…</option>` 配合 `required` 可实现"必须选一项"校验
5. **动态填充 option** — 实际 AI 应用中模型列表通常从 API 获取，用 `createElement + appendChild` 动态添加

---

## ⚠️ 易错点

**1. `multiple` 选中多项后 `select.value` 只返回第一个**

```js
// ❌ 多选时只得到第一个选中值
console.log(select.value);

// ✅ 正确：遍历 selectedOptions
const values = Array.from(select.selectedOptions).map(o => o.value);
console.log(values); // ["code", "analysis", "vision"]
```

**2. `option` 没有 `value` 属性时，提交内容是文本**

```html
<!-- 提交的是 "GPT-4o"（文本内容） -->
<option>GPT-4o</option>

<!-- 提交的是 "gpt-4o"（value属性） -->
<option value="gpt-4o">GPT-4o</option>
```

始终显式写 `value`，避免因显示文字变化导致后端逻辑出错。

**3. `select.selectedIndex` 默认为 0，不是 -1**

```js
// 即使没有设置 selected，selectedIndex 也是 0（第一个 option）
// 如果第一个是占位符 <option value="">，要做空值检查
if (!select.value) {
  alert('请选择一个模型');
  return;
}
```

**4. CSS 样式 `appearance: none` 后需要自己画箭头**

```css
select { appearance: none; }  /* 去掉原生样式 */
/* 用 background-image 或绝对定位的 ▼ 符号作为替代箭头 */
```

---

## 💡 最佳实践

1. **`optgroup` 是 AI 模型列表的标准组织方式** — 按厂商、按能力分组，减少用户认知负担

2. **配合 `data-*` 属性存储元数据** — 避免在 JS 中维护一个与 HTML 同步的数据对象

```html
<option value="gpt-4o" data-price="5" data-ctx="128000">GPT-4o</option>
```

3. **加载 API 数据时显示 loading 状态**

```js
// 先显示 loading
select.innerHTML = '<option>正在加载模型列表…</option>';
select.disabled = true;

// API 返回后填充
const models = await fetch('/api/models').then(r => r.json());
select.disabled = false;
select.innerHTML = '';
models.forEach(m => {
  const opt = document.createElement('option');
  opt.value = m.id;
  opt.textContent = m.name;
  select.appendChild(opt);
});
```

4. **`required` 配合空值占位符**

```html
<select name="model" required>
  <option value="">── 请选择模型 ──</option>
  <option value="gpt-4o">GPT-4o</option>
</select>
```

---

## 🚀 AI 应用场景

### 场景：模型选择下拉框 + onchange 联动更新参数

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>AI 模型选择器</title>
  <style>
    body { font-family: system-ui; background: #1a1a2e; color: #eee; padding: 32px; }
    select {
      background: #16213e;
      border: 1px solid #444;
      border-radius: 8px;
      color: #eee;
      font-size: 14px;
      padding: 10px 14px;
      width: 100%;
      max-width: 400px;
    }
    .info {
      margin-top: 16px;
      background: #16213e;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 16px;
      max-width: 400px;
      display: none;
    }
    .info h3 { font-size: 15px; margin-bottom: 8px; color: #7c83fd; }
    .info p { font-size: 13px; color: #aaa; line-height: 1.6; }
  </style>
</head>
<body>
  <h3>选择 AI 模型</h3>
  <br>

  <select id="model" onchange="updateInfo()">
    <option value="">── 请选择 ──</option>
    <optgroup label="OpenAI">
      <option value="gpt-4o" data-max="128000" data-price="$5/1M tokens">GPT-4o</option>
      <option value="gpt-4o-mini" data-max="128000" data-price="$0.15/1M tokens">GPT-4o Mini</option>
    </optgroup>
    <optgroup label="Anthropic">
      <option value="claude-3-5-sonnet" data-max="200000" data-price="$3/1M tokens">Claude 3.5 Sonnet</option>
      <option value="claude-3-5-haiku" data-max="200000" data-price="$0.8/1M tokens">Claude 3.5 Haiku</option>
    </optgroup>
    <optgroup label="Google">
      <option value="gemini-1.5-pro" data-max="1048576" data-price="$3.5/1M tokens">Gemini 1.5 Pro</option>
      <option value="gemini-2.0-flash" data-max="1048576" data-price="$0.1/1M tokens">Gemini 2.0 Flash</option>
    </optgroup>
  </select>

  <div class="info" id="info-box">
    <h3 id="info-name"></h3>
    <p>📏 Context 上限：<strong id="info-ctx"></strong></p>
    <p>💰 输入定价：<strong id="info-price"></strong></p>
  </div>

  <script>
    function updateInfo() {
      const sel = document.getElementById('model');
      const opt = sel.options[sel.selectedIndex];
      const box = document.getElementById('info-box');

      if (!sel.value) {
        box.style.display = 'none';
        return;
      }

      document.getElementById('info-name').textContent = opt.text;
      document.getElementById('info-ctx').textContent =
        parseInt(opt.dataset.max).toLocaleString() + ' tokens';
      document.getElementById('info-price').textContent = opt.dataset.price;

      box.style.display = 'block';
    }
  </script>
</body>
</html>
```

---

## 📝 练习题

**基础题**

1. 创建一个下拉框，用 `optgroup` 分两组：第一组"国产模型"含通义千问、文心一言；第二组"海外模型"含 GPT-4o、Claude 3.5 Sonnet。默认选中通义千问。

2. 创建一个多选列表框（`multiple size="4"`），选项为中文、英文、日文、韩文、法文。用 JavaScript 监听 `change` 事件，将选中的语言列表 `console.log` 输出。

3. 解释为什么在 `multiple` 模式下不能用 `select.value` 获取所有选中项，应该用什么代替？

**进阶题**

4. 实现一个模型选择下拉框，每个 `<option>` 用 `data-price` 存储每千 token 价格。当用户切换模型后，读取 `data-price` 并显示"预计费用：输入 10 万 token 约 $X.XX"。

**AI 场景题**

5. 构建一个"AI 任务配置面板"：
   - 第一个 `select`：模型选择（至少含 3 个厂商，用 optgroup 分组），切换时显示该模型的 context 上限
   - 第二个 `select`（`multiple`）：输出语言选择（中文、英文、繁体中文、日文），允许多选
   - 一个"确认配置"按钮，点击后 `console.log` 输出选中的模型 ID 和语言列表数组

---

## 📌 本节总结

| 知识点 | 核心结论 |
|---|---|
| 三元素关系 | `select` 是容器，`optgroup` 是分组，`option` 是选项 |
| `value` vs 文字 | `option value` 是提交值，标签文字是显示文字，必须显式写 `value` |
| 多选读取 | `multiple` 模式用 `Array.from(select.selectedOptions).map(o=>o.value)` |
| `data-*` 存元数据 | 避免 JS 中另维护数据表，直接挂在 option 上 |
| 动态填充 | 用 `createElement('option') + appendChild` 将 API 数据填入 select |
| `onchange` 联动 | AI 场景核心：模型切换 → 参数面板更新 |

`<select>` 是 AI 配置界面的关键组件，通过 `optgroup` 组织模型列表、`data-*` 存储参数、`onchange` 联动更新，可以构建专业的模型选择器。下一节学习 `<button>` 按钮标签，构建 AI 聊天按钮组。

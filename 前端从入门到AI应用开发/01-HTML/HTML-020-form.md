# 表单标签 `<form>`（HTML-020）

---

## 🎯 本节学习目标

1. 掌握 `<form>` 标签的核心属性：`action`、`method`、`enctype`、`novalidate`、`autocomplete`、`target`
2. 理解 `enctype="multipart/form-data"` 在文件上传场景的必要性
3. 学会用 `FormData` API 将表单数据（含文件）发送给 AI API
4. 构建多模态 AI 提示词输入表单：文字 + 图片/文件上传 + 参数调节

---

## 📖 什么是 `<form>` 标签

`<form>` 是 HTML 中收集用户输入并提交数据的容器。它本身不可见，但定义了其中所有输入控件的**提交目标（action）**、**提交方法（method）**和**编码方式（enctype）**。

```html
<form action="/api/submit" method="POST">
  <input type="text" name="prompt" />
  <button type="submit">提交</button>
</form>
```

在 AI 应用中，`<form>` 是用户与 AI 交互的入口：用户在表单中填写提示词、选择模型、上传文件，JS 拦截提交事件，用 `fetch` + `FormData` 将数据发送给 Claude/GPT 等 API。

---

## 🧠 原理讲解

### 原生提交 vs fetch 拦截

```text
原生提交流程：
  用户点击 submit → 浏览器序列化表单数据 → 发 HTTP 请求到 action
  → 整页刷新，显示服务器返回内容（传统 MPA 架构）

fetch 拦截（现代 AI 应用）：
  用户点击 submit → e.preventDefault() 阻止默认行为
  → new FormData(form) 读取所有字段
  → fetch(aiApiURL, { method:'POST', body: formData })
  → 异步更新页面局部（SPA 架构，无刷新）
```

### enctype 三种编码方式

```text
application/x-www-form-urlencoded（默认）
  → 将数据编码为 key=value&key=value，只支持文本
  → 适合：普通文本表单

multipart/form-data
  → 将数据分段（multipart）传输，每段有独立 boundary
  → 适合：含文件上传的表单（必须用这个）
  → 使用 FormData API 时浏览器自动设置正确的 boundary

text/plain
  → 极少使用，数据以纯文本发送，不做 URL 编码
```

---

## 🏗 基本结构

```html
<form
  action="/api/chat"
  method="POST"
  enctype="multipart/form-data"
  novalidate
  autocomplete="off"
>
  <!-- 文本输入 -->
  <label for="prompt">提示词</label>
  <textarea id="prompt" name="prompt" required></textarea>

  <!-- 文件上传 -->
  <input type="file" name="attachment" accept="image/*,.pdf" />

  <!-- 选择框 -->
  <select name="model">
    <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
    <option value="gpt-4o">GPT-4o</option>
  </select>

  <!-- 范围滑块 -->
  <input type="range" name="temperature" min="0" max="1" step="0.1" value="0.7" />

  <!-- 提交按钮 -->
  <button type="submit">发送</button>
</form>
```

---

## ✅ 完整代码

以下是一个完整的 **AI 提示词输入表单**，支持多模态输入（文字 + 图片/PDF 上传）、模型选择、参数滑块，使用 `enctype="multipart/form-data"` 和 `FormData` API：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI 提示词输入</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 2rem 1rem;
    }

    .container { width: 100%; max-width: 680px; }

    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; color: #f1f5f9; }
    .subtitle { color: #64748b; font-size: 0.875rem; margin-bottom: 2rem; }

    /* 表单卡片 */
    .form-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 1rem;
      padding: 1.75rem;
      margin-bottom: 1.5rem;
    }

    /* 表单组 */
    .form-group { margin-bottom: 1.25rem; }
    .form-group:last-child { margin-bottom: 0; }

    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 0.5rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    label .required { color: #f87171; margin-left: 0.2rem; }
    label .hint { color: #475569; font-weight: 400; text-transform: none; margin-left: 0.5rem; }

    /* Textarea */
    textarea {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      color: #e2e8f0;
      font-size: 0.95rem;
      padding: 0.75rem 1rem;
      resize: vertical;
      min-height: 120px;
      font-family: inherit;
      line-height: 1.6;
      transition: border-color 0.2s;
    }
    textarea:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
    textarea.error { border-color: #f87171; }

    /* Select */
    select {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      color: #e2e8f0;
      font-size: 0.9rem;
      padding: 0.65rem 1rem;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      cursor: pointer;
    }
    select:focus { outline: none; border-color: #6366f1; }

    /* 文件上传区 */
    .file-upload-area {
      border: 2px dashed #334155;
      border-radius: 0.5rem;
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      position: relative;
    }
    .file-upload-area:hover, .file-upload-area.drag-over {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.05);
    }
    .file-upload-area input[type="file"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }
    .file-upload-area .upload-icon { font-size: 1.75rem; margin-bottom: 0.5rem; }
    .file-upload-area .upload-text { color: #94a3b8; font-size: 0.875rem; }
    .file-upload-area .upload-hint { color: #475569; font-size: 0.78rem; margin-top: 0.25rem; }

    /* 文件预览 */
    .file-preview {
      display: none;
      align-items: center;
      gap: 0.75rem;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      margin-top: 0.5rem;
    }
    .file-preview.visible { display: flex; }
    .file-preview img {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 0.25rem;
      flex-shrink: 0;
    }
    .file-preview .file-icon {
      width: 48px;
      height: 48px;
      background: #1e293b;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    .file-preview .file-info { flex: 1; min-width: 0; }
    .file-preview .file-name {
      font-size: 0.875rem;
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .file-preview .file-size { font-size: 0.78rem; color: #64748b; }
    .file-preview .remove-file {
      color: #64748b;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0.25rem;
      flex-shrink: 0;
    }
    .file-preview .remove-file:hover { color: #f87171; }

    /* Range 滑块组 */
    .range-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .range-item label { margin-bottom: 0.35rem; }
    .range-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    input[type="range"] {
      flex: 1;
      appearance: none;
      height: 4px;
      background: #334155;
      border-radius: 2px;
      cursor: pointer;
    }
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: #6366f1;
      border-radius: 50%;
      cursor: pointer;
    }
    .range-value {
      min-width: 2.5rem;
      text-align: right;
      font-size: 0.85rem;
      color: #6366f1;
      font-weight: 600;
      font-family: monospace;
    }

    /* 模型说明 */
    .model-hint {
      font-size: 0.78rem;
      color: #475569;
      margin-top: 0.4rem;
    }

    /* 错误提示 */
    .field-error {
      font-size: 0.78rem;
      color: #f87171;
      margin-top: 0.35rem;
      display: none;
    }
    .field-error.visible { display: block; }

    /* 提交按钮 */
    .submit-btn {
      width: 100%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      padding: 0.875rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .submit-btn:hover { opacity: 0.9; }
    .submit-btn:active { transform: scale(0.99); }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .submit-btn .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: none;
    }
    .submit-btn.loading .spinner { display: block; }
    .submit-btn.loading .btn-text { display: none; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* 响应区域 */
    .response-area {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 1rem;
      padding: 1.5rem;
      display: none;
    }
    .response-area.visible { display: block; }
    .response-area h3 { font-size: 0.85rem; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .response-content { color: #cbd5e1; font-size: 0.9rem; line-height: 1.8; white-space: pre-wrap; }

    /* 调试信息 */
    .debug-area {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-top: 1rem;
      font-family: monospace;
      font-size: 0.78rem;
      color: #64748b;
      display: none;
    }
    .debug-area.visible { display: block; }
  </style>
</head>
<body>

<div class="container">
  <h1>🤖 AI 多模态提示词</h1>
  <p class="subtitle">支持文字 + 图片/PDF 上传，发送给 Claude API</p>

  <!--
    action="..."          → 数据提交地址（JS fetch 会覆盖）
    method="POST"         → HTTP 方法
    enctype="multipart/form-data" → 必须：支持文件上传
    novalidate            → 禁用浏览器默认验证，改用 JS 自定义验证
    autocomplete="off"    → 关闭浏览器自动填充（AI 输入场景通常不需要）
  -->
  <form
    id="ai-form"
    action="/api/claude"
    method="POST"
    enctype="multipart/form-data"
    novalidate
    autocomplete="off"
  >

    <div class="form-card">

      <!-- 1. 提示词输入 textarea -->
      <div class="form-group">
        <label for="prompt">
          提示词
          <span class="required">*</span>
          <span class="hint">（描述你想让 AI 完成的任务）</span>
        </label>
        <textarea
          id="prompt"
          name="prompt"
          placeholder="例如：请分析这张图片中的内容，并提取关键信息..."
          rows="5"
          maxlength="4000"
        ></textarea>
        <div class="field-error" id="prompt-error">提示词不能为空</div>
      </div>

      <!-- 2. 模型选择 select -->
      <div class="form-group">
        <label for="model">AI 模型</label>
        <select id="model" name="model">
          <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet（推荐）</option>
          <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku（快速/低成本）</option>
          <option value="claude-opus-4-5">Claude Opus 4.5（最强能力）</option>
        </select>
        <div class="model-hint" id="model-hint">200K 上下文 · 擅长代码与长文档分析</div>
      </div>

      <!-- 3. 文件上传 input[type=file] -->
      <div class="form-group">
        <label for="attachment">
          上传文件
          <span class="hint">（图片或 PDF，最大 10MB）</span>
        </label>
        <div class="file-upload-area" id="upload-area">
          <input
            type="file"
            id="attachment"
            name="attachment"
            accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
          />
          <div class="upload-icon">📎</div>
          <div class="upload-text">点击选择或拖放文件到此处</div>
          <div class="upload-hint">支持：JPG / PNG / GIF / WebP / PDF</div>
        </div>
        <!-- 文件预览 -->
        <div class="file-preview" id="file-preview">
          <div class="file-icon" id="preview-icon">📄</div>
          <img id="preview-img" src="" alt="" style="display:none" />
          <div class="file-info">
            <div class="file-name" id="preview-name">文件名</div>
            <div class="file-size" id="preview-size">大小</div>
          </div>
          <span class="remove-file" id="remove-file" title="移除文件">✕</span>
        </div>
        <div class="field-error" id="file-error">文件大小超过 10MB，请重新选择</div>
      </div>

      <!-- 4. 参数滑块 input[type=range] -->
      <div class="form-group">
        <label>生成参数</label>
        <div class="range-group">

          <div class="range-item">
            <label for="temperature">
              Temperature
              <span class="hint">（随机性）</span>
            </label>
            <div class="range-wrapper">
              <input
                type="range"
                id="temperature"
                name="temperature"
                min="0"
                max="1"
                step="0.1"
                value="0.7"
              />
              <span class="range-value" id="temperature-value">0.7</span>
            </div>
          </div>

          <div class="range-item">
            <label for="max-tokens">
              Max Tokens
              <span class="hint">（输出长度）</span>
            </label>
            <div class="range-wrapper">
              <input
                type="range"
                id="max-tokens"
                name="max_tokens"
                min="256"
                max="8192"
                step="256"
                value="2048"
              />
              <span class="range-value" id="max-tokens-value">2048</span>
            </div>
          </div>

        </div>
      </div>

    </div><!-- /.form-card -->

    <!-- 5. 提交按钮 -->
    <button type="submit" class="submit-btn" id="submit-btn">
      <span class="spinner"></span>
      <span class="btn-text">🚀 发送给 Claude</span>
    </button>

  </form>

  <!-- 响应展示区 -->
  <div class="response-area" id="response-area">
    <h3>Claude 回复</h3>
    <div class="response-content" id="response-content"></div>
  </div>

  <!-- 调试：FormData 内容展示 -->
  <div class="debug-area" id="debug-area"></div>

</div>

<script>
// ==================== 范围滑块实时更新显示值 ====================
document.getElementById('temperature').addEventListener('input', function() {
  document.getElementById('temperature-value').textContent = this.value;
});
document.getElementById('max-tokens').addEventListener('input', function() {
  document.getElementById('max-tokens-value').textContent = this.value;
});

// ==================== 模型切换时更新提示文字 ====================
const modelHints = {
  'claude-3-5-sonnet-20241022': '200K 上下文 · 擅长代码与长文档分析',
  'claude-3-5-haiku-20241022':  '200K 上下文 · 速度最快，成本最低',
  'claude-opus-4-5':            '200K 上下文 · 最强推理能力，适合复杂任务'
};
document.getElementById('model').addEventListener('change', function() {
  document.getElementById('model-hint').textContent = modelHints[this.value] || '';
});

// ==================== 文件上传预览 ====================
const fileInput   = document.getElementById('attachment');
const uploadArea  = document.getElementById('upload-area');
const filePreview = document.getElementById('file-preview');
const previewIcon = document.getElementById('preview-icon');
const previewImg  = document.getElementById('preview-img');
const previewName = document.getElementById('preview-name');
const previewSize = document.getElementById('preview-size');
const fileError   = document.getElementById('file-error');
const removeBtn   = document.getElementById('remove-file');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

fileInput.addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;

  // 文件大小校验（10MB 限制）
  if (file.size > MAX_FILE_SIZE) {
    fileError.classList.add('visible');
    this.value = '';
    return;
  }
  fileError.classList.remove('visible');

  previewName.textContent = file.name;
  previewSize.textContent = formatSize(file.size);
  filePreview.classList.add('visible');

  // 图片类型：显示缩略图；其他：显示文件图标
  if (file.type.startsWith('image/')) {
    const objectURL = URL.createObjectURL(file);
    previewImg.src = objectURL;
    previewImg.alt = `上传的图片：${file.name}`;
    previewImg.style.display = 'block';
    previewIcon.style.display = 'none';
    previewImg.onload = () => URL.revokeObjectURL(objectURL); // 加载后释放
  } else {
    previewImg.style.display = 'none';
    previewIcon.style.display = 'flex';
    previewIcon.textContent = file.type === 'application/pdf' ? '📕' : '📄';
  }
});

// 拖放支持
uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change'));
  }
});

// 移除文件
removeBtn.addEventListener('click', () => {
  fileInput.value = '';
  filePreview.classList.remove('visible');
  previewImg.src = '';
  fileError.classList.remove('visible');
});

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ==================== 自定义表单验证 ====================
function validateForm(form) {
  let valid = true;
  const promptEl = form.querySelector('#prompt');
  const promptError = form.querySelector('#prompt-error');

  if (!promptEl.value.trim()) {
    promptEl.classList.add('error');
    promptError.classList.add('visible');
    promptEl.focus();
    valid = false;
  } else {
    promptEl.classList.remove('error');
    promptError.classList.remove('visible');
  }

  return valid;
}

// ==================== 表单提交：FormData + fetch ====================
document.getElementById('ai-form').addEventListener('submit', async function(e) {
  // 1. 阻止默认提交（防止页面刷新）
  e.preventDefault();

  // 2. 自定义验证
  if (!validateForm(this)) return;

  const submitBtn = document.getElementById('submit-btn');
  const responseArea = document.getElementById('response-area');
  const responseContent = document.getElementById('response-content');
  const debugArea = document.getElementById('debug-area');

  // 3. 设置加载状态
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  // 4. 用 FormData 读取表单所有字段（包括文件）
  const formData = new FormData(this);

  // 也可以手动追加额外字段
  formData.append('timestamp', new Date().toISOString());

  // 调试：显示 FormData 中的所有键值
  let debugLines = ['=== FormData 内容 ==='];
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      debugLines.push(`${key}: [File] ${value.name} (${formatSize(value.size)}, ${value.type})`);
    } else {
      debugLines.push(`${key}: ${value}`);
    }
  }
  debugArea.textContent = debugLines.join('\n');
  debugArea.classList.add('visible');

  try {
    // 5. 发送请求给 AI API
    // 真实 Claude API 调用示例（需替换 API_KEY）：
    //
    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'x-api-key': 'YOUR_API_KEY',
    //     'anthropic-version': '2023-06-01',
    //     'content-type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     model: formData.get('model'),
    //     max_tokens: parseInt(formData.get('max_tokens')),
    //     messages: [
    //       {
    //         role: 'user',
    //         content: formData.get('prompt')
    //       }
    //     ]
    //   })
    // });
    // const data = await response.json();
    // const aiReply = data.content[0].text;

    // 模拟 AI 响应（演示用）
    const aiReply = await simulateAIResponse(formData);

    // 6. 显示 AI 回复
    responseContent.textContent = aiReply;
    responseArea.classList.add('visible');
    responseArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (error) {
    responseContent.textContent = `请求失败：${error.message}\n\n请检查网络连接或 API 配置。`;
    responseArea.classList.add('visible');
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
});

// 模拟 AI 响应（演示，替换为真实 API 调用）
async function simulateAIResponse(formData) {
  await new Promise(r => setTimeout(r, 1200));
  const prompt = formData.get('prompt');
  const model  = formData.get('model');
  const temp   = formData.get('temperature');
  const tokens = formData.get('max_tokens');
  const file   = formData.get('attachment');

  let fileInfo = '（无文件上传）';
  if (file && file.size > 0) {
    fileInfo = `（已收到文件：${file.name}，${formatSize(file.size)}）`;
  }

  return `[模拟回复 · ${model}]

收到提示词：${prompt}

参数配置：
- Temperature: ${temp}（${temp <= 0.3 ? '精确模式' : temp >= 0.8 ? '创意模式' : '平衡模式'}）
- Max Tokens: ${tokens}

附件信息：${fileInfo}

---
这是一个演示回复。在实际应用中，你需要将 FormData 中的内容转换为 Claude API 所需的 JSON 格式，并使用真实的 API Key 调用。

如果上传了图片，需要将图片转为 base64 并作为 image 类型的 content block 传入。`;
}
</script>

</body>
</html>
```

---

## 🔍 逐行解析

```text
action="/api/claude"            → 表单原生提交目标（被 JS fetch 覆盖）
method="POST"                   → HTTP 方法，POST 数据放在请求体
enctype="multipart/form-data"   → 文件上传必须设置此编码类型
novalidate                      → 禁用浏览器内置验证气泡，改用 JS 精细控制
autocomplete="off"              → 关闭浏览器自动填充

e.preventDefault()              → 阻止表单原生提交（页面刷新）
new FormData(form)              → 自动读取表单内所有具名控件的值，含文件
formData.get('prompt')          → 读取单个字段
formData.entries()              → 遍历所有键值对
```

---

## 🌐 浏览器表现

| 设置 | 行为 |
|------|------|
| 无 `novalidate` | 浏览器显示内置验证气泡（样式无法自定义） |
| `novalidate` | 浏览器跳过验证，由 JS 完全接管 |
| `enctype` 默认 | 只能发送文本，文件上传无效 |
| `enctype="multipart/form-data"` | 支持文件；JS 用 FormData 时浏览器自动设置此类型 |
| `autocomplete="off"` | 浏览器不显示历史输入建议 |
| `method="GET"` | 数据附加到 URL 查询参数，适合搜索；不适合发送文件 |

---

## 📦 常见属性

| 属性 | 作用 | 示例 |
|------|------|------|
| `action` | 表单数据提交的目标 URL；JS fetch 时可忽略 | `action="/api/chat"` |
| `method` | HTTP 方法：`GET`（数据在 URL）或 `POST`（数据在 Body） | `method="POST"` |
| `enctype` | 请求体编码类型；上传文件必须用 `multipart/form-data` | `enctype="multipart/form-data"` |
| `novalidate` | 布尔属性，禁用浏览器内置验证；JS 自定义验证时使用 | `novalidate` |
| `autocomplete` | `on`（默认，显示历史建议）或 `off`（关闭自动填充） | `autocomplete="off"` |
| `target` | 提交结果在哪里显示：`_blank`（新标签页）、`_self`（默认） | `target="_blank"` |
| `name` | 表单名称，用于 `document.forms['name']` 访问 | `name="ai-form"` |
| `id` | 表单 ID，`<label for>` 和 JS 引用 | `id="chat-form"` |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. `FormData` 是 AI 表单的核心 API**

```js
const form = document.getElementById('ai-form');
const formData = new FormData(form);

// 读取文本字段
const prompt = formData.get('prompt');

// 读取文件（返回 File 对象）
const file = formData.get('attachment');
if (file && file.size > 0) {
  console.log(file.name, file.type, file.size);
}

// 手动追加字段
formData.append('extra', 'value');

// 遍历所有字段
for (const [key, value] of formData.entries()) {
  console.log(key, value);
}
```

**2. 文件上传必须用 `enctype="multipart/form-data"`**

```html
<!-- ❌ 默认编码只能传文本 -->
<form method="POST">
  <input type="file" name="file" />
</form>

<!-- ✅ 文件上传必须设置 enctype -->
<form method="POST" enctype="multipart/form-data">
  <input type="file" name="file" />
</form>
```

但如果用 JS `fetch + FormData`，浏览器会**自动设置正确的 Content-Type 和 boundary**：

```js
// ✅ 使用 FormData 时，不需要手动设置 Content-Type
fetch('/api/upload', {
  method: 'POST',
  body: formData    // 浏览器自动加 multipart/form-data; boundary=...
});
// ❌ 不要手动设置 Content-Type，否则 boundary 会丢失
```

**3. `novalidate` + JS 自定义验证**

```js
form.addEventListener('submit', e => {
  e.preventDefault();

  const prompt = form.querySelector('[name="prompt"]');
  if (!prompt.value.trim()) {
    // 自定义错误提示（而非浏览器气泡）
    showError(prompt, '提示词不能为空');
    return;
  }

  // 验证通过，发送请求
  sendToAI(new FormData(form));
});
```

---

## ⚠️ 易错点

**错误 1：`fetch + FormData` 时手动设置 Content-Type**

```js
// ❌ 手动设置 Content-Type 会导致 boundary 丢失，服务器无法解析文件
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'multipart/form-data' },  // ❌ 删掉！
  body: formData
});

// ✅ 不设置 Content-Type，让浏览器自动处理
fetch(url, {
  method: 'POST',
  body: formData  // ✅ 浏览器自动加正确的 Content-Type + boundary
});
```

**错误 2：`<input type="file">` 的值无法通过 JS 直接设置**

```js
// ❌ 出于安全原因，无法用 JS 给 file input 设置文件路径
fileInput.value = '/path/to/file.jpg'; // 无效

// ✅ 只能通过 DataTransfer 对象间接设置
const dt = new DataTransfer();
dt.items.add(myFile);
fileInput.files = dt.files;
```

**错误 3：`method="GET"` 无法上传文件**

```html
<!-- ❌ GET 方法把数据放 URL，无法传文件 -->
<form method="GET" enctype="multipart/form-data">
  <input type="file" name="file" />
</form>
```

---

## 💡 最佳实践

1. **AI 应用统一用 `novalidate` + JS 验证**，可显示自定义样式的错误提示
2. **使用 `FormData(formElement)` 而非手动 `append` 所有字段**，减少遗漏
3. **文件上传前先客户端校验**（大小、类型），节省带宽，提升体验
4. **提交时禁用按钮并显示加载状态**，防止重复提交
5. **发送 Claude API 时，文件要转为 base64**，Claude 不接受 multipart，需要将图片内容嵌入 JSON 的 `content` 数组中

---

## 🚀 AI 应用场景

### 场景一：多模态 AI 输入（文字 + 图片/PDF 上传）

```html
<form id="multimodal-form" novalidate>
  <textarea name="text" placeholder="描述你的问题..."></textarea>
  <input type="file" name="image" accept="image/*" />
  <button type="submit">发送给 Claude</button>
</form>

<script>
document.getElementById('multimodal-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const text  = formData.get('text');
  const image = formData.get('image');

  // 构建 Claude API 的 content 数组
  const content = [];

  // 如果有图片，先将其转为 base64
  if (image && image.size > 0) {
    const base64 = await fileToBase64(image);
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: image.type,  // "image/jpeg" / "image/png" 等
        data: base64             // base64 字符串（不含 data: 前缀）
      }
    });
  }

  // 添加文字提示词
  if (text.trim()) {
    content.push({ type: 'text', text: text.trim() });
  }

  // 发送给 Claude API
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': 'YOUR_API_KEY',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [{ role: 'user', content }]
    })
  });

  const data = await response.json();
  console.log(data.content[0].text);
});

// 将 File 对象转为 base64 字符串
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // result 格式：data:image/jpeg;base64,/9j/4AAQ...
      // Claude API 只要逗号后面的部分
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
</script>
```

### 场景二：`novalidate` + JS 自定义验证 + fetch 发送

```html
<form id="prompt-form" novalidate>
  <textarea name="prompt" id="prompt" required></textarea>
  <div class="error-msg" id="prompt-error" style="display:none; color:red;">
    提示词不能为空
  </div>
  <select name="model">
    <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
  </select>
  <button type="submit" id="send-btn">发送</button>
</form>

<script>
document.getElementById('prompt-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form      = e.target;
  const prompt    = form.querySelector('#prompt');
  const errorMsg  = document.getElementById('prompt-error');
  const sendBtn   = document.getElementById('send-btn');

  // ① 自定义验证：提示词不为空
  if (!prompt.value.trim()) {
    errorMsg.style.display = 'block';
    prompt.focus();
    return;
  }
  errorMsg.style.display = 'none';

  // ② 防重复提交
  sendBtn.disabled = true;
  sendBtn.textContent = '发送中...';

  try {
    // ③ FormData → JSON（Claude API 用 JSON，不用 multipart）
    const formData = new FormData(form);
    const payload = {
      model: formData.get('model'),
      max_tokens: 2048,
      messages: [
        { role: 'user', content: formData.get('prompt') }
      ]
    };

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': 'YOUR_API_KEY',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    console.log('AI 回复：', data.content[0].text);

  } catch (err) {
    console.error('调用失败：', err.message);
  } finally {
    // ④ 恢复按钮状态
    sendBtn.disabled = false;
    sendBtn.textContent = '发送';
  }
});
</script>
```

---

## 📝 练习题

**题目 1（基础）**：创建一个包含 5 个字段的 HTML 表单：文本输入（用户名）、密码输入、下拉选择（模型选择）、复选框（同意协议）、提交按钮。使用 `novalidate` 并设置每个字段的 `name` 属性。

**题目 2（进阶）**：为题目 1 的表单添加 JS 验证：用户名不能为空且长度 ≥ 2，密码长度 ≥ 8，复选框必须勾选。验证失败时在字段下方显示红色错误提示，通过后在控制台打印 `FormData` 的所有键值对。

**题目 3（AI 场景）**：构建一个 AI 图片分析表单，包含以下功能：
- 图片文件上传（`input[type=file]`，限 `.jpg/.png`，最大 5MB）
- 分析类型单选框（描述图片内容 / 提取文字 / 识别物体）
- 语言选择下拉框（中文 / 英文）
- 提交后用 JS 读取文件，转为 base64，构建 Claude 多模态 API 所需的 JSON 结构（`type: "image"` 的 content block），并打印到控制台（不需要真实发送）

---

## 📌 本节总结

| 知识点 | 核心要点 |
|--------|---------|
| `action` | 数据提交地址，JS fetch 时可设为 `#` 或忽略 |
| `method` | 文件上传必须用 `POST`；`GET` 只适合搜索查询 |
| `enctype` | 含文件必须 `multipart/form-data`；纯文本用默认 `application/x-www-form-urlencoded` |
| `novalidate` | 禁用浏览器验证气泡，由 JS 完全接管验证逻辑 |
| `autocomplete` | AI 输入场景通常设为 `off` |
| `FormData` | `new FormData(form)` 自动读取所有具名控件，含文件 |
| fetch + FormData | 不设 Content-Type，浏览器自动处理 boundary |
| 图片 → base64 | `FileReader.readAsDataURL()` → 取逗号后半段 |
| Claude 多模态 | 图片作为 `type: "image"` 的 content block 传入 |

`<form>` 是 AI 应用与用户交互的核心入口，掌握 `FormData` + `fetch` + `novalidate` 自定义验证的组合，是构建现代 AI 界面的必备技能。

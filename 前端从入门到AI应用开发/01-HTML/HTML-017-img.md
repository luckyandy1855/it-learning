# 图片标签 `<img>`（HTML-017）

---

## 🎯 本节学习目标

1. 掌握 `<img>` 标签的核心属性：`src`、`alt`、`width`、`height`、`loading`、`decoding`、`srcset`、`sizes`、`referrerpolicy`
2. 理解响应式图片（`srcset` + `sizes`）的工作原理
3. 学会用 `onerror` 优雅处理图片加载失败
4. 能在 AI 图片生成展示页等真实场景中正确使用 `<img>`

---

## 📖 什么是 `<img>` 标签

`<img>`（image）是 HTML 中嵌入图片的标签。它是**自闭合标签**（void element），没有内容，没有闭合标签，只通过属性描述自身。

```html
<img src="https://example.com/photo.jpg" alt="AI 生成的风景图" />
```

`<img>` 是行内替换元素（inline replaced element），其尺寸由图片文件本身决定，也可通过 CSS 或 `width`/`height` 属性覆盖。

---

## 🧠 原理讲解

浏览器解析 `<img>` 时的完整流程：

```text
1. 解析 src → 发起 HTTP 请求下载图片资源
2. 解析 srcset + sizes → 根据设备像素比和视口宽度选择最合适的图片版本
3. 若有 loading="lazy" → 进入视口前不发起请求，节省带宽
4. 图片下载完成 → 解码（decoding 属性控制时机）→ 渲染到页面
5. 下载失败 → 触发 onerror 事件，显示 alt 文字
```

响应式图片选择逻辑：

```text
srcset="img-400.jpg 400w, img-800.jpg 800w, img-1200.jpg 1200w"
sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 400px"

浏览器计算：
  当前视口 = 375px → sizes 匹配第一条 → 需要 375px 宽度的图片
  设备像素比 = 2 → 实际需要 750px
  从 srcset 中选择 ≥ 750px 的最小图：img-800.jpg ✅
```

---

## 🏗 基本结构

```html
<!-- 最简写法 -->
<img src="photo.jpg" alt="照片描述" />

<!-- 完整写法（响应式 + 懒加载） -->
<img
  src="fallback.jpg"
  srcset="img-400.jpg 400w, img-800.jpg 800w"
  sizes="(max-width: 600px) 100vw, 800px"
  alt="AI 生成的山水画"
  width="800"
  height="450"
  loading="lazy"
  decoding="async"
/>
```

**注意**：`width` 和 `height` 属性设置的是图片的固有尺寸（单位：px，不写单位），浏览器用它在加载完成前**预留空间**，防止页面布局抖动（CLS）。

---

## ✅ 完整代码

以下是一个 **AI 图片生成结果展示页**，包含懒加载、响应式图片、alt 描述和 onerror 备用图：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI 图片生成展示</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: #0f0f0f;
      color: #e5e7eb;
      min-height: 100vh;
    }
    header {
      padding: 1.5rem 2rem;
      background: #1a1a2e;
      border-bottom: 1px solid #2d2d4e;
    }
    header h1 { font-size: 1.4rem; color: #a78bfa; }
    header p { font-size: 0.9rem; color: #9ca3af; margin-top: 0.25rem; }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
      padding: 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .card {
      background: #1c1c2e;
      border: 1px solid #2d2d4e;
      border-radius: 1rem;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(167, 139, 250, 0.15);
    }

    .img-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      background: #2d2d4e;
      overflow: hidden;
    }

    /* 加载中占位动画 */
    .img-wrapper::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, #2d2d4e 25%, #3d3d5e 50%, #2d2d4e 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: relative; /* 覆盖 ::before 伪元素 */
      z-index: 1;
      display: block;
    }

    .card-body { padding: 1rem; }
    .card-body .prompt {
      font-size: 0.85rem;
      color: #c4b5fd;
      margin-bottom: 0.5rem;
      font-style: italic;
    }
    .card-body .meta {
      font-size: 0.78rem;
      color: #6b7280;
      display: flex;
      justify-content: space-between;
    }
    .badge {
      display: inline-block;
      background: #4c1d95;
      color: #ddd6fe;
      font-size: 0.7rem;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
    }

    /* 加载失败时的备用样式 */
    img.error-state {
      display: none;
    }
    .img-wrapper .error-placeholder {
      display: none;
      position: absolute;
      inset: 0;
      z-index: 2;
      background: #1c1c2e;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #6b7280;
      font-size: 0.85rem;
      text-align: center;
      padding: 1rem;
    }
    .img-wrapper.has-error .error-placeholder { display: flex; }
    .img-wrapper.has-error::before { display: none; }

    .generate-area {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }
    .generate-area input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #1c1c2e;
      border: 1px solid #4c1d95;
      border-radius: 0.5rem;
      color: #e5e7eb;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }
    .generate-area button {
      background: #7c3aed;
      color: #fff;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      cursor: pointer;
      width: 100%;
    }
    .generate-area button:hover { background: #6d28d9; }
  </style>
</head>
<body>

<header>
  <h1>🎨 AI 图片生成展示</h1>
  <p>由 DALL-E / Stable Diffusion 生成，点击卡片查看详情</p>
</header>

<!-- 图片展示画廊 -->
<div class="gallery" id="gallery">

  <!-- 卡片 1：正常加载示例 -->
  <div class="card">
    <div class="img-wrapper" id="wrapper-1">
      <!--
        src: 最低分辨率备用图（Fallback）
        srcset: 提供 400w、800w 两个版本，浏览器自动选择
        sizes: 小屏用 100vw，中大屏用 280px（与 grid 列宽一致）
        loading="lazy": 进入视口前不加载，节省带宽
        decoding="async": 图片解码在后台线程，不阻塞主线程渲染
        alt: 描述 AI 生成图片的内容，screen reader 可读
      -->
      <img
        src="https://picsum.photos/seed/ai-sunset/400/300"
        srcset="
          https://picsum.photos/seed/ai-sunset/400/300   400w,
          https://picsum.photos/seed/ai-sunset/800/600   800w
        "
        sizes="(max-width: 600px) 100vw, 280px"
        alt="AI 生成的日落山景：金色阳光穿透云层，照耀着连绵山脉"
        width="400"
        height="300"
        loading="lazy"
        decoding="async"
        onerror="handleImgError(this)"
      />
      <div class="error-placeholder">🖼️<br />图片加载失败<br />请检查网络连接</div>
    </div>
    <div class="card-body">
      <div class="prompt">"日落时分的山脉，金色光芒，超写实风格"</div>
      <div class="meta">
        <span class="badge">DALL-E 3</span>
        <span>1024×1024</span>
      </div>
    </div>
  </div>

  <!-- 卡片 2 -->
  <div class="card">
    <div class="img-wrapper" id="wrapper-2">
      <img
        src="https://picsum.photos/seed/ai-forest/400/300"
        srcset="
          https://picsum.photos/seed/ai-forest/400/300   400w,
          https://picsum.photos/seed/ai-forest/800/600   800w
        "
        sizes="(max-width: 600px) 100vw, 280px"
        alt="AI 生成的神秘森林：晨雾弥漫，阳光从古树间透射而下"
        width="400"
        height="300"
        loading="lazy"
        decoding="async"
        onerror="handleImgError(this)"
      />
      <div class="error-placeholder">🖼️<br />图片加载失败<br />请检查网络连接</div>
    </div>
    <div class="card-body">
      <div class="prompt">"晨雾中的神秘森林，光线透射，吉卜力风格"</div>
      <div class="meta">
        <span class="badge">Stable Diffusion</span>
        <span>768×768</span>
      </div>
    </div>
  </div>

  <!-- 卡片 3：故意用错误 src 演示 onerror 备用图 -->
  <div class="card">
    <div class="img-wrapper" id="wrapper-3">
      <img
        src="https://intentionally-broken-url.invalid/image.jpg"
        alt="AI 生成的城市夜景（此图演示加载失败备用处理）"
        width="400"
        height="300"
        loading="lazy"
        decoding="async"
        onerror="handleImgError(this)"
      />
      <div class="error-placeholder">🖼️<br />图片加载失败<br />（演示 onerror 备用处理）</div>
    </div>
    <div class="card-body">
      <div class="prompt">"霓虹灯下的赛博朋克城市，雨夜，反射地面"</div>
      <div class="meta">
        <span class="badge">Midjourney</span>
        <span>1024×1024</span>
      </div>
    </div>
  </div>

</div>

<!-- 动态生成图片卡片的输入区 -->
<div class="generate-area">
  <input type="text" id="prompt-input" placeholder="输入 AI 图片提示词，如：宁静的湖畔清晨" />
  <button onclick="addImageCard()">🎨 模拟生成图片</button>
</div>

<script>
  // onerror 处理函数：隐藏图片，显示备用占位
  function handleImgError(imgEl) {
    const wrapper = imgEl.closest('.img-wrapper');
    wrapper.classList.add('has-error');
    imgEl.classList.add('error-state');
  }

  // 模拟：fetch AI 图片 URL 后动态设置 src
  async function fetchAIImageURL(prompt) {
    // 真实场景：调用 DALL-E API 或 Stable Diffusion API
    // const response = await fetch('https://api.openai.com/v1/images/generations', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt, n: 1, size: '512x512' })
    // });
    // const data = await response.json();
    // return data.data[0].url;

    // 使用 Lorem Picsum 模拟随机图片 URL
    const seed = encodeURIComponent(prompt.slice(0, 20));
    await new Promise(r => setTimeout(r, 800)); // 模拟网络延迟
    return `https://picsum.photos/seed/${seed}/400/300`;
  }

  // 动态添加图片卡片
  async function addImageCard() {
    const prompt = document.getElementById('prompt-input').value.trim();
    if (!prompt) return;

    const gallery = document.getElementById('gallery');

    // 创建 <div class="card"> 结构
    const card = document.createElement('div');
    card.className = 'card';

    const wrapperID = `wrapper-dyn-${Date.now()}`;
    card.innerHTML = `
      <div class="img-wrapper" id="${wrapperID}">
        <div class="error-placeholder">🖼️<br />图片加载失败</div>
      </div>
      <div class="card-body">
        <div class="prompt">"${prompt}"</div>
        <div class="meta"><span class="badge">AI 生成</span><span>加载中...</span></div>
      </div>
    `;
    gallery.prepend(card);

    // 异步获取图片 URL，再设置 <img> 的 src
    const imageURL = await fetchAIImageURL(prompt);

    const img = document.createElement('img');
    img.alt = `AI 根据提示词生成的图片：${prompt}`;  // alt 描述 AI 生成内容
    img.width = 400;
    img.height = 300;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:relative;z-index:1;display:block;';
    img.onerror = () => handleImgError(img);

    // 关键：最后设置 src，触发图片请求
    img.src = imageURL;

    const wrapper = document.getElementById(wrapperID);
    wrapper.prepend(img);

    // 更新元数据
    card.querySelector('.meta span:last-child').textContent = '512×512';
  }
</script>

</body>
</html>
```

---

## 🔍 逐行解析

```text
src="..."                     → 主图片地址，浏览器默认加载这个
srcset="url 400w, url 800w"   → 提供多分辨率版本，浏览器按需选择
sizes="(max-width:600px) ..."  → 告知浏览器图片在不同断点下的显示宽度
alt="详细描述"                → 图片无法显示时的替代文字，screen reader 朗读
width="400" height="300"      → 告知浏览器图片固有尺寸，防止布局抖动（CLS）
loading="lazy"                → 懒加载：进入视口才发起请求
decoding="async"              → 异步解码，不阻塞主线程
onerror="handleImgError(this)" → 加载失败时的回调函数
```

---

## 🌐 浏览器表现

| 情况 | 表现 |
|------|------|
| 图片正常加载 | 显示图片，`alt` 文字在 DOM 中存在但不可见 |
| 图片加载失败 | 显示 `alt` 文字（或触发 `onerror` 回调） |
| `loading="lazy"` | 图片不在视口时不发起请求，滚动进入视口才加载 |
| 未设置 `width`/`height` | 图片加载后页面发生抖动（CLS 问题） |
| 设备像素比 = 2（Retina） | 浏览器从 `srcset` 中选择更高分辨率版本 |

---

## 📦 常见属性

| 属性 | 作用 | 示例 |
|------|------|------|
| `src` | 图片资源地址，支持相对路径、绝对路径、Data URL、Blob URL | `src="image.jpg"` |
| `alt` | 替代文字：图片无法显示时展示，screen reader 朗读；装饰性图片用 `alt=""` | `alt="AI 生成的日落图"` |
| `width` | 图片显示宽度（像素，不写单位）；让浏览器预留空间，防止 CLS | `width="800"` |
| `height` | 图片显示高度（像素，不写单位）；与 width 配合计算宽高比 | `height="450"` |
| `loading` | `lazy`：懒加载（视口外不请求）；`eager`：立即加载（默认） | `loading="lazy"` |
| `decoding` | `async`：异步解码，不阻塞渲染；`sync`：同步解码；`auto`：浏览器决定 | `decoding="async"` |
| `srcset` | 多分辨率图片列表，格式：`url 宽度w` 或 `url 像素比x` | `srcset="img-2x.jpg 2x"` |
| `sizes` | 配合 `srcset` 使用，描述图片在不同视口下的显示尺寸 | `sizes="(max-width:600px) 100vw, 50vw"` |
| `referrerpolicy` | 控制请求图片时 Referer 头的发送策略 | `referrerpolicy="no-referrer"` |
| `crossorigin` | 图片跨域设置，值为 `anonymous` 或 `use-credentials`，配合 Canvas 使用时必须 | `crossorigin="anonymous"` |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. `alt` 属性不能省略**

```html
<!-- ❌ 没有 alt，screen reader 无从朗读，无障碍不达标 -->
<img src="photo.jpg" />

<!-- ✅ 有意义的图片，写描述性 alt -->
<img src="ai-result.jpg" alt="AI 生成的蓝色星云图，细节丰富" />

<!-- ✅ 纯装饰性图片，alt 写空字符串，screen reader 跳过 -->
<img src="divider.png" alt="" />
```

**2. `width` + `height` 防止布局抖动（CLS）**

```html
<!-- ✅ 浏览器解析 HTML 时就知道图片占 400×300，提前预留空间 -->
<img src="photo.jpg" alt="..." width="400" height="300" />
```

如果不写这两个属性，图片下载完成后浏览器才知道尺寸，页面会"跳"一下（CLS），这是 Core Web Vitals 的扣分项。

**3. `loading="lazy"` 是性能基础**

首屏以外的图片都应加 `loading="lazy"`，首屏图片（LCP）不加，让浏览器尽快加载。

---

## ⚠️ 易错点

**错误 1：`srcset` 格式写错**

```html
<!-- ❌ 错误：宽度描述符缺少 "w" -->
<img srcset="img-400.jpg 400, img-800.jpg 800" />

<!-- ✅ 正确：必须写 400w、800w -->
<img srcset="img-400.jpg 400w, img-800.jpg 800w" />
```

**错误 2：Canvas 读取跨域图片不加 `crossorigin`**

```html
<!-- 如果要用 canvas.drawImage() 处理来自其他域的图片 -->
<!-- ❌ 不加会报 "Tainted canvas" 安全错误 -->
<img src="https://cdn.other.com/photo.jpg" id="ai-img" />

<!-- ✅ 必须同时加 crossorigin，服务器也要响应 CORS 头 -->
<img src="https://cdn.other.com/photo.jpg" crossorigin="anonymous" id="ai-img" />
```

**错误 3：`onerror` 中无限循环**

```html
<!-- ❌ 备用图也失败会无限触发 onerror -->
<img src="fail.jpg" onerror="this.src='backup.jpg'" />

<!-- ✅ 加一个标志位防止循环 -->
<img src="fail.jpg" onerror="this.onerror=null; this.src='backup.jpg'" />
```

---

## 💡 最佳实践

1. **首屏 LCP 图片预加载**：在 `<head>` 加 `<link rel="preload" as="image" href="hero.jpg" />`
2. **统一用 `aspect-ratio` CSS 属性配合图片宽高**，替代写死 `height` 时的布局错乱
3. **AI 生成图片的 `alt` 建议包含提示词摘要**，方便无障碍用户理解图片内容
4. **大量图片页面务必 `loading="lazy"`**，可节省 50%+ 初始带宽
5. **动态设置 `img.src` 时，先设置其他属性再设 `src`**，让浏览器发起一次完整请求

---

## 🚀 AI 应用场景

### 场景一：展示 DALL-E / Stable Diffusion API 返回的图片 URL

```html
<div id="ai-image-container"></div>

<script>
// 模拟 DALL-E 3 API 响应
const dalleResponse = {
  created: 1718000000,
  data: [
    {
      url: "https://picsum.photos/seed/dalle/512/512",
      revised_prompt: "A serene mountain lake at sunrise with mist rising from the water surface, photorealistic style"
    }
  ]
};

function renderAIImage(response) {
  const container = document.getElementById('ai-image-container');
  const imageData = response.data[0];

  // 动态创建 <img>，所有属性都设置好再设 src
  const img = document.createElement('img');
  img.alt = imageData.revised_prompt;  // 使用 AI 修正后的提示词作为 alt
  img.width = 512;
  img.height = 512;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.style.cssText = 'max-width:100%; border-radius:0.5rem; display:block;';

  // onerror 备用处理：this.onerror=null 防止循环
  img.onerror = function() {
    this.onerror = null;
    this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect fill="%231c1c2e" width="512" height="512"/><text fill="%236b7280" font-size="20" x="50%" y="50%" text-anchor="middle">图片加载失败</text></svg>';
    this.alt = '图片加载失败，请重试';
  };

  // 最后设置 src，触发图片请求
  img.src = imageData.url;
  container.appendChild(img);
}

renderAIImage(dalleResponse);
</script>
```

### 场景二：AI 自动生成 alt 文字（无障碍描述）

```html
<div id="uploaded-preview"></div>
<input type="file" id="file-input" accept="image/*" />

<script>
// 场景：用户上传图片 → 调用视觉 AI API 生成描述 → 作为 alt 文字
document.getElementById('file-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 用 FileReader 或 URL.createObjectURL 生成本地预览 URL
  const localURL = URL.createObjectURL(file);

  // 1. 先展示图片（用文件名作为临时 alt）
  const img = document.createElement('img');
  img.src = localURL;
  img.alt = `上传的图片：${file.name}（描述生成中...）`;
  img.style.cssText = 'max-width:400px; display:block; border-radius:0.5rem;';
  document.getElementById('uploaded-preview').appendChild(img);

  // 2. 异步调用 AI Vision API 生成 alt 描述
  // 真实场景：将 file 转为 base64 发给 Claude 或 GPT-4V
  const aiAlt = await generateAltWithAI(file);

  // 3. 用 AI 生成的描述更新 alt（重要！）
  img.alt = aiAlt;

  // 4. 释放 Blob URL
  URL.revokeObjectURL(localURL);
});

// 模拟 AI Vision API 生成 alt
async function generateAltWithAI(imageFile) {
  await new Promise(r => setTimeout(r, 1000)); // 模拟 API 延迟
  return `AI 分析结果：上传的图片 ${imageFile.name}，检测到风景类内容，色调温暖，构图居中。`;
}
</script>
```

---

## 📝 练习题

**题目 1（基础）**：创建一个 3 列图片网格，每张图片使用 `loading="lazy"`、`width`/`height` 属性，以及有意义的 `alt` 文字。

**题目 2（进阶）**：实现一个响应式图片组件，同一张图片提供 400w、800w、1200w 三个版本，在小屏（≤600px）全宽显示，中屏（≤900px）半宽显示，大屏固定 400px 宽。

**题目 3（AI 场景）**：编写一个函数 `renderAIGallery(images)`，接收以下格式的数组：

```js
[
  { url: "https://...", prompt: "AI 提示词", model: "DALL-E 3", width: 1024, height: 1024 }
]
```

将每张图片渲染为带卡片的展示组件，要求：
- `alt` 使用 `prompt` 字段的内容
- 图片加载失败时显示"生成失败，请重试"占位
- 使用 `loading="lazy"` 和 `decoding="async"`
- 支持用户点击图片后在模态框中查看大图

---

## 📌 本节总结

| 知识点 | 核心要点 |
|--------|---------|
| `src` | 图片地址，支持 URL / 相对路径 / Blob URL / Data URL |
| `alt` | 必须填写；无障碍核心；装饰图用 `alt=""` |
| `width` / `height` | 预留空间，防止 CLS；不影响 CSS 样式 |
| `loading="lazy"` | 首屏外图片必加，节省带宽 |
| `decoding="async"` | 异步解码，不阻塞主线程 |
| `srcset` + `sizes` | 响应式图片，浏览器自动选最优版本 |
| `onerror` | 加载失败备用处理，防无限循环加 `this.onerror=null` |
| AI 场景 | DALL-E 返回 URL → 动态设置 src；alt 用 AI 生成描述 |

`<img>` 看似简单，但 `alt` 无障碍、`loading` 性能优化、`srcset` 响应式和 `onerror` 容错是现代前端的必备技能，在 AI 图片生成类产品中尤为重要。

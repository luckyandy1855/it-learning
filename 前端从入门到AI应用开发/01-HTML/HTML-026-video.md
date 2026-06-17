# 视频标签 \<video\>（HTML-026）

## 🎯 本节学习目标

- 掌握 `<video>` 标签的完整属性与用法
- 理解多格式 `<source>` 兼容方案与 `<track>` 字幕嵌入
- 学会用 JavaScript API 控制视频播放状态
- 能够将 AI 生成视频（Sora / Runway 返回的 URL）嵌入到真实页面并处理错误

---

## 📖 什么是 \<video\>

`<video>` 是 HTML5 引入的原生视频播放标签，让浏览器无需任何插件（如 Flash）即可播放视频文件。它支持：

- 内联视频播放（网页内直接展示）
- 多格式兜底（MP4 / WebM / OGG）
- 字幕轨道（`<track>` + WebVTT）
- JavaScript 完整控制（play/pause/seek/speed）

在 AI 时代，`<video>` 已成为展示 Sora、Runway、Pika、PixVerse 等文生视频模型输出结果的核心容器。

---

## 🧠 原理讲解

浏览器加载 `<video>` 时经历以下流程：

```text
HTML 解析 → 创建 HTMLVideoElement → 读取 src 或 <source> → 
协商格式（MIME type）→ 发起 HTTP 请求获取视频字节 → 
解码 → 渲染第一帧（poster 兜底）→ 等待用户交互 / autoplay
```

**格式兼容性**（2024 年主流浏览器）：

| 格式 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| MP4 (H.264) | ✅ | ✅ | ✅ | ✅ |
| WebM (VP9) | ✅ | ✅ | ✅(14+) | ✅ |
| OGG (Theora) | ✅ | ✅ | ❌ | ✅ |

**最佳策略**：优先 WebM（体积更小），MP4 兜底，满足所有主流浏览器。

---

## 🏗 基本结构

```html
<video controls width="800" poster="cover.jpg">
  <source src="video.webm" type="video/webm">
  <source src="video.mp4"  type="video/mp4">
  <track src="subtitle.vtt" kind="subtitles" srclang="zh" label="中文" default>
  <p>您的浏览器不支持 video 标签，请 <a href="video.mp4">下载视频</a>。</p>
</video>
```

结构要点：
- 多个 `<source>` 按优先级排列，浏览器依次尝试，遇到能播放的立刻停止
- `<track>` 加载 WebVTT 格式字幕
- 最后的 `<p>` 是降级内容（旧浏览器看到）

---

## ✅ 完整代码

**场景：AI 生成视频展示页（Sora / Runway 输出结果）**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 生成视频展示 — 阿基米德实验室</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0f0f13; color: #e8e8e8; }
    .page { max-width: 960px; margin: 0 auto; padding: 32px 16px; }
    h1 { font-size: 1.8rem; margin-bottom: 8px; }
    .meta { color: #888; font-size: 0.9rem; margin-bottom: 32px; }

    /* 视频卡片 */
    .video-card { background: #1a1a24; border-radius: 12px; overflow: hidden; margin-bottom: 40px; }
    .video-wrapper { position: relative; background: #000; }
    video { width: 100%; display: block; max-height: 540px; object-fit: contain; }

    /* 加载/错误状态 */
    .video-overlay {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: rgba(0,0,0,.6); gap: 12px;
    }
    .video-overlay.hidden { display: none; }
    .spinner {
      width: 40px; height: 40px; border: 3px solid #444;
      border-top-color: #7c6df0; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-icon { font-size: 2.5rem; }
    .error-msg { color: #ff6b6b; text-align: center; max-width: 280px; line-height: 1.5; }
    .retry-btn {
      padding: 8px 20px; background: #7c6df0; color: #fff;
      border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
    }

    /* 视频信息 */
    .video-info { padding: 20px 24px 24px; }
    .video-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 6px; }
    .video-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .tag {
      padding: 3px 10px; border-radius: 20px; font-size: 0.78rem;
      background: #2a2a3a; color: #aaa;
    }
    .tag.ai { background: #2d1f6e; color: #a99ef5; }

    /* JS 控制面板 */
    .controls { background: #12121a; padding: 16px 24px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; border-top: 1px solid #222; }
    .controls button {
      padding: 7px 16px; border-radius: 6px; border: 1px solid #333;
      background: #1e1e2e; color: #ddd; cursor: pointer; font-size: 0.85rem;
    }
    .controls button:hover { background: #2a2a3a; }
    .speed-group { display: flex; gap: 4px; }
    .speed-btn { padding: 5px 10px; font-size: 0.8rem; }
    .speed-btn.active { background: #7c6df0; color: #fff; border-color: #7c6df0; }
    .time-info { font-size: 0.82rem; color: #777; margin-left: auto; }
  </style>
</head>
<body>
<div class="page">
  <h1>🎬 AI 生成视频展示</h1>
  <p class="meta">由 Sora / Runway Gen-3 生成 · 2024-12-01 · 实验编号 #AI-VID-031</p>

  <!-- ===== 视频卡片 1 ===== -->
  <div class="video-card">
    <div class="video-wrapper">

      <!-- 加载遮罩 -->
      <div class="video-overlay" id="overlay1">
        <div class="spinner"></div>
        <span style="color:#aaa;font-size:.85rem">视频加载中…</span>
      </div>

      <!-- 核心 video 标签 -->
      <video
        id="aiVideo1"
        controls
        muted
        preload="metadata"
        poster="https://picsum.photos/seed/ai-video/960/540"
        playsinline
        aria-label="AI 生成视频：黑色素材上的水波纹特效"
      >
        <!-- 多格式 source：浏览器从上到下尝试，遇到支持的格式立刻加载 -->
        <source
          src="https://sample-videos.com/video321/webm/720/big_buck_bunny_720p_1mb.webm"
          type="video/webm"
        >
        <source
          src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"
          type="video/mp4"
        >
        <!-- WebVTT 字幕：AI 语音识别（Whisper）生成的字幕文件 -->
        <track
          src="subtitle-zh.vtt"
          kind="subtitles"
          srclang="zh"
          label="中文（AI转写）"
          default
        >
        <track
          src="subtitle-en.vtt"
          kind="subtitles"
          srclang="en"
          label="English"
        >
        <!-- 降级内容：极少数不支持 video 的旧浏览器 -->
        <p>您的浏览器不支持 HTML5 video。请
          <a href="video.mp4" style="color:#7c6df0">下载视频文件</a> 后在本地播放。
        </p>
      </video>
    </div>

    <!-- 视频信息 -->
    <div class="video-info">
      <div class="video-title">「黑色素材 · 水波纹特效」— Sora 文生视频</div>
      <div style="color:#888;font-size:.85rem;margin-top:4px">
        Prompt: <em>calm water ripples on dark surface, cinematic, 4K, slow motion, no text</em>
      </div>
      <div class="video-tags">
        <span class="tag ai">Sora</span>
        <span class="tag ai">文生视频</span>
        <span class="tag">720p</span>
        <span class="tag">时长：30s</span>
        <span class="tag">AI字幕</span>
      </div>
    </div>

    <!-- JS 控制面板 -->
    <div class="controls">
      <button onclick="togglePlay('aiVideo1')">▶ 播放 / 暂停</button>
      <button onclick="seekTo('aiVideo1', 0)">⏮ 重置</button>
      <button onclick="seekRelative('aiVideo1', -5)">−5s</button>
      <button onclick="seekRelative('aiVideo1', 5)">+5s</button>
      <div class="speed-group">
        <span style="font-size:.8rem;color:#777;align-self:center">速率：</span>
        <button class="speed-btn" onclick="setSpeed('aiVideo1', 0.5, this)">0.5×</button>
        <button class="speed-btn active" onclick="setSpeed('aiVideo1', 1, this)">1×</button>
        <button class="speed-btn" onclick="setSpeed('aiVideo1', 1.5, this)">1.5×</button>
        <button class="speed-btn" onclick="setSpeed('aiVideo1', 2, this)">2×</button>
      </div>
      <span class="time-info" id="timeInfo1">0:00 / 0:00</span>
    </div>
  </div>
</div>

<script>
// ── 工具函数 ──────────────────────────────────────────────
function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── 播放控制 ──────────────────────────────────────────────
function togglePlay(id) {
  const v = document.getElementById(id);
  v.paused ? v.play() : v.pause();
}

function seekTo(id, time) {
  document.getElementById(id).currentTime = time;
}

function seekRelative(id, delta) {
  const v = document.getElementById(id);
  v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
}

function setSpeed(id, rate, btn) {
  document.getElementById(id).playbackRate = rate;
  // 高亮当前速率按钮
  btn.closest('.speed-group').querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── 事件监听（加载 / 错误 / 时间更新）─────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const video   = document.getElementById('aiVideo1');
  const overlay = document.getElementById('overlay1');
  const timeEl  = document.getElementById('timeInfo1');

  // 元数据加载完成 → 隐藏 spinner
  video.addEventListener('loadedmetadata', () => {
    overlay.classList.add('hidden');
    timeEl.textContent = `0:00 / ${fmt(video.duration)}`;
  });

  // 播放进度更新
  video.addEventListener('timeupdate', () => {
    timeEl.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
  });

  // ── 错误处理 ──────────────────────────────────────────
  video.addEventListener('error', (e) => {
    const codes = {
      1: 'MEDIA_ERR_ABORTED（用户中止）',
      2: 'MEDIA_ERR_NETWORK（网络错误）',
      3: 'MEDIA_ERR_DECODE（解码失败）',
      4: 'MEDIA_ERR_SRC_NOT_SUPPORTED（格式不支持）',
    };
    const msg = codes[video.error?.code] || '未知错误';
    overlay.innerHTML = `
      <span class="error-icon">⚠️</span>
      <p class="error-msg">视频加载失败<br><small>${msg}</small></p>
      <button class="retry-btn" onclick="retryLoad('aiVideo1', 'overlay1')">重试</button>
    `;
  });
});

// ── 重试加载（AI 生成视频 URL 可能有 CDN 延迟）─────────────
function retryLoad(videoId, overlayId) {
  const v = document.getElementById(videoId);
  const o = document.getElementById(overlayId);
  o.innerHTML = '<div class="spinner"></div><span style="color:#aaa;font-size:.85rem">重新加载中…</span>';
  o.classList.remove('hidden');
  // 重置 src 触发重新请求
  const currentSrc = v.currentSrc || v.querySelector('source')?.src;
  v.load();
}
</script>
</body>
</html>
```

---

## 🔍 逐行解析

**`preload="metadata"`**
只预加载时长、尺寸等元数据，不下载视频内容，节省带宽。AI 生成视频文件往往较大，此属性至关重要。

**`poster="..."`**
视频未播放时显示的封面图。AI 视频平台通常在返回视频 URL 的同时返回缩略图 URL，直接填入即可。

**`playsinline`**
移动端（iOS Safari）默认会全屏播放，加上此属性后视频内嵌在页面中播放，不弹出全屏。

**多 `<source>` 兜底**
浏览器按顺序测试 MIME type，第一个支持的格式被采用。Sora 目前输出 MP4，Runway 支持 WebM 和 MP4。

**`<track kind="subtitles">`**
WebVTT 字幕文件，`srclang` 指定语言，`default` 让字幕默认显示。

**`video.error.code`**
HTMLVideoElement 的错误码（1–4），生产环境可上报到监控系统辅助排查 AI CDN 问题。

---

## 🌐 浏览器表现

| 状态 | 视觉效果 |
|------|---------|
| 未播放 | 显示 `poster` 封面图，中心有播放按钮（浏览器默认 UI） |
| 加载中 | `poster` 持续显示 / 自定义 spinner 叠层 |
| 播放中 | 进度条、音量、全屏按钮显示（`controls` 属性） |
| 暂停 | 停在当前帧，显示播放按钮 |
| 错误 | 浏览器默认错误图标（或自定义错误 UI） |
| 字幕 | 视频底部出现白色字幕文字 |

---

## 📦 常见属性/API

| 属性 / API | 类型 | 说明 |
|-----------|------|------|
| `src` | 属性（string） | 视频文件 URL（可被 `<source>` 替代） |
| `controls` | 布尔属性 | 显示浏览器原生控件（播放/暂停/音量/进度/全屏） |
| `autoplay` | 布尔属性 | 自动播放（现代浏览器要求同时设置 `muted`） |
| `muted` | 布尔属性 | 静音（`autoplay` 必须搭配，否则被浏览器拦截） |
| `loop` | 布尔属性 | 播放结束后循环重播 |
| `poster` | 属性（string） | 播放前显示的封面图 URL |
| `preload` | 属性（`none`/`metadata`/`auto`） | 控制预加载行为：`metadata` 只加载元信息 |
| `width` / `height` | 属性（number） | 视频显示尺寸（px），不影响实际分辨率 |
| `playsinline` | 布尔属性 | 移动端内嵌播放（iOS 必须加） |
| `crossorigin` | 属性（`anonymous`/`use-credentials`） | 跨域请求配置，加载 CDN 视频时常需要 |
| `video.play()` | JS API（Promise） | 异步开始播放，返回 Promise（可 catch 自动播放被拦截错误） |
| `video.pause()` | JS API | 暂停播放 |
| `video.currentTime` | JS API（number） | 读写当前播放时间（秒），可用于跳转 |
| `video.playbackRate` | JS API（number） | 播放速率（0.25–4），`1` 为正常速度 |
| `video.duration` | JS API（number，只读） | 视频总时长（秒） |
| `video.error` | JS API（MediaError） | 播放出错时的错误对象，`.code` 为 1–4 |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. `autoplay` 必须搭配 `muted`**

```html
<!-- ❌ 现代浏览器会静默拦截 -->
<video autoplay src="video.mp4"></video>

<!-- ✅ 静音自动播放，用于首页背景视频 -->
<video autoplay muted loop playsinline src="video.mp4"></video>
```

**2. 用 `<source>` 而非 `src` 实现多格式兜底**

```html
<video controls>
  <source src="video.webm" type="video/webm">
  <source src="video.mp4"  type="video/mp4">
</video>
```

**3. `play()` 返回 Promise，必须处理拒绝**

```js
video.play().catch(err => {
  if (err.name === 'NotAllowedError') {
    // 用户未交互，自动播放被拦截
    showPlayButton();
  }
});
```

---

## ⚠️ 易错点

| 错误 | 说明 | 正确做法 |
|------|------|---------|
| `autoplay` 无 `muted` | 浏览器策略禁止，视频不播放也不报错 | 加 `muted` |
| 只用 `src` 不用 `<source>` | Safari 不支持 WebM，视频黑屏 | 多格式 `<source>` |
| 忘记 `playsinline` | iOS 强制全屏，体验差 | 移动端必加 |
| CORS 问题 | 跨域视频无法读取帧数据（Canvas/WebGL） | 服务端加 CORS Header + `crossorigin="anonymous"` |
| 视频地址拼错 | 静默失败（`error.code=4`），无任何提示 | 监听 `error` 事件并显示友好提示 |

---

## 💡 最佳实践

1. **AI 生成视频**：服务端返回签名 URL 后，用 JS 动态设置 `video.src = url`，而非写死在 HTML 里
2. **首页背景视频**：`autoplay muted loop playsinline`，不加 `controls`
3. **移动端优化**：`preload="none"` 节省流量，用户点击后再加载
4. **字幕**：对 AI 生成的语音内容，务必提供 `<track>` 字幕，兼顾无障碍与 SEO
5. **封面图**：始终设置 `poster`，避免用户看到黑屏等待

---

## 🚀 AI 应用场景

### 场景 1：Sora / Runway API 返回视频 URL，动态嵌入播放

AI 视频生成任务通常是异步的：提交 Prompt → 等待若干秒 → API 返回视频 URL。前端需要轮询或 WebSocket 监听结果，然后动态设置视频源。

```html
<div id="videoContainer" style="display:none">
  <video id="generatedVideo" controls preload="metadata" playsinline style="width:100%">
    <p>浏览器不支持 video 标签</p>
  </video>
</div>
<div id="status">⏳ 正在生成视频，请稍候…</div>
```

```js
// 模拟 Sora/Runway API 轮询
async function pollVideoStatus(taskId) {
  const statusEl = document.getElementById('status');

  // 实际项目中替换为真实 API endpoint
  const POLL_INTERVAL = 3000;
  const MAX_ATTEMPTS  = 40;   // 最多等 2 分钟

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const res  = await fetch(`/api/video-task/${taskId}`);
    const data = await res.json();

    if (data.status === 'completed') {
      statusEl.textContent = '✅ 视频生成完成！';
      loadVideoFromUrl(data.videoUrl, data.posterUrl);
      return;
    }

    if (data.status === 'failed') {
      statusEl.textContent = `❌ 生成失败：${data.error}`;
      return;
    }

    statusEl.textContent = `⏳ 生成中…（进度：${data.progress ?? i * 3}%）`;
    await new Promise(r => setTimeout(r, POLL_INTERVAL));
  }

  statusEl.textContent = '⚠️ 超时，请刷新后重试';
}

function loadVideoFromUrl(videoUrl, posterUrl) {
  const container = document.getElementById('videoContainer');
  const video     = document.getElementById('generatedVideo');

  // 动态设置多格式 source
  video.innerHTML = `
    <source src="${videoUrl.replace('.mp4', '.webm')}" type="video/webm">
    <source src="${videoUrl}" type="video/mp4">
    <track src="${videoUrl.replace('.mp4', '-zh.vtt')}" kind="subtitles" srclang="zh" label="中文" default>
  `;
  if (posterUrl) video.poster = posterUrl;

  video.load();         // 重新加载新 source
  container.style.display = 'block';
  video.play().catch(() => {}); // 自动播放（可能被拦截，忽略错误）
}

// 页面加载后启动轮询
pollVideoStatus('task-abc-123');
```

---

### 场景 2：`<track>` 展示 AI 语音识别（Whisper）输出的字幕

Whisper API 支持直接输出 `.vtt` 格式字幕。将字幕文件挂到 `<track>` 上，实现准确、可搜索的 AI 字幕。

**WebVTT 字幕示例（`subtitle-zh.vtt`）**：

```text
WEBVTT

00:00:01.000 --> 00:00:04.500
今天我们来演示如何使用 Sora 生成高质量视频。

00:00:05.000 --> 00:00:08.200
只需要一句描述，就能生成 30 秒的电影级画面。
```

```js
// 用 OpenAI Whisper API 生成字幕并挂到 video
async function attachWhisperSubtitle(videoEl, audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.mp3');
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'vtt');  // 直接返回 WebVTT 格式
  formData.append('language', 'zh');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
    body: formData,
  });

  const vttText = await res.text();

  // 将 VTT 文本转为 Blob URL，动态挂到 <track>
  const blob   = new Blob([vttText], { type: 'text/vtt' });
  const blobUrl = URL.createObjectURL(blob);

  // 移除旧字幕轨道
  Array.from(videoEl.textTracks).forEach((_, i) => {
    const tracks = videoEl.querySelectorAll('track');
    if (tracks[i]) tracks[i].remove();
  });

  const track   = document.createElement('track');
  track.src     = blobUrl;
  track.kind    = 'subtitles';
  track.srclang = 'zh';
  track.label   = '中文（Whisper AI）';
  track.default = true;
  videoEl.appendChild(track);
}
```

---

### 场景 3：JS 完整控制播放——构建自定义播放器 UI

```js
// 自定义播放器核心控制类
class AIVideoPlayer {
  constructor(videoId) {
    this.video = document.getElementById(videoId);
    this._bindEvents();
  }

  // 播放 / 暂停切换
  togglePlay() {
    this.video.paused ? this.video.play() : this.video.pause();
  }

  // 跳转到指定时间（秒）
  seekTo(seconds) {
    this.video.currentTime = Math.max(0, Math.min(this.video.duration, seconds));
  }

  // 设置播放速率（0.5 / 1 / 1.5 / 2）
  setRate(rate) {
    this.video.playbackRate = rate;
  }

  // 截取当前帧为图片（需 crossorigin 支持）
  captureFrame() {
    const canvas = document.createElement('canvas');
    canvas.width  = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    canvas.getContext('2d').drawImage(this.video, 0, 0);
    return canvas.toDataURL('image/png');
  }

  _bindEvents() {
    this.video.addEventListener('timeupdate', () => {
      const pct = this.video.currentTime / this.video.duration * 100;
      document.getElementById('progress').style.width = pct + '%';
    });
  }
}

const player = new AIVideoPlayer('generatedVideo');
```

---

## 📝 练习题

**题 1（基础）**：创建一个 `<video>` 标签，要求：静音自动循环播放，提供 WebM 和 MP4 两种格式，并设置封面图。

**题 2（进阶）**：编写 JS 函数 `createVideoElement(url, poster)`，动态创建一个包含双格式 `<source>`、controls、playsinline 的 video 元素并返回 DOM 节点。

**题 3（AI 场景）**：假设你在开发一个 AI 短视频平台，后端接口 `GET /api/videos` 返回如下 JSON：

```json
[
  {
    "id": "v001",
    "title": "水波纹特效",
    "mp4Url": "https://cdn.example.com/v001.mp4",
    "webmUrl": "https://cdn.example.com/v001.webm",
    "posterUrl": "https://cdn.example.com/v001-poster.jpg",
    "vttUrl": "https://cdn.example.com/v001-zh.vtt"
  }
]
```

请编写完整的 HTML + JS，获取该接口数据后，动态渲染一组视频卡片，每张卡片包含：video（多格式 source + 字幕 track + poster）、视频标题、播放/暂停按钮。

---

## 📌 本节总结

| 知识点 | 核心要点 |
|--------|---------|
| 多格式兜底 | `<source>` 按优先级排列，WebM 优先，MP4 兜底 |
| 自动播放 | 必须搭配 `muted`，否则被浏览器拦截 |
| 移动端 | `playsinline` 阻止 iOS 强制全屏 |
| 字幕 | `<track kind="subtitles">` + WebVTT，支持多语言 |
| JS 控制 | `play()` / `pause()` / `currentTime` / `playbackRate` |
| AI 场景 | 动态设置 `src` 接收异步生成的视频 URL；Whisper 字幕动态挂载 |
| 错误处理 | 监听 `error` 事件，读取 `error.code` 显示友好提示 |

`<video>` 是 AI 视频时代的核心前端标签。掌握动态加载、字幕挂载与 JS 控制，就能构建完整的 AI 视频展示与互动系统。

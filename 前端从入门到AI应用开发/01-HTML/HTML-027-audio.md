# 音频标签 \<audio\>（HTML-027）

## 🎯 本节学习目标

- 掌握 `<audio>` 标签的属性与基本播放
- 理解 TTS（文字转语音）API 返回音频 URL 后如何动态播放
- 学会用 MediaRecorder + getUserMedia 实现浏览器端录音
- 了解 Web Audio API 可视化音频的原理与代码骨架

---

## 📖 什么是 \<audio\>

`<audio>` 是 HTML5 原生音频播放标签，无需 Flash 或插件即可在浏览器内播放 MP3、WAV、OGG 等格式。

在 AI 场景中，`<audio>` 的用途大幅扩展：

- **TTS 播放**：ElevenLabs、OpenAI TTS API 返回音频流 → `<audio>` 播放
- **STT 录音**：getUserMedia 采集麦克风 → MediaRecorder 编码 → 上传 Whisper
- **AI 播客**：NotebookLM、自定义 TTS 生成的长音频节目
- **语音助手**：前端语音对话界面

---

## 🧠 原理讲解

```text
音频播放流程：
<audio src> → HTTP 请求音频文件 → 解码（AudioDecoder）→ 混音 → 扬声器

TTS 流程：
文字 → TTS API（ElevenLabs / OpenAI）→ 返回 MP3 字节流
→ Blob URL / 直接 URL → audio.src = url → audio.play()

STT 流程：
麦克风 → getUserMedia() → MediaStream
→ MediaRecorder（编码 WebM/MP3）→ Blob → FormData → Whisper API
```

**浏览器格式支持**：

| 格式 | Chrome | Firefox | Safari | 说明 |
|------|--------|---------|--------|------|
| MP3 | ✅ | ✅ | ✅ | 最广泛，TTS API 首选 |
| WAV | ✅ | ✅ | ✅ | 无损，体积大 |
| OGG | ✅ | ✅ | ❌ | 开源，Safari 不支持 |
| WebM | ✅ | ✅ | ✅(14.1+) | MediaRecorder 默认输出 |

---

## 🏗 基本结构

```html
<!-- 最简单的音频播放 -->
<audio controls src="podcast.mp3"></audio>

<!-- 多格式兜底 -->
<audio controls>
  <source src="audio.ogg" type="audio/ogg">
  <source src="audio.mp3" type="audio/mpeg">
  <p>您的浏览器不支持 audio 标签。<a href="audio.mp3">下载音频</a></p>
</audio>
```

---

## ✅ 完整代码

**场景：AI 语音合成（TTS）播放器**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI TTS 播放器 — 阿基米德实验室</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0f0f13; color: #e0e0e8; min-height: 100vh; display: flex; align-items: center; justify-content: center; }

    .player-card {
      width: 480px; background: #1a1a24; border-radius: 16px;
      padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,.4);
    }

    h2 { font-size: 1.2rem; margin-bottom: 4px; }
    .subtitle { font-size: .83rem; color: #777; margin-bottom: 24px; }

    /* 文字输入区 */
    textarea {
      width: 100%; height: 100px; background: #111118; border: 1px solid #2a2a3a;
      border-radius: 8px; color: #e0e0e8; padding: 12px; font-size: .9rem;
      resize: vertical; font-family: inherit;
    }
    textarea:focus { outline: none; border-color: #7c6df0; }

    .options { display: flex; gap: 12px; margin: 12px 0; flex-wrap: wrap; }
    select, .voice-select {
      flex: 1; min-width: 140px; background: #111118; border: 1px solid #2a2a3a;
      border-radius: 6px; color: #e0e0e8; padding: 8px 10px; font-size: .85rem;
    }

    .gen-btn {
      width: 100%; padding: 11px; background: #7c6df0; color: #fff;
      border: none; border-radius: 8px; font-size: .95rem; cursor: pointer;
      font-weight: 600; transition: background .2s;
    }
    .gen-btn:hover:not(:disabled) { background: #6a5cd8; }
    .gen-btn:disabled { opacity: .5; cursor: not-allowed; }

    /* 音频播放器区 */
    .audio-section { margin-top: 24px; border-top: 1px solid #222; padding-top: 20px; }
    .audio-label { font-size: .82rem; color: #666; margin-bottom: 10px; }

    audio { width: 100%; height: 40px; }
    audio::-webkit-media-controls-panel { background: #1e1e2e; }

    /* 进度条（自定义） */
    .progress-wrap {
      background: #111118; border-radius: 20px; height: 6px;
      cursor: pointer; margin: 12px 0; position: relative;
    }
    .progress-bar {
      height: 100%; background: #7c6df0; border-radius: 20px;
      width: 0%; transition: width .1s linear; pointer-events: none;
    }
    .progress-thumb {
      position: absolute; top: 50%; transform: translate(-50%, -50%);
      width: 14px; height: 14px; background: #fff; border-radius: 50%;
      left: 0%; box-shadow: 0 0 0 2px #7c6df0;
    }

    /* 控制行 */
    .ctrl-row { display: flex; align-items: center; gap: 10px; }
    .ctrl-btn {
      background: none; border: 1px solid #333; border-radius: 6px;
      color: #ccc; padding: 6px 12px; cursor: pointer; font-size: .82rem;
    }
    .ctrl-btn:hover { background: #2a2a3a; }
    .ctrl-btn.active { background: #7c6df0; border-color: #7c6df0; color: #fff; }

    .time-display { font-size: .8rem; color: #666; margin-left: auto; }

    /* 速率按钮 */
    .speed-row { display: flex; gap: 6px; margin-top: 10px; align-items: center; }
    .speed-row span { font-size: .78rem; color: #666; }
    .sp-btn {
      padding: 4px 10px; background: #1e1e2e; border: 1px solid #333;
      border-radius: 4px; color: #aaa; font-size: .78rem; cursor: pointer;
    }
    .sp-btn.active { background: #7c6df0; border-color: #7c6df0; color: #fff; }

    /* 波形可视化提示区 */
    .visualizer-hint {
      background: #111118; border-radius: 8px; padding: 12px;
      margin-top: 14px; font-size: .78rem; color: #555;
      border: 1px dashed #222; text-align: center;
    }

    /* 状态提示 */
    .status { font-size: .82rem; color: #888; margin-top: 12px; min-height: 20px; }
    .status.ok { color: #4caf7d; }
    .status.err { color: #ff6b6b; }
  </style>
</head>
<body>
<div class="player-card">
  <h2>🔊 AI 语音合成播放器</h2>
  <p class="subtitle">ElevenLabs / OpenAI TTS · 输入文字 → 生成语音 → 播放</p>

  <!-- 文字输入 -->
  <textarea id="ttsText" placeholder="在这里输入要转换为语音的文字…&#10;&#10;例：欢迎使用阿基米德 AI 实验室，今天我们来测试语音合成效果。"></textarea>

  <!-- 选项 -->
  <div class="options">
    <select id="voiceSelect">
      <option value="alloy">Alloy（中性）</option>
      <option value="echo">Echo（男声）</option>
      <option value="fable">Fable（英式）</option>
      <option value="onyx">Onyx（深沉）</option>
      <option value="nova" selected>Nova（女声）</option>
      <option value="shimmer">Shimmer（柔和）</option>
    </select>
    <select id="modelSelect">
      <option value="tts-1">tts-1（标准）</option>
      <option value="tts-1-hd" selected>tts-1-hd（高清）</option>
    </select>
  </div>

  <button class="gen-btn" id="genBtn" onclick="generateTTS()">
    ✨ 生成语音
  </button>
  <div class="status" id="statusMsg"></div>

  <!-- 播放器 -->
  <div class="audio-section">
    <div class="audio-label">▶ 生成结果</div>

    <!-- 隐藏的原生 audio（用于控制和事件） -->
    <audio id="ttsAudio" preload="none" style="display:none">
      <source id="ttsSource" src="" type="audio/mpeg">
    </audio>

    <!-- 自定义进度条 -->
    <div class="progress-wrap" id="progressWrap" onclick="seekByClick(event)">
      <div class="progress-bar" id="progressBar"></div>
      <div class="progress-thumb" id="progressThumb"></div>
    </div>

    <!-- 控制行 -->
    <div class="ctrl-row">
      <button class="ctrl-btn" id="playPauseBtn" onclick="togglePlay()">▶ 播放</button>
      <button class="ctrl-btn" onclick="restartAudio()">⏮ 重播</button>
      <button class="ctrl-btn" onclick="downloadAudio()">⬇ 下载</button>
      <span class="time-display" id="timeDisplay">0:00 / 0:00</span>
    </div>

    <!-- 播放速率 -->
    <div class="speed-row">
      <span>速率：</span>
      <button class="sp-btn" onclick="setRate(0.75, this)">0.75×</button>
      <button class="sp-btn active" onclick="setRate(1, this)">1×</button>
      <button class="sp-btn" onclick="setRate(1.25, this)">1.25×</button>
      <button class="sp-btn" onclick="setRate(1.5, this)">1.5×</button>
      <button class="sp-btn" onclick="setRate(2, this)">2×</button>
    </div>

    <!-- Web Audio API 可视化提示 -->
    <div class="visualizer-hint" id="vizHint">
      🎵 Web Audio API 波形可视化占位区<br>
      <small>接入 AnalyserNode 后，此处将显示实时音频频谱</small>
    </div>
  </div>
</div>

<script>
// ── 状态 ─────────────────────────────────────────────────
const audio      = document.getElementById('ttsAudio');
const source     = document.getElementById('ttsSource');
let   currentUrl = null;

// ── 格式化时间 ────────────────────────────────────────────
function fmt(s) {
  if (!isFinite(s)) return '0:00';
  return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
}

function setStatus(msg, type = '') {
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  el.className   = 'status ' + type;
}

// ── TTS 生成（调用 OpenAI TTS API）────────────────────────
async function generateTTS() {
  const text  = document.getElementById('ttsText').value.trim();
  const voice = document.getElementById('voiceSelect').value;
  const model = document.getElementById('modelSelect').value;
  const btn   = document.getElementById('genBtn');

  if (!text) { setStatus('请先输入文字内容', 'err'); return; }

  btn.disabled      = true;
  btn.textContent   = '⏳ 生成中…';
  setStatus('正在调用 TTS API，请稍候…');

  try {
    // ── 真实项目：调用后端代理，避免在前端暴露 API Key ────
    // const res = await fetch('/api/tts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text, voice, model }),
    // });

    // ── 演示模式：直接调用 OpenAI（需替换 API Key）─────────
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model,
        input: text,
        voice,
        response_format: 'mp3',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    // 将返回的字节流转为 Blob URL
    const blob    = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    loadAudioUrl(blobUrl);
    setStatus('✅ 语音生成成功！', 'ok');

  } catch (e) {
    setStatus(`❌ 生成失败：${e.message}`, 'err');
    console.error(e);
  } finally {
    btn.disabled    = false;
    btn.textContent = '✨ 生成语音';
  }
}

// ── 动态加载音频 URL ──────────────────────────────────────
function loadAudioUrl(url) {
  if (currentUrl) URL.revokeObjectURL(currentUrl); // 释放旧 Blob URL
  currentUrl  = url;
  audio.src   = url;            // 直接设置 src（而非修改 <source>）
  audio.load();                 // 重新加载
  audio.play();
}

// ── 播放控制 ──────────────────────────────────────────────
function togglePlay() {
  const btn = document.getElementById('playPauseBtn');
  if (audio.paused) {
    audio.play();
    btn.textContent = '⏸ 暂停';
  } else {
    audio.pause();
    btn.textContent = '▶ 播放';
  }
}

function restartAudio() {
  audio.currentTime = 0;
  audio.play();
  document.getElementById('playPauseBtn').textContent = '⏸ 暂停';
}

function setRate(rate, btn) {
  audio.playbackRate = rate;
  document.querySelectorAll('.sp-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── 进度条点击跳转 ────────────────────────────────────────
function seekByClick(e) {
  if (!audio.duration) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
}

// ── 下载 ─────────────────────────────────────────────────
function downloadAudio() {
  if (!currentUrl) { setStatus('请先生成语音', 'err'); return; }
  const a    = document.createElement('a');
  a.href     = currentUrl;
  a.download = 'tts-output.mp3';
  a.click();
}

// ── 事件监听 ──────────────────────────────────────────────
audio.addEventListener('timeupdate', () => {
  const pct    = (audio.currentTime / audio.duration) * 100 || 0;
  document.getElementById('progressBar').style.width   = pct + '%';
  document.getElementById('progressThumb').style.left  = pct + '%';
  document.getElementById('timeDisplay').textContent   =
    `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
});

audio.addEventListener('ended', () => {
  document.getElementById('playPauseBtn').textContent = '▶ 播放';
});

audio.addEventListener('play', () => {
  document.getElementById('playPauseBtn').textContent = '⏸ 暂停';
});

// ── Web Audio API 可视化（骨架，连接真实节点后可激活）──────
function initVisualizer() {
  const ctx      = new AudioContext();
  const source_  = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;

  source_.connect(analyser);
  analyser.connect(ctx.destination);

  const bufferLen = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLen);

  const hint   = document.getElementById('vizHint');
  const canvas = document.createElement('canvas');
  canvas.width  = hint.offsetWidth;
  canvas.height = 60;
  canvas.style  = 'display:block;border-radius:6px;';
  hint.innerHTML = '';
  hint.appendChild(canvas);

  const canvasCtx = canvas.getContext('2d');

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const barW = (canvas.width / bufferLen) * 2;
    let x = 0;
    for (let i = 0; i < bufferLen; i++) {
      const barH = (dataArray[i] / 255) * canvas.height;
      canvasCtx.fillStyle = `hsl(${i * 2 + 220}, 70%, 60%)`;
      canvasCtx.fillRect(x, canvas.height - barH, barW, barH);
      x += barW + 1;
    }
  }
  draw();
}

// 点击可视化区域时初始化（需用户手势，否则 AudioContext 被浏览器阻止）
document.getElementById('vizHint').addEventListener('click', () => {
  initVisualizer();
}, { once: true });
</script>
</body>
</html>
```

---

## 🔍 逐行解析

**`preload="none"`**
TTS 音频在生成前 URL 未知，`preload="none"` 阻止浏览器提前请求空 URL，节省资源。

**`URL.createObjectURL(blob)`**
将 API 返回的字节流（Blob）转为可播放的临时 URL（`blob:http://...`），赋值给 `audio.src` 即可播放。

**`URL.revokeObjectURL(oldUrl)`**
每次生成新音频前，释放旧 Blob URL 的内存，防止内存泄漏。

**`audio.load()`**
修改 `src` 后需调用 `load()` 让浏览器重新解析新资源，否则仍播放旧内容。

**`AudioContext` + `AnalyserNode`**
Web Audio API 的节点图：MediaElementSource → AnalyserNode → 输出 → 实时频谱数据 → Canvas 绘制。

---

## 🌐 浏览器表现

| 状态 | 视觉 / 行为 |
|------|------------|
| 未加载 | 控件显示为禁用（无音频源） |
| 加载中 | 浏览器原生 loading 动画 |
| 播放中 | 进度条推进，时间计数 |
| 暂停 | 停在当前时间点 |
| 播放完毕 | 进度条归位（取决于 `loop`） |
| 错误 | 控件显示错误状态，`error` 事件触发 |

---

## 📦 常见属性/API

| 属性 / API | 类型 | 说明 |
|-----------|------|------|
| `src` | 属性（string） | 音频文件 URL，可动态赋值 |
| `controls` | 布尔属性 | 显示原生播放控件 |
| `autoplay` | 布尔属性 | 自动播放（需用户已有交互，否则被拦截） |
| `muted` | 布尔属性 | 静音（搭配 autoplay 使用） |
| `loop` | 布尔属性 | 结束后循环播放 |
| `preload` | 属性（`none`/`metadata`/`auto`） | 控制预加载行为 |
| `crossorigin` | 属性（`anonymous`/`use-credentials`） | 跨域音频配置（Web Audio API 分析需要） |
| `audio.play()` | JS API（Promise） | 开始播放，返回 Promise |
| `audio.pause()` | JS API | 暂停播放 |
| `audio.currentTime` | JS API（number） | 当前播放时间（秒），可赋值跳转 |
| `audio.duration` | JS API（number，只读） | 总时长（秒） |
| `audio.playbackRate` | JS API（number） | 播放速率（0.25–16） |
| `audio.volume` | JS API（0–1） | 音量 |
| `audio.paused` | JS API（boolean，只读） | 是否处于暂停状态 |
| `audio.load()` | JS API | 重新加载当前 src |
| `audio.error` | JS API（MediaError） | 播放错误对象 |

---

## ⭐⭐⭐⭐⭐ 必学重点

**1. 动态 TTS 播放核心模式**

```js
// 正确：直接设置 audio.src，再 load() + play()
audio.src = blobUrl;
audio.load();
audio.play();

// 错误：修改 <source> 的 src 属性后不调用 load()，浏览器不会更新
document.querySelector('source').src = blobUrl; // ❌ 不够，必须 audio.load()
```

**2. `play()` 返回 Promise**

```js
audio.play()
  .then(() => console.log('播放开始'))
  .catch(e => {
    if (e.name === 'NotAllowedError') showPlayButton();  // 需要用户交互
    if (e.name === 'NotSupportedError') showError('格式不支持');
  });
```

---

## ⚠️ 易错点

| 错误 | 正确做法 |
|------|---------|
| 修改 `<source>` 后不调用 `audio.load()` | 修改 `audio.src` 或调用 `audio.load()` |
| 没有释放旧 Blob URL | 使用 `URL.revokeObjectURL(oldUrl)` |
| AudioContext 在用户交互前创建 | 在 click/play 事件回调中创建 AudioContext |
| `crossorigin` 缺失导致 Web Audio API 报错 | 跨域音频必须加 `crossorigin="anonymous"` + 服务端 CORS |
| 在 HTTPS 之外使用 getUserMedia | 录音 API 仅在 HTTPS 或 localhost 可用 |

---

## 💡 最佳实践

1. **TTS 走后端代理**：永远不要把 API Key 写在前端，所有 TTS 请求发到自己的 `/api/tts` 再转发
2. **Blob URL 记得释放**：`URL.revokeObjectURL()` 防止内存泄漏
3. **预加载策略**：已知有音频但用户未点击时用 `preload="metadata"`；完全不确定时用 `preload="none"`
4. **AudioContext 懒初始化**：在用户第一次点击"播放"时才创建，避免浏览器自动播放拦截策略

---

## 🚀 AI 应用场景

### 场景 1：ElevenLabs / OpenAI TTS API 返回音频 URL 的播放

```js
// ElevenLabs TTS（流式返回）
async function elevenLabsTTS(text, voiceId = 'EXAVITQu4vr4xnSDxMaL') {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key':   'YOUR_ELEVENLABS_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.8 },
    }),
  });

  if (!res.ok) throw new Error(`ElevenLabs API Error: ${res.status}`);

  // 将响应字节流转为 Blob URL
  const blob    = await res.blob();
  const url     = URL.createObjectURL(blob);

  const audio   = document.getElementById('ttsAudio');
  audio.src     = url;
  audio.load();
  await audio.play();

  return url;  // 调用方可保存 URL 供下载用
}
```

---

### 场景 2：getUserMedia + MediaRecorder 录音，上传 Whisper STT

```html
<button id="recordBtn" onclick="toggleRecord()">🎤 开始录音</button>
<div id="recordStatus">准备就绪</div>
<audio id="recordedAudio" controls style="display:none;margin-top:12px"></audio>
```

```js
let mediaRecorder = null;
let audioChunks   = [];
let isRecording   = false;

async function toggleRecord() {
  const btn    = document.getElementById('recordBtn');
  const status = document.getElementById('recordStatus');

  if (!isRecording) {
    // ── 开始录音 ──────────────────────────────────────────
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',  // 浏览器默认支持最好
      });
      audioChunks   = [];

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });

        // 1. 本地回放
        const url = URL.createObjectURL(blob);
        const playback = document.getElementById('recordedAudio');
        playback.src  = url;
        playback.style.display = 'block';

        // 2. 上传 Whisper STT
        status.textContent = '🔄 正在识别语音…';
        const transcript = await whisperSTT(blob);
        status.textContent = `✅ 识别结果：${transcript}`;

        // 关闭麦克风
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start(250);  // 每 250ms 触发一次 ondataavailable
      isRecording         = true;
      btn.textContent     = '⏹ 停止录音';
      btn.style.background = '#e53935';
      status.textContent  = '🔴 录音中…';

    } catch (e) {
      status.textContent = `❌ 无法访问麦克风：${e.message}`;
    }

  } else {
    // ── 停止录音 ──────────────────────────────────────────
    mediaRecorder.stop();
    isRecording         = false;
    btn.textContent     = '🎤 开始录音';
    btn.style.background = '';
  }
}

// ── Whisper API 调用 ──────────────────────────────────────
async function whisperSTT(audioBlob) {
  const form = new FormData();
  // Whisper 接受 webm，重命名为 .webm 让 API 识别
  form.append('file', audioBlob, 'recording.webm');
  form.append('model', 'whisper-1');
  form.append('language', 'zh');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method:  'POST',
    headers: { 'Authorization': `Bearer YOUR_OPENAI_API_KEY` },
    body:    form,
  });

  const data = await res.json();
  return data.text || '';
}
```

---

### 场景 3：`<audio>` 与 Web Speech API 的对比

```js
// ── 方案 A：<audio> + TTS API（推荐，音质好、支持多语言）──
function speakWithAudio(text) {
  fetch('/api/tts', { method: 'POST', body: JSON.stringify({ text }) })
    .then(r => r.blob())
    .then(blob => {
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    });
}

// ── 方案 B：Web Speech API（免费，无需 API Key，但音质差、兼容性弱）──
function speakWithWebSpeech(text) {
  if (!window.speechSynthesis) return alert('浏览器不支持 Web Speech API');

  const utter  = new SpeechSynthesisUtterance(text);
  utter.lang   = 'zh-CN';
  utter.rate   = 1;
  utter.pitch  = 1;
  speechSynthesis.speak(utter);
}

// 对比表格（逻辑层面）
const comparison = {
  '音质':      { audio: '⭐⭐⭐⭐⭐（AI TTS）', webSpeech: '⭐⭐（系统 TTS）' },
  '多语言':    { audio: '✅ 全语言',           webSpeech: '⚠️ 依赖系统语音包' },
  'API Key':   { audio: '✅ 需要',             webSpeech: '❌ 不需要' },
  '流量消耗':  { audio: '⚠️ 有（音频文件）',   webSpeech: '✅ 无' },
  '浏览器兼容':{ audio: '✅ 全浏览器',         webSpeech: '⚠️ 仅 Chrome/Edge' },
  '推荐场景':  { audio: 'AI 产品语音助手',     webSpeech: '简单原型 / Demo' },
};
```

---

## 📝 练习题

**题 1（基础）**：创建一个 `<audio>` 播放器，提供 MP3 和 OGG 两种格式兜底，显示 controls，并添加"下载"链接。

**题 2（进阶）**：编写函数 `playAudioFromUrl(url)`，动态将 URL 赋值给 audio 元素并播放，处理 `NotAllowedError` 异常。

**题 3（AI 场景）**：设计一个"AI 播客生成"功能页面，用户输入一段文章（textarea），点击"生成播客"后：
1. 调用 `/api/tts` 接口（POST，JSON body `{text, voice}`）
2. 返回音频 Blob，转为 Blob URL
3. 动态设置到 `<audio>` 并自动播放
4. 提供下载按钮
5. 用 `audio.ontimeupdate` 更新自定义进度条

---

## 📌 本节总结

| 知识点 | 核心要点 |
|--------|---------|
| 基本播放 | `<audio controls src="...">` 最简结构 |
| 动态 TTS | `audio.src = blobUrl` + `audio.load()` + `audio.play()` |
| Blob URL | `URL.createObjectURL()` 创建，`revokeObjectURL()` 释放 |
| 录音 | `getUserMedia` → `MediaRecorder` → Blob → Whisper API |
| Web Audio | `AudioContext` + `AnalyserNode` 做频谱可视化 |
| vs Web Speech API | AI TTS 音质好但需 Key；Web Speech 免费但音质差 |

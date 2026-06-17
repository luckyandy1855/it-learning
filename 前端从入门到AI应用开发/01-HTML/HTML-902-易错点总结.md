# HTML 易错点总结（HTML-902）

## 🎯 本节学习目标

- 汇总 HTML-001 至 HTML-032 的高频错误
- 能够按结构、属性、语义、表单、媒体、安全、性能分类排查问题
- 掌握「错误示范 → 正确写法」的修复方式
- 能够用这份清单审查 AI 生成的 HTML 代码

---

## 📖 什么是易错点总结

易错点总结是一份面向实战的排雷清单。它不追求覆盖所有细节，而是优先整理最容易在真实项目里造成 bug、体验问题、安全风险和维护成本的写法。

AI 生成 HTML 时也会犯这些错误：标签闭合不完整、标题层级混乱、表单缺 label、iframe 权限过大、图片没有 alt、把密钥写进注释等。因此，这份附录也可以作为 AI 代码审查的标准。

---

## 🧠 原理讲解

HTML 错误通常分三类：

```text
解析错误：浏览器能自动修复，但修复结果不一定符合预期。
语义错误：页面看起来正常，但机器、搜索引擎和屏幕阅读器理解错误。
工程错误：短期能跑，长期带来安全、性能、协作和维护问题。
```

学习 HTML 不能只看页面是否显示出来，还要看结构是否可靠、语义是否清晰、输入是否可提交、资源是否可访问、动态内容是否安全。

---

## 🏗 基本结构

本附录按下面的分类复盘：

```text
结构类 → DOCTYPE、html、head、body、标签闭合
属性类 → lang、href、src、alt、type、name、id
语义类 → h1~h6、p、strong/em、HTML5 语义标签
表单类 → form、input、textarea、select、button
媒体类 → img、video、audio、iframe
安全类 → target、sandbox、CSP、敏感信息
性能类 → preload、loading、width/height、script defer
AI 场景类 → 输出渲染、流式区域、RAG 抓取、Prompt 表单
```

---

## ✅ 完整代码

下面是一段问题很多的 AI 页面片段：

```html
<html>
<head>
  <title>工具</title>
</head>
<body>
  <div class="header">
    <div onclick="location.href='/'">首页</div>
  </div>

  <div class="main">
    <h1>AI 工具</h1>
    <h1>提示词输入</h1>
    <form>
      <input placeholder="请输入提示词">
      <button onclick="sendPrompt()">发送</button>
    </form>
    <img src="cover.png">
    <iframe src="https://example.com/tool"></iframe>
  </div>
</body>
</html>
```

修复后的基础版本：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 提示词工具</title>
</head>
<body>
  <header>
    <nav aria-label="主导航">
      <a href="/">首页</a>
    </nav>
  </header>

  <main>
    <h1>AI 提示词工具</h1>

    <section aria-labelledby="prompt-title">
      <h2 id="prompt-title">提示词输入</h2>
      <form action="/api/prompts" method="post">
        <label for="prompt">请输入提示词</label>
        <textarea id="prompt" name="prompt" rows="6" required></textarea>
        <button type="submit">发送</button>
      </form>
    </section>

    <img src="cover.png" alt="AI 提示词工具页面封面" width="1200" height="630">

    <iframe
      src="https://example.com/tool"
      title="AI 工具嵌入预览"
      sandbox="allow-forms allow-scripts"
      loading="lazy"
      referrerpolicy="no-referrer"
    ></iframe>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

修复版补上了 `DOCTYPE`、`lang`、`charset`、`viewport`，解决基础解析和移动端问题。

用 `<header>`、`<nav>`、`<main>`、`<section>` 替代纯 div，让页面结构具备语义。

只保留一个 `<h1>`，把功能区标题改为 `<h2>`，避免标题层级混乱。

用 `<textarea>` 承载长提示词，并补齐 `label`、`name`、`required`、`action`、`method`。

按钮改为 `type="submit"`，避免在表单里出现默认行为不清的问题。

图片补 `alt`、`width`、`height`，同时提升无障碍和布局稳定性。

iframe 补 `title`、`sandbox`、`loading`、`referrerpolicy`，降低安全和隐私风险。

---

## 🌐 浏览器表现

错误版在浏览器中可能也能显示出来，但存在隐藏问题：移动端缩放异常、点击 div 无法键盘访问、表单字段无法被准确识别、iframe 权限过宽、图片加载时造成布局跳动。

修复版的视觉可能没有明显变漂亮，但结构更可靠，后续加 CSS 和 JavaScript 时更容易维护。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 常见错误 | 正确做法 |
|---------|------|----------|----------|
| `lang` | 全局属性 | 不写或写成 `chinese` | 使用 `zh-CN`、`en` 等标准代码 |
| `charset` | meta 属性 | 缺失导致乱码 | 放在 head 前部 |
| `viewport` | meta 配置 | 移动端显示过小 | `width=device-width, initial-scale=1.0` |
| `href` | a 属性 | 外链新窗口不安全 | 配合 `rel="noopener noreferrer"` |
| `src` | 媒体属性 | 相对路径层级写错 | 明确资源路径 |
| `alt` | img 属性 | 缺失或写成文件名 | 描述图片信息 |
| `type` | button/input 属性 | button 默认提交表单 | 明确写 `button` 或 `submit` |
| `name` | 表单属性 | 缺失导致提交无字段名 | 每个提交字段都写 name |
| `sandbox` | iframe 属性 | 不写导致权限过大 | 默认收紧，按需开放 |
| `aria-live` | ARIA 属性 | 加在频繁变化父容器 | 只加在需要宣告的结果区域 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 页面能显示不代表 HTML 写对了
- 语义、可访问性、安全和性能问题往往不会立刻报错
- 表单是 AI 应用的核心输入面，label/name/type/required 缺一项都可能影响质量
- iframe、AI 输出 HTML、外链是高风险区域，默认要保守处理

---

## ⚠️ 易错点

### 结构类

错误：缺少基础文档声明和 head 配置。

```html
<html>
<head><title>AI 工具</title></head>
```

正确：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 工具</title>
</head>
```

错误：把可见内容放进 `<head>`。

```html
<head>
  <p>欢迎使用 AI 助手</p>
</head>
```

正确：

```html
<body>
  <p>欢迎使用 AI 助手</p>
</body>
```

### 属性类

错误：外链新窗口缺少安全 rel。

```html
<a href="https://example.com" target="_blank">引用来源</a>
```

正确：

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">引用来源</a>
```

错误：图片缺少替代文本。

```html
<img src="ai-result.png">
```

正确：

```html
<img src="ai-result.png" alt="AI 生成的产品原型页面截图">
```

### 语义类

错误：用标题标签控制字号。

```html
<h3>这是因为字号刚好合适</h3>
```

正确：

```html
<h2>功能说明</h2>
```

错误：p 内嵌套 div。

```html
<p>
  <div>AI 回答内容</div>
</p>
```

正确：

```html
<section>
  <p>AI 回答内容</p>
</section>
```

### 表单类

错误：只有 placeholder，没有 label。

```html
<input name="prompt" placeholder="请输入提示词">
```

正确：

```html
<label for="prompt">请输入提示词</label>
<input id="prompt" name="prompt" type="text" placeholder="请输入提示词">
```

错误：form 内功能按钮忘记写 type。

```html
<button onclick="copyPrompt()">复制提示词</button>
```

正确：

```html
<button type="button" onclick="copyPrompt()">复制提示词</button>
```

### 媒体类

错误：video 自动播放不加 muted。

```html
<video autoplay src="demo.mp4"></video>
```

正确：

```html
<video autoplay muted playsinline src="demo.mp4"></video>
```

错误：iframe 没有限制权限。

```html
<iframe src="https://example.com/ai-tool"></iframe>
```

正确：

```html
<iframe
  src="https://example.com/ai-tool"
  title="AI 工具"
  sandbox="allow-forms allow-scripts"
></iframe>
```

### 安全类

错误：把 Token 写进 HTML 注释。

```html
<!-- OPENAI_API_KEY=sk-example -->
```

正确：

```html
<!-- API Key 只保存在服务端环境变量中 -->
```

错误：直接渲染 AI 返回的 HTML。

```html
<div id="answer"><!-- 插入模型返回的原始 HTML --></div>
```

正确：

```html
<div id="answer" aria-live="polite"><!-- 插入过滤后的安全内容 --></div>
```

---

## 💡 最佳实践

- 每次写完 HTML，先用「结构、属性、语义、表单、媒体、安全、性能」七项检查一遍
- 优先使用原生语义标签，不用 div 模拟按钮、链接和表单控件
- 表单字段统一检查 label、id、name、type、required、placeholder
- AI 输出必须走安全渲染流程，不把模型返回内容直接当可信 HTML
- 让 AI 帮你审查代码，但最终判断必须由人确认

---

## 🚀 AI 应用场景

可以把本附录变成审查 Prompt：

```text
你是前端 HTML 代码审查助手。请按以下分类检查代码：
1. 结构类：DOCTYPE、html、head、body 是否完整。
2. 属性类：lang、href、src、alt、type、name 是否合理。
3. 语义类：标题层级、语义标签、p/div/span 使用是否准确。
4. 表单类：label、id、name、required、button type 是否完整。
5. 媒体类：img/video/audio/iframe 是否有 fallback 和安全配置。
6. 安全类：外链 rel、iframe sandbox、敏感信息、AI 输出渲染风险。
7. 性能类：loading、preload、width/height、script defer。

请输出表格：问题位置、问题类型、风险等级、修复建议、修复代码。
```

---

## 📝 练习题

1. [基础题] 找出一个页面中所有缺少 `alt` 的图片，并写出合适替代文本。
2. [基础题] 修复一个缺少 `label` 的 AI 提示词表单。
3. [进阶题] 把一个由 div 组成的导航改成 `<nav><ul><li><a>` 结构。
4. [进阶题] 为一个 iframe 嵌入 AI 工具补齐 `title`、`sandbox` 和 `referrerpolicy`。
5. [AI 场景题] 写一份审查报告，说明 AI 生成 HTML 代码中哪些问题是真问题，哪些可能是误判。

---

## 📌 本节总结

| 类型 | 最常见错误 | 一句话修复 |
|------|------------|------------|
| 结构类 | 缺 DOCTYPE、lang、charset、viewport | 补齐 HTML5 基础骨架 |
| 属性类 | href/src/alt/type/name 不完整 | 让每个属性承担明确职责 |
| 语义类 | div 汤、标题跳级、p 内嵌块级元素 | 用合适标签表达内容关系 |
| 表单类 | 无 label、button 默认提交、字段无 name | 按提交链路检查字段 |
| 媒体类 | 无 fallback、无尺寸、无权限控制 | 补替代文本、尺寸和安全属性 |
| 安全类 | iframe 过宽、外链风险、泄露密钥 | 默认收紧权限和数据暴露 |
| AI 类 | 直接渲染模型输出 | 过滤、转义、审查后再展示 |

# backdrop-filter 背景滤镜（CSS-055）

## 🎯 本节学习目标

- 理解 `backdrop-filter` 影响元素背后的内容。
- 掌握磨砂面板和半透明浮层的基础写法。
- 能够为 AI 弹窗、顶部栏和悬浮工具栏设计克制的背景滤镜。

---

## 📖 什么是 backdrop-filter

`backdrop-filter` 用来对元素背后的区域应用滤镜。最常见效果是磨砂玻璃：前景面板半透明，背后的内容被模糊。

它和 `filter` 不同。`filter` 作用于元素自身，`backdrop-filter` 作用于元素后面的背景。

在 AI 应用中，磨砂效果可用于顶部固定栏、命令面板、模型选择弹窗和浮动工具栏，但应避免影响内容识别。

---

## 🧠 原理讲解

基础写法：

```css
.toolbar {
  background: rgb(255 255 255 / 0.75);
  backdrop-filter: blur(12px);
}
```

要看到效果，元素通常需要半透明背景。如果背景完全不透明，背后内容看不到，滤镜也就不明显。

兼容性方面，现代浏览器大多支持，但仍建议提供普通半透明背景作为降级。

---

## 🏗 基本结构

```html
<style>
  .floating-panel {
    background: rgb(255 255 255 / 0.78);
    backdrop-filter: blur(12px);
  }
</style>
```

---

## ✅ 完整代码

下面实现 AI 页面顶部磨砂工具栏：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>backdrop-filter 示例</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 96px 32px 32px;
      font-family: system-ui, sans-serif;
      background: linear-gradient(135deg, #dbeafe, #f8fafc 40%, #fce7f3);
      color: #111827;
    }

    .topbar {
      position: fixed;
      top: 16px;
      left: 50%;
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: min(92vw, 820px);
      padding: 12px 16px;
      border: 1px solid rgb(229 231 235 / 0.8);
      border-radius: 8px;
      background: rgb(255 255 255 / 0.78);
      backdrop-filter: blur(14px);
      transform: translateX(-50%);
    }

    .content {
      max-width: 820px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: rgb(255 255 255 / 0.88);
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <header class="topbar">
    <strong>AI 工作台</strong>
    <button>打开命令面板</button>
  </header>
  <main class="content">
    <h1>背景滤镜</h1>
    <p>顶部栏使用半透明背景和 backdrop-filter，让背后的页面背景产生轻微模糊。</p>
    <p>这种效果适合固定工具栏，但不应降低正文可读性。</p>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

`.topbar` 使用 fixed 固定在顶部。

`background: rgb(255 255 255 / 0.78)` 提供半透明背景，这是 backdrop-filter 可见的前提。

`backdrop-filter: blur(14px)` 模糊顶部栏背后的内容。

`z-index: 100` 确保顶部栏显示在正文之上。

---

## 🌐 浏览器表现

顶部工具栏会有轻微磨砂效果。页面背景在工具栏后方被模糊，但工具栏内文字和按钮保持清晰。

如果把背景改成完全不透明的白色，磨砂效果会变得不可见。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `backdrop-filter` | CSS 属性 | 过滤元素背后内容 | `blur(12px)` |
| `blur()` | CSS 函数 | 背景模糊 | `blur(14px)` |
| 半透明背景 | 视觉条件 | 让背景滤镜可见 | `rgb(... / 0.78)` |
| `filter` | 对比属性 | 过滤元素自身 | `filter: blur(...)` |
| `z-index` | CSS 属性 | 控制浮层层级 | `z-index: 100;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `backdrop-filter` 作用于元素背后的内容。
- 它通常需要半透明背景才能看出效果。
- 磨砂效果应服务信息层级，不要影响阅读。

---

## ⚠️ 易错点

- 易错点1：背景完全不透明，看不到 backdrop-filter。正确写法：使用半透明背景。
- 易错点2：把正文区域做强磨砂。正确写法：正文优先清晰可读。
- 易错点3：忽略兼容性和性能。正确写法：提供普通背景作为降级，并控制模糊范围。

---

## 💡 最佳实践

- 固定顶部栏、浮动命令面板适合轻量 backdrop-filter。
- 文本密集区域不要使用强背景滤镜。
- 同时设置 border 和半透明背景，增强浮层边界。

---

## 🚀 AI 应用场景

AI 应用的命令面板、模型切换浮层和顶部状态栏可以使用轻微磨砂，让浮层与页面背景分离。

```css
.command-palette {
  background: rgb(255 255 255 / 0.82);
  backdrop-filter: blur(16px);
}
```

---

## 📝 练习题

1. [基础题] 创建一个半透明固定顶部栏。
2. [进阶题] 给顶部栏添加 `backdrop-filter: blur(12px)`。
3. [AI 场景题] 为 AI 命令面板设计一个可读性良好的磨砂背景。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `backdrop-filter` | 过滤元素背后的背景 |
| 半透明背景 | 是磨砂效果可见的关键 |
| `filter` 对比 | filter 作用自身，backdrop-filter 作用背后 |
| AI 浮层 | 命令面板和顶部栏可少量使用 |

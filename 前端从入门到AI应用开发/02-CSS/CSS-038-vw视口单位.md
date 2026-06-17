# vw 视口单位（CSS-038）

## 🎯 本节学习目标

- 理解 `vw` 相对于视口宽度计算。
- 掌握 `vw` 在全宽区域、响应式宽度和视觉尺寸中的使用方式。
- 能够判断 AI 界面中何时适合使用视口单位。

---

## 📖 什么是 vw

`vw` 是 viewport width 的缩写，表示视口宽度的百分之一。`1vw` 等于当前视口宽度的 1%。

如果浏览器宽度是 1000px，那么 `1vw` 是 10px，`50vw` 是 500px。

视口单位适合和浏览器可见区域相关的尺寸，例如全屏布局、最大宽度限制、横向空间分配。但不适合直接作为所有文字字号，否则在极宽或极窄屏幕上可能失控。

---

## 🧠 原理讲解

基础写法：

```css
.hero {
  width: 100vw;
}
```

这表示元素宽度等于视口宽度。

常见搭配是 `min()` 或 `max-width`：

```css
.panel {
  width: 90vw;
  max-width: 760px;
}
```

这样小屏宽度灵活，大屏不会过宽。

---

## 🏗 基本结构

```html
<style>
  .chat-panel {
    width: 92vw;
    max-width: 760px;
    margin: 0 auto;
  }
</style>
```

---

## ✅ 完整代码

下面用 `vw` 控制 AI 面板宽度：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>vw 示例</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 32px 0;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .chat-panel {
      width: 92vw;
      max-width: 760px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .message {
      max-width: 80%;
      padding: 12px 14px;
      border-radius: 8px;
      background: #f9fafb;
      line-height: 1.8;
    }

    .message.user {
      margin-left: auto;
      background: #dbeafe;
    }
  </style>
</head>
<body>
  <main class="chat-panel">
    <h1>AI 聊天窗口</h1>
    <p class="message user">请解释 vw。</p>
    <p class="message">vw 是相对于视口宽度的单位，适合控制随屏幕变化的容器宽度。</p>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

`.chat-panel { width: 92vw; }` 让面板宽度随浏览器视口变化。

`max-width: 760px` 限制大屏下最大阅读宽度，避免内容过宽。

`body` 横向 padding 为 0，因为面板自身已经通过 `92vw` 留出两侧空间。

`.message { max-width: 80%; }` 让消息气泡相对聊天面板宽度变化。

---

## 🌐 浏览器表现

聊天面板在小屏下接近全宽，在大屏下保持不超过 760px。消息气泡宽度也会随面板变化。

调整浏览器宽度时，可以看到 `92vw` 实时重新计算。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `vw` | CSS 单位 | 视口宽度的 1% | `92vw` |
| `vh` | CSS 单位 | 视口高度的 1% | `100vh` |
| `dvh` | CSS 单位 | 动态视口高度 | `100dvh` |
| `max-width` | CSS 属性 | 限制最大宽度 | `max-width: 760px;` |
| `min()` | CSS 函数 | 取较小值 | `width: min(92vw, 760px);` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `1vw` 等于视口宽度的 1%。
- 视口单位适合容器宽度和全屏区域。
- 使用 vw 时常配合 `max-width` 防止大屏过宽。

---

## ⚠️ 易错点

- 易错点1：用 `100vw` 导致横向滚动。正确写法：注意滚动条宽度和父级 padding，必要时用 `width: 100%`。
- 易错点2：直接用 vw 设置正文字号。正确写法：字号更推荐 `rem` 或 `clamp()`。
- 易错点3：大屏面板太宽。正确写法：`width: 92vw; max-width: 760px;`。

---

## 💡 最佳实践

- 容器宽度可用 `vw + max-width`。
- 全屏应用可考虑 `100dvh` 处理移动端动态地址栏。
- 文字字号不要单独依赖 vw，避免极端尺寸失控。

---

## 🚀 AI 应用场景

AI 聊天窗口需要在手机上接近全宽，在桌面上控制阅读宽度。`vw` 与 `max-width` 的组合很适合这个需求。

```css
.chat-shell {
  width: 94vw;
  max-width: 820px;
  margin: 0 auto;
}
```

---

## 📝 练习题

1. [基础题] 创建一个 `width: 90vw` 的容器。
2. [进阶题] 给容器加 `max-width`，避免大屏过宽。
3. [AI 场景题] 为 AI 聊天窗口设计小屏接近全宽、大屏固定最大宽度的样式。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `vw` | 视口宽度的百分之一 |
| 容器宽度 | 适合随屏幕宽度变化 |
| `max-width` | 防止大屏内容过宽 |
| AI 聊天 | `vw + max-width` 常用于聊天面板 |

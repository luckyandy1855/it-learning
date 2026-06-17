# Flexbox 简介（CSS-021）

## 🎯 本节学习目标

- 理解 Flexbox 是一维布局模型。
- 掌握 `display: flex` 如何影响父容器和直接子元素。
- 能够用 Flexbox 搭建 AI 聊天界面的基础横向布局。

---

## 📖 什么是 Flexbox

Flexbox，全称 Flexible Box Layout，是 CSS 中用于一维布局的模型。所谓一维，指它主要沿一个方向排列元素：横向或纵向。

Flexbox 最适合处理工具栏、按钮组、消息气泡对齐、头像加文本、输入框加发送按钮这类场景。

在 AI 应用中，Flexbox 是高频基础能力。聊天输入栏、模型切换栏、消息头部、引用来源行，通常都可以用 Flexbox 快速实现。

---

## 🧠 原理讲解

给父元素设置 `display: flex` 后，它会成为 flex container，直接子元素会成为 flex items。

```css
.toolbar {
  display: flex;
}
```

Flexbox 有两个重要概念：

```text
主轴：元素主要排列的方向。
交叉轴：与主轴垂直的方向。
```

默认情况下，主轴是水平方向，子元素从左到右排列。

---

## 🏗 基本结构

```html
<style>
  .toolbar {
    display: flex;
    gap: 12px;
  }
</style>

<div class="toolbar">
  <button>生成</button>
  <button>停止</button>
  <button>重试</button>
</div>
```

---

## ✅ 完整代码

下面用 Flexbox 搭建 AI 输入栏：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Flexbox 简介示例</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .chat-panel {
      max-width: 760px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .composer {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .prompt-input {
      flex: 1;
      min-height: 88px;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font: inherit;
      resize: vertical;
    }

    .send-button {
      padding: 10px 16px;
      border: 0;
      border-radius: 6px;
      background: #2563eb;
      color: #ffffff;
      font: inherit;
    }
  </style>
</head>
<body>
  <section class="chat-panel">
    <h1>AI 对话输入</h1>
    <div class="composer">
      <textarea class="prompt-input">请总结这段会议记录。</textarea>
      <button class="send-button">发送</button>
    </div>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.composer` 设置 `display: flex`，让文本框和按钮成为同一行中的 flex items。

`gap: 12px` 控制子项之间的间距，不需要给每个子元素单独写 margin。

`align-items: flex-end` 让按钮与文本框底部对齐。

`.prompt-input { flex: 1; }` 让输入框占据剩余空间，按钮保持自身宽度。

---

## 🌐 浏览器表现

输入框和发送按钮会横向排列。输入框自动拉伸占满可用宽度，按钮位于右侧，底部与输入框对齐。

在 DevTools 中选中 `.composer`，浏览器会显示 Flexbox 调试标记，可以查看主轴、间距和子项尺寸。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `display: flex` | CSS 声明 | 开启 Flexbox 布局 | `.row { display: flex; }` |
| `flex item` | 布局角色 | flex 容器的直接子元素 | 输入框、按钮 |
| `gap` | CSS 属性 | 设置子项间距 | `gap: 12px;` |
| `align-items` | CSS 属性 | 控制交叉轴对齐 | `align-items: center;` |
| `flex` | CSS 属性 | 控制子项伸缩 | `flex: 1;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- Flexbox 用于一维布局。
- `display: flex` 写在父容器上，影响直接子元素。
- 输入栏、工具栏、消息头部都适合用 Flexbox。

---

## ⚠️ 易错点

- 易错点1：把 `display: flex` 写在子元素上，却期待它影响兄弟元素。正确写法：写在共同父容器上。
- 易错点2：用 margin 手动处理每个子项间距。正确写法：Flex 容器优先使用 `gap`。
- 易错点3：以为 Flexbox 适合所有二维布局。正确写法：复杂行列布局优先考虑 Grid。

---

## 💡 最佳实践

- 一行内的控件组合优先考虑 Flexbox。
- 子项之间统一间距优先用 `gap`。
- 父容器负责排列，子元素负责自身尺寸和内容样式。

---

## 🚀 AI 应用场景

AI 聊天输入栏是 Flexbox 的典型场景：Prompt 输入框需要占满剩余空间，发送按钮保持固定宽度。

```css
.chat-composer {
  display: flex;
  gap: 12px;
}

.chat-composer textarea {
  flex: 1;
}
```

---

## 📝 练习题

1. [基础题] 创建一个 `display: flex` 的按钮工具栏。
2. [进阶题] 让输入框占满剩余宽度，按钮保持自身宽度。
3. [AI 场景题] 实现一个 Prompt 输入栏，包含 textarea、发送按钮和停止按钮。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| Flexbox | 一维布局模型 |
| flex container | 设置了 `display: flex` 的父容器 |
| flex item | flex 容器的直接子元素 |
| AI 输入栏 | Flexbox 最常见实战场景之一 |

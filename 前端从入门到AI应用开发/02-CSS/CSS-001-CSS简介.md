# CSS 简介（CSS-001）

## 🎯 本节学习目标

- 理解 CSS 在网页中的职责：控制视觉表现，而不是承载内容语义。
- 掌握 CSS 的三种常见引入方式：行内样式、内部样式表、外部样式表。
- 能够用 CSS 为一个简单 AI 聊天界面建立基础视觉层次。

---

## 📖 什么是 CSS

CSS，全称 Cascading Style Sheets，中文通常叫“层叠样式表”。HTML 负责页面结构和内容，CSS 负责颜色、间距、字号、布局、响应式和动效。

如果把 HTML 看作一份结构清晰的文档，CSS 就是让这份文档变得可读、可用、可维护的视觉规则。没有 CSS，页面依然能展示内容；但在真实产品里，用户很难高效理解和操作。

在 AI 应用中，CSS 不只是“美化”。聊天气泡、模型选择器、Prompt 输入框、加载状态、错误提示、移动端适配，都依赖 CSS 提供清晰的交互反馈。

---

## 🧠 原理讲解

浏览器加载页面时，会先解析 HTML 得到 DOM 树，再解析 CSS 得到 CSSOM 树。之后浏览器把 DOM 和 CSSOM 合成渲染树，计算每个元素的位置和样式，最后绘制到屏幕上。

CSS 的核心思想是“选择元素，然后声明样式”：

```css
选择器 {
  属性: 值;
}
```

例如：

```css
p {
  color: #1f2937;
  line-height: 1.7;
}
```

这段代码表示：选中页面中的所有 `<p>` 元素，把文字颜色设置为深灰，并让行高更适合阅读。

---

## 🏗 基本结构

最小 CSS 写法通常放在 HTML 的 `<style>` 标签中：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CSS 最小示例</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      color: #111827;
    }
  </style>
</head>
<body>
  <h1>AI 助手</h1>
  <p>你好，我可以帮你整理笔记。</p>
</body>
</html>
```

---

## ✅ 完整代码

下面是一个带基础样式的 AI 聊天卡片：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>AI 聊天界面 CSS 示例</title>
  <style>
    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f3f4f6;
      color: #111827;
    }

    .chat-shell {
      max-width: 720px;
      margin: 40px auto;
      padding: 24px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .message {
      margin: 0 0 16px;
      padding: 12px 14px;
      border-radius: 8px;
      line-height: 1.7;
    }

    .message.user {
      background: #dbeafe;
    }

    .message.assistant {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <main class="chat-shell">
    <h1>AI 学习助手</h1>
    <p class="message user">请解释 CSS 是什么。</p>
    <p class="message assistant">CSS 用来控制页面的视觉表现，例如颜色、间距、布局和动画。</p>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

`body` 设置全局字体、页面背景和默认文字颜色，这是页面的视觉基准。

`.chat-shell` 是聊天界面的外层容器，使用 `max-width` 控制阅读宽度，用 `margin: 40px auto` 实现水平居中。

`.message` 定义所有消息气泡的共同样式，包括外边距、内边距、圆角和行高。

`.message.user` 和 `.message.assistant` 在共同气泡样式上继续区分用户消息和 AI 消息。

---

## 🌐 浏览器表现

浏览器会把默认白底黑字页面渲染成一个居中的聊天界面。用户消息显示为浅蓝背景，AI 回复显示为浅灰背景并带边框。

在 DevTools 的 Elements 面板中，选中任意消息节点，可以看到 CSS 规则如何命中元素，以及哪些属性最终参与渲染。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `color` | CSS 属性 | 设置文字颜色 | `color: #111827;` |
| `background` | CSS 属性 | 设置背景 | `background: #f3f4f6;` |
| `margin` | CSS 属性 | 设置外边距 | `margin: 40px auto;` |
| `padding` | CSS 属性 | 设置内边距 | `padding: 24px;` |
| `border-radius` | CSS 属性 | 设置圆角 | `border-radius: 8px;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- CSS 的职责是表现层，不负责定义 HTML 语义。
- CSS 基本语法是“选择器 + 声明块”。
- AI 产品中的可读性、状态反馈和响应式体验都依赖 CSS。

---

## ⚠️ 易错点

- 易错点1：把所有样式都写在 HTML 属性里。正确写法：优先使用类名和样式表集中管理。
- 易错点2：用 CSS 弥补 HTML 结构混乱。正确写法：先写语义清晰的 HTML，再用 CSS 控制表现。
- 易错点3：只关注颜色，不关注间距、行高和阅读宽度。正确写法：把可读性作为基础指标。

---

## 💡 最佳实践

- 项目初期先建立全局字体、颜色、间距和容器宽度。
- 示例代码可以使用内部样式表；真实项目优先使用外部 CSS 文件或组件样式方案。
- 给可复用模块使用稳定类名，例如 `.message`、`.toolbar`、`.chat-shell`。

---

## 🚀 AI 应用场景

AI 聊天、Prompt 编辑器、知识库检索结果页都需要清晰区分内容类型。CSS 可以让用户一眼判断“这是我的输入”“这是模型回复”“这是引用来源”“这是错误提示”。

```css
.answer {
  background: #ffffff;
  border-left: 4px solid #2563eb;
  padding: 16px;
  line-height: 1.8;
}

.source {
  color: #4b5563;
  font-size: 14px;
}
```

---

## 📝 练习题

1. [基础题] 写一个 `<style>` 标签，把页面背景改为浅灰色。
2. [进阶题] 为 `.message` 设置内边距、边框和行高。
3. [AI 场景题] 设计用户消息和 AI 消息两种样式，要求颜色不同但阅读舒适。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| CSS | 控制网页视觉表现的样式语言 |
| 选择器 | 用来找到要应用样式的元素 |
| 声明块 | 由一组 `属性: 值;` 组成 |
| AI 界面 | CSS 决定信息层次、阅读体验和状态反馈 |

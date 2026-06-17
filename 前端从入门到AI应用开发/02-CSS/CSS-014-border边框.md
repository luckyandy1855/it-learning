# border 边框（CSS-014）

## 🎯 本节学习目标

- 掌握 `border` 的宽度、样式和颜色写法。
- 理解边框在信息分组、状态提示和组件边界中的作用。
- 能够为 AI 卡片、输入框和错误提示设计清晰边框。

---

## 📖 什么是 border

`border` 是元素内容和 padding 外侧的一条边界线。它可以帮助用户识别组件边界、状态变化和信息分组。

边框通常由三个部分组成：宽度、线型、颜色。例如 `border: 1px solid #e5e7eb;`。

在 AI 应用中，边框常用于卡片、输入框、模型选择项、引用来源、错误提示和工具调用结果。

---

## 🧠 原理讲解

最常见的边框写法：

```css
.card {
  border: 1px solid #e5e7eb;
}
```

拆开写：

```css
.card {
  border-width: 1px;
  border-style: solid;
  border-color: #e5e7eb;
}
```

如果没有设置 `border-style`，边框通常不会显示。也就是说，只写 `border-color` 不足以产生可见边框。

---

## 🏗 基本结构

```html
<style>
  .source-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
</style>

<div class="source-card">引用来源</div>
```

---

## ✅ 完整代码

下面用 border 区分 AI 输入、引用和错误状态：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>border 示例</title>
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

    .panel {
      max-width: 720px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .prompt-input {
      width: 100%;
      min-height: 100px;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font: inherit;
    }

    .source-box {
      margin-top: 16px;
      padding: 12px;
      border-left: 4px solid #2563eb;
      background: #eff6ff;
      color: #1e3a8a;
    }

    .error-box {
      margin-top: 16px;
      padding: 12px;
      border: 1px solid #fecaca;
      border-radius: 6px;
      background: #fef2f2;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <section class="panel">
    <h1>AI 生成任务</h1>
    <textarea class="prompt-input">请总结上传文档。</textarea>
    <div class="source-box">引用：项目需求说明.md</div>
    <div class="error-box">生成失败：文档内容为空。</div>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.panel` 使用浅灰边框建立卡片边界。

`.prompt-input` 使用边框表示可输入区域，用户能清楚看到文本框范围。

`.source-box` 使用左边框强调引用来源，这种写法比四边框更轻。

`.error-box` 使用红色边框和浅红背景表达错误状态。

`border-radius` 不是 border 的一部分，但常和 border 一起使用，让边界更柔和。

---

## 🌐 浏览器表现

页面会显示一个白色面板，里面有带边框的输入框、左侧强调线的引用块和红色错误提示。

在 DevTools 中可以单独修改 `border-width`、`border-style`、`border-color`，观察边框如何变化。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `border` | CSS 属性 | 边框缩写 | `border: 1px solid #e5e7eb;` |
| `border-width` | CSS 属性 | 边框宽度 | `border-width: 1px;` |
| `border-style` | CSS 属性 | 边框线型 | `border-style: solid;` |
| `border-color` | CSS 属性 | 边框颜色 | `border-color: #e5e7eb;` |
| `border-radius` | CSS 属性 | 圆角 | `border-radius: 8px;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 可见边框通常需要同时具备宽度、线型和颜色。
- 边框可以表达组件边界，也可以表达状态。
- 错误、选中、聚焦等状态可以通过边框增强反馈。

---

## ⚠️ 易错点

- 易错点1：只写 `border-color` 却看不到边框。正确写法：同时设置 `border-style` 或直接写 `border`。
- 易错点2：边框颜色太重导致界面杂乱。正确写法：默认边框使用浅灰，状态边框再使用强调色。
- 易错点3：用边框模拟间距。正确写法：边界用 border，间距用 margin、padding 或 gap。

---

## 💡 最佳实践

- 卡片默认边框建议使用低对比度颜色。
- 错误状态使用边框、背景、文字色共同表达，不只依赖颜色。
- 引用和提示块可以使用 `border-left` 做轻量强调。

---

## 🚀 AI 应用场景

AI 应用需要区分普通回答、引用来源、工具调用和错误提示。边框是建立信息层次的低成本方式。

```css
.citation {
  border-left: 4px solid #2563eb;
  padding-left: 12px;
}

.tool-error {
  border: 1px solid #fca5a5;
  background: #fef2f2;
}
```

---

## 📝 练习题

1. [基础题] 给 `.card` 设置 `1px solid` 浅灰边框。
2. [进阶题] 使用 `border-left` 设计一个引用块。
3. [AI 场景题] 为 AI 生成失败提示设计边框、背景和文字色。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| border | 元素边界线 |
| 三要素 | 宽度、线型、颜色 |
| 状态反馈 | 边框可表达错误、选中和聚焦 |
| AI 引用 | `border-left` 适合轻量强调来源 |

# display: inline-block 行内块（CSS-018）

## 🎯 本节学习目标

- 理解 `inline-block` 同时具备行内排列和块级尺寸控制。
- 掌握它适合按钮、标签、徽章等小型 UI 的原因。
- 能够用 `inline-block` 制作 AI 模型标签和状态徽章。

---

## 📖 什么是 display: inline-block

`display: inline-block` 表示元素像行内元素一样参与文本流排列，但内部又像块级元素一样可以设置宽度、高度、padding 和 margin。

它适合小型 UI 单元，例如按钮、标签、徽章、工具状态、引用编号。

在现代布局中，大型排列通常用 Flex 或 Grid；但对于文本中的小徽章，`inline-block` 仍然非常实用。

---

## 🧠 原理讲解

对比三种显示类型：

```text
block：独占一行，可设置宽高。
inline：不独占一行，宽高不按块级方式生效。
inline-block：不独占一行，但可设置宽高和盒模型。
```

示例：

```css
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
}
```

---

## 🏗 基本结构

```html
<style>
  .badge {
    display: inline-block;
    padding: 2px 8px;
    background: #e0f2fe;
  }
</style>

<span class="badge">AI</span>
```

---

## ✅ 完整代码

下面用 `inline-block` 创建模型标签和状态徽章：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>inline-block 示例</title>
  <style>
    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .model-card {
      max-width: 720px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
      line-height: 1.8;
    }

    .badge {
      display: inline-block;
      margin-right: 8px;
      padding: 2px 8px;
      border-radius: 999px;
      background: #e0f2fe;
      color: #075985;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.6;
    }

    .badge-success {
      background: #dcfce7;
      color: #166534;
    }

    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }
  </style>
</head>
<body>
  <article class="model-card">
    <p>
      <span class="badge">Claude Sonnet</span>
      <span class="badge badge-success">已连接</span>
      <span class="badge badge-warning">高上下文</span>
    </p>
    <p>这些徽章在同一行排列，但可以拥有稳定的 padding、圆角和背景。</p>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`.badge` 使用 `display: inline-block`，所以多个徽章可以排在同一行。

`padding`、`border-radius`、`line-height` 都能稳定生效，让徽章形成完整的小胶囊形状。

`.badge-success` 和 `.badge-warning` 是变体类，用来表达不同状态。

如果使用普通 inline，padding 也能部分显示，但尺寸控制不如 inline-block 稳定。

---

## 🌐 浏览器表现

三个状态徽章会横向排列在一行中，每个都有独立背景、圆角和内部留白。换行时它们会像文字一样自然流动。

在 DevTools 中切换 `.badge` 的 display 为 `inline`，可以观察尺寸控制的差异。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `inline-block` | display 值 | 行内排列，块级尺寸 | `display: inline-block;` |
| `padding` | CSS 属性 | 常用于徽章内部留白 | `padding: 2px 8px;` |
| `line-height` | CSS 属性 | 控制徽章高度 | `line-height: 1.6;` |
| `vertical-align` | CSS 属性 | 调整行内块垂直对齐 | `vertical-align: middle;` |
| `border-radius` | CSS 属性 | 制作圆角徽章 | `border-radius: 999px;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `inline-block` 不独占一行。
- `inline-block` 可以稳定设置宽高和 padding。
- 标签、徽章、小按钮很适合使用 `inline-block`。

---

## ⚠️ 易错点

- 易错点1：用 inline 做复杂徽章导致垂直尺寸不稳。正确写法：徽章优先用 inline-block。
- 易错点2：用 inline-block 做整页布局。正确写法：复杂布局使用 Flex 或 Grid。
- 易错点3：忽略行内块之间的空白字符。正确写法：需要精确间距时使用 flex 和 gap。

---

## 💡 最佳实践

- 状态徽章、模型标签、引用编号适合 inline-block。
- 多个小项需要复杂对齐时，父容器改用 Flex。
- inline-block 元素的内部高度应由 padding 和 line-height 共同控制。

---

## 🚀 AI 应用场景

AI 产品中常见模型标签、状态徽章、工具调用标记。它们需要在文本流中排列，又需要完整背景和圆角，适合使用 inline-block。

```css
.tool-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
}
```

---

## 📝 练习题

1. [基础题] 创建一个 `inline-block` 徽章。
2. [进阶题] 为徽章添加成功、警告两种状态变体。
3. [AI 场景题] 为“模型名”“联网中”“工具调用”设计三个 AI 状态徽章。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `inline-block` | 行内排列，块级尺寸控制 |
| 徽章 | 很适合用 inline-block 实现 |
| 尺寸 | padding 和 line-height 能稳定生效 |
| AI 状态 | 模型标签和工具状态可用徽章表达 |

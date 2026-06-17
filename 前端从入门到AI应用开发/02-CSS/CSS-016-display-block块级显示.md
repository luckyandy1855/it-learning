# display: block 块级显示（CSS-016）

## 🎯 本节学习目标

- 理解 `display: block` 的基本表现。
- 掌握块级元素独占一行、可设置宽高的特点。
- 能够用块级显示组织 AI 页面中的标题、卡片和表单区域。

---

## 📖 什么是 display: block

`display: block` 表示元素按块级盒子渲染。块级元素通常会独占一行，并在默认情况下尽可能占满父容器的可用宽度。

常见块级元素包括 `div`、`p`、`section`、`article`、`main`、`h1` 到 `h6`。

在 AI 应用中，页面主体、聊天面板、消息列表、设置区、表单区通常都适合用块级结构承载。

---

## 🧠 原理讲解

块级元素有几个关键特征：

```text
1. 默认从新的一行开始。
2. 默认宽度占满父容器。
3. 可以设置 width、height、margin、padding。
4. 适合承载结构化区域。
```

示例：

```css
.panel {
  display: block;
  width: 100%;
}
```

多数结构性 HTML 元素本来就是 block，因此很多时候不需要显式写 `display: block`。

---

## 🏗 基本结构

```html
<style>
  .card {
    display: block;
    padding: 20px;
    background: #ffffff;
  }
</style>

<section class="card">AI 设置面板</section>
```

---

## ✅ 完整代码

下面用块级元素组织一个 AI 工作台：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>display block 示例</title>
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

    .workspace {
      display: block;
      max-width: 760px;
      margin: 0 auto;
    }

    .panel {
      display: block;
      margin-bottom: 16px;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .panel-title {
      display: block;
      margin: 0 0 12px;
      font-size: 24px;
    }

    .message {
      display: block;
      margin: 0;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <main class="workspace">
    <section class="panel">
      <h1 class="panel-title">AI 工作台</h1>
      <p class="message">块级元素适合组织页面的大结构。</p>
    </section>
    <section class="panel">
      <h2 class="panel-title">生成结果</h2>
      <p class="message">每个面板独占一行，方便形成清晰阅读顺序。</p>
    </section>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

`.workspace` 是主工作区，作为块级容器承载多个面板。

`.panel` 使用 `display: block`，每个面板都会单独占据一行，并通过 `margin-bottom` 拉开间距。

`.panel-title` 和 `.message` 也是块级显示，标题和正文自然上下排列。

这里显式写 `display: block` 是为了教学说明，真实项目中很多标签默认就是 block。

---

## 🌐 浏览器表现

两个 AI 面板会垂直排列，每个面板占据父容器完整宽度。标题和正文上下分布，页面阅读顺序清晰。

在 DevTools 中查看 Computed，可以看到这些元素的 display 计算值是 `block`。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `display` | CSS 属性 | 控制元素显示类型 | `display: block;` |
| `block` | display 值 | 块级盒子 | `display: block;` |
| `width` | CSS 属性 | 块级元素可设置宽度 | `width: 100%;` |
| `margin` | CSS 属性 | 可控制外部间距 | `margin-bottom: 16px;` |
| `section` | HTML 元素 | 默认块级显示 | `<section>` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `block` 元素默认独占一行。
- 块级元素默认占满父容器宽度。
- 页面结构和大块内容区域优先用块级元素组织。

---

## ⚠️ 易错点

- 易错点1：给块级元素设置宽度后忘记居中。正确写法：设置 `max-width` 后配合 `margin: 0 auto`。
- 易错点2：把所有内容都塞进一行。正确写法：结构区域优先使用 block 形成清晰层次。
- 易错点3：以为所有元素默认都是 block。正确写法：不同 HTML 元素有不同默认 display。

---

## 💡 最佳实践

- 页面主体、卡片、表单、文章区优先用 block 结构。
- 不需要为了教学以外的目的给默认块级元素重复写 `display: block`。
- 块级布局复杂后，再考虑 Flex 或 Grid。

---

## 🚀 AI 应用场景

AI 应用通常有清晰的垂直结构：输入区、结果区、引用区、操作区。块级元素适合做这些区域的基础骨架。

```css
.prompt-panel,
.answer-panel,
.source-panel {
  display: block;
  margin-bottom: 16px;
  padding: 20px;
}
```

---

## 📝 练习题

1. [基础题] 创建两个 `section`，观察它们是否上下排列。
2. [进阶题] 给 `.panel` 设置 `max-width` 和 `margin: 0 auto`。
3. [AI 场景题] 用块级结构搭建“Prompt 输入区 + AI 回答区 + 引用区”。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `display: block` | 按块级盒子渲染 |
| 独占一行 | block 元素通常上下排列 |
| 宽度 | 默认占满父容器可用宽度 |
| AI 页面 | 适合组织主要内容区域 |

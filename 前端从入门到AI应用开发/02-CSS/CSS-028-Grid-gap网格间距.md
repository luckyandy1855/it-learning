# Grid gap 网格间距（CSS-028）

## 🎯 本节学习目标

- 掌握 `gap` 在 Grid 中控制行列间距。
- 理解 `row-gap` 和 `column-gap` 的适用场景。
- 能够为 AI 卡片墙和仪表盘设置稳定间距。

---

## 📖 什么是 Grid gap

`gap` 用来控制 Grid 网格项之间的间距。它不会给容器外侧增加空间，只影响网格项之间的空隙。

`gap` 可以同时设置行距和列距，也可以拆成 `row-gap` 与 `column-gap`。

在 AI 仪表盘中，指标卡片、模型卡片、Prompt 模板卡片之间的间距应统一管理，Grid gap 比给每张卡片写 margin 更干净。

---

## 🧠 原理讲解

统一行列间距：

```css
.grid {
  display: grid;
  gap: 16px;
}
```

分别设置行距和列距：

```css
.grid {
  row-gap: 20px;
  column-gap: 12px;
}
```

`gap` 属于容器属性，应写在 Grid 容器上，而不是写在每个子项上。

---

## 🏗 基本结构

```html
<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
</style>

<div class="cards">
  <article>模型 A</article>
  <article>模型 B</article>
  <article>模型 C</article>
</div>
```

---

## ✅ 完整代码

下面用 Grid gap 创建 AI 模型卡片墙：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Grid gap 示例</title>
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

    .model-section {
      max-width: 960px;
      margin: 0 auto;
    }

    .model-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 20px;
      column-gap: 16px;
    }

    .model-card {
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .model-card h2 {
      margin: 0 0 8px;
      font-size: 18px;
    }

    .model-card p {
      margin: 0;
      color: #4b5563;
      line-height: 1.7;
    }
  </style>
</head>
<body>
  <section class="model-section">
    <h1>AI 模型选择</h1>
    <div class="model-grid">
      <article class="model-card"><h2>Claude Sonnet</h2><p>适合写作、代码和复杂任务。</p></article>
      <article class="model-card"><h2>GPT 推理模型</h2><p>适合复杂推理和规划。</p></article>
      <article class="model-card"><h2>轻量模型</h2><p>适合快速分类和摘要。</p></article>
      <article class="model-card"><h2>Embedding</h2><p>适合知识库检索。</p></article>
      <article class="model-card"><h2>Vision</h2><p>适合图片理解。</p></article>
      <article class="model-card"><h2>TTS</h2><p>适合语音生成。</p></article>
    </div>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.model-grid` 开启 Grid，并定义三列。

`row-gap: 20px` 设置卡片行与行之间的距离。

`column-gap: 16px` 设置卡片列与列之间的距离。

`.model-card` 不需要写 margin，卡片之间的空间全部由父容器管理。

---

## 🌐 浏览器表现

模型卡片会排成三列两行。横向和纵向间距稳定一致，不会出现首尾 margin 难处理的问题。

在 DevTools 中修改 `row-gap` 和 `column-gap`，可以直观看到网格内部间距变化。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `gap` | CSS 属性 | 同时设置行列间距 | `gap: 16px;` |
| `row-gap` | CSS 属性 | 设置行间距 | `row-gap: 20px;` |
| `column-gap` | CSS 属性 | 设置列间距 | `column-gap: 16px;` |
| `grid-gap` | 旧写法 | 早期 Grid 间距属性 | 不推荐新项目使用 |
| `margin` | 对比属性 | 元素外部空间 | 子项间距不优先用它 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- Grid 子项之间的间距优先用 `gap`。
- `gap` 写在 Grid 容器上。
- `row-gap` 和 `column-gap` 可以分别控制行距和列距。

---

## ⚠️ 易错点

- 易错点1：给每个 Grid 子项写 margin。正确写法：父容器统一用 `gap`。
- 易错点2：以为 gap 会给容器外边缘加空白。正确写法：gap 只影响子项之间。
- 易错点3：行距列距混乱。正确写法：需要差异时拆成 `row-gap` 和 `column-gap`。

---

## 💡 最佳实践

- 卡片墙默认使用 `gap: 16px` 或 `24px` 建立统一节奏。
- 列距和行距不同的列表，用 `row-gap`、`column-gap` 明确表达。
- 子项组件尽量不依赖外部 margin，提升复用性。

---

## 🚀 AI 应用场景

AI 模型市场、Prompt 模板库、知识库文件列表都需要大量重复卡片。Grid gap 能保证这些卡片排列稳定。

```css
.prompt-template-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

---

## 📝 练习题

1. [基础题] 给三列 Grid 设置 `gap: 16px`。
2. [进阶题] 分别设置行距 24px、列距 12px。
3. [AI 场景题] 创建一个 AI 模型卡片墙，使用 Grid gap 管理所有间距。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `gap` | 控制网格项之间的间距 |
| `row-gap` | 控制行间距 |
| `column-gap` | 控制列间距 |
| AI 卡片墙 | Grid gap 比子项 margin 更稳定 |

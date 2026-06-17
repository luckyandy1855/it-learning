# position: sticky 粘性定位（CSS-034）

## 🎯 本节学习目标

- 理解 `position: sticky` 在滚动过程中的粘性表现。
- 掌握 sticky 必须配合 `top`、`bottom` 等偏移值使用。
- 能够为 AI 文档页、目录和工具栏实现滚动粘附效果。

---

## 📖 什么是 position: sticky

`position: sticky` 表示粘性定位。元素在正常文档流中占据位置，当滚动到指定阈值后，会像 fixed 一样粘在视口某个位置。

它介于 relative 和 fixed 之间：未触发时像普通元素，触发后在滚动容器内固定。

在 AI 应用中，长文档目录、Prompt 参数栏、结果筛选工具栏、右侧引用面板，都可以使用 sticky 提升阅读和操作效率。

---

## 🧠 原理讲解

基础写法：

```css
.toolbar {
  position: sticky;
  top: 16px;
}
```

`top: 16px` 是触发粘附的位置。没有 `top`、`bottom`、`left` 或 `right` 这类偏移值，sticky 通常不会产生预期效果。

sticky 的表现还受父容器和滚动容器影响。如果祖先容器设置了不合适的 overflow，可能导致 sticky 失效。

---

## 🏗 基本结构

```html
<style>
  .side-tools {
    position: sticky;
    top: 24px;
  }
</style>

<aside class="side-tools">目录和工具</aside>
```

---

## ✅ 完整代码

下面实现一个 AI 长文页右侧粘性工具栏：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>position sticky 示例</title>
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

    .reader-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 260px;
      gap: 24px;
      max-width: 1080px;
      margin: 0 auto;
    }

    .article {
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
      line-height: 1.8;
    }

    .article p {
      margin: 0 0 20px;
    }

    .side-tools {
      position: sticky;
      top: 24px;
      align-self: start;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .side-tools button {
      display: block;
      width: 100%;
      margin-top: 8px;
      padding: 8px 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #ffffff;
      font: inherit;
    }
  </style>
</head>
<body>
  <main class="reader-layout">
    <article class="article">
      <h1>AI 生成的长文分析</h1>
      <p>这是一段长文内容，用来模拟阅读场景。</p>
      <p>用户在阅读长回答时，常常需要随时复制、总结、追问或定位引用来源。</p>
      <p>粘性工具栏可以在滚动时保持可见，但不会完全脱离页面结构。</p>
      <p>继续添加内容，让页面具备滚动空间。</p>
      <p>sticky 在长文阅读、文档目录和筛选栏中都很有价值。</p>
      <p>相比 fixed，sticky 的作用范围更受父容器约束，更适合局部工具栏。</p>
    </article>

    <aside class="side-tools">
      <strong>AI 工具</strong>
      <button>总结本节</button>
      <button>提取行动项</button>
      <button>复制引用</button>
    </aside>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

`.reader-layout` 使用 Grid 创建正文和右侧工具栏两列。

`.side-tools { position: sticky; top: 24px; }` 让工具栏滚动到距离视口顶部 24px 时开始粘住。

`align-self: start` 避免 Grid 子项被拉伸高度，保证 sticky 表现更可控。

工具栏仍然占据原本布局位置，不像 fixed 那样完全脱离页面结构。

---

## 🌐 浏览器表现

页面滚动时，右侧 AI 工具栏会在接近顶部后保持可见。正文继续滚动，工具栏在其父布局范围内粘附。

如果把 `top: 24px` 删除，sticky 通常不会按预期粘住。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `sticky` | position 值 | 粘性定位 | `position: sticky;` |
| `top` | CSS 属性 | 粘附触发距离 | `top: 24px;` |
| `align-self` | CSS 属性 | 控制 Grid/Flex 子项自身对齐 | `align-self: start;` |
| `overflow` | CSS 属性 | 可能影响 sticky 的滚动容器 | `overflow: auto;` |
| 滚动容器 | 布局概念 | sticky 生效的范围 | 最近滚动祖先 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- sticky 必须配合偏移值使用，例如 `top`。
- sticky 未触发时仍在文档流中。
- sticky 常用于目录、筛选栏和局部工具栏。

---

## ⚠️ 易错点

- 易错点1：只写 `position: sticky` 不写 `top`。正确写法：至少指定一个粘附偏移值。
- 易错点2：sticky 在 Grid 中被拉伸导致效果异常。正确写法：可加 `align-self: start`。
- 易错点3：祖先 overflow 设置导致 sticky 失效。正确写法：检查滚动容器和 overflow。

---

## 💡 最佳实践

- 长文目录、右侧工具栏、顶部筛选条适合 sticky。
- 全局永久悬浮用 fixed，局部滚动粘附用 sticky。
- sticky 元素不要太高，避免小屏幕遮挡内容。

---

## 🚀 AI 应用场景

AI 长文阅读页可以把“总结本节、继续追问、复制引用”放在 sticky 工具栏里，让用户滚动阅读时仍能快速操作。

```css
.ai-side-actions {
  position: sticky;
  top: 24px;
  align-self: start;
}
```

---

## 📝 练习题

1. [基础题] 创建一个 `position: sticky; top: 0;` 的顶部工具栏。
2. [进阶题] 在 Grid 右侧栏中使用 sticky，并加 `align-self: start`。
3. [AI 场景题] 为 AI 长文回答页设计一个右侧粘性操作栏。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `sticky` | 滚动到阈值后粘住 |
| `top` | 定义粘附触发位置 |
| 文档流 | sticky 仍保留原布局位置 |
| AI 长文 | 目录和工具栏适合 sticky |

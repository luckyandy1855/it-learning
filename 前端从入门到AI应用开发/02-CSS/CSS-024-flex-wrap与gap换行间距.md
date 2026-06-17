# flex-wrap 与 gap 换行间距（CSS-024）

## 🎯 本节学习目标

- 掌握 `flex-wrap` 控制 Flex 子项是否换行。
- 掌握 `gap`、`row-gap`、`column-gap` 控制子项间距。
- 能够用 Flexbox 实现可换行的 AI 标签和模型选项列表。

---

## 📖 什么是 flex-wrap 与 gap

默认情况下，Flex 容器中的子项会尽量排在一行，即使空间不足也可能压缩或溢出。

`flex-wrap` 可以允许子项换行。`gap` 用来设置子项之间的行距和列距。

在 AI 应用中，标签列表、模型列表、Prompt 模板按钮、快捷操作按钮都可能数量不固定，使用 `flex-wrap` 和 `gap` 可以让它们自然换行。

---

## 🧠 原理讲解

基础写法：

```css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

常见值：

```css
flex-wrap: nowrap; /* 默认，不换行 */
flex-wrap: wrap;   /* 空间不足时换行 */
```

`gap` 同时控制行和列的间距，也可以拆成 `row-gap` 和 `column-gap`。

---

## 🏗 基本结构

```html
<style>
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
</style>

<div class="tag-list">
  <span>总结</span>
  <span>翻译</span>
  <span>改写</span>
</div>
```

---

## ✅ 完整代码

下面实现一个可换行的 AI Prompt 标签列表：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>flex-wrap 与 gap 示例</title>
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

    .prompt-panel {
      max-width: 760px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }

    .tag {
      padding: 6px 10px;
      border: 1px solid #d1d5db;
      border-radius: 999px;
      background: #ffffff;
      color: #374151;
      font-size: 14px;
    }

    .tag.is-active {
      border-color: #2563eb;
      background: #eff6ff;
      color: #1e3a8a;
    }
  </style>
</head>
<body>
  <section class="prompt-panel">
    <h1>Prompt 模板</h1>
    <p>选择一个常用任务，快速填充输入框。</p>
    <div class="tag-list">
      <span class="tag is-active">文章总结</span>
      <span class="tag">会议纪要</span>
      <span class="tag">标题生成</span>
      <span class="tag">中英翻译</span>
      <span class="tag">代码解释</span>
      <span class="tag">小红书文案</span>
      <span class="tag">知识卡片</span>
      <span class="tag">邮件润色</span>
    </div>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.tag-list` 设置 `display: flex`，让标签按 Flex 规则排列。

`flex-wrap: wrap` 允许标签在空间不足时自动换到下一行。

`gap: 8px` 同时设置标签之间的横向和纵向间距。

`.tag` 定义单个标签的视觉样式，`.tag.is-active` 表示当前选中状态。

---

## 🌐 浏览器表现

标签会从左到右排列。窗口变窄时，标签会自然换行，不会挤压到难以阅读，也不会横向溢出。

在 DevTools 中关闭 `flex-wrap: wrap`，可以观察标签如何被压缩或溢出。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `flex-wrap` | CSS 属性 | 控制是否换行 | `flex-wrap: wrap;` |
| `nowrap` | CSS 值 | 不换行 | 默认值 |
| `wrap` | CSS 值 | 允许换行 | 标签列表 |
| `gap` | CSS 属性 | 行列间距 | `gap: 8px;` |
| `row-gap` | CSS 属性 | 行间距 | `row-gap: 12px;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- Flex 默认不换行。
- `flex-wrap: wrap` 适合数量不固定的小项列表。
- `gap` 比给每个子项写 margin 更稳定。

---

## ⚠️ 易错点

- 易错点1：标签多了以后横向溢出。正确写法：父容器使用 `flex-wrap: wrap`。
- 易错点2：用 margin 做间距导致首尾难处理。正确写法：Flex 容器使用 `gap`。
- 易错点3：以为 `gap` 只适用于 Grid。正确写法：现代浏览器中 Flex 也支持 `gap`。

---

## 💡 最佳实践

- 标签、按钮组、筛选条件适合 `flex-wrap: wrap`。
- 间距优先用 `gap`，减少子项样式负担。
- 如果需要严格二维对齐，再考虑 Grid。

---

## 🚀 AI 应用场景

Prompt 模板、模型能力标签、知识库标签数量经常变化。使用 Flex wrap 能保证内容在不同屏幕上自然流动。

```css
.prompt-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

---

## 📝 练习题

1. [基础题] 创建一个可换行标签列表。
2. [进阶题] 分别设置 `row-gap` 和 `column-gap`。
3. [AI 场景题] 为 Prompt 模板按钮设计一个移动端不溢出的标签区。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `flex-wrap` | 控制 Flex 子项是否换行 |
| `wrap` | 空间不足时换到下一行 |
| `gap` | 控制子项之间的统一间距 |
| AI 标签 | Prompt 模板和模型标签适合 wrap 布局 |

# CSS-in-JS 对比（CSS-050）

## 🎯 本节学习目标

- 理解 CSS-in-JS 的基本概念。
- 掌握原生 CSS、CSS Modules、Tailwind、CSS-in-JS 的大致边界。
- 能够为 AI 前端项目选择合适的样式方案。

---

## 📖 什么是 CSS-in-JS

CSS-in-JS 是一种把样式写在 JavaScript 或 TypeScript 代码中的方案。常见库包括 styled-components、Emotion、Stitches 等。

它的核心价值是让样式和组件逻辑更紧密，支持基于 props 的动态样式、主题注入和组件封装。

但 CSS-in-JS 不是所有项目的默认答案。它可能带来运行时成本、构建复杂度和团队约定成本。

---

## 🧠 原理讲解

传统 CSS：

```css
.button {
  background: var(--color-primary);
}
```

CSS-in-JS 的概念写法：

```js
const Button = styled.button`
  background: var(--color-primary);
`;
```

两者目标都是为元素应用样式。区别在于样式组织位置、运行机制、主题传递方式和团队维护习惯。

---

## 🏗 基本结构

```html
<style>
  .ai-button {
    background: var(--color-primary);
  }
</style>

<button class="ai-button">生成</button>
```

```js
// CSS-in-JS 概念示例
const AiButton = styled.button`
  background: var(--color-primary);
`;
```

---

## ✅ 完整代码

下面用原生 CSS 实现一个足够清晰的 AI 组件样式：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CSS-in-JS 对比示例</title>
  <style>
    :root {
      --color-primary: #2563eb;
      --color-surface: #ffffff;
      --color-border: #e5e7eb;
      --color-text: #111827;
    }

    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: var(--color-text);
    }

    .ai-widget {
      max-width: 680px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: var(--color-surface);
    }

    .ai-widget__actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    .ai-button {
      padding: 10px 16px;
      border: 0;
      border-radius: 6px;
      background: var(--color-primary);
      color: #ffffff;
      font: inherit;
    }
  </style>
</head>
<body>
  <section class="ai-widget">
    <h1>AI 生成组件</h1>
    <p>这个组件用原生 CSS 变量和类名即可完成清晰样式组织。</p>
    <div class="ai-widget__actions">
      <button class="ai-button">生成</button>
      <button class="ai-button">重试</button>
    </div>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`:root` 定义主题变量，说明原生 CSS 也可以支持主题基础能力。

`.ai-widget` 使用稳定类名表达组件边界。

`.ai-widget__actions` 表达组件内部操作区，避免选择器过深。

`.ai-button` 是可复用按钮类，适合在非 React 或轻量项目中直接使用。

---

## 🌐 浏览器表现

页面显示一个 AI 生成组件，包含标题、说明和两个按钮。它没有依赖任何 JS 样式库，也能保持清晰结构。

如果项目进入 React 组件化阶段，可以再评估 CSS Modules、Tailwind 或 CSS-in-JS。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| 原生 CSS | 样式方案 | 独立 CSS 文件或 style 标签 | `.button` |
| CSS Modules | 构建方案 | 局部作用域类名 | `Button.module.css` |
| Tailwind CSS | 工具类方案 | 用原子类组合样式 | `class="flex gap-2"` |
| CSS-in-JS | 样式方案 | 在 JS 中声明样式 | `styled.button` |
| 主题变量 | CSS 能力 | 跨方案复用主题 | `var(--color-primary)` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- CSS-in-JS 是一种方案，不是必须使用的标准。
- 原生 CSS 变量已经能解决很多主题问题。
- 样式方案选择应基于项目复杂度、团队习惯和运行成本。

---

## ⚠️ 易错点

- 易错点1：学习 CSS 还没扎实就直接跳 CSS-in-JS。正确写法：先掌握 CSS 基础和布局模型。
- 易错点2：为了动态样式引入重型方案。正确写法：简单状态用类名和 CSS 变量即可。
- 易错点3：团队内多套方案混用。正确写法：项目级统一样式策略。

---

## 💡 最佳实践

- 文档型、静态站、轻量工具优先原生 CSS 或 Tailwind。
- React 中小项目可用 CSS Modules 或 Tailwind。
- 复杂组件库和强动态主题场景再考虑 CSS-in-JS。

---

## 🚀 AI 应用场景

AI 应用原型阶段通常变化快，原生 CSS 变量加清晰类名已经足够。等到组件库、主题系统和多租户需求明确后，再评估 CSS-in-JS。

```css
.message[data-role="assistant"] {
  background: var(--assistant-bg);
}
```

这种写法无需 CSS-in-JS，也能表达动态角色样式。

---

## 📝 练习题

1. [基础题] 用原生 CSS 类名实现一个 AI 按钮。
2. [进阶题] 比较原生 CSS、Tailwind、CSS-in-JS 各自适合的场景。
3. [AI 场景题] 为一个 React AI 聊天项目选择样式方案，并说明理由。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| CSS-in-JS | 把样式写在 JS/TS 中的方案 |
| 原生 CSS | 仍然是必须掌握的基础 |
| 主题变量 | 可跨多种样式方案复用 |
| 方案选择 | 根据复杂度和团队维护成本决定 |

# transition 过渡动画（CSS-041）

## 🎯 本节学习目标

- 掌握 `transition` 的基本写法。
- 理解过渡动画适合处理状态变化，而不是持续运动。
- 能够为 AI 按钮、卡片和输入框添加克制的交互反馈。

---

## 📖 什么是 transition

`transition` 用来让 CSS 属性从一个状态平滑过渡到另一个状态。它通常配合 `:hover`、`:focus`、`.is-active` 这类状态使用。

没有 transition 时，按钮颜色、边框、阴影会瞬间变化；加上 transition 后，变化更柔和，用户更容易感知交互反馈。

在 AI 应用中，过渡动画适合用于按钮悬停、模型卡片选中、输入框聚焦、错误状态出现等轻量反馈。

---

## 🧠 原理讲解

基础写法：

```css
.button {
  transition: background-color 180ms ease, transform 180ms ease;
}

.button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}
```

`transition` 写在元素默认状态上，浏览器会在属性值变化时自动执行过渡。

常见组成部分包括：要过渡的属性、持续时间、缓动函数、延迟时间。

---

## 🏗 基本结构

```html
<style>
  .send-button {
    background: #2563eb;
    transition: background-color 180ms ease;
  }

  .send-button:hover {
    background: #1d4ed8;
  }
</style>

<button class="send-button">发送</button>
```

---

## ✅ 完整代码

下面为 AI 生成按钮和模型卡片添加过渡反馈：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>transition 示例</title>
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

    .model-card {
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
      transition: border-color 180ms ease, background-color 180ms ease, transform 180ms ease;
    }

    .model-card:hover {
      border-color: #2563eb;
      background: #eff6ff;
      transform: translateY(-1px);
    }

    .send-button {
      margin-top: 16px;
      padding: 10px 16px;
      border: 0;
      border-radius: 6px;
      background: #2563eb;
      color: #ffffff;
      font: inherit;
      transition: background-color 180ms ease, transform 180ms ease;
    }

    .send-button:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <section class="panel">
    <article class="model-card">
      <h1>Claude Sonnet</h1>
      <p>悬停时卡片边框和背景会平滑变化。</p>
    </article>
    <button class="send-button">发送 Prompt</button>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.model-card` 在默认状态写 `transition`，声明哪些属性需要平滑变化。

`.model-card:hover` 改变边框、背景和位移，浏览器自动执行过渡。

`.send-button` 也在默认状态声明 transition，确保鼠标移入和移出都平滑。

`180ms ease` 是常见的短交互反馈时长，不会拖慢用户操作。

---

## 🌐 浏览器表现

鼠标悬停在模型卡片和按钮上时，颜色和位置会轻微平滑变化。移开鼠标后，状态也会平滑恢复。

在 DevTools 中可以临时关闭 transition，对比瞬间变化和过渡变化的体验差异。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `transition` | CSS 属性 | 过渡动画缩写 | `transition: color 200ms ease;` |
| `transition-property` | CSS 属性 | 指定过渡属性 | `background-color` |
| `transition-duration` | CSS 属性 | 过渡时长 | `180ms` |
| `transition-timing-function` | CSS 属性 | 缓动函数 | `ease` |
| `transition-delay` | CSS 属性 | 延迟执行 | `100ms` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `transition` 适合状态变化，不适合持续循环动画。
- transition 通常写在默认状态上。
- 不要过渡所有属性，优先指定明确属性。

---

## ⚠️ 易错点

- 易错点1：把 `transition` 只写在 `:hover` 上。正确写法：写在默认状态，移入移出都平滑。
- 易错点2：使用 `transition: all`。正确写法：明确指定需要过渡的属性。
- 易错点3：过渡时间过长。正确写法：交互反馈通常控制在 150ms 到 250ms。

---

## 💡 最佳实践

- 按钮、链接、卡片 hover 使用短过渡。
- 优先过渡 `color`、`background-color`、`border-color`、`opacity`、`transform`。
- 避免过渡会频繁触发布局计算的属性，例如宽高和位置。

---

## 🚀 AI 应用场景

AI 界面需要让用户感知“可点击、已选中、正在聚焦”。transition 可以让这些状态反馈更自然。

```css
.model-option {
  transition: border-color 180ms ease, background-color 180ms ease;
}

.model-option:hover,
.model-option.is-selected {
  border-color: #2563eb;
  background: #eff6ff;
}
```

---

## 📝 练习题

1. [基础题] 给按钮 hover 背景色添加 transition。
2. [进阶题] 给模型卡片添加边框和位移过渡。
3. [AI 场景题] 为 AI 模型选择项设计 hover 和 selected 的平滑状态反馈。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| transition | 让属性变化平滑过渡 |
| 默认状态 | transition 通常写在默认类上 |
| 适用场景 | hover、focus、selected 等状态变化 |
| AI 交互 | 用于按钮、卡片和输入框反馈 |

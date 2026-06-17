# rem 相对单位（CSS-037）

## 🎯 本节学习目标

- 理解 `rem` 相对于根元素字号计算。
- 掌握 `rem` 在字号、间距和组件尺寸中的使用方式。
- 能够用 `rem` 建立更稳定的 AI 界面尺寸体系。

---

## 📖 什么是 rem

`rem` 是 CSS 中的相对长度单位，全称 root em。它相对于根元素 `<html>` 的 `font-size` 计算。

如果浏览器默认根字号是 16px，那么 `1rem` 通常等于 16px，`1.5rem` 等于 24px。

使用 `rem` 可以让字号和间距跟随用户浏览器设置变化，对可访问性更友好，也更适合建立统一设计尺度。

---

## 🧠 原理讲解

基础换算：

```css
html {
  font-size: 16px;
}

.title {
  font-size: 2rem; /* 32px */
}
```

不建议为了计算方便把根字号强行改成 10px，因为这可能干扰用户默认字号偏好。

在项目里，可以用 `rem` 表示字号、padding、gap、border-radius 等可随根字号缩放的尺寸。

---

## 🏗 基本结构

```html
<style>
  .card {
    padding: 1.5rem;
  }

  .card h1 {
    font-size: 1.5rem;
  }
</style>
```

---

## ✅ 完整代码

下面用 `rem` 定义 AI 卡片尺寸：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>rem 示例</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 2rem;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .answer-card {
      max-width: 44rem;
      margin: 0 auto;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background: #ffffff;
    }

    .answer-card h1 {
      margin: 0 0 1rem;
      font-size: 1.75rem;
      line-height: 1.3;
    }

    .answer-card p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.8;
    }

    .meta {
      margin-top: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <article class="answer-card">
    <h1>AI 回答摘要</h1>
    <p>使用 rem 可以让字号和间距基于根字号缩放，更适合长期维护。</p>
    <p class="meta">模型：Claude Sonnet · 生成耗时：1.4s</p>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`body { padding: 2rem; }` 使用根字号的两倍作为页面边距。

`.answer-card { max-width: 44rem; }` 用相对单位控制阅读宽度。

`padding: 1.5rem` 和 `border-radius: 0.5rem` 让组件尺寸跟随根字号体系。

`.meta { font-size: 0.875rem; }` 表示辅助信息比正文略小。

---

## 🌐 浏览器表现

页面显示一张居中的 AI 回答卡片。若用户在浏览器中调大默认字号，使用 rem 的字号和间距会相应放大。

在 DevTools 中修改 `html` 的 `font-size`，可以观察所有 rem 尺寸同步变化。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `rem` | CSS 单位 | 相对根元素字号 | `1rem` |
| `font-size` | CSS 属性 | 设置字号 | `font-size: 1rem;` |
| `padding` | CSS 属性 | 可使用 rem | `padding: 1.5rem;` |
| `gap` | CSS 属性 | 可使用 rem | `gap: 1rem;` |
| 根元素 | HTML 概念 | `<html>` 元素 | `html { font-size: 16px; }` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `rem` 相对于根元素字号。
- `rem` 适合字号、间距和组件尺寸体系。
- 不要为了计算方便破坏用户字号偏好。

---

## ⚠️ 易错点

- 易错点1：把 `rem` 和 `em` 混为一谈。正确写法：rem 看根元素，em 看当前或父级字体上下文。
- 易错点2：所有尺寸都机械使用 rem。正确写法：边框 1px 这类物理细线仍常用 px。
- 易错点3：根字号随意改动。正确写法：除非有明确设计系统，否则尊重浏览器默认字号。

---

## 💡 最佳实践

- 字号优先使用 rem。
- 组件 padding、gap、圆角可以使用 rem 建立统一节奏。
- 细边框、阴影偏移等细节仍可使用 px。

---

## 🚀 AI 应用场景

AI 输出通常是长文本，用户可能需要调大字号阅读。rem 能让界面随用户设置更自然缩放。

```css
.ai-output {
  font-size: 1rem;
  line-height: 1.8;
  padding: 1.5rem;
}

.ai-output h2 {
  font-size: 1.375rem;
}
```

---

## 📝 练习题

1. [基础题] 把一个标题字号设置为 `1.5rem`。
2. [进阶题] 用 rem 设置卡片 padding、gap 和圆角。
3. [AI 场景题] 为 AI 长回答区域设计一套基于 rem 的阅读样式。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `rem` | 相对根元素字号的单位 |
| 可访问性 | 能更好跟随用户字号设置 |
| 设计尺度 | 适合统一字号和间距 |
| AI 阅读 | 长文本界面适合使用 rem |

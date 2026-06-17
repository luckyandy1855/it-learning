# position: relative 相对定位（CSS-031）

## 🎯 本节学习目标

- 理解 `position: relative` 的定位方式。
- 掌握相对定位不脱离文档流的特点。
- 能够用相对定位为 AI 卡片中的角标、提示和绝对定位子元素建立参照物。

---

## 📖 什么是 position: relative

`position: relative` 表示相对定位。元素仍然保留原本在文档流中的位置，但可以通过 `top`、`right`、`bottom`、`left` 相对自身原位置偏移。

更常见的用途不是移动自己，而是作为 `position: absolute` 子元素的定位参照物。

在 AI 应用中，模型卡片右上角的“推荐”角标、消息气泡旁的小状态点、卡片内部浮动按钮，经常需要父元素设置 `position: relative`。

---

## 🧠 原理讲解

相对定位示例：

```css
.card {
  position: relative;
}
```

如果只写 `position: relative`，元素视觉位置不会变化，但它会成为内部绝对定位元素的 containing block。

```css
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
}
```

这时 `.badge` 会相对最近的已定位祖先 `.card` 定位。

---

## 🏗 基本结构

```html
<style>
  .card {
    position: relative;
  }

  .badge {
    position: absolute;
    top: 12px;
    right: 12px;
  }
</style>

<article class="card">
  <span class="badge">推荐</span>
</article>
```

---

## ✅ 完整代码

下面用相对定位为 AI 模型卡片放置角标：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>position relative 示例</title>
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

    .model-card {
      position: relative;
      max-width: 640px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .badge {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 4px 8px;
      border-radius: 999px;
      background: #dcfce7;
      color: #166534;
      font-size: 13px;
      font-weight: 700;
    }

    .model-card h1 {
      margin: 0 0 12px;
      padding-right: 88px;
      font-size: 24px;
    }

    .model-card p {
      margin: 0;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <article class="model-card">
    <span class="badge">推荐</span>
    <h1>Claude Sonnet</h1>
    <p>适合长文写作、代码解释、复杂任务规划和 AI 应用原型设计。</p>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`.model-card { position: relative; }` 让卡片成为角标的定位参照物。

`.badge { position: absolute; }` 让角标脱离普通文档流，并定位到卡片右上角。

`top: 16px` 和 `right: 16px` 表示角标距离卡片顶部和右侧各 16px。

标题设置 `padding-right: 88px`，避免文字和右上角角标重叠。

---

## 🌐 浏览器表现

页面显示一张 AI 模型卡片，右上角有“推荐”角标。卡片本身仍然正常占据页面空间。

在 DevTools 中取消 `.model-card` 的 `position: relative`，角标可能会改为相对页面或其他祖先定位，这是定位参照物变化的直观体现。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `position` | CSS 属性 | 设置定位方式 | `position: relative;` |
| `relative` | CSS 值 | 相对定位 | `position: relative;` |
| `top` | CSS 属性 | 距顶部偏移 | `top: 16px;` |
| `right` | CSS 属性 | 距右侧偏移 | `right: 16px;` |
| containing block | 布局概念 | 绝对定位子元素的参照区域 | 已定位祖先 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `relative` 不会让元素脱离文档流。
- 只写 `position: relative` 不会改变元素位置。
- 它常用于给内部 `absolute` 元素提供定位参照物。

---

## ⚠️ 易错点

- 易错点1：忘记给父容器写 `position: relative`，导致子元素定位到页面角落。正确写法：绝对定位子元素的父容器通常要设 relative。
- 易错点2：用 relative 大量移动元素修布局。正确写法：布局问题优先用 Flex/Grid/margin 解决。
- 易错点3：角标和标题重叠。正确写法：为正文预留空间或调整角标位置。

---

## 💡 最佳实践

- 卡片内部需要角标、状态点、浮层时，父卡片先设 `position: relative`。
- 相对定位主要用于建立定位上下文，不要滥用偏移修补布局。
- 定位元素附近的文字要预留空间，避免覆盖。

---

## 🚀 AI 应用场景

AI 模型卡片经常需要展示“推荐”“高成本”“Beta”“联网中”等角标。父卡片使用 relative，角标使用 absolute，是最常见组合。

```css
.model-card {
  position: relative;
}

.model-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}
```

---

## 📝 练习题

1. [基础题] 给一个卡片设置 `position: relative`。
2. [进阶题] 在卡片右上角放置一个绝对定位角标。
3. [AI 场景题] 为 AI 模型卡片设计“推荐”状态角标，并避免和标题重叠。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `relative` | 相对定位，不脱离文档流 |
| 定位参照物 | relative 常作为 absolute 子元素参照 |
| 偏移属性 | top/right/bottom/left 可移动元素 |
| AI 角标 | 模型卡片状态标记常用 relative + absolute |

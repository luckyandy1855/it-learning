# clamp 动态范围（CSS-039）

## 🎯 本节学习目标

- 掌握 `clamp()` 的最小值、理想值、最大值写法。
- 理解 `clamp()` 如何实现平滑响应式字号和间距。
- 能够为 AI 长文页面设置稳定的动态标题和容器间距。

---

## 📖 什么是 clamp()

`clamp()` 是 CSS 函数，用来把一个值限制在最小值和最大值之间。

它的格式是：

```css
clamp(最小值, 理想值, 最大值)
```

常见用途是响应式字号：小屏不低于某个字号，大屏不超过某个字号，中间随视口平滑变化。

---

## 🧠 原理讲解

示例：

```css
h1 {
  font-size: clamp(1.75rem, 4vw, 3rem);
}
```

含义：

```text
最小字号：1.75rem
理想字号：4vw
最大字号：3rem
```

浏览器会计算 `4vw`，但最终结果不会小于 `1.75rem`，也不会大于 `3rem`。

---

## 🏗 基本结构

```html
<style>
  .title {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
  }
</style>

<h1 class="title">AI 应用开发</h1>
```

---

## ✅ 完整代码

下面用 `clamp()` 设置 AI 长文页面的标题和间距：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>clamp 示例</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: clamp(1rem, 4vw, 2.5rem);
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .article {
      max-width: 48rem;
      margin: 0 auto;
      padding: clamp(1rem, 3vw, 2rem);
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .article h1 {
      margin: 0 0 1rem;
      font-size: clamp(1.75rem, 4vw, 3rem);
      line-height: 1.2;
    }

    .article p {
      margin: 0;
      font-size: clamp(1rem, 1.2vw, 1.125rem);
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <article class="article">
    <h1>AI 生成内容阅读体验</h1>
    <p>clamp 可以让标题和间距在不同屏幕宽度下平滑变化，同时保留最小和最大边界。</p>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`body` 的 padding 使用 `clamp(1rem, 4vw, 2.5rem)`，小屏不会太挤，大屏不会太空。

`.article` 的 padding 同样使用动态范围，让卡片内部留白自然变化。

`h1` 的字号在 `1.75rem` 到 `3rem` 之间随视口变化。

正文也使用较小范围的 clamp，避免极端屏幕下字号过大或过小。

---

## 🌐 浏览器表现

随着浏览器宽度变化，标题和间距会平滑缩放，不需要多个媒体查询断点。

在 DevTools 中调整视口宽度，可以看到 computed font-size 持续变化，但不会突破最小和最大值。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `clamp()` | CSS 函数 | 限制动态值范围 | `clamp(1rem, 2vw, 2rem)` |
| `min()` | CSS 函数 | 取最小值 | `min(90vw, 720px)` |
| `max()` | CSS 函数 | 取最大值 | `max(16px, 1rem)` |
| `vw` | CSS 单位 | 常作为理想值 | `4vw` |
| `rem` | CSS 单位 | 常作为边界值 | `1.5rem` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `clamp()` 三个参数分别是最小值、理想值、最大值。
- 它适合响应式字号、间距和容器尺寸。
- `clamp()` 可以减少一部分媒体查询。

---

## ⚠️ 易错点

- 易错点1：三个参数顺序写反。正确写法：`clamp(min, preferred, max)`。
- 易错点2：理想值只写固定值。正确写法：理想值通常使用 `vw` 或计算表达式。
- 易错点3：完全用 clamp 取代媒体查询。正确写法：布局结构变化仍需要媒体查询或容器查询。

---

## 💡 最佳实践

- 标题字号适合 `rem + vw + rem` 的 clamp 组合。
- 页面 padding 可以使用 clamp，在小屏和大屏之间平滑变化。
- 结构性布局变化仍然用媒体查询或容器查询处理。

---

## 🚀 AI 应用场景

AI 生成长文、报告和知识库文章需要在手机和桌面上都保持阅读舒适。`clamp()` 可以让标题和正文节奏自然变化。

```css
.ai-report-title {
  font-size: clamp(1.75rem, 4vw, 3rem);
}

.ai-report {
  padding: clamp(1rem, 3vw, 2rem);
}
```

---

## 📝 练习题

1. [基础题] 使用 `clamp()` 设置一个标题字号。
2. [进阶题] 用 `clamp()` 设置页面 padding。
3. [AI 场景题] 为 AI 报告页设计响应式标题和正文容器间距。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `clamp()` | 把动态值限制在范围内 |
| 最小值 | 防止小屏过小 |
| 最大值 | 防止大屏过大 |
| AI 长文 | 标题和间距适合用 clamp 平滑响应 |

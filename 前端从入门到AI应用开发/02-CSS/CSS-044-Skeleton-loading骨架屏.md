# Skeleton loading 骨架屏（CSS-044）

## 🎯 本节学习目标

- 理解 Skeleton loading 用于占位和降低等待焦虑。
- 掌握用 CSS 渐变和关键帧实现骨架屏。
- 能够为 AI 生成结果和知识库检索设计骨架加载状态。

---

## 📖 什么是 Skeleton loading

Skeleton loading，中文常叫骨架屏，是在真实内容加载前展示的结构占位。

它比单纯的“加载中...”更具体，因为用户能提前看到内容大概结构，例如标题、段落、卡片、列表。

在 AI 应用中，知识库检索、报告生成、摘要卡片、模型列表都可以使用骨架屏提升感知速度。

---

## 🧠 原理讲解

骨架屏通常由浅灰色块组成，再配合 shimmer 动画模拟加载：

```css
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}
```

关键帧让背景位置移动：

```css
@keyframes shimmer {
  100% { background-position: -100% 0; }
}
```

---

## 🏗 基本结构

```html
<style>
  .skeleton-line {
    height: 16px;
    border-radius: 4px;
  }
</style>

<div class="skeleton-line"></div>
```

---

## ✅ 完整代码

下面实现 AI 回答卡片的骨架屏：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Skeleton loading 示例</title>
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

    .answer-card {
      max-width: 680px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .skeleton {
      border-radius: 6px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
      background-size: 400% 100%;
      animation: shimmer 1.2s ease-in-out infinite;
    }

    .skeleton-title {
      width: 56%;
      height: 28px;
      margin-bottom: 20px;
    }

    .skeleton-line {
      height: 16px;
      margin-bottom: 12px;
    }

    .skeleton-line.short {
      width: 72%;
    }

    @keyframes shimmer {
      0% {
        background-position: 100% 0;
      }
      100% {
        background-position: -100% 0;
      }
    }
  </style>
</head>
<body>
  <article class="answer-card" aria-label="AI 回答正在加载">
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-line"></div>
    <div class="skeleton skeleton-line"></div>
    <div class="skeleton skeleton-line short"></div>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`.skeleton` 定义通用骨架块样式，包括圆角、渐变背景和 shimmer 动画。

`.skeleton-title` 模拟标题占位，宽度较短，高度较高。

`.skeleton-line` 模拟正文段落行。

`@keyframes shimmer` 通过移动背景位置制造扫光效果。

---

## 🌐 浏览器表现

页面会显示一张白色卡片，内部有标题和三行正文的灰色占位块。占位块会有轻微扫光动画。

用户能感知内容结构正在加载，而不是看到空白页面。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `linear-gradient` | CSS 函数 | 创建渐变背景 | `linear-gradient(90deg, ...)` |
| `background-size` | CSS 属性 | 控制背景尺寸 | `400% 100%` |
| `background-position` | CSS 属性 | 控制背景位置 | `100% 0` |
| `animation` | CSS 属性 | 播放扫光动画 | `shimmer 1.2s infinite` |
| `aria-label` | HTML 属性 | 提供状态说明 | `aria-label="正在加载"` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 骨架屏用于加载前的结构占位。
- shimmer 动画通常通过渐变背景移动实现。
- 骨架屏应匹配真实内容结构，不要随意堆灰条。

---

## ⚠️ 易错点

- 易错点1：骨架结构和真实内容差异太大。正确写法：按真实标题、段落、卡片结构占位。
- 易错点2：扫光动画太强。正确写法：低对比、低干扰。
- 易错点3：加载结束后忘记移除骨架屏。正确写法：数据返回后替换为真实内容。

---

## 💡 最佳实践

- 长文本加载可以用标题条加多行正文条。
- 卡片列表加载时，每张卡片使用相同骨架结构。
- 对低动效偏好用户，应考虑关闭 shimmer 动画。

---

## 🚀 AI 应用场景

AI 报告和知识库检索可能需要数秒。骨架屏能让用户提前理解结果结构，例如“标题 + 摘要 + 来源列表”。

```css
.answer-skeleton {
  animation: shimmer 1.2s ease-in-out infinite;
}
```

---

## 📝 练习题

1. [基础题] 创建一条灰色骨架线。
2. [进阶题] 使用渐变和 keyframes 实现 shimmer 动画。
3. [AI 场景题] 为 AI 摘要卡片设计标题和正文骨架屏。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| 骨架屏 | 加载前展示内容结构占位 |
| shimmer | 通过渐变移动制造加载感 |
| AI 生成 | 适合报告、摘要和检索结果加载 |
| 可用性 | 骨架应贴近真实内容结构 |

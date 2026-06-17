# filter 滤镜（CSS-054）

## 🎯 本节学习目标

- 掌握 `filter` 的常见函数，如 `blur()`、`grayscale()`、`brightness()`。
- 理解滤镜会影响元素自身的视觉表现。
- 能够为 AI 图片预览、禁用状态和敏感内容遮罩设计基础滤镜效果。

---

## 📖 什么是 filter

`filter` 用来给元素应用图形滤镜，例如模糊、灰度、亮度、对比度、阴影等。

它会影响元素自身以及内部内容的渲染结果。

在 AI 应用中，滤镜常见于图片生成预览、敏感内容模糊、禁用状态、上传图片处理前后对比等场景。

---

## 🧠 原理讲解

常见写法：

```css
.preview {
  filter: blur(8px);
}
```

多个滤镜可以组合：

```css
.disabled {
  filter: grayscale(1) brightness(0.9);
}
```

滤镜有视觉成本，尤其是大面积模糊，使用时要注意性能和可读性。

---

## 🏗 基本结构

```html
<style>
  .image-preview.is-blurred {
    filter: blur(8px);
  }
</style>
```

---

## ✅ 完整代码

下面模拟 AI 图片预览的滤镜状态：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>filter 示例</title>
  <style>
    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .image-card {
      max-width: 560px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .preview {
      display: grid;
      place-items: center;
      height: 220px;
      border-radius: 8px;
      background: linear-gradient(135deg, #93c5fd, #f9a8d4);
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
    }

    .preview.is-sensitive {
      filter: blur(8px) brightness(0.9);
    }

    .preview.is-disabled {
      filter: grayscale(1) opacity(0.6);
    }
  </style>
</head>
<body>
  <article class="image-card">
    <h1>AI 图片预览</h1>
    <div class="preview is-sensitive">生成图</div>
    <p>敏感或未确认内容可以先使用 blur 处理，但仍需要明确审核和交互流程。</p>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`.preview` 用渐变模拟一张 AI 生成图片。

`.preview.is-sensitive` 使用 `blur(8px)` 模糊内容，并用 `brightness(0.9)` 略微降低亮度。

`.preview.is-disabled` 演示灰度和透明度组合，适合不可用状态。

滤镜只是视觉处理，不等于安全审核或权限控制。

---

## 🌐 浏览器表现

预览区域会被模糊，用户不能清楚看到内容细节。移除 `is-sensitive` 类后，预览恢复清晰。

如果对大面积高清图片使用强模糊，可能影响性能，需要谨慎。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `filter` | CSS 属性 | 应用图形滤镜 | `filter: blur(8px);` |
| `blur()` | CSS 函数 | 模糊元素 | `blur(8px)` |
| `grayscale()` | CSS 函数 | 灰度处理 | `grayscale(1)` |
| `brightness()` | CSS 函数 | 调整亮度 | `brightness(0.9)` |
| `opacity()` | CSS 函数 | 调整透明度 | `opacity(0.6)` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `filter` 影响元素自身视觉。
- 模糊、灰度、亮度是最常见滤镜。
- 滤镜不等于安全措施，只是展示层处理。

---

## ⚠️ 易错点

- 易错点1：用 blur 当作真正的数据保护。正确写法：敏感内容后端和权限也要控制。
- 易错点2：大面积强滤镜导致卡顿。正确写法：控制滤镜范围和强度。
- 易错点3：滤镜降低文字可读性。正确写法：不要对需要阅读的文本直接套强滤镜。

---

## 💡 最佳实践

- 图片预览和缩略图适合使用 filter。
- 禁用状态可以用灰度，但要同时提供明确状态文本。
- 大面积 blur 要谨慎测试性能。

---

## 🚀 AI 应用场景

AI 图片生成应用可在审核完成前模糊预览图，或在 NSFW 检测提示下让用户确认是否查看。

```css
.generated-image.is-pending-review {
  filter: blur(10px) brightness(0.85);
}
```

---

## 📝 练习题

1. [基础题] 给一个图片区域添加 `filter: grayscale(1)`。
2. [进阶题] 组合 `blur()` 和 `brightness()`。
3. [AI 场景题] 为 AI 图片生成结果设计“待审核模糊预览”状态。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `filter` | 给元素自身添加滤镜 |
| `blur()` | 模糊元素 |
| `grayscale()` | 灰度处理 |
| AI 图片 | 适合预览、审核和禁用状态 |

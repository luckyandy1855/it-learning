# visibility 可见性（CSS-020）

## 🎯 本节学习目标

- 掌握 `visibility: visible` 和 `visibility: hidden` 的区别。
- 理解 visibility 隐藏元素但保留布局空间的特点。
- 能够判断 AI 界面中应该使用 `visibility` 还是 `display: none`。

---

## 📖 什么是 visibility

`visibility` 控制元素是否可见。最常用的值是 `visible` 和 `hidden`。

`visibility: hidden` 会让元素不可见，但元素仍然占据原来的布局空间。也就是说，页面会留下它的位置。

这和 `display: none` 不同。`display: none` 是完全移出布局，`visibility: hidden` 是看不见但仍占位。

---

## 🧠 原理讲解

基础写法：

```css
.placeholder {
  visibility: hidden;
}
```

元素不可见，但原本占据的宽度和高度还在。

适合场景包括：保持按钮组尺寸稳定、预留加载文本位置、避免状态切换导致布局跳动。

---

## 🏗 基本结构

```html
<style>
  .reserved {
    visibility: hidden;
  }
</style>

<p class="reserved">这段文字不可见，但仍占据空间。</p>
```

---

## ✅ 完整代码

下面用 visibility 保持 AI 状态栏高度稳定：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>visibility 示例</title>
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

    .status-line {
      min-height: 24px;
      margin: 0 0 16px;
      color: #2563eb;
      font-size: 14px;
      line-height: 24px;
    }

    .status-line.is-invisible {
      visibility: hidden;
    }

    .answer {
      padding: 12px;
      border-radius: 6px;
      background: #f9fafb;
      line-height: 1.8;
    }

    .ghost-button {
      margin-top: 12px;
      padding: 10px 16px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #ffffff;
      font: inherit;
    }

    .ghost-button.is-invisible {
      visibility: hidden;
    }
  </style>
</head>
<body>
  <section class="panel">
    <p class="status-line is-invisible">AI 正在生成中...</p>
    <div class="answer">当前没有生成任务，但状态栏空间仍被保留，布局不会跳动。</div>
    <button class="ghost-button is-invisible">停止生成</button>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.status-line` 设置固定的状态行高度和文字样式。

`.status-line.is-invisible` 使用 `visibility: hidden` 隐藏状态文字，但保留状态行高度。

`.answer` 是回答区域，因为状态行仍占位，它的位置不会突然上移。

`.ghost-button.is-invisible` 隐藏停止按钮，但按钮原本的空间仍然存在。

---

## 🌐 浏览器表现

状态文字和停止按钮不可见，但页面仍保留它们的位置。回答区域不会因为状态文字出现或消失而上下跳动。

在 DevTools 中把 `visibility: hidden` 改成 `display: none`，可以看到布局立即发生变化。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `visibility` | CSS 属性 | 控制可见性 | `visibility: hidden;` |
| `visible` | CSS 值 | 元素可见 | `visibility: visible;` |
| `hidden` | CSS 值 | 元素不可见但占位 | `visibility: hidden;` |
| `collapse` | CSS 值 | 表格行列中有特殊表现 | `visibility: collapse;` |
| `display: none` | CSS 对比 | 隐藏且不占位 | `.hidden` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `visibility: hidden` 隐藏元素但保留布局空间。
- `display: none` 隐藏元素且移出布局。
- 需要避免布局跳动时，可以考虑 visibility。

---

## ⚠️ 易错点

- 易错点1：希望隐藏后不占空间，却用了 `visibility: hidden`。正确写法：使用 `display: none`。
- 易错点2：用 visibility 隐藏可交互按钮却不考虑焦点。正确写法：隐藏交互元素时同步处理可访问性和焦点。
- 易错点3：把 visibility 当成透明度。正确写法：透明动画通常用 `opacity`。

---

## 💡 最佳实践

- 状态文字位置需要稳定时，可以用 visibility 保留空间。
- 真正不需要参与布局的内容，用 `display: none`。
- 需要淡入淡出动画时，通常使用 `opacity` 配合 `visibility`。

---

## 🚀 AI 应用场景

AI 流式生成时，状态栏可能在“准备中、生成中、完成”之间切换。使用 visibility 可以预留状态栏高度，避免回答区域频繁跳动。

```css
.stream-status {
  min-height: 24px;
}

.stream-status.is-hidden {
  visibility: hidden;
}
```

这种方式适合保持页面稳定，但如果状态内容完全不该被用户感知，则应根据具体需求选择 `display: none`。

---

## 📝 练习题

1. [基础题] 使用 `visibility: hidden` 隐藏一段文字，观察它是否仍占空间。
2. [进阶题] 对比 `visibility: hidden` 和 `display: none` 对布局的影响。
3. [AI 场景题] 为 AI 生成状态栏预留固定高度，避免状态切换时页面跳动。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `visibility` | 控制元素是否可见 |
| `hidden` | 不可见但保留布局空间 |
| `display: none` | 不可见且不占布局空间 |
| AI 状态栏 | visibility 可用于避免布局跳动 |

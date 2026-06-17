# display: none 隐藏元素（CSS-019）

## 🎯 本节学习目标

- 掌握 `display: none` 的隐藏效果。
- 理解它会让元素脱离布局且通常不可被辅助技术读取。
- 能够在 AI 应用中正确隐藏加载区、错误区和可切换面板。

---

## 📖 什么是 display: none

`display: none` 会让元素完全不参与页面渲染。元素不会显示，也不会占据布局空间。

它和“透明”或“不可见但占位”不同。使用 `display: none` 后，页面布局会像这个元素不存在一样重新排列。

在 AI 应用中，`display: none` 常用于切换空状态、加载状态、错误提示、设置面板和高级参数区。

---

## 🧠 原理讲解

基础写法：

```css
.hidden {
  display: none;
}
```

元素仍然存在于 HTML 或 DOM 中，但浏览器不会为它生成可见布局盒。

```html
<div class="hidden">这段内容不会显示，也不占空间。</div>
```

如果后续用 JavaScript 移除 `.hidden` 类，元素会重新参与布局。

---

## 🏗 基本结构

```html
<style>
  .loading {
    display: none;
  }
</style>

<p class="loading">AI 正在生成中...</p>
```

---

## ✅ 完整代码

下面演示 AI 页面中不同状态的显示与隐藏：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>display none 示例</title>
  <style>
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

    .state {
      margin-top: 16px;
      padding: 12px;
      border-radius: 6px;
      line-height: 1.7;
    }

    .loading {
      background: #eff6ff;
      color: #1e3a8a;
    }

    .error {
      background: #fef2f2;
      color: #991b1b;
    }

    .hidden {
      display: none;
    }
  </style>
</head>
<body>
  <section class="panel">
    <h1>AI 生成任务</h1>
    <p>当前展示的是结果状态，加载和错误状态被隐藏。</p>

    <div class="state loading hidden">AI 正在生成中...</div>
    <div class="state error hidden">生成失败，请稍后重试。</div>
    <div class="state">生成完成：已输出 3 条行动建议。</div>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.state` 定义所有状态提示的共同样式。

`.loading` 和 `.error` 分别定义加载和错误状态的视觉表现。

`.hidden { display: none; }` 是通用隐藏工具类。

加载区和错误区虽然写在 HTML 中，但因为带有 `.hidden`，不会显示，也不会占据空间。

---

## 🌐 浏览器表现

页面只显示“生成完成”的状态提示。加载提示和错误提示不会出现，页面中也不会留下空白位置。

在 DevTools 中移除某个元素的 `.hidden` 类，可以立即看到它重新显示并占据布局空间。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `display` | CSS 属性 | 控制元素是否生成盒子 | `display: none;` |
| `none` | display 值 | 完全隐藏元素 | `.hidden` |
| `.hidden` | 工具类 | 常见隐藏类名 | `.hidden { display: none; }` |
| `hidden` | HTML 属性 | 原生隐藏属性 | `<div hidden>` |
| `classList.toggle` | DOM API | 切换隐藏类 | `el.classList.toggle("hidden")` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `display: none` 会让元素不显示、不占位。
- 被隐藏元素不会参与布局计算。
- 状态切换常用 `.hidden` 类配合 JavaScript 控制。

---

## ⚠️ 易错点

- 易错点1：希望元素隐藏但保留位置，却用了 `display: none`。正确写法：需要保留位置时用 `visibility: hidden`。
- 易错点2：把重要提示长期 `display: none`。正确写法：需要读屏器感知的动态状态要考虑 aria-live。
- 易错点3：只隐藏视觉，不同步交互状态。正确写法：隐藏面板时也要考虑焦点和键盘操作。

---

## 💡 最佳实践

- 简单状态切换可以使用 `.hidden { display: none; }`。
- 对模态框、菜单这类交互组件，隐藏时要管理焦点。
- 对加载状态和错误状态，显示隐藏应和真实业务状态同步。

---

## 🚀 AI 应用场景

AI 请求过程中通常有多个互斥状态：空状态、加载中、生成成功、生成失败。`display: none` 可以让当前无关状态完全退出布局。

```css
.empty-state.is-hidden,
.loading-state.is-hidden,
.error-state.is-hidden {
  display: none;
}
```

```js
// 示例：生成开始时显示 loading，隐藏 error。
loading.classList.remove("is-hidden");
error.classList.add("is-hidden");
```

---

## 📝 练习题

1. [基础题] 写一个 `.hidden` 类隐藏元素。
2. [进阶题] 比较隐藏元素前后页面布局是否变化。
3. [AI 场景题] 设计空状态、加载状态、错误状态三段 HTML，并用 `.hidden` 控制显示。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `display: none` | 完全隐藏元素并移出布局 |
| `.hidden` | 常见隐藏工具类 |
| 状态切换 | AI 页面常用它切换加载、错误和结果 |
| 注意事项 | 隐藏交互区域时要考虑焦点和无障碍 |

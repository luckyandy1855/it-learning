# @keyframes 关键帧（CSS-043）

## 🎯 本节学习目标

- 掌握 `@keyframes` 的基本语法。
- 理解百分比关键帧如何描述动画过程。
- 能够为 AI 状态提示编写清晰可控的关键帧动画。

---

## 📖 什么是 @keyframes

`@keyframes` 用来定义 CSS 动画的关键状态。它描述动画在开始、中间和结束时应该是什么样子。

animation 负责播放动画，`@keyframes` 负责定义动画内容。

在 AI 应用中，关键帧可以用于加载条、呼吸状态、生成中提示、结果出现动效等，但应避免过度复杂。

---

## 🧠 原理讲解

最简单的关键帧：

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

也可以用百分比：

```css
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
```

`from` 等价于 `0%`，`to` 等价于 `100%`。

---

## 🏗 基本结构

```html
<style>
  .result {
    animation: fade-in 240ms ease-out;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
```

---

## ✅ 完整代码

下面用关键帧实现 AI 回答出现动画：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>@keyframes 示例</title>
  <style>
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
      animation: answer-enter 260ms ease-out;
    }

    .answer-card h1 {
      margin: 0 0 12px;
      font-size: 24px;
    }

    .answer-card p {
      margin: 0;
      line-height: 1.8;
    }

    @keyframes answer-enter {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <article class="answer-card">
    <h1>AI 回答完成</h1>
    <p>新回答出现时轻微淡入和上移，可以让用户感知内容已更新。</p>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`.answer-card` 使用 `animation: answer-enter 260ms ease-out` 播放进入动画。

`@keyframes answer-enter` 定义动画名称，必须和 animation 中的名称一致。

`from` 阶段元素透明并向下偏移 8px。

`to` 阶段元素恢复为完全可见并回到原位置。

---

## 🌐 浏览器表现

页面加载时，AI 回答卡片会从轻微下方淡入。动画时间很短，不会妨碍阅读。

在 DevTools Animations 面板中，可以查看关键帧动画的时间线。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `@keyframes` | CSS 规则 | 定义关键帧动画 | `@keyframes fade` |
| `from` | 关键帧 | 动画起点 | `from { opacity: 0; }` |
| `to` | 关键帧 | 动画终点 | `to { opacity: 1; }` |
| `50%` | 关键帧 | 动画中间状态 | `50% { transform: scale(1.05); }` |
| `transform` | CSS 属性 | 常用于高性能动画 | `translateY(8px)` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `@keyframes` 定义动画过程。
- animation 的名称必须匹配 keyframes 名称。
- 关键帧动画优先使用 `opacity` 和 `transform`。

---

## ⚠️ 易错点

- 易错点1：动画名称拼写不一致。正确写法：animation-name 与 keyframes 名称完全一致。
- 易错点2：关键帧里频繁改变 width、height。正确写法：优先使用 transform。
- 易错点3：进入动画过重。正确写法：AI 文本内容出现动画要短且轻。

---

## 💡 最佳实践

- 进入动画控制在 200ms 到 300ms。
- 加载循环动画与结果进入动画分开定义。
- 动画命名使用语义化名称，如 `answer-enter`、`skeleton-shimmer`。

---

## 🚀 AI 应用场景

AI 回复、引用卡片、工具结果出现时，可以使用轻量关键帧动画提示内容更新。

```css
.tool-result {
  animation: answer-enter 220ms ease-out;
}

@keyframes answer-enter {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 📝 练习题

1. [基础题] 写一个从透明到不透明的 `fade-in` 动画。
2. [进阶题] 使用 `from/to` 同时改变 opacity 和 transform。
3. [AI 场景题] 为 AI 新回答卡片设计一个轻量进入动画。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `@keyframes` | 定义动画关键状态 |
| `from/to` | 表示起点和终点 |
| 百分比 | 可以定义中间状态 |
| AI 回答 | 适合使用短进入动画提示更新 |

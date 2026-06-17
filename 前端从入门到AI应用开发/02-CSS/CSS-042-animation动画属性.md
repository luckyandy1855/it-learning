# animation 动画属性（CSS-042）

## 🎯 本节学习目标

- 掌握 `animation` 属性的基本组成。
- 理解 animation 适合持续或自动播放的动画。
- 能够为 AI 加载状态设计轻量循环动画。

---

## 📖 什么是 animation

`animation` 用来执行由 `@keyframes` 定义的动画。与 transition 不同，animation 不一定依赖用户状态变化，它可以自动播放、循环播放或按指定次数播放。

常见用途包括加载指示器、呼吸灯、进度提示、空状态引导和轻量装饰动效。

在 AI 应用中，animation 最常见的场景是“模型正在生成”“工具调用中”“等待检索结果”等状态提示。

---

## 🧠 原理讲解

基础写法：

```css
.dot {
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
```

`animation` 指向一个关键帧名称，并设置持续时间、缓动函数、循环次数等参数。

如果没有对应的 `@keyframes`，动画不会执行。

---

## 🏗 基本结构

```html
<style>
  .loading {
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes pulse {
    50% { opacity: 0.5; }
  }
</style>

<p class="loading">AI 正在生成中...</p>
```

---

## ✅ 完整代码

下面实现一个 AI 生成中的点状动画：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>animation 示例</title>
  <style>
    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .status-card {
      max-width: 640px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .generating {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #2563eb;
      font-weight: 600;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2563eb;
      animation: pulse 1s ease-in-out infinite;
    }

    .dot:nth-child(2) {
      animation-delay: 120ms;
    }

    .dot:nth-child(3) {
      animation-delay: 240ms;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.35;
        transform: translateY(0);
      }
      50% {
        opacity: 1;
        transform: translateY(-3px);
      }
    }
  </style>
</head>
<body>
  <section class="status-card">
    <p class="generating">
      AI 正在生成
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </p>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.dot` 定义点的尺寸、圆形和背景色。

`animation: pulse 1s ease-in-out infinite` 表示执行 `pulse` 动画，时长 1 秒，无限循环。

`:nth-child()` 给第二、第三个点添加延迟，形成依次跳动的节奏。

`@keyframes pulse` 在 50% 时提高透明度并向上移动，让加载状态更明显。

---

## 🌐 浏览器表现

三个蓝色小点会依次轻微跳动，表示 AI 正在生成。动画不会改变页面布局，只改变透明度和 transform。

用户会感知系统仍在工作，而不是页面卡住。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `animation` | CSS 属性 | 动画缩写 | `pulse 1s ease infinite` |
| `animation-name` | CSS 属性 | 关键帧名称 | `pulse` |
| `animation-duration` | CSS 属性 | 动画时长 | `1s` |
| `animation-delay` | CSS 属性 | 动画延迟 | `120ms` |
| `animation-iteration-count` | CSS 属性 | 播放次数 | `infinite` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- animation 需要配合 `@keyframes`。
- 它适合自动播放或循环播放的状态动画。
- AI 加载动画应轻量，不应干扰阅读。

---

## ⚠️ 易错点

- 易错点1：只写 animation，不写 keyframes。正确写法：定义对应名称的 `@keyframes`。
- 易错点2：无限动画太多导致页面分散注意力。正确写法：只在必要状态显示。
- 易错点3：动画改变 layout 属性。正确写法：优先动画 `opacity` 和 `transform`。

---

## 💡 最佳实践

- 加载状态使用短周期、低幅度动画。
- 尊重 `prefers-reduced-motion` 用户偏好。
- 生成结束后应移除或隐藏循环动画。

---

## 🚀 AI 应用场景

AI 生成往往需要等待数秒。轻量 animation 可以告诉用户请求正在进行，降低“是不是卡住了”的不确定感。

```css
.thinking-dot {
  animation: pulse 1s ease-in-out infinite;
}
```

---

## 📝 练习题

1. [基础题] 创建一个透明度循环变化的 loading 文本。
2. [进阶题] 给三个点设置不同 `animation-delay`。
3. [AI 场景题] 实现一个“AI 正在思考”的加载指示器。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| animation | 自动播放 CSS 动画 |
| keyframes | 定义动画过程 |
| infinite | 无限循环播放 |
| AI 加载 | 适合生成中和工具调用中的状态提示 |

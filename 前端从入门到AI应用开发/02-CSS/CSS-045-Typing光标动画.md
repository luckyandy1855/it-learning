# Typing 光标动画（CSS-045）

## 🎯 本节学习目标

- 理解 Typing 光标动画在 AI 流式输出中的作用。
- 掌握用 CSS 实现闪烁光标。
- 能够为 AI 回复中的“正在输出”状态添加轻量视觉提示。

---

## 📖 什么是 Typing 光标动画

Typing 光标动画常见于 AI 聊天界面，用来表示模型正在持续输出内容。

它通常表现为文字末尾一个闪烁的竖线或小块。这个动画不负责生成文字，只负责给用户一个“输出仍在继续”的视觉提示。

在流式输出场景中，光标动画可以提升反馈感，但不应该干扰用户阅读。

---

## 🧠 原理讲解

最简单的光标可以用伪元素实现：

```css
.streaming::after {
  content: "";
  display: inline-block;
  width: 2px;
  height: 1em;
  background: currentColor;
  animation: blink 1s steps(2, start) infinite;
}
```

关键帧控制透明度：

```css
@keyframes blink {
  50% { opacity: 0; }
}
```

---

## 🏗 基本结构

```html
<style>
  .streaming::after {
    content: "";
    animation: blink 1s steps(2, start) infinite;
  }
</style>

<p class="streaming">AI 正在输出</p>
```

---

## ✅ 完整代码

下面实现 AI 流式回复末尾的闪烁光标：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Typing 光标动画示例</title>
  <style>
    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .chat-card {
      max-width: 680px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .answer {
      margin: 0;
      line-height: 1.8;
    }

    .answer.streaming::after {
      content: "";
      display: inline-block;
      width: 2px;
      height: 1em;
      margin-left: 3px;
      vertical-align: -0.12em;
      background: currentColor;
      animation: blink 1s steps(2, start) infinite;
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
  </style>
</head>
<body>
  <article class="chat-card">
    <p class="answer streaming">AI 正在逐字输出回答，光标表示流式响应仍未结束</p>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`.answer.streaming::after` 在正在输出的回答末尾生成一个伪元素。

`width: 2px` 和 `height: 1em` 让它看起来像文字光标。

`background: currentColor` 让光标颜色跟随当前文本颜色。

`animation: blink 1s steps(2, start) infinite` 创建离散闪烁效果，更接近真实光标。

---

## 🌐 浏览器表现

AI 回复文字末尾会出现一个闪烁竖线，暗示模型还在继续输出。

当生成完成时，通常移除 `.streaming` 类，光标就会消失。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `::after` | 伪元素 | 在文本末尾生成光标 | `.streaming::after` |
| `currentColor` | CSS 关键字 | 使用当前文字颜色 | `background: currentColor;` |
| `steps()` | CSS 缓动函数 | 离散变化 | `steps(2, start)` |
| `animation` | CSS 属性 | 播放闪烁动画 | `blink 1s infinite` |
| `.streaming` | 状态类 | 表示正在流式输出 | `class="streaming"` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 光标动画只是状态提示，不负责文字生成。
- 伪元素适合实现不影响 HTML 内容的视觉光标。
- 生成完成后应移除 streaming 状态。

---

## ⚠️ 易错点

- 易错点1：把光标写成真实文本字符。正确写法：使用 `::after` 生成视觉光标。
- 易错点2：生成结束后光标仍闪烁。正确写法：移除 `.streaming` 类。
- 易错点3：光标太大或太亮。正确写法：让光标跟随正文颜色并保持细窄。

---

## 💡 最佳实践

- 光标只在正在生成时显示。
- 使用 `currentColor` 让光标适配深色模式和主题色。
- 动画频率不要过快，1s 左右更自然。

---

## 🚀 AI 应用场景

流式输出是 AI 聊天界面的核心体验。Typing 光标能让用户知道模型还在生成，不需要等待完整回答才获得反馈。

```css
.assistant-message.is-streaming::after {
  content: "";
  display: inline-block;
  width: 2px;
  height: 1em;
  background: currentColor;
  animation: blink 1s steps(2, start) infinite;
}
```

---

## 📝 练习题

1. [基础题] 用 `::after` 创建一个文本末尾光标。
2. [进阶题] 使用 `@keyframes` 让光标闪烁。
3. [AI 场景题] 为 AI 流式回复设计 `.is-streaming` 状态，生成中显示光标，完成后隐藏。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| Typing 光标 | 表示 AI 正在流式输出 |
| `::after` | 适合生成视觉光标 |
| `steps()` | 适合离散闪烁动画 |
| `.streaming` | 控制光标显示和隐藏的状态类 |

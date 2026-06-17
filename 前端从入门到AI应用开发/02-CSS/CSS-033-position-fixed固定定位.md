# position: fixed 固定定位（CSS-033）

## 🎯 本节学习目标

- 理解 `position: fixed` 相对视口固定。
- 掌握固定定位元素不随页面滚动移动的特点。
- 能够实现 AI 应用中的固定输入栏、浮动帮助按钮和全局状态提示。

---

## 📖 什么是 position: fixed

`position: fixed` 表示固定定位。元素通常相对浏览器视口定位，即使页面滚动，它也会停留在固定位置。

固定定位元素会脱离普通文档流，不占据原本布局空间。

在 AI 应用中，底部固定 Prompt 输入栏、右下角帮助按钮、顶部全局生成状态、浮动反馈入口，都常用 fixed。

---

## 🧠 原理讲解

基础写法：

```css
.floating-button {
  position: fixed;
  right: 24px;
  bottom: 24px;
}
```

这表示按钮固定在视口右下角。

因为 fixed 元素不占文档流空间，如果固定在底部，主内容区域通常需要额外 `padding-bottom`，避免内容被遮挡。

---

## 🏗 基本结构

```html
<style>
  .assistant-entry {
    position: fixed;
    right: 24px;
    bottom: 24px;
  }
</style>

<button class="assistant-entry">AI</button>
```

---

## ✅ 完整代码

下面实现一个底部固定 AI 输入栏：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>position fixed 示例</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 32px 32px 120px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .content {
      max-width: 760px;
      margin: 0 auto;
      line-height: 1.8;
    }

    .fixed-composer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      background: #ffffff;
    }

    .composer-inner {
      display: flex;
      gap: 12px;
      max-width: 760px;
      margin: 0 auto;
    }

    .prompt-input {
      flex: 1;
      min-width: 0;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font: inherit;
    }

    .send-button {
      padding: 10px 16px;
      border: 0;
      border-radius: 6px;
      background: #2563eb;
      color: #ffffff;
      font: inherit;
    }
  </style>
</head>
<body>
  <main class="content">
    <h1>AI 长文阅读</h1>
    <p>当内容很长时，底部输入栏仍然固定在视口底部，用户可以随时继续追问。</p>
    <p>主内容底部需要预留空间，否则最后几行文字可能被固定输入栏遮住。</p>
    <p>继续滚动页面时，固定定位元素不会跟随文档流移动。</p>
  </main>

  <form class="fixed-composer">
    <div class="composer-inner">
      <input class="prompt-input" placeholder="继续追问这篇内容">
      <button class="send-button" type="button">发送</button>
    </div>
  </form>
</body>
</html>
```

---

## 🔍 逐行解析

`.fixed-composer { position: fixed; }` 让输入栏固定在视口底部。

`left: 0; right: 0; bottom: 0;` 让固定栏横向铺满底部。

`body` 的底部 padding 设置为 `120px`，为固定输入栏预留空间。

`.composer-inner` 控制输入栏内部宽度，避免内容在大屏上过宽。

---

## 🌐 浏览器表现

底部会出现固定输入栏。页面内容滚动时，输入栏仍停留在浏览器底部。

如果移除 `body` 的底部 padding，最后一部分正文可能被输入栏覆盖，这是 fixed 布局常见问题。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `fixed` | position 值 | 相对视口固定 | `position: fixed;` |
| `bottom` | CSS 属性 | 距视口底部距离 | `bottom: 0;` |
| `right` | CSS 属性 | 距视口右侧距离 | `right: 24px;` |
| `z-index` | CSS 属性 | 控制固定元素层级 | `z-index: 50;` |
| 视口 | 浏览器概念 | 当前可见区域 | viewport |

---

## ⭐⭐⭐⭐⭐ 必学重点

- fixed 元素通常相对视口定位。
- fixed 元素脱离文档流，不占布局空间。
- 底部固定区域要给主内容预留空间。

---

## ⚠️ 易错点

- 易错点1：固定底栏遮住正文。正确写法：给页面或主内容加底部 padding。
- 易错点2：多个固定元素层级冲突。正确写法：用清晰的 z-index 规范管理层级。
- 易错点3：移动端固定输入栏遮挡系统键盘。正确写法：移动端要实机测试和适配安全区域。

---

## 💡 最佳实践

- 固定底栏适合高频输入和全局操作。
- 固定元素不要过多，否则页面会显得拥挤。
- 固定区域内仍可使用 Flexbox 管理输入框和按钮。

---

## 🚀 AI 应用场景

ChatGPT 类产品常把输入框固定在底部，让用户阅读长回答时随时追问。fixed 是实现这种体验的基础方式。

```css
.chat-composer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
```

---

## 📝 练习题

1. [基础题] 创建一个固定在右下角的 AI 帮助按钮。
2. [进阶题] 实现一个底部固定输入栏，并为正文预留底部空间。
3. [AI 场景题] 设计一个长文阅读页，底部始终显示 Prompt 输入框。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `fixed` | 相对视口固定定位 |
| 文档流 | fixed 元素不占普通布局空间 |
| 预留空间 | 固定底栏需要防止遮挡内容 |
| AI 输入栏 | 长对话产品常用 fixed 固定到底部 |

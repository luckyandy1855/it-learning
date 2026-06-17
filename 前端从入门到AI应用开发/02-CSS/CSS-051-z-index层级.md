# z-index 层级（CSS-051）

## 🎯 本节学习目标

- 理解 `z-index` 控制元素在叠放方向上的层级。
- 掌握 `z-index` 生效需要定位上下文的基本条件。
- 能够为 AI 弹窗、浮层、固定输入栏设计清晰层级规则。

---

## 📖 什么是 z-index

`z-index` 用来控制元素在屏幕上的叠放顺序。值越大，通常越靠上显示。

它主要影响定位元素、Flex/Grid 子项等特定场景，不是给任意元素写上就一定生效。

在 AI 应用中，弹窗、下拉菜单、固定输入栏、右下角助手按钮、Toast 提示都可能互相覆盖。没有层级规范，很容易出现弹窗被输入栏挡住的问题。

---

## 🧠 原理讲解

基础写法：

```css
.modal {
  position: fixed;
  z-index: 1000;
}
```

`z-index` 常和 `position: relative/absolute/fixed/sticky` 一起使用。

需要注意的是，CSS 存在 stacking context（堆叠上下文）。某些属性会创建新的堆叠上下文，使子元素的层级只能在该上下文内部比较。

---

## 🏗 基本结构

```html
<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 900;
  }

  .modal {
    position: fixed;
    z-index: 1000;
  }
</style>
```

---

## ✅ 完整代码

下面实现 AI 设置弹窗的基础层级：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>z-index 示例</title>
  <style>
    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .chat-page {
      max-width: 720px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .composer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      background: #ffffff;
    }

    .overlay {
      position: fixed;
      inset: 0;
      z-index: 900;
      background: rgb(15 23 42 / 0.45);
    }

    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      z-index: 1000;
      width: min(92vw, 460px);
      padding: 24px;
      border-radius: 8px;
      background: #ffffff;
      transform: translate(-50%, -50%);
    }
  </style>
</head>
<body>
  <main class="chat-page">
    <h1>AI 对话</h1>
    <p>弹窗应该覆盖页面内容和底部输入栏。</p>
  </main>
  <form class="composer">底部固定输入栏</form>
  <div class="overlay"></div>
  <section class="modal">
    <h2>模型设置</h2>
    <p>modal 的 z-index 高于 overlay 和 composer。</p>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.composer` 使用 `z-index: 100`，固定在页面底部。

`.overlay` 使用 `z-index: 900`，覆盖页面主体和输入栏。

`.modal` 使用 `z-index: 1000`，显示在遮罩层之上。

这种分层写法比随手写 `999999` 更容易维护。

---

## 🌐 浏览器表现

页面底部有固定输入栏，但遮罩和弹窗会覆盖它。弹窗位于遮罩之上，用户能明确聚焦当前设置任务。

在 DevTools 中调整 z-index 值，可以观察元素覆盖顺序变化。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `z-index` | CSS 属性 | 控制堆叠层级 | `z-index: 1000;` |
| `position` | CSS 属性 | 常与 z-index 配合 | `position: fixed;` |
| `inset` | CSS 属性 | 同时设置四边偏移 | `inset: 0;` |
| stacking context | CSS 概念 | 堆叠上下文 | 层级比较范围 |
| overlay | UI 概念 | 遮罩层 | 弹窗背景 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `z-index` 控制叠放顺序，不负责普通布局。
- 层级值应有规范，不要无限堆大数字。
- 弹窗层级应高于遮罩，遮罩应高于页面内容。

---

## ⚠️ 易错点

- 易错点1：给普通静态元素写 z-index 不生效。正确写法：配合定位或特定布局上下文。
- 易错点2：全项目乱写 9999。正确写法：定义层级尺度，例如 100、900、1000。
- 易错点3：子元素 z-index 很高仍被遮住。正确写法：检查是否被父级 stacking context 限制。

---

## 💡 最佳实践

- 建议建立层级 token：dropdown、sticky、overlay、modal、toast。
- 弹窗和 Toast 这类全局浮层集中管理。
- 不要用 z-index 修复本该由文档流或布局解决的问题。

---

## 🚀 AI 应用场景

AI 工具常有固定输入栏、模型选择弹窗、生成错误 Toast 和快捷命令菜单。它们需要稳定层级系统。

```css
:root {
  --z-composer: 100;
  --z-overlay: 900;
  --z-modal: 1000;
}
```

---

## 📝 练习题

1. [基础题] 创建遮罩层和弹窗，设置不同 z-index。
2. [进阶题] 让弹窗覆盖底部固定输入栏。
3. [AI 场景题] 为 AI 应用定义 composer、dropdown、overlay、modal 四个层级。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `z-index` | 控制元素叠放顺序 |
| 定位上下文 | z-index 通常需要配合 position |
| 层级规范 | 用固定尺度管理浮层 |
| AI 弹窗 | modal 应高于 overlay 和固定输入栏 |

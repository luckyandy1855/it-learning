# ID 选择器（CSS-004）

## 🎯 本节学习目标

- 掌握 ID 选择器 `#idName` 的写法。
- 理解 ID 在页面中的唯一性约束。
- 能够判断什么时候应该使用 ID，什么时候应该改用类选择器。

---

## 📖 什么是 ID 选择器

ID 选择器通过元素的 `id` 属性匹配元素。CSS 中以 `#` 开头，例如 `#app`、`#chat-root`、`#prompt-input`。

按照 HTML 规范，同一个页面中相同的 `id` 应该只出现一次。也就是说，ID 更适合标记页面中的唯一节点，而不是可复用组件。

在现代前端开发中，ID 常用于页面锚点、表单 label 关联、JavaScript 精准查找节点；纯样式层面则更推荐使用类选择器。

---

## 🧠 原理讲解

HTML 中定义 ID：

```html
<main id="chat-root">...</main>
```

CSS 中通过 `#chat-root` 匹配：

```css
#chat-root {
  max-width: 760px;
}
```

ID 选择器的优先级高于类选择器。如果大量使用 ID 写样式，后续覆盖会变得困难，因此不适合作为日常组件样式主力。

---

## 🏗 基本结构

```html
<style>
  #app {
    max-width: 720px;
    margin: 0 auto;
  }
</style>

<main id="app">
  <h1>AI 控制台</h1>
</main>
```

---

## ✅ 完整代码

下面用 ID 标记唯一应用根节点，同时用类选择器处理组件样式：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>ID 选择器示例</title>
  <style>
    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f3f4f6;
      color: #111827;
    }

    #chat-root {
      max-width: 760px;
      margin: 0 auto;
    }

    .panel {
      padding: 24px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .prompt-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .prompt-input {
      box-sizing: border-box;
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font: inherit;
    }
  </style>
</head>
<body>
  <main id="chat-root">
    <section class="panel">
      <h1>Prompt 调试器</h1>
      <label class="prompt-label" for="prompt-input">输入 Prompt</label>
      <textarea id="prompt-input" class="prompt-input">请总结这段资料。</textarea>
    </section>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

`#chat-root` 匹配页面唯一的聊天应用根节点，用于控制整体宽度和居中。

`.panel` 仍然使用类选择器，因为面板可能在页面中复用。

`label` 的 `for="prompt-input"` 与 `textarea` 的 `id="prompt-input"` 建立关联，点击标签即可聚焦输入框。

`.prompt-input` 负责 textarea 的视觉样式，避免把样式绑定死在 ID 上。

---

## 🌐 浏览器表现

页面会显示一个居中的 Prompt 调试面板。点击“输入 Prompt”标签时，浏览器会自动把焦点移动到文本框。

在 DevTools 中查看 `textarea`，可以看到它同时拥有 `id` 和 `class`。ID 用于唯一关联，类名用于样式，这是更稳妥的分工。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `id` | HTML 属性 | 页面内唯一标识 | `id="chat-root"` |
| `#chat-root` | ID 选择器 | 选择指定 ID 的元素 | `#chat-root { max-width: 760px; }` |
| `for` | HTML 属性 | 关联表单控件 ID | `for="prompt-input"` |
| `getElementById` | DOM API | 通过 ID 查找元素 | `document.getElementById("app")` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- ID 选择器以 `#` 开头，匹配元素的 `id`。
- 同一页面中 ID 应保持唯一。
- 样式复用优先使用类选择器，ID 更适合唯一节点和表单关联。

---

## ⚠️ 易错点

- 易错点1：多个元素使用同一个 ID。正确写法：重复元素用类名，唯一元素才用 ID。
- 易错点2：所有样式都用 ID 写。正确写法：组件样式优先用类选择器。
- 易错点3：`label for` 的值和控件 ID 不一致。正确写法：两者必须完全相同。

---

## 💡 最佳实践

- 页面根节点可以使用 `#app`、`#root`、`#chat-root` 这类 ID。
- 表单控件使用 ID 连接 `<label>`，提升可用性和无障碍体验。
- 不要为了“更精准”滥用 ID，精准不等于可维护。

---

## 🚀 AI 应用场景

AI 应用常有唯一根节点和唯一输入框。ID 可以方便 JS 定位这些节点，但样式仍建议放在类名上。

```html
<textarea id="prompt-input" class="prompt-input"></textarea>
<button id="send-button" class="send-button">发送</button>
```

```css
.prompt-input {
  min-height: 140px;
}

.send-button {
  background: #2563eb;
}
```

---

## 📝 练习题

1. [基础题] 创建一个 `id="app"` 的根节点，并用 ID 选择器设置最大宽度。
2. [进阶题] 用 `label for` 和表单控件 ID 建立可点击标签。
3. [AI 场景题] 设计一个 Prompt 输入区，要求 ID 用于表单关联，类名用于样式。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| ID 选择器 | 通过 `#id` 匹配唯一元素 |
| 唯一性 | 同页同 ID 不应重复 |
| 优先级 | ID 选择器优先级高，不适合滥用 |
| AI 表单 | ID 常用于 Prompt 输入框和标签关联 |

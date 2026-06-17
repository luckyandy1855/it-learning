# JavaScript 简介（JS-001）

## 🎯 本节学习目标

- 理解 JavaScript 在前端中的职责：让页面具备交互和动态行为。
- 掌握 JavaScript 与 HTML、CSS 的分工关系。
- 能够用 JavaScript 为 AI 聊天界面添加最基础的消息交互。

---

## 📖 什么是 JavaScript

JavaScript 是浏览器内置支持的脚本语言，用来控制网页行为。HTML 负责页面结构，CSS 负责视觉表现，JavaScript 负责响应用户操作、读写数据、调用接口和更新页面。

在 AI 应用里，JavaScript 是连接用户界面和模型服务的关键层。用户点击发送按钮后，前端需要读取输入内容、渲染用户消息、调用 AI 接口、接收返回结果，再把 AI 回复显示到页面上。

JavaScript 不只运行在浏览器中，也可以通过 Node.js 运行在服务端。但本课程前期重点放在浏览器 JavaScript，因为它是理解 AI Web 应用交互的入口。

---

## 🧠 原理讲解

浏览器加载网页后，会解析 HTML 得到 DOM 树。JavaScript 可以通过 DOM API 找到页面元素，并修改元素内容、属性、样式或结构。

一个最小交互流程通常是：

```text
用户操作
  ↓
触发事件
  ↓
JavaScript 执行逻辑
  ↓
修改 DOM 或调用接口
  ↓
浏览器更新页面
```

例如点击“发送”按钮后，JavaScript 可以读取输入框内容，并把它追加到消息列表中。

---

## 🏗 基本结构

最小 JavaScript 可以直接写在 `<script>` 标签中：

```html
<button id="sendButton">发送</button>

<script>
  const button = document.querySelector("#sendButton");

  button.addEventListener("click", function () {
    console.log("用户点击了发送按钮");
  });
</script>
```

---

## ✅ 完整代码

下面是一个最小 AI 聊天交互页面：输入问题后点击发送，把用户消息显示到页面中。

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>JavaScript AI 聊天示例</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 32px;
      color: #111827;
    }

    .chat {
      max-width: 680px;
    }

    .message {
      margin: 12px 0;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
    }

    textarea {
      width: 100%;
      min-height: 80px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <main class="chat">
    <h1>AI 学习助手</h1>
    <div id="messages"></div>
    <textarea id="promptInput" placeholder="输入你的问题"></textarea>
    <button id="sendButton" type="button">发送</button>
  </main>

  <script>
    const messages = document.querySelector("#messages");
    const promptInput = document.querySelector("#promptInput");
    const sendButton = document.querySelector("#sendButton");

    sendButton.addEventListener("click", function () {
      const prompt = promptInput.value.trim();

      if (prompt === "") {
        return;
      }

      const message = document.createElement("p");
      message.className = "message";
      message.textContent = "你：" + prompt;
      messages.append(message);

      promptInput.value = "";
    });
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

`document.querySelector("#messages")` 从页面中找到消息列表容器。

`document.querySelector("#promptInput")` 找到用户输入框，后续可以读取它的 `value`。

`sendButton.addEventListener("click", ...)` 监听按钮点击事件。用户每点击一次，函数就执行一次。

`promptInput.value.trim()` 读取输入框内容，并去掉开头和结尾的空白字符。

`if (prompt === "") return;` 阻止空消息进入聊天记录。

`document.createElement("p")` 创建一个新的段落节点，用来显示用户消息。

`message.textContent = "你：" + prompt` 设置节点文本。这里使用 `textContent`，可以避免用户输入被当成 HTML 执行。

`messages.append(message)` 把新消息追加到消息列表末尾。

---

## 🌐 浏览器表现

浏览器打开页面后，会显示标题、空消息区、输入框和发送按钮。输入文字并点击按钮后，页面会新增一条“你：……”消息。

在 DevTools 的 Console 面板中可以调试 JavaScript 输出；在 Elements 面板中可以看到点击按钮后 DOM 新增了 `<p class="message">` 节点。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `document.querySelector()` | DOM API | 查找匹配选择器的第一个元素 | `document.querySelector("#app")` |
| `addEventListener()` | DOM API | 监听用户事件 | `button.addEventListener("click", fn)` |
| `value` | DOM 属性 | 表单控件当前值 | `input.value` |
| `textContent` | DOM 属性 | 设置或读取纯文本内容 | `node.textContent = "你好"` |
| `append()` | DOM API | 追加子节点 | `list.append(item)` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- JavaScript 负责网页交互、数据处理和动态更新。
- 浏览器中的 JavaScript 主要通过 DOM API 操作页面。
- AI Web 应用的发送、渲染、流式输出和错误提示都离不开 JavaScript。

---

## ⚠️ 易错点

- 易错点1：把 JavaScript 当成只会弹窗的脚本。正确写法：把它理解为前端应用逻辑层。
- 易错点2：直接用 `innerHTML` 渲染用户输入。正确写法：优先用 `textContent` 显示不可信文本。
- 易错点3：没有判断空输入。正确写法：发送前使用 `trim()` 做基础校验。

---

## 💡 最佳实践

- 初学阶段优先把 HTML、CSS、JavaScript 写在同一个示例里，方便观察完整流程。
- 真实项目中应把 JavaScript 拆到独立 `.js` 文件，并按功能组织代码。
- 涉及用户输入时，默认把输入当成不可信数据处理。

---

## 🚀 AI 应用场景

AI 聊天界面的核心交互是“读输入、发请求、写回页面”。本节先完成读输入和写回页面，后续再接入真实接口。

```js
function addUserMessage(prompt) {
  const message = document.createElement("p");
  message.textContent = "你：" + prompt;
  document.querySelector("#messages").append(message);
}

addUserMessage("请用三句话解释 JavaScript。");
```

---

## 📝 练习题

1. [基础题] 写一个按钮，点击后在 Console 中输出“发送 Prompt”。
2. [进阶题] 把输入框中的文字追加到页面列表中，并清空输入框。
3. [AI 场景题] 为 AI 回复也创建一条消息，内容固定为“我已收到你的问题”。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| JavaScript | 让网页具备交互和动态行为的语言 |
| DOM | 浏览器把 HTML 解析后得到的页面对象结构 |
| 事件监听 | 让代码响应用户操作 |
| AI 界面 | JavaScript 负责连接输入、模型接口和页面渲染 |

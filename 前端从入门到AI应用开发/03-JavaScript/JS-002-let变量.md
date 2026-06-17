# let 变量（JS-002）

## 🎯 本节学习目标

- 掌握 `let` 的基本语法和适用场景。
- 理解变量是程序中保存临时数据的名字。
- 能够用 `let` 管理 AI 对话界面中会变化的状态。

---

## 📖 什么是 let

`let` 是 JavaScript 中声明变量的关键字。变量可以理解为一个带名字的存储位置，用来保存后续可能变化的数据。

例如用户正在输入的 Prompt、当前选择的模型、接口请求状态、消息数量，都可能随着交互变化，因此适合用变量保存。

`let` 声明的变量可以重新赋值，但不能在同一作用域中重复声明。这让代码既能表达“这个值会变”，又能避免不小心创建两个同名变量。

---

## 🧠 原理讲解

变量声明分为两步：先创建名字，再把值放进去。

```text
let currentModel = "gpt-4.1";
      ↑              ↑
    变量名           变量值
```

当代码执行到重新赋值语句时，变量名不变，里面保存的值会更新：

```js
let currentModel = "fast-model";
currentModel = "reasoning-model";
```

这适合描述前端界面里的状态变化。

---

## 🏗 基本结构

```html
<script>
  let promptText = "解释 JavaScript 变量";
  console.log(promptText);

  promptText = "解释 let 和 const 的区别";
  console.log(promptText);
</script>
```

---

## ✅ 完整代码

下面用 `let` 保存 AI 对话的当前输入和消息数量：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>let 变量示例</title>
</head>
<body>
  <h1>AI Prompt 计数器</h1>
  <textarea id="promptInput" placeholder="输入 Prompt"></textarea>
  <button id="sendButton" type="button">发送</button>
  <p id="status">已发送 0 条消息</p>

  <script>
    const promptInput = document.querySelector("#promptInput");
    const sendButton = document.querySelector("#sendButton");
    const status = document.querySelector("#status");

    let messageCount = 0;
    let latestPrompt = "";

    sendButton.addEventListener("click", function () {
      latestPrompt = promptInput.value.trim();

      if (latestPrompt === "") {
        status.textContent = "请输入 Prompt 后再发送";
        return;
      }

      messageCount = messageCount + 1;
      status.textContent = "已发送 " + messageCount + " 条消息，最近一条是：" + latestPrompt;
      promptInput.value = "";
    });
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

`let messageCount = 0;` 声明消息计数变量，初始值是 `0`。

`let latestPrompt = "";` 声明最近一次输入的 Prompt，初始值是空字符串。

`latestPrompt = promptInput.value.trim();` 每次点击发送时，都会把输入框最新内容保存到变量中。

`messageCount = messageCount + 1;` 在原有计数基础上加 `1`，表示成功发送了一条新消息。

`status.textContent = ...` 使用最新变量值更新页面状态文案。

---

## 🌐 浏览器表现

页面初始显示“已发送 0 条消息”。输入 Prompt 并点击发送后，状态会变为“已发送 1 条消息，最近一条是：……”。继续发送，数字会继续增加。

如果直接点击发送按钮，页面会提示“请输入 Prompt 后再发送”。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `let` | 关键字 | 声明可重新赋值的变量 | `let count = 0;` |
| `=` | 赋值运算符 | 把右侧值保存到左侧变量 | `count = 1;` |
| `+` | 运算符 | 数字相加或字符串拼接 | `count + 1` |
| `trim()` | 字符串方法 | 去掉首尾空白 | `text.trim()` |
| `textContent` | DOM 属性 | 更新页面纯文本 | `status.textContent = "完成"` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `let` 用来声明后续会变化的变量。
- 同一个作用域内不要重复声明同名 `let` 变量。
- AI 应用中的输入内容、加载状态、消息计数都适合用 `let` 表达变化。

---

## ⚠️ 易错点

- 易错点1：用 `let` 声明后又在同一作用域重复声明。正确写法：需要更新时只赋值，不再写 `let`。
- 易错点2：变量名没有表达含义。正确写法：使用 `messageCount`、`latestPrompt` 这类清晰名字。
- 易错点3：所有值都用 `let`。正确写法：不会变化的值优先用 `const`。

---

## 💡 最佳实践

- 变量名使用小驼峰命名，例如 `currentModel`、`isLoading`。
- 只在确实需要重新赋值时使用 `let`。
- 变量声明尽量靠近使用位置，减少阅读负担。

---

## 🚀 AI 应用场景

在 AI 对话中，请求状态会变化：未发送、等待中、已完成、失败。可以先用 `let` 表达这种状态。

```js
let requestStatus = "idle";

requestStatus = "loading";
console.log("正在等待 AI 回复");

requestStatus = "done";
console.log("AI 回复完成");
```

---

## 📝 练习题

1. [基础题] 用 `let` 声明一个 `count` 变量，并让它加 1。
2. [进阶题] 用 `let` 保存当前选择的模型名称，并模拟切换模型。
3. [AI 场景题] 用 `let` 保存 `isGenerating` 状态，点击按钮后把它从 `false` 改为 `true`。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `let` | 声明可变化变量的关键字 |
| 变量 | 用名字保存程序运行中的数据 |
| 重新赋值 | 改变变量当前保存的值 |
| AI 状态 | 对话输入、计数和请求状态经常需要变量管理 |

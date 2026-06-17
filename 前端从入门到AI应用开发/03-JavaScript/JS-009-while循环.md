# while 循环（JS-009）

## 🎯 本节学习目标

- 掌握 `while` 循环的基本写法。
- 理解 `while` 适合条件驱动的重复执行。
- 能够用 `while` 模拟 AI 流式输出中的分段处理。

---

## 📖 什么是 while 循环

`while` 循环会在条件为真时反复执行代码块。它不像 `for` 循环那样把初始化、条件和更新集中写在一行，而是更强调“只要条件成立，就继续做”。

在 AI 应用中，`while` 可以用来理解分段处理、队列消费、重试控制等逻辑。例如只要还有待处理的文本片段，就继续读取并拼接输出。

实际 Web 流式接口通常不会直接用简单 `while` 处理全部逻辑，但理解 `while` 有助于学习后面的 SSE、ReadableStream 和异步循环。

---

## 🧠 原理讲解

`while` 的结构是：

```js
while (condition) {
  // 条件为 true 时重复执行
}
```

执行顺序：

```text
1. 判断 condition
2. 如果为 true，执行循环体
3. 回到第 1 步继续判断
4. 如果为 false，结束循环
```

使用 `while` 时必须确保条件最终会变成 `false`，否则会形成无限循环，导致页面卡住。

---

## 🏗 基本结构

```html
<script>
  let remaining = 3;

  while (remaining > 0) {
    console.log("还有 " + remaining + " 个片段待处理");
    remaining = remaining - 1;
  }
</script>
```

---

## ✅ 完整代码

下面用 `while` 模拟把 AI 回复分段合并成完整文本：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>while 循环示例</title>
</head>
<body>
  <h1>AI 分段回复合并</h1>
  <button id="mergeButton" type="button">合并回复</button>
  <pre id="output"></pre>

  <script>
    const chunks = ["JavaScript ", "可以读取用户输入，", "调用接口，", "并更新页面。"];
    const mergeButton = document.querySelector("#mergeButton");
    const output = document.querySelector("#output");

    mergeButton.addEventListener("click", function () {
      let index = 0;
      let fullText = "";

      while (index < chunks.length) {
        fullText = fullText + chunks[index];
        index = index + 1;
      }

      output.textContent = fullText;
    });
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

`const chunks = [...]` 保存模拟的 AI 回复片段。

`let index = 0;` 定义当前处理到第几个片段。

`let fullText = "";` 用来累积完整回复。

`while (index < chunks.length)` 表示只要还没处理完所有片段，就继续循环。

`fullText = fullText + chunks[index];` 把当前片段追加到完整文本后面。

`index = index + 1;` 更新索引，避免循环一直停在同一个片段。

---

## 🌐 浏览器表现

页面初始显示按钮和空输出区。点击按钮后，`while` 循环会把四个文本片段合并，并显示为一段完整回复。

如果删除 `index = index + 1;`，页面会因为无限循环而卡住，这是学习 `while` 时最需要避免的问题。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `while` | 循环语句 | 条件为真时重复执行 | `while (ok) {}` |
| 循环条件 | 表达式 | 控制循环是否继续 | `index < chunks.length` |
| 累加变量 | 变量模式 | 保存逐步累积的结果 | `fullText = fullText + chunk` |
| `length` | 数组属性 | 获取数组长度 | `chunks.length` |
| `textContent` | DOM 属性 | 显示纯文本结果 | `output.textContent = fullText` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `while` 适合“条件成立就继续”的场景。
- 循环体中必须有机会改变条件，否则会无限循环。
- AI 流式输出可以理解为不断接收片段并合并文本。

---

## ⚠️ 易错点

- 易错点1：忘记更新循环变量。正确写法：确保 `index`、`remaining` 等变量会变化。
- 易错点2：循环条件永远为真。正确写法：设计清晰的停止条件。
- 易错点3：在浏览器主线程执行超长同步循环。正确写法：大量任务应分批或异步处理。

---

## 💡 最佳实践

- 使用 `while` 前先写清楚停止条件。
- 如果可以用数组方法或 `for...of` 更清晰，优先选择更易读的写法。
- 处理流式数据时，要注意 UI 更新节奏，避免阻塞页面。

---

## 🚀 AI 应用场景

下面用 `while` 表达“只要队列里还有 AI 片段，就继续取出处理”的思路：

```js
const queue = ["第一段", "第二段", "第三段"];
let answer = "";

while (queue.length > 0) {
  const chunk = queue.shift();
  answer = answer + chunk;
}
```

---

## 📝 练习题

1. [基础题] 用 `while` 输出 3、2、1。
2. [进阶题] 用 `while` 把字符串数组合并成一个字符串。
3. [AI 场景题] 模拟一个 AI 回复片段队列，用 `while` 依次取出并拼接。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `while` 循环 | 条件为真时持续执行代码块 |
| 停止条件 | 防止无限循环的关键 |
| 累积结果 | 循环常用于逐步拼接或统计 |
| AI 流式思维 | 回复片段可以被逐步读取和合并 |

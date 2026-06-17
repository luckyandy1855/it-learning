# for 循环（JS-008）

## 🎯 本节学习目标

- 掌握 `for` 循环的基本结构。
- 理解初始化、循环条件和更新语句的作用。
- 能够用 `for` 循环渲染 AI 对话消息列表。

---

## 📖 什么是 for 循环

`for` 循环用于重复执行一段代码，尤其适合处理“已知次数”或“按索引遍历列表”的场景。

在 AI 应用中，消息列表、历史 Prompt、推荐问题、检索结果都可能是数组。使用 `for` 循环可以逐条处理这些数据，并渲染到页面上。

`for` 循环的优势是控制精确：你可以决定从第几个元素开始、什么时候停止、每次索引如何变化。

---

## 🧠 原理讲解

`for` 循环包含三个部分：

```js
for (初始化; 条件; 更新) {
  // 重复执行的代码
}
```

执行顺序是：

```text
1. 执行初始化
2. 判断条件
3. 条件为 true，执行循环体
4. 执行更新语句
5. 回到第 2 步
6. 条件为 false，循环结束
```

例如：

```js
for (let index = 0; index < 3; index = index + 1) {
  console.log(index);
}
```

---

## 🏗 基本结构

```html
<script>
  const prompts = ["总结文章", "生成标题", "提取行动项"];

  for (let index = 0; index < prompts.length; index = index + 1) {
    console.log(prompts[index]);
  }
</script>
```

---

## ✅ 完整代码

下面用 `for` 循环渲染一组 AI 对话消息：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>for 循环示例</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 32px;
    }

    .message {
      padding: 12px;
      margin: 8px 0;
      border: 1px solid #d1d5db;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>AI 对话记录</h1>
  <div id="messages"></div>

  <script>
    const messages = [
      { role: "user", content: "请总结这段文本。" },
      { role: "assistant", content: "可以，我会提取关键结论。" },
      { role: "user", content: "再给出三个行动项。" }
    ];

    const container = document.querySelector("#messages");

    for (let index = 0; index < messages.length; index = index + 1) {
      const message = messages[index];
      const item = document.createElement("p");
      item.className = "message";
      item.textContent = (index + 1) + ". " + message.role + "：" + message.content;
      container.append(item);
    }
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

`const messages = [...]` 定义消息数组，每个元素是一条消息对象。

`for (let index = 0; index < messages.length; index = index + 1)` 从索引 `0` 开始遍历，直到索引小于数组长度。

`const message = messages[index];` 通过索引取出当前消息。

`document.createElement("p")` 创建一个段落节点。

`item.textContent = ...` 把序号、角色和消息内容组合成文本。

`container.append(item)` 把消息节点追加到页面中。

---

## 🌐 浏览器表现

页面会显示三条按顺序排列的 AI 对话记录，每条消息都有边框和间距。

在 DevTools 中可以看到，JavaScript 根据数组长度创建了三个 `<p class="message">` 节点。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `for` | 循环语句 | 按条件重复执行代码 | `for (...) {}` |
| `index` | 变量 | 常见循环索引名 | `messages[index]` |
| `length` | 数组属性 | 数组元素数量 | `messages.length` |
| `createElement()` | DOM API | 创建元素节点 | `document.createElement("p")` |
| `append()` | DOM API | 追加节点 | `container.append(item)` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `for` 循环适合按索引遍历数组。
- 循环条件写错容易造成漏处理或无限循环。
- 渲染 AI 消息列表时，循环是最基础的数据到页面转换方式。

---

## ⚠️ 易错点

- 易错点1：循环条件写成 `index <= messages.length`。正确写法：数组最后一个索引是 `length - 1`，条件应为 `index < messages.length`。
- 易错点2：忘记更新索引。正确写法：每轮执行 `index = index + 1` 或 `index++`。
- 易错点3：循环里直接拼接不可信 HTML。正确写法：用户内容优先使用 `textContent`。

---

## 💡 最佳实践

- 遍历数组时条件通常写成 `index < array.length`。
- 循环体内尽量先取出当前项，例如 `const message = messages[index]`。
- 渲染用户生成内容时避免直接使用 `innerHTML`。

---

## 🚀 AI 应用场景

AI 对话历史通常是数组，可以用 `for` 循环生成上下文摘要：

```js
const history = [
  { role: "user", content: "解释 CSS" },
  { role: "assistant", content: "CSS 控制页面样式。" }
];

let transcript = "";

for (let index = 0; index < history.length; index = index + 1) {
  transcript = transcript + history[index].role + "：" + history[index].content + "\n";
}
```

---

## 📝 练习题

1. [基础题] 用 `for` 循环输出 1 到 5。
2. [进阶题] 遍历 Prompt 模板数组，并把每一项渲染成 `<li>`。
3. [AI 场景题] 遍历消息数组，统计其中 `role` 为 `"user"` 的消息数量。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `for` 循环 | 适合已知次数和按索引遍历 |
| 循环条件 | 决定循环什么时候停止 |
| 索引 | 用来访问数组中的具体元素 |
| AI 消息渲染 | 循环把消息数组转换成页面节点 |

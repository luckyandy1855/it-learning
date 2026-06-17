# for...of 循环（JS-010）

## 🎯 本节学习目标

- 掌握 `for...of` 遍历数组和字符串的基本写法。
- 理解 `for...of` 与传统 `for` 循环的区别。
- 能够用 `for...of` 更直观地处理 AI 消息列表和 Prompt 模板。

---

## 📖 什么是 for...of

`for...of` 是 JavaScript 中遍历可迭代数据的语法。它可以直接拿到数组中的每一项，而不需要手动管理索引。

相比传统 `for` 循环，`for...of` 更适合“只关心每一项内容，不关心索引”的场景。在 AI 应用中，遍历消息、Prompt 模板、标签、推荐问题时经常可以使用它。

如果你需要当前索引，传统 `for` 循环或 `entries()` 会更合适；如果只需要值，`for...of` 通常更清晰。

---

## 🧠 原理讲解

基本结构：

```js
for (const item of list) {
  console.log(item);
}
```

可以理解为：

```text
从 list 中依次取出每一项
把当前项命名为 item
执行循环体
直到所有项处理完
```

`for...of` 可以遍历数组、字符串、Map、Set 等可迭代对象。本节先聚焦数组和字符串。

---

## 🏗 基本结构

```html
<script>
  const prompts = ["总结文章", "生成标题", "提取行动项"];

  for (const prompt of prompts) {
    console.log(prompt);
  }
</script>
```

---

## ✅ 完整代码

下面用 `for...of` 渲染 AI Prompt 模板列表：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>for...of 循环示例</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 32px;
    }

    li {
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <h1>AI Prompt 模板</h1>
  <ul id="promptList"></ul>

  <script>
    const promptTemplates = [
      "把下面内容总结成三条要点",
      "为这篇文章生成 5 个标题",
      "提取会议纪要中的行动项",
      "把这段话改写成小红书风格"
    ];

    const promptList = document.querySelector("#promptList");

    for (const template of promptTemplates) {
      const item = document.createElement("li");
      item.textContent = template;
      promptList.append(item);
    }
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

`const promptTemplates = [...]` 定义 Prompt 模板数组。

`const promptList = document.querySelector("#promptList");` 获取列表容器。

`for (const template of promptTemplates)` 表示依次取出数组中的每个模板。

`const item = document.createElement("li")` 为当前模板创建列表项。

`item.textContent = template;` 把模板文本写入列表项。

`promptList.append(item);` 把列表项追加到页面中。

---

## 🌐 浏览器表现

页面会显示一个无序列表，里面包含四条 Prompt 模板。每条模板都来自数组中的一个元素。

在 DevTools 中可以看到，`for...of` 循环创建了四个 `<li>` 节点，顺序与数组一致。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `for...of` | 循环语法 | 遍历可迭代对象的每一项 | `for (const item of list)` |
| `const item` | 循环变量 | 保存当前项 | `const template` |
| 数组 | 可迭代对象 | 可被 `for...of` 遍历 | `["a", "b"]` |
| 字符串 | 可迭代对象 | 可逐字符遍历 | `for (const char of text)` |
| `append()` | DOM API | 追加节点 | `list.append(item)` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `for...of` 直接拿到当前项，不需要手动写索引。
- 只关心数组元素本身时，`for...of` 通常比传统 `for` 更清晰。
- 渲染 AI Prompt 模板、消息列表和标签列表时很常用。

---

## ⚠️ 易错点

- 易错点1：把 `for...of` 和 `for...in` 混用。正确写法：遍历数组值用 `for...of`。
- 易错点2：需要索引时仍强行使用普通 `for...of`。正确写法：需要索引可用 `entries()`。
- 易错点3：循环变量在循环体外使用。正确写法：循环变量只在循环内部使用。

---

## 💡 最佳实践

- 只需要当前项时，优先考虑 `for...of`。
- 遍历用户可见内容时，渲染文本仍优先使用 `textContent`。
- 命名循环变量时用具体含义，例如 `message`、`template`、`chunk`。

---

## 🚀 AI 应用场景

遍历对话消息并生成上下文文本：

```js
const messages = [
  { role: "system", content: "你是前端学习助手。" },
  { role: "user", content: "解释 for...of。" }
];

let context = "";

for (const message of messages) {
  context = context + message.role + "：" + message.content + "\n";
}
```

---

## 📝 练习题

1. [基础题] 用 `for...of` 输出数组中的每个字符串。
2. [进阶题] 用 `for...of` 把一组标签渲染成按钮。
3. [AI 场景题] 遍历消息数组，把每条消息格式化成 `role：content` 文本。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `for...of` | 直接遍历可迭代对象中的每一项 |
| 数组遍历 | 不需要索引时更简洁 |
| 循环变量 | 表示当前正在处理的元素 |
| AI 列表处理 | Prompt 模板和消息列表都适合用 `for...of` |

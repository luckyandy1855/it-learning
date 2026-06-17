# var 与作用域（JS-004）

## 🎯 本节学习目标

- 理解 `var` 是 JavaScript 早期声明变量的方式。
- 掌握 `var`、`let`、`const` 在作用域上的核心区别。
- 能够在阅读旧代码或第三方示例时识别 `var` 的风险。

---

## 📖 什么是 var

`var` 是 JavaScript 早期用于声明变量的关键字。在现代前端开发中，通常优先使用 `const` 和 `let`，只在维护旧代码或理解历史示例时接触 `var`。

`var` 最大的问题是作用域规则不够直观。它没有块级作用域，只有函数作用域或全局作用域，因此在 `if`、`for` 这类代码块中声明的变量，可能在代码块外仍然能访问。

在 AI 应用开发中，如果旧代码使用大量 `var` 管理请求状态、循环索引或消息内容，容易出现变量被意外覆盖的问题。

---

## 🧠 原理讲解

作用域决定变量在哪里可以被访问。

`let` 和 `const` 有块级作用域：

```js
if (true) {
  let status = "loading";
}

console.log(status); // 错误：块外访问不到
```

`var` 没有块级作用域：

```js
if (true) {
  var status = "loading";
}

console.log(status); // 可以访问到
```

这会让变量边界变得模糊，所以现代代码更推荐 `let` 和 `const`。

---

## 🏗 基本结构

```html
<script>
  var oldMessage = "这是旧写法";
  let currentMessage = "这是现代写法";
  const appName = "AI 助手";

  console.log(oldMessage, currentMessage, appName);
</script>
```

---

## ✅ 完整代码

下面对比 `var` 和 `let` 在 AI 消息循环中的表现：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>var 与作用域示例</title>
</head>
<body>
  <h1>AI 消息作用域示例</h1>
  <div id="messages"></div>

  <script>
    const messages = document.querySelector("#messages");
    const replies = ["你好，我是 AI 助手。", "我可以帮你整理知识点。", "也可以生成练习题。"];

    for (let index = 0; index < replies.length; index = index + 1) {
      const item = document.createElement("p");
      item.textContent = "第 " + (index + 1) + " 条回复：" + replies[index];
      messages.append(item);
    }

    if (replies.length > 0) {
      var legacyStatus = "旧代码状态：已有 AI 回复";
      let modernStatus = "现代代码状态：已有 AI 回复";
    }

    const legacyItem = document.createElement("p");
    legacyItem.textContent = legacyStatus;
    messages.append(legacyItem);

    // console.log(modernStatus); // 取消注释会报错，因为 let 有块级作用域。
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

`const replies = [...]` 保存三条 AI 回复示例，这个数组引用不需要重新赋值。

`for (let index = 0; ...)` 使用 `let` 声明循环索引，索引只在循环块中有效。

`const item = document.createElement("p")` 在每轮循环中创建新的消息节点。

`var legacyStatus = ...` 在 `if` 块中声明变量，但它仍然可以在块外访问。

`let modernStatus = ...` 只在 `if` 块内有效，块外访问会报错。

注释掉的 `console.log(modernStatus)` 用来提醒：现代写法会把变量限制在更清晰的范围内。

---

## 🌐 浏览器表现

页面会显示三条 AI 回复，然后显示一条“旧代码状态：已有 AI 回复”。这是因为 `legacyStatus` 用 `var` 声明，即使写在 `if` 块中，块外也能访问。

如果取消最后一行注释，Console 会报错，说明 `modernStatus` 不在当前作用域内。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `var` | 关键字 | 旧式变量声明，函数作用域 | `var name = "AI";` |
| `let` | 关键字 | 现代变量声明，块级作用域 | `let count = 0;` |
| `const` | 关键字 | 不可重新赋值绑定，块级作用域 | `const app = "助手";` |
| 作用域 | 语言规则 | 决定变量可访问范围 | `{ let x = 1 }` |
| `for` | 语句 | 常见循环结构 | `for (let i = 0; i < 3; i++)` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 新代码优先使用 `const` 和 `let`，少用或不用 `var`。
- `var` 没有块级作用域，容易扩大变量可见范围。
- 阅读旧教程、旧项目和复制来的代码时，需要特别留意 `var`。

---

## ⚠️ 易错点

- 易错点1：在 `if` 块中用 `var` 后，以为块外访问不到。正确理解：`var` 不受块级作用域限制。
- 易错点2：在循环中用 `var` 保存索引并绑定异步回调。正确写法：现代代码使用 `let`。
- 易错点3：混用 `var`、`let`、`const` 没有规则。正确写法：默认 `const`，需要变化用 `let`，旧代码才理解 `var`。

---

## 💡 最佳实践

- 新项目可以通过 ESLint 禁止使用 `var`。
- 维护旧代码时，不要机械替换所有 `var`；先确认作用域和赋值逻辑。
- 变量作用域越小，越容易维护和调试。

---

## 🚀 AI 应用场景

AI 聊天界面经常会遍历消息列表并绑定事件。循环变量建议使用 `let`，避免旧式 `var` 带来的闭包问题。

```js
const prompts = ["总结文章", "生成标题", "提取要点"];

for (let index = 0; index < prompts.length; index = index + 1) {
  console.log("Prompt " + index + "：" + prompts[index]);
}
```

---

## 📝 练习题

1. [基础题] 写一个 `if` 代码块，分别用 `var` 和 `let` 声明变量，观察块外能否访问。
2. [进阶题] 用 `for` 循环渲染三条 AI 回复，循环索引用 `let`。
3. [AI 场景题] 阅读一段含 `var` 的 Prompt 列表渲染代码，并说明可能的作用域风险。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `var` | 旧式变量声明方式，不推荐写新代码时使用 |
| 函数作用域 | `var` 主要受函数边界限制 |
| 块级作用域 | `let` 和 `const` 会受 `{}` 代码块限制 |
| AI 代码维护 | 旧代码中的 `var` 可能导致状态被意外共享 |

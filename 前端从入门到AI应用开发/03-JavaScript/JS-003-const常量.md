# const 常量（JS-003）

## 🎯 本节学习目标

- 掌握 `const` 的基本语法和使用边界。
- 理解“绑定不可重新赋值”和“对象内容可变”的区别。
- 能够用 `const` 保存 AI 应用中的稳定配置和 DOM 引用。

---

## 📖 什么是 const

`const` 是 JavaScript 中声明常量的关键字。它声明的变量必须在声明时赋值，并且之后不能重新指向另一个值。

在前端代码中，很多值并不需要重新赋值，例如 DOM 元素引用、API 地址、默认模型配置、角色名称。这类值优先使用 `const`，可以减少误改风险。

需要注意：`const` 限制的是变量绑定本身，而不是对象内部内容。`const config = { model: "fast" }` 之后不能把 `config` 改成另一个对象，但可以修改 `config.model`。

---

## 🧠 原理讲解

可以把 `const` 理解为“这个名字只能绑定一次”：

```js
const appName = "AI 写作助手";
```

这行代码执行后，`appName` 不能再被重新赋值：

```js
appName = "AI 编程助手"; // 错误
```

但对象保存的是引用。引用不能被替换，对象内部属性仍然可以变：

```js
const settings = { model: "fast" };
settings.model = "reasoning"; // 可以
```

---

## 🏗 基本结构

```html
<script>
  const appName = "AI 学习助手";
  const defaultModel = "gpt-4.1-mini";

  console.log(appName, defaultModel);
</script>
```

---

## ✅ 完整代码

下面用 `const` 保存 AI 应用的固定配置和 DOM 引用：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>const 常量示例</title>
</head>
<body>
  <h1 id="title"></h1>
  <p id="modelInfo"></p>
  <button id="showButton" type="button">显示配置</button>

  <script>
    const appName = "AI 学习助手";
    const defaultModel = "gpt-4.1-mini";
    const apiBaseUrl = "https://api.example.com";

    const title = document.querySelector("#title");
    const modelInfo = document.querySelector("#modelInfo");
    const showButton = document.querySelector("#showButton");

    showButton.addEventListener("click", function () {
      title.textContent = appName;
      modelInfo.textContent = "默认模型：" + defaultModel + "，接口地址：" + apiBaseUrl;
    });
  </script>
</body>
</html>
```

---

## 🔍 逐行解析

`const appName = "AI 学习助手";` 声明应用名称，它在本示例中不会变化。

`const defaultModel = "gpt-4.1-mini";` 保存默认模型名称，避免在代码中重复写字符串。

`const apiBaseUrl = "https://api.example.com";` 保存接口基础地址。真实项目通常会从环境变量或配置文件读取。

`const title = document.querySelector("#title");` 保存 DOM 元素引用。这个变量不需要重新指向其他元素，因此使用 `const`。

点击按钮后，代码读取这些常量并更新页面文本。

---

## 🌐 浏览器表现

页面初始只有一个按钮。点击“显示配置”后，标题会显示“AI 学习助手”，下方会显示默认模型和接口地址。

如果尝试在 Console 中给 `appName` 重新赋值，浏览器会抛出错误，提示常量不能重新赋值。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `const` | 关键字 | 声明不可重新赋值的绑定 | `const model = "fast";` |
| `TypeError` | 错误类型 | 常量重新赋值时常见错误 | `Assignment to constant variable` |
| `querySelector()` | DOM API | 查找 DOM 元素 | `document.querySelector("#title")` |
| 对象属性 | 语言特性 | `const` 对象的属性仍可修改 | `config.model = "pro"` |
| 配置常量 | 代码组织方式 | 集中保存稳定配置 | `const API_URL = "...";` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 默认优先使用 `const`，只有需要重新赋值时才改用 `let`。
- `const` 必须声明时赋值。
- `const` 对象不能重新绑定，但对象内部属性可能仍然可变。

---

## ⚠️ 易错点

- 易错点1：以为 `const` 表示对象完全不可变。正确理解：它只限制变量不能重新指向新值。
- 易错点2：声明 `const` 后不赋值。正确写法：`const name = "AI 助手";`。
- 易错点3：把会变化的状态声明成 `const`。正确写法：请求状态、计数器这类值使用 `let`。

---

## 💡 最佳实践

- 先用 `const`，遇到确实需要重新赋值的变量再改成 `let`。
- DOM 引用通常使用 `const`。
- 固定配置集中声明，避免魔法字符串散落在代码各处。

---

## 🚀 AI 应用场景

AI 应用通常会有一批稳定配置，例如默认温度、最大输出长度、系统提示词名称。可以用 `const` 集中表达。

```js
const defaultGenerationOptions = {
  model: "gpt-4.1-mini",
  temperature: 0.7,
  maxTokens: 800
};

console.log(defaultGenerationOptions.model);
```

---

## 📝 练习题

1. [基础题] 用 `const` 声明一个应用名称并输出到 Console。
2. [进阶题] 用 `const` 保存一个 DOM 元素引用，并修改它的文本。
3. [AI 场景题] 用 `const` 定义一个默认模型配置对象，包含 `model`、`temperature` 和 `maxTokens`。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `const` | 声明不能重新赋值的变量绑定 |
| 固定配置 | 稳定值优先用 `const` 保存 |
| DOM 引用 | 通常不需要重新赋值，适合用 `const` |
| 对象可变性 | `const` 不等于对象深度不可变 |

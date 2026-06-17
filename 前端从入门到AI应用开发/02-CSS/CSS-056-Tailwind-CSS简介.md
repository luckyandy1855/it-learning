# Tailwind CSS 简介（CSS-056）

## 🎯 本节学习目标

- 理解 Tailwind CSS 的工具类优先思想。
- 掌握 Tailwind 与传统 CSS 类名的主要区别。
- 能够判断 AI 应用原型何时适合使用 Tailwind。

---

## 📖 什么是 Tailwind CSS

Tailwind CSS 是一个工具类优先的 CSS 框架。它提供大量低层级 utility class，例如 `flex`、`gap-4`、`p-6`、`text-sm`、`bg-white`。

传统 CSS 通常先写语义类名，再到 CSS 文件里定义样式。Tailwind 则把样式直接组合在 HTML 或 JSX 的 `class` 中。

在 AI 应用开发中，Tailwind 很适合快速搭建聊天界面、控制台、Prompt 表单和卡片布局，尤其适合原型阶段和组件化项目。

---

## 🧠 原理讲解

传统 CSS 写法：

```html
<button class="primary-button">生成</button>
```

```css
.primary-button {
  padding: 10px 16px;
  background: #2563eb;
  color: white;
}
```

Tailwind 写法：

```html
<button class="rounded-md bg-blue-600 px-4 py-2 text-white">生成</button>
```

Tailwind 没有绕开 CSS 本身。它只是把常用 CSS 属性预先做成可组合的类名。

---

## 🏗 基本结构

```html
<div class="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6">
  <h1 class="text-2xl font-bold">AI 助手</h1>
  <p class="mt-3 text-gray-600">使用工具类快速组合界面。</p>
</div>
```

---

## ✅ 完整代码

下面是 Tailwind 风格的 AI 卡片示例：

```html
<main class="min-h-screen bg-slate-50 p-8 text-slate-900">
  <section class="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
    <h1 class="text-2xl font-bold">AI 摘要助手</h1>
    <p class="mt-3 leading-7 text-slate-600">
      Tailwind 使用工具类组合出卡片、文字、间距和按钮样式。
    </p>
    <button class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white">
      开始生成
    </button>
  </section>
</main>
```

---

## 🔍 逐行解析

`min-h-screen` 对应最小高度为一屏。

`bg-slate-50` 和 `text-slate-900` 设置页面背景和文字颜色。

`mx-auto max-w-2xl` 让卡片居中并限制最大宽度。

`rounded-lg border border-slate-200 bg-white p-6` 组合出卡片视觉。

`mt-4 rounded-md bg-blue-600 px-4 py-2 text-white` 组合出按钮样式。

---

## 🌐 浏览器表现

页面会显示一个居中的 AI 摘要助手卡片，包含标题、说明和主按钮。

如果项目已经配置 Tailwind，浏览器会把这些工具类编译成对应 CSS。未配置 Tailwind 时，这些类名只是普通 class，不会自动产生样式。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `p-6` | 工具类 | 设置 padding | `padding: 1.5rem;` |
| `bg-white` | 工具类 | 设置背景色 | 白色背景 |
| `text-sm` | 工具类 | 设置字号 | 小字号 |
| `rounded-lg` | 工具类 | 设置圆角 | 大圆角 |
| `max-w-2xl` | 工具类 | 设置最大宽度 | 阅读容器 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- Tailwind 是工具类优先框架，不是 CSS 替代品。
- Tailwind 类名背后仍然对应具体 CSS 属性。
- 原型开发和组件化项目很适合 Tailwind。

---

## ⚠️ 易错点

- 易错点1：不会 CSS 就直接背 Tailwind 类名。正确写法：先理解 CSS 属性，再使用工具类。
- 易错点2：class 太长且无结构。正确写法：复杂组件拆分成子组件或抽取复用模式。
- 易错点3：未安装配置 Tailwind 就期待类名生效。正确写法：项目需要引入 Tailwind 构建流程。

---

## 💡 最佳实践

- 小型组件可以直接组合工具类。
- 高频重复结构应抽成组件，而不是复制长 class。
- Tailwind 与 CSS 变量、主题 token 可以配合使用。

---

## 🚀 AI 应用场景

AI 应用原型变化快，Tailwind 可以让开发者快速调整布局、间距和状态样式，不必在 HTML 和 CSS 文件之间频繁切换。

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <p class="leading-7 text-slate-700">AI 回复内容</p>
</div>
```

---

## 📝 练习题

1. [基础题] 用 Tailwind 类写一个白色卡片。
2. [进阶题] 用工具类实现一个蓝色主按钮。
3. [AI 场景题] 用 Tailwind 写一个 AI 摘要卡片，包含标题、正文和按钮。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| Tailwind CSS | 工具类优先 CSS 框架 |
| 工具类 | 一个类通常对应少量 CSS 声明 |
| 原型效率 | 适合快速搭建 AI 应用界面 |
| CSS 基础 | Tailwind 仍建立在 CSS 属性理解之上 |

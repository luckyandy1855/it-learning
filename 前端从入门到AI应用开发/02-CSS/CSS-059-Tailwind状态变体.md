# Tailwind 状态变体（CSS-059）

## 🎯 本节学习目标

- 掌握 Tailwind 中 `hover:`、`focus:`、`disabled:` 等状态变体。
- 理解状态变体对应 CSS 伪类和属性状态。
- 能够用状态变体设计 AI 按钮、输入框和模型选项。

---

## 📖 什么是 Tailwind 状态变体

状态变体是 Tailwind 对 CSS 状态选择器的封装。它通过前缀表达 hover、focus、disabled、checked 等状态。

例如 `hover:bg-blue-700` 对应鼠标悬停时改变背景色，`focus:ring-2` 对应聚焦时显示 ring。

在 AI 应用中，状态变体常用于发送按钮、模型卡片、Prompt 输入框、开关和菜单项。

---

## 🧠 原理讲解

Tailwind 写法：

```html
<button class="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300">
```

对应思想：

```css
button:hover {
  background: ...;
}

button:disabled {
  background: ...;
}
```

状态变体可以组合响应式前缀和暗色模式前缀，但过度组合会让 class 很长，需要组件封装。

---

## 🏗 基本结构

```html
<input class="rounded-md border border-slate-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200">
```

---

## ✅ 完整代码

下面用状态变体实现 AI Prompt 表单：

```html
<form class="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
  <label class="block text-sm font-medium text-slate-700" for="prompt">
    Prompt
  </label>
  <textarea
    id="prompt"
    class="mt-2 min-h-32 w-full rounded-md border border-slate-300 px-3 py-2 leading-7 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
  >请把这段内容整理成行动项。</textarea>

  <div class="mt-4 flex gap-2">
    <button
      type="button"
      class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      生成
    </button>
    <button
      type="button"
      disabled
      class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      生成中
    </button>
  </div>
</form>
```

---

## 🔍 逐行解析

`focus:border-blue-600` 表示文本框聚焦时边框变蓝。

`focus:ring-2 focus:ring-blue-200` 创建聚焦外圈反馈。

`hover:bg-blue-700` 表示按钮悬停时颜色加深。

`disabled:cursor-not-allowed disabled:bg-slate-300` 表示禁用按钮显示不可操作状态。

---

## 🌐 浏览器表现

输入框获得焦点时会显示蓝色边框和外圈。普通按钮悬停时变深，禁用按钮显示灰色并禁用点击。

这些效果对应前面学过的伪类选择器和 outline/focus 体验。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `hover:` | 状态变体 | 鼠标悬停状态 | `hover:bg-blue-700` |
| `focus:` | 状态变体 | 聚焦状态 | `focus:ring-2` |
| `disabled:` | 状态变体 | 禁用状态 | `disabled:bg-slate-300` |
| `checked:` | 状态变体 | 选中状态 | `checked:bg-blue-600` |
| `dark:` | 主题变体 | 暗色模式 | `dark:bg-slate-900` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 状态变体是伪类和状态选择器的工具类表达。
- 交互控件至少要考虑 hover、focus、disabled。
- focus 状态不能省略，它影响键盘用户体验。

---

## ⚠️ 易错点

- 易错点1：只写 hover，不写 focus。正确写法：按钮和输入框都要有键盘焦点反馈。
- 易错点2：禁用按钮只改颜色。正确写法：同时设置 cursor 和真实 disabled 属性。
- 易错点3：状态类堆太长。正确写法：重复控件抽组件或抽样式模式。

---

## 💡 最佳实践

- 主按钮使用 hover、focus、disabled 三类状态。
- 输入框聚焦建议使用边框和 ring 双反馈。
- AI 请求中按钮应进入 disabled 状态，避免重复提交。

---

## 🚀 AI 应用场景

AI 生成按钮在 idle、hover、focus、loading/disabled 状态下都要清楚反馈，防止用户重复点击或误以为请求失败。

```html
<button class="bg-blue-600 hover:bg-blue-700 focus:ring-2 disabled:bg-slate-300">
```

---

## 📝 练习题

1. [基础题] 给按钮添加 `hover:` 背景变化。
2. [进阶题] 给输入框添加 `focus:ring-2`。
3. [AI 场景题] 设计一个生成按钮，包含普通、悬停、聚焦、禁用四种状态。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| 状态变体 | Tailwind 对伪类状态的前缀表达 |
| hover | 鼠标悬停反馈 |
| focus | 键盘和输入焦点反馈 |
| AI 按钮 | 生成中应使用 disabled 状态 |

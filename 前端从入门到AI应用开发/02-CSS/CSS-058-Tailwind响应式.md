# Tailwind 响应式（CSS-058）

## 🎯 本节学习目标

- 掌握 Tailwind 响应式前缀的基本写法。
- 理解移动优先的样式组织方式。
- 能够用 Tailwind 实现 AI 控制台从单列到多列的适配。

---

## 📖 什么是 Tailwind 响应式

Tailwind 使用响应式前缀来控制不同断点下的样式，例如 `sm:`、`md:`、`lg:`、`xl:`。

它默认是移动优先。没有前缀的类适用于所有屏幕，带 `md:` 的类从中等屏幕开始生效。

在 AI 应用中，移动端通常先使用单列布局，桌面端再通过响应式前缀切换为侧边栏、主内容和参数面板。

---

## 🧠 原理讲解

示例：

```html
<div class="grid grid-cols-1 md:grid-cols-[240px_1fr]">
```

含义：

```text
默认：一列。
md 及以上：左侧 240px，右侧 1fr。
```

响应式前缀本质上会被 Tailwind 编译成媒体查询。

---

## 🏗 基本结构

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <div>卡片 1</div>
  <div>卡片 2</div>
  <div>卡片 3</div>
</div>
```

---

## ✅ 完整代码

下面用 Tailwind 响应式类实现 AI 控制台：

```html
<main class="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_280px]">
  <aside class="rounded-lg border border-slate-200 bg-white p-4">
    知识库和模板
  </aside>

  <section class="rounded-lg border border-slate-200 bg-white p-4">
    <h1 class="text-xl font-bold md:text-2xl">AI 对话</h1>
    <p class="mt-3 leading-7 text-slate-600">
      小屏单列，中屏两列，大屏三列。
    </p>
  </section>

  <aside class="rounded-lg border border-slate-200 bg-white p-4">
    参数设置
  </aside>
</main>
```

---

## 🔍 逐行解析

`grid-cols-1` 是默认移动端布局。

`md:grid-cols-[240px_1fr]` 在中等屏幕以上变成两列。

`lg:grid-cols-[240px_1fr_280px]` 在大屏上变成三列。

`text-xl md:text-2xl` 让标题在中等屏幕以上略微变大。

`gap-4 p-4` 在各尺寸保持基础间距，也可以继续用响应式前缀调整。

---

## 🌐 浏览器表现

手机宽度下三个区域上下排列。中等屏幕下显示侧边栏和主内容。大屏下增加右侧参数面板列。

这和手写 `@media` 的思想一致，只是通过类名前缀表达。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `sm:` | 响应式前缀 | 小屏断点以上生效 | `sm:grid-cols-2` |
| `md:` | 响应式前缀 | 中屏断点以上生效 | `md:text-2xl` |
| `lg:` | 响应式前缀 | 大屏断点以上生效 | `lg:grid-cols-3` |
| `grid-cols-1` | Grid 类 | 一列布局 | 移动默认 |
| 任意值 | Tailwind 语法 | 自定义列模板 | `grid-cols-[240px_1fr]` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- Tailwind 响应式是移动优先。
- 无前缀类作为基础样式，前缀类在断点以上覆盖。
- AI 控制台常用单列到多列的渐进布局。

---

## ⚠️ 易错点

- 易错点1：把 `md:` 理解成只在 md 生效。正确写法：`md:` 表示 md 及以上生效。
- 易错点2：桌面样式写成默认，小屏再覆盖。正确写法：优先移动端默认，再逐步增强。
- 易错点3：任意值写法混乱。正确写法：复杂布局多次复用时考虑抽组件或写 CSS。

---

## 💡 最佳实践

- 移动端先保证阅读和输入，再扩展桌面侧栏。
- 断点不要过多，优先处理关键布局变化。
- 复杂响应式结构可结合普通 CSS 或组件封装。

---

## 🚀 AI 应用场景

AI 控制台在移动端不适合保留左右侧栏。Tailwind 响应式类可以让它在不同屏幕下自然升级。

```html
<div class="grid grid-cols-1 md:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_300px]">
```

---

## 📝 练习题

1. [基础题] 写一个默认一列、`md` 两列的卡片网格。
2. [进阶题] 用任意值语法实现固定侧栏加弹性主区。
3. [AI 场景题] 用 Tailwind 写一个移动单列、桌面三列的 AI 控制台。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| 响应式前缀 | 用 `md:`、`lg:` 等控制断点样式 |
| 移动优先 | 默认类面向小屏，断点类逐步增强 |
| 任意值 | 可表达复杂 grid 模板 |
| AI 控制台 | 常见单列到多列响应式布局 |

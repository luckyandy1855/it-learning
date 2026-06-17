# Tailwind 工具类体系（CSS-057）

## 🎯 本节学习目标

- 掌握 Tailwind 常见工具类分类。
- 理解间距、颜色、排版、布局工具类的命名规律。
- 能够用工具类组合 AI 聊天消息和操作栏。

---

## 📖 什么是工具类体系

Tailwind 的核心是工具类体系。它把常用 CSS 能力拆成可组合的小类名。

常见类别包括：布局、间距、尺寸、颜色、边框、圆角、排版、Flex/Grid、阴影和状态变体。

理解工具类体系后，不需要死记所有类名，而是能根据 CSS 属性推断 Tailwind 写法。

---

## 🧠 原理讲解

常见映射：

```text
padding → p-4 / px-4 / py-2
margin → m-4 / mt-3 / mx-auto
display flex → flex
gap → gap-3
background → bg-slate-50
text color → text-slate-700
border radius → rounded-md
```

Tailwind 的间距尺度通常基于设计系统，而不是随意写 `13px`、`17px`。

---

## 🏗 基本结构

```html
<div class="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
  <div class="h-10 w-10 rounded-full bg-blue-100"></div>
  <p class="text-sm text-slate-700">AI 回复</p>
</div>
```

---

## ✅ 完整代码

下面用工具类组合 AI 消息行：

```html
<section class="mx-auto max-w-2xl space-y-3 bg-slate-50 p-6">
  <article class="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
    <div class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
      AI
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center justify-between gap-3">
        <strong class="text-sm text-slate-900">学习助手</strong>
        <button class="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600">
          复制
        </button>
      </div>
      <p class="mt-2 leading-7 text-slate-700">
        工具类可以快速组合头像、文本、按钮和间距。
      </p>
    </div>
  </article>
</section>
```

---

## 🔍 逐行解析

`space-y-3` 给容器内部垂直子项添加统一间距。

`flex items-start gap-3` 创建头像和正文的横向布局。

`h-10 w-10 shrink-0 rounded-full` 固定头像尺寸并防止被压缩。

`min-w-0 flex-1` 让正文区域占据剩余空间，并能正确处理长文本。

`rounded-md border px-2 py-1 text-xs` 组合出小型复制按钮。

---

## 🌐 浏览器表现

页面会显示一个结构紧凑的 AI 消息卡片，左侧头像固定，右侧正文自适应，顶部有复制按钮。

这些类名都能回到前面学过的 CSS：Flexbox、间距、边框、圆角、文字和尺寸。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `flex` | 布局类 | 设置 `display: flex` | `flex` |
| `items-center` | 对齐类 | 设置交叉轴居中 | `align-items: center` |
| `gap-3` | 间距类 | 设置子项间距 | `gap` |
| `rounded-lg` | 圆角类 | 设置圆角 | `border-radius` |
| `text-slate-700` | 颜色类 | 设置文字颜色 | slate 色阶 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- Tailwind 类名大多能映射回 CSS 属性。
- 间距和颜色使用统一尺度，能减少视觉漂移。
- `min-w-0` 在 Flex 子项长文本场景中仍然重要。

---

## ⚠️ 易错点

- 易错点1：只复制类名，不理解 CSS 属性。正确写法：把工具类和 CSS 属性对应起来学。
- 易错点2：所有间距随手选。正确写法：保持尺度一致，例如 `gap-3`、`p-4`、`mt-2`。
- 易错点3：Flex 子项长文本溢出。正确写法：正文区域加 `min-w-0`。

---

## 💡 最佳实践

- 先按布局类搭骨架，再补间距、颜色和状态。
- 重复消息结构应抽成组件。
- 不确定类名时，回到 CSS 属性本身推导。

---

## 🚀 AI 应用场景

AI 聊天消息包含头像、角色名、操作按钮、正文、引用来源。Tailwind 工具类能快速组合这些结构。

```html
<div class="flex gap-3 rounded-lg border bg-white p-4">
  <div class="h-10 w-10 shrink-0 rounded-full bg-blue-100"></div>
  <div class="min-w-0 flex-1"></div>
</div>
```

---

## 📝 练习题

1. [基础题] 写出 `p-4`、`mt-2`、`gap-3` 分别对应什么 CSS。
2. [进阶题] 用 Tailwind 工具类实现头像加正文布局。
3. [AI 场景题] 写一个 AI 回复消息卡片，包含头像、角色名、复制按钮和正文。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| 工具类体系 | 把常用 CSS 能力拆成可组合类名 |
| 命名规律 | 多数类名来自 CSS 属性和设计尺度 |
| Flex 消息 | AI 聊天消息很适合工具类组合 |
| `min-w-0` | 长文本自适应仍要注意 |

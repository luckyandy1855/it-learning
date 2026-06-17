# flex-direction 主轴方向（CSS-022）

## 🎯 本节学习目标

- 掌握 `flex-direction` 的四个常见值。
- 理解主轴方向如何影响元素排列顺序。
- 能够为 AI 消息列表和工具栏选择合适排列方向。

---

## 📖 什么是 flex-direction

`flex-direction` 用来设置 Flexbox 的主轴方向，也就是子元素主要沿哪个方向排列。

默认值是 `row`，表示从左到右横向排列。设置为 `column` 后，子元素会从上到下纵向排列。

在 AI 应用中，工具栏通常用 `row`，消息列表通常用 `column`。理解主轴方向，是后续掌握对齐和伸缩的前提。

---

## 🧠 原理讲解

常见值：

```css
.box {
  flex-direction: row;            /* 从左到右 */
  flex-direction: row-reverse;    /* 从右到左 */
  flex-direction: column;         /* 从上到下 */
  flex-direction: column-reverse; /* 从下到上 */
}
```

主轴改变后，`justify-content` 控制的方向也会改变。`row` 时它控制横向分布，`column` 时它控制纵向分布。

---

## 🏗 基本结构

```html
<style>
  .message-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>

<div class="message-list">
  <p>用户消息</p>
  <p>AI 回复</p>
</div>
```

---

## ✅ 完整代码

下面分别展示横向工具栏和纵向消息列表：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>flex-direction 示例</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .chat-panel {
      max-width: 760px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .toolbar {
      display: flex;
      flex-direction: row;
      gap: 8px;
      margin-bottom: 20px;
    }

    .message-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      margin: 0;
      padding: 12px 14px;
      border-radius: 8px;
      background: #f9fafb;
      line-height: 1.7;
    }

    button {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #ffffff;
      font: inherit;
    }
  </style>
</head>
<body>
  <section class="chat-panel">
    <div class="toolbar">
      <button>重新生成</button>
      <button>复制</button>
      <button>导出</button>
    </div>
    <div class="message-list">
      <p class="message">用户：请解释 flex-direction。</p>
      <p class="message">AI：它决定 Flexbox 子元素沿哪个主轴排列。</p>
      <p class="message">用户：消息列表适合 column。</p>
    </div>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.toolbar` 使用 `flex-direction: row`，按钮横向排列。

`.message-list` 使用 `flex-direction: column`，消息纵向排列。

两个容器都使用 `gap`，但间距方向会跟随主轴：工具栏是横向间距，消息列表是纵向间距。

`button` 和 `.message` 只负责自身视觉，不负责排列逻辑。

---

## 🌐 浏览器表现

顶部工具栏的按钮排成一行。消息列表从上到下排列，每条消息之间保持固定间距。

在 DevTools 中切换 `.message-list` 的 `flex-direction` 为 `column-reverse`，可以看到消息顺序反向显示。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `flex-direction` | CSS 属性 | 设置主轴方向 | `flex-direction: column;` |
| `row` | CSS 值 | 横向从左到右 | 默认值 |
| `row-reverse` | CSS 值 | 横向反向 | `row-reverse` |
| `column` | CSS 值 | 纵向从上到下 | 消息列表 |
| `column-reverse` | CSS 值 | 纵向反向 | 倒序列表 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `flex-direction` 决定主轴方向。
- 工具栏常用 `row`，列表常用 `column`。
- 主轴改变会影响 `justify-content` 和 `gap` 的表现方向。

---

## ⚠️ 易错点

- 易错点1：设置 `column` 后仍按横向理解 `justify-content`。正确写法：先判断主轴方向。
- 易错点2：为了倒序显示随意改 DOM 顺序。正确写法：展示倒序可用 `column-reverse`，但要考虑读屏和键盘顺序。
- 易错点3：用多个 margin 模拟纵向列表。正确写法：Flex 列表优先使用 `gap`。

---

## 💡 最佳实践

- UI 控件横排使用 `row`。
- 消息、卡片、表单字段纵排使用 `column`。
- 不要为了视觉倒序破坏语义顺序，必要时让 DOM 顺序和阅读顺序保持一致。

---

## 🚀 AI 应用场景

AI 聊天界面里，操作按钮是横向工具栏，消息记录是纵向列表。一个页面经常同时使用两种 flex direction。

```css
.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
```

---

## 📝 练习题

1. [基础题] 创建一个横向按钮组。
2. [进阶题] 把消息列表设置为纵向排列，并用 `gap` 控制间距。
3. [AI 场景题] 在同一聊天卡片中实现横向工具栏和纵向消息列表。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| 主轴 | Flex 子项排列的主要方向 |
| `row` | 横向排列 |
| `column` | 纵向排列 |
| AI 聊天 | 工具栏 row，消息列表 column |

# justify-content 与 align-items 对齐（CSS-023）

## 🎯 本节学习目标

- 掌握 `justify-content` 控制主轴对齐。
- 掌握 `align-items` 控制交叉轴对齐。
- 能够用 Flexbox 对齐 AI 工具栏、消息头部和输入区域。

---

## 📖 什么是 Flex 对齐

Flexbox 的对齐主要由两个属性控制：`justify-content` 和 `align-items`。

`justify-content` 控制主轴方向上的分布。`align-items` 控制交叉轴方向上的对齐。

在 AI 界面中，对齐决定控件是否整齐：头像和文本是否垂直居中，工具栏按钮是否靠右，输入框和发送按钮是否底部对齐。

---

## 🧠 原理讲解

先判断主轴方向，再理解对齐：

```css
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

默认 `flex-direction: row` 时：

```text
justify-content：控制横向分布。
align-items：控制纵向对齐。
```

如果设置 `flex-direction: column`，这两个属性控制的视觉方向会相应改变。

---

## 🏗 基本结构

```html
<style>
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

<div class="message-header">
  <strong>AI 助手</strong>
  <button>复制</button>
</div>
```

---

## ✅ 完整代码

下面实现一个对齐清晰的 AI 消息头部：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Flex 对齐示例</title>
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

    .message-card {
      max-width: 760px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .agent {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
    }

    .avatar {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #dbeafe;
      color: #1e3a8a;
      font-size: 13px;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .message-body {
      margin: 0;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <article class="message-card">
    <header class="message-header">
      <div class="agent">
        <span class="avatar">AI</span>
        <span>学习助手</span>
      </div>
      <div class="actions">
        <button>复制</button>
        <button>重试</button>
      </div>
    </header>
    <p class="message-body">justify-content 负责主轴分布，align-items 负责交叉轴对齐。</p>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`.message-header` 使用 `justify-content: space-between`，让左侧身份信息和右侧操作按钮分居两端。

`align-items: center` 让两侧内容在垂直方向居中对齐。

`.agent` 内部也使用 Flex，让头像和名称横向排列并垂直居中。

`.avatar` 使用 `inline-flex`，让头像内部文字水平和垂直居中。

---

## 🌐 浏览器表现

消息卡片顶部左侧显示 AI 身份，右侧显示操作按钮。两侧在同一水平线上，头像中的“AI”居中显示。

在 DevTools 中修改 `justify-content` 为 `flex-start`、`center`、`flex-end`，可以观察主轴分布变化。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `justify-content` | CSS 属性 | 控制主轴对齐 | `space-between` |
| `align-items` | CSS 属性 | 控制交叉轴对齐 | `center` |
| `flex-start` | CSS 值 | 靠起点对齐 | `justify-content: flex-start;` |
| `center` | CSS 值 | 居中对齐 | `align-items: center;` |
| `space-between` | CSS 值 | 两端分布 | `justify-content: space-between;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `justify-content` 看主轴。
- `align-items` 看交叉轴。
- 判断对齐问题前，先确认 `flex-direction`。

---

## ⚠️ 易错点

- 易错点1：把 `justify-content` 固定理解成横向。正确写法：它永远控制主轴，不一定是横向。
- 易错点2：头像文字没有居中。正确写法：头像本身也可以用 flex 居中内部内容。
- 易错点3：按钮靠右时乱用 `margin-left`。正确写法：工具栏两端分布可用 `justify-content: space-between`。

---

## 💡 最佳实践

- 顶部栏、消息头部、卡片操作区常用 `space-between`。
- 头像、图标和文字组合常用 `align-items: center`。
- 单个小容器内部内容居中可以使用 `inline-flex`。

---

## 🚀 AI 应用场景

AI 消息卡片通常包含模型名、时间、复制按钮和重试按钮。Flex 对齐能让这些信息稳定排列。

```css
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.agent-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

---

## 📝 练习题

1. [基础题] 用 `align-items: center` 让图标和文字垂直居中。
2. [进阶题] 用 `space-between` 实现左标题右按钮。
3. [AI 场景题] 实现一个 AI 回复卡片头部，左侧是模型信息，右侧是操作按钮。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `justify-content` | 控制主轴分布 |
| `align-items` | 控制交叉轴对齐 |
| `space-between` | 常用于两端布局 |
| AI 消息头 | Flex 对齐的典型场景 |

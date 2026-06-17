# flex 子项伸缩（CSS-025）

## 🎯 本节学习目标

- 掌握 `flex-grow`、`flex-shrink`、`flex-basis` 的基本作用。
- 理解 `flex: 1` 的常见含义和使用场景。
- 能够让 AI 输入框、消息内容区和侧边操作区合理分配空间。

---

## 📖 什么是 flex 子项伸缩

Flexbox 不只是排列元素，还可以让子项根据容器剩余空间自动伸缩。

控制伸缩的核心属性是 `flex-grow`、`flex-shrink`、`flex-basis`，常用缩写是 `flex`。

在 AI 应用中，最常见需求是：输入框占满剩余空间，按钮保持自身宽度；消息正文占满空间，头像保持固定大小。

---

## 🧠 原理讲解

三个属性：

```css
.item {
  flex-grow: 1;   /* 有剩余空间时是否放大 */
  flex-shrink: 1; /* 空间不足时是否缩小 */
  flex-basis: 0;  /* 分配空间前的基础尺寸 */
}
```

常用缩写：

```css
.fill {
  flex: 1;
}
```

在常见场景里，`flex: 1` 可以理解为“占据剩余空间，并允许伸缩”。

---

## 🏗 基本结构

```html
<style>
  .composer {
    display: flex;
    gap: 12px;
  }

  .composer textarea {
    flex: 1;
  }
</style>

<div class="composer">
  <textarea></textarea>
  <button>发送</button>
</div>
```

---

## ✅ 完整代码

下面用 `flex` 控制 AI 消息行中的空间分配：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>flex 子项伸缩示例</title>
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

    .message-row {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .avatar {
      flex: 0 0 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #dbeafe;
      color: #1e3a8a;
      font-weight: 700;
    }

    .message-body {
      flex: 1;
      min-width: 0;
      padding: 12px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #f9fafb;
      line-height: 1.8;
    }

    .composer {
      display: flex;
      gap: 12px;
    }

    .prompt-input {
      flex: 1;
      min-width: 0;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font: inherit;
    }

    .send-button {
      flex: 0 0 auto;
      padding: 10px 16px;
      border: 0;
      border-radius: 6px;
      background: #2563eb;
      color: #ffffff;
      font: inherit;
    }
  </style>
</head>
<body>
  <section class="chat-panel">
    <div class="message-row">
      <div class="avatar">AI</div>
      <div class="message-body">头像保持固定大小，消息正文占据剩余空间。</div>
    </div>
    <div class="composer">
      <input class="prompt-input" value="继续解释 flex 子项伸缩">
      <button class="send-button">发送</button>
    </div>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.avatar { flex: 0 0 40px; }` 表示头像不放大、不缩小，基础宽度固定为 40px。

`.message-body { flex: 1; }` 表示消息正文占据剩余空间。

`min-width: 0` 防止长内容把 flex 子项撑破父容器，这是 Flexbox 中非常重要的细节。

`.send-button { flex: 0 0 auto; }` 表示按钮保持自身内容宽度，不参与抢占剩余空间。

---

## 🌐 浏览器表现

头像固定在左侧，消息正文自动占满右侧剩余宽度。输入框占据大部分宽度，发送按钮保持紧凑。

缩小浏览器窗口时，正文和输入框会缩小，头像和按钮保持稳定尺寸。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `flex-grow` | CSS 属性 | 剩余空间分配比例 | `flex-grow: 1;` |
| `flex-shrink` | CSS 属性 | 空间不足时缩小比例 | `flex-shrink: 0;` |
| `flex-basis` | CSS 属性 | 分配前基础尺寸 | `flex-basis: 40px;` |
| `flex` | CSS 缩写 | 同时设置 grow/shrink/basis | `flex: 1;` |
| `min-width: 0` | CSS 声明 | 允许 flex 子项正确收缩 | `min-width: 0;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `flex: 1` 常用于占据剩余空间。
- 固定尺寸子项可以使用 `flex: 0 0 40px`。
- Flex 子项中长文本溢出时，优先检查 `min-width: 0`。

---

## ⚠️ 易错点

- 易错点1：所有子项都写 `flex: 1` 导致按钮被拉宽。正确写法：只让需要扩展的元素 flex。
- 易错点2：长文本撑破布局。正确写法：给可收缩子项设置 `min-width: 0`。
- 易错点3：不理解 `flex-basis`，只靠 width 调尺寸。正确写法：在 Flex 子项中优先理解 basis 和 grow/shrink。

---

## 💡 最佳实践

- 输入框、正文区、搜索框常用 `flex: 1`。
- 头像、图标、按钮常用 `flex: 0 0 auto` 或固定 basis。
- 处理长文本和代码时，给弹性内容区设置 `min-width: 0`。

---

## 🚀 AI 应用场景

AI 聊天消息行通常由头像和正文组成，头像固定，正文弹性伸缩。输入栏也是典型的“输入框弹性、按钮固定”结构。

```css
.avatar {
  flex: 0 0 40px;
}

.message-content,
.prompt-input {
  flex: 1;
  min-width: 0;
}
```

---

## 📝 练习题

1. [基础题] 让一个输入框使用 `flex: 1` 占据剩余空间。
2. [进阶题] 使用 `flex: 0 0 48px` 固定头像宽度。
3. [AI 场景题] 实现头像固定、AI 回复内容自适应宽度的消息行。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `flex-grow` | 控制剩余空间如何放大 |
| `flex-shrink` | 控制空间不足时如何缩小 |
| `flex-basis` | 控制分配前基础尺寸 |
| AI 输入栏 | 输入框 flex，按钮固定 |

# Specificity 优先级（CSS-010）

## 🎯 本节学习目标

- 理解 specificity 是 CSS 选择器优先级的计算规则。
- 掌握 ID、类、属性、伪类、元素选择器的大致权重差异。
- 能够避免 AI 应用样式中选择器越写越重的问题。

---

## 📖 什么是 Specificity

Specificity 通常翻译为“选择器优先级”或“特异性”。当多条 CSS 规则命中同一个元素并设置同一个属性时，浏览器会比较选择器的 specificity。

简单理解：选择器越具体，优先级越高。ID 选择器通常比类选择器高，类选择器通常比元素选择器高。

如果 specificity 相同，才比较代码书写顺序。也就是说，不是所有“后写”的规则都能覆盖“先写”的规则。

---

## 🧠 原理讲解

常见优先级从高到低可以粗略记为：

```text
行内样式 > ID 选择器 > 类/属性/伪类选择器 > 元素/伪元素选择器
```

示例：

```css
#send-button {
  background: red;
}

.send-button {
  background: blue;
}
```

如果按钮同时有 `id="send-button"` 和 `class="send-button"`，最终背景是红色，因为 ID 选择器优先级更高，即使 `.send-button` 写在后面也不一定能覆盖。

---

## 🏗 基本结构

```html
<style>
  p {
    color: gray;
  }

  .answer {
    color: blue;
  }

  #main-answer {
    color: red;
  }
</style>

<p id="main-answer" class="answer">最终显示红色。</p>
```

---

## ✅ 完整代码

下面演示不同选择器优先级如何影响 AI 按钮样式：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Specificity 示例</title>
  <style>
    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    button {
      padding: 10px 16px;
      border: 0;
      border-radius: 6px;
      background: #9ca3af;
      color: #ffffff;
      font: inherit;
    }

    .send-button {
      background: #2563eb;
    }

    .toolbar .send-button {
      background: #16a34a;
    }

    #main-send-button {
      background: #dc2626;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button id="main-send-button" class="send-button">发送 Prompt</button>
  </div>
</body>
</html>
```

---

## 🔍 逐行解析

`button` 是元素选择器，优先级最低，用来定义按钮基础样式。

`.send-button` 是类选择器，优先级高于 `button`，所以会覆盖基础背景色。

`.toolbar .send-button` 包含两个类选择器，优先级高于单个 `.send-button`。

`#main-send-button` 是 ID 选择器，优先级高于类选择器，因此最终按钮背景会显示红色。

---

## 🌐 浏览器表现

按钮最终显示为红色背景，因为 ID 选择器获胜。即使 `.toolbar .send-button` 写在 ID 规则前面或后面，通常也无法仅靠顺序覆盖 ID 选择器。

DevTools 会显示多条 background 规则，其中未生效的规则会被划掉。观察这些划线是理解 specificity 的最好方式。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| specificity | CSS 规则 | 选择器优先级计算 | ID 高于类 |
| ID 选择器 | 高优先级 | 匹配唯一 ID | `#app` |
| 类选择器 | 中等优先级 | 匹配 class | `.card` |
| 属性选择器 | 中等优先级 | 匹配属性 | `[data-state="open"]` |
| 元素选择器 | 低优先级 | 匹配标签 | `button` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- specificity 决定不同选择器冲突时谁更强。
- ID 选择器优先级高，容易让后续覆盖变困难。
- 组件样式应尽量保持选择器简单，避免越写越重。

---

## ⚠️ 易错点

- 易错点1：以为后写一定覆盖先写。正确写法：只有优先级相同或更高时，后写才可能覆盖。
- 易错点2：为了覆盖样式不断加父级选择器。正确写法：先简化结构，减少无意义权重。
- 易错点3：用 ID 写组件样式。正确写法：组件样式优先使用类选择器。

---

## 💡 最佳实践

- 基础样式用元素选择器，组件样式用类选择器，状态样式用类或属性选择器。
- 避免写过深选择器，例如 `.page .main .toolbar .button.primary`。
- 不用 `!important` 解决日常优先级问题，除非是在明确的工具类或覆盖场景中。

---

## 🚀 AI 应用场景

AI 应用界面会快速扩展：聊天区、工具栏、模型设置、知识库面板都可能复用按钮。如果选择器一开始写得过重，后续主题系统和暗色模式会很难维护。

```css
.button {
  background: #e5e7eb;
}

.button-primary {
  background: #2563eb;
}

.button-danger {
  background: #dc2626;
}
```

这种“基础类 + 变体类”的写法比使用 ID 或深层选择器更容易扩展。

---

## 📝 练习题

1. [基础题] 判断 `p`、`.text`、`#title` 哪个优先级最高。
2. [进阶题] 写一个例子证明后写的类选择器不能覆盖先写的 ID 选择器。
3. [AI 场景题] 为 AI 应用按钮设计基础类、主按钮类和危险按钮类，避免使用 ID。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| Specificity | CSS 选择器优先级规则 |
| ID | 优先级高，样式中应少用 |
| 类/属性/伪类 | 适合组件和状态样式 |
| 可维护性 | 选择器越简单，后续越容易扩展 |

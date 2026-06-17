# CSS 变量（CSS-046）

## 🎯 本节学习目标

- 掌握 CSS 自定义属性的基本写法。
- 理解 `var()` 如何复用颜色、间距和尺寸。
- 能够为 AI 界面建立基础设计 token。

---

## 📖 什么是 CSS 变量

CSS 变量也叫 CSS 自定义属性，通常以 `--` 开头，例如 `--color-primary`、`--space-4`。

变量定义后，可以通过 `var()` 在其他 CSS 属性中复用。这样修改主题色、间距、圆角时，不需要逐个查找散落在文件里的具体值。

在 AI 应用中，按钮、卡片、消息气泡、状态提示会大量复用颜色和间距。CSS 变量能让界面更稳定，也方便后续支持暗色模式。

---

## 🧠 原理讲解

变量通常定义在 `:root`：

```css
:root {
  --color-primary: #2563eb;
  --space-4: 16px;
}
```

使用变量：

```css
.button {
  background: var(--color-primary);
  padding: var(--space-4);
}
```

变量具有级联特性。局部容器可以覆盖同名变量，从而实现组件级主题。

---

## 🏗 基本结构

```html
<style>
  :root {
    --surface: #ffffff;
    --text: #111827;
  }

  .card {
    background: var(--surface);
    color: var(--text);
  }
</style>
```

---

## ✅ 完整代码

下面用 CSS 变量定义 AI 卡片基础主题：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CSS 变量示例</title>
  <style>
    :root {
      --color-bg: #f8fafc;
      --color-surface: #ffffff;
      --color-text: #111827;
      --color-muted: #6b7280;
      --color-primary: #2563eb;
      --border-subtle: #e5e7eb;
      --radius-md: 8px;
      --space-4: 16px;
      --space-6: 24px;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: var(--space-6);
      font-family: system-ui, sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
    }

    .ai-card {
      max-width: 680px;
      margin: 0 auto;
      padding: var(--space-6);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      background: var(--color-surface);
    }

    .ai-card p {
      color: var(--color-muted);
      line-height: 1.8;
    }

    .primary-button {
      padding: 10px var(--space-4);
      border: 0;
      border-radius: 6px;
      background: var(--color-primary);
      color: #ffffff;
      font: inherit;
    }
  </style>
</head>
<body>
  <article class="ai-card">
    <h1>AI 摘要卡片</h1>
    <p>颜色、边框、圆角和间距都来自 CSS 变量。</p>
    <button class="primary-button">重新生成</button>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`:root` 中集中定义全局变量，作为界面的基础 token。

`body` 使用背景色和文字色变量，保证全局视觉统一。

`.ai-card` 使用表面色、边框色、圆角和间距变量。

`.primary-button` 使用主色变量，后续只要修改 `--color-primary`，按钮颜色会同步变化。

---

## 🌐 浏览器表现

页面显示一张白色 AI 摘要卡片。视觉上看不到变量本身，但 DevTools 中可以看到属性值来自 `var(...)`。

在 DevTools 中修改 `--color-primary`，按钮颜色会立即变化。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `--name` | 自定义属性 | 定义 CSS 变量 | `--color-primary` |
| `var()` | CSS 函数 | 读取变量 | `var(--color-primary)` |
| `:root` | 伪类 | 常用于定义全局变量 | `:root { ... }` |
| fallback | 备用值 | 变量不存在时使用 | `var(--x, #000)` |
| 级联 | CSS 机制 | 局部变量可覆盖全局变量 | 容器主题 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- CSS 变量以 `--` 开头。
- 使用 `var()` 读取变量。
- 颜色、间距、圆角、阴影适合抽成变量。

---

## ⚠️ 易错点

- 易错点1：变量名没有语义。正确写法：优先写 `--color-primary`，少写 `--blue`。
- 易错点2：所有值都变量化。正确写法：高频复用和主题相关的值优先变量化。
- 易错点3：忘记备用值。正确写法：关键场景可写 `var(--surface, #ffffff)`。

---

## 💡 最佳实践

- 先建立颜色、间距、圆角三类基础 token。
- 变量命名表达用途，而不是只表达颜色本身。
- 暗色模式和主题系统都应基于 CSS 变量扩展。

---

## 🚀 AI 应用场景

AI 产品通常会快速增加新页面：聊天、知识库、模型设置、仪表盘。CSS 变量能让这些页面复用同一套视觉基础。

```css
:root {
  --ai-user-bubble: #dbeafe;
  --ai-assistant-bubble: #ffffff;
  --ai-border: #e5e7eb;
}
```

---

## 📝 练习题

1. [基础题] 定义 `--color-primary` 并用于按钮背景。
2. [进阶题] 把卡片背景、边框和圆角抽成变量。
3. [AI 场景题] 为 AI 聊天气泡定义用户消息和助手消息的颜色变量。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| CSS 变量 | 用 `--` 定义的自定义属性 |
| `var()` | 读取变量值 |
| token | 可复用的设计基础值 |
| AI 界面 | 变量让多页面视觉更一致 |

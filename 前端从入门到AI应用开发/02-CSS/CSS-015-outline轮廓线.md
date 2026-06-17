# outline 轮廓线（CSS-015）

## 🎯 本节学习目标

- 掌握 `outline` 与 `border` 的区别。
- 理解 outline 在键盘焦点和无障碍体验中的重要性。
- 能够为 AI 表单控件设计清晰但不干扰布局的焦点样式。

---

## 📖 什么是 outline

`outline` 是绘制在元素边框外侧的轮廓线。它常用于表示元素获得焦点，例如用户按 Tab 键选中按钮或输入框。

与 border 不同，outline 通常不占据布局空间，不会改变元素尺寸，也不会把周围元素挤开。

在 AI 应用中，Prompt 输入框、发送按钮、模型选项、工具开关都应该有清晰的焦点轮廓，方便键盘用户操作。

---

## 🧠 原理讲解

基础写法：

```css
button:focus {
  outline: 3px solid #bfdbfe;
}
```

更推荐使用 `:focus-visible`：

```css
button:focus-visible {
  outline: 3px solid #bfdbfe;
  outline-offset: 2px;
}
```

`:focus-visible` 通常只在浏览器判断用户需要可见焦点时显示，例如键盘导航时，能减少鼠标点击后的视觉干扰。

---

## 🏗 基本结构

```html
<style>
  .send-button:focus-visible {
    outline: 3px solid #bfdbfe;
    outline-offset: 2px;
  }
</style>

<button class="send-button">发送</button>
```

---

## ✅ 完整代码

下面为 AI 表单设计不影响布局的焦点轮廓：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>outline 示例</title>
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

    .ai-form {
      max-width: 720px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .prompt-input {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font: inherit;
      resize: vertical;
    }

    .prompt-input:focus-visible {
      border-color: #2563eb;
      outline: 3px solid #bfdbfe;
      outline-offset: 2px;
    }

    .send-button {
      margin-top: 12px;
      padding: 10px 16px;
      border: 0;
      border-radius: 6px;
      background: #2563eb;
      color: #ffffff;
      font: inherit;
    }

    .send-button:focus-visible {
      outline: 3px solid #bfdbfe;
      outline-offset: 3px;
    }

    .model-option {
      display: block;
      margin-top: 12px;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
    }

    .model-option:focus-visible {
      outline: 3px solid #c7d2fe;
      outline-offset: 2px;
    }
  </style>
</head>
<body>
  <form class="ai-form">
    <h1>AI 参数设置</h1>
    <textarea class="prompt-input">请生成一份学习计划。</textarea>
    <button class="send-button" type="button">开始生成</button>
    <button class="model-option" type="button">Claude Sonnet</button>
    <button class="model-option" type="button">GPT 推理模型</button>
  </form>
</body>
</html>
```

---

## 🔍 逐行解析

`.prompt-input:focus-visible` 在文本框获得可见焦点时显示浅蓝轮廓。

`outline-offset: 2px` 让轮廓线与元素边框保持一点距离，不会显得拥挤。

`.send-button:focus-visible` 让键盘用户能清楚知道当前焦点在哪个按钮上。

`.model-option:focus-visible` 为模型选择按钮提供独立焦点反馈。

---

## 🌐 浏览器表现

使用 Tab 键切换焦点时，文本框、发送按钮和模型选项会依次显示清晰轮廓。轮廓不会挤压布局，也不会导致按钮尺寸变化。

在 DevTools 中可以强制元素进入 `:focus-visible` 状态，检查轮廓颜色、粗细和偏移量是否合适。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `outline` | CSS 属性 | 设置轮廓线 | `outline: 3px solid #bfdbfe;` |
| `outline-width` | CSS 属性 | 轮廓宽度 | `outline-width: 3px;` |
| `outline-style` | CSS 属性 | 轮廓线型 | `outline-style: solid;` |
| `outline-color` | CSS 属性 | 轮廓颜色 | `outline-color: #bfdbfe;` |
| `outline-offset` | CSS 属性 | 轮廓与边框的距离 | `outline-offset: 2px;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- outline 通常不占据布局空间。
- outline 是焦点可见性的关键工具。
- 不要无脑移除浏览器默认 outline，除非提供替代焦点样式。

---

## ⚠️ 易错点

- 易错点1：写 `outline: none` 后没有替代样式。正确写法：移除默认轮廓时必须提供清晰自定义焦点。
- 易错点2：用 border 表示焦点导致布局抖动。正确写法：使用 outline 或预留 border。
- 易错点3：只考虑鼠标用户。正确写法：用键盘 Tab 测试所有可交互控件。

---

## 💡 最佳实践

- 优先使用 `:focus-visible` 设计键盘焦点样式。
- 轮廓颜色应与品牌色相关，但要有足够对比度。
- 按钮、链接、输入框、可选卡片都应该有可见焦点。

---

## 🚀 AI 应用场景

AI 工具常有大量可交互控件：输入 Prompt、选择模型、切换知识库、打开工具调用。outline 能保证键盘用户也能高效操作。

```css
.prompt-input:focus-visible,
.model-select:focus-visible,
.send-button:focus-visible {
  outline: 3px solid #bfdbfe;
  outline-offset: 2px;
}
```

---

## 📝 练习题

1. [基础题] 给按钮添加 `:focus-visible` outline。
2. [进阶题] 比较 border 和 outline 作为焦点样式时是否会影响布局。
3. [AI 场景题] 为 Prompt 输入框、模型按钮、发送按钮设计统一焦点样式。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| outline | 元素边框外侧的轮廓线 |
| 焦点可见性 | 键盘操作必须能看到当前位置 |
| `outline-offset` | 控制轮廓和元素之间的距离 |
| AI 表单 | 输入框和按钮都需要清晰焦点反馈 |

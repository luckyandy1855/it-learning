# Dark Mode 暗色模式（CSS-047）

## 🎯 本节学习目标

- 掌握使用 CSS 变量实现暗色模式的基本思路。
- 理解 `prefers-color-scheme` 用户偏好媒体查询。
- 能够为 AI 聊天界面设计基础明暗主题。

---

## 📖 什么是 Dark Mode

Dark Mode 是暗色模式，通常使用深色背景、浅色文字和低对比边框，适合夜间阅读和长时间使用。

暗色模式不是简单把白色变黑。它需要重新考虑文字对比、边框层级、气泡颜色、代码块和状态提示。

AI 应用往往包含大量长文本和长时间对话，暗色模式能改善部分用户的阅读体验。

---

## 🧠 原理讲解

最稳妥的做法是先用 CSS 变量定义语义颜色：

```css
:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --text: #111827;
}
```

再在暗色模式中覆盖变量：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --surface: #111827;
    --text: #e5e7eb;
  }
}
```

组件继续读取变量，不需要每个组件单独写暗色样式。

---

## 🏗 基本结构

```html
<style>
  :root {
    --bg: #ffffff;
    --text: #111827;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #111827;
      --text: #f9fafb;
    }
  }
</style>
```

---

## ✅ 完整代码

下面为 AI 聊天卡片实现暗色模式：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Dark Mode 示例</title>
  <style>
    :root {
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #111827;
      --muted: #6b7280;
      --border: #e5e7eb;
      --user-bubble: #dbeafe;
      --assistant-bubble: #f9fafb;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0f172a;
        --surface: #111827;
        --text: #e5e7eb;
        --muted: #9ca3af;
        --border: #374151;
        --user-bubble: #1e3a8a;
        --assistant-bubble: #1f2937;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
    }

    .chat-card {
      max-width: 680px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
    }

    .message {
      padding: 12px 14px;
      border-radius: 8px;
      line-height: 1.8;
    }

    .message.user {
      background: var(--user-bubble);
    }

    .message.assistant {
      background: var(--assistant-bubble);
      border: 1px solid var(--border);
    }

    .meta {
      color: var(--muted);
      font-size: 14px;
    }
  </style>
</head>
<body>
  <main class="chat-card">
    <p class="meta">当前主题跟随系统偏好</p>
    <p class="message user">请解释暗色模式。</p>
    <p class="message assistant">暗色模式应基于语义变量切换，而不是逐个组件硬改颜色。</p>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

`:root` 定义默认明色主题变量。

`@media (prefers-color-scheme: dark)` 在用户系统偏好暗色时覆盖变量。

组件只使用 `var(...)`，不关心当前是明色还是暗色。

用户气泡和助手气泡分别使用语义变量，保证两种主题下都能区分角色。

---

## 🌐 浏览器表现

系统为明色时，页面使用浅色背景。系统为暗色时，背景、卡片、文字、气泡和边框会自动切换。

可以在浏览器 DevTools 中模拟 `prefers-color-scheme: dark` 来测试。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `prefers-color-scheme` | 媒体特性 | 检测系统明暗偏好 | `dark` |
| `@media` | CSS 规则 | 条件应用样式 | `@media (...)` |
| CSS 变量 | 自定义属性 | 主题切换基础 | `--bg` |
| `color-scheme` | CSS 属性 | 告知浏览器控件主题 | `color-scheme: dark;` |
| 语义颜色 | 设计概念 | 按用途命名颜色 | `--surface` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 暗色模式推荐基于 CSS 变量实现。
- 颜色变量应按语义命名，而不是按颜色命名。
- 暗色模式需要检查对比度，不是简单反色。

---

## ⚠️ 易错点

- 易错点1：直接把背景改黑，文字改白。正确写法：重新设计 surface、border、muted 等层级。
- 易错点2：忘记气泡和代码块。正确写法：所有高频内容容器都要检查。
- 易错点3：只在自己电脑系统主题下测试。正确写法：DevTools 同时模拟明暗主题。

---

## 💡 最佳实践

- 先定义语义变量，再覆盖变量值。
- 暗色边框不要太亮，避免界面噪音。
- 长文本区域要重点检查阅读对比度。

---

## 🚀 AI 应用场景

AI 聊天应用常被长时间使用。暗色模式可以减少夜间阅读压力，同时保持用户消息、AI 回复、引用来源和错误提示的层次。

```css
@media (prefers-color-scheme: dark) {
  :root {
    --ai-bg: #0f172a;
    --ai-message: #1f2937;
  }
}
```

---

## 📝 练习题

1. [基础题] 使用 `prefers-color-scheme` 切换页面背景和文字颜色。
2. [进阶题] 为卡片、边框、辅助文字定义暗色变量。
3. [AI 场景题] 为 AI 聊天界面设计明暗两套气泡颜色。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| Dark Mode | 根据主题使用暗色视觉系统 |
| 变量覆盖 | 暗色模式推荐覆盖 CSS 变量 |
| 系统偏好 | `prefers-color-scheme` 可读取用户偏好 |
| AI 聊天 | 长文本和气泡层级要重点适配 |

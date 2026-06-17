# Position 综合项目：AI 悬浮工具栏（CSS-035）

## 🎯 本节学习目标

- 综合使用 relative、absolute、fixed、sticky。
- 理解不同定位方式在同一 AI 页面中的分工。
- 能够实现一个包含固定输入栏、粘性侧栏和局部浮动按钮的 AI 工作界面。

---

## 📖 什么是 Position 综合项目

前几节分别学习了相对定位、绝对定位、固定定位和粘性定位。本节把它们组合到一个 AI 工作界面中。

真实项目中，定位不应替代 Flex/Grid 的主布局能力。更合理的方式是：Grid/Flex 负责页面结构，Position 负责浮层、角标、固定操作和粘性工具。

本节目标是做一个可维护的定位综合案例，而不是用 position 硬拼页面。

---

## 🧠 原理讲解

四种定位的分工：

```text
relative：为局部 absolute 元素提供参照物。
absolute：放置卡片角标、输入框内按钮等局部浮层。
fixed：固定在视口，例如底部输入栏、右下角帮助按钮。
sticky：在滚动容器内粘住，例如右侧目录、顶部筛选栏。
```

判断原则：如果是页面骨架，优先 Grid/Flex；如果是覆盖、粘附、浮动，再考虑 Position。

---

## 🏗 基本结构

```html
<main class="layout">
  <article class="answer-card">
    <span class="badge">AI</span>
  </article>
  <aside class="sticky-tools">工具</aside>
</main>
<form class="fixed-composer">输入栏</form>
```

---

## ✅ 完整代码

下面是一个 AI 悬浮工具栏综合示例：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>AI 悬浮工具栏综合示例</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 32px 32px 120px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 260px;
      gap: 24px;
      max-width: 1080px;
      margin: 0 auto;
    }

    .answer-card {
      position: relative;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
      line-height: 1.8;
    }

    .answer-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 4px 8px;
      border-radius: 999px;
      background: #e0f2fe;
      color: #075985;
      font-size: 13px;
      font-weight: 700;
    }

    .answer-card h1 {
      margin: 0 0 16px;
      padding-right: 72px;
    }

    .sticky-tools {
      position: sticky;
      top: 24px;
      align-self: start;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .sticky-tools button {
      display: block;
      width: 100%;
      margin-top: 8px;
      padding: 8px 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #ffffff;
      font: inherit;
    }

    .help-button {
      position: fixed;
      right: 24px;
      bottom: 96px;
      width: 48px;
      height: 48px;
      border: 0;
      border-radius: 50%;
      background: #111827;
      color: #ffffff;
      font: inherit;
      font-weight: 700;
    }

    .fixed-composer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      background: #ffffff;
    }

    .composer-inner {
      display: flex;
      gap: 12px;
      max-width: 760px;
      margin: 0 auto;
    }

    .composer-inner input {
      flex: 1;
      min-width: 0;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font: inherit;
    }

    .composer-inner button {
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
  <main class="layout">
    <article class="answer-card">
      <span class="answer-badge">AI</span>
      <h1>AI 回答结果</h1>
      <p>这个页面使用 Grid 管理正文和侧栏，用 absolute 放置卡片角标，用 sticky 固定侧栏工具，用 fixed 固定底部输入栏。</p>
      <p>定位适合处理浮动和粘附，不适合替代正常页面布局。</p>
      <p>继续添加几段内容，用来观察粘性工具栏和固定输入栏的行为。</p>
      <p>当页面滚动时，右侧工具栏会粘住，底部输入栏始终固定在视口底部。</p>
    </article>

    <aside class="sticky-tools">
      <strong>回答工具</strong>
      <button>总结</button>
      <button>复制</button>
      <button>提取行动项</button>
    </aside>
  </main>

  <button class="help-button">?</button>

  <form class="fixed-composer">
    <div class="composer-inner">
      <input placeholder="继续追问这个回答">
      <button type="button">发送</button>
    </div>
  </form>
</body>
</html>
```

---

## 🔍 逐行解析

`.layout` 用 Grid 负责主内容和侧栏两列结构。

`.answer-card { position: relative; }` 给内部角标提供定位参照物。

`.answer-badge { position: absolute; }` 把 AI 角标放到卡片右上角。

`.sticky-tools { position: sticky; }` 让右侧工具栏滚动时保持可见。

`.help-button` 和 `.fixed-composer` 使用 fixed，相对视口固定。

---

## 🌐 浏览器表现

页面显示正文卡片、右侧粘性工具栏、右下角帮助按钮和底部固定输入栏。滚动时，fixed 元素始终相对视口不动，sticky 工具栏在指定阈值后粘住。

如果移除 `body` 的底部 padding，正文底部可能被固定输入栏遮挡。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `relative` | position 值 | 建立定位上下文 | `.card` |
| `absolute` | position 值 | 局部浮层定位 | `.badge` |
| `fixed` | position 值 | 视口固定 | `.composer` |
| `sticky` | position 值 | 滚动粘附 | `.tools` |
| `z-index` | CSS 属性 | 控制层级 | `z-index: 50;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- Position 不应替代 Grid/Flex 主布局。
- relative + absolute 是局部浮层的常见组合。
- fixed 和 sticky 都能保持可见，但作用范围不同。

---

## ⚠️ 易错点

- 易错点1：全页面都用 absolute 摆位置。正确写法：页面结构用 Grid/Flex。
- 易错点2：fixed 元素遮挡正文。正确写法：为正文预留空间。
- 易错点3：sticky 不生效。正确写法：检查 top 和祖先 overflow。

---

## 💡 最佳实践

- 先完成正常文档流布局，再添加定位增强。
- 每个浮层都要明确参照物、层级和遮挡风险。
- 移动端要重新检查 fixed 输入栏和悬浮按钮的位置。

---

## 🚀 AI 应用场景

AI 工作台常同时需要底部输入、右侧工具、卡片角标和帮助入口。合理组合 Position 能让这些操作随时可用，同时不破坏主内容布局。

```css
.answer-card { position: relative; }
.answer-badge { position: absolute; top: 12px; right: 12px; }
.side-tools { position: sticky; top: 24px; }
.composer { position: fixed; bottom: 0; left: 0; right: 0; }
```

---

## 📝 练习题

1. [基础题] 在卡片内使用 relative + absolute 放置角标。
2. [进阶题] 实现一个右侧 sticky 工具栏和底部 fixed 输入栏。
3. [AI 场景题] 完成一个 AI 回答页，包含角标、粘性工具栏、固定输入栏和帮助按钮。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| relative | 常用于建立局部定位上下文 |
| absolute | 适合角标和局部浮动按钮 |
| fixed | 适合全局固定输入栏和帮助按钮 |
| sticky | 适合长内容中的局部工具栏 |

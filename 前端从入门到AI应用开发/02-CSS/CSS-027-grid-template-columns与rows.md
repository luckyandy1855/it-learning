# grid-template-columns 与 rows（CSS-027）

## 🎯 本节学习目标

- 掌握 `grid-template-columns` 定义列结构。
- 掌握 `grid-template-rows` 定义行结构。
- 能够为 AI 仪表盘设计稳定的行列骨架。

---

## 📖 什么是 grid-template-columns 与 rows

`grid-template-columns` 用来定义 Grid 容器的列。`grid-template-rows` 用来定义 Grid 容器的行。

列和行可以使用固定长度、百分比、`fr`、`auto`、`minmax()` 和 `repeat()` 等写法。

在 AI 应用中，常见布局包括固定侧边栏加弹性内容区、上方指标区加下方内容区、三列模型配置面板等。

---

## 🧠 原理讲解

定义两列：

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
}
```

第一列固定 240px，第二列占剩余空间。

定义行：

```css
.layout {
  grid-template-rows: auto 1fr;
}
```

第一行按内容高度，第二行占剩余空间。

---

## 🏗 基本结构

```html
<style>
  .app-layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    grid-template-rows: auto 1fr;
    gap: 16px;
  }
</style>

<div class="app-layout">
  <header>顶部栏</header>
  <aside>侧边栏</aside>
  <main>主内容</main>
</div>
```

---

## ✅ 完整代码

下面实现一个 AI 控制台布局：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Grid 行列模板示例</title>
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

    .console {
      display: grid;
      grid-template-columns: 220px 1fr;
      grid-template-rows: auto 1fr;
      gap: 16px;
      max-width: 1040px;
      margin: 0 auto;
    }

    .topbar,
    .sidebar,
    .content {
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .topbar {
      grid-column: 1 / -1;
    }

    .sidebar {
      min-height: 320px;
    }

    .content {
      min-height: 320px;
    }
  </style>
</head>
<body>
  <main class="console">
    <header class="topbar">AI 控制台：模型、知识库、调用监控</header>
    <aside class="sidebar">侧边栏：Prompt 模板、知识库、设置</aside>
    <section class="content">主内容：生成记录和指标分析</section>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

`.console` 使用 Grid，定义两列和两行。

`grid-template-columns: 220px 1fr` 表示左侧固定宽度，右侧自适应。

`grid-template-rows: auto 1fr` 表示顶部栏按内容高度，下面内容区占剩余空间。

`.topbar { grid-column: 1 / -1; }` 让顶部栏横跨所有列。

---

## 🌐 浏览器表现

页面顶部是一整行控制台标题，下方左侧是固定宽度侧边栏，右侧是弹性主内容区域。

使用 DevTools Grid overlay 可以看到两列两行的网格结构，以及顶部栏如何跨列。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `grid-template-columns` | CSS 属性 | 定义网格列 | `220px 1fr` |
| `grid-template-rows` | CSS 属性 | 定义网格行 | `auto 1fr` |
| `repeat()` | CSS 函数 | 重复列或行定义 | `repeat(3, 1fr)` |
| `minmax()` | CSS 函数 | 设置最小最大范围 | `minmax(240px, 1fr)` |
| `grid-column` | CSS 属性 | 控制子项跨列 | `1 / -1` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- columns 定义列，rows 定义行。
- `fr` 适合分配剩余空间。
- 固定侧边栏加自适应主内容是 Grid 的典型场景。

---

## ⚠️ 易错点

- 易错点1：把 `1fr` 理解成百分比。正确写法：`fr` 表示按比例分配剩余空间。
- 易错点2：顶部栏无法横跨两列。正确写法：给顶部栏设置 `grid-column: 1 / -1`。
- 易错点3：所有列都写死宽度导致小屏溢出。正确写法：关键内容列使用 `1fr` 或响应式规则。

---

## 💡 最佳实践

- 后台应用常用 `固定侧栏 + 弹性主区`。
- 大屏复杂布局用 Grid，小组件内部排列用 Flex。
- 明确页面骨架时，先写 columns 和 rows，再放置内容。

---

## 🚀 AI 应用场景

AI 控制台经常需要同时展示导航、模型状态、调用记录和结果区。Grid 的行列模板能让整体骨架稳定。

```css
.ai-console {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  grid-template-rows: auto 1fr;
}
```

---

## 📝 练习题

1. [基础题] 创建一个 `200px 1fr` 的两列布局。
2. [进阶题] 让 header 使用 `grid-column: 1 / -1` 横跨所有列。
3. [AI 场景题] 设计一个包含侧边栏和主内容区的 AI 控制台骨架。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| columns | 定义 Grid 的列 |
| rows | 定义 Grid 的行 |
| `1fr` | 占据剩余空间的一份 |
| AI 控制台 | 固定侧边栏 + 弹性主内容很适合 Grid |

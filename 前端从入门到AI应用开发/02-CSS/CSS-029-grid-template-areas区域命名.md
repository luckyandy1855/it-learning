# grid-template-areas 区域命名（CSS-029）

## 🎯 本节学习目标

- 掌握 `grid-template-areas` 的区域命名布局方式。
- 理解 `grid-area` 如何把子项放到指定区域。
- 能够用命名区域搭建 AI 控制台页面骨架。

---

## 📖 什么是 grid-template-areas

`grid-template-areas` 允许用字符串给 Grid 区域命名。相比用数字线定位，它更直观，适合页面级布局。

每个字符串代表一行，每个名称代表一个区域。同名区域可以跨行或跨列，但必须形成矩形。

在 AI 应用中，命名区域适合构建“header、sidebar、main、inspector、footer”这类稳定页面结构。

---

## 🧠 原理讲解

定义区域：

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main";
}
```

放置子项：

```css
.header {
  grid-area: header;
}
```

区域名必须对应。CSS 中写了 `"sidebar main"`，子项就要使用 `grid-area: sidebar` 或 `grid-area: main`。

---

## 🏗 基本结构

```html
<style>
  .layout {
    display: grid;
    grid-template-areas:
      "header header"
      "nav content";
  }

  header { grid-area: header; }
  nav { grid-area: nav; }
  main { grid-area: content; }
</style>
```

---

## ✅ 完整代码

下面用命名区域搭建 AI 控制台：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>grid-template-areas 示例</title>
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

    .ai-layout {
      display: grid;
      grid-template-columns: 220px 1fr 260px;
      grid-template-areas:
        "header header header"
        "sidebar main inspector";
      gap: 16px;
      max-width: 1180px;
      margin: 0 auto;
    }

    .header { grid-area: header; }
    .sidebar { grid-area: sidebar; }
    .main { grid-area: main; }
    .inspector { grid-area: inspector; }

    .panel {
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
      min-height: 120px;
    }
  </style>
</head>
<body>
  <div class="ai-layout">
    <header class="panel header">顶部：AI 控制台</header>
    <aside class="panel sidebar">左侧：知识库和模板</aside>
    <main class="panel main">主区：对话与生成结果</main>
    <aside class="panel inspector">右侧：参数和引用</aside>
  </div>
</body>
</html>
```

---

## 🔍 逐行解析

`.ai-layout` 定义三列布局，左侧固定 220px，中间弹性，右侧固定 260px。

`grid-template-areas` 用两行字符串描述页面结构。

第一行 `"header header header"` 表示 header 横跨三列。

`.header { grid-area: header; }` 把顶部元素放入 header 区域。

---

## 🌐 浏览器表现

页面顶部是一整行控制台标题。下方分成左侧导航、中间主内容和右侧参数面板。

在 DevTools 中开启 Grid overlay，可以看到每个命名区域的位置，调试页面骨架非常直观。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `grid-template-areas` | CSS 属性 | 定义命名区域 | `"header header"` |
| `grid-area` | CSS 属性 | 指定子项所在区域 | `grid-area: main;` |
| `.` | 区域占位 | 表示空单元格 | `". main"` |
| 区域名 | 自定义标识 | 必须形成矩形 | `sidebar` |
| Grid overlay | DevTools 工具 | 可视化网格区域 | 浏览器开发者工具 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `grid-template-areas` 适合页面级布局。
- 区域名必须和子项的 `grid-area` 对应。
- 同名区域必须形成矩形，不能断开或斜着拼。

---

## ⚠️ 易错点

- 易错点1：区域名拼写不一致。正确写法：`grid-template-areas` 和 `grid-area` 完全一致。
- 易错点2：同名区域不是矩形。正确写法：跨行跨列区域必须连续形成矩形。
- 易错点3：用命名区域做大量小组件布局。正确写法：区域命名更适合页面骨架。

---

## 💡 最佳实践

- 页面主结构用 `header`、`sidebar`、`main`、`inspector` 这类清晰命名。
- 复杂后台页面可以用 areas 表达布局意图，提升可读性。
- 小组件内部布局继续使用 Flex 或简单 Grid。

---

## 🚀 AI 应用场景

AI 控制台通常需要主对话区、知识库侧栏、参数面板和顶部状态栏。命名区域能让页面结构一眼可读。

```css
.ai-console {
  display: grid;
  grid-template-areas:
    "topbar topbar"
    "chat settings";
}
```

---

## 📝 练习题

1. [基础题] 使用 `grid-template-areas` 创建 header 和 main 两个区域。
2. [进阶题] 让 header 横跨三列。
3. [AI 场景题] 用命名区域设计“左知识库 + 中对话 + 右参数”的 AI 控制台。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| areas | 用名字描述 Grid 区域 |
| `grid-area` | 把子项放入指定区域 |
| 矩形规则 | 同名区域必须连续成矩形 |
| AI 控制台 | 命名区域适合页面骨架 |

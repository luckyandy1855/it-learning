# Grid 综合项目：AI 仪表盘（CSS-030）

## 🎯 本节学习目标

- 综合使用 Grid 的列、行、gap 和区域命名。
- 理解 Grid 与 Flexbox 在同一页面中的分工。
- 能够实现一个结构清晰的 AI 仪表盘页面。

---

## 📖 什么是 Grid 综合项目

前几节已经学习了 Grid 的基础概念、行列模板、gap 和区域命名。本节把这些能力组合起来，完成一个 AI 仪表盘布局。

真实项目里，Grid 通常负责页面骨架和卡片矩阵，Flexbox 负责卡片内部的横向对齐。

AI 仪表盘需要同时展示指标、任务状态、模型配置和生成记录，是练习 Grid 的合适场景。

---

## 🧠 原理讲解

页面级布局可以用命名区域：

```css
.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "metrics metrics"
    "tasks activity";
}
```

指标卡片区可以再嵌套一个 Grid：

```css
.metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
```

这就是常见的“外层 Grid 管页面，内层 Grid 管卡片”的写法。

---

## 🏗 基本结构

```html
<div class="dashboard">
  <header class="header">顶部</header>
  <section class="metrics">指标</section>
  <section class="tasks">任务</section>
  <section class="activity">记录</section>
</div>
```

```css
.dashboard {
  display: grid;
  gap: 16px;
}
```

---

## ✅ 完整代码

下面是一个完整 AI 仪表盘布局：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>AI 仪表盘 Grid 综合项目</title>
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

    .dashboard {
      display: grid;
      grid-template-columns: 1fr 320px;
      grid-template-areas:
        "header header"
        "metrics metrics"
        "tasks activity";
      gap: 16px;
      max-width: 1180px;
      margin: 0 auto;
    }

    .header { grid-area: header; }
    .metrics { grid-area: metrics; }
    .tasks { grid-area: tasks; }
    .activity { grid-area: activity; }

    .panel {
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .metric-card {
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .metric-card p {
      margin: 0;
    }

    .metric-value {
      margin-top: 8px;
      font-size: 26px;
      font-weight: 700;
    }

    .task-list {
      display: grid;
      gap: 12px;
    }

    .task-item {
      padding: 12px;
      border-radius: 6px;
      background: #f9fafb;
      line-height: 1.7;
    }
  </style>
</head>
<body>
  <main class="dashboard">
    <header class="panel header">
      <h1>AI 应用仪表盘</h1>
      <button>导出报告</button>
    </header>

    <section class="metrics">
      <article class="metric-card"><p>调用量</p><p class="metric-value">12.8k</p></article>
      <article class="metric-card"><p>成功率</p><p class="metric-value">98.2%</p></article>
      <article class="metric-card"><p>平均延迟</p><p class="metric-value">1.4s</p></article>
      <article class="metric-card"><p>今日成本</p><p class="metric-value">$42</p></article>
    </section>

    <section class="panel tasks">
      <h2>生成任务</h2>
      <div class="task-list">
        <div class="task-item">会议纪要生成完成</div>
        <div class="task-item">知识库摘要处理中</div>
        <div class="task-item">小红书标题生成失败，等待重试</div>
      </div>
    </section>

    <aside class="panel activity">
      <h2>最近活动</h2>
      <p>10:20 调用 Claude Sonnet</p>
      <p>10:28 更新 Prompt 模板</p>
      <p>10:41 导出日报</p>
    </aside>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

`.dashboard` 是外层 Grid，负责页面主要区域。

`grid-template-areas` 把页面分成 header、metrics、tasks、activity 四个区域。

`.metrics` 本身又是一个 Grid，负责四张指标卡片的排列。

`.header` 内部使用 Flexbox，让标题和按钮左右分布。

`.task-list` 使用简单 Grid 管理任务项间距。

---

## 🌐 浏览器表现

页面顶部是标题和导出按钮。第二行是四张指标卡片。底部左侧是任务列表，右侧是最近活动。

打开 DevTools 的 Grid overlay，可以分别查看外层仪表盘 Grid 和内层指标 Grid。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `display: grid` | CSS 声明 | 开启 Grid | `.dashboard` |
| `grid-template-areas` | CSS 属性 | 定义页面区域 | `"tasks activity"` |
| `grid-template-columns` | CSS 属性 | 定义列宽 | `1fr 320px` |
| `gap` | CSS 属性 | 统一间距 | `gap: 16px;` |
| `display: flex` | CSS 声明 | 局部一维对齐 | `.header` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 页面骨架适合用 Grid。
- 局部横向对齐适合用 Flexbox。
- 外层 Grid 可以嵌套内层 Grid。

---

## ⚠️ 易错点

- 易错点1：试图只用一种布局解决所有问题。正确写法：Grid 管二维结构，Flex 管局部一维对齐。
- 易错点2：区域命名和类名混乱。正确写法：区域名保持语义稳定。
- 易错点3：指标卡片数量变化后布局失控。正确写法：指标区域单独用 Grid 管理。

---

## 💡 最佳实践

- 先画出页面大区域，再写 Grid areas。
- 卡片矩阵单独做内层 Grid。
- 页面中重复的视觉单元抽成 `.panel`、`.metric-card` 这类稳定类名。

---

## 🚀 AI 应用场景

AI SaaS、内部工具和内容生产系统都需要仪表盘：调用趋势、失败率、成本、任务状态、用户反馈。Grid 可以把这些模块组织成稳定页面。

```css
.ai-dashboard {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
}
```

---

## 📝 练习题

1. [基础题] 使用 Grid areas 创建 header、main、aside 三个区域。
2. [进阶题] 在 main 内部再创建一个四列指标 Grid。
3. [AI 场景题] 完成一个 AI 仪表盘，包含指标、任务和最近活动。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| 外层 Grid | 负责页面级二维骨架 |
| 内层 Grid | 负责卡片矩阵 |
| Flexbox | 负责局部一维对齐 |
| AI 仪表盘 | Grid 综合能力的典型应用 |

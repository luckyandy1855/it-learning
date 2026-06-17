# Grid 简介（CSS-026）

## 🎯 本节学习目标

- 理解 CSS Grid 是二维布局模型。
- 掌握 `display: grid`、行、列、网格单元的基本概念。
- 能够用 Grid 搭建 AI 工具首页的基础卡片布局。

---

## 📖 什么是 Grid

CSS Grid 是专门处理二维布局的 CSS 模型。它可以同时控制行和列，非常适合仪表盘、卡片墙、后台管理页、复杂表单和内容区域布局。

Flexbox 更适合一维布局，例如一行按钮或一列消息；Grid 更适合二维结构，例如“左侧导航 + 主内容 + 右侧面板”。

在 AI 应用中，模型监控面板、知识库管理页、Prompt 模板库、数据指标卡片，都很适合使用 Grid。

---

## 🧠 原理讲解

给父元素设置 `display: grid` 后，它会成为 grid container，直接子元素成为 grid items。

```css
.dashboard {
  display: grid;
}
```

Grid 布局通常还需要定义列或行：

```css
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}
```

这表示容器被分成三列，每列平均分配可用空间。

---

## 🏗 基本结构

```html
<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
</style>

<div class="cards">
  <section>调用量</section>
  <section>成功率</section>
  <section>延迟</section>
</div>
```

---

## ✅ 完整代码

下面用 Grid 搭建一个 AI 指标卡片区：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Grid 简介示例</title>
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
      max-width: 960px;
      margin: 0 auto;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .metric-card {
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .metric-label {
      margin: 0 0 8px;
      color: #6b7280;
      font-size: 14px;
    }

    .metric-value {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <main class="dashboard">
    <h1>AI 应用指标</h1>
    <section class="metric-grid">
      <article class="metric-card">
        <p class="metric-label">今日调用量</p>
        <p class="metric-value">12,840</p>
      </article>
      <article class="metric-card">
        <p class="metric-label">生成成功率</p>
        <p class="metric-value">98.2%</p>
      </article>
      <article class="metric-card">
        <p class="metric-label">平均延迟</p>
        <p class="metric-value">1.4s</p>
      </article>
    </section>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

`.metric-grid` 设置 `display: grid`，开启 Grid 布局。

`grid-template-columns: repeat(3, 1fr)` 创建三列，每列占同等宽度。

`gap: 16px` 统一控制卡片之间的行列间距。

`.metric-card` 只负责单张指标卡片的视觉样式，不负责整体排列。

---

## 🌐 浏览器表现

三个指标卡片会横向排成三列，每列宽度一致，卡片之间有统一间距。

在 DevTools 中选中 `.metric-grid`，可以打开 Grid overlay，看到浏览器绘制出的网格线和列宽。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `display: grid` | CSS 声明 | 开启 Grid 布局 | `.grid { display: grid; }` |
| `grid-template-columns` | CSS 属性 | 定义列结构 | `repeat(3, 1fr)` |
| `grid-template-rows` | CSS 属性 | 定义行结构 | `auto 1fr` |
| `fr` | CSS 单位 | 分配剩余空间的比例单位 | `1fr` |
| `gap` | CSS 属性 | 网格间距 | `gap: 16px;` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- Grid 是二维布局模型。
- `display: grid` 写在父容器上，影响直接子元素。
- 卡片墙、仪表盘、管理后台优先考虑 Grid。

---

## ⚠️ 易错点

- 易错点1：用 Flexbox 硬做复杂行列布局。正确写法：二维结构优先考虑 Grid。
- 易错点2：只写 `display: grid` 却不定义列。正确写法：通常配合 `grid-template-columns`。
- 易错点3：给每个卡片手写 margin。正确写法：Grid 容器使用 `gap`。

---

## 💡 最佳实践

- 列数明确的卡片区使用 Grid。
- 网格间距使用 `gap`，不要让子项自己管理外部距离。
- 小屏幕适配时可以把多列改成一列。

---

## 🚀 AI 应用场景

AI 产品后台通常需要展示调用量、成功率、延迟、成本、活跃用户等指标。Grid 可以让这些指标卡片整齐排列。

```css
.ai-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
```

---

## 📝 练习题

1. [基础题] 创建一个三列 Grid 卡片布局。
2. [进阶题] 使用 `gap` 设置卡片行列间距。
3. [AI 场景题] 设计一个 AI 应用指标区，包含调用量、成功率和平均延迟三张卡片。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| Grid | CSS 二维布局模型 |
| grid container | 设置了 `display: grid` 的父容器 |
| `fr` | 按比例分配剩余空间 |
| AI 仪表盘 | Grid 是指标卡片布局首选 |

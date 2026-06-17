# clip-path 裁剪（CSS-053）

## 🎯 本节学习目标

- 理解 `clip-path` 可以裁剪元素可见区域。
- 掌握 `circle()`、`polygon()` 等基础裁剪函数。
- 能够为 AI 头像、状态图形和装饰性标记设计简单裁剪效果。

---

## 📖 什么是 clip-path

`clip-path` 用来定义元素的可见区域。区域外的部分会被裁剪掉。

它可以创建圆形、椭圆、多边形等视觉形状，不需要额外图片。

在 AI 应用中，`clip-path` 可用于头像裁剪、状态图标、选中标记和轻量视觉强调。但它不应承担核心信息表达。

---

## 🧠 原理讲解

圆形裁剪：

```css
.avatar {
  clip-path: circle(50%);
}
```

多边形裁剪：

```css
.tag {
  clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
}
```

被裁剪的只是视觉区域，元素本身的布局盒子仍然按原始矩形参与布局。

---

## 🏗 基本结构

```html
<style>
  .avatar {
    width: 48px;
    height: 48px;
    clip-path: circle(50%);
  }
</style>
```

---

## ✅ 完整代码

下面用 `clip-path` 实现 AI 头像和推荐标签：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>clip-path 示例</title>
  <style>
    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, sans-serif;
      background: #f8fafc;
      color: #111827;
    }

    .model-card {
      max-width: 640px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .model-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      clip-path: circle(50%);
      background: #2563eb;
      color: #ffffff;
      font-weight: 700;
    }

    .ribbon {
      display: inline-block;
      margin-top: 16px;
      padding: 6px 18px 6px 10px;
      clip-path: polygon(0 0, 100% 0, 88% 50%, 100% 100%, 0 100%);
      background: #fef3c7;
      color: #92400e;
      font-size: 14px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <article class="model-card">
    <div class="model-header">
      <div class="avatar">AI</div>
      <div>
        <h1>模型助手</h1>
        <p>头像使用圆形裁剪，标签使用多边形裁剪。</p>
      </div>
    </div>
    <span class="ribbon">推荐模型</span>
  </article>
</body>
</html>
```

---

## 🔍 逐行解析

`.avatar` 使用 `clip-path: circle(50%)`，把原本矩形区域裁剪成圆形。

`.ribbon` 使用 `polygon()` 创建右侧缺口形状。

`clip-path` 改变可见区域，但不改变元素在布局中的矩形占位。

标签内容仍然是真实文本，不依赖裁剪表达核心含义。

---

## 🌐 浏览器表现

AI 头像显示为圆形，推荐标签右侧有旗帜形缺口。布局仍按照原始盒模型排列。

在 DevTools 中调整 polygon 坐标，可以观察标签形状如何变化。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `clip-path` | CSS 属性 | 裁剪可见区域 | `clip-path: circle(50%);` |
| `circle()` | CSS 函数 | 圆形裁剪 | `circle(50%)` |
| `ellipse()` | CSS 函数 | 椭圆裁剪 | `ellipse(...)` |
| `polygon()` | CSS 函数 | 多边形裁剪 | `polygon(...)` |
| `inset()` | CSS 函数 | 矩形内缩裁剪 | `inset(10px)` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- `clip-path` 裁剪视觉区域，不改变布局盒。
- 圆形头像可用 `clip-path: circle(50%)`，也可用 `border-radius: 50%`。
- 核心信息不要只靠裁剪形状表达。

---

## ⚠️ 易错点

- 易错点1：以为裁剪后布局盒也变形。正确写法：布局仍按矩形盒计算。
- 易错点2：用复杂 polygon 做关键按钮。正确写法：交互控件优先保持清晰可点击区域。
- 易错点3：滥用装饰形状。正确写法：AI 工具界面应优先清晰和可读。

---

## 💡 最佳实践

- 头像裁剪优先用简单圆形。
- 装饰标签可以少量使用 polygon。
- 复杂图形需求更适合 SVG，而不是过度复杂的 clip-path。

---

## 🚀 AI 应用场景

AI 应用中，头像、模型标记和状态徽章可以用 `clip-path` 做轻量视觉差异，但文字和状态本身仍应保留在 HTML 中。

```css
.agent-avatar {
  clip-path: circle(50%);
}
```

---

## 📝 练习题

1. [基础题] 用 `clip-path: circle(50%)` 裁剪一个头像。
2. [进阶题] 使用 `polygon()` 做一个旗帜标签。
3. [AI 场景题] 为 AI 模型卡片设计圆形头像和推荐标签。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `clip-path` | 裁剪元素可见区域 |
| `circle()` | 创建圆形裁剪 |
| `polygon()` | 创建多边形裁剪 |
| AI 头像 | 适合简单视觉裁剪 |

# position: absolute 绝对定位（CSS-032）

## 🎯 本节学习目标

- 理解 `position: absolute` 会让元素脱离普通文档流。
- 掌握绝对定位元素如何寻找定位参照物。
- 能够用绝对定位实现 AI 输入框中的工具按钮和卡片角标。

---

## 📖 什么是 position: absolute

`position: absolute` 表示绝对定位。元素会脱离普通文档流，不再占据原本布局空间。

绝对定位元素会相对最近的“已定位祖先”定位。已定位祖先指 `position` 不是默认 `static` 的祖先，例如 `relative`、`absolute`、`fixed`、`sticky`。

如果没有找到已定位祖先，它通常会相对初始包含块定位，表现上容易跑到页面角落。

---

## 🧠 原理讲解

典型结构：

```css
.field {
  position: relative;
}

.clear-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}
```

`.field` 提供定位参照物，`.clear-button` 相对 `.field` 右侧垂直居中。

绝对定位适合小范围浮动控件，不适合承载整页主布局。

---

## 🏗 基本结构

```html
<style>
  .input-wrap {
    position: relative;
  }

  .tool {
    position: absolute;
    right: 8px;
    bottom: 8px;
  }
</style>

<div class="input-wrap">
  <textarea></textarea>
  <button class="tool">润色</button>
</div>
```

---

## ✅ 完整代码

下面在 AI Prompt 输入框右下角放置工具按钮：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>position absolute 示例</title>
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

    .prompt-panel {
      max-width: 720px;
      margin: 0 auto;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
    }

    .input-wrap {
      position: relative;
    }

    .prompt-input {
      width: 100%;
      min-height: 160px;
      padding: 12px 12px 52px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font: inherit;
      line-height: 1.7;
      resize: vertical;
    }

    .prompt-tools {
      position: absolute;
      right: 12px;
      bottom: 12px;
      display: flex;
      gap: 8px;
    }

    .prompt-tools button {
      padding: 6px 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #ffffff;
      font: inherit;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <section class="prompt-panel">
    <h1>Prompt 编辑器</h1>
    <div class="input-wrap">
      <textarea class="prompt-input">请把这段文字改写成适合公众号发布的版本。</textarea>
      <div class="prompt-tools">
        <button>润色</button>
        <button>扩写</button>
      </div>
    </div>
  </section>
</body>
</html>
```

---

## 🔍 逐行解析

`.input-wrap { position: relative; }` 创建输入区域的定位上下文。

`.prompt-tools { position: absolute; }` 让工具按钮脱离文档流，浮在输入框右下角。

`right: 12px` 和 `bottom: 12px` 控制工具栏距离输入区域边缘的位置。

`.prompt-input` 底部 padding 加大到 `52px`，避免输入文字被浮动工具按钮遮挡。

---

## 🌐 浏览器表现

Prompt 输入框右下角显示“润色”“扩写”按钮。按钮覆盖在输入区域内部，但文字内容不会被遮住。

在 DevTools 中取消 `.input-wrap` 的 relative，工具按钮的定位参照物会改变，位置可能不再贴合输入框。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `absolute` | position 值 | 绝对定位，脱离文档流 | `position: absolute;` |
| `top/right/bottom/left` | CSS 属性 | 控制定位偏移 | `right: 12px;` |
| `transform` | CSS 属性 | 常用于居中修正 | `translateY(-50%)` |
| `z-index` | CSS 属性 | 控制堆叠顺序 | `z-index: 10;` |
| 已定位祖先 | 布局概念 | absolute 的参照物 | `position: relative` 父级 |

---

## ⭐⭐⭐⭐⭐ 必学重点

- absolute 元素脱离普通文档流。
- absolute 会寻找最近的已定位祖先作为参照物。
- 浮动控件覆盖内容时，要给内容区域预留 padding。

---

## ⚠️ 易错点

- 易错点1：父元素没有定位上下文。正确写法：父容器加 `position: relative`。
- 易错点2：浮层遮住输入文字。正确写法：给输入框增加对应 padding。
- 易错点3：用 absolute 做主要页面布局。正确写法：页面骨架用 Grid/Flex，absolute 做局部浮动元素。

---

## 💡 最佳实践

- absolute 适合角标、关闭按钮、输入框内工具按钮。
- 绝对定位元素应靠近自己的定位父容器，不要跨太多层。
- 覆盖式元素需要检查重叠、焦点和点击区域。

---

## 🚀 AI 应用场景

AI Prompt 编辑器常有“润色、扩写、清空、插入变量”等工具按钮。它们可以放在输入框角落，既节省空间，又保持操作入口清晰。

```css
.prompt-field {
  position: relative;
}

.prompt-actions {
  position: absolute;
  right: 12px;
  bottom: 12px;
}
```

---

## 📝 练习题

1. [基础题] 在卡片右上角放置一个 absolute 角标。
2. [进阶题] 在 textarea 右下角放置两个工具按钮。
3. [AI 场景题] 设计一个 Prompt 输入框，内部包含“清空”和“优化”按钮，并避免遮挡文本。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| `absolute` | 绝对定位，脱离文档流 |
| 参照物 | 最近的已定位祖先 |
| 覆盖问题 | 浮层要避免遮挡内容 |
| AI 输入框 | 工具按钮常用 absolute 放在角落 |

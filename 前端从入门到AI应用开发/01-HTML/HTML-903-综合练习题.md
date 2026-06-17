# HTML 综合练习题（HTML-903）

## 🎯 本节学习目标

- 通过 30 道题复习 HTML 模块核心知识
- 能够从基础标签、页面结构、表单、媒体、安全和 AI 场景中定位问题
- 掌握参考答案的评分标准，知道怎样才算合格
- 为进入 CSS 模块前做一次系统自测

---

## 📖 什么是综合练习题

综合练习题用于检验你是否真正能把 HTML 用在页面里，而不是只记住标签名称。

本附录分为三组：基础题 10 道、进阶题 10 道、AI 场景题 10 道。每题都给出参考答案和评分标准。

---

## 🧠 原理讲解

HTML 练习要同时考察三件事：

```text
能写：知道标签和属性怎么写。
写对：结构、语义、属性、无障碍和安全都合理。
能解释：知道为什么这样写，不只是复制代码。
```

AI 时代的前端练习还要多一步：你要能审查 AI 生成的 HTML，而不是把模型输出原样粘进去。

---

## 🏗 基本结构

```text
基础题：检查 HTML 最小知识单元
进阶题：检查多个标签组合和质量意识
AI 场景题：检查真实 AI Web 页面建模能力
```

---

## ✅ 完整代码

下面是一个练习题常用的标准答案骨架：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML 综合练习</title>
</head>
<body>
  <header>
    <h1>HTML 综合练习</h1>
  </header>

  <main>
    <section aria-labelledby="practice-title">
      <h2 id="practice-title">练习区域</h2>
      <p>在这里完成 HTML 结构、表单和媒体相关练习。</p>
    </section>
  </main>
</body>
</html>
```

---

## 🔍 逐行解析

综合练习的答案不一定只有一种，但必须满足基础质量要求。

`DOCTYPE`、`lang`、`charset`、`viewport`、`title` 属于页面基础设施。

`header/main/section` 属于语义结构，能让页面区域清晰。

`aria-labelledby` 让区域与标题建立关系，方便辅助技术识别。

如果题目涉及表单，答案必须检查 `label/id/name/type/required`。如果涉及媒体，必须检查 `alt/fallback/controls/loading`。如果涉及 iframe，必须检查 `title/sandbox/referrerpolicy`。

---

## 🌐 浏览器表现

这些练习大多可以直接放进浏览器观察。基础题看页面能否显示，进阶题看结构是否合理，AI 场景题还要看是否给后续 CSS、JavaScript 和后端接口留下清晰契约。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 练习中常考点 | 示例 |
|---------|------|--------------|------|
| `lang` | 全局属性 | 多语言与无障碍 | `<html lang="zh-CN">` |
| `for/id` | 表单关联 | label 绑定字段 | `<label for="prompt">` |
| `name` | 表单字段 | 提交数据键名 | `name="prompt"` |
| `required` | 表单校验 | 必填字段 | `<textarea required>` |
| `type` | 控件类型 | button/input 行为 | `type="button"` |
| `alt` | 图片替代文本 | 图片信息可访问 | `alt="AI 输出截图"` |
| `controls` | 媒体属性 | 显示播放器控件 | `<video controls>` |
| `sandbox` | iframe 安全 | 限制嵌入权限 | `sandbox="allow-scripts"` |
| `aria-live` | 动态内容 | 流式输出宣告 | `aria-live="polite"` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- 写完整 HTML 骨架是最低要求
- 语义标签比 div 更能表达页面结构
- 表单题必须关注 label、name、type 和提交方式
- 媒体题必须关注替代文本、fallback 和加载策略
- AI 场景题必须额外考虑安全、无障碍和后续接口契约

---

## ⚠️ 易错点

- 只写代码，不解释选择理由，导致答案不可评估
- 表单字段没有 `name`，提交到后端时拿不到数据
- 在 form 内把普通按钮写成默认 submit
- iframe 缺少 `sandbox`，外部页面权限过大
- AI 输出区域没有考虑 XSS 和 `aria-live`

---

## 💡 最佳实践

- 做题时先写页面骨架，再补功能标签
- 每道题都检查是否有语义、无障碍、安全和可维护性要求
- 参考答案不是唯一写法，评分看是否满足约束
- 遇到 AI 场景题，要先定义输入、输出、状态和风险

---

## 🚀 AI 应用场景

你可以用下面的 Prompt 让 AI 帮你批改答案：

```text
请按 HTML 教材标准批改我的练习答案。
评分维度：
1. 基础结构是否完整。
2. 标签语义是否正确。
3. 表单字段是否可提交且可访问。
4. 媒体和 iframe 是否有安全与 fallback。
5. AI 场景是否考虑输出渲染、安全和无障碍。

请给出总分、扣分点、修复建议和修复后的关键代码。
```

---

## 📝 练习题

### 基础题（1~10）

1. 写出一个最小 HTML5 页面，包含 `DOCTYPE`、`html`、`head`、`body`、`charset`、`viewport` 和 `title`。  
参考答案：使用标准 HTML5 骨架。  
评分标准：骨架完整 6 分，meta 正确 2 分，缩进清晰 2 分。

2. 为一个中文 AI 助手页面设置正确的 `lang`，并解释它的作用。  
参考答案：`<html lang="zh-CN">`，作用是辅助读屏、翻译和搜索理解。  
评分标准：代码 4 分，解释无障碍 3 分，解释机器理解 3 分。

3. 写一个包含 h1、h2、p 的文章结构，主题是「如何写好提示词」。  
参考答案：一个 h1 作为页面标题，多个 h2 作为章节标题，p 写正文。  
评分标准：标题层级 5 分，段落语义 3 分，主题相关 2 分。

4. 写一个外链，要求新窗口打开并避免 opener 安全风险。  
参考答案：`<a href="https://example.com" target="_blank" rel="noopener noreferrer">来源</a>`。  
评分标准：href/target 4 分，rel 4 分，链接文本清晰 2 分。

5. 写一个图片标签，展示 AI 生成图片，并补充合适 `alt`、`width`、`height`。  
参考答案：`<img src="ai-image.png" alt="AI 生成的城市夜景插画" width="1200" height="800">`。  
评分标准：alt 4 分，尺寸 3 分，语义准确 3 分。

6. 写一个无序列表，列出 3 个常见 AI 工具。  
参考答案：`ul` 直接子元素必须是 `li`。  
评分标准：结构 6 分，内容 2 分，缩进 2 分。

7. 写一个表格，包含模板名称、用途、推荐模型三列。  
参考答案：使用 `table/caption/thead/tbody/th/td`。  
评分标准：表格结构 5 分，caption 2 分，scope 2 分，内容 1 分。

8. 写一个提示词输入框，要求使用 `textarea`，至少 6 行，必填。  
参考答案：`<textarea id="prompt" name="prompt" rows="6" required></textarea>`。  
评分标准：textarea 3 分，id/name 3 分，required 2 分，label 2 分。

9. 写一个模型选择下拉框，包含 GPT、Claude、Gemini 三个选项。  
参考答案：`select` 内包含三个 `option`。  
评分标准：select/name 3 分，option/value 4 分，label 2 分，默认提示 1 分。

10. 写一个提交按钮和一个普通复制按钮，避免复制按钮误提交表单。  
参考答案：提交按钮 `type="submit"`，复制按钮 `type="button"`。  
评分标准：type 正确 6 分，按钮文本 2 分，放在表单中合理 2 分。

### 进阶题（11~20）

11. 把一个由 div 组成的页面头部改成 `header/nav/ul/li/a` 结构。  
参考答案：使用语义导航，nav 增加 `aria-label`。  
评分标准：语义标签 5 分，列表结构 2 分，可访问名称 2 分，链接文本 1 分。

12. 为 AI 工具页面编写完整 `<head>`：title、description、canonical、og:title、og:description、og:image、og:type。  
参考答案：meta 信息完整，og:image 使用绝对 URL。  
评分标准：基础 SEO 5 分，OG 4 分，URL 正确 1 分。

13. 写一个文件上传字段，允许 `.txt`、`.md`、`.pdf`，并说明为什么服务端仍要校验。  
参考答案：`accept=".txt,.md,.pdf"`；前端限制可绕过。  
评分标准：代码 4 分，安全解释 4 分，label/name 2 分。

14. 写一个安全 iframe，嵌入外部 AI 小工具。  
参考答案：包含 `src/title/sandbox/loading/referrerpolicy`。  
评分标准：title 2 分，sandbox 4 分，隐私与懒加载 2 分，fallback 2 分。

15. 写一个 video，包含 MP4/WebM source、controls、poster 和字幕 track。  
参考答案：`video` 内两个 `source` 和一个 `track kind="subtitles"`。  
评分标准：多格式 3 分，控件/封面 3 分，字幕 3 分，fallback 1 分。

16. 写一个 audio 播放器，提供 MP3 source 和不支持时的 fallback 文案。  
参考答案：`<audio controls><source ...>您的浏览器不支持 audio。</audio>`。  
评分标准：controls 3 分，source/type 3 分，fallback 2 分，语义 2 分。

17. 修复两个 h1 的页面，让标题层级合理。  
参考答案：保留页面主标题 h1，把二级区域改成 h2。  
评分标准：唯一 h1 5 分，层级合理 3 分，解释清楚 2 分。

18. 为一个动态结果区域添加适合流式输出的无障碍属性。  
参考答案：`<section aria-live="polite" role="log">` 或等价结构。  
评分标准：aria-live 4 分，role/标题 3 分，使用场景解释 3 分。

19. 设计一个提示词模板表格，要求用 `scope` 标记表头。  
参考答案：列头 `scope="col"`，行头 `scope="row"`。  
评分标准：scope 5 分，表格完整 3 分，内容相关 2 分。

20. 为一个 AI 内容页写发布前 HTML 自查清单，至少 8 项。  
参考答案：覆盖基础结构、SEO、表单、媒体、iframe、安全、无障碍、性能。  
评分标准：覆盖面 6 分，具体可执行 3 分，AI 风险 1 分。

### AI 场景题（21~30）

21. 设计一个 AI 聊天页面的 HTML 骨架，包含消息列表、输入框、发送按钮和结果区域。  
参考答案：`main/section/form/textarea/button/article` 组合，输出区可加 `aria-live`。  
评分标准：结构 4 分，表单 3 分，无障碍 2 分，AI 场景贴合 1 分。

22. 写一个提示词优化工具表单，包含任务类型、原始提示词、输出格式、模型选择。  
参考答案：使用 `select/textarea/button`，字段有 `label/name`。  
评分标准：字段完整 5 分，表单可提交 3 分，语义分组 2 分。

23. AI 返回 Markdown 后要渲染到页面。说明直接插入 HTML 的风险，并给出安全展示容器。  
参考答案：风险是 XSS；容器可用 `<article id="answer" aria-live="polite"></article>`，实际渲染前需过滤。  
评分标准：风险 4 分，容器 3 分，过滤说明 3 分。

24. 为 RAG 知识库文章页设计语义结构，方便爬虫提取正文、标题、发布时间和标签。  
参考答案：使用 `article/h1/time/nav/aside/footer`，正文放 article/main。  
评分标准：语义 5 分，时间 2 分，噪声隔离 2 分，标签 1 分。

25. 设计一个 AI 图片生成结果卡片，包含图片、提示词、模型、生成时间和下载链接。  
参考答案：`figure/img/figcaption/time/a download`。  
评分标准：图片语义 3 分，元信息 3 分，下载链接 2 分，alt 2 分。

26. 设计一个 TTS 语音生成页面的 HTML，包含文本输入、声音选择、audio 预览和下载入口。  
参考答案：`textarea/select/button/audio/a download`。  
评分标准：表单 4 分，audio 3 分，下载 2 分，label 1 分。

27. 设计一个 AI 视频生成任务详情页，包含状态、预览视频、字幕和错误提示区。  
参考答案：状态区域可用 `aria-live`，视频用 `video/source/track`，错误用 role alert。  
评分标准：状态 3 分，视频 3 分，字幕 2 分，错误无障碍 2 分。

28. 写一个 iframe 嵌入页面，用于在知识库里嵌入外部 AI 助手，并说明 sandbox 的取舍。  
参考答案：只开放 `allow-forms allow-scripts` 等必要权限，不开放顶层导航。  
评分标准：代码 5 分，安全解释 4 分，fallback 1 分。

29. 用 HTML 设计一个「AI 输出质量评分表」，包含准确性、完整性、可读性、安全性四项。  
参考答案：使用 table，列包括维度、评分、说明、改进建议。  
评分标准：表格结构 4 分，维度完整 3 分，scope/caption 2 分，AI 场景 1 分。

30. 请让 AI 审查你在第 21 题写的聊天页面，并记录它指出的问题。你需要判断哪些是真问题、哪些是误判。  
参考答案：提交审查 Prompt、AI 反馈摘要、人工判断和修复后的关键代码。  
评分标准：Prompt 2 分，反馈记录 3 分，人工判断 3 分，修复 2 分。

---

## 📌 本节总结

| 题组 | 训练目标 | 合格标准 |
|------|----------|----------|
| 基础题 | 标签、属性、最小结构 | 能正确写出常用标签和属性 |
| 进阶题 | 组合结构、质量意识 | 能兼顾语义、无障碍、安全和性能 |
| AI 场景题 | 真实 AI Web 建模 | 能定义输入、输出、状态、风险和审查方式 |

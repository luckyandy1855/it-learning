# API-Key安全（AIW-003）

## 🎯 本节学习目标

- 理解为什么模型 API Key 不能放在前端。
- 理解它在 AI Web 应用数据流中的位置。
- 能够把本节知识应用到安全、稳定、可维护的 AI Chat 或 RAG 项目中。

---

## 📖 什么是API-Key安全

API-Key安全 是 AI Web 开发中的关键知识点。AI Web 不只是调用一个模型接口，它还涉及用户输入、上下文组织、后端代理、流式输出、成本控制、安全策略和可观测性。

与普通 CRUD 页面相比，AI 应用更容易出现接口慢、回复不可控、密钥泄露、token 成本失控和检索结果不准确等问题。

本节会把 API-Key安全 放在完整 AI 应用链路中讲解，避免只停留在 API 示例层面。

---

## 🧠 原理讲解

一个安全的 AI Web 调用链路通常是：

```text
浏览器前端
  ↓ 发送 Prompt 和上下文
业务后端代理
  ↓ 注入密钥、鉴权、限流、日志
模型服务 / RAG 服务
  ↓ 返回 JSON 或流式 token
前端增量渲染
```

本节核心入口：

```ts
process.env.OPENAI_API_KEY
```

前端不能直接持有模型 API Key，这是 AI Web 开发中最重要的安全边界之一。

---

## 🏗 基本结构

```ts
type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatRequest = {
  model: string;
  messages: ChatMessage[];
  stream: boolean;
};
```

---

## ✅ 完整代码

下面用一个后端代理示例演示 API-Key安全 的基本结构：

```ts
// 后端代理示例：不要在浏览器中直接暴露模型 API Key
type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatRequest = {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
};

async function handleChat(request: Request): Promise<Response> {
  const body = (await request.json()) as ChatRequest;

  if (!body.messages?.length) {
    return Response.json({ error: "messages 不能为空" }, { status: 400 });
  }

  const upstreamPayload = {
    model: body.model,
    messages: body.messages,
    stream: body.stream ?? true
  };

  return Response.json({
    topic: "API-Key安全",
    scene: "通过后端代理保护 OpenAI/Anthropic 密钥",
    syntax: "process.env.OPENAI_API_KEY",
    request: upstreamPayload
  });
}
```

---

## 🔍 逐行解析

`type ChatMessage` 定义对话消息结构。

`type ChatRequest` 定义前端提交给后端代理的请求体。

`handleChat(request: Request)` 表示一个后端接口处理函数。

`await request.json()` 读取浏览器提交的 JSON 请求体。

`if (!body.messages?.length)` 对输入做基础校验，避免空请求进入模型层。

`upstreamPayload` 是准备转发给模型服务的结构。

`Response.json(...)` 返回结构化结果，便于前端统一处理。

---

## 🌐 浏览器表现

浏览器前端不会直接看到模型 API Key，只会调用自己的 `/api/chat` 之类的后端接口。

在 Network 面板中可以观察请求体、响应状态、流式事件或错误信息。调试 AI Web 时，要同时看前端请求和后端日志。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `process.env.OPENAI_API_KEY` | 概念/API | 本节核心入口 | `process.env.OPENAI_API_KEY` |
| `messages` | 请求字段 | 多轮对话消息 | `[{ role, content }]` |
| `model` | 请求字段 | 指定模型名称 | `gpt-4.1-mini` |
| `stream` | 请求字段 | 是否启用流式输出 | `stream: true` |
| `Response.json()` | Web API | 返回 JSON 响应 | `Response.json(data)` |
| `Request` | Web API | 后端接口请求对象 | `request.json()` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- AI API Key 必须留在后端，不能打包到前端代码。
- AI Web 的核心链路是前端输入、后端代理、模型调用、结果渲染。
- API-Key安全 要同时考虑用户体验、安全、成本和可观测性。

---

## ⚠️ 易错点

- 易错点1：在前端 `.env` 中保存真实模型密钥。正确做法：前端只保存公开 API 地址，密钥放后端。
- 易错点2：只处理成功返回，不处理错误和超时。正确做法：统一处理 loading、error、abort 和 retry。
- 易错点3：把全部历史消息无限传给模型。正确做法：做上下文裁剪、摘要或 RAG 检索。

---

## 💡 最佳实践

- 设计 `/api/chat` 代理层，统一做鉴权、限流、日志和错误转换。
- 流式输出要支持取消生成和错误兜底。
- RAG 场景要记录检索来源，避免用户无法判断回答依据。

---

## 🚀 AI 应用场景

通过后端代理保护 OpenAI/Anthropic 密钥。

```ts
const aiWebChecklist = {
  topic: "API-Key安全",
  apiKeyInBrowser: false,
  supportsStreaming: true,
  hasErrorFallback: true,
  scene: "通过后端代理保护 OpenAI/Anthropic 密钥"
};
```

---

## 📝 练习题

1. [基础题] 设计一个 `ChatRequest` 类型，包含 `model`、`messages` 和 `stream`。
2. [进阶题] 写一个后端代理函数，对空 messages 返回 400 错误。
3. [AI 场景题] 基于 API-Key安全，为 AI Chat 项目补充安全、错误或流式输出处理。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| API-Key安全 | 理解为什么模型 API Key 不能放在前端 |
| 安全边界 | 模型密钥留在后端，前端只调用业务接口 |
| AI 数据流 | Prompt、上下文、模型响应和 UI 渲染需要串联 |
| 实践重点 | 同时关注体验、安全、成本和可观测性 |

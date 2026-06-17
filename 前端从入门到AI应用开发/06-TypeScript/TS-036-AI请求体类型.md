# AI请求体类型（TS-036）

## 🎯 本节学习目标

- 为 AI Chat 请求体建模。
- 理解它如何提升 AI Web 项目的可维护性和可调试性。
- 能够把本节类型知识应用到消息、模型配置、请求体或 React 组件中。

---

## 📖 什么是AI请求体类型

AI请求体类型 是 TypeScript 类型系统中的重要知识点。它帮助我们在代码运行前发现数据结构不一致、字段拼写错误、参数类型错误和接口响应误用。

AI 应用的数据结构通常比普通页面更复杂：消息有不同角色，模型有不同能力，请求可能流式返回，Agent 还可能产生工具调用。没有类型约束时，这些结构很容易在重构后出现隐蔽错误。

本节重点是把类型知识放进 AI Web 的真实数据流里理解。

---

## 🧠 原理讲解

TypeScript 的核心价值是“在开发阶段检查 JavaScript 数据契约”：

```text
业务数据结构
  ↓
类型声明
  ↓
编辑器提示和编译检查
  ↓
更稳定的运行时代码
```

本节核心写法：

```ts
interface ChatRequest
```

类型不会直接改变浏览器运行时行为，但它会显著影响开发阶段的反馈质量。

---

## 🏗 基本结构

```ts
type Message = {
  role: "user" | "assistant";
  content: string;
};

const message: Message = {
  role: "user",
  content: "解释 AI请求体类型"
};
```

---

## ✅ 完整代码

下面用一个类型安全的 AI Chat 请求构建示例演示 AI请求体类型：

```ts
type Role = "system" | "user" | "assistant";

type Message = {
  readonly id: string;
  role: Role;
  content: string;
};

type ChatRequest = {
  model: string;
  stream: boolean;
  messages: Message[];
};

type ChatResult<T> = {
  ok: boolean;
  data: T;
};

function createUserMessage(content: string): Message {
  return {
    id: crypto.randomUUID(),
    role: "user",
    content
  };
}

function buildRequest(prompt: string): ChatResult<ChatRequest> {
  const message = createUserMessage(prompt);

  return {
    ok: true,
    data: {
      model: "gpt-4.1-mini",
      stream: true,
      messages: [message]
    }
  };
}

const result = buildRequest("请解释 AI请求体类型");
console.log("约束 model、messages、stream、temperature", result);
```

---

## 🔍 逐行解析

`type Role = ...` 用字面量联合类型限制消息角色。

`type Message = { ... }` 描述单条对话消息的结构。

`readonly id: string` 表示消息 id 创建后不应被随意修改。

`type ChatRequest = { ... }` 描述发送给 AI 后端的请求体。

`type ChatResult<T>` 使用泛型表达不同类型的数据结果。

`createUserMessage(content: string): Message` 明确函数参数和返回值类型。

`buildRequest(prompt: string): ChatResult<ChatRequest>` 把 Prompt 转换成类型安全的请求对象。

---

## 🌐 浏览器表现

TypeScript 代码需要先通过编译或构建工具转换为 JavaScript，浏览器最终运行的是编译后的 JS。

在编辑器中，如果把 `role` 写成不存在的值，或者漏掉 `content` 字段，TypeScript 会在开发阶段提示错误。

---

## 📦 常见属性 / API

| 属性/API | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `interface ChatRequest` | TypeScript 写法 | 本节核心语法入口 | `interface ChatRequest` |
| `type` | 关键字 | 定义类型别名 | `type Role = "user"` |
| `interface` | 关键字 | 定义对象结构 | `interface Message {}` |
| `readonly` | 修饰符 | 限制属性不可重新赋值 | `readonly id: string` |
| 泛型 `<T>` | 类型参数 | 让类型随输入变化 | `Result<T>` |
| 联合类型 | 类型组合 | 表达多个可能值 | `"idle" | "loading"` |

---

## ⭐⭐⭐⭐⭐ 必学重点

- TypeScript 的目标是约束数据契约，不是替代运行时校验。
- AI 应用要优先给消息、请求体、响应体和组件 Props 建模。
- AI请求体类型 要结合真实数据结构使用，避免为了写类型而写类型。

---

## ⚠️ 易错点

- 易错点1：遇到报错就写 `any`。正确做法：先收窄未知数据，再建立明确类型。
- 易错点2：只给变量加类型，不给函数返回值和接口响应建模。正确做法：关键边界都要有类型。
- 易错点3：以为 TypeScript 能保证接口真实返回一定正确。正确理解：外部数据仍需要运行时校验。

---

## 💡 最佳实践

- 从核心业务对象开始建模，例如 `Message`、`ChatRequest`、`ChatResponse`。
- 对外部 API 返回值先使用 `unknown`，校验后再转换成业务类型。
- 类型定义应靠近业务边界，避免散落和重复。

---

## 🚀 AI 应用场景

约束 model、messages、stream、temperature。

```ts
type AiTypeTask = {
  topic: "AI请求体类型";
  syntax: "interface ChatRequest";
  scene: string;
};

const task: AiTypeTask = {
  topic: "AI请求体类型",
  syntax: "interface ChatRequest",
  scene: "约束 model、messages、stream、temperature"
};
```

---

## 📝 练习题

1. [基础题] 为一个包含 `role` 和 `content` 的消息对象添加 TypeScript 类型。
2. [进阶题] 把本节完整代码改造成支持 assistant 消息的版本。
3. [AI 场景题] 使用 AI请求体类型 为 AI Chat 的请求体或响应体建立类型约束。

---

## 📌 本节总结

| 知识点 | 一句话总结 |
|--------|-----------|
| AI请求体类型 | 为 AI Chat 请求体建模 |
| 类型契约 | 让数据结构在开发阶段可检查 |
| AI 应用 | 消息、模型、请求和响应都需要类型建模 |
| 实践重点 | 少用 `any`，优先表达真实业务结构 |

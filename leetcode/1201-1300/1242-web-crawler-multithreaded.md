# 1242. Web Crawler Multithreaded

---
编号: 1242
题目: Web Crawler Multithreaded
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 多线程]
来源链接: https://leetcode.com/problems/web-crawler-multithreaded/
---

## 题目描述

给你一个初始地址 `startUrl` 和一个 HTML 解析器接口 `HtmlParser`，请你实现一个 **多线程的网页爬虫**，用于获取与 `startUrl` 有 **相同主机名 **的所有链接。

以 **任意 **顺序返回爬虫获取的路径。

爬虫应该遵循：

- 从 `startUrl` 开始

- 调用 `HtmlParser.getUrls(url)` 从指定网页路径获得的所有路径。

- 不要抓取相同的链接两次。

- 仅浏览与 `startUrl` **相同主机名 **的链接。

如上图所示，主机名是 `example.org` 。简单起见，你可以假设所有链接都采用 **http 协议**，并且没有指定 **端口号**。举个例子，链接 `http://leetcode.com/problems` 和链接 `http://leetcode.com/contest` 属于同一个 **主机名**， 而 `http://example.org/test` 与 `http://example.com/abc` 并不属于同一个 **主机名**。

`HtmlParser` 的接口定义如下：

```text
interface HtmlParser {
  // Return a list of all urls from a webpage of given url.
  // This is a blocking call, that means it will do HTTP request and return when this request is finished.
  public List getUrls(String url);
}
```

注意一点，`getUrls(String url)` 模拟执行一个HTTP的请求。 你可以将它当做一个阻塞式的方法，直到请求结束。 `getUrls(String url)` 保证会在 **15ms **内返回所有的路径。 单线程的方案会超过时间限制，你能用多线程方案做的更好吗？

对于问题所需的功能，下面提供了两个例子。为了方便自定义测试，你可以声明三个变量 `urls`，`edges` 和 `startUrl`。但要注意你只能在代码中访问 `startUrl`，并不能直接访问 `urls` 和 `edges`。

**拓展问题：**

- 假设我们要要抓取 10000 个节点和 10 亿个路径。并且在每个节点部署相同的的软件。软件可以发现所有的节点。我们必须尽可能减少机器之间的通讯，并确保每个节点负载均衡。你将如何设计这个网页爬虫？

- 如果有一个节点发生故障不工作该怎么办？

- 如何确认爬虫任务已经完成？

**示例 1：**

```text
输入：
urls = [
  "http://news.yahoo.com",
  "http://news.yahoo.com/news",
  "http://news.yahoo.com/news/topics/",
  "http://news.google.com",
  "http://news.yahoo.com/us"
]
edges = [[2,0],[2,1],[3,2],[3,1],[0,4]]
startUrl = "http://news.yahoo.com/news/topics/"
输出：[
  "http://news.yahoo.com",
  "http://news.yahoo.com/news",
  "http://news.yahoo.com/news/topics/",
  "http://news.yahoo.com/us"
]
```

**示例 2：**

****

```text
输入：
urls = [
  "http://news.yahoo.com",
  "http://news.yahoo.com/news",
  "http://news.yahoo.com/news/topics/",
  "http://news.google.com"
]
edges = [[0,2],[2,1],[3,2],[3,1],[3,0]]
startUrl = "http://news.google.com"
输出：["http://news.google.com"]
解释：startUrl 链接与其他页面不共享一个主机名。
```

**提示：**

- `1 https://en.wikipedia.org/wiki/Hostname#Restrictions_on_valid_hostnames

- 你可以假设路径都是不重复的。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 多线程」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

### 示意图

```text
输入/状态  ->  按规则更新候选状态  ->  得到答案
   |                 |                    |
  边界             不变量               返回值
```

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 参考解法 | 见「参考解法要点」 | 见「参考解法要点」 |

---

## 代码实现

### Go

```go
// Web Crawler Multithreaded：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。

```

### Java

```java
// Web Crawler Multithreaded：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;

```

### Python

```python
# Web Crawler Multithreaded：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。

```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

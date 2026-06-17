# 0359. Logger Rate Limiter

---
编号: 359
题目: Logger Rate Limiter
难度: 简单
标签: [设计, 哈希表, 数据流]
来源链接: https://leetcode.com/problems/logger-rate-limiter/
---

## 题目描述

请你设计一个日志系统，可以流式接收消息以及它的时间戳。每条 **不重复** 的消息最多只能每 10 秒打印一次。也就是说，如果在时间戳 `t` 打印某条消息，那么相同内容的消息直到时间戳变为 `t + 10` 之前都不会被打印。

所有消息都按时间顺序发送。多条消息可能到达同一时间戳。

实现 `Logger` 类：

	- `Logger()` 初始化 `logger` 对象

	- `bool shouldPrintMessage(int timestamp, string message)` 如果这条消息 `message` 在给定的时间戳 `timestamp` 应该被打印出来，则返回 `true` ，否则请返回 `false` 。

**示例：**

```text
输入：
["Logger", "shouldPrintMessage", "shouldPrintMessage", "shouldPrintMessage", "shouldPrintMessage", "shouldPrintMessage", "shouldPrintMessage"]
[[], [1, "foo"], [2, "bar"], [3, "foo"], [8, "bar"], [10, "foo"], [11, "foo"]]
输出：
[null, true, true, false, false, false, true]

解释：
Logger logger = new Logger();
logger.shouldPrintMessage(1, "foo");  // 返回 true ，下一次 "foo" 可以打印的时间戳是 1 + 10 = 11
logger.shouldPrintMessage(2, "bar");  // 返回 true ，下一次 "bar" 可以打印的时间戳是 2 + 10 = 12
logger.shouldPrintMessage(3, "foo");  // 3 = 11 ，返回 true ，下一次 "foo" 可以打印的时间戳是 11 + 10 = 21
```

**提示：**

	- `0 <= timestamp <= 10^9`

	- 每个 `timestamp` 都将按非递减顺序（时间顺序）传递

	- `1 <= message.length <= 30`

	- 最多调用 `10^4` 次 `shouldPrintMessage` 方法

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 哈希表, 数据流」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个哈希表 $\textit{ts}$ 来存储每个消息的下一个可打印时间戳。在调用 `shouldPrintMessage` 方法时，我们检查当前时间戳是否大于等于消息的下一个可打印时间戳，若是则更新该消息的下一个可打印时间戳为当前时间戳加 10，并返回 `true`，否则返回 `false`。

时间复杂度 $O(1)$。空间复杂度 $O(m)$，其中 $m$ 是不同消息的数量。

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
// Logger Rate Limiter：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type Logger struct {
	ts map[string]int
}

func Constructor() Logger {
	return Logger{ts: make(map[string]int)}
}

func (this *Logger) ShouldPrintMessage(timestamp int, message string) bool {
	if t, ok := this.ts[message]; ok && timestamp < t {
		return false
	}
	this.ts[message] = timestamp + 10
	return true
}

/**
 * Your Logger object will be instantiated and called as such:
 * obj := Constructor();
 * param_1 := obj.ShouldPrintMessage(timestamp,message);
 */
```

### Java

```java
// Logger Rate Limiter：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Logger {
    private Map<String, Integer> ts = new HashMap<>();

    public Logger() {
    }

    public boolean shouldPrintMessage(int timestamp, String message) {
        int t = ts.getOrDefault(message, 0);
        if (timestamp < t) {
            return false;
        }
        ts.put(message, timestamp + 10);
        return true;
    }
}

/**
 * Your Logger object will be instantiated and called as such:
 * Logger obj = new Logger();
 * boolean param_1 = obj.shouldPrintMessage(timestamp,message);
 */
```

### Python

```python
# Logger Rate Limiter：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Logger:

    def __init__(self):
        self.ts = {}

    def shouldPrintMessage(self, timestamp: int, message: str) -> bool:
        t = self.ts.get(message, 0)
        if t > timestamp:
            return False
        self.ts[message] = timestamp + 10
        return True


# Your Logger object will be instantiated and called as such:
# obj = Logger()
# param_1 = obj.shouldPrintMessage(timestamp,message)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

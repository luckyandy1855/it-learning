# 0636. Exclusive Time of Functions

---
编号: 636
题目: Exclusive Time of Functions
难度: 中等
标签: [栈, 数组]
来源链接: https://leetcode.com/problems/exclusive-time-of-functions/
---

## 题目描述

有一个 **单线程** CPU 正在运行一个含有 `n` 道函数的程序。每道函数都有一个位于  `0` 和 `n-1` 之间的唯一标识符。

函数调用 **存储在一个 调用栈 上** ：当一个函数调用开始时，它的标识符将会推入栈中。而当一个函数调用结束时，它的标识符将会从栈中弹出。标识符位于栈顶的函数是 **当前正在执行的函数** 。每当一个函数开始或者结束时，将会记录一条日志，包括函数标识符、是开始还是结束、以及相应的时间戳。

给你一个由日志组成的列表 `logs` ，其中 `logs[i]` 表示第 `i` 条日志消息，该消息是一个按 `"{function_id}:{"start" | "end"}:{timestamp}"` 进行格式化的字符串。例如，`"0:start:3"` 意味着标识符为 `0` 的函数调用在时间戳 `3` 的 **起始开始执行** ；而 `"1:end:2"` 意味着标识符为 `1` 的函数调用在时间戳 `2` 的 **末尾结束执行**。注意，函数可以 **调用多次，可能存在递归调用 **。

函数的 **独占时间** 定义是在这个函数在程序所有函数调用中执行时间的总和，调用其他函数花费的时间不算该函数的独占时间。例如，如果一个函数被调用两次，一次调用执行 `2` 单位时间，另一次调用执行 `1` 单位时间，那么该函数的 **独占时间** 为 `2 + 1 = 3` 。

以数组形式返回每个函数的 **独占时间** ，其中第 `i` 个下标对应的值表示标识符 `i` 的函数的独占时间。

**示例 1：**

```text
输入：n = 2, logs = ["0:start:0","1:start:2","1:end:5","0:end:6"]
输出：[3,4]
解释：
函数 0 在时间戳 0 的起始开始执行，执行 2 个单位时间，于时间戳 1 的末尾结束执行。
函数 1 在时间戳 2 的起始开始执行，执行 4 个单位时间，于时间戳 5 的末尾结束执行。
函数 0 在时间戳 6 的开始恢复执行，执行 1 个单位时间。
所以函数 0 总共执行 2 + 1 = 3 个单位时间，函数 1 总共执行 4 个单位时间。
```

**示例 2：**

```text
输入：n = 1, logs = ["0:start:0","0:start:2","0:end:5","0:start:6","0:end:6","0:end:7"]
输出：[8]
解释：
函数 0 在时间戳 0 的起始开始执行，执行 2 个单位时间，并递归调用它自身。
函数 0（递归调用）在时间戳 2 的起始开始执行，执行 4 个单位时间。
函数 0（初始调用）恢复执行，并立刻再次调用它自身。
函数 0（第二次递归调用）在时间戳 6 的起始开始执行，执行 1 个单位时间。
函数 0（初始调用）在时间戳 7 的起始恢复执行，执行 1 个单位时间。
所以函数 0 总共执行 2 + 4 + 1 + 1 = 8 个单位时间。
```

**示例 3：**

```text
输入：n = 2, logs = ["0:start:0","0:start:2","0:end:5","1:start:6","1:end:6","0:end:7"]
输出：[7,1]
解释：
函数 0 在时间戳 0 的起始开始执行，执行 2 个单位时间，并递归调用它自身。
函数 0（递归调用）在时间戳 2 的起始开始执行，执行 4 个单位时间。
函数 0（初始调用）恢复执行，并立刻调用函数 1 。
函数 1在时间戳 6 的起始开始执行，执行 1 个单位时间，于时间戳 6 的末尾结束执行。
函数 0（初始调用）在时间戳 7 的起始恢复执行，执行 1 个单位时间，于时间戳 7 的末尾结束执行。
所以函数 0 总共执行 2 + 4 + 1 = 7 个单位时间，函数 1 总共执行 1 个单位时间。
```

**提示：**

- `1 <= n <= 100`

- `2 <= logs.length <= 500`

- `0 <= function_id < n`

- `0 <= timestamp <= 10^9`

- 两个开始事件不会在同一时间戳发生

- 两个结束事件不会在同一时间戳发生

- 每道函数都有一个对应 `"start"` 日志的 `"end"` 日志

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个栈 $\textit{stk}$，用于存储当前正在执行的函数的标识符。同时，我们定义一个数组 $\textit{ans}$，用于存储每个函数的独占时间，初始时每个函数的独占时间都为 $0$。用一个变量 $\textit{pre}$ 记录上一个时间戳。

遍历日志数组，对于每一条日志，我们首先将其按照冒号分隔，得到函数标识符 $\textit{i}$，操作类型 $\textit{op}$ 和时间戳 $\textit{t}$。

如果 $\textit{op}$ 为 $\text{start}$，则表示函数 $\textit{i}$ 开始执行，我们需要判断栈是否为空，如果不为空，则将栈顶函数的独占时间增加 $\textit{cur} - \textit{pre}$，然后将 $\textit{i}$ 入栈，更新 $\textit{pre}$ 为 $\textit{cur}$；如果 $\textit{op}$ 为 $\text{end}$，则表示函数 $\textit{i}$ 结束执行，我们将栈顶函数的独占时间增加 $\textit{cur} - \textit{pre} + 1$，然后将栈顶元素出栈，更新 $\textit{pre}$ 为 $\textit{cur} + 1$。

最后返回数组 $\textit{ans}$ 即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为日志数组的长度。

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
// Exclusive Time of Functions：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func exclusiveTime(n int, logs []string) []int {
	ans := make([]int, n)
	stk := []int{}
	pre := 0
	for _, log := range logs {
		parts := strings.Split(log, ":")
		i, _ := strconv.Atoi(parts[0])
		cur, _ := strconv.Atoi(parts[2])
		if parts[1][0] == 's' {
			if len(stk) > 0 {
				ans[stk[len(stk)-1]] += cur - pre
			}
			stk = append(stk, i)
			pre = cur
		} else {
			ans[stk[len(stk)-1]] += cur - pre + 1
			stk = stk[:len(stk)-1]
			pre = cur + 1
		}
	}
	return ans
}
```

### Java

```java
// Exclusive Time of Functions：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] exclusiveTime(int n, List<String> logs) {
        int[] ans = new int[n];
        Deque<Integer> stk = new ArrayDeque<>();
        int pre = 0;
        for (var log : logs) {
            var parts = log.split(":");
            int i = Integer.parseInt(parts[0]);
            int cur = Integer.parseInt(parts[2]);
            if (parts[1].charAt(0) == 's') {
                if (!stk.isEmpty()) {
                    ans[stk.peek()] += cur - pre;
                }
                stk.push(i);
                pre = cur;
            } else {
                ans[stk.pop()] += cur - pre + 1;
                pre = cur + 1;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Exclusive Time of Functions：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def exclusiveTime(self, n: int, logs: List[str]) -> List[int]:
        stk = []
        ans = [0] * n
        pre = 0
        for log in logs:
            i, op, t = log.split(":")
            i, cur = int(i), int(t)
            if op[0] == "s":
                if stk:
                    ans[stk[-1]] += cur - pre
                stk.append(i)
                pre = cur
            else:
                ans[stk.pop()] += cur - pre + 1
                pre = cur + 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

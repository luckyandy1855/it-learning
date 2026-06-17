# 0277. Find the Celebrity

---
编号: 277
题目: Find the Celebrity
难度: 中等
标签: [图, 双指针, 交互]
来源链接: https://leetcode.com/problems/find-the-celebrity/
---

## 题目描述

假设你是一个专业的狗仔，参加了一个 `n` 人派对，其中每个人被从 `0` 到 `n - 1` 标号。在这个派对人群当中可能存在一位 “名人”。所谓 “名人” 的定义是：其他所有 `n - 1` 个人都认识他/她，而他/她并不认识其他任何人。

现在你想要确认这个 “名人” 是谁，或者确定这里没有 “名人”。而你唯一能做的就是问诸如 “A 你好呀，请问你认不认识 B呀？” 的问题，以确定 A 是否认识 B。你需要在（渐近意义上）尽可能少的问题内来确定这位 “名人” 是谁（或者确定这里没有 “名人”）。

给定整数 `n` 和一个辅助函数 `bool knows(a, b)` 用来获取 `a` 是否认识 `b`。实现一个函数 `int findCelebrity(n)`。派对最多只会有一个 “名人” 参加。

若 “名人” 存在，请返回他/她的编号；若 “名人” 不存在，请返回 `-1`。

**注意** `n x n` 的二维数组 `graph` 给定的输入并不是 **直接** 提供给你的，而是 **只能** 通过辅助函数 `knows` 获取。`graph[i][j] == 1` 表示 `i` 认识 `j`，而 `graph[i][j] == 0` 表示 `j` 不认识 `i`。

示例 1:

```text
输入: graph = [[1,1,0],[0,1,0],[1,1,1]]
输出: 1
解释: 有编号分别为 0、1 和 2 的三个人。graph[i][j] = 1 代表编号为 i 的人认识编号为 j 的人，而 graph[i][j] = 0 则代表编号为 i 的人不认识编号为 j 的人。“名人” 是编号 1 的人，因为 0 和 2 均认识他/她，但 1 不认识任何人。
```

** **

**示例 2:**

```text
输入: graph = [[1,0,1],[1,1,0],[0,1,1]]
输出: -1
解释: 没有 “名人”
```

** **

** **

**提示：**

** **

- `n == graph.length == graph[i].length`

- `2 进阶：**如果允许调用 API `knows` 的最大次数为 `3 * n` ，你可以设计一个不超过最大调用次数的解决方案吗？

** **

** **

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「图, 双指针, 交互」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

经过验证，若暴力遍历，调用 $O(n^2)$ 次 $knows$ 方法，会报 TLE 错误。因此，我们需要寻找更优的解法。

要找出 $n$ 个人中的名人，题目给我们的关键信息是：1. 名人不认识其他所有人；2. 其他所有人都认识名人。

那么，我们初始时假定名人 $ans=0$。然后在 $[1,n)$ 范围内遍历 $i$，若 $ans$ 认识 $i$，说明 $ans$ 不是我们要找的名人，此时我们可以直接将 $ans$ 更新为 $i$。

为什么呢？我们来举个实际的例子。

```bash
ans = 0
for i in [1,n) {
	if (ans knows i) {
		ans = i
	}
}

ans = 0

ans not knows 1
ans not knows 2
ans knows 3
ans = 3

ans not knows 4
ans not knows 5
ans not knows 6
ans = 6
```

这里 $ans$ 认识 $3$，说明 $ans$ 不是名人（即 $0$ 不是名人），那么名人会是 $1$ 或者 $2$ 吗？不会！因为若 $1$ 或者 $2$ 是名人，那么 $0$ 应该认识 $1$ 或者 $2$ 才对，与前面的例子冲突。因此，我们可以直接将 $ans$ 更新为 $i$。

我们找出 $ans$ 之后，接下来再遍历一遍，判断 $ans$ 是否满足名人的条件。若不满足，返回 $-1$。

否则遍历结束，返回 $ans$。

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
// Find the Celebrity：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * The knows API is already defined for you.
 *     knows := func(a int, b int) bool
 */
func solution(knows func(a int, b int) bool) func(n int) int {
	return func(n int) int {
		ans := 0
		for i := 1; i < n; i++ {
			if knows(ans, i) {
				ans = i
			}
		}
		for i := 0; i < n; i++ {
			if ans != i {
				if knows(ans, i) || !knows(i, ans) {
					return -1
				}
			}
		}
		return ans
	}
}
```

### Java

```java
import java.util.*;
// Find the Celebrity：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/* The knows API is defined in the parent class Relation.
      boolean knows(int a, int b); */

public class Solution extends Relation {
    public int findCelebrity(int n) {
        int ans = 0;
        for (int i = 1; i < n; ++i) {
            if (knows(ans, i)) {
                ans = i;
            }
        }
        for (int i = 0; i < n; ++i) {
            if (ans != i) {
                if (knows(ans, i) || !knows(i, ans)) {
                    return -1;
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Find the Celebrity：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# The knows API is already defined for you.
# return a bool, whether a knows b
# def knows(a: int, b: int) -> bool:


class Solution:
    def findCelebrity(self, n: int) -> int:
        ans = 0
        for i in range(1, n):
            if knows(ans, i):
                ans = i
        for i in range(n):
            if ans != i:
                if knows(ans, i) or not knows(i, ans):
                    return -1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0946. Validate Stack Sequences

---
编号: 946
题目: Validate Stack Sequences
难度: 中等
标签: [栈, 数组, 模拟]
来源链接: https://leetcode.com/problems/validate-stack-sequences/
---

## 题目描述

给定 `pushed` 和 `popped` 两个序列，每个序列中的 **值都不重复**，只有当它们可能是在最初空栈上进行的推入 push 和弹出 pop 操作序列的结果时，返回 `true`；否则，返回 `false` 。

**示例 1：**

```text
输入：pushed = [1,2,3,4,5], popped = [4,5,3,2,1]
输出：true
解释：我们可以按以下顺序执行：
push(1), push(2), push(3), push(4), pop() -> 4,
push(5), pop() -> 5, pop() -> 3, pop() -> 2, pop() -> 1
```

**示例 2：**

```text
输入：pushed = [1,2,3,4,5], popped = [4,3,5,1,2]
输出：false
解释：1 不能在 2 之前弹出。
```

**提示：**

- `1 <= pushed.length <= 1000`

- `0 <= pushed[i] <= 1000`

- `pushed` 的所有元素 **互不相同**

- `popped.length == pushed.length`

- `popped` 是 `pushed` 的一个排列

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 数组, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们遍历 $\textit{pushed}$ 数组，对于当前遍历到的元素 $x$，我们将其压入栈 $\textit{stk}$ 中，然后判断栈顶元素是否和 $\textit{popped}$ 数组中下一个要弹出的元素相等，如果相等，我们就将栈顶元素弹出并将 $\textit{popped}$ 数组中下一个要弹出的元素的索引 $i$ 加一。最后，如果要弹出的元素都能按照 $\textit{popped}$ 数组的顺序弹出，返回 $\textit{true}$，否则返回 $\textit{false}$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为 $\textit{pushed}$ 数组的长度。

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
// Validate Stack Sequences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func validateStackSequences(pushed []int, popped []int) bool {
	stk := []int{}
	i := 0
	for _, x := range pushed {
		stk = append(stk, x)
		for len(stk) > 0 && stk[len(stk)-1] == popped[i] {
			stk = stk[:len(stk)-1]
			i++
		}
	}
	return i == len(popped)
}
```

### Java

```java
// Validate Stack Sequences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean validateStackSequences(int[] pushed, int[] popped) {
        Deque<Integer> stk = new ArrayDeque<>();
        int i = 0;
        for (int x : pushed) {
            stk.push(x);
            while (!stk.isEmpty() && stk.peek() == popped[i]) {
                stk.pop();
                ++i;
            }
        }
        return i == popped.length;
    }
}
```

### Python

```python
# Validate Stack Sequences：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def validateStackSequences(self, pushed: List[int], popped: List[int]) -> bool:
        stk = []
        i = 0
        for x in pushed:
            stk.append(x)
            while stk and stk[-1] == popped[i]:
                stk.pop()
                i += 1
        return i == len(popped)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

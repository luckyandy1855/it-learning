# 0962. Maximum Width Ramp

---
编号: 962
题目: Maximum Width Ramp
难度: 中等
标签: [栈, 数组, 双指针, 单调栈]
来源链接: https://leetcode.com/problems/maximum-width-ramp/
---

## 题目描述

给定一个整数数组 `A`，*坡*是元组 `(i, j)`，其中  `i
- `2

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 数组, 双指针, 单调栈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题意，我们可以发现，所有可能的 $\textit{nums}[i]$ 所构成的子序列一定是单调递减的。为什么呢？我们不妨用反证法证明一下。

假设存在 $i_1<i_2$，并且 $\textit{nums}[i_1]\leq\textit{nums}[i_2]$，那么实际上 $\textit{nums}[i_2]$ 一定不可能是一个候选值，因为 $\textit{nums}[i_1]$ 更靠左，会是一个更优的值。因此 $\textit{nums}[i]$ 所构成的子序列一定单调递减，并且 $i$ 一定是从 0 开始。

我们用一个从栈底到栈顶单调递减的栈 $\textit{stk}$ 来存储所有可能的 $\textit{nums}[i]$，然后我们从右边界开始遍历 $j$，若遇到 $\textit{nums}[\textit{stk.top()}]\leq\textit{nums}[j]$，说明此时构成一个坡，循环弹出栈顶元素，更新 $\textit{ans}$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$，其中 $n$ 表示 $\textit{nums}$ 的长度。

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
// Maximum Width Ramp：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxWidthRamp(nums []int) int {
	n := len(nums)
	stk := []int{}
	for i, v := range nums {
		if len(stk) == 0 || nums[stk[len(stk)-1]] > v {
			stk = append(stk, i)
		}
	}
	ans := 0
	for i := n - 1; i >= 0; i-- {
		for len(stk) > 0 && nums[stk[len(stk)-1]] <= nums[i] {
			ans = max(ans, i-stk[len(stk)-1])
			stk = stk[:len(stk)-1]
		}
		if len(stk) == 0 {
			break
		}
	}
	return ans
}
```

### Java

```java
// Maximum Width Ramp：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxWidthRamp(int[] nums) {
        int n = nums.length;
        Deque<Integer> stk = new ArrayDeque<>();
        for (int i = 0; i < n; ++i) {
            if (stk.isEmpty() || nums[stk.peek()] > nums[i]) {
                stk.push(i);
            }
        }
        int ans = 0;
        for (int i = n - 1; i >= 0; --i) {
            while (!stk.isEmpty() && nums[stk.peek()] <= nums[i]) {
                ans = Math.max(ans, i - stk.pop());
            }
            if (stk.isEmpty()) {
                break;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Width Ramp：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxWidthRamp(self, nums: List[int]) -> int:
        stk = []
        for i, v in enumerate(nums):
            if not stk or nums[stk[-1]] > v:
                stk.append(i)
        ans = 0
        for i in range(len(nums) - 1, -1, -1):
            while stk and nums[stk[-1]] <= nums[i]:
                ans = max(ans, i - stk.pop())
            if not stk:
                break
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

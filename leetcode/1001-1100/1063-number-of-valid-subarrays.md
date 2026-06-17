# 1063. Number of Valid Subarrays

---
编号: 1063
题目: Number of Valid Subarrays
难度: 困难
标签: [栈, 数组, 单调栈]
来源链接: https://leetcode.com/problems/number-of-valid-subarrays/
---

## 题目描述

给定一个整数数组 `nums` ，返回满足下面条件的 *非空、连续*** 子数组**的数目：

- **子数组 **是数组的 **连续** 部分。

- *子数组最左边的元素不大于子数组中的其他元素* 。

**示例 1：**

```text
输入：nums = [1,4,2,5,3]
输出：11
解释：有 11 个有效子数组，分别是：[1],[4],[2],[5],[3],[1,4],[2,5],[1,4,2],[2,5,3],[1,4,2,5],[1,4,2,5,3] 。
```

**示例 2：**

```text
输入：nums = [3,2,1]
输出：3
解释：有 3 个有效子数组，分别是：[3],[2],[1] 。
```

**示例 3：**

```text
输入：nums = [2,2,2]
输出：6
解释：有 6 个有效子数组，分别为是：[2],[2],[2],[2,2],[2,2],[2,2,2] 。
```

**提示：**

- `1 <= nums.length <= 5 * 10^4`

- `0 <= nums[i] <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 数组, 单调栈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目实际上是求解每个位置 $i$ 的右边第一个小于 $nums[i]$ 的位置 $j$，那么以 $i$ 为左端点的有效子数组的个数就是 $j - i$。

我们可以使用单调栈来求解右边第一个小于 $nums[i]$ 的位置 $j$，具体做法是从右往左遍历数组，维护一个从栈顶到栈底严格单调递减的栈。如果栈不为空，并且栈顶元素大于等于 $nums[i]$，那么就将栈顶元素出栈，直到栈为空或者栈顶元素小于 $nums[i]$，此时栈顶元素就是右边第一个小于 $nums[i]$ 的位置 $j$，如果栈为空，那么 $j = n$。

接下来，我们将 $i$ 入栈，继续遍历数组，直到遍历结束，最后我们就可以得到每个位置 $i$ 的右边第一个小于 $nums[i]$ 的位置 $j$，从而得到以 $i$ 为左端点的有效子数组的个数 $j-i$，将所有的 $j-i$ 累加即可得到答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组的长度。

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
// Number of Valid Subarrays：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func validSubarrays(nums []int) (ans int) {
	n := len(nums)
	right := make([]int, n)
	for i := range right {
		right[i] = n
	}
	stk := []int{}
	for i := n - 1; i >= 0; i-- {
		for len(stk) > 0 && nums[stk[len(stk)-1]] >= nums[i] {
			stk = stk[:len(stk)-1]
		}
		if len(stk) > 0 {
			right[i] = stk[len(stk)-1]
		}
		stk = append(stk, i)
	}
	for i, j := range right {
		ans += j - i
	}
	return
}
```

### Java

```java
// Number of Valid Subarrays：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int validSubarrays(int[] nums) {
        int n = nums.length;
        int[] right = new int[n];
        Arrays.fill(right, n);
        Deque<Integer> stk = new ArrayDeque<>();
        for (int i = n - 1; i >= 0; --i) {
            while (!stk.isEmpty() && nums[stk.peek()] >= nums[i]) {
                stk.pop();
            }
            if (!stk.isEmpty()) {
                right[i] = stk.peek();
            }
            stk.push(i);
        }
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            ans += right[i] - i;
        }
        return ans;
    }
}
```

### Python

```python
# Number of Valid Subarrays：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def validSubarrays(self, nums: List[int]) -> int:
        n = len(nums)
        right = [n] * n
        stk = []
        for i in range(n - 1, -1, -1):
            while stk and nums[stk[-1]] >= nums[i]:
                stk.pop()
            if stk:
                right[i] = stk[-1]
            stk.append(i)
        return sum(j - i for i, j in enumerate(right))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

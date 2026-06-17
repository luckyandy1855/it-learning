# 0503. Next Greater Element II

---
编号: 503
题目: Next Greater Element II
难度: 中等
标签: [栈, 数组, 单调栈]
来源链接: https://leetcode.com/problems/next-greater-element-ii/
---

## 题目描述

给定一个循环数组 `nums` （ `nums[nums.length - 1]` 的下一个元素是 `nums[0]` ），返回 *`nums` 中每个元素的 **下一个更大元素*** 。

数字 `x` 的 **下一个更大的元素** 是按数组遍历顺序，这个数字之后的第一个比它更大的数，这意味着你应该循环地搜索它的下一个更大的数。如果不存在，则输出 `-1` 。

**示例 1:**

```text
输入: nums = [1,2,1]
输出: [2,-1,2]
解释: 第一个 1 的下一个更大的数是 2；
数字 2 找不到下一个更大的数；
第二个 1 的下一个最大的数需要循环搜索，结果也是 2。
```

**示例 2:**

```text
输入: nums = [1,2,3,4,3]
输出: [2,3,4,-1,4]
```

**提示:**

- `1 <= nums.length <= 10^4`

- `-10^9 <= nums[i] <= 10^9`

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

题目需要我们找到每个元素的下一个更大元素，那么我们可以从后往前遍历数组，这样可以将问题为求上一个更大元素。另外，由于数组是循环的，我们可以将数组遍历两次。

具体地，我们从下标 $n \times 2 - 1$ 开始向前遍历数组，其中 $n$ 是数组的长度。然后，我们记 $j = i \bmod n$，其中 $\bmod$ 表示取模运算。如果栈不为空且栈顶元素小于等于 $nums[j]$，那么我们就不断地弹出栈顶元素，直到栈为空或者栈顶元素大于 $nums[j]$。此时，栈顶元素就是 $nums[j]$ 的上一个更大元素，我们将其赋给 $ans[j]$。最后，我们将 $nums[j]$ 入栈。继续遍历下一个元素。

遍历结束后，我们就可以得到数组 $ans$，它是数组 $nums$ 中每个元素的下一个更大元素。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $nums$ 的长度。

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
// Next Greater Element II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func nextGreaterElements(nums []int) []int {
	n := len(nums)
	ans := make([]int, n)
	for i := range ans {
		ans[i] = -1
	}
	stk := []int{}
	for i := n*2 - 1; i >= 0; i-- {
		j := i % n
		for len(stk) > 0 && stk[len(stk)-1] <= nums[j] {
			stk = stk[:len(stk)-1]
		}
		if len(stk) > 0 {
			ans[j] = stk[len(stk)-1]
		}
		stk = append(stk, nums[j])
	}
	return ans
}
```

### Java

```java
// Next Greater Element II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        Arrays.fill(ans, -1);
        Deque<Integer> stk = new ArrayDeque<>();
        for (int i = n * 2 - 1; i >= 0; --i) {
            int j = i % n;
            while (!stk.isEmpty() && stk.peek() <= nums[j]) {
                stk.pop();
            }
            if (!stk.isEmpty()) {
                ans[j] = stk.peek();
            }
            stk.push(nums[j]);
        }
        return ans;
    }
}
```

### Python

```python
# Next Greater Element II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [-1] * n
        stk = []
        for i in range(n * 2 - 1, -1, -1):
            i %= n
            while stk and stk[-1] <= nums[i]:
                stk.pop()
            if stk:
                ans[i] = stk[-1]
            stk.append(nums[i])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

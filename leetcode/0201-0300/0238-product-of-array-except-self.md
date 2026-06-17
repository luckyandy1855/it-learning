# 0238. Product of Array Except Self

---
编号: 238
题目: Product of Array Except Self
难度: 中等
标签: [数组, 前缀和]
来源链接: https://leetcode.com/problems/product-of-array-except-self/
---

## 题目描述

给你一个整数数组 `nums`，返回 数组 `answer` ，其中 `answer[i]` 等于 `nums` 中除了 `nums[i]` 之外其余各元素的乘积 。

题目数据 **保证** 数组 `nums`之中任意元素的全部前缀元素和后缀的乘积都在  **32 位** 整数范围内。

请 **不要使用除法，**且在 `O(n)` 时间复杂度内完成此题。

**示例 1:**

```text
输入: nums = [1,2,3,4]
输出: [24,12,8,6]
```

**示例 2:**

```text
输入: nums = [-1,1,0,-3,3]
输出: [0,0,9,0,0]
```

**提示：**

- `2 <= nums.length <= 10^5`

- `-30 <= nums[i] <= 30`

- 输入 **保证** 数组 `answer[i]` 在  **32 位** 整数范围内

**进阶：**你可以在 `O(1)` 的额外空间复杂度内完成这个题目吗？（ 出于对空间复杂度分析的目的，输出数组 **不被视为 **额外空间。）

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义两个变量 $\textit{left}$ 和 $\textit{right}$，分别表示当前元素左边所有元素的乘积和右边所有元素的乘积。初始时 $\textit{left}=1$, $\textit{right}=1$。定义一个长度为 $n$ 的答案数组 $\textit{ans}$。

我们先从左到右遍历数组，对于遍历到的第 $i$ 个元素，我们用 $\textit{left}$ 更新 $\textit{ans}[i]$，然后 $\textit{left}$ 乘以 $\textit{nums}[i]$。

然后，我们从右到左遍历数组，对于遍历到的第 $i$ 个元素，我们更新 $\textit{ans}[i]$ 为 $\textit{ans}[i] \times \textit{right}$，然后 $\textit{right}$ 乘以 $\textit{nums}[i]$。

遍历结束后，返回答案数组 $\textit{ans}$。

时间复杂度 $O(n)$，其中 $n$ 是数组 $\textit{nums}$ 的长度。忽略答案数组的空间消耗，空间复杂度 $O(1)$。

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
// Product of Array Except Self：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func productExceptSelf(nums []int) []int {
	n := len(nums)
	ans := make([]int, n)
	left, right := 1, 1
	for i, x := range nums {
		ans[i] = left
		left *= x
	}
	for i := n - 1; i >= 0; i-- {
		ans[i] *= right
		right *= nums[i]
	}
	return ans
}
```

### Java

```java
import java.util.*;
// Product of Array Except Self：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        for (int i = 0, left = 1; i < n; ++i) {
            ans[i] = left;
            left *= nums[i];
        }
        for (int i = n - 1, right = 1; i >= 0; --i) {
            ans[i] *= right;
            right *= nums[i];
        }
        return ans;
    }
}
```

### Python

```python
# Product of Array Except Self：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [0] * n
        left = right = 1
        for i, x in enumerate(nums):
            ans[i] = left
            left *= x
        for i in range(n - 1, -1, -1):
            ans[i] *= right
            right *= nums[i]
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

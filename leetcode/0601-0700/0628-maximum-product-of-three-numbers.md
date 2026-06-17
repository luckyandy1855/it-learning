# 0628. Maximum Product of Three Numbers

---
编号: 628
题目: Maximum Product of Three Numbers
难度: 简单
标签: [数组, 数学, 排序]
来源链接: https://leetcode.com/problems/maximum-product-of-three-numbers/
---

## 题目描述

给你一个整型数组 `nums` ，在数组中找出由三个数组成的最大乘积，并输出这个乘积。

**示例 1：**

```text
输入：nums = [1,2,3]
输出：6
```

**示例 2：**

```text
输入：nums = [1,2,3,4]
输出：24
```

**示例 3：**

```text
输入：nums = [-1,-2,-3]
输出：-6
```

**提示：**

- `3 <= nums.length <= 10^4`

- `-1000 <= nums[i] <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先对数组 $\textit{nums}$ 进行排序，接下来分两种情况讨论：

- 如果 $\textit{nums}$ 中全是非负数或者全是非正数，那么答案即为最后三个数的乘积，即 $\textit{nums}[n-1] \times \textit{nums}[n-2] \times \textit{nums}[n-3]$；
- 如果 $\textit{nums}$ 中既有正数也有负数，那么答案可能是两个最小负数和一个最大整数的乘积，即 $\textit{nums}[n-1] \times \textit{nums}[0] \times \textit{nums}[1]$；也可能是最后三个数的乘积，即 $\textit{nums}[n-1] \times \textit{nums}[n-2] \times \textit{nums}[n-3]$。

最后返回两种情况的最大值即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(\log n)$。其中 $n$ 为数组 $\textit{nums}$ 的长度。

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
// Maximum Product of Three Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maximumProduct(nums []int) int {
	sort.Ints(nums)
	n := len(nums)
	a := nums[n-1] * nums[n-2] * nums[n-3]
	b := nums[n-1] * nums[0] * nums[1]
	if a > b {
		return a
	}
	return b
}
```

### Java

```java
// Maximum Product of Three Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maximumProduct(int[] nums) {
        Arrays.sort(nums);
        int n = nums.length;
        int a = nums[n - 1] * nums[n - 2] * nums[n - 3];
        int b = nums[n - 1] * nums[0] * nums[1];
        return Math.max(a, b);
    }
}
```

### Python

```python
# Maximum Product of Three Numbers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maximumProduct(self, nums: List[int]) -> int:
        nums.sort()
        a = nums[-1] * nums[-2] * nums[-3]
        b = nums[-1] * nums[0] * nums[1]
        return max(a, b)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0462. Minimum Moves to Equal Array Elements II

---
编号: 462
题目: Minimum Moves to Equal Array Elements II
难度: 中等
标签: [数组, 数学, 排序]
来源链接: https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/
---

## 题目描述

给你一个长度为 `n` 的整数数组 `nums` ，返回使所有数组元素相等需要的最小操作数。

在一次操作中，你可以使数组中的一个元素加 `1` 或者减 `1` 。

测试用例经过设计以使答案在 **32 位** 整数范围内。

示例 1：

```text
输入：nums = [1,2,3]
输出：2
解释：
只需要两次操作（每次操作指南使一个元素加 1 或减 1）：
[1,2,3]  =>  [2,2,3]  =>  [2,2,2]
```

示例 2：

```text
输入：nums = [1,10,2,9]
输出：16
```

**提示：**

- `n == nums.length`

- `1 <= nums.length <= 10^5`

- `-10^9 <= nums[i] <= 10^9`

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

这个问题可以抽象为，在数轴上有 $n$ 个点，找到一个点使得所有点到该点的距离之和最小。答案为 $n$ 个点的中位数。

中位数有这样的性质：所有数与中位数的距离之和最小。

证明：

首先，给定一个从小到大的数列 $a_1, a_2, \cdots, a_n$，我们假设 $x$ 是从 $a_1$ 到 $a_n$ 与其距离之和最小的点，显然 $x$ 必须位于 $a_1$ 和 $a_n$ 之间。而由于 $a_1$ 与 $a_n$ 与 $x$ 的距离之和都相等，都等于 $a_n-a_1$，因此，接下来不考虑 $a_1$ 和 $a_n$，我们只考虑 $a_2, a_3, \cdots, a_{n-1}$，这样的话，我们就可以把问题转化为在 $a_2, a_3, \cdots, a_{n-1}$ 中找到一个点与其距离之和最小，依此类推，我们最后可以得出结论：在一个数列中，中位数与其余数的距离之和最小。

在这个问题中，我们可以先对数组进行排序，然后找到中位数，最后计算所有数与中位数的距离之和即可。

时间复杂度 $O(n\log n)$，空间复杂度 $O(\log n)$。

相似题目：

- [296. 最佳的碰头地点](https://github.com/doocs/leetcode/blob/main/solution/0200-0299/0296.Best%20Meeting%20Point/README.md)
- [2448. 使数组相等的最小开销](https://github.com/doocs/leetcode/blob/main/solution/2400-2499/2448.Minimum%20Cost%20to%20Make%20Array%20Equal/README.md)

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
// Minimum Moves to Equal Array Elements II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minMoves2(nums []int) int {
	sort.Ints(nums)
	k := nums[len(nums)>>1]
	ans := 0
	for _, v := range nums {
		ans += abs(v - k)
	}
	return ans
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Minimum Moves to Equal Array Elements II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minMoves2(int[] nums) {
        Arrays.sort(nums);
        int k = nums[nums.length >> 1];
        int ans = 0;
        for (int v : nums) {
            ans += Math.abs(v - k);
        }
        return ans;
    }
}
```

### Python

```python
# Minimum Moves to Equal Array Elements II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minMoves2(self, nums: List[int]) -> int:
        nums.sort()
        k = nums[len(nums) >> 1]
        return sum(abs(v - k) for v in nums)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

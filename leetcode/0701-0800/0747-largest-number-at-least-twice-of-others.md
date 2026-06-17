# 0747. Largest Number At Least Twice of Others

---
编号: 747
题目: Largest Number At Least Twice of Others
难度: 简单
标签: [数组, 排序]
来源链接: https://leetcode.com/problems/largest-number-at-least-twice-of-others/
---

## 题目描述

给你一个整数数组 `nums` ，其中总是存在 **唯一的** 一个最大整数 。

请你找出数组中的最大元素并检查它是否 **至少是数组中每个其他数字的两倍** 。如果是，则返回 **最大元素的下标** ，否则返回 `-1` 。

**示例 1：**

```text
输入：nums = [3,6,1,0]
输出：1
解释：6 是最大的整数，对于数组中的其他整数，6 至少是数组中其他元素的两倍。6 的下标是 1 ，所以返回 1 。
```

**示例 2：**

```text
输入：nums = [1,2,3,4]
输出：-1
解释：4 没有超过 3 的两倍大，所以返回 -1 。
```

**提示：**

- `2 <= nums.length <= 50`

- `0 <= nums[i] <= 100`

- `nums` 中的最大元素是唯一的

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以遍历数组 $nums$，找到数组中的最大值 $x$ 和第二大的值 $y$，如果 $x \ge 2y$，则返回 $x$ 的下标，否则返回 $-1$。

我们也可以先找到数组中的最大值 $x$，同时找到最大值 $x$ 的下标 $k$。然后再遍历一次数组，如果发现 $k$ 以外的元素 $y$ 满足 $x < 2y$，则返回 $-1$。否则遍历结束后返回 $k$。

时间复杂度 $O(n)$，其中 $n$ 是数组 $nums$ 的长度。空间复杂度 $O(1)$。

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
// Largest Number At Least Twice of Others：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func dominantIndex(nums []int) int {
	k := 0
	for i, x := range nums {
		if nums[k] < x {
			k = i
		}
	}
	for i, x := range nums {
		if k != i && nums[k] < x*2 {
			return -1
		}
	}
	return k
}
```

### Java

```java
// Largest Number At Least Twice of Others：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int dominantIndex(int[] nums) {
        int n = nums.length;
        int k = 0;
        for (int i = 0; i < n; ++i) {
            if (nums[k] < nums[i]) {
                k = i;
            }
        }
        for (int i = 0; i < n; ++i) {
            if (k != i && nums[k] < nums[i] * 2) {
                return -1;
            }
        }
        return k;
    }
}
```

### Python

```python
# Largest Number At Least Twice of Others：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def dominantIndex(self, nums: List[int]) -> int:
        x, y = nlargest(2, nums)
        return nums.index(x) if x >= 2 * y else -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

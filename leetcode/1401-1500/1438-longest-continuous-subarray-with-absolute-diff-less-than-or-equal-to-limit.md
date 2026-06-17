# 1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit

---
编号: 1438
题目: Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit
难度: 中等
标签: [队列, 数组, 有序集合, 滑动窗口, 单调队列, 堆（优先队列）]
来源链接: https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/
---

## 题目描述

给你一个整数数组 `nums` ，和一个表示限制的整数 `limit`，请你返回最长连续子数组的长度，该子数组中的任意两个元素之间的绝对差必须小于或者等于 `limit`*。*

**示例 1：**

```text
输入：nums = [8,2,4,7], limit = 4
输出：2
解释：所有子数组如下：
[8] 最大绝对差 |8-8| = 0  4.
[8,2,4] 最大绝对差 |8-2| = 6 > 4.
[8,2,4,7] 最大绝对差 |8-2| = 6 > 4.
[2] 最大绝对差 |2-2| = 0  4.
[4] 最大绝对差 |4-4| = 0 <= 4.
[4,7] 最大绝对差 |4-7| = 3 <= 4.
[7] 最大绝对差 |7-7| = 0 <= 4.
因此，满足题意的最长子数组的长度为 2 。
```

**示例 2：**

```text
输入：nums = [10,1,2,4,7,2], limit = 5
输出：4
解释：满足题意的最长子数组是 [2,4,7,2]，其最大绝对差 |2-7| = 5 <= 5 。
```

**示例 3：**

```text
输入：nums = [4,2,2,2,4,4,2,2], limit = 0
输出：3
```

**提示：**

- `1 <= nums.length <= 10^5`

- `1 <= nums[i] <= 10^9`

- `0 <= limit <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「队列, 数组, 有序集合, 滑动窗口, 单调队列, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以枚举每个位置作为子数组的右端点，找到其对应的最靠左的左端点，满足区间内中最大值与最小值的差值不超过 $limit$。过程中，我们用有序集合维护窗口内的最大值和最小值。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 `nums` 的长度。

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
// Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func longestSubarray(nums []int, limit int) (ans int) {
	merge := func(st *redblacktree.Tree[int, int], x, v int) {
		c, _ := st.Get(x)
		if c+v == 0 {
			st.Remove(x)
		} else {
			st.Put(x, c+v)
		}
	}
	st := redblacktree.New[int, int]()
	j := 0
	for i, x := range nums {
		merge(st, x, 1)
		for ; st.Right().Key-st.Left().Key > limit; j++ {
			merge(st, nums[j], -1)
		}
		ans = max(ans, i-j+1)
	}
	return
}
```

### Java

```java
// Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int longestSubarray(int[] nums, int limit) {
        TreeMap<Integer, Integer> tm = new TreeMap<>();
        int ans = 0;
        for (int i = 0, j = 0; i < nums.length; ++i) {
            tm.merge(nums[i], 1, Integer::sum);
            for (; tm.lastKey() - tm.firstKey() > limit; ++j) {
                if (tm.merge(nums[j], -1, Integer::sum) == 0) {
                    tm.remove(nums[j]);
                }
            }
            ans = Math.max(ans, i - j + 1);
        }
        return ans;
    }
}
```

### Python

```python
# Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def longestSubarray(self, nums: List[int], limit: int) -> int:
        sl = SortedList()
        ans = j = 0
        for i, x in enumerate(nums):
            sl.add(x)
            while sl[-1] - sl[0] > limit:
                sl.remove(nums[j])
                j += 1
            ans = max(ans, i - j + 1)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

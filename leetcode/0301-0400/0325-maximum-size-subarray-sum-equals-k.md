# 0325. Maximum Size Subarray Sum Equals k

---
编号: 325
题目: Maximum Size Subarray Sum Equals k
难度: 中等
标签: [数组, 哈希表, 前缀和]
来源链接: https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/
---

## 题目描述

给定一个数组 `*nums*` 和一个目标值 `*k*`，找到和等于* `k` *的最长连续子数组长度。如果不存在任意一个符合要求的子数组，则返回 `0`。

**示例 1:**

```text
输入: nums = [1,-1,5,-2,3], k = 3
输出: 4
解释: 子数组 [1, -1, 5, -2] 和等于 3，且长度最长。
```

**示例 2:**

```text
输入: nums = [-2,-1,2,1], k = 1
输出: 2
解释: 子数组 [-1, 2] 和等于 1，且长度最长。
```

**提示：**

	- `1 <= nums.length <= 2 * 10^5`

	- `-10^4 <= nums[i] <= 10^4`

	- `-10^9 <= k <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个哈希表 $\textit{d}$ 记录数组 $\textit{nums}$ 中每个前缀和第一次出现的下标，初始时 $\textit{d}[0] = -1$。另外定义一个变量 $\textit{s}$ 记录前缀和。

接下来，遍历数组 $\textit{nums}$，对于当前遍历到的数字 $\textit{nums}[i]$，我们更新前缀和 $\textit{s} = \textit{s} + \textit{nums}[i]$，如果 $\textit{s}-k$ 在哈希表 $\textit{d}$ 中存在，不妨记 $j = \textit{d}[\textit{s} - k]$，那么以 $\textit{nums}[i]$ 结尾的符合条件的子数组的长度为 $i - j$，我们使用一个变量 $\textit{ans}$ 来维护最长的符合条件的子数组的长度。然后，如果 $\textit{s}$ 在哈希表中不存在，我们记录 $\textit{s}$ 和对应的下标 $i$，即 $\textit{d}[\textit{s}] = i$，否则我们不更新 $\textit{d}[\textit{s}]$。需要注意的是，可能会有多个位置 $i$ 都满足 $\textit{s}$ 的值，因此我们只记录最小的 $i$，这样就能保证子数组的长度最长。

遍历结束之后，我们返回 $\textit{ans}$ 即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $\textit{nums}$ 的长度。

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
// Maximum Size Subarray Sum Equals k：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxSubArrayLen(nums []int, k int) (ans int) {
	d := map[int]int{0: -1}
	s := 0
	for i, x := range nums {
		s += x
		if j, ok := d[s-k]; ok && ans < i-j {
			ans = i - j
		}
		if _, ok := d[s]; !ok {
			d[s] = i
		}
	}
	return
}
```

### Java

```java
// Maximum Size Subarray Sum Equals k：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxSubArrayLen(int[] nums, int k) {
        Map<Long, Integer> d = new HashMap<>();
        d.put(0L, -1);
        int ans = 0;
        long s = 0;
        for (int i = 0; i < nums.length; ++i) {
            s += nums[i];
            ans = Math.max(ans, i - d.getOrDefault(s - k, i));
            d.putIfAbsent(s, i);
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Size Subarray Sum Equals k：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxSubArrayLen(self, nums: List[int], k: int) -> int:
        d = {0: -1}
        ans = s = 0
        for i, x in enumerate(nums):
            s += x
            if s - k in d:
                ans = max(ans, i - d[s - k])
            if s not in d:
                d[s] = i
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

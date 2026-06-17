# 0209. Minimum Size Subarray Sum

---
编号: 209
题目: Minimum Size Subarray Sum
难度: 中等
标签: [数组, 二分查找, 前缀和, 滑动窗口]
来源链接: https://leetcode.com/problems/minimum-size-subarray-sum/
---

## 题目描述

给定一个含有 `n`** **个正整数的数组和一个正整数 `target`** 。**

找出该数组中满足其总和大于等于** **`target`** **的长度最小的 **子数组** `[numsl, numsl+1, ..., numsr-1, numsr]` ，并返回其长度**。**如果不存在符合条件的子数组，返回 `0` 。

**示例 1：**

```text
输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。
```

**示例 2：**

```text
输入：target = 4, nums = [1,4,4]
输出：1
```

**示例 3：**

```text
输入：target = 11, nums = [1,1,1,1,1,1,1,1]
输出：0
```

**提示：**

- `1 <= target <= 10^9`

- `1 <= nums.length <= 10^5`

- `1 <= nums[i] <= 10^4`

**进阶：**

- 如果你已经实现* *`O(n)` 时间复杂度的解法, 请尝试设计一个 `O(n log(n))` 时间复杂度的解法。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 前缀和, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先预处理出数组 $nums$ 的前缀和数组 $s$，其中 $s[i]$ 表示数组 $nums$ 前 $i$ 项元素之和。由于数组 $nums$ 中的元素都是正整数，因此数组 $s$ 也是单调递增的。另外，我们初始化答案 $ans = n + 1$，其中 $n$ 为数组 $nums$ 的长度。

接下来，我们遍历前缀和数组 $s$，对于其中的每个元素 $s[i]$，我们可以通过二分查找的方法找到满足 $s[j] \geq s[i] + target$ 的最小下标 $j$，如果 $j \leq n$，则说明存在满足条件的子数组，我们可以更新答案，即 $ans = min(ans, j - i)$。

最后，如果 $ans \leq n$，则说明存在满足条件的子数组，返回 $ans$，否则返回 $0$。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $nums$ 的长度。

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
// Minimum Size Subarray Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minSubArrayLen(target int, nums []int) int {
	n := len(nums)
	s := make([]int, n+1)
	for i, x := range nums {
		s[i+1] = s[i] + x
	}
	ans := n + 1
	for i, x := range s {
		j := sort.SearchInts(s, x+target)
		if j <= n {
			ans = min(ans, j-i)
		}
	}
	if ans == n+1 {
		return 0
	}
	return ans
}
```

### Java

```java
import java.util.*;
// Minimum Size Subarray Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int n = nums.length;
        long[] s = new long[n + 1];
        for (int i = 0; i < n; ++i) {
            s[i + 1] = s[i] + nums[i];
        }
        int ans = n + 1;
        for (int i = 0; i <= n; ++i) {
            int j = search(s, s[i] + target);
            if (j <= n) {
                ans = Math.min(ans, j - i);
            }
        }
        return ans <= n ? ans : 0;
    }

    private int search(long[] nums, long x) {
        int l = 0, r = nums.length;
        while (l < r) {
            int mid = (l + r) >> 1;
            if (nums[mid] >= x) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return l;
    }
}
```

### Python

```python
# Minimum Size Subarray Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        n = len(nums)
        s = list(accumulate(nums, initial=0))
        ans = n + 1
        for i, x in enumerate(s):
            j = bisect_left(s, x + target)
            if j <= n:
                ans = min(ans, j - i)
        return ans if ans <= n else 0
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

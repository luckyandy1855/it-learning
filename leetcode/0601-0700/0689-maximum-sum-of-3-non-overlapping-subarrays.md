# 0689. Maximum Sum of 3 Non-Overlapping Subarrays

---
编号: 689
题目: Maximum Sum of 3 Non-Overlapping Subarrays
难度: 困难
标签: [数组, 动态规划, 前缀和, 滑动窗口]
来源链接: https://leetcode.com/problems/maximum-sum-of-3-non-overlapping-subarrays/
---

## 题目描述

给你一个整数数组 `nums` 和一个整数 `k` ，找出三个长度为 `k` 、互不重叠、且全部数字和最大的子数组，并返回这三个子数组。

以下标的数组形式返回结果，数组中的每一项分别指示每个子数组的起始位置（下标从 **0** 开始）。如果有多个结果，返回字典序最小的一个。

示例 1：

```text
输入：nums = [1,2,1,2,6,7,5,1], k = 2
输出：[0,3,5]
解释：子数组 [1, 2], [2, 6], [7, 5] 对应的起始下标为 [0, 3, 5]。
也可以取 [2, 1], 但是结果 [1, 3, 5] 在字典序上更大。
```

示例 2：

```text
输入：nums = [1,2,1,2,1,2,1,2,1], k = 2
输出：[0,2,4]
```

**提示：**

- `1 <= nums.length <= 2 * 10^4`

- `1 <= nums[i] < 2^16`

- `1 <= k <= floor(nums.length / 3)`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划, 前缀和, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

滑动窗口，枚举第三个子数组的位置，同时维护前两个无重叠子数组的最大和及其位置。

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
// Maximum Sum of 3 Non-Overlapping Subarrays：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxSumOfThreeSubarrays(nums []int, k int) []int {
	ans := make([]int, 3)
	s, s1, s2, s3 := 0, 0, 0, 0
	mx1, mx12 := 0, 0
	idx1, idx121, idx122 := 0, 0, 0
	for i := k * 2; i < len(nums); i++ {
		s1 += nums[i-k*2]
		s2 += nums[i-k]
		s3 += nums[i]
		if i >= k*3-1 {
			if s1 > mx1 {
				mx1 = s1
				idx1 = i - k*3 + 1
			}
			if mx1+s2 > mx12 {
				mx12 = mx1 + s2
				idx121 = idx1
				idx122 = i - k*2 + 1
			}
			if mx12+s3 > s {
				s = mx12 + s3
				ans = []int{idx121, idx122, i - k + 1}
			}
			s1 -= nums[i-k*3+1]
			s2 -= nums[i-k*2+1]
			s3 -= nums[i-k+1]
		}
	}
	return ans
}
```

### Java

```java
// Maximum Sum of 3 Non-Overlapping Subarrays：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] maxSumOfThreeSubarrays(int[] nums, int k) {
        int[] ans = new int[3];
        int s = 0, s1 = 0, s2 = 0, s3 = 0;
        int mx1 = 0, mx12 = 0;
        int idx1 = 0, idx121 = 0, idx122 = 0;
        for (int i = k * 2; i < nums.length; ++i) {
            s1 += nums[i - k * 2];
            s2 += nums[i - k];
            s3 += nums[i];
            if (i >= k * 3 - 1) {
                if (s1 > mx1) {
                    mx1 = s1;
                    idx1 = i - k * 3 + 1;
                }
                if (mx1 + s2 > mx12) {
                    mx12 = mx1 + s2;
                    idx121 = idx1;
                    idx122 = i - k * 2 + 1;
                }
                if (mx12 + s3 > s) {
                    s = mx12 + s3;
                    ans = new int[] {idx121, idx122, i - k + 1};
                }
                s1 -= nums[i - k * 3 + 1];
                s2 -= nums[i - k * 2 + 1];
                s3 -= nums[i - k + 1];
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Sum of 3 Non-Overlapping Subarrays：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxSumOfThreeSubarrays(self, nums: List[int], k: int) -> List[int]:
        s = s1 = s2 = s3 = 0
        mx1 = mx12 = 0
        idx1, idx12 = 0, ()
        ans = []
        for i in range(k * 2, len(nums)):
            s1 += nums[i - k * 2]
            s2 += nums[i - k]
            s3 += nums[i]
            if i >= k * 3 - 1:
                if s1 > mx1:
                    mx1 = s1
                    idx1 = i - k * 3 + 1
                if mx1 + s2 > mx12:
                    mx12 = mx1 + s2
                    idx12 = (idx1, i - k * 2 + 1)
                if mx12 + s3 > s:
                    s = mx12 + s3
                    ans = [*idx12, i - k + 1]
                s1 -= nums[i - k * 3 + 1]
                s2 -= nums[i - k * 2 + 1]
                s3 -= nums[i - k + 1]
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

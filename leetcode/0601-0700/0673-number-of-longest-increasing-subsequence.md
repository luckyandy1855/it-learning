# 0673. Number of Longest Increasing Subsequence

---
编号: 673
题目: Number of Longest Increasing Subsequence
难度: 中等
标签: [树状数组, 线段树, 数组, 动态规划]
来源链接: https://leetcode.com/problems/number-of-longest-increasing-subsequence/
---

## 题目描述

给定一个未排序的整数数组 `nums` ， *返回最长递增子序列的个数* 。

**注意** 这个数列必须是 **严格** 递增的。

**示例 1:**

```text
输入: [1,3,5,4,7]
输出: 2
解释: 有两个最长递增子序列，分别是 [1, 3, 4, 7] 和[1, 3, 5, 7]。
```

**示例 2:**

```text
输入: [2,2,2,2,2]
输出: 5
解释: 最长递增子序列的长度是1，并且存在5个子序列的长度为1，因此输出5。
```

**提示:**

- `1 <= nums.length <= 2000`

- `-10^6 <= nums[i] <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树状数组, 线段树, 数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i]$ 表示以 $nums[i]$ 结尾的最长递增子序列的长度，定义 $cnt[i]$ 表示以 $nums[i]$ 结尾的最长递增子序列的个数。初始时 $f[i]=1$, $cnt[i]=1$。另外，定义 $mx$ 表示最长递增子序列的长度，定义 $ans$ 表示最长递增子序列的个数。

对于每一个 $nums[i]$，我们枚举 $nums[0:i-1]$ 中的所有元素 $nums[j]$，如果 $nums[j] \lt nums[i]$，则 $nums[i]$ 可以接在 $nums[j]$ 后面，形成一个更长的递增子序列。如果 $f[i] \lt f[j] + 1$，说明以 $nums[i]$ 结尾的最长递增子序列的长度增加了，那么我们需要更新 $f[i]=f[j]+1$，并且 $cnt[i]=cnt[j]$。如果 $f[i]=f[j]+1$，说明我们找到了一条长度与之前相同的最长递增子序列，那么我们需要将 $cnt[i]$ 增加 $cnt[j]$。然后，如果 $mx \lt f[i]$，说明最长递增子序列的长度增加了，那么我们需要更新 $mx=f[i]$，并且 $ans=cnt[i]$。如果 $mx=f[i]$，说明我们找到了一条长度与之前相同的最长递增子序列，那么我们需要将 $ans$ 增加 $cnt[i]$。

最后，我们返回 $ans$ 即可。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $nums$ 的长度。

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
// Number of Longest Increasing Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findNumberOfLIS(nums []int) (ans int) {
	n, mx := len(nums), 0
	f := make([]int, n)
	cnt := make([]int, n)
	for i, x := range nums {
		for j, y := range nums[:i] {
			if y < x {
				if f[i] < f[j]+1 {
					f[i] = f[j] + 1
					cnt[i] = cnt[j]
				} else if f[i] == f[j]+1 {
					cnt[i] += cnt[j]
				}
			}
		}
		if mx < f[i] {
			mx = f[i]
			ans = cnt[i]
		} else if mx == f[i] {
			ans += cnt[i]
		}
	}
	return
}
```

### Java

```java
// Number of Longest Increasing Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findNumberOfLIS(int[] nums) {
        int n = nums.length;
        int[] f = new int[n];
        int[] cnt = new int[n];
        int mx = 0, ans = 0;
        for (int i = 0; i < n; ++i) {
            f[i] = 1;
            cnt[i] = 1;
            for (int j = 0; j < i; ++j) {
                if (nums[j] < nums[i]) {
                    if (f[i] < f[j] + 1) {
                        f[i] = f[j] + 1;
                        cnt[i] = cnt[j];
                    } else if (f[i] == f[j] + 1) {
                        cnt[i] += cnt[j];
                    }
                }
            }
            if (mx < f[i]) {
                mx = f[i];
                ans = cnt[i];
            } else if (mx == f[i]) {
                ans += cnt[i];
            }
        }
        return ans;
    }
}
```

### Python

```python
# Number of Longest Increasing Subsequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findNumberOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        f = [1] * n
        cnt = [1] * n
        mx = 0
        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:
                    if f[i] < f[j] + 1:
                        f[i] = f[j] + 1
                        cnt[i] = cnt[j]
                    elif f[i] == f[j] + 1:
                        cnt[i] += cnt[j]
            if mx < f[i]:
                mx = f[i]
                ans = cnt[i]
            elif mx == f[i]:
                ans += cnt[i]
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

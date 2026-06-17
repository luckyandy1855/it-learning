# 0698. Partition to K Equal Sum Subsets

---
编号: 698
题目: Partition to K Equal Sum Subsets
难度: 中等
标签: [位运算, 记忆化, 数组, 动态规划, 回溯, 位掩码]
来源链接: https://leetcode.com/problems/partition-to-k-equal-sum-subsets/
---

## 题目描述

给定一个整数数组  `nums` 和一个正整数 `k`，找出是否有可能把这个数组分成 `k` 个非空子集，其总和都相等。

**示例 1：**

```text
输入： nums = [4, 3, 2, 3, 5, 2, 1], k = 4
输出： True
说明： 有可能将其分成 4 个子集（5），（1,4），（2,3），（2,3）等于总和。
```

**示例 2:**

```text
输入: nums = [1,2,3,4], k = 3
输出: false
```

**提示：**

- `1 <= k <= len(nums) <= 16`

- `0 < nums[i] < 10000`

- 每个元素的频率在 `[1,4]` 范围内

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 记忆化, 数组, 动态规划, 回溯, 位掩码」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题意，我们需要将数组 $\textit{nums}$ 划分为 $k$ 个子集，且每个子集的和相等。因此，先累加 $\textit{nums}$ 中所有元素的和，如果不能被 $k$ 整除，说明无法划分为 $k$ 个子集，提前返回 $\textit{false}$。

如果能被 $k$ 整除，不妨将每个子集期望的和记为 $s$，然后创建一个长度为 $k$ 的数组 $\textit{cur}$，表示当前每个子集的和。

对数组 $\textit{nums}$ 进行降序排序（减少搜索次数），然后从第一个元素开始，依次尝试将其加入到 $\textit{cur}$ 的每个子集中。这里如果将 $\textit{nums}[i]$ 加入某个子集 $\textit{cur}[j]$ 后，子集的和超过 $s$，说明无法放入，可以直接跳过；另外，如果 $\textit{cur}[j]$ 与 $\textit{cur}[j - 1]$ 相等，意味着我们在 $\textit{cur}[j - 1]$ 的时候已经完成了搜索，也可以跳过当前的搜索。

如果能将所有元素都加入到 $\textit{cur}$ 中，说明可以划分为 $k$ 个子集，返回 $\textit{true}$。

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
// Partition to K Equal Sum Subsets：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canPartitionKSubsets(nums []int, k int) bool {
	s := 0
	for _, v := range nums {
		s += v
	}
	if s%k != 0 {
		return false
	}
	s /= k
	cur := make([]int, k)
	n := len(nums)

	var dfs func(int) bool
	dfs = func(i int) bool {
		if i == n {
			return true
		}
		for j := 0; j < k; j++ {
			if j > 0 && cur[j] == cur[j-1] {
				continue
			}
			cur[j] += nums[i]
			if cur[j] <= s && dfs(i+1) {
				return true
			}
			cur[j] -= nums[i]
		}
		return false
	}

	sort.Sort(sort.Reverse(sort.IntSlice(nums)))
	return dfs(0)
}
```

### Java

```java
// Partition to K Equal Sum Subsets：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] nums;
    private int[] cur;
    private int s;

    public boolean canPartitionKSubsets(int[] nums, int k) {
        for (int v : nums) {
            s += v;
        }
        if (s % k != 0) {
            return false;
        }
        s /= k;
        cur = new int[k];
        Arrays.sort(nums);
        this.nums = nums;
        return dfs(nums.length - 1);
    }

    private boolean dfs(int i) {
        if (i < 0) {
            return true;
        }
        for (int j = 0; j < cur.length; ++j) {
            if (j > 0 && cur[j] == cur[j - 1]) {
                continue;
            }
            cur[j] += nums[i];
            if (cur[j] <= s && dfs(i - 1)) {
                return true;
            }
            cur[j] -= nums[i];
        }
        return false;
    }
}
```

### Python

```python
# Partition to K Equal Sum Subsets：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canPartitionKSubsets(self, nums: List[int], k: int) -> bool:
        def dfs(i):
            if i == len(nums):
                return True
            for j in range(k):
                if j and cur[j] == cur[j - 1]:
                    continue
                cur[j] += nums[i]
                if cur[j] <= s and dfs(i + 1):
                    return True
                cur[j] -= nums[i]
            return False

        s, mod = divmod(sum(nums), k)
        if mod:
            return False
        cur = [0] * k
        nums.sort(reverse=True)
        return dfs(0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1027. Longest Arithmetic Subsequence

---
编号: 1027
题目: Longest Arithmetic Subsequence
难度: 中等
标签: [数组, 哈希表, 二分查找, 动态规划]
来源链接: https://leetcode.com/problems/longest-arithmetic-subsequence/
---

## 题目描述

给你一个整数数组 `nums`，返回 `nums` 中最长等差子序列的**长度**。

回想一下，`nums` 的子序列是一个列表 `nums[i1], nums[i2], ..., nums[ik]` ，且 `0 1 2 k <= nums.length - 1`。并且如果 `seq[i+1] - seq[i]`( `0 <= i < seq.length - 1`) 的值都相同，那么序列 `seq` 是等差的。

**示例 1：**

```text
输入：nums = [3,6,9,12]
输出：4
解释：
整个数组是公差为 3 的等差数列。
```

**示例 2：**

```text
输入：nums = [9,4,7,2,10]
输出：3
解释：
最长的等差子序列是 [4,7,10]。
```

**示例 3：**

```text
输入：nums = [20,1,15,3,10,5,8]
输出：4
解释：
最长的等差子序列是 [20,15,10,5]。
```

**提示：**

- `2 <= nums.length <= 1000`

- `0 <= nums[i] <= 500`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 二分查找, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示以 $nums[i]$ 结尾且公差为 $j$ 的等差数列的最大长度。初始时 $f[i][j]=1$，即每个元素自身都是一个长度为 $1$ 的等差数列。

> 由于公差可能为负数，且最大差值为 $500$，因此，我们可以将统一将公差加上 $500$，这样公差的范围就变成了 $[0, 1000]$。

考虑 $f[i]$，我们可以枚举 $nums[i]$ 的前一个元素 $nums[k]$，那么公差 $j=nums[i]-nums[k]+500$，此时有 $f[i][j]=\max(f[i][j], f[k][j]+1)$，然后我们更新答案 $ans=\max(ans, f[i][j])$。

最后返回答案即可。

> 如果初始时 $f[i][j]=0$，那么我们需要在最后返回答案时加上 $1$。

时间复杂度 $O(n \times (d + n))$，空间复杂度 $O(n \times d)$。其中 $n$ 和 $d$ 分别是数组 $nums$ 的长度以及数组 $nums$ 中元素的最大值与最小值的差值。

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
// Longest Arithmetic Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func longestArithSeqLength(nums []int) int {
	n := len(nums)
	f := make([][]int, n)
	for i := range f {
		f[i] = make([]int, 1001)
	}
	ans := 0
	for i := 1; i < n; i++ {
		for k := 0; k < i; k++ {
			j := nums[i] - nums[k] + 500
			f[i][j] = max(f[i][j], f[k][j]+1)
			ans = max(ans, f[i][j])
		}
	}
	return ans + 1
}
```

### Java

```java
// Longest Arithmetic Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int longestArithSeqLength(int[] nums) {
        int n = nums.length;
        int ans = 0;
        int[][] f = new int[n][1001];
        for (int i = 1; i < n; ++i) {
            for (int k = 0; k < i; ++k) {
                int j = nums[i] - nums[k] + 500;
                f[i][j] = Math.max(f[i][j], f[k][j] + 1);
                ans = Math.max(ans, f[i][j]);
            }
        }
        return ans + 1;
    }
}
```

### Python

```python
# Longest Arithmetic Subsequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def longestArithSeqLength(self, nums: List[int]) -> int:
        n = len(nums)
        f = [[1] * 1001 for _ in range(n)]
        ans = 0
        for i in range(1, n):
            for k in range(i):
                j = nums[i] - nums[k] + 500
                f[i][j] = max(f[i][j], f[k][j] + 1)
                ans = max(ans, f[i][j])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

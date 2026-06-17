# 0891. Sum of Subsequence Widths

---
编号: 891
题目: Sum of Subsequence Widths
难度: 困难
标签: [数组, 数学, 排序]
来源链接: https://leetcode.com/problems/sum-of-subsequence-widths/
---

## 题目描述

一个序列的 **宽度** 定义为该序列中最大元素和最小元素的差值。

给你一个整数数组 `nums` ，返回 `nums` 的所有非空 **子序列** 的 **宽度之和** 。由于答案可能非常大，请返回对 `10^9 + 7` **取余** 后的结果。

**子序列** 定义为从一个数组里删除一些（或者不删除）元素，但不改变剩下元素的顺序得到的数组。例如，`[3,6,2,7]` 就是数组 `[0,3,1,6,2,2,7]` 的一个子序列。

**示例 1：**

```text
输入：nums = [2,1,3]
输出：6
解释：子序列为 [1], [2], [3], [2,1], [2,3], [1,3], [2,1,3] 。
相应的宽度是 0, 0, 0, 1, 1, 2, 2 。
宽度之和是 6 。
```

**示例 2：**

```text
输入：nums = [2]
输出：0
```

**提示：**

- `1 <= nums.length <= 10^5`

- `1 <= nums[i] <= 10^5`

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

题目求解的是数组 `nums` 中所有子序列中最大值与最小值差值之和，注意到“子序列”，并且涉及到“最大值”与“最小值”，我们考虑先对数组 `nums` 进行排序。

然后我们枚举数组 `nums` 中的每个元素 $nums[i]$，该元素左侧的元素个数为 $i$，右侧的元素个数为 $n-i-1$。

如果我们将元素 $nums[i]$ 作为子序列的最大值，总共有多少个满足条件的子序列呢？显然，子序列的其他元素应该从左侧的 $i$ 个元素中选取，每个元素有两种选择，即选或不选，因此总共有 $2^i$ 个子序列。同理，如果我们将元素 $nums[i]$ 作为子序列的最小值，那么总共有 $2^{n-i-1}$ 个满足条件的子序列。因此 $nums[i]$ 对答案的贡献为：


\begin{aligned}
nums[i] \times (2^i - 2^{n-i-1})
\end{aligned}


我们将数组 `nums` 中所有元素的贡献累加，即为答案：


\begin{aligned}
\sum_{i=0}^{n-1} nums[i] \times (2^i - 2^{n-i-1})
\end{aligned}


我们将上式展开，可以得到：


\begin{aligned}
nums[0] \times (2^0 - 2^{n-1}) + nums[1] \times (2^1 - 2^{n-2}) + ... + nums[n-1] \times (2^{n-1} - 2^0)
\end{aligned}


再将式子中相同的幂次项合并，可以得到：


\begin{aligned}
(nums[0] - nums[n-1]) \times 2^0 + (nums[1] - nums[n-2]) \times 2^1 + ... + (nums[n-1] - nums[0]) \times 2^{n-1}
\end{aligned}


即：


\begin{aligned}
\sum_{i=0}^{n-1} (nums[i] - nums[n-i-1]) \times 2^i
\end{aligned}


因此我们只需要对数组 `nums` 进行排序，然后计算上述的贡献即可。注意答案的取模操作。

时间复杂度 $O(n\times \log n)$，空间复杂度 $O(\log n)$。其中 $n$ 为数组 `nums` 的长度。

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
// Sum of Subsequence Widths：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func sumSubseqWidths(nums []int) (ans int) {
	const mod int = 1e9 + 7
	sort.Ints(nums)
	p, n := 1, len(nums)
	for i, v := range nums {
		ans = (ans + (v-nums[n-i-1])*p + mod) % mod
		p = (p << 1) % mod
	}
	return
}
```

### Java

```java
// Sum of Subsequence Widths：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private static final int MOD = (int) 1e9 + 7;

    public int sumSubseqWidths(int[] nums) {
        Arrays.sort(nums);
        long ans = 0, p = 1;
        int n = nums.length;
        for (int i = 0; i < n; ++i) {
            ans = (ans + (nums[i] - nums[n - i - 1]) * p + MOD) % MOD;
            p = (p << 1) % MOD;
        }
        return (int) ans;
    }
}
```

### Python

```python
# Sum of Subsequence Widths：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def sumSubseqWidths(self, nums: List[int]) -> int:
        mod = 10**9 + 7
        nums.sort()
        ans, p = 0, 1
        for i, v in enumerate(nums):
            ans = (ans + (v - nums[-i - 1]) * p) % mod
            p = (p << 1) % mod
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

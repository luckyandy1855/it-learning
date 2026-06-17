# 0813. Largest Sum of Averages

---
编号: 813
题目: Largest Sum of Averages
难度: 中等
标签: [数组, 动态规划, 前缀和]
来源链接: https://leetcode.com/problems/largest-sum-of-averages/
---

## 题目描述

给定数组 `nums` 和一个整数 `k` 。我们将给定的数组 `nums` 分成 **最多** `k` 个非空子数组，且数组内部是连续的 。 **分数** 由每个子数组内的平均值的总和构成。

注意我们必须使用 `nums` 数组中的每一个数进行分组，并且分数不一定需要是整数。

返回我们所能得到的最大 **分数** 是多少。答案误差在 `10^-6` 内被视为是正确的。

**示例 1:**

```text
输入: nums = [9,1,2,3,9], k = 3
输出: 20.00000
解释:
nums 的最优分组是[9], [1, 2, 3], [9]. 得到的分数是 9 + (1 + 2 + 3) / 3 + 9 = 20.
我们也可以把 nums 分成[9, 1], [2], [3, 9].
这样的分组得到的分数为 5 + 2 + 6 = 13, 但不是最大值.
```

**示例 2:**

```text
输入: nums = [1,2,3,4,5,6,7], k = 4
输出: 20.50000
```

**提示:**

- `1 <= nums.length <= 100`

- `1 <= nums[i] <= 10^4`

- `1 <= k <= nums.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先预处理得到前缀和数组 $s$，方便快速得到子数组的和。

接下来，我们设计一个函数 $\textit{dfs}(i, k)$，表示从数组下标 $i$ 开始，最多分成 $k$ 组的最大平均值和。答案为 $\textit{dfs}(0, k)$。

函数 $\textit{dfs}(i, k)$ 的执行逻辑如下：

当 $i = n$ 时，表示已经遍历到数组末尾，此时返回 $0$。

当 $k = 1$ 时，表示只剩下一组，此时返回从下标 $i$ 开始到数组末尾的平均值。

否则，我们在 $[i + 1, n)$ 的区间内枚举下一个分组的开始位置 $j$，计算从 $i$ 到 $j - 1$ 的平均值 $\frac{s[j] - s[i]}{j - i}$，加上 $\textit{dfs}(j, k - 1)$ 的结果，取所有结果的最大值。

时间复杂度 $O(n^2 \times k)$，空间复杂度 $O(n \times k)$。其中 $n$ 表示数组 $\textit{nums}$ 的长度。

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
// Largest Sum of Averages：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largestSumOfAverages(nums []int, k int) float64 {
	n := len(nums)
	s := make([]int, n+1)
	for i, x := range nums {
		s[i+1] = s[i] + x
	}
	f := make([][]float64, n)
	for i := range f {
		f[i] = make([]float64, k+1)
	}
	var dfs func(int, int) float64
	dfs = func(i, k int) float64 {
		if i == n {
			return 0
		}
		if f[i][k] > 0 {
			return f[i][k]
		}
		if k == 1 {
			return float64(s[n]-s[i]) / float64(n-i)
		}
		ans := 0.0
		for j := i + 1; j < n; j++ {
			ans = math.Max(ans, float64(s[j]-s[i])/float64(j-i)+dfs(j, k-1))
		}
		f[i][k] = ans
		return ans
	}
	return dfs(0, k)
}
```

### Java

```java
// Largest Sum of Averages：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Double[][] f;
    private int[] s;
    private int n;

    public double largestSumOfAverages(int[] nums, int k) {
        n = nums.length;
        s = new int[n + 1];
        f = new Double[n][k + 1];
        for (int i = 0; i < n; ++i) {
            s[i + 1] = s[i] + nums[i];
        }
        return dfs(0, k);
    }

    private double dfs(int i, int k) {
        if (i == n) {
            return 0;
        }
        if (k == 1) {
            return (s[n] - s[i]) * 1.0 / (n - i);
        }
        if (f[i][k] != null) {
            return f[i][k];
        }
        double ans = 0;
        for (int j = i + 1; j < n; ++j) {
            ans = Math.max(ans, (s[j] - s[i]) * 1.0 /(j - i) + dfs(j, k - 1));
        }
        return f[i][k] = ans;
    }
}
```

### Python

```python
# Largest Sum of Averages：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def largestSumOfAverages(self, nums: List[int], k: int) -> float:
        @cache
        def dfs(i: int, k: int) -> float:
            if i == n:
                return 0
            if k == 1:
                return (s[n] - s[i]) / (n - i)
            ans = 0
            for j in range(i + 1, n):
                ans = max(ans, (s[j] - s[i]) / (j - i) + dfs(j, k - 1))
            return ans

        n = len(nums)
        s = list(accumulate(nums, initial=0))
        return dfs(0, k)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

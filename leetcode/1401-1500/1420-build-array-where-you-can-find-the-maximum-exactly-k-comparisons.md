# 1420. Build Array Where You Can Find The Maximum Exactly K Comparisons

---
编号: 1420
题目: Build Array Where You Can Find The Maximum Exactly K Comparisons
难度: 困难
标签: [动态规划, 前缀和]
来源链接: https://leetcode.com/problems/build-array-where-you-can-find-the-maximum-exactly-k-comparisons/
---

## 题目描述

给定三个整数 `n`、`m` 和 `k` 。考虑使用下图描述的算法找出正整数数组中最大的元素。

请你构建一个具有以下属性的数组 `arr` ：

- `arr` 中包含确切的 `n` 个整数。

- `1 <= arr[i] <= m` 其中 `(0 <= i < n)` 。

- 将上面提到的算法应用于 `arr` 之后，`search_cost` 的值等于 `k` 。

返回在满足上述条件的情况下构建数组 `arr` 的 *方法数量* ，由于答案可能会很大，所以 **必须** 对 `10^9 + 7` 取余。

**示例 1：**

```text
输入：n = 2, m = 3, k = 1
输出：6
解释：可能的数组分别为 [1, 1], [2, 1], [2, 2], [3, 1], [3, 2] [3, 3]
```

**示例 2：**

```text
输入：n = 5, m = 2, k = 3
输出：0
解释：没有数组可以满足上述条件
```

**示例 3：**

```text
输入：n = 9, m = 1, k = 1
输出：1
解释：唯一可能的数组是 [1, 1, 1, 1, 1, 1, 1, 1, 1]
```

**提示：**

- `1 <= n <= 50`

- `1 <= m <= 100`

- `0 <= k <= n`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「动态规划, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

假设 $dp[i][c][j]$ 表示长度为 $i$，搜索代价为 $c$，且最大值为 $j$ 的方案数。考虑第 $i$ 个数：

若第 $i$ 个数没有改变搜索代价，说明它不严格大于前 $i-1$ 个数，也就是说，$dp[i][c][j]$ 是从 $dp[i-1][c][j]$ 转移而来，即数组的前 $i-1$ 个数的最大值已经是 $j$，并且第 $i$ 个数没有改变最大值，因此第 $i$ 个数的可选范围是 $[1,..j]$，共有 $j$ 种可选方案。即


dp[i][c][j]=dp[i-1][c][j] \times j


若第 $i$ 个数改变了搜索代价，说明数组前 $i-1$ 个数的最大值小于 $j$，并且第 $i$ 个数恰好为 $j$。此时 $dp[i][c][j]$ 是从所有 $dp[i-1][c-1][j']$ 转移而来，其中 $j'<j$。即


dp[i][c][j] = \sum_{j'=1}^{j-1} dp[i-1][c-1][j']


综上，可得


dp[i][c][j] = dp[i-1][c][j] \times j + \sum_{j'=1}^{j-1} dp[i-1][c-1][j']


答案为


\sum_{j=1}^{m}dp[n][k][j]


时间复杂度 $O(nkm^2)$。

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
// Build Array Where You Can Find The Maximum Exactly K Comparisons：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numOfArrays(n int, m int, k int) int {
	if k == 0 {
		return 0
	}
	mod := int(1e9) + 7
	dp := make([][][]int, n+1)
	for i := range dp {
		dp[i] = make([][]int, k+1)
		for j := range dp[i] {
			dp[i][j] = make([]int, m+1)
		}
	}
	for i := 1; i <= m; i++ {
		dp[1][1][i] = 1
	}
	for i := 2; i <= n; i++ {
		for c := 1; c <= k && c <= i; c++ {
			for j := 1; j <= m; j++ {
				dp[i][c][j] = (dp[i-1][c][j] * j) % mod
				for j0 := 1; j0 < j; j0++ {
					dp[i][c][j] = (dp[i][c][j] + dp[i-1][c-1][j0]) % mod
				}
			}
		}
	}
	ans := 0
	for i := 1; i <= m; i++ {
		ans = (ans + dp[n][k][i]) % mod
	}
	return ans
}
```

### Java

```java
// Build Array Where You Can Find The Maximum Exactly K Comparisons：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private static final int MOD = (int) 1e9 + 7;

    public int numOfArrays(int n, int m, int k) {
        if (k == 0) {
            return 0;
        }
        long[][][] dp = new long[n + 1][k + 1][m + 1];
        for (int i = 1; i <= m; ++i) {
            dp[1][1][i] = 1;
        }
        for (int i = 2; i <= n; ++i) {
            for (int c = 1; c <= Math.min(i, k); ++c) {
                for (int j = 1; j <= m; ++j) {
                    dp[i][c][j] = (dp[i - 1][c][j] * j) % MOD;
                    for (int j0 = 1; j0 < j; ++j0) {
                        dp[i][c][j] = (dp[i][c][j] + dp[i - 1][c - 1][j0]) % MOD;
                    }
                }
            }
        }
        long ans = 0;
        for (int i = 1; i <= m; ++i) {
            ans = (ans + dp[n][k][i]) % MOD;
        }
        return (int) ans;
    }
}
```

### Python

```python
# Build Array Where You Can Find The Maximum Exactly K Comparisons：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numOfArrays(self, n: int, m: int, k: int) -> int:
        if k == 0:
            return 0
        dp = [[[0] * (m + 1) for _ in range(k + 1)] for _ in range(n + 1)]
        mod = 10**9 + 7
        for i in range(1, m + 1):
            dp[1][1][i] = 1
        for i in range(2, n + 1):
            for c in range(1, min(k + 1, i + 1)):
                for j in range(1, m + 1):
                    dp[i][c][j] = dp[i - 1][c][j] * j
                    for j0 in range(1, j):
                        dp[i][c][j] += dp[i - 1][c - 1][j0]
                        dp[i][c][j] %= mod
        ans = 0
        for i in range(1, m + 1):
            ans += dp[n][k][i]
            ans %= mod
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

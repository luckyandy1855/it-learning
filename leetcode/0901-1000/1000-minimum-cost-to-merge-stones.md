# 1000. Minimum Cost to Merge Stones

---
编号: 1000
题目: Minimum Cost to Merge Stones
难度: 困难
标签: [数组, 动态规划, 前缀和]
来源链接: https://leetcode.com/problems/minimum-cost-to-merge-stones/
---

## 题目描述

有 `n` 堆石头排成一排，第 `i` 堆中有 `stones[i]` 块石头。

每次 **移动** 需要将 **连续的** `k` 堆石头合并为一堆，而这次移动的成本为这 `k` 堆中石头的总数。

返回把所有石头合并成一堆的最低成本。如果无法合并成一堆，返回 `-1` 。

**示例 1：**

```text
输入：stones = [3,2,4,1], K = 2
输出：20
解释：
从 [3, 2, 4, 1] 开始。
合并 [3, 2]，成本为 5，剩下 [5, 4, 1]。
合并 [4, 1]，成本为 5，剩下 [5, 5]。
合并 [5, 5]，成本为 10，剩下 [10]。
总成本 20，这是可能的最小值。
```

**示例 2：**

```text
输入：stones = [3,2,4,1], K = 3
输出：-1
解释：任何合并操作后，都会剩下 2 堆，我们无法再进行合并。所以这项任务是不可能完成的。.
```

**示例 3：**

```text
输入：stones = [3,5,1,2,6], K = 3
输出：25
解释：
从 [3, 5, 1, 2, 6] 开始。
合并 [5, 1, 2]，成本为 8，剩下 [3, 8, 6]。
合并 [3, 8, 6]，成本为 17，剩下 [17]。
总成本 25，这是可能的最小值。
```

**提示：**

- `n == stones.length`

- `1 <= n <= 30`

- `1 <= stones[i] <= 100`

- `2 <= k <= 30`

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

我们不妨记题目中的 $k$ 为 $K$，石头的堆数为 $n$。

定义 $f[i][j][k]$ 表示将区间 $[i, j]$ 中的石头合并成 $k$ 堆的最小成本。初始时 $f[i][i][1] = 0$，其他位置的值均为 $\infty$。

注意到 $k$ 的取值范围为 $[1, K]$，因此我们需要枚举 $k$ 的值。

对于 $f[i][j][k]$，我们可以枚举 $i \leq h \lt j$，将区间 $[i, j]$ 拆分成两个区间 $[i, h]$ 和 $[h + 1, j]$，然后将 $[i, h]$ 中的石头合并成 $1$ 堆，将 $[h + 1, j]$ 中的石头合并成 $k - 1$ 堆，最后将这两堆石头合并成一堆，这样就可以将区间 $[i, j]$ 中的石头合并成 $k$ 堆。因此，我们可以得到状态转移方程：


f[i][j][k] = \min_{i \leq h < j} \{f[i][h][1] + f[h + 1][j][k - 1]\}


我们将区间 $[i, j]$ 的 $K$ 堆石头合并成一堆，因此 $f[i][j][1] = f[i][j][K] + \sum_{t = i}^j stones[t]$，其中 $\sum_{t = i}^j stones[t]$ 表示区间 $[i, j]$ 中石头的总数。

最后答案即为 $f[1][n][1]$，其中 $n$ 为石头的堆数。

时间复杂度 $O(n^3 \times k)$，空间复杂度 $O(n^2 \times k)$。其中 $n$ 为石头的堆数。

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
// Minimum Cost to Merge Stones：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func mergeStones(stones []int, K int) int {
	n := len(stones)
	if (n-1)%(K-1) != 0 {
		return -1
	}
	s := make([]int, n+1)
	for i, x := range stones {
		s[i+1] = s[i] + x
	}
	f := make([][][]int, n+1)
	for i := range f {
		f[i] = make([][]int, n+1)
		for j := range f[i] {
			f[i][j] = make([]int, K+1)
			for k := range f[i][j] {
				f[i][j][k] = 1 << 20
			}
		}
	}
	for i := 1; i <= n; i++ {
		f[i][i][1] = 0
	}
	for l := 2; l <= n; l++ {
		for i := 1; i <= n-l+1; i++ {
			j := i + l - 1
			for k := 2; k <= K; k++ {
				for h := i; h < j; h++ {
					f[i][j][k] = min(f[i][j][k], f[i][h][k-1]+f[h+1][j][1])
				}
			}
			f[i][j][1] = f[i][j][K] + s[j] - s[i-1]
		}
	}
	return f[1][n][1]
}
```

### Java

```java
// Minimum Cost to Merge Stones：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int mergeStones(int[] stones, int K) {
        int n = stones.length;
        if ((n - 1) % (K - 1) != 0) {
            return -1;
        }
        int[] s = new int[n + 1];
        for (int i = 1; i <= n; ++i) {
            s[i] = s[i - 1] + stones[i - 1];
        }
        int[][][] f = new int[n + 1][n + 1][K + 1];
        final int inf = 1 << 20;
        for (int[][] g : f) {
            for (int[] e : g) {
                Arrays.fill(e, inf);
            }
        }
        for (int i = 1; i <= n; ++i) {
            f[i][i][1] = 0;
        }
        for (int l = 2; l <= n; ++l) {
            for (int i = 1; i + l - 1 <= n; ++i) {
                int j = i + l - 1;
                for (int k = 1; k <= K; ++k) {
                    for (int h = i; h < j; ++h) {
                        f[i][j][k] = Math.min(f[i][j][k], f[i][h][1] + f[h + 1][j][k - 1]);
                    }
                }
                f[i][j][1] = f[i][j][K] + s[j] - s[i - 1];
            }
        }
        return f[1][n][1];
    }
}
```

### Python

```python
# Minimum Cost to Merge Stones：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def mergeStones(self, stones: List[int], K: int) -> int:
        n = len(stones)
        if (n - 1) % (K - 1):
            return -1
        s = list(accumulate(stones, initial=0))
        f = [[[inf] * (K + 1) for _ in range(n + 1)] for _ in range(n + 1)]
        for i in range(1, n + 1):
            f[i][i][1] = 0
        for l in range(2, n + 1):
            for i in range(1, n - l + 2):
                j = i + l - 1
                for k in range(1, K + 1):
                    for h in range(i, j):
                        f[i][j][k] = min(f[i][j][k], f[i][h][1] + f[h + 1][j][k - 1])
                f[i][j][1] = f[i][j][K] + s[j] - s[i - 1]
        return f[1][n][1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

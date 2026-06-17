# 1473. Paint House III

---
编号: 1473
题目: Paint House III
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/paint-house-iii/
---

## 题目描述

在一个小城市里，有 `m` 个房子排成一排，你需要给每个房子涂上 `n` 种颜色之一（颜色编号为 `1` 到 `n` ）。有的房子去年夏天已经涂过颜色了，所以这些房子不可以被重新涂色。

我们将连续相同颜色尽可能多的房子称为一个街区。（比方说 `houses = [1,2,2,3,3,2,1,1]` ，它包含 5 个街区 ` [{1}, {2,2}, {3,3}, {2}, {1,1}]` 。）

给你一个数组 `houses` ，一个 `m * n` 的矩阵 `cost` 和一个整数 `target` ，其中：

- `houses[i]`：是第 `i` 个房子的颜色，**0** 表示这个房子还没有被涂色。

- `cost[i][j]`：是将第 `i` 个房子涂成颜色 `j+1` 的花费。

请你返回房子涂色方案的最小总花费，使得每个房子都被涂色后，恰好组成 `target` 个街区。如果没有可用的涂色方案，请返回 **-1** 。

**示例 1：**

```text
输入：houses = [0,0,0,0,0], cost = [[1,10],[10,1],[10,1],[1,10],[5,1]], m = 5, n = 2, target = 3
输出：9
解释：房子涂色方案为 [1,2,2,1,1]
此方案包含 target = 3 个街区，分别是 [{1}, {2,2}, {1,1}]。
涂色的总花费为 (1 + 1 + 1 + 1 + 5) = 9。
```

**示例 2：**

```text
输入：houses = [0,2,1,2,0], cost = [[1,10],[10,1],[10,1],[1,10],[5,1]], m = 5, n = 2, target = 3
输出：11
解释：有的房子已经被涂色了，在此基础上涂色方案为 [2,2,1,2,2]
此方案包含 target = 3 个街区，分别是 [{2,2}, {1}, {2,2}]。
给第一个和最后一个房子涂色的花费为 (10 + 1) = 11。
```

**示例 3：**

```text
输入：houses = [0,0,0,0,0], cost = [[1,10],[10,1],[1,10],[10,1],[1,10]], m = 5, n = 2, target = 5
输出：5
```

**示例 4：**

```text
输入：houses = [3,1,2,3], cost = [[1,1,1],[1,1,1],[1,1,1],[1,1,1]], m = 4, n = 3, target = 3
输出：-1
解释：房子已经被涂色并组成了 4 个街区，分别是 [{3},{1},{2},{3}] ，无法形成 target = 3 个街区。
```

**提示：**

- `m == houses.length == cost.length`

- `n == cost[i].length`

- `1 <= m <= 100`

- `1 <= n <= 20`

- `1 <= target <= m`

- `0 <= houses[i] <= n`

- `1 <= cost[i][j] <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j][k]$ 表示将下标 $[0,..i]$ 的房子涂上颜色，最后一个房子的颜色为 $j$，且恰好形成 $k$ 个街区的最小花费。那么答案就是 $f[m-1][j][\textit{target}]$，其中 $j$ 的取值范围为 $[1,..n]$。初始时，我们判断下标为 $0$ 的房子是否已经涂色，如果未涂色，那么 $f[0][j][1] = \textit{cost}[0][j - 1]$，其中 $j \in [1,..n]$。如果已经涂色，那么 $f[0][\textit{houses}[0]][1] = 0$。其他的 $f[i][j][k]$ 的值都初始化为 $\infty$。

接下来，我们从下标 $i=1$ 开始遍历，对于每个 $i$，我们判断下标为 $i$ 的房子是否已经涂色：

如果未涂色，那么我们可以将下标为 $i$ 的房子涂成颜色 $j$，我们枚举街区的数量 $k$，其中 $k \in [1,..\min(\textit{target}, i + 1)]$，并且枚举下标为 $i$ 的房子的前一个房子的颜色 $j_0$，其中 $j_0 \in [1,..n]$，那么我们可以得到状态转移方程：


f[i][j][k] = \min_{j_0 \in [1,..n]} \{ f[i - 1][j_0][k - (j \neq j_0)] + \textit{cost}[i][j - 1] \}


如果已经涂色，那么我们可以将下标为 $i$ 的房子涂成颜色 $j$，我们枚举街区的数量 $k$，其中 $k \in [1,..\min(\textit{target}, i + 1)]$，并且枚举下标为 $i$ 的房子的前一个房子的颜色 $j_0$，其中 $j_0 \in [1,..n]$，那么我们可以得到状态转移方程：


f[i][j][k] = \min_{j_0 \in [1,..n]} \{ f[i - 1][j_0][k - (j \neq j_0)] \}


最后，我们返回 $f[m - 1][j][\textit{target}]$，其中 $j \in [1,..n]$，如果所有的 $f[m - 1][j][\textit{target}]$ 的值都为 $\infty$，那么返回 $-1$。

时间复杂度 $O(m \times n^2 \times \textit{target})$，空间复杂度 $O(m \times n \times \textit{target})$。其中 $m$, $n$, $\textit{target}$ 分别为房子的数量，颜色的数量，街区的数量。

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
// Paint House III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minCost(houses []int, cost [][]int, m int, n int, target int) int {
	f := make([][][]int, m)
	const inf = 1 << 30
	for i := range f {
		f[i] = make([][]int, n+1)
		for j := range f[i] {
			f[i][j] = make([]int, target+1)
			for k := range f[i][j] {
				f[i][j][k] = inf
			}
		}
	}
	if houses[0] == 0 {
		for j := 1; j <= n; j++ {
			f[0][j][1] = cost[0][j-1]
		}
	} else {
		f[0][houses[0]][1] = 0
	}
	for i := 1; i < m; i++ {
		if houses[i] == 0 {
			for j := 1; j <= n; j++ {
				for k := 1; k <= target && k <= i+1; k++ {
					for j0 := 1; j0 <= n; j0++ {
						if j == j0 {
							f[i][j][k] = min(f[i][j][k], f[i-1][j][k]+cost[i][j-1])
						} else {
							f[i][j][k] = min(f[i][j][k], f[i-1][j0][k-1]+cost[i][j-1])
						}
					}
				}
			}
		} else {
			j := houses[i]
			for k := 1; k <= target && k <= i+1; k++ {
				for j0 := 1; j0 <= n; j0++ {
					if j == j0 {
						f[i][j][k] = min(f[i][j][k], f[i-1][j][k])
					} else {
						f[i][j][k] = min(f[i][j][k], f[i-1][j0][k-1])
					}
				}
			}
		}
	}
	ans := inf
	for j := 1; j <= n; j++ {
		ans = min(ans, f[m-1][j][target])
	}
	if ans == inf {
		return -1
	}
	return ans
}
```

### Java

```java
// Paint House III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minCost(int[] houses, int[][] cost, int m, int n, int target) {
        int[][][] f = new int[m][n + 1][target + 1];
        final int inf = 1 << 30;
        for (int[][] g : f) {
            for (int[] e : g) {
                Arrays.fill(e, inf);
            }
        }
        if (houses[0] == 0) {
            for (int j = 1; j <= n; ++j) {
                f[0][j][1] = cost[0][j - 1];
            }
        } else {
            f[0][houses[0]][1] = 0;
        }
        for (int i = 1; i < m; ++i) {
            if (houses[i] == 0) {
                for (int j = 1; j <= n; ++j) {
                    for (int k = 1; k <= Math.min(target, i + 1); ++k) {
                        for (int j0 = 1; j0 <= n; ++j0) {
                            if (j == j0) {
                                f[i][j][k] = Math.min(f[i][j][k], f[i - 1][j][k] + cost[i][j - 1]);
                            } else {
                                f[i][j][k]
                                    = Math.min(f[i][j][k], f[i - 1][j0][k - 1] + cost[i][j - 1]);
                            }
                        }
                    }
                }
            } else {
                int j = houses[i];
                for (int k = 1; k <= Math.min(target, i + 1); ++k) {
                    for (int j0 = 1; j0 <= n; ++j0) {
                        if (j == j0) {
                            f[i][j][k] = Math.min(f[i][j][k], f[i - 1][j][k]);
                        } else {
                            f[i][j][k] = Math.min(f[i][j][k], f[i - 1][j0][k - 1]);
                        }
                    }
                }
            }
        }
        int ans = inf;
        for (int j = 1; j <= n; ++j) {
            ans = Math.min(ans, f[m - 1][j][target]);
        }
        return ans >= inf ? -1 : ans;
    }
}
```

### Python

```python
# Paint House III：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minCost(
        self, houses: List[int], cost: List[List[int]], m: int, n: int, target: int
    ) -> int:
        f = [[[inf] * (target + 1) for _ in range(n + 1)] for _ in range(m)]
        if houses[0] == 0:
            for j, c in enumerate(cost[0], 1):
                f[0][j][1] = c
        else:
            f[0][houses[0]][1] = 0
        for i in range(1, m):
            if houses[i] == 0:
                for j in range(1, n + 1):
                    for k in range(1, min(target + 1, i + 2)):
                        for j0 in range(1, n + 1):
                            if j == j0:
                                f[i][j][k] = min(
                                    f[i][j][k], f[i - 1][j][k] + cost[i][j - 1]
                                )
                            else:
                                f[i][j][k] = min(
                                    f[i][j][k], f[i - 1][j0][k - 1] + cost[i][j - 1]
                                )
            else:
                j = houses[i]
                for k in range(1, min(target + 1, i + 2)):
                    for j0 in range(1, n + 1):
                        if j == j0:
                            f[i][j][k] = min(f[i][j][k], f[i - 1][j][k])
                        else:
                            f[i][j][k] = min(f[i][j][k], f[i - 1][j0][k - 1])

        ans = min(f[-1][j][target] for j in range(1, n + 1))
        return -1 if ans >= inf else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

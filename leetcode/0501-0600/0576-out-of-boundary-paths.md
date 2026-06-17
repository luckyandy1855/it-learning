# 0576. Out of Boundary Paths

---
编号: 576
题目: Out of Boundary Paths
难度: 中等
标签: [动态规划]
来源链接: https://leetcode.com/problems/out-of-boundary-paths/
---

## 题目描述

给你一个大小为 `m x n` 的网格和一个球。球的起始坐标为 `[startRow, startColumn]` 。你可以将球移到在四个方向上相邻的单元格内（可以穿过网格边界到达网格之外）。你 **最多** 可以移动 `maxMove` 次球。

给你五个整数 `m`、`n`、`maxMove`、`startRow` 以及 `startColumn` ，找出并返回可以将球移出边界的路径数量。因为答案可能非常大，返回对 `10^9 + 7` **取余** 后的结果。

**示例 1：**

```text
输入：m = 2, n = 2, maxMove = 2, startRow = 0, startColumn = 0
输出：6
```

**示例 2：**

```text
输入：m = 1, n = 3, maxMove = 3, startRow = 0, startColumn = 1
输出：12
```

**提示：**

- `1 <= m, n <= 50`

- `0 <= maxMove <= 50`

- `0 <= startRow < m`

- `0 <= startColumn < n`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个函数 $\textit{dfs}(i, j, k)$ 表示从坐标 $(i, j)$ 出发，还剩下 $k$ 步可以移动的情况下，可以移出边界的路径数量。

在函数 $\textit{dfs}(i, j, k)$ 中，我们首先处理边界情况，如果当前坐标 $(i, j)$ 不在网格范围内，如果 $k \geq 0$，则返回 $1$，否则返回 $0$。如果 $k \leq 0$，说明还在网格内，但是已经没有移动次数了，返回 $0$。接下来，我们遍历四个方向，移动到下一个坐标 $(x, y)$，然后递归调用 $\textit{dfs}(x, y, k - 1)$，并将结果累加到答案中。

在主函数中，我们调用 $\textit{dfs}(startRow, startColumn, maxMove)$，即从起始坐标 $(\textit{startRow}, \textit{startColumn})$ 出发，还剩下 $\textit{maxMove}$ 步可以移动的情况下，可以移出边界的路径数量。

为了避免重复计算，我们可以使用记忆化搜索。

时间复杂度 $O(m \times n \times k)$，空间复杂度 $O(m \times n \times k)$。其中 $m$ 和 $n$ 分别是网格的行数和列数，而 $k$ 是可以移动的步数，本题中 $k = \textit{maxMove} \leq 50$。

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
// Out of Boundary Paths：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findPaths(m int, n int, maxMove int, startRow int, startColumn int) int {
	f := make([][][]int, m)
	for i := range f {
		f[i] = make([][]int, n)
		for j := range f[i] {
			f[i][j] = make([]int, maxMove+1)
			for k := range f[i][j] {
				f[i][j][k] = -1
			}
		}
	}
	const mod int = 1e9 + 7
	var dfs func(int, int, int) int
	dirs := [5]int{-1, 0, 1, 0, -1}
	dfs = func(i, j, k int) int {
		if i < 0 || i >= m || j < 0 || j >= n {
			if k >= 0 {
				return 1
			}
			return 0
		}
		if k <= 0 {
			return 0
		}
		if f[i][j][k] != -1 {
			return f[i][j][k]
		}
		ans := 0
		for d := 0; d < 4; d++ {
			x, y := i+dirs[d], j+dirs[d+1]
			ans = (ans + dfs(x, y, k-1)) % mod
		}
		f[i][j][k] = ans
		return ans
	}
	return dfs(startRow, startColumn, maxMove)
}
```

### Java

```java
// Out of Boundary Paths：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int m, n;
    private Integer[][][] f;
    private final int mod = (int) 1e9 + 7;

    public int findPaths(int m, int n, int maxMove, int startRow, int startColumn) {
        this.m = m;
        this.n = n;
        f = new Integer[m][n][maxMove + 1];
        return dfs(startRow, startColumn, maxMove);
    }

    private int dfs(int i, int j, int k) {
        if (i < 0 || i >= m || j < 0 || j >= n) {
            return k >= 0 ? 1 : 0;
        }
        if (k <= 0) {
            return 0;
        }
        if (f[i][j][k] != null) {
            return f[i][j][k];
        }
        int ans = 0;
        final int[] dirs = {-1, 0, 1, 0, -1};
        for (int d = 0; d < 4; ++d) {
            int x = i + dirs[d], y = j + dirs[d + 1];
            ans = (ans + dfs(x, y, k - 1)) % mod;
        }
        return f[i][j][k] = ans;
    }
}
```

### Python

```python
# Out of Boundary Paths：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findPaths(
        self, m: int, n: int, maxMove: int, startRow: int, startColumn: int
    ) -> int:
        @cache
        def dfs(i: int, j: int, k: int) -> int:
            if not 0 <= i < m or not 0 <= j < n:
                return int(k >= 0)
            if k <= 0:
                return 0
            ans = 0
            for a, b in pairwise(dirs):
                x, y = i + a, j + b
                ans = (ans + dfs(x, y, k - 1)) % mod
            return ans

        mod = 10**9 + 7
        dirs = (-1, 0, 1, 0, -1)
        return dfs(startRow, startColumn, maxMove)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

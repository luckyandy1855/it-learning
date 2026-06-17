# 0980. Unique Paths III

---
编号: 980
题目: Unique Paths III
难度: 困难
标签: [位运算, 数组, 回溯, 矩阵]
来源链接: https://leetcode.com/problems/unique-paths-iii/
---

## 题目描述

在二维网格 `grid` 上，有 4 种类型的方格：

- `1` 表示起始方格。且只有一个起始方格。

- `2` 表示结束方格，且只有一个结束方格。

- `0` 表示我们可以走过的空方格。

- `-1` 表示我们无法跨越的障碍。

返回在四个方向（上、下、左、右）上行走时，从起始方格到结束方格的不同路径的数目**。**

**每一个无障碍方格都要通过一次，但是一条路径中不能重复通过同一个方格**。

**示例 1：**

```text
输入：[[1,0,0,0],[0,0,0,0],[0,0,2,-1]]
输出：2
解释：我们有以下两条路径：
1. (0,0),(0,1),(0,2),(0,3),(1,3),(1,2),(1,1),(1,0),(2,0),(2,1),(2,2)
2. (0,0),(1,0),(2,0),(2,1),(1,1),(0,1),(0,2),(0,3),(1,3),(1,2),(2,2)
```

**示例 2：**

```text
输入：[[1,0,0,0],[0,0,0,0],[0,0,0,2]]
输出：4
解释：我们有以下四条路径：
1. (0,0),(0,1),(0,2),(0,3),(1,3),(1,2),(1,1),(1,0),(2,0),(2,1),(2,2),(2,3)
2. (0,0),(0,1),(1,1),(1,0),(2,0),(2,1),(2,2),(1,2),(0,2),(0,3),(1,3),(2,3)
3. (0,0),(1,0),(2,0),(2,1),(2,2),(1,2),(1,1),(0,1),(0,2),(0,3),(1,3),(2,3)
4. (0,0),(1,0),(2,0),(2,1),(1,1),(0,1),(0,2),(0,3),(1,3),(1,2),(2,2),(2,3)
```

**示例 3：**

```text
输入：[[0,1],[2,0]]
输出：0
解释：
没有一条路能完全穿过每一个空的方格一次。
请注意，起始和结束方格可以位于网格中的任意位置。
```

**提示：**

- `1 <= grid.length * grid[0].length <= 20`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 回溯, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先遍历整个网格，找出起点 $(x, y)$，并且统计空白格的数量 $cnt$。

接下来，我们可以从起点开始搜索，得到所有的路径数。我们设计一个函数 $dfs(i, j, k)$ 表示从 $(i, j)$ 出发，且当前已经走过的单元格数量为 $k$ 的路径数。

在函数中，我们首先判断当前单元格是否为终点，如果是，则判断 $k$ 是否等于 $cnt + 1$，如果是，则说明当前路径是一条有效路径，返回 $1$，否则返回 $0$。

如果当前单元格不是终点，则我们枚举当前单元格的上下左右四个邻接单元格，如果邻接单元格未被访问过，则我们将该邻接单元格标记为已访问，然后继续搜索从该邻接单元格出发的路径数，搜索完成后，我们再将该邻接单元格标记为未访问。在搜索完成后，我们返回所有邻接单元格的路径数之和。

最后，我们返回从起点出发的路径数即可，即 $dfs(x, y, 1)$。

时间复杂度 $O(3^{m \times n})$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别为网格的行数和列数。

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
// Unique Paths III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func uniquePathsIII(grid [][]int) int {
	m, n := len(grid), len(grid[0])
	cnt := 0
	vis := make([][]bool, m)
	x, y := 0, 0
	for i, row := range grid {
		vis[i] = make([]bool, n)
		for j, v := range row {
			if v == 0 {
				cnt++
			} else if v == 1 {
				x, y = i, j
			}
		}
	}
	dirs := [5]int{-1, 0, 1, 0, -1}
	var dfs func(i, j, k int) int
	dfs = func(i, j, k int) int {
		if grid[i][j] == 2 {
			if k == cnt+1 {
				return 1
			}
			return 0
		}
		ans := 0
		for h := 0; h < 4; h++ {
			x, y := i+dirs[h], j+dirs[h+1]
			if x >= 0 && x < m && y >= 0 && y < n && !vis[x][y] && grid[x][y] != -1 {
				vis[x][y] = true
				ans += dfs(x, y, k+1)
				vis[x][y] = false
			}
		}
		return ans
	}
	vis[x][y] = true
	return dfs(x, y, 0)
}
```

### Java

```java
// Unique Paths III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int m;
    private int n;
    private int cnt;
    private int[][] grid;
    private boolean[][] vis;

    public int uniquePathsIII(int[][] grid) {
        m = grid.length;
        n = grid[0].length;
        this.grid = grid;
        int x = 0, y = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 0) {
                    ++cnt;
                } else if (grid[i][j] == 1) {
                    x = i;
                    y = j;
                }
            }
        }
        vis = new boolean[m][n];
        vis[x][y] = true;
        return dfs(x, y, 0);
    }

    private int dfs(int i, int j, int k) {
        if (grid[i][j] == 2) {
            return k == cnt + 1 ? 1 : 0;
        }
        int ans = 0;
        int[] dirs = {-1, 0, 1, 0, -1};
        for (int h = 0; h < 4; ++h) {
            int x = i + dirs[h], y = j + dirs[h + 1];
            if (x >= 0 && x < m && y >= 0 && y < n && !vis[x][y] && grid[x][y] != -1) {
                vis[x][y] = true;
                ans += dfs(x, y, k + 1);
                vis[x][y] = false;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Unique Paths III：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def uniquePathsIII(self, grid: List[List[int]]) -> int:
        def dfs(i: int, j: int, k: int) -> int:
            if grid[i][j] == 2:
                return int(k == cnt + 1)
            ans = 0
            for a, b in pairwise(dirs):
                x, y = i + a, j + b
                if 0 <= x < m and 0 <= y < n and (x, y) not in vis and grid[x][y] != -1:
                    vis.add((x, y))
                    ans += dfs(x, y, k + 1)
                    vis.remove((x, y))
            return ans

        m, n = len(grid), len(grid[0])
        start = next((i, j) for i in range(m) for j in range(n) if grid[i][j] == 1)
        dirs = (-1, 0, 1, 0, -1)
        cnt = sum(row.count(0) for row in grid)
        vis = {start}
        return dfs(*start, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

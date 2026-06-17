# 1034. Coloring A Border

---
编号: 1034
题目: Coloring A Border
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 数组, 矩阵]
来源链接: https://leetcode.com/problems/coloring-a-border/
---

## 题目描述

给你一个大小为 `m x n` 的整数矩阵 `grid` ，表示一个网格。另给你三个整数 `row`、`col` 和 `color` 。网格中的每个值表示该位置处的网格块的颜色。

如果两个方块在任意 4 个方向上相邻，则称它们 **相邻 **。

如果两个方块具有相同的颜色且相邻，它们则属于同一个 **连通分量** 。

**连通分量的边界**** **是指连通分量中满足下述条件之一的所有网格块：

- 在上、下、左、右任意一个方向上与不属于同一连通分量的网格块相邻

- 在网格的边界上（第一行/列或最后一行/列）

请你使用指定颜色 `color` 为所有包含网格块 `grid[row][col]` 的 **连通分量的边界** 进行着色。

并返回最终的网格 `grid` 。

示例 1：

```text
输入：grid = [[1,1],[1,2]], row = 0, col = 0, color = 3
输出：[[3,3],[3,2]]
```

示例 2：

```text
输入：grid = [[1,2,2],[2,3,2]], row = 0, col = 1, color = 3
输出：[[1,3,3],[2,3,3]]
```

示例 3：

```text
输入：grid = [[1,1,1],[1,1,1],[1,1,1]], row = 1, col = 1, color = 2
输出：[[2,2,2],[2,1,2],[2,2,2]]
```

**提示：**

- `m == grid.length`

- `n == grid[i].length`

- `1 <= m, n <= 50`

- `1 <= grid[i][j], color <= 1000`

- `0 <= row < m`

- `0 <= col < n`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 数组, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们从位置 $(row, col)$ 出发，利用 DFS 搜索所有颜色为 $grid[row][col]$ 的网格块，如果该网格块的某个相邻位置的颜色不为 $grid[row][col]$，或者该网格块在网格的边界上，则将该网格块的颜色改为 $color$。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是网格的行数和列数。

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
// Coloring A Border：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func colorBorder(grid [][]int, row int, col int, color int) [][]int {
	m, n := len(grid), len(grid[0])
	vis := make([][]bool, m)
	for i := range vis {
		vis[i] = make([]bool, n)
	}
	dirs := [5]int{-1, 0, 1, 0, -1}
	var dfs func(int, int, int)
	dfs = func(i, j, c int) {
		vis[i][j] = true
		for k := 0; k < 4; k++ {
			x, y := i+dirs[k], j+dirs[k+1]
			if x >= 0 && x < m && y >= 0 && y < n {
				if !vis[x][y] {
					if grid[x][y] == c {
						dfs(x, y, c)
					} else {
						grid[i][j] = color
					}
				}
			} else {
				grid[i][j] = color
			}
		}
	}
	dfs(row, col, grid[row][col])
	return grid
}
```

### Java

```java
// Coloring A Border：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[][] grid;
    private int color;
    private int m;
    private int n;
    private boolean[][] vis;

    public int[][] colorBorder(int[][] grid, int row, int col, int color) {
        this.grid = grid;
        this.color = color;
        m = grid.length;
        n = grid[0].length;
        vis = new boolean[m][n];
        dfs(row, col, grid[row][col]);
        return grid;
    }

    private void dfs(int i, int j, int c) {
        vis[i][j] = true;
        int[] dirs = {-1, 0, 1, 0, -1};
        for (int k = 0; k < 4; ++k) {
            int x = i + dirs[k], y = j + dirs[k + 1];
            if (x >= 0 && x < m && y >= 0 && y < n) {
                if (!vis[x][y]) {
                    if (grid[x][y] == c) {
                        dfs(x, y, c);
                    } else {
                        grid[i][j] = color;
                    }
                }
            } else {
                grid[i][j] = color;
            }
        }
    }
}
```

### Python

```python
# Coloring A Border：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def colorBorder(
        self, grid: List[List[int]], row: int, col: int, color: int
    ) -> List[List[int]]:
        def dfs(i: int, j: int, c: int) -> None:
            vis[i][j] = True
            for a, b in pairwise((-1, 0, 1, 0, -1)):
                x, y = i + a, j + b
                if 0 <= x < m and 0 <= y < n:
                    if not vis[x][y]:
                        if grid[x][y] == c:
                            dfs(x, y, c)
                        else:
                            grid[i][j] = color
                else:
                    grid[i][j] = color

        m, n = len(grid), len(grid[0])
        vis = [[False] * n for _ in range(m)]
        dfs(row, col, grid[row][col])
        return grid
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

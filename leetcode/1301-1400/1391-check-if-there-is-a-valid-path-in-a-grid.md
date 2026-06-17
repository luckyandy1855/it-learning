# 1391. Check if There is a Valid Path in a Grid

---
编号: 1391
题目: Check if There is a Valid Path in a Grid
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 并查集, 数组, 矩阵]
来源链接: https://leetcode.com/problems/check-if-there-is-a-valid-path-in-a-grid/
---

## 题目描述

给你一个 *m* x *n* 的网格 `grid`。网格里的每个单元都代表一条街道。`grid[i][j]` 的街道可以是：

- **1** 表示连接左单元格和右单元格的街道。

- **2** 表示连接上单元格和下单元格的街道。

- **3** 表示连接左单元格和下单元格的街道。

- **4** 表示连接右单元格和下单元格的街道。

- **5** 表示连接左单元格和上单元格的街道。

- **6** 表示连接右单元格和上单元格的街道。

你最开始从左上角的单元格 `(0,0)` 开始出发，网格中的「有效路径」是指从左上方的单元格 `(0,0)` 开始、一直到右下方的 `(m-1,n-1)` 结束的路径。**该路径必须只沿着街道走**。

**注意：**你 **不能** 变更街道。

如果网格中存在有效的路径，则返回 `true`，否则返回 `false` 。

**示例 1：**

```text
输入：grid = [[2,4,3],[6,5,2]]
输出：true
解释：如图所示，你可以从 (0, 0) 开始，访问网格中的所有单元格并到达 (m - 1, n - 1) 。
```

**示例 2：**

```text
输入：grid = [[1,2,1],[1,2,1]]
输出：false
解释：如图所示，单元格 (0, 0) 上的街道没有与任何其他单元格上的街道相连，你只会停在 (0, 0) 处。
```

**示例 3：**

```text
输入：grid = [[1,1,2]]
输出：false
解释：你会停在 (0, 1)，而且无法到达 (0, 2) 。
```

**示例 4：**

```text
输入：grid = [[1,1,1,1,1,1,3]]
输出：true
```

**示例 5：**

```text
输入：grid = [[2],[2],[2],[2],[2],[2],[6]]
输出：true
```

**提示：**

- `m == grid.length`

- `n == grid[i].length`

- `1 <= m, n <= 300`

- `1 <= grid[i][j] <= 6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 并查集, 数组, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Check if There is a Valid Path in a Grid：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func hasValidPath(grid [][]int) bool {
	m, n := len(grid), len(grid[0])
	p := make([]int, m*n)
	for i := range p {
		p[i] = i
	}
	var find func(x int) int
	find = func(x int) int {
		if p[x] != x {
			p[x] = find(p[x])
		}
		return p[x]
	}
	left := func(i, j int) {
		if j > 0 && (grid[i][j-1] == 1 || grid[i][j-1] == 4 || grid[i][j-1] == 6) {
			p[find(i*n+j)] = find(i*n + j - 1)
		}
	}
	right := func(i, j int) {
		if j < n-1 && (grid[i][j+1] == 1 || grid[i][j+1] == 3 || grid[i][j+1] == 5) {
			p[find(i*n+j)] = find(i*n + j + 1)
		}
	}
	up := func(i, j int) {
		if i > 0 && (grid[i-1][j] == 2 || grid[i-1][j] == 3 || grid[i-1][j] == 4) {
			p[find(i*n+j)] = find((i-1)*n + j)
		}
	}
	down := func(i, j int) {
		if i < m-1 && (grid[i+1][j] == 2 || grid[i+1][j] == 5 || grid[i+1][j] == 6) {
			p[find(i*n+j)] = find((i+1)*n + j)
		}
	}
	for i, row := range grid {
		for j, e := range row {
			if e == 1 {
				left(i, j)
				right(i, j)
			} else if e == 2 {
				up(i, j)
				down(i, j)
			} else if e == 3 {
				left(i, j)
				down(i, j)
			} else if e == 4 {
				right(i, j)
				down(i, j)
			} else if e == 5 {
				left(i, j)
				up(i, j)
			} else {
				right(i, j)
				up(i, j)
			}
		}
	}
	return find(0) == find(m*n-1)
}
```

### Java

```java
// Check if There is a Valid Path in a Grid：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] p;
    private int[][] grid;
    private int m;
    private int n;

    public boolean hasValidPath(int[][] grid) {
        this.grid = grid;
        m = grid.length;
        n = grid[0].length;
        p = new int[m * n];
        for (int i = 0; i < p.length; ++i) {
            p[i] = i;
        }
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                int e = grid[i][j];
                if (e == 1) {
                    left(i, j);
                    right(i, j);
                } else if (e == 2) {
                    up(i, j);
                    down(i, j);
                } else if (e == 3) {
                    left(i, j);
                    down(i, j);
                } else if (e == 4) {
                    right(i, j);
                    down(i, j);
                } else if (e == 5) {
                    left(i, j);
                    up(i, j);
                } else {
                    right(i, j);
                    up(i, j);
                }
            }
        }
        return find(0) == find(m * n - 1);
    }

    private int find(int x) {
        if (p[x] != x) {
            p[x] = find(p[x]);
        }
        return p[x];
    }

    private void left(int i, int j) {
        if (j > 0 && (grid[i][j - 1] == 1 || grid[i][j - 1] == 4 || grid[i][j - 1] == 6)) {
            p[find(i * n + j)] = find(i * n + j - 1);
        }
    }

    private void right(int i, int j) {
        if (j < n - 1 && (grid[i][j + 1] == 1 || grid[i][j + 1] == 3 || grid[i][j + 1] == 5)) {
            p[find(i * n + j)] = find(i * n + j + 1);
        }
    }

    private void up(int i, int j) {
        if (i > 0 && (grid[i - 1][j] == 2 || grid[i - 1][j] == 3 || grid[i - 1][j] == 4)) {
            p[find(i * n + j)] = find((i - 1) * n + j);
        }
    }

    private void down(int i, int j) {
        if (i < m - 1 && (grid[i + 1][j] == 2 || grid[i + 1][j] == 5 || grid[i + 1][j] == 6)) {
            p[find(i * n + j)] = find((i + 1) * n + j);
        }
    }
}
```

### Python

```python
# Check if There is a Valid Path in a Grid：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def hasValidPath(self, grid: List[List[int]]) -> bool:
        m, n = len(grid), len(grid[0])
        p = list(range(m * n))

        def find(x):
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        def left(i, j):
            if j > 0 and grid[i][j - 1] in (1, 4, 6):
                p[find(i * n + j)] = find(i * n + j - 1)

        def right(i, j):
            if j < n - 1 and grid[i][j + 1] in (1, 3, 5):
                p[find(i * n + j)] = find(i * n + j + 1)

        def up(i, j):
            if i > 0 and grid[i - 1][j] in (2, 3, 4):
                p[find(i * n + j)] = find((i - 1) * n + j)

        def down(i, j):
            if i < m - 1 and grid[i + 1][j] in (2, 5, 6):
                p[find(i * n + j)] = find((i + 1) * n + j)

        for i in range(m):
            for j in range(n):
                e = grid[i][j]
                if e == 1:
                    left(i, j)
                    right(i, j)
                elif e == 2:
                    up(i, j)
                    down(i, j)
                elif e == 3:
                    left(i, j)
                    down(i, j)
                elif e == 4:
                    right(i, j)
                    down(i, j)
                elif e == 5:
                    left(i, j)
                    up(i, j)
                else:
                    right(i, j)
                    up(i, j)
        return find(0) == find(m * n - 1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

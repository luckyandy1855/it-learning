# 0827. Making A Large Island

---
编号: 827
题目: Making A Large Island
难度: 困难
标签: [深度优先搜索, 广度优先搜索, 并查集, 数组, 矩阵]
来源链接: https://leetcode.com/problems/making-a-large-island/
---

## 题目描述

给你一个大小为 `n x n` 二进制矩阵 `grid` 。**最多** 只能将一格 `0` 变成 `1` 。

返回执行此操作后，`grid` 中最大的岛屿面积是多少？

**岛屿** 由一组上、下、左、右四个方向相连的 `1` 形成。

示例 1:

```text
输入: grid = [[1, 0], [0, 1]]
输出: 3
解释: 将一格0变成1，最终连通两个小岛得到面积为 3 的岛屿。
```

示例 2:

```text
输入: grid = [[1, 1], [1, 0]]
输出: 4
解释: 将一格0变成1，岛屿的面积扩大为 4。
```

示例 3:

```text
输入: grid = [[1, 1], [1, 1]]
输出: 4
解释: 没有0可以让我们变成1，面积依然为 4。
```

**提示：**

- `n == grid.length`

- `n == grid[i].length`

- `1 <= n <= 500`

- `grid[i][j]` 为 `0` 或 `1`

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

我们可以给每个连通块一个唯一的标识，用数组 $p$ 记录每个位置所属的连通块，即 $p[i][j]$ 表示 $(i, j)$ 所属的连通块编号。用数组 $cnt$ 记录每个连通块的大小，即 $cnt[root]$ 表示连通块 $root$ 的大小。

首先，我们遍历整个矩阵，对于每个 $grid[i][j] = 1$ 且 $p[i][j] = 0$ 的位置，我们对其进行深度优先搜索，将其所属的连通块标记为 $root$，并统计连通块的大小。

接着，我们遍历整个矩阵，对于每个 $grid[i][j] = 0$ 的位置，我们找到其上、下、左、右四个位置所属的连通块，将这些连通块的大小相加，再加上当前位置的 $1$，即可得到将当前位置变为 $1$ 后的最大岛屿面积。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 为矩阵的边长。

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
// Making A Large Island：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largestIsland(grid [][]int) int {
	n := len(grid)
	p := make([][]int, n)
	for i := range p {
		p[i] = make([]int, n)
	}
	cnt := make([]int, n*n+1)
	dirs := []int{-1, 0, 1, 0, -1}
	root := 0
	ans := 0

	var dfs func(int, int) int
	dfs = func(i, j int) int {
		p[i][j] = root
		cnt[root]++
		for k := 0; k < 4; k++ {
			x := i + dirs[k]
			y := j + dirs[k+1]
			if x >= 0 && x < n && y >= 0 && y < n && grid[x][y] == 1 && p[x][y] == 0 {
				dfs(x, y)
			}
		}
		return cnt[root]
	}

	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			if grid[i][j] == 1 && p[i][j] == 0 {
				root++
				ans = max(ans, dfs(i, j))
			}
		}
	}

	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			if grid[i][j] == 0 {
				s := make(map[int]struct{})
				for k := 0; k < 4; k++ {
					x := i + dirs[k]
					y := j + dirs[k+1]
					if x >= 0 && x < n && y >= 0 && y < n {
						s[p[x][y]] = struct{}{}
					}
				}
				t := 1
				for x := range s {
					t += cnt[x]
				}
				ans = max(ans, t)
			}
		}
	}
	return ans
}
```

### Java

```java
// Making A Large Island：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;
    private int root;
    private int[] cnt;
    private int[][] p;
    private int[][] grid;
    private final int[] dirs = {-1, 0, 1, 0, -1};

    public int largestIsland(int[][] grid) {
        n = grid.length;
        p = new int[n][n];
        this.grid = grid;
        cnt = new int[n * n + 1];
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 1 && p[i][j] == 0) {
                    ++root;
                    ans = Math.max(ans, dfs(i, j));
                }
            }
        }
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 0) {
                    Set<Integer> s = new HashSet<>();
                    for (int k = 0; k < 4; ++k) {
                        int x = i + dirs[k];
                        int y = j + dirs[k + 1];
                        if (x >= 0 && x < n && y >= 0 && y < n) {
                            s.add(p[x][y]);
                        }
                    }
                    int t = 1;
                    for (int x : s) {
                        t += cnt[x];
                    }
                    ans = Math.max(ans, t);
                }
            }
        }
        return ans;
    }

    private int dfs(int i, int j) {
        p[i][j] = root;
        ++cnt[root];
        for (int k = 0; k < 4; ++k) {
            int x = i + dirs[k];
            int y = j + dirs[k + 1];
            if (x >= 0 && x < n && y >= 0 && y < n && grid[x][y] == 1 && p[x][y] == 0) {
                dfs(x, y);
            }
        }
        return cnt[root];
    }
}
```

### Python

```python
# Making A Large Island：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def largestIsland(self, grid: List[List[int]]) -> int:
        def dfs(i: int, j: int):
            p[i][j] = root
            cnt[root] += 1
            for a, b in pairwise(dirs):
                x, y = i + a, j + b
                if 0 <= x < n and 0 <= y < n and grid[x][y] and p[x][y] == 0:
                    dfs(x, y)

        n = len(grid)
        cnt = Counter()
        p = [[0] * n for _ in range(n)]
        dirs = (-1, 0, 1, 0, -1)
        root = 0
        for i, row in enumerate(grid):
            for j, x in enumerate(row):
                if x and p[i][j] == 0:
                    root += 1
                    dfs(i, j)
        ans = max(cnt.values() or [0])
        for i, row in enumerate(grid):
            for j, x in enumerate(row):
                if x == 0:
                    s = set()
                    for a, b in pairwise(dirs):
                        x, y = i + a, j + b
                        if 0 <= x < n and 0 <= y < n:
                            s.add(p[x][y])
                    ans = max(ans, sum(cnt[root] for root in s) + 1)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

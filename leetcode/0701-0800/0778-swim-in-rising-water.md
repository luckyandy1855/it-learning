# 0778. Swim in Rising Water

---
编号: 778
题目: Swim in Rising Water
难度: 困难
标签: [深度优先搜索, 广度优先搜索, 并查集, 数组, 二分查找, 矩阵, 堆（优先队列）]
来源链接: https://leetcode.com/problems/swim-in-rising-water/
---

## 题目描述

在一个 `n x n` 的整数矩阵 `grid` 中，每一个方格的值 `grid[i][j]` 表示位置 `(i, j)` 的平台高度。

当开始下雨时，在时间为 `t` 时，水池中的水位为 `t` 。你可以从一个平台游向四周相邻的任意一个平台，但是前提是此时水位必须同时淹没这两个平台。假定你可以瞬间移动无限距离，也就是默认在方格内部游动是不耗时的。当然，在你游泳的时候你必须待在坐标方格里面。

你从坐标方格的左上平台 `(0，0)` 出发。返回 *你到达坐标方格的右下平台 `(n-1, n-1)` 所需的最少时间 。*

**示例 1:**

```text
输入: grid = [[0,2],[1,3]]
输出: 3
解释:
时间为0时，你位于坐标方格的位置为 (0, 0)。
此时你不能游向任意方向，因为四个相邻方向平台的高度都大于当前时间为 0 时的水位。
等时间到达 3 时，你才可以游向平台 (1, 1). 因为此时的水位是 3，坐标方格中的平台没有比水位 3 更高的，所以你可以游向坐标方格中的任意位置
```

**示例 2:**

```text
输入: grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]
输出: 16
解释: 最终的路线用加粗进行了标记。
我们必须等到时间为 16，此时才能保证平台 (0, 0) 和 (4, 4) 是连通的
```

**提示:**

- `n == grid.length`

- `n == grid[i].length`

- `1 <= n <= 50`

- `0 <= grid[i][j] < n^2`

- `grid[i][j]` 中每个值 **均无重复**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 并查集, 数组, 二分查找, 矩阵, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以将每个位置 $(i, j)$ 映射为一个编号 $id = i \times n + j$，并使用并查集维护连通分量。

我们首先用一个一维数组 $hi$ 记录每个高度对应的位置编号，即 $hi[h]$ 表示高度为 $h$ 的位置编号。

然后我们从高度 $0$ 开始遍历到高度 $n^2 - 1$，对于每个高度 $t$，我们将位置 $hi[t]$ 与其四个相邻且高度不超过 $t$ 的位置进行合并。如果合并后，位置 $0$ 和位置 $n^2 - 1$ 连通了，那么我们就找到了最小的时间 $t$，返回 $t$ 即可。

时间复杂度 $O(n^2 \times \log n)$，空间复杂度 $O(n^2)$。其中 $n$ 是矩阵的边长。

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
// Swim in Rising Water：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func swimInWater(grid [][]int) int {
	n := len(grid)
	m := n * n
	p := make([]int, m)
	for i := range p {
		p[i] = i
	}
	var find func(int) int
	find = func(x int) int {
		if p[x] != x {
			p[x] = find(p[x])
		}
		return p[x]
	}
	hi := make([]int, m)
	for i := range grid {
		for j, h := range grid[i] {
			hi[h] = i*n + j
		}
	}
	dirs := []int{-1, 0, 1, 0, -1}
	for t := 0; t < m; t++ {
		id := hi[t]
		x, y := id/n, id%n
		for k := 0; k < 4; k++ {
			nx, ny := x+dirs[k], y+dirs[k+1]
			if nx >= 0 && nx < n && ny >= 0 && ny < n && grid[nx][ny] <= t {
				a := find(x*n + y)
				b := find(nx*n + ny)
				p[a] = b
			}
		}
		if find(0) == find(m-1) {
			return t
		}
	}
	return 0
}
```

### Java

```java
// Swim in Rising Water：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int swimInWater(int[][] grid) {
        int n = grid.length;
        int m = n * n;
        int[] p = new int[m];
        Arrays.setAll(p, i -> i);
        IntUnaryOperator find = new IntUnaryOperator() {
            @Override
            public int applyAsInt(int x) {
                if (p[x] != x) p[x] = applyAsInt(p[x]);
                return p[x];
            }
        };

        int[] hi = new int[m];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                hi[grid[i][j]] = i * n + j;
            }
        }

        int[] dirs = {-1, 0, 1, 0, -1};

        for (int t = 0; t < m; t++) {
            int id = hi[t];
            int x = id / n, y = id % n;
            for (int k = 0; k < 4; k++) {
                int nx = x + dirs[k], ny = y + dirs[k + 1];
                if (nx >= 0 && nx < n && ny >= 0 && ny < n && grid[nx][ny] <= t) {
                    int a = find.applyAsInt(x * n + y);
                    int b = find.applyAsInt(nx * n + ny);
                    p[a] = b;
                }
            }
            if (find.applyAsInt(0) == find.applyAsInt(m - 1)) {
                return t;
            }
        }
        return 0;
    }
}
```

### Python

```python
# Swim in Rising Water：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        def find(x: int) -> int:
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        n = len(grid)
        m = n * n
        p = list(range(m))
        hi = [0] * m
        for i, row in enumerate(grid):
            for j, h in enumerate(row):
                hi[h] = i * n + j
        dirs = (-1, 0, 1, 0, -1)
        for t in range(m):
            x, y = divmod(hi[t], n)
            for dx, dy in pairwise(dirs):
                nx, ny = x + dx, y + dy
                if 0 <= nx < n and 0 <= ny < n and grid[nx][ny] <= t:
                    p[find(x * n + y)] = find(nx * n + ny)
            if find(0) == find(m - 1):
                return t
        return 0
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

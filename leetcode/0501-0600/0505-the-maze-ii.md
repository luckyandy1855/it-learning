# 0505. The Maze II

---
编号: 505
题目: The Maze II
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 图, 数组, 矩阵, 最短路, 堆（优先队列）]
来源链接: https://leetcode.com/problems/the-maze-ii/
---

## 题目描述

**迷宫**中有一个球，它有空地 (表示为 `0`) 和墙 (表示为 `1`)。球可以**向上**、**向下**、**向左**或**向右**滚过空地，但直到撞上墙之前它都不会停止滚动。当球停止时，它才可以选择下一个滚动方向。

给定 `m × n` 的**迷宫**(`maze`)，球的**起始位置 **(`start = [startrow, startcol]`) 和**目的地 **(`destination = [destinationrow, destinationcol]`)，返回球在**目的地 **(`destination`) 停止的最短**距离**。如果球不能在**目的地 **(`destination`) 停止，返回 `-1`。

**距离**是指球从起始位置 ( 不包括 ) 到终点 ( 包括 ) 所经过的**空地**数。

你可以假设**迷宫的边界都是墙 **( 见例子 )。

**示例 1:**

```text
输入: maze = [[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start = [0,4], destination = [4,4]
输出: 12
解析: 一条最短路径 : left -> down -> left -> down -> right -> down -> right。
             总距离为 1 + 1 + 3 + 1 + 2 + 2 + 2 = 12。
```

**示例 2:**

```text
输入: maze = [[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start = [0,4], destination = [3,2]
输出: -1
解析: 球不可能在目的地停下来。注意，你可以经过目的地，但不能在那里停下来。
```

**示例 3:**

```text
输入: maze = [[0,0,0,0,0],[1,1,0,0,1],[0,0,0,0,0],[0,1,0,0,1],[0,1,0,0,0]], start = [4,3], destination = [0,1]
输出: -1
```

**注意:**

- `m == maze.length`

- `n == maze[i].length`

- `1 row, destinationrow col, destinationcol 迷宫**至少包含两个空地**。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 图, 数组, 矩阵, 最短路, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个二维数组 $dist$，其中 $dist[i][j]$ 表示从起始位置到达 $(i,j)$ 的最短路径长度。初始时，$dist$ 中的所有元素都被初始化为一个很大的数，除了起始位置，因为起始位置到自身的距离是 $0$。

然后，我们定义一个队列 $q$，将起始位置加入队列。随后不断进行以下操作：弹出队列中的首元素，将其四个方向上可以到达的位置加入队列中，并且在 $dist$ 中记录这些位置的距离，直到队列为空。

最后，如果终点位置的距离仍然是一个很大的数，说明从起始位置无法到达终点位置，返回 $-1$，否则返回终点位置的距离。

时间复杂度 $O(m \times n \times \max(m, n))$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是迷宫的行数和列数。

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
// The Maze II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shortestDistance(maze [][]int, start []int, destination []int) int {
	m, n := len(maze), len(maze[0])
	dist := make([][]int, m)
	const inf = 1 << 30
	for i := range dist {
		dist[i] = make([]int, n)
		for j := range dist[i] {
			dist[i][j] = inf
		}
	}
	dist[start[0]][start[1]] = 0
	q := [][]int{start}
	dirs := [5]int{-1, 0, 1, 0, -1}
	for len(q) > 0 {
		p := q[0]
		q = q[1:]
		i, j := p[0], p[1]
		for d := 0; d < 4; d++ {
			x, y, k := i, j, dist[i][j]
			a, b := dirs[d], dirs[d+1]
			for x+a >= 0 && x+a < m && y+b >= 0 && y+b < n && maze[x+a][y+b] == 0 {
				x, y, k = x+a, y+b, k+1
			}
			if k < dist[x][y] {
				dist[x][y] = k
				q = append(q, []int{x, y})
			}
		}
	}
	di, dj := destination[0], destination[1]
	if dist[di][dj] == inf {
		return -1
	}
	return dist[di][dj]
}
```

### Java

```java
// The Maze II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int shortestDistance(int[][] maze, int[] start, int[] destination) {
        int m = maze.length, n = maze[0].length;
        final int inf = 1 << 30;
        int[][] dist = new int[m][n];
        for (var row : dist) {
            Arrays.fill(row, inf);
        }
        int si = start[0], sj = start[1];
        int di = destination[0], dj = destination[1];
        dist[si][sj] = 0;
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[] {si, sj});
        int[] dirs = {-1, 0, 1, 0, -1};
        while (!q.isEmpty()) {
            var p = q.poll();
            int i = p[0], j = p[1];
            for (int d = 0; d < 4; ++d) {
                int x = i, y = j, k = dist[i][j];
                int a = dirs[d], b = dirs[d + 1];
                while (
                    x + a >= 0 && x + a < m && y + b >= 0 && y + b < n && maze[x + a][y + b] == 0) {
                    x += a;
                    y += b;
                    ++k;
                }
                if (k < dist[x][y]) {
                    dist[x][y] = k;
                    q.offer(new int[] {x, y});
                }
            }
        }
        return dist[di][dj] == inf ? -1 : dist[di][dj];
    }
}
```

### Python

```python
# The Maze II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shortestDistance(
        self, maze: List[List[int]], start: List[int], destination: List[int]
    ) -> int:
        m, n = len(maze), len(maze[0])
        dirs = (-1, 0, 1, 0, -1)
        si, sj = start
        di, dj = destination
        q = deque([(si, sj)])
        dist = [[inf] * n for _ in range(m)]
        dist[si][sj] = 0
        while q:
            i, j = q.popleft()
            for a, b in pairwise(dirs):
                x, y, k = i, j, dist[i][j]
                while 0 <= x + a < m and 0 <= y + b < n and maze[x + a][y + b] == 0:
                    x, y, k = x + a, y + b, k + 1
                if k < dist[x][y]:
                    dist[x][y] = k
                    q.append((x, y))
        return -1 if dist[di][dj] == inf else dist[di][dj]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

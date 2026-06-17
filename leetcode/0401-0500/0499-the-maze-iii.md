# 0499. The Maze III

---
编号: 499
题目: The Maze III
难度: 困难
标签: [深度优先搜索, 广度优先搜索, 图, 数组, 字符串, 矩阵, 最短路, 堆（优先队列）]
来源链接: https://leetcode.com/problems/the-maze-iii/
---

## 题目描述

由空地和墙组成的迷宫中有一个**球**。球可以向**上（u）下（d）左（l）右（r）**四个方向滚动，但在遇到墙壁前不会停止滚动。当球停下时，可以选择下一个方向（必须与上一个选择的方向不同）。迷宫中还有一个**洞**，当球运动经过洞时，就会掉进洞里。

给定球的**起始位置，目的地**和**迷宫**，找出让球以最短距离掉进洞里的路径。 距离的定义是球从起始位置（不包括）到目的地（包括）经过的**空地**个数。通过'u', 'd', 'l' 和 'r'输出球的移动**方向**。 由于可能有多条最短路径， 请输出**字典序最小**的路径**。**如果球无法进入洞，输出"impossible"。

迷宫由一个0和1的二维数组表示。 1表示墙壁，0表示空地。你可以假定迷宫的边缘都是墙壁。起始位置和目的地的坐标通过行号和列号给出。

**示例1:**

```text
输入 1: 迷宫由以下二维数组表示

0 0 0 0 0
1 1 0 0 1
0 0 0 0 0
0 1 0 0 1
0 1 0 0 0

输入 2: 球的初始位置 (rowBall, colBall) = (4, 3)
输入 3: 洞的位置 (rowHole, colHole) = (0, 1)

输出: "lul"

解析: 有两条让球进洞的最短路径。
第一条路径是 左 -> 上 -> 左, 记为 "lul".
第二条路径是 上 -> 左, 记为 'ul'.
两条路径都具有最短距离6, 但'l'
```

**示例 2:**

```text
输入 1: 迷宫由以下二维数组表示

0 0 0 0 0
1 1 0 0 1
0 0 0 0 0
0 1 0 0 1
0 1 0 0 0

输入 2: 球的初始位置 (rowBall, colBall) = (4, 3)
输入 3: 洞的位置 (rowHole, colHole) = (3, 0)

输出: "impossible"

示例: 球无法到达洞。
```

示例 3：

```text
输入：maze = [[0,0,0,0,0,0,0],[0,0,1,0,0,1,0],[0,0,0,0,1,0,0],[0,0,0,0,0,0,1]], ball = [0,4], hole = [3,5]
输出："dldr"
```

**提示：**

- `m == maze.length`

- `n == maze[i].length`

- `1 row, holerow col, holecol <= n`

- 球和洞都存在于一个空地中，它们最初不会处于同一位置。

- 迷宫中至少有 `2` 个空地。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 图, 数组, 字符串, 矩阵, 最短路, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
// The Maze III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import "math"

func findShortestWay(maze [][]int, ball []int, hole []int) string {
	m, n := len(maze), len(maze[0])
	r, c := ball[0], ball[1]
	rh, ch := hole[0], hole[1]
	q := [][]int{[]int{r, c}}
	dist := make([][]int, m)
	path := make([][]string, m)
	for i := range dist {
		dist[i] = make([]int, n)
		path[i] = make([]string, n)
		for j := range dist[i] {
			dist[i][j] = math.MaxInt32
			path[i][j] = ""
		}
	}
	dist[r][c] = 0
	dirs := map[string][]int{"u": {-1, 0}, "d": {1, 0}, "l": {0, -1}, "r": {0, 1}}
	for len(q) > 0 {
		p := q[0]
		q = q[1:]
		i, j := p[0], p[1]
		for d, dir := range dirs {
			a, b := dir[0], dir[1]
			x, y := i, j
			step := dist[i][j]
			for x+a >= 0 && x+a < m && y+b >= 0 && y+b < n && maze[x+a][y+b] == 0 && (x != rh || y != ch) {
				x += a
				y += b
				step++
			}
			if dist[x][y] > step || (dist[x][y] == step && (path[i][j]+d) < path[x][y]) {
				dist[x][y] = step
				path[x][y] = path[i][j] + d
				if x != rh || y != ch {
					q = append(q, []int{x, y})
				}
			}
		}
	}
	if path[rh][ch] == "" {
		return "impossible"
	}
	return path[rh][ch]
}
```

### Java

```java
// The Maze III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String findShortestWay(int[][] maze, int[] ball, int[] hole) {
        int m = maze.length;
        int n = maze[0].length;
        int r = ball[0], c = ball[1];
        int rh = hole[0], ch = hole[1];
        Deque<int[]> q = new LinkedList<>();
        q.offer(new int[] {r, c});
        int[][] dist = new int[m][n];
        for (int i = 0; i < m; ++i) {
            Arrays.fill(dist[i], Integer.MAX_VALUE);
        }
        dist[r][c] = 0;
        String[][] path = new String[m][n];
        path[r][c] = "";
        int[][] dirs = {{-1, 0, 'u'}, {1, 0, 'd'}, {0, -1, 'l'}, {0, 1, 'r'}};
        while (!q.isEmpty()) {
            int[] p = q.poll();
            int i = p[0], j = p[1];
            for (int[] dir : dirs) {
                int a = dir[0], b = dir[1];
                String d = String.valueOf((char) (dir[2]));
                int x = i, y = j;
                int step = dist[i][j];
                while (x + a >= 0 && x + a < m && y + b >= 0 && y + b < n && maze[x + a][y + b] == 0
                    && (x != rh || y != ch)) {
                    x += a;
                    y += b;
                    ++step;
                }
                if (dist[x][y] > step
                    || (dist[x][y] == step && (path[i][j] + d).compareTo(path[x][y]) < 0)) {
                    dist[x][y] = step;
                    path[x][y] = path[i][j] + d;
                    if (x != rh || y != ch) {
                        q.offer(new int[] {x, y});
                    }
                }
            }
        }
        return path[rh][ch] == null ? "impossible" : path[rh][ch];
    }
}
```

### Python

```python
# The Maze III：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findShortestWay(
        self, maze: List[List[int]], ball: List[int], hole: List[int]
    ) -> str:
        m, n = len(maze), len(maze[0])
        r, c = ball
        rh, ch = hole
        q = deque([(r, c)])
        dist = [[inf] * n for _ in range(m)]
        dist[r][c] = 0
        path = [[None] * n for _ in range(m)]
        path[r][c] = ''
        while q:
            i, j = q.popleft()
            for a, b, d in [(-1, 0, 'u'), (1, 0, 'd'), (0, -1, 'l'), (0, 1, 'r')]:
                x, y, step = i, j, dist[i][j]
                while (
                    0 <= x + a < m
                    and 0 <= y + b < n
                    and maze[x + a][y + b] == 0
                    and (x != rh or y != ch)
                ):
                    x, y = x + a, y + b
                    step += 1
                if dist[x][y] > step or (
                    dist[x][y] == step and path[i][j] + d < path[x][y]
                ):
                    dist[x][y] = step
                    path[x][y] = path[i][j] + d
                    if x != rh or y != ch:
                        q.append((x, y))
        return path[rh][ch] or 'impossible'
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

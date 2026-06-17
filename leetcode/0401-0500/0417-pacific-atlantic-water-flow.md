# 0417. Pacific Atlantic Water Flow

---
编号: 417
题目: Pacific Atlantic Water Flow
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 数组, 矩阵]
来源链接: https://leetcode.com/problems/pacific-atlantic-water-flow/
---

## 题目描述

有一个 `m × n` 的矩形岛屿，与 **太平洋** 和 **大西洋** 相邻。 **“太平洋” **处于大陆的左边界和上边界，而 **“大西洋”** 处于大陆的右边界和下边界。

这个岛被分割成一个由若干方形单元格组成的网格。给定一个 `m x n` 的整数矩阵 `heights` ， `heights[r][c]` 表示坐标 `(r, c)` 上单元格 **高于海平面的高度** 。

岛上雨水较多，如果相邻单元格的高度 **小于或等于** 当前单元格的高度，雨水可以直接向北、南、东、西流向相邻单元格。水可以从海洋附近的任何单元格流入海洋。

返回网格坐标 `result` 的 **2D 列表** ，其中 `result[i] = [ri, ci]` 表示雨水从单元格 `(ri, ci)` 流动 **既可流向太平洋也可流向大西洋** 。

**示例 1：**

```text
输入: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
输出: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
```

**示例 2：**

```text
输入: heights = [[2,1],[1,2]]
输出: [[0,0],[0,1],[1,0],[1,1]]
```

**提示：**

- `m == heights.length`

- `n == heights[r].length`

- `1 <= m, n <= 200`

- `0 <= heights[r][c] <= 10^5`

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

我们可以从太平洋和大西洋的边界出发，分别进行广度优先搜索（BFS），找到所有能够流向太平洋和大西洋的单元格。最后，我们取两个结果的交集，即为既能流向太平洋又能流向大西洋的单元格。

具体地，我们定义一个队列 $q_1$ 来存储所有与太平洋相邻的单元格，并定义一个布尔矩阵 $vis_1$ 来记录哪些单元格能够流向太平洋。类似地，我们定义队列 $q_2$ 和布尔矩阵 $vis_2$ 来处理大西洋。初始时，我们将所有与太平洋相邻的单元格加入队列 $q_1$，并将它们在 $vis_1$ 中标记为已访问。同样地，将所有与大西洋相邻的单元格加入队列 $q_2$，并在 $vis_2$ 中标记为已访问。

然后，我们分别对 $q_1$ 和 $q_2$ 进行 BFS。在每次 BFS 中，我们从队列中取出一个单元格 $(x, y)$，并检查它的四个相邻单元格 $(nx, ny)$。如果相邻单元格在矩阵范围内，且未被访问过，并且其高度不小于当前单元格的高度（即水可以流向该单元格），我们将其加入队列并标记为已访问。

最后，我们遍历整个矩阵，找出同时在 $vis_1$ 和 $vis_2$ 中被标记为已访问的单元格，这些单元格即为答案。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

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
// Pacific Atlantic Water Flow：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func pacificAtlantic(heights [][]int) [][]int {
	m, n := len(heights), len(heights[0])
	vis1 := make([][]bool, m)
	vis2 := make([][]bool, m)
	for i := range vis1 {
		vis1[i] = make([]bool, n)
		vis2[i] = make([]bool, n)
	}
	q1, q2 := [][2]int{}, [][2]int{}
	dirs := [5]int{-1, 0, 1, 0, -1}

	for i := 0; i < m; i++ {
		q1 = append(q1, [2]int{i, 0})
		vis1[i][0] = true
		q2 = append(q2, [2]int{i, n - 1})
		vis2[i][n-1] = true
	}
	for j := 0; j < n; j++ {
		q1 = append(q1, [2]int{0, j})
		vis1[0][j] = true
		q2 = append(q2, [2]int{m - 1, j})
		vis2[m-1][j] = true
	}

	bfs := func(q [][2]int, vis [][]bool) {
		for len(q) > 0 {
			x, y := q[0][0], q[0][1]
			q = q[1:]
			for k := 0; k < 4; k++ {
				nx, ny := x+dirs[k], y+dirs[k+1]
				if nx >= 0 && nx < m && ny >= 0 && ny < n &&
					!vis[nx][ny] && heights[nx][ny] >= heights[x][y] {
					vis[nx][ny] = true
					q = append(q, [2]int{nx, ny})
				}
			}
		}
	}

	bfs(q1, vis1)
	bfs(q2, vis2)

	var ans [][]int
	for i := 0; i < m; i++ {
		for j := 0; j < n; j++ {
			if vis1[i][j] && vis2[i][j] {
				ans = append(ans, []int{i, j})
			}
		}
	}
	return ans
}
```

### Java

```java
// Pacific Atlantic Water Flow：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        int m = heights.length, n = heights[0].length;
        boolean[][] vis1 = new boolean[m][n];
        boolean[][] vis2 = new boolean[m][n];
        Deque<int[]> q1 = new ArrayDeque<>();
        Deque<int[]> q2 = new ArrayDeque<>();
        int[] dirs = {-1, 0, 1, 0, -1};

        for (int i = 0; i < m; ++i) {
            q1.offer(new int[] {i, 0});
            vis1[i][0] = true;
            q2.offer(new int[] {i, n - 1});
            vis2[i][n - 1] = true;
        }
        for (int j = 0; j < n; ++j) {
            q1.offer(new int[] {0, j});
            vis1[0][j] = true;
            q2.offer(new int[] {m - 1, j});
            vis2[m - 1][j] = true;
        }

        BiConsumer<Deque<int[]>, boolean[][]> bfs = (q, vis) -> {
            while (!q.isEmpty()) {
                var cell = q.poll();
                int x = cell[0], y = cell[1];
                for (int k = 0; k < 4; ++k) {
                    int nx = x + dirs[k], ny = y + dirs[k + 1];
                    if (nx >= 0 && nx < m && ny >= 0 && ny < n && !vis[nx][ny]
                        && heights[nx][ny] >= heights[x][y]) {
                        vis[nx][ny] = true;
                        q.offer(new int[] {nx, ny});
                    }
                }
            }
        };

        bfs.accept(q1, vis1);
        bfs.accept(q2, vis2);

        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (vis1[i][j] && vis2[i][j]) {
                    ans.add(List.of(i, j));
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Pacific Atlantic Water Flow：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        def bfs(q: Deque[Tuple[int, int]], vis: List[List[bool]]) -> None:
            while q:
                x, y = q.popleft()
                for dx, dy in pairwise(dirs):
                    nx, ny = x + dx, y + dy
                    if (
                        0 <= nx < m
                        and 0 <= ny < n
                        and not vis[nx][ny]
                        and heights[nx][ny] >= heights[x][y]
                    ):
                        vis[nx][ny] = True
                        q.append((nx, ny))

        m, n = len(heights), len(heights[0])
        vis1 = [[False] * n for _ in range(m)]
        vis2 = [[False] * n for _ in range(m)]
        q1: Deque[Tuple[int, int]] = deque()
        q2: Deque[Tuple[int, int]] = deque()
        dirs = (-1, 0, 1, 0, -1)

        for i in range(m):
            q1.append((i, 0))
            vis1[i][0] = True
            q2.append((i, n - 1))
            vis2[i][n - 1] = True

        for j in range(n):
            q1.append((0, j))
            vis1[0][j] = True
            q2.append((m - 1, j))
            vis2[m - 1][j] = True

        bfs(q1, vis1)
        bfs(q2, vis2)

        return [(i, j) for i in range(m) for j in range(n) if vis1[i][j] and vis2[i][j]]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

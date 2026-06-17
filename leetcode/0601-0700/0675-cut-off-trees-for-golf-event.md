# 0675. Cut Off Trees for Golf Event

---
编号: 675
题目: Cut Off Trees for Golf Event
难度: 困难
标签: [广度优先搜索, 数组, 矩阵, 堆（优先队列）]
来源链接: https://leetcode.com/problems/cut-off-trees-for-golf-event/
---

## 题目描述

你被请来给一个要举办高尔夫比赛的树林砍树。树林由一个 `m x n` 的矩阵表示， 在这个矩阵中：

- `0` 表示障碍，无法触碰

- `1` 表示地面，可以行走

- `比 1 大的数` 表示有树的单元格，可以行走，数值表示树的高度

每一步，你都可以向上、下、左、右四个方向之一移动一个单位，如果你站的地方有一棵树，那么你可以决定是否要砍倒它。

你需要按照树的高度从低向高砍掉所有的树，每砍过一颗树，该单元格的值变为 `1`（即变为地面）。

你将从 `(0, 0)` 点开始工作，返回你砍完所有树需要走的最小步数。 如果你无法砍完所有的树，返回 `-1` 。

可以保证的是，没有两棵树的高度是相同的，并且你至少需要砍倒一棵树。

**示例 1：**

```text
输入：forest = [[1,2,3],[0,0,4],[7,6,5]]
输出：6
解释：沿着上面的路径，你可以用 6 步，按从最矮到最高的顺序砍掉这些树。
```

**示例 2：**

```text
输入：forest = [[1,2,3],[0,0,0],[7,6,5]]
输出：-1
解释：由于中间一行被障碍阻塞，无法访问最下面一行中的树。
```

**示例 3：**

```text
输入：forest = [[2,3,4],[0,0,5],[8,7,6]]
输出：6
解释：可以按与示例 1 相同的路径来砍掉所有的树。
(0,0) 位置的树，可以直接砍去，不用算步数。
```

**提示：**

- `m == forest.length`

- `n == forest[i].length`

- `1 <= m, n <= 50`

- `0 <= forest[i][j] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「广度优先搜索, 数组, 矩阵, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目的一个关键信息是“所有树的高度都不同”，要按照从小到大的顺序依次砍树，因此，我们先遍历树林，找出所有树及对应的坐标点。然后将树按照高度升序排列。

接下来就是找相邻两个点之间的最短距离。可以用 BFS，A\* 算法优化搜索。

A\* 算法主要思想如下：

1. 将 BFS 队列转换为优先队列（小根堆）；
1. 队列中的每个元素为 `(dist[state] + f(state), state)`，`dist[state]` 表示从起点到当前 state 的距离，`f(state)` 表示从当前 state 到终点的估计距离，这两个距离之和作为堆排序的依据；
1. 当终点第一次出队时，说明找到了从起点到终点的最短路径，直接返回对应的 step；
1. `f(state)` 是估价函数，并且估价函数要满足 `f(state) <= g(state)`，其中 `g(state)` 表示 state 到终点的真实距离；
1. A\* 算法只能保证终点第一次出队时，即找到了一条从起点到终点的最小路径，不能保证其他点出队时也是从起点到当前点的最短路径。

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
// Cut Off Trees for Golf Event：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
var dirs = [][]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

type tree struct {
	height int
	pos    int
}

func cutOffTree(forest [][]int) int {
	row, col := len(forest), len(forest[0])

	bfs := func(start, end int) int {
		q := []int{start}
		vis := make(map[int]bool)
		vis[start] = true
		step := 0
		for n := len(q); n > 0; n = len(q) {
			for i := 0; i < n; i++ {
				state := q[0]
				q = q[1:]
				if state == end {
					return step
				}
				for k := 0; k < 4; k++ {
					x, y := state/col+dirs[k][0], state%col+dirs[k][1]
					nxt := x*col + y
					if x >= 0 && x < row && y >= 0 && y < col && forest[x][y] != 0 && !vis[nxt] {
						q = append(q, nxt)
						vis[nxt] = true
					}
				}
			}
			step++
		}
		return -1
	}

	var trees []tree
	for i := 0; i < row; i++ {
		for j := 0; j < col; j++ {
			if forest[i][j] > 1 {
				trees = append(trees, tree{forest[i][j], i*col + j})
			}
		}
	}
	sort.Slice(trees, func(i, j int) bool {
		return trees[i].height < trees[j].height
	})

	ans, start := 0, 0
	for _, t := range trees {
		end := t.pos
		step := bfs(start, end)
		if step == -1 {
			return -1
		}
		ans += step
		start = end
	}
	return ans
}
```

### Java

```java
// Cut Off Trees for Golf Event：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] dist = new int[3600];
    private List<List<Integer>> forest;
    private int m;
    private int n;

    public int cutOffTree(List<List<Integer>> forest) {
        this.forest = forest;
        m = forest.size();
        n = forest.get(0).size();
        List<int[]> trees = new ArrayList<>();
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (forest.get(i).get(j) > 1) {
                    trees.add(new int[] {forest.get(i).get(j), i * n + j});
                }
            }
        }
        trees.sort(Comparator.comparingInt(a -> a[0]));
        int ans = 0;
        int start = 0;
        for (int[] tree : trees) {
            int end = tree[1];
            int t = bfs(start, end);
            if (t == -1) {
                return -1;
            }
            ans += t;
            start = end;
        }
        return ans;
    }

    private int bfs(int start, int end) {
        PriorityQueue<int[]> q = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        q.offer(new int[] {f(start, end), start});
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[start] = 0;
        int[] dirs = {-1, 0, 1, 0, -1};
        while (!q.isEmpty()) {
            int state = q.poll()[1];
            if (state == end) {
                return dist[state];
            }
            for (int k = 0; k < 4; ++k) {
                int x = state / n + dirs[k];
                int y = state % n + dirs[k + 1];
                if (x >= 0 && x < m && y >= 0 && y < n && forest.get(x).get(y) > 0) {
                    if (dist[x * n + y] > dist[state] + 1) {
                        dist[x * n + y] = dist[state] + 1;
                        q.offer(new int[] {dist[x * n + y] + f(x * n + y, end), x * n + y});
                    }
                }
            }
        }
        return -1;
    }

    private int f(int start, int end) {
        int a = start / n;
        int b = start % n;
        int c = end / n;
        int d = end % n;
        return Math.abs(a - c) + Math.abs(b - d);
    }
}
```

### Python

```python
# Cut Off Trees for Golf Event：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def cutOffTree(self, forest: List[List[int]]) -> int:
        def f(i, j, x, y):
            return abs(i - x) + abs(j - y)

        def bfs(i, j, x, y):
            q = [(f(i, j, x, y), i, j)]
            dist = {i * n + j: 0}
            while q:
                _, i, j = heappop(q)
                step = dist[i * n + j]
                if (i, j) == (x, y):
                    return step
                for a, b in [[0, -1], [0, 1], [-1, 0], [1, 0]]:
                    c, d = i + a, j + b
                    if 0 <= c < m and 0 <= d < n and forest[c][d] > 0:
                        if c * n + d not in dist or dist[c * n + d] > step + 1:
                            dist[c * n + d] = step + 1
                            heappush(q, (dist[c * n + d] + f(c, d, x, y), c, d))
            return -1

        m, n = len(forest), len(forest[0])
        trees = [
            (forest[i][j], i, j) for i in range(m) for j in range(n) if forest[i][j] > 1
        ]
        trees.sort()
        i = j = 0
        ans = 0
        for _, x, y in trees:
            t = bfs(i, j, x, y)
            if t == -1:
                return -1
            ans += t
            i, j = x, y
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

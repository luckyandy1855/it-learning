# 0882. Reachable Nodes In Subdivided Graph

---
编号: 882
题目: Reachable Nodes In Subdivided Graph
难度: 困难
标签: [图, 最短路, 堆（优先队列）]
来源链接: https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/
---

## 题目描述

给你一个无向图（**原始图**），图中有 `n` 个节点，编号从 `0` 到 `n - 1` 。你决定将图中的每条边 **细分** 为一条节点链，每条边之间的新节点数各不相同。

图用由边组成的二维数组 `edges` 表示，其中 `edges[i] = [ui, vi, cnti]` 表示原始图中节点 `ui` 和 `vi` 之间存在一条边，`cnti` 是将边 **细分** 后的新节点总数。注意，`cnti == 0` 表示边不可细分。

要 **细分** 边 `[ui, vi]` ，需要将其替换为 `(cnti + 1)` 条新边，和 `cnti` 个新节点。新节点为 `x1`, `x2`, ..., `xcnti` ，新边为 `[ui, x1]`, `[x1, x2]`, `[x2, x3]`, ..., `[xcnti-1, xcnti]`, `[xcnti, vi]` 。

现在得到一个 **新的细分图** ，请你计算从节点 `0` 出发，可以到达多少个节点？如果节点间距离是 `maxMoves` 或更少，则视为 **可以到达** 。

给你原始图和 `maxMoves` ，返回 *新的细分图中从节点 `0` 出发**** 可到达的节点数*** 。

**示例 1：**

```text
输入：edges = [[0,1,10],[0,2,1],[1,2,2]], maxMoves = 6, n = 3
输出：13
解释：边的细分情况如上图所示。
可以到达的节点已经用黄色标注出来。
```

**示例 2：**

```text
输入：edges = [[0,1,4],[1,2,6],[0,2,8],[1,3,1]], maxMoves = 10, n = 4
输出：23
```

**示例 3：**

```text
输入：edges = [[1,2,4],[1,4,5],[1,3,1],[2,3,4],[3,4,5]], maxMoves = 17, n = 5
输出：1
解释：节点 0 与图的其余部分没有连通，所以只有节点 0 可以到达。
```

**提示：**

- `0 i i i <= 10^4`

- `0 <= maxMoves <= 10^9`

- `1 <= n <= 3000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「图, 最短路, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

这道题本质是求从节点 $0$ 出发，最多经过 $maxMoves$ 步，可以到达多少个节点。单源最短路，且边权非负，我们可以考虑使用 Dijkstra 算法。

根据题目描述，节点 $u_i$ 到节点 $v_i$ 之间存在 $cnt_i$ 个新节点，那么节点 $u_i$ 到节点 $v_i$ 的距离为 $cnt_i + 1$。

我们举个简单的例子，以下节点 $1$ 和节点 $2$ 之间存在 $3$ 个新节点，那么节点 $1$ 到节点 $2$ 之间有 $4$ 条边，也即距离为 $4$。

```
1 -- o -- o -- o -- 2
```

因此，我们可以将原图中两点之间新节点的个数 $cnt_i$ 加 $1$，得到两点之间的距离。然后构建一个邻接表 $g$，用于存储每个节点的邻接节点以及到达邻接节点的距离。

接下来，我们使用 Dijkstra 算法求出从节点 $0$ 到原始图其余所有节点的最短距离，存储在数组 $dist$ 中。

然后，我们遍历数组 $dist$，统计其中小于等于 $maxMoves$ 的节点个数，也就是我们可以到达的节点数。不过，这并不是最终答案，我们还需要加上新节点中符合条件的节点个数。

我们可以发现，如果我们能在 $dist[u]$ 步到达节点 $u$（其中 $dist[u] \leq maxMoves$），并且节点 $u$ 到节点 $v$ 之间有 $cnt$ 个新节点，那么我们能通过节点 $u$ 到达的新节点个数 $a=\min(cnt, maxMoves - dist[u])$。同理，我们能通过节点 $v$ 到达的新节点个数 $b=\min(cnt, maxMoves - dist[v])$。那么，我们能到达节点 $u$ 和节点 $v$ 之间的新节点个数为 $\min(cnt, a + b)$。

因此，我们再遍历所有的边，统计其中能到达的新节点个数，累加到答案中即可。

时间复杂度 $O(n + m \times \log n)$，其中 $m$ 和 $n$ 分别为边数和节点数。

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
// Reachable Nodes In Subdivided Graph：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func reachableNodes(edges [][]int, maxMoves int, n int) (ans int) {
	g := make([][]pair, n)
	for _, e := range edges {
		u, v, cnt := e[0], e[1], e[2]+1
		g[u] = append(g[u], pair{cnt, v})
		g[v] = append(g[v], pair{cnt, u})
	}
	dist := make([]int, n)
	for i := range dist {
		dist[i] = 1 << 30
	}
	dist[0] = 0
	q := hp{{0, 0}}
	for len(q) > 0 {
		p := heap.Pop(&q).(pair)
		d, u := p.v, p.i
		for _, nxt := range g[u] {
			v, cnt := nxt.i, nxt.v
			if t := d + cnt; t < dist[v] {
				dist[v] = t
				heap.Push(&q, pair{t, v})
			}
		}
	}
	for _, d := range dist {
		if d <= maxMoves {
			ans++
		}
	}
	for _, e := range edges {
		u, v, cnt := e[0], e[1], e[2]
		a := min(cnt, max(0, maxMoves-dist[u]))
		b := min(cnt, max(0, maxMoves-dist[v]))
		ans += min(cnt, a+b)
	}
	return
}

type pair struct{ v, i int }
type hp []pair

func (h hp) Len() int           { return len(h) }
func (h hp) Less(i, j int) bool { return h[i].v < h[j].v }
func (h hp) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *hp) Push(v any)        { *h = append(*h, v.(pair)) }
func (h *hp) Pop() any          { a := *h; v := a[len(a)-1]; *h = a[:len(a)-1]; return v }
```

### Java

```java
// Reachable Nodes In Subdivided Graph：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int reachableNodes(int[][] edges, int maxMoves, int n) {
        List<int[]>[] g = new List[n];
        Arrays.setAll(g, e -> new ArrayList<>());
        for (var e : edges) {
            int u = e[0], v = e[1], cnt = e[2] + 1;
            g[u].add(new int[] {v, cnt});
            g[v].add(new int[] {u, cnt});
        }
        int[] dist = new int[n];
        Arrays.fill(dist, 1 << 30);
        PriorityQueue<int[]> q = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        q.offer(new int[] {0, 0});
        dist[0] = 0;
        while (!q.isEmpty()) {
            var p = q.poll();
            int d = p[0], u = p[1];
            for (var nxt : g[u]) {
                int v = nxt[0], cnt = nxt[1];
                if (d + cnt < dist[v]) {
                    dist[v] = d + cnt;
                    q.offer(new int[] {dist[v], v});
                }
            }
        }
        int ans = 0;
        for (int d : dist) {
            if (d <= maxMoves) {
                ++ans;
            }
        }
        for (var e : edges) {
            int u = e[0], v = e[1], cnt = e[2];
            int a = Math.min(cnt, Math.max(0, maxMoves - dist[u]));
            int b = Math.min(cnt, Math.max(0, maxMoves - dist[v]));
            ans += Math.min(cnt, a + b);
        }
        return ans;
    }
}
```

### Python

```python
# Reachable Nodes In Subdivided Graph：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def reachableNodes(self, edges: List[List[int]], maxMoves: int, n: int) -> int:
        g = defaultdict(list)
        for u, v, cnt in edges:
            g[u].append((v, cnt + 1))
            g[v].append((u, cnt + 1))
        q = [(0, 0)]
        dist = [0] + [inf] * n
        while q:
            d, u = heappop(q)
            for v, cnt in g[u]:
                if (t := d + cnt) < dist[v]:
                    dist[v] = t
                    q.append((t, v))
        ans = sum(d <= maxMoves for d in dist)
        for u, v, cnt in edges:
            a = min(cnt, max(0, maxMoves - dist[u]))
            b = min(cnt, max(0, maxMoves - dist[v]))
            ans += min(cnt, a + b)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

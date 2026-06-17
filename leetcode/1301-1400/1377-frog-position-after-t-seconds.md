# 1377. Frog Position After T Seconds

---
编号: 1377
题目: Frog Position After T Seconds
难度: 困难
标签: [树, 深度优先搜索, 广度优先搜索, 图]
来源链接: https://leetcode.com/problems/frog-position-after-t-seconds/
---

## 题目描述

给你一棵由 `n` 个顶点组成的无向树，顶点编号从 `1` 到 `n`。青蛙从 **顶点 1** 开始起跳。规则如下：

- 在一秒内，青蛙从它所在的当前顶点跳到另一个 **未访问** 过的顶点（如果它们直接相连）。

- 青蛙无法跳回已经访问过的顶点。

- 如果青蛙可以跳到多个不同顶点，那么它跳到其中任意一个顶点上的机率都相同。

- 如果青蛙不能跳到任何未访问过的顶点上，那么它每次跳跃都会停留在原地。

无向树的边用数组 `edges` 描述，其中 `edges[i] = [ai, bi]` 意味着存在一条直接连通 `ai` 和 `bi` 两个顶点的边。

返回青蛙在 *`t`* 秒后位于目标顶点 *`target` *上的概率。与实际答案相差不超过 `10^-5` 的结果将被视为正确答案。

**示例 1：**

```text
输入：n = 7, edges = [[1,2],[1,3],[1,7],[2,4],[2,6],[3,5]], t = 2, target = 4
输出：0.16666666666666666
解释：上图显示了青蛙的跳跃路径。青蛙从顶点 1 起跳，第 1 秒 有 1/3 的概率跳到顶点 2 ，然后第 2 秒 有 1/2 的概率跳到顶点 4，因此青蛙在 2 秒后位于顶点 4 的概率是 1/3 * 1/2 = 1/6 = 0.16666666666666666 。
```

**示例 2：**

```text
输入：n = 7, edges = [[1,2],[1,3],[1,7],[2,4],[2,6],[3,5]], t = 1, target = 7
输出：0.3333333333333333
解释：上图显示了青蛙的跳跃路径。青蛙从顶点 1 起跳，有 1/3 = 0.3333333333333333 的概率能够 1 秒 后跳到顶点 7 。
```

**提示：**

- `1 i, bi <= n`

- `1 <= t <= 50`

- `1 <= target <= n`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 图」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先根据题目给出的无向树的边，建立一个邻接表 $g$，其中 $g[u]$ 表示顶点 $u$ 的所有相邻顶点。

然后，我们定义以下数据结构：

- 队列 $q$，用于存储每一轮搜索的顶点及其概率，初始时 $q = [(1, 1.0)]$，表示青蛙在顶点 $1$ 的概率为 $1.0$；
- 数组 $vis$，用于记录每个顶点是否被访问过，初始时 $vis[1] = true$，其余元素均为 $false$。

接下来，我们开始进行广度优先搜索。

在每一轮搜索中，我们每次取出队首元素 $(u, p)$，其中 $u$ 和 $p$ 分别表示当前顶点及其概率。当前顶点 $u$ 的相邻顶点中未被访问过的顶点的个数记为 $cnt$。

- 如果 $u = target$，说明青蛙已经到达目标顶点，此时我们判断青蛙是否在 $t$ 秒到达目标顶点，或者不到 $t$ 秒到达目标顶点但是无法再跳跃到其它顶点（即 $t=0$ 或者 $cnt=0$）。如果是，则返回 $p$，否则返回 $0$。
- 如果 $u \neq target$，那么我们将概率 $p$ 均分给 $u$ 的所有未被访问过的相邻顶点，然后将这些顶点加入队列 $q$ 中，并且将这些顶点标记为已访问。

在一轮搜索结束后，我们将 $t$ 减少 $1$，然后继续进行下一轮搜索，直到队列为空或者 $t \lt 0$。

最后，若青蛙仍然没有到达目标顶点，那么我们返回 $0$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是无向树的顶点数。

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
// Frog Position After T Seconds：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func frogPosition(n int, edges [][]int, t int, target int) float64 {
	g := make([][]int, n+1)
	for _, e := range edges {
		u, v := e[0], e[1]
		g[u] = append(g[u], v)
		g[v] = append(g[v], u)
	}
	type pair struct {
		u int
		p float64
	}
	q := []pair{{1, 1}}
	vis := make([]bool, n+1)
	vis[1] = true
	for ; len(q) > 0 && t >= 0; t-- {
		for k := len(q); k > 0; k-- {
			u, p := q[0].u, q[0].p
			q = q[1:]
			cnt := len(g[u])
			if u != 1 {
				cnt--
			}
			if u == target {
				if cnt*t == 0 {
					return p
				}
				return 0
			}
			for _, v := range g[u] {
				if !vis[v] {
					vis[v] = true
					q = append(q, pair{v, p / float64(cnt)})
				}
			}
		}
	}
	return 0
}
```

### Java

```java
// Frog Position After T Seconds：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public double frogPosition(int n, int[][] edges, int t, int target) {
        List<Integer>[] g = new List[n + 1];
        Arrays.setAll(g, k -> new ArrayList<>());
        for (var e : edges) {
            int u = e[0], v = e[1];
            g[u].add(v);
            g[v].add(u);
        }
        Deque<Pair<Integer, Double>> q = new ArrayDeque<>();
        q.offer(new Pair<>(1, 1.0));
        boolean[] vis = new boolean[n + 1];
        vis[1] = true;
        for (; !q.isEmpty() && t >= 0; --t) {
            for (int k = q.size(); k > 0; --k) {
                var x = q.poll();
                int u = x.getKey();
                double p = x.getValue();
                int cnt = g[u].size() - (u == 1 ? 0 : 1);
                if (u == target) {
                    return cnt * t == 0 ? p : 0;
                }
                for (int v : g[u]) {
                    if (!vis[v]) {
                        vis[v] = true;
                        q.offer(new Pair<>(v, p / cnt));
                    }
                }
            }
        }
        return 0;
    }
}
```

### Python

```python
# Frog Position After T Seconds：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def frogPosition(
        self, n: int, edges: List[List[int]], t: int, target: int
    ) -> float:
        g = defaultdict(list)
        for u, v in edges:
            g[u].append(v)
            g[v].append(u)
        q = deque([(1, 1.0)])
        vis = [False] * (n + 1)
        vis[1] = True
        while q and t >= 0:
            for _ in range(len(q)):
                u, p = q.popleft()
                cnt = len(g[u]) - int(u != 1)
                if u == target:
                    return p if cnt * t == 0 else 0
                for v in g[u]:
                    if not vis[v]:
                        vis[v] = True
                        q.append((v, p / cnt))
            t -= 1
        return 0
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

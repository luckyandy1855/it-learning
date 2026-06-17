# 0743. Network Delay Time

---
编号: 743
题目: Network Delay Time
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 图, 最短路, 堆（优先队列）]
来源链接: https://leetcode.com/problems/network-delay-time/
---

## 题目描述

有 `n` 个网络节点，标记为 `1` 到 `n`。

给你一个列表 `times`，表示信号经过 **有向** 边的传递时间。 `times[i] = (ui, vi, wi)`，其中 `ui` 是源节点，`vi` 是目标节点， `wi` 是一个信号从源节点传递到目标节点的时间。

现在，从某个节点 `K` 发出一个信号。需要多久才能使所有节点都收到信号？如果不能使所有节点收到信号，返回 `-1` 。

**示例 1：**

```text
输入：times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
输出：2
```

**示例 2：**

```text
输入：times = [[1,2,1]], n = 2, k = 1
输出：1
```

**示例 3：**

```text
输入：times = [[1,2,1]], n = 2, k = 2
输出：-1
```

**提示：**

- `1 i, vi i != vi`

- `0 i i, vi)` 对都 **互不相同**（即，不含重复边）

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 图, 最短路, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $\textit{g}[u][v]$ 表示节点 $u$ 到节点 $v$ 的边权，如果节点 $u$ 到节点 $v$ 之间没有边，则 $\textit{g}[u][v] = +\infty$。

我们维护一个数组 $\textit{dist}$，其中 $\textit{dist}[i]$ 表示节点 $k$ 到节点 $i$ 的最短路径长度。初始时，我们将 $\textit{dist}[i]$ 全部初始化为 $+\infty$，但 $\textit{dist}[k - 1] = 0$。定义一个数组 $\textit{vis}$，其中 $\textit{vis}[i]$ 表示节点 $i$ 是否被访问过，初始时，我们将 $\textit{vis}[i]$ 全部初始化为 $\text{false}$。

我们每次找到未被访问的距离最小的节点 $t$，然后以节点 $t$ 为中心进行松弛操作，即对于每个节点 $j$，如果 $\textit{dist}[j] > \textit{dist}[t] + \textit{g}[t][j]$，则更新 $\textit{dist}[j] = \textit{dist}[t] + \textit{g}[t][j]$。

最后，我们返回 $\textit{dist}$ 中的最大值，即为答案。如果答案为 $+\infty$，则说明存在无法到达的节点，返回 $-1$。

时间复杂度 $O(n^2 + m)$，空间复杂度 $O(n^2)$。其中 $n$ 和 $m$ 分别为节点数和边数。

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
// Network Delay Time：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func networkDelayTime(times [][]int, n int, k int) int {
	const inf = 1 << 29
	g := make([][]int, n)
	for i := range g {
		g[i] = make([]int, n)
		for j := range g[i] {
			g[i][j] = inf
		}
	}
	for _, e := range times {
		g[e[0]-1][e[1]-1] = e[2]
	}

	dist := make([]int, n)
	for i := range dist {
		dist[i] = inf
	}
	dist[k-1] = 0

	vis := make([]bool, n)
	for i := 0; i < n; i++ {
		t := -1
		for j := 0; j < n; j++ {
			if !vis[j] && (t == -1 || dist[t] > dist[j]) {
				t = j
			}
		}
		vis[t] = true
		for j := 0; j < n; j++ {
			dist[j] = min(dist[j], dist[t]+g[t][j])
		}
	}

	if ans := slices.Max(dist); ans != inf {
		return ans
	}
	return -1
}
```

### Java

```java
// Network Delay Time：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        int[][] g = new int[n][n];
        int[] dist = new int[n];
        final int inf = 1 << 29;
        Arrays.fill(dist, inf);
        for (var e : g) {
            Arrays.fill(e, inf);
        }
        for (var e : times) {
            g[e[0] - 1][e[1] - 1] = e[2];
        }
        dist[k - 1] = 0;
        boolean[] vis = new boolean[n];
        for (int i = 0; i < n; ++i) {
            int t = -1;
            for (int j = 0; j < n; ++j) {
                if (!vis[j] && (t == -1 || dist[t] > dist[j])) {
                    t = j;
                }
            }
            vis[t] = true;
            for (int j = 0; j < n; ++j) {
                dist[j] = Math.min(dist[j], dist[t] + g[t][j]);
            }
        }
        int ans = 0;
        for (int x : dist) {
            ans = Math.max(ans, x);
        }
        return ans == inf ? -1 : ans;
    }
}
```

### Python

```python
# Network Delay Time：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        g = [[inf] * n for _ in range(n)]
        for u, v, w in times:
            g[u - 1][v - 1] = w
        dist = [inf] * n
        dist[k - 1] = 0
        vis = [False] * n
        for _ in range(n):
            t = -1
            for j in range(n):
                if not vis[j] and (t == -1 or dist[t] > dist[j]):
                    t = j
            vis[t] = True
            for j in range(n):
                dist[j] = min(dist[j], dist[t] + g[t][j])
        ans = max(dist)
        return -1 if ans == inf else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

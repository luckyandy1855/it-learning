# 1192. Critical Connections in a Network

---
编号: 1192
题目: Critical Connections in a Network
难度: 困难
标签: [深度优先搜索, 图, 双连通分量]
来源链接: https://leetcode.com/problems/critical-connections-in-a-network/
---

## 题目描述

力扣数据中心有 `n` 台服务器，分别按从 `0` 到 `n-1` 的方式进行了编号。它们之间以 **服务器到服务器** 的形式相互连接组成了一个内部集群，连接是无向的。用  `connections` 表示集群网络，`connections[i] = [a, b]` 表示服务器 `a` 和 `b` 之间形成连接。任何服务器都可以直接或者间接地通过网络到达任何其他服务器。

**关键连接*** *是在该集群中的重要连接，假如我们将它移除，便会导致某些服务器无法访问其他服务器。

请你以任意顺序返回该集群内的所有 **关键连接** 。

**示例 1：**

****

```text
输入：n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]
输出：[[1,3]]
解释：[[3,1]] 也是正确的。
```

**示例 2:**

```text
输入：n = 2, connections = [[0,1]]
输出：[[0,1]]
```

**提示：**

- `2 i, bi i != bi`

- 不存在重复的连接

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 图, 双连通分量」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

此题中的「关键连接」即为「桥」。

「桥」：在一连通的无向图中，若去除某一边后会使得图不再连通，则这条边可以视作「桥」。

与之相应的概念还有「割点」。

「割点」：在一连通的无向图中，若去除某一点及所有与其相连的边后会使得图不再连通，则这个点可以视作「割点」。

用于求图中的「桥」与「割点」有一算法：tarjan 算法，这个算法使用先递归的访问相邻节点后访问节点自身的 dfs 方法，通过记录「访问的顺序：DFN」以及在递归结束后访问节点自身时探索其可以回溯到的最早被访问的节点来更新「最早可回溯的节点：low」，可以实现在 $O(n)$ 时间内找到图的「桥」与「割点」。同时，此种算法可以用于查找有向图中的强连通分量。

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
// Critical Connections in a Network：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func criticalConnections(n int, connections [][]int) (ans [][]int) {
	now := 0
	g := make([][]int, n)
	dfn := make([]int, n)
	low := make([]int, n)
	for _, e := range connections {
		a, b := e[0], e[1]
		g[a] = append(g[a], b)
		g[b] = append(g[b], a)
	}
	var tarjan func(int, int)
	tarjan = func(a, fa int) {
		now++
		dfn[a], low[a] = now, now
		for _, b := range g[a] {
			if b == fa {
				continue
			}
			if dfn[b] == 0 {
				tarjan(b, a)
				low[a] = min(low[a], low[b])
				if low[b] > dfn[a] {
					ans = append(ans, []int{a, b})
				}
			} else {
				low[a] = min(low[a], dfn[b])
			}
		}
	}
	tarjan(0, -1)
	return
}
```

### Java

```java
// Critical Connections in a Network：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int now;
    private List<Integer>[] g;
    private List<List<Integer>> ans = new ArrayList<>();
    private int[] dfn;
    private int[] low;

    public List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {
        g = new List[n];
        Arrays.setAll(g, k -> new ArrayList<>());
        dfn = new int[n];
        low = new int[n];
        for (var e : connections) {
            int a = e.get(0), b = e.get(1);
            g[a].add(b);
            g[b].add(a);
        }
        tarjan(0, -1);
        return ans;
    }

    private void tarjan(int a, int fa) {
        dfn[a] = low[a] = ++now;
        for (int b : g[a]) {
            if (b == fa) {
                continue;
            }
            if (dfn[b] == 0) {
                tarjan(b, a);
                low[a] = Math.min(low[a], low[b]);
                if (low[b] > dfn[a]) {
                    ans.add(List.of(a, b));
                }
            } else {
                low[a] = Math.min(low[a], dfn[b]);
            }
        }
    }
}
```

### Python

```python
# Critical Connections in a Network：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def criticalConnections(
        self, n: int, connections: List[List[int]]
    ) -> List[List[int]]:
        def tarjan(a: int, fa: int):
            nonlocal now
            now += 1
            dfn[a] = low[a] = now
            for b in g[a]:
                if b == fa:
                    continue
                if not dfn[b]:
                    tarjan(b, a)
                    low[a] = min(low[a], low[b])
                    if low[b] > dfn[a]:
                        ans.append([a, b])
                else:
                    low[a] = min(low[a], dfn[b])

        g = [[] for _ in range(n)]
        for a, b in connections:
            g[a].append(b)
            g[b].append(a)

        dfn = [0] * n
        low = [0] * n
        now = 0
        ans = []
        tarjan(0, -1)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

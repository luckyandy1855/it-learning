# 1059. All Paths from Source Lead to Destination

---
编号: 1059
题目: All Paths from Source Lead to Destination
难度: 中等
标签: [图, 拓扑排序]
来源链接: https://leetcode.com/problems/all-paths-from-source-lead-to-destination/
---

## 题目描述

给定有向图的边 `edges`，以及该图的起点 `source` 和目标终点 `destination`，确定从起点 `source` 出发的所有路径是否最终结束于目标终点 `destination`，即：

- 从起点 `source` 到目标终点 `destination` 存在至少一条路径

- 如果存在从起点 `source` 到没有出边的节点的路径，则该节点就是路径终点。

- 从起点`source`到目标终点 `destination` 可能路径数是有限数字

当从起点 `source` 出发的所有路径都可以到达目标终点 `destination` 时返回 `true`，否则返回 `false`。

示例 1：

```text
输入：n = 3, edges = [[0,1],[0,2]], source = 0, destination = 2
输出：false
说明：节点 1 和节点 2 都可以到达，但也会卡在那里。
```

示例 2：

```text
输入：n = 4, edges = [[0,1],[0,3],[1,2],[2,1]], source = 0, destination = 3
输出：false
说明：有两种可能：在节点 3 处结束，或是在节点 1 和节点 2 之间无限循环。
```

示例 3：

```text
输入：n = 4, edges = [[0,1],[0,2],[1,3],[2,3]], source = 0, destination = 3
输出：true
```

**提示：**

- `1 i, bi <= n - 1`

- `0 <= source <= n - 1`

- `0 <= destination <= n - 1`

- 给定的图中可能带有自环和平行边。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「图, 拓扑排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个状态数组 $\textit{state}$ 来记录每个节点的状态，其中：

- 状态 0 表示该节点未被访问过；
- 状态 1 表示该节点正在被访问；
- 状态 2 表示该节点已经被访问过且可以通向终点。

我们首先将图构建为邻接表的形式，然后从起点出发进行深度优先搜索（DFS）。在 DFS 过程中：

- 如果当前节点的状态为 1，说明我们遇到了一个环，直接返回 $\text{false}$；
- 如果当前节点的状态为 2，说明该节点已经被访问过且可以通向终点，直接返回 $\text{true}$；
- 如果当前节点没有出边，则检查该节点是否为终点，如果是则返回 $\text{true}$，否则返回 $\text{false}$；
- 否则，将当前节点的状态设为 1，递归访问所有相邻节点；
- 如果所有相邻节点都能通向终点，则将当前节点的状态设为 2 并返回 $\text{true}$，否则返回 $\text{false}$。

答案为 $\text{dfs}(\text{source})$ 的结果。

时间复杂度 $O(n + m)$，其中 $n$ 和 $m$ 分别为节点数和边数。空间复杂度 $O(n + m)$，用于存储图的邻接表和状态数组。

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
// All Paths from Source Lead to Destination：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func leadsToDestination(n int, edges [][]int, source int, destination int) bool {
	g := make([][]int, n)
	for _, e := range edges {
		g[e[0]] = append(g[e[0]], e[1])
	}
	if len(g[destination]) > 0 {
		return false
	}

	st := make([]int, n)

	var dfs func(i int) bool
	dfs = func(i int) bool {
		if st[i] != 0 {
			return st[i] == 2
		}
		if len(g[i]) == 0 {
			return i == destination
		}
		st[i] = 1
		for _, j := range g[i] {
			if !dfs(j) {
				return false
			}
		}
		st[i] = 2
		return true
	}

	return dfs(source)
}
```

### Java

```java
// All Paths from Source Lead to Destination：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<Integer>[] g;
    private int[] st;
    private int destination;

    public boolean leadsToDestination(int n, int[][] edges, int source, int destination) {
        this.destination = destination;
        g = new List[n];
        Arrays.setAll(g, k -> new ArrayList<>());
        for (int[] e : edges) {
            g[e[0]].add(e[1]);
        }
        if (!g[destination].isEmpty()) {
            return false;
        }
        st = new int[n];
        return dfs(source);
    }

    private boolean dfs(int i) {
        if (st[i] != 0) {
            return st[i] == 2;
        }
        if (g[i].isEmpty()) {
            return i == destination;
        }
        st[i] = 1;
        for (int j : g[i]) {
            if (!dfs(j)) {
                return false;
            }
        }
        st[i] = 2;
        return true;
    }
}
```

### Python

```python
# All Paths from Source Lead to Destination：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def leadsToDestination(
        self, n: int, edges: List[List[int]], source: int, destination: int
    ) -> bool:
        def dfs(i: int) -> bool:
            if st[i]:
                return st[i] == 2
            if not g[i]:
                return i == destination

            st[i] = 1
            for j in g[i]:
                if not dfs(j):
                    return False
            st[i] = 2
            return True

        g = [[] for _ in range(n)]
        for a, b in edges:
            g[a].append(b)
        if g[destination]:
            return False

        st = [0] * n
        return dfs(source)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

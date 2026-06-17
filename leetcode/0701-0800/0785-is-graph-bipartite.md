# 0785. Is Graph Bipartite?

---
编号: 785
题目: Is Graph Bipartite?
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 并查集, 图]
来源链接: https://leetcode.com/problems/is-graph-bipartite/
---

## 题目描述

存在一个 **无向图** ，图中有 `n` 个节点。其中每个节点都有一个介于 `0` 到 `n - 1` 之间的唯一编号。给你一个二维数组 `graph` ，其中 `graph[u]` 是一个节点数组，由节点 `u` 的邻接节点组成。形式上，对于 `graph[u]` 中的每个 `v` ，都存在一条位于节点 `u` 和节点 `v` 之间的无向边。该无向图同时具有以下属性：

- 不存在自环（`graph[u]` 不包含 `u`）。

- 不存在平行边（`graph[u]` 不包含重复值）。

- 如果 `v` 在 `graph[u]` 内，那么 `u` 也应该在 `graph[v]` 内（该图是无向图）

- 这个图可能不是连通图，也就是说两个节点 `u` 和 `v` 之间可能不存在一条连通彼此的路径。

**二分图** 定义：如果能将一个图的节点集合分割成两个独立的子集 `A` 和 `B` ，并使图中的每一条边的两个节点一个来自 `A` 集合，一个来自 `B` 集合，就将这个图称为 **二分图** 。

如果图是二分图，返回 `true`* *；否则，返回 `false` 。

**示例 1：**

```text
输入：graph = [[1,2,3],[0,2],[0,1,3],[0,2]]
输出：false
解释：不能将节点分割成两个独立的子集，以使每条边都连通一个子集中的一个节点与另一个子集中的一个节点。
```

**示例 2：**

```text
输入：graph = [[1,3],[0,2],[1,3],[0,2]]
输出：true
解释：可以将节点分成两组: {0, 2} 和 {1, 3} 。
```

**提示：**

- `graph.length == n`

- `1 <= n <= 100`

- `0 <= graph[u].length < n`

- `0 <= graph[u][i] <= n - 1`

- `graph[u]` 不会包含 `u`

- `graph[u]` 的所有值 **互不相同**

- 如果 `graph[u]` 包含 `v`，那么 `graph[v]` 也会包含 `u`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 并查集, 图」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

遍历所有节点进行染色，比如初始为白色，DFS 对节点相邻的点染上另外一种颜色。如果要染色某节点时，要染的目标颜色和该节点的已经染过的颜色不同，则说明不能构成二分图。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为节点数。

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
// Is Graph Bipartite?：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isBipartite(graph [][]int) bool {
	n := len(graph)
	color := make([]int, n)
	var dfs func(int, int) bool
	dfs = func(a, c int) bool {
		color[a] = c
		for _, b := range graph[a] {
			if color[b] == c || (color[b] == 0 && !dfs(b, -c)) {
				return false
			}
		}
		return true
	}
	for i := range graph {
		if color[i] == 0 && !dfs(i, 1) {
			return false
		}
	}
	return true
}
```

### Java

```java
// Is Graph Bipartite?：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] color;
    private int[][] g;

    public boolean isBipartite(int[][] graph) {
        int n = graph.length;
        color = new int[n];
        g = graph;
        for (int i = 0; i < n; ++i) {
            if (color[i] == 0 && !dfs(i, 1)) {
                return false;
            }
        }
        return true;
    }

    private boolean dfs(int a, int c) {
        color[a] = c;
        for (int b : g[a]) {
            if (color[b] == c || (color[b] == 0 && !dfs(b, -c))) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Is Graph Bipartite?：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isBipartite(self, graph: List[List[int]]) -> bool:
        def dfs(a: int, c: int) -> bool:
            color[a] = c
            for b in graph[a]:
                if color[b] == c or (color[b] == 0 and not dfs(b, -c)):
                    return False
            return True

        n = len(graph)
        color = [0] * n
        for i in range(n):
            if color[i] == 0 and not dfs(i, 1):
                return False
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

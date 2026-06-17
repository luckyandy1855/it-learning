# 0685. Redundant Connection II

---
编号: 685
题目: Redundant Connection II
难度: 困难
标签: [深度优先搜索, 广度优先搜索, 并查集, 图]
来源链接: https://leetcode.com/problems/redundant-connection-ii/
---

## 题目描述

在本问题中，有根树指满足以下条件的 **有向** 图。该树只有一个根节点，所有其他节点都是该根节点的后继。该树除了根节点之外的每一个节点都有且只有一个父节点，而根节点没有父节点。

输入一个有向图，该图由一个有着 `n` 个节点（节点值不重复，从 `1` 到 `n`）的树及一条附加的有向边构成。附加的边包含在 `1` 到 `n` 中的两个不同顶点间，这条附加的边不属于树中已存在的边。

结果图是一个以边组成的二维数组 `edges` 。 每个元素是一对 `[ui, vi]`，用以表示 **有向 **图中连接顶点 `ui` 和顶点 `vi` 的边，其中 `ui` 是 `vi` 的一个父节点。

返回一条能删除的边，使得剩下的图是有 `n` 个节点的有根树。若有多个答案，返回最后出现在给定二维数组的答案。

示例 1：

```text
输入：edges = [[1,2],[1,3],[2,3]]
输出：[2,3]
```

示例 2：

```text
输入：edges = [[1,2],[2,3],[3,4],[4,1],[1,5]]
输出：[4,1]
```

**提示：**

- `n == edges.length`

- `3 i, vi <= n`

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

根据题目描述，对于一棵有根树，根节点的入度为 $0$，其余节点的入度为 $1$。在向树中添加一条边之后，可能会出现以下三种情况：

1. 添加的边指向了非根节点，该节点的入度变为 $2$，此时图中不存在有向环；

    ```plaintext
       1
      / \
     v   v
     2-->3
    ```

1. 添加的边指向了非根节点，该节点的入度变为 $2$，此时图中存在有向环；

    ```plaintext
       1
       |
       v
       2 <--> 3
    ```

1. 添加的边指向了根节点，根节点的入度变为 $1$，此时图中存在有向环，但不存在入度为 $2$ 的节点。

    ```plaintext
        1
        /^
       v  \
       2-->3
    ```

因此，我们首先计算每个节点的入度，如果存在入度为 $2$ 的节点，我们定位到该节点对应的两条边，分别记为 $\textit{dup}[0]$ 和 $\textit{dup}[1]$。如果在删除 $\textit{dup}[1]$ 之后，剩余的边无法形成树，则说明 $\textit{dup}[0]$ 是需要删除的边；否则 $\textit{dup}[1]$ 是需要删除的边。

如果不存在入度为 $2$ 的节点，我们遍历数组 $\textit{edges}$，对于每条边 $(u, v)$，我们使用并查集维护节点之间的连通性。如果 $u$ 和 $v$ 已经连通，说明图中存在有向环，此时当前边即为需要删除的边。

时间复杂度 $O(n \log n)$，空间复杂度 $O(n)$。其中 $n$ 为边的数量。

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
// Redundant Connection II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findRedundantDirectedConnection(edges [][]int) []int {
	n := len(edges)
	ind := make([]int, n)
	for _, e := range edges {
		ind[e[1]-1]++
	}
	dup := []int{}
	for i, e := range edges {
		if ind[e[1]-1] == 2 {
			dup = append(dup, i)
		}
	}
	p := make([]int, n)
	for i := range p {
		p[i] = i
	}
	var find func(int) int
	find = func(x int) int {
		if p[x] != x {
			p[x] = find(p[x])
		}
		return p[x]
	}
	if len(dup) > 0 {
		for i, e := range edges {
			if i == dup[1] {
				continue
			}
			pu, pv := find(e[0]-1), find(e[1]-1)
			if pu == pv {
				return edges[dup[0]]
			}
			p[pu] = pv
		}
		return edges[dup[1]]
	}
	for _, e := range edges {
		pu, pv := find(e[0]-1), find(e[1]-1)
		if pu == pv {
			return e
		}
		p[pu] = pv
	}
	return nil
}
```

### Java

```java
// Redundant Connection II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] p;

    public int[] findRedundantDirectedConnection(int[][] edges) {
        int n = edges.length;
        int[] ind = new int[n];
        for (var e : edges) {
            ++ind[e[1] - 1];
        }
        List<Integer> dup = new ArrayList<>();
        p = new int[n];
        for (int i = 0; i < n; ++i) {
            if (ind[edges[i][1] - 1] == 2) {
                dup.add(i);
            }
            p[i] = i;
        }
        if (!dup.isEmpty()) {
            for (int i = 0; i < n; ++i) {
                if (i == dup.get(1)) {
                    continue;
                }
                int pu = find(edges[i][0] - 1);
                int pv = find(edges[i][1] - 1);
                if (pu == pv) {
                    return edges[dup.get(0)];
                }
                p[pu] = pv;
            }
            return edges[dup.get(1)];
        }
        for (int i = 0;; ++i) {
            int pu = find(edges[i][0] - 1);
            int pv = find(edges[i][1] - 1);
            if (pu == pv) {
                return edges[i];
            }
            p[pu] = pv;
        }
    }

    private int find(int x) {
        if (p[x] != x) {
            p[x] = find(p[x]);
        }
        return p[x];
    }
}
```

### Python

```python
# Redundant Connection II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findRedundantDirectedConnection(self, edges: List[List[int]]) -> List[int]:
        def find(x: int) -> int:
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        n = len(edges)
        ind = [0] * n
        for _, v in edges:
            ind[v - 1] += 1
        dup = [i for i, (_, v) in enumerate(edges) if ind[v - 1] == 2]
        p = list(range(n))
        if dup:
            for i, (u, v) in enumerate(edges):
                if i == dup[1]:
                    continue
                pu, pv = find(u - 1), find(v - 1)
                if pu == pv:
                    return edges[dup[0]]
                p[pu] = pv
            return edges[dup[1]]
        for i, (u, v) in enumerate(edges):
            pu, pv = find(u - 1), find(v - 1)
            if pu == pv:
                return edges[i]
            p[pu] = pv
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

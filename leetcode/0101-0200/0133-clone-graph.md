# 0133. Clone Graph

---
编号: 133
题目: Clone Graph
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 图, 哈希表]
来源链接: https://leetcode.com/problems/clone-graph/
---

## 题目描述

给你无向 **连通 **图中一个节点的引用，请你返回该图的 **深拷贝**（克隆）。

图中的每个节点都包含它的值 `val`（`int`） 和其邻居的列表（`list[Node]`）。

```text
class Node {
    public int val;
    public List neighbors;
}
```

**测试用例格式：**

简单起见，每个节点的值都和它的索引相同。例如，第一个节点值为 1（`val = 1`），第二个节点值为 2（`val = 2`），以此类推。该图在测试用例中使用邻接列表表示。

**邻接列表** 是用于表示有限图的无序列表的集合。每个列表都描述了图中节点的邻居集。

给定节点将始终是图中的第一个节点（值为 1）。你必须将 **给定节点的拷贝 **作为对克隆图的引用返回。

**示例 1：**

```text
输入：adjList = [[2,4],[1,3],[2,4],[1,3]]
输出：[[2,4],[1,3],[2,4],[1,3]]
解释：
图中有 4 个节点。
节点 1 的值是 1，它有两个邻居：节点 2 和 4 。
节点 2 的值是 2，它有两个邻居：节点 1 和 3 。
节点 3 的值是 3，它有两个邻居：节点 2 和 4 。
节点 4 的值是 4，它有两个邻居：节点 1 和 3 。
```

**示例 2：**

```text
输入：adjList = [[]]
输出：[[]]
解释：输入包含一个空列表。该图仅仅只有一个值为 1 的节点，它没有任何邻居。
```

**示例 3：**

```text
输入：adjList = []
输出：[]
解释：这个图是空的，它不含任何节点。
```

**提示：**

	- 这张图中的节点数在 `[0, 100]` 之间。

	- `1 <= Node.val <= 100`

	- 每个节点值 `Node.val` 都是唯一的，

	- 图中没有重复的边，也没有自环。

	- 图是连通图，你可以从给定节点访问到所有节点。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 图, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个哈希表 $\textit{g}$ 记录原图中的每个节点和它的拷贝节点之间的对应关系，然后进行深度优先搜索。

我们定义函数 $\text{dfs}(node)$，它的功能是返回 $\textit{node}$ 节点的拷贝节点。$\text{dfs}(node)$ 的过程如下：

- 如果 $\textit{node}$ 是 $\text{null}$，那么 $\text{dfs}(node)$ 的返回值是 $\text{null}$。
- 如果 $\textit{node}$ 在 $\textit{g}$ 中，那么 $\text{dfs}(node)$ 的返回值是 $\textit{g}[node]$。
- 否则我们创建一个新的节点 $\textit{cloned}$，并将 $\textit{g}[node]$ 的值设为 $\textit{cloned}$，然后遍历 $\textit{node}$ 的所有邻居节点 $\textit{nxt}$，并将 $\textit{cloned}$ 的邻居节点列表中加入 $\text{dfs}(nxt)$。
- 最后返回 $\textit{cloned}$。

在主函数中，我们返回 $\text{dfs}(node)$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是节点的数量。

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
// Clone Graph：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a Node.
 * type Node struct {
 *     Val int
 *     Neighbors []*Node
 * }
 */

func cloneGraph(node *Node) *Node {
	g := map[*Node]*Node{}
	var dfs func(node *Node) *Node
	dfs = func(node *Node) *Node {
		if node == nil {
			return nil
		}
		if n, ok := g[node]; ok {
			return n
		}
		cloned := &Node{node.Val, []*Node{}}
		g[node] = cloned
		for _, nxt := range node.Neighbors {
			cloned.Neighbors = append(cloned.Neighbors, dfs(nxt))
		}
		return cloned
	}
	return dfs(node)
}
```

### Java

```java
// Clone Graph：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> neighbors;
    public Node() {
        val = 0;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val) {
        val = _val;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val, ArrayList<Node> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
}
*/

class Solution {
    private Map<Node, Node> g = new HashMap<>();

    public Node cloneGraph(Node node) {
        return dfs(node);
    }

    private Node dfs(Node node) {
        if (node == null) {
            return null;
        }
        Node cloned = g.get(node);
        if (cloned == null) {
            cloned = new Node(node.val);
            g.put(node, cloned);
            for (Node nxt : node.neighbors) {
                cloned.neighbors.add(dfs(nxt));
            }
        }
        return cloned;
    }
}
```

### Python

```python
# Clone Graph：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
"""
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

from typing import Optional


class Solution:
    def cloneGraph(self, node: Optional["Node"]) -> Optional["Node"]:
        def dfs(node):
            if node is None:
                return None
            if node in g:
                return g[node]
            cloned = Node(node.val)
            g[node] = cloned
            for nxt in node.neighbors:
                cloned.neighbors.append(dfs(nxt))
            return cloned

        g = defaultdict()
        return dfs(node)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

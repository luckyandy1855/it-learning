# 0847. Shortest Path Visiting All Nodes

---
编号: 847
题目: Shortest Path Visiting All Nodes
难度: 困难
标签: [位运算, 广度优先搜索, 图, 动态规划, 位掩码]
来源链接: https://leetcode.com/problems/shortest-path-visiting-all-nodes/
---

## 题目描述

存在一个由 `n` 个节点组成的无向连通图，图中的节点按从 `0` 到 `n - 1` 编号。

给你一个数组 `graph` 表示这个图。其中，`graph[i]` 是一个列表，由所有与节点 `i` 直接相连的节点组成。

返回能够访问所有节点的最短路径的长度。你可以在任一节点开始和停止，也可以多次重访节点，并且可以重用边。

**示例 1：**

```text
输入：graph = [[1,2,3],[0],[0],[0]]
输出：4
解释：一种可能的路径为 [1,0,2,0,3]
```

**示例 2：**

```text
输入：graph = [[1],[0,2,4],[1,3,4],[2],[1,2]]
输出：4
解释：一种可能的路径为 [0,1,4,2,3]
```

**提示：**

- `n == graph.length`

- `1 <= n <= 12`

- `0 <= graph[i].length < n`

- `graph[i]` 不包含 `i`

- 如果 `graph[a]` 包含 `b` ，那么 `graph[b]` 也包含 `a`

- 输入的图总是连通图

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 广度优先搜索, 图, 动态规划, 位掩码」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到 $n$ 的范围不超过 $12$，因此，我们可以用一个 $12$ 位的二进制数来表示每个节点的访问情况，其中第 $i$ 位为 $1$ 表示第 $i$ 个节点已经被访问过，为 $0$ 表示该节点还没有被访问过。

我们初始化队列 $q$，其中每个元素是一个二元素 $(i, st)$，表示当前位于节点 $i$，且已经遍历过的节点的集合为 $st$。初始时，队列中只有 $n$ 个元素，即 $(i, 2^i)$，表示可以从任一节点出发开始遍历。另外，我们用一个哈希表或数组 $vis$ 记录每个状态是否已经被搜索过，防止无效的重复搜索。

在 BFS 的过程中，我们每次取出队首元素 $(i, st)$，如果当前 $st$ 包含 $n$ 个 $1$，那么我们就找到了一条从起点出发的遍历路径，返回当前的步数即可。否则我们枚举当前节点 $i$ 的所有连边 $(i, j)$，如果 $(j, st \lor 2^j)$ 没有被搜索过，那么就将 $(j, st \lor 2^j)$ 加入队列 $q$ 中，并且用 $vis$ 记录它已经被搜索过。循环此过程，直到找到一条路径。

时间复杂度 $(n^2 \times 2^n)$，空间复杂度 $O(n \times 2^n)$。其中 $n$ 是图中的节点数。

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
// Shortest Path Visiting All Nodes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shortestPathLength(graph [][]int) int {
	n := len(graph)
	q := [][2]int{}
	vis := make([][]bool, n)
	for i := range vis {
		vis[i] = make([]bool, 1<<n)
		vis[i][1<<i] = true
		q = append(q, [2]int{i, 1 << i})
	}
	for ans := 0; ; ans++ {
		for k := len(q); k > 0; k-- {
			p := q[0]
			q = q[1:]
			i, st := p[0], p[1]
			if st == (1<<n)-1 {
				return ans
			}
			for _, j := range graph[i] {
				nst := st | 1<<j
				if !vis[j][nst] {
					vis[j][nst] = true
					q = append(q, [2]int{j, nst})
				}
			}
		}
	}
}
```

### Java

```java
// Shortest Path Visiting All Nodes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int shortestPathLength(int[][] graph) {
        int n = graph.length;
        Deque<int[]> q = new ArrayDeque<>();
        boolean[][] vis = new boolean[n][1 << n];
        for (int i = 0; i < n; ++i) {
            q.offer(new int[] {i, 1 << i});
            vis[i][1 << i] = true;
        }
        for (int ans = 0;; ++ans) {
            for (int k = q.size(); k > 0; --k) {
                var p = q.poll();
                int i = p[0], st = p[1];
                if (st == (1 << n) - 1) {
                    return ans;
                }
                for (int j : graph[i]) {
                    int nst = st | 1 << j;
                    if (!vis[j][nst]) {
                        vis[j][nst] = true;
                        q.offer(new int[] {j, nst});
                    }
                }
            }
        }
    }
}
```

### Python

```python
# Shortest Path Visiting All Nodes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shortestPathLength(self, graph: List[List[int]]) -> int:
        n = len(graph)
        q = deque()
        vis = set()
        for i in range(n):
            q.append((i, 1 << i))
            vis.add((i, 1 << i))
        ans = 0
        while 1:
            for _ in range(len(q)):
                i, st = q.popleft()
                if st == (1 << n) - 1:
                    return ans
                for j in graph[i]:
                    nst = st | 1 << j
                    if (j, nst) not in vis:
                        vis.add((j, nst))
                        q.append((j, nst))
            ans += 1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

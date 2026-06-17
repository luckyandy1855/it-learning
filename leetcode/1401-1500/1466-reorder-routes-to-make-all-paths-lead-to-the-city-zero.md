# 1466. Reorder Routes to Make All Paths Lead to the City Zero

---
编号: 1466
题目: Reorder Routes to Make All Paths Lead to the City Zero
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 图]
来源链接: https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/
---

## 题目描述

`n` 座城市，从 `0` 到 `n-1` 编号，其间共有 `n-1` 条路线。因此，要想在两座不同城市之间旅行只有唯一一条路线可供选择（路线网形成一颗树）。去年，交通运输部决定重新规划路线，以改变交通拥堵的状况。

路线用 `connections` 表示，其中 `connections[i] = [a, b]` 表示从城市 `a` 到 `b` 的一条有向路线。

今年，城市 0 将会举办一场大型比赛，很多游客都想前往城市 0 。

请你帮助重新规划路线方向，使每个城市都可以访问城市 0 。返回需要变更方向的最小路线数。

题目数据 **保证** 每个城市在重新规划路线方向后都能到达城市 0 。

**示例 1：**

****

```text
输入：n = 6, connections = [[0,1],[1,3],[2,3],[4,0],[4,5]]
输出：3
解释：更改以红色显示的路线的方向，使每个城市都可以到达城市 0 。
```

**示例 2：**

****

```text
输入：n = 5, connections = [[1,0],[1,2],[3,2],[3,4]]
输出：2
解释：更改以红色显示的路线的方向，使每个城市都可以到达城市 0 。
```

**示例 3：**

```text
输入：n = 3, connections = [[1,0],[2,0]]
输出：0
```

**提示：**

- `2 <= n <= 5 * 10^4`

- `connections.length == n-1`

- `connections[i].length == 2`

- `0 <= connections[i][0], connections[i][1] <= n-1`

- `connections[i][0] != connections[i][1]`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 图」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目给定的路线图中有 $n$ 个节点和 $n-1$ 条边，如果我们忽略边的方向，那么这 $n$ 个节点构成了一棵树。而题目需要我们改变某些边的方向，使得每个节点都能到达节点 $0$。

我们不妨考虑从节点 $0$ 出发，到达其他所有节点。方向与题目描述相反，意味着我们在构建图的时候，对于有向边 $[a, b]$，我们应该视为有向边 $[b, a]$。也即是说，如果要从 $a$ 到 $b$，我们需要变更一次方向；如果要从 $b$ 到 $a$，则不需要变更方向。

接下来，我们只需要从节点 $0$ 出发，搜索其他所有节点，过程中，如果遇到需要变更方向的边，则累加一次变更方向的次数。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是题目中节点的数量。

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
// Reorder Routes to Make All Paths Lead to the City Zero：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minReorder(n int, connections [][]int) int {
	g := make([][][2]int, n)
	for _, e := range connections {
		a, b := e[0], e[1]
		g[a] = append(g[a], [2]int{b, 1})
		g[b] = append(g[b], [2]int{a, 0})
	}
	var dfs func(int, int) int
	dfs = func(a, fa int) (ans int) {
		for _, e := range g[a] {
			if b, c := e[0], e[1]; b != fa {
				ans += c + dfs(b, a)
			}
		}
		return
	}
	return dfs(0, -1)
}
```

### Java

```java
// Reorder Routes to Make All Paths Lead to the City Zero：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<int[]>[] g;

    public int minReorder(int n, int[][] connections) {
        g = new List[n];
        Arrays.setAll(g, k -> new ArrayList<>());
        for (var e : connections) {
            int a = e[0], b = e[1];
            g[a].add(new int[] {b, 1});
            g[b].add(new int[] {a, 0});
        }
        return dfs(0, -1);
    }

    private int dfs(int a, int fa) {
        int ans = 0;
        for (var e : g[a]) {
            int b = e[0], c = e[1];
            if (b != fa) {
                ans += c + dfs(b, a);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Reorder Routes to Make All Paths Lead to the City Zero：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minReorder(self, n: int, connections: List[List[int]]) -> int:
        def dfs(a: int, fa: int) -> int:
            return sum(c + dfs(b, a) for b, c in g[a] if b != fa)

        g = [[] for _ in range(n)]
        for a, b in connections:
            g[a].append((b, 1))
            g[b].append((a, 0))
        return dfs(0, -1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

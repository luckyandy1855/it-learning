# 1135. Connecting Cities With Minimum Cost

---
编号: 1135
题目: Connecting Cities With Minimum Cost
难度: 中等
标签: [并查集, 图, 最小生成树, 堆（优先队列）]
来源链接: https://leetcode.com/problems/connecting-cities-with-minimum-cost/
---

## 题目描述

想象一下你是个城市基建规划者，地图上有 `n` 座城市，它们按以 `1` 到 `n` 的次序编号。

给你整数 `n` 和一个数组 `conections`，其中 `connections[i] = [xi, yi, costi]` 表示将城市 `xi` 和城市 `yi` 连接所要的`costi`（**连接是双向的**）。

返回连接所有城市的**最低成本**，每对城市之间**至少**有一条路径。如果无法连接所有 `n` 个城市，返回 `-1`

该 **最小成本** 应该是所用全部连接成本的总和。

**示例 1：**

```text
输入：n = 3, conections = [[1,2,5],[1,3,6],[2,3,1]]
输出：6
解释：选出任意 2 条边都可以连接所有城市，我们从中选取成本最小的 2 条。
```

**示例 2：**

```text
输入：n = 4, conections = [[1,2,3],[3,4,4]]
输出：-1
解释：即使连通所有的边，也无法连接所有城市。
```

**提示：**

- `1 i, yi i != yi`

- `0 i <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「并查集, 图, 最小生成树, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

Kruskal 算法是一种贪心算法，用于计算最小生成树。

Kruskal 算法的基本思想是，每次从边集中选择一条最小的边，如果这条边连接的两个顶点不在同一个连通分量中，则将这条边加入到最小生成树中，否则舍弃这条边。

对于本题，我们可以将边按照连通成本从小到大排序，用并查集维护连通分量，每次选择一条最小的边，如果这条边连接的两个顶点不在同一个连通分量中，则合并这两个顶点，然后累加连通成本。如果出现连通份量为 $1$ 的情况，则说明所有顶点都连通了，返回累加的连通成本，否则返回 $-1$。

时间复杂度 $O(m \times \log m)$，空间复杂度 $O(n)$。其中 $m$ 和 $n$ 分别为边数和顶点数。

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
// Connecting Cities With Minimum Cost：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minimumCost(n int, connections [][]int) (ans int) {
	p := make([]int, n)
	for i := range p {
		p[i] = i
	}
	sort.Slice(connections, func(i, j int) bool { return connections[i][2] < connections[j][2] })
	var find func(int) int
	find = func(x int) int {
		if p[x] != x {
			p[x] = find(p[x])
		}
		return p[x]
	}
	for _, e := range connections {
		x, y, cost := e[0]-1, e[1]-1, e[2]
		if find(x) == find(y) {
			continue
		}
		p[find(x)] = find(y)
		ans += cost
		n--
		if n == 1 {
			return
		}
	}
	return -1
}
```

### Java

```java
// Connecting Cities With Minimum Cost：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] p;

    public int minimumCost(int n, int[][] connections) {
        Arrays.sort(connections, Comparator.comparingInt(a -> a[2]));
        p = new int[n];
        for (int i = 0; i < n; ++i) {
            p[i] = i;
        }
        int ans = 0;
        for (int[] e : connections) {
            int x = e[0] - 1, y = e[1] - 1, cost = e[2];
            if (find(x) == find(y)) {
                continue;
            }
            p[find(x)] = find(y);
            ans += cost;
            if (--n == 1) {
                return ans;
            }
        }
        return -1;
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
# Connecting Cities With Minimum Cost：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minimumCost(self, n: int, connections: List[List[int]]) -> int:
        def find(x):
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        connections.sort(key=lambda x: x[2])
        p = list(range(n))
        ans = 0
        for x, y, cost in connections:
            x, y = x - 1, y - 1
            if find(x) == find(y):
                continue
            p[find(x)] = find(y)
            ans += cost
            n -= 1
            if n == 1:
                return ans
        return -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

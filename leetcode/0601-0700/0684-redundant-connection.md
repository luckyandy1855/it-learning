# 0684. Redundant Connection

---
编号: 684
题目: Redundant Connection
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 并查集, 图]
来源链接: https://leetcode.com/problems/redundant-connection/
---

## 题目描述

树可以看成是一个连通且 **无环 **的 **无向 **图。

给定一个图，该图从一棵 `n` 个节点 (节点值 `1～n`) 的树中添加一条边后获得。添加的边的两个不同顶点编号在 `1` 到 `n` 中间，且这条附加的边不属于树中已存在的边。图的信息记录于长度为 `n` 的二维数组 `edges` ，`edges[i] = [ai, bi]` 表示图中在 `ai` 和 `bi` 之间存在一条边。

请找出一条可以删去的边，删除后可使得剩余部分是一个有着 `n` 个节点的树。如果有多个答案，则返回数组 `edges` 中最后出现的那个。

**示例 1：**

```text
输入: edges = [[1,2], [1,3], [2,3]]
输出: [2,3]
```

**示例 2：**

```text
输入: edges = [[1,2], [2,3], [3,4], [1,4], [1,5]]
输出: [1,4]
```

**提示:**

- `n == edges.length`

- `3 <= n <= 1000`

- `edges[i].length == 2`

- `1 <= ai < bi <= edges.length`

- `ai != bi`

- `edges` 中无重复元素

- 给定的图是连通的

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

根据题意，我们需要找到一条可以删去的边，删除后剩余部分是一个有着 $n$ 个节点的树。我们可以遍历每一条边，判断这条边是否在同一个连通分量中。如果在同一个连通分量中，则说明这条边是多余的，可以删除，直接返回这条边即可。否则，我们将这条边所连接的两个节点合并到同一个连通分量中。

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
// Redundant Connection：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findRedundantConnection(edges [][]int) []int {
	n := len(edges)
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
	for i := 0; ; i++ {
		pa, pb := find(edges[i][0]-1), find(edges[i][1]-1)
		if pa == pb {
			return edges[i]
		}
		p[pa] = pb
	}
}
```

### Java

```java
// Redundant Connection：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] p;

    public int[] findRedundantConnection(int[][] edges) {
        int n = edges.length;
        p = new int[n];
        for (int i = 0; i < n; ++i) {
            p[i] = i;
        }
        for (int i = 0;; ++i) {
            int pa = find(edges[i][0] - 1);
            int pb = find(edges[i][1] - 1);
            if (pa == pb) {
                return edges[i];
            }
            p[pa] = pb;
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
# Redundant Connection：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        def find(x: int) -> int:
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        p = list(range(len(edges)))
        for a, b in edges:
            pa, pb = find(a - 1), find(b - 1)
            if pa == pb:
                return [a, b]
            p[pa] = pb
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

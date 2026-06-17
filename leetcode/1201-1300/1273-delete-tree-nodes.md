# 1273. Delete Tree Nodes

---
编号: 1273
题目: Delete Tree Nodes
难度: 中等
标签: [树, 深度优先搜索, 广度优先搜索, 数组]
来源链接: https://leetcode.com/problems/delete-tree-nodes/
---

## 题目描述

给你一棵以节点 0 为根节点的树，定义如下：

- 节点的总数为 `nodes` 个；

- 第 `i` 个节点的值为 `value[i]` ；

- 第 `i` 个节点的父节点是 `parent[i]` 。

请你删除节点值之和为 0 的每一棵子树。

在完成所有删除之后，返回树中剩余节点的数目。

**示例 1：**

```text
输入：nodes = 7, parent = [-1,0,0,1,2,2,2], value = [1,-2,4,0,-2,-1,-1]
输出：2
```

**示例 2：**

```text
输入：nodes = 7, parent = [-1,0,0,1,2,2,2], value = [1,-2,4,0,-2,-1,-2]
输出：6
```

**示例 3：**

```text
输入：nodes = 5, parent = [-1,0,1,0,0], value = [-672,441,18,728,378]
输出：5
```

**示例 4：**

```text
输入：nodes = 5, parent = [-1,0,0,1,1], value = [-686,-842,616,-739,-746]
输出：5
```

**提示：**

- `1 <= nodes <= 10^4`

- `parent.length == nodes`

- `0 <= parent[i] <= nodes - 1`

- `parent[0] == -1` 表示节点 `0` 是树的根。

- `value.length == nodes`

- `-10^5 <= value[i] <= 10^5`

- 题目输入数据 **保证** 是一棵 **有效的树** 。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先将树转换成图 $g$，其中 $g[i]$ 表示节点 $i$ 的所有子节点。

然后我们设计一个函数 $dfs(i)$，表示以节点 $i$ 为根的子树的节点数目和权值之和。那么答案就是 $dfs(0)[1]$。

在这个函数中，我们递归地计算出以每个子节点 $j$ 为根的子树的节点数目和权值之和，然后将这些值进行累加，如果累加后的值为零，那么我们就将这个子树的节点数目置为零。最后我们返回以节点 $i$ 为根的子树的节点数目和权值之和。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是树的节点数目。

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
// Delete Tree Nodes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func deleteTreeNodes(nodes int, parent []int, value []int) int {
	g := make([][]int, nodes)
	for i := 1; i < nodes; i++ {
		g[parent[i]] = append(g[parent[i]], i)
	}
	type pair struct{ s, n int }
	var dfs func(int) pair
	dfs = func(i int) pair {
		s, m := value[i], 1
		for _, j := range g[i] {
			t := dfs(j)
			s += t.s
			m += t.n
		}
		if s == 0 {
			m = 0
		}
		return pair{s, m}
	}
	return dfs(0).n
}
```

### Java

```java
// Delete Tree Nodes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<Integer>[] g;
    private int[] value;

    public int deleteTreeNodes(int nodes, int[] parent, int[] value) {
        g = new List[nodes];
        Arrays.setAll(g, k -> new ArrayList<>());
        for (int i = 1; i < nodes; ++i) {
            g[parent[i]].add(i);
        }
        this.value = value;
        return dfs(0)[1];
    }

    private int[] dfs(int i) {
        int[] res = new int[] {value[i], 1};
        for (int j : g[i]) {
            int[] t = dfs(j);
            res[0] += t[0];
            res[1] += t[1];
        }
        if (res[0] == 0) {
            res[1] = 0;
        }
        return res;
    }
}
```

### Python

```python
# Delete Tree Nodes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def deleteTreeNodes(self, nodes: int, parent: List[int], value: List[int]) -> int:
        def dfs(i):
            s, m = value[i], 1
            for j in g[i]:
                t, n = dfs(j)
                s += t
                m += n
            if s == 0:
                m = 0
            return (s, m)

        g = defaultdict(list)
        for i in range(1, nodes):
            g[parent[i]].append(i)
        return dfs(0)[1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

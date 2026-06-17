# 1361. Validate Binary Tree Nodes

---
编号: 1361
题目: Validate Binary Tree Nodes
难度: 中等
标签: [树, 深度优先搜索, 广度优先搜索, 并查集, 图, 二叉树]
来源链接: https://leetcode.com/problems/validate-binary-tree-nodes/
---

## 题目描述

二叉树上有 `n` 个节点，按从 `0` 到 `n - 1` 编号，其中节点 `i` 的两个子节点分别是 `leftChild[i]` 和 `rightChild[i]`。

只有 **所有** 节点能够形成且 **只** 形成 **一颗** 有效的二叉树时，返回 `true`；否则返回 `false`。

如果节点 `i` 没有左子节点，那么 `leftChild[i]` 就等于 `-1`。右子节点也符合该规则。

注意：节点没有值，本问题中仅仅使用节点编号。

**示例 1：**

****

```text
输入：n = 4, leftChild = [1,-1,3,-1], rightChild = [2,-1,-1,-1]
输出：true
```

**示例 2：**

****

```text
输入：n = 4, leftChild = [1,-1,3,-1], rightChild = [2,3,-1,-1]
输出：false
```

**示例 3：**

****

```text
输入：n = 2, leftChild = [1,0], rightChild = [-1,-1]
输出：false
```

**提示：**

- `n == leftChild.length == rightChild.length`

- `1 <= n <= 10^4`

- `-1 <= leftChild[i], rightChild[i] <= n - 1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 并查集, 图, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以遍历每个节点 $i$ 以及对应的左右孩子 $l$, $r$，用 $vis$ 数组记录节点是否有父节点：

- 若孩子节点已存在父节点，说明有多个父亲，不满足条件，直接返回 `false`。
- 若孩子节点与父节点已经处于同一个连通分量，说明会形成环，不满足条件，直接返回 `false`。
- 否则，进行合并，并且将 $vis$ 数组对应位置置为 `true`，同时将连通分量个数减去 $1$。

遍历结束，判断并查集中连通分量个数是否为 $1$，若是返回 `true`，否则返回 `false`。

时间复杂度 $O(n \times \alpha(n))$，空间复杂度 $O(n)$。其中 $n$ 为节点个数，而 $\alpha(n)$ 为阿克曼函数的反函数，即反阿克曼函数，其值小于 $5$。

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
// Validate Binary Tree Nodes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func validateBinaryTreeNodes(n int, leftChild []int, rightChild []int) bool {
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
	vis := make([]bool, n)
	for i, a := range leftChild {
		for _, j := range []int{a, rightChild[i]} {
			if j != -1 {
				if vis[j] || find(i) == find(j) {
					return false
				}
				p[find(i)] = find(j)
				vis[j] = true
				n--
			}
		}
	}
	return n == 1
}
```

### Java

```java
// Validate Binary Tree Nodes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] p;

    public boolean validateBinaryTreeNodes(int n, int[] leftChild, int[] rightChild) {
        p = new int[n];
        for (int i = 0; i < n; ++i) {
            p[i] = i;
        }
        boolean[] vis = new boolean[n];
        for (int i = 0, m = n; i < m; ++i) {
            for (int j : new int[] {leftChild[i], rightChild[i]}) {
                if (j != -1) {
                    if (vis[j] || find(i) == find(j)) {
                        return false;
                    }
                    p[find(i)] = find(j);
                    vis[j] = true;
                    --n;
                }
            }
        }
        return n == 1;
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
# Validate Binary Tree Nodes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def validateBinaryTreeNodes(
        self, n: int, leftChild: List[int], rightChild: List[int]
    ) -> bool:
        def find(x: int) -> int:
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        p = list(range(n))
        vis = [False] * n
        for i, (a, b) in enumerate(zip(leftChild, rightChild)):
            for j in (a, b):
                if j != -1:
                    if vis[j] or find(i) == find(j):
                        return False
                    p[find(i)] = find(j)
                    vis[j] = True
                    n -= 1
        return n == 1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

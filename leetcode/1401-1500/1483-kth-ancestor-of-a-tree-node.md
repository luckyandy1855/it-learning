# 1483. Kth Ancestor of a Tree Node

---
编号: 1483
题目: Kth Ancestor of a Tree Node
难度: 困难
标签: [位运算, 树, 深度优先搜索, 广度优先搜索, 设计, 二分查找, 动态规划]
来源链接: https://leetcode.com/problems/kth-ancestor-of-a-tree-node/
---

## 题目描述

给你一棵树，树上有 `n` 个节点，按从 `0` 到 `n-1` 编号。树以父节点数组的形式给出，其中 `parent[i]` 是节点 `i` 的父节点。树的根节点是编号为 `0` 的节点。

树节点的第 *`k` *个祖先节点是从该节点到根节点路径上的第 `k` 个节点。

实现 `TreeAncestor` 类：

- `TreeAncestor（int n， int[] parent）` 对树和父数组中的节点数初始化对象。

- `getKthAncestor``(int node, int k)` 返回节点 `node` 的第 `k` 个祖先节点。如果不存在这样的祖先节点，返回 `-1` 。

**示例 1：**

****

```text
输入：
["TreeAncestor","getKthAncestor","getKthAncestor","getKthAncestor"]
[[7,[-1,0,0,1,1,2,2]],[3,1],[5,2],[6,3]]

输出：
[null,1,0,-1]

解释：
TreeAncestor treeAncestor = new TreeAncestor(7, [-1, 0, 0, 1, 1, 2, 2]);

treeAncestor.getKthAncestor(3, 1);  // 返回 1 ，它是 3 的父节点
treeAncestor.getKthAncestor(5, 2);  // 返回 0 ，它是 5 的祖父节点
treeAncestor.getKthAncestor(6, 3);  // 返回 -1 因为不存在满足要求的祖先节点
```

**提示：**

- `1 <= k <= n <= 5 * 10^4`

- `parent[0] == -1` 表示编号为 `0` 的节点是根节点。

- 对于所有的 `0 < i < n` ，`0 <= parent[i] < n` 总成立

- `0 <= node < n`

- 至多查询 `5 * 10^4` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 树, 深度优先搜索, 广度优先搜索, 设计, 二分查找, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目要我们寻找节点 $node$ 的第 $k$ 个祖先节点，如果暴力求解，需要从 $node$ 开始向上遍历 $k$ 次，时间复杂度为 $O(k)$，显然会超时。

我们可以使用动态规划，结合倍增的思想来处理。

我们定义 $p[i][j]$ 表示节点 $i$ 的第 $2^j$ 个祖先节点，即 $p[i][j]$ 表示节点 $i$ 向上走 $2^j$ 步的节点。那么我们可以得到状态转移方程：


p[i][j] = p[p[i][j-1]][j-1]


即：要想找到节点 $i$ 的第 $2^j$ 个祖先节点，我们可以先找到节点 $i$ 的第 $2^{j-1}$ 个祖先节点，然后再找到该节点的第 $2^{j-1}$ 个祖先节点即可。所以，我们要找到每个节点的距离为 $2^j$ 的祖先节点，直到达到树的最大高度。

之后对于每次查询，我们可以把 $k$ 拆成二进制的表示形式，然后根据二进制中 $1$ 的位置，累计向上查询，最终得到节点 $node$ 的第 $k$ 个祖先节点。

时间复杂度方面，初始化为 $O(n \times \log n)$，查询为 $O(\log n)$。空间复杂度 $O(n \times \log n)$。其中 $n$ 为树的节点数。

相似题目：

- [2836. 在传球游戏中最大化函数值](https://github.com/doocs/leetcode/blob/main/solution/2800-2899/2836.Maximize%20Value%20of%20Function%20in%20a%20Ball%20Passing%20Game/README.md)

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
// Kth Ancestor of a Tree Node：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type TreeAncestor struct {
	p [][18]int
}

func Constructor(n int, parent []int) TreeAncestor {
	p := make([][18]int, n)
	for i, fa := range parent {
		p[i][0] = fa
		for j := 1; j < 18; j++ {
			p[i][j] = -1
		}
	}
	for j := 1; j < 18; j++ {
		for i := range p {
			if p[i][j-1] == -1 {
				continue
			}
			p[i][j] = p[p[i][j-1]][j-1]
		}
	}
	return TreeAncestor{p}
}

func (this *TreeAncestor) GetKthAncestor(node int, k int) int {
	for i := 17; i >= 0; i-- {
		if k>>i&1 == 1 {
			node = this.p[node][i]
			if node == -1 {
				break
			}
		}
	}
	return node
}

/**
 * Your TreeAncestor object will be instantiated and called as such:
 * obj := Constructor(n, parent);
 * param_1 := obj.GetKthAncestor(node,k);
 */
```

### Java

```java
// Kth Ancestor of a Tree Node：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class TreeAncestor {
    private int[][] p;

    public TreeAncestor(int n, int[] parent) {
        p = new int[n][18];
        for (var e : p) {
            Arrays.fill(e, -1);
        }
        for (int i = 0; i < n; ++i) {
            p[i][0] = parent[i];
        }
        for (int j = 1; j < 18; ++j) {
            for (int i = 0; i < n; ++i) {
                if (p[i][j - 1] == -1) {
                    continue;
                }
                p[i][j] = p[p[i][j - 1]][j - 1];
            }
        }
    }

    public int getKthAncestor(int node, int k) {
        for (int i = 17; i >= 0; --i) {
            if (((k >> i) & 1) == 1) {
                node = p[node][i];
                if (node == -1) {
                    break;
                }
            }
        }
        return node;
    }
}

/**
 * Your TreeAncestor object will be instantiated and called as such:
 * TreeAncestor obj = new TreeAncestor(n, parent);
 * int param_1 = obj.getKthAncestor(node,k);
 */
```

### Python

```python
# Kth Ancestor of a Tree Node：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class TreeAncestor:
    def __init__(self, n: int, parent: List[int]):
        self.p = [[-1] * 18 for _ in range(n)]
        for i, fa in enumerate(parent):
            self.p[i][0] = fa
        for j in range(1, 18):
            for i in range(n):
                if self.p[i][j - 1] == -1:
                    continue
                self.p[i][j] = self.p[self.p[i][j - 1]][j - 1]

    def getKthAncestor(self, node: int, k: int) -> int:
        for i in range(17, -1, -1):
            if k >> i & 1:
                node = self.p[node][i]
                if node == -1:
                    break
        return node


# Your TreeAncestor object will be instantiated and called as such:
# obj = TreeAncestor(n, parent)
# param_1 = obj.getKthAncestor(node,k)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

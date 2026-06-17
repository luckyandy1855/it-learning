# 0987. Vertical Order Traversal of a Binary Tree

---
编号: 987
题目: Vertical Order Traversal of a Binary Tree
难度: 困难
标签: [树, 深度优先搜索, 广度优先搜索, 哈希表, 二叉树, 排序]
来源链接: https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/
---

## 题目描述

给你二叉树的根结点 `root` ，请你设计算法计算二叉树的* ***垂序遍历** 序列。

对位于 `(row, col)` 的每个结点而言，其左右子结点分别位于 `(row + 1, col - 1)` 和 `(row + 1, col + 1)` 。树的根结点位于 `(0, 0)` 。

二叉树的 **垂序遍历** 从最左边的列开始直到最右边的列结束，按列索引每一列上的所有结点，形成一个按出现位置从上到下排序的有序列表。如果同行同列上有多个结点，则按结点的值从小到大进行排序。

返回二叉树的 **垂序遍历** 序列。

示例 1：

```text
输入：root = [3,9,20,null,null,15,7]
输出：[[9],[3,15],[20],[7]]
解释：
列 -1 ：只有结点 9 在此列中。
列  0 ：只有结点 3 和 15 在此列中，按从上到下顺序。
列  1 ：只有结点 20 在此列中。
列  2 ：只有结点 7 在此列中。
```

示例 2：

```text
输入：root = [1,2,3,4,5,6,7]
输出：[[4],[2],[1,5,6],[3],[7]]
解释：
列 -2 ：只有结点 4 在此列中。
列 -1 ：只有结点 2 在此列中。
列  0 ：结点 1 、5 和 6 都在此列中。
          1 在上面，所以它出现在前面。
          5 和 6 位置都是 (2, 0) ，所以按值从小到大排序，5 在 6 的前面。
列  1 ：只有结点 3 在此列中。
列  2 ：只有结点 7 在此列中。
```

示例 3：

```text
输入：root = [1,2,3,4,6,5,7]
输出：[[4],[2],[1,5,6],[3],[7]]
解释：
这个示例实际上与示例 2 完全相同，只是结点 5 和 6 在树中的位置发生了交换。
因为 5 和 6 的位置仍然相同，所以答案保持不变，仍然按值从小到大排序。
```

**提示：**

- 树中结点数目总数在范围 `[1, 1000]` 内

- `0 <= Node.val <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 哈希表, 二叉树, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $dfs(root, i, j)$，其中 $i$ 和 $j$ 表示当前节点的行和列。我们可以通过深度优先搜索的方式，将节点的行和列信息记录下来，存储在一个数组或列表 $nodes$ 中，然后对 $nodes$ 按照列、行、值的顺序进行排序。

接着，我们遍历 $nodes$，将相同列的节点值放到同一个列表中，最后返回这些列表。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数。

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
// Vertical Order Traversal of a Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func verticalTraversal(root *TreeNode) (ans [][]int) {
	nodes := [][3]int{}
	var dfs func(*TreeNode, int, int)
	dfs = func(root *TreeNode, i, j int) {
		if root == nil {
			return
		}
		nodes = append(nodes, [3]int{j, i, root.Val})
		dfs(root.Left, i+1, j-1)
		dfs(root.Right, i+1, j+1)
	}
	dfs(root, 0, 0)
	sort.Slice(nodes, func(i, j int) bool {
		a, b := nodes[i], nodes[j]
		return a[0] < b[0] || a[0] == b[0] && (a[1] < b[1] || a[1] == b[1] && a[2] < b[2])
	})
	prev := -2000
	for _, node := range nodes {
		j, val := node[0], node[2]
		if j != prev {
			ans = append(ans, nil)
			prev = j
		}
		ans[len(ans)-1] = append(ans[len(ans)-1], val)
	}
	return
}
```

### Java

```java
// Vertical Order Traversal of a Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    private List<int[]> nodes = new ArrayList<>();

    public List<List<Integer>> verticalTraversal(TreeNode root) {
        dfs(root, 0, 0);
        Collections.sort(nodes, (a, b) -> {
            if (a[0] != b[0]) {
                return Integer.compare(a[0], b[0]);
            }
            if (a[1] != b[1]) {
                return Integer.compare(a[1], b[1]);
            }
            return Integer.compare(a[2], b[2]);
        });
        List<List<Integer>> ans = new ArrayList<>();
        int prev = -2000;
        for (int[] node : nodes) {
            int j = node[0], val = node[2];
            if (prev != j) {
                ans.add(new ArrayList<>());
                prev = j;
            }
            ans.get(ans.size() - 1).add(val);
        }

        return ans;
    }

    private void dfs(TreeNode root, int i, int j) {
        if (root == null) {
            return;
        }
        nodes.add(new int[] {j, i, root.val});
        dfs(root.left, i + 1, j - 1);
        dfs(root.right, i + 1, j + 1);
    }
}
```

### Python

```python
# Vertical Order Traversal of a Binary Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def verticalTraversal(self, root: Optional[TreeNode]) -> List[List[int]]:
        def dfs(root: Optional[TreeNode], i: int, j: int):
            if root is None:
                return
            nodes.append((j, i, root.val))
            dfs(root.left, i + 1, j - 1)
            dfs(root.right, i + 1, j + 1)

        nodes = []
        dfs(root, 0, 0)
        nodes.sort()
        ans = []
        prev = -2000
        for j, _, val in nodes:
            if prev != j:
                ans.append([])
                prev = j
            ans[-1].append(val)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

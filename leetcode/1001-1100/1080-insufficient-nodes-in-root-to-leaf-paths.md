# 1080. Insufficient Nodes in Root to Leaf Paths

---
编号: 1080
题目: Insufficient Nodes in Root to Leaf Paths
难度: 中等
标签: [树, 深度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/insufficient-nodes-in-root-to-leaf-paths/
---

## 题目描述

给你二叉树的根节点 `root` 和一个整数 `limit` ，请你同时删除树中所有 **不足节点 **，并返回最终二叉树的根节点。

假如通过节点 `node` 的每种可能的 “根-叶” 路径上值的总和全都小于给定的 `limit`，则该节点被称之为** 不足节点 **，需要被删除。

**叶子节点**，就是没有子节点的节点。

示例 1：

```text
输入：root = [1,2,3,4,-99,-99,7,8,9,-99,-99,12,13,-99,14], limit = 1
输出：[1,2,3,4,null,null,7,8,9,null,14]
```

示例 2：

```text
输入：root = [5,4,8,11,null,17,4,7,1,null,null,5,3], limit = 22
输出：[5,4,8,11,null,17,4,7,null,null,null,5]
```

示例 3：

```text
输入：root = [1,2,-3,-5,null,4,null], limit = -1
输出：[1,null,-3,4]
```

**提示：**

- 树中节点数目在范围 `[1, 5000]` 内

- `-10^5 <= Node.val <= 10^5`

- `-10^9 <= limit <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们递归遍历整棵树，对于当前遍历到的节点 $root$：

如果 $root$ 为空，那么返回空；否则，我们将 $limit$ 减去当前节点的值，即 $limit = limit - root.val$，然后继续执行下述步骤。

如果 $root$ 为叶子节点（即 $root$ 的左右子节点都为空），说明我们已经走完了一条从根节点到叶子节点的路径。如果此时 $limit \gt 0$，说明该路径上所有节点的值的和小于 $limit$，我们返回空节点，表示删除；否则，说明该路径上所有节点的值的和大于等于 $limit$，我们返回 $root$。

如果 $root$ 不是叶子节点，那么我们递归调用函数 $sufficientSubset$，对 $root$ 的左右子节点分别进行处理，并将返回值分别赋值给 $root$ 的左右子节点。

如果 $root$ 的左右子节点在经过递归调用后变成了空节点，那么说明 $root$ 的左右子树中所有从根节点到叶子节点的路径上所有节点的值的和都小于 $limit$，因此我们返回空节点，表示删除 $root$；否则，说明 $root$ 的左右子树中存在从根节点到叶子节点上所有节点值的和大于等于 $limit$ 的路径，因此我们返回 $root$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点个数。

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
// Insufficient Nodes in Root to Leaf Paths：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func sufficientSubset(root *TreeNode, limit int) *TreeNode {
	if root == nil {
		return nil
	}

	limit -= root.Val
	if root.Left == nil && root.Right == nil {
		if limit > 0 {
			return nil
		}
		return root
	}

	root.Left = sufficientSubset(root.Left, limit)
	root.Right = sufficientSubset(root.Right, limit)

	if root.Left == nil && root.Right == nil {
		return nil
	}
	return root
}
```

### Java

```java
// Insufficient Nodes in Root to Leaf Paths：按照上方思路实现主解法。
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
    public TreeNode sufficientSubset(TreeNode root, int limit) {
        if (root == null) {
            return null;
        }
        limit -= root.val;
        if (root.left == null && root.right == null) {
            return limit > 0 ? null : root;
        }
        root.left = sufficientSubset(root.left, limit);
        root.right = sufficientSubset(root.right, limit);
        return root.left == null && root.right == null ? null : root;
    }
}
```

### Python

```python
# Insufficient Nodes in Root to Leaf Paths：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def sufficientSubset(
        self, root: Optional[TreeNode], limit: int
    ) -> Optional[TreeNode]:
        if root is None:
            return None
        limit -= root.val
        if root.left is None and root.right is None:
            return None if limit > 0 else root
        root.left = self.sufficientSubset(root.left, limit)
        root.right = self.sufficientSubset(root.right, limit)
        return None if root.left is None and root.right is None else root
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

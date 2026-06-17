# 0101. Symmetric Tree

---
编号: 101
题目: Symmetric Tree
难度: 简单
标签: [树, 深度优先搜索, 广度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/symmetric-tree/
---

## 题目描述

给你一个二叉树的根节点 `root` ， 检查它是否轴对称。

**示例 1：**

```text
输入：root = [1,2,2,3,4,4,3]
输出：true
```

**示例 2：**

```text
输入：root = [1,2,2,null,3,null,3]
输出：false
```

**提示：**

	- 树中节点数目在范围 `[1, 1000]` 内

	- `-100 <= Node.val <= 100`

**进阶：**你可以运用递归和迭代两种方法解决这个问题吗？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $\textit{dfs}(\textit{root1}, \textit{root2})$，用于判断两个二叉树是否对称。答案即为 $\textit{dfs}(\textit{root.left}, \textit{root.right})$。

函数 $\textit{dfs}(\textit{root1}, \textit{root2})$ 的逻辑如下：

- 如果 $\textit{root1}$ 和 $\textit{root2}$ 都为空，则两个二叉树对称，返回 `true`；
- 如果 $\textit{root1}$ 和 $\textit{root2}$ 中只有一个为空，或者 $\textit{root1.val} \neq \textit{root2.val}$
- 否则，判断 $\textit{root1}$ 的左子树和 $\textit{root2}$ 的右子树是否对称，以及 $\textit{root1}$ 的右子树和 $\textit{root2}$ 的左子树是否对称，这里使用了递归。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数。

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
// Symmetric Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func isSymmetric(root *TreeNode) bool {
	var dfs func(root1, root2 *TreeNode) bool
	dfs = func(root1, root2 *TreeNode) bool {
		if root1 == root2 {
			return true
		}
		if root1 == nil || root2 == nil || root1.Val != root2.Val {
			return false
		}
		return dfs(root1.Left, root2.Right) && dfs(root1.Right, root2.Left)
	}
	return dfs(root.Left, root.Right)
}
```

### Java

```java
// Symmetric Tree：按照上方思路实现主解法。
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
    public boolean isSymmetric(TreeNode root) {
        return dfs(root.left, root.right);
    }

    private boolean dfs(TreeNode root1, TreeNode root2) {
        if (root1 == root2) {
            return true;
        }
        if (root1 == null || root2 == null || root1.val != root2.val) {
            return false;
        }
        return dfs(root1.left, root2.right) && dfs(root1.right, root2.left);
    }
}
```

### Python

```python
# Symmetric Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def dfs(root1: Optional[TreeNode], root2: Optional[TreeNode]) -> bool:
            if root1 == root2:
                return True
            if root1 is None or root2 is None or root1.val != root2.val:
                return False
            return dfs(root1.left, root2.right) and dfs(root1.right, root2.left)

        return dfs(root.left, root.right)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

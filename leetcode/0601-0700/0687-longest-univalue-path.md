# 0687. Longest Univalue Path

---
编号: 687
题目: Longest Univalue Path
难度: 中等
标签: [树, 深度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/longest-univalue-path/
---

## 题目描述

给定一个二叉树的 `root` ，返回 *最长的路径的长度* ，这个路径中的 *每个节点具有相同值* 。 这条路径可以经过也可以不经过根节点。

**两个节点之间的路径长度** 由它们之间的边数表示。

**示例 1:**

```text
输入：root = [5,4,5,1,1,5]
输出：2
```

**示例 2:**

```text
输入：root = [1,4,5,4,4,5]
输出：2
```

**提示:**

- 树的节点数的范围是 `[0, 10^4]`

- `-1000 <= Node.val <= 1000`

- 树的深度将不超过 `1000`

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

我们设计一个函数 $\textit{dfs}(root)$，表示以 $\textit{root}$ 节点作为路径的其中一个端点，向下延伸的最长同值路径长度。

在 $\textit{dfs}(root)$ 中，我们首先递归调用 $\textit{dfs}(root.\textit{left})$ 和 $\textit{dfs}(root.\textit{right})$，得到两个返回值 $\textit{l}$ 和 $\textit{r}$。这两个返回值分别代表了以 $\textit{root}$ 节点的左孩子和右孩子为路径的其中一个端点，向下延伸的最长同值路径长度。

如果 $\textit{root}$ 存在左孩子且 $\textit{root}.\textit{val} = \textit{root}.\textit{left}.\textit{val}$，那么在 $\textit{root}$ 的左孩子为路径的其中一个端点，向下延伸的最长同值路径长度应为 $\textit{l} + 1$；否则，这个长度为 $0$。如果 $\textit{root}$ 存在右孩子且 $\textit{root}.\textit{val} = \textit{root}.\textit{right}.\textit{val}$，那么在 $\textit{root}$ 的右孩子为路径的其中一个端点，向下延伸的最长同值路径长度应为 $\textit{r} + 1$；否则，这个长度为 $0$。

在递归调用完左右孩子之后，我们更新答案为 $\max(\textit{ans}, \textit{l} + \textit{r})$，即以 $\textit{root}$ 为端点的路径经过 $\textit{root}$ 的最长同值路径长度。

最后，$\textit{dfs}(root)$ 函数返回以 $\textit{root}$ 为端点的向下延伸的最长同值路径长度，即 $\max(\textit{l}, \textit{r})$。

在主函数中，我们调用 $\textit{dfs}(root)$，即可得到答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为二叉树的节点个数。

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
// Longest Univalue Path：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func longestUnivaluePath(root *TreeNode) (ans int) {
	var dfs func(*TreeNode) int
	dfs = func(root *TreeNode) int {
		if root == nil {
			return 0
		}
		l, r := dfs(root.Left), dfs(root.Right)
		if root.Left != nil && root.Left.Val == root.Val {
			l++
		} else {
			l = 0
		}
		if root.Right != nil && root.Right.Val == root.Val {
			r++
		} else {
			r = 0
		}
		ans = max(ans, l+r)
		return max(l, r)
	}
	dfs(root)
	return
}
```

### Java

```java
// Longest Univalue Path：按照上方思路实现主解法。
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
    private int ans;

    public int longestUnivaluePath(TreeNode root) {
        dfs(root);
        return ans;
    }

    private int dfs(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int l = dfs(root.left);
        int r = dfs(root.right);
        l = root.left != null && root.left.val == root.val ? l + 1 : 0;
        r = root.right != null && root.right.val == root.val ? r + 1 : 0;
        ans = Math.max(ans, l + r);
        return Math.max(l, r);
    }
}
```

### Python

```python
# Longest Univalue Path：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def longestUnivaluePath(self, root: Optional[TreeNode]) -> int:
        def dfs(root: Optional[TreeNode]) -> int:
            if root is None:
                return 0
            l, r = dfs(root.left), dfs(root.right)
            l = l + 1 if root.left and root.left.val == root.val else 0
            r = r + 1 if root.right and root.right.val == root.val else 0
            nonlocal ans
            ans = max(ans, l + r)
            return max(l, r)

        ans = 0
        dfs(root)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

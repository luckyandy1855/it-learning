# 1008. Construct Binary Search Tree from Preorder Traversal

---
编号: 1008
题目: Construct Binary Search Tree from Preorder Traversal
难度: 中等
标签: [栈, 树, 二叉搜索树, 数组, 二叉树, 单调栈]
来源链接: https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/
---

## 题目描述

给定一个整数数组，它表示BST(即 **二叉搜索树** )的 **先****序遍历** ，构造树并返回其根。

**保证** 对于给定的测试用例，总是有可能找到具有给定需求的二叉搜索树。

**二叉搜索树** 是一棵二叉树，其中每个节点， `Node.left` 的任何后代的值 **严格小于** `Node.val` , `Node.right` 的任何后代的值 **严格大于** `Node.val`。

二叉树的 **前序遍历** 首先显示节点的值，然后遍历`Node.left`，最后遍历`Node.right`。

**示例 1：**

```text
输入：preorder = [8,5,1,7,10,12]
输出：[8,5,10,1,7,null,12]
```

**示例 2:**

```text
输入: preorder = [1,3]
输出: [1,null,3]
```

**提示：**

- `1 <= preorder.length <= 100`

- `1 <= preorder[i] <= 10^8`

- `preorder` 中的值 **互不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 树, 二叉搜索树, 数组, 二叉树, 单调栈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $\textit{dfs}(i, j)$，表示构造出从 $\textit{preorder}[i]$ 到 $\textit{preorder}[j]$ 这些节点构成的二叉搜索树。那么答案就是 $\textit{dfs}(0, n - 1)$。

在 $\textit{dfs}(i, j)$ 中，我们首先构造根节点，即 $\textit{preorder}[i]$。然后使用二分查找的方法找到第一个大于 $\textit{preorder}[i]$ 的节点的下标 $\textit{mid}$，将 $\textit{dfs}(i + 1, \textit{mid} - 1)$ 作为根节点的左子树，将 $\textit{dfs}(\textit{mid}, j)$ 作为根节点的右子树。

最后返回根节点即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\textit{preorder}$ 的长度。

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
// Construct Binary Search Tree from Preorder Traversal：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func bstFromPreorder(preorder []int) *TreeNode {
	var dfs func(i, j int) *TreeNode
	dfs = func(i, j int) *TreeNode {
		if i > j {
			return nil
		}
		root := &TreeNode{Val: preorder[i]}
		l, r := i+1, j+1
		for l < r {
			mid := (l + r) >> 1
			if preorder[mid] > preorder[i] {
				r = mid
			} else {
				l = mid + 1
			}
		}
		root.Left = dfs(i+1, l-1)
		root.Right = dfs(l, j)
		return root
	}
	return dfs(0, len(preorder)-1)
}
```

### Java

```java
// Construct Binary Search Tree from Preorder Traversal：按照上方思路实现主解法。
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
    private int[] preorder;

    public TreeNode bstFromPreorder(int[] preorder) {
        this.preorder = preorder;
        return dfs(0, preorder.length - 1);
    }

    private TreeNode dfs(int i, int j) {
        if (i > j) {
            return null;
        }
        TreeNode root = new TreeNode(preorder[i]);
        int l = i + 1, r = j + 1;
        while (l < r) {
            int mid = (l + r) >> 1;
            if (preorder[mid] > preorder[i]) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        root.left = dfs(i + 1, l - 1);
        root.right = dfs(l, j);
        return root;
    }
}
```

### Python

```python
# Construct Binary Search Tree from Preorder Traversal：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def bstFromPreorder(self, preorder: List[int]) -> Optional[TreeNode]:
        def dfs(i: int, j: int) -> Optional[TreeNode]:
            if i > j:
                return None
            root = TreeNode(preorder[i])
            l, r = i + 1, j + 1
            while l < r:
                mid = (l + r) >> 1
                if preorder[mid] > preorder[i]:
                    r = mid
                else:
                    l = mid + 1
            root.left = dfs(i + 1, l - 1)
            root.right = dfs(l, j)
            return root

        return dfs(0, len(preorder) - 1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

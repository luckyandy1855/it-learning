# 1373. Maximum Sum BST in Binary Tree

---
编号: 1373
题目: Maximum Sum BST in Binary Tree
难度: 困难
标签: [树, 深度优先搜索, 二叉搜索树, 动态规划, 二叉树]
来源链接: https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/
---

## 题目描述

给你一棵以 `root` 为根的 **二叉树** ，请你返回 **任意** 二叉搜索子树的最大键值和。

二叉搜索树的定义如下：

- 任意节点的左子树中的键值都 **小于** 此节点的键值。

- 任意节点的右子树中的键值都 **大于** 此节点的键值。

- 任意节点的左子树和右子树都是二叉搜索树。

**示例 1：**

```text
输入：root = [1,4,3,2,4,2,5,null,null,null,null,null,null,4,6]
输出：20
解释：键值为 3 的子树是和最大的二叉搜索树。
```

**示例 2：**

```text
输入：root = [4,3,null,1,2]
输出：2
解释：键值为 2 的单节点子树是和最大的二叉搜索树。
```

**示例 3：**

```text
输入：root = [-4,-2,-5]
输出：0
解释：所有节点键值都为负数，和最大的二叉搜索树为空。
```

**示例 4：**

```text
输入：root = [2,1,3]
输出：6
```

**示例 5：**

```text
输入：root = [5,4,8,3,null,6,3]
输出：7
```

**提示：**

- 每棵树有 `1` 到 `40000` 个节点。

- 每个节点的键值在 `[-4 * 10^4 , 4 * 10^4]` 之间。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 二叉搜索树, 动态规划, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

判断一棵树是否是二叉搜索树，需要满足以下四个条件：

- 左子树是二叉搜索树；
- 右子树是二叉搜索树；
- 左子树的最大值小于根节点的值；
- 右子树的最小值大于根节点的值。

因此，我们设计一个函数 $dfs(root)$，函数的返回值是一个四元组 $(bst, mi, mx, s)$，其中：

- 数字 $bst$ 表示以 $root$ 为根的树是否是二叉搜索树。如果是二叉搜索树，则 $bst = 1$；否则 $bst = 0$；
- 数字 $mi$ 表示以 $root$ 为根的树的最小值；
- 数字 $mx$ 表示以 $root$ 为根的树的最大值；
- 数字 $s$ 表示以 $root$ 为根的树的所有节点的和。

函数 $dfs(root)$ 的执行逻辑如下：

如果 $root$ 为空节点，则返回 $(1, +\infty, -\infty, 0)$，表示空树是二叉搜索树，最小值和最大值分别为正无穷和负无穷，节点和为 $0$。

否则，递归计算 $root$ 的左子树和右子树，分别得到 $(lbst, lmi, lmx, ls)$ 和 $(rbst, rmi, rmx, rs)$，然后判断 $root$ 节点是否满足二叉搜索树的条件。

如果满足 $lbst = 1$ 且 $rbst = 1$ 且 $lmx \lt root.val \lt rmi$，则以 $root$ 为根的树是二叉搜索树，节点和 $s= ls + rs + root.val$。我们更新答案 $ans = \max(ans, s)$，并返回 $(1, \min(lmi, root.val), \max(rmx, root.val), s)$。

否则，以 $root$ 为根的树不是二叉搜索树，我们返回 $(0, 0, 0, 0)$。

我们在主函数中调用 $dfs(root)$，执行完毕后，答案即为 $ans$。

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
// Maximum Sum BST in Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func maxSumBST(root *TreeNode) (ans int) {
	const inf = 1 << 30
	var dfs func(root *TreeNode) [4]int
	dfs = func(root *TreeNode) [4]int {
		if root == nil {
			return [4]int{1, inf, -inf, 0}
		}
		l, r := dfs(root.Left), dfs(root.Right)
		if l[0] == 1 && r[0] == 1 && l[2] < root.Val && root.Val < r[1] {
			s := l[3] + r[3] + root.Val
			ans = max(ans, s)
			return [4]int{1, min(l[1], root.Val), max(r[2], root.Val), s}
		}
		return [4]int{}
	}
	dfs(root)
	return
}
```

### Java

```java
// Maximum Sum BST in Binary Tree：按照上方思路实现主解法。
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
    private final int inf = 1 << 30;

    public int maxSumBST(TreeNode root) {
        dfs(root);
        return ans;
    }

    private int[] dfs(TreeNode root) {
        if (root == null) {
            return new int[] {1, inf, -inf, 0};
        }
        var l = dfs(root.left);
        var r = dfs(root.right);
        int v = root.val;
        if (l[0] == 1 && r[0] == 1 && l[2] < v && r[1] > v) {
            int s = v + l[3] + r[3];
            ans = Math.max(ans, s);
            return new int[] {1, Math.min(l[1], v), Math.max(r[2], v), s};
        }
        return new int[4];
    }
}
```

### Python

```python
# Maximum Sum BST in Binary Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxSumBST(self, root: Optional[TreeNode]) -> int:
        def dfs(root: Optional[TreeNode]) -> tuple:
            if root is None:
                return 1, inf, -inf, 0
            lbst, lmi, lmx, ls = dfs(root.left)
            rbst, rmi, rmx, rs = dfs(root.right)
            if lbst and rbst and lmx < root.val < rmi:
                nonlocal ans
                s = ls + rs + root.val
                ans = max(ans, s)
                return 1, min(lmi, root.val), max(rmx, root.val), s
            return 0, 0, 0, 0

        ans = 0
        dfs(root)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

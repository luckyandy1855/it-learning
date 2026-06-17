# 0250. Count Univalue Subtrees

---
编号: 250
题目: Count Univalue Subtrees
难度: 中等
标签: [树, 深度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/count-univalue-subtrees/
---

## 题目描述

给定一个二叉树，统计该二叉树数值相同的 子树 个数。

同值子树是指该子树的所有节点都拥有相同的数值。

示例 1：

```text
输入：root = [5,1,5,5,5,null,5]
输出：4
```

示例 2：

```text
输入：root = []
输出：0
```

示例 3：

```text
输入：root = [5,5,5,5,5,null,5]
输出：6
```

**提示：**

- 树中节点的编号在 `[0, 1000]` 范围内

- `-1000 <= Node.val <= 1000`

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

我们设计一个递归函数 $dfs(root)$，该函数返回以 $root$ 为根的子树中所有节点的值是否相同。

函数 $dfs(root)$ 的递归过程如下：

- 如果 $root$ 为空，则返回 `true`；
- 否则，我们递归地计算 $root$ 的左右子树，记为 $l$ 和 $r$；如果 $l$ 为 `false` 或者 $r$ 为 `false`，则返回 `false`；如果 $root$ 的左子树不为空且 $root$ 的左子树的值不等于 $root$ 的值，或者 $root$ 的右子树不为空且 $root$ 的右子树的值不等于 $root$ 的值，则返回 `false`；否则，我们将答案加一，并返回 `true`。

递归结束后，返回答案即可。

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
// Count Univalue Subtrees：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func countUnivalSubtrees(root *TreeNode) (ans int) {
	var dfs func(*TreeNode) bool
	dfs = func(root *TreeNode) bool {
		if root == nil {
			return true
		}
		l, r := dfs(root.Left), dfs(root.Right)
		if !l || !r {
			return false
		}
		if root.Left != nil && root.Left.Val != root.Val {
			return false
		}
		if root.Right != nil && root.Right.Val != root.Val {
			return false
		}
		ans++
		return true
	}
	dfs(root)
	return
}
```

### Java

```java
import java.util.*;
// Count Univalue Subtrees：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
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

    public int countUnivalSubtrees(TreeNode root) {
        dfs(root);
        return ans;
    }

    private boolean dfs(TreeNode root) {
        if (root == null) {
            return true;
        }
        boolean l = dfs(root.left);
        boolean r = dfs(root.right);
        if (!l || !r) {
            return false;
        }
        int a = root.left == null ? root.val : root.left.val;
        int b = root.right == null ? root.val : root.right.val;
        if (a == b && b == root.val) {
            ++ans;
            return true;
        }
        return false;
    }
}
```

### Python

```python
# Count Univalue Subtrees：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def countUnivalSubtrees(self, root: Optional[TreeNode]) -> int:
        def dfs(root):
            if root is None:
                return True
            l, r = dfs(root.left), dfs(root.right)
            if not l or not r:
                return False
            a = root.val if root.left is None else root.left.val
            b = root.val if root.right is None else root.right.val
            if a == b == root.val:
                nonlocal ans
                ans += 1
                return True
            return False

        ans = 0
        dfs(root)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

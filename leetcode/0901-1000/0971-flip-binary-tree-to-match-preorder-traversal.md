# 0971. Flip Binary Tree To Match Preorder Traversal

---
编号: 971
题目: Flip Binary Tree To Match Preorder Traversal
难度: 中等
标签: [树, 深度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/flip-binary-tree-to-match-preorder-traversal/
---

## 题目描述

给你一棵二叉树的根节点 `root` ，树中有 `n` 个节点，每个节点都有一个不同于其他节点且处于 `1` 到 `n` 之间的值。

另给你一个由 `n` 个值组成的行程序列 `voyage` ，表示 **预期** 的二叉树 **先序遍历** 结果。

通过交换节点的左右子树，可以 **翻转** 该二叉树中的任意节点。例，翻转节点 1 的效果如下：

请翻转 **最少 **的树中节点，使二叉树的 **先序遍历** 与预期的遍历行程 `voyage` **相匹配** 。

如果可以，则返回 **翻转的** 所有节点的值的列表。你可以按任何顺序返回答案。如果不能，则返回列表 `[-1]`。

**示例 1：**

```text
输入：root = [1,2], voyage = [2,1]
输出：[-1]
解释：翻转节点无法令先序遍历匹配预期行程。
```

**示例 2：**

```text
输入：root = [1,2,3], voyage = [1,3,2]
输出：[1]
解释：交换节点 2 和 3 来翻转节点 1 ，先序遍历可以匹配预期行程。
```

**示例 3：**

```text
输入：root = [1,2,3], voyage = [1,2,3]
输出：[]
解释：先序遍历已经匹配预期行程，所以不需要翻转节点。
```

**提示：**

- 树中的节点数目为 `n`

- `n == voyage.length`

- `1 <= n <= 100`

- `1 <= Node.val, voyage[i] <= n`

- 树中的所有值 **互不相同**

- `voyage` 中的所有值 **互不相同**

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

我们可以通过深度优先搜索的方式遍历整棵树，用一个下标 $i$ 记录当前遍历到的节点在数组 $\textit{voyage}$ 中的下标，如果当前遍历到的节点的值不等于 $\textit{voyage}[i]$，那么说明翻转后无法匹配，我们标记 $\textit{ok}$ 为 `false`，并直接返回。否则，我们将 $i$ 的值加 $1$，然后判断当前节点是否有左子节点，如果没有，或者左子节点的值等于 $\textit{voyage}[i]$，那么我们递归遍历当前的左右子节点；否则，我们需要翻转当前节点，然后再递归遍历当前的右子节点和左子节点。

搜索结束后，如果 $\textit{ok}$ 为 `true`，那么说明翻转后可以匹配，我们返回答案数组 $\textit{ans}$，否则返回 $[-1]$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是树中的节点数目。

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
// Flip Binary Tree To Match Preorder Traversal：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func flipMatchVoyage(root *TreeNode, voyage []int) []int {
	i := 0
	ok := true
	ans := []int{}
	var dfs func(*TreeNode)
	dfs = func(root *TreeNode) {
		if root == nil || !ok {
			return
		}
		if root.Val != voyage[i] {
			ok = false
			return
		}
		i++
		if root.Left == nil || root.Left.Val == voyage[i] {
			dfs(root.Left)
			dfs(root.Right)
		} else {
			ans = append(ans, root.Val)
			dfs(root.Right)
			dfs(root.Left)
		}
	}
	dfs(root)
	if !ok {
		return []int{-1}
	}
	return ans
}
```

### Java

```java
// Flip Binary Tree To Match Preorder Traversal：按照上方思路实现主解法。
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
    private int i;
    private boolean ok;
    private int[] voyage;
    private List<Integer> ans = new ArrayList<>();

    public List<Integer> flipMatchVoyage(TreeNode root, int[] voyage) {
        this.voyage = voyage;
        ok = true;
        dfs(root);
        return ok ? ans : List.of(-1);
    }

    private void dfs(TreeNode root) {
        if (root == null || !ok) {
            return;
        }
        if (root.val != voyage[i]) {
            ok = false;
            return;
        }
        ++i;
        if (root.left == null || root.left.val == voyage[i]) {
            dfs(root.left);
            dfs(root.right);
        } else {
            ans.add(root.val);
            dfs(root.right);
            dfs(root.left);
        }
    }
}
```

### Python

```python
# Flip Binary Tree To Match Preorder Traversal：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def flipMatchVoyage(self, root: Optional[TreeNode], voyage: List[int]) -> List[int]:
        def dfs(root):
            nonlocal i, ok
            if root is None or not ok:
                return
            if root.val != voyage[i]:
                ok = False
                return
            i += 1
            if root.left is None or root.left.val == voyage[i]:
                dfs(root.left)
                dfs(root.right)
            else:
                ans.append(root.val)
                dfs(root.right)
                dfs(root.left)

        ans = []
        i = 0
        ok = True
        dfs(root)
        return ans if ok else [-1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

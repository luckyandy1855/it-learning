# 1469. Find All The Lonely Nodes

---
编号: 1469
题目: Find All The Lonely Nodes
难度: 简单
标签: [树, 深度优先搜索, 广度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/find-all-the-lonely-nodes/
---

## 题目描述

二叉树中，如果一个节点是其父节点的唯一子节点，则称这样的节点为 “**独生节点**” 。二叉树的根节点不会是独生节点，因为它没有父节点。

给定一棵二叉树的根节点 `root` ，返回树中** 所有的独生节点的值所构成的数组** 。数组的顺序** 不限 **。

示例 1：

```text
输入：root = [1,2,3,null,4]
输出：[4]
解释：浅蓝色的节点是唯一的独生节点。
节点 1 是根节点，不是独生的。
节点 2 和 3 有共同的父节点，所以它们都不是独生的。
```

示例 2：

```text
输入：root = [7,1,4,6,null,5,3,null,null,null,null,null,2]
输出：[6,2]
输出：浅蓝色的节点是独生节点。
请谨记，顺序是不限的。 [2,6] 也是一种可接受的答案。
```

示例 3：

** **

```text
输入：root = [11,99,88,77,null,null,66,55,null,null,44,33,null,null,22]
输出：[77,55,33,66,44,22]
解释：节点 99 和 88 有共同的父节点，节点 11 是根节点。
其他所有节点都是独生节点。
```

**提示：**

- `tree` 中节点个数的取值范围是 `[1, 1000]`。

- `1 <= Node.val <= 10^6`

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

我们可以使用深度优先搜索遍历整棵树，设计一个函数 $\textit{dfs}$，它的作用是遍历树中的每个节点，如果当前节点是独生节点，那么将其值加入答案数组中。函数 $\textit{dfs}$ 的执行过程如下：

1. 如果当前节点为空，或者当前节点是叶子节点，即当前节点的左右子节点都为空，那么直接返回。
2. 如果当前节点的左子节点为空，那么将当前节点的右子节点是独生节点，将其值加入答案数组中。
3. 如果当前节点的右子节点为空，那么将当前节点的左子节点是独生节点，将其值加入答案数组中。
4. 递归遍历当前节点的左子节点和右子节点。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树中节点的个数。

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
// Find All The Lonely Nodes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
 func getLonelyNodes(root *TreeNode) (ans []int) {
	var dfs func(*TreeNode)
	dfs = func(root *TreeNode) {
		if root == nil || (root.Left == root.Right) {
			return
		}
		if root.Left == nil {
			ans = append(ans, root.Right.Val)
		}
		if root.Right == nil {
			ans = append(ans, root.Left.Val)
		}
		dfs(root.Left)
		dfs(root.Right)
	}
	dfs(root)
	return
}
```

### Java

```java
// Find All The Lonely Nodes：按照上方思路实现主解法。
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
    private List<Integer> ans = new ArrayList<>();

    public List<Integer> getLonelyNodes(TreeNode root) {
        dfs(root);
        return ans;
    }

    private void dfs(TreeNode root) {
        if (root == null || (root.left == root.right)) {
            return;
        }
        if (root.left == null) {
            ans.add(root.right.val);
        }
        if (root.right == null) {
            ans.add(root.left.val);
        }
        dfs(root.left);
        dfs(root.right);
    }
}
```

### Python

```python
# Find All The Lonely Nodes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def getLonelyNodes(self, root: Optional[TreeNode]) -> List[int]:
        def dfs(root: Optional[TreeNode]):
            if root is None or root.left == root.right:
                return
            if root.left is None:
                ans.append(root.right.val)
            if root.right is None:
                ans.append(root.left.val)
            dfs(root.left)
            dfs(root.right)

        ans = []
        dfs(root)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

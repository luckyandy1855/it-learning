# 1430. Check If a String Is a Valid Sequence from Root to Leaves Path in a Binary Tree

---
编号: 1430
题目: Check If a String Is a Valid Sequence from Root to Leaves Path in a Binary Tree
难度: 中等
标签: [树, 深度优先搜索, 广度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/check-if-a-string-is-a-valid-sequence-from-root-to-leaves-path-in-a-binary-tree/
---

## 题目描述

给定一个二叉树，我们称从根节点到任意叶节点的任意路径中的节点值所构成的序列为该二叉树的一个 &ldquo;**有效序列**&rdquo; 。检查一个给定的序列是否是给定二叉树的一个 &ldquo;**有效序列**&rdquo; 。

我们以整数数组 `arr` 的形式给出这个序列。从根节点到任意叶节点的任意路径中的节点值所构成的序列都是这个二叉树的 &ldquo;**有效序列**&rdquo; 。

**示例 1：**

****

```text
输入：root = [0,1,0,0,1,0,null,null,1,0,0], arr = [0,1,0,1]
输出：true
解释：
路径 0 -> 1 -> 0 -> 1 是一个&ldquo;有效序列&rdquo;（图中的绿色节点）。
其他的&ldquo;有效序列&rdquo;是：
0 -> 1 -> 1 -> 0
0 -> 0 -> 0
```

**示例 2：**

****

```text
输入：root = [0,1,0,0,1,0,null,null,1,0,0], arr = [0,0,1]
输出：false
解释：路径 0 -> 0 -> 1 不存在，所以这不是一个&ldquo;序列&rdquo;。
```

**示例 3：**

****

```text
输入：root = [0,1,0,0,1,0,null,null,1,0,0], arr = [0,1,1]
输出：false
解释：路径 0 -> 1 -> 1 是一个序列，但不是一个&ldquo;有效序列&rdquo;（译者注：因为序列的终点不是叶节点）。
```

**提示：**

- `1 <= arr.length <= 5000`

- `0 <= arr[i] <= 9`

- 每个节点的值的取值范围是 `[0 - 9]`

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

根据题目，我们设计一个递归函数 $dfs(root, u)$，表示从当前节点 $root$ 开始，且当前已经遍历到数组的第 $u$ 个元素，是否存在一条从根节点到叶子节点的路径，且路径上的元素与数组中的元素一一对应。那么答案就是 $dfs(root, 0)$。

在递归函数中，如果当前节点为空，或者当前节点的值与数组中的值不相等，那么直接返回 $false$。如果当前节点是叶子节点，且当前节点的值与数组中的值相等，那么返回 $u$ 是否等于数组的长度减 $1$。否则，返回 $dfs(root.left, u + 1)$ 或者 $dfs(root.right, u + 1)$。

时间复杂度 $O(n)$，空间复杂度 $O(\log n)$。其中 $n$ 是二叉树的节点个数。

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
// Check If a String Is a Valid Sequence from Root to Leaves Path in a Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func isValidSequence(root *TreeNode, arr []int) bool {
	var dfs func(root *TreeNode, u int) bool
	dfs = func(root *TreeNode, u int) bool {
		if root == nil || root.Val != arr[u] {
			return false
		}
		if u == len(arr)-1 {
			return root.Left == nil && root.Right == nil
		}
		return dfs(root.Left, u+1) || dfs(root.Right, u+1)
	}
	return dfs(root, 0)
}
```

### Java

```java
// Check If a String Is a Valid Sequence from Root to Leaves Path in a Binary Tree：按照上方思路实现主解法。
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
    private int[] arr;

    public boolean isValidSequence(TreeNode root, int[] arr) {
        this.arr = arr;
        return dfs(root, 0);
    }

    private boolean dfs(TreeNode root, int u) {
        if (root == null || root.val != arr[u]) {
            return false;
        }
        if (u == arr.length - 1) {
            return root.left == null && root.right == null;
        }
        return dfs(root.left, u + 1) || dfs(root.right, u + 1);
    }
}
```

### Python

```python
# Check If a String Is a Valid Sequence from Root to Leaves Path in a Binary Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isValidSequence(self, root: TreeNode, arr: List[int]) -> bool:
        def dfs(root, u):
            if root is None or root.val != arr[u]:
                return False
            if u == len(arr) - 1:
                return root.left is None and root.right is None
            return dfs(root.left, u + 1) or dfs(root.right, u + 1)

        return dfs(root, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

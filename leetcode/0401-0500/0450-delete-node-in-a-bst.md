# 0450. Delete Node in a BST

---
编号: 450
题目: Delete Node in a BST
难度: 中等
标签: [树, 二叉搜索树, 二叉树]
来源链接: https://leetcode.com/problems/delete-node-in-a-bst/
---

## 题目描述

给定一个二叉搜索树的根节点 **root **和一个值 **key**，删除二叉搜索树中的 **key **对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。

一般来说，删除节点可分为两个步骤：

- 首先找到需要删除的节点；

- 如果找到了，删除它。

**示例 1:**

```text
输入：root = [5,3,6,2,4,null,7], key = 3
输出：[5,4,6,2,null,null,7]
解释：给定需要删除的节点值是 3，所以我们首先找到 3 这个节点，然后删除它。
一个正确的答案是 [5,4,6,2,null,null,7], 如下图所示。
另一个正确答案是 [5,2,6,null,4,null,7]。
```

**示例 2:**

```text
输入: root = [5,3,6,2,4,null,7], key = 0
输出: [5,3,6,2,4,null,7]
解释: 二叉树不包含值为 0 的节点
```

**示例 3:**

```text
输入: root = [], key = 0
输出: []
```

**提示:**

- 节点数的范围 `[0, 10^4]`.

- `-10^5 <= Node.val <= 10^5`

- 节点值唯一

- `root` 是合法的二叉搜索树

- `-10^5 <= key <= 10^5`

**进阶：** 要求算法时间复杂度为 O(h)，h 为树的高度。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 二叉搜索树, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

二叉搜索树有以下性质：

1. 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
1. 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
1. 任意节点的左、右子树也分别为二叉搜索树。

我们可以递归判断当前节点 $root$ 与 $key$ 的大小关系：

1. 若 $root.val>key$，则递归左子树；
1. 若 $root.val<key$，则递归右子树；
1. 若 $root.val=key$，则进一步判断：
    1. 若 $root$ 没有左子树，则 $root.right$ 顶替 $root$ 的位置；
    1. 若 $root$ 没有右子树，则 $root.left$ 顶替 $root$ 的位置；
    1. 若 $root$ 同时存在左右子树，则将左子树转移至右子树的最左节点的左子树上，然后 $root.right$ 顶替 $root$ 的位置。

时间复杂度 $O(H)$，其中 $H$ 是树的高度。

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
// Delete Node in a BST：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func deleteNode(root *TreeNode, key int) *TreeNode {
	if root == nil {
		return nil
	}
	if root.Val > key {
		root.Left = deleteNode(root.Left, key)
		return root
	}
	if root.Val < key {
		root.Right = deleteNode(root.Right, key)
		return root
	}
	if root.Left == nil {
		return root.Right
	}
	if root.Right == nil {
		return root.Left
	}
	node := root.Right
	for node.Left != nil {
		node = node.Left
	}
	node.Left = root.Left
	root = root.Right
	return root
}
```

### Java

```java
// Delete Node in a BST：按照上方思路实现主解法。
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
    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) {
            return null;
        }
        if (root.val > key) {
            root.left = deleteNode(root.left, key);
            return root;
        }
        if (root.val < key) {
            root.right = deleteNode(root.right, key);
            return root;
        }
        if (root.left == null) {
            return root.right;
        }
        if (root.right == null) {
            return root.left;
        }
        TreeNode node = root.right;
        while (node.left != null) {
            node = node.left;
        }
        node.left = root.left;
        root = root.right;
        return root;
    }
}
```

### Python

```python
# Delete Node in a BST：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def deleteNode(self, root: Optional[TreeNode], key: int) -> Optional[TreeNode]:
        if root is None:
            return None
        if root.val > key:
            root.left = self.deleteNode(root.left, key)
            return root
        if root.val < key:
            root.right = self.deleteNode(root.right, key)
            return root
        if root.left is None:
            return root.right
        if root.right is None:
            return root.left
        node = root.right
        while node.left:
            node = node.left
        node.left = root.left
        root = root.right
        return root
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

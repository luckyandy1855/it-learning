# 0510. Inorder Successor in BST II

---
编号: 510
题目: Inorder Successor in BST II
难度: 中等
标签: [树, 二叉搜索树, 二叉树]
来源链接: https://leetcode.com/problems/inorder-successor-in-bst-ii/
---

## 题目描述

给定一棵二叉搜索树和其中的一个节点 `node` ，找到该节点在树中的中序后继。如果节点没有中序后继，请返回 `null` 。

一个节点 `node` 的中序后继是键值比 `node.val` 大所有的节点中键值最小的那个。

你可以直接访问结点，但无法直接访问树。每个节点都会有其父节点的引用。节点 `Node` 定义如下：

```text
class Node {
    public int val;
    public Node left;
    public Node right;
    public Node parent;
}
```

示例 1：

```text
输入：tree = [2,1,3], node = 1
输出：2
解析：1 的中序后继结点是 2 。注意节点和返回值都是 Node 类型的。
```

示例 2：

```text
输入：tree = [5,3,6,2,4,null,null,1], node = 6
输出：null
解析：该结点没有中序后继，因此返回 null 。
```

**提示：**

- 树中节点的数目在范围 `[1, 10^4]` 内。

- `-10^5 <= Node.val <= 10^5`

- 树中各结点的值均保证唯一。

**进阶：**你能否在不访问任何结点的值的情况下解决问题?

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

如果 $\textit{node}$ 有右子树，那么 $\textit{node}$ 的中序后继节点是右子树中最左边的节点。

如果 $\textit{node}$ 没有右子树，那么如果 $\textit{node}$ 是其父节点的右子树，我们就一直向上搜索，直到节点的父节点为空，或者节点是其父节点的左子树，此时父节点就是中序后继节点。

时间复杂度 $O(h)$，其中 $h$ 是二叉树的高度。空间复杂度 $O(1)$。

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
// Inorder Successor in BST II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for Node.
 * type Node struct {
 *     Val int
 *     Left *Node
 *     Right *Node
 *     Parent *Node
 * }
 */

func inorderSuccessor(node *Node) *Node {
	if node.Right != nil {
		node = node.Right
		for node.Left != nil {
			node = node.Left
		}
		return node
	}
	for node.Parent != nil && node == node.Parent.Right {
		node = node.Parent
	}
	return node.Parent
}
```

### Java

```java
// Inorder Successor in BST II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/*
// Definition for a Node.
class Node {
    public int val;
    public Node left;
    public Node right;
    public Node parent;
};
*/

class Solution {
    public Node inorderSuccessor(Node node) {
        if (node.right != null) {
            node = node.right;
            while (node.left != null) {
                node = node.left;
            }
            return node;
        }
        while (node.parent != null && node.parent.right == node) {
            node = node.parent;
        }
        return node.parent;
    }
}
```

### Python

```python
# Inorder Successor in BST II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
"""
# Definition for a Node.
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.parent = None
"""

class Solution:
    def inorderSuccessor(self, node: 'Node') -> 'Optional[Node]':
        if node.right:
            node = node.right
            while node.left:
                node = node.left
            return node
        while node.parent and node.parent.right is node:
            node = node.parent
        return node.parent
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0099. Recover Binary Search Tree

---
编号: 99
题目: Recover Binary Search Tree
难度: 中等
标签: [树, 深度优先搜索, 二叉搜索树, 二叉树]
来源链接: https://leetcode.com/problems/recover-binary-search-tree/
---

## 题目描述

给定一棵 BST，其中恰好有**两个节点**的值被错误地交换了。在不改变树的结构的情况下，恢复这棵树（即找到这两个节点并交换它们的值）。

### Example 1

```text
Input: root = [1,3,null,null,2]
Output: [3,1,null,null,2]
Explanation: 3 和 1 的值被错误交换了
```

### Example 2

```text
Input: root = [3,1,4,null,null,2]
Output: [2,1,4,null,null,3]
Explanation: 3 和 2 的值被错误交换了
```

### 约束条件

- 树中节点数在 `[2, 1000]` 范围内
- `-2^31 <= Node.val <= 2^31 - 1`
- 进阶：O(1) 空间（Morris 遍历）

## 思路分析

### 突破口

中序遍历 BST 应得到严格递增序列。若有两个节点被交换，中序序列中会出现**逆序对**（`prev.val > cur.val`）：
- **相邻被交换**：出现 1 次逆序对，两个节点分别是逆序对的 `prev` 和 `cur`。
- **非相邻被交换**：出现 2 次逆序对，第一个逆序对的 `prev` 和第二个逆序对的 `cur`。

### 思路拆解

1. **中序遍历**：维护 `prev`（上一个访问节点）、`first`（第一个错误节点）、`second`（第二个错误节点）。

2. **发现逆序对时**：第一次发现 → `first = prev, second = cur`；第二次发现 → 仅更新 `second = cur`。

3. **交换恢复**：遍历结束后交换 `first.val` 和 `second.val`。

### 示意图

```text
BST中序序列本应: 1 2 3 4 5
交换3和1后:      3 2 1 4 5  ← 中序遍历实际结果
                 ↑   ↑
              first  second（两处逆序对）

交换 first=3 和 second=1 的值后恢复
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 中序遍历（递归/栈） | O(n) | O(n) |
| Morris 遍历 | O(n) | O(1) |

## 代码实现

### Go

```go
// recoverTree 找到 BST 中被错误交换的两个节点并恢复
func recoverTree(root *TreeNode) {
    var first, second, prev *TreeNode

    var inorder func(node *TreeNode)
    inorder = func(node *TreeNode) {
        if node == nil {
            return
        }
        inorder(node.Left)
        if prev != nil && prev.Val > node.Val {
            if first == nil {
                first = prev // 第一次逆序对：记录 prev
            }
            second = node // 每次逆序对都更新 second
        }
        prev = node
        inorder(node.Right)
    }

    inorder(root)
    first.Val, second.Val = second.Val, first.Val
}
```

### Java

```java
class Solution {
    /**
     * 找到 BST 中被错误交换的两个节点并恢复。
     */
    private TreeNode first = null, second = null, prev = null;

    public void recoverTree(TreeNode root) {
        inorder(root);
        int tmp = first.val; first.val = second.val; second.val = tmp;
    }

    private void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        if (prev != null && prev.val > node.val) {
            if (first == null) first = prev;
            second = node;
        }
        prev = node;
        inorder(node.right);
    }
}
```

### Python

```python
from typing import Optional

class Solution:
    def recoverTree(self, root: Optional['TreeNode']) -> None:
        """
        找到 BST 中被错误交换的两个节点并恢复（中序遍历）。
        """
        self.first = self.second = self.prev = None

        def inorder(node) -> None:
            if not node:
                return
            inorder(node.left)
            if self.prev and self.prev.val > node.val:
                if not self.first:
                    self.first = self.prev
                self.second = node  # 第二次逆序对时更新 second
            self.prev = node
            inorder(node.right)

        inorder(root)
        self.first.val, self.second.val = self.second.val, self.first.val
```

## 踩坑记录

- **`second` 每次逆序对都更新**：两次逆序对时，`first` 只在第一次设置，`second` 需要更新为第二次逆序对的当前节点；用 `if first == nil: first = prev; second = cur` 实现（`second` 每次覆盖）。
- **相邻节点交换只有 1 次逆序对**：如 `[1,3,null,null,2]`，中序序列为 `3,2`，只有 1 次逆序，`first=3, second=2`，此时 `second` 被正确设置在第 1 次逆序对中。
- **只交换值而非节点**：题目说"在不改变树的结构的情况下恢复"，即只交换 `first.val` 和 `second.val`，不改变节点的 `left/right` 指针。

# 0094. Binary Tree Inorder Traversal

---
编号: 94
题目: Binary Tree Inorder Traversal
难度: 简单
标签: [栈, 树, 深度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/binary-tree-inorder-traversal/
---

## 题目描述

给定二叉树的根节点 `root`，返回其**中序遍历**（左→根→右）结果。

### Example 1

```text
Input: root = [1,null,2,3]
Output: [1,3,2]
```

### Example 2

```text
Input: root = []
Output: []
```

### Example 3

```text
Input: root = [1]
Output: [1]
```

### 约束条件

- 树中节点数在 `[0, 100]` 范围内
- `-100 <= Node.val <= 100`
- 进阶：尝试迭代解法

## 思路分析

### 突破口

递归中序遍历是最直接的；迭代版本用栈模拟，关键在于"一路向左压栈，弹出时处理节点，然后转向右子树"。

### 思路拆解

1. **递归**：`inorder(root.left) → root.val → inorder(root.right)`。

2. **迭代（栈）**：
   - `cur = root`，循环：若 `cur != nil` 则压栈并左移；否则弹出节点记录值，转向右子树。

### 示意图

```text
树:   1
       \
        2
       /
      3

迭代过程:
  cur=1: push 1, cur=nil
  cur=nil: pop 1, result=[1], cur=1.right=2
  cur=2: push 2, cur=3
  cur=3: push 3, cur=nil
  cur=nil: pop 3, result=[1,3], cur=3.right=nil
  cur=nil: pop 2, result=[1,3,2], cur=2.right=nil
  栈空,结束
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 递归 | O(n) | O(n) 递归栈 |
| 迭代（栈） | O(n) | O(n) |
| Morris 遍历 | O(n) | O(1) |

## 代码实现

### Go

```go
// inorderTraversal 返回二叉树的中序遍历结果（迭代）
func inorderTraversal(root *TreeNode) []int {
    result := []int{}
    stack := []*TreeNode{}
    cur := root

    for cur != nil || len(stack) > 0 {
        for cur != nil { // 一路向左压栈
            stack = append(stack, cur)
            cur = cur.Left
        }
        cur = stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        result = append(result, cur.Val)
        cur = cur.Right // 转向右子树
    }
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回二叉树的中序遍历结果（迭代）。
     */
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;

        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { stack.push(cur); cur = cur.left; }
            cur = stack.pop();
            result.add(cur.val);
            cur = cur.right;
        }
        return result;
    }
}
```

### Python

```python
from typing import Optional

class Solution:
    def inorderTraversal(self, root: Optional['TreeNode']) -> list[int]:
        """
        返回二叉树的中序遍历结果（迭代，栈模拟）。
        """
        result, stack = [], []
        cur = root

        while cur or stack:
            while cur:  # 一路向左压栈
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            result.append(cur.val)
            cur = cur.right  # 转向右子树

        return result
```

## 踩坑记录

- **迭代中 `cur = cur.right` 后不要再 `push`**：弹出节点后处理右子树，右子树的左侧会在下一次 while 循环中压栈，不需要手动压右节点。
- **空树处理**：`root = nil` 时，`cur = nil` 且 `stack` 为空，外层 `while` 条件不满足，直接返回空结果，自然处理。
- **Morris 遍历（进阶 O(1) 空间）**：利用叶节点的右指针暂存后继节点，遍历完后恢复原树结构，不需要栈，但实现复杂。

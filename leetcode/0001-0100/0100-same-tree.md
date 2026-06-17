# 0100. Same Tree

---
编号: 100
题目: Same Tree
难度: 简单
标签: [树, 深度优先搜索, 广度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/same-tree/
---

## 题目描述

给定两个二叉树的根节点 `p` 和 `q`，判断这两棵树是否**结构相同**且**节点值相同**。

### Example 1

```text
Input: p = [1,2,3], q = [1,2,3]
Output: true
```

### Example 2

```text
Input: p = [1,2], q = [1,null,2]
Output: false
```

### Example 3

```text
Input: p = [1,2,1], q = [1,1,2]
Output: false
```

### 约束条件

- 两棵树节点数均在 `[0, 100]` 范围内
- `-10^4 <= Node.val <= 10^4`

## 思路分析

### 突破口

递归：两棵树相同当且仅当根节点值相同，且左子树相同，且右子树相同。对 nil 节点的处理是关键边界条件。

### 思路拆解

1. **两者均为 nil**：相同，返回 true。

2. **一个 nil 一个非 nil**：结构不同，返回 false。

3. **值不同**：返回 false。

4. **递归比较左右子树**：`isSameTree(p.Left, q.Left) && isSameTree(p.Right, q.Right)`。

### 示意图

```text
p:   1         q:   1
    / \             / \
   2   3           2   3

isSameTree(1,1):
  值相同 ✓
  isSameTree(2,2): 值相同, 左右均nil → true
  isSameTree(3,3): 值相同, 左右均nil → true
  → true
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 递归 | O(n) | O(n) 递归栈 |
| 迭代（BFS/DFS） | O(n) | O(n) |

## 代码实现

### Go

```go
// isSameTree 判断两棵二叉树是否结构和节点值都相同
func isSameTree(p *TreeNode, q *TreeNode) bool {
    if p == nil && q == nil {
        return true
    }
    if p == nil || q == nil {
        return false
    }
    if p.Val != q.Val {
        return false
    }
    return isSameTree(p.Left, q.Left) && isSameTree(p.Right, q.Right)
}
```

### Java

```java
class Solution {
    /**
     * 判断两棵二叉树是否结构和节点值都相同。
     */
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        if (p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
```

### Python

```python
from typing import Optional

class Solution:
    def isSameTree(self, p: Optional['TreeNode'], q: Optional['TreeNode']) -> bool:
        """
        判断两棵二叉树是否结构和节点值都相同。
        """
        if p is None and q is None:
            return True
        if p is None or q is None:
            return False
        if p.val != q.val:
            return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
```

## 踩坑记录

- **判断顺序很重要**：先判断"两者均 nil"，再判断"一者 nil"，最后才能安全访问 `p.val` 和 `q.val`；顺序颠倒会导致 NullPointerException。
- **Python `is None` 而非 `== None`**：在 Python 中比较 None 用 `is None` 更规范、效率更高，`== None` 会调用 `__eq__`。
- **短路求值**：`isSameTree(left) && isSameTree(right)` 中，若左子树不同可提前返回 false，不会继续比较右子树。

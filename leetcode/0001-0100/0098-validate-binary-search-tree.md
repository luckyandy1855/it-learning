# 0098. Validate Binary Search Tree

---
编号: 98
题目: Validate Binary Search Tree
难度: 中等
标签: [树, 深度优先搜索, 二叉搜索树, 二叉树]
来源链接: https://leetcode.com/problems/validate-binary-search-tree/
---

## 题目描述

给定二叉树的根节点 `root`，判断其是否是一棵有效的**二叉搜索树**（BST）。

有效 BST 的定义：
- 节点的左子树只包含**小于**当前节点值的节点。
- 节点的右子树只包含**大于**当前节点值的节点。
- 所有左子树和右子树自身也必须是 BST。

### Example 1

```text
Input: root = [2,1,3]
Output: true
```

### Example 2

```text
Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: 根节点值为5，其右子节点值为4，不满足 BST 要求
```

### 约束条件

- 树中节点数在 `[1, 10^4]` 范围内
- `-2^31 <= Node.val <= 2^31 - 1`

## 思路分析

### 突破口

递归时传递上下界：每个节点必须满足 `min < node.val < max`。根节点的范围是 `(-∞, +∞)`，向左递归时更新上界，向右递归时更新下界。

### 思路拆解

1. **递归验证**：`validate(node, min, max)` — node 的值必须在 `(min, max)` 范围内。

2. **向左递归**：`validate(node.left, min, node.val)`（左子树值 < node.val）。

3. **向右递归**：`validate(node.right, node.val, max)`（右子树值 > node.val）。

4. **边界**：使用 `math.MinInt64` 和 `math.MaxInt64`（或 `null` 表示无界），覆盖 `int32` 范围内的所有值。

### 示意图

```text
树: 5
   / \
  1   4
     / \
    3   6

validate(5, -∞, +∞): 5 ∈ (-∞,+∞) ✓
  validate(1, -∞, 5): 1 ∈ (-∞,5) ✓
  validate(4, 5, +∞): 4 ∉ (5,+∞) ✗ → false
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 递归（传界） | O(n) | O(n) 递归栈 |
| 中序遍历 | O(n) | O(n) |

## 代码实现

### Go

```go
import "math"

// isValidBST 判断二叉树是否是有效的 BST
func isValidBST(root *TreeNode) bool {
    var validate func(node *TreeNode, min, max int64) bool
    validate = func(node *TreeNode, min, max int64) bool {
        if node == nil {
            return true
        }
        v := int64(node.Val)
        if v <= min || v >= max { // 必须严格在 (min, max) 范围内
            return false
        }
        return validate(node.Left, min, v) && validate(node.Right, v, max)
    }
    return validate(root, math.MinInt64, math.MaxInt64)
}
```

### Java

```java
class Solution {
    /**
     * 判断二叉树是否是有效的 BST（传上下界递归）。
     */
    public boolean isValidBST(TreeNode root) {
        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean validate(TreeNode node, long min, long max) {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false;
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }
}
```

### Python

```python
from typing import Optional

class Solution:
    def isValidBST(self, root: Optional['TreeNode']) -> bool:
        """
        判断二叉树是否是有效的 BST（传上下界递归）。
        """
        def validate(node, lo, hi) -> bool:
            if node is None:
                return True
            if not (lo < node.val < hi):  # 严格在 (lo, hi) 范围内
                return False
            return validate(node.left, lo, node.val) and validate(node.right, node.val, hi)

        return validate(root, float('-inf'), float('inf'))
```

## 踩坑记录

- **必须用严格不等式**：BST 要求左子树严格小于根、右子树严格大于根，不允许相等，使用 `<` 和 `>` 而非 `<=` 和 `>=`。
- **初始边界用 `long/int64` 或 `float`**：节点值范围是 `[-2^31, 2^31-1]`，若用 `Integer.MAX_VALUE/MIN_VALUE` 作为初始边界，当节点值等于这些极值时会误判；Java 用 `Long.MIN/MAX_VALUE`，Python 用 `float('inf')`。
- **不能只比较左孩子 < 根 < 右孩子**：如 `[10, 5, 15, null, null, 6, 20]`，节点 6 虽然 `5 < 6`，但 6 在 10 的右子树中，必须 > 10，需要通过传界来检测。

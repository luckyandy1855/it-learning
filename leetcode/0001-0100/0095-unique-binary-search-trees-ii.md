# 0095. Unique Binary Search Trees II

---
编号: 95
题目: Unique Binary Search Trees II
难度: 中等
标签: [树, 二叉搜索树, 动态规划, 回溯, 二叉树]
来源链接: https://leetcode.com/problems/unique-binary-search-trees-ii/
---

## 题目描述

给定整数 `n`，生成并返回所有由 `n` 个节点组成的**结构不同的二叉搜索树**，节点值从 1 到 n。可以按任意顺序返回答案。

### Example 1

```text
Input: n = 3
Output: [[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]
```

### Example 2

```text
Input: n = 1
Output: [[1]]
```

### 约束条件

- `1 <= n <= 8`

## 思路分析

### 突破口

分治递归：对区间 `[lo, hi]`，枚举每个节点 `i` 作为根节点；左子树由 `[lo, i-1]` 生成，右子树由 `[i+1, hi]` 生成，对左右子树所有组合配对构造所有 BST。

### 思路拆解

1. **递归 `generate(lo, hi)`**：返回所有以 `[lo, hi]` 中节点为值的 BST 列表。

2. **枚举根节点 `i`**：左子树所有树 × 右子树所有树 = 对所有左右组合创建新节点。

3. **基础情况**：`lo > hi` 时返回 `[nil]`（空树），使得乘积能正确处理边界。

### 示意图

```text
generate(1, 3):
  i=1: 左=generate(1,0)=[nil], 右=generate(2,3)
    generate(2,3): i=2: 左=[nil],右=[3节点]; i=3: 左=[2节点],右=[nil]
    → 右=[2→3, 3(left=2)]
    → 组合: (nil,2→3) → 树1: 1→(2→3)
            (nil,3←2) → 树2: 1→(3←2)
  i=2: 左=[1], 右=[3] → 树3: 2(1,3)
  i=3: 左=generate(1,2)=[1→2, 2(1,nil)], 右=[nil]
    → 树4: 3(1→2, nil), 树5: 3(2←1, nil)

共 5 棵
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 分治递归 | O(Catalan(n) × n) | O(Catalan(n) × n) |

注：n=8 时 Catalan(8)=1430。

## 代码实现

### Go

```go
// generateTrees 返回所有结构不同的 BST（n 个节点，值 1 到 n）
func generateTrees(n int) []*TreeNode {
    if n == 0 {
        return nil
    }
    var generate func(lo, hi int) []*TreeNode
    generate = func(lo, hi int) []*TreeNode {
        if lo > hi {
            return []*TreeNode{nil}
        }
        var trees []*TreeNode
        for i := lo; i <= hi; i++ {
            lefts := generate(lo, i-1)
            rights := generate(i+1, hi)
            for _, left := range lefts {
                for _, right := range rights {
                    root := &TreeNode{Val: i, Left: left, Right: right}
                    trees = append(trees, root)
                }
            }
        }
        return trees
    }
    return generate(1, n)
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回所有结构不同的 BST（n 个节点，值 1 到 n）。
     */
    public List<TreeNode> generateTrees(int n) {
        return generate(1, n);
    }

    private List<TreeNode> generate(int lo, int hi) {
        List<TreeNode> trees = new ArrayList<>();
        if (lo > hi) { trees.add(null); return trees; }

        for (int i = lo; i <= hi; i++) {
            List<TreeNode> lefts = generate(lo, i - 1);
            List<TreeNode> rights = generate(i + 1, hi);
            for (TreeNode left : lefts)
                for (TreeNode right : rights)
                    trees.add(new TreeNode(i, left, right));
        }
        return trees;
    }
}
```

### Python

```python
from typing import Optional

class Solution:
    def generateTrees(self, n: int) -> list[Optional['TreeNode']]:
        """
        返回所有结构不同的 BST（n 个节点，值 1 到 n）。
        """
        def generate(lo: int, hi: int) -> list:
            if lo > hi:
                return [None]
            trees = []
            for i in range(lo, hi + 1):
                for left in generate(lo, i - 1):
                    for right in generate(i + 1, hi):
                        root = TreeNode(i, left, right)
                        trees.append(root)
            return trees

        return generate(1, n)
```

## 踩坑记录

- **`lo > hi` 时返回 `[nil]` 而非空列表**：若返回 `[]`，则对空区间的乘积为 0，导致父节点无法生成任何树；返回 `[nil]` 保证乘积正确（叶节点无子节点的情况用 nil 表示）。
- **树节点共享**：多棵树可能共享同一个子树节点（如所有以 2 为根的树共享同一个 `TreeNode(2)`），这在只做遍历时没问题；若需要修改则需深拷贝。
- **与 0096 的关系**：0096 只求 BST 的个数（Catalan 数），不需要构造具体树，用 DP 即可；0095 需要构造所有树，只能用递归/分治。

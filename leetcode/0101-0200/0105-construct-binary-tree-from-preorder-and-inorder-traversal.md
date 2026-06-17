# 0105. Construct Binary Tree from Preorder and Inorder Traversal

---
编号: 105
题目: Construct Binary Tree from Preorder and Inorder Traversal
难度: 中等
标签: [树, 数组, 哈希表, 分治, 二叉树]
来源链接: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
---

## 题目描述

给定两个整数数组 `preorder` 和 `inorder` ，其中 `preorder` 是二叉树的**先序遍历**， `inorder` 是同一棵树的**中序遍历**，请构造二叉树并返回其根节点。

**示例 1:**

```text
输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
输出: [3,9,20,null,null,15,7]
```

**示例 2:**

```text
输入: preorder = [-1], inorder = [-1]
输出: [-1]
```

**提示:**

	- `1 <= preorder.length <= 3000`

	- `inorder.length == preorder.length`

	- `-3000 <= preorder[i], inorder[i] <= 3000`

	- `preorder` 和 `inorder` 均 **无重复** 元素

	- `inorder` 均出现在 `preorder`

	- `preorder` **保证** 为二叉树的前序遍历序列

	- `inorder` **保证** 为二叉树的中序遍历序列

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 数组, 哈希表, 分治, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

前序序列的第一个节点 $preorder[0]$ 为根节点，我们在中序序列中找到根节点的位置 $k$，可以将中序序列划分为左子树 $inorder[0..k]$ 、右子树 $inorder[k+1..]$。

通过左右子树的区间，可以计算出左、右子树节点的个数，假设为 $a$ 和 $b$。然后在前序节点中，从根节点往后的 $a$ 个节点为左子树，再往后的 $b$ 个节点为右子树。

因此，我们设计一个函数 $dfs(i, j, n)$，其中 $i$ 和 $j$ 分别表示前序序列和中序序列的起始位置，而 $n$ 表示节点个数。函数的返回值是以 $preorder[i..i+n-1]$ 为前序序列，以 $inorder[j..j+n-1]$ 为中序序列构造出的二叉树。

函数 $dfs(i, j, n)$ 的执行过程如下：

- 如果 $n \leq 0$，说明没有节点，返回空节点。
- 取出前序序列的第一个节点 $v = preorder[i]$ 作为根节点，然后利用哈希表 $d$ 找到根节点在中序序列中的位置 $k$，那么左子树的节点个数为 $k - j$，右子树的节点个数为 $n - k + j - 1$。
- 递归构造左子树 $l = dfs(i + 1, j, k - j)$ 和右子树 $r = dfs(i + 1 + k - j, k + 1, n - k + j - 1)$。
- 最后返回以 $v$ 为根节点且左右子树分别为 $l$ 和 $r$ 的二叉树。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为二叉树节点个数。

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
// Construct Binary Tree from Preorder and Inorder Traversal：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func buildTree(preorder []int, inorder []int) *TreeNode {
	d := map[int]int{}
	for i, x := range inorder {
		d[x] = i
	}
	var dfs func(i, j, n int) *TreeNode
	dfs = func(i, j, n int) *TreeNode {
		if n <= 0 {
			return nil
		}
		v := preorder[i]
		k := d[v]
		l := dfs(i+1, j, k-j)
		r := dfs(i+1+k-j, k+1, n-1-(k-j))
		return &TreeNode{v, l, r}
	}
	return dfs(0, 0, len(preorder))
}
```

### Java

```java
// Construct Binary Tree from Preorder and Inorder Traversal：按照上方思路实现主解法。
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
    private int[] preorder;
    private Map<Integer, Integer> d = new HashMap<>();

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        int n = preorder.length;
        this.preorder = preorder;
        for (int i = 0; i < n; ++i) {
            d.put(inorder[i], i);
        }
        return dfs(0, 0, n);
    }

    private TreeNode dfs(int i, int j, int n) {
        if (n <= 0) {
            return null;
        }
        int v = preorder[i];
        int k = d.get(v);
        TreeNode l = dfs(i + 1, j, k - j);
        TreeNode r = dfs(i + 1 + k - j, k + 1, n - 1 - (k - j));
        return new TreeNode(v, l, r);
    }
}
```

### Python

```python
# Construct Binary Tree from Preorder and Inorder Traversal：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        def dfs(i: int, j: int, n: int) -> Optional[TreeNode]:
            if n <= 0:
                return None
            v = preorder[i]
            k = d[v]
            l = dfs(i + 1, j, k - j)
            r = dfs(i + 1 + k - j, k + 1, n - k + j - 1)
            return TreeNode(v, l, r)

        d = {v: i for i, v in enumerate(inorder)}
        return dfs(0, 0, len(preorder))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

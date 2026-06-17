# 0889. Construct Binary Tree from Preorder and Postorder Traversal

---
编号: 889
题目: Construct Binary Tree from Preorder and Postorder Traversal
难度: 中等
标签: [树, 数组, 哈希表, 分治, 二叉树]
来源链接: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/
---

## 题目描述

给定两个整数数组，`preorder` 和 `postorder` ，其中 `preorder` 是一个具有 **无重复** 值的二叉树的前序遍历，`postorder` 是同一棵树的后序遍历，重构并返回二叉树。

如果存在多个答案，您可以返回其中 **任何** 一个。

**示例 1：**

```text
输入：preorder = [1,2,4,5,3,6,7], postorder = [4,5,2,6,7,3,1]
输出：[1,2,3,4,5,6,7]
```

**示例 2:**

```text
输入: preorder = [1], postorder = [1]
输出: [1]
```

**提示：**

- `1 <= preorder.length <= 30`

- `1 <= preorder[i] <= preorder.length`

- `preorder` 中所有值都 **不同**

- `postorder.length == preorder.length`

- `1 <= postorder[i] <= postorder.length`

- `postorder` 中所有值都 **不同**

- 保证 `preorder` 和 `postorder` 是同一棵二叉树的前序遍历和后序遍历

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

前序遍历的顺序是：根节点 -> 左子树 -> 右子树，后序遍历的顺序是：左子树 -> 右子树 -> 根节点。

因此，二叉树的根节点一定是前序遍历的第一个节点，也是后序遍历的最后一个节点。

接下来，我们需要确定二叉树的左子树范围和右子树范围。

如果二叉树有左子树，那么左子树的根节点一定是前序遍历的第二个节点；如果二叉树没有左子树，那么前序遍历的第二个节点一定是右子树的根节点。由于这两种情况下，后序遍历的结果是一样的，因此，我们可以把前序遍历的第二个节点作为左子树的根节点，然后找到它在后序遍历中的位置，这样就确定了左子树的范围。

具体地，我们设计一个递归函数 $dfs(a, b, c, d)$，其中 $[a, b]$ 表示前序遍历的范围，而 $[c, d]$ 表示后序遍历的范围。这个函数的功能是根据前序遍历 $[a, b]$ 和后序遍历 $[c, d]$ 构造出二叉树的根节点。那么答案就是 $dfs(0, n - 1, 0, n - 1)$，其中 $n$ 是前序遍历的长度。

函数 $dfs(a, b, c, d)$ 的执行步骤如下：

1. 如果 $a > b$，说明范围为空，直接返回空节点。
1. 否则，我们构造一个新的节点 $root$，它的值为前序遍历中的第一个节点的值，也就是 $preorder[a]$。
1. 如果 $a$ 等于 $b$，说明 $root$ 没有左子树也没有右子树，直接返回 $root$。
1. 否则，左子树的根节点的值为 $preorder[a + 1]$，我们在后序遍历中找到 $preorder[a + 1]$ 的位置，记为 $i$。那么左子树的节点个数 $m = i - c + 1$，由此可知左子树在前序遍历中的范围是 $[a + 1, a + m]$，后序遍历中的范围是 $[c, i]$，右子树在前序遍历中的范围是 $[a + m + 1, b]$，后序遍历中的范围是 $[i + 1, d - 1]$。
1. 知道了左右子树的范围，我们就可以递归地重建左右子树，然后将左右子树的根节点分别作为 $root$ 的左右子节点。最后返回 $root$。

在函数 $dfs(a, b, c, d)$ 中，我们需要用到一个哈希表 $pos$，它存储了后序遍历中每个节点的位置。在函数的开头，我们可以先计算出这个哈希表，这样就可以在 $O(1)$ 的时间内找到任意节点在后序遍历中的位置。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是节点数。

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
// Construct Binary Tree from Preorder and Postorder Traversal：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func constructFromPrePost(preorder []int, postorder []int) *TreeNode {
	pos := map[int]int{}
	for i, x := range postorder {
		pos[x] = i
	}
	var dfs func(int, int, int, int) *TreeNode
	dfs = func(a, b, c, d int) *TreeNode {
		if a > b {
			return nil
		}
		root := &TreeNode{Val: preorder[a]}
		if a == b {
			return root
		}
		i := pos[preorder[a+1]]
		m := i - c + 1
		root.Left = dfs(a+1, a+m, c, i)
		root.Right = dfs(a+m+1, b, i+1, d-1)
		return root
	}
	return dfs(0, len(preorder)-1, 0, len(postorder)-1)
}
```

### Java

```java
// Construct Binary Tree from Preorder and Postorder Traversal：按照上方思路实现主解法。
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
    private Map<Integer, Integer> pos = new HashMap<>();
    private int[] preorder;

    public TreeNode constructFromPrePost(int[] preorder, int[] postorder) {
        this.preorder = preorder;
        for (int i = 0; i < postorder.length; ++i) {
            pos.put(postorder[i], i);
        }
        return dfs(0, preorder.length - 1, 0, postorder.length - 1);
    }

    private TreeNode dfs(int a, int b, int c, int d) {
        if (a > b) {
            return null;
        }
        TreeNode root = new TreeNode(preorder[a]);
        if (a == b) {
            return root;
        }
        int i = pos.get(preorder[a + 1]);
        int m = i - c + 1;
        root.left = dfs(a + 1, a + m, c, i);
        root.right = dfs(a + m + 1, b, i + 1, d - 1);
        return root;
    }
}
```

### Python

```python
# Construct Binary Tree from Preorder and Postorder Traversal：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def constructFromPrePost(
        self, preorder: List[int], postorder: List[int]
    ) -> Optional[TreeNode]:
        def dfs(a: int, b: int, c: int, d: int) -> Optional[TreeNode]:
            if a > b:
                return None
            root = TreeNode(preorder[a])
            if a == b:
                return root
            i = pos[preorder[a + 1]]
            m = i - c + 1
            root.left = dfs(a + 1, a + m, c, i)
            root.right = dfs(a + m + 1, b, i + 1, d - 1)
            return root

        pos = {x: i for i, x in enumerate(postorder)}
        return dfs(0, len(preorder) - 1, 0, len(postorder) - 1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

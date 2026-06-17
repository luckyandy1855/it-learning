# 0938. Range Sum of BST

---
编号: 938
题目: Range Sum of BST
难度: 简单
标签: [树, 深度优先搜索, 二叉搜索树, 二叉树]
来源链接: https://leetcode.com/problems/range-sum-of-bst/
---

## 题目描述

给定二叉搜索树的根结点 `root`，返回值位于范围 *`[low, high]`* 之间的所有结点的值的和。

**示例 1：**

```text
输入：root = [10,5,15,3,7,null,18], low = 7, high = 15
输出：32
```

**示例 2：**

```text
输入：root = [10,5,15,3,7,13,18,1,null,6], low = 6, high = 10
输出：23
```

**提示：**

- 树中节点数目在范围 `[1, 2 * 10^4]` 内

- `1 <= Node.val <= 10^5`

- `1 <= low <= high <= 10^5`

- 所有 `Node.val` **互不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 二叉搜索树, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $dfs(root)$，表示求以 $root$ 为根的子树中，值位于范围 $[low, high]$ 之间的所有结点的值的和。那么答案就是 $dfs(root)$。

函数 $dfs(root)$ 的执行逻辑如下：

- 如果 $root$ 为空，返回 $0$。
- 如果 $root$ 的值 $x$ 在范围 $[low, high]$ 之间，那么函数 $dfs(root)$ 的初始答案就是 $x$，否则为 $0$。
- 如果 $x > low$，说明 $root$ 的左子树中可能有值在范围 $[low, high]$ 之间的结点，所以我们需要递归调用 $dfs(root.left)$，并将结果加到答案上。
- 如果 $x < high$，说明 $root$ 的右子树中可能有值在范围 $[low, high]$ 之间的结点，所以我们需要递归调用 $dfs(root.right)$，并将结果加到答案上。
- 最后返回答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉搜索树的结点个数。

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
// Range Sum of BST：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func rangeSumBST(root *TreeNode, low int, high int) int {
	var dfs func(*TreeNode) int
	dfs = func(root *TreeNode) (ans int) {
		if root == nil {
			return 0
		}
		x := root.Val
		if low <= x && x <= high {
			ans += x
		}
		if x > low {
			ans += dfs(root.Left)
		}
		if x < high {
			ans += dfs(root.Right)
		}
		return
	}
	return dfs(root)
}
```

### Java

```java
// Range Sum of BST：按照上方思路实现主解法。
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
    public int rangeSumBST(TreeNode root, int low, int high) {
        return dfs(root, low, high);
    }

    private int dfs(TreeNode root, int low, int high) {
        if (root == null) {
            return 0;
        }
        int x = root.val;
        int ans = low <= x && x <= high ? x : 0;
        if (x > low) {
            ans += dfs(root.left, low, high);
        }
        if (x < high) {
            ans += dfs(root.right, low, high);
        }
        return ans;
    }
}
```

### Python

```python
# Range Sum of BST：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def rangeSumBST(self, root: Optional[TreeNode], low: int, high: int) -> int:
        def dfs(root: Optional[TreeNode]) -> int:
            if root is None:
                return 0
            x = root.val
            ans = x if low <= x <= high else 0
            if x > low:
                ans += dfs(root.left)
            if x < high:
                ans += dfs(root.right)
            return ans

        return dfs(root)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

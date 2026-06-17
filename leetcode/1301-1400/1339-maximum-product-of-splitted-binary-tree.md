# 1339. Maximum Product of Splitted Binary Tree

---
编号: 1339
题目: Maximum Product of Splitted Binary Tree
难度: 中等
标签: [树, 深度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/maximum-product-of-splitted-binary-tree/
---

## 题目描述

给你一棵二叉树，它的根为 `root` 。请你删除 1 条边，使二叉树分裂成两棵子树，且它们子树和的乘积尽可能大。

由于答案可能会很大，请你将结果对 10^9 + 7 取模后再返回。

**示例 1：**

****

```text
输入：root = [1,2,3,4,5,6]
输出：110
解释：删除红色的边，得到 2 棵子树，和分别为 11 和 10 。它们的乘积是 110 （11*10）
```

**示例 2：**

```text
输入：root = [1,null,2,3,4,null,null,5,6]
输出：90
解释：移除红色的边，得到 2 棵子树，和分别是 15 和 6 。它们的乘积为 90 （15*6）
```

**示例 3：**

```text
输入：root = [2,3,9,10,7,8,6,5,4,11,1]
输出：1025
```

**示例 4：**

```text
输入：root = [1,1]
输出：1
```

**提示：**

- 每棵树最多有 `50000` 个节点，且至少有 `2` 个节点。

- 每个节点的值在 `[1, 10000]` 之间。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用两次 DFS 来解决这个问题。

第一次，我们用一个 $\text{sum}(\text{root})$ 函数递归求出整棵树所有节点的和，记为 $s$。

第二次，我们用一个 $\text{dfs}(\text{root})$ 函数递归遍历每个节点，求出以当前节点为根的子树的节点和 $t$，那么当前节点与其父节点分裂后两棵子树的节点和分别为 $t$ 和 $s - t$，它们的乘积为 $t \times (s - t)$，我们遍历所有节点，求出乘积的最大值，即为答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数。

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
// Maximum Product of Splitted Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func maxProduct(root *TreeNode) (ans int) {
	const mod = 1e9 + 7
	var sum func(*TreeNode) int
	sum = func(root *TreeNode) int {
		if root == nil {
			return 0
		}
		return root.Val + sum(root.Left) + sum(root.Right)
	}
	s := sum(root)
	var dfs func(*TreeNode) int
	dfs = func(root *TreeNode) int {
		if root == nil {
			return 0
		}
		t := root.Val + dfs(root.Left) + dfs(root.Right)
		if t < s {
			ans = max(ans, t*(s-t))
		}
		return t
	}
	dfs(root)
	ans %= mod
	return
}
```

### Java

```java
// Maximum Product of Splitted Binary Tree：按照上方思路实现主解法。
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
    private long ans;
    private long s;

    public int maxProduct(TreeNode root) {
        final int mod = (int) 1e9 + 7;
        s = sum(root);
        dfs(root);
        return (int) (ans % mod);
    }

    private long dfs(TreeNode root) {
        if (root == null) {
            return 0;
        }
        long t = root.val + dfs(root.left) + dfs(root.right);
        if (t < s) {
            ans = Math.max(ans, t * (s - t));
        }
        return t;
    }

    private long sum(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return root.val + sum(root.left) + sum(root.right);
    }
}
```

### Python

```python
# Maximum Product of Splitted Binary Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxProduct(self, root: Optional[TreeNode]) -> int:
        def sum(root: Optional[TreeNode]) -> int:
            if root is None:
                return 0
            return root.val + sum(root.left) + sum(root.right)

        def dfs(root: Optional[TreeNode]) -> int:
            if root is None:
                return 0
            t = root.val + dfs(root.left) + dfs(root.right)
            nonlocal ans, s
            if t < s:
                ans = max(ans, t * (s - t))
            return t

        mod = 10**9 + 7
        s = sum(root)
        ans = 0
        dfs(root)
        return ans % mod
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

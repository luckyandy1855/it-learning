# 0979. Distribute Coins in Binary Tree

---
编号: 979
题目: Distribute Coins in Binary Tree
难度: 中等
标签: [树, 深度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/distribute-coins-in-binary-tree/
---

## 题目描述

给你一个有 `n` 个结点的二叉树的根结点 `root` ，其中树中每个结点 `node` 都对应有 `node.val` 枚硬币。整棵树上一共有 `n` 枚硬币。

在一次移动中，我们可以选择两个相邻的结点，然后将一枚硬币从其中一个结点移动到另一个结点。移动可以是从父结点到子结点，或者从子结点移动到父结点。

返回使每个结点上 **只有** 一枚硬币所需的 **最少** 移动次数。

示例 1：

```text
输入：root = [3,0,0]
输出：2
解释：一枚硬币从根结点移动到左子结点，一枚硬币从根结点移动到右子结点。
```

示例 2：

```text
输入：root = [0,3,0]
输出：3
解释：将两枚硬币从根结点的左子结点移动到根结点（两次移动）。然后，将一枚硬币从根结点移动到右子结点。
```

**提示：**

- 树中节点的数目为 `n`

- `1 <= n <= 100`

- `0 <= Node.val <= n`

- 所有 `Node.val` 的值之和是 `n`

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

我们定义一个函数 $\textit{dfs(\textit{node})}$，表示以 $\textit{node}$ 为根节点的子树中，金币的超载量，即金币的数量减去节点数。如果 $\textit{dfs(\textit{node})}$ 为正数，表示该子树中金币的数量多于节点数，需要将多余的金币移出该子树；如果 $\textit{dfs(\textit{node})}$ 为负数，表示该子树中金币的数量少于节点数，需要将不足的金币移入该子树。

在函数 $\textit{dfs(\textit{node})}$ 中，我们首先遍历左右子树，获得左右子树的金币超载量 $\textit{left}$ 和 $\textit{right}$。那么当前移动的次数需要加上 $|\textit{left}| + |\textit{right}|$，即将左右子树中的金币移动到当前节点。然后，我们返回整个子树的金币超载量，即 $\textit{left} + \textit{right} + \textit{node.val} - 1$。

最后返回移动的次数即可。

时间复杂度 $O(n)$，空间复杂度 $O(h)$。其中 $n$ 和 $h$ 分别是二叉树的节点数和高度。

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
// Distribute Coins in Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func distributeCoins(root *TreeNode) (ans int) {
	var dfs func(*TreeNode) int
	dfs = func(root *TreeNode) int {
		if root == nil {
			return 0
		}
		left, right := dfs(root.Left), dfs(root.Right)
		ans += abs(left) + abs(right)
		return left + right + root.Val - 1
	}
	dfs(root)
	return
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Distribute Coins in Binary Tree：按照上方思路实现主解法。
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
    private int ans;

    public int distributeCoins(TreeNode root) {
        dfs(root);
        return ans;
    }

    private int dfs(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int left = dfs(root.left);
        int right = dfs(root.right);
        ans += Math.abs(left) + Math.abs(right);
        return left + right + root.val - 1;
    }
}
```

### Python

```python
# Distribute Coins in Binary Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def distributeCoins(self, root: Optional[TreeNode]) -> int:
        def dfs(root):
            if root is None:
                return 0
            left, right = dfs(root.left), dfs(root.right)
            nonlocal ans
            ans += abs(left) + abs(right)
            return left + right + root.val - 1

        ans = 0
        dfs(root)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

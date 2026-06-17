# 1120. Maximum Average Subtree

---
编号: 1120
题目: Maximum Average Subtree
难度: 中等
标签: [树, 深度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/maximum-average-subtree/
---

## 题目描述

给你一棵二叉树的根节点 `root`，找出这棵树的 **每一棵** 子树的 **平均值** 中的 **最大** 值。

子树是树中的任意节点和它的所有后代构成的集合。

树的平均值是树中节点值的总和除以节点数。

**示例：**

```text
输入：[5,6,1]
输出：6.00000
解释：
以 value = 5 的节点作为子树的根节点，得到的平均值为 (5 + 6 + 1) / 3 = 4。
以 value = 6 的节点作为子树的根节点，得到的平均值为 6 / 1 = 6。
以 value = 1 的节点作为子树的根节点，得到的平均值为 1 / 1 = 1。
所以答案取最大值 6。
```

**提示：**

- 树中的节点数介于 `1` 到 `5000`之间。

- 每个节点的值介于 `0` 到 `100000` 之间。

- 如果结果与标准答案的误差不超过 `10^-5`，那么该结果将被视为正确答案。

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

我们可以使用递归的方法，对于每个节点，计算以该节点为根的子树的节点和以及节点个数，然后计算平均值，与当前最大值比较，更新最大值。

因此，我们设计一个函数 $dfs(root)$，表示以 $root$ 为根的子树的节点和以及节点个数，返回值为一个长度为 $2$ 的数组，其中第一个元素表示节点和，第二个元素表示节点个数。

函数 $dfs(root)$ 的递归过程如下：

- 如果 $root$ 为空，返回 $[0, 0]$；
- 否则，计算 $root$ 的左子树的节点和以及节点个数，记为 $[ls, ln]$；计算 $root$ 的右子树的节点和以及节点个数，记为 $[rs, rn]$。那么以 $root$ 为根的子树的节点和为 $root.val + ls + rs$，节点个数为 $1 + ln + rn$，计算平均值，与当前最大值比较，更新最大值；
- 返回 $[root.val + ls + rs, 1 + ln + rn]$。

最后，返回最大值即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为二叉树的节点个数。

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
// Maximum Average Subtree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func maximumAverageSubtree(root *TreeNode) (ans float64) {
	var dfs func(*TreeNode) [2]int
	dfs = func(root *TreeNode) [2]int {
		if root == nil {
			return [2]int{}
		}
		l, r := dfs(root.Left), dfs(root.Right)
		s := root.Val + l[0] + r[0]
		n := 1 + l[1] + r[1]
		ans = math.Max(ans, float64(s)/float64(n))
		return [2]int{s, n}
	}
	dfs(root)
	return
}
```

### Java

```java
// Maximum Average Subtree：按照上方思路实现主解法。
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
    private double ans;

    public double maximumAverageSubtree(TreeNode root) {
        dfs(root);
        return ans;
    }

    private int[] dfs(TreeNode root) {
        if (root == null) {
            return new int[2];
        }
        var l = dfs(root.left);
        var r = dfs(root.right);
        int s = root.val + l[0] + r[0];
        int n = 1 + l[1] + r[1];
        ans = Math.max(ans, s * 1.0 / n);
        return new int[] {s, n};
    }
}
```

### Python

```python
# Maximum Average Subtree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maximumAverageSubtree(self, root: Optional[TreeNode]) -> float:
        def dfs(root):
            if root is None:
                return 0, 0
            ls, ln = dfs(root.left)
            rs, rn = dfs(root.right)
            s = root.val + ls + rs
            n = 1 + ln + rn
            nonlocal ans
            ans = max(ans, s / n)
            return s, n

        ans = 0
        dfs(root)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

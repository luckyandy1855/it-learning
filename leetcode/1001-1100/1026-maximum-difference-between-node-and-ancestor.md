# 1026. Maximum Difference Between Node and Ancestor

---
编号: 1026
题目: Maximum Difference Between Node and Ancestor
难度: 中等
标签: [树, 深度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/maximum-difference-between-node-and-ancestor/
---

## 题目描述

给定二叉树的根节点 `root`，找出存在于 **不同** 节点 `A` 和 `B` 之间的最大值 `V`，其中 `V = |A.val - B.val|`，且 `A` 是 `B` 的祖先。

（如果 A 的任何子节点之一为 B，或者 A 的任何子节点是 B 的祖先，那么我们认为 A 是 B 的祖先）

**示例 1：**

```text
输入：root = [8,3,10,1,6,null,14,null,null,4,7,13]
输出：7
解释：
我们有大量的节点与其祖先的差值，其中一些如下：
|8 - 3| = 5
|3 - 7| = 4
|8 - 1| = 7
|10 - 13| = 3
在所有可能的差值中，最大值 7 由 |8 - 1| = 7 得出。
```

**示例 2：**

```text
输入：root = [1,null,2,null,0,3]
输出：3
```

**提示：**

- 树中的节点数在 `2` 到 `5000` 之间。

- `0 <= Node.val <= 10^5`

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

对于每个节点，求其与祖先节点的最大差值，我们只需要求出该节点与祖先节点最大值和最小值的差值。取所有节点与祖先节点差值的最大值即可。

因此，我们设计一个函数 $dfs(root, mi, mx)$，表示当前搜索到的节点为 $root$，其祖先节点的最大值为 $mx$，最小值为 $mi$，函数内更新最大差值 $ans$。

函数 $dfs(root, mi, mx)$ 的逻辑如下：

- 若 $root$ 为空，直接返回。
- 否则，我们更新 $ans = max(ans, |mi - root.val|, |mx - root.val|)$。
- 然后更新 $mi = min(mi, root.val)$, $mx = max(mx, root.val)$，并且递归搜索左右子树。

在主函数中，我们调用 $dfs(root, root.val, root.val)$，最后返回 $ans$ 即可。

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
// Maximum Difference Between Node and Ancestor：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func maxAncestorDiff(root *TreeNode) (ans int) {
	var dfs func(*TreeNode, int, int)
	dfs = func(root *TreeNode, mi, mx int) {
		if root == nil {
			return
		}
		ans = max(ans, max(abs(mi-root.Val), abs(mx-root.Val)))
		mi = min(mi, root.Val)
		mx = max(mx, root.Val)
		dfs(root.Left, mi, mx)
		dfs(root.Right, mi, mx)
	}
	dfs(root, root.Val, root.Val)
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
// Maximum Difference Between Node and Ancestor：按照上方思路实现主解法。
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

    public int maxAncestorDiff(TreeNode root) {
        dfs(root, root.val, root.val);
        return ans;
    }

    private void dfs(TreeNode root, int mi, int mx) {
        if (root == null) {
            return;
        }
        int x = Math.max(Math.abs(mi - root.val), Math.abs(mx - root.val));
        ans = Math.max(ans, x);
        mi = Math.min(mi, root.val);
        mx = Math.max(mx, root.val);
        dfs(root.left, mi, mx);
        dfs(root.right, mi, mx);
    }
}
```

### Python

```python
# Maximum Difference Between Node and Ancestor：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxAncestorDiff(self, root: Optional[TreeNode]) -> int:
        def dfs(root: Optional[TreeNode], mi: int, mx: int):
            if root is None:
                return
            nonlocal ans
            ans = max(ans, abs(mi - root.val), abs(mx - root.val))
            mi = min(mi, root.val)
            mx = max(mx, root.val)
            dfs(root.left, mi, mx)
            dfs(root.right, mi, mx)

        ans = 0
        dfs(root, root.val, root.val)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0653. Two Sum IV - Input is a BST

---
编号: 653
题目: Two Sum IV - Input is a BST
难度: 简单
标签: [树, 深度优先搜索, 广度优先搜索, 二叉搜索树, 哈希表, 双指针, 二叉树]
来源链接: https://leetcode.com/problems/two-sum-iv-input-is-a-bst/
---

## 题目描述

给定一个二叉搜索树 `root` 和一个目标结果 `k`，如果二叉搜索树中存在两个元素且它们的和等于给定的目标结果，则返回 `true`。

**示例 1：**

```text
输入: root = [5,3,6,2,4,null,7], k = 9
输出: true
```

**示例 2：**

```text
输入: root = [5,3,6,2,4,null,7], k = 28
输出: false
```

**提示:**

- 二叉树的节点个数的范围是  `[1, 10^4]`.

- `-10^4 <= Node.val <= 10^4`

- 题目数据保证，输入的 `root` 是一棵 **有效** 的二叉搜索树

- `-10^5 <= k <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 二叉搜索树, 哈希表, 双指针, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

DFS 遍历二叉搜索树，对于每个节点，判断 `k - node.val` 是否在哈希表中，如果在，则返回 `true`，否则将 `node.val` 加入哈希表中。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为二叉搜索树的节点个数。

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
// Two Sum IV - Input is a BST：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func findTarget(root *TreeNode, k int) bool {
	vis := map[int]bool{}
	var dfs func(*TreeNode) bool
	dfs = func(root *TreeNode) bool {
		if root == nil {
			return false
		}
		if vis[k-root.Val] {
			return true
		}
		vis[root.Val] = true
		return dfs(root.Left) || dfs(root.Right)
	}
	return dfs(root)
}
```

### Java

```java
// Two Sum IV - Input is a BST：按照上方思路实现主解法。
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
    private Set<Integer> vis = new HashSet<>();
    private int k;

    public boolean findTarget(TreeNode root, int k) {
        this.k = k;
        return dfs(root);
    }

    private boolean dfs(TreeNode root) {
        if (root == null) {
            return false;
        }
        if (vis.contains(k - root.val)) {
            return true;
        }
        vis.add(root.val);
        return dfs(root.left) || dfs(root.right);
    }
}
```

### Python

```python
# Two Sum IV - Input is a BST：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def findTarget(self, root: Optional[TreeNode], k: int) -> bool:
        def dfs(root):
            if root is None:
                return False
            if k - root.val in vis:
                return True
            vis.add(root.val)
            return dfs(root.left) or dfs(root.right)

        vis = set()
        return dfs(root)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

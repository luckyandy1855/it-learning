# 0988. Smallest String Starting From Leaf

---
编号: 988
题目: Smallest String Starting From Leaf
难度: 中等
标签: [树, 深度优先搜索, 字符串, 回溯, 二叉树]
来源链接: https://leetcode.com/problems/smallest-string-starting-from-leaf/
---

## 题目描述

给定一颗根结点为 `root` 的二叉树，树中的每一个结点都有一个 `[0, 25]` 范围内的值，分别代表字母 `'a'` 到 `'z'`。

返回 ***按字典序最小** 的字符串，该字符串从这棵树的一个叶结点开始，到根结点结束*。

注**：**字符串中任何较短的前缀在 **字典序上** 都是 **较小** 的：

- 例如，在字典序上 `"ab"` 比 `"aba"` 要小。叶结点是指没有子结点的结点。

节点的叶节点是没有子节点的节点。

**示例 1：**

****

```text
输入：root = [0,1,2,3,4,3,4]
输出："dba"
```

**示例 2：**

```text
输入：root = [25,1,3,1,3,0,2]
输出："adz"
```

**示例 3：**

```text
输入：root = [2,2,1,null,1,0,null,0]
输出："abc"
```

**提示：**

- 给定树的结点数在 `[1, 8500]` 范围内

- `0 <= Node.val <= 25`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 字符串, 回溯, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Smallest String Starting From Leaf：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func smallestFromLeaf(root *TreeNode) string {
	ans := ""
	var dfs func(root *TreeNode, path string)
	dfs = func(root *TreeNode, path string) {
		if root == nil {
			return
		}
		path = string('a'+root.Val) + path
		if root.Left == nil && root.Right == nil {
			if ans == "" || path < ans {
				ans = path
			}
			return
		}
		dfs(root.Left, path)
		dfs(root.Right, path)
	}

	dfs(root, "")
	return ans
}
```

### Java

```java
// Smallest String Starting From Leaf：按照上方思路实现主解法。
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
    private StringBuilder path;
    private String ans;

    public String smallestFromLeaf(TreeNode root) {
        path = new StringBuilder();
        ans = String.valueOf((char) ('z' + 1));
        dfs(root, path);
        return ans;
    }

    private void dfs(TreeNode root, StringBuilder path) {
        if (root != null) {
            path.append((char) ('a' + root.val));
            if (root.left == null && root.right == null) {
                String t = path.reverse().toString();
                if (t.compareTo(ans) < 0) {
                    ans = t;
                }
                path.reverse();
            }
            dfs(root.left, path);
            dfs(root.right, path);
            path.deleteCharAt(path.length() - 1);
        }
    }
}
```

### Python

```python
# Smallest String Starting From Leaf：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def smallestFromLeaf(self, root: TreeNode) -> str:
        ans = chr(ord('z') + 1)

        def dfs(root, path):
            nonlocal ans
            if root:
                path.append(chr(ord('a') + root.val))
                if root.left is None and root.right is None:
                    ans = min(ans, ''.join(reversed(path)))
                dfs(root.left, path)
                dfs(root.right, path)
                path.pop()

        dfs(root, [])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

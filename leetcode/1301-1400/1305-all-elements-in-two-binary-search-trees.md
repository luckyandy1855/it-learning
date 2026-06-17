# 1305. All Elements in Two Binary Search Trees

---
编号: 1305
题目: All Elements in Two Binary Search Trees
难度: 中等
标签: [树, 深度优先搜索, 二叉搜索树, 二叉树, 排序]
来源链接: https://leetcode.com/problems/all-elements-in-two-binary-search-trees/
---

## 题目描述

给你 `root1` 和 `root2` 这两棵二叉搜索树。请你返回一个列表，其中包含 **两棵树 **中的所有整数并按 **升序** 排序。.

**示例 1：**

```text
输入：root1 = [2,1,4], root2 = [1,0,3]
输出：[0,1,1,2,3,4]
```

**示例 2：**

```text
输入：root1 = [1,null,8], root2 = [8,1]
输出：[1,1,8,8]
```

**提示：**

- 每棵树的节点数在 `[0, 5000]` 范围内

- `-10^5 <= Node.val <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 二叉搜索树, 二叉树, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于两棵树都是二叉搜索树，所以我们可以通过中序遍历得到两棵树的节点值序列 $\textit{a}$ 和 $\textit{b}$，然后使用双指针归并两个有序数组，得到最终的答案。

时间复杂度 $O(n+m)$，空间复杂度 $O(n+m)$。其中 $n$ 和 $m$ 分别是两棵树的节点数。

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
// All Elements in Two Binary Search Trees：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func getAllElements(root1 *TreeNode, root2 *TreeNode) (ans []int) {
	var dfs func(*TreeNode, *[]int)
	dfs = func(root *TreeNode, nums *[]int) {
		if root == nil {
			return
		}
		dfs(root.Left, nums)
		*nums = append(*nums, root.Val)
		dfs(root.Right, nums)
	}
	a, b := []int{}, []int{}
	dfs(root1, &a)
	dfs(root2, &b)
	i, j := 0, 0
	m, n := len(a), len(b)
	for i < m && j < n {
		if a[i] < b[j] {
			ans = append(ans, a[i])
			i++
		} else {
			ans = append(ans, b[j])
			j++
		}
	}
	for ; i < m; i++ {
		ans = append(ans, a[i])
	}
	for ; j < n; j++ {
		ans = append(ans, b[j])
	}
	return
}
```

### Java

```java
// All Elements in Two Binary Search Trees：按照上方思路实现主解法。
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
    public List<Integer> getAllElements(TreeNode root1, TreeNode root2) {
        List<Integer> a = new ArrayList<>();
        List<Integer> b = new ArrayList<>();
        dfs(root1, a);
        dfs(root2, b);
        int m = a.size(), n = b.size();
        int i = 0, j = 0;
        List<Integer> ans = new ArrayList<>();
        while (i < m && j < n) {
            if (a.get(i) <= b.get(j)) {
                ans.add(a.get(i++));
            } else {
                ans.add(b.get(j++));
            }
        }
        while (i < m) {
            ans.add(a.get(i++));
        }
        while (j < n) {
            ans.add(b.get(j++));
        }
        return ans;
    }

    private void dfs(TreeNode root, List<Integer> nums) {
        if (root == null) {
            return;
        }
        dfs(root.left, nums);
        nums.add(root.val);
        dfs(root.right, nums);
    }
}
```

### Python

```python
# All Elements in Two Binary Search Trees：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def getAllElements(
        self, root1: Optional[TreeNode], root2: Optional[TreeNode]
    ) -> List[int]:
        def dfs(root: Optional[TreeNode], nums: List[int]) -> int:
            if root is None:
                return
            dfs(root.left, nums)
            nums.append(root.val)
            dfs(root.right, nums)

        a, b = [], []
        dfs(root1, a)
        dfs(root2, b)
        m, n = len(a), len(b)
        i = j = 0
        ans = []
        while i < m and j < n:
            if a[i] <= b[j]:
                ans.append(a[i])
                i += 1
            else:
                ans.append(b[j])
                j += 1
        while i < m:
            ans.append(a[i])
            i += 1
        while j < n:
            ans.append(b[j])
            j += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

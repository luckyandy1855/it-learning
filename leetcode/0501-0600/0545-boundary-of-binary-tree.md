# 0545. Boundary of Binary Tree

---
编号: 545
题目: Boundary of Binary Tree
难度: 中等
标签: [树, 深度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/boundary-of-binary-tree/
---

## 题目描述

二叉树的 **边界** 是由 **根节点 **、**左边界** 、按从左到右顺序的** 叶节点** 和 **逆序的右边界** ，按顺序依次连接组成。

**左边界 **是满足下述定义的节点集合：

- 根节点的左子节点在左边界中。如果根节点不含左子节点，那么左边界就为 **空** 。

- 如果一个节点在左边界中，并且该节点有左子节点，那么它的左子节点也在左边界中。

- 如果一个节点在左边界中，并且该节点 **不含** 左子节点，那么它的右子节点就在左边界中。

- 最左侧的叶节点 **不在** 左边界中。

**右边界** 定义方式与 **左边界** 相同，只是将左替换成右。即，右边界是根节点右子树的右侧部分；叶节点 **不是** 右边界的组成部分；如果根节点不含右子节点，那么右边界为 **空** 。

**叶节点** 是没有任何子节点的节点。对于此问题，根节点 **不是** 叶节点。

给你一棵二叉树的根节点 `root` ，按顺序返回组成二叉树 **边界** 的这些值。

**示例 1：**

```text
输入：root = [1,null,2,3,4]
输出：[1,3,4,2]
解释：
- 左边界为空，因为二叉树不含左子节点。
- 右边界是 [2] 。从根节点的右子节点开始的路径为 2 -> 4 ，但 4 是叶节点，所以右边界只有 2 。
- 叶节点从左到右是 [3,4] 。
按题目要求依序连接得到结果 [1] + [] + [3,4] + [2] = [1,3,4,2] 。
```

**示例 2：**

```text
输入：root = [1,2,3,4,5,6,null,null,null,7,8,9,10]
输出：[1,2,4,7,8,9,10,6,3]
解释：
- 左边界为 [2] 。从根节点的左子节点开始的路径为 2 -> 4 ，但 4 是叶节点，所以左边界只有 2 。
- 右边界是 [3,6] ，逆序为 [6,3] 。从根节点的右子节点开始的路径为 3 -> 6 -> 10 ，但 10 是叶节点。
- 叶节点从左到右是 [4,7,8,9,10]
按题目要求依序连接得到结果 [1] + [2] + [4,7,8,9,10] + [6,3] = [1,2,4,7,8,9,10,6,3] 。
```

**提示：**

- 树中节点的数目在范围 `[1, 10^4]` 内

- `-1000 <= Node.val <= 1000`

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

首先，如果树只有一个节点，那么直接返回这个节点的值的列表。

否则，我们可以通过深度优先搜索，找到二叉树的左边界、叶节点和右边界。

具体地，我们可以通过一个递归函数 $\textit{dfs}$ 来找到这三个部分。在 $\textit{dfs}$ 函数中，我们需要传入一个列表 $\textit{nums}$，一个节点 $\textit{root}$ 和一个整数 $\textit{i}$，其中 $\textit{nums}$ 用来存储当前部分的节点值，而 $\textit{root}$ 和 $\textit{i}$ 分别表示当前节点和当前部分的类型（左边界, 叶节点或右边界）。

函数的具体实现如下：

- 如果 $\textit{root}$ 为空，那么直接返回。
- 如果 $\textit{i} = 0$，那么我们需要找到左边界。如果 $\textit{root}$ 不是叶节点，那么我们将 $\textit{root}$ 的值加入到 $\textit{nums}$ 中。如果 $\textit{root}$ 有左子节点，那么我们递归地调用 $\textit{dfs}$ 函数，传入 $\textit{nums}$, $\textit{root}$ 的左子节点和 $\textit{i}$。否则，我们递归地调用 $\textit{dfs}$ 函数，传入 $\textit{nums}$, $\textit{root}$ 的右子节点和 $\textit{i}$。
- 如果 $\textit{i} = 1$，那么我们需要找到叶节点。如果 $\textit{root}$ 是叶节点，那么我们将 $\textit{root}$ 的值加入到 $\textit{nums}$ 中。否则，我们递归地调用 $\textit{dfs}$ 函数，传入 $\textit{nums}$, $\textit{root}$ 的左子节点和 $\textit{i}$，以及 $\textit{nums}$, $\textit{root}$ 的右子节点和 $\textit{i}$。
- 如果 $\textit{i} = 2$，那么我们需要找到右边界。如果 $\textit{root}$ 不是叶节点，那么我们将 $\textit{root}$ 的值加入到 $\textit{nums}$ 中，如果 $\textit{root}$ 有右子节点，那么我们递归地调用 $\textit{dfs}$ 函数，传入 $\textit{nums}$, $\textit{root}$ 的右子节点和 $\textit{i}$。否则，我们递归地调用 $\textit{dfs}$ 函数，传入 $\textit{nums}$, $\textit{root}$ 的左子节点和 $\textit{i}$。

我们分别调用 $\textit{dfs}$ 函数，找到左边界、叶节点和右边界，然后将这三个部分连接起来，即可得到答案。

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
// Boundary of Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func boundaryOfBinaryTree(root *TreeNode) []int {
	ans := []int{root.Val}
	if root.Left == root.Right {
		return ans
	}

	left, leaves, right := []int{}, []int{}, []int{}

	var dfs func(nums *[]int, root *TreeNode, i int)
	dfs = func(nums *[]int, root *TreeNode, i int) {
		if root == nil {
			return
		}
		if i == 0 {
			if root.Left != root.Right {
				*nums = append(*nums, root.Val)
				if root.Left != nil {
					dfs(nums, root.Left, i)
				} else {
					dfs(nums, root.Right, i)
				}
			}
		} else if i == 1 {
			if root.Left == root.Right {
				*nums = append(*nums, root.Val)
			} else {
				dfs(nums, root.Left, i)
				dfs(nums, root.Right, i)
			}
		} else {
			if root.Left != root.Right {
				*nums = append(*nums, root.Val)
				if root.Right != nil {
					dfs(nums, root.Right, i)
				} else {
					dfs(nums, root.Left, i)
				}
			}
		}
	}

	dfs(&left, root.Left, 0)
	dfs(&leaves, root, 1)
	dfs(&right, root.Right, 2)

	ans = append(ans, left...)
	ans = append(ans, leaves...)
	for i := len(right) - 1; i >= 0; i-- {
		ans = append(ans, right[i])
	}

	return ans
}
```

### Java

```java
// Boundary of Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> boundaryOfBinaryTree(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        ans.add(root.val);
        if (root.left == root.right) {
            return ans;
        }
        List<Integer> left = new ArrayList<>();
        List<Integer> leaves = new ArrayList<>();
        List<Integer> right = new ArrayList<>();
        dfs(left, root.left, 0);
        dfs(leaves, root, 1);
        dfs(right, root.right, 2);

        ans.addAll(left);
        ans.addAll(leaves);
        Collections.reverse(right);
        ans.addAll(right);
        return ans;
    }

    private void dfs(List<Integer> nums, TreeNode root, int i) {
        if (root == null) {
            return;
        }
        if (i == 0) {
            if (root.left != root.right) {
                nums.add(root.val);
                if (root.left != null) {
                    dfs(nums, root.left, i);
                } else {
                    dfs(nums, root.right, i);
                }
            }
        } else if (i == 1) {
            if (root.left == root.right) {
                nums.add(root.val);
            } else {
                dfs(nums, root.left, i);
                dfs(nums, root.right, i);
            }
        } else {
            if (root.left != root.right) {
                nums.add(root.val);
                if (root.right != null) {
                    dfs(nums, root.right, i);
                } else {
                    dfs(nums, root.left, i);
                }
            }
        }
    }
}
```

### Python

```python
# Boundary of Binary Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def boundaryOfBinaryTree(self, root: Optional[TreeNode]) -> List[int]:
        def dfs(nums: List[int], root: Optional[TreeNode], i: int):
            if root is None:
                return
            if i == 0:
                if root.left != root.right:
                    nums.append(root.val)
                    if root.left:
                        dfs(nums, root.left, i)
                    else:
                        dfs(nums, root.right, i)
            elif i == 1:
                if root.left == root.right:
                    nums.append(root.val)
                else:
                    dfs(nums, root.left, i)
                    dfs(nums, root.right, i)
            else:
                if root.left != root.right:
                    nums.append(root.val)
                    if root.right:
                        dfs(nums, root.right, i)
                    else:
                        dfs(nums, root.left, i)

        ans = [root.val]
        if root.left == root.right:
            return ans
        left, leaves, right = [], [], []
        dfs(left, root.left, 0)
        dfs(leaves, root, 1)
        dfs(right, root.right, 2)
        ans += left + leaves + right[::-1]
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

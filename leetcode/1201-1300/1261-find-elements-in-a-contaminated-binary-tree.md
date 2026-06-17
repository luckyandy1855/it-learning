# 1261. Find Elements in a Contaminated Binary Tree

---
编号: 1261
题目: Find Elements in a Contaminated Binary Tree
难度: 中等
标签: [树, 深度优先搜索, 广度优先搜索, 设计, 哈希表, 二叉树]
来源链接: https://leetcode.com/problems/find-elements-in-a-contaminated-binary-tree/
---

## 题目描述

给出一个满足下述规则的二叉树：

- `root.val == 0`

- 对于任意 `treeNode`：

- 如果 `treeNode.val` 为 `x` 且 `treeNode.left != null`，那么 `treeNode.left.val == 2 * x + 1`

- 如果 `treeNode.val` 为 `x` 且 `treeNode.right != null`，那么 `treeNode.right.val == 2 * x + 2`

现在这个二叉树受到「污染」，所有的 `treeNode.val` 都变成了 `-1`。

请你先还原二叉树，然后实现 `FindElements` 类：

- `FindElements(TreeNode* root)` 用受污染的二叉树初始化对象，你需要先把它还原。

- `bool find(int target)` 判断目标值 `target` 是否存在于还原后的二叉树中并返回结果。

示例 1：

****

```text
输入：
["FindElements","find","find"]
[[[-1,null,-1]],[1],[2]]
输出：
[null,false,true]
解释：
FindElements findElements = new FindElements([-1,null,-1]);
findElements.find(1); // return False
findElements.find(2); // return True
```

示例 2：

****

```text
输入：
["FindElements","find","find","find"]
[[[-1,-1,-1,-1,-1]],[1],[3],[5]]
输出：
[null,true,true,false]
解释：
FindElements findElements = new FindElements([-1,-1,-1,-1,-1]);
findElements.find(1); // return True
findElements.find(3); // return True
findElements.find(5); // return False
```

示例 3：

****

```text
输入：
["FindElements","find","find","find","find"]
[[[-1,null,-1,-1,null,-1]],[2],[3],[4],[5]]
输出：
[null,true,false,false,true]
解释：
FindElements findElements = new FindElements([-1,null,-1,-1,null,-1]);
findElements.find(2); // return True
findElements.find(3); // return False
findElements.find(4); // return False
findElements.find(5); // return True
```

**提示：**

- `TreeNode.val == -1`

- 二叉树的高度不超过 `20`

- 节点的总数在 `[1, 10^4]` 之间

- 调用 `find()` 的总次数在 `[1, 10^4]` 之间

- `0 <= target <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 设计, 哈希表, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先通过 DFS 遍历二叉树，将节点值恢复为原来的值，并将所有节点值存入哈希表中。然后在查找时，只需要判断哈希表中是否存在目标值即可。

时间复杂度方面，初始化时需要遍历二叉树，时间复杂度为 $O(n)$，查找时只需要判断哈希表中是否存在目标值，时间复杂度为 $O(1)$。空间复杂度 $O(n)$。其中 $n$ 为二叉树节点个数。

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
// Find Elements in a Contaminated Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
type FindElements struct {
	s map[int]bool
}

func Constructor(root *TreeNode) FindElements {
	root.Val = 0
	s := map[int]bool{}
	var dfs func(*TreeNode)
	dfs = func(root *TreeNode) {
		s[root.Val] = true
		if root.Left != nil {
			root.Left.Val = root.Val*2 + 1
			dfs(root.Left)
		}
		if root.Right != nil {
			root.Right.Val = root.Val*2 + 2
			dfs(root.Right)
		}
	}
	dfs(root)
	return FindElements{s}
}

func (this *FindElements) Find(target int) bool {
	return this.s[target]
}

/**
 * Your FindElements object will be instantiated and called as such:
 * obj := Constructor(root);
 * param_1 := obj.Find(target);
 */
```

### Java

```java
// Find Elements in a Contaminated Binary Tree：按照上方思路实现主解法。
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
class FindElements {
    private Set<Integer> s = new HashSet<>();

    public FindElements(TreeNode root) {
        root.val = 0;
        dfs(root);
    }

    public boolean find(int target) {
        return s.contains(target);
    }

    private void dfs(TreeNode root) {
        s.add(root.val);
        if (root.left != null) {
            root.left.val = root.val * 2 + 1;
            dfs(root.left);
        }
        if (root.right != null) {
            root.right.val = root.val * 2 + 2;
            dfs(root.right);
        }
    }
}

/**
 * Your FindElements object will be instantiated and called as such:
 * FindElements obj = new FindElements(root);
 * boolean param_1 = obj.find(target);
 */
```

### Python

```python
# Find Elements in a Contaminated Binary Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class FindElements:

    def __init__(self, root: Optional[TreeNode]):
        def dfs(root: Optional[TreeNode]):
            self.s.add(root.val)
            if root.left:
                root.left.val = root.val * 2 + 1
                dfs(root.left)
            if root.right:
                root.right.val = root.val * 2 + 2
                dfs(root.right)

        root.val = 0
        self.s = set()
        dfs(root)

    def find(self, target: int) -> bool:
        return target in self.s


# Your FindElements object will be instantiated and called as such:
# obj = FindElements(root)
# param_1 = obj.find(target)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

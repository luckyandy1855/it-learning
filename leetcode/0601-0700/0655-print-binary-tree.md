# 0655. Print Binary Tree

---
编号: 655
题目: Print Binary Tree
难度: 中等
标签: [树, 深度优先搜索, 广度优先搜索, 二叉树]
来源链接: https://leetcode.com/problems/print-binary-tree/
---

## 题目描述

给你一棵二叉树的根节点 `root` ，请你构造一个下标从 **0** 开始、大小为 `m x n` 的字符串矩阵 `res` ，用以表示树的 **格式化布局** 。构造此格式化布局矩阵需要遵循以下规则：

- 树的 **高度** 为 `height` ，矩阵的行数 `m` 应该等于 `height + 1` 。

- 矩阵的列数 `n` 应该等于 `2^height+1 - 1` 。

- **根节点** 需要放置在 **顶行** 的 **正中间** ，对应位置为 `res[0][(n-1)/2]` 。

- 对于放置在矩阵中的每个节点，设对应位置为 `res[r][c]` ，将其左子节点放置在 `res[r+1][c-2^height-r-1]` ，右子节点放置在 `res[r+1][c+2^height-r-1]` 。

- 继续这一过程，直到树中的所有节点都妥善放置。

- 任意空单元格都应该包含空字符串 `""` 。

返回构造得到的矩阵* *`res` 。

**示例 1：**

```text
输入：root = [1,2]
输出：
[["","1",""],
 ["2","",""]]
```

**示例 2：**

```text
输入：root = [1,2,3,null,4]
输出：
[["","","","1","","",""],
 ["","2","","","","3",""],
 ["","","4","","","",""]]
```

**提示：**

- 树中节点数在范围 `[1, 2^10]` 内

- `-99 <= Node.val <= 99`

- 树的深度在范围 `[1, 10]` 内

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

先通过 `DFS` 求二叉树的高度 $h$（高度从 `0` 开始），然后根据 $h$ 求得结果列表的行数 $m$ 和列数 $n$。

根据 $m$, $n$ 初始化结果列表 `ans`，然后 `DFS` 遍历二叉树，依次在每个位置填入二叉树节点值（字符串形式）即可。

时间复杂度 $O(h\times 2^h)$，空间复杂度 $O(h)$。其中 $h$ 是二叉树的高度。忽略结果返回值的空间消耗。

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
// Print Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func printTree(root *TreeNode) [][]string {
	var height func(root *TreeNode) int
	height = func(root *TreeNode) int {
		if root == nil {
			return -1
		}
		return 1 + max(height(root.Left), height(root.Right))
	}
	h := height(root)
	m, n := h+1, (1<<(h+1))-1
	ans := make([][]string, m)
	for i := range ans {
		ans[i] = make([]string, n)
		for j := range ans[i] {
			ans[i][j] = ""
		}
	}
	var dfs func(root *TreeNode, r, c int)
	dfs = func(root *TreeNode, r, c int) {
		if root == nil {
			return
		}
		ans[r][c] = strconv.Itoa(root.Val)
		dfs(root.Left, r+1, c-int(math.Pow(float64(2), float64(h-r-1))))
		dfs(root.Right, r+1, c+int(math.Pow(float64(2), float64(h-r-1))))
	}

	dfs(root, 0, (n-1)/2)
	return ans
}
```

### Java

```java
// Print Binary Tree：按照上方思路实现主解法。
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
    public List<List<String>> printTree(TreeNode root) {
        int h = height(root);
        int m = h + 1, n = (1 << (h + 1)) - 1;
        String[][] res = new String[m][n];
        for (int i = 0; i < m; ++i) {
            Arrays.fill(res[i], "");
        }
        dfs(root, res, h, 0, (n - 1) / 2);
        List<List<String>> ans = new ArrayList<>();
        for (String[] t : res) {
            ans.add(Arrays.asList(t));
        }
        return ans;
    }

    private void dfs(TreeNode root, String[][] res, int h, int r, int c) {
        if (root == null) {
            return;
        }
        res[r][c] = String.valueOf(root.val);
        dfs(root.left, res, h, r + 1, c - (1 << (h - r - 1)));
        dfs(root.right, res, h, r + 1, c + (1 << (h - r - 1)));
    }

    private int height(TreeNode root) {
        if (root == null) {
            return -1;
        }
        return 1 + Math.max(height(root.left), height(root.right));
    }
}
```

### Python

```python
# Print Binary Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def printTree(self, root: Optional[TreeNode]) -> List[List[str]]:
        def height(root):
            if root is None:
                return -1
            return 1 + max(height(root.left), height(root.right))

        def dfs(root, r, c):
            if root is None:
                return
            ans[r][c] = str(root.val)
            dfs(root.left, r + 1, c - 2 ** (h - r - 1))
            dfs(root.right, r + 1, c + 2 ** (h - r - 1))

        h = height(root)
        m, n = h + 1, 2 ** (h + 1) - 1
        ans = [[""] * n for _ in range(m)]
        dfs(root, 0, (n - 1) // 2)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

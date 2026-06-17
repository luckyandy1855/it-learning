# 0314. Binary Tree Vertical Order Traversal

---
编号: 314
题目: Binary Tree Vertical Order Traversal
难度: 中等
标签: [树, 深度优先搜索, 广度优先搜索, 哈希表, 二叉树, 排序]
来源链接: https://leetcode.com/problems/binary-tree-vertical-order-traversal/
---

## 题目描述

给你一个二叉树的根结点，返回其结点按 **垂直方向**（从上到下，逐列）遍历的结果。

如果两个结点在同一行和列，那么顺序则为 **从左到右**。

示例 1：

```text
输入：root = [3,9,20,null,null,15,7]
输出：[[9],[3,15],[20],[7]]
```

示例 2：

```text
输入：root = [3,9,8,4,0,1,7]
输出：[[4],[9],[3,0,1],[8],[7]]
```

示例 3：

```text
输入：root = [1,2,3,4,10,9,11,null,5,null,null,null,null,null,null,null,6]
输出：[[4],[2,5],[1,10,9,6],[3],[11]]
```

**提示：**

	- 树中结点的数目在范围 `[0, 100]` 内

	- `-100 <= Node.val <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 哈希表, 二叉树, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

DFS 遍历二叉树，记录每个节点的值、深度，以及横向的偏移量。然后对所有节点按照横向偏移量从小到大排序，再按照深度从小到大排序，最后按照横向偏移量分组。

时间复杂度 $O(n\log \log n)$，空间复杂度 $O(n)$。其中 $n$ 为二叉树的节点个数。

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
// Binary Tree Vertical Order Traversal：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func verticalOrder(root *TreeNode) [][]int {
	d := map[int][][]int{}
	var dfs func(*TreeNode, int, int)
	dfs = func(root *TreeNode, depth, offset int) {
		if root == nil {
			return
		}
		d[offset] = append(d[offset], []int{depth, root.Val})
		dfs(root.Left, depth+1, offset-1)
		dfs(root.Right, depth+1, offset+1)
	}
	dfs(root, 0, 0)
	idx := []int{}
	for i := range d {
		idx = append(idx, i)
	}
	sort.Ints(idx)
	ans := [][]int{}
	for _, i := range idx {
		v := d[i]
		sort.SliceStable(v, func(i, j int) bool { return v[i][0] < v[j][0] })
		t := []int{}
		for _, x := range v {
			t = append(t, x[1])
		}
		ans = append(ans, t)
	}
	return ans
}
```

### Java

```java
// Binary Tree Vertical Order Traversal：按照上方思路实现主解法。
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
    private TreeMap<Integer, List<int[]>> d = new TreeMap<>();

    public List<List<Integer>> verticalOrder(TreeNode root) {
        dfs(root, 0, 0);
        List<List<Integer>> ans = new ArrayList<>();
        for (var v : d.values()) {
            Collections.sort(v, (a, b) -> a[0] - b[0]);
            List<Integer> t = new ArrayList<>();
            for (var e : v) {
                t.add(e[1]);
            }
            ans.add(t);
        }
        return ans;
    }

    private void dfs(TreeNode root, int depth, int offset) {
        if (root == null) {
            return;
        }
        d.computeIfAbsent(offset, k -> new ArrayList<>()).add(new int[] {depth, root.val});
        dfs(root.left, depth + 1, offset - 1);
        dfs(root.right, depth + 1, offset + 1);
    }
}
```

### Python

```python
# Binary Tree Vertical Order Traversal：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def verticalOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        def dfs(root, depth, offset):
            if root is None:
                return
            d[offset].append((depth, root.val))
            dfs(root.left, depth + 1, offset - 1)
            dfs(root.right, depth + 1, offset + 1)

        d = defaultdict(list)
        dfs(root, 0, 0)
        ans = []
        for _, v in sorted(d.items()):
            v.sort(key=lambda x: x[0])
            ans.append([x[1] for x in v])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

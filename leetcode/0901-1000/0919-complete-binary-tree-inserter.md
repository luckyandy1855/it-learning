# 0919. Complete Binary Tree Inserter

---
编号: 919
题目: Complete Binary Tree Inserter
难度: 中等
标签: [树, 广度优先搜索, 设计, 二叉树]
来源链接: https://leetcode.com/problems/complete-binary-tree-inserter/
---

## 题目描述

**完全二叉树** 是每一层（除最后一层外）都是完全填充（即，节点数达到最大）的，并且所有的节点都尽可能地集中在左侧。

设计一种算法，将一个新节点插入到一棵完全二叉树中，并在插入后保持其完整。

实现 `CBTInserter` 类:

- `CBTInserter(TreeNode root)` 使用头节点为 `root` 的给定树初始化该数据结构；

- `CBTInserter.insert(int v)`  向树中插入一个值为 `Node.val == val`的新节点 `TreeNode`。使树保持完全二叉树的状态，**并返回插入节点** `TreeNode` **的父节点的值**；

- `CBTInserter.get_root()` 将返回树的头节点。

**示例 1：**

```text
输入
["CBTInserter", "insert", "insert", "get_root"]
[[[1, 2]], [3], [4], []]
输出
[null, 1, 2, [1, 2, 3, 4]]

解释
CBTInserter cBTInserter = new CBTInserter([1, 2]);
cBTInserter.insert(3);  // 返回 1
cBTInserter.insert(4);  // 返回 2
cBTInserter.get_root(); // 返回 [1, 2, 3, 4]
```

**提示：**

- 树中节点数量范围为 `[1, 1000]`

- `0 <= Node.val <= 5000`

- `root` 是完全二叉树

- `0 <= val <= 5000`

- 每个测试用例最多调用 `insert` 和 `get_root` 操作 `10^4` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 广度优先搜索, 设计, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用一个数组 $tree$ 来存储完全二叉树的所有节点。在初始化时，我们使用一个队列 $q$ 来层序遍历给定的树，并将所有节点存储到数组 $tree$ 中。

在插入节点时，我们可以通过数组 $tree$ 来找到新节点的父节点 $p$。然后我们创建一个新节点 $node$，将其插入到数组 $tree$ 中，并将 $node$ 作为 $p$ 的左子节点或右子节点。最后返回 $p$ 的值。

在获取根节点时，我们直接返回数组 $tree$ 的第一个元素。

时间复杂度方面，初始化时需要 $O(n)$ 的时间，插入节点和获取根节点的时间复杂度均为 $O(1)$。空间复杂度为 $O(n)$。其中 $n$ 为树中节点的数量。

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
// Complete Binary Tree Inserter：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
type CBTInserter struct {
	tree []*TreeNode
}

func Constructor(root *TreeNode) CBTInserter {
	q := []*TreeNode{root}
	tree := []*TreeNode{}
	for len(q) > 0 {
		for i := len(q); i > 0; i-- {
			node := q[0]
			q = q[1:]
			tree = append(tree, node)
			if node.Left != nil {
				q = append(q, node.Left)
			}
			if node.Right != nil {
				q = append(q, node.Right)
			}
		}
	}
	return CBTInserter{tree}
}

func (this *CBTInserter) Insert(val int) int {
	p := this.tree[(len(this.tree)-1)/2]
	node := &TreeNode{val, nil, nil}
	this.tree = append(this.tree, node)
	if p.Left == nil {
		p.Left = node
	} else {
		p.Right = node
	}
	return p.Val
}

func (this *CBTInserter) Get_root() *TreeNode {
	return this.tree[0]
}

/**
 * Your CBTInserter object will be instantiated and called as such:
 * obj := Constructor(root);
 * param_1 := obj.Insert(val);
 * param_2 := obj.Get_root();
 */
```

### Java

```java
// Complete Binary Tree Inserter：按照上方思路实现主解法。
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
class CBTInserter {
    private List<TreeNode> tree = new ArrayList<>();

    public CBTInserter(TreeNode root) {
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            for (int i = q.size(); i > 0; --i) {
                TreeNode node = q.poll();
                tree.add(node);
                if (node.left != null) {
                    q.offer(node.left);
                }
                if (node.right != null) {
                    q.offer(node.right);
                }
            }
        }
    }

    public int insert(int val) {
        TreeNode p = tree.get((tree.size() - 1) / 2);
        TreeNode node = new TreeNode(val);
        tree.add(node);
        if (p.left == null) {
            p.left = node;
        } else {
            p.right = node;
        }
        return p.val;
    }

    public TreeNode get_root() {
        return tree.get(0);
    }
}

/**
 * Your CBTInserter object will be instantiated and called as such:
 * CBTInserter obj = new CBTInserter(root);
 * int param_1 = obj.insert(val);
 * TreeNode param_2 = obj.get_root();
 */
```

### Python

```python
# Complete Binary Tree Inserter：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class CBTInserter:

    def __init__(self, root: Optional[TreeNode]):
        self.tree = []
        q = deque([root])
        while q:
            for _ in range(len(q)):
                node = q.popleft()
                self.tree.append(node)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)

    def insert(self, val: int) -> int:
        p = self.tree[(len(self.tree) - 1) // 2]
        node = TreeNode(val)
        self.tree.append(node)
        if p.left is None:
            p.left = node
        else:
            p.right = node
        return p.val

    def get_root(self) -> Optional[TreeNode]:
        return self.tree[0]


# Your CBTInserter object will be instantiated and called as such:
# obj = CBTInserter(root)
# param_1 = obj.insert(val)
# param_2 = obj.get_root()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

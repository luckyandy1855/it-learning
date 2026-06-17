# 1171. Remove Zero Sum Consecutive Nodes from Linked List

---
编号: 1171
题目: Remove Zero Sum Consecutive Nodes from Linked List
难度: 中等
标签: [哈希表, 链表]
来源链接: https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list/
---

## 题目描述

给你一个链表的头节点 `head`，请你编写代码，反复删去链表中由 **总和** 值为 `0` 的连续节点组成的序列，直到不存在这样的序列为止。

删除完毕后，请你返回最终结果链表的头节点。

你可以返回任何满足题目要求的答案。

（注意，下面示例中的所有序列，都是对 `ListNode` 对象序列化的表示。）

**示例 1：**

```text
输入：head = [1,2,-3,3,1]
输出：[3,1]
提示：答案 [1,2,1] 也是正确的。
```

**示例 2：**

```text
输入：head = [1,2,3,-3,4]
输出：[1,2,4]
```

**示例 3：**

```text
输入：head = [1,2,3,-3,-2]
输出：[1]
```

**提示：**

- 给你的链表中可能有 `1` 到 `1000` 个节点。

- 对于链表中的每个节点，节点的值：`-1000 <= node.val <= 1000`.

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 链表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

若链表节点的两个前缀和相等，说明两个前缀和之间的连续节点序列的和为 $0$，那么可以消去这部分连续节点。

我们第一次遍历链表，用哈希表 $last$ 记录前缀和以及对应的链表节点，对于同一前缀和 $s$，后面出现的节点覆盖前面的节点。

接下来，我们再次遍历链表，若当前节点 $cur$ 的前缀和 $s$ 在 $last$ 出现，说明 $cur$ 与 $last[s]$ 之间的所有节点和为 $0$，我们直接修改 $cur$ 的指向，即 $cur.next = last[s].next$，这样就删去了这部分和为 $0$ 的连续节点。继续往后遍历，删除所有和为 $0$ 的连续节点。

最后返回链表的头节点 $dummy.next$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为链表的长度。

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
// Remove Zero Sum Consecutive Nodes from Linked List：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func removeZeroSumSublists(head *ListNode) *ListNode {
	dummy := &ListNode{0, head}
	last := map[int]*ListNode{}
	cur := dummy
	s := 0
	for cur != nil {
		s += cur.Val
		last[s] = cur
		cur = cur.Next
	}
	s = 0
	cur = dummy
	for cur != nil {
		s += cur.Val
		cur.Next = last[s].Next
		cur = cur.Next
	}
	return dummy.Next
}
```

### Java

```java
// Remove Zero Sum Consecutive Nodes from Linked List：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode removeZeroSumSublists(ListNode head) {
        ListNode dummy = new ListNode(0, head);
        Map<Integer, ListNode> last = new HashMap<>();
        int s = 0;
        ListNode cur = dummy;
        while (cur != null) {
            s += cur.val;
            last.put(s, cur);
            cur = cur.next;
        }
        s = 0;
        cur = dummy;
        while (cur != null) {
            s += cur.val;
            cur.next = last.get(s).next;
            cur = cur.next;
        }
        return dummy.next;
    }
}
```

### Python

```python
# Remove Zero Sum Consecutive Nodes from Linked List：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def removeZeroSumSublists(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(next=head)
        last = {}
        s, cur = 0, dummy
        while cur:
            s += cur.val
            last[s] = cur
            cur = cur.next
        s, cur = 0, dummy
        while cur:
            s += cur.val
            cur.next = last[s].next
            cur = cur.next
        return dummy.next
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

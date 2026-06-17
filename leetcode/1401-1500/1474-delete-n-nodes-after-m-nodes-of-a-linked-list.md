# 1474. Delete N Nodes After M Nodes of a Linked List

---
编号: 1474
题目: Delete N Nodes After M Nodes of a Linked List
难度: 简单
标签: [链表]
来源链接: https://leetcode.com/problems/delete-n-nodes-after-m-nodes-of-a-linked-list/
---

## 题目描述

给定链表 `head` 和两个整数 `m` 和 `n`. 遍历该链表并按照如下方式删除节点:

- 开始时以头节点作为当前节点.

- 保留以当前节点开始的前 `m` 个节点.

- 删除接下来的 `n` 个节点.

- 重复步骤 2 和 3, 直到到达链表结尾.

在删除了指定结点之后, 返回修改过后的链表的头节点.

**示例 1:**

****

```text
输入: head = [1,2,3,4,5,6,7,8,9,10,11,12,13], m = 2, n = 3
输出: [1,2,6,7,11,12]
解析: 保留前(m = 2)个结点,  也就是以黑色节点表示的从链表头结点开始的结点(1 ->2).
删除接下来的(n = 3)个结点(3 -> 4 -> 5), 在图中以红色结点表示.
继续相同的操作, 直到链表的末尾.
返回删除结点之后的链表的头结点.
```

**示例 2:**

****

```text
输入: head = [1,2,3,4,5,6,7,8,9,10,11], m = 1, n = 3
输出: [1,5,9]
解析: 返回删除结点之后的链表的头结点.
```

**示例 3:**

```text
输入: head = [1,2,3,4,5,6,7,8,9,10,11], m = 3, n = 1
输出: [1,2,3,5,6,7,9,10,11]
```

**示例 4:**

```text
输入: head = [9,3,7,7,9,10,8,2], m = 1, n = 2
输出: [9,7,8]
```

**提示:**

- 链表中节点数目在范围 `[1, 10^4]` 内

- `1 <= Node.val <= 10^6`

- `1 <= m, n <= 1000`

**进阶:** 你能通过** 就地 **修改链表的方式解决这个问题吗?

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「链表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以模拟整个删除过程，首先用 $\textit{pre}$ 指针指向链表头部，然后遍历链表，移动 $m - 1$ 步，如果 $\textit{pre}$ 为空，说明从当前节点开始的节点个数小于 $m$，直接返回头部；否则，用 $\textit{cur}$ 指针指向 $\textit{pre}$，然后移动 $n$ 步，如果 $\textit{cur}$ 为空，说明从 $\textit{pre}$ 开始的节点个数小于 $m + n$，直接将 $\textit{pre}$ 的 $\textit{next}$ 指向 $\text{null}$；否则，将 $\textit{pre}$ 的 $\textit{next}$ 指向 $\textit{cur}$ 的 $\textit{next}$，然后将 $\textit{pre}$ 移动到 $\textit{pre}$ 的 $\textit{next}$。继续遍历链表，直到 $\textit{pre}$ 为空，返回头部。

时间复杂度 $O(n)$，其中 $n$ 是链表中节点的个数。空间复杂度 $O(1)$。

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
// Delete N Nodes After M Nodes of a Linked List：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func deleteNodes(head *ListNode, m int, n int) *ListNode {
	pre := head
	for pre != nil {
		for i := 0; i < m-1 && pre != nil; i++ {
			pre = pre.Next
		}
		if pre == nil {
			return head
		}
		cur := pre
		for i := 0; i < n && cur != nil; i++ {
			cur = cur.Next
		}
		pre.Next = nil
		if cur != nil {
			pre.Next = cur.Next
		}
		pre = pre.Next
	}
	return head
}
```

### Java

```java
// Delete N Nodes After M Nodes of a Linked List：按照上方思路实现主解法。
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
    public ListNode deleteNodes(ListNode head, int m, int n) {
        ListNode pre = head;
        while (pre != null) {
            for (int i = 0; i < m - 1 && pre != null; ++i) {
                pre = pre.next;
            }
            if (pre == null) {
                return head;
            }
            ListNode cur = pre;
            for (int i = 0; i < n && cur != null; ++i) {
                cur = cur.next;
            }
            pre.next = cur == null ? null : cur.next;
            pre = pre.next;
        }
        return head;
    }
}
```

### Python

```python
# Delete N Nodes After M Nodes of a Linked List：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def deleteNodes(self, head: ListNode, m: int, n: int) -> ListNode:
        pre = head
        while pre:
            for _ in range(m - 1):
                if pre:
                    pre = pre.next
            if pre is None:
                return head
            cur = pre
            for _ in range(n):
                if cur:
                    cur = cur.next
            pre.next = None if cur is None else cur.next
            pre = pre.next
        return head
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

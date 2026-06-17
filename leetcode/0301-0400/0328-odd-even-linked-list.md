# 0328. Odd Even Linked List

---
编号: 328
题目: Odd Even Linked List
难度: 中等
标签: [链表]
来源链接: https://leetcode.com/problems/odd-even-linked-list/
---

## 题目描述

给定单链表的头节点 `head` ，将所有索引为奇数的节点和索引为偶数的节点分别分组，保持它们原有的相对顺序，然后把偶数索引节点分组连接到奇数索引节点分组之后，返回重新排序的链表。

**第一个**节点的索引被认为是 **奇数** ， **第二个**节点的索引为 **偶数** ，以此类推。

请注意，偶数组和奇数组内部的相对顺序应该与输入时保持一致。

你必须在 `O(1)` 的额外空间复杂度和 `O(n)` 的时间复杂度下解决这个问题。

**示例 1:**

```text
输入: head = [1,2,3,4,5]
输出: [1,3,5,2,4]
```

**示例 2:**

```text
输入: head = [2,1,3,5,6,4,7]
输出: [2,3,6,7,1,5,4]
```

**提示:**

	- `n == ` 链表中的节点数

	- `0 <= n <= 10^4`

	- `-10^6 <= Node.val <= 10^6`

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

我们可以用两个指针 $a$ 和 $b$ 分别表示奇数节点和偶数节点的尾节点。初始时，指针 $a$ 指向链表的头节点 $head$，指针 $b$ 指向链表的第二个节点 $head.next$。另外，我们用一个指针 $c$ 指向偶数节点的头节点 $head.next$，即指针 $b$ 的初始位置。

遍历链表，我们将指针 $a$ 指向 $b$ 的下一个节点，即 $a.next = b.next$，然后将指针 $a$ 向后移动一位，即 $a = a.next$；将指针 $b$ 指向 $a$ 的下一个节点，即 $b.next = a.next$，然后将指针 $b$ 向后移动一位，即 $b = b.next$。继续遍历，直到 $b$ 到达链表的末尾。

最后，我们将奇数节点的尾节点 $a$ 指向偶数节点的头节点 $c$，即 $a.next = c$，然后返回链表的头节点 $head$ 即可。

时间复杂度 $O(n)$，其中 $n$ 是链表的长度，需要遍历链表一次。空间复杂度 $O(1)$。只需要维护有限的指针。

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
// Odd Even Linked List：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func oddEvenList(head *ListNode) *ListNode {
	if head == nil {
		return nil
	}
	a := head
	b, c := head.Next, head.Next
	for b != nil && b.Next != nil {
		a.Next = b.Next
		a = a.Next
		b.Next = a.Next
		b = b.Next
	}
	a.Next = c
	return head
}
```

### Java

```java
// Odd Even Linked List：按照上方思路实现主解法。
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
    public ListNode oddEvenList(ListNode head) {
        if (head == null) {
            return null;
        }
        ListNode a = head;
        ListNode b = head.next, c = b;
        while (b != null && b.next != null) {
            a.next = b.next;
            a = a.next;
            b.next = a.next;
            b = b.next;
        }
        a.next = c;
        return head;
    }
}
```

### Python

```python
# Odd Even Linked List：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if head is None:
            return None
        a = head
        b = c = head.next
        while b and b.next:
            a.next = b.next
            a = a.next
            b.next = a.next
            b = b.next
        a.next = c
        return head
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

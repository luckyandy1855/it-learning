# 0019. Remove Nth Node From End of List

---
编号: 19
题目: Remove Nth Node From End of List
难度: 中等
标签: [链表, 双指针]
来源链接: https://leetcode.com/problems/remove-nth-node-from-end-of-list/
---

## 题目描述

给定链表的头节点 `head`，删除链表中倒数第 `n` 个节点，并返回链表头节点。

题目保证：

- `n` 合法，一定在链表长度范围内。
- 进阶要求：只遍历一次链表。

### Example 1

```text
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
Explanation: 倒数第 2 个节点是 4，删除后链表变为 1->2->3->5。
```

### Example 2

```text
Input: head = [1], n = 1
Output: []
```

### Example 3

```text
Input: head = [1,2], n = 1
Output: [1]
```

### 约束条件

- 链表节点数为 `sz`，`1 <= sz <= 30`。
- `0 <= Node.val <= 100`
- `1 <= n <= sz`

## 思路分析

### 突破口

快慢双指针：让快指针先走 `n+1` 步，然后快慢指针同步移动，快指针到达末尾时，慢指针恰好指向待删节点的**前驱节点**，执行删除。

### 思路拆解

1. **两次遍历**：第一次计算链表长度 `L`，第二次找到第 `L-n` 个节点的前驱。简单但不满足进阶一次遍历要求。

2. **快慢双指针（一次遍历）**：
   - 使用哑节点（dummy）统一边界处理。
   - 快指针先走 `n+1` 步（从 dummy 开始）。
   - 快慢同时移动，直到快指针到达 null。
   - 此时 `slow.Next` 就是待删节点，执行 `slow.Next = slow.Next.Next`。

3. **为什么是 `n+1` 步**：需要让慢指针停在待删节点的**前驱**（而非本身），所以快指针多走一步。

### 示意图

```text
链表: dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> nil，n=2

快指针先走 n+1=3 步：
  dummy(fast) → 1 → 2 → 3
  fast 在 3，slow 在 dummy

快慢同步移动直到 fast 为 nil：
  fast:4, slow:1
  fast:5, slow:2
  fast:nil, slow:3  ← slow 在待删节点(4)的前驱

删除: slow.Next = slow.Next.Next → 3 -> 5

结果: 1 -> 2 -> 3 -> 5
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 两次遍历 | O(L) | O(1) |
| 快慢双指针（一次遍历） | O(L) | O(1) |

## 代码实现

### Go

```go
// removeNthFromEnd 删除链表倒数第 n 个节点，返回新头节点
// 参数：head 链表头节点，n 倒数位置（保证合法）
// 返回：删除后的链表头节点
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    dummy := &ListNode{Next: head} // 哑节点，统一处理删除头节点的情况
    fast, slow := dummy, dummy

    // 快指针先走 n+1 步，使快慢之间保持 n+1 个间距
    for i := 0; i <= n; i++ {
        fast = fast.Next
    }

    // 快慢同步移动，直到 fast 到达 nil
    for fast != nil {
        fast = fast.Next
        slow = slow.Next
    }

    // slow 现在指向待删节点的前驱，执行删除
    slow.Next = slow.Next.Next

    return dummy.Next
}
```

### Java

```java
class Solution {
    /**
     * 删除链表倒数第 n 个节点，返回新头节点。
     *
     * @param head 链表头节点
     * @param n    倒数位置（保证合法）
     * @return 删除后的链表头节点
     */
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head); // 哑节点
        ListNode fast = dummy, slow = dummy;

        // 快指针先走 n+1 步
        for (int i = 0; i <= n; i++) fast = fast.next;

        // 快慢同步移动
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }

        slow.next = slow.next.next; // 删除目标节点
        return dummy.next;
    }
}
```

### Python

```python
class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        """
        删除链表倒数第 n 个节点，返回新头节点。

        参数:
            head: 链表头节点
            n:    倒数位置（保证合法）
        返回:
            删除后的链表头节点
        """
        dummy = ListNode(0)
        dummy.next = head
        fast = slow = dummy

        # 快指针先走 n+1 步
        for _ in range(n + 1):
            fast = fast.next

        # 快慢同步移动
        while fast:
            fast = fast.next
            slow = slow.next

        slow.next = slow.next.next  # 删除目标节点
        return dummy.next
```

## 踩坑记录

- **哑节点处理删头情况**：若不用哑节点，删除头节点（`n == sz`）需要特判 `return head.Next`。哑节点统一了所有情况。
- **走 `n+1` 步还是 `n` 步**：走 `n` 步时慢指针停在待删节点本身，无法删除（需要前驱）；走 `n+1` 步才让慢指针停在前驱。
- **`fast` 到达 `nil` 而非最后一个节点**：循环条件是 `fast != nil`（`fast` 走到 null 之后停止），不是 `fast.Next != nil`，否则慢指针会少走一步。

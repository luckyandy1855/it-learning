# 0082. Remove Duplicates from Sorted List II

---
编号: 82
题目: Remove Duplicates from Sorted List II
难度: 中等
标签: [链表, 双指针]
来源链接: https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/
---

## 题目描述

给定有序链表的头节点 `head`，删除所有**有重复数字**的节点，只留下原始链表中**没有重复出现**过的数字。

### Example 1

```text
Input: head = [1,2,3,3,4,4,5]
Output: [1,2,5]
```

### Example 2

```text
Input: head = [1,1,1,2,3]
Output: [2,3]
```

### 约束条件

- 链表节点数在 `[0, 300]` 范围内
- `-100 <= Node.val <= 100`
- 链表已按升序排列

## 思路分析

### 突破口

哑节点 + 双指针：`prev` 指向确认保留的最后一个节点，`cur` 向前探测，若发现重复区域则 `prev.next` 直接跳过整个重复段。

### 思路拆解

1. **哑节点**：避免头节点被删除时的特判。

2. **`cur` 探测重复段**：若 `cur.next != nil && cur.val == cur.next.val`，向前移动 `cur` 直到跳出重复段；然后 `prev.next = cur.next`（跳过整段）。

3. **无重复时正常推进**：`prev = prev.next`。

### 示意图

```text
链表: dummy→1→2→3→3→4→4→5
prev=dummy, cur=1:
  cur=1: cur.next=2, 1≠2 → prev=1, cur=2
  cur=2: cur.next=3, 2≠3 → prev=2, cur=3
  cur=3: cur.next=3, 3=3 → 移动cur到3(2nd)→3(2nd).next=4, prev.next=4
  cur=4: cur.next=4, 4=4 → 移动cur到4(2nd)→4.next=5, prev.next=5
  cur=5: cur.next=nil → prev=5

结果: 1→2→5
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 双指针 | O(n) | O(1) |

## 代码实现

### Go

```go
// deleteDuplicates 删除链表中所有有重复的节点，只保留无重复节点
func deleteDuplicates(head *ListNode) *ListNode {
    dummy := &ListNode{Next: head}
    prev := dummy
    cur := head

    for cur != nil {
        // 跳过重复段
        if cur.Next != nil && cur.Val == cur.Next.Val {
            for cur.Next != nil && cur.Val == cur.Next.Val {
                cur = cur.Next
            }
            prev.Next = cur.Next // 跳过整个重复段
        } else {
            prev = prev.Next // 无重复，正常推进 prev
        }
        cur = cur.Next
    }
    return dummy.Next
}
```

### Java

```java
class Solution {
    /**
     * 删除链表中所有有重复的节点，只保留无重复节点。
     */
    public ListNode deleteDuplicates(ListNode head) {
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy, cur = head;

        while (cur != null) {
            if (cur.next != null && cur.val == cur.next.val) {
                while (cur.next != null && cur.val == cur.next.val)
                    cur = cur.next;
                prev.next = cur.next; // 跳过重复段
            } else {
                prev = prev.next;
            }
            cur = cur.next;
        }
        return dummy.next;
    }
}
```

### Python

```python
from typing import Optional

class Solution:
    def deleteDuplicates(self, head: Optional['ListNode']) -> Optional['ListNode']:
        """
        删除链表中所有有重复的节点，只保留无重复节点。
        """
        dummy = ListNode(0, head)
        prev, cur = dummy, head

        while cur:
            if cur.next and cur.val == cur.next.val:
                while cur.next and cur.val == cur.next.val:
                    cur = cur.next
                prev.next = cur.next  # 跳过整个重复段
            else:
                prev = prev.next
            cur = cur.next

        return dummy.next
```

## 踩坑记录

- **`prev` 不随重复段移动**：遇到重复段时 `prev` 保持不动，只有 `cur` 前进到重复段末尾，然后 `prev.next` 直接指向重复段之后；`prev` 仅在无重复时才 `prev = prev.next`。
- **与 0083 的区别**：0083 保留重复值中的第一个（只删多余），本题完全删除出现过重复的所有节点。
- **哑节点必须用**：若头节点本身是重复节点（如 `[1,1,2]`），没有哑节点时更新头的逻辑需要特判；哑节点统一处理。

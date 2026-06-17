# 0086. Partition List

---
编号: 86
题目: Partition List
难度: 中等
标签: [链表, 双指针]
来源链接: https://leetcode.com/problems/partition-list/
---

## 题目描述

给定链表的头节点 `head` 和一个特定值 `x`，将链表分隔，使得所有**小于 x** 的节点都出现在**大于或等于 x** 的节点之前。需要保留两个分区中节点的原始相对顺序。

### Example 1

```text
Input: head = [1,4,3,2,5,2], x = 3
Output: [1,2,2,4,3,5]
```

### Example 2

```text
Input: head = [2,1], x = 2
Output: [1,2]
```

### 约束条件

- 链表节点数在 `[0, 200]` 范围内
- `-100 <= Node.val <= 100`
- `-200 <= x <= 200`

## 思路分析

### 突破口

维护两条链：`less`（收集 < x 的节点）和 `greater`（收集 >= x 的节点），最后将 `less` 尾部接上 `greater` 头部。

### 思路拆解

1. **两个哑节点**：`lessHead` 和 `greaterHead` 分别作为两条链的起始哑节点。

2. **遍历原链**：按 `val < x` 分配到 `less` 或 `greater` 链。

3. **拼接**：`less.next = greaterHead.next`，`greater.next = nil`（防止成环）。

### 示意图

```text
[1,4,3,2,5,2], x=3
less:    dummy→1→2→2
greater: dummy→4→3→5

拼接: 1→2→2→4→3→5
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 双链拼接 | O(n) | O(1) |

## 代码实现

### Go

```go
// partition 将链表按 x 分区：< x 的在前，>= x 的在后
func partition(head *ListNode, x int) *ListNode {
    lessHead := &ListNode{}
    greaterHead := &ListNode{}
    less, greater := lessHead, greaterHead

    for cur := head; cur != nil; cur = cur.Next {
        if cur.Val < x {
            less.Next = cur
            less = less.Next
        } else {
            greater.Next = cur
            greater = greater.Next
        }
    }

    greater.Next = nil             // 防止成环
    less.Next = greaterHead.Next   // 拼接两条链
    return lessHead.Next
}
```

### Java

```java
class Solution {
    /**
     * 将链表按 x 分区：< x 的在前，>= x 的在后。
     */
    public ListNode partition(ListNode head, int x) {
        ListNode lessHead = new ListNode(0), greaterHead = new ListNode(0);
        ListNode less = lessHead, greater = greaterHead;

        for (ListNode cur = head; cur != null; cur = cur.next) {
            if (cur.val < x) { less.next = cur; less = less.next; }
            else             { greater.next = cur; greater = greater.next; }
        }

        greater.next = null;
        less.next = greaterHead.next;
        return lessHead.next;
    }
}
```

### Python

```python
from typing import Optional

class Solution:
    def partition(self, head: Optional['ListNode'], x: int) -> Optional['ListNode']:
        """
        将链表按 x 分区：< x 的在前，>= x 的在后。
        """
        less_head = ListNode(0)
        greater_head = ListNode(0)
        less, greater = less_head, greater_head

        cur = head
        while cur:
            if cur.val < x:
                less.next = cur
                less = less.next
            else:
                greater.next = cur
                greater = greater.next
            cur = cur.next

        greater.next = None          # 断开尾部，防止成环
        less.next = greater_head.next  # 拼接
        return less_head.next
```

## 踩坑记录

- **`greater.next = nil` 必须写**：链表节点的 `next` 指针还指向原始链表中的某个节点，若不置 nil 会形成环或尾部接上额外节点。
- **保留相对顺序**：直接按顺序拼接到两条链尾部，顺序自然保留，不需要排序。
- **两个哑节点简化代码**：避免处理各分区首节点为空的边界情况。

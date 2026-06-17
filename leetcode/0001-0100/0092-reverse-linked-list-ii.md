# 0092. Reverse Linked List II

---
编号: 92
题目: Reverse Linked List II
难度: 中等
标签: [链表]
来源链接: https://leetcode.com/problems/reverse-linked-list-ii/
---

## 题目描述

给定单链表的头指针 `head` 和两个整数 `left` 和 `right`（`left <= right`），反转从位置 `left` 到位置 `right` 的链表节点，返回反转后的链表。位置从 1 开始编号。

### Example 1

```text
Input: head = [1,2,3,4,5], left=2, right=4
Output: [1,4,3,2,5]
```

### Example 2

```text
Input: head = [5], left=1, right=1
Output: [5]
```

### 约束条件

- 链表节点数为 `n`，`1 <= n <= 500`
- `-500 <= Node.val <= 500`
- `1 <= left <= right <= n`

## 思路分析

### 突破口

哑节点 + 找到左边界前一节点 `prev`，然后用"头插法"将 `[left, right]` 区间的节点逐一插到 `prev` 之后。

### 思路拆解

1. **找左边界前驱 `prev`**：从哑节点走 `left-1` 步。

2. **头插法反转**：设 `cur = prev.next`（left 位置节点），每次将 `cur.next` 摘出来插到 `prev.next` 位置（头部），重复 `right - left` 次。

3. **操作步骤**（每轮）：
   - `next = cur.next`
   - `cur.next = next.next`
   - `next.next = prev.next`
   - `prev.next = next`

### 示意图

```text
原始: dummy→1→2→3→4→5, left=2, right=4
prev=节点1, cur=节点2

第1次: 摘出3, 插到1后 → dummy→1→3→2→4→5
  cur仍指向2（不动）
第2次: 摘出4, 插到1后 → dummy→1→4→3→2→5

结果: 1→4→3→2→5
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 头插法 | O(n) | O(1) |

## 代码实现

### Go

```go
// reverseBetween 反转链表中位置 left 到 right 的节点
func reverseBetween(head *ListNode, left int, right int) *ListNode {
    dummy := &ListNode{Next: head}
    prev := dummy

    // 走到 left 前一个节点
    for i := 0; i < left-1; i++ {
        prev = prev.Next
    }

    cur := prev.Next
    for i := 0; i < right-left; i++ {
        next := cur.Next
        cur.Next = next.Next   // cur 跳过 next
        next.Next = prev.Next  // next 指向当前头部
        prev.Next = next       // prev 指向新头部
    }
    return dummy.Next
}
```

### Java

```java
class Solution {
    /**
     * 反转链表中位置 left 到 right 的节点（头插法）。
     */
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;

        for (int i = 0; i < left - 1; i++) prev = prev.next;

        ListNode cur = prev.next;
        for (int i = 0; i < right - left; i++) {
            ListNode next = cur.next;
            cur.next = next.next;
            next.next = prev.next;
            prev.next = next;
        }
        return dummy.next;
    }
}
```

### Python

```python
from typing import Optional

class Solution:
    def reverseBetween(self, head: Optional['ListNode'], left: int, right: int) -> Optional['ListNode']:
        """
        反转链表中位置 left 到 right 的节点（头插法，一次遍历）。
        """
        dummy = ListNode(0, head)
        prev = dummy

        for _ in range(left - 1):
            prev = prev.next

        cur = prev.next
        for _ in range(right - left):
            nxt = cur.next
            cur.next = nxt.next  # cur 跳过 nxt
            nxt.next = prev.next  # nxt 接上已反转部分
            prev.next = nxt      # prev 指向新的头

        return dummy.next
```

## 踩坑记录

- **`cur` 不需要移动**：每次将 `cur.next` 插到 `prev.next`，`cur` 始终是反转区域末尾（被插到最后），不需要 `cur = cur.next`。
- **循环 `right - left` 次而非 `right - left + 1` 次**：`cur` 在 `left` 位置无需操作，只需对 `left+1` 到 `right` 共 `right - left` 个节点执行头插。
- **`left == right` 时循环 0 次**：不做任何操作，直接返回原链表。

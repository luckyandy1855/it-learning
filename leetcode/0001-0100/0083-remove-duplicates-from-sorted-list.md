# 0083. Remove Duplicates from Sorted List

---
编号: 83
题目: Remove Duplicates from Sorted List
难度: 简单
标签: [链表]
来源链接: https://leetcode.com/problems/remove-duplicates-from-sorted-list/
---

## 题目描述

给定有序链表的头节点 `head`，删除所有**重复**的节点，使每个元素只出现一次，返回链表头节点。

### Example 1

```text
Input: head = [1,1,2]
Output: [1,2]
```

### Example 2

```text
Input: head = [1,1,2,3,3]
Output: [1,2,3]
```

### 约束条件

- 链表节点数在 `[0, 300]` 范围内
- `-100 <= Node.val <= 100`
- 链表已按升序排列

## 思路分析

### 突破口

单指针扫描：若当前节点与下一节点的值相同，则跳过下一节点（`cur.next = cur.next.next`）；否则前进。

### 思路拆解

1. **从头扫描 `cur`**：每步检查 `cur.next` 是否与 `cur` 重复。

2. **重复则跳过**：`cur.next = cur.next.next`（不移动 `cur`，需要再次检查）。

3. **不重复则前进**：`cur = cur.next`。

### 示意图

```text
链表: 1→1→2→3→3
cur=1: cur.next=1, 相同 → cur.next=2, cur仍在1
cur=1: cur.next=2, 不同 → cur=2
cur=2: cur.next=3, 不同 → cur=3
cur=3: cur.next=3, 相同 → cur.next=nil
cur=3: cur.next=nil → cur=nil, 结束

结果: 1→2→3
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 单指针扫描 | O(n) | O(1) |

## 代码实现

### Go

```go
// deleteDuplicates 删除有序链表中的重复节点，每个值只保留一个
func deleteDuplicates(head *ListNode) *ListNode {
    cur := head
    for cur != nil && cur.Next != nil {
        if cur.Val == cur.Next.Val {
            cur.Next = cur.Next.Next // 跳过重复节点
        } else {
            cur = cur.Next
        }
    }
    return head
}
```

### Java

```java
class Solution {
    /**
     * 删除有序链表中的重复节点，每个值只保留一个。
     */
    public ListNode deleteDuplicates(ListNode head) {
        ListNode cur = head;
        while (cur != null && cur.next != null) {
            if (cur.val == cur.next.val) {
                cur.next = cur.next.next;
            } else {
                cur = cur.next;
            }
        }
        return head;
    }
}
```

### Python

```python
from typing import Optional

class Solution:
    def deleteDuplicates(self, head: Optional['ListNode']) -> Optional['ListNode']:
        """
        删除有序链表中的重复节点，每个值只保留一个。
        """
        cur = head
        while cur and cur.next:
            if cur.val == cur.next.val:
                cur.next = cur.next.next  # 跳过重复
            else:
                cur = cur.next
        return head
```

## 踩坑记录

- **跳过重复时不移动 `cur`**：`cur.next = cur.next.next` 后需要再次检查 `cur` 与新 `cur.next` 是否仍重复（如 `1→1→1` 需要连续跳过），若跳过后直接 `cur = cur.next` 会漏掉连续重复。
- **空链表处理**：`head = nil` 时循环条件 `cur != nil` 直接不进入，返回 `head = nil`，自然处理。
- **与 0082 的区别**：本题保留重复值中的第一个，0082 要求完全删除所有出现过重复的节点。

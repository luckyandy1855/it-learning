# 0061. Rotate List

---
编号: 61
题目: Rotate List
难度: 中等
标签: [链表, 双指针]
来源链接: https://leetcode.com/problems/rotate-list/
---

## 题目描述

给定链表的头节点 `head` 和整数 `k`，将链表**向右旋转 k 位**并返回新的头节点。

向右旋转 k 位：将链表末尾 k 个节点移到链表头部。

### Example 1

```text
Input: head = [1,2,3,4,5], k = 2
Output: [4,5,1,2,3]
```

### Example 2

```text
Input: head = [0,1,2], k = 4
Output: [2,0,1]
```

### 约束条件

- 链表节点数在 `[0, 500]` 范围内
- `-100 <= Node.val <= 100`
- `0 <= k <= 2 * 10^9`

## 思路分析

### 突破口

先计算链表长度，得到有效旋转步数 `k = k % n`；然后找到新尾节点（位置 `n - k - 1`），将链表成环再断开。

### 思路拆解

1. **计算长度并成环**：遍历链表得到长度 `n`，同时让尾节点指向头节点形成环形链表。

2. **有效步数**：`k = k % n`（k 可能非常大，旋转 n 步等于原链表）。

3. **找新尾**：从头走 `n - k - 1` 步，到达新尾节点；新尾的 `next` 就是新头。

4. **断开环**：将新尾的 `next` 置 nil，返回新头。

### 示意图

```text
链表: 1 → 2 → 3 → 4 → 5, k=2, n=5
有效旋转: k%5=2
新尾位置: 5-2-1=2, 即节点3

成环: 1→2→3→4→5→(1)
从头走2步到达节点3, 新头=4, 断开3→4

结果: 4 → 5 → 1 → 2 → 3
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 成环断开 | O(n) | O(1) |

## 代码实现

### Go

```go
// rotateRight 将链表向右旋转 k 位
func rotateRight(head *ListNode, k int) *ListNode {
    if head == nil || head.Next == nil || k == 0 {
        return head
    }

    // 计算长度，找到尾节点
    n := 1
    tail := head
    for tail.Next != nil {
        tail = tail.Next
        n++
    }

    k = k % n
    if k == 0 {
        return head
    }

    // 找新尾（第 n-k-1 个节点，0 索引）
    newTail := head
    for i := 0; i < n-k-1; i++ {
        newTail = newTail.Next
    }

    newHead := newTail.Next
    newTail.Next = nil
    tail.Next = head // 成环后接上原头

    return newHead
}
```

### Java

```java
class Solution {
    /**
     * 将链表向右旋转 k 位。
     */
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null || k == 0) return head;

        int n = 1;
        ListNode tail = head;
        while (tail.next != null) { tail = tail.next; n++; }

        k %= n;
        if (k == 0) return head;

        // 找新尾：走 n-k-1 步
        ListNode newTail = head;
        for (int i = 0; i < n - k - 1; i++) newTail = newTail.next;

        ListNode newHead = newTail.next;
        newTail.next = null;
        tail.next = head;
        return newHead;
    }
}
```

### Python

```python
from typing import Optional

class Solution:
    def rotateRight(self, head: Optional['ListNode'], k: int) -> Optional['ListNode']:
        """
        将链表向右旋转 k 位。
        """
        if not head or not head.next or k == 0:
            return head

        # 计算长度，找尾节点
        n, tail = 1, head
        while tail.next:
            tail = tail.next
            n += 1

        k %= n
        if k == 0:
            return head

        # 找新尾（走 n-k-1 步）
        new_tail = head
        for _ in range(n - k - 1):
            new_tail = new_tail.next

        new_head = new_tail.next
        new_tail.next = None
        tail.next = head
        return new_head
```

## 踩坑记录

- **k 取模不可省**：k 可能远大于链表长度（如 `k=2*10^9, n=5`），不取模会超时或越界。
- **取模后 k=0 需要提前返回**：如 `k=5, n=5`，旋转后链表不变，但如果不判断 0 会走到 `newTail.next = nil` 把链表截断。
- **新尾是第 `n-k-1` 个节点（0 索引）**：若 k=2, n=5，新尾在 index=2（节点3），走 `n-k-1=2` 步到达，对应 `for i:=0; i < 2; i++`。

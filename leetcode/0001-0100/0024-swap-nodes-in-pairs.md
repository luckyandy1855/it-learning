# 0024. Swap Nodes in Pairs

---
编号: 24
题目: Swap Nodes in Pairs
难度: 中等
标签: [递归, 链表]
来源链接: https://leetcode.com/problems/swap-nodes-in-pairs/
---

## 题目描述

给定链表，将链表中的节点**两两交换**，返回交换后的链表头节点。

要求直接交换节点（修改指针），不能仅仅交换节点的值。

### Example 1

```text
Input: head = [1,2,3,4]
Output: [2,1,4,3]
Explanation: (1,2) 互换，(3,4) 互换。
```

### Example 2

```text
Input: head = []
Output: []
```

### Example 3

```text
Input: head = [1]
Output: [1]
Explanation: 只有一个节点，无法配对，保持不变。
```

### 约束条件

- 链表节点数在 `[0, 100]` 范围内。
- `0 <= Node.val <= 100`

## 思路分析

### 突破口

用哑节点作为前驱，每次处理当前的两个节点：将 `prev -> first -> second -> rest` 重排为 `prev -> second -> first -> rest`，然后将 `prev` 移到 `first`（此时 `first` 已在 `second` 之后）。

### 思路拆解

1. **递归**：`swapPairs(head)` = 交换 head 和 head.Next，然后 head.Next.Next 指向 `swapPairs(head.Next.Next)`。代码极简，但递归栈 O(n)。

2. **迭代（哑节点）**：`dummy -> first -> second -> ...`，每次操作四个节点（prev、first、second、second.Next），重排指针，`prev` 推进两步，循环直到不足两个节点。

### 示意图

```text
before: prev -> first -> second -> rest
after:  prev -> second -> first -> rest

操作步骤（指针赋值顺序）：
1. prev.Next = second
2. first.Next = second.Next（接上 rest）
3. second.Next = first

然后 prev = first（first 已在 second 之后）
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 递归 | O(n) | O(n) 递归栈 |
| 迭代 | O(n) | O(1) |

## 代码实现

### Go

```go
// swapPairs 将链表每两个相邻节点两两交换，返回新头节点
// 参数：head 链表头节点
// 返回：交换后的链表头节点
func swapPairs(head *ListNode) *ListNode {
    dummy := &ListNode{Next: head}
    prev := dummy

    // 至少还有两个节点才能交换
    for prev.Next != nil && prev.Next.Next != nil {
        first := prev.Next
        second := prev.Next.Next

        // 重排指针：prev -> second -> first -> rest
        prev.Next = second
        first.Next = second.Next
        second.Next = first

        // prev 推进到 first（交换后 first 是这对节点的第二个）
        prev = first
    }

    return dummy.Next
}
```

### Java

```java
class Solution {
    /**
     * 将链表每两个相邻节点两两交换，返回新头节点。
     *
     * @param head 链表头节点
     * @return 交换后的链表头节点
     */
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;

        while (prev.next != null && prev.next.next != null) {
            ListNode first = prev.next;
            ListNode second = prev.next.next;

            prev.next = second;
            first.next = second.next;
            second.next = first;

            prev = first; // first 现在是这对的第二个节点
        }

        return dummy.next;
    }
}
```

### Python

```python
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        """
        将链表每两个相邻节点两两交换，返回新头节点。

        参数:
            head: 链表头节点
        返回:
            交换后的链表头节点
        """
        dummy = ListNode(0)
        dummy.next = head
        prev = dummy

        while prev.next and prev.next.next:
            first = prev.next
            second = prev.next.next

            # 重排：prev -> second -> first -> rest
            prev.next = second
            first.next = second.next
            second.next = first

            prev = first  # 推进 prev

        return dummy.next
```

## 踩坑记录

- **指针赋值顺序很重要**：必须先保存 `first` 和 `second` 的引用，再修改指针，否则会丢失节点。尤其是 `first.Next = second.Next`（接 rest）要在 `second.Next = first` 之前执行，否则 `second.Next` 已经被改成 `first` 了。
- **哑节点统一了头节点**：若链表只有一个节点，循环不执行，`dummy.Next` 仍是原头节点，正确返回。
- **奇数长度链表**：最后剩一个节点时 `prev.Next.Next == nil`，循环条件不满足，自然停止，最后那个节点保持原位。

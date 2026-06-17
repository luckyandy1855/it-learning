# 0021. Merge Two Sorted Lists

---
编号: 21
题目: Merge Two Sorted Lists
难度: 简单
标签: [递归, 链表]
来源链接: https://leetcode.com/problems/merge-two-sorted-lists/
---

## 题目描述

给定两个已按升序排列的链表的头节点 `list1` 和 `list2`，将两个链表合并成一个升序链表，返回合并后链表的头节点。

合并后的链表应由两个链表的节点拼接而成（不创建新节点）。

### Example 1

```text
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

### Example 2

```text
Input: list1 = [], list2 = []
Output: []
```

### Example 3

```text
Input: list1 = [], list2 = [0]
Output: [0]
```

### 约束条件

- 两个链表的节点数均在 `[0, 50]` 范围内。
- `-100 <= Node.val <= 100`
- 两个链表均按**非递减**顺序排列。

## 思路分析

### 突破口

类似归并排序的合并步骤：每次比较两个链表的当前头节点，选较小值接入结果链表，然后移动对应链表的指针。

### 思路拆解

1. **迭代（哑节点）**：用哑节点作为结果链表头，用 `cur` 指针追加节点。两个链表均非空时循环比较并追加，最后将剩余的非空链表直接接上。

2. **递归**：`merge(l1, l2)` = 选小的节点，其 `Next` 指向 `merge(剩余部分, 另一个链表)`。代码简洁但有递归栈开销。

3. **实现要点**：当某个链表为空时（遍历完），直接接上另一个链表的剩余部分，不需要逐节点处理。

### 示意图

```text
list1: 1 -> 2 -> 4
list2: 1 -> 3 -> 4

dummy -> ?
  比较 1 vs 1: 选 list1[1], cur->1, list1前进
  比较 2 vs 1: 选 list2[1], cur->1, list2前进
  比较 2 vs 3: 选 list1[2], cur->2, list1前进
  比较 4 vs 3: 选 list2[3], cur->3, list2前进
  比较 4 vs 4: 选 list1[4], cur->4, list1前进
  list1 空, 接上 list2 剩余: cur->4

结果: 1->1->2->3->4->4
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 迭代 | O(m+n) | O(1) |
| 递归 | O(m+n) | O(m+n) 递归栈 |

## 代码实现

### Go

```go
// mergeTwoLists 合并两个有序链表，返回合并后的头节点
// 参数：list1, list2 两个升序链表头节点
// 返回：合并后升序链表的头节点
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    dummy := &ListNode{} // 哑节点，简化头节点处理
    cur := dummy

    // 两个链表都非空时，每次取较小值
    for list1 != nil && list2 != nil {
        if list1.Val <= list2.Val {
            cur.Next = list1
            list1 = list1.Next
        } else {
            cur.Next = list2
            list2 = list2.Next
        }
        cur = cur.Next
    }

    // 将剩余的非空链表直接接上
    if list1 != nil {
        cur.Next = list1
    } else {
        cur.Next = list2
    }

    return dummy.Next
}
```

### Java

```java
class Solution {
    /**
     * 合并两个有序链表，返回合并后的头节点。
     *
     * @param list1 升序链表头节点
     * @param list2 升序链表头节点
     * @return 合并后升序链表的头节点
     */
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;

        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                cur.next = list1;
                list1 = list1.next;
            } else {
                cur.next = list2;
                list2 = list2.next;
            }
            cur = cur.next;
        }

        // 接上剩余部分
        cur.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}
```

### Python

```python
class Solution:
    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:
        """
        合并两个有序链表，返回合并后的头节点。

        参数:
            list1, list2: 两个升序链表头节点
        返回:
            合并后升序链表的头节点
        """
        dummy = ListNode(0)
        cur = dummy

        while list1 and list2:
            if list1.val <= list2.val:
                cur.next = list1
                list1 = list1.next
            else:
                cur.next = list2
                list2 = list2.next
            cur = cur.next

        # 接上剩余部分（最多一个非空）
        cur.next = list1 if list1 else list2
        return dummy.next
```

## 踩坑记录

- **不创建新节点**：直接修改原节点的 `Next` 指针，不要 `new ListNode(val)` 创建新节点，题目要求用原节点拼接。
- **循环结束后还有剩余**：当某个链表比另一个长，主循环结束后还有剩余节点，直接 `cur.next = 剩余链表` 接上，不用再遍历。
- **两个链表都为空**：`dummy.Next` 此时仍是 `nil`，正确返回空链表，无需特判。

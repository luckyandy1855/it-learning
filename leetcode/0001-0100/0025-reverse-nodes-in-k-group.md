# 0025. Reverse Nodes in k-Group

---
编号: 25
题目: Reverse Nodes in k-Group
难度: 困难
标签: [递归, 链表]
来源链接: https://leetcode.com/problems/reverse-nodes-in-k-group/
---

## 题目描述

给定链表的头节点，每次将链表中连续的 `k` 个节点反转，返回修改后的链表头节点。

如果链表末尾剩余节点不足 `k` 个，则保持这些节点的原有顺序。

要求直接修改节点指针，不能只交换节点值。

### Example 1

```text
Input: head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]
```

### Example 2

```text
Input: head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]
Explanation: 前 3 个节点反转为 3,2,1；最后 2 个不足 k 个，保持 4,5 不变。
```

### 约束条件

- 链表节点数为 `n`。
- `1 <= k <= n <= 5000`
- `0 <= Node.val <= 1000`

## 思路分析

### 突破口

分组处理：每次先检查从当前位置起是否还有 k 个节点，有则反转这 k 个节点，无则直接结束。用哑节点记录每组前驱，反转后将前驱接到新头，将原头（现尾）接到下一组。

### 思路拆解

1. **检查 k 个节点**：从当前位置往后数 k 步，若中途遇到 nil 则不足 k 个，保持不变直接返回。

2. **反转 k 个节点**：标准链表反转，反转 `[start, end]` 这 k 个节点，返回新头（原尾）和新尾（原头）。

3. **连接前后**：`prev.Next = newHead`，`newTail.Next = nextGroup`，然后 `prev = newTail`，继续下一组。

4. **实现要点**：需要记录 `kTail`（第 k 个节点）和 `kTail.Next`（下一组起始），反转后正确连接。

### 示意图

```text
head = [1,2,3,4,5], k=2

第一组: prev=dummy, start=1, end=2
  反转 [1,2] → [2,1]
  prev.Next=2, 1.Next=3
  prev=1

第二组: prev=1, start=3, end=4
  反转 [3,4] → [4,3]
  1.Next=4, 3.Next=5
  prev=3

第三组: prev=3, start=5, 从5数2个不足 → 保持 5
  3.Next 不变（已经是 5）

结果: dummy->2->1->4->3->5
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 迭代分组反转 | O(n) | O(1) |

## 代码实现

### Go

```go
// reverseKGroup 将链表每 k 个节点一组反转
// 参数：head 链表头节点，k 每组节点数
// 返回：处理后的链表头节点
func reverseKGroup(head *ListNode, k int) *ListNode {
    dummy := &ListNode{Next: head}
    prev := dummy

    for {
        // 检查从 prev.Next 起是否还有 k 个节点
        kTail := getKTh(prev, k)
        if kTail == nil {
            break // 不足 k 个，结束
        }

        start := prev.Next
        nextGroup := kTail.Next

        // 反转 [start, kTail] 这 k 个节点
        reverseList(start, kTail)

        // 连接前后：kTail 是新头，start 是新尾
        prev.Next = kTail
        start.Next = nextGroup

        prev = start // start 现在是这组的最后一个节点
    }

    return dummy.Next
}

// getKTh 从 node 往后数第 k 个节点，不足则返回 nil
func getKTh(node *ListNode, k int) *ListNode {
    for k > 0 && node != nil {
        node = node.Next
        k--
    }
    return node
}

// reverseList 反转 [start, end] 这段链表（就地反转，end.Next 不变）
func reverseList(start, end *ListNode) {
    prev, cur := end.Next, start
    for cur != end.Next {
        next := cur.Next
        cur.Next = prev
        prev = cur
        cur = next
    }
}
```

### Java

```java
class Solution {
    /**
     * 将链表每 k 个节点一组反转。
     *
     * @param head 链表头节点
     * @param k    每组节点数
     * @return 处理后的链表头节点
     */
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;

        while (true) {
            ListNode kTail = getKTh(prev, k);
            if (kTail == null) break;

            ListNode start = prev.next;
            ListNode nextGroup = kTail.next;

            reverse(start, kTail);

            prev.next = kTail;
            start.next = nextGroup;
            prev = start;
        }

        return dummy.next;
    }

    private ListNode getKTh(ListNode node, int k) {
        while (k-- > 0 && node != null) node = node.next;
        return node;
    }

    private void reverse(ListNode start, ListNode end) {
        ListNode prev = end.next, cur = start;
        while (cur != end.next) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
    }
}
```

### Python

```python
class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        """
        将链表每 k 个节点一组反转。

        参数:
            head: 链表头节点
            k:    每组节点数
        返回:
            处理后的链表头节点
        """
        def get_kth(node, k):
            while k > 0 and node:
                node = node.next
                k -= 1
            return node

        def reverse(start, end):
            prev, cur = end.next, start
            while cur != end.next:
                nxt = cur.next
                cur.next = prev
                prev = cur
                cur = nxt

        dummy = ListNode(0)
        dummy.next = head
        prev = dummy

        while True:
            k_tail = get_kth(prev, k)
            if not k_tail:
                break
            start = prev.next
            next_group = k_tail.next
            reverse(start, k_tail)
            prev.next = k_tail
            start.next = next_group
            prev = start

        return dummy.next
```

## 踩坑记录

- **反转段的边界**：反转 `[start, kTail]` 时，`kTail.Next` 已记录在 `nextGroup` 中，反转函数内部用 `end.Next` 作为终止条件（反转停在 `end.Next` 这个边界），保证不影响后续节点。
- **先保存 `nextGroup`**：反转后 `start.Next` 会被修改，必须提前保存 `kTail.Next` 到 `nextGroup`，否则丢失下一组的入口。
- **不足 k 个直接结束**：`getKTh` 返回 nil 时，不要动剩余节点，直接 break 并返回结果。

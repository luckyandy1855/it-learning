# 0023. Merge k Sorted Lists

---
编号: 23
题目: Merge k Sorted Lists
难度: 困难
标签: [链表, 分治, 堆（优先队列）, 归并排序]
来源链接: https://leetcode.com/problems/merge-k-sorted-lists/
---

## 题目描述

给定一个链表数组，每个链表均已按升序排列。将所有链表合并成一个升序链表，返回合并后的链表头节点。

### Example 1

```text
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: 三个链表合并后为 1->1->2->3->4->4->5->6。
```

### Example 2

```text
Input: lists = []
Output: []
```

### Example 3

```text
Input: lists = [[]]
Output: []
```

### 约束条件

- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- 所有链表均已按升序排列。

## 思路分析

### 突破口

优先队列（最小堆）：始终维护 k 个链表的当前最小头节点，每次取最小值接入结果，O(N log k) 时间（N 为总节点数）。

### 思路拆解

1. **朴素暴力**：每次从 k 个链表头找最小值，O(kN)，k 大时慢。

2. **两两合并（分治）**：像归并排序一样，每轮将链表两两合并，共 log k 轮，每轮合并 O(N)，总 O(N log k)。代码简洁。

3. **优先队列（最小堆）**：将所有链表的头节点入堆，每次取堆顶（最小）节点接入结果，并将该节点的 `Next` 入堆（若非空），总 O(N log k)。

4. **实现要点**：Go 标准库没有内置堆，需要实现 `heap.Interface`；Java 用 `PriorityQueue`；Python 用 `heapq`，但 ListNode 不可直接比较，需要加计数器打破平局。

### 示意图

```text
lists = [[1,4,5], [1,3,4], [2,6]]

堆初始: {1(l1), 1(l2), 2(l3)}
取最小 1(l1) → 结果: 1; 入堆 4(l1)
堆: {1(l2), 2(l3), 4(l1)}
取最小 1(l2) → 结果: 1->1; 入堆 3(l2)
堆: {2(l3), 3(l2), 4(l1)}
取最小 2(l3) → 结果: 1->1->2; 入堆 6(l3)
...依此类推
最终: 1->1->2->3->4->4->5->6
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 朴素逐个合并 | O(kN) | O(1) |
| 分治两两合并 | O(N log k) | O(log k) |
| 优先队列 | O(N log k) | O(k) |

## 代码实现

### Go

```go
import "container/heap"

// ListNodeHeap 实现 heap.Interface，用于 ListNode 的最小堆
type ListNodeHeap []*ListNode

func (h ListNodeHeap) Len() int            { return len(h) }
func (h ListNodeHeap) Less(i, j int) bool  { return h[i].Val < h[j].Val }
func (h ListNodeHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *ListNodeHeap) Push(x interface{}) { *h = append(*h, x.(*ListNode)) }
func (h *ListNodeHeap) Pop() interface{} {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}

// mergeKLists 用最小堆合并 k 个有序链表
// 参数：lists 链表数组
// 返回：合并后升序链表的头节点
func mergeKLists(lists []*ListNode) *ListNode {
    h := &ListNodeHeap{}
    heap.Init(h)

    // 将所有链表头节点入堆
    for _, node := range lists {
        if node != nil {
            heap.Push(h, node)
        }
    }

    dummy := &ListNode{}
    cur := dummy

    for h.Len() > 0 {
        // 取堆顶（当前最小节点）
        node := heap.Pop(h).(*ListNode)
        cur.Next = node
        cur = cur.Next
        // 将该节点的下一节点入堆
        if node.Next != nil {
            heap.Push(h, node.Next)
        }
    }

    return dummy.Next
}
```

### Java

```java
import java.util.PriorityQueue;

class Solution {
    /**
     * 用优先队列合并 k 个有序链表。
     *
     * @param lists 链表数组
     * @return 合并后升序链表的头节点
     */
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);

        // 将所有非空链表头节点入堆
        for (ListNode node : lists) {
            if (node != null) pq.offer(node);
        }

        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;

        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            cur.next = node;
            cur = cur.next;
            if (node.next != null) pq.offer(node.next);
        }

        return dummy.next;
    }
}
```

### Python

```python
import heapq

class Solution:
    def mergeKLists(self, lists: list) -> ListNode:
        """
        用最小堆合并 k 个有序链表。

        参数:
            lists: 链表数组
        返回:
            合并后升序链表的头节点
        """
        heap = []
        counter = 0  # 打破节点值相等时 ListNode 不可比较的问题

        # 将所有非空链表头节点入堆
        for node in lists:
            if node:
                heapq.heappush(heap, (node.val, counter, node))
                counter += 1

        dummy = ListNode(0)
        cur = dummy

        while heap:
            val, _, node = heapq.heappop(heap)
            cur.next = node
            cur = cur.next
            if node.next:
                heapq.heappush(heap, (node.next.val, counter, node.next))
                counter += 1

        return dummy.next
```

## 踩坑记录

- **Python 中 ListNode 不可比较**：`heapq` 在节点值相同时会尝试比较 ListNode 对象，导致 TypeError。需要在堆元素中加入计数器 `counter` 作为第二排序键，保证节点值相同时也能分出大小。
- **入堆前检查非空**：`lists` 中可能含空链表（`None`），入堆前需要判断 `node != null`，否则堆操作时访问 `None.val` 报错。
- **链表数组为空**：`lists = []` 时，堆为空，循环不执行，返回 `dummy.Next = nil`，正确。

# 0002. Add Two Numbers

---
编号: 2
题目: Add Two Numbers
难度: 中等
标签: [递归, 链表, 数学]
来源链接: https://leetcode.com/problems/add-two-numbers/
---

## 题目描述

给定两个非空链表，分别表示两个非负整数。每个链表的节点按**逆序**存储各位数字（即个位在链表头部）。将两个数相加，以相同格式（逆序链表）返回结果。

题目保证：

- 每个链表的数字不含前导零，但数字 `0` 本身用单个节点 `0` 表示。
- 两个链表均为非空。

### Example 1

```text
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807，逆序存储为 [7,0,8]。
```

### Example 2

```text
Input: l1 = [0], l2 = [0]
Output: [0]
```

### Example 3

```text
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9]
Output: [8,9,9,9,0,0,0,1]
Explanation: 9999999 + 999 = 10000998，逆序为 [8,9,9,9,0,0,0,1]。
```

### 约束条件

- 每个链表的节点数在 `[1, 100]` 范围内。
- `0 <= Node.val <= 9`
- 题目保证链表表示的数字不含前导零。

## 思路分析

### 突破口

链表逆序存储正好让个位对齐 → 可以直接从头节点开始逐位相加，就像手工竖式加法一样，唯一的额外状态是**进位 carry**。

### 思路拆解

1. **暴力解**：先把两个链表转成整数，相加，再转回链表。但对超长链表（100 位）会整数溢出。

2. **问题转化**：逐节点模拟竖式加法，每步计算 `sum = l1.val + l2.val + carry`，当前节点值为 `sum % 10`，进位为 `sum / 10`。

3. **优化方向**：无需额外数据结构，O(max(m,n)) 时间单次遍历即可。关键是处理两个链表长度不等的情况：短链耗尽后当作 0 继续计算。

4. **实现要点**：遍历结束后若 `carry != 0` 还需额外追加一个节点（如 `999 + 1 = 1000`）。用哑节点（dummy head）简化边界处理。

### 示意图

```text
  l1: 2 -> 4 -> 3        (代表 342)
  l2: 5 -> 6 -> 4        (代表 465)

  步骤：
  ┌────┬──────────────┬───────────┬────────┬──────────┐
  │步骤│ l1.val+l2.val│ +carry    │ 节点值  │ 新carry  │
  ├────┼──────────────┼───────────┼────────┼──────────┤
  │  1 │   2 + 5 = 7  │  +0 = 7   │   7    │    0     │
  │  2 │   4 + 6 = 10 │  +0 = 10  │   0    │    1     │
  │  3 │   3 + 4 = 7  │  +1 = 8   │   8    │    0     │
  └────┴──────────────┴───────────┴────────┴──────────┘
  输出: 7 -> 0 -> 8       (代表 807)
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 逐位模拟（竖式加法） | O(max(m, n)) | O(max(m, n)) |

## 代码实现

### Go

```go
// ListNode 链表节点定义
type ListNode struct {
    Val  int
    Next *ListNode
}

// addTwoNumbers 模拟竖式加法，逐节点相加并处理进位
// 参数：l1, l2 为两个逆序链表，分别表示一个非负整数
// 返回：相加结果的逆序链表
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    dummy := &ListNode{} // 哑节点，简化头节点处理
    cur := dummy
    carry := 0

    // 只要有一个链表未耗尽，或还有进位，就继续迭代
    for l1 != nil || l2 != nil || carry != 0 {
        sum := carry

        // 短链耗尽后当作 0
        if l1 != nil {
            sum += l1.Val
            l1 = l1.Next
        }
        if l2 != nil {
            sum += l2.Val
            l2 = l2.Next
        }

        carry = sum / 10
        cur.Next = &ListNode{Val: sum % 10}
        cur = cur.Next
    }

    return dummy.Next
}
```

### Java

```java
import java.util.*;

class Solution {
    // ListNode 节点定义（LeetCode 平台已内置，此处仅作注释说明）
    // class ListNode { int val; ListNode next; ListNode(int x) { val = x; } }

    /**
     * 模拟竖式加法，逐节点相加并处理进位。
     *
     * @param l1 非负整数的逆序链表表示
     * @param l2 非负整数的逆序链表表示
     * @return 两数之和的逆序链表表示
     */
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0); // 哑节点，简化头节点处理
        ListNode cur = dummy;
        int carry = 0;

        // 只要有一个链表未耗尽，或还有进位，就继续迭代
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;

            // 短链耗尽后当作 0
            if (l1 != null) {
                sum += l1.val;
                l1 = l1.next;
            }
            if (l2 != null) {
                sum += l2.val;
                l2 = l2.next;
            }

            carry = sum / 10;
            cur.next = new ListNode(sum % 10);
            cur = cur.next;
        }

        return dummy.next;
    }
}
```

### Python

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        """
        模拟竖式加法，逐节点相加并处理进位。

        参数:
            l1: 非负整数的逆序链表表示
            l2: 非负整数的逆序链表表示
        返回:
            两数之和的逆序链表表示
        """
        dummy = ListNode(0)  # 哑节点，简化头节点处理
        cur = dummy
        carry = 0

        # 只要有一个链表未耗尽，或还有进位，就继续迭代
        while l1 or l2 or carry:
            s = carry

            # 短链耗尽后当作 0
            if l1:
                s += l1.val
                l1 = l1.next
            if l2:
                s += l2.val
                l2 = l2.next

            carry, val = divmod(s, 10)
            cur.next = ListNode(val)
            cur = cur.next

        return dummy.next
```

## 踩坑记录

- **最高位进位遗漏**：两链表都遍历完后，若 `carry == 1` 还需再追加一个节点（如 `99 + 1 = 100`，结果是 `0 -> 0 -> 1`）。循环条件必须包含 `carry != 0`。
- **两链表长度不等**：短链耗尽后不能直接停止，要继续处理长链剩余部分（短链当 0 处理）。
- **哑节点的作用**：若不用哑节点，头节点创建需要特判，逻辑更繁琐。哑节点统一化了新节点的追加操作。

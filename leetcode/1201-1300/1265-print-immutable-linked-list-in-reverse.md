# 1265. Print Immutable Linked List in Reverse

---
编号: 1265
题目: Print Immutable Linked List in Reverse
难度: 中等
标签: [栈, 递归, 链表, 双指针]
来源链接: https://leetcode.com/problems/print-immutable-linked-list-in-reverse/
---

## 题目描述

给您一个不可变的链表，使用下列接口逆序打印每个节点的值：

- `ImmutableListNode`: 描述不可变链表的接口，链表的头节点已给出。

您需要使用以下函数来访问此链表（您 **不能 **直接访问 `ImmutableListNode`）：

- `ImmutableListNode.printValue()`：打印当前节点的值。

- `ImmutableListNode.getNext()`：返回下一个节点。

输入只用来内部初始化链表。您不可以通过修改链表解决问题。也就是说，您只能通过上述 API 来操作链表。

**示例 1：**

```text
输入：head = [1,2,3,4]
输出：[4,3,2,1]
```

**示例 2：**

```text
输入：head = [0,-4,-1,3,-5]
输出：[-5,3,-1,-4,0]
```

**示例 3：**

```text
输入：head = [-2,0,6,4,4,-6]
输出：[-6,4,4,6,0,-2]
```

**提示：**

- 链表的长度在 `[1, 1000]` 之间。

- 每个节点的值在 `[-1000, 1000]` 之间。

**进阶：**

您是否可以：

- 使用常数级空间复杂度解决问题？

- 使用线性级时间复杂度和低于线性级空间复杂度解决问题？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 递归, 链表, 双指针」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用递归来实现链表的逆序打印。在函数中，我们判断当前节点是否为空，如果不为空，则获取下一个节点，然后递归调用函数本身，最后打印当前节点的值。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是链表的长度。

### 示意图

```text
输入/状态  ->  按规则更新候选状态  ->  得到答案
   |                 |                    |
  边界             不变量               返回值
```

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 参考解法 | 见「参考解法要点」 | 见「参考解法要点」 |

---

## 代码实现

### Go

```go
// Print Immutable Linked List in Reverse：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/*   Below is the interface for ImmutableListNode, which is already defined for you.
 *
 *   type ImmutableListNode struct {
 *
 *   }
 *
 *   func (this *ImmutableListNode) getNext() ImmutableListNode {
 *		// return the next node.
 *   }
 *
 *   func (this *ImmutableListNode) printValue() {
 *		// print the value of this node.
 *   }
 */

func printLinkedListInReverse(head ImmutableListNode) {
	if head != nil {
		printLinkedListInReverse(head.getNext())
		head.printValue()
	}
}
```

### Java

```java
// Print Immutable Linked List in Reverse：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * // This is the ImmutableListNode's API interface.
 * // You should not implement it, or speculate about its implementation.
 * interface ImmutableListNode {
 *     public void printValue(); // print the value of this node.
 *     public ImmutableListNode getNext(); // return the next node.
 * };
 */

class Solution {
    public void printLinkedListInReverse(ImmutableListNode head) {
        if (head != null) {
            printLinkedListInReverse(head.getNext());
            head.printValue();
        }
    }
}
```

### Python

```python
# Print Immutable Linked List in Reverse：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# """
# This is the ImmutableListNode's API interface.
# You should not implement it, or speculate about its implementation.
# """
# class ImmutableListNode:
#     def printValue(self) -> None: # print the value of this node.
#     def getNext(self) -> 'ImmutableListNode': # return the next node.


class Solution:
    def printLinkedListInReverse(self, head: 'ImmutableListNode') -> None:
        if head:
            self.printLinkedListInReverse(head.getNext())
            head.printValue()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

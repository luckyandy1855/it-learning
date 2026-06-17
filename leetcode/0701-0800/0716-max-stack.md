# 0716. Max Stack

---
编号: 716
题目: Max Stack
难度: 困难
标签: [栈, 设计, 链表, 双向链表, 有序集合]
来源链接: https://leetcode.com/problems/max-stack/
---

## 题目描述

设计一个最大栈数据结构，既支持栈操作，又支持查找栈中最大元素。

实现 `MaxStack` 类：

- `MaxStack()` 初始化栈对象

- `void push(int x)` 将元素 x 压入栈中。

- `int pop()` 移除栈顶元素并返回这个元素。

- `int top()` 返回栈顶元素，无需移除。

- `int peekMax()` 检索并返回栈中最大元素，无需移除。

- `int popMax()` 检索并返回栈中最大元素，并将其移除。如果有多个最大元素，只要移除 **最靠近栈顶** 的那个。

**示例：**

```text
输入
["MaxStack", "push", "push", "push", "top", "popMax", "top", "peekMax", "pop", "top"]
[[], [5], [1], [5], [], [], [], [], [], []]
输出
[null, null, null, null, 5, 5, 1, 5, 1, 5]

解释
MaxStack stk = new MaxStack();
stk.push(5);   // [5] - 5 既是栈顶元素，也是最大元素
stk.push(1);   // [5, 1] - 栈顶元素是 1，最大元素是 5
stk.push(5);   // [5, 1, 5] - 5 既是栈顶元素，也是最大元素
stk.top();     // 返回 5，[5, 1, 5] - 栈没有改变
stk.popMax();  // 返回 5，[5, 1] - 栈发生改变，栈顶元素不再是最大元素
stk.top();     // 返回 1，[5, 1] - 栈没有改变
stk.peekMax(); // 返回 5，[5, 1] - 栈没有改变
stk.pop();     // 返回 1，[5] - 此操作后，5 既是栈顶元素，也是最大元素
stk.top();     // 返回 5，[5] - 栈没有改变
```

**提示：**

- `-10^7 进阶：

- 试着设计解决方案：调用 `top` 方法的时间复杂度为 `O(1)` ，调用其他方法的时间复杂度为 `O(logn)` 。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 设计, 链表, 双向链表, 有序集合」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

使用双向链表存储栈中的元素，使用有序集合存储栈中的元素，有序集合中的元素按照从小到大的顺序存储，每个元素都对应着双向链表中的一个节点。

- 调用 `push(x)` 方法时，将元素 `x` 插入到双向链表的末尾，同时将元素 `x` 对应的节点插入到有序集合中。时间复杂度 $O(\log n)$。
- 调用 `pop()` 方法时，将双向链表的末尾节点删除，同时将有序集合中的对应节点删除。时间复杂度 $O(\log n)$。
- 调用 `top()` 方法时，返回双向链表的末尾节点的值。时间复杂度 $O(1)$。
- 调用 `peekMax()` 方法时，返回有序集合中的最后一个元素对应的节点的值。时间复杂度 $O(\log n)$。
- 调用 `popMax()` 方法时，将有序集合中的最后一个元素删除，同时将对应的节点从双向链表中删除。时间复杂度 $O(\log n)$。

空间复杂度 $O(n)$。其中 $n$ 为栈中的元素个数。

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

### Java

```java
// Max Stack：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Node {
    public int val;
    public Node prev, next;

    public Node() {
    }

    public Node(int val) {
        this.val = val;
    }
}

class DoubleLinkedList {
    private final Node head = new Node();
    private final Node tail = new Node();

    public DoubleLinkedList() {
        head.next = tail;
        tail.prev = head;
    }

    public Node append(int val) {
        Node node = new Node(val);
        node.next = tail;
        node.prev = tail.prev;
        tail.prev = node;
        node.prev.next = node;
        return node;
    }

    public static Node remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        return node;
    }

    public Node pop() {
        return remove(tail.prev);
    }

    public int peek() {
        return tail.prev.val;
    }
}

class MaxStack {
    private DoubleLinkedList stk = new DoubleLinkedList();
    private TreeMap<Integer, List<Node>> tm = new TreeMap<>();

    public MaxStack() {
    }

    public void push(int x) {
        Node node = stk.append(x);
        tm.computeIfAbsent(x, k -> new ArrayList<>()).add(node);
    }

    public int pop() {
        Node node = stk.pop();
        List<Node> nodes = tm.get(node.val);
        int x = nodes.remove(nodes.size() - 1).val;
        if (nodes.isEmpty()) {
            tm.remove(node.val);
        }
        return x;
    }

    public int top() {
        return stk.peek();
    }

    public int peekMax() {
        return tm.lastKey();
    }

    public int popMax() {
        int x = peekMax();
        List<Node> nodes = tm.get(x);
        Node node = nodes.remove(nodes.size() - 1);
        if (nodes.isEmpty()) {
            tm.remove(x);
        }
        DoubleLinkedList.remove(node);
        return x;
    }
}

/**
 * Your MaxStack object will be instantiated and called as such:
 * MaxStack obj = new MaxStack();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.top();
 * int param_4 = obj.peekMax();
 * int param_5 = obj.popMax();
 */
```

### Python

```python
# Max Stack：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Node:
    def __init__(self, val=0):
        self.val = val
        self.prev: Union[Node, None] = None
        self.next: Union[Node, None] = None


class DoubleLinkedList:
    def __init__(self):
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def append(self, val) -> Node:
        node = Node(val)
        node.next = self.tail
        node.prev = self.tail.prev
        self.tail.prev = node
        node.prev.next = node
        return node

    @staticmethod
    def remove(node) -> Node:
        node.prev.next = node.next
        node.next.prev = node.prev
        return node

    def pop(self) -> Node:
        return self.remove(self.tail.prev)

    def peek(self):
        return self.tail.prev.val


class MaxStack:
    def __init__(self):
        self.stk = DoubleLinkedList()
        self.sl = SortedList(key=lambda x: x.val)

    def push(self, x: int) -> None:
        node = self.stk.append(x)
        self.sl.add(node)

    def pop(self) -> int:
        node = self.stk.pop()
        self.sl.remove(node)
        return node.val

    def top(self) -> int:
        return self.stk.peek()

    def peekMax(self) -> int:
        return self.sl[-1].val

    def popMax(self) -> int:
        node = self.sl.pop()
        DoubleLinkedList.remove(node)
        return node.val


# Your MaxStack object will be instantiated and called as such:
# obj = MaxStack()
# obj.push(x)
# param_2 = obj.pop()
# param_3 = obj.top()
# param_4 = obj.peekMax()
# param_5 = obj.popMax()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

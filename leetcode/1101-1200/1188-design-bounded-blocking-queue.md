# 1188. Design Bounded Blocking Queue

---
编号: 1188
题目: Design Bounded Blocking Queue
难度: 中等
标签: [多线程]
来源链接: https://leetcode.com/problems/design-bounded-blocking-queue/
---

## 题目描述

实现一个拥有如下方法的线程安全有限阻塞队列：

- `BoundedBlockingQueue(int capacity)` 构造方法初始化队列，其中`capacity`代表队列长度上限。

- `void enqueue(int element)` 在队首增加一个`element`. 如果队列满，调用线程被阻塞直到队列非满。

- `int dequeue()` 返回队尾元素并从队列中将其删除. 如果队列为空，调用线程被阻塞直到队列非空。

- `int size()` 返回当前队列元素个数。

你的实现将会被多线程同时访问进行测试。每一个线程要么是一个只调用`enqueue`方法的生产者线程，要么是一个只调用`dequeue`方法的消费者线程。`size`方法将会在每一个测试用例之后进行调用。

请不要使用内置的有限阻塞队列实现，否则面试将不会通过。

**示例 1:**

```text
输入:
1
1
["BoundedBlockingQueue","enqueue","dequeue","dequeue","enqueue","enqueue","enqueue","enqueue","dequeue"]
[[2],[1],[],[],[0],[2],[3],[4],[]]

输出:
[1,0,2,2]

解释:
生产者线程数目 = 1
消费者线程数目 = 1

BoundedBlockingQueue queue = new BoundedBlockingQueue(2);   // 使用capacity = 2初始化队列。

queue.enqueue(1);   // 生产者线程将 1 插入队列。
queue.dequeue();    // 消费者线程调用 dequeue 并返回 1 。
queue.dequeue();    // 由于队列为空，消费者线程被阻塞。
queue.enqueue(0);   // 生产者线程将 0 插入队列。消费者线程被解除阻塞同时将 0 弹出队列并返回。
queue.enqueue(2);   // 生产者线程将 2 插入队列。
queue.enqueue(3);   // 生产者线程将 3 插入队列。
queue.enqueue(4);   // 生产者线程由于队列长度已达到上限 2 而被阻塞。
queue.dequeue();    // 消费者线程将 2 从队列弹出并返回。生产者线程解除阻塞同时将4插入队列。
queue.size();       // 队列中还有 2 个元素。size()方法在每组测试用例最后调用。
```

**示例 2:**

```text
输入:
3
4
["BoundedBlockingQueue","enqueue","enqueue","enqueue","dequeue","dequeue","dequeue","enqueue"]
[[3],[1],[0],[2],[],[],[],[3]]

输出:
[1,0,2,1]

解释:
生产者线程数目 = 3
消费者线程数目 = 4

BoundedBlockingQueue queue = new BoundedBlockingQueue(3);   // 使用capacity = 3初始化队列。

queue.enqueue(1);   // 生产者线程 P1 将 1 插入队列。
queue.enqueue(0);   // 生产者线程 P2 将 0 插入队列。
queue.enqueue(2);   // 生产者线程 P3 将2插入队列。
queue.dequeue();    // 消费者线程 C1 调用 dequeue。
queue.dequeue();    // 消费者线程 C2 调用 dequeue。
queue.dequeue();    // 消费者线程 C3 调用 dequeue。
queue.enqueue(3);   // 其中一个生产者线程将3插入队列。
queue.size();       // 队列中还有 1 个元素。

由于生产者/消费者线程的数目可能大于 1 ，我们并不知道线程如何被操作系统调度，即使输入看上去隐含了顺序。因此任意一种输出[1,0,2]或[1,2,0]或[0,1,2]或[0,2,1]或[2,0,1]或[2,1,0]都可被接受。
```

**提示:**

- `1 <= Number of Prdoucers <= 8`

- `1 <= Number of Consumers <= 8`

- `1 <= size <= 30`

- `0 <= element <= 20`

-  `enqueue`的调用次数 **大于等于**  `dequeue` 的调用次数。

-  `enque`, `deque` 和 `size` 最多被调用 `40` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「多线程」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Design Bounded Blocking Queue：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class BoundedBlockingQueue {
    private Semaphore s1;
    private Semaphore s2;
    private Deque<Integer> q = new ArrayDeque<>();

    public BoundedBlockingQueue(int capacity) {
        s1 = new Semaphore(capacity);
        s2 = new Semaphore(0);
    }

    public void enqueue(int element) throws InterruptedException {
        s1.acquire();
        q.offer(element);
        s2.release();
    }

    public int dequeue() throws InterruptedException {
        s2.acquire();
        int ans = q.poll();
        s1.release();
        return ans;
    }

    public int size() {
        return q.size();
    }
}
```

### Python

```python
# Design Bounded Blocking Queue：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
from threading import Semaphore


class BoundedBlockingQueue(object):
    def __init__(self, capacity: int):
        self.s1 = Semaphore(capacity)
        self.s2 = Semaphore(0)
        self.q = deque()

    def enqueue(self, element: int) -> None:
        self.s1.acquire()
        self.q.append(element)
        self.s2.release()

    def dequeue(self) -> int:
        self.s2.acquire()
        ans = self.q.popleft()
        self.s1.release()
        return ans

    def size(self) -> int:
        return len(self.q)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

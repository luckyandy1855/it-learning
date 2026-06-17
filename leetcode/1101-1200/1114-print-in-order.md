# 1114. Print in Order

---
编号: 1114
题目: Print in Order
难度: 简单
标签: [多线程]
来源链接: https://leetcode.com/problems/print-in-order/
---

## 题目描述

给你一个类：

```text
public class Foo {
  public void first() { print("first"); }
  public void second() { print("second"); }
  public void third() { print("third"); }
}
```

三个不同的线程 A、B、C 将会共用一个 `Foo` 实例。

- 线程 A 将会调用 `first()` 方法

- 线程 B 将会调用 `second()` 方法

- 线程 C 将会调用 `third()` 方法

请设计修改程序，以确保 `second()` 方法在 `first()` 方法之后被执行，`third()` 方法在 `second()` 方法之后被执行。

**提示：**

- 尽管输入中的数字似乎暗示了顺序，但是我们并不保证线程在操作系统中的调度顺序。

- 你看到的输入格式主要是为了确保测试的全面性。

**示例 1：**

```text
输入：nums = [1,2,3]
输出："firstsecondthird"
解释：
有三个线程会被异步启动。输入 [1,2,3] 表示线程 A 将会调用 first() 方法，线程 B 将会调用 second() 方法，线程 C 将会调用 third() 方法。正确的输出是 "firstsecondthird"。
```

**示例 2：**

```text
输入：nums = [1,3,2]
输出："firstsecondthird"
解释：
输入 [1,3,2] 表示线程 A 将会调用 first() 方法，线程 B 将会调用 third() 方法，线程 C 将会调用 second() 方法。正确的输出是 "firstsecondthird"。
```

**提示：**

- `nums` 是 `[1, 2, 3]` 的一组排列

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

我们可以用三个信号量 $a$, $b$, $c$ 来控制三个线程的执行顺序，初始时 $a$ 信号量的计数为 $1$，$b$ 和 $c$ 的计数为 $0$。

线程 $A$ 在执行 `first()` 方法时，首先需要获取 $a$ 信号量，获取成功后执行 `first()` 方法，然后释放 $b$ 信号量，这样线程 $B$ 就可以获取 $b$ 信号量并执行 `second()` 方法。

线程 $B$ 在执行 `second()` 方法时，首先需要获取 $b$ 信号量，获取成功后执行 `second()` 方法，然后释放 $c$ 信号量，这样线程 $C$ 就可以获取 $c$ 信号量并执行 `third()` 方法。

线程 $C$ 在执行 `third()` 方法时，首先需要获取 $c$ 信号量，获取成功后执行 `third()` 方法，然后释放 $a$ 信号量，这样线程 $A$ 就可以获取 $a$ 信号量并执行 `first()` 方法。

时间复杂度 $O(1)$，空间复杂度 $O(1)$。

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
// Print in Order：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Foo {
    private Semaphore a = new Semaphore(1);
    private Semaphore b = new Semaphore(0);
    private Semaphore c = new Semaphore(0);

    public Foo() {
    }

    public void first(Runnable printFirst) throws InterruptedException {
        a.acquire(1);
        // printFirst.run() outputs "first". Do not change or remove this line.
        printFirst.run();
        b.release(1);
    }

    public void second(Runnable printSecond) throws InterruptedException {
        b.acquire(1);
        // printSecond.run() outputs "second". Do not change or remove this line.
        printSecond.run();
        c.release(1);
    }

    public void third(Runnable printThird) throws InterruptedException {
        c.acquire(1);
        // printThird.run() outputs "third". Do not change or remove this line.
        printThird.run();
        a.release(1);
    }
}
```

### Python

```python
# Print in Order：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Foo:
    def __init__(self):
        self.l2 = threading.Lock()
        self.l3 = threading.Lock()
        self.l2.acquire()
        self.l3.acquire()

    def first(self, printFirst: 'Callable[[], None]') -> None:
        printFirst()
        self.l2.release()

    def second(self, printSecond: 'Callable[[], None]') -> None:
        self.l2.acquire()
        printSecond()
        self.l3.release()

    def third(self, printThird: 'Callable[[], None]') -> None:
        self.l3.acquire()
        printThird()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

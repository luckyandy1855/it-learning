# 1116. Print Zero Even Odd

---
编号: 1116
题目: Print Zero Even Odd
难度: 中等
标签: [多线程]
来源链接: https://leetcode.com/problems/print-zero-even-odd/
---

## 题目描述

现有函数 `printNumber` 可以用一个整数参数调用，并输出该整数到控制台。

- 例如，调用 `printNumber(7)` 将会输出 `7` 到控制台。

给你类 `ZeroEvenOdd` 的一个实例，该类中有三个函数：`zero`、`even` 和 `odd` 。`ZeroEvenOdd` 的相同实例将会传递给三个不同线程：

- **线程 A：**调用 `zero()` ，只输出 `0`

- **线程 B：**调用 `even()` ，只输出偶数

- **线程 C：**调用 `odd()` ，只输出奇数

修改给出的类，以输出序列 `"010203040506..."` ，其中序列的长度必须为 `2n` 。

实现 `ZeroEvenOdd` 类：

- `ZeroEvenOdd(int n)` 用数字 `n` 初始化对象，表示需要输出的数。

- `void zero(printNumber)` 调用 `printNumber` 以输出一个 0 。

- `void even(printNumber)` 调用`printNumber` 以输出偶数。

- `void odd(printNumber)` 调用 `printNumber` 以输出奇数。

**示例 1：**

```text
输入：n = 2
输出："0102"
解释：三条线程异步执行，其中一个调用 zero()，另一个线程调用 even()，最后一个线程调用odd()。正确的输出为 "0102"。
```

**示例 2：**

```text
输入：n = 5
输出："0102030405"
```

**提示：**

- `1 <= n <= 1000`

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

我们用三个信号量 $z$, $e$, $o$ 来控制三个线程的执行顺序，其中 $z$ 的初始值为 $1$，$e$ 和 $o$ 的初始值为 $0$。

- 信号量 $x$ 控制 `zero` 函数的执行，当 $z$ 信号量的值为 $1$ 时，`zero` 函数可以执行，执行完毕后将 $z$ 信号量的值设为 $0$，并将 $e$ 信号量的值设为 $1$ 或 $o$ 信号量的值设为 $1$，具体取决于下一次需要执行的是 `even` 函数还是 `odd` 函数。
- 信号量 $e$ 控制 `even` 函数的执行，当 $e$ 信号量的值为 $1$ 时，`even` 函数可以执行，执行完毕后将 $z$ 信号量的值设为 $1$，并将 $e$ 信号量的值设为 $0$。
- 信号量 $o$ 控制 `odd` 函数的执行，当 $o$ 信号量的值为 $1$ 时，`odd` 函数可以执行，执行完毕后将 $z$ 信号量的值设为 $1$，并将 $o$ 信号量的值设为 $0$。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。

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
// Print Zero Even Odd：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class ZeroEvenOdd {
    private int n;
    private Semaphore z = new Semaphore(1);
    private Semaphore e = new Semaphore(0);
    private Semaphore o = new Semaphore(0);

    public ZeroEvenOdd(int n) {
        this.n = n;
    }

    // printNumber.accept(x) outputs "x", where x is an integer.
    public void zero(IntConsumer printNumber) throws InterruptedException {
        for (int i = 0; i < n; ++i) {
            z.acquire(1);
            printNumber.accept(0);
            if (i % 2 == 0) {
                o.release(1);
            } else {
                e.release(1);
            }
        }
    }

    public void even(IntConsumer printNumber) throws InterruptedException {
        for (int i = 2; i <= n; i += 2) {
            e.acquire(1);
            printNumber.accept(i);
            z.release(1);
        }
    }

    public void odd(IntConsumer printNumber) throws InterruptedException {
        for (int i = 1; i <= n; i += 2) {
            o.acquire(1);
            printNumber.accept(i);
            z.release(1);
        }
    }
}
```

### Python

```python
# Print Zero Even Odd：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
from threading import Semaphore


class ZeroEvenOdd:
    def __init__(self, n):
        self.n = n
        self.z = Semaphore(1)
        self.e = Semaphore(0)
        self.o = Semaphore(0)

    # printNumber(x) outputs "x", where x is an integer.
    def zero(self, printNumber: 'Callable[[int], None]') -> None:
        for i in range(self.n):
            self.z.acquire()
            printNumber(0)
            if i % 2 == 0:
                self.o.release()
            else:
                self.e.release()

    def even(self, printNumber: 'Callable[[int], None]') -> None:
        for i in range(2, self.n + 1, 2):
            self.e.acquire()
            printNumber(i)
            self.z.release()

    def odd(self, printNumber: 'Callable[[int], None]') -> None:
        for i in range(1, self.n + 1, 2):
            self.o.acquire()
            printNumber(i)
            self.z.release()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

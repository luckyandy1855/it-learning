# 1115. Print FooBar Alternately

---
编号: 1115
题目: Print FooBar Alternately
难度: 中等
标签: [多线程]
来源链接: https://leetcode.com/problems/print-foobar-alternately/
---

## 题目描述

给你一个类：

```text
class FooBar {
  public void foo() {
    for (int i = 0; i < n; i++) {
      print("foo");
    }
  }

  public void bar() {
    for (int i = 0; i < n; i++) {
      print("bar");
    }
  }
}
```

两个不同的线程将会共用一个 `FooBar` 实例：

- 线程 A 将会调用 `foo()` 方法，而

- 线程 B 将会调用 `bar()` 方法

请设计修改程序，以确保 `"foobar"` 被输出 `n` 次。

**示例 1：**

```text
输入：n = 1
输出："foobar"
解释：这里有两个线程被异步启动。其中一个调用 foo() 方法, 另一个调用 bar() 方法，"foobar" 将被输出一次。
```

**示例 2：**

```text
输入：n = 2
输出："foobarfoobar"
解释："foobar" 将被输出两次。
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

我们用两个信号量 $f$ 和 $b$ 来控制两个线程的执行顺序，其中 $f$ 初始值为 $1$，而 $b$ 初始值为 $0$，表示线程 $A$ 先执行。

当线程 $A$ 执行时，首先会执行 $f$ 的 $acquire$ 操作，此时 $f$ 的值变为 $0$，线程 $A$ 获得了 $f$ 的使用权，可以执行 $foo$ 函数，然后执行 $b$ 的 $release$ 操作，此时 $b$ 的值变为 $1$，线程 $B$ 获得了 $b$ 的使用权，可以执行 $bar$ 函数。

当线程 $B$ 执行时，首先会执行 $b$ 的 $acquire$ 操作，此时 $b$ 的值变为 $0$，线程 $B$ 获得了 $b$ 的使用权，可以执行 $bar$ 函数，然后执行 $f$ 的 $release$ 操作，此时 $f$ 的值变为 $1$，线程 $A$ 获得了 $f$ 的使用权，可以执行 $foo$ 函数。

因此，我们只需要循环 $n$ 次，每次执行 $foo$ 和 $bar$ 函数时，先执行 $acquire$ 操作，再执行 $release$ 操作即可。

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
// Print FooBar Alternately：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class FooBar {
    private int n;
    private Semaphore f = new Semaphore(1);
    private Semaphore b = new Semaphore(0);

    public FooBar(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            f.acquire(1);
            // printFoo.run() outputs "foo". Do not change or remove this line.
            printFoo.run();
            b.release(1);
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            b.acquire(1);
            // printBar.run() outputs "bar". Do not change or remove this line.
            printBar.run();
            f.release(1);
        }
    }
}
```

### Python

```python
# Print FooBar Alternately：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
from threading import Semaphore


class FooBar:
    def __init__(self, n):
        self.n = n
        self.f = Semaphore(1)
        self.b = Semaphore(0)

    def foo(self, printFoo: "Callable[[], None]") -> None:
        for _ in range(self.n):
            self.f.acquire()
            # printFoo() outputs "foo". Do not change or remove this line.
            printFoo()
            self.b.release()

    def bar(self, printBar: "Callable[[], None]") -> None:
        for _ in range(self.n):
            self.b.acquire()
            # printBar() outputs "bar". Do not change or remove this line.
            printBar()
            self.f.release()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1195. Fizz Buzz Multithreaded

---
编号: 1195
题目: Fizz Buzz Multithreaded
难度: 中等
标签: [多线程]
来源链接: https://leetcode.com/problems/fizz-buzz-multithreaded/
---

## 题目描述

编写一个可以从 1 到 n 输出代表这个数字的字符串的程序，但是：

- 如果这个数字可以被 3 整除，输出 "fizz"。

- 如果这个数字可以被 5 整除，输出 "buzz"。

- 如果这个数字可以同时被 3 和 5 整除，输出 "fizzbuzz"。

例如，当 `n = 15`，输出： `1, 2, fizz, 4, buzz, fizz, 7, 8, fizz, buzz, 11, fizz, 13, 14, fizzbuzz`。

假设有这么一个类：

```text
class FizzBuzz {
  public FizzBuzz(int n) { ... }               // constructor
  public void fizz(printFizz) { ... }          // only output "fizz"
  public void buzz(printBuzz) { ... }          // only output "buzz"
  public void fizzbuzz(printFizzBuzz) { ... }  // only output "fizzbuzz"
  public void number(printNumber) { ... }      // only output the numbers
}
```

请你实现一个有四个线程的多线程版  `FizzBuzz`， 同一个 `FizzBuzz` 实例会被如下四个线程使用：

- 线程A将调用 `fizz()` 来判断是否能被 3 整除，如果可以，则输出 `fizz`。

- 线程B将调用 `buzz()` 来判断是否能被 5 整除，如果可以，则输出 `buzz`。

- 线程C将调用 `fizzbuzz()` 来判断是否同时能被 3 和 5 整除，如果可以，则输出 `fizzbuzz`。

- 线程D将调用 `number()` 来实现输出既不能被 3 整除也不能被 5 整除的数字。

**提示：**

- 本题已经提供了打印字符串的相关方法，如 `printFizz()` 等，具体方法名请参考答题模板中的注释部分。

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
// Fizz Buzz Multithreaded：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class FizzBuzz {
    private int n;

    public FizzBuzz(int n) {
        this.n = n;
    }

    private Semaphore fSema = new Semaphore(0);
    private Semaphore bSema = new Semaphore(0);
    private Semaphore fbSema = new Semaphore(0);
    private Semaphore nSema = new Semaphore(1);

    // printFizz.run() outputs "fizz".
    public void fizz(Runnable printFizz) throws InterruptedException {
        for (int i = 3; i <= n; i = i + 3) {
            if (i % 5 != 0) {
                fSema.acquire();
                printFizz.run();
                nSema.release();
            }
        }
    }

    // printBuzz.run() outputs "buzz".
    public void buzz(Runnable printBuzz) throws InterruptedException {
        for (int i = 5; i <= n; i = i + 5) {
            if (i % 3 != 0) {
                bSema.acquire();
                printBuzz.run();
                nSema.release();
            }
        }
    }

    // printFizzBuzz.run() outputs "fizzbuzz".
    public void fizzbuzz(Runnable printFizzBuzz) throws InterruptedException {
        for (int i = 15; i <= n; i = i + 15) {
            fbSema.acquire();
            printFizzBuzz.run();
            nSema.release();
        }
    }

    // printNumber.accept(x) outputs "x", where x is an integer.
    public void number(IntConsumer printNumber) throws InterruptedException {
        for (int i = 1; i <= n; i++) {
            nSema.acquire();
            if (i % 3 == 0 && i % 5 == 0) {
                fbSema.release();
            } else if (i % 3 == 0) {
                fSema.release();
            } else if (i % 5 == 0) {
                bSema.release();
            } else {
                printNumber.accept(i);
                nSema.release();
            }
        }
    }
}
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0878. Nth Magical Number

---
编号: 878
题目: Nth Magical Number
难度: 困难
标签: [数学, 二分查找]
来源链接: https://leetcode.com/problems/nth-magical-number/
---

## 题目描述

一个正整数如果能被 `a` 或 `b` 整除，那么它是神奇的。

给定三个整数 `n` , `a` , `b` ，返回第 `n` 个神奇的数字。因为答案可能很大，所以返回答案 **对 **`10^9 + 7` **取模 **后的值。

**示例 1：**

```text
输入：n = 1, a = 2, b = 3
输出：2
```

**示例 2：**

```text
输入：n = 4, a = 2, b = 3
输出：6
```

**提示：**

- `1 <= n <= 10^9`

- `2 <= a, b <= 4 * 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，神奇数字是能被 $a$ 或 $b$ 整除的正整数。

而我们知道，对于任意正整数 $x$，在 $[1,..x]$ 范围内，能被 $a$ 整除的数有 $\lfloor \frac{x}{a} \rfloor$ 个，能被 $b$ 整除的数有 $\lfloor \frac{x}{b} \rfloor$ 个，能被 $a$ 和 $b$ 同时整除的数有 $\lfloor \frac{x}{c} \rfloor$ 个，其中 $c$ 是 $a$ 和 $b$ 的最小公倍数。最小公倍数的计算公式为 $c = lcm(a, b) = \frac{a \times b}{gcd(a, b)}$。

因此，对于任意正整数 $x$，在 $[1,..x]$ 范围内，神奇数字的个数为：


\lfloor \frac{x}{a} \rfloor + \lfloor \frac{x}{b} \rfloor - \lfloor \frac{x}{c} \rfloor


为什么要减去 $\lfloor \frac{x}{c} \rfloor$ 呢？可以这样理解，在 $[1,..x]$ 范围内，能被 $a$ 和 $b$ 同时整除的数，它们既能被 $a$ 整除，也能被 $b$ 整除，因此它们被计算了两次，需要减去一次。

题目要我们找到第 $n$ 个神奇数字，也即是说，要找到一个最小的正整数 $x$，使得以下式子成立：


\lfloor \frac{x}{a} \rfloor + \lfloor \frac{x}{b} \rfloor - \lfloor \frac{x}{c} \rfloor \geq n


随着 $x$ 的增大，神奇数字的个数也会增大，因此我们可以使用二分查找的方法，找到最小的正整数 $x$，使得上述式子成立。

注意答案的取模操作。

时间复杂度 $O(\log M)$，空间复杂度 $O(1)$。其中 $M$ 是二分查找的上界，本题可以取 $M=(a+b) \times n$。

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
// Nth Magical Number：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func nthMagicalNumber(n int, a int, b int) int {
	c := a * b / gcd(a, b)
	const mod int = 1e9 + 7
	r := (a + b) * n
	return sort.Search(r, func(x int) bool { return x/a+x/b-x/c >= n }) % mod
}

func gcd(a, b int) int {
	if b == 0 {
		return a
	}
	return gcd(b, a%b)
}
```

### Java

```java
// Nth Magical Number：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private static final int MOD = (int) 1e9 + 7;

    public int nthMagicalNumber(int n, int a, int b) {
        int c = a * b / gcd(a, b);
        long l = 0, r = (long) (a + b) * n;
        while (l < r) {
            long mid = l + r >>> 1;
            if (mid / a + mid / b - mid / c >= n) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return (int) (l % MOD);
    }

    private int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}
```

### Python

```python
# Nth Magical Number：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def nthMagicalNumber(self, n: int, a: int, b: int) -> int:
        mod = 10**9 + 7
        c = lcm(a, b)
        r = (a + b) * n
        return bisect_left(range(r), x=n, key=lambda x: x // a + x // b - x // c) % mod
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

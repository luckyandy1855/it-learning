# 0029. Divide Two Integers

---
编号: 29
题目: Divide Two Integers
难度: 中等
标签: [位运算, 数学]
来源链接: https://leetcode.com/problems/divide-two-integers/
---

## 题目描述

给定两个整数 `dividend`（被除数）和 `divisor`（除数），在**不使用乘法、除法和取模运算**的前提下，将两数相除，返回商（向零截断，即截断小数部分）。

如果结果超出 32 位有符号整数范围 `[-2^31, 2^31-1]`，返回 `2^31-1`。

题目保证：

- `divisor != 0`。

### Example 1

```text
Input: dividend = 10, divisor = 3
Output: 3
Explanation: 10/3 = 3.33...，向零截断为 3。
```

### Example 2

```text
Input: dividend = 7, divisor = -2
Output: -3
Explanation: 7/(-2) = -3.5，向零截断为 -3。
```

### 约束条件

- `-2^31 <= dividend, divisor <= 2^31 - 1`
- `divisor != 0`

## 思路分析

### 突破口

用位运算（左移）加速：每次找最大的 `divisor * 2^k`（不超过 dividend），减去它并累加 `2^k` 到商，比逐一减去 divisor 快得多（O(log² n) vs O(n)）。

### 思路拆解

1. **逐次相减**：每次从 dividend 减去一个 divisor，计数到 0，O(n)，超时。

2. **指数加速（位移）**：从高位到低位，找最大的 `divisor << k` 不超过当前余数，将 `1 << k` 加到商，余数减去 `divisor << k`，重复直到余数 < divisor，O(log² n)。

3. **符号处理**：先统一转为正数处理，最后根据符号决定正负。注意 `INT_MIN` 取绝对值会溢出，需用 long 或特殊处理。

4. **溢出情况**：只有 `dividend == INT_MIN && divisor == -1` 时结果超出 int32，返回 INT_MAX。

### 示意图

```text
dividend = 15, divisor = 2

找最大 2 * 2^k 不超过 15：
  2<<0=2, 2<<1=4, 2<<2=8, 2<<3=16 > 15 → 取 2<<2=8, 商加 2<<2=4, 余=15-8=7
再找最大 2 * 2^k 不超过 7：
  2<<0=2, 2<<1=4, 2<<2=8 > 7 → 取 2<<1=4, 商加 2<<1=2, 余=7-4=3
再找：
  2<<0=2, 2<<1=4 > 3 → 取 2<<0=2, 商加 2<<0=1, 余=3-2=1
余 1 < 2，停止

商 = 4+2+1 = 7（15/2=7.5，向零截断为 7）✓
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 逐次相减 | O(n) | O(1) |
| 位移加速 | O(log² n) | O(1) |

## 代码实现

### Go

```go
import "math"

// divide 在不使用乘除取模的情况下计算 dividend/divisor，向零截断
// 参数：dividend 被除数，divisor 除数（非零）
// 返回：商，若溢出返回 INT_MAX
func divide(dividend int, divisor int) int {
    // 唯一溢出情况：INT_MIN / -1 = INT_MAX+1，返回 INT_MAX
    if dividend == math.MinInt32 && divisor == -1 {
        return math.MaxInt32
    }

    // 统一转为正数处理，记录符号
    sign := 1
    if (dividend > 0) != (divisor > 0) {
        sign = -1
    }

    a := abs(dividend)
    b := abs(divisor)
    quotient := 0

    for a >= b {
        tmp, multiple := b, 1
        // 找最大的 b * 2^k 不超过 a
        for a >= tmp<<1 {
            tmp <<= 1
            multiple <<= 1
        }
        a -= tmp
        quotient += multiple
    }

    if sign == -1 {
        return -quotient
    }
    return quotient
}

func abs(x int) int {
    if x < 0 {
        return -x
    }
    return x
}
```

### Java

```java
class Solution {
    /**
     * 在不使用乘除取模的情况下计算 dividend/divisor，向零截断。
     *
     * @param dividend 被除数
     * @param divisor  除数（非零）
     * @return 商，若溢出返回 Integer.MAX_VALUE
     */
    public int divide(int dividend, int divisor) {
        if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;

        int sign = ((dividend > 0) == (divisor > 0)) ? 1 : -1;
        long a = Math.abs((long) dividend);
        long b = Math.abs((long) divisor);
        long quotient = 0;

        while (a >= b) {
            long tmp = b, multiple = 1;
            while (a >= tmp << 1) {
                tmp <<= 1;
                multiple <<= 1;
            }
            a -= tmp;
            quotient += multiple;
        }

        return (int) (sign == 1 ? quotient : -quotient);
    }
}
```

### Python

```python
class Solution:
    def divide(self, dividend: int, divisor: int) -> int:
        """
        在不使用乘除取模的情况下计算 dividend/divisor，向零截断。

        参数:
            dividend: 被除数
            divisor:  除数（非零）
        返回:
            商，若溢出返回 INT_MAX
        """
        INT_MAX = 2**31 - 1
        INT_MIN = -(2**31)

        if dividend == INT_MIN and divisor == -1:
            return INT_MAX

        sign = -1 if (dividend > 0) != (divisor > 0) else 1
        a, b = abs(dividend), abs(divisor)
        quotient = 0

        while a >= b:
            tmp, multiple = b, 1
            while a >= tmp << 1:
                tmp <<= 1
                multiple <<= 1
            a -= tmp
            quotient += multiple

        return sign * quotient
```

## 踩坑记录

- **INT_MIN 取绝对值溢出**：`abs(INT_MIN) = 2^31` 超出 int32 范围，Java 中必须用 `long` 存储，否则 `Math.abs(Integer.MIN_VALUE)` 返回负数。
- **内层 while 防溢出**：`tmp << 1` 可能溢出，条件改为 `a >= tmp << 1`（Go/Python 大整数无溢出，Java 用 long 也安全）。
- **符号判断**：用异或或比较两个符号是否相同，而不是相乘（乘法本身也可能溢出）。

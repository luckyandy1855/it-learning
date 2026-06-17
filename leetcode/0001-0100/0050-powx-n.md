# 0050. Pow(x, n)

---
编号: 50
题目: Pow(x, n)
难度: 中等
标签: [递归, 数学]
来源链接: https://leetcode.com/problems/powx-n/
---

## 题目描述

实现 `pow(x, n)`，计算 `x` 的 `n` 次幂（即 x^n）。

### Example 1

```text
Input: x = 2.00000, n = 10
Output: 1024.00000
```

### Example 2

```text
Input: x = 2.10000, n = 3
Output: 9.26100
```

### Example 3

```text
Input: x = 2.00000, n = -2
Output: 0.25000
Explanation: 2^(-2) = 1/(2^2) = 0.25
```

### 约束条件

- `-100.0 < x < 100.0`
- `-2^31 <= n <= 2^31-1`
- `n` 是整数。
- 结果范围在 `[-10^4, 10^4]` 内（题目保证）。

## 思路分析

### 突破口

快速幂（二进制指数）：利用 `x^n = (x^(n/2))^2`，将问题规模每次减半，O(log n) 时间。

### 思路拆解

1. **快速幂（递归）**：
   - `n` 为偶数：`pow(x, n) = pow(x, n/2)^2`。
   - `n` 为奇数：`pow(x, n) = x * pow(x, n-1)`。
   - `n < 0`：`pow(x, n) = pow(1/x, -n)`。

2. **快速幂（迭代）**：从 `n` 的二进制表示出发，逐位处理——若当前位为 1，则把当前的 `x` 乘进结果；每轮 `x = x^2`，n 右移一位，O(log n)。

3. **实现要点**：`n = INT_MIN` 时 `-n` 溢出，需用 long 存储。

### 示意图

```text
pow(2, 10)：

10 的二进制: 1010
  bit0=0: x=2,   result不乘,  x=4
  bit1=1: x=4,   result×4=4,  x=16
  bit2=0: x=16,  result不乘,  x=256
  bit3=1: x=256, result×256=1024

result = 1024 = 2^10 ✓
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 快速幂（递归） | O(log n) | O(log n) 递归栈 |
| 快速幂（迭代） | O(log n) | O(1) |

## 代码实现

### Go

```go
// myPow 计算 x 的 n 次幂，使用快速幂算法
// 参数：x 底数，n 指数（可为负数）
// 返回：x^n 的值
func myPow(x float64, n int) float64 {
    if n < 0 {
        x = 1 / x
        n = -n
    }

    result := 1.0
    for n > 0 {
        if n%2 == 1 {
            result *= x // n 为奇数，乘上当前 x
        }
        x *= x // x 平方，准备处理下一位
        n /= 2
    }
    return result
}
```

### Java

```java
class Solution {
    /**
     * 计算 x 的 n 次幂，使用快速幂算法。
     *
     * @param x 底数
     * @param n 指数（可为负数）
     * @return x^n 的值
     */
    public double myPow(double x, int n) {
        long exp = n; // 用 long 防止 INT_MIN 取负溢出
        if (exp < 0) {
            x = 1 / x;
            exp = -exp;
        }

        double result = 1.0;
        while (exp > 0) {
            if ((exp & 1) == 1) result *= x;
            x *= x;
            exp >>= 1;
        }
        return result;
    }
}
```

### Python

```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        """
        计算 x 的 n 次幂，使用快速幂算法。

        参数:
            x: 底数
            n: 指数（可为负数）
        返回:
            x^n 的值
        """
        if n < 0:
            x = 1 / x
            n = -n

        result = 1.0
        while n:
            if n & 1:  # n 为奇数
                result *= x
            x *= x
            n >>= 1

        return result
```

## 踩坑记录

- **`n = INT_MIN` 溢出**：Java 中 `int` 的 `INT_MIN = -2^31`，取负后 `2^31` 溢出 `int`。必须用 `long exp = n` 再取负，Go 中 `n = -n` 在 `int64` 系统下无问题，Python 整数无溢出。
- **先处理负数再快速幂**：将底数取倒数，指数取绝对值，统一处理为正指数，避免分支。
- **`n & 1` 判奇偶比 `n % 2` 更健壮**：位运算 `n & 1` 在 n 为负数时行为一致（Go/Java 中负数 `%` 符号与被除数相同），但统一转为正数后两者都可以。

# 0007. Reverse Integer

---
编号: 7
题目: Reverse Integer
难度: 中等
标签: [数学]
来源链接: https://leetcode.com/problems/reverse-integer/
---

## 题目描述

给定一个有符号 32 位整数 `x`，将其各位数字反转后返回。如果反转后的整数超出 32 位有符号整数范围 `[-2^31, 2^31 - 1]`，则返回 `0`。

题目保证：

- 不能使用 64 位整数（即不能存储反转中间值后再溢出判断）。实际上大多数语言实现时用 64 位做中间计算并在最后判断是否在 int32 范围内也是被接受的。

### Example 1

```text
Input: x = 123
Output: 321
```

### Example 2

```text
Input: x = -123
Output: -321
```

### Example 3

```text
Input: x = 120
Output: 21
Explanation: 末尾 0 反转后消失。
```

### 约束条件

- `-2^31 <= x <= 2^31 - 1`

## 思路分析

### 突破口

逐位取模反转：每次用 `x % 10` 得到末位，追加到结果；`x /= 10` 去掉末位。关键难点是**溢出检测**：在追加末位前判断当前结果是否会溢出 int32。

### 思路拆解

1. **字符串翻转**：转字符串、翻转、转回整数，简单但需处理负号和前导零。

2. **数学逐位翻转**：用取模和整除逐位提取并拼接，O(log x) 时间，O(1) 空间。

3. **溢出判断**：在 `res = res * 10 + digit` 之前检查：若 `res > INT_MAX/10`，乘 10 后必溢出；若 `res == INT_MAX/10` 且 `digit > 7`（INT_MAX 末位是 7），也会溢出。负数同理。

4. **实现要点**：Go/Java 中整除负数向零取整（`-123 / 10 = -12`），`%` 保留符号（`-123 % 10 = -3`），处理负数逻辑与正数一致，不需要额外取绝对值。

### 示意图

```text
x = 1534236469   INT_MAX = 2147483647

步骤：
res=0,  digit = 1534236469 % 10 = 9,  res = 0*10+9 = 9,    x=153423646
res=9,  digit = 153423646  % 10 = 6,  res = 9*10+6 = 96,   x=15342364
...
res=964,  ...
...
res=9646324351  → 已超过 INT_MAX=2147483647，在追加前检测到溢出 → 返回 0
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 逐位取模反转 | O(log x) | O(1) |

## 代码实现

### Go

```go
import "math"

// reverse 将 32 位整数各位反转，溢出返回 0
// 参数：x 有符号 32 位整数
// 返回：反转后的整数；若溢出则返回 0
func reverse(x int) int {
    res := 0
    for x != 0 {
        digit := x % 10 // Go 整除向零取整，负数取模保留符号
        x /= 10

        // 溢出检测：乘 10 前判断是否会越界 int32 范围
        if res > math.MaxInt32/10 || (res == math.MaxInt32/10 && digit > 7) {
            return 0
        }
        if res < math.MinInt32/10 || (res == math.MinInt32/10 && digit < -8) {
            return 0
        }

        res = res*10 + digit
    }
    return res
}
```

### Java

```java
class Solution {
    /**
     * 将 32 位整数各位反转，溢出返回 0。
     *
     * @param x 有符号 32 位整数
     * @return 反转后整数；若溢出则返回 0
     */
    public int reverse(int x) {
        int res = 0;
        while (x != 0) {
            int digit = x % 10; // Java % 保留被除数符号
            x /= 10;

            // 乘 10 前检测溢出（INT_MAX = 2147483647，末位 7）
            if (res > Integer.MAX_VALUE / 10 ||
               (res == Integer.MAX_VALUE / 10 && digit > 7)) return 0;
            if (res < Integer.MIN_VALUE / 10 ||
               (res == Integer.MIN_VALUE / 10 && digit < -8)) return 0;

            res = res * 10 + digit;
        }
        return res;
    }
}
```

### Python

```python
class Solution:
    def reverse(self, x: int) -> int:
        """
        将 32 位整数各位反转，溢出返回 0。

        参数:
            x: 有符号 32 位整数（Python int 不会溢出，需手动判断范围）
        返回:
            反转后整数；若超出 int32 范围则返回 0
        """
        INT_MAX = 2**31 - 1
        INT_MIN = -(2**31)

        sign = -1 if x < 0 else 1
        x_abs = abs(x)

        # 字符串翻转数字部分（Python 整数无溢出，最后统一判断）
        reversed_abs = int(str(x_abs)[::-1])
        result = sign * reversed_abs

        if result < INT_MIN or result > INT_MAX:
            return 0
        return result
```

## 踩坑记录

- **溢出要在乘法前检查**：不能先算 `res * 10 + digit`，再判断是否溢出——乘法本身就可能已经溢出了（特别是 Java/Go 中 int 是固定宽度的）。
- **负数取模行为**：Go/Java 中 `-123 % 10 = -3`（符号与被除数相同），而 Python 中 `-123 % 10 = 7`（符号与除数相同）。Go/Java 的行为使得负数逻辑与正数一致，不需要取绝对值。
- **末尾零消失**：`120` 反转后是 `021 = 21`，整数自然去掉前导零，无需特殊处理。

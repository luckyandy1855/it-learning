# 0008. String to Integer (atoi)

---
编号: 8
题目: String to Integer (atoi)
难度: 中等
标签: [字符串]
来源链接: https://leetcode.com/problems/string-to-integer-atoi/
---

## 题目描述

实现 `myAtoi(string s)` 函数，将字符串转换为 32 位有符号整数，行为与 C/C++ 标准库函数 `atoi` 一致。

转换规则：
1. 跳过前置空白字符（`' '`）。
2. 读取可选的符号字符 `'+'` 或 `'-'`。
3. 读取数字字符，直到遇到非数字字符或字符串结束。
4. 将读取到的数字转换为整数，忽略前导零。
5. 若结果超出 `[-2^31, 2^31 - 1]` 范围，截断到边界值（向上截断到 `2^31-1`，向下截断到 `-2^31`）。
6. 若第一个非空白字符不是数字或符号，返回 `0`。

### Example 1

```text
Input: s = "42"
Output: 42
```

### Example 2

```text
Input: s = "   -42"
Output: -42
Explanation: 跳过前置空格，读取 '-'，然后读取 "42"。
```

### Example 3

```text
Input: s = "4193 with words"
Output: 4193
Explanation: 读取 "4193" 后遇到空格停止。
```

### Example 4

```text
Input: s = "words and 987"
Output: 0
Explanation: 第一个非空白字符 'w' 不是数字或符号，返回 0。
```

### 约束条件

- `0 <= s.length <= 200`
- `s` 由英文字母、数字、空格、`'+'`、`'-'` 和 `'.'` 组成。

## 思路分析

### 突破口

按规则线性扫描字符串即可，没有算法技巧，关键是逐步处理各种边界情况：前导空格、符号、非数字停止、溢出截断。

### 思路拆解

1. **步骤一**：跳过前置空格（`while s[i] == ' '`）。
2. **步骤二**：读取符号（`+/-`），默认为正。
3. **步骤三**：逐位读取数字，累积到 `res`，遇到非数字立即停止。
4. **步骤四**：每步更新 `res` 前检测溢出，超界直接截断返回。

### 示意图

```text
s = "  -4193 with words"

指针 i=0:
  i=0: ' ' → 跳过
  i=1: ' ' → 跳过
  i=2: '-' → 符号=-1, i=3
  i=3: '4' → res=4,  i=4
  i=4: '1' → res=41, i=5
  i=5: '9' → res=419, i=6
  i=6: '3' → res=4193, i=7
  i=7: ' ' → 非数字，停止
结果: -1 * 4193 = -4193
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 线性扫描 | O(n) | O(1) |

## 代码实现

### Go

```go
import "math"

// myAtoi 将字符串按 atoi 规则转换为 32 位整数
// 参数：s 输入字符串
// 返回：转换后的 int32 范围内整数
func myAtoi(s string) int {
    i, n := 0, len(s)

    // 步骤1：跳过前置空格
    for i < n && s[i] == ' ' {
        i++
    }

    // 步骤2：读取符号
    sign := 1
    if i < n && (s[i] == '+' || s[i] == '-') {
        if s[i] == '-' {
            sign = -1
        }
        i++
    }

    // 步骤3：逐位读取数字
    res := 0
    for i < n && s[i] >= '0' && s[i] <= '9' {
        digit := int(s[i] - '0')

        // 溢出检测：乘 10 前判断
        if res > math.MaxInt32/10 || (res == math.MaxInt32/10 && digit > 7) {
            if sign == 1 {
                return math.MaxInt32
            }
            return math.MinInt32
        }

        res = res*10 + digit
        i++
    }

    return sign * res
}
```

### Java

```java
class Solution {
    /**
     * 将字符串按 atoi 规则转换为 32 位整数。
     *
     * @param s 输入字符串
     * @return 转换后的 int32 范围内整数
     */
    public int myAtoi(String s) {
        int i = 0, n = s.length();

        // 步骤1：跳过前置空格
        while (i < n && s.charAt(i) == ' ') i++;

        // 步骤2：读取符号
        int sign = 1;
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) {
            if (s.charAt(i) == '-') sign = -1;
            i++;
        }

        // 步骤3：逐位读取数字，溢出前截断
        int res = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            int digit = s.charAt(i) - '0';

            // 乘 10 前检测溢出
            if (res > Integer.MAX_VALUE / 10 ||
               (res == Integer.MAX_VALUE / 10 && digit > 7)) {
                return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }

            res = res * 10 + digit;
            i++;
        }

        return sign * res;
    }
}
```

### Python

```python
class Solution:
    def myAtoi(self, s: str) -> int:
        """
        将字符串按 atoi 规则转换为 32 位整数。

        参数:
            s: 输入字符串
        返回:
            转换后截断到 int32 范围的整数
        """
        INT_MAX = 2**31 - 1
        INT_MIN = -(2**31)

        i, n = 0, len(s)

        # 步骤1：跳过前置空格
        while i < n and s[i] == ' ':
            i += 1

        # 步骤2：读取符号
        sign = 1
        if i < n and s[i] in ('+', '-'):
            if s[i] == '-':
                sign = -1
            i += 1

        # 步骤3：逐位读取数字（Python 不溢出，最后统一截断）
        res = 0
        while i < n and s[i].isdigit():
            res = res * 10 + int(s[i])
            i += 1

        result = sign * res
        return max(INT_MIN, min(INT_MAX, result))
```

## 踩坑记录

- **前导空格只能在符号前跳过**：读到符号或数字后不能再跳空格（如 `"1 2"` 结果是 `1`，不是 `12`）。
- **`+ -` 符号最多只有一个**：`"+-12"` 结果是 `0`，读到 `+` 后移动指针，下一个 `-` 不是数字，停止读取。
- **溢出截断要在乘法前**：和第 7 题一样，需要在 `res * 10 + digit` 之前检测，而不是之后。正溢出返回 INT_MAX，负溢出返回 INT_MIN。

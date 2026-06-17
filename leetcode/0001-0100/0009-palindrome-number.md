# 0009. Palindrome Number

---
编号: 9
题目: Palindrome Number
难度: 简单
标签: [数学]
来源链接: https://leetcode.com/problems/palindrome-number/
---

## 题目描述

给定一个整数 `x`，判断它是否是**回文整数**（正着读和倒着读数字相同）。

题目保证：

- 不建议将整数转为字符串来解决（进阶要求）。

### Example 1

```text
Input: x = 121
Output: true
Explanation: 121 从左往右和从右往左都是 121。
```

### Example 2

```text
Input: x = -121
Output: false
Explanation: 从左往右是 -121，从右往左是 121-，不回文。
```

### Example 3

```text
Input: x = 10
Output: false
Explanation: 从右往左是 01，不回文。
```

### 约束条件

- `-2^31 <= x <= 2^31 - 1`

## 思路分析

### 突破口

负数和末位为 0 的正整数（排除 0 本身）一定不是回文。对于正整数，只需翻转**后半段数字**，与前半段比较，无需翻转整个数字，避免溢出。

### 思路拆解

1. **字符串解**：转字符串后判断是否等于其反转，O(n) 时间和空间，简单但不符合进阶要求。

2. **翻转全部数字**：数学逐位翻转，与第 7 题类似，但有溢出风险。

3. **只翻转后半段（推荐）**：不断从 `x` 末位取数追加到 `reversed`，直到 `x <= reversed`（说明后半段已和前半段等长）。最后比较 `x == reversed`（奇数位）或 `x == reversed/10`（偶数位，去掉中间数字）。

4. **实现要点**：提前排除负数（`x < 0`）和末位为 0 但非零的数（`x % 10 == 0 && x != 0`）。

### 示意图

```text
x = 1221

step1: x=1221, reversed=0
  digit=1, reversed=1, x=122
step2: x=122,  reversed=1
  digit=2, reversed=12, x=12
  此时 x(12) <= reversed(12)，停止

比较: x == reversed → 12 == 12 → true（偶数位，不需要去中间数）

x = 12321
step1: reversed=1, x=1232
step2: reversed=12, x=123
step3: x=123 > reversed=12，继续
  digit=3, reversed=123, x=12
  此时 x(12) <= reversed(123)，停止

比较（奇数位）: x == reversed/10 → 12 == 12 → true
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 翻转后半段 | O(log x) | O(1) |

## 代码实现

### Go

```go
// isPalindrome 判断整数是否是回文数（不转字符串）
// 参数：x 整数
// 返回：是否为回文整数
func isPalindrome(x int) bool {
    // 负数不是回文；末位为 0 且非零的数也不是（翻转后有前导零）
    if x < 0 || (x%10 == 0 && x != 0) {
        return false
    }

    reversed := 0
    // 只翻转后半段，直到后半段 >= 前半段
    for x > reversed {
        reversed = reversed*10 + x%10
        x /= 10
    }

    // 偶数位：x == reversed；奇数位：x == reversed/10（去掉中间数字）
    return x == reversed || x == reversed/10
}
```

### Java

```java
class Solution {
    /**
     * 判断整数是否是回文数（不转字符串）。
     *
     * @param x 整数
     * @return 是否为回文整数
     */
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;

        int reversed = 0;
        while (x > reversed) {
            reversed = reversed * 10 + x % 10;
            x /= 10;
        }

        return x == reversed || x == reversed / 10;
    }
}
```

### Python

```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        """
        判断整数是否是回文数（不转字符串）。

        参数:
            x: 整数
        返回:
            是否为回文整数
        """
        if x < 0 or (x % 10 == 0 and x != 0):
            return False

        reversed_half = 0
        while x > reversed_half:
            reversed_half = reversed_half * 10 + x % 10
            x //= 10

        return x == reversed_half or x == reversed_half // 10
```

## 踩坑记录

- **末位为 0 的非零数**：如 `10`，翻转后是 `01 = 1`，不等于 `10/10 = 1`... 等等，实际上 `10` 翻转后应为 `01`，有前导零，逻辑上不构成回文。需提前排除 `x % 10 == 0 && x != 0`。
- **只翻转后半段防止溢出**：翻转全部数字时若 x 很大可能溢出，只翻转一半不会超过原数。
- **奇数位长度的中间数字**：12321 翻转后半段得到 `reversed=123`，`x=12`，中间数字 `3` 在 `reversed` 里，用 `reversed/10 = 12` 与 `x` 比较消除它。

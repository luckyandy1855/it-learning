# 0091. Decode Ways

---
编号: 91
题目: Decode Ways
难度: 中等
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/decode-ways/
---

## 题目描述

一条消息由数字编码而来：`'A'` → `"1"`，`'B'` → `"2"`，…，`'Z'` → `"26"`。

给定只含数字的字符串 `s`，返回**解码方式的总数**。

### Example 1

```text
Input: s = "12"
Output: 2
Explanation: "12" 可解码为 "AB"(1,2) 或 "L"(12)
```

### Example 2

```text
Input: s = "226"
Output: 3
Explanation: "BZ"(2,26)、"VF"(22,6) 或 "BBF"(2,2,6)
```

### Example 3

```text
Input: s = "06"
Output: 0
Explanation: "06" 不能解码（0不能单独构成有效编码）
```

### 约束条件

- `1 <= s.length <= 100`
- `s` 仅含数字
- `s` 可能含前导零

## 思路分析

### 突破口

DP：`dp[i]` 表示字符串前 i 个字符的解码方式数。当前字符可以单独解码（1-9），或与前一字符合并解码（10-26）。

### 思路拆解

1. **单字符解码**：若 `s[i-1] != '0'`，`dp[i] += dp[i-1]`。

2. **双字符解码**：若前两位构成 `[10, 26]`（即 `s[i-2] == '1'` 或 `s[i-2] == '2' && s[i-1] <= '6'`），`dp[i] += dp[i-2]`。

3. **初始化**：`dp[0] = 1`（空字符串 1 种解码），`dp[1]` 由 s[0] 是否为 `'0'` 决定。

### 示意图

```text
s = "226"
dp[0]=1 (空字符串)
dp[1]: s[0]='2'≠'0' → dp[1]+=dp[0]=1 → dp[1]=1
dp[2]: s[1]='2'≠'0' → dp[2]+=dp[1]=1; s[0..1]="22"∈[10,26] → dp[2]+=dp[0]=1 → dp[2]=2
dp[3]: s[2]='6'≠'0' → dp[3]+=dp[2]=2; s[1..2]="26"∈[10,26] → dp[3]+=dp[1]=1 → dp[3]=3
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 一维 DP | O(n) | O(n) |
| 滚动变量 | O(n) | O(1) |

## 代码实现

### Go

```go
// numDecodings 返回字符串的解码方式总数
func numDecodings(s string) int {
    n := len(s)
    dp := make([]int, n+1)
    dp[0] = 1
    if s[0] != '0' {
        dp[1] = 1
    }

    for i := 2; i <= n; i++ {
        // 单字符解码
        if s[i-1] != '0' {
            dp[i] += dp[i-1]
        }
        // 双字符解码
        twoDigit := int(s[i-2]-'0')*10 + int(s[i-1]-'0')
        if twoDigit >= 10 && twoDigit <= 26 {
            dp[i] += dp[i-2]
        }
    }
    return dp[n]
}
```

### Java

```java
class Solution {
    /**
     * 返回字符串的解码方式总数（一维 DP）。
     */
    public int numDecodings(String s) {
        int n = s.length();
        int[] dp = new int[n + 1];
        dp[0] = 1;
        dp[1] = s.charAt(0) != '0' ? 1 : 0;

        for (int i = 2; i <= n; i++) {
            if (s.charAt(i - 1) != '0')
                dp[i] += dp[i - 1];
            int twoDigit = Integer.parseInt(s.substring(i - 2, i));
            if (twoDigit >= 10 && twoDigit <= 26)
                dp[i] += dp[i - 2];
        }
        return dp[n];
    }
}
```

### Python

```python
class Solution:
    def numDecodings(self, s: str) -> int:
        """
        返回字符串的解码方式总数（一维 DP）。
        """
        n = len(s)
        dp = [0] * (n + 1)
        dp[0] = 1
        dp[1] = 1 if s[0] != '0' else 0

        for i in range(2, n + 1):
            if s[i - 1] != '0':
                dp[i] += dp[i - 1]
            two_digit = int(s[i-2:i])
            if 10 <= two_digit <= 26:
                dp[i] += dp[i - 2]

        return dp[n]
```

## 踩坑记录

- **前导零的处理**：`"0"` 不是有效的单字符编码，若 `s[i-1] == '0'` 不能做单字符解码；`"01"` 不是有效的双字符编码（需 `twoDigit >= 10`，即第一位不为 0）。
- **`s = "30"` 的处理**：`'3'` 单字符可解码（`dp[i-1]`），`"30"` 不在 `[10, 26]` 范围内，双字符不可解码；但 `"0"` 单字符也不可解码，所以 `dp[2] = 0`，表示无法解码。
- **`dp[0] = 1` 的语义**：代表空字符串有 1 种解码方式（这是数学约定，使得 `dp[1]` 和 `dp[2]` 的转移可以统一处理）。

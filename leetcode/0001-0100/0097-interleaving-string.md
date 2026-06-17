# 0097. Interleaving String

---
编号: 97
题目: Interleaving String
难度: 中等
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/interleaving-string/
---

## 题目描述

给定字符串 `s1`、`s2`、`s3`，判断 `s3` 是否是 `s1` 和 `s2` 的**交错字符串**。

交错字符串：将 `s1` 和 `s2` 分别拆成若干非空子字符串，然后交替合并（保留各自的顺序），得到 `s3`。

### Example 1

```text
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
```

### Example 2

```text
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
Output: false
```

### 约束条件

- `0 <= s1.length, s2.length <= 100`
- `s3.length == s1.length + s2.length`

## 思路分析

### 突破口

DP：`dp[i][j]` 表示 `s1[0..i-1]` 和 `s2[0..j-1]` 能否交错组成 `s3[0..i+j-1]`。

### 思路拆解

1. **状态转移**：
   - 若 `s1[i-1] == s3[i+j-1]`，`dp[i][j] |= dp[i-1][j]`（从 s1 取一个字符）
   - 若 `s2[j-1] == s3[i+j-1]`，`dp[i][j] |= dp[i][j-1]`（从 s2 取一个字符）

2. **边界**：`dp[0][0] = true`；第一行 `dp[0][j]`：前 j 个字符全从 s2 取；第一列 `dp[i][0]`：前 i 个字符全从 s1 取。

3. **长度检查**：若 `len(s1)+len(s2) != len(s3)` 直接 false。

### 示意图

```text
s1="aab", s2="axy", s3="aaxaby"
    ""  a  a  x  y
""   T  T  F  F  F
a    T  T  T  F  F
a    F  T  T  T  F
b    F  F  T  T  T  ← dp[3][3]=true

dp[i][j]=T 表示 s1[:i] 和 s2[:j] 能交错成 s3[:i+j]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 二维 DP | O(m×n) | O(m×n) |
| 一维 DP（滚动） | O(m×n) | O(n) |

## 代码实现

### Go

```go
// isInterleave 判断 s3 是否是 s1 和 s2 的交错字符串
func isInterleave(s1 string, s2 string, s3 string) bool {
    m, n := len(s1), len(s2)
    if m+n != len(s3) {
        return false
    }

    dp := make([]bool, n+1)
    dp[0] = true

    // 初始化第一行（只用 s2）
    for j := 1; j <= n; j++ {
        dp[j] = dp[j-1] && s2[j-1] == s3[j-1]
    }

    for i := 1; i <= m; i++ {
        dp[0] = dp[0] && s1[i-1] == s3[i-1] // 第一列（只用 s1）
        for j := 1; j <= n; j++ {
            dp[j] = (dp[j] && s1[i-1] == s3[i+j-1]) ||
                    (dp[j-1] && s2[j-1] == s3[i+j-1])
        }
    }
    return dp[n]
}
```

### Java

```java
class Solution {
    /**
     * 判断 s3 是否是 s1 和 s2 的交错字符串（一维滚动 DP）。
     */
    public boolean isInterleave(String s1, String s2, String s3) {
        int m = s1.length(), n = s2.length();
        if (m + n != s3.length()) return false;

        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        for (int j = 1; j <= n; j++) dp[j] = dp[j - 1] && s2.charAt(j - 1) == s3.charAt(j - 1);

        for (int i = 1; i <= m; i++) {
            dp[0] = dp[0] && s1.charAt(i - 1) == s3.charAt(i - 1);
            for (int j = 1; j <= n; j++) {
                dp[j] = (dp[j] && s1.charAt(i - 1) == s3.charAt(i + j - 1)) ||
                         (dp[j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1));
            }
        }
        return dp[n];
    }
}
```

### Python

```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        """
        判断 s3 是否是 s1 和 s2 的交错字符串（一维滚动 DP）。
        """
        m, n = len(s1), len(s2)
        if m + n != len(s3):
            return False

        dp = [False] * (n + 1)
        dp[0] = True
        for j in range(1, n + 1):
            dp[j] = dp[j - 1] and s2[j - 1] == s3[j - 1]

        for i in range(1, m + 1):
            dp[0] = dp[0] and s1[i - 1] == s3[i - 1]
            for j in range(1, n + 1):
                dp[j] = (dp[j] and s1[i - 1] == s3[i + j - 1]) or \
                         (dp[j - 1] and s2[j - 1] == s3[i + j - 1])

        return dp[n]
```

## 踩坑记录

- **一维 DP 中 `dp[j]` 含义**：在更新第 i 行时，`dp[j]` 未更新前代表 `dp[i-1][j]`（上方），`dp[j-1]` 已更新代表 `dp[i][j-1]`（左方），这与二维 DP 的两个转移方向一一对应。
- **`s3` 的下标是 `i+j-1`**：`s1[:i]` 用了 i 个字符，`s2[:j]` 用了 j 个字符，组合后共 `i+j` 个字符，当前检查的是 `s3[i+j-1]`（0 索引）。
- **长度检查不可省**：`len(s1)+len(s2) != len(s3)` 直接返回 false，否则 DP 数组访问可能越界。

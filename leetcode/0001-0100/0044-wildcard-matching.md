# 0044. Wildcard Matching

---
编号: 44
题目: Wildcard Matching
难度: 困难
标签: [贪心, 递归, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/wildcard-matching/
---

## 题目描述

给定字符串 `s` 和模式 `p`，实现支持 `?` 和 `*` 的**通配符匹配**（覆盖整个字符串）：

- `?` 匹配任意单个字符。
- `*` 匹配任意序列（包括空序列）。

### Example 1

```text
Input: s = "aa", p = "a"
Output: false
```

### Example 2

```text
Input: s = "aa", p = "*"
Output: true
```

### Example 3

```text
Input: s = "cb", p = "?a"
Output: false
```

### 约束条件

- `0 <= s.length, p.length <= 2000`
- `s` 只含小写字母，`p` 只含小写字母、`?` 和 `*`。

## 思路分析

### 突破口

动态规划：`dp[i][j]` 表示 `s[0..i-1]` 能否被 `p[0..j-1]` 匹配。

### 思路拆解

1. **状态转移**：
   - `p[j-1] == '*'`：`dp[i][j] = dp[i][j-1]`（`*` 匹配空）OR `dp[i-1][j]`（`*` 匹配一个或多个字符）。
   - `p[j-1] == '?'` 或 `p[j-1] == s[i-1]`：`dp[i][j] = dp[i-1][j-1]`。
   - 否则：`dp[i][j] = false`。

2. **初始化**：`dp[0][0] = true`；`dp[0][j]` 为 true 当且仅当 `p[0..j-1]` 全为 `*`。

3. **与第 10 题的区别**：第 10 题的 `*` 需要与前一个字符配合，第 44 题的 `*` 独立匹配任意序列，转移更简单。

### 示意图

```text
s = "adceb", p = "*a*b"

dp 矩阵（行: s 前 i 个, 列: p 前 j 个）：

     ""  *  a  *  b
""   T   T  F  F  F
a    F   T  T  T  F
d    F   T  F  T  F
c    F   T  F  T  F
e    F   T  F  T  F
b    F   T  F  T  T  ← dp[5][4] = true
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 动态规划 | O(m×n) | O(m×n) |

## 代码实现

### Go

```go
// isMatch 用动态规划实现通配符匹配（支持 ? 和 *）
// 参数：s 待匹配字符串，p 通配符模式
// 返回：s 是否与 p 完全匹配
func isMatch(s string, p string) bool {
    m, n := len(s), len(p)
    // dp[i][j]: s 前 i 个字符能否被 p 前 j 个字符匹配
    dp := make([][]bool, m+1)
    for i := range dp {
        dp[i] = make([]bool, n+1)
    }
    dp[0][0] = true

    // 初始化：空串 s 匹配 p 前 j 个字符，需要 p 全为 *
    for j := 1; j <= n; j++ {
        if p[j-1] == '*' {
            dp[0][j] = dp[0][j-1]
        }
    }

    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if p[j-1] == '*' {
                dp[i][j] = dp[i][j-1] || dp[i-1][j] // 匹配空 or 匹配一个
            } else if p[j-1] == '?' || p[j-1] == s[i-1] {
                dp[i][j] = dp[i-1][j-1]
            }
        }
    }
    return dp[m][n]
}
```

### Java

```java
class Solution {
    /**
     * 用动态规划实现通配符匹配（支持 ? 和 *）。
     *
     * @param s 待匹配字符串
     * @param p 通配符模式
     * @return s 是否与 p 完全匹配
     */
    public boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[0][0] = true;

        for (int j = 1; j <= n; j++) {
            if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 1];
        }

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (p.charAt(j - 1) == '*') {
                    dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
                } else if (p.charAt(j - 1) == '?' || p.charAt(j - 1) == s.charAt(i - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
        return dp[m][n];
    }
}
```

### Python

```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        """
        用动态规划实现通配符匹配（支持 ? 和 *）。

        参数:
            s: 待匹配字符串
            p: 通配符模式
        返回:
            s 是否与 p 完全匹配
        """
        m, n = len(s), len(p)
        dp = [[False] * (n + 1) for _ in range(m + 1)]
        dp[0][0] = True

        for j in range(1, n + 1):
            if p[j - 1] == '*':
                dp[0][j] = dp[0][j - 1]

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if p[j - 1] == '*':
                    dp[i][j] = dp[i][j - 1] or dp[i - 1][j]
                elif p[j - 1] in ('?', s[i - 1]):
                    dp[i][j] = dp[i - 1][j - 1]

        return dp[m][n]
```

## 踩坑记录

- **与第 10 题的 `*` 不同**：第 10 题的 `a*` 匹配零个或多个 `a`，`*` 依赖前一字符；第 44 题的 `*` 独立匹配任意序列，转移为 `dp[i][j-1] || dp[i-1][j]`（不需要看 `p[j-2]`）。
- **`*` 匹配多个字符的转移是 `dp[i-1][j]`**：`j` 不变，因为 `*` 可以继续匹配更多字符。
- **空字符串初始化**：`dp[0][j] = dp[0][j-1]` 当 `p[j-1]='*'`，允许连续多个 `*` 匹配空串（`"***"` 匹配 `""`）。

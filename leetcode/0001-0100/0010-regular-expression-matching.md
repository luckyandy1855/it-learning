# 0010. Regular Expression Matching

---
编号: 10
题目: Regular Expression Matching
难度: 困难
标签: [递归, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/regular-expression-matching/
---

## 题目描述

给定字符串 `s` 和模式 `p`，实现支持 `.` 和 `*` 的**正则表达式匹配**：

- `.` 匹配任意单个字符。
- `*` 匹配零个或多个前面的元素。

匹配要求覆盖整个字符串（不是部分匹配）。

题目保证：

- `p` 是有效的模式：`*` 不会是 `p` 的第一个字符，且 `*` 前一定有字符。

### Example 1

```text
Input: s = "aa", p = "a"
Output: false
Explanation: "a" 只能匹配一个 'a'，无法匹配整个 "aa"。
```

### Example 2

```text
Input: s = "aa", p = "a*"
Output: true
Explanation: "a*" 表示零个或多个 'a'，可以匹配 "aa"。
```

### Example 3

```text
Input: s = "ab", p = ".*"
Output: true
Explanation: ".*" 匹配任意字符串。
```

### 约束条件

- `1 <= s.length <= 20`
- `1 <= p.length <= 30`
- `s` 只含小写字母。
- `p` 只含小写字母、`.` 和 `*`。
- `p` 中每个 `*` 前都有一个合法字符。

## 思路分析

### 突破口

`*` 使匹配次数不确定，天然适合动态规划。`dp[i][j]` 表示 `s[0..i-1]` 能否被 `p[0..j-1]` 匹配，最终答案是 `dp[m][n]`。

### 思路拆解

1. **递归（暴力）**：对每个位置分情况递归，子问题大量重叠，无记忆化时指数级。

2. **记忆化递归**：加 memo 避免重复计算，等价于 DP。

3. **动态规划**：`dp[i][j]` 含义：`s` 的前 `i` 个字符能否匹配 `p` 的前 `j` 个字符。
   - 若 `p[j-1]` 是普通字符或 `.`：`dp[i][j] = dp[i-1][j-1] && match(s[i-1], p[j-1])`。
   - 若 `p[j-1]` 是 `*`：两种情况取 OR：
     - `*` 匹配零次：`dp[i][j-2]`（跳过 `p[j-2]*`）。
     - `*` 匹配一次以上：`dp[i-1][j] && match(s[i-1], p[j-2])`。

4. **初始化**：`dp[0][0] = true`；`dp[0][j]` 仅当 `p[j-1] = '*'` 时可能为 true（`dp[0][j] = dp[0][j-2]`）。

### 示意图

```text
s = "aab", p = "c*a*b"

dp 矩阵（行: s 的前 i 个, 列: p 的前 j 个）：
     ""  c  *  a  *  b
""   T   F  T  F  T  F
a    F   F  F  T  T  F
a    F   F  F  F  T  F
b    F   F  F  F  F  T  ← dp[3][5] = true

"c*" 匹配零次 'c'，"a*" 匹配两次 'a'，"b" 匹配 'b'。
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 动态规划 | O(m×n) | O(m×n) |

## 代码实现

### Go

```go
// isMatch 用动态规划实现支持 '.' 和 '*' 的正则匹配
// 参数：s 待匹配字符串，p 正则模式
// 返回：s 是否完全匹配 p
func isMatch(s string, p string) bool {
    m, n := len(s), len(p)
    // dp[i][j]: s 前 i 个字符能否被 p 前 j 个字符匹配
    dp := make([][]bool, m+1)
    for i := range dp {
        dp[i] = make([]bool, n+1)
    }
    dp[0][0] = true // 空串匹配空模式

    // 初始化：空串可能匹配 "x*y*z*..." 形式的模式
    for j := 2; j <= n; j++ {
        if p[j-1] == '*' {
            dp[0][j] = dp[0][j-2] // '*' 匹配零次前面的字符
        }
    }

    match := func(si, pi int) bool {
        return p[pi-1] == '.' || s[si-1] == p[pi-1]
    }

    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if p[j-1] == '*' {
                // '*' 匹配零次：跳过 "x*"
                dp[i][j] = dp[i][j-2]
                // '*' 匹配一次或多次：要求当前 s[i] 能被 p[j-1] 的前一个字符匹配
                if match(i, j-1) {
                    dp[i][j] = dp[i][j] || dp[i-1][j]
                }
            } else {
                // 普通字符或 '.'：当前字符必须匹配
                dp[i][j] = dp[i-1][j-1] && match(i, j)
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
     * 用动态规划实现支持 '.' 和 '*' 的正则匹配。
     *
     * @param s 待匹配字符串
     * @param p 正则模式
     * @return s 是否完全匹配 p
     */
    public boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[0][0] = true;

        // 空串匹配 "x*y*..." 的初始化
        for (int j = 2; j <= n; j++) {
            if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];
        }

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (p.charAt(j - 1) == '*') {
                    dp[i][j] = dp[i][j - 2]; // '*' 匹配零次
                    if (p.charAt(j - 2) == '.' || p.charAt(j - 2) == s.charAt(i - 1)) {
                        dp[i][j] |= dp[i - 1][j]; // '*' 匹配多次
                    }
                } else if (p.charAt(j - 1) == '.' || p.charAt(j - 1) == s.charAt(i - 1)) {
                    dp[i][j] = dp[i - 1][j - 1]; // 普通字符或 '.'
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
        用动态规划实现支持 '.' 和 '*' 的正则匹配。

        参数:
            s: 待匹配字符串
            p: 正则模式
        返回:
            s 是否完全匹配 p
        """
        m, n = len(s), len(p)
        # dp[i][j]: s[:i] 能否被 p[:j] 匹配
        dp = [[False] * (n + 1) for _ in range(m + 1)]
        dp[0][0] = True

        # 空串初始化：可能匹配 "a*b*c*..."
        for j in range(2, n + 1):
            if p[j - 1] == '*':
                dp[0][j] = dp[0][j - 2]

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if p[j - 1] == '*':
                    dp[i][j] = dp[i][j - 2]  # '*' 匹配零次
                    if p[j - 2] in ('.', s[i - 1]):
                        dp[i][j] = dp[i][j] or dp[i - 1][j]  # '*' 匹配多次
                elif p[j - 1] in ('.', s[i - 1]):
                    dp[i][j] = dp[i - 1][j - 1]

        return dp[m][n]
```

## 踩坑记录

- **`*` 匹配零次的初始化**：`dp[0][j]`（空串匹配模式前 j 个字符）只在 `p[j-1]=='*'` 时可能为 true，值为 `dp[0][j-2]`。漏掉这一步会导致 `s=""`, `p="a*"` 返回 false。
- **`*` 对应的是前一个字符**：`p[j-1]='*'` 时，匹配的字符是 `p[j-2]`，不是 `p[j-1]` 自己。代码中要访问 `p[j-2]` 而非 `p[j-1]`。
- **`*` 匹配多次的转移方向**：`dp[i-1][j]`（不是 `dp[i-1][j-2]`），因为 `*` 还可以继续匹配更多字符，`j` 保持不变。

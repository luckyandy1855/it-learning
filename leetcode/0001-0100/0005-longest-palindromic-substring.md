# 0005. Longest Palindromic Substring

---
编号: 5
题目: Longest Palindromic Substring
难度: 中等
标签: [双指针, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/longest-palindromic-substring/
---

## 题目描述

给定字符串 `s`，返回其中**最长的回文子串**。

回文串是指正读和反读都相同的字符串（如 `"aba"`、`"abba"`）。

题目保证：

- 若存在多个等长最长回文子串，返回任意一个即可。

### Example 1

```text
Input: s = "babad"
Output: "bab"
Explanation: "aba" 也是有效答案。
```

### Example 2

```text
Input: s = "cbbd"
Output: "bb"
```

### 约束条件

- `1 <= s.length <= 1000`
- `s` 仅由英文字母和数字组成。

## 思路分析

### 突破口

回文串有中心对称性。枚举每个字符（或字符间隙）作为中心，向外扩展验证，O(n²) 时间，O(1) 空间，比动态规划更简洁。

### 思路拆解

1. **暴力解**：枚举所有子串起点和终点，逐一判断是否回文，O(n³)，太慢。

2. **DP 解**：`dp[i][j]` 表示 `s[i..j]` 是否是回文串，状态转移 `dp[i][j] = (s[i]==s[j]) && dp[i+1][j-1]`，O(n²) 时间和空间。

3. **中心扩展（推荐）**：回文有两种形态——奇数长度（中心是一个字符）和偶数长度（中心是两个相邻字符）。对每个中心向外扩展，记录最长结果，O(n²) 时间，O(1) 空间。

4. **实现要点**：分别以每个字符和每对相邻字符为中心扩展，两次调用扩展函数，取最长者。

### 示意图

```text
s = "cbbd"

以每个字符为中心（奇数回文）：
  中心 c: 只有 "c"，长度 1
  中心 b(i=1): 向外: s[0]='c' != s[2]='b'，停止，"b" 长度 1
  中心 b(i=2): 向外: s[1]='b' != s[3]='d'，停止，"b" 长度 1
  中心 d: 只有 "d"，长度 1

以每对相邻字符为中心（偶数回文）：
  中心 (c,b): 'c' != 'b'，停止，长度 0
  中心 (b,b): 匹配！向外 s[0]='c' != s[3]='d'，停止，"bb" 长度 2  ← 最长
  中心 (b,d): 'b' != 'd'，停止，长度 0

最长回文子串: "bb"
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 暴力枚举 | O(n³) | O(1) |
| 动态规划 | O(n²) | O(n²) |
| 中心扩展 | O(n²) | O(1) |

## 代码实现

### Go

```go
// longestPalindrome 用中心扩展法找最长回文子串
// 参数：s 输入字符串
// 返回：最长回文子串
func longestPalindrome(s string) string {
    if len(s) < 2 {
        return s
    }

    start, maxLen := 0, 1

    // expand 以 l,r 为初始边界向外扩展，返回回文的起始位置和长度
    expand := func(l, r int) {
        for l >= 0 && r < len(s) && s[l] == s[r] {
            l--
            r++
        }
        // 扩展结束后，合法回文范围是 [l+1, r-1]
        if r-l-1 > maxLen {
            maxLen = r - l - 1
            start = l + 1
        }
    }

    for i := 0; i < len(s); i++ {
        expand(i, i)   // 奇数长度回文，中心为单个字符
        expand(i, i+1) // 偶数长度回文，中心为两个相邻字符
    }

    return s[start : start+maxLen]
}
```

### Java

```java
class Solution {
    private int start = 0, maxLen = 1;

    /**
     * 用中心扩展法找最长回文子串。
     *
     * @param s 输入字符串
     * @return 最长回文子串
     */
    public String longestPalindrome(String s) {
        if (s.length() < 2) return s;

        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);     // 奇数长度
            expand(s, i, i + 1); // 偶数长度
        }
        return s.substring(start, start + maxLen);
    }

    // 以 l, r 为初始边界向外扩展
    private void expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            l--;
            r++;
        }
        // 扩展结束后，合法回文范围是 [l+1, r-1]，长度为 r-l-1
        if (r - l - 1 > maxLen) {
            maxLen = r - l - 1;
            start = l + 1;
        }
    }
}
```

### Python

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        用中心扩展法找最长回文子串。

        参数:
            s: 输入字符串
        返回:
            最长回文子串
        """
        if len(s) < 2:
            return s

        start, max_len = 0, 1

        def expand(l: int, r: int) -> None:
            nonlocal start, max_len
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1
                r += 1
            # 扩展结束后合法回文为 s[l+1:r]，长度为 r-l-1
            if r - l - 1 > max_len:
                max_len = r - l - 1
                start = l + 1

        for i in range(len(s)):
            expand(i, i)      # 奇数长度：以 s[i] 为中心
            expand(i, i + 1)  # 偶数长度：以 s[i] 和 s[i+1] 之间为中心

        return s[start:start + max_len]
```

## 踩坑记录

- **奇偶两种中心**：只枚举单字符中心会漏掉所有偶数长度回文（如 `"bb"`），必须同时处理两种情况。
- **扩展后边界已越过**：扩展结束时 `l` 和 `r` 指向的字符不匹配（或越界），合法范围是 `[l+1, r-1]`，长度是 `r-l-1`，容易用错为 `r-l+1`。
- **单字符或空字符串**：长度 0 或 1 时直接返回 `s`，不需要进入扩展逻辑。

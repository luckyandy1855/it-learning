# 0072. Edit Distance

---
编号: 72
题目: Edit Distance
难度: 中等
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/edit-distance/
---

## 题目描述

给定两个字符串 `word1` 和 `word2`，返回将 `word1` 转换为 `word2` 所需的**最少编辑次数**（Levenshtein 距离）。

允许的操作：
- **插入**一个字符
- **删除**一个字符
- **替换**一个字符

### Example 1

```text
Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation: horse → rorse（替换h→r）→ rose（删除r）→ ros（删除e）
```

### Example 2

```text
Input: word1 = "intention", word2 = "execution"
Output: 5
```

### 约束条件

- `0 <= word1.length, word2.length <= 500`
- `word1` 和 `word2` 由小写英文字母组成

## 思路分析

### 突破口

经典 DP：`dp[i][j]` 表示将 `word1[0..i-1]` 转换为 `word2[0..j-1]` 的最小编辑次数。

### 思路拆解

1. **边界**：`dp[i][0] = i`（删除 i 次），`dp[0][j] = j`（插入 j 次）。

2. **转移**：
   - 若 `word1[i-1] == word2[j-1]`：`dp[i][j] = dp[i-1][j-1]`（无需操作）。
   - 否则：`dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])`，三项分别对应替换、删除、插入。

3. **空间优化**：可用一维数组 + 临时变量滚动，O(n) 空间。

### 示意图

```text
word1="horse", word2="ros"
dp 表（6×4）：
    ""  r  o  s
"" [ 0  1  2  3]
h  [ 1  1  2  3]
o  [ 2  2  1  2]
r  [ 3  2  2  2]
s  [ 4  3  3  2]
e  [ 5  4  4  3]

dp[5][3] = 3
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 二维 DP | O(m×n) | O(m×n) |
| 一维滚动 | O(m×n) | O(n) |

## 代码实现

### Go

```go
// minDistance 返回将 word1 转换为 word2 的最少编辑次数
func minDistance(word1 string, word2 string) int {
    m, n := len(word1), len(word2)
    dp := make([]int, n+1)

    for j := 0; j <= n; j++ {
        dp[j] = j // dp[0][j] = j
    }

    for i := 1; i <= m; i++ {
        prev := dp[0] // 保存 dp[i-1][j-1]
        dp[0] = i     // dp[i][0] = i
        for j := 1; j <= n; j++ {
            temp := dp[j]
            if word1[i-1] == word2[j-1] {
                dp[j] = prev // 字符相同，无需操作
            } else {
                dp[j] = 1 + min3(prev, dp[j], dp[j-1]) // 替换、删除、插入
            }
            prev = temp
        }
    }
    return dp[n]
}

func min3(a, b, c int) int {
    if a < b { if a < c { return a }; return c }
    if b < c { return b }
    return c
}
```

### Java

```java
class Solution {
    /**
     * 返回将 word1 转换为 word2 的最少编辑次数（一维滚动 DP）。
     */
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[] dp = new int[n + 1];

        for (int j = 0; j <= n; j++) dp[j] = j;

        for (int i = 1; i <= m; i++) {
            int prev = dp[0];
            dp[0] = i;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[j] = prev;
                } else {
                    dp[j] = 1 + Math.min(prev, Math.min(dp[j], dp[j - 1]));
                }
                prev = temp;
            }
        }
        return dp[n];
    }
}
```

### Python

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        """
        返回将 word1 转换为 word2 的最少编辑次数（一维滚动 DP）。
        """
        m, n = len(word1), len(word2)
        dp = list(range(n + 1))  # dp[j] = j

        for i in range(1, m + 1):
            prev = dp[0]
            dp[0] = i
            for j in range(1, n + 1):
                temp = dp[j]
                if word1[i - 1] == word2[j - 1]:
                    dp[j] = prev
                else:
                    dp[j] = 1 + min(prev, dp[j], dp[j - 1])
                prev = temp

        return dp[n]
```

## 踩坑记录

- **一维滚动 DP 的 `prev` 变量**：`dp[j]` 在更新前保存的是 `dp[i-1][j]`，而 `prev` 是 `dp[i-1][j-1]`——内层循环开始时先保存 `dp[j]` 到 `prev`，再更新 `dp[j]`；此时 `dp[j-1]` 是已更新的 `dp[i][j-1]`（插入操作），`dp[j]` 未更新时是 `dp[i-1][j]`（删除操作），`prev` 是 `dp[i-1][j-1]`（替换操作）。
- **三种操作语义**：`dp[i-1][j-1]` 替换，`dp[i-1][j]` 删除 word1 中第 i 个字符，`dp[i][j-1]` 在 word1 中插入 word2 中第 j 个字符。
- **空字符串边界**：`dp[i][0] = i` 表示从非空串 word1 转换为空串需 i 次删除；`dp[0][j] = j` 表示从空串插入 j 个字符变为 word2。

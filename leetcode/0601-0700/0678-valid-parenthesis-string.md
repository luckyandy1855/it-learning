# 0678. Valid Parenthesis String

---
编号: 678
题目: Valid Parenthesis String
难度: 中等
标签: [栈, 贪心, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/valid-parenthesis-string/
---

## 题目描述

给你一个只包含三种字符的字符串，支持的字符类型分别是 `'('`、`')'` 和 `'*'`。请你检验这个字符串是否为有效字符串，如果是 **有效** 字符串返回 `true` 。

**有效** 字符串符合如下规则：

- 任何左括号 `'('` 必须有相应的右括号 `')'`。

- 任何右括号 `')'` 必须有相应的左括号 `'('` 。

- 左括号 `'('` 必须在对应的右括号之前 `')'`。

- `'*'` 可以被视为单个右括号 `')'` ，或单个左括号 `'('` ，或一个空字符串 `""`。

示例 1：

```text
输入：s = "()"
输出：true
```

示例 2：

```text
输入：s = "(*)"
输出：true
```

示例 3：

```text
输入：s = "(*))"
输出：true
```

**提示：**

- `1 <= s.length <= 100`

- `s[i]` 为 `'('`、`')'` 或 `'*'`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 贪心, 字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

定义 $dp[i][j]$ 表示字符串 $s$ 中下标范围 $[i..j]$ 内的子串是否为有效括号字符串。答案为 $dp[0][n - 1]$。

子串长度为 $1$ 时，如果字符 $s[i]$ 为 `*`，则 $dp[i][i]$ 为 `true`，否则为 `false`。

子串长度大于 $1$ 时，如果满足下面任意一种情况，则 $dp[i][j]$ 为 `true`：

- 子串 $s[i..j]$ 的左边界为 `(` 或 `*`，且右边界为 `*` 或 `)`，且 $s[i+1..j-1]$ 为有效括号字符串；
- 子串 $s[i..j]$ 中的任意下标 $k$，如果 $s[i..k]$ 为有效括号字符串，且 $s[k+1..j]$ 为有效括号字符串，则 $s[i..j]$ 为有效括号字符串。

时间复杂度 $O(n^3)$，空间复杂度 $O(n^2)$。其中 $n$ 为字符串 `s` 的长度。

### 示意图

```text
输入/状态  ->  按规则更新候选状态  ->  得到答案
   |                 |                    |
  边界             不变量               返回值
```

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 参考解法 | 见「参考解法要点」 | 见「参考解法要点」 |

---

## 代码实现

### Go

```go
// Valid Parenthesis String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func checkValidString(s string) bool {
	n := len(s)
	dp := make([][]bool, n)
	for i := range dp {
		dp[i] = make([]bool, n)
		dp[i][i] = s[i] == '*'
	}
	for i := n - 2; i >= 0; i-- {
		for j := i + 1; j < n; j++ {
			a, b := s[i], s[j]
			dp[i][j] = (a == '(' || a == '*') && (b == '*' || b == ')') && (i+1 == j || dp[i+1][j-1])
			for k := i; k < j && !dp[i][j]; k++ {
				dp[i][j] = dp[i][k] && dp[k+1][j]
			}
		}
	}
	return dp[0][n-1]
}
```

### Java

```java
// Valid Parenthesis String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean checkValidString(String s) {
        int n = s.length();
        boolean[][] dp = new boolean[n][n];
        for (int i = 0; i < n; ++i) {
            dp[i][i] = s.charAt(i) == '*';
        }
        for (int i = n - 2; i >= 0; --i) {
            for (int j = i + 1; j < n; ++j) {
                char a = s.charAt(i), b = s.charAt(j);
                dp[i][j] = (a == '(' || a == '*') && (b == '*' || b == ')')
                    && (i + 1 == j || dp[i + 1][j - 1]);
                for (int k = i; k < j && !dp[i][j]; ++k) {
                    dp[i][j] = dp[i][k] && dp[k + 1][j];
                }
            }
        }
        return dp[0][n - 1];
    }
}
```

### Python

```python
# Valid Parenthesis String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def checkValidString(self, s: str) -> bool:
        n = len(s)
        dp = [[False] * n for _ in range(n)]
        for i, c in enumerate(s):
            dp[i][i] = c == '*'
        for i in range(n - 2, -1, -1):
            for j in range(i + 1, n):
                dp[i][j] = (
                    s[i] in '(*' and s[j] in '*)' and (i + 1 == j or dp[i + 1][j - 1])
                )
                dp[i][j] = dp[i][j] or any(
                    dp[i][k] and dp[k + 1][j] for k in range(i, j)
                )
        return dp[0][-1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

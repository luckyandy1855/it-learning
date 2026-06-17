# 1216. Valid Palindrome III

---
编号: 1216
题目: Valid Palindrome III
难度: 困难
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/valid-palindrome-iii/
---

## 题目描述

给出一个字符串 `s` 和一个整数 `k`，若这个字符串是一个「k **回文** 」，则返回 `true` 。

如果可以通过从字符串中删去最多 `k` 个字符将其转换为回文，那么这个字符串就是一个「**k** **回文** 」。

**示例 1：**

```text
输入：s = "abcdeca", k = 2
输出：true
解释：删去字符 “b” 和 “e”。
```

**示例 2:**

```text
输入：s = "abbababa", k = 1
输出：true
```

**提示：**

- `1 <= s.length <= 1000`

- `s` 中只含有小写英文字母

- `1 <= k <= s.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目要求删去最多 $k$ 个字符，使得剩余的字符串是回文串。可以转换为求最长回文子序列的问题。

我们定义 $f[i][j]$ 表示字符串 $s$ 中下标范围 $[i, j]$ 内的最长回文子序列的长度。初始时 $f[i][i] = 1$，即每个单独的字符都是一个回文子序列。

当 $s[i] = s[j]$ 时，有 $f[i][j] = f[i + 1][j - 1] + 2$，即去掉 $s[i]$ 和 $s[j]$ 后，剩余的字符串的最长回文子序列长度加 $2$。

当 $s[i] \neq s[j]$ 时，有 $f[i][j] = \max(f[i + 1][j], f[i][j - 1])$，即去掉 $s[i]$ 或 $s[j]$ 后，剩余的字符串的最长回文子序列长度。

然后是否存在 $f[i][j] + k \geq n$，如果存在，说明可以通过删去 $k$ 个字符，使得剩余的字符串是回文串。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 为字符串 $s$ 的长度。

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
// Valid Palindrome III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isValidPalindrome(s string, k int) bool {
	n := len(s)
	f := make([][]int, n)
	for i := range f {
		f[i] = make([]int, n)
		f[i][i] = 1
	}
	for i := n - 2; i >= 0; i-- {
		for j := i + 1; j < n; j++ {
			if s[i] == s[j] {
				f[i][j] = f[i+1][j-1] + 2
			} else {
				f[i][j] = max(f[i+1][j], f[i][j-1])
			}
			if f[i][j]+k >= n {
				return true
			}
		}
	}
	return false
}
```

### Java

```java
// Valid Palindrome III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isValidPalindrome(String s, int k) {
        int n = s.length();
        int[][] f = new int[n][n];
        for (int i = 0; i < n; ++i) {
            f[i][i] = 1;
        }
        for (int i = n - 2; i >= 0; --i) {
            for (int j = i + 1; j < n; ++j) {
                if (s.charAt(i) == s.charAt(j)) {
                    f[i][j] = f[i + 1][j - 1] + 2;
                } else {
                    f[i][j] = Math.max(f[i + 1][j], f[i][j - 1]);
                }
                if (f[i][j] + k >= n) {
                    return true;
                }
            }
        }
        return false;
    }
}
```

### Python

```python
# Valid Palindrome III：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isValidPalindrome(self, s: str, k: int) -> bool:
        n = len(s)
        f = [[0] * n for _ in range(n)]
        for i in range(n):
            f[i][i] = 1
        for i in range(n - 2, -1, -1):
            for j in range(i + 1, n):
                if s[i] == s[j]:
                    f[i][j] = f[i + 1][j - 1] + 2
                else:
                    f[i][j] = max(f[i + 1][j], f[i][j - 1])
                if f[i][j] + k >= n:
                    return True
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

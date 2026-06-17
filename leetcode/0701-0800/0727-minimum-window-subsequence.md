# 0727. Minimum Window Subsequence

---
编号: 727
题目: Minimum Window Subsequence
难度: 困难
标签: [字符串, 动态规划, 滑动窗口]
来源链接: https://leetcode.com/problems/minimum-window-subsequence/
---

## 题目描述

给定字符串 `s1` 和 `s2`，找出 `s1` 中最短的连续 **子串**，使得 `s2` 是该子串的 **子序列** 。

如果 `s1` 中没有窗口可以包含 `s2` 中的所有字符，返回空字符串 `""`。如果有不止一个最短长度的窗口，返回 **开始位置最靠左** 的那个。

**示例 1：**

```text
输入：
s1 = "abcdebdde", s2 = "bde"
输出："bcde"
解释：
"bcde" 是答案，因为它在相同长度的字符串 "bdde" 出现之前。
"deb" 不是一个更短的答案，因为在窗口中必须按顺序出现 T 中的元素。
```

示例 2：

```text
输入：s1 = "jmeqksfrsdcmsiwvaovztaqenprpvnbstl", s2 = "u"
输出：""
```

**提示：**

- `1 <= s1.length <= 2 * 10^4`

- `1 <= s2.length <= 100`

- `s1` 和 `s2` 只包含小写英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 动态规划, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示字符串 $\textit{s1}$ 的前 $i$ 个字符包含字符串 $\textit{s2}$ 的前 $j$ 个字符时的最短子串的起始位置，如果不存在则为 $0$。

我们可以得到状态转移方程：


f[i][j] = \begin{cases}
i, & j = 1 \textit{ and } s1[i-1] = s2[j] \\
f[i - 1][j - 1], & j > 1 \textit{ and } s1[i-1] = s2[j-1] \\
f[i - 1][j], & s1[i-1] \ne s2[j-1]
\end{cases}


接下来我们只需要遍历 $\textit{s1}$，如果 $f[i][n] \gt 0$，则更新最短子串的起始位置和长度。最后返回最短子串即可。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别为字符串 $\textit{s1}$ 和 $\textit{s2}$ 的长度。

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
// Minimum Window Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minWindow(s1 string, s2 string) string {
	m, n := len(s1), len(s2)
	f := make([][]int, m+1)
	for i := range f {
		f[i] = make([]int, n+1)
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if s1[i-1] == s2[j-1] {
				if j == 1 {
					f[i][j] = i
				} else {
					f[i][j] = f[i-1][j-1]
				}
			} else {
				f[i][j] = f[i-1][j]
			}
		}
	}
	p, k := 0, m+1
	for i := 1; i <= m; i++ {
		if s1[i-1] == s2[n-1] && f[i][n] > 0 {
			j := f[i][n] - 1
			if i-j < k {
				k = i - j
				p = j
			}
		}
	}
	if k > m {
		return ""
	}
	return s1[p : p+k]
}
```

### Java

```java
// Minimum Window Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String minWindow(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[][] f = new int[m + 1][n + 1];
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    f[i][j] = j == 1 ? i : f[i - 1][j - 1];
                } else {
                    f[i][j] = f[i - 1][j];
                }
            }
        }
        int p = 0, k = m + 1;
        for (int i = 1; i <= m; ++i) {
            if (s1.charAt(i - 1) == s2.charAt(n - 1) && f[i][n] > 0) {
                int j = f[i][n] - 1;
                if (i - j < k) {
                    k = i - j;
                    p = j;
                }
            }
        }
        return k > m ? "" : s1.substring(p, p + k);
    }
}
```

### Python

```python
# Minimum Window Subsequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minWindow(self, s1: str, s2: str) -> str:
        m, n = len(s1), len(s2)
        f = [[0] * (n + 1) for _ in range(m + 1)]
        for i, a in enumerate(s1, 1):
            for j, b in enumerate(s2, 1):
                if a == b:
                    f[i][j] = i if j == 1 else f[i - 1][j - 1]
                else:
                    f[i][j] = f[i - 1][j]
        p, k = 0, m + 1
        for i, a in enumerate(s1, 1):
            if a == s2[n - 1] and f[i][n]:
                j = f[i][n] - 1
                if i - j < k:
                    k = i - j
                    p = j
        return "" if k > m else s1[p : p + k]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

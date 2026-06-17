# 1092. Shortest Common Supersequence

---
编号: 1092
题目: Shortest Common Supersequence
难度: 困难
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/shortest-common-supersequence/
---

## 题目描述

给你两个字符串 `str1` 和 `str2`，返回同时以 `str1` 和 `str2` 作为 **子序列** 的最短字符串。如果答案不止一个，则可以返回满足条件的 **任意一个** 答案。

如果从字符串 `t` 中删除一些字符（也可能不删除），可以得到字符串 `s` ，那么 `s` 就是 t 的一个子序列。

**示例 1：**

```text
输入：str1 = "abac", str2 = "cab"
输出："cabac"
解释：
str1 = "abac" 是 "cabac" 的一个子串，因为我们可以删去 "cabac" 的第一个 "c"得到 "abac"。
str2 = "cab" 是 "cabac" 的一个子串，因为我们可以删去 "cabac" 末尾的 "ac" 得到 "cab"。
最终我们给出的答案是满足上述属性的最短字符串。
```

示例 2：

```text
输入：str1 = "aaaaaaaa", str2 = "aaaaaaaa"
输出："aaaaaaaa"
```

**提示：**

- `1 <= str1.length, str2.length <= 1000`

- `str1` 和 `str2` 都由小写英文字母组成。

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

我们先用动态规划求出两个字符串的最长公共子序列，然后根据最长公共子序列构造出最短公共超序列。

定义 $f[i][j]$ 表示字符串 $str1$ 的前 $i$ 个字符和字符串 $str2$ 的前 $j$ 个字符的最长公共子序列的长度。状态转移方程如下：


f[i][j] =
\begin{cases}
0 & i = 0 \textit{ or } j = 0 \\
f[i - 1][j - 1] + 1 & str1[i - 1] = str2[j - 1] \\
\max(f[i - 1][j], f[i][j - 1]) & str1[i - 1] \neq str2[j - 1]
\end{cases}


接下来我们基于 $f[i][j]$ 构造出最短公共超序列。

```bash
str1:       a   b   a   c

str2:   c   a   b

ans:    c   a   b   a   c
```

不妨对照着上面的示例字符串，来看看如何构造出最短公共超序列。

我们用双指针 $i$ 和 $j$ 分别指向字符串 $str1$ 和 $str2$ 的末尾，然后从后往前遍历，每次比较 $str1[i]$ 和 $str2[j]$ 的值：

- 如果 $str1[i] = str2[j]$，则将 $str1[i]$ 或 $str2[j]$ 中的任意一个字符加入到最答案序列的末尾，然后 $i$ 和 $j$ 同时减 $1$；
- 如果 $str1[i] \neq str2[j]$，则将 $f[i][j]$ 与 $f[i - 1][j]$ 和 $f[i][j - 1]$ 中的最大值进行比较：
    - 如果 $f[i][j] = f[i - 1][j]$，则将 $str1[i]$ 加入到答案序列的末尾，然后 $i$ 减 $1$；
    - 如果 $f[i][j] = f[i][j - 1]$，则将 $str2[j]$ 加入到答案序列的末尾，然后 $j$ 减 $1$。

重复上述操作，直到 $i = 0$ 或 $j = 0$，然后将剩余的字符串加入到答案序列的末尾即可。

最后我们将答案序列反转，即可得到最终的答案。

时间复杂度 $O(m\times n)$，空间复杂度 $O(m\times n)$。其中 $m$ 和 $n$ 分别是字符串 $str1$ 和 $str2$ 的长度。

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
// Shortest Common Supersequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shortestCommonSupersequence(str1 string, str2 string) string {
	m, n := len(str1), len(str2)
	f := make([][]int, m+1)
	for i := range f {
		f[i] = make([]int, n+1)
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if str1[i-1] == str2[j-1] {
				f[i][j] = f[i-1][j-1] + 1
			} else {
				f[i][j] = max(f[i-1][j], f[i][j-1])
			}
		}
	}
	ans := []byte{}
	i, j := m, n
	for i > 0 || j > 0 {
		if i == 0 {
			j--
			ans = append(ans, str2[j])
		} else if j == 0 {
			i--
			ans = append(ans, str1[i])
		} else {
			if f[i][j] == f[i-1][j] {
				i--
				ans = append(ans, str1[i])
			} else if f[i][j] == f[i][j-1] {
				j--
				ans = append(ans, str2[j])
			} else {
				i, j = i-1, j-1
				ans = append(ans, str1[i])
			}
		}
	}
	for i, j = 0, len(ans)-1; i < j; i, j = i+1, j-1 {
		ans[i], ans[j] = ans[j], ans[i]
	}
	return string(ans)
}
```

### Java

```java
// Shortest Common Supersequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String shortestCommonSupersequence(String str1, String str2) {
        int m = str1.length(), n = str2.length();
        int[][] f = new int[m + 1][n + 1];
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                    f[i][j] = f[i - 1][j - 1] + 1;
                } else {
                    f[i][j] = Math.max(f[i - 1][j], f[i][j - 1]);
                }
            }
        }
        int i = m, j = n;
        StringBuilder ans = new StringBuilder();
        while (i > 0 || j > 0) {
            if (i == 0) {
                ans.append(str2.charAt(--j));
            } else if (j == 0) {
                ans.append(str1.charAt(--i));
            } else {
                if (f[i][j] == f[i - 1][j]) {
                    ans.append(str1.charAt(--i));
                } else if (f[i][j] == f[i][j - 1]) {
                    ans.append(str2.charAt(--j));
                } else {
                    ans.append(str1.charAt(--i));
                    --j;
                }
            }
        }
        return ans.reverse().toString();
    }
}
```

### Python

```python
# Shortest Common Supersequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shortestCommonSupersequence(self, str1: str, str2: str) -> str:
        m, n = len(str1), len(str2)
        f = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if str1[i - 1] == str2[j - 1]:
                    f[i][j] = f[i - 1][j - 1] + 1
                else:
                    f[i][j] = max(f[i - 1][j], f[i][j - 1])
        ans = []
        i, j = m, n
        while i or j:
            if i == 0:
                j -= 1
                ans.append(str2[j])
            elif j == 0:
                i -= 1
                ans.append(str1[i])
            else:
                if f[i][j] == f[i - 1][j]:
                    i -= 1
                    ans.append(str1[i])
                elif f[i][j] == f[i][j - 1]:
                    j -= 1
                    ans.append(str2[j])
                else:
                    i, j = i - 1, j - 1
                    ans.append(str1[i])
        return ''.join(ans[::-1])
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

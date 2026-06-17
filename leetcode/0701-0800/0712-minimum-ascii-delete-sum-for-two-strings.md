# 0712. Minimum ASCII Delete Sum for Two Strings

---
编号: 712
题目: Minimum ASCII Delete Sum for Two Strings
难度: 中等
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/
---

## 题目描述

给定两个字符串`s1` 和 `s2`，返回 *使两个字符串相等所需删除字符的 **ASCII **值的最小和 *。

**示例 1:**

```text
输入: s1 = "sea", s2 = "eat"
输出: 231
解释: 在 "sea" 中删除 "s" 并将 "s" 的值(115)加入总和。
在 "eat" 中删除 "t" 并将 116 加入总和。
结束时，两个字符串相等，115 + 116 = 231 就是符合条件的最小和。
```

**示例 2:**

```text
输入: s1 = "delete", s2 = "leet"
输出: 403
解释: 在 "delete" 中删除 "dee" 字符串变成 "let"，
将 100[d]+101[e]+101[e] 加入总和。在 "leet" 中删除 "e" 将 101[e] 加入总和。
结束时，两个字符串都等于 "let"，结果即为 100+101+101+101 = 403 。
如果改为将两个字符串转换为 "lee" 或 "eet"，我们会得到 433 或 417 的结果，比答案更大。
```

**提示:**

- `1 <= s1.length, s2.length <= 1000`

- `s1` 和 `s2` 由小写英文字母组成

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

我们定义 $f[i][j]$ 表示使得 $s_1$ 的前 $i$ 个字符和 $s_2$ 的前 $j$ 个字符相等所需删除字符的 ASCII 值的最小和。那么答案就是 $f[m][n]$。

如果 $s_1[i-1] = s_2[j-1]$，那么 $f[i][j] = f[i-1][j-1]$。否则，我们可以删除 $s_1[i-1]$ 或者 $s_2[j-1]$ 中的一个，使得 $f[i][j]$ 达到最小。因此，状态转移方程如下：


f[i][j]=
\begin{cases}
f[i-1][j-1], & s_1[i-1] = s_2[j-1] \\
min(f[i-1][j] + s_1[i-1], f[i][j-1] + s_2[j-1]), & s_1[i-1] \neq s_2[j-1]
\end{cases}


初始状态为 $f[0][j] = f[0][j-1] + s_2[j-1]$, $f[i][0] = f[i-1][0] + s_1[i-1]$。

最后返回 $f[m][n]$ 即可。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是 $s_1$ 和 $s_2$ 的长度。

相似题目：

- [1143. 最长公共子序列](https://github.com/doocs/leetcode/blob/main/solution/1100-1199/1143.Longest%20Common%20Subsequence/README.md)

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
// Minimum ASCII Delete Sum for Two Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minimumDeleteSum(s1 string, s2 string) int {
	m, n := len(s1), len(s2)
	f := make([][]int, m+1)
	for i := range f {
		f[i] = make([]int, n+1)
	}
	for i, c := range s1 {
		f[i+1][0] = f[i][0] + int(c)
	}
	for j, c := range s2 {
		f[0][j+1] = f[0][j] + int(c)
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if s1[i-1] == s2[j-1] {
				f[i][j] = f[i-1][j-1]
			} else {
				f[i][j] = min(f[i-1][j]+int(s1[i-1]), f[i][j-1]+int(s2[j-1]))
			}
		}
	}
	return f[m][n]
}
```

### Java

```java
// Minimum ASCII Delete Sum for Two Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minimumDeleteSum(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[][] f = new int[m + 1][n + 1];
        for (int i = 1; i <= m; ++i) {
            f[i][0] = f[i - 1][0] + s1.charAt(i - 1);
        }
        for (int j = 1; j <= n; ++j) {
            f[0][j] = f[0][j - 1] + s2.charAt(j - 1);
        }
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    f[i][j] = f[i - 1][j - 1];
                } else {
                    f[i][j]
                        = Math.min(f[i - 1][j] + s1.charAt(i - 1), f[i][j - 1] + s2.charAt(j - 1));
                }
            }
        }
        return f[m][n];
    }
}
```

### Python

```python
# Minimum ASCII Delete Sum for Two Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minimumDeleteSum(self, s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        f = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            f[i][0] = f[i - 1][0] + ord(s1[i - 1])
        for j in range(1, n + 1):
            f[0][j] = f[0][j - 1] + ord(s2[j - 1])
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    f[i][j] = f[i - 1][j - 1]
                else:
                    f[i][j] = min(
                        f[i - 1][j] + ord(s1[i - 1]), f[i][j - 1] + ord(s2[j - 1])
                    )
        return f[m][n]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

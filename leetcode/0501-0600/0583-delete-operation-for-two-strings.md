# 0583. Delete Operation for Two Strings

---
编号: 583
题目: Delete Operation for Two Strings
难度: 中等
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/delete-operation-for-two-strings/
---

## 题目描述

给定两个单词 `word1` 和 `word2` ，返回使得 `word1` 和  `word2`* ***相同**所需的**最小步数**。

**每步 **可以删除任意一个字符串中的一个字符。

**示例 1：**

```text
输入: word1 = "sea", word2 = "eat"
输出: 2
解释: 第一步将 "sea" 变为 "ea" ，第二步将 "eat "变为 "ea"
```

**示例  2:**

```text
输入：word1 = "leetcode", word2 = "etco"
输出：4
```

**提示：**

- `1 <= word1.length, word2.length <= 500`

- `word1` 和 `word2` 只包含小写英文字母

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

我们定义 $f[i][j]$ 表示使得字符串 $\textit{word1}$ 的前 $i$ 个字符和字符串 $\textit{word2}$ 的前 $j$ 个字符相同的最小删除步数。那么答案为 $f[m][n]$，其中 $m$ 和 $n$ 分别是字符串 $\textit{word1}$ 和 $\textit{word2}$ 的长度。

初始时，如果 $j = 0$，那么 $f[i][0] = i$；如果 $i = 0$，那么 $f[0][j] = j$。

当 $i, j > 0$ 时，如果 $\textit{word1}[i - 1] = \textit{word2}[j - 1]$，那么 $f[i][j] = f[i - 1][j - 1]$；否则 $f[i][j] = \min(f[i - 1][j], f[i][j - 1]) + 1$。

最终返回 $f[m][n]$ 即可。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是字符串 $\textit{word1}$ 和 $\textit{word2}$ 的长度。

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
// Delete Operation for Two Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minDistance(word1 string, word2 string) int {
	m, n := len(word1), len(word2)
	f := make([][]int, m+1)
	for i := range f {
		f[i] = make([]int, n+1)
        f[i][0] = i
	}
	for j := 1; j <= n; j++ {
		f[0][j] = j
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			a, b := word1[i-1], word2[j-1]
			if a == b {
				f[i][j] = f[i-1][j-1]
			} else {
				f[i][j] = 1 + min(f[i-1][j], f[i][j-1])
			}
		}
	}
	return f[m][n]
}
```

### Java

```java
// Delete Operation for Two Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] f = new int[m + 1][n + 1];
        for (int i = 0; i <= m; ++i) {
            f[i][0] = i;
        }
        for (int j = 0; j <= n; ++j) {
            f[0][j] = j;
        }
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                char a = word1.charAt(i - 1);
                char b = word2.charAt(j - 1);
                if (a == b) {
                    f[i][j] = f[i - 1][j - 1];
                } else {
                    f[i][j] = Math.min(f[i - 1][j], f[i][j - 1]) + 1;
                }
            }
        }
        return f[m][n];
    }
}
```

### Python

```python
# Delete Operation for Two Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        f = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            f[i][0] = i
        for j in range(1, n + 1):
            f[0][j] = j
        for i, a in enumerate(word1, 1):
            for j, b in enumerate(word2, 1):
                if a == b:
                    f[i][j] = f[i - 1][j - 1]
                else:
                    f[i][j] = min(f[i - 1][j], f[i][j - 1]) + 1
        return f[m][n]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

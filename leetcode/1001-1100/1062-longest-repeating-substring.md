# 1062. Longest Repeating Substring

---
编号: 1062
题目: Longest Repeating Substring
难度: 中等
标签: [字符串, 二分查找, 动态规划, 后缀数组, 哈希函数, 滚动哈希]
来源链接: https://leetcode.com/problems/longest-repeating-substring/
---

## 题目描述

给你一个字符串 `s`，找出并返回 **最长重复子串** 的长度。如果不存在重复子串，返回 `0`。

**示例 1：**

```text
输入：s = "abcd"
输出：0
解释：没有重复子串。
```

**示例 2：**

```text
输入：s = "abbaba"
输出：2
解释：最长的重复子串为 "ab" 和 "ba"，每个出现 2 次。
```

**示例 3：**

```text
输入：s = "aabcaabdaab"
输出：3
解释：最长的重复子串为 "aab"，出现 3 次。
```

**提示：**

- `1 <= s.length <= 2000`

- 字符串 `s` 仅包含从 `'a'` 到 `'z'` 的小写英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 二分查找, 动态规划, 后缀数组, 哈希函数, 滚动哈希」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示以 $s[i]$ 和 $s[j]$ 结尾的最长重复子串的长度，初始时 $f[i][j]=0$。

我们在 $[1, n)$ 的区间内枚举 $i$，在 $[0, i)$ 的区间内枚举 $j$，如果 $s[i]=s[j]$，那么有：


f[i][j]=
\begin{cases}
f[i-1][j-1]+1, & j>0 \\
1, & j=0
\end{cases}


我们求出所有 $f[i][j]$ 的最大值即为答案。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 为字符串 $s$ 的长度。

相似题目：

- [1044. 最长重复子串 🔒](https://github.com/doocs/leetcode/blob/main/solution/1000-1099/1044.Longest%20Duplicate%20Substring/README.md)

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
// Longest Repeating Substring：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func longestRepeatingSubstring(s string) (ans int) {
	n := len(s)
	f := make([][]int, n)
	for i := range f {
		f[i] = make([]int, n)
	}
	for i := 1; i < n; i++ {
		for j := 0; j < i; j++ {
			if s[i] == s[j] {
				if j > 0 {
					f[i][j] = f[i-1][j-1]
				}
				f[i][j]++
				ans = max(ans, f[i][j])
			}
		}
	}
	return
}
```

### Java

```java
// Longest Repeating Substring：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int longestRepeatingSubstring(String s) {
        int n = s.length();
        int[][] f = new int[n][n];
        int ans = 0;
        for (int i = 1; i < n; ++i) {
            for (int j = 0; j < i; ++j) {
                if (s.charAt(i) == s.charAt(j)) {
                    f[i][j] = 1 + (j > 0 ? f[i - 1][j - 1] : 0);
                    ans = Math.max(ans, f[i][j]);
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Longest Repeating Substring：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def longestRepeatingSubstring(self, s: str) -> int:
        n = len(s)
        f = [[0] * n for _ in range(n)]
        ans = 0
        for i in range(1, n):
            for j in range(i):
                if s[i] == s[j]:
                    f[i][j] = 1 + (f[i - 1][j - 1] if j else 0)
                    ans = max(ans, f[i][j])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

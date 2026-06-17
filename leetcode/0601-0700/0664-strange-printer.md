# 0664. Strange Printer

---
编号: 664
题目: Strange Printer
难度: 困难
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/strange-printer/
---

## 题目描述

有台奇怪的打印机有以下两个特殊要求：

- 打印机每次只能打印由 **同一个字符** 组成的序列。

- 每次可以在从起始到结束的任意位置打印新字符，并且会覆盖掉原来已有的字符。

给你一个字符串 `s` ，你的任务是计算这个打印机打印它需要的最少打印次数。

**示例 1：**

```text
输入：s = "aaabbb"
输出：2
解释：首先打印 "aaa" 然后打印 "bbb"。
```

**示例 2：**

```text
输入：s = "aba"
输出：2
解释：首先打印 "aaa" 然后在第二个位置打印 "b" 覆盖掉原来的字符 'a'。
```

**提示：**

- `1 <= s.length <= 100`

- `s` 由小写英文字母组成

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

我们定义 $f[i][j]$ 表示打印完成区间 $s[i..j]$ 的最少操作数，初始时 $f[i][j]=\infty$，答案为 $f[0][n-1]$，其中 $n$ 是字符串 $s$ 的长度。

考虑 $f[i][j]$，如果 $s[i] = s[j]$，那么我们在打印 $s[i]$ 时可以顺便打印 $s[j]$，这样我们即可忽略字符 $s[j]$，在区间 $s[i+1..j-1]$ 内继续进行打印。如果 $s[i] \neq s[j]$，那么我们需要分别完成该区间的打印，即使用 $s[i..k]$ 和 $s[k+1..j]$，其中 $k \in [i,j)$。于是我们可以列出如下的转移方程：


f[i][j]=
\begin{cases}
1, & \textit{if } i=j \\
f[i][j-1], & \textit{if } s[i]=s[j] \\
\min_{i \leq k < j} \{f[i][k]+f[k+1][j]\}, & \textit{otherwise}
\end{cases}


在枚举时，我们可以从大到小枚举 $i$，从小到大枚举 $j$，这样可以保证在计算 $f[i][j]$ 时，状态 $f[i][j-1]$ 和 $f[i][k]$ 以及 $f[k+1][j]$ 都已经被计算过。

时间复杂度 $O(n^3)$，空间复杂度 $O(n^2)$。其中 $n$ 是字符串 $s$ 的长度。

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
// Strange Printer：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func strangePrinter(s string) int {
	n := len(s)
	f := make([][]int, n)
	for i := range f {
		f[i] = make([]int, n)
		for j := range f[i] {
			f[i][j] = 1 << 30
		}
	}
	for i := n - 1; i >= 0; i-- {
		f[i][i] = 1
		for j := i + 1; j < n; j++ {
			if s[i] == s[j] {
				f[i][j] = f[i][j-1]
			} else {
				for k := i; k < j; k++ {
					f[i][j] = min(f[i][j], f[i][k]+f[k+1][j])
				}
			}
		}
	}
	return f[0][n-1]
}
```

### Java

```java
// Strange Printer：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int strangePrinter(String s) {
        final int inf = 1 << 30;
        int n = s.length();
        int[][] f = new int[n][n];
        for (var g : f) {
            Arrays.fill(g, inf);
        }
        for (int i = n - 1; i >= 0; --i) {
            f[i][i] = 1;
            for (int j = i + 1; j < n; ++j) {
                if (s.charAt(i) == s.charAt(j)) {
                    f[i][j] = f[i][j - 1];
                } else {
                    for (int k = i; k < j; ++k) {
                        f[i][j] = Math.min(f[i][j], f[i][k] + f[k + 1][j]);
                    }
                }
            }
        }
        return f[0][n - 1];
    }
}
```

### Python

```python
# Strange Printer：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def strangePrinter(self, s: str) -> int:
        n = len(s)
        f = [[inf] * n for _ in range(n)]
        for i in range(n - 1, -1, -1):
            f[i][i] = 1
            for j in range(i + 1, n):
                if s[i] == s[j]:
                    f[i][j] = f[i][j - 1]
                else:
                    for k in range(i, j):
                        f[i][j] = min(f[i][j], f[i][k] + f[k + 1][j])
        return f[0][-1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

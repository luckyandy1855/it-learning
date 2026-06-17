# 0903. Valid Permutations for DI Sequence

---
编号: 903
题目: Valid Permutations for DI Sequence
难度: 困难
标签: [字符串, 动态规划, 前缀和]
来源链接: https://leetcode.com/problems/valid-permutations-for-di-sequence/
---

## 题目描述

给定一个长度为 `n` 的字符串 `s` ，其中 `s[i]` 是:

- `“D”` 意味着减少，或者

- `“I”` 意味着增加

**有效排列** 是对有 `n + 1` 个在 `[0, n]`  范围内的整数的一个排列 `perm` ，使得对所有的 `i`：

- 如果 `s[i] == 'D'`，那么 `perm[i] > perm[i+1]`，以及；

- 如果 `s[i] == 'I'`，那么 `perm[i] < perm[i+1]`。

返回 ***有效排列 ** *`perm`*的数量 *。因为答案可能很大，所以请**返回你的答案对** `10^9 + 7`** 取余**。

**示例 1：**

```text
输入：s = "DID"
输出：5
解释：
(0, 1, 2, 3) 的五个有效排列是：
(1, 0, 3, 2)
(2, 0, 3, 1)
(2, 1, 3, 0)
(3, 0, 2, 1)
(3, 1, 2, 0)
```

**示例 2:**

```text
输入: s = "D"
输出: 1
```

**提示:**

- `n == s.length`

- `1 <= n <= 200`

- `s[i]` 不是 `'I'` 就是 `'D'`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 动态规划, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示字符串的前 $i$ 个字符中，以数字 $j$ 结尾的满足题目要求的排列的数量。初始时 $f[0][0]=1$，其余 $f[0][j]=0$。答案为 $\sum_{j=0}^n f[n][j]$。

考虑 $f[i][j]$，其中 $j \in [0, i]$。

如果第 $i$ 个字符 $s[i-1]$ 是 `'D'`，那么 $f[i][j]$ 可以从 $f[i-1][k]$ 转移而来，其中 $k \in [j+1, i]$，而由于 $k-1$ 最大只能为 $i-1$，我们将 $k$ 向左移动一位，那么 $k \in [j, i-1]$，因此有 $f[i][j] = \sum_{k=j}^{i-1} f[i-1][k]$。

如果第 $i$ 个字符 $s[i-1]$ 是 `'I'`，那么 $f[i][j]$ 可以从 $f[i-1][k]$ 转移而来，其中 $k \in [0, j-1]$，因此有 $f[i][j] = \sum_{k=0}^{j-1} f[i-1][k]$。

最终的答案即为 $\sum_{j=0}^n f[n][j]$。

时间复杂度 $O(n^3)$，空间复杂度 $O(n^2)$。其中 $n$ 是字符串的长度。

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
// Valid Permutations for DI Sequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numPermsDISequence(s string) (ans int) {
	const mod = 1e9 + 7
	n := len(s)
	f := make([][]int, n+1)
	for i := range f {
		f[i] = make([]int, n+1)
	}
	f[0][0] = 1
	for i := 1; i <= n; i++ {
		if s[i-1] == 'D' {
			for j := 0; j <= i; j++ {
				for k := j; k < i; k++ {
					f[i][j] = (f[i][j] + f[i-1][k]) % mod
				}
			}
		} else {
			for j := 0; j <= i; j++ {
				for k := 0; k < j; k++ {
					f[i][j] = (f[i][j] + f[i-1][k]) % mod
				}
			}
		}
	}
	for j := 0; j <= n; j++ {
		ans = (ans + f[n][j]) % mod
	}
	return
}
```

### Java

```java
// Valid Permutations for DI Sequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numPermsDISequence(String s) {
        final int mod = (int) 1e9 + 7;
        int n = s.length();
        int[][] f = new int[n + 1][n + 1];
        f[0][0] = 1;
        for (int i = 1; i <= n; ++i) {
            if (s.charAt(i - 1) == 'D') {
                for (int j = 0; j <= i; ++j) {
                    for (int k = j; k < i; ++k) {
                        f[i][j] = (f[i][j] + f[i - 1][k]) % mod;
                    }
                }
            } else {
                for (int j = 0; j <= i; ++j) {
                    for (int k = 0; k < j; ++k) {
                        f[i][j] = (f[i][j] + f[i - 1][k]) % mod;
                    }
                }
            }
        }
        int ans = 0;
        for (int j = 0; j <= n; ++j) {
            ans = (ans + f[n][j]) % mod;
        }
        return ans;
    }
}
```

### Python

```python
# Valid Permutations for DI Sequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numPermsDISequence(self, s: str) -> int:
        mod = 10**9 + 7
        n = len(s)
        f = [[0] * (n + 1) for _ in range(n + 1)]
        f[0][0] = 1
        for i, c in enumerate(s, 1):
            if c == "D":
                for j in range(i + 1):
                    for k in range(j, i):
                        f[i][j] = (f[i][j] + f[i - 1][k]) % mod
            else:
                for j in range(i + 1):
                    for k in range(j):
                        f[i][j] = (f[i][j] + f[i - 1][k]) % mod
        return sum(f[n][j] for j in range(n + 1)) % mod
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

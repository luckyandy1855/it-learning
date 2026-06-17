# 0471. Encode String with Shortest Length

---
编号: 471
题目: Encode String with Shortest Length
难度: 困难
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/encode-string-with-shortest-length/
---

## 题目描述

给定一个 **非空** 字符串，将其编码为具有最短长度的字符串。

编码规则是：`k[encoded_string]`，其中在方括号 `encoded_string`* *中的内容重复 `k` 次。

**注：**

- *k* 为正整数

- 如果编码的过程不能使字符串缩短，则不要对其进行编码。如果有多种编码方式，返回 **任意一种** 即可

**示例 1：**

```text
输入：s = "aaa"
输出："aaa"
解释：无法将其编码为更短的字符串，因此不进行编码。
```

**示例 2：**

```text
输入：s = "aaaaa"
输出："5[a]"
解释："5[a]" 比 "aaaaa" 短 1 个字符。
```

**示例 3：**

```text
输入：s = "aaaaaaaaaa"
输出："10[a]"
解释："a9[a]" 或 "9[a]a" 都是合法的编码，和 "10[a]" 一样长度都为 5。
```

**示例 4：**

```text
输入：s = "aabcaabcd"
输出："2[aabc]d"
解释："aabc" 出现两次，因此一种答案可以是 "2[aabc]d"。
```

**示例 5：**

```text
输入：s = "abbbabbbcabbbabbbc"
输出："2[2[abbb]c]"
解释："abbbabbbc" 出现两次，但是 "abbbabbbc" 可以编码为 "2[abbb]c"，因此一种答案可以是 "2[2[abbb]c]"。
```

**提示：**

- `1 <= s.length <= 150`

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

在这道题中，我们需要判断一个字符串是否能够进行压缩，也即是说，一个字符串是否能通过其子串重复多次构成。我们可以利用第 $459$ 题的方法来判断，定义一个方法 $g(i, j)$，表示将字符串 $s[i...j]$ 进行压缩后得到的字符串。

接下来，我们用动态规划的方法，将字符串 $s$ 编码成一个最短长度的字符串。

我们定义 $f[i][j]$ 表示将字符串 $s[i..j]$ 编码后的最短字符串。如果直接将 $s[i..j]$ 进行压缩编码，那么 $f[i][j] = g(i, j)$，如果我们将其分成两个子串进行编码，那么 $f[i][j]$ 的值为 $f[i][k] + f[k + 1][j]$ 的最小值，其中 $i \le k < j$。取两种情况下长度较小的字符串即可。

在枚举 $i$ 和 $j$ 时，我们可以从大到小枚举 $i$，然后从小到大枚举 $j$，这样我们在计算 $f[i][j]$ 时，$f[i][k]$ 和 $f[k + 1][j]$ 的值都已经被计算过了。

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
// Encode String with Shortest Length：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func encode(s string) string {
	n := len(s)
	f := make([][]string, n)
	for i := range f {
		f[i] = make([]string, n)
	}
	g := func(i, j int) string {
		t := s[i : j+1]
		if len(t) < 5 {
			return t
		}
		k := strings.Index((t + t)[1:], t) + 1
		if k < len(t) {
			cnt := len(t) / k
			return strconv.Itoa(cnt) + "[" + f[i][i+k-1] + "]"
		}
		return t
	}
	for i := n - 1; i >= 0; i-- {
		for j := i; j < n; j++ {
			f[i][j] = g(i, j)
			if j-i+1 > 4 {
				for k := i; k < j; k++ {
					t := f[i][k] + f[k+1][j]
					if len(t) < len(f[i][j]) {
						f[i][j] = t
					}
				}
			}
		}
	}
	return f[0][n-1]
}
```

### Java

```java
// Encode String with Shortest Length：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private String s;
    private String[][] f;

    public String encode(String s) {
        this.s = s;
        int n = s.length();
        f = new String[n][n];
        for (int i = n - 1; i >= 0; --i) {
            for (int j = i; j < n; ++j) {
                f[i][j] = g(i, j);
                if (j - i + 1 > 4) {
                    for (int k = i; k < j; ++k) {
                        String t = f[i][k] + f[k + 1][j];
                        if (f[i][j].length() > t.length()) {
                            f[i][j] = t;
                        }
                    }
                }
            }
        }
        return f[0][n - 1];
    }

    private String g(int i, int j) {
        String t = s.substring(i, j + 1);
        if (t.length() < 5) {
            return t;
        }
        int k = (t + t).indexOf(t, 1);
        if (k < t.length()) {
            int cnt = t.length() / k;
            return String.format("%d[%s]", cnt, f[i][i + k - 1]);
        }
        return t;
    }
}
```

### Python

```python
# Encode String with Shortest Length：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def encode(self, s: str) -> str:
        def g(i: int, j: int) -> str:
            t = s[i : j + 1]
            if len(t) < 5:
                return t
            k = (t + t).index(t, 1)
            if k < len(t):
                cnt = len(t) // k
                return f"{cnt}[{f[i][i + k - 1]}]"
            return t

        n = len(s)
        f = [[None] * n for _ in range(n)]
        for i in range(n - 1, -1, -1):
            for j in range(i, n):
                f[i][j] = g(i, j)
                if j - i + 1 > 4:
                    for k in range(i, j):
                        t = f[i][k] + f[k + 1][j]
                        if len(f[i][j]) > len(t):
                            f[i][j] = t
        return f[0][-1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

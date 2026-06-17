# 0336. Palindrome Pairs

---
编号: 336
题目: Palindrome Pairs
难度: 困难
标签: [字典树, 数组, 哈希表, 字符串, 哈希函数]
来源链接: https://leetcode.com/problems/palindrome-pairs/
---

## 题目描述

给定一个由唯一字符串构成的 **0 索引 **数组 `words` 。

**回文对** 是一对整数 `(i, j)` ，满足以下条件：

	- `0 回文串。

返回一个数组，它包含 `words` 中所有满足 **回文对** 条件的字符串。

你必须设计一个时间复杂度为 `O(sum of words[i].length)` 的算法。

**示例 1：**

```text
输入：words = ["abcd","dcba","lls","s","sssll"]
输出：[[0,1],[1,0],[3,2],[2,4]]
解释：可拼接成的回文串为 ["dcbaabcd","abcddcba","slls","llssssll"]
```

**示例 2：**

```text
输入：words = ["bat","tab","cat"]
输出：[[0,1],[1,0]]
解释：可拼接成的回文串为 ["battab","tabbat"]
```

**示例 3：**

```text
输入：words = ["a",""]
输出：[[0,1],[1,0]]
```

**提示：**

	- `1 <= words.length <= 5000`

	- `0 <= words[i].length <= 300`

	- `words[i]` 由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字典树, 数组, 哈希表, 字符串, 哈希函数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

**字符串哈希**是把一个任意长度的字符串映射成一个非负整数，并且其冲突的概率几乎为 $0$。字符串哈希用于计算字符串哈希值，快速判断两个字符串是否相等。

取一固定值 $BASE$，把字符串看作是 $BASE$ 进制数，并分配一个大于 $0$ 的数值，代表每种字符。一般来说，我们分配的数值都远小于 $BASE$。例如，对于小写字母构成的字符串，可以令 $a=1$, $b=2$, ..., $z=26$。取一固定值 $MOD$，求出该 $BASE$ 进制对 $M$ 的余数，作为该字符串的 $hash$ 值。

一般来说，取 $BASE=131$ 或者 $BASE=13331$，此时 $hash$ 值产生的冲突概率极低。只要两个字符串 $hash$ 值相同，我们就认为两个字符串是相等的。通常 $MOD$ 取 $2^{64}$，C++ 里，可以直接使用 `unsigned long long` 类型存储这个 $hash$ 值，在计算时不处理算术溢出问题，产生溢出时相当于自动对 $2^{64}$ 取模，这样可以避免低效取模运算。

除了在极特殊构造的数据上，上述 $hash$ 算法很难产生冲突，一般情况下上述 $hash$ 算法完全可以出现在题目的标准答案中。我们还可以多取一些恰当的 $BASE$ 和 $MOD$ 的值（例如大质数），多进行几组 $hash$ 运算，当结果都相同时才认为原字符串相等，就更加难以构造出使这个 $hash$ 产生错误的数据。

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
// Palindrome Pairs：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func palindromePairs(words []string) [][]int {
	base := 131
	mod := int(1e9) + 7
	mul := make([]int, 310)
	mul[0] = 1
	for i := 1; i < len(mul); i++ {
		mul[i] = (mul[i-1] * base) % mod
	}
	n := len(words)
	prefix := make([]int, n)
	suffix := make([]int, n)
	for i, word := range words {
		m := len(word)
		for j, c := range word {
			t := int(c-'a') + 1
			s := int(word[m-j-1]-'a') + 1
			prefix[i] = (prefix[i]*base)%mod + t
			suffix[i] = (suffix[i]*base)%mod + s
		}
	}
	check := func(i, j, n, m int) bool {
		t := ((prefix[i]*mul[n])%mod + prefix[j]) % mod
		s := ((suffix[j]*mul[m])%mod + suffix[i]) % mod
		return t == s
	}
	var ans [][]int
	for i := 0; i < n; i++ {
		for j := i + 1; j < n; j++ {
			if check(i, j, len(words[j]), len(words[i])) {
				ans = append(ans, []int{i, j})
			}
			if check(j, i, len(words[i]), len(words[j])) {
				ans = append(ans, []int{j, i})
			}
		}
	}
	return ans
}
```

### Java

```java
// Palindrome Pairs：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private static final int BASE = 131;
    private static final long[] MUL = new long[310];
    private static final int MOD = (int) 1e9 + 7;
    static {
        MUL[0] = 1;
        for (int i = 1; i < MUL.length; ++i) {
            MUL[i] = (MUL[i - 1] * BASE) % MOD;
        }
    }
    public List<List<Integer>> palindromePairs(String[] words) {
        int n = words.length;
        long[] prefix = new long[n];
        long[] suffix = new long[n];
        for (int i = 0; i < n; ++i) {
            String word = words[i];
            int m = word.length();
            for (int j = 0; j < m; ++j) {
                int t = word.charAt(j) - 'a' + 1;
                int s = word.charAt(m - j - 1) - 'a' + 1;
                prefix[i] = (prefix[i] * BASE) % MOD + t;
                suffix[i] = (suffix[i] * BASE) % MOD + s;
            }
        }
        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                if (check(i, j, words[j].length(), words[i].length(), prefix, suffix)) {
                    ans.add(Arrays.asList(i, j));
                }
                if (check(j, i, words[i].length(), words[j].length(), prefix, suffix)) {
                    ans.add(Arrays.asList(j, i));
                }
            }
        }
        return ans;
    }

    private boolean check(int i, int j, int n, int m, long[] prefix, long[] suffix) {
        long t = ((prefix[i] * MUL[n]) % MOD + prefix[j]) % MOD;
        long s = ((suffix[j] * MUL[m]) % MOD + suffix[i]) % MOD;
        return t == s;
    }
}
```

### Python

```python
# Palindrome Pairs：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def palindromePairs(self, words: List[str]) -> List[List[int]]:
        d = {w: i for i, w in enumerate(words)}
        ans = []
        for i, w in enumerate(words):
            for j in range(len(w) + 1):
                a, b = w[:j], w[j:]
                ra, rb = a[::-1], b[::-1]
                if ra in d and d[ra] != i and b == rb:
                    ans.append([i, d[ra]])
                if j and rb in d and d[rb] != i and a == ra:
                    ans.append([d[rb], i])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

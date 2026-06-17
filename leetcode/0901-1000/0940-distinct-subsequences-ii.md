# 0940. Distinct Subsequences II

---
编号: 940
题目: Distinct Subsequences II
难度: 困难
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/distinct-subsequences-ii/
---

## 题目描述

给定一个字符串 `s`，计算 `s` 的 **不同非空子序列** 的个数。因为结果可能很大，所以返回答案需要对** ****`10^9 + 7` 取余** 。

字符串的 **子序列** 是经由原字符串删除一些（也可能不删除）字符但不改变剩余字符相对位置的一个新字符串。

- 例如，`"ace"` 是 `"***a***b***c***d***e***"` 的一个子序列，但 `"aec"` 不是。

**示例 1：**

```text
输入：s = "abc"
输出：7
解释：7 个不同的子序列分别是 "a", "b", "c", "ab", "ac", "bc", 以及 "abc"。
```

**示例 2：**

```text
输入：s = "aba"
输出：6
解释：6 个不同的子序列分别是 "a", "b", "ab", "ba", "aa" 以及 "aba"。
```

**示例 3：**

```text
输入：s = "aaa"
输出：3
解释：3 个不同的子序列分别是 "a", "aa" 以及 "aaa"。
```

**提示：**

- `1 <= s.length <= 2000`

- `s` 仅由小写英文字母组成

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

定义 $dp[i]$ 表示以 $s[i]$ 结尾的不同子序列的个数。由于 $s$ 中只包含小写字母，因此我们可以直接创建一个长度为 $26$ 的数组。初始时 $dp$ 所有元素均为 $0$。答案为 $\sum_{i=0}^{25}dp[i]$。

遍历字符串 $s$，对于每个位置的字符 $s[i]$，我们需要更新以 $s[i]$ 结尾的不同子序列的个数，此时 $dp[i]=\sum_{j=0}^{25}dp[j]+1$。其中 $\sum_{j=0}^{25}dp[j]$ 是此前我们已经计算出所有不同子序列的个数，而 $+1$ 是指 $s[i]$ 本身也可以作为一个子序列。

最后，我们需要对 $dp$ 中的所有元素求和，再对 $10^9+7$ 取余，即为答案。

时间复杂度 $O(n\times C)$，其中 $n$ 是字符串 $s$ 的长度，而 $C$ 是字符集的大小，本题中 $C=26$。空间复杂度 $O(C)$。

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
// Distinct Subsequences II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func distinctSubseqII(s string) int {
	const mod int = 1e9 + 7
	sum := func(arr []int) int {
		x := 0
		for _, v := range arr {
			x = (x + v) % mod
		}
		return x
	}

	dp := make([]int, 26)
	for _, c := range s {
		c -= 'a'
		dp[c] = sum(dp) + 1
	}
	return sum(dp)
}
```

### Java

```java
// Distinct Subsequences II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private static final int MOD = (int) 1e9 + 7;

    public int distinctSubseqII(String s) {
        int[] dp = new int[26];
        for (int i = 0; i < s.length(); ++i) {
            int j = s.charAt(i) - 'a';
            dp[j] = sum(dp) + 1;
        }
        return sum(dp);
    }

    private int sum(int[] arr) {
        int x = 0;
        for (int v : arr) {
            x = (x + v) % MOD;
        }
        return x;
    }
}
```

### Python

```python
# Distinct Subsequences II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def distinctSubseqII(self, s: str) -> int:
        mod = 10**9 + 7
        n = len(s)
        dp = [[0] * 26 for _ in range(n + 1)]
        for i, c in enumerate(s, 1):
            k = ord(c) - ord('a')
            for j in range(26):
                if j == k:
                    dp[i][j] = sum(dp[i - 1]) % mod + 1
                else:
                    dp[i][j] = dp[i - 1][j]
        return sum(dp[-1]) % mod
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

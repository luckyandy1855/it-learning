# 1312. Minimum Insertion Steps to Make a String Palindrome

---
编号: 1312
题目: Minimum Insertion Steps to Make a String Palindrome
难度: 困难
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/
---

## 题目描述

给你一个字符串 `s` ，每一次操作你都可以在字符串的任意位置插入任意字符。

请你返回让 `s` 成为回文串的 **最少操作次数** 。

「回文串」是正读和反读都相同的字符串。

**示例 1：**

```text
输入：s = "zzazz"
输出：0
解释：字符串 "zzazz" 已经是回文串了，所以不需要做任何插入操作。
```

**示例 2：**

```text
输入：s = "mbadm"
输出：2
解释：字符串可变为 "mbdadbm" 或者 "mdbabdm" 。
```

**示例 3：**

```text
输入：s = "leetcode"
输出：5
解释：插入 5 个字符后字符串变为 "leetcodocteel" 。
```

**提示：**

- `1 <= s.length <= 500`

- `s` 中所有字符都是小写字母。

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

我们设计一个函数 $dfs(i, j)$，表示将字符串 $s[i..j]$ 变成回文串所需要的最少操作次数。那么答案就是 $dfs(0, n - 1)$。

函数 $dfs(i, j)$ 的计算过程如下：

如果 $i \geq j$，此时无需插入任何字符，我们直接返回 $0$。

否则，我们判断 $s[i]$ 与 $s[j]$ 是否相等，如果 $s[i]=s[j]$，那么我们只需要将 $s[i+1..j-1]$ 变成回文串，那么我们返回 $dfs(i + 1, j - 1)$。否则，我们可以在 $s[i]$ 的左侧或者 $s[j]$ 的右侧插入一个与另一侧相同的字符，那么 $dfs(i, j) = \min(dfs(i + 1, j), dfs(i, j - 1)) + 1$。

为了避免重复计算，我们可以使用记忆化搜索，即使用哈希表或者数组来存储已经计算过的函数值。

最后，我们返回 $dfs(0, n - 1)$ 即可。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 为字符串 $s$ 的长度。

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
// Minimum Insertion Steps to Make a String Palindrome：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minInsertions(s string) int {
	n := len(s)
	f := make([][]int, n)
	for i := range f {
		f[i] = make([]int, n)
		for j := range f[i] {
			f[i][j] = -1
		}
	}
	var dfs func(i, j int) int
	dfs = func(i, j int) int {
		if i >= j {
			return 0
		}
		if f[i][j] != -1 {
			return f[i][j]
		}
		ans := 1 << 30
		if s[i] == s[j] {
			ans = dfs(i+1, j-1)
		} else {
			ans = min(dfs(i+1, j), dfs(i, j-1)) + 1
		}
		f[i][j] = ans
		return ans
	}
	return dfs(0, n-1)
}
```

### Java

```java
// Minimum Insertion Steps to Make a String Palindrome：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Integer[][] f;
    private String s;

    public int minInsertions(String s) {
        this.s = s;
        int n = s.length();
        f = new Integer[n][n];
        return dfs(0, n - 1);
    }

    private int dfs(int i, int j) {
        if (i >= j) {
            return 0;
        }
        if (f[i][j] != null) {
            return f[i][j];
        }
        int ans = 1 << 30;
        if (s.charAt(i) == s.charAt(j)) {
            ans = dfs(i + 1, j - 1);
        } else {
            ans = Math.min(dfs(i + 1, j), dfs(i, j - 1)) + 1;
        }
        return f[i][j] = ans;
    }
}
```

### Python

```python
# Minimum Insertion Steps to Make a String Palindrome：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minInsertions(self, s: str) -> int:
        @cache
        def dfs(i: int, j: int) -> int:
            if i >= j:
                return 0
            if s[i] == s[j]:
                return dfs(i + 1, j - 1)
            return 1 + min(dfs(i + 1, j), dfs(i, j - 1))

        return dfs(0, len(s) - 1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

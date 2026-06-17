# 1328. Break a Palindrome

---
编号: 1328
题目: Break a Palindrome
难度: 中等
标签: [贪心, 字符串]
来源链接: https://leetcode.com/problems/break-a-palindrome/
---

## 题目描述

给你一个由小写英文字母组成的回文字符串 `palindrome` ，请你将其中 **一个** 字符用任意小写英文字母替换，使得结果字符串的 **字典序最小** ，且 **不是** 回文串。

请你返回结果字符串。如果无法做到，则返回一个 **空串** 。

如果两个字符串长度相同，那么字符串 `a` 字典序比字符串 `b` 小可以这样定义：在 `a` 和 `b` 出现不同的第一个位置上，字符串 `a` 中的字符严格小于 `b` 中的对应字符。例如，`"abcc”` 字典序比 `"abcd"` 小，因为不同的第一个位置是在第四个字符，显然 `'c'` 比 `'d'` 小。

**示例 1：**

```text
输入：palindrome = "abccba"
输出："aaccba"
解释：存在多种方法可以使 "abccba" 不是回文，例如 "zbccba", "aaccba", 和 "abacba" 。
在所有方法中，"aaccba" 的字典序最小。
```

**示例 2：**

```text
输入：palindrome = "a"
输出：""
解释：不存在替换一个字符使 "a" 变成非回文的方法，所以返回空字符串。
```

**提示：**

- `1 <= palindrome.length <= 1000`

- `palindrome` 只包含小写英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先判断字符串的长度是否为 $1$，若是则直接返回空串。

否则，我们从左到右遍历字符串的前半部分，找到第一个不为 `'a'` 的字符，将其改为 `'a'` 即可。如果不存在这样的字符，那么我们将最后一个字符改为 `'b'` 即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串的长度。

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
// Break a Palindrome：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func breakPalindrome(palindrome string) string {
	n := len(palindrome)
	if n == 1 {
		return ""
	}
	i := 0
	s := []byte(palindrome)
	for i < n/2 && s[i] == 'a' {
		i++
	}
	if i == n/2 {
		s[n-1] = 'b'
	} else {
		s[i] = 'a'
	}
	return string(s)
}
```

### Java

```java
// Break a Palindrome：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String breakPalindrome(String palindrome) {
        int n = palindrome.length();
        if (n == 1) {
            return "";
        }
        char[] s = palindrome.toCharArray();
        int i = 0;
        while (i < n / 2 && s[i] == 'a') {
            ++i;
        }
        if (i == n / 2) {
            s[n - 1] = 'b';
        } else {
            s[i] = 'a';
        }
        return String.valueOf(s);
    }
}
```

### Python

```python
# Break a Palindrome：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def breakPalindrome(self, palindrome: str) -> str:
        n = len(palindrome)
        if n == 1:
            return ""
        s = list(palindrome)
        i = 0
        while i < n // 2 and s[i] == "a":
            i += 1
        if i == n // 2:
            s[-1] = "b"
        else:
            s[i] = "a"
        return "".join(s)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

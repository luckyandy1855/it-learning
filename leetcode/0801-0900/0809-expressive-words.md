# 0809. Expressive Words

---
编号: 809
题目: Expressive Words
难度: 中等
标签: [数组, 双指针, 字符串]
来源链接: https://leetcode.com/problems/expressive-words/
---

## 题目描述

有时候人们会用重复写一些字母来表示额外的感受，比如 `"hello" -> "heeellooo"`, `"hi" -> "hiii"`。我们将相邻字母都相同的一串字符定义为相同字母组，例如："h", "eee", "ll", "ooo"。

对于一个给定的字符串 S ，如果另一个单词能够通过将一些字母组扩张从而使其和 S 相同，我们将这个单词定义为可扩张的（stretchy）。扩张操作定义如下：选择一个字母组（包含字母 `c` ），然后往其中添加相同的字母 `c` 使其长度达到 3 或以上。

例如，以 "hello" 为例，我们可以对字母组 "o" 扩张得到 "hellooo"，但是无法以同样的方法得到 "helloo" 因为字母组 "oo" 长度小于 3。此外，我们可以进行另一种扩张 "ll" -> "lllll" 以获得 "helllllooo"。如果 `s = "helllllooo"`，那么查询词 "hello" 是可扩张的，因为可以对它执行这两种扩张操作使得 `query = "hello" -> "hellooo" -> "helllllooo" = s`。

输入一组查询单词，输出其中可扩张的单词数量。

**示例：**

```text
输入：
s = "heeellooo"
words = ["hello", "hi", "helo"]
输出：1
解释：
我们能通过扩张 "hello" 的 "e" 和 "o" 来得到 "heeellooo"。
我们不能通过扩张 "helo" 来得到 "heeellooo" 因为 "ll" 的长度小于 3 。
```

**提示：**

- `1 s 和所有在 `words` 中的单词都只由小写字母组成。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以遍历数组 $\textit{words}$，对于数组中的每个单词 $t$，判断 $t$ 是否可以通过扩张得到 $s$，如果可以，那么答案加一。

因此，问题的关键在于判断单词 $t$ 是否可以通过扩张得到 $s$。这里我们通过一个 $\textit{check}(s, t)$ 函数来判断。函数的具体实现逻辑如下：

首先判断 $s$ 和 $t$ 的长度关系，如果 $t$ 的长度大于 $s$，直接返回 $\textit{false}$；否则，我们用双指针 $i$ 和 $j$ 分别指向 $s$ 和 $t$，初始时 $i$ 和 $j$ 的值均为 $0$。

如果 $i$ 和 $j$ 指向的字符不同，那么 $t$ 无法通过扩张得到 $s$，直接返回 $\textit{false}$；否则，我们需要判断 $i$ 指向的字符的连续出现次数 $c_1$ 和 $j$ 指向的字符的连续出现次数 $c_2$ 的关系。如果 $c_1 \lt c_2$ 或者 $c_1 \lt 3$ 并且 $c_1 \neq c_2$，那么 $t$ 无法通过扩张得到 $s$，直接返回 $\textit{false}$；否则，将 $i$ 和 $j$ 分别右移 $c_1$ 和 $c_2$ 次。继续判断。

如果 $i$ 和 $j$ 都到达了字符串的末尾，那么 $t$ 可以通过扩张得到 $s$，返回 $\textit{true}$，否则返回 $\textit{false}$。

时间复杂度 $O(n \times m + \sum_{i=0}^{m-1} w_i)$，其中 $n$ 和 $m$ 分别为字符串 $s$ 和数组 $\textit{words}$ 的长度，而 $w_i$ 为数组 $\textit{words}$ 中第 $i$ 个单词的长度。

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
// Expressive Words：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func expressiveWords(s string, words []string) (ans int) {
	check := func(s, t string) bool {
		m, n := len(s), len(t)
		if n > m {
			return false
		}
		i, j := 0, 0
		for i < m && j < n {
			if s[i] != t[j] {
				return false
			}
			k := i
			for k < m && s[k] == s[i] {
				k++
			}
			c1 := k - i
			i, k = k, j
			for k < n && t[k] == t[j] {
				k++
			}
			c2 := k - j
			j = k
			if c1 < c2 || (c1 != c2 && c1 < 3) {
				return false
			}
		}
		return i == m && j == n
	}
	for _, t := range words {
		if check(s, t) {
			ans++
		}
	}
	return ans
}
```

### Java

```java
// Expressive Words：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int expressiveWords(String s, String[] words) {
        int ans = 0;
        for (String t : words) {
            if (check(s, t)) {
                ++ans;
            }
        }
        return ans;
    }

    private boolean check(String s, String t) {
        int m = s.length(), n = t.length();
        if (n > m) {
            return false;
        }
        int i = 0, j = 0;
        while (i < m && j < n) {
            if (s.charAt(i) != t.charAt(j)) {
                return false;
            }
            int k = i;
            while (k < m && s.charAt(k) == s.charAt(i)) {
                ++k;
            }
            int c1 = k - i;
            i = k;
            k = j;
            while (k < n && t.charAt(k) == t.charAt(j)) {
                ++k;
            }
            int c2 = k - j;
            j = k;
            if (c1 < c2 || (c1 < 3 && c1 != c2)) {
                return false;
            }
        }
        return i == m && j == n;
    }
}
```

### Python

```python
# Expressive Words：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def expressiveWords(self, s: str, words: List[str]) -> int:
        def check(s, t):
            m, n = len(s), len(t)
            if n > m:
                return False
            i = j = 0
            while i < m and j < n:
                if s[i] != t[j]:
                    return False
                k = i
                while k < m and s[k] == s[i]:
                    k += 1
                c1 = k - i
                i, k = k, j
                while k < n and t[k] == t[j]:
                    k += 1
                c2 = k - j
                j = k
                if c1 < c2 or (c1 < 3 and c1 != c2):
                    return False
            return i == m and j == n

        return sum(check(s, t) for t in words)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

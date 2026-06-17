# 0408. Valid Word Abbreviation

---
编号: 408
题目: Valid Word Abbreviation
难度: 简单
标签: [双指针, 字符串]
来源链接: https://leetcode.com/problems/valid-word-abbreviation/
---

## 题目描述

字符串可以用 **缩写** 进行表示，**缩写** 的方法是将任意数量的 **不相邻** 的子字符串替换为相应子串的长度。例如，字符串 `"substitution"` 可以缩写为（不止这几种方法）：

- `"s10n"` (`"s ***ubstitutio*** n"`)

- `"sub4u4"` (`"sub ***stit*** u ***tion***"`)

- `"12"` (`"***substitution***"`)

- `"su3i1u2on"` (`"su ***bst*** i ***t*** u ***ti*** on"`)

- `"substitution"` (没有替换子字符串)

下列是不合法的缩写：

- `"s55n"` (`"s ubsti tutio n"`，两处缩写相邻)

- `"s010n"` (缩写存在前导零)

- `"s0ubstitution"` (缩写是一个空字符串)

给你一个字符串单词 `word` 和一个缩写 `abbr` ，判断这个缩写是否可以是给定单词的缩写。

**子字符串**是字符串中连续的**非空**字符序列。

**示例 1：**

```text
输入：word = "internationalization", abbr = "i12iz4n"
输出：true
解释：单词 "internationalization" 可以缩写为 "i12iz4n" ("i nternational iz atio n") 。
```

**示例 2：**

```text
输入：word = "apple", abbr = "a2e"
输出：false
解释：单词 "apple" 无法缩写为 "a2e" 。
```

**提示：**

- `1 <= word.length <= 20`

- `word` 仅由小写英文字母组成

- `1 <= abbr.length <= 10`

- `abbr` 由小写英文字母和数字组成

- `abbr` 中的所有数字均符合 32-bit 整数范围

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「双指针, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以直接模拟字符匹配替换。

假设字符串 $word$ 和字符串 $abbr$ 的长度分别为 $m$ 和 $n$，我们使用两个指针 $i$ 和 $j$ 分别指向字符串 $word$ 和字符串 $abbr$ 的初始位置，用一个整型变量 $x$ 记录当前匹配到的 $abbr$ 的数字。

循环匹配字符串 $word$ 和字符串 $abbr$ 的每个字符：

如果指针 $j$ 指向的字符 $abbr[j]$ 是数字，如果 $abbr[j]$ 是 `'0'`，并且 $x$ 为 $0$，说明 $abbr$ 中的数字含有前导零，因此不是合法的缩写，返回 `false`；否则将 $x$ 更新为 $x \times 10 + abbr[j] - '0'$。

如果指针 $j$ 指向的字符 $abbr[j]$ 不是数字，那么我们此时将指针 $i$ 往前移动 $x$ 个位置，然后将 $x$ 重置为 $0$。如果此时 $i \geq m$ 或者 $word[i] \neq abbr[j]$，说明两个字符串无法匹配，返回 `false`；否则将指针 $i$ 往前移动 $1$ 个位置。

然后我们将指针 $j$ 往前移动 $1$ 个位置，重复上述过程，直到 $i$ 超出字符串 $word$ 的长度或者 $j$ 超出字符串 $abbr$ 的长度。

最后，如果 $i + x$ 等于 $m$ 且 $j$ 等于 $n$，说明字符串 $word$ 可以缩写成字符串 $abbr$，返回 `true`；否则返回 `false`。

时间复杂度 $O(m + n)$，其中 $m$ 和 $n$ 分别是字符串 $word$ 和字符串 $abbr$ 的长度。空间复杂度 $O(1)$。

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
// Valid Word Abbreviation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func validWordAbbreviation(word string, abbr string) bool {
	m, n := len(word), len(abbr)
	i, j, x := 0, 0, 0
	for ; i < m && j < n; j++ {
		if abbr[j] >= '0' && abbr[j] <= '9' {
			if x == 0 && abbr[j] == '0' {
				return false
			}
			x = x*10 + int(abbr[j]-'0')
		} else {
			i += x
			x = 0
			if i >= m || word[i] != abbr[j] {
				return false
			}
			i++
		}
	}
	return i+x == m && j == n
}
```

### Java

```java
// Valid Word Abbreviation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean validWordAbbreviation(String word, String abbr) {
        int m = word.length(), n = abbr.length();
        int i = 0, j = 0, x = 0;
        for (; i < m && j < n; ++j) {
            char c = abbr.charAt(j);
            if (Character.isDigit(c)) {
                if (c == '0' && x == 0) {
                    return false;
                }
                x = x * 10 + (c - '0');
            } else {
                i += x;
                x = 0;
                if (i >= m || word.charAt(i) != c) {
                    return false;
                }
                ++i;
            }
        }
        return i + x == m && j == n;
    }
}
```

### Python

```python
# Valid Word Abbreviation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def validWordAbbreviation(self, word: str, abbr: str) -> bool:
        m, n = len(word), len(abbr)
        i = j = x = 0
        while i < m and j < n:
            if abbr[j].isdigit():
                if abbr[j] == "0" and x == 0:
                    return False
                x = x * 10 + int(abbr[j])
            else:
                i += x
                x = 0
                if i >= m or word[i] != abbr[j]:
                    return False
                i += 1
            j += 1
        return i + x == m and j == n
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

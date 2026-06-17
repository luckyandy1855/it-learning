# 1309. Decrypt String from Alphabet to Integer Mapping

---
编号: 1309
题目: Decrypt String from Alphabet to Integer Mapping
难度: 简单
标签: [字符串]
来源链接: https://leetcode.com/problems/decrypt-string-from-alphabet-to-integer-mapping/
---

## 题目描述

给你一个字符串 `s`，它由数字（`'0'` - `'9'`）和 `'#'` 组成。我们希望按下述规则将 `s` 映射为一些小写英文字符：

- 字符（`'a'` - `'i'`）分别用（`'1'` - `'9'`）表示。

- 字符（`'j'` - `'z'`）分别用（`'10#'` - `'26#'`）表示。

返回映射之后形成的新字符串。

题目数据保证映射始终唯一。

**示例 1：**

```text
输入：s = "10#11#12"
输出："jkab"
解释："j" -> "10#" , "k" -> "11#" , "a" -> "1" , "b" -> "2".
```

**示例 2：**

```text
输入：s = "1326#"
输出："acz"
```

**提示：**

- `1 <= s.length <= 1000`

- `s[i]` 只包含数字（`'0'`-`'9'`）和 `'#'` 字符。

- `s` 是映射始终存在的有效字符串。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们直接模拟即可。

遍历字符串 $s$，对于当前遍历到的下标 $i$，如果 $i + 2 < n$ 且 $s[i + 2]$ 为 `#`，则将 $s[i]$ 和 $s[i + 1]$ 组成的字符串转换为整数，加上 `a` 的 ASCII 码值减去 1，然后转换为字符，添加到结果数组中，并将 $i$ 增加 3；否则，将 $s[i]$ 转换为整数，加上 `a` 的 ASCII 码值减去 1，然后转换为字符，添加到结果数组中，并将 $i$ 增加 1。

最后将结果数组转换为字符串返回即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 $s$ 的长度。

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
// Decrypt String from Alphabet to Integer Mapping：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func freqAlphabets(s string) string {
	var ans []byte
	for i, n := 0, len(s); i < n; {
		if i+2 < n && s[i+2] == '#' {
			num := (int(s[i])-'0')*10 + int(s[i+1]) - '0'
			ans = append(ans, byte(num+int('a')-1))
			i += 3
		} else {
			num := int(s[i]) - '0'
			ans = append(ans, byte(num+int('a')-1))
			i += 1
		}
	}
	return string(ans)
}
```

### Java

```java
// Decrypt String from Alphabet to Integer Mapping：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String freqAlphabets(String s) {
        int i = 0, n = s.length();
        StringBuilder ans = new StringBuilder();
        while (i < n) {
            if (i + 2 < n && s.charAt(i + 2) == '#') {
                ans.append((char) ('a' + Integer.parseInt(s.substring(i, i + 2)) - 1));
                i += 3;
            } else {
                ans.append((char) ('a' + Integer.parseInt(s.substring(i, i + 1)) - 1));
                i++;
            }
        }
        return ans.toString();
    }
}
```

### Python

```python
# Decrypt String from Alphabet to Integer Mapping：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def freqAlphabets(self, s: str) -> str:
        ans = []
        i, n = 0, len(s)
        while i < n:
            if i + 2 < n and s[i + 2] == "#":
                ans.append(chr(int(s[i : i + 2]) + ord("a") - 1))
                i += 3
            else:
                ans.append(chr(int(s[i]) + ord("a") - 1))
                i += 1
        return "".join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

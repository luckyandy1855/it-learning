# 0880. Decoded String at Index

---
编号: 880
题目: Decoded String at Index
难度: 中等
标签: [栈, 字符串]
来源链接: https://leetcode.com/problems/decoded-string-at-index/
---

## 题目描述

给定一个编码字符串 `s` 。请你找出* ***解码字符串** 并将其写入磁带。解码时，从编码字符串中** 每次读取一个字符 **，并采取以下步骤：

- 如果所读的字符是字母，则将该字母写在磁带上。

- 如果所读的字符是数字（例如 `d`），则整个当前磁带总共会被重复写 `d-1` 次。

现在，对于给定的编码字符串 `s` 和索引 `k`，查找并返回解码字符串中的第 `k` 个字母。

**示例 1：**

```text
输入：s = "leet2code3", k = 10
输出："o"
解释：
解码后的字符串为 "leetleetcodeleetleetcodeleetleetcode"。
字符串中的第 10 个字母是 "o"。
```

**示例 2：**

```text
输入：s = "ha22", k = 5
输出："h"
解释：
解码后的字符串为 "hahahaha"。第 5 个字母是 "h"。
```

**示例 3：**

```text
输入：s = "a2345678999999999999999", k = 1
输出："a"
解释：
解码后的字符串为 "a" 重复 8301530446056247680 次。第 1 个字母是 "a"。
```

**提示：**

- `2 <= s.length <= 100`

- `s` 只包含小写字母与数字 `2` 到 `9` 。

- `s` 以字母开头。

- `1 <= k <= 10^9`

- 题目保证 `k` 小于或等于解码字符串的长度。

- 解码后的字符串保证少于 `2^63` 个字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先计算出解码字符串的总长度 $m$，然后从后向前遍历字符串，每次更新 $k$ 为 $k \bmod m$，直到 $k$ 为 $0$ 且当前字符为字母，返回当前字符。否则，如果当前字符为数字，则将 $m$ 除以该数字。如果当前字符为字母，则将 $m$ 减 $1$。

时间复杂度 $O(n)$，其中 $n$ 为字符串的长度。空间复杂度 $O(1)$。

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
// Decoded String at Index：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func decodeAtIndex(s string, k int) string {
	m := 0
	for _, c := range s {
		if c >= '0' && c <= '9' {
			m *= int(c - '0')
		} else {
			m++
		}
	}
	for i := len(s) - 1; ; i-- {
		k %= m
		if k == 0 && s[i] >= 'a' && s[i] <= 'z' {
			return string(s[i])
		}
		if s[i] >= '0' && s[i] <= '9' {
			m /= int(s[i] - '0')
		} else {
			m--
		}
	}
}
```

### Java

```java
// Decoded String at Index：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String decodeAtIndex(String s, int k) {
        long m = 0;
        for (int i = 0; i < s.length(); ++i) {
            if (Character.isDigit(s.charAt(i))) {
                m *= (s.charAt(i) - '0');
            } else {
                ++m;
            }
        }
        for (int i = s.length() - 1;; --i) {
            k %= m;
            if (k == 0 && !Character.isDigit(s.charAt(i))) {
                return String.valueOf(s.charAt(i));
            }
            if (Character.isDigit(s.charAt(i))) {
                m /= (s.charAt(i) - '0');
            } else {
                --m;
            }
        }
    }
}
```

### Python

```python
# Decoded String at Index：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def decodeAtIndex(self, s: str, k: int) -> str:
        m = 0
        for c in s:
            if c.isdigit():
                m *= int(c)
            else:
                m += 1
        for c in s[::-1]:
            k %= m
            if k == 0 and c.isalpha():
                return c
            if c.isdigit():
                m //= int(c)
            else:
                m -= 1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

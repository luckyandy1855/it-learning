# 0917. Reverse Only Letters

---
编号: 917
题目: Reverse Only Letters
难度: 简单
标签: [双指针, 字符串]
来源链接: https://leetcode.com/problems/reverse-only-letters/
---

## 题目描述

给你一个字符串 `s` ，根据下述规则反转字符串：

- 所有非英文字母保留在原有位置。

- 所有英文字母（小写或大写）位置反转。

返回反转后的 `s`* 。*

**示例 1：**

```text
输入：s = "ab-cd"
输出："dc-ba"
```

**示例 2：**

```text
输入：s = "a-bC-dEf-ghIj"
输出："j-Ih-gfE-dCba"
```

**示例 3：**

```text
输入：s = "Test1ng-Leet=code-Q!"
输出："Qedo1ct-eeLg=ntse-T!"
```

**提示**

- `1 <= s.length <= 100`

- `s` 仅由 ASCII 值在范围 `[33, 122]` 的字符组成

- `s` 不含 `'\"'` 或 `'\\'`

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

我们用两个指针 $i$ 和 $j$ 分别指向字符串的头部和尾部。当 $i < j$ 时，我们不断地移动 $i$ 和 $j$，直到 $i$ 指向一个英文字母，并且 $j$ 指向一个英文字母，然后交换 $s[i]$ 和 $s[j]$。最后返回字符串即可。

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
// Reverse Only Letters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func reverseOnlyLetters(s string) string {
	cs := []rune(s)
	i, j := 0, len(s)-1
	for i < j {
		for i < j && !unicode.IsLetter(cs[i]) {
			i++
		}
		for i < j && !unicode.IsLetter(cs[j]) {
			j--
		}
		if i < j {
			cs[i], cs[j] = cs[j], cs[i]
			i++
			j--
		}
	}
	return string(cs)
}
```

### Java

```java
// Reverse Only Letters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String reverseOnlyLetters(String s) {
        char[] cs = s.toCharArray();
        int i = 0, j = cs.length - 1;
        while (i < j) {
            while (i < j && !Character.isLetter(cs[i])) {
                ++i;
            }
            while (i < j && !Character.isLetter(cs[j])) {
                --j;
            }
            if (i < j) {
                char t = cs[i];
                cs[i] = cs[j];
                cs[j] = t;
                ++i;
                --j;
            }
        }
        return new String(cs);
    }
}
```

### Python

```python
# Reverse Only Letters：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def reverseOnlyLetters(self, s: str) -> str:
        cs = list(s)
        i, j = 0, len(cs) - 1
        while i < j:
            while i < j and not cs[i].isalpha():
                i += 1
            while i < j and not cs[j].isalpha():
                j -= 1
            if i < j:
                cs[i], cs[j] = cs[j], cs[i]
                i, j = i + 1, j - 1
        return "".join(cs)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

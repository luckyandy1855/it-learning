# 1119. Remove Vowels from a String

---
编号: 1119
题目: Remove Vowels from a String
难度: 简单
标签: [字符串]
来源链接: https://leetcode.com/problems/remove-vowels-from-a-string/
---

## 题目描述

给你一个字符串 `s` ，请你删去其中的所有元音字母 `'a'`，`'e'`，`'i'`，`'o'`，`'u'`，并返回这个新字符串。

**示例 1：**

```text
输入：s = "leetcodeisacommunityforcoders"
输出："ltcdscmmntyfrcdrs"
```

**示例 2：**

```text
输入：s = "aeiou"
输出：""
```

**提示：**

- `1 <= S.length <= 1000`

- `s` 仅由小写英文字母组成

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

我们直接按照题目要求，遍历字符串，将不是元音字母的字符拼接到结果字符串中即可。

时间复杂度 $O(n)$，其中 $n$ 为字符串的长度。忽略答案字符串的空间消耗，空间复杂度 $O(1)$。

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
// Remove Vowels from a String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func removeVowels(s string) string {
	ans := []rune{}
	for _, c := range s {
		if !(c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
			ans = append(ans, c)
		}
	}
	return string(ans)
}
```

### Java

```java
// Remove Vowels from a String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String removeVowels(String s) {
        StringBuilder ans = new StringBuilder();
        for (int i = 0; i < s.length(); ++i) {
            char c = s.charAt(i);
            if (!(c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')) {
                ans.append(c);
            }
        }
        return ans.toString();
    }
}
```

### Python

```python
# Remove Vowels from a String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def removeVowels(self, s: str) -> str:
        return "".join(c for c in s if c not in "aeiou")
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

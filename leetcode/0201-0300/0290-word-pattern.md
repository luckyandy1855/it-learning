# 0290. Word Pattern

---
编号: 290
题目: Word Pattern
难度: 简单
标签: [哈希表, 字符串]
来源链接: https://leetcode.com/problems/word-pattern/
---

## 题目描述

给定一种规律 `pattern` 和一个字符串 `s` ，判断 `s` 是否遵循相同的规律。

这里的 **遵循 **指完全匹配，例如， `pattern` 里的每个字母和字符串 `s`** **中的每个非空单词之间存在着双向连接的对应规律。具体来说：

- `pattern` 中的每个字母都 **恰好** 映射到 `s` 中的一个唯一单词。

- `s` 中的每个唯一单词都 **恰好** 映射到 `pattern` 中的一个字母。

- 没有两个字母映射到同一个单词，也没有两个单词映射到同一个字母。

示例1:

```text
输入: pattern = "abba", s = "dog cat cat dog"
输出: true
```

示例 2:

```text
输入:pattern = "abba", s = "dog cat cat fish"
输出: false
```

示例 3:

```text
输入: pattern = "aaaa", s = "dog cat cat dog"
输出: false
```

**提示:**

- `1 <= pattern.length <= 300`

- `pattern` 只包含小写英文字母

- `1 <= s.length <= 3000`

- `s` 只包含小写英文字母和 `' '`

- `s` **不包含** 任何前导或尾随对空格

- `s` 中每个单词都被 **单个空格 **分隔

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先将字符串 $s$ 按照空格分割成单词数组 $ws$，如果 $pattern$ 和 $ws$ 的长度不相等，直接返回 `false`。否则，我们使用两个哈希表 $d_1$ 和 $d_2$，分别记录 $pattern$ 和 $ws$ 中每个字符和单词的对应关系。

接下来，我们遍历 $pattern$ 和 $ws$，对于每个字符 $a$ 和单词 $b$，如果 $d_1$ 中存在 $a$ 的映射，且映射的单词不是 $b$，或者 $d_2$ 中存在 $b$ 的映射，且映射的字符不是 $a$，则返回 `false`。否则，我们将 $a$ 和 $b$ 的映射分别加入 $d_1$ 和 $d_2$ 中。

遍历结束后，返回 `true`。

时间复杂度 $O(m + n)$，空间复杂度 $O(m + n)$。其中 $m$ 和 $n$ 分别是 $pattern$ 和字符串 $s$ 的长度。

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
// Word Pattern：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func wordPattern(pattern string, s string) bool {
	ws := strings.Split(s, " ")
	if len(ws) != len(pattern) {
		return false
	}
	d1 := map[rune]string{}
	d2 := map[string]rune{}
	for i, a := range pattern {
		b := ws[i]
		if v, ok := d1[a]; ok && v != b {
			return false
		}
		if v, ok := d2[b]; ok && v != a {
			return false
		}
		d1[a] = b
		d2[b] = a
	}
	return true
}
```

### Java

```java
import java.util.*;
// Word Pattern：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public boolean wordPattern(String pattern, String s) {
        String[] ws = s.split(" ");
        if (pattern.length() != ws.length) {
            return false;
        }
        Map<Character, String> d1 = new HashMap<>();
        Map<String, Character> d2 = new HashMap<>();
        for (int i = 0; i < ws.length; ++i) {
            char a = pattern.charAt(i);
            String b = ws[i];
            if (!d1.getOrDefault(a, b).equals(b) || d2.getOrDefault(b, a) != a) {
                return false;
            }
            d1.put(a, b);
            d2.put(b, a);
        }
        return true;
    }
}
```

### Python

```python
# Word Pattern：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        ws = s.split()
        if len(pattern) != len(ws):
            return False
        d1 = {}
        d2 = {}
        for a, b in zip(pattern, ws):
            if (a in d1 and d1[a] != b) or (b in d2 and d2[b] != a):
                return False
            d1[a] = b
            d2[b] = a
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

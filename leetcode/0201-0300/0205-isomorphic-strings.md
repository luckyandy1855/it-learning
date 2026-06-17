# 0205. Isomorphic Strings

---
编号: 205
题目: Isomorphic Strings
难度: 简单
标签: [哈希表, 字符串]
来源链接: https://leetcode.com/problems/isomorphic-strings/
---

## 题目描述

给定两个字符串 `s` 和 `t` ，判断它们是否是同构的。

如果 `s` 中的字符可以按某种映射关系替换得到 `t` ，那么这两个字符串是同构的。

每个出现的字符都应当映射到另一个字符，同时不改变字符的顺序。不同字符不能映射到同一个字符上，相同字符只能映射到同一个字符上，字符可以映射到自己本身。

示例 1：

输入：s = "egg", t = "add"

输出：true

**解释：**

字符串 `s` 和 `t` 可以通过以下方式变得相同：

- 将 `'e'` 映射为 `'a'`。

- 将 `'g'` 映射为 `'d'`。

示例 2：

输入：s = "f11", t = "b23"

输出：false

**解释：**

字符串 `s` 和 `t` 无法变得相同，因为 `'1'` 需要同时映射到 `'2'` 和 `'3'`。

示例 3：

输入：s = "paper", t = "title"

输出：true

**提示：**

- `1 <= s.length <= 5 * 10^4`

- `t.length == s.length`

- `s` 和 `t` 由任意有效的 ASCII 字符组成

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

我们可以用两个哈希表或数组 $d_1$ 和 $d_2$ 记录 $s$ 和 $t$ 中字符的映射关系。

遍历 $s$ 和 $t$，如果 $d_1$ 和 $d_2$ 中对应的字符映射关系不同，则返回 `false`，否则更新 $d_1$ 和 $d_2$ 中对应的字符映射关系。遍历结束，说明 $s$ 和 $t$ 是同构的，返回 `true`。

时间复杂度 $O(n)$，空间复杂度 $O(C)$。其中 $n$ 为字符串 $s$ 的长度；而 $C$ 为字符集大小，本题中 $C = 256$。

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
// Isomorphic Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isIsomorphic(s string, t string) bool {
	d1 := [256]int{}
	d2 := [256]int{}
	for i := range s {
		if d1[s[i]] != d2[t[i]] {
			return false
		}
		d1[s[i]] = i + 1
		d2[t[i]] = i + 1
	}
	return true
}
```

### Java

```java
import java.util.*;
// Isomorphic Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public boolean isIsomorphic(String s, String t) {
        Map<Character, Character> d1 = new HashMap<>();
        Map<Character, Character> d2 = new HashMap<>();
        int n = s.length();
        for (int i = 0; i < n; ++i) {
            char a = s.charAt(i), b = t.charAt(i);
            if (d1.containsKey(a) && d1.get(a) != b) {
                return false;
            }
            if (d2.containsKey(b) && d2.get(b) != a) {
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
# Isomorphic Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        d1 = {}
        d2 = {}
        for a, b in zip(s, t):
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

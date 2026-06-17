# 0161. One Edit Distance

---
编号: 161
题目: One Edit Distance
难度: 中等
标签: [双指针, 字符串]
来源链接: https://leetcode.com/problems/one-edit-distance/
---

## 题目描述

给定两个字符串 `s` 和 `t` ，如果它们的编辑距离为 `1` ，则返回 `true` ，否则返回 `false` 。

字符串 `s` 和字符串 `t` 之间满足编辑距离等于 1 有三种可能的情形：

	- 往 `s` 中插入 **恰好一个** 字符得到 `t`

	- 从 `s` 中删除 **恰好一个** 字符得到 `t`

	- 在 `s` 中用 **一个不同的字符** 替换 **恰好一个** 字符得到 `t`

**示例 1：**

```text
输入: s = "ab", t = "acb"
输出: true
解释: 可以将 'c' 插入字符串 s 来得到 t。
```

**示例 2:**

```text
输入: s = "cab", t = "ad"
输出: false
解释: 无法通过 1 步操作使 s 变为 t。
```

**提示:**

	- `0 <= s.length, t.length <= 10^4`

	- `s` 和 `t` 由小写字母，大写字母和数字组成

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

记 $m$ 表示字符串 $s$ 的长度，$n$ 表示字符串 $t$ 的长度。我们可以假定 $m$ 恒大于等于 $n$。

若 $m-n \gt 1$，直接返回 false；

否则，遍历 $s$ 和 $t$，若遇到 $s[i]$ 不等于 $t[i]$：

- 若 $m \neq n$，比较 $s[i+1:]$ 与 $t[i:]$，相等返回 true，否则返回 false；
- 若 $m = n$，比较 $s[i:]$ 与 $t[i:]$，相等返回 true，否则返回 false。

遍历结束，说明遍历过的 $s$ 跟 $t$ 所有字符相等，此时需要满足 $m=n+1$。

时间复杂度 $O(m)$，其中 $m$ 为字符串 $s$ 的长度。空间复杂度 $O(1)$。

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
// One Edit Distance：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isOneEditDistance(s string, t string) bool {
	m, n := len(s), len(t)
	if m < n {
		return isOneEditDistance(t, s)
	}
	if m-n > 1 {
		return false
	}
	for i := range t {
		if s[i] != t[i] {
			if m == n {
				return s[i+1:] == t[i+1:]
			}
			return s[i+1:] == t[i:]
		}
	}
	return m == n+1
}
```

### Java

```java
// One Edit Distance：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isOneEditDistance(String s, String t) {
        int m = s.length(), n = t.length();
        if (m < n) {
            return isOneEditDistance(t, s);
        }
        if (m - n > 1) {
            return false;
        }
        for (int i = 0; i < n; ++i) {
            if (s.charAt(i) != t.charAt(i)) {
                if (m == n) {
                    return s.substring(i + 1).equals(t.substring(i + 1));
                }
                return s.substring(i + 1).equals(t.substring(i));
            }
        }
        return m == n + 1;
    }
}
```

### Python

```python
# One Edit Distance：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isOneEditDistance(self, s: str, t: str) -> bool:
        if len(s) < len(t):
            return self.isOneEditDistance(t, s)
        m, n = len(s), len(t)
        if m - n > 1:
            return False
        for i, c in enumerate(t):
            if c != s[i]:
                return s[i + 1 :] == t[i + 1 :] if m == n else s[i + 1 :] == t[i:]
        return m == n + 1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

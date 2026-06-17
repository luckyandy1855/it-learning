# 0242. Valid Anagram

---
编号: 242
题目: Valid Anagram
难度: 简单
标签: [哈希表, 字符串, 排序]
来源链接: https://leetcode.com/problems/valid-anagram/
---

## 题目描述

给定两个字符串 `s` 和 `t` ，编写一个函数来判断 `t` 是否是 `s` 的 字母异位词。

**示例 1:**

```text
输入: s = "anagram", t = "nagaram"
输出: true
```

**示例 2:**

```text
输入: s = "rat", t = "car"
输出: false
```

**提示:**

- `1 <= s.length, t.length <= 5 * 10^4`

- `s` 和 `t` 仅包含小写字母

**进阶：**如果输入字符串包含 unicode 字符怎么办？你能否调整你的解法来应对这种情况？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先判断两个字符串的长度是否相等，如果不相等，说明两个字符串中的字符肯定不同，返回 `false`。

否则，我们用哈希表或者一个长度为 $26$ 的数组来记录字符串 $s$ 中每个字符出现的次数，然后遍历另一个字符串 $t$，每遍历到一个字符，就将哈希表中对应的字符次数减一，如果减一后的次数小于 $0$，说明该字符在两个字符串中出现的次数不同，返回 `false`。如果遍历完两个字符串后，哈希表中的所有字符次数都为 $0$，说明两个字符串中的字符出现次数相同，返回 `true`。

时间复杂度 $O(n)$，空间复杂度 $O(C)$，其中 $n$ 是字符串的长度；而 $C$ 是字符集的大小，本题中 $C=26$。

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
// Valid Anagram：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isAnagram(s string, t string) bool {
	if len(s) != len(t) {
		return false
	}
	cnt := [26]int{}
	for i := 0; i < len(s); i++ {
		cnt[s[i]-'a']++
		cnt[t[i]-'a']--
	}
	for _, v := range cnt {
		if v != 0 {
			return false
		}
	}
	return true
}
```

### Java

```java
import java.util.*;
// Valid Anagram：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        int[] cnt = new int[26];
        for (int i = 0; i < s.length(); ++i) {
            ++cnt[s.charAt(i) - 'a'];
            --cnt[t.charAt(i) - 'a'];
        }
        for (int i = 0; i < 26; ++i) {
            if (cnt[i] != 0) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Valid Anagram：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        cnt = Counter(s)
        for c in t:
            cnt[c] -= 1
            if cnt[c] < 0:
                return False
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

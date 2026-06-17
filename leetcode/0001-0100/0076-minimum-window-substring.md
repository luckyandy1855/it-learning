# 0076. Minimum Window Substring

---
编号: 76
题目: Minimum Window Substring
难度: 困难
标签: [哈希表, 字符串, 滑动窗口]
来源链接: https://leetcode.com/problems/minimum-window-substring/
---

## 题目描述

给定字符串 `s` 和 `t`，返回 `s` 中包含 `t` 所有字符（包括重复字符）的**最小子串**。若不存在这样的子串，返回空字符串 `""`。

### Example 1

```text
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
```

### Example 2

```text
Input: s = "a", t = "a"
Output: "a"
```

### Example 3

```text
Input: s = "a", t = "aa"
Output: ""
```

### 约束条件

- `1 <= s.length, t.length <= 10^5`
- `s` 和 `t` 由英文字母组成

## 思路分析

### 突破口

滑动窗口：右指针扩张窗口纳入字符，当窗口包含 t 的所有字符后，左指针收缩寻找最小窗口。

### 思路拆解

1. **频次表**：用 `need[c]` 记录 t 中每个字符需要的个数，`have[c]` 记录窗口内已有的个数，`formed` 记录已满足的字符种数（不是总字符数）。

2. **右指针扩张**：将 `s[r]` 加入窗口，若 `have[s[r]] == need[s[r]]`，则 `formed++`。

3. **左指针收缩**：当 `formed == 所需种数` 时，记录答案，然后收缩左边界；若移出 `s[l]` 后 `have[s[l]] < need[s[l]]`，则 `formed--`。

4. **记录最优**：维护最短窗口的起点和长度。

### 示意图

```text
s = "ADOBECODEBANC", t = "ABC"
need: A=1, B=1, C=1

r扩张到 "ADOBEC" 时 formed=3（含ABC）
l收缩: A→移走后formed=2，继续扩张
...
最终最小窗口: "BANC" (长度4)
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 滑动窗口 | O(|s| + |t|) | O(|Σ|) |

## 代码实现

### Go

```go
// minWindow 返回 s 中包含 t 所有字符的最小子串
func minWindow(s string, t string) string {
    need := make(map[byte]int)
    for i := range t {
        need[t[i]]++
    }

    have := make(map[byte]int)
    formed := 0
    required := len(need) // t 中不同字符的种数

    l, minLen, minStart := 0, len(s)+1, 0

    for r := 0; r < len(s); r++ {
        c := s[r]
        have[c]++
        if need[c] > 0 && have[c] == need[c] {
            formed++
        }

        for formed == required {
            if r-l+1 < minLen {
                minLen = r - l + 1
                minStart = l
            }
            lc := s[l]
            have[lc]--
            if need[lc] > 0 && have[lc] < need[lc] {
                formed--
            }
            l++
        }
    }

    if minLen == len(s)+1 {
        return ""
    }
    return s[minStart : minStart+minLen]
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回 s 中包含 t 所有字符的最小子串（滑动窗口）。
     */
    public String minWindow(String s, String t) {
        Map<Character, Integer> need = new HashMap<>(), have = new HashMap<>();
        for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);

        int formed = 0, required = need.size();
        int l = 0, minLen = Integer.MAX_VALUE, minStart = 0;

        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            have.merge(c, 1, Integer::sum);
            if (need.containsKey(c) && have.get(c).equals(need.get(c))) formed++;

            while (formed == required) {
                if (r - l + 1 < minLen) { minLen = r - l + 1; minStart = l; }
                char lc = s.charAt(l);
                have.merge(lc, -1, Integer::sum);
                if (need.containsKey(lc) && have.get(lc) < need.get(lc)) formed--;
                l++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }
}
```

### Python

```python
from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        """
        返回 s 中包含 t 所有字符的最小子串（滑动窗口）。
        """
        need = Counter(t)
        have = {}
        formed = 0
        required = len(need)
        l = 0
        min_len, min_start = float('inf'), 0

        for r, c in enumerate(s):
            have[c] = have.get(c, 0) + 1
            if c in need and have[c] == need[c]:
                formed += 1

            while formed == required:
                if r - l + 1 < min_len:
                    min_len, min_start = r - l + 1, l
                lc = s[l]
                have[lc] -= 1
                if lc in need and have[lc] < need[lc]:
                    formed -= 1
                l += 1

        return '' if min_len == float('inf') else s[min_start:min_start + min_len]
```

## 踩坑记录

- **`formed` 基于字符种数而非总字符数**：只有当某字符的 `have == need`（恰好满足）时才 `formed++`，超出需求不再加，防止误判。
- **Java 中比较 Integer 对象用 `.equals()` 而非 `==`**：`have.get(c) == need.get(c)` 比较的是对象引用（值大时不等），应用 `.equals()` 或拆箱为 `int`。
- **收缩时先记录答案再移动左指针**：确保记录的是当前有效最小窗口，收缩后才能判断是否仍满足条件。

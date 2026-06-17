# 0003. Longest Substring Without Repeating Characters

---
编号: 3
题目: Longest Substring Without Repeating Characters
难度: 中等
标签: [哈希表, 字符串, 滑动窗口]
来源链接: https://leetcode.com/problems/longest-substring-without-repeating-characters/
---

## 题目描述

给定一个字符串 `s`，找出其中**不含重复字符的最长子串**的长度。

题目保证：

- 子串是连续的字符序列（不是子序列）。
- 字符集包含英文字母、数字、符号和空格。

### Example 1

```text
Input: s = "abcabcbb"
Output: 3
Explanation: 不含重复字符的最长子串是 "abc"，长度为 3。
```

### Example 2

```text
Input: s = "bbbbb"
Output: 1
Explanation: 不含重复字符的最长子串是 "b"，长度为 1。
```

### Example 3

```text
Input: s = "pwwkew"
Output: 3
Explanation: 不含重复字符的最长子串是 "wke"，长度为 3。注意 "pwke" 是子序列，不是子串。
```

### 约束条件

- `0 <= s.length <= 5 * 10^4`
- `s` 由英文字母、数字、符号和空格组成。

## 思路分析

### 突破口

维护一个"滑动窗口"，用哈希表记录窗口内每个字符最近一次出现的位置。遇到重复字符时，把窗口左边界跳到重复字符上次出现位置的下一位。

### 思路拆解

1. **暴力解**：枚举所有子串起点和终点，逐一检查是否含重复字符，O(n³) 或 O(n²)，太慢。

2. **问题转化**：对于每个右指针 `r`，我们想知道以 `r` 结尾的无重复子串最长能到哪。只要知道窗口左边界 `l` 的最优位置，就不需要重新扫描。

3. **优化方向**：滑动窗口 + 哈希表。哈希表存 `{字符 → 最后一次出现的下标}`。右指针右移时，若当前字符已在窗口内（`lastSeen[c] >= l`），则把左边界跳到 `lastSeen[c] + 1`；否则只更新哈希表。

4. **实现要点**：左边界只能向右移（`l = max(l, lastSeen[c]+1)`），不能向左退。每步更新 `maxLen = max(maxLen, r-l+1)`。

### 示意图

```text
s = "abcabcbb"

r=0: 窗口=[a]          l=0  map={a:0}  len=1
r=1: 窗口=[ab]         l=0  map={a:0,b:1}  len=2
r=2: 窗口=[abc]        l=0  map={a:0,b:1,c:2}  len=3
r=3: s[3]='a' 重复!    l=max(0,0+1)=1  map={a:3,...}  len=3
r=4: s[4]='b' 重复!    l=max(1,1+1)=2  map={b:4,...}  len=3
r=5: s[5]='c' 重复!    l=max(2,2+1)=3  map={c:5,...}  len=3
r=6: s[6]='b' 重复!    l=max(3,4+1)=5  map={b:6,...}  len=2
r=7: s[7]='b' 重复!    l=max(5,6+1)=7  map={b:7,...}  len=1

最终 maxLen = 3
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 暴力枚举 | O(n²) ~ O(n³) | O(min(n, charset)) |
| 滑动窗口 + 哈希表 | O(n) | O(min(n, charset)) |

## 代码实现

### Go

```go
// lengthOfLongestSubstring 用滑动窗口找无重复字符的最长子串长度
// 参数：s 输入字符串
// 返回：最长无重复子串的长度
func lengthOfLongestSubstring(s string) int {
    // lastSeen 记录每个字符最后一次出现的下标
    lastSeen := make(map[byte]int)
    maxLen := 0
    l := 0 // 窗口左边界

    for r := 0; r < len(s); r++ {
        c := s[r]
        // 若 c 在当前窗口内出现过，左边界跳到其上次位置的下一位
        // 注意：必须用 max，防止左边界向左退（lastSeen 中可能有窗口外的旧记录）
        if idx, ok := lastSeen[c]; ok && idx >= l {
            l = idx + 1
        }
        lastSeen[c] = r
        if r-l+1 > maxLen {
            maxLen = r - l + 1
        }
    }
    return maxLen
}
```

### Java

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * 用滑动窗口找无重复字符的最长子串长度。
     *
     * @param s 输入字符串
     * @return 最长无重复子串的长度
     */
    public int lengthOfLongestSubstring(String s) {
        // lastSeen 记录每个字符最后一次出现的下标
        Map<Character, Integer> lastSeen = new HashMap<>();
        int maxLen = 0;
        int l = 0; // 窗口左边界

        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            // 若 c 在当前窗口内出现过，左边界跳到其上次位置的下一位
            if (lastSeen.containsKey(c) && lastSeen.get(c) >= l) {
                l = lastSeen.get(c) + 1;
            }
            lastSeen.put(c, r);
            maxLen = Math.max(maxLen, r - l + 1);
        }
        return maxLen;
    }
}
```

### Python

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        """
        用滑动窗口找无重复字符的最长子串长度。

        参数:
            s: 输入字符串
        返回:
            最长无重复子串的长度
        """
        last_seen = {}  # 记录每个字符最后一次出现的下标
        max_len = 0
        l = 0  # 窗口左边界

        for r, c in enumerate(s):
            # 若 c 在当前窗口内出现过，左边界跳到其上次位置的下一位
            if c in last_seen and last_seen[c] >= l:
                l = last_seen[c] + 1
            last_seen[c] = r
            max_len = max(max_len, r - l + 1)

        return max_len
```

## 踩坑记录

- **左边界不能向左退**：哈希表里可能存有窗口左侧的旧记录（被挤出窗口的字符）。更新左边界时必须取 `max(l, lastSeen[c]+1)`，否则左边界会错误地向左跳。
- **空字符串**：`s = ""` 时直接返回 0，代码不进入循环自然成立，不需要特判。
- **全重复字符**：如 `"bbbbb"`，每次右移右指针都会触发左边界移动，窗口大小始终为 1，最终返回 1，逻辑正确。

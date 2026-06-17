# 0424. Longest Repeating Character Replacement

---
编号: 424
题目: Longest Repeating Character Replacement
难度: 中等
标签: [哈希表, 字符串, 滑动窗口]
来源链接: https://leetcode.com/problems/longest-repeating-character-replacement/
---

## 题目描述

给你一个字符串 `s` 和一个整数 `k` 。你可以选择字符串中的任一字符，并将其更改为任何其他大写英文字符。该操作最多可执行 `k` 次。

在执行上述操作后，返回 *包含相同字母的最长子字符串的长度。*

**示例 1：**

```text
输入：s = "ABAB", k = 2
输出：4
解释：用两个'A'替换为两个'B',反之亦然。
```

**示例 2：**

```text
输入：s = "AABABBA", k = 1
输出：4
解释：
将中间的一个'A'替换为'B',字符串变为 "AABBBBA"。
子串 "BBBB" 有最长重复字母, 答案为 4。
可能存在其他的方法来得到同样的结果。
```

**提示：**

- `1 <= s.length <= 10^5`

- `s` 仅由大写英文字母组成

- `0 <= k <= s.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们使用一个哈希表 `cnt` 统计字符串中每个字符出现的次数，使用双指针 `l` 和 `r` 维护一个滑动窗口，使得窗口的大小减去出现次数最多的字符的次数，结果不超过 $k$。

我们遍历字符串，每次更新窗口的右边界 `r`，并更新窗口内的字符出现次数，同时更新出现过的字符的最大出现次数 `mx`。当窗口的大小减去 `mx` 大于 $k$ 时，我们需要缩小窗口的左边界 `l`，同时更新窗口内的字符出现次数，直到窗口的大小减去 `mx` 不大于 $k$。

最后，答案为 $n - l$，其中 $n$ 为字符串的长度。

时间复杂度 $O(n)$，空间复杂度 $O(|\Sigma|)$。其中 $n$ 为字符串的长度，而 $|\Sigma|$ 为字符集的大小，本题中字符集为大写英文字母，所以 $|\Sigma| = 26$。

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
// Longest Repeating Character Replacement：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func characterReplacement(s string, k int) int {
	cnt := [26]int{}
	l, mx := 0, 0
	for r, c := range s {
		cnt[c-'A']++
		mx = max(mx, cnt[c-'A'])
		if r-l+1-mx > k {
			cnt[s[l]-'A']--
			l++
		}
	}
	return len(s) - l
}
```

### Java

```java
// Longest Repeating Character Replacement：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int characterReplacement(String s, int k) {
        int[] cnt = new int[26];
        int l = 0, mx = 0;
        int n = s.length();
        for (int r = 0; r < n; ++r) {
            mx = Math.max(mx, ++cnt[s.charAt(r) - 'A']);
            if (r - l + 1 - mx > k) {
                --cnt[s.charAt(l++) - 'A'];
            }
        }
        return n - l;
    }
}
```

### Python

```python
# Longest Repeating Character Replacement：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        cnt = Counter()
        l = mx = 0
        for r, c in enumerate(s):
            cnt[c] += 1
            mx = max(mx, cnt[c])
            if r - l + 1 - mx > k:
                cnt[s[l]] -= 1
                l += 1
        return len(s) - l
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

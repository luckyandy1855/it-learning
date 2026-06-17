# 1371. Find the Longest Substring Containing Vowels in Even Counts

---
编号: 1371
题目: Find the Longest Substring Containing Vowels in Even Counts
难度: 中等
标签: [位运算, 哈希表, 字符串, 前缀和]
来源链接: https://leetcode.com/problems/find-the-longest-substring-containing-vowels-in-even-counts/
---

## 题目描述

给你一个字符串 `s` ，请你返回满足以下条件的最长子字符串的长度：每个元音字母，即 &#39;a&#39;，&#39;e&#39;，&#39;i&#39;，&#39;o&#39;，&#39;u&#39; ，在子字符串中都恰好出现了偶数次。

**示例 1：**

```text
输入：s = "eleetminicoworoep"
输出：13
解释：最长子字符串是 "leetminicowor" ，它包含 e，i，o 各 2 个，以及 0 个 a，u 。
```

**示例 2：**

```text
输入：s = "leetcodeisgreat"
输出：5
解释：最长子字符串是 "leetc" ，其中包含 2 个 e 。
```

**示例 3：**

```text
输入：s = "bcbcbc"
输出：6
解释：这个示例中，字符串 "bcbcbc" 本身就是最长的，因为所有的元音 a，e，i，o，u 都出现了 0 次。
```

**提示：**

- `1 <= s.length <= 5 x 10^5`

- `s` 只包含小写英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 哈希表, 字符串, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，如果我们用一个数字表示字符串 $\textit{s}$ 的某个前缀中每个元音字母出现的次数的奇偶性，那么当两个前缀的这个数字相同时，这两个前缀的交集就是一个符合条件的子字符串。

我们可以用一个二进制数的低五位分别表示五个元音字母的奇偶性，其中第 $i$ 位为 $1$ 表示该元音字母在子字符串中出现了奇数次，为 $0$ 表示该元音字母在子字符串中出现了偶数次。

我们用 $\textit{mask}$ 表示这个二进制数，用一个数组或哈希表 $\textit{d}$ 记录每个 $\textit{mask}$ 第一次出现的位置。初始时，我们将 $\textit{d}[0] = -1$，表示空字符串的开始位置为 $-1$。

遍历字符串 $\textit{s}$，如果遇到元音字母，就将 $\textit{mask}$ 的对应位取反。接下来，我们判断 $\textit{mask}$ 是否在之前出现过，如果出现过，那么我们就找到了一个符合条件的子字符串，其长度为当前位置减去 $\textit{mask}$ 上一次出现的位置。否则，我们将 $\textit{mask}$ 的当前位置存入 $\textit{d}$。

遍历结束后，我们就找到了最长的符合条件的子字符串。

时间复杂度 $O(n)$，其中 $n$ 为字符串 $\textit{s}$ 的长度。空间复杂度 $O(1)$。

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
// Find the Longest Substring Containing Vowels in Even Counts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findTheLongestSubstring(s string) (ans int) {
    vowels := "aeiou"
    d := [32]int{}
    for i := range d {
        d[i] = 1 << 29
    }
    d[0] = 0
    mask := 0
    for i := 1; i <= len(s); i++ {
        c := s[i-1]
        for j := 0; j < 5; j++ {
            if c == vowels[j] {
                mask ^= 1 << j
                break
            }
        }
        ans = max(ans, i-d[mask])
        d[mask] = min(d[mask], i)
    }
    return
}
```

### Java

```java
// Find the Longest Substring Containing Vowels in Even Counts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findTheLongestSubstring(String s) {
        String vowels = "aeiou";
        int[] d = new int[32];
        Arrays.fill(d, 1 << 29);
        d[0] = 0;
        int ans = 0, mask = 0;
        for (int i = 1; i <= s.length(); ++i) {
            char c = s.charAt(i - 1);
            for (int j = 0; j < 5; ++j) {
                if (c == vowels.charAt(j)) {
                    mask ^= 1 << j;
                    break;
                }
            }
            ans = Math.max(ans, i - d[mask]);
            d[mask] = Math.min(d[mask], i);
        }
        return ans;
    }
}
```

### Python

```python
# Find the Longest Substring Containing Vowels in Even Counts：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findTheLongestSubstring(self, s: str) -> int:
        d = {0: -1}
        ans = mask = 0
        for i, c in enumerate(s):
            if c in "aeiou":
                mask ^= 1 << (ord(c) - ord("a"))
            if mask in d:
                j = d[mask]
                ans = max(ans, i - j)
            else:
                d[mask] = i
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

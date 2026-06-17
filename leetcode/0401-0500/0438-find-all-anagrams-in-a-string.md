# 0438. Find All Anagrams in a String

---
编号: 438
题目: Find All Anagrams in a String
难度: 中等
标签: [哈希表, 字符串, 滑动窗口]
来源链接: https://leetcode.com/problems/find-all-anagrams-in-a-string/
---

## 题目描述

给定两个字符串 `s` 和 `p`，找到 `s`** **中所有 `p`** **的 **异位词 **的子串，返回这些子串的起始索引。不考虑答案输出的顺序。

**示例 1:**

```text
输入: s = "cbaebabacd", p = "abc"
输出: [0,6]
解释:
起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。
```

** 示例 2:**

```text
输入: s = "abab", p = "ab"
输出: [0,1,2]
解释:
起始索引等于 0 的子串是 "ab", 它是 "ab" 的异位词。
起始索引等于 1 的子串是 "ba", 它是 "ab" 的异位词。
起始索引等于 2 的子串是 "ab", 它是 "ab" 的异位词。
```

**提示:**

- `1 <= s.length, p.length <= 3 * 10^4`

- `s` 和 `p` 仅包含小写字母

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

我们不妨设字符串 $s$ 的长度为 $m$，字符串 $p$ 的长度为 $n$。

如果 $m \lt n$，那么 $s$ 中不可能存在任何一个子串同 $p$ 为异位词，返回空列表即可。

当 $m \ge n$ 时，我们可以使用一个固定长度为 $n$ 的滑动窗口来维护 $s$ 的子串。为了判断子串是否为 $p$ 的异位词，我们可以用一个固定长度为 $26$ 的数组 $cnt1$ 记录 $p$ 中每个字母的出现次数，再用另一个数组 $cnt2$ 记录当前滑动窗口中每个字母的出现次数，如果这两个数组相同，那么当前滑动窗口的子串就是 $p$ 的异位词，我们记录下起始位置。

时间复杂度 $O(m \times C)$，空间复杂度 $O(C)$。其中 $m$ 是字符串 $s$ 的长度；而 $C$ 是字符集大小，在本题中字符集为所有小写字母，所以 $C = 26$。

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
// Find All Anagrams in a String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findAnagrams(s string, p string) (ans []int) {
	m, n := len(s), len(p)
	if m < n {
		return
	}
	cnt1 := [26]int{}
	cnt2 := [26]int{}
	for _, c := range p {
		cnt1[c-'a']++
	}
	for _, c := range s[:n-1] {
		cnt2[c-'a']++
	}
	for i := n - 1; i < m; i++ {
		cnt2[s[i]-'a']++
		if cnt1 == cnt2 {
			ans = append(ans, i-n+1)
		}
		cnt2[s[i-n+1]-'a']--
	}
	return
}
```

### Java

```java
// Find All Anagrams in a String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        int m = s.length(), n = p.length();
        List<Integer> ans = new ArrayList<>();
        if (m < n) {
            return ans;
        }
        int[] cnt1 = new int[26];
        for (int i = 0; i < n; ++i) {
            ++cnt1[p.charAt(i) - 'a'];
        }
        int[] cnt2 = new int[26];
        for (int i = 0; i < n - 1; ++i) {
            ++cnt2[s.charAt(i) - 'a'];
        }
        for (int i = n - 1; i < m; ++i) {
            ++cnt2[s.charAt(i) - 'a'];
            if (Arrays.equals(cnt1, cnt2)) {
                ans.add(i - n + 1);
            }
            --cnt2[s.charAt(i - n + 1) - 'a'];
        }
        return ans;
    }
}
```

### Python

```python
# Find All Anagrams in a String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        m, n = len(s), len(p)
        ans = []
        if m < n:
            return ans
        cnt1 = Counter(p)
        cnt2 = Counter(s[: n - 1])
        for i in range(n - 1, m):
            cnt2[s[i]] += 1
            if cnt1 == cnt2:
                ans.append(i - n + 1)
            cnt2[s[i - n + 1]] -= 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

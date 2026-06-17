# 0395. Longest Substring with At Least K Repeating Characters

---
编号: 395
题目: Longest Substring with At Least K Repeating Characters
难度: 中等
标签: [哈希表, 字符串, 分治, 滑动窗口]
来源链接: https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/
---

## 题目描述

给你一个字符串 `s` 和一个整数 `k` ，请你找出 `s` 中的最长子串， 要求该子串中的每一字符出现次数都不少于 `k` 。返回这一子串的长度。

如果不存在这样的子字符串，则返回 0。

**示例 1：**

```text
输入：s = "aaabb", k = 3
输出：3
解释：最长子串为 "aaa" ，其中 'a' 重复了 3 次。
```

**示例 2：**

```text
输入：s = "ababbc", k = 2
输出：5
解释：最长子串为 "ababb" ，其中 'a' 重复了 2 次， 'b' 重复了 3 次。
```

**提示：**

	- `1 <= s.length <= 10^4`

	- `s` 仅由小写英文字母组成

	- `1 <= k <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串, 分治, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

对于字符串 $s$，如果存在某个字符 $c$，其出现次数小于 $k$，则任何包含 $c$ 的子串都不可能满足题目要求。因此我们可以将 $s$ 按照每个不满足条件的字符 $c$ 进行分割，分割得到的每个子串都是原字符串的一个「子问题」，我们可以递归地求解每个子问题，最终的答案即为所有子问题的最大值。

时间复杂度 $O(n \times C)$，空间复杂度 $O(C^2)$。其中 $n$ 为字符串 $s$ 的长度，而 $C$ 为字符集的大小。本题中 $C \leq 26$。

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
// Longest Substring with At Least K Repeating Characters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func longestSubstring(s string, k int) int {
	var dfs func(l, r int) int
	dfs = func(l, r int) int {
		cnt := [26]int{}
		for i := l; i <= r; i++ {
			cnt[s[i]-'a']++
		}
		var split byte
		for i, v := range cnt {
			if v > 0 && v < k {
				split = byte(i + 'a')
				break
			}
		}
		if split == 0 {
			return r - l + 1
		}
		i := l
		ans := 0
		for i <= r {
			for i <= r && s[i] == split {
				i++
			}
			if i > r {
				break
			}
			j := i
			for j <= r && s[j] != split {
				j++
			}
			t := dfs(i, j-1)
			ans = max(ans, t)
			i = j
		}
		return ans
	}
	return dfs(0, len(s)-1)
}
```

### Java

```java
// Longest Substring with At Least K Repeating Characters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private String s;
    private int k;

    public int longestSubstring(String s, int k) {
        this.s = s;
        this.k = k;
        return dfs(0, s.length() - 1);
    }

    private int dfs(int l, int r) {
        int[] cnt = new int[26];
        for (int i = l; i <= r; ++i) {
            ++cnt[s.charAt(i) - 'a'];
        }
        char split = 0;
        for (int i = 0; i < 26; ++i) {
            if (cnt[i] > 0 && cnt[i] < k) {
                split = (char) (i + 'a');
                break;
            }
        }
        if (split == 0) {
            return r - l + 1;
        }
        int i = l;
        int ans = 0;
        while (i <= r) {
            while (i <= r && s.charAt(i) == split) {
                ++i;
            }
            if (i > r) {
                break;
            }
            int j = i;
            while (j <= r && s.charAt(j) != split) {
                ++j;
            }
            int t = dfs(i, j - 1);
            ans = Math.max(ans, t);
            i = j;
        }
        return ans;
    }
}
```

### Python

```python
# Longest Substring with At Least K Repeating Characters：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def longestSubstring(self, s: str, k: int) -> int:
        def dfs(l, r):
            cnt = Counter(s[l : r + 1])
            split = next((c for c, v in cnt.items() if v < k), '')
            if not split:
                return r - l + 1
            i = l
            ans = 0
            while i <= r:
                while i <= r and s[i] == split:
                    i += 1
                if i >= r:
                    break
                j = i
                while j <= r and s[j] != split:
                    j += 1
                t = dfs(i, j - 1)
                ans = max(ans, t)
                i = j
            return ans

        return dfs(0, len(s) - 1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

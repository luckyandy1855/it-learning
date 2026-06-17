# 1347. Minimum Number of Steps to Make Two Strings Anagram

---
编号: 1347
题目: Minimum Number of Steps to Make Two Strings Anagram
难度: 中等
标签: [哈希表, 字符串, 计数]
来源链接: https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram/
---

## 题目描述

给你两个长度相等的字符串 `s` 和 `t`。每一个步骤中，你可以选择将 `t` 中的 **任一字符** 替换为 **另一个字符**。

返回使 `t` 成为 `s` 的字母异位词的最小步骤数。

**字母异位词** 指字母相同，但排列不同（也可能相同）的字符串。

**示例 1：**

```text
输出：s = "bab", t = "aba"
输出：1
提示：用 &#39;b&#39; 替换 t 中的第一个 &#39;a&#39;，t = "bba" 是 s 的一个字母异位词。
```

**示例 2：**

```text
输出：s = "leetcode", t = "practice"
输出：5
提示：用合适的字符替换 t 中的 &#39;p&#39;, &#39;r&#39;, &#39;a&#39;, &#39;i&#39; 和 &#39;c&#39;，使 t 变成 s 的字母异位词。
```

**示例 3：**

```text
输出：s = "anagram", t = "mangaar"
输出：0
提示："anagram" 和 "mangaar" 本身就是一组字母异位词。
```

**示例 4：**

```text
输出：s = "xxyyzz", t = "xxyyzz"
输出：0
```

**示例 5：**

```text
输出：s = "friend", t = "family"
输出：4
```

**提示：**

- `1 <= s.length <= 50000`

- `s.length == t.length`

- `s` 和 `t` 只包含小写英文字母

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用一个哈希表或者数组 $\textit{cnt}$ 来统计字符串 $\textit{s}$ 中每个字符出现的次数，然后遍历字符串 $\textit{t}$，对于每个字符，我们在 $\textit{cnt}$ 中将其出现的次数减一，如果减一后的值小于 $0$，说明这个字符在字符串 $\textit{t}$ 中出现的次数比在字符串 $\textit{s}$ 中多，我们需要将这个字符替换掉，将答案加一。

遍历结束后，返回答案即可。

时间复杂度 $O(m + n)$，空间复杂度 $O(|\Sigma|)$，其中 $m$ 和 $n$ 分别是字符串 $\textit{s}$ 和 $\textit{t}$ 的长度，而 $|\Sigma|$ 是字符集的大小，本题中字符集为小写字母，因此 $|\Sigma| = 26$。

#### Python3

```python
class Solution:
    def minSteps(self, s: str, t: str) -> int:
        cnt = Counter(s)
        ans = 0
        for c in t:
            cnt[c] -= 1
            ans += cnt[c] < 0
        return ans
```

#### Java

```java
class Solution {
    public int minSteps(String s, String t) {
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) {
            cnt[c - 'a']++;
        }
        int ans = 0;
        for (char c : t.toCharArray()) {
            if (--cnt[c - 'a'] < 0) {
                ans++;
            }
        }
        return ans;
    }
}
```

#### C++

```cpp
class Solution {
public:
    int minSteps(string s, string t) {
        int cnt[26]{};
        for (char c : s) {
            ++cnt[c - 'a'];
        }
        int ans = 0;
        for (char c : t) {
            if (--cnt[c - 'a'] < 0) {
                ++ans;
            }
        }
        return ans;
    }
};
```

#### Go

```go
func minSteps(s string, t string) (ans int) {
	cnt := [26]int{}
	for _, c := range s {
		cnt[c-'a']++
	}
	for _, c := range t {
		cnt[c-'a']--
		if cnt[c-'a'] < 0 {
			ans++
		}
	}
	return
}
```

#### TypeScript

```ts
function minSteps(s: string, t: string): number {
    const cnt: number[] = Array(26).fill(0);
    for (const c of s) {
        ++cnt[c.charCodeAt(0) - 97];
    }
    let ans = 0;
    for (const c of t) {
        if (--cnt[c.charCodeAt(0) - 97] < 0) {
            ++ans;
        }
    }
    return ans;
}
```

#### JavaScript

```js
/**
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
var minSteps = function (s, t) {
    const cnt = Array(26).fill(0);
    for (const c of s) {
        ++cnt[c.charCodeAt(0) - 97];
    }
    let ans = 0;
    for (const c of t) {
        if (--cnt[c.charCodeAt(0) - 97] < 0) {
            ++ans;
        }
    }
    return ans;
};
```

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
// Minimum Number of Steps to Make Two Strings Anagram：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minSteps(s string, t string) (ans int) {
	cnt := [26]int{}
	for _, c := range s {
		cnt[c-'a']++
	}
	for _, c := range t {
		cnt[c-'a']--
		if cnt[c-'a'] < 0 {
			ans++
		}
	}
	return
}
```

### Java

```java
// Minimum Number of Steps to Make Two Strings Anagram：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minSteps(String s, String t) {
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) {
            cnt[c - 'a']++;
        }
        int ans = 0;
        for (char c : t.toCharArray()) {
            if (--cnt[c - 'a'] < 0) {
                ans++;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Minimum Number of Steps to Make Two Strings Anagram：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minSteps(self, s: str, t: str) -> int:
        cnt = Counter(s)
        ans = 0
        for c in t:
            cnt[c] -= 1
            ans += cnt[c] < 0
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

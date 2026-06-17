# 1156. Swap For Longest Repeated Character Substring

---
编号: 1156
题目: Swap For Longest Repeated Character Substring
难度: 中等
标签: [哈希表, 字符串, 滑动窗口]
来源链接: https://leetcode.com/problems/swap-for-longest-repeated-character-substring/
---

## 题目描述

如果字符串中的所有字符都相同，那么这个字符串是单字符重复的字符串。

给你一个字符串 `text`，你只能交换其中两个字符一次或者什么都不做，然后得到一些单字符重复的子串。返回其中最长的子串的长度。

**示例 1：**

```text
输入：text = "ababa"
输出：3
```

**示例 2：**

```text
输入：text = "aaabaaa"
输出：6
```

**示例 3：**

```text
输入：text = "aaabbaaa"
输出：4
```

**示例 4：**

```text
输入：text = "aaaaa"
输出：5
```

**示例 5：**

```text
输入：text = "abcdef"
输出：1
```

**提示：**

- `1 <= text.length <= 20000`

- `text` 仅由小写英文字母组成。

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

我们先用哈希表或数组 $cnt$ 统计字符串 $text$ 中每个字符出现的次数。

接下来，我们定义一个指针 $i$，初始时 $i = 0$。每一次，我们将指针 $j$ 指向 $i$，并不断地向右移动 $j$，直到 $j$ 指向的字符与 $i$ 指向的字符不同，此时我们得到了一个长度为 $l = j - i$ 的子串 $text[i..j-1]$，其中所有字符都相同。

然后我们跳过指针 $j$ 指向的字符，用指针 $k$ 继续向右移动，直到 $k$ 指向的字符与 $i$ 指向的字符不同，此时我们得到了一个长度为 $r = k - j - 1$ 的子串 $text[j+1..k-1]$，其中所有字符都相同。那么我们最多通过一次交换操作，可以得到的最长单字符重复子串的长度为 $\min(l + r + 1, cnt[text[i]])$。接下来，我们将指针 $i$ 移动到 $j$，继续寻找下一个子串。我们取所有满足条件的子串的最大长度即可。

时间复杂度为 $O(n)$，空间复杂度 $O(C)$。其中 $n$ 为字符串的长度；而 $C$ 为字符集的大小，本题中 $C = 26$。

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
// Swap For Longest Repeated Character Substring：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxRepOpt1(text string) (ans int) {
	cnt := [26]int{}
	for _, c := range text {
		cnt[c-'a']++
	}
	n := len(text)
	for i, j := 0, 0; i < n; i = j {
		j = i
		for j < n && text[j] == text[i] {
			j++
		}
		l := j - i
		k := j + 1
		for k < n && text[k] == text[i] {
			k++
		}
		r := k - j - 1
		ans = max(ans, min(l+r+1, cnt[text[i]-'a']))
	}
	return
}
```

### Java

```java
// Swap For Longest Repeated Character Substring：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxRepOpt1(String text) {
        int[] cnt = new int[26];
        int n = text.length();
        for (int i = 0; i < n; ++i) {
            ++cnt[text.charAt(i) - 'a'];
        }
        int ans = 0, i = 0;
        while (i < n) {
            int j = i;
            while (j < n && text.charAt(j) == text.charAt(i)) {
                ++j;
            }
            int l = j - i;
            int k = j + 1;
            while (k < n && text.charAt(k) == text.charAt(i)) {
                ++k;
            }
            int r = k - j - 1;
            ans = Math.max(ans, Math.min(l + r + 1, cnt[text.charAt(i) - 'a']));
            i = j;
        }
        return ans;
    }
}
```

### Python

```python
# Swap For Longest Repeated Character Substring：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxRepOpt1(self, text: str) -> int:
        cnt = Counter(text)
        n = len(text)
        ans = i = 0
        while i < n:
            j = i
            while j < n and text[j] == text[i]:
                j += 1
            l = j - i
            k = j + 1
            while k < n and text[k] == text[i]:
                k += 1
            r = k - j - 1
            ans = max(ans, min(l + r + 1, cnt[text[i]]))
            i = j
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

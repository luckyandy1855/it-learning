# 0318. Maximum Product of Word Lengths

---
编号: 318
题目: Maximum Product of Word Lengths
难度: 中等
标签: [位运算, 数组, 字符串]
来源链接: https://leetcode.com/problems/maximum-product-of-word-lengths/
---

## 题目描述

给你一个字符串数组 `words` ，找出并返回 `length(words[i]) * length(words[j])` 的最大值，并且这两个单词不含有公共字母。如果不存在这样的两个单词，返回 `0` 。

**示例 1：**

```text
输入：words = ["abcw","baz","foo","bar","xtfn","abcdef"]
输出：16
解释：这两个单词为 "abcw", "xtfn"。
```

**示例 2：**

```text
输入：words = ["a","ab","abc","d","cd","bcd","abcd"]
输出：4
解释：这两个单词为 "ab", "cd"。
```

**示例 3：**

```text
输入：words = ["a","aa","aaa","aaaa"]
输出：0
解释：不存在这样的两个单词。
```

**提示：**

	- `2 <= words.length <= 1000`

	- `1 <= words[i].length <= 1000`

	- `words[i]` 仅包含小写字母

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目需要我们找到两个没有公共字母的字符串，使得它们的长度乘积最大。我们可以将每个字符串用一个二进制数 $mask[i]$ 表示，这个二进制数的每一位表示字符串中是否含有某个字母。如果两个字符串没有公共字母，那么这两个字符串对应的二进制数的按位与的结果为 $0$，即 $mask[i] \& mask[j] = 0$。

我们遍历每个字符串，对于当前遍历到的字符串 $words[i]$，我们先算出对应的二进制数 $mask[i]$，然后再遍历 $j \in [0, i)$ 的所有字符串 $words[j]$，检查 $mask[i] \& mask[j] = 0$ 是否成立，如果成立就更新答案为 $\max(ans, |words[i]| \times |words[j]|)$。

遍历结束后，返回答案即可。

时间复杂度 $O(n^2 + L)$，空间复杂度 $O(n)$。其中 $n$ 是字符串数组 $words$ 的长度，而 $L$ 是字符串数组所有字符串的长度之和。

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
// Maximum Product of Word Lengths：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxProduct(words []string) (ans int) {
	n := len(words)
	mask := make([]int, n)
	for i, s := range words {
		for _, c := range s {
			mask[i] |= 1 << (c - 'a')
		}
		for j, t := range words[:i] {
			if mask[i]&mask[j] == 0 {
				ans = max(ans, len(s)*len(t))
			}
		}
	}
	return
}
```

### Java

```java
// Maximum Product of Word Lengths：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxProduct(String[] words) {
        int n = words.length;
        int[] mask = new int[n];
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            for (char c : words[i].toCharArray()) {
                mask[i] |= 1 << (c - 'a');
            }
            for (int j = 0; j < i; ++j) {
                if ((mask[i] & mask[j]) == 0) {
                    ans = Math.max(ans, words[i].length() * words[j].length());
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Product of Word Lengths：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxProduct(self, words: List[str]) -> int:
        mask = [0] * len(words)
        ans = 0
        for i, s in enumerate(words):
            for c in s:
                mask[i] |= 1 << (ord(c) - ord("a"))
            for j, t in enumerate(words[:i]):
                if (mask[i] & mask[j]) == 0:
                    ans = max(ans, len(s) * len(t))
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

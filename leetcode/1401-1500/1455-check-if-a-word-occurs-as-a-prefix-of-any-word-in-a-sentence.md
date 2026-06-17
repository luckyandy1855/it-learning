# 1455. Check If a Word Occurs As a Prefix of Any Word in a Sentence

---
编号: 1455
题目: Check If a Word Occurs As a Prefix of Any Word in a Sentence
难度: 简单
标签: [双指针, 字符串, 字符串匹配]
来源链接: https://leetcode.com/problems/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence/
---

## 题目描述

给你一个字符串 `sentence` 作为句子并指定检索词为 `searchWord` ，其中句子由若干用 **单个空格** 分隔的单词组成。请你检查检索词 `searchWord` 是否为句子 `sentence` 中任意单词的前缀。

如果 `searchWord` 是某一个单词的前缀，则返回句子 `sentence` 中该单词所对应的下标（**下标从 1 开始**）。如果 `searchWord` 是多个单词的前缀，则返回匹配的第一个单词的下标（**最小下标**）。如果 `searchWord` 不是任何单词的前缀，则返回 `-1`** **。

字符串 `s` 的 **前缀** 是 `s` 的任何前导连续子字符串。

**示例 1：**

```text
输入：sentence = "i love eating burger", searchWord = "burg"
输出：4
解释："burg" 是 "burger" 的前缀，而 "burger" 是句子中第 4 个单词。
```

**示例 2：**

```text
输入：sentence = "this problem is an easy problem", searchWord = "pro"
输出：2
解释："pro" 是 "problem" 的前缀，而 "problem" 是句子中第 2 个也是第 6 个单词，但是应该返回最小下标 2 。
```

**示例 3：**

```text
输入：sentence = "i am tired", searchWord = "you"
输出：-1
解释："you" 不是句子中任何单词的前缀。
```

**提示：**

- `1 <= sentence.length <= 100`

- `1 <= searchWord.length <= 10`

- `sentence` 由小写英文字母和空格组成。

- `searchWord` 由小写英文字母组成。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「双指针, 字符串, 字符串匹配」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们将 $\textit{sentence}$ 按空格分割为 $\textit{words}$，然后遍历 $\textit{words}$，检查 $\textit{words}[i]$ 是否是 $\textit{searchWord}$ 的前缀，是则返回 $i+1$。若遍历结束，所有单词都不满足，返回 $-1$。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m)$。其中 $m$ 和 $n$ 分别是 $\textit{sentence}$ 和 $\textit{searchWord}$ 的长度。

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
// Check If a Word Occurs As a Prefix of Any Word in a Sentence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isPrefixOfWord(sentence string, searchWord string) int {
	for i, s := range strings.Split(sentence, " ") {
		if strings.HasPrefix(s, searchWord) {
			return i + 1
		}
	}
	return -1
}
```

### Java

```java
// Check If a Word Occurs As a Prefix of Any Word in a Sentence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int isPrefixOfWord(String sentence, String searchWord) {
        String[] words = sentence.split(" ");
        for (int i = 0; i < words.length; ++i) {
            if (words[i].startsWith(searchWord)) {
                return i + 1;
            }
        }
        return -1;
    }
}
```

### Python

```python
# Check If a Word Occurs As a Prefix of Any Word in a Sentence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isPrefixOfWord(self, sentence: str, searchWord: str) -> int:
        for i, s in enumerate(sentence.split(), 1):
            if s.startswith(searchWord):
                return i
        return -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

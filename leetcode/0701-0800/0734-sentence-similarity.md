# 0734. Sentence Similarity

---
编号: 734
题目: Sentence Similarity
难度: 简单
标签: [数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/sentence-similarity/
---

## 题目描述

我们可以将一个句子表示为一个单词数组，例如，句子 `"I am happy with leetcode"` 可以表示为 `arr = ["I","am",happy","with","leetcode"]`

给定两个句子 `sentence1` 和 `sentence2` 分别表示为一个字符串数组，并给定一个字符串对 `similarPairs` ，其中 `similarPairs[i] = [xi, yi]` 表示两个单词 `xi` and `yi` 是相似的。

如果 `sentence1` 和 `sentence2` 相似则返回 `true` ，如果不相似则返回 `false` 。

两个句子是相似的，如果:

- 它们具有 **相同的长度** (即相同的字数)

- `sentence1[i]` 和 `sentence2[i]` 是相似的

请注意，一个词总是与它自己相似，也请注意，相似关系是不可传递的。例如，如果单词 `a` 和 `b` 是相似的，单词 `b` 和 `c` 也是相似的，那么 `a` 和 `c`  **不一定相似** 。

**示例 1:**

```text
输入: sentence1 = ["great","acting","skills"], sentence2 = ["fine","drama","talent"], similarPairs = [["great","fine"],["drama","acting"],["skills","talent"]]
输出: true
解释: 这两个句子长度相同，每个单词都相似。
```

**示例 2:**

```text
输入: sentence1 = ["great"], sentence2 = ["great"], similarPairs = []
输出: true
解释: 一个单词和它本身相似。
```

**示例 3:**

```text
输入: sentence1 = ["great"], sentence2 = ["doubleplus","good"], similarPairs = [["great","doubleplus"]]
输出: false
解释: 因为它们长度不同，所以返回false。
```

**提示:**

- `1 i.length, yi.length <= 20`

- 所有对 `(xi, yi)` 都是 **不同** 的

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们首先判断 $\textit{sentence1}$ 和 $\textit{sentence2}$ 的长度是否相等，如果不相等则返回 $\text{false}$。

然后我们使用一个哈希表 $\textit{s}$ 来存储所有相似的单词对，对于 $\textit{similarPairs}$ 中的每一个单词对 $[x, y]$，我们将 $x$ 和 $y$ 加入到哈希表 $\textit{s}$ 中。

接下来我们遍历 $\textit{sentence1}$ 和 $\textit{sentence2}$，对于每一个位置 $i$，如果 $\textit{sentence1}[i]$ 不等于 $\textit{sentence2}[i]$，并且 $(\textit{sentence1}[i], \textit{sentence2}[i])$ 和 $(\textit{sentence2}[i], \textit{sentence1}[i])$ 都不在哈希表 $\textit{s}$ 中，那么返回 $\text{false}$。

如果遍历结束后都没有返回 $\text{false}$，说明 $\textit{sentence1}$ 和 $\textit{sentence2}$ 是相似的，返回 $\text{true}$。

时间复杂度 $O(L)$，空间复杂度 $O(L)$，其中 $L$ 为题目中所有字符串的长度之和。

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
// Sentence Similarity：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func areSentencesSimilar(sentence1 []string, sentence2 []string, similarPairs [][]string) bool {
	if len(sentence1) != len(sentence2) {
		return false
	}
	s := map[string]bool{}
	for _, p := range similarPairs {
		s[p[0]+"#"+p[1]] = true
	}
	for i, x := range sentence1 {
		y := sentence2[i]
		if x != y && !s[x+"#"+y] && !s[y+"#"+x] {
			return false
		}
	}
	return true
}
```

### Java

```java
// Sentence Similarity：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean areSentencesSimilar(
        String[] sentence1, String[] sentence2, List<List<String>> similarPairs) {
        if (sentence1.length != sentence2.length) {
            return false;
        }
        Set<List<String>> s = new HashSet<>();
        for (var p : similarPairs) {
            s.add(p);
        }
        for (int i = 0; i < sentence1.length; i++) {
            if (!sentence1[i].equals(sentence2[i])
                && !s.contains(List.of(sentence1[i], sentence2[i]))
                && !s.contains(List.of(sentence2[i], sentence1[i]))) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Sentence Similarity：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def areSentencesSimilar(
        self, sentence1: List[str], sentence2: List[str], similarPairs: List[List[str]]
    ) -> bool:
        if len(sentence1) != len(sentence2):
            return False
        s = {(x, y) for x, y in similarPairs}
        for x, y in zip(sentence1, sentence2):
            if x != y and (x, y) not in s and (y, x) not in s:
                return False
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

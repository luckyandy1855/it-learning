# 0030. Substring with Concatenation of All Words

---
编号: 30
题目: Substring with Concatenation of All Words
难度: 困难
标签: [哈希表, 字符串, 滑动窗口]
来源链接: https://leetcode.com/problems/substring-with-concatenation-of-all-words/
---

## 题目描述

给定字符串 `s` 和字符串数组 `words`（每个字符串长度相同），找出 `s` 中所有是 `words` 中每个单词**恰好出现一次**的拼接的子串的起始下标，以任意顺序返回。

题目保证：

- `words` 中所有字符串长度相同，设为 `wordLen`。
- 拼接子串的长度为 `wordLen * len(words)`。

### Example 1

```text
Input: s = "barfoothefoobarman", words = ["foo","bar"]
Output: [0,9]
Explanation: 从下标 0 开始的 "barfoo" 和从下标 9 开始的 "foobar" 都是 ["foo","bar"] 的拼接。
```

### Example 2

```text
Input: s = "wordgoodgoodgoodbestword", words = ["word","good","best","word"]
Output: []
```

### Example 3

```text
Input: s = "barfoofoobarthefoobarman", words = ["bar","foo","the"]
Output: [6,9,12]
```

### 约束条件

- `1 <= s.length <= 10^4`
- `1 <= words.length <= 5000`
- `1 <= words[i].length <= 30`
- `s` 和 `words[i]` 仅由小写字母组成。

## 思路分析

### 突破口

枚举每个可能的起始位置，将该位置开始的子串按 `wordLen` 分割，检查分割结果与 `words` 的频次是否完全匹配（用哈希表计数）。

### 思路拆解

1. **暴力枚举**：对每个起始位置 `i`（`0 <= i <= len(s) - totalLen`），截取长度 `totalLen` 的子串，按 `wordLen` 分词后与 `words` 做频次对比，O(n × k × wordLen)。

2. **滑动窗口优化（进阶）**：对每个偏移量 `offset`（`0 <= offset < wordLen`），在以该偏移量对齐的"词位置"上做滑动窗口，总 O(n × wordLen)。本题数据量不大，暴力枚举已够用。

3. **实现要点**：建立 `words` 的频次 map，再为每个起始位置建当前窗口的频次 map，对比两者是否相同。

### 示意图

```text
s = "barfoothefoobarman", words = ["foo","bar"], wordLen=3, totalLen=6

i=0: s[0:6]="barfoo" → ["bar","foo"] 频次 {bar:1,foo:1} == words ✓ → 加入结果
i=1: s[1:7]="arfoot" → ["arf","oot"] → 无匹配
...
i=9: s[9:15]="foobar" → ["foo","bar"] 频次 {foo:1,bar:1} == words ✓ → 加入结果
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 暴力枚举 | O(n × k × wLen) | O(k) |

## 代码实现

### Go

```go
// findSubstring 找所有由 words 拼接而成的子串的起始下标
// 参数：s 主串，words 等长字符串数组
// 返回：所有合法起始下标列表
func findSubstring(s string, words []string) []int {
    if len(s) == 0 || len(words) == 0 {
        return nil
    }

    wordLen := len(words[0])
    totalLen := wordLen * len(words)
    result := []int{}

    // 建立 words 的频次 map
    wordCount := make(map[string]int)
    for _, w := range words {
        wordCount[w]++
    }

    for i := 0; i <= len(s)-totalLen; i++ {
        seen := make(map[string]int)
        j := 0
        for j < len(words) {
            word := s[i+j*wordLen : i+(j+1)*wordLen]
            if cnt, ok := wordCount[word]; ok {
                seen[word]++
                // 当前词出现次数超过 words 中的频次，终止
                if seen[word] > cnt {
                    break
                }
            } else {
                break // 不在 words 中的词，终止
            }
            j++
        }
        if j == len(words) {
            result = append(result, i)
        }
    }
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 找所有由 words 拼接而成的子串的起始下标。
     *
     * @param s     主串
     * @param words 等长字符串数组
     * @return 所有合法起始下标列表
     */
    public List<Integer> findSubstring(String s, String[] words) {
        List<Integer> result = new ArrayList<>();
        if (s.isEmpty() || words.length == 0) return result;

        int wordLen = words[0].length();
        int totalLen = wordLen * words.length;

        Map<String, Integer> wordCount = new HashMap<>();
        for (String w : words) wordCount.merge(w, 1, Integer::sum);

        for (int i = 0; i <= s.length() - totalLen; i++) {
            Map<String, Integer> seen = new HashMap<>();
            int j = 0;
            while (j < words.length) {
                String word = s.substring(i + j * wordLen, i + (j + 1) * wordLen);
                if (!wordCount.containsKey(word)) break;
                seen.merge(word, 1, Integer::sum);
                if (seen.get(word) > wordCount.get(word)) break;
                j++;
            }
            if (j == words.length) result.add(i);
        }
        return result;
    }
}
```

### Python

```python
from collections import Counter

class Solution:
    def findSubstring(self, s: str, words: list[str]) -> list[int]:
        """
        找所有由 words 拼接而成的子串的起始下标。

        参数:
            s:     主串
            words: 等长字符串数组
        返回:
            所有合法起始下标列表
        """
        if not s or not words:
            return []

        word_len = len(words[0])
        total_len = word_len * len(words)
        word_count = Counter(words)
        result = []

        for i in range(len(s) - total_len + 1):
            seen = Counter()
            for j in range(len(words)):
                word = s[i + j * word_len: i + (j + 1) * word_len]
                if word not in word_count:
                    break
                seen[word] += 1
                if seen[word] > word_count[word]:
                    break
            else:
                result.append(i)  # for-else: 循环正常结束（未 break）

        return result
```

## 踩坑记录

- **`words` 中可能有重复单词**：如 `words = ["foo","foo"]`，需要计频次而不是用 set，否则 `s[0:6]="foofoo"` 也会被正确识别。
- **外层枚举上界**：`i <= len(s) - totalLen`（包含等号），不是 `i < len(s) - totalLen`。
- **Python `for-else`**：`for` 循环正常结束（没有 `break`）时执行 `else` 块，这里用来判断 j 走完了 `len(words)` 步而没有提前退出。

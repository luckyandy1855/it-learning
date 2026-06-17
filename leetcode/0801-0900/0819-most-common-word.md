# 0819. Most Common Word

---
编号: 819
题目: Most Common Word
难度: 简单
标签: [数组, 哈希表, 字符串, 计数]
来源链接: https://leetcode.com/problems/most-common-word/
---

## 题目描述

给你一个字符串 `paragraph` 和一个表示禁用词的字符串数组 `banned` ，返回出现频率最高的非禁用词。题目数据 **保证 **至少存在一个非禁用词，且答案** 唯一 **。

`paragraph` 中的单词 **不区分大小写** ，答案应以 **小写 **形式返回。

注意 单词不包含标点符号。

示例 1：

```text
输入：paragraph = "Bob hit a ball, the hit BALL flew far after it was hit.", banned = ["hit"]
输出："ball"
解释：
"hit" 出现了 3 次，但它是禁用词。
"ball" 出现了两次（没有其他单词出现这么多次），因此它是段落中出现频率最高的非禁用词。
请注意，段落中的单词不区分大小写，
标点符号会被忽略（即使它们紧挨着单词，如 "ball,"），
并且尽管 "hit" 出现的次数更多，但它不能作为答案，因为它是禁用词。
```

示例 2：

```text
输入：paragraph = "a.", banned = []
输出："a"
```

**提示：**

- `1 <= paragraph.length <= 1000`

- `paragraph` 由英文字母、空格 `' '`、和以下符号组成：`"!?',;."`

- `0 <= banned.length <= 100`

- `1 <= banned[i].length <= 10`

- `banned[i]` 仅由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

正则匹配（或双指针）找出所有单词，用哈希表统计每个单词出现的频率，找到出现未在 banned 中出现且频率最大的单词。

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
// Most Common Word：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func mostCommonWord(paragraph string, banned []string) string {
	s := make(map[string]bool)
	for _, w := range banned {
		s[w] = true
	}
	counter := make(map[string]int)
	var ans string
	for i, mx, n := 0, 0, len(paragraph); i < n; {
		if !unicode.IsLetter(rune(paragraph[i])) {
			i++
			continue
		}
		j := i
		var word []byte
		for j < n && unicode.IsLetter(rune(paragraph[j])) {
			word = append(word, byte(unicode.ToLower(rune(paragraph[j]))))
			j++
		}
		i = j + 1
		t := string(word)
		if s[t] {
			continue
		}
		counter[t]++
		if counter[t] > mx {
			ans = t
			mx = counter[t]
		}
	}
	return ans
}
```

### Java

```java
// Most Common Word：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.regex.Matcher;
import java.util.regex.Pattern;

class Solution {
    private static Pattern pattern = Pattern.compile("[a-z]+");

    public String mostCommonWord(String paragraph, String[] banned) {
        Set<String> bannedWords = new HashSet<>();
        for (String word : banned) {
            bannedWords.add(word);
        }
        Map<String, Integer> counter = new HashMap<>();
        Matcher matcher = pattern.matcher(paragraph.toLowerCase());
        while (matcher.find()) {
            String word = matcher.group();
            if (bannedWords.contains(word)) {
                continue;
            }
            counter.put(word, counter.getOrDefault(word, 0) + 1);
        }
        int max = Integer.MIN_VALUE;
        String ans = null;
        for (Map.Entry<String, Integer> entry : counter.entrySet()) {
            if (entry.getValue() > max) {
                max = entry.getValue();
                ans = entry.getKey();
            }
        }
        return ans;
    }
}
```

### Python

```python
# Most Common Word：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def mostCommonWord(self, paragraph: str, banned: List[str]) -> str:
        s = set(banned)
        p = Counter(re.findall('[a-z]+', paragraph.lower()))
        return next(word for word, _ in p.most_common() if word not in s)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

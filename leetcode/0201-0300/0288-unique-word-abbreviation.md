# 0288. Unique Word Abbreviation

---
编号: 288
题目: Unique Word Abbreviation
难度: 中等
标签: [设计, 数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/unique-word-abbreviation/
---

## 题目描述

单词的 **缩写** 需要遵循  这样的格式。如果单词只有两个字符，那么它就是它自身的 **缩写** 。

以下是一些单词缩写的范例：

- `dog --> d1g` 因为第一个字母 `'d'` 和最后一个字母 `'g'` 之间有 `1` 个字母

- `internationalization --> i18n` 因为第一个字母 `'i'` 和最后一个字母 `'n'` 之间有 `18` 个字母

- `it --> it` 单词只有两个字符，它就是它自身的 **缩写**

实现 `ValidWordAbbr` 类：

- `ValidWordAbbr(String[] dictionary)` 使用单词字典 `dictionary` 初始化对象

- `boolean isUnique(string word)` 如果满足下述任意一个条件，返回 `true` ；否则，返回 `false` ：

- 字典 `dictionary` 中没有任何其他单词的 **缩写** 与该单词 `word` 的 **缩写** 相同。

- 字典 `dictionary` 中的所有 **缩写** 与该单词 `word` 的 **缩写** 相同的单词都与 `word` **相同** 。

**示例：**

```text
输入
["ValidWordAbbr", "isUnique", "isUnique", "isUnique", "isUnique", "isUnique"]
[[["deer", "door", "cake", "card"]], ["dear"], ["cart"], ["cane"], ["make"], ["cake"]]
输出
[null, false, true, false, true, true]

解释
ValidWordAbbr validWordAbbr = new ValidWordAbbr(["deer", "door", "cake", "card"]);
validWordAbbr.isUnique("dear"); // 返回 false，字典中的 "deer" 与输入 "dear" 的缩写都是 "d2r"，但这两个单词不相同
validWordAbbr.isUnique("cart"); // 返回 true，字典中不存在缩写为 "c2t" 的单词
validWordAbbr.isUnique("cane"); // 返回 false，字典中的 "cake" 与输入 "cane" 的缩写都是 "c2e"，但这两个单词不相同
validWordAbbr.isUnique("make"); // 返回 true，字典中不存在缩写为 "m2e" 的单词
validWordAbbr.isUnique("cake"); // 返回 true，因为 "cake" 已经存在于字典中，并且字典中没有其他缩写为 "c2e" 的单词
```

**提示：**

- `1 <= dictionary.length <= 3 * 10^4`

- `1 <= dictionary[i].length <= 20`

- `dictionary[i]` 由小写英文字母组成

- `1 <= word <= 20`

- `word` 由小写英文字母组成

- 最多调用 `5000` 次 `isUnique`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，我们定义一个函数 $abbr(s)$，它的功能是计算单词 $s$ 的缩写。如果单词 $s$ 的长度小于 $3$，那么它的缩写就是它本身；否则，它的缩写是它的首字母 + (它的长度 - 2) + 它的尾字母。

接下来，我们定义一个哈希表 $d$，它的键是单词的缩写，值是一个集合，集合中的元素是所有缩写为该键的单词。我们遍历给定的单词字典，对于字典中的每个单词 $s$，我们求出它的缩写 $abbr(s)$，并将 $s$ 添加到 $d[abbr(s)]$ 中。

在判断单词 $word$ 是否满足题目要求时，我们求出它的缩写 $abbr(word)$，如果 $abbr(word)$ 不在哈希表 $d$ 中，那么 $word$ 满足题目要求；否则，我们判断 $d[abbr(word)]$ 中是否只有一个元素，如果 $d[abbr(word)]$ 中只有一个元素且该元素就是 $word$，那么 $word$ 满足题目要求。

时间复杂度方面，初始化哈希表的时间复杂度是 $O(n)$，其中 $n$ 是单词字典的长度；判断单词是否满足题目要求的时间复杂度是 $O(1)$。空间复杂度方面，哈希表的空间复杂度是 $O(n)$。

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
// Unique Word Abbreviation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type ValidWordAbbr struct {
	d map[string]map[string]bool
}

func Constructor(dictionary []string) ValidWordAbbr {
	d := make(map[string]map[string]bool)
	for _, s := range dictionary {
		abbr := abbr(s)
		if _, ok := d[abbr]; !ok {
			d[abbr] = make(map[string]bool)
		}
		d[abbr][s] = true
	}
	return ValidWordAbbr{d}
}

func (this *ValidWordAbbr) IsUnique(word string) bool {
	ws := this.d[abbr(word)]
	return ws == nil || (len(ws) == 1 && ws[word])
}

func abbr(s string) string {
	n := len(s)
	if n < 3 {
		return s
	}
	return fmt.Sprintf("%c%d%c", s[0], n-2, s[n-1])
}

/**
 * Your ValidWordAbbr object will be instantiated and called as such:
 * obj := Constructor(dictionary);
 * param_1 := obj.IsUnique(word);
 */
```

### Java

```java
import java.util.*;
// Unique Word Abbreviation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class ValidWordAbbr {
    private Map<String, Set<String>> d = new HashMap<>();

    public ValidWordAbbr(String[] dictionary) {
        for (var s : dictionary) {
            d.computeIfAbsent(abbr(s), k -> new HashSet<>()).add(s);
        }
    }

    public boolean isUnique(String word) {
        var ws = d.get(abbr(word));
        return ws == null || (ws.size() == 1 && ws.contains(word));
    }

    private String abbr(String s) {
        int n = s.length();
        return n < 3 ? s : s.substring(0, 1) + (n - 2) + s.substring(n - 1);
    }
}

/**
 * Your ValidWordAbbr object will be instantiated and called as such:
 * ValidWordAbbr obj = new ValidWordAbbr(dictionary);
 * boolean param_1 = obj.isUnique(word);
 */
```

### Python

```python
# Unique Word Abbreviation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class ValidWordAbbr:
    def __init__(self, dictionary: List[str]):
        self.d = defaultdict(set)
        for s in dictionary:
            self.d[self.abbr(s)].add(s)

    def isUnique(self, word: str) -> bool:
        s = self.abbr(word)
        return s not in self.d or all(word == t for t in self.d[s])

    def abbr(self, s: str) -> str:
        return s if len(s) < 3 else s[0] + str(len(s) - 2) + s[-1]


# Your ValidWordAbbr object will be instantiated and called as such:
# obj = ValidWordAbbr(dictionary)
# param_1 = obj.isUnique(word)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

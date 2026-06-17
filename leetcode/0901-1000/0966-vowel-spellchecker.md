# 0966. Vowel Spellchecker

---
编号: 966
题目: Vowel Spellchecker
难度: 中等
标签: [数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/vowel-spellchecker/
---

## 题目描述

在给定单词列表 `wordlist` 的情况下，我们希望实现一个拼写检查器，将查询单词转换为正确的单词。

对于给定的查询单词 `query`，拼写检查器将会处理两类拼写错误：

- 大小写：如果查询匹配单词列表中的某个单词（**不区分大小写**），则返回的正确单词与单词列表中的大小写相同。

    	- 例如：`wordlist = ["yellow"]`, `query = "YellOw"`: `correct = "yellow"`

    	- 例如：`wordlist = ["Yellow"]`, `query = "yellow"`: `correct = "Yellow"`

    	- 例如：`wordlist = ["yellow"]`, `query = "yellow"`: `correct = "yellow"`

    - 元音错误：如果在将查询单词中的元音 `('a', 'e', 'i', 'o', 'u')`  分别替换为任何元音后，能与单词列表中的单词匹配（**不区分大小写**），则返回的正确单词与单词列表中的匹配项大小写相同。

    	- 例如：`wordlist = ["YellOw"]`, `query = "yollow"`: `correct = "YellOw"`

    	- 例如：`wordlist = ["YellOw"]`, `query = "yeellow"`: `correct = ""` （无匹配项）

    	- 例如：`wordlist = ["YellOw"]`, `query = "yllw"`: `correct = ""` （无匹配项）

此外，拼写检查器还按照以下优先级规则操作：

- 当查询完全匹配单词列表中的某个单词（**区分大小写**）时，应返回相同的单词。

- 当查询匹配到大小写问题的单词时，您应该返回单词列表中的第一个这样的匹配项。

- 当查询匹配到元音错误的单词时，您应该返回单词列表中的第一个这样的匹配项。

- 如果该查询在单词列表中没有匹配项，则应返回空字符串。

给出一些查询 `queries`，返回一个单词列表 `answer`，其中 `answer[i]` 是由查询 `query = queries[i]` 得到的正确单词。

**示例 1：**

```text
输入：wordlist = ["KiTe","kite","hare","Hare"], queries = ["kite","Kite","KiTe","Hare","HARE","Hear","hear","keti","keet","keto"]
输出：["kite","KiTe","KiTe","Hare","hare","","","KiTe","","KiTe"]
```

**示例 2:**

```text
输入：wordlist = ["yellow"], queries = ["YellOw"]
输出：["yellow"]
```

**提示：**

- `1 <= wordlist.length, queries.length <= 5000`

- `1 <= wordlist[i].length, queries[i].length <= 7`

- `wordlist[i]` 和 `queries[i]` 只包含英文字母

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

我们遍历 $\textit{wordlist}$，将单词按照大小写不敏感、元音不敏感的规则分别存入哈希表 $\textit{low}$ 和 $\textit{pat}$ 中，其中 $\textit{low}$ 的键为单词的小写形式，$\textit{pat}$ 的键为将单词的元音字母替换为 `*` 后的字符串，值为单词本身。用哈希表 $\textit{s}$ 存储 $\textit{wordlist}$ 中的单词。

遍历 $\textit{queries}$，对于每个单词 $\textit{q}$，如果 $\textit{q}$ 在 $\textit{s}$ 中，说明 $\textit{q}$ 在 $\textit{wordlist}$ 中，直接将 $\textit{q}$ 加入答案数组 $\textit{ans}$ 中。

否则，如果 $\textit{q}$ 的小写形式在 $\textit{low}$ 中，说明 $\textit{q}$ 在 $\textit{wordlist}$ 中，且大小写不敏感，将 $\textit{low}[q.\text{lower}()]$ 加入答案数组 $\textit{ans}$ 中。

否则，如果将 $\textit{q}$ 的元音字母替换为 `*` 后的字符串在 $\textit{pat}$ 中，说明 $\textit{q}$ 在 $\textit{wordlist}$ 中，且元音不敏感，将 $\textit{pat}[f(q)]$ 加入答案数组 $\textit{ans}$ 中。

否则，说明 $\textit{q}$ 在 $\textit{wordlist}$ 中，且大小写和元音都不敏感，将空字符串加入答案数组 $\textit{ans}$ 中。

最后返回答案数组 $\textit{ans}$ 即可。

时间复杂度 $O(n + m)$，空间复杂度 $O(n)$。其中 $n$ 和 $m$ 分别为 $\textit{wordlist}$ 和 $\textit{queries}$ 的长度。

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
// Vowel Spellchecker：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func spellchecker(wordlist []string, queries []string) (ans []string) {
	s := map[string]bool{}
	low := map[string]string{}
	pat := map[string]string{}
	f := func(w string) string {
		res := []byte(w)
		for i := range res {
			if res[i] == 'a' || res[i] == 'e' || res[i] == 'i' || res[i] == 'o' || res[i] == 'u' {
				res[i] = '*'
			}
		}
		return string(res)
	}
	for _, w := range wordlist {
		s[w] = true
		t := strings.ToLower(w)
		if _, ok := low[t]; !ok {
			low[t] = w
		}
		if _, ok := pat[f(t)]; !ok {
			pat[f(t)] = w
		}
	}
	for _, q := range queries {
		if s[q] {
			ans = append(ans, q)
			continue
		}
		q = strings.ToLower(q)
		if s, ok := low[q]; ok {
			ans = append(ans, s)
			continue
		}
		q = f(q)
		if s, ok := pat[q]; ok {
			ans = append(ans, s)
			continue
		}
		ans = append(ans, "")
	}
	return
}
```

### Java

```java
// Vowel Spellchecker：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String[] spellchecker(String[] wordlist, String[] queries) {
        Set<String> s = new HashSet<>();
        Map<String, String> low = new HashMap<>();
        Map<String, String> pat = new HashMap<>();
        for (String w : wordlist) {
            s.add(w);
            String t = w.toLowerCase();
            low.putIfAbsent(t, w);
            pat.putIfAbsent(f(t), w);
        }
        int m = queries.length;
        String[] ans = new String[m];
        for (int i = 0; i < m; ++i) {
            String q = queries[i];
            if (s.contains(q)) {
                ans[i] = q;
                continue;
            }
            q = q.toLowerCase();
            if (low.containsKey(q)) {
                ans[i] = low.get(q);
                continue;
            }
            q = f(q);
            if (pat.containsKey(q)) {
                ans[i] = pat.get(q);
                continue;
            }
            ans[i] = "";
        }
        return ans;
    }

    private String f(String w) {
        char[] cs = w.toCharArray();
        for (int i = 0; i < cs.length; ++i) {
            char c = cs[i];
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                cs[i] = '*';
            }
        }
        return String.valueOf(cs);
    }
}
```

### Python

```python
# Vowel Spellchecker：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def spellchecker(self, wordlist: List[str], queries: List[str]) -> List[str]:
        def f(w):
            t = []
            for c in w:
                t.append("*" if c in "aeiou" else c)
            return "".join(t)

        s = set(wordlist)
        low, pat = {}, {}
        for w in wordlist:
            t = w.lower()
            low.setdefault(t, w)
            pat.setdefault(f(t), w)

        ans = []
        for q in queries:
            if q in s:
                ans.append(q)
                continue
            q = q.lower()
            if q in low:
                ans.append(low[q])
                continue
            q = f(q)
            if q in pat:
                ans.append(pat[q])
                continue
            ans.append("")
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

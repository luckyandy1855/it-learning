# 0642. Design Search Autocomplete System

---
编号: 642
题目: Design Search Autocomplete System
难度: 困难
标签: [深度优先搜索, 设计, 字典树, 字符串, 数据流, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/design-search-autocomplete-system/
---

## 题目描述

为搜索引擎设计一个搜索自动补全系统。用户会输入一条语句（最少包含一个字母，以特殊字符 `'#'` 结尾）。

给定一个字符串数组 `sentences` 和一个整数数组 `times` ，长度都为 `n` ，其中 `sentences[i]` 是之前输入的句子， `times[i]` 是该句子输入的相应次数。对于除 `‘#’` 以外的每个输入字符，返回前 `3` 个历史热门句子，这些句子的前缀与已经输入的句子的部分相同。

下面是详细规则：

- 一条句子的热度定义为历史上用户输入这个句子的总次数。

- 返回前 `3` 的句子需要按照热度从高到低排序（第一个是最热门的）。如果有多条热度相同的句子，请按照 ASCII 码的顺序输出（ASCII 码越小排名越前）。

- 如果满足条件的句子个数少于 `3` ，将它们全部输出。

- 如果输入了特殊字符，意味着句子结束了，请返回一个空集合。

实现 `AutocompleteSystem` 类：

- `AutocompleteSystem(String[] sentences, int[] times):` 使用数组`sentences` 和 `times` 对对象进行初始化。

- `List input(char c)` 表示用户输入了字符 `c` 。

- 如果 `c == '#'` ，则返回空数组 `[]` ，并将输入的语句存储在系统中。

- 返回前 `3` 个历史热门句子，这些句子的前缀与已经输入的句子的部分相同。如果少于 `3` 个匹配项，则全部返回。

示例 1：

```text
输入
["AutocompleteSystem", "input", "input", "input", "input"]
[[["i love you", "island", "iroman", "i love leetcode"], [5, 3, 2, 2]], ["i"], [" "], ["a"], ["#"]]
输出
[null, ["i love you", "island", "i love leetcode"], ["i love you", "i love leetcode"], [], []]

解释
AutocompleteSystem obj = new AutocompleteSystem(["i love you", "island", "iroman", "i love leetcode"], [5, 3, 2, 2]);
obj.input("i"); // 返回 ["i love you", "island", "i love leetcode"]。有四个句子以"i"开头。其中，"ironman"和"i love leetcode"的热度相同。由于空格的 ASCII 码是 32，而 r 的 ASCII 码是 114，所以“i love leetcode”应排在“ironman”前面。同时我们只需要输出前三句热门句子，因此“ironman”会被忽略。
obj.input(" "); // 返回 ["i love you", "i love leetcode"]。只有两个句子以“i ”为前缀。
obj.input("a"); // 返回 []。没有以“i a”为前缀的句子。
obj.input("#"); // 返回 []。用户完成输入，句子 "i a" 应该被保存为系统中的历史句子。接下来的输入将被视为新的搜索。
```

**提示:**

- `n == sentences.length`

- `n == times.length`

- `1 <= n <= 100`

- `1 <= sentences[i].length <= 100`

- `1 <= times[i] <= 50`

- `c` 是小写英文字母， `'#'`, 或空格 `' '`

- 每个被测试的句子将是一个以字符 `'#'` 结尾的字符 `c` 序列。

- 每个被测试的句子的长度范围为 `[1,200]`

- 每个输入句子中的单词用单个空格隔开。

- `input` 最多被调用 `5000` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 设计, 字典树, 字符串, 数据流, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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

### Java

```java
// Design Search Autocomplete System：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Trie {
    Trie[] children = new Trie[27];
    int v;
    String w = "";

    void insert(String w, int t) {
        Trie node = this;
        for (char c : w.toCharArray()) {
            int idx = c == ' ' ? 26 : c - 'a';
            if (node.children[idx] == null) {
                node.children[idx] = new Trie();
            }
            node = node.children[idx];
        }
        node.v += t;
        node.w = w;
    }

    Trie search(String pref) {
        Trie node = this;
        for (char c : pref.toCharArray()) {
            int idx = c == ' ' ? 26 : c - 'a';
            if (node.children[idx] == null) {
                return null;
            }
            node = node.children[idx];
        }
        return node;
    }
}

class AutocompleteSystem {
    private Trie trie = new Trie();
    private StringBuilder t = new StringBuilder();

    public AutocompleteSystem(String[] sentences, int[] times) {
        int i = 0;
        for (String s : sentences) {
            trie.insert(s, times[i++]);
        }
    }

    public List<String> input(char c) {
        List<String> res = new ArrayList<>();
        if (c == '#') {
            trie.insert(t.toString(), 1);
            t = new StringBuilder();
            return res;
        }
        t.append(c);
        Trie node = trie.search(t.toString());
        if (node == null) {
            return res;
        }
        PriorityQueue<Trie> q
            = new PriorityQueue<>((a, b) -> a.v == b.v ? b.w.compareTo(a.w) : a.v - b.v);
        dfs(node, q);
        while (!q.isEmpty()) {
            res.add(0, q.poll().w);
        }
        return res;
    }

    private void dfs(Trie node, PriorityQueue q) {
        if (node == null) {
            return;
        }
        if (node.v > 0) {
            q.offer(node);
            if (q.size() > 3) {
                q.poll();
            }
        }
        for (Trie nxt : node.children) {
            dfs(nxt, q);
        }
    }
}

/**
 * Your AutocompleteSystem object will be instantiated and called as such:
 * AutocompleteSystem obj = new AutocompleteSystem(sentences, times);
 * List<String> param_1 = obj.input(c);
 */
```

### Python

```python
# Design Search Autocomplete System：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Trie:
    def __init__(self):
        self.children = [None] * 27
        self.v = 0
        self.w = ''

    def insert(self, w, t):
        node = self
        for c in w:
            idx = 26 if c == ' ' else ord(c) - ord('a')
            if node.children[idx] is None:
                node.children[idx] = Trie()
            node = node.children[idx]
        node.v += t
        node.w = w

    def search(self, pref):
        node = self
        for c in pref:
            idx = 26 if c == ' ' else ord(c) - ord('a')
            if node.children[idx] is None:
                return None
            node = node.children[idx]
        return node


class AutocompleteSystem:
    def __init__(self, sentences: List[str], times: List[int]):
        self.trie = Trie()
        for a, b in zip(sentences, times):
            self.trie.insert(a, b)
        self.t = []

    def input(self, c: str) -> List[str]:
        def dfs(node):
            if node is None:
                return
            if node.v:
                res.append((node.v, node.w))
            for nxt in node.children:
                dfs(nxt)

        if c == '#':
            s = ''.join(self.t)
            self.trie.insert(s, 1)
            self.t = []
            return []

        res = []
        self.t.append(c)
        node = self.trie.search(''.join(self.t))
        if node is None:
            return res
        dfs(node)
        res.sort(key=lambda x: (-x[0], x[1]))
        return [v[1] for v in res[:3]]


# Your AutocompleteSystem object will be instantiated and called as such:
# obj = AutocompleteSystem(sentences, times)
# param_1 = obj.input(c)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

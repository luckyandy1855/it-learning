# 1032. Stream of Characters

---
编号: 1032
题目: Stream of Characters
难度: 困难
标签: [设计, 字典树, 数组, 字符串, 数据流]
来源链接: https://leetcode.com/problems/stream-of-characters/
---

## 题目描述

设计一个算法：接收一个字符流，并检查这些字符的后缀是否是字符串数组 `words` 中的一个字符串。

例如，`words = ["abc", "xyz"]` 且字符流中逐个依次加入 4 个字符 `'a'`、`'x'`、`'y'` 和 `'z'` ，你所设计的算法应当可以检测到 `"axyz"` 的后缀 `"xyz"` 与 `words` 中的字符串 `"xyz"` 匹配。

按下述要求实现 `StreamChecker` 类：

- `StreamChecker(String[] words)` ：构造函数，用字符串数组 `words` 初始化数据结构。

- `boolean query(char letter)`：从字符流中接收一个新字符，如果字符流中的任一非空后缀能匹配 `words` 中的某一字符串，返回 `true` ；否则，返回 `false`。

**示例：**

```text
输入：
["StreamChecker", "query", "query", "query", "query", "query", "query", "query", "query", "query", "query", "query", "query"]
[[["cd", "f", "kl"]], ["a"], ["b"], ["c"], ["d"], ["e"], ["f"], ["g"], ["h"], ["i"], ["j"], ["k"], ["l"]]
输出：
[null, false, false, false, true, false, true, false, false, false, false, false, true]

解释：
StreamChecker streamChecker = new StreamChecker(["cd", "f", "kl"]);
streamChecker.query("a"); // 返回 False
streamChecker.query("b"); // 返回 False
streamChecker.query("c"); // 返回n False
streamChecker.query("d"); // 返回 True ，因为 'cd' 在 words 中
streamChecker.query("e"); // 返回 False
streamChecker.query("f"); // 返回 True ，因为 'f' 在 words 中
streamChecker.query("g"); // 返回 False
streamChecker.query("h"); // 返回 False
streamChecker.query("i"); // 返回 False
streamChecker.query("j"); // 返回 False
streamChecker.query("k"); // 返回 False
streamChecker.query("l"); // 返回 True ，因为 'kl' 在 words 中
```

**提示：**

- `1 <= words.length <= 2000`

- `1 <= words[i].length <= 200`

- `words[i]` 由小写英文字母组成

- `letter` 是一个小写英文字母

- 最多调用查询 `4 * 10^4` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 字典树, 数组, 字符串, 数据流」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以根据初始化时的字符串数组 $words$ 构建前缀树，前缀树的每个节点包含两个属性：

- `children`：指向 $26$ 个字母的指针数组，用于存储当前节点的子节点。
- `is_end`：标记当前节点是否为某个字符串的结尾。

在构造函数中，我们遍历字符串数组 $words$，对于每个字符串 $w$，我们将其反转后，逐个字符插入到前缀树中，插入结束后，将当前节点的 `is_end` 标记为 `true`。

在 `query` 函数中，我们将当前字符 $c$ 加入到字符流中，然后从后往前遍历字符流，对于每个字符 $c$，我们在前缀树中查找是否存在以 $c$ 为结尾的字符串，如果存在，返回 `true`，否则返回 `false`。注意到 $words$ 中的字符串长度不超过 $200$，因此查询时最多只需要遍历 $200$ 个字符。

时间复杂度方面，构造函数的时间复杂度为 $O(L)$，而 `query` 函数的时间复杂度为 $O(M)$。其中 $L$ 为字符串数组 $words$ 中所有字符串的长度之和，而 $M$ 为字符串数组 $words$ 中字符串的最大长度。空间复杂度 $O(L)$。

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
// Stream of Characters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type Trie struct {
	children [26]*Trie
	isEnd    bool
}

func newTrie() Trie {
	return Trie{}
}

func (this *Trie) Insert(word string) {
	node := this
	for i := len(word) - 1; i >= 0; i-- {
		idx := word[i] - 'a'
		if node.children[idx] == nil {
			node.children[idx] = &Trie{}
		}
		node = node.children[idx]
	}
	node.isEnd = true
}

func (this *Trie) Search(word []byte) bool {
	node := this
	for i := len(word) - 1; i >= 0; i-- {
		idx := word[i] - 'a'
		if node.children[idx] == nil {
			return false
		}
		node = node.children[idx]
		if node.isEnd {
			return true
		}
	}
	return false
}

type StreamChecker struct {
	trie Trie
	s    []byte
}

func Constructor(words []string) StreamChecker {
	trie := newTrie()
	for _, w := range words {
		trie.Insert(w)
	}
	return StreamChecker{trie, []byte{}}
}

func (this *StreamChecker) Query(letter byte) bool {
	this.s = append(this.s, letter)
	return this.trie.Search(this.s)
}

/**
 * Your StreamChecker object will be instantiated and called as such:
 * obj := Constructor(words);
 * param_1 := obj.Query(letter);
 */
```

### Java

```java
// Stream of Characters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Trie {
    Trie[] children = new Trie[26];
    boolean isEnd = false;

    public void insert(String w) {
        Trie node = this;
        for (int i = w.length() - 1; i >= 0; --i) {
            int idx = w.charAt(i) - 'a';
            if (node.children[idx] == null) {
                node.children[idx] = new Trie();
            }
            node = node.children[idx];
        }
        node.isEnd = true;
    }

    public boolean query(StringBuilder s) {
        Trie node = this;
        for (int i = s.length() - 1; i >= 0; --i) {
            int idx = s.charAt(i) - 'a';
            if (node.children[idx] == null) {
                return false;
            }
            node = node.children[idx];
            if (node.isEnd) {
                return true;
            }
        }
        return false;
    }
}

class StreamChecker {
    private StringBuilder sb = new StringBuilder();
    private Trie trie = new Trie();

    public StreamChecker(String[] words) {
        for (String w : words) {
            trie.insert(w);
        }
    }

    public boolean query(char letter) {
        sb.append(letter);
        return trie.query(sb);
    }
}

/**
 * Your StreamChecker object will be instantiated and called as such:
 * StreamChecker obj = new StreamChecker(words);
 * boolean param_1 = obj.query(letter);
 */
```

### Python

```python
# Stream of Characters：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Trie:
    def __init__(self):
        self.children = [None] * 26
        self.is_end = False

    def insert(self, w: str):
        node = self
        for c in w[::-1]:
            idx = ord(c) - ord('a')
            if node.children[idx] is None:
                node.children[idx] = Trie()
            node = node.children[idx]
        node.is_end = True

    def search(self, w: List[str]) -> bool:
        node = self
        for c in w[::-1]:
            idx = ord(c) - ord('a')
            if node.children[idx] is None:
                return False
            node = node.children[idx]
            if node.is_end:
                return True
        return False


class StreamChecker:
    def __init__(self, words: List[str]):
        self.trie = Trie()
        self.cs = []
        self.limit = 201
        for w in words:
            self.trie.insert(w)

    def query(self, letter: str) -> bool:
        self.cs.append(letter)
        return self.trie.search(self.cs[-self.limit :])


# Your StreamChecker object will be instantiated and called as such:
# obj = StreamChecker(words)
# param_1 = obj.query(letter)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

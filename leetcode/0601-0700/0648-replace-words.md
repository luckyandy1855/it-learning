# 0648. Replace Words

---
编号: 648
题目: Replace Words
难度: 中等
标签: [字典树, 数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/replace-words/
---

## 题目描述

在英语中，我们有一个叫做 **词根**(root) 的概念，可以词根 **后面 **添加其他一些词组成另一个较长的单词——我们称这个词为 **衍生词** (**derivative**)。例如，词根 `help`，跟随着 **继承**词 `"ful"`，可以形成新的单词 `"helpful"`。

现在，给定一个由许多 **词根 **组成的词典 `dictionary` 和一个用空格分隔单词形成的句子 `sentence`。你需要将句子中的所有 **衍生词 **用 **词根 **替换掉。如果 **衍生词 **有许多可以形成它的 **词根**，则用 **最短 **的 **词根** 替换它。

你需要输出替换之后的句子。

**示例 1：**

```text
输入：dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"
输出："the cat was rat by the bat"
```

**示例 2：**

```text
输入：dictionary = ["a","b","c"], sentence = "aadsfasf absbs bbab cadsfafs"
输出："a a b c"
```

**提示：**

- `1 <= dictionary.length <= 1000`

- `1 <= dictionary[i].length <= 100`

- `dictionary[i]` 仅由小写字母组成。

- `1 <= sentence.length <= 10^6`

- `sentence` 仅由小写字母和空格组成。

- `sentence` 中单词的总量在范围 `[1, 1000]` 内。

- `sentence` 中每个单词的长度在范围 `[1, 1000]` 内。

- `sentence` 中单词之间由一个空格隔开。

- `sentence` 没有前导或尾随空格。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字典树, 数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用前缀树来存储词典中的所有词根。定义前缀树节点类 $\text{Trie}$，其中包含一个长度为 $26$ 的数组 $\text{children}$ 来存储子节点，以及一个布尔变量 $\text{is\_end}$ 来标记是否为一个完整的词根。

对于每个词根，我们将其插入前缀树中。对于句子中的每个单词，我们在前缀树中搜索其最短的词根，如果找到了，则替换该单词，否则保持不变。

时间复杂度 $O(n \times |w| + L)$，空间复杂度 $O(n \times |w|)$，其中 $n$ 和 $|w|$ 分别是词典中词根的数量和平均长度，而 $L$ 是句子中单词的总长度。

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
// Replace Words：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type Trie struct {
	children [26]*Trie
	isEnd    bool
}

func (t *Trie) insert(w string) {
	node := t
	for _, c := range w {
		idx := c - 'a'
		if node.children[idx] == nil {
			node.children[idx] = &Trie{}
		}
		node = node.children[idx]
	}
	node.isEnd = true
}

func (t *Trie) search(w string) string {
	node := t
	for i, c := range w {
		idx := c - 'a'
		if node.children[idx] == nil {
			return w
		}
		node = node.children[idx]
		if node.isEnd {
			return w[:i+1]
		}
	}
	return w
}

func replaceWords(dictionary []string, sentence string) string {
	trie := &Trie{}
	for _, w := range dictionary {
		trie.insert(w)
	}

	words := strings.Split(sentence, " ")
	for i, w := range words {
		words[i] = trie.search(w)
	}
	return strings.Join(words, " ")
}
```

### Java

```java
// Replace Words：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Trie {
    Trie[] children = new Trie[26];
    boolean isEnd = false;

    void insert(String w) {
        Trie node = this;
        for (char c : w.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) {
                node.children[idx] = new Trie();
            }
            node = node.children[idx];
        }
        node.isEnd = true;
    }

    String search(String w) {
        Trie node = this;
        for (int i = 0; i < w.length(); i++) {
            int idx = w.charAt(i) - 'a';
            if (node.children[idx] == null) {
                return w;
            }
            node = node.children[idx];
            if (node.isEnd) {
                return w.substring(0, i + 1);
            }
        }
        return w;
    }
}

class Solution {
    public String replaceWords(List<String> dictionary, String sentence) {
        Trie trie = new Trie();
        for (String w : dictionary) {
            trie.insert(w);
        }

        String[] words = sentence.split(" ");
        for (int i = 0; i < words.length; i++) {
            words[i] = trie.search(words[i]);
        }
        return String.join(" ", words);
    }
}
```

### Python

```python
# Replace Words：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Trie:
    def __init__(self):
        self.children = [None] * 26
        self.is_end = False

    def insert(self, w: str) -> None:
        node = self
        for c in w:
            idx = ord(c) - ord("a")
            if node.children[idx] is None:
                node.children[idx] = Trie()
            node = node.children[idx]
        node.is_end = True

    def search(self, w: str) -> str:
        node = self
        for i, c in enumerate(w, 1):
            idx = ord(c) - ord("a")
            if node.children[idx] is None:
                return w
            node = node.children[idx]
            if node.is_end:
                return w[:i]
        return w


class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        trie = Trie()
        for w in dictionary:
            trie.insert(w)
        return " ".join(trie.search(w) for w in sentence.split())
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0527. Word Abbreviation

---
编号: 527
题目: Word Abbreviation
难度: 困难
标签: [贪心, 字典树, 数组, 字符串, 排序]
来源链接: https://leetcode.com/problems/word-abbreviation/
---

## 题目描述

给你一个字符串数组 `words` ，该数组由 **互不相同** 的若干字符串组成，请你找出并返回每个单词的 **最小缩写** 。

生成缩写的规则如下**：**

- 初始缩写由起始字母+省略字母的数量+结尾字母组成。

- 若存在冲突，亦即多于一个单词有同样的缩写，则使用更长的前缀代替首字母，直到从单词到缩写的映射唯一。换而言之，最终的缩写必须只能映射到一个单词。

- 若缩写并不比原单词更短，则保留原样。

**示例 1：**

```text
输入: words = ["like", "god", "internal", "me", "internet", "interval", "intension", "face", "intrusion"]
输出: ["l2e","god","internal","me","i6t","interval","inte4n","f2e","intr4n"]
```

**示例 2：**

```text
输入：words = ["aa","aaa"]
输出：["aa","aaa"]
```

**提示：**

- `1 <= words.length <= 400`

- `2 <= words[i].length <= 400`

- `words[i]` 由小写英文字母组成

- `words` 中的所有字符串 **互不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 字典树, 数组, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，如果两个单词的缩写相同，那么它们的首尾字母一定相同，并且它们的长度一定相同。因此，我们可以将所有的单词按照长度以及末尾字母进行分组，对于每组单词，我们使用字典树存储这组单词的信息。

字典树的每个节点结构如下：

- `children`：长度为 $26$ 的数组，表示该节点的所有子节点。
- `cnt`：表示经过该节点的单词数量。

对于每个单词，我们将其插入到字典树中，同时记录每个节点的 `cnt` 值。

在查询时，我们从根节点开始，对于当前的字母，如果其对应的子节点的 `cnt` 值为 $1$，那么我们就找到了唯一的缩写，我们返回当前前缀的长度即可。否则，我们继续向下遍历。遍历结束后，如果我们没有找到唯一的缩写，那么我们返回原单词的长度。在得到所有单词的前缀长度后，我们判断单词的缩写是否比原单词更短，如果是，那么我们将其加入答案中，否则我们将原单词加入答案中。

时间复杂度 $O(L)$，空间复杂度 $O(L)$，其中 $L$ 为所有单词的长度和。

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
// Word Abbreviation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type Trie struct {
	children [26]*Trie
	cnt      int
}

func (t *Trie) insert(w string) {
	node := t
	for _, c := range w {
		idx := c - 'a'
		if node.children[idx] == nil {
			node.children[idx] = &Trie{}
		}
		node = node.children[idx]
		node.cnt++
	}
}

func (t *Trie) search(w string) int {
	node := t
	ans := 0
	for _, c := range w {
		ans++
		idx := c - 'a'
		node = node.children[idx]
		if node.cnt == 1 {
			return ans
		}
	}
	return len(w)
}

func wordsAbbreviation(words []string) (ans []string) {
	tries := make(map[[2]int]*Trie)
	for _, w := range words {
		key := [2]int{len(w), int(w[len(w)-1] - 'a')}
		_, exists := tries[key]
		if !exists {
			tries[key] = &Trie{}
		}
		tries[key].insert(w)
	}

	for _, w := range words {
		m := len(w)
		key := [2]int{m, int(w[m-1] - 'a')}
		cnt := tries[key].search(w)
		if cnt+2 >= m {
			ans = append(ans, w)
		} else {
			abbr := w[:cnt] + fmt.Sprintf("%d", m-cnt-1) + w[m-1:]
			ans = append(ans, abbr)
		}
	}
	return
}
```

### Java

```java
// Word Abbreviation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Trie {
    private final Trie[] children = new Trie[26];
    private int cnt;

    public void insert(String w) {
        Trie node = this;
        for (char c : w.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) {
                node.children[idx] = new Trie();
            }
            node = node.children[idx];
            ++node.cnt;
        }
    }

    public int search(String w) {
        Trie node = this;
        int ans = 0;
        for (char c : w.toCharArray()) {
            ++ans;
            int idx = c - 'a';
            node = node.children[idx];
            if (node.cnt == 1) {
                return ans;
            }
        }
        return w.length();
    }
}

class Solution {
    public List<String> wordsAbbreviation(List<String> words) {
        Map<List<Integer>, Trie> tries = new HashMap<>();
        for (var w : words) {
            var key = List.of(w.length(), w.charAt(w.length() - 1) - 'a');
            tries.putIfAbsent(key, new Trie());
            tries.get(key).insert(w);
        }
        List<String> ans = new ArrayList<>();
        for (var w : words) {
            int m = w.length();
            var key = List.of(m, w.charAt(m - 1) - 'a');
            int cnt = tries.get(key).search(w);
            ans.add(cnt + 2 >= m ? w : w.substring(0, cnt) + (m - cnt - 1) + w.substring(m - 1));
        }
        return ans;
    }
}
```

### Python

```python
# Word Abbreviation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Trie:
    __slots__ = ["children", "cnt"]

    def __init__(self):
        self.children = [None] * 26
        self.cnt = 0

    def insert(self, w: str):
        node = self
        for c in w:
            idx = ord(c) - ord("a")
            if not node.children[idx]:
                node.children[idx] = Trie()
            node = node.children[idx]
            node.cnt += 1

    def search(self, w: str) -> int:
        node = self
        cnt = 0
        for c in w:
            cnt += 1
            idx = ord(c) - ord("a")
            node = node.children[idx]
            if node.cnt == 1:
                return cnt
        return len(w)


class Solution:
    def wordsAbbreviation(self, words: List[str]) -> List[str]:
        tries = {}
        for w in words:
            m = len(w)
            if (m, w[-1]) not in tries:
                tries[(m, w[-1])] = Trie()
            tries[(m, w[-1])].insert(w)
        ans = []
        for w in words:
            cnt = tries[(len(w), w[-1])].search(w)
            ans.append(
                w if cnt + 2 >= len(w) else w[:cnt] + str(len(w) - cnt - 1) + w[-1]
            )
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

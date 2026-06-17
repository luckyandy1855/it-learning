# 0677. Map Sum Pairs

---
编号: 677
题目: Map Sum Pairs
难度: 中等
标签: [设计, 字典树, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/map-sum-pairs/
---

## 题目描述

设计一个 map ，满足以下几点:

- 字符串表示键，整数表示值

- 返回具有前缀等于给定字符串的键的值的总和

实现一个 `MapSum` 类：

- `MapSum()` 初始化 `MapSum` 对象

- `void insert(String key, int val)` 插入 `key-val` 键值对，字符串表示键 `key` ，整数表示值 `val` 。如果键 `key` 已经存在，那么原来的键值对 `key-value` 将被替代成新的键值对。

- `int sum(string prefix)` 返回所有以该前缀 `prefix` 开头的键 `key` 的值的总和。

**示例 1：**

```text
输入：
["MapSum", "insert", "sum", "insert", "sum"]
[[], ["apple", 3], ["ap"], ["app", 2], ["ap"]]
输出：
[null, null, 3, null, 5]

解释：
MapSum mapSum = new MapSum();
mapSum.insert("apple", 3);
mapSum.sum("ap");           // 返回 3 (apple = 3)
mapSum.insert("app", 2);
mapSum.sum("ap");           // 返回 5 (apple + app = 3 + 2 = 5)
```

**提示：**

- `1 <= key.length, prefix.length <= 50`

- `key` 和 `prefix` 仅由小写英文字母组成

- `1 <= val <= 1000`

- 最多调用 `50` 次 `insert` 和 `sum`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 字典树, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用哈希表 $d$ 存放键值对，用前缀树 $t$ 存放键值对的前缀和。前缀树的每个节点包含两个信息：

- `val`：以该节点为前缀的键值对的值的总和
- `children`：长度为 $26$ 的数组，存放该节点的子节点

插入键值对 $(key, val)$ 时，我们先判断哈希表是否存在该键，如果存在，那么前缀树每个节点的 `val` 都要减去该键原来的值，然后再加上新的值。如果不存在，那么前缀树每个节点的 `val` 都要加上新的值。

查询前缀和时，我们从前缀树的根节点开始，遍历前缀字符串，如果当前节点的子节点中不存在该字符，那么说明前缀树中不存在该前缀，返回 $0$。否则，继续遍历下一个字符，直到遍历完前缀字符串，返回当前节点的 `val`。

时间复杂度方面，插入键值对的时间复杂度为 $O(n)$，其中 $n$ 为键的长度。查询前缀和的时间复杂度为 $O(m)$，其中 $m$ 为前缀的长度。

空间复杂度 $O(n \times m \times C)$，其中 $n$ 和 $m$ 分别是键的数量以及键的最大长度；而 $C$ 是字符集的大小，本题中 $C = 26$。

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
// Map Sum Pairs：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type trie struct {
	children [26]*trie
	val      int
}

func (t *trie) insert(w string, x int) {
	for _, c := range w {
		c -= 'a'
		if t.children[c] == nil {
			t.children[c] = &trie{}
		}
		t = t.children[c]
		t.val += x
	}
}

func (t *trie) search(w string) int {
	for _, c := range w {
		c -= 'a'
		if t.children[c] == nil {
			return 0
		}
		t = t.children[c]
	}
	return t.val
}

type MapSum struct {
	d map[string]int
	t *trie
}

func Constructor() MapSum {
	return MapSum{make(map[string]int), &trie{}}
}

func (this *MapSum) Insert(key string, val int) {
	x := val - this.d[key]
	this.d[key] = val
	this.t.insert(key, x)
}

func (this *MapSum) Sum(prefix string) int {
	return this.t.search(prefix)
}

/**
 * Your MapSum object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Insert(key,val);
 * param_2 := obj.Sum(prefix);
 */
```

### Java

```java
// Map Sum Pairs：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Trie {
    private Trie[] children = new Trie[26];
    private int val;

    public void insert(String w, int x) {
        Trie node = this;
        for (int i = 0; i < w.length(); ++i) {
            int idx = w.charAt(i) - 'a';
            if (node.children[idx] == null) {
                node.children[idx] = new Trie();
            }
            node = node.children[idx];
            node.val += x;
        }
    }

    public int search(String w) {
        Trie node = this;
        for (int i = 0; i < w.length(); ++i) {
            int idx = w.charAt(i) - 'a';
            if (node.children[idx] == null) {
                return 0;
            }
            node = node.children[idx];
        }
        return node.val;
    }
}

class MapSum {
    private Map<String, Integer> d = new HashMap<>();
    private Trie trie = new Trie();

    public MapSum() {
    }

    public void insert(String key, int val) {
        int x = val - d.getOrDefault(key, 0);
        d.put(key, val);
        trie.insert(key, x);
    }

    public int sum(String prefix) {
        return trie.search(prefix);
    }
}

/**
 * Your MapSum object will be instantiated and called as such:
 * MapSum obj = new MapSum();
 * obj.insert(key,val);
 * int param_2 = obj.sum(prefix);
 */
```

### Python

```python
# Map Sum Pairs：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Trie:
    def __init__(self):
        self.children: List[Trie | None] = [None] * 26
        self.val: int = 0

    def insert(self, w: str, x: int):
        node = self
        for c in w:
            idx = ord(c) - ord('a')
            if node.children[idx] is None:
                node.children[idx] = Trie()
            node = node.children[idx]
            node.val += x

    def search(self, w: str) -> int:
        node = self
        for c in w:
            idx = ord(c) - ord('a')
            if node.children[idx] is None:
                return 0
            node = node.children[idx]
        return node.val


class MapSum:
    def __init__(self):
        self.d = defaultdict(int)
        self.tree = Trie()

    def insert(self, key: str, val: int) -> None:
        x = val - self.d[key]
        self.d[key] = val
        self.tree.insert(key, x)

    def sum(self, prefix: str) -> int:
        return self.tree.search(prefix)


# Your MapSum object will be instantiated and called as such:
# obj = MapSum()
# obj.insert(key,val)
# param_2 = obj.sum(prefix)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

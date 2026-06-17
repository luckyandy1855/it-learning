# 1166. Design File System

---
编号: 1166
题目: Design File System
难度: 中等
标签: [设计, 字典树, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/design-file-system/
---

## 题目描述

你需要设计一个文件系统，你可以创建新的路径并将它们与不同的值关联。

路径的格式是一个或多个连接在一起的字符串，形式为： `/` ，后面跟着一个或多个小写英文字母。例如， `" /leetcode"` 和 `"/leetcode/problems"` 是有效路径，而空字符串 `""` 和 `"/"` 不是。

实现 `FileSystem` 类:

- `bool createPath(string path, int value)` 创建一个新的 `path` ，并在可能的情况下关联一个 `value` ，然后返回 `true` 。如果路径**已经存在**或其父路径**不存在**，则返回 `false` 。

-  `int get(string path)` 返回与 `path` 关联的值，如果路径不存在则返回 `-1` 。

**示例 1：**

```text
输入：
["FileSystem","create","get"]
[[],["/a",1],["/a"]]
输出：
[null,true,1]
解释：
FileSystem fileSystem = new FileSystem();

fileSystem.create("/a", 1); // 返回 true
fileSystem.get("/a"); // 返回 1
```

**示例 2：**

```text
输入：
["FileSystem","createPath","createPath","get","createPath","get"]
[[],["/leet",1],["/leet/code",2],["/leet/code"],["/c/d",1],["/c"]]
输出：
[null,true,true,2,false,-1]
解释：
FileSystem fileSystem = new FileSystem();

fileSystem.createPath("/leet", 1); // 返回 true
fileSystem.createPath("/leet/code", 2); // 返回 true
fileSystem.get("/leet/code"); // 返回 2
fileSystem.createPath("/c/d", 1); // 返回 false 因为父路径 "/c" 不存在。
fileSystem.get("/c"); // 返回 -1 因为该路径不存在。
```

**提示：**

- 对两个函数的调用次数加起来小于等于 `10^4`

- `2 <= path.length <= 100`

- `1 <= value <= 10^9`

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

我们可以使用前缀树来存储路径，每个节点存储一个值，表示该节点对应的路径的值。

定义前缀树的节点结构如下：

- `children`：子节点，使用哈希表存储，键为子节点的路径，值为子节点的引用；
- `v`：当前节点对应的路径的值。

定义前缀树的方法如下：

- `insert(w, v)`：插入路径 $w$，并将其对应的值设为 $v$。如果路径 $w$ 已经存在或其父路径不存在，则返回 `false`，否则返回 `true`。时间复杂度为 $O(|w|)$，其中 $|w|$ 为路径 $w$ 的长度；
- `search(w)`：返回路径 $w$ 对应的值。如果路径 $w$ 不存在，则返回 $-1$。时间复杂度为 $O(|w|)$。

总时间复杂度 $O(\sum_{w \in W}|w|)$，总空间复杂度 $O(\sum_{w \in W}|w|)$，其中 $W$ 为所有插入的路径的集合。

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
// Design File System：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type trie struct {
	children map[string]*trie
	v        int
}

func newTrie(v int) *trie {
	return &trie{map[string]*trie{}, v}
}

func (t *trie) insert(w string, v int) bool {
	node := t
	ps := strings.Split(w, "/")
	for _, p := range ps[1 : len(ps)-1] {
		if _, ok := node.children[p]; !ok {
			return false
		}
		node = node.children[p]
	}
	if _, ok := node.children[ps[len(ps)-1]]; ok {
		return false
	}
	node.children[ps[len(ps)-1]] = newTrie(v)
	return true
}

func (t *trie) search(w string) int {
	node := t
	ps := strings.Split(w, "/")
	for _, p := range ps[1:] {
		if _, ok := node.children[p]; !ok {
			return -1
		}
		node = node.children[p]
	}
	return node.v
}

type FileSystem struct {
	trie *trie
}

func Constructor() FileSystem {
	return FileSystem{trie: newTrie(-1)}
}

func (this *FileSystem) CreatePath(path string, value int) bool {
	return this.trie.insert(path, value)
}

func (this *FileSystem) Get(path string) int {
	return this.trie.search(path)
}

/**
 * Your FileSystem object will be instantiated and called as such:
 * obj := Constructor();
 * param_1 := obj.CreatePath(path,value);
 * param_2 := obj.Get(path);
 */
```

### Java

```java
// Design File System：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Trie {
    Map<String, Trie> children = new HashMap<>();
    int v;

    Trie(int v) {
        this.v = v;
    }

    boolean insert(String w, int v) {
        Trie node = this;
        var ps = w.split("/");
        for (int i = 1; i < ps.length - 1; ++i) {
            var p = ps[i];
            if (!node.children.containsKey(p)) {
                return false;
            }
            node = node.children.get(p);
        }
        if (node.children.containsKey(ps[ps.length - 1])) {
            return false;
        }
        node.children.put(ps[ps.length - 1], new Trie(v));
        return true;
    }

    int search(String w) {
        Trie node = this;
        var ps = w.split("/");
        for (int i = 1; i < ps.length; ++i) {
            var p = ps[i];
            if (!node.children.containsKey(p)) {
                return -1;
            }
            node = node.children.get(p);
        }
        return node.v;
    }
}

class FileSystem {
    private Trie trie = new Trie(-1);

    public FileSystem() {
    }

    public boolean createPath(String path, int value) {
        return trie.insert(path, value);
    }

    public int get(String path) {
        return trie.search(path);
    }
}

/**
 * Your FileSystem object will be instantiated and called as such:
 * FileSystem obj = new FileSystem();
 * boolean param_1 = obj.createPath(path,value);
 * int param_2 = obj.get(path);
 */
```

### Python

```python
# Design File System：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Trie:
    def __init__(self, v: int = -1):
        self.children = {}
        self.v = v

    def insert(self, w: str, v: int) -> bool:
        node = self
        ps = w.split("/")
        for p in ps[1:-1]:
            if p not in node.children:
                return False
            node = node.children[p]
        if ps[-1] in node.children:
            return False
        node.children[ps[-1]] = Trie(v)
        return True

    def search(self, w: str) -> int:
        node = self
        for p in w.split("/")[1:]:
            if p not in node.children:
                return -1
            node = node.children[p]
        return node.v


class FileSystem:
    def __init__(self):
        self.trie = Trie()

    def createPath(self, path: str, value: int) -> bool:
        return self.trie.insert(path, value)

    def get(self, path: str) -> int:
        return self.trie.search(path)


# Your FileSystem object will be instantiated and called as such:
# obj = FileSystem()
# param_1 = obj.createPath(path,value)
# param_2 = obj.get(path)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

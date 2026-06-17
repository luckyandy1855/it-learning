# 1206. Design Skiplist

---
编号: 1206
题目: Design Skiplist
难度: 困难
标签: [设计, 链表]
来源链接: https://leetcode.com/problems/design-skiplist/
---

## 题目描述

不使用任何库函数，设计一个 **跳表** 。

**跳表** 是在 `O(log(n))` 时间内完成增加、删除、搜索操作的数据结构。跳表相比于树堆与红黑树，其功能与性能相当，并且跳表的代码长度相较下更短，其设计思想与链表相似。

例如，一个跳表包含 `[30, 40, 50, 60, 70, 90]` ，然后增加 `80`、`45` 到跳表中，以下图的方式操作：

跳表中有很多层，每一层是一个短的链表。在第一层的作用下，增加、删除和搜索操作的时间复杂度不超过 `O(n)`。跳表的每一个操作的平均时间复杂度是 `O(log(n))`，空间复杂度是 `O(n)`。

了解更多 : https://oi-wiki.org/ds/skiplist/

在本题中，你的设计应该要包含这些函数：

- `bool search(int target)` : 返回target是否存在于跳表中。

- `void add(int num)`: 插入一个元素到跳表。

- `bool erase(int num)`: 在跳表中删除一个值，如果 `num` 不存在，直接返回false. 如果存在多个 `num` ，删除其中任意一个即可。

注意，跳表中可能存在多个相同的值，你的代码需要处理这种情况。

**示例 1:**

```text
输入
["Skiplist", "add", "add", "add", "search", "add", "search", "erase", "erase", "search"]
[[], [1], [2], [3], [0], [4], [1], [0], [1], [1]]
输出
[null, null, null, null, false, null, true, false, true, false]

解释
Skiplist skiplist = new Skiplist();
skiplist.add(1);
skiplist.add(2);
skiplist.add(3);
skiplist.search(0);   // 返回 false
skiplist.add(4);
skiplist.search(1);   // 返回 true
skiplist.erase(0);    // 返回 false，0 不在跳表中
skiplist.erase(1);    // 返回 true
skiplist.search(1);   // 返回 false，1 已被擦除
```

**提示:**

- `0 <= num, target <= 2 * 10^4`

- 调用`search`, `add`,  `erase`操作次数不大于 `5 * 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 链表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

跳表的核心思想是使用多个“层级”来存储数据，每一层都相当于一个索引。数据从底层的链表开始逐渐上升到更高层级的链表，最终形成一个多层链表结构。每一层的节点只包含部分数据，这样就可以通过跳跃来减少查找的时间。

在这个问题中，我们使用一个 $\textit{Node}$ 类来表示跳表的节点，每个节点包含一个 $\textit{val}$ 域和一个 $\textit{next}$ 数组，数组的长度为 $\textit{level}$，表示当前节点在每一层的下一个节点。我们使用一个 $\textit{Skiplist}$ 类来实现跳表的操作。

跳表包含一个头节点 $\textit{head}$ 和当前的最大层数 $\textit{level}$。头节点的值设为 $-1$，用于标识链表的起始位置。我们使用一个动态数组 $\textit{next}$ 来存储指向后继节点的指针。

对于 $\textit{search}$ 操作，我们从跳表的最高层开始，逐层向下遍历，直到找到目标节点或者确定目标节点不存在。每层都通过 $\textit{find\_closest}$ 方法跳跃到最接近目标的节点。

对于 $\textit{add}$ 操作，我们首先随机决定新节点的层数。然后，从最高层开始，逐层找到每层中最接近新值的节点，并在相应位置插入新节点。如果插入的层数大于当前跳表的最大层数，我们需要更新跳表的层数。

对于 $\textit{erase}$ 操作，类似于查找操作，遍历跳表的每一层，找到需要删除的节点并删除它。删除节点时需要更新每一层的 $\textit{next}$ 指针。如果跳表的最高层没有节点，则需要减少跳表的层数。

另外，我们定义了一个 $\textit{random\_level}$ 方法来随机决定新节点的层数。该方法会生成一个 $[1, \textit{max\_level}]$ 之间的随机数，直到生成的随机数大于等于 $\textit{p}$ 为止。还有一个 $\textit{find\_closest}$ 方法用于查找每一层中最接近目标值的节点。

上述操作的时间复杂度为 $O(\log n)$，其中 $n$ 为跳表的节点数。空间复杂度为 $O(n)$。

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
// Design Skiplist：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func init() { rand.Seed(time.Now().UnixNano()) }

const (
	maxLevel = 16
	p        = 0.5
)

type node struct {
	val  int
	next []*node
}

func newNode(val, level int) *node {
	return &node{
		val:  val,
		next: make([]*node, level),
	}
}

type Skiplist struct {
	head  *node
	level int
}

func Constructor() Skiplist {
	return Skiplist{
		head:  newNode(-1, maxLevel),
		level: 1,
	}
}

func (this *Skiplist) Search(target int) bool {
	p := this.head
	for i := this.level - 1; i >= 0; i-- {
		p = findClosest(p, i, target)
		if p.next[i] != nil && p.next[i].val == target {
			return true
		}
	}
	return false
}

func (this *Skiplist) Add(num int) {
	level := randomLevel()
	if level > this.level {
		this.level = level
	}
	node := newNode(num, level)
	p := this.head
	for i := this.level - 1; i >= 0; i-- {
		p = findClosest(p, i, num)
		if i < level {
			node.next[i] = p.next[i]
			p.next[i] = node
		}
	}
}

func (this *Skiplist) Erase(num int) bool {
	ok := false
	p := this.head
	for i := this.level - 1; i >= 0; i-- {
		p = findClosest(p, i, num)
		if p.next[i] != nil && p.next[i].val == num {
			p.next[i] = p.next[i].next[i]
			ok = true
		}
	}
	for this.level > 1 && this.head.next[this.level-1] == nil {
		this.level--
	}
	return ok
}

func findClosest(p *node, level, target int) *node {
	for p.next[level] != nil && p.next[level].val < target {
		p = p.next[level]
	}
	return p
}

func randomLevel() int {
	level := 1
	for level < maxLevel && rand.Float64() < p {
		level++
	}
	return level
}

/**
 * Your Skiplist object will be instantiated and called as such:
 * obj := Constructor();
 * param_1 := obj.Search(target);
 * obj.Add(num);
 * param_3 := obj.Erase(num);
 */
```

### Java

```java
// Design Skiplist：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Skiplist {
    private static final int MAX_LEVEL = 32;
    private static final double P = 0.25;
    private static final Random RANDOM = new Random();
    private final Node head = new Node(-1, MAX_LEVEL);
    private int level = 0;

    public Skiplist() {
    }

    public boolean search(int target) {
        Node curr = head;
        for (int i = level - 1; i >= 0; --i) {
            curr = findClosest(curr, i, target);
            if (curr.next[i] != null && curr.next[i].val == target) {
                return true;
            }
        }
        return false;
    }

    public void add(int num) {
        Node curr = head;
        int lv = randomLevel();
        Node node = new Node(num, lv);
        level = Math.max(level, lv);
        for (int i = level - 1; i >= 0; --i) {
            curr = findClosest(curr, i, num);
            if (i < lv) {
                node.next[i] = curr.next[i];
                curr.next[i] = node;
            }
        }
    }

    public boolean erase(int num) {
        Node curr = head;
        boolean ok = false;
        for (int i = level - 1; i >= 0; --i) {
            curr = findClosest(curr, i, num);
            if (curr.next[i] != null && curr.next[i].val == num) {
                curr.next[i] = curr.next[i].next[i];
                ok = true;
            }
        }
        while (level > 1 && head.next[level - 1] == null) {
            --level;
        }
        return ok;
    }

    private Node findClosest(Node curr, int level, int target) {
        while (curr.next[level] != null && curr.next[level].val < target) {
            curr = curr.next[level];
        }
        return curr;
    }

    private static int randomLevel() {
        int level = 1;
        while (level < MAX_LEVEL && RANDOM.nextDouble() < P) {
            ++level;
        }
        return level;
    }

    static class Node {
        int val;
        Node[] next;

        Node(int val, int level) {
            this.val = val;
            next = new Node[level];
        }
    }
}

/**
 * Your Skiplist object will be instantiated and called as such:
 * Skiplist obj = new Skiplist();
 * boolean param_1 = obj.search(target);
 * obj.add(num);
 * boolean param_3 = obj.erase(num);
 */
```

### Python

```python
# Design Skiplist：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Node:
    __slots__ = ['val', 'next']

    def __init__(self, val: int, level: int):
        self.val = val
        self.next = [None] * level


class Skiplist:
    max_level = 32
    p = 0.25

    def __init__(self):
        self.head = Node(-1, self.max_level)
        self.level = 0

    def search(self, target: int) -> bool:
        curr = self.head
        for i in range(self.level - 1, -1, -1):
            curr = self.find_closest(curr, i, target)
            if curr.next[i] and curr.next[i].val == target:
                return True
        return False

    def add(self, num: int) -> None:
        curr = self.head
        level = self.random_level()
        node = Node(num, level)
        self.level = max(self.level, level)
        for i in range(self.level - 1, -1, -1):
            curr = self.find_closest(curr, i, num)
            if i < level:
                node.next[i] = curr.next[i]
                curr.next[i] = node

    def erase(self, num: int) -> bool:
        curr = self.head
        ok = False
        for i in range(self.level - 1, -1, -1):
            curr = self.find_closest(curr, i, num)
            if curr.next[i] and curr.next[i].val == num:
                curr.next[i] = curr.next[i].next[i]
                ok = True
        while self.level > 1 and self.head.next[self.level - 1] is None:
            self.level -= 1
        return ok

    def find_closest(self, curr: Node, level: int, target: int) -> Node:
        while curr.next[level] and curr.next[level].val < target:
            curr = curr.next[level]
        return curr

    def random_level(self) -> int:
        level = 1
        while level < self.max_level and random.random() < self.p:
            level += 1
        return level


# Your Skiplist object will be instantiated and called as such:
# obj = Skiplist()
# param_1 = obj.search(target)
# obj.add(num)
# param_3 = obj.erase(num)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

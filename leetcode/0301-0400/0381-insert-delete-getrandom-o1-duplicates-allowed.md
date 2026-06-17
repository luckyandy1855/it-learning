# 0381. Insert Delete GetRandom O(1) - Duplicates allowed

---
编号: 381
题目: Insert Delete GetRandom O(1) - Duplicates allowed
难度: 困难
标签: [设计, 数组, 哈希表, 数学, 随机化]
来源链接: https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/
---

## 题目描述

`RandomizedCollection` 是一种包含数字集合(可能是重复的)的数据结构。它应该支持插入和删除特定元素，以及删除随机元素。

实现 `RandomizedCollection` 类:

	- `RandomizedCollection()`初始化空的 `RandomizedCollection` 对象。

	- `bool insert(int val)` 将一个 `val` 项插入到集合中，即使该项已经存在。如果该项不存在，则返回 `true` ，否则返回 `false` 。

	- `bool remove(int val)` 如果存在，从集合中移除一个 `val` 项。如果该项存在，则返回 `true` ，否则返回 `false` 。注意，如果 `val` 在集合中出现多次，我们只删除其中一个。

	- `int getRandom()` 从当前的多个元素集合中返回一个随机元素。每个元素被返回的概率与集合中包含的相同值的数量 **线性相关** 。

您必须实现类的函数，使每个函数的 **平均** 时间复杂度为 `O(1)` 。

**注意：**生成测试用例时，只有在 `RandomizedCollection` 中 **至少有一项** 时，才会调用 `getRandom` 。

**示例 1:**

```text
输入
["RandomizedCollection", "insert", "insert", "insert", "getRandom", "remove", "getRandom"]
[[], [1], [1], [2], [], [1], []]
输出
[null, true, false, true, 2, true, 1]

解释
RandomizedCollection collection = new RandomizedCollection();// 初始化一个空的集合。
collection.insert(1);   // 返回 true，因为集合不包含 1。
                        // 将 1 插入到集合中。
collection.insert(1);   // 返回 false，因为集合包含 1。
                        // 将另一个 1 插入到集合中。集合现在包含 [1,1]。
collection.insert(2);   // 返回 true，因为集合不包含 2。
                        // 将 2 插入到集合中。集合现在包含 [1,1,2]。
collection.getRandom(); // getRandom 应当:
                        // 有 2/3 的概率返回 1,
                        // 1/3 的概率返回 2。
collection.remove(1);   // 返回 true，因为集合包含 1。
                        // 从集合中移除 1。集合现在包含 [1,2]。
collection.getRandom(); // getRandom 应该返回 1 或 2，两者的可能性相同。
```

**提示:**

	- `-2^31 <= val <= 2^31 - 1`

	- `insert`, `remove` 和 `getRandom` 最多 **总共** 被调用 `2 * 10^5` 次

	- 当调用 `getRandom` 时，数据结构中 **至少有一个** 元素

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 数组, 哈希表, 数学, 随机化」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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

### Go

```go
import "math/rand"

// Insert Delete GetRandom O(1) - Duplicates allowed：数组存值，哈希表存每个值出现的下标集合。
// 关键点：删除时把末尾元素搬到被删位置，并同步两个下标集合。
type RandomizedCollection struct {
	nums []int
	idx  map[int]map[int]bool
}

func Constructor() RandomizedCollection {
	return RandomizedCollection{
		nums: []int{},
		idx:  map[int]map[int]bool{},
	}
}

func (this *RandomizedCollection) Insert(val int) bool {
	if this.idx[val] == nil {
		this.idx[val] = map[int]bool{}
	}
	this.nums = append(this.nums, val)
	this.idx[val][len(this.nums)-1] = true
	return len(this.idx[val]) == 1
}

func (this *RandomizedCollection) Remove(val int) bool {
	if len(this.idx[val]) == 0 {
		return false
	}

	removeIdx := 0
	for i := range this.idx[val] {
		removeIdx = i
		break
	}

	lastIdx := len(this.nums) - 1
	lastVal := this.nums[lastIdx]
	this.nums[removeIdx] = lastVal

	delete(this.idx[val], removeIdx)
	if removeIdx != lastIdx {
		delete(this.idx[lastVal], lastIdx)
		this.idx[lastVal][removeIdx] = true
	}
	this.nums = this.nums[:lastIdx]
	return true
}

func (this *RandomizedCollection) GetRandom() int {
	return this.nums[rand.Intn(len(this.nums))]
}
```

### Java

```java
// Insert Delete GetRandom O(1) - Duplicates allowed：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class RandomizedCollection {
    private Map<Integer, Set<Integer>> m;
    private List<Integer> l;
    private Random rnd;

    /** Initialize your data structure here. */
    public RandomizedCollection() {
        m = new HashMap<>();
        l = new ArrayList<>();
        rnd = new Random();
    }

    /**
     * Inserts a value to the collection. Returns true if the collection did not already contain
     * the specified element.
     */
    public boolean insert(int val) {
        m.computeIfAbsent(val, k -> new HashSet<>()).add(l.size());
        l.add(val);
        return m.get(val).size() == 1;
    }

    /**
     * Removes a value from the collection. Returns true if the collection contained the specified
     * element.
     */
    public boolean remove(int val) {
        if (!m.containsKey(val)) {
            return false;
        }
        Set<Integer> idxSet = m.get(val);
        int idx = idxSet.iterator().next();
        int lastIdx = l.size() - 1;
        l.set(idx, l.get(lastIdx));
        idxSet.remove(idx);

        Set<Integer> lastIdxSet = m.get(l.get(lastIdx));
        lastIdxSet.remove(lastIdx);
        if (idx < lastIdx) {
            lastIdxSet.add(idx);
        }
        if (idxSet.isEmpty()) {
            m.remove(val);
        }
        l.remove(lastIdx);
        return true;
    }

    /** Get a random element from the collection. */
    public int getRandom() {
        int size = l.size();
        return size == 0 ? -1 : l.get(rnd.nextInt(size));
    }
}

/**
 * Your RandomizedCollection object will be instantiated and called as such:
 * RandomizedCollection obj = new RandomizedCollection();
 * boolean param_1 = obj.insert(val);
 * boolean param_2 = obj.remove(val);
 * int param_3 = obj.getRandom();
 */
```

### Python

```python
# Insert Delete GetRandom O(1) - Duplicates allowed：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class RandomizedCollection:
    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.m = {}
        self.l = []

    def insert(self, val: int) -> bool:
        """
        Inserts a value to the collection. Returns true if the collection did not already contain the specified element.
        """
        idx_set = self.m.get(val, set())
        idx_set.add(len(self.l))
        self.m[val] = idx_set
        self.l.append(val)
        return len(idx_set) == 1

    def remove(self, val: int) -> bool:
        """
        Removes a value from the collection. Returns true if the collection contained the specified element.
        """
        if val not in self.m:
            return False
        idx_set = self.m[val]
        idx = list(idx_set)[0]
        last_idx = len(self.l) - 1
        self.l[idx] = self.l[last_idx]
        idx_set.remove(idx)

        last_idx_set = self.m[self.l[last_idx]]
        if last_idx in last_idx_set:
            last_idx_set.remove(last_idx)
        if idx < last_idx:
            last_idx_set.add(idx)
        if not idx_set:
            self.m.pop(val)
        self.l.pop()
        return True

    def getRandom(self) -> int:
        """
        Get a random element from the collection.
        """
        return -1 if len(self.l) == 0 else random.choice(self.l)


# Your RandomizedCollection object will be instantiated and called as such:
# obj = RandomizedCollection()
# param_1 = obj.insert(val)
# param_2 = obj.remove(val)
# param_3 = obj.getRandom()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

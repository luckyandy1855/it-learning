# 0281. Zigzag Iterator

---
编号: 281
题目: Zigzag Iterator
难度: 中等
标签: [设计, 队列, 数组, 迭代器]
来源链接: https://leetcode.com/problems/zigzag-iterator/
---

## 题目描述

给出两个整数向量 `v1` 和 `v2`，请你实现一个迭代器，交替返回它们的元素。

实现 `ZigzagIterator` 类：

- `ZigzagIterator(List v1, List v2)` 用两个向量 `v1` 和 `v2` 初始化对象。

- `boolean hasNext()` 如果迭代器还有元素返回 `true`，否则返回 `false`。

- `int next()` 返回迭代器的当前元素并将迭代器移动到下一个元素。

示例 1:

```text
输入：v1 = [1,2], v2 = [3,4,5,6]
输出：[1,3,2,4,5,6]
解释：通过重复调用 next 直到 hasNext 返回 false，那么 next 返回的元素的顺序应该是：[1,3,2,4,5,6]。
```

示例 2:

```text
输入：v1 = [1], v2 = []
输出：[1]
```

示例 3:

```text
输入：v1 = [], v2 = [1]
输出：[1]
```

**拓展：**假如给你 `k` 个向量呢？你的代码在这种情况下的扩展性又会如何呢?

**拓展声明：**

 “锯齿” 顺序对于 `k > 2` 的情况定义可能会有些歧义。所以，假如你觉得 “锯齿” 这个表述不妥，也可以认为这是一种 “循环”。例如：

```text
输入：v1 = [1,2,3], v2 = [4,5,6,7], v3 = [8,9]
输出：[1,4,8,2,5,9,3,6,7]
```

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 队列, 数组, 迭代器」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
// Zigzag Iterator：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type ZigzagIterator struct {
	cur     int
	size    int
	indexes []int
	vectors [][]int
}

func Constructor(v1, v2 []int) *ZigzagIterator {
	return &ZigzagIterator{
		cur:     0,
		size:    2,
		indexes: []int{0, 0},
		vectors: [][]int{v1, v2},
	}
}

func (this *ZigzagIterator) next() int {
	vector := this.vectors[this.cur]
	index := this.indexes[this.cur]
	res := vector[index]
	this.indexes[this.cur]++
	this.cur = (this.cur + 1) % this.size
	return res
}

func (this *ZigzagIterator) hasNext() bool {
	start := this.cur
	for this.indexes[this.cur] == len(this.vectors[this.cur]) {
		this.cur = (this.cur + 1) % this.size
		if start == this.cur {
			return false
		}
	}
	return true
}

/**
 * Your ZigzagIterator object will be instantiated and called as such:
 * obj := Constructor(param_1, param_2);
 * for obj.hasNext() {
 *	 ans = append(ans, obj.next())
 * }
 */
```

### Java

```java
import java.util.*;
// Zigzag Iterator：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
public class ZigzagIterator {
    private int cur;
    private int size;
    private List<Integer> indexes = new ArrayList<>();
    private List<List<Integer>> vectors = new ArrayList<>();

    public ZigzagIterator(List<Integer> v1, List<Integer> v2) {
        cur = 0;
        size = 2;
        indexes.add(0);
        indexes.add(0);
        vectors.add(v1);
        vectors.add(v2);
    }

    public int next() {
        List<Integer> vector = vectors.get(cur);
        int index = indexes.get(cur);
        int res = vector.get(index);
        indexes.set(cur, index + 1);
        cur = (cur + 1) % size;
        return res;
    }

    public boolean hasNext() {
        int start = cur;
        while (indexes.get(cur) == vectors.get(cur).size()) {
            cur = (cur + 1) % size;
            if (start == cur) {
                return false;
            }
        }
        return true;
    }
}

/**
 * Your ZigzagIterator object will be instantiated and called as such:
 * ZigzagIterator i = new ZigzagIterator(v1, v2);
 * while (i.hasNext()) v[f()] = i.next();
 */
```

### Python

```python
# Zigzag Iterator：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class ZigzagIterator:
    def __init__(self, v1: List[int], v2: List[int]):
        self.cur = 0
        self.size = 2
        self.indexes = [0] * self.size
        self.vectors = [v1, v2]

    def next(self) -> int:
        vector = self.vectors[self.cur]
        index = self.indexes[self.cur]
        res = vector[index]
        self.indexes[self.cur] = index + 1
        self.cur = (self.cur + 1) % self.size
        return res

    def hasNext(self) -> bool:
        start = self.cur
        while self.indexes[self.cur] == len(self.vectors[self.cur]):
            self.cur = (self.cur + 1) % self.size
            if self.cur == start:
                return False
        return True


# Your ZigzagIterator object will be instantiated and called as such:
# i, v = ZigzagIterator(v1, v2), []
# while i.hasNext(): v.append(i.next())
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

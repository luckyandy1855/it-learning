# 1172. Dinner Plate Stacks

---
编号: 1172
题目: Dinner Plate Stacks
难度: 困难
标签: [栈, 设计, 哈希表, 堆（优先队列）]
来源链接: https://leetcode.com/problems/dinner-plate-stacks/
---

## 题目描述

我们把无限数量 &infin; 的栈排成一行，按从左到右的次序从 0 开始编号。每个栈的的最大容量 `capacity` 都相同。

实现一个叫「餐盘」的类 `DinnerPlates`：

- `DinnerPlates(int capacity)` - 给出栈的最大容量 `capacity`。

- `void push(int val)` - 将给出的正整数 `val` 推入 **从左往右第一个 **没有满的栈。

- `int pop()` - 返回 **从右往左第一个 **非空栈顶部的值，并将其从栈中删除；如果所有的栈都是空的，请返回 `-1`。

- `int popAtStack(int index)` - 返回编号 `index` 的栈顶部的值，并将其从栈中删除；如果编号 `index` 的栈是空的，请返回 `-1`。

**示例：**

```text
输入：
["DinnerPlates","push","push","push","push","push","popAtStack","push","push","popAtStack","popAtStack","pop","pop","pop","pop","pop"]
[[2],[1],[2],[3],[4],[5],[0],[20],[21],[0],[2],[],[],[],[],[]]
输出：
[null,null,null,null,null,null,2,null,null,20,21,5,4,3,1,-1]

解释：
DinnerPlates D = DinnerPlates(2);  // 初始化，栈最大容量 capacity = 2
D.push(1);
D.push(2);
D.push(3);
D.push(4);
D.push(5);         // 栈的现状为：    2  4
                                    1  3  5
                                    ﹈ ﹈ ﹈
D.popAtStack(0);   // 返回 2。栈的现状为：      4
                                          1  3  5
                                          ﹈ ﹈ ﹈
D.push(20);        // 栈的现状为：  20  4
                                   1  3  5
                                   ﹈ ﹈ ﹈
D.push(21);        // 栈的现状为：  20  4 21
                                   1  3  5
                                   ﹈ ﹈ ﹈
D.popAtStack(0);   // 返回 20。栈的现状为：       4 21
                                            1  3  5
                                            ﹈ ﹈ ﹈
D.popAtStack(2);   // 返回 21。栈的现状为：       4
                                            1  3  5
                                            ﹈ ﹈ ﹈
D.pop()            // 返回 5。栈的现状为：        4
                                            1  3
                                            ﹈ ﹈
D.pop()            // 返回 4。栈的现状为：    1  3
                                           ﹈ ﹈
D.pop()            // 返回 3。栈的现状为：    1
                                           ﹈
D.pop()            // 返回 1。现在没有栈。
D.pop()            // 返回 -1。仍然没有栈。
```

**提示：**

- `1 <= capacity <= 20000`

- `1 <= val <= 20000`

- `0 <= index <= 100000`

- 最多会对 `push`，`pop`，和 `popAtStack` 进行 `200000` 次调用。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 设计, 哈希表, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义以下数据结构或变量：

- `capacity`：每个栈的容量；
- `stacks`：栈数组，用于存储所有的栈，其中每个栈的最大容量都是 `capacity`；
- `not_full`：有序集合，用于存储所有未满的栈在栈数组中的下标。

对于 `push(val)` 操作：

- 我们首先判断 `not_full` 是否为空，如果为空，则说明没有未满的栈，需要新建一个栈，然后将 `val` 压入该栈中，此时判断容量 `capacity` 是否大于 $1$，如果大于 $1$，则将该栈的下标加入 `not_full` 中。
- 如果 `not_full` 不为空，则说明有未满的栈，我们取出 `not_full` 中最小的下标 `index`，将 `val` 压入 `stacks[index]` 中，此时如果 `stacks[index]` 的容量等于 `capacity`，则将 `index` 从 `not_full` 中删除。

对于 `popAtStack(index)` 操作：

- 我们首先判断 `index` 是否在 `stacks` 的下标范围内，如果不在，则直接返回 $-1$。如果 `stacks[index]` 为空，同样直接返回 $-1$。
- 如果 `stacks[index]` 不为空，则弹出 `stacks[index]` 的栈顶元素 `val`。如果 `index` 等于 `stacks` 的长度减 $1$，则说明 `stacks[index]` 是最后一个栈，如果为空，我们循环将最后一个栈的下标从 `not_full` 中移出，并且在栈数组 `stacks` 中移除最后一个栈，直到最后一个栈不为空、或者栈数组 `stacks` 为空为止。否则，如果 `stacks[index]` 不是最后一个栈，我们将 `index` 加入 `not_full` 中。
- 最后返回 `val`。

对于 `pop()` 操作：

- 我们直接调用 `popAtStack(stacks.length - 1)` 即可。

时间复杂度 $(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为操作次数。

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
// Dinner Plate Stacks：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type DinnerPlates struct {
	capacity int
	stacks   [][]int
	notFull  *redblacktree.Tree
}

func Constructor(capacity int) DinnerPlates {
	return DinnerPlates{capacity: capacity, notFull: redblacktree.NewWithIntComparator()}
}

func (this *DinnerPlates) Push(val int) {
	if this.notFull.Size() == 0 {
		this.stacks = append(this.stacks, []int{val})
		if this.capacity > 1 {
			this.notFull.Put(len(this.stacks)-1, nil)
		}
	} else {
		index, _ := this.notFull.Left().Key.(int)
		this.stacks[index] = append(this.stacks[index], val)
		if len(this.stacks[index]) == this.capacity {
			this.notFull.Remove(index)
		}
	}
}

func (this *DinnerPlates) Pop() int {
	return this.PopAtStack(len(this.stacks) - 1)
}

func (this *DinnerPlates) PopAtStack(index int) int {
	if index < 0 || index >= len(this.stacks) || len(this.stacks[index]) == 0 {
		return -1
	}
	val := this.stacks[index][len(this.stacks[index])-1]
	this.stacks[index] = this.stacks[index][:len(this.stacks[index])-1]
	if index == len(this.stacks)-1 && len(this.stacks[index]) == 0 {
		for len(this.stacks) > 0 && len(this.stacks[len(this.stacks)-1]) == 0 {
			this.notFull.Remove(len(this.stacks) - 1)
			this.stacks = this.stacks[:len(this.stacks)-1]
		}
	} else {
		this.notFull.Put(index, nil)
	}
	return val
}

/**
 * Your DinnerPlates object will be instantiated and called as such:
 * obj := Constructor(capacity);
 * obj.Push(val);
 * param_2 := obj.Pop();
 * param_3 := obj.PopAtStack(index);
 */
```

### Java

```java
// Dinner Plate Stacks：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class DinnerPlates {
    private int capacity;
    private List<Deque<Integer>> stacks = new ArrayList<>();
    private TreeSet<Integer> notFull = new TreeSet<>();

    public DinnerPlates(int capacity) {
        this.capacity = capacity;
    }

    public void push(int val) {
        if (notFull.isEmpty()) {
            stacks.add(new ArrayDeque<>());
            stacks.get(stacks.size() - 1).push(val);
            if (capacity > 1) {
                notFull.add(stacks.size() - 1);
            }
        } else {
            int index = notFull.first();
            stacks.get(index).push(val);
            if (stacks.get(index).size() == capacity) {
                notFull.pollFirst();
            }
        }
    }

    public int pop() {
        return popAtStack(stacks.size() - 1);
    }

    public int popAtStack(int index) {
        if (index < 0 || index >= stacks.size() || stacks.get(index).isEmpty()) {
            return -1;
        }
        int val = stacks.get(index).pop();
        if (index == stacks.size() - 1 && stacks.get(stacks.size() - 1).isEmpty()) {
            while (!stacks.isEmpty() && stacks.get(stacks.size() - 1).isEmpty()) {
                notFull.remove(stacks.size() - 1);
                stacks.remove(stacks.size() - 1);
            }
        } else {
            notFull.add(index);
        }
        return val;
    }
}

/**
 * Your DinnerPlates object will be instantiated and called as such:
 * DinnerPlates obj = new DinnerPlates(capacity);
 * obj.push(val);
 * int param_2 = obj.pop();
 * int param_3 = obj.popAtStack(index);
 */
```

### Python

```python
# Dinner Plate Stacks：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class DinnerPlates:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.stacks = []
        self.not_full = SortedSet()

    def push(self, val: int) -> None:
        if not self.not_full:
            self.stacks.append([val])
            if self.capacity > 1:
                self.not_full.add(len(self.stacks) - 1)
        else:
            index = self.not_full[0]
            self.stacks[index].append(val)
            if len(self.stacks[index]) == self.capacity:
                self.not_full.discard(index)

    def pop(self) -> int:
        return self.popAtStack(len(self.stacks) - 1)

    def popAtStack(self, index: int) -> int:
        if index < 0 or index >= len(self.stacks) or not self.stacks[index]:
            return -1
        val = self.stacks[index].pop()
        if index == len(self.stacks) - 1 and not self.stacks[-1]:
            while self.stacks and not self.stacks[-1]:
                self.not_full.discard(len(self.stacks) - 1)
                self.stacks.pop()
        else:
            self.not_full.add(index)
        return val


# Your DinnerPlates object will be instantiated and called as such:
# obj = DinnerPlates(capacity)
# obj.push(val)
# param_2 = obj.pop()
# param_3 = obj.popAtStack(index)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

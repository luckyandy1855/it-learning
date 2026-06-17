# 0731. My Calendar II

---
编号: 731
题目: My Calendar II
难度: 中等
标签: [设计, 线段树, 数组, 二分查找, 有序集合, 前缀和]
来源链接: https://leetcode.com/problems/my-calendar-ii/
---

## 题目描述

实现一个程序来存放你的日程安排。如果要添加的时间内不会导致三重预订时，则可以存储这个新的日程安排。

当三个日程安排有一些时间上的交叉时（例如三个日程安排都在同一时间内），就会产生 **三重预订**。

事件能够用一对整数 `startTime` 和 `endTime` 表示，在一个半开区间的时间 `[startTime, endTime)` 上预定。实数 `x` 的范围为  `startTime 示例 1：

```text
输入：
["MyCalendarTwo", "book", "book", "book", "book", "book", "book"]
[[], [10, 20], [50, 60], [10, 40], [5, 15], [5, 10], [25, 55]]
输出：
[null, true, true, true, false, true, true]

解释：
MyCalendarTwo myCalendarTwo = new MyCalendarTwo();
myCalendarTwo.book(10, 20); // 返回 True，能够预定该日程。
myCalendarTwo.book(50, 60); // 返回 True，能够预定该日程。
myCalendarTwo.book(10, 40); // 返回 True，该日程能够被重复预定。
myCalendarTwo.book(5, 15);  // 返回 False，该日程导致了三重预定，所以不能预定。
myCalendarTwo.book(5, 10); // 返回 True，能够预定该日程，因为它不使用已经双重预订的时间 10。
myCalendarTwo.book(25, 55); // 返回 True，能够预定该日程，因为时间段 [25, 40) 将被第三个日程重复预定，时间段 [40, 50) 将被单独预定，而时间段 [50, 55) 将被第二个日程重复预定。
```

**提示：**

- `0 <= start < end <= 10^9`

- 最多调用 `book` 1000 次。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 线段树, 数组, 二分查找, 有序集合, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以利用差分的思想，将每个时间点的预定情况记录下来，然后遍历所有时间点，统计当前时间点的预定情况，如果预定次数超过 $2$ 次，则返回 $\textit{false}$。否则，返回 $\textit{true}$。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$，其中 $n$ 表示日程安排的数量。

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
// My Calendar II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type MyCalendarTwo struct {
	rbt *redblacktree.Tree[int, int]
}

func Constructor() MyCalendarTwo {
	return MyCalendarTwo{rbt: redblacktree.New[int, int]()}
}

func (this *MyCalendarTwo) Book(startTime int, endTime int) bool {
	merge := func(x, v int) {
		c, _ := this.rbt.Get(x)
		if c+v == 0 {
			this.rbt.Remove(x)
		} else {
			this.rbt.Put(x, c+v)
		}
	}

	merge(startTime, 1)
	merge(endTime, -1)

	s := 0
	for _, v := range this.rbt.Values() {
		s += v
		if s > 2 {
			merge(startTime, -1)
			merge(endTime, 1)
			return false
		}
	}
	return true
}

/**
 * Your MyCalendarTwo object will be instantiated and called as such:
 * obj := Constructor();
 * param_1 := obj.Book(startTime,endTime);
 */
```

### Java

```java
// My Calendar II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class MyCalendarTwo {
    private final Map<Integer, Integer> tm = new TreeMap<>();

    public MyCalendarTwo() {
    }

    public boolean book(int startTime, int endTime) {
        tm.merge(startTime, 1, Integer::sum);
        tm.merge(endTime, -1, Integer::sum);
        int s = 0;
        for (int v : tm.values()) {
            s += v;
            if (s > 2) {
                tm.merge(startTime, -1, Integer::sum);
                tm.merge(endTime, 1, Integer::sum);
                return false;
            }
        }
        return true;
    }
}

/**
 * Your MyCalendarTwo object will be instantiated and called as such:
 * MyCalendarTwo obj = new MyCalendarTwo();
 * boolean param_1 = obj.book(startTime,endTime);
 */
```

### Python

```python
# My Calendar II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class MyCalendarTwo:

    def __init__(self):
        self.sd = SortedDict()

    def book(self, startTime: int, endTime: int) -> bool:
        self.sd[startTime] = self.sd.get(startTime, 0) + 1
        self.sd[endTime] = self.sd.get(endTime, 0) - 1
        s = 0
        for v in self.sd.values():
            s += v
            if s > 2:
                self.sd[startTime] -= 1
                self.sd[endTime] += 1
                return False
        return True


# Your MyCalendarTwo object will be instantiated and called as such:
# obj = MyCalendarTwo()
# param_1 = obj.book(startTime,endTime)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0362. Design Hit Counter

---
编号: 362
题目: Design Hit Counter
难度: 中等
标签: [设计, 队列, 数组, 二分查找, 数据流]
来源链接: https://leetcode.com/problems/design-hit-counter/
---

## 题目描述

设计一个敲击计数器，使它可以统计在过去 `5` 分钟内被敲击次数。（即过去 `300` 秒）

您的系统应该接受一个时间戳参数 `timestamp` (单位为 **秒** )，并且您可以假定对系统的调用是按时间顺序进行的(即 `timestamp` 是单调递增的)。几次撞击可能同时发生。

实现 `HitCounter` 类:

	- `HitCounter()` 初始化命中计数器系统。

	- `void hit(int timestamp)` 记录在 `timestamp` ( **单位为秒** )发生的一次命中。在同一个 `timestamp` 中可能会出现几个点击。

	- `int getHits(int timestamp)` 返回 `timestamp` 在过去 5 分钟内(即过去 `300` 秒)的命中次数。

**示例 1:**

```text
输入：
["HitCounter", "hit", "hit", "hit", "getHits", "hit", "getHits", "getHits"]
[[], [1], [2], [3], [4], [300], [300], [301]]
输出：
[null, null, null, null, 3, null, 4, 3]

解释：
HitCounter counter = new HitCounter();
counter.hit(1);// 在时刻 1 敲击一次。
counter.hit(2);// 在时刻 2 敲击一次。
counter.hit(3);// 在时刻 3 敲击一次。
counter.getHits(4);// 在时刻 4 统计过去 5 分钟内的敲击次数, 函数返回 3 。
counter.hit(300);// 在时刻 300 敲击一次。
counter.getHits(300); // 在时刻 300 统计过去 5 分钟内的敲击次数，函数返回 4 。
counter.getHits(301); // 在时刻 301 统计过去 5 分钟内的敲击次数，函数返回 3 。
```

**提示:**

	- `1 <= timestamp <= 2 * 10^9`

	- 所有对系统的调用都是按时间顺序进行的（即 `timestamp` 是单调递增的）

	- `hit` and `getHits `最多被调用 `300` 次

**进阶:** 如果每秒的敲击次数是一个很大的数字，你的计数器可以应对吗？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 队列, 数组, 二分查找, 数据流」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于 `timestamp` 是单调递增的，我们可以使用一个数组 `ts` 来存储所有的 `timestamp`，然后在 `getHits` 方法中使用二分查找找到第一个大于等于 `timestamp - 300 + 1` 的位置，然后返回 `ts` 的长度减去这个位置即可。

时间复杂度方面，`hit` 方法的时间复杂度为 $O(1)$，`getHits` 方法的时间复杂度为 $O(\log n)$。其中 $n$ 为 `ts` 的长度。

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
// Design Hit Counter：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type HitCounter struct {
	ts []int
}

func Constructor() HitCounter {
	return HitCounter{}
}

func (this *HitCounter) Hit(timestamp int) {
	this.ts = append(this.ts, timestamp)
}

func (this *HitCounter) GetHits(timestamp int) int {
	return len(this.ts) - sort.SearchInts(this.ts, timestamp-300+1)
}

/**
 * Your HitCounter object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Hit(timestamp);
 * param_2 := obj.GetHits(timestamp);
 */
```

### Java

```java
// Design Hit Counter：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class HitCounter {
    private List<Integer> ts = new ArrayList<>();

    public HitCounter() {
    }

    public void hit(int timestamp) {
        ts.add(timestamp);
    }

    public int getHits(int timestamp) {
        int l = search(timestamp - 300 + 1);
        return ts.size() - l;
    }

    private int search(int x) {
        int l = 0, r = ts.size();
        while (l < r) {
            int mid = (l + r) >> 1;
            if (ts.get(mid) >= x) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return l;
    }
}

/**
 * Your HitCounter object will be instantiated and called as such:
 * HitCounter obj = new HitCounter();
 * obj.hit(timestamp);
 * int param_2 = obj.getHits(timestamp);
 */
```

### Python

```python
# Design Hit Counter：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class HitCounter:

    def __init__(self):
        self.ts = []

    def hit(self, timestamp: int) -> None:
        self.ts.append(timestamp)

    def getHits(self, timestamp: int) -> int:
        return len(self.ts) - bisect_left(self.ts, timestamp - 300 + 1)


# Your HitCounter object will be instantiated and called as such:
# obj = HitCounter()
# obj.hit(timestamp)
# param_2 = obj.getHits(timestamp)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

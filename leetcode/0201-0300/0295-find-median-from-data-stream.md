# 0295. Find Median from Data Stream

---
编号: 295
题目: Find Median from Data Stream
难度: 困难
标签: [设计, 双指针, 数据流, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/find-median-from-data-stream/
---

## 题目描述

**中位数**是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。

- 例如 `arr = [2,3,4]` 的中位数是 `3` 。

- 例如 `arr = [2,3]` 的中位数是 `(2 + 3) / 2 = 2.5` 。

实现 MedianFinder 类:

	-

`MedianFinder()` 初始化 `MedianFinder` 对象。

	-

`void addNum(int num)` 将数据流中的整数 `num` 添加到数据结构中。

	-

`double findMedian()` 返回到目前为止所有元素的中位数。与实际答案相差 `10^-5` 以内的答案将被接受。

**示例 1：**

```text
输入
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
输出
[null, null, null, 1.5, null, 2.0]

解释
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // 返回 1.5 ((1 + 2) / 2)
medianFinder.addNum(3);    // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0
```

**提示:**

- `-10^5 <= num <= 10^5`

- 在调用 `findMedian` 之前，数据结构中至少有一个元素

- 最多 `5 * 10^4` 次调用 `addNum` 和 `findMedian`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 双指针, 数据流, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用两个堆来维护所有的元素，一个小根堆 $\textit{minQ}$ 和一个大根堆 $\textit{maxQ}$，其中小根堆 $\textit{minQ}$ 存储较大的一半，大根堆 $\textit{maxQ}$ 存储较小的一半。

调用 `addNum` 方法时，我们首先将元素加入到大根堆 $\textit{maxQ}$，然后将 $\textit{maxQ}$ 的堆顶元素弹出并加入到小根堆 $\textit{minQ}$。如果此时 $\textit{minQ}$ 的大小与 $\textit{maxQ}$ 的大小差值大于 $1$，我们就将 $\textit{minQ}$ 的堆顶元素弹出并加入到 $\textit{maxQ}$。时间复杂度为 $O(\log n)$。

调用 `findMedian` 方法时，如果 $\textit{minQ}$ 的大小等于 $\textit{maxQ}$ 的大小，说明元素的总数为偶数，我们就可以返回 $\textit{minQ}$ 的堆顶元素与 $\textit{maxQ}$ 的堆顶元素的平均值；否则，我们返回 $\textit{minQ}$ 的堆顶元素。时间复杂度为 $O(1)$。

空间复杂度为 $O(n)$。其中 $n$ 为元素的个数。

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
// Find Median from Data Stream：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type MedianFinder struct {
	minq hp
	maxq hp
}

func Constructor() MedianFinder {
	return MedianFinder{hp{}, hp{}}
}

func (this *MedianFinder) AddNum(num int) {
	minq, maxq := &this.minq, &this.maxq
	heap.Push(maxq, -num)
	heap.Push(minq, -heap.Pop(maxq).(int))
	if minq.Len()-maxq.Len() > 1 {
		heap.Push(maxq, -heap.Pop(minq).(int))
	}
}

func (this *MedianFinder) FindMedian() float64 {
	minq, maxq := this.minq, this.maxq
	if minq.Len() == maxq.Len() {
		return float64(minq.IntSlice[0]-maxq.IntSlice[0]) / 2
	}
	return float64(minq.IntSlice[0])
}

type hp struct{ sort.IntSlice }

func (h hp) Less(i, j int) bool { return h.IntSlice[i] < h.IntSlice[j] }
func (h *hp) Push(v any)        { h.IntSlice = append(h.IntSlice, v.(int)) }
func (h *hp) Pop() any {
	a := h.IntSlice
	v := a[len(a)-1]
	h.IntSlice = a[:len(a)-1]
	return v
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * obj := Constructor();
 * obj.AddNum(num);
 * param_2 := obj.FindMedian();
 */
```

### Java

```java
import java.util.*;
// Find Median from Data Stream：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class MedianFinder {
    private PriorityQueue<Integer> minQ = new PriorityQueue<>();
    private PriorityQueue<Integer> maxQ = new PriorityQueue<>(Collections.reverseOrder());

    public MedianFinder() {
    }

    public void addNum(int num) {
        maxQ.offer(num);
        minQ.offer(maxQ.poll());
        if (minQ.size() - maxQ.size() > 1) {
            maxQ.offer(minQ.poll());
        }
    }

    public double findMedian() {
        return minQ.size() == maxQ.size() ? (minQ.peek() + maxQ.peek()) / 2.0 : minQ.peek();
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * MedianFinder obj = new MedianFinder();
 * obj.addNum(num);
 * double param_2 = obj.findMedian();
 */
```

### Python

```python
# Find Median from Data Stream：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class MedianFinder:

    def __init__(self):
        self.minq = []
        self.maxq = []

    def addNum(self, num: int) -> None:
        heappush(self.minq, -heappushpop(self.maxq, -num))
        if len(self.minq) - len(self.maxq) > 1:
            heappush(self.maxq, -heappop(self.minq))

    def findMedian(self) -> float:
        if len(self.minq) == len(self.maxq):
            return (self.minq[0] - self.maxq[0]) / 2
        return self.minq[0]


# Your MedianFinder object will be instantiated and called as such:
# obj = MedianFinder()
# obj.addNum(num)
# param_2 = obj.findMedian()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

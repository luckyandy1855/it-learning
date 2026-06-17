# 0703. Kth Largest Element in a Stream

---
编号: 703
题目: Kth Largest Element in a Stream
难度: 简单
标签: [树, 设计, 二叉搜索树, 二叉树, 数据流, 堆（优先队列）]
来源链接: https://leetcode.com/problems/kth-largest-element-in-a-stream/
---

## 题目描述

设计一个找到数据流中第 `k` 大元素的类（class）。注意是排序后的第 `k` 大元素，不是第 `k` 个不同的元素。

请实现 `KthLargest` 类：

- `KthLargest(int k, int[] nums)` 使用整数 `k` 和整数流 `nums` 初始化对象。

- `int add(int val)` 将 `val` 插入数据流 `nums` 后，返回当前数据流中第 `k` 大的元素。

示例 1：

**输入：**

["KthLargest", "add", "add", "add", "add", "add"]

[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]

**输出：**[null, 4, 5, 5, 8, 8]

**解释：**

KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);

kthLargest.add(3); // 返回 4

kthLargest.add(5); // 返回 5

kthLargest.add(10); // 返回 5

kthLargest.add(9); // 返回 8

kthLargest.add(4); // 返回 8

示例 2：

**输入：**

["KthLargest", "add", "add", "add", "add"]

[[4, [7, 7, 7, 7, 8, 3]], [2], [10], [9], [9]]

输出：[null, 7, 7, 7, 8]

**解释：**

KthLargest kthLargest = new KthLargest(4, [7, 7, 7, 7, 8, 3]);

kthLargest.add(2); // 返回 7

kthLargest.add(10); // 返回 7

kthLargest.add(9); // 返回 7

kthLargest.add(9); // 返回 8

**提示：**

- `0 <= nums.length <= 10^4`

- `1 <= k <= nums.length + 1`

- `-10^4 <= nums[i] <= 10^4`

- `-10^4 <= val <= 10^4`

- 最多调用 `add` 方法 `10^4` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 设计, 二叉搜索树, 二叉树, 数据流, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们维护一个优先队列（小根堆）$\textit{minQ}$。

初始化时，我们将数组 $\textit{nums}$ 中的元素依次加入 $\textit{minQ}$，并保持 $\textit{minQ}$ 的大小不超过 $k$。时间复杂度 $O(n \times \log k)$。

每次加入一个新元素时，如果 $\textit{minQ}$ 的大小超过了 $k$，我们就将堆顶元素弹出，保证 $\textit{minQ}$ 的大小为 $k$。时间复杂度 $O(\log k)$。

这样，$\textit{minQ}$ 中的元素就是数组 $\textit{nums}$ 中最大的 $k$ 个元素，堆顶元素就是第 $k$ 大的元素。

空间复杂度 $O(k)$。

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
// Kth Largest Element in a Stream：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type KthLargest struct {
	k    int
	minQ hp
}

func Constructor(k int, nums []int) KthLargest {
	minQ := hp{}
	this := KthLargest{k, minQ}
	for _, x := range nums {
		this.Add(x)
	}
	return this
}

func (this *KthLargest) Add(val int) int {
	heap.Push(&this.minQ, val)
	if this.minQ.Len() > this.k {
		heap.Pop(&this.minQ)
	}
	return this.minQ.IntSlice[0]
}

type hp struct{ sort.IntSlice }

func (h *hp) Less(i, j int) bool { return h.IntSlice[i] < h.IntSlice[j] }
func (h *hp) Pop() interface{} {
	old := h.IntSlice
	n := len(old)
	x := old[n-1]
	h.IntSlice = old[0 : n-1]
	return x
}
func (h *hp) Push(x interface{}) {
	h.IntSlice = append(h.IntSlice, x.(int))
}

/**
 * Your KthLargest object will be instantiated and called as such:
 * obj := Constructor(k, nums);
 * param_1 := obj.Add(val);
 */
```

### Java

```java
// Kth Largest Element in a Stream：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class KthLargest {
    private PriorityQueue<Integer> minQ;
    private int k;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        minQ = new PriorityQueue<>(k);
        for (int x : nums) {
            add(x);
        }
    }

    public int add(int val) {
        minQ.offer(val);
        if (minQ.size() > k) {
            minQ.poll();
        }
        return minQ.peek();
    }
}

/**
 * Your KthLargest object will be instantiated and called as such:
 * KthLargest obj = new KthLargest(k, nums);
 * int param_1 = obj.add(val);
 */
```

### Python

```python
# Kth Largest Element in a Stream：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class KthLargest:

    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.min_q = []
        for x in nums:
            self.add(x)

    def add(self, val: int) -> int:
        heappush(self.min_q, val)
        if len(self.min_q) > self.k:
            heappop(self.min_q)
        return self.min_q[0]


# Your KthLargest object will be instantiated and called as such:
# obj = KthLargest(k, nums)
# param_1 = obj.add(val)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

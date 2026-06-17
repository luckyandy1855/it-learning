# 1499. Max Value of Equation

---
编号: 1499
题目: Max Value of Equation
难度: 困难
标签: [队列, 数组, 滑动窗口, 单调队列, 堆（优先队列）]
来源链接: https://leetcode.com/problems/max-value-of-equation/
---

## 题目描述

给你一个数组 `points` 和一个整数 `k` 。数组中每个元素都表示二维平面上的点的坐标，并按照横坐标 x 的值从小到大排序。也就是说 `points[i] = [xi, yi]` ，并且在 `1 i j` 总成立。

请你找出* *`yi + yj + |xi - xj|` 的 **最大值**，其中 `|xi - xj| i - xj| i, yi i j`。

- `xi` 构成一个严格递增序列。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「队列, 数组, 滑动窗口, 单调队列, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目要求 $y_i + y_j + |x_i - x_j|$ 的最大值，其中 $i \lt j$，并且 $|x_i - x_j| \leq k$。由于 $x_i$ 是严格单调递增的，那么：


\begin{aligned}
y_i + y_j + |x_i - x_j| & = y_i + y_j + x_j - x_i \\
& = (y_i - x_i) + (x_j + y_j)
\end{aligned}


因此，对于当前遍历到的点 $(x_j, y_j)$，我们只需要找到前面所有满足 $x_j - x_i \leq k$ 的点 $(x_i, y_i)$ 中 $y_i - x_i$ 的最大值，再加上当前的 $x_j + y_j$ 即可。而 $y_i - x_i$ 的最大值，我们可以使用优先队列（大根堆）来维护。

具体地，我们定义一个优先队列（大根堆） $pq$，堆中每个元素是一个二元组 $(y_i - x_i, x_i)$。

当我们遍历到点 $(x, y)$ 时，如果堆 $pq$ 不为空，并且 $x - pq[0][1] \gt k$，那么循环将堆顶元素弹出，直到堆为空或者满足 $x - pq[0][1] \leq k$。此时，堆顶元素 $(y_i - x_i, x_i)$ 即为所有满足 $x_j - x_i \leq k$ 的点中 $y_i - x_i$ 的最大值，此时更新答案 $ans = \max(ans, x + y + pq[0][0])$。

然后，我们将点 $(x, y)$ 加入堆中，继续遍历下一个点，直到遍历完整个数组 $points$。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $points$ 的长度。

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
// Max Value of Equation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findMaxValueOfEquation(points [][]int, k int) int {
	ans := -(1 << 30)
	hp := hp{}
	for _, p := range points {
		x, y := p[0], p[1]
		for hp.Len() > 0 && x-hp[0].x > k {
			heap.Pop(&hp)
		}
		if hp.Len() > 0 {
			ans = max(ans, x+y+hp[0].v)
		}
		heap.Push(&hp, pair{y - x, x})
	}
	return ans
}

type pair struct{ v, x int }

type hp []pair

func (h hp) Len() int { return len(h) }
func (h hp) Less(i, j int) bool {
	a, b := h[i], h[j]
	return a.v > b.v
}
func (h hp) Swap(i, j int) { h[i], h[j] = h[j], h[i] }
func (h *hp) Push(v any)   { *h = append(*h, v.(pair)) }
func (h *hp) Pop() any     { a := *h; v := a[len(a)-1]; *h = a[:len(a)-1]; return v }
```

### Java

```java
// Max Value of Equation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findMaxValueOfEquation(int[][] points, int k) {
        int ans = -(1 << 30);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
        for (var p : points) {
            int x = p[0], y = p[1];
            while (!pq.isEmpty() && x - pq.peek()[1] > k) {
                pq.poll();
            }
            if (!pq.isEmpty()) {
                ans = Math.max(ans, x + y + pq.peek()[0]);
            }
            pq.offer(new int[] {y - x, x});
        }
        return ans;
    }
}
```

### Python

```python
# Max Value of Equation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findMaxValueOfEquation(self, points: List[List[int]], k: int) -> int:
        ans = -inf
        pq = []
        for x, y in points:
            while pq and x - pq[0][1] > k:
                heappop(pq)
            if pq:
                ans = max(ans, x + y - pq[0][0])
            heappush(pq, (x - y, x))
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

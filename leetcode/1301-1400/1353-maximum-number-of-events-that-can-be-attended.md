# 1353. Maximum Number of Events That Can Be Attended

---
编号: 1353
题目: Maximum Number of Events That Can Be Attended
难度: 中等
标签: [贪心, 数组, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/
---

## 题目描述

给你一个数组 `events`，其中 `events[i] = [startDayi, endDayi]` ，表示会议 `i` 开始于 `startDayi` ，结束于 `endDayi` 。

你可以在满足 `startDayi i` 中的任意一天 `d` 参加会议 `i` 。在任意一天 `d` 中只能参加一场会议。

请你返回你可以参加的 **最大 **会议数目。

**示例 1：**

```text
输入：events = [[1,2],[2,3],[3,4]]
输出：3
解释：你可以参加所有的三个会议。
安排会议的一种方案如上图。
第 1 天参加第一个会议。
第 2 天参加第二个会议。
第 3 天参加第三个会议。
```

**示例 2：**

```text
输入：events= [[1,2],[2,3],[3,4],[1,2]]
输出：4
```

**提示：**​​​​​​

- `1 i i <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个哈希表 $\textit{g}$ 记录每个会议的开始和结束时间。键为会议的开始时间，值为一个列表，包含所有在该开始时间开始的会议的结束时间。用两个变量 $\textit{l}$ 和 $\textit{r}$ 分别记录会议的最小开始时间和最大结束时间。

对于从小到大每个在 $\textit{l}$ 到 $\textit{r}$ 的时间点 $s$，我们需要做以下操作：

1. 从优先队列中移除所有结束时间小于当前时间 $s$ 的会议。
2. 将所有开始时间等于当前时间 $s$ 的会议的结束时间加入优先队列中。
3. 如果优先队列不为空，则取出结束时间最小的会议，累加答案数，并从优先队列中移除该会议。

这样，我们可以确保在每个时间点 $s$，我们都能参加结束时间最早的会议，从而最大化参加的会议数。

时间复杂度 $O(M \times \log n)$，空间复杂度 $O(n)$，其中 $M$ 和 $n$ 分别为会议的最大结束时间和会议的数量。

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
// Maximum Number of Events That Can Be Attended：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxEvents(events [][]int) (ans int) {
	g := map[int][]int{}
	l, r := math.MaxInt32, 0
	for _, event := range events {
		s, e := event[0], event[1]
		g[s] = append(g[s], e)
		l = min(l, s)
		r = max(r, e)
	}

	pq := &hp{}
	heap.Init(pq)
	for s := l; s <= r; s++ {
		for pq.Len() > 0 && pq.IntSlice[0] < s {
			heap.Pop(pq)
		}
		for _, e := range g[s] {
			heap.Push(pq, e)
		}
		if pq.Len() > 0 {
			heap.Pop(pq)
			ans++
		}
	}
	return
}

type hp struct{ sort.IntSlice }

func (h *hp) Push(v any) { h.IntSlice = append(h.IntSlice, v.(int)) }
func (h *hp) Pop() any {
	n := len(h.IntSlice)
	v := h.IntSlice[n-1]
	h.IntSlice = h.IntSlice[:n-1]
	return v
}
func (h *hp) Less(i, j int) bool { return h.IntSlice[i] < h.IntSlice[j] }
```

### Java

```java
// Maximum Number of Events That Can Be Attended：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxEvents(int[][] events) {
        Map<Integer, List<Integer>> g = new HashMap<>();
        int l = Integer.MAX_VALUE, r = 0;
        for (int[] event : events) {
            int s = event[0], e = event[1];
            g.computeIfAbsent(s, k -> new ArrayList<>()).add(e);
            l = Math.min(l, s);
            r = Math.max(r, e);
        }
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        int ans = 0;
        for (int s = l; s <= r; s++) {
            while (!pq.isEmpty() && pq.peek() < s) {
                pq.poll();
            }
            for (int e : g.getOrDefault(s, List.of())) {
                pq.offer(e);
            }
            if (!pq.isEmpty()) {
                pq.poll();
                ans++;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Number of Events That Can Be Attended：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxEvents(self, events: List[List[int]]) -> int:
        g = defaultdict(list)
        l, r = inf, 0
        for s, e in events:
            g[s].append(e)
            l = min(l, s)
            r = max(r, e)
        pq = []
        ans = 0
        for s in range(l, r + 1):
            while pq and pq[0] < s:
                heappop(pq)
            for e in g[s]:
                heappush(pq, e)
            if pq:
                heappop(pq)
                ans += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

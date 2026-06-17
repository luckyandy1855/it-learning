# 1199. Minimum Time to Build Blocks

---
编号: 1199
题目: Minimum Time to Build Blocks
难度: 困难
标签: [贪心, 数组, 数学, 堆（优先队列）]
来源链接: https://leetcode.com/problems/minimum-time-to-build-blocks/
---

## 题目描述

你是个城市规划工作者，手里负责管辖一系列的街区。在这个街区列表中 `blocks[i] = t` 意味着第  `i` 个街区需要 `t` 个单位的时间来建造。

由于一个街区只能由一个工人来完成建造。

所以，一个工人要么需要再召唤一个工人（工人数增加 1）；要么建造完一个街区后回家。这两个决定都需要花费一定的时间。

一个工人再召唤一个工人所花费的时间由整数 `split` 给出。

注意：如果两个工人同时召唤别的工人，那么他们的行为是并行的，所以时间花费仍然是 `split`。

最开始的时候只有 **一个 **工人，请你最后输出建造完所有街区所需要的最少时间。

**示例 1：**

```text
输入：blocks = [1], split = 1
输出：1
解释：我们使用 1 个工人在 1 个时间单位内来建完 1 个街区。
```

**示例 2：**

```text
输入：blocks = [1,2], split = 5
输出：7
解释：我们用 5 个时间单位将这个工人分裂为 2 个工人，然后指派每个工人分别去建造街区，从而时间花费为 5 + max(1, 2) = 7
```

**示例 3：**

```text
输入：blocks = [1,2,3], split = 1
输出：4
解释：
将 1 个工人分裂为 2 个工人，然后指派第一个工人去建造最后一个街区，并将第二个工人分裂为 2 个工人。
然后，用这两个未分派的工人分别去建造前两个街区。
时间花费为 1 + max(3, 1 + max(1, 2)) = 4
```

**提示：**

- `1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 数学, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

先考虑只有一个街区的情况，此时不需要分裂工人，直接让他去建造街区，时间花费为 $\textit{block}[0]$。

如果有两个街区，此时需要把工人分裂为两个，然后让他们分别去建造街区，时间花费为 $\textit{split} + \max(\textit{block}[0], \textit{block}[1])$。

如果有超过两个街区，此时每一步都需要考虑将几个工人进行分裂，正向思维不好处理。

我们不妨采用逆向思维，不分裂工人，而是将街区进行合并。我们选取任意两个街区 $i$, $j$ 进行合并，建造一个新的街区的时间为 $\textit{split} + \max(\textit{block}[i], \textit{block}[j])$。

为了让耗时长的街区尽可能少参与到合并中，我们可以每次贪心地选取耗时最小的两个街区进行合并。因此，我们可以维护一个小根堆，每次取出最小的两个街区进行合并，直到只剩下一个街区。最后剩下的这个街区的建造时间就是答案。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为街区的数量。

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
// Minimum Time to Build Blocks：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minBuildTime(blocks []int, split int) int {
	q := hp{}
	for _, v := range blocks {
		heap.Push(&q, v)
	}
	for q.Len() > 1 {
		heap.Pop(&q)
		heap.Push(&q, heap.Pop(&q).(int)+split)
	}
	return q.IntSlice[0]
}

type hp struct{ sort.IntSlice }

func (h *hp) Push(v any) { h.IntSlice = append(h.IntSlice, v.(int)) }
func (h *hp) Pop() any {
	a := h.IntSlice
	v := a[len(a)-1]
	h.IntSlice = a[:len(a)-1]
	return v
}
```

### Java

```java
// Minimum Time to Build Blocks：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minBuildTime(int[] blocks, int split) {
        PriorityQueue<Integer> q = new PriorityQueue<>();
        for (int x : blocks) {
            q.offer(x);
        }
        while (q.size() > 1) {
            q.poll();
            q.offer(q.poll() + split);
        }
        return q.poll();
    }
}
```

### Python

```python
# Minimum Time to Build Blocks：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minBuildTime(self, blocks: List[int], split: int) -> int:
        heapify(blocks)
        while len(blocks) > 1:
            heappop(blocks)
            heappush(blocks, heappop(blocks) + split)
        return blocks[0]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

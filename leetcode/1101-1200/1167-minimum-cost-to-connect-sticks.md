# 1167. Minimum Cost to Connect Sticks

---
编号: 1167
题目: Minimum Cost to Connect Sticks
难度: 中等
标签: [贪心, 数组, 堆（优先队列）]
来源链接: https://leetcode.com/problems/minimum-cost-to-connect-sticks/
---

## 题目描述

你有一些长度为正整数的木棍。这些长度以数组 `sticks` 的形式给出， `sticks[i]` 是第 `i` 个木棍的长度。

你可以通过支付 `x + y` 的成本将任意两个长度为 `x` 和 `y` 的木棍连接成一个木棍。你必须连接所有的木棍，直到剩下一个木棍。

返回以这种方式将所有给定的木棍连接成一个木棍的* 最小成本 *。

**示例 1：**

```text
输入：sticks = [2,4,3]
输出：14
解释：从 sticks = [2,4,3] 开始。
1. 连接 2 和 3 ，费用为 2 + 3 = 5 。现在 sticks = [5,4]
2. 连接 5 和 4 ，费用为 5 + 4 = 9 。现在 sticks = [9]
所有木棍已经连成一根，总费用 5 + 9 = 14
```

**示例 2：**

```text
输入：sticks = [1,8,3,5]
输出：30
解释：从 sticks = [1,8,3,5] 开始。
1. 连接 1 和 3 ，费用为 1 + 3 = 4 。现在 sticks = [4,8,5]
2. 连接 4 和 5 ，费用为 4 + 5 = 9 。现在 sticks = [9,8]
3. 连接 9 和 8 ，费用为 9 + 8 = 17 。现在 sticks = [17]
所有木棍已经连成一根，总费用 4 + 9 + 17 = 30
```

**示例 3：**

```text
输入：sticks = [5]
输出：0
解释：只有一根木棍，不必再连接。总费用 0
```

**提示：**

- `1 <= sticks.length <= 10^4`

- `1 <= sticks[i] <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用贪心的思路，每次选择最短的两根棍子进行拼接，这样可以保证拼接的代价最小。

因此，我们可以使用优先队列（小根堆）来维护当前棍子的长度，每次从优先队列中取出两根棍子进行拼接，再将拼接后的棍子放回优先队列中，直到优先队列中只剩下一根棍子为止。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 `sticks` 的长度。

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
// Minimum Cost to Connect Sticks：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func connectSticks(sticks []int) (ans int) {
	hp := &hp{sticks}
	heap.Init(hp)
	for hp.Len() > 1 {
		x, y := heap.Pop(hp).(int), heap.Pop(hp).(int)
		ans += x + y
		heap.Push(hp, x+y)
	}
	return
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
```

### Java

```java
// Minimum Cost to Connect Sticks：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int connectSticks(int[] sticks) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : sticks) {
            pq.offer(x);
        }
        int ans = 0;
        while (pq.size() > 1) {
            int z = pq.poll() + pq.poll();
            ans += z;
            pq.offer(z);
        }
        return ans;
    }
}
```

### Python

```python
# Minimum Cost to Connect Sticks：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def connectSticks(self, sticks: List[int]) -> int:
        heapify(sticks)
        ans = 0
        while len(sticks) > 1:
            z = heappop(sticks) + heappop(sticks)
            ans += z
            heappush(sticks, z)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

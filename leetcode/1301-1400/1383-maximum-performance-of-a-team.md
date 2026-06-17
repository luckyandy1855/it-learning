# 1383. Maximum Performance of a Team

---
编号: 1383
题目: Maximum Performance of a Team
难度: 困难
标签: [贪心, 数组, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/maximum-performance-of-a-team/
---

## 题目描述

给定两个整数 `n` 和 `k`，以及两个长度为 `n` 的整数数组 `speed` 和` efficiency`。现有 `n` 名工程师，编号从 `1` 到 `n`。其中 `speed[i]` 和 `efficiency[i]` 分别代表第 `i` 位工程师的速度和效率。

从这 `n` 名工程师中最多选择 `k` 名不同的工程师，使其组成的团队具有最大的团队表现值。

**团队表现值** 的定义为：一个团队中「所有工程师速度的和」乘以他们「效率值中的最小值」。

请你返回该团队的​​​​​​最大团队表现值，由于答案可能很大，请你返回结果对 `10^9 + 7` 取余后的结果。

**示例 1：**

```text
输入：n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 2
输出：60
解释：
我们选择工程师 2（speed=10 且 efficiency=4）和工程师 5（speed=5 且 efficiency=7）。他们的团队表现值为 performance = (10 + 5) * min(4, 7) = 60 。
```

**示例 2：**

```text
输入：n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 3
输出：68
解释：
此示例与第一个示例相同，除了 k = 3 。我们可以选择工程师 1 ，工程师 2 和工程师 5 得到最大的团队表现值。表现值为 performance = (2 + 10 + 5) * min(5, 4, 7) = 68 。
```

**示例 3：**

```text
输入：n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 4
输出：72
```

**提示：**

- `1 <= k <= n <= 10^5`

- `speed.length == n`

- `efficiency.length == n`

- `1 <= speed[i] <= 10^5`

- `1 <= efficiency[i] <= 10^8`

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

本题是求“速度和”与“效率最小值”乘积的最大值。变量有两个，我们可以从大到小枚举 `efficiency[i]` 作为效率最小值，在所有效率大于等于 `efficiency[i]` 的工程师中选取不超过 $k-1$ 个，让他们速度和最大。

时间复杂度 $O(n\log n)$。

相似题目：

- [857. 雇佣 K 名工人的最低成本](https://github.com/doocs/leetcode/blob/main/solution/0800-0899/0857.Minimum%20Cost%20to%20Hire%20K%20Workers/README.md)

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
// Maximum Performance of a Team：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxPerformance(n int, speed []int, efficiency []int, k int) int {
	t := make([][]int, n)
	for i, s := range speed {
		t[i] = []int{s, efficiency[i]}
	}
	sort.Slice(t, func(i, j int) bool { return t[i][1] > t[j][1] })
	var mod int = 1e9 + 7
	ans, tot := 0, 0
	pq := hp{}
	for _, x := range t {
		s, e := x[0], x[1]
		tot += s
		ans = max(ans, tot*e)
		heap.Push(&pq, s)
		if pq.Len() == k {
			tot -= heap.Pop(&pq).(int)
		}
	}
	return ans % mod
}

type hp struct{ sort.IntSlice }

func (h *hp) Push(v any) { h.IntSlice = append(h.IntSlice, v.(int)) }
func (h *hp) Pop() any {
	a := h.IntSlice
	v := a[len(a)-1]
	h.IntSlice = a[:len(a)-1]
	return v
}
func (h *hp) Less(i, j int) bool { return h.IntSlice[i] < h.IntSlice[j] }
```

### Java

```java
// Maximum Performance of a Team：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private static final int MOD = (int) 1e9 + 7;

    public int maxPerformance(int n, int[] speed, int[] efficiency, int k) {
        int[][] t = new int[n][2];
        for (int i = 0; i < n; ++i) {
            t[i] = new int[] {speed[i], efficiency[i]};
        }
        Arrays.sort(t, (a, b) -> b[1] - a[1]);
        PriorityQueue<Integer> q = new PriorityQueue<>();
        long tot = 0;
        long ans = 0;
        for (var x : t) {
            int s = x[0], e = x[1];
            tot += s;
            ans = Math.max(ans, tot * e);
            q.offer(s);
            if (q.size() == k) {
                tot -= q.poll();
            }
        }
        return (int) (ans % MOD);
    }
}
```

### Python

```python
# Maximum Performance of a Team：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxPerformance(
        self, n: int, speed: List[int], efficiency: List[int], k: int
    ) -> int:
        t = sorted(zip(speed, efficiency), key=lambda x: -x[1])
        ans = tot = 0
        mod = 10**9 + 7
        h = []
        for s, e in t:
            tot += s
            ans = max(ans, tot * e)
            heappush(h, s)
            if len(h) == k:
                tot -= heappop(h)
        return ans % mod
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

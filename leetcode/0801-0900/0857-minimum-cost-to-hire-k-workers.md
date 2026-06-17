# 0857. Minimum Cost to Hire K Workers

---
编号: 857
题目: Minimum Cost to Hire K Workers
难度: 困难
标签: [贪心, 数组, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/minimum-cost-to-hire-k-workers/
---

## 题目描述

有 `n` 名工人。 给定两个数组 `quality` 和 `wage` ，其中，`quality[i]` 表示第 `i` 名工人的工作质量，其最低期望工资为 `wage[i]` 。

现在我们想雇佣 `k` 名工人组成一个 **工资组***。*在雇佣 一组 `k` 名工人时，我们必须按照下述规则向他们支付工资：

- 对工资组中的每名工人，应当按其工作质量与同组其他工人的工作质量的比例来支付工资。

- 工资组中的每名工人至少应当得到他们的最低期望工资。

给定整数 `k` ，返回 *组成满足上述条件的付费群体所需的最小金额 *。与实际答案误差相差在 `10^-5` 以内的答案将被接受。

示例 1：

```text
输入： quality = [10,20,5], wage = [70,50,30], k = 2
输出： 105.00000
解释： 我们向 0 号工人支付 70，向 2 号工人支付 35。
```

示例 2：

```text
输入： quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3
输出： 30.66667
解释： 我们向 0 号工人支付 4，向 2 号和 3 号分别支付 13.33333。
```

**提示：**

- `n == quality.length == wage.length`

- `1 <= k <= n <= 10^4`

- `1 <= quality[i], wage[i] <= 10^4`

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

我们假设选取了某一个工资组，总工作质量为 `tot`，总支付金额为 `c`。每个工人的工作质量为 $q_i$，工资为 $w_i$。那么，对于此工资组的每个工人，均满足 $c\times \frac{q_i}{tot} \ge w_i$。即 $c\ge tot\times \frac{w_i}{q_i}$。

在总工作质量 `tot` 固定的情况下，支付的金额取决于权重 $\frac{w_i}{q_i}$ 的最大值。

我们可以从小到大枚举权重 $\frac{w_i}{q_i}$ 作为工资组的最大值，此时工资组其他人员只需要在权重小于等于这个值的集合中，选取工作质量最小的 $k-1$ 名工人来组成工资组即可。因此，可以用优先队列（最大堆）维护工作质量最小的 $k-1$ 名工人。

时间复杂度 $O(n\log n)$，空间复杂度 $O(n)$。其中 $n$ 是工人数。

相似题目：

- [1383. 最大的团队表现值](https://github.com/doocs/leetcode/blob/main/solution/1300-1399/1383.Maximum%20Performance%20of%20a%20Team/README.md)

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
// Minimum Cost to Hire K Workers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func mincostToHireWorkers(quality []int, wage []int, k int) float64 {
	t := []pair{}
	for i, q := range quality {
		t = append(t, pair{float64(wage[i]) / float64(q), q})
	}
	sort.Slice(t, func(i, j int) bool { return t[i].x < t[j].x })
	tot := 0
	var ans float64 = 1e18
	pq := hp{}
	for _, e := range t {
		tot += e.q
		heap.Push(&pq, e.q)
		if pq.Len() == k {
			ans = min(ans, float64(tot)*e.x)
			tot -= heap.Pop(&pq).(int)
		}
	}
	return ans
}

type pair struct {
	x float64
	q int
}

type hp struct{ sort.IntSlice }

func (h *hp) Push(v any) { h.IntSlice = append(h.IntSlice, v.(int)) }
func (h *hp) Pop() any {
	a := h.IntSlice
	v := a[len(a)-1]
	h.IntSlice = a[:len(a)-1]
	return v
}
func (h *hp) Less(i, j int) bool { return h.IntSlice[i] > h.IntSlice[j] }
```

### Java

```java
// Minimum Cost to Hire K Workers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public double mincostToHireWorkers(int[] quality, int[] wage, int k) {
        int n = quality.length;
        Pair<Double, Integer>[] t = new Pair[n];
        for (int i = 0; i < n; ++i) {
            t[i] = new Pair<>((double) wage[i] / quality[i], quality[i]);
        }
        Arrays.sort(t, (a, b) -> Double.compare(a.getKey(), b.getKey()));
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);
        double ans = 1e18;
        int tot = 0;
        for (var e : t) {
            tot += e.getValue();
            pq.offer(e.getValue());
            if (pq.size() == k) {
                ans = Math.min(ans, tot * e.getKey());
                tot -= pq.poll();
            }
        }
        return ans;
    }
}
```

### Python

```python
# Minimum Cost to Hire K Workers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def mincostToHireWorkers(
        self, quality: List[int], wage: List[int], k: int
    ) -> float:
        t = sorted(zip(quality, wage), key=lambda x: x[1] / x[0])
        ans, tot = inf, 0
        h = []
        for q, w in t:
            tot += q
            heappush(h, -q)
            if len(h) == k:
                ans = min(ans, w / q * tot)
                tot += heappop(h)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

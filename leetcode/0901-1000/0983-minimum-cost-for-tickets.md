# 0983. Minimum Cost For Tickets

---
编号: 983
题目: Minimum Cost For Tickets
难度: 中等
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/minimum-cost-for-tickets/
---

## 题目描述

在一个火车旅行很受欢迎的国度，你提前一年计划了一些火车旅行。在接下来的一年里，你要旅行的日子将以一个名为 `days` 的数组给出。每一项是一个从 `1` 到 `365` 的整数。

火车票有 **三种不同的销售方式** ：

- 一张 **为期一天** 的通行证售价为 `costs[0]` 美元；

- 一张 **为期七天** 的通行证售价为 `costs[1]` 美元；

- 一张 **为期三十天** 的通行证售价为 `costs[2]` 美元。

通行证允许数天无限制的旅行。 例如，如果我们在第 `2` 天获得一张 **为期 7 天** 的通行证，那么我们可以连着旅行 7 天：第 `2` 天、第 `3` 天、第 `4` 天、第 `5` 天、第 `6` 天、第 `7` 天和第 `8` 天。

返回 *你想要完成在给定的列表 `days` 中列出的每一天的旅行所需要的最低消费 *。

**示例 1：**

```text
输入：days = [1,4,6,7,8,20], costs = [2,7,15]
输出：11
解释：
例如，这里有一种购买通行证的方法，可以让你完成你的旅行计划：
在第 1 天，你花了 costs[0] = $2 买了一张为期 1 天的通行证，它将在第 1 天生效。
在第 3 天，你花了 costs[1] = $7 买了一张为期 7 天的通行证，它将在第 3, 4, ..., 9 天生效。
在第 20 天，你花了 costs[0] = $2 买了一张为期 1 天的通行证，它将在第 20 天生效。
你总共花了 $11，并完成了你计划的每一天旅行。
```

**示例 2：**

```text
输入：days = [1,2,3,4,5,6,7,8,9,10,30,31], costs = [2,7,15]
输出：17
解释：
例如，这里有一种购买通行证的方法，可以让你完成你的旅行计划：
在第 1 天，你花了 costs[2] = $15 买了一张为期 30 天的通行证，它将在第 1, 2, ..., 30 天生效。
在第 31 天，你花了 costs[0] = $2 买了一张为期 1 天的通行证，它将在第 31 天生效。
你总共花了 $17，并完成了你计划的每一天旅行。
```

**提示：**

- `1 <= days.length <= 365`

- `1 <= days[i] <= 365`

- `days` 按顺序严格递增

- `costs.length == 3`

- `1 <= costs[i] <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个函数 $\textit{dfs(i)}$，表示从第 $i$ 次出行开始到最后一次出行结束所需的最小花费。那么答案为 $\textit{dfs(0)}$。

函数 $\textit{dfs(i)}$ 的执行过程如下：

- 如果 $i \geq n$，表示所有出行已经结束，返回 $0$；
- 否则，我们需要考虑三种购买方式，分别是购买 $1$ 天通行证、购买 $7$ 天通行证和购买 $30$ 天通行证。我们分别计算这三种购买方式的花费，并且利用二分查找，找到下一次出行的下标 $j$，然后递归调用 $\textit{dfs(j)}$，最后返回这三种购买方式的最小花费。

为了避免重复计算，我们使用记忆化搜索，将已经计算过的结果保存起来。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 表示出行的次数。

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
// Minimum Cost For Tickets：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func mincostTickets(days []int, costs []int) int {
	valid := [3]int{1, 7, 30}
	n := len(days)
	f := make([]int, n)
	var dfs func(int) int
	dfs = func(i int) int {
		if i >= n {
			return 0
		}
		if f[i] > 0 {
			return f[i]
		}
		f[i] = 1 << 30
		for k := 0; k < 3; k++ {
			j := sort.SearchInts(days, days[i]+valid[k])
			f[i] = min(f[i], dfs(j)+costs[k])
		}
		return f[i]
	}
	return dfs(0)
}
```

### Java

```java
// Minimum Cost For Tickets：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private final int[] valid = {1, 7, 30};
    private int[] days;
    private int[] costs;
    private Integer[] f;
    private int n;

    public int mincostTickets(int[] days, int[] costs) {
        n = days.length;
        f = new Integer[n];
        this.days = days;
        this.costs = costs;
        return dfs(0);
    }

    private int dfs(int i) {
        if (i >= n) {
            return 0;
        }
        if (f[i] != null) {
            return f[i];
        }
        f[i] = Integer.MAX_VALUE;
        for (int k = 0; k < 3; ++k) {
            int j = Arrays.binarySearch(days, days[i] + valid[k]);
            j = j < 0 ? -j - 1 : j;
            f[i] = Math.min(f[i], dfs(j) + costs[k]);
        }
        return f[i];
    }
}
```

### Python

```python
# Minimum Cost For Tickets：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def mincostTickets(self, days: List[int], costs: List[int]) -> int:
        @cache
        def dfs(i: int) -> int:
            if i >= n:
                return 0
            ans = inf
            for c, v in zip(costs, valid):
                j = bisect_left(days, days[i] + v)
                ans = min(ans, c + dfs(j))
            return ans

        n = len(days)
        valid = [1, 7, 30]
        return dfs(0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

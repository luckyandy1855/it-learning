# 1235. Maximum Profit in Job Scheduling

---
编号: 1235
题目: Maximum Profit in Job Scheduling
难度: 困难
标签: [数组, 二分查找, 动态规划, 排序]
来源链接: https://leetcode.com/problems/maximum-profit-in-job-scheduling/
---

## 题目描述

你打算利用空闲时间来做兼职工作赚些零花钱。

这里有 `n` 份兼职工作，每份工作预计从 `startTime[i]` 开始到 `endTime[i]` 结束，报酬为 `profit[i]`。

给你一份兼职工作表，包含开始时间 `startTime`，结束时间 `endTime` 和预计报酬 `profit` 三个数组，请你计算并返回可以获得的最大报酬。

注意，时间上出现重叠的 2 份工作不能同时进行。

如果你选择的工作在时间 `X` 结束，那么你可以立刻进行在时间 `X` 开始的下一份工作。

示例 1：

****

```text
输入：startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]
输出：120
解释：
我们选出第 1 份和第 4 份工作，
时间范围是 [1-3]+[3-6]，共获得报酬 120 = 50 + 70。
```

示例 2：

** **

```text
输入：startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60]
输出：150
解释：
我们选择第 1，4，5 份工作。
共获得报酬 150 = 20 + 70 + 60。
```

示例 3：

****

```text
输入：startTime = [1,1,1], endTime = [2,3,4], profit = [5,6,4]
输出：6
```

**提示：**

- `1 <= startTime.length == endTime.length == profit.length <= 5 * 10^4`

- `1 <= startTime[i] < endTime[i] <= 10^9`

- `1 <= profit[i] <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 动态规划, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先将工作按照开始时间从小到大排序，然后设计一个函数 $dfs(i)$ 表示从第 $i$ 份工作开始，可以获得的最大报酬。答案即为 $dfs(0)$。

函数 $dfs(i)$ 的计算过程如下：

对于第 $i$ 份工作，我们可以选择做，也可以选择不做。如果不做，最大报酬就是 $dfs(i + 1)$；如果做，我们可以通过二分查找，找到在第 $i$ 份工作结束时间之后开始的第一份工作，记为 $j$，那么最大报酬就是 $profit[i] + dfs(j)$。取两者的较大值即可。即：


dfs(i)=\max(dfs(i+1),profit[i]+dfs(j))


其中 $j$ 是满足 $startTime[j] \ge endTime[i]$ 的最小的下标。

此过程中，我们可以使用记忆化搜索，将每个状态的答案保存下来，避免重复计算。

时间复杂度 $O(n \times \log n)$，其中 $n$ 是工作的数量。

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
// Maximum Profit in Job Scheduling：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func jobScheduling(startTime []int, endTime []int, profit []int) int {
	n := len(profit)
	type tuple struct{ s, e, p int }
	jobs := make([]tuple, n)
	for i, p := range profit {
		jobs[i] = tuple{startTime[i], endTime[i], p}
	}
	sort.Slice(jobs, func(i, j int) bool { return jobs[i].s < jobs[j].s })
	f := make([]int, n)
	var dfs func(int) int
	dfs = func(i int) int {
		if i >= n {
			return 0
		}
		if f[i] != 0 {
			return f[i]
		}
		j := sort.Search(n, func(j int) bool { return jobs[j].s >= jobs[i].e })
		ans := max(dfs(i+1), jobs[i].p+dfs(j))
		f[i] = ans
		return ans
	}
	return dfs(0)
}
```

### Java

```java
// Maximum Profit in Job Scheduling：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[][] jobs;
    private int[] f;
    private int n;

    public int jobScheduling(int[] startTime, int[] endTime, int[] profit) {
        n = profit.length;
        jobs = new int[n][3];
        for (int i = 0; i < n; ++i) {
            jobs[i] = new int[] {startTime[i], endTime[i], profit[i]};
        }
        Arrays.sort(jobs, (a, b) -> a[0] - b[0]);
        f = new int[n];
        return dfs(0);
    }

    private int dfs(int i) {
        if (i >= n) {
            return 0;
        }
        if (f[i] != 0) {
            return f[i];
        }
        int e = jobs[i][1], p = jobs[i][2];
        int j = search(jobs, e, i + 1);
        int ans = Math.max(dfs(i + 1), p + dfs(j));
        f[i] = ans;
        return ans;
    }

    private int search(int[][] jobs, int x, int i) {
        int left = i, right = n;
        while (left < right) {
            int mid = (left + right) >> 1;
            if (jobs[mid][0] >= x) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
}
```

### Python

```python
# Maximum Profit in Job Scheduling：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def jobScheduling(
        self, startTime: List[int], endTime: List[int], profit: List[int]
    ) -> int:
        @cache
        def dfs(i):
            if i >= n:
                return 0
            _, e, p = jobs[i]
            j = bisect_left(jobs, e, lo=i + 1, key=lambda x: x[0])
            return max(dfs(i + 1), p + dfs(j))

        jobs = sorted(zip(startTime, endTime, profit))
        n = len(profit)
        return dfs(0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

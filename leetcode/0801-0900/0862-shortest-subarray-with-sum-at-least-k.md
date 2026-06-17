# 0862. Shortest Subarray with Sum at Least K

---
编号: 862
题目: Shortest Subarray with Sum at Least K
难度: 困难
标签: [队列, 数组, 二分查找, 前缀和, 滑动窗口, 单调队列, 堆（优先队列）]
来源链接: https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/
---

## 题目描述

给你一个整数数组 `nums` 和一个整数 `k` ，找出 `nums` 中和至少为 `k` 的 **最短非空子数组** ，并返回该子数组的长度。如果不存在这样的 **子数组** ，返回 `-1` 。

**子数组** 是数组中 **连续** 的一部分。

**示例 1：**

```text
输入：nums = [1], k = 1
输出：1
```

**示例 2：**

```text
输入：nums = [1,2], k = 4
输出：-1
```

**示例 3：**

```text
输入：nums = [2,-1,2], k = 3
输出：3
```

**提示：**

- `1 <= nums.length <= 10^5`

- `-10^5 <= nums[i] <= 10^5`

- `1 <= k <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「队列, 数组, 二分查找, 前缀和, 滑动窗口, 单调队列, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目要求找到一个最短的子数组，使得子数组的和大于等于 $k$。不难想到，可以使用前缀和快速计算子数组的和。

我们用一个长度为 $n+1$ 的数组 $s[i]$ 表示数组 $nums$ 前 $i$ 个元素的和。另外，我们需要维护一个严格单调递增的队列 $q$，队列中存储的是前缀和数组 $s[i]$ 的下标。注意，这里的单调递增是指下标对应的前缀和的大小，而不是下标的大小。

为什么存的是下标呢？这是为了方便计算子数组的长度。那为什么队列严格单调递增？我们可以用反证法来说明。

假设队列元素非严格单调递增，也即是说，存在下标 $i$ 和 $j$，满足 $i < j$，且 $s[i] \geq s[j]$。

当遍历到下标 $k$，其中 $i \lt j \lt k \leq n$，此时 $s[k]-s[j] \geq s[k]-s[i]$，且 $nums[j..k-1]$ 的长度小于 $nums[i..k-1]$ 的长度。由于下标 $j$ 的存在，子数组 $nums[i..k-1]$ 一定不是最优解，队列中的下标 $i$ 是不必要的，需要将其移除。因此，队列中的元素一定严格单调递增。

回到这道题目上，我们遍历前缀和数组 $s$，对于遍历到的下标 $i$，如果 $s[i] - s[q.front] \geq k$，说明当前遇到了一个可行解，我们可以更新答案。此时，我们需要将队首元素出队，直到队列为空或者 $s[i] - s[q.front] \lt k$ 为止。

如果此时队列不为空，为了维持队列的严格单调递增，我们还需要判断队尾元素是否需要出队，如果 $s[q.back] \geq s[i]$，则需要循环将队尾元素出队，直到队列为空或者 $s[q.back] \lt s[i]$ 为止。然后，我们将下标 $i$ 入队。

遍历结束，如果我们没有找到可行解，那么返回 $-1$。否则，返回答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $nums$ 的长度。

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
// Shortest Subarray with Sum at Least K：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shortestSubarray(nums []int, k int) int {
	n := len(nums)
	s := make([]int, n+1)
	for i, x := range nums {
		s[i+1] = s[i] + x
	}
	q := []int{}
	ans := n + 1
	for i, v := range s {
		for len(q) > 0 && v-s[q[0]] >= k {
			ans = min(ans, i-q[0])
			q = q[1:]
		}
		for len(q) > 0 && s[q[len(q)-1]] >= v {
			q = q[:len(q)-1]
		}
		q = append(q, i)
	}
	if ans > n {
		return -1
	}
	return ans
}
```

### Java

```java
// Shortest Subarray with Sum at Least K：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int shortestSubarray(int[] nums, int k) {
        int n = nums.length;
        long[] s = new long[n + 1];
        for (int i = 0; i < n; ++i) {
            s[i + 1] = s[i] + nums[i];
        }
        Deque<Integer> q = new ArrayDeque<>();
        int ans = n + 1;
        for (int i = 0; i <= n; ++i) {
            while (!q.isEmpty() && s[i] - s[q.peek()] >= k) {
                ans = Math.min(ans, i - q.poll());
            }
            while (!q.isEmpty() && s[q.peekLast()] >= s[i]) {
                q.pollLast();
            }
            q.offer(i);
        }
        return ans > n ? -1 : ans;
    }
}
```

### Python

```python
# Shortest Subarray with Sum at Least K：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shortestSubarray(self, nums: List[int], k: int) -> int:
        s = list(accumulate(nums, initial=0))
        q = deque()
        ans = inf
        for i, v in enumerate(s):
            while q and v - s[q[0]] >= k:
                ans = min(ans, i - q.popleft())
            while q and s[q[-1]] >= v:
                q.pop()
            q.append(i)
        return -1 if ans == inf else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1425. Constrained Subsequence Sum

---
编号: 1425
题目: Constrained Subsequence Sum
难度: 困难
标签: [队列, 数组, 动态规划, 滑动窗口, 单调队列, 堆（优先队列）]
来源链接: https://leetcode.com/problems/constrained-subsequence-sum/
---

## 题目描述

给你一个整数数组 `nums` 和一个整数 `k` ，请你返回 **非空** 子序列元素和的最大值，子序列需要满足：子序列中每两个 **相邻** 的整数 `nums[i]` 和 `nums[j]` ，它们在原数组中的下标 `i` 和 `j` 满足 `i < j` 且 `j - i <= k` 。

数组的子序列定义为：将数组中的若干个数字删除（可以删除 0 个数字），剩下的数字按照原本的顺序排布。

**示例 1：**

```text
输入：nums = [10,2,-10,5,20], k = 2
输出：37
解释：子序列为 [10, 2, 5, 20] 。
```

**示例 2：**

```text
输入：nums = [-1,-2,-3], k = 1
输出：-1
解释：子序列必须是非空的，所以我们选择最大的数字。
```

**示例 3：**

```text
输入：nums = [10,-2,-10,-5,20], k = 2
输出：23
解释：子序列为 [10, -2, -5, 20] 。
```

**提示：**

- `1 <= k <= nums.length <= 10^5`

- `-10^4 <= nums[i] <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「队列, 数组, 动态规划, 滑动窗口, 单调队列, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i]$ 表示以 $\textit{nums}[i]$ 结尾的满足条件的子序列的最大和。初始时 $f[i] = 0$，答案为 $\max_{0 \leq i \lt n} f(i)$。

我们注意到题目需要我们维护滑动窗口的最大值，这就是一个典型的单调队列应用场景。我们可以使用单调队列来优化动态规划的转移。

我们维护一个从队首到队尾单调递减的单调队列 $q$，队列中存储的是下标 $i$，初始时，我们将一个哨兵 $0$ 加入队列中。

我们遍历 $i$ 从 $0$ 到 $n - 1$，对于每个 $i$，我们执行以下操作：

- 如果队首元素 $q[0]$ 满足 $i - q[0] > k$，说明队首元素已经不在滑动窗口内，我们需要从队首弹出队首元素；
- 然后，我们计算 $f[i] = \max(0, f[q[0]]) + \textit{nums}[i]$，表示我们将 $\textit{nums}[i]$ 加入滑动窗口后的最大子序列和；
- 接下来，我们更新答案 $\textit{ans} = \max(\textit{ans}, f[i])$；
- 最后，我们将 $i$ 加入队列尾部，并且保持队列的单调性，即如果 $f[q[\textit{back}]] \leq f[i]$，我们需要将队尾元素弹出，直到队列为空或者 $f[q[\textit{back}]] > f[i]$。

最终答案即为 $\textit{ans}$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\textit{nums}$ 的长度。

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
// Constrained Subsequence Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func constrainedSubsetSum(nums []int, k int) int {
	q := Deque{}
	q.PushFront(0)
	n := len(nums)
	f := make([]int, n)
	ans := nums[0]
	for i, x := range nums {
		for i-q.Front() > k {
			q.PopFront()
		}
		f[i] = max(0, f[q.Front()]) + x
		ans = max(ans, f[i])
		for !q.Empty() && f[q.Back()] <= f[i] {
			q.PopBack()
		}
		q.PushBack(i)
	}
	return ans
}

// template
type Deque struct{ l, r []int }

func (q Deque) Empty() bool {
	return len(q.l) == 0 && len(q.r) == 0
}

func (q Deque) Size() int {
	return len(q.l) + len(q.r)
}

func (q *Deque) PushFront(v int) {
	q.l = append(q.l, v)
}

func (q *Deque) PushBack(v int) {
	q.r = append(q.r, v)
}

func (q *Deque) PopFront() (v int) {
	if len(q.l) > 0 {
		q.l, v = q.l[:len(q.l)-1], q.l[len(q.l)-1]
	} else {
		v, q.r = q.r[0], q.r[1:]
	}
	return
}

func (q *Deque) PopBack() (v int) {
	if len(q.r) > 0 {
		q.r, v = q.r[:len(q.r)-1], q.r[len(q.r)-1]
	} else {
		v, q.l = q.l[0], q.l[1:]
	}
	return
}

func (q Deque) Front() int {
	if len(q.l) > 0 {
		return q.l[len(q.l)-1]
	}
	return q.r[0]
}

func (q Deque) Back() int {
	if len(q.r) > 0 {
		return q.r[len(q.r)-1]
	}
	return q.l[0]
}

func (q Deque) Get(i int) int {
	if i < len(q.l) {
		return q.l[len(q.l)-1-i]
	}
	return q.r[i-len(q.l)]
}
```

### Java

```java
// Constrained Subsequence Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int constrainedSubsetSum(int[] nums, int k) {
        Deque<Integer> q = new ArrayDeque<>();
        q.offer(0);
        int n = nums.length;
        int[] f = new int[n];
        int ans = -(1 << 30);
        for (int i = 0; i < n; ++i) {
            while (i - q.peekFirst() > k) {
                q.pollFirst();
            }
            f[i] = Math.max(0, f[q.peekFirst()]) + nums[i];
            ans = Math.max(ans, f[i]);
            while (!q.isEmpty() && f[q.peekLast()] <= f[i]) {
                q.pollLast();
            }
            q.offerLast(i);
        }
        return ans;
    }
}
```

### Python

```python
# Constrained Subsequence Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def constrainedSubsetSum(self, nums: List[int], k: int) -> int:
        q = deque([0])
        n = len(nums)
        f = [0] * n
        ans = -inf
        for i, x in enumerate(nums):
            while i - q[0] > k:
                q.popleft()
            f[i] = max(0, f[q[0]]) + x
            ans = max(ans, f[i])
            while q and f[q[-1]] <= f[i]:
                q.pop()
            q.append(i)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

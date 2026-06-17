# 0907. Sum of Subarray Minimums

---
编号: 907
题目: Sum of Subarray Minimums
难度: 中等
标签: [栈, 数组, 动态规划, 单调栈]
来源链接: https://leetcode.com/problems/sum-of-subarray-minimums/
---

## 题目描述

给定一个整数数组 `arr`，找到 `min(b)` 的总和，其中 `b` 的范围为 `arr` 的每个（连续）子数组。

由于答案可能很大，因此** 返回答案模 `10^9 + 7`** 。

**示例 1：**

```text
输入：arr = [3,1,2,4]
输出：17
解释：
子数组为 [3]，[1]，[2]，[4]，[3,1]，[1,2]，[2,4]，[3,1,2]，[1,2,4]，[3,1,2,4]。
最小值为 3，1，2，4，1，1，2，1，1，1，和为 17。
```

**示例 2：**

```text
输入：arr = [11,81,94,43,3]
输出：444
```

**提示：**

- `1 <= arr.length <= 3 * 10^4`

- `1 <= arr[i] <= 3 * 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 数组, 动态规划, 单调栈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目要求的是每个子数组的最小值之和，实际上相当于，对于每个元素 $arr[i]$，求以 $arr[i]$ 为最小值的子数组的个数，然后乘以 $arr[i]$，最后求和。

因此，题目的重点转换为：求以 $arr[i]$ 为最小值的子数组的个数。对于 $arr[i]$，我们找出其左边第一个小于 $arr[i]$ 的位置 $left[i]$，右侧第一个小于等于 $arr[i]$ 的位置 $right[i]$，则以 $arr[i]$ 为最小值的子数组的个数为 $(i - left[i]) \times (right[i] - i)$。

注意，这里为什么要求右侧第一个小于等于 $arr[i]$ 的位置 $right[i]$，而不是小于 $arr[i]$ 的位置呢？这是因为，如果是右侧第一个小于 $arr[i]$ 的位置 $right[i]$，则会导致重复计算。

我们可以举个例子来说明，对于以下数组：

下标为 $3$ 的元素大小为 $2$，左侧第一个小于 $2$ 的元素下标为 $0$，如果我们求右侧第一个小于 $2$ 的元素下标，可以得到下标为 $7$。也即是说，子数组区间为 $(0, 7)$。注意，这里是开区间。

```
0 4 3 2 5 3 2 1
*     ^       *
```

按照同样的方法，我们可以求出下标为 $6$ 的元素的子数组区间，可以发现，其子数组区间也为 $(0, 7)$，也即是说，下标为 $3$ 和下标为 $6$ 的元素的子数组区间是重复的。这样就造成了重复计算。

```
0 4 3 2 5 3 2 1
*           ^ *
```

如果我们求的是右侧第一个小于等于其值的下标，就不会有重复问题，因为下标为 $3$ 的子数组区间变为 $(0, 6)$，下标为 $6$ 的子数组区间为 $(0, 7)$，两者不重复。

回到这道题上，我们只需要遍历数组，对于每个元素 $arr[i]$，利用单调栈求出其左侧第一个小于 $arr[i]$ 的位置 $left[i]$，右侧第一个小于等于 $arr[i]$ 的位置 $right[i]$，则以 $arr[i]$ 为最小值的子数组的个数为 $(i - left[i]) \times (right[i] - i)$，然后乘以 $arr[i]$，最后求和即可。

注意数据的溢出以及取模操作。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $arr$ 的长度。

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
// Sum of Subarray Minimums：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func sumSubarrayMins(arr []int) (ans int) {
	n := len(arr)
	left := make([]int, n)
	right := make([]int, n)
	for i := range left {
		left[i] = -1
		right[i] = n
	}
	stk := []int{}
	for i, v := range arr {
		for len(stk) > 0 && arr[stk[len(stk)-1]] >= v {
			stk = stk[:len(stk)-1]
		}
		if len(stk) > 0 {
			left[i] = stk[len(stk)-1]
		}
		stk = append(stk, i)
	}
	stk = []int{}
	for i := n - 1; i >= 0; i-- {
		for len(stk) > 0 && arr[stk[len(stk)-1]] > arr[i] {
			stk = stk[:len(stk)-1]
		}
		if len(stk) > 0 {
			right[i] = stk[len(stk)-1]
		}
		stk = append(stk, i)
	}
	const mod int = 1e9 + 7
	for i, v := range arr {
		ans += (i - left[i]) * (right[i] - i) * v % mod
		ans %= mod
	}
	return
}
```

### Java

```java
// Sum of Subarray Minimums：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int sumSubarrayMins(int[] arr) {
        int n = arr.length;
        int[] left = new int[n];
        int[] right = new int[n];
        Arrays.fill(left, -1);
        Arrays.fill(right, n);
        Deque<Integer> stk = new ArrayDeque<>();
        for (int i = 0; i < n; ++i) {
            while (!stk.isEmpty() && arr[stk.peek()] >= arr[i]) {
                stk.pop();
            }
            if (!stk.isEmpty()) {
                left[i] = stk.peek();
            }
            stk.push(i);
        }
        stk.clear();
        for (int i = n - 1; i >= 0; --i) {
            while (!stk.isEmpty() && arr[stk.peek()] > arr[i]) {
                stk.pop();
            }
            if (!stk.isEmpty()) {
                right[i] = stk.peek();
            }
            stk.push(i);
        }
        final int mod = (int) 1e9 + 7;
        long ans = 0;
        for (int i = 0; i < n; ++i) {
            ans += (long) (i - left[i]) * (right[i] - i) % mod * arr[i] % mod;
            ans %= mod;
        }
        return (int) ans;
    }
}
```

### Python

```python
# Sum of Subarray Minimums：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def sumSubarrayMins(self, arr: List[int]) -> int:
        n = len(arr)
        left = [-1] * n
        right = [n] * n
        stk = []
        for i, v in enumerate(arr):
            while stk and arr[stk[-1]] >= v:
                stk.pop()
            if stk:
                left[i] = stk[-1]
            stk.append(i)

        stk = []
        for i in range(n - 1, -1, -1):
            while stk and arr[stk[-1]] > arr[i]:
                stk.pop()
            if stk:
                right[i] = stk[-1]
            stk.append(i)
        mod = 10**9 + 7
        return sum((i - left[i]) * (right[i] - i) * v for i, v in enumerate(arr)) % mod
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

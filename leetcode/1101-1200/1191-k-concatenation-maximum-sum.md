# 1191. K-Concatenation Maximum Sum

---
编号: 1191
题目: K-Concatenation Maximum Sum
难度: 中等
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/k-concatenation-maximum-sum/
---

## 题目描述

给定一个整数数组 `arr` 和一个整数 `k` ，通过重复 `k` 次来修改数组。

例如，如果 `arr = [1, 2]` ， `k = 3` ，那么修改后的数组将是 `[1, 2, 1, 2, 1, 2]` 。

返回修改后的数组中的最大的子数组之和。注意，子数组长度可以是 `0`，在这种情况下它的总和也是 `0`。

由于 **结果可能会很大**，需要返回结果对 `10^9 + 7` 取 **模**。

**示例 1：**

```text
输入：arr = [1,2], k = 3
输出：9
```

**示例 2：**

```text
输入：arr = [1,-2,1], k = 5
输出：2
```

**示例 3：**

```text
输入：arr = [-1,-2], k = 7
输出：0
```

**提示：**

- `1 <= arr.length <= 10^5`

- `1 <= k <= 10^5`

- `-10^4 <= arr[i] <= 10^4`

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

我们记数组 $arr$ 所有元素之和为 $s$，最大前缀和为 $mxPre$，最小前缀和为 $miPre$，最大子数组和为 $mxSub$。

遍历数组 $arr$，对于每个元素 $x$，我们更新 $s = s + x$, $mxPre = \max(mxPre, s)$, $miPre = \min(miPre, s)$, $mxSub = \max(mxSub, s - miPre)$。

接下来，我们考虑 $k$ 的取值情况：

- 当 $k = 1$ 时，答案为 $mxSub$。
- 当 $k \ge 2$ 时，如果最大子数组横跨两个 $arr$，那么答案为 $mxPre + mxSuf$，其中 $mxSuf = s - miPre$。
- 当 $k \ge 2$ 且 $s > 0$ 时，如果最大子数组横跨三个 $arr$，那么答案为 $(k - 2) \times s + mxPre + mxSuf$。

最后，我们返回答案对 $10^9 + 7$ 取模的结果。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为数组 $arr$ 的长度。

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
// K-Concatenation Maximum Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func kConcatenationMaxSum(arr []int, k int) int {
	var s, mxPre, miPre, mxSub int
	for _, x := range arr {
		s += x
		mxPre = max(mxPre, s)
		miPre = min(miPre, s)
		mxSub = max(mxSub, s-miPre)
	}
	const mod = 1e9 + 7
	ans := mxSub
	if k == 1 {
		return ans % mod
	}
	mxSuf := s - miPre
	ans = max(ans, mxSuf+mxPre)
	if s > 0 {
		ans = max(ans, mxSuf+(k-2)*s+mxPre)
	}
	return ans % mod
}
```

### Java

```java
// K-Concatenation Maximum Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int kConcatenationMaxSum(int[] arr, int k) {
        long s = 0, mxPre = 0, miPre = 0, mxSub = 0;
        for (int x : arr) {
            s += x;
            mxPre = Math.max(mxPre, s);
            miPre = Math.min(miPre, s);
            mxSub = Math.max(mxSub, s - miPre);
        }
        long ans = mxSub;
        final int mod = (int) 1e9 + 7;
        if (k == 1) {
            return (int) (ans % mod);
        }
        long mxSuf = s - miPre;
        ans = Math.max(ans, mxPre + mxSuf);
        if (s > 0) {
            ans = Math.max(ans, (k - 2) * s + mxPre + mxSuf);
        }
        return (int) (ans % mod);
    }
}
```

### Python

```python
# K-Concatenation Maximum Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def kConcatenationMaxSum(self, arr: List[int], k: int) -> int:
        s = mx_pre = mi_pre = mx_sub = 0
        for x in arr:
            s += x
            mx_pre = max(mx_pre, s)
            mi_pre = min(mi_pre, s)
            mx_sub = max(mx_sub, s - mi_pre)
        ans = mx_sub
        mod = 10**9 + 7
        if k == 1:
            return ans % mod
        mx_suf = s - mi_pre
        ans = max(ans, mx_pre + mx_suf)
        if s > 0:
            ans = max(ans, (k - 2) * s + mx_pre + mx_suf)
        return ans % mod
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

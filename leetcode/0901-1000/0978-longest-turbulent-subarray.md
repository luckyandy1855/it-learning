# 0978. Longest Turbulent Subarray

---
编号: 978
题目: Longest Turbulent Subarray
难度: 中等
标签: [数组, 动态规划, 滑动窗口]
来源链接: https://leetcode.com/problems/longest-turbulent-subarray/
---

## 题目描述

给定一个整数数组 `arr` ，返回 `arr` 的 *最大湍流子数组的**长度***** **。

如果比较符号在子数组中的每个相邻元素对之间翻转，则该子数组是 **湍流子数组** 。

更正式地来说，当 `arr` 的子数组 `A[i], A[i+1], ..., A[j]` 满足仅满足下列条件时，我们称其为*湍流子数组*：

- 若 `i  A[k+1]`，且

    	- 当 `k` 为偶数时，`A[k]  A[k+1]` ，且

    	- 当 `k` 为奇数时， `A[k] < A[k+1]`。

**示例 1：**

```text
输入：arr = [9,4,2,10,7,8,8,1,9]
输出：5
解释：arr[1] > arr[2]  arr[4] < arr[5]
```

**示例 2：**

```text
输入：arr = [4,8,12,16]
输出：2
```

**示例 3：**

```text
输入：arr = [100]
输出：1
```

**提示：**

- `1 <= arr.length <= 4 * 10^4`

- `0 <= arr[i] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i]$ 表示以 $\textit{nums}[i]$ 结尾且结尾处于上升状态的最长湍流子数组的长度，定义 $g[i]$ 表示以 $\textit{nums}[i]$ 结尾且结尾处于下降状态的最长湍流子数组的长度。初始时 $f[0] = 1$, $g[0] = 1$。答案为 $\max(f[i], g[i])$。

对于 $i \gt 0$，若 $\textit{nums}[i] \gt \textit{nums}[i - 1]$，则 $f[i] = g[i - 1] + 1$，否则 $f[i] = 1$；若 $\textit{nums}[i] \lt \textit{nums}[i - 1]$，则 $g[i] = f[i - 1] + 1$，否则 $g[i] = 1$。

由于 $f[i]$ 和 $g[i]$ 只与 $f[i - 1]$ 和 $g[i - 1]$ 有关，因此可以使用两个变量代替数组。

时间复杂度 $O(n)$，其中 $n$ 为数组长度。空间复杂度 $O(1)$。

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
// Longest Turbulent Subarray：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxTurbulenceSize(arr []int) int {
	ans, f, g := 1, 1, 1
	for i, x := range arr[1:] {
		ff, gg := 1, 1
		if arr[i] < x {
			ff = g + 1
		}
		if arr[i] > x {
			gg = f + 1
		}
		f, g = ff, gg
		ans = max(ans, max(f, g))
	}
	return ans
}
```

### Java

```java
// Longest Turbulent Subarray：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxTurbulenceSize(int[] arr) {
        int ans = 1, f = 1, g = 1;
        for (int i = 1; i < arr.length; ++i) {
            int ff = arr[i - 1] < arr[i] ? g + 1 : 1;
            int gg = arr[i - 1] > arr[i] ? f + 1 : 1;
            f = ff;
            g = gg;
            ans = Math.max(ans, Math.max(f, g));
        }
        return ans;
    }
}
```

### Python

```python
# Longest Turbulent Subarray：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxTurbulenceSize(self, arr: List[int]) -> int:
        ans = f = g = 1
        for a, b in pairwise(arr):
            ff = g + 1 if a < b else 1
            gg = f + 1 if a > b else 1
            f, g = ff, gg
            ans = max(ans, f, g)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

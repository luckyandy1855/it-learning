# 1043. Partition Array for Maximum Sum

---
编号: 1043
题目: Partition Array for Maximum Sum
难度: 中等
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/partition-array-for-maximum-sum/
---

## 题目描述

给你一个整数数组 `arr`，请你将该数组分隔为长度 **最多 **为 k 的一些（连续）子数组。分隔完成后，每个子数组的中的所有值都会变为该子数组中的最大值。

返回将数组分隔变换后能够得到的元素最大和。本题所用到的测试用例会确保答案是一个 32 位整数。

**示例 1：**

```text
输入：arr = [1,15,7,9,2,5,10], k = 3
输出：84
解释：数组变为 [15,15,15,9,10,10,10]
```

**示例 2：**

```text
输入：arr = [1,4,1,5,7,3,6,1,9,9,3], k = 4
输出：83
```

**示例 3：**

```text
输入：arr = [1], k = 1
输出：1
```

**提示：**

- `1 <= arr.length <= 500`

- `0 <= arr[i] <= 10^9`

- `1 <= k <= arr.length`

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

我们定义 $f[i]$ 表示将数组的前 $i$ 个元素分隔成若干个子数组，最终的最大元素和。初始时 $f[i]=0$，答案为 $f[n]$。

我们考虑如何计算 $f[i]$，其中 $i \geq 1$。

对于 $f[i]$，它的最后一个元素是 $arr[i-1]$。由于每个子数组的长度最多为 $k$，并且我们需要求得子数组中的最大值，因此，我们可以从右往左枚举最后一个子数组的第一个元素 $arr[j - 1]$，其中 $\max(0, i - k) \lt j \leq i$，过程中维护一个变量 $mx$，表示最后一个子数组中的最大值，那么状态转移方程为：


f[i] = \max\{f[i], f[j - 1] + mx \times (i - j + 1)\}


最终的答案即为 $f[n]$。

时间复杂度 $O(n \times k)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $arr$ 的长度。

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
// Partition Array for Maximum Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxSumAfterPartitioning(arr []int, k int) int {
	n := len(arr)
	f := make([]int, n+1)
	for i := 1; i <= n; i++ {
		mx := 0
		for j := i; j > max(0, i-k); j-- {
			mx = max(mx, arr[j-1])
			f[i] = max(f[i], f[j-1]+mx*(i-j+1))
		}
	}
	return f[n]
}
```

### Java

```java
// Partition Array for Maximum Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxSumAfterPartitioning(int[] arr, int k) {
        int n = arr.length;
        int[] f = new int[n + 1];
        for (int i = 1; i <= n; ++i) {
            int mx = 0;
            for (int j = i; j > Math.max(0, i - k); --j) {
                mx = Math.max(mx, arr[j - 1]);
                f[i] = Math.max(f[i], f[j - 1] + mx * (i - j + 1));
            }
        }
        return f[n];
    }
}
```

### Python

```python
# Partition Array for Maximum Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxSumAfterPartitioning(self, arr: List[int], k: int) -> int:
        n = len(arr)
        f = [0] * (n + 1)
        for i in range(1, n + 1):
            mx = 0
            for j in range(i, max(0, i - k), -1):
                mx = max(mx, arr[j - 1])
                f[i] = max(f[i], f[j - 1] + mx * (i - j + 1))
        return f[n]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

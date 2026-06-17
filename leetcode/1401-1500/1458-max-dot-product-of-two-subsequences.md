# 1458. Max Dot Product of Two Subsequences

---
编号: 1458
题目: Max Dot Product of Two Subsequences
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/max-dot-product-of-two-subsequences/
---

## 题目描述

给你两个数组 `nums1` 和 `nums2` 。

请你返回 `nums1` 和 `nums2` 中两个长度相同的 **非空** 子序列的最大点积。

数组的非空子序列是通过删除原数组中某些元素（可能一个也不删除）后剩余数字组成的序列，但不能改变数字间相对顺序。比方说，`[2,3,5]` 是 `[1,2,3,4,5]` 的一个子序列而 `[1,5,3]` 不是。

**示例 1：**

```text
输入：nums1 = [2,1,-2,5], nums2 = [3,0,-6]
输出：18
解释：从 nums1 中得到子序列 [2,-2] ，从 nums2 中得到子序列 [3,-6] 。
它们的点积为 (2*3 + (-2)*(-6)) = 18 。
```

**示例 2：**

```text
输入：nums1 = [3,-2], nums2 = [2,-6,7]
输出：21
解释：从 nums1 中得到子序列 [3] ，从 nums2 中得到子序列 [7] 。
它们的点积为 (3*7) = 21 。
```

**示例 3：**

```text
输入：nums1 = [-1,-1], nums2 = [1,1]
输出：-1
解释：从 nums1 中得到子序列 [-1] ，从 nums2 中得到子序列 [1] 。
它们的点积为 -1 。
```

**提示：**

- `1 <= nums1.length, nums2.length <= 500`

- `-1000 <= nums1[i], nums2[i] <= 1000`

**点积：**

```text
定义 a = [a1, a2,…, an] 和 b = [b1, b2,…, bn] 的点积为：

这里的 Σ 指示总和符号。
```

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

我们定义 $f[i][j]$ 表示 $\textit{nums1}$ 的前 $i$ 个元素和 $\textit{nums2}$ 的前 $j$ 个元素构成的两个子序列的最大点积。初始时 $f[i][j] = -\infty$。

对于 $f[i][j]$，我们有以下几种情况：

1. 不选 $\textit{nums1}[i-1]$ 或者不选 $\textit{nums2}[j-1]$，即 $f[i][j] = \max(f[i-1][j], f[i][j-1])$；
2. 选 $\textit{nums1}[i-1]$ 和 $\textit{nums2}[j-1]$，即 $f[i][j] = \max(f[i][j], \max(0, f[i-1][j-1]) + \textit{nums1}[i-1] \times \textit{nums2}[j-1])$。

最终答案即为 $f[m][n]$。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是数组 $\textit{nums1}$ 和 $\textit{nums2}$ 的长度。

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
// Max Dot Product of Two Subsequences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxDotProduct(nums1 []int, nums2 []int) int {
	m, n := len(nums1), len(nums2)
	f := make([][]int, m+1)
	for i := range f {
		f[i] = make([]int, n+1)
		for j := range f[i] {
			f[i][j] = math.MinInt32
		}
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			v := nums1[i-1] * nums2[j-1]
			f[i][j] = max(f[i-1][j], f[i][j-1])
			f[i][j] = max(f[i][j], max(0, f[i-1][j-1])+v)
		}
	}
	return f[m][n]
}
```

### Java

```java
// Max Dot Product of Two Subsequences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxDotProduct(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;
        int[][] f = new int[m + 1][n + 1];
        for (var g : f) {
            Arrays.fill(g, Integer.MIN_VALUE);
        }
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                int v = nums1[i - 1] * nums2[j - 1];
                f[i][j] = Math.max(f[i - 1][j], f[i][j - 1]);
                f[i][j] = Math.max(f[i][j], Math.max(f[i - 1][j - 1], 0) + v);
            }
        }
        return f[m][n];
    }
}
```

### Python

```python
# Max Dot Product of Two Subsequences：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxDotProduct(self, nums1: List[int], nums2: List[int]) -> int:
        m, n = len(nums1), len(nums2)
        f = [[-inf] * (n + 1) for _ in range(m + 1)]
        for i, x in enumerate(nums1, 1):
            for j, y in enumerate(nums2, 1):
                v = x * y
                f[i][j] = max(f[i - 1][j], f[i][j - 1], max(0, f[i - 1][j - 1]) + v)
        return f[m][n]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

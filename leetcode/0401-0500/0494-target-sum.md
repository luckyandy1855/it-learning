# 0494. Target Sum

---
编号: 494
题目: Target Sum
难度: 中等
标签: [数组, 动态规划, 回溯]
来源链接: https://leetcode.com/problems/target-sum/
---

## 题目描述

给你一个非负整数数组 `nums` 和一个整数 `target` 。

向数组中的每个整数前添加 `'+'` 或 `'-'` ，然后串联起所有整数，可以构造一个 **表达式** ：

- 例如，`nums = [2, 1]` ，可以在 `2` 之前添加 `'+'` ，在 `1` 之前添加 `'-'` ，然后串联起来得到表达式 `"+2-1"` 。

返回可以通过上述方法构造的、运算结果等于 `target` 的不同 **表达式** 的数目。

**示例 1：**

```text
输入：nums = [1,1,1,1,1], target = 3
输出：5
解释：一共有 5 种方法让最终目标和为 3 。
-1 + 1 + 1 + 1 + 1 = 3
+1 - 1 + 1 + 1 + 1 = 3
+1 + 1 - 1 + 1 + 1 = 3
+1 + 1 + 1 - 1 + 1 = 3
+1 + 1 + 1 + 1 - 1 = 3
```

**示例 2：**

```text
输入：nums = [1], target = 1
输出：1
```

**提示：**

- `1 <= nums.length <= 20`

- `0 <= nums[i] <= 1000`

- `0 <= sum(nums[i]) <= 1000`

- `-1000 <= target <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们记数组 $\textit{nums}$ 所有元素的和为 $s$，添加负号的元素之和为 $x$，则添加正号的元素之和为 $s - x$，则有：


(s - x) - x = \textit{target} \Rightarrow x = \frac{s - \textit{target}}{2}


由于 $x \geq 0$，且 $x$ 为整数，所以 $s \geq \textit{target}$ 且 $s - \textit{target}$ 为偶数。如果不满足这两个条件，则直接返回 $0$。

接下来，我们可以将问题转化为：在数组 $\textit{nums}$ 中选取若干元素，使得这些元素之和等于 $\frac{s - \textit{target}}{2}$，问有多少种选取方法。

我们可以使用动态规划来解决这个问题。定义 $f[i][j]$ 表示在数组 $\textit{nums}$ 的前 $i$ 个元素中选取若干元素，使得这些元素之和等于 $j$ 的选取方案数。

对于 $\textit{nums}[i - 1]$，我们有两种选择：选取或不选取。如果我们不选取 $\textit{nums}[i - 1]$，则 $f[i][j] = f[i - 1][j]$；如果我们选取 $\textit{nums}[i - 1]$，则 $f[i][j] = f[i - 1][j - \textit{nums}[i - 1]]$。因此，状态转移方程为：


f[i][j] = f[i - 1][j] + f[i - 1][j - \textit{nums}[i - 1]]


其中，选取的前提是 $j \geq \textit{nums}[i - 1]$。

最终答案即为 $f[m][n]$。其中 $m$ 为数组 $\textit{nums}$ 的长度，而 $n = \frac{s - \textit{target}}{2}$。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。

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
// Target Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findTargetSumWays(nums []int, target int) int {
	s := 0
	for _, x := range nums {
		s += x
	}
	if s < target || (s-target)%2 != 0 {
		return 0
	}
	m, n := len(nums), (s-target)/2
	f := make([][]int, m+1)
	for i := range f {
		f[i] = make([]int, n+1)
	}
	f[0][0] = 1
	for i := 1; i <= m; i++ {
		for j := 0; j <= n; j++ {
			f[i][j] = f[i-1][j]
			if j >= nums[i-1] {
				f[i][j] += f[i-1][j-nums[i-1]]
			}
		}
	}
	return f[m][n]
}
```

### Java

```java
// Target Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int s = Arrays.stream(nums).sum();
        if (s < target || (s - target) % 2 != 0) {
            return 0;
        }
        int m = nums.length;
        int n = (s - target) / 2;
        int[][] f = new int[m + 1][n + 1];
        f[0][0] = 1;
        for (int i = 1; i <= m; ++i) {
            for (int j = 0; j <= n; ++j) {
                f[i][j] = f[i - 1][j];
                if (j >= nums[i - 1]) {
                    f[i][j] += f[i - 1][j - nums[i - 1]];
                }
            }
        }
        return f[m][n];
    }
}
```

### Python

```python
# Target Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        s = sum(nums)
        if s < target or (s - target) % 2:
            return 0
        m, n = len(nums), (s - target) // 2
        f = [[0] * (n + 1) for _ in range(m + 1)]
        f[0][0] = 1
        for i, x in enumerate(nums, 1):
            for j in range(n + 1):
                f[i][j] = f[i - 1][j]
                if j >= x:
                    f[i][j] += f[i - 1][j - x]
        return f[m][n]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

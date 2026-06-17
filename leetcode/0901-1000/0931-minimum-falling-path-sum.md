# 0931. Minimum Falling Path Sum

---
编号: 931
题目: Minimum Falling Path Sum
难度: 中等
标签: [数组, 动态规划, 矩阵]
来源链接: https://leetcode.com/problems/minimum-falling-path-sum/
---

## 题目描述

给你一个 `n x n` 的** 方形 **整数数组 `matrix` ，请你找出并返回通过 `matrix` 的**下降路径*** *的** ****最小和** 。

**下降路径** 可以从第一行中的任何元素开始，并从每一行中选择一个元素。在下一行选择的元素和当前行所选元素最多相隔一列（即位于正下方或者沿对角线向左或者向右的第一个元素）。具体来说，位置 `(row, col)` 的下一个元素应当是 `(row + 1, col - 1)`、`(row + 1, col)` 或者 `(row + 1, col + 1)` 。

**示例 1：**

```text
输入：matrix = [[2,1,3],[6,5,4],[7,8,9]]
输出：13
解释：如图所示，为和最小的两条下降路径
```

**示例 2：**

```text
输入：matrix = [[-19,57],[-40,-5]]
输出：-59
解释：如图所示，为和最小的下降路径
```

**提示：**

- `n == matrix.length == matrix[i].length`

- `1 <= n <= 100`

- `-100 <= matrix[i][j] <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示从第一行开始下降，到达第 $i$ 行第 $j$ 列的最小路径和。那么我们可以得到这样的动态规划转移方程：


f[i][j] = matrix[i][j] + \min \left\{ \begin{aligned} & f[i - 1][j - 1], & j > 0 \\ & f[i - 1][j], & 0 \leq j < n \\ & f[i - 1][j + 1], & j + 1 < n \end{aligned} \right.


最终的答案即为 $\min \limits_{0 \leq j < n} f[n - 1][j]$。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。

我们注意到，状态 $f[i][j]$ 只与上一行的状态有关，因此我们可以使用滚动数组的方式，去掉第一维的状态，将空间复杂度优化到 $O(n)$。

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
// Minimum Falling Path Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minFallingPathSum(matrix [][]int) int {
	n := len(matrix)
	f := make([]int, n)
	for _, row := range matrix {
		g := make([]int, n)
		copy(g, f)
		for j, x := range row {
			if j > 0 {
				g[j] = min(g[j], f[j-1])
			}
			if j+1 < n {
				g[j] = min(g[j], f[j+1])
			}
			g[j] += x
		}
		f = g
	}
	return slices.Min(f)
}
```

### Java

```java
// Minimum Falling Path Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minFallingPathSum(int[][] matrix) {
        int n = matrix.length;
        var f = new int[n];
        for (var row : matrix) {
            var g = f.clone();
            for (int j = 0; j < n; ++j) {
                if (j > 0) {
                    g[j] = Math.min(g[j], f[j - 1]);
                }
                if (j + 1 < n) {
                    g[j] = Math.min(g[j], f[j + 1]);
                }
                g[j] += row[j];
            }
            f = g;
        }
        // return Arrays.stream(f).min().getAsInt();
        int ans = 1 << 30;
        for (int x : f) {
            ans = Math.min(ans, x);
        }
        return ans;
    }
}
```

### Python

```python
# Minimum Falling Path Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minFallingPathSum(self, matrix: List[List[int]]) -> int:
        n = len(matrix)
        f = [0] * n
        for row in matrix:
            g = [0] * n
            for j, x in enumerate(row):
                l, r = max(0, j - 1), min(n, j + 2)
                g[j] = min(f[l:r]) + x
            f = g
        return min(f)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

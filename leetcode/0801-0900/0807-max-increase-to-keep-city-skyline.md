# 0807. Max Increase to Keep City Skyline

---
编号: 807
题目: Max Increase to Keep City Skyline
难度: 中等
标签: [贪心, 数组, 矩阵]
来源链接: https://leetcode.com/problems/max-increase-to-keep-city-skyline/
---

## 题目描述

给你一座由 `n x n` 个街区组成的城市，每个街区都包含一座立方体建筑。给你一个下标从 **0** 开始的 `n x n` 整数矩阵 `grid` ，其中 `grid[r][c]` 表示坐落于 `r` 行 `c` 列的建筑物的 **高度** 。

城市的 **天际线** 是从远处观察城市时，所有建筑物形成的外部轮廓。从东、南、西、北四个主要方向观测到的 **天际线** 可能不同。

我们被允许为 **任意数量的建筑物 **的高度增加** 任意增量（不同建筑物的增量可能不同）** 。 高度为 `0` 的建筑物的高度也可以增加。然而，增加的建筑物高度 **不能影响** 从任何主要方向观察城市得到的 **天际线** 。

在 **不改变** 从任何主要方向观测到的城市 **天际线** 的前提下，返回建筑物可以增加的 **最大高度增量总和** 。

**示例 1：**

```text
输入：grid = [[3,0,8,4],[2,4,5,7],[9,2,6,3],[0,3,1,0]]
输出：35
解释：建筑物的高度如上图中心所示。
用红色绘制从不同方向观看得到的天际线。
在不影响天际线的情况下，增加建筑物的高度：
gridNew = [ [8, 4, 8, 7],
            [7, 4, 7, 7],
            [9, 4, 8, 7],
            [3, 3, 3, 3] ]
```

**示例 2：**

```text
输入：grid = [[0,0,0],[0,0,0],[0,0,0]]
输出：0
解释：增加任何建筑物的高度都会导致天际线的变化。
```

**提示：**

- `n == grid.length`

- `n == grid[r].length`

- `2 <= n <= 50`

- `0 <= grid[r][c] <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，我们可以将每个单元格 $(i, j)$ 的值增加至第 $i$ 行的最大值和第 $j$ 列的最大值中的较小值，这样可以保证不影响天际线，即每个单元格增加的高度为 $\min(\textit{rowMax}[i], \textit{colMax}[j]) - \textit{grid}[i][j]$。

因此，我们可以先遍历一次矩阵，分别计算出每行和每列的最大值，记录在数组 $\textit{rowMax}$ 和 $\textit{colMax}$ 中，然后再遍历一次矩阵，计算出答案即可。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 为矩阵 $\textit{grid}$ 的边长。

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
// Max Increase to Keep City Skyline：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxIncreaseKeepingSkyline(grid [][]int) (ans int) {
	rowMax := make([]int, len(grid))
	colMax := make([]int, len(grid[0]))
	for i, row := range grid {
		for j, x := range row {
			rowMax[i] = max(rowMax[i], x)
			colMax[j] = max(colMax[j], x)
		}
	}
	for i, row := range grid {
		for j, x := range row {
			ans += min(rowMax[i], colMax[j]) - x
		}
	}
	return
}
```

### Java

```java
// Max Increase to Keep City Skyline：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxIncreaseKeepingSkyline(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] rowMax = new int[m];
        int[] colMax = new int[n];
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                rowMax[i] = Math.max(rowMax[i], grid[i][j]);
                colMax[j] = Math.max(colMax[j], grid[i][j]);
            }
        }
        int ans = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                ans += Math.min(rowMax[i], colMax[j]) - grid[i][j];
            }
        }
        return ans;
    }
}
```

### Python

```python
# Max Increase to Keep City Skyline：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxIncreaseKeepingSkyline(self, grid: List[List[int]]) -> int:
        row_max = [max(row) for row in grid]
        col_max = [max(col) for col in zip(*grid)]
        return sum(
            min(row_max[i], col_max[j]) - x
            for i, row in enumerate(grid)
            for j, x in enumerate(row)
        )
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

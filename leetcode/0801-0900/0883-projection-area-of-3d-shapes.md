# 0883. Projection Area of 3D Shapes

---
编号: 883
题目: Projection Area of 3D Shapes
难度: 简单
标签: [几何, 数组, 数学, 矩阵]
来源链接: https://leetcode.com/problems/projection-area-of-3d-shapes/
---

## 题目描述

在 `n x n` 的网格 `grid` 中，我们放置了一些与 x，y，z 三轴对齐的 `1 x 1 x 1` 立方体。

每个值 `v = grid[i][j]` 表示有一列 `v` 个正方体叠放在格子 `(i, j)` 上。

现在，我们查看这些立方体在 `xy` 、`yz` 和 `zx` 平面上的*投影*。

**投影** 就像影子，将 **三维** 形体映射到一个 **二维** 平面上。从顶部、前面和侧面看立方体时，我们会看到“影子”。

返回 *所有三个投影的总面积* 。

**示例 1：**

```text
输入：[[1,2],[3,4]]
输出：17
解释：这里有该形体在三个轴对齐平面上的三个投影(“阴影部分”)。
```

**示例 2:**

```text
输入：grid = [[2]]
输出：5
```

**示例 3：**

```text
输入：[[1,0],[0,2]]
输出：8
```

**提示：**

- `n == grid.length == grid[i].length`

- `1 <= n <= 50`

- `0 <= grid[i][j] <= 50`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「几何, 数组, 数学, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以分别计算三个投影的面积。

- xy 平面的投影面积：每个非零值都会投影到 xy 平面，所以 xy 的投影面积为非零值的个数。
- yz 平面的投影面积：每一行的最大值。
- zx 平面的投影面积：每一列的最大值。

最后将三个面积相加即可。

时间复杂度 $O(n^2)$，其中 $n$ 为网格 `grid` 的边长。空间复杂度 $O(1)$。

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
// Projection Area of 3D Shapes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func projectionArea(grid [][]int) int {
	xy, yz, zx := 0, 0, 0
	for i, row := range grid {
		maxYz, maxZx := 0, 0
		for j, v := range row {
			if v > 0 {
				xy++
			}
			maxYz = max(maxYz, v)
			maxZx = max(maxZx, grid[j][i])
		}
		yz += maxYz
		zx += maxZx
	}
	return xy + yz + zx
}
```

### Java

```java
// Projection Area of 3D Shapes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int projectionArea(int[][] grid) {
        int xy = 0, yz = 0, zx = 0;
        for (int i = 0, n = grid.length; i < n; ++i) {
            int maxYz = 0;
            int maxZx = 0;
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] > 0) {
                    ++xy;
                }
                maxYz = Math.max(maxYz, grid[i][j]);
                maxZx = Math.max(maxZx, grid[j][i]);
            }
            yz += maxYz;
            zx += maxZx;
        }
        return xy + yz + zx;
    }
}
```

### Python

```python
# Projection Area of 3D Shapes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def projectionArea(self, grid: List[List[int]]) -> int:
        xy = sum(v > 0 for row in grid for v in row)
        yz = sum(max(row) for row in grid)
        zx = sum(max(col) for col in zip(*grid))
        return xy + yz + zx
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

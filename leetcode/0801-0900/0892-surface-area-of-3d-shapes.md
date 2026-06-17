# 0892. Surface Area of 3D Shapes

---
编号: 892
题目: Surface Area of 3D Shapes
难度: 简单
标签: [几何, 数组, 数学, 矩阵]
来源链接: https://leetcode.com/problems/surface-area-of-3d-shapes/
---

## 题目描述

给你一个 `n * n` 的网格 `grid` ，上面放置着一些 `1 x 1 x 1` 的正方体。每个值 `v = grid[i][j]` 表示 `v` 个正方体叠放在对应单元格 `(i, j)` 上。

放置好正方体后，任何直接相邻的正方体都会互相粘在一起，形成一些不规则的三维形体。

请你返回最终这些形体的总表面积。

**注意：**每个形体的底面也需要计入表面积中。

**示例 1：**

```text
输入：grid = [[1,2],[3,4]]
输出：34
```

**示例 2：**

```text
输入：grid = [[1,1,1],[1,0,1],[1,1,1]]
输出：32
```

**示例 3：**

```text
输入：grid = [[2,2,2],[2,1,2],[2,2,2]]
输出：46
```

**提示：**

- `n == grid.length`

- `n == grid[i].length`

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

时间复杂度 $O(n^2)$，空间复杂度 $O(1)$。

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
// Surface Area of 3D Shapes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func surfaceArea(grid [][]int) int {
	ans := 0
	for i, row := range grid {
		for j, v := range row {
			if v > 0 {
				ans += 2 + v*4
				if i > 0 {
					ans -= min(v, grid[i-1][j]) * 2
				}
				if j > 0 {
					ans -= min(v, grid[i][j-1]) * 2
				}
			}
		}
	}
	return ans
}
```

### Java

```java
// Surface Area of 3D Shapes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int surfaceArea(int[][] grid) {
        int n = grid.length;
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] > 0) {
                    ans += 2 + grid[i][j] * 4;
                    if (i > 0) {
                        ans -= Math.min(grid[i][j], grid[i - 1][j]) * 2;
                    }
                    if (j > 0) {
                        ans -= Math.min(grid[i][j], grid[i][j - 1]) * 2;
                    }
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Surface Area of 3D Shapes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def surfaceArea(self, grid: List[List[int]]) -> int:
        ans = 0
        for i, row in enumerate(grid):
            for j, v in enumerate(row):
                if v:
                    ans += 2 + v * 4
                    if i:
                        ans -= min(v, grid[i - 1][j]) * 2
                    if j:
                        ans -= min(v, grid[i][j - 1]) * 2
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0064. Minimum Path Sum

---
编号: 64
题目: Minimum Path Sum
难度: 中等
标签: [数组, 动态规划, 矩阵]
来源链接: https://leetcode.com/problems/minimum-path-sum/
---

## 题目描述

给定一个 m×n 的网格，网格中每个格子包含一个非负整数。找一条从左上角到右下角的路径，使路径上数字之和最小。每次只能向**右**或**向下**移动。

### Example 1

```text
Input: grid = [[1,3,1],[1,5,1],[4,2,1]]
Output: 7
Explanation: 路径 1→3→1→1→1 的和为 7
```

### Example 2

```text
Input: grid = [[1,2,3],[4,5,6]]
Output: 12
```

### 约束条件

- `m == grid.length`，`n == grid[i].length`
- `1 <= m, n <= 200`
- `0 <= grid[i][j] <= 200`

## 思路分析

### 突破口

经典 DP：`dp[i][j]` 表示到达 `(i,j)` 的最小路径和，状态转移为 `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`。

### 思路拆解

1. **第一行**：只能从左到右，`dp[0][j] = dp[0][j-1] + grid[0][j]`。

2. **第一列**：只能从上到下，`dp[i][0] = dp[i-1][0] + grid[i][0]`。

3. **其他格**：`dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`。

4. **原地 DP**：直接修改 `grid` 作为 dp 数组，省去额外空间。

### 示意图

```text
grid:          dp:
1 3 1          1  4  5
1 5 1    →     2  7  6
4 2 1          6  8  7

dp[1][1] = 5 + min(4,2) = 7
dp[2][2] = 1 + min(6,8) = 7
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| DP（原地） | O(m×n) | O(1) |
| DP（一维数组） | O(m×n) | O(n) |

## 代码实现

### Go

```go
// minPathSum 返回从左上到右下的最小路径和
func minPathSum(grid [][]int) int {
    m, n := len(grid), len(grid[0])

    // 初始化第一行
    for j := 1; j < n; j++ {
        grid[0][j] += grid[0][j-1]
    }
    // 初始化第一列
    for i := 1; i < m; i++ {
        grid[i][0] += grid[i-1][0]
    }
    // 状态转移
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            up := grid[i-1][j]
            left := grid[i][j-1]
            if up < left {
                grid[i][j] += up
            } else {
                grid[i][j] += left
            }
        }
    }
    return grid[m-1][n-1]
}
```

### Java

```java
class Solution {
    /**
     * 返回从左上到右下的最小路径和（原地 DP）。
     */
    public int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;

        for (int j = 1; j < n; j++) grid[0][j] += grid[0][j - 1];
        for (int i = 1; i < m; i++) grid[i][0] += grid[i - 1][0];

        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);

        return grid[m - 1][n - 1];
    }
}
```

### Python

```python
class Solution:
    def minPathSum(self, grid: list[list[int]]) -> int:
        """
        返回从左上到右下的最小路径和（原地 DP）。
        """
        m, n = len(grid), len(grid[0])

        for j in range(1, n):
            grid[0][j] += grid[0][j - 1]
        for i in range(1, m):
            grid[i][0] += grid[i - 1][0]

        for i in range(1, m):
            for j in range(1, n):
                grid[i][j] += min(grid[i - 1][j], grid[i][j - 1])

        return grid[-1][-1]
```

## 踩坑记录

- **先初始化边界再做 DP**：第一行和第一列没有 `min` 选择，必须单独处理为前缀和，否则状态转移访问 `grid[-1][j]` 等非法位置。
- **原地修改 grid**：直接在 `grid` 上做 DP，避免额外分配空间，但会修改输入，若调用方不允许修改则需要另建 dp 数组。
- **区别于 Unique Paths**：本题路径上的值不同，需要记录最小代价，而非路径数量，不能用组合数学公式直接求解。

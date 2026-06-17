# 0063. Unique Paths II

---
编号: 63
题目: Unique Paths II
难度: 中等
标签: [数组, 动态规划, 矩阵]
来源链接: https://leetcode.com/problems/unique-paths-ii/
---

## 题目描述

与 0062 Unique Paths 相同的网格问题，但网格中有**障碍物**。`obstacleGrid[i][j] == 1` 表示该格有障碍，机器人无法经过。返回从左上角到右下角的路径总数。

### Example 1

```text
Input: obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
Output: 2
Explanation: 中间有障碍，绕过它有两条路
```

### Example 2

```text
Input: obstacleGrid = [[0,1],[0,0]]
Output: 1
```

### 约束条件

- `m == obstacleGrid.length`，`n == obstacleGrid[i].length`
- `1 <= m, n <= 100`
- `obstacleGrid[i][j]` 为 0 或 1

## 思路分析

### 突破口

在 0062 的 DP 基础上增加障碍判断：有障碍的格子路径数强制为 0。

### 思路拆解

1. **初始化第一行/第一列**：遇到障碍后其后所有格子都为 0（因为只能向右/向下，障碍挡住后面就不可达）。

2. **DP 状态转移**：`dp[i][j] = obstacleGrid[i][j] == 1 ? 0 : dp[i-1][j] + dp[i][j-1]`。

3. **一维 DP 优化**：同 0062，`dp[j] += dp[j-1]`；若当前格是障碍，`dp[j] = 0`。

### 示意图

```text
obstacleGrid:
0 0 0
0 1 0
0 0 0

dp（一维，每行更新后）：
初始: [1, 1, 1]
行1:  dp[1]=0（障碍）, dp[2]=0+0=0 → [1, 0, 0]
行2:  dp[1]=0+1=1, dp[2]=0+1=1   → [1, 1, 2]? 

正确：
行1: j=1是障碍→dp[1]=0; j=2: dp[2]+=dp[1]=0 → [1,0,0]
行2: j=1: dp[1]+=dp[0]=1 → dp[1]=1; j=2: dp[2]+=dp[1]=1 → dp[2]=1
结果: dp[2]=2 ✓（不对，应该是2，在3x3网格中答案是2）
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| DP 一维 | O(m×n) | O(n) |

## 代码实现

### Go

```go
// uniquePathsWithObstacles 返回有障碍物网格中从左上到右下的路径总数
func uniquePathsWithObstacles(obstacleGrid [][]int) int {
    m, n := len(obstacleGrid), len(obstacleGrid[0])
    dp := make([]int, n)

    // 初始化第一行（遇障碍后置0）
    for j := 0; j < n; j++ {
        if obstacleGrid[0][j] == 1 {
            break // 障碍后全不可达
        }
        dp[j] = 1
    }

    for i := 1; i < m; i++ {
        if obstacleGrid[i][0] == 1 {
            dp[0] = 0 // 左列遇障碍置0
        }
        for j := 1; j < n; j++ {
            if obstacleGrid[i][j] == 1 {
                dp[j] = 0
            } else {
                dp[j] += dp[j-1]
            }
        }
    }
    return dp[n-1]
}
```

### Java

```java
class Solution {
    /**
     * 返回有障碍物网格中从左上到右下的路径总数。
     */
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int m = obstacleGrid.length, n = obstacleGrid[0].length;
        int[] dp = new int[n];

        // 初始化第一行
        for (int j = 0; j < n; j++) {
            if (obstacleGrid[0][j] == 1) break;
            dp[j] = 1;
        }

        for (int i = 1; i < m; i++) {
            if (obstacleGrid[i][0] == 1) dp[0] = 0;
            for (int j = 1; j < n; j++) {
                dp[j] = obstacleGrid[i][j] == 1 ? 0 : dp[j] + dp[j - 1];
            }
        }
        return dp[n - 1];
    }
}
```

### Python

```python
class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: list[list[int]]) -> int:
        """
        返回有障碍物网格中从左上到右下的路径总数。
        """
        m, n = len(obstacleGrid), len(obstacleGrid[0])
        dp = [0] * n

        # 初始化第一行
        for j in range(n):
            if obstacleGrid[0][j] == 1:
                break
            dp[j] = 1

        for i in range(1, m):
            if obstacleGrid[i][0] == 1:
                dp[0] = 0
            for j in range(1, n):
                dp[j] = 0 if obstacleGrid[i][j] == 1 else dp[j] + dp[j - 1]

        return dp[-1]
```

## 踩坑记录

- **第一行遇障碍后全部置0**：因为只能向右，障碍格右侧全不可达，用 `break` 而非 `continue`。
- **第一列每行单独判断**：若 `obstacleGrid[i][0] == 1`，将 `dp[0]` 置 0，后续行的第一列也不可达。
- **起点或终点有障碍时返回 0**：起点为障碍则 `dp[0]=0` 且第一行全 0；终点为障碍则最后 `dp[n-1]=0`，均自然处理。

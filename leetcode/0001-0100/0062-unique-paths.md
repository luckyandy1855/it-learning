# 0062. Unique Paths

---
编号: 62
题目: Unique Paths
难度: 中等
标签: [数学, 动态规划, 组合数学]
来源链接: https://leetcode.com/problems/unique-paths/
---

## 题目描述

有一个机器人在 m×n 的网格左上角（`[0,0]`），目标是到达右下角（`[m-1,n-1]`）。机器人每次只能向**右**或**向下**移动一步。返回所有可能的路径总数。

### Example 1

```text
Input: m=3, n=7
Output: 28
```

### Example 2

```text
Input: m=3, n=2
Output: 3
Explanation: 三条路径：右下下、下右下、下下右
```

### 约束条件

- `1 <= m, n <= 100`

## 思路分析

### 突破口

DP 或组合数学。到达 `(i,j)` 的路径数 = 到达 `(i-1,j)` 的路径数 + 到达 `(i,j-1)` 的路径数；边界行/列全为 1（只有一种走法）。

### 思路拆解

1. **DP**：`dp[i][j] = dp[i-1][j] + dp[i][j-1]`，第一行和第一列初始化为 1。

2. **空间优化**：只需一维数组 `dp[j]`，从左到右更新 `dp[j] += dp[j-1]`（`dp[j]` 含上方，`dp[j-1]` 含左方）。

3. **数学公式**：从 `(0,0)` 到 `(m-1,n-1)` 需要 `(m-1)+(n-1)` 步，其中 `m-1` 步向下，答案为 `C(m+n-2, m-1)`。

### 示意图

```text
m=3, n=3 的 dp 表：
  j=0  j=1  j=2
i=0: 1    1    1
i=1: 1    2    3
i=2: 1    3    6

dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| DP 二维 | O(m×n) | O(m×n) |
| DP 一维（优化） | O(m×n) | O(n) |
| 数学公式 | O(min(m,n)) | O(1) |

## 代码实现

### Go

```go
// uniquePaths 返回机器人从左上到右下的路径总数
func uniquePaths(m int, n int) int {
    dp := make([]int, n)
    for j := range dp {
        dp[j] = 1 // 第一行全为1
    }

    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            dp[j] += dp[j-1] // 上方(dp[j]) + 左方(dp[j-1])
        }
    }
    return dp[n-1]
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回机器人从左上到右下的路径总数（一维 DP）。
     */
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        java.util.Arrays.fill(dp, 1); // 第一行全为 1

        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[j] += dp[j - 1]; // 上方 + 左方

        return dp[n - 1];
    }
}
```

### Python

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        """
        返回机器人从左上到右下的路径总数（一维 DP）。
        """
        dp = [1] * n  # 第一行全为 1

        for _ in range(1, m):
            for j in range(1, n):
                dp[j] += dp[j - 1]  # 上方 + 左方

        return dp[-1]
```

## 踩坑记录

- **一维 DP 内层从左往右更新**：`dp[j] += dp[j-1]`，此时 `dp[j]` 存的是上一行同列的值（未更新），`dp[j-1]` 已是当前行左侧，正好对应二维的 `dp[i-1][j] + dp[i][j-1]`。
- **初始化全为 1**：第一行（向右只有一条路）和第一列（向下只有一条路）都是 1，一维数组初始化全 1 直接覆盖第一行，第一列靠循环从 j=1 开始保持不变。
- **数学公式越界**：m=n=100 时 `C(198, 99)` 极大，Go 需用 big.Int 或注意溢出；本题数值范围实际不大（答案在 int 范围内），但中间计算可能溢出，须用 int64 或先约分。

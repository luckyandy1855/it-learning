# 0764. Largest Plus Sign

---
编号: 764
题目: Largest Plus Sign
难度: 中等
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/largest-plus-sign/
---

## 题目描述

在一个 `n x n` 的矩阵 `grid` 中，除了在数组 `mines` 中给出的元素为 `0`，其他每个元素都为 `1`。`mines[i] = [xi, yi]`表示 `grid[xi][yi] == 0`

返回 * *`grid`* 中包含 `1` 的最大的 **轴对齐** 加号标志的阶数* 。如果未找到加号标志，则返回 `0` 。

一个 `k` 阶由 *`1`* 组成的 **“轴对称”加号标志** 具有中心网格 `grid[r][c] == 1` ，以及4个从中心向上、向下、向左、向右延伸，长度为 `k-1`，由 `1` 组成的臂。注意，只有加号标志的所有网格要求为 `1` ，别的网格可能为 `0` 也可能为 `1` 。

**示例 1：**

```text
输入: n = 5, mines = [[4, 2]]
输出: 2
解释: 在上面的网格中，最大加号标志的阶只能是2。一个标志已在图中标出。
```

**示例 2：**

```text
输入: n = 1, mines = [[0, 0]]
输出: 0
解释: 没有加号标志，返回 0 。
```

**提示：**

- `1 i, yi i, yi)` 都 **不重复**​​​​​​​

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

我们定义 $dp[i][j]$ 表示以 $(i, j)$ 为中心的最大加号标志的阶数，答案即为所有 $dp[i][j]$ 的最大值。

我们可以发现，对于每个 $(i, j)$，其最大加号标志的阶数不会超过其上下左右四个方向上连续的 $1$ 的个数的最小值。因此，我们可以预处理出每个位置上下左右四个方向上连续的 $1$ 的个数，然后遍历所有的 $(i, j)$，求出 $dp[i][j]$ 的最大值即可。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 为网格的边长。

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
// Largest Plus Sign：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func orderOfLargestPlusSign(n int, mines [][]int) (ans int) {
	dp := make([][]int, n)
	for i := range dp {
		dp[i] = make([]int, n)
		for j := range dp[i] {
			dp[i][j] = n
		}
	}
	for _, e := range mines {
		dp[e[0]][e[1]] = 0
	}
	for i := 0; i < n; i++ {
		var left, right, up, down int
		for j, k := 0, n-1; j < n; j, k = j+1, k-1 {
			left, right, up, down = left+1, right+1, up+1, down+1
			if dp[i][j] == 0 {
				left = 0
			}
			if dp[i][k] == 0 {
				right = 0
			}
			if dp[j][i] == 0 {
				up = 0
			}
			if dp[k][i] == 0 {
				down = 0
			}
			dp[i][j] = min(dp[i][j], left)
			dp[i][k] = min(dp[i][k], right)
			dp[j][i] = min(dp[j][i], up)
			dp[k][i] = min(dp[k][i], down)
		}
	}
	for _, e := range dp {
		ans = max(ans, slices.Max(e))
	}
	return
}
```

### Java

```java
// Largest Plus Sign：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int orderOfLargestPlusSign(int n, int[][] mines) {
        int[][] dp = new int[n][n];
        for (var e : dp) {
            Arrays.fill(e, n);
        }
        for (var e : mines) {
            dp[e[0]][e[1]] = 0;
        }
        for (int i = 0; i < n; ++i) {
            int left = 0, right = 0, up = 0, down = 0;
            for (int j = 0, k = n - 1; j < n; ++j, --k) {
                left = dp[i][j] > 0 ? left + 1 : 0;
                right = dp[i][k] > 0 ? right + 1 : 0;
                up = dp[j][i] > 0 ? up + 1 : 0;
                down = dp[k][i] > 0 ? down + 1 : 0;
                dp[i][j] = Math.min(dp[i][j], left);
                dp[i][k] = Math.min(dp[i][k], right);
                dp[j][i] = Math.min(dp[j][i], up);
                dp[k][i] = Math.min(dp[k][i], down);
            }
        }
        return Arrays.stream(dp).flatMapToInt(Arrays::stream).max().getAsInt();
    }
}
```

### Python

```python
# Largest Plus Sign：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def orderOfLargestPlusSign(self, n: int, mines: List[List[int]]) -> int:
        dp = [[n] * n for _ in range(n)]
        for x, y in mines:
            dp[x][y] = 0
        for i in range(n):
            left = right = up = down = 0
            for j, k in zip(range(n), reversed(range(n))):
                left = left + 1 if dp[i][j] else 0
                right = right + 1 if dp[i][k] else 0
                up = up + 1 if dp[j][i] else 0
                down = down + 1 if dp[k][i] else 0
                dp[i][j] = min(dp[i][j], left)
                dp[i][k] = min(dp[i][k], right)
                dp[j][i] = min(dp[j][i], up)
                dp[k][i] = min(dp[k][i], down)
        return max(max(v) for v in dp)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

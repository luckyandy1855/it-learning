# 0861. Score After Flipping Matrix

---
编号: 861
题目: Score After Flipping Matrix
难度: 中等
标签: [贪心, 位运算, 数组, 矩阵]
来源链接: https://leetcode.com/problems/score-after-flipping-matrix/
---

## 题目描述

给你一个大小为 `m x n` 的二元矩阵 `grid` ，矩阵中每个元素的值为 `0` 或 `1` 。

一次 **移动** 是指选择任一行或列，并转换该行或列中的每一个值：将所有 `0` 都更改为 `1`，将所有 `1` 都更改为 `0`。

在做出任意次数的移动后，将该矩阵的每一行都按照二进制数来解释，矩阵的 **得分** 就是这些数字的总和。

在执行任意次 **移动** 后（含 0 次），返回可能的最高分数。

示例 1：

```text
输入：grid = [[0,0,1,1],[1,0,1,0],[1,1,0,0]]
输出：39
解释：0b1111 + 0b1001 + 0b1111 = 15 + 9 + 15 = 39
```

示例 2：

```text
输入：grid = [[0]]
输出：1
```

**提示：**

- `m == grid.length`

- `n == grid[i].length`

- `1 <= m, n <= 20`

- `grid[i][j]` 为 `0` 或 `1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 位运算, 数组, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，对于任意一个翻转方案，翻转的次序不影响最后的结果。因此我们可以先考虑所有的行翻转，再考虑所有的列翻转。

每一行的数字要尽可能大，因此，我们遍历每一行，若行首元素为 $0$，则将该行进行翻转。

接下来，对于每一列 $j$，我们统计该列中 $0$ 和 $1$ 的数量，令 $cnt$ 为其中的最大值，则该列的贡献为 $cnt \times 2^{n - j - 1}$。对所有列的贡献进行累加，即可得到答案。

时间复杂度 $O(m \times n)$，空间复杂度 $O(1)$。其中 $m$, $n$ 分别为矩阵的行数和列数。

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
// Score After Flipping Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func matrixScore(grid [][]int) int {
	m, n := len(grid), len(grid[0])
	for i := 0; i < m; i++ {
		if grid[i][0] == 0 {
			for j := 0; j < n; j++ {
				grid[i][j] ^= 1
			}
		}
	}
	ans := 0
	for j := 0; j < n; j++ {
		cnt := 0
		for i := 0; i < m; i++ {
			cnt += grid[i][j]
		}
		if cnt < m-cnt {
			cnt = m - cnt
		}
		ans += cnt * (1 << (n - j - 1))
	}
	return ans
}
```

### Java

```java
// Score After Flipping Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int matrixScore(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        for (int i = 0; i < m; ++i) {
            if (grid[i][0] == 0) {
                for (int j = 0; j < n; ++j) {
                    grid[i][j] ^= 1;
                }
            }
        }
        int ans = 0;
        for (int j = 0; j < n; ++j) {
            int cnt = 0;
            for (int i = 0; i < m; ++i) {
                cnt += grid[i][j];
            }
            ans += Math.max(cnt, m - cnt) * (1 << (n - j - 1));
        }
        return ans;
    }
}
```

### Python

```python
# Score After Flipping Matrix：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def matrixScore(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        for i in range(m):
            if grid[i][0] == 0:
                for j in range(n):
                    grid[i][j] ^= 1
        ans = 0
        for j in range(n):
            cnt = sum(grid[i][j] for i in range(m))
            ans += max(cnt, m - cnt) * (1 << (n - j - 1))
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

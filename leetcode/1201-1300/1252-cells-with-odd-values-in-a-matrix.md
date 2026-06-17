# 1252. Cells with Odd Values in a Matrix

---
编号: 1252
题目: Cells with Odd Values in a Matrix
难度: 简单
标签: [数组, 数学, 模拟]
来源链接: https://leetcode.com/problems/cells-with-odd-values-in-a-matrix/
---

## 题目描述

给你一个 `m x n` 的矩阵，最开始的时候，每个单元格中的值都是 `0`。

另有一个二维索引数组 `indices`，`indices[i] = [ri, ci]` 指向矩阵中的某个位置，其中 `ri` 和 `ci` 分别表示指定的行和列（**从 `0` 开始编号**）。

对 `indices[i]` 所指向的每个位置，应同时执行下述增量操作：

- `ri` 行上的所有单元格，加 `1` 。

- `ci` 列上的所有单元格，加 `1` 。

给你 `m`、`n` 和 `indices` 。请你在执行完所有 `indices` 指定的增量操作后，返回矩阵中 **奇数值单元格** 的数目。

**示例 1：**

```text
输入：m = 2, n = 3, indices = [[0,1],[1,1]]
输出：6
解释：最开始的矩阵是 [[0,0,0],[0,0,0]]。
第一次增量操作后得到 [[1,2,1],[0,1,0]]。
最后的矩阵是 [[1,3,1],[1,3,1]]，里面有 6 个奇数。
```

**示例 2：**

```text
输入：m = 2, n = 2, indices = [[1,1],[0,0]]
输出：0
解释：最后的矩阵是 [[2,2],[2,2]]，里面没有奇数。
```

**提示：**

- `1 i i < n`

**进阶：**你可以设计一个时间复杂度为 `O(n + m + indices.length)` 且仅用 `O(n + m)` 额外空间的算法来解决此问题吗？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们创建一个矩阵 $g$ 来存放操作的结果。对于 $\textit{indices}$ 中的每一对 $(r_i, c_i)$，我们将矩阵第 $r_i$ 行的所有数加 $1$，第 $c_i$ 列的所有元素加 $1$。

模拟结束后，遍历矩阵，统计奇数的个数。

时间复杂度 $O(k \times (m + n) + m \times n)$，空间复杂度 $O(m \times n)$。其中 $k$ 为 $\textit{indices}$ 的长度。

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
// Cells with Odd Values in a Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func oddCells(m int, n int, indices [][]int) int {
	g := make([][]int, m)
	for i := range g {
		g[i] = make([]int, n)
	}
	for _, e := range indices {
		r, c := e[0], e[1]
		for i := 0; i < m; i++ {
			g[i][c]++
		}
		for j := 0; j < n; j++ {
			g[r][j]++
		}
	}
	ans := 0
	for _, row := range g {
		for _, v := range row {
			ans += v % 2
		}
	}
	return ans
}
```

### Java

```java
// Cells with Odd Values in a Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int oddCells(int m, int n, int[][] indices) {
        int[][] g = new int[m][n];
        for (int[] e : indices) {
            int r = e[0], c = e[1];
            for (int i = 0; i < m; ++i) {
                g[i][c]++;
            }
            for (int j = 0; j < n; ++j) {
                g[r][j]++;
            }
        }
        int ans = 0;
        for (int[] row : g) {
            for (int v : row) {
                ans += v % 2;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Cells with Odd Values in a Matrix：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def oddCells(self, m: int, n: int, indices: List[List[int]]) -> int:
        g = [[0] * n for _ in range(m)]
        for r, c in indices:
            for i in range(m):
                g[i][c] += 1
            for j in range(n):
                g[r][j] += 1
        return sum(v % 2 for row in g for v in row)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

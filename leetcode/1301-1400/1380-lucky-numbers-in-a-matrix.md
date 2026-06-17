# 1380. Lucky Numbers in a Matrix

---
编号: 1380
题目: Lucky Numbers in a Matrix
难度: 简单
标签: [数组, 矩阵]
来源链接: https://leetcode.com/problems/lucky-numbers-in-a-matrix/
---

## 题目描述

给你一个 `m x n` 的矩阵，矩阵中的数字 **各不相同** 。请你按 **任意** 顺序返回矩阵中的所有幸运数。

**幸运数** 是指矩阵中满足同时下列两个条件的元素：

- 在同一行的所有元素中最小

- 在同一列的所有元素中最大

示例 1：

```text
输入：matrix = [[3,7,8],[9,11,13],[15,16,17]]
输出：[15]
解释：15 是唯一的幸运数，因为它是其所在行中的最小值，也是所在列中的最大值。
```

示例 2：

```text
输入：matrix = [[1,10,4,2],[9,3,8,7],[15,16,17,12]]
输出：[12]
解释：12 是唯一的幸运数，因为它是其所在行中的最小值，也是所在列中的最大值。
```

示例 3：

```text
输入：matrix = [[7,8],[1,2]]
输出：[7]
解释：7 是唯一的幸运数字，因为它是行中的最小值，列中的最大值。
```

**提示：**

- `m == mat.length`

- `n == mat[i].length`

- `1 <= n, m <= 50`

- `1 <= matrix[i][j] <= 10^5`

- 矩阵中的所有元素都是不同的

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用两个数组 $rows$ 和 $cols$ 记录矩阵中每一行的最小值和每一列的最大值，然后遍历矩阵中的每一个元素，检查该元素是否为所在行的最小值且为所在列的最大值，如果是则该元素为幸运数，我们将其加入答案数组。

遍历结束后，我们返回答案数组即可。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m + n)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

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
// Lucky Numbers in a Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func luckyNumbers(matrix [][]int) (ans []int) {
	m, n := len(matrix), len(matrix[0])
	rows, cols := make([]int, m), make([]int, n)
	for i := range rows {
		rows[i] = 1 << 30
	}
	for i, row := range matrix {
		for j, x := range row {
			rows[i] = min(rows[i], x)
			cols[j] = max(cols[j], x)
		}
	}
	for i, row := range matrix {
		for j, x := range row {
			if rows[i] == cols[j] {
				ans = append(ans, x)
			}
		}
	}
	return
}
```

### Java

```java
// Lucky Numbers in a Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> luckyNumbers(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        int[] rows = new int[m];
        int[] cols = new int[n];
        Arrays.fill(rows, 1 << 30);
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                rows[i] = Math.min(rows[i], matrix[i][j]);
                cols[j] = Math.max(cols[j], matrix[i][j]);
            }
        }
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (rows[i] == cols[j]) {
                    ans.add(rows[i]);
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Lucky Numbers in a Matrix：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def luckyNumbers(self, matrix: List[List[int]]) -> List[int]:
        rows = {min(row) for row in matrix}
        cols = {max(col) for col in zip(*matrix)}
        return list(rows & cols)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

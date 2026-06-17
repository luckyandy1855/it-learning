# 1351. Count Negative Numbers in a Sorted Matrix

---
编号: 1351
题目: Count Negative Numbers in a Sorted Matrix
难度: 简单
标签: [数组, 二分查找, 矩阵]
来源链接: https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/
---

## 题目描述

给你一个 `m * n` 的矩阵 `grid`，矩阵中的元素无论是按行还是按列，都以非严格递减顺序排列。 请你统计并返回 `grid` 中 **负数** 的数目。

**示例 1：**

```text
输入：grid = [[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]
输出：8
解释：矩阵中共有 8 个负数。
```

**示例 2：**

```text
输入：grid = [[3,2],[1,0]]
输出：0
```

**提示：**

- `m == grid.length`

- `n == grid[i].length`

- `1 <= m, n <= 100`

- `-100 <= grid[i][j] <= 100`

**进阶：**你可以设计一个时间复杂度为 `O(n + m)` 的解决方案吗？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于矩阵是按行和按列非严格递减排序的，我们可以从矩阵的左下角开始遍历，记当前位置为 $(i, j)$。

如果当前位置的元素大于等于 $0$，说明该行的前面所有元素也都大于等于 $0$，因此我们将列索引 $j$ 向右移动一位，即 $j = j + 1$。

如果当前位置的元素小于 $0$，说明该列的当前元素以及其右侧的所有元素都是负数，因此我们可以将负数的数量增加 $n - j$（其中 $n$ 是矩阵的列数），然后将行索引 $i$ 向上移动一位，即 $i = i - 1$。

我们重复上述过程，直到行索引 $i$ 小于 $0$ 或列索引 $j$ 大于等于 $n$。最终，负数的数量即为答案。

时间复杂度 $O(m + n)$，其中 $m$ 和 $n$ 分别是矩阵的行数和列数。空间复杂度 $O(1)$。

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
// Count Negative Numbers in a Sorted Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countNegatives(grid [][]int) (ans int) {
	m := len(grid)
	n := len(grid[0])
	i := m - 1
	j := 0
	for i >= 0 && j < n {
		if grid[i][j] >= 0 {
			j++
		} else {
			ans += n - j
			i--
		}
	}
	return
}
```

### Java

```java
// Count Negative Numbers in a Sorted Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int countNegatives(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        int i = m - 1;
        int j = 0;
        int ans = 0;
        while (i >= 0 && j < n) {
            if (grid[i][j] >= 0) {
                j++;
            } else {
                ans += n - j;
                i--;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Count Negative Numbers in a Sorted Matrix：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countNegatives(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        i, j = m - 1, 0
        ans = 0
        while i >= 0 and j < n:
            if grid[i][j] >= 0:
                j += 1
            else:
                ans += n - j
                i -= 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

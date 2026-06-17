# 0750. Number Of Corner Rectangles

---
编号: 750
题目: Number Of Corner Rectangles
难度: 中等
标签: [数组, 数学, 动态规划, 矩阵]
来源链接: https://leetcode.com/problems/number-of-corner-rectangles/
---

## 题目描述

给定一个只包含 `0` 和 `1` 的 `m x n` 整数矩阵 `grid` ，返回 *其中 「**角矩形 」**的数量* 。

一个**「角矩形」**是由四个不同的在矩阵上的 `1` 形成的 **轴对齐 **的矩形。注意只有角的位置才需要为 `1`。

**注意：**4 个 `1` 的位置需要是不同的。

**示例 1：**

```text
输入：grid = [[1,0,0,1,0],[0,0,1,0,1],[0,0,0,1,0],[1,0,1,0,1]]
输出：1
解释：只有一个角矩形，角的位置为 grid[1][2], grid[1][4], grid[3][2], grid[3][4]。
```

**示例 2：**

```text
输入：grid = [[1,1,1],[1,1,1],[1,1,1]]
输出：9
解释：这里有 4 个 2x2 的矩形，4 个 2x3 和 3x2 的矩形和 1 个 3x3 的矩形。
```

**示例 3：**

```text
输入：grid = [[1,1,1,1]]
输出：0
解释：矩形必须有 4 个不同的角。
```

**提示：**

- `m == grid.length`

- `n == grid[i].length`

- `1 <= m, n <= 200`

- `grid[i][j]` 不是 `0` 就是 `1`

- 网格中 `1` 的个数在 `[1, 6000]` 范围内

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 动态规划, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们枚举每一行作为矩形的下边，对于当前行，如果列 $i$ 和列 $j$ 都是 $1$，那么我们用哈希表找出此前的所有行中，有多少行的 $i$ 和 $j$ 列都是 $1$，那么就有多少个以 $(i, j)$ 为右下角的矩形，我们将其数量加入答案。然后将 $(i, j)$ 加入哈希表，继续枚举下一对 $(i, j)$。

时间复杂度 $O(m \times n^2)$，空间复杂度 $O(n^2)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

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
// Number Of Corner Rectangles：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countCornerRectangles(grid [][]int) (ans int) {
	n := len(grid[0])
	type pair struct{ x, y int }
	cnt := map[pair]int{}
	for _, row := range grid {
		for i, x := range row {
			if x == 1 {
				for j := i + 1; j < n; j++ {
					if row[j] == 1 {
						t := pair{i, j}
						ans += cnt[t]
						cnt[t]++
					}
				}
			}
		}
	}
	return
}
```

### Java

```java
// Number Of Corner Rectangles：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int countCornerRectangles(int[][] grid) {
        int n = grid[0].length;
        int ans = 0;
        Map<List<Integer>, Integer> cnt = new HashMap<>();
        for (var row : grid) {
            for (int i = 0; i < n; ++i) {
                if (row[i] == 1) {
                    for (int j = i + 1; j < n; ++j) {
                        if (row[j] == 1) {
                            List<Integer> t = List.of(i, j);
                            ans += cnt.getOrDefault(t, 0);
                            cnt.merge(t, 1, Integer::sum);
                        }
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
# Number Of Corner Rectangles：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countCornerRectangles(self, grid: List[List[int]]) -> int:
        ans = 0
        cnt = Counter()
        n = len(grid[0])
        for row in grid:
            for i, c1 in enumerate(row):
                if c1:
                    for j in range(i + 1, n):
                        if row[j]:
                            ans += cnt[(i, j)]
                            cnt[(i, j)] += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

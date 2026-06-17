# 1030. Matrix Cells in Distance Order

---
编号: 1030
题目: Matrix Cells in Distance Order
难度: 简单
标签: [几何, 数组, 数学, 矩阵, 排序]
来源链接: https://leetcode.com/problems/matrix-cells-in-distance-order/
---

## 题目描述

给定四个整数 `rows` ,   `cols` ,  `rCenter` 和 `cCenter` 。有一个 `rows x cols` 的矩阵，你在单元格上的坐标是 `(rCenter, cCenter)` 。

返回矩阵中的所有单元格的坐标，并按与* *`(rCenter, cCenter)`* *的 **距离** 从最小到最大的顺序排。你可以按 **任何** 满足此条件的顺序返回答案。

单元格`(r1, c1)` 和 `(r2, c2)` 之间的距离为`|r1 - r2| + |c1 - c2|`。

**示例 1：**

```text
输入：rows = 1, cols = 2, rCenter = 0, cCenter = 0
输出：[[0,0],[0,1]]
解释：从 (r0, c0) 到其他单元格的距离为：[0,1]
```

**示例 2：**

```text
输入：rows = 2, cols = 2, rCenter = 0, cCenter = 1
输出：[[0,1],[0,0],[1,1],[1,0]]
解释：从 (r0, c0) 到其他单元格的距离为：[0,1,1,2]
[[0,1],[1,1],[0,0],[1,0]] 也会被视作正确答案。
```

**示例 3：**

```text
输入：rows = 2, cols = 3, rCenter = 1, cCenter = 2
输出：[[1,2],[0,2],[1,1],[0,1],[1,0],[0,0]]
解释：从 (r0, c0) 到其他单元格的距离为：[0,1,1,2,2,3]
其他满足题目要求的答案也会被视为正确，例如 [[1,2],[1,1],[0,2],[1,0],[0,1],[0,0]]。
```

**提示：**

- `1 <= rows, cols <= 100`

- `0 <= rCenter < rows`

- `0 <= cCenter < cols`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「几何, 数组, 数学, 矩阵, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个队列 $q$，初始时将坐标点 $(rCenter, cCenter)$ 入队，用一个二维布尔数组 $vis$ 记录已经访问过的点，初始时 $vis[rCenter][cCenter]$ 为 $true$。

接下来，我们不断地从队列中取出一个点，将其加入答案数组，然后将其上下左右四个相邻点加入队列，注意要判断这些点是否已经访问过，如果没有访问过，就将其标记为已访问，并将其加入队列。一直重复这个过程，直到队列为空，此时答案数组中的点就是按照距离从小到大的顺序排列的。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

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
// Matrix Cells in Distance Order：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func allCellsDistOrder(rows int, cols int, rCenter int, cCenter int) (ans [][]int) {
	q := [][]int{{rCenter, cCenter}}
	vis := make([][]bool, rows)
	for i := range vis {
		vis[i] = make([]bool, cols)
	}
	vis[rCenter][cCenter] = true
	dirs := [5]int{-1, 0, 1, 0, -1}
	for len(q) > 0 {
		for n := len(q); n > 0; n-- {
			p := q[0]
			q = q[1:]
			ans = append(ans, p)
			for k := 0; k < 4; k++ {
				x, y := p[0]+dirs[k], p[1]+dirs[k+1]
				if x >= 0 && x < rows && y >= 0 && y < cols && !vis[x][y] {
					vis[x][y] = true
					q = append(q, []int{x, y})
				}
			}
		}
	}
	return
}
```

### Java

```java
// Matrix Cells in Distance Order：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[][] allCellsDistOrder(int rows, int cols, int rCenter, int cCenter) {
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[] {rCenter, cCenter});
        boolean[][] vis = new boolean[rows][cols];
        vis[rCenter][cCenter] = true;
        int[][] ans = new int[rows * cols][2];
        int[] dirs = {-1, 0, 1, 0, -1};
        int idx = 0;
        while (!q.isEmpty()) {
            for (int n = q.size(); n > 0; --n) {
                var p = q.poll();
                ans[idx++] = p;
                for (int k = 0; k < 4; ++k) {
                    int x = p[0] + dirs[k], y = p[1] + dirs[k + 1];
                    if (x >= 0 && x < rows && y >= 0 && y < cols && !vis[x][y]) {
                        vis[x][y] = true;
                        q.offer(new int[] {x, y});
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
# Matrix Cells in Distance Order：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def allCellsDistOrder(
        self, rows: int, cols: int, rCenter: int, cCenter: int
    ) -> List[List[int]]:
        q = deque([[rCenter, cCenter]])
        vis = [[False] * cols for _ in range(rows)]
        vis[rCenter][cCenter] = True
        ans = []
        while q:
            for _ in range(len(q)):
                p = q.popleft()
                ans.append(p)
                for a, b in pairwise((-1, 0, 1, 0, -1)):
                    x, y = p[0] + a, p[1] + b
                    if 0 <= x < rows and 0 <= y < cols and not vis[x][y]:
                        vis[x][y] = True
                        q.append([x, y])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

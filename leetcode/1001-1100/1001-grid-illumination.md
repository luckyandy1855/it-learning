# 1001. Grid Illumination

---
编号: 1001
题目: Grid Illumination
难度: 困难
标签: [数组, 哈希表]
来源链接: https://leetcode.com/problems/grid-illumination/
---

## 题目描述

在大小为 `n x n` 的网格 `grid` 上，每个单元格都有一盏灯，最初灯都处于 **关闭** 状态。

给你一个由灯的位置组成的二维数组 `lamps` ，其中 `lamps[i] = [rowi, coli]` 表示 **打开** 位于 `grid[rowi][coli]` 的灯。即便同一盏灯可能在 `lamps` 中多次列出，不会影响这盏灯处于 **打开** 状态。

当一盏灯处于打开状态，它将会照亮 **自身所在单元格** 以及同一 **行** 、同一 **列** 和两条 **对角线** 上的 **所有其他单元格** 。

另给你一个二维数组 `queries` ，其中 `queries[j] = [rowj, colj]` 。对于第 `j` 个查询，如果单元格 `[rowj, colj]` 是被照亮的，则查询结果为 `1` ，否则为 `0` 。在第 `j` 次查询之后 [按照查询的顺序] ，**关闭** 位于单元格 `grid[rowj][colj]` 上及相邻 8 个方向上（与单元格 `grid[rowi][coli]` 共享角或边）的任何灯。

返回一个整数数组 `ans` 作为答案， `ans[j]` 应等于第 `j` 次查询 `queries[j]` 的结果，`1` 表示照亮，`0` 表示未照亮。

**示例 1：**

```text
输入：n = 5, lamps = [[0,0],[4,4]], queries = [[1,1],[1,0]]
输出：[1,0]
解释：最初所有灯都是关闭的。在执行查询之前，打开位于 [0, 0] 和 [4, 4] 的灯。第 0 次查询检查 grid[1][1] 是否被照亮（蓝色方框）。该单元格被照亮，所以 ans[0] = 1 。然后，关闭红色方框中的所有灯。

第 1 次查询检查 grid[1][0] 是否被照亮（蓝色方框）。该单元格没有被照亮，所以 ans[1] = 0 。然后，关闭红色矩形中的所有灯。
```

**示例 2：**

```text
输入：n = 5, lamps = [[0,0],[4,4]], queries = [[1,1],[1,1]]
输出：[1,1]
```

**示例 3：**

```text
输入：n = 5, lamps = [[0,0],[0,4]], queries = [[0,4],[0,1],[1,4]]
输出：[1,1,0]
```

**提示：**

- `1 i, coli j, colj < n`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

假设一盏灯的坐标为 $(x, y)$，那么它所在的行的数值为 $x$，列的数值为 $y$，正对角线的数值为 $x-y$，反对角线的数值为 $x+y$。确定某一直线的唯一数值标识后，我们就可以通过哈希表来记录某一直线所拥有的灯的数目。

我们遍历数组 $\textit{lamps}$，将当前遍历到的灯所在的行、列和正、反对角线拥有灯的数目分别加 $1$。

注意，在处理 $\textit{lamps}$ 时，需要进行去重，因为我们将重复的灯看作同一盏灯。

接下来，我们遍历 queries，判断当前查询点所在的行，列和正、反对角线是否有灯，如果有，则置 $1$，即该点在查询时是被照亮的。然后进行关闭操作，查找查询点所在的八近邻点及它本身是否有灯，如果有，将该点所在的行、列和正、反对角线的灯数目分别减 $1$，并且将灯从网格中去掉。

最后，返回答案数组即可。

时间复杂度 $O(m + q)$，其中 $m$ 和 $q$ 分别为数组 $\textit{lamps}$ 和 $\textit{queries}$ 的长度。

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
// Grid Illumination：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func gridIllumination(n int, lamps [][]int, queries [][]int) []int {
	row, col, diag1, diag2 := map[int]int{}, map[int]int{}, map[int]int{}, map[int]int{}
	type pair struct{ x, y int }
	s := map[pair]bool{}
	for _, lamp := range lamps {
		i, j := lamp[0], lamp[1]
		p := pair{i, j}
		if !s[p] {
			s[p] = true
			row[i]++
			col[j]++
			diag1[i-j]++
			diag2[i+j]++
		}
	}
	m := len(queries)
	ans := make([]int, m)
	for k, q := range queries {
		i, j := q[0], q[1]
		if row[i] > 0 || col[j] > 0 || diag1[i-j] > 0 || diag2[i+j] > 0 {
			ans[k] = 1
		}
		for x := i - 1; x <= i+1; x++ {
			for y := j - 1; y <= j+1; y++ {
				p := pair{x, y}
				if s[p] {
					s[p] = false
					row[x]--
					col[y]--
					diag1[x-y]--
					diag2[x+y]--
				}
			}
		}
	}
	return ans
}
```

### Java

```java
// Grid Illumination：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;
    public int[] gridIllumination(int n, int[][] lamps, int[][] queries) {
        this.n = n;
        Set<Long> s = new HashSet<>();
        Map<Integer, Integer> row = new HashMap<>();
        Map<Integer, Integer> col = new HashMap<>();
        Map<Integer, Integer> diag1 = new HashMap<>();
        Map<Integer, Integer> diag2 = new HashMap<>();
        for (var lamp : lamps) {
            int i = lamp[0], j = lamp[1];
            if (s.add(f(i, j))) {
                merge(row, i, 1);
                merge(col, j, 1);
                merge(diag1, i - j, 1);
                merge(diag2, i + j, 1);
            }
        }
        int m = queries.length;
        int[] ans = new int[m];
        for (int k = 0; k < m; ++k) {
            int i = queries[k][0], j = queries[k][1];
            if (exist(row, i) || exist(col, j) || exist(diag1, i - j) || exist(diag2, i + j)) {
                ans[k] = 1;
            }
            for (int x = i - 1; x <= i + 1; ++x) {
                for (int y = j - 1; y <= j + 1; ++y) {
                    if (x < 0 || x >= n || y < 0 || y >= n || !s.contains(f(x, y))) {
                        continue;
                    }
                    s.remove(f(x, y));
                    merge(row, x, -1);
                    merge(col, y, -1);
                    merge(diag1, x - y, -1);
                    merge(diag2, x + y, -1);
                }
            }
        }
        return ans;
    }

    private void merge(Map<Integer, Integer> cnt, int x, int d) {
        if (cnt.merge(x, d, Integer::sum) == 0) {
            cnt.remove(x);
        }
    }

    private boolean exist(Map<Integer, Integer> cnt, int x) {
        return cnt.getOrDefault(x, 0) > 0;
    }

    private long f(long i, long j) {
        return i * n + j;
    }
}
```

### Python

```python
# Grid Illumination：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def gridIllumination(
        self, n: int, lamps: List[List[int]], queries: List[List[int]]
    ) -> List[int]:
        s = {(i, j) for i, j in lamps}
        row, col, diag1, diag2 = Counter(), Counter(), Counter(), Counter()
        for i, j in s:
            row[i] += 1
            col[j] += 1
            diag1[i - j] += 1
            diag2[i + j] += 1
        ans = [0] * len(queries)
        for k, (i, j) in enumerate(queries):
            if row[i] or col[j] or diag1[i - j] or diag2[i + j]:
                ans[k] = 1
            for x in range(i - 1, i + 2):
                for y in range(j - 1, j + 2):
                    if (x, y) in s:
                        s.remove((x, y))
                        row[x] -= 1
                        col[y] -= 1
                        diag1[x - y] -= 1
                        diag2[x + y] -= 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

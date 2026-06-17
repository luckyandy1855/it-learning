# 0840. Magic Squares In Grid

---
编号: 840
题目: Magic Squares In Grid
难度: 中等
标签: [数组, 哈希表, 数学, 矩阵]
来源链接: https://leetcode.com/problems/magic-squares-in-grid/
---

## 题目描述

`3 x 3` 的幻方是一个填充有 **从 `1` 到 `9` ** 的不同数字的 `3 x 3` 矩阵，其中每行，每列以及两条对角线上的各数之和都相等。

给定一个由整数组成的`row x col` 的 `grid`，其中有多少个 `3 × 3` 的 “幻方” 子矩阵？

注意：虽然幻方只能包含 1 到 9 的数字，但 `grid` 可以包含最多15的数字。

**示例 1：**

```text
输入: grid = [[4,3,8,4],[9,5,1,9],[2,7,6,2]
输出: 1
解释:
下面的子矩阵是一个 3 x 3 的幻方：

而这一个不是：

总的来说，在本示例所给定的矩阵中只有一个 3 x 3 的幻方子矩阵。
```

**示例 2:**

```text
输入: grid = [[8]]
输出: 0
```

**提示:**

- `row == grid.length`

- `col == grid[i].length`

- `1 <= row, col <= 10`

- `0 <= grid[i][j] <= 15`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 数学, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们直接枚举每个 $3 \times 3$ 子矩阵的左上角坐标 $(i, j)$，然后判断该子矩阵是否满足“幻方矩阵”，若是，答案加一。枚举结束后，返回答案即可。

时间复杂度 $O(m \times n)$，其中 $m$ 和 $n$ 分别是矩阵的行数和列数。空间复杂度 $O(1)$。

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
// Magic Squares In Grid：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numMagicSquaresInside(grid [][]int) (ans int) {
	m, n := len(grid), len(grid[0])
	check := func(i, j int) int {
		if i+3 > m || j+3 > n {
			return 0
		}
		cnt := [16]int{}
		row := [3]int{}
		col := [3]int{}
		a, b := 0, 0
		for x := i; x < i+3; x++ {
			for y := j; y < j+3; y++ {
				v := grid[x][y]
				if v < 1 || v > 9 || cnt[v] > 0 {
					return 0
				}
				cnt[v]++
				row[x-i] += v
				col[y-j] += v
				if x-i == y-j {
					a += v
				}
				if x-i == 2-(y-j) {
					b += v
				}
			}
		}
		if a != b {
			return 0
		}
		for k := 0; k < 3; k++ {
			if row[k] != a || col[k] != a {
				return 0
			}
		}
		return 1
	}
	for i := 0; i < m; i++ {
		for j := 0; j < n; j++ {
			ans += check(i, j)
		}
	}
	return
}
```

### Java

```java
// Magic Squares In Grid：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int m;
    private int n;
    private int[][] grid;

    public int numMagicSquaresInside(int[][] grid) {
        m = grid.length;
        n = grid[0].length;
        this.grid = grid;
        int ans = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                ans += check(i, j);
            }
        }
        return ans;
    }

    private int check(int i, int j) {
        if (i + 3 > m || j + 3 > n) {
            return 0;
        }
        int[] cnt = new int[16];
        int[] row = new int[3];
        int[] col = new int[3];
        int a = 0, b = 0;
        for (int x = i; x < i + 3; ++x) {
            for (int y = j; y < j + 3; ++y) {
                int v = grid[x][y];
                if (v < 1 || v > 9 || ++cnt[v] > 1) {
                    return 0;
                }
                row[x - i] += v;
                col[y - j] += v;
                if (x - i == y - j) {
                    a += v;
                }
                if (x - i + y - j == 2) {
                    b += v;
                }
            }
        }
        if (a != b) {
            return 0;
        }
        for (int k = 0; k < 3; ++k) {
            if (row[k] != a || col[k] != a) {
                return 0;
            }
        }
        return 1;
    }
}
```

### Python

```python
# Magic Squares In Grid：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numMagicSquaresInside(self, grid: List[List[int]]) -> int:
        def check(i: int, j: int) -> int:
            if i + 3 > m or j + 3 > n:
                return 0
            s = set()
            row = [0] * 3
            col = [0] * 3
            a = b = 0
            for x in range(i, i + 3):
                for y in range(j, j + 3):
                    v = grid[x][y]
                    if v < 1 or v > 9:
                        return 0
                    s.add(v)
                    row[x - i] += v
                    col[y - j] += v
                    if x - i == y - j:
                        a += v
                    if x - i == 2 - (y - j):
                        b += v
            if len(s) != 9 or a != b:
                return 0
            if any(x != a for x in row) or any(x != a for x in col):
                return 0
            return 1

        m, n = len(grid), len(grid[0])
        return sum(check(i, j) for i in range(m) for j in range(n))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

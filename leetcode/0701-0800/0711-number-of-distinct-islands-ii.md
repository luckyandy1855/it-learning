# 0711. Number of Distinct Islands II

---
编号: 711
题目: Number of Distinct Islands II
难度: 困难
标签: [深度优先搜索, 广度优先搜索, 并查集, 数组, 哈希表, 矩阵, 排序, 哈希函数]
来源链接: https://leetcode.com/problems/number-of-distinct-islands-ii/
---

## 题目描述

给定一个 `m x n` 二进制数组表示的网格 `grid` ，一个岛屿由 **四连通** （上、下、左、右四个方向）的 `1` 组成（代表陆地）。你可以认为网格的四周被海水包围。

如果两个岛屿的形状相同，或者通过旋转（顺时针旋转 90°，180°，270°）、翻转（左右翻转、上下翻转）后形状相同，那么就认为这两个岛屿是相同的。

返回 *这个网格中形状 **不同** 的岛屿的数量 *。

**示例 1:**

```text
输入: grid = [[1,1,0,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,1,1]]
输出: 1
解释: 这两个是相同的岛屿。因为我们通过 180° 旋转第一个岛屿，两个岛屿的形状相同。
```

**示例 2:**

```text
输入: grid = [[1,1,0,0,0],[1,1,0,0,0],[0,0,0,1,1],[0,0,0,1,1]]
输出: 1
```

**提示:**

- `m == grid.length`

- `n == grid[i].length`

- `1 <= m, n <= 50`

- `grid[i][j]` 不是 `0` 就是 `1`.

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 并查集, 数组, 哈希表, 矩阵, 排序, 哈希函数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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

### Java

```java
// Number of Distinct Islands II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int m;
    private int n;
    private int[][] grid;

    public int numDistinctIslands2(int[][] grid) {
        m = grid.length;
        n = grid[0].length;
        this.grid = grid;
        Set<List<List<Integer>>> s = new HashSet<>();
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 1) {
                    List<Integer> shape = new ArrayList<>();
                    dfs(i, j, shape);
                    s.add(normalize(shape));
                }
            }
        }
        return s.size();
    }

    private List<List<Integer>> normalize(List<Integer> shape) {
        List<int[]>[] shapes = new List[8];
        for (int i = 0; i < 8; ++i) {
            shapes[i] = new ArrayList<>();
        }
        for (int e : shape) {
            int i = e / n;
            int j = e % n;
            shapes[0].add(new int[] {i, j});
            shapes[1].add(new int[] {i, -j});
            shapes[2].add(new int[] {-i, j});
            shapes[3].add(new int[] {-i, -j});
            shapes[4].add(new int[] {j, i});
            shapes[5].add(new int[] {j, -i});
            shapes[6].add(new int[] {-j, i});
            shapes[7].add(new int[] {-j, -i});
        }
        for (List<int[]> e : shapes) {
            e.sort((a, b) -> {
                int i1 = a[0];
                int j1 = a[1];
                int i2 = b[0];
                int j2 = b[1];
                if (i1 == i2) {
                    return j1 - j2;
                }
                return i1 - i2;
            });
            int a = e.get(0)[0];
            int b = e.get(0)[1];
            for (int k = e.size() - 1; k >= 0; --k) {
                int i = e.get(k)[0];
                int j = e.get(k)[1];
                e.set(k, new int[] {i - a, j - b});
            }
        }
        Arrays.sort(shapes, (a, b) -> {
            for (int k = 0; k < a.size(); ++k) {
                int i1 = a.get(k)[0];
                int j1 = a.get(k)[1];
                int i2 = b.get(k)[0];
                int j2 = b.get(k)[1];
                if (i1 != i2) {
                    return i1 - i2;
                }
                if (j1 != j2) {
                    return j1 - j2;
                }
            }
            return 0;
        });
        List<List<Integer>> ans = new ArrayList<>();
        for (int[] e : shapes[0]) {
            ans.add(Arrays.asList(e[0], e[1]));
        }
        return ans;
    }

    private void dfs(int i, int j, List<Integer> shape) {
        shape.add(i * n + j);
        grid[i][j] = 0;
        int[] dirs = {-1, 0, 1, 0, -1};
        for (int k = 0; k < 4; ++k) {
            int x = i + dirs[k];
            int y = j + dirs[k + 1];
            if (x >= 0 && x < m && y >= 0 && y < n && grid[x][y] == 1) {
                dfs(x, y, shape);
            }
        }
    }
}
```

### Python

```python
# Number of Distinct Islands II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numDistinctIslands2(self, grid: List[List[int]]) -> int:
        def dfs(i, j, shape):
            shape.append([i, j])
            grid[i][j] = 0
            for a, b in [[1, 0], [-1, 0], [0, 1], [0, -1]]:
                x, y = i + a, j + b
                if 0 <= x < m and 0 <= y < n and grid[x][y] == 1:
                    dfs(x, y, shape)

        def normalize(shape):
            shapes = [[] for _ in range(8)]
            for i, j in shape:
                shapes[0].append([i, j])
                shapes[1].append([i, -j])
                shapes[2].append([-i, j])
                shapes[3].append([-i, -j])
                shapes[4].append([j, i])
                shapes[5].append([j, -i])
                shapes[6].append([-j, i])
                shapes[7].append([-j, -i])
            for e in shapes:
                e.sort()
                for i in range(len(e) - 1, -1, -1):
                    e[i][0] -= e[0][0]
                    e[i][1] -= e[0][1]
            shapes.sort()
            return tuple(tuple(e) for e in shapes[0])

        m, n = len(grid), len(grid[0])
        s = set()
        for i in range(m):
            for j in range(n):
                if grid[i][j]:
                    shape = []
                    dfs(i, j, shape)
                    s.add(normalize(shape))
        return len(s)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

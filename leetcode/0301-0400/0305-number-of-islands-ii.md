# 0305. Number of Islands II

---
编号: 305
题目: Number of Islands II
难度: 困难
标签: [并查集, 数组, 哈希表]
来源链接: https://leetcode.com/problems/number-of-islands-ii/
---

## 题目描述

给你一个大小为 `m x n` 的二维二进制网格 `grid` 。网格表示一个地图，其中，`0` 表示水，`1` 表示陆地。最初，`grid` 中的所有单元格都是水单元格（即，所有单元格都是 `0`）。

可以通过执行 `addLand` 操作，将某个位置的水转换成陆地。给你一个数组 `positions` ，其中 `positions[i] = [ri, ci]` 是要执行第 `i` 次操作的位置 `(ri, ci)` 。

返回一个整数数组 `answer` ，其中 `answer[i]` 是将单元格 `(ri, ci)` 转换为陆地后，地图中岛屿的数量。

**岛屿** 的定义是被「水」包围的「陆地」，通过水平方向或者垂直方向上相邻的陆地连接而成。你可以假设地图网格的四边均被无边无际的「水」所包围。

示例 1：

```text
输入：m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]
输出：[1,1,2,3]
解释：
起初，二维网格 grid 被全部注入「水」。（0 代表「水」，1 代表「陆地」）
- 操作 #1：addLand(0, 0) 将 grid[0][0] 的水变为陆地。此时存在 1 个岛屿。
- 操作 #2：addLand(0, 1) 将 grid[0][1] 的水变为陆地。此时存在 1 个岛屿。
- 操作 #3：addLand(1, 2) 将 grid[1][2] 的水变为陆地。此时存在 2 个岛屿。
- 操作 #4：addLand(2, 1) 将 grid[2][1] 的水变为陆地。此时存在 3 个岛屿。
```

示例 2：

```text
输入：m = 1, n = 1, positions = [[0,0]]
输出：[1]
```

**提示：**

	- `1 i i < n`

**进阶：**你可以设计一个时间复杂度 `O(k log(mn))` 的算法解决此问题吗？（其中 `k == positions.length`）

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「并查集, 数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个二维数组 $grid$ 来表示一个地图，其中 $0$ 和 $1$ 分别表示水和陆地。初始时 $grid$ 中的所有单元格都是水单元格（即所有单元格都是 $0$），用一个变量 $cnt$ 来记录岛屿的数量。而岛屿之间的连通关系可以用一个并查集 $uf$ 来维护。

接下来，我们遍历数组 $positions$ 中的每个位置 $(i, j)$，如果 $grid[i][j]$ 为 $1$，说明该位置已经是陆地，我们直接将 $cnt$ 添加到答案中；否则，我们将 $grid[i][j]$ 的值改为 $1$，并且将 $cnt$ 的值增加 $1$。然后，我们遍历该位置的上下左右四个方向，如果某个方向的位置为 $1$，并且该位置与 $(i, j)$ 不属于同一个连通分量，那么我们就将该位置与 $(i, j)$ 进行合并，同时将 $cnt$ 的值减少 $1$。遍历完该位置的上下左右四个方向之后，我们将 $cnt$ 添加到答案中。

时间复杂度 $O(k \times \alpha(m \times n))$ 或 $O(k \times \log(m \times n))$，其中 $k$ 是 $positions$ 的长度，而 $\alpha$ 是阿克曼函数的反函数，本题中 $\alpha(m \times n)$ 可以认为是一个很小的常数。

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
// Number of Islands II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type unionFind struct {
	p, size []int
}

func newUnionFind(n int) *unionFind {
	p := make([]int, n)
	size := make([]int, n)
	for i := range p {
		p[i] = i
		size[i] = 1
	}
	return &unionFind{p, size}
}

func (uf *unionFind) find(x int) int {
	if uf.p[x] != x {
		uf.p[x] = uf.find(uf.p[x])
	}
	return uf.p[x]
}

func (uf *unionFind) union(a, b int) bool {
	pa, pb := uf.find(a), uf.find(b)
	if pa == pb {
		return false
	}
	if uf.size[pa] > uf.size[pb] {
		uf.p[pb] = pa
		uf.size[pa] += uf.size[pb]
	} else {
		uf.p[pa] = pb
		uf.size[pb] += uf.size[pa]
	}
	return true
}

func numIslands2(m int, n int, positions [][]int) (ans []int) {
	uf := newUnionFind(m * n)
	grid := make([][]int, m)
	for i := range grid {
		grid[i] = make([]int, n)
	}
	dirs := [5]int{-1, 0, 1, 0, -1}
	cnt := 0
	for _, p := range positions {
		i, j := p[0], p[1]
		if grid[i][j] == 1 {
			ans = append(ans, cnt)
			continue
		}
		grid[i][j] = 1
		cnt++
		for k := 0; k < 4; k++ {
			x, y := i+dirs[k], j+dirs[k+1]
			if x >= 0 && x < m && y >= 0 && y < n && grid[x][y] == 1 && uf.union(i*n+j, x*n+y) {
				cnt--
			}
		}
		ans = append(ans, cnt)
	}
	return
}
```

### Java

```java
// Number of Islands II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class UnionFind {
    private final int[] p;
    private final int[] size;

    public UnionFind(int n) {
        p = new int[n];
        size = new int[n];
        for (int i = 0; i < n; ++i) {
            p[i] = i;
            size[i] = 1;
        }
    }

    public int find(int x) {
        if (p[x] != x) {
            p[x] = find(p[x]);
        }
        return p[x];
    }

    public boolean union(int a, int b) {
        int pa = find(a), pb = find(b);
        if (pa == pb) {
            return false;
        }
        if (size[pa] > size[pb]) {
            p[pb] = pa;
            size[pa] += size[pb];
        } else {
            p[pa] = pb;
            size[pb] += size[pa];
        }
        return true;
    }
}

class Solution {
    public List<Integer> numIslands2(int m, int n, int[][] positions) {
        int[][] grid = new int[m][n];
        UnionFind uf = new UnionFind(m * n);
        int[] dirs = {-1, 0, 1, 0, -1};
        int cnt = 0;
        List<Integer> ans = new ArrayList<>();
        for (var p : positions) {
            int i = p[0], j = p[1];
            if (grid[i][j] == 1) {
                ans.add(cnt);
                continue;
            }
            grid[i][j] = 1;
            ++cnt;
            for (int k = 0; k < 4; ++k) {
                int x = i + dirs[k], y = j + dirs[k + 1];
                if (x >= 0 && x < m && y >= 0 && y < n && grid[x][y] == 1
                    && uf.union(i * n + j, x * n + y)) {
                    --cnt;
                }
            }
            ans.add(cnt);
        }
        return ans;
    }
}
```

### Python

```python
# Number of Islands II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class UnionFind:
    def __init__(self, n: int):
        self.p = list(range(n))
        self.size = [1] * n

    def find(self, x: int):
        if self.p[x] != x:
            self.p[x] = self.find(self.p[x])
        return self.p[x]

    def union(self, a: int, b: int) -> bool:
        pa, pb = self.find(a - 1), self.find(b - 1)
        if pa == pb:
            return False
        if self.size[pa] > self.size[pb]:
            self.p[pb] = pa
            self.size[pa] += self.size[pb]
        else:
            self.p[pa] = pb
            self.size[pb] += self.size[pa]
        return True


class Solution:
    def numIslands2(self, m: int, n: int, positions: List[List[int]]) -> List[int]:
        uf = UnionFind(m * n)
        grid = [[0] * n for _ in range(m)]
        ans = []
        dirs = (-1, 0, 1, 0, -1)
        cnt = 0
        for i, j in positions:
            if grid[i][j]:
                ans.append(cnt)
                continue
            grid[i][j] = 1
            cnt += 1
            for a, b in pairwise(dirs):
                x, y = i + a, j + b
                if (
                    0 <= x < m
                    and 0 <= y < n
                    and grid[x][y]
                    and uf.union(i * n + j, x * n + y)
                ):
                    cnt -= 1
            ans.append(cnt)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

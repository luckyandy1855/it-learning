# 1036. Escape a Large Maze

---
编号: 1036
题目: Escape a Large Maze
难度: 困难
标签: [深度优先搜索, 广度优先搜索, 数组, 哈希表]
来源链接: https://leetcode.com/problems/escape-a-large-maze/
---

## 题目描述

在一个 10^6 x 10^6 的网格中，每个网格上方格的坐标为 `(x, y)` 。

现在从源方格 `source = [sx, sy]` 开始出发，意图赶往目标方格 `target = [tx, ty]` 。数组 `blocked` 是封锁的方格列表，其中每个 `blocked[i] = [xi, yi]` 表示坐标为 `(xi, yi)` 的方格是禁止通行的。

每次移动，都可以走到网格中在四个方向上相邻的方格，只要该方格 **不** 在给出的封锁列表 `blocked` 上。同时，不允许走出网格。

只有在可以通过一系列的移动从源方格 `source` 到达目标方格 `target` 时才返回 `true`。否则，返回 `false`。

**示例 1：**

```text
输入：blocked = [[0,1],[1,0]], source = [0,0], target = [0,2]
输出：false
解释：
从源方格无法到达目标方格，因为我们无法在网格中移动。
无法向北或者向东移动是因为方格禁止通行。
无法向南或者向西移动是因为不能走出网格。
```

**示例 2：**

```text
输入：blocked = [], source = [0,0], target = [999999,999999]
输出：true
解释：
因为没有方格被封锁，所以一定可以到达目标方格。
```

**提示：**

- `0 i, yi x, sy, tx, ty < 10^6`

- `source != target`

- 题目数据保证 `source` 和 `target` 不在封锁列表内

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目相当于在一个 $10^6 \times 10^6$ 的网格中，给定源点和目标点，以及一小部分被封锁的点，问是否可以从源点到达目标点。

由于被封锁的点数量很少，最终能封锁的区域大小不超过 $|blocked|^2 / 2$，因此，我们可以从源点和目标点出发，进行深度优先搜索，直到搜索到目标点或者搜索到的点数超过 $|blocked|^2 / 2$，如果都满足，则返回 $\textit{true}$。否则返回 $\textit{false}$。

时间复杂度 $O(m)$，空间复杂度 $O(m)$，其中 $m$ 是被封锁的区域的大小，本题中 $m \leq |blocked|^2 / 2 = 200^2 / 2 = 20000$。

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
// Escape a Large Maze：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isEscapePossible(blocked [][]int, source []int, target []int) bool {
	const n = 1_000_000
	m := len(blocked) * len(blocked) / 2
	dirs := [5]int{-1, 0, 1, 0, -1}

	f := func(i, j int) int64 {
		return int64(i*n + j)
	}

	s := make(map[int64]bool)
	for _, b := range blocked {
		s[f(b[0], b[1])] = true
	}

	var dfs func(sx, sy, tx, ty int, vis map[int64]bool) bool
	dfs = func(sx, sy, tx, ty int, vis map[int64]bool) bool {
		key := f(sx, sy)
		vis[key] = true
		if len(vis) > m {
			return true
		}
		for k := 0; k < 4; k++ {
			x, y := sx+dirs[k], sy+dirs[k+1]
			if x >= 0 && x < n && y >= 0 && y < n {
				if x == tx && y == ty {
					return true
				}
				key := f(x, y)
				if !s[key] && !vis[key] && dfs(x, y, tx, ty, vis) {
					return true
				}
			}
		}
		return false
	}

	sx, sy := source[0], source[1]
	tx, ty := target[0], target[1]
	return dfs(sx, sy, tx, ty, map[int64]bool{}) && dfs(tx, ty, sx, sy, map[int64]bool{})
}
```

### Java

```java
// Escape a Large Maze：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private final int n = (int) 1e6;
    private int m;
    private Set<Long> s = new HashSet<>();
    private final int[] dirs = {-1, 0, 1, 0, -1};

    public boolean isEscapePossible(int[][] blocked, int[] source, int[] target) {
        for (var b : blocked) {
            s.add(f(b[0], b[1]));
        }
        m = blocked.length * blocked.length / 2;
        int sx = source[0], sy = source[1];
        int tx = target[0], ty = target[1];
        return dfs(sx, sy, tx, ty, new HashSet<>()) && dfs(tx, ty, sx, sy, new HashSet<>());
    }

    private boolean dfs(int sx, int sy, int tx, int ty, Set<Long> vis) {
        if (vis.size() > m) {
            return true;
        }
        for (int k = 0; k < 4; ++k) {
            int x = sx + dirs[k], y = sy + dirs[k + 1];
            if (x >= 0 && x < n && y >= 0 && y < n) {
                if (x == tx && y == ty) {
                    return true;
                }
                long key = f(x, y);
                if (!s.contains(key) && vis.add(key) && dfs(x, y, tx, ty, vis)) {
                    return true;
                }
            }
        }
        return false;
    }

    private long f(int i, int j) {
        return (long) i * n + j;
    }
}
```

### Python

```python
# Escape a Large Maze：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isEscapePossible(
        self, blocked: List[List[int]], source: List[int], target: List[int]
    ) -> bool:
        def dfs(source: List[int], target: List[int], vis: set) -> bool:
            vis.add(tuple(source))
            if len(vis) > m:
                return True
            for a, b in pairwise(dirs):
                x, y = source[0] + a, source[1] + b
                if 0 <= x < n and 0 <= y < n and (x, y) not in s and (x, y) not in vis:
                    if [x, y] == target or dfs([x, y], target, vis):
                        return True
            return False

        s = {(x, y) for x, y in blocked}
        dirs = (-1, 0, 1, 0, -1)
        n = 10**6
        m = len(blocked) ** 2 // 2
        return dfs(source, target, set()) and dfs(target, source, set())
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

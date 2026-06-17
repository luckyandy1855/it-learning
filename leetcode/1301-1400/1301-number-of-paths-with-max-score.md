# 1301. Number of Paths with Max Score

---
编号: 1301
题目: Number of Paths with Max Score
难度: 困难
标签: [数组, 动态规划, 矩阵]
来源链接: https://leetcode.com/problems/number-of-paths-with-max-score/
---

## 题目描述

给你一个正方形字符数组 `board` ，你从数组最右下方的字符 `&#39;S&#39;` 出发。

你的目标是到达数组最左上角的字符 `&#39;E&#39;` ，数组剩余的部分为数字字符 `1, 2, ..., 9` 或者障碍 `&#39;X&#39;`。在每一步移动中，你可以向上、向左或者左上方移动，可以移动的前提是到达的格子没有障碍。

一条路径的 「得分」 定义为：路径上所有数字的和。

请你返回一个列表，包含两个整数：第一个整数是 「得分」 的最大值，第二个整数是得到最大得分的方案数，请把结果对 **`10^9 + 7`** **取余**。

如果没有任何路径可以到达终点，请返回 `[0, 0]` 。

**示例 1：**

```text
输入：board = ["E23","2X2","12S"]
输出：[7,1]
```

**示例 2：**

```text
输入：board = ["E12","1X1","21S"]
输出：[4,2]
```

**示例 3：**

```text
输入：board = ["E11","XXX","11S"]
输出：[0,0]
```

**提示：**

- `2 <= board.length == board[i].length <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示从起点 $(n - 1, n - 1)$ 到达 $(i, j)$ 的最大得分，定义 $g[i][j]$ 表示从起点 $(n - 1, n - 1)$ 到达 $(i, j)$ 的最大得分的方案数。初始时 $f[n - 1][n - 1] = 0$，并且 $g[n - 1][n - 1] = 1$。其它位置的 $f[i][j]$ 均为 $-1$，而 $g[i][j]$ 均为 $0$。

对于当前位置 $(i, j)$，它可以由 $(i + 1, j)$, $(i, j + 1)$, $(i + 1, j + 1)$ 三个位置转移而来，因此我们可以枚举这三个位置，更新 $f[i][j]$ 和 $g[i][j]$ 的值。如果当前位置 $(i, j)$ 有障碍，或者当前位置是起点，或者其它位置越界，则不进行更新。否则，如果其它位置 $(x, y)$ 满足 $f[x][y] \gt f[i][j]$，那么我们更新 $f[i][j] = f[x][y]$，并且 $g[i][j] = g[x][y]$。如果 $f[x][y] = f[i][j]$，那么我们更新 $g[i][j] = g[i][j] + g[x][y]$。最后，如果当前位置 $(i, j)$ 可达并且是数字，我们更新 $f[i][j] = f[i][j] + board[i][j]$。

最后，如果 $f[0][0] \lt 0$，说明没有路径可以到达终点，返回 $[0, 0]$。否则，返回 $[f[0][0], g[0][0]]$。注意，返回结果需要对 $10^9 + 7$ 取余。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 是数组的边长。

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
// Number of Paths with Max Score：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func pathsWithMaxScore(board []string) []int {
	n := len(board)
	f := make([][]int, n)
	g := make([][]int, n)
	for i := range f {
		f[i] = make([]int, n)
		g[i] = make([]int, n)
		for j := range f[i] {
			f[i][j] = -1
		}
	}
	f[n-1][n-1] = 0
	g[n-1][n-1] = 1
	const mod = 1e9 + 7

	update := func(i, j, x, y int) {
		if x >= n || y >= n || f[x][y] == -1 || board[i][j] == 'X' || board[i][j] == 'S' {
			return
		}
		if f[x][y] > f[i][j] {
			f[i][j] = f[x][y]
			g[i][j] = g[x][y]
		} else if f[x][y] == f[i][j] {
			g[i][j] = (g[i][j] + g[x][y]) % mod
		}
	}
	for i := n - 1; i >= 0; i-- {
		for j := n - 1; j >= 0; j-- {
			update(i, j, i+1, j)
			update(i, j, i, j+1)
			update(i, j, i+1, j+1)
			if f[i][j] != -1 && board[i][j] >= '0' && board[i][j] <= '9' {
				f[i][j] += int(board[i][j] - '0')
			}
		}
	}
	ans := make([]int, 2)
	if f[0][0] != -1 {
		ans[0], ans[1] = f[0][0], g[0][0]
	}
	return ans
}
```

### Java

```java
// Number of Paths with Max Score：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<String> board;
    private int n;
    private int[][] f;
    private int[][] g;
    private final int mod = (int) 1e9 + 7;

    public int[] pathsWithMaxScore(List<String> board) {
        n = board.size();
        this.board = board;
        f = new int[n][n];
        g = new int[n][n];
        for (var e : f) {
            Arrays.fill(e, -1);
        }
        f[n - 1][n - 1] = 0;
        g[n - 1][n - 1] = 1;
        for (int i = n - 1; i >= 0; --i) {
            for (int j = n - 1; j >= 0; --j) {
                update(i, j, i + 1, j);
                update(i, j, i, j + 1);
                update(i, j, i + 1, j + 1);
                if (f[i][j] != -1) {
                    char c = board.get(i).charAt(j);
                    if (c >= '0' && c <= '9') {
                        f[i][j] += (c - '0');
                    }
                }
            }
        }
        int[] ans = new int[2];
        if (f[0][0] != -1) {
            ans[0] = f[0][0];
            ans[1] = g[0][0];
        }
        return ans;
    }

    private void update(int i, int j, int x, int y) {
        if (x >= n || y >= n || f[x][y] == -1 || board.get(i).charAt(j) == 'X'
            || board.get(i).charAt(j) == 'S') {
            return;
        }
        if (f[x][y] > f[i][j]) {
            f[i][j] = f[x][y];
            g[i][j] = g[x][y];
        } else if (f[x][y] == f[i][j]) {
            g[i][j] = (g[i][j] + g[x][y]) % mod;
        }
    }
}
```

### Python

```python
# Number of Paths with Max Score：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def pathsWithMaxScore(self, board: List[str]) -> List[int]:
        def update(i, j, x, y):
            if x >= n or y >= n or f[x][y] == -1 or board[i][j] in "XS":
                return
            if f[x][y] > f[i][j]:
                f[i][j] = f[x][y]
                g[i][j] = g[x][y]
            elif f[x][y] == f[i][j]:
                g[i][j] += g[x][y]

        n = len(board)
        f = [[-1] * n for _ in range(n)]
        g = [[0] * n for _ in range(n)]
        f[-1][-1], g[-1][-1] = 0, 1
        for i in range(n - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                update(i, j, i + 1, j)
                update(i, j, i, j + 1)
                update(i, j, i + 1, j + 1)
                if f[i][j] != -1 and board[i][j].isdigit():
                    f[i][j] += int(board[i][j])
        mod = 10**9 + 7
        return [0, 0] if f[0][0] == -1 else [f[0][0], g[0][0] % mod]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

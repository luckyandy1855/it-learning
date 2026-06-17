# 0348. Design Tic-Tac-Toe

---
编号: 348
题目: Design Tic-Tac-Toe
难度: 中等
标签: [设计, 数组, 哈希表, 矩阵, 模拟]
来源链接: https://leetcode.com/problems/design-tic-tac-toe/
---

## 题目描述

请在 n × n 的棋盘上，实现一个判定井字棋（Tic-Tac-Toe）胜负的神器，判断每一次玩家落子后，是否有胜出的玩家。

在这个井字棋游戏中，会有 2 名玩家，他们将轮流在棋盘上放置自己的棋子。

在实现这个判定器的过程中，你可以假设以下这些规则一定成立：

      1. 每一步棋都是在棋盘内的，并且只能被放置在一个空的格子里；

      2. 一旦游戏中有一名玩家胜出的话，游戏将不能再继续；

      3. 一个玩家如果在同一行、同一列或者同一斜对角线上都放置了自己的棋子，那么他便获得胜利。

**示例:**

```text
给定棋盘边长 n = 3, 玩家 1 的棋子符号是 "X"，玩家 2 的棋子符号是 "O"。

TicTacToe toe = new TicTacToe(3);

toe.move(0, 0, 1); -> 函数返回 0 (此时，暂时没有玩家赢得这场对决)
|X| | |
| | | |    // 玩家 1 在 (0, 0) 落子。
| | | |

toe.move(0, 2, 2); -> 函数返回 0 (暂时没有玩家赢得本场比赛)
|X| |O|
| | | |    // 玩家 2 在 (0, 2) 落子。
| | | |

toe.move(2, 2, 1); -> 函数返回 0 (暂时没有玩家赢得比赛)
|X| |O|
| | | |    // 玩家 1 在 (2, 2) 落子。
| | |X|

toe.move(1, 1, 2); -> 函数返回 0 (暂没有玩家赢得比赛)
|X| |O|
| |O| |    // 玩家 2 在 (1, 1) 落子。
| | |X|

toe.move(2, 0, 1); -> 函数返回 0 (暂无玩家赢得比赛)
|X| |O|
| |O| |    // 玩家 1 在 (2, 0) 落子。
|X| |X|

toe.move(1, 0, 2); -> 函数返回 0 (没有玩家赢得比赛)
|X| |O|
|O|O| |    // 玩家 2 在 (1, 0) 落子.
|X| |X|

toe.move(2, 1, 1); -> 函数返回 1 (此时，玩家 1 赢得了该场比赛)
|X| |O|
|O|O| |    // 玩家 1 在 (2, 1) 落子。
|X|X|X|
```

**提示：**

	- `2 <= n <= 100`

	- 玩家是 `1` 或 `2`。

	- `0 <= row, col < n`

	- 每次调用 `move` 时 `(row, col)` 都是不同的。

	- 最多调用 `move`  `n^2` 次。

**进阶:**

您有没有可能将每一步的 `move()` 操作优化到比 O(*n*^2) 更快吗?

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 数组, 哈希表, 矩阵, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用一个长度为 $n \times 2 + 2$ 的数组来记录每个玩家在每一行、每一列、两条对角线上的棋子数。我们需要两个这样的数组，分别记录两个玩家的棋子数。

当一个玩家在某一行、某一列、某一对角线上的棋子数等于 $n$ 时，该玩家获胜。

时间复杂度方面，每次落子的时间复杂度为 $O(1)$。空间复杂度为 $O(n)$，其中 $n$ 为棋盘的边长。

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
// Design Tic-Tac-Toe：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type TicTacToe struct {
	n   int
	cnt [][]int
}

func Constructor(n int) TicTacToe {
	cnt := make([][]int, 2)
	for i := range cnt {
		cnt[i] = make([]int, (n<<1)+2)
	}
	return TicTacToe{n, cnt}
}

func (this *TicTacToe) Move(row int, col int, player int) int {
	cur := this.cnt[player-1]
	cur[row]++
	cur[this.n+col]++
	if row == col {
		cur[this.n<<1]++
	}
	if row+col == this.n-1 {
		cur[this.n<<1|1]++
	}
	if cur[row] == this.n || cur[this.n+col] == this.n || cur[this.n<<1] == this.n || cur[this.n<<1|1] == this.n {
		return player
	}
	return 0
}

/**
 * Your TicTacToe object will be instantiated and called as such:
 * obj := Constructor(n);
 * param_1 := obj.Move(row,col,player);
 */
```

### Java

```java
// Design Tic-Tac-Toe：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class TicTacToe {
    private int n;
    private int[][] cnt;

    public TicTacToe(int n) {
        this.n = n;
        cnt = new int[2][(n << 1) + 2];
    }

    public int move(int row, int col, int player) {
        int[] cur = cnt[player - 1];
        ++cur[row];
        ++cur[n + col];
        if (row == col) {
            ++cur[n << 1];
        }
        if (row + col == n - 1) {
            ++cur[n << 1 | 1];
        }
        if (cur[row] == n || cur[n + col] == n || cur[n << 1] == n || cur[n << 1 | 1] == n) {
            return player;
        }
        return 0;
    }
}

/**
 * Your TicTacToe object will be instantiated and called as such:
 * TicTacToe obj = new TicTacToe(n);
 * int param_1 = obj.move(row,col,player);
 */
```

### Python

```python
# Design Tic-Tac-Toe：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class TicTacToe:

    def __init__(self, n: int):
        self.n = n
        self.cnt = [defaultdict(int), defaultdict(int)]

    def move(self, row: int, col: int, player: int) -> int:
        cur = self.cnt[player - 1]
        n = self.n
        cur[row] += 1
        cur[n + col] += 1
        if row == col:
            cur[n << 1] += 1
        if row + col == n - 1:
            cur[n << 1 | 1] += 1
        if any(cur[i] == n for i in (row, n + col, n << 1, n << 1 | 1)):
            return player
        return 0


# Your TicTacToe object will be instantiated and called as such:
# obj = TicTacToe(n)
# param_1 = obj.move(row,col,player)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

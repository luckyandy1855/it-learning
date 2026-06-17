# 0794. Valid Tic-Tac-Toe State

---
编号: 794
题目: Valid Tic-Tac-Toe State
难度: 中等
标签: [数组, 矩阵]
来源链接: https://leetcode.com/problems/valid-tic-tac-toe-state/
---

## 题目描述

给你一个字符串数组 `board` 表示井字游戏的棋盘。当且仅当在井字游戏过程中，棋盘有可能达到 `board` 所显示的状态时，才返回 `true` 。

井字游戏的棋盘是一个 `3 x 3` 数组，由字符 `' '`，`'X'` 和 `'O'` 组成。字符 `' '` 代表一个空位。

以下是井字游戏的规则：

- 玩家轮流将字符放入空位（`' '`）中。

- 玩家 1 总是放字符 `'X'` ，而玩家 2 总是放字符 `'O'` 。

- `'X'` 和 `'O'` 只允许放置在空位中，不允许对已放有字符的位置进行填充。

- 当有 3 个相同（且非空）的字符填充任何行、列或对角线时，游戏结束。

- 当所有位置非空时，也算为游戏结束。

- 如果游戏结束，玩家不允许再放置字符。

**示例 1：**

```text
输入：board = ["O  ","   ","   "]
输出：false
解释：玩家 1 总是放字符 "X" 。
```

**示例 2：**

```text
输入：board = ["XOX"," X ","   "]
输出：false
解释：玩家应该轮流放字符。
```

**示例 3:**

```text
输入：board = ["XOX","O O","XOX"]
输出：true
```

**提示：**

- `board.length == 3`

- `board[i].length == 3`

- `board[i][j]` 为 `'X'`、`'O'` 或 `' '`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先统计当前棋盘上 `'X'` 和 `'O'` 的数量，记为 $x$ 和 $o$。接下来，我们分情况讨论：

- 如果 $x \neq o$ 且 $x - 1 \neq o$，则当前棋盘不可能是有效棋盘，返回 `false`。
- 如果当前棋盘上玩家 1 获胜，但 $x-1 \neq o$，则当前棋盘不可能是有效棋盘，返回 `false`。
- 如果当前棋盘上玩家 2 获胜，但 $x \neq o$，则当前棋盘不可能是有效棋盘，返回 `false`。
- 其他情况下，当前棋盘是有效棋盘，返回 `true`。

时间复杂度 $O(C)$，空间复杂度 $O(1)$。其中 $C$ 是棋盘上的格子数。本题中 $C = 9$。

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
// Valid Tic-Tac-Toe State：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func validTicTacToe(board []string) bool {
	var x, o int
	for _, row := range board {
		for _, c := range row {
			if c == 'X' {
				x++
			} else if c == 'O' {
				o++
			}
		}
	}
	win := func(x byte) bool {
		for i := 0; i < 3; i++ {
			if board[i][0] == x && board[i][1] == x && board[i][2] == x {
				return true
			}
			if board[0][i] == x && board[1][i] == x && board[2][i] == x {
				return true
			}
		}
		if board[0][0] == x && board[1][1] == x && board[2][2] == x {
			return true
		}
		return board[0][2] == x && board[1][1] == x && board[2][0] == x
	}
	if x != o && x-1 != o {
		return false
	}
	if win('X') && x-1 != o {
		return false
	}
	return !(win('O') && x != o)
}
```

### Java

```java
// Valid Tic-Tac-Toe State：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private String[] board;

    public boolean validTicTacToe(String[] board) {
        this.board = board;
        int x = count('X'), o = count('O');
        if (x != o && x - 1 != o) {
            return false;
        }
        if (win('X') && x - 1 != o) {
            return false;
        }
        return !(win('O') && x != o);
    }

    private boolean win(char x) {
        for (int i = 0; i < 3; ++i) {
            if (board[i].charAt(0) == x && board[i].charAt(1) == x && board[i].charAt(2) == x) {
                return true;
            }
            if (board[0].charAt(i) == x && board[1].charAt(i) == x && board[2].charAt(i) == x) {
                return true;
            }
        }
        if (board[0].charAt(0) == x && board[1].charAt(1) == x && board[2].charAt(2) == x) {
            return true;
        }
        return board[0].charAt(2) == x && board[1].charAt(1) == x && board[2].charAt(0) == x;
    }

    private int count(char x) {
        int cnt = 0;
        for (var row : board) {
            for (var c : row.toCharArray()) {
                if (c == x) {
                    ++cnt;
                }
            }
        }
        return cnt;
    }
}
```

### Python

```python
# Valid Tic-Tac-Toe State：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def validTicTacToe(self, board: List[str]) -> bool:
        def win(x):
            for i in range(3):
                if all(board[i][j] == x for j in range(3)):
                    return True
                if all(board[j][i] == x for j in range(3)):
                    return True
            if all(board[i][i] == x for i in range(3)):
                return True
            return all(board[i][2 - i] == x for i in range(3))

        x = sum(board[i][j] == 'X' for i in range(3) for j in range(3))
        o = sum(board[i][j] == 'O' for i in range(3) for j in range(3))
        if x != o and x - 1 != o:
            return False
        if win('X') and x - 1 != o:
            return False
        return not (win('O') and x != o)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

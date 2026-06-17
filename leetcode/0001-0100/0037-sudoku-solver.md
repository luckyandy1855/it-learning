# 0037. Sudoku Solver

---
编号: 37
题目: Sudoku Solver
难度: 困难
标签: [数组, 哈希表, 回溯, 矩阵]
来源链接: https://leetcode.com/problems/sudoku-solver/
---

## 题目描述

编写一个程序，通过填充空格来解决数独问题。数独解法须满足：

1. 每一行的数字 1-9 各出现一次。
2. 每一列的数字 1-9 各出现一次。
3. 九个 3×3 子宫格中的数字 1-9 各出现一次。

空格用 `'.'` 表示。题目保证输入数独有且仅有一个解。

### Example 1

```text
Input: board（9x9 数独，见第 36 题示例）
Output: 填写完整的 board
```

### 约束条件

- `board.length == 9`，`board[i].length == 9`
- `board[i][j]` 为数字 `'1'-'9'` 或 `'.'`。
- 题目保证有唯一解。

## 思路分析

### 突破口

回溯：逐格扫描，遇到空格就尝试填入 1-9，用第 36 题的有效性检查快速判断，若当前填法导致冲突则回溯，直到所有格子填完。

### 思路拆解

1. **状态维护**：与第 36 题相同，用三个 `9×9` 的 boolean 数组分别记录每行、每列、每宫格中 1-9 的使用情况，先根据已有数字初始化。

2. **回溯函数**：`solve(board, rows, cols, boxes)` 从左到右、从上到下找第一个 `'.'`，尝试 1-9，若有效则填入并递归；递归返回 true 则成功，否则撤销填入（回溯）继续尝试下一个数字。若当前格子无法填入任何数字，返回 false 触发上层回溯。

3. **实现要点**：找到所有空格后递归，或者在递归函数内按位置扫描（下面采用后者，更直观）。

### 示意图

```text
回溯过程（简化）：

[., ., ., ...] ← 找到第一个空格 (0,0)
  尝试 1: 若行0/列0/宫0格中无1 → 填入1，递归下一个空格
    找到下一个空格 (0,1)
      尝试 1: 行0已有1 → 跳过
      尝试 2: 有效 → 填入2，继续...
      ...如果后续无解 → 回溯到 (0,1)，撤销2，尝试3 ...
  若 1 最终无解 → 回溯到 (0,0)，撤销1，尝试2 ...
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 回溯 | O(9^m)，m=空格数，最坏 O(9^81) | O(81+27×9) |

## 代码实现

### Go

```go
// solveSudoku 用回溯法填满数独
// 参数：board 9x9 数独矩阵（原地修改）
func solveSudoku(board [][]byte) {
    var rows, cols, boxes [9][9]bool

    // 初始化已填数字的状态
    for i := 0; i < 9; i++ {
        for j := 0; j < 9; j++ {
            if board[i][j] != '.' {
                num := board[i][j] - '1'
                rows[i][num] = true
                cols[j][num] = true
                boxes[(i/3)*3+(j/3)][num] = true
            }
        }
    }

    var solve func() bool
    solve = func() bool {
        for i := 0; i < 9; i++ {
            for j := 0; j < 9; j++ {
                if board[i][j] != '.' {
                    continue
                }
                boxIdx := (i/3)*3 + (j / 3)
                // 尝试填入 1-9
                for num := 0; num < 9; num++ {
                    if rows[i][num] || cols[j][num] || boxes[boxIdx][num] {
                        continue // 有冲突，跳过
                    }
                    // 填入并更新状态
                    board[i][j] = byte('1' + num)
                    rows[i][num] = true
                    cols[j][num] = true
                    boxes[boxIdx][num] = true

                    if solve() {
                        return true // 已完成
                    }

                    // 回溯：撤销填入
                    board[i][j] = '.'
                    rows[i][num] = false
                    cols[j][num] = false
                    boxes[boxIdx][num] = false
                }
                return false // 所有数字都冲突，回溯
            }
        }
        return true // 所有格子都填完
    }

    solve()
}
```

### Java

```java
class Solution {
    private boolean[][] rows  = new boolean[9][9];
    private boolean[][] cols  = new boolean[9][9];
    private boolean[][] boxes = new boolean[9][9];

    /**
     * 用回溯法填满数独（原地修改 board）。
     *
     * @param board 9x9 数独矩阵
     */
    public void solveSudoku(char[][] board) {
        // 初始化已填数字
        for (int i = 0; i < 9; i++)
            for (int j = 0; j < 9; j++)
                if (board[i][j] != '.') {
                    int num = board[i][j] - '1';
                    rows[i][num] = cols[j][num] = boxes[(i/3)*3+(j/3)][num] = true;
                }
        solve(board);
    }

    private boolean solve(char[][] board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] != '.') continue;
                int boxIdx = (i / 3) * 3 + (j / 3);
                for (int num = 0; num < 9; num++) {
                    if (rows[i][num] || cols[j][num] || boxes[boxIdx][num]) continue;
                    board[i][j] = (char) ('1' + num);
                    rows[i][num] = cols[j][num] = boxes[boxIdx][num] = true;
                    if (solve(board)) return true;
                    board[i][j] = '.';
                    rows[i][num] = cols[j][num] = boxes[boxIdx][num] = false;
                }
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
class Solution:
    def solveSudoku(self, board: list[list[str]]) -> None:
        """
        用回溯法填满数独（原地修改 board）。

        参数:
            board: 9x9 数独矩阵
        """
        rows  = [[False] * 9 for _ in range(9)]
        cols  = [[False] * 9 for _ in range(9)]
        boxes = [[False] * 9 for _ in range(9)]

        # 初始化已填数字
        for i in range(9):
            for j in range(9):
                if board[i][j] != '.':
                    num = int(board[i][j]) - 1
                    rows[i][num] = cols[j][num] = boxes[(i//3)*3+(j//3)][num] = True

        def solve() -> bool:
            for i in range(9):
                for j in range(9):
                    if board[i][j] != '.':
                        continue
                    box_idx = (i // 3) * 3 + (j // 3)
                    for num in range(9):
                        if rows[i][num] or cols[j][num] or boxes[box_idx][num]:
                            continue
                        board[i][j] = str(num + 1)
                        rows[i][num] = cols[j][num] = boxes[box_idx][num] = True
                        if solve():
                            return True
                        board[i][j] = '.'
                        rows[i][num] = cols[j][num] = boxes[box_idx][num] = False
                    return False  # 所有数字都冲突
            return True  # 全部填完

        solve()
```

## 踩坑记录

- **回溯时必须同时撤销三个状态**：`rows/cols/boxes` 都要重置，只撤销 `board[i][j]` 而忘记撤销辅助数组会导致后续判断错误。
- **所有格子填完才返回 true**：扫完 9×9 没找到空格时，说明填完了，返回 `true`；在某格找不到合法数字时，返回 `false` 触发回溯。
- **先初始化再回溯**：必须先根据已填数字初始化 `rows/cols/boxes`，否则回溯过程中可能填入与初始数字冲突的值。

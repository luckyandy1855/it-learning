# 0036. Valid Sudoku

---
编号: 36
题目: Valid Sudoku
难度: 中等
标签: [数组, 哈希表, 矩阵]
来源链接: https://leetcode.com/problems/valid-sudoku/
---

## 题目描述

判断一个 9×9 的数独矩阵是否有效。有效条件：

1. 每一**行**的数字 1-9 不重复。
2. 每一**列**的数字 1-9 不重复。
3. 九个 3×3 子宫格中的数字 1-9 不重复。

矩阵中用 `'.'` 表示空格。**不需要判断数独是否有解**，只判断已填入的数字是否有效。

### Example 1

```text
Input: board = 
[["5","3",".",".","7",".",".",".","."]
,["6",".",".","1","9","5",".",".","."]
,[".","9","8",".",".",".",".","6","."]
,["8",".",".",".","6",".",".",".","3"]
,["4",".",".","8",".","3",".",".","1"]
,["7",".",".",".","2",".",".",".","6"]
,[".","6",".",".",".",".","2","8","."]
,[".",".",".","4","1","9",".",".","5"]
,[".",".",".",".","8",".",".","7","9"]]
Output: true
```

### 约束条件

- `board.length == 9`，`board[i].length == 9`
- `board[i][j]` 为数字 `'1'-'9'` 或 `'.'`。

## 思路分析

### 突破口

用三组 9 个哈希集合（集合数组），分别追踪每行、每列、每个 3×3 宫格中已出现的数字，遍历一遍即可。

### 思路拆解

1. **暴力三次扫描**：先扫行，再扫列，再扫宫格，三遍 O(81)，逻辑清晰。

2. **一次扫描（推荐）**：遍历每个格子 `(i, j)`，若有数字，同时检查并记录到行集合 `rows[i]`、列集合 `cols[j]`、宫格集合 `boxes[i/3*3 + j/3]`；若已存在则返回 false。

3. **宫格编号**：行 `i` 和列 `j` 所在的 3×3 宫格编号 = `(i/3)*3 + (j/3)`，共 9 个（编号 0-8）。

### 示意图

```text
宫格编号（9个3×3格子）：
┌───┬───┬───┐
│ 0 │ 1 │ 2 │
├───┼───┼───┤
│ 3 │ 4 │ 5 │
├───┼───┼───┤
│ 6 │ 7 │ 8 │
└───┴───┴───┘

位置 (i=4, j=7) → 宫格 (4/3)*3 + (7/3) = 1*3 + 2 = 5
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 一次扫描 | O(81) = O(1) | O(81×3) = O(1) |

## 代码实现

### Go

```go
// isValidSudoku 判断数独矩阵是否有效
// 参数：board 9x9 的数独矩阵（'1'-'9' 或 '.'）
// 返回：已填数字是否符合数独规则
func isValidSudoku(board [][]byte) bool {
    var rows, cols, boxes [9][9]bool // [行/列/宫格编号][数字1-9的下标0-8]

    for i := 0; i < 9; i++ {
        for j := 0; j < 9; j++ {
            if board[i][j] == '.' {
                continue
            }
            num := board[i][j] - '1' // 转为 0-8 的下标
            boxIdx := (i/3)*3 + (j / 3)

            if rows[i][num] || cols[j][num] || boxes[boxIdx][num] {
                return false // 重复出现
            }
            rows[i][num] = true
            cols[j][num] = true
            boxes[boxIdx][num] = true
        }
    }
    return true
}
```

### Java

```java
class Solution {
    /**
     * 判断数独矩阵是否有效。
     *
     * @param board 9x9 的数独矩阵
     * @return 已填数字是否符合数独规则
     */
    public boolean isValidSudoku(char[][] board) {
        boolean[][] rows  = new boolean[9][9];
        boolean[][] cols  = new boolean[9][9];
        boolean[][] boxes = new boolean[9][9];

        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') continue;
                int num = board[i][j] - '1';
                int boxIdx = (i / 3) * 3 + (j / 3);

                if (rows[i][num] || cols[j][num] || boxes[boxIdx][num]) return false;
                rows[i][num] = cols[j][num] = boxes[boxIdx][num] = true;
            }
        }
        return true;
    }
}
```

### Python

```python
class Solution:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        """
        判断数独矩阵是否有效。

        参数:
            board: 9x9 的数独矩阵
        返回:
            已填数字是否符合数独规则
        """
        rows  = [set() for _ in range(9)]
        cols  = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]

        for i in range(9):
            for j in range(9):
                c = board[i][j]
                if c == '.':
                    continue
                box_idx = (i // 3) * 3 + (j // 3)
                if c in rows[i] or c in cols[j] or c in boxes[box_idx]:
                    return False
                rows[i].add(c)
                cols[j].add(c)
                boxes[box_idx].add(c)

        return True
```

## 踩坑记录

- **宫格编号公式**：`(i/3)*3 + (j/3)`，不要写成 `i*3 + j`。`i/3` 是宫格的行号（0-2），`j/3` 是宫格的列号（0-2），组合成 0-8 的编号。
- **数字转下标**：`num = c - '1'`，将字符 `'1'-'9'` 转为 `0-8` 的整数下标，用于访问 boolean 数组；不要减 `'0'`（那会得到 `1-9`，需要额外处理）。
- **只判断合法性，不判断完整性**：已填的数字不重复即合法，空格不影响结果，不需要检查数独是否有解或者所有格子是否都填满。

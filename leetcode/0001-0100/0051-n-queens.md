# 0051. N-Queens

---
编号: 51
题目: N-Queens
难度: 困难
标签: [数组, 回溯]
来源链接: https://leetcode.com/problems/n-queens/
---

## 题目描述

在 n×n 的国际象棋棋盘上放置 n 个皇后，使得她们互不攻击——任意两个皇后不能在同一行、同一列、同一对角线上。返回所有满足条件的棋盘布局。

棋盘用字符串数组表示：`'Q'` 代表皇后，`'.'` 代表空格。

### Example 1

```text
Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
```

### Example 2

```text
Input: n = 1
Output: [["Q"]]
```

### 约束条件

- `1 <= n <= 9`

## 思路分析

### 突破口

逐行放置皇后：每行恰好放一个，从第 0 行开始，尝试每一列，若当前位置合法则递归处理下一行，回溯时撤销。

### 思路拆解

1. **逐行回溯**：第 `row` 行枚举每列 `col`，满足不冲突时递归进入 `row+1`。

2. **冲突检测**：维护三个集合——已占用列 `cols`、主对角线 `diag1`（`row-col` 相同则同一主对角线）、副对角线 `diag2`（`row+col` 相同则同一副对角线）。

3. **构造答案**：到达 `row == n` 时，根据每行的列选择拼装字符串。

### 示意图

```text
n=4，第一组解：
行0: . Q . .   (col=1)
行1: . . . Q   (col=3)
行2: Q . . .   (col=0)
行3: . . Q .   (col=2)

冲突检测：
  (0,1): cols={1}, diag1={-1}, diag2={1}
  (1,3): cols={1,3}, diag1={-1,-2}, diag2={1,4}
  (2,0): cols={0,1,3}, diag1={-1,-2,2}, diag2={0,1,4}
  (3,2): 列2未占用，diag1=1未占用，diag2=5未占用 → 合法
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 回溯 | O(n!) | O(n) |

## 代码实现

### Go

```go
// solveNQueens 返回 n 皇后问题的所有合法棋盘布局
func solveNQueens(n int) [][]string {
    var result [][]string
    queens := make([]int, n) // queens[row] = col
    for i := range queens {
        queens[i] = -1
    }
    cols := make(map[int]bool)
    diag1 := make(map[int]bool) // row-col
    diag2 := make(map[int]bool) // row+col

    var backtrack func(row int)
    backtrack = func(row int) {
        if row == n {
            board := make([]string, n)
            for r := 0; r < n; r++ {
                rowBytes := make([]byte, n)
                for c := range rowBytes {
                    rowBytes[c] = '.'
                }
                rowBytes[queens[r]] = 'Q'
                board[r] = string(rowBytes)
            }
            result = append(result, board)
            return
        }
        for col := 0; col < n; col++ {
            if cols[col] || diag1[row-col] || diag2[row+col] {
                continue
            }
            queens[row] = col
            cols[col] = true
            diag1[row-col] = true
            diag2[row+col] = true
            backtrack(row + 1)
            queens[row] = -1
            delete(cols, col)
            delete(diag1, row-col)
            delete(diag2, row+col)
        }
    }
    backtrack(0)
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回 n 皇后问题的所有合法棋盘布局。
     */
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        int[] queens = new int[n]; // queens[row] = col
        Arrays.fill(queens, -1);
        Set<Integer> cols = new HashSet<>(), diag1 = new HashSet<>(), diag2 = new HashSet<>();
        backtrack(0, n, queens, cols, diag1, diag2, result);
        return result;
    }

    private void backtrack(int row, int n, int[] queens,
            Set<Integer> cols, Set<Integer> diag1, Set<Integer> diag2,
            List<List<String>> result) {
        if (row == n) {
            List<String> board = new ArrayList<>();
            for (int r = 0; r < n; r++) {
                char[] rowChars = new char[n];
                Arrays.fill(rowChars, '.');
                rowChars[queens[r]] = 'Q';
                board.add(new String(rowChars));
            }
            result.add(board);
            return;
        }
        for (int col = 0; col < n; col++) {
            if (cols.contains(col) || diag1.contains(row - col) || diag2.contains(row + col))
                continue;
            queens[row] = col;
            cols.add(col); diag1.add(row - col); diag2.add(row + col);
            backtrack(row + 1, n, queens, cols, diag1, diag2, result);
            queens[row] = -1;
            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col);
        }
    }
}
```

### Python

```python
class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        """
        返回 n 皇后问题的所有合法棋盘布局。
        """
        result = []
        queens = [-1] * n
        cols, diag1, diag2 = set(), set(), set()

        def backtrack(row: int) -> None:
            if row == n:
                board = []
                for r in range(n):
                    row_str = '.' * queens[r] + 'Q' + '.' * (n - queens[r] - 1)
                    board.append(row_str)
                result.append(board)
                return
            for col in range(n):
                if col in cols or (row - col) in diag1 or (row + col) in diag2:
                    continue
                queens[row] = col
                cols.add(col); diag1.add(row - col); diag2.add(row + col)
                backtrack(row + 1)
                queens[row] = -1
                cols.discard(col); diag1.discard(row - col); diag2.discard(row + col)

        backtrack(0)
        return result
```

## 踩坑记录

- **对角线判断条件**：同一主对角线上 `row-col` 相同，同一副对角线上 `row+col` 相同，两个集合必须同时维护。
- **构造字符串**：Python 字符串不可变，用乘法拼接 `'.' * col + 'Q' + '.' * (n-col-1)` 比 `list` 转换更简洁。
- **回溯时必须撤销所有状态**：`queens[row]`、`cols`、`diag1`、`diag2` 四个状态都要恢复，漏掉任意一个会导致误判。

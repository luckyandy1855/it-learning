# 0079. Word Search

---
编号: 79
题目: Word Search
难度: 中等
标签: [深度优先搜索, 数组, 字符串, 回溯, 矩阵]
来源链接: https://leetcode.com/problems/word-search/
---

## 题目描述

给定 m×n 的字符网格 `board` 和字符串 `word`，判断 `word` 是否存在于网格中——即 `word` 的字母是否能由网格中水平或垂直相邻的单元格连接而成，且每个单元格只能使用一次。

### Example 1

```text
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true
```

### Example 2

```text
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
Output: true
```

### Example 3

```text
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
Output: false
```

### 约束条件

- `m == board.length`，`n == board[i].length`
- `1 <= m, n <= 6`
- `1 <= word.length <= 15`
- `board` 和 `word` 仅含英文大写/小写字母

## 思路分析

### 突破口

DFS 回溯：以每个格子为起点，尝试匹配 `word`；将已访问格子临时标记（防止重用），回溯时恢复。

### 思路拆解

1. **枚举起点**：遍历所有 `(i,j)`，若 `board[i][j] == word[0]` 则从此处发起 DFS。

2. **DFS 匹配**：参数 `k` 表示当前需要匹配 `word[k]`；若 `k == len(word)` 则成功返回。

3. **标记已访问**：将当前格临时改为特殊字符（如 `'#'`），DFS 返回后恢复。

4. **四方向递归**：上下左右各发起一次 DFS，任意一个成功则返回 true。

### 示意图

```text
board:               匹配 "ABCCED"
A B C E              A(0,0) → B(0,1) → C(0,2) → C(1,2) → E(2,2) → D(2,1)
S F C S              标记路径: # # # # # # (临时), 成功后恢复
A D E E
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| DFS 回溯 | O(m×n×4^L) | O(L) |

注：L 为 word 长度，最坏每步有 4 个方向。

## 代码实现

### Go

```go
// exist 判断 word 是否可以在 board 中连续连接出来
func exist(board [][]byte, word string) bool {
    m, n := len(board), len(board[0])

    var dfs func(i, j, k int) bool
    dfs = func(i, j, k int) bool {
        if k == len(word) {
            return true
        }
        if i < 0 || i >= m || j < 0 || j >= n || board[i][j] != word[k] {
            return false
        }
        tmp := board[i][j]
        board[i][j] = '#' // 标记已访问
        found := dfs(i+1, j, k+1) || dfs(i-1, j, k+1) || dfs(i, j+1, k+1) || dfs(i, j-1, k+1)
        board[i][j] = tmp // 恢复
        return found
    }

    for i := 0; i < m; i++ {
        for j := 0; j < n; j++ {
            if dfs(i, j, 0) {
                return true
            }
        }
    }
    return false
}
```

### Java

```java
class Solution {
    /**
     * 判断 word 是否可以在 board 中连续连接出来（DFS 回溯）。
     */
    public boolean exist(char[][] board, String word) {
        int m = board.length, n = board[0].length;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (dfs(board, word, i, j, 0)) return true;
        return false;
    }

    private boolean dfs(char[][] board, String word, int i, int j, int k) {
        if (k == word.length()) return true;
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length
                || board[i][j] != word.charAt(k)) return false;

        char tmp = board[i][j];
        board[i][j] = '#';
        boolean found = dfs(board, word, i+1, j, k+1) || dfs(board, word, i-1, j, k+1)
                     || dfs(board, word, i, j+1, k+1) || dfs(board, word, i, j-1, k+1);
        board[i][j] = tmp;
        return found;
    }
}
```

### Python

```python
class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        """
        判断 word 是否可以在 board 中连续连接出来（DFS 回溯）。
        """
        m, n = len(board), len(board[0])

        def dfs(i: int, j: int, k: int) -> bool:
            if k == len(word):
                return True
            if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]:
                return False
            tmp, board[i][j] = board[i][j], '#'  # 标记已访问
            found = (dfs(i+1, j, k+1) or dfs(i-1, j, k+1) or
                     dfs(i, j+1, k+1) or dfs(i, j-1, k+1))
            board[i][j] = tmp  # 恢复
            return found

        for i in range(m):
            for j in range(n):
                if dfs(i, j, 0):
                    return True
        return False
```

## 踩坑记录

- **用 `'#'` 标记而非 visited 数组**：直接修改 board 避免额外空间，回溯后必须恢复，否则其他路径会看到被污染的 board。
- **边界检查和字符匹配合并在一个条件**：`board[i][j] != word[k]` 包含了对当前格是 `'#'`（已访问）的检查（因为 word 不含 `'#'`），不需要额外的 visited 判断。
- **提前返回**：四个方向的 DFS 用 `||` 短路求值，一旦找到立刻返回，不会继续探索。

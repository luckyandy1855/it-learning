# 0052. N-Queens II

---
编号: 52
题目: N-Queens II
难度: 困难
标签: [回溯]
来源链接: https://leetcode.com/problems/n-queens-ii/
---

## 题目描述

与 0051 N-Queens 问题相同的棋盘约束：在 n×n 的棋盘上放置 n 个皇后，使她们互不攻击。本题只需返回**合法布局的总数**，不需要返回具体棋盘。

### Example 1

```text
Input: n = 4
Output: 2
```

### Example 2

```text
Input: n = 1
Output: 1
```

### 约束条件

- `1 <= n <= 9`

## 思路分析

### 突破口

与 0051 完全相同的回溯框架，只是到达 `row == n` 时计数 `+1` 而非存储棋盘，代码更简洁。

### 思路拆解

1. **回溯 + 计数**：逐行枚举列，用三个集合（列、主对角线、副对角线）排除冲突，递归到底时结果加一。

2. **位运算优化（可选）**：用三个整数的位来代替集合，`available = ((1<<n)-1) & ~(cols | ld | rd)` 每次提取最低位皇后位置，极快但可读性差。本题 n≤9 暴力回溯已足够。

### 示意图

```text
n=4 的搜索树（部分）：
row0: col0 col1* col2  col3
         |
row1: col0  col1  col2  col3*
                        |
row2: col0* col1  col2  col3
       |
row3: col0  col1  col2* col3
                  找到一个解 → count++
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 回溯 | O(n!) | O(n) |

## 代码实现

### Go

```go
// totalNQueens 返回 n 皇后问题的合法布局总数
func totalNQueens(n int) int {
    count := 0
    cols := make(map[int]bool)
    diag1 := make(map[int]bool)
    diag2 := make(map[int]bool)

    var backtrack func(row int)
    backtrack = func(row int) {
        if row == n {
            count++
            return
        }
        for col := 0; col < n; col++ {
            if cols[col] || diag1[row-col] || diag2[row+col] {
                continue
            }
            cols[col] = true
            diag1[row-col] = true
            diag2[row+col] = true
            backtrack(row + 1)
            delete(cols, col)
            delete(diag1, row-col)
            delete(diag2, row+col)
        }
    }
    backtrack(0)
    return count
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回 n 皇后问题的合法布局总数。
     */
    private int count = 0;

    public int totalNQueens(int n) {
        Set<Integer> cols = new HashSet<>(), diag1 = new HashSet<>(), diag2 = new HashSet<>();
        backtrack(0, n, cols, diag1, diag2);
        return count;
    }

    private void backtrack(int row, int n,
            Set<Integer> cols, Set<Integer> diag1, Set<Integer> diag2) {
        if (row == n) { count++; return; }
        for (int col = 0; col < n; col++) {
            if (cols.contains(col) || diag1.contains(row - col) || diag2.contains(row + col))
                continue;
            cols.add(col); diag1.add(row - col); diag2.add(row + col);
            backtrack(row + 1, n, cols, diag1, diag2);
            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col);
        }
    }
}
```

### Python

```python
class Solution:
    def totalNQueens(self, n: int) -> int:
        """
        返回 n 皇后问题的合法布局总数。
        """
        self.count = 0
        cols, diag1, diag2 = set(), set(), set()

        def backtrack(row: int) -> None:
            if row == n:
                self.count += 1
                return
            for col in range(n):
                if col in cols or (row - col) in diag1 or (row + col) in diag2:
                    continue
                cols.add(col); diag1.add(row - col); diag2.add(row + col)
                backtrack(row + 1)
                cols.discard(col); diag1.discard(row - col); diag2.discard(row + col)

        backtrack(0)
        return self.count
```

## 踩坑记录

- **与 0051 代码几乎相同**：唯一区别是终止条件时 `count++` 而非构造棋盘，不要因此忽略同样的对角线冲突逻辑。
- **Java 用实例变量 count**：lambda 内不能修改局部 int，用 `int[]` 或实例变量绕过；Python 用 `self.count` 同理。
- **n=1 时答案是 1**：不要因边界判断出错，回溯框架在 `row==1==n` 时直接计数，自然处理。

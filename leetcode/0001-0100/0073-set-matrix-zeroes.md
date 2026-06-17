# 0073. Set Matrix Zeroes

---
编号: 73
题目: Set Matrix Zeroes
难度: 中等
标签: [数组, 哈希表, 矩阵]
来源链接: https://leetcode.com/problems/set-matrix-zeroes/
---

## 题目描述

给定一个 m×n 的整数矩阵，若某个元素为 0，则将其所在**整行**和**整列**都设为 0，原地操作，不允许使用额外空间（空间复杂度 O(1)）。

### Example 1

```text
Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]
```

### Example 2

```text
Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
```

### 约束条件

- `m == matrix.length`，`n == matrix[i].length`
- `1 <= m, n <= 200`
- `-2^31 <= matrix[i][j] <= 2^31 - 1`
- 进阶：O(1) 空间解法

## 思路分析

### 突破口

用**矩阵的第一行和第一列**作为标记数组，记录哪些行/列需要置零——但需要先单独记录第一行和第一列本身是否含 0。

### 思路拆解

1. **预扫描第一行/列**：记录 `firstRowZero` 和`firstColZero`。

2. **用第一行/列做标记**：遍历其余元素，若 `matrix[i][j] == 0`，令 `matrix[i][0] = 0`（标记行）和 `matrix[0][j] = 0`（标记列）。

3. **置零非边界元素**：根据第一行/列的标记，将相应行列置零。

4. **处理第一行/列**：最后根据 `firstRowZero` 和 `firstColZero` 决定是否置零。

### 示意图

```text
原始矩阵:      标记后（第一行/列）:  置零后:
1 1 1          1 1 1               1 0 1
1 0 1    →     1 0 1 (标记行1,列1) 0 0 0
1 1 1          1 1 1               1 0 1
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 用第一行/列做标记 | O(m×n) | O(1) |

## 代码实现

### Go

```go
// setZeroes 将含零元素的行和列全部置零（O(1) 空间）
func setZeroes(matrix [][]int) {
    m, n := len(matrix), len(matrix[0])
    firstRowZero, firstColZero := false, false

    // 检查第一行/列是否含0
    for j := 0; j < n; j++ {
        if matrix[0][j] == 0 {
            firstRowZero = true
            break
        }
    }
    for i := 0; i < m; i++ {
        if matrix[i][0] == 0 {
            firstColZero = true
            break
        }
    }

    // 用第一行/列标记其余元素
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            if matrix[i][j] == 0 {
                matrix[i][0] = 0
                matrix[0][j] = 0
            }
        }
    }

    // 根据标记置零（非边界元素）
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            if matrix[i][0] == 0 || matrix[0][j] == 0 {
                matrix[i][j] = 0
            }
        }
    }

    // 处理第一行和第一列
    if firstRowZero {
        for j := 0; j < n; j++ {
            matrix[0][j] = 0
        }
    }
    if firstColZero {
        for i := 0; i < m; i++ {
            matrix[i][0] = 0
        }
    }
}
```

### Java

```java
class Solution {
    /**
     * 将含零元素的行和列全部置零（O(1) 空间）。
     */
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstRowZero = false, firstColZero = false;

        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) { firstRowZero = true; break; }
        for (int i = 0; i < m; i++) if (matrix[i][0] == 0) { firstColZero = true; break; }

        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }

        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;

        if (firstRowZero) for (int j = 0; j < n; j++) matrix[0][j] = 0;
        if (firstColZero) for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
}
```

### Python

```python
class Solution:
    def setZeroes(self, matrix: list[list[int]]) -> None:
        """
        将含零元素的行和列全部置零（O(1) 空间，原地修改）。
        """
        m, n = len(matrix), len(matrix[0])
        first_row_zero = any(matrix[0][j] == 0 for j in range(n))
        first_col_zero = any(matrix[i][0] == 0 for i in range(m))

        # 用第一行/列标记
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0

        # 按标记置零
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0

        if first_row_zero:
            for j in range(n): matrix[0][j] = 0
        if first_col_zero:
            for i in range(m): matrix[i][0] = 0
```

## 踩坑记录

- **先记录第一行/列是否含零**：在用第一行/列做标记之前必须先保存其原始状态，否则标记阶段写入的 0 会污染原始信息，导致第一行/列被错误置零。
- **最后处理第一行/列**：最后才根据 `firstRowZero/firstColZero` 处理，确保第一行/列不影响中间的标记解读。
- **O(1) 的本质**：借用矩阵自身存储标记，无需额外数组，但需要小心操作顺序。

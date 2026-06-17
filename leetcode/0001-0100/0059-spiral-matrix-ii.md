# 0059. Spiral Matrix II

---
编号: 59
题目: Spiral Matrix II
难度: 中等
标签: [数组, 矩阵, 模拟]
来源链接: https://leetcode.com/problems/spiral-matrix-ii/
---

## 题目描述

给定正整数 `n`，生成一个 n×n 的矩阵，按**顺时针螺旋顺序**填入从 1 到 n² 的整数，并返回该矩阵。

### Example 1

```text
Input: n = 3
Output: [[1,2,3],[8,9,4],[7,6,5]]
```

### Example 2

```text
Input: n = 1
Output: [[1]]
```

### 约束条件

- `1 <= n <= 20`

## 思路分析

### 突破口

与 0054 Spiral Matrix 思路相反：0054 是"读出"螺旋顺序，本题是"写入"螺旋顺序。使用相同的四边界收缩法，将 1 到 n² 顺序填入。

### 思路拆解

1. **初始化 n×n 矩阵**，四边界 `top, bottom, left, right`。

2. **按四方向循环填入**：左→右（top 行）、上→下（right 列）、右→左（bottom 行）、下→上（left 列），每圈后收缩对应边界。

3. **计数器 `num`**：从 1 开始递增，每填一格 `num++`，直到 `num > n*n`。

### 示意图

```text
n=3 填入过程：

第1圈：
  右→ 1  2  3     (top=0, 收缩 top=1)
  ↓       4       (right=2, 收缩 right=1)
  ←  7  6  5      (bottom=2, 收缩 bottom=1)
  ↑  8            (left=0, 收缩 left=1)

中心：
  9               (top=1=bottom, left=1=right)

结果：
1 2 3
8 9 4
7 6 5
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 边界收缩 | O(n²) | O(n²)（输出矩阵） |

## 代码实现

### Go

```go
// generateMatrix 生成按顺时针螺旋顺序填入 1 到 n² 的矩阵
func generateMatrix(n int) [][]int {
    matrix := make([][]int, n)
    for i := range matrix {
        matrix[i] = make([]int, n)
    }

    top, bottom, left, right := 0, n-1, 0, n-1
    num := 1

    for top <= bottom && left <= right {
        for c := left; c <= right; c++ {
            matrix[top][c] = num
            num++
        }
        top++
        for r := top; r <= bottom; r++ {
            matrix[r][right] = num
            num++
        }
        right--
        if top <= bottom {
            for c := right; c >= left; c-- {
                matrix[bottom][c] = num
                num++
            }
            bottom--
        }
        if left <= right {
            for r := bottom; r >= top; r-- {
                matrix[r][left] = num
                num++
            }
            left++
        }
    }
    return matrix
}
```

### Java

```java
class Solution {
    /**
     * 生成按顺时针螺旋顺序填入 1 到 n² 的矩阵。
     */
    public int[][] generateMatrix(int n) {
        int[][] matrix = new int[n][n];
        int top = 0, bottom = n - 1, left = 0, right = n - 1;
        int num = 1;

        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) matrix[top][c] = num++;
            top++;
            for (int r = top; r <= bottom; r++) matrix[r][right] = num++;
            right--;
            if (top <= bottom) {
                for (int c = right; c >= left; c--) matrix[bottom][c] = num++;
                bottom--;
            }
            if (left <= right) {
                for (int r = bottom; r >= top; r--) matrix[r][left] = num++;
                left++;
            }
        }
        return matrix;
    }
}
```

### Python

```python
class Solution:
    def generateMatrix(self, n: int) -> list[list[int]]:
        """
        生成按顺时针螺旋顺序填入 1 到 n² 的矩阵。
        """
        matrix = [[0] * n for _ in range(n)]
        top, bottom, left, right = 0, n - 1, 0, n - 1
        num = 1

        while top <= bottom and left <= right:
            for c in range(left, right + 1):
                matrix[top][c] = num; num += 1
            top += 1
            for r in range(top, bottom + 1):
                matrix[r][right] = num; num += 1
            right -= 1
            if top <= bottom:
                for c in range(right, left - 1, -1):
                    matrix[bottom][c] = num; num += 1
                bottom -= 1
            if left <= right:
                for r in range(bottom, top - 1, -1):
                    matrix[r][left] = num; num += 1
                left += 1

        return matrix
```

## 踩坑记录

- **下行/左列额外边界检查**：与 0054 完全相同，走完上行和右列后需要判断 `top <= bottom` 和 `left <= right`，否则单行/列情况会重复填写。
- **n=1 时**：循环只走上行（填入 1），`top++` 后越界，结束。结果为 `[[1]]`，正确。
- **与 0054 对比**：0054 从矩阵读数字，本题向矩阵写数字，框架完全相同，只是 `result.append` 换成 `matrix[r][c] = num`。

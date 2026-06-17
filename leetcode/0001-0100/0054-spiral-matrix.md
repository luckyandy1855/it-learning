# 0054. Spiral Matrix

---
编号: 54
题目: Spiral Matrix
难度: 中等
标签: [数组, 矩阵, 模拟]
来源链接: https://leetcode.com/problems/spiral-matrix/
---

## 题目描述

给定一个 m×n 的矩阵，按**顺时针螺旋顺序**返回矩阵中所有元素。

### Example 1

```text
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]
```

### Example 2

```text
Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]
```

### 约束条件

- `m == matrix.length`，`n == matrix[i].length`
- `1 <= m, n <= 10`
- `-100 <= matrix[i][j] <= 100`

## 思路分析

### 突破口

维护四个边界（上、下、左、右），每次走完一条边就缩小对应边界，直到边界越界。

### 思路拆解

1. **边界收缩**：`top, bottom, left, right` 初始化为矩阵四边。

2. **四方向遍历**：先左→右（top 行），再上→下（right 列），再右→左（bottom 行），再下→上（left 列），每走完一方向收缩对应边界。

3. **终止条件**：`top > bottom` 或 `left > right` 时结束。

### 示意图

```text
matrix:           第1圈：          第2圈：
1  2  3           → 1 2 3          → 5
4  5  6           ↓     6          ↑ ↓
7  8  9           ← 9 8 7          ← 5
                  ↑ 4

top=0,bot=2,l=0,r=2
走完后：top=1,bot=1,l=1,r=1 → 只剩中心5
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 边界收缩 | O(m×n) | O(1)（输出不计） |

## 代码实现

### Go

```go
// spiralOrder 按顺时针螺旋顺序返回矩阵所有元素
func spiralOrder(matrix [][]int) []int {
    m, n := len(matrix), len(matrix[0])
    result := make([]int, 0, m*n)
    top, bottom, left, right := 0, m-1, 0, n-1

    for top <= bottom && left <= right {
        // 上行：从左到右
        for c := left; c <= right; c++ {
            result = append(result, matrix[top][c])
        }
        top++
        // 右列：从上到下
        for r := top; r <= bottom; r++ {
            result = append(result, matrix[r][right])
        }
        right--
        // 下行：从右到左（需确认还有行）
        if top <= bottom {
            for c := right; c >= left; c-- {
                result = append(result, matrix[bottom][c])
            }
            bottom--
        }
        // 左列：从下到上（需确认还有列）
        if left <= right {
            for r := bottom; r >= top; r-- {
                result = append(result, matrix[r][left])
            }
            left++
        }
    }
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 按顺时针螺旋顺序返回矩阵所有元素。
     */
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;

        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) result.add(matrix[top][c]);
            top++;
            for (int r = top; r <= bottom; r++) result.add(matrix[r][right]);
            right--;
            if (top <= bottom) {
                for (int c = right; c >= left; c--) result.add(matrix[bottom][c]);
                bottom--;
            }
            if (left <= right) {
                for (int r = bottom; r >= top; r--) result.add(matrix[r][left]);
                left++;
            }
        }
        return result;
    }
}
```

### Python

```python
class Solution:
    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
        """
        按顺时针螺旋顺序返回矩阵所有元素。
        """
        result = []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1

        while top <= bottom and left <= right:
            for c in range(left, right + 1):
                result.append(matrix[top][c])
            top += 1
            for r in range(top, bottom + 1):
                result.append(matrix[r][right])
            right -= 1
            if top <= bottom:
                for c in range(right, left - 1, -1):
                    result.append(matrix[bottom][c])
                bottom -= 1
            if left <= right:
                for r in range(bottom, top - 1, -1):
                    result.append(matrix[r][left])
                left += 1

        return result
```

## 踩坑记录

- **下行和左列需要额外边界判断**：走完上行和右列后，`top` 和 `right` 已更新，若此时 `top > bottom` 或 `left > right` 说明只剩单行/列，不能再走下行/左列，否则会重复采集元素。
- **只有一行的矩阵**：只会走上行，`top++` 后 `top > bottom`，循环直接退出。
- **只有一列的矩阵**：只会走上行（单元素）和右列，两步后边界越界退出。

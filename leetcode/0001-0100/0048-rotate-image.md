# 0048. Rotate Image

---
编号: 48
题目: Rotate Image
难度: 中等
标签: [数组, 数学, 矩阵]
来源链接: https://leetcode.com/problems/rotate-image/
---

## 题目描述

给定一个 n×n 的二维矩阵 `matrix`，将其**原地顺时针旋转 90 度**。

题目要求：必须原地修改，不能使用额外矩阵。

### Example 1

```text
Input:  [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]
```

### Example 2

```text
Input:  [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

### 约束条件

- `n == matrix.length == matrix[i].length`
- `1 <= n <= 20`
- `-1000 <= matrix[i][j] <= 1000`

## 思路分析

### 突破口

顺时针旋转 90° = **先转置（沿主对角线翻转）+ 再水平翻转**。两步各 O(n²)，原地操作。

### 思路拆解

1. **转置**：`matrix[i][j]` 和 `matrix[j][i]` 互换（`i < j`），得到矩阵的转置。

2. **水平翻转**：每行左右镜像翻转（`matrix[i][j]` 和 `matrix[i][n-1-j]` 互换）。

3. **为什么这等于顺时针旋转**：顺时针旋转后 `(i,j) → (j, n-1-i)`。转置后 `(i,j) → (j,i)`，再水平翻转 `(j,i) → (j, n-1-i)`，恰好对应。

### 示意图

```text
原始:                 转置后:               水平翻转后:
1 2 3                1 4 7                7 4 1
4 5 6  → 转置 →      2 5 8  → 水平翻转 → 8 5 2
7 8 9                3 6 9                9 6 3
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 转置 + 水平翻转 | O(n²) | O(1) |

## 代码实现

### Go

```go
// rotate 将 n×n 矩阵原地顺时针旋转 90 度
// 参数：matrix n×n 整数矩阵（原地修改）
func rotate(matrix [][]int) {
    n := len(matrix)

    // 步骤1：转置（沿主对角线交换）
    for i := 0; i < n; i++ {
        for j := i + 1; j < n; j++ {
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        }
    }

    // 步骤2：水平翻转（每行左右镜像）
    for i := 0; i < n; i++ {
        for j := 0; j < n/2; j++ {
            matrix[i][j], matrix[i][n-1-j] = matrix[i][n-1-j], matrix[i][j]
        }
    }
}
```

### Java

```java
class Solution {
    /**
     * 将 n×n 矩阵原地顺时针旋转 90 度。
     *
     * @param matrix n×n 整数矩阵（原地修改）
     */
    public void rotate(int[][] matrix) {
        int n = matrix.length;

        // 步骤1：转置
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) {
                int tmp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = tmp;
            }

        // 步骤2：水平翻转
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n / 2; j++) {
                int tmp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];
                matrix[i][n - 1 - j] = tmp;
            }
    }
}
```

### Python

```python
class Solution:
    def rotate(self, matrix: list[list[int]]) -> None:
        """
        将 n×n 矩阵原地顺时针旋转 90 度。

        参数:
            matrix: n×n 整数矩阵（原地修改）
        """
        n = len(matrix)

        # 步骤1：转置
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

        # 步骤2：水平翻转
        for row in matrix:
            row.reverse()
```

## 踩坑记录

- **转置只交换上三角**：`j` 从 `i+1` 开始（不是 0），避免重复交换又换回去。
- **水平翻转只交换左半**：`j` 到 `n//2`（不包含），否则会把已翻转的再翻回去。
- **逆时针旋转的方法**：逆时针旋转 = 先水平翻转 + 再转置（步骤顺序相反），不要记混。

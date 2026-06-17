# 0074. Search a 2D Matrix

---
编号: 74
题目: Search a 2D Matrix
难度: 中等
标签: [数组, 二分查找, 矩阵]
来源链接: https://leetcode.com/problems/search-a-2d-matrix/
---

## 题目描述

给定一个 m×n 的整数矩阵，具有如下特性：
- 每行中的整数从左到右升序排列。
- 每行第一个整数大于前一行的最后一个整数。

给定整数 `target`，判断 `target` 是否在矩阵中。

### Example 1

```text
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true
```

### Example 2

```text
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false
```

### 约束条件

- `m == matrix.length`，`n == matrix[i].length`
- `1 <= m, n <= 100`
- `-10^4 <= matrix[i][j] <= 10^4`
- 矩阵中所有元素严格递增（无重复）

## 思路分析

### 突破口

将 m×n 矩阵"展平"视为 m×n 个元素的有序一维数组，在 `[0, m*n-1]` 范围内做二分搜索。

### 思路拆解

1. **展平映射**：一维索引 `mid` 对应矩阵中 `matrix[mid/n][mid%n]`。

2. **标准二分**：在 `[0, m*n-1]` 上做二分，比较 `matrix[mid/n][mid%n]` 与 `target`。

### 示意图

```text
matrix:             展平视图:
1   3   5   7       idx: 0  1  2  3
10  11  16  20           4  5  6  7
23  30  34  60           8  9  10 11

idx=5 → matrix[5/4][5%4] = matrix[1][1] = 11
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 展平二分 | O(log(m×n)) | O(1) |

## 代码实现

### Go

```go
// searchMatrix 在 m×n 升序矩阵中搜索目标值
func searchMatrix(matrix [][]int, target int) bool {
    m, n := len(matrix), len(matrix[0])
    lo, hi := 0, m*n-1

    for lo <= hi {
        mid := lo + (hi-lo)/2
        val := matrix[mid/n][mid%n]
        if val == target {
            return true
        } else if val < target {
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return false
}
```

### Java

```java
class Solution {
    /**
     * 在 m×n 升序矩阵中搜索目标值（展平二分）。
     */
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int lo = 0, hi = m * n - 1;

        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            else if (val < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return false;
    }
}
```

### Python

```python
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        """
        在 m×n 升序矩阵中搜索目标值（展平二分）。
        """
        m, n = len(matrix), len(matrix[0])
        lo, hi = 0, m * n - 1

        while lo <= hi:
            mid = (lo + hi) // 2
            val = matrix[mid // n][mid % n]
            if val == target:
                return True
            elif val < target:
                lo = mid + 1
            else:
                hi = mid - 1

        return False
```

## 踩坑记录

- **行列映射 `mid/n` 和 `mid%n`**：展平后的索引必须整除列数 `n` 得行号，取模得列号，搞反会越界或产生错误结果。
- **与 0240 Search a 2D Matrix II 区分**：本题每行首元素大于上一行末元素（严格有序可展平），0240 仅保证行内和列内递增（不可直接展平，需要从右上角搜索）。
- **边界 `hi = m*n-1`**：从 0 到 `m*n-1` 共 m×n 个索引，确认不越界。

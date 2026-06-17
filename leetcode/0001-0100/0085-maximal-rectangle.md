# 0085. Maximal Rectangle

---
编号: 85
题目: Maximal Rectangle
难度: 困难
标签: [栈, 数组, 动态规划, 矩阵, 单调栈]
来源链接: https://leetcode.com/problems/maximal-rectangle/
---

## 题目描述

给定一个仅含 `'0'` 和 `'1'` 的二维二进制矩阵 `matrix`，找出只包含 `'1'` 的**最大矩形**，并返回其面积。

### Example 1

```text
Input: matrix = [["1","0","1","0","0"],
                  ["1","0","1","1","1"],
                  ["1","1","1","1","1"],
                  ["1","0","0","1","0"]]
Output: 6
```

### Example 2

```text
Input: matrix = [["0"]]
Output: 0
```

### 约束条件

- `rows == matrix.length`，`cols == matrix[i].length`
- `1 <= rows, cols <= 200`
- `matrix[i][j]` 为 `'0'` 或 `'1'`

## 思路分析

### 突破口

将每一行视为一个"柱状图的底部"：`heights[j]` 表示从当前行向上连续 `'1'` 的个数，然后对每行的 heights 数组调用 0084 的单调栈求最大矩形。

### 思路拆解

1. **逐行更新 heights**：若 `matrix[i][j] == '1'`，则 `heights[j]++`；否则 `heights[j] = 0`（断开连续）。

2. **对每行 heights 求最大矩形面积**：调用 0084 的单调栈算法。

3. **维护全局最大值**。

### 示意图

```text
matrix 逐行的 heights：
行0: [1,0,1,0,0]
行1: [2,0,2,1,1]
行2: [3,1,3,2,2]  ← 对此 heights 求最大矩形 = 6（高2宽3）
行3: [4,0,0,3,0]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 逐行 + 单调栈 | O(rows × cols) | O(cols) |

## 代码实现

### Go

```go
// maximalRectangle 返回二进制矩阵中只含 '1' 的最大矩形面积
func maximalRectangle(matrix [][]byte) int {
    if len(matrix) == 0 {
        return 0
    }
    cols := len(matrix[0])
    heights := make([]int, cols)
    maxArea := 0

    for _, row := range matrix {
        // 更新 heights
        for j := 0; j < cols; j++ {
            if row[j] == '1' {
                heights[j]++
            } else {
                heights[j] = 0
            }
        }
        // 用单调栈求当前 heights 的最大矩形
        area := largestRectangleArea(heights)
        if area > maxArea {
            maxArea = area
        }
    }
    return maxArea
}

func largestRectangleArea(heights []int) int {
    h := append(heights, 0)
    stack := []int{-1}
    maxArea := 0
    for i := 0; i < len(h); i++ {
        for len(stack) > 1 && h[i] < h[stack[len(stack)-1]] {
            top := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            width := i - stack[len(stack)-1] - 1
            if a := h[top] * width; a > maxArea {
                maxArea = a
            }
        }
        stack = append(stack, i)
    }
    return maxArea
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回二进制矩阵中只含 '1' 的最大矩形面积。
     */
    public int maximalRectangle(char[][] matrix) {
        if (matrix.length == 0) return 0;
        int cols = matrix[0].length;
        int[] heights = new int[cols];
        int maxArea = 0;

        for (char[] row : matrix) {
            for (int j = 0; j < cols; j++)
                heights[j] = row[j] == '1' ? heights[j] + 1 : 0;
            maxArea = Math.max(maxArea, largestRectangleArea(heights));
        }
        return maxArea;
    }

    private int largestRectangleArea(int[] heights) {
        int n = heights.length;
        int[] h = new int[n + 1];
        System.arraycopy(heights, 0, h, 0, n);
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(-1);
        int maxArea = 0;
        for (int i = 0; i <= n; i++) {
            while (stack.peek() != -1 && h[i] < h[stack.peek()]) {
                int top = stack.pop();
                maxArea = Math.max(maxArea, h[top] * (i - stack.peek() - 1));
            }
            stack.push(i);
        }
        return maxArea;
    }
}
```

### Python

```python
class Solution:
    def maximalRectangle(self, matrix: list[list[str]]) -> int:
        """
        返回二进制矩阵中只含 '1' 的最大矩形面积。
        """
        if not matrix:
            return 0
        cols = len(matrix[0])
        heights = [0] * cols
        max_area = 0

        for row in matrix:
            for j in range(cols):
                heights[j] = heights[j] + 1 if row[j] == '1' else 0
            max_area = max(max_area, self._largest_rectangle(heights))

        return max_area

    def _largest_rectangle(self, heights: list[int]) -> int:
        """单调栈求柱状图最大矩形（0084 解法）。"""
        h = heights + [0]
        stack = [-1]
        max_area = 0
        for i, height in enumerate(h):
            while len(stack) > 1 and height < h[stack[-1]]:
                top = stack.pop()
                max_area = max(max_area, h[top] * (i - stack[-1] - 1))
            stack.append(i)
        return max_area
```

## 踩坑记录

- **heights 数组需要按列维护**：每行的 heights[j] 是从当前行往上累加的，不是每行重置；遇 `'0'` 才清零（连续中断）。
- **单调栈函数可以直接复用 0084**：两道题解法完全相同，0085 的核心是将二维矩阵问题转化为一维柱状图问题。
- **Go 中 `append(heights, 0)` 可能修改原切片**：若 `heights` 有足够容量，`append` 会在原底层数组追加，导致 heights 的第 n+1 个位置被写入 0——但此处是局部变量 `h`，不影响外层的 `heights`；若担心，可以先 `copy` 一份。

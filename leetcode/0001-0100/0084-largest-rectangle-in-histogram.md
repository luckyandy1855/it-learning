# 0084. Largest Rectangle in Histogram

---
编号: 84
题目: Largest Rectangle in Histogram
难度: 困难
标签: [栈, 数组, 单调栈]
来源链接: https://leetcode.com/problems/largest-rectangle-in-histogram/
---

## 题目描述

给定一个整数数组 `heights`，表示柱状图中每根柱子的高度，柱子宽度均为 1。返回柱状图中能勾勒出的**最大矩形**的面积。

### Example 1

```text
Input: heights = [2,1,5,6,2,3]
Output: 10
Explanation: 最大矩形由高度5和6的两根柱子组成，面积=5×2=10
```

### Example 2

```text
Input: heights = [2,4]
Output: 4
```

### 约束条件

- `1 <= heights.length <= 10^5`
- `0 <= heights[i] <= 10^4`

## 思路分析

### 突破口

单调栈：维护一个高度递增的栈；当遇到比栈顶低的柱子时，弹出栈顶并以弹出高度为最大高度计算矩形宽度（宽度由当前下标和新栈顶下标决定）。

### 思路拆解

1. **单调递增栈**：栈存下标，当 `heights[i] < heights[stack.top()]` 时弹出并计算面积。

2. **宽度计算**：弹出下标 `top` 时，宽度 = `i - stack.top() - 1`（`stack.top()` 是新栈顶，弹出后的左边界）；若栈空则宽度 = `i`。

3. **哨兵**：在末尾追加高度 0 强制弹出所有残留元素；在栈底压入 -1 作为左边界哨兵。

### 示意图

```text
heights = [2,1,5,6,2,3]
追加0: [2,1,5,6,2,3,0]
栈底哨兵: [-1]

i=0: push 0        → stack=[-1,0]
i=1: 1<2, pop 0, h=2, w=1-(-1)-1=1, area=2; push 1 → stack=[-1,1]
i=2: push 2        → stack=[-1,1,2]
i=3: push 3        → stack=[-1,1,2,3]
i=4: 2<6, pop 3, h=6, w=4-2-1=1, area=6
      2<5, pop 2, h=5, w=4-1-1=2, area=10 ← 最大
      push 4       → stack=[-1,1,4]
i=5: push 5        → stack=[-1,1,4,5]
i=6: 0<3, pop 5, h=3, w=6-4-1=1, area=3
      0<2, pop 4, h=2, w=6-1-1=4, area=8
      0<1, pop 1, h=1, w=6-(-1)-1=6, area=6

最大面积: 10
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 单调栈 | O(n) | O(n) |

## 代码实现

### Go

```go
// largestRectangleArea 返回柱状图中最大矩形的面积
func largestRectangleArea(heights []int) int {
    heights = append(heights, 0) // 哨兵，强制清空栈
    stack := []int{-1}           // 栈底哨兵
    maxArea := 0

    for i := 0; i < len(heights); i++ {
        for len(stack) > 1 && heights[i] < heights[stack[len(stack)-1]] {
            top := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            width := i - stack[len(stack)-1] - 1
            area := heights[top] * width
            if area > maxArea {
                maxArea = area
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
     * 返回柱状图中最大矩形的面积（单调栈）。
     */
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        int[] h = new int[n + 1]; // 末尾追加0
        System.arraycopy(heights, 0, h, 0, n);

        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(-1); // 哨兵
        int maxArea = 0;

        for (int i = 0; i <= n; i++) {
            while (stack.peek() != -1 && h[i] < h[stack.peek()]) {
                int top = stack.pop();
                int width = i - stack.peek() - 1;
                maxArea = Math.max(maxArea, h[top] * width);
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
    def largestRectangleArea(self, heights: list[int]) -> int:
        """
        返回柱状图中最大矩形的面积（单调栈）。
        """
        heights = heights + [0]  # 末尾哨兵
        stack = [-1]              # 栈底哨兵
        max_area = 0

        for i, h in enumerate(heights):
            while len(stack) > 1 and h < heights[stack[-1]]:
                top = stack.pop()
                width = i - stack[-1] - 1
                max_area = max(max_area, heights[top] * width)
            stack.append(i)

        return max_area
```

## 踩坑记录

- **宽度计算 `i - stack.top() - 1`**：弹出 `top` 后，新栈顶是左边界（被 `top` 左侧的第一个更矮的柱子），宽度是从新栈顶右侧到 `i` 左侧之间的范围。
- **哨兵 -1 的作用**：当栈弹空后（即当前矩形能延伸到最左侧），宽度 = `i - (-1) - 1 = i`，不需要单独处理栈空的情况。
- **末尾追加 0 的作用**：确保所有柱子都被弹出并计算面积，否则结束时栈中残留的递增序列不会被处理。

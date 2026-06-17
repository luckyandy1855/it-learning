# 0011. Container With Most Water

---
编号: 11
题目: Container With Most Water
难度: 中等
标签: [贪心, 数组, 双指针]
来源链接: https://leetcode.com/problems/container-with-most-water/
---

## 题目描述

给定长度为 `n` 的非负整数数组 `height`，每个元素代表坐标 `(i, height[i])` 处的一根垂直线。在坐标轴上，两根线及 x 轴之间可以盛水，盛水量等于两线间距 × 较短线的高度。

找出能盛最多水的两根线，返回最大盛水量。

题目保证：

- 不能倾斜容器。

### Example 1

```text
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: 选下标 1（高度 8）和下标 8（高度 7），宽度 7，水量 = min(8,7) * 7 = 49。
```

### Example 2

```text
Input: height = [1,1]
Output: 1
```

### 约束条件

- `n == height.length`
- `2 <= n <= 10^5`
- `0 <= height[i] <= 10^4`

## 思路分析

### 突破口

双指针从两端向中间夹逼：每次移动**较短的那根线**，因为移动较长线只会让水量减少或不变（宽度缩小而高度上限不增）。

### 思路拆解

1. **暴力解**：枚举所有 (i, j) 对，计算水量取最大值，O(n²)，数组大时超时。

2. **问题转化**：水量 = `min(h[l], h[r]) * (r - l)`。固定较短边时，向内移动只会减少宽度，无法增加高度上限，所以可以放弃这一端。

3. **双指针贪心**：`l=0, r=n-1`，每步记录当前水量，然后将高度较小的指针向内移动一步，直到两指针相遇。

4. **实现要点**：若两端高度相等，移动哪端都行（移动任意一端高度上限不增，结果不变）。

### 示意图

```text
height = [1,8,6,2,5,4,8,3,7]
           0 1 2 3 4 5 6 7 8

初始: l=0(h=1), r=8(h=7), 水量 = min(1,7)*8 = 8
h[l] < h[r] → 移动 l

l=1(h=8), r=8(h=7), 水量 = min(8,7)*7 = 49  ← 当前最大
h[l] > h[r] → 移动 r

l=1(h=8), r=7(h=3), 水量 = min(8,3)*6 = 18
...继续收缩，最终 max = 49
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 暴力枚举 | O(n²) | O(1) |
| 双指针 | O(n) | O(1) |

## 代码实现

### Go

```go
// maxArea 用双指针求两线段间最大盛水量
// 参数：height 各位置的线段高度数组
// 返回：最大盛水量
func maxArea(height []int) int {
    l, r := 0, len(height)-1
    maxWater := 0

    for l < r {
        h := min(height[l], height[r])
        water := h * (r - l)
        if water > maxWater {
            maxWater = water
        }
        // 移动较短的那根线（移动较长线水量只会更小）
        if height[l] < height[r] {
            l++
        } else {
            r--
        }
    }
    return maxWater
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}
```

### Java

```java
class Solution {
    /**
     * 用双指针求两线段间最大盛水量。
     *
     * @param height 各位置线段高度数组
     * @return 最大盛水量
     */
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1;
        int maxWater = 0;

        while (l < r) {
            int water = Math.min(height[l], height[r]) * (r - l);
            maxWater = Math.max(maxWater, water);
            // 移动较短的线，保留可能有更大高度的那一边
            if (height[l] < height[r]) l++;
            else r--;
        }
        return maxWater;
    }
}
```

### Python

```python
class Solution:
    def maxArea(self, height: list[int]) -> int:
        """
        用双指针求两线段间最大盛水量。

        参数:
            height: 各位置线段高度数组
        返回:
            最大盛水量
        """
        l, r = 0, len(height) - 1
        max_water = 0

        while l < r:
            water = min(height[l], height[r]) * (r - l)
            max_water = max(max_water, water)
            # 移动较短的线
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1

        return max_water
```

## 踩坑记录

- **贪心正确性**：移动较短线是安全的，因为：设 `h[l] < h[r]`，固定 `l` 与任何 `r' < r` 组合的水量 ≤ `min(h[l], h[r']) * (r'-l) ≤ h[l] * (r-l)`，不可能超过当前记录的值。所以可以放弃 `l`。
- **等高时移动哪端无所谓**：两端等高时，任意移动一端，高度上限最多维持不变但宽度减小，不会错过最优解。
- **不是排序问题**：不要先排序再贪心，破坏位置信息后无法计算宽度。

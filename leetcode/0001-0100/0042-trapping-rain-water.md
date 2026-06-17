# 0042. Trapping Rain Water

---
编号: 42
题目: Trapping Rain Water
难度: 困难
标签: [栈, 数组, 双指针, 动态规划, 单调栈]
来源链接: https://leetcode.com/problems/trapping-rain-water/
---

## 题目描述

给定 `n` 个非负整数，代表每个宽度为 1 的柱子的高度，计算按此排列的柱子能接住多少雨水。

### Example 1

```text
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: 蓝色部分是能接住的雨水。
```

### Example 2

```text
Input: height = [4,2,0,3,2,5]
Output: 9
```

### 约束条件

- `n == height.length`
- `1 <= n <= 2 * 10^4`
- `0 <= height[i] <= 10^5`

## 思路分析

### 突破口

每个位置能接的水 = `min(左侧最高柱, 右侧最高柱) - 当前高度`。双指针从两端向中间夹逼：每次处理较低一侧，其左右边界中的较低值已经确定（等于另一侧的当前高度），O(n) 时间 O(1) 空间。

### 思路拆解

1. **预处理左右最大值**：两次遍历分别计算 `leftMax[i]` 和 `rightMax[i]`，再遍历一次累加，O(n) 时间 O(n) 空间。

2. **双指针（推荐）**：`l=0, r=n-1`，维护 `leftMax, rightMax`。若 `leftMax <= rightMax`，`l` 位置能接的水由 `leftMax` 决定（右侧一定有更高的柱子），计算后 `l++`；否则对 `r` 做对称处理，`r--`。

3. **实现要点**：每步先更新当前位置的最大值，再计算积水（最大值不小于当前高度，积水非负）。

### 示意图

```text
height = [4,2,0,3,2,5]

l=0(4), r=5(5): leftMax=4 < rightMax=5 → water+=max(4,4)-4=0, l++
l=1(2), r=5(5): leftMax=4 > rightMax=5? 不, leftMax=4 <= rightMax=5 → water+=4-2=2, l++
l=2(0), r=5(5): leftMax=4 → water+=4-0=4, l++
l=3(3), r=5(5): leftMax=4 → water+=4-3=1, l++
l=4(2), r=5(5): leftMax=4 → water+=4-2=2, l++
l=5(5), r=5(5): l==r, 停止

total = 0+2+4+1+2 = 9 ✓
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 预处理左右最大值 | O(n) | O(n) |
| 双指针 | O(n) | O(1) |

## 代码实现

### Go

```go
// trap 计算柱状图中能接住的雨水总量
// 参数：height 各柱子高度数组
// 返回：能接住的雨水单位数
func trap(height []int) int {
    l, r := 0, len(height)-1
    leftMax, rightMax := 0, 0
    total := 0

    for l < r {
        if height[l] < height[r] {
            // 左侧较低，当前位置积水由 leftMax 决定
            if height[l] > leftMax {
                leftMax = height[l]
            }
            total += leftMax - height[l]
            l++
        } else {
            // 右侧较低，当前位置积水由 rightMax 决定
            if height[r] > rightMax {
                rightMax = height[r]
            }
            total += rightMax - height[r]
            r--
        }
    }
    return total
}
```

### Java

```java
class Solution {
    /**
     * 计算柱状图中能接住的雨水总量。
     *
     * @param height 各柱子高度数组
     * @return 能接住的雨水单位数
     */
    public int trap(int[] height) {
        int l = 0, r = height.length - 1;
        int leftMax = 0, rightMax = 0, total = 0;

        while (l < r) {
            if (height[l] < height[r]) {
                leftMax = Math.max(leftMax, height[l]);
                total += leftMax - height[l];
                l++;
            } else {
                rightMax = Math.max(rightMax, height[r]);
                total += rightMax - height[r];
                r--;
            }
        }
        return total;
    }
}
```

### Python

```python
class Solution:
    def trap(self, height: list[int]) -> int:
        """
        计算柱状图中能接住的雨水总量。

        参数:
            height: 各柱子高度数组
        返回:
            能接住的雨水单位数
        """
        l, r = 0, len(height) - 1
        left_max = right_max = 0
        total = 0

        while l < r:
            if height[l] < height[r]:
                left_max = max(left_max, height[l])
                total += left_max - height[l]
                l += 1
            else:
                right_max = max(right_max, height[r])
                total += right_max - height[r]
                r -= 1

        return total
```

## 踩坑记录

- **先更新 max 再计算积水**：若先计算再更新，在当前高度比 max 还高时会得到负数积水（max 还未更新到当前高度）。
- **双指针正确性**：当 `height[l] < height[r]` 时，`l` 位置积水 = `leftMax - height[l]`，因为右侧一定存在不低于 `rightMax >= height[r] > height[l]` 的柱子，所以右边界不是瓶颈，`leftMax` 就是上界。
- **与接雨水（单调栈版）的区别**：本题双指针更简洁；单调栈版计算每"坑"的水量，适合扩展到计算每个坑的宽度等变体题。

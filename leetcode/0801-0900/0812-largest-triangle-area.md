# 0812. Largest Triangle Area

---
编号: 812
题目: Largest Triangle Area
难度: 简单
标签: [几何, 数组, 数学]
来源链接: https://leetcode.com/problems/largest-triangle-area/
---

## 题目描述

给你一个由 **X-Y** 平面上的点组成的数组 `points` ，其中 `points[i] = [xi, yi]` 。从其中取任意三个不同的点组成三角形，返回能组成的最大三角形的面积。与真实值误差在 `10^-5` 内的答案将会视为正确答案**。**

示例 1：

```text
输入：points = [[0,0],[0,1],[1,0],[0,2],[2,0]]
输出：2.00000
解释：输入中的 5 个点如上图所示，红色的三角形面积最大。
```

示例 2：

```text
输入：points = [[1,0],[0,0],[0,1]]
输出：0.50000
```

**提示：**

- `3 i, yi <= 50`

- 给出的所有点 **互不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「几何, 数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

给定平面上三点 $(x_1, y_1)$, $(x_2, y_2)$, $(x_3, y_3)$，其面积公式为：

S = \frac{1}{2} \left| x_1y_2 + x_2y_3 + x_3y_1 - x_1y_3 - x_2y_1 - x_3y_2 \right|

我们可以枚举所有的三点组合，计算面积的最大值。

时间复杂度 $O(n^3)$，其中 $n$ 是点的数量。空间复杂度 $O(1)$。

### 示意图

```text
输入/状态  ->  按规则更新候选状态  ->  得到答案
   |                 |                    |
  边界             不变量               返回值
```

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 参考解法 | 见「参考解法要点」 | 见「参考解法要点」 |

---

## 代码实现

### Go

```go
// Largest Triangle Area：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largestTriangleArea(points [][]int) float64 {
	ans := 0.0
	for _, p1 := range points {
		x1, y1 := p1[0], p1[1]
		for _, p2 := range points {
			x2, y2 := p2[0], p2[1]
			for _, p3 := range points {
				x3, y3 := p3[0], p3[1]
				u1, v1 := x2-x1, y2-y1
				u2, v2 := x3-x1, y3-y1
				t := float64(abs(u1*v2-u2*v1)) / 2.0
				ans = math.Max(ans, t)
			}
		}
	}
	return ans
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Largest Triangle Area：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public double largestTriangleArea(int[][] points) {
        double ans = 0;
        for (int[] p1 : points) {
            int x1 = p1[0], y1 = p1[1];
            for (int[] p2 : points) {
                int x2 = p2[0], y2 = p2[1];
                for (int[] p3 : points) {
                    int x3 = p3[0], y3 = p3[1];
                    int u1 = x2 - x1, v1 = y2 - y1;
                    int u2 = x3 - x1, v2 = y3 - y1;
                    double t = Math.abs(u1 * v2 - u2 * v1) / 2.0;
                    ans = Math.max(ans, t);
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Largest Triangle Area：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def largestTriangleArea(self, points: List[List[int]]) -> float:
        ans = 0
        for x1, y1 in points:
            for x2, y2 in points:
                for x3, y3 in points:
                    u1, v1 = x2 - x1, y2 - y1
                    u2, v2 = x3 - x1, y3 - y1
                    t = abs(u1 * v2 - u2 * v1) / 2
                    ans = max(ans, t)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

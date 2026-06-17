# 1401. Circle and Rectangle Overlapping

---
编号: 1401
题目: Circle and Rectangle Overlapping
难度: 中等
标签: [几何, 数学]
来源链接: https://leetcode.com/problems/circle-and-rectangle-overlapping/
---

## 题目描述

给你一个以 `(radius, xCenter, yCenter)` 表示的圆和一个与坐标轴平行的矩形 `(x1, y1, x2, y2)` ，其中 `(x1, y1)` 是矩形左下角的坐标，而 `(x2, y2)` 是右上角的坐标。

如果圆和矩形有重叠的部分，请你返回 `true` ，否则返回 `false` 。

换句话说，请你检测是否 **存在** 点 `(xi, yi)` ，它既在圆上也在矩形上（两者都包括点落在边界上的情况）。

示例 1 ：

```text
输入：radius = 1, xCenter = 0, yCenter = 0, x1 = 1, y1 = -1, x2 = 3, y2 = 1
输出：true
解释：圆和矩形存在公共点 (1,0) 。
```

示例 2 ：

```text
输入：radius = 1, xCenter = 1, yCenter = 1, x1 = 1, y1 = -3, x2 = 2, y2 = -1
输出：false
```

示例 3 ：

```text
输入：radius = 1, xCenter = 0, yCenter = 0, x1 = -1, y1 = 0, x2 = 0, y2 = 1
输出：true
```

**提示：**

- `1 <= radius <= 2000`

- `-10^4 <= xCenter, yCenter <= 10^4`

- `-10^4 <= x1 < x2 <= 10^4`

- `-10^4 <= y1 < y2 <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「几何, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

对于一个点 $(x, y)$，它到圆心 $(xCenter, yCenter)$ 的最短距离为 $\sqrt{(x - xCenter)^2 + (y - yCenter)^2}$，如果这个距离小于等于半径 $radius$，那么这个点就在圆内（包括边界）。

而对于矩形内（包括边界）的点，它们的横坐标 $x$ 满足 $x_1 \leq x \leq x_2$，纵坐标 $y$ 满足 $y_1 \leq y \leq y_2$。要判断圆和矩形是否有重叠的部分，相当于在矩形内找到一个点 $(x, y)$，使得 $a = |x - xCenter|$ 和 $b = |y - yCenter|$ 都取到最小值，此时若 $a^2 + b^2 \leq radius^2$，则说明圆和矩形有重叠的部分。

因此，问题转化为求 $x \in [x_1, x_2]$ 时 $a = |x - xCenter|$ 的最小值，以及 $y \in [y_1, y_2]$ 时 $b = |y - yCenter|$ 的最小值。

对于 $x \in [x_1, x_2]$：

- 如果 $x_1 \leq xCenter \leq x_2$，那么 $|x - xCenter|$ 的最小值为 $0$；
- 如果 $xCenter \lt x_1$，那么 $|x - xCenter|$ 的最小值为 $x_1 - xCenter$；
- 如果 $xCenter \gt x_2$，那么 $|x - xCenter|$ 的最小值为 $xCenter - x_2$。

同理，我们可以求出 $y \in [y_1, y_2]$ 时 $|y - yCenter|$ 的最小值。以上我们可以统一用函数 $f(i, j, k)$ 来处理。

即 $a = f(x_1, x_2, xCenter)$, $b = f(y_1, y_2, yCenter)$，如果 $a^2 + b^2 \leq radius^2$，则说明圆和矩形有重叠的部分。

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
// Circle and Rectangle Overlapping：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func checkOverlap(radius int, xCenter int, yCenter int, x1 int, y1 int, x2 int, y2 int) bool {
	f := func(i, j, k int) int {
		if i <= k && k <= j {
			return 0
		}
		if k < i {
			return i - k
		}
		return k - j
	}
	a := f(x1, x2, xCenter)
	b := f(y1, y2, yCenter)
	return a*a+b*b <= radius*radius
}
```

### Java

```java
// Circle and Rectangle Overlapping：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean checkOverlap(
        int radius, int xCenter, int yCenter, int x1, int y1, int x2, int y2) {
        int a = f(x1, x2, xCenter);
        int b = f(y1, y2, yCenter);
        return a * a + b * b <= radius * radius;
    }

    private int f(int i, int j, int k) {
        if (i <= k && k <= j) {
            return 0;
        }
        return k < i ? i - k : k - j;
    }
}
```

### Python

```python
# Circle and Rectangle Overlapping：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def checkOverlap(
        self,
        radius: int,
        xCenter: int,
        yCenter: int,
        x1: int,
        y1: int,
        x2: int,
        y2: int,
    ) -> bool:
        def f(i: int, j: int, k: int) -> int:
            if i <= k <= j:
                return 0
            return i - k if k < i else k - j

        a = f(x1, x2, xCenter)
        b = f(y1, y2, yCenter)
        return a * a + b * b <= radius * radius
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

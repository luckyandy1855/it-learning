# 0963. Minimum Area Rectangle II

---
编号: 963
题目: Minimum Area Rectangle II
难度: 中等
标签: [几何, 数组, 哈希表, 数学]
来源链接: https://leetcode.com/problems/minimum-area-rectangle-ii/
---

## 题目描述

给你一个 **X-Y **平面上的点数组 `points`，其中 `points[i] = [xi, yi]`。

返回由这些点形成的任意矩形的最小面积，矩形的边 **不一定 **平行于 X 轴和 Y 轴。如果不存在这样的矩形，则返回 `0`。

答案只需在`10^-5` 的误差范围内即可被视作正确答案。

示例 1：

```text
输入： points = [[1,2],[2,1],[1,0],[0,1]]
输出： 2.00000
解释： 最小面积矩形由 [1,2]、[2,1]、[1,0]、[0,1] 组成，其面积为 2。
```

示例 2：

```text
输入： points = [[0,1],[2,1],[1,1],[1,0],[2,0]]
输出： 1.00000
解释： 最小面积矩形由 [1,0]、[1,1]、[2,1]、[2,0] 组成，其面积为 1。
```

示例 3：

```text
输入： points = [[0,3],[1,2],[3,1],[1,3],[2,1]]
输出： 0
解释： 无法由这些点组成任何矩形。
```

**提示：**

- `1 i, yi <= 4 * 10^4`

- 所有给定的点都是 **唯一 **的。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「几何, 数组, 哈希表, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用哈希表存放所有的点，然后枚举三个点 $p_1 = (x_1, y_1)$, $p_2 = (x_2, y_2)$, $p_3 = (x_3, y_3)$，其中 $p_2$ 和 $p_3$ 是矩形的对角线的两个端点。如果 $p_1$ 和 $p_2$ 构成的直线以及 $p_1$ 和 $p_3$ 构成的直线垂直，并且第四个点 $(x_4, y_4)=(x_2 - x_1 + x_3, y_2 - y_1 + y_3)$ 存在于哈希表中，那么就找到了一个矩形。此时，我们可以计算出矩形的面积，并更新答案。

最后，如果找到满足条件的矩形，返回其中面积的最小值。否则，返回 $0$。

时间复杂度 $O(n^3)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\textit{points}$ 的长度。

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
// Minimum Area Rectangle II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minAreaFreeRect(points [][]int) float64 {
	n := len(points)
	f := func(x, y int) int {
		return x*40001 + y
	}
	s := map[int]bool{}
	for _, p := range points {
		s[f(p[0], p[1])] = true
	}
	ans := 1e20
	for i := 0; i < n; i++ {
		x1, y1 := points[i][0], points[i][1]
		for j := 0; j < n; j++ {
			if j != i {
				x2, y2 := points[j][0], points[j][1]
				for k := j + 1; k < n; k++ {
					if k != i {
						x3, y3 := points[k][0], points[k][1]
						x4, y4 := x2-x1+x3, y2-y1+y3
						if s[f(x4, y4)] {
							if (x2-x1)*(x3-x1)+(y2-y1)*(y3-y1) == 0 {
								ww := (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)
								hh := (x3-x1)*(x3-x1) + (y3-y1)*(y3-y1)
								ans = math.Min(ans, math.Sqrt(float64(ww*hh)))
							}
						}
					}
				}
			}
		}
	}
	if ans == 1e20 {
		return 0
	}
	return ans
}
```

### Java

```java
// Minimum Area Rectangle II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public double minAreaFreeRect(int[][] points) {
        int n = points.length;
        Set<Integer> s = new HashSet<>(n);
        for (int[] p : points) {
            s.add(f(p[0], p[1]));
        }
        double ans = Double.MAX_VALUE;
        for (int i = 0; i < n; ++i) {
            int x1 = points[i][0], y1 = points[i][1];
            for (int j = 0; j < n; ++j) {
                if (j != i) {
                    int x2 = points[j][0], y2 = points[j][1];
                    for (int k = j + 1; k < n; ++k) {
                        if (k != i) {
                            int x3 = points[k][0], y3 = points[k][1];
                            int x4 = x2 - x1 + x3, y4 = y2 - y1 + y3;
                            if (s.contains(f(x4, y4))) {
                                if ((x2 - x1) * (x3 - x1) + (y2 - y1) * (y3 - y1) == 0) {
                                    int ww = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
                                    int hh = (x3 - x1) * (x3 - x1) + (y3 - y1) * (y3 - y1);
                                    ans = Math.min(ans, Math.sqrt(1L * ww * hh));
                                }
                            }
                        }
                    }
                }
            }
        }
        return ans == Double.MAX_VALUE ? 0 : ans;
    }

    private int f(int x, int y) {
        return x * 40001 + y;
    }
}
```

### Python

```python
# Minimum Area Rectangle II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minAreaFreeRect(self, points: List[List[int]]) -> float:
        s = {(x, y) for x, y in points}
        n = len(points)
        ans = inf
        for i in range(n):
            x1, y1 = points[i]
            for j in range(n):
                if j != i:
                    x2, y2 = points[j]
                    for k in range(j + 1, n):
                        if k != i:
                            x3, y3 = points[k]
                            x4 = x2 - x1 + x3
                            y4 = y2 - y1 + y3
                            if (x4, y4) in s:
                                v21 = (x2 - x1, y2 - y1)
                                v31 = (x3 - x1, y3 - y1)
                                if v21[0] * v31[0] + v21[1] * v31[1] == 0:
                                    w = sqrt(v21[0] ** 2 + v21[1] ** 2)
                                    h = sqrt(v31[0] ** 2 + v31[1] ** 2)
                                    ans = min(ans, w * h)
        return 0 if ans == inf else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

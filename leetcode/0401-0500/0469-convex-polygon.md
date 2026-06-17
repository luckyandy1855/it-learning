# 0469. Convex Polygon

---
编号: 469
题目: Convex Polygon
难度: 中等
标签: [几何, 数组, 数学]
来源链接: https://leetcode.com/problems/convex-polygon/
---

## 题目描述

给定 **X-Y** 平面上的一组点 `points` ，其中 `points[i] = [xi, yi]` 。这些点按顺序连成一个多边形。

如果该多边形为 **凸** 多边形（凸多边形的定义）则返回 `true` ，否则返回 `false` 。

你可以假设由给定点构成的多边形总是一个 简单的多边形（简单多边形的定义）。换句话说，我们要保证每个顶点处恰好是两条边的汇合点，并且这些边 **互不相交 **。

**示例 1：**

```text
输入: points = [[0,0],[0,5],[5,5],[5,0]]
输出: true
```

**示例 2：**

```text
输入: points = [[0,0],[0,10],[10,10],[10,0],[5,5]]
输出: false
```

**提示:**

- `3 i, yi <= 10^4`

- 所有点都 **不同**

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

假设当前连续的三个顶点分别为 $p_1, p_2, p_3$，我们可以计算向量 $\overrightarrow{p_1p_2}$ 和 $\overrightarrow{p_1p_3}$ 的叉积，记为 $cur$。如果 $cur$ 的方向与之前的 $pre$ 方向不一致，说明多边形不是凸多边形 🔒。否则，我们更新 $pre = cur$，继续遍历下一个顶点。

遍历结束，如果没有发现不一致的情况，说明多边形是凸多边形 🔒。

时间复杂度 $O(n)$，其中 $n$ 是顶点的数量。空间复杂度 $O(1)$。

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
// Convex Polygon：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isConvex(points [][]int) bool {
	n := len(points)
	pre, cur := 0, 0
	for i := range points {
		x1 := points[(i+1)%n][0] - points[i][0]
		y1 := points[(i+1)%n][1] - points[i][1]
		x2 := points[(i+2)%n][0] - points[i][0]
		y2 := points[(i+2)%n][1] - points[i][1]
		cur = x1*y2 - x2*y1
		if cur != 0 {
			if cur*pre < 0 {
				return false
			}
			pre = cur
		}
	}
	return true
}
```

### Java

```java
// Convex Polygon：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isConvex(List<List<Integer>> points) {
        int n = points.size();
        long pre = 0, cur = 0;
        for (int i = 0; i < n; ++i) {
            var p1 = points.get(i);
            var p2 = points.get((i + 1) % n);
            var p3 = points.get((i + 2) % n);
            int x1 = p2.get(0) - p1.get(0);
            int y1 = p2.get(1) - p1.get(1);
            int x2 = p3.get(0) - p1.get(0);
            int y2 = p3.get(1) - p1.get(1);
            cur = x1 * y2 - x2 * y1;
            if (cur != 0) {
                if (cur * pre < 0) {
                    return false;
                }
                pre = cur;
            }
        }
        return true;
    }
}
```

### Python

```python
# Convex Polygon：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isConvex(self, points: List[List[int]]) -> bool:
        n = len(points)
        pre = cur = 0
        for i in range(n):
            x1 = points[(i + 1) % n][0] - points[i][0]
            y1 = points[(i + 1) % n][1] - points[i][1]
            x2 = points[(i + 2) % n][0] - points[i][0]
            y2 = points[(i + 2) % n][1] - points[i][1]
            cur = x1 * y2 - x2 * y1
            if cur != 0:
                if cur * pre < 0:
                    return False
                pre = cur
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

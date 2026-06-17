# 0356. Line Reflection

---
编号: 356
题目: Line Reflection
难度: 中等
标签: [数组, 哈希表, 数学]
来源链接: https://leetcode.com/problems/line-reflection/
---

## 题目描述

在一个二维平面空间中，给你 n 个点的坐标。问，是否能找出一条平行于 y** **轴的直线，让这些点关于这条直线成镜像排布？

**注意**：题目数据中可能有重复的点。

**示例 1：**

```text
输入：points = [[1,1],[-1,1]]
输出：true
解释：可以找出 x = 0 这条线。
```

**示例 2：**

```text
输入：points = [[1,1],[-1,-1]]
输出：false
解释：无法找出这样一条线。
```

**提示：**

	- `n == points.length`

	- `1 <= n <= 10^4`

	- `-10^8 <= points[i][j] <= 10^8`

**进阶：**你能找到比 O(*n*^2) 更优的解法吗?

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先找出所有点中的最小、最大的 $x$ 坐标 $minX$ 和 $maxX$。若存在满足条件的直线，则直线 $x = (minX + maxX) / 2$，或者说 $s = minX + maxX$。

接下来，我们遍历每个点 $(x, y)，若 $(s - x, y)$ 不在点集里，说明不满足条件，直接返回 `false`。遍历结束返回 `true`。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $points$ 的长度。

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
// Line Reflection：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isReflected(points [][]int) bool {
	const inf = 1 << 30
	minX, maxX := inf, -inf
	pointSet := map[[2]int]bool{}
	for _, p := range points {
		minX = min(minX, p[0])
		maxX = max(maxX, p[0])
		pointSet[[2]int{p[0], p[1]}] = true
	}
	s := minX + maxX
	for _, p := range points {
		if !pointSet[[2]int{s - p[0], p[1]}] {
			return false
		}
	}
	return true
}
```

### Java

```java
// Line Reflection：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isReflected(int[][] points) {
        final int inf = 1 << 30;
        int minX = inf, maxX = -inf;
        Set<List<Integer>> pointSet = new HashSet<>();
        for (int[] p : points) {
            minX = Math.min(minX, p[0]);
            maxX = Math.max(maxX, p[0]);
            pointSet.add(List.of(p[0], p[1]));
        }
        int s = minX + maxX;
        for (int[] p : points) {
            if (!pointSet.contains(List.of(s - p[0], p[1]))) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Line Reflection：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isReflected(self, points: List[List[int]]) -> bool:
        min_x, max_x = inf, -inf
        point_set = set()
        for x, y in points:
            min_x = min(min_x, x)
            max_x = max(max_x, x)
            point_set.add((x, y))
        s = min_x + max_x
        return all((s - x, y) in point_set for x, y in points)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

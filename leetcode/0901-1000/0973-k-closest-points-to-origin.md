# 0973. K Closest Points to Origin

---
编号: 973
题目: K Closest Points to Origin
难度: 中等
标签: [几何, 数组, 数学, 分治, 快速选择, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/k-closest-points-to-origin/
---

## 题目描述

给定一个数组 `points` ，其中 `points[i] = [xi, yi]` 表示 **X-Y** 平面上的一个点，并且是一个整数 `k` ，返回离原点 `(0,0)` 最近的 `k` 个点。

这里，平面上两点之间的距离是 **欧几里德距离**（ `√(x1 - x2)^2 + (y1 - y2)^2` ）。

你可以按 **任何顺序** 返回答案。除了点坐标的顺序之外，答案 **确保** 是 **唯一** 的。

示例 1：

```text
输入：points = [[1,3],[-2,2]], k = 1
输出：[[-2,2]]
解释：
(1, 3) 和原点之间的距离为 sqrt(10)，
(-2, 2) 和原点之间的距离为 sqrt(8)，
由于 sqrt(8) < sqrt(10)，(-2, 2) 离原点更近。
我们只需要距离原点最近的 K = 1 个点，所以答案就是 [[-2,2]]。
```

示例 2：

```text
输入：points = [[3,3],[5,-1],[-2,4]], k = 2
输出：[[3,3],[-2,4]]
（答案 [[-2,4],[3,3]] 也会被接受。）
```

**提示：**

- `1 i, yi < 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「几何, 数组, 数学, 分治, 快速选择, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们将所有点按照与原点的距离从小到大排序，然后取前 $k$ 个点即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(\log n)$。其中 $n$ 为数组 $\textit{points}$ 的长度。

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
// K Closest Points to Origin：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func kClosest(points [][]int, k int) [][]int {
	sort.Slice(points, func(i, j int) bool {
		return math.Hypot(float64(points[i][0]), float64(points[i][1])) < math.Hypot(float64(points[j][0]), float64(points[j][1]))
	})
	return points[:k]
}
```

### Java

```java
// K Closest Points to Origin：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[][] kClosest(int[][] points, int k) {
        Arrays.sort(
            points, (p1, p2) -> Math.hypot(p1[0], p1[1]) - Math.hypot(p2[0], p2[1]) > 0 ? 1 : -1);
        return Arrays.copyOfRange(points, 0, k);
    }
}
```

### Python

```python
# K Closest Points to Origin：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        points.sort(key=lambda p: hypot(p[0], p[1]))
        return points[:k]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

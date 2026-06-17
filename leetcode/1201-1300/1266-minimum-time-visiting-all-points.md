# 1266. Minimum Time Visiting All Points

---
编号: 1266
题目: Minimum Time Visiting All Points
难度: 简单
标签: [几何, 数组, 数学]
来源链接: https://leetcode.com/problems/minimum-time-visiting-all-points/
---

## 题目描述

平面上有 `n` 个点，点的位置用整数坐标表示 `points[i] = [xi, yi]` 。请你计算访问所有这些点需要的 **最小时间**（以秒为单位）。

你需要按照下面的规则在平面上移动：

- 每一秒内，你可以：

- 沿水平方向移动一个单位长度，或者

- 沿竖直方向移动一个单位长度，或者

- 跨过对角线移动 `sqrt(2)` 个单位长度（可以看作在一秒内向水平和竖直方向各移动一个单位长度）。

- 必须按照数组中出现的顺序来访问这些点。

- 在访问某个点时，可以经过该点后面出现的点，但经过的那些点不算作有效访问。

**示例 1：**

```text
输入：points = [[1,1],[3,4],[-1,0]]
输出：7
解释：一条最佳的访问路径是： [1,1] -> [2,2] -> [3,3] -> [3,4] -> [2,3] -> [1,2] -> [0,1] -> [-1,0]
从 [1,1] 到 [3,4] 需要 3 秒
从 [3,4] 到 [-1,0] 需要 4 秒
一共需要 7 秒
```

**示例 2：**

```text
输入：points = [[3,2],[-2,2]]
输出：5
```

**提示：**

- `points.length == n`

- `1 <= n <= 100`

- `points[i].length == 2`

- `-1000 <= points[i][0], points[i][1] <= 1000`

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

对于两个点 $p_1=(x_1, y_1)$ 和 $p_2=(x_2, y_2)$，横坐标和纵坐标分别移动的距离分别为 $d_x = |x_1 - x_2|$ 和 $d_y = |y_1 - y_2|$。

如果 $d_x \ge d_y$，则沿对角线移动 $d_y$，再沿水平方向移动 $d_x - d_y$；如果 $d_x < d_y$，则沿对角线移动 $d_x$，再沿竖直方向移动 $d_y - d_x$。因此，两个点之间的最短距离为 $\max(d_x, d_y)$。

我们可以遍历所有的点对，计算出每个点对之间的最短距离，然后求和即可。

时间复杂度 $O(n)$，其中 $n$ 为点的个数。空间复杂度 $O(1)$。

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
// Minimum Time Visiting All Points：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minTimeToVisitAllPoints(points [][]int) (ans int) {
	for i, p := range points[1:] {
		dx := abs(p[0] - points[i][0])
		dy := abs(p[1] - points[i][1])
		ans += max(dx, dy)
	}
	return
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
// Minimum Time Visiting All Points：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minTimeToVisitAllPoints(int[][] points) {
        int ans = 0;
        for (int i = 1; i < points.length; ++i) {
            int dx = Math.abs(points[i][0] - points[i - 1][0]);
            int dy = Math.abs(points[i][1] - points[i - 1][1]);
            ans += Math.max(dx, dy);
        }
        return ans;
    }
}
```

### Python

```python
# Minimum Time Visiting All Points：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minTimeToVisitAllPoints(self, points: List[List[int]]) -> int:
        return sum(
            max(abs(p1[0] - p2[0]), abs(p1[1] - p2[1])) for p1, p2 in pairwise(points)
        )
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

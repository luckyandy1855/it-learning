# 1274. Number of Ships in a Rectangle

---
编号: 1274
题目: Number of Ships in a Rectangle
难度: 困难
标签: [数组, 分治, 交互]
来源链接: https://leetcode.com/problems/number-of-ships-in-a-rectangle/
---

## 题目描述

*(此题是 **交互式问题 **)*

在用笛卡尔坐标系表示的二维海平面上，有一些船。每一艘船都在一个整数点上，且每一个整数点最多只有 1 艘船。

有一个函数 `Sea.hasShips(topRight, bottomLeft)` ，输入参数为右上角和左下角两个点的坐标，当且仅当这两个点所表示的矩形区域（包含边界）内至少有一艘船时，这个函数才返回 `true` ，否则返回 `false` 。

给你矩形的右上角 `topRight` 和左下角 `bottomLeft` 的坐标，请你返回此矩形内船只的数目。题目保证矩形内 **至多只有 10 艘船**。

调用函数 `hasShips` **超过400次 **的提交将被判为 *错误答案（Wrong Answer）* 。同时，任何尝试绕过评测系统的行为都将被取消比赛资格。

**示例 1：**

```text
输入：
ships = [[1,1],[2,2],[3,3],[5,5]], topRight = [4,4], bottomLeft = [0,0]
输出：3
解释：在 [0,0] 到 [4,4] 的范围内总共有 3 艘船。
```

**示例 2:**

```text
输入：ans = [[1,1],[2,2],[3,3]], topRight = [1000,1000], bottomLeft = [0,0]
输出：3
```

**提示：**

- `ships` 数组只用于评测系统内部初始化。你必须“蒙着眼睛”解决这个问题。你无法得知 `ships` 的信息，所以只能通过调用 `hasShips` 接口来求解。

- `0 <= bottomLeft[0] <= topRight[0] <= 1000`

- `0 <= bottomLeft[1] <= topRight[1] <= 1000`

- `topRight != bottomLeft`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 分治, 交互」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于矩形内最多只有 $10$ 艘船，所以我们可以将矩形划分为四个子矩形，分别求出每个子矩形内船只的数目 🔒，然后将四个子矩形内船只的数目 🔒 相加即可。如果一个子矩形内没有船只，那么就不需要再继续划分了。

时间复杂度 $O(C \times \log \max(m, n))$，空间复杂度 $O(\log \max(m, n))$。其中 $C$ 为船只的数目，而 $m$ 和 $n$ 分别为矩形的长和宽。

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
// Number of Ships in a Rectangle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * // This is Sea's API interface.
 * // You should not implement it, or speculate about its implementation
 * type Sea struct {
 *     func hasShips(topRight, bottomLeft []int) bool {}
 * }
 */

func countShips(sea Sea, topRight, bottomLeft []int) int {
	x1, y1 := bottomLeft[0], bottomLeft[1]
	x2, y2 := topRight[0], topRight[1]
	if x1 > x2 || y1 > y2 {
		return 0
	}
	if !sea.hasShips(topRight, bottomLeft) {
		return 0
	}
	if x1 == x2 && y1 == y2 {
		return 1
	}
	midx := (x1 + x2) >> 1
	midy := (y1 + y2) >> 1
	a := countShips(sea, topRight, []int{midx + 1, midy + 1})
	b := countShips(sea, []int{midx, y2}, []int{x1, midy + 1})
	c := countShips(sea, []int{midx, midy}, bottomLeft)
	d := countShips(sea, []int{x2, midy}, []int{midx + 1, y1})
	return a + b + c + d
}
```

### Java

```java
// Number of Ships in a Rectangle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * // This is Sea's API interface.
 * // You should not implement it, or speculate about its implementation
 * class Sea {
 *     public boolean hasShips(int[] topRight, int[] bottomLeft);
 * }
 */

class Solution {
    public int countShips(Sea sea, int[] topRight, int[] bottomLeft) {
        int x1 = bottomLeft[0], y1 = bottomLeft[1];
        int x2 = topRight[0], y2 = topRight[1];
        if (x1 > x2 || y1 > y2) {
            return 0;
        }
        if (!sea.hasShips(topRight, bottomLeft)) {
            return 0;
        }
        if (x1 == x2 && y1 == y2) {
            return 1;
        }
        int midx = (x1 + x2) >> 1;
        int midy = (y1 + y2) >> 1;
        int a = countShips(sea, topRight, new int[] {midx + 1, midy + 1});
        int b = countShips(sea, new int[] {midx, y2}, new int[] {x1, midy + 1});
        int c = countShips(sea, new int[] {midx, midy}, bottomLeft);
        int d = countShips(sea, new int[] {x2, midy}, new int[] {midx + 1, y1});
        return a + b + c + d;
    }
}
```

### Python

```python
# Number of Ships in a Rectangle：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# """
# This is Sea's API interface.
# You should not implement it, or speculate about its implementation
# """
# class Sea:
#    def hasShips(self, topRight: 'Point', bottomLeft: 'Point') -> bool:
#
# class Point:
# 	def __init__(self, x: int, y: int):
# 		self.x = x
# 		self.y = y


class Solution:
    def countShips(self, sea: "Sea", topRight: "Point", bottomLeft: "Point") -> int:
        def dfs(topRight, bottomLeft):
            x1, y1 = bottomLeft.x, bottomLeft.y
            x2, y2 = topRight.x, topRight.y
            if x1 > x2 or y1 > y2:
                return 0
            if not sea.hasShips(topRight, bottomLeft):
                return 0
            if x1 == x2 and y1 == y2:
                return 1
            midx = (x1 + x2) >> 1
            midy = (y1 + y2) >> 1
            a = dfs(topRight, Point(midx + 1, midy + 1))
            b = dfs(Point(midx, y2), Point(x1, midy + 1))
            c = dfs(Point(midx, midy), bottomLeft)
            d = dfs(Point(x2, midy), Point(midx + 1, y1))
            return a + b + c + d

        return dfs(topRight, bottomLeft)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0593. Valid Square

---
编号: 593
题目: Valid Square
难度: 中等
标签: [几何, 数学]
来源链接: https://leetcode.com/problems/valid-square/
---

## 题目描述

给定2D空间中四个点的坐标 `p1`, `p2`, `p3` 和 `p4`，如果这四个点构成一个正方形，则返回 `true` 。

点的坐标 `pi` 表示为 `[xi, yi]` 。 `输入没有任何顺序` 。

一个 **有效的正方形** 有四条等边和四个等角(90度角)。

**示例 1:**

```text
输入: p1 = [0,0], p2 = [1,1], p3 = [1,0], p4 = [0,1]
输出: true
```

**示例 2:**

```text
输入：p1 = [0,0], p2 = [1,1], p3 = [1,0], p4 = [0,12]
输出：false
```

**示例 3:**

```text
输入：p1 = [1,0], p2 = [-1,0], p3 = [0,1], p4 = [0,-1]
输出：true
```

**提示:**

- `p1.length == p2.length == p3.length == p4.length == 2`

- `-10^4 i, yi <= 10^4`

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

若任选三个点，都能构成等腰直角三角形，说明是有效的正方形。

时间复杂度 $O(1)$。

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
// Valid Square：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func validSquare(p1 []int, p2 []int, p3 []int, p4 []int) bool {
	check := func(a, b, c []int) bool {
		x1, y1 := a[0], a[1]
		x2, y2 := b[0], b[1]
		x3, y3 := c[0], c[1]
		d1 := (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)
		d2 := (x1-x3)*(x1-x3) + (y1-y3)*(y1-y3)
		d3 := (x2-x3)*(x2-x3) + (y2-y3)*(y2-y3)
		if d1 == d2 && d1+d2 == d3 && d1 > 0 {
			return true
		}
		if d1 == d3 && d1+d3 == d2 && d1 > 0 {
			return true
		}
		if d2 == d3 && d2+d3 == d1 && d2 > 0 {
			return true
		}
		return false
	}
	return check(p1, p2, p3) && check(p1, p3, p4) && check(p1, p2, p4) && check(p2, p3, p4)
}
```

### Java

```java
// Valid Square：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean validSquare(int[] p1, int[] p2, int[] p3, int[] p4) {
        return check(p1, p2, p3) && check(p1, p3, p4) && check(p1, p2, p4) && check(p2, p3, p4);
    }

    private boolean check(int[] a, int[] b, int[] c) {
        int x1 = a[0], y1 = a[1];
        int x2 = b[0], y2 = b[1];
        int x3 = c[0], y3 = c[1];
        int d1 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        int d2 = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
        int d3 = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
        if (d1 == d2 && d1 + d2 == d3 && d1 > 0) {
            return true;
        }
        if (d1 == d3 && d1 + d3 == d2 && d1 > 0) {
            return true;
        }
        if (d2 == d3 && d2 + d3 == d1 && d2 > 0) {
            return true;
        }
        return false;
    }
}
```

### Python

```python
# Valid Square：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def validSquare(
        self, p1: List[int], p2: List[int], p3: List[int], p4: List[int]
    ) -> bool:
        def check(a, b, c):
            (x1, y1), (x2, y2), (x3, y3) = a, b, c
            d1 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
            d2 = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3)
            d3 = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3)
            return any(
                [
                    d1 == d2 and d1 + d2 == d3 and d1,
                    d2 == d3 and d2 + d3 == d1 and d2,
                    d1 == d3 and d1 + d3 == d2 and d1,
                ]
            )

        return (
            check(p1, p2, p3)
            and check(p2, p3, p4)
            and check(p1, p3, p4)
            and check(p1, p2, p4)
        )
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

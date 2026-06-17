# 0780. Reaching Points

---
编号: 780
题目: Reaching Points
难度: 困难
标签: [数学]
来源链接: https://leetcode.com/problems/reaching-points/
---

## 题目描述

给定四个整数 `sx` , `sy` ，`tx` 和 `ty`，如果通过一系列的**转换**可以从起点 `(sx, sy)` 到达终点 `(tx, ty)`，则返回 `true`，否则返回 `false`。

从点 `(x, y)` 可以**转换**到 `(x, x+y)`  或者 `(x+y, y)`。

**示例 1:**

```text
输入: sx = 1, sy = 1, tx = 3, ty = 5
输出: true
解释:
可以通过以下一系列转换从起点转换到终点：
(1, 1) -> (1, 2)
(1, 2) -> (3, 2)
(3, 2) -> (3, 5)
```

**示例 2:**

```text
输入: sx = 1, sy = 1, tx = 2, ty = 2
输出: false
```

**示例 3:**

```text
输入: sx = 1, sy = 1, tx = 1, ty = 1
输出: true
```

**提示:**

- `1 <= sx, sy, tx, ty <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

从 `(tx, ty)` 开始逆向计算，判断是否可以到达状态 `(sx, sy)`。由于逆向计算是将 tx, ty 中的较大值减少，因此当 `tx > ty` 时可以直接将 tx 的值更新为 `tx % ty`，当 `tx < ty` 时可以将 ty 的值更新为 `ty % tx`。逆向计算需要满足 `tx > sx && ty > sy && tx != ty`。

当条件不成立时，根据此时 tx 和 ty 判断是否可以从起点转换到终点。

- 如果 `tx == sx && ty == sy`，说明此时已经到达起点状态，返回 true；
- 如果 `tx == sx`，若 `ty > sy && (ty - sy) % tx == 0`，返回 true，否则返回 false；
- 如果 `ty == sy`，若 `tx > sx && (tx - sx) % ty == 0`，返回 true，否则返回 false；
- 如果 `tx ≠ sx && ty ≠ sy`，则不可以从起点转换到终点。

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
// Reaching Points：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func reachingPoints(sx int, sy int, tx int, ty int) bool {
	for tx > sx && ty > sy && tx != ty {
		if tx > ty {
			tx %= ty
		} else {
			ty %= tx
		}
	}
	if tx == sx && ty == sy {
		return true
	}
	if tx == sx {
		return ty > sy && (ty-sy)%tx == 0
	}
	if ty == sy {
		return tx > sx && (tx-sx)%ty == 0
	}
	return false
}
```

### Java

```java
// Reaching Points：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean reachingPoints(int sx, int sy, int tx, int ty) {
        while (tx > sx && ty > sy && tx != ty) {
            if (tx > ty) {
                tx %= ty;
            } else {
                ty %= tx;
            }
        }
        if (tx == sx && ty == sy) {
            return true;
        }
        if (tx == sx) {
            return ty > sy && (ty - sy) % tx == 0;
        }
        if (ty == sy) {
            return tx > sx && (tx - sx) % ty == 0;
        }
        return false;
    }
}
```

### Python

```python
# Reaching Points：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def reachingPoints(self, sx: int, sy: int, tx: int, ty: int) -> bool:
        while tx > sx and ty > sy and tx != ty:
            if tx > ty:
                tx %= ty
            else:
                ty %= tx
        if tx == sx and ty == sy:
            return True
        if tx == sx:
            return ty > sy and (ty - sy) % tx == 0
        if ty == sy:
            return tx > sx and (tx - sx) % ty == 0
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1344. Angle Between Hands of a Clock

---
编号: 1344
题目: Angle Between Hands of a Clock
难度: 中等
标签: [数学]
来源链接: https://leetcode.com/problems/angle-between-hands-of-a-clock/
---

## 题目描述

给你两个数 `hour` 和 `minutes` 。请你返回在时钟上，由给定时间的时针和分针组成的较小角的角度（60 单位制）。

**示例 1：**

```text
输入：hour = 12, minutes = 30
输出：165
```

**示例 2：**

```text
输入：hour = 3, minutes = 30
输出；75
```

**示例 3：**

****

```text
输入：hour = 3, minutes = 15
输出：7.5
```

**示例 4：**

```text
输入：hour = 4, minutes = 50
输出：155
```

**示例 5：**

```text
输入：hour = 12, minutes = 0
输出：0
```

**提示：**

- `1 <= hour <= 12`

- `0 <= minutes <= 59`

- 与标准答案误差在 `10^-5` 以内的结果都被视为正确结果。

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

时针每小时移动 30 度，每分钟移动 0.5 度。分针每分钟移动 6 度。如果指针之间的夹角大于 180 度，则取其与 360 度的差值，以确保获得最小的夹角。

时间复杂度 $O(1)$，空间复杂度 $O(1)$。

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
// Angle Between Hands of a Clock：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func angleClock(hour int, minutes int) float64 {
	h := 30*float64(hour) + 0.5*float64(minutes)
	m := 6 * float64(minutes)
	diff := math.Abs(h - m)
	return math.Min(diff, 360-diff)
}
```

### Java

```java
// Angle Between Hands of a Clock：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public double angleClock(int hour, int minutes) {
        double h = 30 * hour + 0.5 * minutes;
        double m = 6 * minutes;
        double diff = Math.abs(h - m);
        return Math.min(diff, 360 - diff);
    }
}
```

### Python

```python
# Angle Between Hands of a Clock：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def angleClock(self, hour: int, minutes: int) -> float:
        h = 30 * hour + 0.5 * minutes
        m = 6 * minutes
        diff = abs(h - m)
        return min(diff, 360 - diff)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

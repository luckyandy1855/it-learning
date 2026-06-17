# 0849. Maximize Distance to Closest Person

---
编号: 849
题目: Maximize Distance to Closest Person
难度: 中等
标签: [数组]
来源链接: https://leetcode.com/problems/maximize-distance-to-closest-person/
---

## 题目描述

给你一个数组 `seats` 表示一排座位，其中 `seats[i] = 1` 代表有人坐在第 `i` 个座位上，`seats[i] = 0` 代表座位 `i` 上是空的（**下标从 0 开始**）。

至少有一个空座位，且至少有一人已经坐在座位上。

亚历克斯希望坐在一个能够使他与离他最近的人之间的距离达到最大化的座位上。

返回他到离他最近的人的最大距离。

**示例 1：**

```text
输入：seats = [1,0,0,0,1,0,1]
输出：2
解释：
如果亚历克斯坐在第二个空位（seats[2]）上，他到离他最近的人的距离为 2 。
如果亚历克斯坐在其它任何一个空位上，他到离他最近的人的距离为 1 。
因此，他到离他最近的人的最大距离是 2 。
```

**示例 2：**

```text
输入：seats = [1,0,0,0]
输出：3
解释：
如果亚历克斯坐在最后一个座位上，他离最近的人有 3 个座位远。
这是可能的最大距离，所以答案是 3 。
```

**示例 3：**

```text
输入：seats = [0,1]
输出：1
```

**提示：**

- `2 <= seats.length <= 2 * 10^4`

- `seats[i]` 为 `0` 或 `1`

- 至少有一个 **空座位**

- 至少有一个 **座位上有人**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义两个变量 $\textit{first}$ 和 $\textit{last}$ 分别表示第一个人和最后一个人的位置，用变量 $d$ 表示两个人之间的最大距离。

然后遍历数组 $\textit{seats}$，如果当前位置有人，如果此前 $\textit{last}$ 更新过，说明此前有人，此时更新 $d = \max(d, i - \textit{last})$；如果此前 $\textit{first}$ 没有更新过，说明此前没有人，此时更新 $\textit{first} = i$。接下来更新 $\textit{last} = i$。

最后返回 $\max(\textit{first}, n - \textit{last} - 1, d / 2)$ 即可。

时间复杂度 $O(n)$，其中 $n$ 为数组 $\textit{seats}$ 的长度。空间复杂度 $O(1)$。

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
// Maximize Distance to Closest Person：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxDistToClosest(seats []int) int {
	first, last := -1, -1
	d := 0
	for i, c := range seats {
		if c == 1 {
			if last != -1 {
				d = max(d, i-last)
			}
			if first == -1 {
				first = i
			}
			last = i
		}
	}
	return max(d/2, max(first, len(seats)-last-1))
}
```

### Java

```java
// Maximize Distance to Closest Person：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxDistToClosest(int[] seats) {
        int first = -1, last = -1;
        int d = 0, n = seats.length;
        for (int i = 0; i < n; ++i) {
            if (seats[i] == 1) {
                if (last != -1) {
                    d = Math.max(d, i - last);
                }
                if (first == -1) {
                    first = i;
                }
                last = i;
            }
        }
        return Math.max(d / 2, Math.max(first, n - last - 1));
    }
}
```

### Python

```python
# Maximize Distance to Closest Person：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxDistToClosest(self, seats: List[int]) -> int:
        first = last = None
        d = 0
        for i, c in enumerate(seats):
            if c:
                if last is not None:
                    d = max(d, i - last)
                if first is None:
                    first = i
                last = i
        return max(first, len(seats) - last - 1, d // 2)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

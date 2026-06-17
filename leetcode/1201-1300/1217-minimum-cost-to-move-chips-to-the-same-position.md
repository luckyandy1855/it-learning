# 1217. Minimum Cost to Move Chips to The Same Position

---
编号: 1217
题目: Minimum Cost to Move Chips to The Same Position
难度: 简单
标签: [贪心, 数组, 数学]
来源链接: https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/
---

## 题目描述

有 `n` 个筹码。第 `i` 个筹码的位置是 `position[i]` 。

我们需要把所有筹码移到同一个位置。在一步中，我们可以将第 `i` 个筹码的位置从 `position[i]` 改变为:

- `position[i] + 2` 或 `position[i] - 2` ，此时 `cost = 0`

- `position[i] + 1` 或 `position[i] - 1` ，此时 `cost = 1`

返回将所有筹码移动到同一位置上所需要的 *最小代价* 。

**示例 1：**

```text
输入：position = [1,2,3]
输出：1
解释：第一步:将位置3的筹码移动到位置1，成本为0。
第二步:将位置2的筹码移动到位置1，成本= 1。
总成本是1。
```

**示例 2：**

```text
输入：position = [2,2,2,3,3]
输出：2
解释：我们可以把位置3的两个筹码移到位置2。每一步的成本为1。总成本= 2。
```

**示例 3:**

```text
输入：position = [1,1000000000]
输出：1
```

**提示：**

- `1 <= position.length <= 100`

- `1 <= position[i] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

将所有偶数下标的芯片移动到 0 号位置，所有奇数下标的芯片移动到 1 号位置，所有的代价为 0，接下来只需要在 0/1 号位置中选择其中一个较小数量的芯片，移动到另一个位置。所需的最小代价就是那个较小的数量。

时间复杂度 $O(n)$，其中 $n$ 为芯片的数量。空间复杂度 $O(1)$。

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
// Minimum Cost to Move Chips to The Same Position：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minCostToMoveChips(position []int) int {
	a := 0
	for _, p := range position {
		a += p & 1
	}
	b := len(position) - a
	if a < b {
		return a
	}
	return b
}
```

### Java

```java
// Minimum Cost to Move Chips to The Same Position：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minCostToMoveChips(int[] position) {
        int a = 0;
        for (int p : position) {
            a += p % 2;
        }
        int b = position.length - a;
        return Math.min(a, b);
    }
}
```

### Python

```python
# Minimum Cost to Move Chips to The Same Position：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minCostToMoveChips(self, position: List[int]) -> int:
        a = sum(p % 2 for p in position)
        b = len(position) - a
        return min(a, b)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1124. Longest Well-Performing Interval

---
编号: 1124
题目: Longest Well-Performing Interval
难度: 中等
标签: [栈, 数组, 哈希表, 前缀和, 单调栈]
来源链接: https://leetcode.com/problems/longest-well-performing-interval/
---

## 题目描述

给你一份工作时间表 `hours`，上面记录着某一位员工每天的工作小时数。

我们认为当员工一天中的工作小时数大于 `8` 小时的时候，那么这一天就是「**劳累的一天**」。

所谓「表现良好的时间段」，意味在这段时间内，「劳累的天数」是严格** 大于**「不劳累的天数」。

请你返回「表现良好时间段」的最大长度。

**示例 1：**

```text
输入：hours = [9,9,6,0,6,6,9]
输出：3
解释：最长的表现良好时间段是 [9,9,6]。
```

**示例 2：**

```text
输入：hours = [6,6,6]
输出：0
```

**提示：**

- `1 <= hours.length <= 10^4`

- `0 <= hours[i] <= 16`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 数组, 哈希表, 前缀和, 单调栈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以利用前缀和的思想，维护一个变量 $s$，表示从下标 $0$ 到当前下标的这一段，「劳累的天数」与「不劳累的天数」的差值。如果 $s$ 大于 $0$，说明从下标 $0$ 到当前下标的这一段，满足「表现良好的时间段」。另外，用哈希表 $pos$ 记录每个 $s$ 第一次出现的下标。

接下来，我们遍历数组 `hours`，对于每个下标 $i$：

- 如果 $hours[i] \gt 8$，我们就让 $s$ 加 $1$，否则减 $1$。
- 如果 $s$ 大于 $0$，说明从下标 $0$ 到当前下标的这一段，满足「表现良好的时间段」，我们更新结果 $ans = i + 1$。否则，如果 $s - 1$ 在哈希表 $pos$ 中，记 $j = pos[s - 1]$，说明从下标 $j + 1$ 到当前下标 $i$ 的这一段，满足「表现良好的时间段」，我们更新结果 $ans = \max(ans, i - j)$。
- 然后，如果 $s$ 不在哈希表 $pos$ 中，我们就记录 $pos[s] = i$。

遍历结束后，返回答案即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 `hours` 的长度。

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
// Longest Well-Performing Interval：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func longestWPI(hours []int) (ans int) {
	s := 0
	pos := map[int]int{}
	for i, x := range hours {
		if x > 8 {
			s++
		} else {
			s--
		}
		if s > 0 {
			ans = i + 1
		} else if j, ok := pos[s-1]; ok {
			ans = max(ans, i-j)
		}
		if _, ok := pos[s]; !ok {
			pos[s] = i
		}
	}
	return
}
```

### Java

```java
// Longest Well-Performing Interval：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int longestWPI(int[] hours) {
        int ans = 0, s = 0;
        Map<Integer, Integer> pos = new HashMap<>();
        for (int i = 0; i < hours.length; ++i) {
            s += hours[i] > 8 ? 1 : -1;
            if (s > 0) {
                ans = i + 1;
            } else if (pos.containsKey(s - 1)) {
                ans = Math.max(ans, i - pos.get(s - 1));
            }
            pos.putIfAbsent(s, i);
        }
        return ans;
    }
}
```

### Python

```python
# Longest Well-Performing Interval：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def longestWPI(self, hours: List[int]) -> int:
        ans = s = 0
        pos = {}
        for i, x in enumerate(hours):
            s += 1 if x > 8 else -1
            if s > 0:
                ans = i + 1
            elif s - 1 in pos:
                ans = max(ans, i - pos[s - 1])
            if s not in pos:
                pos[s] = i
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

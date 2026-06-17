# 1014. Best Sightseeing Pair

---
编号: 1014
题目: Best Sightseeing Pair
难度: 中等
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/best-sightseeing-pair/
---

## 题目描述

给你一个正整数数组 `values`，其中 `values[i]` 表示第 `i` 个观光景点的评分，并且两个景点 `i` 和 `j` 之间的 **距离** 为 `j - i`。

一对景点（`i < j`）组成的观光组合的得分为 `values[i] + values[j] + i - j` ，也就是景点的评分之和** 减去 **它们两者之间的距离。

返回一对观光景点能取得的最高分。

**示例 1：**

```text
输入：values = [8,1,5,2,6]
输出：11
解释：i = 0, j = 2, values[i] + values[j] + i - j = 8 + 5 + 0 - 2 = 11
```

**示例 2：**

```text
输入：values = [1,2]
输出：2
```

**提示：**

- `2 <= values.length <= 5 * 10^4`

- `1 <= values[i] <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以从左到右枚举 $j$，同时维护 $j$ 左侧元素中 $values[i] + i$ 的最大值 $mx$，这样对于每个 $j$，最大得分为 $mx + values[j] - j$。我们取所有位置的最大得分的最大值即为答案。

时间复杂度 $O(n)$，其中 $n$ 为数组 $\textit{values}$ 的长度。空间复杂度 $O(1)$。

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
// Best Sightseeing Pair：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxScoreSightseeingPair(values []int) (ans int) {
	mx := 0
	for j, x := range values {
		ans = max(ans, mx+x-j)
		mx = max(mx, x+j)
	}
	return
}
```

### Java

```java
// Best Sightseeing Pair：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxScoreSightseeingPair(int[] values) {
        int ans = 0, mx = 0;
        for (int j = 0; j < values.length; ++j) {
            ans = Math.max(ans, mx + values[j] - j);
            mx = Math.max(mx, values[j] + j);
        }
        return ans;
    }
}
```

### Python

```python
# Best Sightseeing Pair：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxScoreSightseeingPair(self, values: List[int]) -> int:
        ans = mx = 0
        for j, x in enumerate(values):
            ans = max(ans, mx + x - j)
            mx = max(mx, x + j)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

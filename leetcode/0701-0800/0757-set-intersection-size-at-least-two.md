# 0757. Set Intersection Size At Least Two

---
编号: 757
题目: Set Intersection Size At Least Two
难度: 困难
标签: [贪心, 数组, 排序]
来源链接: https://leetcode.com/problems/set-intersection-size-at-least-two/
---

## 题目描述

给你一个二维整数数组 `intervals` ，其中 `intervals[i] = [starti, endi]` 表示从 `starti` 到 `endi` 的所有整数，包括 `starti` 和 `endi` 。

**包含集合** 是一个名为 `nums` 的数组，并满足 `intervals` 中的每个区间都 **至少** 有 **两个** 整数在 `nums` 中。

- 例如，如果 `intervals = [[1,3], [3,7], [8,9]]` ，那么 `[1,2,4,7,8,9]` 和 `[2,3,4,8,9]` 都符合 **包含集合** 的定义。

返回包含集合可能的最小大小。

示例 1：

```text
输入：intervals = [[1,3],[3,7],[8,9]]
输出：5
解释：nums = [2, 3, 4, 8, 9].
可以证明不存在元素数量为 4 的包含集合。
```

示例 2：

```text
输入：intervals = [[1,3],[1,4],[2,5],[3,5]]
输出：3
解释：nums = [2, 3, 4].
可以证明不存在元素数量为 2 的包含集合。
```

示例 3：

```text
输入：intervals = [[1,2],[2,3],[2,4],[4,5]]
输出：5
解释：nums = [1, 2, 3, 4, 5].
可以证明不存在元素数量为 4 的包含集合。
```

**提示：**

- `1 i i <= 10^8`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们希望在数轴上选出尽可能少的整数点，使得每个区间都至少包含两个点。一个经典而有效的策略是按照区间的右端点进行排序，并尽量让已选取的点位于区间的右侧，以便这些点能覆盖更多后续区间。

首先将所有区间按照如下规则排序：

1. 按右端点从小到大；
2. 若右端点相同，按左端点从大到小。

这样排序的原因是：右端点越小的区间“可操作空间”越少，应优先满足；当右端点相同时，左端点更大的区间更窄，更应优先被处理。

随后，我们使用两个变量 $s$ 和 $e$ 分别记录当前所有已处理区间所共同拥有的 **倒数第二个点** 和 **最后一个点**。初始时 $s = e = -1$，表示还没有放置任何点。

接下来依次处理排序后的区间 $[a, b]$，根据它与 $\{s, e\}$ 的关系分三种情况讨论：

1. **若 $a \leq s$**：
   当前区间已包含 $s$ 和 $e$ 两个点，无需额外放点。

2. **若 $s < a \leq e$**：
   当前区间只包含一个点（即 $e$），还需要补一个点。为了让新点对后续区间最有帮助，我们选择在区间最右侧的点 $b$。此时更新 $\textit{ans} = \textit{ans} + 1$，并将新的两点设为 $\{e, b\}$。

3. **若 $a > e$**：
   当前区间完全不包含已有的两个点，需要补两个点。最优选择是在区间最右侧放置 $\{b - 1, b\}$。此时更新 $\textit{ans} = \textit{ans} + 2$，并将新的两点设为 $\{b - 1, b\}$。

最终返回总共放置的点数 $\textit{ans}$。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(\log n)$。其中 $n$ 为区间的数量。

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
// Set Intersection Size At Least Two：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func intersectionSizeTwo(intervals [][]int) int {
	sort.Slice(intervals, func(i, j int) bool {
		a, b := intervals[i], intervals[j]
		if a[1] == b[1] {
			return a[0] > b[0]
		}
		return a[1] < b[1]
	})
	ans := 0
	s, e := -1, -1
	for _, v := range intervals {
		a, b := v[0], v[1]
		if a <= s {
			continue
		}
		if a > e {
			ans += 2
			s, e = b-1, b
		} else {
			ans += 1
			s, e = e, b
		}
	}
	return ans
}
```

### Java

```java
// Set Intersection Size At Least Two：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int intersectionSizeTwo(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[1] == b[1] ? b[0] - a[0] : a[1] - b[1]);
        int ans = 0;
        int s = -1, e = -1;
        for (int[] v : intervals) {
            int a = v[0], b = v[1];
            if (a <= s) {
                continue;
            }
            if (a > e) {
                ans += 2;
                s = b - 1;
                e = b;
            } else {
                ans += 1;
                s = e;
                e = b;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Set Intersection Size At Least Two：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def intersectionSizeTwo(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda x: (x[1], -x[0]))
        s = e = -1
        ans = 0
        for a, b in intervals:
            if a <= s:
                continue
            if a > e:
                ans += 2
                s, e = b - 1, b
            else:
                ans += 1
                s, e = e, b
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

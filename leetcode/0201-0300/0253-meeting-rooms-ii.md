# 0253. Meeting Rooms II

---
编号: 253
题目: Meeting Rooms II
难度: 中等
标签: [贪心, 数组, 双指针, 前缀和, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/meeting-rooms-ii/
---

## 题目描述

给你一个会议时间安排的数组 `intervals` ，每个会议时间都会包括开始和结束的时间 `intervals[i] = [starti, endi]` ，返回 *所需会议室的最小数量* 。

**示例 1：**

```text
输入：intervals = [[0,30],[5,10],[15,20]]
输出：2
```

**示例 2：**

```text
输入：intervals = [[7,10],[2,4]]
输出：1
```

**提示：**

- `1 i i <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 双指针, 前缀和, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用差分数组来实现。

我们首先找到所有会议的最大结束时间，记为 $m$，然后创建一个长度为 $m + 1$ 的差分数组 $d$，将每个会议的开始时间和结束时间分别加到差分数组的对应位置上，即 $d[l] = d[l] + 1$，而 $d[r] = d[r] - 1$。

然后，我们计算差分数组的前缀和，找出前缀和的最大值，即为所需会议室的最小数量。

时间复杂度 $O(n + m)$，空间复杂度 $O(m)$。其中 $n$ 和 $m$ 分别为会议数量和最大结束时间。

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
// Meeting Rooms II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minMeetingRooms(intervals [][]int) (ans int) {
	m := 0
	for _, e := range intervals {
		m = max(m, e[1])
	}

	d := make([]int, m+1)
	for _, e := range intervals {
		d[e[0]]++
		d[e[1]]--
	}

	s := 0
	for _, v := range d {
		s += v
		ans = max(ans, s)
	}
	return
}
```

### Java

```java
import java.util.*;
// Meeting Rooms II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int minMeetingRooms(int[][] intervals) {
        int m = 0;
        for (var e : intervals) {
            m = Math.max(m, e[1]);
        }
        int[] d = new int[m + 1];
        for (var e : intervals) {
            ++d[e[0]];
            --d[e[1]];
        }
        int ans = 0, s = 0;
        for (int v : d) {
            s += v;
            ans = Math.max(ans, s);
        }
        return ans;
    }
}
```

### Python

```python
# Meeting Rooms II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        m = max(e[1] for e in intervals)
        d = [0] * (m + 1)
        for l, r in intervals:
            d[l] += 1
            d[r] -= 1
        ans = s = 0
        for v in d:
            s += v
            ans = max(ans, s)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

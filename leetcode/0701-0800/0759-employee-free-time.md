# 0759. Employee Free Time

---
编号: 759
题目: Employee Free Time
难度: 困难
标签: [数组, 排序, 扫描线, 堆（优先队列）]
来源链接: https://leetcode.com/problems/employee-free-time/
---

## 题目描述

给定员工的 `schedule` 列表，表示每个员工的工作时间。

每个员工都有一个非重叠的时间段  `Intervals` 列表，这些时间段已经排好序。

返回表示 *所有 *员工的 **共同，正数长度的空闲时间 **的有限时间段的列表，同样需要排好序。

**示例 1：**

```text
输入：schedule = [[[1,2],[5,6]],[[1,3]],[[4,10]]]
输出：[[3,4]]
解释：
共有 3 个员工，并且所有共同的
空间时间段是 [-inf, 1], [3, 4], [10, inf]。
我们去除所有包含 inf 的时间段，因为它们不是有限的时间段。
```

**示例 2：**

```text
输入：schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]
输出：[[5,6],[7,9]]
```

（尽管我们用 `[x, y]` 的形式表示 `Intervals` ，内部的对象是 `Intervals` 而不是列表或数组。例如，`schedule[0][0].start = 1, schedule[0][0].end = 2`，并且 `schedule[0][0][0]` 是未定义的）

而且，答案中不包含 [5, 5] ，因为长度为 0。

**注：**

- `schedule` 和 `schedule[i]` 为长度范围在 `[1, 50]`的列表。

- `0

**注：**输入类型于 2019 年 4 月 15 日 改变。请重置为默认代码的定义以获取新方法。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 排序, 扫描线, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以将所有员工的工作时间区间合并成一个列表，然后对该列表进行排序并合并重叠的区间。最后，遍历合并后的区间列表，找出相邻区间之间的空闲时间段。

时间复杂度 $O(m \times n \times \log(m \times n))$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别为员工数量和每个员工的工作时间区间数量。

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
// Employee Free Time：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * Definition for an Interval.
 * type Interval struct {
 *     Start int
 *     End   int
 * }
 */

func employeeFreeTime(schedule [][]*Interval) []*Interval {
	var intervals []*Interval
	for _, e := range schedule {
		intervals = append(intervals, e...)
	}

	sort.Slice(intervals, func(i, j int) bool {
		if intervals[i].Start == intervals[j].Start {
			return intervals[i].End < intervals[j].End
		}
		return intervals[i].Start < intervals[j].Start
	})

	merged := []*Interval{intervals[0]}
	for _, cur := range intervals[1:] {
		last := merged[len(merged)-1]
		if last.End < cur.Start {
			merged = append(merged, cur)
		} else if cur.End > last.End {
			last.End = cur.End
		}
	}

	var ans []*Interval
	for i := 1; i < len(merged); i++ {
		a, b := merged[i-1], merged[i]
		ans = append(ans, &Interval{Start: a.End, End: b.Start})
	}

	return ans
}
```

### Java

```java
// Employee Free Time：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/*
// Definition for an Interval.
class Interval {
    public int start;
    public int end;

    public Interval() {}

    public Interval(int _start, int _end) {
        start = _start;
        end = _end;
    }
};
*/

class Solution {
    public List<Interval> employeeFreeTime(List<List<Interval>> schedule) {
        List<Interval> intervals = new ArrayList<>();
        for (List<Interval> e : schedule) {
            intervals.addAll(e);
        }

        intervals.sort((a, b) -> a.start == b.start ? a.end - b.end : a.start - b.start);

        List<Interval> merged = new ArrayList<>();
        merged.add(intervals.get(0));
        for (int i = 1; i < intervals.size(); ++i) {
            Interval last = merged.get(merged.size() - 1);
            Interval cur = intervals.get(i);
            if (last.end < cur.start) {
                merged.add(cur);
            } else {
                last.end = Math.max(last.end, cur.end);
            }
        }

        List<Interval> ans = new ArrayList<>();
        for (int i = 1; i < merged.size(); ++i) {
            Interval a = merged.get(i - 1);
            Interval b = merged.get(i);
            ans.add(new Interval(a.end, b.start));
        }

        return ans;
    }
}
```

### Python

```python
# Employee Free Time：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
"""
# Definition for an Interval.
class Interval:
    def __init__(self, start: int = None, end: int = None):
        self.start = start
        self.end = end
"""


class Solution:
    def employeeFreeTime(self, schedule: "[[Interval]]") -> "[Interval]":
        intervals = []
        for e in schedule:
            intervals.extend(e)
        intervals.sort(key=lambda x: (x.start, x.end))
        merged = [intervals[0]]
        for x in intervals[1:]:
            if merged[-1].end < x.start:
                merged.append(x)
            else:
                merged[-1].end = max(merged[-1].end, x.end)
        ans = []
        for a, b in pairwise(merged):
            ans.append(Interval(a.end, b.start))
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

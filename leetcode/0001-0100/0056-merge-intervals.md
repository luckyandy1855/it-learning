# 0056. Merge Intervals

---
编号: 56
题目: Merge Intervals
难度: 中等
标签: [数组, 排序]
来源链接: https://leetcode.com/problems/merge-intervals/
---

## 题目描述

给定一个区间数组 `intervals`，其中 `intervals[i] = [start_i, end_i]`，合并所有**重叠**的区间，返回合并后不重叠的区间数组。

### Example 1

```text
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: [1,3] 和 [2,6] 重叠，合并为 [1,6]
```

### Example 2

```text
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: [1,4] 和 [4,5] 端点相接，视为重叠
```

### 约束条件

- `1 <= intervals.length <= 10^4`
- `intervals[i].length == 2`
- `0 <= start_i <= end_i <= 10^4`

## 思路分析

### 突破口

按起点排序后，重叠区间一定相邻——只需线性扫描，将当前区间与结果末尾区间比较是否可合并。

### 思路拆解

1. **按起点排序**：`intervals.sort(key=lambda x: x[0])`。

2. **线性合并**：维护结果列表，取最后一个区间 `last`；若当前区间起点 `<= last[1]`（重叠或相接），更新 `last[1] = max(last[1], cur[1])`；否则追加新区间。

3. **端点相接算重叠**：`[1,4]` 和 `[4,5]` 中 `4 <= 4`，条件成立。

### 示意图

```text
排序后: [1,3] [2,6] [8,10] [15,18]

result = [[1,3]]
[2,6]: 2<=3 → 合并 → result = [[1,6]]
[8,10]: 8>6  → 追加 → result = [[1,6],[8,10]]
[15,18]: 15>10 → 追加 → result = [[1,6],[8,10],[15,18]]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 排序 + 线性扫描 | O(n log n) | O(n) |

## 代码实现

### Go

```go
import "sort"

// merge 合并所有重叠区间并返回
func merge(intervals [][]int) [][]int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })

    result := [][]int{intervals[0]}

    for _, cur := range intervals[1:] {
        last := result[len(result)-1]
        if cur[0] <= last[1] { // 重叠或相接
            if cur[1] > last[1] {
                last[1] = cur[1] // 扩展右端点
            }
        } else {
            result = append(result, cur)
        }
    }
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 合并所有重叠区间并返回。
     */
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> result = new ArrayList<>();
        result.add(intervals[0]);

        for (int i = 1; i < intervals.length; i++) {
            int[] last = result.get(result.size() - 1);
            int[] cur = intervals[i];
            if (cur[0] <= last[1]) {
                last[1] = Math.max(last[1], cur[1]); // 合并
            } else {
                result.add(cur);
            }
        }
        return result.toArray(new int[0][]);
    }
}
```

### Python

```python
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        """
        合并所有重叠区间并返回。
        """
        intervals.sort(key=lambda x: x[0])
        result = [intervals[0]]

        for start, end in intervals[1:]:
            if start <= result[-1][1]:  # 重叠或相接
                result[-1][1] = max(result[-1][1], end)
            else:
                result.append([start, end])

        return result
```

## 踩坑记录

- **合并时取 max 而非直接赋值**：`[1,10]` 和 `[2,5]` 中 `5 < 10`，直接赋 5 会缩小区间，必须 `max(last[1], cur[1])`。
- **排序后才能线性合并**：未排序时重叠区间可能不相邻，线性扫描会漏掉非相邻重叠。
- **Java 返回 `int[][]`**：用 `result.toArray(new int[0][])` 将 `List<int[]>` 转为二维数组，`new int[0][]` 是类型模板，不影响性能。

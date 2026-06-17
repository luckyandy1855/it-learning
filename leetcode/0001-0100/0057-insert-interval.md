# 0057. Insert Interval

---
编号: 57
题目: Insert Interval
难度: 中等
标签: [数组]
来源链接: https://leetcode.com/problems/insert-interval/
---

## 题目描述

给定一个**已按起点升序排列且不重叠**的区间数组 `intervals`，再给定一个新区间 `newInterval = [start, end]`，将新区间插入到 `intervals` 中，合并所有重叠区间后返回结果数组。

### Example 1

```text
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
```

### Example 2

```text
Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output: [[1,2],[3,10],[12,16]]
Explanation: 新区间与 [3,5],[6,7],[8,10] 重叠，合并成 [3,10]
```

### 约束条件

- `0 <= intervals.length <= 10^4`
- `intervals[i].length == 2`
- `intervals` 已按 `start_i` 升序排列且各区间不重叠
- `newInterval.length == 2`

## 思路分析

### 突破口

线性扫描，分三个阶段：① 不重叠的前缀直接加入结果；② 与 `newInterval` 重叠的区间不断合并；③ 不重叠的后缀直接加入结果。

### 思路拆解

1. **前缀**：当前区间的 `end < newInterval[0]`（在新区间左侧不重叠），直接加入结果。

2. **重叠合并**：当前区间的 `start <= newInterval[1]`（存在重叠），扩展 `newInterval` 的两端。

3. **后缀**：将合并后的 `newInterval` 追加，再把剩余区间全部追加。

### 示意图

```text
intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]

阶段1（前缀）:  [1,2] → end(2) < 4, 直接加入
阶段2（重叠）:  [3,5] → start(3)<=8, merge: new=[3,8]
                [6,7] → start(6)<=8, merge: new=[3,8]
                [8,10]→ start(8)<=8, merge: new=[3,10]
阶段2→追加:    加入 [3,10]
阶段3（后缀）:  [12,16] → 追加

结果: [[1,2],[3,10],[12,16]]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 线性扫描 | O(n) | O(n) |

## 代码实现

### Go

```go
// insert 将 newInterval 插入 intervals 并合并重叠区间
func insert(intervals [][]int, newInterval []int) [][]int {
    result := [][]int{}
    i, n := 0, len(intervals)

    // 阶段1：不重叠的前缀
    for i < n && intervals[i][1] < newInterval[0] {
        result = append(result, intervals[i])
        i++
    }

    // 阶段2：合并重叠区间
    for i < n && intervals[i][0] <= newInterval[1] {
        if intervals[i][0] < newInterval[0] {
            newInterval[0] = intervals[i][0]
        }
        if intervals[i][1] > newInterval[1] {
            newInterval[1] = intervals[i][1]
        }
        i++
    }
    result = append(result, newInterval)

    // 阶段3：不重叠的后缀
    for i < n {
        result = append(result, intervals[i])
        i++
    }
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 将 newInterval 插入 intervals 并合并重叠区间。
     */
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0, n = intervals.length;

        // 阶段1：前缀
        while (i < n && intervals[i][1] < newInterval[0])
            result.add(intervals[i++]);

        // 阶段2：合并
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval);

        // 阶段3：后缀
        while (i < n) result.add(intervals[i++]);

        return result.toArray(new int[0][]);
    }
}
```

### Python

```python
class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        """
        将 newInterval 插入 intervals 并合并重叠区间。
        """
        result = []
        i, n = 0, len(intervals)

        # 阶段1：前缀（在新区间左侧不重叠）
        while i < n and intervals[i][1] < newInterval[0]:
            result.append(intervals[i])
            i += 1

        # 阶段2：合并重叠区间
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i += 1
        result.append(newInterval)

        # 阶段3：后缀
        result.extend(intervals[i:])
        return result
```

## 踩坑记录

- **重叠条件 `start <= newInterval[1]`**：等号不能漏，`[4,5]` 和 `[5,8]` 是相接重叠。
- **`intervals` 为空时**：直接返回 `[newInterval]`，三个阶段的 while 循环都不进入，`result` 只含 `newInterval`，自然处理。
- **修改 `newInterval` 原地**：Java/Python 修改传入的 `newInterval` 数组是安全的，但若需要保留原始输入，可先复制一份。

# 1229. Meeting Scheduler

---
编号: 1229
题目: Meeting Scheduler
难度: 中等
标签: [数组, 双指针, 排序]
来源链接: https://leetcode.com/problems/meeting-scheduler/
---

## 题目描述

给定两个人的空闲时间表：`slots1` 和 `slots2`，以及会议的预计持续时间 `duration`，请你为他们安排 **时间段最早 且**合适的会议时间。

如果没有满足要求的会议时间，就请返回一个 **空数组**。

「空闲时间」的格式是 `[start, end]`，由开始时间 `start` 和结束时间 `end` 组成，表示从 `start` 开始，到 `end` 结束。

题目保证数据有效：同一个人的空闲时间不会出现交叠的情况，也就是说，对于同一个人的两个空闲时间 `[start1, end1]` 和 `[start2, end2]`，要么 `start1 > end2`，要么 `start2 > end1`。

**示例 1：**

```text
输入：slots1 = [[10,50],[60,120],[140,210]], slots2 = [[0,15],[60,70]], duration = 8
输出：[60,68]
```

**示例 2：**

```text
输入：slots1 = [[10,50],[60,120],[140,210]], slots2 = [[0,15],[60,70]], duration = 12
输出：[]
```

**提示：**

- `1 <= slots1.length, slots2.length <= 10^4`

- `slots1[i].length, slots2[i].length == 2`

- `slots1[i][0] < slots1[i][1]`

- `slots2[i][0] < slots2[i][1]`

- `0 <= slots1[i][j], slots2[i][j] <= 10^9`

- `1 <= duration <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以将两个人的空闲时间分别排序，然后使用双指针遍历两个数组，找到两个人的空闲时间段的交集，如果交集的长度大于等于 `duration`，则返回交集的起始时间和起始时间加上 `duration`。否则，如果第一个人的空闲时间段的结束时间小于第二个人的空闲时间段的结束时间，我们就移动第一个人的指针，否则移动第二个人的指针。继续遍历，直到找到满足条件的时间段或者遍历结束。

时间复杂度 $O(m \times \log m + n \times \log n)$，空间复杂度 $O(\log m + \log n)$。其中 $m$ 和 $n$ 分别为两个数组的长度。

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
// Meeting Scheduler：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minAvailableDuration(slots1 [][]int, slots2 [][]int, duration int) []int {
	sort.Slice(slots1, func(i, j int) bool { return slots1[i][0] < slots1[j][0] })
	sort.Slice(slots2, func(i, j int) bool { return slots2[i][0] < slots2[j][0] })
	i, j, m, n := 0, 0, len(slots1), len(slots2)
	for i < m && j < n {
		start := max(slots1[i][0], slots2[j][0])
		end := min(slots1[i][1], slots2[j][1])
		if end-start >= duration {
			return []int{start, start + duration}
		}
		if slots1[i][1] < slots2[j][1] {
			i++
		} else {
			j++
		}
	}
	return []int{}
}
```

### Java

```java
// Meeting Scheduler：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> minAvailableDuration(int[][] slots1, int[][] slots2, int duration) {
        Arrays.sort(slots1, (a, b) -> a[0] - b[0]);
        Arrays.sort(slots2, (a, b) -> a[0] - b[0]);
        int m = slots1.length, n = slots2.length;
        int i = 0, j = 0;
        while (i < m && j < n) {
            int start = Math.max(slots1[i][0], slots2[j][0]);
            int end = Math.min(slots1[i][1], slots2[j][1]);
            if (end - start >= duration) {
                return Arrays.asList(start, start + duration);
            }
            if (slots1[i][1] < slots2[j][1]) {
                ++i;
            } else {
                ++j;
            }
        }
        return Collections.emptyList();
    }
}
```

### Python

```python
# Meeting Scheduler：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minAvailableDuration(
        self, slots1: List[List[int]], slots2: List[List[int]], duration: int
    ) -> List[int]:
        slots1.sort()
        slots2.sort()
        m, n = len(slots1), len(slots2)
        i = j = 0
        while i < m and j < n:
            start = max(slots1[i][0], slots2[j][0])
            end = min(slots1[i][1], slots2[j][1])
            if end - start >= duration:
                return [start, start + duration]
            if slots1[i][1] < slots2[j][1]:
                i += 1
            else:
                j += 1
        return []
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

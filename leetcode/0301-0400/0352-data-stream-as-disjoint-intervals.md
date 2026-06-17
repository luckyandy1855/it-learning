# 0352. Data Stream as Disjoint Intervals

---
编号: 352
题目: Data Stream as Disjoint Intervals
难度: 困难
标签: [并查集, 设计, 哈希表, 二分查找, 数据流, 有序集合]
来源链接: https://leetcode.com/problems/data-stream-as-disjoint-intervals/
---

## 题目描述

给你一个由非负整数组成的数据流输入 `a1, a2, ..., an`，请你将目前为止看到的数字汇总为一组不相交的区间列表。

实现 `SummaryRanges` 类：

	- `SummaryRanges()` 初始化一个空的数据流对象。

	- `void addNum(int value)` 将整数 `value` 添加到数据流中。

	- `int[][] getIntervals()` 返回当前数据流中的整数汇总为一组不相交的区间列表 `[starti, endi]`。答案应按 `starti` 升序排序。

示例 1：

```text
输入
["SummaryRanges", "addNum", "getIntervals", "addNum", "getIntervals", "addNum", "getIntervals", "addNum", "getIntervals", "addNum", "getIntervals"]
[[], [1], [], [3], [], [7], [], [2], [], [6], []]
输出
[null, null, [[1, 1]], null, [[1, 1], [3, 3]], null, [[1, 1], [3, 3], [7, 7]], null, [[1, 3], [7, 7]], null, [[1, 3], [6, 7]]]

解释
SummaryRanges summaryRanges = new SummaryRanges();
summaryRanges.addNum(1);      // arr = [1]
summaryRanges.getIntervals(); // 返回 [[1, 1]]
summaryRanges.addNum(3);      // arr = [1, 3]
summaryRanges.getIntervals(); // 返回 [[1, 1], [3, 3]]
summaryRanges.addNum(7);      // arr = [1, 3, 7]
summaryRanges.getIntervals(); // 返回 [[1, 1], [3, 3], [7, 7]]
summaryRanges.addNum(2);      // arr = [1, 2, 3, 7]
summaryRanges.getIntervals(); // 返回 [[1, 3], [7, 7]]
summaryRanges.addNum(6);      // arr = [1, 2, 3, 6, 7]
summaryRanges.getIntervals(); // 返回 [[1, 3], [6, 7]]
```

**提示：**

	- `0 <= value <= 10^4`

	- 最多会调用 `addNum` 和 `getIntervals` 方法 `3 * 10^4` 次。

	- 最多会调用 `getIntervals` 方法 `10^2` 次。

**进阶：**如果存在大量合并，并且与数据流的大小相比，不相交区间的数量很小，该怎么办?

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「并查集, 设计, 哈希表, 二分查找, 数据流, 有序集合」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Data Stream as Disjoint Intervals：维护不重叠有序区间。
// 关键点：插入 val 时合并所有与 [val,val] 相邻或重叠的区间。
type SummaryRanges struct {
	intervals [][]int
}

func Constructor() SummaryRanges {
	return SummaryRanges{intervals: [][]int{}}
}

func (this *SummaryRanges) AddNum(value int) {
	merged := []int{value, value}
	res := [][]int{}
	inserted := false

	for _, interval := range this.intervals {
		if interval[1]+1 < merged[0] {
			res = append(res, interval)
		} else if merged[1]+1 < interval[0] {
			if !inserted {
				res = append(res, merged)
				inserted = true
			}
			res = append(res, interval)
		} else {
			if interval[0] < merged[0] {
				merged[0] = interval[0]
			}
			if interval[1] > merged[1] {
				merged[1] = interval[1]
			}
		}
	}

	if !inserted {
		res = append(res, merged)
	}
	this.intervals = res
}

func (this *SummaryRanges) GetIntervals() [][]int {
	return this.intervals
}
```

### Java

```java
// Data Stream as Disjoint Intervals：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class SummaryRanges {
    private TreeMap<Integer, int[]> mp;

    public SummaryRanges() {
        mp = new TreeMap<>();
    }

    public void addNum(int val) {
        Integer l = mp.floorKey(val);
        Integer r = mp.ceilingKey(val);
        if (l != null && r != null && mp.get(l)[1] + 1 == val && mp.get(r)[0] - 1 == val) {
            mp.get(l)[1] = mp.get(r)[1];
            mp.remove(r);
        } else if (l != null && val <= mp.get(l)[1] + 1) {
            mp.get(l)[1] = Math.max(val, mp.get(l)[1]);
        } else if (r != null && val >= mp.get(r)[0] - 1) {
            mp.get(r)[0] = Math.min(val, mp.get(r)[0]);
        } else {
            mp.put(val, new int[] {val, val});
        }
    }

    public int[][] getIntervals() {
        int[][] res = new int[mp.size()][2];
        int i = 0;
        for (int[] range : mp.values()) {
            res[i++] = range;
        }
        return res;
    }
}

/**
 * Your SummaryRanges object will be instantiated and called as such:
 * SummaryRanges obj = new SummaryRanges();
 * obj.addNum(val);
 * int[][] param_2 = obj.getIntervals();
 */
```

### Python

```python
# Data Stream as Disjoint Intervals：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class SummaryRanges:
    def __init__(self):
        self.mp = SortedDict()

    def addNum(self, val: int) -> None:
        n = len(self.mp)
        ridx = self.mp.bisect_right(val)
        lidx = n if ridx == 0 else ridx - 1
        keys = self.mp.keys()
        values = self.mp.values()
        if (
            lidx != n
            and ridx != n
            and values[lidx][1] + 1 == val
            and values[ridx][0] - 1 == val
        ):
            self.mp[keys[lidx]][1] = self.mp[keys[ridx]][1]
            self.mp.pop(keys[ridx])
        elif lidx != n and val <= values[lidx][1] + 1:
            self.mp[keys[lidx]][1] = max(val, self.mp[keys[lidx]][1])
        elif ridx != n and val >= values[ridx][0] - 1:
            self.mp[keys[ridx]][0] = min(val, self.mp[keys[ridx]][0])
        else:
            self.mp[val] = [val, val]

    def getIntervals(self) -> List[List[int]]:
        return list(self.mp.values())


# # Your SummaryRanges object will be instantiated and called as such:
# # obj = SummaryRanges()
# # obj.addNum(val)
# # param_2 = obj.getIntervals()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。
